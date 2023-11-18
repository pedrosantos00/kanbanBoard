import { Component, Input } from '@angular/core';
import { Column } from 'src/app/Models/Column';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent {
  @Input() column: Column = new Column();
}
