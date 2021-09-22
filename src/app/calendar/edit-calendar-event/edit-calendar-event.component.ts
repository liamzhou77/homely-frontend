import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarApi, DateSelectArg, EventApi, EventClickArg, EventSourceApi } from '@fullcalendar/angular';
import format from 'date-fns/format';
import { AuthService } from '../../core/auth-service.component';
import { ICalendarEventDto } from '../../shared/dtos/calendar-event-dto';
import { IUserDto } from '../../shared/dtos/user-dto';
import { CalendarClient } from '../../shared/restClients/calendar-client';
import { HouseholdClient } from '../../shared/restClients/household-client';

@Component({
  selector: 'app-edit-calendar-event',
  templateUrl: './edit-calendar-event.component.html',
  styleUrls: ['./edit-calendar-event.component.css']
})
export class EditCalendarEventComponent implements OnInit {

  event: ICalendarEventDto;
  myDatePicker: NgxMatDatetimePicker<Date>;
  eventForm: FormGroup;
  selectedColor: string = "#33658A";
  householdMembers: IUserDto[]; //temp;
  householdId: number;
  userId: number;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ICalendarEventDto, private dialogRef: MatDialogRef<EditCalendarEventComponent>, private calendarClient: CalendarClient,
    private authService: AuthService, private householdClient: HouseholdClient) {
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
      title: new FormControl(),
      start: new FormControl(),
      end: new FormControl(),
      description: new FormControl(),
      allDay: new FormControl(),
      color: new FormControl(),
      assignees: new FormControl()
    });
    this.eventForm.controls.start.setValue(format(this.data.start, "yyyy-MM-dd'T'HH:mm"));
    this.eventForm.controls.end.setValue(format(this.data.end, "yyyy-MM-dd'T'HH:mm"));

    this.eventForm.controls.title.setValue(this.data.title);
    this.eventForm.controls.description.setValue(this.data.description);
    this.eventForm.controls.assignees.setValue(this.data.assignees);

    this.event = this.data;

    this.eventForm.valueChanges.subscribe(() => {
      this.selectedColor = this.eventForm.controls.color.value;
    })


  }

  submitEvent(): void {

    this.calendarClient.updateEvent(this.event.eventId,
      this.event.householdId,
      this.event.creatorId,
      this.event.assignees,
      this.eventForm.controls.title.value,
      this.eventForm.controls.description.value,
      this.selectedColor,
      false,
      this.eventForm.controls.start.value,
      this.eventForm.controls.end.value).subscribe(() => {
        this.event.start = this.eventForm.controls.start.value;
        this.event.end = this.eventForm.controls.end.value;
        this.event.allDay = false;
        this.event.title = this.eventForm.controls.title.value;
        this.event.description = this.eventForm.controls.description.value;
        this.event.color = this.selectedColor;
        this.dialogRef.close();

      })
  }

  deleteEvent(): void {
    this.calendarClient.deleteEvent(this.event.eventId).subscribe(() => {   
      this.event = null;
      this.dialogRef.close();
    })
  }

  changeColor(): void {
    this.selectedColor = this.eventForm.controls.color.value;
  }

}
