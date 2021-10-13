import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IBudget, IBudgetCategory, IExpense } from '../dtos/budget-dtos';
import { IUserDto } from '../dtos/user-dto';



@Injectable({ providedIn: 'root' })
export class BudgetClient {
  private readonly baseUrl: string;

  constructor(private client: HttpClient) {
    this.baseUrl = environment.apiRoot;
  }

  getBudgets(userId: number): Observable<IBudget[]> {
    return this.client.get<IBudget[]>(`${this.baseUrl}budgets/${userId}`);
  }

  createBudget(newBudget: IBudget): Observable<number> {

    return this.client.post<any>(`${this.baseUrl}budget`, newBudget);
  }
  createBudgetCategory(newBudgetCategory: IBudgetCategory): Observable<number> {

    return this.client.post<any>(`${this.baseUrl}budgetcategory`, newBudgetCategory);
  }

  createExpense(newExpense: IExpense): Observable<number> {

    return this.client.post<any>(`${this.baseUrl}expense`, newExpense);
  }

}
