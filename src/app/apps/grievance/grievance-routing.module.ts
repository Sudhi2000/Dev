import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ReportComponent } from './report-non-grievance/report.component';
import { ReportGrievanceComponent } from './report-grievance/report-grievance.component';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { GrievanceActionComponent } from './grievance-action/grievance-action.component';
import { NonGrievanceActionComponent } from './non-grievance-action/non-grievance-action.component';
import { ViewGrievanceComponent } from './view-grievance/view-grievance.component';
import { ViewNonGrievanceComponent } from './view-non-grievance/view-non-grievance.component';
import { ModifyGrievanceComponent } from './modify-grievance/modify-grievance.component';
import { ModifyNonGrievanceComponent } from './modify-non-grievance/modify-non-grievance.component';
import { ComplaintActionComponent } from './complaint-action/complaint-action.component';
import { ViewComplaintComponent } from './view-complaint/view-complaint.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [ 
{path:'report',component:ReportComponent},
{path:'report-grievance',component:ReportGrievanceComponent},
{path:'register',component:RegisterComponent},
{path:'assigned-tasks',component:AssignedTasksComponent},
{path:'grievance-action/:id',component:GrievanceActionComponent},
{path:'non-grievance-action/:id',component:NonGrievanceActionComponent},
{path:'complaint-action/:id',component:ComplaintActionComponent},
{path:'view-grievance/:id',component:ViewGrievanceComponent},
{path:'view-non-grievance/:id',component:ViewNonGrievanceComponent},
{path:'view-complaint/:id',component:ViewComplaintComponent},
{path:'modify-grievance/:id',component:ModifyGrievanceComponent},
{path:'modify-non-grievance/:id',component:ModifyNonGrievanceComponent},
{path:'dashboard',component:DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrievanceRoutingModule { }
