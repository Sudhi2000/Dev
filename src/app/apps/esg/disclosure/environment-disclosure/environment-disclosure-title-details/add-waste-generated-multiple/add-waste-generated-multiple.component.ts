import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';
import { AddNewTypeOfWasteComponent } from '../add-waste-generated/add-new-type-of-waste/add-new-type-of-waste.component';


@Component({
  selector: 'app-add-waste-generated-multiple',
  templateUrl: './add-waste-generated-multiple.component.html',
  styleUrls: ['./add-waste-generated-multiple.component.scss']
})
export class AddWasteGeneratedMultipleComponent implements OnInit {

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
    public dialogRef: MatDialogRef<AddWasteGeneratedMultipleComponent>) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      id: [''],
      type_of_waste: [this.data.data.type_of_waste || '', Validators.required],
      category: [this.data.data.category || '', Validators.required],
      esg_disclosure: [this.data.refID || ''],
      title_ref_id: [this.data.data.reference_id || ''],
    })
    this.lov = this.data.lov
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }

  new_type_of_waste() {
    this.dialog.open(AddNewTypeOfWasteComponent, { width: "500px", data: { userID: this.data.userID, mode: 'create' } }).afterClosed().subscribe((data: any) => {
      this.lov[22].value.push(data)
      this.Form.controls['type_of_waste'].setValue(data.value)

      const statusText = "Type of Waste created.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

    })
  }


  modify_type_of_waste(data: any) {
    this.dialog.open(AddNewTypeOfWasteComponent, {
      width: "500px", data: { userID: this.data.userID, mode: 'modify', data: data }
    }).afterClosed().subscribe((updatedData: any) => {

      if (updatedData?.id) {
        const index = this.lov[22].value.findIndex((item: any) => {
          return item.id === updatedData.id;
        });

        if (index !== -1) {
          this.lov[22].value[index] = updatedData;
        } else {
          console.warn("Type of Waste ID not found in the list.");
        }
        this.Form.controls['type_of_waste'].setValue(updatedData.value);

        const statusText = "Type of Waste updated.";
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

  delete_type_of_waste(data: any) {
    this.showProgressPopup();
    const currentValue = this.Form.controls['type_of_waste'].value;
    this.esgService.deleteEnvTypeofWaste(data.id).subscribe({
      next: (result: any) => {
        this.lov[22].value = this.lov[22].value.filter((item: { id: any; }) => item.id !== data.id);
      },
      error: () => {
        console.error('Error deleting');
      },
      complete: () => {
        Swal.close();
        if (currentValue === data.value) {
        } else {
          this.Form.controls['type_of_waste'].setValue(currentValue);
        }
        const statusText = "Type of Waste deleted.";
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
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('data', JSON.stringify(this.Form.value))
      this.esgService.updateEnvTypeofWasteData(formData).subscribe({
        next: (result: any) => {
          this.dialogRef.close(this.Form.value);
        },
        error: (err: any) => {

        },
        complete: () => {
          const statusText = "Type of Waste details modified.";
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
