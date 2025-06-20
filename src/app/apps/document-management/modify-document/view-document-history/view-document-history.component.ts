import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewTitleComponent } from '../../new-title/new-title.component';
import { documentPreviewComponent } from '../../document-preview/document-preview.component';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};
@Component({
  selector: 'app-view-document-history',
  templateUrl: './view-document-history.component.html',
  styleUrls: ['./view-document-history.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewDocumentHistoryComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: string
  Form: FormGroup
  categories: any[]
  subcategories: any[] = []
  observations: any[] = []
  allBodyPart: string[] = [];
  bodypart: string[] = [];
  bodyParts: any[] = []
  filteredBodyPart: Observable<string[]>;
  bodyPartCtrl = new FormControl('');
  divisions: any[] = []
  uploadedFiles: File[] = [];
  DocumentFiles: File[] = [];
  documentData: any[] = []
  documentID: string
  issued_date = new FormControl(null, [Validators.required]);
  expiry_date = new FormControl(null, [Validators.required]);
  notify_date = new FormControl(null, [Validators.required]);
  revision_date = new FormControl(null, [Validators.required]);
  minDate = new Date();
  peopleList: any[] = [];
  dropdownValues: any
  documentType: any[] = []
  dropDownValue: any[] = []
  titles: any[] = []
  filterTitles: any[] = []
  documentCount: number
  pdfSource: any
  files: File[] = [];
  documentIds: any[] = [];
  evidenceFormData = new FormData()
  year = new FormControl(null, [Validators.required]);

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
      ],
    },
  }
  no_expiryValue: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialog: MatDialog,
    private documentService: DocumentService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ViewDocumentHistoryComponent>,
    private formBuilder: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.configuration()
    console.log(this.defaults);

    this.Form = this.formBuilder.group({
      reported_date: [''],
      document_number: ['', [Validators.required]],
      version_number: ['', [Validators.required]],
      reporter: [''],
      updated_by: [''],
      reporterDesignation: [''],
      updateDesignation: [''],
      id: [''],
      division: [this.defaults.data.division],
      title: [this.defaults.data.title],
      issuing_authority: ['', [Validators.required]],
      notify_date: ['', [Validators.required]],
      expiry_date: ['', [Validators.required]],
      issued_date: ['', [Validators.required]],
      org_id: [''],
      status: [''],
      document_type: ['', [Validators.required]],
      DocumentFile: [''],
      physical_location: [''],
      document_owner: [''],
      document_reviewer: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      docURL: [''],
      docID: [null],
      year: [''],
      document: [''],
      revision_date: ['', [Validators.required]],
      revision_number: ['', [Validators.required]],
      no_expiry: []
    });
    this.files = []
    this.Form.controls['updated_by'].setValue(this.defaults.data.attributes.updated_user.data?.attributes.first_name + ' ' + this.defaults.data.attributes.updated_user.data?.attributes.last_name);
    this.Form.controls['document_number'].setValue(this.defaults.data.attributes.document_number)
    this.Form.controls['version_number'].setValue(this.defaults.data.attributes.version_number)
    this.Form.controls['division'].setValue(this.defaults.data.attributes.division)
    this.Form.controls['title'].setValue(this.defaults.data.attributes.title)
    this.Form.controls['issuing_authority'].setValue(this.defaults.data.attributes.issuing_authority)
    if (this.defaults.data.attributes.notify_date != null) {
      this.Form.controls['notify_date'].setValue(this.defaults.data.attributes.notify_date)
    }
    if (this.defaults.data.attributes.expiry_date != null) {
      this.Form.controls['expiry_date'].setValue(this.defaults.data.attributes.expiry_date)
    }
    this.Form.controls['issued_date'].setValue(this.defaults.data.attributes.issued_date)
    this.Form.controls['status'].setValue(this.defaults.data.attributes.status)
    this.Form.controls['revision_date'].setValue(this.defaults.data.attributes.revision_date)
    this.Form.controls['revision_number'].setValue(this.defaults.data.attributes.revision_number)
    this.Form.controls['document_type'].setValue(this.defaults.data.attributes.document_type)
    this.Form.controls['physical_location'].setValue(this.defaults.data.attributes.physical_location)
    this.Form.controls['document_owner'].setValue(this.defaults.data.attributes.document_owner)
    this.Form.controls['document_reviewer'].setValue(this.defaults.data.attributes.document_reviewer)
    this.Form.controls['remarks'].setValue(this.defaults.data.attributes.remarks)
    this.Form.controls['reporter'].setValue(this.defaults.data.attributes?.created_user?.data?.attributes?.first_name + ' ' + this.defaults.data.attributes?.created_user?.data?.attributes?.last_name);
    this.Form.controls['reporterDesignation'].setValue(this.defaults.data.attributes?.created_user?.data?.attributes?.designation);
    this.Form.controls['updateDesignation'].setValue(this.defaults.data.attributes.updated_user?.data?.attributes.designation);
    this.Form.controls['no_expiry'].setValue(this.defaults.data.attributes.no_expiry)
    this.no_expiryValue = this.defaults.data.attributes.no_expiry;

    this.issued_date.setValue(new Date(this.defaults.data.attributes.issued_date))
    if (this.defaults.data.attributes.notify_date != null) {
      this.notify_date.setValue(new Date(this.defaults.data.attributes.notify_date))
    }
    if (this.defaults.data.attributes.expiry_date != null) {
      this.expiry_date.setValue(new Date(this.defaults.data.attributes.expiry_date))
    }
    this.revision_date.setValue(new Date(this.defaults.data.attributes.revision_date))
    this.issued_date.disable()
    this.expiry_date.disable()
    this.notify_date.disable()
    this.revision_date.disable()
    const document__data = this.defaults.data.attributes.document_files.data;
    if (document__data.length > 0) {
      this.DocumentFiles = [];

      const loadImageAtIndex = (index: number) => {
        if (index >= document__data.length) {
          return;
        }
        const document = document__data[index];
        this.generalService.getImage(environment.client_backend + '/uploads/' + document?.attributes?.document_name + '.' + document?.attributes.format).subscribe((data: any) => {
          let blobType = '';
          let fileType = document.attributes.format.toLowerCase();

          if (fileType === 'pdf') {
            blobType = 'application/pdf';
          } else if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'gif') {
            blobType = 'image/' + fileType;
          } else if (fileType === 'xlsx' || fileType === 'xls') {
            blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          } else {
            blobType = 'application/octet-stream';
          }

          const blob = new Blob([data], { type: blobType });
          const file = new File([blob], document.attributes.document_name + '.' + document.attributes.format, { type: blobType });
          const documentId = document.id;
          const pdfUrl = URL.createObjectURL(blob);

          const documentInfo = {
            id: documentId,
            file_name: document.attributes.document_name,
            file_format: document.attributes.format,
            file: file,
            pdfUrl: pdfUrl,
            type: blobType
          };

          this.documentIds[index] = documentInfo;

          this.DocumentFiles.push(file);

          loadImageAtIndex(index + 1);
        });
      };
      loadImageAtIndex(0);
    }
    this.Form.disable()
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.document
        this.documentCount = result.data.attributes.document_title
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
              this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
            }
          }
          this.me()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.doc_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }


  statusButton(data: any) {
    const active = "btn-success"
    const expired = "btn-danger"
    const to_expire = "btn-warning"
    if (data === "Active") {
      return active
    } else if (data === "Expired") {
      return expired
    } else if (data === "Going to Expire") {
      return to_expire
    } else {
      return
    }
  }

  openDocument(index: number) {
    const documentInfo = this.documentIds[index];
    if (documentInfo) {

      if (documentInfo.file_format === 'pdf') {
        const pdfUrl = documentInfo.pdfUrl;

        if (pdfUrl) {
          const blob = new Blob([documentInfo.file], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          URL.revokeObjectURL(url);
        }
      } else {
        this.dialog.open(documentPreviewComponent, {
          width: '50%',
          data: { documentInfo: documentInfo },
        });
      }
    }
  }

  validate_expiry() {
    if (this.Form.value.no_expiry === true) {
      this.no_expiryValue = true;
      this.Form.controls['expiry_date'].removeValidators(Validators.required)
      this.Form.controls['notify_date'].removeValidators(Validators.required)
    } else if (this.Form.value.no_expiry === false) {
      this.no_expiryValue = false;
      this.Form.controls['expiry_date'].setValidators(Validators.required)
      this.Form.controls['notify_date'].setValidators(Validators.required)
      this.notify_date.enable()
      this.expiry_date.enable()
    }
  }
}
