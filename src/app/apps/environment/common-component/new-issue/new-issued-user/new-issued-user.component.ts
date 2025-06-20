import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-issued-user',
  templateUrl: './new-issued-user.component.html',
  styleUrls: ['./new-issued-user.component.scss']
})
export class NewIssuedUserComponent implements OnInit {

  Form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewIssuedUserComponent>
  ) { }

  ngOnInit() {
    console.log(this.defaults)
    this.Form = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required]],
    });

    if(this.defaults){
      this.Form = this.formBuilder.group({
        id: [this.defaults?.id],
        name: [this.defaults?.attributes?.name || '', [Validators.required]],
      });
    }
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
