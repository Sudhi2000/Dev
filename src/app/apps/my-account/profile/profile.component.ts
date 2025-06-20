import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { ehsCategory } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { UserImageComponent } from './user-image/user-image.component';

var bcrypt = require('bcryptjs');
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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ProfileComponent implements OnInit {

  files: File[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: string
  userImage: string
  Form: FormGroup
  evidenceID: number
  userimg: string
  userimgID: number
  passwordInputType = 'password';
  passwordInputTypeConfirm = 'password'
  message: string
  PasswordReset: boolean = false

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

  constructor(private hazardService: HazardService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private _snackBar: MatSnackBar,
    private httpClient: HttpClient,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      profile_img_id: [''],
      reported_date: [new Date()],
      reference_number: [''],
      reporter: [''],
      reporterName: [''],
      reporterDesignation: [''],
      org_id: ['', [Validators.required]],
      employee_id: [''],
      first_name: [''],
      last_name: [''],
      email: [''],
      designation: [''],
      gender: [''],
      decrypt: [null, ''],
      profileImage: null,
      password: [null,
        Validators.compose(
          [
            Validators.minLength(6)
          ]
        )],

      confirm_password: [null, ''],
    }, {
      require,
      validator: this.MustMatch('password', 'confirm_password'),
    }
    );
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.hazard_risk
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
        const status = result.profile_update
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.userImage = result.image.image
          this.Form.controls['id'].setValue(result.profile.id)
          this.Form.controls['profile_img_id'].setValue(result.image.id)
          this.Form.controls['gender'].setValue(result.profile.gender)
          this.Form.controls['first_name'].setValue(result.profile.first_name)
          this.Form.controls['designation'].setValue(result.profile.designation)
          this.Form.controls['employee_id'].setValue(result.profile.employee_id)
          this.Form.controls['last_name'].setValue(result.profile.last_name)
          //this.Form.controls['password'].setValue(result.profile.password)
          this.Form.controls['email'].setValue(result.profile.email)
          this.Form.controls['employee_id'].disable()
          this.Form.controls['email'].disable()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }


  MustMatch(controlName: string, matchingControlName: string) {
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
  }
  changeImage() {
    this.dialog.open(UserImageComponent).afterClosed().subscribe((image) => {
      this.Form.controls['profileImage'].setValue(image)

      this.authService.update_profile_image(this.Form.value).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          if (image) {
            const statusText = "Updated your profile image"
            this._snackBar.open(statusText, 'Ok', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.ngOnInit()
          }

        }
      })
    })

  }

  bcrypPass(event: any) {
    this.PasswordReset = true

    bcrypt.hash(event.target.value, 10, (err: any, hash: any) => {

      if (err) {
        return (err);
      } else {
        this.Form.controls['decrypt'].setValue(hash)
      }

    });

  }
  showPassword() {
    this.passwordInputType = 'text';
    this.cd.markForCheck();
  }

  showPasswordconfirm() {
    this.passwordInputTypeConfirm = 'text';
    this.cd.markForCheck()
  }

  hidePassword() {
    this.passwordInputType = 'password';
    this.cd.markForCheck();
  }

  hidePasswordconfirm() {
    this.passwordInputTypeConfirm = 'password';
    this.cd.markForCheck();
  }

  //On Submit

  submit() {

    if (this.Form.value.password && !this.Form.value.confirm_password && !this.Form.valid) {
      Swal.fire({
        title: 'Password not confirmed?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "Please reconfirm that all the details are provided. If the details are missing, please click on 'Cancel' button to review the data.",
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',

      }).then((result) => {

      })
    }

    else if (this.Form.value.password && this.Form.value.confirm_password && !this.Form.valid) {
      Swal.fire({
        title: 'Password is not valid?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "Please reconfirm that all the provided details are correct. If the details are incorrect, please click on 'Cancel' button to review the data.",
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',

      }).then((result) => {

      })
    }
    else if (this.Form.value.password && this.Form.value.confirm_password && this.Form.valid) {
      Swal.fire({
        title: 'Are you sure?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.update_profile()

        }
      })
    }
    else if (!this.Form.value.password && !this.Form.value.confirm_password) {
      Swal.fire({
        title: 'Are you sure?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.update_profile()

        }
      })
    }
  }
  update_profile() {
    this.PasswordReset = false

    const password = this.Form.value.decrypt
    this.authService.update_profile(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        Swal.fire({
          title: 'Updated Successfully',
          imageUrl: "assets/images/success.gif",
          imageWidth: 250,
          text: "You have successfully updated your profile.",
          showCancelButton: false,

        }).then((result) => {
          this.router.navigate(["/apps/my-account/profile"])
        })
      }
    })



  }

  confirmResetPassword() {

    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "You are trying to reset your account password. Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetPassword()

      }
    })





  }

  resetPassword() {
    this.Form.controls['email'].enable()
    const email = this.Form.value.email
    this.authService.forget_password(email).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.Form.controls['email'].disable()
        Swal.fire({
          title: 'Reset Password?',
          text: "Successfully submited the reset password request. An automated email with reset password link will receive on the registered email address. If it is not received, please contact the support center for more resolution.",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Close'
        }).then((result) => {
          const cookies = document.cookie.split(";");
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }

          // this.router.navigate(['apps/insight']);

          location.reload()

        })

      }
    })

  }




}






