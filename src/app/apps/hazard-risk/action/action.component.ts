import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CurrencyPipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Lightbox } from 'ngx-lightbox';
const { Configuration, OpenAIApi } = require("openai");


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

  evidenceMultipleIds: any[] = []
  evidenceIds: any[] = [];



  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  generalForm: FormGroup
  resolutionForm: FormGroup
  actionForm: FormGroup
  rejectForm: FormGroup
  orgID: string
  controls: any[] = []

  deligates: any[] = []
  hseHeads: any[] = []
  costPattern = "(?=.*[0-9])";
  currency: string
  duedate = new FormControl(null, [Validators.required]);
  targetedDate = new FormControl(null, [Validators.required]);
  completedDate = new FormControl(null, [Validators.required]);
  coolPeriod: any
  minDate = new Date();
  evidenceFormData = new FormData()
  newFiles: File[] = []
  dueDate: Date;
  evidences: any = []
  files: File[] = [];
  moreFiles: any[] = [];
  moreFilesAfter: any[] = []
  addMoreEvidence: boolean = false
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
  evidenceData: any[] = []
  backToHistory: Boolean = false
  externalReporter: Boolean = false
  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private hazardService: HazardService,
    private imageCompress: NgxImageCompressService,
    private currencyPipe: CurrencyPipe,
    private _snackBar: MatSnackBar,
    private _lightbox: Lightbox) { }

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

  ngOnInit() {
    this.files = []
    this.moreFilesAfter = []
    this.evidenceMultipleIds = []
    this.evidenceFormData.delete('files')


    this.newFiles = []
    this.configuration()
    this.generalForm = this.formBuilder.group({
      id: [''],
      evidenceId: [''],
      reported_date: [new Date()],
      reference_number: ['', [Validators.required]],
      category: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
      reporter: ['', [Validators.required]],
      observation: ['', [Validators.required]],
      division: ['', [Validators.required]],
      location_department: ['', [Validators.required]],
      sub_location: [''],
      assignee: ['', [Validators.required]],
      due_date: ['', [Validators.required]],
      description: [''],
      org_id: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
      updator: ['', [Validators.required]],
      evidence_id: [''],
      user: [''],
    });

    this.actionForm = this.formBuilder.group({
      status: ['Open', [Validators.required]],
      level: ['', [Validators.required]],
      reporterName: ['', [Validators.required]],
      extReporterName: [''],
      ext_reporter_employee_id: [''],
      reporterDesignation: [''],
      deligate: [''],
      hse_head: [null],
      deligate_person: [''],
      responsible_person: [''],
      responsible_deignation: [''],
      unsafe: ['', [Validators.required]],
    })

    this.resolutionForm = this.formBuilder.group({
      control: ['', [Validators.required]],
      cost: [null, [Validators.required]],
      costVal: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
      targeted_date: [''],
      completed_date: [null],
      action_taken: ['', [Validators.required]],
      evidence_type: [''],
      modified_evidence: [false],
      evidence_name: [''],
      evidence_id: [''],
      evidence_after_ID: [''],
      img_id: [''],
      evidence_removed: [false],
      add_more_evidence: [false],
      moreEvidence: []
    })

    this.rejectForm = this.formBuilder.group({
      reject_reason: [''],
      rework_description: ['', [Validators.required]]
    })

    this.generalForm.get('due_date')?.valueChanges.subscribe(dueDate => {
      if (dueDate) {
        this.dueDate = new Date(dueDate);
      }
    });
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.hazard_risk
        this.unitSpecific = result.data.attributes.business_unit_specific
        this.currency = result.data.attributes.currency
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
              this.generalForm.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
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
        const status = result.ehs_action
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
          this.get_dropdown_values()
          this.generalForm.controls['updator'].setValue(result.id)
          this.generalForm.controls['user'].setValue(result.username)
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
    const module = "Hazard and Risk"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        const controls = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Controls")
        })
        this.controls = controls
      },
      error: (err: any) => { },
      complete: () => {
        this.get_profiles()
      }
    })
  }

  //get profiles
  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        this.deligates = result.data;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"]);
      },
      complete: () => {
        this.get_ehs_details();
      }
    });
  }


  get_ehs_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.hazardService.get_ehs_details(this.orgID, reference).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/hazard-risk/history"])
        }
        else {
          this.generalForm.controls['evidence_id'].setValue(result.data[0].attributes.ehs_evidences.data[0].id)
          this.generalForm.controls['id'].setValue(result.data[0].id)
          this.generalForm.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
          this.generalForm.controls['due_date'].setValue(result.data[0].attributes.due_date)
          this.generalForm.controls['category'].setValue(result.data[0].attributes.category)
          this.generalForm.controls['sub_category'].setValue(result.data[0].attributes.sub_category)
          this.generalForm.controls['observation'].setValue(result.data[0].attributes.observation)
          this.generalForm.controls['division'].setValue(result.data[0].attributes.division)
          this.generalForm.controls['location_department'].setValue(result.data[0].attributes.location_department)
          this.generalForm.controls['sub_location'].setValue(result.data[0].attributes.sub_location)
          this.generalForm.controls['description'].setValue(result.data[0].attributes.description)
          this.actionForm.controls['unsafe'].setValue(result.data[0].attributes.unsafe)
          this.generalForm.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
          if (result.data[0].attributes.reporter.data) {
            this.generalForm.controls['reporter'].setValue(result.data[0].attributes.reporter.data.id)
            this.actionForm.controls['reporterName'].setValue(result.data[0].attributes.reporter.data.attributes.first_name + ' ' + result.data[0].attributes.reporter.data.attributes.last_name)
            this.actionForm.controls['reporterDesignation'].setValue(result.data[0].attributes.reporter.data.attributes.designation)
          } else {
            this.actionForm.controls['extReporterName'].setValue(result.data[0].attributes.reporter_name)
            this.actionForm.controls['ext_reporter_employee_id'].setValue(result.data[0].attributes.reporter_employee_id)
            this.externalReporter = true
            this.hseHeads = this.deligates.filter(
              (profile: any) => profile.attributes?.hse_head === true
            );
          }
          this.generalForm.controls['assignee'].setValue(result.data[0].attributes.assignee.data.id)
          this.actionForm.controls['level'].setValue(result.data[0].attributes.level)
          this.actionForm.controls['status'].setValue(result.data[0].attributes.status)
          this.actionForm.controls['responsible_person'].setValue(result.data[0].attributes.responsible.data.attributes.first_name + ' ' + result.data[0].attributes.responsible.data.attributes.last_name)
          this.actionForm.controls['responsible_deignation'].setValue(result.data[0].attributes.responsible.data.attributes.designation)
          if (result.data[0].attributes.status === "Open") {
            this.resolutionForm.disable()
            this.completedDate.disable()
            this.actionForm.controls['deligate'].disable()
            this.actionForm.controls['hse_head'].disable()
          } else if (result.data[0].attributes.status === "In-Progress") {
            this.resolutionForm.enable()
            this.completedDate.enable()
            this.actionForm.controls['deligate'].enable()
            this.actionForm.controls['hse_head'].enable()
            this.rejectForm.controls['rework_description'].enable()
          } else if (result.data[0].attributes.status === "Rejected") {
            this.resolutionForm.disable()
            this.completedDate.disable()
            this.actionForm.controls['deligate'].disable()
            this.rejectForm.controls['rework_description'].disable()
          }
          if (this.actionForm.value.status === "Verify" || this.actionForm.value.status === "Completed") {
            this.router.navigate(["/apps/hazard-risk/assigned-tasks"])
          }
          this.duedate.setValue(new Date(result.data[0].attributes.due_date))
          if (result.data[0].attributes.targeted_date) {



            this.resolutionForm.controls['targeted_date'].setValue(result.data[0].attributes.targeted_date)
            this.targetedDate.setValue(new Date(result.data[0].attributes.targeted_date))
            this.resolutionForm.controls['targeted_date'].disable()
            this.targetedDate.disable()
          }
          if (result.data[0].attributes.completed_date) {
            this.resolutionForm.controls['completed_date'].setValue(result.data[0].attributes.completed_date)
            this.completedDate.setValue(new Date(result.data[0].attributes.completed_date))
            this.resolutionForm.controls['completed_date'].disable()
            this.completedDate.disable()
          }
          if (result.data[0].attributes.deligate.data) {
            this.actionForm.controls['deligate'].setValue(result.data[0].attributes.deligate.data.id)
          } if (result.data[0].attributes.reject_reason) {
            this.rejectForm.controls['reject_reason'].setValue(result.data[0].attributes.reject_reason)
            this.rejectForm.controls['rework_description'].setValue(result.data[0].attributes.rework_description)
            this.rejectForm.controls['reject_reason'].disable()


          }

          this.resolutionForm.controls['control'].setValue(result.data[0].attributes.control)
          this.resolutionForm.controls['cost'].setValue(result.data[0].attributes.cost)
          this.resolutionForm.controls['costVal'].setValue(result.data[0].attributes.cost)
          this.costSymbol(result.data[0].attributes.cost)
          this.resolutionForm.controls['action_taken'].setValue(result.data[0].attributes.action_taken)
          this.resolutionForm.controls['remarks'].setValue(result.data[0].attributes.remarks)
          let eviDataBefore: any[] = []
          eviDataBefore.push({
            src: environment.client_backend + '/uploads/' + result.data[0].attributes.ehs_evidences.data[0].attributes.evidence_name + '.' + result.data[0].attributes.ehs_evidences.data[0].attributes.format,
            caption: "Evidence",
            thumb: environment.client_backend + '/uploads/' + result.data[0].attributes.ehs_evidences.data[0].attributes.evidence_name + '.' + result.data[0].attributes.ehs_evidences.data[0].attributes.format
          })
          this.evidences = eviDataBefore


          // if (result.data[0].attributes.ehs_evidences.data[0].attributes.image_id_after) {
          //   this.addMoreEvidence=true
          //   this.resolutionForm.controls['img_id'].setValue(result.data[0].attributes.ehs_evidences.data[0].attributes.image_id_after)
          //   this.resolutionForm.controls['evidence_id'].setValue(result.data[0].attributes.ehs_evidences.data[0].id)
          //   this.resolutionForm.controls['evidence'].setErrors(null)
          //   this.resolutionForm.controls['add_more_evidence'].setValue(true)
          //   result.data[0].attributes.ehs_evidences.data.forEach((elem: any) => {
          //     this.hazardService.getImage(environment.client_backend + '/uploads/' + elem.attributes.evidence_name_after + '.' + elem.attributes.format_after).subscribe((data: any) => {
          //       this.files.push(data)
          //     })
          //   })
          // }
          this.actionForm.controls['level'].disable()
          this.duedate.disable()

          this.generalForm.disable()
          if (result.data[0].attributes.ehss_multiple_evidences.data.length > 0) {
            let eviDataMoreBefore: any[] = []
            result.data[0].attributes.ehss_multiple_evidences.data.forEach((elem: any) => {
              eviDataMoreBefore.push({
                src: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format,
                caption: "Evidence",
                thumb: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format
              })
            })
            this.moreFiles = eviDataMoreBefore
          }

          if (result.data[0].attributes.ehs_evidences.data[0].attributes.evidence_name_after) {
            this.addMoreEvidence = true
            this.resolutionForm.controls['img_id'].setValue(result.data[0].attributes.ehs_evidences.data[0].attributes.image_id_after)
            this.resolutionForm.controls['evidence_id'].setValue(result.data[0].attributes.ehs_evidences.data[0].id)
            this.resolutionForm.controls['evidence'].setErrors(null)
            result.data[0].attributes.ehs_evidences.data.forEach((evidence: any) => {
              const loadImageAtIndex = (index: number) => {
                if (index >= result.data[0].attributes.ehs_evidences.data.length) {
                  return;
                }
                this.hazardService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name_after + '.' + evidence.attributes.format_after).subscribe((data: any) => {
                  let blobType = '';
                  let fileType = evidence.attributes.format.toLowerCase();
                  blobType = 'image/' + fileType;
                  const blob = new Blob([data], { type: blobType });
                  const file = new File([blob], evidence.attributes.evidence_name_after + '.' + evidence.attributes.format_after, { type: blobType });
                  const documentId = evidence.id;
                  const imageUrl = URL.createObjectURL(blob);
                  const evidenceInfo = {
                    id: documentId,
                    file_name: evidence.attributes.evidence_name_after,
                    file_format: evidence.attributes.format,
                    file: file,
                    pdfUrl: imageUrl,
                    type: blobType,
                    imageIDAfter: Number(evidence.attributes.image_id_after)
                  };
                  this.evidenceIds.push(evidenceInfo);
                  this.files.push(file);
                  loadImageAtIndex(index + 1);
                })
              }
              loadImageAtIndex(0);
            })

          }




          if (result.data[0].attributes.ehss_multiple_evidence_after.data.length > 0) {
            this.resolutionForm.controls['add_more_evidence'].setValue(true)

            result.data[0].attributes.ehss_multiple_evidence_after.data.forEach((evidence: any) => {
              const loadImageAtMultipleIndex = (index: number) => {
                if (index >= result.data[0].attributes.ehss_multiple_evidence_after.data.length) {
                  return;
                }
                this.hazardService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
                  let blobType = '';
                  let fileType = evidence.attributes.format.toLowerCase();
                  blobType = 'image/' + fileType;
                  const blob = new Blob([data], { type: blobType });
                  const file = new File([blob], evidence.attributes.evidence_name + '.' + evidence.attributes.format, { type: blobType });
                  const documentId = evidence.id;
                  const imageUrl = URL.createObjectURL(blob);
                  const evidenceMultipleInfo = {
                    id: documentId,
                    file_name: evidence.attributes.evidence_name,
                    file_format: evidence.attributes.format,
                    file: file,
                    pdfUrl: imageUrl,
                    type: blobType,
                    imageID: Number(evidence.attributes.image_id)
                  };
                  this.evidenceMultipleIds.push(evidenceMultipleInfo);
                  this.moreFilesAfter.push(file);
                  loadImageAtMultipleIndex(index + 5);
                })
              }
              loadImageAtMultipleIndex(0);
            })

          }







        }

      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  open(index: number): void {
    this._lightbox.open(this.evidences, index);
  }

  openMore(index: number): void {
    this._lightbox.open(this.moreFiles, index);
  }

  close(): void {
    this._lightbox.close();
  }

  cost(data: any) {

    const amount = this.currencyPipe.transform(Number(data.target.value), this.currency);
    this.resolutionForm.controls['cost'].setValue(Number(data.target.value))
    this.costSymbol(Number(data.target.value))
  }

  costSymbol(data: any) {
    const amount = this.currencyPipe.transform(data, this.currency);

    // if (amount !== null) {
    //   this.resolutionForm.controls['costVal'].setValue(amount)
    // } else {
    //   this.resolutionForm.controls['cost'].setErrors({ invalid: true });
    // }
    this.resolutionForm.controls['costVal'].setValue(amount)

  }

  onSelect(event: any) {
    this.showProgressPopup()

    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / 1024 / 1024
      if (size > 10) {
        Swal.close()

        this.resolutionForm.controls['modified_evidence'].setValue(false)
        const statusText = "Please choose an image below 10 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['jpg', 'jpeg', 'png'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.resolutionForm.controls['evidence'].setErrors(null)
          this.resolutionForm.controls['modified_evidence'].setValue(true)
          this.resolutionForm.controls['evidence_removed'].setValue(false)
          this.files.push(...event.addedFiles);
          this.addMoreEvidence = true

          this.upload_evidence()

        } else {
          Swal.close()

          this.resolutionForm.controls['modified_evidence'].setValue(false)
          const statusText = "Please choose images ('jpg', 'jpeg', 'png')"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else if (fileLength < 6) {
      Swal.close()
      this.resolutionForm.controls['modified_evidence'].setValue(false)
      const statusText = "You have exceed the upload limit"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

    }
  }

  upload_evidence() {
    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.evidenceFormData.append('files', elem, this.generalForm.value.reference_number + '.' + extension)
      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = []
          data.push({
            evidence_name: result[0].hash,
            format: extension,
            hazard: this.generalForm.value.id,
            id: result[0].id,
            evidence_id: this.generalForm.value.evidence_id
          })
          this.hazardService.update_evidence_after(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              Swal.close()
              this.resolutionForm.controls['evidence'].setValue('OK')
              const statusText = "Evidence Updated Successfully"
              this._snackBar.open(statusText, 'Close', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.refreshImages()
              // this.ngOnInit()
            }
          })
          // this.hazardService.create_ehs_evidence(data[0]).subscribe({
          //   next: (result: any) => { },
          //   error: (err: any) => { },
          //   complete: () => {
          //     Swal.close()
          //     this.resolutionForm.controls['evidence'].setValue('OK')


          //     const statusText = "Evidence Updated Successfully"
          //     this._snackBar.open(statusText, 'Close', {
          //       horizontalPosition: this.horizontalPosition,
          //       verticalPosition: this.verticalPosition,
          //     });
          //     this.ngOnInit()

          //   }
          // })
        },
        error: (err: any) => { },
        complete: () => {
        }
      })
    })
  }

  onRemove(file: File, index: number): void {
    this.showProgressPopup()

    this.hazardService.delete_evidence_file(this.evidenceIds[0].imageIDAfter).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.hazardService.delete_ehs_evidence_after(this.evidenceIds[0].id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            this.resolutionForm.controls['evidence'].reset()
            this.addMoreEvidence = false
            const statusText = "Evidence Removed Successfully"
            this._snackBar.open(statusText, 'Close', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            Swal.close()
            this.refreshImages()

            // this.ngOnInit()
          }
        })
      }
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
  servererror() {
    const statusText = "Internal Server Error"
    this._snackBar.open(statusText, 'Close Warning', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  in_progress() {

    this.resolutionForm.controls['targeted_date'].enable()

    const target = this.resolutionForm.value.targeted_date




    if (target) {
      Swal.fire({
        title: 'Start Progress',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "Please reconfirm that provided targeted date is correct. If it is correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showProgressPopup();
          this.start_progress()
        }
      })
    } else {
      Swal.fire({
        title: 'Empty Target Date',
        imageUrl: "assets/images/calendar.gif",
        imageWidth: 150,
        text: "In order to start progress, please select targeted completion date to complete this task. If not choosen, the due date will be consider as the targeted completion date. ",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showProgressPopup();
          this.start_progress_due_date()
        }
      })
    }

  }

  start_progress() {
    this.hazardService.start_progress(this.generalForm.value, this.resolutionForm.value.targeted_date).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'In Progress',
          imageUrl: "assets/images/start-working.gif",
          imageWidth: 250,
          text: "You have successfully changed the status to In-Progress. Please complete the task before the targeted completion date.",
          showCancelButton: false,

        }).then((result) => {
          this.ngOnInit()
        })
      }
    })
  }

  start_progress_due_date() {
    this.hazardService.start_progress_due_date(this.generalForm.value, this.generalForm.value.due_date).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'In Progress',
          imageUrl: "assets/images/start-working.gif",
          imageWidth: 250,
          text: "You have successfully changed the status to In-Progress. Please complete the task before the targeted completion date.",
          showCancelButton: false,

        }).then((result) => {
          this.ngOnInit()
        })
      }
    })
  }

  // targetdate(data: any) {
  //   const date = new Date(data.value)
  //   date.setDate(date.getDate() + 1)
  //   this.resolutionForm.controls['targeted_date'].setValue(date)
  // }

  targetdate(event: any) {
    const selectedDate = new Date(event.value);
    // this.dueDate = this.generalForm.value.due_date
    if (selectedDate < this.minDate || selectedDate > this.dueDate) {
      this.targetedDate.setErrors({ invalidDate: true });
    } else {
      this.resolutionForm.controls['targeted_date'].setValue(selectedDate);
      this.targetedDate.setErrors(null);
    }
  }


  completeDate(data: any) {
    const date = new Date(data.value)
    date.setDate(date.getDate() + 1)
    this.resolutionForm.controls['completed_date'].setValue(date)


  }

  deligate(data: any) {
    const people = this.deligates.filter(function (elem) {
      return (elem.id == data.value)
    })
    this.actionForm.controls['deligate_person'].setValue(people[0].attributes.first_name + ' ' + people[0].attributes.last_name)
    Swal.fire({
      title: 'Add Team Member',
      imageUrl: "assets/images/deligate.gif",
      imageWidth: 150,
      text: "You are trying to add one of your teammates to support you in completing this particular task. Please confirm.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.add_deligatee()
      }
    })
  }

  add_deligatee() {
    // const ehsID = this.generalForm.value.id
    const deligateID = this.actionForm.value.deligate
    const deligateName = this.actionForm.value.deligate_person
    this.hazardService.add_deligate(this.generalForm.value, deligateID, deligateName).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_deligate_notification()
      }
    })
  }

  create_deligate_notification() {
    let data: any[] = []
    data.push({
      module: "Hazard/Risk Management",
      action: 'Added deligate in Hazard/Risk task:',
      reference_number: this.generalForm.value.reference_number,
      userID: this.actionForm.value.deligate,
      access_link: "/apps/hazard-risk/view/",
      profile: this.generalForm.value.updator
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Teammates  Added',
          imageUrl: "assets/images/user.gif",
          imageWidth: 250,
          text: "You have successfully added one of your teammates to support you in complete this particular task. We will notify the delegate in this regard.",
          showCancelButton: false,
        }).then((result) => {
          // this.ngOnInit()
        })
      }
    })
  }



  ////#############################################
  submit() {
    this.showProgressPopup();


    if (typeof this.resolutionForm.controls['cost'].value === 'string') {

      this.resolutionForm.controls['cost'].setValue(null);
    }


    this.update_ehs()
    // if (this.files.length > 0 && this.resolutionForm.value.img_id && this.files[0].name) {
    //   this.delete_exiting_evidence()
    // }
    // if (this.files.length > 0 && this.resolutionForm.value.img_id && !this.files[0].name) {
    //   this.update_ehs()
    // }
    // else if (this.files.length > 0 && !this.resolutionForm.value.img_id) {
    //   this.upload_new_image()
    // } else if (!this.files.length && !this.resolutionForm.value.img_id) {
    //   this.update_ehs()
    // } else if (!this.files.length && this.resolutionForm.value.img_id) {
    //   this.delete_exiting_evidence()
    // }
  }

  delete_exiting_evidence() {
    const imgID = Number(this.resolutionForm.value.img_id)
    const eviID = this.generalForm.value.evidence_id

    this.generalService.destroy(imgID).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        Swal.close()
        this.servererror();
      },
      complete: () => {
        if (!this.files.length && this.resolutionForm.value.img_id) {

          let data: any[] = []
          data.push({
            evidID: eviID,
            evidence_name: '',
            format: '',
            image_id: null
          })
          this.update_ehs_evidence(data[0])

        } else {
          this.upload_new_image()
        }

      }
    })
  }
  control_event_open_ai(completion_tokens: any, prompt_tokens: any, total_tokens: any) {
    this.hazardService.create_open_ai(this.generalForm.value, completion_tokens, prompt_tokens, total_tokens).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {

      }
    })

  }
  upload_new_image() {
    const eviID = this.generalForm.value.evidence_id


    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      const extension = elem.name?.split('.').pop().toLowerCase()
      this.evidenceFormData.append('files', elem, this.generalForm.value.reference_number + '.' + extension)
      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = []
          data.push({
            evidID: eviID,
            evidence_name: result[0].hash,
            format: extension,
            image_id: result[0].id
          })
          this.update_ehs_evidence(data[0])
        },
        error: (err: any) => {
          Swal.close();
          this.servererror();
        },
        complete: () => {
        }
      })
    })

  }

  update_ehs_evidence(data: any) {
    this.hazardService.update_evidence_after(data).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        Swal.close();
        this.servererror();
      },
      complete: () => {
        this.update_ehs()
      }
    })
  }

  update_ehs() {
    this.hazardService.update_ehs_resolution(this.generalForm.value, this.resolutionForm.value, this.rejectForm.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        if (this.actionForm.value.status != 'Verify') {
          Swal.fire({
            title: 'Updated',
            imageUrl: "assets/images/update.gif",
            imageWidth: 150,
            text: "The resolution details has updated successfully. You can modify the details until the task completion",
            showCancelButton: false,
            cancelButtonColor: '#d33',
          }).then((result) => {
            this.ngOnInit()
          })
        }

      }
    })

  }

  completed() {
    if (this.externalReporter === true && !this.actionForm.value.hse_head) {
      const statusText = "Please Select HSE Head"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else {
      this.resolutionForm.controls['completed_date'].enable()




      const resolution = this.resolutionForm.valid
      const rejectReason = this.rejectForm.get('reject_reason')?.value;

      if (rejectReason) {
        const reworkData = this.rejectForm.get('rework_description')?.value;
        if (!reworkData) {
          Swal.fire({
            title: 'Cannot Submit',
            text: 'Please provide  the rework description reason before submitting.',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          return; // Stop execution if reject_reason is true
        }

      }
      if (resolution) {
        const completionDate = this.resolutionForm.value.completed_date
        if (completionDate) {
          this.showProgressPopup();
          this.generalForm.enable()
          this.resolutionForm.enable()
          this.hazardService.ehs_completion(this.generalForm.value, this.resolutionForm.value, this.rejectForm.value, this.actionForm.value.hse_head).subscribe({
            next: (result: any) => {
              this.actionForm.controls['status'].setValue(result.data.attributes.status)
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              this.submit()
              this.create_notification()
            }
          })
        } else {
          Swal.fire({
            title: 'Empty Completion Date',
            imageUrl: "assets/images/calendar.gif",
            imageWidth: 150,
            text: "In order to complete the task. Please provide the task completed date",
            showCancelButton: false,
            cancelButtonColor: '#d33',
          })
        }

      } else {
        const statusText = "Please provide resolution details"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

      }
    }

  }




  create_notification() {
    let data: any[] = []
    data.push({
      module: "Hazard/Risk Management",
      action: 'Completed Hazard/Risk task:',
      reference_number: this.generalForm.value.reference_number,
      userID: this.externalReporter === false ? this.generalForm.value.reporter : this.actionForm.value.hse_head,
      access_link: "/apps/hazard-risk/verify/",
      profile: this.generalForm.value.updator
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Task Completed',
          imageUrl: "assets/images/confirm-1.gif",
          imageWidth: 150,
          text: "The task completed successully. The resoution details has submitted for review.",
          showCancelButton: false,
          cancelButtonColor: '#d33',
        })
        this.router.navigate(["/apps/hazard-risk/assigned-tasks"])
      }
    })
  }


  async chatGPT() {
    document.getElementById('ai-loader')?.classList.remove("hide");
    const category = this.generalForm.value.category;
    const observation = this.generalForm.value.observation;

    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    const message = 'Top 5 resolution for a hazard happens in the ' + category + ' category the ' + observation + '.should be provided in points in a numerical order. ';

    try {
      let requestData = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      };

      let apiResponse = await openai.createChatCompletion(requestData);

      if (apiResponse.data.choices[0].message) {
        const responseLines = apiResponse.data.choices[0].message.content.split('\n');
        const selectedPoints = [];
        for (let i = 0; i < responseLines.length; i++) {
          if (selectedPoints.length === 5) {
            break;
          }
          if (responseLines[i].trim() !== '') {
            selectedPoints.push(responseLines[i]);
          }
        }

        const limitedResponse = selectedPoints.join('<br><br>');
        const completion_tokens = apiResponse.data.usage.completion_tokens;
        const prompt_tokens = apiResponse.data.usage.prompt_tokens;
        const total_tokens = apiResponse.data.usage.total_tokens;

        this.control_event_open_ai(completion_tokens, prompt_tokens, total_tokens);

        this.resolutionForm.controls['action_taken'].setValue(limitedResponse);
        document.getElementById('ai-loader')?.classList.add("hide");
      } else {
      }
    } catch (error) {
    }
  }

  onSelectMoreEvidence(event: any) {
    const fileLength = this.moreFilesAfter.length
    const addedLength = event.addedFiles.length
    this.evidenceMultipleIds = []
    this.newFiles = []
    this.moreFilesAfter = []

    if (fileLength < 5 && addedLength < 6) {
      const size = event.addedFiles[0].size / 1024 / 1024
      if (size > 10) {
        const statusText = "Please choose an image below 10 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['jpg', 'jpeg', 'png'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.resolutionForm.controls['moreEvidence'].setErrors(null)
          this.newFiles.push(...event.addedFiles);
          this.createMultipleEvidence()
          this.showProgressPopup()

        } else {
          const statusText = "Please choose images ('jpg', 'jpeg', 'png')"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }

    } else if (fileLength < 6) {
      const statusText = "You have exceed the upload limit"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      this.refreshImages()
    }

  }

  onRemoveMoreEvidence(file: File, index: number): void {
    const data = this.evidenceMultipleIds.filter(function (elem: any, i: number) {
      return (i === index)
    })
    this.hazardService.delete_evidence_file(data[0].imageID).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.hazardService.delete_ehs_multiple_evidence(data[0].id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            this.resolutionForm.controls['evidence'].reset()
            const statusText = "Evidence Removed Successfully"
            this._snackBar.open(statusText, 'Close', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            Swal.close()
            this.refreshImages()
            // this.ngOnInit()
          }
        })
      }
    })


    // this.showProgressPopup()
    // if (index < 0 || index >= this.moreFiles.length) {
    //   return;
    // }
    // const documentId = this.evidenceMultipleIds[0].imageID;
    // const evidenceId = this.evidenceMultipleIds[0].id;

    // if (documentId) {
    //   this.hazardService.delete_evidence_file(documentId).subscribe({
    //     next: (result: any) => { },
    //     error: (err: any) => { },
    //     complete: () => {
    //       this.hazardService.delete_ehs_multiple_evidence(evidenceId).subscribe({
    //         next: (result: any) => { },
    //         error: (err: any) => { },
    //         complete: () => {
    //           this.Form.controls['evidence'].reset()
    //           const statusText = "Evidence Removed Successfully"
    //           this._snackBar.open(statusText, 'Close', {
    //             horizontalPosition: this.horizontalPosition,
    //             verticalPosition: this.verticalPosition,
    //           });
    //           this.ngOnInit()
    //           Swal.close()

    //         }
    //       })
    //     }
    //   })

    // }

  }

  createMultipleEvidence() {
    if (this.newFiles.length > 0) {
      let count = 0
      let totalFile = this.newFiles.length
      this.newFiles.forEach((evidence: any) => {

        const extension = evidence.name.split('.').pop().toLowerCase()
        this.evidenceFormData.append('files', evidence, this.generalForm.value.reference_number + '.' + extension)
      })

      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          result.forEach((elem: any) => {
            let data: any[] = []
            const extension = elem.name.split('.').pop().toLowerCase()
            data.push({
              evidence_name: elem.hash,
              format: extension,
              hazard: this.generalForm.value.id,
              id: elem.id
            })

            this.hazardService.create_multiple_evidence_after(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                count++
                if (totalFile === count) {
                  Swal.close()
                  // this.ngOnInit()
                }
              }
            })
          })
        },
        error: (err: any) => { },
        complete: () => {
          this.refreshImages()
        }
      })

    }
  }
  refreshImages() {
    this.files = []
    this.moreFilesAfter = []
    this.newFiles = []
    this.moreFiles = []
    this.evidenceMultipleIds = []
    this.evidenceFormData.delete('files')
    const reference = this.route.snapshot.paramMap.get('id');
    this.hazardService.get_ehs_details(this.orgID, reference).subscribe({
      next: (result: any) => {
        if (result.data[0].attributes.ehss_multiple_evidences.data.length > 0) {
          let eviDataMoreBefore: any[] = []
          result.data[0].attributes.ehss_multiple_evidences.data.forEach((elem: any) => {
            eviDataMoreBefore.push({
              src: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format,
              caption: "Evidence",
              thumb: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format
            })
          })
          this.moreFiles = eviDataMoreBefore
        }
        if (result.data[0].attributes.ehs_evidences.data[0].attributes.evidence_name_after) {
          this.addMoreEvidence = true
          this.resolutionForm.controls['img_id'].setValue(result.data[0].attributes.ehs_evidences.data[0].attributes.image_id_after)
          this.resolutionForm.controls['evidence_id'].setValue(result.data[0].attributes.ehs_evidences.data[0].id)
          this.resolutionForm.controls['evidence'].setErrors(null)
          result.data[0].attributes.ehs_evidences.data.forEach((evidence: any) => {
            const loadImageAtIndex = (index: number) => {
              if (index >= result.data[0].attributes.ehs_evidences.data.length) {
                return;
              }
              this.hazardService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name_after + '.' + evidence.attributes.format_after).subscribe((data: any) => {
                let blobType = '';
                let fileType = evidence.attributes.format.toLowerCase();
                blobType = 'image/' + fileType;
                const blob = new Blob([data], { type: blobType });
                const file = new File([blob], evidence.attributes.evidence_name_after + '.' + evidence.attributes.format_after, { type: blobType });
                const documentId = evidence.id;
                const imageUrl = URL.createObjectURL(blob);
                const evidenceInfo = {
                  id: documentId,
                  file_name: evidence.attributes.evidence_name_after,
                  file_format: evidence.attributes.format,
                  file: file,
                  pdfUrl: imageUrl,
                  type: blobType,
                  imageIDAfter: Number(evidence.attributes.image_id_after)
                };
                this.evidenceIds.push(evidenceInfo);
                this.files.push(file);
                loadImageAtIndex(index + 1);
              })
            }
            loadImageAtIndex(0);
          })

        }




        if (result.data[0].attributes.ehss_multiple_evidence_after.data.length > 0) {
          this.resolutionForm.controls['add_more_evidence'].setValue(true)

          result.data[0].attributes.ehss_multiple_evidence_after.data.forEach((evidence: any) => {
            const loadImageAtMultipleIndex = (index: number) => {
              if (index >= result.data[0].attributes.ehss_multiple_evidence_after.data.length) {
                return;
              }
              this.hazardService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
                let blobType = '';
                let fileType = evidence.attributes.format.toLowerCase();
                blobType = 'image/' + fileType;
                const blob = new Blob([data], { type: blobType });
                const file = new File([blob], evidence.attributes.evidence_name + '.' + evidence.attributes.format, { type: blobType });
                const documentId = evidence.id;
                const imageUrl = URL.createObjectURL(blob);
                const evidenceMultipleInfo = {
                  id: documentId,
                  file_name: evidence.attributes.evidence_name,
                  file_format: evidence.attributes.format,
                  file: file,
                  pdfUrl: imageUrl,
                  type: blobType,
                  imageID: Number(evidence.attributes.image_id)
                };
                this.evidenceMultipleIds.push(evidenceMultipleInfo);
                this.moreFilesAfter.push(file);
                loadImageAtMultipleIndex(index + 5);
              })
            }
            loadImageAtMultipleIndex(0);
          })

        }
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    }
    )
  }
  navigate() {
    this.router.navigate(["/apps/hazard-risk/assigned-tasks"])
    this.backToHistory = true
  }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }


}
