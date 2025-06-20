import { NgModule } from '@angular/core';
import { CommonModule,CurrencyPipe } from '@angular/common';


import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxImageCompressService } from 'ngx-image-compress';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatDialogModule } from '@angular/material/dialog';
import { ExternalAuditRoutingModule } from './external-audit-routing.module';
import { ScheduleComponent } from './schedule/schedule.component';
import { RegisterComponent } from './register/register.component';
import { ModifyComponent } from './modify/modify.component';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { ActionComponent } from './action/action.component';
import { QueueComponent } from './queue/queue.component';
import { AuditComponent } from './audit/audit.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ActionPlanComponent } from './audit/action-plan/action-plan.component';
import { UpdateActionPlanComponent } from './update-action-plan/update-action-plan.component';
import { ViewActionPlanComponent } from './view-action-plan/view-action-plan.component';
import { CreateStandardComponent } from './schedule/create-standard/create-standard.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ViewAuditComponent } from './view-audit/view-audit.component';
import { NewRatingComponent } from './audit/new-rating/new-rating.component';
import { CompletedAuditComponent } from './completed-audit/completed-audit.component';
import { LoadingScreenModule } from '../../loading-screen/loading-screen.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { ReportPreviewComponent } from './report-preview/report-preview.component';
import { GenerateReportComponent } from './register/generate-report/generate-report.component';
import { CreateAuditFirmComponent } from './create-audit-firm/create-audit-firm.component';
import { CorrectiveRegisterComponent} from './corrective-register/corrective-register.component'
import { ViewActionPlanDocumentComponent } from './view-action-plan-document/view-action-plan-document.component';
import { CorrectiveCorporateuserComponent } from './corrective-corporateuser/corrective-corporateuser.component';
import { NewAuditGradeComponent } from './audit/new-audit-grade/new-audit-grade.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    ScheduleComponent,
    RegisterComponent,
    ModifyComponent,
    AssignedTasksComponent,
    ActionComponent,
    QueueComponent,
    AuditComponent,
    ActionPlanComponent,
    UpdateActionPlanComponent,
    ViewActionPlanComponent,
    CreateStandardComponent,
    ViewAuditComponent,
    NewRatingComponent,
    CompletedAuditComponent,
    ReportPreviewComponent,
    GenerateReportComponent,
    CreateAuditFirmComponent,
    CorrectiveRegisterComponent,
    ViewActionPlanDocumentComponent,
    CorrectiveCorporateuserComponent,
    NewAuditGradeComponent,
    

  ],
  imports: [
    CommonModule,
    ExternalAuditRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule, ReactiveFormsModule,
    NgxDatatableModule,
    QuillModule,
    NgSelectModule,
    NgbModule,
    PdfViewerModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    SweetAlert2Module,
    MatIconModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatTabsModule,
    FeahterIconModule,
    NgApexchartsModule,
    MatDialogModule,
    NgxExtendedPdfViewerModule,
    LoadingScreenModule,
    NgxDropzoneModule,
    DropzoneModule,
    MatAutocompleteModule
  ]
})
export class ExternalAuditModule { }
