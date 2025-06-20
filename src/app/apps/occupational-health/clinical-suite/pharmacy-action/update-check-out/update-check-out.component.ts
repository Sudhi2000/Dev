import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-update-check-out',
  templateUrl: './update-check-out.component.html',
  styleUrls: ['./update-check-out.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class UpdateCheckOutComponent implements OnInit {
  Form: FormGroup;

  checkoutDate = new FormControl(new Date(), [Validators.required]);
  checkoutTime = new FormControl(new Date(), [Validators.required]);


  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UpdateCheckOutComponent>) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      check_out: [new Date(), [Validators.required]],
      check_out_date:[new Date(), [Validators.required]]
    });

  }

  submit(){
    this.dialogRef.close(this.Form.value)

  }

  checkoutDateVal(data: any) {
    this.Form.controls['check_out'].setValue(new Date(data.value))
    this.Form.controls['check_out_date'].setValue(new Date(data.value))
  }

  checkoutTimeValue(data: any) {
    const hoursVal = data.getHours();
    const minutesVal = data.getMinutes();
    const date = new Date(this.checkoutDate.value);
    date.setHours(hoursVal, minutesVal);
    console.log(date)
    this.Form.controls['check_out'].setValue(new Date(date))

  }

}
