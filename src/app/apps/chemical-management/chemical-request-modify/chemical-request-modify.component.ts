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
import { CreateChemicalNameComponent } from '../chemical-request/create-chemical-name/create-chemical-name.component';
const { Configuration, OpenAIApi } = require("openai");
import Swal from 'sweetalert2'
import { forkJoin } from 'rxjs';
import { saveAs } from 'file-saver'
import { CreateProductStandardComponent } from '../chemical-request/create-product-standard/create-product-standard.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ChemicalMsdsDocumentComponent } from '../chemical-msds-document/chemical-msds-document.component';
import { category } from '../../audit-inspection/audit-calendar/audit-calendar/data';
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
  selector: 'app-chemical-request-modify',
  templateUrl: './chemical-request-modify.component.html',
  styleUrls: ['./chemical-request-modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChemicalRequestModifyComponent implements OnInit {

  Form: FormGroup
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  divisions: any[] = []
  commercialName: any[] = []
  zdhcCategory: any[] = []
  peopleList: any[] = []
  DivisionFilteredpeopleList: any[] = [];
  issuedDate = new FormControl(null);
  expiryDate = new FormControl(null);
  currency: string
  orgID: string
  files: File[] = [];
  requestedUnit: any[] = []
  dropdownValues: any[] = []
  requestedUnitVal: string
  Categories: any[] = []
  filteredZdhcCategory: any[] = []
  chemical_dropdown: any
  Division = new FormControl(null, [Validators.required]);
  ghsClassifications: any[] = []
  IssueList: any[] = []
  hazardStatementCode: any[] = [];
  allstatementcodes: string[] = [];
  hazardTypes: any[] = []
  evidenceFormData = new FormData()
  Issues: any[] = []
  zdhcLevel: any[] = []
  toppingList: any[] = []
  msds_sdsValue: boolean = false;
  standardList: any[] = []
  TypeList: any[] = []
  userId: any
  ProductStandard = new FormControl(null);
  use_of_ppe = new FormControl(null);
  hazardType = new FormControl(null);
  ghsClassification = new FormControl(null);
  requestDate = new FormControl(null);
  maxDate = new Date();
  existMsds = false
  chemicalId: string;
  chemicalRequestSortedDatas: any[] = []
  msdsSortedDatas: any[] = []
  msdsSortedDatasPdf: any[] = []
  existingMsds = new Blob();
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

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private generalService: GeneralService,
    private chemicalService: ChemicalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private currencyPipe: CurrencyPipe,
    private route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
    this.configuration()

    this.Form = this.formBuilder.group({
      org_id: [''],
      id: [''],
      reference_number: [''],
      division: ['', [Validators.required]],
      request_date: [null],
      requested_customer: [''],
      requested_merchandiser: [''],
      requested_unit: ['', [Validators.required]],
      reported_date: [new Date()],
      requested_quantity: [null, [Validators.required]],
      commercial_name: ['', [Validators.required]],
      substance_name: [''],
      formula: [''],
      reach_regi_number: [''],
      zdhc_use_category: ['', [Validators.required]],
      where_why: ['', [Validators.required]],
      status: ['Open', [Validators.required]],
      reporter: ['', [Validators.required]],
      updated_By: ['', [Validators.required]],
      approver_remarks: [''],
      reviewer_remarks: [''],
      reviewer: ['', [Validators.required]],
      chemical_uuid: [''],
      business_unit: [null],
      product_standard: [''],
      chemical_form: ['', [Validators.required]],
      zdhc_level: [''],
      cas_no: [''],
      colour_index: [''],
      use_of_ppe: [''],
      hazardType: [''],
      ghsClassification: [''],
      document_name: [''],
      document_format: [''],
      document_id: [''],
      msdc_document: [''],
      msds_sds_issued_date: [null],
      msds_sds_expiry_date: [null],
      msds_sds_document: [null],
      msds_sds: [false],
      msds_doc_status: [null],
      msds_warning_date: [null],
      review_status_notification: [null],
      msds_document: [null],
      category: ['', [Validators.required]],
      approval_valid_date: null


    });
    this.get_dropdown_values()
    this.get_ppe_list()
    this.get_chemForm_dropdown()
    this.get_standard_list()
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
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
        const status = result.chem_request_create
        this.userId = result.id
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['updated_By'].setValue(result.profile.id)
          this.get_dropdown_values()
          this.get_divisions()
          this.get_chemical_name()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_dropdown_values() {
    const module = "Chemical Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        const category = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Category")
        })
        //this.Categories = category
        this.Categories = category.sort((a: any, b: any) => {
          if (a.attributes.Value === 'Others') return 1;
          if (b.attributes.Value === 'Others') return -1;
          return a.attributes.Value
            .localeCompare(b.attributes.Value)
        })
        this.deliverunit()
        this.zdhccategories()
        this.get_chemical_name()
        this.zdhclevels()
        this.hazardtype()
        this.ghsclassification()

      },
      error: (err: any) => { },
      complete: () => { }
    })
  }


  get_chemical_name() {
    this.chemicalService.get_chemical_name().subscribe({
      next: (result: any) => {
        this.commercialName = result.data



        this.get_profiles()
      }
    })
  }

  get_profiles() {
    this.chemicalService.get_chem_reviewers().subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {

      }
    });
  }

  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        this.divisions = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.get_chemical_request_details()
      }
    })
  }

  get_chemical_request_details() {
    const cheID = this.route.snapshot.paramMap.get('id');
    this.chemicalService.get_chemical_details(cheID).subscribe({
      next: (result: any) => {

        if (result.data.attributes.status === "Rejected" || result.data.attributes.status === "Draft" && result.data.attributes.reporter.data.id == this.Form.value.updated_By) {

          this.Form.controls['id'].setValue(result.data.id)
          this.Form.controls['reference_number'].setValue(result.data.attributes.reference_number)
          this.Form.controls['division'].setValue(result.data.attributes.division)
          this.Form.controls['business_unit'].setValue(result.data.attributes.business_unit.data.id)


          this.Form.controls['reported_date'].setValue(result.data.attributes.created_date)
          this.Form.controls['request_date'].setValue(result.data.attributes.request_date)
          this.requestDate.setValue(new Date(result.data.attributes.request_date))
          this.Form.controls['requested_customer'].setValue(result.data.attributes.requested_customer)
          this.Form.controls['requested_unit'].setValue(result.data.attributes.requested_unit)
          this.Form.controls['requested_quantity'].setValue(result.data.attributes.requested_quantity)
          this.Form.controls['requested_merchandiser'].setValue(result.data.attributes.requested_merchandiser)
          this.Form.controls['commercial_name'].setValue(result.data.attributes.commercial_name)
          this.Form.controls['substance_name'].setValue(result.data.attributes.substance_name)
          this.Form.controls['formula'].setValue(result.data.attributes.formula)
          this.Form.controls['reach_regi_number'].setValue(result.data.attributes.reach_registration_number)
          this.Form.controls['category'].setValue(result.data.attributes.category)
          const zdhc = this.zdhcCategory.filter(function (elem: any) {
            return (elem.attributes.filter === result.data.attributes.category && result.data.attributes.category !== null)
          })
          this.filteredZdhcCategory = zdhc.sort((a: any, b: any) => {

            return a.attributes.Value
              .localeCompare(b.attributes.Value)
          })
          // this.filteredZdhcCategory = zdhc
          this.Form.controls['zdhc_use_category'].setValue(result.data.attributes.ZDHC_use_category)
          this.Form.controls['chemical_form'].setValue(result.data.attributes.chemical_form_type)
          this.Form.controls['approver_remarks'].setValue(result.data.attributes.approver_remarks)
          this.Form.controls['reviewer_remarks'].setValue(result.data.attributes.reviewer_remarks)
          this.Form.controls['reviewer'].setValue(result.data.attributes.reviewer.data?.id)
          this.Form.controls['reporter'].setValue(result.data.attributes.reporter.data.id)
          this.Form.controls['chemical_uuid'].setValue(result.data.attributes.chemical_uuid)
          this.Form.controls['where_why'].setValue(result.data.attributes.usage)
          this.Form.controls['status'].setValue(result.data.attributes.status)
          this.Form.controls['product_standard'].setValue(result.data.attributes.product_standard)
          this.Division.setValue(result.data.attributes.division)
          this.ProductStandard.setValue(result.data.attributes.product_standard)
          this.Form.controls['cas_no'].setValue(result.data.attributes.cas_no)
          this.Form.controls['colour_index'].setValue(result.data.attributes.colour_index)
          this.Form.controls['zdhc_level'].setValue(result.data.attributes.zdhc_level)

          if (result.data.attributes.use_of_ppe) {
            this.use_of_ppe.setValue(result.data.attributes.use_of_ppe.split(','))
          }

          if (result.data.attributes.hazard_type) {
            const hazardTypes = result.data.attributes.hazard_type.split(',');

            this.hazardType.setValue(hazardTypes);

            const observables = hazardTypes.map((hazard_type: string) =>
              this.get_hazard_statement_codes(hazard_type)
            );
            forkJoin(observables).subscribe(() => {
            });
          }

          if (result.data.attributes.approval_valid_date) {
            this.Form.controls['approval_valid_date'].setValue(result.data.attributes.approval_valid_date)


          }


          if (result.data.attributes.ghs_classification) {
            this.ghsClassification.setValue(result.data.attributes.ghs_classification.split(','))
          }
          this.Form.controls['hazardType'].setValue(result.data.attributes.hazard_type)
          this.materiality_Issue()
          this.Form.controls['use_of_ppe'].setValue(result.data.attributes.use_of_ppe)
          this.Form.controls['ghsClassification'].setValue(result.data.attributes.ghs_classification)

          const document_name = result.data.attributes.msds_document?.data?.attributes?.document_name
          const document_format = result.data.attributes.msds_document?.data?.attributes?.document_format
          const document_id = result.data.attributes.msds_document?.data?.attributes?.document_id
          const msdc_document = result.data.attributes.msds_document?.data?.id
          this.Form.controls['document_name'].setValue(document_name)
          this.Form.controls['document_format'].setValue(document_format)
          this.Form.controls['document_id'].setValue(document_id)
          this.Form.controls['msdc_document'].setValue(msdc_document)



          if (document_name && document_format && document_id) {


            this.existMsds = true
            this.Form.controls['msds_sds'].setValue(true)
            this.Form.controls['msds_doc_status'].setValue('ok')
            this.validate_msds()
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

          this.Form.controls['msds_sds'].setValue(result.data.attributes.msds_sds)
          if (result.data.attributes.msds_sds_issued_date) {
            this.issuedDate.setValue(new Date(result.data.attributes.msds_sds_issued_date))
            this.Form.controls['msds_sds_issued_date'].setValue(result.data.attributes.msds_sds_issued_date)
          }
          if (result.data.attributes.msds_sds_expiry_date) {
            this.expiryDate.setValue(new Date(result.data.attributes.msds_sds_expiry_date))
            this.Form.controls['msds_sds_expiry_date'].setValue(result.data.attributes.msds_sds_expiry_date)
          }
        } else {
          this.router.navigate(["/apps/chemical-management/request-history"])
        }

        this.initialFilteredReviewer(result.data.attributes.business_unit.data.attributes.division_uuid)

      },
      error: (err: any) => { },
      complete: () => {

      }
    })
  }

  fetchExistingMsds() {

    const commercialName = this.Form.value.commercial_name
    const selectedComercialNameData = this.commercialName.find(name => name.attributes.name === commercialName);
    this.chemicalId = selectedComercialNameData.attributes.uuid


    this.chemicalService.get_chemical_request_with_uid(this.chemicalId).subscribe({
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
          this.Form.controls['msds_document'].setValue(this.msdsSortedDatas[0].attributes.msds_document.data.id)
          this.Form.controls['msds_doc_status'].setValue('ok')
          this.issuedDate.setValue(this.msdsSortedDatas[0].attributes.msds_sds_issued_date)
          this.expiryDate.setValue(this.msdsSortedDatas[0].attributes.msds_sds_expiry_date)
          this.Form.controls['msds_sds_issued_date'].setValue(this.msdsSortedDatas[0].attributes.msds_sds_issued_date)
          this.Form.controls['msds_sds_expiry_date'].setValue(this.msdsSortedDatas[0].attributes.msds_sds_expiry_date)
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
        }

        this.files = []

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {


      }
    })
  }

  BusinessUnit(event: any) {
    const selectedData = this.divisions.find(data => data.attributes.division_name === event.value);
    this.Form.controls['division'].setValue(selectedData.attributes.division_name)
    this.Form.controls['business_unit'].setValue(selectedData.id)

    this.DivisionFilteredpeopleList = this.peopleList.filter((data) =>
      data.attributes.divisions.data
        .map((division: any) => division.attributes.division_uuid)
        .includes(selectedData.attributes.division_uuid)
    );
  }

  initialFilteredReviewer(data: string): void {
    const selectedBusinessUnitUuid = data
    this.DivisionFilteredpeopleList = this.peopleList.filter((data) =>
      data.attributes.divisions.data
        .map((division: any) => division.attributes.division_uuid)
        .includes(selectedBusinessUnitUuid)
    );
  }


  deliverunit() {
    this.requestedUnit = []
    const deliverunit = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Delivered Unit")
    })
    this.requestedUnit = deliverunit
  }

  zdhccategories() {
    this.zdhcCategory = []
    const category = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "ZDHC Use Category")
    })
    this.zdhcCategory = category
  }

  async chatGPT() {

  }

  new_name() {

    this.dialog.open(CreateChemicalNameComponent).afterClosed().subscribe((data: any) => {
      const found = this.commercialName.find(obj => obj.attributes.name === data.name);
      if (found) {
        const statusText = "Commercial name already exist"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        this.chemicalService.create_name(data, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.chemicalService.get_chemical_name().subscribe({
              next: (result: any) => {
                this.commercialName = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Commercial name created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['commercial_name'].setValue(result.data.attributes.name)
                this.requestedUnitVal = result.data.attributes.unit
                this.chatGPT()
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

  complete() {
    this.Form.controls['status'].setValue('Open')
    this.Form.controls['review_status_notification'].setValue(false)
    this.submit()
  }

  draft() {


    this.Form.controls['status'].setValue('Draft')
    this.submit()

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

  onCategorySelection(event: any) {
    const ZdhcCategory = this.zdhcCategory.filter(function (elem: any) {
      return (elem.attributes.filter === event.value)
    })
    // this.filteredZdhcCategory = ZdhcCategory
    this.filteredZdhcCategory = ZdhcCategory.sort((a: any, b: any) => {

      return a.attributes.Value
        .localeCompare(b.attributes.Value)
    })
  }

  submit() {
    this.showProgressPopup();

    if (this.Form.controls['status'].value !== 'Draft') {
      const approvalValidDate = new Date(this.Form.controls['approval_valid_date'].value);
      const currentDate = new Date();
      approvalValidDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      if (approvalValidDate && approvalValidDate >= currentDate) {

        this.Form.controls['status'].setValue("Approved")
        this.createChemicalInventory()

      } else {
        // this.create_request()
      }

    } else {
      // this.create_request()
    }


    if (!this.existMsds) {
      this.existing_upload_msds_document()
    }
    this.chemicalService.update_request(this.Form.value).subscribe({
      next: (result: any) => {
        if (this.Form.value.status === 'Draft') {
          const statusText = "Chemical request details saved"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.router.navigate(["/apps/chemical-management/modify-request/" + this.Form.value.id])
        }
        else {
          Swal.fire({
            title: 'Chemical request updated successfully',
            imageUrl: "assets/images/confirm.gif",
            imageWidth: 250,
            text: "Your chemical request has updated successfully and submitted for approval.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/chemical-management/request-history"])
          })
        }

      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
  }

  createChemicalInventory() {
    const msdsDocumentID = this.Form.controls['msdc_document'].value
    this.Form.controls['msds_document'].setValue(msdsDocumentID)


    this.chemicalService.create_chemical_inventory_approval(this.Form.value).subscribe({


      next: (result: any) => {
        //this.Form.controls['chemical_inventory'].setValue(result.id)
        // if (!this.Form.value.msds_document) {
        //   this.upload_msds_document()
        // } else {
        //   this.existing_upload_msds_document()
        // }
      },
      error: (err: any) => { },
      complete: () => {
      }
    })
  }

  findUnit(data: any) {

    this.Form.controls['chemical_uuid'].setValue(data.attributes.uuid)

  }
  get_ppe_list() {
    this.chemicalService.get_ppe().subscribe({
      next: (result: any) => {
        this.toppingList = result.data
      }
    })
  }
  onCommercialNameSelected(selectedName: string) {

    const selectedOption = this.commercialName.find(name => name.attributes.name === selectedName);

    this.chemicalId = selectedOption.attributes.uuid



    if (selectedOption) {
      const zdchCategoryValue = selectedOption.attributes.ZDHC_Category;
      this.Form.patchValue({
        substance_name: selectedOption.attributes.substance_name,
        formula: selectedOption.attributes.formula,
        reach_regi_number: selectedOption.attributes.reach_registration_number,
        where_why: selectedOption.attributes.where_why,
        cas_no: selectedOption.attributes.cas_no,
        colour_index: selectedOption.attributes.colour_index
      });
      this.get_chemForm_dropdown()
      this.Form.controls['chemical_form'].setValue(selectedOption.attributes.chemical_form_type)
      this.zdhccategories()
      this.Form.controls['zdhc_use_category'].setValue(selectedOption.attributes.ZDHC_Category)
      this.get_dropdown_values()
      this.materiality_Issue()
      this.get_ppe_list()
      this.zdhclevels()
      this.Form.controls['zdhc_level'].setValue(selectedOption.attributes.zdhc_level)
      this.Form.controls['hazardType'].setValue(selectedOption.attributes.hazard_type)
      if (selectedOption.attributes.hazard_type) {
        const hazardTypes = selectedOption.attributes.hazard_type.split(',');
        this.hazardType.setValue(hazardTypes);
      }
      if (selectedOption.attributes.use_of_ppe) {
        this.use_of_ppe.setValue(selectedOption.attributes.use_of_ppe.split(','))
      }
      if (selectedOption.attributes.ghs_classification) {
        this.ghsClassification.setValue(selectedOption.attributes.ghs_classification.split(','))
      }
      this.materiality_Issue()
      this.Form.controls['use_of_ppe'].setValue(selectedOption.attributes.use_of_ppe)
      this.Form.controls['ghsClassification'].setValue(selectedOption.attributes.ghs_classification)

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
  HazardType(event: any) {
    this.Form.controls['hazardType'].setValue(event.value.toString());
    this.materiality_Issue();

    this.allstatementcodes = [];
    if (!event.value || event.value.length === 0) {
      this.hazardStatementCode = [];
      return;
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

  add_standard() {

    this.dialog.open(CreateProductStandardComponent).afterClosed().subscribe((data: any) => {
      const name = data.name
      const found = this.standardList.find(obj => obj.name === name);
      if (found) {
        const statusText = " Standard already exist"
        this._snackBar.open(statusText, 'Close Warning', {
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

  zdhclevels() {
    this.zdhcLevel = []
    const level = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "ZDHC Level")
    })
    this.zdhcLevel = level
  }
  hazardtype() {
    this.hazardTypes = []
    const hazardtype = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Hazard Type")
    })
    this.TypeList = hazardtype
  }
  ghsclassification() {
    this.ghsClassifications = []
    const ghsclassification = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "GHS Classification")
    })
    this.IssueList = ghsclassification
  }
  GhsClassification(event: any) {
    this.Form.controls['ghsClassification'].setValue(event.value.toString())
  }
  request_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1))
    this.Form.controls['request_date'].setValue(newDate);
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
  delete_commercial_name(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the commercial name.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.chemicalService.delete_commercial_name(id).subscribe({
          next: (result: any) => {
            this.Form.controls.commercial_name.reset()
          },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Commercial name deleted"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_chemical_name()
          }
        })
      }
    })
  }

  update_name(ID: any) {
    this.dialog.open(CreateChemicalNameComponent, { data: ID }).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.commercialName.find(obj => obj.attributes.name === data.name)
        this.chemicalService.update_commercial_name(data, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.chemicalService.get_chemical_name().subscribe({
              next: (result: any) => {
                this.commercialName = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Commercial name updated successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['commercial_name'].setValue(result.data.attributes.name)
                this.requestedUnitVal = result.data.attributes.unit
                this.chatGPT()
                this.onCommercialNameSelected(result.data.attributes.name)
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

  view_msds_document() {
    let docData: any[] = []
    docData.push({
      document_name: this.Form.value.document_name,
      document_format: this.Form.value.document_format
    })
    this.dialog.open(ChemicalMsdsDocumentComponent, { data: docData[0] })
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
  Standard(event: any) {
    const selectedData = this.standardList.find(data => data === event.value);
    this.Form.controls['product_standard'].setValue(selectedData)
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
      this.msdsSortedDatas = [];
      this.files = []
    }
    const docID = this.Form.value.document_id
    const cheID = this.Form.value.id
    if (status === false && docID && this.existMsds) {

      this.files = []
      this.issuedDate.reset()
      this.expiryDate.reset()
      this.Form.controls['msds_sds_issued_date'].reset()
      this.Form.controls['msds_sds_expiry_date'].reset()
      this.chemicalService.remove_request_msds_status(cheID).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.delete_msds_document()
        }
      })
    }
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

      this.chemicalService.remove_request_msds_status(cheID).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.delete_msds_document()
        }
      })
    } else {
      this.Form.controls['document_id'].reset()
    }

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
  onSelect(event: any) {
    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / 2560 / 2560
      if (size > 2) {
        const statusText = "Please choose a document below 5 MB"
        this._snackBar.open(statusText, 'Close Warning', {
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
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else if (fileLength < 6) {
      const statusText = "You have exceed the upload limit"
      this._snackBar.open(statusText, 'Close Warning', {
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
            chemical_request: this.Form.value.id,
            document_id: result[0].id
          })
          if (docID) {
            this.chemicalService.attach_msds_document(docID, data[0]).subscribe({
              next: (result: any) => {
                const cheID = this.Form.value.id
                this.chemicalService.create_req_msds_document(cheID).subscribe({
                  next: (result: any) => { },
                  error: (err: any) => { },
                  complete: () => {
                    const statusText = "MSDS/SDS has added successfully"
                    this._snackBar.open(statusText, 'OK', {
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                    });
                    this.files = []
                    this.get_request_msds_document()
                  }
                })
              },
              error: (err: any) => { },
              complete: () => { }
            })
          } else {
            this.chemicalService.create_req_msds_document(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                const statusText = "MSDS/SDS document added successfully"
                this._snackBar.open(statusText, 'OK', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.files = []
                this.get_request_msds_document()
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
      const fileName = `${this.Form.value.reference_number}_${currentYear}.${extension}`;
      this.evidenceFormData.append('files', this.existingMsds, fileName)

      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = []
          data.push({
            document_name: result[0].hash,
            document_format: extension,
            chemical_request: this.Form.value.id,
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
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                    });
                    this.files = []

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
                // const statusText = "MSDS/SDS document added successfully"
                // this._snackBar.open(statusText, 'OK', {
                //   horizontalPosition: this.horizontalPosition,
                //   verticalPosition: this.verticalPosition,
                // });
                this.files = []

              }
            })
          }
        },
        error: (err: any) => { },
        complete: () => { }
      })
    })
  }

  get_request_msds_document() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.chemicalService.get_chemical_details(reference).subscribe({
      next: (result: any) => {

        this.Form.controls['msds_sds'].setValue(result.data.attributes.msds_sds)
        this.Form.controls['msdc_document'].setValue(result.data.attributes?.msds_document?.data?.id)
        this.Form.controls['document_id'].setValue(result.data.attributes?.msds_document?.data?.attributes?.document_id)
        const document_name = result.data.attributes.msds_document?.data?.attributes?.document_name
        const document_format = result.data.attributes.msds_document?.data?.attributes?.document_format
        const document_id = result.data.attributes.msds_document?.data?.attributes?.document_id
        this.Form.controls['document_name'].setValue(document_name)
        this.Form.controls['document_format'].setValue(document_format)
        this.Form.controls['document_id'].setValue(document_id)
        if (document_name && document_format && document_id) {
          this.Form.controls['msds_sds'].setValue(true)
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

  PPE(event: any) {
    this.Form.controls['use_of_ppe'].setValue(event.value.toString())
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
    const chemicalName = this.Form.value.commercial_name; 
    const issuedDate = this.issuedDate.value;
    const issueYear = issuedDate ? new Date(issuedDate).getFullYear() : 'Year';
    const customName = `${chemicalName}_MSDS_${issueYear}.${documentFormat}`;
    const fileUrl = `${environment.client_backend}/uploads/${documentName}.${documentFormat}`;
    saveAs(fileUrl, customName);
  }
  disconnect_msds_document() {
    const docID = this.Form.value.msdc_document
    this.chemicalService.disconnect_msds_document(docID).subscribe({
      next: (result: any) => {
        const statusText = "MSDS/SDS has removed successfully"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
        this.get_request_msds_document()
        this.existMsds = false
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
