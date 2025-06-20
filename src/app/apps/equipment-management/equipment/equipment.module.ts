import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CreateComponent } from './create/create.component';

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
import { EquipmentRoutingModule } from './equipment-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoadingScreenModule } from '../../loading-screen/loading-screen.module';
import { NewManufacturerComponent } from './create/new-manufacturer/new-manufacturer.component';
import { NewEquipmentTypeComponent } from './create/new-equipment-type/new-equipment-type.component';
import { ActionComponent } from './action/action.component';
import { CreateUpdateAssignmentComponent } from './action/create-update-assignment/create-update-assignment.component';
import { CreateClientComponent } from '../create-client/create-client.component';
import { CreateIndustryTypeComponent } from './create-industry-type/create-industry-type.component';
import { AgmCoreModule } from '@agm/core';
import { ViewComponent } from './view/view.component';
import { ViewAssignmentComponent } from './view/view-assignment/view-assignment.component';
import { LocationMapComponent } from './register/location-map/location-map.component';

@NgModule({
  declarations: [
    RegisterComponent,
    CreateComponent,
    NewManufacturerComponent,
    NewEquipmentTypeComponent,
    ActionComponent,
    CreateUpdateAssignmentComponent,
    CreateClientComponent,
    CreateIndustryTypeComponent,
    ViewComponent,
    ViewAssignmentComponent,
    LocationMapComponent,
  ],
  imports: [
    CommonModule,
    EquipmentRoutingModule,
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
    LoadingScreenModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCUQ6aGqJ_asuDyuHMQRqVt8bWP8Jyd8Rk'
    })
    

  ],
  providers: [NgxImageCompressService, CurrencyPipe],

})
export class EquipmentModule { }
