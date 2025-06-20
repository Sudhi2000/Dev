import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { HistoryComponent } from './history/history.component';
import { ViewComponent } from './view/view.component';
import { ModifyComponent } from './modify/modify.component';

const routes: Routes = [
  { path: 'create', component: CreateComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'view/:id', component: ViewComponent },
  { path: 'modify/:id', component: ModifyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttritionRoutingModule { }
