import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  public invite_username: string;

  constructor(
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  public invite() {
    if (this.invite_username) {
      this.notificationService
        .send_invitation(this.invite_username)
        .subscribe(() => {
          this.snackBar.open('Invitation sent', undefined, {
            duration: 3000,
          });
          this.invite_username = '';
        });
    }
  }
}
