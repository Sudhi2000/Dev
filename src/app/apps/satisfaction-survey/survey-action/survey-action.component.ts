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
import { Console } from 'console';
import { ViewQuestionComponentNew } from '../create-survey/view-question/view-question.component';

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
  selector: 'app-survey-action',
  templateUrl: './survey-action.component.html',
  styleUrls: ['./survey-action.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class SurveyActionComponent implements OnInit {

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
  isLoading = true;
  tab = false;
  switch = false;
  Questions: any[] = []
  languages: any[] = []
  participants: any[] = []
  newparticipants: any[] = []
  Employees: any[] = []
  questions: any[] = []
  QuestionIds: any = ""
  Selectedquestions = new FormControl(null, [Validators.required]);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  language = new FormControl(null);



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
      id: [{ value: '' }],
      org_id: [{ value: '', disabled: true }],
      reference_number: [{ value: '' }],
      created_date: [{ value: new Date() }, [Validators.required]],
      status: [{ value: 'Open', disabled: false }, [Validators.required]],
      description: [{ value: '', disabled: true }, [Validators.required]],
      createrId: [{ value: '', disabled: true }],
      createrName: [{ value: '' }],
      createrDesignation: [{ value: '' }],
      category: [{ value: '', disabled: true }, [Validators.required]],
      surveytype: [{ value: '', disabled: true }, [Validators.required]],
      title: [{ value: '', disabled: true }, [Validators.required]],
      business_unit: [{ value: null, disabled: true }],
      freequency: [{ value: '', disabled: true }],
      participant_count: [{ value: '' }, [Validators.required]],
      end_date: [{ value: '', disabled: false }, [Validators.required]],
      start_date: [{ value: '', disabled: false }, [Validators.required]],
      language: [{ value: '', disabled: true }],
      disclaimer: [{ value: '', disabled: true }, [Validators.required]],
      // anonymus: [{ value: false, disabled: true }],
      before_5_miniutes: [{ value: false, disabled: true }],
      before_10_miniutes: [{ value: false, disabled: true }],
      before_15_miniutes: [{ value: false, disabled: true }],
      before_30_miniutes: [{ value: false, disabled: true }],
      before_1_hour: [{ value: false, disabled: true }],
      before_2_hour: [{ value: false, disabled: true }],
      before_1_day: [{ value: false, disabled: true }],
      before_2_days: [{ value: false, disabled: true }],
      participants: [{ value: '', disabled: true }],
      questions: [{ value: '', disabled: true }, [Validators.required]],
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
        // this.get_surveytypes()
        this.get_languages()
        this.getEmployee()
        this.getQuestion()
        this.get_questions_details()
      }
    })
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

        this.Form.controls['id'].setValue(result.data[0].id)
        // console.log("Business unit:",result.data[0].attributes.business_unit)
        this.business_unit.setValue(result.data[0].attributes.business_unit.data?.attributes.division_name)
        this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
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

        const con = result.data[0].attributes.survey_participants.data.map((participant: any) => {
          const data = {
            id: participant.id,
            org_id: "",
            Employee: participant.attributes.participant_name.trim(),
            Email: participant.attributes.participant_email,
            addparticipants: participant.attributes.add_participant
          };
          return data;
        });
        this.participants.push(...con);

        this.pts = result.data[0].attributes.survey_participants.data.length < 2 ? "Patricipant" : "Patricipants"
        this.Form.controls['participant_count'].setValue(result.data[0].attributes.survey_participants.data.length)
       
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

        if (this.questions.length > 0) {
          this.Form.controls['questions'].setErrors(null);
        }
        // if (this.participants.length > 0) {
        //   this.Form.controls['participants'].setErrors(null);
        // }

        // }
        // else {
        //   this.router.navigate(["/apps/satisfaction-survey/survey-history"])
        // }

      },
      error: (err: any) => { },
      complete: () => {

        // this.Form.disable();
        this.business_unit.disable()
        // //this.surveyDateRange.controls['start_date'].disable()
        // //this.surveyDateRange.controls['end_date'].disable()
        //this.language.disable()

       

      }

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
    }).afterClosed().subscribe((data) => {
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
            id: this.questions[0].id,
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
    }).afterClosed().subscribe((data) => {
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
          this.newparticipants.push(newData);
        });

        if (this.newparticipants.length > 0) {
          this.Form.controls['participants'].setErrors(null);
          this.update_participants()
        }
        //this.participants.push(data)
        //

      }
    })
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
            addparticipants: participant.attributes.add_participant
          };
          return data;
        });
        this.participants.push(...con);

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
        this.showProgressPopup();
        // this.create_reference_number();
        this.update_satisfaction_survey()
      }
    });
  }

  saveAsDraft() {
    this.Form.controls['status'].setValue('Draft')
    this.showProgressPopup();
    this.update_satisfaction_survey()
  }


  update_satisfaction_survey() {
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
          Swal.fire({
            title: 'Satisfaction Survey Reported',
            imageUrl: "assets/images/reported.gif",
            imageWidth: 250,
            text: "You have successfully updated a Satisfaction Survey.",
            showCancelButton: false,

          })
          this.router.navigate(["/apps/satisfaction-survey/survey-history"])
        }

      })
    }
  }

  update_participants() {
    if (this.newparticipants.length > 0) {
      let totalCount = this.newparticipants.length
      let count = 0
      this.newparticipants.forEach(elem => {
        this.satisfactionService.create_survey_participants(elem, this.Form.value.id).subscribe({
          next: (result: any) => {
            // console.log("New:",result)
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
    if (this.Form.value.end_date != "1970-01-02") {
      this.satisfactionService.update_survey_duration(this.Form.value.start_date, this.Form.value.end_date, this.Form.value.id).subscribe({
        next: (result: any) => {

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          const statusText = "Survey Duration Updated"
          this._snackBar.open(statusText, 'Ok', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

        }
      })
    }

  }

  isDisabled(value: string): boolean {
    return true; // Replace this condition with your logic
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
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

        }
      })
    }

  }
  viewParticipants(data: any) {
    ;
    this.dialog.open(ViewParticipantComponent, {
      data: data
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

  progress() {
    this.Form.controls['status'].setValue("In Progress")
    this.satisfactionService.update_survey_status("In Progress", this.Form.value.id).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "Status Updated"
        this._snackBar.open(statusText, 'Ok', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

      }
    })
  }
  complete() {
    this.Form.controls['status'].setValue("Completed")
    this.satisfactionService.update_survey_status("Completed", this.Form.value.id).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "Status Updated"
        this._snackBar.open(statusText, 'Ok', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

      }
    })
  }

}
