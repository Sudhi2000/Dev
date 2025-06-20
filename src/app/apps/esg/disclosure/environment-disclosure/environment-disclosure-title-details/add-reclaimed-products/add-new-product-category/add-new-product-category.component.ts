import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-product-category',
  templateUrl: './add-new-product-category.component.html',
  styleUrls: ['./add-new-product-category.component.scss']
})
export class AddNewProductCategoryComponent implements OnInit {


   Form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<AddNewProductCategoryComponent>,
        private esgService: EsgService,
  ) { }
 ngOnInit(): void {    
    this.Form = this.formBuilder.group({
      id:[''],
      user_id: [''],
      product_category_name: ['', [Validators.required]],
    });
    if(this.defaults.data){
      this.Form.controls['product_category_name'].setValue(this.defaults.data.product_category_name)
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
      formData.append('product_category_details', JSON.stringify(this.Form.value))
      this.esgService.updateEnvNewProductCategory(formData).subscribe({
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
      formData.append('product_category_details', JSON.stringify(this.Form.value))
      this.esgService.createEnvNewProductCategory(formData).subscribe({
        next: (result: any) => {          
          resultData = result.ProductCategory
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
