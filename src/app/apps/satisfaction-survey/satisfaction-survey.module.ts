import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SatisfactionSurveyRoutingModule } from './satisfaction-survey-routing.module';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgApexchartsModule } from "ng-apexcharts";
import {MatCardModule} from '@angular/material/card';
import { MatTimepickerModule } from 'mat-timepicker';
import {MatRadioModule} from '@angular/material/radio';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgxDropzoneModule } from 'ngx-dropzone';
// Ngx-dropzone-wrapper
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { LightboxModule } from 'ngx-lightbox';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { QuestionHistoryComponent } from './question-history/question-history.component';
import { LoadingScreenModule } from '../loading-screen/loading-screen.module';
import { ViewQuestionComponent } from './view-question/view-question.component';
import { ModifyQuestionComponent } from './modify-question/modify-question.component';
import { QuestionComponent } from './create-question/question/question.component';
import { AddParticipantComponent } from './create-survey/add-participant/add-participant.component';
import { AddQuestionComponent } from './create-survey/add-question/add-question.component';
import { ViewParticipantComponent } from './create-survey/view-participant/view-participant.component';
import { SurveyHistoryComponent } from './survey-history/survey-history.component';
import { ModifySurveyComponent } from './modify-survey/modify-survey.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { SurveyActionComponent } from './survey-action/survey-action.component';
import { PrivateSurveyComponent } from './private-survey/private-survey.component';
import { AssignedSurveysComponent } from './assigned-surveys/assigned-surveys.component';
import { ViewQuestionComponentNew } from './create-survey/view-question/view-question.component';
import { SurveyCategoryComponent } from './survey-category/survey-category.component';
import { SurveyQuestionCategoryComponent } from './survey-question-category/survey-question-category.component';
import { SurveyPurposeComponent } from './survey-purpose/survey-purpose.component';
// import { PublicSurveyComponent } from 'src/app/public-survey/public-survey/public-survey.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    CreateSurveyComponent,
    CreateQuestionComponent,
    QuestionHistoryComponent,
    ViewQuestionComponent,
    ViewQuestionComponentNew,
    ModifyQuestionComponent,
    QuestionComponent,
    AddParticipantComponent,
    AddQuestionComponent,
    ViewParticipantComponent,
    SurveyHistoryComponent,
    ModifySurveyComponent,
    ViewSurveyComponent,
    SurveyActionComponent,
    PrivateSurveyComponent,
    AssignedSurveysComponent,
    SurveyCategoryComponent,
    SurveyQuestionCategoryComponent,
    SurveyPurposeComponent,
    // PublicSurveyComponent
  ],
  imports: [
    CommonModule,
    SatisfactionSurveyRoutingModule,
    PerfectScrollbarModule,
    MatDialogModule,
    FormsModule, ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    DropzoneModule,
    MatSortModule,
    NgxDropzoneModule,
    MatAutocompleteModule,
    MatRadioModule,
    LightboxModule,
    MatChipsModule,
    MatCardModule,
    NgxDatatableModule,
    QuillModule,
    NgSelectModule,
    NgbModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTimepickerModule,
    SweetAlert2Module,
    MatIconModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatTabsModule,
    FeahterIconModule,
    NgApexchartsModule,
    LoadingScreenModule,
    QRCodeModule
  ]
})
export class SatisfactionSurveyModule { }
