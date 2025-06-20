import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { QuestionHistoryComponent } from './question-history/question-history.component';
import { ViewQuestionComponent } from './view-question/view-question.component';
import { ModifyQuestionComponent } from './modify-question/modify-question.component';
import { SurveyHistoryComponent } from './survey-history/survey-history.component';
import { ModifySurveyComponent } from './modify-survey/modify-survey.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { SurveyActionComponent } from './survey-action/survey-action.component';
import { PrivateSurveyComponent } from './private-survey/private-survey.component';
import { AssignedSurveysComponent } from './assigned-surveys/assigned-surveys.component';
import { ViewQuestionComponentNew } from './create-survey/view-question/view-question.component';
import { PublicSurveyComponent } from 'src/app/public-survey/public-survey/public-survey.component';
// import { PublicSurveyComponent } from 'src/app/public-survey/public-survey/public-survey.component';

const routes: Routes = [
  {path:'create-survey',component:CreateSurveyComponent},
  {path:'private-survey/:id',component:PrivateSurveyComponent},
  {path:'create-question',component:CreateQuestionComponent},
  {path:'question-history',component:QuestionHistoryComponent},
  {path:'survey-history',component:SurveyHistoryComponent},
  {path:'view-question',component:ViewQuestionComponent},
  {path:'view-question',component:ViewQuestionComponentNew},
  {path:'modify-question/:id',component:ModifyQuestionComponent},
  {path:'modify-survey/:id',component:ModifySurveyComponent},
  {path:'survey-action/:id',component:SurveyActionComponent},
  {path:'view-question/:id',component:ViewQuestionComponent},
  {path:'view-survey/:id',component:ViewSurveyComponent},
  {path:'assigned-surveys',component:AssignedSurveysComponent},
  // {path:'public-survey/:id',component:PublicSurveyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SatisfactionSurveyRoutingModule { }
