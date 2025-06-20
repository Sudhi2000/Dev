import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import { AddRenewableFuelComponent } from './add-renewable-fuel/add-renewable-fuel.component';
import { AddNonRenewableFuelComponent } from './add-non-renewable-fuel/add-non-renewable-fuel.component';
import Swal from 'sweetalert2';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-add-energy-consumption-within',
  templateUrl: './add-energy-consumption-within.component.html',
  styleUrls: ['./add-energy-consumption-within.component.scss']
})
export class AddEnergyConsumptionWithinComponent implements OnInit {

  Form: FormGroup
  lov: any[] = []
  mode: any
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  RenewableFuelsarray: any[] = []
  filteredRenewableFuelsarray: any[] = []
  NonRenewableFuelsarray: any[] = []
  filteredNonRenewableFuelsarray: any[] = []

  renewableFuelnames: any[] = []
  nonRenewableFuelnames: any[] = []
  deletedRenewableIndexes: number[] = [];
  deletedNonRenewableIndexes: number[] = [];

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEnergyConsumptionWithinComponent>) { }


  ngOnInit() {
    this.deletedRenewableIndexes = [];
    this.deletedNonRenewableIndexes = [];
    this.lov = this.data.lov;

    this.Form = this.formBuilder.group({
      id: [''],
      energy_type: [this.data.data.energy_type || '', Validators.required],
      quantity: [this.data.data.quantity || null, Validators.required],
      quantityMWh: [null],
      unit: [this.lov[43].value[0].Value || this.data.data.unit || ''],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.data.reference_id || ''],
      esg_disclosure: [this.data.refID || ''],
      esg_env_renewable_fuels: [],
      esg_env_nonrenewable_fuels: []
    });
    this.mode = this.data.mode;
    this.RenewableFuelsarray = [];
    this.NonRenewableFuelsarray = [];
    if (this.data.data.energy_type === 'Renewable Fuel' || this.data.data.energy_type === 'Non Renewable Fuel') {
      this.Form.controls['quantity'].removeValidators(Validators.required);
      this.Form.controls['quantity'].updateValueAndValidity();
    }
    if (Array.isArray(this.data.data.esg_env_renewable_fuels)) {
      this.filteredRenewableFuelsarray = this.data.data.esg_env_renewable_fuels.filter((item: any) => {
        return item?.id != null;
      });
      this.RenewableFuelsarray = this.data.data.esg_env_renewable_fuels.filter((item: any) => {
        return item?.id == null;
      });

      this.Form.get('esg_env_renewable_fuels')?.setValue(this.RenewableFuelsarray);
    } else {
      this.filteredRenewableFuelsarray = [];
      this.RenewableFuelsarray = [];
    }

    if (Array.isArray(this.data.data.esg_env_nonrenewable_fuels)) {
      this.filteredNonRenewableFuelsarray = this.data.data.esg_env_nonrenewable_fuels.filter((item: any) => {
        return item?.id != null;
      });
      this.NonRenewableFuelsarray = this.data.data.esg_env_nonrenewable_fuels.filter((item: any) => {
        return item?.id == null;
      });
      this.Form.get('esg_env_nonrenewable_fuels')?.setValue(this.NonRenewableFuelsarray);
    } else {
      this.filteredNonRenewableFuelsarray = [];
      this.NonRenewableFuelsarray = [];
    }
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }

  toMWh() {
    const quantity = this.Form.value.quantity ? Number(this.Form.value.quantity) : 0;
    const convertedQuantity = quantity / 1000;
    this.Form.controls['quantityMWh'].setValue(convertedQuantity);
  }

  isEnergyTypeReadonly(): boolean {
    return this.data?.data?.energy_type === 'Renewable Fuel' ||
      this.data?.data?.energy_type === 'Non Renewable Fuel';
  }
  getUsedEnergyTypes(): string[] {
    return this.data?.ConsumptionWithinDetails?.concat(this.data?.filteredConsumptionWithinDetails || [])
      .map((item: any) => item.energy_type) || [];
  }

  checkFuelNames(event: MatSelectChange) {
    this.renewableFuelnames = []
    this.nonRenewableFuelnames = []
    if (event.value === 'Renewable Fuel' || event.value === 'Non Renewable Fuel') {
      this.Form.controls['quantity'].removeValidators(Validators.required);
      this.Form.controls['quantity'].updateValueAndValidity();
    }
    if (event.value == "Renewable Fuel") {

      this.renewableFuelnames.push(...this.lov[10].value.filter((fuel: any) => fuel.filter === 'renewable'));

    }
    else if (event.value === 'Non Renewable Fuel') {

      this.nonRenewableFuelnames.push(...this.lov[10].value.filter((fuel: any) => fuel.filter === 'non renewable'));

    }
  }
  addRenewableFuel() {
    this.checkFuelNames({ value: 'Renewable Fuel' } as MatSelectChange);
    this.dialog.open(AddRenewableFuelComponent, { width: "740px", data: { lov: this.lov, id: this.data.data, mode: 'create', renewableFuelnames: this.renewableFuelnames } }).afterClosed().subscribe(data => {
      if (data) {
        this.renewableFuelnames = []

        this.RenewableFuelsarray.push(data.formData)
        this.lov = []
        this.lov = data.LOV
        this.renewableFuelnames.push(...this.lov[10].value.filter((fuel: any) => fuel.filter === 'renewable'));


        // this.filteredRenewableFuelsarray.push(data)
        this.Form.controls['esg_env_renewable_fuels'].setValue(this.RenewableFuelsarray)
      }

    })
  }

  addNonRenewableFuel() {
    this.checkFuelNames({ value: 'Non Renewable Fuel' } as MatSelectChange);
    this.dialog.open(AddNonRenewableFuelComponent, { width: "740px", data: { lov: this.lov, id: this.data.data.id, mode: 'create', nonRenewableFuelnames: this.nonRenewableFuelnames } }).afterClosed().subscribe(data => {
      if (data) {

        this.nonRenewableFuelnames = []
        this.NonRenewableFuelsarray.push(data.formData)

        this.lov = []
        this.lov = data.LOV
        this.nonRenewableFuelnames.push(...this.lov[10].value.filter((fuel: any) => fuel.filter === 'non renewable'));

        // this.filteredNonRenewableFuelsarray.push(data)
        this.Form.controls['esg_env_nonrenewable_fuels'].setValue(this.NonRenewableFuelsarray)

      }
    })
  }

  editRenewableFuel(data: any, index: number) {
    this.checkFuelNames({ value: 'Renewable Fuel' } as MatSelectChange); // Manually trigger to set renewableFuelnames

    this.dialog.open(AddRenewableFuelComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        mode: 'modify',
        renewableFuelnames: this.renewableFuelnames
      }
    }).afterClosed().subscribe(updatedData => {

      if (updatedData) {
        if (updatedData.formData.id) {
          const index = this.filteredRenewableFuelsarray.findIndex(item => item.id === updatedData.formData.id);
          if (index !== -1) {
            this.filteredRenewableFuelsarray[index] = updatedData.formData;
          }
        } else if (index !== undefined) {
          this.RenewableFuelsarray[index] = updatedData.formData;
        }
      }
    });
  }

  editNonRenewableFuel(data: any, index: number) {
    this.checkFuelNames({ value: 'Non Renewable Fuel' } as MatSelectChange);

    this.dialog.open(AddNonRenewableFuelComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        mode: 'modify',
        nonRenewableFuelnames: this.nonRenewableFuelnames
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {

        if (updatedData.formData.id) {
          const index = this.filteredNonRenewableFuelsarray.findIndex(item => item.id === updatedData.formData.id);
          if (index !== -1) {
            this.filteredNonRenewableFuelsarray[index] = updatedData.formData;
          }
        } else if (index !== undefined) {
          this.NonRenewableFuelsarray[index] = updatedData.formData;
        }
      }
    });
  }

  deleteRenewableFuel(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup();
      this.esgService.deleteEnvRenewableFuel(data.id).subscribe({
        next: () => {
          this.filteredRenewableFuelsarray = this.filteredRenewableFuelsarray.filter(item => item.id !== data.id);
          this.deletedRenewableIndexes.push(index);
        },
        error: () => {
          console.error('Error deleting Renewable Fuel details');
        },
        complete: () => {
          Swal.close();
          this._snackBar.open("Renewable Fuel details deleted.", 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      this.RenewableFuelsarray.splice(index, 1);
      // this.deletedRenewableIndexes.push(index);
      this._snackBar.open("Renewable Fuel details deleted.", 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  deleteNonRenewableFuel(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup();
      this.esgService.deleteEnvNonRenewableFuel(data.id).subscribe({
        next: () => {
          this.filteredNonRenewableFuelsarray = this.filteredNonRenewableFuelsarray.filter(item => item.id !== data.id);
          this.deletedNonRenewableIndexes.push(index);
        },
        error: () => {
          console.error('Error deleting Nonrenewable Fuel details');
        },
        complete: () => {
          Swal.close();
          this._snackBar.open("Nonrenewable Fuel details deleted.", 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      this.NonRenewableFuelsarray.splice(index, 1);
      // this.deletedNonRenewableIndexes.push(index);
      this._snackBar.open("Nonrenewable Fuel details deleted.", 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
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
  isSubmitDisabled(): boolean {
    const energyType = this.Form.value.energy_type;

    if (energyType === 'Renewable Fuel') {
      return this.RenewableFuelsarray.length === 0;
    }
    if (energyType === 'Non Renewable Fuel') {
      return this.NonRenewableFuelsarray.length === 0;
    }
    return !this.Form.value.quantity; // For other energy types, ensure quantity is filled
  }

  submit() {
    const energyType = this.Form.value.energy_type;

    if (energyType === 'Renewable Fuel') {
      if (this.RenewableFuelsarray.length === 0 && this.filteredRenewableFuelsarray.length === 0) {
        this._snackBar.open("Add atleast one renewable fuel", 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        return;
      }
    } else if (energyType === 'Non Renewable Fuel') {
      if (this.NonRenewableFuelsarray.length === 0 && this.filteredNonRenewableFuelsarray.length === 0) {
        this._snackBar.open("Add atleast one non renewable fuel", 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        return;
      }
    }

    this.toMWh();

    if (this.data.mode === 'modify' && this.data.data.id) {
      this.showProgressPopup();
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id);
      formData.append('data', JSON.stringify(this.Form.value));

      this.esgService.updateEnvEnergyConsumptionWithin(formData).subscribe({
        next: (result: any) => {
          const dataArray = result[0].data;

          const allNonRenewableFuels = dataArray.flatMap(
            (entry: any) => entry.esg_env_nonrenewable_fuels || []
          );
          const allRenewableFuels = dataArray.flatMap(
            (entry: any) => entry.esg_env_renewable_fuels || []
          );

          const energyType = this.Form.get('energy_type')?.value;

          if (energyType === 'Renewable Fuel') {
            this.Form.controls['esg_env_renewable_fuels'].setValue(allRenewableFuels);
            this.RenewableFuelsarray = allRenewableFuels;
          } else if (energyType === 'Non Renewable Fuel') {
            this.Form.controls['esg_env_nonrenewable_fuels'].setValue(allNonRenewableFuels);
            this.NonRenewableFuelsarray = allNonRenewableFuels;
          }

          this.dialogRef.close({
            formValue: this.Form.value,
            renewableFuels: this.RenewableFuelsarray,
            NonrenewableFuels: this.NonRenewableFuelsarray
          });
        },
        error: (err: any) => {
          Swal.close();
          console.error("Update error:", err);
          this._snackBar.open("Failed to update Energy Consumption", 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        },
        complete: () => {
          Swal.close();
          const statusText = "Energy Consumption details modified.";
          this.RenewableFuelsarray = [];
          this.NonRenewableFuelsarray = [];
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      this.dialogRef.close({
        formValue: this.Form.value,
        renewableFuels: this.RenewableFuelsarray,
        NonrenewableFuels: this.NonRenewableFuelsarray
      });
    }
  }
  onCancel() {
    if (this.deletedRenewableIndexes.length > 0 || this.deletedNonRenewableIndexes.length > 0) {
      this.dialogRef.close({
        deletedRenewableIndexes: this.deletedRenewableIndexes,
        deletedNonRenewableIndexes: this.deletedNonRenewableIndexes,
        formValue: this.data.data
      });
    } else {
      this.dialogRef.close();
    }
  }


}
