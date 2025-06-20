import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
// import { ApiService } from '../../esms-layout/api.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';


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
  selector: 'app-audit-calendar-details',
  templateUrl: './audit-calendar-details.component.html',
  styleUrls: ['./audit-calendar-details.component.scss'],
  providers:[
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AuditCalendarDetailsComponent implements OnInit {

  CreateForm: FormGroup
  ReferenceNumber:String
  description:string

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,private dialogRef: MatDialogRef<AuditCalendarDetailsComponent>,private formBuilder: FormBuilder) { }

  ngOnInit(){
    this.CreateForm = this.formBuilder.group({
      reference:[this.defaults.event.extendedProps.reference_number || ''],
      start:[this.defaults.event.extendedProps.audit_start || ''],
      end:[this.defaults.event.extendedProps.audit_end || ''],
      AuditType:[this.defaults.event.extendedProps.audit_type || ''],
      division:[this.defaults.event.extendedProps.division || ''],
      title:[this.defaults.event.extendedProps.audit_title || ''],
      description:[this.defaults.event.extendedProps.description || '']
      
    })

    this.dateRange.controls['start'].setValue(new Date(this.defaults.event.extendedProps.audit_start))
    this.dateRange.controls['end'].setValue(new Date(this.defaults.event.extendedProps.audit_end))

    this.CreateForm.disable()
    this.dateRange.disable()

  }

  cancel(){

    this.dialogRef.close();

  }

}
