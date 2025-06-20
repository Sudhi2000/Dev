import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.api.service';

@Component({
  selector: 'app-authentication-otp',
  templateUrl: './authentication-otp.component.html',
  styleUrls: ['./authentication-otp.component.scss']
})
export class AuthenticationOtpComponent implements OnInit, AfterViewInit {
  @ViewChild('otpBox1') otpBox1: ElementRef;
  @ViewChild('otpBox2') otpBox2: ElementRef;
  @ViewChild('otpBox3') otpBox3: ElementRef;
  @ViewChild('otpBox4') otpBox4: ElementRef;
  @ViewChild('otpBox5') otpBox5: ElementRef;
  @ViewChild('otpBox6') otpBox6: ElementRef;
  otpForm: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AuthenticationOtpComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private authService: AuthService,

  ) { }

  ngOnInit(): void {
    this.otpForm = this.formBuilder.group({
      otp1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp5: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      otp6: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    });
  }

  ngAfterViewInit(): void {
    this.initOtpBoxFocus();
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

  confirm() {
    // this.dialogRef.close();

    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
      this.authService.verify_otp(this.data.id, otp, this.data.jwt).subscribe({
        next: (result: any) => {
          if (result[0].status === 'valid') {
            this.authService.otp_used(result[0].id, this.data.jwt).subscribe({
              next: (result: any) => {
              },
              error: (err: any) => {

              },
              complete: () => {
              }
            });
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
          this.dialogRef.close(otp);
        }
      });

    }
  }


  resendOTP() {

  }

  backToLogin() {
    this.dialogRef.close();
  }
}
