import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { environment } from 'src/environments/environment';
import { ViewActionPlanDocumentComponent } from '../view-action-plan-document/view-action-plan-document.component';
const { Configuration, OpenAIApi } = require("openai");
import { Location } from '@angular/common';
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
  selector: 'app-view-action-plan',
  templateUrl: './view-action-plan.component.html',
  styleUrls: ['./view-action-plan.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewActionPlanComponent implements OnInit {

  Form: FormGroup
  dueDate = new FormControl(null, [Validators.required]);
  comDatedp = new FormControl(null, [Validators.required]);
  TargDatedp = new FormControl(null, [Validators.required]);
  orgID: any
  heirarchy_dropdown: any[] = [];
  heirarchy_value: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  peopleList: any[] = [];
  DocumentFiles: File[] = [];
  documentIds: any[] = [];
  multipledocumentIds: any[] = [];
  evidenceAfterFiles: File[] = [];
  evidenceIds: any[] = [];
  multipleevidenceIds: any[] = [];
  MultipleDoumentBeforeFiles: File[] = [];
  MultipleDoumentAfterFiles: File[] = [];
  evidence_Before: boolean = false
  evidence_After: boolean = false
  multiple_evidence_Before: boolean = false;
  multiple_evidence_After: boolean = false;
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



  constructor(
    // @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public internalAuditService: InternalAuditService,
    private config: NgbRatingConfig,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar, private _location: Location) { }

  ngOnInit() {
    this.configuration()

    this.Form = this.formBuilder.group({
      org_id: [''],
      date: [null],
      id: ['', [Validators.required]],
      due_date: [null, [Validators.required]],
      target_completion_date: [null, [Validators.required]],
      complete_date: [null, [Validators.required]],
      responsible: [null, [Validators.required]],
      responsible_name: [''],
      status: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      findings: ['', [Validators.required]],
      assignee: [null, [Validators.required]],
      approver: [''],
      action_plan: ['', [Validators.required]],
      root_cause: ['', [Validators.required]],
      heirarchy_control: ['', [Validators.required]],
      implemented_actions: [''],
      lessons_learned: [''],
      sustainable_solution: [''],
      barrier_challenges: [''],
      assignee_remark: [''],
      approver_remark: [''],
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
      audstatus: ['']
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
          this.get_profiles()
          this.get_action_plan()
          this.get_dropdownValue()

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
    // const id = this.defaults.data.id;
    const id = this.route.snapshot.paramMap.get('id');
    this.internalAuditService.audit_action_plan(id).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
        this.Form.controls['status'].setValue(result.data.attributes.status)
        this.Form.controls['date'].setValue(result.data.attributes.date)
        this.Form.controls['priority'].setValue(result.data.attributes.priority)
        this.Form.controls['findings'].setValue(result.data.attributes.findings)
        this.Form.controls['barrier_challenges'].setValue(result.data.attributes.barrier_challenges)
        this.Form.controls['assignee_remark'].setValue(result.data.attributes.assignee_remark)
        this.Form.controls['root_cause'].setValue(result.data.attributes.root_cause)
        this.Form.controls['due_date'].setValue(result.data.attributes.due_date)
        this.Form.controls['assignee'].setValue(result.data.attributes.assignee.data?.attributes?.first_name + ' ' + result.data?.attributes?.assignee?.data?.attributes?.last_name)
        this.Form.controls['approver'].setValue(result.data.attributes.approver.data?.attributes?.first_name + ' ' + result.data?.attributes?.approver?.data?.attributes?.last_name)
        this.Form.controls['target_completion_date'].setValue(result.data.attributes.target_completion_date)
        this.Form.controls['complete_date'].setValue(result.data.attributes.actual_completion_date)
        this.Form.controls['heirarchy_control'].setValue(result.data.attributes.heirarchy_control)
        this.Form.controls['sustainable_solution'].setValue(result.data.attributes.sustainable_solution)
        this.Form.controls['approver_remark'].setValue(result.data.attributes.approver_remark)
        this.Form.controls['implemented_actions'].setValue(result.data.attributes.implemented_actions)
        this.Form.controls['lessons_learned'].setValue(result.data.attributes.lessons_learned)
        this.Form.controls['reference'].setValue(result.data.attributes.internal_audit?.data?.attributes?.reference_number)

        if (result.data.attributes.due_date) {
          this.dueDate.setValue(new Date(result.data.attributes.due_date))
        }
        if (result.data.attributes.target_completion_date) {
          this.TargDatedp.setValue(new Date(result.data.attributes.target_completion_date))
          this.Form.controls['target_completion_date'].setValue(result.data.attributes.target_completion_date)
        }
        if (result.data.attributes.actual_completion_date) {
          this.comDatedp.setValue(new Date(result.data.attributes.actual_completion_date))
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

              if (this.DocumentFiles.length > 0) {
                this.evidence_Before = true
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
                type: blobType,
                // title: document.attributes.title
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



        const evidences = result.data.attributes.internal_audit_evidences.data;
        const evidence_after_data = evidences.filter((elem: any) => elem.attributes.evidence_after == true);
        if (evidence_after_data.length > 0) {
          this.evidence_After = true;
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
        else {
          this.evidence_After = false
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



        this.Form.disable()
        this.dueDate.disable()
        this.comDatedp.disable()

      },
      error: (err: any) => { },
      complete: () => { }
    })


  }
  go_back() {
    const ref = this.Form.value.reference
    this.router.navigate(["apps/audit-inspection/internal-audit/completed-audit/" + ref])
  }
  go_back_audit() {
    const ref = this.Form.value.reference
    this.router.navigate(["apps/audit-inspection/internal-audit/audit/" + ref])
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

  openDocument(index: number) {
    const documentInfo = this.documentIds[index];
    if (documentInfo) {
      this.dialog.open(ViewActionPlanDocumentComponent, {
        width: '50%',
        data: { documentInfo: documentInfo },
      });
    }
  }

  openmultipleBeforeDocument(index: number) {
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
  openmultipleEvidenceAfter(index: number) {
    const documentInfo = this.multipleevidenceIds[index];
    if (documentInfo) {
      this.dialog.open(ViewActionPlanDocumentComponent, {
        width: '50%',
        data: { documentInfo: documentInfo },
      });
    }
  }

  navigate() {
    this.backToHistory = true
    this._location.back();
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

}
