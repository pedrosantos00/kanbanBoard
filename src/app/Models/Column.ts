import { Task } from "./Task";

export class Column {

id! : string;
name!: string;
icon!: string;
editMode: boolean = false;
tasks! : Task[];
currentPage: number = 0;
turningPage! : boolean;
}
