import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';
import { addquestion } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  Form: FormGroup
  orgID: any
  dropDownValue: any[] = []
  languages: any[] = []

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
  mode: 'create' | 'update' | 'view' = 'create';

  constructor(
    private satisfactionService: SatisfactionService,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<QuestionComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.configuration()
    
   
    // if (this.defaults) {
    //   this.mode = 'update';
    // } else {
    //   this.defaults = {} as addquestion;
    // }

    this.Form = this.formBuilder.group({
      org_id: [this.defaults.data.org_id || ''],
      language: [this.defaults.data.language || '',[Validators.required]],
      language_locale: [this.defaults.data.language_locale || '',],
      question: [this.defaults.data.question || '',[Validators.required]]
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
        const status = result.survey_question_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
          this.dialogRef.close()
        }
        else {
          if(this.defaults.mode === "create")
            {
              this.get_languages()
            }
            else{ 
              
                  this.Form.controls['language'].disable()
               
            }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
        this.dialogRef.close()

      },
      complete: () => { }
    })
  }

  get_languages() {
    this.satisfactionService.get_languages().subscribe({
      next: (result: any) => {
        
        this.languages = result
        this.languages.splice(this.languages.findIndex((existing) => existing.name === "English (en)"), 1);
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        
      
      }
    })
  }

  onLanguageSelectionChange(event: MatSelectChange) {
    
    const selectedLanguage = event.value;
    const selectedLanguageObject = this.languages.find(language => language.name === selectedLanguage);
    
    if (selectedLanguageObject) {
      const selectedLocale = selectedLanguageObject.code;
      this.Form.controls['language_locale'].setValue(selectedLocale)
    }
  }


  submit() {
    this.Form.controls['language'].enable()
    this.dialogRef.close(this.Form.value);
  }

  


}
