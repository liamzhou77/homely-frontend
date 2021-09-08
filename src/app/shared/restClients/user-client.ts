import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";
import { ICalendarCreateResponseDto } from '../dtos/calendar-create-response-dto';
import { ICalendarEventDto } from '../dtos/calendar-event-dto';
import { IUserDto } from '../dtos/user-dto';

@Injectable({ providedIn: 'root' })
export class UserClient {

  private readonly baseUrl: string;

  constructor(
    private client: HttpClient
  ) {
    this.baseUrl = environment.apiRoot;
  }

  getUserInfo(userName: string): Observable<IUserDto> {
    let params = new HttpParams();
    params = params.append("username", userName);
    return this.client.get<IUserDto>(this.baseUrl + 'user', { params: params });
  }

  createEvent(householdId: number, creatorId: number, title: string, description: string, color: string, allDay?: boolean, start?: Date, end?: Date) {
    let body = {
      householdId,
      creatorId,
      start,
      end,
      title,
      description,
      color: "",
      allDay
    }
    console.log(body)
    return this.client.post<ICalendarCreateResponseDto>(this.baseUrl + "Event", body);
  }

  //getApplicantNames(accountId: number): Observable<IApplicantNameDto[]> {
  //  return this.client.get<IApplicantNameDto[]>(this.baseUrl + `/Accounts/${accountId}/ApplicantNames`);
  //}

  //getContactsInfo(accountId: number): Observable<IContactInfoDto[]> {
  //  return this.client.get<IContactInfoDto[]>(this.baseUrl + `/Accounts/${accountId}/ContactInfo`);
  //}

  //getContactInfo(accountId: number, debtorId: number): Observable<IContactInfoDto> {
  //  return this.client.get<IContactInfoDto>(this.baseUrl + `/Accounts/${accountId}/Debtors/${debtorId}/ContactInfo`);
  //}

  //getApplicant(accountId: number, debtorId: number): Observable<IApplicantDto> {
  //  return this.client.get<IApplicantDto>(this.baseUrl + `/Accounts/${accountId}/Debtors/${debtorId}`);
  //}

  //getApplicationId(accountId: number): Observable<string> {
  //  return this.client.get<string>(this.baseUrl + `/Accounts/${accountId}/ApplicationId`);
  //}

  //updateContactInfo(accountId: number, debtorId: number, contactInfo: IContactInfoDto, reason: string): Observable<any> {
  //  let params = new HttpParams(); if (reason)
  //    params = params.append("reason", reason);

  //  return this.client.put(this.baseUrl + `/Accounts/${accountId}/Debtors/${debtorId}/ContactInfo`, contactInfo, { params });
  //}

  //updateApplicant(accountId: number, debtorId: number, applicantInfo: IApplicantDto, reason: string): Observable<any> {
  //  let params = new HttpParams();
  //  if (reason)
  //    params = params.append("reason", reason);
  //  const httpOptions = { params: params };

  //  return this.client.put(this.baseUrl + `/Accounts/${accountId}/Debtors/${debtorId}`, applicantInfo, httpOptions);
}