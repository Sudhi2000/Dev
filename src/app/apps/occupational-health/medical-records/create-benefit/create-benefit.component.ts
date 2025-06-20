import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { AuthService } from 'src/app/services/auth.api.service';
import { AddEntitlementComponent } from './add-entitlement/add-entitlement.component';
import { MatDialog } from '@angular/material/dialog';
import { AddDocumentComponent } from './add-document/add-document.component';
import Swal from 'sweetalert2';
import { MaternityRegisterService } from 'src/app/services/maternity-register.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-create-benefit',
  templateUrl: './create-benefit.component.html',
  styleUrls: ['./create-benefit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateBenefitComponent implements OnInit {
  Form: FormGroup;
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5;
  BenefitsList: any[] = [];
  DocumentList: any[] = [];
  leaveStatusList: any[] = [];
  documentFormData = new FormData();

  dateOfJoin = new FormControl(null, [Validators.required]);
  applicaionDate = new FormControl(null, [Validators.required]);
  expectedDeliveryDate = new FormControl(null, [Validators.required]);
  leaveStartDate = new FormControl(null, [Validators.required]);
  leaveEndtDate = new FormControl(null, [Validators.required]);
  actualDeliveryDate = new FormControl(null, [Validators.required]);
  noticeDate = new FormControl(null, [Validators.required]);
  rejoiningDate = new FormControl(null, [Validators.required]);
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
  documentName: any;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  divisions: any[] = [];
  orgID: string;
  unitSpecific: any



  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private maternityService: MaternityRegisterService,
    private generalService: GeneralService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      id: [''],
      employee_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      age: [null],
      contact_number: [null],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      supervisor_manager: [''],
      date_of_join: [null, [Validators.required]],
      average_wages: [null],
      application_id: ['', [Validators.required]],
      application_date: [null, [Validators.required]],
      expected_delivery_date: [null, [Validators.required]],
      leave_start_date: [null, [Validators.required]],
      leave_end_date: [null, [Validators.required]],
      actual_delivery_date: [null, [Validators.required]],
      leave_status: ['', [Validators.required]],
      notice_date_after_delivery: [null, [Validators.required]],
      rejoining_date: [null, [Validators.required]],
      support_provided: [''],
      signature: [''],
      remarks: [''],
      status: ['Open'],
      created_date: [new Date(), [Validators.required]],
      division: ['', [Validators.required]]

    });

    this.configuration();

    this.Form.get('date_of_join')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-01T00:00:00.000Z") {
        this.Form.controls['date_of_join'].setValue(null)
      }
    });
    this.Form.get('application_date')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-01T00:00:00.000Z") {
        this.Form.controls['application_date'].setValue(null)
      }
    });
    this.Form.get('expected_delivery_date')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-01T00:00:00.000Z") {
        this.Form.controls['expected_delivery_date'].setValue(null)
      }
    });
    this.Form.get('leave_start_date')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-01T00:00:00.000Z") {
        this.Form.controls['leave_start_date'].setValue(null)
      }
    });
    this.Form.get('leave_end_date')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-01T00:00:00.000Z") {
        this.Form.controls['leave_end_date'].setValue(null)
      }
    });
    this.Form.get('actual_delivery_date')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-01T00:00:00.000Z") {
        this.Form.controls['actual_delivery_date'].setValue(null)
      }
    });
    this.Form.get('notice_date_after_delivery')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-01T00:00:00.000Z") {
        this.Form.controls['notice_date_after_delivery'].setValue(null)
      }
    });
    this.Form.get('rejoining_date')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-01T00:00:00.000Z") {
        this.Form.controls['rejoining_date'].setValue(null)
      }
    });

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.occupational_health
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
            }
          }
          this.dropdownValues();
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  dropdownValues() {
    const module = "Occupational Health"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        const status = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Leave Status")
        })
        this.leaveStatusList = status
      },
      error: (err: any) => { },
      complete: () => {
        this.get_divisions();
      }

    })
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

  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  joinDateVal(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['date_of_join'].setValue(selectedDate)
  }

  applicationDateVal(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['application_date'].setValue(selectedDate)
  }

  expectedDeliveryDateVal(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['expected_delivery_date'].setValue(selectedDate)
  }

  leaveStartDateVal(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['leave_start_date'].setValue(selectedDate)
  }

  leaveEndDateVal(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['leave_end_date'].setValue(selectedDate)
  }

  actualDeliveryDateVal(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['actual_delivery_date'].setValue(selectedDate)
  }

  noticeDateVal(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['notice_date_after_delivery'].setValue(selectedDate)
  }

  rejoiningDateVal(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['rejoining_date'].setValue(selectedDate)
  }

  addBenefits_Entitlements() {
    this.dialog
      .open(AddEntitlementComponent)
      .afterClosed()
      .subscribe((data: any) => {
        if (data) {
          this.BenefitsList.push(data);
        }
      });
  }

  deleteBenefits(benefitData: any) {
    this.BenefitsList.splice(
      this.BenefitsList.findIndex(
        (data) => data.id === benefitData.id
      ),
      1
    );
  }

  modifyBenefits(benefitData: any) {
    this.dialog
      .open(AddEntitlementComponent, {
        data: benefitData,
      })
      .afterClosed()
      .subscribe((dataB) => {
        if (dataB) {
          this.BenefitsList.splice(
            this.BenefitsList.findIndex(
              (data) => data.id === dataB.id
            ),
            1
          );
          this.BenefitsList.push(dataB);
        }
      });
  }

  addMedical_documents() {
    this.dialog
      .open(AddDocumentComponent)
      .afterClosed()
      .subscribe((data: any) => {
        if (data) {
          // this.documentName = docData?.files[0].name;
          this.DocumentList.push({
            id: data.id,
            document_type: data?.document_type,
            upload_date: data.upload_date,
            files: data?.files?.length > 0 ? data?.files : [],
            document_name: data?.files?.length > 0 ? data?.files[0].name : '',
          })

        }
      });
  }

  deleteDocument(dataDoc: any) {
    this.DocumentList.splice(
      this.DocumentList.findIndex(
        (data) => data.id === dataDoc.id
      ),
      1
    );
  }

  modifyDocument(docData: any) {
    this.dialog
      .open(AddDocumentComponent, {
        data: docData,
      })
      .afterClosed()
      .subscribe((dataDoc) => {
        if (dataDoc) {
          this.DocumentList.splice(
            this.DocumentList.findIndex(
              (data) => data.id === dataDoc.id
            ),
            1
          );
          this.DocumentList.push({
            id: dataDoc.id,
            document_type: dataDoc?.document_type,
            upload_date: dataDoc.upload_date,
            files: dataDoc?.files?.length > 0 ? dataDoc?.files : [],
            document_name: dataDoc?.files?.length > 0 ? dataDoc?.files[0].name : '',
          })

        }
      });
  }

  saveAsDraft() {
    this.Form.controls['status'].setValue('Draft')
    this.showProgressPopup();
    this.maternityService.create_maternityRecord_draft(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id);
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        // this.create_entitlement();
        this.uploadDocumentDraft();

      },
    });
  }

  submit() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.Form.controls['status'].setValue('Scheduled')
        this.showProgressPopup();
        this.create_maternityRecord();
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
      },
    });
  }

  create_maternityRecord() {
    this.Form.controls['status'].setValue('Completed')
    this.maternityService.create_maternityRecord(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id);
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {

        this.uploadDocument();
      },
    });
  }

  create_entitlement() {
    if (this.BenefitsList.length > 0) {
      this.BenefitsList.forEach((elem) => {
        this.maternityService.create_entitlement(elem, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(['/error/internal']);
          },
          complete: () => {
            Swal.fire({
              title: 'Benefit Request Reported',
              imageUrl: "assets/images/reported.gif",
              imageWidth: 250,
              text: "You have successfully created a Benefit Request.",
              showCancelButton: false,

            })
            if (this.Form.value.status == "Draft") {
              this.router.navigate(["apps/occupational-health/medical-records/update-benefit/" + this.Form.value.id])
            }
            else {
              this.router.navigate(["/apps/occupational-health/medical-records/register"])
            }

          },
        });
      });
    }
    else {
      Swal.fire({
        title: 'Benefit Request Reported',
        imageUrl: "assets/images/reported.gif",
        imageWidth: 250,
        text: "You have successfully created a Benefit Request.",
        showCancelButton: false,

      })
      if (this.Form.value.status == "Draft") {
        this.router.navigate(["apps/occupational-health/medical-records/update-benefit/" + this.Form.value.id])
      }
      else {
        this.router.navigate(["/apps/occupational-health/medical-records/register"])
      }
    }

  }

  uploadDocument() {
    if (this.DocumentList.length > 0) {
      this.DocumentList.forEach((docData: any) => {
        if (docData?.files && docData?.files.length > 0) {
          docData?.files.forEach((elem: any) => {
            this.documentFormData.delete('files');
            const extension = elem.name.split('.').pop().toLowerCase();
            this.documentFormData.append(
              'files',
              elem,
              docData?.document_type + '.' + extension
            );

            this.generalService.upload(this.documentFormData).subscribe({
              next: (result: any) => {
                let data: any[] = [];
                data.push({
                  document_type: docData?.document_type,
                  upload_date: docData?.upload_date,
                  document_id: result[0].id,
                  document_name: result[0].hash,
                  format: extension,
                  id: this.Form.value.id,
                });
                this.maternityService.create_document(data[0]).subscribe({
                  next: (result: any) => { },
                  error: (err: any) => { },
                  complete: () => { },
                });
              },
              error: (err: any) => { },
              complete: () => {
                Swal.close();
              },
            });
          });
        } else {
          // this.DocumentList.forEach((elam: any) => {
          let data: any[] = [];
          data.push({
            document_type: docData?.document_type,
            upload_date: docData.upload_date,
            // document_id: result[0].id,
            // document_name: result[0].hash,
            // format: extension,
            id: this.Form.value.id,
          });
          this.maternityService.create_document(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => { },
          });
          // })

        }
      })

      this.create_entitlement();

    }
    else {
      this.create_entitlement();
    }
  }

  create_entitlementDraft() {
    if (this.BenefitsList.length > 0) {
      this.BenefitsList.forEach((elem) => {
        this.maternityService.create_entitlement(elem, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(['/error/internal']);
          },
          complete: () => {
            // Swal.fire({
            //   title: 'Benefit Request Reported',
            //   imageUrl: "assets/images/reported.gif",
            //   imageWidth: 250,
            //   text: "You have successfully created a Benefit Request.",
            //   showCancelButton: false,

            // })
            Swal.close();
            const statusText = "Benefit Request Reported"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });

            if (this.Form.value.status == "Draft") {
              this.router.navigate(["apps/occupational-health/medical-records/update-benefit/" + this.Form.value.id])
            }
            else {
              this.router.navigate(["/apps/occupational-health/medical-records/register"])
            }

          },
        });
      });
    }
    else {
      Swal.close();
      const statusText = "Benefit Request Reported"
      this._snackBar.open(statusText, 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      if (this.Form.value.status == "Draft") {
        this.router.navigate(["apps/occupational-health/medical-records/update-benefit/" + this.Form.value.id])
      }
      else {
        this.router.navigate(["/apps/occupational-health/medical-records/register"])
      }
    }

  }

  uploadDocumentDraft() {
    if (this.DocumentList.length > 0) {
      this.DocumentList.forEach((docData: any) => {
        if (docData?.files && docData?.files.length > 0) {
          docData?.files.forEach((elem: any) => {
            this.documentFormData.delete('files');
            const extension = elem.name.split('.').pop().toLowerCase();
            this.documentFormData.append(
              'files',
              elem,
              docData?.document_type + '.' + extension
            );

            this.generalService.upload(this.documentFormData).subscribe({
              next: (result: any) => {
                let data: any[] = [];
                data.push({
                  document_type: docData?.document_type,
                  upload_date: docData?.upload_date,
                  document_id: result[0].id,
                  document_name: result[0].hash,
                  format: extension,
                  id: this.Form.value.id,
                });
                this.maternityService.create_document(data[0]).subscribe({
                  next: (result: any) => { },
                  error: (err: any) => { },
                  complete: () => { },
                });
              },
              error: (err: any) => { },
              complete: () => {
                Swal.close();
              },
            });
          });
        } else {
          // this.DocumentList.forEach((elam: any) => {
          let data: any[] = [];
          data.push({
            document_type: docData?.document_type,
            upload_date: docData.upload_date,
            // document_id: result[0].id,
            // document_name: result[0].hash,
            // format: extension,
            id: this.Form.value.id,
          });
          this.maternityService.create_document(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => { },
          });
          // })

        }
      })

      this.create_entitlementDraft();

    }
    else {
      this.create_entitlementDraft();
    }
  }

}
