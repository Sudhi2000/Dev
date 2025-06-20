import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { CreateIndustryTypeComponent } from '../equipment/create-industry-type/create-industry-type.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss']
})
export class ViewClientComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Form: FormGroup
  industrytype: any[] = []
  industryTypes: any[] = []
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
  private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewClientComponent>) { }
    
  ngOnInit() {
    this.Form = this.formBuilder.group({
      id:[this.defaults.id],
      client_id:[this.defaults.client_id || ''],
      client_name: [this.defaults.client_name || ''],
      client_contact_number: [this.defaults.client_contact_number || ''],
      client_email_id: [this.defaults.client_email_id || ''],
      client_address: [this.defaults.client_address || ''],
      industry_type: [this.defaults.industry_type || ''],
      
    });
  this.Form.disable()
  }

  get_industrytypes() {
    this.equipmentService.get_industry_type().subscribe({
      next: (result: any) => {
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
  
  submit() {
    this.update_client()
    //
  }

  close(){
    this.dialogRef.close()
  }
 
  update_client() {
    this.equipmentService.update_client(this.Form.value).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { this.dialogRef.close(this.Form.value);}
    })
  }

}
