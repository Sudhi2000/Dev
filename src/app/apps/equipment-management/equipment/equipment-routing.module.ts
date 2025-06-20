import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { RegisterComponent } from './register/register.component';
import { ActionComponent } from './action/action.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [  
  {path:'register',component:RegisterComponent},
  {path:'create',component:CreateComponent},
  {path:'action/:id',component:ActionComponent},
  {path:'view/:id',component:ViewComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentRoutingModule { }
