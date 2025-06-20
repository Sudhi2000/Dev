import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateTransactionComponent implements OnInit {
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
  Division = new FormControl(null, [Validators.required]);

  stock: boolean = false
  unavailable: boolean = false
  unitSpecific: any
  corporateUser: any
  userDivision: any



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
    public dialogRef: MatDialogRef<CreateTransactionComponent>) {
  }


  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      reference_number: [''],
      transaction_date: [new Date()],
      assignee: [null],
      reporter: [''],
      unit: [this.defaults.delivered_unit ],
      balance: ['', [Validators.required]],
      balance_quantity: [''],
      issuing_quantity: ['', [Validators.required]],
      total_quantity: [this.defaults.balance_quantity || '', [Validators.required]],
      authorised_person: ['', [Validators.required]],
      division: ['', [Validators.required]],
      medicine: [this.defaults.reference_number+': '+this.defaults.medicine_name || '', [Validators.required]],
      medicine_name: [' '],
      medicine_uuid: [this.defaults.medicine_uuid],
      business_unit:[null],
      cost: [''],
      total_quantity_val: [this.defaults.balance_quantity || ''],
      purchase_amount: [this.defaults.purchased_amount || ''],
      delivered_quantity: [this.defaults.delivered_quantity || ''],
      cost_val: [''],


    });
    this.Form.controls['medicine'].disable()
    this.Form.controls['total_quantity_val'].disable()

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health
        this.currency = result.data.attributes.currency
        this.unitSpecific = result.data.attributes.business_unit_specific
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
        const status = result.med_create_transaction
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_medicine_data()
          this.get_divisions()
          if(this.unitSpecific){
            this.corporateUser = result.profile.corporate_user
            if(this.corporateUser){
              this.get_profiles()
              
            }else if(!this.corporateUser){
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                // this.divisions.push(elem)  
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_profiles()
            }
          }else{
            this.get_profiles() 
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
 
  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked===false);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
  get_unit_specific_profiles() {
    this.authService.get_unit_specific_profiles(this.orgID,this.userDivision).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked===false);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
  
  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        this.divisions = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_medicine_data() {
  
  }

  unitVal(event: any) {
   
  }
  BusinessUnit(event: any) {         
    this.Form.controls['division'].setValue(event.value.attributes.division_name) 
    this.Form.controls['business_unit'].setValue(event.value.id)      
  }
  balCalc(data: any) {
    const issuingQuan = Number(data.target.value)
    const avilQuantity = Number(this.Form.value.total_quantity)

    if(issuingQuan>avilQuantity){
      this.Form.controls['cost_val'].reset()
      this.Form.controls['cost_val'].disable()

      this.Form.controls['balance_quantity'].reset()
      this.Form.controls['balance_quantity'].disable()

      this.unavailable=true



    }else{
      this.unavailable=false

      const deliQuantity = this.Form.value.delivered_quantity
      const purchaseAmount = this.Form.value.purchase_amount
      const unit = this.Form.value.unit
      const unitPrice = Number(Number(purchaseAmount)/Number(deliQuantity)).toFixed(2)
      const issuingPrice = Number(unitPrice)*Number(issuingQuan)
      const amount = this.currencyPipe.transform(issuingPrice, this.currency);
      this.Form.controls['cost_val'].setValue(amount)
      
      const balQuantity = Number(avilQuantity)-Number(issuingQuan)
      this.Form.controls['balance'].setValue(balQuantity)
      this.Form.controls['balance_quantity'].setValue(balQuantity)
      this.Form.controls['cost_val'].disable()
      this.Form.controls['balance_quantity'].disable()

  

    }
 
  
  }



  confirm() {
    
    this.dialogRef.close(this.Form.value)


  }

}
