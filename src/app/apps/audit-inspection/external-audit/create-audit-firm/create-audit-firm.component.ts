import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ExternalAuditService } from 'src/app/services/external-audit.service';
import { CreateStandardComponent } from '../schedule/create-standard/create-standard.component';

@Component({
  selector: 'app-create-audit-firm',
  templateUrl: './create-audit-firm.component.html',
  styleUrls: ['./create-audit-firm.component.scss']
})
export class CreateAuditFirmComponent implements OnInit {
  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    private externalAuditService: ExternalAuditService,
    public dialogRef: MatDialogRef<CreateAuditFirmComponent>) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      firm_name: ['', [Validators.required]],

    });
  }

  submit() {
    this.externalAuditService.create_audit_firm(this.Form.value).subscribe({
      next: (result: any) => {
        
        this.dialogRef.close(result);
      },
      error: (err: any) => { console.log(err)},
      complete: () => { }
    })


  }

}
