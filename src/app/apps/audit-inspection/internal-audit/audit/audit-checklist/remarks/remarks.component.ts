import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { Router } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AuthService } from 'src/app/services/auth.api.service';
import { ViewActionPlanDocumentComponent } from '../../../view-action-plan-document/view-action-plan-document.component';
import { UploadEvidenceComponent } from '../upload-evidence/upload-evidence.component';
import { IAlbum, Lightbox } from 'ngx-lightbox';
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
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class RemarksComponent implements OnInit {
  Form: FormGroup
  addMoreEvidence: boolean = false
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  files: File[] = [];
  peopleList: any[] = []
  priority_dropdown: any[] = []
  dueDate = new FormControl(null, [Validators.required]);
  report_date = new FormControl(null, [Validators.required]);
  multipledocumentIds: any[] = [];
  multiple_evidence_Before: boolean = false;
  MultipleDoumentBeforeFiles: File[] = [];
  orgID: string
  moreFiles: any[] = []
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
  evidenceList: any[] = []

  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private internalAuditService: InternalAuditService,
    public dialogRef: MatDialogRef<RemarksComponent>,
    private _snackBar: MatSnackBar,
    private internalService: InternalAuditService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private _lightbox: Lightbox,
  ) { }

  ngOnInit() {

    if (this.defaults) {
      this.Form = this.formBuilder.group({
        remarks: [this.defaults[0]?.remarks || '', [Validators.required]],
        file_name: [this.defaults[0]?.document_name || ''],
        evidence: [this.defaults[0]?.evidence || ''],
        evidence_id: [this.defaults[0]?.document_id || ''],
        org_id: [this.defaults.org_id || '', [Validators.required]],
        priority: [this.defaults.priority || '', [Validators.required]],
        reported_date: [new Date()],
        due_date: [this.defaults.due_date || '', [Validators.required]],
        assignee: ['', [Validators.required]],
        approver: [''],
        user: [''],
        reference_number: [''],
        add_more_evidence: [''],
        moreEvidence: [''],
      });

    }
    else {
      this.Form = this.formBuilder.group({
        remarks: ['', [Validators.required]],
        file_name: [''],
        evidence: [''],
        evidence_id: [''],
        org_id: [null, [Validators.required]],
        priority: ['', [Validators.required]],
        reported_date: [new Date()],
        due_date: ['', [Validators.required]],
        assignee: ['', [Validators.required]],
        approver: [''],
        reference_number: [''],
        add_more_evidence: [false],
        moreEvidence: [''],
      });

    }
    this.configuration()
    if (this.defaults[0]?.evidence) {
      this.addMoreEvidence = true
    }
  }


  report_Date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['reported_date'].setValue(newDate)
  }

  due_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['due_date'].setValue(newDate)
  }

  ///check organisation has access
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

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.int_aud_audit
        this.Form.controls['approver'].setValue(result.id)
        this.Form.controls['user'].setValue(result.username)
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_dropdownValue();
          this.get_profiles()
          this.get_multiple_evidences()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
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
  get_dropdownValue() {
    const module = 'Internal Audit'
    this.internalAuditService.get_dropdown(module).subscribe({
      next: (result: any) => {
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

  get_multiple_evidences() {
    const multipleEvidenceBefore = this.defaults[0]?.multiple_evidences
    if (multipleEvidenceBefore && multipleEvidenceBefore.length > 0) {
      this.MultipleDoumentBeforeFiles = [];
      const loadImageAtIndex = (index: number) => {
        if (index >= multipleEvidenceBefore.length) {

          if (this.MultipleDoumentBeforeFiles.length > 0) {
            this.multiple_evidence_Before = true;
          }
          return;
        }

        const document = multipleEvidenceBefore[index];
        const documentUrl = environment.client_backend + '/uploads/' + document?.multiple_evidence_name + '.' + document?.multiple_evidence_format;

        this.generalService.getImage(documentUrl).subscribe((data: any) => {
          let blobType = '';
          const fileType = document.multiple_evidence_format.toLowerCase();

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
          const file = new File([blob], document.multiple_evidence_name + '.' + document.multiple_evidence_format, { type: blobType });
          const documentId = document.multiple_evidence_id;
          const pdfUrl = URL.createObjectURL(blob);

          const documentInfo = {
            id: documentId,
            file_name: document.multiple_evidence_name,
            file_format: document.multiple_evidence_format,
            file: file,
            pdfUrl: pdfUrl,
            type: blobType
          };

          this.multipledocumentIds[index] = documentInfo;
          this.MultipleDoumentBeforeFiles.push(file);

          loadImageAtIndex(index + 1);
        });
      };

      loadImageAtIndex(0);
    }

  }
  onSelect(event: any) {
    const fileLength = this.files.length;
    const addedLength = event.addedFiles.length;

    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / (1024 * 1024);
      if (size > 10) {
        const statusText = "Please choose a evidence below 10 MB";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        const fileTypes = ['pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png'];
        const extension = event.addedFiles[0].name.split('.').pop().toLowerCase();
        const isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.files.push(...event.addedFiles);
          this.Form.controls['file_name'].setValue(this.files[0].name);
          this.Form.controls['evidence'].setErrors(null);
          this.addMoreEvidence = true
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
  onRemoveMoreEvidence(event: any) {

    this.moreFiles.splice(this.moreFiles.indexOf(event), 1);
    if (this.moreFiles.length === 0) {
      this.Form.controls['moreEvidence'].reset()
    }

  }
  view_action_plan_document() {
    const documentName = this.defaults[0].document_name
    const documentFormat = this.defaults[0].document_format
    const fileUrl = `${environment.client_backend}/uploads/${documentName}.${documentFormat}`;
    saveAs(fileUrl, `${documentName}.${documentFormat}`);
  }
  openDocument(index: number) {
    // const documentInfo = this.documentIds[index];
    // if (documentInfo) {
    //   this.dialog.open(ViewActionPlanDocumentComponent, {
    //     width: '50%',
    //     data: { documentInfo: documentInfo },
    //   });
    // }
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
  remove_action_plan_document() {
    this.internalService.remove_action_plan_evidence(this.Form.value.evidence).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = " Action Plan Evidence Removed"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.Form.controls['evidence_id'].reset()
      }
    })
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length === 0) {
      this.Form.controls['evidence'].reset()
      this.addMoreEvidence = false
      this.moreFiles = []
      this.Form.controls['add_more_evidence'].reset()
    }
  }

  submit() {
    this.internalService.get_int_corrective_action().subscribe({
      next: (result: any) => {
        const count = result.data.length;
        const newCount = Number(count) + 1;
        const reference = 'COR-' + newCount;
        this.Form.controls['reference_number'].setValue(reference);
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        const data = [this.Form.value, this.files, this.moreFiles];
        this.dialogRef.close(data)

      }
    });


  }
  onSelectMoreEvidence(event: any) {

    const fileLength = this.moreFiles.length
    const addedLength = event.addedFiles.length
    console.log("addedLength", addedLength);
    event.addedFiles.forEach((elem: any) => {
      console.log("elem", elem);

      if (fileLength < 5 && addedLength < 6) {
        console.log("hi");
        const size = elem.size / 1024 / 1024
        if (size > 10) {
          const statusText = "Please choose a evidence below 10 MB"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          console.log("hlo");
          var fileTypes = ['pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png'];
          var extension = elem.name.split('.').pop().toLowerCase(),
            isSuccess = fileTypes.indexOf(extension) > -1;
          if (isSuccess) {
            console.log("isSuccess", isSuccess);
            this.Form.controls['moreEvidence'].setErrors(null)
            this.moreFiles.push(elem);
            console.log("moreFiles", this.moreFiles);

          } else {
            const statusText = "Please choose a evidence ('pdf', 'word', 'excel', 'jpg', 'jpeg', 'png')"
            this._snackBar.open(statusText, 'Close Warning', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          }
        }
      } else if (fileLength < 6) {
        const statusText = "You have exceed the upload limit"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }

    })








  }
  checkNonCompliance() {
    const question = this.defaults.question;
    if (question) {
      document.getElementById('error-text')?.classList.add("hide");
      const stringWithoutPTags = question.replace(/<\/?p>/g, '');
      this.chatGPT(stringWithoutPTags)
    } else {
      document.getElementById('error-text')?.classList.remove("hide");
    }
  }
  async chatGPT(stringWithoutPTags: any) {
    document.getElementById('ai-loader')?.classList.remove("hide");
    document.getElementById('ai-suggest')?.classList.add("hide");
    // const observation = this.generalForm.value.observation
    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const message = 'Provide non-compliance description for audit question"' + stringWithoutPTags + '".avoid bullet points,provide just a small description.'

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
    this.Form.controls['remarks'].setValue('<p>' + apiResponse.data.choices[0].message.content + '</p>')
    document.getElementById('ai-loader')?.classList.add("hide");
    document.getElementById('ai-suggest')?.classList.remove("hide");
  }

  control_event_open_ai(completion_tokens: any, prompt_tokens: any, total_tokens: any) {
    this.internalAuditService.create_open_ai(this.Form.value, completion_tokens, prompt_tokens, total_tokens).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
      }
    })
  }

  // uploadEvidence() {
  //   this.dialog.open(UploadEvidenceComponent, {
  //     width: '50%'
  //     // data: { documentInfo: documentInfo },
  //   }).afterClosed().subscribe((result) => {
  //     if (result && result.length === 2) {
  //       const metadata = result[0]; // object with title, file_name, etc.
  //       const file = result[1];     // File object

  //       const format = file.type.split('/')[1];
  //       const src = URL.createObjectURL(file); // creates temporary blob URL

  //       if (this.evidenceList.length < 6) {

  //         this.evidenceList.push({
  //           ...metadata,
  //           format: format,
  //           src: src,
  //           file: file,
  //           file_name: file.name
  //         });

  //       } else {
  //         const statusText = "You have exceeded the upload limit";
  //         this._snackBar.open(statusText, 'Close Warning', {
  //           horizontalPosition: this.horizontalPosition,
  //           verticalPosition: this.verticalPosition,
  //         });
  //       }


  //     }
  //   });
  // }

  deleteImage(index: number) {
    this.evidenceList.splice(index, 1);
    Swal.fire(
      'Deleted Successfully',
      'The image has been removed from the list.',
      'success'
    );
  }

  openPdf(file: any) {
    // Case 1: Base64-encoded PDF string
    if (typeof file === 'string' && file.startsWith('data:application/pdf')) {
      const byteString = atob(file.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const intArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([intArray], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    }

    // Case 2: Blob or File object
    else if (file instanceof Blob || file instanceof File) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }

    // Case 3: Direct URL string
    else if (typeof file === 'string') {
      window.open(file, '_blank');
    }

    // Case 4: Invalid type
    else {
      console.error('Unsupported file format:', file);
    }
  }

}
