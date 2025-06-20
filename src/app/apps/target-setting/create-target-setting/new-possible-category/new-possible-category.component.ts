import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TargetSettingService } from 'src/app/services/target-setting.service';
@Component({
  selector: 'app-new-possible-category',
  templateUrl: './new-possible-category.component.html',
  styleUrls: ['./new-possible-category.component.scss']
})
export class NewPossibleCategoryComponent implements OnInit {

  Form: FormGroup

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private targetService: TargetSettingService,
    public dialogRef: MatDialogRef<NewPossibleCategoryComponent>) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      possible_category: ['', [Validators.required]],
      category: [this.defaults.category],
      created_user: [this.defaults.reporter],
    });
  }

  submit() {
    this.targetService.create_possible_category(this.Form.value).subscribe({
      next: (result: any) => {
        this.dialogRef.close(result);
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

}
