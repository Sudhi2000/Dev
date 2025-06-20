import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, forkJoin, map, of, startWith } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { NewSupplierComponent } from '../new-supplier/new-supplier.component';
import { NewStorageComponent } from '../new-storage/new-storage.component';
import { CurrencyPipe } from '@angular/common';
import { ChemicalMsdsDocumentComponent } from '../chemical-msds-document/chemical-msds-document.component';
import { ChemicalCertificateComponent } from '../chemical-certificate/chemical-certificate.component';
import { ChemicalEditCertificateComponent } from '../chemical-edit-certificate/chemical-edit-certificate.component';
import { NewPpeComponent } from '../new-ppe/new-ppe.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { saveAs } from 'file-saver'
import { CreateProductStandardComponent } from '../chemical-request/create-product-standard/create-product-standard.component';
import { StorageConditionComponent } from './storage-condition/storage-condition.component';
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
  selector: 'app-chemical-inventory-modify',
  templateUrl: './chemical-inventory-modify.component.html',
  styleUrls: ['./chemical-inventory-modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChemicalInventoryModifyComponent implements OnInit {

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 5,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };

  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;
  names: any[] = []
  supplierList: any[] = []
  suppliertypeList: any[] = []
  storagePlace: any[] = []
  deliveredUnit: any[] = []
  deliveredUnits: any[] = []
  zdhcLevel: any[] = []
  zdhcCategory: any[] = []
  chemical_dropdown: any[] = [];
  chemicalCount: number
  files: File[] = [];
  statements: File[] = [];
  chemcheckreportFile: File[] = [];
  evidenceCount: number = 0
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  userId: any
  docId: any
  ProductStandard = new FormControl('');
  divisions: any[] = []
  hazardTypes: any[] = []
  ghsClassifications: any[] = []
  hazardType = new FormControl(null, [Validators.required]);
  ghsClassification = new FormControl(null, [Validators.required]);
  IssueList: any[] = []
  TypeList: any[] = []
  Issues: any[] = []
  peopleList: any[] = []
  certificateList: any[] = []
  evidenceFormData = new FormData()
  statementFormData = new FormData()
  chemcheckFormData = new FormData()
  evidenceCertificateFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  evidenceData: any
  dropdownValues: any
  pdfSource: any
  report: any
  imglnk: any = environment.client_backend + '/uploads/'
  format: any = ".png"
  currency: string
  issuedDate = new FormControl(null);
  expiryDate = new FormControl(null);
  deliveryDate = new FormControl(null, [Validators.required]);
  manufacturingDate = new FormControl(null);
  cheExpiryDate = new FormControl(null);
  invoiceDate = new FormControl(null);
  use_of_ppe = new FormControl(null, [Validators.required]);
  requestDate = new FormControl(null);
  hazard_statement = new FormControl(null, [Validators.required]);
  toppingList: any[] = []
  statementList: any[] = []
  hazardStatementCode: any[] = [];
  hazardStatementCodes: any[] = []
  standardList: any[] = []
  statementCodeCtrl = new FormControl('');
  filteredstatementcode: Observable<string[]>;
  allstatementcodes: string[] = [];
  allStatementCodesMap: { [key: string]: string[] } = {};
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
  existMsds = false
  report_id: any
  existChemcheck = false
  chemicalId: string;
  chemicalRequestSortedDatas: any[] = []
  msdsSortedDatas: any[] = []
  msdsSortedDatasPdf: any[] = []
  existingMsds = new Blob();
  commercialName: any[] = []
  formReferenceNumber = null
  StorageConditionList: any[] = []
  StorageConditons = new FormControl('')
  filteredStorageConditions: Observable<any[]> = of([]);
  selectedStorageConditions: string[] = [];
  selectedSymptomsDisplay: string = '';
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
  @ViewChild('statementCodeInput') statementCodeInput: ElementRef<HTMLInputElement>;
  selectedProductStandard: any;

  constructor(private generalService: GeneralService,
    private chemicalService: ChemicalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private currencyPipe: CurrencyPipe,
    private route: ActivatedRoute, private _location: Location) {
    this.filteredstatementcode = this.statementCodeCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) =>
        part ? this._filterstatementCodes(part) : this.getFilteredCodes()
      )
    );
  }

  private _filterstatementCodes(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.getFilteredCodes().filter((code) =>
      code.toLowerCase().includes(filterValue)
    );
  }

  private getFilteredCodes(): string[] {
    return this.allstatementcodes.filter((code) => !this.hazardStatementCode.includes(code));
  }
  ngOnInit() {
    this.configuration()
    this.ProductStandard = new FormControl(null);
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
      chemical_form: [''],
      requested_customer: [''],
      requested_merchandiser: [''],
      approver: [null],
      contact_number: [null],
      email_id: [null],
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
      hazard_statement: [''],
      msds_sds: [false, [Validators.required]],
      zdhc_mrsl: [false, [Validators.required]],
      invoice_reference: [''],
      reach_regi_number: [''],
      where_why: [''],
      storage_condition: [''],
      storage_place: [''],
      delivered_quantity: [null, [Validators.required]],
      delivered_unit: ['', [Validators.required]],
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
      manufacturing_date: [null],
      expiry_date: [null],
      invoice_date: [null],
      published_by: [null],
      msds_warning_date: [null],
      requested_unit: [''],
      requested_quantity: [null],
      apeo_npe: [false, [Validators.required]],
      hazard_statement_code: [null, [Validators.required]],
      statement_name: [''],
      statement_format: [''],
      statement_id: [''],
      apeo_statement: [''],
      business_unit: [''],
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
    this.Form.controls['msds_sds_issued_date'].removeValidators(Validators.required)
    this.Form.controls['msds_sds_expiry_date'].removeValidators(Validators.required)
    this.Form.controls['msds_doc_status'].removeValidators(Validators.required)

    this.get_Storage_condition();
    this.StorageConditons.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStorage(value))
    ).subscribe(filtered => {
      this.filteredStorageConditions = of(filtered);
    });
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.chemical
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
        const status = result.chem_create
        this.userId = result.id
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
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_inventory_details()
          this.get_standard_list()
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

        if (result.data.attributes.status === "Published") {
          this.router.navigate(["/apps/chemical-management/inventory"])

        }
        const divisionUuidFromResponse = result.data.attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/chemical-management/inventory"])

        }
        this.Form.controls['id'].setValue(result.data.id)
        this.Form.controls['reference_number'].setValue(result.data.attributes.reference_number)


        this.Form.controls['reported_date'].setValue(result.data.attributes.request_created_date)
        this.Form.controls['request_date'].setValue(result.data.attributes.request_date)
        this.requestDate.setValue(new Date(result.data.attributes.request_date))
        this.Form.controls['commercial_name'].setValue(result.data.attributes.commercial_name)
        this.Form.controls['substance_name'].setValue(result.data.attributes.substance_name)
        this.Form.controls['formula'].setValue(result.data.attributes.formula)
        this.Form.controls['chemical_form'].setValue(result.data.attributes.chemical_form_type)
        this.Form.controls['reach_regi_number'].setValue(result.data.attributes.reach_registration_number)
        this.Form.controls['category'].setValue(result.data.attributes.category)
        this.Form.controls['zdhc_use_category'].setValue(result.data.attributes.ZDHC_Category)
        this.Form.controls['status'].setValue(result.data.attributes.status)
        this.Form.controls['requested_customer'].setValue(result.data.attributes.requested_customer)
        this.Form.controls['requested_unit'].setValue(result.data.attributes.requested_unit)
        this.Form.controls['requested_quantity'].setValue(result.data.attributes.requested_quantity)
        this.Form.controls['formulator_name'].setValue(result.data.attributes.formulator_name)

        this.ProductStandard.setValue(result.data.attributes.product_standard)
        this.Form.controls['product_standard'].setValue(result.data.attributes.product_standard)
        if (result.data.attributes.msds_warning_date) {
          this.Form.controls['msds_warning_date'].setValue(result.data.attributes.msds_warning_date)
        }
        this.Form.controls['requested_merchandiser'].setValue(result.data.attributes.requested_merchandiser)
        this.Form.controls['division'].setValue(result.data.attributes.division)
        this.Form.controls['business_unit'].setValue(result.data.attributes.business_unit.data?.id)
        this.Form.controls['reporter_name'].setValue(result.data.attributes.reporter.data.attributes.first_name + ' ' + result.data.attributes.reporter.data.attributes.last_name)
        this.Form.controls['reporter_designation'].setValue(result.data.attributes.reporter.data.attributes.designation)
        this.Form.controls['reviewer_name'].setValue(result.data.attributes.reviewer.data.attributes.first_name + ' ' + result.data.attributes.reviewer.data.attributes.last_name)
        this.Form.controls['reviewer_designation'].setValue(result.data.attributes.reviewer.data.attributes.designation)
        this.Form.controls['approver_name'].setValue(result.data.attributes.approver.data.attributes.first_name + ' ' + result.data.attributes.approver.data.attributes.last_name)
        this.Form.controls['approver_designation'].setValue(result.data.attributes.approver.data.attributes.designation)

        const document_name = result.data.attributes.msds_document?.data?.attributes?.document_name
        const document_format = result.data.attributes.msds_document?.data?.attributes?.document_format
        const document_id = result.data.attributes.msds_document?.data?.attributes?.document_id
        const msdc_document = result.data.attributes.msds_document?.data?.id
        this.Form.controls['document_name'].setValue(document_name)
        this.Form.controls['document_format'].setValue(document_format)
        this.Form.controls['document_id'].setValue(document_id)
        this.Form.controls['msdc_document'].setValue(msdc_document)
        const statement_name = result.data.attributes.apeo_statement?.data?.attributes?.statement_name
        const statement_format = result.data.attributes.apeo_statement?.data?.attributes?.statement_format
        const statement_id = result.data.attributes.apeo_statement?.data?.attributes?.statement_id
        const apeo_statement = result.data.attributes.apeo_statement?.data?.id
        this.Form.controls['statement_name'].setValue(statement_name)
        this.Form.controls['statement_format'].setValue(statement_format)
        this.Form.controls['statement_id'].setValue(statement_id)
        this.Form.controls['apeo_statement'].setValue(apeo_statement)

        this.Form.controls['chemcheck'].setValue(result.data.attributes.chem_check)
        const chemcheck_report_name = result.data.attributes.chem_check_report?.data?.attributes?.document_name
        const chemcheck_report_format = result.data.attributes.chem_check_report?.data?.attributes?.document_format
        const chemcheck_report_id = result.data.attributes.chem_check_report?.data?.attributes?.document_id
        const chemcheck_report = result.data.attributes.chem_check_report?.data?.id
        this.docId = result.data.attributes.chem_check_report?.data?.attributes?.document_id
        this.report_id = result.data.attributes.chem_check_report?.data?.id
        this.Form.controls['chemcheck_name'].setValue(chemcheck_report_name)
        this.Form.controls['chemcheck_format'].setValue(chemcheck_report_format)
        this.Form.controls['chemcheck_id'].setValue(chemcheck_report_id)
        this.Form.controls['chem_check_report'].setValue(chemcheck_report)

        if (result.data.attributes.chemical_hazard_statement_code) {
          this.Form.controls['hazard_statement_code'].setValue(result.data.attributes.chemical_hazard_statement_code);
          const hazardstatementcode = result.data.attributes.chemical_hazard_statement_code
          if (hazardstatementcode) {
            const split_string = hazardstatementcode.split(",");
            this.hazardStatementCode = split_string
          }
        }
        if (result.data.attributes.type !== 'Manufacturer' && result.data.attributes.type !== null) {
          this.Form.controls['manufacturer_name'].enable();
          this.Form.controls['manufacturer_name'].setValue(result.data.attributes.manufacturer_name)

        } else {
          this.Form.controls['manufacturer_name'].setValue(result.data.attributes.manufacturer_name)
          this.Form.controls['manufacturer_name'].disable();
        }
        if (document_name && document_format && document_id) {
          this.existMsds = true
          this.Form.controls['msds_sds'].setValue(true)
          this.Form.controls['msds_doc_status'].setValue('ok')
          this.validate_msds()
          this.files = []
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
          this.existMsds = false
        }

        if (statement_name && statement_format && statement_id) {
          setTimeout(() => {
            this.Form.controls['apeo_npe'].setValue(true);
          }, 0);

          this.statements = []
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

        this.certificateList = result.data.attributes.certificates.data
        this.Form.controls['supplier_name'].setValue(result.data.attributes.supplier_name)
        this.Form.controls['contact_number'].setValue(result.data.attributes.contact_number)
        this.Form.controls['email_id'].setValue(result.data.attributes.email_id)
        this.Form.controls['supplier_type'].setValue(result.data.attributes.type)
        this.Form.controls['location'].setValue(result.data.attributes.location)
        this.Form.controls['zdhc_level'].setValue(result.data.attributes.zdhc_level)
        this.Form.controls['cas_no'].setValue(result.data.attributes.cas_no)
        this.Form.controls['colour_index'].setValue(result.data.attributes.colour_index)
        this.Form.controls['msds_sds'].setValue(result.data.attributes.msds_sds)
        this.Form.controls['apeo_npe'].setValue(result.data.attributes.apeo_npe)
        if (result.data.attributes.msds_sds_issued_date) {
          this.issuedDate.setValue(new Date(result.data.attributes.msds_sds_issued_date))
          this.Form.controls['msds_sds_issued_date'].setValue(result.data.attributes.msds_sds_issued_date)
        }
        if (result.data.attributes.msds_sds_expiry_date) {
          this.expiryDate.setValue(new Date(result.data.attributes.msds_sds_expiry_date))
          this.Form.controls['msds_sds_expiry_date'].setValue(result.data.attributes.msds_sds_expiry_date)
        }
        if (result.data.attributes.manufacturing_date) {
          this.manufacturingDate.setValue(new Date(result.data.attributes.manufacturing_date))
          this.Form.controls['manufacturing_date'].setValue(result.data.attributes.manufacturing_date)
        }
        if (result.data.attributes.expiry_date) {
          this.cheExpiryDate.setValue(new Date(result.data.attributes.expiry_date))
          this.Form.controls['expiry_date'].setValue(result.data.attributes.expiry_date)
        }
        if (result.data.attributes.invoice_date) {
          this.invoiceDate.setValue(new Date(result.data.attributes.invoice_date))
          this.Form.controls['invoice_date'].setValue(result.data.attributes.invoice_date)
        }
        this.Form.controls['zdhc_mrsl'].setValue(result.data.attributes.zdhc_mrsl)
        if (result.data.attributes.use_of_ppe) {
          this.use_of_ppe.setValue(result.data.attributes.use_of_ppe.split(','))
        }
        if (result.data.attributes.hazard_statement) {
          this.hazard_statement.setValue(result.data.attributes.hazard_statement.split(','))
        }
        if (result.data.attributes.hazard_type) {
          const hazardTypes = result.data.attributes.hazard_type.split(',');
          this.hazardType.setValue(hazardTypes);
          if (hazardTypes.includes("Not Applicable")) {
            // Remove validation and disable the fields
            this.Form.controls['ghsClassification'].clearValidators();
            this.Form.controls['ghsClassification'].updateValueAndValidity();
            this.ghsClassification.clearValidators();
            this.ghsClassification.updateValueAndValidity();

            this.Form.controls['hazard_statement_code'].clearValidators();
            this.Form.controls['hazard_statement_code'].updateValueAndValidity();
            this.statementCodeCtrl.clearValidators();
            this.statementCodeCtrl.updateValueAndValidity();
          } else {
            // Restore validation and enable the fields
            this.Form.controls['ghsClassification'].setValidators([Validators.required]);
            this.Form.controls['ghsClassification'].updateValueAndValidity();

            this.Form.controls['hazard_statement_code'].setValidators([Validators.required]);
            this.Form.controls['hazard_statement_code'].updateValueAndValidity();
          }

          const observables = hazardTypes.map((hazard_type: string) =>
            this.get_hazard_statement_codes(hazard_type)
          );
          forkJoin(observables).subscribe(() => {
          });
        }


        if (result.data.attributes.ghs_classification) {
          this.ghsClassification.setValue(result.data.attributes.ghs_classification.split(','))
        }
        this.Form.controls['hazardType'].setValue(result.data.attributes.hazard_type)
        this.materiality_Issue()
        this.Form.controls['use_of_ppe'].setValue(result.data.attributes.use_of_ppe)
        this.Form.controls['ghsClassification'].setValue(result.data.attributes.ghs_classification)
        this.Form.controls['hazard_statement'].setValue(result.data.attributes.hazard_statement)
        this.Form.controls['where_why'].setValue(result.data.attributes.where_why)
        this.Form.controls['storage_place'].setValue(result.data.attributes.storage_place)
        this.Form.controls['lot_number'].setValue(result.data.attributes.lot_number)

        const storageCondition = result.data.attributes.storage_condition;
        const defaultValues = storageCondition ? storageCondition.split('|#| ').map((s: string) => s.trim()) : [];
        this.selectedStorageConditions = defaultValues;

        this.Form.controls['storage_condition'].setValue(storageCondition);
        this.StorageConditons.setValue('');

        if (result.data.attributes.delivery_date) {
          this.deliveryDate.setValue(new Date(result.data.attributes.delivery_date))
          this.Form.controls['delivery_date'].setValue(result.data.attributes.delivery_date)
        }
        this.Form.controls['delivered_quantity'].setValue(result.data.attributes.delivered_quantity)
        this.Form.controls['delivered_unit'].setValue(result.data.attributes.delivered_unit)
        this.Form.controls['purchased_amount'].setValue(result.data.attributes.purchased_amount)
        const amount = this.currencyPipe.transform(result.data.attributes.purchased_amount, this.currency);
        this.Form.controls['purchased_amount_val'].setValue(amount)
        this.Form.controls['threshold_limit'].setValue(result.data.attributes.threshold_limit)
        this.Form.controls['invoice_reference'].setValue(result.data.attributes.invoice_reference)

        this.formReferenceNumber = result.data.attributes.reference_number
      },

      error: (err: any) => { },
      complete: () => {
        this.Form.controls['request_date'].disable()
        this.Form.controls['commercial_name'].disable()
        this.Form.controls['substance_name'].disable()
        this.Form.controls['formula'].disable()
        this.Form.controls['reach_regi_number'].disable()
        this.Form.controls['zdhc_use_category'].disable()
        this.Form.controls['category'].disable()
        this.Form.controls['requested_customer'].disable()
        this.Form.controls['requested_merchandiser'].disable()
        this.Form.controls['division'].disable()
        this.Form.controls['where_why'].disable()
        this.Form.controls['requested_quantity'].disable()
        this.Form.controls['requested_unit'].disable()
        this.requestDate.disable()
      }
    })

    this.get_dropdown_values()
    this.get_profiles()
    this.get_standard_list()
    this.get_supplier_name()
    this.get_storage_place()
    this.hazardstatement()
    this.get_ppe_list()
    this.get_chemForm_dropdown()
    this.get_chemical_name()
  }

  get_dropdown_values() {
    const module = "Chemical Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        this.suppliertypes()
        this.zdhclevels()
        this.hazardtype()
        this.ghsclassification()
        this.deliverunit()
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_chemForm_dropdown() {
    const module = "Chemical Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        const data = result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Chemical Form Type' && elem.attributes.Module === module
        });
        let dropData: any[] = [];
        data.forEach((elem: any) => {
          dropData.push(elem.attributes.Value);
        });
        this.chemical_dropdown = dropData;
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  editCertificate(cerData: any) {
    this.dialog.open(ChemicalEditCertificateComponent, { data: cerData }).afterClosed().subscribe(data => {
      if (data) {
        this.chemicalService.update_certificates(data).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Certificate updated successfully"
            this._snackBar.open(statusText, 'OK', {
              duration: 3000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_inventory_details()
          }
        })
      } else {
        this.get_inventory_details()
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

  view_apeo_statement() {
    let stmtData: any[] = []
    stmtData.push({
      statement_name: this.Form.value.statement_name,
      statement_format: this.Form.value.statement_format,
      statement: 'statement'
    })
    this.dialog.open(ChemicalMsdsDocumentComponent, { data: stmtData[0] })
  }
  zdhclevels() {
    this.zdhcLevel = []
    const level = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "ZDHC Level")
    })
    this.zdhcLevel = level
  }

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

  get_supplier_name() {
    this.chemicalService.get_supplier_name().subscribe({
      next: (result: any) => {
        this.supplierList = result.data
      }
    })
  }

  get_storage_place() {
    this.chemicalService.get_storage_place().subscribe({
      next: (result: any) => {
        this.storagePlace = result.data
      }
    })
  }

  get_ppe_list() {
    this.chemicalService.get_ppe().subscribe({
      next: (result: any) => {
        this.toppingList = result.data
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
  get_standard_list() {
    this.chemicalService.get_product_standard().subscribe({
      next: (result: any) => {
        this.standardList = []
        result.data.forEach((item: any) => {
          if (item.attributes.name) {
            this.standardList.push(item.attributes.name);
          }
        });
      }

    })
  }

  suppliertypes() {
    this.suppliertypeList = []
    const type = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Supplier Type")
    })
    this.suppliertypeList = type
  }

  onDropdownTypeChange(event: any) {
    if (event.value !== "Manufacturer") {
      this.Form.controls['manufacturer_name'].enable();
    } else {
      this.Form.controls['manufacturer_name'].disable();
    }
  }

  hazardstatement() {
    this.chemicalService.get_hazard_statement().subscribe({
      next: (result: any) => {
        this.statementList = result.data
      }
    })
  }
  // hazardtype() {
  //   this.hazardTypes = []
  //   const hazardtype = this.dropdownValues.filter(function (elem: any) {
  //     return (elem.attributes.Category === "Hazard Type")
  //   })


  //   this.TypeList = hazardtype
  // }
  hazardtype() {
    this.hazardTypes = [];
    const hazardtype = this.dropdownValues.filter((elem: any) =>
      elem.attributes.Category === "Hazard Type"
    );

    // Ensure "Not Applicable" is the last item
    this.TypeList = hazardtype.sort((a: any, b: any) => {
      return a.attributes.Value === "Not Applicable" ? 1 :
        b.attributes.Value === "Not Applicable" ? -1 : 0;
    });
  }

  ghsclassification() {
    this.ghsClassifications = []
    const ghsclassification = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "GHS Classification")
    })
    this.IssueList = ghsclassification
  }

  deliverunit() {
    this.deliveredUnits = []
    const deliverunit = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Delivered Unit")
    })
    this.deliveredUnit = deliverunit
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
  new_supplier_name() {
    this.dialog.open(NewSupplierComponent).afterClosed().subscribe((data: any) => {
      const supplier = data.name
      const found = this.supplierList.find(obj => obj.attributes.name === supplier);
      if (found) {
        const statusText = "Supplier name already exist"
        this._snackBar.open(statusText, 'Close Warning', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        this.chemicalService.create_supplier_name(data, this.Form.value.reporter).subscribe({
          next: (result: any) => {

            this.chemicalService.get_supplier_name().subscribe({
              next: (result: any) => {
                this.supplierList = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "New Supplier created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['supplier_name'].setValue(result.data.attributes.name)
                this.Form.controls['contact_number'].setValue(result.data.attributes.contact_number);
                this.Form.controls['email_id'].setValue(result.data.attributes.email);
                this.Form.controls['location'].setValue(result.data.attributes.location);
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

  get_Storage_condition() {
    this.chemicalService.get_storage_condition_requirement().subscribe({
      next: (result: any) => {
        this.StorageConditionList = result.data;
        this.StorageConditionList.sort((a: any, b: any) => a.attributes.name.localeCompare(b.attributes.name));
        this.filteredStorageConditions = of(this.StorageConditionList);
      },
      error: err => {
        this.router.navigate(['/error/internal']);
      },
    });
  }

  toggleSelection(symptom: string) {
    const index = this.selectedStorageConditions.indexOf(symptom);
    if (index === -1) {
      this.selectedStorageConditions.push(symptom);
    } else {
      this.selectedStorageConditions.splice(index, 1);
    }

    const storageString = this.selectedStorageConditions.join('|#| ');
    this.Form.controls['storage_condition'].setValue(storageString);
    this.StorageConditons.setErrors(null)
  }
  removeSelectedCondition(condition: string) {
    const index = this.selectedStorageConditions.indexOf(condition);
    if (index !== -1) {
      this.selectedStorageConditions.splice(index, 1);
    }

    const storageString = this.selectedStorageConditions.join('|#| ');
    this.Form.controls['storage_condition'].setValue(storageString);
  }


  displaySelectedConditions(): string {
    return this.selectedStorageConditions.join('|#| ');
  }

  private _filterStorage(value: string): any[] {
    const filterValue = value?.toLowerCase();
    return this.StorageConditionList.filter(option =>
      option.attributes.name?.toLowerCase().includes(filterValue)
    );
  }
  onInputFocus() {
    this.filteredStorageConditions = of(this._filterStorage(this.StorageConditons.value || ''));
  }


  onInputChanged(event: any) {
    if (event.target.value === '') {

      // this.selectedStorageConditions = [];
      this.Form.controls['storage_condition'].setValue('');
    }
  }

  create_storage_condition() {
    this.dialog.open(StorageConditionComponent, { width: "740px" }).afterClosed().subscribe((data: any) => {
      if (data?.storage_condition) {

        const enteredStorageCondition = data.storage_condition.trim().toLowerCase(); // Convert input to lowercase
        const found = this.StorageConditionList.find(
          elem => elem.attributes.name.trim().toLowerCase() === enteredStorageCondition
        );
        if (found) {
          const statusText = "Storage Condition already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          const storageString = this.selectedStorageConditions.join('|#| ');
          this.StorageConditons.setValue(storageString);
        }
        else {
          this.chemicalService.create_storage_condition_requirement(data.storage_condition, this.userId).subscribe({
            next: (result: any) => {
              if (result?.data?.attributes?.name) {
                this.chemicalService.get_storage_condition_requirement().subscribe({
                  next: (getresult: any) => {
                    this.StorageConditionList = getresult.data;
                    this.StorageConditionList.sort((a: any, b: any) =>
                      a.attributes.name.localeCompare(b.attributes.name)
                    );

                    const newStorageCondition = result.data.attributes.name;
                    if (!this.selectedStorageConditions.includes(newStorageCondition)) {
                      this.selectedStorageConditions.push(newStorageCondition);
                    }
                    const storageString = this.selectedStorageConditions.join('|#| ');
                    this.Form.controls['storage_condition'].setValue(storageString);
                    this.StorageConditons.setErrors(null)

                    this.filteredStorageConditions = of(this.StorageConditionList);
                  },
                  error: (err: any) => {
                    this.router.navigate(["/error/internal"]);
                  },
                });
              }
              // else {
              //   console.error("Invalid result received from create_symptom");
              // }
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"]);
            },
            complete: () => {
              const statusText = "Storage Condition added successfully";
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            },
          });
        }
      }
    });
  }



  update_storage_condition(ID: any) {
    this.dialog.open(StorageConditionComponent, { data: ID }).afterClosed().subscribe((data: any) => {
      if (data) {

        const oldName = this.StorageConditionList.find(condition => condition.id === ID)?.attributes.name;

        this.chemicalService.update_storage_condition_requirement(data, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            const updatedName = result.data.attributes.name;

            const index = this.selectedStorageConditions.findIndex(condition => condition === oldName);
            if (index !== -1) {
              this.selectedStorageConditions[index] = updatedName;
            }
            // else {
            //   console.warn(`Old name '${oldName}' not found in selectedSymptoms.`);
            // }

            const storageString = this.selectedStorageConditions.join('|#| ');
            this.Form.controls['storage_condition'].setValue(storageString);

            this.chemicalService.get_storage_condition_requirement().subscribe({
              next: (getresult: any) => {
                this.StorageConditionList = getresult.data;
                this.StorageConditionList.sort((a: any, b: any) =>
                  a.attributes.name.localeCompare(b.attributes.name)
                );
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"]);
              },
            });
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"]);
          },
          complete: () => {
            const statusText = "Storage Condition updated successfully";
            this._snackBar.open(statusText, 'Ok', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          },
        });
      }
    });
  }


  delete_storage_condition(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the Storage Condition.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.chemicalService.delete_storage_condition_requirement(id).subscribe({
          next: () => {
            const deletedCondition = this.StorageConditionList.find(condition => condition.id === id)?.attributes.name;
            if (deletedCondition) {
              const index = this.selectedStorageConditions.indexOf(deletedCondition);
              if (index !== -1) {
                this.selectedStorageConditions.splice(index, 1);
              }
            }

            const storageString = this.selectedStorageConditions.join('|#| ');
            this.Form.controls['storage_condition'].setValue(storageString);
            this.get_Storage_condition();
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"]);
          },
          complete: () => {
            const statusText = "Storage Condition deleted";
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          }
        });
      }
    });
  }

  validate_msds() {
    const status = this.Form.value.msds_sds
    if (status === true) {
      this.Form.controls['msds_sds_issued_date'].setValidators([Validators.required])
      this.Form.controls['msds_sds_expiry_date'].setValidators([Validators.required])
      this.Form.controls['msds_doc_status'].setValidators(Validators.required)
      this.Form.controls["msds_sds_issued_date"].updateValueAndValidity();
      this.Form.controls["msds_sds_expiry_date"].updateValueAndValidity();
      this.Form.controls["msds_doc_status"].updateValueAndValidity();
      this.issuedDate.setValidators(Validators.required)
      this.expiryDate.setValidators(Validators.required)


      if (!this.existMsds) {
        this.fetchExistingMsds()

      }
    } else if (status === false) {
      this.issuedDate.reset()
      this.expiryDate.reset()
      this.Form.controls['msds_sds_issued_date'].removeValidators(Validators.required)
      this.Form.controls['msds_sds_expiry_date'].removeValidators(Validators.required)
      this.Form.controls['msds_doc_status'].removeValidators(Validators.required)
      this.Form.controls["msds_sds_issued_date"].updateValueAndValidity();
      this.Form.controls["msds_sds_expiry_date"].updateValueAndValidity();
      this.Form.controls["msds_doc_status"].updateValueAndValidity();
    }
    const docID = this.Form.value.document_id
    const cheID = this.Form.value.id
    if (status === false && docID && this.existMsds) {
      this.files = []
      this.issuedDate.reset()
      this.expiryDate.reset()
      this.Form.controls['msds_sds_issued_date'].reset()
      this.Form.controls['msds_sds_expiry_date'].reset()
      this.chemicalService.remove_msds_status(cheID).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.delete_msds_document()
          this.existMsds = false
        }
      })
    }
  }

  get_chemical_name() {
    this.chemicalService.get_chemical_name().subscribe({
      next: (result: any) => {

        this.commercialName = result.data




        //this.get_profiles()
      }
    })
  }

  fetchExistingMsds() {
    this.Form.controls['commercial_name'].enable()


    const commercialName = this.Form.value.commercial_name

    const selectedComercialNameData = this.commercialName.find(name => name.attributes.name === commercialName);

    this.chemicalId = selectedComercialNameData.attributes.uuid


    this.chemicalService.get_chemical_inventory_with_uid(this.chemicalId).subscribe({
      next: (result: any) => {




        this.chemicalRequestSortedDatas = result.data


        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const filteredData = this.chemicalRequestSortedDatas.filter((data) => {
          const expiryDateString = data.attributes.msds_sds_expiry_date;
          const msds = data.attributes.msds_document.data !== null;

          if (!expiryDateString) return false;
          if (!msds) return false;
          const expiryDate = expiryDateString;
          return expiryDate >= todayString;
        });




        if (filteredData.length > 0) {

          this.msdsSortedDatas = [filteredData[0]];



          this.msdsSortedDatasPdf.push(this.msdsSortedDatas[0].attributes.msds_document)
          const document_name = this.msdsSortedDatasPdf[0].data.attributes.document_name
          const document_format = this.msdsSortedDatasPdf[0].data.attributes.document_format
          this.Form.controls['document_name'].setValue(this.msdsSortedDatasPdf[0].data.attributes.document_name)
          this.Form.controls['document_format'].setValue(this.msdsSortedDatasPdf[0].data.attributes.document_format)
          this.Form.controls['document_id'].setValue(this.msdsSortedDatasPdf[0].data.attributes.document_id)
          this.Form.controls['msds_doc_status'].setValue('ok')
          //this.Form.controls['msds_document'].setValue(this.msdsSortedDatas[0].attributes.msds_document.data.id)
          this.issuedDate.setValue(this.msdsSortedDatas[0].attributes.msds_sds_issued_date)
          this.expiryDate.setValue(this.msdsSortedDatas[0].attributes.msds_sds_expiry_date)
          this.Form.controls['msds_sds_issued_date'].setValue(this.msdsSortedDatas[0].attributes.msds_sds_issued_date)
          this.Form.controls['msds_sds_expiry_date'].setValue(this.msdsSortedDatas[0].attributes.msds_sds_expiry_date)
          this.files = []
          this.generalService.getImage(environment.client_backend + '/uploads/' + document_name + '.' + document_format).subscribe((data: any) => {

            this.existingMsds = data
            let docData: any[] = []
            docData.push({
              size: data.size,
              name: document_name,
              type: document_format
            })

            this.files.push(docData[0])
          })
        } else {
          this.msdsSortedDatas = [];
          this.Form.controls['msds_doc_status'].reset()
        }
        this.files = []

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.Form.controls['commercial_name'].disable()

      }
    })
  }

  onSelect(event: any) {
    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / 2560 / 2560
      if (size > 2) {
        const statusText = "Please choose a document below 5 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['pdf'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {

          this.files.push(...event.addedFiles);
          this.Form.controls['msds_doc_status'].setValue('OK')
          this.upload_msds_document()
        } else {
          const statusText = "Please choose document ('pdf')"
          this._snackBar.open(statusText, 'Close Warning', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else if (fileLength < 6) {
      const statusText = "You have exceed the upload limit"
      this._snackBar.open(statusText, 'Close Warning', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  upload_msds_document() {
    this.existMsds = true
    const docID = this.Form.value.msdc_document
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '_' + currentYear)
      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = []
          data.push({
            document_name: result[0].hash,
            document_format: extension,
            chemical_inventory: this.Form.value.id,
            document_id: result[0].id
          })
          if (docID) {
            this.chemicalService.attach_msds_document(docID, data[0]).subscribe({
              next: (result: any) => {
                const cheID = this.Form.value.id
                this.chemicalService.add_msds_status(cheID).subscribe({
                  next: (result: any) => { },
                  error: (err: any) => { },
                  complete: () => {
                    const statusText = "MSDS/SDS has added successfully"
                    this._snackBar.open(statusText, 'OK', {
                      duration: 3000,
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                    });
                    this.files = []
                    this.get_inventory_msds_document()

                  }
                })
              },
              error: (err: any) => { },
              complete: () => { }
            })
          } else {
            this.chemicalService.create_msds_document(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                const statusText = "MSDS/SDS document added successfully"
                this._snackBar.open(statusText, 'OK', {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.files = []
                this.get_inventory_msds_document()

              }
            })
          }
        },
        error: (err: any) => { },
        complete: () => { }
      })
    })
  }

  existing_upload_msds_document() {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    this.files.forEach((elem: any) => {


      this.evidenceFormData.delete('files')
      const extension = 'pdf'
      const fileName = `${this.formReferenceNumber}_${currentYear}.${extension}`;
      this.evidenceFormData.append('files', this.existingMsds, fileName)

      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {

          let data: any[] = []
          data.push({
            document_name: result[0].hash,
            document_format: extension,
            chemical_inventory: this.Form.value.id,
            document_id: result[0].id
          })
          const docID = this.Form.value.msdc_document


          if (docID) {

            this.chemicalService.attach_msds_document(docID, data[0]).subscribe({
              next: (result: any) => {



                const cheID = this.Form.value.id
                this.chemicalService.add_msds_status(cheID).subscribe({
                  next: (result: any) => { },
                  error: (err: any) => { },
                  complete: () => {
                    const statusText = "MSDS/SDS has added successfully"
                    this._snackBar.open(statusText, 'OK', {
                      duration: 3000,
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                    });
                    this.files = []
                    this.get_inventory_msds_document()
                  }
                })
              },
              error: (err: any) => { },
              complete: () => { }
            })
          } else {

            this.chemicalService.create_msds_document(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                const statusText = "MSDS/SDS document added successfully"
                this._snackBar.open(statusText, 'OK', {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });

                this.get_inventory_msds_document()
              }
            })
          }
        },
        error: (err: any) => { },
        complete: () => { }
      })
    })
  }

  get_inventory_msds_document() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.chemicalService.inventory_details(this.Form.value.org_id, reference).subscribe({
      next: (result: any) => {
        this.Form.controls['msds_sds'].setValue(result.data[0].attributes.msds_sds)
        this.Form.controls['msdc_document'].setValue(result.data[0].attributes?.msds_document?.data?.id)
        this.Form.controls['document_id'].setValue(result.data[0].attributes?.msds_document?.data?.attributes?.document_id)
        const document_name = result.data[0].attributes.msds_document?.data?.attributes?.document_name
        const document_format = result.data[0].attributes.msds_document?.data?.attributes?.document_format
        const document_id = result.data[0].attributes.msds_document?.data?.attributes?.document_id
        this.Form.controls['document_name'].setValue(document_name)
        this.Form.controls['document_format'].setValue(document_format)
        this.Form.controls['document_id'].setValue(document_id)
        if (document_name && document_format && document_id) {
          this.Form.controls['msds_sds'].setValue(true)
          this.files = []
          this.existMsds = true
          this.generalService.getImage(environment.client_backend + '/uploads/' + document_name + '.' + document_format).subscribe((data: any) => {
            let docData: any[] = []
            docData.push({
              size: data.size,
              name: document_name,
              type: document_format
            })
            this.files.push(docData[0])
          })
          this.Form.controls['msds_doc_status'].removeValidators(Validators.required)
          this.Form.controls["msds_doc_status"].updateValueAndValidity();
        } else {
          this.existMsds = false
          this.Form.controls['msds_doc_status'].setValidators(Validators.required)
          this.Form.controls["msds_doc_status"].updateValueAndValidity();
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.files = []
    this.issuedDate.reset()
    this.expiryDate.reset()
    this.Form.controls['msds_sds_issued_date'].reset()
    this.Form.controls['msds_sds_expiry_date'].reset()
    if (this.existMsds) {
      const cheID = this.Form.value.id
      this.chemicalService.remove_msds_status(cheID).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.delete_msds_document()
          this.existMsds = false
        }
      })


    } else {
      this.Form.controls['document_id'].reset()
    }
  }

  onRemoveReport(event: any) {
    this.chemcheckreportFile = [];

    if (this.existChemcheck) {
      this.delete_chemcheckReport();
      this.existChemcheck = false;
    }
    else {
      this.Form.controls['chemcheck_id'].reset()
    }
  }

  delete_chemcheckReport() {
    const docID = this.Form.value.chemcheck_id;
    if (!docID) return;

    this.showProgressPopup();

    this.generalService.destroy(docID).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        console.error("Error deleting document:", err);
      },
      complete: () => {
        this.disconnect_chemcheckReport();
        Swal.close();
      }

    });
  }

  disconnect_chemcheckReport() {
    if (this.report_id === null) return;

    this.chemicalService.disconnect_chemcheck_report(this.report_id).subscribe({
      next: (result: any) => {
        this.Form.controls['chemcheck'].setValue(false)
      },
      error: (err: any) => {
        console.error("Error disconnecting ChemCheck report:", err);
      },
      complete: () => {
        this._snackBar.open("ChemCheck has been removed successfully", 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close();
      }
    });
  }

  splitText(text: string, maxLength: number = 100): string {
    let words = text.split(' '); // Split text into words
    let lines: string[] = [];
    let currentLine: string = '';

    for (let i = words.length - 1; i >= 0; i--) {
      if ((words[i] + ' ' + currentLine).trim().length <= maxLength) {
        currentLine = words[i] + ' ' + currentLine; // Add word at the beginning
      } else {
        lines.unshift(currentLine.trim()); // Save the completed line at the top
        currentLine = words[i]; // Start a new line with the current word
      }
    }

    if (currentLine) {
      lines.unshift(currentLine.trim()); // Add the last line
    }

    return lines.join('<br>'); // Use <br> for proper HTML display
  }


  onSelectStatement(event: any) {
    const fileLength = this.statements.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / 2560 / 2560
      if (size > 2) {
        const statusText = "Please choose statement below 5 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['pdf'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.statements.push(...event.addedFiles);
          this.upload_apeo_npe()
        } else {
          const statusText = "Please choose statement ('pdf')"
          this._snackBar.open(statusText, 'Close Warning', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else if (fileLength < 6) {
      const statusText = "You have exceed the upload limit"
      this._snackBar.open(statusText, 'Close Warning', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
  upload_apeo_npe() {
    const stmtID = this.Form.value.apeo_statement
    this.statements.forEach((elem: any) => {
      this.statementFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.statementFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)

      this.generalService.upload(this.statementFormData).subscribe({
        next: (result: any) => {
          let data: any[] = []
          data.push({
            statement_name: result[0].hash,
            statement_format: extension,
            chemical_inventory: this.Form.value.id,
            statement_id: result[0].id
          })
          if (stmtID) {
            this.chemicalService.attach_apeo_statement(stmtID, data[0]).subscribe({
              next: (result: any) => {
                const cheID = this.Form.value.id
                this.chemicalService.add_apeo_status(cheID).subscribe({
                  next: (result: any) => { },
                  error: (err: any) => { },
                  complete: () => {
                    const statusText = "APEO/NPE free compliance statement added successfully"
                    this._snackBar.open(statusText, 'OK', {
                      duration: 3000,
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                    });
                    this.statements = []
                    this.get_inventory_apeo_stmt()
                  }
                })
              },
              error: (err: any) => { },
              complete: () => { }
            })
          } else {

            this.chemicalService.create_apeo_statement(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                const statusText = "APEO/NPE free compliance statement added successfully"
                this._snackBar.open(statusText, 'OK', {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.statements = []
                this.get_inventory_apeo_stmt()
              }
            })
          }
        },
        error: (err: any) => { },
        complete: () => { }
      })
    })
  }


  onSelectReport(event: any) {
    const fileLength = this.chemcheckreportFile.length;
    const addedLength = event.addedFiles.length;

    if (fileLength === 0 && addedLength < 2) {
      const file = event.addedFiles[0];
      const sizeMB = file.size / (1024 * 1024); // Convert to MB

      if (sizeMB > 5) {
        this._snackBar.open("Please choose a document below 5 MB", 'Close Warning', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        return;
      }

      const extension = file.name.split('.').pop().toLowerCase();
      if (extension !== 'pdf') {
        this._snackBar.open("Please choose a PDF document", 'Close Warning', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        return;
      }

      this.chemcheckreportFile.push(file);
      this.upload_chemcheck_report();

    } else {
      this._snackBar.open("You have exceeded the upload limit", 'Close Warning', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  upload_chemcheck_report() {
    if (this.chemcheckreportFile.length > 0) {
      this.chemcheckreportFile.forEach((file: any) => {
        const formData = new FormData();
        const extension = file.name.split('.').pop().toLowerCase();
        formData.append('files', file, this.Form.value.reference_number + '_' + 'ChemCheckReport');

        this.generalService.upload(formData).subscribe({
          next: (result: any) => {
            const data = {
              document_name: result[0].hash,
              document_format: extension,
              chemical_inventory: this.Form.value.id,
              document_id: result[0].id,
            };

            this.chemicalService.create_chemcheck_report(data).subscribe({
              next: (res: any) => {
                const report = res.data.attributes
                this.Form.controls['chemcheck_name'].setValue(res.data.attributes.document_name)
                this.Form.controls['chemcheck_format'].setValue(res.data.attributes.document_format)
                this.Form.controls['chemcheck_id'].setValue(res.data.attributes.document_id)
                this.Form.controls['chem_check_report'].setValue(res.data.id)
                this.report_id = res.data.id
                if (report?.document_name && report?.document_format && report?.document_id) {
                  this.existChemcheck = true;
                  const url = `${environment.client_backend}/uploads/${report.document_name}.${report.document_format}`;

                  this.generalService.getImage(url).subscribe((data: any) => {
                    let docData: any[] = []
                    docData.push({
                      size: data.size,
                      name: report.document_name,
                      type: report.document_format
                    })
                    this.chemcheckreportFile.push(docData[0])
                  });
                } else {
                  this.existChemcheck = false;
                  this.chemcheckreportFile = [];
                }
              },
              error: (err: any) => {

              },
              complete: () => {
                this._snackBar.open("ChemCheck Report added successfully", 'OK', {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });

                this.chemcheckreportFile = [];
                this.Form.controls['chemcheck'].setValue(true);

              }
            });
          },
          error: (err: any) => {
            console.error("Upload error:", err);
          }
        });
      });
    }
  }

  get_inventory_apeo_stmt() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.chemicalService.inventory_details(this.Form.value.org_id, reference).subscribe({
      next: (result: any) => {

        this.Form.controls['apeo_npe'].setValue(result.data[0].attributes.apeo_npe)
        this.Form.controls['apeo_statement'].setValue(result.data[0].attributes?.apeo_statement?.data?.id)
        this.Form.controls['statement_id'].setValue(result.data[0].attributes?.apeo_statement?.data?.attributes?.statement_id)
        const statement_name = result.data[0].attributes.apeo_statement?.data?.attributes?.statement_name
        const statement_format = result.data[0].attributes.apeo_statement?.data?.attributes?.statement_format
        const statement_id = result.data[0].attributes.apeo_statement?.data?.attributes?.statement_id
        this.Form.controls['statement_name'].setValue(statement_name)
        this.Form.controls['statement_format'].setValue(statement_format)
        this.Form.controls['statement_id'].setValue(statement_id)
        if (statement_name && statement_format && statement_id) {
          this.Form.controls['apeo_npe'].setValue(true)
          this.statements = []
          this.generalService.getImage(environment.client_backend + '/uploads/' + statement_name + '.' + statement_format).subscribe((data: any) => {
            let docData: any[] = []
            docData.push({
              size: data.size,
              name: statement_name,
              type: statement_format
            })
            this.statements.push(docData[0])
          })
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  onRemoveStatement(event: any) {
    this.statements.splice(this.statements.indexOf(event), 1);
    this.delete_apeo_statement()
  }

  delete_apeo_statement() {
    const docID = this.Form.value.statement_id
    this.showProgressPopup();
    this.generalService.destroy(docID).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.disconnect_apeo_statement()
      }
    })
  }

  disconnect_apeo_statement() {
    const docID = this.Form.value.apeo_statement
    this.chemicalService.disconnect_apeo_statement(docID).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
        const statusText = "APEO/NPE free compliance statement removed successfully"
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.get_inventory_apeo_stmt()
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

  delete_msds_document() {
    const docID = this.Form.value.document_id
    this.showProgressPopup();
    this.generalService.destroy(docID).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.disconnect_msds_document()

      }
    })
  }

  disconnect_msds_document() {
    const docID = this.Form.value.msdc_document
    this.chemicalService.disconnect_msds_document(docID).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.files = []
        Swal.close()
        const statusText = "MSDS/SDS has removed successfully"
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.get_inventory_msds_document();

      }
    })
  }


  issuedDateVal(date: any) {
    const selectedDate = new Date(date.value);
    const expiryDate = new Date(selectedDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 3);
    this.Form.controls['msds_sds_expiry_date'].setValue(expiryDate);
    this.expiryDate.setValue(expiryDate);
    // Calculate the warning date (e.g., 3 months before expiry date)
    const warningDate = new Date(expiryDate);
    warningDate.setMonth(warningDate.getMonth() - 3);
    this.Form.controls['msds_warning_date'].setValue(warningDate);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['msds_sds_issued_date'].setValue(selectedDate);

    // Calculate the expiry date 3 years from the selected issue date
  }


  expiryDateVal(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)

    this.Form.controls['msds_sds_expiry_date'].setValue(selecteddate)
    var d = new Date(date.value);
    d.setMonth(d.getMonth() - 3);
    this.Form.controls['msds_warning_date'].setValue(d)
  }

  PPE(event: any) {
    this.Form.controls['use_of_ppe'].setValue(event.value.toString())
  }


  Standard(event: any) {
    const selectedData = this.standardList.find(data => data === event.value);
    this.Form.controls['product_standard'].setValue(selectedData)

  }
  async get_hazard_statement_codes(hazard_type: string) {
    try {
      const result: any = await this.chemicalService.get_hazard_statement_codes().toPromise();

      const hazardTypesArray = hazard_type.split(',');
      const filteredCodes = result.data.filter((item: any) =>
        hazardTypesArray.includes(item.attributes.filter)
      );

      const statementCodes = filteredCodes.map((item: any) =>
        item.attributes.hazard_statement_code
      );

      this.allstatementcodes = this.allstatementcodes.concat(statementCodes);

    } catch (err) {
      this.router.navigate(["/error/internal"]);
    }
  }


  HazardType(event: any) {
    this.Form.controls['hazardType'].setValue(event.value.toString());
    this.materiality_Issue();

    this.allstatementcodes = [];
    if (!event.value || event.value.length === 0) {
      this.hazardStatementCode = [];
      return;
    }

    if (event.value.includes("Not Applicable")) {
      // Remove validation and disable the fields
      this.Form.controls['ghsClassification'].reset()
      this.ghsClassification.reset();
      this.Form.controls['ghsClassification'].clearValidators();
      this.Form.controls['ghsClassification'].updateValueAndValidity();

      this.Form.controls['hazard_statement_code'].reset()
      this.hazardStatementCode = []
      this.statementCodeCtrl.reset();
      this.Form.controls['hazard_statement_code'].clearValidators();
      this.Form.controls['hazard_statement_code'].updateValueAndValidity();
    } else {
      // Restore validation and enable the fields
      this.Form.controls['ghsClassification'].setValidators([Validators.required]);
      this.Form.controls['ghsClassification'].updateValueAndValidity();

      this.Form.controls['hazard_statement_code'].setValidators([Validators.required]);
      this.Form.controls['hazard_statement_code'].updateValueAndValidity();
    }


    const observables = event.value.map((hazard_type: string) =>
      this.get_hazard_statement_codes(hazard_type)
    );

    forkJoin(observables).subscribe(() => {

      this.hazardStatementCode = this.hazardStatementCode.filter(code =>
        this.allstatementcodes.includes(code)
      );

    });
  }


  // HazardStatement(event: any) {
  //   this.Form.controls['hazard_statement'].setValue(event.value.toString())
  // }
  statementEvent(statement: any) {
    if (statement.attributes.banned === true) {

      Swal.fire({
        title: 'Are you sure?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "This chemical has been banned, is it need to continue?",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.close()
          this.Form.controls['hazard_statement'].setValue(statement.attributes.statement_name.toString())

        } else {
          Swal.close()
          this.hazard_statement.reset()
        }
      })
    } else {
      Swal.close()
      this.Form.controls['hazard_statement'].setValue(statement.attributes.statement_name.toString())
    }

  }
  materiality_Issue() {
    const type = this.Form.value.hazardType
    if (this.Form.value.hazardType) {
      const type2 = type.split(',')
      const data: Array<any> = []
      type2.forEach((element: any) => {
        const transactionData = this.IssueList.filter(function (elem) {
          return (elem.attributes.filter === element)
        })
        transactionData.forEach(elem2 => {
          data.push(elem2)
        })
      })
      this.Issues = data
    }
  }

  GhsClassification(event: any) {
    this.Form.controls['ghsClassification'].setValue(event.value.toString())
  }

  new_storage_place() {

    this.dialog.open(NewStorageComponent).afterClosed().subscribe((data: any) => {
      const name = data.name
      const found = this.storagePlace.find(obj => obj.attributes.name === name);
      if (found) {
        const statusText = "Storage place name already exist"
        this._snackBar.open(statusText, 'Close Warning', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        this.chemicalService.create_storage_place(name, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.chemicalService.get_storage_place().subscribe({
              next: (result: any) => {
                this.storagePlace = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Storage place created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['storage_place'].setValue(result.data.attributes.name)
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

  add_ppe() {

    this.dialog.open(NewPpeComponent).afterClosed().subscribe((data: any) => {
      const name = data.name
      const found = this.storagePlace.find(obj => obj.attributes.name === name);
      if (found) {
        const statusText = "PPE name already exist"
        this._snackBar.open(statusText, 'Close Warning', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        this.chemicalService.create_ppe(name, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.chemicalService.get_ppe().subscribe({
              next: (result: any) => {
                this.toppingList = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "PPE name added successfully"
                this._snackBar.open(statusText, 'Ok', {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['use_of_ppe'].setValue(result.data.attributes.name)
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

  deliveryDateVal(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['delivery_date'].setValue(selecteddate)
  }

  manufacturingDateVal(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['manufacturing_date'].setValue(selecteddate)
  }

  cheExpiryDateDateVal(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['expiry_date'].setValue(selecteddate)
  }

  invoiceDateVal(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['invoice_date'].setValue(selecteddate)
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

  createCertificate() {
    this.dialog.open(ChemicalCertificateComponent).afterClosed().subscribe(data => {
      if (data) {
        this.chemicalService.create_certificate(data, this.Form.value.id).subscribe({
          next: (resultL: any) => {
            if (data.files.length > 0) {
              data.files.forEach((cerDocument: any) => {
                this.evidenceCertificateFormData.delete('files')
                const extension = cerDocument.name.split('.').pop().toLowerCase()
                this.evidenceCertificateFormData.append('files', cerDocument, data.certificate_name + '.' + extension)
                this.generalService.upload(this.evidenceCertificateFormData).subscribe({
                  next: (result: any) => {
                    let data: any[] = []
                    data.push({
                      document_name: result[0].hash,
                      document_format: extension,
                      chemical_certificate: resultL.data.id,
                      document_id: result[0].id
                    })
                    this.chemicalService.create_certificate_document(data[0]).subscribe({
                      next: (result: any) => { },
                      error: (err: any) => { },
                      complete: () => {
                        this.chemical_certificates()
                      }
                    })
                  },
                  error: (err: any) => { },
                  complete: () => { }
                })
              })

            } else {
              this.chemical_certificates()
            }
          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
    })
  }

  chemical_certificates() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.chemicalService.inventory_certificates(this.Form.value.org_id, reference).subscribe({
      next: (result: any) => {
        this.certificateList = result.data[0].attributes.certificates.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  deleteCertificate(data: any) {
    this.certificateList.splice(this.certificateList.findIndex((existingCustomer) => existingCustomer.id === data.id), 1);
    const document_id = data.attributes?.chemical_certificate_doc?.data?.attributes.document_id
    const certificate_doc = data.attributes?.chemical_certificate_doc?.data?.id
    const certificate_id = data.id
    this.showProgressPopup();
    if (document_id) {

      this.generalService.delete_image(document_id).subscribe({
        next: (result: any) => {
          this.chemicalService.delete_chemical_certificate_doc(certificate_doc).subscribe({
            next: (result: any) => {
              this.chemicalService.delete_chemical_certificate(certificate_id).subscribe({
                next: (result: any) => { },
                error: (err: any) => { },
                complete: () => {
                  Swal.close()
                  const statusText = "Chemical Certiicate Removed"
                  this._snackBar.open(statusText, 'Close Warning', {
                    duration: 3000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });

                }
              })
            },
            error: (err: any) => { },
            complete: () => { }
          })
        },
        error: (err: any) => { },
        complete: () => { }
      })
    } else {
      this.chemicalService.delete_chemical_certificate(certificate_id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          Swal.close()
          const statusText = "Chemical Certiicate Removed"
          this._snackBar.open(statusText, 'Close Warning', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      })
    }
  }
  manufactureName(event: any) {
    if (this.Form.value.supplier_type === "Manufacturer") {
      this.Form.controls['manufacturer_name'].setValue(event.value);
    }
    const filteredDetails = this.supplierList.filter((data) => data.attributes.name === event.value
    )
    if (filteredDetails) {
      this.Form.controls['contact_number'].setValue(filteredDetails[0].attributes.contact_number);
      this.Form.controls['email_id'].setValue(filteredDetails[0].attributes.email);
      this.Form.controls['location'].setValue(filteredDetails[0].attributes.location);
    }
  }

  delete_supplier_name(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the supplier name.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.chemicalService.delete_supplier_name(id).subscribe({
          next: (result: any) => {
            this.Form.controls.supplier_name.reset()
          },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Supplier name deleted"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_supplier_name()
          }
        })
      }
    })
  }

  update_supplier_name(ID: any) {
    this.dialog.open(NewSupplierComponent, { data: ID }).afterClosed().subscribe((data: any) => {
      if (data) {
        this.chemicalService.update_supplier_name(data).subscribe({
          next: (result: any) => {
            this.chemicalService.get_supplier_name().subscribe({
              next: (getresult: any) => {
                this.supplierList = getresult.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Supplier name updated successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['supplier_name'].setValue(result.data.attributes.name)
                this.Form.controls['contact_number'].setValue(result.data.attributes.contact_number);
                this.Form.controls['email_id'].setValue(result.data.attributes.email);
                this.Form.controls['location'].setValue(result.data.attributes.location);
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

  submit() {
    this.Form.controls['status'].setValue('Published')
    this.Form.controls['published_by'].setValue(this.Form.value.reporter)
    this.confirmation()
  }

  confirmation() {

    if (this.Form.value.supplier_type === "Manufacturer") {
      this.Form.controls['manufacturer_name'].enable();
      this.Form.controls['manufacturer_name'].setValue(this.Form.value.supplier_name);

    } else {
    }
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

        this.showProgressPopup()
        if (this.Form.value.apeo_npe === false) {
          const docID = this.Form.value.statement_id
          if (docID) {
            this.generalService.destroy(docID).subscribe({
              next: (result: any) => {
                this.disconnect_apeo_statement()
                this.statements = [];
              },
              error: (err: any) => { },
              complete: () => {

              }
            })
          }

        }
        this.update_inventory()


      } else {
        this.Form.controls['status'].setValue('Approved')
        this.Form.controls['published_by'].reset()
      }
    })
  }
  // const selectedData = this.divisions.find(data => data.division_name === event.value);
  //   this.Form.controls['division'].setValue(selectedData.division_name)

  draft() {

    if (this.Form.value.supplier_type === "Manufacturer") {
      this.Form.controls['manufacturer_name'].enable();
      this.Form.controls['manufacturer_name'].setValue(this.Form.value.supplier_name);
    } else {
    }
    this.confirmation()
  }

  add_standard() {

    this.dialog.open(CreateProductStandardComponent).afterClosed().subscribe((data: any) => {
      const name = data.name
      const found = this.standardList.find(obj => obj.name === name);
      if (found) {
        const statusText = " Standard already exist"
        this._snackBar.open(statusText, 'Close Warning', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        this.chemicalService.create_product_standard(name, this.userId).subscribe({
          next: (result: any) => {
            this.ProductStandard.setValue(result.data.attributes.name)
            this.Form.controls['product_standard'].setValue(result.data.attributes.name)
            this.get_standard_list();
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })
      }
    })
  }

  update_inventory() {

    this.chemicalService.update_inventory(this.Form.value).subscribe({
      next: (result: any) => {
        if (result.data.attributes.status === "Published") {
          Swal.fire({
            title: 'Inventory Published',
            imageUrl: "assets/images/chemical.gif",
            imageWidth: 250,
            text: "You have successfully published a chemical inventory.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/chemical-management/inventory"]);
          });
        } else if (result.data.attributes.status === "Approved") {
          Swal.close();
          const statusText = "Details updated successfully";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.statements = [];
          this.Form.reset();
          //  this.get_inventory_details();
          window.location.reload();
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"]);
      },
      complete: () => {


        if (!this.existMsds) {
          this.existing_upload_msds_document()

        }
        // window.location.reload();
      },
    });
  }
  removeCode(code: string): void {
    const index = this.hazardStatementCode.indexOf(code);
    if (index >= 0) {
      this.hazardStatementCode.splice(index, 1);
      this.Form.controls['hazard_statement_code'].setValue(this.hazardStatementCode.join(','));
      // Restore the removed code to the autocomplete options
      this.filteredstatementcode = this.statementCodeCtrl.valueChanges.pipe(
        startWith(null),
        map((part: string | null) => part ? this._filterstatementCodes(part) : this.getFilteredCodes())
      );
    }
  }

  addStatementCode(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.hazardStatementCode.push(value);
    }
    event.chipInput!.clear();
    this.statementCodeCtrl.setValue(null);
  }
  selectedStatementCode(event: MatAutocompleteSelectedEvent): void {
    const selectedCode = event.option.value;

    this.chemicalService.get_hazard_statement_codes().subscribe({
      next: (result: any) => {
        const selectedEntry = result.data.find((entry: any) => entry.attributes.hazard_statement_code === selectedCode);

        if (selectedEntry && selectedEntry.attributes.banned === true) {
          Swal.fire({
            title: 'Are you sure?',
            imageUrl: "assets/images/chemical.gif",
            imageWidth: 250,
            text: "This chemical Hazard Statement Code has been banned, is it need to continue?",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.close()
              this.hazardStatementCode.push(selectedCode);
              this.Form.controls['hazard_statement_code'].setValue(this.hazardStatementCode.toString());
              this.statementCodeInput.nativeElement.value = '';
              this.statementCodeCtrl.setValue(null);

              // Update the filteredstatementcode Observable
              this.filteredstatementcode = this.statementCodeCtrl.valueChanges.pipe(
                startWith(null),
                map((code: string | null) => code ? this._filterstatementCodes(code) : this.getFilteredCodes())
              );
            } else {
              Swal.close()
            }
          })
        } else {
          this.hazardStatementCode.push(selectedCode);
          this.Form.controls['hazard_statement_code'].setValue(this.hazardStatementCode.toString());
          this.statementCodeInput.nativeElement.value = '';
          this.statementCodeCtrl.setValue(null);

          // Update the filteredstatementcode Observable
          this.filteredstatementcode = this.statementCodeCtrl.valueChanges.pipe(
            startWith(null),
            map((code: string | null) => code ? this._filterstatementCodes(code) : this.getFilteredCodes())
          );
        }
      },
      error: (err: any) => { },
      complete: () => { }
    });


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



  navigate() {
    this.backToHistory = true
    this._location.back();
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
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

}
