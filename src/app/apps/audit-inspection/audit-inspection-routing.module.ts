import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuditDashboardComponent } from './audit-dashboard/audit-dashboard.component';

const routes: Routes = [
  {path:'dashboard',component:AuditDashboardComponent},
  {
    path: 'internal-audit',
    loadChildren: () => import('./internal-audit/internal-audit.module').then(m => m.InternalAuditModule)
  },
  {
    path: 'external-audit',
    loadChildren: () => import('./external-audit/external-audit.module').then(m => m.ExternalAuditModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./audit-calendar/audit-calendar.module').then(m => m.AuditCalendarModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditInspectionRoutingModule { }
