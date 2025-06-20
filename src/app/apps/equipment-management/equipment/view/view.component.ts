import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { ViewAssignmentComponent } from './view-assignment/view-assignment.component';
import { CurrencyPipe } from '@angular/common';
import { Location } from '@angular/common';
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
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  assignmentList: any[] = []
  dailylogList: any[] = []
  inspectionList: any[] = []
  currency: any
  currencyFormat: any
  inspectiondate = new FormControl(null, [Validators.required]);
  purchasedate = new FormControl(null, [Validators.required]);
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  backToHistory: Boolean = false

  constructor(private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private equipmentService: EquipmentService,
    public dialog: MatDialog,
    private currencyPipe: CurrencyPipe,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute, private _location: Location) {
  }

  ngOnInit(): void {

    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      reference_number: [''],
      reported_date: [new Date()],
      asset_unique_tag_id: [''],
      equipment_name: ['', [Validators.required]],
      equipment_type: ['', [Validators.required]],
      manufacturer: ['', [Validators.required]],
      fuel_type: ['', [Validators.required]],
      model: ['', [Validators.required]],
      serial_number: ['', [Validators.required]],
      purchase_price: ['', [Validators.required]],
      purchase_date: ['', [Validators.required]],
      fuel_capacity: ['', [Validators.required]],
      oil_capacity: ['', [Validators.required]],
      last_inspection_date: ['', [Validators.required]],
      geo_tag_id: ['', [Validators.required]],
      status: [''],
      last_odometer_reading: ['', [Validators.required]],
      assignment: [''],
      purchased_price: ['']
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.equipment
        this.currencyFormat = result.data.attributes.currency
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
          this.get_equipment_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }


  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }
  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  startDateChange(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['start_timeline'].setValue(newDate)
  }

  endDateChange(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['end_timeline'].setValue(newDate)
  }


  get_equipment_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.equipmentService.get_equipment_details(reference).subscribe({
      next: (result: any) => {
        console.log(result)
        this.Form.controls['asset_unique_tag_id'].setValue(result.data[0].attributes.asset_unique_tag_id)
        this.Form.controls['equipment_name'].setValue(result.data[0].attributes.equipment_name)
        this.Form.controls['id'].setValue(result.data[0].id)
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.Form.controls['equipment_type'].setValue(result.data[0].attributes.equipment_type)
        this.Form.controls['fuel_capacity'].setValue(result.data[0].attributes.fuel_capacity)
        this.Form.controls['fuel_type'].setValue(result.data[0].attributes.fuel_type)
        this.Form.controls['last_inspection_date'].setValue(result.data[0].attributes.last_inspection_date)
        this.Form.controls['manufacturer'].setValue(result.data[0].attributes.manufacturer)
        this.Form.controls['last_odometer_reading'].setValue(result.data[0].attributes.last_odometer_reading)
        this.Form.controls['model'].setValue(result.data[0].attributes.model)
        this.Form.controls['oil_capacity'].setValue(result.data[0].attributes.oil_capacity)
        this.Form.controls['purchase_date'].setValue(result.data[0].attributes.purchase_date)
        this.Form.controls['status'].setValue(result.data[0].attributes.status)
        this.Form.controls['purchased_price'].setValue(result.data[0].attributes.purchase_price);
        const amount = this.currencyPipe.transform(result.data[0].attributes.purchase_price, this.currencyFormat);
        this.Form.controls['purchase_price'].setValue(amount);
        this.Form.controls['serial_number'].setValue(result.data[0].attributes.serial_number)
        this.Form.controls['geo_tag_id'].setValue(result.data[0]?.attributes?.geo_tag?.data?.attributes?.tag_id)
        this.purchasedate.setValue(new Date(result.data[0].attributes.purchase_date))
        this.inspectiondate.setValue(new Date(result.data[0].attributes.last_inspection_date))
        if (result.data[0].attributes.assignment.data.length > 0) {
          this.assignmentList = result.data[0].attributes.assignment.data
        } else {
          this.assignmentList = []
        }
        if (result.data[0].attributes?.daily_log?.data.length > 0) {
          this.dailylogList = result.data[0].attributes.daily_log.data
        } else {
          this.dailylogList = []
        }
        if (result.data[0].attributes?.inspection?.data.length > 0) {
          this.inspectionList = result.data[0].attributes.inspection.data
        } else {
          this.inspectionList = []
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.Form.controls['equipment_name'].disable()
        this.Form.controls['equipment_type'].disable()
        this.Form.controls['fuel_capacity'].disable()
        this.Form.controls['fuel_type'].disable()
        this.Form.controls['last_inspection_date'].disable()
        this.Form.controls['manufacturer'].disable()
        this.Form.controls['last_odometer_reading'].disable()
        this.Form.controls['model'].disable()
        this.Form.controls['oil_capacity'].disable()
        this.Form.controls['purchase_date'].disable()
        this.Form.controls['serial_number'].disable()
        this.Form.controls['geo_tag_id'].disable()
        this.Form.controls['purchase_price'].disable()

        this.purchasedate.disable()
        this.inspectiondate.disable()
      }
    })
  }

  viewAssignment(assignmentData: any) {

    this.dialog.open(ViewAssignmentComponent, { data: assignmentData })



  }

  statusButton(data: any) {
    const Assigned = "btn-success"
    const Unassigned = "btn-secondary"
    if (data === "Unassigned") {
      return Unassigned
    } else if (data === "Assigned") {
      return Assigned
    } else {
      return
    }
  }
  navigate() {
    this.backToHistory = true
    this._location.back();
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }






}
