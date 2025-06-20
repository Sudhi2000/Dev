import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-go-to-boolean',
  templateUrl: './go-to-boolean.component.html',
  styleUrls: ['./go-to-boolean.component.scss']
})
export class GoToBooleanComponent implements OnInit {

  consultationRequired: boolean = false;
  selectedOption: string | null = null;

  constructor(public dialogRef: MatDialogRef<GoToBooleanComponent>,) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  onSubmit() {
    // Return 'yes' if enabled, otherwise 'no'
    this.dialogRef.close(this.consultationRequired ? 'yes' : 'no');
  }
  onConfirm(): void {
    if (this.selectedOption) {
      this.dialogRef.close(this.selectedOption); // Return the selected option
    } else {
      alert('Please select an option before proceeding.');
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // No selection returned
  }

}
