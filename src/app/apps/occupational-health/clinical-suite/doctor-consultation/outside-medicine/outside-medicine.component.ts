import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-outside-medicine',
  templateUrl: './outside-medicine.component.html',
  styleUrls: ['./outside-medicine.component.scss'],
})
export class OutsideMedicineComponent implements OnInit {
  Form: FormGroup;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OutsideMedicineComponent>) {}

  ngOnInit() {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required]],
      uuid: [uuidv4(), [Validators.required]]
    });
  }

  submit() {
    this.dialogRef.close(this.Form.value)
  }
}
