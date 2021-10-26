import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Recipe } from './enums';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private baseUrl = environment.apiRoot + 'Recipes';

  constructor(private http: HttpClient) {}

  public addRecipe(householdId: number, recipe: Recipe) {
    return this.http.post<any>(this.baseUrl, {
      householdId: householdId,
      ...recipe,
    });
  }

  public getRecipes(householdId: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.baseUrl + '/' + householdId);
  }

  public deleteRecipe(id: number) {
    return this.http.delete(`${this.baseUrl}?recipeId=${id}`);
  }

  public updateRecipe(householdId: number, recipe: Recipe) {
    return this.http.put(this.baseUrl, { householdId: householdId, ...recipe });
  }
}
