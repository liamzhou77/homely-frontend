import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DeletedAndGeneratedItems, GroceryListItem } from './enums';

@Injectable({
  providedIn: 'root',
})
export class GroceryListService {
  private baseUrl = environment.apiRoot + 'grocerylist';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  public generateGroceryList(
    householdId: number,
    startDate: Date,
    endDate: Date,
    userId: number
  ) {
    return this.http.post<DeletedAndGeneratedItems>(
      `${
        this.baseUrl
      }/${householdId}/generate/${startDate.toISOString()}/${endDate.toISOString()}/${userId}`,
      {}
    );
  }

  public getGroceryList(householdId: number) {
    return this.http.get<GroceryListItem[]>(this.baseUrl + '/' + householdId);
  }

  public checkGroceryListItem(itemId: number, userId: number) {
    return this.http.put(
      `${this.baseUrl}/item/${itemId}/checkedoff/${userId}`,
      {}
    );
  }

  public deleteGroceryListItem(itemId: number) {
    return this.http.delete(`${this.baseUrl}/item/${itemId}`, {
      responseType: 'text',
    });
  }

  public addGroceryListItem(item: any) {
    return this.http.post(this.baseUrl + '/item', item);
  }
}
