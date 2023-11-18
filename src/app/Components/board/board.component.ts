import { Component, OnInit } from '@angular/core';
import { Column } from 'src/app/Models/Column';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit{
  columns!: Column[];

  constructor(private data : DataService) {}

  ngOnInit(): void {
    const saveData = this.data.getdata();
    this.columns = saveData ? saveData.columns : this.getDefaultColumns();
  }

   getDefaultColumns() {
    return [
      { name: 'To Do', tasks: [] },
      { name: 'In Progress', tasks: [] },
      { name: 'Done', tasks: [] },
      { name: 'Approved', tasks: [] }
    ];
  }

  saveData() {
    this.data.setData({ columns: this.columns });
  }
}
