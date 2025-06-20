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
import { CreateEquipmentComponent } from '../create-equipment/create-equipment.component';
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
  selector: 'app-refrigerant',
  templateUrl: './refrigerant.component.html',
  styleUrls: ['./refrigerant.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class RefrigerantComponent implements OnInit {
  Form: FormGroup
  mode: 'create' | 'update' = 'create';
  equipmentList: any[] = []
  refill_date = new FormControl(null, [Validators.required]);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<RefrigerantComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private generalService: GeneralService,
    private environmentService: EnvironmentService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log("defaults", this.defaults)

    if (this.defaults.mode == 'update') {
      this.Form = this.formBuilder.group({
        id: [this.defaults.id],
        equipment_name: [this.defaults?.attributes?.equipment_name || '', [Validators.required]],
        equipment: [this.defaults?.attributes?.equipment || null, [Validators.required]],
        unit: [this.defaults?.attributes?.unit || '', [Validators.required]],
        quantity: [this.defaults?.attributes?.quantity || '', [Validators.required]],
        refill_date: [this.defaults?.attributes?.refill_date || null],

      });

      this.refill_date.setValue(this.defaults?.attributes?.refill_date)
      this.get_equipment()

    } else if (this.defaults.mode == 'create') {

      this.Form = this.formBuilder.group({
        id: [null],
        equipment_name: ['', [Validators.required]],
        equipment: [null, [Validators.required]],
        unit: [this.defaults?.unit || '', [Validators.required]],
        quantity: ['', [Validators.required]],
        refill_date: [null],

      });
    }


    // this.Form.controls['unit'].setValue(this.defaults.unit)

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

  create_Equipment() {
    this.dialog.open(CreateEquipmentComponent, { width: '800' }).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.equipmentList.find(obj => obj.attributes.equipment_name === data.equipment_name);
        if (found) {
          const statusText = "Equipment already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.Form.patchValue({
            equipment: found.attributes.equipment_name,
          })
        } else {
          this.environmentService.create_equipment(data).subscribe({
            next: (result: any) => {
              this.environmentService.get_equipment().subscribe({
                next: (result: any) => {
                  this.equipmentList = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Equipment created successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['equipment_name'].setValue(result.data.attributes.equipment_name)
                  this.Form.controls['equipment'].setValue(result.data.id)
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

  update_Equipment(eqpData: any) {
    this.dialog.open(CreateEquipmentComponent, { data: eqpData }).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.equipmentList.find(obj => obj.attributes.equipment_name === data.equipment_name)
        this.environmentService.update_equipment(data).subscribe({
          next: (result: any) => {
            this.environmentService.get_equipment().subscribe({
              next: (result: any) => {
                this.equipmentList = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Equipment updated successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['equipment_name'].setValue(result.data.attributes.equipment_name)
                this.Form.controls['equipment'].setValue(result.data.id)

              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
          }
        })

      }
    })
  }

  delete_Equipment(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the Equipment.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.environmentService.delete_equipment(id).subscribe({
          next: (result: any) => {
            this.Form.controls['equipment'].reset()
          },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Equipment deleted"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_equipment()
          }
        })
      }
    })
  }

  refillDate(date: any) {

    if (this.defaults.mode == 'update') {
      if (this.defaults?.id != null) {
        const selecteddate = new Date(date.value)
        selecteddate.setDate(selecteddate.getDate() + 1)
        this.Form.controls['refill_date'].setValue(selecteddate)
      } else {
        const selecteddate = new Date(date.value)
        // selecteddate.setDate(selecteddate.getDate() + 1)
        this.Form.controls['refill_date'].setValue(selecteddate)
      }

    } else if (this.defaults.mode == 'create') {
      if (this.defaults?.refrigerants.length > 0) {
        const selecteddate = new Date(date.value)
        selecteddate.setDate(selecteddate.getDate() + 1)
        this.Form.controls['refill_date'].setValue(selecteddate)
      } else {
        const selecteddate = new Date(date.value)
        // selecteddate.setDate(selecteddate.getDate() + 1)
        this.Form.controls['refill_date'].setValue(selecteddate)
      }
    }

  }


  submit() {
    const selectedData = this.equipmentList.find(data => data.attributes.equipment_name == this.Form.value.equipment_name);
    this.Form.controls['equipment'].setValue(selectedData.id)

    this.dialogRef.close({ refrigerants: this.Form.value });
  }

}
