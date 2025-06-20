import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sub-topic',
  templateUrl: './sub-topic.component.html',
  styleUrls: ['./sub-topic.component.scss']
})


export class SubTopicComponent implements OnInit {
  Form: FormGroup

  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<SubTopicComponent>) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      sub_topic: ['', [Validators.required]]
    })
  }

  submit(){
    this.dialogRef.close(this.Form.value.sub_topic);
  }
}
