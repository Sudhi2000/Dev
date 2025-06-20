import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { SchedulerService } from 'src/app/services/scheduler.api.service';
import { ehs, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { EmailComponent } from '../email/email.component';
import { ReportParameterComponent } from './report-parameter/report-parameter.component';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  corporateUser: any
  ehsRegister: any[] = []
  orgID: string

  subject$: ReplaySubject<ehs[]> = new ReplaySubject<ehs[]>(1);
  data$: Observable<ehs[]> = this.subject$.asObservable();
  customers: ehs[];
  serachReference: any = ""
  unitSpecific: any
  userDivision: any
  backToHistory: Boolean = false
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  @Input()
  columns: ListColumn[] = [
    { name: 'Risk Level', property: 'level', visible: true, isModelProperty: true },
    { name: 'Date', property: 'reported_date', visible: true, isModelProperty: true },
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Category', property: 'category', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Due Date', property: 'due_date', visible: true, isModelProperty: true },
    { name: 'Delayed Days', property: 'delayed_days', visible: true, isModelProperty: true },
    { name: 'Reporter', property: 'reporter', visible: true, isModelProperty: true },
    { name: 'Responsible', property: 'responsible', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  isLoading = true;
  dataSource: MatTableDataSource<ehs>;
  totalItems = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private hazardService: HazardService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    public dialog: MatDialog, private scheduler: SchedulerService,
    private _snackBar: MatSnackBar) { }

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
        const status = result.ehs_history
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {

              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_ehs({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
            else if (!this.corporateUser) {
              let divisions: any[] = []
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results


              this.get_unit_specific_ehs({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            this.get_ehs({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_unit_specific_ehs(pageEvent: PageEvent) {
    this.isLoading = true;

    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;


    const endIndex = startIndex + pageEvent.pageSize;



    this.hazardService.get_ehs_unit_specific_register(this.orgID, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
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
        // this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.isLoading = false;
        this.prepareView()
      }
    })
  }

  get_ehs(pageEvent: PageEvent) {
    this.isLoading = true;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.hazardService.get_ehs_register(this.orgID, startIndex, pageEvent.pageSize).subscribe({
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


  // getDelayedDays(completedDate: Date, targeted_date: Date): number {

  //   if (!completedDate && !targeted_date) {
  //     return 0;
  //   }
  //   else if (completedDate && targeted_date) {
  //     const completedDateObject = new Date(completedDate);
  //     const targetedDateObject = new Date(targeted_date);
  //     const timeDiff = Math.abs(completedDateObject.getTime() - targetedDateObject.getTime());
  //     const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  //     return diffDays;

  //   }
  //   else if (!completedDate && targeted_date) {
  //     const todayDateObject = new Date();
  //     const targetedDateObject = new Date(targeted_date);
  //     const timeDiff = Math.abs(todayDateObject.getTime() - targetedDateObject.getTime());
  //     const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  //     return diffDays;

  //   }
  //   else {

  //     return 1; // return 0 if not delayed
  //   }

  // }

  getDelayedDays(completedDate: Date, targeted_date: Date): number {
    if (!completedDate && !targeted_date) {
      return 0;
    } else if (completedDate && targeted_date) {
      const completedDateObject = new Date(completedDate);
      const targetedDateObject = new Date(targeted_date);
      const timeDiff = completedDateObject.getTime() - targetedDateObject.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return Math.max(diffDays, 0);
    } else if (!completedDate && targeted_date) {
      const todayDateObject = new Date();
      const targetedDateObject = new Date(targeted_date);
      const timeDiff = todayDateObject.getTime() - targetedDateObject.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return Math.max(diffDays, 0);
    } else {
      return 0; // return 0 if not delayed
    }
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
    const draft = "btn-warning"
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
    } else if (data === "Draft") {
      return draft
    }
    else {
      return
    }
  }

  statusIcon(data: any) {
    const pending = "more-horizontal"
    const inprogress = "clock"
    const completed = "check-circle"
    const rejected = "slash"
    if (data === "Open") {
      return pending
    } else if (data === "In-Progress") {
      return inprogress
    } else if (data === "Completed") {
      return completed
    } else if (data === "Rejected") {
      return rejected
    } else {
      return
    }
  }

  view(data: any) {
    this.backToHistory = true
    this.router.navigate(["/apps/hazard-risk/view/" + data.reference_number])
  }
  delete(data: any) {
    const reference = data.reference_number;

    this.hazardService.get_ehs_details(this.orgID, reference).subscribe({
      next: (result: any) => {
        const id = result.data[0]?.id;
        if (!id) {

          return;
        }

        Swal.fire({
          title: 'Are you sure?',
          imageUrl: "assets/images/confirm-1.gif",
          imageWidth: 250,
          text: "Please click on 'Yes, Proceed' button otherwise simply click on 'Cancel' button to review the data.",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.hazardService.delete_ehs(id).subscribe({
              next: (result: any) => {
              },
              error: (err: any) => {
                console.error("Deletion error: ", err);
              },
              complete: () => {
                const statusText = "Ehs Deleted Successfully";
                this._snackBar.open(statusText, 'OK', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                Swal.close();
                this.ngOnInit();
              }
            });
          }
        });
      },
      error: (err: any) => {
        console.error("Fetching details error: ", err);
      }
    });
  }

  generateReport() {

    this.dialog.open(ReportParameterComponent, { disableClose: true }).afterClosed().subscribe(data => {
      if (data) {

        console.log("data", data)
        let parameter: any = []
        if (data.startDate && data.endDate && data.division) {
          const start_date = new Date(data.startDate);
          const startDate = start_date.toISOString().split('T')[0];
          const end_date = new Date(data.endDate);
          const endDate = end_date.toISOString().split('T')[0];

          parameter.push({
            company_name: data.company_name,
            division: data?.division,
            start_date: startDate,
            end_date: endDate,
            reporting_person: data?.reporting_person,
            reporting_mail: data?.reporting_email,

          })

          console.log("para", parameter);

          document.getElementById('ehs_report')?.classList.add("hide");
          document.getElementById('ehs_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.hazardService.ehs_register_report_pdf(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('ehs_report_loader')?.classList.add("hide");
              document.getElementById('ehs_report')?.classList.remove("hide")
            })
          }
          else if (data.format === "Excel") {
            this.hazardService.ehs_register_report_excel(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('ehs_report_loader')?.classList.add("hide");
              document.getElementById('ehs_report')?.classList.remove("hide")
            })
          }
        } else if (data.startDate && data.endDate && !data.division) {
          const start_date = new Date(data.startDate);
          const startDate = start_date.toISOString().split('T')[0];
          const end_date = new Date(data.endDate);
          const endDate = end_date.toISOString().split('T')[0];

          parameter.push({
            company_name: data.company_name,
            start_date: startDate,
            end_date: endDate,
            reporting_person: data?.reporting_person,
            reporting_mail: data?.reporting_email,
            // division: data?.division,
          })
          document.getElementById('ehs_report')?.classList.add("hide");
          document.getElementById('ehs_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.hazardService.ehs_register_report_pdf_2(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('ehs_report_loader')?.classList.add("hide");
              document.getElementById('ehs_report')?.classList.remove("hide")
            })
          } else if (data.format === "Excel") {
            this.hazardService.ehs_register_report_excel_2(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('ehs_report_loader')?.classList.add("hide");
              document.getElementById('ehs_report')?.classList.remove("hide")
            })
          }
        }
      }
    })
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

  modify(data: any) {
    this.backToHistory = true
    if (data.status === "Open" || data.status === "Draft") {
      this.router.navigate(["/apps/hazard-risk/modify/" + data.reference_number])
    } else {
      Swal.fire({
        title: 'Unable to Modify',
        imageUrl: "assets/images/block.gif",
        imageWidth: 250,
        text: "It is unable to edit a Completed or In-Progress Task",
        showCancelButton: false,
      })
    }
  }



  email(data: any) {
    this.dialog.open(EmailComponent, { width: "50%" }).afterClosed().subscribe((emailData: any) => {
      this.scheduler.create_hazard_schedule(data.reference_number, emailData.to_email, emailData.cc_email).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          const statusText = "Internal Error"
          this._snackBar.open(statusText, 'Close', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        },
        complete: () => {
          Swal.fire({
            title: 'Email Notification',
            imageUrl: "assets/images/email.png",
            imageWidth: 250,
            text: "You have successfully initiated the email notification. The recipient will receive an email notification shortly.",
            showCancelButton: false,

          })
        }
      })

    })
    // this.hazardService.email_ehs_report(data.reference_number).subscribe({
    //   next:(result:any)=>{
    //   },
    //   error:(err:any)=>{},
    //   complete:()=>{}
    // })
  }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

}
