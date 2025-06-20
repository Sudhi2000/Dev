import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-type-of-ods',
  templateUrl: './new-type-of-ods.component.html',
  styleUrls: ['./new-type-of-ods.component.scss']
})
export class NewTypeOfOdsComponent implements OnInit {

  Form: FormGroup
  EnvironmentLOV: any[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewTypeOfOdsComponent>,
    private esgService: EsgService,
  ) { }

  ngOnInit(): void {
    
    this.Form = this.formBuilder.group({
      id: [''],
      user_id: [this.defaults.userID || '', [Validators.required]],
      type_of_ods: ['', [Validators.required]],
    });
    if (this.defaults.data) {
      this.Form.controls['type_of_ods'].setValue(this.defaults.data.value)
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
      formData.append('type_of_ods_details', JSON.stringify(this.Form.value))
      this.esgService.updateTypeofODS(formData).subscribe({
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
      formData.append('type_of_ods_details', JSON.stringify(this.Form.value))
      this.esgService.create_new_type_of_ods(formData).subscribe({
        next: (result: any) => {
          
          resultData = result.TypeOfODS

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
