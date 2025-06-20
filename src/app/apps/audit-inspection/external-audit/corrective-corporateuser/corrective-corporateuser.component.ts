import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { ExternalAuditService } from 'src/app/services/external-audit.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ViewActionPlanDocumentComponent } from '../view-action-plan-document/view-action-plan-document.component';
import Swal from 'sweetalert2';

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
  selector: 'app-corrective-corporateuser',
  templateUrl: './corrective-corporateuser.component.html',
  styleUrls: ['./corrective-corporateuser.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CorrectiveCorporateuserComponent implements OnInit {
  Form: FormGroup
  dueDate = new FormControl({ value: null, disabled: true }, [Validators.required]);
  comDatedp = new FormControl({ value: null, disabled: true }, [Validators.required]);
  comDate = new FormControl(null);
  orgID: any
  selectedStatus: string;
  heirarchy_dropdown: any[] = [];
  priority_dropdown: any[] = []
  assignee_dropdown: any[] = []
  heirarchy_value: any;
  multipleevidenceIds: any[] = [];
  MultipleDoumentAfterFiles: File[] = [];
  files: File[] = [];
  peopleList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isDisabled: boolean = true;
  uploadedFiles: File[] = [];
  DocumentFiles: File[] = [];
  multipledocumentIds:any[]=[]
  multiple_evidence_After:boolean = false;
  MultipleDoumentBeforeFiles: File[] = [];
  multiple_evidence_Before:boolean = false;
  evidenceAfterFiles: File[] = [];
  documentData: any[] = []
  documentIds: any[] = [];
  evidenceIds: any[] = [];
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
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public externalAuditService: ExternalAuditService,
    private config: NgbRatingConfig,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.configuration()

    this.Form = this.formBuilder.group({
      org_id: [''],
      date: [null],
      id: ['', [Validators.required]],
      due_date: [null, [Validators.required]],
      complete_date: [null, [Validators.required]],
      status: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      finding: ['', [Validators.required]],
      action_plan: ['', [Validators.required]],
      root_cause: ['', [Validators.required]],
      heirarchy_control: ['', [Validators.required]],
      sustainable_solution: [''],
      evidence: [''],
      document_id: [''],
      document_name: [''],
      document_format: [''],
      evidence_after: [''],
      document_id_after: [''],
      document_name_after: [''],
      document_format_after: [''],
      assignee: [''],
      barriers_challenges: ['', [Validators.required]],
      remark: ['', [Validators.required]],
      corporateuser_remark: ['', [Validators.required]],
      DocumentFile: [''],
      reference: [this.defaults.reference],
      implemented_actions: [''],
      lessons_learned: [''],
      target_completion_date:[null],
      initialAssignee:[null]
    });

  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.audit_inspection
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.ext_aud_audit
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_action_plan()
          this.get_dropdownValue()
          this.get_profiles()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  //get dropdown values
  get_dropdownValue() {
    const module = 'External Audit'
    this.externalAuditService.get_dropdown(module).subscribe({
      next: (result: any) => {
        const data = result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Hierarchy of Control' && elem.attributes.Module === module
        });
        let dropData: any[] = [];
        data.forEach((elem: any) => {
          dropData.push(elem.attributes.Value);
        });
        this.heirarchy_dropdown = dropData;
        const prioritydata = result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Priority' && elem.attributes.Module === module
        });
        let dropdownData: any[] = [];
        prioritydata.forEach((elem: any) => {
          dropdownData.push(elem.attributes.Value);
        })
        this.priority_dropdown = dropdownData;
      },
      error: (err: any) => { },
      complete: () => { },
    })
  }

  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked === false);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    });
  }

  get_action_plan() {
    const id = this.defaults.data.id;

    this.externalAuditService.audit_action_plan(id).subscribe({
      next: (result: any) => {
        this.Form.controls['date'].setValue(result.data.attributes.date)
        this.Form.controls['id'].setValue(result.data.id)
        this.Form.controls['finding'].setValue(result.data.attributes.finding)
        this.Form.controls['action_plan'].setValue(result.data.attributes.action_plan)
        this.Form.controls['root_cause'].setValue(result.data.attributes.root_cause)
        this.Form.controls['priority'].setValue(result.data.attributes.priority)
        this.Form.controls['heirarchy_control'].setValue(result.data.attributes.heirarchy_control)
        this.Form.controls['sustainable_solution'].setValue(result.data.attributes.sustainable_solution)
        this.Form.controls['initialAssignee'].setValue(result.data.attributes.initial_assignee.data.id)
        if (result.data.attributes.due_date) {
          this.dueDate.setValue(new Date(result.data.attributes.due_date))
          this.Form.controls['due_date'].setValue(result.data.attributes.due_date)

        }

        if (result.data.attributes.target_completion_date) {
          this.comDatedp.setValue(new Date(result.data.attributes.target_completion_date))
          this.Form.controls['target_completion_date'].setValue(result.data.attributes.target_completion_date)

        }
        
        this.Form.controls['barriers_challenges'].setValue(result.data.attributes.barriers_challenges)
        this.Form.controls['remark'].setValue(result.data.attributes.remarks)
        this.Form.controls['corporateuser_remark'].setValue(result.data.attributes.corporateuser_remark)
        this.Form.controls['implemented_actions'].setValue(result.data.attributes.implemented_actions)
        this.Form.controls['lessons_learned'].setValue(result.data.attributes.lessons_learned)
        this.Form.controls['assignee'].setValue(result.data.attributes.assignee.data.id)
        this.Form.controls['evidence'].setValue(result.data.attributes.evidences?.data.length)


        const document__data = result.data.attributes.evidences?.data;
        if (document__data.length > 0) {
          const loadImageAtIndex = (index: number) => {
            if (index >= document__data.length) {
              return;
            }
            const document = document__data[index];
            this.generalService.getImage(environment.client_backend + '/uploads/' + document?.attributes?.evidence_name + '.' + document?.attributes.format).subscribe((data: any) => {
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
              const file = new File([blob], document.attributes.evidence_name + '.' + document.attributes.format, { type: blobType });
              const documentId = document.id;
              const pdfUrl = URL.createObjectURL(blob);

              const documentInfo = {
                id: documentId,
                file_name: document.attributes.evidence_name,
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

        const multipleEvidenceBefore = result.data.attributes.external_multiple_before?.data;
        if (multipleEvidenceBefore && multipleEvidenceBefore.length > 0) {
          this.MultipleDoumentBeforeFiles = [];
        
          const loadImageAtIndex = (index: number) => {
            if (index >= multipleEvidenceBefore.length) {
              // After all documents are loaded, set the flag.
              if (this.MultipleDoumentBeforeFiles.length > 0) {
                this.multiple_evidence_Before = true;
              }
              return;
            }
        
            const document = multipleEvidenceBefore[index];
            const documentUrl = environment.client_backend + '/uploads/' + document?.attributes?.evidence_name + '.' + document?.attributes.format;
        
            this.generalService.getImage(documentUrl).subscribe((data: any) => {
              let blobType = '';
              const fileType = document.attributes.format.toLowerCase();
        
              // Determine the blob type based on file format
              switch (fileType) {
                case 'pdf':
                  blobType = 'application/pdf';
                  break;
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                  blobType = 'image/' + fileType;
                  break;
                case 'xlsx':
                case 'xls':
                  blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                  break;
                default:
                  blobType = 'application/octet-stream';
              }
        
              const blob = new Blob([data], { type: blobType });
              const file = new File([blob], document.attributes.evidence_name + '.' + document.attributes.format, { type: blobType });
              const documentId = document.id;
              const pdfUrl = URL.createObjectURL(blob);
        
              // Store the document information in documentIds and MultipleDoumentBeforeFiles arrays
              const documentInfo = {
                id: documentId,
                file_name: document.attributes.evidence_name,
                file_format: document.attributes.format,
                file: file,
                pdfUrl: pdfUrl,
                type: blobType
              };
        
              this.multipledocumentIds[index] = documentInfo; // Save document info at correct index
              this.MultipleDoumentBeforeFiles.push(file); // Add file to the array
        
              // Proceed to load the next document
              loadImageAtIndex(index + 1);
            });
          };
        
          // Start loading the documents from the first index
          loadImageAtIndex(0);
        }


        const evidence_after_data = result.data.attributes.evidence_after?.data;
        if (evidence_after_data.length > 0) {
          this.evidenceAfterFiles = [];

          const loadImageAtIndex = (index: number) => {
            if (index >= evidence_after_data.length) {
              return;
            }
            const document = evidence_after_data[index];
            this.generalService.getImage(environment.client_backend + '/uploads/' + document?.attributes?.evidence_after_name + '.' + document?.attributes.format_after).subscribe((data: any) => {
              let blobType = '';
              let fileType = document.attributes.format_after.toLowerCase();

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
              const file = new File([blob], document.attributes.evidence_after_name + '.' + document.attributes.format_after, { type: blobType });
              const documentId = document.id;
              const pdfUrl = URL.createObjectURL(blob);

              const documentInfo = {
                id: documentId,
                file_name: document.attributes.evidence_after_name,
                file_format: document.attributes.format_after,
                file: file,
                pdfUrl: pdfUrl,
                type: blobType
              };

              this.evidenceIds[index] = documentInfo;
              this.evidenceAfterFiles.push(file);

              loadImageAtIndex(index + 1);
            });
          };
          loadImageAtIndex(0);
        }

        
        const multipleEvidenceAfter = result.data.attributes.external_multiple_after?.data;
        if (multipleEvidenceAfter && multipleEvidenceAfter.length > 0) {
          this.MultipleDoumentAfterFiles = [];
        
          const loadImageAtIndex = (index: number) => {
            if (index >= multipleEvidenceAfter.length) {
              // After all documents are loaded, set the flag.
              if (this.MultipleDoumentAfterFiles.length > 0) {
                this.multiple_evidence_After = true;
              }
              return;
            }
        
            const document = multipleEvidenceAfter[index];
            const documentUrl = environment.client_backend + '/uploads/' + document?.attributes?.evidence_name + '.' + document?.attributes.format;
        
            this.generalService.getImage(documentUrl).subscribe((data: any) => {
              let blobType = '';
              const fileType = document.attributes.format.toLowerCase();
        
              // Determine the blob type based on file format
              switch (fileType) {
                case 'pdf':
                  blobType = 'application/pdf';
                  break;
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                  blobType = 'image/' + fileType;
                  break;
                case 'xlsx':
                case 'xls':
                  blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                  break;
                default:
                  blobType = 'application/octet-stream';
              }
        
              const blob = new Blob([data], { type: blobType });
              const file = new File([blob], document.attributes.evidence_name + '.' + document.attributes.format, { type: blobType });
              const documentId = document.id;
              const pdfUrl = URL.createObjectURL(blob);
        
              // Store the document information in documentIds and MultipleDoumentBeforeFiles arrays
              const documentInfo = {
                id: documentId,
                file_name: document.attributes.evidence_name,
                file_format: document.attributes.format,
                file: file,
                pdfUrl: pdfUrl,
                type: blobType
              };
        
         
              this.multipleevidenceIds[index] = documentInfo;// Save document info at correct index
              this.MultipleDoumentAfterFiles.push(file); // Add file to the array
        
              // Proceed to load the next document
              loadImageAtIndex(index + 1);
            });
          };
        
          // Start loading the documents from the first index
          loadImageAtIndex(0);
        }
        
        this.Form.controls['status'].setValue(result.data.attributes.status)


      },
      error: (err: any) => { },
      complete: () => { }
    })


  }

  onSelect(event: any) {
    const fileLength = this.files.length;
    const addedLength = event.addedFiles.length;

    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / (1024 * 1024); // Convert bytes to megabytes
      if (size > 5) {
        const statusText = "Please choose a document below 5 MB";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        const fileTypes = ['pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png']; // Include image extensions
        const extension = event.addedFiles[0].name.split('.').pop().toLowerCase();
        const isSuccess = fileTypes.indexOf(extension) > -1;

        if (isSuccess) {
          this.files.push(...event.addedFiles);
          this.Form.controls['evidence_after'].setErrors(null);
        } else {
          const statusText = "Please choose a document ('pdf', 'word', 'excel', 'jpg', 'jpeg', 'png')";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else if (fileLength < 6) {
      const statusText = "You have exceeded the upload limit";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  onRemove(file: File, index: number): void {
    this.showProgressPopup()
    if (index < 0 || index >= this.evidenceAfterFiles.length) {
      return;
    }
    const documentId = this.evidenceIds[index];
    if (documentId) {
      this.externalAuditService.delete_document(documentId.id).subscribe({
        next: (result: any) => {
          this.generalService.delete_image(result.data.attributes.evidence_id_after).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = "Evidence Deleted";
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.evidenceIds.splice(index, 1);
              this.updated_document_details()
              Swal.close()
            }
          })

        },
        error: (error: any) => {
        },
      });
    }
  }


  onUpload(event: any): void {
    this.showProgressPopup();
    const maxFiles = 1;
    const addedFiles: File[] = event.addedFiles;
    const remainingSlots = maxFiles - this.evidenceAfterFiles.length;

    if (this.evidenceAfterFiles.length = maxFiles) {
      // const statusText = "You can only upload a maximum of 5 files";
      const statusText = "You can only upload 1 file"
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
        const statusText = "File size exceeded";
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
    Swal.close()
  }

  private uploadFile(file: File, onComplete: () => void): void {
    this.Form.controls['DocumentFile'].setErrors(null);
    this.uploadedFiles.push(file);

    if (file.name) {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (!extension) return;

      const formData = new FormData();
      formData.append('files', file, this.Form.value.reference + '.' + extension);

      this.generalService.upload(formData).subscribe({
        next: (result: any) => {
          const id = this.Form.value.id;
          const data = [
            {
              evidence_after_name: result[0].hash,
              format_after: extension,
              evidence_id_after: result[0].id,
              external_audit_action_plan: this.Form.value.id,
              external_audit: this.defaults.audid,
            },
          ];

          this.externalAuditService.create_evidence_after(data[0]).subscribe({
            next: (result: any) => {
              const successText = "Evidence After Uploaded Successfully";
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

  openDocument(index: number) {
    const documentInfo = this.documentIds[index];
    if (documentInfo) {
      this.dialog.open(ViewActionPlanDocumentComponent, {
        width: '50%',
        data: { documentInfo: documentInfo },
      });
    }
  }
  openMultipeBeforeDocument(index: number) {
    const documentInfo = this.multipledocumentIds[index];
    if (documentInfo) {
      this.dialog.open(ViewActionPlanDocumentComponent, {
        width: '50%',
        data: { documentInfo: documentInfo },
      });
    }
  }
  openEvidenceAfter(index: number) {
    const documentInfo = this.evidenceIds[index];
    if (documentInfo) {
      this.dialog.open(ViewActionPlanDocumentComponent, {
        width: '50%',
        data: { documentInfo: documentInfo },
      });
    }
  }

  actualComplete_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['complete_date'].setValue(newDate)
  }

  updated_document_details() {
    this.evidenceAfterFiles = [];
    this.evidenceIds = [];
    const id = this.defaults.data.id;
    this.externalAuditService.audit_action_plan(id).subscribe(
      (result: any) => {
        const evidence_after_data = result.data.attributes.evidence_after.data;
        if (evidence_after_data.length > 0) {
          this.evidenceAfterFiles = [];

          const loadImageAtIndex = (index: number) => {
            if (index >= evidence_after_data.length) {
              return;
            }
            const document = evidence_after_data[index];
            this.generalService.getImage(environment.client_backend + '/uploads/' + document?.attributes.evidence_after_name + '.' + document?.attributes.format_after).subscribe((data: any) => {
              let blobType = '';
              let fileType = document.attributes.format_after.toLowerCase();

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
              const file = new File([blob], document.attributes.evidence_after_name + '.' + document.attributes.format_after, { type: blobType });
              const documentId = document.id;
              const pdfUrl = URL.createObjectURL(blob);

              const documentInfo = {
                id: documentId,
                file_name: document.attributes.evidence_after_name,
                file_format: document.attributes.format_after,
                file: file,
                pdfUrl: pdfUrl,
                type: blobType
              };

              this.evidenceIds[index] = documentInfo;
              this.evidenceAfterFiles.push(file);

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

  private showSnackBar(message: string): void {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
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

  onStatusSelectionChange(event: any) {
    this.selectedStatus = event.value;
  }

  openmultipleEvidenceAfter(index: number) {
    const documentInfo = this.multipleevidenceIds[index];
    if (documentInfo) {
      this.dialog.open(ViewActionPlanDocumentComponent, {
        width: '50%',
        data: { documentInfo: documentInfo },
      });
    }
  }
  approval() {
    this.showProgressPopup();
    this.Form.controls['status'].setValue('Approved')
    this.Form.controls['assignee'].setValue(this.Form.value.initialAssignee)
    this.externalAuditService.update_audit_action_plan(this.Form.value).subscribe({
      next: (result: any) => {
        const statusText = "Action plan Approved"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
        this.dialog.closeAll()
        this.get_action_plan()
      },
      error: (err: any) => { },
      complete: () => {

      }
    })
  }


  complete() {
    this.Form.controls['status'].setValue('Implemented')
    this.showProgressPopup();
    this.externalAuditService.update_audit_action_plan(this.Form.value).subscribe({
      next: (result: any) => {
        const statusText = "Action plan Implemented"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
        this.dialog.closeAll()
        this.get_action_plan()
      },
      error: (err: any) => { },
      complete: () => {

      }
    })
  }
  mark_complete() {
    this.Form.controls['status'].setValue('Completed')
    this.showProgressPopup();
    this.externalAuditService.update_audit_action_plan(this.Form.value).subscribe({
      next: (result: any) => {
        const statusText = "Action plan completed"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
        this.dialog.closeAll()
        this.get_action_plan()
      },
      error: (err: any) => { },
      complete: () => {

      }
    })
  }

  update() {
    this.Form.controls['status'].setValue('Modification Required')
    this.Form.controls['assignee'].setValue(this.Form.value.initialAssignee)

    this.showProgressPopup();
    this.externalAuditService.update_audit_action_plan(this.Form.value).subscribe({
      next: (result: any) => {
        const statusText = "Action plan requires modification. "
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
        this.dialog.closeAll()
        this.router.navigate(["/apps/audit-inspection/external-audit/corrective-register"])
      },
      error: (err: any) => { },
      complete: () => {

      }
    })

  }

  rejected() {
    this.Form.controls['status'].setValue('Rejected')
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
        this.externalAuditService.audit_action_plan_rejected(this.Form.value).subscribe({
          next: (result: any) => {
            const statusText = "Action plan rejected. "
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });

          },
          error: (err: any) => { },
          complete: () => {
            Swal.close()
            this.dialog.closeAll()
            this.router.navigate(["/apps/audit-inspection/external-audit/corrective-register"])
          }
        })
      }
      else {
        this.Form.controls['status'].setValue('Under Review')
      }
    })


  }

  view_document() {
    let docData: any[] = []
    docData.push({
      document_name: this.Form.value.document_name,
      document_format: this.Form.value.document_format
    })
    this.dialog.open(ViewActionPlanDocumentComponent, { data: docData[0] })
  }

  view_action_plan_document() {
    const documentName = this.Form.value.document_name;
    const documentFormat = this.Form.value.document_format;
    const fileUrl = `${environment.client_backend}/uploads/${documentName}.${documentFormat}`;
    saveAs(fileUrl, `${documentName}.${documentFormat}`);
  }

  view_action_plan_after_document() {
    const documentName = this.Form.value.document_name_after;
    const documentFormat = this.Form.value.document_format_after;
    const fileUrl = `${environment.client_backend}/uploads/${documentName}.${documentFormat}`;
    saveAs(fileUrl, `${documentName}.${documentFormat}`);
  }


}

