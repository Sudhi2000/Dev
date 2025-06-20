import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, map, forkJoin } from 'rxjs';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-tertiary-part',
  templateUrl: './create-tertiary-part.component.html',
  styleUrls: ['./create-tertiary-part.component.scss']
})
export class CreateTertiaryPartComponent implements OnInit {

  Form: FormGroup
  primaryparts: any[] = []
  orgID: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  secondaryparts: any[] = []
  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private accidentService: AccidentService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateTertiaryPartComponent>) { }


  ngOnInit(): void {
    this.configuration()
    this.Form = this.formBuilder.group({
      userID: ['', [Validators.required]],
      org_id: [''],
      primary: ['', [Validators.required]],
      secondary: ['', [Validators.required]],
      tertiary: ['', [Validators.required]],
    });
  }
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        // this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.accident_incident
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
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
      },
      complete: () => { }
    })
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.Form.controls['userID'].setValue(result.id)
          this.get_dropdown_values()
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  get_dropdown_values() {
    const module = 'Accident and Incident';
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        const primarybodyPart = result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Body Primary Region';
        });
        let primarydata: any[] = [];
        primarybodyPart.forEach((elem: any) => {
          primarydata.push(elem.attributes.Value);
        });
        this.primaryparts = primarydata;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }
  fetchSecondaryOptions() {

    const module = 'Accident and Incident';
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {

        const secondarybodyPart = result.data.filter((elem: any) => {
          return elem.attributes.Category === 'Body Secondary Region' && elem.attributes.filter === this.Form.value.primary;
        });
        let secondarydata: any[] = [];
        secondarybodyPart.forEach((elem: any) => {
          secondarydata.push(elem.attributes.Value);
        });
        this.secondaryparts = secondarydata;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }
  checkDuplicate() {
    const secondary = this.Form.value.secondary
    const tertiary = this.Form.value.tertiary
    this.accidentService.get_tertiary_part().subscribe({
      next: (result: any) => {
        const matchfound = result.data.filter(function (elem: any) {
          return elem.attributes.filter === secondary && elem.attributes.value === tertiary;
        });
        if (matchfound.length < 1) {
          this.create_tertiary_part()

        } else {
          const statusText = 'This Body Tertiary Region Already Exists';
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }
  create_tertiary_part(){
    this.accidentService.create_tertiary_part(this.Form.value).subscribe({
      next:(result:any)=>{        
      },
      error:()=>{},
      complete:()=>{
        const statusText = 'New Body Tertiary Region Created';
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
            this.dialogRef.close(this.Form.value);
      }
    })
  }
  submit() {
    this.checkDuplicate()
  }
}
