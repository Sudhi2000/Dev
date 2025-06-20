import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.api.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { EquipmentService } from 'src/app/services/equipment.api.service';
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
  selector: 'app-view-refrigerant',
  templateUrl: './view-refrigerant.component.html',
  styleUrls: ['./view-refrigerant.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewRefrigerantComponent implements OnInit {
  Form: FormGroup
  mode: 'create' | 'update' = 'create';
  equipmentList: any[] = []
  refill_date = new FormControl(null, [Validators.required]);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<ViewRefrigerantComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private generalService: GeneralService,
    private environmentService: EnvironmentService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      equipment_name: ['', [Validators.required]],
      equipment: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      refill_date: [null],

    });


    if (this.defaults) {
      this.Form.controls['equipment_name'].setValue(this.defaults.equipment_name)
      this.Form.controls['unit'].setValue(this.defaults.unit)
      this.Form.controls['quantity'].setValue(this.defaults.quantity)
      this.Form.controls['refill_date'].setValue(this.defaults.refill_date)
      this.Form.disable()

    }
    this.configuration();
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.environment
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
          this.dialogRef.close()
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          // for (var i = 0; i < allcookies.length; i++) {
          //   var cookiePair = allcookies[i].split("=");
          //   if (name == cookiePair[0].trim()) {
          //     this.orgID = decodeURIComponent(cookiePair[1])
          //     this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
          //   }
          // }
          this.me()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
        this.dialogRef.close()

      },
      complete: () => { }
    })

  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.env_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
          this.dialogRef.close()
        } else {
          // this.get_dropdown_values()
          this.get_equipment()
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

  get_equipment() {
    this.environmentService.get_equipment().subscribe({
      next: (result: any) => {
        this.equipmentList = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  close() {
    this.dialogRef.close();
  }

}
