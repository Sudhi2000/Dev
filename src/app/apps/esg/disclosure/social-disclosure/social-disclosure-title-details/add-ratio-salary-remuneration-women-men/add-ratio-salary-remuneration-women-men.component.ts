import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-ratio-salary-remuneration-women-men',
  templateUrl: './add-ratio-salary-remuneration-women-men.component.html',
  styleUrls: ['./add-ratio-salary-remuneration-women-men.component.scss']
})
export class AddRatioSalaryRemunerationWomenMenComponent implements OnInit {
Form: FormGroup
  lov: any[] = []

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddRatioSalaryRemunerationWomenMenComponent>) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      id: [''],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.title_ref_id || ''],
      esg_disclosure: [this.data.refID || ''],
      employee_category_by_level: [this.data.data.employee_category_by_level || ''],
      employee_category_by_function: [this.data.data.employee_category_by_function || ''],
      employee_average_pay_gap_salary_ratio: [this.data.data.employee_average_pay_gap_salary_ratio || null, Validators.required],
      employee_median_pay_gap_salary_ratio: [this.data.data.employee_median_pay_gap_salary_ratio || null, Validators.required],
    })

    this.lov = this.data.lov
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }

  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      this.showProgressPopup()
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('employee_salary_ratio', JSON.stringify(this.Form.value))
      // formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value))
      this.esgService.updateSocDisTitleSalaryRatioWomenToMen(formData).subscribe({
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

roundToTwoDecimals(controlName: string): void {
  const control = this.Form.get(controlName);
  if (control && control.value != null && !isNaN(control.value)) {
    const value = parseFloat(control.value);
    const hasDecimal = value % 1 !== 0;

    if (hasDecimal) {
      const decimalPlaces = control.value.toString().split('.')[1]?.length || 0;
      if (decimalPlaces > 2) {
        control.setValue(value.toFixed(2));
      }
    }
  }
}


  close() {
    this.dialogRef.close()
  }

}
