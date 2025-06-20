import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
import { AddStakeholderComponent } from './add-stakeholder/add-stakeholder.component';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { UpdateTopicComponent } from './update-topic/update-topic.component';
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
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class SurveyComponent implements OnInit {
  @ViewChildren('sortableItem') sortableList: QueryList<ElementRef>;

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

  stakeholderRegister: any[] = []
  stakeholders: any[] = []
  industries: any[] = []
  frameworks: any[] = []
  allframeWorks: any[] = []
  materiality_topics: any[] = []

  filteredMaterialityTopics: any[] = []

  governanceTopics: any[] = []
  socialTopics: any[] = []
  environmentTopics: any[] = []

  selected_topics: any[] = [];
  selected_governance_topics: any[] = [];
  selected_social_topics: any[] = [];
  selected_env_topics: any[] = [];

  fullName:any;
  buttonDisable:boolean = true;
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
      status: [''],
      reporter: [''],
      stakeholder: [''],
      reported_date: [new Date()],
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
      industry: ['',[Validators.required]],
      framework: ['',[Validators.required]],
    })

    const uuid = uuidv4()
    const uuid2 = uuid.slice(0, 8)
    this.Form.controls['reference_id'].setValue(uuid2)

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
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
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
        this.frameworkList()
        this.industryList()
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  getindustryList() {
    this.materialityService.get_industry().subscribe({
      next: (result: any) => {
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  industryList() {
    this.materialityService.get_industry().subscribe({
      next: (result: any) => {
        // this.industries = result.data
        const defaultIndustry = result.data.find(function (elem: any) {
          return elem.attributes.filter === "default";
        });

        const otherIndustries = result.data.filter(function (elem: any) {
          return elem.attributes.value
        });

        if (defaultIndustry) {
          this.filterForm.controls['industry'].setValue(defaultIndustry.attributes.value);
          this.frameworks = []
          const framework = this.allframeWorks.filter(function (elem: any) {
            return (elem.attributes.industry === defaultIndustry.attributes.value)
          })
          this.frameworks = framework
        }
        this.industries = otherIndustries;
        this.get_topics()
        this.frameworks = this.allframeWorks

      },
      error: (err: any) => { },
      complete: () => { 
      }
    })
    // const defaultIndustry = this.dropdownValues.find(function (elem: any) {
    //   return elem.attributes.Category === "Industry" && elem.attributes.filter === "default";
    // });

    // const otherIndustries = this.dropdownValues.filter(function (elem: any) {
    //   return elem.attributes.Category === "Industry";
    // });

    // if (defaultIndustry) {
    //   this.filterForm.controls['industry'].setValue(defaultIndustry.attributes.Value);
    // }
    // this.industries = otherIndustries;
    // this.get_topics()
  }


  frameworkList() {
    this.materialityService.get_framework().subscribe({
      next: (result: any) => {
        this.allframeWorks = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  setFramework() {
    this.frameworks = this.allframeWorks


    this.get_topics()

  }

  get_topics() {
    this.materialityService.get_topics_industry(this.filterForm.value.industry).subscribe({
      next: (result: any) => {
        this.filteredMaterialityTopics = result.data
        const flatData = result.data.flat();
        this.environmentTopics = flatData.filter((item: { attributes: { topic: string; }; }) => item.attributes.topic === "Environment");
        this.socialTopics = flatData.filter((item: { attributes: { topic: string; }; }) => item.attributes.topic === "Social");
        this.governanceTopics = flatData.filter((item: { attributes: { topic: string; }; }) => item.attributes.topic === "Governance");
        
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  checkDescription() {
    if(this.Form.value.start_date && this.Form.value.end_date){
      this.Form.controls['content'].enable()
      const subject = this.Form.value.email_subject
      if (subject && this.Form.value.headline) {
        document.getElementById('error-text')?.classList.add("hide");
        document.getElementById('error-headline')?.classList.remove("hide");
        const stringWithoutPTags = subject.replace(/<\/?p>/g, '');
        this.chatGPT(stringWithoutPTags)
      } else if(!subject) {
        document.getElementById('error-text')?.classList.remove("hide");
      }else if(!this.Form.value.headline){
        document.getElementById('error-headline')?.classList.remove("hide");
      }
      
    }else{
      this._snackBar.open("Please enter the date range.", 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    
  }

  async chatGPT(stringWithoutPTags: any) {
    document.getElementById('ai-loader')?.classList.remove("hide");
    document.getElementById('ai-suggest')?.classList.add("hide");
    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    
    const emailSubject = this.Form.value.email_subject;
    const headline = this.Form.value.headline;
    const startDate = this.Form.value.start_date;
    const endDate = this.Form.value.end_date;
    const senderName = this.fullName;
    const senderEmail = this.Form.value.cc_mail;
    
    const message = `
    Generate only the email content in pure HTML format.
    
    Use the following exact structure and content, preserving the professional tone and wording:
    
    Dear [Stakeholder's Name],
    
    <p>I hope you're doing well. I’m writing to invite you to participate in an online survey as part of [Company Name]’s Double Materiality Assessment, conducted through our SATTVA ESG Application. This initiative is vital for assessing both the financial and environmental/social impacts of our operations, and your input is crucial to help us identify the most material issues related to sustainability.</p>
    
    <p><strong>Why Your Participation Matters:</strong> We are focusing on two key aspects:</p>
    
    <ul>
      <li><strong>Financial Materiality:</strong> Understanding how environmental and social factors may influence our business performance.</li>
      <li><strong>Environmental/Social Materiality:</strong> Evaluating the broader impact of our operations on the environment and society.</li>
    </ul>
    
    <p>Your insights, as a [Stakeholder Type], will be particularly valuable in helping us identify issues that may be material to both our company and external parties.</p>
    
    <p><strong>Survey Details:</strong></p>
    <ul>
      <li><strong>Platform:</strong> The survey will be conducted through the SATTVA ESG Application, which streamlines the collection of data and insights.</li>
      <li><strong>Target Stakeholder Type:</strong> As a [e.g., supplier, employee, customer, regulator, etc.], your perspective on [specific material issues] will be integral to ensuring we address all relevant concerns.</li>
      <li><strong>Timeline:</strong> The survey is open from ${startDate} to ${endDate}, and it should take approximately [estimated time] to complete.</li>
      <li><strong>Confidentiality:</strong> All responses will be kept confidential and analyzed to enhance our sustainability strategy.</li>
    </ul>
    
    <p><strong>Next Steps:</strong></p>
    <ol>
      <li>Click the link below to access the survey: [Survey Link]</li>
      <li>Complete the survey by <strong>${endDate}</strong>.</li>
      <li>If needed, we may reach out to schedule a follow-up consultation to dive deeper into specific issues.</li>
    </ol>
    
    <p>By participating, you are helping us build a more sustainable future by identifying key risks and opportunities. We truly value your feedback and look forward to collaborating on this important initiative.</p>
    
    <p>If you have any questions or need assistance, feel free to reach out to me directly.</p>
    
    <p>Best regards,<br>${senderName}<br>${senderEmail}</p>
    `;
    
    const requestData = {
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
    this.Form.controls['content'].setValue(apiResponse.data.choices[0].message.content)
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
      this.materialityService.get_topics_framework_industry(framework, industry).subscribe({
        next:(result: any) => {
          this.filteredMaterialityTopics = result.data;

        },
        error:(err: any) => {
          this.router.navigate(['/error/internal']);
        },
        complete:() => {}
      })

    } else if (framework) {
      this.materialityService.get_topics_framework(framework).subscribe({
        next:(result: any) => {

          this.filteredMaterialityTopics = result.data;

        },
        error:(err: any) => {
          this.router.navigate(['/error/internal']);
        },
        complete:() => {}
      })
    } else if (industry) {
      this.materialityService.get_topics_industry(industry).subscribe({
        next:(result: any) => {

          this.filteredMaterialityTopics = result.data;

        },
        error:(err: any) => {
          this.router.navigate(['/error/internal']);
        },
        complete:() => {}
      })
    } else {
      this.materialityService.get_topics_industry(this.filterForm.value.industry).subscribe({
        next:(result: any) => {

          this.filteredMaterialityTopics = result.data;

        },
        error:(err: any) => {
          this.router.navigate(['/error/internal']);
        },
        complete:() => {}
      })
    }

  }

  addStakeholder() {
    this.dialog.open(AddStakeholderComponent).afterClosed().subscribe(data => {
      if (data) {
        this.stakeholders.push(data)
        if (this.stakeholders.length > 0) {
          this.Form.controls['stakeholder'].setErrors(null);
        } else {
          this.Form.controls['stakeholder'].setValidators(Validators.required);
        }
      }
      this.emailList = this.stakeholders.map(s => s.email_id);
      this.Form.controls['to_mail'].setValue(this.emailList)
      this.truncateEmails();
    })
  }


  truncateEmails() {
    const fullString = this.emailList.join(', ');
    
    if (fullString.length <= 80) {
      this.truncatedEmails = fullString;
      return;
    }
  
    // Try to cut at the last comma before 30 characters
    let truncated = fullString.substring(0, 80);
    const lastCommaIndex = truncated.lastIndexOf(',');
  
    if (lastCommaIndex !== -1) {
      truncated = truncated.substring(0, lastCommaIndex);
    }
  
    this.truncatedEmails = truncated + '...';
  }
  

  addTopic() {
    this.dialog.open(CreateTopicComponent,{data:this.filterForm.value}).afterClosed().subscribe(data => {
      if (data) {
        this.ngOnInit()
        this.filterTopics()
      }
    })
  }

  editTopics(topic: any){
    this.dialog.open(UpdateTopicComponent,{data:{form:this.filterForm.value,topic:topic}}).afterClosed().subscribe(data => {
      if (data) {
        this.ngOnInit()
        this.filterTopics()
      }
    })
  }

  addTopics(topic: any): void {
    const maximumTopics = 25;

    // Check if topic is already selected
    if (this.selected_topics.length < maximumTopics &&
      !this.selected_topics.some(t => t.id === topic.id)) {

      // Assign slNo based on the existing selected_topics count
      const newTopic = { ...topic, slNo: this.selected_topics.length + 1 };
      this.selected_topics.push(newTopic);
      // this.selected_env_topics = this.selected_topics.filter((item: { attributes: { topic: string; }; }) => item.attributes.topic === "Environment");
      //   this.selected_social_topics = this.selected_topics.filter((item: { attributes: { topic: string; }; }) => item.attributes.topic === "Social");
      //   this.selected_governance_topics = this.selected_topics.filter((item: { attributes: { topic: string; }; }) => item.attributes.topic === "Governance");


      // Sort topics by slNo to maintain order
      this.selected_topics.sort((a, b) => a.slNo - b.slNo);
      // this.selected_env_topics.sort((a, b) => a.slNo - b.slNo);
      // this.selected_social_topics.sort((a, b) => a.slNo - b.slNo);
      // this.selected_governance_topics.sort((a, b) => a.slNo - b.slNo);

      // Update UI after adding
      this.ngAfterViewInit();

    } else if (this.selected_topics.length >= maximumTopics) {
      this._snackBar.open("Maximum topics reached. Cannot add more topics", 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else {
      this._snackBar.open("Topic already selected", 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }



  removeTopic(topic: any): void {
    const index = this.selected_topics.indexOf(topic);
    if (index !== -1) {
      this.selected_topics.splice(index, 1);
      this.updateSLNoValues();
    }
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
    this.stakeholders.splice(this.stakeholders.findIndex((existingCustomer) => existingCustomer.id === data.id), 1);
  }

  modifyStackholder(data: any, rowIndex: number) {
    this.dialog.open(AddStakeholderComponent, {
      data: { data, rowIndex }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        this.stakeholders[rowIndex] = updatedData;
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
    if (this.selected_topics.length > 0) {
      this.Form.controls['status'].setValue('Draft')
      this.create_reference_number()
    } else {
      const statusText = "Please select the Topic";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  schedule() {
    if (this.selected_topics.length > 0) {
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
            this.create_reference_number()
          }
        })
      } else if (!formStatus) {
        const statusText = "Please fill all mandatory fields"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    } else {
      const statusText = "Please select the Topic";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }

  }

  //create reference
  create_reference_number() {
    this.materialityService.get_surveys().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = 'MAT-' + newCount
        this.Form.controls['reference_number'].setValue(reference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.schedule_survey()
      }
    })
  }

  schedule_survey() {
    const data = this.Form.value
    data.industry = this.filterForm.value.industry;
    data.framework = this.filterForm.value.framework;
    this.materialityService.schedule_survey(data).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_stakeholder()
      }
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
