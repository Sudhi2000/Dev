import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { VerifySurveyRespondentComponent } from 'src/app/authentication/verify-survey-respondent/verify-survey-respondent.component';
import { AuthService } from 'src/app/services/auth.api.service';

@Component({
  selector: 'app-reporter-details',
  templateUrl: './reporter-details.component.html',
  styleUrls: ['./reporter-details.component.scss']
})
export class ReporterDetailsComponent implements OnInit {


  Form: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReporterDetailsComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private authService: AuthService,

  ) { }
  get f() {
    return this.Form.controls;
  }
  ngOnInit() {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required]],
      employee_id: ['', [Validators.required]],
      email: [null, [Validators.email]],
      contact_no: [null],
    });
  }

  // ngAfterViewInit(): void {
  //   this.initOtpBoxFocus();
  // }

 

  submit() {
    this.dialogRef.close(this.Form.value)
  }


 

}
