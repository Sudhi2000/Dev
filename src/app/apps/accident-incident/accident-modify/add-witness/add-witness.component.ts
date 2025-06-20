import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NewDepartmentComponent } from 'src/app/apps/general-component/new-department/new-department.component';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { witness } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-witness',
  templateUrl: './add-witness.component.html',
  styleUrls: ['./add-witness.component.scss']
})
export class AddWitnessComponentModify implements OnInit {
  Form: FormGroup
  divisions: any[] = []
  orgID: string
  departments: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  corporateUser:any
  unitSpecific:any
  userDivision:any
  peopleList:any
  Division = new FormControl(null, [Validators.required]);
  mode: 'create' | 'update' = 'create';
  static id = 1;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AddWitnessComponentModify>,
    public accidentService: AccidentService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
    ) { }

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
      employee_id: [this.defaults?.attributes?.employee_id || '', [Validators.required]],
      name: [this.defaults?.attributes?.name || '', [Validators.required]],
      division: [this.defaults?.attributes?.division || '', [Validators.required]],
      department: [this.defaults?.attributes?.department || ''],
      business_unit:[null]
    });
  }

  ///check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident
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
        const status = result.acc_inc_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_divisions()
          this.get_department()
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
              this.Form.controls['department'].setValue(result.data.attributes.department_name)
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

  //get divisions
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
    if (this.defaults.attributes) {
      this.accidentService.update_witness(this.Form.value).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          this.dialogRef.close(this.Form.value);
        }
      })
    }else{
      this.dialogRef.close(this.Form.value);
    }
  }

}
