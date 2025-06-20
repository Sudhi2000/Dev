import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { ehsCategory } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { NewObservationComponent } from '../new-observation/new-observation.component';

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
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateComponent implements OnInit {
  addMoreEvidence: boolean = false
  files: File[] = [];
  moreFiles: File[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: string
  Form: FormGroup
  categories: any[]
  subcategories: any[] = []
  observationData: any[] = []
  observations: any[] = []
  divisions: any[] = []
  duedate = new FormControl(null, [Validators.required]);
  minDate = new Date();
  peopleList: any[] = [];
  evidenceID: number
  evidenceFormData = new FormData()
  evidenceFormDataMultiple = new FormData()
  dropDownValue: any[] = []
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

  constructor(private hazardService: HazardService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private _snackBar: MatSnackBar,
    private httpClient: HttpClient,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      reported_date: [new Date()],
      reference_number: [''],
      category: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
      level: ['', [Validators.required]],
      unsafe: ['', [Validators.required]],
      reporter: [null, [Validators.required]],
      reporterName: ['', [Validators.required]],
      reporterDesignation: [''],
      assignee_notification: [null],
      observation: [''],
      division: ['', [Validators.required]],
      location_department: ['', [Validators.required]],
      sub_location: [''],
      assignee: [null, [Validators.required]],
      due_date: [null, [Validators.required]],
      description: [''],
      org_id: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
      moreEvidence: [''],
      evidence_id: [''],
      evidence_name: [''],
      evidence_type: [''],
      business_unit: [null],
      status: ['Draft', [Validators.required]],
      resolution: [''],
      responsible_name: [''],
      subCategoryID: [''],
      add_more_evidence: [false]
    });
  }

  isFormValid() {
    return this.Form.get('category')?.valid &&
      this.Form.get('sub_category')?.valid &&
      this.Form.get('division')?.valid;
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.hazard_risk
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
        const status = result.ehs_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.Form.controls['reporterName'].setValue(result.profile.first_name + ' ' + result.profile.last_name)
          this.Form.controls['reporterDesignation'].setValue(result.profile.designation)
          this.get_dropdown_values()
          this.get_observations()

          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions()
              this.get_profiles()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_hazard_approvers()
            }
          } else {
            this.get_profiles()
            this.get_divisions();
          }
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
        this.dropDownValue = result.data
        const category = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Category")
        })
        this.categories = category
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_observations() {
    this.hazardService.get_observations().subscribe({
      next: (result: any) => {
        this.observationData = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  //get sub category
  subCategory(data: any) {
    this.subcategories = []
    const subCategory = this.dropDownValue.filter(function (elem) {
      return (elem.attributes.Category === "Sub Category" && elem.attributes.filter === data.value)
    })
    this.subcategories = subCategory
  }

  sub_category(data: any) {
    this.Form.controls['subCategoryID'].setValue(data.id)
  }

  //get observation
  observation(data: any) {
    this.Form.controls['observation'].reset()
    this.observations = []
    const observation = this.observationData.filter(function (elem) {
      return (elem.attributes.dropdown_value?.data?.attributes?.Value === data.value)
    })
    this.observations = observation
  }

  //get divisions
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

  //get user profiles

  get_profiles() {
    this.hazardService.get_hazard_approvers(this.orgID).subscribe({
      next: (result: any) => {
        // const filteredData = result.data.filter((person: any) => person.attributes.user?.data?.attributes?.blocked===false);
        // this.peopleList = filteredData;
        this.peopleList = result.data;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    });
  }
  get_unit_specific_hazard_approvers() {
    this.hazardService.get_unit_specific_hazard_approvers(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
  //set risk level & calculate due date
  riskLevel(data: any) {
    this.Form.controls['level'].setValue(data.value)
    if (data.value === "High") {
      const sysdate = new Date()
      const date = sysdate.setDate(sysdate.getDate() + 10)
      this.duedate.setValue(new Date(date))
      this.Form.controls['due_date'].setValue(new Date(date))
    } else if (data.value == "Medium") {
      const sysdate = new Date()
      const date = sysdate.setDate(sysdate.getDate() + 20)
      this.duedate.setValue(new Date(date))
      this.Form.controls['due_date'].setValue(new Date(date))
    } else if (data.value == "Low") {
      const sysdate = new Date()
      const date = sysdate.setDate(sysdate.getDate() + 30)
      this.duedate.setValue(new Date(date))
      this.Form.controls['due_date'].setValue(new Date(date))
    }
  }
  BusinessUnit(event: any) {
    this.Form.controls['division'].setValue(event.value.division_name)
    this.Form.controls['business_unit'].setValue(event.value.id)
  }
  //change due date
  dueDate(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['due_date'].setValue(selecteddate)
  }

  //confirm to creat the transaction
  submit(data: any) {
    if (data === 'Save') {
      this.Form.controls['status'].setValue('Draft')
      this.showProgressPopup();
      this.create_reference_number()
    } else if (data === 'Submit') {
      this.Form.controls['status'].setValue('Open')
      this.Form.controls['resolution'].setValue('Open')
      this.Form.controls['assignee_notification'].setValue(false)

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

  create_reference_number() {
    this.hazardService.get_hazards(this.orgID).subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const newReference = 'EHS-' + newCount
        this.Form.controls['reference_number'].setValue(newReference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_ehs()
      }
    })
  }

  create_ehs() {
    this.hazardService.create_ehs(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.upload_evidence()
      }
    })
  }

  upload_evidence() {
    if (this.files.length > 0) {
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
              hazard: this.Form.value.id,
              id: result[0].id
            })
            this.hazardService.create_ehs_evidence(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                this.createMultipleEvidence()

              }
            })
          },
          error: (err: any) => { },
          complete: () => {
          }
        })
      })
    } else {
      Swal.close()
      this.router.navigate(["/apps/hazard-risk/modify/" + this.Form.value.reference_number])
    }

  }

  createMultipleEvidence() {
    if (this.moreFiles.length > 0) {
      let count = 0
      let totalFile = this.moreFiles.length
      this.moreFiles.forEach((evidence: any) => {
        const extension = evidence.name.split('.').pop().toLowerCase()
        this.evidenceFormDataMultiple.append('files', evidence, this.Form.value.reference_number + '.' + extension)
      })

      this.generalService.upload(this.evidenceFormDataMultiple).subscribe({
        next: (result: any) => {
          result.forEach((elem: any) => {
            let data: any[] = []
            const extension = elem.name.split('.').pop().toLowerCase()
            data.push({
              evidence_name: elem.hash,
              format: extension,
              hazard: this.Form.value.id,
              id: elem.id
            })

            this.hazardService.create_ehs_multiple_evidence(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                count++
                if (totalFile === count) {
                  if (this.Form.value.status === 'Open') {
                    this.create_notification()
                  } else {
                    Swal.close()
                    this.router.navigate(["/apps/hazard-risk/modify/" + this.Form.value.reference_number])
                  }
                }
              }
            })
          })

        },
        error: (err: any) => { },
        complete: () => {
        }
      })
    } else {
      if (this.Form.value.status === 'Open') {
        this.create_notification()
      } else {
        Swal.close()
        this.router.navigate(["/apps/hazard-risk/modify/" + this.Form.value.reference_number])
      }
    }
  }


  responsible(data: any) {
    this.Form.controls['responsible_name'].setValue(data.attributes.first_name + ' ' + data.attributes.last_name)
  }

  create_notification() {
    let data: any[] = []
    data.push({
      module: "Hazard/Risk Management",
      action: 'Reported a new Hazard/Risk:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.assignee,
      access_link: "/apps/hazard-risk/action/",
      profile: this.Form.value.reporter
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        //Swal.close();
        Swal.fire({
          title: 'Hazard / Risk Reported',
          imageUrl: "assets/images/reported.gif",
          imageWidth: 250,
          text: "You have successfully reported a Hazard / Risk. We will notify the assignee to take appropriate action. If it is required to modify the data, you can modify until the assignee start the process.",
          showCancelButton: false,

        })
        this.router.navigate(["/apps/hazard-risk/history"])
      }
    })
  }


  onSelect(event: any) {

    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 2) {
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
          this.Form.controls['evidence'].setErrors(null)
          this.files.push(...event.addedFiles);
          this.addMoreEvidence = true
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

  onSelectMoreEvidence(event: any) {

    const fileLength = this.moreFiles.length
    const addedLength = event.addedFiles.length
    console.log(fileLength)
    console.log(addedLength)

    event.addedFiles.forEach((elem: any) => {
      console.log(elem)

      if (fileLength < 5 && addedLength < 6) {
        console.log('single')
        const size = elem.size / 1024 / 1024
        if (size > 10) {
          const statusText = "Please choose an image below 10 MB"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          var fileTypes = ['jpg', 'jpeg', 'png'];
          var extension = elem.name.split('.').pop().toLowerCase(),
            isSuccess = fileTypes.indexOf(extension) > -1;
          if (isSuccess) {
            this.Form.controls['moreEvidence'].setErrors(null)
            this.moreFiles.push(elem);

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

    })








  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length === 0) {
      this.Form.controls['evidence'].reset()
    }
  }

  onRemoveMoreEvidence(event: any) {

    this.moreFiles.splice(this.moreFiles.indexOf(event), 1);
    if (this.moreFiles.length === 0) {
      this.Form.controls['moreEvidence'].reset()
    }

  }

  new_observation() {
    if (this.Form.value.subCategoryID) {

      this.dialog.open(NewObservationComponent, { data: this.Form.value.subCategoryID, width: '50%' }).afterClosed().subscribe((data: any) => {
        const sub_category = this.Form.value.sub_category
        this.hazardService.get_observations().subscribe({
          next: (result: any) => {
            this.observationData = result.data
            this.observations = []
            const observation = this.observationData.filter(function (elem) {
              return (elem.attributes.dropdown_value.data.attributes.Value === sub_category)
            })
            this.observations = observation
          },
          error: (err: any) => { },
          complete: () => { }
        })

      })

    } else {

      const statusText = "Please choose a sub category"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

    }
    // this.dialog.open(NewObservationComponent,{width:'50%'}).afterClosed().subscribe((data: any) => {
    //   this.generalService.get_employees().subscribe({
    //     next: (result: any) => {
    //     },
    //     error: (err: any) => { },
    //     complete: () => {


    //     }
    //   })

    // })

  }

}
