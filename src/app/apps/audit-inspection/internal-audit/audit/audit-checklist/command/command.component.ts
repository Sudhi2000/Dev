import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { question } from 'src/app/services/schemas';

@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.scss']
})
export class CommandComponent implements OnInit {
  Form: FormGroup
  files: File[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
      ],
    },
  }

  constructor(private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CommandComponent>,
    @Inject(MAT_DIALOG_DATA) public defaults: any
  ) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      command: [''],
      evidence_name:[''],
      evidence: [''],
      evidence_id: [ ''],
    });
  }

  onSelect(event: any) {
    const fileLength = this.files.length;
    const addedLength = event.addedFiles.length;

    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / (1024 * 1024); // Convert bytes to megabytes
      if (size > 5) {
        const statusText = "Please choose a document below 5 MB";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        const fileTypes = ['pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png']; // Include image extensions
        const extension = event.addedFiles[0].name.split('.').pop().toLowerCase();
        const isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.files.push(...event.addedFiles);
          this.Form.controls['evidence_name'].setValue(this.files[0].name);
          this.Form.controls['evidence'].setErrors(null);

        } else {
          const statusText = "Please choose a document ('pdf', 'word', 'excel', 'jpg', 'jpeg', 'png')";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else if (fileLength < 6) {
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
    const data = [this.Form.value, this.files];
    this.dialogRef.close(data)

  }
  // cancel(){
  //   const data = [this.Form.value, this.files];
  //   this.dialogRef.close(data)
  // }
}
