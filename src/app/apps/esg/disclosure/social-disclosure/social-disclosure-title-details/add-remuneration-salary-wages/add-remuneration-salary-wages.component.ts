import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-remuneration-salary-wages',
  templateUrl: './add-remuneration-salary-wages.component.html',
  styleUrls: ['./add-remuneration-salary-wages.component.scss']
})
export class AddRemunerationSalaryWagesComponent implements OnInit {

Form: FormGroup
  lov: any[] = []

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddRemunerationSalaryWagesComponent>) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      id: [''],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.title_ref_id || ''],
      esg_disclosure: [this.data.refID || ''],
      category: [this.data.data.category || '', Validators.required],
      male: [this.data.data.male || null, Validators.required],
      female: [this.data.data.female || null, Validators.required],
    })

    this.lov = this.data.lov
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }

  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      this.showProgressPopup();
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('remuneration_salary_wages', JSON.stringify(this.Form.value))
      // formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value))
      this.esgService.updateSocDisTitleERemunerationSalaryWages(formData).subscribe({
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
  close() {
    this.dialogRef.close()
  }
}
