import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CreateUpdateImpactComponent } from 'src/app/apps/sustainability/report/create-update-impact/create-update-impact.component';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modify-auditee',
  templateUrl: './modify-auditee.component.html',
  styleUrls: ['./modify-auditee.component.scss']
})
export class ModifyAuditeeComponent implements OnInit {
  Form: FormGroup
  orgID: string
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private internalService:InternalAuditService,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ModifyAuditeeComponent>) { }

  ngOnInit(

  ) {
    this.Form = this.formBuilder.group({
      id: [this.defaults.id||''],
      org_id: ['', [Validators.required]],
      name: [this.defaults.attributes.auditee_name||'', [Validators.required]],
      email: [this.defaults.attributes.email||'', [Validators.required]],
    });
    this.configuration()
  }
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.sustainability
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

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.sus_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
       }
    })
  }
  submit() {
    const email = this.Form.get('email')?.value;    
    const id = this.Form.get('id')?.value;    

    this.internalService.get_auditees().subscribe({
        next: (result: any) => {        
            const emailExistsForOtherId = result.data.some((auditee: any) => auditee.attributes.email === email && auditee.id !== id);          
            if (emailExistsForOtherId) {
                const statusText = "An auditee already exists with the provided email address. Please provide a unique email address.";
                this._snackBar.open(statusText, 'OK', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                });
            } else {
                this.dialogRef.close(this.Form.value);
            }
        },
        error: (err: any) => {},
        complete: () => {}
    });
}

}
