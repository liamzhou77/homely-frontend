import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AddEditCalendarEventComponent } from './add-edit-calendar-event/add-edit-calendar-event.component';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { EditCalendarEventComponent } from './edit-calendar-event/edit-calendar-event.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
]);

@NgModule({
  declarations: [
    CalendarComponent,
    AddEditCalendarEventComponent,
    EditCalendarEventComponent,
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FullCalendarModule,

    FormsModule,
    ReactiveFormsModule,

    MatDatepickerModule,
    MatInputModule,
    MatButtonToggleModule,
    MatOptionModule,
    MatDialogModule,

    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
  ],
  providers: [],
})
export class CalendarModule {}
