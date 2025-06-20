import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.api.service';
import { MatDialog } from '@angular/material/dialog';
import { ExternalAuditService } from 'src/app/services/external-audit.service';
import { CreateStandardComponent } from './create-standard/create-standard.component';
import { id } from '@swimlane/ngx-datatable';
import { CreateAuditFirmComponent } from '../create-audit-firm/create-audit-firm.component';
import { map, Observable, startWith } from 'rxjs';


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
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ScheduleComponent implements OnInit {

  orgID: string
  divisions: any[] = []
  peopleList: any[] = []
  approversList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  dropdownValues: any
  TypeList: any[] = []
  CategoryList: any[] = []
  StandardList: any[] = []
  auditFirmList: any[] = []
  userDivision: any
  corporateUser: any
  unitSpecific: any

  filteredAuditStandards: Observable<any[]>;
  Audit_standard = new FormControl('', { validators: [Validators.required] });
  Division = new FormControl(null, [Validators.required]);
  Form: FormGroup
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
      ],
    },
  }
  auditDateRange = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required)
  });
  approvalDate = new FormControl(null, [Validators.required]);
  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    public externalAuditService: ExternalAuditService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      org_id: [''],
      reference_number: [''],
      date: [new Date, [Validators.required]],
      division: ['', [Validators.required]],
      audit_type: ['', [Validators.required]],
      announcement: ['', [Validators.required]],
      audit_representative: ['', [Validators.required]],
      audit_firm: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      audit_category: ['', [Validators.required]],
      audit_standard: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      approver: ['', [Validators.required]],
      approval_date: [null, [Validators.required]],
      created_user: [''],
      status: ['Pending'],
      business_unit: [null]
    });

    this.Audit_standard.valueChanges.subscribe(value => {

      if (value == "") {
        this.filteredAuditStandards = this.Audit_standard.valueChanges.pipe(
          startWith(''),
          map(value => this._filterAuditStandard(value))
        );
        console.log(this.filteredAuditStandards)
      }
      else {
        this._filterAuditStandard(value)
        console.log(this.filteredAuditStandards)
      }
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
  }

  approval_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['approval_date'].setValue(newDate)
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.audit_inspection
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.Form.controls['created_user'].setValue(result.id)
        const status = result.ext_aud_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions()
              this.get_profiles()

              this.get_ext_aud_approvers()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_ext_aud_approvers()
              this.get_unit_specific_profiles()
            }
          } else {
            this.get_ext_aud_approvers()
            this.get_profiles()
            this.get_divisions()
          }
          this.get_dropdown_values()
          this.get_audit_standard()
          this.get_audit_firms()

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  BusinessUnit(event: any) {
    this.Form.controls['division'].setValue(event.value.division_name)
    this.Form.controls['business_unit'].setValue(event.value.id)
  }
  //get dropdown values
  get_dropdown_values() {
    const module = "External Audit"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        this.get_audit_type()
        this.get_audit_category()
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }
  //get Audit type  
  get_audit_type() {
    this.TypeList = []
    const type = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Audit Type")
    })
    this.TypeList = type
  }
  //get Audit category  
  get_audit_category() {
    this.CategoryList = []
    const category = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Audit Category")
    })
    this.CategoryList = category
  }
  //get Audit standard  
  get_audit_standard() {
    this.externalAuditService.audit_standards().subscribe({
      next: (result: any) => {
        this.StandardList = result.data

      },
      error: (err: any) => { },
      complete: () => { }
    });
  }
  get_audit_firms() {
    this.externalAuditService.audit_firm().subscribe({
      next: (result: any) => {
        this.auditFirmList = result.data.sort((a: any, b: any) => a.attributes.firm_name.localeCompare(b.attributes.firm_name));
      },
      error: (err: any) => { },
      complete: () => { }
    });
  }

  // get_division() {
  //   this.generalService.get_division(this.orgID).subscribe({
  //     next: (result: any) => {
  //       this.divisions = result.data
  //     },
  //     error: (errL: any) => { },
  //     complete: () => { }
  //   })
  // }
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
  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((person: any) => person.attributes.user?.data?.attributes?.blocked === false);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
  get_unit_specific_profiles() {
    this.authService.get_unit_specific_profiles(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((person: any) => person.attributes.user?.data?.attributes?.blocked === false);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }

  get_ext_aud_approvers() {
    this.externalAuditService.get_ext_aud_approvers(this.orgID).subscribe({
      next: (result: any) => {
        this.approversList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }

  onInputFocus() {
    this.filteredAuditStandards = this.Audit_standard.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAuditStandard(value))
    );
  }


  private _filterAuditStandard(value: any) {
    console.log(value)
    const filterValue = value.toLowerCase();
    console.log(this.StandardList)
    let data = this.StandardList.filter(option => option.attributes.standard_name.toLowerCase().includes(filterValue));
    return data;
  }

  ngDoCheck(): void {
    this.Audit_standard.valueChanges.subscribe(value => {
      if (value == "") {
        this.filteredAuditStandards = this.Audit_standard.valueChanges.pipe(
          startWith(''),
          map(value => this._filterAuditStandard(value))
        );
      }
      else {
        this._filterAuditStandard(value)
      }

    });
  }



  get_unit_specific_ext_aud_approvers() {
    this.externalAuditService.get_unit_specific_ext_aud_approvers(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {
        this.approversList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
  create_reference_number(data: any) {
    this.showProgressPopup();
    this.externalAuditService.get_external_audits_all_entries().subscribe({
      next: (result: any) => {


        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = 'AUD-' + newCount
        this.Form.controls['reference_number'].setValue(reference)
        if (data === "Submit") {
          this.Form.controls['status'].setValue("Scheduled")
          this.schedule()
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  onOptionSelected(event: any) {
    this.Form.controls['audit_standard'].setValue(event.option.value)
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

  schedule() {
    // this.showProgressPopup();
    this.externalAuditService.schedule_external_audit(this.Form.value).subscribe({

      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.create_notification()


      }
    })
  }

  create_notification() {

    let data: any[] = []
    data.push({
      module: "External Audit",
      action: 'Approval Required on External Audit:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.approver,
      access_link: "/apps/audit-inspection/external-audit/action/",
      profile: this.Form.value.created_user
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {

        Swal.fire({
          title: 'Audit Scheduled',
          imageUrl: "assets/images/scheduled.gif",
          imageWidth: 250,
          text: "You have successfully scheduled an external audit. We will notify the approval on the approval date to take further action. If it is required to modify the data, you can modify until the approve approve the audit.",
          showCancelButton: false,

        })
        // const statusText = "Audit Scheduled"
        // this._snackBar.open(statusText, 'OK', {
        //   horizontalPosition: this.horizontalPosition,
        //   verticalPosition: this.verticalPosition,
        // });
        this.router.navigate(["/apps/audit-inspection/external-audit/register"])
      }
    })


  }

  new_audit_standard() {
    this.dialog.open(CreateStandardComponent, { width: '700px' }).afterClosed().subscribe(data => {
      if (data) {
        this.externalAuditService.audit_standards().subscribe({
          next: (result: any) => {
            this.StandardList = result.data;
            this.StandardList.sort((a: any, b: any) => a.attributes.standard_name.localeCompare(b.attributes.standard_name));
          },
          error: (err: any) => { },
          complete: () => {
            // Set the value in the form control
            this.Form.controls['audit_standard'].setValue(data.data.attributes.standard_name);
          }
        });
      }
    });
  }
  new_audit_firm() {
    this.dialog.open(CreateAuditFirmComponent, { width: '700px' }).afterClosed().subscribe(data => {
      if (data) {
        this.externalAuditService.audit_firm().subscribe({
          next: (result: any) => {
            this.auditFirmList = result.data;
            this.auditFirmList.sort((a: any, b: any) => a.attributes.standard_name.localeCompare(b.attributes.standard_name));
          },
          error: (err: any) => { },
          complete: () => {
            // Set the value in the form control
            this.Form.controls['audit_firm'].setValue(data.data.attributes.firm_name);
          }
        });
      }
    });
  }


}
