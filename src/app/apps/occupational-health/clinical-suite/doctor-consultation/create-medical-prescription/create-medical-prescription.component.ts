import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';
import { GeneralService } from 'src/app/services/general.api.service';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { OutsideMedicineComponent } from '../outside-medicine/outside-medicine.component';
@Component({
  selector: 'app-create-update-medical-prescription',
  templateUrl: './create-medical-prescription.component.html',
  styleUrls: ['./create-medical-prescription.component.scss'],
})
export class CreateMedicalPrescriptionComponent implements OnInit {
  Form: FormGroup;
  units: any[] = [];
  orgID: string;
  MedicineList: any[] = [];
  medicineName: any[] = [];
  mode: 'create' | 'update' = 'create';
  prescriptionList: any[] = [];
  medical_exist: boolean = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  static id = 1;
  selectedItem = new FormControl();
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
      ],
    },
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    public dialog: MatDialog,
    private clinicalService: ClinicalSuiteService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateMedicalPrescriptionComponent>
  ) { }

  ngOnInit() {
    this.configuration();
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      medicine_name: ['', [Validators.required]],
      dosage: ['', [Validators.required]],
      days: ['', [Validators.required]],
      usage: ['', [Validators.required]],
      issue_status: ['Open'],
      reporter: [''],
      medicine_uuid: [''],
      clinic_division: [''],
      outside_medicine:[false]
    });
    this.prescriptionList = this.defaults;
  }

  ///check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health;
        if (status === false) {
          this.router.navigate(['/error/upgrade-subscription']);
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id;
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split('=');
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1]);
              this.Form.controls['org_id'].setValue(
                decodeURIComponent(cookiePair[1])
              );
            }
          }
          this.me();
        }
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.clin_consultation;
        if (status === false) {
          this.dialogRef.close();

          this.router.navigate(['/error/unauthorized']);
        } else {
          this.get_medicine_name();
          this.Form.controls['reporter'].setValue(result.profile.id);
        }
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  get_medicine_name() {
    this.clinicalService.get_medicine_name().subscribe({
      next: (result: any) => {
        this.medicineName = result.data;
      },
    });
  }
  submit() {
    // this.Form.controls['medicine_name'].setValue(
    //   this.selectedItem.value.attributes.name
    // );
    // this.Form.controls['medicine_uuid'].setValue(
    //   this.selectedItem.value.attributes.uuid
    // );

    this.dialogRef.close(this.Form.value);
  }

  checkMedicine(data: any) {
    if (data) {
      const uuid = data.attributes.uuid;
      const presData = this.prescriptionList.filter(function (elem: any) {
        return elem.attributes.medicine_uuid === uuid;
      });
      if (presData.length > 0) {
        this.medical_exist = true;
        this.Form.controls['medicine_name'].setValue('');
        this.Form.controls['medicine_uuid'].setValue('')
        this.selectedItem.setValue('');
      } else {
        this.medical_exist = false;
        this.Form.controls['medicine_name'].setValue(
          data.attributes.name
        );
        this.Form.controls['medicine_uuid'].setValue(data.attributes.uuid)
        this.selectedItem.setValue(data.value);
      }
    }
  }

  addOutsideMedicine() {
    this.dialog
      .open(OutsideMedicineComponent)
      .afterClosed()
      .subscribe((res) => {
        this.clinicalService
          .create_medicine(res, this.Form.value.reporter)
          .subscribe({
            next: (result: any) => {
              this.clinicalService.get_medicine_name().subscribe({
                next: (results: any) => {
                  this.medicineName = results.data
                },
                error: (err: any) => { },
                complete: () => {
                  this.Form.controls['medicine_name'].setValue(result.data.attributes.name)
                  this.Form.controls['medicine_uuid'].setValue(result.data.attributes.uuid)
                   this.Form.controls['outside_medicine'].setValue(true)
                }
              })
            },
            error: (err: any) => { },
            complete: () => { },
          });

      });
  }
}
