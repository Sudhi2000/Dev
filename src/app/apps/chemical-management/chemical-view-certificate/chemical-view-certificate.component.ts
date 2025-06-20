import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chemical-view-certificate',
  templateUrl: './chemical-view-certificate.component.html',
  styleUrls: ['./chemical-view-certificate.component.scss']
})
export class ChemicalViewCertificateComponent implements OnInit {

  pdfSrc: any=""
  imglnk: any = environment.client_backend + '/uploads/'

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
  private dialogRef: MatDialogRef<ChemicalViewCertificateComponent>) { }

  ngOnInit(){
    this.pdfSrc = this.imglnk+this.defaults.document_name+'.'+this.defaults.document_format
  }

}
