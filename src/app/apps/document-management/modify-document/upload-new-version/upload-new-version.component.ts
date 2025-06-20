import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
  selector: 'app-upload-new-version',
  templateUrl: './upload-new-version.component.html',
  styleUrls: ['./upload-new-version.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class UploadNewVersionComponent implements OnInit {

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
  no_expiryValue: boolean = true;

  constructor(
    
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialog: MatDialog,
    private documentService: DocumentService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<UploadNewVersionComponent>,
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
      reporter: [''],
      updated_by: [''],
      reporterDesignation: [''],
      updateDesignation: [''],
      id: [this.defaults.data.id],
      division: [this.defaults.data.division],
      title: [this.defaults.data.title],
      //issuing_authority: ['', [Validators.required]],
      notify_date: [null, [Validators.required]],
      expiry_date: [null, [Validators.required]],
      issued_date: ['', [Validators.required]],
      org_id: [''],
      status: [this.defaults.data.status],
      //document_type: ['', [Validators.required]],
      DocumentFile: [''],
      physical_location: [this.defaults.data.physical_location],
      document_owner: [this.defaults.data.document_owner],
      document_reviewer: [this.defaults.data.document_reviewer],
      remarks: [''],
      docURL: [''],
      day_before_expiry: [null],
      ten_days_after_expiry: [null],
      docID: [null],
      year: [''],
      document: [''],
      user_email: [],
      user: [''],
      revision_date: ['', [Validators.required]],
      revision_number: ['', [Validators.required]],
      no_expiry: [this.defaults.data.no_expiry]
    });
    
    //this.no_expiryValue = this.Form.value.no_expiry;
    if (this.Form.value.no_expiry === true) {
      this.no_expiryValue = true;
      this.Form.controls['expiry_date'].removeValidators(Validators.required)
      this.Form.controls['notify_date'].removeValidators(Validators.required)
      this.Form.controls['status'].setValue('Active')
      this.Form.controls['expiry_date'].setValue(null)
      this.Form.controls['day_before_expiry'].setValue(null)
      this.Form.controls['ten_days_after_expiry'].setValue(null)
      this.Form.controls['notify_date'].setValue(null)
      this.notify_date.setValue(null)
      this.expiry_date.setValue(null)
    } else if (this.Form.value.no_expiry === false) {
      this.no_expiryValue = false;
      this.Form.controls['expiry_date'].setValidators(Validators.required)
      this.Form.controls['notify_date'].setValidators(Validators.required) 
      this.notify_date.setValidators(Validators.required)
      this.expiry_date.setValidators(Validators.required)
    }
    this.Form.controls['expiry_date'].updateValueAndValidity();
    this.Form.controls['notify_date'].updateValueAndValidity();
  }



  notifyDate(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['notify_date'].setValue(newDate)
  }

  revisionDate(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['revision_date'].setValue(newDate)
  }
  issuedDate(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    const newYear = new Date(date.setDate(date.getDate() - 1));
    this.Form.controls['issued_date'].setValue(newDate)
    this.Form.controls['year'].setValue(newYear.getFullYear())
    const notifyDate = this.Form.controls['notify_date'].value;
    const expiryDate = this.Form.controls['expiry_date'].value;
    const currentNotifyDate = new Date(this.Form.controls['notify_date'].value);
    const currentExpiryDate = new Date(this.Form.controls['expiry_date'].value);
    const normalizedIssueDate = new Date(newDate);

    if(this.no_expiryValue == false){
      if (notifyDate) {
        const normalizedCurrentNotifyDate = new Date(currentNotifyDate?.toISOString().slice(0, 10));
        if (normalizedCurrentNotifyDate < normalizedIssueDate) {
          this.Form.controls['notify_date'].setValue(null);
          this.notify_date.reset()
        }
      }
      if (expiryDate) {
        const normalizedCurrentExpiryDate = new Date(currentExpiryDate?.toISOString().slice(0, 10));
        if (normalizedCurrentExpiryDate < normalizedIssueDate) {
          this.Form.controls['expiry_date'].setValue(null);
          this.expiry_date.reset()
        }
      }
    }

    
  }
  expiryDate(event: any) {
    const selectedExpiryDate = new Date(event.value);
    const newExpiryDate = new Date(selectedExpiryDate.setDate(selectedExpiryDate.getDate() + 1));
    const newExpiryDateString = newExpiryDate.toISOString().slice(0, 10);
    this.Form.controls['expiry_date'].setValue(newExpiryDateString);
    const currentNotifyDate = new Date(this.Form.controls['notify_date'].value);
    const notifyDate = this.Form.controls['notify_date'].value;
    const dayBeforeExpiry = new Date(selectedExpiryDate.setDate(selectedExpiryDate.getDate()-1)).toISOString().slice(0, 10);
    this.Form.controls['day_before_expiry'].setValue(dayBeforeExpiry);
    const tenDaysAfterExpiry = new Date(selectedExpiryDate.setDate(selectedExpiryDate.getDate() + 11)).toISOString().slice(0, 10);
    this.Form.controls['ten_days_after_expiry'].setValue(tenDaysAfterExpiry);
    const normalizedNewExpiryDate = new Date(newExpiryDateString);
    if (notifyDate) {
      const normalizedCurrentNotifyDate = new Date(currentNotifyDate?.toISOString().slice(0, 10));
      if (normalizedCurrentNotifyDate > normalizedNewExpiryDate) {
        this.Form.controls['notify_date'].setValue(null);
        this.notify_date.reset()
      }
    }
    const sysDate = new Date();
    const normalizedSysDate = new Date(sysDate.toISOString().slice(0, 10));
    if (normalizedNewExpiryDate <= normalizedSysDate) {
      this.Form.controls['status'].setValue("Expired");
    } else {
      this.Form.controls['status'].setValue("Active");
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

  private showSnackBar(message: string): void {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onUpload(event: any) {
    const maxFiles = 5;
    const maxSizeMB = 10;
    const fileLength = this.files.length;
    if (fileLength + event.addedFiles.length <= maxFiles) {
      const size = event.addedFiles[0].size / (1024 * 1024);
      if (size > maxSizeMB) {
        const statusText = "Please choose a file below 10 MB";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['pdf', 'xlsx', 'jpg', 'jpeg', 'png', 'docx'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase();
        const isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.files.push(...event.addedFiles);
          this.Form.controls['DocumentFile'].setErrors(null)
        } else {
          const statusText = "Please choose files with allowed extensions ('pdf', 'xlsx', 'jpg', 'jpeg', 'png', 'docx')";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else {
      const statusText = "You have exceeded the upload limit";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
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
          this.backup()
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

  backup() {
    this.Form.enable()
    let DocIDs = this.defaults.file.map((item: { id: any; }) => item.id);
    this.documentService.document_backup(this.defaults.data, DocIDs, this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_document()
      }
    })
  }

  onSelect(event: any) {
    const maxFiles = 5;
    const maxSizeMB = 10;
    const fileLength = this.files.length;
    if (fileLength + event.addedFiles.length <= maxFiles) {
      const size = event.addedFiles[0].size / (1024 * 1024);
      if (size > maxSizeMB) {
        const statusText = "Please choose a file below 10 MB";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['pdf', 'xlsx', 'jpg', 'jpeg', 'png', 'docx'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase();
        const isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.files.push(...event.addedFiles);
          this.Form.controls['DocumentFile'].setErrors(null)
        } else {
          const statusText = "Please choose files with allowed extensions ('pdf', 'xlsx', 'jpg', 'jpeg', 'png', 'docx')";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else {
      const statusText = "You have exceeded the upload limit";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  create_document() {
    this.documentService.new_document(this.Form.value, this.defaults.data.id).subscribe({
      next: (result: any) => {
        this.documentID = result.data.id
        this.create_activity()
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_document_file()
        Swal.close();
        //this.delete_existing_file()
      }
    })
  }

  create_activity() {
    const action = "Uploaded a new version"

    this.documentService.create_activity_stream(action, this.Form.value).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    })
  }
  // delete_existing_file() {
  //   if (this.defaults.file.length !== 0) {
  //     let docIDs = this.defaults.file.map((item: { id: any; }) => item.id);
  //     console.log(docIDs);

  //     let deleteIndex = 0;

  //     const deleteNext = () => {
  //       if (deleteIndex < docIDs.length) {
  //         const docID = docIDs[deleteIndex];

  //         // Delete document
  //         this.documentService.delete_document(docID).subscribe({
  //           next: (result: any) => {
  //             console.log(result);

  //             // Delete associated image
  //             this.generalService.delete_image(result.data.attributes.document_id).subscribe({
  //               next: (imageResult: any) => {
  //                 console.log(imageResult);
  //               },
  //               error: (imageError: any) => {
  //                 // Handle errors during image deletion
  //                 console.error('Error deleting image:', imageError);
  //               },
  //               complete: () => {
  //                 // After image deletion, proceed to the next document
  //                 deleteIndex++;
  //                 deleteNext();
  //               }
  //             });
  //           },
  //           error: (error: any) => {
  //             // Handle errors during document deletion
  //             console.error('Error deleting document:', error);
  //           }
  //         });
  //       } else {
  //         // All documents are deleted, call create_document_file
  //         this.create_document_file();
  //       }
  //     };

  //     // Start the deletion process
  //     deleteNext();
  //   } else {
  //     // No documents to delete, call create_document_file directly
  //     this.create_document_file();
  //   }
  // }


  create_document_file() {
    if (this.files.length > 0) {
      let uploadedFiles = 0;

      this.files.forEach((elem: any) => {
        const size = elem.size;

        if (size <= 10 * 1024 * 1024) {
          const extension = elem.name.split('.').pop().toLowerCase();
          const fileName = this.Form.value.title + '_' + this.Form.value.division + '.' + extension;

          const docdata = this.evidenceFormData = new FormData();
          docdata.append('files', elem, fileName);

          this.generalService.upload(docdata).subscribe({
            next: (result: any) => {
              this.Form.controls['docID'].setValue(result[0].id);
              const data = [{
                document_name: result[0].hash,
                format: extension,
                document_id: result[0].id,
                document_management: this.documentID,
              }];

              this.documentService.create_document_file(data[0]).subscribe({
                next: () => {
                  uploadedFiles++;
                  if (uploadedFiles === this.files.length) {
                    this.handleDialogClosure();
                  }
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"]);
                },
                complete: () => {
                  uploadedFiles++;
                  if (uploadedFiles === this.files.length) {
                    this.handleDialogClosure();
                  }
                }
              });
            },
            error: (err: any) => {
              uploadedFiles++;
              if (uploadedFiles === this.files.length) {
                this.handleDialogClosure();
              }
            }
          });
        } else {
          const statusText = "File size exceeds 10MB: " + elem.name;
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          uploadedFiles++;
          if (uploadedFiles === this.files.length) {
            this.handleDialogClosure();
          }
        }
      });
    }
    else {
      this.handleDialogClosure();
    }

  }

  validate_expiry() {
    if (this.Form.value.no_expiry === true) {
      this.no_expiryValue = true;
      this.Form.controls['expiry_date'].removeValidators(Validators.required)
      this.Form.controls['notify_date'].removeValidators(Validators.required)
      this.Form.controls['status'].setValue('Active')
      this.Form.controls['expiry_date'].setValue(null)
      this.Form.controls['notify_date'].setValue(null)
      this.Form.controls['day_before_expiry'].setValue(null)
      this.Form.controls['ten_days_after_expiry'].setValue(null)
      this.notify_date.setValue(null)
      this.expiry_date.setValue(null)
    } else if (this.Form.value.no_expiry === false) {
      this.no_expiryValue = false;
      this.Form.controls['expiry_date'].setValidators(Validators.required)
      this.Form.controls['notify_date'].setValidators(Validators.required)
      this.notify_date.setValidators(Validators.required)
      this.expiry_date.setValidators(Validators.required)
      
    }
    this.Form.controls['expiry_date'].updateValueAndValidity();
    this.Form.controls['notify_date'].updateValueAndValidity();
  }

  private handleDialogClosure() {
    const statusText = "New version uploaded ";
    this._snackBar.open(statusText, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
    this.dialogRef.close(this.documentID);
  }


}
