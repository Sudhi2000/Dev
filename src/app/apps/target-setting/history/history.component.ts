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
import { TargetSettingService } from 'src/app/services/target-setting.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  targetSettingRegister: any[] = []
  orgID: string
  pending = "Waste, Water"
  subject$: ReplaySubject<environment_register[]> = new ReplaySubject<environment_register[]>(1);
  data$: Observable<environment_register[]> = this.subject$.asObservable();
  customers: environment_register[];
  serachReference: any = ""
  unitSpecific: any
  userDivision: any
  corporateUser: any
  @Input()
  columns: ListColumn[] = [
    { name: 'reference_number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'division', property: 'division', visible: true, isModelProperty: true },
    { name: 'department', property: 'department', visible: true, isModelProperty: true },
    { name: 'category', property: 'category', visible: true, isModelProperty: true },
    { name: 'source', property: 'source', visible: true, isModelProperty: true },
    { name: 'responsible', property: 'responsible', visible: true, isModelProperty: true },
    { name: 'approver', property: 'approver', visible: true, isModelProperty: true },
    { name: 'implementation_timeline', property: 'implementation_timeline', visible: true, isModelProperty: true },
    { name: 'progress', property: 'progress', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<environment_register>;
  isLoading = true;
  totalItems = 0;
  backToHistory: Boolean = false

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private targetSettingService: TargetSettingService) { }

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
      this.targetSettingRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.target_setting
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
        const status = result.trs_history
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_target_setting_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })

            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_target_setting_unit_specific_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_target_setting_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_target_setting_unit_specific_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.targetSettingService.get_target_setting_unit_specific(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        let data: any[] = []
        result.data.forEach((elem: any) => {
          const baseline = elem.attributes.baseline_consumption
          const consumption = elem.attributes.target_progresses.data.reduce((acc: any, cur: any) => acc + Number(cur.attributes.actual_savings), 0)
          let percentage: any = 0
          let color_code: any = ""
          if (consumption >= baseline) {
            percentage = Number(100)
          } else if (consumption < baseline) {
            percentage = Number(Math.round(Number(consumption) / Number(baseline) * 100).toFixed(0))
          }
          if (percentage <= 20) {
            color_code = 'danger'
          } else if (percentage > 20 && percentage <= 40) {
            color_code = 'info'
          } else if (percentage > 40 && percentage <= 60) {
            color_code = 'primary'
          } else if (percentage > 60 && percentage <= 80) {
            color_code = 'warning'
          } else if (percentage > 80 && percentage <= 1000) {
            color_code = 'success'
          }

          data.push({
            id: elem.id,
            reference_number: elem.attributes.reference_number,
            division: elem.attributes.division,
            department: elem.attributes.department,
            category: elem.attributes.category,
            source: elem.attributes.source,
            responsible: elem.attributes.responsible,
            approver: elem.attributes.approver,
            implemention_start: elem.attributes.implemention_start,
            implementation_end: elem.attributes.implementation_end,
            status: elem.attributes.status,
            progress: consumption,
            pending_percentage: percentage,
            pending_color_code: color_code
          })
        })
        this.totalItems = result.meta.pagination.total;
        this.targetSettingRegister.splice(startIndex, endIndex, ...data);
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

  get_target_setting_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.targetSettingService.get_target_setting(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        let data: any[] = []
        result.data.forEach((elem: any) => {
          const baseline = elem.attributes.baseline_consumption
          const consumption = elem.attributes.target_progresses.data.reduce((acc: any, cur: any) => acc + Number(cur.attributes.actual_savings), 0)
          let percentage: any = 0
          let color_code: any = ""
          if (consumption >= baseline) {
            percentage = Number(100)
          } else if (consumption < baseline) {
            percentage = Number(Math.round(Number(consumption) / Number(baseline) * 100).toFixed(0))
          }
          if (percentage <= 20) {
            color_code = 'danger'
          } else if (percentage > 20 && percentage <= 40) {
            color_code = 'info'
          } else if (percentage > 40 && percentage <= 60) {
            color_code = 'primary'
          } else if (percentage > 60 && percentage <= 80) {
            color_code = 'warning'
          } else if (percentage > 80 && percentage <= 1000) {
            color_code = 'success'
          }

          data.push({
            id: elem.id,
            reference_number: elem.attributes.reference_number,
            division: elem.attributes.division,
            department: elem.attributes.department,
            category: elem.attributes.category,
            source: elem.attributes.source,
            responsible: elem.attributes.responsible,
            approver: elem.attributes.approver,
            implemention_start: elem.attributes.implemention_start,
            implementation_end: elem.attributes.implementation_end,
            status: elem.attributes.status,
            progress: consumption,
            pending_percentage: percentage,
            pending_color_code: color_code
          })
        })
        this.totalItems = result.meta.pagination.total;
        this.targetSettingRegister.splice(startIndex, endIndex, ...data);
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
      this.targetSettingService.get_target_setting_unit_specific_search(this.serachReference, this.userDivision).subscribe({
        next: (result: any) => {
          console.log(result)

          let data: any[] = []

          result.data.forEach((elem: any) => {
            const baseline = elem.attributes.baseline_consumption
            const consumption = elem.attributes.target_progresses.data.reduce((acc: any, cur: any) => acc + Number(cur.attributes.actual_savings), 0)
            let percentage: any = 0
            let color_code: any = ""
            if (consumption >= baseline) {
              percentage = Number(100)
            } else if (consumption < baseline) {
              percentage = Number(Math.round(Number(consumption) / Number(baseline) * 100).toFixed(0))
            }
            if (percentage <= 20) {
              color_code = 'danger'
            } else if (percentage > 20 && percentage <= 40) {
              color_code = 'info'
            } else if (percentage > 40 && percentage <= 60) {
              color_code = 'primary'
            } else if (percentage > 60 && percentage <= 80) {
              color_code = 'warning'
            } else if (percentage > 80 && percentage <= 1000) {
              color_code = 'success'
            }

            data.push({
              id: elem.id,
              reference_number: elem.attributes.reference_number,
              division: elem.attributes.division,
              department: elem.attributes.department,
              category: elem.attributes.category,
              source: elem.attributes.source,
              responsible: elem.attributes.responsible,
              approver: elem.attributes.approver,
              implemention_start: elem.attributes.implemention_start,
              implementation_end: elem.attributes.implementation_end,
              status: elem.attributes.status,
              progress: consumption,
              pending_percentage: percentage,
              pending_color_code: color_code
            })
          })

          this.targetSettingRegister = data


          // const data = result.data.map((elem: any) => elem.attributes);
          // this.environmentRegister=data


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
      this.targetSettingService.get_target_setting_search(this.serachReference).subscribe({
        next: (result: any) => {
          console.log(result)

          let data: any[] = []

          result.data.forEach((elem: any) => {
            const baseline = elem.attributes.baseline_consumption
            const consumption = elem.attributes.target_progresses.data.reduce((acc: any, cur: any) => acc + Number(cur.attributes.actual_savings), 0)
            let percentage: any = 0
            let color_code: any = ""
            if (consumption >= baseline) {
              percentage = Number(100)
            } else if (consumption < baseline) {
              percentage = Number(Math.round(Number(consumption) / Number(baseline) * 100).toFixed(0))
            }
            if (percentage <= 20) {
              color_code = 'danger'
            } else if (percentage > 20 && percentage <= 40) {
              color_code = 'info'
            } else if (percentage > 40 && percentage <= 60) {
              color_code = 'primary'
            } else if (percentage > 60 && percentage <= 80) {
              color_code = 'warning'
            } else if (percentage > 80 && percentage <= 1000) {
              color_code = 'success'
            }

            data.push({
              id: elem.id,
              reference_number: elem.attributes.reference_number,
              division: elem.attributes.division,
              department: elem.attributes.department,
              category: elem.attributes.category,
              source: elem.attributes.source,
              responsible: elem.attributes.responsible,
              approver: elem.attributes.approver,
              implemention_start: elem.attributes.implemention_start,
              implementation_end: elem.attributes.implementation_end,
              status: elem.attributes.status,
              progress: consumption,
              pending_percentage: percentage,
              pending_color_code: color_code
            })
          })

          this.targetSettingRegister = data


          // const data = result.data.map((elem: any) => elem.attributes);
          // this.environmentRegister=data


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
    this.dataSource = new MatTableDataSource<environment_register>(this.targetSettingRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  statusButton(data: any) {
    const open = "btn-light"
    const approve = "btn-info"
    const reject = 'btn-danger'
    const hold = "btn-warning"
    const inprogress = "btn-secondary"
    const completed = "btn-success"

    if (data === "Open") {
      return open
    } else if (data === "Approved") {
      return approve
    } else if (data === "Rejected") {
      return reject
    } else if (data === "Hold") {
      return hold
    } else if (data === "In-Progress") {
      return inprogress
    } else if (data === "Completed") {
      return completed
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
    this.router.navigate(["apps/target-setting/view/" + reference])
  }

  print(data: any) {
    // const targetData = this.targetProgress.filter(function (elemData) {
    //   return (elemData.attributes.target_setting.data.id == elem.id)
    // })
    document.getElementById(data)?.classList.add("hide");
    document.getElementById(data + '_1')?.classList.remove("hide")
    this.targetSettingService.target_report(data).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      window.open(url)
      document.getElementById(data)?.classList.remove("hide");
      document.getElementById(data + '_1')?.classList.add("hide")
    })
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
