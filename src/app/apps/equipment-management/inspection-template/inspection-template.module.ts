import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { InspectionTemplateRoutingModule } from './inspection-template-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';

import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatDialogModule } from '@angular/material/dialog';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxImageCompressService } from 'ngx-image-compress';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { LoadingScreenModule } from '../../loading-screen/loading-screen.module';
import { RegisterComponent } from './register/register.component';
import { CreateComponent } from './create/create.component';
import { NewInspectionCategoryComponent } from './new-inspection-category/new-inspection-category.component';
import { CreateUpdateQuestionComponent } from './create-update-question/create-update-question.component';
import { ModifyComponent } from './modify/modify.component';
import { CreateUpdateTemplateComponent } from './create-update-template/create-update-template.component';
import { ViewTemplateComponent } from './view-template/view-template.component';

@NgModule({
  declarations: [
    RegisterComponent,
    CreateComponent,
    NewInspectionCategoryComponent,
    CreateUpdateQuestionComponent,
    ModifyComponent,
    CreateUpdateTemplateComponent,
    ViewTemplateComponent
  ],
  imports: [
    CommonModule,
    InspectionTemplateRoutingModule,

    MatDialogModule,
    FeahterIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule, ReactiveFormsModule,
    NgxDatatableModule,
    NgApexchartsModule,
    QuillModule,
    LightboxModule,
    NgSelectModule,
    NgbModule,
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
  providers: [NgxImageCompressService, CurrencyPipe],

})
export class InspectionTemplateModule { }
