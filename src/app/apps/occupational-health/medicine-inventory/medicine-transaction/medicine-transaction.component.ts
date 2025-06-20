import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';
import { medicine_transaction, ListColumn, user } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-medicine-transaction',
  templateUrl: './medicine-transaction.component.html',
  styleUrls: ['./medicine-transaction.component.scss']
})
export class MedicineTransactionComponent implements OnInit {

  medicineRegister: any[] = []
  orgID: string
  currencyFormat:any
  unitSpecific: any
  userDivision: any
  subject$: ReplaySubject<medicine_transaction[]> = new ReplaySubject<medicine_transaction[]>(1);
  data$: Observable<medicine_transaction[]> = this.subject$.asObservable();
  customers: medicine_transaction[];
corporateUser:any
  @Input()
  columns: ListColumn[] = [
    { name: 'Inventory', property: 'inventory', visible: true, isModelProperty: true },
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Commercial Name', property: 'transaction_date', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Authorized Person', property: 'authorized_person', visible: true, isModelProperty: true },
    { name: 'Medicine', property: 'medicine', visible: true, isModelProperty: true },
    { name: 'Requested Quantity', property: 'requested_quantity', visible: true, isModelProperty: true },

    { name: 'Total Quantity', property: 'total_quantity', visible: true, isModelProperty: true },
    { name: 'Issued', property: 'issued_quantity', visible: true, isModelProperty: true },
    { name: 'Cost', property: 'cost', visible: true, isModelProperty: true },
    { name: 'Balance', property: 'balance', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: false },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<medicine_transaction>;
  isLoading = true;
  totalItems = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private medicineService: MedicineInventoryService,
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
      this.medicineRegister = customers;
      this.dataSource.data = customers;
    });

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.occupational_health
        this.currencyFormat = result.data.attributes.currency
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
        const status = result.med_transaction
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if(this.unitSpecific){
            this.corporateUser=result.profile.corporate_user
            if(this.corporateUser){
              this.get_medicine_transaction({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            }
            else if(!this.corporateUser){
              let divisions:any[]=[]
              result.profile.divisions.forEach((elem:any)=>{
                divisions.push('filters[business_unit][division_uuid][$in]='+elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_medicine_transaction({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            }
          }else{

            this.get_medicine_transaction({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_medicine_transaction(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.medicineService.get_medicine_transaction(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.medicineRegister.splice(startIndex, endIndex, ...data);
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
  get_unit_specific_medicine_transaction(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.medicineService.get_unit_specific_medicine_transaction(startIndex, pageEvent.pageSize,this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.medicineRegister.splice(startIndex, endIndex, ...data);
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
    this.dataSource = new MatTableDataSource<medicine_transaction>(this.medicineRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
