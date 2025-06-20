import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-inspection-category',
  templateUrl: './new-inspection-category.component.html',
  styleUrls: ['./new-inspection-category.component.scss']
})
export class NewInspectionCategoryComponent implements OnInit {

  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewInspectionCategoryComponent>) { }
    
  ngOnInit() {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required]],

    });
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
