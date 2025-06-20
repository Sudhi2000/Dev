import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-corporate',
  templateUrl: './add-corporate.component.html',
  styleUrls: ['./add-corporate.component.scss']
})
export class AddCorporateComponent implements OnInit {
  Form: FormGroup
  lov: any[] = []
  partnership: string[] = ['Yes', 'No']

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    public dialogRef: MatDialogRef<AddCorporateComponent>) { }

  ngOnInit(): void {

    this.Form = this.formBuilder.group({
      id: [''],
      title: [this.data.addData.title || ''],
      title_ref_id: [this.data.title_ref_id || ''],
      esg_disclosure: [this.data.refID || ''],
      name_of_venture: [this.data.addData.name_of_venture || '', Validators.required],
      corp_partnership_type: [this.data.addData.corp_partnership_type || '', Validators.required],
      percentage_share: [this.data.addData.percentage_share || null, Validators.required],
      business_participation: [this.data.addData.business_participation || '', Validators.required],
    })

    this.lov = this.data.lov
    if (this.data.mode === 'view') {

      this.Form.disable();
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
      this.showProgressPopup()

      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.addData.id)


      formData.append('corporate_details', JSON.stringify(this.Form.value))
      this.esgService.updateGovCorporate(formData).subscribe({
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
