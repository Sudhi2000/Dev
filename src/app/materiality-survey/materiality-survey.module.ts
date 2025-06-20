import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';

import { MaterialitySurveyRoutingModule } from './materiality-survey-routing.module';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { SurveyEndComponent } from './survey-end/survey-end.component';
import { EmailVerificationComponent } from './create-survey/email-verification/email-verification.component';
import { AuthenticationRoutingModule } from '../authentication/authentication-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatSliderModule } from '@angular/material/slider';


@NgModule({
  declarations: [
    CreateSurveyComponent,
    SurveyEndComponent,
    EmailVerificationComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MaterialitySurveyRoutingModule,
    MatIconModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
MatSliderModule,
    AuthenticationRoutingModule,
    FormsModule, ReactiveFormsModule,
    MatSnackBarModule,
    NgbModule,
    MatDialogModule,
    SweetAlert2Module,
  ]
})
export class MaterialitySurveyModule { }
