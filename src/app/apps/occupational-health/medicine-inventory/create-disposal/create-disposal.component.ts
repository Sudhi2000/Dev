import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DropzoneDirective } from 'ngx-dropzone-wrapper';
import { SustainabilityService } from 'src/app/services/sustainability.api.service';
import { CurrencyPipe } from '@angular/common';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';

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
  selector: 'app-create-disposal',
  templateUrl: './create-disposal.component.html',
  styleUrls: ['./create-disposal.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateDisposalComponent implements OnInit {

  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;
  departments: any[] = []
  medicineData: any[] = []
  medicineName: Array<any> = []
  medicineList: Array<any> = []
  medicineCount: number
  currency: any
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  divisions: any[] = []
  peopleList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  dropdownValues: any
  userID: Number
  stockTotal: boolean = false
  OldBalance: number = 0

  stock: boolean = false
  unavailable: boolean = false




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

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,private generalService: GeneralService,
    private medicineService: MedicineInventoryService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sustainabilityService: SustainabilityService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar, private currencyPipe: CurrencyPipe,
    public dialogRef: MatDialogRef<CreateDisposalComponent>) {
  }


  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      reference_number: [''],
      transaction_date: [new Date()],
      reporter: [''],
      unit: [this.defaults.delivered_unit || ''],
      balance: [''],
      balance_quantity: ['', [Validators.required]],
      total_quantity: [this.defaults.balance_quantity || ''],
      medicine: [this.defaults.reference_number+': '+this.defaults.medicine_name || '', [Validators.required]],
      cost: ['', [Validators.required]],
      total_quantity_val: [this.defaults.balance_quantity || ''],
      purchase_amount: [this.defaults.purchased_amount || ''],
      delivered_quantity: [this.defaults.delivered_quantity || ''],
      cost_val: ['', [Validators.required]],
      disposed_quantity:[null, [Validators.required]],
      authorized_contrator:['', [Validators.required]],
      remarks:['', [Validators.required]],


    });
    this.Form.controls['medicine'].disable()
    this.Form.controls['total_quantity_val'].disable()

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health
        this.currency = result.data.attributes.currency
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
        const status = result.med_disposal
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  balCalc(data:any){
    const disposalQuan = Number(data.target.value)
    const avilQuantity = Number(this.Form.value.total_quantity)

    if(disposalQuan>avilQuantity){
      this.Form.controls['cost'].reset()
      this.Form.controls['cost_val'].reset()
      this.Form.controls['cost_val'].disable()
      this.Form.controls['balance_quantity'].reset()
      this.Form.controls['authorized_contrator'].reset()
      this.Form.controls['remarks'].reset()
      this.Form.controls['balance_quantity'].disable()
      this.Form.controls['authorized_contrator'].disable()
      this.Form.controls['remarks'].disable()
  
      this.unavailable=true
    }else{
      this.unavailable=false
      const deliQuantity = this.Form.value.delivered_quantity
      const purchaseAmount = this.Form.value.purchase_amount
      const unit = this.Form.value.unit
      const unitPrice = Number(Number(purchaseAmount)/Number(deliQuantity)).toFixed(2)
      const issuingPrice = Number(unitPrice)*Number(disposalQuan)
      const amount = this.currencyPipe.transform(issuingPrice, this.currency);
      this.Form.controls['cost'].setValue(issuingPrice)
      this.Form.controls['cost_val'].setValue(amount)

      const balQuantity = Number(avilQuantity)-Number(disposalQuan)
      this.Form.controls['balance'].setValue(balQuantity)
      this.Form.controls['balance_quantity'].setValue(balQuantity+' '+unit)
      this.Form.controls['cost_val'].disable()
      this.Form.controls['balance_quantity'].disable()
      this.Form.controls['authorized_contrator'].enable()
      this.Form.controls['remarks'].enable()
    }

  }

  confirm(){
    this.dialogRef.close(this.Form.value)
  }

}
