import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ViewActionPlanDocumentComponent } from '../view-action-plan-document/view-action-plan-document.component';


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
  selector: 'app-corporateuser-update-action-plan',
  templateUrl: './corporateuser-update-action-plan.component.html',
  styleUrls: ['./corporateuser-update-action-plan.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CorporateuserUpdateActionPlanComponent implements OnInit {
  Form: FormGroup
  dueDate = new FormControl(null, [Validators.required]);
  comDate = new FormControl(null, [Validators.required]);
  TarDatedp= new FormControl(null, [Validators.required]);
  orgID: any;
  peopleList: any[] = [];
  heirarchy_dropdown: any[] = [];
  heirarchy_value: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  files: File[] = [];
  uploadedFiles: File[] = [];
  DocumentFiles: File[] = [];
  MultipleDoumentBeforeFiles: File[] = [];
  MultipleDoumentAfterFiles: File[] = [];
  documentIds: any[] = [];
  multipledocumentIds: any[] = [];
  evidenceFormData = new FormData()
  evidenceAfterFiles: File[] = [];
  evidenceIds: any[] = [];
  multipleevidenceIds: any[] = [];
  evidence_Before:boolean = false;
  multiple_evidence_Before:boolean = false;
  multiple_evidence_After:boolean = false;
  evidence_After:any

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



  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public internalAuditService: InternalAuditService,
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
      findings: ['', [Validators.required]],
      action_plan: ['', [Validators.required]],
      root_cause: ['', [Validators.required]],
      heirarchy_control: ['', [Validators.required]],
      target_completion_date: [null],
      assignee_remark:[''],
      approver_remark:[''],
      barrier_challenges:[''],
      implemented_actions:[''],
      lessons_learned:[''],
      updatedBy: [''],
      evidence: [''],
      document_id: [''],
      document_name: [''],
      document_format: [''],
      evidence_after: [''],
      document_id_after: [''],
      document_name_after: [''],
      document_format_after: [''],
      reference: [''],
      audid: [''],
      assignee:['',[Validators.required]],
      sustainable_solution: [''],
      user: [''],
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
        this.Form.controls['updatedBy'].setValue(result.id)
        const status = result.int_aud_audit
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_action_plan();
          this.get_profiles()
          this.get_dropdownValue();
          this.Form.controls['user'].setValue(result.username)

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  get_profiles() {
    this.authService.get_profiles(this.Form.value.org_id).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter(
          (profile: any) =>
            profile.attributes.user?.data?.attributes?.blocked === false
        );
        this.peopleList = filteredData;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }
  //get dropdown values
  get_dropdownValue() {
    const module = 'Internal Audit'
    this.internalAuditService.get_dropdown(module).subscribe({
      next: (result: any) => {
        const data = result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Hierarchy of Control' && elem.attributes.Module === module
        });
        let dropData: any[] = [];
        data.forEach((elem: any) => {
          dropData.push(elem.attributes.Value);
        });
        this.heirarchy_dropdown = dropData;
      },
      error: (err: any) => { },
      complete: () => { },
    })
  }

  get_action_plan() {
   const id = this.route.snapshot.paramMap.get('id');
    this.internalAuditService.audit_action_plan(id).subscribe({
      next: (result: any) => { 
        this.Form.controls['id'].setValue(result.data.id)
        this.Form.controls['status'].setValue(result.data.attributes.status)
        this.Form.controls['date'].setValue(result.data.attributes.date)
        this.Form.controls['sustainable_solution'].setValue(result.data.attributes.sustainable_solution)
        this.Form.controls['priority'].setValue(result.data.attributes.priority)
        this.Form.controls['findings'].setValue(result.data.attributes.findings)
        this.Form.controls['root_cause'].setValue(result.data.attributes.root_cause)
        this.Form.controls['barrier_challenges'].setValue(result.data.attributes.barrier_challenges)
        this.Form.controls['assignee_remark'].setValue(result.data.attributes.assignee_remark)
        this.Form.controls['implemented_actions'].setValue(result.data.attributes.implemented_actions)
        this.Form.controls['lessons_learned'].setValue(result.data.attributes.lessons_learned)
        this.Form.controls['approver_remark'].setValue(result.data.attributes.approver_remark)
        this.Form.controls['due_date'].setValue(result.data.attributes.due_date)
        this.Form.controls['complete_date'].setValue(result.data.attributes.actual_completion_date)
        this.Form.controls['reference'].setValue(result.data.attributes.internal_audit?.data?.attributes?.reference_number)
        this.Form.controls['audid'].setValue(result.data.attributes.internal_audit?.data?.id)
        this.Form.controls['heirarchy_control'].setValue(result.data.attributes.heirarchy_control)
        this.Form.controls['assignee'].setValue(result.data?.attributes?.initial_assignee.data?.id)


        if (result.data.attributes.due_date) {
          this.dueDate.setValue(result.data.attributes.due_date)
        }
        if (result.data.attributes.target_completion_date) {
          this.TarDatedp.setValue(new Date(result.data.attributes.target_completion_date))
          this.Form.controls['target_completion_date'].setValue(result.data.attributes.target_completion_date)
        }
        if (result.data.attributes.actual_completion_date) {
          this.comDate.setValue(new Date(result.data.attributes.actual_completion_date))
        }

        const document__data = result.data.attributes.internal_audit_evidences?.data;
        if (document__data.length > 0) {
          this.DocumentFiles = [];

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
              if(this.DocumentFiles.length > 0)
                {
                  this.evidence_Before= true
                }
              loadImageAtIndex(index + 1);
            });
          };
          loadImageAtIndex(0);
        }
     
        const multipleEvidenceBefore = result.data.attributes.internal_multiple_evidence_before?.data;
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


        const evidences = result.data.attributes.internal_audit_evidences.data
        const evidence_after_data = evidences.filter((elem:any) => elem.attributes.evidence_after == true);
        this.evidence_After = evidences.filter((elem:any) => elem.attributes.evidence_after == true);
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

   
        const multipleEvidenceAfter = result.data.attributes.internal_multiple_evidence_after?.data;
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
        
   

      },
      error: (err: any) => { },
      complete: () => { 
        this.dueDate.disable();
        this.TarDatedp.disable()
        this.Form.controls['findings'].disable()
        this.Form.controls['root_cause'].disable()
        this.Form.controls['barrier_challenges'].disable()
        this.Form.controls['sustainable_solution'].disable()
        this.Form.controls['heirarchy_control'].disable()
        this.Form.controls['assignee_remark'].disable()
        this.Form.controls['implemented_actions'].disable()
        this.Form.controls['lessons_learned'].disable()
       }
    })


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
  targetcomplete_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['target_completion_date'].setValue(newDate)
  }
  control_event_open_ai(completion_tokens: any, prompt_tokens: any, total_tokens: any) {
    this.internalAuditService.create_open_ai(this.Form.value, completion_tokens, prompt_tokens, total_tokens).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {

      }
    })

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

  openMultipleBeforeDocument(index: number) {
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

  openMultipleEvidenceAfter(index: number) {
    const documentInfo = this.multipleevidenceIds[index];
    if (documentInfo) {
      this.dialog.open(ViewActionPlanDocumentComponent, {
        width: '50%',
        data: { documentInfo: documentInfo },
      });
    }
  }
  // responsible(data: any) {
  //   this.Form.controls['responsible_name'].setValue(data.attributes.first_name + ' ' + data.attributes.last_name)
  // }
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



  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length === 0) {
      this.Form.controls['evidence'].reset()
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

  submit() {
    this.showProgressPopup();
    this.Form.controls['status'].setValue('Approved')
    //this.Form.controls['assignee'].setValue(this.Form.value.initialAssignee)
    // this.upload_evidence()
    this.update()
  }

  Modification(){
    this.Form.controls['status'].setValue('Modification Required')
    //this.Form.controls['assignee'].setValue(this.Form.value.initialAssignee)
    this.update()
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
        this.internalAuditService.audit_action_plan_rejected(this.Form.value).subscribe({
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

  mark_complete(){
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
        this.Form.controls['status'].setValue('Completed')
        this.update()
      }
    })
   
  }

  upload_evidence() {
    this.showProgressPopup();
    const docID = this.Form.value.document_id
    if (this.files.length != 0) {
      this.files.forEach((elem: any) => {
        this.evidenceFormData.delete('files')
        const extension = elem.name.split('.').pop().toLowerCase()
        this.evidenceFormData.append('files', elem, this.Form.value.reference + '.' + extension)
        this.generalService.upload(this.evidenceFormData).subscribe({
          next: (result: any) => {
            let data: any[] = []
            data.push({
              document_name_after: result[0].hash,
              document_format_after: extension,
              document_id_after: result[0].id,
              audit_action_plan: this.Form.value.id,
              internal_audit: this.Form.value.audid,
            })
            if (docID) {
              const id = this.Form.value.evidence
              this.internalAuditService.attach_action_plan_document_after(data[0], id).subscribe({
                next: (result: any) => { },
                error: (err: any) => { },
                complete: () => {
                  const statusText = "Action Plan Evidence After added successfully"
                  this._snackBar.open(statusText, 'OK', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.files = []
                }
              })
            }
            else {
              this.internalAuditService.create_action_plan_document_after(data[0]).subscribe({
                next: (result: any) => { },
                error: (err: any) => { },
                complete: () => {
                  const statusText = "Action Plan Evidence After added successfully"
                  this._snackBar.open(statusText, 'OK', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.files = []
                }
              })
            }

          },
          error: (err: any) => { },
          complete: () => {
            this.update()
          }
        })
      })
    }
    else {
      this.update()
    }

  }

  update() {

    this.internalAuditService.update_audit_action_plan(this.Form.value).subscribe({
      next: (result: any) => {
        if (result.data.attributes.status === "Completed") {
          const statusText = "Action plan completed"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.router.navigate(["/apps/audit-inspection/internal-audit/corrective-register"])

        } else {
          const statusText = "Action plan updated"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.get_action_plan()
        }
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
    
    this.router.navigate(["apps/audit-inspection/internal-audit/corrective-register"])
  }

  complete() {
  }

  go_back() {
    const ref = this.Form.value.id
    this.router.navigate(["apps/audit-inspection/internal-audit/corrective-register"])
  }

  action(data: any) {
    this.Form.controls['status'].setValue(data)
    this.update()
  }

  due_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['due_date'].setValue(newDate)
  }

  complete_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['complete_date'].setValue(newDate)
  }

 
}


