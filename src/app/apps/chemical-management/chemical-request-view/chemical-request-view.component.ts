import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { ChemicalMsdsDocumentComponent } from '../chemical-msds-document/chemical-msds-document.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Location } from '@angular/common';
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
  selector: 'app-chemical-request-view',
  templateUrl: './chemical-request-view.component.html',
  styleUrls: ['./chemical-request-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChemicalRequestViewComponent implements OnInit {

  Form: FormGroup
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  divisions: any[] = []
  commercialName: any[] = []
  zdhcCategory: any[] = []
  peopleList: any[] = []
  currency: string
  orgID: string
  requestedUnit: any[] = []
  standardList: any[] = []
  dropdownValues: any[] = []
  msds_sdsValue: any
  requestedUnitVal: string
  issuedDate = new FormControl(null);
  expiryDate = new FormControl(null);
  ProductStandard = new FormControl(null, [Validators.required]);
  requestDate = new FormControl(null);
  ApprovalDate = new FormControl(null);
  backToHistory: Boolean = false;


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
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private generalService: GeneralService,
    private chemicalService: ChemicalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
    this.configuration()

    this.Form = this.formBuilder.group({
      org_id: [''],
      id: [''],
      reference_number: [''],
      division: ['', [Validators.required]],
      reported_date: [null],
      request_date: [null],
      requested_customer: ['', [Validators.required]],
      requested_merchandiser: ['', [Validators.required]],
      commercial_name: ['', [Validators.required]],
      substance_name: ['', [Validators.required]],
      formula: ['', [Validators.required]],
      reach_regi_number: ['', [Validators.required]],
      zdhc_use_category: ['', [Validators.required]],
      where_why: ['', [Validators.required]],
      status: ['Open', [Validators.required]],
      approver: ['', [Validators.required]],
      approver_designation: [''],
      reporter: ['', [Validators.required]],
      reporter_id: [''],
      reporter_designation: ['', [Validators.required]],
      updated_By: ['', [Validators.required]],
      reviewer_remarks: [''],
      reviewer: [''],
      reviewer_designation: [''],
      approver_remarks: [''],
      chemical_uuid: [''],
      requested_unit: ['', [Validators.required]],
      requested_quantity: [null, [Validators.required]],
      chemical_form: ['', [Validators.required]],
      zdhc_level: [''],
      cas_no: [''],
      colour_index: [''],
      use_of_ppe: [''],
      hazardType: [''],
      ghsClassification: [''],
      product_standard: ['', [Validators.required]],
      msds_doc_status: [null, [Validators.required]],
      msds_sds_issued_date: [null, [Validators.required]],
      msds_sds_expiry_date: [null, [Validators.required]],
      msds_sds_document: [''],
      document_name: [''],
      document_format: [''],
      document_id: [''],
      msdc_document: [''],
      msds_sds: [false, [Validators.required]],
      approval_valid_date: [null],
      category: ['', [Validators.required]]

    });
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.chemical
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
        const status = result.chem_request
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['updated_By'].setValue(result.profile.id)
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
          this.get_chemical_request_details()
          this.get_standard_list()

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_chemical_request_details() {
    const cheID = this.route.snapshot.paramMap.get('id');
    this.chemicalService.get_chemical_details(cheID).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data.attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/chemical-management/request-history"])
        }
        {
          this.Form.controls['id'].setValue(result.data.id)
          this.Form.controls['reference_number'].setValue(result.data.attributes.reference_number)
          this.Form.controls['division'].setValue(result.data.attributes.division)
          this.Form.controls['reported_date'].setValue(result.data.attributes.created_date)
          this.Form.controls['request_date'].setValue(result.data.attributes.request_date)
          this.requestDate.setValue(new Date(result.data.attributes.request_date))
          this.Form.controls['requested_customer'].setValue(result.data.attributes.requested_customer)
          this.Form.controls['requested_merchandiser'].setValue(result.data.attributes.requested_merchandiser)
          this.Form.controls['commercial_name'].setValue(result.data.attributes.commercial_name)
          this.Form.controls['substance_name'].setValue(result.data.attributes.substance_name)
          this.Form.controls['formula'].setValue(result.data.attributes.formula)
          this.Form.controls['reach_regi_number'].setValue(result.data.attributes.reach_registration_number)
          this.Form.controls['category'].setValue(result.data.attributes.category)
          this.Form.controls['zdhc_use_category'].setValue(result.data.attributes.ZDHC_use_category)
          this.Form.controls['where_why'].setValue(result.data.attributes.usage)
          this.Form.controls['status'].setValue(result.data.attributes.status)
          this.Form.controls['requested_unit'].setValue(result.data.attributes.requested_unit)
          this.Form.controls['requested_quantity'].setValue(result.data.attributes.requested_quantity)
          this.Form.controls['chemical_form'].setValue(result.data.attributes.chemical_form_type)
          this.Form.controls['zdhc_level'].setValue(result.data.attributes.zdhc_level)
          this.Form.controls['cas_no'].setValue(result.data.attributes.cas_no)
          this.Form.controls['colour_index'].setValue(result.data.attributes.colour_index)
          this.Form.controls['use_of_ppe'].setValue(result.data.attributes.use_of_ppe)
          this.Form.controls['hazardType'].setValue(result.data.attributes.hazard_type)
          this.Form.controls['ghsClassification'].setValue(result.data.attributes.ghs_classification)
          this.Form.controls['product_standard'].setValue(result.data.attributes.product_standard)
          this.Form.controls['reporter_id'].setValue(result.data.attributes.reporter.data.id)
          this.Form.controls['reporter'].setValue(result.data.attributes.reporter.data.attributes.first_name + ' ' + result.data.attributes.reporter.data.attributes.last_name)
          this.Form.controls['reporter_designation'].setValue(result.data.attributes.reporter.data.attributes.designation)
          this.Form.controls['approval_valid_date'].setValue(result.data.attributes.approval_valid_date)
          this.ApprovalDate.setValue(new Date(result.data.attributes.approval_valid_date === null ? '' : result.data.attributes.approval_valid_date))
          const document_name = result.data.attributes.msds_document?.data?.attributes?.document_name
          const document_format = result.data.attributes.msds_document?.data?.attributes?.document_format
          const document_id = result.data.attributes.msds_document?.data?.attributes?.document_id
          const msdc_document = result.data.attributes.msds_document?.data?.id
          this.Form.controls['document_name'].setValue(document_name)
          this.Form.controls['document_format'].setValue(document_format)
          this.Form.controls['document_id'].setValue(document_id)
          this.Form.controls['msdc_document'].setValue(msdc_document)
          this.Form.controls['msds_sds'].setValue(result.data.attributes.msds_sds)

          if (result.data.attributes.msds_sds_issued_date) {
            this.issuedDate.setValue(new Date(result.data.attributes.msds_sds_issued_date))
            this.Form.controls['msds_sds_issued_date'].setValue(result.data.attributes.msds_sds_issued_date)
          }
          if (result.data.attributes.msds_sds_expiry_date) {
            this.expiryDate.setValue(new Date(result.data.attributes.msds_sds_expiry_date))
            this.Form.controls['msds_sds_expiry_date'].setValue(result.data.attributes.msds_sds_expiry_date)
          }
          if (result.data.attributes.reviewer.data) {
            this.Form.controls['reviewer'].setValue(result.data.attributes.reviewer.data.attributes.first_name + ' ' + result.data.attributes.reviewer.data.attributes.last_name)
            this.Form.controls['reviewer_designation'].setValue(result.data.attributes.reviewer.data.attributes.designation)
          }
          if (result.data.attributes.approver.data) {
            this.Form.controls['approver'].setValue(result.data.attributes?.approver?.data?.attributes?.first_name + ' ' + result.data.attributes?.approver?.data?.attributes?.last_name)
            this.Form.controls['approver_designation'].setValue(result.data.attributes?.approver?.data?.attributes?.designation)
          }
          this.Form.controls['approver_remarks'].setValue(result.data.attributes.approver_remarks)
          this.Form.controls['chemical_uuid'].setValue(result.data.attributes.chemical_uuid)
          this.Form.controls['reviewer_remarks'].setValue(result.data.attributes.reviewer_remarks)
        }

      },
      error: (err: any) => { },
      complete: () => {
        this.Form.disable()
        this.requestDate.disable()
        this.ApprovalDate.disable()
        this.Form.controls['reviewer_remarks'].enable()
        this.Form.controls['reference_number'].enable()
        this.Form.controls['reported_date'].enable()
        this.Form.controls['status'].enable()
        this.Form.controls['reporter'].enable()
        this.Form.controls['reporter_designation'].enable()
        this.Form.controls['approver'].enable()
        this.Form.controls['approver_designation'].enable()
        this.Form.controls['approver_remarks'].enable()
        this.Form.controls['reviewer'].enable()
        this.Form.controls['reviewer_designation'].enable()
        this.Form.controls['msds_sds'].enable()
        this.Form.controls['document_id'].enable()
        this.Form.controls['document_name'].enable()
        this.Form.controls['document_format'].enable()

      }
    })
  }

  view_msds_document() {
    let docData: any[] = []
    docData.push({
      document_name: this.Form.value.document_name,
      document_format: this.Form.value.document_format
    })
    this.dialog.open(ChemicalMsdsDocumentComponent, { data: docData[0] })
  }

  action(data: any) {
    const status = data
    const approver = this.Form.value.approver
    this.Form.controls['status'].setValue(data)
    this.Form.controls['id'].enable()
    if (status === "Approved") {
      this.chemicalService.update_approver_status(this.Form.value).subscribe({
        next: (result: any) => {
          this.create_inventory()
        },
        error: (err: any) => { },
        complete: () => { }
      })
    } else if (status === "Rejected") {
      this.chemicalService.update_approver_status(this.Form.value).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.create_notification()
        }
      })
    }
  }

  create_inventory() {
    this.Form.enable()
    this.chemicalService.create_chemical_inventory(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.create_notification()
      }
    })
  }


  create_notification() {
    const status = this.Form.value.status
    this.Form.controls['reporter'].enable()
    this.Form.controls['reviewer'].enable()
    this.Form.controls['reporter_id'].enable()
    let data: any[] = []
    if (status === "Approved") {
      data.push({
        module: "Chemical Management",
        action: 'Chemical Request: ' + status,
        reference_number: this.Form.value.reference_number,
        userID: this.Form.value.reporter_id,
        access_link: "/apps/chemical-management/request-history",
        profile: this.Form.value.reviewer
      })
    } else if (status === "Rejected") {
      data.push({
        module: "Chemical Management",
        action: 'Chemical Request: ' + status,
        reference_number: this.Form.value.reference_number,
        userID: this.Form.value.reporter_id,
        access_link: "/apps/chemical-management/request-history",
        profile: this.Form.value.reviewer
      })
    }

    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        if (status === "Approved") {
          Swal.fire({
            title: 'Chemical Request Approved',
            imageUrl: "assets/images/chemical.gif",
            imageWidth: 250,
            text: "You have successfully approved the chemical request and submited for purchase and inventory.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/chemical-management/assigned-task"])
          })
        } else {
          Swal.fire({
            title: 'Chemical Request Reviewed',
            imageUrl: "assets/images/chemical.gif",
            imageWidth: 250,
            text: "You have rejected the chemical request and submited back to the reporter",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/chemical-management/assigned-task"])
          })
        }
      }
    })
  }

  Back() {
    this.router.navigate(["/apps/chemical-management/request-history"])
  }

  statusButton(data: any) {
    const open = "btn-primary"
    const Reviewed = "btn-info"
    const Approved = "btn-success"
    const Rejected = "btn-danger"
    const Draft = 'btn-secondary'
    if (data === "Open") {
      return open
    } else if (data === "Reviewed") {
      return Reviewed
    }
    else if (data === "Draft") {
      return Draft
    } else if (data === "Approved") {
      return Approved
    } else if (data === "Rejected") {
      return Rejected
    } else {
      return
    }
  }
  get_standard_list() {
    this.chemicalService.get_product_standard().subscribe({
      next: (result: any) => {
        this.standardList = result.data
      }
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
