import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { ehs, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  chemicalRegister: any[] = []
  orgID: string
  
  subject$: ReplaySubject<ehs[]> = new ReplaySubject<ehs[]>(1);
  data$: Observable<ehs[]> = this.subject$.asObservable();
  customers: ehs[];


  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Commercial Name', property: 'transaction_date', visible: true, isModelProperty: true },
    { name: 'ZDHC Level', property: 'division', visible: true, isModelProperty: true },
    { name: 'Approver', property: 'authorized_person', visible: true, isModelProperty: true },
    { name: 'Delivered Quantity', property: 'chemical', visible: true, isModelProperty: true },
    { name: 'Storage Place', property: 'total_quantity', visible: true, isModelProperty: true },
    { name: 'Issued', property: 'issued_quantity', visible: true, isModelProperty: true },
    { name: 'Balance', property: 'disposed_quantity', visible: true, isModelProperty: true },
    { name: 'Status', property: 'balance', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<ehs>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private hazardService: HazardService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private chemicalService: ChemicalService) { }

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
      this.chemicalRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    // this.generalService.get_app_config().subscribe({
    //   next:(result:any)=>{},
    //   error:(err:any)=>{},
    //   complete:()=>{}
    // })
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.chemical
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
        const status = result.chem_trans
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_chemical_transaction()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_chemical_transaction() {
    this.chemicalService.get_chemical_transaction().subscribe({
      next: (result: any) => {
        result.data.forEach((elem: any) => {
          this.chemicalRegister.push(elem.attributes)
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
    this.dataSource = new MatTableDataSource<ehs>(this.chemicalRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  riskStatus(data: any) {
    const high = "high"
    const medium = "medium"
    const low = "low"
    if (data === "High") {
      return high
    } else if (data === "Medium") {
      return medium
    } else if (data === "Low") {
      return low
    } else {
      return
    }
  }

  statusButton(data: any) {
    const draft = "btn-light"
    const scheduled = "btn-warning"
    const inProgress = "btn-primary"
    const completed = "btn-success"
    const approved = "btn-secondary"
    const rejected = "btn-danger"
    const hold = "btn-info"
    const changeReq = "btn-dark"
    const Pending = "btn-warning"
   
    if (data === "Draft") {
      return draft
    } else if (data === "Scheduled") {
      return scheduled
    } else if (data === "In-Progress") {
      return inProgress
    } else if (data === "Completed") {
      return completed
    }
    else if (data === "Passed") {
      return approved
    } else if(data==="Approved"){
      return approved
    }else if(data==="Rejected"){
      return rejected
    }else if(data==="Hold"){
      return hold
    }else if(data==="Change Requested"){
      return changeReq
    }else if(data==="Pending"){
      return Pending
    }
    else if(data==="Open"){
      return Pending
    }
    else{
      return
    }
  }

  statusIcon(data: any) {
    const pending = "more-horizontal"
    const inprogress = "clock"
    const completed = "check-circle"
    const rejected = "slash"
    if (data === "Open") {
      return pending
    } else if (data === "In-Progress") {
      return inprogress
    } else if (data === "Completed") {
      return completed
    } else if (data === "Rejected") {
      return rejected
    } else {
      return
    }
  }

  view(data: any) {
    this.chemicalService.get_transaction_details_reference(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/chemical-management/view-transaction/" + result.data[0].id])
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
    
  }
  dispose(data: any) {
    this.chemicalService.get_transaction_details_reference(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/chemical-management/dispose/" + result.data[0].id])
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

  modify(data: any) {
    if (data.status === "Approved"|| data.status === "Draft" ) {
      this.chemicalService.get_chemical_details_reference(data.reference_number).subscribe({
        next: (result: any) => {
          this.router.navigate(["/apps/chemical-management/modify/" + result.data[0].id])
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

}
