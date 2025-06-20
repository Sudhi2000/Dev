import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';

@Component({
  selector: 'app-create-symptom',
  templateUrl: './create-symptom.component.html',
  styleUrls: ['./create-symptom.component.scss']
})
export class CreateSymptomComponent implements OnInit {

  Form: FormGroup
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
  private formBuilder: FormBuilder,
    private clinicalService: ClinicalSuiteService,
    public dialogRef: MatDialogRef<CreateSymptomComponent>) { }

  ngOnInit() {
    
    if (this.defaults) {
      this.mode = 'update';
      this.get_commercial_name_by_id(this.defaults)
    }
    this.Form = this.formBuilder.group({
      id: [''],
      symptom: ['', [Validators.required]],

    });
  }
  get_commercial_name_by_id(id: any) {
    this.clinicalService.get_symptom_details(id).subscribe({
      next: (result: any) => {
        console.log(result)
        this.Form.controls['id'].setValue(result.data.id) 
        this.Form.controls['symptom'].setValue(result.data.attributes.name)      
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  submit() {
    this.dialogRef.close(this.Form.value);

  }
}
