import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Lightbox } from 'ngx-lightbox';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from 'src/app/services/general.api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { IncidentService } from 'src/app/services/incident.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
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
  selector: 'app-incident-action',
  templateUrl: './incident-action.component.html',
  styleUrls: ['./incident-action.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class IncidentActionComponent implements OnInit {

  Form: FormGroup
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 2
  witnessList: any[] = []
  evidences: any[] = []
  affectedPeopleList: any[] = []
  incidentdate = new FormControl(new Date(), [Validators.required]);
  incidenttime = new FormControl(null, [Validators.required]);
  orgID: any
  files: File[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  evidenceFormData = new FormData()
  fileCount: number = 0
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

  constructor(private _lightbox: Lightbox,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private incidentService: IncidentService,
    private route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      reference_number: [''],
      reported_date: [new Date(), [Validators.required]],
      incident_date: [new Date(), [Validators.required]],
      incident_time: [null, [Validators.required]],
      division: ['', [Validators.required]],
      createdUser: ['', [Validators.required]],
      location: ['', [Validators.required]],
      severity: ['', [Validators.required]],
      circumstances: ['', [Validators.required]],
      status: ['Draft', [Validators.required]],
      resolution: ['Open', [Validators.required]],
      assignee_notification: [null],
      assignee: [null, [Validators.required]],
      description: ['', [Validators.required]],
      evidence: [''],
      witness: [''],
      type_of_near_miss: [''],
      type_of_concern: [''],
      factors: [''],
      causes: [''],
      affected_people: [''],
      reporterName: [''],
      reporterDesignation: [''],
      group_notification: [null],
      TreatmentPostIncident: ['', [Validators.required]],
      PostAnalysisIncident: ['', [Validators.required]],
      severityImpact: ['', [Validators.required]],
      updatedUser: [''],
      evidence_id: ['']
    })
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident
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
        this.Form.controls['updatedUser'].setValue(result.id)
        const status = result.acc_inc_action
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
          this.get_incident_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_incident_details() {
    // this.files = []
    const reference = this.route.snapshot.paramMap.get('id');
    this.incidentService.get_incident_reference(reference, this.Form.value.org_id).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (result.data[0].attributes.status === "Open" && (matchFound || matchFound !== false)) {
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
          this.Form.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
          this.Form.controls['incident_date'].setValue(result.data[0].attributes.incident_date)
          this.Form.controls['incident_time'].setValue(result.data[0].attributes.incident_time)
          this.Form.controls['division'].setValue(result.data[0].attributes.division)
          this.Form.controls['createdUser'].setValue(result.data[0].attributes.createdUser.data.id)
          this.Form.controls['location'].setValue(result.data[0].attributes.location)
          this.Form.controls['severity'].setValue(result.data[0].attributes.severity)
          this.Form.controls['circumstances'].setValue(result.data[0].attributes.circumstances)
          this.Form.controls['status'].setValue(result.data[0].attributes.status)
          this.Form.controls['resolution'].setValue(result.data[0].attributes.resolution)
          this.Form.controls['assignee_notification'].setValue(result.data[0].attributes.assignee_notification)
          this.Form.controls['description'].setValue(result.data[0].attributes.description)
          this.Form.controls['evidence'].setValue(result.data[0].attributes.evidence)
          this.Form.controls['evidence_id'].setValue(result.data[0].attributes?.evidences?.data[0]?.id)
          this.Form.controls['witness'].setValue(result.data[0].attributes.witness)
          this.Form.controls['causes'].setValue(result.data[0].attributes.causes)
          this.Form.controls['factors'].setValue(result.data[0].attributes.factors)
          this.Form.controls['type_of_concern'].setValue(result.data[0].attributes.type_of_concern)
          this.Form.controls['type_of_near_miss'].setValue(result.data[0].attributes.type_of_near_miss)
          this.Form.controls['affected_people'].setValue(result.data[0].attributes.affected_people)
          this.Form.controls['reporterName'].setValue(result.data[0].attributes?.createdUser?.data?.attributes.first_name + ' ' + result.data[0].attributes?.createdUser?.data?.attributes.last_name)
          this.Form.controls['reporterDesignation'].setValue(result.data[0].attributes?.createdUser?.data?.attributes.designation)
          if (result.data[0].attributes.incident_date) {
            this.incidentdate.setValue(new Date(result.data[0].attributes.incident_date))
          }
          if (result.data[0].attributes.incident_time) {
            this.incidenttime.setValue(new Date(result.data[0].attributes.incident_time))
          }
          this.witnessList = result.data[0].attributes.witnesses.data
          this.affectedPeopleList = result.data[0].attributes.individuals.data
          let eviData: any[] = []
          result.data[0].attributes.evidences.data.forEach((elem: any) => {
            eviData.push({
              src: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format,
              caption: "Evidence",
              thumb: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format
            })
          })
          this.evidences = eviData

        } else {
          this.router.navigate(["/apps/accident-incident/incident-assigned"])
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.Form.disable()
        this.incidentdate.disable()
        this.incidenttime.disable()
        this.Form.controls['TreatmentPostIncident'].enable()
        this.Form.controls['PostAnalysisIncident'].enable()
        this.Form.controls['severityImpact'].enable()
        this.Form.controls['reference_number'].enable()
        this.Form.controls['status'].enable()
        this.Form.controls['reported_date'].enable()
        this.Form.controls['reporterName'].enable()
        this.Form.controls['reporterDesignation'].enable()
        this.Form.controls['id'].enable()
      }
    })

  }

  open(index: number): void {
    this._lightbox.open(this.evidences, index);
  }

  onSelect(event: any) {
    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 6) {
      const size = event.addedFiles[0].size / 1024 / 1024
      if (size > 20) {
        const statusText = "Please choose an image below 20 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['jpg', 'jpeg', 'png'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {

          this.files.push(...event.addedFiles);
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

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
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
    const fileLength = this.files.length
    if (fileLength > 0) {
      this.files.forEach((elem: any) => {
        this.evidenceFormData.delete('files')
        if (elem.name) {
          const extension = elem.name.split('.').pop().toLowerCase()
          this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
          this.generalService.upload(this.evidenceFormData).subscribe({
            next: (result: any) => {
              this.Form.enable()
              let data: any[] = []
              data.push({
                id: this.Form.value.evidence_id,
                evidence_name: result[0].hash,
                format: extension,
                img_id: result[0].id,
              })
              this.Form.disable()
              this.incidentService.update_incident_evidence(data[0]).subscribe({
                next: (result: any) => { },
                error: (err: any) => { },
                complete: () => {
                  const count = this.fileCount
                  this.fileCount = Number(count) + 1
                  if (fileLength === this.fileCount) {
                    this.update()
                  }
                }
              })
            },
            error: (err: any) => { },
            complete: () => { }
          })
        } else {
          this.update()
        }
      })

    } else {
      this.update()
    }
  }

  update() {
    this.incidentService.complete_incident(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        Swal.fire({
          title: 'Completed',
          imageUrl: "assets/images/confirm.gif",
          imageWidth: 250,
          text: "You have successfully closed the reported incident.",
          showCancelButton: false,
        }).then((result) => {
          this.router.navigate(["/apps/accident-incident/incident-assigned"])
        })
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
