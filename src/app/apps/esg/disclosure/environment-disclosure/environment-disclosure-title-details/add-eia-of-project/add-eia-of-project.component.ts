import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MY_FORMATS } from 'src/app/apps/hazard-risk/action/action.component';
import { EsgService } from 'src/app/services/esg.service';

@Component({
  selector: 'app-add-eia-of-project',
  templateUrl: './add-eia-of-project.component.html',
  styleUrls: ['./add-eia-of-project.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AddEiaOfProjectComponent implements OnInit {


  Form: FormGroup
  lov: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
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
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddEiaOfProjectComponent>) { }


  ngOnInit() {
    this.Form = this.formBuilder.group({
      id: [''],
      name_of_project: [this.data.data.name_of_project || '', Validators.required],
      eia_notification_number: [this.data.data.eia_notification_number || null, Validators.required],
      date_of_notification: [this.data.data.date_of_notification || '', Validators.required],
      conducted_by: [this.data.data.conducted_by || '', Validators.required],
      results_communicated: [this.data.data.results_communicated || '', Validators.required],
      details_of_project: [this.data.data.details_of_project || '', Validators.required],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.data.reference_id || ''],
      esg_disclosure: [this.data.refID || ''],
    })
    this.lov = this.data.lov
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }

  date(data: any) {
    this.Form.controls['date_of_notification'].setValue(new Date(data.value))
  }

  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('data', JSON.stringify(this.Form.value))
      this.esgService.updateEnvEIAofProject(formData).subscribe({
        next: (result: any) => {
          this.dialogRef.close(this.Form.value);
        },
        error: (err: any) => {

        },
        complete: () => {
          const statusText = "EIA of Project details modified.";
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
