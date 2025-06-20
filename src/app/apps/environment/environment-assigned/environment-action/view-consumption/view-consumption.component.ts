import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { environment } from 'src/environments/environment';
import { Lightbox } from 'ngx-lightbox';

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
export class ViewActionConsumptionComponent implements OnInit {
  Form: FormGroup
  mode: 'create' | 'update' = 'create';
  dropDownValues: any[] = []
  consumptionDropDownValues: any[] = []
  consumCategory: any[] = []
  source: any[] = []
  categories: any[] = []
  disposalMethod: any[] = []
  scopes: any[] = []
  quantities: any[] = []
  consumptions: any[] = []
  evidences: any[] = []
  renewable: boolean = false
  collectedFrom = new FormControl(null, [Validators.required]);
  collectedTo = new FormControl(null, [Validators.required]);
  disposalDate = new FormControl(null);
  latesttest = new FormControl(null, [Validators.required]);
  files: File[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
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

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<ViewActionConsumptionComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private generalService: GeneralService,
    private environmentService: EnvironmentService,
    private _lightbox: Lightbox) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      consumption_category: ['', [Validators.required]],
      category: ['', [Validators.required]],
      source: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      amount: [''],
      scope: ['', [Validators.required]],
      description: [''],
      water_type: [''],
      renewable_energy_source: [''],
      source_capacity: [''],
      control_device: [null, [Validators.required]],
      legal_emission_limit: [0, [Validators.required]],
      monitoring_frequency: ['', [Validators.required]],
      latest_test: ['', [Validators.required]],
      treatment: ['', [Validators.required]],
      collected_from: ['', [Validators.required]],
      collected_to: ['', [Validators.required]],
      disposal_method: ['', [Validators.required]],
      disposal_date: ['', [Validators.required]],
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
      scope_1_cateogry: ['', [Validators.required]],
      source_type: [''],
      volumetric_flow_rate: [null],
      operation_time: [null],
      testing_organization: [''],
      compliance_status: [''],
      waste_type: ['']
    });
    this.get_dropdown_values()
    if (this.defaults) {
      this.files = []

      this.Form.controls['consumption_category'].setValue(this.defaults.attributes.consumption_category)
      this.Form.controls['category'].setValue(this.defaults.attributes.category)
      this.Form.controls['waste_type'].setValue(this.defaults.attributes.waste_type)
      this.Form.controls['source'].setValue(this.defaults.attributes.source)
      this.Form.controls['unit'].setValue(this.defaults.attributes.unit)
      this.Form.controls['quantity'].setValue(this.defaults.attributes.quantity)
      this.Form.controls['amount'].setValue(this.defaults.attributes.amount)
      this.Form.controls['scope'].setValue(this.defaults.attributes.scope)
      this.Form.controls['description'].setValue(this.defaults.attributes.description)
      this.Form.controls['treatment'].setValue(this.defaults.attributes.treatment)
      this.Form.controls['collected_from'].setValue(this.defaults.attributes.collected_from)
      this.Form.controls['collected_to'].setValue(this.defaults.attributes.collected_to)
      this.Form.controls['latest_test'].setValue(this.defaults.attributes.latest_test)
      this.Form.controls['monitoring_frequency'].setValue(this.defaults.attributes.monitoring_frequency)
      this.Form.controls['legal_emission_limit'].setValue(this.defaults.attributes.legal_emission_limit)
      this.Form.controls['control_device'].setValue(this.defaults.attributes.control_device)
      this.Form.controls['source_capacity'].setValue(this.defaults.attributes.source_capacity)
      this.Form.controls['disposal_method'].setValue(this.defaults.attributes.disposal_method)
      this.Form.controls['disposal_date'].setValue(this.defaults.attributes.disposal_date)
      this.Form.controls['consignment_number'].setValue(this.defaults.attributes.consignment_number)
      this.Form.controls['disposer'].setValue(this.defaults.attributes.disposer)
      this.Form.controls['carrier'].setValue(this.defaults.attributes.carrier)
      this.Form.controls['disposal_place'].setValue(this.defaults.attributes.disposal_place)
      this.Form.controls['pollutants_emitted'].setValue(this.defaults.attributes.pollutants_emitted)
      this.Form.controls['concentration'].setValue(this.defaults.attributes.concentration)
      this.Form.controls['determined_by'].setValue(this.defaults.attributes.determined_by)
      this.Form.controls['water_type'].setValue(this.defaults.attributes.water_type)
      this.Form.controls['meter_reading'].setValue(this.defaults.attributes.meter_reading)
      this.Form.controls['quantity_source'].setValue(this.defaults.attributes.quantity_source)
      this.Form.controls['refrigerant_type'].setValue(this.defaults.attributes.refrigerant_type)
      this.Form.controls['reused_recycled_quantity'].setValue(this.defaults.attributes.reused_recycled_quantity)
      this.Form.controls['treatment_outcome_recycled'].setValue(this.defaults.attributes.treatment_outcome_recycled)
      this.Form.controls['treatment_outcome_reused'].setValue(this.defaults.attributes.treatment_outcome_reused)
      this.Form.controls['applicability'].setValue(this.defaults.attributes.applicability)
      this.Form.controls['usage_type'].setValue(this.defaults.attributes.usage_type)
      this.Form.controls['renewable_energy_source'].setValue(this.defaults.attributes.renewable_energy_source); 4
      this.Form.controls['rec_status'].setValue(this.defaults.attributes.rec_status)
      this.Form.controls['rec_type'].setValue(this.defaults.attributes.rec_type)
      this.Form.controls['i_rec_quantity'].setValue(this.defaults.attributes.i_rec_quantity)
      this.Form.controls['scope_1_cateogry'].setValue(this.defaults.attributes.scope_1_cateogry)
      this.Form.controls['source_type'].setValue(this.defaults.attributes.source_type);
      this.Form.controls['volumetric_flow_rate'].setValue(this.defaults.attributes.volumetric_flow_rate);
      this.Form.controls['operation_time'].setValue(this.defaults.attributes.operation_time);
      this.Form.controls['testing_organization'].setValue(this.defaults.attributes.testing_organization);
      this.Form.controls['compliance_status'].setValue(this.defaults.attributes.compliance_status);
      this.Form.controls['renewable_energy_source'].setValue(this.defaults.attributes.renewable_energy_source);

      if (this.defaults.attributes.renewable_energy_source) {
        this.renewable = true
      }
      this.Form.controls['treatment_outcome'].setValue(this.defaults.attributes.treatment_outcome)
      this.collectedFrom.setValue(new Date(this.defaults.attributes.collected_from))
      this.collectedTo.setValue(new Date(this.defaults.attributes.collected_to))
      if (this.defaults.disposal_date != null) {
        this.disposalDate.setValue(new Date(this.defaults.disposal_date))
      }
      // this.disposalDate.setValue(new Date(this.defaults.attributes.disposal_date))
      this.latesttest.setValue(new Date(this.defaults.attributes.latest_test))

      this.Form.disable()
      this.collectedFrom.disable()
      this.collectedTo.disable()
      this.disposalDate.disable()
      this.latesttest.disable()

      // if (this.defaults.attributes.evidence?.data !== null) {
      //   let eviData: any[] = []
      //   eviData.push({
      //     src: environment.client_backend + '/uploads/' + this.defaults.attributes.evidence?.data.attributes.evidence_name + '.' + this.defaults.attributes.evidence?.data.attributes.format,
      //     caption: "Evidence",
      //     thumb: environment.client_backend + '/uploads/' + this.defaults.attributes.evidence?.data.attributes.evidence_name + '.' + this.defaults.attributes.evidence?.data.attributes.format
      //   })
      //   this.evidences = eviData
      // }

      if (this.defaults.attributes.evidences.data !== null) {
        let eviData: any[] = [];
        this.defaults.attributes.evidences.data.forEach((evidence: { attributes: { evidence_name: any; format: any; }; }) => {
          eviData.push({
            src: environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format,
            caption: "Evidence",
            thumb: environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format,
            format: evidence.attributes.format,

            evidence_name: evidence.attributes.evidence_name

          })
        });
        this.evidences = eviData;
      }

      // this.Form.disable()
      // this.collectedFrom.disable()
      // this.collectedTo.disable()
      // this.disposalDate.disable()
      // this.latesttest.disable()

    }
  }

  close() {
    this.dialogRef.close();
  }
  open(index: number): void {
    this._lightbox.open(this.evidences, index);
  }




  openPdf(file: any) {
    // const fileURL = URL.createObjectURL(file);
    this.fetchPdfAndConvertToObjectUrl(file)
  }

  fetchPdfAndConvertToObjectUrl(pdfUrl: string): void {
    fetch(pdfUrl)
      .then(response => response.blob())
      .then(blob => {
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, '_blank');
      })
      .catch(error => console.error('Error fetching PDF:', error));
  }

  get_dropdown_values() {
    const module = 'Environment';
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValues = result.data;
      },
      error: (err: any) => { },
      complete: () => {
        this.get_consumption_dropdown_values();
      },
    });
  }
  get_consumption_dropdown_values() {
    const module = "Environment";
    this.environmentService.get_consumption_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.consumptionDropDownValues = result.data;
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
          this.renewable = false

        }
      }
    });
  }
}
