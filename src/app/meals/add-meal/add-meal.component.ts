import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Meal, Recipe } from '../shared/enums';
import { MealsService } from '../shared/meals.service';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.css'],
})
export class AddMealComponent implements OnInit {
  @Input() public householdId: number;
  @Input() public recipes: Recipe[];

  public recipe: Recipe;
  public scheduledDate: Date;
  public mealType: string;
  public minDateFilter = this.isDateValid;

  @Output() newMealEvent = new EventEmitter<Meal>();

  constructor(private mealsService: MealsService) {}

  ngOnInit(): void {}

  public isDateValid(d: Date | null): boolean {
    return d >= new Date(new Date().toDateString());
  }

  public addMeal(): void {
    const newMeal: Meal = {
      recipeId: this.recipe.recipeId,
      recipeName: this.recipe.recipeName,
      scheduledDate: this.scheduledDate,
      mealType: this.mealType,
    };
    this.mealsService
      .createMeal(this.householdId, newMeal)
      .subscribe((mealId) => {
        newMeal.mealId = mealId.id;
        this.clearForm();
        this.newMealEvent.emit(newMeal);
      });
  }

  private clearForm(): void {
    this.recipe = undefined;
    this.scheduledDate = undefined;
    this.mealType = undefined;
  }
}
