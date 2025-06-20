import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.api.service';

@Component({
  selector: 'app-survey-purpose',
  templateUrl: './survey-purpose.component.html',
  styleUrls: ['./survey-purpose.component.scss']
})
export class SurveyPurposeComponent implements OnInit {

constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
     private authService: AuthService,
     public dialogRef: MatDialogRef<SurveyPurposeComponent>
   ) { }
   Form: FormGroup
 
 
   ngOnInit(): void {    
     this.Form = this.formBuilder.group({
       value: ['', [Validators.required]],
       id: [, [Validators.required]],
     });
     this.me();
     if(this.data.mode==='modify'){
      this.Form.controls['value'].setValue(this.data.data.attributes.value)
     }
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
