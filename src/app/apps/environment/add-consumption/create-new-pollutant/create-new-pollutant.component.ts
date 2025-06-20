import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { AddPollutantsEmittedComponent } from '../add-pollutants-emitted/add-pollutants-emitted.component';

@Component({
  selector: 'app-create-new-pollutant',
  templateUrl: './create-new-pollutant.component.html',
  styleUrls: ['./create-new-pollutant.component.scss']
})
export class CreateNewPollutantComponent implements OnInit {

  Form: FormGroup
  pollutantEmitted = new FormControl(null, [Validators.required]);
  pollutantsEmitted: any[] = []
  orgID:any
  units: any[] = []
  consumptionDropDownValues: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
  public dialogRef: MatDialogRef<CreateNewPollutantComponent>,
  private formBuilder: FormBuilder,
  private environmentService: EnvironmentService,
  private _snackBar: MatSnackBar,
  private router: Router,
  private generalService: GeneralService,
  private authService:AuthService,
  public dialog: MatDialog,) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      org_id:[''],
      pollutant_name: ['', [Validators.required]],
      unit: ['', [Validators.required]],
     
    });
    this.configuration()
  }

  configuration(){
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
        const units = this.consumptionDropDownValues.filter(function (elem: any) {
          return elem.attributes.Category === 'Unit'&& elem.attributes.filter==='Pollutants Emitted';
        });
  
        this.pollutantsEmitted = pollutantsData;
  
        this.units = units;
      },
      error: (err: any) => {},
      complete: () => {}
    });
  }
  Unit(event: any) {
    this.Form.controls['unit'].setValue(event.value.toString())
  }
  
  submit(){
    
    this.dialogRef.close(this.Form.value);
  }
}
