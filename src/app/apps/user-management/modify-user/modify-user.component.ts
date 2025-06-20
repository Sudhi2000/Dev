import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { user } from 'src/app/services/schemas';
import { UserService } from 'src/app/services/user.api.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
var bcrypt = require('bcryptjs');
@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.scss']
})
export class ModifyUserComponent implements OnInit {

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
    public dialogRef: MatDialogRef<ModifyUserComponent>) { }

    ngOnInit(){
      if (this.defaults) {
        this.mode = 'update';
        
      } else {
        this.defaults = {} as user;
      }
      this.configuration()
      console.log(this.defaults)
      this.Form = this.formBuilder.group({
        id: [this.defaults.id ],
        user_id: [this.defaults.attributes.user.data.id],
        first_name: [this.defaults.attributes.first_name || '', [Validators.required]],
        last_name: [this.defaults.attributes.last_name || '', [Validators.required]],
        designation: [this.defaults.attributes.designation || '', [Validators.required]],
        escalate_email: [this.defaults.attributes.escalate_email || '', [Validators.required]],
        email: [this.defaults.attributes.email || '', [Validators.required]],
        gender: [this.defaults.attributes.gender || '', [Validators.required]],
        password: [this.defaults.attributes.password || null],
        employee_id: [this.defaults.attributes.employee_id || '', [Validators.required]],
        ehs_dashboard:[this.defaults.attributes.user.data.attributes.ehs_dashboard || false ],
        ehs_create:[this.defaults.attributes.user.data.attributes.ehs_create ||  false ],
        ehs_history:[this.defaults.attributes.user.data.attributes.ehs_history ||  false ],
        ehs_tasks:[this.defaults.attributes.user.data.attributes.ehs_tasks ||  false ],
        ehs_modify:[this.defaults.attributes.user.data.attributes.ehs_modify ||  false ],
        ehs_action:[this.defaults.attributes.user.data.attributes.ehs_action ||  false ],
        ehs_verify:[this.defaults.attributes.user.data.attributes.ehs_verify ||  false ],
        ehs_view:[this.defaults.attributes.user.data.attributes.ehs_view ||  false ],
        acc_inc_create:[this.defaults.attributes.user.data.attributes.acc_inc_create ||  false ],
        acc_inc_register:[this.defaults.attributes.user.data.attributes.acc_inc_register ||  false ],
        acc_inc_assigned:[this.defaults.attributes.user.data.attributes.acc_inc_assigned ||  false ],
        acc_inc_action:[this.defaults.attributes.user.data.attributes.acc_inc_action ||  false ],
        env_history:[this.defaults.attributes.user.data.attributes.env_history ||  false ],
        env_create:[this.defaults.attributes.user.data.attributes.env_create ||  false ],
        env_modify:[this.defaults.attributes.user.data.attributes.env_modify ||  false ],
        env_assigned:[this.defaults.attributes.user.data.attributes.env_assigned ||  false ],
        int_aud_create:[this.defaults.attributes.user.data.attributes.int_aud_create ||  false ],
        int_aud_history:[this.defaults.attributes.user.data.attributes.int_aud_history ||  false ],
        int_aud_modify:[this.defaults.attributes.user.data.attributes.int_aud_modify ||  false ],
        int_aud_task:[this.defaults.attributes.user.data.attributes.int_aud_task ||  false ],
        int_aud_action:[this.defaults.attributes.user.data.attributes.int_aud_action ||  false ],
        int_aud_audit:[this.defaults.attributes.user.data.attributes.int_aud_audit ||  false ],
        int_aud_queue:[this.defaults.attributes.user.data.attributes.int_aud_queue ||  false ],
        ext_aud_create:[this.defaults.attributes.user.data.attributes.ext_aud_create ||  false ],
        ext_aud_register:[this.defaults.attributes.user.data.attributes.ext_aud_register ||  false ],
        ext_aud_modify:[this.defaults.attributes.user.data.attributes.ext_aud_modify ||  false ],
        ext_aud_task:[this.defaults.attributes.user.data.attributes.ext_aud_task ||  false ],
        ext_aud_action:[this.defaults.attributes.user.data.attributes.ext_aud_action ||  false ],
        ext_aud_audit:[this.defaults.attributes.user.data.attributes.ext_aud_audit ||  false ],
        ext_aud_queue:[this.defaults.attributes.user.data.attributes.ext_aud_queue ||  false ],
        doc_history:[this.defaults.attributes.user.data.attributes.doc_history ||  false ],
        doc_create:[this.defaults.attributes.user.data.attributes.doc_create ||  false ],
        doc_modify:[this.defaults.attributes.user.data.attributes.doc_modify ||  false ],
        doc_view:[this.defaults.attributes.user.data.attributes.doc_view ||  false ],
        aud_action_plan:[this.defaults.attributes.user.data.attributes.aud_action_plan ||  false ],
        acc_inc_dashboard:[this.defaults.attributes.user.data.attributes.acc_inc_dashboard ||  false ],
        aud_dashboard:[this.defaults.attributes.user.data.attributes.aud_dashboard ||  false ],
        sus_register:[this.defaults.attributes.user.data.attributes.sus_register ||  false ],
        sus_create:[this.defaults.attributes.user.data.attributes.sus_create ||  false ],
        sus_modify:[this.defaults.attributes.user.data.attributes.sus_modify ||  false ],
        sus_view:[this.defaults.attributes.user.data.attributes.sus_view ||  false ],
        acc_inc_modify:[this.defaults.attributes.user.data.attributes.acc_inc_modify ||  false ],
        chem_create:[this.defaults.attributes.user.data.attributes.chem_create ||  false ],
        chem_approve:[this.defaults.attributes.user.data.attributes.chem_approve ||  false ],
        chem_trans_create:[this.defaults.attributes.user.data.attributes.chem_trans_create ||  false ],
        chem_inven:[this.defaults.attributes.user.data.attributes.chem_inven ||  false ],
        chem_modify:[this.defaults.attributes.user.data.attributes.chem_modify ||  false ],
        chem_trans:[this.defaults.attributes.user.data.attributes.chem_trans ||  false ],
        chem_inven_view:[this.defaults.attributes.user.data.attributes.chem_inven_view ||  false ],
        chem_trans_view:[this.defaults.attributes.user.data.attributes.chem_trans_view ||  false ],
        user_history:[this.defaults.attributes.user.data.attributes.user_history ||  false ],
        user_modify:[this.defaults.attributes.user.data.attributes.user_modify ||  false ],
        user_create:[this.defaults.attributes.user.data.attributes.user_create ||  false ],
 
      });
      
    }

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
                //this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
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
      console.log(this.Form.value)
      this.userService.update_user_profile(this.Form.value).subscribe({
        next: (result: any) => {
        
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { 
          this.update_user()
        }
      })
      

    }
    update_user() {
      console.log(this.Form.value)
          this.userService.update_user(this.Form.value,this.Form.value.user_id).subscribe({
            next: (result: any) => { },
            error: (err: any) => {const statusText = err.error.error.message
              if(statusText=="password must be a `string` type, but the final value was: `null`."){
                this._snackBar.open('Password Required', 'OK', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                  });
              }
              else{
                this._snackBar.open(statusText, 'OK', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                  });
              }
            },
            complete: () => {
              const statusText = "User updated"
              this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
          })
          
              this.router.navigate(["/apps/user-management/history" ])
              this.dialogRef.close();
        }
          })
         
    }
}
