import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-medicine-type',
  templateUrl: './create-medicine-type.component.html',
  styleUrls: ['./create-medicine-type.component.scss']
})
export class CreateMedicineTypeComponent implements OnInit {
  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateMedicineTypeComponent>) { }
    
  ngOnInit() {
    this.Form = this.formBuilder.group({
      type: ['', [Validators.required]]
    });
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
