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
import { Location } from '@angular/common';
import { ViewSourceComponent } from '../create-target-setting/view-source/view-source.component';
import { MatDialog } from '@angular/material/dialog';

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
  selector: 'app-view-target',
  templateUrl: './view-target.component.html',
  styleUrls: ['./view-target.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewTargetComponent implements OnInit {

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
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  peopleList: any[] = []
  sourceList: any[] = []
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  currency: string
  evidenceFormData = new FormData()
  evidences: any[] = []
  evidencesAfter: any[] = []
  tergatedProgress: any[] = []
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
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
  backToHistory: Boolean = false
  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    public dialog: MatDialog,
    private router: Router, private authService: AuthService,
    private _snackBar: MatSnackBar,
    private targetService: TargetSettingService,
    private route: ActivatedRoute,
    private _lightbox: Lightbox, private _location: Location) { }

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
      createdby_designation: ['']
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.target_setting
        this.currency = result.data.attributes.currency
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
        this.Form.controls['reporter'].setValue(result.id)
        const status = result.trs_history
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
        if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/target-setting/history"])
        }
        else {
          this.tergatedProgress = result.data[0].attributes.target_progresses.data
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
          this.Form.controls['reported_date'].setValue(result.data[0].attributes.transaction_date)
          this.Form.controls['division'].setValue(result.data[0].attributes.division)
          this.Form.controls['reporter'].setValue(result.data[0].attributes.created_By.data.id)
          this.Form.controls['department'].setValue(result.data[0].attributes.department)
          this.Form.controls['category'].setValue(result.data[0].attributes.category)
          this.Form.controls['source'].setValue(result.data[0].attributes.source)
          this.Form.controls['findings'].setValue(result.data[0].attributes.findings)
          this.Form.controls['baseline_consumption'].setValue(result.data[0].attributes.baseline_consumption)
          this.Form.controls['action'].setValue(result.data[0].attributes.improvement_action)
          this.Form.controls['possibility_category'].setValue(result.data[0].attributes.improvement_possibility)
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
            let eviDataAfter: any[] = []
            eviData.push({
              src: environment.client_backend + '/uploads/' + result.data[0].attributes.evidences.data[0].attributes.evidence_name + '.' + result.data[0].attributes.evidences.data[0].attributes.format,
              caption: "Evidence",
              thumb: environment.client_backend + '/uploads/' + result.data[0].attributes.evidences.data[0].attributes.evidence_name + '.' + result.data[0].attributes.evidences.data[0].attributes.format
            })
            this.evidences = eviData
            const evidence_after_data = result.data[0].attributes.evidences.data.filter(function (data: any) {
              return (data.attributes.evidence_after === true)
            })

            if (evidence_after_data.length > 0) {
              eviDataAfter.push({
                src: environment.client_backend + '/uploads/' + evidence_after_data[0].attributes.evidence_name + '.' + evidence_after_data[0].attributes.format,
                caption: "Evidence After",
                thumb: environment.client_backend + '/uploads/' + evidence_after_data[0].attributes.evidence_name + '.' + evidence_after_data[0].attributes.format
              })
              this.evidencesAfter = eviDataAfter
            }

          }
          this.Form.controls['target_reduction'].disable()
          this.Form.controls['payback_period'].disable()
          this.Form.controls['responsible'].disable()
          this.Form.disable()
          this.dateRange.disable()
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  submit() {
    this.router.navigate(["/apps/target-setting/history"])
  }

  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  open(index: number): void {
    this._lightbox.open(this.evidences, index);
  }

  openAfter(index: number): void {
    this._lightbox.open(this.evidencesAfter, index);
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
