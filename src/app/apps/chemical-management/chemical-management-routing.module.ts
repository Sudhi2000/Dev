import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { ChemicalApprovalComponent } from './chemical-approval/chemical-approval.component';
import { ChemicalDashboardComponent } from './chemical-dashboard/chemical-dashboard.component';
import { ChemicalInventoryModifyComponent } from './chemical-inventory-modify/chemical-inventory-modify.component';
import { ChemicalInventoryViewComponent } from './chemical-inventory-view/chemical-inventory-view.component';
import { ChemicalInventoryComponent } from './chemical-inventory/chemical-inventory.component';
import { ChemicalRequestHistoryComponent } from './chemical-request-history/chemical-request-history.component';
import { ChemicalRequestModifyComponent } from './chemical-request-modify/chemical-request-modify.component';
import { ChemicalRequestViewComponent } from './chemical-request-view/chemical-request-view.component';
import { ChemicalRequestComponent } from './chemical-request/chemical-request.component';
import { ChemicalReviewComponent } from './chemical-review/chemical-review.component';
import { ChemicalTransactionComponent } from './chemical-transaction/chemical-transaction.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { DisposeComponent } from './transaction/dispose/dispose.component';
import { TransactionComponent } from './transaction/transaction.component';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';

const routes: Routes = [


  {path:'view-transaction/:id',component:ViewTransactionComponent},
  
  {path:'create-transaction',component:CreateTransactionComponent},
  {path:'dispose/:id',component:DisposeComponent},

  {path:'create-request',component:ChemicalRequestComponent},
  {path:'modify-request/:id',component:ChemicalRequestModifyComponent},
  {path:'request-history',component:ChemicalRequestHistoryComponent},
  {path:'assigned-task',component:AssignedTasksComponent},
  {path:'review/:id',component:ChemicalReviewComponent},
  {path:'approve/:id',component:ChemicalApprovalComponent},
  {path:'inventory',component:ChemicalInventoryComponent},
  {path:'modify-inventory/:id',component:ChemicalInventoryModifyComponent},
  {path:'view-request/:id',component:ChemicalRequestViewComponent},
  {path:'view-inventory/:id',component:ChemicalInventoryViewComponent},

  {path:'transaction',component:ChemicalTransactionComponent},
  {path:'dashboard',component:ChemicalDashboardComponent},















];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChemicalManagementRoutingModule { }
