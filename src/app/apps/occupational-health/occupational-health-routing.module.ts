import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'clinical-suite',
    loadChildren: () => import('./clinical-suite/clinical-suite.module').then(m => m.ClinicalSuiteModule)
  },
  {
    path: 'medicine-inventory',
    loadChildren: () => import('./medicine-inventory/medicine-inventory.module').then(m => m.MedicineInventoryModule)
  },
  {
    path: 'medical-records',
    loadChildren: () => import('./medical-records/medical-records.module').then(m => m.MedicalRecordsModule)
  },
  {path:'dashboard',component:DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OccupationalHealthRoutingModule { }
