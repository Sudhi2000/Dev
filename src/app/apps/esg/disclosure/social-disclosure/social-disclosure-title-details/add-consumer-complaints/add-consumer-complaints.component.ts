import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-consumer-complaints',
  templateUrl: './add-consumer-complaints.component.html',
  styleUrls: ['./add-consumer-complaints.component.scss']
})
export class AddConsumerComplaintsComponent implements OnInit {

  Form: FormGroup
  lov: any[] = []
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
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddConsumerComplaintsComponent>) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      id: [''],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.title_ref_id || ''],
      esg_disclosure: [this.data.refID || ''],
      category: [this.data.data.category || '', Validators.required],
      corrective_action_details: [this.data.data.corrective_action_details || ''],
      no_of_complaints_received: [this.data.data.no_of_complaints_received || null, Validators.required],
      status: [this.data.data.status || '', Validators.required],
    })

    this.lov = this.data.lov
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }

  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      this.showProgressPopup()
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('consumer_complaints', JSON.stringify(this.Form.value))
      // formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value))
      this.esgService.updateSocDisTitleConsumerComplaints(formData).subscribe({
        next: (result: any) => {
        },
        error: (err: any) => {
          
        },
        complete: () => {
          Swal.close()
          this.dialogRef.close(this.Form.value);
        }
      })
    } else {
      this.dialogRef.close(this.Form.value);
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


  close() {
    this.dialogRef.close()
  }

}
