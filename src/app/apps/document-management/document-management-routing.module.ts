import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { HistoryComponent } from './history/history.component';
//import { ModifyComponent } from './modify/modify.component';
import { ViewComponent } from './view/view.component';
import { ModifyDocumentComponent } from './modify-document/modify-document.component';

const routes: Routes = [
  {path:'register',component:HistoryComponent},
  {path:'create',component:CreateComponent},
  {path:'modify/:id',component:ModifyDocumentComponent},
  {path:'view/:id',component:ViewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentManagementRoutingModule { }
