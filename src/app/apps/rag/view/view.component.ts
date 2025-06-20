import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { RagService } from 'src/app/services/rag.api.service';
import { NewDepartmentComponent } from 'src/app/apps/general-component/new-department/new-department.component';
import { NewDesignationComponent } from '../../general-component/new-designation/new-designation.component';
import { NewFunctionComponent } from '../../general-component/new-function/new-function.component';
import { NewCountryComponent } from '../../general-component/new-country/new-country.component';

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
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewComponent implements OnInit {


  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 5,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;


  files: File[] = [];
  imglnk: any = environment.client_backend + '/uploads/'
  format: any = ".png"
  evidenceCount: number = 0
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  employeeType: any[] = [];
  genderData: any[] = [];
  tenureSplit: any[] = [];
  sourceOfHiring: any[] = [];
  employmentType: any[] = [];
  categoryList: any[] = [];
  filterStates: any[] = []
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  divisions: any[] = []
  functions: any[] = []
  departments: any[] = []
  designations: any[] = []
  countries: any[] = []
  states: any[] = []
  birthdate = new FormControl(null, [Validators.required]);
  joindate = new FormControl(null, [Validators.required]);
  minor: boolean = false
  evidenceFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  dropdownValues: any

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

  timeline = new FormGroup({
    start_timeline: new FormControl(),
    end_timeline: new FormControl()
  });
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private ragService: RagService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.configuration()
    console.log(this.defaults);
    
    this.Form = this.formBuilder.group({
      id: [this.defaults.id || ''],
      org_id: ['',],
      reporter: [''],
      reference_number: [this.defaults.attributes.reference_number || ''],
      reported_date: [this.defaults.attributes.reported_date || ''],
      category: [this.defaults.attributes.category || '', [Validators.required]],
      employee_type: [this.defaults.attributes.employee_type || '', [Validators.required]],
      status: [this.defaults.attributes.status || ''],
      employee_id: [this.defaults.attributes.employee_id || '', [Validators.required]],
      employee_name: [this.defaults.attributes.employee_name || '', [Validators.required]],
      gender: [this.defaults.attributes.gender || '', [Validators.required]],
      age: [this.defaults.attributes.age || '', [Validators.required, Validators.min(18)]],
      date_of_birth: [this.defaults.attributes.date_of_birth || '', [Validators.required]],
      date_of_join: [this.defaults.attributes.date_of_join || '', [Validators.required]],
      employment_type: [this.defaults.attributes.employment_type || '', [Validators.required]],
      service_period: [this.defaults.attributes.service_period || '', [Validators.required]],
      designation: [this.defaults.attributes.designation || '', [Validators.required]],
      department: [this.defaults.attributes.department || '', [Validators.required]],
      function: [this.defaults.attributes.function || '', [Validators.required]],
      reporting_manager: [this.defaults.attributes.reporting_manager || '', [Validators.required]],
      source_of_hiring: [this.defaults.attributes.source_of_hiring || '', [Validators.required]],
      country: [this.defaults.attributes.country || '', [Validators.required]],
      state: [this.defaults.attributes.state || '', [Validators.required]],
      origin: [this.defaults.attributes.origin || '', [Validators.required]],
      discussion_summary: [this.defaults.attributes.discussion_summary || '', [Validators.required]],
      remarks: [this.defaults.attributes.remarks || '', [Validators.required]],
      tenure_split: [this.defaults.attributes.tenure_split || '', [Validators.required]],
      rag:[this.defaults.attributes.rag || ''], 
      division:[this.defaults.attributes.division || '']
    });
    this.birthdate.setValue(new Date(this.defaults.attributes.date_of_birth))
    this.joindate.setValue(new Date(this.defaults.attributes.date_of_join))
    this.Form.disable()
    this.birthdate.disable()
    this.joindate.disable()
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.rag
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
        const status = result.rag_history
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          //this.Form.controls['reporter'].setValue(result.profile.id)
          // this.get_rag_details()
          this.get_dropdown_values()
          this.get_department()
          this.get_designation()
          this.get_function()
          this.get_country()
          this.get_state()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  birthDate(data: any) {
    this.Form.controls['date_of_birth'].setValue(new Date(data.value))
  }
  joinDate(data: any) {
    this.Form.controls['date_of_join'].setValue(new Date(data.value))
  }

  //get rag details
  get_rag_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.ragService.get_rag_details(reference).subscribe({
      next: (result: any) => {
        console.log(result)
        this.Form.controls['employee_name'].setValue(result.data[0].attributes.employee_name)
        this.Form.controls['id'].setValue(result.data[0].id)
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.Form.controls['age'].setValue(result.data[0].attributes.age)
        this.Form.controls['rag'].setValue(result.data[0].attributes.rag)
        this.Form.controls['category'].setValue(result.data[0].attributes.category)
        this.Form.controls['country'].setValue(result.data[0].attributes.country)
        this.Form.controls['date_of_birth'].setValue(result.data[0].attributes.date_of_birth)
        this.Form.controls['date_of_join'].setValue(result.data[0].attributes.date_of_join)
        this.Form.controls['department'].setValue(result.data[0].attributes.department)
        this.Form.controls['designation'].setValue(result.data[0].attributes.designation)
        this.Form.controls['discussion_summary'].setValue(result.data[0].attributes.discussion_summary)
        this.Form.controls['employee_id'].setValue(result.data[0].attributes.employee_id)
        this.Form.controls['status'].setValue(result.data[0].attributes.status)
        this.Form.controls['employee_type'].setValue(result.data[0].attributes.employee_type)
        this.Form.controls['function'].setValue(result.data[0].attributes.function)
        this.Form.controls['gender'].setValue(result.data[0].attributes.gender)
        this.Form.controls['origin'].setValue(result.data[0].attributes.origin)
        this.Form.controls['remarks'].setValue(result.data[0].attributes.remarks)
        this.Form.controls['reporting_manager'].setValue(result.data[0].attributes.reporting_manager)
        this.Form.controls['service_period'].setValue(result.data[0].attributes.service_period)
        this.Form.controls['source_of_hiring'].setValue(result.data[0].attributes.source_of_hiring)
        this.Form.controls['state'].setValue(result.data[0].attributes.state)
        this.Form.controls['tenure_split'].setValue(result.data[0].attributes.tenure_split)
        this.Form.controls['employment_type'].setValue(result.data[0].attributes.employment_type)
        this.Form.controls['division'].setValue(result.data[0].attributes.division.attributes.division_name)
        this.birthdate.setValue(new Date(result.data[0].attributes.date_of_birth))
        this.joindate.setValue(new Date(result.data[0].attributes.date_of_join))
        this.birthdate.disable()
        this.joindate.disable()
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  get_dropdown_values() {
    const module = "General"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (genderResult: any) => {
        //Gender
        const gender = genderResult.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Gender")
        })
        this.genderData = gender
        const socialModule = "Social Apps"
        this.generalService.get_dropdown_values(socialModule).subscribe({
          next: (socialResult: any) => {
            // Employee Type
            const type = socialResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Employee Type")
            })
            this.employeeType = type

            //Tenure Split
            const tenure = socialResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Tenure Split")
            })
            this.tenureSplit = tenure

            //Source of Hiring
            const source = socialResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Source Of Hiring")
            })

            this.sourceOfHiring = source

            //Employment Type
            const employment = socialResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Employment Type")
            })

            this.employmentType = employment

            //Category
            const category = socialResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Category")
            })
            console.log(category)
            this.categoryList = category

          },
          error: (err: any) => { },
          complete: () => { }
        })
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_department() {
    this.generalService.get_department().subscribe({
      next: (result: any) => {

        this.departments = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_designation() {
    this.generalService.get_designation().subscribe({
      next: (result: any) => {

        this.designations = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_function() {
    this.generalService.get_function().subscribe({
      next: (result: any) => {

        this.functions = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_country() {
    this.generalService.get_country().subscribe({
      next: (result: any) => {

        this.countries = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }


  get_state() {
    this.generalService.get_state().subscribe({
      next: (result: any) => {

        this.states = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }
  ragStatus(data: any) {
    const Red = "btn-danger"
    const Amber = "btn-warning"
    const Green = "btn-success"
    if (data === "Green") {
      return Green
    } else if (data === "Amber") {
      return Amber
    }
    else if (data === "Red") {
      return Red
    } else {
      return
    }
  }

  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  //confirm to create the transaction
  submit() {
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
          this.update_rag()
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


  //create accident
  update_rag() {
    this.ragService.update_rag(this.Form.value).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'RAG Details Updated',
          imageUrl: "assets/images/success.gif",
          imageWidth: 250,
          text: "You have successfully added a rag details.",
          showCancelButton: false,
        })
        this.router.navigate(["/apps/engagement/rag/history"])
      }
    })
  }
  action(data: any) {
    this.Form.controls['status'].setValue(data)
    this.update_status()

  }
  update_status() {
    this.Form.enable()
    this.ragService.update_status(this.Form.value).subscribe({
      next: (result: any) => {
        const statusText = "The employee has marked as resigned"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      },
      error: (err: any) => { },
      complete: () => {

        this.router.navigate(["/apps/engagement/rag/history"])
      }
    })

  }

}
