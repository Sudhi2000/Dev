import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { IncidentService } from 'src/app/services/incident.api.service';
import { environment } from 'src/environments/environment';
import { AddIncidentPersonComponent } from './add-modify-affected-person/add-modify-affected-person.component';
import { AddIncidentWitnessComponent } from './add-witness/add-witness.component';
import Swal from 'sweetalert2'
import moment from 'moment';

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
  selector: 'app-create-incident',
  templateUrl: './create-incident.component.html',
  styleUrls: ['./create-incident.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateIncidentComponent implements OnInit {

  Form: FormGroup
  incidentdate = new FormControl(new Date(), [Validators.required]);
  incidenttime = new FormControl(null, [Validators.required]);
  orgID: any
  divisions: any[] = []
  dropdownValues: any[] = []
  circumstances: any[] = []
  TypesOfNearMisses: any[] = []
  TypesOfConcerns: any[] = []
  factors: any[] = []
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
  Division = new FormControl(null, [Validators.required]);
  unitSpecific: any
  userDivision: any
  corporateUser: any
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
    private incidentService: IncidentService) { }

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
      type_of_near_miss: [''],
      type_of_concern: [''],
      factors: [''],
      causes: [''],
      status: ['Draft', [Validators.required]],
      resolution: ['Open', [Validators.required]],
      assignee_notification: [null],
      assignee: [null, [Validators.required]],
      description: ['', [Validators.required]],
      evidence: [''],
      business_unit: [null],
      witness: ['', [Validators.required]],
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
        this.Form.controls['reporterName'].setValue(result.profile.first_name + ' ' + result.profile.last_name)
        this.Form.controls['reporterDesignation'].setValue(result.profile.designation)
        const status = result.acc_inc_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {

          this.get_dropdown_values()
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

  incidentDate(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['incident_date'].setValue(selectedDate)
  }

  incidentTimeValue(data: any) {
    this.Form.controls['incident_time'].setValue(new Date(data))
  }

  severity(data: any) {
    this.Form.controls['severity'].setValue(data.value)
  }
  BusinessUnit(event: any) {
    this.Form.controls['division'].setValue(event.value.division_name)
    this.Form.controls['business_unit'].setValue(event.value.id)
  }
  onSelect(event: any) {
    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    // if (fileLength === 0 && addedLength < 6) {
    //   const size = event.addedFiles[0].size / 1024 / 1024
    //   if (size > 20) {
    //     const statusText = "Please choose an image below 20 MB"
    //     this._snackBar.open(statusText, 'Close Warning', {
    //       horizontalPosition: this.horizontalPosition,
    //       verticalPosition: this.verticalPosition,
    //     });
    //   } else {
    //     var fileTypes = ['jpg', 'jpeg', 'png'];
    //     var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
    //       isSuccess = fileTypes.indexOf(extension) > -1;
    //     if (isSuccess) {
    //       this.files.push(...event.addedFiles);
    //     } else {
    //       const statusText = "Please choose images ('jpg', 'jpeg', 'png')"
    //       this._snackBar.open(statusText, 'Close Warning', {
    //         horizontalPosition: this.horizontalPosition,
    //         verticalPosition: this.verticalPosition,
    //       });
    //     }
    //   }
    // } else if (fileLength < 6) {
    //   const statusText = "You have exceed the upload limit"
    //   this._snackBar.open(statusText, 'Close Warning', {
    //     horizontalPosition: this.horizontalPosition,
    //     verticalPosition: this.verticalPosition,
    //   });
    // }

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
  }

  addWitness() {
    this.dialog.open(AddIncidentWitnessComponent).afterClosed().subscribe(data => {
      if (data) {
        this.witnessList.push(data)
        if (this.witnessList.length > 0) {
          this.Form.controls['witness'].setErrors(null);
        } else {
          this.Form.controls['witness'].setValidators(Validators.required);
        }
      }
    })
  }

  deleteWitness(data: any) {
    this.witnessList.splice(this.witnessList.findIndex((existingCustomer) => existingCustomer.id === data.id), 1);
    if (this.witnessList.length === 0 || !this.witnessList) {
      this.Form.controls['witness'].reset()
    } else if (this.witnessList.length > 0) {
      this.Form.controls['witness'].setErrors(null);
    }
  }

  modifyWitness(witnessData: any) {
    this.dialog.open(AddIncidentWitnessComponent, {
      data: witnessData
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.witnessList.splice(this.witnessList.findIndex((existingCustomer) => existingCustomer.id === data.id), 1);
        this.witnessList.push(data)
      }
    })
  }

  addPeople() {
    this.dialog.open(AddIncidentPersonComponent).afterClosed().subscribe(data => {
      if (data) {
        this.affectedPeopleList.push(data)
        if (this.affectedPeopleList.length > 0) {
          this.Form.controls['affected_people'].setErrors(null);
        } else {
          this.Form.controls['affected_people'].setValidators(Validators.required);
        }
      }
    })
  }

  modifyPeopleDetails(personData: any) {
    this.dialog.open(AddIncidentPersonComponent, {
      data: personData
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.affectedPeopleList.splice(this.affectedPeopleList.findIndex((existingCustomer) => existingCustomer.id === data.id), 1);
        this.affectedPeopleList.push(data)
      }
    })
  }

  deletePeople(data: any) {
    this.affectedPeopleList.splice(this.affectedPeopleList.findIndex((existingCustomer) => existingCustomer.id === data.id), 1);
    if (this.affectedPeopleList.length === 0 || !this.affectedPeopleList) {
      this.Form.controls['affected_people'].reset()
    }
  }

  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }

    const warning = !this.Form.controls['witness'].valid
    const statusText = "Witness is required"

    warning && this._snackBar.open(statusText, 'Close Warning', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
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

  submit(data: any) {
    this.status = data
    if (this.status === "submit") {
      this.Form.controls['status'].setValue('Open')
      this.Form.controls['resolution'].setValue('Open')
      this.Form.controls['assignee_notification'].setValue(false)
      this.Form.controls['group_notification'].setValue(false)
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
          this.create_reference_number()
        }
      })
    } else if (this.status === "save") {
      this.Form.controls['status'].setValue('Draft')
      this.Form.controls['assignee_notification'].setValue(null)
      this.Form.controls['group_notification'].setValue(null)
      this.showProgressPopup();
      this.create_reference_number()
    }
  }

  create_reference_number() {
    this.incidentService.get_incident().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = 'NMI-' + newCount
        this.Form.controls['reference_number'].setValue(reference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_accident()
      }
    })
  }

  create_accident() {
    this.incidentService.create_incident(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_witness()
      }
    })
  }

  create_witness() {
    if (this.witnessList.length > 0) {
      this.witnessList.forEach(elem => {
        this.incidentService.create_witness(elem, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {

          }
        })
      })
      this.addAffetectedPeople()
    } else {
      this.addAffetectedPeople()
    }
  }

  addAffetectedPeople() {
    if (this.affectedPeopleList.length > 0) {
      this.affectedPeopleList.forEach(elem => {
        this.incidentService.create_accident_individual(elem, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })
      })
      this.create_activity()
      this.upload_evidence()
    } else {
      this.create_activity()
      this.upload_evidence()
    }
  }

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
            accident: this.Form.value.id,
            id: result[0].id
          })
          this.incidentService.create_accident_evidence(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => { }
          })
        },
        error: (err: any) => { },
        complete: () => {
          Swal.close()
        }
      })
    })
  }

  create_activity() {
    const action = "Reported an Incident"
    const refernceNumber = this.Form.value.reference_number
    const user = this.Form.value.createdUser
    this.generalService.create_activity_stream(action, refernceNumber, user).subscribe({
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
      module: "Accident & Incident",
      action: 'Reported a new Incident:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.assignee,
      access_link: "/apps/accident-incident/incident-register",
      profile: this.Form.value.createdUser
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        if (this.status === "submit") {
          Swal.fire({
            title: 'Incident Reported',
            imageUrl: "assets/images/confirm.gif",
            imageWidth: 250,
            text: "You have successfully reported an Incident. We will notify the department head to take further action.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/accident-incident/incident-register"])
          })
        } else if (this.status === "save") {
          const statusText = "Incident details saved"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.router.navigate(["/apps/accident-incident/incident-modify/" + this.Form.value.reference_number])
        }
        Swal.close()
      }
    })
  }

}
