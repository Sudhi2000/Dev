import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
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
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AddDocumentComponent implements OnInit {
  Form: FormGroup
  documentTypeList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  mode: 'create' | 'update' = 'create';
  static id = 1;
  files: File[] = [];

  uploadDate = new FormControl(null);

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    // private acidentService:AccidentService,
    public dialogRef: MatDialogRef<AddDocumentComponent>
  ) { }

  ngOnInit(): void {
    if (this.defaults) {
      this.mode = 'update';

      // this.generalService.getImage(environment.client_backend + '/uploads/' + this.defaults?.attributes?.document_name + '.' + this.defaults?.attributes?.format).subscribe((data: any) => {
      //   this.files.push(data)
      // })

      this.uploadDate.setValue(new Date(this.defaults?.upload_date == "1970-01-02" ? "" : this.defaults?.upload_date))
      if (this.defaults && this.defaults?.files?.length > 0) {
        this.files.push(this.defaults?.files[0])
      }

    } else {
      this.defaults = {} as any;
    }
    // this.configuration()
    this.Form = this.formBuilder.group({
      id: [this.defaults?.id || AddDocumentComponent.id++],
      // org_id: [this.defaults.org_id || ''],
      document_type: [this.defaults?.document_type || ''],
      document_id: [this.defaults?.document_id || null],
      document_name: [this.defaults?.document_name || ''],
      format: [this.defaults?.format || ''],
      upload_date: [new Date() || null],
      document_upload: [''],
      files: [],

    });

    this.dropdownValues();
  }

  uploadDateVal(data: any) {
    this.Form.controls['upload_date'].setValue(new Date(data.value))
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
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
