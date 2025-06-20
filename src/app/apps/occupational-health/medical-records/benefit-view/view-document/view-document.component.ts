import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { MaternityRegisterService } from 'src/app/services/maternity-register.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ViewDocumentDataComponent } from '../view-document-data/view-document-data.component';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewDocumentComponent implements OnInit {

  Form: FormGroup
  documentTypeList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  static id = 1;
  files: File[] = [];
  DocFile: File[] = [];

  uploadDate = new FormControl(null);
  documentFormData = new FormData();
  DocumentFiles: any[] = [];
  documentIds: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private maternityService: MaternityRegisterService,
    public dialogRef: MatDialogRef<ViewDocumentComponent>
  ) { }

  ngOnInit(): void {
    if (this.defaults) {
      // if (this.defaults?.attributes?.document_name != null) {
      //   this.generalService.getImage(environment.client_backend + '/uploads/' + this.defaults?.attributes?.document_name + '.' + this.defaults?.attributes?.format).subscribe((data: any) => {
      //     this.files.push(data)
      //   })

        // const document__data = this.defaults;
        // if (document__data.length > 0) {
          this.DocumentFiles = [];

        //   const loadImageAtIndex = (index: number) => {
        //     if (index >= document__data.length) {
        //       return;
        //     }
            // const document = document__data[index];
            if(this.defaults?.attributes?.document_name){
              this.generalService.getImage(environment.client_backend + '/uploads/' + this.defaults?.attributes?.document_name + '.' + this.defaults?.attributes.format).subscribe((data: any) => {
                let blobType = '';
                let fileType = this.defaults.attributes.format.toLowerCase();
  
                if (fileType === 'pdf') {
                  blobType = 'application/pdf';
                } else if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'gif') {
                  blobType = 'image/' + fileType;
                } else if (fileType === 'xlsx' || fileType === 'xls') {
                  blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                } else {
                  blobType = 'application/octet-stream';
                }
  
                const blob = new Blob([data], { type: blobType });
                const file = new File([blob], this.defaults.attributes.document_name + '.' + this.defaults.attributes.format, { type: blobType });
                const documentId = this.defaults.attributes.document_id;
                const pdfUrl = URL.createObjectURL(blob);
  
                const documentInfo = {
                  id: documentId,
                  document_name: this.defaults.attributes.document_name,
                  format: this.defaults.attributes.format,
                  file: file,
                  pdfUrl: pdfUrl,
                  type: blobType
                };
  
                this.documentIds = documentInfo;
                this.DocumentFiles.push(file);
  
                // loadImageAtIndex(index + 1);
              });
            }
           
          // };
          // loadImageAtIndex(0);

        // }

        console.log(this.DocumentFiles)
      
      this.uploadDate.setValue(new Date(this.defaults.attributes.upload_date))


    } else {
      this.defaults = {} as any;
    }
    // this.configuration()
    this.Form = this.formBuilder.group({
      id: [this.defaults.id],
      document_type: [this.defaults?.attributes?.document_type || ''],
      upload_date: [this.defaults?.attributes?.upload_date || new Date()],
      document_id: [this.defaults?.attributes?.document_id],
      document_name: [this.defaults?.attributes?.document_name],
      format: [this.defaults?.attributes?.format],
      document_upload: [''],
      files: [],

    });
    this.Form.disable()
    this.uploadDate.disable()
  }

  openDocument() {
      this.dialog.open(ViewDocumentDataComponent, {
        width: '50%',
        data: { documentInfo: this.documentIds },
      });
  }

}
