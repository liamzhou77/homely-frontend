import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput, EventSourceInput, FullCalendarComponent } from '@fullcalendar/angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from '../core/auth-service.component';
import { ICalendarEventDto } from '../shared/dtos/calendar-event-dto';
import { IUserDto } from '../shared/dtos/user-dto';
import { CalendarClient } from '../shared/restClients/calendar-client';
import { HouseholdClient } from '../shared/restClients/household-client';
import { AddEditCalendarEventComponent } from './add-edit-calendar-event/add-edit-calendar-event.component';
import { EditCalendarEventComponent } from './edit-calendar-event/edit-calendar-event.component';
import { INITIAL_EVENTS, createEventId } from './event-utils';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, AfterViewInit {

  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent;


  retrievedEvents: EventInput[] = [];
  currentEvents: EventApi[] = []; //call to api to get events
  householdId: number;
  userId: number;
  householdMembers: IUserDto[] = [];
  membersOfDisplayedEvents: number[] = [];
  filterEventsForm: FormGroup;
  sharedByAll: boolean = false;


  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: this.retrievedEvents, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),

    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  }







  constructor(private modalService: MatDialog, private calendarClient: CalendarClient, private authService: AuthService, private householdClient: HouseholdClient) {
    this.filterEventsForm = new FormGroup({
      displayedMembers: new FormControl()
    })
    this.authService.userInfoChanged.subscribe(userInfo => {
      this.householdId = userInfo.householdID;
      this.userId = userInfo.userID;
      this.householdClient.getHouseholdMembers(userInfo.householdID).subscribe(members => {
        this.householdMembers = members;
        this.householdMembers.forEach(member => {
          this.membersOfDisplayedEvents.push(member.userID);
        })
        this.filterEventsForm.controls.displayedMembers.setValue(this.membersOfDisplayedEvents);
      })
    })


  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.calendarClient.getEvents(this.userId, this.householdId).subscribe(events => {
      events.forEach(event => {
        this.calendarComponent.getApi().addEvent({
          id: event.eventId.toString(),
          householdId: event.householdId,
          creatorId: event.creatorId,
          title: event.title,
          start: event.start,
          end: event.end,
          description: event.description,
          color: event.color,
          allDay: event.allDay,
          assignees: event.assignees
        })
      })

    })
  }

  changeDisplayedEvents() {

    this.calendarComponent.getApi().removeAllEvents();

    this.calendarClient.getEvents(this.userId, this.householdId).subscribe(events => {
      events.forEach(event => {
        if (!this.sharedByAll) {
          if (event.assignees.some(a => this.filterEventsForm.controls.displayedMembers.value.includes(a))) {
           
            this.calendarComponent.getApi().addEvent({
              id: event.eventId.toString(),
              householdId: event.householdId,
              creatorId: event.creatorId,
              title: event.title,
              start: event.start,
              end: event.end,
              description: event.description,
              color: event.color,
              allDay: event.allDay,
              assignees: event.assignees
            })
          }
        }
        else {

          if (this.filterEventsForm.controls.displayedMembers.value.every((a: number) => event.assignees.includes(a))) {

            this.calendarComponent.getApi().addEvent({
              id: event.eventId.toString(),
              householdId: event.householdId,
              creatorId: event.creatorId,
              title: event.title,
              start: event.start,
              end: event.end,
              description: event.description,
              color: event.color,
              allDay: event.allDay,
              assignees: event.assignees
            })
          }

        }


      })

    })


  }



  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const modalRef = this.modalService.open(AddEditCalendarEventComponent, { data: selectInfo });
    let newEvent: ICalendarEventDto = null;
    modalRef.afterClosed().subscribe(() => {
      newEvent = modalRef.componentInstance.event;
      const calendarApi = selectInfo.view.calendar;

      calendarApi.unselect(); // clear date selection

      if (newEvent) {
        calendarApi.addEvent({
          id: newEvent.eventId.toString(),
          creatorId: newEvent.creatorId,
          householdId: newEvent.householdId,
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end,
          allDay: newEvent.allDay,
          description: newEvent.description,
          assignees: newEvent.assignees,
          color: newEvent.color
        });
      }

    });

  }

  handleEventClick(clickInfo: EventClickArg) {

    let selectedEvent: ICalendarEventDto = {
      eventId: parseInt(clickInfo.event.id),
      householdId: clickInfo.event.extendedProps.householdId,
      creatorId: clickInfo.event.extendedProps.creatorId,
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      start: new Date(clickInfo.event.start.toISOString()),
      end: new Date(clickInfo.event.end.toISOString()),
      color: clickInfo.event.backgroundColor,
      allDay: clickInfo.event.allDay,
      assignees: clickInfo.event.extendedProps.assignees
    };


    const modalRef = this.modalService.open(EditCalendarEventComponent, { data: selectedEvent });

    modalRef.afterClosed().subscribe(() => {
      selectedEvent = modalRef.componentInstance.event;

      if (selectedEvent) {
        clickInfo.event.remove();
        clickInfo.view.calendar.addEvent({
          id: selectedEvent.eventId.toString(),
          householdId: selectedEvent.householdId,
          creatorId: selectedEvent.creatorId,
          title: selectedEvent.title,
          start: selectedEvent.start,
          end: selectedEvent.end,
          allDay: selectedEvent.allDay,
          description: selectedEvent.description,
          assignees: selectedEvent.assignees,
          color: selectedEvent.color
        });
      }
      else {
        clickInfo.event.remove();
      }

    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}
