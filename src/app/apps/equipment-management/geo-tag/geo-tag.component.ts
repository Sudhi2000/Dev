import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { geo_tag, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { CreateGeoTagComponent } from '../create-geo-tag/create-geo-tag.component';
import { MatDialog } from '@angular/material/dialog';
import { ModifyGeoTagComponent } from '../modify-geo-tag/modify-geo-tag.component';
import { ViewGeoTagComponent } from '../view-geo-tag/view-geo-tag.component';

@Component({
  selector: 'app-geo-tag',
  templateUrl: './geo-tag.component.html',
  styleUrls: ['./geo-tag.component.scss']
})
export class GeoTagComponent implements OnInit {
  geotagRegister: any[] = []
  orgID: string
  currencyFormat:any
  subject$: ReplaySubject<geo_tag[]> = new ReplaySubject<geo_tag[]>(1);
  data$: Observable<geo_tag[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: geo_tag[];
  @Input()
  columns: ListColumn[] = [
    { name: 'Tag ID', property: 'tag_id', visible: true, isModelProperty: true },
    { name: 'Manufacturer', property: 'manufacturer', visible: true, isModelProperty: true },
    { name: 'Manufacturing Date', property: 'manufacturing_date', visible: true, isModelProperty: true },

    { name: 'Purchased Date', property: 'purchased_date', visible: true, isModelProperty: true },

    { name: 'Price', property: 'price', visible: true, isModelProperty: true },
    { name: 'Assigned Equipment', property: 'assigned_equipment', visible: true, isModelProperty: true },

    { name: 'Status', property: 'status', visible: false, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<geo_tag>;
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
      this.geotagRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        console.log(result)
        const status = result.data.attributes.modules.equipment
        this.currencyFormat = result.data.attributes.currency
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
        const status = result.geo_tag_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_geo_tag_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
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
    const Active = "btn-success"
    if (data === "Active") {
      return Active
    } else if (data === "Scheduled") {
      return Scheduled
    } else {
      return
    }
  }

  get_geo_tag_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.equipmentService.get_geo_tags(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        console.log(result)
        const data = result.data.map((elem: any) => elem.attributes);
        this.geotagRegister.splice(startIndex, endIndex, ...data);
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
    this.dataSource = new MatTableDataSource<geo_tag>(this.geotagRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  create() {
    this.dialog.open(CreateGeoTagComponent).afterClosed().subscribe(data => {

      this.get_geo_tag_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })


    })

  }
  modify(geoData: any) {
    this.equipmentService.get_geo_tag_reference(geoData.reference_number).subscribe({
      next: (result: any) => {
        console.log(result)
        this.dialog.open(ModifyGeoTagComponent, { data: result.data[0] }).afterClosed().subscribe(data=>{

          this.get_geo_tag_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })

        })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  view(geoData: any) {
    this.equipmentService.get_geo_tag_reference(geoData.reference_number).subscribe({
      next: (result: any) => {
        console.log(result)
        this.dialog.open(ViewGeoTagComponent, { data: result.data[0] })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  
}
