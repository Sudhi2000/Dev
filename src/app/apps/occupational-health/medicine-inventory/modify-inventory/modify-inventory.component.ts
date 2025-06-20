import { Component, OnInit, ViewChild } from '@angular/core';
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
import { CurrencyPipe, Location } from '@angular/common';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';
import { NewSupplierComponent } from '../new-supplier/new-supplier.component';
import { CreateMedicineTypeComponent } from './create-medicine-type/create-medicine-type.component';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { medicine_inventory } from 'src/app/services/schemas';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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
  selector: 'app-modify-inventory',
  templateUrl: './modify-inventory.component.html',
  styleUrls: ['./modify-inventory.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ModifyInventoryComponent implements OnInit {

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
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  Authperson: any
  medicineUuid: any
  divisions: any[] = []
  IssueList: any[] = []
  TypeList: any[] = []
  unitSpecific: any
  Issues: any[] = []
  medicineRegister: any[] = []
  businessUnit: any
  medicineTypes: any[] = []
  medicineForm: any[] = []
  certificateList: any[] = []
  evidenceFormData = new FormData()
  evidenceCertificateFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  evidenceData: any
  dropdownValues: any
  corporateUser: any
  pdfSource: any
  report: any
  imglnk: any = environment.client_backend + '/uploads/'
  format: any = ".png"
  currency: string
  expiryDate = new FormControl(null, [Validators.required]);
  deliveryDate = new FormControl(null, [Validators.required]);
  manufacturingDate = new FormControl(null);
  invoiceDate = new FormControl(null);
  isLoading = true;
  totalItems = 0;
  pageSize = 10;
  backToHistory: Boolean = false
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<medicine_inventory>;

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
    private clinicalService: ClinicalSuiteService,
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
      reported_date: [new Date()],
      medicine_name: [''],
      generic_name: ['', [Validators.required]],
      status: [''],
      assignee: [null],
      reporter: [null],
      manufacturer_name: [''],
      dosage_strength: ['', [Validators.required]],
      form: ['', [Validators.required]],
      approver: [null],
      contact_number: [null],
      email_id: [null],
      supplier_type: [''],
      location: [''],
      invoice_reference: [''],
      usage_instructions: [''],
      delivered_quantity: [null, [Validators.required]],
      delivered_unit: [null],
      purchased_amount: [null, [Validators.required]],
      threshold_limit: [null, [Validators.required]],
      delivery_date: [null, [Validators.required]],
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
      expiry_date: [null, [Validators.required]],
      invoice_date: [null],
      published_by: [null],
      medicine_type: ['', [Validators.required]]

    });



  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health
        this.unitSpecific = result.data.attributes.business_unit_specific
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
        const status = result.med_modify_inventory
        this.corporateUser = result.profile.corporate_use
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
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
    this.medicineService.get_inventory_details(cheID).subscribe({
      next: (result: any) => {
        if (result.data.attributes.status === "Approved") {
          this.Form.controls['id'].setValue(result.data.id)
          this.Form.controls['reference_number'].setValue(result.data.attributes.reference_number)
          this.Form.controls['reported_date'].setValue(result.data.attributes.request_date)
          this.Form.controls['medicine_name'].setValue(result.data.attributes.medicine_name)
          this.Form.controls['generic_name'].setValue(result.data.attributes.generic_name)
          this.Form.controls['dosage_strength'].setValue(result.data.attributes.dosage_strength)
          this.Form.controls['form'].setValue(result.data.attributes.form)
          this.Form.controls['status'].setValue(result.data.attributes.status)
          this.Form.controls['division'].setValue(result.data.attributes.division)
          this.businessUnit = result.data.attributes.business_unit?.data.id
          this.Form.controls['reporter_name'].setValue(result.data.attributes.reporter.data.attributes.first_name + ' ' + result.data.attributes.reporter.data.attributes.last_name)
          this.Authperson = result.data.attributes.reporter.data.id
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
          this.medicineUuid = result.data.attributes.medicine_uuid

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
        } else {
          this.router.navigate(["/apps/occupational-health/medicine-inventory/purchase-inventory"])

        }

      },
      error: (err: any) => { },
      complete: () => {
        this.Form.controls['medicine_name'].disable()
        this.Form.controls['generic_name'].disable()
        this.Form.controls['division'].disable()
      }
    })

    this.get_dropdown_values()
    this.get_supplier_name()
    this.get_medicine_type()
    this.get_medicine_forms()
  }

  get_dropdown_values() {
    const module = "Chemical Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        this.suppliertypes()
        this.deliverunit()
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_medicine_forms() {
    const module = "Occupational Health"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {

        const form = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Medicine Form")
        })
        this.medicineForm = form
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_supplier_name() {
    this.medicineService.get_medicine_supplier().subscribe({
      next: (result: any) => {
        this.supplierList = result.data
      }
    })
  }

  get_medicine_type() {
    this.medicineService.get_medicine_type().subscribe({
      next: (result: any) => {
        this.medicineTypes = result.data
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


  new_type() {
    this.dialog.open(CreateMedicineTypeComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        this.medicineService.create_medicine_type(data.type, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.medicineService.get_medicine_type().subscribe({
              next: (result: any) => {
                this.medicineTypes = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Medicine type created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['medicine_type'].setValue(result.data.attributes.type)

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

  onSupplierSelected(SupplierName: string) {
    const selectedOption = this.supplierList.find(name => name.attributes.name === SupplierName);
    if (selectedOption) {
      this.Form.patchValue({
        contact_number: selectedOption.attributes.contact_number,
        email_id: selectedOption.attributes.email,
        location: selectedOption.attributes.location,
      });
    }
  }
  new_supplier_name() {
    this.dialog.open(NewSupplierComponent, { width: "500px" }).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.supplierList.find(obj => obj.attributes.name === data.name);
        if (found) {
          const statusText = "Supplier name already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.Form.controls['supplier_name'].setValue(data.name)
        }
        else {
          this.medicineService.create_medicine_supplier(data, this.Form.value.reporter).subscribe({
            next: (result: any) => {
              this.medicineService.get_medicine_supplier().subscribe({
                next: (result: any) => {
                  this.supplierList = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Supplier name created successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['supplier_name'].setValue(result.data.attributes.name)
                  this.onSupplierSelected(result.data.attributes.name)
                }
              })
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => { }
          })
        }
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

  submit() {
    this.Form.controls['status'].setValue('Published')
    this.Form.controls['published_by'].setValue(this.Form.value.reporter)
    this.confirmation()
  }

  confirmation() {

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
        this.update_inventory()
      } else {
        this.Form.controls['status'].setValue('Approved')
        this.Form.controls['published_by'].reset()
      }
    })
  }

  draft() {
    this.confirmation()
  }

  update_inventory() {
    this.medicineService.update_inventory(this.Form.value).subscribe({
      next: (result: any) => {
        if (result.data.attributes.status === "Published") {
          Swal.fire({
            title: 'Inventory Published',
            imageUrl: "assets/images/patient-record.gif",
            imageWidth: 250,
            text: "You have successfully published a medicine inventory.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/occupational-health/medicine-inventory/purchase-inventory"])
          })
        } else if (result.data.attributes.status === "Approved") {
          Swal.close()
          const statusText = "Details updated successfully"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.files = []
          this.get_inventory_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        if (this.Form.value.status === 'Published') {
          this.creat_transaction()
        }
      }
    })
  }
  creat_transaction() {
    const deliQuan = this.Form.value.delivered_quantity
    const purAmount = this.Form.value.purchased_amount
    const unitPrice = Number(Number(purAmount) / Number(deliQuan))
    const issuePrice = Number(Number(deliQuan) * Number(unitPrice))
    const balance = Number(deliQuan) - Number(deliQuan)
    let transData: any[] = []
    this.Form.controls['division'].enable()
    this.Form.controls['medicine_name'].enable()
    transData.push({
      transactionDate: new Date(),
      medicine: this.Form.value.medicine_name,
      medicine_uuid: this.medicineUuid,
      availableQuan: deliQuan,
      division: this.Form.value.division,
      authPerson: this.Authperson,
      issuingQuan: deliQuan,
      cost: Number(issuePrice),
      balance: balance,
      createdBy: this.Authperson,
      unit: null,
      inventory: this.Form.value.reference_number,
      business_unit: this.businessUnit
    })

    this.medicineService.medicine_transactions().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = "MTR-" + newCount
        this.medicineService.create_medicine_transactions(transData[0], reference).subscribe({
          next: (transactionResult: any) => {

            const inventory_balance = transactionResult.data.attributes.balance
            const inventory_issued = transactionResult.data.attributes.issued_quantity

            this.medicineService.update_balance_inventory(this.Form.value.id, inventory_issued, inventory_balance).subscribe({
              next: (result: any) => {
              },
              error: (err: any) => { },
              complete: () => {
                this.clinicalService.get_medical_stock_id(transactionResult.data.attributes.medicine_uuid, transactionResult.data.attributes.division).subscribe({
                  next: (result: any) => {
                    if (result.data.length > 0) {
                      const id = result.data[0].id
                      // const received = result.data[0].attributes.received + transactionResult.data.attributes.issued_quantity
                      const received = Number(result.data[0].attributes.received) + Number(transactionResult.data.attributes.issued_quantity);
                      const balance = Number(result.data[0].attributes.balance) + Number(transactionResult.data.attributes.issued_quantity)
                      this.clinicalService.update_medical_stock(id, received, balance).subscribe({
                        next: (result: any) => {
                        },
                        error: (err: any) => { },
                        complete: () => {
                          this.router.navigate(["/apps/occupational-health/medicine-inventory/purchase-inventory"])

                        }
                      })
                    } else {
                      this.showProgressPopup();
                      const issued = transactionResult.data.attributes.issued_quantity
                      const medicine = transactionResult.data.attributes.medicine
                      const medicine_uuid = transactionResult.data.attributes.medicine_uuid
                      const division = transactionResult.data.attributes.division
                      const business_unit = transData[0].business_unit
                      this.clinicalService.create_medical_stock(issued, medicine, medicine_uuid, division, business_unit).subscribe({
                        next: (result: any) => {
                        },
                        error: (err: any) => { },
                        complete: () => {
                          Swal.close()
                          this.router.navigate(["/apps/occupational-health/medicine-inventory/purchase-inventory"])
                        }
                      })
                    }
                  },
                  error: (err: any) => { },
                  complete: () => { }
                })
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

  }
  navigate() { this.backToHistory = true, this._location.back(); }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }


}
