import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';

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
  selector: 'app-update-return-date',
  templateUrl: './update-return-date.component.html',
  styleUrls: ['./update-return-date.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class UpdateReturnDateComponent implements OnInit {
  Form:FormGroup
  returndate = new FormControl(null, [Validators.required]);


  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UpdateReturnDateComponent>) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      return_date: ['',[Validators.required]]
      
    });
  }

  returnDate(data: any) {
    this.Form.controls['return_date'].setValue(new Date(data.value))


  }

  submit(){
    this.dialogRef.close(this.Form.value);

  }

}
