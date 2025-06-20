import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModifyComponent } from './modify/modify.component';
import { RegisterComponent } from './register/register.component';
import { ReportComponent } from './report/report.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {path:'register',component:RegisterComponent},
  {path:'report',component:ReportComponent},
  {path:'modify/:id',component:ModifyComponent},
  {path:'view/:id',component:ViewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SustainabilityRoutingModule { }
