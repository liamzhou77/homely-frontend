import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth-service.component';
import { Notification } from './notification';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  public notifications: Notification[] = [];
  private userId: number;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.userInfoChanged.subscribe((userInfo) => {
      this.userId = userInfo.userID;
      this.get_notifications();
      setInterval(this.get_notifications.bind(this), 5000);
    });
  }

  private get_notifications(): void {
    this.notificationService
      .get_notifications(this.userId)
      .subscribe((notifications) => (this.notifications = notifications));
  }

  public accept_invitation(notificationId: number): void {
    this.notificationService.accept_invitation(notificationId).subscribe(() => {
      this.notificationService.delete_notification(notificationId);
      this.router.navigate(['dashboard']);
    });
  }

  public refuse_invitation(notificationId: number): void {
    this.notificationService
      .delete_notification(notificationId)
      .subscribe(() => {
        this.get_notifications();
      });
  }
}
