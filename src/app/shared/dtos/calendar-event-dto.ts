export interface ICalendarEventDto {
  eventId?: number,
  householdId: number,
  creatorId: number,
  start?: Date,
  end?: Date,
  title: string,
  allDay?: boolean,
  description?: string,
  color?: string
}
