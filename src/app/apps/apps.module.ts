import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule,FormBuilder } from '@angular/forms';
import { AppsRoutingModule } from './apps-routing.module';
import { InsightComponent } from './insight/insight.component';
import { AppsComponent } from './apps.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeahterIconModule } from '../core/feather-icon/feather-icon.module';


@NgModule({
  declarations: [
    InsightComponent,
    AppsComponent,
    UnderConstructionComponent,
   
  ],
  imports: [
    CommonModule,
    AppsRoutingModule,
    FormsModule, ReactiveFormsModule,
    NgbModule,FeahterIconModule
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AppsModule { }
