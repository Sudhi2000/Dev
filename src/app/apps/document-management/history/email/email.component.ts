import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  Form:FormGroup

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmailComponent>) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      email_id: ['', [Validators.required]],
      
    });
  }

  submit(){
    this.dialogRef.close(this.Form.value);

  }
}
