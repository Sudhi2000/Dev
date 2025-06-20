import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicSurveyComponent } from './public-survey/public-survey.component';

const routes: Routes = [
  {path:'',component:PublicSurveyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicSurveyRoutingModule { }
