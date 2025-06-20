import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { inspection, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { CreateUpdateTemplateComponent } from '../create-update-template/create-update-template.component';
import { ViewTemplateComponent } from '../view-template/view-template.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  inspectionRegister: any[] = []
  orgID: string

  subject$: ReplaySubject<inspection[]> = new ReplaySubject<inspection[]>(1);
  data$: Observable<inspection[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: inspection[];
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },

    { name: 'Template Name', property: 'template_name', visible: true, isModelProperty: true },
    { name: 'Category', property: 'category', visible: true, isModelProperty: true },
    { name: 'Created Date', property: 'created_date', visible: true, isModelProperty: true },
    { name: 'Modified Date', property: 'modified_date', visible: false, isModelProperty: true },
    { name: 'Number of Questions', property: 'questions', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: false, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<inspection>;
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
      this.inspectionRegister = customers;
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
    this.authService.me().subscribe({
      next: (result: any) => {
        console.log(result)
        const status = result.insp_template_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_inspection_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
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

  get_inspection_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.equipmentService.get_inspections(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        console.log(result)
        const data = result.data.map((elem: any) => elem.attributes);
        this.inspectionRegister.splice(startIndex, endIndex, ...data);
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
    this.dataSource = new MatTableDataSource<inspection>(this.inspectionRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  view(tempData: any) {
    this.equipmentService.get_inspection_reference(tempData.reference_number).subscribe({
      next: (result: any) => {
        this.dialog.open(ViewTemplateComponent, { data: result.data[0], width: "850px" })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }

  modify(tempData: any) {


    this.equipmentService.get_inspection_reference(tempData.reference_number).subscribe({
      next: (result: any) => {
        this.dialog.open(CreateUpdateTemplateComponent, { data: result.data[0], width: "850px" }).afterClosed().subscribe(data => {
      this.get_inspection_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          

        })
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
    this.dialog.open(CreateUpdateTemplateComponent, { width: "800px" }).afterClosed().subscribe(data => {

      this.get_inspection_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })


    })
  }

}
