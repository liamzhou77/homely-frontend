import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { AuthService } from '../core/auth-service.component';
import { Meal, Recipe } from './shared/enums';
import { MealsService } from './shared/meals.service';
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
  public shouldAddRecipe: boolean;

  @ViewChild('recipeSelection', { static: true })
  recipeSelection: MatSelectionList;
  @ViewChild('mealSelection', { static: true })
  mealSelection: MatSelectionList;

  constructor(
    private authService: AuthService,
    private recipeService: RecipesService,
    private mealsService: MealsService
  ) {
    this.authService.userInfoChanged.subscribe(
      (userInfo) => (this.householdId = userInfo.householdID)
    );
  }

  ngOnInit(): void {
    this.getRecipes();
    this.getMeals();
  }

  public getRecipes(): void {
    this.recipeService.getRecipes(this.householdId).subscribe((recipes) => {
      this.recipes = recipes;
    });
  }

  public getMeals(): void {
    this.mealsService.getMeals(this.householdId).subscribe((meals) => {
      this.meals = meals;
    });
  }

  public setRightContainer(s: string): void {
    this.rightContainer = s;
    this.recipeSelection.deselectAll();
    this.mealSelection.deselectAll();
  }

  public addNewRecipe(): void {
    this.getRecipes();
  }

  public deleteRecipe(id: number): void {
    this.recipeService.deleteRecipe(id).subscribe(() => {
      this.recipes = this.recipes.filter((r) => r.recipeId !== id);
      this.getMeals();
      this.setRightContainer('');
    });
  }

  public deleteMeal(id: number): void {
    this.mealsService.deleteMeal(id).subscribe(() => {
      this.meals = this.meals.filter((m) => m.mealId !== id);
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
    this.recipeService
      .getIngredients(this.householdId, recipe.recipeId)
      .subscribe((ingredients) => {
        recipe.ingredients = ingredients;
        for (let i = 0; i < this.recipes.length; i++) {
          if (this.recipes[i].recipeId === recipe.recipeId) {
            this.recipes[i] = recipe;
          }
        }
        this.getMeals();
        this.rightContainer = 'recipe';
      });
  }

  public addNewMeal(meal: Meal): void {
    this.meals.push(meal);
  }

  public getRecipeFromMeal(meal: Meal): Recipe | undefined {
    for (let recipe of this.recipes) {
      if (meal.recipeId == recipe.recipeId) {
        return recipe;
      }
    }
    return undefined;
  }
}
