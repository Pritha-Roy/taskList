import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenIntercepterService } from './tasklist/token-intercepter.service';
import { TasklistComponent } from './tasklist/tasklist.component';
import { AddTaskModalComponent } from './tasklist/modals/add-task-modal.component';
import { ConfirmationModalComponent } from './tasklist/modals/confirmation-modal.component';
import { ManageTimeModalComponent } from './tasklist/modals/manage-time-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    TasklistComponent,
    AddTaskModalComponent,
    ConfirmationModalComponent,
    ManageTimeModalComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenIntercepterService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
