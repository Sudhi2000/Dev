import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { CreateIndustryTypeComponent } from '../equipment/create-industry-type/create-industry-type.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { v4 as uuidv4 } from 'uuid';
import { NewManufacturerComponent } from '../equipment/create/new-manufacturer/new-manufacturer.component';
import Swal from 'sweetalert2'
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CurrencyPipe } from '@angular/common';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.api.service';
const short = require('short-uuid');
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
  selector: 'app-create-geo-tag',
  templateUrl: './create-geo-tag.component.html',
  styleUrls: ['./create-geo-tag.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateGeoTagComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Form: FormGroup
  manufacturer: any[] = []
  orgID: any
  manufacturers: any[] = []
  equipments: any[] = []
  currency: any
  manufacturedate = new FormControl(null, [Validators.required]);
  purchasedate = new FormControl(null, [Validators.required]);
  constructor(private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateGeoTagComponent>,
    private currencyPipe: CurrencyPipe,
    private generalService: GeneralService,
    private authService: AuthService) { }

  ngOnInit() {
    this.configuration()

    this.Form = this.formBuilder.group({
      tag_id: [short.generate()],
      date: [new Date()],
      manufacturing_date: ['', [Validators.required]],
      equipment: [null],
      manufacturer: ['', [Validators.required]],
      purchased_date: ['', [Validators.required]],
      price: ['', [Validators.required]],
      reference_number: [''],
      status: ['Open', [Validators.required]],
      org_id:[''],
      reporter:[''],
      purchase_price:[''],
      amountVal:['']
    });

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        console.log(result)

        this.currency = result.data.attributes.currency
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
              this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
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


  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.geo_tag_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_manufacturers()
          this.get_equipment()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  manufactureDate(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['manufacturing_date'].setValue(selecteddate)
  }

  purchaseDate(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['purchased_date'].setValue(selecteddate)
  }
  get_manufacturers() {
    this.equipmentService.get_manufacturer().subscribe({
      next: (result: any) => {
        console.log(result)
        this.manufacturers = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  get_equipment() {
    this.equipmentService.get_equipment().subscribe({
      next: (result: any) => {
        console.log(result)
        this.equipments = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  new_manufacturer() {
    this.dialog.open(NewManufacturerComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.manufacturer.find(obj => obj.attributes.name === data.name);
        if (found) {
          const statusText = "Manufacturer name already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.equipmentService.create_manufacturer(data, this.Form.value.reporter).subscribe({
            next: (result: any) => {
              this.equipmentService.get_manufacturer().subscribe({
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

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }
  submit() {
    this.showProgressPopup();
    this.create_reference_number()
  }


  create_reference_number() {
    this.equipmentService.get_tag().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const newReference = 'TAG-' + newCount
        this.Form.controls['reference_number'].setValue(newReference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_geo_tag()
      }
    })
  }
  create_geo_tag() {

    this.equipmentService.create_geo_tag(this.Form.value).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.close()
        this.dialogRef.close(this.Form.value);
      }
    })
  }

  cost(data: any) {
    const amount = this.currencyPipe.transform(Number(data.target.value), this.currency);
    this.Form.controls['purchase_price'].setValue(data.target.value)
    this.Form.controls['amountVal'].setValue(data.target.value)
    this.costSymbol(Number(data.target.value))
  }

  costSymbol(data: any) {
    console.log(this.currency)
    const amount = this.currencyPipe.transform(data, this.currency);
    this.Form.controls['price'].setValue(amount)
  }
}
