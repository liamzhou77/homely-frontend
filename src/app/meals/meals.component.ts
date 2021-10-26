import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { AuthService } from '../core/auth-service.component';
import { Meal, Recipe } from './shared/enums';
import { RecipesService } from './shared/recipes.service';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css'],
})
export class MealsComponent implements OnInit {
  public meals: Meal[];
  public recipes: Recipe[];
  public rightContainer = '';
  public householdId: number;
  @ViewChild('recipeSelection', { static: true })
  recipeSelection: MatSelectionList;
  public shouldAddRecipe: boolean;

  constructor(
    private authService: AuthService,
    private recipeService: RecipesService
  ) {
    this.authService.userInfoChanged.subscribe(
      (userInfo) => (this.householdId = userInfo.householdID)
    );
  }

  ngOnInit(): void {
    this.getRecipes();
  }

  public getRecipes(): void {
    this.recipeService.getRecipes(this.householdId).subscribe((recipes) => {
      this.recipes = recipes;
    });
  }

  public setRightContainer(s: string): void {
    this.rightContainer = s;
    this.recipeSelection.deselectAll();
  }

  public addNewRecipe(): void {
    this.getRecipes();
  }

  public deleteRecipe(id: number): void {
    this.recipeService.deleteRecipe(id).subscribe(() => {
      this.recipes = this.recipes.filter((r) => r.recipeId !== id);
      this.setRightContainer('');
    });
  }

  public navigateRecipeFormPage(isAdd: boolean): void {
    this.shouldAddRecipe = isAdd;
    this.rightContainer = 'addRecipe';
    if (isAdd) {
      this.recipeSelection.deselectAll();
    }
  }

  public updateRecipe(recipe: Recipe): void {
    for (let i = 0; i < this.recipes.length; i++) {
      if (this.recipes[i].recipeId === recipe.recipeId) {
        this.recipes[i] = recipe;
      }
    }
    this.rightContainer = 'recipe';
  }
}
