import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-reclaimed-product',
  templateUrl: './add-new-reclaimed-product.component.html',
  styleUrls: ['./add-new-reclaimed-product.component.scss']
})
export class AddNewReclaimedProductComponent implements OnInit {


   Form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<AddNewReclaimedProductComponent>,
        private esgService: EsgService,
  ) { }
 ngOnInit(): void {    
    this.Form = this.formBuilder.group({
      id:[''],
      user_id: [''],
      reclaimed_product_name: ['', [Validators.required]],
    });
    if(this.defaults.data){
      this.Form.controls['reclaimed_product_name'].setValue(this.defaults.data.reclaimed_product_name)
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
      formData.append('reclaimed_product_details', JSON.stringify(this.Form.value))
      this.esgService.updateEnvNewReclaimedProduct(formData).subscribe({
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
      formData.append('reclaimed_product_details', JSON.stringify(this.Form.value))
      this.esgService.createEnvNewReclaimedProduct(formData).subscribe({
        next: (result: any) => {          
          resultData = result.ReclaimedProduct
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
