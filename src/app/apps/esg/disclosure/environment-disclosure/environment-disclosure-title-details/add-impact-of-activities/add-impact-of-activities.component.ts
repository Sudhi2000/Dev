import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';

@Component({
  selector: 'app-add-impact-of-activities',
  templateUrl: './add-impact-of-activities.component.html',
  styleUrls: ['./add-impact-of-activities.component.scss']
})
export class AddImpactOfActivitiesComponent implements OnInit {


  Form: FormGroup
  lov: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddImpactOfActivitiesComponent>) { }


  ngOnInit() {
    this.Form = this.formBuilder.group({
      id: [''],
      site_name: [this.data.data.site_name || '', Validators.required],
      land_tenure: [this.data.data.land_tenure || '', Validators.required],
      type_of_operation: [this.data.data.type_of_operation || '', Validators.required],
      size_of_operational_site: [this.data.data.size_of_operational_site || null, Validators.required],
      position_in_relation: [this.data.data.position_in_relation || '', Validators.required],
      type_of_ecosystem: [this.data.data.type_of_ecosystem || '', Validators.required],
      biodiversity_area_category: [this.data.data.biodiversity_area_category || '', Validators.required],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.data.reference_id || ''],
      esg_disclosure: [this.data.refID || ''],
    })
    this.lov = this.data.lov
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }

  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('data', JSON.stringify(this.Form.value))
      this.esgService.updateEnvImpactofActivities(formData).subscribe({
        next: (result: any) => {
          this.dialogRef.close(this.Form.value);
        },
        error: (err: any) => {

        },
        complete: () => {
          const statusText = "Impact details modified.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      })
    } else {
      this.dialogRef.close(this.Form.value);
    }
    // this.dialogRef.close(this.Form.value);
  }

}
