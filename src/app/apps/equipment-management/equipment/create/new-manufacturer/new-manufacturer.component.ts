import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-new-manufacturer',
  templateUrl: './new-manufacturer.component.html',
  styleUrls: ['./new-manufacturer.component.scss']
})
export class NewManufacturerComponent implements OnInit {

  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewManufacturerComponent>) { }
    
  ngOnInit() {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required]],

    });
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }
}
