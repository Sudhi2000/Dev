import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { CreateIndustryTypeComponent } from '../equipment/create-industry-type/create-industry-type.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { NewManufacturerComponent } from '../equipment/create/new-manufacturer/new-manufacturer.component';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
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
  selector: 'app-modify-geo-tag',
  templateUrl: './modify-geo-tag.component.html',
  styleUrls: ['./modify-geo-tag.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ModifyGeoTagComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Form: FormGroup
  manufacturer: any[] = []
  manufacturers: any[] = []
  equipments: any[] = []
  orgID:any
  currency:any
  manufacturedate = new FormControl(null, [Validators.required]);
  purchasedate = new FormControl(null, [Validators.required]);
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
  private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModifyGeoTagComponent>,
    private currencyPipe: CurrencyPipe,
    private generalService: GeneralService,
    private authService: AuthService) { }
    
  ngOnInit() {
    this.configuration()

    this.Form = this.formBuilder.group({
      id:[this.defaults.id],
      equipment: [this.defaults.attributes?.equipment?.data?.id || null],
      manufacturer: [this.defaults.attributes.manufacturer.data.id || null],
      price: [],
      status: [this.defaults.attributes.status || ''],
      purchase_price:[''],
      amountVal:[''],
      org_id:[''],
      reporter:['']
      
    });
    this.manufacturedate.setValue(new Date(this.defaults.attributes.manufacturing_date))
    this.purchasedate.setValue(new Date(this.defaults.attributes.purchased_date))

   

    
    
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
          const amount = this.currencyPipe.transform(this.defaults.attributes.price, this.currency);
          this.Form.controls['price'].setValue(amount)
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
        this.equipments = result.data

        // this.Form.controls['equipment'].setValue(this.defaults.attributes.equipment.data.id)
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
    this.update_tag()
  
  }
 
  update_tag() {
    console.log(this.Form.value)
    this.equipmentService.update_tag(this.Form.value).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { 
        Swal.close()
        this.dialogRef.close(this.Form.value);}
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
