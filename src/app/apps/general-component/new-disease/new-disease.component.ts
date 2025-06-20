import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';
@Component({
  selector: 'app-new-disease',
  templateUrl: './new-disease.component.html',
  styleUrls: ['./new-disease.component.scss']
})
export class NewDiseaseComponent implements OnInit {
  Form:FormGroup 

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewDiseaseComponent>
  ) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      disease_name:['', [Validators.required]],
    });
  }

  submit(){
    this.dialogRef.close(this.Form.value);
  }

}
