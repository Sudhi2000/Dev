import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { MaterialityService } from 'src/app/services/materiality-assessment.api.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {

  @ViewChild('otpBox1') otpBox1: ElementRef;
  @ViewChild('otpBox2') otpBox2: ElementRef;
  @ViewChild('otpBox3') otpBox3: ElementRef;
  @ViewChild('otpBox4') otpBox4: ElementRef;
  @ViewChild('otpBox5') otpBox5: ElementRef;
  @ViewChild('otpBox6') otpBox6: ElementRef;
  otpForm: FormGroup;
  authForm: FormGroup
  isOtpSectionVisible = false;
  verificationId: any
  refId: any

  Form: FormGroup

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmailVerificationComponent>,
    private _snackBar: MatSnackBar,
    private apiService: MaterialityService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  get f() {
    return this.Form.controls;
  }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      id: [this.data],
    })

    this.otpForm = this.formBuilder.group({
      otp1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      surveyReference:['']
    });
  }

  initOtpBoxFocus() {
    const otpBoxes = [
      this.otpBox1.nativeElement,
      this.otpBox2.nativeElement,
      this.otpBox3.nativeElement,
      this.otpBox4.nativeElement,
      this.otpBox5.nativeElement,
      this.otpBox6.nativeElement,
    ];

    otpBoxes.forEach((box, index) => {
      box.addEventListener('input', (event: any) => {
        const value = event.target.value;
        const inputLength = value.length;

        const sanitizedValue = value.replace(/\D/g, '').slice(0, 1);
        event.target.value = sanitizedValue;

        if (inputLength === 1 && index < otpBoxes.length - 1) {
          const nextInput = otpBoxes[index + 1];
          nextInput.focus();
        }
      });

      box.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Backspace' && index > 0 && box.value.length === 0) {
          event.preventDefault();
          const previousInput = otpBoxes[index - 1];
          previousInput.focus();
        }
      });
    });
  }

  submitEmail() {
    this.apiService.verify_materiality_email(this.Form.value).subscribe({
      next: (result: any) => {
        console.log("Result: ",result)
        if (result.verified) {
          const statusText = "Email have been verified successfully.Check for OTP."
          this._snackBar.open(statusText, 'Ok', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.Form.controls['email'].disable()
          this.otpForm.controls['surveyReference'].setValue(result.data.reference_id)
          this.isOtpSectionVisible = true;
          setTimeout(() => {
            this.initOtpBoxFocus();
          });
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  confirm(){
    const otpNumber = Number(this.otpForm.value.otp1 + this.otpForm.value.otp2 + this.otpForm.value.otp3 + this.otpForm.value.otp4);
    const data  = {
      otp:otpNumber,
      reference:this.otpForm.value.surveyReference
    }
    this.Form.controls['email'].enable()
    this.apiService.verify_materiality_email_otp(data).subscribe({
      next:(result: any) => {
        const data = {
          code : result.code,
          email: this.Form.value.email
        }
        if(result.code == 200){
          this.dialogRef.close(data)
        }else{

        }
      },
      error:(err: any) => {},
      complete:() => {}
    })
  }


  moveFocus(event: any, nextInput: any) {
  const input = event.target;
  if (input.value.length === 1 && nextInput) {
    nextInput.focus();
  }
}

}
