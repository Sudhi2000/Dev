import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultationComponent } from './consultation/consultation.component';
import { CreatePatientRecordComponent } from './create-patient-record/create-patient-record.component';
import { DoctorConsultationComponent } from './doctor-consultation/doctor-consultation.component';
import { MedicineStockComponent } from './medicine-stock/medicine-stock.component';
import { PatientRegisterComponent } from './patient-register/patient-register.component';
import { PharmacyActionComponent } from './pharmacy-action/pharmacy-action.component';
import { PharmacyQueueComponent } from './pharmacy-queue/pharmacy-queue.component';
import { ViewPatientRecordComponent } from './view-patient-record/view-patient-record.component';
import { PatientRecordModifyComponent } from './patient-record-modify/patient-record-modify.component'
import { PatientReconsultaionComponent } from './patient-reconsultaion/patient-reconsultaion.component';
import { NonConsultaionComponent } from './non-consultaion/non-consultaion.component';
import { NoReconsultationComponent } from './no-reconsultation/no-reconsultation.component';

const routes: Routes = [
  { path: 'create', component: CreatePatientRecordComponent },
  { path: 'register', component: PatientRegisterComponent },
  { path: 'consultation', component: ConsultationComponent },
  { path: 'view/:id', component: ViewPatientRecordComponent },
  { path: 'consultation/view/:id', component: ViewPatientRecordComponent },
  { path: 'pharmacy-queue/view/:id', component: ViewPatientRecordComponent },
  { path: 'modify/:id', component: PatientRecordModifyComponent },
  { path: 'medicine-stock', component: MedicineStockComponent },
  { path: 'pharmacy-queue', component: PharmacyQueueComponent },
  { path: 'doctor-consultation/:id', component: DoctorConsultationComponent },
  { path: 'pharmacy-action/:id', component: PharmacyActionComponent },
  { path: 'patient-reconsultation/:id', component: PatientReconsultaionComponent },
  { path: 'create-non-consultation', component: NonConsultaionComponent },
  { path: 'patient-no-reconsultation/:id', component: NoReconsultationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicalSuiteRoutingModule { }
