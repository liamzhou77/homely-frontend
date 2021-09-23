import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from './notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseUrl = environment.apiRoot;

  constructor(private http: HttpClient) {}

  public get_notifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.baseUrl}notifications/invitations/${userId}`
    );
  }

  public accept_invitation(notificationId: number) {
    return this.http.post(
      `${this.baseUrl}notification/invitation/${notificationId}/accept`,
      {}
    );
  }

  public delete_notification(notificationId: number) {
    return this.http.delete(`${this.baseUrl}notification/${notificationId}`, {
      responseType: 'text',
    });
  }
}
