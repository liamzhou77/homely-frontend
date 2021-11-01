import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Meal, Recipe } from '../shared/enums';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css'],
})
export class MealComponent implements OnInit {
  @Input() meal: Meal;
  @Input() recipe: Recipe;
  @Output() deleteMealEvent = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  public deleteMeal(): void {
    this.deleteMealEvent.emit(this.meal.mealId);
  }
}
