import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { accident_people } from 'src/app/services/schemas';

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
  selector: 'app-add-modify-affected-person',
  templateUrl: './add-modify-affected-person.component.html',
  styleUrls: ['./add-modify-affected-person.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AddModifyAffectedPersonComponent implements OnInit {

  Form: FormGroup
  divisions: any[] = []
  personType: any[] = []
  experienceType: any[] = []
  joindate = new FormControl(null);
  static id = 1;
  mode: 'create' | 'update' = 'create';
  dropdownValues: any
  personTypes: any

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private accidentService: AccidentService,
    public dialogRef: MatDialogRef<AddModifyAffectedPersonComponent>) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as accident_people;
    }
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [this.defaults.id || AddModifyAffectedPersonComponent.id++],
      org_id: [this.defaults.org_id || ''],
      person_type: [this.defaults.person_type, [Validators.required]],
      employee_id: [this.defaults.employee_id || null],
      person_name: [this.defaults.person_name || '', [Validators.required]],
      gender: [this.defaults.gender || '', [Validators.required]],
      age: [this.defaults.age || '', [Validators.required]],
      employment_duration: [this.defaults.employment_duration || ''],
      designation: [this.defaults.designation || '', [Validators.required]],
      industry_experience: [this.defaults.industry_experience || '', [Validators.required]],
      date_of_join: [this.defaults.date_of_join || '']
    });

    if (this.defaults) {
      this.joindate.setValidators([Validators.required]);
      this.joindate.updateValueAndValidity();

      this.joindate.setValue(new Date(this.defaults.date_of_join))
      if (this.defaults.person_type !== 'Employee') {
        this.Form.controls['employee_id'].disable()
        this.Form.controls['date_of_join'].disable()
        this.joindate.disable()
        this.Form.controls['employment_duration'].disable()
        this.Form.controls['designation'].disable()
      }
    }
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident
        this.personType = result.data.attributes.person_type
        this.experienceType = result.data.attributes.industry_experience
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
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
        const status = result.acc_inc_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_divisions()
          this.get_dropdown_values()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_dropdown_values() {
    const module = "Accident and Incident"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data

        const socialModule = "General"
        this.generalService.get_dropdown_values(socialModule).subscribe({
          next: (generalResult: any) => {

            //Category
            const category = generalResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Person Type")
            })
            this.personTypes = category

          },
          error: (err: any) => { },
          complete: () => { }
        })

      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  filterPersonType(value: any) {
    return value.attributes?.Category === "Person Type"
  }

  filterExperience(value: any) {
    return value.attributes?.Category === "Industry Experience"
  }

  get_divisions() {
    this.generalService.get_division(this.Form.value.org_id).subscribe({
      next: (result: any) => {
        this.divisions = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  joinDate(data: any) {



    this.Form.controls['date_of_join'].setValue(new Date(data.value))
    const date = new Date()
    const doj = new Date(data.value)
    const differ = Number(date) - Number(doj)
    const year = new Date(differ).getUTCFullYear() - 1970
    const month = new Date(differ).getUTCMonth()
    const days = new Date(differ).getUTCDate()
    const servicePeriod = year + " Years, " + month + " Months, " + days + " Days"
    this.Form.controls['employment_duration'].setValue(servicePeriod)
    this.Form.controls['employment_duration'].disable()
  }

  person_type(data: any) {
    if (data.value === "Employee") {
      this.Form.controls['employee_id'].enable()
      this.Form.controls['date_of_join'].enable()
      this.joindate.enable()
      this.Form.controls['employment_duration'].enable()
      this.Form.controls['designation'].enable()
      this.Form.controls['employee_id'].setValidators(Validators.required);
      this.Form.controls['date_of_join'].setValidators(Validators.required);
      this.Form.controls['date_of_join'].updateValueAndValidity();

      this.joindate.setValidators(Validators.required);
      this.Form.controls['employment_duration'].setValidators(Validators.required);
      this.Form.controls['designation'].setValidators(Validators.required);
      this.Form.controls['designation'].updateValueAndValidity()
    } else {
      this.Form.controls['employee_id'].setValue(null)
      this.Form.controls['date_of_join'].setValue(null)
      this.joindate.setValue(null)
      this.Form.controls['employment_duration'].setValue(null)
      this.Form.controls['designation'].setValue(null)
      this.Form.controls['employee_id'].setErrors(null);
      this.Form.controls['date_of_join'].setErrors(null);
      this.joindate.setErrors(null);
      this.Form.controls['employment_duration'].setErrors(null);
      this.Form.controls['designation'].setErrors(null);
      this.Form.controls['employee_id'].disable()
      this.Form.controls['date_of_join'].disable()
      this.Form.controls['employment_duration'].disable()
      this.Form.controls['designation'].disable()
      this.joindate.disable()
    }
  }

  submit() {
    this.Form.controls['employment_duration'].enable()
    this.dialogRef.close(this.Form.value);
  }

}
