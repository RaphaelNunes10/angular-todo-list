import { CommonModule, NgFor } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { forkJoin } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { TodoService } from './todo.service'
import { Todo } from './todo.interface';

import { CdkDragDrop, CdkDropList, CdkDrag, CdkDragHandle, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    RouterOutlet,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatGridListModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CdkDropList,
    CdkDrag,
    CdkDragHandle
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  title = 'lista-todo';

  todoList: Todo[] = [];
  todoService: TodoService = inject(TodoService);
  newTodo: string = "";
  todoInputValue: string = "";

  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(this.deleteDialog);
  }

  createTodo(newTodoText: string) {
    this.todoService.postTodo(newTodoText).subscribe((newTodo: Todo) => {
      this.todoList.push(newTodo);
      this.todoInputValue = "";
    });
  }

  removeTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe((deletedTodo: Todo) => {
        this.todoList.splice(this.todoList.findIndex(todo => todo.id == deletedTodo.id), 1);
        this.dialog.closeAll();
    });
  }

  checkTodo(id: string, isChecked: boolean) {
    console.log("Checked: " + isChecked);
    this.todoService.patchTodo(id, { checked: isChecked }).subscribe((patchedTodo: Todo) => {
      console.log("OK: " + JSON.stringify(patchedTodo));
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.todoList, event.previousIndex, event.currentIndex);

    this.todoList.forEach((todo, index) => {
      todo.listIndex = index;
    });

    const patchRequests = this.todoList.map(todo => {
      return this.todoService.patchTodo(todo.id, { listIndex: todo.listIndex });
    });

    forkJoin(patchRequests).subscribe(
      () => {
        console.log('Reordered items successfully patched to the server.');
      },
      (error) => {
        console.error('Failed to patch reordered items to the server:', error);
      }
    );
  }

  ngOnInit() {
    this.todoService.getAllTodos().subscribe((todos: Todo[]) => {
      this.todoList = todos.sort((a, b) => a.listIndex - b.listIndex);
    });
  }
}
