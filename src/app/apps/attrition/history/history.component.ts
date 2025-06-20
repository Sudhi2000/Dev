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
import { attrition, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AttritionService } from 'src/app/services/attrition.api.service';
import { FormControl } from '@angular/forms';
import { ReportParameterComponent } from './report-parameter/report-parameter.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  attritionRegister: any[] = []
  orgID: string

  subject$: ReplaySubject<attrition[]> = new ReplaySubject<attrition[]>(1);
  data$: Observable<attrition[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: attrition[];
  @Input()
  columns: ListColumn[] = [
    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },

    { name: 'Employee ID', property: 'employee_id', visible: true, isModelProperty: true },
    { name: 'Employee Name', property: 'employee_name', visible: true, isModelProperty: true },
    { name: 'Gender', property: 'gender', visible: true, isModelProperty: true },
    { name: 'Date of Join', property: 'date_of_join', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Resigned Date', property: 'resigned_date', visible: true, isModelProperty: true },
    { name: 'Relieved Date', property: 'relieved_date', visible: true, isModelProperty: true },
    { name: 'Department', property: 'department', visible: true, isModelProperty: true },
    { name: 'Tenure Split', property: 'tenure_split', visible: true, isModelProperty: true },
    { name: 'Country', property: 'country', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<attrition>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  unitSpecific: any;
  corporateUser: any;
  divisions: any[] = []
  userDivision: any
  Division = new FormControl('');
  isLoading: boolean;
  totalItems: any;
  allCountries: any[] = []
  allStates: any[] = []
  filteredStates: any[] = []
  countries = new FormControl('');
  states = new FormControl('');
  filterStatus: Boolean = false
  filterUrl: string = ''
  loggedInUser: number
  backToHistory: Boolean = false
  constructor(
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private attritionService: AttritionService,
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
      this.attritionRegister = customers;
      this.dataSource.data = customers;
    });
    this.get_country()
    this.get_state()
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.attrition
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
        const status = result.attrition_register
        this.corporateUser = result.profile.corporate_user
        this.loggedInUser = result.id
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_unit_specific_attrition({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
            else if (this.corporateUser) {
              this.get_divisions();
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;

              this.get_attrition_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          } else {
            this.get_divisions();
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;

            this.get_attrition_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })

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

  get_attrition_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    if (this.filterStatus) {


      this.attritionService.get_attrition_location_filter(this.filterUrl, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.attritionRegister.splice(startIndex, endIndex, ...data);
          this.totalItems = result.meta.pagination.total;
          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageEvent.pageSize;
            this.paginator.length = this.totalItems;
          })
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => {
          this.prepareView();
        }
      });
    } else {
      this.attritionService.get_attritions_register(startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => ({ ...elem.attributes, id: elem.id }));
          //this.attritionRegister.splice(startIndex, endIndex, ...data);
          this.attritionRegister = data
          this.totalItems = result.meta.pagination.total;
          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageEvent.pageSize;
            this.paginator.length = this.totalItems;
          });
          // result.data.forEach((elem: any) => {
          //   this.attritionRegister.push(elem.attributes)
          // })
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
  }
  get_unit_specific_attrition(pageEvent: PageEvent) {
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    if (this.filterStatus) {


      this.attritionService.get_attrition_location_filter(this.filterUrl, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.attritionRegister.splice(startIndex, endIndex, ...data);
          this.totalItems = result.meta.pagination.total;
          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageEvent.pageSize;
            this.paginator.length = this.totalItems;
          })
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => {
          this.prepareView();
        }
      });
    } else {
      this.attritionService.get_attrition_unit_specific_register(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
        next: (result: any) => {
          console.log("🚀 ~ HistoryComponent ~ this.attritionService.get_attrition_unit_specific_register ~ result:", result)

          const data = result.data.map((elem: any) => elem.attributes);
          //this.attritionRegister.splice(startIndex, endIndex, ...data);
          this.attritionRegister = data
          this.totalItems = result.meta.pagination.total;
          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageEvent.pageSize;
            this.paginator.length = this.totalItems;
          })
        },
        error: (err: any) => {
          // this.router.navigate(["/error/internal"])
        },
        complete: () => {
          this.isLoading = false;
          this.prepareView()
        }
      })

    }

  }

  grievDiv(event: any) {
    const selectedDivisionIds = event.value.map((division: any) => division.id);
    // this.filterForm.controls['division'].setValue(selectedDivisionIds);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<attrition>(this.attritionRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  view(data: any) {

    this.backToHistory = true
    this.attritionService.get_attrition_reference(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/attrition/view/" + result.data[0].id])
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

  get_country() {
    this.generalService.get_country().subscribe({
      next: (result: any) => {

        this.allCountries = result.data


      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  filterData() {
    const selectedCountries = this.countries.value || [];
    let selectedDivisions = this.Division.value || [];
    let selectedStates: any = [];
    let filterParams: string = '';

    if (selectedCountries.length > 0) {

      this.filteredStates = this.allStates.filter((res) =>
        selectedCountries.includes(res.attributes.country)
      );
      this.filterStatus = true
      this.states.setValue(
        this.states.value?.length > 0
          ? this.states.value.filter((state: any) => selectedCountries.includes(state.country))
          : []
      );
    } else {
      this.filteredStates = []
      this.states.setValue('')
      selectedStates = []


      if (selectedDivisions.length > 0) {
        filterParams = selectedDivisions
          .map((data: any) => `&filters[division]=${data.division_name}`)
          .join('');

        this.filterStatus = true;
      } else {

        this.filterStatus = false
        if (this.corporateUser) {
          this.get_attrition_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          return
        } else if (!this.corporateUser) {
          this.get_unit_specific_attrition({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          return
        }
      }
    }

    selectedStates = this.states.value || []

    if (selectedCountries.length > 0) {
      filterParams = selectedCountries.map((data: any) => `&filters[country]=${data}`).join('');
      if (!this.corporateUser) {
        filterParams += `&${this.userDivision}`
      }
    }

    if (selectedStates.length > 0) {
      const stateFilters = selectedStates.map((data: any) => `&filters[state]=${data.state_name}`).join('');
      filterParams += stateFilters;
      if (!this.corporateUser) {
        filterParams += `&${this.userDivision}`
      }
    }

    selectedDivisions = this.Division.value || [];

    if (selectedDivisions.length > 0) {
      const divisionFilters = selectedDivisions.map((data: any) => `&filters[division]=${data.division_name}`).join('');
      filterParams += divisionFilters;

    }

    this.filterUrl = filterParams

    if (filterParams.length === 0) {
      return;
    }




    // this.filterUrl = filterParams;

    // if (filterParams.length === 0) {
    //   return;
    // }

    this.attritionService.get_attrition_location_filter(filterParams, 0, 10).subscribe({
      next: (result: any) => {
        this.attritionRegister = result.data.map((elem: any) => elem.attributes);
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          // this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"]);
      },
      complete: () => {
        this.prepareView();
      }
    });



  }

  onFocus() {
    if (this.countries.value.length <= 0) {
      const statusText = "Please select the country"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      this.filteredStates = []
    } else {


    }
  }

  get_state() {
    this.generalService.get_state().subscribe({
      next: (result: any) => {

        this.allStates = result.data


      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  print(data: any) {
    document.getElementById(data)?.classList.add("hide");
    document.getElementById(data + '_1')?.classList.remove("hide")
    this.attritionService.attrition_individual_report(data).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      window.open(url)
      document.getElementById(data)?.classList.remove("hide");
      document.getElementById(data + '_1')?.classList.add("hide")
    })
  }

  generateReport() {
    this.dialog.open(ReportParameterComponent, { disableClose: true }).afterClosed().subscribe(data => {
      if (data) {
        let parameter: any = []
        if (data.startDate && data.endDate && data.division) {
          const start_date = new Date(data.startDate);
          const startDate = start_date.toISOString().split('T')[0];
          const end_date = new Date(data.endDate);
          const endDate = end_date.toISOString().split('T')[0];

          parameter.push({
            check_start_date: startDate,
            check_end_date: endDate,
            division: data?.division,
            reporting_person: data?.reporting_person,
            reporting_mail: data?.reporting_email,

          })
          document.getElementById('attrition_report')?.classList.add("hide");
          document.getElementById('attrition_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.attritionService.attrition_register_report(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('attrition_report_loader')?.classList.add("hide");
              document.getElementById('attrition_report')?.classList.remove("hide")
            })
          }
          else if (data.format === "Excel") {
            this.attritionService.attrition_register_excel(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('attrition_report_loader')?.classList.add("hide");
              document.getElementById('attrition_report')?.classList.remove("hide")
            })
          }
        } else if (data.startDate && data.endDate && !data.division) {
          const start_date = new Date(data.startDate);
          const startDate = start_date.toISOString().split('T')[0];
          const end_date = new Date(data.endDate);
          const endDate = end_date.toISOString().split('T')[0];

          parameter.push({
            check_start_date: startDate,
            check_end_date: endDate,
            reporting_person: data?.reporting_person,
            reporting_mail: data?.reporting_email,
            // division: data?.division,
          })
          document.getElementById('attrition_report')?.classList.add("hide");
          document.getElementById('attrition_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.attritionService.attrition_register_report1(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('attrition_report_loader')?.classList.add("hide");
              document.getElementById('attrition_report')?.classList.remove("hide")
            })
          } else if (data.format === "Excel") {
            this.attritionService.attrition_register_excel1(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('attrition_report_loader')?.classList.add("hide");
              document.getElementById('attrition_report')?.classList.remove("hide")
            })
          }
        }
      }
    })
  }

  statusButton(data: any) {
    const draft = "btn-warning"
    const Active = "btn-success"
    const Open = "btn-light"
    const inprogress = "btn-secondary"
    if (data === "Completed") {
      return Active
    } else if (data === "Open") {
      return Open
    }
    else if (data === "In-Progress") {
      return inprogress
    }
    else if (data === "Draft") {

      return draft
    } else {
      return
    }
  }
  modify(data: any) {
    this.backToHistory = true
    this.attritionService.get_attrition_reference(data.reference_number).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/attrition/modify/" + result.data[0].id])
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

    //this.router.navigate([`/apps/attrition/modify/${data.id}`]);
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }


}
