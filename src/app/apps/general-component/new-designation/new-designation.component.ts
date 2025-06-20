import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-new-designation',
  templateUrl: './new-designation.component.html',
  styleUrls: ['./new-designation.component.scss']
})
export class NewDesignationComponent implements OnInit {

  Form:FormGroup 

    constructor(private formBuilder: FormBuilder,
    private generalService:GeneralService,
    public dialogRef: MatDialogRef<NewDesignationComponent>) { }


  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      name:['', [Validators.required]],
    });
  }

  submit(){
    this.dialogRef.close(this.Form.value);
  }


}
