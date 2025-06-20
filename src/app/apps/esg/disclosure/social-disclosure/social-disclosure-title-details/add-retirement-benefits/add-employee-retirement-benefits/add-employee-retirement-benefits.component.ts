import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-employee-retirement-benefits',
  templateUrl: './add-employee-retirement-benefits.component.html',
  styleUrls: ['./add-employee-retirement-benefits.component.scss']
})
export class AddEmployeeRetirementBenefitsComponent implements OnInit {

  Form: FormGroup
  lov: any[] = []
  benefitsProvidedControl = new FormControl(null);
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    public dialogRef: MatDialogRef<AddEmployeeRetirementBenefitsComponent>) { }

 ngOnInit() {
  console.log(this.data);

  this.Form = this.formBuilder.group({
    id: [''],
    title: [this.data.data?.title || ''],
    title_ref_id: [this.data.title_ref_id || ''],
    esg_disclosure: [this.data.refID || ''],
    number_of_employees_covered: [
      this.data.data?.number_of_employees_covered || null,
      Validators.required,
    ],
    benefits_provided: ['', Validators.required],
  });

  // Set the dropdown values if data exists
  if (this.data.data?.benefits_provided) {
    let benefitsProvided = this.data.data.benefits_provided;

    if (typeof benefitsProvided === 'string') {
      benefitsProvided = benefitsProvided.split(',').map((item: string) => item.trim());
    }

    this.benefitsProvidedControl.setValue(benefitsProvided);
    this.Form.controls['benefits_provided'].setValue(benefitsProvided);
  }

  this.lov = this.data.lov;

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

  setBenefitsProvided(event: any) {
    this.Form.controls['benefits_provided'].setValue(event.value);
  }

  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      this.showProgressPopup()
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('employee_retirement_benefits', JSON.stringify(this.Form.value))
      // formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value))
      this.esgService.updateSocDisEmployeeRetirementBenefits(formData).subscribe({
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
