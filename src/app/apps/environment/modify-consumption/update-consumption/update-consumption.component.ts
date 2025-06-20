import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.api.service';
import Swal from 'sweetalert2';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { environment } from 'src/environments/environment';
import { Lightbox } from 'ngx-lightbox';
import { AuthService } from 'src/app/services/auth.api.service';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { CreateTestingOrganizationComponent } from '../../add-consumption/create-testing-organization/create-testing-organization.component';
import { RefrigerantComponent } from '../../common-component/refrigerant/refrigerant.component';
import { ViewRefrigerantComponent } from '../../common-component/view-refrigerant/view-refrigerant.component';
import { NewIssueComponent } from '../../common-component/new-issue/new-issue.component';
import { ViewIssueComponent } from '../../common-component/view-issue/view-issue.component';
import { NewSupplierComponent } from '../../common-component/new-supplier/new-supplier.component';
import { AddMeterComponent } from '../../add-consumption/add-meter/add-meter.component';
import { CreateWasteTypeComponent } from '../../add-consumption/create-waste-type/create-waste-type.component';
import { Console } from 'console';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-update-consumption',
  templateUrl: './update-consumption.component.html',
  styleUrls: ['./update-consumption.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class UpdateConsumptionComponent implements OnInit {
  Form: FormGroup;
  mode: 'create' | 'update' = 'create';
  // consumptionDropDownValues: any[] = [];
  pollutantsEmitted: any[] = []
  TestingOrganization: any[] = []
  consumCategory: any[] = [];
  source: any[] = [];
  categories: any[] = [];
  disposalMethod: any[] = [];
  conCategory: any[] = [];
  scopes: any[] = [];
  scopes1categories: any[] = []
  evidenceData: any[] = [];
  quantities: any[] = [];
  wasteQuantities: any[] = []
  sources: any[] = [];
  refrigerantTypes: any[] = []
  peopleList: any[] = [];
  divisions: any[] = [];
  years: any[] = [];
  watertypes: any[] = []
  totalCatCount: number;
  consumptions: any[] = [];
  orgID: any;
  usageTypeList: any[] = [];
  consID: any;
  imgID: any;
  units: any[] = []
  DropDownValues: any[] = []
  consumptionDropDownValues: any[] = []
  wasteTypes:any[]=[]
  filteredApplicabilities:any[]=[]
  evidences: any[] = [];
  pollutants: any[] = []
  selectedOutcomes: string[] = [];
  collectedFrom = new FormControl(null, [Validators.required]);
  collectedTo = new FormControl(null, [Validators.required]);
  disposalDate = new FormControl(null);
  latesttest = new FormControl(null, [Validators.required]);
  applicability = new FormControl(null, [Validators.required]);
  Treatment_outcome = new FormControl(null, [Validators.required]);
  files: File[] = [];
  consumptionFile: any[] = [];
  treatment: any[];
  treatmentOutcomes: any[] = []
  reusedRecycledQuantities: any[] = []
  applicabilities: any[] = []
  evidenceFormData = new FormData();
  renewableEnergySources: any[] = []
  source_type: any[] = []
  renewable: boolean = false
  refrigerantType = new FormControl('');
  filteredRefrigerantOptions: Observable<any[]>;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
      ],
    },
  };
  Newfiles: any[] = [];
  recDataList: any[] = [];
  usageType = new FormControl(null);
  supplierList: any[] = [];
  IssueList: any[] = [];
  refrigerants: any[] = [];
  userId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<UpdateConsumptionComponent>,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private generalService: GeneralService,
    private environmentService: EnvironmentService,
    private _lightbox: Lightbox
  ) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      id: [''],
      setId: [''],
      consumption_category: ['', [Validators.required]],
      category: ['', [Validators.required]],
      source: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      amount: [''],
      legal_emission_limit: [0],
      control_device: [null],
      renewable_energy_source: [''],
      latest_test: ['', [Validators.required]],
      monitoring_frequency: ['', [Validators.required]],
      source_capacity: [''],
      scope: ['', [Validators.required]],
      description: [''],
      treatment: ['', [Validators.required]],
      collected_from: ['', [Validators.required]],
      collected_to: ['', [Validators.required]],
      disposal_method: ['', [Validators.required]],
      water_type: ['', [Validators.required]],
      disposal_date: [null],
      consignment_number: [''],
      disposer: [''],
      carrier: [''],
      disposal_place: [''],
      pollutants_emitted: ['', [Validators.required]],
      concentration: [''],
      determined_by: ['', [Validators.required]],
      files: [''],
      meter_reading: [''],
      quantity_source: [''],
      pending_consumption: [''],
      pending_percentage: [0],
      emission_factor: [0],
      ghg_value: [0],
      conversion_factor: [0],
      conversion_value: [0],
      conversion_required: [''],
      quantity_kwh: [0],
      evidence: [''],
      evidence_id: [''],
      reference: [''],
      emission_value: [],
      refrigerant_type: ['', [Validators.required]],
      reused_recycled_quantity: [''],
      treatment_outcome_recycled: [''],
      treatment_outcome_reused: [''],
      applicability: ['', [Validators.required]],
      treatment_outcome: ['', [Validators.required]],
      rec_status: [false],
      usage_type: [''],
      rec_type: [''],
      i_rec_quantity: [null],
      scope_1_cateogry: ['', [Validators.required]],
      source_type: [''],
      volumetric_flow_rate: [null],
      operation_time: [null],
      testing_organization: [''],
      compliance_status: [''],
      opening_balance: [null],
      purchased_quantity: [null],
      purchase_date: [null],
      supplier_name: [''],
      stock_balance: [null],
      add_issue: [false],
      refrigerants: [''],
      con_issues: [''],
      waste_type: ['', [Validators.required]]
      //add_meter: [false]

    });



    this.me();

    this.Form.get('volumetric_flow_rate')?.valueChanges.subscribe(value => {
      const operationTimeControl = this.Form.get('operation_time');

      if (value !== null && value !== '' && value !== undefined) {
        operationTimeControl?.setValidators([Validators.required]);
      } else {
        operationTimeControl?.clearValidators();
      }
      operationTimeControl?.updateValueAndValidity();
    });

    if (this.defaults) {

      this.consID = this.defaults.data.id;
      this.files = [];
      this.Form.controls['quantity_kwh'].setValue(this.defaults.data.attributes.quantity_kwh);
      this.Form.controls['emission_value'].setValue(this.defaults.data.attributes.emission_value);
      this.Form.controls['conversion_value'].setValue(this.defaults.data.attributes.conversion_value);
      this.Form.controls['conversion_required'].setValue(this.defaults.data.attributes.conversion_required);
      this.Form.controls['conversion_factor'].setValue(this.defaults.data.attributes.conversion_factor);
      this.Form.controls['ghg_value'].setValue(this.defaults.data.attributes.ghg_value);
      this.Form.controls['emission_factor'].setValue(this.defaults.data.attributes.emission_factor);
      this.Form.controls['setId'].setValue(this.defaults.data.id);
      this.Form.controls['consumption_category'].setValue(this.defaults.data.attributes.consumption_category);
      this.Form.controls['category'].setValue(this.defaults.data.attributes.category);
      this.Form.controls['source'].setValue(this.defaults.data.attributes.source);
      this.Form.controls['reference'].setValue(this.defaults.reference);
      this.Form.controls['unit'].setValue(this.defaults.data.attributes.unit);
      this.Form.controls['unit'].disable();
      this.Form.controls['latest_test'].setValue(this.defaults.data.attributes.latest_test)
      this.Form.controls['monitoring_frequency'].setValue(this.defaults.data.attributes.monitoring_frequency)
      this.Form.controls['legal_emission_limit'].setValue(this.defaults.data.attributes.legal_emission_limit)
      this.Form.controls['waste_type'].setValue(this.defaults.data.attributes.waste_type);
            
      this.Form.controls['control_device'].setValue(this.defaults.data.attributes.control_device)
      this.Form.controls['source_capacity'].setValue(this.defaults.data.attributes.source_capacity)
      this.Form.controls['quantity'].setValue(this.defaults.data.attributes.quantity);
      this.Form.controls['emission_factor'].setValue(this.defaults.data.attributes.emission_factor);
      this.Form.controls['ghg_value'].setValue(this.defaults.data.attributes.ghg_value);
      this.Form.controls['conversion_factor'].setValue(this.defaults.data.attributes.conversion_factor);
      this.Form.controls['conversion_value'].setValue(this.defaults.data.attributes.conversion_value);
      this.Form.controls['amount'].setValue(this.defaults.data.attributes.amount);
      this.Form.controls['scope'].setValue(this.defaults.data.attributes.scope);
      this.Form.controls['scope_1_cateogry'].setValue(this.defaults.data.attributes.scope_1_cateogry);
      // this.Form.controls['add_meter'].setValue(this.defaults.data.attributes.add_meter);
      if (this.defaults.data.attributes.scope !== 'Scope-1') {
        this.Form.controls['scope_1_cateogry'].removeValidators(Validators.required)
        this.Form.controls['scope_1_cateogry'].updateValueAndValidity();
      }
      else {
        this.Form.controls['scope_1_cateogry'].setValidators(Validators.required)
        this.Form.controls['scope_1_cateogry'].updateValueAndValidity();
      }
      this.Form.controls['renewable_energy_source'].setValue(this.defaults.data?.attributes.renewable_energy_source);


      if (this.defaults.data?.attributes?.renewable_energy_source) {
        this.renewable = true
      }
      this.Form.controls['source_type'].setValue(this.defaults.data.attributes.source_type);
      this.Form.controls['volumetric_flow_rate'].setValue(this.defaults.data.attributes.volumetric_flow_rate);
      this.Form.controls['operation_time'].setValue(this.defaults.data.attributes.operation_time);
      this.Form.controls['testing_organization'].setValue(this.defaults.data.attributes.testing_organization);
      this.Form.controls['compliance_status'].setValue(this.defaults.data.attributes.compliance_status);
      
      this.Form.controls['description'].setValue(this.defaults.data.attributes.description);
      this.Form.controls['treatment'].setValue(this.defaults.data.attributes.treatment);
      this.Form.controls['water_type'].setValue(this.defaults.data.attributes.water_type);
      this.Form.controls['collected_from'].setValue(this.defaults.data.attributes.collected_from);
      this.collectedFrom.setValue(this.defaults.data.attributes.collected_from);
      this.Form.controls['collected_to'].setValue(this.defaults.data.attributes.collected_to);
      this.collectedTo.setValue(this.defaults.data.attributes.collected_to)
      this.Form.controls['disposal_method'].setValue(this.defaults.data.attributes.disposal_method);
      this.Form.controls['disposal_date'].setValue(this.defaults.data.attributes.disposal_date);
      this.Form.controls['consignment_number'].setValue(this.defaults.data.attributes.consignment_number);
      this.Form.controls['disposer'].setValue(this.defaults.data.attributes.disposer);
      this.Form.controls['carrier'].setValue(this.defaults.data.attributes.carrier);
      this.Form.controls['disposal_place'].setValue(this.defaults.data.attributes.disposal_place);
      this.Form.controls['pollutants_emitted'].setValue(this.defaults.data.attributes.pollutants_emitted);
      // this.Form.controls['pollutants_emitted'].disable();
      this.Form.controls['concentration'].setValue(this.defaults.data.attributes.concentration);
      this.Form.controls['determined_by'].setValue(this.defaults.data.attributes.determined_by);
      this.Form.controls['meter_reading'].setValue(this.defaults.data.attributes.meter_reading);
      this.Form.controls['quantity_source'].setValue(this.defaults.data.attributes.quantity_source);
      this.Form.controls['refrigerant_type'].setValue(this.defaults.data.attributes.refrigerant_type)
      this.refrigerantType.setValue(this.defaults.data.attributes.refrigerant_type)
      this.Form.controls['applicability'].setValue(this.defaults.data.attributes.applicability)
      this.Form.controls['usage_type'].setValue(this.defaults.data.attributes.usage_type)

      this.Form.controls['opening_balance'].setValue(this.defaults.data.attributes.opening_balance)
      this.Form.controls['purchased_quantity'].setValue(this.defaults.data.attributes.purchased_quantity)
      this.Form.controls['purchase_date'].setValue(this.defaults.data.attributes.purchase_date)
      this.Form.controls['supplier_name'].setValue(this.defaults.data.attributes.supplier_name)
      this.Form.controls['stock_balance'].setValue(this.defaults.data.attributes.stock_balance)
      this.Form.controls['add_issue'].setValue(this.defaults.data.attributes.add_issue)


      this.Form.controls['treatment_outcome'].setValue(this.defaults.data.attributes.treatment_outcome)
      this.Form.controls['treatment'].setValue(this.defaults.data.attributes.treatment)
      this.Form.controls['rec_status'].setValue(this.defaults.data.attributes.rec_status)
      this.Form.controls['rec_type'].setValue(this.defaults.data.attributes.rec_type)
      this.Form.controls['i_rec_quantity'].setValue(this.defaults.data.attributes.i_rec_quantity)
      const defaultValues = this.defaults.data.attributes.applicability?.split(',').map((value: string) => value.trim());
      this.applicability.setValue(defaultValues);

      const TreatmentOutcomeValues = this.defaults.data.attributes.treatment_outcome?.split(',').map((value: string) => value.trim());
      this.Treatment_outcome.setValue(TreatmentOutcomeValues);
      this.selectedOutcomes = TreatmentOutcomeValues
      this.Form.controls['reused_recycled_quantity'].setValue(this.defaults.data.attributes.reused_recycled_quantity)
      this.Form.controls['treatment_outcome_recycled'].setValue(this.defaults.data.attributes.treatment_outcome_recycled)
      this.Form.controls['treatment_outcome_reused'].setValue(this.defaults.data.attributes.treatment_outcome_reused)
      this.Form.controls['id'].setValue(this.defaults.data.id);
      this.latesttest.setValue(new Date(this.defaults.data.attributes.latest_test))

      if (this.defaults.data.attributes.disposal_date != null) {
        this.disposalDate.setValue(
          new Date(this.defaults.data.attributes.disposal_date)
        );
      }

      this.evidenceData = this.defaults.data.attributes.evidences.data;

      // if (this.evidenceData.length) {
      if (this.evidenceData) {
        this.Form.controls['evidence'].setValue('OK');
      } else {
        this.Form.controls['evidence'].reset();
      }
      if (this.Form.value.consumption_category === 'Air Emission') {
        this.Form.controls['unit'].enable();

      }
      const evidence__data = this.defaults.data.attributes.evidences.data;
      if (evidence__data) {
        evidence__data.forEach((evidance: any) => {
          this.Form.controls['evidence_id'].setValue(evidance.id);
          let evidance_id = evidance.id
          this.generalService.getImage(environment.client_backend + '/uploads/' + evidance.attributes.evidence_name + '.' + evidance.attributes.format)
            .subscribe((data: any) => {


              let combinedFile = {
                id: evidance_id,
                size: data.size,
                type: data.type,
                blob: data,
                name: evidance.attributes.evidence_name
              };
              this.consumptionFile.push(combinedFile);

              this.files.push(data);
            });

        });
      }

      if (this.defaults.data?.attributes?.usage_type) {
        const string = this.defaults?.data?.attributes?.usage_type;

        const array = string
          .split(",") // Split by comma
          .map((val: string) => val.trim()) // Trim spaces from each value
          .filter((val: string) => val !== "");

        this.usageType.setValue(array);
      }


      this.IssueList = this.defaults.data?.attributes?.environment_issues?.data;
      // if (issuedData) {
      //   issuedData.forEach((item: any) => {
      //     this.IssueList.push(item)
      //   })
      // }

      if (this.defaults.data?.attributes?.environment_refrigerants?.data?.length > 0) {
        this.environmentService.get_environment_refrigerant(this.consID).subscribe({
          next: (result: any) => {
            if (result.data) {
              this.refrigerants = []
              result.data.map((item: any) => {
                const attr = item.attributes;
                const equipmentName = attr.equipment?.data?.attributes?.equipment_name || null;

                this.refrigerants.push({
                  id: item.id,
                  equipment_name: equipmentName,
                  equipment: attr.equipment?.data?.id,
                  quantity: attr.quantity,
                  unit: attr.unit,
                  refill_date: attr.refill_date
                });
              });


              if (this.refrigerants.length > 0) {
                const totalQuantity = this.refrigerants.reduce((sum, item) => sum + Number(item?.quantity), 0);
                this.Form.controls['quantity']?.setValue(totalQuantity);
              }

            }
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })
      }

      this.onCheckValidation(this.defaults.data.attributes.consumption_category)
      this.get_dropdown_values()
      this.get_testing_organizations()
      this.get_supplier()
    }

    this.Form.get('volumetric_flow_rate')?.valueChanges.subscribe(value => {
      const operationTimeControl = this.Form.get('operation_time');

      if (value !== null && value !== '' && value !== undefined) {
        operationTimeControl?.setValidators([Validators.required]);
      } else {
        operationTimeControl?.clearValidators();
      }
      operationTimeControl?.updateValueAndValidity();
    });

    this.Form.valueChanges.subscribe(values => {
      if (values.source === 'Refrigerants') {
        const opening = Number(values.opening_balance) || 0;
        const purchased = Number(values.purchased_quantity) || 0;
        const usage = Number(values.quantity) || 0;
        const stock = opening + purchased - usage;

        // this.Form.controls['stock_balance'].setValue(stock)
        this.Form.patchValue({ stock_balance: stock }, { emitEvent: false });
      }
    });

    if (this.Form.value.consumption_category === 'Energy' && this.Form.value.emission_factor) {
      this.Form.controls['scope'].setValidators([Validators.required])
    } else if (this.Form.value.consumption_category === 'Energy' && !this.Form.value.emission_factor) {
      this.Form.controls['scope'].removeValidators(Validators.required)

    }
    this.Form.controls['scope'].updateValueAndValidity();

    //this.Form.controls['consumption_category'].disable();
    //this.Form.controls['source'].disable();


    //this.refrigerantTypeIntial()
    this.refrigerantType.disable()


  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {

        this.userId = result.profile.id
      },
      error: (err: any) => {
      },
      complete: () => {
        this.get_supplier()
      }
    })
  }

  ScopeChange(data: any) {
    this.Form.controls['scope'].setValue(data.value);

    if (data.value === 'Scope-1') {
      this.Form.controls['scope_1_cateogry'].setValidators(Validators.required);
      this.Form.controls['scope_1_cateogry'].updateValueAndValidity();
    } else {
      this.Form.controls['scope_1_cateogry'].reset();
      this.Form.controls['scope_1_cateogry'].removeValidators(Validators.required);
      this.Form.controls['scope_1_cateogry'].updateValueAndValidity();
    }

  }

  get_dropdown_values() {
    const module = 'Environment';
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.DropDownValues = result.data;

        const sourceData = this.DropDownValues.filter(function (elem: any) {
          return elem.attributes.Category === 'REC Type';
        });
        this.recDataList = sourceData;
        const usageType = this.DropDownValues.filter(function (elem: any) {
          return elem.attributes.Module === 'Environment' && elem.attributes.Category === 'Usage Type';
        });
        this.usageTypeList = usageType;
      },
      error: (err: any) => { },
      complete: () => {
        this.get_consumption_dropdown_values()
      },
    });
  }
  get_consumption_dropdown_values() {
    const module = "Environment"
    this.environmentService.get_consumption_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.consumptionDropDownValues = result.data
        const pollutantsData = this.consumptionDropDownValues.filter(function (elem: any) {
          return (elem.attributes.Category === 'Pollutants Emitted')
        })

        this.pollutantsEmitted = pollutantsData
        this.units = this.pollutantsEmitted.map(
          (pollutant) => pollutant.attributes.unit
        );
      },
      error: (err: any) => { },
      complete: () => {
        const source = this.Form.value.source
        const consumptionCategory = this.Form.value.consumption_category


        const renewable = this.consumptionDropDownValues.filter(function (elem: any) {

          return (elem.attributes.Value === source && elem.attributes.renewable)
        })

        const sourceTypeData = this.consumptionDropDownValues.filter(function (elem: any) {
          return elem.attributes.Category === 'Source Type';
        });
        this.source_type = sourceTypeData;


        if (renewable.length !== 0 && consumptionCategory === 'Energy') {

          const renewableEnergySources = this.DropDownValues.filter(function (elem: any) {
            return elem.attributes.Category === 'Renewable Energy Source';
          });
          this.renewableEnergySources = renewableEnergySources;
          this.renewable = true
          this.Form.controls['renewable_energy_source'].setValidators([Validators.required])
          this.Form.controls['renewable_energy_source'].updateValueAndValidity();

        } else {
          this.Form.controls['renewable_energy_source'].reset()
        }

        this.consumption_category();
        this.sourceData();
        this.scope()
        this.scope_1_category()
        this.methodData()
        this.methodTracking()
        //this.refriData()
        this.treatmentData()
        this.categoryData()
        this.waterData()
        this.disposalData()
        this.treatmentOutcome()
        this.applicabilityData()
        this.pollutantsData()
        this.get_waste_types()
      }
    })


  }

  get_supplier() {
    this.environmentService.get_supplier().subscribe({
      next: (result: any) => {
        this.supplierList = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_refrigerant(consID: any) {
    this.environmentService.get_environment_refrigerant(consID).subscribe({
      next: (result: any) => {
        this.refrigerants = []
        result.data.map((item: any) => {
          const attr = item.attributes;
          const equipmentName = attr.equipment?.data?.attributes?.equipment_name || null;

          this.refrigerants.push({
            id: item.id,
            equipment_name: equipmentName,
            equipment: attr.equipment?.data?.id,
            quantity: attr.quantity,
            unit: attr.unit,
            refill_date: attr.refill_date
          });
        });


        if (this.refrigerants.length > 0) {
          const totalQuantity = this.refrigerants.reduce((sum, item) => sum + Number(item?.quantity), 0);
          this.Form.controls['quantity']?.setValue(totalQuantity);
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_envIssues(consID: any) {
    this.environmentService.get_envIssues(consID).subscribe({
      next: (result: any) => {
        this.IssueList = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_all_consumption_details() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const division = this.defaults.environmentService.selectedDivision

    this.environmentService.getConsumptionByYear(this.defaults.environmentService.selectedYear, division).subscribe({
      next: (result: any) => {
        const filtered = result.data.filter((data: any) => this.filterParticular(data));
        
        const lastValue = filtered[filtered.length - 1];
        const openingBalance = lastValue?.attributes?.stock_balance;
        this.Form.controls['opening_balance'].setValue(openingBalance)
      },
      error: (err) => console.error("Error fetching data", err)
    });
  }

  filterParticular(value: any) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const itemMonth = value.attributes?.month;
    const currentMonth = this.defaults.environmentService.selectedMonth;
    const division = this.defaults.environmentService.selectedDivision

    return (
      months.indexOf(itemMonth) < months.indexOf(currentMonth) &&
      value.attributes?.stock_balance != null
    );
  }


  consumption_category() {
    const data = this.DropDownValues.filter(function (elem: any) {
      return elem.attributes.Category === 'Consumption Category';
    });
    this.consumCategory = data;
    this.totalCatCount = this.consumCategory.length;
    if (this.defaults.length > 0) {
      const catdata = '' + this.defaults[0].pending_consumption + '';
      var catVal = catdata;
      var str_array = catVal.split(',');
      let cData: any[] = [];
      str_array.forEach((elem) => {
        cData.push(elem);
      });
      this.conCategory = cData;
    } else {
      data.forEach((elem) => {
        this.conCategory.push(elem.attributes.Value);
      });
    }
  }
  Unit(event: any) {
    this.Form.controls['unit'].setValue(event.value.toString())
  }
  refrigerantVal(data: any) {
    this.Form.controls['refrigerant_type'].setValue(data)
    const sourceData = this.DropDownValues.filter(function (elem: any) {
      return (elem.attributes.Value === data)
    })



    this.Form.controls['emission_factor'].setValue(sourceData[0].attributes.emission_factor)
    this.Form.controls['unit'].setValue(sourceData[0].attributes.unit)


  }

  UsageType(event: any) {
    const selectedValues = event.value.join(', '); // Join values with a comma and space
    this.Form.controls['usage_type'].setValue(selectedValues);
  }



  refrigerantTypeIntial() {
    this.filteredRefrigerantOptions = this.refrigerantType.valueChanges.pipe(
      startWith(''),
      map(value => {

        const name = typeof value === 'string' ? value : '';

        const isValid = this.refrigerantTypes.some((data: string) => data === this.refrigerantType.value);

        if (!isValid) {
          this.refrigerantType.setErrors({ invalidRefrigerant: true });
          this.Form.controls['refrigerant_type'].setErrors({ invalidRefrigerant: true })
        } else {
          this.refrigerantType.setErrors(null); // Clear errors if valid
          this.Form.controls['refrigerant_type'].setErrors(null)
        }

        return name ? this._filter(name as string) : this.refrigerantTypes.slice();


      }),


    );
  }

  get_waste_types() {
    this.environmentService.get_waste_type().subscribe({
      next: (result: any) => {
        this.wasteTypes = result.data
      }
    })
  }
  ChangeWasteType(event:any){
    const selectedValue = event.value
        const filteredCategory=this.wasteTypes.filter((data:any)=>{
      return data.attributes.type.toLowerCase()==selectedValue.toLowerCase()
    })
    this.Form.controls['category'].setValue(filteredCategory[0].attributes.category)
  }

   new_waste_type(){
      this.dialog.open(CreateWasteTypeComponent,{
        data:{
          categories:this.categories
        }
      }).afterClosed().subscribe((data: any) => {
        this.environmentService.create_waste_type(data,this.userId).subscribe({
          next: (result: any) => {
            this.wasteTypes = result.data          
            this.get_waste_types()
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"]);
          },
          complete: () => {}
        })
      })
    }



  refriData() {


    // this.refrigerantTypes = [];
    const refri_data = this.DropDownValues.filter(function (elem: any) {
      return elem.attributes.Category === 'Refrigerant Type';
    });
    // this.refrigerantTypes = refri_data;
    this.refrigerantTypes = refri_data.map(data => (data.attributes.Value));


  }
  private _filter(name: string) {
    const filterValue = name.toLowerCase();

    return this.refrigerantTypes.filter(option => option.toLowerCase().includes(filterValue));

  }

  disposalData() {
    this.disposalMethod = [];
    const dis_data = this.DropDownValues.filter(function (elem: any) {
      return elem.attributes.Category === 'Disposal Method';
    });
    this.disposalMethod = dis_data;
  }

  waterData() {
    this.watertypes = [];
    const water_data = this.DropDownValues.filter(function (elem: any) {
      return elem.attributes.Category === 'Water Type';
    });
    this.watertypes = water_data;
  }

  sourceData() {
    this.source = [];
    const source_data = this.consumptionDropDownValues.filter((elem: any) => {
      return (elem.attributes.Category === 'Source' && elem.attributes.filter === this.Form.value.consumption_category);
    });
    this.source = source_data;
  }

  treatmentData() {
    this.treatment = [];
    const treatment_data = this.DropDownValues.filter(function (elem: any) {
      return elem.attributes.Category === 'Treatment Where';
    });
    this.treatment = treatment_data;
  }

  methodData() {
    this.quantities = [];
    const source_data = this.DropDownValues.filter((elem: any) => {
      return (elem.attributes.Category === 'Quantity Source' && elem.attributes.filter !== 'Waste');
    });
    this.quantities = source_data;
  }
  methodTracking() {
    this.wasteQuantities = [];
    const source_data = this.DropDownValues.filter((elem: any) => {
      return (elem.attributes.Category === 'Quantity Source' && elem.attributes.filter === this.Form.value.consumption_category);
    });
    this.wasteQuantities = source_data;
  }
  categoryData() {
    this.categories = [];
    const category = this.DropDownValues.filter(function (elem: any) {
      return elem.attributes.Category === 'Category';
    });
    this.categories = category;
  }
  scope() {
    this.scopes = [];
    const scope_data = this.DropDownValues.filter(function (elem: any) {
      return elem.attributes.Category === 'Scope';
    });
    this.scopes = scope_data;
  }
  scope_1_category() {
    this.scopes1categories = [];
    const scope1Data = this.DropDownValues.filter(function (elem: any) {
      return (elem.attributes.Category === 'Scope 1 Category')
    })
    this.scopes1categories = scope1Data
  }
  applicabilityData() {
    this.applicabilities = [];
    const applicability_data = this.DropDownValues.filter(function (elem: any) {
      return elem.attributes.Category === 'Applicability';
    });
    this.applicabilities = applicability_data;
  if(this.Form.value.consumption_category == 'Water'){
    const filter = this.applicabilities.filter(function (elem: any) {
      return (elem.attributes.Value !== 'Domestic' && elem.attributes.Value !== "Production")
    })
    this.filteredApplicabilities = filter
}
  }

  pollutantsData() {
    this.pollutants = [];
    const pollutants_data = this.consumptionDropDownValues.filter(function (elem: any) {
      return elem.attributes.Category === 'Pollutants Emitted';
    });
    this.pollutants = pollutants_data;
  }

  treatmentOutcome() {
    this.treatmentOutcomes = [];
    const treatment_outcome_data = this.DropDownValues.filter(function (elem: any) {
      return elem.attributes.Category === 'Treatment Outcome';
    });
    this.treatmentOutcomes = treatment_outcome_data;
  }

  get_consumption_details() {
    this.files = [];
    this.Newfiles = [];
    this.consumptionFile = [];

    this.environmentService.get_consumption_details(this.consID).subscribe({
      next: (result: any) => {
        this.evidenceData = result.data[0].attributes.evidences.data;
        if (this.evidenceData?.length) {
          this.Form.controls['evidence'].setValue('OK');
        } else {
          this.Form.controls['evidence'].reset();
        }

        const evidence_data = result.data[0].attributes.evidences.data;
        if (evidence_data) {
          evidence_data.forEach((evidence: any) => {
            this.Form.controls['evidence_id'].setValue(evidence.id);
            let evidence_id = evidence.id;

            // Check if the evidence is already in the consumptionFile
            if (!this.consumptionFile.some(file => file.id === evidence_id)) {
              this.generalService
                .getImage(
                  environment.client_backend +
                  '/uploads/' +
                  evidence.attributes.evidence_name +
                  '.' +
                  evidence.attributes.format
                )
                .subscribe((data: any) => {
                  let combinedFile = {
                    id: evidence_id,
                    size: data.size,
                    type: data.type,
                    blob: data,
                    name: evidence.attributes.evidence_name
                  };

                  this.consumptionFile.push(combinedFile);
                  this.files.push(data);

                });
            }
          });
        }

        this.IssueList = this.defaults?.data?.attributes?.environment_issues?.data;

        if (this.defaults?.data?.attributes?.environment_refrigerants?.length > 0) {
          this.get_refrigerant(this.defaults.data.id)
        }
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }
  // onSelect(event: any) {
  //   const fileLength = this.files.length;
  //   const addedLength = event.addedFiles.length;
  //   if (fileLength === 0 && addedLength < 2) {
  //     const size = event.addedFiles[0].size / 1024 / 1024;
  //     if (size > 2) {
  //       const statusText = 'Please choose an image below 2 MB';
  //       this._snackBar.open(statusText, 'Close Warning', {
  //         horizontalPosition: this.horizontalPosition,
  //         verticalPosition: this.verticalPosition,
  //       });
  //     } else {
  //       var fileTypes = ['jpg', 'jpeg', 'png'];
  //       var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
  //         isSuccess = fileTypes.indexOf(extension) > -1;
  //       if (isSuccess) {
  //         this.files.push(...event.addedFiles);
  //         this.upload_evidence();
  //       } else {
  //         const statusText = "Please choose images ('jpg', 'jpeg', 'png')";
  //         this._snackBar.open(statusText, 'Close Warning', {
  //           horizontalPosition: this.horizontalPosition,
  //           verticalPosition: this.verticalPosition,
  //         });
  //       }
  //     }
  //   } else if (fileLength < 2) {
  //     const statusText = 'You have exceed the upload limit';
  //     this._snackBar.open(statusText, 'Close Warning', {
  //       horizontalPosition: this.horizontalPosition,
  //       verticalPosition: this.verticalPosition,
  //     });
  //   }
  // }

  onSelect(event: any) {
    const currentFileCount = this.files.length;
    const addedFiles = event.addedFiles;
    const addedFileCount = addedFiles.length;
    const maxFilesAllowed = 6;


    let allFilesValid = true;

    for (let file of addedFiles) {
      const size = file.size / 1024 / 1024; // size in MB
      if (size > 10) {
        allFilesValid = false;
        const statusText = "Please choose an image below 10 MB";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        break;
      }

      const fileTypes = ['jpg', 'jpeg', 'png', 'pdf'];
      const extension = file.name.split('.').pop().toLowerCase();
      const isSuccess = fileTypes.indexOf(extension) > -1;
      if (!isSuccess) {
        allFilesValid = false;
        const statusText = "Please choose evidences ('jpg', 'jpeg', 'png','pdf')";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        break;
      }
    }

    if (allFilesValid) {
      this.Newfiles = []
      // this.Form.controls['evidence'].setErrors(null);
      this.files.push(...addedFiles);
      this.Newfiles.push(...addedFiles);
      // this.Form.controls['modified_evidence'].setValue('ok');
      // this.upload_image()
      this.upload_evidence();
    }

  }

  upload_evidence() {
    this.showProgressPopup();
    let uploadCount = 0;

    this.Newfiles.forEach((elem: any) => {
      this.evidenceFormData.delete('files');
      const extension = elem.name.split('.').pop().toLowerCase();
      this.evidenceFormData.append(
        'files',
        elem,
        this.Form.value.reference + '.' + extension
      );

      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = [];
          data.push({
            evidence_name: result[0].hash,
            format: extension,
            consumption: this.consID,
            id: result[0].id,
          });

          this.environmentService.create_env_evidence(data[0])
            .subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                uploadCount++;
                if (uploadCount === this.Newfiles.length) {
                  Swal.close();
                  const statusText = 'Evidence updated';
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.get_consumption_details();
                }
              },
            });
        },
        error: (err: any) => { },
        complete: () => { },
      });
    });
  }
  // onRemove(event: any) {
  //   this.showProgressPopup()
  //   this.environmentService.delete_consumption_evidence(this.Form.value.evidence_id).subscribe({
  //     next: (result: any) => {
  //       this.generalService.delete_image(result.data.attributes.image_id).subscribe({
  //         next: (result: any) => { },
  //         error: (err: any) => { },
  //         complete: () => {
  //           Swal.close()
  //           const statusText = "Evidence deleted"
  //           this._snackBar.open(statusText, 'Close Warning', {
  //             horizontalPosition: this.horizontalPosition,
  //             verticalPosition: this.verticalPosition,
  //           });
  //           this.get_consumption_details()
  //         }
  //       })
  //     },
  //     error: (err: any) => {
  //     },
  //     complete: () => {
  //     }
  //   })
  // }

  onRemove(event: any) {
    const index = this.consumptionFile.findIndex(file => file.id === event.id);

    this.consumptionFile.splice(index, 1);
    if (this.consumptionFile.length === 0) {
      this.Form.controls['evidence'].reset()
    }

    const documentId = this.evidenceData.find(file => file.id === event.id);
    if (documentId) {
      this.environmentService.delete_consumption_evidence(documentId.id).subscribe({
        next: (result: any) => {
          this.generalService.delete_image(result.data.attributes.image_id).subscribe({
            next: (result: any) => {
            },
            error: (err: any) => { },
            complete: () => {
              Swal.close()
              const statusText = "Evidence deleted"
              this._snackBar.open(statusText, 'Close Warning', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_consumption_details()
            }
          })
        },
        error: (err: any) => {
        },
        complete: () => {
        }
      })

    }
  }
  get_testing_organizations() {
    this.environmentService.get_testing_organizations().subscribe({
      next: (result: any) => {
        this.TestingOrganization = result.data
      }
    })
  }

  collFrom(date: any) {
    const selecteddate = new Date(date.value)
    this.collectedFrom.setValue(selecteddate);
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['collected_from'].setValue(selecteddate)
  }

  collTo(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)

    this.Form.controls['collected_to'].setValue(selecteddate);
  }

  disDate(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)

    this.Form.controls['disposal_date'].setValue(new Date(selecteddate));
  }
  latestTest(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)

    this.Form.controls['latest_test'].setValue(selecteddate)
  }
  kwhQuantity(data: any) {
    const status = this.Form.value.conversion_required
    const quantity = this.Form.value.quantity
    const conversion_factor = this.Form.value.conversion_factor
    const emissionFactor = this.Form.value.emission_factor
    if (this.Form.value.refrigerant_type) {

      const ghgValue = Number((Number(quantity) * Number(emissionFactor)) / 1000);
      const emissionValue = Number((Number(quantity) * Number(emissionFactor)) / 1000);


      this.Form.controls['emission_factor'].setValue(emissionFactor);
      this.Form.controls['quantity_kwh'].setValue(quantity)
      this.Form.controls['ghg_value'].setValue(ghgValue);
      this.Form.controls['emission_value'].setValue(emissionValue);
    }
    else {

      if (status === true) {
        const quantity_kwh = Math.round(Number(quantity) * Number(conversion_factor)).toFixed(0)
        this.Form.controls['quantity_kwh'].setValue(quantity_kwh)
        const emissionValue = Number((Number(quantity_kwh) * Number(emissionFactor)) / 1000)
        this.Form.controls['emission_value'].setValue(emissionValue)
        const ghgValue = (Number(Math.round(Number(quantity) * Number(emissionFactor)) / 1000)).toFixed(2) || 0
        const conversionValue = Number(Number(quantity) * Number(conversion_factor)).toFixed(0)
        this.Form.controls['ghg_value'].setValue(ghgValue)
        this.Form.controls['conversion_value'].setValue(conversionValue)
      } else {
        this.Form.controls['quantity_kwh'].setValue(quantity)
        const emissionValue = Number((Number(quantity) * Number(emissionFactor)) / 1000)
        this.Form.controls['emission_value'].setValue(emissionValue)
        const ghgValue = (Number(Math.round(Number(quantity) * Number(emissionFactor)) / 1000)).toFixed(2) || 0
        const conversionValue = Number(Number(quantity) * Number(conversion_factor)).toFixed(0)
        this.Form.controls['ghg_value'].setValue(ghgValue)
        this.Form.controls['conversion_value'].setValue(conversionValue)
      }
    }
  }



  onCheckValidation(data: any) {

    if (data === "Energy") {
      if (this.Form.value.source === 'Refrigerants') {
        this.Form.controls['category'].removeValidators(Validators.required)
        this.Form.controls['treatment'].removeValidators(Validators.required)
        this.Form.controls['collected_from'].removeValidators(Validators.required)
        this.Form.controls['collected_to'].removeValidators(Validators.required)
        this.Form.controls['waste_type'].removeValidators(Validators.required)
        this.Form.controls['disposal_method'].removeValidators(Validators.required)
        this.Form.controls['water_type'].removeValidators(Validators.required)
        this.Form.controls['control_device'].removeValidators(Validators.required)
        this.Form.controls['legal_emission_limit'].removeValidators(Validators.required)
        this.Form.controls['monitoring_frequency'].removeValidators(Validators.required)
        this.Form.controls['latest_test'].removeValidators(Validators.required)
        this.Form.controls['source_capacity'].removeValidators(Validators.required)
        this.Form.controls['disposal_place'].removeValidators(Validators.required)
        this.Form.controls['pollutants_emitted'].removeValidators(Validators.required)
        this.Form.controls['concentration'].removeValidators(Validators.required)
        this.Form.controls['determined_by'].removeValidators(Validators.required)
        this.Form.controls['treatment_outcome'].removeValidators(Validators.required)
        this.Form.controls['reused_recycled_quantity'].removeValidators(Validators.required)
        this.Form.controls['treatment_outcome_recycled'].removeValidators(Validators.required)
        this.Form.controls['treatment_outcome_reused'].removeValidators(Validators.required)
        this.Form.controls['applicability'].removeValidators(Validators.required)
      }
      else {
        this.Form.controls['category'].removeValidators(Validators.required)
        this.Form.controls['treatment'].removeValidators(Validators.required)
        this.Form.controls['collected_from'].removeValidators(Validators.required)
        this.Form.controls['collected_to'].removeValidators(Validators.required)
        this.Form.controls['waste_type'].removeValidators(Validators.required)
        this.Form.controls['disposal_method'].removeValidators(Validators.required)
        this.Form.controls['water_type'].removeValidators(Validators.required)
        this.Form.controls['control_device'].removeValidators(Validators.required)
        this.Form.controls['legal_emission_limit'].removeValidators(Validators.required)
        this.Form.controls['monitoring_frequency'].removeValidators(Validators.required)
        this.Form.controls['latest_test'].removeValidators(Validators.required)
        this.Form.controls['source_capacity'].removeValidators(Validators.required)
        this.Form.controls['disposal_place'].removeValidators(Validators.required)
        this.Form.controls['pollutants_emitted'].removeValidators(Validators.required)
        this.Form.controls['concentration'].removeValidators(Validators.required)
        this.Form.controls['determined_by'].removeValidators(Validators.required)
        this.Form.controls['treatment_outcome'].removeValidators(Validators.required)
        this.Form.controls['reused_recycled_quantity'].removeValidators(Validators.required)
        this.Form.controls['refrigerant_type'].removeValidators(Validators.required)
        this.Form.controls['applicability'].removeValidators(Validators.required)
        this.Form.controls['treatment_outcome_recycled'].removeValidators(Validators.required)
        this.Form.controls['treatment_outcome_reused'].removeValidators(Validators.required)

      }


    } else if (data === "Wastewater") {

      if (this.Form.value.source === 'Combined') {
        this.Form.controls['category'].removeValidators(Validators.required)
        this.Form.controls['scope'].removeValidators(Validators.required)
        this.Form.controls['collected_from'].removeValidators(Validators.required)
        this.Form.controls['collected_to'].removeValidators(Validators.required)
        this.Form.controls['waste_type'].removeValidators(Validators.required)
        this.Form.controls['disposal_method'].removeValidators(Validators.required)
        this.Form.controls['water_type'].removeValidators(Validators.required)
        this.Form.controls['control_device'].removeValidators(Validators.required)
        this.Form.controls['legal_emission_limit'].removeValidators(Validators.required)
        this.Form.controls['monitoring_frequency'].removeValidators(Validators.required)
        this.Form.controls['latest_test'].removeValidators(Validators.required)
        this.Form.controls['source_capacity'].removeValidators(Validators.required)
        this.Form.controls['disposal_place'].removeValidators(Validators.required)
        this.Form.controls['pollutants_emitted'].removeValidators(Validators.required)
        this.Form.controls['concentration'].removeValidators(Validators.required)
        this.Form.controls['determined_by'].removeValidators(Validators.required)
        this.Form.controls['meter_reading'].removeValidators(Validators.required)
        this.Form.controls['refrigerant_type'].removeValidators(Validators.required)
        this.Form.controls['treatment_outcome'].removeValidators(Validators.required)
        this.Form.controls['reused_recycled_quantity'].removeValidators(Validators.required)
        this.Form.controls['applicability'].removeValidators(Validators.required)
        this.Form.controls['treatment_outcome_recycled'].removeValidators(Validators.required)
        this.Form.controls['treatment_outcome_reused'].removeValidators(Validators.required)
      }
      else {
        this.Form.controls['category'].removeValidators(Validators.required)
        this.Form.controls['scope'].removeValidators(Validators.required)
        this.Form.controls['collected_from'].removeValidators(Validators.required)
        this.Form.controls['collected_to'].removeValidators(Validators.required)
        this.Form.controls['waste_type'].removeValidators(Validators.required)
        this.Form.controls['disposal_method'].removeValidators(Validators.required)
        this.Form.controls['water_type'].removeValidators(Validators.required)
        this.Form.controls['control_device'].removeValidators(Validators.required)
        this.Form.controls['legal_emission_limit'].removeValidators(Validators.required)
        this.Form.controls['monitoring_frequency'].removeValidators(Validators.required)
        this.Form.controls['latest_test'].removeValidators(Validators.required)
        this.Form.controls['source_capacity'].removeValidators(Validators.required)
        this.Form.controls['disposal_place'].removeValidators(Validators.required)
        this.Form.controls['pollutants_emitted'].removeValidators(Validators.required)
        this.Form.controls['concentration'].removeValidators(Validators.required)
        this.Form.controls['determined_by'].removeValidators(Validators.required)
        this.Form.controls['meter_reading'].removeValidators(Validators.required)
        this.Form.controls['refrigerant_type'].removeValidators(Validators.required)
      }

    } else if (data === "Waste") {
      this.Form.controls['scope'].removeValidators(Validators.required)
      this.Form.controls['treatment'].removeValidators(Validators.required)
      this.Form.controls['collected_from'].removeValidators(Validators.required)
      this.Form.controls['collected_to'].removeValidators(Validators.required)
      this.Form.controls['waste_type'].removeValidators(Validators.required)
      this.Form.controls['water_type'].removeValidators(Validators.required)
      this.Form.controls['control_device'].removeValidators(Validators.required)
      this.Form.controls['legal_emission_limit'].removeValidators(Validators.required)
      this.Form.controls['monitoring_frequency'].removeValidators(Validators.required)
      this.Form.controls['latest_test'].removeValidators(Validators.required)
      this.Form.controls['source_capacity'].removeValidators(Validators.required)
      this.Form.controls['pollutants_emitted'].removeValidators(Validators.required)
      this.Form.controls['concentration'].removeValidators(Validators.required)
      this.Form.controls['determined_by'].removeValidators(Validators.required)
      this.Form.controls['meter_reading'].removeValidators(Validators.required)
      this.Form.controls['refrigerant_type'].removeValidators(Validators.required)
      this.Form.controls['treatment_outcome'].removeValidators(Validators.required)
      this.Form.controls['reused_recycled_quantity'].removeValidators(Validators.required)
      this.Form.controls['applicability'].removeValidators(Validators.required)
      this.Form.controls['treatment_outcome_recycled'].removeValidators(Validators.required)
      this.Form.controls['treatment_outcome_reused'].removeValidators(Validators.required)


    } else if (data === "Water") {

      this.Form.controls['category'].removeValidators(Validators.required)
      this.Form.controls['scope'].removeValidators(Validators.required)
      this.Form.controls['treatment'].removeValidators(Validators.required)
      this.Form.controls['collected_from'].removeValidators(Validators.required)
      this.Form.controls['collected_to'].removeValidators(Validators.required)
      this.Form.controls['waste_type'].removeValidators(Validators.required)
      this.Form.controls['disposal_method'].removeValidators(Validators.required)
      this.Form.controls['control_device'].removeValidators(Validators.required)
      this.Form.controls['legal_emission_limit'].removeValidators(Validators.required)
      this.Form.controls['monitoring_frequency'].removeValidators(Validators.required)
      this.Form.controls['latest_test'].removeValidators(Validators.required)
      this.Form.controls['source_capacity'].removeValidators(Validators.required)
      this.Form.controls['disposal_place'].removeValidators(Validators.required)
      this.Form.controls['pollutants_emitted'].removeValidators(Validators.required)
      this.Form.controls['concentration'].removeValidators(Validators.required)
      this.Form.controls['determined_by'].removeValidators(Validators.required)
      this.Form.controls['refrigerant_type'].removeValidators(Validators.required)
      this.Form.controls['treatment_outcome'].removeValidators(Validators.required)
      this.Form.controls['reused_recycled_quantity'].removeValidators(Validators.required)
      this.Form.controls['treatment_outcome_recycled'].removeValidators(Validators.required)
      this.Form.controls['treatment_outcome_reused'].removeValidators(Validators.required)

    } else if (data === "Air Emission") {

      this.Form.controls['category'].removeValidators(Validators.required)
      this.Form.controls['amount'].removeValidators(Validators.required)
      this.Form.controls['scope'].removeValidators(Validators.required)
      this.Form.controls['treatment'].removeValidators(Validators.required)
      this.Form.controls['collected_from'].removeValidators(Validators.required)
      this.Form.controls['collected_to'].removeValidators(Validators.required)
      this.Form.controls['waste_type'].removeValidators(Validators.required)
      this.Form.controls['disposal_method'].removeValidators(Validators.required)
      this.Form.controls['water_type'].removeValidators(Validators.required)
      this.Form.controls['latest_test'].removeValidators(Validators.required)
      this.Form.controls['disposal_place'].removeValidators(Validators.required)
      this.Form.controls['meter_reading'].removeValidators(Validators.required)
      this.Form.controls['refrigerant_type'].removeValidators(Validators.required)
      this.Form.controls['treatment_outcome'].removeValidators(Validators.required)
      this.Form.controls['reused_recycled_quantity'].removeValidators(Validators.required)
      this.Form.controls['applicability'].removeValidators(Validators.required)
      this.Form.controls['treatment_outcome_recycled'].removeValidators(Validators.required)
      this.Form.controls['treatment_outcome_reused'].removeValidators(Validators.required)

    }

  }

  consCategory(data: any) {
    this.Form.controls['category'].reset()
    this.Form.controls['source'].reset()
    this.Form.controls['unit'].reset()
    this.Form.controls['quantity'].reset()
    this.Form.controls['amount'].reset()
    this.Form.controls['scope'].reset()
    this.Form.controls['description'].reset()
    this.Form.controls['treatment'].reset()
    this.Form.controls['collected_from'].reset()
    this.Form.controls['collected_to'].reset()
    this.Form.controls['waste_type'].reset()
    this.Form.controls['disposal_method'].reset()
    this.Form.controls['water_type'].reset()
    this.Form.controls['disposal_date'].reset()
    this.Form.controls['consignment_number'].reset()
    this.Form.controls['disposer'].reset()
    this.Form.controls['carrier'].reset()
    this.Form.controls['control_device'].reset()
    this.Form.controls['legal_emission_limit'].reset()
    this.Form.controls['monitoring_frequency'].reset()
    this.Form.controls['latest_test'].reset()
    this.latesttest.reset()
    this.Form.controls['source_capacity'].reset()
    this.Form.controls['disposal_place'].reset()
    this.Form.controls['pollutants_emitted'].reset()
    this.Form.controls['concentration'].reset()
    this.Form.controls['determined_by'].reset()
    this.Form.controls['meter_reading'].reset()
    this.Form.controls['refrigerant_type'].reset()
    this.Form.controls['treatment_outcome'].reset()
    this.Form.controls['reused_recycled_quantity'].reset()
    this.Form.controls['applicability'].reset()
    this.Form.controls['treatment_outcome_recycled'].reset()
    this.Form.controls['treatment_outcome_reused'].reset()
    this.Form.controls['opening_balance'].reset()
    this.Form.controls['purchased_quantity'].reset()
    this.Form.controls['purchase_date'].reset()
    this.Form.controls['supplier_name'].reset()
    this.Form.controls['stock_balance'].reset()
    this.Form.controls['add_issue'].reset()
    const sourceData = this.consumptionDropDownValues.filter(function (elem: any) {
      return (elem.attributes.filter === data.value && elem.attributes.Category !== 'Quantity Source' && elem.attributes.Category !== 'Unit')
    })

    this.source = sourceData
    if (data.value === "Energy") {
      this.Form.controls['category'].setErrors(null)
      this.Form.controls['treatment'].setErrors(null)
      this.Form.controls['collected_from'].setErrors(null)
      this.Form.controls['collected_to'].setErrors(null)
      this.Form.controls['waste_type'].setErrors(null)
      this.Form.controls['disposal_method'].setErrors(null)
      this.Form.controls['water_type'].setErrors(null)
      this.Form.controls['disposal_date'].setErrors(null)
      this.Form.controls['consignment_number'].setErrors(null)
      this.Form.controls['disposer'].setErrors(null)
      this.Form.controls['carrier'].setErrors(null)
      this.Form.controls['disposal_place'].setErrors(null)
      this.Form.controls['pollutants_emitted'].setErrors(null)
      this.Form.controls['concentration'].setErrors(null)
      this.Form.controls['determined_by'].setErrors(null)
      this.Form.controls['source_capacity'].setErrors(null)
      this.Form.controls['legal_emission_limit'].setErrors(null)
      this.Form.controls['control_device'].setErrors(null)
      this.Form.controls['latest_test'].setErrors(null)
      this.Form.controls['monitoring_frequency'].setErrors(null)
      this.Form.controls['source_capacity'].setErrors(null)
      this.Form.controls['treatment_outcome'].setErrors(null)
      this.Form.controls['reused_recycled_quantity'].setErrors(null)
      this.Form.controls['applicability'].setErrors(null)

      this.Form.controls['treatment_outcome_recycled'].setErrors(null)
      this.Form.controls['treatment_outcome_reused'].setErrors(null)
      const scopeData = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Scope')
      }
      )
      this.scopes = scopeData
      const refrigerantData = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Refrigerant Type')
      })
      this.refrigerantTypes = refrigerantData

    } else if (data.value === "Wastewater") {
      this.Form.controls['scope'].setErrors(null)
      this.Form.controls['category'].setErrors(null)
      this.Form.controls['collected_from'].setErrors(null)
      this.Form.controls['collected_to'].setErrors(null)
      this.Form.controls['waste_type'].setErrors(null)
      this.Form.controls['disposal_method'].setErrors(null)
      this.Form.controls['water_type'].setErrors(null)
      this.Form.controls['disposal_date'].setErrors(null)
      this.Form.controls['consignment_number'].setErrors(null)
      this.Form.controls['disposer'].setErrors(null)
      this.Form.controls['carrier'].setErrors(null)
      this.Form.controls['legal_emission_limit'].setErrors(null)
      this.Form.controls['control_device'].setErrors(null)
      this.Form.controls['latest_test'].setErrors(null)
      this.Form.controls['monitoring_frequency'].setErrors(null)
      this.Form.controls['source_capacity'].setErrors(null)
      this.Form.controls['disposal_place'].setErrors(null)
      this.Form.controls['pollutants_emitted'].setErrors(null)
      this.Form.controls['concentration'].setErrors(null)
      this.Form.controls['determined_by'].setErrors(null)
      this.Form.controls['refrigerant_type'].setErrors(null)
      this.Form.controls['meter_reading'].setErrors(null)
      const treatmentData = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Treatment Where')
      })
      this.treatment = treatmentData
      const treatOutcomeData = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Treatment Outcome')
      })
      this.treatmentOutcomes = treatOutcomeData
      const applicabilityData = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Applicability')
      })
      this.applicabilities = applicabilityData

    } else if (data.value === "Waste") {
      this.Form.controls['scope'].setErrors(null)
      this.Form.controls['treatment'].setErrors(null)
      this.Form.controls['pollutants_emitted'].setErrors(null)
      this.Form.controls['concentration'].setErrors(null)
      this.Form.controls['determined_by'].setErrors(null)
      this.Form.controls['meter_reading'].setErrors(null)
      this.Form.controls['refrigerant_type'].setErrors(null)
      this.Form.controls['water_type'].setErrors(null)
      this.Form.controls['legal_emission_limit'].setErrors(null)
      this.Form.controls['control_device'].setErrors(null)
      this.Form.controls['latest_test'].setErrors(null)
      this.Form.controls['monitoring_frequency'].setErrors(null)
      this.Form.controls['source_capacity'].setErrors(null)
      this.Form.controls['treatment_outcome'].setErrors(null)
      this.Form.controls['reused_recycled_quantity'].setErrors(null)
      this.Form.controls['applicability'].setErrors(null)
      this.Form.controls['treatment_outcome_recycled'].setErrors(null)
      this.Form.controls['treatment_outcome_reused'].setErrors(null)
      const cateData = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Category')
      })
      this.categories = cateData

      const disMethData = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Disposal Method')
      })
      this.disposalMethod = disMethData
      const methodTracking = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Quantity Source' && elem.attributes.filter === 'Waste')
      })
      this.wasteQuantities = methodTracking

    } else if (data.value === "Water") {
      this.Form.controls['scope'].setErrors(null)
      this.Form.controls['category'].setErrors(null)
      this.Form.controls['treatment'].setErrors(null)
      this.Form.controls['collected_from'].setErrors(null)
      this.Form.controls['collected_to'].setErrors(null)
      this.Form.controls['waste_type'].setErrors(null)
      this.Form.controls['disposal_method'].setErrors(null)
      this.Form.controls['disposal_date'].setErrors(null)
      this.Form.controls['consignment_number'].setErrors(null)
      this.Form.controls['disposer'].setErrors(null)
      this.Form.controls['carrier'].setErrors(null)
      this.Form.controls['legal_emission_limit'].setErrors(null)
      this.Form.controls['control_device'].setErrors(null)
      this.Form.controls['latest_test'].setErrors(null)
      this.Form.controls['monitoring_frequency'].setErrors(null)
      this.Form.controls['source_capacity'].setErrors(null)
      this.Form.controls['disposal_place'].setErrors(null)
      this.Form.controls['pollutants_emitted'].setErrors(null)
      this.Form.controls['concentration'].setErrors(null)
      this.Form.controls['determined_by'].setErrors(null)
      this.Form.controls['refrigerant_type'].setErrors(null)
      this.Form.controls['treatment_outcome'].setErrors(null)
      this.Form.controls['reused_recycled_quantity'].setErrors(null)
      this.Form.controls['applicability'].setErrors(null)
      this.Form.controls['treatment_outcome_recycled'].setErrors(null)
      this.Form.controls['treatment_outcome_reused'].setErrors(null)
      const waterType = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Water Type')
      })
      this.watertypes = waterType
      const applicabilityData = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Applicability')
      })
      this.applicabilities = applicabilityData
      console.log("app",this.applicabilities);
      
         const filter = this.applicabilities.filter(function (elem: any) {
      return (elem.attributes.Value !== 'Domestic' && elem.attributes.Value !== "Production")
    })
    console.log("FILTER",filter);
    this.filteredApplicabilities = filter
   
    } else if (data.value === "Air Emission") {
      this.Form.controls['unit'].setErrors(null)
      this.Form.controls['quantity'].setErrors(null)
      this.Form.controls['scope'].setErrors(null)
      this.Form.controls['category'].setErrors(null)
      this.Form.controls['treatment'].setErrors(null)
      this.Form.controls['collected_from'].setErrors(null)
      this.Form.controls['collected_to'].setErrors(null)
      this.Form.controls['waste_type'].setErrors(null)
      this.Form.controls['disposal_method'].setErrors(null)
      this.Form.controls['water_type'].setErrors(null)
      this.Form.controls['disposal_date'].setErrors(null)
      this.Form.controls['consignment_number'].setErrors(null)
      this.Form.controls['disposer'].setErrors(null)
      this.Form.controls['meter_reading'].setErrors(null)
      this.Form.controls['carrier'].setErrors(null)
      this.Form.controls['disposal_place'].setErrors(null)
      this.Form.controls['refrigerant_type'].setErrors(null)
      this.Form.controls['treatment_outcome'].setErrors(null)
      this.Form.controls['reused_recycled_quantity'].setErrors(null)
      this.Form.controls['applicability'].setErrors(null)
      this.Form.controls['amount'].setErrors(null)
      this.Form.controls['control_device'].setValue(false)
      this.Form.controls['treatment_outcome_recycled'].setErrors(null)
      this.Form.controls['treatment_outcome_reused'].setErrors(null)
      const pollutantsData = this.consumptionDropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Pollutants Emitted')
      })

      this.pollutants = pollutantsData
    }
    const quantity = this.DropDownValues.filter(function (elem: any) {
      return (elem.attributes.Category === 'Quantity Source' && elem.attributes.filter !== 'Waste')
    })
    this.quantities = quantity
  }


  sourceVal(data: any) {
    const category = this.Form.value.consumption_category
    const existData = this.defaults.filter(function (elem: any) {
      return (elem.consumption_category === category && elem.source === data.value)
    })
    if (existData.length > 0) {
      Swal.fire({
        title: 'Duplicate Source Detected',
        imageUrl: 'assets/images/confirm.gif',
        imageWidth: 250,
        text:
          'You have already added the selected source consumption. Please choose another source to continue.',
        showCancelButton: true,
        confirmButtonText: 'Accept to Proceed',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (!result.isConfirmed) {
          this.Form.reset();
        }
        else {
          if (data.value !== 'Refrigerants' && this.Form.value.consumption_category !== 'Air Emission') {
            const unit = this.consumptionDropDownValues.filter(function (elem: any) {
              return (elem.attributes.Value === data.value && elem.attributes.Category === 'Source')
            })
            this.Form.controls['unit'].setValue(unit[0].attributes.unit)
            this.Form.controls['emission_factor'].setValue(unit[0].attributes.emission_factor)
            this.Form.controls['conversion_factor'].setValue(unit[0].attributes.conversion_factor)
            this.Form.controls['conversion_required'].setValue(unit[0].attributes.conversion_required)
            this.Form.controls['unit'].disable()
            this.Form.controls['refrigerant_type'].setErrors(null)
          }
          else if (data.value === 'Refrigerants') {
            const unit = this.consumptionDropDownValues.filter(function (elem: any) {
              return (elem.attributes.Value === data.value)
            })
            this.Form.controls['unit'].setValue(unit[0].attributes.unit)
            this.Form.controls['unit'].disable()
            this.Form.controls['scope'].setValue('Scope-1')
            this.Form.controls['scope_1_cateogry'].setValue('Refrigerants and Fugitives');

          }
          if (data.value === 'Combined') {
            this.Form.controls['treatment_outcome'].setErrors(null)
            this.Form.controls['reused_recycled_quantity'].setErrors(null)
            this.Form.controls['applicability'].setErrors(null)
            this.Form.controls['treatment_outcome_recycled'].setErrors(null)
            this.Form.controls['treatment_outcome_reused'].setErrors(null)
          }
        }
      });
    } else {
      if (data.value !== 'Refrigerants' && this.Form.value.consumption_category !== 'Air Emission') {
        const sourceData = this.consumptionDropDownValues.filter(function (elem: any) {
          return (elem.attributes.Value === data.value && elem.attributes.Category === 'Source')
        })
        this.Form.controls['unit'].setValue(sourceData[0].attributes.unit)
        this.Form.controls['emission_factor'].setValue(sourceData[0].attributes.emission_factor)
        this.Form.controls['conversion_factor'].setValue(sourceData[0].attributes.conversion_factor)
        this.Form.controls['conversion_required'].setValue(sourceData[0].attributes.conversion_required)
        this.Form.controls['unit'].disable()
        this.Form.controls['refrigerant_type'].setErrors(null)
      }
      else if (data.value === 'Refrigerants') {
        const unit = this.consumptionDropDownValues.filter(function (elem: any) {
          return (elem.attributes.Value === data.value)
        })
        this.Form.controls['unit'].setValue(unit[0].attributes.unit)
        this.Form.controls['unit'].disable()
        this.Form.controls['scope'].setValue('Scope-1')
        this.Form.controls['scope_1_cateogry'].setValue('Refrigerants and Fugitives');

      }
      if (data.value === 'Combined') {
        this.Form.controls['treatment_outcome'].setErrors(null)
        this.Form.controls['reused_recycled_quantity'].setErrors(null)
        this.Form.controls['applicability'].setErrors(null)
        this.Form.controls['treatment_outcome_recycled'].setErrors(null)
        this.Form.controls['treatment_outcome_reused'].setErrors(null)
      }
    }

  }
  editMeter(data: any, i: number) {




    const category = this.Form.get('consumption_category')?.value;
    const unit = this.Form.get('unit')?.value;
    let meterInfo = data.attributes;
    meterInfo.category = category
    meterInfo.unit = unit

    this.dialog
      .open(AddMeterComponent, { data: meterInfo })
      .afterClosed()
      .subscribe((updatedData) => {
        if (updatedData) {

          const id = data.id; // existing id
          const division = this.defaults.data.attributes.division;

          this.environmentService.update_env_submeter_details(updatedData, id, division).subscribe({
            next: (responseData: any) => {



              if (this.defaults?.data?.attributes?.env_sub_meter_details?.data[i]) {
                this.defaults.data.attributes.env_sub_meter_details.data[i] = responseData.data;

                const meterList = this.defaults?.data?.attributes?.env_sub_meter_details?.data;


                const totalQuantity = meterList.reduce((sum: number, item: any) => {
                  return sum + (item?.attributes?.quantity || 0);
                }, 0);


                this.Form.controls['quantity'].setValue(totalQuantity);
                this.kwhQuantity('')

              }
            }
          });
        }
      });
  }

  deleteMeter(data: any, i: number) {


    const id = data.id; // Meter ID to delete

    this.environmentService.delete_env_submeter_details(id).subscribe({
      next: (response) => {


        // ✅ Remove from the list
        if (this.defaults?.data?.attributes?.env_sub_meter_details?.data) {
          this.defaults?.data?.attributes?.env_sub_meter_details?.data.splice(i, 1);
          const meterList = this.defaults?.data?.attributes?.env_sub_meter_details?.data;


          const totalQuantity = meterList.reduce((sum: number, item: any) => {
            return sum + (item?.attributes?.quantity || 0);
          }, 0);


          this.Form.controls['quantity'].setValue(totalQuantity);
          this.kwhQuantity('')
        }
      },
      error: (error) => {
        console.error("Error while deleting meter:", error);
      }
    });
  }

  addMeter() {
    const meterInfo = null;
    const selectedDivision = this.defaults.division;

    const unit = this.Form.get('unit')?.value;
    const category = this.Form.get('consumption_category')?.value;

    const dialogData = {
      meterInfo,
      selectedDivision,
      unit,
      category
    };

    this.dialog
      .open(AddMeterComponent, { data: dialogData })
      .afterClosed()
      .subscribe((data) => {
        if (data) {

          const envId = this.Form.controls['setId'].value
          const year = this.defaults.data.attributes.year
          const month = this.defaults.data.attributes.month
          const division = this.defaults.data.attributes.division

          this.environmentService.create_env_submeter_details(data, envId, year, month, division).subscribe({
            next: (createdData: any) => {



              this.defaults?.data?.attributes?.env_sub_meter_details?.data.push(createdData.data);
              const meterList = this.defaults?.data?.attributes?.env_sub_meter_details?.data;


              const totalQuantity = meterList.reduce((sum: number, item: any) => {
                return sum + (item?.attributes?.quantity || 0);
              }, 0);


              this.Form.controls['quantity'].setValue(totalQuantity);
              this.kwhQuantity('')

            }
          })


          //this.addedMeters.push(data);

        }
      });
  }


  pollutantsUnitVal(data: any) {
    const sourceData = this.consumptionDropDownValues.filter(function (elem: any) {
      return (elem.attributes.Value === data.value && elem.attributes.Category === 'Pollutants Emitted')
    })
    this.Form.controls['unit'].setValue(sourceData[0].attributes.unit)
    this.Form.controls['unit'].disable()
  }

  submit() {
    this.Form.controls['files'].setValue(this.files);
    this.Form.controls['unit'].enable();


    // return

    this.consumptions.push(this.Form.value);
    const category = this.Form.value.consumption_category;
    const data = this.conCategory.filter(function (elem: any) {
      return elem !== category;
    });
    const total = Number(this.totalCatCount);
    const count = Number(data.length);
    const percentage = Number((Number(count) / Number(total)) * 100).toFixed(0);
    this.Form.controls['pending_consumption'].setValue(data.toString());
    this.Form.controls['pending_percentage'].setValue(percentage);

    this.update_consumption();
  }

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  Applicabilities(event: any) {
    const selectedValues = event.value;
    const toSeperate = selectedValues.join(', ');
    this.Form.controls['applicability'].setValue(toSeperate);
  }
  TreatmentOutcome(event: any) {
    const selectedValues = event.value;
    this.selectedOutcomes = event.value;
    const toSeperate = selectedValues.join(', ');
    this.Form.controls['treatment_outcome'].setValue(toSeperate);
    if (this.selectedOutcomes.includes('Others')) {
      this.Form.controls['reused_recycled_quantity'].setValidators([Validators.required]);
    } else {
      this.Form.controls['reused_recycled_quantity'].clearValidators();
      this.Form.controls['reused_recycled_quantity'].reset();
    }

    if (this.selectedOutcomes.includes('Recycled')) {
      this.Form.controls['treatment_outcome_recycled'].setValidators([Validators.required]);
    } else {
      this.Form.controls['treatment_outcome_recycled'].clearValidators();
      this.Form.controls['treatment_outcome_recycled'].reset();
    }

    if (this.selectedOutcomes.includes('Reused')) {
      this.Form.controls['treatment_outcome_reused'].setValidators([Validators.required]);
    } else {
      this.Form.controls['treatment_outcome_reused'].clearValidators();
      this.Form.controls['treatment_outcome_reused'].reset();
    }

    this.Form.controls['reused_recycled_quantity'].updateValueAndValidity();
    this.Form.controls['treatment_outcome_recycled'].updateValueAndValidity();
    this.Form.controls['treatment_outcome_reused'].updateValueAndValidity();
  }
  showField(outcome: string): boolean {
    return this.selectedOutcomes.includes(outcome);
  }

  update_consumption() {
    this.showProgressPopup();
    this.environmentService.update_consumption(this.Form.value).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => { },
      complete: () => {
        const statusText = 'Consumption details updated';
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close();
        this.dialogRef.close(this.Form.value);
      },
    });
  }

  onRecStatusChange(event: any) {

    if (!event) {
      this.Form.controls['rec_status'].setValue(false)
      this.Form.controls['rec_type'].setValue('')
      this.Form.controls['i_rec_quantity'].setValue(null)
    }
  }
  openPdf(file: any) {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }

  update_testing_organizaton(ID: any) {
    this.dialog.open(CreateTestingOrganizationComponent, { data: ID }).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.TestingOrganization.find(obj => obj.attributes.name === data.name)
        this.environmentService.update_testing_organizaton(data, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.environmentService.get_testing_organizations().subscribe({
              next: (result: any) => {
                this.TestingOrganization = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Testing Organization updated successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['testing_organization'].setValue(result.data.attributes.name)

              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
          }
        })

      }
    })
  }
  delete_testing_organization(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the Testing Organization.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.environmentService.delete_testing_organization(id).subscribe({
          next: (result: any) => {
            this.Form.controls['testing_organization'].reset()
          },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Testing Organization deleted"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_testing_organizations()
          }
        })
      }
    })
  }


  create_testing_organization() {
    this.dialog.open(CreateTestingOrganizationComponent, { width: '500' }).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.TestingOrganization.find(obj => obj.attributes.name === data.name);
        if (found) {
          const statusText = "Testing Organization already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.Form.patchValue({
            testing_organization: found.attributes.name,
          })
        } else {
          this.environmentService.create_testing_organization(data, this.Form.value.reporter).subscribe({
            next: (result: any) => {
              this.environmentService.get_testing_organizations().subscribe({
                next: (result: any) => {
                  this.TestingOrganization = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Testing Organization created successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['testing_organization'].setValue(result.data.attributes.name)
                }
              })
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => { }
          })
        }

      }
    })
  }

  create_supplier() {
    this.dialog.open(NewSupplierComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.supplierList.find(obj => obj.attributes.name === data.name);
        if (found) {
          const statusText = "Supplier already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.environmentService.create_supplier(data, this.userId).subscribe({
            next: (result: any) => {
              this.environmentService.get_supplier().subscribe({
                next: (result: any) => {
                  this.supplierList = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Supplier created successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['supplier_name'].setValue(result.data.attributes.name)

                }
              })
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => { }
          })
        }

      }
    })
  }

  addRefrigerant() {
    this.Form.controls['unit'].enable()
    this.dialog.open(RefrigerantComponent, {
      data: { refrigerants: this.refrigerants, unit: this.Form.value.unit, mode: 'create' }
    }).afterClosed().subscribe((data) => {
      if (data) {

        if (data.refrigerants) {

          this.environmentService.create_refrigerant(data.refrigerants, this.consID).subscribe({
            next: (result: any) => {
              this.get_refrigerant(this.consID)
            },
            error: (err: any) => { },
            complete: () => {
              Swal.close();
              const statusText = "Refrigerant details saved"
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_consumption_details();
            }
          })

          this.refrigerants.push(data.refrigerants);

          this.Form.controls['refrigerants'].setValue(this.refrigerants);

          if (this.refrigerants.length > 0) {
            const totalQuantity = this.refrigerants.reduce((sum, item) => sum + Number(item.quantity), 0);
            this.Form.controls['quantity']?.setValue(totalQuantity);
          }
        }



      }
    });
  }

  deleteRefrigerant(event: any) {

    this.environmentService.delete_refrigerant(event).subscribe({
      next: (result: any) => {
        this.get_refrigerant(this.consID)
      },
      error: (err: any) => {
      },
      complete: () => {
        Swal.close()
        const statusText = "Refrigerant deleted"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.get_consumption_details()
      }
    })

  }

  viewRefrigerant(data: any) {
    this.dialog.open(ViewRefrigerantComponent, {
      data: data
    }).afterClosed().subscribe((customer) => {
    });
  }

  editRefrigerant(data: any) {
    this.dialog.open(RefrigerantComponent, {
      data: { attributes: data, id: data.id, mode: 'update' }
    }).afterClosed().subscribe((data) => {
      if (data) {
        if (data.refrigerants) {
          this.environmentService.update_refrigerant(data.refrigerants).subscribe({
            next: (result: any) => {
              this.get_refrigerant(this.consID)
            },
            error: (err: any) => { },
            complete: () => {
              Swal.close();
              const statusText = "Refrigerant details updated"
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_consumption_details();
            }
          })
        }

      }
    });
  }

  add_issue() {
    this.Form.controls['unit'].enable()
    this.dialog.open(NewIssueComponent, {
      data: { newIssue: this.IssueList, unit: this.Form.value.unit, mode: 'create' }
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.IssueList.push(data.issueList);
        // this.Form.controls['con_issues'].setValue(this.IssueList);

        if (data.issueList) {
          this.environmentService.create_envIssues(data.issueList, this.consID).subscribe({
            next: (result: any) => {
              this.get_envIssues(this.consID)
            },
            error: (err: any) => { },
            complete: () => {
              Swal.close();
              const statusText = "Issue details saved"
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              // this.get_consumption_details();
            }
          })
        }

      }
    });
  }

  deleteIssue(event: any) {

    this.environmentService.delete_envIssues(event).subscribe({
      next: (result: any) => {
        this.get_envIssues(this.consID)
      },
      error: (err: any) => {
      },
      complete: () => {
        Swal.close()
        const statusText = "Issue deleted"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        // this.get_consumption_details()
      }
    })

  }

  viewIssue(data: any) {
    this.dialog.open(ViewIssueComponent, {
      data: data
    }).afterClosed().subscribe((customer) => {
    });
  }

  editIssue(data: any) {
    this.dialog.open(NewIssueComponent, {
      data: { attributes: data.attributes, id: data.id, mode: 'update' }
    }).afterClosed().subscribe((data) => {
      if (data) {
        if (data.issueList) {
          this.environmentService.update_envIssues(data.issueList).subscribe({
            next: (result: any) => {
              this.get_envIssues(this.consID)
            },
            error: (err: any) => { },
            complete: () => {
              Swal.close();
              const statusText = "Issue details updated"
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              // this.get_consumption_details();
            }
          })
        }

      }
    });
  }

}



function configuration() {
  throw new Error('Function not implemented.');
}
