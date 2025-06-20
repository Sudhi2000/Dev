import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { SurveyEndComponent } from './survey-end/survey-end.component'

const routes: Routes = [
  {path:'survey/:id',component:CreateSurveyComponent},
  {path:'survey-expired',component:SurveyEndComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialitySurveyRoutingModule { }
