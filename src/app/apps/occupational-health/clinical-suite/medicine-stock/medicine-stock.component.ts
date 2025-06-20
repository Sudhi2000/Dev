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
  selector: 'app-medicine-stock',
  templateUrl: './medicine-stock.component.html',
  styleUrls: ['./medicine-stock.component.scss']
})
export class MedicineStockComponent implements OnInit {

  clinicalRegister: any[] = []
  orgID: string
  isLoading = true;
  totalItems = 0;
  corporateUser:any
  subject$: ReplaySubject<clinical[]> = new ReplaySubject<clinical[]>(1);
  data$: Observable<clinical[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: clinical[];
  @Input()
  unitSpecific: any
  userDivision: any
  columns: ListColumn[] = [
   
    { name: 'Medicine Name', property: 'medicine_name', visible: true, isModelProperty: true },
    { name: 'division', property: 'division', visible: true, isModelProperty: true },
    { name: 'received', property: 'received', visible: false, isModelProperty: true },
    { name: 'issued', property: 'issued', visible: false, isModelProperty: true },
    { name: 'balance', property: 'balance', visible: true, isModelProperty: true },

    { name: 'Status', property: 'actions', visible: true },

    { name: 'Threshold Limit', property: 'threshold_limit', visible: false, isModelProperty: true },
    { name: 'Last Updated', property: 'last_updated', visible: true, isModelProperty: true },
    
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<clinical>;

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
        const status = result.clin_med_stock
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if(this.unitSpecific){
           this.corporateUser=result.profile.corporate_user
           if(this.corporateUser){
            this.get_medicine_stock({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
           }
           else if(!this.corporateUser){
            let divisions:any[]=[]
            result.profile.divisions.forEach((elem:any)=>{
              divisions.push('filters[business_unit][division_uuid][$in]='+elem.division_uuid)
            })
            let results = divisions.join('&');
            this.userDivision = results
            this.get_unit_specific_medicine_stock({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
           }
          }else{

            this.get_medicine_stock({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_medicine_stock(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.clinicalService.get_medicine_stock(startIndex, pageEvent.pageSize).subscribe({
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
  get_unit_specific_medicine_stock(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.clinicalService.get_unit_specific_medicine_stock(startIndex, pageEvent.pageSize,this.userDivision).subscribe({
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


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<clinical>(this.clinicalRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  action(data:any){

  }

  view(data:any){
    
  }

  progress(data:any){
    const totalPer = 100
    const received = Number(data.received)
    const issued = Number(data.issued)
    const percentage = Number(issued)/Number(received)*100
    const perValue = Number(Math.round(Number(totalPer)-Number(percentage)).toFixed(0))
    return perValue
  }



}
