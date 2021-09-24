import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth-service.component';
import { Task } from './shared/task';
import { TaskService } from './shared/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  public completedTasks: Task[];
  public incompletedTasks: Task[];
  public inputValue = '';
  private householdId: number;

  constructor(
    private tasksService: TaskService,
    private authService: AuthService
  ) {
    this.authService.userInfoChanged.subscribe(
      (userInfo) => (this.householdId = userInfo.householdID)
    );
  }

  ngOnInit(): void {
    this.getTasks();
  }

  public getTasks(): void {
    this.tasksService
      .getTasks(this.householdId, true)
      .subscribe((tasks) => (this.completedTasks = tasks));
    this.tasksService
      .getTasks(this.householdId, false)
      .subscribe((tasks) => (this.incompletedTasks = tasks));
  }

  public addTask(): void {
    if (this.inputValue !== '') {
      const description = this.inputValue;
      this.tasksService
        .addTask(this.householdId, description)
        .subscribe((task) =>
          this.incompletedTasks.unshift({
            taskId: task.id,
            description: description,
            completed: false,
          })
        );
      this.inputValue = '';
    }
  }

  public setCompleted(task: Task) {
    this.tasksService.updateTaskCompleted(task.taskId).subscribe(() => {
      this.removeTaskFromList(task);
      task.completed = !task.completed;
      this.addTaskToList(task);
    });
  }

  public deleteTask(task: Task) {
    this.tasksService.deleteTask(task.taskId).subscribe(() => {
      this.removeTaskFromList(task);
    });
  }

  private removeTaskFromList(task: Task) {
    if (task.completed) {
      this.completedTasks = this.completedTasks.filter((t) => t !== task);
    } else {
      this.incompletedTasks = this.incompletedTasks.filter((t) => t !== task);
    }
  }

  private addTaskToList(task: Task) {
    if (task.completed) {
      this.completedTasks.unshift(task);
    } else {
      this.incompletedTasks.unshift(task);
    }
  }
}
