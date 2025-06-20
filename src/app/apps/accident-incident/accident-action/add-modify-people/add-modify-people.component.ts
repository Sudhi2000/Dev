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
  selector: 'app-add-modify-people',
  templateUrl: './add-modify-people.component.html',
  styleUrls: ['./add-modify-people.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AddModifyPeopleComponent implements OnInit {

  Form: FormGroup
  divisions: any[] = []
  personType: any[] = []
  experienceType:any[]=[]
  joindate = new FormControl(null);
  static id = 1;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
  private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private accidentService: AccidentService,
    public dialogRef: MatDialogRef<AddModifyPeopleComponent>) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['', [Validators.required]],
      person_type: ['', [Validators.required]],
      employee_id: [null],
      person_name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      age: ['', [Validators.required]],
      employment_duration: [''],
      designation: [''],
      industry_experience: ['', [Validators.required]],
      date_of_join:['']
    });
    this.Form.controls['employee_id'].setValidators(Validators.required);
    this.Form.controls['date_of_join'].setValidators(Validators.required);
    this.joindate.setValidators(Validators.required);
    this.Form.controls['employment_duration'].setValidators(Validators.required);
    this.Form.controls['designation'].setValidators(Validators.required);
    if(this.defaults){
      this.Form.controls['id'].setValue(this.defaults.id)
      this.Form.controls['person_type'].setValue(this.defaults.attributes.person_type)
      this.Form.controls['employee_id'].setValue(this.defaults.attributes.employee_id)
      this.Form.controls['person_name'].setValue(this.defaults.attributes.person_name)
      this.Form.controls['gender'].setValue(this.defaults.attributes.gender)
      this.Form.controls['age'].setValue(this.defaults.attributes.age)
      this.Form.controls['employment_duration'].setValue(this.defaults.attributes.employment_duration)
      this.Form.controls['designation'].setValue(this.defaults.attributes.designation)
      this.Form.controls['industry_experience'].setValue(this.defaults.attributes.industry_experience)
      this.Form.controls['date_of_join'].setValue(new Date(this.defaults.attributes.date_of_join))
      this.joindate.setValue(new Date(this.defaults.date_of_join))
      if(this.defaults.person_type!=='Employee'){
        this.Form.controls['employee_id'].disable()
        this.Form.controls['date_of_join'].disable()
        this.joindate.disable()
        this.Form.controls['employment_duration'].disable()
        this.Form.controls['designation'].disable()
      }
    }
  }

  ///check organisation has access
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

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.acc_inc_action
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_divisions()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  //get divisions
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

  //get personType
  get_person_type() {
    this.accidentService.get_person_type().subscribe({
      next: (result: any) => {
        this.personType = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  //join date
  joinDate(data:any){
    this.Form.controls['date_of_join'].setValue(new Date(data.value))
    const date = new Date()
    const doj = new Date(data.value)
    const differ = Number(date) - Number(doj)
    const year = new Date(differ).getUTCFullYear()-1970
    const month = new Date(differ).getUTCMonth()
    const days = new Date(differ).getUTCDate()
    const servicePeriod = year+" Years, "+month+" Months, "+days+" Days"
    this.Form.controls['employment_duration'].setValue(servicePeriod)
    this.Form.controls['employment_duration'].disable()
  }

  person_type(data:any){
    if(data.value==="Employee"){
      this.Form.controls['employee_id'].enable()
      this.Form.controls['date_of_join'].enable()
      this.joindate.enable()
      this.Form.controls['employment_duration'].enable()
      this.Form.controls['designation'].enable()
      this.Form.controls['employee_id'].setValidators(Validators.required);
      this.Form.controls['date_of_join'].setValidators(Validators.required);
      this.joindate.setValidators(Validators.required);
      this.Form.controls['employment_duration'].setValidators(Validators.required);
      this.Form.controls['designation'].setValidators(Validators.required);
    }else{
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

  update(){
    
  }
}
