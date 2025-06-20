import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { ListColumn, internal_audit_regsiter } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { ViewActionPlanComponent } from '../view-action-plan/view-action-plan.component';
import { GenerateReportComponent } from '../../external-audit/register/generate-report/generate-report.component';
import { UpdateActionPlanComponent } from '../update-action-plan/update-action-plan.component';
import { CorporateuserUpdateActionPlanComponent } from '../corporateuser-update-action-plan/corporateuser-update-action-plan.component';

@Component({
  selector: 'app-corrective-register',
  templateUrl: './corrective-register.component.html',
  styleUrls: ['./corrective-register.component.scss']
})
export class CorrectiveRegisterComponent implements OnInit {

  correctiveActions: any[] = []
  userID: number
  internalAuditRegister: any[] = []
  orgID: string
  isLoading = true;
  unitSpecific: any
  userDivision: any
  corporateUser: any
  division_uuids: any[] = [];
  backToHistory: Boolean = false
  subject$: ReplaySubject<internal_audit_regsiter[]> = new ReplaySubject<internal_audit_regsiter[]>(1);
  data$: Observable<internal_audit_regsiter[]> = this.subject$.asObservable();
  customers: internal_audit_regsiter[];
  serachReference: any = ""
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Reported Date', property: 'report_date', visible: true, isModelProperty: true },
    { name: 'Internal Audit', property: 'internal_audit', visible: true, isModelProperty: true },
    { name: 'Findings', property: 'finding', visible: true, isModelProperty: true },
    { name: 'Severity', property: 'severity', visible: true, isModelProperty: true },
    { name: 'Due Date', property: 'due_date', visible: true, isModelProperty: true },
    { name: 'Assignee', property: 'assignee', visible: true, isModelProperty: true },
    { name: 'status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<internal_audit_regsiter>;
  totalItems = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  Form: any;
  userUploadedFiles: never[];
  pdfSrcs: never[];

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private internalAuditService: InternalAuditService,
    private route: ActivatedRoute,
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
    ).subscribe((customers: any[]) => {
      this.internalAuditRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.audit_inspection
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
        const status = result.ext_aud_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_corrective_actions({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_corrective_actions(pageEvent: PageEvent) {
    this.isLoading = false;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.internalAuditService.get_corrective_action_register(this.userID, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem);
        this.correctiveActions.splice(startIndex, endIndex, ...data);
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

    this.internalAuditRegister = []
    this.isLoading = true;

    // this.externalAuditService.get_external_audit_corrective_register_search(this.serachReference).subscribe({
    //   next: (result: any) => {
    //     const data = result.data.map((elem: any) => elem);
    //     this.correctiveActions = data



    //   },
    //   error: (err: any) => {
    //     this.router.navigate(["/error/internal"])
    //   },
    //   complete: () => {
    //     this.isLoading = false;
    //     this.prepareView()
    //   }
    // })

  }

  isActionAllowed(row: any): boolean {

    if (row.attributes.status === "Completed" || row.attributes.status === "Rejected") {
      return false; // Disable the buttons
    } else {
      return true; // Enable the buttons
    }
  }

  updateActionPlan(data: any) {
    this.backToHistory = true
    const AudID = data.attributes.internal_audit.data.attributes.reference_number
    if (data.attributes.status === "Under Review" || data.attributes.status === "Implemented") {
      this.router.navigate(["/apps/audit-inspection/internal-audit/corporate-update-action-plan/" + data.id])
    } else {
      this.router.navigate(["/apps/audit-inspection/internal-audit/update-action-plan/" + data.id])
    }
  }

  viewActionPlan(data: any) {
    this.backToHistory = true
    this.router.navigate(["/apps/audit-inspection/internal-audit/view-action-plan/" + data.id])
  }

  reset() {
    this.serachReference = ''
    this.ngOnInit()
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<internal_audit_regsiter>(this.correctiveActions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  statusButton(data: any) {
    const open = "btn-light"
    const inProgress = "btn-info"
    const underReview = "btn-secondary"
    const approved = "btn-primary"
    const modiRequired = "btn-warning"
    const Implemented = "btn-custom"
    const underImplementation = "btn-custom-implement"
    const completed = "btn-success"
    const pending = "btn-teal"
    const rejected = "btn-danger"

    if (data === "Open") {
      return open
    } else if (data === "In Progress") {
      return inProgress
    } else if (data === "Implemented") {
      return Implemented
    }
    else if (data === "Under Review") {
      return underReview
    } else if (data === "Approved") {
      return approved
    } else if (data === "Modification Required") {
      return modiRequired
    } else if (data === "Under Implementation") {
      return underImplementation
    }
    else if (data === "Completed") {
      return completed
    }
    else if (data === "Pending") {
      return pending
    }
    else if (data === "Rejected") {
      return rejected
    }
    else {
      return
    }
  }



  view(data: any) {
    this.router.navigate(["/apps/audit-inspection/internal-audit/view/" + data.reference_number])

  }

  modify(data: any) {
    this.router.navigate(["/apps/audit-inspection/internal-audit/modify/" + data.reference_number])
  }

  completed(data: any) {
    this.router.navigate(["/apps/audit-inspection/internal-audit/completed/" + data.reference_number])
  }

  action(data: any) {
    this.router.navigate(["/apps/audit-inspection/internal-audit/audit/" + data.reference_number])

  }
  print() {
    // this.dialog.open(GenerateReportComponent, { width: '400px', data: { user_Divisions: this.division_uuids } }).afterClosed().subscribe({
    //   next: (result: any) => {
    //     if (result.division === "All") {

    //       document.getElementById('ext_report')?.classList.add("hide");
    //       document.getElementById('ext_report_loader')?.classList.remove("hide")
    //       this.externalAuditService.external_audit_register(result).subscribe((response: any) => {
    //         let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //         const url = window.URL.createObjectURL(blob);
    //         window.open(url)
    //         document.getElementById('ext_report')?.classList.remove("hide");
    //         document.getElementById('ext_report_loader')?.classList.add("hide")
    //       })


    //     } else {

    //       document.getElementById('ext_report')?.classList.add("hide");
    //       document.getElementById('ext_report_loader')?.classList.remove("hide")
    //       this.externalAuditService.external_audit_register_division(result).subscribe((response: any) => {
    //         let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //         const url = window.URL.createObjectURL(blob);
    //         window.open(url)
    //         document.getElementById('ext_report')?.classList.remove("hide");
    //         document.getElementById('ext_report_loader')?.classList.add("hide")
    //       })



    //     }

    //   },
    //   error: (err: any) => { },
    //   complete: () => { }
    // })

  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}

