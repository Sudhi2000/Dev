import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { ExternalAuditService } from 'src/app/services/external-audit.service';
import { external_audit_register, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { GenerateReportComponent } from './generate-report/generate-report.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

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
  backToHistory: Boolean = false
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Year', property: 'start_date', visible: true, isModelProperty: true },
    { name: 'Expiry', property: 'expiry_date', visible: true, isModelProperty: true },
    { name: 'Audit Type', property: 'audit_type', visible: true, isModelProperty: true },
    { name: 'Audit Category', property: 'audit_category', visible: true, isModelProperty: true },
    { name: 'Audit Standard', property: 'audit_standard', visible: true, isModelProperty: true },
    { name: 'Customer', property: 'customer', visible: true, isModelProperty: true },
    { name: 'Audit Firm', property: 'audit_firm', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Audit Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Lapsed Status', property: 'lapsed_status', visible: true, isModelProperty: true },
    { name: 'status', property: 'audit_status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<external_audit_register>;
  totalItems = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private externalAuditService: ExternalAuditService,
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
        const status = result.ext_aud_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_external_audit_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
                this.division_uuids.push(elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_external_audit_unit_specific_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          } else {
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_external_audit_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_external_audit_unit_specific_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.externalAuditService.get_external_audit_unit_specific_register(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.externalAuditRegister.splice(startIndex, endIndex, ...data);
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
  get_external_audit_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.externalAuditService.get_external_audit_resgiter(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.externalAuditRegister.splice(startIndex, endIndex, ...data);
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
      this.externalAuditService.get_external_audit_unit_specific_resgiter_search(this.serachReference, this.userDivision).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.externalAuditRegister = data



        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          this.isLoading = false;
          this.prepareView()
        }
      })
    } else {
      this.externalAuditService.get_external_audit_resgiter_search(this.serachReference).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.externalAuditRegister = data



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
    this.dataSource = new MatTableDataSource<external_audit_register>(this.externalAuditRegister);
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
    const Pending = "btn-warning"

    if (data === "Draft") {
      return draft
    } else if (data === "Scheduled") {
      return scheduled
    } else if (data === "In Progress") {
      return inProgress
    } else if (data === "Completed") {
      return completed
    }
    else if (data === "Passed") {
      return approved
    } else if (data === "Approved") {
      return approved
    } else if (data === "Rejected") {
      return rejected
    } else if (data === "Hold") {
      return hold
    } else if (data === "Change Requested") {
      return changeReq
    } else if (data === "Pending") {
      return Pending
    }
    else {
      return
    }
  }
  lapsedStatusButton(data: any) {
    const warning = "btn-warning"
    const success = "btn-success"
    const danger = "btn-danger"
    if (data === "warning") {
      return warning
    } else if (data === "success") {
      return success
    } else if (data === "danger") {
      return danger
    }
    else {
      return
    }
  }



  view(data: any) {
    this.backToHistory = true
    this.router.navigate(["/apps/audit-inspection/external-audit/view/" + data.reference_number])

  }

  modify(data: any) {
    this.backToHistory = true
    this.router.navigate(["/apps/audit-inspection/external-audit/modify/" + data.reference_number])
  }

  completed(data: any) {
    this.backToHistory = true
    this.router.navigate(["/apps/audit-inspection/external-audit/completed/" + data.reference_number])
  }

  action(data: any) {
    this.backToHistory = true
    this.router.navigate(["/apps/audit-inspection/external-audit/audit/" + data.reference_number])

  }
  // print() {
  //   this.dialog.open(GenerateReportComponent,{ width: '400px'  , data: { user_Divisions: this.division_uuids}}).afterClosed().subscribe({
  //     next: (result: any) => {
  //       if (result.division === "All") {
  //         document.getElementById('ext_report')?.classList.add("hide");
  //         document.getElementById('ext_report_loader')?.classList.remove("hide")
  //         this.externalAuditService.external_audit_register(result).subscribe((response: any) => {
  //           let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //           const url = window.URL.createObjectURL(blob);
  //           window.open(url)
  //           document.getElementById('ext_report')?.classList.remove("hide");
  //           document.getElementById('ext_report_loader')?.classList.add("hide")
  //         })


  //       } else {

  //         document.getElementById('ext_report')?.classList.add("hide");
  //         document.getElementById('ext_report_loader')?.classList.remove("hide")
  //         this.externalAuditService.external_audit_register_division(result).subscribe((response: any) => {
  //           let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //           const url = window.URL.createObjectURL(blob);
  //           window.open(url)
  //           document.getElementById('ext_report')?.classList.remove("hide");
  //           document.getElementById('ext_report_loader')?.classList.add("hide")
  //         })



  //       }

  //     },
  //     error: (err: any) => { },
  //     complete: () => { }
  //   })

  // }


  generateReport() {
    this.dialog.open(GenerateReportComponent, { width: '400px', data: { user_Divisions: this.division_uuids } }).afterClosed().subscribe(data => {
      let parameter: any = []
      if (data.start && data.end && !data.year && !data.audit_Category && !data.division) {

        parameter.push({
          start_date: data?.start,
          end_date: data?.end,
          defualt_date: data?.defualt_date,
        })
        document.getElementById('ext_report')?.classList.add("hide");
        document.getElementById('ext_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.externalAuditService.external_audit_register(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.externalAuditService.external_audit_register_excel(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        }
      } else if (data.start && data.end && !data.year && !data.audit_Category && data.division) {

        parameter.push({
          start_date: data?.start,
          end_date: data?.end,
          division: data?.division,
          defualt_date: data?.defualt_date,
        })
        document.getElementById('ext_report')?.classList.add("hide");
        document.getElementById('ext_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.externalAuditService.external_audit_register_2(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.externalAuditService.external_audit_register_excel_2(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        }
      } else if (data.start && data.end && !data.year && data.audit_Category && !data.division) {
        parameter.push({
          start_date: data?.start,
          end_date: data?.end,
          audit_category: data?.audit_Category,
          defualt_date: data?.defualt_date,
        })
        document.getElementById('ext_report')?.classList.add("hide");
        document.getElementById('ext_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.externalAuditService.external_audit_register_3(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.externalAuditService.external_audit_register_excel_3(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        }
      } else if (data.start && data.end && !data.year && data.audit_Category && data.division) {

        parameter.push({
          start_date: data?.start,
          end_date: data?.end,
          audit_category: data?.audit_Category,
          division: data?.division,
          defualt_date: data?.defualt_date,
        })
        document.getElementById('ext_report')?.classList.add("hide");
        document.getElementById('ext_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.externalAuditService.external_audit_register_4(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.externalAuditService.external_audit_register_excel_4(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        }
      } else if (!data.start && !data.end && data.year && !data.audit_Category && !data.division) {

        parameter.push({
          year: data?.year || null,
          defualt_date: data?.defualt_date
        })
        document.getElementById('ext_report')?.classList.add("hide");
        document.getElementById('ext_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.externalAuditService.external_audit_register_5(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.externalAuditService.external_audit_register_excel_5(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        }
      } else if (!data.start && !data.end && data.year && !data.audit_Category && data.division) {

        parameter.push({
          year: data?.year || null,
          division: data?.division || null,
          defualt_date: data?.defualt_date
        })
        document.getElementById('ext_report')?.classList.add("hide");
        document.getElementById('ext_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.externalAuditService.external_audit_register_6(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.externalAuditService.external_audit_register_excel_6(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        }
      } else if (!data.start && !data.end && data.year && data.audit_Category && !data.division) {
        parameter.push({
          year: data?.year || null,
          audit_category: data?.audit_category || null,
          defualt_date: data?.defualt_date
        })
        document.getElementById('ext_report')?.classList.add("hide");
        document.getElementById('ext_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.externalAuditService.external_audit_register_7(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.externalAuditService.external_audit_register_excel_7(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        }
      } else if (!data.start && !data.end && data.year && data.audit_Category && data.division) {

        parameter.push({
          year: data?.year || null,
          division: data?.division || null,
          audit_Category: data?.audit_Category,
          defualt_date: data?.defualt_date
        })
        document.getElementById('ext_report')?.classList.add("hide");
        document.getElementById('ext_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.externalAuditService.external_audit_register_8(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.externalAuditService.external_audit_register_excel_8(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('ext_report_loader')?.classList.add("hide");
            document.getElementById('ext_report')?.classList.remove("hide")
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
