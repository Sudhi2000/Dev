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
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { NewDepartmentComponent } from '../../general-component/new-department/new-department.component';
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
  selector: 'app-chemical-transaction-create',
  templateUrl: './chemical-transaction-create.component.html',
  styleUrls: ['./chemical-transaction-create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChemicalTransactionCreateComponent implements OnInit {

  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;
  departments: any[] = []
  chemicalData: any[] = []
  ChemicalName: Array<any> = []
  ChemicalList: Array<any> = []
  chemicalCount: number
  currency: any
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  ChemicalData: any[] = []
  divisions: any[] = []
  peopleList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  dropdownValues: any
  userID: Number
  stockTotal: boolean = false
  OldBalance: number = 0
  transactiondate = new FormControl(new Date);
  stock: boolean = false
  unavailable: boolean = false
  Division = new FormControl(null, [Validators.required]);
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
    private chemicalService: ChemicalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sustainabilityService: SustainabilityService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar, private currencyPipe: CurrencyPipe,
    public dialogRef: MatDialogRef<ChemicalTransactionCreateComponent>) {
  }


  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      reference_number: [''],
      transaction_date: [new Date()],
      department: ['', [Validators.required]],
      assignee: [null],
      reporter: [''],
      unit: [this.defaults.delivered_unit || '', [Validators.required]],
      balance: ['', [Validators.required]],
      balance_quantity: [''],
      issuing_quantity: ['', [Validators.required]],
      total_quantity: [this.defaults.balance || '', [Validators.required]],
      authorised_person: ['', [Validators.required]],
      division: ['', [Validators.required]],
      chemical: [this.defaults.reference_number+': '+this.defaults.commercial_name || '', [Validators.required]],
      chemical_name: [' '],
      cost: [''],
      total_quantity_val: [this.defaults.balance+' '+this.defaults.delivered_unit || ''],
      purchase_amount: [this.defaults.purchased_amount || ''],
      delivered_quantity: [this.defaults.delivered_quantity || ''],
      cost_val: [''],
      business_unit:[null]

    });
    this.Form.controls['chemical'].disable()
    this.Form.controls['total_quantity_val'].disable()

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.chemical
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
        const status = result.chem_trans_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          // this.get_chemical_department()
          // this.get_profiles()
        
          this.get_divisions()
          this.get_departments()
          this.get_chemical_data()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
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
  // get_divisions() {
  //   this.generalService.get_division(this.orgID).subscribe({
  //     next: (result: any) => { 
  //       const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
  //         id: id as number,
  //         division_name: attributes.division_name,
  //       }));
        
  //       this.divisions =newArray;
  //     },
  //     error: (err: any) => {
  //       this.router.navigate(['/error/internal']);
  //     },
  //     complete: () => { },
  //   });
  // }
  get_departments() {
    this.generalService.get_departments().subscribe({
      next: (result: any) => {
        this.departments = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])

      },
      complete: () => {

      }
    })
  }

  BusinessUnit(event: any) {     
    this.Form.controls['division'].setValue(event.value.attributes.division_name) 
    this.Form.controls['business_unit'].setValue(event.value.id)   
  }

  transactionDate(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['transaction_date'].setValue(selecteddate)
  }
  
  create_new_department() {
    this.dialog.open(NewDepartmentComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const name = data.name
        const user = this.Form.value.reporter
        const found = this.departments.find(obj => obj.attributes.department_name=== name);
      if (found) {
        const statusText = "Department name already exist"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        this.chemicalService.create_department(name, user).subscribe({
          next: (result: any) => {
            this.generalService.get_departments().subscribe({
              next: (result: any) => {
                this.departments = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "New Department Created"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['department'].setValue(result.data.attributes.department_name)
              }
            })

          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
      }
    })

  }

  get_chemical_data() {
  
  }

  unitVal(event: any) {
   
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
      this.Form.controls['balance_quantity'].setValue(balQuantity+' '+unit)
      this.Form.controls['cost_val'].disable()
      this.Form.controls['balance_quantity'].disable()
    }
  }
 
  confirm() {
    
    this.dialogRef.close(this.Form.value)


  }

}
