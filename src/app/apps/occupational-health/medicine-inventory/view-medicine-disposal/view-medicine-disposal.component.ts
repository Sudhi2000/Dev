import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DropzoneDirective } from 'ngx-dropzone-wrapper';
import { CurrencyPipe } from '@angular/common';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';

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
  selector: 'app-view-medicine-disposal',
  templateUrl: './view-medicine-disposal.component.html',
  styleUrls: ['./view-medicine-disposal.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewMedicineDisposalComponent implements OnInit {

  Form: FormGroup
  currency:any
  orgID:any

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
      ],
    },
  }


  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any, private generalService: GeneralService,
    private medicineService: MedicineInventoryService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar, private currencyPipe: CurrencyPipe,
    public dialogRef: MatDialogRef<ViewMedicineDisposalComponent>) {
  }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id:[''],
      transaction_date: [new Date()],
      reference_number: [''],
      medicine: [this.defaults.attributes.medicine_name],
      total_quantity: [this.defaults.attributes.available_quantity],
      disposed_quantity: [this.defaults.attributes.disposed_quantity],
      authorized_contrator: [this.defaults.attributes.authorized_contractor, [Validators.required]],
      cost: [this.defaults.attributes.cost],
      cost_val:[''],
      balance: [this.defaults.attributes.balance_quantity],
      remarks: [this.defaults.attributes.disposal_details],
      unit: [this.defaults.attributes.unit],
    });
    this.Form.controls['medicine'].disable()
    const amount = this.currencyPipe.transform(this.defaults.attributes.cost, this.currency);
    this.Form.controls['cost_val'].setValue(amount)
    this.Form.disable()

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health
        this.currency = result.data.attributes.currency
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
        const status = result.med_disposal
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

  close(){
    this.dialogRef.close()
  }


}
