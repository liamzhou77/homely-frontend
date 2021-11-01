import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Meal } from './enums';

@Injectable({
  providedIn: 'root',
})
export class MealsService {
  private baseUrl = environment.apiRoot + 'Meals';

  constructor(private http: HttpClient) {}

  public getMeals(householdId: number): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.baseUrl}/${householdId}`);
  }

  public createMeal(householdId: number, meal: Meal) {
    return this.http.post<any>(this.baseUrl, {
      householdId: householdId,
      ...meal,
    });
  }

  public deleteMeal(id: number) {
    return this.http.delete(`${this.baseUrl}?mealId=${id}`);
  }
}
