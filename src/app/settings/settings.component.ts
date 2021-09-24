import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../core/auth-service.component';
import { IUserDto } from '../shared/dtos/user-dto';
import { HouseholdClient } from '../shared/restClients/household-client';
import { SettingService } from './setting.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  public invite_username: string;
  private userId: number;
  public householdMembers: IUserDto[];

  constructor(
    private snackBar: MatSnackBar,
    private settingService: SettingService,
    private authService: AuthService,
    private householdClient: HouseholdClient
  ) {
    this.authService.userInfoChanged.subscribe((userInfo) => {
      this.userId = userInfo.userID;
      this.householdClient
        .getHouseholdMembers(userInfo.householdID)
        .subscribe((members) => {
          this.householdMembers = members;
        });
    });
  }

  ngOnInit(): void {}

  public invite() {
    if (this.invite_username) {
      this.settingService
        .send_invitation(this.invite_username, this.userId)
        .subscribe(() => {
          this.snackBar.open('Invitation sent', undefined, {
            duration: 3000,
          });
          this.invite_username = '';
        });
    }
  }
}
