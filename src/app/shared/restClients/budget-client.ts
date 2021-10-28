import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IBudget, IBudgetCategory, IExpense, IIncome, IResponseDto } from '../dtos/budget-dtos';
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

  modifyBudget(budget: IBudget): Observable<any> {
    return this.client.put<IBudget>(`${this.baseUrl}budget/${budget.budgetId}`, budget);
  }

  createBudget(newBudget: IBudget): Observable<IResponseDto> {

    return this.client.post<any>(`${this.baseUrl}budget`, newBudget);
  }
  createBudgetCategory(newBudgetCategory: IBudgetCategory): Observable<IResponseDto> {

    return this.client.post<any>(`${this.baseUrl}budgetcategory`, newBudgetCategory);
  }

  createExpense(newExpense: IExpense): Observable<IResponseDto> {

    return this.client.post<any>(`${this.baseUrl}expense`, newExpense);
  }

  deleteAccess(budgetId: number, userId: number): Observable<any> {
    let body = { budgetId: budgetId, userId: userId }
    return this.client.delete(`${this.baseUrl}budgetaccess`, {body: body});
  }

  createAccess(budgetId: number, userId: number): Observable<any> {
    let body = { budgetId: budgetId, userId: userId }
    return this.client.post<any>(`${this.baseUrl}budgetaccess`, body);
  }


  createIncome(newIncome: IIncome): Observable<IResponseDto> {

    return this.client.post<any>(`${this.baseUrl}income`, newIncome);
  }

  deleteIncome(incomeId: number): Observable<any> {

    return this.client.delete(`${this.baseUrl}income/${incomeId}`);
  }

  deleteExpense(expenseId: number): Observable<any> {
    return this.client.delete(`${this.baseUrl}expense/${expenseId}`);
  }

  deleteCategory(budgetCategoryId: number): Observable<any> {
    return this.client.delete(`${this.baseUrl}budgetcategory/${budgetCategoryId}`);
  }

}
