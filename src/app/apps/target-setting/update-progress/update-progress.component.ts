import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TargetSettingService } from 'src/app/services/target-setting.service';
import Swal from 'sweetalert2'
import { Lightbox } from 'ngx-lightbox';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdateProgressComponent } from './create-update-progress/create-update-progress.component';
import { Location } from '@angular/common';
import { ViewSourceComponent } from '../create-target-setting/view-source/view-source.component';
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
  selector: 'app-update-progress',
  templateUrl: './update-progress.component.html',
  styleUrls: ['./update-progress.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class UpdateProgressComponent implements OnInit {

  Form: FormGroup
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 3
  divisions: any[] = []
  orgID: string
  categories: any[] = []
  dropdownValues: any[] = []
  sources: any[] = []
  possibilityCategory: any[] = []
  possibilitySubCat: any[] = []
  files: File[] = [];
  sourceList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  peopleList: any[] = []
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  currency: string
  evidenceFormData = new FormData()
  evidences: any[] = []
  tergatedProgress: any[] = []
  unitSpecific: any
  divisionUuids: any[] = []
  corporateUser: any
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

  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router, private authService: AuthService,
    private _snackBar: MatSnackBar,
    private targetService: TargetSettingService,
    private route: ActivatedRoute,
    private _lightbox: Lightbox,
    public dialog: MatDialog, private _location: Location) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      reference_number: [''],
      reported_date: [new Date(), [Validators.required]],
      org_id: ['', [Validators.required]],
      division: ['', [Validators.required]],
      reporter: ['', [Validators.required]],
      department: ['', [Validators.required]],
      category: ['', [Validators.required]],
      source: ['', [Validators.required]],
      findings: ['', [Validators.required]],
      baseline_consumption: ['', [Validators.required]],
      action: ['', [Validators.required]],
      possibility_category: ['', [Validators.required]],
      possibility_subcategory: ['', [Validators.required]],
      evidence: [null],
      responsible: [null, [Validators.required]],
      expected_saving: ['', [Validators.required]],
      cost_saving: ['', [Validators.required]],
      expected_GHG_emission: ['', [Validators.required]],
      target_reduction: ['', [Validators.required]],
      implementation_cost: ['', [Validators.required]],
      payback_period: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      project_lifespan: ['', [Validators.required]],
      approver: ['', [Validators.required]],
      baseline_Unit: [''],
      target_energy_consumption: [''],
      status: [''],
      responsible_name: [''],
      approver_name: [''],
      responsible_designation: [''],
      approver_designation: [''],
      createdby_name: [''],
      createdby_designation: [''],
      evidence_after_id: [''],
      complete_notification: [null]
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.target_setting
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
        this.Form.controls['reporter'].setValue(result.id)
        const status = result.trs_action
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
          this.get_divisions()
          this.get_dropdown_values()
          this.get_profiles()
          this.get_target_setting_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }

  get_target_setting_details() {

    const reference = this.route.snapshot.paramMap.get('id');
    this.targetService.get_target_setting_details(reference).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        const status = result.data[0].attributes.status
        if ((status === "Approved") && (matchFound || matchFound !== false)) {
          Swal.fire({
            title: 'Approved Target',
            imageUrl: "assets/images/confirm.gif",
            imageWidth: 250,
            text: "In order to provide the progress details. You have to change the status from 'Approved' to 'In-Progress'. ",
            showCancelButton: false,
          })
        } else if ((status === "Completed") || (!matchFound || matchFound !== true)) {
          this.router.navigate(["/apps/target-setting/assigned-tasks"])
        }
        this.tergatedProgress = result.data[0].attributes.target_progresses.data
        this.Form.controls['id'].setValue(result.data[0].id)
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.Form.controls['reported_date'].setValue(result.data[0].attributes.transaction_date)
        this.Form.controls['division'].setValue(result.data[0].attributes.division)
        this.Form.controls['reporter'].setValue(result.data[0].attributes.created_By.data.id)
        this.Form.controls['department'].setValue(result.data[0].attributes.department)
        this.Form.controls['category'].setValue(result.data[0].attributes.category)
        this.Form.controls['source'].setValue(result.data[0].attributes.source)
        this.category()
        this.Form.controls['findings'].setValue(result.data[0].attributes.findings)
        this.Form.controls['baseline_consumption'].setValue(result.data[0].attributes.baseline_consumption)
        this.Form.controls['action'].setValue(result.data[0].attributes.improvement_action)
        this.Form.controls['possibility_category'].setValue(result.data[0].attributes.improvement_possibility)
        this.possibility_category()
        this.Form.controls['possibility_subcategory'].setValue(result.data[0].attributes.improvement_possibility_sub_category)
        this.Form.controls['createdby_name'].setValue(result.data[0].attributes.created_By.data.attributes.first_name + ' ' + result.data[0].attributes.created_By.data.attributes.last_name)
        this.Form.controls['createdby_designation'].setValue(result.data[0].attributes.created_By.data.attributes.designation)
        this.Form.controls['responsible'].setValue(result.data[0].attributes.responsible.data.id)
        this.Form.controls['responsible_name'].setValue(result.data[0].attributes.responsible.data.attributes.first_name + ' ' + result.data[0].attributes.responsible.data.attributes.last_name)
        this.Form.controls['responsible_designation'].setValue(result.data[0].attributes.responsible.data.attributes.designation)
        this.Form.controls['expected_saving'].setValue(result.data[0].attributes.expected_saving)
        this.Form.controls['cost_saving'].setValue(result.data[0].attributes.cost_saving)
        this.Form.controls['expected_GHG_emission'].setValue(result.data[0].attributes.expected_ghg_emission_reduction)
        this.Form.controls['target_reduction'].setValue(result.data[0].attributes.target_reduction)
        this.Form.controls['implementation_cost'].setValue(result.data[0].attributes.implemention_cost)
        this.Form.controls['payback_period'].setValue(result.data[0].attributes.pay_back_period)
        this.Form.controls['start'].setValue(result.data[0].attributes.implemention_start)
        this.Form.controls['end'].setValue(result.data[0].attributes.implementation_end)
        this.dateRange.controls['start'].setValue(new Date(result.data[0].attributes.implemention_start))
        this.dateRange.controls['end'].setValue(new Date(result.data[0].attributes.implementation_end))
        this.Form.controls['project_lifespan'].setValue(result.data[0].attributes.project_lifespan)
        this.Form.controls['approver'].setValue(result.data[0].attributes.approver.data.id)
        this.Form.controls['approver_name'].setValue(result.data[0].attributes.approver.data.attributes.first_name + ' ' + result.data[0].attributes.approver.data.attributes.last_name)
        this.Form.controls['approver_designation'].setValue(result.data[0].attributes.approver.data.attributes.designation)
        this.Form.controls['baseline_Unit'].setValue(result.data[0].attributes.baseline_unit)
        this.Form.controls['target_energy_consumption'].setValue(result.data[0].attributes.target_energy_consumption)
        this.Form.controls['status'].setValue(result.data[0].attributes.status)
        this.sourceList = result.data[0].attributes.target_setting_sources?.data

        if (result.data[0].attributes.evidences.data !== null) {
          let eviData: any[] = []
          eviData.push({
            src: environment.client_backend + '/uploads/' + result.data[0].attributes.evidences.data[0].attributes.evidence_name + '.' + result.data[0].attributes.evidences.data[0].attributes.format,
            caption: "Evidence",
            thumb: environment.client_backend + '/uploads/' + result.data[0].attributes.evidences.data[0].attributes.evidence_name + '.' + result.data[0].attributes.evidences.data[0].attributes.format
          })
          this.evidences = eviData
        }

        const evidence_after_data = result.data[0].attributes.evidences.data.filter(function (data: any) {
          return (data.attributes.evidence_after === true)
        })

        if (evidence_after_data.length > 0) {
          this.Form.controls['evidence_after_id'].setValue(evidence_after_data[0].id)

          evidence_after_data.forEach((evidence: any) => {
            this.generalService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
              this.files.push(data)
            })

          })
        }

        this.Form.controls['target_reduction'].disable()
        this.Form.controls['payback_period'].disable()
        this.Form.controls['responsible'].disable()
        this.Form.disable()
        this.dateRange.disable()

      },
      error: (err: any) => { },
      complete: () => { }
    })


  }

  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        this.divisions = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  //get dropdown values
  get_dropdown_values() {
    const module = "Target Setting"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        const category = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Category")
        })
        this.categories = category

        const possibility = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Improvement Possibility")
        })
        this.possibilityCategory = possibility
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  category() {
    const category = this.Form.value.category
    const source = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Source" && elem.attributes.filter === category)
    })
    this.sources = source
    this.source()
  }

  source() {
    const value = this.Form.value.source
    const source = this.sources.filter(function (elem: any) {
      return (elem.attributes.Category === "Source" && elem.attributes.Value === value)
    })
    this.Form.controls['baseline_Unit'].setValue(source[0]?.attributes.unit)
  }

  possibility_category() {
    const category = this.Form.value.possibility_category
    const subCategory = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Improvement Possibility Sub" && elem.attributes.filter === category)
    })
    this.possibilitySubCat = subCategory
  }

  //upload evidence
  upload_evidence() {
    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = []
          data.push({
            evidence_name: result[0].hash,
            format: extension,
            target: this.Form.value.id,
            id: result[0].id
          })
          this.targetService.create_evidence(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => { }
          })
        },
        error: (err: any) => { },
        complete: () => {

          Swal.fire({
            title: 'Target Created',
            imageUrl: "assets/images/confirm.gif",
            imageWidth: 250,
            text: "You have successfully created a goal. We will notify the approver to take further action.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/target-setting/history"])
          })
        }
      })
    })
  }

  create_target_setting() {
    this.targetService.create_target_setting(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
      },
      error: (err: any) => { },
      complete: () => {
        this.upload_evidence()
      }
    })
  }

  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  open(index: number): void {
    this._lightbox.open(this.evidences, index);
  }

  onSelect(event: any) {
    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 6) {
      const size = event.addedFiles[0].size / 1024 / 1024
      if (size > 2) {
        const statusText = "Please choose an image below 2 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['jpg', 'jpeg', 'png'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.Form.controls['evidence'].setErrors(null)
          this.files.push(...event.addedFiles);
          this.upload_evidence_after()
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
    }

  }
  upload_evidence_after() {
    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = []
          data.push({
            evidence_name: result[0].hash,
            format: extension,
            target: this.Form.value.id,
            id: result[0].id
          })
          this.targetService.create_evidence_after(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => { }
          })
        },
        error: (err: any) => { },
        complete: () => {
          const statusText = "Evidence updated"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.files = []
          this.get_target_setting_details()
        }
      })
    })
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length > 0) {
    } else {
      this.delete_evidence_after()
    }
  }

  delete_evidence_after() {
    const evidenceAfterID = this.Form.value.evidence_after_id
    this.targetService.delete_evidence_after(evidenceAfterID).subscribe({
      next: (result: any) => {
        this.generalService.delete_image(result.data.attributes.image_id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Evidence deleted"
            this._snackBar.open(statusText, 'Close Warning', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_target_setting_details()
          }
        })
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  //get profiles
  get_profiles() {
    this.authService.get_hse_head_profiles(this.orgID).subscribe({
      next: (result: any) => {
        this.peopleList = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
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

  calcPayBackPeriod() {
    const costOfImplementation = this.Form.value.implementation_cost
    const costSaving = this.Form.value.cost_saving

    if (costOfImplementation && costSaving) {
      const payBackPeriod = (Number(costOfImplementation) / Number(costSaving)).toFixed(2)
      this.Form.controls['payback_period'].setValue(payBackPeriod)
      this.Form.controls['payback_period'].disable()
    }
  }

  calcTargetReduction() {
    const baselineConsu = this.Form.value.baseline_consumption
    const expectedSaving = this.Form.value.expected_saving
    if (baselineConsu && expectedSaving) {
      const targetReduction = (Number(expectedSaving) / Number(baselineConsu)).toFixed(2)
      const tergetedEnergyNextYear = (Number(baselineConsu) - Number(expectedSaving))
      this.Form.controls['target_reduction'].setValue(targetReduction)
      this.Form.controls['target_reduction'].disable()
      this.Form.controls['target_energy_consumption'].setValue(tergetedEnergyNextYear)
      this.Form.controls['target_energy_consumption'].disable()
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
  updateStatus(data: any) {
    this.showProgressPopup()
    this.Form.controls['status'].setValue(data)
    if (this.Form.value.status == 'Completed') {
      this.Form.controls['complete_notification'].setValue(false)
    }
    this.update_target()
  }

  update_target() {
    const status = this.Form.value.status
    this.targetService.update_target(this.Form.value).subscribe({
      next: (result: any) => {
        const status = result.data.attributes.status
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Target Updated',
          imageUrl: "assets/images/confirm.gif",
          imageWidth: 250,
          text: "You have successfully updated a target. We will notify the responsible person to take further action.",
          showCancelButton: false,
        }).then((result) => {
          if (status == 'Completed') {
            this.create_notification()
          }
          this.router.navigate(["/apps/target-setting/assigned-tasks"])

        })
      }
    })
  }

  create_notification() {
    let data: any[] = []
    data.push({
      module: "Target Setting",
      action: 'Target Setting Completed:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.approver,
      access_link: "/apps/target-setting/action/",
      profile: this.Form.value.reporter
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Target Setting Completed',
          imageUrl: "assets/images/confirm.gif",
          imageWidth: 250,
          text: "You have successfully completed the goal. We will notify the approver that the target has been completed.",
          showCancelButton: false,
        }).then((result) => {
          this.router.navigate(["/apps/target-setting/history"])
        })
      }
    })
  }

  create_progress() {
    const targetID = this.Form.value.id
    this.targetService.get_target_progress_targetID(targetID).subscribe({
      next: (result: any) => {
        const totalSavings = result.data.reduce((acc: any, cur: any) => acc + Number(cur.attributes.actual_savings), 0)
        const basline = this.Form.value.baseline_consumption
        if (totalSavings >= basline) {
          const statusText = "Target already achieved"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          if (result.data.length > 0) {
            const totalSavings = result.data.reduce((acc: any, cur: any) => acc + Number(cur.attributes.actual_savings), 0)
            let targetData: any[] = []
            targetData.push({
              id: this.Form.value.id,
              reference_number: this.Form.value.reference_number,
              baseline_consumption: this.Form.value.baseline_consumption,
              consumption: totalSavings
            })
            this.dialog.open(CreateUpdateProgressComponent, { data: targetData }).afterClosed().subscribe((data: any) => {
              if (data) {
                this.targetService.create_target_progress(this.Form.value.id, data).subscribe({
                  next: (result: any) => { },
                  error: (err: any) => { },
                  complete: () => {
                    this.get_target_setting_details()
                  }
                })
              }
            })
          } else {
            let targetData: any[] = []
            targetData.push({
              id: this.Form.value.id,
              reference_number: this.Form.value.reference_number,
              baseline_consumption: this.Form.value.baseline_consumption,
              consumption: 0
            })
            this.dialog.open(CreateUpdateProgressComponent, { data: targetData }).afterClosed().subscribe((data: any) => {
              if (data) {
                this.targetService.create_target_progress(this.Form.value.id, data).subscribe({
                  next: (result: any) => { },
                  error: (err: any) => { },
                  complete: () => {
                    this.get_target_setting_details()

                  }
                })
              }
            })
          }
        }
      },
      error: (err: any) => { },
      complete: () => { }
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
  viewSource(data: any) {

    this.dialog.open(ViewSourceComponent, {
      data: data
    }).afterClosed().subscribe((customer) => {
    });
  }

}
