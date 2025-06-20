import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { category } from 'src/app/apps/audit-inspection/audit-calendar/audit-calendar/data';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { TargetSettingService } from 'src/app/services/target-setting.service';

@Component({
  selector: 'app-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.scss']
})
export class AddSourceComponent implements OnInit {
  Form: FormGroup
  dropdownValues: any[] = []
  sources: any[] = []
  standards: any[] = []
  emission_factor: any
  emission_data: any[] = []
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddSourceComponent>,
    private formBuilder: FormBuilder,
    private targetService: TargetSettingService,
    private generalService: GeneralService,
    public dialog: MatDialog,) {



  }

  ngOnInit(): void {
    if (this.data.source) {
      this.mode = 'update';
    }
    this.Form = this.formBuilder.group({
      category: [this.data.category || '', Validators.required],
      source: [this.data?.source || '', Validators.required],
      baseline_consumption: [this.data?.baseline_consumption || '', Validators.required],
      standard: [this.data?.standard || ''],
      GHG_emission: [this.data?.GHG_emission || '', Validators.required],
      expected_savings: [this.data?.expected_savings || '', Validators.required],
      baseline_Unit: [''],
      sq_specific: [this.data?.specific || null]
    });

    if (this.data.category == 'Energy' && this.Form.value.sq_specific == true) {
      this.Form.controls['standard'].setValidators(Validators.required)
      this.Form.controls['standard'].updateValueAndValidity()
    }
    else {
      this.Form.controls['standard'].removeValidators(Validators.required)
      this.Form.controls['standard'].updateValueAndValidity()
    }
    this.get_dropdown_values()
    this.get_emission_factor()

    console.log("sq", this.data);

  }


  get_dropdown_values() {
    const category = this.Form.value.category
    const module = "Target Setting"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data

        const standard = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Standard")
        })
        this.standards = standard
        const source = this.dropdownValues.filter(function (elem: any) {
          return (elem.attributes.Category === "Source" && elem.attributes.filter === category)
        })
        this.sources = source
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_emission_factor() {
    this.targetService.get_emission_factor().subscribe({
      next: (result: any) => {
        this.emission_data = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  calcGhgEmission() {
    const souceValue = this.Form.value.source;
    const standardValue = this.Form.value.standard;
    const baselinConsumption = this.Form.value.baseline_consumption;

    if (this.Form.value.sq_specific == true) {
      const emissionFactor = this.emission_data.filter((elem: any) => {
        return elem.attributes?.source === souceValue && elem.attributes?.standard === standardValue;
      });

      const emissionFactorValue = emissionFactor[0]?.attributes?.emission_factor;

      if (emissionFactorValue) {
        const GHGValue = baselinConsumption * this.emission_factor;
        const roundedGHG = parseFloat(GHGValue.toFixed(2));

        // Round to 2 decimal places
        this.Form.controls['GHG_emission'].setValue(roundedGHG);
      } else {
        this.Form.controls['GHG_emission'].reset();
      }
    }
    else {
      const GHGValue = baselinConsumption * this.emission_factor;
      const roundedGHG = parseFloat(GHGValue.toFixed(2));
      this.Form.controls['GHG_emission'].setValue(roundedGHG);

    }


  }


  CalculateGHG(data: any) {
    const souceValue = this.Form.value.source;
    const standardValue = this.Form.value.standard;
    const baselinConsumption = this.Form.value.baseline_consumption;

    const emissionFactor = this.emission_data.filter((elem: any) => {
      return elem.attributes?.source === souceValue && elem.attributes?.standard === standardValue;
    });

    const emissionFactorValue = emissionFactor[0]?.attributes?.emission_factor;

    if (emissionFactorValue) {
      const GHGValue = baselinConsumption * emissionFactorValue;
      const roundedGHG = parseFloat(GHGValue.toFixed(2));  // Round to 2 decimal places
      this.Form.controls['GHG_emission'].setValue(roundedGHG);
    } else {
      this.Form.controls['GHG_emission'].reset();
    }
  }

  category(data: any) {
    const category = data.value
    const source = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Source" && elem.attributes.filter === category)
    })
    this.sources = source

  }
  source(data: any) {

    const source = this.sources.filter(function (elem: any) {
      return (elem.attributes.Category === "Source" && elem.attributes.Value === data.value)
    })
    this.emission_factor = source[0].attributes.emission_factor
    console.log("data", source)

    this.Form.controls['baseline_Unit'].setValue(source[0].attributes.unit)

  }

  submit() {
    this.dialogRef.close(this.Form.value)
  }

  checkFormErrors(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control && control.invalid) {
        console.log(`Field: ${field} has error:`, control.errors);
      }
    });
  }
  update() {
    this.dialogRef.close(this.Form.value);
  }
}
