import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-new-submission',
  templateUrl: './new-submission.component.html',
  styleUrls: ['./new-submission.component.scss']
})
export class NewSubmissionComponent implements OnInit {
  Form:FormGroup 

  constructor(private formBuilder: FormBuilder,
  private generalService:GeneralService,
  public dialogRef: MatDialogRef<NewSubmissionComponent>) { }


ngOnInit(): void {
  this.Form = this.formBuilder.group({
    name:['', [Validators.required]],
  });
}

submit(){
  this.dialogRef.close(this.Form.value);
}



}
