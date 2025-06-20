import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { CurrencyPipe } from '@angular/common';
import { ChemicalMsdsDocumentComponent } from '../chemical-msds-document/chemical-msds-document.component';
import { ChemicalCertificateViewComponent } from '../chemical-certificate-view/chemical-certificate-view.component';
import { ChemicalDiposalViewComponent } from '../chemical-diposal-view/chemical-diposal-view.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { saveAs } from 'file-saver';
import { Location } from '@angular/common';
import { ViewChemcheckReportComponent } from '../view-chemcheck-report/view-chemcheck-report.component';
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
  selector: 'app-chemical-inventory-view',
  templateUrl: './chemical-inventory-view.component.html',
  styleUrls: ['./chemical-inventory-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChemicalInventoryViewComponent implements OnInit {

  names: any[] = []
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  orgID: string
  Form: FormGroup
  certificateList: any[] = []
  chemical_dropdown: any[] = [];
  docId: any
  currency: string
  existChemcheck = false
  issuedDate = new FormControl(null);
  chemcheckreportFile: File[] = [];
  expiryDate = new FormControl(null);
  deliveryDate = new FormControl(null, [Validators.required]);
  manufacturingDate = new FormControl(null);
  cheExpiryDate = new FormControl(null);
  invoiceDate = new FormControl(null);
  disposalList: any[] = []
  statements: File[] = [];
  hazardStatementCode: any[] = [];
  statementCodeCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
  requestDate = new FormControl(null);
  files: File[] = [];
  backToHistory: Boolean = false

  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>
  constructor(private generalService: GeneralService,
    private chemicalService: ChemicalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private currencyPipe: CurrencyPipe,
    private route: ActivatedRoute, private _location: Location) {
  }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      reference_number: [''],
      reported_date: [null],
      request_date: [null],
      commercial_name: [''],
      supplier_name: ['', [Validators.required]],
      manufacturer_name: ['', [Validators.required]],
      status: [''],
      assignee: [null],
      reporter: [null],
      certificate: [''],
      substance_name: [''],
      formula: [''],
      chemical_form_type: [''],
      requested_customer: [''],
      requested_merchandiser: [''],
      approver: [null],
      contact_number: [null, [Validators.required]],
      email_id: [null, [Validators.required]],
      supplier_type: ['', [Validators.required]],
      location: ['', [Validators.required]],
      zdhc_level: ['', [Validators.required]],
      cas_no: ['', [Validators.required]],
      colour_index: ['', [Validators.required]],
      msds_sds_issued_date: [null, [Validators.required]],
      msds_sds_expiry_date: [null, [Validators.required]],
      msds_sds_document: [''],
      zdhc_use_category: [''],
      use_of_ppe: ['', [Validators.required]],
      msds_sds: [false, [Validators.required]],
      zdhc_mrsl: [false, [Validators.required]],
      invoice_reference: ['', [Validators.required]],
      reach_regi_number: [''],
      where_why: ['', [Validators.required]],
      storage_condition: [''],
      storage_place: [''],
      delivered_quantity: [null],
      delivered_unit: [''],
      purchased_amount: [null],
      threshold_limit: [null],
      delivery_date: [null],
      division: [''],
      hazardType: ['', [Validators.required]],
      ghsClassification: ['', [Validators.required]],
      purchased_amount_val: [''],
      msds_doc_status: [null, [Validators.required]],
      reporter_name: [''],
      reporter_designation: [''],
      reviewer_name: [''],
      reviewer_designation: [''],
      approver_name: [''],
      approver_designation: [''],
      document_name: [''],
      document_format: [''],
      document_id: [''],
      msdc_document: [''],
      updated_by: [''],
      lot_number: [''],
      manufacturing_date: [''],
      expiry_date: [''],
      requested_unit: [''],
      requested_quantity: [null],
      apeo_npe: [false, [Validators.required]],
      statement_name: [''],
      hazard_statement_code: [this.hazardStatementCode, [Validators.required]],
      statement_format: [''],
      statement_id: [''],
      apeo_statement: [''],
      invoice_date: [null],
      product_standard: [''],
      category: [''],
      formulator_name: [''],
      chemcheck_document: [''],
      chemcheck_name: [''],
      chemcheck_format: [''],
      chemcheck_id: [''],
      chem_check_report: [''],
      chemcheck: [false],
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
        const status = result.chem_inven
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
              let results = divisions.join('&');
            }
          }
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_inventory_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_inventory_details() {
    const cheID = this.route.snapshot.paramMap.get('id');
    this.chemicalService.get_nventory_details(cheID).subscribe({
      next: (result: any) => {

        const divisionUuidFromResponse = result.data.attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }

        if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/chemical-management/inventory"])
        }
        else {
          this.Form.controls['status'].setValue(result.data.attributes.status)
          this.Form.controls['id'].setValue(result.data.id)
          this.Form.controls['reference_number'].setValue(result.data.attributes.reference_number)
          this.Form.controls['reported_date'].setValue(result.data.attributes.request_created_date)
          this.Form.controls['request_date'].setValue(result.data.attributes.request_date)
          this.requestDate.setValue(new Date(result.data.attributes.request_date))
          this.Form.controls['commercial_name'].setValue(result.data.attributes.commercial_name)
          this.Form.controls['substance_name'].setValue(result.data.attributes.substance_name)
          this.Form.controls['formula'].setValue(result.data.attributes.formula)
          this.Form.controls['chemical_form_type'].setValue(result.data.attributes.chemical_form_type)
          this.Form.controls['reach_regi_number'].setValue(result.data.attributes.reach_registration_number)
          this.Form.controls['category'].setValue(result.data.attributes.category)
          this.Form.controls['zdhc_use_category'].setValue(result.data.attributes.ZDHC_Category)

          this.Form.controls['requested_customer'].setValue(result.data.attributes.requested_customer)
          this.Form.controls['requested_merchandiser'].setValue(result.data.attributes.requested_merchandiser)
          this.Form.controls['division'].setValue(result.data.attributes.division)
          this.Form.controls['reporter_name'].setValue(result.data.attributes.reporter.data.attributes.first_name + ' ' + result.data.attributes.reporter.data.attributes.last_name)
          this.Form.controls['reporter_designation'].setValue(result.data.attributes.reporter.data.attributes.designation)
          this.Form.controls['reviewer_name'].setValue(result.data.attributes.reviewer.data.attributes.first_name + ' ' + result.data.attributes.reviewer.data.attributes.last_name)
          this.Form.controls['reviewer_designation'].setValue(result.data.attributes.reviewer.data.attributes.designation)
          this.Form.controls['approver_name'].setValue(result.data.attributes.approver.data.attributes.first_name + ' ' + result.data.attributes.approver.data.attributes.last_name)
          this.Form.controls['approver_designation'].setValue(result.data.attributes.approver.data.attributes.designation)
          this.Form.controls['formulator_name'].setValue(result.data.attributes.formulator_name)
          const document_name = result.data.attributes.msds_document?.data?.attributes?.document_name
          const document_format = result.data.attributes.msds_document?.data?.attributes?.document_format
          const document_id = result.data.attributes.msds_document?.data?.attributes?.document_id
          const msdc_document = result.data.attributes.msds_document?.data?.id
          this.Form.controls['document_name'].setValue(document_name)
          this.Form.controls['document_format'].setValue(document_format)
          this.Form.controls['document_id'].setValue(document_id)
          this.Form.controls['msdc_document'].setValue(msdc_document)
          this.Form.controls['msds_sds'].setValue(result.data.attributes.msds_sds)
          this.Form.controls['msdc_document'].setValue(result.data.attributes?.msds_document?.data?.id)
          this.Form.controls['document_id'].setValue(result.data.attributes?.msds_document?.data?.attributes?.document_id)



          if (document_name && document_format && document_id) {
            this.Form.controls['msds_sds'].setValue(true)
            this.Form.controls['msds_doc_status'].setValue('ok')
            this.generalService.getImage(environment.client_backend + '/uploads/' + document_name + '.' + document_format).subscribe((data: any) => {
              let docData: any[] = []
              docData.push({
                size: data.size,
                name: document_name,
                type: document_format
              })
              this.files.push(docData[0])

            })

          } else {
            this.Form.controls['msds_sds'].setValue(false)
            this.Form.controls['msds_doc_status'].reset()
          }


          const statement_name = result.data.attributes.apeo_statement?.data?.attributes?.statement_name
          const statement_format = result.data.attributes.apeo_statement?.data?.attributes?.statement_format
          const statement_id = result.data.attributes.apeo_statement?.data?.attributes?.statement_id
          const apeo_statement = result.data.attributes.apeo_statement?.data?.id
          this.Form.controls['statement_name'].setValue(statement_name)
          this.Form.controls['statement_format'].setValue(statement_format)
          this.Form.controls['statement_id'].setValue(statement_id)
          this.Form.controls['apeo_statement'].setValue(apeo_statement)
          if (statement_name && statement_format && statement_id) {
            setTimeout(() => {
              this.Form.controls['apeo_npe'].setValue(true);
            }, 0);


            this.generalService.getImage(environment.client_backend + '/uploads/' + statement_name + '.' + statement_format).subscribe((data: any) => {
              let stmtData: any[] = []
              stmtData.push({
                size: data.size,
                name: statement_name,
                type: statement_format
              })
              this.statements.push(stmtData[0])
            })
          } else {
            this.Form.controls['apeo_npe'].setValue(false)
          }

          this.Form.controls['chemcheck'].setValue(result.data.attributes.chem_check)
          const chemcheck_report_name = result.data.attributes.chem_check_report?.data?.attributes?.document_name
          const chemcheck_report_format = result.data.attributes.chem_check_report?.data?.attributes?.document_format
          const chemcheck_report_id = result.data.attributes.chem_check_report?.data?.attributes?.document_id
          const chemcheck_report = result.data.attributes.chem_check_report?.data?.id
          this.docId = result.data.attributes.chem_check_report?.data?.attributes?.document_id

          if (chemcheck_report_name && chemcheck_report_format && chemcheck_report_id) {
            this.existChemcheck = true
            this.Form.controls['chemcheck'].setValue(true)
            this.chemcheckreportFile = []
            this.generalService.getImage(environment.client_backend + '/uploads/' + chemcheck_report_name + '.' + chemcheck_report_format).subscribe((data: any) => {
              let docData: any[] = []
              docData.push({
                size: data.size,
                name: chemcheck_report_name,
                type: chemcheck_report_format
              })
              this.chemcheckreportFile.push(docData[0])
            })
          } else {
            this.Form.controls['chemcheck'].setValue(false)
            // this.Form.controls['msds_doc_status'].reset()
            this.existChemcheck = false
          }

          this.Form.controls['chemcheck_name'].setValue(chemcheck_report_name)
          this.Form.controls['chemcheck_format'].setValue(chemcheck_report_format)
          this.Form.controls['chemcheck_id'].setValue(chemcheck_report_id)
          this.Form.controls['chem_check_report'].setValue(chemcheck_report)
          this.certificateList = result.data.attributes.certificates.data
          this.Form.controls['supplier_name'].setValue(result.data.attributes.supplier_name)
          this.Form.controls['contact_number'].setValue(result.data.attributes.contact_number)
          this.Form.controls['email_id'].setValue(result.data.attributes.email_id)
          this.Form.controls['supplier_type'].setValue(result.data.attributes.type)
          this.Form.controls['manufacturer_name'].setValue(result.data.attributes.manufacturer_name)
          this.Form.controls['location'].setValue(result.data.attributes.location)
          this.Form.controls['zdhc_level'].setValue(result.data.attributes.zdhc_level)
          this.Form.controls['cas_no'].setValue(result.data.attributes.cas_no)
          this.Form.controls['colour_index'].setValue(result.data.attributes.colour_index)
          this.Form.controls['msds_sds'].setValue(result.data.attributes.msds_sds)
          this.Form.controls['requested_unit'].setValue(result.data.attributes.requested_unit)
          this.Form.controls['requested_quantity'].setValue(result.data.attributes.requested_quantity)
          this.Form.controls['product_standard'].setValue(result.data.attributes.product_standard)
          if (result.data.attributes.msds_sds_issued_date) {
            this.issuedDate.setValue(new Date(result.data.attributes.msds_sds_issued_date))
            this.Form.controls['msds_sds_issued_date'].setValue(result.data.attributes.msds_sds_issued_date)
          }
          if (result.data.attributes.msds_sds_expiry_date) {
            this.expiryDate.setValue(new Date(result.data.attributes.msds_sds_expiry_date))
            this.Form.controls['msds_sds_expiry_date'].setValue(result.data.attributes.msds_sds_expiry_date)
          }
          this.Form.controls['zdhc_mrsl'].setValue(result.data.attributes.zdhc_mrsl)
          this.Form.controls['hazardType'].setValue(result.data.attributes.hazard_type)
          this.Form.controls['use_of_ppe'].setValue(result.data.attributes.use_of_ppe)
          this.Form.controls['ghsClassification'].setValue(result.data.attributes.ghs_classification)
          this.Form.controls['where_why'].setValue(result.data.attributes.where_why)
          this.Form.controls['storage_condition'].setValue(result.data.attributes.storage_condition)
          this.Form.controls['storage_place'].setValue(result.data.attributes.storage_place)
          this.Form.controls['lot_number'].setValue(result.data.attributes.lot_number)
          if (result.data.attributes.delivery_date) {
            this.deliveryDate.setValue(new Date(result.data.attributes.delivery_date))
            this.Form.controls['delivery_date'].setValue(result.data.attributes.delivery_date)
          }
          if (result.data.attributes.expiry_date) {
            this.cheExpiryDate.setValue(new Date(result.data.attributes.expiry_date))
            this.Form.controls['expiry_date'].setValue(result.data.attributes.expiry_date)
          }
          if (result.data.attributes.invoice_date) {
            this.invoiceDate.setValue(new Date(result.data.attributes.invoice_date))
            this.Form.controls['invoice_date'].setValue(result.data.attributes.invoice_date)
          }
          if (result.data.attributes.manufacturing_date) {
            this.manufacturingDate.setValue(new Date(result.data.attributes.manufacturing_date))
            this.Form.controls['manufacturing_date'].setValue(result.data.attributes.manufacturing_date)
          }
          if (statement_name && statement_format && statement_id) {
            this.Form.controls['apeo_npe'].setValue(true)
            this.generalService.getImage(environment.client_backend + '/uploads/' + statement_name + '.' + statement_format).subscribe((data: any) => {
              let stmtData: any[] = []
              stmtData.push({
                size: data.size,
                name: statement_name,
                type: statement_format
              })
              this.statements.push(stmtData[0])
            })
          } else {
            this.Form.controls['apeo_npe'].setValue(false)
          }
          this.Form.controls['delivered_quantity'].setValue(result.data.attributes.delivered_quantity)
          this.Form.controls['delivered_unit'].setValue(result.data.attributes.delivered_unit)
          this.Form.controls['purchased_amount'].setValue(result.data.attributes.purchased_amount)
          const amount = this.currencyPipe.transform(result.data.attributes.purchased_amount, this.currency);
          this.Form.controls['purchased_amount_val'].setValue(amount)
          this.Form.controls['threshold_limit'].setValue(result.data.attributes.threshold_limit)
          this.Form.controls['invoice_reference'].setValue(result.data.attributes.invoice_reference)
          this.Form.controls['apeo_npe'].setValue(result.data.attributes.apeo_npe)
          this.disposalList = result.data.attributes?.chemical_disposals?.data

          if (result.data.attributes.chemical_hazard_statement_code) {
            const hazardstatementcode = result.data.attributes.chemical_hazard_statement_code
            if (hazardstatementcode) {
              const split_string = hazardstatementcode.split(",");
              this.hazardStatementCode = split_string
            }
          }
        }
      },
      error: (err: any) => { },
      complete: () => {
        this.Form.disable()
        this.issuedDate.disable()
        this.expiryDate.disable()
        this.deliveryDate.disable()
        this.manufacturingDate.disable()
        this.cheExpiryDate.disable()
        this.invoiceDate.disable()
        this.Form.controls['reference_number'].enable()
        this.Form.controls['reported_date'].enable()
        this.Form.controls['reporter_name'].enable()
        this.Form.controls['reporter_designation'].enable()
        this.Form.controls['reviewer_name'].enable()
        this.Form.controls['reviewer_designation'].enable()
        this.Form.controls['approver_name'].enable()
        this.Form.controls['approver_designation'].enable()
        this.requestDate.disable()
        // this.Form.controls['chemcheck'].enable()
        this.Form.controls['chemcheck_name'].enable()
        this.Form.controls['chemcheck_format'].enable()
        this.Form.controls['chemcheck_id'].enable()


      }
    })

  }

  viewCertificate(cerData: any) {
    this.dialog.open(ChemicalCertificateViewComponent, { data: cerData })
  }
  // download_msds_document() {
  //   const documentName = this.Form.value.document_name;
  //   const documentFormat = this.Form.value.document_format;
  //   const fileUrl = `${environment.client_backend}/uploads/${documentName}.${documentFormat}`;
  //   saveAs(fileUrl, `${documentName}.${documentFormat}`);
  // }
  download_msds_document() {
    const documentName = this.Form.value.document_name;
    const documentFormat = this.Form.value.document_format;
    this.Form.controls['commercial_name'].enable()
    const chemicalName = this.Form.value.commercial_name;
    const issuedDate = this.issuedDate.value;
    const issueYear = issuedDate ? new Date(issuedDate).getFullYear() : 'Year';
    const customName = `${chemicalName}_MSDS_${issueYear}.${documentFormat}`;
    const fileUrl = `${environment.client_backend}/uploads/${documentName}.${documentFormat}`;
    saveAs(fileUrl, customName);
    this.Form.controls['commercial_name'].disable()
  }
  view_msds_document() {
    let docData: any[] = []
    this.Form.controls['document_name'].enable();
    this.Form.controls['document_format'].enable();


    docData.push({
      document_name: this.Form.value.document_name,
      document_format: this.Form.value.document_format
    })
    this.dialog.open(ChemicalMsdsDocumentComponent, { data: docData[0] })
  }

  view_apeo_statement() {
    let stmtData: any[] = []
    this.Form.controls['statement_name'].enable();
    this.Form.controls['statement_format'].enable();
    stmtData.push({
      statement_name: this.Form.value.statement_name,
      statement_format: this.Form.value.statement_format,
      statement: 'statement'
    })
    this.dialog.open(ChemicalMsdsDocumentComponent, { data: stmtData[0] })
  }

  view_chemcheck_report() {
    let reportdata: any[] = []

    reportdata.push({
      chemcheck_report_name: this.Form.value.chemcheck_name,
      chemcheck_report_format: this.Form.value.chemcheck_format,
      chemcheck_report: 'report'
    })
    this.dialog.open(ViewChemcheckReportComponent, { data: reportdata[0] })
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

  cost(data: any) {
    const amount = this.currencyPipe.transform(Number(data.target.value), this.currency);
    this.Form.controls['purchased_amount'].setValue(data.target.value)
    this.costSymbol(Number(data.target.value))
  }

  costSymbol(data: any) {
    const amount = this.currencyPipe.transform(data, this.currency);
    this.Form.controls['purchased_amount_val'].setValue(amount)
  }

  disposeCost(data: any) {
    const amount = this.currencyPipe.transform(data, this.currency);
    return amount
  }

  statusButton(data: any) {



    const approved = "btn-warning"
    const published = "btn-success"
    if (data === "Approved") {
      return approved
    } else if (data === "Published") {
      return published
    } else {
      return
    }
  }

  Back() {
    this.router.navigate(["/apps/chemical-management/inventory"])
  }

  viewDiposal(data: any) {
    this.dialog.open(ChemicalDiposalViewComponent, { data: data })
  }
  addStatementCode() { }

  ngAfterViewInit() {
    this.adjustTextarea({ target: this.textarea.nativeElement }); // Adjust height after loading
  }

  adjustTextarea(event: any): void {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = textarea.scrollHeight + "px"; // Adjust height
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
