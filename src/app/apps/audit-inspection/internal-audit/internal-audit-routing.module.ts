import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionComponent } from './action/action.component';
import { AuditComponent } from './audit/audit.component';
import { ModifyComponent } from './modify/modify.component';
import { NewAuditeeComponent } from './new-auditee/new-auditee.component';
import { QueueComponent } from './queue/queue.component';
import { RegisterComponent } from './register/register.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TasksComponent } from './tasks/tasks.component';
import { UpdateActionPlanComponent } from './update-action-plan/update-action-plan.component';
import { ViewActionPlanComponent } from './view-action-plan/view-action-plan.component';
import { ViewAuditComponent } from './view-audit/view-audit.component';
import { CompletedAuditComponent } from './completed-audit/completed-audit.component';
import { CorrectiveRegisterComponent } from './corrective-register/corrective-register.component';
import { CorporateuserUpdateActionPlanComponent } from './corporateuser-update-action-plan/corporateuser-update-action-plan.component';

const routes: Routes = [
  {path:'schedule',component:ScheduleComponent},  
  {path:'register',component:RegisterComponent},
  {path:'tasks',component:TasksComponent},
  {path:'queue',component:QueueComponent},
  {path:'new-auditee',component:NewAuditeeComponent},
  {path:'modify/:id',component:ModifyComponent},
  {path:'action/:id',component:ActionComponent},
  {path:'audit/:id',component:AuditComponent},
  {path:'completed-audit/:id',component:CompletedAuditComponent},
  {path:'update-action-plan/:id',component:UpdateActionPlanComponent},
  {path:'corporate-update-action-plan/:id',component:CorporateuserUpdateActionPlanComponent},
  {path:'view-action-plan/:id',component:ViewActionPlanComponent},
  {path:'view/:id',component:ViewAuditComponent},
  {path:'corrective-register',component:CorrectiveRegisterComponent},










];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalAuditRoutingModule { }
