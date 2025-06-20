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
import { environment } from 'src/environments/environment';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { UpdateEntitlementComponent } from '../benefit-modify/update-entitlement/update-entitlement.component';
import { UpdateDocumentComponent } from '../benefit-modify/update-document/update-document.component';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { ViewEnttitlementComponent } from './view-enttitlement/view-enttitlement.component';
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
  selector: 'app-benefit-view',
  templateUrl: './benefit-view.component.html',
  styleUrls: ['./benefit-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class BenefitViewComponent implements OnInit {
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
  backToHistory: Boolean = false

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
      status: [''],
      created_date: [null],
      division: ['', [Validators.required]]
    });

    // this.dropdownValues();
    this.get_maternity_Record();
  }

  // dropdownValues() {
  //   const module = "Occupational Health"
  //   this.generalService.get_dropdown_values(module).subscribe({
  //     next: (result: any) => {
  //       const bodyPart = result.data.filter(function (elem: any) {
  //         return (elem.attributes.Category === "Leave Status")
  //       })
  //       this.leaveStatusList = bodyPart
  //     },
  //     error: (err: any) => { },
  //     complete: () => {
  //       this.get_maternity_Record();
  //     }

  //   })
  // }

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
        this.Form.controls['date_of_join'].setValue(new Date(result.data[0].attributes.date_of_join))
        this.Form.controls['average_wages'].setValue(result.data[0].attributes.average_wages)
        this.Form.controls['application_id'].setValue(result.data[0].attributes.application_id)
        this.Form.controls['application_date'].setValue(result.data[0].attributes?.application_date)
        this.Form.controls['expected_delivery_date'].setValue(result.data[0].attributes.expected_delivery_date)
        this.Form.controls['leave_start_date'].setValue(result.data[0].attributes.leave_start_date)
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

        this.BenefitsList = result.data[0].attributes.benefits_and_entitlements?.data

        this.DocumentList = result.data[0].attributes.medical_documents?.data
        if (this.DocumentList) {

          this.DocumentList.forEach((data: any) => {
            if (data.attributes.document_name != null) {
              this.generalService.getImage(environment.client_backend + '/uploads/' + data.attributes.document_name + '.' + data.attributes.format).subscribe((data: any) => {
                this.files.push(data)
              })
            }

          })
        }

        this.Form.disable()
        this.dateOfJoin.disable()
        this.applicaionDate.disable()
        this.expectedDeliveryDate.disable()
        this.leaveStartDate.disable()
        this.leaveEndtDate.disable()
        this.actualDeliveryDate.disable()
        this.noticeDate.disable()
        this.rejoiningDate.disable()
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
        this.maternityService.create_entitlement(data, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            const statusText = "Benefits & Entitlement details added"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_entitlement()
          }
        })
      });
  }


  viewBenefits(benefitData: any) {
    this.dialog
      .open(ViewEnttitlementComponent, {
        data: benefitData
      })
      .afterClosed()
      .subscribe((data) => {

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
    this.update_maternityRecord();
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

  update_maternityRecord() {
    this.maternityService.update_maternityRecord(this.Form.value).subscribe({
      next: (result: any) => {
        // this.Form.controls['id'].setValue(result.data.id);
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        Swal.close()
        const statusText = "Benefit details updated"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

        this.get_maternity_Record();
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

  navigate() {
    this.router.navigate(["/apps/occupational-health/medical-records/register"])
    this.backToHistory = true

  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

}
