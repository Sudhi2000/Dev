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
  selector: 'app-update-document',
  templateUrl: './update-document.component.html',
  styleUrls: ['./update-document.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class UpdateDocumentComponent implements OnInit {
  Form: FormGroup
  documentTypeList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  mode: 'create' | 'update' = 'create';
  static id = 1;
  files: File[] = [];
  DocFile: File[] = [];

  uploadDate = new FormControl(null);
  documentFormData = new FormData();


  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private maternityService: MaternityRegisterService,
    public dialogRef: MatDialogRef<UpdateDocumentComponent>
  ) { }

  ngOnInit(): void {
    if (this.defaults) {
      this.mode = 'update';

      if (this.defaults?.attributes?.document_name != null) {
        this.generalService.getImage(environment.client_backend + '/uploads/' + this.defaults?.attributes?.document_name + '.' + this.defaults?.attributes?.format).subscribe((data: any) => {
          this.files.push(data)
        })
      }


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


    this.dropdownValues();
  }

  uploadDateVal(data: any) {
    let selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['upload_date'].setValue(selectedDate)
  }

  dropdownValues() {
    const module = "Maternity Document"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.documentTypeList = result.data
      },
      error: (err: any) => { },
      complete: () => {
      }

    })
  }

  onSelect(event: any) {
    if (this.files.length < 1) {
      for (const addedFile of event.addedFiles) {
        const size = addedFile.size / 1024 / 1024;

        if (size > 5) {
          const statusText = 'Please choose an image below 5 MB';
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          const fileTypes = ['pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png'];
          const extension = addedFile.name.split('.').pop().toLowerCase();
          const isSuccess = fileTypes.indexOf(extension) > -1;

          if (isSuccess) {
            this.Form.controls['document_upload'].setErrors(null);
            this.files.push(addedFile);
            this.Form.controls['files'].setValue(this.files)
            if (this.defaults.attributes) {
              this.uploadDocument();
            }
          } else {
            const statusText = "Please choose images ('pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png')";
            this._snackBar.open(statusText, 'Close Warning', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          }
        }
      }
    } else {
      const statusText = 'You have exceeded the upload limit';
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length === 0) {
      this.Form.controls['document_upload'].reset();
      this.Form.controls['document_id'].setValue(null)
      this.Form.controls['document_name'].setValue('')
      this.Form.controls['format'].setValue('')
    }
    if (this.defaults.attributes) {
      this.deleteImage();
    }
  }

  deleteImage() {
    if (this.Form.value.document_id) {
      this.generalService.delete_image(this.Form.value.document_id).subscribe({
        next: (result: any) => {
          this.Form.controls['document_id'].setValue(null)
          this.Form.controls['document_name'].setValue('')
          this.Form.controls['format'].setValue('')
        },
        error: (err: any) => { },
        complete: () => {
          // const statusText = "Document deleted"
          // this._snackBar.open(statusText, 'Close Warning', {
          //   horizontalPosition: this.horizontalPosition,
          //   verticalPosition: this.verticalPosition,
          // });
        }
      });
    }

  }

  uploadDocument() {
    if (this.defaults.attributes) {
      this.files.forEach((elem: any) => {
        this.documentFormData.delete('files');
        const extension = elem.name.split('.').pop().toLowerCase();
        this.documentFormData.append(
          'files',
          elem,
          this.Form.value?.document_type + '.' + extension
        );
        this.generalService.upload(this.documentFormData).subscribe({
          next: (result: any) => {
            // let data: any[] = [];
            this.Form.controls['document_id'].setValue(result[0].id)
            this.Form.controls['document_name'].setValue(result[0].hash)
            this.Form.controls['format'].setValue(extension)
            // data.push({
            //   document_type: this.Form.value.document_type,
            //   document_date: this.Form.value.upload_date,
            //   document_id: result[0].id,
            //   document_name: result[0].hash,
            //   format: extension,
            //   id: this.Form.value.id,
            // });
            // this.maternityService.update_document(data[0]).subscribe({
            //   next: (result: any) => { },
            //   error: (err: any) => { },
            //   complete: () => { },
            // });
          },
          error: (err: any) => { },
          complete: () => {
            // this.dialogRef.close(this.Form.value);
            // Swal.close();
          },
        });
      });
    }
  }

  submit() {
    // this.dialogRef.close(this.Form.value);
    if (this.defaults.attributes) {
      // this.files.forEach((elem: any) => {
      //   this.documentFormData.delete('files');
      //   const extension = elem.name.split('.').pop().toLowerCase();
      //   this.documentFormData.append(
      //     'files',
      //     elem,
      //     this.Form.value.document_type + '.' + extension
      //   );
      //   this.generalService.upload(this.documentFormData).subscribe({
      //     next: (result: any) => {
      //       let data: any[] = [];
      //       data.push({
      //         document_type: this.Form.value.document_type,
      //         document_date: this.Form.value.upload_date,
      //         document_id: result[0].id,
      //         document_name: result[0].hash,
      //         format: extension,
      //         id: this.Form.value.id,
      //       });
      this.maternityService.update_document(this.Form.value).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.dialogRef.close(this.Form.value);
          Swal.close();
        },
      });
      //     },
      //     error: (err: any) => { },
      //       complete: () => {
      //         this.dialogRef.close(this.Form.value);
      //         Swal.close();
      //       },
      //         });
      // });
    } else {
      this.dialogRef.close(this.Form.value);
    }
  }

}
