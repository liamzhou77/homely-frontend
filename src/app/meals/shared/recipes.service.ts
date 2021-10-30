import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ingredient, Recipe } from './enums';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private recipeBaseUrl = environment.apiRoot + 'Recipes';
  private ingredientBaseUrl = environment.apiRoot + 'Ingredients';

  constructor(private http: HttpClient) {}

  public addRecipe(householdId: number, recipe: Recipe) {
    return this.http.post<any>(this.recipeBaseUrl, {
      householdId: householdId,
      ...recipe,
    });
  }

  public getRecipes(householdId: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipeBaseUrl + '/' + householdId);
  }

  public deleteRecipe(id: number) {
    return this.http.delete(`${this.recipeBaseUrl}?recipeId=${id}`);
  }

  public updateRecipe(householdId: number, recipe: Recipe) {
    return this.http.put(this.recipeBaseUrl, {
      householdId: householdId,
      ...recipe,
    });
  }

  public addIngredient(ingredient: Ingredient) {
    return this.http.post<number>(this.ingredientBaseUrl, ingredient);
  }

  public deleteIngredient(id: number) {
    return this.http.delete(`${this.ingredientBaseUrl}?ingredientId=${id}`);
  }

  public getIngredients(householdId: number, recipeId: number) {
    return this.http.get<Ingredient[]>(
      `${this.ingredientBaseUrl}/${householdId}/${recipeId}`
    );
  }
}
