import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-new-state',
  templateUrl: './new-state.component.html',
  styleUrls: ['./new-state.component.scss']
})
export class NewStateComponent implements OnInit {

  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private generalService: GeneralService,
    public dialogRef: MatDialogRef<NewStateComponent>) { }


  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      name: ['', [Validators.required]],
      country: ['']
    });
    if (this.defaults) {
      this.Form.controls['country'].setValue(this.defaults)
    }
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }


}
