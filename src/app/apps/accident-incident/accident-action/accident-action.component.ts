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
import { AddModifyPeopleComponent } from './add-modify-people/add-modify-people.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AddModifyMemberComponent } from './add-modify-member/add-modify-member.component';
import { AddEventComponent } from './add-event/add-event.component';
import { ProcedureComponent } from './procedure/procedure.component';
import { UnsafeActsComponent } from './unsafe-acts/unsafe-acts.component';
import { UnsafeConditionComponent } from './unsafe-condition/unsafe-condition.component';
import { PersonalFactorComponent } from './personal-factor/personal-factor.component';
import { JobFactorComponent } from './job-factor/job-factor.component';
import { CorrectiveActionComponent } from './corrective-action/corrective-action.component';
import { ExpenseComponent } from './expense/expense.component';
import { CurrencyPipe } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { StatementComponent } from './statement/statement.component';
import { Lightbox } from 'ngx-lightbox';
import { ViewEvidenceComponent } from './view-evidence/view-evidence.component';
const { Configuration, OpenAIApi } = require("openai");
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
  selector: 'app-accident-action',
  templateUrl: './accident-action.component.html',
  styleUrls: ['./accident-action.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AccidentActionComponent implements OnInit {

  evidences: any = []
  expenses: any[] = []
  expenseTotal: any
  currency: any
  evidenceFormData = new FormData()
  evidenceData: any
  startInves: boolean = false
  completionStatus: boolean = false
  GOVRepdate = new FormControl(null);
  ESIRepdate = new FormControl(null);

  filterEvents(category: any) {
    return category.attributes?.category === "Events"
  }

  filterProcedure(category: any) {
    return category.attributes?.category === "Procedure"
  }

  filterAtmosphereCondition(value: any) {
    return value.attributes?.Category === "Atmosphere Condition"
  }

  filterLightingCondition(category: any) {
    return category.attributes?.Category === "Lightning"
  }

  filterWorkSurfaceCondition(category: any) {
    return category.attributes?.Category === "Work Surface"
  }

  filterHousekeepingCondition(category: any) {
    return category.attributes?.Category === "Housekeeping"
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

  overview: any[] = []
  atmosphereCondition: any[] = []
  separatorKeysCodes: number[] = [ENTER, COMMA];
  bodyPartCtrl = new FormControl('');
  primarybodyPartCtrl = new FormControl('');
  secondarybodyPartCtrl = new FormControl('');
  tertiarybodyPartCtrl = new FormControl('');
  filteredBodyPart: Observable<string[]>;
  filteredPrimaryBodyPart: Observable<string[]>;
  filteredSecondaryBodyPart: Observable<string[]>;
  filteredTertiaryBodyPart: Observable<string[]>;
  rootCause: any[] = []
  bodypart: string[] = [];
  primarybodypart: string[] = [];
  secondarybodypart: string[] = [];
  tertiarybodypart: string[] = [];
  allBodyPart: string[] = [];
  allprimaryBodyPart: string[] = [];
  allsecondaryBodyPart: string[] = [];
  alltertiaryBodyPart: string[] = [];
  allDamagePart: string[] = []
  accident_overview: any[] = []
  damages: any[] = []
  damageCtrl = new FormControl('');
  filteredDamages: Observable<string[]>;
  allDamages: string[] = [];
  actions: any[] = []
  diseases: any[] = []
  diseaseCtrl = new FormControl('');
  filteredDiseases: Observable<string[]>;
  allDisease: string[] = [];
  environments: any[] = []
  environmentCtrl = new FormControl('');
  filteredEnvironment: Observable<string[]>;
  allEnvironment: string[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  memberList: any[] = []
  memberListTemp: any[] = []
  accident_overview_procedure: any[] = []
  dropdownValues: any
  Form: FormGroup
  AccidentForm: FormGroup
  overviewForm: FormGroup
  trainingForm: FormGroup
  statementForm: FormGroup
  correctiveForm: FormGroup
  costForm: FormGroup
  accidentdate = new FormControl(null, [Validators.required]);
  accidenttime = new FormControl(null, [Validators.required]);
  witnessList: any[] = []
  peopleList: any[] = []
  accidentCategory: any[] = []
  accSubCategories: any[] = []
  accTypes: any[] = []
  bodyParts: any[] = []
  primarybodyParts: any[] = []
  secondarybodyParts: any[] = []
  tertiarybodyParts: any[] = []
  injurtTypes: any[] = []
  injuryCauses: any[] = []
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

  @ViewChild('bodyPartInput') bodyInput: ElementRef<HTMLInputElement>;
  @ViewChild('primarybodyPartInput') primarybodyInput: ElementRef<HTMLInputElement>;
  @ViewChild('secondarybodyPartInput') secondarybodyInput: ElementRef<HTMLInputElement>;
  @ViewChild('tertiarybodyPartInput') tertiarybodyInput: ElementRef<HTMLInputElement>;
  @ViewChild('damagePartInput') damageInput: ElementRef<HTMLInputElement>;
  @ViewChild('diseasePartInput') diseaseInput: ElementRef<HTMLInputElement>;
  @ViewChild('environmentPartInput') environmentInput: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private accidentService: AccidentService,
    public dialog: MatDialog, private _snackBar: MatSnackBar,
    private currencyPipe: CurrencyPipe,
    private _lightbox: Lightbox, private _location: Location) {
    this.filteredBodyPart = this.bodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allBodyPart.slice())),
    );
    this.filteredPrimaryBodyPart = this.primarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allprimaryBodyPart.slice())),
    );

    this.filteredDamages = this.damageCtrl.valueChanges.pipe(
      startWith(null),
      map((damage: string | null) => (damage ? this._filterDamage(damage) : this.allDamages.slice())),
    );

    this.filteredDiseases = this.diseaseCtrl.valueChanges.pipe(
      startWith(null),
      map((disease: string | null) => (disease ? this._filterDisease(disease) : this.allDisease.slice())),
    );

    this.filteredEnvironment = this.environmentCtrl.valueChanges.pipe(
      startWith(null),
      map((environment: string | null) => (environment ? this._filterEnvironment(environment) : this.allEnvironment.slice())),
    );
  }

  private _filterDamage(value: string): string[] {
    const filterValueDamage = value.toLowerCase();
    return this.allDamages.filter(damage => damage.toLowerCase().includes(filterValueDamage));
  }

  private _filterDisease(value: string): string[] {
    const filterValueDisease = value.toLowerCase();
    return this.allDisease.filter(disease => disease.toLowerCase().includes(filterValueDisease));
  }

  private _filterEnvironment(value: string): string[] {
    const filterValueEnvironment = value.toLowerCase();
    return this.allEnvironment.filter(environment => environment.toLowerCase().includes(filterValueEnvironment));
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
      department: [''],
      severity: ['', [Validators.required]],
      injury: ['', [Validators.required]],
      injury_temp: [''],
      supervisor: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
      userId: [null],
      user: [''],
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
      affected_body_part: [this.bodypart],
      primary_body_part: [this.primarybodypart],
      secondary_body_part: [this.secondarybodypart],
      tertiary_body_part: [this.tertiarybodypart, [Validators.required]],
      injury_type: ['', [Validators.required]],
      injury_cause: ['', [Validators.required]],
      hospital: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      time_of_work: ['', [Validators.required]],
      time_of_work_temp: [''],
      return_of_work: ['', [Validators.required]],
      body_part: [''],
      work_performed: [''],
      description: [''],
      action_taken: [''],
      gov_reported_date: [''],
      esi_reported_date: [''],
      root_cause: [''],
      return_of_work_temp: [{ hour: 0, minute: 0 }, [Validators.required]],

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

    this.costForm = this.formBuilder.group({
      cost: [0]
    })

  }

  costSymbol(data: any) {
    const amount = this.currencyPipe.transform(data.attributes.amount, this.currency);
    return amount
  }

  costSymbolTotal(data: any) {
    const totalAmount = this.currencyPipe.transform(data, this.currency);
    return totalAmount
  }

  editCosting(amount: any) {
    this.dialog.open(ExpenseComponent, {
      data: amount
    }).afterClosed().subscribe((cost) => {
      if (cost) {
        this.accidentService.update_accident_expense(cost).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const amounts = amount.attributes.amount
            const savedAmount = this.costForm.value.cost
            const redAmount = Number(savedAmount) - Number(amounts)
            const totAmount = Number(redAmount) + Number(cost.amountVal)
            this.accidentService.update_accident_cost(totAmount, this.Form.value.id).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                const statusText = "Expense Details Updated"
                this._snackBar.open(statusText, 'OK', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.get_accident()
              }
            })
          }
        })
      }
    });
  }

  delCosting(cost: any) {
    this.accidentService.delete_accident_cost(cost).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const amounts = cost.attributes.amount
        const savedAmount = this.costForm.value.cost
        const redAmount = Number(savedAmount) - Number(amounts)
        this.accidentService.update_accident_cost(redAmount, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Expense Details Updated"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_accident()
          }
        })
      }
    })
  }

  removeDamage(damage: string): void {
    const index = this.damages.indexOf(damage);
    if (index >= 0) {
      this.damages.splice(index, 1);
    }
    let data: any[] = []
    this.damages.forEach(elem => {
      data.push(elem)
    })
    this.overviewForm.controls['damage'].setValue(this.damages.toString())
  }

  removeDisease(disease: string): void {
    const index = this.diseases.indexOf(disease);
    if (index >= 0) {
      this.diseases.splice(index, 1);
    }
    let data: any[] = []
    this.diseases.forEach(elem => {
      data.push(elem)
    })
    this.overviewForm.controls['diseases'].setValue(this.diseases.toString())
  }

  removeEnvironment(environment: string): void {
    const index = this.environments.indexOf(environment);
    if (index >= 0) {
      this.environments.splice(index, 1);
    }
    let data: any[] = []
    this.environments.forEach(elem => {
      data.push(elem)
    })
    this.overviewForm.controls['environments'].setValue(this.environments.toString())
  }

  addDamage(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.damages.push(value);
    }
    event.chipInput!.clear();
    this.damageCtrl.setValue(null);
  }

  addDisease(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.diseases.push(value);
    }
    event.chipInput!.clear();
    this.diseaseCtrl.setValue(null);
  }

  addEnvironment(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.environments.push(value);
    }
    event.chipInput!.clear();
    this.environmentCtrl.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.bodypart.push(value);
    }
    event.chipInput!.clear();
    this.bodyPartCtrl.setValue(null);
  }
  addprimary(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.primarybodypart.push(value);
    }
    event.chipInput!.clear();
    this.primarybodyPartCtrl.setValue(null);
  }
  addsecondary(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.secondarybodypart.push(value);
    }
    event.chipInput!.clear();
    this.secondarybodyPartCtrl.setValue(null);
  }
  addtertiary(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tertiarybodypart.push(value);
    }
    event.chipInput!.clear();
    this.tertiarybodyPartCtrl.setValue(null);
  }
  remove(fruit: string): void {
    const index = this.bodypart.indexOf(fruit);
    if (index >= 0) {
      this.bodypart.splice(index, 1);
    }
  }
  removeprimary(fruit: string): void {
    const index = this.primarybodypart.indexOf(fruit);
    if (index >= 0) {
      this.primarybodypart.splice(index, 1);
    }
  }
  removesecondary(fruit: string): void {
    const index = this.secondarybodypart.indexOf(fruit);
    if (index >= 0) {
      this.secondarybodypart.splice(index, 1);
    }
  }
  removetertiary(fruit: string): void {
    const index = this.tertiarybodypart.indexOf(fruit);
    if (index >= 0) {
      this.tertiarybodypart.splice(index, 1);
    }
  }
  save(form: any) {

    this.showProgressPopup();
    this.accidentService.update_accident_overview(this.Form.value.id, this.overviewForm.value, this.AccidentForm.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        let statusText;
        if (form === 'root_cause') {

          statusText = "Root Cause Details Updated"
        } else {
          statusText = "Overview Details Updated"

        }
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
        this.get_accident()
      }
    })
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.bodypart.push(event.option.viewValue);
    this.AccidentForm.controls['affected_body_part'].setValue(this.bodypart.toString())
    this.bodyInput.nativeElement.value = '';
    this.bodyPartCtrl.setValue(null);
  }
  selectedprimary(event: MatAutocompleteSelectedEvent): void {
    this.primarybodypart.push(event.option.viewValue);
    this.Form.controls['primary_body_part'].setValue(this.primarybodypart.toString());
    this.primarybodyInput.nativeElement.value = '';
    this.primarybodyPartCtrl.setValue(null);
    this.filteredSecondaryBodyPart = this.secondarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filtersecondary(fruit) : this.allsecondaryBodyPart.slice()
      )
    );
    const module = 'Accident and Incident';
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {



        const bodySecondaryRegion = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Body Secondary Region" && elem.attributes.filter === event.option.viewValue)
        })
        let secondarydata: any[] = [];
        bodySecondaryRegion.forEach((elem: any) => {
          secondarydata.push(elem.attributes.Value);
        });
        this.allsecondaryBodyPart = secondarydata;
        this.filteredSecondaryBodyPart = this.secondarybodyPartCtrl.valueChanges.pipe(
          startWith(null),
          map((fruit: string | null) =>
            fruit ? this._filtersecondary(fruit) : this.allsecondaryBodyPart.slice()
          )
        );
      },
      error: (err: any) => { },
      complete: () => {

      },
    });
  }
  selectedsecondary(event: MatAutocompleteSelectedEvent): void {
    this.secondarybodypart.push(event.option.viewValue);
    this.Form.controls['secondary_body_part'].setValue(this.secondarybodypart.toString());
    this.secondarybodyInput.nativeElement.value = '';
    this.secondarybodyPartCtrl.setValue(null);
    const module = 'Accident and Incident';
    this.accidentService.get_tertiary_part().subscribe({
      next: (result: any) => {



        const bodytertiaryRegion = result.data.filter(function (elem: any) {
          return (elem.attributes.filter === event.option.viewValue)
        })
        let tertiarydata: any[] = [];
        bodytertiaryRegion.forEach((elem: any) => {
          tertiarydata.push(elem.attributes.value);
        });
        this.alltertiaryBodyPart = tertiarydata;
        this.filteredTertiaryBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
          startWith(null),
          map((fruit: string | null) =>
            fruit ? this._filtertertiary(fruit) : this.alltertiaryBodyPart.slice()
          )
        );
      },
      error: (err: any) => { },
      complete: () => {

      },
    });
  }
  selectedtertiary(event: MatAutocompleteSelectedEvent): void {
    this.tertiarybodypart.push(event.option.viewValue);
    this.Form.controls['tertiary_body_part'].setValue(this.tertiarybodypart.toString());
    this.tertiarybodyInput.nativeElement.value = '';
    this.tertiarybodyPartCtrl.setValue(null);
    this.filteredTertiaryBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filtertertiary(fruit) : this.alltertiaryBodyPart.slice()
      )
    );
  }
  selectedDamage(event: MatAutocompleteSelectedEvent): void {
    this.damages.push(event.option.viewValue);
    this.overviewForm.controls['damage'].setValue(this.damages.toString())
    this.damageInput.nativeElement.value = '';
    this.damageCtrl.setValue(null);
  }

  selectedDisease(event: MatAutocompleteSelectedEvent): void {
    this.diseases.push(event.option.viewValue);
    this.overviewForm.controls['diseases'].setValue(this.diseases.toString())
    this.diseaseInput.nativeElement.value = '';
    this.diseaseCtrl.setValue(null);
  }

  selectedEnvironment(event: MatAutocompleteSelectedEvent): void {
    this.environments.push(event.option.viewValue);
    this.overviewForm.controls['environments'].setValue(this.environments.toString())
    this.environmentInput.nativeElement.value = '';
    this.environmentCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allBodyPart.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
  private _filterprimary(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allprimaryBodyPart.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }
  private _filtersecondary(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allsecondaryBodyPart.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }
  private _filtertertiary(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.alltertiaryBodyPart.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }


  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident
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
        const status = result.acc_inc_action
        this.Form.controls['userId'].setValue(result.id)
        this.Form.controls['user'].setValue(result.username)
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
          this.get_dropdown_values()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_dropdown_values() {
    const module = "Accident and Incident"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        const damage = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Damage")
        })
        const disease = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Disease")
        })
        const environment = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Environment")
        })
        let damageData: any[] = []
        damage.forEach((elem: any) => {
          damageData.push(elem.attributes.Value)

        })
        this.allDamages = damageData
        let diseaseData: any[] = []
        disease.forEach((elem: any) => {
          diseaseData.push(elem.attributes.Value)
        })
        this.allDisease = diseaseData
        let environmentData: any[] = []
        environment.forEach((elem: any) => {
          environmentData.push(elem.attributes.Value)
        })
        this.allEnvironment = environmentData
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  accCategory() {
    const category = this.AccidentForm.value.category
    const subData = this.accidentCategory.filter(function (elem) {
      return (elem.attributes.category_name === category)
    })
    if (subData.length > 0) {
      this.accSubCategories = subData[0].attributes.subcategories.data
    }
  }

  //get accident
  get_accident() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.accidentService.get_accident_reference(reference, this.Form.value.org_id).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if ((result.data[0].attributes?.resolution === "Completed") || (!matchFound || matchFound !== true)) {
          this.router.navigate(["/apps/accident-incident/accident-assigned"])
        } else {
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
          this.Form.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
          this.Form.controls['division'].setValue(result.data[0].attributes.division)
          this.Form.controls['location'].setValue(result.data[0].attributes.location)
          this.Form.controls['department'].setValue(result.data[0].attributes?.department)
          this.Form.controls['severity'].setValue(result.data[0].attributes.severity)
          this.Form.controls['injury'].setValue(result.data[0].attributes.injury)
          this.Form.controls['injury_temp'].setValue(result.data[0].attributes.injury)


          this.Form.controls['assignee'].setValue(result.data[0].attributes.assignee.data.id)
          let eviData: any[] = []
          result.data[0].attributes.evidences.data.forEach((elem: any) => {
            eviData.push({
              src: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format,
              caption: "Evidence",
              thumb: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format
            })
          })
          this.evidences = eviData
          this.Form.controls['supervisor'].setValue(result.data[0].attributes.supervisor_name)
          this.accidentdate.setValue(new Date(result.data[0].attributes.accident_date))
          this.accidenttime.setValue(new Date(result.data[0].attributes.accident_time))
          this.Form.controls['evidence'].setValue(environment.client_backend + '/uploads/' + result.data[0].attributes.evidence_name)
          this.Form.controls['reporterID'].setValue(result.data[0].attributes.reporter.data.id)
          this.Form.controls['reporter'].setValue(result.data[0].attributes.reporter.data.attributes.first_name + ' ' + result.data[0].attributes.reporter.data.attributes.last_name)
          this.Form.controls['reporter_designation'].setValue(result.data[0].attributes.reporter.data.attributes.designation)
          this.Form.controls['status'].setValue(result.data[0].attributes.status)
          this.witnessList = result.data[0].attributes.witnesses.data
          if (result.data[0].attributes.investigation) {
            this.AccidentForm.controls['investigation'].setValue(result.data[0].attributes.investigation)
            this.AccidentForm.controls['investigationTemp'].setValue(result.data[0].attributes.investigation)
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
          this.accCategory()
          this.AccidentForm.controls['sub_category'].setValue(result.data[0].attributes.sub_category)
          this.AccidentForm.controls['accident_type'].setValue(result.data[0].attributes.accident_type)
          this.AccidentForm.controls['work_performed'].setValue(result.data[0].attributes.work_performed)
          this.AccidentForm.controls['description'].setValue(result.data[0].attributes.description)
          this.AccidentForm.controls['action_taken'].setValue(result.data[0].attributes.action_taken)
          this.costForm.controls['cost'].setValue(result.data[0].attributes.amount)
          this.AccidentForm.controls['affected_body_part'].setValue(result.data[0].attributes.affected_body_parts)
          this.AccidentForm.controls['primary_body_part'].setValue(result.data[0].attributes.affected_primary_region)
          this.AccidentForm.controls['secondary_body_part'].setValue(result.data[0].attributes.affected_secondary_region)
          this.AccidentForm.controls['tertiary_body_part'].setValue(result.data[0].attributes.affected_tertiary_region)
          this.AccidentForm.controls['root_cause'].setValue(result.data[0].attributes.root_cause)
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
          if (tertiarydata) {
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
          this.AccidentForm.controls['time_of_work_temp'].setValue(result.data[0].attributes.time_of_work)
          this.AccidentForm.controls['return_of_work_temp'].setValue({ hour: result.data[0].attributes.return_for_work_hour, minute: result.data[0].attributes.return_for_work_min })

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
            // this.GOVRepdate.setValidators(Validators.required)
            // this.ESIRepdate.setValidators(Validators.required)
            // this.AccidentForm.controls['gov_reported_date'].setValidators(Validators.required);
            // this.AccidentForm.controls['esi_reported_date'].setValidators(Validators.required);
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





        // this.Form.controls['injury'].enable()
        // this.Form.controls['injury_temp'].enable()


      },
      error: (err: any) => {
        Swal.close()
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.AccidentForm.controls['root_cause'].enable()
      }
    })
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

  inProgress() {
    const invesStatus = this.AccidentForm.value.investigation
    if (invesStatus) {
      this.start_progress()
    } else {
      Swal.fire({
        title: 'Empty Investigation Status',
        imageUrl: "assets/images/calendar.gif",
        imageWidth: 150,
        text: "In order to start progress, please select the investigation status. If not choosen, the system will consider as investiagtion is not required for this particular task. ",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showProgressPopup();
          this.AccidentForm.controls['investigation'].setValue('Not-Required')
          this.start_progress()
        }
      })
    }
  }

  investigation(data: any) {
    // this.AccidentForm.controls['investigation'].setValue(data.value)
  }

  start_progress() {
    this.accidentService.start_acc_progress(this.Form.value, this.AccidentForm.value).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.Form.controls['reference_number'].enable()
        this.Form.controls['userId'].enable()
        let data: any[] = []
        data.push({
          action: "Started Investigation",
          refernceNumber: this.Form.value.reference_number,
          user: this.Form.value.userId,
          title: 'In Progress',
          imageUrl: "assets/images/start-working.gif",
          text: "You have successfully changed the status to In Progress."
        })
        this.Form.controls['reference_number'].disable()
        this.Form.controls['userId'].disable()
        this.create_progress_activity(data)
      }
    })
  }

  create_progress_activity(data: any) {
    const action = data[0].action
    const refernceNumber = data[0].refernceNumber
    const user = data[0].user
    this.generalService.create_activity_stream(action, refernceNumber, user).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        Swal.close()
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'In Progress',
          imageUrl: "assets/images/start-working.gif",
          text: "You have successfully changed the status to In Progress.",
          imageWidth: 250,
          showCancelButton: false,
        }).then((result) => {
          this.ngOnInit()
        })
      }
    })
  }

  create_completed_activity(data: any) {
    const action = data[0].action
    const refernceNumber = data[0].refernceNumber
    const user = data[0].user
    this.generalService.create_activity_stream(action, refernceNumber, user).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_completed_notification()
      }
    })
  }
  create_completed_notification() {
    this.Form.controls['reference_number'].enable()
    this.Form.controls['userId'].enable()
    this.Form.controls['reporterID'].enable()
    let data: any[] = []
    data.push({
      module: "Accident & Incident",
      action: 'Completed the investigation:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.userId,
      access_link: "/apps/accident-incident/accident-register",
      profile: this.Form.value.reporterID
    })
    this.Form.controls['reference_number'].disable()
    this.Form.controls['userId'].disable()
    this.Form.controls['reporterID'].disable()
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Completed',
          imageUrl: "assets/images/confirm.gif",
          text: "You have successfully completed the investigation on reported accident.",
          imageWidth: 250,
          showCancelButton: false,
        }).then((result) => {
          this.ngOnInit()
        })
      }
    })
  }

  submit() {
    this.showProgressPopup();
    this.AccidentForm.controls['investigation'].enable()
    this.accidentService.update_action(this.Form.value, this.AccidentForm.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        Swal.close()
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Updated',
          imageUrl: "assets/images/start-working.gif",
          imageWidth: 250,
          text: "You have successfully updated the details.",
          showCancelButton: false,
        }).then((result) => {
          this.get_accident()
        })
      }
    })
  }

  create_individual() {
    const accID = this.Form.value.id
    this.peopleList.forEach(elem => {
      this.accidentService.create_accident_individual(elem, accID).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          Swal.fire({
            title: 'Updated',
            imageUrl: "assets/images/start-working.gif",
            imageWidth: 250,
            text: "You have successfully updated the details.",
            showCancelButton: false,

          }).then((result) => {
            this.ngOnInit()
          })
        }
      })
    })
  }

  complete() {
    if (this.Form.value.investiagtion) {
      if (this.Form.invalid || this.AccidentForm.invalid || this.overviewForm.invalid ||
        this.trainingForm.invalid || this.statementForm.invalid || this.correctiveForm.invalid ||
        this.costForm.invalid) {
        const statusText = "Please fill in all the mandatory fields."
        this._snackBar.open(statusText, 'ok', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        Swal.fire({
          title: 'Are you sure?',
          imageUrl: "assets/images/confirm-1.gif",
          imageWidth: 250,
          text: "please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.showProgressPopup();
            this.save('overview')
            this.save('root_cause')
            this.saveTraining()
            this.update_completion_status()
          }
        })
      }
    } else {
      Swal.fire({
        title: 'Are you sure?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showProgressPopup();
          this.update_completion_status()
        }
      })
    }
  }


  update_completion_status() {
    this.accidentService.update_completion_status(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        let data: any[] = []
        data.push({
          action: "Investigation Completed",
          refernceNumber: this.Form.value.reference_number,
          user: this.Form.value.userId,
        })
        this.create_completed_activity(data)
      }
    })
  }

  addMember() {
    this.dialog.open(AddModifyMemberComponent).afterClosed().subscribe(data => {
      this.accidentService.create_investigation_team(this.Form.value.id, data).subscribe({
        next: (result: any) => {

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          this.create_member_notification(data)
        }
      })
    })
  }

  addEvent() {
    this.dialog.open(AddEventComponent, { width: "740px" }).afterClosed().subscribe(data => {
      data.forEach((elem: any) => {
        this.accident_overview.push(elem)
      })
      this.accidentService.update_accident_overview_events(this.accident_overview, this.Form.value.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const statusText = "Overview Updated"
          this._snackBar.open(statusText, 'Success', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000
          });
          this.get_accident()
        }
      })
    })
  }

  addProcedure() {
    this.dialog.open(ProcedureComponent, { width: "740px" }).afterClosed().subscribe(data => {
      data.forEach((elem: any) => {
        this.accident_overview.push(elem)
      })
      this.accidentService.update_accident_overview_events(this.accident_overview, this.Form.value.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const statusText = "Overview Updated"
          this._snackBar.open(statusText, 'Success', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000
          });
          this.get_accident()
        }
      })
    })
  }

  delEvent(data: any) {
    this.accident_overview.splice(this.accident_overview.findIndex((events) => events.id === data.id), 1);
    this.accidentService.update_accident_overview_events(this.accident_overview, this.Form.value.id).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Overview Updated"
        this._snackBar.open(statusText, 'Success', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
        this.get_accident()
      }
    })
  }

  create_member_notification(memData: any) {
    this.Form.controls['reference_number'].enable()
    this.Form.controls['userId'].enable()
    let data: any[] = []
    data.push({
      module: "Accident & Incident",
      action: 'Add you in investigation team:',
      reference_number: this.Form.value.reference_number,
      userID: memData.id,
      access_link: "/apps/accident-incident/accident-action/",
      profile: this.Form.value.userId
    })
    this.Form.controls['reference_number'].disable()
    this.Form.controls['userId'].disable()
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.get_accident()
        const statusText = "Team member added"
        this._snackBar.open(statusText, 'Success', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
      }
    })
  }

  deleteMember(data: any) {

    this.accidentService.delete_investigation_team(data.id).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.get_accident()
      }
    })
  }

  startInvestigation() {
    this.showProgressPopup();
    const status = "Under Investigation"
    this.accidentService.update_status(this.Form.value.id, status).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        Swal.close()
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Investigation',
          imageUrl: "assets/images/start-working.gif",
          imageWidth: 250,
          text: "You have successfully the investigation.",
          showCancelButton: false,

        }).then((result) => {
          this.ngOnInit()
        })
      }
    })
  }


  addUnsafeActs() {
    this.dialog.open(UnsafeActsComponent, { width: "740px" }).afterClosed().subscribe(data => {
      data.forEach((elem: any) => {
        this.rootCause.push(elem)
      })
      this.accidentService.update_accident_root_cause(this.rootCause, this.Form.value.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const statusText = "Root Cause Updated"
          this._snackBar.open(statusText, 'Success', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000
          });
          this.get_accident()
        }
      })
    })
  }

  addUnsafeCondition() {
    this.dialog.open(UnsafeConditionComponent, { width: "740px" }).afterClosed().subscribe(data => {
      data.forEach((elem: any) => {
        this.rootCause.push(elem)
      })
      this.accidentService.update_accident_root_cause(this.rootCause, this.Form.value.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const statusText = "Root Cause Updated"
          this._snackBar.open(statusText, 'Success', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000
          });
          this.get_accident()
        }
      })
    })
  }

  addPersonalFactors() {
    this.dialog.open(PersonalFactorComponent, { width: "740px" }).afterClosed().subscribe(data => {
      data.forEach((elem: any) => {
        this.rootCause.push(elem)
      })
      this.accidentService.update_accident_root_cause(this.rootCause, this.Form.value.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const statusText = "Root Cause Updated"
          this._snackBar.open(statusText, 'Success', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000
          });
          this.get_accident()
        }
      })
    })
  }

  addJobFactors() {
    this.dialog.open(JobFactorComponent, { width: "740px" }).afterClosed().subscribe(data => {
      data.forEach((elem: any) => {
        this.rootCause.push(elem)
      })
      this.accidentService.update_accident_root_cause(this.rootCause, this.Form.value.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const statusText = "Root Cause Updated"
          this._snackBar.open(statusText, 'Success', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000
          });
          this.get_accident()
        }
      })
    })
  }

  delRootCause(data: any) {
    this.rootCause.splice(this.rootCause.findIndex((cause) => cause.id === data.id), 1);
    this.accidentService.update_accident_root_cause(this.rootCause, this.Form.value.id).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Root Cause Updated"
        this._snackBar.open(statusText, 'Success', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
        this.get_accident()
      }
    })
  }

  addAction() {
    this.dialog.open(CorrectiveActionComponent, { width: "740px" }).afterClosed().subscribe(data => {
      if (data) {
        this.accidentService.get_assigned_corrective_action_accref(this.Form.value.id).subscribe({
          next: (result: any) => {
            const count = result.data.length
            const newCount = Number(count) + 1
            const reference = "CAC-" + newCount
            this.correctiveForm.controls['reference_number'].setValue(reference)
            this.correctiveForm.controls['userId'].setValue(data.assignee)
            this.accidentService.create_corrective_action(data, this.Form.value.id, reference).subscribe({
              next: (result: any) => {
              },
              error: (err: any) => { },
              complete: () => {
                this.create_corr_action_notification()
              }
            })
          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
    })
  }

  create_corr_action_notification() {
    this.Form.controls['reporterID'].enable()
    let data: any[] = []
    data.push({
      module: "Accident & Incident",
      action: 'Assigned a corrective or preventive action',
      reference_number: this.correctiveForm.value.reference_number,
      userID: this.correctiveForm.value.userId,
      access_link: "/apps/accident-incident/corrective-actions",
      profile: this.Form.value.reporterID
    })
    this.Form.controls['reporterID'].disable()
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "Added Corrective / Preventive Action"
        this._snackBar.open(statusText, 'Success', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
        this.get_accident()
      }
    })
  }

  saveTraining() {
    this.showProgressPopup();
    this.accidentService.update_training_details(this.trainingForm.value, this.Form.value.id).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Training Details Updated"
        this._snackBar.open(statusText, 'Success', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
        Swal.close()
        this.get_accident()
      }
    })
  }

  addExpense() {
    this.dialog.open(ExpenseComponent, { width: "740px" }).afterClosed().subscribe(data => {
      if (data) {
        this.accidentService.create_accident_expense(data, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const currAmount = this.costForm.value.cost
            const amount = data.amountVal
            const totAmount = Number(currAmount) + Number(amount)
            this.accidentService.update_accident_cost(totAmount, this.Form.value.id).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                const statusText = "Expense Added"
                this._snackBar.open(statusText, 'Success', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                  duration: 3000
                });
                this.get_accident()
              }
            })
          }
        })
      }
    })
  }

  evidence(event: any, data: any) {
    const evID = data.id
    if (event.target.files.length > 0) {
      const size = event.target.files[0].size / 1024 / 1024
      if (size > 2) {
        const statusText = "Please choose an image below 2 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['jpg', 'jpeg', 'png'];
        var extension = event.target.files[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        this.statementForm.controls['evidence_type'].setValue(extension);
        if (isSuccess) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              this.statementForm.controls['evidence'].setValue(event.target.result)
            }
          };
          reader.readAsDataURL(event.target.files[0]);
          this.evidenceData = event.target.files[0]
          const uuid = uuidv4()
          const uuid2 = uuid.slice(0, 8)
          this.evidenceFormData.append('files', this.evidenceData, uuid2 + '.' + this.statementForm.value.evidence_type)
          this.upload_evidence(evID)
        } else {
          const statusText = "Please choose images ('jpg', 'jpeg', 'png')"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    }
  }


  upload_evidence(evID: any) {
    this.generalService.upload(this.evidenceFormData).subscribe({
      next: (result: any) => {
        const name = result[0].hash
        const format = this.statementForm.value.evidence_type
        const fileName = name + '.' + format
        this.statementForm.controls['evidence_name'].setValue(fileName)
        this.statementForm.controls['evidence_id'].setValue(result[0].id)
      },
      error: (err: any) => { },
      complete: () => {
        this.update_evidence_id(evID)
      }
    })
  }

  update_evidence_id(evID: any) {
    this.accidentService.update_evidence_id(evID, this.statementForm.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Statement updated Successfully"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.get_accident()
      }
    })
  }

  viewStatement(evidence: any) {
    this.dialog.open(StatementComponent, {
      data: evidence
    })
  }

  GovRepDate(data: any) {
    this.AccidentForm.enable()
    let DateVal = new Date(data.value)
    let DateString = new Date(DateVal.getTime() - (DateVal.getTimezoneOffset() * 60000))
      .toISOString()
      .split("T")[0];
    this.AccidentForm.controls['gov_reported_date'].setValue(DateString)
    this.accidentService.update_gov_rep_date(DateString, this.Form.value.id).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Updated Successfully"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.AccidentForm.disable()
      }
    })
  }

  ESIRepDate(data: any) {
    this.AccidentForm.enable()
    let DateVal = new Date(data.value)
    let DateString = new Date(DateVal.getTime() - (DateVal.getTimezoneOffset() * 60000))
      .toISOString()
      .split("T")[0];
    this.AccidentForm.controls['esi_reported_date'].setValue(DateString)
    this.accidentService.update_esi_rep_date(DateString, this.Form.value.id).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Updated Successfully"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.AccidentForm.disable()
      }
    })
  }

  checkValue(event: any, witness: any) {
    this.accidentService.update_witness_statement_status(witness.id, event.currentTarget.checked).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Statement Updated Successfully"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    })
  }

  checkDescription() {
    this.AccidentForm.controls['description'].enable()
    const description = this.AccidentForm.value.description
    if (description) {
      document.getElementById('error-text')?.classList.add("hide");
      const stringWithoutPTags = description.replace(/<\/?p>/g, '');
      this.chatGPT(stringWithoutPTags)
    } else {
      document.getElementById('error-text')?.classList.remove("hide");
    }
  }

  async chatGPT(stringWithoutPTags: any) {
    document.getElementById('ai-loader')?.classList.remove("hide");
    document.getElementById('ai-suggest')?.classList.add("hide");
    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const message = stringWithoutPTags + ' Please write the root cause as a single descriptive paragraph, avoiding bullet points and lists.'
    let requestData = {
      model: "gpt-3.5-turbo",
      format: "html",
      messages: [{ role: "user", content: message }],
    };
    let apiResponse = await openai.createChatCompletion(requestData);
    const completion_tokens = apiResponse.data.usage.completion_tokens
    const prompt_tokens = apiResponse.data.usage.prompt_tokens
    const total_tokens = apiResponse.data.usage.total_tokens
    this.control_event_open_ai(completion_tokens, prompt_tokens, total_tokens)
    this.AccidentForm.controls['root_cause'].enable()
    this.AccidentForm.controls['root_cause'].setValue(apiResponse.data.choices[0].message.content)
    document.getElementById('ai-loader')?.classList.add("hide");
    document.getElementById('ai-suggest')?.classList.remove("hide");
  }
  control_event_open_ai(completion_tokens: any, prompt_tokens: any, total_tokens: any) {
    this.accidentService.create_open_ai(this.Form.value, completion_tokens, prompt_tokens, total_tokens).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {

      }
    })

  }
  //open ai
  // async chatGPTForRootCause(stringWithoutPTags: any) {
  //   document.getElementById('root-cause-ai-loader')?.classList.remove("hide");
  //   document.getElementById('root-cause-ai-suggest')?.classList.add("hide");

  //   // const observation = this.generalForm.value.observation
  //   const configuration = new Configuration({
  //     apiKey: environment.OPENAI_API_KEY,
  //   });
  //   const openai = new OpenAIApi(configuration);
  //   const message =  stringWithoutPTags + '.suggest the top 3 practicable possible root cause for this Accident description .Answer should be embedded in html tags .Answer Should be in a format of having a heading Top 3 practical root causes'
  //   // const message = 'resolution for a hazard happens in the ' + category + ' category the ' + observation + '.'
  //   let requestData = {
  //     // model: 'text-davinci-003',//'text-davinci-003',//"text-curie-001",
  //     // prompt: 'resolution for a hazard happens in the '+category+' category the '+observation+'.',//this.generatePrompt(animal),
  //     // temperature: 0.95,
  //     // max_tokens: 150,
  //     // top_p: 1.0,
  //     // frequency_penalty: 0.0,
  //     // presence_penalty: 0.0,

  //     model: "gpt-3.5-turbo",
  //     format: "html",
  //     messages: [{ role: "user", content: message }],
  //   };
  //   let apiResponse = await openai.createChatCompletion(requestData);
  //   const completion_tokens = apiResponse.data.usage.completion_tokens
  //   const prompt_tokens = apiResponse.data.usage.prompt_tokens
  //   const total_tokens = apiResponse.data.usage.total_tokens
  //   this.control_event_open_ai(completion_tokens, prompt_tokens, total_tokens)
  //   this.AccidentForm.controls['root_cause'].setValue('<p>' + apiResponse.data.choices[0].message.content + '</p>')
  //   document.getElementById('root-cause-ai-loader')?.classList.add("hide");
  //   document.getElementById('root-cause-ai-suggest')?.classList.remove("hide");
  //   // document.getElementById('ai-suggest')?.classList.add("hide");
  // }

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

  viewEvidence(eviData: any) {
    this.dialog.open(ViewEvidenceComponent, { data: eviData }).afterClosed().subscribe((data: any) => {

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
