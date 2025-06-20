import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-materials-used',
  templateUrl: './add-materials-used.component.html',
  styleUrls: ['./add-materials-used.component.scss']
})
export class AddMaterialsUsedComponent implements OnInit {


  Form: FormGroup
  lov: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddMaterialsUsedComponent>) { }


  ngOnInit() {
    this.lov = this.data.lov    
    this.Form = this.formBuilder.group({
      id: [''],
      material_used: [this.data.data.material_used || '', Validators.required],
      material_type: [this.data.data.material_type || '', Validators.required],
      quantity: [this.data.data.quantity || null, Validators.required],
      unit: [ this.lov[42]?.value[0].Value || this.data.data.unit || '', Validators.required],
      source: [this.data.data.source || '', Validators.required],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.data.reference_id || ''],
      esg_disclosure: [this.data.refID || ''],
    })

    if (this.data.mode === 'view') {
      this.Form.disable();
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
  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      this.showProgressPopup()
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('data', JSON.stringify(this.Form.value))
      this.esgService.updateEnvMaterialDetails(formData).subscribe({
        next: (result: any) => {
          this.dialogRef.close(this.Form.value);
        },
        error: (err: any) => {

        },
        complete: () => {
          Swal.close()
          const statusText = "Material details modified.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      })
    } else {
      // const statusText = "Material details added.";
      // this._snackBar.open(statusText, 'OK', {
      //   duration: 3000,
      //   horizontalPosition: this.horizontalPosition,
      //   verticalPosition: this.verticalPosition,
      // });
      this.dialogRef.close(this.Form.value);
    }
  }

}
