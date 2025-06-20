import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { AuthService } from 'src/app/services/auth.api.service';
import { DatePipe } from '@angular/common';

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'YYYY',
//   },
//   display: {
//     dateInput: 'YYYY',
//     monthYearLabel: 'YYYY',
//     dateA11yLabel: 'YYYY',
//     monthDayLabel: 'YYYY',
//   },
// };

export const MY_FORMATS1 = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS1 },
    [DatePipe]
  ],
})
export class GenerateReportComponent implements OnInit {
  Form: FormGroup;
  years: any[] = [];
  divisions: any[] = [];
  orgID: any;
  unitSpecific: any;
  userDivision: any
  corporateUser: any
  divisionTypes = new FormControl(null);
  division = new FormControl('', [Validators.required]);
  months = new FormControl(null);
  issuedYearTypes = new FormControl('', [Validators.required]);
  // months: any[] = [
  //   { code: 1, name: 'January' },
  //   { code: 2, name: 'February' },
  //   { code: 3, name: 'March' },
  //   { code: 4, name: 'April' },
  //   { code: 5, name: 'May' },
  //   { code: 6, name: 'June' },
  //   { code: 7, name: 'July' },
  //   { code: 8, name: 'August' },
  //   { code: 9, name: 'September' },
  //   { code: 10, name: 'October' },
  //   { code: 11, name: 'November' },
  //   { code: 12, name: 'December' },
  // ];
  // dateRange = new FormGroup({
  //   start: new FormControl(),
  //   end: new FormControl(),
  // });
  timedateRange = new FormGroup({
    startRange: new FormControl(null),  // You can set a default date here if needed
    endRange: new FormControl(null)
  }, [Validators.required]);
  isSelectingStart: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<GenerateReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {

    this.userDivision = data.user_Divisions;
  }

  ngOnInit() {
    this.configuration();

    this.Form = this.formBuilder.group({
      year: ['', [Validators.required]],
      division: ['', [Validators.required]],
      type: ['', [Validators.required]],
      reporting_person: [''],
      reporting_mail: [''],
      format: [null, [Validators.required]],
      startDate: [null],
      endDate: [null],
      startMonth: [''],
      endMonth: [''],
      month: [null],
      defualt_date: [true],
      month_val: [null],
      company_name: [''],
      // currentDate:[null],
      updated_date: [null]
    });
    this.Form.controls['month'].disable()
    this.months.disable()
    this.get_dropdown_values();
    this.Form.get('type')?.valueChanges.subscribe(value => {
      const typeValue = this.Form.controls['type'].value
      if (typeValue === "Consumption Report") {
        // this.Form.controls['format'].setValidators(null);
        // this.Form.controls['format'].updateValueAndValidity();
        this.Form.controls['month'].setValidators(null);
        this.Form.controls['month'].updateValueAndValidity();
        this.issuedYearTypes.clearValidators();
        this.issuedYearTypes.updateValueAndValidity();
        this.timedateRange.clearValidators();
        this.timedateRange.updateValueAndValidity();
      }
      this.Form.patchValue({
        year: '',
        division: '',
        format: '',
        month: '',
      });
      this.timedateRange.patchValue({
        startRange: null,
        endRange: null
      });
      this.issuedYearTypes.setValue(null)
      this.division.setValue(null);
      this.months.setValue(null);
      this.Form.controls['year'].enable();
      this.issuedYearTypes.enable();
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.years = result.data.attributes.Year;
        const status = result.data.attributes.modules.environment;
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          this.router.navigate(['/error/upgrade-subscription']);
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id;
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split('=');
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1]);
              //this.get_divisions();
            }
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        this.me();
      },
    });
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        // this.divisions = result.profile.divisions
        this.Form.controls['reporting_person'].setValue(result.profile.first_name + " " + result.profile.last_name);
        this.Form.controls['reporting_mail'].setValue(result.profile.email);

        if (this.Form.value.type == 'ODS Report' || this.Form.value.type === 'Refrigerant Inventory Report') {
          this.Form.controls['reporting_person'].disable();
          this.Form.controls['reporting_mail'].disable();
        }


        const status = result.env_register
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

  get_dropdown_values() { }

  startDateChange(event: any) {
    const date = new Date(event.value);
    const monthAbbr = date.toLocaleString('en-US', { month: 'short' }); // Get month before modification
    this.Form.controls['startMonth'].setValue(monthAbbr);

    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10);
    this.Form.controls['startDate'].setValue(newDate);
  }

  endDateChange(event: any) {
    const date = new Date(event.value);
    const monthAbbr1 = date.toLocaleString('en-US', { month: 'short' }); // Get month before modification
    this.Form.controls['endMonth'].setValue(monthAbbr1);

    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10);
    this.Form.controls['endDate'].setValue(newDate);

    this.Form.controls['defualt_date'].setValue(false);
    this.Form.controls['year'].disable();
    this.issuedYearTypes.disable();
  }


  divisionVal(event: any) {
    this.Form.controls['division'].setValue(event.value.toString());
  }

  // multiple selection of divisions
  Divisions(event: any) {
    const selectedValues = event.value;
    const toSeperate = selectedValues.join(',');
    this.Form.controls['division'].setValue(toSeperate);
  }

  YearVal(event: any) {
    this.Form.controls['month'].enable()
    this.months.enable()
    this.Form.controls['year'].setValue(event.value.toString());
    this.timedateRange.disable()
  }

  monthVal(event: any) {
    this.Form.controls['month'].setValue(event.value.toString());
  }

  selectMonth(data: any) {
    this.Form.controls['month_val'].setValue(data)
  }

  // submit function
  submit() {
    if (this.Form.value.type == 'ODS Report' || this.Form.value.type === 'Refrigerant Inventory Report') {
      this.Form.controls['reporting_person'].enable();
      this.Form.controls['reporting_mail'].enable();
    }
    const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.Form.controls['updated_date'].setValue(currentDate);

    this.dialogRef.close(this.Form.value);
  }
}
