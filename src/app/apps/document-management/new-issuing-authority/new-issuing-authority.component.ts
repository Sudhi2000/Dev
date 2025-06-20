import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-new-issuing-authority',
  templateUrl: './new-issuing-authority.component.html',
  styleUrls: ['./new-issuing-authority.component.scss']
})
export class NewIssuingAuthorityComponent implements OnInit {

  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewIssuingAuthorityComponent>) { }
    
  ngOnInit() {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }
}
