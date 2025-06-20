import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoryComponent } from './history/history.component';
import { ModifyComponent } from './modify/modify.component';
import { ViewComponent } from './view/view.component';


const routes: Routes = [
  {path:'dashboard',component:DashboardComponent},
  {path:'register',component:HistoryComponent},


  {path:'create',component:CreateComponent},
  {path:'modify/:id',component:ModifyComponent},
  {path:'view/:id',component:ViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RagRoutingModule { }
