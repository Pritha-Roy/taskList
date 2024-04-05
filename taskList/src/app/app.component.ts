import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasklistComponent } from './tasklist/tasklist.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TasklistComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'taskList';
}
