import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalComponent } from './internal/internal.component';
import { InvalidSubscriptionComponent } from './invalid-subscription/invalid-subscription.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { UpgradeSubscriptionComponent } from './upgrade-subscription/upgrade-subscription.component';
import { UnderMaintenanceComponent } from './under-maintenance/under-maintenance.component';

const routes: Routes = [
  {path:'internal',component:InternalComponent},
  {path:'unauthorized',component:UnauthorizedComponent},
  {path:'invalid-subscription',component:InvalidSubscriptionComponent},
  {path:'upgrade-subscription',component:UpgradeSubscriptionComponent},
  {path:'under-maintenance',component:UnderMaintenanceComponent},





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
