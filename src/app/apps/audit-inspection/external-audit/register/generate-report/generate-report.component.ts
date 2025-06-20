import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { environment } from 'src/environments/environment';
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
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class GenerateReportComponent implements OnInit {

  divisions: any[] = []
  //UserDivisions: any;
  User_Division: any;
  years: any[] = []
  CategoryList: any[] = []
  dropdownValues: any
  unitSpecific: any
  orgID: any
  issuedYearTypes = new FormControl(null);
  divisionTypes = new FormControl(null, [Validators.required]);
  auditCategory = new FormControl([]);

  auditDateRange = new FormGroup({
    start: new FormControl(Validators.required),
    end: new FormControl(Validators.required)
  });

  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<GenerateReportComponent>,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.User_Division = data.user_Divisions
  }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      start: [null],
      end: [null],
      year: [null],
      division: [null, [Validators.required]],
      audit_Category: [null],
      format: [null, [Validators.required]],
      defualt_date: [true],
    });

    this.getDivision()
    this.configuration()
  }


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
          // this.me()

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.get_dropdown_values()
      }
    })
  }

  YearVal(event: any) {


    this.Form.controls['year'].setValue(event.value.toString());
    if (this.issuedYearTypes && this.issuedYearTypes.value?.length > 0) {
      this.auditDateRange.disable();
      this.Form.controls['start'].disable()
      this.Form.controls['end'].disable()
    } else {
      this.auditDateRange.enable();
      this.Form.controls['start'].enable()
      this.Form.controls['end'].enable()
    }
  }

  get_dropdown_values() {

    const module = "External Audit"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        // this.get_audit_type()
        this.get_audit_category()
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_audit_category() {

    this.CategoryList = []
    const category = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Audit Category")
    })
    this.CategoryList = category

  }

  divisionVal(event: any) {
    this.Form.controls['division'].setValue(event.value.toString());
  }

  AuditCategoryVal(event: any) {

    this.Form.controls['audit_Category'].setValue(event.value.toString());
  }

  getDivision() {
    this.generalService.get_division('orgid').subscribe({
      next: (result: any) => {
        if (this.User_Division.length > 0) {
          result.data.forEach((data: any) => {
            this.User_Division.forEach((uuid: any) => {
              if (data.attributes.division_uuid == uuid) {
                const newArray = ({
                  id: data.id as number,
                  division_name: data.attributes.division_name,
                })
                this.divisions.push(newArray);
              }
            })

          })
        } else {
          const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
            id: id as number,
            division_name: attributes.division_name,
          }));

          this.divisions = newArray
        }

      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  startDateChange(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['start'].setValue(newDate)
  }

  endDateChange(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['end'].setValue(newDate)
    this.Form.controls['year'].disable()
    this.Form.controls['defualt_date'].setValue(false)

    this.issuedYearTypes.disable()
  }

  submit() {
    this.dialogRef.close(this.Form.value);


  }



}
