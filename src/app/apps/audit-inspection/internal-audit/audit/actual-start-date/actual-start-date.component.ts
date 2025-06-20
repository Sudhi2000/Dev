import { Component, OnInit ,Inject} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
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
  selector: 'app-actual-start-date',
  templateUrl: './actual-start-date.component.html',
  styleUrls: ['./actual-start-date.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ActualStartDateComponent implements OnInit {

  Form:FormGroup
  actualstartDate = new FormControl(null, [Validators.required]);
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
  private formBuilder: FormBuilder,
    private internalService:InternalAuditService,
    public dialogRef: MatDialogRef<ActualStartDateComponent>) { }

  ngOnInit() {

    this.Form = this.formBuilder.group({
      actual_start_date:['', [Validators.required]],
      inprogress_date:['', [Validators.required]],
      id: [this.defaults.referenceID],
 
    });
  }
  start_date(event: any) {
    this.Form.controls['inprogress_date'].setValue(new Date)
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['actual_start_date'].setValue(newDate)
  }
  submit(){

    this.internalService.update_actual_start_date(this.Form.value).subscribe({
      next:(result:any)=>{
        this.dialogRef.close(result);
      },
      error:(err:any)=>{},
      complete:()=>{}
    })

  }
}
