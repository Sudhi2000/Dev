import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AddParticipantComponent } from '../create-survey/add-participant/add-participant.component';
import { ViewParticipantComponent } from '../create-survey/view-participant/view-participant.component';

@Component({
  selector: 'app-private-survey',
  templateUrl: './private-survey.component.html',
  styleUrls: ['./private-survey.component.scss']
})
export class PrivateSurveyComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Business_Unit = new FormControl(null, [Validators.required]);
  Form: FormGroup;

  selectedIndexCon: number = 0;
  maxNumberOfTabsCon: number = 5;

  selectedIndex: number = 0;
  questionIndex: number = -1;
  existingIndex: number = -1;
  maxNumberOfTabs: number = 5;
  SurveyId: any;
  SurveyRefID: any;
  SurveyReference: any;
  SurveyDescription: any;
  SurveyCreatedDate: any;
  SurveyCreatedBy: any;
  SurveyCreatedUserId: any;
  SurveyParticipantCount: any;
  SurveyCategory: any;
  survey_start_date: any;
  survey_end_date: any;
  SurveyTitle: any;
  Disclaimer: any;
  Questions: any[] = []
  CurrentQuestionId: any = 0
  userID: Number
  options: any[] = []
  participants: any[] = []
  AddNewparticipants: boolean = false
  Employees: any[] = []
  newparticipants: any[] = []
  answers: any[] = []
  textanswers: any[] = []
  staranswers: any[] = []
  yesornoanswers: any[] = []
  multiselectanswers: any[] = []
  singleselectanswers: any[] = []
  Originaloptions: any[] = []
  selectedOptions: any[] = []
  singleselectedOptions: any[] = []
  selectedOptionsDisplay: any = ""
  singleselectedOptionsDisplay: any = ""
  peopleList: any[] = [];
  orgID: string;
  unitSpecific: any
  multiplechoice_options: any
  userDivision: any
  corporateUser: any
  dropDownValue: any[] = []
  divisions: any[] = []
  languages: any[] = []
  language = new FormControl(null, [Validators.required]);
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
    private satisfactionService: SatisfactionService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private _snackBar: MatSnackBar,
    private httpClient: HttpClient,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.showLoadingProgressPopup()
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      created_date: [new Date()],
      reference_number: [''],
      language: ['', [Validators.required]],
      created_user: [''],
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.userID = result.id
        const status = result.assigned_surveys

        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {

          this.Form.controls['created_user'].setValue(result.profile.id)
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

  get_dropdown_values() {
    const module = "Satisfaction Survey"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValue = result.data

      },
      error: (err: any) => { },
      complete: () => {
        this.get_languages()
        // this.getQuestion()
        this.get_surveys_details()
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

      }
    })
  }

  async get_surveys_details() {

    const reference = this.route.snapshot.paramMap.get('id');
    this.satisfactionService.get_survey_details(reference).subscribe({
      next: async (result: any) => {
        const removeHtmlTags = (html: string) => {
          return html.replace(/<[^>]*>?/gm, '');
        };

        this.SurveyId = result.data[0].id;
        this.SurveyRefID = result.data[0].attributes.reference_id;
        this.SurveyDescription = result.data[0].attributes.survey_description;
        this.SurveyTitle = result.data[0].attributes.survey_title;
        this.SurveyReference = result.data[0].attributes.reference_number;
        this.SurveyCreatedDate = result.data[0].attributes.createdAt;
        this.SurveyCreatedBy = result.data[0].attributes.created_user.data.attributes.first_name + ' ' + result.data[0].attributes.created_user.data.attributes.last_name;
        this.SurveyCreatedUserId = result.data[0].attributes.created_user.data.id
        this.SurveyCategory = result.data[0].attributes.survey_category;
        this.survey_start_date = result.data[0].attributes.survey_start_date;
        this.survey_end_date = result.data[0].attributes.survey_end_date;
        this.SurveyParticipantCount = result.data[0].attributes.participant_count;
        this.Questions = []
        // this.Disclaimer = removeHtmlTags(result.data[0].attributes.disclaimer.trim())
        this.Disclaimer = result.data[0].attributes.disclaimer.trim()
        this.Questions = result.data[0].attributes?.survey_questions.data.map((question: any) => {

          const data = {
            id: result.data[0].id,
            org_id: "",
            question: removeHtmlTags(question.attributes.question.trim()),
            questionId: question.id,
            response_options: question.attributes.response_options,
            localizations: question.attributes.localizations,
            multiplechoice_options: question.attributes.multiplechoice_options
          };
          return data;
        });

        //this.Questions.push(...consta);
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.maxNumberOfTabs = this.Questions.length + 1
        this.get_options()
        this.getEmployee()
        Swal.close()

      }
    })
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

      }
    })
  }

  LanguageChange(event: any) {

    this.Form.controls['language'].setValue(event.value.toString())

  }

  onLanguageSelectionChange(language: any) {
    this.Form.controls['language'].setValue(language.name);
    this.Questions.forEach((question) => {
      if (question.previousQuestion) {
        question.question = question.previousQuestion;
      }
    });
    if (this.selectedIndex !== 1) {
      this.selectedIndex = 1;
    }
    const selectedLocale = language.code;

    const removeHtmlTags = (html: string) => {
      return html.replace(/<[^>]*>?/gm, '');
    };

    this.Questions.forEach((question) => {
      question.previousQuestion = question.question; // Store original question
    });

    this.Questions.forEach((question) => {
      const localizedData = question.localizations?.data?.find(
        (loc: any) => loc.attributes.locale === selectedLocale
      );

      if (localizedData) {
        question.question = removeHtmlTags(localizedData.attributes.question);
      } else {
        if (selectedLocale !== 'en') {
          const statusText = "This language isn't available for all questions.";
          this._snackBar.open(statusText, 'Ok', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
        question.question = removeHtmlTags(question.question); // Keep original if no localization found
      }
    });
    this.options = this.Questions.flatMap(q =>
      this.Originaloptions.filter(opt => opt.question === q.previousQuestion)
    );
    this.CurrentQuestionId = this.Questions[0]?.questionId;
  }

  onEditorInput(event: any, question: any) {
    const content = event.editor.getText().trim(); // Get the plain text content from Quill
  
    const existingTextIndex = this.textanswers.findIndex(ans => ans.questionId === question.questionId);
    const existingAnswerIndex = this.answers.findIndex(ans => ans.questionId === question.questionId);
  
    if (content === '') {
      if (existingTextIndex !== -1) this.textanswers.splice(existingTextIndex, 1);
      if (existingAnswerIndex !== -1) this.answers.splice(existingAnswerIndex, 1);
    } else {
      if (existingTextIndex !== -1) {
        this.textanswers[existingTextIndex].answer = content;
        this.answers[existingAnswerIndex].answer = content;
      } else {
        this.textanswers.push({
          questionId: question.questionId,
          answer: content
        });
  
        this.answers.push({
          Question: question.question,
          questionId: question.questionId,
          question_type: "Descriptive",
          answer: content,
          SurveyId: this.SurveyId,
          UserId: this.userID,
          SurveyRefID: this.SurveyRefID
        });
      }
    }
  }
  
  

  onToggleChange(event: any, question: any) {
    const existingIndex = this.yesornoanswers.findIndex(ans => ans.questionId === this.CurrentQuestionId);
    const existingIndexforsave = this.answers.findIndex(ans => ans.questionId === this.CurrentQuestionId);
  
    if (event.value === null || event.value === undefined || event.value === '') {
      if (existingIndex !== -1) this.yesornoanswers.splice(existingIndex, 1);
      if (existingIndexforsave !== -1) this.answers.splice(existingIndexforsave, 1);
    } else {
      if (existingIndex !== -1) {
        this.yesornoanswers[existingIndex].answer = event.value;
        this.answers[existingIndexforsave].answer = event.value;
      } else {
        this.yesornoanswers.push({ questionId: this.CurrentQuestionId, answer: event.value });
        this.answers.push({ Question: question.question, questionId: this.CurrentQuestionId, question_type: "Yes or No", answer: event.value, SurveyId: this.SurveyId, UserId: this.userID, SurveyRefID: this.SurveyRefID });
      }
    }
  }
  

  onRatingChange(rating: number, question: any) {
    const questionId = question.questionId;
    const existingIndex = this.staranswers.findIndex(ans => ans.questionId === questionId);
    const existingIndexforsave = this.answers.findIndex(ans => ans.questionId === questionId);
  
    if (rating === null || rating === 0) {
      if (existingIndex !== -1) this.staranswers.splice(existingIndex, 1);
      if (existingIndexforsave !== -1) this.answers.splice(existingIndexforsave, 1);
    } else {
      if (existingIndex !== -1) {
        this.staranswers[existingIndex].answer = rating;
        this.answers[existingIndexforsave].answer = rating;
      } else {
        this.staranswers.push({ questionId, answer: rating });
        this.answers.push({ Question: question.question, questionId, question_type: "Star Rating", answer: rating, SurveyId: this.SurveyId, UserId: this.userID, SurveyRefID: this.SurveyRefID });
      }
    }
  }
  

  onSelectionChange(event: any, question: any) {
    const questionId = question.questionId;
    const value = event.value || [];
    const existingIndex = this.multiselectanswers.findIndex(ans => ans.questionId === questionId);
    const existingIndexforsave = this.answers.findIndex(ans => ans.questionId === questionId);
  
    if (value.length === 0) {
      if (existingIndex !== -1) this.multiselectanswers.splice(existingIndex, 1);
      if (existingIndexforsave !== -1) this.answers.splice(existingIndexforsave, 1);
      this.selectedOptionsDisplay = '';
    } else {
      if (existingIndex !== -1) {
        this.multiselectanswers[existingIndex].answer = value;
        this.answers[existingIndexforsave].answer = value.toString();
      } else {
        this.multiselectanswers.push({ questionId, answer: value });
        this.answers.push({ Question: question.question, questionId, question_type: "Multiple Choice", answer: value.toString(), SurveyId: this.SurveyId, UserId: this.userID, SurveyRefID: this.SurveyRefID });
      }
  
      this.selectedOptions = value;
      if (value.length === 1) {
        this.selectedOptionsDisplay = value[0];
      } else if (value.length === 2) {
        this.selectedOptionsDisplay = value[0] + ' (+1 other)';
      } else {
        this.selectedOptionsDisplay = value[0] + ' (+' + (value.length - 1) + ' others)';
      }
    }
  }
  

  onSingleSelectionChange(event: any, question: any) {
    const questionId = question.questionId;
    const value = event.value;
    const existingIndex = this.singleselectanswers.findIndex(ans => ans.questionId === questionId);
    const existingIndexforsave = this.answers.findIndex(ans => ans.questionId === questionId);
  
    if (value === null || value === undefined || value === '') {
      if (existingIndex !== -1) this.singleselectanswers.splice(existingIndex, 1);
      if (existingIndexforsave !== -1) this.answers.splice(existingIndexforsave, 1);
      this.singleselectedOptionsDisplay = '';
    } else {
      if (existingIndex !== -1) {
        this.singleselectanswers[existingIndex].answer = value;
        this.answers[existingIndexforsave].answer = value.toString();
      } else {
        this.singleselectanswers.push({ questionId, answer: value });
        this.answers.push({ Question: question.question, questionId, question_type: "Single Choice", answer: value.toString(), SurveyId: this.SurveyId, UserId: this.userID, SurveyRefID: this.SurveyRefID });
      }
  
      this.singleselectedOptionsDisplay = value;
    }
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
              question: this.stripHtml(item.attributes.question)
            }
          };
        });
      },
      error: (err: any) => { },
      complete: () => {
        this.maxNumberOfTabs = this.Questions.length + 1
        this.get_options()
      }
    });

  }

  stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  get_options() {
    this.Questions.forEach(question => {
      if (question.response_options === "Multiple Choice" || question.response_options === "Single Choice") {
        const optionsArray = question.multiplechoice_options
          .split(',')
          .map((option: any) => option.trim())
          .filter((option: string) => option !== ''); // ✅ Filter out empty strings
        question.options = optionsArray;
      }
    });
  }
  
  

  nextStep(question: any) {

    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;

      this.questionIndex = this.questionIndex + 1
      if (this.Questions[this.questionIndex].response_options === "Multiple Choice" || this.Questions[this.questionIndex].response_options === "Single Choice") {
        this.options = this.Originaloptions.filter(x => x.question == this.Questions[this.questionIndex].question)
      }
      this.CurrentQuestionId = this.Questions[this.questionIndex].questionId
      // this.options = this.Originaloptions.filter(x=>x.question == question)

      this.existingIndex = -1
      if (this.Questions[this.questionIndex].response_options === "Multiple Choice") {
        this.existingIndex = this.multiselectanswers.findIndex(ans => ans.questionId === this.CurrentQuestionId);
      }
      if (this.Questions[this.questionIndex].response_options === "Single Choice") {
        this.existingIndex = this.singleselectanswers.findIndex(ans => ans.questionId === this.CurrentQuestionId);
      }


      if (this.existingIndex !== -1) {
        if (this.Questions[this.questionIndex].response_options === "Multiple Choice") {
          this.selectedOptions = this.multiselectanswers[this.existingIndex].answer

          if (this.selectedOptions.length === 0) {
            this.selectedOptionsDisplay = '';
          } else if (this.selectedOptions.length === 1) {
            this.selectedOptionsDisplay = this.selectedOptions[0];
          } else if (this.selectedOptions.length === 2) {
            this.selectedOptionsDisplay = this.selectedOptions[0] + ' (+1 other)';
          } else {
            this.selectedOptionsDisplay = this.selectedOptions[0] + ' (+' + (this.selectedOptions.length - 1) + ' others)';
          }
        }
        //this.selectedOptions = this.Questions[this.questionIndex].response_options === "Multiple Choice" ? this.multiselectanswers[this.existingIndex].answer : this.singleselectanswers[this.existingIndex].answer;
        if (this.Questions[this.questionIndex].response_options === "Single Choice") {
          this.selectedOptions = this.singleselectanswers[this.existingIndex].answer

          this.singleselectedOptionsDisplay = ""
          this.singleselectedOptionsDisplay = this.selectedOptions;
        }
      }
      else {
        this.selectedOptionsDisplay = ''
      }

    }
  }

  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;

      this.questionIndex = this.questionIndex - 1
      if (this.Questions[this.questionIndex]?.response_options === "Multiple Choice" || this.Questions[this.questionIndex]?.response_options === "Single Choice") {
        this.options = this.Originaloptions.filter(x => x.question == this.Questions[this.questionIndex].question)
      }
      this.CurrentQuestionId = this.Questions[this.questionIndex]?.questionId

      this.existingIndex = -1
      if (this.Questions[this.questionIndex]?.response_options === "Multiple Choice") {
        this.existingIndex = this.multiselectanswers.findIndex(ans => ans.questionId === this.CurrentQuestionId);
      }
      if (this.Questions[this.questionIndex]?.response_options === "Single Choice") {
        this.existingIndex = this.singleselectanswers.findIndex(ans => ans.questionId === this.CurrentQuestionId);
      }


      if (this.existingIndex !== -1) {
        // this.selectedOptions = this.Questions[this.questionIndex].response_options === "Multiple Choice" ? this.multiselectanswers[this.existingIndex].answer : this.singleselectanswers[this.existingIndex].answer;
        // if (this.selectedOptions.length === 0) {
        //   this.selectedOptionsDisplay = '';
        // } else if (this.selectedOptions.length === 1) {
        //   this.selectedOptionsDisplay = this.selectedOptions[0];
        // } else if (this.selectedOptions.length === 2) {
        //   this.selectedOptionsDisplay = this.selectedOptions[0] + ' (+1 other)';
        // } else {
        //   this.selectedOptionsDisplay = this.selectedOptions[0] + ' (+' + (this.selectedOptions.length - 1) + ' others)';
        // }

        if (this.Questions[this.questionIndex]?.response_options === "Multiple Choice") {
          this.selectedOptions = this.multiselectanswers[this.existingIndex]?.answer

          if (this.selectedOptions.length === 0) {
            this.selectedOptionsDisplay = '';
          } else if (this.selectedOptions.length === 1) {
            this.selectedOptionsDisplay = this.selectedOptions[0];
          } else if (this.selectedOptions.length === 2) {
            this.selectedOptionsDisplay = this.selectedOptions[0] + ' (+1 other)';
          } else {
            this.selectedOptionsDisplay = this.selectedOptions[0] + ' (+' + (this.selectedOptions.length - 1) + ' others)';
          }
        }
        //this.selectedOptions = this.Questions[this.questionIndex].response_options === "Multiple Choice" ? this.multiselectanswers[this.existingIndex].answer : this.singleselectanswers[this.existingIndex].answer;
        if (this.Questions[this.questionIndex]?.response_options === "Single Choice") {
          this.selectedOptions = this.singleselectanswers[this.existingIndex]?.answer

          this.singleselectedOptionsDisplay = ""
          this.singleselectedOptionsDisplay = this.selectedOptions;
        }
      }
      else {
        this.selectedOptionsDisplay = ''
      }
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
      html: 'Fetching data...',
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
      text: "Before proceeding, please take a moment to review the information you've provided. If everything looks correct, click 'Yes, Proceed'. If you need to make any changes, click 'Cancel' to review and edit your responses.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.Form.controls['status'].setValue('Scheduled')
        this.showProgressPopup();
        this.create_survey()
      }
    });
  }

  create_survey() {
    let count = 0;
    let maxlength = this.answers.length;
    this.answers.forEach(ans => {
      this.satisfactionService.create_survey_response(ans).subscribe({
        next: (result: any) => {
          count = count + 1;
          if (maxlength == count) {
            Swal.close();
            this.router.navigate(["/apps/satisfaction-survey/assigned-surveys"])
            Swal.fire({
              title: 'Survey Attended Successfully',
              imageUrl: "assets/images/start-working.gif",
              imageWidth: 150,
              text: "Thank you for attending the survey. Your responses have been recorded.",
              showCancelButton: false,
              cancelButtonColor: '#d33',
            })
          }
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          // this.router.navigate(["/apps/satisfaction-survey/assigned-surveys"])
        }
      })
    });
  }

  getEmployee() {
    this.Employees = []
    this.satisfactionService.get_users().subscribe({
      next: (result: any) => {

        this.Employees = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.getParticipants()
      }
    })
  }

  update_participants() {
    if (this.newparticipants.length > 0) {
      let totalCount = this.newparticipants.length
      let count = 0
      this.newparticipants.forEach(elem => {
        this.satisfactionService.create_survey_participants_during_survey(elem, this.SurveyId).subscribe({
          next: (result: any) => { },
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
            created_user: participant.attributes.created_user
          };
          return data;
        });
        this.participants.push(...con);

        if (this.participants.length > 0) {
          this.SurveyParticipantCount = this.participants.length
          this.newparticipants = []
        }

      },
      error: (err: any) => { },
      complete: () => {        
        this.AddNewparticipants = this.participants.some(participant => participant.user_id == this.userID && participant.addparticipants == true);        
        if (this.userID != this.SurveyCreatedUserId) {
          this.participants = this.participants.filter(participant => participant.created_user == this.userID);
        }
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

            this.satisfactionService.update_survey_participants(participant, this.SurveyId).subscribe({
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
          this.SurveyParticipantCount = this.participants.length
          if (this.participants.length == 0) {
            const statusText = "Please add atleast one participant...!";
            this._snackBar.open(statusText, 'OK', {
              duration: 3000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          }
          else if (this.participants.length == this.Form.value.participant_count && this.Form.value.participant_count != null && this.participants.length > 0) {

          }
          else if (this.participants.length > this.Form.value.participant_count) {

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
          this.update_participants()
        }
        //this.participants.push(data)
        //

      }
    })
  }

}
