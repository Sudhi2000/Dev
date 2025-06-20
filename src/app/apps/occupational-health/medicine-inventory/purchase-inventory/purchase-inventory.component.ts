import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';
import { medicine_inventory, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { CreateDisposalComponent } from '../create-disposal/create-disposal.component';
import { CreateTransactionComponent } from '../create-transaction/create-transaction.component';
import { FormControl } from '@angular/forms';
import { ReportParameterComponent } from './report-parameter/report-parameter.component';
import { EmailComponent } from '../email/email.component';
import { SchedulerService } from 'src/app/services/scheduler.api.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-purchase-inventory',
  templateUrl: './purchase-inventory.component.html',
  styleUrls: ['./purchase-inventory.component.scss']
})
export class PurchaseInventoryComponent implements OnInit {

  medicineRegister: any[] = []
  orgID: string
  subject$: ReplaySubject<medicine_inventory[]> = new ReplaySubject<medicine_inventory[]>(1);
  data$: Observable<medicine_inventory[]> = this.subject$.asObservable();
  customers: medicine_inventory[];
  corporateUser: any
  backToHistory: Boolean = false
  medicineName = new FormControl(['']);
  medicineType = new FormControl(['']);
  status = new FormControl(['']);
  filteredQuery = ''

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  filteredMedicineStatusQuery = ''


  searchParameter: string = ''




  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Request Date', property: 'request_date', visible: true, isModelProperty: true },
    { name: 'Medicine Name', property: 'medicine_name', visible: true, isModelProperty: true },
    { name: 'Medicine Type', property: 'medicine_type', visible: true, isModelProperty: true },
    { name: 'Reporter', property: 'reporter', visible: true, isModelProperty: true },
    { name: 'Approver', property: 'approver', visible: true, isModelProperty: true },
    { name: 'Delivered Quantity', property: 'delivered_quantity', visible: true, isModelProperty: true },
    { name: 'Issued', property: 'issued_quantity', visible: true, isModelProperty: true },
    { name: 'Disposed', property: 'disposed_of_quantity', visible: true, isModelProperty: true },
    { name: 'Balance', property: 'balance_quantity', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<medicine_inventory>;
  isLoading = true;
  totalItems = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  unitSpecific: any
  userDivision: any
  medicineNames: any[] = [];
  medicineTypes: any[] = [];
  statuses = [
    { attributes: { name: 'Approved' } },
    { attributes: { name: 'Published' } }
  ]
  constructor(private hazardService: HazardService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private medicineService: MedicineInventoryService,
    private clinicalService: ClinicalSuiteService,
    public dialog: MatDialog,
    private scheduler: SchedulerService,
    private _snackBar: MatSnackBar
  ) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit() {
    this.configuration()
    this.getMedicineNames()
    this.getMedicineType()
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((customers) => {
      this.medicineRegister = customers;
      this.dataSource.data = customers;
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
        const status = result.med_inventory
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_medicine_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
            else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_unit_specific_medicine_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          } else {
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_medicine_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_medicine_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.medicineService.inventory_register(startIndex, pageEvent.pageSize, this.filteredQuery).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        // this.medicineRegister.splice(startIndex, endIndex, ...data);
        this.medicineRegister = data;
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.isLoading = false;
        this.prepareView()
      }
    })
  }
  get_unit_specific_medicine_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.medicineService.unit_specific_inventory_register(startIndex, pageEvent.pageSize, this.userDivision, this.filteredQuery).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        //this.medicineRegister.splice(startIndex, endIndex, ...data);
        this.medicineRegister = data;
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.isLoading = false;
        this.prepareView()
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<medicine_inventory>(this.medicineRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();




  // }

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

  modify(data: any) {
    this.backToHistory = true
    this.medicineService.get_medicine_inventory_refe(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/occupational-health/medicine-inventory/modify-inventory/" + result.data[0].id])
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  view(data: any) {
    this.backToHistory = true
    this.medicineService.get_medicine_inventory_refe(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/occupational-health/medicine-inventory/view-inventory/" + result.data[0].id])
      },
      error: (err: any) => { },
      complete: () => { }
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
  transaction(medData: any) {

    this.medicineService.get_medicine_inventory_refe(medData.reference_number).subscribe({
      next: (result: any) => {

        const invenID = result.data[0].id
        const invenBal = result.data[0].attributes.balance_quantity
        const invenIssued = result.data[0].attributes.issued_quantity
        this.dialog.open(CreateTransactionComponent, { data: medData }).afterClosed().subscribe((data: any) => {
          if (data) {

            this.showProgressPopup();
            const deliQuan = medData.delivered_quantity
            const purAmount = medData.purchased_amount
            const unitPrice = Number(Number(purAmount) / Number(deliQuan)).toFixed(2)
            const issuePrice = Number(Number(data.issuing_quantity) * Number(unitPrice)).toFixed(2)
            const balance = Number(medData.balance_quantity) - Number(data.issuing_quantity)
            let transData: any[] = []

            transData.push({
              transactionDate: new Date(),
              medicine: medData.medicine_name,
              medicine_uuid: medData.medicine_uuid,
              availableQuan: medData.balance_quantity,
              division: data.division,
              authPerson: data.authorised_person,
              issuingQuan: data.issuing_quantity,
              cost: Number(issuePrice),
              balance: balance,
              createdBy: data.reporter,
              unit: data.unit,
              inventory: medData.reference_number,
              business_unit: data.business_unit
            })

            this.medicineService.medicine_transactions().subscribe({
              next: (result: any) => {
                const count = result.data.length
                const newCount = Number(count) + 1
                const reference = "MTR-" + newCount
                this.medicineService.create_medicine_transactions(transData[0], reference).subscribe({
                  next: (transactionResult: any) => {

                    const balance = invenBal
                    const inventory_balance = Number(balance) - Number(transData[0].issuingQuan)


                    const issued = invenIssued
                    const inventory_issued = Number(issued) + Number(transData[0].issuingQuan)

                    this.medicineService.update_balance_inventory(invenID, inventory_issued, inventory_balance).subscribe({
                      next: (result: any) => { },
                      error: (err: any) => { },
                      complete: () => {
                        Swal.fire({
                          title: 'New Transaction Added',
                          imageUrl: "assets/images/patient-record.gif",
                          imageWidth: 250,
                          text: "You have successfully created a medicine transaction",
                          showCancelButton: false,
                        }).then((result) => {


                          this.clinicalService.get_medical_stock_id(transactionResult.data.attributes.medicine_uuid, transactionResult.data.attributes.division).subscribe({
                            next: (result: any) => {
                              if (result.data.length > 0) {
                                const id = result.data[0].id
                                const balance = Number(result.data[0].attributes.balance) + Number(transactionResult.data.attributes.issued_quantity)
                                const issued = transactionResult.data.attributes.issued_quantity
                                const received = Number(result.data[0].attributes.received) + Number(transactionResult.data.attributes.delivered_quantity)
                                this.clinicalService.update_medical_stock(id, received, balance).subscribe({
                                  next: (result: any) => { },
                                  error: (err: any) => { },
                                  complete: () => {
                                    this.medicineRegister = []
                                    if (this.unitSpecific) {
                                      if (this.corporateUser) {
                                        this.get_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                                      } else if (!this.corporateUser) {
                                        this.get_unit_specific_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                                      }
                                    } else {

                                      this.get_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                                    }

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
                                    this.medicineRegister = []
                                    if (this.unitSpecific) {
                                      if (this.corporateUser) {
                                        this.get_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                                      } else if (!this.corporateUser) {
                                        this.get_unit_specific_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                                      }
                                    } else {

                                      this.get_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                                    }
                                  }
                                })
                              }
                            },
                            error: (err: any) => { },
                            complete: () => { }
                          })
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

        })
      },
      error: (err: any) => { },
      complete: () => { }
    })



  }

  disposal(medData: any) {

    this.medicineService.get_medicine_inventory_refe(medData.reference_number).subscribe({
      next: (result: any) => {
        const invenID = result.data[0].id
        const invenBal = result.data[0].attributes.balance_quantity
        const invenDisposed = result.data[0].attributes.disposed_of_quantity
        this.dialog.open(CreateDisposalComponent, { data: medData }).afterClosed().subscribe((data: any) => {
          if (data) {
            this.showProgressPopup();
            const deliQuan = medData.delivered_quantity
            const purAmount = medData.purchased_amount
            const unitPrice = Number(Number(purAmount) / Number(deliQuan)).toFixed(2)
            const issuePrice = Number(Number(data.disposed_quantity) * Number(unitPrice)).toFixed(2)
            const balance = Number(medData.balance_quantity) - Number(data.disposed_quantity)

            let transData: any[] = []
            transData.push({
              medicine_name: medData.medicine_name,
              available_quantity: medData.balance_quantity,
              authorized_contractor: data.authorized_contrator,
              disposal_details: data.remarks,
              disposed_quantity: data.disposed_quantity,
              disposal_date: data.transaction_date,
              cost: issuePrice,
              inventory: invenID,
              balance_quantity: balance,
              unit: medData.delivered_unit
            })
            this.medicineService.create_medicine_disposal(transData[0]).subscribe({
              next: (result: any) => {
                const balance = invenBal
                const inventory_balance = Number(balance) - Number(transData[0].disposed_quantity)

                const disposed = invenDisposed
                const inventory_disposed = Number(disposed) + Number(transData[0].disposed_quantity)
                this.medicineService.update_disposal_inventory(invenID, inventory_disposed, inventory_balance).subscribe({
                  next: (result: any) => { },
                  error: (err: any) => { },
                  complete: () => {
                    Swal.fire({
                      title: 'New Disposal Transaction Added',
                      imageUrl: "assets/images/chemical.gif",
                      imageWidth: 250,
                      text: "You have successfully created a medicine disposal transaction",
                      showCancelButton: false,
                    }).then((result) => {
                      this.medicineRegister = []
                      if (this.unitSpecific) {
                        if (this.corporateUser) {
                          this.get_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                        } else if (!this.corporateUser) {
                          this.get_unit_specific_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                        }
                      } else {
                        this.get_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                      }
                    })
                  }
                })
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



  }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

  filterData(): void {
    let query = ''

    const selectedMedicineStatus = this.status.value;




    if (selectedMedicineStatus.length > 0) {
      this.filteredMedicineStatusQuery = selectedMedicineStatus
        .map((data: string) => data && `&filters[status]=${data}`)
        .join('');

    }

    const value = this.searchParameter

    if (value.length > 0) {

      const param = `&filters[$or][0][medicine_type][$containsi]=${value}&filters[$or][1][medicine_name][$containsi]=${value}`;

      query = param

    }

    // Combine the queries
    this.filteredQuery = query + this.filteredMedicineStatusQuery;



    // Call API based on user type
    if (this.corporateUser) {
      this.get_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 });
    } else {
      this.get_unit_specific_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 });
    }
  }



  getMedicineNames() {
    this.medicineService.get_medicine_name().subscribe({
      next: (result: any) => {

        this.medicineNames = result.data;
      },
      error: (err) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {

      }
    });
  }

  getMedicineType() {
    this.medicineService.get_medicine_type().subscribe({
      next: (result: any) => {

        this.medicineTypes = result.data

      },
      error: (err) => {
        this.router.navigate(["/error/internal"])
      }
    })

  }
  generateReport() {
    this.dialog.open(ReportParameterComponent, { data: this.userDivision }).afterClosed().subscribe((data) => {

      if (data) {

        let parameter: any = []
        if (data.startDate && data.endDate && data.division && !data.year) {
          const start_date = new Date(data.startDate);
          const startDate = start_date.toISOString().split('T')[0];
          const end_date = new Date(data.endDate);
          const endDate = end_date.toISOString().split('T')[0];

          parameter.push({
            default_date: data.default_date,
            start_date: startDate,
            end_date: endDate,
            division: data?.division,
            reporting_person: data?.reporting_person,
            reporting_mail: data?.reporting_email,
            company_name: data?.company_name
          })
          document.getElementById('attrition_report')?.classList.add("hide");
          document.getElementById('attrition_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.medicineService.medicine_inventory_report(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('attrition_report_loader')?.classList.add("hide");
              document.getElementById('attrition_report')?.classList.remove("hide")
            })
          }
          else if (data.format === "Excel") {
            this.medicineService.medicine_inventory_report_excel(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('attrition_report_loader')?.classList.add("hide");
              document.getElementById('attrition_report')?.classList.remove("hide")
            })
          }
        } else if (data.startDate && data.endDate && !data.division && !data.year) {
          const start_date = new Date(data.startDate);
          const startDate = start_date.toISOString().split('T')[0];
          const end_date = new Date(data.endDate);
          const endDate = end_date.toISOString().split('T')[0];

          parameter.push({
            default_date: data.default_date,
            start_date: startDate,
            end_date: endDate,
            // division: data?.division,
            reporting_person: data?.reporting_person,
            reporting_mail: data?.reporting_email,
            company_name: data?.company_name
          })
          document.getElementById('attrition_report')?.classList.add("hide");
          document.getElementById('attrition_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.medicineService.medicine_inventory_report_1(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('attrition_report_loader')?.classList.add("hide");
              document.getElementById('attrition_report')?.classList.remove("hide")
            })
          } else if (data.format === "Excel") {
            this.medicineService.medicine_inventory_report_1_excel(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('attrition_report_loader')?.classList.add("hide");
              document.getElementById('attrition_report')?.classList.remove("hide")
            })
          }
        } else if (!data.startDate && !data.endDate && data.division && data.year) {

          // const start_date = new Date(data.startDate);
          // const startDate = start_date.toISOString().split('T')[0];
          // const end_date = new Date(data.endDate);
          // const endDate = end_date.toISOString().split('T')[0];

          parameter.push({
            default_date: data.default_date,
            // start_date: startDate,
            // end_date: endDate,
            year: data.year || null,
            division: data?.division,
            reporting_person: data?.reporting_person,
            reporting_mail: data?.reporting_email,
            company_name: data?.company_name
          })
          document.getElementById('attrition_report')?.classList.add("hide");
          document.getElementById('attrition_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.medicineService.medicine_inventory_report_2(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('attrition_report_loader')?.classList.add("hide");
              document.getElementById('attrition_report')?.classList.remove("hide")
            })
          } else if (data.format === "Excel") {
            this.medicineService.medicine_inventory_report_2_excel(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('attrition_report_loader')?.classList.add("hide");
              document.getElementById('attrition_report')?.classList.remove("hide")
            })
          }

        } else if (!data.startDate && !data.endDate && !data.division && data.year) {

          // const start_date = new Date(data.startDate);
          // const startDate = start_date.toISOString().split('T')[0];
          // const end_date = new Date(data.endDate);
          // const endDate = end_date.toISOString().split('T')[0];

          parameter.push({
            default_date: data.default_date,
            // start_date: startDate,
            // end_date: endDate,
            year: data.year || null,
            division: data?.division,
            reporting_person: data?.reporting_person,
            reporting_mail: data?.reporting_email,
            company_name: data?.company_name
          })
          document.getElementById('attrition_report')?.classList.add("hide");
          document.getElementById('attrition_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.medicineService.medicine_inventory_report_3(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('attrition_report_loader')?.classList.add("hide");
              document.getElementById('attrition_report')?.classList.remove("hide")
            })
          } else if (data.format === "Excel") {
            this.medicineService.medicine_inventory_report_3_excel(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('attrition_report_loader')?.classList.add("hide");
              document.getElementById('attrition_report')?.classList.remove("hide")
            })
          }


        }
      }

    })

  }

  print(reference: any) {
    document.getElementById(reference)?.classList.add("hide");
    document.getElementById(reference + '_1')?.classList.remove("hide")
    this.medicineService.get_medicine_inventory_reference(reference).subscribe({
      next: (result: any) => {
        const id = result.data[0].id
        this.medicineService.medicineInventoryReport(id).subscribe((response: any) => {
          let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          const url = window.URL.createObjectURL(blob);
          window.open(url)
          document.getElementById(reference)?.classList.remove("hide");
          document.getElementById(reference + '_1')?.classList.add("hide")
        })
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  email(data: any) {
    console.log("🚀 ~ PatientRegisterComponent ~ email ~ data:", data)
    this.dialog.open(EmailComponent, { width: "50%" }).afterClosed().subscribe((emailData: any) => {
      console.log("🚀 ~ PatientRegisterComponent ~ this.dialog.open ~ emailData:", emailData)


      this.scheduler.create_purchase_inventory_schedule(data.reference_number, emailData.to_email).subscribe({
        next: (result: any) => {
          console.log("🚀 ~ PatientRegisterComponent ~ this.scheduler.create_clinical_suite_schedule ~ result:", result)


        },
        error: (err: any) => {
          console.log("🚀 ~ PatientRegisterComponent ~ this.scheduler.create_clinical_suite_schedule ~ err:", err)
          const statusText = "Internal Error"
          this._snackBar.open(statusText, 'Close', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        },
        complete: () => {
          Swal.fire({
            title: 'Email Notification',
            imageUrl: "assets/images/email.png",
            imageWidth: 250,
            text: "You have successfully initiated the email notification. The recipient will receive an email notification shortly.",
            showCancelButton: false,

          })
        }
      })

    })

  }

  reset() {
    this.searchParameter = ''
    this.status.reset([]);
    this.filteredQuery = ''


    if (this.corporateUser) {
      this.get_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 });
    } else {
      this.get_unit_specific_medicine_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 });
    }
  }

}