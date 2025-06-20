import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-new-title',
  templateUrl: './new-title.component.html',
  styleUrls: ['./new-title.component.scss']
})
export class NewTitleComponent implements OnInit {

  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    public dialogRef: MatDialogRef<NewTitleComponent>) { }


  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      title: ['', [Validators.required]],
    });
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }
}


