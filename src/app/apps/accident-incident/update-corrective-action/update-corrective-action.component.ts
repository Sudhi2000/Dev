import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { E } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
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
  selector: 'app-update-corrective-action',
  templateUrl: './update-corrective-action.component.html',
  styleUrls: ['./update-corrective-action.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class UpdateCorrectiveActionComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Form: FormGroup
  dueDate = new FormControl(null);
  comDate = new FormControl(null);
  userID: any
  evidenceFormData = new FormData()
  files: File[] = [];
  addfiles: File[] = [];
  evidenceData: any[] = []
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
  constructor(private authService: AuthService,
    private router: Router,
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private accidentService: AccidentService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder, private _location: Location) { }
  ngOnInit() {
    this.Form = this.formBuilder.group({
      id: [''],
      action: [''],
      completed_date: [null],
      due_date: [''],
      reference_number: [''],
      status: [''],
      acc_reference_number: [''],
      notification: [null],
      reporter_id: [''],
      assignee_id: [''],
      action_taken: [''],
      user_remarks: [''],
      accident_id: [''],
      evidence: [''],
      evidence_type: [''],
      evidence_id: [''],
      first_evidence_id: [''],
      second_evidence_id: ['']
    });
    this.configuration()
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
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
        const status = result.acc_inc_action
        this.userID = result.id
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_action_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_action_details() {
    this.files = []
    const id = this.route.snapshot.paramMap.get('id');
    this.accidentService.get_assigned_corrective_action_id(id).subscribe({
      next: (result: any) => {
        if (result.data[0].attributes.assignee.data.id === this.userID) {
          if (result.data[0].attributes.status === "Completed") {
            this.router.navigate(["/apps/accident-incident/corrective-actions"])
          } else {
            this.Form.controls['id'].setValue(result.data[0].id)
            this.Form.controls['action'].setValue(result.data[0].attributes.action)
            this.Form.controls['completed_date'].setValue(result.data[0].attributes.completed_date)
            this.Form.controls['due_date'].setValue(result.data[0].attributes.due_date)
            this.dueDate.setValue(new Date(result.data[0].attributes.due_date))
            this.dueDate.disable()
            if (result.data[0].attributes.completed_date) {
              this.comDate.setValue(new Date(result.data[0].attributes.completed_date))
            }
            this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
            this.Form.controls['action_taken'].setValue(result.data[0].attributes.action_taken)
            this.Form.controls['user_remarks'].setValue(result.data[0].attributes.user_remarks)
            this.Form.controls['status'].setValue(result.data[0].attributes.status)
            this.Form.controls['accident_id'].setValue(result.data[0].attributes.accident.data.id)
            this.Form.controls['acc_reference_number'].setValue(result.data[0].attributes.accident.data.attributes.reference_number)
            this.Form.controls['reporter_id'].setValue(result.data[0].attributes.accident.data.attributes.assignee.data.id)
            this.Form.controls['assignee_id'].setValue(result.data[0].attributes.assignee.data.id)
            this.evidenceData = result.data[0].attributes.corrective_action_evidences.data
            if (this.evidenceData.length > 0) {
              this.Form.controls['evidence'].setValue('OK')
            } else {
              this.Form.controls['evidence'].reset()
            }

            const evidence__data = result.data[0].attributes.corrective_action_evidences.data
            if (evidence__data.length > 0) {
              this.Form.controls['evidence_id'].setValue(evidence__data[0]?.id || null);
              this.Form.controls['first_evidence_id'].setValue(evidence__data[1]?.id || null);
              this.Form.controls['second_evidence_id'].setValue(evidence__data[2]?.id || null);

              evidence__data.slice(0, 3).forEach((evidence: any) => {
                this.generalService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_after_name + '.' + evidence.attributes.format_after).subscribe((data: any) => {
                  this.files.push(data);
                });
              });
            }

          }
        } else {
          this.router.navigate(["/apps/accident-incident/corrective-actions"])
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  onSelect(event: any) {
    const maxFiles = 3; // Set the maximum number of files allowed
    const fileCount = this.files.length;
    const addedLength = event.addedFiles.length;

    if (fileCount + addedLength <= maxFiles) { // Check if total files won't exceed the limit
      for (const addedFile of event.addedFiles) {
        const size = addedFile.size / 1024 / 1024;
        const fileTypes = ['jpg', 'jpeg', 'png'];
        const extension = addedFile.name.split('.').pop().toLowerCase();
        const isSuccess = fileTypes.includes(extension);

        if (size > 20) {
          const statusText = "Please choose an image below 2 MB";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else if (isSuccess) {
          this.Form.controls['evidence'].setErrors(null);
          this.files.push(addedFile);
        } else {
          const statusText = "Please choose images ('jpg', 'jpeg', 'png')";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }

      this.upload_evidence();
    } else {
      const statusText = `You can only upload up to ${maxFiles} files`;
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }



  onRemove(index: any) {
    if (index === 0) {
      const evidenceID = this.Form.value.evidence_id
      this.deleteEvidence(evidenceID);
    }
    else if (index === 1) {
      const evidenceID = this.Form.value.first_evidence_id
      this.deleteEvidence(evidenceID);
    }
    else if (index === 2) {
      const evidenceID = this.Form.value.second_evidence_id
      this.deleteEvidence(evidenceID);
    }
  }




  deleteEvidence(evidenceID: any) {
    this.showProgressPopup();
    this.accidentService.delete_corrective_evidence(evidenceID).subscribe({
      next: (result: any) => {
        this.generalService.delete_image(result.data.attributes.evidence_id_after).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Evidence deleted"
            this._snackBar.open(statusText, 'Close Warning', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_evidence_details()
          }
        })
      },
      error: (err: any) => { },
      complete: () => { Swal.close() }
    })
  }

  async upload_evidence() {
    this.showProgressPopup();

    try {
      for (const elem of this.files) {
        if (!elem || !elem.name) {
          continue;
        }

        const extension = elem.name.split('.').pop()?.toLowerCase();
        const formData = new FormData();
        formData.append('files', elem, this.Form.value.reference_number + '.' + extension);

        const result: any = await this.generalService.upload(formData).toPromise();

        let data: any[] = [];
        data.push({
          evidence_after_name: result[0].hash,
          format_after: extension,
          accident_action: this.Form.value.id,
          accident: this.Form.value.accident_id,
          id: result[0].id
        });

        await this.accidentService.create_corrective_evidence_after(data[0]).toPromise();
      }

      const statusText = "Evidence uploaded";
      this._snackBar.open(statusText, 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

      Swal.close();
      this.get_evidence_details();
    } catch (err) {
    }
  }

  get_evidence_details() {
    this.files = []
    const id = this.route.snapshot.paramMap.get('id');
    this.accidentService.get_assigned_corrective_action_id(id).subscribe({
      next: (result: any) => {
        if (result.data[0].attributes.assignee.data.id === this.userID) {

          this.evidenceData = result.data[0].attributes.corrective_action_evidences.data
          if (this.evidenceData.length > 0) {
            this.Form.controls['evidence'].setValue('OK')
          } else {
            this.Form.controls['evidence'].reset()
          }

          const evidence__data = result.data[0].attributes.corrective_action_evidences.data
          if (evidence__data.length > 0) {
            this.Form.controls['evidence_id'].setValue(evidence__data[0]?.id || null);
            this.Form.controls['first_evidence_id'].setValue(evidence__data[1]?.id || null);
            this.Form.controls['second_evidence_id'].setValue(evidence__data[2]?.id || null);

            evidence__data.slice(0, 3).forEach((evidence: any) => {
              this.generalService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_after_name + '.' + evidence.attributes.format_after).subscribe((data: any) => {
                this.files.push(data);
              });
            });
          }
        } else {
          this.router.navigate(["/apps/accident-incident/corrective-actions"])
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
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

  inProgress() {
    this.showProgressPopup();
    const status = "In-Progress"
    this.accidentService.update_action_status(this.Form.value, status).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'In Progress',
          imageUrl: "assets/images/start-working.gif",
          text: "You have successfully changed the status to In Progress.",
          imageWidth: 250,
          showCancelButton: false,

        }).then((result) => {
          this.ngOnInit()
        })
      }
    })
  }

  submit() {
    if (this.Form.value.action_taken) {
      this.accidentService.update_action_taken(this.Form.value).subscribe({
        next: (result: any) => {
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          const statusText = "Successfully Updated Action Taken"
          this._snackBar.open(statusText, 'Ok', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          // this.create_notification()
        }
      })
    }
  }
  completed() {
    if (this.Form.value.completed_date) {
      this.showProgressPopup();
      const status = "Completed"
      this.accidentService.update_action_status(this.Form.value, status).subscribe({
        next: (result: any) => {

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          this.create_notification()
        }
      })
    } else {
      Swal.fire({
        title: 'Missing Date',
        imageUrl: "assets/images/calendar.gif",
        text: "Please provide the task completion date In order to mark the task as completed",
        imageWidth: 250,
        showCancelButton: false,
      }).then((result) => {
      })
    }
  }

  create_notification() {
    let data: any[] = []
    data.push({
      module: "Accident & Incident",
      action: 'Completed corrective or preventive action',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.reporter_id,
      access_link: "/apps/accident-incident/accident-register",
      profile: this.Form.value.assignee_id
    })

    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Task Completed',
          imageUrl: "assets/images/confirm.gif",
          imageWidth: 250,
          text: "You have successfully reported the task. We will notify the department head to take further action.",
          showCancelButton: false,
        }).then((result) => {
          this.router.navigate(["/apps/accident-incident/corrective-actions"])
        })
      }
    })
  }

  completedDate(data: any) {
    if (!data.value) {
      this.Form.controls['completed_date'].setValue(null);
    } else {
      let DateVal = new Date(data.value);
      let DateString = new Date(DateVal.getTime() - (DateVal.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];
      this.Form.controls['completed_date'].setValue(DateString);
      this.Form.controls['notification'].setValue(false);
    }
  }



  checkCorrectiveAction() {
    this.Form.controls['action'].enable()
    const action = this.Form.value.action;
    if (action) {
      document.getElementById('error-text')?.classList.add("hide");
      const stringWithoutPTags = action.replace(/<\/?p>/g, '');
      this.chatGPT(stringWithoutPTags)
    } else {
      document.getElementById('error-text')?.classList.remove("hide");
    }
    // this.Form.controls['action'].disable()
  }


  async chatGPT(stringWithoutPTags: any) {
    document.getElementById('ai-loader')?.classList.remove("hide");
    document.getElementById('ai-suggest')?.classList.add("hide");
    // const observation = this.generalForm.value.observation
    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const message = stringWithoutPTags + '.suggest the top 5 practicable answer for this action taken by applying bullet points.Answer should be embedded in html tags without lossing bullet structure. '
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
    this.Form.controls['action_taken'].setValue('<p>' + apiResponse.data.choices[0].message.content + '</p>')
    document.getElementById('ai-loader')?.classList.add("hide");
    document.getElementById('ai-suggest')?.classList.remove("hide");
  }


  control_event_open_ai(completion_tokens: any, prompt_tokens: any, total_tokens: any) {
    this.accidentService.create_open_ai(this.Form.value, completion_tokens, prompt_tokens, total_tokens).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {

      }
    })

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
