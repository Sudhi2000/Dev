import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { ehs, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { GrievanceService } from 'src/app/services/grievance.api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApexGrid, ColumnConfiguration } from 'apex-grid';
import { FeedbackComponent } from '../feedback/feedback.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS } from '../report-non-grievance/report.component';
import { ReportParameterComponent } from './report-parameter/report-parameter.component';

ApexGrid.register();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class RegisterComponent implements OnInit {

  public initialPage: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  };
  grievanceRegister: any[] = []
  orgID: string
  unitSpecific: any
  userDivision: any
  corporateUser: any
  divisions: any[] = []
  subject$: ReplaySubject<ehs[]> = new ReplaySubject<ehs[]>(1);
  data$: Observable<ehs[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: ehs[];
  Division = new FormControl(['']);
  currentRate = 8;
  backToHistory: Boolean = false
  @Input()
  dateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  columns: ListColumn[] = [
    { name: 'Case ID', property: 'case_id', visible: true, isModelProperty: true },
    { name: 'Type', property: 'type', visible: true, isModelProperty: true },
    { name: 'Submission Date', property: 'submission_date', visible: true, isModelProperty: true },
    { name: 'Anonymous', property: 'anonymous', visible: true, isModelProperty: true },
    { name: 'Employee ID', property: 'employee_id', visible: true, isModelProperty: true },
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Gender', property: 'gender', visible: true, isModelProperty: true },
    { name: 'Business Unit', property: 'business_unit', visible: true, isModelProperty: true },
    { name: 'Department', property: 'department', visible: true, isModelProperty: true },
    { name: 'Category', property: 'category', visible: true, isModelProperty: true },
    { name: 'Severity Score', property: 'severity_score', visible: true, isModelProperty: true },


    { name: 'Employee Rating', property: 'rating', visible: true, isModelProperty: true },


    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'TAT Status', property: 'tat_status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 20;
  isLoading = true;
  dataSource: MatTableDataSource<ehs>;
  totalItems = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterForm: FormGroup

  constructor(
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private grievanceService: GrievanceService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit() {
    this.configuration()
    this.filterForm = this.formBuilder.group({
      startDate: [''],
      endDate: [''],
      division: [''],
      prevStartDate: [''],
      prevEndDate: [''],
      year: [],


    })
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((customers) => {
      this.grievanceRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.grievance
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
        const status = result.grev_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions();
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_grievance_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
                this.divisions = result.profile.divisions
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_unit_specific_grievance_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            this.get_divisions();
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_grievance_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    })
  }
  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {

        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
          division_uuid: attributes.division_uuid
        }));
        this.divisions = newArray;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });

  }
  get_grievance_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.grievanceService.get_grievance_register(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.grievanceRegister.splice(startIndex, endIndex, ...data);
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
  get_periodic_division_grievance_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startDate = new Date(this.filterForm.value.startDate)
    startDate.setDate(startDate.getDate())
    const endDate = new Date(this.filterForm.value.endDate)
    endDate.setDate(endDate.getDate())
    const start = new Date(startDate)?.toISOString()
    const end = new Date(endDate)?.toISOString()
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    let division
    division = this.filterForm.value.division

    division = division.map((id: number) => {
      return `filters[business_unit][id]=${id}`;
    }).join('&');
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.grievanceService.get_periodic_division_grievance_register(start, end, division, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.grievanceRegister.splice(startIndex, endIndex, ...data);
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

  get_division_grievance_register(pageEvent: PageEvent) {
    this.isLoading = true;
    let division
    division = this.filterForm.value.division
    division = division.map((id: number) => {
      return `filters[business_unit][id]=${id}`;
    }).join('&');
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.grievanceService.get_division_grievance_register(division, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.grievanceRegister.splice(startIndex, endIndex, ...data);
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
  get_periodic_grievance_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startDate = new Date(this.filterForm.value.startDate)
    startDate.setDate(startDate.getDate())
    const endDate = new Date(this.filterForm.value.endDate)
    endDate.setDate(endDate.getDate())
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    const start = new Date(startDate)?.toISOString()
    const end = new Date(endDate)?.toISOString()
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.grievanceService.get_periodic_grievance_register(start, end, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.grievanceRegister.splice(startIndex, endIndex, ...data);
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

  get_unit_specific_grievance_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.grievanceService.get_unit_specific_grievance_history(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.grievanceRegister.splice(startIndex, endIndex, ...data);
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
  get_unit_specific_division_grievance_history(pageEvent: PageEvent) {
    let division
    division = this.filterForm.value.division
    division = division.map((id: number) => {
      return `filters[business_unit][id]=${id}`;
    }).join('&');
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.grievanceService.get_unit_specific_division_grievance_history(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.grievanceRegister.splice(startIndex, endIndex, ...data);
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
  get_unit_specific_periodic_grievance_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startDate = new Date(this.filterForm.value.startDate)
    startDate.setDate(startDate.getDate())
    const endDate = new Date(this.filterForm.value.endDate)
    endDate.setDate(endDate.getDate())
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    const start = new Date(startDate)?.toISOString()
    const end = new Date(endDate)?.toISOString()
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.grievanceService.get_unit_specific_periodic_grievance_history(start, end, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.grievanceRegister.splice(startIndex, endIndex, ...data);
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
    this.dataSource = new MatTableDataSource<ehs>(this.grievanceRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // this.grievanceRegister.forEach(item => {
    //   const today = new Date();
    //   this.grievanceRegister.forEach(item => {
    //     if(item.status=='Open')
    //     {
    //       const dueDate = new Date(item.due_date);
    //       if (dueDate.getFullYear() < today.getFullYear() ||
    //         (dueDate.getFullYear() === today.getFullYear() && dueDate.getMonth() < today.getMonth()) ||
    //         (dueDate.getFullYear() === today.getFullYear() && dueDate.getMonth() === today.getMonth() && dueDate.getDate() < today.getDate())) {
    //         item.tat_status = 'Delayed';
    //       } else {
    //         item.tat_status = 'On-Time';
    //       }
    //     }

    //   });
    // });

  }

  tatButton(data: any) {
    const Delayed = "btn-danger"
    const OnTime = "btn-success"
    if (data === "On-Time") {
      return OnTime
    } else if (data === "Delayed") {
      return Delayed
    } else {
      return
    }
  }

  scoreButton(data: any) {
    const White = "btn-light";
    const Green = "btn-success";
    const Yellow = "btn-warning";
    const Red = "btn-danger";

    if (data === "Zero Tolerance") {
      return White;
    } else if (data === "Green") {
      return Green;
    } else if (data === "Yellow") {
      return Yellow;
    } else if (data === "Red") {
      return Red;
    } else {
      // If none of the above conditions match, you can return a default value
      return
    }
  }
  statusButton(data: any) {
    const draft = "btn-warning"
    const Active = "btn-success"
    const Open = "btn-light"
    const inprogress = "btn-secondary"
    if (data === "Completed") {
      return Active
    } else if (data === "Open") {
      return Open
    }
    else if (data === "In-Progress") {
      return inprogress
    }
    else if (data === "Draft") {
      return draft
    } else {
      return
    }
  }

  generateReport() {
    this.dialog.open(ReportParameterComponent, { disableClose: true }).afterClosed().subscribe(data => {
      if (data) {
        let parameter: any = []
        if (data.startDate && data.endDate && data.division) {
          const start_date = new Date(data.startDate);
          const startDate = start_date.toISOString().split('T')[0];
          const end_date = new Date(data.endDate);
          const endDate = end_date.toISOString().split('T')[0];

          parameter.push({
            company_name: data.company_name,
            type: data.type,
            division: data?.division,
            check_start_date: startDate,
            check_end_date: endDate,
            reporting_person: data?.reporting_person,
            reporting_mail: data?.reporting_email,

          })
          document.getElementById('grievance_report')?.classList.add("hide");
          document.getElementById('grievance_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.grievanceService.grievance_register_report_pdf(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('grievance_report_loader')?.classList.add("hide");
              document.getElementById('grievance_report')?.classList.remove("hide")
            })
          }
          else if (data.format === "Excel") {
            this.grievanceService.grievance_register_report_excel(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('grievance_report_loader')?.classList.add("hide");
              document.getElementById('grievance_report')?.classList.remove("hide")
            })
          }
        } else if (data.startDate && data.endDate && !data.division) {
          const start_date = new Date(data.startDate);
          const startDate = start_date.toISOString().split('T')[0];
          const end_date = new Date(data.endDate);
          const endDate = end_date.toISOString().split('T')[0];

          parameter.push({
            company_name: data.company_name,
            type: data.type,
            check_start_date: startDate,
            check_end_date: endDate,
            reporting_person: data?.reporting_person,
            reporting_mail: data?.reporting_email,
            // division: data?.division,
          })
          document.getElementById('grievance_report')?.classList.add("hide");
          document.getElementById('grievance_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.grievanceService.grievance_register_report_pdf_2(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('grievance_report_loader')?.classList.add("hide");
              document.getElementById('grievance_report')?.classList.remove("hide")
            })
          } else if (data.format === "Excel") {
            this.grievanceService.grievance_register_report_excel_2(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('grievance_report_loader')?.classList.add("hide");
              document.getElementById('grievance_report')?.classList.remove("hide")
            })
          }
        }
      }
    })
  }

  // print(data: any) {
  //   console.log("id",data)
  //   document.getElementById(data)?.classList.add("hide");
  //   document.getElementById(data + '_1')?.classList.remove("hide")
  //   this.grievanceService.grievance_individual_report(data).subscribe((response: any) => {
  //     let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
  //     const url = window.URL.createObjectURL(blob);
  //     window.open(url)
  //     document.getElementById(data)?.classList.remove("hide");
  //     document.getElementById(data + '_1')?.classList.add("hide")
  //   })
  // }
  print(data: any) {
    document.getElementById(data)?.classList.add("hide");
    document.getElementById(data + '_1')?.classList.remove("hide")
    this.grievanceService.get_grievance_case_id(data).subscribe({
      next: (result: any) => {
        const id = result.data[0].id
        this.grievanceService.grievance_individual_report(id).subscribe((response: any) => {
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
  view(data: any) {
    this.backToHistory = true
    this.grievanceService.get_grievance_reference(data.case_id).subscribe({
      next: (result: any) => {
        const subtype = result.data[0].attributes.subtype
        if (subtype === 'Grievance') {
          this.router.navigate(["/apps/grievance/view-grievance/" + result.data[0].id])
        }
        else if (subtype === 'Non-Grievance') {
          this.router.navigate(["/apps/grievance/view-non-grievance/" + result.data[0].id])
        }
        else if (subtype === 'Complaint') {
          this.router.navigate(["/apps/grievance/view-complaint/" + result.data[0].id])
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  feedback(data: any) {

    this.grievanceService.get_grievance_reference(data.case_id).subscribe({
      next: (result: any) => {

        const id = result.data[0].id

        this.dialog.open(FeedbackComponent).afterClosed().subscribe((data: any) => {


          this.grievanceService.update_grievance_feedback(data, id).subscribe({
            next: (result: any) => {
              Swal.fire({
                title: 'Feedback Updated',
                imageUrl: "assets/images/success.gif",
                imageWidth: 250,
                text: "You have successfully updated a feedback.",
                showCancelButton: false,
              })


            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              if (this.unitSpecific) {
                if (this.corporateUser) {

                  this.get_grievance_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                } else if (!this.corporateUser) {
                  this.get_unit_specific_grievance_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                }
              }
              else {
                this.get_grievance_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
              }
            }
          })

        })

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {

      }
    })



  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  modify(grvData: any) {
    if (grvData.status === "Open" || grvData.status === "Draft") {
      this.backToHistory = true
      this.grievanceService.get_grievance_reference(grvData.case_id).subscribe({
        next: (result: any) => {
          const subtype = result.data[0].attributes.subtype
          if (subtype === 'Grievance' || subtype === 'Complaint') {
            this.router.navigate(["/apps/grievance/modify-grievance/" + result.data[0].id])
          }
          else if (subtype === 'Non-Grievance') {
            this.router.navigate(["/apps/grievance/modify-non-grievance/" + result.data[0].id])
          }

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })

    } else {
      Swal.fire({
        title: 'Unable to Modify',
        imageUrl: "assets/images/progress.gif",
        imageWidth: 250,
        text: "The assignee already started working on this task. Hence, it is unable to modify the details.",
        showCancelButton: false,
      })
    }
  }

  create_non_grievance(data: any) {
    this.router.navigate(["/apps/grievance/report"], { queryParams: { type: data, subtype: 'Non-Grievance' } })
  }
  create_grievance(data: any) {
    this.router.navigate(["/apps/grievance/report-grievance"], { queryParams: { type: data, subtype: 'Grievance' } })
  }
  create_complaint(data: any) {
    this.router.navigate(["/apps/grievance/report-grievance"], { queryParams: { type: data, subtype: 'Complaint' } })
  }
  startDateChange(event: any) {
    const selectedDate = new Date(event.value);
    const startDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0,
        0
      )
    ).toISOString();

    this.filterForm.controls['startDate'].setValue(startDate);
  }
  endDateChange(event: any) {
    this.filterForm.controls['year'].reset()
    const selectedDate = new Date(event.value);
    const endDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0,
        0
      )
    ).toISOString();

    this.filterForm.controls['endDate'].setValue(endDate);
  }
  grievDiv(event: any) {
    const selectedDivisionIds = event.value.map((division: any) => division.id);
    this.filterForm.controls['division'].setValue(selectedDivisionIds);
  }
  search(pageEvent: PageEvent) {
    this.isLoading = true;
    let division = this.filterForm.value.division
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    const startDate = new Date(this.filterForm.value.startDate)
    startDate.setDate(startDate.getDate())
    const endDate = new Date(this.filterForm.value.endDate)
    endDate.setDate(endDate.getDate())
    if (this.filterForm.value.startDate && this.filterForm.value.endDate && !this.filterForm.value.division) {
      if (this.unitSpecific) {
        if (this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_periodic_grievance_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_unit_specific_periodic_grievance_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        }
      }
      else {
        const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
        this.get_periodic_grievance_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
      }
    } else if (!this.filterForm.value.startDate && !this.filterForm.value.endDate && !this.filterForm.value.division) {

      if (this.unitSpecific) {
        if (this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_grievance_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_unit_specific_grievance_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        }
      }
      else {
        const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
        this.get_grievance_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
      }
    }
    else if (!this.filterForm.value.startDate && !this.filterForm.value.endDate && this.filterForm.value.division) {
      if (this.unitSpecific) {
        if (this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_division_grievance_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_division_grievance_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        }
      }
      else {
        const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
        this.get_division_grievance_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
      }
    } else if (this.filterForm.value.startDate && this.filterForm.value.endDate && this.filterForm.value.division) {
      if (this.unitSpecific) {
        if (this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_periodic_division_grievance_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_periodic_division_grievance_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        }
      }
      else {
        const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
        this.get_periodic_division_grievance_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
      }
    }
  }
  reset() {
    // (<HTMLInputElement>document.getElementById('document_type_id')).value = 'Document Type';
    // if (this.corporateUser) {
    //   { (<HTMLInputElement>document.getElementById('document_div_id')).value = 'Division'; }
    // }
    // (<HTMLInputElement>document.getElementById('document_year_id')).value = 'Year';
    window.location.reload();



  }


  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
