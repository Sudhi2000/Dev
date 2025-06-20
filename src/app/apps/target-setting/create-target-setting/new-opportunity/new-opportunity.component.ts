import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TargetSettingService } from 'src/app/services/target-setting.service';
@Component({
  selector: 'app-new-opportunity',
  templateUrl: './new-opportunity.component.html',
  styleUrls: ['./new-opportunity.component.scss']
})
export class NewOpportunityComponent implements OnInit {
  Form: FormGroup

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private targetService: TargetSettingService,
    public dialogRef: MatDialogRef<NewOpportunityComponent>) { }

  ngOnInit() {
console.log(this.defaults);

    this.Form = this.formBuilder.group({
      opportunity: ['', [Validators.required]],
      created_user: [this.defaults.reporter],
      possible_category:[this.defaults.possible_category]
    });
  }

  submit() {
    this.targetService.create_opportunity(this.Form.value).subscribe({
      next: (result: any) => {
        this.dialogRef.close(result);
      },
      error: (err: any) => { },
      complete: () => { }
    })


  }

}
