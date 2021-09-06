import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarApi, DateSelectArg, EventApi, EventClickArg, EventSourceApi } from '@fullcalendar/angular';
import format from 'date-fns/format';
import { ICalendarEventDto } from '../../shared/dtos/calendar-event-dto';
import { CalendarClient } from '../../shared/restClients/calendar-client';

@Component({
  selector: 'app-edit-calendar-event',
  templateUrl: './edit-calendar-event.component.html',
  styleUrls: ['./edit-calendar-event.component.css']
})
export class EditCalendarEventComponent implements OnInit {

  event: ICalendarEventDto;
  myDatePicker: NgxMatDatetimePicker<Date>;
  eventForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EventClickArg, private dialogRef: MatDialogRef<EditCalendarEventComponent>, private calendarClient: CalendarClient) {
  }

  ngOnInit(): void {
    this.eventForm = new FormGroup({
      title: new FormControl(),
      start: new FormControl(),
      end: new FormControl(),
      description: new FormControl()
    });
    this.eventForm.controls.start.setValue(format(this.data.event.start, "yyyy-MM-dd'T'hh:mm"));
    this.eventForm.controls.end.setValue(format(this.data.event.end, "yyyy-MM-dd'T'hh:mm"));
    this.eventForm.controls.title.setValue(this.data.event.title);
    this.eventForm.controls.description.setValue(this.data.event.extendedProps.description);

    this.event = {
      eventId: parseInt(this.data.event.id),
      householdId: this.data.event.extendedProps.householdId,
      creatorId: this.data.event.extendedProps.creatorId,
      start: this.eventForm.controls.start.value,
      end: this.eventForm.controls.end.value,
      allDay: false,
      title: this.eventForm.controls.title.value,
      description: this.eventForm.controls.description.value
    }

  }

  submitEvent(): void {

    //send api call to edit

    this.event.start = this.eventForm.controls.start.value;
    this.event.end = this.eventForm.controls.end.value;
    this.event.allDay = false;
    this.event.title = this.eventForm.controls.title.value;
    this.event.description = this.eventForm.controls.description.value;
    this.dialogRef.close();

  }

  deleteEvent(): void {
    //send api call to delete
    this.event = null;
    this.dialogRef.close();
  }

}
