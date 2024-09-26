import { Injectable } from '@angular/core';
import { Todo } from './todo.interface'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class TodoService {
  url: string;

  constructor(private http: HttpClient) {
    this.url = 'http://localhost:3000/todos';
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  getAllTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.url) ?? null;
  }

  postTodo(todoText: string): Observable<Todo> {
    return this.http.post<any>(this.url, { checked: false, text: todoText });
  }

  deleteTodo(id: string): Observable<Todo> {
    return this.http.delete<Todo>(`${this.url}/${id}`);
  }

  patchTodo(id: string, data: object): Observable<Todo> {
    return this.http.patch<Todo>(`${this.url}/${id}`, data);
  }
}