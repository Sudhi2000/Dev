import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
 
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-medical-prescription',
  templateUrl: './view-medical-prescription.component.html',
  styleUrls: ['./view-medical-prescription.component.scss']
})
export class ViewMedicalPrescriptionComponent implements OnInit {

  Form: FormGroup
  units: any[] = []
  orgID: string
  MedicineList: any[] = []
  medicineName: any[] = []
  mode: 'create' | 'update' = 'create';
  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  static id = 1;
  selectedItem = new FormControl();
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
      ],
    },
  }
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    public dialog: MatDialog,
    private clinicalService: ClinicalSuiteService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ViewMedicalPrescriptionComponent>) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      medicine_name: [this.defaults.attributes.medicine_name || ''],
      dosage: [this.defaults.attributes.dosage || ''],
      days: [this.defaults.attributes.days || ''],
      usage: [this.defaults.attributes.usage || ''],
      issue_status:[this.defaults.attributes.status || ''],
      reporter:[''],
      medicine_uuid: [this.defaults.attributes.medicine_uuid || ''],
    });
    this.Form.disable()

  }

  ///check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
              this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
            }
          }
          this.me()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.clin_consultation
        if (status === false) {
          this.dialogRef.close()
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  close(){
    this.dialogRef.close()

  }

  
 

}
