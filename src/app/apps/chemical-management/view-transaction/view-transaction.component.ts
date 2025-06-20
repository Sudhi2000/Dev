import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { SustainabilityService } from 'src/app/services/sustainability.api.service';
import { ChemicalService } from 'src/app/services/chemical.api.service';
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
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewTransactionComponent implements OnInit {

  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;
  names:any[]=[]
  ChemicalName:Array<any>=[]
  ChemicalList:Array<any>=[]
  deliveredUnit:any[]=[]
  deliveredUnits: any[] = []
  chemicalCount:number
  evidenceCount: number = 0
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  ChemicalData: any[] = []
  divisions: any[] = []
  TypeList:any[]=[]
  peopleList: any[] = []
  evidenceFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  evidenceData: any
  dropdownValues: any
  userID:Number
  stockTotal:boolean = false

  use_of_ppe = new FormControl(null,[Validators.required]);
  toppingList: any[] =[]

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
    private route: ActivatedRoute,
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
      issued_quantity:['',[Validators.required]],
      total_quantity:['',[Validators.required]],
      authorised_person:['', [Validators.required]],
      division: ['', [Validators.required]],
      chemical: ['', [Validators.required]],
      chemicalName:[' '],
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
        const status = result.chem_trans
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.userID = result.id
          this.transaction_details()
          this.get_dropdown_values()
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
  
  transaction_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.chemicalService.get_transaction_details( reference).subscribe({
      next: (result: any) => {
           this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
           this.Form.controls['transaction_date'].setValue(result.data[0].attributes.createdAt)
           this.Form.controls['id'].setValue(result.data[0].id)
           this.Form.controls['authorised_person'].setValue(result.data[0].attributes.authorized_person)
           this.Form.controls['chemical'].setValue(result.data[0].attributes.chemical)
           this.Form.controls['division'].setValue(result.data[0].attributes.division)
           this.Form.controls['total_quantity'].setValue(result.data[0].attributes.total_quantity)
           this.Form.controls['issued_quantity'].setValue(result.data[0].attributes.issued_quantity)
           this.Form.controls['unit'].setValue(result.data[0].attributes.unit)
           this.Form.controls['balance'].setValue(result.data[0].attributes.balance)
           this.Form.controls['department'].setValue(result.data[0].attributes.department)
           

           this.Form.disable()



      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
 
  get_chemical_data() {
    this.chemicalService.get_chemical_transaction().subscribe({
      next: (result: any) => {
        this.ChemicalName = result.data
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

  //get dropdown values
  get_dropdown_values() {
    const module = "Chemical Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        this.deliverunit()
      },
      error: (err: any) => { },
      complete: () => { 
        
      }
    })
  }
   //get deliverunit
   deliverunit() {
    this.deliveredUnits = []
    const deliverunit = this.dropdownValues.filter(function (elem:any) {
      return (elem.attributes.Category === "Delivered Unit")
    })
    this.deliveredUnit = deliverunit
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
 
      this.dialog.open(NewDepartmentComponent).afterClosed().subscribe((data: any) => {

        const name=data.name
        this.chemicalService.create_department(name,this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.chemicalService.get_chemical_department().subscribe({
              next: (result: any) =>{
                this.names=result.data
                
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => { 
                  const statusText = "Department created successfully"
                  this._snackBar.open(statusText, 'Close Warning', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['name'].setValue(result.data.attributes.name)
              }
            })
            
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })
       
      })
   
    
  }
    
 
  
}
