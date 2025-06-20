import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, map, startWith } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { SustainabilityService } from 'src/app/services/sustainability.api.service';
import { CreateUpdateImpactComponent } from '../report/create-update-impact/create-update-impact.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
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
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ModifyComponent implements OnInit {
  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 5,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;
  imglnk: any = environment.client_backend + '/uploads/'
  format: any = ".png"

  files: File[] = [];

  evidenceCount: number = 0
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  imageData: any[] = []
  accidentCategory: any[] = []
  accSubCategories: any[] = []
  accTypes: any[] = []
  bodypart: string[] = [];
  materialityTypes: any[] = []
  materialityIssues: any[] = []
  pillars: any[] = []
  alignmentSdgs: any[] = []
  additionalSdgs: any[] = []
  filteredBodyPart: Observable<string[]>;
  bodyPartCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  divisions: any[] = []
  impactRegister: any[] = []
  impactList: any[] = []
  businessUnitIds: any = ""
  evidenceFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  evidenceData: any
  dropdownValues: any
  TypeList: any[] = []
  IssueList: any[] = []
  PillarList: any[] = []
  sdgs: any[] = []
  Issues: any[] = []
  AllignmentSDGList: any[] = [];
  materialityType = new FormControl(null, [Validators.required]);
  materialityIssue = new FormControl(null, [Validators.required]);
  pillar = new FormControl(null, [Validators.required]);
  additional_sdg = new FormControl(null, [Validators.required]);
  gristandards: any[] = [];
  allGRIStandards: string[] = [];
  filteredgristandard: Observable<string[]>;
  griStandardCtrl = new FormControl('');
  Division = new FormControl('', [Validators.required]);
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
  divisionUuids: any[] = []
  @ViewChild('GRIStandardInput') GRIStandardInput: ElementRef<HTMLInputElement>;
  unitSpecific: any
  corporateUser: any
  userDivision: any
  timeline = new FormGroup({
    start_timeline: new FormControl(null, Validators.required),
    end_timeline: new FormControl(null, Validators.required)
  });
  constructor(
    private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private authService: AuthService,
    private sustainabilityService: SustainabilityService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private _location: Location
  ) {
    this.filteredgristandard = this.griStandardCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) =>
        part ? this._filterGRIStandards(part) : this.getFilteredStandards()
      )
    );
  }
  private getFilteredStandards(): string[] {
    return this.allGRIStandards.filter((code) => !this.gristandards.includes(code));
  }

  ngOnInit(): void {
    this.files = []

    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      reference_number: [''],
      reported_date: [new Date()],
      title: ['', [Validators.required]],
      materialityType: ['', [Validators.required]],
      materialityIssue: ['', [Validators.required]],
      status: [''],
      division: ['', [Validators.required]],
      pillars: ['', [Validators.required]],
      organiser: ['', [Validators.required]],
      volunteers: [null, [Validators.required]],
      assignee: [null],
      gri_standard: [this.gristandards, [Validators.required]],
      alignment_sdg: ['', [Validators.required]],
      additionalSdgs: ['', [Validators.required]],
      sdg: ['', [Validators.required]],
      reporter: [''],
      priority_desc: ['', [Validators.required]],
      contributing_desc: ['', [Validators.required]],
      image: [''],
      impact: [''],
      business_unit: [null],
      end_timeline: ['', [Validators.required]],
      start_timeline: ['', [Validators.required]],
      location: ['', [Validators.required]],
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.sustainability
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
        const status = result.sus_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_dropdown_values()
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisionUuids.push(elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results
            }
          } else {
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

  MaterialityType(event: any) {
    this.Form.controls['materialityType'].setValue(event.value.toString())
    this.materiality_Issue()
  }

  MaterialityIssue(event: any) {
    this.Form.controls['materialityIssue'].setValue(event.value.toString())
  }

  MaterialityPillars(event: any) {
    this.Form.controls['pillars'].setValue(event.value.toString())
  }

  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }
  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  AdditionalSDG(event: any) {
    this.Form.controls['additionalSdgs'].setValue(event.value.toString())
  }

  deleteImpact(data: any) {
    const id = data.id
    this.sustainabilityService.delete_impact(id).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Impact details removed"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.ngOnInit()
      }
    })
  }

  onSelect(event: any) {
    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength < 5 && addedLength < 6) {
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
  // get_division() {
  //   this.generalService.get_division(this.orgID).subscribe({
  //     next: (result: any) => {
  //       this.divisions = result.data
  //     },
  //     error: (errL: any) => { },
  //     complete: () => { }
  //   })
  // }
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
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }
  BusinessUnit(event: any) {

    // const selectedData = this.divisions.find(data => data.division_name === event.value);
    // this.Form.controls['division'].setValue(selectedData)
    // let selectedIds = this.divisions
    //   .filter(data => data.division_name === event.value) // Filter for matching division names
    //   .map(data => data.id);
    // this.Form.controls['business_unit'].setValue(selectedIds.toString())


    const selectedBusinessUnitIds: any[] = [];
    event.value.forEach((element: any) => {
      const selectedData = this.divisions.find(data => data.division_name === element);
      const divisionNames = event.value.map((unit: any) => unit);
      const divisionValue = divisionNames.join(',');
      if (selectedData) {
        this.Form.controls['division'].setValue(divisionValue);
      }
      const ids = this.divisions
        .filter(data => data.division_name === element)
        .map(data => data.id);
      selectedBusinessUnitIds.push(...ids);
    });
    const uniqueIds = Array.from(new Set(selectedBusinessUnitIds));
    this.businessUnitIds = uniqueIds.join(',');
    this.Form.controls['business_unit'].setValue(selectedBusinessUnitIds);

  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  submit() {
    let griStandardValue = this.Form.value.gri_standard;

    if (Array.isArray(griStandardValue)) {
      griStandardValue = griStandardValue.join(',');
    }

    this.Form.patchValue({
      gri_standard: griStandardValue
    });

    this.sustainabilityService.update_activity(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.delete_image();
      }
    });
  }


  delete_image() {
    if (this.imageData.length > 0) {

      this.imageData.forEach((elem: any) => {
        const imageID = elem.attributes.image_id
        this.generalService.delete_image(imageID).subscribe({
          next: (result: any) => {
            this.sustainabilityService.delete_evidence(elem.id).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => { }
            })
          },
          error: (err: any) => { },
          complete: () => {


          }
        })
      })
      this.upload_image()

    } else {
      this.upload_image()
    }
  }

  upload_image() {
    const susID = this.Form.value.id
    if (this.files.length > 0) {

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
                sustainability: susID,
                id: result[0].id,
                url: result[0].url
              })

              this.sustainabilityService.create_evidence(data[0]).subscribe({
                next: (result: any) => { },
                error: (err: any) => { },
                complete: () => { }
              })
            },
            error: (err: any) => { },
            complete: () => { }
          })
        } else {
          const extension = elem.type.split('.').pop().toLowerCase()
          this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
          this.generalService.upload(this.evidenceFormData).subscribe({
            next: (result: any) => {
              let data: any[] = []
              data.push({
                evidence_name: result[0].hash,
                format: extension,
                sustainability: susID,
                id: result[0].id,
                url: result[0].url
              })
              this.sustainabilityService.create_evidence(data[0]).subscribe({
                next: (result: any) => { },
                error: (err: any) => { },
                complete: () => { }
              })
            },
            error: (err: any) => { },
            complete: () => { }
          })
        }
      })
      const statusText = "Sustainability details update"
      this._snackBar.open(statusText, 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      setTimeout(() => {
        this.ngOnInit()
      }, 1000);


    } else {
      const statusText = "Sustainability details update"
      this._snackBar.open(statusText, 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      setTimeout(() => {
        this.ngOnInit()
      }, 1000);

    }
  }



  startDateChange(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['start_timeline'].setValue(newDate)
  }

  endDateChange(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['end_timeline'].setValue(newDate)
  }




  //get dropdown values
  get_dropdown_values() {
    const module = "Sustainability"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        this.materialitytype()
        this.materialityissue()
        this.pillardetails()
        this.sdgdetails()
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_alignment_sdg() {
    this.sustainabilityService.get_alignment_sdg().subscribe({
      next: (result: any) => {
        this.alignmentSdgs = result.data
        this.get_sustainability_details()
      }
    })
  }

  //get materialityIssue
  materialityissue() {
    this.materialityIssues = []
    const materialityissue = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Materiality Issue")
    })
    this.IssueList = materialityissue
  }

  //get materialitytype
  materialitytype() {
    this.materialityTypes = []
    this.materialityIssues = []
    const materialitytype = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Materiality Type")
    })
    this.TypeList = materialitytype
  }

  //get pillar details
  pillardetails() {
    this.PillarList = []
    const pillar = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Pillars")
    })
    this.PillarList = pillar
  }

  //get SDGs
  sdgdetails() {
    this.sdgs = []
    const sdg = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "SDG")
    })
    this.sdgs = sdg
    this.get_alignment_sdg()
  }


  //get sustainability details
  get_sustainability_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.sustainabilityService.get_sustainability_details(this.Form.value.org_id, reference).subscribe({
      next: (result: any) => {
        let matchFound = true;
        const businessUnits = result.data[0].attributes.business_units.data;
        const divisionUuidsFromResponse = businessUnits.map((unit: { attributes: { division_uuid: any; }; }) => unit.attributes.division_uuid);
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => divisionUuidsFromResponse.includes(uuid));
        }

        if ((result.data[0].attributes.status === "Congratulations" || result.data[0].attributes.status === "Completed") || (!matchFound || matchFound !== true)) {
          this.router.navigate(["/apps/sustainability/register"])
        }
        this.Form.controls['sdg'].setValue(result.data[0].attributes.SDG)
        this.SDG()
        this.Form.controls['id'].setValue(result.data[0].id)
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.Form.controls['materialityType'].setValue(result.data[0].attributes.material_type)
        this.Form.controls['materialityIssue'].setValue(result.data[0].attributes.material_issue)
        this.Form.controls['pillars'].setValue(result.data[0].attributes.pillars)
        this.Form.controls['sdg'].setValue(result.data[0].attributes.SDG)
        this.Form.controls['additionalSdgs'].setValue(result.data[0].attributes.additional_SDGs)
        this.Form.controls['alignment_sdg'].setValue(result.data[0].attributes.alignment_SDGs)
        this.Form.controls['title'].setValue(result.data[0].attributes.title)
        this.Form.controls['organiser'].setValue(result.data[0].attributes.organiser)
        this.Form.controls['volunteers'].setValue(result.data[0].attributes.volunteers_num)
        this.Form.controls['status'].setValue(result.data[0].attributes.status)
        this.Form.controls['priority_desc'].setValue(result.data[0].attributes.priority_desc)
        this.Form.controls['contributing_desc'].setValue(result.data[0].attributes.contributing_desc)
        this.Form.controls['location'].setValue(result.data[0].attributes.location)
        this.Form.controls['division'].setValue(result.data[0].attributes.division)

        if (result.data[0].attributes.division) {
          var array = result.data[0].attributes.division.split(',');
          this.Division.setValue(array)
        }

        if (result.data[0].attributes.business_units) {
          const divisionIds = result.data[0].attributes.business_units.data.map((unit: any) => unit.id);
          this.Form.controls['business_unit'].setValue(divisionIds)
        }


        if (result.data[0].attributes.material_type) {
          var array = result.data[0].attributes.material_type.split(',');
          this.materialityType.setValue(array)
          this.materiality_Issue()
        }

        if (result.data[0].attributes.material_issue) {
          var array = result.data[0].attributes.material_issue.split(',');
          this.materialityIssue.setValue(array)
        }

        if (result.data[0].attributes.pillars) {
          var array = result.data[0].attributes.pillars.split(',');
          this.pillar.setValue(array)
        }

        if (result.data[0].attributes.additional_SDGs) {
          var array = result.data[0].attributes.additional_SDGs.split(',');
          this.additional_sdg.setValue(array)
        }

        if (result.data[0].attributes.impacts.data.length > 0) {
          this.impactList = result.data[0].attributes.impacts.data
        } else {
          this.impactList = []
        }

        if (result.data[0].attributes.start_timeline) {
          this.timeline.controls['start_timeline'].setValue(new Date(result.data[0].attributes.start_timeline))
          this.Form.controls['start_timeline'].setValue(result.data[0].attributes.start_timeline)
        }

        if (result.data[0].attributes.end_timeline) {
          this.timeline.controls['end_timeline'].setValue(new Date(result.data[0].attributes.end_timeline))
          this.Form.controls['end_timeline'].setValue(result.data[0].attributes.end_timeline)
        }

        if (result.data[0].attributes.evidences) {

          this.imageData = result.data[0].attributes.evidences.data
          result.data[0].attributes.evidences.data.forEach((evidence: any) => {
            this.generalService.getImage(environment.client_backend + evidence.attributes.url).subscribe((data: any) => {
              this.files.push(data)


            })
          })
        }

        if (result.data[0].attributes.gri_standard) {
          const hazardstatementcode = result.data[0].attributes.gri_standard
          if (hazardstatementcode) {
            const split_string = hazardstatementcode.split(",");
            this.gristandards = split_string
          }
          this.Form.controls['gri_standard'].setValue(result.data[0].attributes.gri_standard)

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  materiality_Issue() {
    const type = this.Form.value.materialityType
    const type2 = type.split(',')
    const data: Array<any> = []
    type2.forEach((element: any) => {
      const transactionData = this.IssueList.filter(function (elem) {
        return (elem.attributes.filter === element)
      })
      transactionData.forEach(elem2 => {
        data.push(elem2)
      })
    })
    this.Issues = data
  }

  createImpact() {
    this.dialog.open(CreateUpdateImpactComponent).afterClosed().subscribe(data => {
      if (data) {
        this.sustainabilityService.create_impact(data, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            const statusText = "Impact details added"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.ngOnInit()
          }
        })
      }
    })
  }

  updateImpact(impacData: any) {
    this.dialog.open(CreateUpdateImpactComponent, { data: impacData }).afterClosed().subscribe(data => {
      if (data) {
        this.sustainabilityService.update_impact(data).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Impact details updated"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.ngOnInit()
          }
        })
      }

    })
  }



  action(data: any) {
    this.Form.controls['status'].setValue(data)
    const formStatus = this.Form.valid
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
          this.mark_completed()
        } else {
          this.Form.controls['status'].setValue('Happening')
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

  mark_completed() {
    this.sustainabilityService.completed(this.Form.value.id).subscribe({
      next: (result: any) => {
        Swal.fire({
          title: 'Activity Completed',
          imageUrl: "assets/images/success.gif",
          imageWidth: 250,
          text: "You have successfully completed an activity.",
          showCancelButton: false,

        })
        this.router.navigate(["/apps/sustainability/register"])
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }
  async SDG() {
    const sdg = this.Form.value.sdg;

    const transactionData = this.alignmentSdgs.filter(function (elem) {
      return elem.attributes?.sdg === sdg;
    });

    this.AllignmentSDGList = transactionData;

    this.gristandards = [];
    this.Form.controls['gri_standard'].reset();
    this.Form.controls['alignment_sdg'].reset();


    await this.get_gri_standards(this.Form.value.sdg);

    this.filteredgristandard = this.griStandardCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) => part ? this._filterGRIStandards(part) : this.getFilteredStandards())
    );
  }

  async get_gri_standards(SDG: string) {
    try {
      const result: any = await this.sustainabilityService.get_gri_standards().toPromise();

      // Clear the existing standards when a new SDG is selected
      this.allGRIStandards = [];

      const SDGArray = SDG.split(',');

      const filteredStandards = result.data.filter((item: any) => {
        const dropdownValuesArray = item.attributes.dropdown_values?.data;

        const matchFound = Array.isArray(dropdownValuesArray) &&
          dropdownValuesArray.some((valueObj: any) => {
            const value = valueObj?.attributes?.Value;

            if (value && SDGArray.includes(value)) {
              return true;
            }

            return false;
          });

        return matchFound;
      });

      const GRIStandards = filteredStandards.map((item: any) =>
        item.attributes.gri_standard
      );

      this.ngZone.run(() => {
        this.allGRIStandards = this.allGRIStandards.concat(GRIStandards);
      });

    } catch (err) {
      this.router.navigate(["/error/internal"]);
    }
  }

  removeGriStandard(code: string): void {
    const index = this.gristandards.indexOf(code);

    if (index >= 0) {
      this.gristandards.splice(index, 1);
      this.Form.get('gri_standard')?.setValue(this.gristandards);

      this.filteredgristandard = this.griStandardCtrl.valueChanges.pipe(
        startWith(null),
        map((part: string | null) => part ? this._filterGRIStandards(part) : this.getFilteredStandards())
      );
    }
  }


  private _filterGRIStandards(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.getFilteredStandards().filter((code) =>
      code.toLowerCase().includes(filterValue)
    );
  }
  addGRIStandard(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.gristandards.push(value);
    }
    event.chipInput!.clear();
    this.griStandardCtrl.setValue(null);
  }
  selectedStatementCode(event: MatAutocompleteSelectedEvent): void {
    const selectedCode = event.option.value;
    this.gristandards.push(selectedCode);
    this.Form.controls['gri_standard'].setValue(this.gristandards.toString());
    this.GRIStandardInput.nativeElement.value = '';
    this.griStandardCtrl.setValue(null);

    this.filteredgristandard = this.griStandardCtrl.valueChanges.pipe(
      startWith(null),
      map((code: string | null) => code ? this._filterGRIStandards(code) : this.getFilteredStandards())
    );
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
