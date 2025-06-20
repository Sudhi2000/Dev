import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { internal_audit_regsiter, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  internalAuditRegister: any[] = []
  serachReference: any = ""
  orgID: string
  userID: Number
  totalItems = 0;
  subject$: ReplaySubject<internal_audit_regsiter[]> = new ReplaySubject<internal_audit_regsiter[]>(1);
  data$: Observable<internal_audit_regsiter[]> = this.subject$.asObservable();
  customers: internal_audit_regsiter[];
  unitSpecific: any
  userDivision: any
  corporateUser: any
  backToHistory: Boolean = false
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Year', property: 'start_date', visible: true, isModelProperty: true },
    // { name: 'Month', property: 'end_date', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Department', property: 'department', visible: true, isModelProperty: true },

    { name: 'auditee', property: 'auditee', visible: true, isModelProperty: true },
    { name: 'status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<internal_audit_regsiter>;
  isLoading = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private internalAuditService: InternalAuditService) { }

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
      this.internalAuditRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.audit_inspection
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
        const status = result.int_aud_action
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.userID = result.id
          // if (this.unitSpecific) {
          //   this.corporateUser = result.profile.corporate_user
          //   if (this.corporateUser) {
          //     this.get_internal_audit_tasks({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          //   } else if (!this.corporateUser) {
          //     let divisions:any[]=[]
          //     result.profile.divisions.forEach((elem:any)=>{
          //       divisions.push('filters[business_unit][division_uuid][$in]='+elem.division_uuid)
          //     })
          //     let results = divisions.join('&');
          //     this.userDivision = results
          //     this.get_internal_audit_unit_specific_tasks({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          //   }
          // }
          // else {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_internal_audit_tasks({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          // }

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  // get_internal_audit_unit_specific_tasks(pageEvent: PageEvent) {
  //   this.isLoading = true;
  //   const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
  //   const endIndex = startIndex + pageEvent.pageSize;
  //   this.internalAuditService.get_audit_unit_specific_tasks(this.userID, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
  //     next: (result: any) => {
  //       const data = result.data.map((elem: any) => elem.attributes);
  //       this.internalAuditRegister.splice(startIndex, endIndex, ...data);
  //       this.totalItems = result.meta.pagination.total;
  //       setTimeout(() => {
  //         this.paginator.pageIndex = startIndex / pageEvent.pageSize;
  //         this.paginator.length = this.totalItems;
  //       });
  //     },
  //     error: (err: any) => {
  //       this.router.navigate(["/error/internal"])
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //       this.prepareView()
  //     }
  //   })

  // }

  get_internal_audit_tasks(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.internalAuditService.get_audit_tasks(this.userID, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.internalAuditRegister.splice(startIndex, endIndex, ...data);
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
      this.internalAuditService.get_internal_audit_unit_specific_search(this.serachReference, this.userID, this.userDivision).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.internalAuditRegister = data
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
      this.internalAuditService.get_internal_audit_search(this.serachReference, this.userID).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.internalAuditRegister = data
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
    this.dataSource = new MatTableDataSource<internal_audit_regsiter>(this.internalAuditRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  statusButton(data: any) {
    const draft = "btn-light"
    const scheduled = "btn-warning"
    const inProgress = "btn-primary"
    const completed = "btn-success"

    if (data === "Draft") {
      return draft
    } else if (data === "Scheduled") {
      return scheduled
    } else if (data === "In-Progress") {
      return inProgress
    } else if (data === "Completed") {
      return completed
    } else {
      return
    }
  }

  print(data: any) {

  }

  view(data: any) {
    this.backToHistory = true
    this.router.navigate(["/apps/audit-inspection/internal-audit/view/" + data.reference_number])

  }

  action(data: any) {
    this.backToHistory = true
    this.router.navigate(["/apps/audit-inspection/internal-audit/action/" + data.reference_number])


  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }


}
