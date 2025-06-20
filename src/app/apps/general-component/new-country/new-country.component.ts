import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-new-country',
  templateUrl: './new-country.component.html',
  styleUrls: ['./new-country.component.scss']
})
export class NewCountryComponent implements OnInit {

  Form:FormGroup 

  constructor(private formBuilder: FormBuilder,
  private generalService:GeneralService,
  public dialogRef: MatDialogRef<NewCountryComponent>) { }


ngOnInit(): void {
  this.Form = this.formBuilder.group({
    name:['', [Validators.required]],
  });
}

submit(){
  this.dialogRef.close(this.Form.value);
}


}
