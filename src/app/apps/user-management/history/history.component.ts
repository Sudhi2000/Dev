import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { ehs, ListColumn } from 'src/app/services/schemas';
import { UserService } from 'src/app/services/user.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { CreateUserComponent } from '../create-user/create-user.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModifyUserComponent } from '../modify-user/modify-user.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  userRegister: any[] = []
  orgID: string
  
  subject$: ReplaySubject<ehs[]> = new ReplaySubject<ehs[]>(1);
  data$: Observable<ehs[]> = this.subject$.asObservable();
  customers: ehs[];


  @Input()
  columns: ListColumn[] = [
    { name: 'Employee ID', property: 'employee_id', visible: true, isModelProperty: true },
    { name: 'First Name', property: 'first_name', visible: true, isModelProperty: true },
    { name: 'Last Name', property: 'last_name', visible: true, isModelProperty: true },
    { name: 'Gender', property: 'gender', visible: true, isModelProperty: true },
    { name: 'Designation', property: 'designation', visible: true, isModelProperty: true },
    { name: 'Email', property: 'email', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<ehs>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private hazardService: HazardService,
    private router: Router,
    public dialog: MatDialog,
    private generalService: GeneralService,
    private authService: AuthService,
    private documentService: DocumentService,
    private userService:UserService) { }

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
      this.userRegister = customers;
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
        const status = result.data.attributes.modules.user_management
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
        const status = result.user_history
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_user_profile()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_user_profile() {
    this.userService.get_user_profile().subscribe({
      next: (result: any) => {
        result.data.forEach((elem: any) => {
          this.userRegister.push(elem.attributes)
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
    this.dataSource = new MatTableDataSource<ehs>(this.userRegister);
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
  createUser() {
    this.dialog.open(CreateUserComponent)
  }
  modifyUser(data: any) {
    this.dialog.open(ModifyUserComponent  ,{data:data}).afterClosed().subscribe(data => {
      //window.location.reload()
    })
     

  }
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

 

}
