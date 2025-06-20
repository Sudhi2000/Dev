import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-type-hr-violations',
  templateUrl: './new-type-hr-violations.component.html',
  styleUrls: ['./new-type-hr-violations.component.scss']
})
export class NewTypeHrViolationsComponent implements OnInit {

  Form: FormGroup
  EnvironmentLOV: any[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewTypeHrViolationsComponent>,
    private esgService: EsgService,
  ) { }

  ngOnInit(): void {
    
    this.Form = this.formBuilder.group({
      id: [''],
      user_id: [this.defaults.userID || '', [Validators.required]],
      type_of_violation: ['', [Validators.required]],
    });
    if (this.defaults.data) {
      this.Form.controls['type_of_violation'].setValue(this.defaults.data.value)
    }
  }


  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  submit() {
    this.showProgressPopup();

    if (this.defaults.mode === 'modify') {
      const formData = new FormData();
      let resultData: any;
      this.Form.controls['id'].setValue(this.defaults.data.id)
      formData.append('type_of_violation_details', JSON.stringify(this.Form.value))
      this.esgService.updateTypeofHRViolation(formData).subscribe({
        next: (result: any) => {
          resultData = result[0].data
        },
        error: (err: any) => { },
        complete: () => {
          Swal.close();
          this.dialogRef.close(resultData);
        }
      })
    } else {
      const formData = new FormData();
      let resultData: any;
      formData.append('type_of_violation_details', JSON.stringify(this.Form.value))
      this.esgService.create_new_type_of_hr_violation(formData).subscribe({
        next: (result: any) => {
          
          resultData = result.TypeOfHRViolation

        },
        error: (err: any) => { },
        complete: () => {
          Swal.close();
          this.dialogRef.close(resultData);
        }
      })
    }
  }

}
