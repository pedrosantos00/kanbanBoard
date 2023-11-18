import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private localStorageKey = 'kanban-board-data';
  constructor() { }

  getdata() {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse (data): null;
  }

  setData(data: any) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }

}
