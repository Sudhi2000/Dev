import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { VerifySurveyRespondentComponent } from 'src/app/authentication/verify-survey-respondent/verify-survey-respondent.component';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-public-survey',
  templateUrl: './public-survey.component.html',
  styleUrls: ['./public-survey.component.scss']
})
export class PublicSurveyComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Business_Unit = new FormControl(null, [Validators.required]);
  Form: FormGroup;
  selectedIndex: number = 0;
  questionIndex: number = -1;
  existingIndex: number = 0;
  maxNumberOfTabs: number = 5;
  SurveyId: any;
  Disclaimer: any;
  Questions: any[] = []
  CurrentQuestionId: any = 0
  userID: Number
  options: any[] = []
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
  email: any
  multiplechoice_options: any
  userDivision: any
  corporateUser: any
  dropDownValue: any[] = []
  divisions: any[] = []
  languages: any[] = []
  SurveyReference: any;
  survey_start_date: any;
  survey_end_date: any;
  SurveyCreatedDate: any;
  language = new FormControl(null, [Validators.required]);
  refID: any
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
    this.refID = this.route.snapshot.paramMap.get('id')
    // this.configuration()
    this.goToVerifificationPage()
    // this.get_dropdown_values()
    // this.get_divisions();
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      created_date: [new Date()],
      reference_number: [''],
      language: ['', [Validators.required]],
      created_user: [''],
    });
  }
  goToVerifificationPage() {
    this.dialog.open(VerifySurveyRespondentComponent, {
      disableClose: true,
      data: this.refID,
      width: '470px',
    }).afterClosed().subscribe(data => {
      this.email = data.email
      this.get_dropdown_values()
      this.get_divisions();
    });
  }
  // configuration() {

  //   this.generalService.get_app_config().subscribe({
  //     next: (result: any) => {
  //       const status = result.data.attributes.modules.satisfaction_survey
  //       this.unitSpecific = result.data.attributes.business_unit_specific
  //       if (status === false) {
  //         this.router.navigate(["/error/upgrade-subscription"])
  //       } else if (status === true) {
  //         const allcookies = document.cookie.split(';');
  //         const name = environment.org_id
  //         for (var i = 0; i < allcookies.length; i++) {
  //           var cookiePair = allcookies[i].split("=");
  //           if (name == cookiePair[0].trim()) {
  //             this.orgID = decodeURIComponent(cookiePair[1])
  //             this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
  //           }
  //         }
  //         this.me()
  //       }
  //     },
  //     error: (err: any) => {
  //       this.router.navigate(["/error/internal"])
  //     },
  //     complete: () => { }
  //   })
  // }

  // me() {
  //   this.authService.me().subscribe({
  //     next: (result: any) => {
  //       this.userID = result.id
  //       const status = result.assigned_surveys

  //       if (status === false) {
  //         this.router.navigate(["/error/unauthorized"])
  //       } else {

  //         this.Form.controls['created_user'].setValue(result.profile.id)
  //         this.get_dropdown_values()
  //         //this.get_observations()

  //         if (this.unitSpecific) {
  //           this.corporateUser = result.profile.corporate_user
  //           if (this.corporateUser) {
  //             this.get_divisions()
  //           } else if (!this.corporateUser) {
  //             let divisions: any[] = []
  //             result.profile.divisions.forEach((elem: any) => {
  //               divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
  //               this.divisions.push(elem)
  //             })
  //             let results = divisions.join('&');
  //             this.userDivision = results

  //           }
  //         } else {
  //           this.get_divisions();
  //         }
  //       }
  //     },
  //     error: (err: any) => {
  //       this.router.navigate(["/error/internal"])
  //     },
  //     complete: () => { }
  //   })
  // }

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
        this.SurveyReference = result.data[0].attributes.reference_number;
        this.survey_start_date = result.data[0].attributes.survey_start_date;
        this.survey_end_date = result.data[0].attributes.survey_end_date;
        this.SurveyCreatedDate = result.data[0].attributes.createdAt;

        const removeHtmlTags = (html: string) => {
          return html.replace(/<[^>]*>?/gm, '');
        };
        this.SurveyId = result.data[0].id;
        this.Questions = []
        this.Disclaimer = removeHtmlTags(result.data[0].attributes.disclaimer.trim())
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
  // onLanguageSelectionChange(language: any) {
  //   this.Questions.forEach((question) => {
  //     if (question.previousQuestion) {
  //       question.question = question.previousQuestion;
  //     }
  //   });
  //   this.Form.controls['language'].setValue(language.name);
  //   if (this.selectedIndex != this.maxNumberOfTabs) {
  //     this.selectedIndex = this.selectedIndex + 1;
  //   }
  //   this.questionIndex = -1
  //   this.questionIndex = this.questionIndex + 1;
  //   const selectedLocale = language.code;

  //   const removeHtmlTags = (html: string) => {
  //     return html.replace(/<[^>]*>?/gm, '');
  //   };

  //   this.Questions.forEach((question) => {
  //     question.previousQuestion = question.question; // Store original question
  //   });

  //   this.Questions.forEach((question) => {
  //     const localizedData = question.localizations?.data?.find(
  //       (loc: any) => loc.attributes.locale === selectedLocale
  //     );

  //     if (localizedData) {
  //       question.question = removeHtmlTags(localizedData.attributes.question);
  //     } else {
  //       question.question = removeHtmlTags(question.question); // Keep original if no localization found
  //     }
  //   });
  onLanguageSelectionChange(language: any) {
    this.Questions.forEach((question) => {
      if (question.previousQuestion) {
        question.question = question.previousQuestion;
      }
    });

    this.Form.controls['language'].setValue(language.name);

    // Ensure we only move to the questions tab if it's not already selected
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

    // Filtering options for all questions
    this.options = this.Originaloptions.filter((opt) =>
      this.Questions.some(q => q.previousQuestion === opt.question)
    );
  }




  //   this.options = this.Originaloptions.filter((x) => {
  //     return x.question === this.Questions[this.questionIndex].previousQuestion;
  //   });


  // }






  // onLanguageSelectionChange(language: any) {
  //   this.Form.controls['language'].setValue(language.name)
  //   if (this.selectedIndex != this.maxNumberOfTabs) {
  //     this.selectedIndex = this.selectedIndex + 1;
  //   }
  //   this.questionIndex = this.questionIndex + 1
  //   this.options = this.Originaloptions.filter(x => x.question == this.Questions[this.questionIndex].question)
  //   this.CurrentQuestionId = this.Questions[this.questionIndex].questionId
  // }

  onEditorInput(event: any, question: any) {
    const content = event.editor.getText().trim();
    const existingAnswer = this.answers.find(ans => ans.questionId === question.questionId);
  
    if (existingAnswer) {
      if (content === '') {
        this.answers = this.answers.filter(ans => ans.questionId !== question.questionId);
      } else {
        existingAnswer.answer = content;
      }
    } else if (content !== '') {
      this.answers.push({
        Question: question.question,
        questionId: question.questionId,
        question_type: "Descriptive",
        answer: content,
        SurveyId: this.SurveyId,
        UserId: this.userID
      });
    }
  }
  
  onToggleChange(event: any, question: any) {
    const value = event.value;
    const existingAnswer = this.answers.find(ans => ans.questionId === question.questionId);
  
    if (existingAnswer) {
      if (value === null || value === undefined || value === '') {
        this.answers = this.answers.filter(ans => ans.questionId !== question.questionId);
      } else {
        existingAnswer.answer = value;
      }
    } else if (value !== null && value !== undefined && value !== '') {
      this.answers.push({
        Question: question.question,
        questionId: question.questionId,
        question_type: "Yes or No",
        answer: value,
        SurveyId: this.SurveyId,
        UserId: this.userID
      });
    }
  }
  
  onRatingChange(rating: number, question: any) {
    const existingAnswer = this.answers.find(ans => ans.questionId === question.questionId);
  
    if (existingAnswer) {
      if (!rating || rating === 0) {
        this.answers = this.answers.filter(ans => ans.questionId !== question.questionId);
      } else {
        existingAnswer.answer = rating;
      }
    } else if (rating && rating !== 0) {
      this.answers.push({
        Question: question.question,
        questionId: question.questionId,
        question_type: "Star Rating",
        answer: rating,
        SurveyId: this.SurveyId,
        UserId: this.userID
      });
    }
  }
  
  onSelectionChange(event: any, question: any) {
    const selected = event.value;
    const existingAnswer = this.answers.find(ans => ans.questionId === question.questionId);
  
    if (existingAnswer) {
      if (!selected || selected.length === 0) {
        this.answers = this.answers.filter(ans => ans.questionId !== question.questionId);
      } else {
        existingAnswer.answer = selected.toString();
      }
    } else if (selected && selected.length > 0) {
      this.answers.push({
        Question: question.question,
        questionId: question.questionId,
        question_type: "Multiple Choice",
        answer: selected.toString(),
        SurveyId: this.SurveyId,
        UserId: this.userID
      });
    }
  
    this.selectedOptions = selected;
    this.selectedOptionsDisplay = !selected || selected.length === 0 
      ? '' 
      : selected.length === 1 
      ? selected[0] 
      : `${selected[0]} (+${selected.length - 1} others)`;
  }
  
  onSingleSelectionChange(event: any, question: any) {
    const selected = event.value;
    const existingAnswer = this.answers.find(ans => ans.questionId === question.questionId);
  
    if (existingAnswer) {
      if (!selected || selected === '') {
        this.answers = this.answers.filter(ans => ans.questionId !== question.questionId);
      } else {
        existingAnswer.answer = selected.toString();
      }
    } else if (selected && selected !== '') {
      this.answers.push({
        Question: question.question,
        questionId: question.questionId,
        question_type: "Single Choice",
        answer: selected.toString(),
        SurveyId: this.SurveyId,
        UserId: this.userID
      });
    }
  
    this.singleselectedOptionsDisplay = selected;
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
          .filter((option: string) => option !== ''); // remove empty
  
        question.options = optionsArray.map((option: any) => ({ option })); // ⬅️ attach to question
      }
    });
  }
  
  nextStep() {
    if (this.selectedIndex < this.maxNumberOfTabs) { // 🔥 Fix: Allow reaching the last tab
      this.selectedIndex++;
    }

    if (this.questionIndex < this.Questions.length - 1) {
      this.questionIndex++;
    }
    this.options = [];
    if (["Multiple Choice", "Single Choice"].includes(this.Questions[this.questionIndex]?.response_options)) {
      this.options = this.Originaloptions.filter(x =>
        this.Questions[this.questionIndex].previousQuestion
          ? x.question === this.Questions[this.questionIndex].previousQuestion
          : x.question === this.Questions[this.questionIndex].question
      );
    }
    this.CurrentQuestionId = this.Questions[this.questionIndex]?.questionId;
    this.existingIndex = -1;

    if (this.Questions[this.questionIndex].response_options === "Multiple Choice") {
      this.existingIndex = this.multiselectanswers.findIndex(ans => ans.questionId === this.CurrentQuestionId);
    }
    if (this.Questions[this.questionIndex].response_options === "Single Choice") {
      this.existingIndex = this.singleselectanswers.findIndex(ans => ans.questionId === this.CurrentQuestionId);
    }

    if (this.existingIndex !== -1) {
      if (this.Questions[this.questionIndex].response_options === "Multiple Choice") {
        this.selectedOptions = this.multiselectanswers[this.existingIndex].answer;

        this.selectedOptionsDisplay = this.selectedOptions.length === 0
          ? ''
          : this.selectedOptions.length === 1
            ? this.selectedOptions[0]
            : this.selectedOptions[0] + ` (+${this.selectedOptions.length - 1} others)`;
      }

      if (this.Questions[this.questionIndex].response_options === "Single Choice") {
        this.selectedOptions = this.singleselectanswers[this.existingIndex].answer;
        this.singleselectedOptionsDisplay = this.selectedOptions;
      }
    } else {
      this.selectedOptionsDisplay = '';
    }
  }


  previousStep() {
    if (this.selectedIndex < this.maxNumberOfTabs && this.questionIndex > 0) {
      this.questionIndex--;
    }
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
    this.CurrentQuestionId = this.Questions[this.questionIndex]?.questionId;

    this.options = [];
    if (["Multiple Choice", "Single Choice"].includes(this.Questions[this.questionIndex]?.response_options)) {
      this.options = this.Originaloptions.filter(x =>
        x.question === (this.Questions[this.questionIndex].previousQuestion || this.Questions[this.questionIndex].question)
      );
    }
    this.existingIndex = -1;
    if (this.Questions[this.questionIndex]?.response_options === "Multiple Choice") {
      this.existingIndex = this.multiselectanswers.findIndex(ans => ans.questionId === this.CurrentQuestionId);
    }
    if (this.Questions[this.questionIndex]?.response_options === "Single Choice") {
      this.existingIndex = this.singleselectanswers.findIndex(ans => ans.questionId === this.CurrentQuestionId);
    }

    if (this.existingIndex !== -1) {
      if (this.Questions[this.questionIndex]?.response_options === "Multiple Choice") {
        this.selectedOptions = this.multiselectanswers[this.existingIndex].answer;
        this.selectedOptionsDisplay = this.selectedOptions.length === 0
          ? ''
          : this.selectedOptions.length === 1
            ? this.selectedOptions[0]
            : this.selectedOptions[0] + ` (+${this.selectedOptions.length - 1} others)`;
      }

      if (this.Questions[this.questionIndex]?.response_options === "Single Choice") {
        this.selectedOptions = this.singleselectanswers[this.existingIndex].answer;
        this.singleselectedOptionsDisplay = this.selectedOptions;
      }
    } else {
      this.selectedOptionsDisplay = '';
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
    const validAnswers = this.answers.filter(ans => ans.answer && ans.answer.toString().trim() !== '');
  
  if (validAnswers.length === 0) {
    alert('Please answer at least one question.');
    return;
  }
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
      this.satisfactionService.create_public_survey_response(ans,this.email).subscribe({
        next: (result: any) => {
          count = count + 1;
          if (maxlength == count) {
            Swal.close();
            // this.router.navigate(["/apps/satisfaction-survey/survey-history"])
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
          this.router.navigate(["/"])
        }
      })
    });
  }

}

