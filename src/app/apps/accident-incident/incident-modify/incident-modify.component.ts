import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { IncidentService } from 'src/app/services/incident.api.service';
import { environment } from 'src/environments/environment';
import { ModifyIncidentPersonComponent } from './add-modify-affected-person/add-modify-affected-person.component';
import { ModifyIncidentWitnessComponent } from './add-witness/add-witness.component';
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
  selector: 'app-incident-modify',
  templateUrl: './incident-modify.component.html',
  styleUrls: ['./incident-modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class IncidentModifyComponent implements OnInit {

  Form: FormGroup
  incidentdate = new FormControl(new Date(), [Validators.required]);
  incidenttime = new FormControl(null, [Validators.required]);
  orgID: any
  divisions: any[] = []
  divisionUuids: any[] = []
  dropdownValues: any[] = []
  circumstances: any[] = []
  peopleList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  files: File[] = [];
  witnessList: any[] = []
  affectedPeopleList: any[] = []
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 2
  status: string
  evidenceFormData = new FormData()
  saveFlag: boolean = true
  saveLoadFlag: boolean = false
  evidenceData: any[] = []
  evidenceImageCount: number = 0
  evidenceCount: number = 0
  fileCount: number = 0
  Division = new FormControl(null, [Validators.required]);
  unitSpecific: any
  userDivision: any
  corporateUser: any
  TypesOfNearMisses: any[] = []
  TypesOfConcerns: any[] = []
  factors: any[] = []
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
      witness: ['', [Validators.required]],
      type_of_near_miss: [''],
      type_of_concern: [''],
      factors: [''],
      causes: [''],
      business_unit: [null],
      affected_people: [''],
      reporterName: [''],
      reporterDesignation: [''],
      group_notification: [null]
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
        this.Form.controls['createdUser'].setValue(result.id)
        const status = result.acc_inc_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_dropdown_values()
          this.get_incident_details()
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_profiles()
              this.get_divisions()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
                this.divisionUuids.push(elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_assignee()

            }
          } else {
            this.get_profiles()
            this.get_divisions()
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_profiles() {
    this.authService.get_hse_head_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked === false && profile.attributes.user?.data?.attributes?.acc_inc_action === true);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    });
  }

  get_unit_specific_assignee() {
    this.incidentService.get_unit_specific_assignee(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }

  get_dropdown_values() {
    const module = "Accident and Incident"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        const bodyPart = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Circumstances")
        })
        this.circumstances = bodyPart.sort((a: any, b: any) => {
          return a.attributes.Value.localeCompare(b.attributes.Value);
        });
        const typesOfNearMiss = result.data
          .filter(function (elem: any) {
            return elem.attributes.Category === "Type of Near Miss";
          })
          .sort(function (a: any, b: any) {
            return a.attributes.Value.localeCompare(b.attributes.Value);
          });
        this.TypesOfNearMisses = typesOfNearMiss;

        const typesOfConcern = result.data
          .filter(function (elem: any) {
            return elem.attributes.Category === "Type of Concern";
          })
          .sort(function (a: any, b: any) {
            return a.attributes.Value.localeCompare(b.attributes.Value);
          });
        this.TypesOfConcerns = typesOfConcern;

        const factors = result.data
          .filter(function (elem: any) {
            return elem.attributes.Category === "Factors";
          })
          .sort(function (a: any, b: any) {
            return a.attributes.Value.localeCompare(b.attributes.Value);
          });
        this.factors = factors;

      },
      error: (err: any) => { },
      complete: () => { }
    })
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
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_incident_details() {
    this.files = []
    const reference = this.route.snapshot.paramMap.get('id');
    this.incidentService.get_incident_reference(reference, this.Form.value.org_id).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (result.data[0].attributes.status === "Draft" && (matchFound || matchFound !== false)) {
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
          this.Form.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
          this.Form.controls['incident_date'].setValue(result.data[0].attributes.incident_date)
          this.Form.controls['incident_time'].setValue(result.data[0].attributes.incident_time)
          this.Form.controls['division'].setValue(result.data[0].attributes.division)
          this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
          this.Division.setValue(result.data[0].attributes.division)
          this.Form.controls['createdUser'].setValue(result.data[0].attributes.createdUser.data.id)
          this.Form.controls['location'].setValue(result.data[0].attributes.location)
          this.Form.controls['severity'].setValue(result.data[0].attributes.severity)
          this.Form.controls['causes'].setValue(result.data[0].attributes.causes)
          this.Form.controls['factors'].setValue(result.data[0].attributes.factors)
          this.Form.controls['type_of_concern'].setValue(result.data[0].attributes.type_of_concern)
          this.Form.controls['type_of_near_miss'].setValue(result.data[0].attributes.type_of_near_miss)
          this.Form.controls['circumstances'].setValue(result.data[0].attributes.circumstances)
          this.Form.controls['status'].setValue(result.data[0].attributes.status)
          this.Form.controls['resolution'].setValue(result.data[0].attributes.resolution)
          this.Form.controls['assignee_notification'].setValue(result.data[0].attributes.assignee_notification)
          this.Form.controls['assignee'].setValue(result.data[0].attributes?.assignee?.data?.id)
          this.Form.controls['description'].setValue(result.data[0].attributes.description)
          this.Form.controls['evidence'].setValue(result.data[0].attributes.evidence)
          this.Form.controls['witness'].setValue(result.data[0].attributes.witness)
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
          if (this.witnessList.length > 0) {
            this.Form.controls['witness'].setErrors(null);
          } else {
            this.Form.controls['witness'].reset();
          }
          if (this.affectedPeopleList.length === 0 || !this.affectedPeopleList) {
            this.Form.controls['affected_people'].reset()
          } else if (this.affectedPeopleList.length > 0) {
            this.Form.controls['affected_people'].setErrors(null);
          }
          this.affectedPeopleList = result.data[0].attributes.individuals.data
          this.evidenceData = result.data[0].attributes.evidences.data
          result.data[0].attributes.evidences.data.forEach((evidence: any) => {
            this.incidentService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
              this.files.push(data)
            })
          })
        } else {
          this.router.navigate(["/apps/accident-incident/incident-register"])
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }
  BusinessUnit(event: any) {
    const selectedData = this.divisions.find(data => data.division_name === event.value);
    this.Form.controls['division'].setValue(selectedData.division_name)
    this.Form.controls['business_unit'].setValue(selectedData.id)
  }
  addWitness() {
    this.dialog.open(ModifyIncidentWitnessComponent).afterClosed().subscribe(data => {
      if (data) {
        this.incidentService.create_witness(data, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            const statusText = "Witness details added"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_witness_details()
          }
        })
      }
    })
  }

  modifyWitness(witnessData: any) {
    this.dialog.open(ModifyIncidentWitnessComponent, {
      data: witnessData
    }).afterClosed().subscribe((data) => {
      if (data) {
        const statusText = "Witness details updated"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.get_witness_details()
      }
    })

  }

  deleteWitness(data: any) {
    this.incidentService.delete_witness(data.id).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "Witness details deleted"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.get_witness_details()
      }
    })
  }

  get_witness_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.incidentService.get_incident_witness(this.Form.value.id).subscribe({
      next: (result: any) => {
        this.witnessList = []
        this.witnessList = result.data
        if (this.witnessList.length === 0 || !this.witnessList) {
          this.Form.controls['witness'].reset()
        } else if (this.witnessList.length > 0) {
          this.Form.controls['witness'].setErrors(null);
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  onSelect(event: any) {
    if (!this.files.length) {
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
          this.Form.controls['evidence'].setErrors(null)
          this.files.push(...event.addedFiles);
        } else {
          const statusText = "Please choose images ('jpg', 'jpeg', 'png')"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }

    } else if (this.files.length > 0 && this.files.length <= 4) {
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
    } else if (this.files.length === 0) {
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
    } else if (this.files.length > 0 && this.files.length >= 5) {
      const statusText = "You have exceed the upload limit"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }

  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length === 0) {
      this.Form.controls['evidence'].reset()
    }
  }

  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  addPeople() {
    this.dialog.open(ModifyIncidentPersonComponent).afterClosed().subscribe(data => {
      if (data) {
        this.incidentService.create_accident_individual(data, this.Form.value.id).subscribe({
          next: (result: any) => {
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            const statusText = "People details added"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_peoples()
          }
        })
      }
    })
  }

  modifyPeopleDetails(personData: any) {
    this.dialog.open(ModifyIncidentPersonComponent, {
      data: personData
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.incidentService.update_accident_individual(data).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            const statusText = "People details updated"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_peoples()
          }
        })
      }
    })
  }

  deletePeople(data: any) {
    this.incidentService.delete_accident_individual(data.id).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "People details deleted"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.get_peoples()
      }
    })
  }

  get_peoples() {
    this.incidentService.get_accident_individual(this.Form.value.id).subscribe({
      next: (result: any) => {
        this.affectedPeopleList = []
        this.affectedPeopleList = result.data
        if (this.affectedPeopleList.length === 0 || !this.affectedPeopleList) {
          this.Form.controls['affected_people'].reset()
        } else if (this.affectedPeopleList.length > 0) {
          this.Form.controls['affected_people'].setErrors(null);
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  saveAsDraft() {
    this.saveFlag = false
    this.saveLoadFlag = true
    this.deleteImage()
  }

  deleteImage() {
    const evidenceLength = this.evidenceData.length
    if (evidenceLength > 0) {
      this.evidenceData.forEach(elem => {
        this.generalService.delete_image(elem.attributes.image_id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const count = this.evidenceImageCount
            this.evidenceImageCount = Number(count) + 1
            if (evidenceLength === this.evidenceImageCount) {
              this.deleteEvidence()
            }
          }
        })
      })
    } else {
      this.uploadImages()
    }
  }

  deleteEvidence() {
    const evidenceLength = this.evidenceData.length
    this.evidenceData.forEach(elem => {
      this.incidentService.delete_accident_evidence(elem.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const count = this.evidenceCount
          this.evidenceCount = Number(count) + 1
          if (evidenceLength === this.evidenceCount) {
            this.uploadImages()
          }
        }
      })
    })
  }

  uploadImages() {
    const fileLength = this.files.length
    if (fileLength > 0) {
      this.files.forEach((elem: any) => {
        this.evidenceFormData.delete('files')
        if (elem.name) {
          const extension = elem.name.split('.').pop().toLowerCase()
          this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
          this.generalService.upload(this.evidenceFormData).subscribe({
            next: (result: any) => {
              let data: any[] = []
              data.push({
                evidence_name: result[0].hash,
                format: extension,
                accident: this.Form.value.id,
                id: result[0].id
              })
              this.incidentService.create_accident_evidence(data[0]).subscribe({
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
          const extension = elem.type.split('/').pop().toLowerCase()
          this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
          this.generalService.upload(this.evidenceFormData).subscribe({
            next: (result: any) => {
              let data: any[] = []
              data.push({
                evidence_name: result[0].hash,
                format: extension,
                accident: this.Form.value.id,
                id: result[0].id
              })
              this.incidentService.create_accident_evidence(data[0]).subscribe({
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
        }
      })
    } else {
      this.update()
    }

  }

  update() {
    this.incidentService.update_accident(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        if (this.Form.value.status === "Draft") {
          const statusText = "Incident details updated"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.saveFlag = true
          this.saveLoadFlag = false
          this.get_incident_details()
        } else if (this.Form.value.status === "Open") {
          Swal.fire({
            title: 'Incident Reported',
            imageUrl: "assets/images/reported.gif",
            imageWidth: 250,
            text: "You have successfully reported an Accident. We will notify the department head to take further action.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/accident-incident/incident-register"])
          })
        }
      }
    })
  }

  submit() {
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
        this.Form.controls['status'].setValue('Open')
        this.Form.controls['assignee_notification'].setValue(false)
        this.Form.controls['group_notification'].setValue(false)
        this.saveAsDraft()
      }
    })
  }

  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  //set incident date
  incidentDate(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['incident_date'].setValue(selectedDate)
  }

  //set incident time
  incidentTimeValue(data: any) {
    // this.Form.controls['incident_time'].setValue(new Date(data))
    // this.Form.controls['incident_time'].setValue(moment(new Date(data)).format("HH:mm:ss.SSS"))
    this.Form.controls['incident_time'].setValue(new Date(data))

  }

  //severity
  severity(data: any) {
    this.Form.controls['severity'].setValue(data.value)
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
