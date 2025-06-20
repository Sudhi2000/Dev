import { NgModule } from '@angular/core';
import { CommonModule,CurrencyPipe } from '@angular/common';

import { EquipmentManagementRoutingModule } from './equipment-management-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';

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
import { ClientComponent } from './client/client.component';
import { LoadingScreenModule } from '../loading-screen/loading-screen.module';
import { ModifyClientComponent } from './modify-client/modify-client.component';
import { GeoTagComponent } from './geo-tag/geo-tag.component';
import { CreateGeoTagComponent } from './create-geo-tag/create-geo-tag.component';
import { ModifyGeoTagComponent } from './modify-geo-tag/modify-geo-tag.component';
import { ViewGeoTagComponent } from './view-geo-tag/view-geo-tag.component';
import { ViewClientComponent } from './view-client/view-client.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    ClientComponent,
    ModifyClientComponent,
    GeoTagComponent,
    CreateGeoTagComponent,
    ModifyGeoTagComponent,
    ViewGeoTagComponent,
    ViewClientComponent
  ],
  imports: [
    CommonModule,
    EquipmentManagementRoutingModule,
    MatDialogModule,
    FeahterIconModule,
    PerfectScrollbarModule,
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
  providers:[
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    CurrencyPipe
  ]
})
export class EquipmentManagementModule { }
