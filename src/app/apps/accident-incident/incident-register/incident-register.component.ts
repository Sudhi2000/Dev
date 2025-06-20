import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { IncidentService } from 'src/app/services/incident.api.service';
import { incident, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { MY_FORMATS } from '../accident-action/accident-action.component';

@Component({
  selector: 'app-incident-register',
  templateUrl: './incident-register.component.html',
  styleUrls: ['./incident-register.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class IncidentRegisterComponent implements OnInit {

  incidentRegister: any[] = []
  orgID: string
  subject$: ReplaySubject<incident[]> = new ReplaySubject<incident[]>(1);
  data$: Observable<incident[]> = this.subject$.asObservable();
  customers: incident[];
  @Input()
  dateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Incident Date', property: 'incident_date', visible: true, isModelProperty: true },
    { name: 'Incident Time', property: 'incident_time', visible: true, isModelProperty: true },
    { name: 'Severity', property: 'severity', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Location', property: 'location', visible: true, isModelProperty: true },
    { name: 'Circumstances', property: 'circumstances', visible: true, isModelProperty: true },
    { name: 'Assignee', property: 'assignee', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<incident>;
  totalItems = 0;
  isLoading = true;
  unitSpecific: any
  userDivision: any
  corporateUser: any
  divisions: any[] = []
  backToHistory: Boolean = false
  Division = new FormControl(['']);
  public initialPage: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  };
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterForm: FormGroup

  constructor(private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private incidentService: IncidentService) { }

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
    ).subscribe((incident) => {
      this.incidentRegister = incident;
      this.dataSource.data = incident;
    });
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
          if (this.unitSpecific === true) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions();
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_incident_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
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
              this.get_incident_unit_specific_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          } else {
            this.get_divisions();
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_incident_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
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
  get_incident_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.incidentService.get_incidents(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.incidentRegister.splice(startIndex, endIndex, ...data);
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
  get_incident_unit_specific_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.incidentService.get_unit_specific_incidents(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.incidentRegister.splice(startIndex, endIndex, ...data);
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

  private prepareView() {
    this.dataSource = new MatTableDataSource<incident>(this.incidentRegister);
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
    this.incidentService.get_incident_reference(reference, this.orgID).subscribe({
      next: (result: any) => {
        const id = result.data[0].id
        this.incidentService.incident_report(id).subscribe((response: any) => {
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
    this.router.navigate(["apps/accident-incident/incident-view/" + reference])

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  modify(data: any) {
    this.backToHistory = true
    const reference = data.reference_number
    this.router.navigate(["apps/accident-incident/incident-modify/" + reference])

  }

  severityBtn(data: any) {
    const low = "btn-success"
    const medium = "btn-primary"
    const high = "btn-yellow"
    const veryHigh = "btn-warning"
    const extreme = "btn-danger"
    if (data === "Low") {
      return low
    } else if (data === "Medium") {
      return medium
    } else if (data === "High") {
      return high
    } else if (data === "Very High") {
      return veryHigh
    } else if (data === "Extreme") {
      return extreme
    } else {
      return
    }

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
  incidentDiv(event: any) {
    const selectedDivisionIds = event.value.map((division: any) => division.id);
    this.filterForm.controls['division'].setValue(selectedDivisionIds);
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
  reset() {
    // (<HTMLInputElement>document.getElementById('document_type_id')).value = 'Document Type';
    // if (this.corporateUser) {
    //   { (<HTMLInputElement>document.getElementById('document_div_id')).value = 'Division'; }
    // }
    // (<HTMLInputElement>document.getElementById('document_year_id')).value = 'Year';
    window.location.reload();



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
          this.get_periodic_incident_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_unit_specific_periodic_incident_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        }
      }
      else {

        const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
        this.get_periodic_incident_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
      }
    } else if (!this.filterForm.value.startDate && !this.filterForm.value.endDate && !this.filterForm.value.division) {
      if (this.unitSpecific) {
        if (this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_incident_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_unit_specific_incident_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        }
      }
      else {
        const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
        this.get_incident_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
      }
    }
    else if (!this.filterForm.value.startDate && !this.filterForm.value.endDate && this.filterForm.value.division) {
      if (this.unitSpecific) {
        if (this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_division_incident_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_division_incident_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        }
      }
      else {
        const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
        this.get_division_incident_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
      }
    } else if (this.filterForm.value.startDate && this.filterForm.value.endDate && this.filterForm.value.division) {

      if (this.unitSpecific) {
        if (this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_periodic_division_incident_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        } else if (!this.corporateUser) {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_periodic_division_incident_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        }
      }
      else {
        const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
        this.get_periodic_division_incident_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
      }
    }

  }
  get_periodic_incident_register(pageEvent: PageEvent) {
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
    this.incidentService.get_periodic_incident_register(start, end, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.incidentRegister.splice(startIndex, endIndex, ...data);
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
  get_unit_specific_incident_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.incidentService.get_unit_specific_incident_history(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.incidentRegister.splice(startIndex, endIndex, ...data);
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
  get_unit_specific_periodic_incident_history(pageEvent: PageEvent) {
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
    this.incidentService.get_unit_specific_periodic_incident_history(start, end, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.incidentRegister.splice(startIndex, endIndex, ...data);
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
  get_division_incident_register(pageEvent: PageEvent) {
    this.isLoading = true;
    let division
    division = this.filterForm.value.division
    division = division.map((id: number) => {
      return `filters[business_unit][id]=${id}`;
    }).join('&');
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.incidentService.get_division_incident_register(division, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.incidentRegister.splice(startIndex, endIndex, ...data);
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
  get_periodic_division_incident_register(pageEvent: PageEvent) {
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
    this.incidentService.get_periodic_division_incident_register(start, end, division, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.incidentRegister.splice(startIndex, endIndex, ...data);
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
  get_incident_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.incidentService.get_incidents(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.incidentRegister.splice(startIndex, endIndex, ...data);
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
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
