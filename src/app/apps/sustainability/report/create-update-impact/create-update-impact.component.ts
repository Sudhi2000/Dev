import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { impact } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { CreateImpactTypeComponent } from '../create-impact-type/create-impact-type.component';
import { SustainabilityService } from 'src/app/services/sustainability.api.service';

@Component({
  selector: 'app-create-update-impact',
  templateUrl: './create-update-impact.component.html',
  styleUrls: ['./create-update-impact.component.scss']
})
export class CreateUpdateImpactComponent implements OnInit {

  Form: FormGroup
  units: any[] = []
  orgID: string
  types: any[] = []
  UnitListData: any[] = []
  UnitList: any[] = []
  TypeList: any[] = []
  dropdownValues: any
  mode: 'create' | 'update' = 'create';
  static id = 1;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private sustainabilityService: SustainabilityService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateUpdateImpactComponent>) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';

    } else {
      this.defaults = {} as impact;
    }
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['', [Validators.required]],
      impact_type: ['', [Validators.required]],
      impact_unit: ['', [Validators.required]],
      impact_value: ['', [Validators.required]],
    });

  }

  ///check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.sustainability
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
        const status = result.sus_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_dropdown_values()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  //get dropdown values
  get_dropdown_values() {
    const module = "Sustainability"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
         this.get_types()
      },
      error: (err: any) => { },
      complete: () => {

      }
    })
  }

  //get unit
  // get_units() {
  //   this.units = []
  //   const unit = this.dropdownValues.filter(function (elem: any) {
  //     return (elem.attributes.Category === "Impact Unit")
  //   })
  //   this.UnitListData = unit
  //   this.get_types()
  // }

  //get unit
  get_types() {
    this.types = []
    this.sustainabilityService.get_impact_types().subscribe({
      next: (result: any) => {        
        this.TypeList = result.data
        this.UnitListData = result.data
         this.getUnit()
      },
      error: (err: any) => { },
      complete: () => { 
        this.default_details()
      }
    })
    // const type = this.dropdownValues.filter(function (elem: any) {
    //   return (elem.attributes.Category === "Impact Type")
    // })
    // this.TypeList = type
  }

  default_details() {
    if (this.mode === 'update') {
      this.Form.controls['id'].setValue(this.defaults.id)
      this.Form.controls['impact_type'].setValue(this.defaults.attributes.type)
      this.getUnit()
      this.Form.controls['impact_unit'].setValue(this.defaults.attributes.unit)
      this.Form.controls['impact_value'].setValue(this.defaults.attributes.value)
    }
  }
  new_impact_type() {
    this.dialog
      .open(CreateImpactTypeComponent)
      .afterClosed()
      .subscribe((data: any) => {     
        if(data){
          this.sustainabilityService
          .create_impact_type(data)
          .subscribe({
            next: (result: any) => {
              this.sustainabilityService.get_impact_types().subscribe({
                next: (result: any) => {
                  
                  this.TypeList = result.data
                  this.UnitListData=result.data
                  // const type = this.dropdownValues.filter(function (elem: any) {
                  //   return (elem.attributes.Category === "Impact Type")
                  // })
                  // this.TypeList = type
                },
                error: (err: any) => {
                  this.router.navigate(['/error/internal']);
                },
                complete: () => {
                  const statusText = 'New impact type created successfully';
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['impact_type'].setValue(
                    result.data.attributes.value
                  );
                  this.getUnit()
                },
              });
            },
            error: (err: any) => {
              this.router.navigate(['/error/internal']);
            },
            complete: () => { },
          });}
      });
  }
  getUnit() {
    this.Form.controls['impact_unit'].reset()
    this.Form.controls['impact_value'].reset()
    const typeVal = this.Form.value.impact_type
    const unitData = this.UnitListData.filter(function (elem: any) {      
      return (elem.attributes.value === typeVal )
    })
    const units = unitData[0]?.attributes.impact_unit.split(',').map((unit: string) => unit.trim());
    this.UnitList = units;
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }
}
