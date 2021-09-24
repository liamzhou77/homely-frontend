import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Task } from './task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = environment.apiRoot + 'tasks';

  constructor(private http: HttpClient) {}

  public getTasks(householdId: number, completed: boolean): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/${householdId}`).pipe(
      map((tasks) => tasks.filter((task) => task.completed == completed)),
      catchError(this.handleError<Task[]>([]))
    );
  }

  public addTask(householdId: number, description: string): Observable<any> {
    return this.http.post<any>(this.baseUrl, { householdId, description });
  }

  public updateTaskCompleted(taskId: number) {
    return this.http.put(`${this.baseUrl}/${taskId}/update/completed`, {});
  }

  public deleteTask(taskId: number) {
    return this.http.delete(`${this.baseUrl}/${taskId}`);
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
