import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-audit-grade',
  templateUrl: './new-audit-grade.component.html',
  styleUrls: ['./new-audit-grade.component.scss']
})
export class NewAuditGradeComponent implements OnInit {
  Form: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewAuditGradeComponent>
  ) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      grade_name: ['', [Validators.required]],
    });
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
