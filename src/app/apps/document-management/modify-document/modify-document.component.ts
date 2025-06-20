import { Component, OnInit } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { NewTitleComponent } from '../new-title/new-title.component';
import { documentPreviewComponent } from '../document-preview/document-preview.component';
import { UploadNewVersionComponent } from './upload-new-version/upload-new-version.component';
import { ViewDocumentHistoryComponent } from './view-document-history/view-document-history.component';
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
  selector: 'app-modify-document',
  templateUrl: './modify-document.component.html',
  styleUrls: ['./modify-document.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ModifyDocumentComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: string
  Form: FormGroup
  valueForm: boolean = false;
  categories: any[]
  subcategories: any[] = []
  observations: any[] = []
  allBodyPart: string[] = [];
  bodypart: string[] = [];
  bodyParts: any[] = []
  currentDoc: any[] = []
  filteredBodyPart: Observable<string[]>;
  bodyPartCtrl = new FormControl('');
  divisions: any[] = []
  uploadedFiles: File[] = [];
  DocumentFiles: File[] = [];
  documentData: any[] = []
  documentIds: any[] = [];
  issued_date = new FormControl(null, [Validators.required]);
  expiry_date = new FormControl(null, [Validators.required]);
  notify_date = new FormControl(null, [Validators.required]);
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
  historyList: any[] = []
  activityList: any[] = []
  evidenceFormData = new FormData()
  year = new FormControl(null, [Validators.required]);
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
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
    private imageCompress: NgxImageCompressService,
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      reported_date: [''],
      document_number: ['', [Validators.required]],
      version_number: ['', [Validators.required]],
      reporter: ['', [Validators.required]],
      updated_by: [''],
      reporterDesignation: [''],
      updateDesignation: [''],
      id: ['', [Validators.required]],
      division: ['', [Validators.required]],
      title: ['', [Validators.required]],
      issuing_authority: ['', [Validators.required]],
      notify_date: [null],
      expiry_date: [null],
      issued_date: ['', [Validators.required]],
      org_id: ['', [Validators.required]],
      status: ['', [Validators.required]],
      document_type: ['', [Validators.required]],
      DocumentFile: [''],
      physical_location: [''],
      document_owner: [''],
      document_reviewer: ['', [Validators.required]],
      remarks: [''],
      docURL: [''],
      docID: [null],
      year: [''],
      document: [''],
      reporterID: [''],
      unique_id: [''],
      user_email: [],
      user: [''],
      no_expiry: []
    });

  }

  issuedDate(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    const newYear = new Date(date.setDate(date.getDate() - 1));
    this.Form.controls['issued_date'].setValue(newDate)
    this.Form.controls['year'].setValue(newYear.getFullYear())

  }

  notifyDate(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['notify_date'].setValue(newDate)
  }

  expiryDate(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['expiry_date'].setValue(newDate)
    const sysDate = new Date()
    if (new Date(newDate) <= new Date(sysDate)) {
      this.Form.controls['status'].setValue("Expired")
    } else {
      this.Form.controls['status'].setValue("Active")
    }
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
        const status = result.doc_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['user'].setValue(result.profile.id)
          this.Form.controls['updated_by'].setValue(result.profile.id)
          this.Form.controls['user_email'].setValue(result.profile.email)
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
          //this.get_dropdown_values()
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

  get_dropdown_values() {
    const module = "Document Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.get_document_type()
      }
    })
  }

  get_document_type() {
    const dataType = this.dropdownValues.filter(function (data: any) {
      return (data.attributes.Category === "Document Type")
    })
    this.documentType = dataType

    this.get_divisions()

  }

  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        this.divisions = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.get_document_title()
      }
    })
  }

  get_document_title() {
    this.documentService.get_document_title().subscribe({
      next: (result: any) => {
        this.titles = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.document_details()
      }
    })
  }

  getTitles() {
    const type = this.Form.value.document_type
    const category = this.titles.filter(function (elem: any) {
      return (elem.attributes.category === type)
    })
    this.filterTitles = category
  }

  updated_document_details() {
    this.DocumentFiles = [];
    this.documentIds = [];
    this.documentData = [];
    const reference = this.route.snapshot.paramMap.get('id');

    this.documentService.get_document_details(this.Form.value.org_id, reference).subscribe(
      (result: any) => {

        this.documentData = result.data[0].attributes.document_files.data;
        if (this.documentData.length > 0) {
          this.Form.controls['document'].setValue('OK');
        } else {
          this.Form.controls['document'].reset();
        }

        const document__data = result.data[0].attributes.document_files.data;
        if (document__data.length > 0) {
          this.DocumentFiles = [];

          const loadImageAtIndex = (index: number) => {
            if (index >= document__data.length) {
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
        }
        if (matchFound || matchFound !== false) {
          this.Form.controls['document_number'].setValue(result.data[0].attributes.document_number);
          this.Form.controls['version_number'].setValue(result.data[0].attributes.version_number);
          this.Form.controls['reporterID'].setValue(result.data[0]?.attributes?.created_user?.data?.id);
          this.Form.controls['reporter'].setValue(result.data[0].attributes?.created_user?.data?.attributes?.first_name + ' ' + result.data[0]?.attributes?.created_user?.data?.attributes?.last_name);
          this.Form.controls['reporterDesignation'].setValue(result.data[0]?.attributes?.created_user?.data?.attributes?.designation);
          this.Form.controls['updateDesignation'].setValue(result.data[0].attributes.updated_user?.data?.attributes.designation);
          this.Form.controls['id'].setValue(result.data[0].id);
          this.Form.controls['division'].setValue(result.data[0].attributes.division);
          this.Form.controls['status'].setValue(result.data[0].attributes.status);
          this.Form.controls['issuing_authority'].setValue(result.data[0].attributes.issuing_authority);
          this.Form.controls['title'].setValue(result.data[0].attributes.title);
          this.Form.controls['remarks'].setValue(result.data[0].attributes.remarks);
          if (result.data[0].attributes.notify_date != null) {
            this.Form.controls['notify_date'].setValue(new Date(result.data[0].attributes.notify_date));
          }
          if (result.data[0].attributes.expiry_date != null) {
            this.Form.controls['expiry_date'].setValue(new Date(result.data[0].attributes.expiry_date));
          }
          this.Form.controls['issued_date'].setValue(new Date(result.data[0].attributes.issued_date));
          this.Form.controls['document_reviewer'].setValue(result.data[0].attributes.document_reviewer);
          this.Form.controls['document_owner'].setValue(result.data[0].attributes.document_owner);
          this.Form.controls['physical_location'].setValue(result.data[0].attributes.physical_location);
          this.Form.controls['document_type'].setValue(result.data[0].attributes.document_type);
          this.Form.controls['year'].setValue(result.data[0].attributes.year);
          this.Form.controls['unique_id'].setValue(result.data[0].attributes.unique_id);
          this.issued_date.setValue(new Date(result.data[0].attributes.issued_date));
          if (result.data[0].attributes.notify_date != null) {
            this.notify_date.setValue(new Date(result.data[0].attributes.notify_date));
          }
          if (result.data[0].attributes.expiry_date != null) {
            this.expiry_date.setValue(new Date(result.data[0].attributes.expiry_date));
          }
          this.Form.controls['no_expiry'].setValue(result.data[0].attributes.no_expiry == null ? false : result.data[0].attributes.no_expiry);
          this.no_expiryValue = this.Form.value.no_expiry;
          this.Form.controls.title.disable()
          this.Form.controls.document_type.disable()
          this.Form.controls.division.disable()
          this.Form.controls.issuing_authority.disable()
          this.documentData = result.data[0].attributes.document_files?.data;

          this.issued_date.disable()
          this.expiry_date.disable()
          this.notify_date.disable()
          this.Form.controls['document_number'].disable()
          this.Form.controls['version_number'].disable()
          this.Form.controls['no_expiry'].disable()


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

          const document__data = result.data[0].attributes.document_files?.data;
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

  new_title() {
    const title = this.titles.filter(function (elem: any) {
      return (elem.attributes?.created_user?.data !== null)
    })
    const titleCount = Number(title.length)
    if (titleCount >= this.documentCount) {
      const statusText = "Document title length exceeded"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    else if (titleCount < this.documentCount) {
      this.dialog.open(NewTitleComponent).afterClosed().subscribe((data: any) => {
        const type = this.Form.value.document_type
        const title = data.title
        this.documentService.create_title(type, title, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.documentService.get_document_title().subscribe({
              next: (result: any) => {
                this.titles = result.data
                const type = this.Form.value.document_type
                const category = this.titles.filter(function (elem: any) {
                  return (elem.attributes.category === type)
                })
                this.filterTitles = category
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Document title created successfully"
                this._snackBar.open(statusText, 'Close Warning', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['title'].setValue(result.data.attributes.title)
              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })

      })
    }
  }

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
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


  onUpload(event: any): void {
    const maxFiles = 5;
    const addedFiles: File[] = event.addedFiles;
    const remainingSlots = maxFiles - this.DocumentFiles.length;

    if (this.DocumentFiles.length >= maxFiles) {
      const statusText = "You can only upload a maximum of 5 files";
      this.showSnackBar(statusText);
      addedFiles.splice(maxFiles);
      Swal.close();
      return;
    }

    this.uploadedFiles = [];
    const totalFilesToUpload = Math.min(remainingSlots, addedFiles.length);
    let uploadedFileCount = 0;

    for (const file of addedFiles.slice(0, totalFilesToUpload)) {
      if (!file) continue;

      const maxSizeMB = 10;
      const sizeMB = file.size / 1024 / 1024;

      if (sizeMB > maxSizeMB) {
        const statusText = "Please choose a file below 10 MB";
        this.showSnackBar(statusText);
        continue; // Skip this file
      }

      // File is valid, proceed with uploading
      this.uploadFile(file, () => {
        uploadedFileCount++;
        if (uploadedFileCount === totalFilesToUpload) {
          // this.document_details();
          this.updated_document_details();
        }
      });
    }
  }

  private uploadFile(file: File, onComplete: () => void): void {
    this.Form.controls['DocumentFile'].setErrors(null);
    this.uploadedFiles.push(file);

    if (file.name) {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (!extension) return;

      const formData = new FormData();
      this.Form.controls.document_number.enable()
      formData.append('files', file, this.Form.value.document_number + '.' + extension);

      this.generalService.upload(formData).subscribe({
        next: (result: any) => {
          const id = this.Form.value.id;
          const data = [
            {
              document_name: result[0].hash,
              format: extension,
              document_id: result[0].id,
              document_management: id,
            },
          ];

          this.documentService.create_document_file(data[0]).subscribe({
            next: (result: any) => {
              this.Form.controls.document_number.disable()
              const successText = "Document Uploaded Successfully";
              this.showSnackBar(successText);
            },
            error: () => { },
            complete: () => {
              onComplete();
            },
          });
        },
        error: (error: any) => {
          const errorText = "Error Uploading File: " + error.message;
          this.showSnackBar(errorText);
          onComplete();
        },
      });
    }
  }

  private showSnackBar(message: string): void {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  view(data: any) {
    this.dialog.open(ViewDocumentHistoryComponent, {
      data: { data: data }
    })
  }

  onRemove(file: File, index: number): void {
    this.showProgressPopup()
    if (index < 0 || index >= this.DocumentFiles.length) {
      return;
    }
    const documentId = this.documentIds[index];
    if (documentId) {
      this.documentService.delete_document(documentId.id).subscribe({
        next: (result: any) => {
          this.generalService.delete_image(result.data.attributes.document_id).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = "Document Deleted";
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.documentIds.splice(index, 1);
              this.DocumentFiles.splice(index, 1);
              this.updated_document_details()
              // this.document_details();
              Swal.close()
            }
          })

        },
        error: (error: any) => {
        },
      });
    }
  }

  submit() {
    this.Form.valueChanges.subscribe(() => {
      this.valueForm = true;
    });
    const formStatus = this.Form.valid

    if (formStatus && this.valueForm === true) {
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
          this.showProgressPopup();
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

    this.documentService.create_activity_stream(action, this.Form.value).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        Swal.close()
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Document Updated',
          imageUrl: "assets/images/success.gif",
          imageWidth: 250,
          text: "You have successfully updated the document details",
          showCancelButton: false,

        }).then((result) => {
          this.router.navigate(["/apps/document-management/register"])
        })
      }
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

  uploadNewVersion() {
    this.Form.controls.title.enable()
    this.Form.controls.document_type.enable()
    this.Form.controls.division.enable()
    this.Form.controls.issuing_authority.enable()
    this.Form.controls.document_number.enable()
    this.Form.controls.version_number.enable()
    this.Form.controls.no_expiry.enable()
    this.dialog.open(UploadNewVersionComponent, {
      data: { data: this.Form.value, file: this.documentData }
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.ngOnInit()
        this.validate_expiry()
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
    }
  }

  goBack() {
    this.backToHistory = true
    this.router.navigate(["/apps/document-management/register"])
  }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

}
