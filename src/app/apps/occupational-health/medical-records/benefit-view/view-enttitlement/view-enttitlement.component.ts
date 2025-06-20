import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NewBenefitTypeComponent } from 'src/app/apps/general-component/new-benefit-type/new-benefit-type.component';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { MaternityRegisterService } from 'src/app/services/maternity-register.service';
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
  selector: 'app-view-enttitlement',
  templateUrl: './view-enttitlement.component.html',
  styleUrls: ['./view-enttitlement.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewEnttitlementComponent implements OnInit {

  Form: FormGroup
  bendfitTypeList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  installmentDate = new FormControl(null);
  secondInstallmentDate = new FormControl(null);
  beneficiaryDate = new FormControl(null, [Validators.required]);

  orgID: string
  unitSpecific: any
  corporateUser: any
  peopleList: any
  userDivision: any
  mode: 'create' | 'update' = 'create';
  static id = 1;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private maternityService: MaternityRegisterService,
    public dialogRef: MatDialogRef<ViewEnttitlementComponent>
  ) { }

  ngOnInit(): void {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as any;
    }
    // this.configuration()
    this.Form = this.formBuilder.group({
      id: [this.defaults?.id],
      benefit_type: [this.defaults?.attributes?.benefit_type || '', [Validators.required]],
      amount: [this.defaults?.attributes?.amount || null, [Validators.required]],
      total_days_paid: [this.defaults?.attributes?.total_days_paid || null, [Validators.required]],
      first_installment_amount: [this.defaults?.attributes?.first_installment_amount || null],
      first_installment_date: [this.defaults?.attributes?.first_installment_date || null],
      second_installment_amount: [this.defaults?.attributes?.second_installment_amount || null],
      second_installment_date: [this.defaults?.attributes?.second_installment_date || null],
      is_benefit_received_someone: [this.defaults?.attributes?.is_benefit_received_someone || '', [Validators.required]],
      beneficiary_name: [this.defaults?.attributes?.beneficiary_name || '', [Validators.required]],
      beneficiary_address: [this.defaults?.attributes?.beneficiary_address || '', [Validators.required]],
      beneficiary_total_amount: [this.defaults?.attributes?.beneficiary_total_amount || null, [Validators.required]],
      beneficiary_date: [this.defaults?.attributes?.beneficiary_date || null, [Validators.required]],
      description: [this.defaults?.attributes?.description || ''],
      reporter: [''],

    });

    if (this.defaults.attributes?.mode === 'view') {
      this.installmentDate.setValue((this.defaults?.attributes?.first_installment_date))
      this.secondInstallmentDate.setValue((this.defaults?.attributes?.second_installment_date))
      this.beneficiaryDate.setValue((this.defaults?.attributes?.beneficiary_date))
    }
    if (this.defaults) {
      this.installmentDate.setValue((this.defaults?.attributes?.first_installment_date))
      this.secondInstallmentDate.setValue((this.defaults?.attributes?.second_installment_date))
      this.beneficiaryDate.setValue((this.defaults?.attributes?.beneficiary_date))
    }


    this.Form.disable()
    this.installmentDate.disable()
    this.secondInstallmentDate.disable()
    this.beneficiaryDate.disable()
    

  }


}
