import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { ehs, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CreateRequestComponent } from '../create-request/create-request.component';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';
import { ViewRequestComponent } from '../view-request/view-request.component';


@Component({
  selector: 'app-request-history',
  templateUrl: './request-history.component.html',
  styleUrls: ['./request-history.component.scss']
})
export class RequestHistoryComponent implements OnInit {

  medicineRegister: any[] = []
  orgID: string
  isLoading = true;
  totalItems = 0;
  corporateUser: any
  subject$: ReplaySubject<ehs[]> = new ReplaySubject<ehs[]>(1);
  data$: Observable<ehs[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: ehs[];
  currentRate = 8;
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Date', property: 'request_date', visible: true, isModelProperty: true },
    { name: 'Medicine Name', property: 'medicine_name', visible: true, isModelProperty: true },
    { name: 'Generic Name', property: 'generic_name', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Approver', property: 'approver', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  unitSpecific: any
  userDivision: any
  dataSource: MatTableDataSource<ehs>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private medicineService: MedicineInventoryService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,) { }

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

  //check organisation has access
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

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.med_request
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_medicine_request({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            }
            else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_medicine_request({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            }
          } else {

            this.get_medicine_request({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_medicine_request(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.medicineService.get_medicine_request_history(startIndex, pageEvent.pageSize).subscribe({
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

  get_unit_specific_medicine_request(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.medicineService.get_unit_specific_medicine_request_history(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
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
    this.dataSource = new MatTableDataSource<ehs>(this.medicineRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // this.medicineRegister.forEach(item => {
    //   const today = new Date();
    //   this.medicineRegister.forEach(item => {
    //     if(item.status=='Open')
    //     {
    //       const dueDate = new Date(item.due_date);
    //       if (dueDate.getFullYear() < today.getFullYear() ||
    //         (dueDate.getFullYear() === today.getFullYear() && dueDate.getMonth() < today.getMonth()) ||
    //         (dueDate.getFullYear() === today.getFullYear() && dueDate.getMonth() === today.getMonth() && dueDate.getDate() < today.getDate())) {
    //         item.tat_status = 'Delayed';
    //       } else {
    //         item.tat_status = 'On-Time';
    //       }
    //     }

    //   });
    // });

  }

  statusButton(data: any) {
    const Rejected = "btn-warning"
    const Active = "btn-success"
    const Open = "btn-light"
    if (data === "Approved") {
      return Active
    } else if (data === "Open") {
      return Open
    }
    else if (data === "Rejected") {
      return Rejected
    } else {
      return
    }
  }


  view(data: any) {

    this.medicineService.get_medicine_request_refe(data.reference_number).subscribe({
      next: (result: any) => {
        this.dialog.open(ViewRequestComponent, { data: result.data[0] })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })


  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  create() {
    this.dialog.open(CreateRequestComponent).afterClosed().subscribe(data => {

      if (this.unitSpecific) {
        if (this.corporateUser) {
          this.get_medicine_request({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {
          this.get_unit_specific_medicine_request({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
        }
      }
      else {
        this.get_medicine_request({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
      }


    })

  }

}
