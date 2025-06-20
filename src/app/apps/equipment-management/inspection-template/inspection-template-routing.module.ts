import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CreateComponent } from './create/create.component';
import { ModifyComponent } from './modify/modify.component';

const routes: Routes = [
  {path:'register',component:RegisterComponent},
  {path:'create',component:CreateComponent},
  {path:'modify/:id',component:ModifyComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionTemplateRoutingModule { }
