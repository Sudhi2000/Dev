import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatCardModule } from '@angular/material/card';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { EnvironmentRoutingModule } from './environment-routing.module';
import { EnvironmentHistoryComponent } from './environment-history/environment-history.component';
import { AddConsumptionComponent } from './add-consumption/add-consumption.component';
import { ConsumptionComponent } from './add-consumption/consumption/consumption.component';
import { ViewConsumptionComponent } from './add-consumption/view-consumption/view-consumption.component';
import { ConsumptionModifyComponent } from './modify-consumption/consumption/consumption.component';
import { ViewModifyConsumptionComponent } from './modify-consumption/view-consumption/view-consumption.component';
import { ModifyConsumptionComponent } from './modify-consumption/modify-consumption.component';
import { ViewEnvironmentDetailsComponent } from './view-environment-details/view-environment-details.component';
import { ViewOnlyConsumptionComponent } from './view-environment-details/view-consumption/view-consumption.component'
import { LightboxModule } from 'ngx-lightbox';
import { EnvironmentAssignedComponent } from './environment-assigned/environment-assigned.component';
import { EnvironmentActionComponent } from './environment-assigned/environment-action/environment-action.component';
import { ViewActionConsumptionComponent } from './environment-assigned/environment-action/view-consumption/view-consumption.component';
import { RejectReasonComponent } from './environment-assigned/environment-action/reject-reason/reject-reason.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CallbackPipe } from './dashboard/MyFilterPipe';
import { GenerateReportComponent } from './environment-history/generate-report/generate-report.component';
import { LoadingScreenModule } from '../loading-screen/loading-screen.module';
import { EditConsumptionComponent } from './add-consumption/edit-consumption/edit-consumption.component';
import { UpdateConsumptionComponent } from './modify-consumption/update-consumption/update-consumption.component';
import { AddPollutantsEmittedComponent } from './add-consumption/add-pollutants-emitted/add-pollutants-emitted.component';
import { CreateNewPollutantComponent } from './add-consumption/create-new-pollutant/create-new-pollutant.component';
import { CreateNewSourceComponent } from './add-consumption/create-new-source/create-new-source.component';
import { EditPollutantsEmittedComponent } from './add-consumption/edit-pollutants-emitted/edit-pollutants-emitted.component';
import { CreateTestingOrganizationComponent } from './add-consumption/create-testing-organization/create-testing-organization.component';
import { RefrigerantComponent } from './common-component/refrigerant/refrigerant.component';
import { CreateEquipmentComponent } from './common-component/create-equipment/create-equipment.component';
import { NewEquipmentTypeComponent } from './common-component/create-equipment/new-equipment-type/new-equipment-type.component';
import { NewManufacturerComponent } from './common-component/create-equipment/new-manufacturer/new-manufacturer.component';
import { NewSupplierComponent } from './common-component/new-supplier/new-supplier.component';
import { NewIssueComponent } from './common-component/new-issue/new-issue.component';
import { NewIssuedUserComponent } from './common-component/new-issue/new-issued-user/new-issued-user.component';
import { ViewIssueComponent } from './common-component/view-issue/view-issue.component';
import { ViewRefrigerantComponent } from './common-component/view-refrigerant/view-refrigerant.component';
import { AddMeterComponent } from './add-consumption/add-meter/add-meter.component';
import { AddNewMeterComponent } from './add-consumption/add-new-meter/add-new-meter.component';
import { CreateWasteTypeComponent } from './add-consumption/create-waste-type/create-waste-type.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    EnvironmentHistoryComponent,
    AddConsumptionComponent,
    ConsumptionComponent,
    ViewConsumptionComponent,
    ModifyConsumptionComponent,
    ConsumptionModifyComponent,
    ViewModifyConsumptionComponent,
    ViewEnvironmentDetailsComponent,
    CallbackPipe,
    ViewOnlyConsumptionComponent,
    EnvironmentAssignedComponent,
    EnvironmentActionComponent,
    ViewActionConsumptionComponent,
    RejectReasonComponent,
    DashboardComponent,
    GenerateReportComponent,
    EditConsumptionComponent,
    UpdateConsumptionComponent,
    AddPollutantsEmittedComponent,
    CreateNewPollutantComponent,
    CreateNewSourceComponent,
    EditPollutantsEmittedComponent,
    CreateTestingOrganizationComponent,
    RefrigerantComponent,
    CreateEquipmentComponent,
    ViewRefrigerantComponent,
    NewEquipmentTypeComponent,
    NewManufacturerComponent,
    NewSupplierComponent,
    NewIssueComponent,
    NewIssuedUserComponent,
    ViewIssueComponent,
    AddMeterComponent,
    AddNewMeterComponent,
    CreateWasteTypeComponent,
  ],
  imports: [
    CommonModule,
    LightboxModule,
    EnvironmentRoutingModule,
    FormsModule, ReactiveFormsModule,
    MatTableModule,
    NgxDropzoneModule,
    MatPaginatorModule,
    MatSortModule,
    NgxDatatableModule,
    QuillModule,
    NgSelectModule,
    NgbModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    SweetAlert2Module,
    PerfectScrollbarModule,
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
  ],
  providers: [CurrencyPipe,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
})
export class EnvironmentModule { }
