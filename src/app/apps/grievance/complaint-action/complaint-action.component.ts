import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { GrievanceService } from 'src/app/services/grievance.api.service';
import { saveAs } from 'file-saver';
import { Lightbox } from 'ngx-lightbox';
const { Configuration, OpenAIApi } = require("openai");
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
  selector: 'app-complaint-action',
  templateUrl: './complaint-action.component.html',
  styleUrls: ['./complaint-action.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ComplaintActionComponent implements OnInit {

  evidences: any = []


  type: any;
  subtype: any;
  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 5,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;

  files: File[] = [];
  evidenceafterfiles: File[] = [];
  imglnk: any = environment.client_backend + '/uploads/'
  format: any = ".png"
  evidenceCount: number = 0
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  anonymousForm: FormGroup
  solutionForm: FormGroup
  divisions: any[] = []
  Submissions: any[] = []
  departments: any[] = []
  designations: any[] = []
  joindate = new FormControl(null);
  resolutiondate = new FormControl(null, [Validators.required]);
  evidenceafterFormData = new FormData()
  evidenceData: any
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  dropdownValues: any
  tradeUnion: any[] = []
  unitSpecific: any
  corporateUser: any
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

  constructor(private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private grievanceService: GrievanceService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _lightbox: Lightbox,
    private _location: Location) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
      this.subtype = params['subtype'];
    });
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      reported_date: [null],
      reporter: [''],
      type: [''],
      subtype: [''],
      case_id: [''],
      anonymous: [false],
      tat_days: [''],
      channel: ['', [Validators.required]],
      category: ['', [Validators.required]],
      topic: ['', [Validators.required]],
      submissions: ['', [Validators.required]],
      description: ['', [Validators.required]],
      remarks: [''],
      evidence_before: [''],
      helpdesk_person: ['', [Validators.required]],
      responsible_department: ['', [Validators.required]],
      submission_date: [null],
      status: [''],
      human_rights_violation: ['', [Validators.required]],
      scale: ['', [Validators.required]],
      frequency_rate: ['', [Validators.required]],
      severity_score: [''],
      due_date: [null],
      investigation_required: [false],
      severity_color_code: [''],
      human_rights_score: [null],
      human_rights_final_score: [null],
      scale_score: [null],
      scale_final_score: [null],
      frequency_score: [null],
      frequency_final_score: [null],
      total_score: [null],
      assignee: [''],
      evidence_id: [''],
      evidence_name: [''],
      userId: [''],
      alleged_party: ['']

    });
    this.anonymousForm = this.formBuilder.group({
      person_type: ['', [Validators.required]],
      division: ['', [Validators.required]],
      employee_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      date_of_join: [null, [Validators.required]],
      service_period: ['', [Validators.required]],
      tenure_split: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      supervisor: ['', [Validators.required]],
      employee_shift: ['', [Validators.required]],

    })
    this.solutionForm = this.formBuilder.group({

      solution_provided: ['', [Validators.required]],
      solution_remarks: [''],
      resolution_date: [null, [Validators.required]],
      follow_up: [false],
      evidence_after: [''],
      evidence_name_after: [''],
      format_after: [''],
      evidence_after_id: [''],

    })
    this.Form.controls['type'].setValue(this.type)
    this.Form.controls['subtype'].setValue(this.subtype)
    this.Form.controls['severity_score'].disable()
  }


  open(index: number): void {
    // open lightbox
    this._lightbox.open(this.evidences, index);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.grievance
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

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.grev_action
        this.Form.controls['userId'].setValue(result.id)
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
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_grievance_details()
          this.get_employees()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  resolutionDate(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.solutionForm.controls['resolution_date'].setValue(newDate)
  }

  get_employees() {
    this.generalService.get_employees().subscribe({
      next: (result: any) => {
        this.tradeUnion = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    });
  }
  get_grievance_details() {
    this.files = []
    this.evidenceafterfiles = []
    const reference = this.route.snapshot.paramMap.get('id');
    this.grievanceService.get_grievance_details(reference).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/grievance/assigned-tasks"])

        }
        else {
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['type'].setValue(result.data[0].attributes.type)
          this.Form.controls['description'].setValue(result.data[0].attributes.description)
          this.Form.controls['status'].setValue(result.data[0].attributes.status)
          this.Form.controls['topic'].setValue(result.data[0].attributes.topic)
          this.Form.controls['submissions'].setValue(result.data[0].attributes.submissions)
          this.Form.controls['alleged_party'].setValue(result.data[0].attributes.alleged_party)
          this.Form.controls['remarks'].setValue(result.data[0].attributes.remarks)
          this.Form.controls['helpdesk_person'].setValue(result.data[0].attributes.helpdesk_person)
          this.Form.controls['responsible_department'].setValue(result.data[0].attributes.responsible_department)
          this.Form.controls['submission_date'].setValue(result?.data[0]?.attributes?.submission_date)
          this.Form.controls['channel'].setValue(result.data[0].attributes.channel)
          this.Form.controls['category'].setValue(result.data[0].attributes.category)
          this.Form.controls['anonymous'].setValue(result.data[0].attributes.anonymous)
          this.Form.controls['case_id'].setValue(result.data[0].attributes.case_id)
          this.Form.controls['scale'].setValue(result.data[0].attributes.scale)
          this.Form.controls['severity_score'].setValue(result.data[0].attributes.severity_score)
          this.Form.controls['human_rights_violation'].setValue(result.data[0].attributes.human_rights_violation)
          this.Form.controls['frequency_rate'].setValue(result.data[0].attributes.frequency_rate)
          this.Form.controls['due_date'].setValue(result?.data[0]?.attributes?.due_date)
          this.Form.controls['assignee'].setValue(result?.data[0]?.attributes?.assignee.data.id)
          this.Form.controls['reported_date'].setValue(new Date(result.data[0].attributes.created_date))
          this.anonymousForm.controls['person_type'].setValue(result.data[0].attributes.person_type)
          this.anonymousForm.controls['division'].setValue(result.data[0].attributes.division)
          this.anonymousForm.controls['employee_id'].setValue(result.data[0].attributes.employee_id)
          this.anonymousForm.controls['service_period'].setValue(result.data[0].attributes.service_period)
          this.anonymousForm.controls['name'].setValue(result.data[0].attributes.name)
          this.anonymousForm.controls['employee_shift'].setValue(result.data[0].attributes.employee_shift)
          this.anonymousForm.controls['gender'].setValue(result.data[0].attributes.gender)
          this.anonymousForm.controls['date_of_join'].setValue(result.data[0].attributes.date_of_join)
          this.anonymousForm.controls['tenure_split'].setValue(result.data[0].attributes.tenure_split)
          this.anonymousForm.controls['designation'].setValue(result.data[0].attributes.designation)
          this.anonymousForm.controls['department'].setValue(result.data[0].attributes.department)
          this.anonymousForm.controls['supervisor'].setValue(result.data[0].attributes.supervisor)
          this.solutionForm.controls['solution_remarks'].setValue(result.data[0].attributes.solution_remarks)
          this.solutionForm.controls['solution_provided'].setValue(result.data[0].attributes.solution_provided)
          this.solutionForm.controls['resolution_date'].setValue(result.data[0].attributes.resolution_date)
          this.solutionForm.controls['follow_up'].setValue(result.data[0].attributes.follow_up)
          if (this.solutionForm.value.resolution_date) {
            this.resolutiondate.setValue(new Date(result.data[0].attributes.resolution_date))
          }

          this.joindate.setValue(new Date(result.data[0].attributes.date_of_join))
          this.evidenceData = result.data[0]?.attributes?.grievance_evidences?.data

          if (this.evidenceData?.length > 0) {
            this.Form.controls['evidence_before'].setValue('OK')
          } else {
            this.Form.controls['evidence_before'].reset()
          }
          let eviDataBefore: any[] = []

          const evidence__data = result.data[0]?.attributes?.grievance_evidences?.data
          if (evidence__data?.length > 0) {
            if (evidence__data[0].attributes.evidece_id) {
              this.Form.controls['evidence_id'].setValue(evidence__data[0].id)
              eviDataBefore.push({
                src: environment.client_backend + '/uploads/' + result.data[0].attributes.grievance_evidences.data[0].attributes.evidence_name + '.' + result.data[0].attributes.grievance_evidences.data[0].attributes.format,
                caption: "Evidence",
                thumb: environment.client_backend + '/uploads/' + result.data[0].attributes.grievance_evidences.data[0].attributes.evidence_name + '.' + result.data[0].attributes.grievance_evidences.data[0].attributes.format
              })
              this.evidences = eviDataBefore
            }

          }




          if (evidence__data?.length > 0) {
            if (evidence__data[0].attributes.evidence_after_id) {
              this.solutionForm.controls['evidence_after_id'].setValue(evidence__data[0].attributes.evidence_after_id)
              this.Form.controls['evidence_id'].setValue(evidence__data[0].id)
              evidence__data.forEach((evidence: any) => {
                this.generalService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
                  this.files.push(data)
                })
                this.generalService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_after_name + '.' + evidence.attributes.format_after).subscribe((data: any) => {
                  this.evidenceafterfiles.push(data)
                })
              })
            }

          }
          if (this.Form.value.status === "Open") {
            Swal.fire({
              title: 'Open Task',
              imageUrl: "assets/images/calendar.gif",
              imageWidth: 150,
              text: "In order to provide the solution details. You have to change the status from 'Open' to 'In-Progress'. ",
              showCancelButton: false,
              cancelButtonColor: '#d33',
            })
          }
          this.Form.disable()
          this.anonymousForm.disable()
          this.joindate.disable()
        }
      },
      error: (err: any) => { },
      complete: () => { }

    })
  }

  removeEvidenceAfter(event: any) {
    this.evidenceafterfiles.splice(this.evidenceafterfiles.indexOf(event), 1);
    this.deleteEvidenceAfter()
  }
  deleteEvidenceAfter() {
    this.showProgressPopup()
    const evidenceafterID = this.Form.value.evidence_id
    this.grievanceService.update_evidence_after(evidenceafterID).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => { },
      complete: () => {
        this.generalService.delete_image(this.solutionForm.value.evidence_after_id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            Swal.close()
            const statusText = "Evidence After deleted"
            this._snackBar.open(statusText, 'Close Warning', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_documents()
          }
        })

      }
    })
  }



  selectEvidenceAfter(event: any) {
    const fileLength = this.evidenceafterfiles.length;
    const addedLength = event.addedFiles.length;

    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / (1024 * 1024); // Convert bytes to megabytes
      if (size > 5) {
        const statusText = "Please choose a document below 5 MB";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        const fileTypes = ['pdf', 'docx', 'jpg', 'jpeg', 'png']; // Include image extensions
        const extension = event.addedFiles[0].name.split('.').pop().toLowerCase();
        const isSuccess = fileTypes.indexOf(extension) > -1;

        if (isSuccess) {
          this.evidenceafterfiles.push(...event.addedFiles);
          this.solutionForm.controls['evidence_after'].setErrors(null);
          this.Upload_evidence()
        } else {
          const statusText = "Please choose a document ('pdf', 'word', 'jpg', 'jpeg', 'png')";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else if (fileLength < 6) {
      const statusText = "You have exceeded the upload limit";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  Upload_evidence() {
    this.showProgressPopup()
    const reference = this.Form.value.case_id;
    this.files = this.evidenceafterfiles
    if (this.evidenceafterfiles.length != 0) {
      this.evidenceafterfiles.forEach((elem: any) => {
        this.evidenceafterFormData.delete('files')
        const extension = elem.name.split('.').pop().toLowerCase()
        this.evidenceafterFormData.append('files', elem, reference + '.' + extension)
        this.generalService.upload(this.evidenceafterFormData).subscribe({
          next: (result: any) => {
            let data: any[] = []
            data.push({
              evidence_after_name: result[0].hash,
              format_after: extension,
              grievance: this.Form.value.id,
              evidence_after_id: result[0].id,
              evidence_after: true
            })
            if (this.evidenceData.length > 0) {
              this.Form.enable()
              this.Form.controls['evidence_id'].enable()
              const evidenceId = this.Form.value.evidence_id

              this.grievanceService.update_grievance_evidence(evidenceId, data[0]).subscribe({
                next: (result: any) => { },
                error: (err: any) => {
                  Swal.close()
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  this.Form.disable()

                  Swal.close()
                  this.get_documents()
                  const statusText = " You have successfully uploaded evidence after."
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                }
              })
            }
            else {
              this.Form.enable()
              this.grievanceService.create_grievance_evidence(data[0]).subscribe({
                next: (result: any) => { },
                error: (err: any) => {
                  Swal.close()
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  this.Form.disable()
                  Swal.close()
                  this.get_documents()
                  const statusText = " You have successfully uploaded evidence after."
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                }
              })
            }

          },
          error: (err: any) => { },
          complete: () => {


          }
        })
      })
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
  completed() {
    const formStatus = this.solutionForm.valid
    if (formStatus) {
      Swal.fire({
        title: 'Are you sure?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showProgressPopup();
          this.update_completion_status()
          this.submit()
        }
      })
    } else if (!formStatus) {
      const statusText = "Please fill all mandatory fields"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  convertToDate(dateString: any): Date | null {
    if (!dateString) {
      return null;
    }

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  calculateDuration(submissionDate: Date, resolutionDate: Date): number {
    const submissionTime = submissionDate.getTime();
    const resolutionTime = resolutionDate.getTime();
    const durationInMilliseconds = Math.abs(resolutionTime - submissionTime);
    const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
    return Math.floor(durationInDays);
  }
  update_completion_status() {
    this.showProgressPopup();
    const submissionDate = this.Form.controls['submission_date'].value;
    const resolutionDate = this.solutionForm.controls['resolution_date'].value;
    const submissionDateObj = this.convertToDate(submissionDate);
    const resolutionDateObj = this.convertToDate(resolutionDate);

    if (submissionDateObj && resolutionDateObj) {
      const durationInDays = this.calculateDuration(submissionDateObj, resolutionDateObj);

      this.Form.controls['tat_days'].setValue(durationInDays);
    } else {
      console.error('Invalid dates for duration calculation');
    }

    this.grievanceService.update_completion_status(this.Form.value.id, this.Form.value.tat_days).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Completed',
          imageUrl: "assets/images/confirm.gif",
          text: "You have successfully completed the reported grievance.",
          imageWidth: 250,
          showCancelButton: false,
        }).then((result) => {
          this.ngOnInit()
        })
        this.router.navigate(["/apps/grievance/assigned-tasks"])
      }
    })
  }
  inProgress() {
    this.showProgressPopup();
    this.Form.controls['status'].setValue('In-Progress')
    this.grievanceService.update_inProgress_status(this.Form.value.id).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        Swal.close()
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.close()
        const statusText = " You have successfully changed the status to In Progress"
        this._snackBar.open(statusText, 'Ok', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.ngOnInit()
      }
    })
  }

  get_documents() {
    this.files = []
    this.evidenceafterfiles = []

    const reference = this.route.snapshot.paramMap.get('id');
    this.grievanceService.get_grievance_details(reference).subscribe({
      next: (result: any) => {
        if (this.evidenceData?.length > 0) {
          this.Form.controls['evidence_before'].setValue('OK')
        } else {
          this.Form.controls['evidence_before'].reset()
        }
        const evidence__data = result.data[0]?.attributes?.grievance_evidences?.data
        if (evidence__data?.length > 0) {
          if (evidence__data[0].attributes.evidence_after_id) {
            this.solutionForm.controls['evidence_after_id'].setValue(evidence__data[0].attributes.evidence_after_id)
            this.Form.controls['evidence_id'].setValue(evidence__data[0].id)
            evidence__data.forEach((evidence: any) => {
              this.generalService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
                this.files.push(data)
              })
              this.generalService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_after_name + '.' + evidence.attributes.format_after).subscribe((data: any) => {
                this.evidenceafterfiles.push(data)
              })
            })

          }

        }

      },
      error: (err: any) => { },
      complete: () => { }

    })
  }


  submit() {
    this.update_grievance_solution()
    // const formStatus = this.solutionForm.valid
    // if (formStatus) {
    //   Swal.fire({
    //     title: 'Are you sure?',
    //     imageUrl: "assets/images/confirm-1.gif",
    //     imageWidth: 250,
    //     text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Yes, proceed!'
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.showProgressPopup();
    //       this.update_grievance_solution()
    //     }
    //   })
    // } else if (!formStatus) {
    //   const statusText = "Please fill all mandatory fields"
    //   this._snackBar.open(statusText, 'Close Warning', {
    //     horizontalPosition: this.horizontalPosition,
    //     verticalPosition: this.verticalPosition,
    //   });
    // }
  }
  update_grievance_solution() {
    this.Form.controls['id'].enable()

    this.grievanceService.update_grievance_solution(this.Form.value.id, this.solutionForm.value).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_notification()
      }
    })

  }
  create_notification() {
    let data: any[] = []
    data.push({
      module: "Grievance",
      action: 'Grievance Updated:',
      reference_number: this.Form.value.case_id,
      userID: this.Form.value.assignee,
      access_link: "/apps/grievance/non-grievance-action/",
      profile: this.Form.value.reporter
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Grievance Details Updated',
          imageUrl: "assets/images/success.gif",
          imageWidth: 250,
          text: "You have successfully Updated the Grievance details.",
          showCancelButton: false,
        })
        this.router.navigate(["/apps/grievance/assigned-tasks"])
      }
    })
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

  navigate() {

    this.backToHistory = true
    this._location.back();
  }
  GenerateDescription() {
    const description = this.Form.value.description

    //const topic = this.Form.value.topic
    //const submissions = this.Form.value.submissions

    if (description) {
      document.getElementById('error-text')?.classList.add("hide");

      //const stringWithoutPTags = `Channel: ${channel}, Category: ${category}, Topic: ${topic}, Submissions: ${submissions}`;
      this.chatGPT(description)
    } else {
      document.getElementById('error-text')?.classList.remove("hide");
    }
    // this.Form.controls['reported_date'].disable()
  }


  async chatGPT(description: string) {
    const category = this.Form.value.category;
    document.getElementById('ai-loader')?.classList.remove("hide");
    document.getElementById('ai-suggest')?.classList.add("hide");

    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const message = `Provide step-by-step solutions for the following issue. Each line should address a single actionable solution. Do not use any symbols, numbers, or bullets at the beginning of each line. Return plain text with each solution on a new line only. Issue: ${description}. Category: ${category}.`;


    const requestData = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    };

    try {
      const apiResponse = await openai.createChatCompletion(requestData);

      const { completion_tokens, prompt_tokens, total_tokens } = apiResponse.data.usage;
      this.control_event_open_ai(completion_tokens, prompt_tokens, total_tokens);

      let content = apiResponse.data.choices[0].message.content.trim();

      if (!content.includes('<ul>') && !content.includes('<li>')) {
        const lines = content.split('\n').filter((line: any) => line.trim() !== '');
        content = `<ul>${lines.map((line: any) => `<li>${line.trim()}</li>`).join('')}</ul>`;
      }

      this.solutionForm.controls['solution_provided'].setValue(content);
    } catch (error) {
      console.error('Error while calling OpenAI API:', error);
      this.solutionForm.controls['solution_provided'].setValue('Failed to generate a response.');
    }

    document.getElementById('ai-loader')?.classList.add("hide");
    document.getElementById('ai-suggest')?.classList.remove("hide");
  }


  control_event_open_ai(completion_tokens: any, prompt_tokens: any, total_tokens: any) {
    this.grievanceService.create_open_ai(this.Form.value, completion_tokens, prompt_tokens, total_tokens).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {

      }
    })

  }
}
