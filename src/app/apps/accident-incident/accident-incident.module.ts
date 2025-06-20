import { NgModule } from '@angular/core';
import { CommonModule,CurrencyPipe } from '@angular/common';
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

import { AccidentIncidentRoutingModule } from './accident-incident-routing.module';
import { CreateAccidentComponent } from './create-accident/create-accident.component';
import { AddWitnessComponent } from './create-accident/add-witness/add-witness.component';
import { AccidentRegisterComponent } from './accident-register/accident-register.component';
import { AccidentAssignedComponent } from './accident-assigned/accident-assigned.component';
import { AccidentActionComponent } from './accident-action/accident-action.component';
import { AddModifyPeopleComponent } from './accident-action/add-modify-people/add-modify-people.component';
import { AddModifyMemberComponent } from './accident-action/add-modify-member/add-modify-member.component';
import { AddModifyAffectedPersonComponent } from './create-accident/add-modify-affected-person/add-modify-affected-person.component';
import { AddModifyAffectedPersonComponentModify } from '../accident-incident/accident-modify/add-modify-affected-person/add-modify-affected-person.component';
import {AddWitnessComponentModify} from './accident-modify/add-witness/add-witness.component'

import { CallbackPipe } from './accident-action/MyFilterPipe';
import { AddEventComponent } from './accident-action/add-event/add-event.component';
import { ProcedureComponent } from './accident-action/procedure/procedure.component';
import { UnsafeActsComponent } from './accident-action/unsafe-acts/unsafe-acts.component';
import { UnsafeConditionComponent } from './accident-action/unsafe-condition/unsafe-condition.component';
import { PersonalFactorComponent } from './accident-action/personal-factor/personal-factor.component';
import { JobFactorComponent } from './accident-action/job-factor/job-factor.component';
import { CorrectiveActionComponent } from './accident-action/corrective-action/corrective-action.component';
import { ExpenseComponent } from './accident-action/expense/expense.component';
import { StatementComponent } from './accident-action/statement/statement.component';
import { CorrectiveActionsComponent } from './corrective-actions/corrective-actions.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { UpdateCorrectiveActionComponent } from './update-corrective-action/update-corrective-action.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
// Ngx-dropzone-wrapper
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { AccidentViewComponent } from './accident-view/accident-view.component';
import { AppService } from 'src/app/services/app.service';
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  // url: AppService.base_url+AppService.upload,
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { LightboxModule } from 'ngx-lightbox';
import { AccidentModifyComponent } from './accident-modify/accident-modify.component';
import { CreateIncidentComponent } from './create-incident/create-incident.component';
import {AddIncidentWitnessComponent} from './create-incident/add-witness/add-witness.component';
import {AddIncidentPersonComponent} from './create-incident/add-modify-affected-person/add-modify-affected-person.component';
import { IncidentRegisterComponent } from './incident-register/incident-register.component';
import { IncidentModifyComponent } from './incident-modify/incident-modify.component';
import {ModifyIncidentWitnessComponent} from './incident-modify/add-witness/add-witness.component';
import {ModifyIncidentPersonComponent} from './incident-modify/add-modify-affected-person/add-modify-affected-person.component';
import { IncidentViewComponent } from './incident-view/incident-view.component';
import { IncidentActionComponent } from './incident-action/incident-action.component';
import { IncidentAssignedComponent } from './incident-assigned/incident-assigned.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoadingScreenModule } from '../loading-screen/loading-screen.module';
import { UpdateReturnDateComponent } from './accident-register/update-return-date/update-return-date.component';
import { ViewEvidenceComponent } from './accident-action/view-evidence/view-evidence.component';
import { ViewActionTakenComponent } from './accident-action/view-action-taken/view-action-taken.component';
import { CorrectiveActionRegisterComponent } from './corrective-action-register/corrective-action-register.component';
import { ViewCorrectiveActionComponent } from './view-corrective-action/view-corrective-action.component';
import { ReportParameterComponent } from './accident-register/report-parameter/report-parameter.component';
import { CreateTertiaryPartComponent } from './create-accident/create-tertiary-part/create-tertiary-part.component';





@NgModule({
  declarations: [
    CreateAccidentComponent,
    CallbackPipe,
    AddWitnessComponent,
    AccidentRegisterComponent,
    ModifyIncidentWitnessComponent,
    ModifyIncidentPersonComponent,
    AccidentAssignedComponent,
    AccidentActionComponent,
    AddModifyPeopleComponent,
    AddModifyPeopleComponent,
    AddModifyMemberComponent,
    AddModifyAffectedPersonComponent,
    AddModifyAffectedPersonComponentModify,
    AddWitnessComponentModify,
    AddIncidentPersonComponent,
    AddEventComponent,
    ProcedureComponent,
    AddIncidentWitnessComponent,
    UnsafeActsComponent,
    UnsafeConditionComponent,
    PersonalFactorComponent,
    JobFactorComponent,
    CorrectiveActionComponent,
    ExpenseComponent,
    StatementComponent,
    CorrectiveActionsComponent,
    UpdateCorrectiveActionComponent,
    AccidentViewComponent,
    AccidentModifyComponent,
    CreateIncidentComponent,
    IncidentRegisterComponent,
    IncidentModifyComponent,
    IncidentViewComponent,
    IncidentActionComponent,
    IncidentAssignedComponent,
    DashboardComponent,
    UpdateReturnDateComponent,
    ViewEvidenceComponent,
    ViewActionTakenComponent,
    CorrectiveActionRegisterComponent,
    ViewCorrectiveActionComponent,
    ReportParameterComponent,
    CreateTertiaryPartComponent
  ],
  imports: [
    CommonModule,
    AccidentIncidentRoutingModule,
    PerfectScrollbarModule,
    MatDialogModule,
    FormsModule, ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    DropzoneModule,
    MatSortModule,
    NgxDropzoneModule,
    MatAutocompleteModule,
    MatRadioModule,
    LightboxModule,
    MatChipsModule,
    MatCardModule,
    NgxDatatableModule,
    QuillModule,
    NgSelectModule,
    NgbModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTimepickerModule,
    SweetAlert2Module,
    MatIconModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatTabsModule,
    FeahterIconModule,
    NgApexchartsModule,
    LoadingScreenModule
  ],
  providers: [CurrencyPipe,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }, // Ngx-dropzone-wrapper
  ],

})
export class AccidentIncidentModule { }
