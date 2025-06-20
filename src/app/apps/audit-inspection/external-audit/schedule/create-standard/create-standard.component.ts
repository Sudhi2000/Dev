import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ExternalAuditService } from 'src/app/services/external-audit.service';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-create-standard',
  templateUrl: './create-standard.component.html',
  styleUrls: ['./create-standard.component.scss']
})
export class CreateStandardComponent implements OnInit {
  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    private externalAuditService: ExternalAuditService,
    public dialogRef: MatDialogRef<CreateStandardComponent>) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      standard: ['', [Validators.required]],

    });
  }

  submit() {
    this.externalAuditService.create_audit_standards(this.Form.value).subscribe({
      next: (result: any) => {
        this.dialogRef.close(result);
      },
      error: (err: any) => { console.log(err)},
      complete: () => { }
    })


  }
}
