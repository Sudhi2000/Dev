import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { accident_register, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { MY_FORMATS, UpdateReturnDateComponent } from './update-return-date/update-return-date.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { ReportParameterComponent } from './report-parameter/report-parameter.component';

@Component({
  selector: 'app-accident-register',
  templateUrl: './accident-register.component.html',
  styleUrls: ['./accident-register.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AccidentRegisterComponent implements OnInit {

  accidentRegister: any[] = []
  accidentData: any[] = []
  orgID: string
  subject$: ReplaySubject<accident_register[]> = new ReplaySubject<accident_register[]>(1);
  data$: Observable<accident_register[]> = this.subject$.asObservable();
  customers: accident_register[];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  unitSpecific: any
  userDivision: any
  corporateUser: any
  divisions: any[] = []
  Division = new FormControl(['']);
  public initialPage: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  };
  @Input()
  dateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Accident Date', property: 'accident_date', visible: true, isModelProperty: true },
    { name: 'Accident Time', property: 'accident_time', visible: true, isModelProperty: true },
    { name: 'Severity', property: 'severity', visible: true, isModelProperty: true },
    { name: 'Injury', property: 'injury', visible: true, isModelProperty: true },
    { name: 'Time of Work', property: 'time_of_work', visible: true, isModelProperty: true },
    { name: 'Return for Work', property: 'return_for_work', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Department', property: 'department', visible: true, isModelProperty: true },
    { name: 'Accident Category', property: 'accident_category', visible: true, isModelProperty: true },
    { name: 'Assignee', property: 'assignee', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<accident_register>;
  totalItems = 0;
  isLoading = true;
  filterForm: FormGroup
  backToHistory: Boolean = false

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private accidentService: AccidentService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

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
      this.accidentRegister = customers;
      this.dataSource.data = customers;
    });
  }

  statusButton(data: any) {
    const open = "btn-light"
    const inprogress = "btn-secondary"
    const completed = "btn-success"
    const verify = "btn-info"
    const underInvestigation = "btn-info"
    const rejected = "btn-danger"
    const draft = "btn-warning"
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
    } else if (data === "Under Investigation") {
      return underInvestigation
    } else if (data === "Draft") {
      return draft
    } else {
      return
    }
  }

  severityBtn(data: any) {
    const Major = "btn-danger"
    const Minor = "btn-secondary"
    if (data === "Major") {
      return Major
    } else if (data === "Minor") {
      return Minor
    } else {
      return
    }
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.accident_incident
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.acc_inc_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions();
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_accident_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
            else if (!this.corporateUser) {


              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
                this.divisions = result.profile.divisions
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_accident_unit_specific_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          } else {
            this.get_divisions();
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_accident_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
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
  accidentDiv(event: any) {
    const selectedDivisionIds = event.value.map((division: any) => division.id);
    this.filterForm.controls['division'].setValue(selectedDivisionIds);
  }
  get_accident_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.accidentService.get_accident_register(this.orgID, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.accidentRegister = []
        this.accidentRegister.splice(startIndex, endIndex, ...data);
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
  get_accident_unit_specific_register(pageEvent: PageEvent) {


    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.accidentService.get_accident_unit_specific_register(this.orgID, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.accidentRegister = []
        this.accidentRegister.splice(startIndex, endIndex, ...data);
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
  private prepareView() {
    this.dataSource = new MatTableDataSource<accident_register>(this.accidentRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  print(reference: any) {
    document.getElementById(reference)?.classList.add("hide");
    document.getElementById(reference + '_1')?.classList.remove("hide")
    this.accidentService.get_accident_reference(reference, this.orgID).subscribe({
      next: (result: any) => {
        const id = result.data[0].id
        this.accidentService.accident_report(id).subscribe((response: any) => {
          let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          const url = window.URL.createObjectURL(blob);
          window.open(url)
          document.getElementById(reference)?.classList.remove("hide");
          document.getElementById(reference + '_1')?.classList.add("hide")
        })
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  view(data: any) {
    this.backToHistory = true
    const reference = data.reference_number
    this.router.navigate(["apps/accident-incident/accident-view/" + reference])
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  modify(data: any) {
    this.backToHistory = true
    const reference = data.reference_number
    this.router.navigate(["apps/accident-incident/accident-modify/" + reference])
  }

  updateDate(accData: any) {

    this.dialog.open(UpdateReturnDateComponent).afterClosed().subscribe(data => {
      if (data) {
        const report_date = new Date(accData.accident_date).getTime()
        const return_date = new Date(data.return_date).getTime()

        let timeDiff = Math.abs(return_date - report_date);
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        timeDiff -= hours * 1000 * 60 * 60;
        const minutes = Math.floor(timeDiff / (1000 * 60));

        const returnHours = hours + ' Hours'
        const reference = accData.reference_number

        this.accidentService.get_accident_reference(reference, this.orgID).subscribe({
          next: (result: any) => {
            this.accidentService.update_return_date(result.data[0].id, data.return_date, returnHours).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                const statusText = "Return Date Updated Succesfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.ngOnInit()
              }
            })
          },
          error: (err: any) => { },
          complete: () => { }
        })




        // this.affectedPeopleList.push(data)
        // if (this.affectedPeopleList.length > 0) {
        //   this.Form.controls['affected_people'].setErrors(null);
        // } else {
        //   this.Form.controls['affected_people'].setValidators(Validators.required);
        // }
      }
    })

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

          this.get_periodic_accident_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {
          // let divisions: any[] = []
          // // result.profile.divisions.forEach((elem: any) => {
          // //   divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
          // // })
          // let results = divisions.join('&');
          // this.userDivision = results

          this.get_unit_specific_periodic_accident_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
        }
      }
      else {
        this.get_periodic_accident_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
      }
    } else if (!this.filterForm.value.startDate && !this.filterForm.value.endDate && !this.filterForm.value.division) {

      if (this.unitSpecific) {
        if (this.corporateUser) {

          this.get_accident_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {

          this.get_unit_specific_accident_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
        }
      }
      else {
        this.get_accident_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
      }
    }
    else if (!this.filterForm.value.startDate && !this.filterForm.value.endDate && this.filterForm.value.division) {

      if (this.unitSpecific) {
        if (this.corporateUser) {
          this.get_division_accident_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {
          // let divisions: any[] = []
          // // result.profile.divisions.forEach((elem: any) => {
          // //   divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
          // // })
          // let results = divisions.join('&');
          // this.userDivision = results


          this.get_division_accident_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
        }
      }
      else {
        this.get_division_accident_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
      }
    } else if (this.filterForm.value.startDate && this.filterForm.value.endDate && this.filterForm.value.division) {

      if (this.unitSpecific) {
        if (this.corporateUser) {
          this.get_periodic_division_accident_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {
          // let divisions: any[] = []
          // // result.profile.divisions.forEach((elem: any) => {
          // //   divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
          // // })
          // let results = divisions.join('&');
          // this.userDivision = results

          this.get_periodic_division_accident_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
        }
      }
      else {
        this.get_periodic_division_accident_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
      }
    }

  }
  get_periodic_accident_register(pageEvent: PageEvent) {
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
    this.accidentService.get_periodic_accident_register(start, end, this.orgID, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.accidentRegister = []
        this.accidentRegister.splice(startIndex, endIndex, ...data);
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
  get_unit_specific_accident_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.accidentService.get_unit_specific_accident_history(this.orgID, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.accidentRegister = []
        this.accidentRegister.splice(startIndex, endIndex, ...data);
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
  get_unit_specific_periodic_accident_history(pageEvent: PageEvent) {
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
    this.accidentService.get_unit_specific_periodic_accident_history(start, end, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {

        const data = result.data.map((elem: any) => elem.attributes);
        this.accidentRegister = []
        this.accidentRegister.splice(startIndex, endIndex, ...data);
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
  get_division_accident_register(pageEvent: PageEvent) {

    this.isLoading = true;
    let division
    division = this.filterForm.value.division
    division = division.map((id: number) => {
      return `filters[business_unit][id]=${id}`;
    }).join('&');

    if (!division) {
      division = this.userDivision
    }



    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.accidentService.get_division_accident_register(division, startIndex, pageEvent.pageSize).subscribe({

      next: (result: any) => {



        const data = result.data.map((elem: any) => elem.attributes);
        this.accidentRegister = []
        this.accidentRegister.splice(startIndex, endIndex, ...data);
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
  get_periodic_division_accident_register(pageEvent: PageEvent) {
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
    if (!division) {
      division = this.userDivision
    }
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.accidentService.get_periodic_division_accident_register(start, end, division, this.orgID, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.accidentRegister = []
        this.accidentRegister.splice(startIndex, endIndex, ...data);
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
  get_accident_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.accidentService.get_accident_register(this.orgID, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.accidentRegister = []
        this.accidentRegister.splice(startIndex, endIndex, ...data);
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
  reset() {
    // (<HTMLInputElement>document.getElementById('document_type_id')).value = 'Document Type';
    // if (this.corporateUser) {
    //   { (<HTMLInputElement>document.getElementById('document_div_id')).value = 'Division'; }
    // }
    // (<HTMLInputElement>document.getElementById('document_year_id')).value = 'Year';
    window.location.reload();



  }

  generateReport() {
    this.dialog.open(ReportParameterComponent).afterClosed().subscribe(data => {
      let parameter: any = []
      if (data.startDate && data.endDate && !data.year && !data.month && !data.business_unit) {
        if (data.business_unit_address !== null) {

          parameter.push({
            start_date: data?.startDate,
            end_date: data?.endDate,
            defualt_date: data?.defualt_date,
            address: data?.business_unit_address
          })

        } else {
          parameter.push({
            start_date: data?.startDate,
            end_date: data?.endDate,
            defualt_date: data?.defualt_date,
            // address: data?.business_unit_address
          })
        }

        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.accidentService.accident_register_report(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.accidentService.accident_register_report_excel(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      } else if (data.startDate && data.endDate && !data.year && !data.month && data.business_unit) {


        if (data.business_unit_address !== null) {

          parameter.push({
            start_date: data?.startDate,
            end_date: data?.endDate,
            division: data?.business_unit,
            defualt_date: data?.defualt_date,
            address: data?.business_unit_address
          })

        } else {
          parameter.push({
            start_date: data?.startDate,
            end_date: data?.endDate,
            division: data?.business_unit,
            defualt_date: data?.defualt_date,
            // address: data?.business_unit_address
          })
        }
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.accidentService.accident_register_report_2(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.accidentService.accident_register_report_excel_2(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      } else if (!data.startDate && !data.endDate && data.year && !data.month && !data.business_unit) {

        if (data.business_unit_address !== null) {

          parameter.push({
            year: data?.year || null,
            defualt_date: data?.defualt_date,
            address: data?.business_unit_address || null
          })

        } else {
          parameter.push({
            year: data?.year || null,
            defualt_date: data?.defualt_date,
            // address: data?.business_unit_address || null
          })
        }
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.accidentService.accident_register_report_3(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.accidentService.accident_register_report_excel_3(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      } else if (!data.startDate && !data.endDate && data.year && data.month && !data.business_unit) {

        if (data.business_unit_address !== null) {

          parameter.push({
            year: data?.year || null,
            month: data?.month || null,
            defualt_date: data?.defualt_date,
            address: data?.business_unit_address
          })

        } else {
          parameter.push({
            year: data?.year || null,
            month: data?.month || null,
            defualt_date: data?.defualt_date,
            // address: data?.business_unit_address
          })
        }
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.accidentService.accident_register_report_4(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.accidentService.accident_register_report_excel_4(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      } else if (!data.startDate && !data.endDate && data.year && !data.month && data.business_unit) {

        if (data.business_unit_address !== null) {

          parameter.push({
            year: data?.year || null,
            division: data?.business_unit || null,
            address: data?.business_unit_address,
            defualt_date: data?.defualt_date
          })

        } else {
          parameter.push({
            year: data?.year || null,
            division: data?.business_unit || null,
            // address: data?.business_unit_address,
            defualt_date: data?.defualt_date
          })
        }
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.accidentService.accident_register_report_5(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.accidentService.accident_register_report_excel_5(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      } else if (!data.startDate && !data.endDate && data.year && data.month && data.business_unit) {

        if (data.business_unit_address !== null) {

          parameter.push({
            year: data?.year || null,
            month: data?.month || null,
            division: data?.business_unit || null,
            address: data?.business_unit_address,
            defualt_date: data?.defualt_date
          })

        } else {
          parameter.push({
            year: data?.year || null,
            month: data?.month || null,
            division: data?.business_unit || null,
            // address: data?.business_unit_address,
            defualt_date: data?.defualt_date
          })
        }
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.accidentService.accident_register_report_6(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.accidentService.accident_register_report_excel_6(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        }
      } else if (!data.startDate && !data.endDate && !data.year && data.month && data.business_unit) {

        if (data.business_unit_address !== null) {

          parameter.push({
            month: data?.month || null,
            division: data?.business_unit || null,
            address: data?.business_unit_address,
            defualt_date: data?.defualt_date
          })

        } else {
          parameter.push({
            month: data?.month || null,
            division: data?.business_unit || null,
            // address: data?.business_unit_address,
            defualt_date: data?.defualt_date
          })
        }
        document.getElementById('accident_report')?.classList.add("hide");
        document.getElementById('accident_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.accidentService.accident_register_report_7(parameter[0]).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('accident_report_loader')?.classList.add("hide");
            document.getElementById('accident_report')?.classList.remove("hide")
          })
        } else if (data.format === "Excel") {
          this.accidentService.accident_register_report_excel_7(parameter[0]).subscribe((response: any) => {
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
}
