import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';

@Component({
  selector: 'app-new-auditee',
  templateUrl: './new-auditee.component.html',
  styleUrls: ['./new-auditee.component.scss']
})
export class NewAuditeeComponent implements OnInit {

  Form:FormGroup
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private formBuilder: FormBuilder,
    private generalService:GeneralService,
    private internalService:InternalAuditService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<NewAuditeeComponent>) { }

  ngOnInit() {

    this.Form = this.formBuilder.group({
      name:['', [Validators.required]],
      email:['', [Validators.required,Validators.email]]

      // consumption_category: ['', [Validators.required]],
      // category: ['', [Validators.required]],
      // source: ['', [Validators.required]],
      // unit: ['', [Validators.required]],
      // quantity: ['', [Validators.required]],
      // amount: ['', [Validators.required]],
      // scope: ['', [Validators.required]],
      // description: [''],
      // treatment: ['', [Validators.required]],
      // collected_from: ['', [Validators.required]],
      // collected_to: ['', [Validators.required]],
      // disposal_method: ['', [Validators.required]],
      // disposal_date: ['', [Validators.required]],
      // consignment_number: ['', [Validators.required]],
      // disposer: ['', [Validators.required]],
      // career: ['', [Validators.required]],
      // disposal_place: ['', [Validators.required]],
      // pollutants_emitted: ['', [Validators.required]],
      // concentration: ['', [Validators.required]],
      // determined_by: ['', [Validators.required]],
      // files: [''],
      // pending_consumption: [''],
      // pending_percentage: [0]
    });
  }

  submit() {
    const email = this.Form.get('email')?.value;    
    this.internalService.get_auditees().subscribe({
      next: (result: any) => {        
          const emailExists = result.data.some((auditee: any) => auditee.attributes.email === email);          
          if (emailExists) {
            const statusText = "An auditee already exists in given email ID. Please provide an unique Email ID."
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          } else {
            this.internalService.create_audit(this.Form.value).subscribe({
              next: (result: any) => {
                this.dialogRef.close(result);
              },
              error: (err: any) => {},
              complete: () => {}
            });
          }
      
         
        
      },
      error: (err: any) => {},
      complete: () => {}
    });
  }
  
  

}
