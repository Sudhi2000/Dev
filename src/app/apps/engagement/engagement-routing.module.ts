import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
   
 
  {
    path: 'engagements',
    loadChildren: () => import('./engagements/engagements.module').then(m => m.EngagementsModule)
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EngagementRoutingModule { }
