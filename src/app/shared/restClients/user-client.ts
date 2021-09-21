import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICalendarCreateResponseDto } from '../dtos/calendar-create-response-dto';
import { ICalendarEventDto } from '../dtos/calendar-event-dto';
import { IUserDto } from '../dtos/user-dto';

@Injectable({ providedIn: 'root' })
export class UserClient {
  private readonly baseUrl: string;

  constructor(private client: HttpClient) {
    this.baseUrl = environment.apiRoot;
  }

  getUserInfo(userName: string): Observable<IUserDto> {
    return this.client.get<IUserDto>(`${this.baseUrl}user/${userName}`);
  }

  createEvent(
    householdId: number,
    creatorId: number,
    title: string,
    description: string,
    color: string,
    allDay?: boolean,
    start?: Date,
    end?: Date
  ) {
    let body = {
      householdId,
      creatorId,
      start,
      end,
      title,
      description,
      color: '',
      allDay,
    };
    console.log(body);
    return this.client.post<ICalendarCreateResponseDto>(
      this.baseUrl + 'Event',
      body
    );
  }
}
