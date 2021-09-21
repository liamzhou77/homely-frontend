import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUserDto } from '../dtos/user-dto';


@Injectable({ providedIn: 'root' })
export class HouseholdClient {
  private readonly baseUrl: string;

  constructor(private client: HttpClient) {
    this.baseUrl = environment.apiRoot;
  }

  getHouseholdMembers(householdId: number): Observable<IUserDto[]> {
    return this.client.get<IUserDto[]>(`${this.baseUrl}household/${householdId}/members`);
  }
}
