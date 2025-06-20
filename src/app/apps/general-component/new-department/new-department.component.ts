import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-new-department',
  templateUrl: './new-department.component.html',
  styleUrls: ['./new-department.component.scss']
})
export class NewDepartmentComponent implements OnInit {

  Form:FormGroup 

    constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewDepartmentComponent>) { }


  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      name:['', [Validators.required]],
    });
  }

  submit(){
    this.dialogRef.close(this.Form.value);
  }

}
