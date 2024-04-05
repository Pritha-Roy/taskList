import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TasklistService } from '../tasklist.service';

@Component({
  standalone: true,
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  //   styleUrls: ['./confirmation-modal.component.css'],
})
export class ConfirmationModalComponent {
  @Input() data: any;
  @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();
  showConfirmation: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private tasklistService: TasklistService
  ) {}

  open() {
    this.showConfirmation = true;
  }

  cancel() {
    this.showConfirmation = false;
    this.activeModal.close();
  }

  confirm() {
    this.showConfirmation = false;
    this.tasklistService.deleteTask(this.data.task.id).subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleError.bind(this),
    });
    this.confirmed.emit(true);
  }
  handleUpdateResponse(response: any) {
    // console.log('Form data submitted successfully:', response);
    this.successMessage = 'Form submitted successfully!';
    this.errorMessage = null;
    setTimeout(() => {
      this.successMessage = null; // Hide success message after 1 second
      this.activeModal.close();
    }, 1000);
    // this.getData();
  }

  handleError(error: any) {
    console.error('Error submitting form data:', error);
    this.errorMessage = error.error.message;
    setTimeout(() => {
      this.errorMessage = null; // Hide error message after 1 second
    }, 1000);
  }
}
