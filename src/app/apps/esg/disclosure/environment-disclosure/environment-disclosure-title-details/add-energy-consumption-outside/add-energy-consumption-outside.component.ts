import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import { AddUpstreamCategoryOutsideComponent } from './add-upstream-category-outside/add-upstream-category-outside.component';
import { AddDownstreamCategoryOutsideComponent } from './add-downstream-category-outside/add-downstream-category-outside.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-energy-consumption-outside',
  templateUrl: './add-energy-consumption-outside.component.html',
  styleUrls: ['./add-energy-consumption-outside.component.scss']
})
export class AddEnergyConsumptionOutsideComponent implements OnInit {

  Form: FormGroup
  lov: any[] = []
  mode: any
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  upStreamCategory: any[] = []
  downStreamCategory: any[] = []
  filteredupStreamCategory: any[] = []
  filteredDownStreamCategory: any[] = []
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddEnergyConsumptionOutsideComponent>) { }


  ngOnInit() {
    this.lov = this.data.lov
    this.Form = this.formBuilder.group({
      id: [''],
      energy_type: [this.data.data.energy_type || '', Validators.required],
      energy_category: [this.data.data.energy_category || '', Validators.required],
      quantity: [this.data.data.quantity || null],
      unit: [this.lov[43].value[0].Value || this.data.data.unit || ''],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.data.reference_id || ''],
      esg_disclosure: [this.data.refID || ''],
      esg_env_upstream_categories: [],
      esg_env_downstream_categories: []
    })

    this.mode = this.data.mode
    this.upStreamCategory = []
    this.downStreamCategory = []
    if (this.data.data.esg_env_upstream_categories) {
      this.filteredupStreamCategory = this.data.data.esg_env_upstream_categories
    }
    if (this.data.data.esg_env_downstream_categories) {
      this.filteredDownStreamCategory = this.data.data.esg_env_downstream_categories
    }
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }
  isEnergyCategoryReadonly(): boolean {
    return this.data?.data?.energy_category === 'Downstream categories' ||
      this.data?.data?.energy_category === 'Upstream categories';
  }

  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('data', JSON.stringify(this.Form.value))
      this.esgService.updateEnvEnergyConsumptionOutside(formData).subscribe({
        next: (result: any) => {
          this.Form.controls['esg_env_upstream_categories'].setValue(result[0].data[0].esg_env_upstream_categories)
          this.Form.controls['esg_env_downstream_categories'].setValue(result[0].data[0].esg_env_downstream_categories)
          this.dialogRef.close({ formValue: this.Form.value, upStreamCategory: result[0].data[0].esg_env_upstream_categories, downStreamCategory: result[0].data[0].esg_env_downstream_categories });
        },
        error: (err: any) => {

        },
        complete: () => {
          const statusText = "Enegry Consumption details modified.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      })
    } else {
      this.dialogRef.close({ formValue: this.Form.value, upStreamCategory: this.upStreamCategory, downStreamCategory: this.downStreamCategory });
    }
    // this.dialogRef.close(this.Form.value);
  }
  addUpstreamCat() {
    this.dialog.open(AddUpstreamCategoryOutsideComponent, { width: "740px", data: { lov: this.lov, data: [], id: this.data.data.id, mode: 'create' } }).afterClosed().subscribe(data => {
      if (data) {
        this.upStreamCategory.push(data)
        // this.filteredupStreamCategory.push(data)
        this.Form.controls['esg_env_upstream_categories'].setValue(this.upStreamCategory)
      }
    })
  }
  addDownstreamCat() {
    this.dialog.open(AddDownstreamCategoryOutsideComponent, { width: "740px", data: { lov: this.lov, data: [], id: this.data.data.id, mode: 'create' } }).afterClosed().subscribe(data => {
      if (data) {
        this.downStreamCategory.push(data)
        // this.filteredDownStreamCategory.push(data)
        this.Form.controls['esg_env_downstream_categories'].setValue(this.downStreamCategory)
      }
    })
  }
  editUpstreamCat(data: any, index: number) {
    this.dialog.open(AddUpstreamCategoryOutsideComponent, { width: "740px", data: { lov: this.lov, data: data, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredupStreamCategory.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredupStreamCategory[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.upStreamCategory[index] = updatedData;
        }
      }
    })
  }
  editDownstreamCat(data: any, index: number) {
    this.dialog.open(AddDownstreamCategoryOutsideComponent, { width: "740px", data: { lov: this.lov, data: data, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredDownStreamCategory.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredDownStreamCategory[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.downStreamCategory[index] = updatedData;
        }
      }
    })
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
  deleteUpstreamCat(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvRenewableFuel(data.id).subscribe({
        next: (result: any) => {
          this.filteredupStreamCategory = this.filteredupStreamCategory.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Upstream Category details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Upstream Category details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredupStreamCategory.splice(index, 1);
      this.upStreamCategory.splice(index, 1);
      const statusText = "Upstream Category details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
  deleteDownstreamCat(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvRenewableFuel(data.id).subscribe({
        next: (result: any) => {
          this.filteredDownStreamCategory = this.filteredDownStreamCategory.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Down Stream Category details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Down stream Category details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredDownStreamCategory.splice(index, 1);
      this.downStreamCategory.splice(index, 1);
      const statusText = "Downstream Category details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
}
