import { Component, Inject, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
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
  selector: 'app-general-disclosure',
  templateUrl: './general-disclosure.component.html',
  styleUrls: ['./general-disclosure.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]

})
export class GeneralDisclosureComponent implements OnInit {
  Form: FormGroup
  selectedYear: string | null = null;
  selectedReportYear: string | null = null;
  dropdownValues: any
  divisions: any[] = []
  selectedDivisions: any[] = []
  years: any[] = []
  FinancialYearRange = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required)
  });
  static id = 1;
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
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private generalService: GeneralService,
    private generalDisclosureService: GeneralDisclosureService,
    public dialogRef: MatDialogRef<GeneralDisclosureComponent>
  ) { }

  ngOnInit(): void {
    this.configuration()
    this.Form = this.formBuilder.group({
      legal_name: [''],
      nature_of_ownership_and_legal_form: [''],
      location_of_its_headquarters: [''],
      countries_of_operation: [''],
      organisation_email: [null],
      telephone: [null],
      website: [''],
      registered_office_address: [''],
      corporate_identity_number: [''],
      year: ['', Validators.required],
      year_of_incorporation: [''],
      name_of_stock_exchanges: [''],
      paid_up_capital: [null],
      turnover: [null],
      net_worth: [null],
      entities_included: [null],
      reporting_frequency: [''],
      designation: [''],
      email: [null],
      phone_number: [null],
      start: [''],
      end: [''],
      status: ['Open'],
      financial_months: [''],
      financial_years: ['']
    })

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
          this.get_dropdown_values()
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

  onCalendarYearSelected(event: Date, datepicker: any) {  // set calendar year value with selected year
    const selectedCalendarYear = moment(event).format('YYYY');
    this.Form.controls['year_of_incorporation'].setValue(selectedCalendarYear);
    datepicker.close();

    this.selectedYear = this.Form.value.year_of_incorporation

  }
  onYearSelected(event: Date, datepicker: any) {  // set calendar year value with selected year
    const selectedCalendarYear = moment(event).format('YYYY');
    datepicker.close();
    this.generalDisclosureService.get_general_esgs(selectedCalendarYear).subscribe(
      {
        next: (result: any) => {
          if (result.data.length === 0) {
            this.Form.controls['year'].setValue(selectedCalendarYear);

            this.selectedReportYear = this.Form.value.year

          } else {
            datepicker.open()
            const statusText = "A General Disclosure entry already exists for this year!";
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          }

        }
      }
    )
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
    const data = {
      'form_value': this.Form.value,
      'status': 'Open'
    }
    this.dialogRef.close(data);
  }

  draft() {
    this.Form.controls['status'].setValue('Draft')
    const data = {
      'form_value': this.Form.value,
      'status': 'Draft'
    }
    this.dialogRef.close(data);
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
