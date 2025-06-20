import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { accident_people } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { StatementComponent } from './statement/statement.component';
import { Lightbox } from 'ngx-lightbox';
import { ViewEvidenceComponent } from '../accident-action/view-evidence/view-evidence.component';
import { ViewActionTakenComponent } from '../accident-action/view-action-taken/view-action-taken.component';
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
  selector: 'app-accident-view',
  templateUrl: './accident-view.component.html',
  styleUrls: ['./accident-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AccidentViewComponent implements OnInit {

  expenses: any[] = []
  evidences: any = []
  expenseTotal: any
  currency: any
  startInves: boolean = false
  completionStatus: boolean = false
  GOVRepdate = new FormControl(null);
  ESIRepdate = new FormControl(null);
  overview: any[] = []
  bodyPartCtrl = new FormControl('');
  primarybodyPartCtrl = new FormControl('');
  secondarybodyPartCtrl = new FormControl('');
  tertiarybodyPartCtrl = new FormControl('');
  rootCause: any[] = []
  bodypart: string[] = [];
  primarybodypart: string[] = [];
  secondarybodypart: string[] = [];
  tertiarybodypart: string[] = [];
  accident_overview: any[] = []
  damages: any[] = []
  damageCtrl = new FormControl('');
  actions: any[] = []
  diseases: any[] = []
  diseaseCtrl = new FormControl('');
  environments: any[] = []
  environmentCtrl = new FormControl('');
  memberList: any[] = []
  Form: FormGroup
  AccidentForm: FormGroup
  overviewForm: FormGroup
  trainingForm: FormGroup
  statementForm: FormGroup
  correctiveForm: FormGroup
  accidentdate = new FormControl(null, [Validators.required]);
  accidenttime = new FormControl(null, [Validators.required]);
  witnessList: any[] = []
  peopleList: any[] = []
  separatorKeysCodes: number[] = [ENTER, COMMA];
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

  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private accidentService: AccidentService,
    public dialog: MatDialog, private _snackBar: MatSnackBar,
    private currencyPipe: CurrencyPipe,
    private _lightbox: Lightbox, private _location: Location) {
  }

  open(index: number): void {
    this._lightbox.open(this.evidences, index);
  }

  close(): void {
    this._lightbox.close();
  }

  ngOnInit() {
    const uuid = uuidv4()
    const uuid2 = uuid.slice(0, 8)
    const reference = this.route.snapshot.paramMap.get('id');
    if (reference) {
      this.peopleList = []
      this.configuration()
    } else {
      this.router.navigate(["/apps/accident-incident/accident-assigned"])
    }
    this.Form = this.formBuilder.group({
      id: ['', [Validators.required]],
      org_id: ['', [Validators.required]],
      reference_number: ['', [Validators.required]],
      reported_date: ['', [Validators.required]],
      division: ['', [Validators.required]],
      location: ['', [Validators.required]],
      department: ['', [Validators.required]],
      severity: ['', [Validators.required]],
      injury: ['', [Validators.required]],
      supervisor: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
      userId: [''],
      reporter: ['', [Validators.required]],
      reporter_designation: ['', [Validators.required]],
      status: ['', [Validators.required]],
      reporterID: [''],
      assignee: ['']
    });

    this.AccidentForm = this.formBuilder.group({
      investigation: ['', [Validators.required]],
      investigationTemp: [''],
      people: ['', [Validators.required]],
      category: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
      accident_type: ['', [Validators.required]],
      affected_body_part: [this.bodypart, [Validators.required]],
      primary_body_part: [this.primarybodypart, [Validators.required]],
      secondary_body_part: [this.secondarybodypart, [Validators.required]],
      tertiary_body_part: [this.tertiarybodypart],
      injury_type: ['', [Validators.required]],
      injury_cause: ['', [Validators.required]],
      hospital: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      time_of_work: ['', [Validators.required]],
      return_of_work: ['', [Validators.required]],
      body_part: [''],
      work_performed: [''],
      description: [''],
      action_taken: [''],
      gov_reported_date: [''],
      esi_reported_date: [''],
      root_cause: ['']
    })

    this.overviewForm = this.formBuilder.group({
      atmospere_condition: [],
      lighting_condition: [],
      work_surface_condition: [''],
      housekeeping_condition: [''],
      damage: [''],
      environments: [''],
      diseases: ['']
    })

    this.trainingForm = this.formBuilder.group({
      training: [''],
      lesson: [''],
    })

    this.statementForm = this.formBuilder.group({
      evidence_type: [''],
      evidence: [''],
      evidence_name: [''],
      evidence_id: ['']
    })

    this.correctiveForm = this.formBuilder.group({
      reference_number: [''],
      userId: ['']
    })
  }
  addprimary() { }
  addtertiary() { }
  addsecondary() { }

  filterEvents(category: any) {
    return category.attributes?.category === "Events"
  }

  filterProcedure(category: any) {
    return category.attributes?.category === "Procedure"
  }

  filterUnsafeActs(category: any) {
    return category.attributes?.category === "Unsafe Acts"
  }

  filterUnsafeConditions(category: any) {
    return category.attributes?.category === "Unsafe Conditions"
  }

  filterPersonalFactors(category: any) {
    return category.attributes?.category === "Personnel Factor"
  }

  filterJobFactors(category: any) {
    return category.attributes?.category === "Job Factor"
  }

  costSymbol(data: any) {
    const amount = this.currencyPipe.transform(data.attributes.amount, this.currency);
    return amount
  }

  costSymbolTotal(data: any) {
    const totalAmount = this.currencyPipe.transform(data, this.currency);
    return totalAmount
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident
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
        const status = result.acc_inc_register
        this.Form.controls['userId'].setValue(result.id)
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
          this.get_accident()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_accident() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.accidentService.get_accident_reference(reference, this.Form.value.org_id).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/accident-incident/accident-register"])
        }
        this.Form.controls['id'].setValue(result.data[0].id)
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.Form.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
        this.Form.controls['division'].setValue(result.data[0].attributes.division)
        this.Form.controls['location'].setValue(result.data[0].attributes.location)
        this.Form.controls['department'].setValue(result.data[0].attributes.department)
        this.Form.controls['severity'].setValue(result.data[0].attributes.severity)
        this.Form.controls['injury'].setValue(result.data[0].attributes.injury)

        if (result.data[0]?.attributes?.assignee?.data) {
          this.Form.controls['assignee'].setValue(result.data[0].attributes.assignee.data.id)
        }
        this.Form.controls['supervisor'].setValue(result.data[0].attributes.supervisor_name)
        this.accidentdate.setValue(new Date(result.data[0].attributes.accident_date))
        this.accidenttime.setValue(new Date(result.data[0].attributes.accident_time))
        this.Form.controls['evidence'].setValue(environment.client_backend + '/uploads/' + result.data[0].attributes.evidence_name)
        this.Form.controls['reporterID'].setValue(result.data[0].attributes.reporter.data.id)
        this.Form.controls['reporter'].setValue(result.data[0].attributes.reporter.data.attributes.first_name + ' ' + result.data[0].attributes.reporter.data.attributes.last_name)
        this.Form.controls['reporter_designation'].setValue(result.data[0].attributes.reporter.data.attributes.designation)
        this.Form.controls['status'].setValue(result.data[0].attributes.status)
        this.witnessList = result.data[0].attributes.witnesses.data
        let eviData: any[] = []
        result.data[0].attributes.evidences.data.forEach((elem: any) => {
          eviData.push({
            src: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format,
            caption: "Evidence",
            thumb: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format
          })
        })
        this.evidences = eviData
        if (result.data[0].attributes.investigation) {
          this.AccidentForm.controls['investigation'].setValue(result.data[0].attributes.investigation)
          this.AccidentForm.controls['investigationTemp'].setValue(result.data[0].attributes.investigation)
          this.AccidentForm.controls['root_cause'].setValue(result.data[0].attributes.root_cause)
          this.AccidentForm.controls['investigation'].disable()
        }
        if (result.data[0].attributes.status === "In-Progress" && result.data[0].attributes.investigation === "Required") {
          this.startInves = true
          this.completionStatus = false
        } else {
          this.startInves = false
          this.completionStatus = true
        }
        this.Form.disable()
        this.accidentdate.disable()
        this.accidenttime.disable()

        this.AccidentForm.controls['category'].setValue(result.data[0].attributes.category)
        this.AccidentForm.controls['sub_category'].setValue(result.data[0].attributes.sub_category)
        this.AccidentForm.controls['accident_type'].setValue(result.data[0].attributes.accident_type)
        this.AccidentForm.controls['work_performed'].setValue(result.data[0].attributes.work_performed)
        this.AccidentForm.controls['description'].setValue(result.data[0].attributes.description)
        this.AccidentForm.controls['action_taken'].setValue(result.data[0].attributes.action_taken)
        this.AccidentForm.controls['primary_body_part'].setValue(result.data[0].attributes.affected_secondary_region)
        this.AccidentForm.controls['secondary_body_part'].setValue(result.data[0].attributes.affected_secondary_region)
        this.AccidentForm.controls['tertiary_body_part'].setValue(result.data[0].attributes.affected_tertiary_region)
        this.AccidentForm.controls['affected_body_part'].setValue(result.data[0].attributes.affected_body_parts)
        const data = result.data[0].attributes.affected_body_parts
        if (data) {
          const split_string = data.split(",");
          this.bodypart = split_string
        }
        const primarydata = result.data[0].attributes.affected_primary_region
        if (primarydata) {
          const split_string = primarydata.split(",");
          this.primarybodypart = split_string
        }
        const secondarydata = result.data[0].attributes.affected_secondary_region
        if (secondarydata) {
          const split_string = secondarydata.split(",");
          this.secondarybodypart = split_string
        }
        const tertiarydata = result.data[0].attributes.affected_tertiary_region
        if (primarydata) {
          const split_string = tertiarydata.split(",");
          this.tertiarybodypart = split_string
        }
        const damage = result.data[0].attributes.damage
        if (damage) {
          const split_string_damage = damage.split(",");
          this.damages = split_string_damage
        }
        const disease = result.data[0].attributes.disease
        if (disease) {
          const split_string_disease = disease.split(",");
          this.diseases = split_string_disease
        }
        const environmental = result.data[0].attributes.environmental
        if (environmental) {
          const split_string_environmental = environmental.split(",");
          this.environments = split_string_environmental
        }
        this.AccidentForm.controls['injury_type'].setValue(result.data[0].attributes.injury_type)
        this.AccidentForm.controls['injury_cause'].setValue(result.data[0].attributes.injury_cause)
        this.AccidentForm.controls['hospital'].setValue(result.data[0].attributes.consulted_hospital)
        this.AccidentForm.controls['doctor'].setValue(result.data[0].attributes.consulted_doctor)
        this.AccidentForm.controls['time_of_work'].setValue(result.data[0].attributes.time_of_work)
        this.AccidentForm.controls['return_of_work'].setValue(result.data[0].attributes.return_for_work)
        this.peopleList = result.data[0].attributes.affected_individuals.data
        this.memberList = result.data[0].attributes.investigation_teams.data
        this.AccidentForm.controls['people'].reset()
        if (this.peopleList.length > 0) {
          this.AccidentForm.controls['people'].setValue('ok');
          this.AccidentForm.controls['people'].setErrors(null);
        } else {
          this.AccidentForm.controls['people'].setValidators(Validators.required);
        }
        if (this.Form.value.status === "Open") {
          Swal.fire({
            title: 'Open Task',
            imageUrl: "assets/images/calendar.gif",
            imageWidth: 150,
            text: "In order to provide the resolution details. You have to change the status from 'Open' to 'In-Progress'. ",
            showCancelButton: false,
            cancelButtonColor: '#d33',
          })
        } else if (this.Form.value.status === "In-Progress" && result.data[0].attributes.investigation === "Required") {
          Swal.fire({
            title: 'Start Investigation',
            imageUrl: "assets/images/calendar.gif",
            imageWidth: 150,
            text: "In order to provide the investigation details. You have to change the status from 'In-Progress' to 'Under Investigation'. ",
            showCancelButton: false,
            cancelButtonColor: '#d33',
          })
        }
        this.overviewForm.controls['atmospere_condition'].setValue(result.data[0].attributes.atmosphere_condition)
        this.overviewForm.controls['lighting_condition'].setValue(result.data[0].attributes.lightning_condition)
        this.overviewForm.controls['work_surface_condition'].setValue(result.data[0].attributes.work_surface_condition)
        this.overviewForm.controls['housekeeping_condition'].setValue(result.data[0].attributes.housekeeping_condition)
        this.overviewForm.controls['damage'].setValue(result.data[0].attributes.damage)
        this.overviewForm.controls['diseases'].setValue(result.data[0].attributes.disease)
        this.overviewForm.controls['environments'].setValue(result.data[0].attributes.environmental)
        if (result.data[0].attributes.injury === "Reportable Accident") {
          this.AccidentForm.controls['gov_reported_date'].setValidators(Validators.required);
          this.AccidentForm.controls['esi_reported_date'].setValidators(Validators.required);
        } else if (result.data[0].attributes.injury === "Non-Reportable Accident") {
          this.GOVRepdate.setErrors(null)
          this.ESIRepdate.setErrors(null)
          this.AccidentForm.controls['gov_reported_date'].setErrors(null);
          this.AccidentForm.controls['esi_reported_date'].setErrors(null);
        }
        if (result.data[0].attributes.gov_reported_date) {
          this.GOVRepdate.setValue(new Date(result.data[0].attributes.gov_reported_date))
          this.AccidentForm.controls['gov_reported_date'].setValue(new Date(result.data[0].attributes.gov_reported_date));
        }
        if (result.data[0].attributes.esi_reported_date) {
          this.ESIRepdate.setValue(new Date(result.data[0].attributes.esi_reported_date))
          this.AccidentForm.controls['esi_reported_date'].setValue(new Date(result.data[0].attributes.esi_reported_date));
        }
        this.AccidentForm.disable()
        this.bodyPartCtrl.disable()
        this.primarybodyPartCtrl.disable()
        this.secondarybodyPartCtrl.disable()
        this.tertiarybodyPartCtrl.disable()
        if (result.data[0].attributes.status === "In-Progress") {
          this.AccidentForm.controls['investigation'].disable()
        } else if (result.data[0].attributes.status === "Under Investigation") {
          this.AccidentForm.controls['investigationTemp'].enable()
          this.AccidentForm.controls['investigation'].disable()
        } else {
          this.AccidentForm.controls['investigation'].enable()
          this.AccidentForm.controls['investigationTemp'].disable()
        }
        if (result.data[0].attributes.accident_overviews) {
          this.accident_overview = result.data[0].attributes.accident_overviews.data
        }
        if (result.data[0].attributes.root_causes) {
          this.rootCause = result.data[0].attributes.root_causes.data
        }
        if (result.data[0].attributes.actions) {
          this.actions = result.data[0].attributes.actions.data

        }
        if (result.data[0].attributes.expenses) {
          this.expenses = result.data[0].attributes.expenses.data
          const amount = this.expenses.reduce((acc, cur) => acc + Number(cur.attributes.amount), 0);
          this.expenseTotal = amount
        }
        this.trainingForm.controls['training'].setValue(result.data[0].attributes.training)
        this.trainingForm.controls['lesson'].setValue(result.data[0].attributes.lesson)
        this.overviewForm.disable()
        this.trainingForm.disable()
        this.GOVRepdate.disable()
        this.ESIRepdate.disable()
        this.AccidentForm.controls['investigation'].disable()

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  viewStatement(evidence: any) {
    this.dialog.open(StatementComponent, {
      data: evidence
    })
  }

  viewEvidence(eviData: any) {
    this.dialog.open(ViewEvidenceComponent, { data: eviData }).afterClosed().subscribe((data: any) => {

    })

  }
  viewActionTaken(action: any) {
    this.dialog.open(ViewActionTakenComponent, {
      data: {
        actionTaken: action.attributes.action_taken,
        userRemarks: action.attributes.user_remarks,
      }
    }).afterClosed().subscribe((data: any) => {
    });
  }
  status(data: any) {
    const open = 'bg-light text-dark'
    const completed = 'bg-success text-white'
    const inProgress = 'bg-warning text-dark'
    if (data === "Open") {
      return open
    } else if (data === "Completed") {
      return completed

    } else if (data === "In-Progress") {
      return inProgress
    } else {
      return
    }
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

  navigate() {
    this.backToHistory = true
    this._location.back();
  }


}
