import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicHazardRiskCreateComponent } from './public-hazard-risk-create/public-hazard-risk-create.component';
import { ReportingModuleSelectionComponent } from './reporting-module-selection/reporting-module-selection.component';

const routes: Routes = [
  {path:'',component:ReportingModuleSelectionComponent},
  {path:'hazard-risk/report',component:PublicHazardRiskCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicReportingRoutingModule { }
