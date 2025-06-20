import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccidentActionComponent } from './accident-action/accident-action.component';
import { AccidentAssignedComponent } from './accident-assigned/accident-assigned.component';
import { AccidentModifyComponent } from './accident-modify/accident-modify.component';
import { AccidentRegisterComponent } from './accident-register/accident-register.component';
import { AccidentViewComponent } from './accident-view/accident-view.component';
import { CorrectiveActionsComponent } from './corrective-actions/corrective-actions.component';
import { CreateAccidentComponent } from './create-accident/create-accident.component';
import { CreateIncidentComponent } from './create-incident/create-incident.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncidentActionComponent } from './incident-action/incident-action.component';
import { IncidentAssignedComponent } from './incident-assigned/incident-assigned.component';
import { IncidentModifyComponent } from './incident-modify/incident-modify.component';
import { IncidentRegisterComponent } from './incident-register/incident-register.component';
import { IncidentViewComponent } from './incident-view/incident-view.component';
import { UpdateCorrectiveActionComponent } from './update-corrective-action/update-corrective-action.component';
import { CorrectiveActionRegisterComponent } from './corrective-action-register/corrective-action-register.component';
import { ViewCorrectiveActionComponent } from './view-corrective-action/view-corrective-action.component';

const routes: Routes = [
  {path:'dashboard',component:DashboardComponent},
  {path:'create-accident',component:CreateAccidentComponent},
  {path:'accident-register',component:AccidentRegisterComponent},
  {path:'corrective-action-register',component:CorrectiveActionRegisterComponent},
  {path:'accident-assigned',component:AccidentAssignedComponent},
  {path:'accident-action/:id',component:AccidentActionComponent},
  {path:'corrective-actions',component:CorrectiveActionsComponent},
  {path:'corrective-actions/:id',component:UpdateCorrectiveActionComponent},
  {path:'view-corrective-actions/:id',component:ViewCorrectiveActionComponent},
  {path:'accident-view/:id',component:AccidentViewComponent},
  {path:'accident-modify/:id',component:AccidentModifyComponent},
  {path:'create-incident',component:CreateIncidentComponent},
  {path:'incident-register',component:IncidentRegisterComponent},
  {path:'incident-modify/:id',component:IncidentModifyComponent},
  {path:'incident-view/:id',component:IncidentViewComponent},
  {path:'incident-action/:id',component:IncidentActionComponent},
  {path:'incident-assigned',component:IncidentAssignedComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccidentIncidentRoutingModule { }
