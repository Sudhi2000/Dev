import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { consumption } from 'src/app/services/schemas';
import { GeneralService } from '../../../services/general.api.service'
import { AuthService } from 'src/app/services/auth.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ViewOnlyConsumptionComponent } from './view-consumption/view-consumption.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-view-environment-details',
  templateUrl: './view-environment-details.component.html',
  styleUrls: ['./view-environment-details.component.scss']
})
export class ViewEnvironmentDetailsComponent implements OnInit {
  Form: FormGroup
  consumptions: any[] = []
  years: any[] = []
  peopleList: any[] = []
  divisions: any[] = []
  orgID: any
  evidenceFormData = new FormData()
  conCategory: any[] = []
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
  delConCategory: any[] = []
  consumption_category: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  backToHistory: Boolean = false
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
      reject_reason: [''],
      approver_reject_reson: ['']
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
        const status = result.env_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisionUuids.push(elem.division_uuid)
              })
            }
          }
          this.get_profiles()
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

  //get profiles
  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        this.peopleList = result.data
      },
      error: (err: any) => {
      },
      complete: () => { }
    })
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
        if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/environment/history"])
        }
        else {
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
          this.consumptions = result.data[0].attributes.consumptions.data
          this.Form.controls['pending_consumption'].setValue(result.data[0].attributes.pending_consumption)
          this.Form.controls['pending_percentage'].setValue(result.data[0].attributes.pending_percentage)
          this.Form.controls['reject_reason'].setValue(result.data[0].attributes.reject_reason)
          this.Form.controls['approver_reject_reson'].setValue(result.data[0].attributes.approver_reject_reason)
          this.Form.controls['created_user'].setValue(result.data[0].attributes.created_user.data.id)
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
        }
      },
      error: (err: any) => { },
      complete: () => {
      }
    })
  }

  saveAsDraft() {
    this.environmentService.update_environment(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Consumption details saved"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.get_env_details()
      }
    })
  }


  submit() {
    this.Form.controls['status'].setValue('Open')
    this.Form.controls['reviewer_notification'].setValue(false)
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.update_environment()
      }
    })
  }

  update_environment() {
    this.environmentService.update_environment(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.create_notification()
      }
    })
  }

  create_notification() {
    let data: any[] = []
    data.push({
      module: "Environment",
      action: 'Review on Consumption Data:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.reviewer,
      access_link: "/apps/environment/action/",
      profile: this.Form.value.created_user
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Consumption Added',
          imageUrl: "assets/images/confirm.gif",
          imageWidth: 250,
          text: "You have successfully added the consumption details. We will notify the reviewer to take further action.",
          showCancelButton: false,
        }).then((result) => {
          this.router.navigate(["/apps/environment/history"])
        })
      }
    })
  }

  deleteConsumption(data: any) {
    this.delConCategory = this.delConCategory || [];
    const category = data.attributes.consumption_category
    this.delConCategory.push(category)
    const total = Number(this.consumption_category.length)
    const count = Number(this.delConCategory.length)
    const percentage = Number(Number(count) / Number(total) * 100).toFixed(0)
    const completed = Number(100) - Number(percentage)

    if (completed <= 20) {
      this.Form.controls['pending_color_code'].setValue("danger")
    } else if (completed <= 40) {
      this.Form.controls['pending_color_code'].setValue("warning")
    } else if (completed <= 60) {
      this.Form.controls['pending_color_code'].setValue("info")
    } else if (completed <= 80) {
      this.Form.controls['pending_color_code'].setValue("primary")
    } else if (completed <= 100) {
      this.Form.controls['pending_color_code'].setValue("success")
    }
    this.Form.controls['pending_consumption'].setValue(this.delConCategory.toString())
    this.Form.controls['pending_percentage'].setValue(completed)
    this.environmentService.update_pen_con_per(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => { }
    })

    if (data.attributes.evidence.data === null) {
      this.environmentService.delete_consumption(data.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.get_env_details()
        }
      })
    } else {
      this.generalService.delete_image(data.attributes.evidence.data.attributes.image_id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.environmentService.delete_consumption(data.id).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              this.get_env_details()
            }
          })
        }
      })
    }
  }

  viewConsumption(data: any) {
    this.dialog.open(ViewOnlyConsumptionComponent, {
      data: data
    })
  }

  close() {
    this.router.navigate(["/apps/environment/history"])
  }
  print() {
    document.getElementById('env_report')?.classList.add("hide");
    document.getElementById('env_report_loader')?.classList.remove("hide")
    const envID = this.Form.value.id
    this.environmentService.env_con_report(envID).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      window.open(url)
      document.getElementById('env_report')?.classList.remove("hide");
      document.getElementById('env_report_loader')?.classList.add("hide")
    })

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
