import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
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
  ],
})
export class ReportParameterComponent implements OnInit {

  Form: FormGroup
  years: any[] = []
  divisions: any[] = []
  orgID: any
  dropdownValues: any[] = []
  divisionUuids: any[] = []
  unitSpecific: any
  userDivision: any
  corporateUser: any
  months = new FormControl(null);
  issuedYearTypes = new FormControl(null);
  divisionTypes = new FormControl(null, [Validators.required]);
  dateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });


  //  AND a.accident_date BETWEEN $P{accident_date_start} AND $P{accident_date_end} 

  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ReportParameterComponent>) { }

  ngOnInit(): void {
    this.configuration()
    this.Form = this.formBuilder.group({
      year: [null],
      business_unit: [null, [Validators.required]],
      business_unit_address: [''],
      startDate: [null],
      endDate: [null],
      month: [null],
      defualt_date: [true],
      month_val: [null],
      format: [null, [Validators.required]],
    });
    this.Form.controls['month'].disable()
    this.months.disable()
  }

  selectMonth(data: any) {
    this.Form.controls['month_val'].setValue(data)


  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident
        this.unitSpecific = result.data.attributes.business_unit_specific
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.acc_inc_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions();
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results
            }
          } else {
            this.get_divisions();
          }
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
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
        }));
        this.divisions = newArray;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  submit() {
    // console.log(this.Form.value);
    this.Form.enable()
    this.dialogRef.close(this.Form.value);

    // if(this.Form.value.business_unit_address===null){
    //   this.Form.controls['business_unit_address'].disable()
    // this.dialogRef.close(this.Form.value);


    // }else{
    //   this.dialogRef.close(this.Form.value);

    // }


  }

  monthVal(event: any) {
    console.log(event.value)
    this.Form.controls['month'].setValue(event.value.toString());
  }

  YearVal(event: any) {
    this.Form.controls['month'].enable()
    this.months.enable()
    this.Form.controls['year'].setValue(event.value.toString());
    this.Form.controls['startDate'].disable()
    this.Form.controls['endDate'].disable()
    this.dateRange.disable()
  }

  divisionVal(event: any) {
    this.Form.controls['business_unit'].setValue(event.value.toString());
  }

  startDateChange(event: any) {
    // const selectedDate = new Date(event.value);
    // const startDate = new Date(
    //   Date.UTC(
    //     selectedDate.getFullYear(),
    //     selectedDate.getMonth(),
    //     selectedDate.getDate(),
    //     0,
    //     0,
    //     0
    //   )
    // ).toISOString();


    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['startDate'].setValue(newDate)




    // this.Form.controls['startDate'].setValue(startDate);
  }

  endDateChange(event: any) {
    // this.Form.controls['year'].reset()
    // this.issuedYearTypes.reset()
    // this.Form.controls['month'].reset()
    // this.months.reset()
    // this.Form.controls['year'].disable()
    // this.issuedYearTypes.disable()
    // this.Form.controls['month'].disable()
    // this.months.disable()
    // const selectedDate = new Date(event.value);
    // const endDate = new Date(
    //   Date.UTC(
    //     selectedDate.getFullYear(),
    //     selectedDate.getMonth(),
    //     selectedDate.getDate(),
    //     0,
    //     0,
    //     0
    //   )
    // ).toISOString();
    // this.Form .controls['endDate'].setValue(endDate);

    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['endDate'].setValue(newDate)

    this.Form.controls['defualt_date'].setValue(false)
    this.Form.controls['year'].disable()
    this.issuedYearTypes.disable()
  }
}
