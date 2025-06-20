import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-employee-benefits',
  templateUrl: './add-employee-benefits.component.html',
  styleUrls: ['./add-employee-benefits.component.scss']
})
export class AddEmployeeBenefitsComponent implements OnInit {


  Form: FormGroup
  lov: any[] = []

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEmployeeBenefitsComponent>) { }

  ngOnInit() {

    this.Form = this.formBuilder.group({
      id: [''],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.title_ref_id || ''],
      esg_disclosure: [this.data.refID || ''],
      employees: [this.data.data.employees || ''],
      benefits_provided: [this.data.data.benefits_provided || '', Validators.required],
      male: [this.data.data.male || null, Validators.required],
      female: [this.data.data.female || null, Validators.required],
      other: [this.data.data.other || null],
    })

    this.lov = this.data.lov
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Updating...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  submit() {

    if (this.data.mode === 'modify' && this.data.data.id) {
      this.showProgressPopup()
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('employee_benefits', JSON.stringify(this.Form.value))
      // formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value))
      this.esgService.updateSocDisTitleEmployeeBenefits(formData).subscribe({
        next: (result: any) => {
        },
        error: (err: any) => {
          
        },
        complete: () => {
          Swal.close()
          this.dialogRef.close(this.Form.value);
        }
      })
    } else {
      this.dialogRef.close(this.Form.value);
    }
  }

  close() {
    this.dialogRef.close()
  }
}
