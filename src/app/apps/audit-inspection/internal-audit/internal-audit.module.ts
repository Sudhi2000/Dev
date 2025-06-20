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
import { InternalAuditRoutingModule } from './internal-audit-routing.module';
import { ScheduleComponent } from './schedule/schedule.component';
import { RegisterComponent } from './register/register.component';
import { TasksComponent } from './tasks/tasks.component';
import { QueueComponent } from './queue/queue.component';
import { NewAuditeeComponent } from './new-auditee/new-auditee.component';
import { ModifyComponent } from './modify/modify.component';
import { ActionComponent } from './action/action.component';
import { AddAuditorComponent } from './add-auditor/add-auditor.component';
import { AuditComponent } from './audit/audit.component';
import { AuditChecklistComponent } from './audit/audit-checklist/audit-checklist.component';
import { CallbackPipe } from './MyFilterPipe';
import { RemarksComponent } from './audit/audit-checklist/remarks/remarks.component';
import { UpdateActionPlanComponent } from './update-action-plan/update-action-plan.component';
import { ViewActionPlanComponent } from './view-action-plan/view-action-plan.component';
import { ViewAuditComponent } from './view-audit/view-audit.component';
import { LoadingScreenModule } from '../../loading-screen/loading-screen.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ActionPlanComponent } from './audit/action-plan/action-plan.component';
import { ActualStartDateComponent } from './audit/actual-start-date/actual-start-date.component';
import { CompletedAuditComponent } from './completed-audit/completed-audit.component';
import { NewFactoryComponent } from './new-factory/new-factory.component';
import { NewFactoryContactPersonComponent } from './new-factory-contact-person/new-factory-contact-person.component';
import { ModifyAuditeeComponent } from './modify-auditee/modify-auditee.component';
import { CorrectiveRegisterComponent } from './corrective-register/corrective-register.component';
import { CommandComponent } from './audit/audit-checklist/command/command.component';
import { CorporateuserUpdateActionPlanComponent } from './corporateuser-update-action-plan/corporateuser-update-action-plan.component';
import { ViewActionPlanDocumentComponent } from './view-action-plan-document/view-action-plan-document.component';
import { ReportParameterComponent } from './register/report-parameter/report-parameter.component';
import { NewProcessTypeComponent } from './new-process-type/new-process-type.component';
import { UploadEvidenceComponent } from './audit/audit-checklist/upload-evidence/upload-evidence.component';
import { UploadFacilityPhotoComponent } from './audit/upload-facility-photo/upload-facility-photo.component';

@NgModule({
  declarations: [
    ScheduleComponent,
    RegisterComponent,
    TasksComponent,
    CallbackPipe,
    QueueComponent,
    NewAuditeeComponent,
    ModifyComponent,
    ActionComponent,
    AddAuditorComponent,
    AuditComponent,
    AuditChecklistComponent,
    RemarksComponent,
    UpdateActionPlanComponent,
    ViewActionPlanComponent,
    ViewAuditComponent,
    ActionPlanComponent,
    ActualStartDateComponent,
    CompletedAuditComponent,
    NewFactoryComponent,
    NewFactoryContactPersonComponent,
    ModifyAuditeeComponent,
    CorrectiveRegisterComponent,
    CommandComponent,
    CorporateuserUpdateActionPlanComponent,
    ViewActionPlanDocumentComponent,
    ReportParameterComponent,
    NewProcessTypeComponent,
    UploadEvidenceComponent,
    UploadFacilityPhotoComponent
  ],
  imports: [
    CommonModule,
    InternalAuditRoutingModule,
    FeahterIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule, ReactiveFormsModule,
    NgxDatatableModule,
    NgApexchartsModule,
    QuillModule,
    MatDialogModule,
    NgSelectModule,
    NgbModule,
    MatDatepickerModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    SweetAlert2Module,
    MatSelectModule,
    MatIconModule,
    MatButtonToggleModule,
    MatMenuModule,
    LoadingScreenModule,
    PdfViewerModule,
    NgxDropzoneModule
  ]
})
export class InternalAuditModule { }
