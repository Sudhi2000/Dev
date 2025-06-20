import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { SurveyComponent } from './survey/survey.component'; 
import { RegisterComponent } from './register/register.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { ModifySurveyComponent } from './modify-survey/modify-survey.component';
import { ActionSurveyComponent } from './action-survey/action-survey.component';

const routes: Routes = [
  {path:'register',component:RegisterComponent},
  {path:'survey',component:SurveyComponent}, 
  {path:'view/:id',component:ViewSurveyComponent}, 
  {path:'modify/:id',component:ModifySurveyComponent},
  {path:'action/:id',component:ActionSurveyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialityAssessmentRoutingModule { }
