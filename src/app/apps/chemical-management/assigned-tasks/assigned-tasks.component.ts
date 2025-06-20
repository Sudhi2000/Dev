import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReplaySubject, Observable, filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { chemical_request, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assigned-tasks',
  templateUrl: './assigned-tasks.component.html',
  styleUrls: ['./assigned-tasks.component.scss']
})
export class AssignedTasksComponent implements OnInit {

  chemicalRequest: any[] = []
  orgID: any
  userID: number
  subject$: ReplaySubject<chemical_request[]> = new ReplaySubject<chemical_request[]>(1);
  data$: Observable<chemical_request[]> = this.subject$.asObservable();
  customers: chemical_request[];
  serachReference: any = ''
  unitSpecific: any
  userDivision: any
  corporateUser: any
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Request Date', property: 'request_date', visible: true, isModelProperty: true },
    { name: 'Commercial Name', property: 'commercial_name', visible: true, isModelProperty: true },
    { name: 'Substance Name', property: 'substance_name', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Requested Customer', property: 'requested_customer', visible: true, isModelProperty: true },
    { name: 'Requested Merchandiser', property: 'requested_merchandiser', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<chemical_request>;
  isLoading = true;
  totalItems = 0;
  backToHistory: Boolean = false
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private chemicalService: ChemicalService) { }

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
      this.chemicalRequest = customers;
      this.dataSource.data = customers;
    });
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.chemical
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
        const status = result.chem_action
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.userID = Number(result.profile.id)
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_chemical_request_tasks({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_chemical_request_unit_specific_tasks({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_chemical_request_tasks({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_chemical_request_tasks(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.chemicalService.get_chemical_request_tasks(this.userID, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.chemicalRequest.splice(startIndex, endIndex, ...data);
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

  get_chemical_request_unit_specific_tasks(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.chemicalService.get_chemical_request_unit_specific_tasks(this.userID, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.chemicalRequest.splice(startIndex, endIndex, ...data);
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


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<chemical_request>(this.chemicalRequest);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  statusButton(data: any) {
    const open = "btn-primary"
    const Reviewed = "btn-info"
    const Approved = "btn-success"
    const Rejected = "btn-danger"
    if (data === "Open") {
      return open
    } else if (data === "Reviewed") {
      return Reviewed
    } else if (data === "Approved") {
      return Approved
    } else if (data === "Rejected") {
      return Rejected
    } else {
      return
    }
  }

  action(data: any) {
    if (data.status === "Open") {
      this.backToHistory = true
      this.chemicalService.get_chemical_details_refe(data.reference_number).subscribe({
        next: (result: any) => {
          this.router.navigate(["/apps/chemical-management/review/" + result.data[0].id])
        },
        error: (err: any) => { },
        complete: () => { }
      })
    } else if (data.status === "Reviewed") {
      this.backToHistory = true
      this.chemicalService.get_chemical_details_refe(data.reference_number).subscribe({
        next: (result: any) => {
          this.router.navigate(["/apps/chemical-management/approve/" + result.data[0].id])
        },
        error: (err: any) => { },
        complete: () => { }
      })
    }
  }

  view(data: any) {
    this.backToHistory = true
    this.chemicalService.get_chemical_details_refe(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/chemical-management/view-request/" + result.data[0].id])
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  generate() {
    this.isLoading = true;
    if (!this.corporateUser) {
      this.chemicalService.get_chemical_request_unit_specific_task_search(this.serachReference, this.userID, this.userDivision).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.chemicalRequest = data;

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
      this.chemicalService.get_chemical_request_task_search(this.serachReference, this.userID).subscribe({
        next: (result: any) => {

          const data = result.data.map((elem: any) => elem.attributes);
          this.chemicalRequest = data;

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
    this.ngOnInit()
    this.serachReference = ''



  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
