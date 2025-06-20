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
// import { ActionPlanComponent } from './action-plan/action-plan.component';
import { reference } from '@popperjs/core';
import { UpdateActionPlanComponent } from '../update-action-plan/update-action-plan.component';
import { ViewActionPlanComponent } from '../view-action-plan/view-action-plan.component';
import { ReportPreviewComponent } from '../report-preview/report-preview.component';
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
  selector: 'app-view-audit',
  templateUrl: './view-audit.component.html',
  styleUrls: ['./view-audit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewAuditComponent implements OnInit {



  backToHistory: Boolean = false
  pdfSrcs: string[] = [];
  AuditReportFiles: File[] = [];
  reportData: any[] = []
  files: File[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  documentIds: string[] = [];
  approvalDate = new FormControl(null, [Validators.required]);
  assessmentDate = new FormControl(null, [Validators.required]);
  expiryDate = new FormControl(null, [Validators.required]);
  auditDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  divisionUuids: any[] = []
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
  pdfSource: any
  actionList: any[] = []
  evidenceFormData = new FormData()
  report: any
  pdfUrls: string[] = [];
  unitSpecific: any
  corporateUser: any
  Form: FormGroup
  AuditForm: FormGroup
  actionPlanForm: FormGroup
  actionPlan: any[] = []
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
      audit_fee: ['', [Validators.required]],
      audit_grade: ['', [Validators.required]],
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
      assessment_date: [null, [Validators.required]],
      audit_expiry_date: [null, [Validators.required]],
      created_user: [''],
      status: [''],
      updatedBy: [''],
      remarks: [''],
      approver_notification: [null],
      DocumentFile: [''],
      audit_status: ['', [Validators.required]],
      audit_rating: ['', [Validators.required]],
      grace_period: ['', [Validators.required]],
      non_compliance: ['', [Validators.required]],
      ProcessDate: [[Validators.required]],
      action: [''],
      audit_report: ['', [Validators.required]],
      report: [''],
      auditor_name: ['', [Validators.required]],
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
        const status = result.ext_aud_register
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
  openReport(src: string) {
    this.dialog.open(ReportPreviewComponent, {
      width: '50%', // Adjust the width and other properties as needed
      data: { src },
    });
  }
  // upload_document() {
  //   this.files.forEach((elem: any) => {
  //     this.evidenceFormData.delete('files')
  //     const extension = elem.name.split('.').pop().toLowerCase()
  //     this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
  //     this.generalService.upload(this.evidenceFormData).subscribe({
  //       next: (result: any) => {
  //         let data: any[] = []
  //         data.push({
  //           document_name: result[0].hash,
  //           format: extension,
  //           external_audit: this.Form.value.id,
  //           id: result[0].id
  //         })
  //         this.externalAuditService.create_external_audit_report(data[0]).subscribe({
  //           next: (result: any) => { },
  //           error: (err: any) => { },
  //           complete: () => { }
  //         })
  //         console.log(data)
  //       },
  //       error: (err: any) => { },
  //       complete: () => {
  //       }
  //     })
  //   })
  // }
  auditReport(event: any) {


    const size = event.target.files[0].size / 1024 / 1024
    if (size > 2) {
      const statusText = "Please choose an image below 2 MB"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else {
      var fileTypes = ['pdf'];
      var extension = event.target.files[0].name.split('.').pop().toLowerCase(),
        isSuccess = fileTypes.indexOf(extension) > -1;
      if (isSuccess) {
        this.Form.controls['audit_report'].setErrors(null)
        this.files.push(...event.target.files);
        this.upload()
      } else {
        const statusText = "Please choose files ('PDF')"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    }
    // const files = fileInput.target.files[0];
    // files.forEach((elem:any)=>{
    //   this.evidenceFormData.delete('files')
    //   const extension = elem.name.split('.').pop().toLowerCase()
    //   this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
    //   this.generalService.upload(this.evidenceFormData).subscribe({
    //     next:(result:any)=>{
    //       console.log(result)
    //     },
    //     error:(err:any)=>{},
    //     complete:()=>{}
    //   })


    // })


    // const file = fileInput.target.files[0];
    // const reader = new FileReader();
    // console.log(file)
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //   if(fileInput.target.files[0].size<2500000){
    //     this.Form.controls['DocumentFile'].setValue(reader.result)
    //     this.pdfSource = reader.result;
    //     console.log(this.pdfSource)
    //   }else{

    //     const statusText = "Please select a file below 2 MB"
    //     this._snackBar.open(statusText, 'Close Warning', {
    //     horizontalPosition: this.horizontalPosition,
    //     verticalPosition: this.verticalPosition,
    //   });  
    //   }

    // };
  }

  upload() {
    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          const report_name = result[0].hash
          const report_format = result[0].ext
          const report_id = this.Form.value.id
          this.externalAuditService.update_audit_report(report_name, report_format, report_id).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = "Audit Report Uploaded"
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_audit_details()
            }
          })
        },
        error: (err: any) => { },
        complete: () => { }
      })

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
          if (!matchFound || matchFound !== true) {
            this.router.navigate(["/apps/audit-inspection/external-audit/register"])
          }


          else {
            this.Form.controls['id'].setValue(result.data[0].id)
            this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
            this.Form.controls['division'].setValue(result.data[0].attributes.division)
            this.Form.controls['audit_category'].setValue(result.data[0].attributes.audit_category)
            this.Form.controls['audit_status'].setValue(result.data[0].attributes.status)
            this.Form.controls['status'].setValue(result.data[0].attributes.audit_status)




            this.Form.controls['audit_type'].setValue(result.data[0].attributes.audit_type)
            this.Form.controls['customer'].setValue(result.data[0].attributes.customer)
            this.Form.controls['audit_fee'].setValue(result.data[0].attributes.audit_fee)
            this.Form.controls['audit_grade'].setValue(result.data[0].attributes.audit_grade)
            this.Form.controls['audit_firm'].setValue(result.data[0].attributes.audit_firm)
            this.Form.controls['approver'].setValue(result.data[0].attributes.approver.data.attributes.first_name + ' ' + result.data[0].attributes.approver.data.attributes.last_name)
            this.Form.controls['audit_representative'].setValue(result.data[0].attributes.representative.data.attributes.first_name + ' ' + result.data[0].attributes.representative.data.attributes.last_name)
            this.Form.controls['audit_standard'].setValue(result.data[0].attributes.audit_standard)
            this.auditDateRange.controls['start'].setValue(new Date(result.data[0].attributes.audit_start_date))
            this.auditDateRange.controls['end'].setValue(new Date(result.data[0].attributes.audit_end_date))
            this.approvalDate.setValue(new Date(result.data[0].attributes.approval_date))
            this.Form.controls['start'].setValue(new Date(result.data[0].attributes.audit_start_date))
            this.Form.controls['end'].setValue(new Date(result.data[0].attributes.audit_end_date))
            this.Form.controls['approval_date'].setValue(new Date(result.data[0].attributes.approval_date))
            this.Form.controls['auditor_name'].setValue(result.data[0].attributes.auditor_name)

            this.Form.controls['remarks'].setValue(result.data[0].attributes.approver_remarks)
            if (result.data[0].attributes.assessment_date) {
              this.assessmentDate.setValue(new Date(result.data[0].attributes.assessment_date))

            }
            if (result.data[0].attributes.audit_expiry_date) {
              this.expiryDate.setValue(new Date(result.data[0].attributes.audit_expiry_date))

            }
            this.Form.controls['created_user'].setValue(result.data[0].attributes.created_By.data.id)
            this.Form.controls['announcement'].setValue(result.data[0].attributes.announcement)

            this.Form.controls['audit_rating'].setValue(result.data[0].attributes.audit_rating)
            this.Form.controls['grace_period'].setValue(result.data[0].attributes.grace_period)
            this.Form.controls['non_compliance'].setValue(result.data[0].attributes.non_compliance)

            this.reportData = result.data[0].attributes.external_audit_reports?.data

            if (this.reportData) {
              this.Form.controls['report'].setValue('OK')
            } else {
              this.Form.controls['report'].reset()
            }

            const report__data = result.data[0].attributes.external_audit_reports?.data;

            if (report__data) {

              this.AuditReportFiles = [];
              this.pdfSrcs = [];

              report__data.forEach((report: any, index: number) => {
                this.generalService.getImage(environment.client_backend + '/uploads/' + report.attributes.document_name + '.' + report.attributes.format).subscribe((data: any) => {
                  const blob = new Blob([data], { type: 'application/pdf' });

                  const file = new File([blob], report.attributes.document_name + '.' + report.attributes.format, { type: 'application/pdf' });
                  const documentId = report.id;

                  const pdfUrl = URL.createObjectURL(blob);

                  this.AuditReportFiles.push(file);
                  this.pdfSrcs.push(pdfUrl);

                  this.documentIds[index] = documentId;

                });
              });

            }

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

            this.Form.controls['ProcessDate'].enable()
            this.assessmentDate.disable()
            this.expiryDate.disable()
          }




        } else {
          this.router.navigate(["/apps/audit-inspection/external-audit/queue"])
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })

  }

  updateActionPlan(data: any) {

    this.router.navigate(["/apps/audit-inspection/external-audit/update-action-plan/" + data.id])
  }

  viewActionPlan(data: any) {
    this.dialog.open(ViewActionPlanComponent, { data: { data: data } }).afterClosed().subscribe(data => {
    }
    )
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
