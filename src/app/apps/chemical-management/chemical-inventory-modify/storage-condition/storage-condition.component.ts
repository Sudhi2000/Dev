import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChemicalService } from 'src/app/services/chemical.api.service';

@Component({
  selector: 'app-storage-condition',
  templateUrl: './storage-condition.component.html',
  styleUrls: ['./storage-condition.component.scss']
})
export class StorageConditionComponent implements OnInit {


  Form: FormGroup
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
  private formBuilder: FormBuilder,
    private chemicalService: ChemicalService,
    public dialogRef: MatDialogRef<StorageConditionComponent>) { }

  ngOnInit() {
    
    if (this.defaults) {
      this.mode = 'update';
      this.get_storage_by_id(this.defaults)
    }
    this.Form = this.formBuilder.group({
      id: [''],
      storage_condition: ['', [Validators.required]],

    });
  }
  get_storage_by_id(id: any) {
    this.chemicalService.get_storage_condition_details(id).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id) 
        this.Form.controls['storage_condition'].setValue(result.data.attributes.name)      
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  submit() {
    this.dialogRef.close(this.Form.value);

  }

}
