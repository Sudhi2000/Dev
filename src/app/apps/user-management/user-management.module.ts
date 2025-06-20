import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { HistoryComponent } from './history/history.component';

import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxImageCompressService } from 'ngx-image-compress';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CreateUserComponent } from './create-user/create-user.component';
import { ModifyUserComponent } from './modify-user/modify-user.component'; 
@NgModule({
  declarations: [
    HistoryComponent,
    CreateUserComponent,
    ModifyUserComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    MatButtonModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgbModule,
    QuillModule,
    NgSelectModule,
    NgxDatatableModule,
    MatSnackBarModule,
    SweetAlert2Module,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatDialogModule,
    MatSelectModule,
    NgApexchartsModule,
    MatTabsModule,
    FeahterIconModule,
    MatIconModule,
  ]
})
export class UserManagementModule { }
