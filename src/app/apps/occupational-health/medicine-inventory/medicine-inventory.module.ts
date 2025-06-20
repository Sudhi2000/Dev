import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { MedicineInventoryRoutingModule } from './medicine-inventory-routing.module';
import { CreateRequestComponent } from './create-request/create-request.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { MatSortModule } from '@angular/material/sort';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { LightboxModule } from 'ngx-lightbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTimepickerModule } from 'mat-timepicker';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RequestHistoryComponent } from './request-history/request-history.component';
import { CreateMedicineNameComponent } from './create-request/create-medicine-name/create-medicine-name.component';
import { ViewRequestComponent } from './view-request/view-request.component';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { MedicineApprovalComponent } from './medicine-approval/medicine-approval.component';
import { PurchaseInventoryComponent } from './purchase-inventory/purchase-inventory.component';
import { MedicineTransactionComponent } from './medicine-transaction/medicine-transaction.component';
import { ModifyInventoryComponent } from './modify-inventory/modify-inventory.component';
import { ViewInventoryComponent } from './view-inventory/view-inventory.component';
import { ViewMedicineDisposalComponent } from './view-medicine-disposal/view-medicine-disposal.component';
import { NewSupplierComponent } from './new-supplier/new-supplier.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { CreateDisposalComponent } from './create-disposal/create-disposal.component';
import { LoadingScreenModule } from '../../loading-screen/loading-screen.module';
import { CreateMedicineTypeComponent } from './modify-inventory/create-medicine-type/create-medicine-type.component';
import { ReportParameterComponent } from './purchase-inventory/report-parameter/report-parameter.component';
import { EmailComponent } from './email/email.component';


@NgModule({
  declarations: [
    CreateRequestComponent,
    RequestHistoryComponent,
    CreateMedicineNameComponent,
    ViewRequestComponent,
    AssignedTasksComponent,
    MedicineApprovalComponent,
    PurchaseInventoryComponent,
    MedicineTransactionComponent,
    ModifyInventoryComponent,
    ViewInventoryComponent,
    ViewMedicineDisposalComponent,
    NewSupplierComponent,
    CreateTransactionComponent,
    CreateDisposalComponent,
    CreateMedicineTypeComponent,
    ReportParameterComponent,
    EmailComponent
  ],
  imports: [
    CommonModule,
    MedicineInventoryRoutingModule,
    PerfectScrollbarModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
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
    LoadingScreenModule
  ],
  providers: [CurrencyPipe],
})
export class MedicineInventoryModule { }
