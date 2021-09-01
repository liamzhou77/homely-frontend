import { Component, OnInit } from '@angular/core';

import { Task } from './shared/task';
import { TaskService } from './shared/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  completedTasks: Task[];
  incompletedTasks: Task[];
  inputValue = '';

  constructor(private tasksService: TaskService) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.tasksService
      .getTasks(true)
      .subscribe((tasks) => (this.completedTasks = tasks));
    this.tasksService
      .getTasks(false)
      .subscribe((tasks) => (this.incompletedTasks = tasks));
  }

  addTask(event: any): void {
    this.inputValue = '';
    this.incompletedTasks.unshift({
      todoDescription: event.target.value,
    } as Task);
  }

  setCompleted(task: Task) {
    if (task.completed) {
      this.completedTasks = this.completedTasks.filter((t) => t !== task);
      this.incompletedTasks.push(task);
    } else {
      this.incompletedTasks = this.incompletedTasks.filter((t) => t !== task);
      this.completedTasks.push(task);
    }
    task.completed = !task.completed;
  }
}
