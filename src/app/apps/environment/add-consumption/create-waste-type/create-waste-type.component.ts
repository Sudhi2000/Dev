import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { log } from 'console';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { ConsumptionComponent } from '../consumption/consumption.component';

@Component({
  selector: 'app-create-waste-type',
  templateUrl: './create-waste-type.component.html',
  styleUrls: ['./create-waste-type.component.scss']
})
export class CreateWasteTypeComponent implements OnInit {
  Form: FormGroup
  wasteType = new FormControl(null, [Validators.required]);
  categories:any[]=[]

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<CreateWasteTypeComponent>
  ) { }

  ngOnInit(): void {
    this.categories=this.data.categories || []
    this.Form = this.formBuilder.group({
      waste_type: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });
  }
  onCategoryChange(event:any){
      this.Form.controls['category'].setValue(event.value.toString())
  }

  submit(){    
    this.dialog.close(this.Form.value);
  }
}
