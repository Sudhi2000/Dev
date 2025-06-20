import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { chemical_inventory, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { ChemicalTransactionCreateComponent } from '../chemical-transaction-create/chemical-transaction-create.component';
import Swal from 'sweetalert2'
import { ChemicalDisposalCreateComponent } from '../chemical-disposal-create/chemical-disposal-create.component';
import { GenerateComponentComponent } from './generate-component/generate-component.component';
@Component({
  selector: 'app-chemical-inventory',
  templateUrl: './chemical-inventory.component.html',
  styleUrls: ['./chemical-inventory.component.scss']
})
export class ChemicalInventoryComponent implements OnInit {

  chemicalRegister: any[] = []
  orgID: string
  subject$: ReplaySubject<chemical_inventory[]> = new ReplaySubject<chemical_inventory[]>(1);
  data$: Observable<chemical_inventory[]> = this.subject$.asObservable();
  customers: chemical_inventory[];

  serachReference: any = ''
  unitSpecific: any
  userDivision: any
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Request Date', property: 'request_date', visible: true, isModelProperty: true },
    { name: 'Expiry Date', property: 'expiry_date', visible: true, isModelProperty: true },
    { name: 'Commercial Name', property: 'commercial_name', visible: true, isModelProperty: true },
    { name: 'MSDS Availability', property: 'msds_availability', visible: true, isModelProperty: true },
    { name: 'Requested Customer', property: 'requested_customer', visible: true, isModelProperty: true },
    { name: 'Reviewer', property: 'reviewer', visible: true, isModelProperty: true },
    { name: 'Approver', property: 'approver', visible: true, isModelProperty: true },
    { name: 'Delivered Quantity', property: 'delivered_quantity', visible: true, isModelProperty: true },
    { name: 'Storage Place', property: 'storage_place', visible: true, isModelProperty: true },
    { name: 'Issued', property: 'issued', visible: true, isModelProperty: true },
    { name: 'Disposed', property: 'disposed', visible: true, isModelProperty: true },
    { name: 'Balance', property: 'balance', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<chemical_inventory>;
  isLoading = true;
  totalItems = 0;
  backToHistory: Boolean = false
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  corporateUser: any
  constructor(private hazardService: HazardService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private chemicalService: ChemicalService,
    public dialog: MatDialog) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit() {
    this.configuration()
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((customers) => {
      this.chemicalRegister = customers;
      this.dataSource.data = customers;
    });
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.chemical
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
        const status = result.chem_inven
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_chemical_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_chemical_unit_specific_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_chemical_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_chemical_unit_specific_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.chemicalService.inventory_unit_specific_register(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        // const data = result.data.map((elem: any) => elem.attributes);
        const data = result.data.map((elem: any) => {
          const attributes = elem.attributes;
          attributes.msds_sds = attributes.msds_sds ? 'Yes' : 'No';
          attributes.balance = parseFloat(attributes.balance).toFixed(2);
          return attributes;
        });

        // this.chemicalRegister.splice(startIndex, endIndex, ...data);
        this.chemicalRegister = data
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        });
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"]);
      },
      complete: () => {
        this.isLoading = false;
        this.prepareView();
      },
    });
  }

  get_chemical_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.chemicalService.inventory_register(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        // const data = result.data.map((elem: any) => elem.attributes);
        const data = result.data.map((elem: any) => {
          const attributes = elem.attributes;
          attributes.msds_sds = attributes.msds_sds ? 'Yes' : 'No';
          attributes.balance = parseFloat(attributes.balance).toFixed(2);
          return attributes;
        });
        // this.chemicalRegister.splice(startIndex, endIndex, ...data);
        this.chemicalRegister = data
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        });
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"]);
      },
      complete: () => {
        this.isLoading = false;
        this.prepareView();
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<chemical_inventory>(this.chemicalRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  modify(data: any) {
    this.backToHistory = true
    this.chemicalService.get_chemical_inventory_refe(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/chemical-management/modify-inventory/" + result.data[0].id])
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  view(data: any) {
    this.backToHistory = true
    this.chemicalService.get_chemical_inventory_refe(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/chemical-management/view-inventory/" + result.data[0].id])
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

  transaction(cheData: any) {

    this.chemicalService.get_chemical_inventory_refe(cheData.reference_number).subscribe({
      next: (result: any) => {

        const invenID = result.data[0].id
        const invenBal = result.data[0].attributes.balance
        const invenIssued = result.data[0].attributes.issued

        // this.router.navigate(["/apps/chemical-management/view-inventory/" + result.data[0].id])
        this.dialog.open(ChemicalTransactionCreateComponent, { data: cheData }).afterClosed().subscribe((data: any) => {
          if (data) {
            this.showProgressPopup();
            const deliQuan = cheData.delivered_quantity
            const purAmount = cheData.purchased_amount
            const unitPrice = Number(Number(purAmount) / Number(deliQuan)).toFixed(2)
            const issuePrice = Number(Number(data.issuing_quantity) * Number(unitPrice)).toFixed(2)
            const balance = Number(cheData.balance) - Number(data.issuing_quantity)
            let transData: any[] = []
            transData.push({
              transactionDate: data.transaction_date,
              chemical: cheData.commercial_name,
              availableQuan: cheData.balance,
              division: data.division,
              department: data.department,
              authPerson: data.authorised_person,
              issuingQuan: data.issuing_quantity,
              cost: Number(issuePrice),
              balance: balance,
              createdBy: data.reporter,
              unit: data.unit,
              inventory: cheData.reference_number,
              business_unit: data.business_unit

            })
            this.chemicalService.chemical_transactions().subscribe({
              next: (result: any) => {
                const count = result.data.length
                const newCount = Number(count) + 1
                const reference = "CTR-" + newCount

                this.chemicalService.create_chemical_transactions(transData[0], reference).subscribe({
                  next: (result: any) => {
                    const balance = invenBal
                    const inventory_balance = Number(balance) - Number(transData[0].issuingQuan)

                    const issued = invenIssued
                    const inventory_issued = Number(issued) + Number(transData[0].issuingQuan)

                    this.chemicalService.update_balance_inventory(invenID, inventory_issued, inventory_balance).subscribe({
                      next: (result: any) => { },
                      error: (err: any) => { },
                      complete: () => {
                        Swal.fire({
                          title: 'New Transaction Added',
                          imageUrl: "assets/images/chemical.gif",
                          imageWidth: 250,
                          text: "You have successfully created a chemical transaction",
                          showCancelButton: false,
                        }).then((result) => {
                          this.chemicalRegister = []
                          if (this.unitSpecific) {
                            if (this.corporateUser) {
                              this.get_chemical_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 });
                            } else if (!this.corporateUser) {
                              this.get_chemical_unit_specific_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                            }
                          }
                          else {
                            this.get_chemical_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 });
                          }
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

  disposal(cheData: any) {

    this.chemicalService.get_chemical_inventory_refe(cheData.reference_number).subscribe({
      next: (result: any) => {

        const invenID = result.data[0].id
        const invenBal = result.data[0].attributes.balance
        const invenDisposed = result.data[0].attributes.disposed



        // this.router.navigate(["/apps/chemical-management/view-inventory/" + result.data[0].id])
        this.dialog.open(ChemicalDisposalCreateComponent, { data: cheData }).afterClosed().subscribe((data: any) => {
          if (data) {
            this.showProgressPopup();
            const deliQuan = cheData.delivered_quantity
            const purAmount = cheData.purchased_amount
            const unitPrice = Number(Number(purAmount) / Number(deliQuan)).toFixed(2)
            const issuePrice = Number(Number(data.disposed_quantity) * Number(unitPrice)).toFixed(2)
            const balance = Number(cheData.balance) - Number(data.disposed_quantity)

            let transData: any[] = []
            transData.push({
              chemical_name: cheData.commercial_name,
              available_quantity: cheData.balance,
              authorized_contractor: data.authorized_contrator,
              disposal_details: data.remarks,
              disposed_quantity: data.disposed_quantity,
              disposal_date: data.transaction_date,
              cost: issuePrice,
              inventory: invenID,
              balance_quantity: balance,
              unit: cheData.delivered_unit
            })
            this.chemicalService.chemical_disposal_create(transData[0]).subscribe({
              next: (result: any) => {
                const balance = invenBal
                const inventory_balance = Number(balance) - Number(transData[0].disposed_quantity)

                const disposed = invenDisposed
                const inventory_disposed = Number(disposed) + Number(transData[0].disposed_quantity)
                this.chemicalService.update_diposal_inventory(invenID, inventory_disposed, inventory_balance).subscribe({
                  next: (result: any) => { },
                  error: (err: any) => { },
                  complete: () => {
                    Swal.fire({
                      title: 'New Disposal Transaction Added',
                      imageUrl: "assets/images/chemical.gif",
                      imageWidth: 250,
                      text: "You have successfully created a chemical disposal transaction",
                      showCancelButton: false,
                    }).then((result) => {
                      this.chemicalRegister = []
                      if (this.unitSpecific) {
                        if (this.corporateUser) {
                          this.get_chemical_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                        } else if (!this.corporateUser) {
                          this.get_chemical_unit_specific_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                        }
                      }
                      else {
                        this.get_chemical_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
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

  generate() {
    this.isLoading = true;
    if (!this.corporateUser) {
      this.chemicalService.inventory_unit_specific_register_search(this.serachReference, this.userDivision).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.chemicalRegister = data
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => {
          this.isLoading = false;
          this.prepareView();
        },
      });
    }
    else {
      this.chemicalService.inventory_register_search(this.serachReference).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.chemicalRegister = data

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => {
          this.isLoading = false;
          this.prepareView();
        },
      });
    }

  }

  reset() {
    this.ngOnInit()
    this.serachReference = ''

  }

  generateReport() {
    this.dialog.open(GenerateComponentComponent).afterClosed().subscribe(data => {
      if (data) {
        document.getElementById('che_report')?.classList.add("hide");
        document.getElementById('che_report_loader')?.classList.remove("hide")
        this.chemicalService.inventory_report(data).subscribe((response: any) => {
          let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          window.open(url)
          document.getElementById('che_report')?.classList.remove("hide");
          document.getElementById('che_report_loader')?.classList.add("hide")
        })

      }

    })

  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }


}
