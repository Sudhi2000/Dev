import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-factory-contact-person',
  templateUrl: './new-factory-contact-person.component.html',
  styleUrls: ['./new-factory-contact-person.component.scss']
})
export class NewFactoryContactPersonComponent implements OnInit {

  Form:FormGroup 

    constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewFactoryContactPersonComponent>) { }


  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      name:['', [Validators.required]],
    });
  }

  submit(){
    this.dialogRef.close(this.Form.value);
  }
}
