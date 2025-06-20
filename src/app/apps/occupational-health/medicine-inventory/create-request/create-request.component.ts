import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { CreateMedicineNameComponent } from './create-medicine-name/create-medicine-name.component';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent implements OnInit {

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
  medicineId: any
  dropdownValues: any[] = []
  requestedUnitVal: string
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Division = new FormControl(null, [Validators.required]);
  userDivision: any
  corporateUser: any
  unitSpecific: any
  constructor(private generalService: GeneralService,
    private medicineService: MedicineInventoryService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateRequestComponent>) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      org_id: [''],
      id: [''],
      reference_number: [''],
      division: ['', [Validators.required]],
      reported_date: [new Date()],
      requested_quantity: ['', [Validators.required]],
      medicine_name: ['', [Validators.required]],
      generic_name: ['', [Validators.required]],
      status: ['Open', [Validators.required]],
      medicine_uuid: [null, [Validators.required]],
      reporter: [null],
      business_unit: [null],
      approver: [null, [Validators.required]],
      dosage_strength: [''],
      form: [''],
      medicine_type: ['']
    });
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health
        this.currency = result.data.attributes.currency
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
        const status = result.med_request
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_medicine_name()
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions()
              this.get_profiles()

            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_profiles()

            }
          } else {
            this.get_divisions()
            this.get_profiles()

          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  // findUnit(data: any) {


  //   this.Form.controls['medicine_uuid'].setValue(data.attributes.uuid)


  // }


  onCommercialNameSelected(selectedName: any) {
    const selectedOption = this.medicineName.find(data => data.attributes.name === selectedName?.attributes?.name);


    this.medicineId = selectedOption?.attributes?.uuid
    this.Form.controls['medicine_uuid'].setValue(this.medicineId)

    if (selectedOption) {


      this.Form.patchValue({
        medicine_name: selectedOption,
        generic_name: selectedOption.attributes.generic_name,
        dosage_strength: selectedOption.attributes.dosage_strength,
        form: selectedOption.attributes.form,
        medicine_type: selectedOption.attributes.medicine_type,
      });

    }


  }


  new_name() {
    this.dialog.open(CreateMedicineNameComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        this.Form.patchValue({
          // medicine_name: data.name,
          generic_name: data.generic_name,

        })

        this.Form.controls['dosage_strength'].setValue(data.dosage_strength)
        this.Form.controls['form'].setValue(data.form)
        this.Form.controls['medicine_type'].setValue(data.medicine_type)

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
                const statusText = "New Medicine created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                const selected = this.medicineName.find(
                  (item: any) => item.attributes.name === data.name
                );

                this.Form.controls['medicine_name'].setValue(selected);
                this.Form.controls['medicine_uuid'].setValue(selected.attributes.uuid);

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
  BusinessUnit(event: any) {
    this.Form.controls['division'].setValue(event.value.division_name)
    this.Form.controls['business_unit'].setValue(event.value.id)
  }
  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
        }));

        this.divisions = newArray;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  get_medicine_name() {
    this.medicineService.get_medicine_name().subscribe({
      next: (result: any) => {
        this.medicineName = result.data

      }
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
  get_profiles() {
    this.medicineService.get_med_req_approvers(this.orgID).subscribe({
      next: (result: any) => {


        // const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked===false);
        this.peopleList = result.data;


      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
  get_unit_specific_profiles() {
    this.medicineService.get_unit_specific_med_req_approvers(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {


        // const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked===false);
        this.peopleList = result.data;


      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }


  complete() {
    //this.Form.controls['status'].setValue('Open')
    this.submit()
  }

  draft() {
    //this.Form.controls['status'].setValue('Draft')
    this.submit()
  }

  submit() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showProgressPopup();
        this.create_reference_number()
      }
    })
  }

  create_reference_number() {
    this.medicineService.get_medicine_request_count().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = 'MED-' + newCount
        this.Form.controls['reference_number'].setValue(reference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_request()
      }
    })
  }

  create_request() {


    this.medicineService.create_request(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['reference_number'].setValue(result.data.attributes.reference_number)
        this.Form.controls['id'].setValue(result.data.id)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_notification()
      }
    })
  }

  create_notification() {
    //const status = this.Form.value.status
    let data: any[] = []
    data.push({
      module: "Medicine Inventory",
      action: 'New Medicine Request:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.approver,
      access_link: "/apps/occupational-health/medicine-inventory/approve/" + this.Form.value.id,
      profile: this.Form.value.reporter
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'New Medicine Request',
          imageUrl: "assets/images/patient-record.gif",
          imageWidth: 250,
          text: "Your Medicine request has been successfully created and submitted for approval.",
          showCancelButton: false,
        }).then((result) => {
          this.router.navigate(["/apps/occupational-health/medicine-inventory/request-history"])
        })
        this.dialogRef.close()
      }
    })
  }

  update_medicineName(ID: any) {
    this.dialog.open(CreateMedicineNameComponent, { data: ID }).afterClosed().subscribe((data: any) => {
      if (data) {
        this.medicineService.update_medicine_name(data).subscribe({
          next: (result: any) => {


            this.medicineService.get_medicine_name().subscribe({
              next: (result: any) => {
                this.medicineName = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Medicine name updated successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                const selected = this.medicineName.find(
                  (item: any) => item.attributes.name === data.name
                );


                this.Form.controls['medicine_name'].setValue(selected);
                this.Form.controls['generic_name'].setValue(selected.attributes.
                  generic_name);


                this.onCommercialNameSelected(result.data)
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

  delete_medicineName(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the medicine name.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicineService.delete_medicine_name(id).subscribe({
          next: (result: any) => {
            this.Form.controls.medicine_name.reset()
          },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Medicine name deleted"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_medicine_name()
          }
        })
      }
    })
  }
}
