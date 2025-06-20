import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject, filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { ListColumn, external_audit_register } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { GenerateReportComponent } from '../register/generate-report/generate-report.component';
import { ExternalAuditService } from 'src/app/services/external-audit.service';
import { UpdateActionPlanComponent } from '../update-action-plan/update-action-plan.component';
import { ViewActionPlanComponent } from '../view-action-plan/view-action-plan.component';
import { CorrectiveCorporateuserComponent } from '../corrective-corporateuser/corrective-corporateuser.component';

@Component({
  selector: 'app-corrective-register',
  templateUrl: './corrective-register.component.html',
  styleUrls: ['./corrective-register.component.scss']
})
export class CorrectiveRegisterComponent implements OnInit {

  correctiveActions: any[] = []
  userID: number
  externalAuditRegister: any[] = []
  orgID: string
  isLoading = true;
  unitSpecific: any
  userDivision: any
  corporateUser: any
  division_uuids: any[] = [];
  subject$: ReplaySubject<external_audit_register[]> = new ReplaySubject<external_audit_register[]>(1);
  data$: Observable<external_audit_register[]> = this.subject$.asObservable();
  customers: external_audit_register[];
  serachReference: any = ""
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Reported Date', property: 'report_date', visible: true, isModelProperty: true },
    { name: 'External Audit', property: 'external_audit', visible: true, isModelProperty: true },
    { name: 'Findings', property: 'finding', visible: true, isModelProperty: true },
    { name: 'Severity', property: 'severity', visible: true, isModelProperty: true },
    { name: 'Due Date', property: 'due_date', visible: true, isModelProperty: true },
    { name: 'Assignee', property: 'assignee', visible: true, isModelProperty: true },
    { name: 'status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<external_audit_register>;
  totalItems = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  Form: any;
  userUploadedFiles: never[];
  pdfSrcs: never[];

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private externalAuditService: ExternalAuditService,
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
    ).subscribe((customers) => {
      this.externalAuditRegister = customers;
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
          this.get_corrective_actions({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_corrective_actions(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.externalAuditService.get_corrective_action_register(this.userID, startIndex, pageEvent.pageSize).subscribe({
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

this.externalAuditRegister=[]
    this.isLoading = true;
   
      this.externalAuditService.get_external_audit_corrective_register_search(this.serachReference).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem);
          this.correctiveActions = data



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

  isActionAllowed(row: any): boolean {
    
    if (row.attributes.status === "Completed" || row.attributes.status === "Rejected" ) {
      return false; // Disable the buttons
    } else {
      return true; // Enable the buttons
    }
  }

  updateActionPlan(data: any) { 
    const AudID = data.attributes.external_audit.data.attributes.reference_number
    if (data.attributes.status === "Under Review" || data.attributes.status === "Implemented") {
      this.externalAuditService.get_external_audits_reference(AudID).subscribe(
        {
          next: (result: any) => {
            const id = result.data[0].id
            const reference = result.data[0].attributes.reference_number
            this.dialog.open(CorrectiveCorporateuserComponent, { data: { data: data, audid: id, reference: reference } }).afterClosed().subscribe(data => {
              this.get_corrective_actions({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            })
          },
          error: (err: any) => { },
          complete: () => {

          }
        }
      )
    } else {
      this.externalAuditService.get_external_audits_reference(AudID).subscribe(
        {
          next: (result: any) => {
            const id = result.data[0].id
            const reference = result.data[0].attributes.reference_number
            this.dialog.open(UpdateActionPlanComponent, { data: { data: data, audid: id, reference: reference } }).afterClosed().subscribe(data => {
              this.get_corrective_actions({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            })
          },
          error: (err: any) => { },
          complete: () => {

          }
        }
      )
    }
  }

  viewActionPlan(data: any) {
    this.dialog.open(ViewActionPlanComponent, { data: { data: data } }).afterClosed().subscribe(data => {
    }
    )
  } 

  reset() {
    this.serachReference = ''
    this.ngOnInit()
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<external_audit_register>(this.correctiveActions);
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
    const completed= "btn-success"
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
    this.router.navigate(["/apps/audit-inspection/external-audit/view/" + data.reference_number])

  }

  modify(data: any) {
    this.router.navigate(["/apps/audit-inspection/external-audit/modify/" + data.reference_number])
  }

  completed(data: any) {
    this.router.navigate(["/apps/audit-inspection/external-audit/completed/" + data.reference_number])
  }

  action(data: any) {
    this.router.navigate(["/apps/audit-inspection/external-audit/audit/" + data.reference_number])

  }
  print() {
    this.dialog.open(GenerateReportComponent, { width: '400px', data: { user_Divisions: this.division_uuids } }).afterClosed().subscribe({
      next: (result: any) => {
        if (result.division === "All") {

          document.getElementById('ext_report')?.classList.add("hide");
          document.getElementById('ext_report_loader')?.classList.remove("hide")
          this.externalAuditService.external_audit_register(result).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report')?.classList.remove("hide");
            document.getElementById('ext_report_loader')?.classList.add("hide")
          })


        } else {

          document.getElementById('ext_report')?.classList.add("hide");
          document.getElementById('ext_report_loader')?.classList.remove("hide")
          this.externalAuditService.external_audit_register_division(result).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report')?.classList.remove("hide");
            document.getElementById('ext_report_loader')?.classList.add("hide")
          })



        }

      },
      error: (err: any) => { },
      complete: () => { }
    })

  }

  // isActionAllowed(row: any): boolean {
  //   if (row.attributes.assignee.data.id === row.attributes.initial_assignee.data.id &&
  //     (row.attributes.status !== "Completed")) {
  //     return false;
  //   }
  //   else {
  //     if (this.userID === row.attributes.initial_assignee.data.id &&
  //       (row.attributes.status === "Open" || row.attributes.status === "Under Review")) {
  //       return false
  //     }
  //     else if (this.userID !== row.attributes.initial_assignee.data.id &&
  //       (row.attributes.status === "Open" || row.attributes.status === "Modification Required" || row.attributes.status === "In Progress" || row.attributes.status === "Approved")) {
  //       return false
  //     }
  //     return true
  //   }

  // }
}
