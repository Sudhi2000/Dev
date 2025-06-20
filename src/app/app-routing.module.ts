import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './layout/base/base.component';
import { AppAuthGuard } from './services/app-auth.guard';
import { PowerbiComponent } from './powerbi/powerbi.component';

const routes: Routes = [
  {path:'powerbi',component:PowerbiComponent},
  
  {
    path: '',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
  },
  {
    path: 'satisfaction-survey/public-survey/:id',
    loadChildren: () => import('./public-survey/public-survey.module').then(m => m.PublicSurveyModule)
  },
  {
    path: 'materiality-assessment',
    loadChildren: () => import('./materiality-survey/materiality-survey.module').then(m => m.MaterialitySurveyModule)
  },
  {
    path: 'public-reporting',
    loadChildren: () => import('./public-reporting/public-reporting.module').then(m => m.PublicReportingModule)
  },
  
  {
    path: 'apps',
    component: BaseComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
      },

    ], canActivate: [AppAuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
  // providers:[{provide:LocationStrategy,useClass:HashLocationStrategy}],
})
export class AppRoutingModule { }
