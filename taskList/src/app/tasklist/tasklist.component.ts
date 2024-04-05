import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TasklistService } from './tasklist.service';
import { Tasklist } from './tasklist.model';
import { AddTaskModalComponent } from './modals/add-task-modal.component';
import { ConfirmationModalComponent } from './modals/confirmation-modal.component';
import { ManageTimeModalComponent } from './modals/manage-time-modal.component';
import { DataService } from './data.service';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddTaskModalComponent,
    ConfirmationModalComponent,
    ManageTimeModalComponent,
  ],
  standalone: true,
})
export class TasklistComponent implements OnInit {
  tasks: Tasklist[] = [];
  taskTime: any = [];
  myForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  closeResult = '';
  activeTask: any;
  @ViewChild(AddTaskModalComponent) addTaskModal!: AddTaskModalComponent;
  @ViewChild(ConfirmationModalComponent)
  confirmationModal!: ConfirmationModalComponent;
  @ViewChild(ManageTimeModalComponent) manageTimeModal!: AddTaskModalComponent;

  constructor(
    private tasklistService: TasklistService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private dataService: DataService
  ) {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      customer: ['', Validators.required],
      description: [''],
      action: 'add',
      id: null,
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      customer: ['', Validators.required],
      description: [''],
      action: 'add',
    });
    this.dataService.getData().subscribe((data) => {
      //   console.log(data);
      this.activeTask = data;
    });
    this.getData();
  }

  openAddTaskModal() {
    const modalRef = this.modalService.open(AddTaskModalComponent, {
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    modalRef.componentInstance.data = { action: 'add' };
    let that = this;
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        that.getData();
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  editTask(task: any) {
    // console.log(task);
    const modalRef = this.modalService.open(AddTaskModalComponent, {
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    modalRef.componentInstance.data = { action: 'edit', task: task };
    let that = this;
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        that.getData();
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  confirmDelete(task: any) {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
      size: 'sm',
    });
    modalRef.componentInstance.data = { action: 'delete', task: task };
    let that = this;
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        that.getData();
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  startTimer(task: any) {
    let timeData = {
      description: task.name,
      begin_date: new Date().toISOString(),
      end_date: '',
    };
    this.tasklistService.postTaskTimeData(timeData, task.id).subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleError.bind(this),
    });
  }

  handleUpdateResponse(response: any) {
    // console.log('Form data submitted successfully:', response);
    this.successMessage = 'Time logged successfully!';
    // this.getData();
  }

  handleError(error: any) {
    console.error('Error submitting form data:', error);
    this.errorMessage = error.error.message;
    setTimeout(() => {
      this.errorMessage = null; // Hide error message after 5 seconds
    }, 5000);
  }

  showTaskTime(task: any) {
    let selectedTaskTime: any = [];
    this.tasks.forEach((t, i) => {
      if (t.id == task.id) {
        selectedTaskTime = this.taskTime[i];
      }
    });
    const modalRef = this.modalService.open(ManageTimeModalComponent, {
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    modalRef.componentInstance.data = {
      action: 'edit',
      task: task,
      taskTime: selectedTaskTime,
    };
    let that = this;
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        that.getData();
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  getData() {
    this.tasklistService
      .getSecondDataForAllItems()
      .subscribe((secondDataArray) => {
        this.taskTime = secondDataArray;
        this.tasklistService.getList().subscribe((tasks) => {
          this.tasks = tasks;
          if (tasks) {
            this.tasks.forEach((task, i) => {
              let time = 0;
              if (this.taskTime[i]) {
                this.taskTime[i].forEach((t: any) => {
                  time = time + t.spent_time;
                });
              }
              this.tasks[i].time = time;
            });
          }
        });
      });
  }
}
