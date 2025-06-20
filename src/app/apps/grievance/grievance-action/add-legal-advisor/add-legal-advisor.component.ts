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
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';

@Component({
  selector: 'app-add-legal-advisor',
  templateUrl: './add-legal-advisor.component.html',
  styleUrls: ['./add-legal-advisor.component.scss']
})
export class AddLegalAdvisorComponent implements OnInit {

  Form: FormGroup
  designations: any[] = []
  departments: any[] = []
  employeeDetails: any
  editEmployee: boolean = false
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: string
  mode: 'create' | 'update' = 'create';
  static id = 1;
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private grievanceService: GrievanceService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddLegalAdvisorComponent>) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      grievId: [this.defaults],
      org_id: [''],
      email_id: ['',[Validators.required]],
      name: ['',[Validators.required]],
      phone: [null,[Validators.required]],
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.grev_create
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
 
  submit() {

      this.grievanceService.create_legal_advisor(this.Form.value).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          this.dialogRef.close();
        }
      })
 
     
  }
}
