import { Component, Inject, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY', // This is the format the date will be parsed in
  },
  display: {
    dateInput: 'YYYY', // Display year only in the input field
    monthYearLabel: 'YYYY', // Format used in the date picker panel header
    dateA11yLabel: 'YYYY', // Format used for a11y purposes
    monthDayLabel: 'YYYY', // Format used for displaying selected month and day
  },
};
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewComponent implements OnInit {
  Form: FormGroup
  selectedYear: string | null = null;
  teamMemberData: any[] = []
  dropdownValues: any
constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    public esgService: EsgService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,

    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewComponent>) { }
  ngOnInit(): void {
        this.Form = this.formBuilder.group({
      id: [''],
      yearData: ['', Validators.required],
      monthData: ['', Validators.required],
      statusData: ['Happening']
    })
    this.getDetails()
  }

  getDetails() {

    const reference_id = this.defaults.referenceId

    this.esgService.get_Details(reference_id).subscribe({
      next: (result: any) => {

        if (result.code === 200) {
          const { register, teamMembers } = result.data;
          this.Form.controls['id'].setValue(register.recordID);
          this.Form.controls['yearData'].setValue(register.yearData);
          this.Form.controls['monthData'].setValue(register.monthData);
          this.Form.controls['statusData'].setValue(register.statusData || 'Happening');

          this.teamMemberData = teamMembers

        }

      },
      error(err) {
        console.error('Error fetching details:', err);
      },
      complete() {

      },
    })

  }

  close() {

    this.dialogRef.close();
  }
}
