import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.api.service';
import { MatDialog } from '@angular/material/dialog';
import { IncidentService } from 'src/app/services/incident.api.service';
import { ExternalAuditService } from 'src/app/services/external-audit.service';
import { Location } from '@angular/common';
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
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ActionComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  orgID: string
  divisions: any[] = []
  departments: any[] = []
  peopleList: any[] = []
  employees: any[] = []
  selectedIndex: number = 0;
  auditingTeam: any[] = []
  dropdownValues: any
  TypeList: any[] = []
  CategoryList: any[] = []
  StandardList: any[] = []
  unitSpecific: any
  corporateUser: any
  Form: FormGroup
  divisionUuids: any[] = []
  backToHistory: Boolean = false
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
  approvalDate = new FormControl(null, [Validators.required]);


  auditDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    public externalAuditService: ExternalAuditService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar, private _location: Location) { }

  ngOnInit() {
    this.configuration()

    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      reference_number: [''],
      date: [new Date, [Validators.required]],
      approved_date: [''],
      division: ['', [Validators.required]],
      audit_type: ['', [Validators.required]],
      //audit_fee: ['', [Validators.required]],
      announcement: [''],
      audit_representative: ['', [Validators.required]],
      audit_firm: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      audit_category: ['', [Validators.required]],
      audit_standard: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      approver: ['', [Validators.required]],
      approval_date: ['', [Validators.required]],
      created_user: [''],
      status: ['Pending'],
      updatedBy: [''],
      remarks: [''],
      approver_notification: [null],
      approver_id: [''],
      user_notification: [null]

    });
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
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.audit_inspection
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
        this.Form.controls['updatedBy'].setValue(result.id)
        const status = result.ext_aud_action
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisionUuids.push(elem.division_uuid)
              })
            }
          }
          this.get_audit_details()
          this.get_division()
          this.get_profiles()
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
    const module = "External Audit"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        this.get_audit_type()
        this.get_audit_category()
        this.get_audit_standard()

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
    this.StandardList = []
    const standard = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Audit Standard")
    })
    this.StandardList = standard
  }
  get_division() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        this.divisions = result.data
      },
      error: (errL: any) => { },
      complete: () => { }
    })
  }


  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        this.peopleList = result.data
      },
      error: (err: any) => {
      },
      complete: () => { }
    })
  }


  get_audit_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.externalAuditService.get_audit_details(reference).subscribe({
      next: (result: any) => {
        if (result.data.length > 0) {
          const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
          let matchFound = true;
          if (this.divisionUuids && this.divisionUuids.length > 0) {
            matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
          }
          if ((result.data[0].attributes.audit_status !== 'Scheduled') || (!matchFound || matchFound !== true)) {
            this.router.navigate(["/apps/audit-inspection/external-audit/tasks"])


          } else {
            this.Form.controls['id'].setValue(result.data[0].id)
            this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
            this.Form.controls['division'].setValue(result.data[0].attributes.division)
            this.Form.controls['audit_category'].setValue(result.data[0].attributes.audit_category)
            this.Form.controls['status'].setValue(result.data[0].attributes.audit_status)
            this.Form.controls['audit_type'].setValue(result.data[0].attributes.audit_type)
            this.Form.controls['customer'].setValue(result.data[0].attributes.customer)
            //this.Form.controls['audit_fee'].setValue(result.data[0].attributes.audit_fee)
            this.Form.controls['audit_firm'].setValue(result.data[0].attributes.audit_firm)
            this.Form.controls['approver'].setValue(result.data[0].attributes.approver.data.attributes.first_name + ' ' + result.data[0].attributes.approver.data.attributes.last_name)
            this.Form.controls['approver_id'].setValue(result.data[0].attributes.approver.data.id)

            this.Form.controls['audit_representative'].setValue(result.data[0].attributes.representative.data.attributes.first_name + ' ' + result.data[0].attributes.representative.data.attributes.last_name)
            this.Form.controls['audit_standard'].setValue(result.data[0].attributes.audit_standard)
            this.auditDateRange.controls['start'].setValue(new Date(result.data[0].attributes.audit_start_date))
            this.auditDateRange.controls['end'].setValue(new Date(result.data[0].attributes.audit_end_date))
            this.approvalDate.setValue(new Date(result.data[0].attributes.approval_date))
            this.Form.controls['start'].setValue(new Date(result.data[0].attributes.audit_start_date))
            this.Form.controls['end'].setValue(new Date(result.data[0].attributes.audit_end_date))
            this.Form.controls['approval_date'].setValue(new Date(result.data[0].attributes.approval_date))
            this.Form.controls['created_user'].setValue(result.data[0].attributes.created_By.data.id)
            this.Form.controls['announcement'].setValue(result.data[0].attributes.announcement)
            this.Form.disable()
            this.auditDateRange.controls['start'].disable()
            this.auditDateRange.controls['end'].disable()
            this.approvalDate.disable()
            this.Form.controls['announcement'].enable()
            this.Form.controls['status'].enable()
            this.Form.controls['reference_number'].enable()
            this.Form.controls['date'].enable()
            this.Form.controls['id'].enable()
            this.Form.controls['remarks'].enable()

          }
        } else {
          this.router.navigate(["/apps/audit-inspection/external-audit/register"])
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })

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
  action(data: any) {
    this.showProgressPopup();
    if (data === "Approved" && !this.Form.value.announcement) {
      Swal.fire({
        title: 'Announcement Type Required',
        imageUrl: "assets/images/confirm.gif",
        imageWidth: 250,
        text: "Please provide the announcement type",
        showCancelButton: false,
      })
    } else {

      if (data === "Approved" && this.Form.value.announcement === "Announced" || data === "Approved" && this.Form.value.announcement === "Semi Announced") {
        this.Form.controls['user_notification'].setValue(false)
        this.Form.controls['approved_date'].setValue(new Date)
        this.Form.controls['status'].setValue(data)
        this.update_status()

      } else {
        this.Form.controls['approved_date'].setValue(new Date)
        this.Form.controls['status'].setValue(data)
        this.update_status()
      }

    }
  }

  update_status() {
    this.Form.enable()
    this.externalAuditService.update_status(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.create_notification()


      }
    })

  }

  create_notification() {
    const status = this.Form.value.status
    let data: any[] = []
    data.push({
      module: "External Audit",
      action: 'External Audit:' + ' ' + status + '-',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.created_user,
      access_link: "/apps/audit-inspection/external-audit/register",
      profile: this.Form.value.approver_id
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        Swal.close()
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "Audit Details Updated"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
        this.router.navigate(["/apps/audit-inspection/external-audit/tasks"])
      }
    })
  }

  navigate() {
    this.backToHistory = true
    this._location.back();
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }


}
