import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddParticipantComponent } from './add-participant/add-participant.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ViewParticipantComponent } from './view-participant/view-participant.component';
import { ViewQuestionComponent } from '../view-question/view-question.component';
import { ViewQuestionComponentNew } from './view-question/view-question.component';
import { v4 as uuidv4 } from 'uuid';
import { switchMap, map } from 'rxjs';
import { SurveyCategoryComponent } from '../survey-category/survey-category.component';
import { SurveyQuestionCategoryComponent } from '../survey-question-category/survey-question-category.component';
import { SurveyPurposeComponent } from '../survey-purpose/survey-purpose.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateSurveyComponent implements OnInit {

  surveyDateRange = new FormGroup({
    start_date: new FormControl(null),
    end_date: new FormControl(null)
  });
  Business_Unit = new FormControl(null, [Validators.required]);
  Form: FormGroup;
  pts: any
  draft: boolean
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5;
  peopleList: any[] = [];
  orgID: string;
  unitSpecific: any
  userDivision: any
  corporateUser: any
  dropDownValue: any[] = []
  divisions: any[] = []
  categories: any[] = []
  surveyPurposes: any[] = []
  allQuestioncategories: any[] = []
  filteredquestioncategories: any[] = []
  surveytypes: any[] = []
  observationData: any[] = []
  observations: any[] = []
  isLoading = true;
  tab = false;
  sub = false;
  switch = false;
  Questions: any[] = []
  languages: any[] = []
  userID: Number
  userName: ''
  participants: any[] = []
  Employees: any[] = []
  questions: any[] = []
  qcount: any
  orgName: any
  contactEmail: any
  QuestionIds: any = ""
  Selectedquestions = new FormControl(null, [Validators.required]);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  language = new FormControl(null);
  // language = new FormControl(null, [Validators.required]);
  surveyLink: string = "";
  qrCodeDownloadLink: SafeUrl = "";
  QRFormData = new FormData();



  timeline = new FormGroup({
    start_date: new FormControl(),
    end_date: new FormControl()
  });

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
    private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private satisfactionService: SatisfactionService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      reference_number: [''],
      reference_id: [''],
      created_date: [new Date(), [Validators.required]],
      status: ['Open', [Validators.required]],
      description: ['', [Validators.required]],
      createrId: [''],
      createrName: [''],
      createrDesignation: [''],
      category: ['', [Validators.required]],
      question_category: ['', [Validators.required]],
      surveytype: ['', [Validators.required]],
      title: ['', [Validators.required]],
      purpose: ['', [Validators.required]],
      business_unit: [null],
      freequency: [''],
      participant_count: ['0', [Validators.required]],
      end_date: [],
      // end_date: ['', [Validators.required]],
      start_date: [],
      // start_date: ['', [Validators.required]],
      language: [''],
      // language: ['', [Validators.required]],
      disclaimer: ['', [Validators.required]],
      // anonymus: [false],
      before_5_miniutes: [false],
      before_10_miniutes: [false],
      before_15_miniutes: [false],
      before_30_miniutes: [false],
      before_1_hour: [false],
      before_2_hour: [false],
      before_1_day: [false],
      before_2_days: [false],
      participants: [''],
      public_survey_notification: [null],
      private_survey_notification: [null],
      questions: ['', [Validators.required]],

    });
    let currentUrl = window.location.href;
    this.surveyLink = currentUrl.replace('/apps/', '/').replace('/view-survey/', '/public-survey/');
    this.Form.get('participant_count')?.valueChanges.subscribe(value => {
      if (this.participants.length <= value && value != null && this.participants.length > 0) {
        this.sub = true
        this.Form.controls['participants'].setErrors(null);
      }
      else if (this.participants.length > value) {
        this.sub = false
        const statusText = "participant count exceeded...!";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    });

    this.pts = this.participants.length == 0 ? "Patricipant" : "Patricipants"

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.orgName = result.data.attributes.client_name
        const status = result.data.attributes.modules.satisfaction_survey
        this.unitSpecific = result.data.attributes.business_unit_specific
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
        this.userID = result.id
        this.userName = result.username
        this.contactEmail = result.email
        const status = result.survey_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['createrId'].setValue(result.profile.id)
          this.Form.controls['createrName'].setValue(result.profile.first_name + ' ' + result.profile.last_name)
          this.Form.controls['createrDesignation'].setValue(result.profile.designation)
          this.get_dropdown_values()
          //this.get_observations()

          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results

            }
          } else {
            this.get_divisions();
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  observation(data: any) {
    this.Form.controls['observation'].reset()
    this.observations = []
    const observation = this.observationData.filter(function (elem) {
      return (elem.attributes.dropdown_value?.data?.attributes?.Value === data.value)
    })
    this.observations = observation
  }

  get_dropdown_values() {
    const module = "Satisfaction Survey"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValue = result.data
        // const category = result.data.filter(function (elem: any) {
        //   return (elem.attributes.Category === "Survey Category")
        // })
        // this.categories = category
        this.getSurveyCategories()
      },
      error: (err: any) => { },
      complete: () => {
        this.get_surveytypes()
        this.get_languages()
        this.getEmployee()
        this.getQuestion()
        this.questionCategory()
        this.getSurveyPurposes()        
      }
    })
  }
  getSurveyCategories() {
    this.satisfactionService.get_survey_categories().subscribe({
      next: (result: any) => {
        this.categories = result.data
      },
      error: (err: any) => { },
      complete: () => {

      }
    })
  }
  questionCategory() {
    this.satisfactionService.get_survey_question_categories().subscribe({
      next: (result: any) => {
        this.allQuestioncategories = result.data
      },
      error: (err: any) => { },
      complete: () => {

      }
    })
  }
  getSurveyPurposes() {
    this.satisfactionService.get_survey_purposes().subscribe({
      next: (result: any) => {
        this.surveyPurposes = result.data
      },
      error: (err: any) => { },
      complete: () => {

      }
    })
  }
  get_surveytypes() {
    this.surveytypes = []
    const surveycategorie = this.dropDownValue.filter(function (elem) {
      return (elem.attributes.Category === "Survey Type")
    })
    this.surveytypes = surveycategorie
  }

  get_languages() {
    // this.languages = []
    // const lang = this.dropDownValue.filter(function (elem) {
    //   return (elem.attributes.Category === "Language")
    // })
    // this.languages = lang
    this.satisfactionService.get_languages().subscribe({
      next: (result: any) => {

        this.languages = result
        //this.languages.splice(this.languages.findIndex((existing) => existing.name === "English (en)"), 1);
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {

      }
    })
  }

  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
        }));

        this.divisions = newArray;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.getQuestion()
      }
    })
  }

  BusinessUnit(event: any) {
    this.Form.controls['business_unit'].setValue(event.value.id)
  }

  onSurveytypeSelect(event: any) {
    this.tab = event.value == "Private" ? true : false;
    this.switch = event.value == "Public" ? true : false;
    this.sub = event.value == "Public" ? true : false;
    if (this.participants.length == this.Form.value.participant_count && this.Form.value.participant_count != null && this.participants.length > 0) {
      this.sub = true
      this.Form.controls['participants'].setErrors(null);
    }
    else if (this.participants.length > this.Form.value.participant_count) {
      this.sub = false
      const statusText = "participant count exceeded...!";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    // if (this.privatesurvey == false) {
    //   this.Form.controls['anonymus'].setValue(true)
    // }
    // else {
    //   this.Form.controls['anonymus'].setValue(false)
    // }
  }

  stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }


  getQuestion() {
    this.Questions = [];
    this.satisfactionService.get_questions_for_survey().subscribe({
      next: (result: any) => {
        this.Questions = result.data
          .filter((item: any) => item.attributes.question.trim() !== "")
          .map((item: any) => {
            return {
              ...item,
              attributes: {
                ...item.attributes,
                question: item.attributes.question
              }
            };
          });
      },
      error: (err: any) => { },
      complete: () => { }
    });

  }

  getTruncatedQuestion(question: string): string {
    if (question.length > 65) {
      return question.slice(0, 65) + '...';
    } else {
      return question;
    }
  }


  // generateAIDescription() {
  //   this.Form.controls['description'].enable()
  //   const title = this.Form.value.title
  //   if (title) {
  //     document.getElementById('error-text')?.classList.add("hide");
  //     const stringWithoutPTags = title.replace(/<\/?p>/g, '');
  //     this.DescriptionchatGPT(stringWithoutPTags)
  //   } else {
  //     document.getElementById('error-text')?.classList.remove("hide");
  //   }
  // }

  // async DescriptionchatGPT(stringWithoutPTags: any) {
  //   document.getElementById('ai-loader')?.classList.remove("hide");
  //   document.getElementById('ai-suggest')?.classList.add("hide");
  //   const configuration = new Configuration({
  //     apiKey: environment.OPENAI_API_KEY,
  //   });
  //   const openai = new OpenAIApi(configuration);
  //   const message = stringWithoutPTags +
  //     " Please generate description for this Survey Title Which is using for a Satisfaction Survey. " 
  //   let requestData = {
  //     model: "gpt-3.5-turbo",
  //     format: "html",
  //     messages: [
  //       // { role: "user", content: message }

  //       // { role: "system", content: "You are an expert in business communication, skilled at crafting formal and engaging emails." },
  //       { role: "user", content: message }
  //     ],
  //   };
  //   let apiResponse = await openai.createChatCompletion(requestData);
  //   const completion_tokens = apiResponse.data.usage.completion_tokens
  //   const prompt_tokens = apiResponse.data.usage.prompt_tokens
  //   const total_tokens = apiResponse.data.usage.total_tokens
  //   this.control_event_open_ai(completion_tokens, prompt_tokens, total_tokens)
  //   this.Form.controls['description'].enable()
  //   this.Form.controls['description'].setValue(apiResponse.data.choices[0].message.content)
  //   document.getElementById('ai-loader')?.classList.add("hide");
  //   document.getElementById('ai-suggest')?.classList.remove("hide");
  // }

  // control_event_open_ai(completion_tokens: any, prompt_tokens: any, total_tokens: any) {
  //   this.satisfactionService.generateAIDescription(this.Form.value, completion_tokens, prompt_tokens, total_tokens,this.userName).subscribe({
  //     next: (result: any) => { },
  //     error: (err: any) => { },
  //     complete: () => {

  //     }
  //   })

  // }

  // generateAIDisclaimer() {
  //   this.Form.controls['disclaimer'].enable()
  //   const title = this.Form.value.title
  //   if (title) {
  //     document.getElementById('disclaimer-error-text')?.classList.add("hide");
  //     const stringWithoutPTags = title.replace(/<\/?p>/g, '');
  //     this.disclaimerchatGPT(stringWithoutPTags)
  //   } else {
  //     document.getElementById('disclaimer-error-text')?.classList.remove("hide");
  //   }
  // }


  // async disclaimerchatGPT(stringWithoutPTags: any) {
  //   document.getElementById('disclaimer-ai-loader')?.classList.remove("hide");
  //   document.getElementById('disclamer-ai-suggest')?.classList.add("hide");
  //   const configuration = new Configuration({
  //     apiKey: environment.OPENAI_API_KEY,
  //   });
  //   const openai = new OpenAIApi(configuration);
  //   const message = stringWithoutPTags +
  //     " Please generate disclaimer for this Survey Title Which is using for a Satisfaction Survey. " 
  //   let requestData = {
  //     model: "gpt-3.5-turbo",
  //     format: "html",
  //     messages: [
  //       // { role: "user", content: message }

  //       // { role: "system", content: "You are an expert in business communication, skilled at crafting formal and engaging emails." },
  //       { role: "user", content: message }
  //     ],
  //   };
  //   let apiResponse = await openai.createChatCompletion(requestData);
  //   const completion_tokens = apiResponse.data.usage.completion_tokens
  //   const prompt_tokens = apiResponse.data.usage.prompt_tokens
  //   const total_tokens = apiResponse.data.usage.total_tokens
  //   this.disclaimer_control_event_open_ai(completion_tokens, prompt_tokens, total_tokens)
  //   this.Form.controls['disclaimer'].enable()

  //   this.Form.controls['disclaimer'].setValue(apiResponse.data.choices[0].message.content)
  //   document.getElementById('disclaimer-ai-loader')?.classList.add("hide");
  //   document.getElementById('disclamer-ai-suggest')?.classList.remove("hide");
  // }

  // disclaimer_control_event_open_ai(completion_tokens: any, prompt_tokens: any, total_tokens: any) {
  //   this.satisfactionService.generateAIDisclaimer(this.Form.value, completion_tokens, prompt_tokens, total_tokens,this.userName).subscribe({
  //     next: (result: any) => { },
  //     error: (err: any) => { },
  //     complete: () => {

  //     }
  //   })

  // }
  addQuestions() {
    // this.questions = []
    if (this.Form.value.category != "") {
      if (this.Form.value.question_category != "") {        
        this.dialog.open(AddQuestionComponent, {
          data: {
            questions: this.questions,
            surveycategory: this.Form.value.category,
            questioncategory: this.Form.value.question_category,
          }
        }).afterClosed().subscribe((data) => {
          if (data) {

            const newQuestions = data.Question.split('$^');
            const existingQuestions = this.questions.filter(q => newQuestions.includes(q.Question));

            if (existingQuestions.length > 0) {
              const statusText = newQuestions.length == 1 ? "Question already selected." : "Some of the questions are already selected.";
              this._snackBar.open(statusText, 'OK', {
                duration: 3000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });

              existingQuestions.forEach(existingQuestion => {
                const index = newQuestions.indexOf(existingQuestion.Question);
                if (index !== -1) {
                  newQuestions.splice(index, 1);
                }
              });
            }

            newQuestions.forEach((question: any, index: number) => {

              let questionid = this.Questions.find((emp: any) => emp.attributes.question === question);

              const newData = {
                id: data.id,
                org_id: data.org_id,
                Question: question.trim(),
                QuestionId: questionid.id,
                QuestionType: questionid.attributes.response_options,
              };
              this.questions.push(newData);
            });
            if (this.questions.length > 0) {
              this.Form.controls['questions'].setErrors(null);
            } else {
              this.Form.controls['questions'].setValidators(Validators.required);
            }

          }
        });
      } else {
        const statusText = "Please select a Question Category...!";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    }
    else {
      const statusText = "Please select a Survey Category...!";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }

  }

  addParticipants() {
    //this.participants = []
    this.dialog.open(AddParticipantComponent, {
      data: this.participants
    }).afterClosed().subscribe((data) => {
      if (data) {
        const newEmployee = data.Employee.split(',');
        newEmployee.forEach((Employee: any) => {
          let Email = "";
          let user_id = "";

          const employee = this.Employees.find((emp: any) => {
            const fullName = `${emp.attributes.first_name} ${emp.attributes.last_name}`;
            return fullName === Employee;
          });
          if (employee) {
            Email = employee.attributes.email;
            user_id = employee.id;
          }
          const newData = {
            id: data.id,
            org_id: data.org_id,
            Employee: Employee.trim(),
            Email: Email,
            user_id: user_id,
            addparticipants: data.addparticipants,
            created_user: this.userID
          };
          this.participants.push(newData);
        });

        this.pts = this.participants.length < 2 ? "Patricipant" : "Patricipants"
        this.Form.controls['participant_count'].setValue(this.participants.length)

        if (this.participants.length == this.Form.value.participant_count && this.Form.value.participant_count != null && this.participants.length > 0) {
          this.sub = true
          this.Form.controls['participants'].setErrors(null);
        }
        else if (this.participants.length > this.Form.value.participant_count) {
          this.sub = false
          const statusText = "participant count exceeded...!";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
        //this.participants.push(data)
        //
        // this.Form.controls['language'].setValue(data.language)
        // this.Form.controls['translated_question'].setValue(data.question)

      }
    })
  }

  getEmployee() {
    this.Employees = []
    this.satisfactionService.get_users().subscribe({
      next: (result: any) => {

        this.Employees = result.data
      },
      error: (err: any) => { },
      complete: () => {
      }
    })
  }

  LanguageChange(event: any) {

    this.Form.controls['language'].setValue(event.value.toString())

  }

  //get user profiles


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

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  submit() {
    const uuid = uuidv4()
    const uuid2 = uuid.slice(0, 6)
    this.Form.controls['status'].setValue('Scheduled')
    this.Form.controls['reference_id'].setValue(uuid2)
    let currentUrl = window.location.href;
    if (this.Form.value.surveytype === 'Public') {
      this.surveyLink = currentUrl
        .replace('/apps/', '/')
        .replace('/create-survey', `/public-survey/${this.Form.value.reference_id}`);
    }else{
      this.surveyLink = currentUrl
      .replace('/create-survey', `/private-survey/${this.Form.value.reference_id}`);
    }
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.Form.value.surveytype === 'Public') {
          this.Form.controls['public_survey_notification'].setValue(false)
        }else if(this.Form.value.surveytype === 'Private'){
          this.Form.controls['private_survey_notification'].setValue(false)

        }
        this.showProgressPopup();
        this.create_reference_number();
      }
    });
  }

  saveAsDraft() {
    this.draft = true
    const uuid = uuidv4()
    const uuid2 = uuid.slice(0, 6)
    this.Form.controls['status'].setValue('Draft')
    this.Form.controls['reference_id'].setValue(uuid2)
    this.showProgressPopup();
    this.create_reference_number();
    let currentUrl = window.location.href;
    this.surveyLink = currentUrl
      .replace('/apps/', '/')
      .replace('/create-survey', `/public-survey/${this.Form.value.reference_id}`);
  }



  create_reference_number() {
    this.satisfactionService.get_surveys().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const newReference = 'SUR-' + newCount
        this.Form.controls['reference_number'].setValue(newReference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        if (Array.isArray(this.Form.value.category)) {
          this.Form.value.category = this.Form.value.category.join(', ');
        }
        if (Array.isArray(this.Form.value.question_category)) {
          this.Form.value.question_category = this.Form.value.question_category.join(', ');
        }
        this.create_satisfaction_survey()
      }
    })
  }

  create_satisfaction_survey() {

    this.Form.value.participant_count = this.Form.value.participant_count == "" ? 0 : this.Form.value.participant_count;
    this.satisfactionService.create_satisfaction_survey(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id);
        this.uploadQRCode()
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"]);
      },
      complete: () => {
        this.create_participants();
      }
    });
  }


  create_questions() {
    this.qcount = 0;
    if (this.questions.length > 0) {
      // this.questions.forEach(elem => {
      //   this.satisfactionService.create_survey_questions(elem.QuestionId, this.Form.value.id).subscribe({
      //     next: (result: any) => {
      //       //this.qcount = this.qcount + 1
      //     },
      //     error: (err: any) => {
      //       this.router.navigate(["/error/internal"])
      //     },
      //     complete: () => {
      //       //this.qcount = this.qcount + 1
      //     }
      //   })
      // })
      const quesIds = this.questions.map(question => question.QuestionId);
      this.satisfactionService.create_survey_questions(quesIds, this.Form.value.id).subscribe({
        next: (result: any) => {

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          // if (this.draft == true) {
          //   const statusText = "Satisfaction Survey saved";
          //   this._snackBar.open(statusText, 'OK', {
          //     horizontalPosition: this.horizontalPosition,
          //     verticalPosition: this.verticalPosition,
          //   });
          //   Swal.close();
          //   this.router.navigate(["/apps/satisfaction-survey/modify-survey/" + this.Form.value.reference_number])
          // }
          // else {
          //   Swal.fire({
          //     title: 'Satisfaction Survey Reported',
          //     imageUrl: "assets/images/reported.gif",
          //     imageWidth: 250,
          //     text: "You have successfully created a Satisfaction Survey.",
          //     showCancelButton: false,

          //   })
          //   this.router.navigate(["/apps/satisfaction-survey/survey-history"])
          // }
        }

      })
    }
    //if (this.qcount == this.questions.length) {
    if (this.draft == true) {
      const statusText = "Satisfaction Survey saved";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      Swal.close();
      this.router.navigate(["/apps/satisfaction-survey/modify-survey/" + this.Form.value.reference_id])
    }
    else {
      Swal.fire({
        title: 'Satisfaction Survey Reported',
        imageUrl: "assets/images/reported.gif",
        imageWidth: 250,
        text: "You have successfully created a Satisfaction Survey.",
        showCancelButton: false,

      })
      this.router.navigate(["/apps/satisfaction-survey/survey-history"])
    }

    //}


  }

  create_participants() {
    if (this.participants.length > 0 && this.Form.value.surveytype == "Private") {
      this.participants.forEach(elem => {
        this.satisfactionService.create_survey_participants(elem, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {

          }
        })
      })
      this.create_questions()
    } else {
      this.create_questions()
    }
  }


  get_unit_specific_assignee() {

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


  get_question() {
    this.satisfactionService.get_questions().subscribe({
      next: (result: any) => {

        const data = result.data.map((elem: any) => elem.attributes);
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    })
  }

  deleteParticipants(data: any) {
    this.participants.splice(this.participants.findIndex((existing) => existing.Employee === data.Employee && existing.Email === data.Email), 1);

    this.pts = this.participants.length < 2 ? "Patricipant" : "Patricipants"
    this.Form.controls['participant_count'].setValue(this.participants.length)

    if (this.participants.length == 0) {
      this.sub = false
      const statusText = "Please add atleast one participant...!";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    else if (this.participants.length == this.Form.value.participant_count && this.Form.value.participant_count != null && this.participants.length > 0) {
      this.sub = true
      this.Form.controls['participants'].setErrors(null);
    }
    else if (this.participants.length > this.Form.value.participant_count) {
      this.sub = false
      const statusText = "participant count exceeded...!";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }

  }
  updateParticipants(data: any) {
    const dialogData = {
      mode: "update",
      data: data
    };
    this.dialog.open(ViewParticipantComponent, {
      data: dialogData
    }).afterClosed().subscribe((updatedData) => {
      if (updatedData) {
        this.participants.forEach(participant => {
          if (participant.Employee === updatedData.Employee) {
            participant.addparticipants = updatedData.addparticipants;
          }
        });
      }
    });
  }

  viewParticipants(data: any) {
    const dialogData = {
      mode: "view",
      data: data
    };
    this.dialog.open(ViewParticipantComponent, {
      data: dialogData
    }).afterClosed().subscribe((updatedData) => {
      if (updatedData) {
        this.participants.forEach(participant => {
          if (participant.Employee === updatedData.Employee) {
            participant.addparticipants = updatedData.addparticipants;
          }
        });
      }
    });
  }

  deleteQuestions(data: any) {
    this.questions.splice(this.questions.findIndex((existing) => existing.Question === data.Question), 1);
  }
  viewQuestions(data: any) {
    this.dialog.open(ViewQuestionComponentNew, {
      data: data
    }).afterClosed().subscribe((data) => {
      // if (data) {
      //   var array = data.split(',');
      //   this.Selectedquestions.setValue(array)

      //   this.questions.splice(this.questions.findIndex((existing) => existing.id === data.id), 1);
      //   this.questions.push(data)
      // }
    })
  }
  new_survey_cat() {
    this.dialog.open(SurveyCategoryComponent, { width: '500px', data: { mode: 'create' } }).afterClosed().subscribe(data => {
      if (data) {
        this.satisfactionService.create_survey_category(data).subscribe({
          next: (result: any) => {
            this.categories = []
            this.getSurveyCategories()
            this.Form.controls['category'].setValue(result.data.attributes.value);
          },
          error: (err: any) => { },
          complete: () => {

          }
        })
      } else {

      }
    })
  }

  editSurveycat(data: any) {
    this.dialog.open(SurveyCategoryComponent, { width: '500px', data: { data: data, mode: 'modify' }, }).afterClosed().subscribe(datas => {
      if (datas) {
        this.satisfactionService.update_survey_category(datas, data.id).subscribe({
          next: (result: any) => {
            this.categories = []
            this.getSurveyCategories()
          },
          error: (err: any) => { },
          complete: () => {

          }
        })
      } else {

      }
    })
  }

  deleteSurveycat(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the Survey Category.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.satisfactionService.delete_survey_category(data.id).subscribe({
          next: (result: any) => {
            this.categories = []
            this.getSurveyCategories()
            this.questionCategory()
          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
    })
  }
  new_survey_question_cat() {
    this.dialog.open(SurveyQuestionCategoryComponent, {
      width: '600px',
      data: { mode: 'create', filter: this.Form.value.category }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.satisfactionService.create_survey_question_category(data).pipe(
          switchMap((result: any) => {
            return this.satisfactionService.get_survey_question_categories().pipe(
              map((res: any) => ({ res, newValue: result.data.attributes.value }))
            );
          })
        ).subscribe(({ res, newValue }) => {
          this.allQuestioncategories = res.data;
          this.onSurveyCatChange({ value: this.Form.value.category }); // Ensure latest filter is applied
          this.Form.controls['question_category'].setValue(newValue);
        });
      }
    });
  }
  editSurveyQuestioncat(data: any) {
    this.dialog.open(SurveyQuestionCategoryComponent, {
      width: '600px',
      data: { data: data, mode: 'modify' }
    }).afterClosed().subscribe(datas => {
      if (datas) {
        this.satisfactionService.update_survey_question_category(datas, data.id).pipe(
          switchMap(() => this.satisfactionService.get_survey_question_categories())
        ).subscribe((res: any) => {
          this.allQuestioncategories = res.data;
          this.onSurveyCatChange({ value: this.Form.value.category });
        });
      }
    });
  }
  deleteSurveyQuestioncat(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the Survey Question Category.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.satisfactionService.delete_survey_question_category(data.id).pipe(
          switchMap(() => this.satisfactionService.get_survey_question_categories())
        ).subscribe((res: any) => {
          this.allQuestioncategories = res.data;
          this.onSurveyCatChange({ value: this.Form.value.category });
        });
      }
    });
  }
  new_survey_purpose() {
    this.dialog.open(SurveyPurposeComponent, { width: '500px', data: { mode: 'create' } }).afterClosed().subscribe(data => {
      if (data) {
        this.satisfactionService.create_survey_purpose(data).subscribe({
          next: (result: any) => {
            this.surveyPurposes = []
            this.getSurveyPurposes()
            this.Form.controls['purpose'].setValue(result.data.attributes.value);
          },
          error: (err: any) => { },
          complete: () => {

          }
        })
      } else {

      }
    })
  }

  editSurveyPurpose(data: any) {
    this.dialog.open(SurveyPurposeComponent, { width: '500px', data: { data: data, mode: 'modify' }, }).afterClosed().subscribe(datas => {
      if (datas) {
        this.satisfactionService.update_survey_purpose(datas, data.id).subscribe({
          next: (result: any) => {
            this.surveyPurposes = []
            this.getSurveyPurposes()
          },
          error: (err: any) => { },
          complete: () => {

          }
        })
      } else {

      }
    })
  }

  deleteSurveyPurpose(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the Survey Purpose.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.satisfactionService.delete_survey_purpose(data.id).subscribe({
          next: (result: any) => {
            this.categories = []
            this.getSurveyPurposes()
          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
    })
  }
  // new_survey_purpose() {
  //   this.dialog.open(SurveyPurposeComponent, {width: '600px', 
  //     data: { mode: 'create', filter: this.Form.value.category }
  //   }).afterClosed().subscribe(data => {
  //     if (data) {
  //       this.satisfactionService.create_survey_question_category(data).pipe(
  //         switchMap((result: any) => {
  //           return this.satisfactionService.get_survey_question_categories().pipe(
  //             map((res: any) => ({ res, newValue: result.data.attributes.value }))
  //           );
  //         })
  //       ).subscribe(({ res, newValue }) => {
  //         this.allQuestioncategories = res.data;
  //         this.onSurveyCatChange({ value: this.Form.value.category }); // Ensure latest filter is applied
  //         this.Form.controls['question_category'].setValue(newValue);
  //       });
  //     }
  //   });
  // }
  // editSurveyPurpose(data: any) {
  //   this.dialog.open(SurveyPurposeComponent, {width: '600px', 
  //     data: { data: data, mode: 'modify' }
  //   }).afterClosed().subscribe(datas => {
  //     if (datas) {
  //       this.satisfactionService.update_survey_question_category(datas, data.id).subscribe((res: any) => {
  //         this.allQuestioncategories = res.data;
  //         this.onSurveyCatChange({ value: this.Form.value.category });
  //       });
  //     }
  //   });
  // }
  // deleteSurveyPurpose(data: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     imageUrl: "assets/images/confirm-1.gif",
  //     imageWidth: 250,
  //     text: "Please confirm once again that you intend to delete the Survey Question Category.",
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, proceed!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.satisfactionService.delete_survey_question_category(data.id).pipe(
  //         switchMap(() => this.satisfactionService.get_survey_question_categories())
  //       ).subscribe((res: any) => {
  //         this.allQuestioncategories = res.data;
  //         this.onSurveyCatChange({ value: this.Form.value.category });
  //       });
  //     }
  //   });
  // }
  onSurveyCatChange(event: any) {
    const selectedValuesArray = event.value;
    this.Form.controls['category'].setValue(selectedValuesArray);
    this.filteredquestioncategories = this.allQuestioncategories.filter(elem =>
      selectedValuesArray.includes(elem.attributes.filter)
    );
  }
  suggestDescription() {
    const title = this.Form.value.title;
    const category = this.Form.value.category;
    const purpose = this.Form.value.purpose;
    const questions = this.questions || [];
    const startDate = this.surveyDateRange.value.start_date;
    const endDate = this.surveyDateRange.value.end_date;
  
    // Only validate required fields, skip startDate & endDate
    if (!title || !category || !purpose || questions.length === 0) {
      this.showSnackbar("Please Select Purpose, Category, Title, and Add Questions.");
      return;
    }
  
    const questionTypesMap = new Map<string, number>();
    questions.forEach(q => {
      const type = q.QuestionType || "Unknown Type";
      questionTypesMap.set(type, (questionTypesMap.get(type) || 0) + 1);
    });
  
    const formattedQuestionTypes = Array.from(questionTypesMap)
      .map(([type, count]) => `<b>${count} ${type}</b>`)
      .join(", ");
  
    const numQuestions = questions.length;
    let duration = "";
    if (numQuestions >= 1 && numQuestions <= 5) duration = "<b>2-5 minutes</b>";
    else if (numQuestions >= 6 && numQuestions <= 15) duration = "<b>5-10 minutes</b>";
    else if (numQuestions >= 16 && numQuestions <= 30) duration = "<b>10-20 minutes</b>";
    else if (numQuestions > 30) duration = "<b>20+ minutes</b>";
  
    let durationLine = "";
    if (duration) {
      durationLine = ` and will take approximately ${duration} to complete.`;
    }
  
    let dateLine = "";
    if (startDate && endDate) {
      const formattedStartDate = new Date(startDate).toLocaleDateString();
      const formattedEndDate = new Date(endDate).toLocaleDateString();
      dateLine = `<p>It will remain open from <b>${formattedStartDate}</b> to <b>${formattedEndDate}</b>, and your feedback is valuable for future improvements.</p>`;
    }
  
    const descriptionText = `
      <p>We are conducting the <b>${title}</b> to assess <b>${category}</b>, helping us enhance <b>${purpose}</b>.</p>
      <p>The survey consists of <b>${numQuestions}</b> Questions :- <br> 
      ${formattedQuestionTypes} questions${durationLine}</p>
      ${dateLine}
      <p>All responses will remain confidential and used solely for analysis. If you have any questions, please contact <b>${this.contactEmail}</b>.</p>
      <br>
      <p>Thank you for your participation!</p>`;
  
    this.Form.controls['description']?.setValue(descriptionText);
  }
  


  suggestDisclaimer() {
    const purpose = this.Form.value.purpose;
    if (!purpose) {
      this.showSnackbar("Please Select Purpose.");
      return;
    }

    const disclaimerText = `
    <p><b>Disclaimer:</b></p>
    <p>Participation in this survey is voluntary, and responses will be kept confidential. The collected information will be used only for <b>${purpose}</b> and will not be shared with third parties.</p>
    <p>No personally identifiable information is required unless voluntarily provided. Your responses will not impact your relationship with <b>${this.orgName}</b> in any way.</p>
    <p>By proceeding, you agree to the terms outlined above.</p> 
    <br>
    <p>For any concerns, contact <b>${this.contactEmail}</b>.</p>`;

    this.Form.controls['disclaimer']?.setValue(disclaimerText);
  }


  showSnackbar(message: string) {
    this._snackBar.open(message, "Close", {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ["error-snackbar"]
    });
  }
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
  uploadQRCode() {
    const qrCodeUrl = this.sanitizer.sanitize(4, this.qrCodeDownloadLink);

    if (!qrCodeUrl) {
      console.error("Invalid QR Code URL.");
      return;
    }

    this.convertImageToBlob(qrCodeUrl).then((blob) => {
      if (!blob) {
        console.error("Failed to convert QR Code to Blob.");
        return;
      }

      const file = new File([blob], "qrcode.png", { type: "image/png" });

      this.QRFormData.delete('files');
      const referenceNumber = this.Form.value.reference_number;
      this.QRFormData.append('files', file, `${referenceNumber}.png`);

      this.generalService.upload(this.QRFormData).subscribe({
        next: (result: any) => {

          if (result?.length > 0) {
            const data = {
              qr_name: result[0].hash,
              format: 'png',
              satisfaction_survey: this.Form.value.id,
              id: result[0].id,
            };
            this.satisfactionService.create_survey_qr(data).subscribe({
              next: (res: any) => { },
              error: (err: any) => console.error("Error saving QR:", err),
            });
          }
        },
        error: (err: any) => console.error("Upload Error:", err),
      });
    });
  }

  convertImageToBlob(imageUrl: string): Promise<Blob | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("Canvas context is not available.");
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => resolve(blob), "image/png");
      };

      img.onerror = () => {
        console.error("Error loading QR Code image.");
        resolve(null);
      };
    });
  }
}
