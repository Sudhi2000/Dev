import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaternityRegisterComponent } from './maternity-register/maternity-register.component';
import { CreateBenefitComponent } from './create-benefit/create-benefit.component';
import { BenefitModifyComponent } from './benefit-modify/benefit-modify.component';
import { BenefitViewComponent } from './benefit-view/benefit-view.component';

const routes: Routes = [
  {path:'register',component:MaternityRegisterComponent},
  {path:'create-benefit',component:CreateBenefitComponent},
  {path:'update-benefit/:id',component:BenefitModifyComponent},
  {path:'view-benefit/:id',component:BenefitViewComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MedicalRecordsRoutingModule { }