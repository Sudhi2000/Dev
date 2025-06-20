import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-worker-retirement-benefits',
  templateUrl: './add-worker-retirement-benefits.component.html',
  styleUrls: ['./add-worker-retirement-benefits.component.scss']
})
export class AddWorkerRetirementBenefitsComponent implements OnInit {

  Form: FormGroup
  lov: any[] = []
  benefitsProvidedControl = new FormControl(null);

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    public dialogRef: MatDialogRef<AddWorkerRetirementBenefitsComponent>) { }

 ngOnInit() {
  this.Form = this.formBuilder.group({
    id: [''],
    title: [this.data.data?.title || ''],
    title_ref_id: [this.data.title_ref_id || ''],
    esg_disclosure: [this.data.refID || ''],
    number_of_workers_covered: [
      this.data.data?.number_of_workers_covered || null,
      Validators.required
    ],
    benefits_provided: ['', Validators.required],
  });

  // Handle both array and string types safely
  if (this.data.data?.benefits_provided) {
    let benefitsProvided = this.data.data.benefits_provided;

    if (typeof benefitsProvided === 'string') {
      benefitsProvided = benefitsProvided.split(',').map((item: string) => item.trim());
    }

    // If you have a separate FormControl
    if (this.benefitsProvidedControl) {
      this.benefitsProvidedControl.setValue(benefitsProvided);
    }

    // Set in form group
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
      formData.append('worker_retirement_benefits', JSON.stringify(this.Form.value))
      // formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value))
      this.esgService.updateSocDisworkersRetirementBenefits(formData).subscribe({
        next: (result: any) => {
        },
        error: (err: any) => {

        },
        complete: () => {
          this.dialogRef.close(this.Form.value);
          Swal.close()
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
