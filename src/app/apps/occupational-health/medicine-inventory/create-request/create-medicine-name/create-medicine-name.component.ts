import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';
import { CreateMedicineTypeComponent } from '../../modify-inventory/create-medicine-type/create-medicine-type.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';
import { MatSnackBar,MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition  } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-medicine-name',
  templateUrl: './create-medicine-name.component.html',
  styleUrls: ['./create-medicine-name.component.scss']
})
export class CreateMedicineNameComponent implements OnInit {

  Form: FormGroup
  medicineTypes: any[] = []
  medicineForm: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
  private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateMedicineNameComponent> ,
    private medicineService: MedicineInventoryService,
    private generalService: GeneralService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,) {
      
     }
    
  ngOnInit() {
  
    this.Form = this.formBuilder.group({
      id:[''],
      name: ['', [Validators.required]],
      uuid: [uuidv4(), [Validators.required]],
      generic_name:[''],
      dosage_strength:[''],
      form:[''],
      medicine_type:['']

    });

    this.get_medicine_type()
    this.get_medicine_forms()

    if (this.defaults) {
      this.mode = 'update';
      this.get_medicine_name_by_id(this.defaults)
      this.Form.controls['id'].setValue(this.defaults.toString())
    }

  }



  get_medicine_type() {
    this.medicineService.get_medicine_type().subscribe({
      next: (result: any) => {
        this.medicineTypes = result.data
      }
    })
  }
  get_medicine_forms() {
    const module = "Occupational Health"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {

        const form = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Medicine Form")
        })
        this.medicineForm = form
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_medicine_name_by_id(id: any) {
      this.medicineService.get_MedicineName_details(id).subscribe({
        next: (result: any) => {
          this.Form.controls['name'].setValue(result.data.attributes.name)
          this.Form.controls['generic_name'].setValue(result.data.attributes.generic_name)
          this.Form.controls['dosage_strength'].setValue(result.data.attributes.dosage_strength )
          this.get_medicine_type()
          this.get_medicine_forms()
          this.Form.controls['form'].setValue(result.data.attributes.form)
          this.Form.controls['medicine_type'].setValue(result.data.attributes.medicine_type)
         
         
        },
        error: (err: any) => { },
        complete: () => { }
      })
    }

  new_type() {
    this.dialog.open(CreateMedicineTypeComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        this.medicineService.create_medicine_type(data.type, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.medicineService.get_medicine_type().subscribe({
              next: (result: any) => {
                this.medicineTypes = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Medicine type created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['medicine_type'].setValue(result.data.attributes.type)

              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })
      }
    })
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }
}
