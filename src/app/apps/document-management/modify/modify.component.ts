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
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ModifyComponent implements OnInit {
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
  Division = new FormControl(null, [Validators.required]);
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
      reporter: ['', [Validators.required]],
      updated_by: [''],
      reporterDesignation: [''],
      updateDesignation: [''],
      id: ['', [Validators.required]],
      division: ['', [Validators.required]],
      business_unit:[null],
      title: ['', [Validators.required]],
      issuing_authority: ['', [Validators.required]],
      notify_date: ['', [Validators.required]],
      expiry_date: ['', [Validators.required]],
      issued_date: ['', [Validators.required]],
      org_id: ['', [Validators.required]],
      status: ['', [Validators.required]],
      document_type: ['', [Validators.required]],
      DocumentFile: [''],
      physical_location: [''],
      document_owner: [''],
      day_before_expiry: [null],
      ten_days_after_expiry: [null],
      document_reviewer: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      docURL: [''],
      docID: [null],
      year: [''],
      document: [''],
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
    const date = new Date(event.value);
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10);
    this.Form.controls['expiry_date'].setValue(newDate);
    const dayBeforeExpiry = new Date(date.setDate(date.getDate()-1)).toISOString().slice(0, 10);
    this.Form.controls['day_before_expiry'].setValue(dayBeforeExpiry);
    const tenDaysAfterExpiry = new Date(date.setDate(date.getDate() + 11)).toISOString().slice(0, 10);
    this.Form.controls['ten_days_after_expiry'].setValue(tenDaysAfterExpiry);
    const sysDate = new Date();
    if (new Date(newDate) <= new Date(sysDate)) {
      this.Form.controls['status'].setValue("Expired");
    } else {
      this.Form.controls['status'].setValue("Active");
    }
  }

  filterDocumentType(value: any) {
    return value.attributes?.Category === "Document Type"
  }
  BusinessUnit(event: any) { 
    const selectedData = this.divisions.find(data => data.attributes.division_name === event.value);
    this.Form.controls['division'].setValue(selectedData.attributes.division_name) 
    this.Form.controls['business_unit'].setValue(selectedData.id)       
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
          this.Form.controls['updated_by'].setValue(result.profile.id)
          this.get_dropdown_values()
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
  document_details() {
    this.DocumentFiles = [];
    this.documentIds = [];
    this.documentData = [];
    const reference = this.route.snapshot.paramMap.get('id');

    this.documentService.get_document_details(this.Form.value.org_id, reference).subscribe(
      (result: any) => {
        this.Form.controls['document_number'].setValue(result.data[0].attributes.document_number);
        this.Form.controls['reporter'].setValue(result.data[0].attributes.created_user.data.attributes.first_name + ' ' + result.data[0].attributes.created_user.data.attributes.last_name);
        this.Form.controls['reporterDesignation'].setValue(result.data[0].attributes.created_user.data.attributes.designation);
        this.Form.controls['updateDesignation'].setValue(result.data[0].attributes.updated_user?.data?.attributes.designation);
        this.Form.controls['id'].setValue(result.data[0].id);
        this.Form.controls['division'].setValue(result.data[0].attributes.division);
        this.Form.controls['status'].setValue(result.data[0].attributes.status);
        this.Form.controls['issuing_authority'].setValue(result.data[0].attributes.issuing_authority);
        this.Form.controls['title'].setValue(result.data[0].attributes.title);
        this.Form.controls['remarks'].setValue(result.data[0].attributes.remarks);
        this.Form.controls['notify_date'].setValue(new Date(result.data[0].attributes.notify_date));
        this.Form.controls['expiry_date'].setValue(new Date(result.data[0].attributes.expiry_date));
        this.Form.controls['day_before_expiry'].setValue(new Date(result.data[0].attributes.day_before_expiry));
        this.Form.controls['ten_days_after_expiry'].setValue(new Date(result.data[0].attributes.ten_days_after_expiry));
        this.Form.controls['issued_date'].setValue(new Date(result.data[0].attributes.issued_date));
        this.Form.controls['document_reviewer'].setValue(result.data[0].attributes.document_reviewer);
        this.Form.controls['document_owner'].setValue(result.data[0].attributes.document_owner);
        this.Form.controls['physical_location'].setValue(result.data[0].attributes.physical_location);
        this.Form.controls['document_type'].setValue(result.data[0].attributes.document_type);
        this.Form.controls['year'].setValue(result.data[0].attributes.year);
        this.issued_date.setValue(new Date(result.data[0].attributes.issued_date));
        this.expiry_date.setValue(new Date(result.data[0].attributes.expiry_date));
        this.notify_date.setValue(new Date(result.data[0].attributes.notify_date));
        this.documentData = result.data[0].attributes.document_files?.data;
        this.Division.setValue(result.data[0].attributes.division)
        this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
        if (this.documentData.length > 0) {
          this.Form.controls['document'].setValue('OK');
        } else {
          this.Form.controls['document'].reset();
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
      },
      (err: any) => {
        this.router.navigate(["/error/internal"]);
      }
    );
  }

  new_title() {
    const title = this.titles.filter(function (elem: any) {
      return (elem.attributes.created_user.data !== null)
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
        const statusText = "File size exceeded,Please choose a file below 10 MB";
        this.showSnackBar(statusText);
        continue; // Skip this file
      }

      // File is valid, proceed with uploading
      this.uploadFile(file, () => {
        uploadedFileCount++;
        if (uploadedFileCount === totalFilesToUpload) {
          // All files have been uploaded
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
              const successText = "Document Uploaded Successfully";9
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
    const documentNumber = this.Form.value.document_number
    const user = this.Form.value.updated
    this.generalService.create_activity_stream(action, documentNumber, user).subscribe({
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

}
