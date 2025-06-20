import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { InternalComponent } from './internal/internal.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { InvalidSubscriptionComponent } from './invalid-subscription/invalid-subscription.component';
import { UpgradeSubscriptionComponent } from './upgrade-subscription/upgrade-subscription.component';
import { UnderMaintenanceComponent } from './under-maintenance/under-maintenance.component';


@NgModule({
  declarations: [
    InternalComponent,
    UnauthorizedComponent,
    InvalidSubscriptionComponent,
    UpgradeSubscriptionComponent,
    UnderMaintenanceComponent
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule
  ]
})
export class ErrorModule { }
