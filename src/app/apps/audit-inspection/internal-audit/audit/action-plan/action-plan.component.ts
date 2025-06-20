import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { action } from 'src/app/services/schemas';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.api.service';
import { MatDialog } from '@angular/material/dialog';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
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
  selector: 'app-action-plan',
  templateUrl: './action-plan.component.html',
  styleUrls: ['./action-plan.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ActionPlanComponent implements OnInit {
  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 5,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };

  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;
  Form: FormGroup
  units: any[] = []
  orgID: string
  peopleList: any[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  files: File[] = [];
  heirarchy_dropdown: any[] = [];
  priority_dropdown: any[] = []
  evidenceFormData = new FormData()

  mode: 'create' | 'update' = 'create';
  static id = 1;
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

  dueDate = new FormControl(null, [Validators.required]);
  completeDate = new FormControl(null);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public InternalAuditService: InternalAuditService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<ActionPlanComponent>,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as action;
    }
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [this.defaults.id],
       org_id: [this.defaults.org_id || '', [Validators.required]],
      finding: [this.defaults.finding || '', [Validators.required]],
      // recommendation_sustainable_solution: [this.defaults.finding || ''],
      // action_plan: [this.defaults.action_plan || '', [Validators.required]],
      // corrective_action_plan: [this.defaults.corrective_action_plan || '', [Validators.required]],
      // root_cause: [this.defaults.root_cause || '', [Validators.required]],
      priority: [this.defaults.priority || '', [Validators.required]],
      // actual_completion_date: [this.defaults.actual_completion_date || null],
      due_date: [this.defaults.due_date || '', [Validators.required]],
      reference: [this.defaults.reference],
      date: [new Date],
      audid: [this.defaults.audid],
      // responsible: [null, [Validators.required]],
      responsible_name: [''],
      // heirarchy_control: ['', [Validators.required]],
      sustainable_solution: [''],
      evidence: [''],
      document_id: [''],
      document_name: [''],
      document_format: [''],
      user: [''],
      assignee:['',[Validators.required]],
      reference_number:['']
      

    });

  }
  due_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['due_date'].setValue(newDate)
  }
  actual_completion_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['actual_completion_date'].setValue(newDate)
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
        const status = result.ext_aud_audit
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
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
    this.InternalAuditService.get_dropdown(module).subscribe({
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
        });
        this.priority_dropdown = dropdownData;
      },
      error: (err: any) => { },
      complete: () => { },
    })
  }

  onDropdownSelectionChange(event: any) {
    // this.chatGPT();
  }

  report_Date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['reported_date'].setValue(newDate)
  }
  //open ai
  async chatGPT(stringWithoutPTags: any) {
    document.getElementById('ai-loader')?.classList.remove("hide");
    document.getElementById('ai-suggest')?.classList.add("hide");

    // const observation = this.generalForm.value.observation
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
    // document.getElementById('ai-suggest')?.classList.add("hide");
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
    const message =  stringWithoutPTags + '.suggest the top 3 practicable possible root cause for this Audit finding by applying Fishbone Diagram method.Answer should be embedded in html tags without lossing fishbone structure.Answer Should be in a format of having a heading Top 3 practical root causes,then major categories of fishbone method with a definition,then 2 Potential Root Causes for Each Category and finally having the Top Practicable Possible Root Cause with a short explanation.And no need of the Top Heading mentioning fishbone method.Use Minimum Sizes for headings but more than that of normal text'
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
  
  control_event_open_ai(completion_tokens: any, prompt_tokens: any, total_tokens: any) {
    this.InternalAuditService.create_open_ai(this.Form.value, completion_tokens, prompt_tokens, total_tokens).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {

      }
    })

  }
  responsible(data: any) {
    this.Form.controls['responsible_name'].setValue(data.attributes.first_name + ' ' + data.attributes.last_name)
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
          this.Form.controls['evidence'].setErrors(null);
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

    this.InternalAuditService.get_int_corrective_action().subscribe({
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
        
    this.InternalAuditService.create_audit_action_plan(this.Form.value).subscribe({

      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)


      },
      error: (err: any) => { },
      complete: () => {
        this.Upload_evidence()
      }
    })
      }
    });



  }
  Upload_evidence() {
    const reference = this.defaults.reference;
    if (this.files.length != 0) {
      this.files.forEach((elem: any) => {
        this.evidenceFormData.delete('files')
        const extension = elem.name.split('.').pop().toLowerCase()
        this.evidenceFormData.append('files', elem, this.Form.value.reference + '.' + extension)
        this.generalService.upload(this.evidenceFormData).subscribe({
          next: (result: any) => {
            let data: any[] = []
            data.push({
              document_name: result[0].hash,
              document_format: extension,
              internal_audit_action_plan: this.Form.value.id,
              internal_audit: this.Form.value.audid,
              document_id: result[0].id
            })



            this.InternalAuditService.create_completed_action_plan_evidence(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                const statusText = "Action Plan Evidence added successfully"
                this._snackBar.open(statusText, 'OK', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.files = []
                //this.get_inventory_msds_document()

              }
            })

          },
          error: (err: any) => { },
          complete: () => {
            this.dialogRef.close(this.Form.value);
            const statusText = "Audit action plan created"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            Swal.close()
          }
        })
      })
    }
    else {
      this.dialogRef.close(this.Form.value);
      const statusText = "Audit action plan created"
      this._snackBar.open(statusText, 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      Swal.close()
    }

  }

  checkFindings() {
    const findings = this.Form.value.finding;
    if (findings) {
      document.getElementById('error-text')?.classList.add("hide");
      const stringWithoutPTags = findings.replace(/<\/?p>/g, '');
      this.chatGPT(stringWithoutPTags)
    } else {
      document.getElementById('error-text')?.classList.remove("hide");
    }
  }
  checkRootCause() {
    const findings = this.Form.value.finding;
    if (findings) {
      document.getElementById('root-cause-error-text')?.classList.add("hide");
      const stringWithoutPTags = findings.replace(/<\/?p>/g, '');
      this.chatGPTForRootCause(stringWithoutPTags)
    } else {
      document.getElementById('root-cause-error-text')?.classList.remove("hide");
    }
  }

}
