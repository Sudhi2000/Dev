import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
const short = require('short-uuid');
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NewManufacturerComponent } from './new-manufacturer/new-manufacturer.component';
import { NewEquipmentTypeComponent } from './new-equipment-type/new-equipment-type.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-create-equipment',
  templateUrl: './create-equipment.component.html',
  styleUrls: ['./create-equipment.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateEquipmentComponent implements OnInit {
  Form: FormGroup
  mode: 'create' | 'update' = 'create';
  orgID: string
  fuelTypes: any[]
  tags: any[] = []
  manufacturers: any[] = []
  equipmentTypes: any[] = []
  // inspectiondate = new FormControl(null, [Validators.required]);
  purchasedate = new FormControl(null, [Validators.required]);
  dropDownValue: any;
  currency: any
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateEquipmentComponent>,
    private EnvironmentService: EnvironmentService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    if (this.defaults) {
      this.mode = 'update';
      // this.get_commercial_name_by_id(this.defaults)
      this.Form = this.formBuilder.group({
        id: [this.defaults?.id],
        reported_date: [new Date()],
        identification_code: [this.defaults?.attributes?.identification_code],
        reporter: [this.defaults?.attributes?.reporter],
        asset_unique_tag_id: [this.defaults?.attributes?.asset_unique_tag_id],
        equipment_name: [this.defaults?.attributes?.equipment_name, [Validators.required]],
        equipment_type: [this.defaults?.attributes?.equipment_type, [Validators.required]],
        manufacturer: [this.defaults?.attributes?.manufacturer, [Validators.required]],
        fuel_type: [this.defaults?.attributes?.fuel_type, [Validators.required]],
        model: [this.defaults?.attributes?.model, [Validators.required]],
        serial_number: [this.defaults?.attributes?.serial_number, [Validators.required]],
        purchase_price: [this.defaults?.attributes?.purchase_price, [Validators.required]],
        purchase_date: [this.defaults?.attributes?.purchase_date, [Validators.required]],
        fuel_capacity: [this.defaults?.attributes?.fuel_capacity, [Validators.required]],
        org_id: [this.defaults?.attributes?.org_id],
        oil_capacity: [this.defaults?.attributes?.oil_capacity, [Validators.required]],
        // last_inspection_date: [''],
        // geo_tag_id: [''],
        status: [this.defaults?.attributes?.status, [Validators.required]],
        // last_odometer_reading: ['', [Validators.required]],
        amountVal: [this.defaults?.attributes?.amountVal],
        amount: [this.defaults?.attributes?.purchase_price]
      });

      this.purchasedate.setValue(new Date(this.defaults?.attributes.purchase_date))
    } else {
      this.Form = this.formBuilder.group({
        id: [''],
        equipment_name: ['', [Validators.required]],
        equipment_type: ['', [Validators.required]],
        identification_code: [''],
        manufacturer: ['', [Validators.required]],
        model: ['', [Validators.required]],
        brand: ['', [Validators.required]],
        capacity: ['', [Validators.required]],
        installation_date: ['', [Validators.required]],
        installation_location: ['', [Validators.required]],


        reported_date: [new Date()],
      });
    }


    this.configuration()
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {

        const status = result.data.attributes.modules.equipment
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
              // this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
            }
          }
          this.me()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.env_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_dropdown_values()
          this.get_manufacturers()
          this.get_equipment_types()
          // this.get_tags()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  //get dropdown values
  get_dropdown_values() {
    const module = "Equipment Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValue = result.data
        const type = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Fuel Type")
        })
        this.fuelTypes = type
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  new_equipment_type() {
    this.dialog.open(NewEquipmentTypeComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.equipmentTypes.find(obj => obj.attributes.name === data.name);
        if (found) {
          const statusText = "Equipment Type already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.EnvironmentService.create_equipment_type(data, this.Form.value.reporter).subscribe({
            next: (result: any) => {
              this.EnvironmentService.get_equipment_type().subscribe({
                next: (result: any) => {
                  this.equipmentTypes = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Equipment Type created successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['equipment_type'].setValue(result.data.attributes.name)

                }
              })
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => { }
          })
        }

      }
    })
  }


  //get manufacturers
  get_manufacturers() {
    this.EnvironmentService.get_manufacturer().subscribe({
      next: (result: any) => {
        this.manufacturers = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_equipment_types() {
    this.EnvironmentService.get_equipment_type().subscribe({
      next: (result: any) => {
        this.equipmentTypes = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  purchaseDate(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['installation_date'].setValue(selecteddate)
  }

  submit() {
    if (this.mode == 'update') {
      this.dialogRef.close(this.Form.value);
    } else {
      this.EnvironmentService.get_equipment().subscribe({
        next: (result: any) => {
          const count = result.data.length
          const newCount = Number(count) + 1
          const newReference = 'EQU-' + newCount
          this.Form.controls['identification_code'].setValue(newReference)
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          this.dialogRef.close(this.Form.value);
        }
      })
    }
  }

  new_manufacturer() {
    this.dialog.open(NewManufacturerComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.manufacturers.find(obj => obj.attributes.name === data.name);
        if (found) {
          const statusText = "Manufacturer name already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.EnvironmentService.create_manufacturer(data, this.Form.value.reporter).subscribe({
            next: (result: any) => {
              this.EnvironmentService.get_manufacturer().subscribe({
                next: (result: any) => {
                  this.manufacturers = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Manufacturer name created successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['manufacturer'].setValue(result.data.attributes.name)

                }
              })
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => { }
          })
        }

      }
    })
  }

}
