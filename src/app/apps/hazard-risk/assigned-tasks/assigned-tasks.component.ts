import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { ehs, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-assigned-tasks',
  templateUrl: './assigned-tasks.component.html',
  styleUrls: ['./assigned-tasks.component.scss']
})
export class AssignedTasksComponent implements OnInit {
  ehsRegister: any[] = []
  orgID: string
  userID: number
  subject$: ReplaySubject<ehs[]> = new ReplaySubject<ehs[]>(1);
  data$: Observable<ehs[]> = this.subject$.asObservable();
  customers: ehs[];
  totalItems = 0;
  serachReference: any = ""
  unitSpecific: any
  userDivision: any
  corporateUser: any
  backToHistory: Boolean = false
  @Input()
  columns: ListColumn[] = [
    { name: 'Risk Level', property: 'level', visible: true, isModelProperty: true },
    { name: 'Date', property: 'reported_date', visible: true, isModelProperty: true },
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Category', property: 'category', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Due Date', property: 'due_date', visible: true, isModelProperty: true },
    { name: 'Reporter', property: 'reporter', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  isLoading = true;
  dataSource: MatTableDataSource<ehs>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private hazardService: HazardService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService) { }

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
      this.ehsRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.hazard_risk
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
        const status = result.ehs_action
        this.userID = result.id
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {

            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_assigned_tasks({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
            else if (!this.corporateUser) {
              let divisions: any[] = []
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_assigned_tasks({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            this.get_assigned_tasks({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_assigned_tasks(pageEvent: PageEvent) {
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    const org = this.orgID
    const user = this.userID
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.hazardService.get_assigned_tasks(org, user, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {

        const data = result.data.map((elem: any) => elem.attributes);
        this.ehsRegister = data
        // this.ehsRegister.splice(startIndex, endIndex, ...data);
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

  get_unit_specific_assigned_tasks(pageEvent: PageEvent) {
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    const org = this.orgID
    const user = this.userID
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.hazardService.get_unit_specific_assigned_tasks(org, user, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {

        const data = result.data.map((elem: any) => elem.attributes);
        this.ehsRegister = data
        // this.ehsRegister.splice(startIndex, endIndex, ...data);
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

  generate() {

    this.isLoading = true;
    if (this.unitSpecific && !this.corporateUser) {
      this.hazardService.get_hazard_unit_specific_search(this.serachReference, this.userDivision).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.ehsRegister = data
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
    else {
      this.hazardService.get_hazard_search(this.serachReference).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.ehsRegister = data
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

  }

  reset() {
    this.serachReference = ''
    this.ngOnInit()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<ehs>(this.ehsRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  riskStatus(data: any) {
    const high = "high"
    const medium = "medium"
    const low = "low"
    if (data === "High") {
      return high
    } else if (data === "Medium") {
      return medium
    } else if (data === "Low") {
      return low
    } else {
      return
    }
  }

  statusButton(data: any) {
    const open = "btn-light"
    const inprogress = "btn-secondary"
    const completed = "btn-success"
    const verify = "btn-info"
    const rejected = "btn-danger"

    if (data === "Open") {
      return open
    } else if (data === "In-Progress") {
      return inprogress
    } else if (data === "Completed") {
      return completed
    } else if (data === "Verify") {
      return verify
    } else if (data === "Rejected") {
      return rejected
    } else {
      return
    }
  }

  view(data: any) {
    this.router.navigate(["/apps/hazard-risk/action/view/" + data.reference_number])
    this.backToHistory = true

  }

  print(data: any) {
    document.getElementById(data)?.classList.add("hide");
    document.getElementById(data + '_1')?.classList.remove("hide")
    this.hazardService.ehs_report(data).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      window.open(url)
      document.getElementById(data)?.classList.remove("hide");
      document.getElementById(data + '_1')?.classList.add("hide")
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  action(data: any) {
    this.backToHistory = true
    if (data.status === "Open" || data.status === "In-Progress" || data.status === "Rejected") {
      this.router.navigate(["/apps/hazard-risk/action/" + data.reference_number])
    } else if (data.status === "Verify") {
      this.router.navigate(["/apps/hazard-risk/verify/" + data.reference_number])
    }
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

}
