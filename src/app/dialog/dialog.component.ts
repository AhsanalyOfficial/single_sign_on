import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  applicationForm: any = FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appService: ApplicationService
  ) {
    this.applicationForm = this.fb.group({
      name: [data?.application?.name || '', Validators.required],
      homePageURL: [
        data?.application?.homePageURL || '',
        [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)],
      ],
      applicationType: [
        data?.application?.applicationType || '',
        Validators.required,
      ],
      authenticationProtocol: [
        data?.application?.authenticationProtocol || '',
        Validators.required,
      ],
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  addApp(): void {
    if (this.applicationForm.valid) {
      if (this.data.mode === 'add') {
        this.appService
          .addApplication(this.applicationForm.value)
          .then((data) => {
            this.dialogRef.close(data);
          });
      } else {
        this.appService
          .updateApplication(
            this.data.application.applicationId,
            this.applicationForm.value
          )
          .then((data) => {
            this.dialogRef.close(data);
          });
      }
    } else {
      this.applicationForm.markAllAsTouched();
    }
  }
}
