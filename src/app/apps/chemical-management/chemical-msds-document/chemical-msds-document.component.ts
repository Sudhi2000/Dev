import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chemical-msds-document',
  templateUrl: './chemical-msds-document.component.html',
  styleUrls: ['./chemical-msds-document.component.scss']
})
export class ChemicalMsdsDocumentComponent implements OnInit {

  pdfSrc: any=""
  imglnk: any = environment.client_backend + '/uploads/'
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
  private dialogRef: MatDialogRef<ChemicalMsdsDocumentComponent>) { }

  ngOnInit(){
    if(this.defaults.statement)
    {
      this.pdfSrc = this.imglnk+this.defaults.statement_name+'.'+this.defaults.statement_format
    }
    else
    {
      this.pdfSrc = this.imglnk+this.defaults.document_name+'.'+this.defaults.document_format
    }
  }

}
