import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../core/auth-service.component';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private baseUrl = environment.apiRoot;

  constructor(private http: HttpClient, private authService: AuthService) {}

  public send_invitation(username: string, userId: number) {
    return this.http.post(`${this.baseUrl}notification`, {
      type: 'invitation',
      creatorID: userId,
      assigneeUsername: username,
    });
  }

  public leaveHousehold(userId: number) {
    return this.http.put(
      `${this.baseUrl}user/${userId}/leave-household`,
      {},
      {
        responseType: 'text',
      }
    );
  }
}
