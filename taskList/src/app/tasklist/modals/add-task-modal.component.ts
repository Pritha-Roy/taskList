import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TasklistService } from '../tasklist.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  //   styleUrls: ['./add-task-modal.component.css'],
})
export class AddTaskModalComponent {
  myForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  @Input() data: any;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private tasklistService: TasklistService
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
      name: [
        this.data.action == 'edit' ? this.data.task.name : '',
        Validators.required,
      ],
      customer: [
        this.data.action == 'edit' ? this.data.task.customer : '',
        Validators.required,
      ],
      description: [
        this.data.action == 'edit' ? this.data.task.description : '',
      ],
      action: this.data.action,
      id: this.data.action == 'edit' ? this.data.task.id : null,
    });
  }

  openModal() {
    // Write the logic to display the modal here
    console.log(this.data);
  }

  onSubmit() {
    if (this.myForm.valid) {
      // console.log(this.myForm.value);
      if (this.myForm.value.action === 'add') {
        delete this.myForm.value.action;
        delete this.myForm.value.id;
        this.tasklistService.postTaskData(this.myForm).subscribe({
          next: this.handleUpdateResponse.bind(this),
          error: this.handleError.bind(this),
        });
      }
      if (this.myForm.value.action === 'edit') {
        let id = this.myForm.value.id;
        delete this.myForm.value.action;
        delete this.myForm.value.id;
        this.tasklistService.updateTaskData(this.myForm, id).subscribe({
          next: this.handleUpdateResponse.bind(this),
          error: this.handleError.bind(this),
        });
      }
    } else {
      // Handle form validation errors
    }
  }

  handleUpdateResponse(response: any) {
    // console.log('Form data submitted successfully:', response);
    this.successMessage = 'Form submitted successfully!';
    this.myForm.reset(); // Reset the form after submission
    this.errorMessage = null;
    setTimeout(() => {
      this.successMessage = null; // Hide success message after 5 seconds
      this.activeModal.close();
    }, 3000);
    // this.getData();
  }

  handleError(error: any) {
    console.error('Error submitting form data:', error);
    this.errorMessage = error;
    setTimeout(() => {
      this.errorMessage = null; // Hide error message after 5 seconds
    }, 5000);
  }
}
