import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { CreateIndustryTypeComponent } from '../equipment/create-industry-type/create-industry-type.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Form: FormGroup
  industrytype: any[] = []
  industryTypes: any[] = []
  constructor(private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateClientComponent>) { }
    
  ngOnInit() {
    this.Form = this.formBuilder.group({
      client_id:[''],
      client_name: ['', [Validators.required]],
      client_contact_number: ['', [Validators.required]],
      client_email_id: ['', [Validators.required]],
      client_address: ['', [Validators.required]],
      industry_type: ['', [Validators.required]],
    });
    this.get_industrytypes()
  }

  get_industrytypes() {
    this.equipmentService.get_industry_type().subscribe({
      next: (result: any) => {
        console.log(result)
        this.industryTypes = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  new_industry_type() {
    this.dialog.open(CreateIndustryTypeComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.industrytype.find(obj => obj.attributes.name === data.name);
        if (found) {
          const statusText = "Industry Type already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          
          this.equipmentService.create_industry_type(data, this.Form.value.reporter).subscribe({
            next: (result: any) => {
              this.equipmentService.get_industry_type().subscribe({
                next: (result: any) => {
                  this.industryTypes = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Industry Type created successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['industry_type'].setValue(result.data.attributes.name)

                }
              })
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => { }
          })
        }

      }
    })
  }
  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  submit() {
    this.create_client_id()
    //
  }


  create_client_id() {
    this.showProgressPopup();
    this.equipmentService.get_clients().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const newReference = 'CLI-' + newCount
        this.Form.controls['client_id'].setValue(newReference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_client()
      }
    })
  }
  create_client() {
    this.equipmentService.create_client(this.Form.value).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { 
        Swal.close()
        this.dialogRef.close(this.Form.value);}
    })
  }
}
