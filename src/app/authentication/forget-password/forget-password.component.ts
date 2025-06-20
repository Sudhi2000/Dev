import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  forgetPassForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ForgetPasswordComponent>,
    private formBuilder: FormBuilder) { }

  ngOnInit(){
    this.forgetPassForm = this.formBuilder.group({
      email:['', [Validators.required]],
     
    });
  }

  close(){
    this.dialogRef.close();
  }

  submit(){
    this.dialogRef.close(this.forgetPassForm.value);
    // const name = this.forgetPassForm.controls['email'].value.toLowerCase();
    // this.dialogRef.close(name);

  }

}
