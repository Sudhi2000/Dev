import { NgModule } from '@angular/core';
import { CommonModule,CurrencyPipe } from '@angular/common';

import { ChemicalManagementRoutingModule } from './chemical-management-routing.module';
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


import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgxDropzoneModule } from 'ngx-dropzone';
// Ngx-dropzone-wrapper
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
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
import { NewSupplierComponent } from './new-supplier/new-supplier.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NewStorageComponent } from './new-storage/new-storage.component';
import { NewLabComponent } from './new-lab/new-lab.component';
import { NewPositiveComponent } from './new-positive/new-positive.component';
import { TransactionComponent } from './transaction/transaction.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { NewDepartmentComponent } from '../general-component/new-department/new-department.component';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
import { DisposeComponent } from './transaction/dispose/dispose.component';
import { CreateDisposeComponent } from './transaction/dispose/create-dispose/create-dispose.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ChemicalRequestComponent } from './chemical-request/chemical-request.component';
import { CreateChemicalNameComponent } from './chemical-request/create-chemical-name/create-chemical-name.component';
import { ChemicalRequestModifyComponent } from './chemical-request-modify/chemical-request-modify.component';
import { ChemicalRequestHistoryComponent } from './chemical-request-history/chemical-request-history.component';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { ChemicalReviewComponent } from './chemical-review/chemical-review.component';
import { ChemicalApprovalComponent } from './chemical-approval/chemical-approval.component';
import { ChemicalInventoryComponent } from './chemical-inventory/chemical-inventory.component';
import { ChemicalInventoryModifyComponent } from './chemical-inventory-modify/chemical-inventory-modify.component';
import { ChemicalMsdsDocumentComponent } from './chemical-msds-document/chemical-msds-document.component';
import { ChemicalCertificateComponent } from './chemical-certificate/chemical-certificate.component';
import { ChemicalEditCertificateComponent } from './chemical-edit-certificate/chemical-edit-certificate.component';
import { ChemicalRequestViewComponent } from './chemical-request-view/chemical-request-view.component';
import { ChemicalInventoryViewComponent } from './chemical-inventory-view/chemical-inventory-view.component';
import { ChemicalCertificateViewComponent } from './chemical-certificate-view/chemical-certificate-view.component';
import {ChemicalViewCertificateComponent} from './chemical-view-certificate/chemical-view-certificate.component';
import { ChemicalTransactionComponent } from './chemical-transaction/chemical-transaction.component';
import { ChemicalTransactionCreateComponent } from './chemical-transaction-create/chemical-transaction-create.component';
import { ChemicalDisposalCreateComponent } from './chemical-disposal-create/chemical-disposal-create.component';
import { ChemicalDiposalViewComponent } from './chemical-diposal-view/chemical-diposal-view.component';
import { ChemicalDashboardComponent } from './chemical-dashboard/chemical-dashboard.component';
import { CallbackPipe } from './chemical-dashboard/MyFilterPipe';
import { LoadingScreenModule } from '../loading-screen/loading-screen.module';
import { GenerateComponentComponent } from './chemical-inventory/generate-component/generate-component.component';
import { NewPpeComponent } from './new-ppe/new-ppe.component';
import { CreateProductStandardComponent } from './chemical-request/create-product-standard/create-product-standard.component';
import { StorageConditionComponent } from './chemical-inventory-modify/storage-condition/storage-condition.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewChemcheckReportComponent } from './view-chemcheck-report/view-chemcheck-report.component';

@NgModule({
  declarations: [
    NewSupplierComponent,
    NewStorageComponent,
    NewLabComponent,
    CallbackPipe,
    NewPositiveComponent,
    TransactionComponent,
    CreateTransactionComponent,
    ChemicalViewCertificateComponent,
    NewDepartmentComponent,
    ViewTransactionComponent,
    DisposeComponent,
    CreateDisposeComponent,
    ChemicalRequestComponent,
    CreateChemicalNameComponent,
    ChemicalRequestModifyComponent,
    ChemicalRequestHistoryComponent,
    AssignedTasksComponent,
    ChemicalReviewComponent,
    ChemicalApprovalComponent,
    ChemicalInventoryComponent,
    ChemicalInventoryModifyComponent,
    ChemicalMsdsDocumentComponent,
    ChemicalCertificateComponent,
    ChemicalEditCertificateComponent,
    ChemicalRequestViewComponent,
    ChemicalInventoryViewComponent,
    ChemicalCertificateViewComponent,
    ChemicalTransactionComponent,
    ChemicalTransactionCreateComponent,
    ChemicalDisposalCreateComponent,
    ChemicalDiposalViewComponent,
    ChemicalDashboardComponent,
    GenerateComponentComponent,
    NewPpeComponent,
    CreateProductStandardComponent,
    StorageConditionComponent,
    ViewChemcheckReportComponent
  ],
  imports: [
    CommonModule,
    ChemicalManagementRoutingModule,
    PerfectScrollbarModule,
    MatDialogModule,
    FormsModule, ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    DropzoneModule,
    MatSortModule,
    NgxDropzoneModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule,
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
    MatButtonToggleModule,
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
    LoadingScreenModule,
    MatCheckboxModule
  ],
  providers: [CurrencyPipe],
})
export class ChemicalManagementModule { }
