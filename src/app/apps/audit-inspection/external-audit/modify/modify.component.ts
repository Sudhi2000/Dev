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
import { CreateStandardComponent } from '../schedule/create-standard/create-standard.component';
import { CreateAuditFirmComponent } from '../create-audit-firm/create-audit-firm.component';
import { map, Observable, startWith } from 'rxjs';
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
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ModifyComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  orgID: string
  divisions: any[] = []
  peopleList: any[] = []
  approversList: any[] = []
  dropdownValues: any
  TypeList: any[] = []
  CategoryList: any[] = []
  StandardList: any[] = []
  auditFirmList: any[] = []
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
  Division = new FormControl(null, [Validators.required]);
  filteredAuditStandards: Observable<any[]>;
  Audit_standard = new FormControl('', { validators: [Validators.required] });

  auditDateRange = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required)
  });
  unitSpecific: any
  corporateUser: any
  userDivision: any
  divisionUuids: any[] = []
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
      division: ['', [Validators.required]],
      audit_type: ['', [Validators.required]],
      //audit_fee: ['', [Validators.required]],
      announcement: ['', [Validators.required]],
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
      business_unit: [null]
    });
    this.Audit_standard.valueChanges.subscribe(value => {
      console.log(value)
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
        this.Form.controls['updatedBy'].setValue(result.id)
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
                this.divisionUuids.push(elem.division_uuid)

              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_ext_aud_approvers()
              this.get_unit_specific_profiles()

            }
          }
          else {
            this.get_divisions()
            this.get_profiles()
            this.get_ext_aud_approvers()
          }
          this.get_dropdown_values()
          this.get_audit_details()
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
        this.get_audit_firms()

      },
      error: (err: any) => { },
      complete: () => { }
    })
  }
  BusinessUnit(event: any) {
    const selectedData = this.divisions.find(data => data.division_name === event.value);
    this.Form.controls['division'].setValue(selectedData.division_name)
    this.Form.controls['business_unit'].setValue(selectedData.id)
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
    this.StandardList.splice(0, this.StandardList.length);

    this.externalAuditService.audit_standards().subscribe({
      next: (result: any) => {
        this.StandardList.push(...result.data);
        this.StandardList.sort((a: any, b: any) => a.attributes.standard_name.localeCompare(b.attributes.standard_name));
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

  onOptionSelected(event: any) {
    this.Form.controls['audit_standard'].setValue(event.option.value)
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
  new_audit_standard() {
    this.dialog.open(CreateStandardComponent, { width: '700px' }).afterClosed().subscribe(data => {
      if (data) {
        // Add the new standard to the existing StandardList
        this.StandardList.push(data.data);

        // Sort the StandardList alphabetically
        this.StandardList.sort((a: any, b: any) => a.attributes.standard_name.localeCompare(b.attributes.standard_name));

        // Set the value in the form control
        this.Form.controls['audit_standard'].setValue(data.data.attributes.standard_name);
      }
    });
  }


  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked === false);
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
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked === false);
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
          if ((result.data[0].attributes.audit_status === 'Scheduled' || result.data[0].attributes.audit_status === 'Change Requested') && (matchFound || matchFound !== false)) {

            this.Form.controls['id'].setValue(result.data[0].id)
            this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
            this.Form.controls['division'].setValue(result.data[0].attributes.division)
            this.Form.controls['announcement'].setValue(result.data[0].attributes.announcement)
            this.Form.controls['audit_category'].setValue(result.data[0].attributes.audit_category)
            this.Form.controls['status'].setValue(result.data[0].attributes.audit_status)
            this.Form.controls['audit_type'].setValue(result.data[0].attributes.audit_type)
            this.Form.controls['customer'].setValue(result.data[0].attributes.customer)
            //this.Form.controls['audit_fee'].setValue(result.data[0].attributes.audit_fee)
            this.Form.controls['audit_firm'].setValue(result.data[0].attributes.audit_firm)
            this.Form.controls['approver'].setValue(result.data[0].attributes.approver.data.id)
            this.Form.controls['audit_representative'].setValue(result.data[0].attributes.representative.data.id)
            this.Form.controls['audit_standard'].setValue(result.data[0].attributes.audit_standard)
            this.auditDateRange.controls['start'].setValue(new Date(result.data[0].attributes.audit_start_date))
            this.auditDateRange.controls['end'].setValue(new Date(result.data[0].attributes.audit_end_date))
            this.Form.controls['start'].setValue(new Date(result.data[0].attributes.audit_start_date))
            this.Form.controls['end'].setValue(new Date(result.data[0].attributes.audit_end_date))
            this.Division.setValue(result.data[0].attributes.division)
            this.Audit_standard.setValue(result.data[0].attributes.audit_standard)
            this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
            if (result.data[0].attributes.approval_date) {
              this.Form.controls['approval_date'].setValue(new Date(result.data[0].attributes.approval_date))
              this.approvalDate.setValue(new Date(result.data[0].attributes.approval_date))


            }

          } else {
            this.router.navigate(["/apps/audit-inspection/external-audit/register"])



          }
        } else {
          this.router.navigate(["/apps/audit-inspection/external-audit/register"])
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })

  }


  auditeeVal(data: any) {
    this.Form.controls['auditeeID'].setValue(data)

  }



  // create_reference_number(data: any) {
  //   if (data === "Save") {
  //     this.Form.controls['status'].setValue("Draft")

  //     this.submit()
  //   } else if (data === "Submit") {
  //     this.Form.controls['status'].setValue("Scheduled")
  //     this.submit()

  //   }

  // }

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
  submit() {
    this.showProgressPopup();
    this.externalAuditService.update_external_audit(this.Form.value).subscribe({
      next: (result: any) => {
        // if (result.data.attributes.status === "Scheduled") {
        //   this.router.navigate(["/apps/audit-inspection/external-audit/register"])
        //   const statusText = "Audit Scheduled Successfully"
        //   this._snackBar.open(statusText, 'OK', {
        //     horizontalPosition: this.horizontalPosition,
        //     verticalPosition: this.verticalPosition,
        //   });
        // } else if (result.data.attributes.status === "Draft") {
        //   const statusText = "Audit Details Saved"
        //   this._snackBar.open(statusText, 'OK', {
        //     horizontalPosition: this.horizontalPosition,
        //     verticalPosition: this.verticalPosition,
        //   });
        //   this.ngOnInit()
        // }
      },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Audit Details Updated"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
        this.get_audit_details()
      }
    })



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
