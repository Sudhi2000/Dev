import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-individual-topic',
  templateUrl: './individual-topic.component.html',
  styleUrls: ['./individual-topic.component.scss']
})
export class IndividualTopicComponent implements OnInit {

  Form: FormGroup
  dropdownValue: any;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder, public dialogRef: MatDialogRef<IndividualTopicComponent>) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      individual_topic: ['', [Validators.required]],
      sub_topic: ['', [Validators.required]]
    })

    this.setValue();
  }

  setValue(){
    this.dropdownValue = this.defaults.split(',').map((item: any) => item.trim());
    if(this.dropdownValue.length === 1){
      this.Form.controls['sub_topic'].setValue(this.dropdownValue[0])
    }
  }


  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
