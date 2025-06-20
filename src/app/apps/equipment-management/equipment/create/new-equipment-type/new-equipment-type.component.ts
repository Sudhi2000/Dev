import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-equipment-type',
  templateUrl: './new-equipment-type.component.html',
  styleUrls: ['./new-equipment-type.component.scss']
})
export class NewEquipmentTypeComponent implements OnInit {

  
  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewEquipmentTypeComponent>) { }
    
  ngOnInit() {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required]],

    });
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }
}
