import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { accident_expense } from '../../../../services/schemas';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {

  categories: any[] = []
  orgID: any
  currency: any
  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  filterCategory(value: any) {
    return value.attributes?.Category === "Expense Category"
  }
  
  getFilteredParticularValues() {
    const selectedCategory = this.form?.get('category')?.value;
    return this.categories.filter(particular => this.filterParticular(particular, selectedCategory));
  }

  filterParticular(value: any, selectedCategory: string) {
    return value.attributes?.Category === "Expense Particular" && value.attributes?.filter === selectedCategory;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<ExpenseComponent>,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe) {
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as accident_expense;
    }

    this.form = this.fb.group({
      id: [this.defaults.id || '',],
      category: [this.defaults.attributes?.category || '', [Validators.required]],
      particular: [this.defaults.attributes?.particular || '', [Validators.required]],
      amount: [this.defaults.attributes?.amount || '', [Validators.required]],
      amountVal: ['']
    });
    this.configuration()
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident
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

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.acc_inc_action
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.dropdownValues()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  cost(data: any) {
    const amount = this.currencyPipe.transform(Number(data.target.value), this.currency);
    this.form.controls['amount'].setValue(data.target.value)
    this.form.controls['amountVal'].setValue(data.target.value)
    this.costSymbol(Number(data.target.value))
  }

  costSymbol(data: any) {
    const amount = this.currencyPipe.transform(data, this.currency);
    this.form.controls['amount'].setValue(amount)
  }

  dropdownValues() {
    const module = "Accident and Incident"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.categories = result.data
      },
      error: (err: any) => { },
      complete: () => {
      }

    })
  }

  defaultValues() {
    if (this.defaults) {
      this.form.controls['id'].setValue(this.defaults.id);
      this.form.controls['category'].setValue(this.defaults.attributes?.category);
      this.form.controls['particular'].setValue(this.defaults.attributes?.particular);
      this.form.controls['amount'].setValue(this.defaults.attributes?.amount)
      this.form.controls['amountVal'].setValue(this.defaults.attributes?.amount)
      this.costSymbol(this.defaults.attributes?.amount)
    }
  }

  save() {
    if (this.mode === 'create') {
      this.create();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }

  create() {
    const expense = this.form.value;
    this.dialogRef.close(expense);
  }

  update() {
    const expense = this.form.value;
    this.dialogRef.close(expense);
  }

  updateCustomer() {
    const customer = this.form.value;
    customer.id = this.defaults.id;
    this.dialogRef.close(customer);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

}
