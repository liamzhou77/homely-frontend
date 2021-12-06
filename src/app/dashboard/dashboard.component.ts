import { Component, OnInit } from '@angular/core';
import { filter, map, tap } from 'rxjs/operators';
import { AuthService } from '../core/auth-service.component';
import { Meal } from '../meals/shared/enums';
import { MealsService } from '../meals/shared/meals.service';
import { IBudget } from '../shared/dtos/budget-dtos';
import { ICalendarEventDto } from '../shared/dtos/calendar-event-dto';
import { BudgetClient } from '../shared/restClients/budget-client';
import { CalendarClient } from '../shared/restClients/calendar-client';
import { Task } from '../tasks/shared/task';
import { TaskService } from '../tasks/shared/tasks.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private householdId: number;
  private userId: number;
  public tasks: Task[];
  public meals: Meal[];
  public calendarEvents: ICalendarEventDto[];
  public budgets: IBudget[];

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private mealService: MealsService,
    private calendarClient: CalendarClient,
    private budgetClient: BudgetClient
  ) {
    this.authService.userInfoChanged.subscribe((userInfo) => {
      this.householdId = userInfo.householdID;
      this.userId = userInfo.userID;
    });
  }

  ngOnInit(): void {
    this.getTasks();
    this.getMeals();
    let today: Date = new Date(new Date().toDateString());
    this.calendarClient.getEvents(this.userId, this.householdId).pipe(
      map(e => e.filter(event => new Date(event.start) <= today && new Date(event.end) >= today 
        || new Date(new Date(event.start).toDateString()).toDateString() == today.toDateString()
        || new Date(new Date(event.end).toDateString()).toDateString() == today.toDateString()))
    ).subscribe(events => {
      this.calendarEvents = events;
    });

    this.budgetClient.getBudgets(this.userId).pipe(
      map(budgets => budgets.filter(budget => new Date(budget.startDate) <= today && new Date(budget.endDate) >= today))
    ).subscribe(budgets => {
      this.budgets = budgets;
    })

  }

  public getTasks(): void {
    this.taskService
      .getTasks(this.householdId, false)
      .subscribe((tasks) => (this.tasks = tasks));
  }

  public getMeals(): void {
    this.mealService.getMeals(this.householdId).subscribe((meals) => {
      this.meals = meals.filter(
        (meal) =>
          new Date(meal.scheduledDate) >= new Date(new Date().toDateString())
      );
    });
  }
}
