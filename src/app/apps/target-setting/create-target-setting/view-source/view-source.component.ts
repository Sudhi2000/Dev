import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TargetSettingService } from 'src/app/services/target-setting.service';

@Component({
  selector: 'app-view-source',
  templateUrl: './view-source.component.html',
  styleUrls: ['./view-source.component.scss']
})
export class ViewSourceComponent implements OnInit {
  Form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewSourceComponent>,
    private formBuilder: FormBuilder,
    private targetService: TargetSettingService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      source: [this.data?.attributes.source || '', Validators.required],
      baseline_consumption: [this.data?.attributes.baseline_consumption || '', Validators.required],
      standard: [this.data?.attributes.standard || '', Validators.required],
      GHG_emission: [this.data?.attributes.GHG_emission || '', Validators.required],
      expected_savings: [this.data?.attributes.expected_savings || '', Validators.required],
    });
    this.Form.disable()
  }
  close() {
    this.dialogRef.close();
  }
}
