import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReplaySubject, Observable, filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';
import { medicine_request, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { ViewRequestComponent } from '../view-request/view-request.component';
import { MatDialog } from '@angular/material/dialog';
import { MedicineApprovalComponent } from '../medicine-approval/medicine-approval.component';

@Component({
  selector: 'app-assigned-tasks',
  templateUrl: './assigned-tasks.component.html',
  styleUrls: ['./assigned-tasks.component.scss']
})
export class AssignedTasksComponent implements OnInit {

  medicineRequest: any[] = []
  orgID: any
  userID: number
  subject$: ReplaySubject<medicine_request[]> = new ReplaySubject<medicine_request[]>(1);
  data$: Observable<medicine_request[]> = this.subject$.asObservable();
  customers: medicine_request[];
  isLoading = true;
  totalItems = 0;
  corporateUser: any
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Request Date', property: 'request_date', visible: true, isModelProperty: true },
    { name: 'Medicine Name', property: 'medicine_name', visible: true, isModelProperty: true },
    { name: 'Generic Name', property: 'generic_name', visible: true, isModelProperty: true },
    { name: 'Reporter', property: 'reporter', visible: true, isModelProperty: true },

    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Requested Quantity', property: 'requested_quantity', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<medicine_request>;
  unitSpecific: any
  userDivision: any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    public dialog: MatDialog,
    private medicineService: MedicineInventoryService) { }

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
      this.medicineRequest = customers;
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
        const status = result.med_inv_approval
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.userID = Number(result.profile.id)
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_medicine_request_tasks({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            }
            else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_medicine_request_tasks({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            }
          } else {

            this.get_medicine_request_tasks({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_medicine_request_tasks(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.medicineService.get_medicine_request_tasks(this.userID, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.medicineRequest.splice(startIndex, endIndex, ...data);
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
  get_unit_specific_medicine_request_tasks(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.medicineService.get_unit_specific_medicine_request_tasks(this.userID, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.medicineRequest.splice(startIndex, endIndex, ...data);
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
    this.dataSource = new MatTableDataSource<medicine_request>(this.medicineRequest);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  statusButton(data: any) {
    const open = "btn-primary"
    const Reviewed = "btn-info"
    const Approved = "btn-success"
    const Rejected = "btn-danger"
    if (data === "Open") {
      return open
    } else if (data === "Reviewed") {
      return Reviewed
    } else if (data === "Approved") {
      return Approved
    } else if (data === "Rejected") {
      return Rejected
    } else {
      return
    }
  }

  action(data: any) {

    this.medicineService.get_medicine_request_refe(data.reference_number).subscribe({
      next: (result: any) => {

        this.dialog.open(MedicineApprovalComponent, { height: '70%', data: result.data[0] }).afterClosed().subscribe(data => {
          if (data) {
            if (this.unitSpecific) {
              if (this.corporateUser) {
                this.get_medicine_request_tasks({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
              } else if (!this.corporateUser) {
                this.get_unit_specific_medicine_request_tasks({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
              }
            } else {

              this.get_medicine_request_tasks({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            }
          }
        })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }


  view(data: any) {
    this.medicineService.get_medicine_request_refe(data.reference_number).subscribe({
      next: (result: any) => {
        this.dialog.open(ViewRequestComponent, { data: result.data[0] })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {

      }
    })
  }

}
