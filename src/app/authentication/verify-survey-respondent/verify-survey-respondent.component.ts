import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';

@Component({
  selector: 'app-verify-survey-respondent',
  templateUrl: './verify-survey-respondent.component.html',
  styleUrls: ['./verify-survey-respondent.component.scss']
})
export class VerifySurveyRespondentComponent implements OnInit {

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

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VerifySurveyRespondentComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private satisfactionService: SatisfactionService,
    private route: ActivatedRoute


  ) { }
  get f() {
    return this.authForm.controls;
  }
  ngOnInit(): void {
    const fullUrl = window.location.href;
    const segments = fullUrl.split('/');
    this.refId = segments.pop() || segments.pop(); 
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.otpForm = this.formBuilder.group({
      otp1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp5: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp6: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    });
  }

  // ngAfterViewInit(): void {
  //   this.initOtpBoxFocus();
  // }

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

  confirm() {
    // this.dialogRef.close();

    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
      this.authService.verify_respondent_otp(this.verificationId, otp).subscribe({
        next: (result: any) => {

          if (result[0].code === 200) {
            this.authForm.controls['email'].disable()
            this.dialogRef.close(this.authForm.value);
            // this.authService.otp_used(result[0].id, this.data.jwt).subscribe({
            //   next: (result: any) => {
            //   },
            //   error: (err: any) => {

            //   },
            //   complete: () => {
            //   }
            // });
          }
          else {
            const statusText = 'Entered OTP is Invalid';
            this._snackBar.open(statusText, 'Retry', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 3000
            });
          }
        },
        error: (err: any) => {
          if (err instanceof HttpErrorResponse && err.error.text === 'Not Valid') {
            const statusText = 'Entered OTP is Not Valid';
            this._snackBar.open(statusText, 'Retry', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 3000
            });
          } else {
          }
        },
        complete: () => {
          // this.dialogRef.close(otp);
        }
      });

    }
  }


  sendOTP() {
    const enteredEmail = this.authForm.value.email;

    this.satisfactionService.get_public_survey_response_details(this.refId).subscribe({
      next: (result: any) => {
        if (result.data && Array.isArray(result.data)) {
          const alreadyResponded = result.data.some((response: any) => {
            return response.attributes.email === enteredEmail
          }
          );

          if (alreadyResponded) {
            const statusText = `You’ve already completed this survey. Thank you!`
            this._snackBar.open(statusText, 'Ok', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          } else {
            this.authService.send_survey_otp(this.authForm.value, this.data).subscribe({
              next: (result: any) => {
                if (result[0].code === 200) {
                  this.verificationId = result[0].reference_id;
                  this.isOtpSectionVisible = true;
                  setTimeout(() => {
                    this.initOtpBoxFocus();
                  });
                }
              },
              error: (err: any) => {
              },
              complete: () => {
                this.authForm.controls['email'].disable();
              }
            });
          }

        }
      },
      error: () => {
        this.router.navigate(["/error/internal"]);
      }
    });
  }




  // backToLogin() {
  //   this.dialogRef.close();
  // }
}
