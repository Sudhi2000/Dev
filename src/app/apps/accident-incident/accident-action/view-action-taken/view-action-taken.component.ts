import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-view-action-taken',
  templateUrl: './view-action-taken.component.html',
  styleUrls: ['./view-action-taken.component.scss']
})
export class ViewActionTakenComponent implements OnInit {
  actionTakenFormControl: FormControl; 
  userRemarksFormControl: FormControl; 
  quillConfig = {
    toolbar: {
      
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
      ],
    },
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewActionTakenComponent>
  ) {    
    const actionTaken = data.actionTaken;
    const userRemarks = data.userRemarks;
    this.actionTakenFormControl = new FormControl(actionTaken); // Set the FormControl value to the action taken data
    this.userRemarksFormControl = new FormControl(userRemarks); // Set the FormControl value to the action taken data
  }
 
  ngOnInit() {
  }
}
