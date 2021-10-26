import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipe } from '../shared/enums';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  @Input() public recipe: Recipe;
  @Output() public deleteRecipeEvent = new EventEmitter<number>();
  @Output() public updateRecipeEvent = new EventEmitter<never>();

  constructor() {}

  ngOnInit(): void {}

  public deleteRecipe(): void {
    this.deleteRecipeEvent.emit(this.recipe.recipeId);
  }

  public updateRecipe(): void {
    this.updateRecipeEvent.emit();
  }
}
