import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { ehs, ListColumn } from 'src/app/services/schemas';
import { SustainabilityService } from 'src/app/services/sustainability.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  documentRegister: any[] = []
  orgID: string
  subject$: ReplaySubject<ehs[]> = new ReplaySubject<ehs[]>(1);
  data$: Observable<ehs[]> = this.subject$.asObservable();
  customers: ehs[];
  backToHistory: Boolean = false
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Title', property: 'title', visible: true, isModelProperty: true },
    { name: 'Location', property: 'location', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'SDG', property: 'SDG', visible: true, isModelProperty: true },
    { name: 'Pillars', property: 'pillars', visible: true, isModelProperty: true },
    { name: 'Start Date', property: 'start_timeline', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  totalItems = 0;
  dataSource: MatTableDataSource<ehs>;
  unitSpecific: any
  userDivision: any
  corporateUser: any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private sustainabilityService: SustainabilityService) { }

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
      this.documentRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.sustainability
        this.unitSpecific = result.data.attributes.business_unit_specific
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
        const status = result.sus_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {

          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_sustainability_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            } else if (!this.corporateUser) {

              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_units][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_unit_specific_sustainability_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          } else {
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_sustainability_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_sustainability_register(pageEvent: PageEvent) {
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.sustainabilityService.get_sustainability_register(startIndex, pageEvent.pageSize).subscribe({

      next: (result: any) => {
        result.data.forEach((elem: any) => {
          //this.documentRegister.push(elem.attributes)
          const data = result.data.map((elem: any) => elem.attributes);
          //  this.documentRegister.splice(startIndex, endIndex, ...data);
          this.documentRegister = data
          this.totalItems = result.meta.pagination.total;
          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageEvent.pageSize;
            this.paginator.length = this.totalItems;
          })
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
  get_unit_specific_sustainability_register(pageEvent: PageEvent) {
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.sustainabilityService.get_unit_specific_sustainability_register(startIndex, pageEvent.pageSize, this.userDivision).subscribe({

      next: (result: any) => {
        result.data.forEach((elem: any) => {
          //this.documentRegister.push(elem.attributes)

          const data = result.data.map((elem: any) => elem.attributes);
          // this.documentRegister.splice(startIndex, endIndex, ...data);
          this.documentRegister = data
          this.totalItems = result.meta.pagination.total;
          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageEvent.pageSize;
            this.paginator.length = this.totalItems;
          })
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
    this.dataSource = new MatTableDataSource<ehs>(this.documentRegister);
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
    const Happening = "btn-warning"
    const Congratulations = "btn-success"
    if (data === "Congratulations") {
      return Congratulations
    } else if (data === "Happening") {
      return Happening
    } else {
      return
    }
  }

  view(data: any) {
    this.backToHistory = true
    this.sustainabilityService.get_sustainability_reference(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/sustainability/view/" + result.data[0].id])
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
    if (data.status === "Happening") {
      this.backToHistory = true
      this.sustainabilityService.get_sustainability_reference(data.reference_number).subscribe({
        next: (result: any) => {
          this.router.navigate(["/apps/sustainability/modify/" + result.data[0].id])
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

  print(data: any) {

    document.getElementById(data)?.classList.add("hide");
    document.getElementById(data + '_1')?.classList.remove("hide")
    this.sustainabilityService.sustainability_report(data).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      window.open(url)
      document.getElementById(data)?.classList.remove("hide");
      document.getElementById(data + '_1')?.classList.add("hide")
    })
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
