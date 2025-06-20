import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { AuthService } from 'src/app/services/auth.api.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MaternityRegisterService } from 'src/app/services/maternity-register.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { UpdateDocumentComponent } from './update-document/update-document.component';
import { UpdateEntitlementComponent } from './update-entitlement/update-entitlement.component';
import { environment } from 'src/environments/environment';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ViewDocumentComponent } from '../benefit-view/view-document/view-document.component';
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
  selector: 'app-benefit-modify',
  templateUrl: './benefit-modify.component.html',
  styleUrls: ['./benefit-modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class BenefitModifyComponent implements OnInit {
  Form: FormGroup;
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5;
  BenefitsList: any[] = [];
  DocumentList: any[] = [];
  documentFormData = new FormData();

  dateOfJoin = new FormControl(null, [Validators.required]);
  applicaionDate = new FormControl(null, [Validators.required]);
  expectedDeliveryDate = new FormControl(null, [Validators.required]);
  leaveStartDate = new FormControl(null, [Validators.required]);
  leaveEndtDate = new FormControl(null, [Validators.required]);
  actualDeliveryDate = new FormControl(null, [Validators.required]);
  noticeDate = new FormControl(null, [Validators.required]);
  rejoiningDate = new FormControl(null, [Validators.required]);

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
  files: any[] = [];
  leaveStatusList: any[] = [];
  divisions: any[] = [];
  orgID: any;
  unitSpecific: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private maternityService: MaternityRegisterService,
    private generalService: GeneralService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      id: [''],
      status: [''],
      created_date: [new Date(), [Validators.required]],
      employee_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      age: [],
      contact_number: [],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      supervisor_manager: [''],
      date_of_join: [null, [Validators.required]],
      average_wages: [],
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
      division: ['', [Validators.required]]

    });

    this.configuration();

    this.Form.get('date_of_join')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-02T00:00:00.000Z") {
        this.Form.controls['date_of_join'].setValue(null)
      }
    });
    this.Form.get('application_date')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-02T00:00:00.000Z") {
        this.Form.controls['application_date'].setValue(null)
      }
    });
    this.Form.get('expected_delivery_date')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-02T00:00:00.000Z") {
        this.Form.controls['expected_delivery_date'].setValue(null)
      }
    });
    this.Form.get('leave_start_date')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-02T00:00:00.000Z") {
        this.Form.controls['leave_start_date'].setValue(null)
      }
    });
    this.Form.get('leave_end_date')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-02T00:00:00.000Z") {
        this.Form.controls['leave_end_date'].setValue(null)
      }
    });
    this.Form.get('actual_delivery_date')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-02T00:00:00.000Z") {
        this.Form.controls['actual_delivery_date'].setValue(null)
      }
    });
    this.Form.get('notice_date_after_delivery')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-02T00:00:00.000Z") {
        this.Form.controls['notice_date_after_delivery'].setValue(null)
      }
    });
    this.Form.get('rejoining_date')?.valueChanges.subscribe(value => {
      let date = new Date(value).toISOString();
      if (date == "1970-01-02T00:00:00.000Z") {
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
        const bodyPart = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Leave Status")
        })
        this.leaveStatusList = bodyPart
      },
      error: (err: any) => { },
      complete: () => {
        this.get_divisions();
        this.get_maternity_Record();
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

  get_maternity_Record() {
    this.files = []
    const reference = this.route.snapshot.paramMap.get('id');
    this.maternityService.get_maternity_Record(reference).subscribe({
      next: (result: any) => {

        this.Form.controls['id'].setValue(result.data[0].id)
        // this.Form.controls['org_id'].setValue(result.data[0].attributes.org_id)
        this.Form.controls['employee_id'].setValue(result.data[0].attributes.employee_id)
        this.Form.controls['name'].setValue(result.data[0].attributes.name)
        this.Form.controls['age'].setValue(result.data[0].attributes.age)
        this.Form.controls['contact_number'].setValue(result.data[0].attributes.contact_number)
        this.Form.controls['designation'].setValue(result.data[0].attributes.designation)
        this.Form.controls['department'].setValue(result.data[0].attributes.department)
        this.Form.controls['supervisor_manager'].setValue(result.data[0].attributes.supervisor_manager)
        this.Form.controls['date_of_join'].setValue(result.data[0].attributes.date_of_join)
        this.Form.controls['average_wages'].setValue(result.data[0].attributes.average_wages)
        this.Form.controls['application_id'].setValue(result.data[0].attributes.application_id)
        this.Form.controls['application_date'].setValue(result.data[0].attributes?.application_date)
        this.Form.controls['expected_delivery_date'].setValue(result.data[0].attributes.expected_delivery_date)
        this.Form.controls['leave_start_date'].setValue(result.data[0].attributes.leave_start_date)
        this.Form.controls['leave_end_date'].setValue(result.data[0].attributes.leave_end_date)
        this.Form.controls['leave_end_date'].setValue(result.data[0].attributes.leave_end_date)
        this.Form.controls['created_date'].setValue(result.data[0].attributes.created_date)
        this.Form.controls['actual_delivery_date'].setValue(result.data[0].attributes.actual_delivery_date)
        this.Form.controls['leave_status'].setValue(result.data[0].attributes.leave_status)
        this.Form.controls['notice_date_after_delivery'].setValue(result.data[0].attributes.notice_date_after_delivery)
        this.Form.controls['rejoining_date'].setValue(result.data[0].attributes.rejoining_date)
        this.Form.controls['support_provided'].setValue(result.data[0].attributes.support_provided)
        this.Form.controls['signature'].setValue(result.data[0].attributes.signature)
        this.Form.controls['remarks'].setValue(result.data[0].attributes.remarks)
        this.Form.controls['status'].setValue(result.data[0].attributes.status)
        this.Form.controls['division'].setValue(result.data[0].attributes.division)

        this.dateOfJoin.setValue((result.data[0].attributes.date_of_join))
        this.applicaionDate.setValue((result.data[0].attributes.application_date))
        this.expectedDeliveryDate.setValue((result.data[0].attributes.expected_delivery_date))
        this.leaveStartDate.setValue((result.data[0].attributes.leave_start_date))
        this.leaveEndtDate.setValue((result.data[0].attributes.leave_end_date))
        this.actualDeliveryDate.setValue((result.data[0].attributes.actual_delivery_date))

        this.noticeDate.setValue((result.data[0].attributes.notice_date_after_delivery))
        this.rejoiningDate.setValue((result.data[0].attributes.rejoining_date))

        this.BenefitsList = result.data[0].attributes.benefits_and_entitlements.data

        this.DocumentList = result.data[0].attributes.medical_documents?.data

        if (this.DocumentList) {
          this.DocumentList.forEach((data: any) => {
            if (data?.attributes?.document_name != null) {
              this.generalService.getImage(environment.client_backend + '/uploads/' + data?.attributes?.document_name + '.' + data?.attributes?.format).subscribe((data: any) => {
                this.files.push(data)
              })
            }


            // this.DocumentList.push({
            //   document_type: data.attributes.document_type,
            //   document_date: data.attributes.document_date,
            //   document_id: data.attributes.document_id,
            //   files: this.files,
            // });

            // console.log(this.DocumentList, "this.DocumentList")

          })
        }

      },
      error: (err: any) => { },
      complete: () => { }
    })
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
    let selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['date_of_join'].setValue(selectedDate)
  }

  applicationDateVal(data: any) {
    let selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['application_date'].setValue(selectedDate)
  }

  expectedDeliveryDateVal(data: any) {
    let selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['expected_delivery_date'].setValue(selectedDate)
  }

  leaveStartDateVal(data: any) {
    let selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['leave_start_date'].setValue(selectedDate)
  }

  leaveEndDateVal(data: any) {
    let selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['leave_end_date'].setValue(selectedDate)
  }

  actualDeliveryDateVal(data: any) {
    let selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['actual_delivery_date'].setValue(selectedDate)
  }

  noticeDateVal(data: any) {
    let selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['notice_date_after_delivery'].setValue(selectedDate)
  }

  rejoiningDateVal(data: any) {
    let selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['rejoining_date'].setValue(selectedDate)
  }

  addBenefits_Entitlements() {
    this.dialog
      .open(UpdateEntitlementComponent)
      .afterClosed()
      .subscribe((data: any) => {
        if (data) {
          this.maternityService.create_entitlement(data, this.Form.value.id).subscribe({
            next: (result: any) => { },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              const statusText = "Benefits and Entitlement details added"
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_entitlement()
            }
          })
        }

      });
  }

  deleteBenefits(data: any) {
    this.maternityService.delete_entitlement(data.id).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "Benefits and Entitlement details deleted"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.get_entitlement()
      }
    })
  }

  modifyBenefits(benefitData: any) {
    this.dialog
      .open(UpdateEntitlementComponent, {
        data: benefitData,
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          const statusText = "Benefits and Entitlement details updated"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.get_entitlement()
        }
      });
  }

  addMedical_documents() {
    this.dialog
      .open(UpdateDocumentComponent)
      .afterClosed()
      .subscribe((data: any) => {
        if (data) {

          let docData = data
          if (data.files && data.files.length > 0) {
            data.files.forEach((elem: any) => {
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
                    upload_date: docData.upload_date,
                    document_id: result[0].id,
                    document_name: result[0].hash,
                    format: extension,
                    id: this.Form.value.id,
                  });
                  this.maternityService.create_document(data[0]).subscribe({
                    next: (result: any) => { },
                    error: (err: any) => { },
                    complete: () => {
                      Swal.close();
                      const statusText = "Document details added"
                      this._snackBar.open(statusText, 'OK', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                      });
                      this.get_Maternity_Documents();
                    },
                  });
                },
                error: (err: any) => { },
                complete: () => {
                  // Swal.close();
                  // const statusText = "Document details added"
                  // this._snackBar.open(statusText, 'OK', {
                  //   horizontalPosition: this.horizontalPosition,
                  //   verticalPosition: this.verticalPosition,
                  // });
                  // this.get_Maternity_Documents();
                },
              });
            });
          } else {
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
              complete: () => {
                Swal.close();
                const statusText = "Document details added"
                this._snackBar.open(statusText, 'OK', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.get_Maternity_Documents();
              },
            });
          }

          // this.DocumentList.push(data);
          // console.log(this.DocumentList, "this.DocumentList")
        }
      });
  }

  deleteDocument(data: any) {
    this.maternityService.delete_maternity_documents(data.id).subscribe({
      next: (result: any) => {
        if (result.data.attributes.document_id != null) {
          this.generalService.delete_image(result.data.attributes.document_id).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = "Document deleted"
              this._snackBar.open(statusText, 'Close Warning', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_Maternity_Documents()
            }
          })
        } else {
          const statusText = "Document deleted"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.get_Maternity_Documents()
        }

      },
      error: (err: any) => { },
      complete: () => { Swal.close() }
    })
  }

  modifyDocument(docData: any) {
    this.dialog
      .open(UpdateDocumentComponent, {
        data: docData,
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          const statusText = "Document details updated"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.get_Maternity_Documents()
        }
      });
  }

  viewDocument(docData: any) {
    this.dialog
      .open(ViewDocumentComponent, {
        data: docData,
      })
      .afterClosed()
      .subscribe((data) => {

      });
  }

  saveAsDraft() {
    this.showProgressPopup();
    this.update_maternityRecord_draft();
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
        this.update_maternityRecord();
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

  update_maternityRecord_draft() {
    this.Form.controls['status'].setValue('Draft')
    this.maternityService.update_maternityRecord_draft(this.Form.value).subscribe({
      next: (result: any) => {
        // this.Form.controls['id'].setValue(result.data.id);
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        // Swal.fire({
        //   title: 'Benefit Request Updated',
        //   imageUrl: "assets/images/reported.gif",
        //   imageWidth: 250,
        //   text: "You have successfully updated a Benefit Request.",
        //   showCancelButton: false,

        // })

        Swal.close();
        const statusText = "Benefit Request Updated"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

        this.get_maternity_Record();
      },
    });
  }

  update_maternityRecord() {
    this.Form.controls['status'].setValue('Completed')
    this.maternityService.update_maternityRecord(this.Form.value).subscribe({
      next: (result: any) => {
        // this.Form.controls['id'].setValue(result.data.id);
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        Swal.fire({
          title: 'Benefit Request Updated',
          imageUrl: "assets/images/reported.gif",
          imageWidth: 250,
          text: "You have successfully updated a Benefit Request.",
          showCancelButton: false,

        })
        // this.get_maternity_Record();
        this.router.navigate(["/apps/occupational-health/medical-records/register"])
      },
    });
  }

  get_entitlement() {
    this.maternityService.get_benefits_entitlements(this.Form.value.id).subscribe({
      next: (result: any) => {
        this.BenefitsList = []
        this.BenefitsList = result.data
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
      },
    });
  }

  get_Maternity_Documents() {
    this.maternityService.get_Maternity_Documents(this.Form.value.id).subscribe({
      next: (result: any) => {
        this.DocumentList = []
        this.DocumentList = result.data
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
      },
    });
  }

  // uploadDocument() {
  //   if (this.DocumentList.length > 0) {
  //     this.DocumentList[0].files.forEach((elem: any) => {
  //       this.documentFormData.delete('files');
  //       const extension = elem.name.split('.').pop().toLowerCase();
  //       this.documentFormData.append(
  //         'files',
  //         elem,
  //         this.Form.value.document_type + '.' + extension
  //       );
  //       this.generalService.upload(this.documentFormData).subscribe({
  //         next: (result: any) => {
  //           let data: any[] = [];
  //           data.push({
  //             document_type: this.DocumentList[0].document_type,
  //             document_date: this.DocumentList[0].document_date,
  //             document_id: result[0].id,
  //             id: this.Form.value.id,
  //           });
  //           this.maternityService.create_document(data[0]).subscribe({
  //             next: (result: any) => { },
  //             error: (err: any) => { },
  //             complete: () => { },
  //           });
  //         },
  //         error: (err: any) => { },
  //         complete: () => {
  //           Swal.close();
  //         },
  //       });
  //     });
  //   }
  // }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

  navigate() {
    this.router.navigate(["apps/occupational-health/medical-records/register"])
    this.backToHistory = true
  }

}
