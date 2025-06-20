
import { Component, OnInit } from '@angular/core';
import { interval, mergeMap } from 'rxjs';
import { WeatherService } from 'src/app/services/wheather.api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import Swal from 'sweetalert2'
import { SubscriptionService } from 'src/app/services/subscription.api.service';
import { UserIdleService } from 'angular-user-idle';
import { environment } from 'src/environments/environment';
import { AuthenticationOtpComponent } from '../authentication-otp/authentication-otp.component';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

    images = ['assets/images/welcome.png', 'assets/images/health_safety.png', 'assets/images/employee_engage.png'];

    iconURL: string
    temp: string
    condition: string
    icon: string
    day: string
    authForm: FormGroup
    signinbtn: boolean = true
    signinLoading: boolean = false
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    copyright: string
    clientName: string
    client_logo_status: boolean = false
    two_factor_authentication: boolean = false
    client_logo: any

    constructor(private wheatherService: WeatherService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private cookieService: CookieService,
        private router: Router,
        private _snackBar: MatSnackBar,
        private generalService: GeneralService,
        public dialog: MatDialog,
        public subscriptionService: SubscriptionService,
    ) { }

    ngOnInit() {
        this.get_wheather_initial()
        this.get_wheather()
        this.app_config()



        this.authForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            userId: [''],
            otp_generator: ['']
        });

    }

    app_config() {
        this.generalService.get_app_config().subscribe({
            next: (result: any) => {
                const status = result.data.attributes.under_maintenance

                this.copyright = result.data.attributes.copyright
                this.clientName = result.data.attributes.client_name
                this.two_factor_authentication = result.data.attributes.two_factor_authentication
                this.cookieService.set('orgID', result.data.attributes.organization_id, { expires: 1, sameSite: 'Strict', secure: true });
                if (result.data.attributes.client_logo) {
                    this.client_logo = environment.client_backend + '/uploads/' + result.data.attributes.client_logo
                    this.client_logo_status = true
                }
                if (status === true) {
                    this.router.navigate(["/error/under-maintenance"])
                  } else{
                    this.me()

                  }


            },
            error: (err: any) => {
                const status = err.status
                const statusText = err.statusText
                this._snackBar.open('Error ' + status + ' : ' + statusText, 'Failed', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    duration: 3000
                });
                this.router.navigate(["application-error"])
            },
            complete: () => { }
        })
    }


    me() {
        this.authService.me().subscribe({
            next: (result: any) => {


            },
            error: (err: any) => {
            },
            complete: () => {
                this.router.navigate(["apps/insight"])

                //this.get_subscription()
            }
        })
    }

    // get_subscription() {
    //     this.subscriptionService.get_subscription().subscribe({
    //         next: (result: any) => {
    //             const status = result.data[0].attributes.active
    //             if (status === true) {
    //                 this.router.navigate(["apps/insight"])
    //             } else if (status === false) {
    //                 this.router.navigate(["error/invalid-subscription"])
    //             }
    //         },
    //         error: (err: any) => {
    //             this.router.navigate(["error/internal"])
    //         },
    //         complete: () => { }
    //     })
    // }



    get f() {
        return this.authForm.controls;
    }

    showPass() {
        var x = (<HTMLInputElement>document.getElementById("signInPassword"));
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }

    get_wheather_initial() {
        this.wheatherService.get_wheather().subscribe(res => {
            if (res) {
                this.set_wheather_data(res)
            }
        })
    }

    get_wheather() {
        interval(3 * 60 * 1000).pipe(mergeMap(() => this.wheatherService.get_wheather())).subscribe(res => {
            if (res) {
                this.set_wheather_data(res)
            }
        })
    }

    set_wheather_data(data: any) {
        if (data) {
            this.temp = data.current.temp_c
            this.condition = data.current.condition.text
            this.icon = data.current.condition.icon
            if (this.icon.indexOf("night") > -1) {
                this.day = "assets/images/wheather/night/"
            } else if (this.icon.indexOf("day") > -1) {
                this.day = "assets/images/wheather/day/"
            }
            const lastSegmentOfUrl = this.icon.substring(this.icon.lastIndexOf('/') + 1);
            const fileName = lastSegmentOfUrl.split(".")
            this.iconURL = this.day + fileName[0] + '.svg'
        }

    }

    // create_user_log() {
    //     this.authService.me().subscribe({
    //         next: (result: any) => {
    //             const profile = result.profile.id
    //             const loginDate = new Date()
    //             const logOutDate = null
    //             const type = "User login"
    //             this.authService.create_user_log(loginDate, logOutDate, type, profile).subscribe({
    //                 next: (result: any) => { },
    //                 error: (err: any) => { },
    //                 complete: () => {
    //                     this.get_subscription()
    //                 }
    //             })

    //         },
    //         error: (err: any) => { },
    //         complete: () => { }
    //     })
    // }

    signIn() {
        this.signinbtn = false
        this.signinLoading = true

        if (this.authForm.valid) {
            this.authService.authentication(this.authForm.value).subscribe({
                next: (result: any) => {
                    this.authForm.controls['userId'].setValue(result.user.id)
                    const jwt = result.jwt
                    if (jwt &&this.two_factor_authentication) {
                        this.authForm.controls['otp_generator'].setValue(false)
                        // const expiryDate = new Date();
                        // expiryDate.setMinutes(expiryDate.getMinutes() + 1);
                        // this.cookieService.set('session-token', result.jwt, { expires: expiryDate, sameSite: 'Strict', secure: true });
                        // this.router.navigate(["apps/insight"])

                        this.authService.generate_otp(this.authForm.value, jwt).subscribe({
                            next: (result: any) => { },
                            error: (err: any) => { },
                            complete: () => {
                                this.dialog.open(AuthenticationOtpComponent, {
                                    disableClose: true,
                                    data: { id: this.authForm.value.userId, jwt: jwt }
                                }).afterClosed().subscribe(data => {
                                    if (data) {
                                        this.cookieService.set('session-token', result.jwt, { expires: 1, sameSite: 'Strict', secure: true });
                                        
                                        // this.cookieService.set('session-token', result.jwt, { expires: new Date(Date.now() + 2 * 60 * 1000), sameSite: 'Strict', secure: true });
                                        // const expiryDate = new Date();
                                        // expiryDate.setMinutes(expiryDate.getMinutes() + 1);
                                        const expiryDate = new Date();
                                        expiryDate.setHours(24, 0, 0, 0);
                                        // this.cookieService.set('session-token', result.jwt, { expires: expiryDate, sameSite: 'Strict', secure: true });

                                        this.router.navigate(["apps/insight"])
                                    }
                                    else {
                                        this.signinbtn = true
                                        this.signinLoading = false
                                        this.authForm.reset()
                                    }
                                });
                            }
                        })
                    }else{
                        this.cookieService.set('session-token', result.jwt, { expires: 1, sameSite: 'Strict', secure: true });         
                        const expiryDate = new Date();
                        expiryDate.setHours(24, 0, 0, 0);
                        this.router.navigate(["apps/insight"])
                    }
                },
                error: (err: any) => {
                    this.signinbtn = true
                    this.signinLoading = false

                    const status = err.status
                    const statusText = err.error.error.message
                    this._snackBar.open('Error ' + status + ' : ' + statusText, 'Failed', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        duration: 3000
                    });
                },
                complete: () => {
                    //this.create_user_log()
                }
            })

        } else {
            this.signinbtn = true
            this.signinLoading = false
            const status = "Email ID & Password is Required"
            this._snackBar.open(status, 'Failed', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 3000
            });

        }

    }


    forgetPassword() {
        this.dialog.open(ForgetPasswordComponent).afterClosed().subscribe(data => {


            if (data) {




                this.authService.forget_password(data.email).subscribe({
                    next: (result: any) => {
                        if (result.data.id) {

                        }

                    },
                    error: (err: any) => {
                        const statusText = "Unable to proceed. Please try later"
                        this._snackBar.open(statusText, 'Failed', {
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                            duration: 3000
                        });
                    },
                    complete: () => {
                        Swal.fire({
                            title: 'Forget Password?',
                            text: "Successfully submited the reset password request. If the given email address is registered with us, shortly an automated email with reset password link will receive on the given email address. If it is not received, please contact the support center for more resolution.",
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Close'
                        }).then((result) => {

                        })
                    }
                })



            }

        });
    }
}
