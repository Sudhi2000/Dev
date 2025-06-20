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
import { SustainabilityService } from 'src/app/services/sustainability.api.service';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { CurrencyPipe } from '@angular/common';

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
  selector: 'app-chemical-diposal-view',
  templateUrl: './chemical-diposal-view.component.html',
  styleUrls: ['./chemical-diposal-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChemicalDiposalViewComponent implements OnInit {
  
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
    private chemicalService: ChemicalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sustainabilityService: SustainabilityService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar, private currencyPipe: CurrencyPipe,
    public dialogRef: MatDialogRef<ChemicalDiposalViewComponent>) {
  }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id:[''],
      transaction_date: [new Date()],
      reference_number: [''],
      chemical: [this.defaults.attributes.chemical_name],
      total_quantity: [this.defaults.attributes.available_quantity+' '+this.defaults.attributes.unit],
      disposed_quantity: [this.defaults.attributes.disposed_quantity+' '+this.defaults.attributes.unit],
      authorized_contrator: [this.defaults.attributes.authorized_contractor, [Validators.required]],
      cost: [this.defaults.attributes.cost],
      cost_val:[''],
      balance: [this.defaults.attributes.balance_quantity+' '+this.defaults.attributes.unit],
      remarks: [this.defaults.attributes.disposal_details],
      unit: [this.defaults.attributes.unit],
    });
    this.Form.controls['chemical'].disable()
    const amount = this.currencyPipe.transform(this.defaults.attributes.cost, this.currency);
    this.Form.controls['cost_val'].setValue(amount)
    this.Form.disable()

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.chemical
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
        const status = result.chem_inven
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
