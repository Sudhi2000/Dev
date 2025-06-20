import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { client, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApexGrid, ColumnConfiguration } from 'apex-grid';
import { CreateClientComponent } from '../create-client/create-client.component';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { ModifyClientComponent } from '../modify-client/modify-client.component';
import { ViewClientComponent } from '../view-client/view-client.component';

ApexGrid.register();
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {


  clientRegister: any[] = []
  orgID: string


  subject$: ReplaySubject<client[]> = new ReplaySubject<client[]>(1);
  data$: Observable<client[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: client[];
  currentRate = 8;
  @Input()
  columns: ListColumn[] = [

    { name: 'Client ID', property: 'client_id', visible: true, isModelProperty: true },
    { name: 'Client Name', property: 'client_name', visible: true, isModelProperty: true },
    { name: 'Contact Number', property: 'client_contact_number', visible: true, isModelProperty: true },
    { name: 'Email ID', property: 'client_email_id', visible: true, isModelProperty: true },
    { name: 'Industry Type', property: 'industry_type', visible: true, isModelProperty: true },
    // { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<client>;
  isLoading = true;
  totalItems = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private equipmentService: EquipmentService,
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
      this.clientRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.equipment
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
        const status = result.client_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_client_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_client_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.clientRegister = []
    this.equipmentService.get_client_register(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        console.log(result)
        const data = result.data.map((elem: any) => elem.attributes);
        this.clientRegister.splice(startIndex, endIndex, ...data);
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
    this.dataSource = new MatTableDataSource<client>(this.clientRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

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


  statusButton(data: any) {
    const Resigned = "btn-warning"
    const Active = "btn-success"
    const Open = "btn-light"
    if (data === "Closed") {
      return Active
    } else if (data === "Open") {
      return Open
    } else {
      return
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  modify(cliData: any) {

    this.equipmentService.get_client_reference(cliData.client_id).subscribe({
      next: (result: any) => {
        console.log(result)
        this.dialog.open(ModifyClientComponent, { data: result.data[0] }).afterClosed().subscribe(data => {

          this.get_client_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })

        })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }

  create() {
    this.dialog.open(CreateClientComponent).afterClosed().subscribe(data => {

      this.get_client_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })


    })

  }
  view(cliData: any) {
    console.log(cliData)
    this.dialog.open(ViewClientComponent, { data: cliData })
  }
}
