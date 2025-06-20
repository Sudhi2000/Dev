import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-view-chemcheck-report',
  templateUrl: './view-chemcheck-report.component.html',
  styleUrls: ['./view-chemcheck-report.component.scss']
})
export class ViewChemcheckReportComponent implements OnInit {

pdfSrc: any=""
  imglnk: any = environment.client_backend + '/uploads/'
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
  private dialogRef: MatDialogRef<ViewChemcheckReportComponent>) { }

  ngOnInit(){
    if(this.defaults.chemcheck_report)
    {
      this.pdfSrc = this.imglnk+this.defaults.chemcheck_report_name+'.'+this.defaults.chemcheck_report_format
    }
    else
    {
      this.pdfSrc = this.imglnk+this.defaults.document_name+'.'+this.defaults.document_format
    }
  }

}
