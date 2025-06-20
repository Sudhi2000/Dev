import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CreateComponent } from './create/create.component';
import { DisclosureComponent } from './disclosure/disclosure.component';
import { EsgTempComponent } from './disclosure/esg-temp/esg-temp.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GeneralDisclosureRegisterComponent } from './general-disclosure-register/general-disclosure-register.component';
import { GeneralDisclosureComponent } from './general-disclosure/general-disclosure.component';
import { GeneralDisclosureModifyComponent } from './general-disclosure-modify/general-disclosure-modify.component';

const routes: Routes = [
  // {
  //   path: 'general-disclosure',
  //   loadChildren: () => import('./general-disclosure/general-disclosure.module').then(m => m.GeneralDisclosureModule)
  // },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'create',
    component: CreateComponent
  },
  { path: 'disclosure/modify/:id', component: DisclosureComponent },
  { path: 'disclosure/view/:id', component: DisclosureComponent },
  { path: 'esg-temp', component: EsgTempComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'general_disclosure_register', component: GeneralDisclosureRegisterComponent },
  { path: 'general_disclosure_create', component: GeneralDisclosureComponent },
  { path: 'general_disclosure_modify/:id', component: GeneralDisclosureModifyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EsgRoutingModule { }
