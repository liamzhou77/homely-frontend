import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth-service.component';
import { Meal } from '../meals/shared/enums';
import { MealsService } from '../meals/shared/meals.service';
import { Task } from '../tasks/shared/task';
import { TaskService } from '../tasks/shared/tasks.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private householdId: number;
  public tasks: Task[];
  public meals: Meal[];

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private mealService: MealsService
  ) {
    this.authService.userInfoChanged.subscribe((userInfo) => {
      this.householdId = userInfo.householdID;
    });
  }

  ngOnInit(): void {
    this.getTasks();
    this.getMeals();
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
