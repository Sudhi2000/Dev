import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';
import { AddNewProductCategoryComponent } from './add-new-product-category/add-new-product-category.component';
import { AddNewReclaimedProductComponent } from './add-new-reclaimed-product/add-new-reclaimed-product.component';

@Component({
  selector: 'app-add-reclaimed-products',
  templateUrl: './add-reclaimed-products.component.html',
  styleUrls: ['./add-reclaimed-products.component.scss']
})
export class AddReclaimedProductsComponent implements OnInit {

  Form: FormGroup
  lov: any[] = []

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddReclaimedProductsComponent>) { }

  ngOnInit(): void {
      this.lov = this.data.lov
  this.Form = this.formBuilder.group({
      id: [''],
      reclaimed_product: [this.data.data.reclaimed_product || '', Validators.required],
      product_category: [this.data.data.product_category || '', Validators.required],
      quantity: [this.data.data.quantity || null, Validators.required],
      unit: [ this.lov[42]?.value[0].Value || this.data.data.unit || '', Validators.required],
      esg_disclosure: [this.data.refID || ''],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.data.reference_id || ''],
    })
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }

  new_reclaimed_product() {
    this.dialog.open(AddNewReclaimedProductComponent, { width: "500px", data: { userID: this.data.userID, mode: 'create' } }).afterClosed().subscribe((data: any) => {
      this.lov[5].value.push(data)
      this.Form.controls['reclaimed_product'].setValue(data.value)

      const statusText = "Product/Material created.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

    })
  }

  new_product_category() {
    this.dialog.open(AddNewProductCategoryComponent, { width: "500px", data: { userID: this.data.userID, mode: 'create' } }).afterClosed().subscribe((data: any) => {
      this.lov[6].value.push(data)
      this.Form.controls['product_category'].setValue(data.value)

      const statusText = "Product Category created.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

    })
  }

  modify_reclaimed_product(data: any) {
    this.dialog.open(AddNewReclaimedProductComponent, {
      width: "500px", data: { userID: this.data.userID, mode: 'modify', data: data }
    }).afterClosed().subscribe((updatedData: any) => {

      if (updatedData?.id) {
        const index = this.lov[5].value.findIndex((item: any) => {
          return item.id === updatedData.id;
        });

        if (index !== -1) {
          this.lov[5].value[index] = updatedData;
        } else {
          console.warn("Product/Material ID not found in the list.");
        }
        this.Form.controls['reclaimed_product'].setValue(updatedData.value);

        const statusText = "Product/Material updated.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

      } else {
        console.error('Invalid data: Missing ID.');
      }
    });
  }

  modify_product_category(data: any) {
    this.dialog.open(AddNewProductCategoryComponent, {
      width: "500px", data: { userID: this.data.userID, mode: 'modify', data: data }
    }).afterClosed().subscribe((updatedData: any) => {

      if (updatedData?.id) {
        const index = this.lov[6].value.findIndex((item: any) => {
          return item.id === updatedData.id;
        });

        if (index !== -1) {
          this.lov[6].value[index] = updatedData;
        } else {
          console.warn("Product Category ID not found in the list.");
        }
        this.Form.controls['product_category'].setValue(updatedData.value);

        const statusText = "Product Category updated.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

      } else {
        console.error('Invalid data: Missing ID.');
      }
    });
  }

  delete_reclaimed_product(data: any) {
    this.showProgressPopup();
    const currentValue = this.Form.controls['reclaimed_product'].value;
    this.esgService.deleteEnvNewReclaimedProduct(data.id).subscribe({
      next: (result: any) => {
        this.lov[5].value = this.lov[5].value.filter((item: { id: any; }) => item.id !== data.id);
      },
      error: () => {
        console.error('Error deleting');
      },
      complete: () => {
        Swal.close();
        if (currentValue === data.value) {
        } else {
          this.Form.controls['reclaimed_product'].setValue(currentValue);
        }
        const statusText = "Product/Material deleted.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    });
  }

  delete_product_category(data: any) {
    this.showProgressPopup();
    const currentValue = this.Form.controls['product_category'].value;
    this.esgService.deleteEnvNewProductCategory(data.id).subscribe({
      next: (result: any) => {
        this.lov[6].value = this.lov[6].value.filter((item: { id: any; }) => item.id !== data.id);
      },
      error: () => {
        console.error('Error deleting Product Category');
      },
      complete: () => {
        Swal.close();
        if (currentValue === data.value) {
        } else {
          this.Form.controls['product_category'].setValue(currentValue);
        }
        const statusText = "Product Category deleted.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    });
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

  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      this.showProgressPopup()
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('data', JSON.stringify(this.Form.value))
      this.esgService.updateEnvReclaimedProduct(formData).subscribe({
        next: (result: any) => {
          this.dialogRef.close(this.Form.value);
        },
        error: (err: any) => {

        },
        complete: () => {
          Swal.close()
          const statusText = "Product/Material details modified.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      })
    } else {
      this.dialogRef.close(this.Form.value);
    }
    // this.dialogRef.close(this.Form.value);
  }

}
