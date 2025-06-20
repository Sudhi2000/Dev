import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment_register, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-environment-history',
  templateUrl: './environment-history.component.html',
  styleUrls: ['./environment-history.component.scss']
})
export class EnvironmentHistoryComponent implements OnInit {
  environmentRegister: any[] = []
  orgID: string
  userID: any
  pending = "Waste, Water"
  subject$: ReplaySubject<environment_register[]> = new ReplaySubject<environment_register[]>(1);
  data$: Observable<environment_register[]> = this.subject$.asObservable();
  customers: environment_register[];
  serachReference: any = ""
  unitSpecific: any
  userDivision: any
  division_uuids: any[] = [];
  divisions: any[] = []
  Division = new FormControl(['']);
  backToHistory: Boolean = false
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Year', property: 'year', visible: true, isModelProperty: true },
    { name: 'Month', property: 'month', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Work Force', property: 'work_force', visible: true, isModelProperty: true },
    { name: 'Days Worked', property: 'days_worked', visible: true, isModelProperty: true },
    { name: 'Product Produced (KG)', property: 'product_produced_kg', visible: true, isModelProperty: true },
    { name: 'Area', property: 'area', visible: true, isModelProperty: true },
    { name: 'Reviewer', property: 'reviewer', visible: true, isModelProperty: true },
    { name: 'Approver', property: 'approver', visible: true, isModelProperty: true },
    { name: 'Category Status', property: 'pending_consumption', visible: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<environment_register>;
  filterForm: FormGroup
  isLoading = true;
  totalItems = 0;
  type: string = 'Consumption Report';
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  corporateUser: any
  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private environmentService: EnvironmentService,
    public dialog: MatDialog,) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit() {
    this.configuration()
    this.filterForm = this.formBuilder.group({
      division: [''],
    })
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((customers) => {
      this.environmentRegister = customers;
      this.dataSource.data = customers;
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.environment
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
        this.userID = result.id
        const status = result.env_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions();
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_environment_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
                this.division_uuids.push(elem.division_uuid)
                this.divisions = result.profile.divisions
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_environment_unit_specific_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            this.get_divisions();

            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_environment_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
          division_uuid: attributes.division_uuid
        }));
        this.divisions = newArray;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });

  }
  EnvDiv(event: any) {
    const selectedDivisionIds = event.value.map((division: any) => division.id);
    this.filterForm.controls['division'].setValue(selectedDivisionIds);
  }
  get_environment_unit_specific_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.environmentService.get_environment_unit_specific_register(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        // this.environmentRegister.splice(startIndex, endIndex, ...data);
        this.environmentRegister = data
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

  get_environment_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.environmentService.get_environment_register(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const data = result.data.map((elem: any) => elem.attributes);
        //this.environmentRegister.splice(startIndex, endIndex, ...data);
        this.environmentRegister = data
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

  generate() {

    this.isLoading = true;
    const pageSize = this.pageSize;
    const startIndex = 0;

    // Case 1: Unit Specific & Non-Corporate User & No Division Selected
    if (this.unitSpecific && !this.corporateUser && !this.filterForm.value.division) {
      this.environmentService.get_environment_unit_specific_search(this.serachReference, this.userDivision, startIndex, pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.environmentRegister = data;
          this.totalItems = result.meta.pagination.total;

          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageSize;
            this.paginator.length = this.totalItems;
          });
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => {
          this.isLoading = false;
          this.prepareView();
        }
      });
    }
    // Case 2: Division Selected with Valid Length
    else if (
      this.filterForm.value.division?.length > 0 &&
      (
        (this.unitSpecific && this.corporateUser) ||
        (this.unitSpecific && !this.corporateUser) ||
        !this.unitSpecific
      )
    ) {
      let division = this.filterForm.value.division.map((id: number) => {
        return `filters[business_unit][id]=${id}`;
      }).join('&');

      this.environmentService.get_environment_division_search(this.serachReference, division, startIndex, pageSize).subscribe({
        next: (result: any) => {

          const data = result.data.map((elem: any) => elem.attributes);
          this.environmentRegister = data;
          this.totalItems = result.meta.pagination.total;

          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageSize;
            this.paginator.length = this.totalItems;
          });
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => {
          this.isLoading = false;
          this.prepareView();
        }
      });
    }
    // Case 3: General Search with `serachReference`
    else if (this.serachReference) {
      this.environmentService.get_environment_search(this.serachReference).subscribe({
        next: (result: any) => {

          const data = result.data.map((elem: any) => elem.attributes);
          this.environmentRegister = data;
          this.totalItems = result.meta.pagination.total;

          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageSize;
            this.paginator.length = this.totalItems;
          });
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => {
          this.isLoading = false;
          this.prepareView();
        }
      });
    }
    // Case 4: Fallback to Unit-Specific Search
    else {
      this.environmentService.get_environment_div_specific_search(this.userDivision, startIndex, pageSize).subscribe({
        next: (result: any) => {

          const data = result.data.map((elem: any) => elem.attributes);
          this.environmentRegister = data;
          this.totalItems = result.meta.pagination.total;

          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageSize;
            this.paginator.length = this.totalItems;
          });
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => {
          this.isLoading = false;
          this.prepareView();
        }
      });
    }
  }


  onPaginate(pageEvent: PageEvent) {

    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    if (this.filterForm.value.division?.length > 0) {
      const division = this.filterForm.value.division
        .map((id: number) => `filters[business_unit][id]=${id}`)
        .join('&');

      this.environmentService.get_environment_division_search(
        this.serachReference,
        division,
        startIndex,
        pageEvent.pageSize
      ).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.environmentRegister = data;
          this.totalItems = result.meta.pagination.total;

          setTimeout(() => {
            this.paginator.pageIndex = pageEvent.pageIndex;
            this.paginator.length = this.totalItems;
          });
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => {
          this.isLoading = false;
          this.prepareView();
        }
      });
    }
    else if (this.unitSpecific && !this.corporateUser) {

      this.get_environment_unit_specific_register(pageEvent);
    } else {
      this.get_environment_register(pageEvent);
    }
  }

  reset() {
    this.ngOnInit()
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<environment_register>(this.environmentRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  statusButton(data: any) {
    // const open = "btn-light"
    const underReview = "btn-light"
    const inprogress = "btn-secondary"
    const completed = "btn-success"
    const verify = "btn-info"
    const underInvestigation = "btn-info"
    const rejected = "btn-danger"
    const draft = "btn-warning"
    if (data === "Under review") {
      return underReview
    } else if (data === "In-Progress") {
      return inprogress
    } else if (data === "Approved") {
      return completed
    } else if (data === "Reviewed") {
      return verify
    } else if (data === "Rejected") {
      return rejected
    } else if (data === "Under Investigation") {
      return underInvestigation
    } else if (data === "Draft") {
      return draft
    } else {
      return
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  view(data: any) {
    this.backToHistory = true
    const reference = data.reference_number
    this.router.navigate(["apps/environment/consumption/view/" + reference])
  }

  modify(data: any) {
    this.backToHistory = true
    const reference = data.reference_number
    this.router.navigate(["apps/environment/consumption/modify/" + reference])
  }

  print(data: any) {

  }

  generateReport() {
    this.dialog.open(GenerateReportComponent, { data: { user_Divisions: this.division_uuids } }).afterClosed().subscribe((data) => {
      if (data.type === "Consumption Report") {
        document.getElementById('waste_report')?.classList.add("hide");
        document.getElementById('waste_report_loader')?.classList.remove("hide")
        if (data.format === "PDF") {
          this.environmentService.environment_report(data).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('waste_report')?.classList.remove("hide");
            document.getElementById('waste_report_loader')?.classList.add("hide")
          })
        } else if (data.format == "Excel") {
          this.environmentService.environment_report_excel(data).subscribe((response: any) => {
            let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            window.open(url)
            document.getElementById('waste_report')?.classList.remove("hide");
            document.getElementById('waste_report_loader')?.classList.add("hide")
          })
        }

      }
      if (data.type === "Waste Inventory Report") {
        let parameter: any = []
        if (data.startDate && data.endDate && data.division) {
          const start_date = new Date(data.startDate).toISOString().split('T')[0];
          const end_date = new Date(data.endDate).toISOString().split('T')[0];
          parameter.push({
            division: data.division,
            startDate: start_date,
            endDate: end_date,

          });
          document.getElementById('waste_report')?.classList.add("hide");
          document.getElementById('waste_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.environmentService.waste_inventory_report_pdf(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('waste_report')?.classList.remove("hide");
              document.getElementById('waste_report_loader')?.classList.add("hide")
            })
          }
          else if (data.format == "Excel") {
            this.environmentService.waste_inventory_report_excel(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('waste_report')?.classList.remove("hide");
              document.getElementById('waste_report_loader')?.classList.add("hide")
            })
          }
        } else if (data.year && data.division) {
          parameter.push({
            year: data.year,
            month: data.month,
            division: data.division,
          });
          document.getElementById('waste_report')?.classList.add("hide");
          document.getElementById('waste_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.environmentService.waste_inventory_report_pdf1(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('waste_report')?.classList.remove("hide");
              document.getElementById('waste_report_loader')?.classList.add("hide")
            })
          }
          else if (data.format == "Excel") {
            this.environmentService.waste_inventory_report_excel1(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('waste_report')?.classList.remove("hide");
              document.getElementById('waste_report_loader')?.classList.add("hide")
            })
          }
        }
      }
      if (data.type === "ODS Report") {
        let parameter: any = []
        if (data.startDate && data.endDate && data.division) {
          const start_date = new Date(data.startDate).toISOString().split('T')[0];
          const end_date = new Date(data.endDate).toISOString().split('T')[0];
          parameter.push({
            division: data.division,
            startDate: start_date,
            endDate: end_date,
            reporting_person: data.reporting_person,
            reporting_mail: data.reporting_mail,
            company_name: data.company_name,
            defualt_date: data.defualt_date

          });
          document.getElementById('waste_report')?.classList.add("hide");
          document.getElementById('waste_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.environmentService.ods_report_pdf(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('waste_report')?.classList.remove("hide");
              document.getElementById('waste_report_loader')?.classList.add("hide")
            })
          }
          else if (data.format == "Excel") {
            this.environmentService.ods_report_excel(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('waste_report')?.classList.remove("hide");
              document.getElementById('waste_report_loader')?.classList.add("hide")
            })
          }
        } else if (data.year && data.division) {
          parameter.push({
            year: data.year,
            division: data.division,
            reporting_person: data.reporting_person,
            reporting_mail: data.reporting_mail,
            company_name: data.company_name,
            defualt_date: data.defualt_date
          });
          document.getElementById('waste_report')?.classList.add("hide");
          document.getElementById('waste_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.environmentService.ods_report_pdf1(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('waste_report')?.classList.remove("hide");
              document.getElementById('waste_report_loader')?.classList.add("hide")
            })
          }
          else if (data.format == "Excel") {
            this.environmentService.ods_report_excel1(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('waste_report')?.classList.remove("hide");
              document.getElementById('waste_report_loader')?.classList.add("hide")
            })
          }
        }
      }
      if (data.type === "Refrigerant Inventory Report") {
        let parameter: any = []
        if (data.startDate && data.endDate && data.division) {
          const start_date = new Date(data.startDate).toISOString().split('T')[0];
          const end_date = new Date(data.endDate).toISOString().split('T')[0];
          parameter.push({
            division: data.division,
            startDate: start_date,
            endDate: end_date,
            reporting_person: data.reporting_person,
            reporting_mail: data.reporting_mail,
            company_name: data.company_name,
            defualt_date: data.defualt_date

          });
          document.getElementById('waste_report')?.classList.add("hide");
          document.getElementById('waste_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.environmentService.refrigerant_inventory_report_pdf(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('waste_report')?.classList.remove("hide");
              document.getElementById('waste_report_loader')?.classList.add("hide")
            })
          }
          else if (data.format == "Excel") {
            this.environmentService.refrigerant_inventory_report_excel(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('waste_report')?.classList.remove("hide");
              document.getElementById('waste_report_loader')?.classList.add("hide")
            })
          }
        } else if (data.year && data.division) {
          parameter.push({
            year: data.year,
            division: data.division,
            reporting_person: data.reporting_person,
            reporting_mail: data.reporting_mail,
            company_name: data.company_name,
            defualt_date: data.defualt_date
          });
          document.getElementById('waste_report')?.classList.add("hide");
          document.getElementById('waste_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.environmentService.refrigerant_inventory_report_pdf1(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('waste_report')?.classList.remove("hide");
              document.getElementById('waste_report_loader')?.classList.add("hide")
            })
          }
          else if (data.format == "Excel") {
            this.environmentService.refrigerant_inventory_report_excel1(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('waste_report')?.classList.remove("hide");
              document.getElementById('waste_report_loader')?.classList.add("hide")
            })
          }
        }
      }
    })
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }




}
