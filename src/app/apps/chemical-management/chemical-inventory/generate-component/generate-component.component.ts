import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { log } from 'util';
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
  selector: 'app-generate-component',
  templateUrl: './generate-component.component.html',
  styleUrls: ['./generate-component.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class GenerateComponentComponent implements OnInit {

  Form: FormGroup
  orgID: any
  division: any[] = []
  dateCompleted = new FormControl(null, [Validators.required]);
  dateStart = new FormControl(null, [Validators.required]);
  dateEnd = new FormControl(null, [Validators.required]);
  divisionTypes = new FormControl(null, [Validators.required]);
  divisionUuids: any[] = []
  unitSpecific: any
  userDivision: any
  corporateUser: any

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private generalService: GeneralService, private router: Router,
    public dialogRef: MatDialogRef<GenerateComponentComponent>) { }

  ngOnInit() {
    this.configuration()

    this.Form = this.formBuilder.group({
      division: ['', [Validators.required]],
      contact_person: ['', [Validators.required]],
      title: ['', [Validators.required]],
      email: ['', [Validators.required]],
      date_completed: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
    });
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.chemical
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
        const status = result.chem_inven
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['contact_person'].setValue(result.profile.first_name + " " + result.profile.last_name)
          this.Form.controls['title'].setValue(result.profile.designation)
          this.Form.controls['email'].setValue(result.profile.email)
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions();
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.division.push(elem)
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
        this.division = newArray;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  completedDate(data: any) {
    const date = new Date(data.value)
    const formatDate = new Date(date.setDate(date.getDate() + 1)).toISOString();
    const comDate = formatDate.split('T')[0];
    this.Form.controls['date_completed'].setValue(comDate)
  }

  startDate(data: any) {
    const date = new Date(data.value)
    const formatDate = new Date(date.setDate(date.getDate() + 1)).toISOString();
    const startDate = formatDate.split('T')[0];
    this.Form.controls['start_date'].setValue(startDate)
  }

  endDate(data: any) {
    const date = new Date(data.value)
    const formatDate = new Date(date.setDate(date.getDate() + 1)).toISOString();
    const endDate = formatDate.split('T')[0];
    this.Form.controls['end_date'].setValue(endDate)
  }

  divisionVal(event: any) {
    if (event.value.includes('All Divisions')) {
      this.divisionTypes.setValue(['All Divisions']);
      const allDivisionNames = this.division.map(d => d.division_name).join(',');
      this.Form.controls['division'].setValue(allDivisionNames);

    } else {
      this.Form.controls['division'].setValue(event.value.join(','));
    }
  }

  submit() {

    this.dialogRef.close(this.Form.value)
  }

}
