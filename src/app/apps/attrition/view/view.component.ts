import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NewDepartmentComponent } from '../../general-component/new-department/new-department.component';
import { NewDesignationComponent } from '../../general-component/new-designation/new-designation.component';
import { NewFunctionComponent } from '../../general-component/new-function/new-function.component';
import { NewCountryComponent } from '../../general-component/new-country/new-country.component';
import { NewStateComponent } from '../../general-component/new-state/new-state.component';
import { NewResignationTypeComponent } from '../new-resignation-type/new-resignation-type.component';
import { AttritionService } from 'src/app/services/attrition.api.service';
import { Location } from '@angular/common';
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
  sourceOfHiring: any[] = [];
  employmentType: any[] = [];
  employmentClass: any[] = [];
  resignationTypes: any[] = []
  filterStates: any[] = []
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  joindate = new FormControl(null, [Validators.required]);
  minor: boolean = false
  evidenceFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  dropdownValues: any
  backToHistory: Boolean = false
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
  constructor(private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private attritionService: AttritionService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private _location: Location) {
  }

  ngOnInit(): void {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      reporter: [''],
      reference_number: [''],
      reported_date: [null],
      //status: ['Active'],
      employee_id: ['', [Validators.required]],
      employee_name: [null, [Validators.required]],
      gender: ['', [Validators.required]],
      date_of_join: [null, [Validators.required]],
      relieved_date: ['', [Validators.required]],
      resigned_date: ['', [Validators.required]],
      division: ['', [Validators.required]],
      employment_type: ['', [Validators.required]],
      service_period: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      employment_classification: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      resignation_reason: ['', [Validators.required]],
      tenure_split: ['', [Validators.required]],
      per_day_salary: ['', [Validators.required]],
      hostel_access: [false, [Validators.required]],
      work_history: [false, [Validators.required]],
      normal_resignation: [false, [Validators.required]],
      resignation_type: ['', [Validators.required]],
      responsible_person:[null]
    });
    this.Form.disable()
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.attrition
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
        const status = result.attrition_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)


          this.get_attrition_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  //get attrition details
  get_attrition_details() {
    const reference = this.route.snapshot.paramMap.get('id');

    this.attritionService.get_attrition_details(reference).subscribe({
      next: (result: any) => {

        this.Form.controls['employee_name'].setValue(result.data[0].attributes.employee_name)
        this.Form.controls['id'].setValue(result.data[0].id)
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.Form.controls['employment_classification'].setValue(result.data[0].attributes.employment_classification)
        this.Form.controls['resignation_reason'].setValue(result.data[0].attributes.resignation_reason)
        this.Form.controls['country'].setValue(result.data[0].attributes.country)
        this.Form.controls['relieved_date'].setValue(result.data[0].attributes.relieved_date)
        this.Form.controls['resigned_date'].setValue(result.data[0].attributes.resigned_date)
        this.Form.controls['date_of_join'].setValue(result.data[0].attributes.date_of_join)
        this.Form.controls['department'].setValue(result.data[0].attributes.department)
        this.Form.controls['designation'].setValue(result.data[0].attributes.designation)
        this.Form.controls['per_day_salary'].setValue(result.data[0].attributes.per_day_salary)
        this.Form.controls['employee_id'].setValue(result.data[0].attributes.employee_id)
        this.Form.controls['division'].setValue(result.data[0].attributes.division)
        this.Form.controls['work_history'].setValue(result.data[0].attributes.work_history)
        this.Form.controls['hostel_access'].setValue(result.data[0].attributes.hostel_access)
        this.Form.controls['gender'].setValue(result.data[0].attributes.gender)
        this.Form.controls['normal_resignation'].setValue(result.data[0].attributes.normal_resignation)
        this.Form.controls['resignation_type'].setValue(result.data[0].attributes.resignation_type)
        this.Form.controls['service_period'].setValue(result.data[0].attributes.service_period)
        this.Form.controls['state'].setValue(result.data[0].attributes.state)
        this.Form.controls['tenure_split'].setValue(result.data[0].attributes.tenure_split)
        this.Form.controls['employment_type'].setValue(result.data[0].attributes.employment_type)
        this.Form.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
        this.Form.controls['responsible_person'].setValue(result.data[0].attributes.responsible_person.data?.attributes.first_name + ' ' +result.data[0].attributes.responsible_person.data?.attributes.last_name )
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
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


  navigate() { this.backToHistory = true, this._location.back(); }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
