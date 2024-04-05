import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Tasklist } from './tasklist.model';

@Injectable({
  providedIn: 'root',
})
export class TasklistService {
  private apiUrl = 'https://oficines.glamsw.com/chrono-test';
  constructor(private http: HttpClient) {}

  getList(): Observable<Tasklist[]> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<Tasklist[]>(this.apiUrl + '/tasks', { headers });
  }

  getTaskTime(taskid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<Tasklist[]>(
      this.apiUrl + '/tasks/' + taskid + '/times',
      {
        headers,
      }
    );
  }

  getTaskTimeForList(tasks: any): Observable<Tasklist[]> {
    // Map each user to a getUser call and merge the results into a single observable
    return from(tasks).pipe(mergeMap((task: any) => this.getTaskTime(task.id)));
  }

  getSecondDataForAllItems(): Observable<any[]> {
    return this.getList().pipe(
      mergeMap((firstDataArray) => {
        const secondDataObservables: Observable<any>[] = [];
        firstDataArray.forEach((item) => {
          secondDataObservables.push(this.getTaskTime(item.id));
        });
        return forkJoin(secondDataObservables);
      })
    );
  }

  postTaskData(formData: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(`${this.apiUrl}/tasks`, formData.value, {
      headers,
    });
  }

  updateTaskData(formData: any, id: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<any>(`${this.apiUrl}/tasks/${id}`, formData.value, {
      headers,
    });
  }

  deleteTask(id: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.delete<any>(`${this.apiUrl}/tasks/${id}`, {
      headers,
    });
  }

  postTaskTimeData(timeData: any, id: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(`${this.apiUrl}/tasks/${id}/times`, timeData, {
      headers,
    });
  }

  putTaskTimeData(timeData: any, taskid: any, timeid: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<any>(
      `${this.apiUrl}/tasks/${taskid}/times/${timeid}`,
      timeData,
      {
        headers,
      }
    );
  }

  deleteTaskTime(taskid: any, timeid: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.delete<any>(
      `${this.apiUrl}/tasks/${taskid}/times/${timeid}`,
      {
        headers,
      }
    );
  }
}
