import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from 'src/app/services/general.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { LightboxConfig } from 'ngx-lightbox';
import { Router } from '@angular/router';

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
  selector: 'app-view-consumption',
  templateUrl: './view-consumption.component.html',
  styleUrls: ['./view-consumption.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewConsumptionComponent implements OnInit {
  Form: FormGroup
  mode: 'create' | 'update' = 'create';
  dropDownValues: any[] = []
  consumCategory: any[] = []
  source: any[] = []
  categories: any[] = []
  disposalMethod: any[] = []
  scopes: any[] = []
  quantities: any[] = []
  consumptions: any[] = []
  evidences: any[] = []
  consumptionDropDownValues: any[] = []
  pollutantsEmitted: any[] = []
  units: any[] = []
  applicabilities: any[] = [];
  applicability = new FormControl(null, [Validators.required]);
  collectedFrom = new FormControl(null, [Validators.required]);
  latesttest = new FormControl(null, [Validators.required]);
  collectedTo = new FormControl(null, [Validators.required]);
  disposalDate = new FormControl(null);
  files: File[] = [];
  renewable: boolean = false
  refrigerants: any[] = []
  IssueList: any[] = []
  supplierList: any[] = []

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<ViewConsumptionComponent>,
    private formBuilder: FormBuilder,
    private _lightboxConfig: LightboxConfig,
    private generalService: GeneralService,
    private environmentService: EnvironmentService,
    private router: Router
  ) {
    this._lightboxConfig.fitImageInViewPort = true;
    this._lightboxConfig.centerVertically = true;
  }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      consumption_category: ['', [Validators.required]],
      waste_type: ['', [Validators.required]],
      category: ['', [Validators.required]],
      source: ['', [Validators.required]],
      source_capacity: [''],
      control_device: [null, [Validators.required]],
      legal_emission_limit: [0, [Validators.required]],
      monitoring_frequency: ['', [Validators.required]],
      latest_test: ['', [Validators.required]],
      quantitysource: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      amount: [''],
      renewable_energy_source: [''],
      scope: ['', [Validators.required]],
      description: [''],
      treatment: ['', [Validators.required]],
      collected_from: ['', [Validators.required]],
      collected_to: ['', [Validators.required]],
      disposal_method: ['', [Validators.required]],
      water_type: ['', [Validators.required]],
      disposal_date: [''],
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
      refrigerant_type: [''],
      reused_recycled_quantity: [''],
      treatment_outcome_recycled: [''],
      treatment_outcome_reused: [''],
      applicability: [''],
      treatment_outcome: [''],
      usage_type: [''],
      rec_status: [false],
      rec_type: [''],
      i_rec_quantity: [null],
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

    });
    if (this.defaults) {



      this.Form.controls['consumption_category'].setValue(this.defaults.consumption_category)
      this.Form.controls['waste_type'].setValue(this.defaults.waste_type)
      this.Form.controls['category'].setValue(this.defaults.category)
      this.Form.controls['source'].setValue(this.defaults.source)
      this.Form.controls['latest_test'].setValue(this.defaults.latest_test)
      this.Form.controls['monitoring_frequency'].setValue(this.defaults.monitoring_frequency)
      this.Form.controls['legal_emission_limit'].setValue(this.defaults.legal_emission_limit)
      this.Form.controls['control_device'].setValue(this.defaults.control_device)
      this.Form.controls['source_capacity'].setValue(this.defaults.source_capacity)
      this.Form.controls['unit'].setValue(this.defaults.unit)
      this.Form.controls['quantity'].setValue(this.defaults.quantity)
      this.Form.controls['amount'].setValue(this.defaults.amount)
      this.Form.controls['scope'].setValue(this.defaults.scope)
      this.Form.controls['description'].setValue(this.defaults.description)
      this.Form.controls['treatment'].setValue(this.defaults.treatment)
      this.Form.controls['collected_from'].setValue(this.defaults.collected_from)
      this.Form.controls['collected_to'].setValue(this.defaults.collected_to)
      this.Form.controls['disposal_method'].setValue(this.defaults.disposal_method)
      this.Form.controls['water_type'].setValue(this.defaults.water_type)
      this.Form.controls['disposal_date'].setValue(this.defaults.disposal_date)
      this.Form.controls['consignment_number'].setValue(this.defaults.consignment_number)
      this.Form.controls['disposer'].setValue(this.defaults.disposer)
      this.Form.controls['carrier'].setValue(this.defaults.carrier)
      this.Form.controls['usage_type'].setValue(this.defaults.usage_type)
      this.Form.controls['renewable_energy_source'].setValue(this.defaults.renewable_energy_source);
      this.Form.controls['rec_status'].setValue(this.defaults.rec_status)
      this.Form.controls['rec_type'].setValue(this.defaults.rec_type)
      this.Form.controls['i_rec_quantity'].setValue(this.defaults.i_rec_quantity)
      this.Form.controls['source_type'].setValue(this.defaults.source_type);
      this.Form.controls['volumetric_flow_rate'].setValue(this.defaults.volumetric_flow_rate);
      this.Form.controls['operation_time'].setValue(this.defaults.operation_time);
      this.Form.controls['testing_organization'].setValue(this.defaults.testing_organization);
      this.Form.controls['compliance_status'].setValue(this.defaults.compliance_status);
      this.Form.controls['opening_balance'].setValue(this.defaults.opening_balance);
      this.Form.controls['purchased_quantity'].setValue(this.defaults.purchased_quantity);
      this.Form.controls['purchase_date'].setValue(this.defaults.purchase_date);
      this.Form.controls['supplier_name'].setValue(this.defaults.supplier_name);
      this.Form.controls['stock_balance'].setValue(this.defaults.stock_balance);
      this.Form.controls['add_issue'].setValue(this.defaults.add_issue);
      if (this.defaults.renewable_energy_source) {
        this.renewable = true
      }
      this.Form.controls['meter_reading'].setValue(this.defaults.meter_reading)
      this.Form.controls['quantity_source'].setValue(this.defaults.quantity_source)
      this.Form.controls['disposal_place'].setValue(this.defaults.disposal_place)
      if (this.defaults.pollutantsEmitted) {
        this.Form.controls['pollutants_emitted'].setValue(this.defaults?.pollutantsEmitted[0]?.pollutants_emitted)
      }
      this.Form.controls['concentration'].setValue(this.defaults.concentration)
      this.Form.controls['determined_by'].setValue(this.defaults.determined_by)
      this.Form.controls['refrigerant_type'].setValue(this.defaults.refrigerant_type)
      this.Form.controls['reused_recycled_quantity'].setValue(this.defaults.reused_recycled_quantity)
      this.Form.controls['treatment_outcome_recycled'].setValue(this.defaults.treatment_outcome_recycled)
      this.Form.controls['treatment_outcome_reused'].setValue(this.defaults.treatment_outcome_reused)
      this.get_dropdown_values()

      this.Form.controls['applicability'].setValue(this.defaults.applicability);
      const defaultValues = this.defaults.applicability?.split(',').map((value: string) => value.trim());
      this.applicability.setValue(defaultValues);
      this.Form.controls['treatment_outcome'].setValue(this.defaults.treatment_outcome)
      const collectedFromDate = new Date(this.defaults.collected_from);
      collectedFromDate.setDate(collectedFromDate.getDate() - 1);
      this.collectedFrom.setValue(collectedFromDate);

      const collectedToDate = new Date(this.defaults.collected_to);
      collectedToDate.setDate(collectedToDate.getDate() - 1);
      this.collectedTo.setValue(collectedToDate);
      if (this.defaults.disposal_date != null) {
        this.disposalDate.setValue(new Date(this.defaults.disposal_date))
      }
      this.latesttest.setValue(new Date(this.defaults.latest_test))
      this.files = this.defaults.files
      this.refrigerants = this.defaults.refrigerants
      this.IssueList = this.defaults.con_issues
      this.Form.disable()
      this.collectedFrom.disable()
      this.collectedTo.disable()
      this.disposalDate.disable()
      this.latesttest.disable()
    }

  }

  close() {
    this.dialogRef.close();
  }
  get_dropdown_values() {
    const module = 'Environment';
    this.generalService.get_applicability_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValues = result.data;
      },
      error: (err: any) => { },
      complete: () => {
        this.get_consumption_dropdown_values();
        this.get_supplier()
      },
    });
  }

  get_consumption_dropdown_values() {
    const module = "Environment";
    this.environmentService.get_consumption_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.consumptionDropDownValues = result.data;
        const pollutantsData = this.consumptionDropDownValues.filter((elem: any) => {
          return (elem.attributes.Category === 'Pollutants Emitted');
        });

        this.pollutantsEmitted = pollutantsData;
        this.units = this.pollutantsEmitted.map((pollutant) => pollutant.attributes.unit);
      },
      error: (err: any) => { },
      complete: () => {
        const source = this.Form.value.source
        const renewable = this.consumptionDropDownValues.filter(function (elem: any) {
          return (elem.attributes.Value === source && elem.attributes.renewable)
        })
        if (renewable.length !== 0) {
          // const renewableEnergySources = this.dropDownValues.filter(function (elem: any) {
          //   return elem.attributes.Category === 'Renewable Energy Source';
          // });
          // this.renewableEnergySources = renewableEnergySources;
          this.renewable = true
          this.Form.controls['renewable_energy_source'].setValidators([Validators.required])
          this.Form.controls['renewable_energy_source'].updateValueAndValidity();

        } else {
          this.Form.controls['renewable_energy_source'].reset()
        }
        this.applicabilityData();
      }
    });
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

  applicabilityData() {
    this.applicabilities = [];
    const applicability_data = this.dropDownValues.filter((elem: any) => {
      return elem.attributes.Category === 'Applicability';
    });
    this.applicabilities = applicability_data;
  }

  Applicabilities(event: any) {
    const selectedValues = event.value;
    const toSeparate = selectedValues.join(', ');
    this.Form.controls['applicability'].setValue(toSeparate);
  }

  isDisabled(value: string): boolean {
    return true; // Replace this condition with your logic
  }

  openPdf(file: any) {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }


}
