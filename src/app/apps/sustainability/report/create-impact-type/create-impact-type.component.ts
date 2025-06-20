import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { SustainabilityService } from 'src/app/services/sustainability.api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-impact-type',
  templateUrl: './create-impact-type.component.html',
  styleUrls: ['./create-impact-type.component.scss']
})
export class CreateImpactTypeComponent implements OnInit {

  Form:FormGroup 
  orgID: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private sustainabilityService: SustainabilityService,
    private _snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<CreateImpactTypeComponent>) { }


ngOnInit(): void {
  this.configuration()
  this.Form = this.formBuilder.group({
    name:['', [Validators.required]],
    org_id:[''],
    impact_unit:['', [Validators.required]],
    created_user:['', [Validators.required]],
  });}
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
    
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
        this.Form.controls['created_user'].setValue(result.id)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  submit() {
    this.sustainabilityService.get_impact_types().subscribe({
      next: (result: any) => {
        const newValue = this.Form.value.name;
        const nameExists = result.data.some((impactType: any) => impactType.attributes.value === newValue);
  
        if (nameExists) {
          const statusText = 'This Impact Type Already Exists';
          this._snackBar.open(statusText, 'Ok', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {          
          this.dialogRef.close(this.Form.value);
        }
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
    });
  }
  
}
