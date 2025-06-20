import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AddQuestionComponent } from '../create-survey/add-question/add-question.component';
import { AddParticipantComponent } from '../create-survey/add-participant/add-participant.component';
import { ViewParticipantComponent } from '../create-survey/view-participant/view-participant.component';
import { ViewQuestionComponentNew } from '../create-survey/view-question/view-question.component';
import { map, switchMap } from 'rxjs';
import { SurveyQuestionCategoryComponent } from '../survey-question-category/survey-question-category.component';
import { SurveyCategoryComponent } from '../survey-category/survey-category.component';
import { SurveyPurposeComponent } from '../survey-purpose/survey-purpose.component';

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

  surveyDateRange = new FormGroup({
    start_date: new FormControl(),
    end_date: new FormControl()
  });
  business_unit = new FormControl(null, [Validators.required]);
  Form: FormGroup;
  isOptionDisabled: boolean = false;
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5;
  peopleList: any[] = [];
  orgID: string;
  unitSpecific: any
  userDivision: any
  divisionUuids: any[] = []
  corporateUser: any
  dropDownValue: any[] = []
  divisions: any[] = []
  categories: any[] = []
  surveytypes: any[] = []
  observationData: any[] = []
  observations: any[] = []
  surveyPurposes: any[] = []
  isLoading = true;
  tab = false;
  sub = false;
  draft: boolean
  draftstatus: boolean
  switch = false;
  Questions: any[] = []
  languages: any[] = []
  participants: any[] = []
  userID: Number
  newparticipants: any[] = []
  Employees: any[] = []
  questions: any[] = []
  QuestionIds: any = ""
  Selectedquestions = new FormControl(null, [Validators.required]);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  language = new FormControl(null);
  allQuestioncategories: any[] = []
  filteredquestioncategories: any[] = []
  orgName: any
  contactEmail: any

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
  pts: string;

  constructor(
    private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private satisfactionService: SatisfactionService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      reference_number: [''],
      created_date: [new Date(), [Validators.required]],
      status: ['Open', [Validators.required]],
      description: ['', [Validators.required]],
      createrId: [''],
      createrName: [''],
      createrDesignation: [''],
      category: ['', [Validators.required]],
      question_category: ['', [Validators.required]],
      purpose: ['', [Validators.required]],
      surveytype: [{ value: ''}, [Validators.required]],
      title: ['', [Validators.required]],
      business_unit: [null],
      private_survey_notification: [null],
      public_survey_notification: [null],
      freequency: [''],
      participant_count: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      language: [''],
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
      questions: ['', [Validators.required]],

    });

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
        this.contactEmail = result.email
        const status = result.survey_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          // this.Form.controls['createrId'].setValue(result.profile.id)
          // this.Form.controls['createrName'].setValue(result.profile.first_name + ' ' + result.profile.last_name)
          // this.Form.controls['createrDesignation'].setValue(result.profile.designation)

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
                this.divisionUuids.push(elem.division_uuid)
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
      complete: () => {
        this.get_dropdown_values()
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
        this.questionCategory()
      },
      error: (err: any) => { },
      complete: () => {
        // this.get_surveytypes()
        this.get_languages()
        this.getEmployee()
        this.getQuestion()
        this.get_surveys_details()
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
      complete: () => {}
    })
  }
  async get_surveys_details() {

    const reference = this.route.snapshot.paramMap.get('id');
    this.satisfactionService.get_survey_details(reference).subscribe({
      next: async (result: any) => {

        //         const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        //         let matchFound = true;
        //         if (this.divisionUuids && this.divisionUuids.length > 0) {
        //           matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        //         }
        // debugger
        //         if ((matchFound || matchFound !== false)) {
        //commented beacuse buisiness unit hidden from survey

        this.Form.controls['id'].setValue(result.data[0].id)
        this.business_unit.setValue(result.data[0].attributes.business_unit.data?.attributes.division_name)
        this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
        this.Form.controls['description'].setValue(result.data[0].attributes.survey_description)
        const selectedCategories = result.data[0].attributes.survey_category?.split(', ') || [];
        const selectedQuestCategories = result.data[0].attributes.question_category?.split(', ') || [];
        
        this.filteredquestioncategories = this.allQuestioncategories.filter(elem =>
          selectedCategories.includes(elem.attributes.filter)
        );
        this.Form.controls['category'].setValue(selectedCategories)
        this.Form.controls['question_category'].setValue(selectedQuestCategories)
        this.Form.controls['surveytype'].setValue(result.data[0].attributes.survey_type)
        this.Form.controls['purpose'].setValue(result.data[0].attributes.purpose)
        this.tab = result.data[0].attributes.survey_type == "Private" ? true : false;
        this.switch = result.data[0].attributes.survey_type == "Public" ? true : false;
        this.Form.controls['title'].setValue(result.data[0].attributes.survey_title)
        this.Form.controls['participant_count'].setValue(result.data[0].attributes.participant_count)
        this.Form.controls['freequency'].setValue(result.data[0].attributes.frequency)
        this.Form.controls['status'].setValue(result.data[0].attributes.status)
        this.draft = result.data[0].attributes.status == "Draft" ? true : false
        this.draftstatus = result.data[0].attributes.status == "Draft" ? true : false
        this.Form.controls['end_date'].setValue(result.data[0].attributes.survey_end_date)
        this.Form.controls['start_date'].setValue(result.data[0].attributes.survey_start_date)
        this.Form.controls['created_date'].setValue(result.data[0].attributes.createdAt)
        if (result.data[0].attributes.survey_start_date != null) {
          this.surveyDateRange.controls['start_date'].setValue(new Date(result.data[0].attributes.survey_start_date))
          this.surveyDateRange.controls['end_date'].setValue(new Date(result.data[0].attributes.survey_end_date))
        }
        this.Form.controls['language'].setValue(result.data[0].attributes.language)
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.Form.controls['disclaimer'].setValue(result.data[0].attributes.disclaimer)
        // this.Form.controls['anonymus'].setValue(result.data[0].attributes.anonimity_option)
        this.Form.controls['before_5_miniutes'].setValue(result.data[0].attributes.before_5_miniutes)
        this.Form.controls['before_10_miniutes'].setValue(result.data[0].attributes.before_10_miniutes)
        this.Form.controls['before_15_miniutes'].setValue(result.data[0].attributes.before_15_miniutes)
        this.Form.controls['before_30_miniutes'].setValue(result.data[0].attributes.before_30_miniutes)
        this.Form.controls['before_1_hour'].setValue(result.data[0].attributes.before_1_hour)
        this.Form.controls['before_2_hour'].setValue(result.data[0].attributes.before_2_hour)
        this.Form.controls['before_1_day'].setValue(result.data[0].attributes.before_1_day)
        this.Form.controls['before_2_days'].setValue(result.data[0].attributes.before_2_days)
        this.Form.controls['createrId'].setValue(result.data[0].attributes.created_user.data.id)
        this.Form.controls['createrName'].setValue(result.data[0].attributes.created_user.data.attributes.first_name + ' ' + result.data[0].attributes.created_user.data.attributes.last_name)
        this.Form.controls['createrDesignation'].setValue(result.data[0].attributes.created_user.data.attributes.designation)

        if (result.data[0].attributes.language) {
          var array = result.data[0].attributes.language.split(',');
          this.language.setValue(array)
        }
        this.participants = []
        const con = result.data[0].attributes.survey_participants.data.map((participant: any) => {
          const data = {
            id: participant.id,
            org_id: "",
            Employee: participant.attributes.participant_name.trim(),
            Email: participant.attributes.participant_email,
            user_id: participant.attributes.user_id,
            addparticipants: participant.attributes.add_participant,
            created_user: this.userID
          };
          return data;
        });
        this.participants.push(...con);

        this.questions = []
        const consta = result.data[0].attributes.survey_questions.data.map((question: any) => {
          const removeHtmlTags = (html: string) => {
            return html.replace(/<[^>]*>?/gm, '');
          };
          const data = {
            id: result.data[0].id,
            org_id: "",
            Question: question.attributes.question,
            QuestionId: question.id,
            QuestionType: question.attributes.response_options,
          };
          return data;
        });

        this.questions.push(...consta);

        this.pts = this.participants.length < 2 ? "Patricipant" : "Patricipants"
        this.Form.controls['participant_count'].setValue(this.participants.length)

        if (this.questions.length > 0) {
          this.Form.controls['questions'].setErrors(null);
        }
        if (this.participants.length > 0) {
          this.Form.controls['participants'].setErrors(null);
        }
        if (this.participants.length <= this.Form.value.participant_count && this.Form.value.participant_count != null && this.participants.length > 0) {
          this.sub = true
          this.Form.controls['participants'].setErrors(null);
        }
        // }
        // else {
        //   this.router.navigate(["/apps/satisfaction-survey/survey-history"])
        // }
        // this.Form.controls['survey_type'].disable();
      },
      error: (err: any) => { },
      complete: () => {}

    })
  }

  // get_surveytypes() {
  //   this.surveytypes = []
  //   const surveycategorie = this.dropDownValue.filter(function (elem) {
  //     return (elem.attributes.Category === "Survey Type")
  //   })
  //   this.surveytypes = surveycategorie
  // }

  get_languages() {
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
    this.divisions = []
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
    const business_unit = this.divisions.find(data => data.division_name === event.value)
    this.Form.controls['business_unit'].setValue(business_unit.id)
  }

  onSurveytypeSelect(event: any) {
    this.tab = event.value == "Private" ? true : false;
    this.switch = event.value == "Public" ? true : false;
    this.sub = event.value == "Public" ? true : false;
    if (this.participants.length < this.Form.value.participant_count && this.Form.value.participant_count != null && this.participants.length > 0) {
      this.sub = true
      this.Form.controls['participants'].setErrors(null);
    }
    else if (this.participants.length >= this.Form.value.participant_count) {
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
        this.Questions = result.data.map((item: any) => {
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


  addQuestions() {
    if (!this.Form.value.category) {
      this._snackBar.open("Please select a Survey Category...!", 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      return;
    }
  
    if (!this.Form.value.question_category) {
      this._snackBar.open("Please select a Question Category...!", 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      return;
    }
  
    this.dialog.open(AddQuestionComponent, {
      data: {
        questions: this.questions,
        surveycategory: this.Form.value.category,
        questioncategory: this.Form.value.question_category,
      }
    }).afterClosed().subscribe((data) => {
      if (!data) return;
  
      const newQuestions = data.Question.split('$^');
      const existingQuestions = this.questions.filter(q => newQuestions.includes(q.Question));
  
      if (existingQuestions.length > 0) {
        const statusText = newQuestions.length === 1 ? 
          "Question already selected." : 
          "Some of the questions are already selected.";
  
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
  
        // Remove already selected questions from `newQuestions`
        existingQuestions.forEach(existingQuestion => {
          const index = newQuestions.indexOf(existingQuestion.Question);
          if (index !== -1) newQuestions.splice(index, 1);
        });
      }
  
      newQuestions.forEach((question: string) => {
        let questionObj = this.Questions.find(q => q.attributes.question === question.trim());
  
        if (questionObj) {
          const newData = {
            id: data.id,
            org_id: data.org_id,
            Question: question.trim(),
            QuestionId: questionObj.id,
            QuestionType: questionObj.attributes.response_options,

          };
          this.questions.push(newData);
        }
      });
  
      // Validate `questions` form control
      if (this.questions.length > 0) {
        this.Form.controls['questions'].setErrors(null);
      } else {
        this.Form.controls['questions'].setValidators(Validators.required);
      }
    });
  }
  

  addParticipants() {
    //this.participants = []
    this.dialog.open(AddParticipantComponent, {
      data: this.participants
    }).afterClosed().subscribe((data: any) => {
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
          this.newparticipants.push(newData);
        });

        // if (this.participants.length <= this.Form.value.participant_count && this.Form.value.participant_count != null && this.participants.length > 0 && this.newparticipants.length > 0) {
        //   this.sub = true
        //   this.Form.controls['participants'].setErrors(null);
        //   this.update_participants()
        // }
        // else if (this.participants.length > this.Form.value.participant_count) {
        //   this.sub = false
        //   const statusText = "participant count exceeded...!";
        //   this._snackBar.open(statusText, 'OK', {
        //     horizontalPosition: this.horizontalPosition,
        //     verticalPosition: this.verticalPosition,
        //   });
        // }

        if (this.newparticipants.length > 0) {
          this.Form.controls['participants'].setErrors(null);
          this.update_participants()
        }
        //this.participants.push(data)
        //

      }
    })
  }

  updateParticipants(data: any) {
    const dialogData = {
      mode: "update",
      data: data
    };
    this.dialog.open(ViewParticipantComponent, {
      data: dialogData
    }).afterClosed().subscribe((updatedData: any) => {
      if (updatedData) {
        this.participants.forEach(participant => {
          if (participant.Employee === updatedData.Employee) {
            participant.addparticipants = updatedData.addparticipants;

            this.satisfactionService.update_survey_participants(participant, this.Form.value.id).subscribe({
              next: (result: any) => {
                const statusText = "Participants Updated"
                this._snackBar.open(statusText, 'Ok', {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {

                this.getParticipants();

              }
            })
          }
        });
      }
    });
  }

  getParticipants() {
    this.participants = []
    const reference = this.route.snapshot.paramMap.get('id');
    this.satisfactionService.get_survey_details(reference).subscribe({
      next: (result: any) => {
        const con = result.data[0].attributes.survey_participants.data.map((participant: any) => {
          const data = {

            id: participant.id,
            org_id: "",
            Employee: participant.attributes.participant_name.trim(),
            Email: participant.attributes.participant_email,
            user_id: participant.attributes.user_id,
            addparticipants: participant.attributes.add_participant,
            created_user: this.userID
          };
          return data;
        });
        this.participants.push(...con);

        this.pts = this.participants.length < 2 ? "Patricipant" : "Patricipants"
        this.Form.controls['participant_count'].setValue(this.participants.length)

        if (this.participants.length > 0) {
          this.newparticipants = []
          this.Form.controls['participants'].setErrors(null);
        }

      },
      error: (err: any) => { },
      complete: () => {
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
    this.draft = false
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
        this.Form.controls['status'].setValue('Scheduled')
        if (this.Form.value.surveytype === 'Public') {
          this.Form.controls['public_survey_notification'].setValue(false)
        }else if(this.Form.value.surveytype === 'Private'){
          this.Form.controls['private_survey_notification'].setValue(false)
        }
        this.showProgressPopup();
        // this.create_reference_number();
        this.update_satisfaction_survey()
      }
    });
  }

  saveAsDraft() {
    this.draft = true
    this.Form.controls['status'].setValue('Draft')
    this.showProgressPopup();
    this.update_satisfaction_survey()
  }


  update_satisfaction_survey() {
    if (Array.isArray(this.Form.value.category)) {
      this.Form.value.category = this.Form.value.category.join(', ');
    }
    if (Array.isArray(this.Form.value.question_category)) {
      this.Form.value.question_category = this.Form.value.question_category.join(', ');
    }
    // this.Form.controls['survey_type'].enable();
    this.satisfactionService.update_satisfaction_survey(this.Form.value).subscribe({
      next: (result: any) => {

        this.Form.controls['id'].setValue(result.data.id)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.update_questions()
        //this.update_participants()
        //this.router.navigate(["/apps/satisfaction-survey/question-history"])
      }
    })
  }

  update_questions() {
    if (this.questions.length > 0) {

      const quesIds = this.questions.map(question => question.QuestionId);
      this.satisfactionService.update_survey_questions(quesIds, this.Form.value.id).subscribe({
        next: (result: any) => {

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          if (this.draft == true) {
            const statusText = "Satisfaction Survey saved";
            this._snackBar.open(statusText, 'OK', {
              duration: 3000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            Swal.close();

            this.router.navigate(["/apps/satisfaction-survey/modify-survey/" + this.Form.value.reference_id])
            this.get_surveys_details()
          }
          else {
            Swal.fire({
              title: this.draftstatus == false ? 'Satisfaction Survey updated' : 'Satisfaction Survey created',
              imageUrl: "assets/images/reported.gif",
              imageWidth: 250,
              text: "You have successfully updated a Satisfaction survey.",
              showCancelButton: false,

            })
            this.router.navigate(["/apps/satisfaction-survey/survey-history"])
          }
        }

      })
    }
    // Swal.fire({
    //   title: 'Satisfaction Survey Reported',
    //   imageUrl: "assets/images/reported.gif",
    //   imageWidth: 250,
    //   text: "You have successfully updated a Satisfaction Survey.",
    //   showCancelButton: false,

    // })
    // this.router.navigate(["/apps/satisfaction-survey/survey-history"])
    if (this.draft == true) {
      const statusText = "Satisfaction Survey Reported";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      Swal.close();

      this.router.navigate(["/apps/satisfaction-survey/modify-survey/" + this.Form.value.reference_id])
      this.get_surveys_details()
    }
    else {
      Swal.fire({
        title: this.draftstatus == false ? 'Satisfaction Survey Updated' : 'Satisfaction Survey Reported',
        imageUrl: "assets/images/reported.gif",
        imageWidth: 250,
        text: this.draftstatus == false ? "You have successfully updated a Satisfaction survey." : "You have successfully created a Satisfaction Survey.",
        showCancelButton: false,

      })
      this.router.navigate(["/apps/satisfaction-survey/survey-history"])
    }

  }

  update_participants() {
    if (this.newparticipants.length > 0) {
      let totalCount = this.newparticipants.length
      let count = 0
      this.newparticipants.forEach(elem => {
        this.satisfactionService.create_survey_participants(elem, this.Form.value.id).subscribe({
          next: (result: any) => {
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            count++
            if (count === totalCount) {
              this.getParticipants();
            }
          }
        })
      })

      const statusText = "Participants Updated"
      this._snackBar.open(statusText, 'Ok', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      this.newparticipants = []
      // this.participants = []
      // this.update_questions()

    } else {
      // this.update_questions()
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

    const indexToRemove = this.participants.findIndex(existing => existing.Employee === data.Employee && existing.Email === data.Email);
    if (indexToRemove !== -1) {
      const removedParticipant = this.participants.splice(indexToRemove, 1)[0];
      this.satisfactionService.delete_survey_participants(removedParticipant).subscribe({
        next: (result: any) => {

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          const statusText = "Participant Deleted"
          this._snackBar.open(statusText, 'Ok', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

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
      })
    }

  }
  viewParticipants(data: any) {
    const dialogData = {
      mode: "view",
      data: data
    };
    this.dialog.open(ViewParticipantComponent, {
      data: dialogData
    }).afterClosed().subscribe((updatedData: any) => {
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
    this.dialog.open(SurveyCategoryComponent, { data: { mode: 'create' } }).afterClosed().subscribe(data => {
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
    this.dialog.open(SurveyCategoryComponent, { data: { data: data, mode: 'modify' }, }).afterClosed().subscribe(datas => {
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
            this.questionCategory()
          },
          error: (err: any) => { },
          complete: () => { }
        })
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
    // this.questioncategories = []
    // const questioncategorie = this.dropDownValue.filter(function (elem) {
    //   return (elem.attributes.Category === "Question Category")
    // })
    // this.questioncategories = questioncategorie
  }
  new_survey_question_cat() {
    this.dialog.open(SurveyQuestionCategoryComponent, {
      data: { mode: 'create', filter: this.Form.value.category }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.satisfactionService.create_survey_question_category(data).pipe(
          switchMap((result: any) => {
            return this.satisfactionService.get_survey_question_categories().pipe(map((res: any) => ({ res, newValue: result.data.attributes.value }))
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
      text: "Please confirm once again that you intend to delete the Survey Category.",
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
  onSurveyCatChange(event: any) {
    const selectedValuesArray = event.value;
    const selectedValuesString = selectedValuesArray.join(', ');
    this.Form.controls['category'].setValue(selectedValuesArray);
    this.filteredquestioncategories = this.allQuestioncategories.filter(elem =>
      selectedValuesArray.includes(elem.attributes.filter)
    );
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
     suggestDescription() {
        const title = this.Form.value.title;
        const category = this.Form.value.category;
        const purpose = this.Form.value.purpose;
        const questions = this.questions || [];
      
        const startDate = this.surveyDateRange.value.start_date;
        const endDate = this.surveyDateRange.value.end_date;
      
      
        if (!title || !category || !purpose || questions.length === 0 || !startDate || !endDate) {
          this.showSnackbar("Please Select Purpose, Category, Title, Add Questions, and Set Survey Duration.");
          return;
        }
      
        const formattedStartDate = new Date(startDate).toLocaleDateString();
        const formattedEndDate = new Date(endDate).toLocaleDateString();
      
        const questionTypesMap = new Map<string, number>();
        questions.forEach(q => {
          const type = q.QuestionType || "Unknown Type";
          questionTypesMap.set(type, (questionTypesMap.get(type) || 0) + 1);
        });
      
        const formattedQuestionTypes = Array.from(questionTypesMap)
          .map(([type, count]) => `<b>${count} ${type}</b>`)
          .join(", ");
      
        let duration;
        const numQuestions = questions.length;
        if (numQuestions >= 1 && numQuestions <= 5) duration = "<b>2-5 minutes</b>";
        else if (numQuestions >= 6 && numQuestions <= 15) duration = "<b>5-10 minutes</b>";
        else if (numQuestions >= 16 && numQuestions <= 30) duration = "<b>10-20 minutes</b>";
        else if (numQuestions > 30) duration = "<b>20+ minutes</b>";
        else duration = "<b>Unknown duration</b>";
      
        const descriptionText = `
        <p>We are conducting the <b>${title}</b> to assess <b>${category}</b>, helping us enhance <b>${purpose}</b>.</p>
        <p>The survey consists of <b>${numQuestions}</b> Questions :- <br> 
        ${formattedQuestionTypes} questions and will take approximately ${duration} to complete.</p>
        <p>It will remain open from <b>${formattedStartDate}</b> to <b>${formattedEndDate}</b>, and your feedback is valuable for future improvements.</p>
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
}
