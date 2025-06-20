import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import { CreateNewRegionComponent } from '../../../create-new-region/create-new-region.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-employee-turnover',
  templateUrl: './add-employee-turnover.component.html',
  styleUrls: ['./add-employee-turnover.component.scss']
})
export class AddEmployeeTurnoverComponent implements OnInit {

  Form: FormGroup
  lov: any[] = []

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEmployeeTurnoverComponent>) { }

  ngOnInit() {

    this.Form = this.formBuilder.group({
      id: [''],
      title: [this.data.data.title || ''],
      region: [this.data.data.region || ''],
      title_ref_id: [this.data.title_ref_id || ''],
      esg_disclosure: [this.data.refID || ''],
      employee_turnover: [this.data.data.employee_turnover || ''],
      age_group: [this.data.data.age_group || ''],
      male: [this.data.data.male || null, Validators.required],
      female: [this.data.data.female || null, Validators.required],
      other: [this.data.data.other || null],
    })

    this.lov = this.data.lov
    if (this.data.mode === 'view') {
      this.Form.disable();
    }
  }
  new_region() {
    this.dialog.open(CreateNewRegionComponent, { width: "500px", data: { userID: this.data.userID } }).afterClosed().subscribe((data: any) => {
     if(data){
       this.lov[0].value.push(data)
       this.Form.controls['region'].setValue(data.region)
     }
    })
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
  deleteRegion(data: any) {
    this.showProgressPopup();
    const currentRegionValue = this.Form.controls['region'].value;
    this.esgService.deleteRegion(data.id).subscribe({
      next: (result: any) => {
        this.lov[0].value = this.lov[0].value.filter((item: { id: any; }) => item.id !== data.id);
      },
      error: () => {
        console.error('Error deleting region');
      },
      complete: () => {
        Swal.close();
        if (currentRegionValue === data.region) {
        } else {
          this.Form.controls['region'].setValue(currentRegionValue);
        }
      }
    });
  }
  submit() {

    if (this.data.mode === 'modify' && this.data.data.id) {
      this.showProgressPopup()
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('employee_turnover', JSON.stringify(this.Form.value))
      // formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value))
      this.esgService.updateSocDisTitleEmployeeTurnover(formData).subscribe({
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
  modifyRegion(data: any) {
    this.dialog.open(CreateNewRegionComponent, {
      width: "500px",
      data: { userID: this.data.userID, mode: 'modify', data: data }
    }).afterClosed().subscribe((updatedData: any) => {
      if (updatedData?.id) {
        const index = this.lov[0].value.findIndex((item: any) => {
          return item.id === updatedData.id;
        });

        if (index !== -1) {
          this.lov[0].value[index] = updatedData;
        } else {
          console.warn("Region ID not found in the list.");
        }
        this.Form.controls['region'].setValue(updatedData.region);
      } else {
        console.error('Invalid data: Missing region ID.');
      }
    });
  }
  close() {
    this.dialogRef.close()
  }
}
