import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateSurveyComponent } from '../create-survey.component';
import { GeneralService } from 'src/app/services/general.api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.scss']
})
export class ViewQuestionComponentNew implements OnInit {

  Form: FormGroup
  orgID: any
  dropDownValue: any[] = []
  languages: any[] = []
  Employees: any[] = []
  mode: 'create' | 'update' | 'view' = 'create';

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
    this.Form = this.formBuilder.group({
      id: [this.defaults.id],
      org_id: [this.defaults.org_id || ''],
      question: [this.defaults.Question || '', [Validators.required]],
    });

    this.Form.controls['question'].setValue(this.defaults.Question.toString())
    this.Form.controls['question'].disable();
  }

}
