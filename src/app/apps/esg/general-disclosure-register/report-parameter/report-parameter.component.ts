import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-report-parameter',
  templateUrl: './report-parameter.component.html',
  styleUrls: ['./report-parameter.component.scss']
})
export class ReportParameterComponent implements OnInit {
  reportTypes: string[] = ['GRI', 'SDG', 'CDP', 'DJSI', 'IFC PS', 'BRSR'];
  selectedReportType: string = '';
  Form: FormGroup;
  dynamicFields: string[] = [];
  constructor(public dialogRef: MatDialogRef<ReportParameterComponent>,
    @Inject(MAT_DIALOG_DATA) public values: any,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.Form = this.fb.group({
      reportTypes: [[], Validators.required],
      format: ['', Validators.required]
    });
  }

  // onSubmit() {
  //   const selectedReportsArray = this.Form.value.reportTypes;
  //   const selectedFormat = this.Form.value.format;
  //   if (Array.isArray(selectedReportsArray) && selectedFormat) {
  //     const reportTypeString = selectedReportsArray.join(",");
  //     this.dialogRef.close({
  //       reportType: reportTypeString,
  //       format: selectedFormat,
  //       year: this.data.year
  //     });
  //   } else {
  //     this.dialogRef.close();
  //   }
  // }

  onSubmit() {
    const selectedReportsArray = this.Form.value.reportTypes;
    const selectedFormat = this.Form.value.format;
    if (Array.isArray(selectedReportsArray) && selectedFormat) {
      const reportTypeString = selectedReportsArray.join(",");
      // this.dialogRef.close({
      //   reportType: reportTypeString,
      //   format: selectedFormat,
      //   year: this.data.year
      // });
      const reportData: any = {
        reportType: reportTypeString,
        format: selectedFormat,
        reference_id: this.values.data.reference_id,
      };
      if (this.values.data.year) {
        reportData.year = this.values.data.year;
      }
      if (this.values.data.financial_years && this.values.data.financial_months) {
        reportData.financial_years = this.values.data.financial_years;
        reportData.financial_months = this.values.data.financial_months;
      }

      this.dialogRef.close(reportData);
    } else {
      this.dialogRef.close();
    }
  }


  onCancel() {
    this.dialogRef.close();
  }

}
