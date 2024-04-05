import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TasklistService } from '../tasklist.service';
import { DataService } from '../data.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-manage-time-modal',
  templateUrl: './manage-time-modal.component.html',
  //   styleUrls: ['./manage-time-modal.component.css'],
})
export class ManageTimeModalComponent {
  timeLog: any;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedTask: any[];
  @Input() data: any;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private tasklistService: TasklistService,
    private dataService: DataService
  ) {
    this.selectedTask = [];
  }

  ngOnInit(): void {
    this.timeLog = this.data.taskTime;
    this.dataService.getData().subscribe((data) => {
      this.selectedTask = data;
    });
  }

  startTimer(taskid: any) {
    let timeData = {
      description: this.data.task.name,
      begin_date: new Date().toISOString(),
      end_date: '',
    };
    this.tasklistService
      .postTaskTimeData(timeData, this.data.task.id)
      .subscribe({
        next: this.handleUpdateResponse.bind(this),
        error: this.handleError.bind(this),
      });
  }

  stopTimer(timeid: any) {
    let timeData = {
      end_date: new Date().toISOString(),
    };
    this.tasklistService
      .putTaskTimeData(timeData, this.data.task.id, timeid)
      .subscribe({
        next: this.handleUpdateResponse.bind(this),
        error: this.handleError.bind(this),
      });
  }

  addData() {
    const newData = { activeTask: this.data.task };
    this.dataService.updateData([...this.selectedTask, newData]);
  }

  deleteTime(timeid: any) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.tasklistService.deleteTaskTime(this.data.task.id, timeid).subscribe({
        next: this.handleUpdateResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }
  }

  handleUpdateResponse(response: any) {
    // console.log('Form data submitted successfully:', response);
    this.successMessage = 'Time logged successfully!';
    this.errorMessage = null;
    setTimeout(() => {
      this.successMessage = null; // Hide success message after 5 seconds
      this.tasklistService.getTaskTime(this.data.task.id).subscribe({
        next: this.handleUpdateListResponse.bind(this),
        error: this.handleError.bind(this),
      });
      // this.activeModal.close();
    }, 3000);
    // this.getData();
  }

  handleUpdateListResponse(response: any) {
    this.timeLog = response;
  }

  handleError(error: any) {
    console.error('Error submitting form data:', error);
    this.errorMessage = error.message;
    setTimeout(() => {
      this.errorMessage = null; // Hide error message after 5 seconds
      this.tasklistService.getTaskTime(this.data.task.id).subscribe({
        next: this.handleUpdateListResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }, 5000);
  }
}
