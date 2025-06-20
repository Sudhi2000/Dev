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
import { NewAuditeeComponent } from '../new-auditee/new-auditee.component';
import { IncidentService } from 'src/app/services/incident.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { AddAuditorComponent } from '../add-auditor/add-auditor.component';
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
  auditTitle = new FormControl(null, [Validators.required]);
  dropdownValues: any
  auditTitles: any[] = []
  factoryContactPerson = new FormControl(null, [Validators.required]);
  factory = new FormControl(null, [Validators.required]);
  divisionUuids: any[] = []
  userID: any
  teamMemberIDs: any[] = []
  backToHistory: Boolean = false
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
  approvalDate = new FormControl(null, [Validators.required]);

  unitSpecific: any
  corporateUser: any
  userDivision: any
  auditDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    public internalAuditService: InternalAuditService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar, private _location: Location) { }

  ngOnInit() {
    this.configuration()

    this.Form = this.formBuilder.group({
      org_id: [''],
      id: [''],
      reference_number: [''],
      approved_date: [''],
      date: [new Date, [Validators.required]],
      division: ['', [Validators.required]],
      department: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      auditee: [null, [Validators.required]],
      approval_date: ['', [Validators.required]],
      approver: ['', [Validators.required]],
      created_user: [''],
      auditeeID: [''],
      status: ['Draft'],
      factory_name: ['', [Validators.required]],
      factory_address: ['', [Validators.required]],
      contact_person: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      contact_email: ['', [Validators.required]],
      contact_number: ['', [Validators.required]],
      announcement: [''],
      remarks: [''],
      updatedBy: [''],
      auditee_notification: [null],
      approver_id: [''],
      type: [''],
      audit_scheduled_for_supplier: [false],
      supplier_type: [''],
      factory_license_no: [''],
      higg_id: [''],
      zdhc_id: [''],
      process_type: ['']
    });
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
        this.userID = result.id
        this.Form.controls['updatedBy'].setValue(result.id)
        const status = result.int_aud_action
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_audit_details()
          this.get_dropdown_values()
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
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }



  get_dropdown_values() {
    const module = "Internal Audit"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        const title = this.dropdownValues.filter(function (elem: any) {
          return (elem.attributes.Category === "Audit Title")
        })
        this.auditTitles = title
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  AuditTitle(event: any) {
    this.Form.controls['title'].setValue(event.value.toString())
  }






  get_audit_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.internalAuditService.get_audit_details(reference).subscribe({
      next: (result: any) => {
        const uniqueTeamMemberIDs = new Set<number>();
        if (result.data.length > 0) {
          // const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
          const teamMembers = result.data[0].attributes.audit_team_members?.data;
          if (teamMembers && Array.isArray(teamMembers)) {
            teamMembers.forEach(member => {
              const userId = parseInt(member.attributes.user_id, 10);
              if (!isNaN(userId)) {
                uniqueTeamMemberIDs.add(userId);
              }
            });
          }
          this.teamMemberIDs = Array.from(uniqueTeamMemberIDs);
          const approverID = result.data[0].attributes.approver.data?.id;
          let matchFound = true;
          if (this.userID !== approverID && !this.teamMemberIDs.includes(this.userID)) {
            matchFound = false;
          } else if (this.userID === approverID || this.teamMemberIDs.includes(this.userID)) {
            matchFound = true;
          }
          if ((result.data[0].attributes.status !== 'Scheduled')
            || (!matchFound || matchFound !== true)
          ) {
            this.router.navigate(["/apps/audit-inspection/internal-audit/tasks"])
          } else {
            this.Form.controls['id'].setValue(result.data[0].id)
            this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
            this.Form.controls['division'].setValue(result.data[0].attributes.division)
            this.Form.controls['department'].setValue(result.data[0].attributes.department)
            this.Form.controls['title'].setValue(result.data[0].attributes.title)
            this.Form.controls['description'].setValue(result.data[0].attributes.description)
            this.Form.controls['status'].setValue(result.data[0].attributes.status)
            this.Form.controls['start'].setValue(result.data[0].attributes.start_date)
            this.Form.controls['end'].setValue(result.data[0].attributes.end_date)
            const auditeeData = result.data[0]?.attributes.auditees?.data;
            const auditeeIds = auditeeData.map((auditeeItem: any) => auditeeItem.id);
            const auditeeNames = auditeeData.map((auditeeItem: any) => auditeeItem.attributes.auditee_name);
            this.Form.controls['auditeeID'].setValue(auditeeIds);
            this.Form.controls['auditee'].setValue(auditeeNames);
            this.Form.controls['approver'].setValue(result.data[0].attributes.approver.data.attributes.first_name + ' ' + result.data[0].attributes.approver.data.attributes.last_name)
            this.Form.controls['approval_date'].setValue(result.data[0].attributes.approval_date)
            this.Form.controls['created_user'].setValue(result.data[0].attributes.created_By.data.id)
            this.Form.controls['approver_id'].setValue(result.data[0].attributes.approver.data.id)
            this.Form.controls['factory_name'].setValue(result.data[0].attributes.factory_name)
            this.Form.controls['factory_address'].setValue(result.data[0].attributes.factory_address)
            this.Form.controls['contact_person'].setValue(result.data[0].attributes.factory_contact_person)
            this.Form.controls['designation'].setValue(result.data[0].attributes.designation)
            this.Form.controls['contact_email'].setValue(result.data[0].attributes.contact_email)
            this.Form.controls['contact_number'].setValue(result.data[0].attributes.contact_number)
            this.Form.controls['type'].setValue(result.data[0].attributes.type)
            this.Form.controls['audit_scheduled_for_supplier'].setValue(result.data[0].attributes.audit_scheduled_for_supplier)
            this.Form.controls['supplier_type'].setValue(result.data[0].attributes.supplier_type)
            this.Form.controls['factory_license_no'].setValue(result.data[0].attributes.factory_license_no)
            this.Form.controls['higg_id'].setValue(result.data[0].attributes.higg_id)
            this.Form.controls['zdhc_id'].setValue(result.data[0].attributes.zdhc_id)
            this.Form.controls['process_type'].setValue(result.data[0].attributes.process_type)
            this.factory.setValue(result.data[0].attributes.factory_name)
            this.factoryContactPerson.setValue(result.data[0].attributes.factory_contact_person)
            if (result.data[0].attributes.factory_contact_person) {
              var array = result.data[0].attributes.factory_contact_person.includes(',') ?
                result.data[0].attributes.factory_contact_person.split(',') :
                result.data[0].attributes.factory_contact_person;
              this.factoryContactPerson.setValue(array);

            }
            this.auditDateRange.controls['start'].setValue(new Date(result.data[0].attributes.start_date))
            this.auditDateRange.controls['end'].setValue(new Date(result.data[0].attributes.end_date))
            this.approvalDate.setValue(new Date(result.data[0].attributes.approval_date))
            this.Form.disable()
            this.auditDateRange.controls['start'].disable()
            this.auditDateRange.controls['end'].disable()
            this.approvalDate.disable()
            this.auditTitle.disable()
            this.Form.controls['announcement'].enable()
            this.Form.controls['status'].enable()
            this.Form.controls['reference_number'].enable()
            this.Form.controls['date'].enable()
            this.Form.controls['id'].enable()
            this.Form.controls['remarks'].enable()
            if (result.data[0].attributes.audit_team_members.data.length > 0) {
              this.auditingTeam = result.data[0].attributes.audit_team_members.data
            } else {
              this.auditingTeam = []
            }
            if (result.data[0].attributes.title) {
              var array = result.data[0].attributes.title.split(',');
              this.auditTitle.setValue(array)
            }

          }
        } else {
          this.router.navigate(["/apps/audit-inspection/internal-audit/register"])
        }
      },
      error: (err: any) => { },
      complete: () => {
        if (!this.auditingTeam) {

        }
      }
    })

  }









  //
  action(data: any) {
    if (data === "Approved" && !this.Form.value.announcement && this.auditingTeam.length === 0) {
      Swal.fire({
        title: 'Announcement Type & Audit Team Member Required',
        imageUrl: "assets/images/confirm.gif",
        imageWidth: 250,
        text: "Please provide the announcement type and at least one audit team member",
        showCancelButton: false,
      });
    }
    else if (data === "Approved" && this.auditingTeam.length === 0) {
      Swal.fire({
        title: 'Audit Team Member Required',
        imageUrl: "assets/images/confirm.gif",
        imageWidth: 250,
        text: "Please add at least one audit team member",
        showCancelButton: false,
      });
    } else if (data === "Approved" && !this.Form.value.announcement) {
      Swal.fire({
        title: 'Announcement Type Required',
        imageUrl: "assets/images/confirm.gif",
        imageWidth: 250,
        text: "Please provide the announcement type",
        showCancelButton: false,
      });
    } else {
      this.Form.controls['approved_date'].setValue(new Date);
      if ((data === "Approved" && this.Form.value.announcement === "Announced") ||
        (data === "Approved" && this.Form.value.announcement === "Semi Announced")) {
        this.Form.controls['auditee_notification'].setValue(false);
        this.Form.controls['status'].setValue(data);
        this.update_status();
      } else {
        this.Form.controls['status'].setValue(data);
        this.update_status();
      }
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
  update_status() {
    this.Form.enable()
    this.showProgressPopup();
    this.internalAuditService.update_status(this.Form.value).subscribe({
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
      module: "Internal Audit",
      action: 'Internal Audit:' + ' ' + status + '-',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.created_user,
      access_link: "/apps/audit-inspection/internal-audit/register",
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
        this.router.navigate(["/apps/audit-inspection/internal-audit/tasks"])
      }
    })
  }

  addTeam() {
    this.dialog.open(AddAuditorComponent).afterClosed().subscribe((data: any) => {
      this.internalAuditService.create_audit_member(this.Form.value.id, data).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.create_team_member_notification(data)

        }
      })
    })
  }

  create_team_member_notification(teamMember: any) {
    const id = teamMember.id
    let data: any[] = []
    data.push({
      module: "Internal Audit",
      action: 'Added as audit team member:',
      reference_number: this.Form.value.reference_number,
      userID: id,
      access_link: "/apps/audit-inspection/internal-audit/queue",
      profile: this.Form.value.approver_id
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "Team member added"
        this._snackBar.open(statusText, 'Success', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
        this.get_audit_details()
        this.Form.disable()

      }
    })


  }

  deleteMember(data: any) {
    const id = data.id
    this.internalAuditService.delete_audit_member(id).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Team member removed"
        this._snackBar.open(statusText, 'Success', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
        this.get_audit_details()
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
