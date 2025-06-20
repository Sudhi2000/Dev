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
import { reference } from '@popperjs/core';
import { UpdateActionPlanComponent } from '../update-action-plan/update-action-plan.component';
import { ViewActionPlanComponent } from '../view-action-plan/view-action-plan.component';
import { ActionPlanComponent } from '../audit/action-plan/action-plan.component';
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
  selector: 'app-completed-audit',
  templateUrl: './completed-audit.component.html',
  styleUrls: ['./completed-audit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CompletedAuditComponent implements OnInit {

  files: File[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  approvalDate = new FormControl(null, [Validators.required]);
  assessmentDate = new FormControl(null, [Validators.required]);
  expiryDate = new FormControl(null, [Validators.required]);
  auditDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  backToHistory: Boolean = false
  orgID: string
  divisions: any[] = []
  departments: any[] = []
  peopleList: any[] = []
  ratingList: any[] = []
  employees: any[] = []
  selectedIndex: number = 0;
  auditReportFiles: File[] = []; // Stores API audit report files
  auditingTeam: any[] = []
  dropdownValues: any
  TypeList: any[] = []
  CategoryList: any[] = []
  StandardList: any[] = []
  pdfSource: any
  reportData: any[] = []
  pdfSrcs: string[] = [];
  actionList: any[] = []
  evidenceFormData = new FormData()
  report: any
  apiAuditReportFiles: File[] = []; // Stores API audit report files
  documentIds: string[] = [];
  userUploadedFiles: File[] = [];
  Form: FormGroup
  AuditForm: FormGroup
  actionPlanForm: FormGroup
  actionPlan: any[] = []
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
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
      audit_fee: [null, [Validators.required]],
      audit_grade: [null, [Validators.required]],
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
      approver_notification: [null],
      DocumentFile: [''],
      audit_status: [''],
      audit_rating: [''],
      grace_period: ['', [Validators.required]],
      non_compliance: ['', [Validators.required]],
      ProcessDate: [[Validators.required]],
      action: [''],
      audit_report: ['', [Validators.required]],
      auditor_name: ['']
    });
    this.AuditForm = this.formBuilder.group({


    })
    this.actionPlanForm = this.formBuilder.group({

    })
  }


  createAction() {
    const AudID = this.route.snapshot.paramMap.get('id');
    this.externalAuditService.get_external_audits_reference(AudID).subscribe(
      {
        next: (result: any) => {
          const id = result.data[0].id
          const reference = result.data[0].attributes.reference_number
          this.dialog.open(ActionPlanComponent, { data: { audid: id, reference: reference } }).afterClosed().subscribe(data => {
            if (data) {
              //this.actionList.push(data)
              this.get_audit_details()
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
        //this.upload()
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

                        this.get_audit_details();
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
                console.error("File upload error:", error);
              }
            }
          }
        }
      }
    }
  }
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



          this.get_audit_details();
        },
        error: (error) => {
          console.error(error);

        },
      });
    }
  }

  openReport(src: string) {
    this.dialog.open(ReportPreviewComponent, {
      width: '50%',
      data: { src },
    });
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
              this.get_report()

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
            this.router.navigate(["/apps/audit-inspection/external-audit/queue"])

          } else {
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

            this.Form.controls['ProcessDate'].enable()
            this.reportData = result.data[0].attributes.external_audit_reports?.data

            if (this.reportData) {
              this.Form.controls['audit_report'].setValue('OK')
            } else {
              this.Form.controls['audit_report'].reset()
            }

            const report__data = result.data[0].attributes.external_audit_reports?.data;

            if (report__data) {

              this.auditReportFiles = [];
              this.pdfSrcs = [];

              report__data.forEach((report: any, index: number) => {
                this.generalService.getImage(environment.client_backend + '/uploads/' + report.attributes.document_name + '.' + report.attributes.format).subscribe((data: any) => {
                  const blob = new Blob([data], { type: 'application/pdf' });

                  const file = new File([blob], report.attributes.document_name + '.' + report.attributes.format, { type: 'application/pdf' });
                  const documentId = report.id;

                  const pdfUrl = URL.createObjectURL(blob);

                  this.auditReportFiles.push(file);
                  this.pdfSrcs.push(pdfUrl);

                  this.documentIds[index] = documentId;

                });
              });

            }
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
  get_report() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.externalAuditService.get_audit_details(reference).subscribe({
      next: (result: any) => {

        this.report = environment.client_backend + '/uploads/' + result.data[0].attributes.report_name + result.data[0].attributes.report_format

      },
      error: (err: any) => { },
      complete: () => { }
    })

  }

  Save() {
    this.externalAuditService.update_audit_details(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Audit Details Updated"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    })

  }
  Complete() {
    this.externalAuditService.complete_external_audit(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Audit Completed"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.router.navigate(["/apps/audit-inspection/external-audit/register"])
      }
    })

  }

  action(data: any) {
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
        this.Form.controls['approver_notification'].setValue(false)
        this.Form.controls['status'].setValue(data)
        this.update_status()

      } else {
        this.Form.controls['status'].setValue(data)
        this.update_status()
      }

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

    this.dialog.open(UpdateActionPlanComponent, { data: { data: data } }).afterClosed().subscribe(data => {
      this.get_audit_details()
      // {
      //   next: (result: any) => {
      //     console.log(result)

      //     this.dialog.open(UpdateActionPlanComponent, { data: {  data:data } }).afterClosed().subscribe(data => {

      //     })
      //   },
      //   error: (err: any) => { },
      //   complete: () => {

      //   }
    }
    )

  }


  viewActionPlan(data: any) {
    this.dialog.open(ViewActionPlanComponent, { data: { data: data } }).afterClosed().subscribe(data => {
    }
    )
  }
  update_status() {
    this.Form.enable()
    this.assessmentDate.enable()
    this.expiryDate.enable()
    this.externalAuditService.update_status(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.create_notification()
        //this.get_audit_details()

      }
    })

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
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "Audit Details Updated"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.router.navigate(["/apps/audit-inspection/external-audit/queue"])
      }
    })
  }

  exportActionPlan() {
    console.log(this.Form.value.reference_number)



    document.getElementById('ext_action_report')?.classList.add("hide");
    document.getElementById('ext_action_report_loader')?.classList.remove("hide")

    this.externalAuditService.external_audit_action_plan(this.Form.value.reference_number).subscribe((response: any) => {
      // let blob: any = new Blob([response], { type: 'application/xls; charset=utf-8' });
      // const url = window.URL.createObjectURL(blob);
      // window.open(url)

      let blob = new Blob([response], { type: 'application/vnd.ms-excel' }); // For Excel files, use 'application/vnd.ms-excel'
      let url = window.URL.createObjectURL(blob);

      let a = document.createElement('a');
      a.href = url;
      a.download = this.Form.value.reference_number + '_action_plan.xls'; // Set the filename with the .xls extension
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      document.getElementById('ext_action_report')?.classList.remove("hide");
      document.getElementById('ext_action_report_loader')?.classList.add("hide")



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
