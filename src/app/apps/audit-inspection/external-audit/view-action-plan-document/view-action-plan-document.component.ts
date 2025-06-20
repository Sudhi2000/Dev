import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-view-action-plan-document',
  templateUrl: './view-action-plan-document.component.html',
  styleUrls: ['./view-action-plan-document.component.scss']
})
export class ViewActionPlanDocumentComponent implements OnInit {

  documentSrc:any
  Image:boolean
  DocExcel:boolean
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any) {}


  ngOnInit() { 
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