export interface Notification {
  notificationID: number;
  type: NotificationType;
  creationDateTime: any;
  inviter: string;
  household: string;
}

export enum NotificationType {
  INVITATION = 'invitation',
}
