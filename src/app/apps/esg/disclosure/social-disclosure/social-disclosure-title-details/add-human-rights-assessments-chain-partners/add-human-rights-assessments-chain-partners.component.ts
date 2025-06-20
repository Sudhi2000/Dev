import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';
import { NewTypeHrViolationsComponent } from '../../new-type-hr-violations/new-type-hr-violations.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-human-rights-assessments-chain-partners',
  templateUrl: './add-human-rights-assessments-chain-partners.component.html',
  styleUrls: ['./add-human-rights-assessments-chain-partners.component.scss']
})
export class AddHumanRightsAssessmentsChainPartnersComponent implements OnInit {
  Form: FormGroup
  lov: any[] = []
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
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddHumanRightsAssessmentsChainPartnersComponent>) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      id: [''],
      age_group: [this.data.data.age_group || ''],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.title_ref_id || ''],
      esg_disclosure: [this.data.refID || ''],
      types_of_human_rights_violation: [this.data.data.types_of_human_rights_violation || null, Validators.required],
      total_number_of_value_chain_partners: [this.data.data.total_number_of_value_chain_partners || null, Validators.required],
      no_of_chain_val_assessed_for_hr_violation: [this.data.data.no_of_chain_val_assessed_for_hr_violation || '', Validators.required],
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
      formData.append('human_rights_assessment_chain_partners', JSON.stringify(this.Form.value))
      // formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value))
      this.esgService.updateSocDisTitleHumanRightsAssessmentChainPartners(formData).subscribe({
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
  newTypeOfHumanRightsViolation() {
    this.dialog.open(NewTypeHrViolationsComponent, { width: "500px", data: { userID: this.data.userID, lov: this.lov, mode: 'create' } }).afterClosed().subscribe((data: any) => {
      if (data) {
        this.lov[21].value.push(data)
        this.Form.controls['types_of_human_rights_violation'].setValue(data.value)

        const statusText = "Type of ODS created.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }

    })
  }
  deleteTypeofHumanRightsViolation(data: any) {
    this.showProgressPopup();
    const currentTypeofHumanRightsViolationValue = this.Form.controls['types_of_human_rights_violation'].value;
    this.esgService.deleteTypeofHRViolation(data.id).subscribe({
      next: (result: any) => {
        this.lov[21].value = this.lov[21].value.filter((item: { id: any; }) => item.id !== data.id);
      },
      error: () => {
        console.error('Error deleting Type Of Type Of ODS');
      },
      complete: () => {
        Swal.close();
        if (currentTypeofHumanRightsViolationValue === data.value) {
        } else {
          this.Form.controls['types_of_human_rights_violation'].setValue(currentTypeofHumanRightsViolationValue);
        }
      }
    });
  }
  modifyTypeofHumanRightsViolation(data: any) {
    this.dialog.open(NewTypeHrViolationsComponent, {
      width: "500px",
      data: { userID: this.data.userID, mode: 'modify', data: data }
    }).afterClosed().subscribe((updatedData: any) => {

      if (updatedData?.id) {
        const index = this.lov[21].value.findIndex((item: any) => {
          return item.id === updatedData.id;
        });

        if (index !== -1) {
          this.lov[21].value[index] = updatedData;
        } else {
          console.warn("Type of ODS ID not found in the list.");
        }
        this.Form.controls['types_of_human_rights_violation'].setValue(updatedData.value);
      } else {
        console.error('Invalid data: Missing Type of ODS ID.');
      }
    });
  }

  close() {
    this.dialogRef.close()
  }
}
