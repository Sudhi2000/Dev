import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
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
import {MatCardModule} from '@angular/material/card';
import { MatTimepickerModule } from 'mat-timepicker';
import {MatRadioModule} from '@angular/material/radio';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';

import { TargetSettingRoutingModule } from './target-setting-routing.module';
import { HistoryComponent } from './history/history.component';
import { CreateTargetSettingComponent } from './create-target-setting/create-target-setting.component';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { ActionComponent } from './action/action.component';
import { ViewTargetComponent } from './view-target/view-target.component';
import { UpdateProgressComponent } from './update-progress/update-progress.component';
import { CreateUpdateProgressComponent } from './update-progress/create-update-progress/create-update-progress.component';
import { LoadingScreenModule } from '../loading-screen/loading-screen.module';
import { NewPossibleCategoryComponent } from './create-target-setting/new-possible-category/new-possible-category.component';
import { NewOpportunityComponent } from './create-target-setting/new-opportunity/new-opportunity.component';
import { AddSourceComponent } from './create-target-setting/add-source/add-source.component';
import { ViewSourceComponent } from './create-target-setting/view-source/view-source.component';


@NgModule({
  declarations: [
    HistoryComponent,
    CreateTargetSettingComponent,
    AssignedTasksComponent,
    ActionComponent,
    ViewTargetComponent,
    UpdateProgressComponent,
    CreateUpdateProgressComponent,
    NewPossibleCategoryComponent,
    NewOpportunityComponent,
    AddSourceComponent,
    ViewSourceComponent,
  ],
  imports: [
    CommonModule,
    TargetSettingRoutingModule,
    NgbModule,

    LightboxModule,
    FormsModule, ReactiveFormsModule,
    MatTableModule,
    NgxDropzoneModule,
    MatPaginatorModule,
    MatSortModule,
    NgxDatatableModule,
    QuillModule,
    NgSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    SweetAlert2Module,
    MatIconModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatTabsModule,
    FeahterIconModule,
    NgApexchartsModule,
    MatCardModule,
    MatTimepickerModule,
    MatRadioModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
    LoadingScreenModule
  ]
})
export class TargetSettingModule { }
