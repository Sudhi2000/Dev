import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { NewTitleComponent } from '../new-title/new-title.component';
import { documentPreviewComponent } from '../document-preview/document-preview.component';
import { ViewDocumentHistoryComponent } from '../modify-document/view-document-history/view-document-history.component';
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
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: string
  Form: FormGroup
  categories: any[]
  subcategories: any[] = []
  observations: any[] = []
  allBodyPart: string[] = [];
  bodypart: string[] = [];
  DocumentFiles: File[] = [];
  documentData: any[] = []
  documentIds: any[] = [];
  bodyParts: any[] = []
  filteredBodyPart: Observable<string[]>;
  bodyPartCtrl = new FormControl('');
  divisions: any[] = []
  issued_date = new FormControl(null, [Validators.required]);
  expiry_date = new FormControl(null, [Validators.required]);
  notify_date = new FormControl(null, [Validators.required]);
  minDate = new Date();
  peopleList: any[] = [];
  dropdownValues: any
  dropDownValue: any[] = []
  titles: any[] = []
  filterTitles: any[] = []
  documentCount: number
  pdfSource: any
  historyList: any[] = []
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  activityList: any[] = []
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
  backToHistory: Boolean = false
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
    public dialog: MatDialog,
    private documentService: DocumentService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      reported_date: [new Date()],
      document_number: ['', [Validators.required]],
      version_number: ['', [Validators.required]],
      reporter: ['', [Validators.required]],
      updated_by: ['', [Validators.required]],
      updateDesignation: [''],
      reporterDesignation: [''],
      id: ['', [Validators.required]],
      division: ['', [Validators.required]],
      title: ['', [Validators.required]],
      issuing_authority: ['', [Validators.required]],
      physical_location: [''],
      document_owner: [''],
      document_reviewer: ['', [Validators.required]],
      notify_date: [null],
      expiry_date: [null],
      issued_date: ['', [Validators.required]],
      org_id: ['', [Validators.required]],
      status: ['', [Validators.required]],
      responsible_name: [''],
      remarks: [''],
      document_type: ['', [Validators.required]],
      DocumentFile: [''],
      document: [''],
      no_expiry: []
    });
  }

  filterDocumentType(value: any) {
    return value.attributes?.Category === "Document Type"
  }


  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.document
        this.documentCount = result.data.attributes.document_title
        this.unitSpecific = result.data.attributes.business_unit_specific
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
        const status = result.doc_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisionUuids.push(elem.division_uuid)
              })
            }
          }
          this.document_details()
          this.activity_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  document_details() {
    this.DocumentFiles = [];
    this.documentIds = [];
    this.documentData = [];
    const reference = this.route.snapshot.paramMap.get('id');

    this.documentService.get_document_details(this.Form.value.org_id, reference).subscribe(
      (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse) ||
            (!divisionUuidFromResponse && result.data[0].attributes.division === 'All units');
        } if (matchFound || matchFound !== false) {
          this.Form.controls['document_number'].setValue(result.data[0].attributes.document_number);
          this.Form.controls['version_number'].setValue(result.data[0].attributes.version_number);
          this.Form.controls['updated_by'].setValue(result.data[0].attributes.updated_user.data?.attributes.first_name + ' ' + result.data[0].attributes.updated_user.data?.attributes.last_name);
          this.Form.controls['reporter'].setValue(result.data[0].attributes.created_user.data.attributes.first_name + ' ' + result.data[0].attributes.created_user.data.attributes.last_name);
          this.Form.controls['reporterDesignation'].setValue(result.data[0].attributes.created_user.data.attributes.designation);
          this.Form.controls['updateDesignation'].setValue(result.data[0].attributes.updated_user?.data?.attributes.designation);
          this.Form.controls['id'].setValue(result.data[0].id);
          this.Form.controls['division'].setValue(result.data[0].attributes.division);
          this.Form.controls['status'].setValue(result.data[0].attributes.status);
          this.Form.controls['remarks'].setValue(result.data[0].attributes.remarks);
          this.Form.controls['issuing_authority'].setValue(result.data[0].attributes.issuing_authority);
          this.Form.controls['document_reviewer'].setValue(result.data[0].attributes.document_reviewer);
          this.Form.controls['document_owner'].setValue(result.data[0].attributes.document_owner);
          this.Form.controls['physical_location'].setValue(result.data[0].attributes.physical_location);
          this.Form.controls['title'].setValue(result.data[0].attributes.title);
          if (result.data[0].attributes.notify_date != null) {
            this.Form.controls['notify_date'].setValue(new Date(result.data[0].attributes.notify_date));
          }
          if (result.data[0].attributes.expiry_date != null) {
            this.Form.controls['expiry_date'].setValue(new Date(result.data[0].attributes.expiry_date));
          }
          // this.Form.controls['notify_date'].setValue(new Date(result.data[0].attributes.notify_date));
          // this.Form.controls['expiry_date'].setValue(new Date(result.data[0].attributes.expiry_date));
          this.Form.controls['issued_date'].setValue(new Date(result.data[0].attributes.issued_date));
          this.Form.controls['document_type'].setValue(result.data[0].attributes.document_type);
          this.issued_date.setValue(new Date(result.data[0].attributes.issued_date));
          if (result.data[0].attributes.notify_date != null) {
            this.notify_date.setValue(new Date(result.data[0].attributes.notify_date));
          }
          if (result.data[0].attributes.expiry_date != null) {
            this.expiry_date.setValue(new Date(result.data[0].attributes.expiry_date));
          }
          this.Form.controls['no_expiry'].setValue(result.data[0].attributes.no_expiry == null ? false : result.data[0].attributes.no_expiry);
          this.no_expiryValue = this.Form.value.no_expiry;
          // this.expiry_date.setValue(new Date(result.data[0].attributes.expiry_date));
          // this.notify_date.setValue(new Date(result.data[0].attributes.notify_date));
          this.documentData = result.data[0].attributes.document_files.data;
          if (this.documentData.length > 0) {
            this.Form.controls['document'].setValue('OK');
          } else {
            this.Form.controls['document'].reset();
          }
          if (result.data[0].attributes.document_histories.data.length > 0) {
            this.historyList = result.data[0].attributes.document_histories.data
          } else {
            this.historyList = []
          }
          const document__data = result.data[0].attributes.document_files.data;
          if (document__data.length > 0) {
            this.DocumentFiles = [];

            const loadImageAtIndex = (index: number) => {
              if (index >= document__data.length) {
                this.Form.disable();
                this.issued_date.disable();
                this.notify_date.disable();
                this.expiry_date.disable();
                return;
              }

              const document = document__data[index];
              this.generalService.getImage(environment.client_backend + '/uploads/' + document?.attributes.document_name + '.' + document?.attributes.format).subscribe((data: any) => {
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
          this.Form.disable();
        }
        else {
          this.router.navigate(["/apps/document-management/register"])
        }
      },
      (err: any) => {
        this.router.navigate(["/error/internal"]);
      }
    );
  }

  activity_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.documentService.get_activities(reference).subscribe({
      next: (result: any) => {

        if (result.data.length > 0) {
          this.activityList = result.data
        } else {
          this.activityList = []
        }
      },
      error: (err: any) => { },
      complete: () => {

      }
    })

  }
  get_document_title() {
    this.documentService.get_document_title().subscribe({
      next: (result: any) => {
        this.titles = result.data
      }
    })
  }

  getTitles(data: any) {
    const type = data.value
    const category = this.titles.filter(function (elem: any) {
      return (elem.attributes.category === type)
    })
    this.filterTitles = category
  }

  //get dropdown values
  get_dropdown_values() {
    const module = "Document Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  //get user profiles
  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        this.peopleList = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    })
  }

  view(data: any) {
    this.dialog.open(ViewDocumentHistoryComponent, {
      data: { data: data }
    })
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

  submit() {
    const formStatus = this.Form.valid
    if (formStatus) {
      Swal.fire({
        title: 'Are you sure?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.update_document()
        }
      })
    } else if (!formStatus) {
      const statusText = "Please fill all mandatory fields"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  update_document() {
    this.documentService.update_document(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_activity()
      }
    })
  }

  create_activity() {
    const action = "Updated a Document"
    const documentNumber = this.Form.value.document_number
    const user = this.Form.value.updated
    this.generalService.create_activity_stream(action, documentNumber, user).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Document Updated',
          imageUrl: "assets/images/success.gif",
          imageWidth: 250,
          text: "You have successfully updated a Hazard / Risk. We will notify the assignee to take appropriate action. If it is required to modify the data, you can modify until the assignee start the process.",
          showCancelButton: false,

        }).then((result) => {
          this.router.navigate(["/apps/document-management/register"])
        })
      }
    })
  }
  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  validate_expiry() {
    if (this.Form.value.no_expiry === true) {
      this.no_expiryValue = true;
      this.Form.controls['expiry_date'].removeValidators(Validators.required)
      this.Form.controls['notify_date'].removeValidators(Validators.required)
      this.Form.controls['expiry_date'].setValue(null)
      this.Form.controls['notify_date'].setValue(null)
    } else if (this.Form.value.no_expiry === false) {
      this.no_expiryValue = false;
      this.Form.controls['expiry_date'].setValidators(Validators.required)
      this.Form.controls['notify_date'].setValidators(Validators.required)
      // this.notify_date.enable()
      // this.expiry_date.enable()
    }
  }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

  go_back() {
    this.backToHistory = true
    this.router.navigate(["/apps/document-management/register"])
  }


}
