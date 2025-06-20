import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { RagService } from 'src/app/services/rag.api.service';
import { ListColumn, maternity } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';
import { MaternityRegisterService } from 'src/app/services/maternity-register.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportParameterComponent } from './report-parameter/report-parameter.component';
import { EmailComponent } from '../../email/email.component'
import { SchedulerService } from 'src/app/services/scheduler.api.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-maternity-register',
  templateUrl: './maternity-register.component.html',
  styleUrls: ['./maternity-register.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class MaternityRegisterComponent implements OnInit {
  maternityRegister: any[] = []
  orgID: string
  totalItems = 0;
  corporateUser: any
  subject$: ReplaySubject<maternity[]> = new ReplaySubject<maternity[]>(1);
  data$: Observable<maternity[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: maternity[];
  backToHistory: Boolean = false
  @Input()
  columns: ListColumn[] = [

    { name: 'Employee ID', property: 'employee_id', visible: true, isModelProperty: true },
    { name: 'Employee Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Appliction Id', property: 'application_id', visible: true, isModelProperty: true },
    { name: 'Application Date', property: 'application_date', visible: true, isModelProperty: true },
    { name: 'Leave Status', property: 'leave_status', visible: true, isModelProperty: true },
    { name: 'Rejoining Date', property: 'rejoining_date', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },

    // { name: 'Disease', property: 'disease', visible: true, isModelProperty: true },
    // { name: 'Check Out', property: 'check_out', visible: true, isModelProperty: true },

    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  isLoading = true;
  dataSource: MatTableDataSource<maternity>;
  unitSpecific: any
  userDivision: any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  divisions: any[] = []
  Division = new FormControl(['']);
  selectedDivisionsFilter: string = '';
  initialUserDivision: any
  filterForm: FormGroup
  @Input()
  dateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });

  constructor(
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private scheduler: SchedulerService,
    private maternityService: MaternityRegisterService,
    private clinicalService: ClinicalSuiteService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.configuration()
    this.filterForm = this.formBuilder.group({
      division: [''],
      startDate: [''],
      endDate: [''],
      prevStartDate: [''],
      prevEndDate: [''],
      year: [],
    })
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((customers) => {
      this.maternityRegister = customers;
      this.dataSource.data = customers;
    });
  }


  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.occupational_health
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
        const status = result.maternity_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.divisions = result.profile.divisions
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_maternityRecord({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push(elem.division_name)
              })
              this.divisions = result.profile.divisions
              let results = divisions.join(',');
              this.userDivision = results
              this.initialUserDivision = results;
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_unit_specific_maternityRecord({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            this.get_divisions()
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_maternityRecord({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }
        }


      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
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
  statusButton(data: any) {
    const Resigned = "btn-warning"
    const Active = "btn-success"
    const Open = "btn-light"
    const draft = "btn-warning"
    if (data === "Completed") {
      return Active
    } else if (data === "Pending") {
      return Open
    } else if (data === "Draft") {
      return draft
    } else {
      return
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<maternity>(this.maternityRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  view(data: any) {
    this.backToHistory = true
    const reference = data.id
    this.router.navigate(["apps/occupational-health/medical-records/view-benefit/" + reference])
    // this.clinicalService.get_clinical_reference(data.patient_id).subscribe({
    //   next: (result: any) => {
    //     this.router.navigate(["/apps/occupational-health/medical-records/view/" + result.data[0].id])
    //   },
    //   error: (err: any) => {
    //     this.router.navigate(["/error/internal"])
    //   },
    //   complete: () => { }
    // })

  }
  modify(data: any) {
    this.backToHistory = true
    const reference = data.id
    this.router.navigate(["apps/occupational-health/medical-records/update-benefit/" + reference])
    // this.clinicalService.get_clinical_reference(data.patient_id).subscribe({
    //   next: (result: any) => {
    //     this.router.navigate(["/apps/occupational-health/medical-records/modify/" + result.data[0].id])
    //   },
    //   error: (err: any) => {
    //     this.router.navigate(["/error/internal"])
    //   },
    //   complete: () => { }
    // })


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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  create() {
    this.router.navigate(["/apps/occupational-health/medical-records/create-benefit"])

  }

  generateReport() {
    this.dialog.open(ReportParameterComponent, { width: "740px", disableClose: true }).afterClosed().subscribe(data => {
      if (data) {
        let parameter: any = []
        if (data.startDate && data.endDate && data.division) {

          const start_date = new Date(data.startDate);
          const startDate = start_date.toISOString().split('T')[0]; // Output: "2025-01-01"

          const end_date = new Date(data.endDate);
          const endDate = end_date.toISOString().split('T')[0]; // Output: "2025-01-01"

          parameter.push({
            start_date: startDate,
            end_date: endDate,
            division: data?.division,
            company_name: data?.company_name,
            reporting_person: data?.reporting_person,
            reporting_email: data?.reporting_email
          })

          document.getElementById('maternity_report')?.classList.add("hide");
          document.getElementById('maternity_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.maternityService.maternity_register_report(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('maternity_report_loader')?.classList.add("hide");
              document.getElementById('maternity_report')?.classList.remove("hide")
            })
          }
          else if (data.format === "Excel") {
            this.maternityService.maternity_register_report_excel(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('maternity_report_loader')?.classList.add("hide");
              document.getElementById('maternity_report')?.classList.remove("hide")
            })
          }
        } else if (data.startDate && data.endDate && !data.division) {

          const start_date = new Date(data.startDate);
          const startDate = start_date.toISOString().split('T')[0]; // Output: "2025-01-01"

          const end_date = new Date(data.endDate);
          const endDate = end_date.toISOString().split('T')[0]; // Output: "2025-01-01"

          parameter.push({
            start_date: startDate,
            end_date: endDate,
            // division: data?.division,
            company_name: data?.company_name,
            reporting_person: data?.reporting_person,
            reporting_email: data?.reporting_email
          })

          document.getElementById('maternity_report')?.classList.add("hide");
          document.getElementById('maternity_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.maternityService.maternity_register_report_2(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('maternity_report_loader')?.classList.add("hide");
              document.getElementById('maternity_report')?.classList.remove("hide")
            })
          } else if (data.format === "Excel") {
            this.maternityService.maternity_register_report_excel_2(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('maternity_report_loader')?.classList.add("hide");
              document.getElementById('maternity_report')?.classList.remove("hide")
            })
          }
        }
      }
    })
  }

  print(data: any) {
    document.getElementById(data)?.classList.add("hide");
    document.getElementById(data + '_1')?.classList.remove("hide")
    this.maternityService.maternity_report(data).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      window.open(url)
      document.getElementById(data)?.classList.remove("hide");
      document.getElementById(data + '_1')?.classList.add("hide")
    })
  }


  email(data: any) {
    this.dialog.open(EmailComponent, { width: "50%" }).afterClosed().subscribe((emailData: any) => {
      this.scheduler.create_occupational_health_schedule(data.id, emailData.to_email, emailData.cc_email).subscribe({
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
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
  occDiv(event: any) {
    this.filterForm.controls['division'].setValue(event.value);

    if (event.value.length === 0) {
      this.userDivision = this.initialUserDivision; // fallback to initial
    } else {
      const selectedDivisions = event.value.map((div: any) => div.division_name);
      this.userDivision = selectedDivisions.join(',');
    }
  }


  // search() {

  //   if (this.userDivision && this.userDivision.trim() !== '') {
  //     this.get_unit_specific_maternityRecord({ pageIndex: 0, pageSize: this.pageSize, length: 0 });
  //   } else {
  //     this.get_maternityRecord({ pageIndex: 0, pageSize: this.pageSize, length: 0 });
  //   }
  // }

  search() {
    this.isLoading = true

    let division = this.filterForm.value.division
    const startDate = this.filterForm.value.startDate
    const endDate = this.filterForm.value.endDate
    const pageEvent = { pageIndex: 0, pageSize: this.pageSize, length: 0 };

    if (startDate && endDate && division) {

      this.get_periodic_division_maternity_record(pageEvent);

    } else if (startDate && endDate && !division) {

      if (this.userDivision) {

        this.get_unitspecific_division_maternity_record(pageEvent)

      }
      else {

        this.get_periodic_maternity_record(pageEvent);

      }

    } else if (!startDate && !endDate && (this.userDivision && this.userDivision.trim() !== '')) {

      this.get_unit_specific_maternityRecord(pageEvent);

    } else {

      this.get_maternityRecord(pageEvent);

    }
  }

  get_maternityRecord(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.maternityService.get_maternityRecord(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem);
        this.maternityRegister = data;
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

  get_unit_specific_maternityRecord(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.maternityService.get_unit_specific_maternityRecord(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem);
        this.maternityRegister = data;
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

  get_periodic_division_maternity_record(pageEvent: PageEvent) {
    this.isLoading = true;
    let division = this.filterForm.value.division

    const startDate = this.filterForm.value.startDate?.split('T')[0];
    const endDate = this.filterForm.value.endDate?.split('T')[0];

    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex))

    this.maternityService.get_periodic_division_maternityRecord(startDate, endDate, division, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {

        const data = result.data.map((elem: any) => elem);
        this.maternityRegister = data;
        this.totalItems = result.meta.pagination.total;

        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        });
      },
      error: () => this.router.navigate(['/error/internal']),
      complete: () => {
        this.isLoading = false;
        this.prepareView();
      }
    });
  }
  get_unitspecific_division_maternity_record(pageEvent: PageEvent) {
    this.isLoading = true;

    const startDate = this.filterForm.value.startDate?.split('T')[0];
    const endDate = this.filterForm.value.endDate?.split('T')[0];

    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex))

    this.maternityService.get_unitspecific_division_maternityRecord(startDate, endDate, this.userDivision, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {

        const data = result.data.map((elem: any) => elem);
        this.maternityRegister = data;
        this.totalItems = result.meta.pagination.total;

        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        });
      },
      error: () => this.router.navigate(['/error/internal']),
      complete: () => {
        this.isLoading = false;
        this.prepareView();
      }
    });
  }
  get_periodic_maternity_record(pageEvent: PageEvent) {
    this.isLoading = true;

    const startDate = this.filterForm.value.startDate?.split('T')[0];
    const endDate = this.filterForm.value.endDate?.split('T')[0];
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));

    this.maternityService.get_periodic_maternityRecord(startDate, endDate, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem);
        this.maternityRegister = data;
        this.totalItems = result.meta.pagination.total;

        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        });
      },
      error: () => this.router.navigate(['/error/internal']),
      complete: () => {
        this.isLoading = false;
        this.prepareView();
      }
    });
  }



  reset() {
    window.location.reload();
  }
  onPageChange(event: PageEvent): void {
    if (
      this.unitSpecific &&
      !this.corporateUser &&
      this.userDivision &&
      this.userDivision.trim() !== ''
    ) {
      this.get_unit_specific_maternityRecord(event);
    } else if (this.corporateUser &&
      this.userDivision &&
      this.userDivision.trim() !== '') {
      this.get_unit_specific_maternityRecord(event);

    }
    else {
      this.get_maternityRecord(event);
    }
  }



}
