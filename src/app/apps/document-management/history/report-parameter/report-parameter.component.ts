import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY'
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
}

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
  years: any[] = []
  divisions: any[] = []
  orgID: any
  dropdownValues: any[] = []
  documentType: any[] = []
  divisionUuids: any[] = []
  unitSpecific: any
  userDivision: any
  corporateUser: any
  allUnits: any = "All units"
  documentTypes = new FormControl(null, [Validators.required]);
  issuedYearTypes = new FormControl(null, [Validators.required]);
  divisionTypes = new FormControl(null, [Validators.required]);
  statusesForm = new FormControl(null);

  statuses: string[] = ['Active', 'Expired', 'Going to Expire'];
  isSelectingStart: boolean = true;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });



  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ReportParameterComponent>) { }

  ngOnInit(): void {
    this.configuration()



    this.Form = this.formBuilder.group({
      document_type: [null, [Validators.required]],
      year: [null],
      division: [null, [Validators.required]],
      format: [null, [Validators.required]],
      status: [null],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],

    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.document
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
        const status = result.doc_register
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
          this.get_dropdown_values()

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  //get dropdown values
  get_dropdown_values() {
    const module = "Document Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.get_document_type()
      }
    })
  }

  get_document_type() {
    const dataType = this.dropdownValues.filter(function (data: any) {
      return (data.attributes.Category === "Document Type")
    })
    this.documentType = dataType
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
    this.dialogRef.close(this.Form.value);


  }

  documentTypeVal(event: any) {

    this.Form.controls['document_type'].setValue(event.value.toString());


  }

  issuedYearVal(event: any) {
    this.Form.controls['year'].setValue(event.value.toString());

  }

  divisionVal(event: any) {
    this.Form.controls['division'].setValue(event.value.toString());
  }
  statusVal(event: any) {
    this.Form.controls['status'].setValue(event.value.toString());
  }

  onYearSelected(event: any, picker: any) {
    const selectedYear = moment(event).year();
    if (this.isSelectingStart) {
      this.dateRange.get('start')?.setValue(moment({ year: selectedYear }));
      this.Form.controls['startDate'].setValue(selectedYear)
      picker.close()
      this.isSelectingStart = false;
      setTimeout(() => {
        picker.open();
      }, 0);
    } else {
      this.dateRange.get('end')?.setValue(moment({ year: selectedYear }));
      this.Form.controls['endDate'].setValue(selectedYear)
      this.isSelectingStart = true;
      picker.close();
    }

    const startYear = this.dateRange.get('start')?.value.year();
    const endYear = this.dateRange.get('end')?.value.year();

    if (startYear && endYear) {
      const yearArray = [];
      for (let year = startYear; year <= endYear; year++) {
        yearArray.push(year);
      }

      // Set the year array in filterForm.controls['year']
      this.Form.controls['year'].setValue(yearArray);
    }
  }

}
