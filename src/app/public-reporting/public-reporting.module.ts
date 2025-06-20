import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTimepickerModule } from 'mat-timepicker';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { LightboxModule } from 'ngx-lightbox';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';
import { FeahterIconModule } from '../core/feather-icon/feather-icon.module';
import { PublicHazardRiskCreateComponent } from './public-hazard-risk-create/public-hazard-risk-create.component';
import { PublicReportingRoutingModule } from './public-reporting-routing.module';
import { ReporterDetailsComponent } from './reporter-details/reporter-details.component';
import { ReportingModuleSelectionComponent } from './reporting-module-selection/reporting-module-selection.component';



@NgModule({
  declarations: [
    PublicHazardRiskCreateComponent,
    ReporterDetailsComponent,
    ReportingModuleSelectionComponent,
  ],
  imports: [
     CommonModule,
           PerfectScrollbarModule,
           MatDialogModule,
           FormsModule, 
           ReactiveFormsModule,
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
           PublicReportingRoutingModule
  ]
})
export class PublicReportingModule { }
