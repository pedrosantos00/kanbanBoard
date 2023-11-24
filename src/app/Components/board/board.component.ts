import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Column } from 'src/app/Models/Column';
import { Task } from 'src/app/Models/Task';
import { DataService } from 'src/app/Services/data.service';
import { PageEvent } from '@angular/material/paginator';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  animations: [
    trigger('stickyNoteAnimation', [
      state('state1', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('state2', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('state1 <=> state2', [
        animate('0.3s ease')
      ])
    ])
  ]
})
export class BoardComponent implements OnInit {
  columns!: Column[];
  columnTitleEditMode: boolean = false;
  newTask: Task = new Task();
  tags: string = '';
  tasksPerPage = 3;

  constructor(private data: DataService) { }


  getTasksForPage(column: Column): Task[] {
    const startIndex = column.currentPage * this.tasksPerPage;
    return column.tasks.slice(startIndex, startIndex + this.tasksPerPage);
  }


  isLastPage(column: Column): boolean {
    if (
      isNaN(column.currentPage) ||
      column.currentPage === null
    ) {
      return true;
    }

    const maxPages = Math.ceil(column.tasks.length / this.tasksPerPage) - 1;
    return column.currentPage === maxPages || column.currentPage * this.tasksPerPage >= column.tasks.length;
  }

  addTask() {
    // Validate the task before adding
    if (this.newTask.title) {
      this.newTask.creationDate = new Date();
      if (this.tags != '') {
        this.newTask.tags = this.tags.split(',');
      }

      this.tags = '';
      // Add the new task to the column
      const currentColumn = this.columns[0]; // Assuming you're adding tasks to the first column
      currentColumn.tasks.push(this.newTask);

      // Reset the form for the next task
      this.newTask = new Task();
      currentColumn.currentPage = Math.ceil(currentColumn.tasks.length / this.tasksPerPage) - 1;
      this.saveData();
    }
  }

  ngOnInit(): void {
    const saveData = this.data.getdata();
    this.columns = saveData ? saveData.columns : this.getDefaultColumns();
  }

  getDefaultColumns() {
    return [
      { id: 'board1', name: 'To-Do', tasks: [], icon: 'fa fa-arrow-right', currentPage: 0 },
      { id: 'board2', name: 'In Progress', tasks: [], icon: 'fa fa-arrow-right', currentPage: 0 },
      { id: 'board3', name: 'Done', tasks: [], icon: 'fa fa-arrow-right', currentPage: 0 },
      { id: 'board4', name: 'Approved', tasks: [], icon: 'fa fa-check', currentPage: 0 }
    ];
  }

  editColumnTitle(column: Column) {
    column.editMode = !column.editMode;
  }

  mousehover(column: Column) {
    console.log("teste")
    column.icon = "fa fa-pencil-square-o";
  }

  updateColumnTitle(column: Column) {
    // Exit edit mode
    column.editMode = false;
    if (column.id != "board4") {
      column.icon = "fa fa-arrow-right";
    } else {
      column.icon = "fa fa-check";
    }
    this.saveData();
  }

  reset() {
    var proceed = confirm("Are you sure you want to reset the KanbanBoard?");
    if (proceed) {
      localStorage.clear();
      window.location.reload();
    }
  }

// No seu componente
onClickLeftLiftedCorner(column: Column) {
  column.turningPage = true;
  setTimeout(() => {
    column.currentPage -= 1;
    column.turningPage = false;
    this.saveData();
  }, 500); // 500ms é a duração da transição no CSS
}

onClickRightLiftedCorner(column: Column) {
  column.turningPage = true;
  setTimeout(() => {
    column.currentPage += 1;
    column.turningPage = false;
    this.saveData();
  }, 500); // 500ms é a duração da transição no CSS
}


  mouseleave(column: Column) {
    if (column.id != "board4") {
      column.icon = "fa fa-arrow-right";
    } else {
      column.icon = "fa fa-check";
    }

  }

  onTaskDropped(event: CdkDragDrop<Task[]>, sourceColumn: Column) {
    const movedTask = event.item.data as Task;

    // Find the target column using the event target
    const targetBoard = event.event.target as HTMLElement
    const targetColumn = this.columns.find((col) => col.id === targetBoard.id);

    console.log(targetColumn)
    if (sourceColumn && targetColumn && sourceColumn !== targetColumn) {
      // Remove the task from the source column
      sourceColumn.tasks = sourceColumn.tasks.filter((task) => task !== movedTask);

      //update data
      movedTask.lastModificationDate = new Date()
      // Add the task to the target column
      targetColumn.tasks.push(movedTask);

      // Log the IDs of the source and target columns
      console.log('Source Column ID:', sourceColumn.id);
      console.log('Target Column ID:', targetColumn.id);

      // Save the updated data
      this.saveData();
    }
  }

  onDeleteTask(deletedTask: Task) {
    console.log('te')
    // Find the column containing the deleted task
    const columnWithDeletedTask = this.columns.find((column) => column.tasks.includes(deletedTask));

    if (columnWithDeletedTask) {
      // Remove the task from the column
      columnWithDeletedTask.tasks = columnWithDeletedTask.tasks.filter((task) => task !== deletedTask);

      // Save the updated data
      this.saveData();
    }
  }

  saveData() {
    this.data.setData({ columns: this.columns });
  }
}
