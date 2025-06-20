import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { impact } from 'src/app/services/schemas';
import { UserService } from 'src/app/services/user.api.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
var bcrypt = require('bcryptjs');
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  Form:FormGroup
  units: any[] = []
  orgID:string
  types: any[] = []
  UnitList:any[]=[]
  TypeList:any[]=[]
  dropdownValues: any
  mode: 'create' | 'update' = 'create';
  static id = 1;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService:GeneralService,
    private router: Router,
    private authService:AuthService,
    private cd: ChangeDetectorRef,
    private userService:UserService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateUserComponent>) { }

    ngOnInit(): void {
      this.configuration()
      this.Form = this.formBuilder.group({
        id: [''],
        org_id: [''],
        reported_date: [new Date()],
        first_name: ['', [Validators.required]],
        last_name: [''],
        designation: ['', [Validators.required]],
        escalate_email: ['', [Validators.required, Validators.email]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', [Validators.required]],
        password: ['', [Validators.minLength(6)]],
        employee_id: ['', [Validators.required]],
        ehs_dashboard: ['', [Validators.required]],
        ehs_create: ['', [Validators.required]],
        ehs_history: ['', [Validators.required]],
        ehs_tasks: ['', [Validators.required]],
        ehs_modify: ['', [Validators.required]],
        ehs_action: ['', [Validators.required]],
        ehs_verify: ['', [Validators.required]],
        ehs_view: ['', [Validators.required]],
        acc_inc_create: ['', [Validators.required]],
        acc_inc_register: ['', [Validators.required]],
        acc_inc_assigned: ['', [Validators.required]],
        acc_inc_action: ['', [Validators.required]],
        hse_head: [''],
        env_history: ['', [Validators.required]],
        env_create: ['', [Validators.required]],
        env_modify: ['', [Validators.required]],
        env_assigned: ['', [Validators.required]],
        trs_history: [''],
        trs_create: [''],
        trs_assigned: [''],
        trs_action: [''],
        int_aud_create: ['', [Validators.required]],
        int_aud_history: ['', [Validators.required]],
        int_aud_modify: ['', [Validators.required]],
        int_aud_task: ['', [Validators.required]],
        int_aud_action: ['', [Validators.required]],
        int_aud_audit: ['', [Validators.required]],
        int_aud_queue: ['', [Validators.required]],
        ext_aud_create: ['', [Validators.required]],
        ext_aud_register: ['', [Validators.required]],
        ext_aud_modify: ['', [Validators.required]],
        ext_aud_task: ['', [Validators.required]],
        ext_aud_action: ['', [Validators.required]],
        ext_aud_audit: ['', [Validators.required]],
        ext_aud_queue: ['', [Validators.required]],
        doc_history: ['', [Validators.required]],
        doc_create: ['', [Validators.required]],
        doc_modify: ['', [Validators.required]],
        doc_view: ['', [Validators.required]],
        aud_action_plan: ['', [Validators.required]],
        acc_inc_dashboard: ['', [Validators.required]],
        aud_dashboard: ['', [Validators.required]],
        confirmed: [''],
        blocked: [''],
        sus_register: ['', [Validators.required]],
        sus_create: ['', [Validators.required]],
        sus_modify: ['', [Validators.required]],
        sus_view: ['', [Validators.required]],
        acc_inc_modify: ['', [Validators.required]],
        chem_create: ['', [Validators.required]],
        chem_approve: ['', [Validators.required]],
        chem_trans_create: ['', [Validators.required]],
        chem_inven: ['', [Validators.required]],
        chem_modify: ['', [Validators.required]],
        chem_trans: ['', [Validators.required]],
        chem_inven_view: ['', [Validators.required]],
        chem_trans_view: ['', [Validators.required]],
        user_history: ['', [Validators.required]],
        user_modify: ['', [Validators.required]],
        user_create: ['', [Validators.required]],
  
      });
    }
    ///check organisation has access
    configuration() {
      this.generalService.get_app_config().subscribe({
        next: (result: any) => {
          console.log(result)
          const status = result.data.attributes.modules.user_management
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
          const status = result.user_create
          if (status === false) {
            this.router.navigate(["/error/unauthorized"])
            this.dialogRef.close()
          } else {
            
          }
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })
    }
    
   
    submit(){
      if (this.Form.value.email === this.Form.value.escalate_email) {
        const statusText = 'Email and Escalate Email should not be same'
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
      else{
        this.userService.create_user_profile(this.Form.value).subscribe({
          next: (result: any) => {
            console.log(result)
            this.Form.controls['id'].setValue(result.data.id)
          },
          error: (err: any) => {
            const statusText = err.error.error.details.errors[0].message
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          },
          complete: () => { 
            this.create_user()
          }
        })
        
      }
      

    }

    create_user() {
      console.log(this.Form.value)
      this.userService.create_user(this.Form.value, this.Form.value.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          console.log(err)
          const statusText = err.error.error.message
          if (statusText === 'This attribute must be unique') {
            this._snackBar.open('Username already taken', 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          }
          else 
          {
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            }); 
          }
          this.delete_user_profile()
        },
        complete: () => {
          const statusText = "User created"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.router.navigate(["/apps/user-management/history"])
          this.dialogRef.close();
        }
      })
  
    }
    delete_user_profile() {
      console.log(this.Form.value)
      this.userService.delete_user_profile(this.Form.value.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
  
        },
        complete: () => {
  
        }
      })
  
    }
}
