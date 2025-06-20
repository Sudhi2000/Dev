import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { engagement, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EngagementService } from 'src/app/services/engagement.api.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  
  engagementRegister: any[] = []
  orgID: string
  
  subject$: ReplaySubject<engagement[]> = new ReplaySubject<engagement[]>(1);
  data$: Observable<engagement[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: engagement[];
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true }, 
    { name: 'Engagement Title', property: 'event_title', visible: true, isModelProperty: true },
    { name: 'Event Start Date', property: 'event_start_date', visible: true, isModelProperty: true },
    { name: 'Event End Date', property: 'event_end_date', visible: true, isModelProperty: true },
    { name: 'Completed Date', property: 'completed_date', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
    
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<engagement>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private engagementService: EngagementService,
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
      this.engagementRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        console.log(result)
        const status = result.data.attributes.modules.engagement
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
        console.log(result)
        const status = result.engagement_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_engagement_history()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  
  statusButton(data: any) {
    const Scheduled = "btn-secondary"
    const Completed = "btn-success"
    if (data === "Completed") {
      return Completed
    } else if (data === "Scheduled") {
      return Scheduled
    } else {
      return
    }
  }

  get_engagement_history() {
    this.engagementService.get_events().subscribe({
      next: (result: any) => {
        console.log(result)
        result.data.forEach((elem: any) => {
          this.engagementRegister.push(elem.attributes)
        })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.prepareView()
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<engagement>(this.engagementRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 
  view(data: any) {
    this.engagementService.get_engagement_reference(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/engagement/engagements/view/" + result.data[0].id])
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
    
  }
  
  modify(data: any) {
    if (data.status === "Scheduled") {
      this.engagementService.get_engagement_reference(data.reference_number).subscribe({
        next: (result: any) => {
          this.router.navigate(["/apps/engagement/engagements/modify/" + result.data[0].id])
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
