import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { ehsCategory } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { NewManufacturerComponent } from './new-manufacturer/new-manufacturer.component';
import { NewEquipmentTypeComponent } from './new-equipment-type/new-equipment-type.component';
import { v4 as uuidv4 } from 'uuid';
const short = require('short-uuid');
import { CurrencyPipe } from '@angular/common';

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
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateComponent implements OnInit {

  currency:any

  files: File[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: string
  Form: FormGroup
  fuelTypes: any[]
  tags: any[] = []
  manufacturer: any[] = []
  manufacturers: any[] = []
  equipmenttype: any[] = []
  equipmentTypes: any[] = []
 // inspectiondate = new FormControl(null, [Validators.required]);
  purchasedate = new FormControl(null, [Validators.required]);

  dropDownValue: any[] = []
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
      ],
    },
  }

  constructor(private equipmentService: EquipmentService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private _snackBar: MatSnackBar,
    private httpClient: HttpClient,
    public dialog: MatDialog,
    private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      reported_date: [new Date()],
      reference_number: [''],
      reporter: [''],
      asset_unique_tag_id: [short.generate()],
      equipment_name: ['', [Validators.required]],
      equipment_type: ['', [Validators.required]],
      manufacturer: ['', [Validators.required]],
      fuel_type: ['', [Validators.required]],
      model: ['', [Validators.required]],
      serial_number: ['', [Validators.required]],
      purchase_price: ['', [Validators.required]],
      purchase_date: ['', [Validators.required]],
      fuel_capacity: ['', [Validators.required]],
      org_id: [''],
      oil_capacity: ['', [Validators.required]],
      last_inspection_date: [''],
      geo_tag_id: [''],
      status: ['Unassigned', [Validators.required]],
      last_odometer_reading:['', [Validators.required]],
      amountVal:[''],
      amount:['']
    });
  }

  

  //check organisation has access
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

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.equipment_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_dropdown_values()
          this.get_manufacturers()
          this.get_equipment_types()
          this.get_tags()
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

  
  //get manufacturers
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

  cost(data: any) {
    const amount = this.currencyPipe.transform(Number(data.target.value), this.currency);
    this.Form.controls['purchase_price'].setValue(data.target.value)
    this.Form.controls['amountVal'].setValue(data.target.value)
    this.costSymbol(Number(data.target.value))
  }

  costSymbol(data: any) {
    console.log(this.currency)
    const amount = this.currencyPipe.transform(data, this.currency);
    this.Form.controls['amount'].setValue(amount)
  }

  get_tags() {
    this.equipmentService.get_tag().subscribe({
      next: (result: any) => {
        console.log(result)
        this.tags = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }


  get_equipment_types() {
    this.equipmentService.get_equipment_type().subscribe({
      next: (result: any) => {
        console.log(result)
        this.equipmentTypes = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
 
 
  inspectionDate(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['last_inspection_date'].setValue(selecteddate)
  }

  purchaseDate(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['purchase_date'].setValue(selecteddate)
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

  new_equipment_type() {
    this.dialog.open(NewEquipmentTypeComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.equipmenttype.find(obj => obj.attributes.name === data.name);
        if (found) {
          const statusText = "Equipment Type already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.equipmentService.create_equipment_type(data, this.Form.value.reporter).subscribe({
            next: (result: any) => {
              this.equipmentService.get_equipment_type().subscribe({
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

  //confirm to creat the transaction
  submit() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showProgressPopup();
        this.create_reference_number()
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
  
  create_reference_number() {
    this.equipmentService.get_equipment().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const newReference = 'EQU-' + newCount
        this.Form.controls['reference_number'].setValue(newReference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_equipment()
      }
    })
  }

  create_equipment() {
    this.equipmentService.create_equipment(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_notification()
      }
    })
  }

 
  create_notification() {
    let data: any[] = []
    data.push({
      module: "Equipment Management",
      action: 'Add an equipment:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.assignee,
      access_link: "/apps/equipment/action/",
      profile: this.Form.value.reporter
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        //Swal.close();
        Swal.fire({
          title: 'Equipment Added',
          imageUrl: "assets/images/update.gif",
          imageWidth: 250,
          text: "You have successfully added a Equipment.",
          showCancelButton: false,

        })
        this.router.navigate(["/apps/equipment-management/equipment/register"])
      }
    })
  }

  
}
