import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component'
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatDialogModule} from '@angular/material/dialog';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthenticationOtpComponent } from './authentication-otp/authentication-otp.component';
import { VerifySurveyRespondentComponent } from './verify-survey-respondent/verify-survey-respondent.component';
@NgModule({
  declarations: [
    SignInComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    AuthenticationOtpComponent,
    VerifySurveyRespondentComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule, ReactiveFormsModule,
    MatSnackBarModule,
    NgbModule,
    MatDialogModule,
    SweetAlert2Module,
  ]
})
export class AuthenticationModule { }
