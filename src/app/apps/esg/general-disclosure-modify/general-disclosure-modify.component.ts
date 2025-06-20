import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import moment from 'moment';
import Swal from 'sweetalert2';
import { EsgService } from 'src/app/services/esg.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { GeneralDisclosureService } from 'src/app/services/general-disclosure.service';
import { formatDate } from '@angular/common';

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'YYYY', // This is the format the date will be parsed in
//   },
//   display: {
//     dateInput: 'YYYY', // Display year only in the input field
//     monthYearLabel: 'YYYY', // Format used in the date picker panel header
//     dateA11yLabel: 'YYYY', // Format used for a11y purposes
//     monthDayLabel: 'YYYY', // Format used for displaying selected month and day
//   },
// };

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
  selector: 'app-general-disclosure-modify',
  templateUrl: './general-disclosure-modify.component.html',
  styleUrls: ['./general-disclosure-modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class GeneralDisclosureModifyComponent implements OnInit {
  Form: FormGroup
  selectedYear: string | null = null;
  dropdownValues: any
  static id = 1;
  divisions: any[] = []
  selectedDivisions: any[] = []
  divisionControl = new FormControl([]);
  selectedReportYear: string | null = null;
  years: any[] = []
  FinancialYearRange = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required)
  });

  months: string[] = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December']

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    public esgService: EsgService,
    private authService: AuthService,
    private generalService: GeneralService,
    private generalDisclosureService: GeneralDisclosureService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<GeneralDisclosureModifyComponent>
  ) { }

  ngOnInit(): void {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [this.defaults.id],
      legal_name: [this.defaults?.legal_name || ''],
      nature_of_ownership_and_legal_form: [this.defaults?.nature_of_ownership_and_legal_form || ''],
      location_of_its_headquarters: [this.defaults?.location_of_its_headquarters || ''],
      countries_of_operation: [this.defaults?.countries_of_operation || ''],
      organisation_email: [this.defaults?.organisation_email || null],
      telephone: [this.defaults?.telephone || null],
      website: [this.defaults?.website || ''],
      registered_office_address: [this.defaults?.registered_office_address || ''],
      corporate_identity_number: [this.defaults?.corporate_identity_number || ''],
      year_of_incorporation: [this.defaults?.year_of_incorporation || null],
      year: [this.defaults?.year || '', Validators.required],
      name_of_stock_exchanges: [this.defaults?.name_of_stock_exchanges || ''],
      paid_up_capital: [this.defaults?.paid_up_capital || null],
      turnover: [this.defaults?.turnover || null],
      net_worth: [this.defaults?.net_worth || null],
      entities_included: [null],
      reporting_frequency: [this.defaults?.reporting_frequency || ''],
      designation: [this.defaults?.designation || ''],
      email: [this.defaults?.email || null],
      phone_number: [this.defaults?.phone_number || null],
      status: [this.defaults?.status],
      start: [this.defaults?.start || ''],
      end: [this.defaults?.end || ''],
      financial_months: [this.defaults?.financial_months || ''],
      financial_years: [this.defaults?.financial_years || '']
    })

    this.FinancialYearRange.controls['start'].setValue(this.defaults?.start_date)
    this.FinancialYearRange.controls['end'].setValue(this.defaults?.end_date)

    // if (this.Form.value.year) {
    //   this.Form.controls['year'].enable()
    //   this.Form.controls['start'].disable()
    //   this.Form.controls['end'].disable()
    //   this.FinancialYearRange.disable()
    // }
    // else {
    //   this.Form.controls['start'].enable()
    //   this.Form.controls['end'].enable()
    //   this.FinancialYearRange.enable()
    //   this.Form.controls['year'].disable()

    // }
    // this.FinancialYearRange.setValue
    if (this.defaults?.entities_included) {
      this.selectedDivisions = this.defaults?.entities_included
      const divisionsdata = this.defaults?.entities_included.map((div: any) => div.id)

      this.Form.controls['entities_included'].setValue(divisionsdata);

      this.divisionControl.setValue(divisionsdata);
    }
    // this.Form.controls['year_of_incorporation'].disable()
    this.Form.controls['year'].disable()
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.years = result.data.attributes.Year
        const status = result.data.attributes.modules.esg
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        }
        else if (status === true) {
          this.me()
          this.get_dropdown_values();
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
        const status = result.esg_general_disclosure_create
        if (status === false) {
          Swal.close()
          this.router.navigate(["/error/unauthorized"])
        }

      }
    })
  }

  //get dropdown values
  get_dropdown_values() {
    this.esgService.get_genDis_dropdown_values().subscribe({
      next: (result: any) => {

        this.divisions = result[0].value
      },
      error: (err: any) => {
        console.error("Error fetching data:", err);
      },
    })
  }

  onDivisionSelected(event: any) {

    this.selectedDivisions.push(event)

  }

  onCalendarYearSelected(event: Date, datepicker: any) {  // set calendar year value with selected year
    const selectedCalendarYear = moment(event).format('YYYY');
    this.Form.controls['year_of_incorporation'].setValue(selectedCalendarYear);
    datepicker.close();

    this.selectedYear = this.Form.value.year_of_incorporation

  }
  onYearSelected(event: Date, datepicker: any) {  // set calendar year value with selected year
    const selectedCalendarYear = moment(event).format('YYYY');
    this.Form.controls['year'].setValue(selectedCalendarYear);
    datepicker.close();

    this.selectedReportYear = this.Form.value.year

  }
  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.Form.controls['status'].setValue('Open');
    // this.Form.controls['year_of_incorporation'].enable()
    this.Form.controls['year'].enable()
    const data = {
      'form_value': this.Form.value,
    }
    this.dialogRef.close(data);
  }

  yearVal(data: any) {
    if (this.Form.get('year')?.value) {
      // If start or end date is selected, disable the year field
      this.Form.get('start')?.disable();
      this.Form.get('end')?.disable();
      this.FinancialYearRange.disable()
    } else {
      // If both start and end dates are cleared, enable the year field
      this.Form.get('start')?.enable();
      this.Form.get('end')?.enable();
      this.FinancialYearRange.enable()
    }
  }

  startDateChange(event: any) {


    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1))
    this.Form.controls['start'].setValue(newDate.toISOString().slice(0, 10))
    if (this.Form.get('start')?.value) {
      // If start or end date is selected, disable the year field
      this.Form.get('year')?.disable();
    } else {
      this.Form.get('year')?.enable();
    }
    this.updateMonthsAndYears()
  }


  endDateChange(event: any) {

    const date = new Date(event.value);
    const newDate = new Date(date.setDate(date.getDate() + 1));

    // Check if the year is 1970
    if (newDate.getFullYear() === 1970) {
      this.Form.controls['end'].setValue(null);

    } else {
      this.Form.controls['end'].setValue(newDate.toISOString().slice(0, 10));

    }
    if (this.Form.get('end')?.value) {
      // If start or end date is selected, disable the year field
      this.Form.get('year')?.disable();
    } else {
      this.Form.get('year')?.enable();
    }
    this.generalDisclosureService.get_general_esgs_financialyear(this.Form.value.start, this.Form.value.end).subscribe(
      {
        next: (result: any) => {
          if (result.data.length === 0) {
            this.Form.controls['end'].setValue(newDate.toISOString().slice(0, 10));

          } else {
            const statusText = "A General Disclosure entry already exists for this financial year!";
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          }

        }

      }
    )
    this.updateMonthsAndYears()


  }

  updateMonthsAndYears() {
    const startDate = this.FinancialYearRange.get('start')?.value;
    const endDate = this.FinancialYearRange.get('end')?.value;

    if (startDate && endDate) {
      let months: string[] = [];
      let years: Set<string> = new Set();

      let current = new Date(startDate);

      while (current <= new Date(endDate)) {
        const month = formatDate(current, 'MMMM', 'en-US');
        const year = formatDate(current, 'yyyy', 'en-US');

        if (!months.includes(month)) {
          months.push(month);
        }
        years.add(year);

        // Move to the next month
        current.setMonth(current.getMonth() + 1);
      }

      this.Form.patchValue({
        financial_months: months.join(', '),
        financial_years: Array.from(years).join(', ')
      });
    }
  }
}
