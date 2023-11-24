import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from 'src/app/Models/Task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  @Input() task: Task = new Task();
  @Output() deleteTaskEvent = new EventEmitter<Task>();

  deleteConfirm : boolean = false;

deleteTask() {
  this.deleteConfirm = !this.deleteConfirm;
}


confirmDelete(confirm: number) {
  if (confirm === 0) {
    this.deleteTaskEvent.emit(this.task);
    this.deleteConfirm = !this.deleteConfirm;
  } else {
    this.deleteConfirm = false;
  }
}

}
