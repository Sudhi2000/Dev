import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-update-progress',
  templateUrl: './create-update-progress.component.html',
  styleUrls: ['./create-update-progress.component.scss']
})
export class CreateUpdateProgressComponent implements OnInit {
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  currency: any
  orgID: any
  years: any[] = []
  baseline: any
  consumption: any

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

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<CreateUpdateProgressComponent>,
    private fb: FormBuilder, private generalService: GeneralService,
    private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.baseline = this.defaults[0].baseline_consumption
    this.consumption = this.defaults[0].consumption
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as any;
    }

    this.form = this.fb.group({
      id: [],
      org_id: ['', [Validators.required]],
      year: ['', [Validators.required]],
      actual_savings: ['', [Validators.required]],
      targeted_consumption: ['', [Validators.required]],
      actual_ghs_emission: ['', [Validators.required]],
      remarks: ['', [Validators.required]]
    });
    this.configuration()
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.target_setting
        this.currency = result.data.attributes.currency
        this.years = result.data.attributes.Year
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
              this.form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
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
        const status = result.trs_action
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

  save() {
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }

  createCustomer() {
    const customer = this.form.value;
    this.dialogRef.close(customer);
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

  submit() {
    this.form.enable()
    this.dialogRef.close(this.form.value);
  }

  target_consumption(data: any) {
    const actual = Number(data.target.value)
    const target = Number(this.baseline) - (actual + Number(this.consumption))
    if (target < 0) {
      this.form.controls['targeted_consumption'].setValue(0)
      this.form.controls['targeted_consumption'].disable()
    } else if (target > 0) {
      this.form.controls['targeted_consumption'].setValue(target)
      this.form.controls['targeted_consumption'].disable()
    }
  }

}
