import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AuthService } from 'src/app/services/auth.api.service';
import { Router } from '@angular/router';
import { GeneralService } from '../../../../services/general.api.service'
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EnvironmentService } from 'src/app/services/environment.api.service';

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
  selector: 'app-edit-component',
  templateUrl: './edit-consumption.component.html',
  styleUrls: ['./edit-consumption.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})

export class EditConsumptionComponent implements OnInit {

  Form: FormGroup
  mode: 'create' | 'update' = 'create';
  DropDownValues: any[] = []
  consumptionDropDownValues: any[] = []
  consumCategory: any[] = []
  source: any[] = []
  sources: any[] = []
  categories: any[] = []
  peopleList: any[] = []
  disposalMethod: any[] = []
  scopes: any[] = []
  divisions: any[] = []
  years: any[] = []
  orgID: any
  quantities: any[] = []
  conCategory: any[] = []
  consumptions: any[] = []
  evidences:any[]=[]
  collectedFrom = new FormControl(null, [Validators.required]);
  collectedTo = new FormControl(null, [Validators.required]);
  disposalDate = new FormControl(null);
  files: File[] = [];
  totalCatCount: number
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
  treatment: any[];
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<EditConsumptionComponent>,
    private authService: AuthService,
    private router: Router,
    private environmentService: EnvironmentService,
    private _snackBar: MatSnackBar,
    private generalService: GeneralService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.configuration();  
    this.Form = this.formBuilder.group({

      consumption_category: [this.defaults.consumption_category, [Validators.required]],
      category: [this.defaults.category, [Validators.required]],
      source: [this.defaults.source],
      unit: [this.defaults.unit, [Validators.required]],
      quantity: [this.defaults.quantity, [Validators.required]],
      amount: [this.defaults.amount],
      scope: [this.defaults.scope, [Validators.required]],
      description: [this.defaults.description],
      treatment: [this.defaults.treatment, [Validators.required]],
      collected_from: [this.defaults.collected_from, [Validators.required]],
      collected_to: [this.defaults.collected_to, [Validators.required]],
      disposal_method: [this.defaults.disposal_method, [Validators.required]],
      disposal_date: [this.defaults.disposal_date, [Validators.required]],
      consignment_number: [this.defaults.consignment_number],
      disposer: [this.defaults.disposer],
      carrier: [this.defaults.carrier],
      disposal_place: [this.defaults.disposal_place],
      pollutants_emitted: [this.defaults.pollutants_emitted, [Validators.required]],
      concentration: [this.defaults.concentration],
      determined_by: [this.defaults.determined_by, [Validators.required]],
      meter_reading:[this.defaults.meter_reading],
      quantity_source:[this.defaults.quantity_source],
      pending_consumption: [''],
      pending_percentage: [0],
      emission_factor: [0],
      ghg_value: [0],
      conversion_factor: [0],
      conversion_value: [0], 
      conversion_required: [''],
      quantity_kwh: [0],
      files:[''],
    });
  }
  
    //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.years = result.data.attributes.Year
        const status = result.data.attributes.modules.environment
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
              // this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
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
        // this.Form.controls['created_user'].setValue(result.id)
        const status = result.env_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_profiles()
          this.get_division()
         this.get_consumption_dropdown_values()
         this.get_dropdown_values()
         this.files=this.defaults.files
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_dropdown_values() {
    const module = "Environment"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.DropDownValues = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.consumption_category()
        this.sourceData()
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
      }
    })
  }
  consumption_category() {
    const data = this.DropDownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Consumption Category")
    })    
    this.consumCategory = data
    this.totalCatCount = this.consumCategory.length
    if (this.defaults.length > 0) {
      const catdata = "" + this.defaults[0].pending_consumption + ""
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

  sourceData() {
    this.sources = []
    const source_data = this.consumptionDropDownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Source")
    })
    
    this.source = source_data

    
  }

  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked===false);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }

  get_division() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        this.divisions = result.data
      },
      error: (errL: any) => { },
      complete: () => { }
    })
  }
  
  onSelect(event: any) {
    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 2) {
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

    } else if (fileLength < 2) {
      const statusText = "You have exceed the upload limit"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }
  
  collFrom(data: any) {
    this.Form.controls['collected_from'].setValue(new Date(data.value))
  }

  collTo(data: any) {
    this.Form.controls['collected_to'].setValue(new Date(data.value))
  }

  disDate(data: any) {
    this.Form.controls['disposal_date'].setValue(new Date(data.value))
  }

  kwhQuantity(data: any) {
    const status = this.Form.value.conversion_required
    const quantity = this.Form.value.quantity
    const conversion_factor = this.Form.value.conversion_factor
    if (status === true) {
      const quantity_kwh = Math.round(Number(quantity) * Number(conversion_factor)).toFixed(0)
      this.Form.controls['quantity_kwh'].setValue(quantity_kwh)
    } else {
      this.Form.controls['quantity_kwh'].setValue(quantity)
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
    this.Form.controls['disposal_method'].reset()
    this.Form.controls['disposal_date'].reset()
    this.Form.controls['consignment_number'].reset()
    this.Form.controls['disposer'].reset()
    this.Form.controls['carrier'].reset()
    this.Form.controls['disposal_place'].reset()
    this.Form.controls['pollutants_emitted'].reset()
    this.Form.controls['concentration'].reset()
    this.Form.controls['determined_by'].reset()
    this.Form.controls['meter_reading'].reset()
    const sourceData = this.consumptionDropDownValues.filter(function (elem: any) {
      return (elem.attributes.filter === data.value)
    })

    this.source = sourceData
    if (data.value === "Energy") {
      this.Form.controls['category'].setErrors(null)
      this.Form.controls['treatment'].setErrors(null)
      this.Form.controls['collected_from'].setErrors(null)
      this.Form.controls['collected_to'].setErrors(null)
      this.Form.controls['disposal_method'].setErrors(null)
      this.Form.controls['disposal_date'].setErrors(null)
      this.Form.controls['consignment_number'].setErrors(null)
      this.Form.controls['disposer'].setErrors(null)
      this.Form.controls['carrier'].setErrors(null)
      this.Form.controls['disposal_place'].setErrors(null)
      this.Form.controls['pollutants_emitted'].setErrors(null)
      this.Form.controls['concentration'].setErrors(null)
      this.Form.controls['determined_by'].setErrors(null)
      const scopeData = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Scope')
      })
      this.scopes = scopeData
      
    } else if (data.value === "Wastewater") {
      this.Form.controls['scope'].setErrors(null)
      this.Form.controls['category'].setErrors(null)
      this.Form.controls['collected_from'].setErrors(null)
      this.Form.controls['collected_to'].setErrors(null)
      this.Form.controls['disposal_method'].setErrors(null)
      this.Form.controls['disposal_date'].setErrors(null)
      this.Form.controls['consignment_number'].setErrors(null)
      this.Form.controls['disposer'].setErrors(null)
      this.Form.controls['carrier'].setErrors(null)
      this.Form.controls['disposal_place'].setErrors(null)
      this.Form.controls['pollutants_emitted'].setErrors(null)
      this.Form.controls['concentration'].setErrors(null)
      this.Form.controls['determined_by'].setErrors(null)
      this.Form.controls['meter_reading'].setErrors(null)
      const treatmentData = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Treatment Where')
      })
      this.treatment = treatmentData
    } else if (data.value === "Waste") {
      this.Form.controls['scope'].setErrors(null)
      this.Form.controls['treatment'].setErrors(null)
      this.Form.controls['pollutants_emitted'].setErrors(null)
      this.Form.controls['concentration'].setErrors(null)
      this.Form.controls['determined_by'].setErrors(null)
      this.Form.controls['meter_reading'].setErrors(null)
      const cateData = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Category')
      })
      this.categories = cateData

      const disMethData = this.DropDownValues.filter(function (elem: any) {
        return (elem.attributes.Category === 'Disposal Method')
      })
      this.disposalMethod = disMethData
    } else if (data.value === "Water") {
      this.Form.controls['scope'].setErrors(null)
      this.Form.controls['category'].setErrors(null)
      this.Form.controls['treatment'].setErrors(null)
      this.Form.controls['collected_from'].setErrors(null)
      this.Form.controls['collected_to'].setErrors(null)
      this.Form.controls['disposal_method'].setErrors(null)
      this.Form.controls['disposal_date'].setErrors(null)
      this.Form.controls['consignment_number'].setErrors(null)
      this.Form.controls['disposer'].setErrors(null)
      this.Form.controls['carrier'].setErrors(null)
      this.Form.controls['disposal_place'].setErrors(null)
      this.Form.controls['pollutants_emitted'].setErrors(null)
      this.Form.controls['concentration'].setErrors(null)
      this.Form.controls['determined_by'].setErrors(null)

    } else if (data.value === "Air Emission") {
      this.Form.controls['unit'].setErrors(null)
      this.Form.controls['quantity'].setErrors(null)
      this.Form.controls['scope'].setErrors(null)
      this.Form.controls['category'].setErrors(null)
      this.Form.controls['treatment'].setErrors(null)
      this.Form.controls['collected_from'].setErrors(null)
      this.Form.controls['collected_to'].setErrors(null)
      this.Form.controls['disposal_method'].setErrors(null)
      this.Form.controls['disposal_date'].setErrors(null)
      this.Form.controls['consignment_number'].setErrors(null)
      this.Form.controls['disposer'].setErrors(null)
      this.Form.controls['meter_reading'].setErrors(null)
      this.Form.controls['carrier'].setErrors(null)
      this.Form.controls['disposal_place'].setErrors(null)
    }
    const quantity = this.DropDownValues.filter(function (elem: any) {
      return (elem.attributes.Category === 'Quantity Source')
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
      }).then((result: { isConfirmed: any; }) => {
        if (!result.isConfirmed) {
          this.Form.reset();
        }
      });
    } else {
      const sourceData = this.consumptionDropDownValues.filter(function (elem: any) {
        return (elem.attributes.Value === data.value)
      })
      this.Form.controls['unit'].setValue(sourceData[0].attributes.unit)
      this.Form.controls['emission_factor'].setValue(sourceData[0].attributes.emission_factor)
      this.Form.controls['conversion_factor'].setValue(sourceData[0].attributes.conversion_factor)
      this.Form.controls['conversion_required'].setValue(sourceData[0].attributes.conversion_required)

      this.Form.controls['unit'].disable()
    }
  }

  submit() {
    this.Form.controls['files'].setValue(this.files)
    this.Form.controls['unit'].enable()
    this.consumptions.push(this.Form.value)
    const category = this.Form.value.consumption_category
    const data = this.conCategory.filter(function (elem: any) {
      return (elem !== category)
    })
    const total = Number(this.totalCatCount)
    const count = Number(data.length)
    const percentage = Number(Number(count) / Number(total) * 100).toFixed(0)
    this.Form.controls['pending_consumption'].setValue(data.toString())
    this.Form.controls['pending_percentage'].setValue(percentage)
    const quantity = this.Form.value.quantity
    const emissionFactor = this.Form.value.emission_factor
    const conversionFactor = this.Form.value.conversion_factor

    const ghgValue = Number(Number(quantity) * Number(emissionFactor)).toFixed(0)
    const conversionValue = Number(Number(quantity) * Number(conversionFactor)).toFixed(0)
    this.Form.controls['ghg_value'].setValue(ghgValue)
    this.Form.controls['conversion_value'].setValue(conversionValue)

    this.dialogRef.close(this.Form.value);
  }

}

function configuration() {
  throw new Error('Function not implemented.');
}

