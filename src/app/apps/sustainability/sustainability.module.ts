import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { SustainabilityRoutingModule } from './sustainability-routing.module';
import { RegisterComponent } from './register/register.component';
import { ReportComponent } from './report/report.component';
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
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatCardModule } from '@angular/material/card';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { LoadingScreenModule } from '../loading-screen/loading-screen.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgxDropzoneModule } from 'ngx-dropzone';
// Ngx-dropzone-wrapper
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { AppService } from 'src/app/services/app.service';
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  // url: AppService.base_url+AppService.upload,
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { LightboxModule } from 'ngx-lightbox';
import { ModifyComponent } from './modify/modify.component';
import { ViewComponent } from './view/view.component';
import { ModifyImpactComponent } from './modify/modify-impact/modify-impact.component';
import { CreateUpdateImpactComponent } from './report/create-update-impact/create-update-impact.component';
import { CreateImpactTypeComponent } from './report/create-impact-type/create-impact-type.component';



@NgModule({
  declarations: [
    RegisterComponent,
    ReportComponent,
    ModifyComponent,
    ViewComponent,
    ModifyImpactComponent,
    CreateUpdateImpactComponent,
    CreateImpactTypeComponent,

  ],
  imports: [
    CommonModule,
    SustainabilityRoutingModule,
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
    LoadingScreenModule
  ]
})
export class SustainabilityModule { }
