import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarApi, DateSelectArg, EventApi, EventSourceApi } from '@fullcalendar/angular';
import format from 'date-fns/format';
import { AuthService } from '../../core/auth-service.component';
import { ICalendarEventDto } from '../../shared/dtos/calendar-event-dto';
import { CalendarClient } from '../../shared/restClients/calendar-client';

@Component({
  selector: 'app-add-edit-calendar-event',
  templateUrl: './add-edit-calendar-event.component.html',
  styleUrls: ['./add-edit-calendar-event.component.css']
})
export class AddEditCalendarEventComponent implements OnInit {

  event: ICalendarEventDto;
  myDatePicker: NgxMatDatetimePicker<Date>;
  eventForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DateSelectArg,
    private dialogRef: MatDialogRef<AddEditCalendarEventComponent>,
    private calendarClient: CalendarClient,
    private authService: AuthService) {
    console.log(data)
  }

  ngOnInit(): void {
    this.eventForm = new FormGroup({
      title: new FormControl(),
      start: new FormControl(),
      end: new FormControl(),
      description: new FormControl()
    });
    this.eventForm.controls.start.setValue(format(this.data.start, "yyyy-MM-dd'T'hh:mm"));
    this.eventForm.controls.end.setValue(format(this.data.end, "yyyy-MM-dd'T'hh:mm"));
  }

  submitEvent(): void {

    this.event = {
      householdId: 1,
      creatorId: 11,
      start: this.eventForm.controls.start.value,
      end: this.eventForm.controls.end.value,
      allDay: false,
      title: this.eventForm.controls.title.value,
      description: this.eventForm.controls.description.value
    }

    this.calendarClient.createEvent(this.authService.householdId, this.authService.userId, this.event.title, this.event.description, this.event.color, this.event.allDay, this.event.start, this.event.end).subscribe(response => {
      this.event.eventId = response.id;
      this.dialogRef.close();
    })

  }

}
