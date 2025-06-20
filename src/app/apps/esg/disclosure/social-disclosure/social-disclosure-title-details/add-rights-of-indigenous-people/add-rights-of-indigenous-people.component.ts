import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-rights-of-indigenous-people',
  templateUrl: './add-rights-of-indigenous-people.component.html',
  styleUrls: ['./add-rights-of-indigenous-people.component.scss']
})
export class AddRightsOfIndigenousPeopleComponent implements OnInit {

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
    public dialogRef: MatDialogRef<AddRightsOfIndigenousPeopleComponent>) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      id: [''],
      age_group: [this.data.data.age_group || ''],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.title_ref_id || ''],
      esg_disclosure: [this.data.refID || ''],
      id_or_number_of_incidents: [this.data.data.id_or_number_of_incidents || null, Validators.required],
      status_and_action: [this.data.data.status_and_action || '', Validators.required],
      description: [this.data.data.description || ''],
      corrective_actions_taken: [this.data.data.corrective_actions_taken || ''],
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
      formData.append('rights_of_indigenous_people', JSON.stringify(this.Form.value))
      // formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value))
      this.esgService.updateSocDisTitleRightsOfIndPeople(formData).subscribe({
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
