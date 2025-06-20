import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import moment from 'moment';
import { AddTeamMemberComponent } from './add-team-member/add-team-member.component';
import Swal from 'sweetalert2';
import { ModifyTeamMemberComponent } from './modify-team-member/modify-team-member.component';
import { ViewTeamMemberComponent } from './view-team-member/view-team-member.component';
import { EsgService } from 'src/app/services/esg.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { MatSelect, MatSelectChange } from '@angular/material/select';


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
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateComponent implements OnInit {
  Form: FormGroup
  monthControl = new FormControl(null, Validators.required);

  selectedYear: string | null = null;
  teamMemberData: any[] = []
  divisions: any[] = []
  selectedMonths: any[] = []
  selectedDivisions: any[] = []
  totalTimePeriods: any[] = []

  // ENVThemeList: any[] = []
  // SOCThemeList: any[] = []
  // GOVThemeList: any[] = []

  // RoleList: any[] = []

  dropdownValues: any
  static id = 1;
  months: string[] = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December']

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    public esgService: EsgService,
    private authService: AuthService,
    private generalService: GeneralService,
    public dialogRef: MatDialogRef<CreateComponent>) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      yearData: ['', Validators.required],
      monthData: ['', Validators.required],
      divisionData: ['', Validators.required],
      statusData: ['Open']
    })
    this.monthControl.disable()
  }

  //check organisation has access

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.esg
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        }
        else if (status === true) {
          this.me()
          this.get_dropdown_values()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.esg_create
        if (status === false) {
          Swal.close()
          this.router.navigate(["/error/unauthorized"])
        }

      }
    })
  }

  //get dropdown values
  get_dropdown_values() {
    this.esgService.get_dropdown_values().subscribe({
      next: (result: any) => {
        this.divisions = result[7].value

        // this.RoleList = result[6].value

        // this.ENVThemeList = result[3].value
        // this.SOCThemeList = result[4].value
        // this.GOVThemeList = result[5].value

      },
      error: (err: any) => {
        console.error("Error fetching data:", err);
      },
    })
  }

  checkMonthYear(months: any) {
    this.esgService.get_TimePeriod().subscribe({
      next: (result: any) => {
        this.totalTimePeriods = result[0].timePeriods;

        // Check if the selected year exists in totalTimePeriods
        const yearData = this.totalTimePeriods.find((period: any) => period.year === this.selectedYear);

        if (yearData) {
          // Check if any of the selected months already exist for this year
          const existingMonths = yearData.months;
          const existing = months.filter((month: string) => existingMonths.includes(month));

          if (existing.length > 0) {
            Swal.fire({
              title: 'Duplicate Months Found',
              text: ` ${existing.join(', ')} already exist for the year ${this.selectedYear}`,
              icon: 'warning',
              confirmButtonText: 'OK',

            });
            this.monthControl.reset()
            this.Form.controls['monthData'].reset();
          }
        }
      }
    });
  }


  onCalendarYearSelected(event: Date, datepicker: any) {  // set calendar year value with selected year
    const selectedCalendarYear = moment(event).format('YYYY');
    this.Form.controls['yearData'].setValue(selectedCalendarYear);
    datepicker.close();

    this.selectedYear = this.Form.value.yearData
    if (this.selectedYear) {
      this.monthControl.enable()
    }
  }

  setMonth(event: any) {
    this.Form.controls['monthData'].setValue(event.value.toString());
    this.selectedMonths = this.monthControl.value
    this.checkMonthYear(this.selectedMonths)

  }

  onDivisionSelected(event: any) {
    this.selectedDivisions = event.value.map((div: any) => div)
    
  }
  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  // function to check if the role is repeated
  // private checkRoleConflict(role: string): boolean {
  //   // Only restrict Reviewer and Approver roles
  //   if (role === 'Contributor') {
  //     return false; // Multiple Contributors are allowed
  //   }
  //   return this.teamMemberData.some(member => member.memberRole === role);
  // }

  addTeamMember() {
    this.dialog.open(AddTeamMemberComponent, { disableClose: true, width: "740px", data: { teamMembers: this.teamMemberData, divisionsSelected: this.selectedDivisions} }).afterClosed().subscribe(data => {
      if (data) {

        // Check for duplicates based on a unique property (teamMember field)
        // const isDuplicate = this.teamMemberData.some(member =>
        //   member.teamMember.id === data.teamMember.id
        // );

        // if (!isDuplicate) {
        this.teamMemberData.push(data)


        Swal.fire({
          icon: 'success',
          title: 'Team Member Added',
        });
        // }

      }
    })
  }



  editMemberData(data: any, index: number) {

    this.dialog.open(ModifyTeamMemberComponent, {
      disableClose: true,
      data: data, width: "740px"
    }).afterClosed().subscribe((updatedData) => {
      if (updatedData) {

        if (index !== -1) {
          this.teamMemberData[index] = updatedData;
          Swal.fire({
            icon: 'success',
            title: 'Team Member updated',
          });
        }
      }
    })
  }

  viewMemberData(data: any, index: number) {

    this.dialog.open(ViewTeamMemberComponent, { disableClose: true, data: data, width: "740px" }).afterClosed().subscribe((updatedData) => { })
  }

  deleteMemberData(index: number) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to remove this team member?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.teamMemberData.splice(index, 1);
        Swal.fire(
          'Deleted Successfully',
          'The team member has been removed from the list.',
          'success'
        );
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    const data = {
      'form_value': this.Form.value,
      'team_member_data': this.teamMemberData
    }
    this.dialogRef.close(data);
  }

}
