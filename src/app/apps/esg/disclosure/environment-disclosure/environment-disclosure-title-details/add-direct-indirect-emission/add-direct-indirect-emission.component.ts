import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import { AddEmissionIntensityBaseComponent } from './add-emission-intensity-base/add-emission-intensity-base.component';
import Swal from 'sweetalert2';
import { AddUpstreamCategoryComponent } from './add-upstream-category/add-upstream-category.component';
import { AddDownstreamCategoryComponent } from './add-downstream-category/add-downstream-category.component';

@Component({
  selector: 'app-add-direct-indirect-emission',
  templateUrl: './add-direct-indirect-emission.component.html',
  styleUrls: ['./add-direct-indirect-emission.component.scss']
})
export class AddDirectIndirectEmissionComponent implements OnInit {

  Form: FormGroup
  lov: any[] = []
  UpstreamCategoriesarray: any[] = []
  filteredUpstreamCategoriesarray: any[] = []
  DownstreamCategoriesarray: any[] = []
  filteredDownstreamCategoriesarray: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  emission = new FormControl(null);

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddDirectIndirectEmissionComponent>) { }


  ngOnInit() {
    
    this.lov = this.data.lov
  
    this.Form = this.formBuilder.group({
      id: [''],
      scope1: [this.data.data.scope1 || '', Validators.required],
      scope1_unit: [this.lov[45]?.value[0].Value || this.data.data.scope1_unit || '', Validators.required],
      scope2: [this.data.data.scope2 || '', Validators.required],
      scope2_unit: [this.lov[45]?.value[0].Value || this.data.data.scope2_unit || '', Validators.required],
      scope3: [this.data.data.scope3 || '', Validators.required],
      // quantity: [this.data.data.quantity || '', Validators.required],
      // Unit: [this.data.data.unit || '', Validators.required],
      emission_intensity_base: [this.data.data.emission_intensity_base || '', Validators.required],
      emission_intensity_base_unit: [this.data.data.emission_intensity_base_unit || '', Validators.required],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.data.reference_id || ''],
      esg_disclosure: [this.data.refID || ''],
      upstream: [this.data.data.upstream || []],
      downstream: [this.data.data.downstream || []],
    })
    if (this.data.data.emission_intensity_base) {
      this.emission.setValue(this.data.data.emission_intensity_base)
    }
   
    if (this.data.data.esg_env_upstream_categories) {
      this.filteredUpstreamCategoriesarray = this.data.data.esg_env_upstream_categories
    }
    if (this.data.data.upstream) {
      this.UpstreamCategoriesarray = this.data.data.upstream
    }
    if (this.data.data.downstream) {
      this.DownstreamCategoriesarray = this.data.data.downstream
    }
    if (this.data.data.esg_env_downstream_categories) {
      this.filteredDownstreamCategoriesarray = this.data.data.esg_env_downstream_categories
    }
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }

  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('data', JSON.stringify(this.Form.value))
      this.esgService.updateEnvDirectEmission(formData).subscribe({
        next: (result: any) => {
          this.dialogRef.close(this.Form.value);
        },
        error: (err: any) => {

        },
        complete: () => {
          const statusText = "Direct Indirect Emission details modified.";
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

  addUpstreamCategory() {
    this.dialog.open(AddUpstreamCategoryComponent, { width: "740px", data: { lov: this.lov, id: this.data.data.id, mode: 'create', data: [] } }).afterClosed().subscribe(data => {
      if (data) {
        this.UpstreamCategoriesarray.push(data)
        this.Form.controls['upstream'].setValue(this.UpstreamCategoriesarray)
        // this.filteredUpstreamCategoriesarray.push(data)
      }
    })
  }

  addDownstreamCategory() {
    this.dialog.open(AddDownstreamCategoryComponent, { width: "740px", data: { lov: this.lov, id: this.data.data.id, mode: 'create', data: [] } }).afterClosed().subscribe(data => {
      if (data) {
        this.DownstreamCategoriesarray.push(data)
        this.Form.controls['downstream'].setValue(this.DownstreamCategoriesarray)
        // this.filteredDownstreamCategoriesarray.push(data)
      }
    })
  }

  editUpstreamCategory(data: any, index: number) {
    this.dialog.open(AddUpstreamCategoryComponent, { width: "740px", data: { lov: this.lov, data: data, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredUpstreamCategoriesarray.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredUpstreamCategoriesarray[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.UpstreamCategoriesarray[index] = updatedData;
        }
      }
    })
  }

  editDownstreamCategory(data: any, index: number) {
    this.dialog.open(AddDownstreamCategoryComponent, { width: "740px", data: { lov: this.lov, data: data, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredDownstreamCategoriesarray.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredDownstreamCategoriesarray[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.DownstreamCategoriesarray[index] = updatedData;
        }
      }
    })
  }

  deleteUpstreamCategory(data: any, index: number) {
    if (data.id) {
      this.esgService.deleteEnvUpstreamCategory(data.id).subscribe({
        next: (result: any) => {
          this.filteredUpstreamCategoriesarray = this.filteredUpstreamCategoriesarray.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Upstream Category details');
        },
        complete: () => {
          const statusText = "Upstream Category details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredUpstreamCategoriesarray.splice(index, 1);
      this.UpstreamCategoriesarray.splice(index, 1);
      const statusText = "Upstream Category details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  deleteDownstreamCategory(data: any, index: number) {
    if (data.id) {
      this.esgService.deleteEnvDownstreamCategory(data.id).subscribe({
        next: (result: any) => {
          this.filteredDownstreamCategoriesarray = this.filteredDownstreamCategoriesarray.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Downstream Category details');
        },
        complete: () => {
          const statusText = "Downstream Category details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredDownstreamCategoriesarray.splice(index, 1);
      this.DownstreamCategoriesarray.splice(index, 1);
      const statusText = "Downstream Category details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  EmissionChange(data: any) {
    // this.Form.controls['emission_intensity_base'].setValue(data.value.unit.toString())
    this.Form.controls['emission_intensity_base_unit'].setValue(data.unit.toString())
  }

  new_emission_intensity_base() {
    this.dialog.open(AddEmissionIntensityBaseComponent, { width: "500px", data: { userID: this.data.userID, lov: this.lov, mode: 'create' } }).afterClosed().subscribe((data: any) => {
      if (data) {
        this.lov[19].value.push(data)
        this.Form.controls['emission_intensity_base'].setValue(data.value)
        this.Form.controls['emission_intensity_base_unit'].setValue(data.unit)

        const statusText = "Emission Intensity Base created.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }

    })
  }

  modify_emission_intensity_base(data: any) {
    this.dialog.open(AddEmissionIntensityBaseComponent, {
      width: "500px", data: { userID: this.data.userID, mode: 'modify', lov: this.lov, data: data }
    }).afterClosed().subscribe((updatedData: any) => {

      if (updatedData?.id) {
        const index = this.lov[19].value.findIndex((item: any) => {
          return item.id === updatedData.id;
        });

        if (index !== -1) {
          this.lov[19].value[index] = updatedData;
        } else {
          console.warn("Emission Intensity Base ID not found in the list.");
        }
        this.Form.controls['emission_intensity_base'].setValue(updatedData.value);
        this.Form.controls['emission_intensity_base_unit'].setValue(updatedData.unit);

        const statusText = "Emission Intensity Base updated.";
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

  delete_emission_intensity_base(data: any) {
    this.showProgressPopup();
    const currentValue = this.Form.controls['emission_intensity_base'].value;
    this.esgService.deleteEnvEmissionIntensityBase(data.id).subscribe({
      next: (result: any) => {
        this.lov[19].value = this.lov[19].value.filter((item: { id: any; }) => item.id !== data.id);
      },
      error: () => {
        console.error('Error deleting');
      },
      complete: () => {
        Swal.close();
        if (currentValue === data.value) {
        } else {
          this.Form.controls['emission_intensity_base'].setValue(currentValue);
        }
        const statusText = "Emission Intensity Base deleted.";
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
