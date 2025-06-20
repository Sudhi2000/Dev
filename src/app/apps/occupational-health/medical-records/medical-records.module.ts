import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalRecordsRoutingModule } from './medical-records-routing.module';
import { MaternityRegisterComponent } from './maternity-register/maternity-register.component';
import { CreateBenefitComponent } from './create-benefit/create-benefit.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

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
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';
import { LoadingScreenModule } from '../../loading-screen/loading-screen.module';
import { AddDocumentComponent } from './create-benefit/add-document/add-document.component';
import { AddEntitlementComponent } from './create-benefit/add-entitlement/add-entitlement.component';
import { NewBenefitTypeComponent } from '../../general-component/new-benefit-type/new-benefit-type.component';
import { BenefitModifyComponent } from './benefit-modify/benefit-modify.component';
import { UpdateDocumentComponent } from './benefit-modify/update-document/update-document.component';
import { UpdateEntitlementComponent } from './benefit-modify/update-entitlement/update-entitlement.component';
import { BenefitViewComponent } from './benefit-view/benefit-view.component';
import { ViewDocumentComponent } from './benefit-view/view-document/view-document.component';
import { ViewEnttitlementComponent } from './benefit-view/view-enttitlement/view-enttitlement.component';
import { ViewDocumentDataComponent } from './benefit-view/view-document-data/view-document-data.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReportParameterComponent } from './maternity-register/report-parameter/report-parameter.component';




@NgModule({
  declarations: [
    MaternityRegisterComponent,
    CreateBenefitComponent,
    AddDocumentComponent,
    AddEntitlementComponent,
    NewBenefitTypeComponent,
    BenefitModifyComponent,
    UpdateDocumentComponent,
    UpdateEntitlementComponent,
    BenefitViewComponent,
    ViewDocumentComponent,
    ViewEnttitlementComponent,
    ViewDocumentDataComponent,
    ReportParameterComponent,
  ],
  imports: [
    CommonModule,
    MedicalRecordsRoutingModule,

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
    LoadingScreenModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule
  ]
})
export class MedicalRecordsModule { }
