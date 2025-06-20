import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicalSuiteRoutingModule } from './clinical-suite-routing.module';
import { PatientRegisterComponent } from './patient-register/patient-register.component';


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
import { CreatePatientRecordComponent, MY_FORMATS } from './create-patient-record/create-patient-record.component';
import { NewSubDepartmentComponent } from '../../general-component/new-sub-department/new-sub-department.component';
import { ViewPatientRecordComponent } from './view-patient-record/view-patient-record.component';
import { ConsultationComponent } from './consultation/consultation.component';
import { DoctorConsultationComponent } from './doctor-consultation/doctor-consultation.component';
import { MedicineStockComponent } from './medicine-stock/medicine-stock.component';
import { CreateMedicalPrescriptionComponent } from './doctor-consultation/create-medical-prescription/create-medical-prescription.component';
import { PharmacyQueueComponent } from './pharmacy-queue/pharmacy-queue.component';
import { PharmacyActionComponent } from './pharmacy-action/pharmacy-action.component';
import { ViewMedicinePrescriptionComponent } from './pharmacy-action/view-medicine-prescription/view-medicine-prescription.component';
import { IssueMedicinePrescriptionComponent } from './pharmacy-action/issue-medicine-prescription/issue-medicine-prescription.component';
import { ViewMedicalPrescriptionComponent } from './doctor-consultation/view-medical-prescription/view-medical-prescription.component';
import { LoadingScreenModule } from '../../loading-screen/loading-screen.module';
import { OutsideMedicineComponent } from './doctor-consultation/outside-medicine/outside-medicine.component';
import { UpdateCheckOutComponent } from './pharmacy-action/update-check-out/update-check-out.component';
import { PatientRecordModifyComponent } from './patient-record-modify/patient-record-modify.component';
import { NewDiseaseComponent } from '../../general-component/new-disease/new-disease.component';
import { PatientReconsultaionComponent } from './patient-reconsultaion/patient-reconsultaion.component';
import { ViewPatientReconsultationComponent } from './view-patient-reconsultation/view-patient-reconsultation.component';
import { CreateSymptomComponent } from './create-patient-record/create-symptom/create-symptom.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { ReportParameterComponent } from './patient-register/report-parameter/report-parameter.component';
import { SelectLanguageComponent } from './doctor-consultation/select-language/select-language.component';
import { EmailComponent } from './email/email.component';
import { GoToBooleanComponent } from './patient-register/go-to-boolean/go-to-boolean.component';
import { NonConsultaionComponent } from './non-consultaion/non-consultaion.component';
import { CreateHospitalComponent } from './doctor-consultation/create-hospital/create-hospital.component';
import { NoReconsultationComponent } from './no-reconsultation/no-reconsultation.component';


@NgModule({
  declarations: [
    PatientRegisterComponent,
    CreatePatientRecordComponent,
    NewSubDepartmentComponent,
    ViewPatientRecordComponent,
    ConsultationComponent,
    DoctorConsultationComponent,
    MedicineStockComponent,
    CreateMedicalPrescriptionComponent,
    PharmacyQueueComponent,
    PharmacyActionComponent,
    ViewMedicinePrescriptionComponent,
    IssueMedicinePrescriptionComponent,
    ViewMedicalPrescriptionComponent,
    OutsideMedicineComponent,
    UpdateCheckOutComponent,
    PatientRecordModifyComponent,
    NewDiseaseComponent,
    PatientReconsultaionComponent,
    ViewPatientReconsultationComponent,
    CreateSymptomComponent,
    ReportParameterComponent,
    SelectLanguageComponent,
    EmailComponent,
    GoToBooleanComponent,
    NonConsultaionComponent,
    CreateHospitalComponent,
    NoReconsultationComponent

  ],
  imports: [
    CommonModule,
    ClinicalSuiteRoutingModule,

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
    MatCheckboxModule
  ], providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ClinicalSuiteModule { }
