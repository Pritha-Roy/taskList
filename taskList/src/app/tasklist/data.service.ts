import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() {}

  // Method to get the current state
  getData() {
    return this.dataSubject.asObservable();
  }

  // Method to update the state
  updateData(newData: any[]) {
    this.dataSubject.next(newData);
  }
}
