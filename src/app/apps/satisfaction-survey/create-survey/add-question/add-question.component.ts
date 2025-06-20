import { Component, Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { CreateSurveyComponent } from '../create-survey.component';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';
import { Multiselectquestion } from 'src/app/services/schemas';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})

// @Pipe({ name: 'stripHtml' })
// export class StripHtmlPipe implements PipeTransform {
//   constructor(private sanitizer: DomSanitizer) {}

//   transform(value: string): SafeHtml {
//     const doc = new DOMParser().parseFromString(value, 'text/html');
//     return this.sanitizer.bypassSecurityTrustHtml(doc.body.textContent || '');
//   }
// }

export class AddQuestionComponent implements OnInit {

  Form: FormGroup
  orgID: any
  dropDownValue: any[] = []
  languages: any[] = []
  Questions: any[] = []
  QuestionIds: any = ""
  QuestionNames: any = ""
  QuestionTypes: any = ""
  SelectedQuestions: any[] = []
  mode: 'create' | 'update' = 'create';
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
  Question = new FormControl(null, [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<CreateSurveyComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private generalService: GeneralService,
    private satisfactionService: SatisfactionService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Multiselectquestion;
    }
    this.configuration()

    this.getQuestion()

    this.SelectedQuestions = [];
    this.QuestionIds = "";
    this.QuestionNames = "";
    this.QuestionTypes = "";

    this.Form = this.formBuilder.group({
      id: [this.defaults.id],
      org_id: [this.defaults.org_id || ''],
      Question: [this.defaults.Question || '', [Validators.required]],
      QuestionId: [this.defaults.QuestionId || '', [Validators.required]],
      QuestionType: [this.defaults.QuestionType || '', [Validators.required]],
    });
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.satisfaction_survey
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
          this.dialogRef.close()
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
        this.dialogRef.close()

      },
      complete: () => { }
    })

  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.survey_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
          this.dialogRef.close()
        }
        // else {
        //   this.get_dropdown_values()
        // }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
        this.dialogRef.close()

      },
      complete: () => {

      }
    })
  }

  // QuestionChange(event: any) {
    onCheckboxChange(event: any) {
      if (event.selected) {
        let question = this.Questions.find((q: any) => q.attributes.question === event.attributes.question);
        if (!question) return;
    
        const alreadySelected = this.SelectedQuestions.find((item: any) => item.Question === event.attributes.question);
        if (alreadySelected) return; // prevent duplicates
    
        if (this.SelectedQuestions.length > 0) {
          this.QuestionIds += ',';
          this.QuestionNames += '$^';
          this.QuestionTypes += '$^';
        }
    
        this.QuestionIds += question.id;
        this.QuestionNames += question.attributes.question;
        this.QuestionTypes += question.attributes.response_options;
    
        const newData = {
          id: this.defaults.id,
          org_id: this.defaults.org_id,
          Question: event.attributes.question.trim(),
          QuestionId: question.id,
          ResponseType: question.attributes.response_options
        };
    
        this.SelectedQuestions.push(newData);
      } else {
        this.SelectedQuestions = this.SelectedQuestions.filter((item: any) => item.Question !== event.attributes.question);
        this.QuestionIds = this.SelectedQuestions.map((item: any) => item.QuestionId).join(',');
        this.QuestionNames = this.SelectedQuestions.map((item: any) => item.Question).join('$^');
        this.QuestionTypes = this.SelectedQuestions.map((item: any) => item.ResponseType).join('$^');
      }
    }
    
    

  getTruncatedQuestion(question: string): string {
    if (question.length > 90) {
      return question.slice(0, 90) + '...';
    } else {
      return question;
    }
  }
  // get_dropdown_values() {
  //   const module = "Satisfaction Survey"
  //   this.generalService.get_dropdown_values(module).subscribe({
  //     next: (result: any) => {
  //       this.dropDownValue = result.data
  //       const languages = result.data.filter(function (elem: any) {
  //         return (elem.attributes.Category === "Language")
  //       })
  //       this.languages = languages
  //     },
  //     error: (err: any) => { },
  //     complete: () => {
  //     }
  //   })
  // }

  stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  getQuestion() {
    this.showProgressPopup();
    this.Questions = [];
    this.satisfactionService.get_questions_for_survey().subscribe({
      next: (result: any) => {
        let filteredQuestions = result.data
          .filter((item: any) => item.attributes.question.trim() !== "")
          .map((item: any) => ({
            ...item,
            attributes: {
              ...item.attributes,
              question: item.attributes.question,
              selected: false
            }
          }));          
        const surveyCategories = Array.isArray(this.defaults.surveycategory) ? this.defaults.surveycategory : [this.defaults.surveycategory];
        const questionCategories = Array.isArray(this.defaults.questioncategory) ? this.defaults.questioncategory : [this.defaults.questioncategory];       
        if (surveyCategories.length > 0 && questionCategories.length > 0) {
          this.Questions = filteredQuestions
            .filter((question: any) =>
              !this.defaults.questions.some((def: any) => def.QuestionId === question.id)
            )
            .filter((question: any) =>
              surveyCategories.includes(question.attributes.survey_category) &&
              questionCategories.includes(question.attributes.question_category)
            );            
          } else {
            this.Questions = filteredQuestions
            .filter((question: any) =>
              !this.defaults.questions.some((def: any) => def.QuestionId === question.id)
          );
        }
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close();
      }
    });
  }

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      // html: 'Loading data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }


  // onCheckboxChange(list: any) {
  //   // if (list.selected) {
  //   //   this.selectedQuestions.push({ id: list.id, question: list.attributes.question });
  //   // } 
  //   // else {
  //   //   const index = this.selectedQuestions.findIndex((item:any) => item.id === list.id);
  //   //   if (index > -1) {
  //   //     this.selectedQuestions.splice(index, 1);
  //   //   }
  //   // }
  // }

  // getQuestion() {
  //   this.Questions = []
  //   this.satisfactionService.get_questions().subscribe({
  //     next: (result: any) => {

  //       this.Questions = result.data
  //     },
  //     error: (err: any) => { },
  //     complete: () => {
  //     }
  //   })
  // }
  isAllSelected(): boolean {
    return this.Questions.length > 0 && this.Questions.every(q => q.selected);
  }
  
  toggleAllSelection(event: any): void {
    const isChecked = event.target.checked;
    this.Questions.forEach(q => {
      q.selected = isChecked;
      this.onCheckboxChange(q);  // Ensure same behavior as individual selection
    });
  
    // Remove duplicates if accidentally added
    if (isChecked) {
      const unique = new Map();
      this.SelectedQuestions.forEach(q => {
        if (!unique.has(q.QuestionId)) {
          unique.set(q.QuestionId, q);
        }
      });
      this.SelectedQuestions = Array.from(unique.values());
    }
  }
  
  submit() {

    this.Form.controls['Question'].setValue(this.QuestionNames.toString())
    this.Form.controls['QuestionId'].setValue(this.QuestionIds.toString())
    this.Form.controls['QuestionType'].setValue(this.QuestionTypes.toString())

    this.dialogRef.close(this.Form.value);
  }



}
