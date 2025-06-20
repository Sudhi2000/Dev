import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { create } from 'domain';
import { ReplaySubject, Observable, filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { MaterialityService } from 'src/app/services/materiality-assessment.api.service';
import { ListColumn, survey } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  dataSource: MatTableDataSource<survey>;
  orgID: string
  isLoading = true;
  @Input()
  surveyRegister: any[] = []
  totalItems = 0;
  pageSize = 10;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  columns: ListColumn[] = [

    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'ID', property: 'id', visible: false, isModelProperty: true },
    { name: 'Headline', property: 'headliine', visible: true, isModelProperty: true },
    { name: 'Start Date', property: 'start_date', visible: true, isModelProperty: true },
    { name: 'End Date', property: 'end_date', visible: true, isModelProperty: true },
    { name: 'Total Topics', property: 'total_topics', visible: true, isModelProperty: true },
    { name: 'Total Stakeholders', property: 'total_stakeholders', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  subject$: ReplaySubject<survey[]> = new ReplaySubject<survey[]>(1);
  data$: Observable<survey[]> = this.subject$.asObservable();
  constructor(public dialog: MatDialog,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private materialityService: MaterialityService,
  ) { }
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
      this.surveyRegister = customers;
      this.dataSource.data = customers;
    });
  
  }
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.materiality
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
        const status = result.materiality_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_survey_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
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
  create() {
    this.router.navigate(['/apps/materiality-assessment/survey'])
    // this.dialog.open(CreateTopicComponent).afterClosed().subscribe(data => {
    // })

  }
  get_survey_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.surveyRegister = []
    this.materialityService.get_survey_history(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        console.log(result)
        const data = result.data.map((elem: any) => elem.attributes);
        this.surveyRegister.splice(startIndex, endIndex, ...data);
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        });
        console.log("Register ::",this.surveyRegister)
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
    this.dataSource = new MatTableDataSource<survey>(this.surveyRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
  statusButton(data: any) {
    
    const draft = "btn-light"
    const scheduled = "btn-warning"
    const inProgress = "btn-primary"
    const completed = "btn-success"
    const open = "btn-secondary"
    const rejected = "btn-danger"
    const hold = "btn-info"
    const changeReq = "btn-dark"

    if (data === "Draft") {
      return draft
    } else if (data === "Scheduled") {
      return scheduled
    } else if (data === "In-Progress") {
      return inProgress
    } else if (data === "Completed") {
      return completed
    } else if (data === "Open") {
      return open
    } else if (data === "Rejected") {
      return rejected
    } else if (data === "Hold") {
      return hold
    } else if (data === "Change Requested") {
      return changeReq
    } else {
      return
    }


  }
  view(data:any){
    this.router.navigate(['/apps/materiality-assessment/view/' + data.reference_id])
  }
  modify(data:any){
    this.router.navigate(['/apps/materiality-assessment/modify/' + data.reference_id])
    
  }

  action(data:any){
    this.router.navigate(['/apps/materiality-assessment/action/' + data.reference_id])
  }
}
