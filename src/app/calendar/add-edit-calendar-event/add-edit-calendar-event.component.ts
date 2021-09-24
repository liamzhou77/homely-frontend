import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarApi, DateSelectArg, EventApi, EventSourceApi } from '@fullcalendar/angular';
import format from 'date-fns/format';
import { AuthService } from '../../core/auth-service.component';
import { ICalendarEventDto } from '../../shared/dtos/calendar-event-dto';
import { IUserDto } from '../../shared/dtos/user-dto';
import { CalendarClient } from '../../shared/restClients/calendar-client';
import { HouseholdClient } from '../../shared/restClients/household-client';

@Component({
  selector: 'app-add-edit-calendar-event',
  templateUrl: './add-edit-calendar-event.component.html',
  styleUrls: ['./add-edit-calendar-event.component.css']
})
export class AddEditCalendarEventComponent implements OnInit {

  event: ICalendarEventDto;
  myDatePicker: NgxMatDatetimePicker<Date>;
  eventForm: FormGroup;
  selectedColor: string = "#33658A";
  householdMembers: IUserDto[]; //temp
  householdId: number;
  userId: number;


  constructor(@Inject(MAT_DIALOG_DATA) public data: DateSelectArg,
    private dialogRef: MatDialogRef<AddEditCalendarEventComponent>,
    private calendarClient: CalendarClient,
    private authService: AuthService,
    private householdClient: HouseholdClient) {
    this.authService.userInfoChanged.subscribe(userInfo => {
      this.householdId = userInfo.householdID;
      this.userId = userInfo.userID;
      this.householdClient.getHouseholdMembers(userInfo.householdID).subscribe(members => {
        this.householdMembers = members;
      })
    })

  }

  ngOnInit(): void {
    this.eventForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      allDay: new FormControl(false),
      color: new FormControl(this.selectedColor, Validators.required),
      assignees: new FormControl([this.userId], Validators.required)
    });
    this.eventForm.controls.start.setValue(format(this.data.start, "yyyy-MM-dd'T'HH:mm"));
    this.eventForm.controls.end.setValue(format(this.data.end, "yyyy-MM-dd'T'HH:mm"));
    this.eventForm.valueChanges.subscribe(() => {
      this.selectedColor = this.eventForm.controls.color.value;
    })
  }

  submitEvent(): void {

    this.event = {
      householdId: this.householdId,
      creatorId: this.userId,
      start: this.eventForm.controls.start.value,
      end: this.eventForm.controls.end.value,
      allDay: this.eventForm.controls.allDay.value, 
      title: this.eventForm.controls.title.value,
      description: this.eventForm.controls.description.value,
      color: this.selectedColor,
      assignees: this.eventForm.controls.assignees.value
    }

    this.calendarClient.createEvent(this.householdId, this.userId, this.event.assignees, this.event.title, this.event.description, this.event.color, this.event.allDay, this.event.start, this.event.end).subscribe(response => {
      this.event.eventId = response.id;
      this.dialogRef.close();
    })
  }

  changeColor(): void {
    this.selectedColor = this.eventForm.controls.color.value;
  }

}
