import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionComponent } from './action/action.component';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { CreateComponent } from './create/create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoryComponent } from './history/history.component';
import { ModifyComponent } from './modify/modify.component';
import { VerifyComponent } from './verify/verify.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: 'create', component: CreateComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'modify/:id', component: ModifyComponent },
  { path: 'assigned-tasks', component: AssignedTasksComponent },
  { path: 'action/:id', component: ActionComponent },
  { path: 'verify/:id', component: VerifyComponent },
  { path: 'view/:id', component: ViewComponent },
  { path: 'action/view/:id', component: ViewComponent },

  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HazardRiskRoutingModule { }
