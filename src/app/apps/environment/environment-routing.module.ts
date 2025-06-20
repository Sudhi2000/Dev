import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddConsumptionComponent } from './add-consumption/add-consumption.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EnvironmentActionComponent } from './environment-assigned/environment-action/environment-action.component';
import { EnvironmentAssignedComponent } from './environment-assigned/environment-assigned.component';
import { EnvironmentHistoryComponent } from './environment-history/environment-history.component';
import { ModifyConsumptionComponent } from './modify-consumption/modify-consumption.component';
import { ViewEnvironmentDetailsComponent } from './view-environment-details/view-environment-details.component';

const routes: Routes = [
  {path:'history',component:EnvironmentHistoryComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'consumption/create',component:AddConsumptionComponent},
  {path:'consumption/modify/:id',component:ModifyConsumptionComponent},
  {path:'consumption/view/:id',component:ViewEnvironmentDetailsComponent},
  {path:'assigned',component:EnvironmentAssignedComponent},
  {path:'assigned/action/:id',component:EnvironmentActionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnvironmentRoutingModule { }
