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
import { ActionPlanComponent } from './action-plan/action-plan.component';
import { reference } from '@popperjs/core';
import { UpdateActionPlanComponent } from '../update-action-plan/update-action-plan.component';
import { ViewActionPlanComponent } from '../view-action-plan/view-action-plan.component';
import { NewRatingComponent } from './new-rating/new-rating.component';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ReportPreviewComponent } from '../report-preview/report-preview.component';
import { NewAuditGradeComponent } from './new-audit-grade/new-audit-grade.component';
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
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AuditComponent implements OnInit {

  pdfSrcs: string[] = [];
  reportData: any[] = []
  files: File[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  userUploadedFiles: File[] = []; // Stores user-uploaded files
  apiAuditReportFiles: File[] = []; // Stores API audit report files
  documentIds: string[] = [];
  approvalDate = new FormControl(null, [Validators.required]);
  assessmentDate = new FormControl(null, [Validators.required]);
  expiryDate = new FormControl(null, [Validators.required]);
  auditDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  isAuditInProgress: boolean = false;
  orgID: string
  divisions: any[] = []
  departments: any[] = []
  peopleList: any[] = []
  ratingList: any[] = []
  employees: any[] = []
  selectedIndex: number = 0;
  auditingTeam: any[] = []
  dropdownValues: any
  TypeList: any[] = []
  CategoryList: any[] = []
  StandardList: any[] = []
  StatusList: any[] = []
  GradeList: any[] = []
  pdfSource: any
  actionList: any[] = []
  evidenceFormData = new FormData()
  report: any
  selectedPdfIndex: number | null = null;
  unitSpecific: any
  corporateUser: any
  Form: FormGroup
  AuditForm: FormGroup
  actionPlanForm: FormGroup
  actionPlan: any[] = []
  divisionUuids: any[] = []

  auditGrade = new FormControl(null);
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
  createdUser: any;


  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    public externalAuditService: ExternalAuditService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar, private _location: Location) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      reference_number: [''],
      inprogress_date: [null],
      completed_date: [null],
      date: [new Date, [Validators.required]],
      division: ['', [Validators.required]],
      audit_type: ['', [Validators.required]],
      audit_fee: [null, [Validators.required]],
      announcement: [''],
      audit_representative: ['', [Validators.required]],
      audit_firm: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      audit_category: ['', [Validators.required]],
      audit_standard: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      approver: ['', [Validators.required]],
      approver_id: [''],
      approval_date: ['', [Validators.required]],
      assessment_date: [null, [Validators.required]],
      audit_expiry_date: [null, [Validators.required]],
      created_user: [''],
      status: [''],
      updatedBy: [''],
      remarks: [''],
      lasped_days: [null],
      lapse_status: [''],
      lapse_color_code: [''],
      approver_notification: [null],
      DocumentFile: [''],
      audit_status: [''],
      audit_grade: [''],
      audit_rating: [''],
      grace_period: ['', [Validators.required]],
      non_compliance: ['', [Validators.required]],
      ProcessDate: [[Validators.required]],
      action: [''],
      audit_report: ['', [Validators.required]],
      report: [''],
      report_id: [''],
      expiry_warning_date: [null],
      auditor_name: ['', [Validators.required]],
      inprogress_notification: [null]
    });
    this.AuditForm = this.formBuilder.group({


    })
    this.actionPlanForm = this.formBuilder.group({

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
  assessment_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['assessment_date'].setValue(newDate)
  }
  audit_expiry_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['audit_expiry_date'].setValue(newDate)
    this.expiryWarnDate()
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
        this.createdUser = result.id
        this.Form.controls['updatedBy'].setValue(result.id)
        const status = result.ext_aud_audit
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
          this.get_ratings()
          this.get_audit_grades()
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
        this.get_audit_status()

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
  //get Audit Status  
  get_audit_status() {
    this.StatusList = []
    const status = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Audit Status")
    })
    this.StatusList = status
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

  get_audit_grades() {
    this.externalAuditService.get_audit_grades().subscribe({
      next: (result: any) => {

        this.GradeList = result.data
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

  get_ratings() {
    this.externalAuditService.get_ratings().subscribe({
      next: (result: any) => {
        this.ratingList = result.data
      },
      error: (err: any) => {
      },
      complete: () => { }
    })
  }


  // auditReport(event: any) {


  //   const size = event.target.files[0].size / 1024 / 1024
  //   if (size > 10) {
  //     const statusText = "Please choose a document below 10 MB"
  //     this._snackBar.open(statusText, 'Close Warning', {
  //       horizontalPosition: this.horizontalPosition,
  //       verticalPosition: this.verticalPosition,
  //     });
  //   } else {
  //     var fileTypes = ['pdf'];
  //     var extension = event.target.files[0].name.split('.').pop().toLowerCase(),
  //       isSuccess = fileTypes.indexOf(extension) > -1;
  //     if (isSuccess) {
  //       this.Form.controls['audit_report'].setErrors(null)
  //       this.files.push(...event.target.files);
  //       this.upload()
  //     } else {
  //       const statusText = "Please choose files ('PDF')"
  //       this._snackBar.open(statusText, 'Close Warning', {
  //         horizontalPosition: this.horizontalPosition,
  //         verticalPosition: this.verticalPosition,
  //       });
  //     }
  //   }

  // }

  // upload() {
  //   this.files.forEach((elem: any) => {
  //     this.evidenceFormData.delete('files')
  //     const extension = elem.name.split('.').pop().toLowerCase()
  //     this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
  //     this.generalService.upload(this.evidenceFormData).subscribe({
  //       next: (result: any) => {
  //         const report_name = result[0].hash
  //         const report_format = result[0].ext
  //         const report_id = this.Form.value.id
  //         console.log(report_id);

  //         this.externalAuditService.update_audit_report(report_name, report_format, report_id).subscribe({
  //           next: (result: any) => { },
  //           error: (err: any) => { },
  //           complete: () => {
  //             const statusText = "Audit Report Uploaded"
  //             this._snackBar.open(statusText, 'OK', {
  //               horizontalPosition: this.horizontalPosition,
  //               verticalPosition: this.verticalPosition,
  //             });
  //             this.get_report()

  //           }
  //         })
  //       },
  //       error: (err: any) => { },
  //       complete: () => { }
  //     })

  //   })
  // }

  get_audit_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.externalAuditService.get_audit_details(reference).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (result.data.length > 0 && result.data[0].attributes.audit_status !== 'Completed' && (matchFound || matchFound !== false)) {
          this.userUploadedFiles = [];
          this.pdfSrcs = [];
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
          this.Form.controls['division'].setValue(result.data[0].attributes.division)
          this.Form.controls['audit_category'].setValue(result.data[0].attributes.audit_category)
          this.Form.controls['audit_status'].setValue(result.data[0].attributes.audit_status)
          this.Form.controls['status'].setValue(result.data[0].attributes.status)
          if (result.data[0].attributes.audit_status === 'In Progress') {
            this.isAuditInProgress = true;
            this.Form.controls['auditor_name'].enable()

          } else {
            this.isAuditInProgress = false;
          }

          this.Form.controls['audit_type'].setValue(result.data[0].attributes.audit_type)
          this.Form.controls['customer'].setValue(result.data[0].attributes.customer)
          this.Form.controls['audit_fee'].setValue(result.data[0].attributes.audit_fee)
          this.Form.controls['audit_grade'].setValue(result.data[0].attributes.audit_grade)
          this.auditGrade.setValue(this.Form.value.audit_grade);
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
          this.Form.controls['remarks'].setValue(result.data[0].attributes.approver_remarks)
          this.Form.controls['auditor_name'].setValue(result.data[0].attributes.auditor_name)
          if (result.data[0].attributes.assessment_date) {
            this.assessmentDate.setValue(new Date(result.data[0].attributes.assessment_date))
            this.Form.controls['assessment_date'].setValue(new Date(result.data[0].attributes.assessment_date))
          }
          if (result.data[0].attributes.audit_expiry_date) {
            this.expiryDate.setValue(new Date(result.data[0].attributes.audit_expiry_date))
            this.Form.controls['audit_expiry_date'].setValue(new Date(result.data[0].attributes.audit_expiry_date))

          }
          if (result.data[0].attributes.expiry_warning_date) {
            this.Form.controls['expiry_warning_date'].setValue(new Date(result.data[0].attributes.expiry_warning_date))

          }
          this.Form.controls['created_user'].setValue(result.data[0].attributes.created_By.data.id)
          this.Form.controls['announcement'].setValue(result.data[0].attributes.announcement)

          this.Form.controls['audit_rating'].setValue(result.data[0].attributes.audit_rating)
          this.Form.controls['grace_period'].setValue(result.data[0].attributes.grace_period)
          this.Form.controls['non_compliance'].setValue(result.data[0].attributes.non_compliance)
          this.report = environment.client_backend + '/uploads/' + result.data[0].attributes.report_name + result.data[0].attributes.report_format,
            this.actionList = result.data[0].attributes.action_plans.data

          this.Form.disable()
          this.auditDateRange.controls['start'].disable()
          this.auditDateRange.controls['end'].disable()
          this.approvalDate.disable()
          this.Form.controls['status'].enable()
          this.Form.controls['reference_number'].enable()
          this.Form.controls['date'].enable()
          this.Form.controls['id'].enable()
          this.Form.controls['remarks'].disable()

          this.Form.controls['audit_rating'].enable()
          this.Form.controls['grace_period'].enable()
          this.Form.controls['non_compliance'].enable()
          this.Form.controls['completed_date'].enable()
          if (this.isAuditInProgress) {
            this.Form.controls['auditor_name'].enable()
            this.Form.controls['assessment_date'].enable()
            this.Form.controls['audit_expiry_date'].enable()
            this.Form.controls['remarks'].enable()

          } else {
            this.Form.controls['auditor_name'].disable();
            this.Form.controls['assessment_date'].disable();
            this.Form.controls['audit_expiry_date'].disable();
            this.Form.controls['remarks'].disable()

          }
          this.Form.controls['ProcessDate'].enable()
          this.Form.controls['audit_status'].enable()
          this.Form.controls['audit_fee'].enable()
          this.Form.controls['audit_grade'].enable()
          this.Form.controls['lasped_days'].enable()
          this.Form.controls['lapse_status'].enable()
          this.Form.controls['lapse_color_code'].enable()
          this.reportData = result.data[0].attributes.external_audit_reports.data
          if (this.reportData.length > 0) {
            this.Form.controls['report'].setValue('OK')
          } else {
            this.Form.controls['report'].reset()
          }

          const report__data = result.data[0].attributes.external_audit_reports.data;

          if (report__data.length > 0) {
            this.apiAuditReportFiles = [];
            this.pdfSrcs = [];

            report__data.forEach((report: any, index: number) => {
              this.generalService.getImage(environment.client_backend + '/uploads/' + report.attributes.document_name + '.' + report.attributes.format).subscribe((data: any) => {
                const blob = new Blob([data], { type: 'application/pdf' });

                const file = new File([blob], report.attributes.document_name + '.' + report.attributes.format, { type: 'application/pdf' });
                const documentId = report.id;

                const pdfUrl = URL.createObjectURL(blob);

                this.apiAuditReportFiles.push(file);
                this.pdfSrcs.push(pdfUrl);

                this.documentIds[index] = documentId;


              });
            });

          }

        } else {
          this.router.navigate(["/apps/audit-inspection/external-audit/queue"])
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })

  }
  update_action_plan_list() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.externalAuditService.get_audit_details(reference).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (result.data.length > 0 && result.data[0].attributes.audit_status !== 'Completed' && (matchFound || matchFound !== false)) {
          this.actionList = result.data[0].attributes.action_plans.data
        } else {
          this.router.navigate(["/apps/audit-inspection/external-audit/queue"])
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })

  }

  new_rating() {

    this.dialog.open(NewRatingComponent).afterClosed().subscribe((data: any) => {

      const name = data.name
      this.externalAuditService.create_rating(name, this.Form.value.reporter).subscribe({
        next: (result: any) => {
          this.externalAuditService.get_ratings().subscribe({
            next: (result: any) => {
              this.ratingList = result.data
              this.Form.controls['audit_rating'].setValue(result.data[0].attributes.rating)

            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              const statusText = "New rating created successfully"
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            }
          })

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })

    })


  }
  Save() {
    this.Form.controls['expiry_warning_date'].enable()
    this.showProgressPopup();
    this.externalAuditService.update_audit_details(this.Form.value).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Audit Details Updated"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
      }
    })

  }
  Complete() {
    const date = new Date();
    const completed_date = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10);
    this.Form.controls['completed_date'].setValue(completed_date);
    const ExpiryDate = new Date(this.Form.controls['audit_expiry_date'].value);
    this.Form.controls['expiry_warning_date'].enable();
    this.Form.controls['assessment_date'].enable();
    this.showProgressPopup();


    const presentDate = new Date();
    const Elapse_days = Math.floor((ExpiryDate.getTime() - presentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    this.Form.controls['lasped_days'].setValue(Elapse_days);
    const expiryWarningDate = new Date(this.Form.controls['expiry_warning_date'].value);
    const grace_period = this.Form.controls['grace_period'].value;

    let lapse_status = '';
    if (presentDate < expiryWarningDate) {
      lapse_status = 'Valid';
    } else if (presentDate >= expiryWarningDate && presentDate < ExpiryDate) {
      lapse_status = 'Going to Expire';
    } else if (presentDate >= ExpiryDate) {
      lapse_status = 'Expired';
    }
    this.Form.controls['lapse_status'].setValue(lapse_status);

    let lapse_color_code = '';
    if (presentDate < expiryWarningDate) {
      lapse_color_code = 'success'; // Green
    } else if (presentDate >= expiryWarningDate && presentDate < ExpiryDate) {
      lapse_color_code = 'warning'; // Yellow
    } else if (presentDate >= ExpiryDate) {
      lapse_color_code = 'danger'; // Red
    }

    this.Form.controls['lapse_color_code'].setValue(lapse_color_code);


    // const expiryWarningDate = new Date(this.Form.controls['expiry_warning_date'].value);
    // const sysDate = new Date();
    // const lapsed_days = Math.floor((expiryWarningDate.getTime() - sysDate.getTime()) / (1000 * 60 * 60 * 24))+1;

    // this.Form.controls['lasped_days'].setValue(lapsed_days);
    // const grace_period = this.Form.controls['grace_period'].value;
    // let lapse_status = '';
    // if (lapsed_days > grace_period) {
    //     lapse_status = 'Valid';
    // } else if (lapsed_days > 0 && lapsed_days <= grace_period) {
    //     lapse_status = 'Going to Expire';
    // } else {
    //     lapse_status = 'Expired';
    // }
    // this.Form.controls['lapse_status'].setValue(lapse_status);

    // let lapse_color_code = '';
    // if (lapsed_days > grace_period) {
    //     lapse_color_code = 'success';
    // } else if (lapsed_days > 0 && lapsed_days <= grace_period) {
    //     lapse_color_code = 'warning';
    // } else {
    //     lapse_color_code = 'danger';
    // }


    // this.Form.controls['lapse_color_code'].setValue(lapse_color_code);
    this.externalAuditService.complete_external_audit(this.Form.value).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Audit Completed";
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close();
        this.router.navigate(["/apps/audit-inspection/external-audit/register"]);
      }
    });
  }



  action(data: any) {
    this.Form.controls['announcement'].enable()
    if (data === "Approved" && !this.Form.value.announcement) {
      Swal.fire({
        title: 'Announcement Type Required',
        imageUrl: "assets/images/confirm.gif",
        imageWidth: 250,
        text: "Please provide the announcement type",
        showCancelButton: false,
      })
    }

    else {

      if (data === "In Progress" && this.Form.value.announcement === "Announced") {
        this.Form.controls['inprogress_notification'].enable()
        this.Form.controls['inprogress_notification'].setValue(false);
        this.Form.controls['status'].setValue(data);
        this.update_status();
      }
      this.Form.controls['inprogress_date'].setValue(new Date)
      if (data === "Approved" && this.Form.value.announcement === "Announced" || data === "Approved" && this.Form.value.announcement === "Semi Announced") {
        this.Form.controls['approver_notification'].setValue(false)
        this.Form.controls['status'].setValue(data)
        this.update_status()

      }

      this.Form.controls['status'].setValue(data)
      this.update_status()

    }
  }




  // get_action_plan() {
  //   const audID = this.Form.value.audid
  //   this.externalAuditService.get_action_plan(audID).subscribe({
  //     next: (result: any) => {
  //       this.actionPlan = result.data
  //     },
  //     error: (err: any) => { },
  //     complete: () => { }
  //   })

  // }
  // updateActionPlan(data: any) {

  //   this.router.navigate(["/apps/audit-inspection/external-audit/update-action-plan/" + data.id])
  // }

  //store witness details 
  updateActionPlan(data: any) {
    const AudID = this.route.snapshot.paramMap.get('id');

    this.externalAuditService.get_external_audits_reference(AudID).subscribe(
      {
        next: (result: any) => {

          const id = result.data[0].id
          const reference = result.data[0].attributes.reference_number
          this.dialog.open(UpdateActionPlanComponent, { data: { data: data, audid: id, reference: reference } }).afterClosed().subscribe(data => {
            this.get_audit_details()
          })
        },
        error: (err: any) => { },
        complete: () => {

        }
      }
    )

  }


  viewActionPlan(data: any) {
    this.dialog.open(ViewActionPlanComponent, { data: { data: data } }).afterClosed().subscribe(data => {
    }
    )
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
    this.assessmentDate.enable()
    this.expiryDate.enable()
    this.showProgressPopup();
    this.externalAuditService.update_status(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.create_notification()
        //this.get_audit_details()

      }
    })

  }
  //store witness details 
  createAction() {
    const AudID = this.route.snapshot.paramMap.get('id');
    this.externalAuditService.get_external_audits_reference(AudID).subscribe(
      {
        next: (result: any) => {

          const id = result.data[0].id
          const reference = result.data[0].attributes.reference_number
          this.dialog.open(ActionPlanComponent, { data: { audid: id, reference: reference } }).afterClosed().subscribe(data => {
            if (data) {
              // this.actionList.push(data)
              this.update_action_plan_list()
              if (this.actionList.length > 0) {
                this.Form.controls['action'].setErrors(null);
              } else {
                this.Form.controls['action'].setValidators(Validators.required);
              }
            }
          })
        },
        error: (err: any) => { },
        complete: () => {

        }
      }
    )

  }

  //delete witness
  deleteAction(data: any) {
    this.actionList.splice(this.actionList.findIndex((existingCustomer) => existingCustomer.id === data.id), 1);
  }
  create_notification() {
    const status = this.Form.value.audit_status
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
        this.get_audit_details()
        //this.router.navigate(["/apps/audit-inspection/external-audit/queue"])
      }
    })
  }

  getReportName(src: string): string {
    // Extract the report name from the src (you may need to adjust this logic)
    const parts = src.split('/');
    const reportFileName = parts[parts.length - 1];

    // You can further format or manipulate the report name as needed
    return reportFileName;
  }

  openReportDialog(src: string) {
    this.dialog.open(ReportPreviewComponent, {
      width: '50%', // Adjust the width and other properties as needed
      data: { src },
    });
  }



  onUpload(event: any): void {
    const maxFiles = 3; // Maximum number of files allowed
    const addedFiles: File[] = event.addedFiles;


    const remainingSlots = maxFiles - this.apiAuditReportFiles.length;


    if (this.apiAuditReportFiles.length >= maxFiles) {
      const statusText = "You can only upload a maximum of 3 files";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      addedFiles.splice(maxFiles);
      return;
    }

    this.userUploadedFiles = [];
    this.pdfSrcs = [];

    for (const file of addedFiles.slice(0, remainingSlots)) {
      if (file) {
        const maxSizeMB = 10;
        const sizeMB = file.size / 1024 / 1024;

        if (sizeMB > maxSizeMB) {
          const statusText = "File size exceeded";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.Form.controls['audit_report'].setErrors(null);
          this.userUploadedFiles.push(file); // Add to userUploadedFiles array
          this.pdfSrcs.push(URL.createObjectURL(file));

          if (file.name) {
            const extension = file.name.split('.').pop()?.toLowerCase();

            if (extension) {
              const formData = new FormData();
              formData.append('files', file, this.Form.value.reference_number + '.' + extension);

              try {
                this.generalService.upload(formData).subscribe({
                  next: (result: any) => {


                    const id = this.Form.value.id; // Document ID
                    let data: any[] = [];
                    data.push({
                      document_name: result[0].hash,
                      format: extension,
                      document_id: result[0].id,
                      external_audit: id,
                    });




                    this.externalAuditService.upload_audit_report(data[0]).subscribe({
                      next: (result: any) => {

                      },
                      error: () => { },
                      complete: () => {
                        const statusText = "Audit Report Uploaded";
                        this._snackBar.open(statusText, 'OK', {
                          horizontalPosition: this.horizontalPosition,
                          verticalPosition: this.verticalPosition,
                        });

                        // this.get_audit_details();
                        this.updated_document_details();
                      },
                    });
                  },
                });
              } catch (error) {
                const statusText = "Something Went Wrong" + error;
                this._snackBar.open(statusText, 'Cancel', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
              }
            }
          }
        }
      }
    }
  }

  updated_document_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.externalAuditService.get_audit_details(reference).subscribe({
      next: (result: any) => {


        if (result.data.length > 0) {
          this.userUploadedFiles = [];
          this.pdfSrcs = [];

          this.reportData = result.data[0].attributes.external_audit_reports.data
          if (this.reportData.length > 0) {
            this.Form.controls['report'].setValue('OK')
          } else {
            this.Form.controls['report'].reset()
          }

          const report__data = result.data[0].attributes.external_audit_reports.data;

          if (report__data.length > 0) {
            this.apiAuditReportFiles = [];
            this.pdfSrcs = [];

            report__data.forEach((report: any, index: number) => {
              this.generalService.getImage(environment.client_backend + '/uploads/' + report.attributes.document_name + '.' + report.attributes.format).subscribe((data: any) => {
                const blob = new Blob([data], { type: 'application/pdf' });

                const file = new File([blob], report.attributes.document_name + '.' + report.attributes.format, { type: 'application/pdf' });
                const documentId = report.id;

                const pdfUrl = URL.createObjectURL(blob);

                this.apiAuditReportFiles.push(file);
                this.pdfSrcs.push(pdfUrl);

                this.documentIds[index] = documentId;


              });
            });

          }

        } else {
          this.router.navigate(["/apps/audit-inspection/external-audit/queue"])
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }


  // onUpload(event: any): void {
  //   const maxFiles = 3; // Maximum number of files allowed
  //   const addedFiles: File[] = event.addedFiles.slice(0, maxFiles); // Get the first 3 files

  //   // Check if any valid files were added
  //   if (addedFiles.length > 0) {
  //     const maxSizeMB = 10; // Maximum file size in MB

  //     // Check if any file size exceeds the maximum allowed size
  //     if (addedFiles.some(file => file.size / 1024 / 1024 > maxSizeMB)) {
  //       // Handle file size exceeded error
  //       console.log("File size exceeded");
  //       return; // Exit the function
  //     }

  //     // Create a FormData object to store all files
  //     const formData = new FormData();

  //     addedFiles.forEach((file: File) => {
  //       // Push the file into files array
  //       this.files.push(file);

  //       // Generate and store the source URL for the PDF viewer
  //       this.pdfSrcs.push(URL.createObjectURL(file));

  //       // Append each file to the FormData object
  //       const extension = file.name.split('.').pop()?.toLowerCase();
  //       formData.append('files', file, this.Form.value.reference_number + '.' + extension);
  //     });

  //     // Send the FormData object containing all files in a single request
  //     this.generalService.upload(formData).subscribe({
  //       next: (result: any) => {
  //         // Handle the response if needed
  //         console.log("Files uploaded successfully", result);
  //         const statusText = "Audit Reports Uploaded";
  //         this._snackBar.open(statusText, 'OK', {
  //           horizontalPosition: this.horizontalPosition,
  //           verticalPosition: this.verticalPosition,
  //         });
  //         this.get_report();
  //       },
  //       error: (err: any) => {
  //         // Handle errors if needed
  //         console.error("Error uploading files", err);
  //       },
  //       complete: () => {
  //         // Handle completion if needed
  //       }
  //     });
  //   }
  // }


  onRemove(file: File, index: number): void {
    if (index < 0 || index >= this.apiAuditReportFiles.length) {
      // console.error(`Invalid index: ${index}`);
      return;
    }

    const documentId = this.documentIds[index];


    if (documentId) {

      this.externalAuditService.delete_audit_report(documentId).subscribe({
        next: (result: any) => {
          const statusText = "Audit Report Deleted";
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

          this.documentIds.splice(index, 1);
          this.apiAuditReportFiles.splice(index, 1);


          this.updated_document_details();
          // this.get_audit_details();
        },
        error: (error) => {
        },
      });
    }
  }

  expiryWarnDate() {
    const gracePeriod = Number(this.Form.value.grace_period)
    const audExpiryDate = this.Form.value.audit_expiry_date

    if (gracePeriod > 0 && audExpiryDate !== null) {
      // const newDate = new Date(date.setDate(date.getDate() - gracePeriod)).toISOString().slice(0, 10)
      const expiryDate = new Date(audExpiryDate); // Convert to a Date object
      const expiryWarningDate = new Date(
        expiryDate.setDate(expiryDate.getDate() - gracePeriod) // Subtract grace period
      );

      const formattedDate = expiryWarningDate.toISOString().split('T')[0];
      this.Form.controls['expiry_warning_date'].enable()
      this.Form.controls['expiry_warning_date'].setValue(formattedDate)
    }

  }

  AuditGrade(event: any) {
    this.Form.controls['audit_grade'].setValue(event.value.toString())
  }


  new_audit_grade() {
    this.dialog.open(NewAuditGradeComponent, { width: "auto" }).afterClosed().subscribe((data: any) => {

      if (data) {
        const name = data.grade_name;
        this.externalAuditService.create_audit_grade(name, this.createdUser).subscribe({
          next: (result: any) => {
            this.externalAuditService.get_audit_grades().subscribe({
              next: (result: any) => {
                this.GradeList = result.data;

              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"]);
              },
              complete: () => {
                const gradename = result.data.attributes.grade_name;

                this.Form.controls['audit_grade'].setValue(gradename)
                this.auditGrade.setValue(gradename);


                const statusText = "New Grade created successfully";
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
              }
            });
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"]);
          },
          complete: () => { }
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
