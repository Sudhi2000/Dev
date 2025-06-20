import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.scss']
})
export class NewSupplierComponent implements OnInit {

  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    public dialogRef: MatDialogRef<NewSupplierComponent>) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required]],
      contact_number: [null],
      email_id: [null],
      location: ['']
    });
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }


}
