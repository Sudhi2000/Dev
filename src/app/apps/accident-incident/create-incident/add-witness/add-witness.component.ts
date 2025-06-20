import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NewDepartmentComponent } from 'src/app/apps/general-component/new-department/new-department.component';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { witness } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { IncidentService } from 'src/app/services/incident.api.service';
@Component({
  selector: 'app-add-witness',
  templateUrl: './add-witness.component.html',
  styleUrls: ['./add-witness.component.scss']
})
export class AddIncidentWitnessComponent implements OnInit {
  Form: FormGroup
  divisions: any[] = []
  orgID: string
  mode: 'create' | 'update' = 'create';
  static id = 1;
  departments: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Division = new FormControl(null, [Validators.required]);
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private IncidentService:IncidentService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddIncidentWitnessComponent>) { }
    unitSpecific:any
    corporateUser:any
    userDivision:any
    peopleList:any
  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as witness;
    }
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [this.defaults.id],
      org_id: [this.defaults.org_id || '', [Validators.required]],
      employee_id: [this.defaults.employee_id || '', [Validators.required]],
      name: [this.defaults.name || '', [Validators.required]],
      division: [this.defaults.division || '', [Validators.required]],
      department: [this.defaults.department || ''],
      business_unit:[null]
    });
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident
        this.unitSpecific = result.data.attributes.business_unit_specific
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
        const status = result.acc_inc_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_divisions()
          this.get_department()
          // if (this.unitSpecific) {
          //   this.corporateUser = result.profile.corporate_user
          //   if (this.corporateUser) {
          //   this.get_profiles()
          //     this.get_divisions()
          //   } else if (!this.corporateUser) {
          //     let divisions: any[] = []
          //     result.profile.divisions.forEach((elem: any) => {
          //       divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
          //       this.divisions.push(elem)
          //     })
          //     let results = divisions.join('&');
          //     this.userDivision = results
          //    this.get_unit_specific_assignee()

          //   }
          // } else {
           
          //   this.get_divisions()
          // }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
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
              this.Form.controls['department'].setValue(result.data.attributes.name)
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

  get_unit_specific_assignee() {
    this.IncidentService.get_unit_specific_assignee(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
        
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => { 
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
        }));
        
        this.divisions =newArray;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }


get_profiles() {
  this.authService.get_hse_head_profiles(this.orgID).subscribe({
    next: (result: any) => {
      const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked===false && profile.attributes.user?.data?.attributes?.acc_inc_action === true);
      this.peopleList = filteredData;
    },
    error: (err: any) => {
      this.router.navigate(["/error/internal"])
    },
    complete: () => {
    }
  });
}

BusinessUnit(event: any) {     
  this.Form.controls['division'].setValue(event.value.division_name) 
  this.Form.controls['business_unit'].setValue(event.value.id)  
}
}