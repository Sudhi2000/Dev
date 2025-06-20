import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-new-rating',
  templateUrl: './new-rating.component.html',
  styleUrls: ['./new-rating.component.scss']
})
export class NewRatingComponent implements OnInit {

  Form:FormGroup 

    constructor(private formBuilder: FormBuilder,
    private generalService:GeneralService,
    public dialogRef: MatDialogRef<NewRatingComponent>) { }


  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      name:['', [Validators.required]],
    });
  }

  submit(){
    this.dialogRef.close(this.Form.value);
  }


}
