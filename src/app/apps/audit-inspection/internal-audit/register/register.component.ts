import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import Swal from 'sweetalert2';
import { ReportParameterComponent } from './report-parameter/report-parameter.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  internalAuditRegister: any[] = []
  orgID: string
  serachReference: any = ""
  maxTitleLength: number = 15;
  subject$: ReplaySubject<internal_audit_regsiter[]> = new ReplaySubject<internal_audit_regsiter[]>(1);
  data$: Observable<internal_audit_regsiter[]> = this.subject$.asObservable();
  customers: internal_audit_regsiter[];
  unitSpecific: any
  userDivision: any
  corporateUser: any
  userID: Number

  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Year', property: 'start_date', visible: true, isModelProperty: true },
    // { name: 'Month', property: 'end_date', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    // { name: 'Department', property: 'department', visible: true, isModelProperty: true },
    { name: 'Audit Title', property: 'title', visible: true, isModelProperty: true },
    { name: 'Audit Type', property: 'type', visible: true, isModelProperty: true },
    { name: 'auditee', property: 'auditee', visible: true, isModelProperty: true },
    { name: 'approver', property: 'approver', visible: true, isModelProperty: true },
    { name: 'Category Status', property: 'pending_audit', visible: true },
    { name: 'status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  dataSource: MatTableDataSource<internal_audit_regsiter>;
  isLoading = true;
  totalItems = 0;
  backToHistory: Boolean = false

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private internalAuditService: InternalAuditService,
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
        const status = result.int_aud_history
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_internal_audit_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[$or][2][business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_internal_audit_unit_specific_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_internal_audit_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_internal_audit_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.internalAuditService.get_internal_audit_resgiter(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => ({ ...elem.attributes, id: elem.id }));
        this.internalAuditRegister.splice(startIndex, endIndex, ...data);
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
      }
    });
  }

  get_internal_audit_unit_specific_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.internalAuditService.get_internal_audit_unit_specific_register(this.userID, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => ({ ...elem.attributes, id: elem.id }));
        this.internalAuditRegister.splice(startIndex, endIndex, ...data);
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
      }
    });
  }

  shouldTruncateTitle(title: string): boolean {
    return title.length > this.maxTitleLength;
  }
  generate() {
    this.isLoading = true;
    if (this.unitSpecific && !this.corporateUser) {
      this.internalAuditService.get_internal_audit_unit_specific_register_search(this.serachReference, this.userDivision).subscribe({
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
      this.internalAuditService.get_internal_audit_resgiter_search(this.serachReference).subscribe({
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
    const approved = "btn-secondary"
    const rejected = "btn-danger"
    const hold = "btn-info"
    const changeReq = "btn-dark"

    if (data === "Draft") {
      return draft
    } else if (data === "Scheduled") {
      return scheduled
    } else if (data === "In-Progress") {
      return inProgress
    } else if (data === "Completed") {
      return completed
    } else if (data === "Approved") {
      return approved
    } else if (data === "Rejected") {
      return rejected
    } else if (data === "Hold") {
      return hold
    } else if (data === "Change Requested") {
      return changeReq
    } else {
      return
    }


  }


  print(data: any) {
    document.getElementById(data)?.classList.add("hide");
    document.getElementById(data + '_1')?.classList.remove("hide")


    this.internalAuditService.get_internal_audit_resgiter_search(data).subscribe({
      next: (result: any) => {
        const audID = result.data[0].id
        this.internalAuditService.internal_audit_report(audID).subscribe((response: any) => {
          let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          const url = window.URL.createObjectURL(blob);
          window.open(url)
          document.getElementById(data)?.classList.remove("hide");
          document.getElementById(data + '_1')?.classList.add("hide")
        })
      },
      error: (err: any) => { },
      complete: () => { }
    })



  }
  markAsReopened(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: `Please reconfirm that the ${data.reference_number} has been reopened. If reopened, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to cancel the process.`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        const id = data.id;
        this.internalAuditService.audit_reopen(id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            Swal.fire({
              title: 'Audit Reopened',
              imageUrl: 'assets/images/reported.gif',
              imageWidth: 250,
              text: `The audit ${data.reference_number} has You have Reopened. If necessary, please generate the audit report from generate details. You can generate the report anytime from the register window.`,
              showCancelButton: false,
            });
            this.router.navigate(['/apps/audit-inspection/internal-audit/queue']);
          },
        });
      }
      else {
        Swal.close()
      }
    });

  }
  view(data: any) {
    this.backToHistory = true
    this.router.navigate(["/apps/audit-inspection/internal-audit/view/" + data.reference_number])

  }

  modify(data: any) {
    this.backToHistory = true
    this.router.navigate(["/apps/audit-inspection/internal-audit/modify/" + data.reference_number])
  }

  action(data: any) {
    this.backToHistory = true
    this.router.navigate(["/apps/audit-inspection/internal-audit/completed-audit/" + data.reference_number])

  }

  generateReport() {
    this.dialog.open(ReportParameterComponent).afterClosed().subscribe(data => {
      let parameter: any = []
      if (data.startDate && data.endDate && !data.year && !data.month && !data.business_unit) {

        parameter.push({
          start_date: data?.startDate,
          end_date: data?.endDate,
          defualt_date: data?.defualt_date,
        })
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.internalAuditService.internal_audit_register_report(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.internalAuditService.internal_audit_register_report_excel(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      } else if (data.startDate && data.endDate && !data.year && !data.month && data.business_unit) {

        parameter.push({
          start_date: data?.startDate,
          end_date: data?.endDate,
          division: data?.business_unit,
          defualt_date: data?.defualt_date,
        })
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.internalAuditService.internal_audit_register_report_2(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.internalAuditService.internal_audit_register_report_excel_2(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      } else if (!data.startDate && !data.endDate && data.year && !data.month && !data.business_unit) {
        parameter.push({
          year: data?.year || null,
          defualt_date: data?.defualt_date,
        })
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.internalAuditService.internal_audit_register_report_3(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.internalAuditService.internal_audit_register_report_excel_3(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      } else if (!data.startDate && !data.endDate && data.year && data.month && !data.business_unit) {

        parameter.push({
          year: data?.year || null,
          month: data?.month || null,
          defualt_date: data?.defualt_date,
        })
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.internalAuditService.internal_audit_register_report_4(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.internalAuditService.internal_audit_register_report_excel_4(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      } else if (!data.startDate && !data.endDate && data.year && !data.month && data.business_unit) {

        parameter.push({
          year: data?.year || null,
          division: data?.business_unit || null,
          defualt_date: data?.defualt_date
        })
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.internalAuditService.internal_audit_register_report_5(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.internalAuditService.internal_audit_register_report_excel_5(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      } else if (!data.startDate && !data.endDate && data.year && data.month && data.business_unit) {

        parameter.push({
          year: data?.year || null,
          month: data?.month || null,
          division: data?.business_unit || null,
          defualt_date: data?.defualt_date
        })
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.internalAuditService.internal_audit_register_report_6(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.internalAuditService.internal_audit_register_report_excel_6(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      } else if (!data.startDate && !data.endDate && !data.year && data.month && data.business_unit) {

        parameter.push({
          month: data?.month || null,
          division: data?.business_unit || null,
          defualt_date: data?.defualt_date
        })
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.internalAuditService.internal_audit_register_report_7(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.internalAuditService.internal_audit_register_report_excel_7(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      }
    })

  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
