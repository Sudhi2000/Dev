import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-new-employee-shift',
  templateUrl: './new-employee-shift.component.html',
  styleUrls: ['./new-employee-shift.component.scss']
})
export class NewEmployeeShiftComponent implements OnInit {

  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    public dialogRef: MatDialogRef<NewEmployeeShiftComponent>) { }


  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      employee_shift: ['', [Validators.required]],
    });
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }
}
