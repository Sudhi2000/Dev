import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { equipment, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { MatDialog } from '@angular/material/dialog';
import { LocationMapComponent } from './location-map/location-map.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  equipmentRegister: any[] = []
  orgID: string

  subject$: ReplaySubject<equipment[]> = new ReplaySubject<equipment[]>(1);
  data$: Observable<equipment[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: equipment[];
  backToHistory: Boolean = false
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Equipment Name', property: 'equipment_name', visible: true, isModelProperty: true },
    { name: 'Equipment Type', property: 'equipment_type', visible: true, isModelProperty: true },
    { name: 'Fuel Type', property: 'fuel_type', visible: true, isModelProperty: true },
    { name: 'Last Odometer Reading', property: 'last_odometer_reading', visible: true, isModelProperty: true },
    { name: 'Last Inspection Date', property: 'last_inspection_date', visible: true, isModelProperty: true },
    // { name: 'Client/Project', property: 'client_name', visible: true, isModelProperty: true },
    // { name: 'Current Location', property: 'current_location', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<equipment>;
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
      this.equipmentRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {

    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        console.log(result)
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
    console.log('dsadsadsda')
    this.authService.me().subscribe({
      next: (result: any) => {
        console.log(result)
        const status = result.equipment_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          console.log('ok to process')
          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
          this.get_equipment_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }


  statusButton(data: any) {
    const Assigned = "btn-success"
    const Unassigned = "btn-secondary"
    if (data === "Unassigned") {
      return Unassigned
    } else if (data === "Assigned") {
      return Assigned
    } else {
      return
    }
  }

  get_equipment_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.equipmentService.get_equipments(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        console.log(result)
        const data = result.data.map((elem: any) => elem.attributes);
        this.equipmentRegister.splice(startIndex, endIndex, ...data);
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
    this.dataSource = new MatTableDataSource<equipment>(this.equipmentRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  view(data: any) {
    this.backToHistory = true
    this.equipmentService.get_equipment_reference(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/equipment-management/equipment/view/" + result.data[0].id])
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }

  action(data: any) {
    this.backToHistory = true
    this.equipmentService.get_equipment_reference(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/equipment-management/equipment/action/" + result.data[0].id])
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

  location(eqpData: any) {
    this.dialog.open(LocationMapComponent, { width: '1000px', data: eqpData })
  }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

}
