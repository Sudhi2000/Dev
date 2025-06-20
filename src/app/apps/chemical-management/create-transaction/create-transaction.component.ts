import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DropzoneDirective } from 'ngx-dropzone-wrapper';
import { SustainabilityService } from 'src/app/services/sustainability.api.service';
import { ChemicalService } from 'src/app/services/chemical.api.service';

// import { NewDepartmentComponent } from '../new-department/new-department.component';
import { NewSupplierComponent } from '../new-supplier/new-supplier.component';
import { NewStorageComponent } from '../new-storage/new-storage.component';
import { error } from 'console';
import { NewDepartmentComponent } from '../../general-component/new-department/new-department.component';

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

  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;
  names:any[]=[]
  ChemicalName:Array<any>=[]
  ChemicalList:Array<any>=[]
  chemicalCount:number
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
  userID:Number
  stockTotal:boolean = false
  OldBalance:number=0
  Division = new FormControl(null, [Validators.required]);
  stock:boolean = false
 
 

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


  constructor(private generalService: GeneralService,
    private chemicalService: ChemicalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sustainabilityService: SustainabilityService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',  ],
      reference_number: [''],
      transaction_date: [new Date()],
      department: ['',[Validators.required] ],
      status: ['Open'],
      assignee: [null],
      reporter: [''],
      unit: ['',[Validators.required]],
      balance: ['',[Validators.required]],
      issuing_quantity:['',[Validators.required]],
      total_quantity:['',[Validators.required]],
      authorised_person:['', [Validators.required]],
      division: ['', [Validators.required]],
      chemical: ['', [Validators.required]],
      chemical_name:[' '],
      business_unit:[null]
    });
  }
  
  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.chemical
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
        const status = result.chem_trans_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.userID = result.id
          this.get_chemical_department()
          this.get_profiles()
          this.get_divisions() 
          this.get_chemical_data()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  
  BusinessUnit(event: any) { 
    this.Form.controls['division'].setValue(event.value.attributes.division_name) 
    this.Form.controls['business_unit'].setValue(event.value.id)   
  }

 
  get_chemical_data() {
    this.chemicalService.get_chemical_inventory_approved().subscribe({
      next: (result: any) => {
        this.ChemicalData = result.data
        const uniqueCategory = Array.from(new Set(this.ChemicalData.map(a => a.attributes.commercial_name))).map(name => {
          return this.ChemicalData.find(a => a.attributes.commercial_name === name)
        })
        
        this.ChemicalName.push(uniqueCategory[0])
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  //get divisions
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

  
  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        this.peopleList = result.data
      },
      error: (err: any) => {
      },
      complete: () => { }
    })
  }
  get_chemical_department()
  {
    this.chemicalService.get_chemical_department().subscribe({
      next: (result: any) =>{
        this.names=result.data
      }
    })
   }
 
    

  new_name() {
 
      // this.dialog.open(NewDepartmentComponent).afterClosed().subscribe((data: any) => {

      //   const name=data.name
      //   this.chemicalService.create_department(name,this.Form.value.reporter).subscribe({
      //     next: (result: any) => {
      //       this.chemicalService.get_chemical_department().subscribe({
      //         next: (result: any) =>{
      //           this.names=result.data
                
      //         },
      //         error: (err: any) => {
      //           this.router.navigate(["/error/internal"])
      //         },
      //         complete: () => { 
      //             const statusText = "Department created successfully"
      //             this._snackBar.open(statusText, 'Close Warning', {
      //               horizontalPosition: this.horizontalPosition,
      //               verticalPosition: this.verticalPosition,
      //             });
      //             this.Form.controls['name'].setValue(result.data.attributes.name)
      //         }
      //       })
      //       console.log(result)
            
      //     },
      //     error: (err: any) => {
      //       this.router.navigate(["/error/internal"])
      //     },
      //     complete: () => { }
      //   })
       
      // })
   
    
  }
    
  //confirm to create the transaction
  confirm() {
    const formStatus = this.Form.valid
    if (formStatus) {
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
          this.create_reference_number()
        }
      })
    } else if (!formStatus) {
      const statusText = "Please fill all mandatory fields"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
  
   
  
  //create reference
  create_reference_number() {
    this.chemicalService.get_chemical_transaction().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = 'TRA-' + newCount
        this.Form.controls['reference_number'].setValue(reference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_transaction()
      }
    })
  }

  //create inventory
  create_transaction() {
    this.Form.controls['balance'].enable()
    this.Form.controls['unit'].enable()
    this.Form.controls['total_quantity'].enable()
    this.Form.controls['chemical'].setValue(this.Form.value.chemical.attributes.commercial_name)

    this.chemicalService.create_transaction(this.Form.value).subscribe({
  
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.update_inventory()
      }
    })
  }
 //update inventory
 update_inventory() {
  const inventory = this.Form.value;
    const data:Array<any>=[]
    data.push(this.ChemicalList[0].sort((a:any,b:any)=>(a.id>b.id)?1:-1))
    const data2 = data[0]
    this.OldBalance = Number(inventory.issuing_quantity)

    for(let element of data2){
      const oldBalance = element.balance
      const oldUsed = element.used

      if(this.OldBalance>0){
        if(Number(element.attributes.balance)>=Number(this.OldBalance)){
          const oldBalance = element.attributes.balance
          const newBalance = Number(oldBalance)-Number(this.OldBalance)
          const delivered = Number(element.attributes.delivered_quantity)
          const newUsed = Number(element.attributes.used)+Number(this.OldBalance) 
          const balance = Number(delivered)-Number(newUsed)
          this.OldBalance = newBalance

          this.chemicalService.update_chemical_inventory_usage(element.id,newUsed,newBalance).subscribe({

          next: (result: any) => {
            this.Form.controls['id'].setValue(result.data.id)
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            this.create_activity()
          }
        })
        }
        else
        {

          const oldBalance = element.attributes.balance
          const newBalance = Number(this.OldBalance)-Number(oldBalance)
          this.OldBalance = newBalance
          const newUsed = Number(element.attributes.used)+Number(oldBalance) 
          const newBalance2=0
        
          this.chemicalService.update_chemical_inventory_usage(element.id,newUsed,newBalance2).subscribe({

            next: (result: any) => {
              this.Form.controls['id'].setValue(result.data.id)
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              this.create_activity()
            }
          })
        }}
            }
        }
 

create_activity() {
  const action = "New transaction added successfully"
  const refernceNumber = this.Form.value.reference_number
  const user = this.Form.value.reporter
  this.generalService.create_activity_stream(action, refernceNumber, user).subscribe({
    next: (result: any) => {
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
    module: "Chemical Management",
    action: 'Created a new transaction:',
    reference_number: this.Form.value.reference_number,
    userID: this.Form.value.assignee,
    access_link: "/apps/chemical-management/create",
    profile: this.Form.value.reporter
  })
  this.generalService.create_notification(data[0]).subscribe({
    next: (result: any) => { },
    error: (err: any) => {
      this.router.navigate(["/error/internal"])
    },
    complete: () => {
      Swal.fire({
        title: 'New Transaction Added',
        imageUrl: "assets/images/confirm.gif",
        imageWidth: 250,
        text: "You have successfully added a transaction. We will notify the department head to take further action.",
        showCancelButton: false,
      }).then((result) => {
        this.router.navigate(["/apps/chemical-management/transaction"])
      })
    }
  })
}

unitVal(event:any){
   const value = event.value
  this.Form.controls['chemical_name'].setValue(value.attributes.commercial_name)
  this.Form.controls['unit'].setValue(value.attributes.delivered_unit)
  //console.log(this.Form.value.ChemicalName)
  this.chemicalService.get_chemical_inventory_approved_name(value.attributes.commercial_name).subscribe(
    {
      next:(result:any) =>{
        this.ChemicalList.push(result.data)
        const totalQuantity = result.data.reduce((acc:any, cur:any) => acc + Number(cur.attributes.balance), 0)
        if(totalQuantity<=0){
          this.stockTotal = true
        }
        this.Form.controls['issuing_quantity'].reset()
        this.Form.controls['balance'].reset()
        this.Form.controls['total_quantity'].setValue(totalQuantity)
        this.Form.controls['unit'].disable()
        this.Form.controls['total_quantity'].disable()
      },
      error:(err:any) => {
        this.router.navigate(["/error/internal"])
      },
      complete:()=>{

      }
    }
  )

}

balCalc(event:any){
  this.Form.controls['total_quantity'].enable()
  const total = Number(this.Form.value.total_quantity)
  const issued = Number(event.target.value)

  const balance = Number(total)-Number(issued)
  if(balance<0){
    this.stock = true
    //this.Form.controls['Complete'].enable()
    this.Form.controls['balance'].disable()

  }else{
    this.Form.controls['balance'].setValue(balance)
    //this.Form.controls['Complete'].disable()
    this.Form.controls['balance'].disable()
    this.stock = false

  }

  this.Form.controls['total_quantity'].disable()

 
}

}
