import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Task } from './task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private base_url = 'http://localhost:4200/api';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getTasks(completed: boolean): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.base_url}/todos?UserID=5`).pipe(
      map((tasks) => tasks.filter((task) => task.completed == completed)),
      catchError(this.handleError<Task[]>([]))
    );
  }

  // addTask(task: any): Observable<Task> {
  //   return this.http.post<any>(`${this.base_url}/todo`)
  // }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
