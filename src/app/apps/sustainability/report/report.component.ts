import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { SustainabilityService } from 'src/app/services/sustainability.api.service';
import { CreateUpdateImpactComponent } from './create-update-impact/create-update-impact.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ReportComponent implements OnInit {

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 5,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;
  Division = new FormControl(null, [Validators.required]);
  businessUnitIds: any
  files: File[] = [];
  imglnk: any = environment.client_backend + '/uploads/'
  format: any = ".png"
  evidenceCount: number = 0
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
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
  additional_sdg = new FormControl(null);
  gristandards: any[] = [];
  allGRIStandards: string[] = [];
  filteredgristandard: Observable<string[]>;
  griStandardCtrl = new FormControl('', [Validators.required]);
  unitSpecific: any
  corporateUser: any
  userDivision: any
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
  @ViewChild('GRIStandardInput') GRIStandardInput: ElementRef<HTMLInputElement>;

  timeline = new FormGroup({
    start_timeline: new FormControl(null, Validators.required),
    end_timeline: new FormControl(null, Validators.required)
  });
  constructor(private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private ngZone: NgZone,
    private sustainabilityService: SustainabilityService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {
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
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      division: ['', [Validators.required]],
      reference_number: [''],
      reported_date: [new Date()],
      title: ['', [Validators.required]],
      materialityType: ['', [Validators.required]],
      materialityIssue: ['', [Validators.required]],
      status: ['Happening'],
      pillar: ['', [Validators.required]],
      organiser: [null, [Validators.required]],
      volunteers: ['', [Validators.required]],
      assignee: [null],
      alignment_sdg: ['', [Validators.required]],
      additional_sdg: [''],
      sdg: ['', [Validators.required]],
      reporter: [''],
      gri_standard: [this.gristandards, [Validators.required]],
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
          this.get_alignment_sdg()
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
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

  //get materialitytype
  materialitytype() {
    this.materialityTypes = []
    const materialitytype = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Materiality Type")
    })
    this.TypeList = materialitytype
  }

  MaterialityType(event: any) {
    this.Form.controls['materialityType'].setValue(event.value.toString())
    this.materiality_Issue()
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
    const divisionNames = event.value.map((unit: any) => unit.division_name);
    this.businessUnitIds = event.value.map((unit: any) => unit.id);
    const divisionValue = divisionNames.join(',');
    this.Form.controls['division'].setValue(divisionValue);
    this.Form.controls['business_unit'].setValue(this.businessUnitIds);
  }
  //get materialityIssue
  materialityissue() {
    this.materialityIssues = []
    const materialityissue = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Materiality Issue")
    })
    this.IssueList = materialityissue
  }

  MaterialityIssue(event: any) {
    this.Form.controls['materialityIssue'].setValue(event.value.toString())
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
    this.sdgs = [];
    const sdg = this.dropdownValues.filter(function (elem: any) {
      return elem.attributes.Category === "SDG";
    });
    sdg.sort(function (a: { attributes: { sdg_number: number; }; }, b: { attributes: { sdg_number: number; }; }) {
      return a.attributes.sdg_number - b.attributes.sdg_number;
    });
    this.sdgs = sdg;
  }


  MaterialityPillars(event: any) {
    this.Form.controls['pillar'].setValue(event.value.toString())
  }

  AdditionalSDG(event: any) {
    this.Form.controls['additional_sdg'].setValue(event.value.toString())
  }

  get_alignment_sdg() {
    this.sustainabilityService.get_alignment_sdg().subscribe({
      next: (result: any) => {
        this.alignmentSdgs = result.data
      }
    })
  }

  async SDG(event: any) {
    const sdg = this.Form.value.sdg;

    const transactionData = this.alignmentSdgs.filter(function (elem) {
      return elem.attributes?.sdg === sdg;
    });

    this.AllignmentSDGList = transactionData;

    this.gristandards = [];
    this.Form.controls['gri_standard'].reset();

    if (!event.value || event.value.length === 0) {
      return;
    }

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

  //store witness details 
  createImpact() {
    this.dialog.open(CreateUpdateImpactComponent).afterClosed().subscribe(data => {
      if (data) {
        this.impactList.push(data)
        if (this.impactList.length > 0) {
          this.Form.controls['impact'].setErrors(null);
        } else {
          this.Form.controls['impact'].setValidators(Validators.required);
        }
      }
    })
  }

  //delete witness
  deleteImpact(data: any) {
    this.impactList.splice(this.impactList.findIndex((existingCustomer) => existingCustomer.id === data.id), 1);
  }

  //image
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

  //remove image
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);

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

  //confirm to create the transaction
  submit() {
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
          this.create_reference_number()
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



  //create reference
  create_reference_number() {
    this.sustainabilityService.get_sustainability_register_count().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = 'SUS-' + newCount
        this.Form.controls['reference_number'].setValue(reference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.report_activity()
      }
    })
  }

  //create accident
  report_activity() {
    this.sustainabilityService.report_activity(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.upload_image()
      }
    })
  }

  upload_image() {
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
              sustainability: this.Form.value.id,
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
      })
      this.create_impact()
    } else {
      this.create_impact()
    }
  }

  //create impact
  create_impact() {
    if (this.impactList.length > 0) {
      this.impactList.forEach(elem => {
        this.sustainabilityService.create_impact(elem, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            Swal.fire({
              title: 'Activity Created',
              imageUrl: "assets/images/success.gif",
              imageWidth: 250,
              text: "You have successfully created a activity. We will notify the assignee to take appropriate action. If it is required to modify the data, you can modify until the assignee start the process.",
              showCancelButton: false,

            })
            this.router.navigate(["/apps/sustainability/register"])
          }
        })
      })
    } else {
      Swal.fire({
        title: 'Activity Created',
        imageUrl: "assets/images/success.gif",
        imageWidth: 250,
        text: "You have successfully created a activity. If it is required to modify the data, you can modify until it has marked as completed.",
        showCancelButton: false,
      })
      this.router.navigate(["/apps/sustainability/register"])
    }
  }

  action(data: any) {
    this.Form.controls['status'].setValue(data)
  }


}
