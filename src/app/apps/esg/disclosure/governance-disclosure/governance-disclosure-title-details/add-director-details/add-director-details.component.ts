import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-director-details',
  templateUrl: './add-director-details.component.html',
  styleUrls: ['./add-director-details.component.scss']
})
export class AddDirectorDetailsComponent implements OnInit {
  Form: FormGroup
  lov: any[] = []

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    public dialogRef: MatDialogRef<AddDirectorDetailsComponent>) { }

  ngOnInit() {


    this.Form = this.formBuilder.group({
      id: [''],
      governance_body: [this.data.addData.governance_body || '', Validators.required],
      title: [this.data.addData.title || ''],
      title_ref_id: [this.data.title_ref_id || ''],
      esg_disclosure: [this.data.refID || ''],
      age_group: [this.data.addData.age_group || '', Validators.required],
      male: [this.data.addData.male || '', Validators.required],
      female: [this.data.addData.female || '', Validators.required],
      other: [this.data.addData.other || '', Validators.required],
    })

    this.lov = this.data.lov
    if (this.data.mode === 'view') {
      // Disable form fields or customize behavior for view mode
      this.Form.disable(); // Example to disable form fields
    }

  }
  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Updating...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }
  handleNumericInput(event: KeyboardEvent): void {
    // Prevents 'e', 'E', '+', and '-' keys from being entered
    const restrictedKeys = ["e", "E", "+", "-"];
    if (restrictedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  submit() {

    if (this.data.mode === 'modify' && this.data.addData.id) {
      this.showProgressPopup();

      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.addData.id)

      formData.append('director_details', JSON.stringify(this.Form.value))
      this.esgService.updateGovDisTitleDirectorDetails(formData).subscribe({
        next: (result: any) => {
          this.dialogRef.close(this.Form.value);
        },
        error: (err: any) => {

        },
        complete: () => {
          Swal.close()
        }
      })
    } else {

      this.dialogRef.close(this.Form.value);
    }
  }
  close() {
    this.dialogRef.close()
  }
}
