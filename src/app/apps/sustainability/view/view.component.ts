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
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, map, startWith } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { SustainabilityService } from 'src/app/services/sustainability.api.service';
import { CreateUpdateImpactComponent } from '../report/create-update-impact/create-update-impact.component';
import { Lightbox } from 'ngx-lightbox';
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
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewComponent implements OnInit {

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
  evidenceAfter: any[] = []

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
  accidentdate = new FormControl(null, [Validators.required]);
  accidenttime = new FormControl(null, [Validators.required]);
  peopleList: any[] = []
  affectedPeopleList: accident_people[] = []
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
  Division = new FormControl(null, [Validators.required]);
  additional_sdg = new FormControl(null, [Validators.required]);
  gristandards: any[] = [];
  allGRIStandards: string[] = [];
  filteredgristandard: Observable<string[]>;
  griStandardCtrl = new FormControl('');
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
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
  backToHistory: Boolean = false
  timeline = new FormGroup({
    start_timeline: new FormControl(),
    end_timeline: new FormControl()
  });
  constructor(private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sustainabilityService: SustainabilityService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private _lightbox: Lightbox,
    private _location: Location) {
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
      pillars: ['', [Validators.required]],
      division: ['', [Validators.required]],
      organiser: ['', [Validators.required]],
      volunteers: ['', [Validators.required]],
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
        const status = result.sus_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
                this.divisionUuids.push(elem.division_uuid)
              })
            }
          }
          this.get_sustainability_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
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
        if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/sustainability/register"])
        }
        {
          this.Form.controls['sdg'].setValue(result.data[0].attributes.SDG)
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
          this.Form.controls['materialityType'].setValue(result.data[0].attributes.material_type)
          this.Form.controls['materialityIssue'].setValue(result.data[0].attributes.material_issue)
          this.Form.controls['pillars'].setValue(result.data[0].attributes.pillars)
          this.Form.controls['division'].setValue(result.data[0].attributes.division)
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

          if (result.data[0].attributes.division) {
            var array = result.data[0].attributes.division.split(',');
            this.Division.setValue(array)
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

          if (result.data[0].attributes.gri_standard) {
            const hazardstatementcode = result.data[0].attributes.gri_standard
            if (hazardstatementcode) {
              const split_string = hazardstatementcode.split(",");
              this.gristandards = split_string
            }
          }
          if (result.data[0].attributes.evidences) {
            let eviDataAfter: any[] = []
            result.data[0].attributes.evidences.data.forEach((evidence: any) => {
              eviDataAfter.push({
                src: environment.client_backend + evidence.attributes.url,
                caption: "Evidence",
                thumb: environment.client_backend + evidence.attributes.url
              })
            })

            this.evidenceAfter = eviDataAfter
          }
          this.Form.disable()
          this.timeline.disable()
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

  openEvidenceAfter(index: number): void {
    this._lightbox.open(this.evidenceAfter, index);
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
  private _filterGRIStandards(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.getFilteredStandards().filter((code) =>
      code.toLowerCase().includes(filterValue)
    );
  }
  addGRIStandard() { }

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
