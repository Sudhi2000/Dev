import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-document-data',
  templateUrl: './view-document-data.component.html',
  styleUrls: ['./view-document-data.component.scss']
})
export class ViewDocumentDataComponent implements OnInit {

  documentSrc:any
  Image:boolean
  DocExcel:boolean
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any) {}


  ngOnInit() { 
    console.log(this.defaults)
    if (this.defaults.documentInfo.format === 'pdf') {
      this.Image = false;
      this.documentSrc = this.defaults.documentInfo?.pdfUrl;
    } else if (this.defaults.documentInfo.format === 'jpg' || this.defaults.documentInfo.format === 'png'|| this.defaults.documentInfo.format === 'jpeg') {
      this.Image = true;
      this.documentSrc = environment.client_backend + '/uploads/' + this.defaults.documentInfo.document_name + '.' + this.defaults.documentInfo.format;
    }

    else if (this.defaults.documentInfo.format === 'docx' || this.defaults.documentInfo.format === 'xlsx') {
      this.DocExcel = true;
      this.documentSrc = environment.client_backend + '/uploads/' + this.defaults.documentInfo.document_name + '.' + this.defaults.documentInfo.format;
    }
    
  }
  view_action_plan_document() {
    const fileUrl = this.documentSrc;
    saveAs(fileUrl, `${this.defaults.documentInfo.document_name}.${this.defaults.documentInfo.format}`);
    if(this.defaults.documentInfo.format !== 'xlsx' && this.defaults.documentInfo.format !== 'docx' )
      {
        window.open(fileUrl, '_blank');
      }
  }

}
