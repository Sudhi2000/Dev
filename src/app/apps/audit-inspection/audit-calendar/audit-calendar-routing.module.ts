import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditCalendarComponent } from './audit-calendar/audit-calendar.component';

const routes: Routes = [
  {path:'',component:AuditCalendarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditCalendarRoutingModule { }
