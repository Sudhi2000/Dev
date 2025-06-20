import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';

@Component({
  selector: 'app-upload-facility-photo',
  templateUrl: './upload-facility-photo.component.html',
  styleUrls: ['./upload-facility-photo.component.scss']
})
export class UploadFacilityPhotoComponent implements OnInit {


  Form: FormGroup
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  files: File[] = [];
  multipledocumentIds: any[] = [];
  multiple_evidence_Before: boolean = false;
  MultipleDoumentBeforeFiles: File[] = [];
  orgID: string
  moreFiles: any[] = []

  constructor(
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private internalAuditService: InternalAuditService,
    public dialogRef: MatDialogRef<UploadFacilityPhotoComponent>,
    private _snackBar: MatSnackBar,
    private internalService: InternalAuditService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
  ) { }

  ngOnInit(): void {
    if (this.defaults) {
      this.Form = this.formBuilder.group({
        title: [this.defaults[0]?.remarks || '', [Validators.required]],
        file_name: [this.defaults[0]?.document_name || ''],
        evidence: [this.defaults[0]?.evidence || ''],
        evidence_id: [this.defaults[0]?.document_id || ''],
      });

    }
    else {
      this.Form = this.formBuilder.group({
        title: ['', [Validators.required]],
        file_name: [''],
        evidence: [''],
        evidence_id: [''],
      });

    }
  }

  onSelect(event: any) {
    this.files = []
    const fileLength = this.files.length;
    const addedLength = event.addedFiles.length;

    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / (1024 * 1024);
      if (size > 10) {
        const statusText = "Please choose a evidence below 10 MB";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        const fileTypes = ['jpg', 'jpeg', 'png'];
        const extension = event.addedFiles[0].name.split('.').pop().toLowerCase();
        const isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.files.push(...event.addedFiles);
          this.Form.controls['file_name'].setValue(this.files[0].name);
          this.Form.controls['evidence'].setErrors(null);
          // this.addMoreEvidence = true
        } else {
          const statusText = "Please choose a document ('jpg', 'jpeg', 'png')";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else if (fileLength > 6) {
      const statusText = "You have exceeded the upload limit";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length === 0) {
      this.Form.controls['evidence'].reset()

    }
  }

  submit() {
    if (this.files.length === 0) {
      const statusText = "You have to upload image";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else {
      const data = [this.Form.value, this.files[0]];
      this.dialogRef.close(data)
    }

  }

}
