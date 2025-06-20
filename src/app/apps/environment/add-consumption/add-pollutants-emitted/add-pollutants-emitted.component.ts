import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { CreateNewPollutantComponent } from '../create-new-pollutant/create-new-pollutant.component';

@Component({
  selector: 'app-add-pollutants-emitted',
  templateUrl: './add-pollutants-emitted.component.html',
  styleUrls: ['./add-pollutants-emitted.component.scss']
})
export class AddPollutantsEmittedComponent implements OnInit {
  Form: FormGroup
  pollutantEmitted = new FormControl(null, [Validators.required]);
  pollutantsEmitted: any[] = []
  orgID: any
  units: any[] = []
  consumptionDropDownValues: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<AddPollutantsEmittedComponent>,
    private formBuilder: FormBuilder,
    private environmentService: EnvironmentService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private generalService: GeneralService,
    private authService: AuthService,
    public dialog: MatDialog,) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      org_id: [''],
      pollutants_emitted: ['', [Validators.required]],
      quantity: [null, [Validators.required]],
      quantity_kwh: [null],
      legal_emission_limit: [null],
      unit: ['', [Validators.required]],
      conversion_factor: [''],
      emission_factor: [''],
      ghg_value:[null],
      conversion_value:[null]
    });
    this.configuration()
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
          // this.get_dropdown_values()
          this.get_consumption_dropdown_values()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
        this.dialogRef.close()

      },
      complete: () => { }
    })
  }
  get_consumption_dropdown_values() {
    const module = 'Environment';
    this.environmentService.get_consumption_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.consumptionDropDownValues = result.data;
        const pollutantsData = this.consumptionDropDownValues.filter(function (elem: any) {
          return elem.attributes.Category === 'Pollutants Emitted';
        });

        this.pollutantsEmitted = pollutantsData;

        // Extract unique units using Set
        const unitSet = new Set(this.pollutantsEmitted.map((pollutant) => pollutant.attributes.unit));
        this.units = Array.from(unitSet);
      },
      error: (err: any) => { },
      complete: () => { }
    });
  }
  PollutantsEmitted(event: any) {
    this.Form.controls['pollutants_emitted'].setValue(event.value.attributes.Value.toString())
    this.Form.controls['emission_factor'].setValue(event.value.attributes?.emission_factor?.toString() ?? 0)
    this.Form.controls['conversion_factor'].setValue(event.value.attributes?.conversion_factor?.toString() ?? 0)
    this.Form.controls['unit'].setValue(event.value.attributes.unit.toString())
  }
  Unit(event: any) {
    this.Form.controls['unit'].setValue(event.value.toString())
  }
  new_pollutant() {
    this.dialog.open(CreateNewPollutantComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const module = "Environment";
        const category = "Pollutants Emitted";
        const name = data.pollutant_name;
        const unit = data.unit;
        if (this.pollutantsEmitted.some(pollutant => pollutant.attributes.Value === name)) {
          this._snackBar.open("Pollutant already exists", 'Ok', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          return;
        }

        this.environmentService.create_pollutant(module, category, name, unit).subscribe({
          next: (result: any) => {
            this.environmentService.get_consumption_dropdown_values(module).subscribe({
              next: (result: any) => {
                this.consumptionDropDownValues = result.data;
                const pollutantsData = this.consumptionDropDownValues.filter((elem: any) => elem.attributes.Category === 'Pollutants Emitted');

                this.pollutantsEmitted = pollutantsData;
                this.units = this.pollutantsEmitted.map((pollutant) => pollutant.attributes.unit);
                const newlyCreatedPollutant = pollutantsData.find((pollutant: any) => pollutant.attributes.Value === name);
                if (newlyCreatedPollutant) {
                  this.pollutantEmitted.setValue(newlyCreatedPollutant);
                }
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"]);
              },
              complete: () => {
                const unit = result.data.attributes.unit; 

                this.Form.controls['pollutants_emitted'].setValue(name); // Update the form control value
                this.Form.controls['unit'].setValue(unit);
                this.cdr.detectChanges();

                const statusText = "New Pollutant created successfully";
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


  pollutantsQuantity(data: any) {
    const quantity = this.Form.value.quantity
    this.Form.controls['quantity_kwh'].setValue(quantity) 
    const emissionFactor = this.Form.value.emission_factor
    const conversionFactor = this.Form.value.conversion_factor

    // const ghgValue = Number(Number(quantity) * Number(emissionFactor)).toFixed(0)
    const ghgValue = (Number(Math.round(Number(quantity) * Number(emissionFactor)) / 1000)).toFixed(2) || 0
    const conversionValue = Number(Number(quantity) * Number(conversionFactor)).toFixed(0)
    this.Form.controls['ghg_value'].setValue(ghgValue)
    this.Form.controls['conversion_value'].setValue(conversionValue)
  }
  submit() {
    this.dialogRef.close(this.Form.value);
  }
}
