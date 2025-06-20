import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.api.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { AddPollutantsEmittedComponent } from '../add-pollutants-emitted/add-pollutants-emitted.component';
import { CreateNewSourceComponent } from '../create-new-source/create-new-source.component';
import { EditPollutantsEmittedComponent } from '../edit-pollutants-emitted/edit-pollutants-emitted.component';
import { map, Observable, startWith } from 'rxjs';
import { CreateTestingOrganizationComponent } from '../create-testing-organization/create-testing-organization.component';
import { RefrigerantComponent } from '../../common-component/refrigerant/refrigerant.component';
import { NewSupplierComponent } from '../../common-component/new-supplier/new-supplier.component';
import { NewIssueComponent } from '../../common-component/new-issue/new-issue.component';
import { ViewIssueComponent } from '../../common-component/view-issue/view-issue.component';
import { ViewRefrigerantComponent } from '../../common-component/view-refrigerant/view-refrigerant.component';
import { AddMeterComponent } from '../add-meter/add-meter.component';
import { formatDate } from '@angular/common';
import { CreateWasteTypeComponent } from '../create-waste-type/create-waste-type.component';
import { log } from 'console';
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

interface EnvConsumption {
  date: string;
  consumption_category: string;
  source: string;
  auto: number;
}

@Component({
  selector: 'app-consumption',
  templateUrl: './consumption.component.html',
  styleUrls: ['./consumption.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ConsumptionComponent implements OnInit {
  Form: FormGroup
  mode: 'create' | 'update' = 'create';
  dropDownValues: any[] = []
  consumptionDropDownValues: any[] = []
  consumCategory: any[] = []
  source: any[] = []
  filteredApplicabilities: any[] = []
  source_type: any[] = []
  pollutants: any[] = []
  categories: any[] = []
  watertypes: any[] = []
  applicability = new FormControl(null);
  disposalMethod: any[] = []
  scopes: any[] = []
  scopes1categories: any[] = []
  refrigerantTypes: any[] = []
  treatmentOutcomes: any[] = []
  reusedRecycledQuantities: any[] = []
  applicabilities: any[] = []
  TestingOrganization: any[] = []
  wasteTypes:any[]=[]
  quantities: any[] = []
  renewableEnergySources: any[] = []
  wasteQuantities: any[] = []
  consumptions: any[] = []
  IssueList: any[] = []
  pollutantsEmitted: any[] = []
  treatment: any[] = []
  totalCatCount: Number = 0
  conCategory: any[] = []
  collectedFrom = new FormControl(null, [Validators.required]);
  latesttest = new FormControl(null, [Validators.required]);
  collectedTo = new FormControl(null, [Validators.required]);
  Treatment_outcome_Quantity = new FormControl(null, [Validators.required]);
  disposalDate = new FormControl(null);
  files: File[] = [];
  renewable: boolean = false
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: any
  selectedOutcomes: string[] = [];
  refrigerantType = new FormControl('');
  filteredRefrigerantOptions: Observable<any[]>;
  usageType = new FormControl('');
  refrigerants: any[] = []
  supplierList: any[] = []
  userId: any;
  addedMeters: any[] = []


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
  Newfiles: any[] = [];
  recDataList: any[] = [];
  usageTypeList: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<ConsumptionComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private generalService: GeneralService,
    private environmentService: EnvironmentService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      org_id: [''],
      consumption_category: ['', [Validators.required],],
      category: [{value: '', disabled: true}, [Validators.required]],
      source: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      amount: [''],
      scope: ['', [Validators.required]],
      description: [''],
      treatment: ['', [Validators.required]],
      collected_from: ['', [Validators.required]],
      legal_emission_limit: [0],
      control_device: [null, [Validators.required]],
      save_new: [false],
      latest_test: ['', [Validators.required]],
      monitoring_frequency: ['', [Validators.required]],
      source_capacity: [''],
      collected_to: ['', [Validators.required]],
      disposal_method: ['', [Validators.required]],
      water_type: ['', [Validators.required]],
      waste_type: ['', [Validators.required]],
      disposal_date: [null],
      consignment_number: [''],
      disposer: [''],
      carrier: [''],
      disposal_place: [''],
      // pollutants_emitted: ['', [Validators.required]],
      concentration: [''],
      determined_by: ['', [Validators.required]],
      files: [''],
      pending_consumption: [''],
      pending_percentage: [0],
      emission_factor: [0],
      ghg_value: [0],
      conversion_factor: [0],
      conversion_value: [0],
      meter_reading: [''],
      quantity_source: [''],
      conversion_required: [''],
      renewable_energy_source: [''],
      quantity_kwh: [0],
      emission_value: [],
      refrigerant_type: ['', [Validators.required]],
      applicability: [''],
      usage_type: [''],
      treatment_outcome: [''],
      reused_recycled_quantity: [''],
      treatment_outcome_recycled: [''],
      treatment_outcome_reused: [''],
      rec_status: [false],
      rec_type: [''],
      i_rec_quantity: [null],
      scope_1_cateogry: ['', [Validators.required]],
      source_type: [''],
      volumetric_flow_rate: [null],
      operation_time: [null],
      testing_organization: [''],
      compliance_status: [''],
      opening_balance: [0],
      purchased_quantity: [0],
      purchase_date: [null],
      supplier_name: [''],
      stock_balance: [0],
      add_issue: [false],
      refrigerants: [''],
      con_issues: [''],
      // add_meter: [false]
    });
    this.configuration()
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

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.environment
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
          this.dialogRef.close()
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
        this.dialogRef.close()

      },
      complete: () => { }
    })

  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.env_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
          this.dialogRef.close()
        } else {
          this.userId = result.profile.id
          this.get_dropdown_values()
          this.get_testing_organizations()
          this.get_supplier()
          this.get_waste_types()
          this.get_all_consumption_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
        this.dialogRef.close()

      },
      complete: () => {

      }
    })
  }

  get_testing_organizations() {
    this.environmentService.get_testing_organizations().subscribe({
      next: (result: any) => {
        this.TestingOrganization = result.data
      }
    })
  }

  get_waste_types() {
    this.environmentService.get_waste_type().subscribe({
      next: (result: any) => {
        this.wasteTypes = result.data
      }
    })
  }

  get_dropdown_values() {
    const module = "Environment"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValues = result.data

        const sourceData = this.dropDownValues.filter(function (elem: any) {
          return elem.attributes.Module === 'Environment' && elem.attributes.Category === 'REC Type';
        });
        this.recDataList = sourceData;

        const usageType = this.dropDownValues.filter(function (elem: any) {
          return elem.attributes.Module === 'Environment' && elem.attributes.Category === 'Usage Type';
        });
        this.usageTypeList = usageType;
      },
      error: (err: any) => { },
      complete: () => {
        this.get_consumption_dropdown_values()
      }
    })
  }
  get_consumption_dropdown_values() {
    const module = "Environment"
    this.environmentService.get_consumption_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.consumptionDropDownValues = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.consumption_category()
        if (this.defaults.consumptions.length > 0) {
          const lastIndex = this.defaults.consumptions.length - 1;
          if (this.defaults.consumptions[lastIndex].save_new) {
            this.Form.controls['consumption_category'].setValue(this.defaults.consumptions[lastIndex].consumption_category);
            const value = this.Form.value.consumption_category;

            this.pollutantsEmitted = [];
            this.Form.controls['category'].reset();
            this.Form.controls['source'].reset();
            this.Form.controls['unit'].reset();
            this.Form.controls['quantity'].reset();
            this.Form.controls['amount'].reset();
            this.Form.controls['scope'].reset();
            this.Form.controls['renewable_energy_source'].reset()
            this.Form.controls['description'].reset();
            this.Form.controls['treatment'].reset();
            this.Form.controls['collected_from'].reset();
            this.Form.controls['collected_to'].reset();
            this.Form.controls['disposal_method'].reset();
            this.Form.controls['water_type'].reset();
            this.Form.controls['disposal_date'].reset();
            this.Form.controls['consignment_number'].reset();
            this.Form.controls['disposer'].reset();
            this.Form.controls['carrier'].reset();
            this.Form.controls['control_device'].reset();
            this.Form.controls['legal_emission_limit'].reset();
            this.Form.controls['monitoring_frequency'].reset();
            this.Form.controls['latest_test'].reset();
            this.Form.controls['source_capacity'].reset();
            this.Form.controls['disposal_place'].reset();
            // this.Form.controls['pollutants_emitted'].reset()
            this.Form.controls['concentration'].reset();
            this.Form.controls['determined_by'].reset();
            this.Form.controls['meter_reading'].reset();
            this.Form.controls['refrigerant_type'].reset();
            this.Form.controls['treatment_outcome'].reset();
            this.Form.controls['reused_recycled_quantity'].reset();
            this.Form.controls['applicability'].reset();
            this.Form.controls['treatment_outcome_recycled'].reset()
            this.Form.controls['treatment_outcome_reused'].reset()
            this.Form.controls['opening_balance'].reset();
            this.Form.controls['purchased_quantity'].reset();
            this.Form.controls['purchase_date'].reset();
            this.Form.controls['supplier_name'].reset();
            this.Form.controls['stock_balance'].reset();
            this.Form.controls['waste_type'].reset();

            const sourceData = this.consumptionDropDownValues.filter(function (elem: any) {
              return elem.attributes.filter === value && elem.attributes.Category !== 'Quantity Source' && elem.attributes.Category !== 'Unit';
            });
            this.source = sourceData;

            if (value === "Wastewater") {
              this.Form.controls['scope'].setErrors(null);
              this.Form.controls['renewable_energy_source'].setErrors(null)
              this.Form.controls['category'].setErrors(null);
              this.Form.controls['collected_from'].setErrors(null);
              this.Form.controls['collected_to'].setErrors(null);
              this.Form.controls['disposal_method'].setErrors(null);
              this.Form.controls['waste_type'].setErrors(null);
              this.Form.controls['water_type'].setErrors(null);
              this.Form.controls['disposal_date'].setErrors(null);
              this.Form.controls['consignment_number'].setErrors(null);
              this.Form.controls['disposer'].setErrors(null);
              this.Form.controls['carrier'].setErrors(null);
              this.Form.controls['legal_emission_limit'].setErrors(null);
              this.Form.controls['control_device'].setErrors(null);
              this.Form.controls['latest_test'].setErrors(null);
              this.Form.controls['monitoring_frequency'].setErrors(null);
              this.Form.controls['source_capacity'].setErrors(null);
              this.Form.controls['disposal_place'].setErrors(null);
              // this.Form.controls['pollutants_emitted'].setErrors(null)
              this.Form.controls['concentration'].setErrors(null);
              this.Form.controls['determined_by'].setErrors(null);
              this.Form.controls['refrigerant_type'].setErrors(null);
              this.Form.controls['meter_reading'].setErrors(null);
              this.Form.controls['opening_balance'].setErrors(null)
              this.Form.controls['purchased_quantity'].setErrors(null)
              this.Form.controls['purchase_date'].setErrors(null)
              this.Form.controls['supplier_name'].setErrors(null)
              this.Form.controls['stock_balance'].setErrors(null)

              const treatmentData = this.dropDownValues.filter(function (elem: any) {
                return elem.attributes.Category === 'Treatment Where';
              });
              this.treatment = treatmentData;
              const treatOutcomeData = this.dropDownValues.filter(function (elem: any) {
                return elem.attributes.Category === 'Treatment Outcome';
              });
              this.treatmentOutcomes = treatOutcomeData;

            } else if (value === "Waste") {
              this.Form.controls['scope'].setErrors(null);
              this.Form.controls['renewable_energy_source'].setErrors(null)
              this.Form.controls['treatment'].setErrors(null);
              // this.Form.controls['pollutants_emitted'].setErrors(null)
              this.Form.controls['concentration'].setErrors(null);
              this.Form.controls['determined_by'].setErrors(null);
              this.Form.controls['meter_reading'].setErrors(null);
              this.Form.controls['refrigerant_type'].setErrors(null);
              this.Form.controls['water_type'].setErrors(null);
              this.Form.controls['legal_emission_limit'].setErrors(null);
              this.Form.controls['control_device'].setErrors(null);
              this.Form.controls['latest_test'].setErrors(null);
              this.Form.controls['monitoring_frequency'].setErrors(null);
              this.Form.controls['source_capacity'].setErrors(null);
              this.Form.controls['treatment_outcome'].setErrors(null);
              this.Form.controls['reused_recycled_quantity'].setErrors(null);
              this.Form.controls['treatment_outcome_recycled'].setErrors(null)
              this.Form.controls['treatment_outcome_reused'].setErrors(null)
              this.Form.controls['applicability'].setErrors(null);
              this.Form.controls['opening_balance'].setErrors(null)
              this.Form.controls['purchased_quantity'].setErrors(null)
              this.Form.controls['purchase_date'].setErrors(null)
              this.Form.controls['supplier_name'].setErrors(null)
              this.Form.controls['stock_balance'].setErrors(null)
              this.applicability.clearValidators();
              this.applicability.updateValueAndValidity();

              const cateData = this.dropDownValues.filter(function (elem: any) {
                return elem.attributes.Category === 'Category';
              });
              this.categories = cateData;

              const disMethData = this.dropDownValues.filter(function (elem: any) {
                return elem.attributes.Category === 'Disposal Method';
              });
              this.disposalMethod = disMethData;
              const methodTracking = this.dropDownValues.filter(function (elem: any) {
                return elem.attributes.Category === 'Quantity Source' && elem.attributes.filter === 'Waste';
              });
              this.wasteQuantities = methodTracking;

            }
            else if (value === "Energy") {
              this.Form.controls['category'].setErrors(null)
              this.Form.controls['treatment'].setErrors(null)
              this.Form.controls['collected_from'].setErrors(null)
              this.Form.controls['collected_to'].setErrors(null)
              this.Form.controls['disposal_method'].setErrors(null)
              this.Form.controls['waste_type'].setErrors(null);
              this.Form.controls['water_type'].setErrors(null)
              this.Form.controls['disposal_date'].setErrors(null)
              this.Form.controls['consignment_number'].setErrors(null)
              this.Form.controls['disposer'].setErrors(null)
              this.Form.controls['carrier'].setErrors(null)
              this.Form.controls['disposal_place'].setErrors(null)
              // this.Form.controls['pollutants_emitted'].setErrors(null)
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

              this.Form.controls['treatment_outcome_recycled'].setErrors(null)
              this.Form.controls['treatment_outcome_reused'].setErrors(null)
              this.usageType.setValue(null)
              const scopeData = this.dropDownValues.filter(function (elem: any) {
                return (elem.attributes.Category === 'Scope')
              }

              )
              this.scopes = scopeData

              const scope1Data = this.dropDownValues.filter(function (elem: any) {
                return (elem.attributes.Category === 'Scope 1 Category')
              })
              this.scopes1categories = scope1Data

              const refrigerantData = this.dropDownValues.filter(function (elem: any) {
                return (elem.attributes.Category === 'Refrigerant Type')
              })
              this.refrigerantTypes = refrigerantData.map(data => (data.attributes.Value));


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
            else if (value === "Water") {
              this.Form.controls['scope'].setErrors(null);
              this.Form.controls['renewable_energy_source'].setErrors(null)
              this.Form.controls['category'].setErrors(null);
              this.Form.controls['treatment'].setErrors(null);
              this.Form.controls['collected_from'].setErrors(null);
              this.Form.controls['collected_to'].setErrors(null);
              this.Form.controls['waste_type'].setErrors(null);
              this.Form.controls['disposal_method'].setErrors(null);
              this.Form.controls['disposal_date'].setErrors(null);
              this.Form.controls['consignment_number'].setErrors(null);
              this.Form.controls['disposer'].setErrors(null);
              this.Form.controls['carrier'].setErrors(null);
              this.Form.controls['legal_emission_limit'].setErrors(null);
              this.Form.controls['control_device'].setErrors(null);
              this.Form.controls['latest_test'].setErrors(null);
              this.Form.controls['monitoring_frequency'].setErrors(null);
              this.Form.controls['source_capacity'].setErrors(null);
              this.Form.controls['disposal_place'].setErrors(null);
              // this.Form.controls['pollutants_emitted'].setErrors(null)
              this.Form.controls['concentration'].setErrors(null);
              this.Form.controls['determined_by'].setErrors(null);
              this.Form.controls['refrigerant_type'].setErrors(null);
              this.Form.controls['treatment_outcome'].setErrors(null);
              this.Form.controls['reused_recycled_quantity'].setErrors(null);
              this.Form.controls['treatment_outcome_recycled'].setErrors(null)
              this.Form.controls['treatment_outcome_reused'].setErrors(null)
              this.Form.controls['opening_balance'].setErrors(null)
              this.Form.controls['purchased_quantity'].setErrors(null)
              this.Form.controls['purchase_date'].setErrors(null)
              this.Form.controls['supplier_name'].setErrors(null)
              this.Form.controls['stock_balance'].setErrors(null)
              const waterType = this.dropDownValues.filter(function (elem: any) {
                return elem.attributes.Category === 'Water Type';
              });
              this.watertypes = waterType;
            }

            const quantity = this.dropDownValues.filter(function (elem: any) {
              return elem.attributes.Category === 'Quantity Source' && elem.attributes.filter !== 'Waste';
            });
            this.quantities = quantity;
            const applicabilityData = this.dropDownValues.filter(function (elem: any) {
              return elem.attributes.Category === 'Applicability';
            });

            this.applicabilities = applicabilityData;

          }
        }

      }
    })
  }

  consumption_category() {
    const data = this.dropDownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Consumption Category")
    })
    this.consumCategory = data
    this.totalCatCount = this.consumCategory.length
    if (this.defaults?.consumptions?.length > 0) {
      const catdata = "" + this.defaults?.consumptions[this.defaults?.consumptions.length - 1]?.pending_consumption + ""
      var catVal = catdata
      var str_array = catVal.split(',');
      let cData: any[] = []
      str_array.forEach(elem => {
        cData.push(elem)
      })
      this.conCategory = cData
    } else {
      data.forEach(elem => {
        this.conCategory.push(elem.attributes.Value)
      })
    }
  }

  get_all_consumption_details() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const division = this.defaults.environmentService.selectedDivision

    this.environmentService.getConsumptionByYear(this.defaults.environmentService.selectedYear, division).subscribe({
      next: (result: any) => {

        const filtered = result?.data.filter((data: any) => this.filterParticular(data));

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

  // filterParticular(values: any[]) {
  //   const months = [
  //     'January', 'February', 'March', 'April', 'May', 'June',
  //     'July', 'August', 'September', 'October', 'November', 'December'
  //   ];

  //   const currentMonth = this.defaults.month;
  //   const currentIndex = months.indexOf(currentMonth);

  //   // Filter items that are from previous months and match the condition
  //   const filtered = values.filter(value => {
  //     const itemMonth = value.attributes?.month;
  //     const itemIndex = months.indexOf(itemMonth);

  //     return (
  //       itemIndex < currentIndex &&
  //       value.attributes?.consumption_category === 'Energy' &&
  //       value.attributes?.source === 'Refrigerants'
  //     );
  //   });

  //   if (filtered.length === 0) {
  //     return []; // No matching previous months found
  //   }

  //   // Sort by month index descending to get the most recent matching month
  //   filtered.sort((a, b) => {
  //     return months.indexOf(b.attributes?.month) - months.indexOf(a.attributes?.month);
  //   });

  //   const latestMonth = filtered[0].attributes?.month;

  //   // Return only items from that latest matching month
  //   return filtered.filter(item => item.attributes?.month === latestMonth);
  // }


  // filterParticular(value: any) {
  //   const months = [
  //     'January', 'February', 'March', 'April', 'May', 'June',
  //     'July', 'August', 'September', 'October', 'November', 'December'
  //   ];

  //   const itemMonth = value.attributes?.month;
  //   const currentMonth = this.defaults.month;

  //   return (
  //     months.indexOf(itemMonth) < months.indexOf(currentMonth) &&
  //     value.attributes?.consumption_category === 'Energy' &&
  //     value.attributes?.source === 'Refrigerants'
  //   );
  // }


  submit() {

    this.Form.controls['save_new'].setValue(false);
    this.Form.controls['files'].setValue(this.files);
    this.Form.controls['unit'].enable()
    this.Form.controls['category'].enable()


    const collectedFromData = this.Form.controls['collected_from'].value
    if (collectedFromData) {
      const selectedDate = collectedFromData;
      selectedDate.setDate(selectedDate.getDate() + 1);
      this.Form.controls['collected_from'].setValue(selectedDate);
    }

    const collectedToData = this.Form.controls['collected_to'].value
    if (collectedFromData) {
      const selectedDate = collectedToData
      selectedDate.setDate(selectedDate.getDate() + 1);
      this.Form.controls['collected_to'].setValue(selectedDate);
    }




    const category = this.Form.value.consumption_category

    const data = this.conCategory.filter(function (elem: any) {
      return (elem !== category)
    })

    const total = Number(this.totalCatCount)
    const count = Number(data.length)
    const percentage = Number(Number(count) / Number(total) * 100).toFixed(0)
    this.Form.controls['pending_consumption'].setValue(data.toString())
    this.Form.controls['pending_percentage'].setValue(percentage)

    if (!this.pollutantsEmitted || this.pollutantsEmitted.length === 0) {
      this.consumptions.push({
        ...this.Form.value,
        meters: this.addedMeters
      });

    } else {
      this.pollutantsEmitted.forEach(pollutant => {
        const consumptionData = { ...this.Form.value };
        consumptionData.quantity = pollutant.quantity;
        consumptionData.quantity_kwh = pollutant.quantity_kwh;
        consumptionData.unit = pollutant.unit;
        consumptionData.legal_emission_limit=pollutant.legal_emission_limit
        consumptionData.ghg_value = pollutant.ghg_value;
        consumptionData.conversion_value = pollutant.conversion_value;
        consumptionData.pollutantsEmitted = [pollutant];
        this.consumptions.push(consumptionData);
      });
    }
    this.dialogRef.close({ consumptions: this.consumptions, pollutantsEmitted: this.pollutantsEmitted, refrigerants: this.refrigerants, IssueList: this.IssueList });
  }



  submitAndNew() {
    this.Form.controls['save_new'].setValue(true);
    this.Form.controls['files'].setValue(this.files);
    this.Form.controls['unit'].enable()
    this.Form.controls['category'].enable()
    const category = this.Form.value.consumption_category
    const data = this.conCategory.filter(function (elem: any) {
      return (elem !== category)
    })
    const total = Number(this.totalCatCount)
    const count = Number(data.length)
    const percentage = Number(Number(count) / Number(total) * 100).toFixed(0)
    this.Form.controls['pending_consumption'].setValue(data.toString())
    this.Form.controls['pending_percentage'].setValue(percentage)

    if (!this.pollutantsEmitted || this.pollutantsEmitted.length === 0) {
      this.consumptions.push({
        ...this.Form.value,
        meters: this.addedMeters
      });
    } else {
      this.pollutantsEmitted.forEach(pollutant => {
        const consumptionData = { ...this.Form.value };
        consumptionData.quantity = pollutant.quantity;
        consumptionData.quantity_kwh = pollutant.quantity_kwh;
        consumptionData.unit = pollutant.unit;
        consumptionData.ghg_value = pollutant.ghg_value;
        consumptionData.conversion_value = pollutant.conversion_value;
        consumptionData.pollutantsEmitted = [pollutant];
        this.consumptions.push(consumptionData);
      });
    }


    this.dialogRef.close({ consumptions: this.consumptions, pollutantsEmitted: this.pollutantsEmitted });
  }

  refrigerantVal(data: any) {
    this.Form.controls['refrigerant_type'].setValue(data)
    const sourceData = this.dropDownValues.filter(function (elem: any) {
      return (elem.attributes.Value === data)
    })



    this.Form.controls['emission_factor'].setValue(sourceData[0].attributes?.emission_factor)
    this.Form.controls['unit'].setValue(sourceData[0].attributes.unit)
    this.Form.controls['unit'].disable()
    this.Form.controls['quantity'].reset()

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

  // onSelect(event: any) {
  //   const fileLength = this.files.length
  //   const addedLength = event.addedFiles.length
  //   if (fileLength === 0 && addedLength < 2) {
  //     const size = event.addedFiles[0].size / 1024 / 1024
  //     if (size > 2) {
  //       const statusText = "Please choose an image below 2 MB"
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

  //       } else {
  //         const statusText = "Please choose images ('jpg', 'jpeg', 'png')"
  //         this._snackBar.open(statusText, 'Close Warning', {
  //           horizontalPosition: this.horizontalPosition,
  //           verticalPosition: this.verticalPosition,
  //         });
  //       }
  //     }

  //   } else if (fileLength < 2) {
  //     const statusText = "You have exceed the upload limit"
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
        const statusText = "Please choose an evidence below 10 MB";
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
    }

  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }
  openPdf(file: any) {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }

  collFrom(data: any) {

    this.Form.controls['collected_from'].setValue(new Date(data.value))

  }
  latestTest(data: any) {

    this.Form.controls['latest_test'].setValue(new Date(data.value))
  }

  collTo(data: any) {

    this.Form.controls['collected_to'].setValue(new Date(data.value))

  }

  disDate(data: any) {
    this.Form.controls['disposal_date'].setValue(new Date(data.value))
  }

  consCategory(data: any) {
    this.source = []
    this.pollutantsEmitted = []
    this.addedMeters = []
    this.Form.controls['emission_factor'].reset()
    this.Form.controls['conversion_required'].reset()
    this.Form.controls['ghg_value'].reset()
    this.Form.controls['conversion_value'].reset()
    this.Form.controls['quantity_kwh'].reset()
    this.Form.controls['emission_value'].reset()
    this.Form.controls['category'].reset()
    this.Form.controls['source'].reset()
    this.Form.controls['unit'].reset()
    this.Form.controls['quantity'].reset()
    this.Form.controls['amount'].reset()
    this.Form.controls['scope'].reset()
    this.Form.controls['renewable_energy_source'].reset()
    this.Form.controls['description'].reset()
    this.Form.controls['treatment'].reset()
    this.Form.controls['collected_from'].reset()
    this.Form.controls['collected_to'].reset()
    this.Form.controls['disposal_method'].reset()
    this.Form.controls['waste_type'].reset()
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
    // this.Form.controls['pollutants_emitted'].reset()
    this.Form.controls['concentration'].reset()
    this.Form.controls['determined_by'].reset()
    this.Form.controls['meter_reading'].reset()
    this.Form.controls['refrigerant_type'].reset()
    this.Form.controls['treatment_outcome'].reset()
    this.Form.controls['reused_recycled_quantity'].reset()
    this.Form.controls['treatment_outcome_recycled'].reset()
    this.Form.controls['treatment_outcome_reused'].reset()
    this.Form.controls['applicability'].clearValidators();
    this.Form.controls['applicability'].updateValueAndValidity();
    this.applicability.clearValidators();
    this.applicability.updateValueAndValidity();
    this.Form.controls['scope_1_cateogry'].clearValidators();
    this.Form.controls['scope_1_cateogry'].updateValueAndValidity();
    //this.Form.controls['add_meter'].setValue(false);
    this.Form.controls['add_issue'].setValue(false);
    this.Form.controls['opening_balance'].reset();
    this.Form.controls['purchased_quantity'].reset();
    this.Form.controls['purchase_date'].reset();
    this.Form.controls['supplier_name'].reset();
    this.Form.controls['stock_balance'].reset();

    this.applicability.reset()
    this.Form.controls['applicability'].reset();
     if (data.value !== "Waste") {
    const sourceData = this.consumptionDropDownValues.filter(function (elem: any) {
      return (elem.attributes.filter === data.value && elem.attributes.Category !== 'Quantity Source' && elem.attributes.Category !== 'Unit')
    })

    this.source = sourceData
  }
    if (data.value === "Energy") {
      this.Form.controls['category'].setErrors(null)
      this.Form.controls['treatment'].setErrors(null)
      this.Form.controls['collected_from'].setErrors(null)
      this.Form.controls['collected_to'].setErrors(null)
      this.Form.controls['disposal_method'].setErrors(null)
      this.Form.controls['waste_type'].setErrors(null);
      this.Form.controls['water_type'].setErrors(null)
      this.Form.controls['disposal_date'].setErrors(null)
      this.Form.controls['consignment_number'].setErrors(null)
      this.Form.controls['disposer'].setErrors(null)
      this.Form.controls['carrier'].setErrors(null)
      this.Form.controls['disposal_place'].setErrors(null)
      // this.Form.controls['pollutants_emitted'].setErrors(null)
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

      this.Form.controls['treatment_outcome_recycled'].setErrors(null)
      this.Form.controls['treatment_outcome_reused'].setErrors(null)
      this.usageType.setValue(null)
      const scopeData = this.dropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Scope')
      }

      )
      this.scopes = scopeData

      const scope1Data = this.dropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Scope 1 Category')
      })
      this.scopes1categories = scope1Data

      const refrigerantData = this.dropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Refrigerant Type')
      })
      this.refrigerantTypes = refrigerantData.map(data => (data.attributes.Value));


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

      this.get_all_consumption_details()

    } else if (data.value === "Wastewater") {


      // this.Form.controls['scope'].setErrors(null)
      this.Form.controls['renewable_energy_source'].setErrors(null)
      this.Form.controls['category'].setErrors(null)
      this.Form.controls['collected_from'].setErrors(null)
      this.Form.controls['collected_to'].setErrors(null)
      this.Form.controls['disposal_method'].setErrors(null)
      this.Form.controls['waste_type'].setErrors(null);
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
      // this.Form.controls['pollutants_emitted'].setErrors(null)
      this.Form.controls['concentration'].setErrors(null)
      this.Form.controls['determined_by'].setErrors(null)
      this.Form.controls['refrigerant_type'].setErrors(null)
      this.Form.controls['meter_reading'].setErrors(null)
      this.Form.controls['opening_balance'].setErrors(null)
      this.Form.controls['purchased_quantity'].setErrors(null)
      this.Form.controls['purchase_date'].setErrors(null)
      this.Form.controls['supplier_name'].setErrors(null)
      this.Form.controls['stock_balance'].setErrors(null)

      this.Form.controls['applicability'].setValidators([Validators.required])
      this.Form.controls['applicability'].updateValueAndValidity();
      this.applicability.setValidators([Validators.required]);
      this.applicability.updateValueAndValidity();
      this.Form.controls['scope'].clearValidators();
      this.Form.controls['scope'].updateValueAndValidity();
      this.Form.controls['scope_1_cateogry'].clearValidators();
      this.Form.controls['scope_1_cateogry'].updateValueAndValidity();

      const treatmentData = this.dropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Treatment Where')
      })
      this.treatment = treatmentData
      const treatOutcomeData = this.dropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Treatment Outcome')
      })
      this.treatmentOutcomes = treatOutcomeData
    } else if (data.value === "Waste") {
      // this.Form.controls['scope'].setErrors(null)
      this.Form.controls['renewable_energy_source'].setErrors(null)
      this.Form.controls['treatment'].setErrors(null)
      // this.Form.controls['pollutants_emitted'].setErrors(null)
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
      this.Form.controls['opening_balance'].setErrors(null)
      this.Form.controls['purchased_quantity'].setErrors(null)
      this.Form.controls['purchase_date'].setErrors(null)
      this.Form.controls['supplier_name'].setErrors(null)
      this.Form.controls['stock_balance'].setErrors(null)

      this.applicability.clearValidators();
      this.applicability.updateValueAndValidity();
      this.Form.controls['scope'].clearValidators();
      this.Form.controls['scope'].updateValueAndValidity();
      this.Form.controls['scope_1_cateogry'].clearValidators();
      this.Form.controls['scope_1_cateogry'].updateValueAndValidity();

      this.Form.controls['treatment_outcome_recycled'].setErrors(null)
      this.Form.controls['treatment_outcome_reused'].setErrors(null)
      const cateData = this.dropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Category')
      })
      this.categories = cateData

      const disMethData = this.dropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Disposal Method')
      })
      this.disposalMethod = disMethData
      const methodTracking = this.dropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Quantity Source' && elem.attributes.filter === 'Waste')
      })
      this.wasteQuantities = methodTracking


      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      this.collectedFrom.setValue(firstDay);
      this.Form.controls['collected_from'].setValue(firstDay);

      this.collectedTo.setValue(todayMidnight);
      this.Form.controls['collected_to'].setValue(todayMidnight);

      this.Form.controls['collected_from'].updateValueAndValidity();
      this.Form.controls['collected_to'].updateValueAndValidity();
    } else if (data.value === "Water") {

      //  this.Form.controls['scope'].setErrors(null)
      this.Form.controls['renewable_energy_source'].setErrors(null)
      this.Form.controls['category'].setErrors(null)
      this.Form.controls['treatment'].setErrors(null)
      this.Form.controls['collected_from'].setErrors(null)
      this.Form.controls['collected_to'].setErrors(null)
      this.Form.controls['waste_type'].setErrors(null);
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
      // this.Form.controls['pollutants_emitted'].setErrors(null)
      this.Form.controls['concentration'].setErrors(null)
      this.Form.controls['determined_by'].setErrors(null)
      this.Form.controls['refrigerant_type'].setErrors(null)
      this.Form.controls['treatment_outcome'].setErrors(null)
      this.Form.controls['reused_recycled_quantity'].setErrors(null)
      this.Form.controls['treatment_outcome_recycled'].setErrors(null)
      this.Form.controls['treatment_outcome_reused'].setErrors(null)
      this.Form.controls['opening_balance'].setErrors(null)
      this.Form.controls['purchased_quantity'].setErrors(null)
      this.Form.controls['purchase_date'].setErrors(null)
      this.Form.controls['supplier_name'].setErrors(null)
      this.Form.controls['stock_balance'].setErrors(null)

      this.Form.controls['applicability'].setValidators([Validators.required])
      this.Form.controls['applicability'].updateValueAndValidity();
      this.applicability.setValidators([Validators.required]);
      this.applicability.updateValueAndValidity();
      this.Form.controls['scope'].clearValidators();
      this.Form.controls['scope'].updateValueAndValidity();
      this.Form.controls['scope_1_cateogry'].clearValidators();
      this.Form.controls['scope_1_cateogry'].updateValueAndValidity();


      const waterType = this.dropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Water Type')
      })
      this.watertypes = waterType
      this.usageType.setValue(null)

    } else if (data.value === "Air Emission") {
      // this.Form.controls['scope'].setErrors(null)
      this.Form.controls['renewable_energy_source'].setErrors(null)
      this.Form.controls['category'].setErrors(null)
      this.Form.controls['treatment'].setErrors(null)
      this.Form.controls['collected_from'].setErrors(null)
      this.Form.controls['collected_to'].setErrors(null)
      this.Form.controls['disposal_method'].setErrors(null)
      this.Form.controls['waste_type'].setErrors(null);
      this.Form.controls['water_type'].setErrors(null)
      this.Form.controls['unit'].setErrors(null)
      this.Form.controls['quantity'].setErrors(null)
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
      this.Form.controls['opening_balance'].setErrors(null)
      this.Form.controls['purchased_quantity'].setErrors(null)
      this.Form.controls['purchase_date'].setErrors(null)
      this.Form.controls['supplier_name'].setErrors(null)
      this.Form.controls['stock_balance'].setErrors(null)

      this.applicability.clearValidators();
      this.applicability.updateValueAndValidity();
      this.Form.controls['scope'].clearValidators();
      this.Form.controls['scope'].updateValueAndValidity();
      this.Form.controls['scope_1_cateogry'].clearValidators();
      this.Form.controls['scope_1_cateogry'].updateValueAndValidity();

      this.Form.controls['amount'].setErrors(null)
      this.Form.controls['control_device'].setValue(false)
      this.Form.controls['treatment_outcome_recycled'].setErrors(null)
      this.Form.controls['treatment_outcome_reused'].setErrors(null)
      const pollutantsData = this.consumptionDropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Pollutants Emitted')
      })

      this.pollutants = pollutantsData

      const sourceTypeData = this.consumptionDropDownValues.filter(function (elem: any) {
        return elem.attributes.Category === 'Source Type';
      });
      this.source_type = sourceTypeData;
    }
    const quantity = this.dropDownValues.filter(function (elem: any) {
      return (elem.attributes.Category === 'Quantity Source' && elem.attributes.filter !== 'Waste')
    })
    this.quantities = quantity
    const applicabilityData = this.dropDownValues.filter(function (elem: any) {
      return (elem.attributes.Category === 'Applicability')
    })
    this.applicabilities = applicabilityData
    const fiter = this.applicabilities.filter(function (elem: any) {
      return (elem.attributes.Value !== 'Domestic' && elem.attributes.Value !== "Production")
    })

    this.filteredApplicabilities = fiter
  }
  private _filter(name: string) {
    const filterValue = name.toLowerCase();

    return this.refrigerantTypes.filter(option => option.toLowerCase().includes(filterValue));
  }



  sourceVal(data: any) {

    if (this.Form.value.consumption_category !== 'Air Emission') {
      this.Form.controls['quantity'].reset()
    }

    const category = this.Form.value.consumption_category
    const existData = this.defaults?.consumptions?.filter(function (elem: any) {
      return (elem?.consumption_category === category && elem?.source === data?.value)
    })
    this.renewableEnergySources = [];
    this.renewable = false
    this.Form.controls['renewable_energy_source'].reset()
    this.applicability.reset()
    this.Treatment_outcome_Quantity.reset()
    this.Form.controls['applicability'].reset();
    this.Form.controls['treatment_outcome'].clearValidators();
    this.Form.controls['treatment_outcome'].updateValueAndValidity();
    this.Form.controls['treatment_outcome'].reset()
    this.Form.controls['renewable_energy_source'].removeValidators(Validators.required)
    this.Form.controls['renewable_energy_source'].updateValueAndValidity();
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
            this.Form.controls['refrigerant_type'].reset()
            this.Form.controls['unit'].setValue(unit[0].attributes.unit)
            this.Form.controls['emission_factor'].setValue(unit[0].attributes.emission_factor)
            this.Form.controls['conversion_factor'].setValue(unit[0].attributes.conversion_factor)
            this.Form.controls['conversion_required'].setValue(unit[0].attributes.conversion_required)
            this.Form.controls['unit'].disable()
            this.Form.controls['refrigerant_type'].setErrors(null)
          }
          // else if (data.value === 'Refrigerants') {
          //   const unit = this.consumptionDropDownValues.filter(function (elem: any) {
          //     return (elem.attributes.Value === data.value)
          //   })
          //   this.Form.controls['refrigerant_type'].reset()
          //   this.Form.controls['unit'].reset()
          //   this.Form.controls['scope'].setValue('Scope-1')
          //   this.Form.controls['scope_1_cateogry'].setValue('Refrigerants and Fugitives')

          // }



          if (data.value === 'Industrial' || data.value === 'Domestic') {
            this.Form.controls['treatment_outcome'].setValidators([Validators.required])
            this.Form.controls['treatment_outcome'].updateValueAndValidity();
          }
          if (data.value === 'Combined') {
            this.Form.controls['treatment_outcome'].setErrors(null)
            this.Form.controls['reused_recycled_quantity'].setErrors(null)
            this.Form.controls['applicability'].setErrors(null)
            this.applicability.clearValidators();
            this.applicability.updateValueAndValidity();

            this.Form.controls['treatment_outcome_recycled'].setErrors(null)
            this.Form.controls['treatment_outcome_reused'].setErrors(null)
          }
          if (category === "Energy") {
            const renewable = this.consumptionDropDownValues.filter(function (elem: any) {
              return (elem.attributes.Value === data.value && elem.attributes.renewable)
            })
            if (renewable.length !== 0) {
              const renewableEnergySources = this.dropDownValues.filter(function (elem: any) {
                return elem.attributes.Category === 'Renewable Energy Source';
              });
              this.renewableEnergySources = renewableEnergySources;
              this.renewable = true
              this.Form.controls['renewable_energy_source'].setValidators([Validators.required])
              this.Form.controls['renewable_energy_source'].updateValueAndValidity();

            } else {
              this.Form.controls['renewable_energy_source'].reset()
            }
            const unit = this.consumptionDropDownValues.filter(function (elem: any) {
              return (elem.attributes.Value === data.value)
            })

            if (unit[0].attributes.emission_factor) {
              this.Form.controls['scope'].setValidators([Validators.required])
            }
            else if (!unit[0].attributes.emission_factor) {
              this.Form.controls['scope'].removeValidators(Validators.required)
            }
            this.Form.controls['scope'].updateValueAndValidity();


          }
        }
      });
    } else {

      if (data.value !== 'Refrigerants' && this.Form.value.consumption_category !== 'Air Emission') {
        const sourceData = this.consumptionDropDownValues.filter(function (elem: any) {
          return (elem.attributes.Value === data.value && elem.attributes.Category === 'Source')
        })

        this.Form.controls['refrigerant_type'].reset()
        this.Form.controls['unit'].setValue(sourceData[0].attributes.unit)
        this.Form.controls['emission_factor'].setValue(sourceData[0].attributes.emission_factor)
        this.Form.controls['conversion_factor'].setValue(sourceData[0].attributes.conversion_factor)
        this.Form.controls['conversion_required'].setValue(sourceData[0].attributes.conversion_required)
        this.Form.controls['unit'].disable()
        this.Form.controls['refrigerant_type'].setErrors(null)
      }
      // else if (data.value === 'Refrigerants') {
      //   const unit = this.consumptionDropDownValues.filter(function (elem: any) {
      //     return (elem.attributes.Value === data.value)
      //   })

      //   this.Form.controls['refrigerant_type'].reset()
      //   this.Form.controls['scope'].setValue('Scope-1')
      //   this.Form.controls['scope_1_cateogry'].setValue('Refrigerants and Fugitives')
      //   this.Form.controls['unit'].reset()

      // }
      if (category === 'Water' && data.value === 'Ground Water') {
        this.Form.controls['water_type'].setValue('Bluewater')
      }
      else {
        this.Form.controls['water_type'].reset()
        this.Form.controls['water_type'].setErrors(null)
      }
      if (data.value === 'Industrial' || data.value === 'Domestic') {
        this.Form.controls['treatment_outcome'].setValidators([Validators.required])
        this.Form.controls['treatment_outcome'].updateValueAndValidity();

      }
      if (data.value === 'Combined') {
        this.Form.controls['treatment_outcome'].setErrors(null)
        this.Form.controls['reused_recycled_quantity'].setErrors(null)
        this.Form.controls['applicability'].setErrors(null)
        this.applicability.clearValidators();
        this.applicability.updateValueAndValidity();

        this.Form.controls['treatment_outcome_recycled'].setErrors(null)
        this.Form.controls['treatment_outcome_reused'].setErrors(null)
      }
      if (category === "Energy") {
        const renewable = this.consumptionDropDownValues.filter(function (elem: any) {
          return (elem.attributes.Value === data.value && elem.attributes.renewable)
        })
        if (renewable.length !== 0) {
          const renewableEnergySources = this.dropDownValues.filter(function (elem: any) {
            return elem.attributes.Category === 'Renewable Energy Source';
          });
          this.renewableEnergySources = renewableEnergySources;
          this.renewable = true
          this.Form.controls['renewable_energy_source'].setValidators([Validators.required])
          this.Form.controls['renewable_energy_source'].updateValueAndValidity();

        } else {
          this.Form.controls['renewable_energy_source'].reset()
        }
        const unit = this.consumptionDropDownValues.filter(function (elem: any) {
          return (elem.attributes.Value === data.value)
        })
        if (unit[0].attributes.emission_factor) {
          this.Form.controls['scope'].setValidators([Validators.required])
        }
        else if (!unit[0].attributes.emission_factor) {
          this.Form.controls['scope'].removeValidators(Validators.required)
        }
        this.Form.controls['scope'].updateValueAndValidity();

      }
    }

    const selectedSource = this.consumptionDropDownValues.find((elem: any) => elem.attributes.Value === data.value && elem.attributes.Category === 'Source');
    if (selectedSource) {
      const filterScopeValue = selectedSource.attributes.scope_filter;
      if (filterScopeValue) {
        this.Form.controls['scope'].setValue(filterScopeValue);
        if (filterScopeValue !== 'Scope-1') {
          this.Form.controls['scope_1_cateogry'].removeValidators(Validators.required)
          this.Form.controls['scope_1_cateogry'].updateValueAndValidity();
        }
        else {
          this.Form.controls['scope_1_cateogry'].setValidators(Validators.required)
          this.Form.controls['scope_1_cateogry'].updateValueAndValidity();
        }

        this.Form.controls['scope'].setValue(filterScopeValue);
        if (data.value === 'Refrigerants') {
          this.Form.controls['refrigerant_type'].reset()
          this.Form.controls['scope_1_cateogry'].setValue('Refrigerants and Fugitives')
          this.Form.controls['unit'].reset()

        } else {
          this.Form.controls['scope_1_cateogry'].reset();
        }
      }
      else {
        this.Form.controls['scope'].reset();
        this.Form.controls['scope_1_cateogry'].reset();

      }
    }
  }
  addPollutantsEmitted() {
    this.dialog
      .open(AddPollutantsEmittedComponent, {
        width:"50%",
        data: this.pollutantsEmitted
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          const existingPollutant = this.pollutantsEmitted.find(
            (item) => item.pollutants_emitted === data.pollutants_emitted
          );
          if (existingPollutant) {
            this._snackBar.open("The  pollutants emitted have been  already included in the list.", 'Close', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          } else {
            this.pollutantsEmitted.push(data);
          }
        }
      });
  }

  ChangeWasteType(event:any){
    const selectedValue = event.value
        const filteredCategory=this.wasteTypes.filter((data:any)=>{
      return data.attributes.type.toLowerCase()==selectedValue.toLowerCase()
    })
    this.Form.controls['category'].setValue(filteredCategory[0].attributes.category)
     
    const sourceData = this.consumptionDropDownValues.filter(function (elem: any) {
      return (elem.attributes.waste_filter === event.value)
    })

    this.source = sourceData
   
  }


  addMeter() {
    const meterInfo = null;
    const selectedDivision = this.defaults.selectedDivision;
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


          this.addedMeters.push(data);
          const meterList = this.addedMeters;


          const totalQuantity = meterList.reduce((sum: number, item: any) => {
            return sum + (item?.quantity || 0);
          }, 0);
          this.Form.controls['quantity'].setValue(totalQuantity);
          this.kwhQuantity('')
        }
      });
  }


  editMeter(data: any, i: number) {


    const category = this.Form.get('consumption_category')?.value;
    const unit = this.Form.get('unit')?.value;
    let meterInfo = data
    meterInfo.category = category
    meterInfo.unit = unit


    this.dialog
      .open(AddMeterComponent, { data: meterInfo })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.addedMeters[i] = data

          const meterList = this.addedMeters;


          const totalQuantity = meterList.reduce((sum: number, item: any) => {
            return sum + (item?.quantity || 0);
          }, 0);
          this.Form.controls['quantity'].setValue(totalQuantity);
          this.kwhQuantity('')

        }
      });

  }

  deleteMeter(data: any, i: number) {
    this.addedMeters.splice(i, 1);
    const meterList = this.addedMeters;


    const totalQuantity = meterList.reduce((sum: number, item: any) => {
      return sum + (item?.quantity || 0);
    }, 0);
    this.Form.controls['quantity'].setValue(totalQuantity);
    this.kwhQuantity('')

  }
  viewPollutantsEmitted(data: any) {
    // this.dialog.open(ViewPollutantsEmittedComponent, {
    //   data: data
    // }).afterClosed().subscribe((customer) => {
    // });
  }
  deletePollutantsEmitted(data: any) {
    this.pollutantsEmitted.splice(this.pollutantsEmitted.findIndex((data) => data.id === data.id), 1);
  }
  editPollutantsEmitted(data: any, index: number) {
    const dialogRef = this.dialog.open(EditPollutantsEmittedComponent, {
      data: data,
      width:'50%'
    });

    dialogRef.afterClosed().subscribe((updatedData) => {
      if (updatedData) {
        if (index !== -1) {
          this.pollutantsEmitted[index] = updatedData;
        } else {
        }
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
        const emissionFactor = this.Form.value.emission_factor
        const emissionValue = Number((Number(quantity_kwh) * Number(emissionFactor)) / 1000)
        this.Form.controls['emission_value'].setValue(emissionValue)
        const ghgValue = (Number(Math.round(Number(quantity) * Number(emissionFactor)) / 1000)).toFixed(2) || 0
        const conversionValue = Number(Number(quantity) * Number(conversion_factor)).toFixed(0)
        this.Form.controls['ghg_value'].setValue(ghgValue)
        this.Form.controls['conversion_value'].setValue(conversionValue)
      } else {
        this.Form.controls['quantity_kwh'].setValue(quantity)
        const emissionFactor = this.Form.value.emission_factor
        const emissionValue = Number((Number(quantity) * Number(emissionFactor)) / 1000)
        this.Form.controls['emission_value'].setValue(emissionValue)
        const ghgValue = (Number(Math.round(Number(quantity) * Number(emissionFactor)) / 1000)).toFixed(2) || 0
        const conversionValue = Number(Number(quantity) * Number(conversion_factor)).toFixed(0)
        this.Form.controls['ghg_value'].setValue(ghgValue)
        this.Form.controls['conversion_value'].setValue(conversionValue)
      }
    }
  }



  new_source() {
    const consumptionCategory = this.Form.value.consumption_category;
    if (!consumptionCategory) {
      this._snackBar.open("Please Select a Consumption Category To Create New Source", 'Ok', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      return;
    }

    else {
      this.dialog.open(CreateNewSourceComponent, {
        data: {
          consumptionCategory: consumptionCategory
        }
      }).afterClosed().subscribe((data: any) => {
        if (data) {
          const module = "Environment";
          const category = "Source";
          const name = data.source;
          const unit = data.unit;
          const filter = consumptionCategory;
          const wastetype = this.Form.value.waste_type


          if (this.source.some(source => source.attributes.Value === name)) {
            this._snackBar.open("Source already exists", 'Ok', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            return;
          }

          this.environmentService.create_source(module, category, name, filter, unit, wastetype).subscribe({
            next: (result: any) => {
              this.environmentService.get_consumption_dropdown_values(module).subscribe({
                next: (result: any) => {
                  this.consumptionDropDownValues = result.data;
                  const sourceData = this.consumptionDropDownValues.filter((elem: any) => {
                    return elem.attributes.filter === filter && elem.attributes.Category !== 'Quantity Source' && elem.attributes.Category !== 'Unit';
                  });
                  const filteredSourceData=sourceData.filter((elem)=>{
                    return elem.attributes.waste_filter==this.Form.value.waste_type
                  })
                  
                  this.source = filteredSourceData;

                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"]);
                },
                complete: () => {
                  const unit = result.data.attributes.unit;

                  this.Form.controls['source'].setValue(name);
                  this.Form.controls['unit'].setValue(unit);

                  const statusText = "New Source created successfully";
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                }
              });
            },
            error: (err: any) => {

              this.router.navigate(["/error/internal"]);
            },
            complete: () => { }
          });
        }
      });
    }
  }

  new_waste_type(){
    this.dialog.open(CreateWasteTypeComponent,{
      data:{
        categories:this.categories
      }
    }).afterClosed().subscribe((data: any) => {
      const enteredWasteType = data.waste_type.trim().toLowerCase(); 
      const found = this.wasteTypes.find(
        elem => elem.attributes.type.trim().toLowerCase() === enteredWasteType
      );
        if (found) {
          const statusText = "Waste Type already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
        else{
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
        }
 
      
    })
  }

  Applicabilities(event: any) {
    const selectedValues = event.value;
    const toSeperate = selectedValues.join(', ');
    this.Form.controls['applicability'].setValue(toSeperate);

  }

  UsageType(event: any) {
    const selectedValues = event.value.join(', '); // Join values with a comma and space
    this.Form.controls['usage_type'].setValue(selectedValues);
  }

  onRecStatusChange(event: any) {

    if (!event) {
      this.Form.controls['rec_status'].setValue(false)
      this.Form.controls['rec_type'].setValue('')
      this.Form.controls['i_rec_quantity'].setValue(null)
    }
  }
  update_testing_organizaton(ID: any) {
    this.dialog.open(CreateTestingOrganizationComponent, { data: ID }).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.TestingOrganization.find(obj => obj.attributes.name === data.name)
        this.environmentService.update_testing_organizaton(data, this.userId).subscribe({
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
          this.environmentService.create_testing_organization(data, this.userId).subscribe({
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

  addRefrigerant() {
    this.Form.controls['unit'].enable()
    this.dialog.open(RefrigerantComponent, {
      data: { refrigerants: this.refrigerants, unit: this.Form.value.unit, mode: 'create' }
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.refrigerants.push(data.refrigerants);

        this.Form.controls['refrigerants']?.setValue(this.refrigerants);

        if (this.refrigerants?.length > 0) {
          const totalQuantity = this.refrigerants.reduce((sum, item) => sum + item.quantity, 0);
          this.Form.controls['quantity']?.setValue(totalQuantity);
          this.kwhQuantity(totalQuantity);
        }

      }
    });
  }

  deleteRefrigerant(index: number) {

    if (index > -1 && index < this.refrigerants?.length) {
      this.refrigerants.splice(index, 1);
    }
  }

  viewRefrigerant(data: any) {
    this.dialog.open(ViewRefrigerantComponent, {
      data: data
    }).afterClosed().subscribe((customer) => {
    });
  }

  editRefrigerant(data: any, index: number) {
    if (index > -1 && index < this.refrigerants?.length) {
      this.refrigerants.splice(index, 1);
    }
    this.Form.controls['refrigerants']?.setValue(null);
    this.Form.controls['quantity']?.setValue(null);

    this.dialog.open(RefrigerantComponent, {
      data: { attributes: data, mode: 'update' }
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.refrigerants.push(data.refrigerants);
        this.Form.controls['refrigerants']?.setValue(this.refrigerants);

        if (this.refrigerants?.length > 0) {
          const totalQuantity = this.refrigerants.reduce((sum, item) => sum + item.quantity, 0);
          this.Form.controls['quantity']?.setValue(totalQuantity);
          this.kwhQuantity(totalQuantity);
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
        this.Form.controls['con_issues']?.setValue(this.IssueList);
      }
    });
  }

  deleteIssue(index: number) {
    if (index > -1 && index < this.IssueList?.length) {
      this.IssueList.splice(index, 1);
    }
  }

  viewIssue(data: any) {
    this.dialog.open(ViewIssueComponent, {
      data: { attributes: data }
    }).afterClosed().subscribe((customer) => {
    });
  }

  editIssue(data: any, index: number) {
    if (index > -1 && index < this.IssueList?.length) {
      this.IssueList.splice(index, 1);
    }
    this.Form.controls['con_issues']?.setValue(null);
    this.dialog.open(NewIssueComponent, {
      data: { attributes: data, mode: 'update' }
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.IssueList.push(data.issueList);
        this.Form.controls['con_issues']?.setValue(this.IssueList);
      }
    });
  }



  get_supplier() {
    this.environmentService.get_supplier().subscribe({
      next: (result: any) => {
        this.supplierList = result?.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  create_supplier() {
    this.dialog.open(NewSupplierComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.supplierList.find(obj => obj.attributes?.name === data?.name);
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


}