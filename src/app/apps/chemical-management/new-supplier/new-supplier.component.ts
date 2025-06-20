import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { log } from 'console';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.scss']
})
export class NewSupplierComponent implements OnInit {

  Form: FormGroup
  mode: 'create' | 'update' = 'create';
  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private generalService: GeneralService,
    private chemicalService: ChemicalService,
    public dialogRef: MatDialogRef<NewSupplierComponent>) { }

  ngOnInit(): void {
    if (this.defaults) {
      this.mode = 'update';
      this.get_supplier_name_by_id(this.defaults)
    }
    this.Form = this.formBuilder.group({
      id:[this.defaults],
      name: ['', [Validators.required]],
      email_id: [null],
      location: ['', [Validators.required]],
      contact_number: [null],
    });
  }

  get_supplier_name_by_id(id: any) {
    this.chemicalService.get_supplier_details(id).subscribe({
      next: (result: any) => {
        this.Form.controls['name'].setValue(result.data.attributes.name)
        this.Form.controls['email_id'].setValue(result.data.attributes.email)
        this.Form.controls['location'].setValue(result.data.attributes.location)
        this.Form.controls['contact_number'].setValue(result.data.attributes.contact_number)     
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
