import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { NewIssuedUserComponent } from './new-issued-user/new-issued-user.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2';
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
  selector: 'app-new-issue',
  templateUrl: './new-issue.component.html',
  styleUrls: ['./new-issue.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class NewIssueComponent implements OnInit {
  Form: FormGroup
  mode: 'create' | 'update' = 'create';
  issuedUserList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  userId: any;
  issuedDate = new FormControl(null);

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewIssueComponent>,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private environmentService: EnvironmentService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    console.log(this.defaults)
    if (this.defaults.mode == 'update') {

      this.mode = 'update';
      this.Form = this.formBuilder.group({
        id: [this.defaults?.id || null],
        issued_date: [this.defaults?.attributes?.issued_date || null],
        issued_quantity: [this.defaults?.attributes?.issued_quantity || ''],
        unit: [this.defaults?.attributes?.unit || ''],
        issued_to: [this.defaults?.attributes?.issued_to || '']
      });

      this.issuedDate.setValue(this.defaults?.attributes?.issued_date)
      // this.get_envIssuesById(this.defaults.id)

    } else if (this.defaults.mode == 'create') {

      this.Form = this.formBuilder.group({
        id: [null],
        issued_date: [null],
        issued_quantity: [''],
        unit: [this.defaults?.unit || ''],
        issued_to: ['']
      });

    }
    this.me()
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.env_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
          this.dialogRef.close()
        } else {
          this.userId = result.profile.id
          this.getIssuedUser()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
        this.dialogRef.close()

      },
      complete: () => {

      }
    })
  }

  getIssuedUser() {
    this.environmentService.get_issuedUser().subscribe({
      next: (result: any) => {
        this.issuedUserList = result.data
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    })
  }

  get_envIssuesById(id: any) {
    this.environmentService.get_envIssues_by_id(id).subscribe({
      next: (result: any) => {

        this.Form.controls['issued_date'].setValue(result?.attributes?.issued_date)
        this.Form.controls['unit'].setValue(result?.attributes?.unit)
        this.Form.controls['issued_quantity'].setValue(result?.attributes?.issued_quantity)
        this.Form.controls['issued_to'].setValue(result?.attributes?.issued_to)
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    })
  }

  issued_Date(date: any) {
    if (this.defaults.mode == 'update') {
      if (this.defaults?.id != null) {
        const selecteddate = new Date(date.value)
        selecteddate.setDate(selecteddate.getDate() + 1)
        this.Form.controls['issued_date'].setValue(selecteddate)
      } else {
        const selecteddate = new Date(date.value)
        // selecteddate.setDate(selecteddate.getDate() + 1)
        this.Form.controls['issued_date'].setValue(selecteddate)
      }

    } else if (this.defaults.mode == 'create') {
      if (this.defaults?.newIssue.length > 0) {
        const selecteddate = new Date(date.value)
        selecteddate.setDate(selecteddate.getDate() + 1)
        this.Form.controls['issued_date'].setValue(selecteddate)
      } else {
        const selecteddate = new Date(date.value)
        // selecteddate.setDate(selecteddate.getDate() + 1)
        this.Form.controls['issued_date'].setValue(selecteddate)
      }
    }

  }

  create_issuedUser() {
    this.dialog.open(NewIssuedUserComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.issuedUserList.find(obj => obj.attributes.name === data.name);
        if (found) {
          const statusText = "Issued User already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.environmentService.create_issuedUser(data, this.userId).subscribe({
            next: (result: any) => {
              this.environmentService.get_issuedUser().subscribe({
                next: (result: any) => {
                  this.issuedUserList = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Issued User created successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['issued_to'].setValue(result.data.attributes.name)

                }
              })
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => { }
          })
        }

      }
    })
  }

  update_issued_to(issuedData: any) {
    this.dialog.open(NewIssuedUserComponent, { data: issuedData }).afterClosed().subscribe((data: any) => {

      if (data) {

        const found = this.issuedUserList.find(obj => obj.attributes.name === data.name)

        this.environmentService.update_issuedUser(data, this.userId).subscribe({

          next: (result: any) => {
            this.environmentService.get_issuedUser().subscribe({
              next: (result: any) => {
                this.issuedUserList = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Issued User created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['issued_to'].setValue(result.data.attributes.name)

              }
            })

          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })

      }
    })
  }



  delete_issued_to(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the issued user.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.environmentService.delete_issuedUser(id).subscribe({
          next: (result: any) => {
            this.Form.controls.issued_to.reset()
          },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Issued user deleted"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.getIssuedUser()
          }
        })
      }
    })
  }

  submit() {
    this.dialogRef.close({ issueList: this.Form.value });
  }

}
