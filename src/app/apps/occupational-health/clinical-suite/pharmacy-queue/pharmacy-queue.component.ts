import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { RagService } from 'src/app/services/rag.api.service';
import { clinical, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';

@Component({
  selector: 'app-pharmacy-queue',
  templateUrl: './pharmacy-queue.component.html',
  styleUrls: ['./pharmacy-queue.component.scss']
})
export class PharmacyQueueComponent implements OnInit {

  clinicalRegister: any[] = []
  orgID: string
  corporateUser: any
  subject$: ReplaySubject<clinical[]> = new ReplaySubject<clinical[]>(1);
  data$: Observable<clinical[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: clinical[];
  @Input()
  columns: ListColumn[] = [

    { name: 'Patient ID', property: 'patient_id', visible: true, isModelProperty: true },
    { name: 'Employee ID', property: 'employee_id', visible: true, isModelProperty: true },
    { name: 'Employee Name', property: 'employee_name', visible: true, isModelProperty: true },
    { name: 'Age', property: 'age', visible: true, isModelProperty: true },
    { name: 'Gender', property: 'gender', visible: true, isModelProperty: true },
    { name: 'Check In', property: 'check_in', visible: true, isModelProperty: true },
    //{ name: 'Consulting Doctor', property: 'consulting_doctor', visible: true, isModelProperty: true },
    { name: 'Check Out', property: 'check_out', visible: true, isModelProperty: true },
    { name: 'Status', property: 'patient_status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<clinical>;
  isLoading = true;
  totalItems = 0;
  unitSpecific: any
  userDivision: any
  backToHistory: Boolean = false
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private clinicalService: ClinicalSuiteService,
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
      this.clinicalRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.occupational_health
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
        const status = result.clin_pharmacy
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_pharmacy_queue({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
            else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_unit_specific_pharmacy_queue({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }

          } else {
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_pharmacy_queue({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  get_pharmacy_queue(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.clinicalService.get_pharmacy_queue(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.clinicalRegister.splice(startIndex, endIndex, ...data);
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
  get_unit_specific_pharmacy_queue(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.clinicalService.get_unit_specific_pharmacy_queue(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        this.clinicalRegister.splice(startIndex, endIndex, ...data);
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

  print(data: any) {

  }
  statusButton(data: any) {
    const Resigned = "btn-warning"
    const Active = "btn-success"
    const Open = "btn-light"
    if (data === "Completed") {
      return Active
    } else if (data === "Pending") {
      return Open
    } else {
      return
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<clinical>(this.clinicalRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  view(data: any) {
    this.backToHistory = true
    this.clinicalService.get_clinical_reference(data.patient_id).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/occupational-health/clinical-suite/pharmacy-queue/view/" + result.data[0].id])
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

  action(data: any) {
    this.backToHistory = true
    this.clinicalService.get_clinical_suite_refe(data.patient_id).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/occupational-health/clinical-suite/pharmacy-action/" + result.data[0].id])
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }


}
