import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionComponent } from './action/action.component';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { CreateTargetSettingComponent } from './create-target-setting/create-target-setting.component';
import { HistoryComponent } from './history/history.component';
import { UpdateProgressComponent } from './update-progress/update-progress.component';
import { ViewTargetComponent } from './view-target/view-target.component';

const routes: Routes = [
  {path:'history',component:HistoryComponent},
  {path:'create',component:CreateTargetSettingComponent},
  {path:'assigned-tasks',component:AssignedTasksComponent},
  {path:'action/:id',component:ActionComponent},
  {path:'view/:id',component:ViewTargetComponent},
  {path:'progress/:id',component:UpdateProgressComponent}





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TargetSettingRoutingModule { }
