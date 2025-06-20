import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
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
  selector: 'app-add-close-calls-and-high-potential-incidents',
  templateUrl: './add-close-calls-and-high-potential-incidents.component.html',
  styleUrls: ['./add-close-calls-and-high-potential-incidents.component.scss'],
   providers: [
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ]
})
export class AddCloseCallsAndHighPotentialIncidentsComponent implements OnInit {

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
      public dialogRef: MatDialogRef<AddCloseCallsAndHighPotentialIncidentsComponent>) { }
  
    ngOnInit() {
      this.Form = this.formBuilder.group({
        id: [''],
        age_group: [this.data.data.age_group || ''],
        title: [this.data.data.title || ''],
        title_ref_id: [this.data.title_ref_id || ''],
        esg_disclosure: [this.data.refID || ''],
        incident_id: [this.data.data.incident_id || null],
        date: [this.data.data.date || null, Validators.required],
        type: [this.data.data.type || '', Validators.required],
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
        formData.append('close_calls', JSON.stringify(this.Form.value))
        // formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value))
        this.esgService.updateSocDisTitleCloseCalls(formData).subscribe({
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
