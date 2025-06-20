import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';

@Component({
  selector: 'app-add-downstream-category',
  templateUrl: './add-downstream-category.component.html',
  styleUrls: ['./add-downstream-category.component.scss']
})
export class AddDownstreamCategoryComponent implements OnInit {

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
    public dialogRef: MatDialogRef<AddDownstreamCategoryComponent>) { }


  ngOnInit() {
    this.lov = this.data.lov
    this.Form = this.formBuilder.group({
      id: [''],
      downstream_category_name: [this.data.data.downstream_category_name || '', Validators.required],
      quantity: [this.data.data.quantity || null, Validators.required],
      unit: [this.lov[45]?.value[0].Value || this.data.data.unit || '', Validators.required],
      direct_emission: [true],
    })

    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }


  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('data', JSON.stringify(this.Form.value))
      this.esgService.updateEnvDownstreamCategory(formData).subscribe({
        next: (result: any) => {
          this.dialogRef.close(this.Form.value);
        },
        error: (err: any) => {

        },
        complete: () => {
          const statusText = "Downstream Category details modified.";
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
