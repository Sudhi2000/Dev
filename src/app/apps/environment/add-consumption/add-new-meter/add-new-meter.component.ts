import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { category } from 'src/app/apps/audit-inspection/audit-calendar/audit-calendar/data';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-add-new-meter',
  templateUrl: './add-new-meter.component.html',
  styleUrls: ['./add-new-meter.component.scss']
})
export class AddNewMeterComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddNewMeterComponent>,
    private formBuilder: FormBuilder,
    private environmentService: EnvironmentService,
    private _snackBar: MatSnackBar,
    private router: Router,

    private generalService: GeneralService,
    private authService: AuthService,
    public dialog: MatDialog,) {




  }
  Form: FormGroup


  ngOnInit(): void {


    this.Form = this.formBuilder.group({
      meter_name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      meter_quantity_unit: [{ value: this.data.unit, disabled: true }, [Validators.required]],
      business_unit: [this.data.selectedDivision],
      category: [this.data.category]

    });



  }

  submit() {
    this.Form.get('meter_quantity_unit')?.enable();

    this.environmentService.create_env_submeter(this.Form.value).subscribe({
      next: (data: any) => {

        this.dialogRef.close(data.data)

      },
      complete: () => {
        this._snackBar.open('New Meter Added ', 'OK', {
          duration: 3000, // duration in milliseconds (3000 ms = 3 seconds)
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });


      }
      , error: (data: any) => {
        console.log("🚀 ~ AddNewMeterComponent ~ this.environmentService.create_env_submeter ~ data:", data)

      }
    })


  }

}
