import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { saveAs } from 'file-saver';
import { ViewActionPlanDocumentComponent } from '../view-action-plan-document/view-action-plan-document.component';
const { Configuration, OpenAIApi } = require("openai");

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
  selector: 'app-update-action-plan',
  templateUrl: './update-action-plan.component.html',
  styleUrls: ['./update-action-plan.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class UpdateActionPlanComponent implements OnInit {

  Form: FormGroup
  dueDate = new FormControl(null, [Validators.required]);
  comDatedp = new FormControl(null, [Validators.required]);
  TarcomDatedp = new FormControl(null, [Validators.required]);
  orgID: any;
  peopleList: any[] = [];
  heirarchy_dropdown: any[] = [];
  heirarchy_value: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  files: File[] = [];
  evidenceFormData = new FormData()
  uploadedFiles: File[] = [];
  evidenceAfterFiles: File[] = [];
  moreFiles: any[] = []
  moreEvidence: any[] = []
  multipleevidenceIds: any[] = [];
  DocumentFiles: File[] = [];
  MultipleDoumentBeforeFiles: File[] = [];
  MultipleDoumentAfterFiles: File[] = [];
  documentIds: any[] = [];
  multipledocumentIds: any[] = [];
  evidenceIds: any[] = [];
  evidence_Before: boolean = false;
  Evidence_AfterId: any;
  addMoreEvidence: boolean = false
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
    private formBuilder: FormBuilder,
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
      target_completion_date: [null, [Validators.required]],
      assignee_remark: [''],
      barrier_challenges: [''],
      implemented_actions: [''],
      lessons_learned: [''],
      updatedBy: [''],
      evidence: [''],
      document_id: [''],
      document_name: [''],
      document_format: [''],
      evidence_after: [''],
      document_id_after: [''],
      document_name_after: [''],
      document_format_after: [''],
      DocumentFile: [''],
      reference: [''],
      audid: [''],
      assignee: ['', [Validators.required]],
      approver: [''],
      approver_remark: [''],
      sustainable_solution: [''],
      user: [''],
      add_more_evidence: [false],
      moreEvidence: [''],
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
          this.get_action_plan();
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
    //  const id = this.defaults.data.id;
    this.internalAuditService.audit_action_plan(id).subscribe({
      next: (result: any) => {

        this.Form.controls['id'].setValue(result.data.id)
        this.Form.controls['status'].setValue(result.data.attributes.status)
        this.Form.controls['date'].setValue(result.data.attributes.date)
        this.Form.controls['sustainable_solution'].setValue(result.data.attributes.sustainable_solution)
        this.Form.controls['priority'].setValue(result.data.attributes.priority)
        this.Form.controls['findings'].setValue(result.data.attributes.findings)
        this.Form.controls['assignee'].setValue(result.data.attributes.assignee.data.id)
        this.Form.controls['root_cause'].setValue(result.data.attributes.root_cause)
        this.Form.controls['barrier_challenges'].setValue(result.data.attributes.barrier_challenges)
        this.Form.controls['assignee_remark'].setValue(result.data.attributes.assignee_remark)
        this.Form.controls['approver_remark'].setValue(result.data.attributes.approver_remark)
        this.Form.controls['due_date'].setValue(result.data.attributes.due_date)
        this.Form.controls['complete_date'].setValue(result.data.attributes.actual_completion_date)
        this.Form.controls['reference'].setValue(result.data.attributes.internal_audit?.data?.attributes?.reference_number)
        this.Form.controls['audid'].setValue(result.data.attributes.internal_audit?.data?.id)
        this.Form.controls['heirarchy_control'].setValue(result.data.attributes.heirarchy_control)
        this.Form.controls['approver'].setValue(result.data.attributes.approver.data?.id)
        this.Form.controls['implemented_actions'].setValue(result.data.attributes.implemented_actions)
        this.Form.controls['lessons_learned'].setValue(result.data.attributes.lessons_learned)
        this.Form.controls['document_id'].setValue(result.data.attributes.internal_audit_evidences?.data[0]?.id)


        if (result.data.attributes.due_date) {
          this.dueDate.setValue(new Date(result.data.attributes.due_date))
        }
        if (result.data.attributes.target_completion_date) {
          this.TarcomDatedp.setValue(new Date(result.data.attributes.target_completion_date))
          this.Form.controls['target_completion_date'].setValue(result.data.attributes.target_completion_date)
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
              console.log("this.MultipleDoumentBeforeFiles",this.MultipleDoumentBeforeFiles, "this.multipledocumentIds0",this.multipledocumentIds)
              // Proceed to load the next document
              loadImageAtIndex(index + 1);
            });
          };

          // Start loading the documents from the first index
          loadImageAtIndex(0);
        }




        const document__data = result.data.attributes.internal_audit_evidences?.data;
        this.Evidence_AfterId = document__data[0]?.attributes.evidence_id_after
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

        const multipleEvidenceAfter = result.data.attributes.internal_multiple_evidence_after?.data;
        if (multipleEvidenceAfter && multipleEvidenceAfter.length > 0) {
          this.MultipleDoumentAfterFiles = [];
          this.Form.controls['add_more_evidence'].setValue(true)
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
              // this.MultipleDoumentAfterFiles.push(file); // Add file to the array
              this.moreFiles.push(file)
              // Proceed to load the next document
              loadImageAtIndex(index + 1);
            });
          };

          // Start loading the documents from the first index
          loadImageAtIndex(0);
        }



        this.updated_document_details()



      },
      error: (err: any) => { },
      complete: () => {
        const statusValue = this.Form.value.status
        switch (statusValue) {
          case 'Open':
            this.dueDate.disable();
            this.Form.controls['findings'].disable()
            this.Form.controls['assignee'].disable()

            break;
          case 'In Progress':
            this.dueDate.disable();
            this.Form.controls['findings'].disable()
            break;
          case 'Approved':
            this.dueDate.disable();
            this.Form.controls['findings'].disable()
            this.Form.controls['approver_remark'].disable()
            this.Form.controls['sustainable_solution'].disable()
            this.Form.controls['root_cause'].disable()
            this.Form.controls['barrier_challenges'].disable()
            this.Form.controls['heirarchy_control'].disable()
            this.Form.controls['assignee_remark'].disable()
            this.TarcomDatedp.disable()
            break;
          case 'Modification Required':
            this.dueDate.disable();
            this.Form.controls['findings'].disable()
            this.Form.controls['approver_remark'].disable()

            break;
          case 'Under Implementation':
            this.dueDate.disable();
            this.TarcomDatedp.disable()
            this.Form.controls['findings'].disable()
            this.Form.controls['approver_remark'].disable()
            this.Form.controls['sustainable_solution'].disable()
            this.Form.controls['root_cause'].disable()
            this.Form.controls['barrier_challenges'].disable()
            this.Form.controls['assignee_remark'].disable()
            this.Form.controls['heirarchy_control'].disable()
            break;
          default:
            this.Form.enable();
            break;
        }
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
  openMultipeBeforeDocument(index: number) {
    const documentInfo = this.multipledocumentIds[index];
    if (documentInfo) {
      this.dialog.open(ViewActionPlanDocumentComponent, {
        width: '50%',
        data: { documentInfo: documentInfo },
      });
    }
  }

  onSelectMoreEvidence(event: any) {

    this.moreEvidence = [];
    const fileLength = this.moreFiles.length;
    const addedLength = event.addedFiles.length;

    if (fileLength + addedLength > 5) {
      const statusText = "You have exceeded the upload limit";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      return;
    }

    // event.addedFiles.forEach((elem: any) => {

    //   if (fileLength < 5 && addedLength < 6) {
    //     const size = elem.size / 1024 / 1024
    //     if (size > 10) {
    //       const statusText = "Please choose an evidence below 10 MB"
    //       this._snackBar.open(statusText, 'Close Warning', {
    //         horizontalPosition: this.horizontalPosition,
    //         verticalPosition: this.verticalPosition,
    //       });
    //     } else {
    //       var fileTypes = ['pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png'];
    //       var extension = elem.name.split('.').pop().toLowerCase(),
    //         isSuccess = fileTypes.indexOf(extension) > -1;
    //       if (isSuccess) {
    //         this.Form.controls['moreEvidence'].setErrors(null)
    //         // this.moreFiles.push(elem);  
    //         this.moreEvidence.push(elem)
    //       } else {
    //         const statusText = "Please choose a evidence ('pdf', 'word', 'excel', 'jpg', 'jpeg', 'png')"
    //         this._snackBar.open(statusText, 'Close Warning', {
    //           horizontalPosition: this.horizontalPosition,
    //           verticalPosition: this.verticalPosition,
    //         });
    //       }
    //     }
    //   } else if (fileLength < 6) {
    //     const statusText = "You have exceed the upload limit"
    //     this._snackBar.open(statusText, 'Close Warning', {
    //       horizontalPosition: this.horizontalPosition,
    //       verticalPosition: this.verticalPosition,
    //     });
    //   }

    // })
    // this.MulipleDocumentUpload()

    event.addedFiles.forEach((elem: any) => {
      const size = elem.size / 1024 / 1024; // Size in MB
      if (size > 10) {
        const statusText = "Please choose an evidence below 10 MB";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        const fileTypes = ['pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png'];
        const extension = elem.name.split('.').pop().toLowerCase();
        const isSuccess = fileTypes.includes(extension);

        if (isSuccess) {
          this.Form.controls['moreEvidence'].setErrors(null);
          this.moreEvidence.push(elem);
        } else {
          const statusText = "Please choose a valid file ('pdf', 'word', 'excel', 'jpg', 'jpeg', 'png')";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    });
    if (this.moreEvidence.length > 0) {
      this.MulipleDocumentUpload();
    }

  }


  // onRemoveMoreEvidence(event: any) {

  //   this.moreFiles.splice(this.moreFiles.indexOf(event), 1);
  //   if (this.moreFiles.length === 0) {
  //     this.Form.controls['moreEvidence'].reset()
  //     this.addMoreEvidence = false
  //     this.moreFiles = []
  //     this.Form.controls['add_more_evidence'].reset()
  //   }
  // }

  onRemoveMoreEvidence(file: File, index: number): void {

    if (index < 0 || index >= this.moreFiles.length) {
      return;
    }

    const documentId = this.multipleevidenceIds[index];

    if (documentId) {
      this.internalAuditService.delete_multiple_document(documentId.id).subscribe({
        next: (result: any) => {
          this.generalService.delete_image(result.data.attributes.image_id).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = "Evidence Deleted";
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });

              this.multipleevidenceIds.splice(index, 1);
              this.moreFiles.splice(index, 1);
            }
          });
        },
        error: (error: any) => {
        },
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

  //open ai
  async chatGPT(stringWithoutPTags: any) {
    document.getElementById('ai-loader')?.classList.remove("hide");
    document.getElementById('ai-suggest')?.classList.add("hide");
    const category = this.Form.value.heirarchy_control;
    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const message = 'Against audit finding ' + stringWithoutPTags + 'provide five recommendations for sustainable solutions. Answer should be embedded in html tags and only required bullet points.'
    // const message = 'resolution for a hazard happens in the ' + category + ' category the ' + observation + '.'
    let requestData = {
      // model: 'text-davinci-003',//'text-davinci-003',//"text-curie-001",
      // prompt: 'resolution for a hazard happens in the '+category+' category the '+observation+'.',//this.generatePrompt(animal),
      // temperature: 0.95,
      // max_tokens: 150,
      // top_p: 1.0,
      // frequency_penalty: 0.0,
      // presence_penalty: 0.0,

      model: "gpt-3.5-turbo",
      format: "html",
      messages: [{ role: "user", content: message }],
    };
    let apiResponse = await openai.createChatCompletion(requestData);
    const completion_tokens = apiResponse.data.usage.completion_tokens
    const prompt_tokens = apiResponse.data.usage.prompt_tokens
    const total_tokens = apiResponse.data.usage.total_tokens
    this.control_event_open_ai(completion_tokens, prompt_tokens, total_tokens)
    this.Form.controls['sustainable_solution'].setValue('<p>' + apiResponse.data.choices[0].message.content + '</p>')
    document.getElementById('ai-loader')?.classList.add("hide");
    document.getElementById('ai-suggest')?.classList.remove("hide");
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

  // responsible(data: any) {
  //   this.Form.controls['responsible_name'].setValue(data.attributes.first_name + ' ' + data.attributes.last_name)
  // }


  onUpload(event: any): void {
    // const maxFiles = 1;
    // const addedFiles = event.addedFiles.length;
    // const fileLength = this.evidenceAfterFiles.length;
    // const remainingSlots = maxFiles - this.evidenceAfterFiles.length;

    // if (fileLength + addedFiles> maxFiles) {
    //   const statusText = "You have exceeded the upload limit";
    //   this.showSnackBar(statusText);
    //   addedFiles.splice(maxFiles);
    //   Swal.close();
    //   return;
    // }
    // this.uploadedFiles = [];
    // const totalFilesToUpload = Math.min(remainingSlots, addedFiles.length);
    // let uploadedFileCount = 0;

    // for (const file of addedFiles.slice(0, totalFilesToUpload)) {
    //   if (!file) continue;

    //   const maxSizeMB = 10;
    //   const sizeMB = file.size / 1024 / 1024;

    //   if (sizeMB > maxSizeMB) {
    //     const statusText = "Please choose an evidence below 10 MB";
    //     this.showSnackBar(statusText);
    //     continue; 
    //   }

    //   this.uploadFile(file, () => {
    //     uploadedFileCount++;
    //     if (uploadedFileCount === totalFilesToUpload) {
    //       // All files have been uploaded
    //       // this.document_details();
    //       this.updated_document_details();
    //     }
    //   });
    // }

    const maxFiles = 1;
    const maxSizeMB = 10;

    const addedFiles = event.addedFiles;

    // Check each file size before further processing
    for (const file of addedFiles) {
      const sizeMB = file.size / 1024 / 1024;
      if (sizeMB > maxSizeMB) {
        const statusText = "Please choose an evidence below 10 MB";
        this.showSnackBar(statusText);
        Swal.close(); // Close any open Swal dialog
        return; // Exit the function immediately if any file exceeds 10 MB
      }
    }

    // Proceed if all files are below the size limit
    const fileLength = this.evidenceAfterFiles.length;
    const remainingSlots = maxFiles - fileLength;

    if (fileLength + addedFiles.length > maxFiles) {
      const statusText = "You have exceeded the upload limit";
      this.showSnackBar(statusText);
      Swal.close();
      return;
    }

    this.uploadedFiles = [];
    const totalFilesToUpload = Math.min(remainingSlots, addedFiles.length);
    let uploadedFileCount = 0;

    // Upload files within the limit
    for (const file of addedFiles.slice(0, totalFilesToUpload)) {
      this.uploadFile(file, () => {
        uploadedFileCount++;
        if (uploadedFileCount === totalFilesToUpload) {
          this.updated_document_details();
        }
      });
    }

  }


  updated_document_details() {
    this.evidenceAfterFiles = [];
    this.evidenceIds = [];
    const id = this.route.snapshot.paramMap.get('id');
    this.internalAuditService.audit_action_plan(id).subscribe(
      (result: any) => {

        let evidences = []
        let evidence = []
        evidences = result.data.attributes.internal_audit_evidences.data
        const evidence_after_data = evidences.filter((elem: any) => elem.attributes.evidence_after == true);
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
              this.addMoreEvidence = true

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
          this.Evidence_AfterId = result[0].id
          const id = this.Form.value.id;
          const data = [
            {
              evidence_after_name: result[0].hash,
              format_after: extension,
              evidence_id_after: result[0].id,
              internal_audit_action_plan: this.Form.value.id,
              internal_audit: this.Form.value.audid,
            },
          ];
          this.addMoreEvidence = true
          if (this.Form.value.document_id) {

            this.internalAuditService.update_action_plan_evidence_after(data[0], this.Form.value.document_id).subscribe({
              next: (result: any) => {
                const successText = "Evidence After Uploaded Successfully";
                this.showSnackBar(successText);
              },
              error: () => { },
              complete: () => {
                onComplete();
              },
            });
          }
          else {

            this.internalAuditService.create_action_plan_evidence_after(data[0]).subscribe({
              next: (result: any) => {
                const successText = "Evidence After Uploaded Successfully";
                this.showSnackBar(successText);
              },
              error: () => { },
              complete: () => {
                onComplete();
              },
            });
          }
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

  openEvidenceAfter(index: number) {
    const documentInfo = this.evidenceIds[index];
    if (documentInfo) {
      this.dialog.open(ViewActionPlanDocumentComponent, {
        width: '50%',
        data: { documentInfo: documentInfo },
      });
    }
  }

  onRemove(event: any): void {
    this.showProgressPopup()
    this.generalService.delete_image(this.Evidence_AfterId).subscribe({
      next: (result: any) => {
        this.internalAuditService.update_action_plan_evidence_after_remove(this.Form.value.document_id).subscribe({
          next: (result: any) => {
            this.Delete_multiple_document_After()
          },
          error: (err: any) => { },
          complete: () => {
          }
        })
      },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Evidence Deleted";
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

        this.updated_document_details()
        Swal.close()
      }
    })

  }


  Delete_multiple_document_After() {

    this.multipleevidenceIds.forEach(data => {
      const fileId = data.id;

      this.internalAuditService.delete_multiple_document(fileId).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.addMoreEvidence = false
          this.moreFiles = []
          this.moreEvidence = []
          this.evidenceAfterFiles = []
          this.Form.controls['add_more_evidence'].reset()

        }
      });
    })
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
    if (!this.Form.value.target_completion_date) {
      Swal.fire({
        title: 'Target Completion Date Required',
        imageUrl: "assets/images/confirm.gif",
        imageWidth: 250,
        text: "Please provide the target completion date",
        showCancelButton: false,
      })
    }
    else {
      this.Form.controls['status'].setValue('Under Review')
      this.Form.controls['assignee'].setValue(this.Form.value.approver)
      this.update()
    }
  }

  updateForm() {
    this.Form.controls['status'].setValue('In Progress')
    this.update()
  }

  Implementation() {

    this.Form.controls['status'].setValue('Implemented')
    this.Form.controls['assignee'].setValue(this.Form.value.approver)
    // this.MulipleDocumentUpload()
    this.update()
  }

  StartImplementation() {
    this.Form.controls['status'].setValue('Under Implementation')
    //this.Form.controls['assignee'].setValue(this.Form.value.approver)
    this.update()
  }
  MulipleDocumentUpload() {
    let completedRequests = 0;
    const totalRequests = this.moreEvidence.length;

    if (this.moreEvidence.length > 0) {
      this.moreEvidence.forEach((elem: any) => {
        this.evidenceFormData.delete('files')
        const extension = elem.name.split('.').pop().toLowerCase()
        this.evidenceFormData.append('files', elem, this.Form.value.reference + '.' + extension)
        this.generalService.upload(this.evidenceFormData).subscribe({
          next: (result: any) => {
            let data: any[] = []
            data.push({
              document_name: result[0].hash,
              document_format: extension,
              document_id: result[0].id,
            })

            data.forEach((evidence, index) => {

              this.internalAuditService
                .create_internal_audit_multiple_evidence_after(evidence, this.Form.value.id)
                .subscribe({
                  next: (result: any) => {
                    const multipleEvidenceAfter = result.data;
                    if (multipleEvidenceAfter) {
                      this.MultipleDoumentAfterFiles = [];
                      this.Form.controls['add_more_evidence'].setValue(true)
                      const document = multipleEvidenceAfter;
                      const documentUrl = environment.client_backend + '/uploads/' + document?.attributes?.evidence_name + '.' + document?.attributes.format;

                      this.generalService.getImage(documentUrl).subscribe((data: any) => {
                        let blobType = '';
                        const fileType = document.attributes.format.toLowerCase();
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
                        const documentInfo = {
                          id: documentId,
                          file_name: document.attributes.evidence_name,
                          file_format: document.attributes.format,
                          file: file,
                          pdfUrl: pdfUrl,
                          type: blobType
                        };

                        this.moreFiles.push(file)
                        this.multipleevidenceIds.push(documentInfo);
                      });
                    };
                  },
                  error: (err: any) => {

                  },
                  complete: () => {
                    completedRequests++;
                    if (completedRequests === totalRequests) {
                      const successText = "Multiple Evidence After Uploaded Successfully";
                      this.showSnackBar(successText);
                    }
                  },
                });

            });

          },
          error: (err: any) => { },
          complete: () => {
          }
        })
      })

    }

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
    this.Form.enable()

    this.internalAuditService.update_audit_action_plan(this.Form.value).subscribe({
      next: (result: any) => {
        if (result.data.attributes.status === "Completed") {
          const statusText = "Action plan completed"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.router.navigate(["/apps/audit-inspection/internal-audit/queue"])

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
    this.backToHistory = true
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

  checkFindings() {
    this.Form.controls['findings'].enable()
    const findings = this.Form.value.findings
    if (findings) {
      document.getElementById('error-text')?.classList.add("hide");
      const stringWithoutPTags = findings.replace(/<\/?p>/g, '');
      this.chatGPT(stringWithoutPTags)
    } else {
      document.getElementById('error-text')?.classList.remove("hide");
    }
    this.Form.controls['findings'].disable()
  }
  //open ai
  async chatGPTForRootCause(stringWithoutPTags: any) {
    document.getElementById('root-cause-ai-loader')?.classList.remove("hide");
    document.getElementById('root-cause-ai-suggest')?.classList.add("hide");

    // const observation = this.generalForm.value.observation
    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const message = stringWithoutPTags + '.suggest the top 3 practicable possible root cause for this Audit finding by applying Fishbone Diagram method.Answer should be embedded in html tags without lossing fishbone structure.Answer Should be in a format of having a heading Top 3 practical root causes,then major categories of fishbone method with a definition,then 2 Potential Root Causes for Each Category and finally having the Top Practicable Possible Root Cause with a short explanation.And no need of the Top Heading mentioning fishbone method.Use Minimum Sizes for headings but more than that of normal text'
    // const message = 'resolution for a hazard happens in the ' + category + ' category the ' + observation + '.'
    let requestData = {
      // model: 'text-davinci-003',//'text-davinci-003',//"text-curie-001",
      // prompt: 'resolution for a hazard happens in the '+category+' category the '+observation+'.',//this.generatePrompt(animal),
      // temperature: 0.95,
      // max_tokens: 150,
      // top_p: 1.0,
      // frequency_penalty: 0.0,
      // presence_penalty: 0.0,

      model: "gpt-3.5-turbo",
      format: "html",
      messages: [{ role: "user", content: message }],
    };
    let apiResponse = await openai.createChatCompletion(requestData);
    const completion_tokens = apiResponse.data.usage.completion_tokens
    const prompt_tokens = apiResponse.data.usage.prompt_tokens
    const total_tokens = apiResponse.data.usage.total_tokens
    this.control_event_open_ai(completion_tokens, prompt_tokens, total_tokens)
    this.Form.controls['root_cause'].setValue('<p>' + apiResponse.data.choices[0].message.content + '</p>')
    document.getElementById('root-cause-ai-loader')?.classList.add("hide");
    document.getElementById('root-cause-ai-suggest')?.classList.remove("hide");
    // document.getElementById('ai-suggest')?.classList.add("hide");
  }
  checkRootCause() {
    this.Form.controls['findings'].enable()
    const findings = this.Form.value.findings
    if (findings) {
      document.getElementById('root-cause-error-text')?.classList.add("hide");
      const stringWithoutPTags = findings.replace(/<\/?p>/g, '');
      this.chatGPTForRootCause(stringWithoutPTags)
    } else {
      document.getElementById('root-cause-error-text')?.classList.remove("hide");
    }
    this.Form.controls['findings'].disable()
  }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
