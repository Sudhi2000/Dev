import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { RagService } from 'src/app/services/rag.api.service';
import { ehs, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { ModifyComponent } from '../modify/modify.component';
import { ViewComponent } from '../view/view.component';
import { FormControl } from '@angular/forms';
import { ReportParameterComponent } from './report-parameter/report-parameter.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  ragRegister: any[] = []
  Division = new FormControl('');
  orgID: string
  divisions: any[] = []
  subject$: ReplaySubject<ehs[]> = new ReplaySubject<ehs[]>(1);
  data$: Observable<ehs[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: ehs[];
  @Input()
  columns: ListColumn[] = [
    { name: 'Rag', property: 'rag', visible: true, isModelProperty: true },

    { name: 'Reference Number', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Employee Type', property: 'employee_type', visible: true, isModelProperty: true },
    { name: 'Employee ID', property: 'employee_id', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Employee Name', property: 'employee_name', visible: true, isModelProperty: true },
    { name: 'Date of Join', property: 'date_of_join', visible: true, isModelProperty: true },
    { name: 'Designation', property: 'designation', visible: true, isModelProperty: true },
    { name: 'Department', property: 'department', visible: true, isModelProperty: true },
    { name: 'Gender', property: 'gender', visible: true, isModelProperty: true },
    { name: 'Country', property: 'country', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<ehs>;
  unitSpecific: any
  userDivision: any
  corporateUser: any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  allCountries: any[] = []
  allStates: any[] = []
  filteredStates: any[] = []


  countries = new FormControl('');
  states = new FormControl('');

  constructor(
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private ragService: RagService,
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
      this.ragRegister = customers;
      this.dataSource.data = customers;
    });

    this.get_country()

    this.get_state()
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.rag
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
        const status = result.rag_history
        this.corporateUser = result.profile.corporate_user
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            if (this.corporateUser) {
              this.get_divisions();
              this.get_rag_history()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_rag_history()
            }
          }
          else {
            this.get_divisions();
            this.get_rag_history()
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_rag_history() {
    this.ragRegister = []
    this.ragService.get_rag_register().subscribe({
      next: (result: any) => {
        result.data.forEach((elem: any) => {
          this.ragRegister.push(elem.attributes)
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
  get_unit_specific_rag_history() {
    this.ragRegister = []
    this.ragService.get_unit_specific_rag_register(this.userDivision).subscribe({
      next: (result: any) => {
        result.data.forEach((elem: any) => {
          this.ragRegister.push(elem.attributes)
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<ehs>(this.ragRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  riskStatus(data: any) {
    const high = "high"
    const medium = "medium"
    const low = "low"
    if (data === "Red") {
      return high
    } else if (data === "Amber") {
      return medium
    } else if (data === "Green") {
      return low
    } else {
      return
    }
  }


  statusButton(data: any) {
    const Resigned = "btn-warning"
    const Active = "btn-success"
    if (data === "Active") {
      return Active
    } else if (data === "Resigned") {
      return Resigned
    } else {
      return
    }
  }

  view(data: any) {
    this.ragService.get_rag_reference(data.reference_number).subscribe({
      next: (result: any) => {
        this.dialog.open(ViewComponent, { height: "60%", data: result.data[0] })
        // this.router.navigate(["/apps/engagement/rag/view/" + result.data[0].id])
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }
  resign(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please reconfirm that the employee was marked as Resigned. The status will be changed as Active to Resigned.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ragService.get_rag_reference(data.reference_number).subscribe({
          next: (result: any) => {

            const id = result.data[0].id
            this.ragService.mark_status(id).subscribe({
              next: (result: any) => {
                const statusText = "The employee has marked as resigned"
                this._snackBar.open(statusText, 'OK', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                if (this.unitSpecific) {
                  if (this.corporateUser) {

                    this.get_rag_history()
                  }
                  else if (!this.corporateUser) {
                    this.get_unit_specific_rag_history()
                  }
                } else {
                  this.get_rag_history()

                }

              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {

              }
            })

          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {

          }
        })

      }
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  modify(ragData: any) {
    if (ragData.status === "Active") {
      this.ragService.get_rag_reference(ragData.reference_number).subscribe({
        next: (result: any) => {
          this.dialog.open(ModifyComponent, { height: "60%", data: result.data[0] }).afterClosed().subscribe(data => {
            this.ragRegister = []
            if (this.unitSpecific) {
              if (this.corporateUser) {
                this.get_rag_history()
              } else if (!this.corporateUser) {
                this.get_unit_specific_rag_history()
              }
            } else {

              this.get_rag_history()
            }


          })
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })



      // this.ragService.get_rag_reference(data.reference_number).subscribe({
      //   next: (result: any) => {
      //     this.router.navigate(["/apps/engagement/rag/modify/" + result.data[0].id])
      //   },
      //   error: (err: any) => {
      //     this.router.navigate(["/error/internal"])
      //   },
      //   complete: () => { }
      // })

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

  create() {
    this.dialog.open(CreateComponent, { height: "60%" }).afterClosed().subscribe(data => {
      this.ragRegister = []
      if (this.unitSpecific) {
        if (this.corporateUser) {
          this.get_rag_history()
        } else if (!this.corporateUser) {
          this.get_unit_specific_rag_history()
        }
      } else {
        this.get_rag_history()
      }

      // this.get_grievance_history()


    })
  }



  print(data: any) {
    document.getElementById(data)?.classList.add("hide");
    document.getElementById(data + '_1')?.classList.remove("hide")
    this.ragService.rag_individual_report(data).subscribe((response: any) => {
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
          document.getElementById('rag_report')?.classList.add("hide");
          document.getElementById('rag_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.ragService.rag_register_report(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('rag_report_loader')?.classList.add("hide");
              document.getElementById('rag_report')?.classList.remove("hide")
            })
          }
          else if (data.format === "Excel") {
            this.ragService.rag_register_report_excel(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('rag_report_loader')?.classList.add("hide");
              document.getElementById('rag_report')?.classList.remove("hide")
            })
          }
        } else if (data.startDate && data.endDate && !data.division ) {
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
          document.getElementById('rag_report')?.classList.add("hide");
          document.getElementById('rag_report_loader')?.classList.remove("hide")
          if (data.format === "PDF") {
            this.ragService.rag_register_report_2(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('rag_report_loader')?.classList.add("hide");
              document.getElementById('rag_report')?.classList.remove("hide")
            })
          } else if (data.format === "Excel") {
            this.ragService.rag_register_report_excel_2(parameter[0]).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('rag_report_loader')?.classList.add("hide");
              document.getElementById('rag_report')?.classList.remove("hide")
            })
          }
        }
      }
    })
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
    let selectedStates: any = [];
    let selectedDivisions = this.Division.value || [];
    let filterParams: string = '';
    if (selectedCountries.length > 0) {

      this.filteredStates = this.allStates.filter((res) =>
        selectedCountries.includes(res.attributes.country)
      );

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
      } else {

        if (this.corporateUser) {
          this.get_rag_history()
          return
        } else if (!this.corporateUser) {
          this.get_unit_specific_rag_history()
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

    if (filterParams.length === 0) {
      return;
    }


    this.ragService.get_rag_register_country(filterParams).subscribe({
      next: (result: any) => {
        this.ragRegister = result.data.map((elem: any) => elem.attributes);
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
}
