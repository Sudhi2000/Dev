import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  pwdPattern = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}";

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  status:boolean=false


  constructor(private router: Router, private route: ActivatedRoute,
    private fb: FormBuilder,private _snackBar: MatSnackBar,
    private authService:AuthService) { }

  ngOnInit(){
    this.resetForm = this.fb.group({
      password: ['', [Validators.pattern(this.pwdPattern),Validators.required]],
      confirmPassword: ['', [Validators.pattern(this.pwdPattern),Validators.required]],

    }, {
      validator: this.MustMatch('password', 'confirmPassword'),
    });

    this.check_expiry()
  }

  check_expiry(){
    const id = this.route.snapshot.paramMap.get('id');

    this.authService.check_expiry(id).subscribe({
      next:(result:any)=>{
        const status = result.data.attributes.expired
        if(status===true){
          this.status=false
        }else{
          this.status=true

        }
      },
      error:(err:any)=>{
        const statusText = "Unable to proceed. Please try later"
            this._snackBar.open(statusText, 'Failed', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 3000
            });
      },
      complete:()=>{}
    })

  }

  get f() {
    return this.resetForm.controls;
  }

  MustMatch(controlName: string, matchingControlName: string) {

  

    if(controlName && matchingControlName){
      return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
      };

    }else{
      return 
    }



    
  }

  showPass() {
    var x = (<HTMLInputElement>document.getElementById("signInPassword"));
    var y = (<HTMLInputElement>document.getElementById("signInPasswordConfirm"));

    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }

    if(y.type ==="password"){
      y.type = "text"
    }else{
      y.type="password"
    }
  }

  resetPassword(){
    const token = this.route.snapshot.paramMap.get('token');
    const email = this.route.snapshot.paramMap.get('email');
    const id = this.route.snapshot.paramMap.get('id');
    if(this.resetForm.valid){
      this.authService.reset_password(token,email,id,this.resetForm.value.password).subscribe({
        next:(result:any)=>{
        },
        error:(err:any)=>{
          const statusText = "Unable to proceed. Please try later"
            this._snackBar.open(statusText, 'Failed', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 3000
            });
        },
        complete:()=>{

          Swal.fire({
            title: 'Reset Password?',
            text: "We have received your request to reset the password. You will get a confirmation message on registered email ID.",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Close'
          }).then((result) => {
            this.router.navigate(["/"])
          })

        }
      })

    }else{
      const status = "Password is Required"
      this._snackBar.open(status, 'Failed', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
    }
  }

  home(){
    this.router.navigate(["/"])

  }

}
