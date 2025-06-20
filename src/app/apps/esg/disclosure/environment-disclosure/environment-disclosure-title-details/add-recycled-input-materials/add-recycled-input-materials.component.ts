import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import { AddNewInputMaterialComponent } from './add-new-input-material/add-new-input-material.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-recycled-input-materials',
  templateUrl: './add-recycled-input-materials.component.html',
  styleUrls: ['./add-recycled-input-materials.component.scss']
})
export class AddRecycledInputMaterialsComponent implements OnInit {

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
    public dialogRef: MatDialogRef<AddRecycledInputMaterialsComponent>) { }


  ngOnInit() {
    this.lov = this.data.lov
    this.Form = this.formBuilder.group({
      id: [''],
      input_material_used: [this.data.data.input_material_used || '', Validators.required],
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

  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      this.showProgressPopup()
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('data', JSON.stringify(this.Form.value))
      this.esgService.updateEnvInputMaterialDetails(formData).subscribe({
        next: (result: any) => {
          this.dialogRef.close(this.Form.value);
        },
        error: (err: any) => {

        },
        complete: () => {
          Swal.close()
          const statusText = "Input Material details modified.";
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

  new_input_material() {
    this.dialog.open(AddNewInputMaterialComponent, { width: "500px", data: { userID: this.data.userID, mode: 'create' } }).afterClosed().subscribe((data: any) => {
      if (data) {

        this.lov[4].value.push(data)
        this.Form.controls['input_material_used'].setValue(data.value)

        const statusText = "Recycled Input Material created.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

      }
    })
  }

  modify_input_material(data: any) {
    this.dialog.open(AddNewInputMaterialComponent, {
      width: "500px", data: { userID: this.data.userID, mode: 'modify', data: data }
    }).afterClosed().subscribe((updatedData: any) => {

      if (updatedData?.id) {
        const index = this.lov[4].value.findIndex((item: any) => {
          return item.id === updatedData.id;
        });

        if (index !== -1) {
          this.lov[4].value[index] = updatedData;
        } else {
          console.warn("material ID not found in the list.");
        }
        this.Form.controls['input_material_used'].setValue(updatedData.value);

        const statusText = "Recycled Input Material updated.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

      } else {
        console.error('Invalid data: Missing material ID.');
      }
    });
  }

  delete_input_material(data: any) {
    this.showProgressPopup();
    const currentValue = this.Form.controls['input_material_used'].value;
    this.esgService.deleteEnvNewInputMaterial(data.id).subscribe({
      next: (result: any) => {
        this.lov[4].value = this.lov[4].value.filter((item: { id: any; }) => item.id !== data.id);
      },
      error: () => {
        console.error('Error deleting input material');
      },
      complete: () => {
        Swal.close();
        if (currentValue === data.value) {
        } else {
          this.Form.controls['input_material_used'].setValue(currentValue);
        }
        const statusText = "Recycled Input Material deleted.";
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

}
