import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';
import { AddNewFuelNameComponent } from '../add-new-fuel-name/add-new-fuel-name.component';

@Component({
  selector: 'app-add-renewable-fuel',
  templateUrl: './add-renewable-fuel.component.html',
  styleUrls: ['./add-renewable-fuel.component.scss']
})
export class AddRenewableFuelComponent implements OnInit {
  Form: FormGroup
  lov: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  renewableFuelnames: any[] = []

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddRenewableFuelComponent>) { }



  ngOnInit(): void {
    this.renewableFuelnames = []
    this.lov = []
    this.lov = this.data.lov
    this.Form = this.formBuilder.group({
      id: [this.data.data?.id||null],
      renewable_fuel_name: [this.data.data?.renewable_fuel_name || '', Validators.required],
      quantity: [this.data.data?.quantity || null, Validators.required],
      quantityMWh: [null],
      unit: [this.lov[43].value[0].Value || this.data.data?.unit || '', Validators.required],
    })

    this.renewableFuelnames = this.data.renewableFuelnames

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
  newFuelName() {

    this.dialog.open(AddNewFuelNameComponent, { width: "500px", data: { userID: this.data.userID, mode: 'create', energyType: 'renewable' } }).afterClosed().subscribe((data: any) => {
      if (data) {

        this.lov[10].value.push(data)
        // Prevent duplicates
        if (!this.renewableFuelnames.some((fuel) => fuel.id === data.id)) {
          this.renewableFuelnames.push(data);
        }

        this.Form.controls['renewable_fuel_name'].setValue(data.value)

        const statusText = "Fuel name created.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

      }
    })
  }

  modifyFuelName(data: any) {
  this.dialog.open(AddNewFuelNameComponent, {
    width: "500px",
    data: {
      userID: this.data.userID,
      mode: 'modify',
      data: data,
      energyType: 'renewable'
    }
  }).afterClosed().subscribe((updatedData: any) => {
    if (updatedData?.id) {
      const index = this.renewableFuelnames.findIndex((item: any) => item.id === updatedData.id);
      if (index !== -1) {
        this.renewableFuelnames[index] = updatedData;
      } else {
        console.warn("Fuel ID not found in renewableFuelnames.");
      }

      const lovIndex = this.lov[10].value.findIndex((item: any) => item.id === updatedData.id);
      if (lovIndex !== -1) {
        this.lov[10].value[lovIndex] = updatedData;
      } else {
        console.warn("Fuel ID not found in lov[10].value.");
      }

      this.Form.controls['renewable_fuel_name'].setValue(updatedData.value);

      const statusText = "Renewable fuel name updated.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

    } else {
      console.error('Invalid data: Missing fuel name ID.');
    }
  });
}

  deleteFuelName(data: any) {
    this.showProgressPopup();
    const currentValue = this.Form.controls['renewable_fuel_name'].value;
    this.esgService.deleteEnvNewFuelName(data.id).subscribe({
      next: (result: any) => {
        this.lov[10].value = this.lov[10].value.filter((item: { id: any; }) => item.id !== data.id);

        // Remove from renewableFuelnames array
        this.renewableFuelnames = this.renewableFuelnames.filter((fuel) => fuel.id !== data.id);

        this.Form.controls['renewable_fuel_name'].reset()
      },
      error: () => {
        console.error('Error deleting fuel name');
      },
      complete: () => {

        Swal.close();
        if (currentValue === data.value) {
        } else {
          this.Form.controls['renewable_fuel_name'].setValue(currentValue);
        }
        const statusText = "Renewable fuel name deleted.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    });
  }

  toMWh() {
    const quantity = this.Form.value.quantity ? Number(this.Form.value.quantity) : 0;
    const convertedQuantity = quantity / 1000;
    this.Form.controls['quantityMWh'].setValue(convertedQuantity);
  }



  submit() {
   
   this.toMWh()
   const data = { formData: this.Form.value, LOV: this.lov }
   if (this.data.mode === 'modify' && this.data.data.id) {
      this.showProgressPopup()
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('data', JSON.stringify(this.Form.value))
      this.esgService.updateEnvRenewableFuel(formData).subscribe({
        next: (result: any) => {
          this.dialogRef.close(data);
        },
        error: (err: any) => {

        },
        complete: () => {
          Swal.close()
          const statusText = "Renewable fuel details modified.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      })
    } else {

      this.dialogRef.close(data);
      // const formData = new FormData();
      // this.Form.controls['id'].setValue(this.data.id)
      // formData.append('data', JSON.stringify([this.Form.value]))
      // this.esgService.createEnvRenewableFuel(formData).subscribe({
      //   next: (result: any) => {
      //     this.dialogRef.close(result.data);
      //   },
      //   error: (err: any) => {

      //   },
      //   complete: () => {
      //     const statusText = "Renewable fuel details Created.";
      //     this._snackBar.open(statusText, 'OK', {
      //       duration: 3000,
      //       horizontalPosition: this.horizontalPosition,
      //       verticalPosition: this.verticalPosition,
      //     });
      //   }
      // })
    }
    // this.dialogRef.close(this.Form.value);
  }
 
}
