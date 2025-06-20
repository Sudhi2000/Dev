import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionComponent } from './action/action.component';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { AuditComponent } from './audit/audit.component';
import { CompletedAuditComponent } from './completed-audit/completed-audit.component';
import { ModifyComponent } from './modify/modify.component';
import { QueueComponent } from './queue/queue.component';
import { RegisterComponent } from './register/register.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { UpdateActionPlanComponent } from './update-action-plan/update-action-plan.component';
import { ViewActionPlanComponent } from './view-action-plan/view-action-plan.component';
import { ViewAuditComponent } from './view-audit/view-audit.component';
import { CorrectiveRegisterComponent } from './corrective-register/corrective-register.component';
import { CorrectiveCorporateuserComponent } from './corrective-corporateuser/corrective-corporateuser.component';

const routes: Routes = [
  {path:'schedule',component:ScheduleComponent},
  {path:'register',component:RegisterComponent},
  {path:'modify/:id',component:ModifyComponent},
  {path:'tasks',component:AssignedTasksComponent},
  {path:'action/:id',component:ActionComponent},
  {path:'queue',component:QueueComponent},
  {path:'audit/:id',component:AuditComponent},
  {path:'update-action-plan/:id',component:UpdateActionPlanComponent},
  {path:'view-action-plan/:id',component:ViewActionPlanComponent},
  {path:'view/:id',component:ViewAuditComponent},
  {path:'completed/:id',component:CompletedAuditComponent},
  {path:'corrective-register',component:CorrectiveRegisterComponent},
  {path:'corporateuser-corrective-action',component:CorrectiveCorporateuserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalAuditRoutingModule { }
