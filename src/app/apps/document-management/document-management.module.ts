import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatDialogModule } from '@angular/material/dialog';
import { DocumentManagementRoutingModule } from './document-management-routing.module';
import { HistoryComponent } from './history/history.component';
import { CreateComponent } from './create/create.component';
import { NewTitleComponent } from './new-title/new-title.component';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ModifyComponent } from './modify/modify.component';
import { ViewComponent } from './view/view.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LoadingScreenModule } from '../loading-screen/loading-screen.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { documentPreviewComponent } from './document-preview/document-preview.component';
import { EmailComponent } from './history/email/email.component';
import { ModifyDocumentComponent } from './modify-document/modify-document.component';
import { UploadNewVersionComponent } from './modify-document/upload-new-version/upload-new-version.component';
import { ViewDocumentHistoryComponent } from './modify-document/view-document-history/view-document-history.component';
import { NewIssuingAuthorityComponent } from './new-issuing-authority/new-issuing-authority.component';
import { ReportParameterComponent } from './history/report-parameter/report-parameter.component';
@NgModule({
  declarations: [
    HistoryComponent,
    CreateComponent,
    NewTitleComponent,
    ModifyComponent,
    ViewComponent,
    documentPreviewComponent,
    EmailComponent,
    ModifyDocumentComponent,
    UploadNewVersionComponent,
    ViewDocumentHistoryComponent,
    NewIssuingAuthorityComponent,
    ReportParameterComponent
  ],
  imports: [

    MatButtonModule,
    MatProgressBarModule,
    MatToolbarModule,
    CommonModule,
    DocumentManagementRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule,
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
    NgxExtendedPdfViewerModule,
    PdfViewerModule,
    MatAutocompleteModule,
    LoadingScreenModule
  ]
})
export class DocumentManagementModule { }
