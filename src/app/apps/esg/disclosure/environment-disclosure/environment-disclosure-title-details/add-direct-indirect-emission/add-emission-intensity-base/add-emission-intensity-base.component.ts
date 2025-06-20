import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-emission-intensity-base',
  templateUrl: './add-emission-intensity-base.component.html',
  styleUrls: ['./add-emission-intensity-base.component.scss']
})
export class AddEmissionIntensityBaseComponent implements OnInit {

  Form: FormGroup
  lov: any[] = []
  uniqueUnits: string[] = []; // Store unique unit values
  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEmissionIntensityBaseComponent>,
    private esgService: EsgService,
  ) { }
  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      id: [''],
      user_id: [''],
      emission_intensity_base_name: ['', [Validators.required]],
      unit: ['', [Validators.required]],
    });
    this.lov = this.defaults.lov

    if (this.lov[19]?.value) {
      this.uniqueUnits = Array.from(new Set<string>(this.lov[19].value.map((item: any) => String(item.unit))));
    }
    
    if (this.defaults.data) {
      this.Form.controls['emission_intensity_base_name'].setValue(this.defaults.data.value)
      this.Form.controls['unit'].setValue(this.defaults.data.unit)
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
      formData.append('emission_intensity_base_details', JSON.stringify(this.Form.value))
      this.esgService.updateEnvEmissionIntensityBase(formData).subscribe({
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
      formData.append('emission_intensity_base_details', JSON.stringify(this.Form.value))
      this.esgService.createEnvEmissionIntensityBase(formData).subscribe({
        next: (result: any) => {
          resultData = result.emission
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
