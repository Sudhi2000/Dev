import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsightComponent } from './insight/insight.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';

const routes: Routes = [
  {path:'insight',component:InsightComponent},
  {path:'under-construction',component:UnderConstructionComponent},


  {
    path: 'hazard-risk',
    loadChildren: () => import('./hazard-risk/hazard-risk.module').then(m => m.HazardRiskModule)
  },
  {
    path: 'accident-incident',
    loadChildren: () => import('./accident-incident/accident-incident.module').then(m => m.AccidentIncidentModule)
  },
  {
    path: 'environment',
    loadChildren: () => import('./environment/environment.module').then(m => m.EnvironmentModule)
  },
  {
    path: 'target-setting',
    loadChildren: () => import('./target-setting/target-setting.module').then(m => m.TargetSettingModule)
  },
  {
    path: 'audit-inspection',
    loadChildren: () => import('./audit-inspection/audit-inspection.module').then(m => m.AuditInspectionModule)
  },
  {
    path: 'document-management',
    loadChildren: () => import('./document-management/document-management.module').then(m => m.DocumentManagementModule)
  },
  {
    path: 'equipment-management',
    loadChildren: () => import('./equipment-management/equipment-management.module').then(m => m.EquipmentManagementModule)
  },
  {
    path: 'sustainability',
    loadChildren: () => import('./sustainability/sustainability.module').then(m => m.SustainabilityModule)
  },
  {
    path: 'my-account',
    loadChildren: () => import('./my-account/my-account.module').then(m => m.MyAccountModule)
  },
  {
    path: 'engagement',
    loadChildren: () => import('./engagement/engagement.module').then(m => m.EngagementModule)
  },
  {
    path: 'rag',
    loadChildren: () => import('./rag/rag.module').then(m => m.RagModule)
  },
  {
    path: 'grievance',
    loadChildren: () => import('./grievance/grievance.module').then(m => m.GrievanceModule)
  },
  {
    path: 'attrition',
    loadChildren: () => import('./attrition/attrition.module').then(m => m.AttritionModule)
  },
  {
    path: 'chemical-management',
    loadChildren: () => import('./chemical-management/chemical-management.module').then(m => m.ChemicalManagementModule)
  },
  {
    path: 'occupational-health',
    loadChildren: () => import('./occupational-health/occupational-health.module').then(m => m.OccupationalHealthModule)
  },
  {
    path: 'user-management',
    loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule)
  },
  {
    path: 'materiality-assessment',
    loadChildren: () => import('./materiality-assessment/materiality-assessment.module').then(m => m.MaterialityAssessmentModule)
  },
  {
    path: 'satisfaction-survey',
    loadChildren: () => import('./satisfaction-survey/satisfaction-survey.module').then(m => m.SatisfactionSurveyModule)
  },
  {
    path: 'esg',
    loadChildren: () => import('./esg/esg.module').then(m => m.EsgModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule { }
