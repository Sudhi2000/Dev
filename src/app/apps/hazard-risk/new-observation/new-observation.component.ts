import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
@Component({
  selector: 'app-new-observation',
  templateUrl: './new-observation.component.html',
  styleUrls: ['./new-observation.component.scss']
})
export class NewObservationComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Form:FormGroup
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private formBuilder: FormBuilder,
    private hazardService:HazardService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<NewObservationComponent>) { }

  ngOnInit(){
    this.Form = this.formBuilder.group({
      dropdown_value:this.data,
      observation:['', [Validators.required]],

    });
  }

  submit(){
    this.hazardService.create_observation(this.Form.value).subscribe({
      next:(result:any)=>{
        this.dialogRef.close(result);
      },
      error:(err:any)=>{},
      complete:()=>{
        const statusText = "Created a new observation"
        this._snackBar.open(statusText, 'Ok', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      
      }
    })

  }

}
