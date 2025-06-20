import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-sub-department',
  templateUrl: './new-sub-department.component.html',
  styleUrls: ['./new-sub-department.component.scss']
})
export class NewSubDepartmentComponent implements OnInit {

  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private generalService: GeneralService,
    public dialogRef: MatDialogRef<NewSubDepartmentComponent>) { }


  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required]],
     
    });
    
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }


}
