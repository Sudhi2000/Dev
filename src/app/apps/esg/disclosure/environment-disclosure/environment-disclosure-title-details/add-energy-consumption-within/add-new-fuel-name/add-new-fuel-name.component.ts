import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-fuel-name',
  templateUrl: './add-new-fuel-name.component.html',
  styleUrls: ['./add-new-fuel-name.component.scss']
})
export class AddNewFuelNameComponent implements OnInit {

  Form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddNewFuelNameComponent>,
    private esgService: EsgService,
  ) { }

  ngOnInit(): void {

    this.Form = this.formBuilder.group({
      id: [''],
      user_id: [''],
      fuel_name: ['', [Validators.required]],
    });

    if (this.defaults.data) {
      this.Form.controls['fuel_name'].setValue(this.defaults.data.value)
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
      formData.append('fuel_name_details', JSON.stringify(this.Form.value))
      formData.append('energy_type', JSON.stringify(this.defaults.energyType))
      this.esgService.updateEnvNewFuelName(formData).subscribe({
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
      formData.append('fuel_name_details', JSON.stringify(this.Form.value))
      formData.append('energy_type', JSON.stringify(this.defaults.energyType))

      this.esgService.createEnvNewFuelName(formData).subscribe({
        next: (result: any) => {

          resultData = result.fuelName
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
