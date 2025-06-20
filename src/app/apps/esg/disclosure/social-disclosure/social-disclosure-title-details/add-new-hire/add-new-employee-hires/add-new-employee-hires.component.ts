import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';
import { CreateNewRegionComponent } from '../../../create-new-region/create-new-region.component';

@Component({
  selector: 'app-add-new-employee-hires',
  templateUrl: './add-new-employee-hires.component.html',
  styleUrls: ['./add-new-employee-hires.component.scss']
})
export class AddNewEmployeeHiresComponent implements OnInit {
  Form: FormGroup
  lov: any[] = []

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddNewEmployeeHiresComponent>) { }

  ngOnInit() {

    this.Form = this.formBuilder.group({
      id: [''],
      title: [this.data.data.title || ''],
      title_ref_id: [this.data.title_ref_id || ''],
      esg_disclosure: [this.data.refID || ''],
      region: [this.data.data.region || ''],
      new_employee_hires: [this.data.data.new_employee_hires || ''],
      employment_type: [this.data.data.employment_type || ''],
      guaranteed_working_hour: [
        typeof this.data.data.guaranteed_working_hour === 'boolean'
          ? this.data.data.guaranteed_working_hour
          : null
      ],
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
  submit() {
    if (this.data.mode === 'modify' && this.data.data.id) {
      this.showProgressPopup()
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.data.id)
      formData.append('new_employee_hire', JSON.stringify(this.Form.value))
      // formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value))
      this.esgService.updateSocDisTitleEmployeeHire(formData).subscribe({
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
  new_region() {
    this.dialog.open(CreateNewRegionComponent, { width: "500px", data: { userID: this.data.userID, mode: 'create' } }).afterClosed().subscribe((data: any) => {
     if(data){
       this.lov[0].value.push(data)
       this.Form.controls['region'].setValue(data.region)
     }
    })
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

}
