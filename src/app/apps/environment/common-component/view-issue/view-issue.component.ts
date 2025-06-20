import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
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
  selector: 'app-view-issue',
  templateUrl: './view-issue.component.html',
  styleUrls: ['./view-issue.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewIssueComponent implements OnInit {
  Form: FormGroup
  issuedUserList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  userId: any;
  issuedDate = new FormControl(null, [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ViewIssueComponent>,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private environmentService: EnvironmentService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      issued_date: [null, [Validators.required]],
      issued_quantity: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      issued_to: ['', [Validators.required]]
    });

    if (this.defaults) {
      this.Form.controls['issued_date'].setValue(this.defaults?.attributes?.issued_date)
      this.Form.controls['unit'].setValue(this.defaults?.attributes?.unit)
      this.Form.controls['issued_quantity'].setValue(this.defaults?.attributes?.issued_quantity)
      this.Form.controls['issued_to'].setValue(this.defaults?.attributes?.issued_to)
      this.Form.disable()

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

  issued_Date(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['issued_date'].setValue(selecteddate)
  }

  close() {
    this.dialogRef.close();
  }

}
