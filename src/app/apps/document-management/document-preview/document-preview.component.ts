import {  OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.scss']
})
export class documentPreviewComponent implements OnInit {
  documentSrc:any
  Image:boolean
  DocExcel:boolean
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any) {}


  ngOnInit() {
    console.log(this.defaults);
    if (this.defaults.documentInfo.file_format === 'pdf') {
      this.Image = false;
      this.documentSrc = this.defaults.documentInfo.pdfUrl;
    } else if (this.defaults.documentInfo.file_format === 'jpg' || this.defaults.documentInfo.file_format === 'png'|| this.defaults.documentInfo.file_format === 'jpeg') {
      this.Image = true;
      this.documentSrc = environment.client_backend + '/uploads/' + this.defaults.documentInfo.file_name + '.' + this.defaults.documentInfo.file_format;
    }

    else if (this.defaults.documentInfo.file_format === 'docx' || this.defaults.documentInfo.file_format === 'xlsx') {
      this.DocExcel = true;
      this.documentSrc = environment.client_backend + '/uploads/' + this.defaults.documentInfo.file_name + '.' + this.defaults.documentInfo.file_format;
    }
    
  }
  view_action_plan_document() {
    const fileUrl = this.documentSrc;
    saveAs(fileUrl, `${this.defaults.documentInfo.file_name}.${this.defaults.documentInfo.file_format}`);
    window.open(fileUrl, '_blank');
  }

}
