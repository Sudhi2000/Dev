import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import Swal from 'sweetalert2';
import { AddTeamMemberComponent } from '../create/add-team-member/add-team-member.component';
import { ModifyTeamMemberComponent } from '../create/modify-team-member/modify-team-member.component';
import { ViewTeamMemberComponent } from '../create/view-team-member/view-team-member.component';
import { EsgService } from 'src/app/services/esg.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { AuthService } from 'src/app/services/auth.api.service';


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
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]

})
export class ModifyComponent implements OnInit {

  Form: FormGroup
  monthControl = new FormControl(null);
  divisionControl = new FormControl([], Validators.required);

  selectedYear: string | null = null;
  teamMemberData: any[] = []
  divisions: any[] = []
  selectedMonths: any[] = []
  selectedDivisions: any[] = []

  totalTimePeriods: any[] = []
  dropdownValues: any
  static id = 1;
  formData = new FormData()

  months: string[] = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November']
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    public esgService: EsgService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private generalService: GeneralService,
    private authService: AuthService,

    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModifyComponent>) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      yearData: ['', Validators.required],
      monthData: ['', Validators.required],
      divisionData: ['', Validators.required],
      divisionName: [''],
      statusData: ['Open']
    })
    this.getDetails()

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
        const status = result.esg_modify
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
  // setDivision(event: any) {

  //   this.Form.controls['divisionData'].setValue(event.value.id);

  // }

  onDivisionSelected(event: any) {

    this.selectedDivisions.push(event)

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
  private checkRoleConflict(role: string): boolean {
    // Only restrict Reviewer and Approver roles
    if (role === 'Contributor') {
      return false; // Multiple Contributors are allowed
    }
    return this.teamMemberData.some(member => member.memberRole === role);
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


          if (register?.divisionData) {
            this.selectedDivisions = register.divisionData

            const divisionsdata = register.divisionData.map((div: any) => div.id)

            const divisionsname = register.divisionData.map((div: any) => div.division_name)
            this.Form.controls['divisionData'].setValue(divisionsdata);
            this.Form.controls['divisionName'].setValue(divisionsname);

            this.divisionControl.setValue(divisionsdata);

            // this.setDivision(divisionsdata);
          }
          if (register?.monthData) {
            const months = register.monthData.split(',');
            this.monthControl.setValue(months);
            this.setMonth({ value: months })
          }



        }

      },
      error(err) {
        console.error('Error fetching details:', err);
      },
      complete() {

      },
    })

    // this.esgService.get_Details()
  }
  // addTeamMember() {
  //   const reference_id = this.defaults.referenceId

  //   this.dialog.open(AddTeamMemberComponent, { width: "740px" }).afterClosed().subscribe(data => {
  //     if (data) {

  //       if (data.memberRole === 'Reviewer' && this.checkRoleConflict('Reviewer')) {
  //         Swal.fire({
  //           icon: 'warning',
  //           title: 'Reviewer Already Added',
  //           text: 'Only one reviewer is allowed.',
  //         });
  //         return;
  //       }
  //       if (data.memberRole === 'Approver' && this.checkRoleConflict('Approver')) {
  //         Swal.fire({
  //           icon: 'warning',
  //           title: 'Approver Already Added',
  //           text: 'Only one approver is allowed.',
  //         });
  //         return;
  //       }

  //       this.formData = new FormData()
  //       this.formData.append('reference_id', JSON.stringify(reference_id))
  //       this.formData.append('member_data', JSON.stringify(data))
  //       this.esgService.add_team_member(this.formData).subscribe({
  //         next: (result: any) => {

  //           if (result[0].code === 200) {
  //             this.teamMemberData.push(result[0].members);
  //             Swal.fire({
  //               icon: 'success',
  //               title: 'Team Member Added',
  //             });
  //           }

  //         },
  //         error: (err: any) => {
  //           console.error('API error:', err);
  //           this.router.navigate(["/error/internal"]);
  //         },
  //         complete: () => {
  //           this.ngOnInit()
  //         }
  //       })



  //     }
  //   })
  // }

  addTeamMember() {
    const reference_id = this.defaults.referenceId

    this.dialog.open(AddTeamMemberComponent, { disableClose: true, width: "740px", data: { teamMembers: this.teamMemberData, divisionsSelected: this.selectedDivisions } }).afterClosed().subscribe(data => {
      if (data) {
        const newMember = {
          userID: data.teamMember.id,
          fullname: data.teamMember.fullName,
          disClosure: data.disclosure,
          environmentThemes: data.environmentThemes || "",
          socialThemes: data.socialThemes || "",
          governanceThemes: data.governanceThemes || "",
          environmentRole: data.environmentRole || "",
          socialRole: data.socialRole || "",
          governanceRole: data.governanceRole || ""
        };

        this.formData = new FormData()
        this.formData.append('reference_id', JSON.stringify(reference_id))
        this.formData.append('new_member_data', JSON.stringify(data))
        this.esgService.add_team_member(this.formData).subscribe({
          next: (result: any) => {

            this.teamMemberData.push(newMember)

            Swal.fire({
              icon: 'success',
              title: 'Team Member Added',
            });
          },
          error: (err: any) => {
            this.dialogRef.close();
            console.error('API error:', err);
            this.router.navigate(["/error/internal"]);

          },
          complete: () => {
            this.ngOnInit()
          }
        })

      }
    })
  }

  editMemberData(data: any, index: number) {

    const reference_id = this.defaults.referenceId
    const editMember = {
      teamMember: {
        id: data.userID,
        fullName: data.fullname,
        email: data.email
      },
      fullname: data.fullname,
      disclosure: data.disClosure,
      environmentThemes: data.environmentThemes || "",
      socialThemes: data.socialThemes || "",
      governanceThemes: data.governanceThemes || "",
      environmentRole: data.environmentRole || "",
      socialRole: data.socialRole || "",
      governanceRole: data.governanceRole || ""
    };
    this.dialog.open(ModifyTeamMemberComponent, {
      disableClose: true,
      data: editMember, width: "740px"
    }).afterClosed().subscribe((updatedData) => {

      if (updatedData) {


        this.formData = new FormData()
        this.formData.append('reference_id', JSON.stringify(reference_id))
        this.formData.append('updated_member_data', JSON.stringify(updatedData))
        this.formData.append('popUpID', JSON.stringify(data.popUpID))

        this.esgService.update_team_member(this.formData).subscribe({
          next: (result: any) => {

            if (result[0].code === 200) {
              if (index !== -1) {
                this.teamMemberData[index] = updatedData;
                Swal.fire({
                  icon: 'success',
                  title: 'Team Member updated',
                });
              }
            }
          },
          error: (err: any) => {
            this.dialogRef.close();
            console.error('API error:', err);
            this.router.navigate(["/error/internal"]);
          },
          complete: () => {
            this.ngOnInit()
          }
        })

      }
    })
  }

  viewMemberData(data: any, index: number) {
    const viewMember = {
      teamMember: {
        id: data.userID,
        fullName: data.fullname,
        email: data.email
      },
      fullname: data.fullname,
      disclosure: data.disClosure,
      environmentThemes: data.environmentThemes || "",
      socialThemes: data.socialThemes || "",
      governanceThemes: data.governanceThemes || "",
      environmentRole: data.environmentRole || "",
      socialRole: data.socialRole || "",
      governanceRole: data.governanceRole || ""
    };
    this.dialog.open(ViewTeamMemberComponent, { disableClose: true, data: viewMember, width: "740px" }).afterClosed().subscribe((updatedData) => { })
  }

  deleteMemberData(data: any, index: number) {


    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to remove this team member?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((option) => {
      if (option.isConfirmed) {
        const memberId = data.popUpID

        this.esgService.delete_team_member(memberId).subscribe({
          next: (result: any) => {

            this.teamMemberData.splice(this.teamMemberData.findIndex((entry) => entry.id === memberId), 1)

            if (result[0].code === 200) {
              Swal.fire(
                {
                  icon: 'success',
                  title: 'Team member Deleted Successfully',
                }

              );

            }
            this.ngOnInit()
          },
          error: (err: any) => {
            this.dialogRef.close();
            console.error('API error:', err);
            this.router.navigate(["/error/internal"]);
          },
          complete: () => {
          }
        })
      }
    })

  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    const data = {
      'form_value': this.Form.value,
      'team_member_data': this.teamMemberData,
      'selected divisions': this.selectedDivisions
    }
    this.dialogRef.close(data);
  }
}