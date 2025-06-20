import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { assignment } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { CreateClientComponent } from '../../../create-client/create-client.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import Swal from 'sweetalert2'

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
  selector: 'app-create-update-assignment',
  templateUrl: './create-update-assignment.component.html',
  styleUrls: ['./create-update-assignment.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateUpdateAssignmentComponent implements OnInit {

  lat = 8.5241;
  lng = 76.9366;

  Form: FormGroup
  orgID: string
  client: any[] = []
  ClientList: any[] = []
  ProfileList: any[] = []
  dropdownValues: any
  mode: 'create' | 'update' = 'create';
  static id = 1;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  startdate = new FormControl(null, [Validators.required]);
  enddate = new FormControl(null, [Validators.required]);
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private equipmentService: EquipmentService,
    public dialogRef: MatDialogRef<CreateUpdateAssignmentComponent>) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';


    } else {
      this.defaults = {} as assignment;

    }
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      client_id: [''],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      client_name: ['', [Validators.required]],
      project_name: ['', [Validators.required]],
      assigned_operator: ['', [Validators.required]],
      project_location: ['', [Validators.required]],
    });

  }

  ///check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.equipment
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
        const status = result.equipment_action
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_profiles()
          this.get_clients()
          this.default_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        this.ProfileList = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_clients() {
    this.equipmentService.get_clients().subscribe({
      next: (result: any) => {
        this.ClientList = result.data
        console.log(result.data)

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }
  new_client() {
    this.dialog.open(CreateClientComponent).afterClosed().subscribe((data: any) => {
      if(data){
        this.equipmentService.get_clients().subscribe({
          next: (result: any) => {
            this.ClientList = result.data
            this.Form.controls['client_name'].setValue(data.client_name)
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })
        
      }
    })
  }


  default_details() {
    if (this.mode === 'update') {
      console.log(this.defaults)
      this.Form.controls['id'].setValue(this.defaults.id)
      this.Form.controls['start_date'].setValue(this.defaults.attributes.start_date)
      this.Form.controls['end_date'].setValue(this.defaults.attributes.end_date)
      this.Form.controls['project_location'].setValue(this.defaults.attributes.project_location)
      this.Form.controls['client_name'].setValue(this.defaults.attributes.client.data.id)
      this.Form.controls['assigned_operator'].setValue(this.defaults.attributes.assigned_operator.data.id)
      this.Form.controls['project_name'].setValue(this.defaults.attributes.project_name)
      this.startdate.setValue(new Date(this.defaults.attributes.start_date))
      this.enddate.setValue(new Date(this.defaults.attributes.end_date))
    }
  }
  endDate(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['end_date'].setValue(selecteddate)
  }

  startDate(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['start_date'].setValue(selecteddate)
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
