import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-industry-type',
  templateUrl: './create-industry-type.component.html',
  styleUrls: ['./create-industry-type.component.scss']
})
export class CreateIndustryTypeComponent implements OnInit {

  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateIndustryTypeComponent>) { }
    
  ngOnInit() {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required]],

    });
  }
  
  submit() {
    this.dialogRef.close(this.Form.value);
  }
}
