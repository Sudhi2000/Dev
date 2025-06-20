import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { MaterialityAssessmentRoutingModule } from './materiality-assessment-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule,FormBuilder } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {MatDialogModule} from '@angular/material/dialog';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { LoadingScreenModule } from '../loading-screen/loading-screen.module'; 
import { SurveyComponent } from './survey/survey.component'; 
import { CreateTopicComponent } from './survey/create-topic/create-topic.component';
import { RegisterComponent } from './register/register.component';
import { AddStakeholderComponent } from './survey/add-stakeholder/add-stakeholder.component';
import { CreateIndustryComponent } from './survey/create-industry/create-industry.component';
import { AddFrameworkComponent } from './survey/add-framework/add-framework.component';
import { AddCategoryComponent } from './survey/add-category/add-category.component';
import { UpdateCategoryComponent } from './survey/update-category/update-category.component';
import { UpdateFrameworkComponent } from './survey/update-framework/update-framework.component';
import { UpdateIndustryComponent } from './survey/update-industry/update-industry.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { ModifySurveyComponent } from './modify-survey/modify-survey.component';
import { UpdateStakeholderComponent } from './modify-survey/update-stakeholder/update-stakeholder.component';
import { ActionSurveyComponent } from './action-survey/action-survey.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SubTopicComponent } from './survey/sub-topic/sub-topic.component';
import { IndividualTopicComponent } from './survey/individual-topic/individual-topic.component';
import { UpdateTopicComponent } from './survey/update-topic/update-topic.component';


import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [ 
    SurveyComponent, 
    CreateTopicComponent,
    RegisterComponent,
    AddStakeholderComponent,
    CreateIndustryComponent,
    AddFrameworkComponent,
    AddCategoryComponent,
    UpdateCategoryComponent,
    UpdateFrameworkComponent,
    UpdateIndustryComponent,
    ViewSurveyComponent,
    ModifySurveyComponent,
    UpdateStakeholderComponent,
    ActionSurveyComponent,
    SubTopicComponent,
    IndividualTopicComponent,
    UpdateTopicComponent,
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MaterialityAssessmentRoutingModule,
    MatDialogModule,
    DragDropModule,
    FeahterIconModule,
    PerfectScrollbarModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule, ReactiveFormsModule,
    NgxDatatableModule,
    NgApexchartsModule,
    QuillModule,
    MatTooltipModule,
    LightboxModule,
    NgSelectModule,
    NgbModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatTabsModule,
    NgxDropzoneModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    SweetAlert2Module,
    MatSelectModule,
    MatIconModule,
    MatButtonToggleModule,
    MatMenuModule,
    LoadingScreenModule
  ],
  providers:[
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    CurrencyPipe
  ]
})
export class MaterialityAssessmentModule { }
