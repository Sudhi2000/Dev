import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-process-type',
  templateUrl: './new-process-type.component.html',
  styleUrls: ['./new-process-type.component.scss']
})
export class NewProcessTypeComponent implements OnInit {

  Form:FormGroup 

  constructor(private formBuilder: FormBuilder,
  public dialogRef: MatDialogRef<NewProcessTypeComponent>) { }


  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      process_type:['', [Validators.required]],
    });
  }

  submit(){
    this.dialogRef.close(this.Form.value);
  }
}
