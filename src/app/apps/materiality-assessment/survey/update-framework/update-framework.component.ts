import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.api.service';

@Component({
  selector: 'app-update-framework',
  templateUrl: './update-framework.component.html',
  styleUrls: ['./update-framework.component.scss']
})
export class UpdateFrameworkComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
            @Inject(MAT_DIALOG_DATA) public defaults: any,
    
    private authService: AuthService,
    public dialogRef: MatDialogRef<UpdateFrameworkComponent>
  ) { }
  Form: FormGroup


  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      value: ['', [Validators.required]],
    });
    this.Form.controls['value'].setValue(this.defaults.attributes.value)

  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
