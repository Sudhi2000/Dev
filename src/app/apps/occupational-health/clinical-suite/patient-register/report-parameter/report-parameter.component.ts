import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { environment } from 'src/environments/environment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { GeneralService } from 'src/app/services/general.api.service';

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
  selector: 'app-report-parameter',
  templateUrl: './report-parameter.component.html',
  styleUrls: ['./report-parameter.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ReportParameterComponent implements OnInit {
  Form: FormGroup
  TypeForm: FormGroup
  divisions: any[] = []
  unitSpecific: any
  userDivision: any
  corporateUser: any
  actionType: string;
  orgID: any
  divisionTypes = new FormControl(null, [Validators.required]);
  dateRange = new FormGroup({
    start: new FormControl(null, [Validators.required]),
    end: new FormControl(null, [Validators.required])
  });

  constructor(
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ReportParameterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.actionType = data.actionType;
  }


  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      division: [null, [Validators.required]],
      company_name: [''],
      format: [null, [Validators.required]],
      reporting_person: [''],
      reporting_email: [''],
      report_type: ['', [Validators.required]]
    });
    this.TypeForm = this.formBuilder.group({
      type: ['', [Validators.required]]
    })
    this.configuration();
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
            }
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.me();
      }
    })
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.Form.controls['reporting_person'].setValue(result.profile.first_name + " " + result.profile.last_name);
        this.Form.controls['reporting_email'].setValue(result.email);

        const status = result.clin_register
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

  startDateChange(event: any) {
    const selectedDate = new Date(event.value);
    const startDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0,
        0
      )
    ).toISOString();

    this.Form.controls['startDate'].setValue(startDate);
  }

  endDateChange(event: any) {
    const selectedDate = new Date(event.value);
    const endDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0,
        0
      )
    ).toISOString();

    this.Form.controls['endDate'].setValue(endDate);
  }

  divisionVal(event: any) {
    this.Form.controls['division'].setValue(event.value.toString());
  }

  submit() {
    this.dialogRef.close(this.Form.value);

  }

  submitType() {
    this.dialogRef.close(this.TypeForm.value);
  }

}
