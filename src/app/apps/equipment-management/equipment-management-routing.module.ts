import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { GeoTagComponent } from './geo-tag/geo-tag.component';

const routes: Routes = [
  {path:'client',component:ClientComponent},
  {path:'geo-tag',component:GeoTagComponent},
  {
    path: 'equipment',
    loadChildren: () => import('./equipment/equipment.module').then(m => m.EquipmentModule)
  },
  {
    path: 'inspection-template',
    loadChildren: () => import('./inspection-template/inspection-template.module').then(m => m.InspectionTemplateModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentManagementRoutingModule { }
