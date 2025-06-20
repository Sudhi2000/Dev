import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { CreateMedicineNameComponent } from '../create-request/create-medicine-name/create-medicine-name.component';

@Component({
  selector: 'app-medicine-approval',
  templateUrl: './medicine-approval.component.html',
  styleUrls: ['./medicine-approval.component.scss']
})
export class MedicineApprovalComponent implements OnInit {

  Form: FormGroup
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  divisions: any[] = []
  medicineName: any[] = []
  zdhcCategory: any[] = []
  peopleList: any[] = []
  currency: string
  orgID: string
  requestedUnit: any[] = []
  dropdownValues: any[] = []
  requestedUnitVal: string
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
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
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private generalService: GeneralService,
    private medicineService: MedicineInventoryService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<MedicineApprovalComponent>) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      org_id: [''],
      id: [this.defaults.id],
      reference_number: [this.defaults.attributes.reference_number || ''],
      request_date: [this.defaults.attributes.request_date || ''],
      division: [this.defaults.attributes.division || ''],
      requested_quantity: [this.defaults.attributes.requested_quantity || ''],
      medicine_name: [this.defaults.attributes.medicine_name || ''],
      generic_name: [this.defaults.attributes.generic_name || ''],
      medicine_uuid: [this.defaults.attributes.medicine_uuid || ''],
      updated_By: [''],
      remarks: [''],
      status: [this.defaults.attributes.status || ''],
      reporter_id: [this.defaults.attributes.reporter.data.id || ''],
      purchase_executive: [null],
      business_unit: [this.defaults.attributes.business_unit.data?.id || ''],
      dosage_strength:[this.defaults.attributes.dosage_strength || ''],
      form:[this.defaults.attributes.form || ''],
      medicine_type:[this.defaults.attributes.medicine_type || '']
    });

    this.Form.disable()
    this.Form.controls['remarks'].enable()
    this.Form.controls['reference_number'].enable()
    this.Form.controls['status'].enable()
    this.Form.controls['id'].enable()
    this.Form.controls['request_date'].enable()
    this.Form.controls['purchase_executive'].enable()





  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health
        this.currency = result.data.attributes.currency       
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
        const status = result.med_inv_approval
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['updated_By'].setValue(result.profile.id)
          this.get_medicine_name()
          this.get_divisions()
          this.get_profiles()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  findUnit(data: any) {
    this.Form.controls['medicine_uuid'].setValue(data.attributes.uuid)
  }
  new_name() {
    this.dialog.open(CreateMedicineNameComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        this.medicineService.create_medicine(data, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.medicineService.get_medicine_name().subscribe({
              next: (result: any) => {
                this.medicineName = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Medicine name created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['medicine_name'].setValue(result.data.attributes.name)
                this.requestedUnitVal = result.data.attributes.unit

              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })
      }
    })
  }

  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        this.divisions = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_medicine_name() {
    this.medicineService.get_medicine_name().subscribe({
      next: (result: any) => {
        this.medicineName = result.data
      }
    })
  }


  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked === false);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
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

  action(data: any) {

    const status = data
    this.Form.controls['status'].setValue(data)
    this.Form.controls['id'].enable()
    if (status === "Approved") {
      if (this.Form.value.purchase_executive) {
        this.showProgressPopup();
        this.medicineService.update_approver_status(this.Form.value).subscribe({
          next: (result: any) => {
            this.create_inventory()
          },
          error: (err: any) => { },
          complete: () => { }
        })
      } else {

        Swal.fire({
          title: 'Purchase Executive',
          imageUrl: "assets/images/user.gif",
          imageWidth: 250,
          text: "Please select a purchase executive inorder to approve a medicine request.",
          showCancelButton: false,
        })

      }

    } else if (status === "Rejected") {
      Swal.fire({
        title: 'Are you sure?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "You are trying to reject one of the medicine request. If sure, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showProgressPopup();
          this.medicineService.update_approver_status(this.Form.value).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              this.rejected()
            }
          })



        }
      })

    }
  }



  create_inventory() {
    this.Form.enable()
    this.medicineService.create_medicine_inventory(this.Form.value).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => { },
      complete: () => {
        this.create_notification()
      }
    })
  }

  create_notification() {
    let data: any[] = []
    data.push({
      module: "Medicine Inventory",
      action: 'Approve Medicine Request:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.approver,
      access_link: "/apps/occupational-health/medicine-inventory/purchase-inventory/" + this.Form.value.id,
      profile: this.Form.value.updated_By
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Medicine Request Approved',
          imageUrl: "assets/images/patient-record.gif",
          imageWidth: 250,
          text: "You have successfully approved the medicine request and submited for purchase and inventory.",
          showCancelButton: false,
        }).then((result) => {
          this.router.navigate(["/apps/occupational-health/medicine-inventory/assigned-task"])
        })
        this.dialogRef.close(this.Form.value.status)
      }
    })
  }
  rejected() {

    Swal.close()
    const statusText = "Medicine Request Rejected"
    this._snackBar.open(statusText, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
    this.router.navigate(["/apps/occupational-health/medicine-inventory/assigned-task"])
    this.dialogRef.close(this.Form.value.status)

  }
}
