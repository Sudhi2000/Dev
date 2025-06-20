import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnvironmentService } from 'src/app/services/environment.api.service';

@Component({
  selector: 'app-create-testing-organization',
  templateUrl: './create-testing-organization.component.html',
  styleUrls: ['./create-testing-organization.component.scss']
})
export class CreateTestingOrganizationComponent implements OnInit {
  Form: FormGroup
  mode: 'create' | 'update' = 'create';
  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<CreateTestingOrganizationComponent>,
        private EnvironmentService: EnvironmentService,
  ) { }

  ngOnInit(): void {
     if (this.defaults) {
          this.mode = 'update';
          this.get_commercial_name_by_id(this.defaults)
        }
    
        this.Form = this.formBuilder.group({
          id: [''],
          name: ['', [Validators.required]],
        });

        if (this.defaults) {
          this.mode = 'update';
          this.get_commercial_name_by_id(this.defaults)
          this.Form.controls['id'].setValue(this.defaults.toString())
        }
  }

  get_commercial_name_by_id(id: any) {
    this.EnvironmentService.get_testing_organization_details(id).subscribe({
      next: (result: any) => {
        this.Form.controls['name'].setValue(result.data.attributes.name)
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  
  submit() {
    this.dialogRef.close(this.Form.value);
  }
}
