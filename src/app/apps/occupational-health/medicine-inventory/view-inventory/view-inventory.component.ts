import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { ViewMedicineDisposalComponent } from '../view-medicine-disposal/view-medicine-disposal.component';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';

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
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.component.html',
  styleUrls: ['./view-inventory.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewInventoryComponent implements OnInit {


  names: any[] = []
  supplierList: any[] = []
  suppliertypeList: any[] = []
  storagePlace: any[] = []
  deliveredUnit: any[] = []
  deliveredUnits: any[] = []
  medicineCount: number
  files: File[] = [];
  evidenceCount: number = 0
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  bodyPartCtrl = new FormControl('');
  orgID: string
  Form: FormGroup
  divisions: any[] = []
  IssueList: any[] = []
  TypeList: any[] = []
  Issues: any[] = []
  peopleList: any[] = []
  certificateList: any[] = []
  evidenceFormData = new FormData()
  evidenceCertificateFormData = new FormData()
  evidenceData: any
  dropdownValues: any
  pdfSource: any
  report: any
  imglnk: any = environment.client_backend + '/uploads/'
  format: any = ".png"
  currency: string
  expiryDate = new FormControl(null);
  deliveryDate = new FormControl(null, [Validators.required]);
  manufacturingDate = new FormControl(null);
  invoiceDate = new FormControl(null);
  disposalList: any[] = []
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
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

  constructor(private generalService: GeneralService,
    private medicineService: MedicineInventoryService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private currencyPipe: CurrencyPipe,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      reference_number: [''],
      reported_date: [new Date()],
      medicine_name: [''],
      generic_name: ['', [Validators.required]],
      status: [''],
      assignee: [null],
      reporter: [null],
      manufacturer_name: [''],
      dosage_strength: [''],
      form: [''],
      approver: [null],
      contact_number: [null, [Validators.required]],
      email_id: [null, [Validators.required]],
      supplier_type: ['', [Validators.required]],
      location: ['', [Validators.required]],
      invoice_reference: [''],
      usage_instructions: [''],
      delivered_quantity: [null],
      delivered_unit: [null],
      purchased_amount: [null],
      threshold_limit: [null],
      delivery_date: [null],
      division: [''],
      purchased_amount_val: [''],
      reporter_name: [''],
      reporter_designation: [''],
      supplier_name: [''],
      approver_name: [''],
      approver_designation: [''],
      reorder_threshold: [''],
      batch_number: [''],
      manufacturing_date: [null],
      expiry_date: [null],
      invoice_date: [null],
      published_by: [null],
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
        const status = result.med_view_inventory
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
    const medID = this.route.snapshot.paramMap.get('id');
    this.medicineService.get_inventory_details(medID).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data.attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/occupational-health/medicine-inventory/purchase-inventory"])
        } else {
          this.Form.controls['id'].setValue(result.data.id)
          this.Form.controls['reference_number'].setValue(result.data.attributes.reference_number)
          this.Form.controls['reported_date'].setValue(result.data.attributes.request_date)
          this.Form.controls['medicine_name'].setValue(result.data.attributes.medicine_name)
          this.Form.controls['generic_name'].setValue(result.data.attributes.generic_name)
          this.Form.controls['dosage_strength'].setValue(result.data.attributes.dosage_strength)
          this.Form.controls['form'].setValue(result.data.attributes.form)
          this.Form.controls['status'].setValue(result.data.attributes.status)
          this.Form.controls['division'].setValue(result.data.attributes.division)
          this.Form.controls['reporter_name'].setValue(result.data.attributes.reporter.data.attributes.first_name + ' ' + result.data.attributes.reporter.data.attributes.last_name)
          this.Form.controls['reporter_designation'].setValue(result.data.attributes.reporter.data.attributes.designation)
          this.Form.controls['approver_name'].setValue(result.data.attributes.approver.data.attributes.first_name + ' ' + result.data.attributes.approver.data.attributes.last_name)
          this.Form.controls['approver_designation'].setValue(result.data.attributes.approver.data.attributes.designation)
          this.Form.controls['supplier_name'].setValue(result.data.attributes.supplier_name)
          this.Form.controls['contact_number'].setValue(result.data.attributes.supplier_contact_number)
          this.Form.controls['email_id'].setValue(result.data.attributes.supplier_email_id)
          this.Form.controls['supplier_type'].setValue(result.data.attributes.supplier_type)
          this.Form.controls['location'].setValue(result.data.attributes.location)
          this.Form.controls['reorder_threshold'].setValue(result.data.attributes.reorder_threshold)
          this.Form.controls['usage_instructions'].setValue(result.data.attributes.usage_instructions)
          this.Form.controls['medicine_type'].setValue(result.data.attributes.medicine_type)

          if (result.data.attributes.manufacturing_date) {
            this.manufacturingDate.setValue(new Date(result.data.attributes.manufacturing_date))
            this.Form.controls['manufacturing_date'].setValue(result.data.attributes.manufacturing_date)
          }
          if (result.data.attributes.expiry_date) {
            this.expiryDate.setValue(new Date(result.data.attributes.expiry_date))
            this.Form.controls['expiry_date'].setValue(result.data.attributes.expiry_date)
          }
          if (result.data.attributes.invoice_date) {
            this.invoiceDate.setValue(new Date(result.data.attributes.invoice_date))
            this.Form.controls['invoice_date'].setValue(result.data.attributes.invoice_date)
          }
          this.Form.controls['manufacturer_name'].setValue(result.data.attributes.manufacturer_name)
          this.Form.controls['batch_number'].setValue(result.data.attributes.batch_number)

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
          this.disposalList = result.data.attributes?.medicine_disposals?.data
        }
      },
      error: (err: any) => { },
      complete: () => {
        this.Form.disable()
        this.expiryDate.disable()
        this.deliveryDate.disable()
        this.manufacturingDate.disable()
        this.invoiceDate.disable()
      }
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

  expiryDateDateVal(date: any) {
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
    this.router.navigate(["/apps/occupational-health/medicine-inventory/purchase-inventory"])
    this.backToHistory = true
  }

  viewDiposal(data: any) {
    this.dialog.open(ViewMedicineDisposalComponent, { data: data })
  }
  navigate() {
    this.backToHistory = true
    this.router.navigate(["/apps/occupational-health/medicine-inventory/purchase-inventory"])
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

}
