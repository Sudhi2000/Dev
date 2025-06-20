import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.scss']
})
export class NewSupplierComponent implements OnInit {

  Form: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewSupplierComponent>
  ) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['']
    });
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
