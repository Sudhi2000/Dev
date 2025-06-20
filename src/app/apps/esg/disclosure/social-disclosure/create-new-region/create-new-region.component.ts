import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-new-region',
  templateUrl: './create-new-region.component.html',
  styleUrls: ['./create-new-region.component.scss']
})
export class CreateNewRegionComponent implements OnInit {

  Form: FormGroup
  units: any[] = []
  EnvironmentLOV: any[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateNewRegionComponent>,
    private esgService: EsgService,
  ) { }

  ngOnInit(): void {    
    this.Form = this.formBuilder.group({
      id:[''],
      user_id: [this.defaults.userID || '', [Validators.required]],
      region: ['', [Validators.required]],
    });
    if(this.defaults.data){
      this.Form.controls['region'].setValue(this.defaults.data.region)
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
    
    if(this.defaults.mode==='modify'){
      const formData = new FormData();
      let resultData: any;
      this.Form.controls['id'].setValue(this.defaults.data.id)
      formData.append('region_details', JSON.stringify(this.Form.value))
      this.esgService.updateRegion(formData).subscribe({
        next: (result: any) => {          
          resultData = result[0].data
        },
        error: (err: any) => { },
        complete: () => {
          Swal.close();
          this.dialogRef.close(resultData);
        }
      })
    }else{
      const formData = new FormData();
      let resultData: any;
      formData.append('region_details', JSON.stringify(this.Form.value))
      this.esgService.create_new_region(formData).subscribe({
        next: (result: any) => {          
          resultData = result.region
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
