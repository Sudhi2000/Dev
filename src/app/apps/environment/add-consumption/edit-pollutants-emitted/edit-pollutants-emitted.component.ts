import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { CreateNewPollutantComponent } from '../create-new-pollutant/create-new-pollutant.component';

@Component({
  selector: 'app-edit-pollutants-emitted',
  templateUrl: './edit-pollutants-emitted.component.html',
  styleUrls: ['./edit-pollutants-emitted.component.scss']
})
export class EditPollutantsEmittedComponent implements OnInit {

  Form: FormGroup;
  pollutantEmitted = new FormControl(null, [Validators.required]);
  pollutantsEmitted: any[] = [];
  orgID: any;
  units: any[] = [];
  consumptionDropDownValues: any[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<EditPollutantsEmittedComponent>,
    private formBuilder: FormBuilder,
    private environmentService: EnvironmentService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private generalService: GeneralService,
    private authService: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.configuration();
    this.Form = this.formBuilder.group({
      org_id: [''],
      pollutants_emitted: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      legal_emission_limit:['']
    });

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.environment;
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"]);
          this.dialogRef.close();
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id;
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1]);
              this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]));
            }
          }
          this.me();
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"]);
        this.dialogRef.close();
      }
    });
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.env_create;
        if (status === false) {
          this.router.navigate(["/error/unauthorized"]);
          this.dialogRef.close();
        } else {
          // this.get_dropdown_values()
          this.get_consumption_dropdown_values();
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"]);
        this.dialogRef.close();
      }
    });
  }

  get_consumption_dropdown_values() {
    const module = "Environment";
    this.environmentService.get_consumption_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.consumptionDropDownValues = result.data;
        const pollutantsData = this.consumptionDropDownValues.filter((elem: any) => elem.attributes.Category === 'Pollutants Emitted');

        this.pollutantsEmitted = pollutantsData;
        this.units = this.pollutantsEmitted.map((pollutant) => pollutant.attributes.unit);

        if (this.defaults) {
          const defaultOption = this.pollutantsEmitted.find(option => option.attributes.Value === this.defaults.pollutants_emitted);
          if (defaultOption) {
            this.Form.controls['pollutants_emitted'].setValue(this.defaults.pollutants_emitted);
            this.Form.controls['quantity'].setValue(this.defaults.quantity);
            this.Form.controls['unit'].setValue(this.defaults.unit);
            this.Form.controls['legal_emission_limit'].setValue(this.defaults.legal_emission_limit)

            this.pollutantEmitted.setValue(defaultOption);
            this.cdr.detectChanges();
          } else {
            console.error('Default option not found:', this.defaults.pollutants_emitted);
          }
        }
      },
      error: (err: any) => { }
    });
  }

  PollutantsEmitted(event: any) {
    this.Form.controls['pollutants_emitted'].setValue(event.value.attributes.Value.toString());
    this.Form.controls['unit'].setValue(event.value.attributes.unit.toString());
    this.Form.controls['legal_emission_limit'].setValue(event.value.attributes.legal_emission_limit.toString)
  }

  Unit(event: any) {
    this.Form.controls['unit'].setValue(event.value.toString());
  }

  new_pollutant() {
    this.dialog.open(CreateNewPollutantComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const module = "Environment";
        const category = "Pollutants Emitted";
        const name = data.pollutant_name;
        const unit = data.unit;

        this.environmentService.create_pollutant(module, category, name, unit).subscribe({
          next: (result: any) => {
            this.environmentService.get_consumption_dropdown_values(module).subscribe({
              next: (result: any) => {
                this.consumptionDropDownValues = result.data;
                const pollutantsData = this.consumptionDropDownValues.filter((elem: any) => elem.attributes.Category === 'Pollutants Emitted');

                this.pollutantsEmitted = pollutantsData;
                this.units = this.pollutantsEmitted.map((pollutant) => pollutant.attributes.unit);
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"]);
              },
              complete: () => {
                const pollutantname = result.data.attributes.Value;
                const unit = result.data.attributes.unit;

                this.Form.controls['pollutants_emitted'].setValue(pollutantname);
                this.pollutantEmitted.setValue(pollutantname);
                this.Form.controls['unit'].setValue(unit);
                this.pollutantEmitted.setValue(pollutantname);

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
          }
        });
      }
    });
  }

  pollutantsQuantity(data: any) {
    
   }

  submit() {
    this.dialogRef.close(this.Form.value);
  }
}
