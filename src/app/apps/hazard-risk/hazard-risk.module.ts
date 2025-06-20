import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { HazardRiskRoutingModule } from './hazard-risk-routing.module';
import { CreateComponent } from './create/create.component';
import { HistoryComponent } from './history/history.component';
import { ModifyComponent } from './modify/modify.component';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { ActionComponent } from './action/action.component';
import { VerifyComponent } from './verify/verify.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { ViewComponent } from './view/view.component';
import { NewObservationComponent } from './new-observation/new-observation.component';
import { EmailComponent } from './email/email.component';
import { LoadingScreenModule } from '../loading-screen/loading-screen.module';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { RejectReasonComponent } from './verify/reject-reason/reject-reason.component';
import { ReportParameterComponent } from './history/report-parameter/report-parameter.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    CreateComponent,
    HistoryComponent,
    ModifyComponent,
    AssignedTasksComponent,
    ActionComponent,
    VerifyComponent,
    DashboardComponent,
    ViewComponent,
    NewObservationComponent,
    EmailComponent,

    RejectReasonComponent,
      ReportParameterComponent
  ],
  imports: [
    CommonModule,
    HazardRiskRoutingModule,
    MatDialogModule,
    FeahterIconModule,
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
    LoadingScreenModule,
    PerfectScrollbarModule
  ],
  providers: [NgxImageCompressService, CurrencyPipe],

})
export class HazardRiskModule { }
