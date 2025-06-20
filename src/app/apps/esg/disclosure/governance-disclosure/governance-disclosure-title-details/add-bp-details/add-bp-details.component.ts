// Add Business Partners Details Component

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-bp-details',
  templateUrl: './add-bp-details.component.html',
  styleUrls: ['./add-bp-details.component.scss']
})
export class AddBPDetailsComponent implements OnInit {
  Form: FormGroup
  lov: any[] = []

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    public dialogRef: MatDialogRef<AddBPDetailsComponent>) { }

  ngOnInit(): void {
    
    this.Form = this.formBuilder.group({
      id: [''],
      esg_disclosure: [this.data.refID || ''],
      title: [this.data.addData.title || ''],
      title_ref_id: [this.data.title_ref_id || ''],
      business_partner_type: [this.data.addData.business_partner_type || ''],
      business_partners: [this.data.addData.business_partners || null],
      business_partners_communicated: [this.data.addData.business_partners_communicated || null],
      trained_business_partners: [this.data.addData.trained_business_partners || null],
      man_hours: [this.data.addData.man_hours || null],
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
        
        formData.append('business_partner_details', JSON.stringify(this.Form.value))
        this.esgService.updateGovBusinessPartnerDetails(formData).subscribe({
          next: (result: any) => {
            this.dialogRef.close(this.Form.value);
          },
          error: (err: any) => {
  
          },
          complete: () => {
             Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Business Partners details updated successfully!',
                    timer: 2000, // Auto-close after 2 seconds
                    showConfirmButton: true
                  });
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
