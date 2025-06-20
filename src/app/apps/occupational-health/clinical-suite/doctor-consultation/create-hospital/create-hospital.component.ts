import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';

@Component({
  selector: 'app-create-hospital',
  templateUrl: './create-hospital.component.html',
  styleUrls: ['./create-hospital.component.scss']
})
export class CreateHospitalComponent implements OnInit {
  Form: FormGroup
  HospitalList:any[] = []
  mode: 'create' | 'update' = 'create';
    constructor(private formBuilder: FormBuilder,
      public ClinicalService: ClinicalSuiteService,
  @Inject(MAT_DIALOG_DATA) public defaults: any,
  public dialogRef: MatDialogRef<CreateHospitalComponent>) { }
  
    ngOnInit() {
      if (this.defaults) {
        this.mode = 'update';
        this.get_hospital_name_by_id(this.defaults)      
      }
      this.Form = this.formBuilder.group({
          id:[null],
           name: ['', [Validators.required]]
      })
    }
  
    submit() {
          this.dialogRef.close(this.Form.value)
  
     }
       get_hospital_name_by_id(id: any) {
         this.ClinicalService.get_hospital_name_details(id).subscribe({
           next: (result: any) => {
             this.Form.controls['name'].setValue(result.data.attributes.name)
             this.Form.controls['id'].setValue(result.data.id)
     
           },
           error: (err: any) => { },
           complete: () => { }
         })
       }
}
