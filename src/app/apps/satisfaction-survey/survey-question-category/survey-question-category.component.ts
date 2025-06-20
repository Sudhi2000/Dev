import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.api.service';

@Component({
  selector: 'app-survey-question-category',
  templateUrl: './survey-question-category.component.html',
  styleUrls: ['./survey-question-category.component.scss']
})
export class SurveyQuestionCategoryComponent implements OnInit {

   constructor(
     @Inject(MAT_DIALOG_DATA) public data: any,
     private formBuilder: FormBuilder,
      private authService: AuthService,
      public dialogRef: MatDialogRef<SurveyQuestionCategoryComponent>
    ) { }
    Form: FormGroup
    isMulticat: boolean = false;  
    availableFilters: string[] = [];
  
    ngOnInit(): void {
      this.Form = this.formBuilder.group({
        filter: ['', [Validators.required]],
        value: ['', [Validators.required]],
        id: [, [Validators.required]],
      });
    
      if (this.data.mode === 'modify') {
        this.Form.controls['value'].setValue(this.data.data.attributes.value);
        this.Form.controls['filter'].setValue(this.data.data.attributes.filter);
      } else {
        if (Array.isArray(this.data.filter) && this.data.filter.length > 1) {
          this.availableFilters = this.data.filter; // Store multiple values
          this.isMulticat = true; 
        } else {
          const filterValue = Array.isArray(this.data.filter) ? this.data.filter[0] : this.data.filter;
          this.Form.controls['filter'].setValue(filterValue);
          this.isMulticat = false; 
        }
      }
      this.me()
    }
  
    me() {
      this.authService.me().subscribe({
        next: (result: any) => {
          this.Form.controls['id'].setValue(result.id)
        },
        error: (err: any) => {
        },
        complete: () => { }
      })
    }
  
    submit() {
      this.dialogRef.close(this.Form.value);
    }
  
}
