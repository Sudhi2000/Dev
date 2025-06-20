import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment_register, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-environment-assigned',
  templateUrl: './environment-assigned.component.html',
  styleUrls: ['./environment-assigned.component.scss']
})
export class EnvironmentAssignedComponent implements OnInit {
  environmentRegister: any[] = []
  orgID: string
  pending = "Waste, Water"
  userID: any
  subject$: ReplaySubject<environment_register[]> = new ReplaySubject<environment_register[]>(1);
  data$: Observable<environment_register[]> = this.subject$.asObservable();
  customers: environment_register[];
  serachReference: any = ""
  unitSpecific: any
  userDivision: any
  corporateUser: any
  backToHistory: Boolean = false
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Year', property: 'year', visible: true, isModelProperty: true },
    { name: 'Month', property: 'month', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Work Force', property: 'work_force', visible: true, isModelProperty: true },
    { name: 'Days Worked', property: 'days_worked', visible: true, isModelProperty: true },
    { name: 'Product Produced (KG)', property: 'product_produced_kg', visible: true, isModelProperty: true },
    { name: 'Area', property: 'area', visible: true, isModelProperty: true },
    { name: 'Category Status', property: 'pending_consumption', visible: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<environment_register>;
  isLoading = true;
  totalItems = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private environmentService: EnvironmentService) { }

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
      this.environmentRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.environment
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
        this.userID = result.id
        const status = result.env_action
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_environment_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_environment_unit_specific_tasks({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_environment_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_environment_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.environmentService.get_environment_register_assigned(this.userID, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.environmentRegister.splice(startIndex, endIndex, ...data);
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        });
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

  get_environment_unit_specific_tasks(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.environmentService.get_environment_unit_specific_assigned(this.userID, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.environmentRegister.splice(startIndex, endIndex, ...data);
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        });
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
      this.environmentService.get_environment_unit_specific_assigned_search(this.serachReference, this.userID, this.userDivision).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.environmentRegister = data
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
      this.environmentService.get_environment_register_assigned_search(this.serachReference, this.userID).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.environmentRegister = data
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

  private prepareView() {
    this.dataSource = new MatTableDataSource<environment_register>(this.environmentRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  statusButton(data: any) {
    // const open = "btn-light"
    const underreview = "btn-light"
    const inprogress = "btn-secondary"
    const completed = "btn-success"
    const verify = "btn-info"
    const underInvestigation = "btn-info"
    const rejected = "btn-danger"
    const draft = "btn-warning"
    if (data === "Under review") {
      return underreview
    } else if (data === "In-Progress") {
      return inprogress
    } else if (data === "Completed") {
      return completed
    } else if (data === "Reviewed") {
      return verify
    } else if (data === "Rejected") {
      return rejected
    } else if (data === "Under Investigation") {
      return underInvestigation
    } else if (data === "Draft") {
      return draft
    } else {
      return
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  view(data: any) {
    this.backToHistory = true
    const reference = data.reference_number
    this.router.navigate(["apps/environment/consumption/view/" + reference])
  }

  modify(data: any) {
    this.backToHistory = true
    const reference = data.reference_number
    this.router.navigate(["apps/environment/consumption/modify/" + reference])
  }

  print(data: any) {

  }

  action(data: any) {
    this.backToHistory = true
    const status = data.status
    const reference = data.reference_number
    if (status === "Under review") {
      this.router.navigate(["apps/environment/assigned/action/" + reference])
    } else if (status === "Reviewed") {
      this.router.navigate(["apps/environment/assigned/action/" + reference])
    }
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
