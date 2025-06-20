import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReplaySubject, Observable, filter } from 'rxjs';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { accident_corrective_actions_register, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-corrective-action-register',
  templateUrl: './corrective-action-register.component.html',
  styleUrls: ['./corrective-action-register.component.scss']
})
export class CorrectiveActionRegisterComponent implements OnInit {

  correctiveActions: any[] = []
  orgID: string
  userID: number
  subject$: ReplaySubject<accident_corrective_actions_register[]> = new ReplaySubject<accident_corrective_actions_register[]>(1);
  data$: Observable<accident_corrective_actions_register[]> = this.subject$.asObservable();
  customers: accident_corrective_actions_register[];
  totalItems = 0;
  isLoading = true;
  backToHistory: Boolean = false

  @Input()
  columns: ListColumn[] = [
    { name: 'id', property: 'id', visible: false, isModelProperty: true },
    { name: 'reference', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'accident', property: 'accident', visible: true, isModelProperty: true },
    { name: 'Action', property: 'action', visible: true, isModelProperty: true },
    { name: 'Due Date', property: 'due_date', visible: true, isModelProperty: true },
    { name: 'Completed Date', property: 'completed_date', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<accident_corrective_actions_register>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private accidentService: AccidentService,
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
      this.correctiveActions = customers;
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
    } else {
      return
    }
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
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
        this.userID = result.id
        const status = result.acc_inc_action_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_corrective_actions({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
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
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.accidentService.get_corrective_action_register(this.userID, startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        console.log(result);

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


  private prepareView() {
    this.dataSource = new MatTableDataSource<accident_corrective_actions_register>(this.correctiveActions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);

    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);

  }

  print(data: any) {
    document.getElementById(data)?.classList.add("hide");
    document.getElementById(data + '_1')?.classList.remove("hide")
  }

  action(action: any) {

    this.backToHistory = true
    this.router.navigate(["apps/accident-incident/corrective-actions/" + action.id])
  }
  view(action: any) {

    this.backToHistory = true
    this.router.navigate(["apps/accident-incident/view-corrective-actions/" + action.id])
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
