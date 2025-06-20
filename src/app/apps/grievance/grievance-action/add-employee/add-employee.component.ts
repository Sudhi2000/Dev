import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NewDepartmentComponent } from 'src/app/apps/general-component/new-department/new-department.component';
import { NewDesignationComponent } from 'src/app/apps/general-component/new-designation/new-designation.component';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { GrievanceService } from 'src/app/services/grievance.api.service';
import { witness } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {


  Form: FormGroup
  designations: any[] = []
  departments: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: string
  employeeDetails: any
  mode: 'create' | 'update' = 'create';
  static id = 1;
  constructor(
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private grievanceService: GrievanceService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddEmployeeComponent>) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      empid: [''],
      employee_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
    });
  }
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.grievance
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
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
        const status = result.grev_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_designation()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_designation() {
    this.generalService.get_designation().subscribe({
      next: (result: any) => {
        this.designations = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.get_department()
      }
    })
  }

  get_department() {
    this.generalService.get_department().subscribe({
      next: (result: any) => {

        this.departments = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  new_department() {

    this.dialog.open(NewDepartmentComponent).afterClosed().subscribe((data: any) => {

      const name = data.name
      this.generalService.create_department(name, this.Form.value.reporter).subscribe({
        next: (result: any) => {
          this.generalService.get_department().subscribe({
            next: (result: any) => {
              this.departments = result.data
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              const statusText = "Department created successfully"
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_department()
            }
          })
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })

    })


  }
  new_designation() {

    this.dialog.open(NewDesignationComponent).afterClosed().subscribe((data: any) => {
      const name = data.name
      this.generalService.create_designation(name, this.Form.value.reporter).subscribe({
        next: (result: any) => {
          this.generalService.get_designation().subscribe({
            next: (result: any) => {
              this.departments = result.data
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              const statusText = "Designation created successfully"
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_designation()
            }
          })
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })

    })


  }
  fetchEmployeeDetails() {
    const employeeId = this.Form.value.employee_id
    this.generalService.get_employees().subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((employee: any) => employee.attributes.employee_id === employeeId);
        this.employeeDetails = filteredData;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        if (this.employeeDetails.length > 0) {
          const statusText = "The given employee already exists"
          this._snackBar.open(statusText, 'Ok', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.Form.controls['employee_id'].reset()
        }
      }
    });

  }
  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
