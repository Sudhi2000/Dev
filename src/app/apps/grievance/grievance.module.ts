import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';

import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatDialogModule } from '@angular/material/dialog';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule, NgbRating, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxImageCompressService } from 'ngx-image-compress';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { GrievanceRoutingModule } from './grievance-routing.module';
import { ReportComponent } from './report-non-grievance/report.component';
import { RegisterComponent } from './register/register.component';
import { ReportGrievanceComponent } from './report-grievance/report-grievance.component';
import { NewSubmissionComponent } from './new-submission/new-submission.component';
import { LoadingScreenModule } from '../loading-screen/loading-screen.module';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { ViewGrievanceComponent } from './view-grievance/view-grievance.component';
import { ViewNonGrievanceComponent } from './view-non-grievance/view-non-grievance.component';
import { GrievanceActionComponent } from './grievance-action/grievance-action.component';
import { NonGrievanceActionComponent } from './non-grievance-action/non-grievance-action.component';
import { ModifyNonGrievanceComponent } from './modify-non-grievance/modify-non-grievance.component';
import { ModifyGrievanceComponent } from './modify-grievance/modify-grievance.component';
import { AddCommitteeMemberComponent } from './grievance-action/add-committee-member/add-committee-member.component';
import { EditEmployeeComponent } from './grievance-action/edit-employee/edit-employee.component';
import { AddNomineeComponent } from './grievance-action/add-nominee/add-nominee.component';
import { AddRespondentComponent } from './grievance-action/add-respondent/add-respondent.component';
import { AddEmployeeComponent } from './grievance-action/add-employee/add-employee.component';
import { AddLegalAdvisorComponent } from './grievance-action/add-legal-advisor/add-legal-advisor.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ComplaintActionComponent } from './complaint-action/complaint-action.component';
import { ViewComplaintComponent } from './view-complaint/view-complaint.component';
import { NewTopicComponent } from './new-topic/new-topic.component';
import { NewEmployeeShiftComponent } from './new-employee-shift/new-employee-shift.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportParameterComponent } from './register/report-parameter/report-parameter.component';
import { NewAllegedPartyComponent } from './new-alleged-party/new-alleged-party.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    ReportComponent,
    RegisterComponent,
    ReportGrievanceComponent,
    NewSubmissionComponent,
    AssignedTasksComponent,
    ViewGrievanceComponent,
    ViewNonGrievanceComponent,
    GrievanceActionComponent,
    NonGrievanceActionComponent,
    ModifyNonGrievanceComponent,
    ModifyGrievanceComponent,
    AddCommitteeMemberComponent,
    EditEmployeeComponent,
    AddNomineeComponent,
    AddRespondentComponent,
    AddEmployeeComponent,
    AddLegalAdvisorComponent,
    FeedbackComponent,
    ComplaintActionComponent,
    ViewComplaintComponent,
    NewTopicComponent,
    NewEmployeeShiftComponent,
    DashboardComponent,
    ReportParameterComponent,
    NewAllegedPartyComponent
  ],
  imports: [
    CommonModule,
    GrievanceRoutingModule,
    MatDialogModule,
    FeahterIconModule,
    PerfectScrollbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule, ReactiveFormsModule,
    NgxDatatableModule,
    NgApexchartsModule,
    QuillModule,
    LightboxModule,
    NgSelectModule,
    NgbModule,
    MatDatepickerModule,
    MatTabsModule,
    NgxDropzoneModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    SweetAlert2Module,
    MatSelectModule,
    MatIconModule,
    MatButtonToggleModule,
    MatMenuModule,
    NgbRatingModule,
    LoadingScreenModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
  ]
})
export class GrievanceModule { }
