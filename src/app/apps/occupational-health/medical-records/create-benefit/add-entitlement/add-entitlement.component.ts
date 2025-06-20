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
  selector: 'app-add-entitlement',
  templateUrl: './add-entitlement.component.html',
  styleUrls: ['./add-entitlement.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AddEntitlementComponent implements OnInit {
  Form: FormGroup
  benefitTypeList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  // installmentDate = new FormControl(null);
  // secondInstallmentDate = new FormControl(null);
  
  beneficiaryDate = new FormControl(null);
  firstInstallmentDate = new FormControl(null)
  secondInstallmentDate = new FormControl(null)

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
    // private acidentService:AccidentService,
    public dialogRef: MatDialogRef<AddEntitlementComponent>
  ) { }

  ngOnInit(): void {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as any;
    }
    // this.configuration()
    this.Form = this.formBuilder.group({
      id: [this.defaults.id || AddEntitlementComponent.id++],
      // org_id: [this.defaults.org_id || ''],
      benefit_type: [this.defaults?.benefit_type || '', [Validators.required]],
      amount: [this.defaults?.amount || '', [Validators.required]],
      total_days_paid: [this.defaults?.total_days_paid || '', [Validators.required]],
      first_installment_amount: [this.defaults?.first_installment_amount || null],
      first_installment_date: [this.defaults?.first_installment_date || null],
      second_installment_amount: [this.defaults?.first_installment_amount || null],
      second_installment_date: [this.defaults?.second_installment_date || null],
      is_benefit_received_someone: [this.defaults?.is_benefit_received_someone || '', [Validators.required]],
      beneficiary_name: [this.defaults?.beneficiary_name || '', [Validators.required]],
      beneficiary_address: [this.defaults?.beneficiary_address || '', [Validators.required]],
      beneficiary_total_amount: [this.defaults?.beneficiary_total_amount || '', [Validators.required]],
      beneficiary_date: [this.defaults?.beneficiary_date || null],
      description: [this.defaults?.description || ''],
      reporter: [this.defaults?.reporter || '']

    });
 

    if (this.defaults) {
      this.firstInstallmentDate.setValue((this.defaults?.first_installment_date))
      this.secondInstallmentDate.setValue((this.defaults?.second_installment_date ))
      this.beneficiaryDate.setValue((this.defaults?.beneficiary_date))
    }

    this.me();
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.Form.controls['reporter'].setValue(result.id);
        const status = result.acc_inc_create;

      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        this.create_benefitType();
      },
    });
  }

  create_benefitType() {
    this.generalService.get_benefitType().subscribe({
      next: (result: any) => {
        this.benefitTypeList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {
      },
    });
  }

  installmentDateVal(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['first_installment_date'].setValue(selectedDate)
  }

  secondInstallmentDateVal(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['second_installment_date'].setValue(selectedDate)
  }

  beneficiaryDateVal(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['beneficiary_date'].setValue(selectedDate)
  }

  new_benefitType() {
    this.dialog
      .open(NewBenefitTypeComponent)
      .afterClosed()
      .subscribe((data: any) => {
        const name = data.name;
        this.generalService
          .create_benefitType(name, this.Form.value.reporter)
          .subscribe({
            next: (result: any) => {
              this.generalService.get_benefitType().subscribe({
                next: (result: any) => {
                  this.benefitTypeList = result.data;
                },
                error: (err: any) => {
                  this.router.navigate(['/error/internal']);
                },
                complete: () => {
                  const statusText = 'Benefit type created successfully';
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['benefit_type'].setValue(
                    result.data.attributes.type
                  );
                },
              });
            },
            error: (err: any) => {
              this.router.navigate(['/error/internal']);
            },
            complete: () => { },
          });
      });
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
