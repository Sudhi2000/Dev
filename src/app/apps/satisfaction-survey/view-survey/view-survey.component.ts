import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { SafeUrl } from '@angular/platform-browser';

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
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewSurveyComponent implements OnInit {

  surveyDateRange = new FormGroup({
    start_date: new FormControl(),
    end_date: new FormControl()
  });
  business_unit = new FormControl(null, [Validators.required]);
  Form: FormGroup;
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
  isLoading = true;
  tab = false;
  switch = false;
  Questions: any[] = []
  languages: any[] = []
  participants: any[] = []
  Employees: any[] = []
  questions: any[] = []
  QuestionIds: any = ""
  Selectedquestions = new FormControl(null, [Validators.required]);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  language = new FormControl(null);
  userID: Number
  surveyResponses: any[] = [];
  groupedSurveyResponsesByQuestion: any[] = [];
  mySurveyResponses: any[] = [];
  respondentsCount: number = 0;
  totalParticipants: number | null = null;
  pendingParticipants: { Employee: string; Email: string, participant_reminder: boolean }[] = []; // Declare pending participants
  qrCodeDownloadLink: SafeUrl = "";
  surveyLink: string = "";
  surveyCreator: boolean = true
  surveyRespondent: boolean = true


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
    let currentUrl = window.location.href;
    this.surveyLink = currentUrl.replace('/apps/', '/').replace('/view-survey/', '/public-survey/');
  }

  ngOnInit(): void {
    this.showLoadingProgressPopup()
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
      surveytype: ['', [Validators.required]],
      title: ['', [Validators.required]],
      business_unit: [null],
      freequency: ['', [Validators.required]],
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

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
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
              //this.get_divisions()
              //this.get_profiles()
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
            // this.get_profiles()
            // this.get_divisions();
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.get_languages()
        // this.get_dropdown_values()
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
        const category = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Survey Category")
        })
        this.categories = category
      },
      error: (err: any) => { },
      complete: () => {
        this.get_surveytypes()

        this.getEmployee()
        this.getQuestion()
      }
    })
  }
  get_survey_response_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.satisfactionService.get__survey_response_details(this.Form.value.id).subscribe({
      next: (result: any) => {
        if (result.data) {
          this.surveyResponses = result.data.map((item: any) => ({
            question: item.attributes.question,
            answer: item.attributes.descriptive_answer ||
              item.attributes.single_answer ||
              item.attributes.multiple_answer ||
              item.attributes.star_rating_answer ||
              item.attributes.yes_no_answer || 'No response',
            respondent: this.Form.value.surveytype === 'Private' ?
              item.attributes.user.data.attributes.first_name + " " +
              item.attributes.user.data.attributes.last_name : '',
            respondentEmail: this.Form.value.surveytype === 'Private' ?
              item.attributes.user.data.attributes.email : '',
            email: item.attributes.email,
            userId:this.Form.value.surveytype === 'Private' ? item.attributes.user.data.id:null
          }));
          this.groupedSurveyResponsesByQuestion = [];

          const groupedByQuestion: { [question: string]: any } = {};
          
          for (const response of this.surveyResponses) {
            const key = response.question;
            if (!groupedByQuestion[key]) {
              groupedByQuestion[key] = {
                question: response.question,
                responses: []
              };
            }
            groupedByQuestion[key].responses.push({
              answer: response.answer,
              respondent: this.Form.value.surveytype === 'Public' ? response.email : response.respondent
            });
          }
          
          this.groupedSurveyResponsesByQuestion = Object.values(groupedByQuestion);
          
          this.mySurveyResponses = this.surveyResponses.filter(
            (response: any) => response.userId === this.userID
          );

          if (this.mySurveyResponses.length == 0) {
            this.surveyRespondent = false
          }
          this.calculateRespondentsCount();
        }
      },
      error: () => {
        this.router.navigate(["/error/internal"]);
      }
    });
  }


  calculateRespondentsCount() {
    const surveyType = this.Form.controls['surveytype'].value;

    if (surveyType === 'Private') {

      const uniqueRespondents = new Set(
        this.surveyResponses
          .map(res => res.respondentEmail?.toLowerCase())
          .filter(email => email)
      );
      this.respondentsCount = uniqueRespondents.size;
      this.totalParticipants = this.participants.length;
      this.pendingParticipants = this.participants.filter(participant => {

        const email = participant.Email?.toLowerCase(); // Normalize email case
        const isPending = !uniqueRespondents.has(email);
        return isPending;
      });

    } else {
      const uniqueRespondents = new Set(
        this.surveyResponses
          .map(res => res.email?.toLowerCase())
          .filter(email => email)
      );


      this.respondentsCount = uniqueRespondents.size || 0;

      this.totalParticipants = null;

      this.pendingParticipants = [];
    }
  }



  async get_questions_details() {

    const reference = this.route.snapshot.paramMap.get('id');
    this.satisfactionService.get_survey_details(reference).subscribe({
      next: async (result: any) => {

        // const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        // let matchFound = true;
        // if (this.divisionUuids && this.divisionUuids.length > 0) {
        //   matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        // }

        // if ((matchFound || matchFound !== false)) {

        if (this.userID !== result.data[0].attributes.created_user.data.id) {
          this.surveyCreator = false
        }
        this.Form.controls['id'].setValue(result.data[0].id)
        //this.business_unit.setValue(result.data[0].attributes.business_unit.data?.attributes.division_name)
        //this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
        this.Form.controls['description'].setValue(result.data[0].attributes.survey_description)
        this.Form.controls['category'].setValue(result.data[0].attributes.survey_category)
        this.Form.controls['surveytype'].setValue(result.data[0].attributes.survey_type)
        this.tab = result.data[0].attributes.survey_type == "Private" ? true : false;
        this.switch = result.data[0].attributes.survey_type == "Public" ? true : false;
        this.Form.controls['title'].setValue(result.data[0].attributes.survey_title)
        this.Form.controls['participant_count'].setValue(result.data[0].attributes.participant_count)
        this.Form.controls['freequency'].setValue(result.data[0].attributes.frequency)
        this.Form.controls['status'].setValue(result.data[0].attributes.status)
        this.Form.controls['end_date'].setValue(result.data[0].attributes.survey_end_date)
        this.Form.controls['start_date'].setValue(result.data[0].attributes.survey_start_date)
        if (result.data[0].attributes.survey_start_date != null) {
          this.surveyDateRange.controls['start_date'].setValue(new Date(result.data[0].attributes.survey_start_date))
          this.surveyDateRange.controls['end_date'].setValue(new Date(result.data[0].attributes.survey_end_date))
        }
        this.Form.controls['language'].setValue(result.data[0].attributes.language)
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.Form.controls['reference_id'].setValue(result.data[0].attributes.reference_id)
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

        const con = result.data[0].attributes.survey_participants.data.map((participant: any) => {
          const data = {
            id: result.data[0].id,
            org_id: "",
            Employee: participant.attributes.participant_name.trim(),
            Email: participant.attributes.participant_email,
            addparticipants: participant.attributes.add_participant,
            participant_id: participant.id,
            participant_reminder: participant.attributes.participant_reminder
          };
          return data;
        });
        this.participants.push(...con);

        this.pts = this.participants.length < 2 ? "Patricipant" : "Patricipants"
        this.Form.controls['participant_count'].setValue(this.participants.length)

        const consta = result.data[0].attributes.survey_questions.data.map((question: any) => {
          const removeHtmlTags = (html: string) => {
            return html.replace(/<[^>]*>?/gm, '');
          };
          const data = {
            id: result.data[0].id,
            org_id: "",
            // Question: removeHtmlTags(question.attributes.question.trim()),
            Question: question.attributes.question,
            QuestionId: question.id,
          };
          return data;
        });

        this.questions.push(...consta);

        // }
        // else {
        //   this.router.navigate(["/apps/satisfaction-survey/survey-history"])
        // }

      },
      error: (err: any) => { },
      complete: () => {
        this.get_survey_response_details()
        this.Form.disable();
        //this.business_unit.disable()
        this.surveyDateRange.controls['start_date'].disable()
        this.surveyDateRange.controls['end_date'].disable()
        //this.language.disable()
        //console.log("data", this.translated)
        Swal.close()
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
    this.satisfactionService.get_languages().subscribe({
      next: (result: any) => {

        this.languages = result
        //this.languages.splice(this.languages.findIndex((existing) => existing.name === "English (en)"), 1);
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.get_questions_details()
        // this.get_survey_response_details()
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
    this.satisfactionService.get_questions().subscribe({
      next: (result: any) => {
        this.Questions = result.data.map((item: any) => {
          return {
            ...item,
            attributes: {
              ...item.attributes,
              // question: this.stripHtml(item.attributes.question)
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
    // this.questions = []
    this.dialog.open(AddQuestionComponent, {
      data: this.questions
    }).afterClosed().subscribe((data: any) => {
      if (data) {

        const newQuestions = data.Question.split(',');
        // const existingQuestions = this.questions.filter(q => newQuestions.includes(q.Question));

        // if (existingQuestions.length > 0) {
        //   const statusText = "Some of the questions are already selected.";
        //   this._snackBar.open(statusText, 'OK', {
        //     horizontalPosition: this.horizontalPosition,
        //     verticalPosition: this.verticalPosition,
        //   });
        // }
        // else {
        // this.questions = this.questions.filter(q => q.Question !== data.Question);
        newQuestions.forEach((question: any, index: number) => {

          let questionid = this.Questions.find((emp: any) => emp.attributes.question === question);

          // if (index > 0) {
          //   this.QuestionIds += ',';
          // }
          // this.QuestionIds += questionid.id;

          const newData = {
            id: data.id,
            org_id: data.org_id,
            Question: question.trim(),
            QuestionId: questionid.id
          };
          this.questions.push(newData);
        });
        //}
        if (this.questions.length > 0) {
          this.Form.controls['questions'].setErrors(null);
        } else {
          this.Form.controls['questions'].setValidators(Validators.required);
        }

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
          const employee = this.Employees.find((emp: any) => emp.attributes.employee_name === Employee);
          if (employee) {
            Email = employee.attributes.email;
          }
          const newData = {
            id: data.id,
            org_id: data.org_id,
            Employee: Employee.trim(),
            Email: Email,
            addparticipants: data.addparticipants
          };
          this.participants.push(newData);
        });

        if (this.participants.length > 0) {
          this.Form.controls['participants'].setErrors(null);
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

  get_profiles() {
    // this.hazardService.get_hazard_approvers(this.orgID).subscribe({
    //   next: (result: any) => {
    //     // const filteredData = result.data.filter((person: any) => person.attributes.user?.data?.attributes?.blocked===false);
    //     // this.peopleList = filteredData;
    //     this.peopleList = result.data;
    //   },
    //   error: (err: any) => {
    //     this.router.navigate(["/error/internal"])
    //   },
    //   complete: () => {
    //   }
    // });
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
  showLoadingProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Getting Details...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  submit() {
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
        this.showProgressPopup();
        this.create_reference_number();
      }
    });
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
        this.create_satisfaction_survey()
      }
    })
  }

  create_satisfaction_survey() {
    this.satisfactionService.create_satisfaction_survey(this.Form.value).subscribe({
      next: (result: any) => {

        this.Form.controls['id'].setValue(result.data.id)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_participants()
        //this.router.navigate(["/apps/satisfaction-survey/question-history"])
      }
    })
  }

  create_questions() {
    if (this.questions.length > 0) {
      this.questions.forEach(elem => {
        this.satisfactionService.create_survey_questions(elem.QuestionId, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            Swal.fire({
              title: 'Satisfaction Survey Reported',
              imageUrl: "assets/images/reported.gif",
              imageWidth: 250,
              text: "You have successfully created a Satisfaction Survey.",
              showCancelButton: false,

            })
            this.router.navigate(["/apps/satisfaction-survey/survey-history"])
          }
        })
      })
    }
  }

  create_participants() {
    if (this.participants.length > 0) {
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

  saveAsDraft() {
    this.showProgressPopup();
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
  }
  viewParticipants(data: any) {
    ;
    this.dialog.open(ViewParticipantComponent, {
      data: data
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


  isDisabled(value: string): boolean {
    return true; // Replace this condition with your logic
  }


  deleteQuestions(data: any) {
    this.questions.splice(this.questions.findIndex((existing) => existing.id === data.id), 1);
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
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
  sendReminder(participant: any) {
    this.showProgressPopup()
    this.satisfactionService.sendParticipantReminder(participant.participant_id).subscribe({
      next: (result: any) => {
        Swal.close()
      },
      complete: () => {
        participant.participant_reminder = true
        Swal.fire({
          title: 'Reminder Sent Successfully',
          imageUrl: "assets/images/user.gif",
          imageWidth: 250,
          text: "You have successfully sent a reminder to " + participant.Employee + " to participate in this survey.",
          showCancelButton: false,
  
        })
        
      }
    }
    )

  }

}
