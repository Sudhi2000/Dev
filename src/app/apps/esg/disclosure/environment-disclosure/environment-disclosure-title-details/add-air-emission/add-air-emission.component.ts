import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';

@Component({
  selector: 'app-add-air-emission',
  templateUrl: './add-air-emission.component.html',
  styleUrls: ['./add-air-emission.component.scss']
})
export class AddAirEmissionComponent implements OnInit {

  switch = false;
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
    public dialogRef: MatDialogRef<AddAirEmissionComponent>) { }


  ngOnInit() {
    this.Form = this.formBuilder.group({
      id: [''],
      type: [this.data.data.type || '', Validators.required],
      air_emission: [this.data.data.air_emission || 0],
      unit: [this.data.data.unit || ''],
      air_emission_yes_no: [this.data.data.air_emission_yes_no != null ? this.data.data.air_emission_yes_no : true],
      flow_rate: [this.data.data.flow_rate || 0],
      flow_unit: [this.data.data.flow_unit || ''],
      concentration: [this.data.data.concentration || 0],
      concentration_unit: [this.data.data.concentration_unit || ''],
      running_time: [this.data.data.running_time || 0],
      running_time_unit: [this.data.data.running_time_unit || ''],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.data.reference_id || ''],
      esg_disclosure: [this.data.refID || ''],
    })
    this.lov = this.data.lov
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }

  onAirEmissionChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.Form.controls['air_emission_yes_no'].setValue(isChecked)
    if(isChecked)
    {
      this.Form.controls['flow_rate'].setValue(0)
      this.Form.controls['flow_unit'].setValue('')
      this.Form.controls['concentration'].setValue(0)
      this.Form.controls['concentration_unit'].setValue('')
      this.Form.controls['running_time'].setValue(0)
      this.Form.controls['running_time_unit'].setValue('')
    }
    else{
      this.Form.controls['air_emission'].setValue(0)
      this.Form.controls['unit'].setValue('')
    }

}

  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('data', JSON.stringify(this.Form.value))
      this.esgService.updateEnvAirEmission(formData).subscribe({
        next: (result: any) => {
          this.dialogRef.close(this.Form.value);
        },
        error: (err: any) => {

        },
        complete: () => {
          const statusText = "Air Emission details modified.";
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
