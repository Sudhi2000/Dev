import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MatDialogRef } from '@angular/material/dialog';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-report-parameter',
  templateUrl: './report-parameter.component.html',
  styleUrls: ['./report-parameter.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ReportParameterComponent implements OnInit {
  Form: FormGroup

  divisions: any[] = []
  years: any[] = []
  orgID: any
  divisionTypes = new FormControl(null, [Validators.required]);
  dateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  issuedYearTypes = new FormControl(null);
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private generalService: GeneralService, public dialogRef: MatDialogRef<ReportParameterComponent>) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({

      division: [null, [Validators.required]],
      year: [null],
      startDate: [null],
      endDate: [null],
      default_date: [true],
      reporting_person: [''],
      reporting_email: [''],
      company_name: [''],
      format: [null, [Validators.required]],
    });


    this.configuration()
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.Form.controls['reporting_person'].setValue(result.profile.first_name + " " + result.profile.last_name);
        this.Form.controls['reporting_email'].setValue(result.email);
        
        const status = result.med_inventory
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.divisions = result.profile.divisions
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        // this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.occupational_health
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          this.years = result.data.attributes.Year
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
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
  divisionVal(event: any) {
    this.Form.controls['division'].setValue(event.value.toString());
  }
  startDateChange(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['startDate'].setValue(newDate)

    // this.Form.controls['startDate'].setValue(startDate);
    this.Form.controls['year'].disable()
    this.issuedYearTypes.disable()
  }

  endDateChange(event: any) {


    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['endDate'].setValue(newDate)

    this.Form.controls['default_date'].setValue(false)
    this.Form.controls['year'].disable()
    this.issuedYearTypes.disable()
  }

  YearVal(event: any) {

    this.Form.controls['year'].setValue(event.value.toString());
    this.Form.controls['startDate'].disable()
    this.Form.controls['endDate'].disable()
    this.dateRange.disable()
    if (this.Form.controls['year'].value === "") {
      this.dateRange.enable()
      this.Form.controls['startDate'].enable()
      this.Form.controls['endDate'].enable()
    }
  }

  submit() {
    console.log("this.Form.value", this.Form.value)
    this.dialogRef.close(this.Form.value);

  }

}
