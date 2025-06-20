import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { MaterialityService } from 'src/app/services/materiality-assessment.api.service';
import { AddStakeholderComponent } from '../survey/add-stakeholder/add-stakeholder.component';
import { UpdateStakeholderComponent } from './update-stakeholder/update-stakeholder.component';
import { CreateTopicComponent } from '../survey/create-topic/create-topic.component';
import Sortable from 'sortablejs';
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
  selector: 'app-modify-survey',
  templateUrl: './modify-survey.component.html',
  styleUrls: ['./modify-survey.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ModifySurveyComponent implements OnInit {
  @ViewChildren('sortableItem') sortableList: QueryList<ElementRef>;
  fullName: any;
  allframeWorks: any[] = []

  ngAfterViewInit() {
    this.initializeSortableList();
  }

  initializeSortableList() {
    const container = document.getElementById('sortable-list');
    if (container) {
      const listItems: HTMLElement[] = this.sortableList.toArray().map(item => item.nativeElement);
      listItems.forEach(item => container.appendChild(item));

      const sortable = new Sortable(container, {
        onUpdate: (event) => {
          this.updateSlNoValues(event);
        }
      });
    }
  }

  updateSlNoValues(event: any) {
    const updatedSelectedTopics: any[] = Array.from(event.from.children).map((item: any, index: number) => {
      const itemId = parseInt(item.getAttribute('data-id') || '');
      const selectedTopic = this.selected_topics.find(topic => topic.id === itemId);
      if (selectedTopic) {
        selectedTopic.slNo = index + 1;
      }
      return selectedTopic;
    });
    this.selected_topics = updatedSelectedTopics;
  }

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 5,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  filterForm: FormGroup
  filteredBodyPart: Observable<string[]>;
  bodyPartCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  surveyId: any

  stakeholderRegister: any[] = []
  stakeholders: any[] = []
  industries: any[] = []
  frameworks: any[] = []
  materiality_topics: any[] = []

  filteredMaterialityTopics: any[] = []
  selected_topics: any[] = [];
  selectedIndustry: string;
  emailList: string[] = [];
  truncatedEmails: string = '';
  selectedFramework: string;
  evidenceFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  surveyDateRange = new FormGroup({
    start_date: new FormControl(),
    end_date: new FormControl()
  });
  dropdownValues: any

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

  constructor(private generalService: GeneralService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private materialityService: MaterialityService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      reference_number: [''],
      created_date: [''],
      status: [''],
      reporter: [''],
      stakeholder: [''],
      cc_mail: [''],
      email_subject: ['', [Validators.required]],
      headline: ['', [Validators.required]],
      content: [''],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      to_mail: [''],
      reference_id: [''],
    });
    this.filterForm = this.formBuilder.group({
      industry: ['', [Validators.required]],
      framework: ['', [Validators.required]],
    })



    const uuid = uuidv4()
    const uuid2 = uuid.slice(0, 8)

    const id = this.route.snapshot.paramMap.get('id')
    this.Form.controls['reference_id'].setValue(id)

  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.materiality
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
        this.fullName = result.profile.first_name + ' ' + result.profile.last_name

        this.Form.controls['cc_mail'].setValue(result.email)
        const status = result.schedule_survey
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_dropdown_values()
          this.get_details()

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_details() {
    this.materialityService.get_materiality_survey(this.Form.value.reference_id).subscribe({
      next: (result: any) => {
        console.log("Survey details: ", result)
        this.surveyId = result.data[0].id
        this.stakeholders = result.data[0].attributes.stakeholder.data
        this.Form.controls['id'].setValue(result.data[0].id)
        this.Form.controls['content'].setValue(result.data[0].attributes.content)
        this.Form.controls['created_date'].setValue(result.data[0].attributes.created_date)
        this.Form.controls['headline'].setValue(result.data[0].attributes.headline)
        this.Form.controls['email_subject'].setValue(result.data[0].attributes.email_subject)
        this.surveyDateRange.controls['start_date'].setValue(result.data[0].attributes.start_date)
        this.surveyDateRange.controls['end_date'].setValue(result.data[0].attributes.end_date)
        this.Form.controls['start_date'].setValue(result.data[0].attributes.start_date)
        this.Form.controls['end_date'].setValue(result.data[0].attributes.end_date)
        this.emailList = this.stakeholders.map(s => s.attributes.email_id);
        this.Form.controls['to_mail'].setValue(this.emailList)
        this.filterForm.controls['industry'].setValue(result?.data[0]?.attributes?.industry)
        this.filterForm.controls['framework'].setValue(result?.data[0]?.attributes?.framework)
        this.selected_topics = result?.data[0]?.attributes?.materiality_survey_topics?.data

        // this.modifyForm.patchValue(response);


        this.truncateEmails();
      },
      error: (err: any) => { },
      complete: () => {
        this.Form.controls['headline'].disable()
        this.Form.controls['email_subject'].disable()
        this.filterForm.controls['industry'].disable()
        this.filterForm.controls['framework'].disable()
        this.surveyDateRange.controls['start_date'].disable()

      }
    })
  }

  setFramework() {
    this.frameworks = this.allframeWorks

    this.get_topics()

  }


  search() {
    if (this.filterForm.value.industry || this.filterForm.value.framework) {
      this.filterTopics()
    }
    else {
      this.get_topics()
    }
  }

  reset() {
    this.selected_topics = []
    this.ngOnInit()
  }

  //get dropdown values
  get_dropdown_values() {
    const module = "Materiality"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        this.industryList()
        this.frameworkList()
      },
      error: (err: any) => { },
      complete: () => {

      }
    })
  }


  industryList() {
    const defaultIndustry = this.dropdownValues.find(function (elem: any) {
      return elem.attributes.Category === "Industry" && elem.attributes.filter === "default";
    });

    const otherIndustries = this.dropdownValues.filter(function (elem: any) {
      return elem.attributes.Category === "Industry";
    });

    if (defaultIndustry) {
      this.filterForm.controls['industry'].setValue(defaultIndustry.attributes.Value);
    }
    this.industries = otherIndustries;
    this.get_topics()
  }


  frameworkList() {
    const framework = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Framework")
    })
    this.frameworks = framework

  }

  get_topics() {
    this.materialityService.get_topics_industry(this.filterForm.value.industry).subscribe({
      next: (result: any) => {
        this.filteredMaterialityTopics = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  checkDescription() {
    this.Form.controls['content'].enable()
    const subject = this.Form.value.email_subject
    if (subject) {
      document.getElementById('error-text')?.classList.add("hide");
      document.getElementById('error-headline')?.classList.remove("hide");
      const stringWithoutPTags = subject.replace(/<\/?p>/g, '');
      this.chatGPT(stringWithoutPTags)
    } else if (!subject) {
      document.getElementById('error-text')?.classList.remove("hide");
    } else if (!this.Form.value.headline) {
      document.getElementById('error-headline')?.classList.remove("hide");
    }
  }

  async chatGPT(stringWithoutPTags: any) {
    document.getElementById('ai-loader')?.classList.remove("hide");
    document.getElementById('ai-suggest')?.classList.add("hide");
    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const message =
      "Generate only the email content in pure HTML format. " +
      `Start with 'Subject:' followed by ${this.Form.value.email_subject}. ` +
      `Include a headline at the beginning of the email, which is ${this.Form.value.headline} ` +
      "Include a greeting like 'Dear [Stakeholder's Name],'. " +
      "The email should be structured formally with an introduction, purpose, key details, and a clear call to action. " +
      "Use proper HTML tags such as <p> for paragraphs, <strong> for emphasis, <br> for line breaks where necessary. " +
      "Do not include any additional text, explanations, or preamble like 'Here is the template'. " +
      "The email should follow this structure: " +
      "'Subject: Invitation to Participate in Double Materiality Assessment via SATTVA ESG Application' " +
      `Headline: ${this.Form.value.headline}` +
      "'Dear Sir/Madam,' " +
      "'Introduction: A polite opening, mentioning the purpose of the email.' " +
      "'Why Your Participation Matters: A brief explanation of the importance of their role in the assessment.' " +
      `Survey Details: Information on the survey platform, target stakeholder type, timeline (mentioning start and end dates as ${this.Form.value.start_date} and ${this.Form.value.end_date}), and confidentiality assurances.` +
      "'Next Steps: Clear instructions on how to proceed, including the survey link and any follow-up actions.' " +
      "'Closing: A professional and appreciative sign-off, inviting further questions if necessary.' " +
      `End the email with 'Best regards, ${this.fullName},<br> ${this.Form.value.cc_mail}'. ` +
      "Only return the final HTML email.";

    let requestData = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: message }
      ]
    };
    let apiResponse = await openai.createChatCompletion(requestData);
    const completion_tokens = apiResponse.data.usage.completion_tokens
    const prompt_tokens = apiResponse.data.usage.prompt_tokens
    const total_tokens = apiResponse.data.usage.total_tokens
    this.control_event_open_ai(completion_tokens, prompt_tokens, total_tokens)
    this.Form.controls['content'].enable()
    // this.Form.controls['content'].setValue(apiResponse.data.choices[0].message.content)
    this.Form.patchValue({
      content: apiResponse.data.choices[0].message.content
    });


    document.getElementById('ai-loader')?.classList.add("hide");
    document.getElementById('ai-suggest')?.classList.remove("hide");
  }

  control_event_open_ai(completion_tokens: any, prompt_tokens: any, total_tokens: any) {
    this.materialityService.create_open_ai(this.Form.value, completion_tokens, prompt_tokens, total_tokens).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {

      }
    })

  }

  startDateChange(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['start_date'].setValue(newDate)
  }
  endDateChange(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['end_date'].setValue(newDate)
  }
  filterTopics() {
    this.filteredMaterialityTopics = []
    const framework = this.filterForm.value.framework;
    const industry = this.filterForm.value.industry;

    let observable;

    if (framework && industry) {
      observable = this.materialityService.get_topics_framework_industry(framework, industry);
    } else if (framework) {
      observable = this.materialityService.get_topics_framework(framework);
    } else if (industry) {
      observable = this.materialityService.get_topics_industry(industry);
    } else {
      observable = this.materialityService.get_topics_industry(this.filterForm.value.industry);
    }

    observable.subscribe({
      next: (result: any) => {
        this.filteredMaterialityTopics = result.data;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { }
    });
  }

  addStakeholder() {
    this.dialog.open(AddStakeholderComponent).afterClosed().subscribe(data => {
      if (data) {
        if (this.stakeholders.length > 0) {
          this.Form.controls['stakeholder'].setErrors(null);
        } else {
          this.Form.controls['stakeholder'].setValidators(Validators.required);
        }
        this.materialityService.create_new_stakeholder(data, this.surveyId).subscribe({
          next: (result: any) => {
            this.stakeholders.push(result.data)
            const statusText = "Stakeholder added sucessfully.";
            this._snackBar.open(statusText, 'Close', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          },
          error: (err: any) => { },
          complete: () => { }
        })

      }
      this.emailList = this.stakeholders.map(s => s.email_id);
      this.Form.controls['to_mail'].setValue(this.emailList)
      this.truncateEmails();
    })
  }

  truncateEmails() {
    const fullString = this.emailList.join(', ');
    this.truncatedEmails = fullString.length > 30 ? fullString.substring(0, 30) + '...' : fullString;
  }

  addTopic() {
    this.dialog.open(CreateTopicComponent).afterClosed().subscribe(data => {
      if (data) {
        this.filterTopics()
      }
    })
  }

  addTopics(topic: any): void {
    const maximumTopics = 12;

    if (this.selected_topics.length < maximumTopics && this.selected_topics.indexOf(topic.attributes.topic) === -1) {

      this.materialityService.create_materiality_survey_topic(topic, this.surveyId).subscribe({
        next: (result: any) => {

          // topic.slNo = this.selected_topics.length + 1;
          // this.selected_topics.push(topic);
          // this.ngAfterViewInit()
          this.get_details()
          const statusText = "Topic added sucessfully.";
          this._snackBar.open(statusText, 'Close', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        },
        error: (err: any) => { },
        complete: () => { }
      })
    } else if (this.selected_topics.length >= maximumTopics) {
      const statusText = "Maximum topics reached. Cannot add more topics";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else {
      const statusText = "Topic already selected";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  removeTopic(topic: any): void {
    this.materialityService.delete_materiality_survey_topic(topic).subscribe({
      next: (result: any) => {
        const index = this.selected_topics.indexOf(topic);
        if (index !== -1) {
          this.selected_topics.splice(index, 1);
          this.updateSLNoValues();
        }

        const statusText = "Topic removed successfully."
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      },
      error: (err: any) => { },
      complete: () => { }
    })

  }

  updateSLNoValues() {
    this.selected_topics.forEach((topic, index) => {
      topic.slNo = index + 1;
    });
  }

  topicAlreadySelected(id: number): boolean {
    return this.selected_topics.some(topic => topic.id === id);
  }

  deleteStakeholder(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Are you sure you want to delete this stakeholder details.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.materialityService.delete_stakeholder(data).subscribe({
          next: (result: any) => {
            this.stakeholders.splice(this.stakeholders.findIndex((existingCustomer) => existingCustomer.id === data.id), 1)
            const statusText = "Stakeholder deleted sucessfully.";
            this._snackBar.open(statusText, 'Close', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
    })
  }

  modifyStackholder(data: any, rowIndex: number) {
    this.dialog.open(UpdateStakeholderComponent, {
      data: { data, rowIndex }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        this.materialityService.update_stakeholder(updatedData).subscribe({
          next: (result: any) => {
            this.stakeholders[rowIndex] = result.data;
            const statusText = "Stakeholder updated sucessfully.";
            this._snackBar.open(statusText, 'Close', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
    });
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

  saveAsDraft() {
    this.Form.controls['status'].setValue('Draft')
    this.schedule_survey()
  }

  schedule() {
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
          this.Form.controls['status'].setValue('Open')
          this.schedule_survey()
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

  schedule_survey() {
    this.materialityService.update_survey(this.Form.value).subscribe({
      next: (result: any) => {
        Swal.fire({
          title: 'Survey Scheduled',
          imageUrl: "assets/images/success.gif",
          imageWidth: 250,
          text: "You have successfully scheduled a survey.",
          showCancelButton: false,

        })
        this.router.navigate(["/apps/materiality-assessment/register"])
      },
      error: (err: any) => {
        const statusText = "Something went wrong..";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      },
      complete: () => { }
    })
  }

  create_stakeholder() {
    if (this.stakeholders.length > 0) {
      this.stakeholders.forEach(elem => {
        this.materialityService.create_stake_holder(elem, this.Form.value.id, this.Form.value.reporter).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            this.create_survey_topic()
          }
        })
      })
    } else {
      this.create_survey_topic()
    }
  }

  create_survey_topic() {
    if (this.selected_topics.length > 0) {
      this.selected_topics.forEach(elem => {
        this.materialityService.create_survey_topic(elem, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            Swal.fire({
              title: 'Survey Scheduled',
              imageUrl: "assets/images/success.gif",
              imageWidth: 250,
              text: "You have successfully scheduled a survey. If it is required to modify the data, you can modify the survey.",
              showCancelButton: false,

            })
            this.router.navigate(["/apps/materiality-assessment/register"])
          }
        })
      })
    } else {
      Swal.fire({
        title: 'Survey Scheduled',
        imageUrl: "assets/images/success.gif",
        imageWidth: 250,
        text: "You have successfully scheduled a survey. If it is required to modify the data, you can modify the survey.",
        showCancelButton: false,
      })
      this.router.navigate(["/apps/materiality-assessment/register"])
    }
  }

}
