import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { consumption } from 'src/app/services/schemas';
import { GeneralService } from '../../../../services/general.api.service'
import { AuthService } from 'src/app/services/auth.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ViewActionConsumptionComponent } from './view-consumption/view-consumption.component';
import { RejectReasonComponent } from './reject-reason/reject-reason.component';
import { log } from 'console';
import { Location } from '@angular/common';
@Component({
  selector: 'app-environment-action',
  templateUrl: './environment-action.component.html',
  styleUrls: ['./environment-action.component.scss']
})
export class EnvironmentActionComponent implements OnInit {
  Form: FormGroup
  consumptions: any[] = []
  years: any[] = []
  peopleList: any[] = []
  divisions: any[] = []
  orgID: any
  DivisionFilteredpeopleList: any[] = [];
  evidenceFormData = new FormData()
  conCategory: any[] = []
  delConCategory: any[] = []
  consumption_category: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  userID: number
  userDivision: any
  corporateUser: any
  unitSpecific: any
  divisionUuids: any[] = []
  backToHistory: Boolean = false
  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private generalService: GeneralService,
    private authService: AuthService,
    private router: Router,
    private environmentService: EnvironmentService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar, private _location: Location) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      division: ['', [Validators.required]],
      work_force: ['', [Validators.required]],
      days_worked: ['', [Validators.required]],
      product_produced_kg: [null],
      product_produced_pieces: ['', [Validators.required]],
      area: [null],
      year: [null, [Validators.required]],
      month: ['', [Validators.required]],
      reviewer: [null, [Validators.required]],
      modified_date: [new Date()],
      created_user: [''],
      updated_user: [''],
      reference_number: [''],
      status: ['Draft'],
      reviewer_notification: [null],
      pending_consumption: [''],
      pending_percentage: [null],
      pending_color_code: [''],
      reviewer_id: [''],
      approver: [null, [Validators.required]],
      reported_date: [''],
      approver_id: ['']
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.years = result.data.attributes.Year
        const status = result.data.attributes.modules.environment
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
              this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
            }
          }
          this.me()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.Form.controls['updated_user'].setValue(result.id)
        this.userID = result.profile.id
        const status = result.env_modify
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_profiles()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisionUuids.push(elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_profiles()

            }
          } else {
            this.get_profiles()
          }
          this.get_division()
          this.get_env_details()
          this.get_dropdown_values()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_dropdown_values() {
    const module = "Environment"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        const data = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Consumption Category")
        })
        this.consumption_category = data
      },
      error: (err: any) => { },
      complete: () => {
      }
    })
  }

  get_division() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        this.divisions = result.data
      },
      error: (errL: any) => { },
      complete: () => { }
    })
  }

  get_profiles() {
    this.environmentService.get_env_approvers().subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }
  get_unit_specific_profiles() {
    this.environmentService.get_unit_specific_env_approvers(this.userDivision).subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  get_env_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.environmentService.get_env_details(reference).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if ((result.data[0].attributes.status === "Approved") || (!matchFound || matchFound !== true)) {

          this.router.navigate(["/apps/environment/assigned"])
        }
        else if (result.data[0].attributes.status === "Under review") {
          if (result.data[0].attributes.reviewer.data.id !== this.userID) {
            this.router.navigate(["/error/unauthorized"])
          }
        }
        else if (result.data[0].attributes.status === "Reviewed") {
          if (result.data[0].attributes.approver.data.id !== this.userID) {
            this.router.navigate(["/error/unauthorized"])
          }
        }
        this.Form.controls['id'].setValue(result.data[0].id)
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.Form.controls['status'].setValue(result.data[0].attributes.status)
        this.Form.controls['division'].setValue(result.data[0].attributes.division)
        this.Form.controls['work_force'].setValue(result.data[0].attributes.work_force)
        this.Form.controls['days_worked'].setValue(result.data[0].attributes.days_worked)
        this.Form.controls['product_produced_kg'].setValue(result.data[0].attributes.product_produced_kg)
        this.Form.controls['product_produced_pieces'].setValue(result.data[0].attributes.product_produced_pieces)
        this.Form.controls['area'].setValue(result.data[0].attributes.area)
        this.Form.controls['year'].setValue(result.data[0].attributes.year)
        this.Form.controls['month'].setValue(result.data[0].attributes.month)
        this.Form.controls['reviewer'].setValue(result.data[0].attributes.reviewer.data.attributes.first_name + ' ' + result.data[0].attributes.reviewer.data.attributes.last_name)
        this.Form.controls['reviewer_id'].setValue(result.data[0].attributes.reviewer.data.id)
        this.Form.controls['approver_id'].setValue(result.data[0].attributes?.approver?.data?.id)
        this.consumptions = result.data[0].attributes.consumptions.data

        this.Form.controls['pending_consumption'].setValue(result.data[0].attributes.pending_consumption)
        this.Form.controls['pending_percentage'].setValue(result.data[0].attributes.pending_percentage)
        this.Form.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
        this.Form.controls['created_user'].setValue(result.data[0].attributes.created_user.data.id)
        this.initialFilteredReviewer(result.data[0].attributes.business_unit.data?.attributes.division_uuid)
        this.conCategory = result.data[0].attributes.pending_consumption
        const catdata = "" + this.conCategory + ""
        var catVal = catdata
        var str_array = catVal.split(',');
        let cData: any[] = []
        str_array.forEach(elem => {
          cData.push(elem)
        })
        this.delConCategory = cData
        this.Form.disable()
        this.Form.controls['reference_number'].enable()
        this.Form.controls['reported_date'].enable()
        this.Form.controls['status'].enable()
        this.Form.controls['id'].enable()
        this.Form.controls['created_user'].enable()
        this.Form.controls['reviewer_id'].enable()
        this.Form.controls['approver_id'].enable()
        if (result.data[0].attributes.status === "Under review") {
          this.Form.controls['approver'].enable()
        } else if (result.data[0].attributes.status === "Reviewed") {
          this.Form.controls['approver'].disable()
        }
      },
      error: (err: any) => { },
      complete: () => {
      }
    })
  }

  initialFilteredReviewer(data: string): void {
    const selectedBusinessUnitUuid = data
    this.DivisionFilteredpeopleList = this.peopleList.filter((data) =>
      data.attributes.divisions.data
        .map((division: any) => division.attributes.division_uuid)
        .includes(selectedBusinessUnitUuid)
    );
  }

  viewConsumption(data: any) {
    this.dialog.open(ViewActionConsumptionComponent, {
      data: data
    })
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
  approve() {
    const status = this.Form.value.status
    if (status === "Under review") {
      if (this.Form.value.approver) {
        this.showProgressPopup();
        this.environmentService.review_environment(this.Form.value).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const status = "Reviewed"
            this.create_notification(status)
          }
        })
      } else {
        Swal.fire({
          title: 'Approver Required',
          imageUrl: "assets/images/confirm.gif",
          imageWidth: 250,
          text: "Please choose an user from approver dropdown.",
          showCancelButton: false,
        })
      }
    } else if (status === "Reviewed") {
      this.showProgressPopup();
      this.environmentService.approve_environment(this.Form.value).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const status = "Approved"
          this.create_notification(status)
        }
      })
    }
  }

  reject() {

    const status = this.Form.value.status
    if (status === "Under review") {
      this.dialog.open(RejectReasonComponent).afterClosed().subscribe((reason) => {
        this.showProgressPopup();
        this.environmentService.reject_environment(this.Form.value, reason).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const status = "Rejected"
            this.create_notification(status)
          }
        })
      });
    } else if (status === "Reviewed") {
      this.dialog.open(RejectReasonComponent).afterClosed().subscribe((reason) => {
        this.showProgressPopup();
        this.environmentService.reject_approver_environment(this.Form.value, reason).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const status = "Approver Rejected"
            this.create_notification(status)
          }
        })
      });
    }
  }

  create_notification(status: any) {
    if (status === "Reviewed") {
      let data: any[] = []
      data.push({
        module: "Environment",
        action: 'Consumption entry reviewed:',
        reference_number: this.Form.value.reference_number,
        userID: this.Form.value.created_user,
        access_link: "/apps/environment/consumption/view/",
        profile: this.Form.value.reviewer_id
      })
      this.generalService.create_notification(data[0]).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          let data: any[] = []
          data.push({
            module: "Environment",
            action: 'Consumption approval required:',
            reference_number: this.Form.value.reference_number,
            userID: this.Form.value.approver,
            access_link: "/apps/environment/assigned/action/",
            profile: this.Form.value.reviewer_id
          })
          this.generalService.create_notification(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              Swal.fire({
                title: 'Review Completed',
                imageUrl: "assets/images/confirm.gif",
                imageWidth: 250,
                text: "You have successfully reviewed the consumption details. We will notify the approver to take further action.",
                showCancelButton: false,
              }).then((result) => {
                this.router.navigate(["/apps/environment/assigned"])
              })
            }
          })
        }
      })
    } else if (status === "Rejected") {
      let data: any[] = []
      data.push({
        module: "Environment",
        action: 'Consumption entry rejected:',
        reference_number: this.Form.value.reference_number,
        userID: this.Form.value.created_user,
        access_link: "/apps/environment/assigned/action/",
        profile: this.Form.value.reviewer_id
      })
      this.generalService.create_notification(data[0]).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          Swal.fire({
            title: 'Consumption Rejected',
            imageUrl: "assets/images/confirm.gif",
            imageWidth: 250,
            text: "You have successfully rejected the consumption details. We will notify the user to take further action.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/environment/assigned"])
          })
        }
      })
    } else if (status === "Approver Rejected") {
      let data: any[] = []
      data.push({
        module: "Environment",
        action: 'Consumption entry rejected:',
        reference_number: this.Form.value.reference_number,
        userID: this.Form.value.created_user,
        access_link: "/apps/environment/consumption/view/",
        profile: this.Form.value.approver_id
      })
      this.generalService.create_notification(data[0]).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          let data: any[] = []
          data.push({
            module: "Environment",
            action: 'Consumption entry rejected:',
            reference_number: this.Form.value.reference_number,
            userID: this.Form.value.reviewer_id,
            access_link: "/apps/environment/consumption/view/",
            profile: this.Form.value.approver_id
          })
          this.generalService.create_notification(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              Swal.fire({
                title: 'Consumption Rejected',
                imageUrl: "assets/images/confirm.gif",
                imageWidth: 250,
                text: "You have successfully rejected the consumption details. We will notify the user to take further action.",
                showCancelButton: false,
              }).then((result) => {
                this.router.navigate(["/apps/environment/assigned"])
              })
            }
          })
        }
      })

    } else if (status === "Approved") {
      let data: any[] = []
      data.push({
        module: "Environment",
        action: 'Consumption entry approved:',
        reference_number: this.Form.value.reference_number,
        userID: this.Form.value.created_user,
        access_link: "/apps/environment/consumption/view/",
        profile: this.Form.value.approver_id
      })
      this.generalService.create_notification(data[0]).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          let data: any[] = []
          data.push({
            module: "Environment",
            action: 'Consumption entry approved:',
            reference_number: this.Form.value.reference_number,
            userID: this.Form.value.reviewer_id,
            access_link: "/apps/environment/consumption/view/",
            profile: this.Form.value.approver_id
          })
          this.generalService.create_notification(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              Swal.fire({
                title: 'Consumption Approved',
                imageUrl: "assets/images/confirm.gif",
                imageWidth: 250,
                text: "You have successfully approved the consumption details.",
                showCancelButton: false,
              }).then((result) => {
                this.router.navigate(["/apps/environment/assigned"])
              })
            }
          })
        }
      })
    }
  }
  navigate() {
    this.backToHistory = true
    this._location.back();
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
