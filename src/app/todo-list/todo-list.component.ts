import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Todo } from '../../model/todo';
import { TodoService } from '../../services/todo.service';



@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodoControl = new FormControl('', Validators.required);

  constructor(private todoService: TodoService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loading = false;

  loadTodos(): void {
    this.loading = true;
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar las tareas:', error);
        this.snackBar.open('Error al cargar las tareas', 'Cerrar', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  addTodo(): void {
    if (this.newTodoControl.valid) {
      const newTodo: Todo = {
        title: this.newTodoControl.value!,
        completed: false,
      };
      console.log('Enviando nueva tarea:', newTodo);
      
      this.todoService.addTodo(newTodo).subscribe({
        next: (addedTodo) => {
          console.log('Tarea agregada con éxito:', addedTodo);
          
          // Opción 1: Añade la tarea devuelta por la API al array local
          this.todos.push(addedTodo);
          
          // Opción 2 (alternativa): Vuelve a cargar todas las tareas
          // this.loadTodos();
          
          // Limpia el formulario
          this.newTodoControl.reset();
          
          this.snackBar.open('Tarea agregada correctamente', 'Cerrar', {
            duration: 2000,
          });
        },
        error: (error) => {
          console.error('Error completo:', error);
          // resto del código de manejo de errores...
        },
      });
    } else {
      // código para el caso de formulario inválido...
    }
  }

  toggleTodoComplete(todo: Todo): void {
    this.todoService.toggleComplete(todo).subscribe({
      next: (updatedTodo) => {
        const index = this.todos.findIndex(t => t.id === updatedTodo.id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
        this.snackBar.open('Tarea actualizada', 'Cerrar', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error al actualizar la tarea:', error);
        this.snackBar.open('Error al actualizar el estado de la tarea', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
  
  deleteTodo(todo: Todo): void {
    if (!todo.id) return;
    
    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => {
        this.todos = this.todos.filter(t => t.id !== todo.id);
        this.snackBar.open('Tarea eliminada', 'Cerrar', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error al eliminar la tarea:', error);
        this.snackBar.open('Error al eliminar la tarea', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  
}