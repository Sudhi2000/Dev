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

ApexGrid.register();

@Component({
  selector: 'app-assigned-tasks',
  templateUrl: './assigned-tasks.component.html',
  styleUrls: ['./assigned-tasks.component.scss']
})
export class AssignedTasksComponent implements OnInit {

  grievanceRegister: any[] = []
  orgID: string
  backToHistory: Boolean = false
  corporateUser: any
  unitSpecific: any
  userDivision: any
  subject$: ReplaySubject<ehs[]> = new ReplaySubject<ehs[]>(1);
  data$: Observable<ehs[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: ehs[];
  currentRate = 8;
  @Input()
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
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 20;
  userID: number
  isLoading = true;
  dataSource: MatTableDataSource<ehs>;
  totalItems = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private grievanceService: GrievanceService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,) { }

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
          this.userID = Number(result.profile.id)
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_grievance_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
            else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');

              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_unit_specific_grievance_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_grievance_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_grievance_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.grievanceService.get_assigned_tasks(this.userID, startIndex, pageEvent.pageSize).subscribe({
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
    this.grievanceService.get_unit_specific_assigned_tasks(this.userID, startIndex, pageEvent.pageSize, this.userDivision).subscribe({
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
  }

  statusButton(data: any) {
    const inprogress = "btn-secondary"
    const Open = "btn-light"
    if (data === "In-Progress") {
      return inprogress
    } else if (data === "Open") {
      return Open
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  action(grvData: any) {
    this.backToHistory = true
    this.grievanceService.get_grievance_reference(grvData.case_id).subscribe({
      next: (result: any) => {
        const subtype = result.data[0].attributes.subtype
        if (subtype === 'Grievance') {
          this.router.navigate(["/apps/grievance/grievance-action/" + result.data[0].id])
        }
        else if (subtype === 'Non-Grievance') {
          this.router.navigate(["/apps/grievance/non-grievance-action/" + result.data[0].id])
        }
        else if (subtype === 'Complaint') {
          this.router.navigate(["/apps/grievance/complaint-action/" + result.data[0].id])
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }


}
