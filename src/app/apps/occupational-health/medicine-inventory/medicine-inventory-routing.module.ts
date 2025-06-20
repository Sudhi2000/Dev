import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { MedicineTransactionComponent } from './medicine-transaction/medicine-transaction.component';
import { ModifyInventoryComponent } from './modify-inventory/modify-inventory.component';
import { PurchaseInventoryComponent } from './purchase-inventory/purchase-inventory.component';
import { RequestHistoryComponent } from './request-history/request-history.component';
import { ViewInventoryComponent } from './view-inventory/view-inventory.component';

const routes: Routes = [
  {path:'request-history',component:RequestHistoryComponent},
  {path:'assigned-task',component:AssignedTasksComponent},
  {path:'purchase-inventory',component:PurchaseInventoryComponent},
  {path:'modify-inventory/:id',component:ModifyInventoryComponent},
  {path:'view-inventory/:id',component:ViewInventoryComponent},
  {path:'transaction',component:MedicineTransactionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicineInventoryRoutingModule { }
