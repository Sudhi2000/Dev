import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { filter, Observable, ReplaySubject, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { ehs, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { MatDialog } from '@angular/material/dialog';
import { EmailComponent } from './email/email.component';
import { ReportParameterComponent } from './report-parameter/report-parameter.component';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import moment from 'moment';

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'YYYY'
//   },
//   display: {
//     dateInput: 'YYYY',
//     monthYearLabel: 'YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'YYYY'
//   }
// }
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY', // This is the format the date will be parsed in
  },
  display: {
    dateInput: 'YYYY', // Display year only in the input field
    monthYearLabel: 'YYYY', // Format used in the date picker panel header
    dateA11yLabel: 'YYYY', // Format used for a11y purposes
    monthDayLabel: 'YYYY', // Format used for displaying selected month and day
  },
};

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class HistoryComponent implements OnInit {
  public initialPage: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  };
  orderRegister: any[] = []
  orderedRegister: any[] = []
  documentRegister: any[] = []
  documentDataList: any[] = []
  documentData: any[] = []
  orgID: string
  subject$: ReplaySubject<ehs[]> = new ReplaySubject<ehs[]>(1);
  data$: Observable<ehs[]> = this.subject$.asObservable();
  customers: ehs[];
  filterForm: FormGroup
  dropdownValues: any[] = []
  documentType: any[] = []
  divisions: any[] = []
  years: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  unitSpecific: any
  userDivision: any
  userUnit: any
  statusActive: any
  statusGoing: any
  statusExpire: any
  statusOptions = ['Active', 'Going to Expire', 'Expired'];
  selectedStatuses: string[] = [];
  Division = new FormControl('Division', [Validators.required]);
  backToHistory: Boolean = false
  @Input()
  columns: ListColumn[] = [
    { name: 'document_number', property: 'document_number', visible: true, isModelProperty: true },
    { name: 'version_number', property: 'version_number', visible: true, isModelProperty: true },
    { name: 'document_type', property: 'document_type', visible: true, isModelProperty: true },
    { name: 'title', property: 'title', visible: true, isModelProperty: true },
    { name: 'division', property: 'division', visible: true, isModelProperty: true },
    { name: 'issuing_authority', property: 'issuing_authority', visible: true, isModelProperty: true },
    { name: 'issued_date', property: 'issued_date', visible: true, isModelProperty: true },
    { name: 'expiry_date', property: 'expiry_date', visible: true, isModelProperty: true },
    { name: 'notify_date', property: 'notify_date', visible: true, isModelProperty: true },
    { name: 'elapse_days', property: 'elapse_days', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  isLoading = false;
  dataSource: MatTableDataSource<ehs>;
  totalItems = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  corporateUser: any
  filterValue: any;
  typingTimeout: any;
  private searchTerms = new Subject<string>();
  selectedYear: string | null = null;

  duedate = new FormControl(null, [Validators.required]);

  isSelectingStart: boolean = true;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor(private hazardService: HazardService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    public dialog: MatDialog,
    private documentService: DocumentService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

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
      this.dataSource.data = this.calculateElapseDays(customers);
    });

    this.filterForm = this.formBuilder.group({
      document_type: [''],
      division: [''],
      year: [''],
      status: [''],
      startDate: [''],
      endDate: [''],
    })
  }
  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.document
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
        const status = result.doc_register;
        if (status === false) {
          this.router.navigate(["/error/unauthorized"]);
        } else {
          this.userUnit = [];
          result.profile.divisions.forEach((elem: any) => {
            this.userUnit.push(elem.division_name);
          });
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user;
            if (!this.corporateUser) {
              let divisions: any[] = [];
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[$or][0][business_unit][division_uuid][$in]=' + elem.division_uuid);
                this.divisions.push(elem);
              });
              let results = divisions.join('&');
              this.userDivision = results;
            } else {
              this.get_divisions();
            }
          } else {
            this.get_divisions();
          }
          this.get_dropdown_values();
          this.get_years();

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"]);
      },
      complete: () => {

      }
    });
  }


  //get dropdown values
  get_dropdown_values() {
    const module = "Document Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.isLoading = true;
        this.get_document_type()
        // this.showProgressPopup()
        let division = this.filterForm.value.division
        let unitFilters
        if (division === 'All units') {
          division = 'filters[division][$eq]=All units'
        } else {
          if (this.unitSpecific) {
            if ((!this.corporateUser && this.filterForm.value.division) || (this.corporateUser && this.filterForm.value.division)) {
              division = 'filters[business_unit][division_uuid][$in]=' + this.Division.value.division_uuid;
            } else if (!this.corporateUser && !this.filterForm.value.division) {
              if (this.userUnit) {

                unitFilters = this.userUnit.map((unit: any) => `filters[division][$eq]=${unit}`).join('&');
              }
              division = this.userDivision + '&filters[$or][1][business_unit][division_uuid][$null]=true&filters[division][$eq]=All units' + (unitFilters ? '&' + unitFilters : "");
            }
          } else if (!this.unitSpecific && this.filterForm.value.division) {
            division = 'filters[division][$eq]=' + this.filterForm.value.division;
          }
        }

        if (division) {

          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;

          const pageIndex = prevPageIndex * 10
          this.documentService.get_document_division(division, pageIndex, 10).subscribe({


            next: (result: any) => {
              const data = result.data.map((elem: any) => elem.attributes);
              this.documentRegister.splice(0, 10, ...this.calculateElapseDays(data));
              // this.sortDocuments();
              this.totalItems = result.meta.pagination.total;
              setTimeout(() => {
                this.paginator.pageIndex = pageIndex / 10;
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
        else if (!division) {


          const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;

          const pageIndex = prevPageIndex * 10
          this.documentService.get_all_document(prevPageIndex, 10).subscribe({
            next: (result: any) => {
              const data = result.data.map((elem: any) => elem.attributes);
              this.documentRegister.splice(0, 10, ...this.calculateElapseDays(data));
              // this.sortDocuments();
              this.totalItems = result.meta.pagination.total;
              setTimeout(() => {
                this.paginator.pageIndex = pageIndex / 10;
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
      }
    })
  }

  get_document_type() {
    const dataType = this.dropdownValues.filter(function (data: any) {
      return (data.attributes.Category === "Document Type")
    })
    this.documentType = dataType
  }

  //get divisions
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

  get_years() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.years = result.data.attributes.Year
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
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
  private calculateElapseDays(documents: any[]): any[] {
    const currentDate = new Date();
    return documents.map(doc => {
      const expiryDate = new Date(doc.expiry_date);
      if (!doc.expiry_date) {
        return {
          ...doc,
        };
      } else {

        const elapseDays = Math.floor((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
          ...doc,
          elapse_days: elapseDays + 1
        };
      }
    });
  }
  // private sortDocuments() {
  //   this.documentRegister.sort((a, b) => {
  //     const aExpiryDate = new Date(a.expiry_date).getTime();
  //     const bExpiryDate = new Date(b.expiry_date).getTime();
  //     const aStatus = a.status;
  //     const bStatus = b.status;
  //     if (aStatus === 'Expired' && bStatus !== 'Expired') return -1;
  //     if (aStatus !== 'Expired' && bStatus === 'Expired') return 1;
  //     if (aStatus === 'Going to Expire' && bStatus === 'Active') return -1;
  //     if (aStatus === 'Active' && bStatus === 'Going to Expire') return 1;
  //     return aExpiryDate - bExpiryDate;
  //   });
  // }
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
    const active = "btn-success"
    const expired = "btn-danger"
    const to_expire = "btn-warning"
    if (data === "Active") {
      return active
    } else if (data === "Expired") {
      return expired
    } else if (data === "Going to Expire") {
      return to_expire
    } else {
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
    this.backToHistory = true
    this.documentService.get_document_details_reference(data.unique_id).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/document-management/view/" + result.data[0].id])
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }

  print(data: any) {
    document.getElementById(data)?.classList.add("hide");
    document.getElementById(data + '_1')?.classList.remove("hide")
    this.hazardService.ehs_report(data).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      window.open(url)
      document.getElementById(data)?.classList.remove("hide");
      document.getElementById(data + '_1')?.classList.add("hide")
    })
  }

  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;

    const numericDatePattern = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
    const textDatePattern = /^(\d{1,2})-(\w{3})-(\d{4})$/;

    let dateMatch = filterValue.match(numericDatePattern);

    if (dateMatch) {
      let day = dateMatch[1].padStart(2, '0');
      let month = dateMatch[2].padStart(2, '0');
      const year = dateMatch[3];
      filterValue = `${year}-${month}-${day}`;
    } else {
      dateMatch = filterValue.match(textDatePattern);
      if (dateMatch) {
        let day = dateMatch[1].padStart(2, '0');
        const monthName = dateMatch[2].toLowerCase();
        const year = dateMatch[3];
        const monthMap: { [key: string]: string } = {
          jan: "01",
          feb: "02",
          mar: "03",
          apr: "04",
          may: "05",
          jun: "06",
          jul: "07",
          aug: "08",
          sep: "09",
          oct: "10",
          nov: "11",
          dec: "12"
        };

        const month = monthMap[monthName];
        if (month) {
          filterValue = `${year}-${month}-${day}`;
        }
      }
    }

    this.filterValue = filterValue;

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    if (!this.filterValue) {
      this.reset();
    } else {
      this.typingTimeout = setTimeout(() => {
        this.filterData({ pageIndex: 0, pageSize: this.pageSize, length: 0 });
      }, 1000);
    }
  }

  filterData(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.documentRegister = [];
    if (!this.unitSpecific || (this.unitSpecific && this.corporateUser)) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));

      this.documentService.get_all_document_filter(this.filterValue, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
          this.totalItems = result.meta.pagination.total;
          this.dataSource = new MatTableDataSource<ehs>(this.documentRegister);
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
    } else {

      let division;
      let unitFilters;
      if (this.userUnit) {

        unitFilters = this.userUnit.map((unit: any) => `filters[division][$eq]=${unit}`).join('&');
      }
      division = (unitFilters ? '&' + unitFilters : "") + '&filters[division][$eq]=All units';
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
      this.documentService.get_unit_specific_document_filter(this.filterValue, startIndex, pageEvent.pageSize, division).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
          this.totalItems = result.meta.pagination.total;
          this.dataSource = new MatTableDataSource<ehs>(this.documentRegister);
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
  }

  modify(data: any) {
    this.backToHistory = true
    this.documentService.get_document_details_reference(data.unique_id).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/document-management/modify/" + result.data[0].id])
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  docType(data: any) {
    this.filterForm.controls['document_type'].setValue(data.target.value)
  }

  docDiv(event: any) {
    if (event.target.value === 'All units') {
      this.filterForm.controls['division'].setValue('All units')
    } else {
      this.filterForm.controls['division'].setValue(this.Division.value.division_name)
    }
  }

  docYear(data: any) {
    this.filterForm.controls['year'].setValue(data.target.value)
  }

  onYearSelected(event: any, picker: any) {
    const selectedYear = moment(event).year();
    if (this.isSelectingStart) {
      this.dateRange.get('start')?.setValue(moment({ year: selectedYear }));
      this.filterForm.controls['startDate'].setValue(selectedYear)
      picker.close()
      this.isSelectingStart = false;
      setTimeout(() => {
        picker.open();
      }, 0);
    } else {
      this.dateRange.get('end')?.setValue(moment({ year: selectedYear }));
      this.filterForm.controls['endDate'].setValue(selectedYear)
      this.isSelectingStart = true;
      picker.close();
    }
  }

  docStatus(event: any) {
    const selectedValue = event.value;
    //    if(event.value === 'Active'){
    //     this.statusGoing = ''
    //         this.statusExpire = ''
    //    }
    //    else if(event.value === 'Expire'){
    //  this.statusGoing = ''
    //         this.statusActive = ''
    //    }
    //    else{
    //     this.statusExpire = ''
    //         this.statusActive = ''
    //    }
    //  const selectedValueString = selectedValue.join(', ');
    this.filterForm.controls['status'].setValue(event.value)
  }
  // search(pageEvent: PageEvent) {

  //   this.isLoading = true;
  //   const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
  //   const endIndex = startIndex + pageEvent.pageSize;
  //   this.documentRegister = []
  //   const type = this.filterForm.value.document_type
  //   let division = this.filterForm.value.division
  //   let unitFilters;
  //   if (division === 'All units') {
  //     division = 'filters[division][$eq]=All units'
  //   } else {
  //     if (this.unitSpecific) {
  //       if ((!this.corporateUser && this.filterForm.value.division) || (this.corporateUser && this.filterForm.value.division)) {
  //         division = 'filters[business_unit][division_uuid][$in]=' + this.Division.value.division_uuid;
  //       } else if (!this.corporateUser && !this.filterForm.value.division) {
  //         if (this.userUnit) {

  //           unitFilters = this.userUnit.map((unit: any) => `filters[division][$eq]=${unit}`).join('&');
  //         }
  //         division = this.userDivision + '&filters[$or][1][business_unit][division_uuid][$null]=true&filters[division][$eq]=All units' + (unitFilters ? '&' + unitFilters : "");
  //       }
  //     } else if (!this.unitSpecific && this.filterForm.value.division) {
  //       division = 'filters[division][$eq]=' + this.filterForm.value.division;
  //     }
  //   }
  //   const year = this.filterForm.value.year
  //   if (type && division && !year) {
  //     this.documentService.get_document_type_division(type, division, startIndex, pageEvent.pageSize).subscribe({
  //       next: (result: any) => {
  //         const data = result.data.map((elem: any) => elem.attributes);
  //         this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
  //         // this.sortDocuments();
  //         this.totalItems = result.meta.pagination.total;
  //         setTimeout(() => {
  //           this.paginator.pageIndex = startIndex / pageEvent.pageSize;
  //           this.paginator.length = this.totalItems;
  //         })
  //       },
  //       error: (err: any) => {
  //         this.router.navigate(["/error/internal"])
  //       },
  //       complete: () => {
  //         this.isLoading = false;
  //         this.prepareView()
  //       }
  //     })


  //   }

  //   else if (!type && division && !year) {
  //     this.documentService.get_document_division(division, startIndex, pageEvent.pageSize).subscribe({
  //       next: (result: any) => {
  //         const data = result.data.map((elem: any) => elem.attributes);
  //         this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
  //         // this.sortDocuments();
  //         this.totalItems = result.meta.pagination.total;
  //         setTimeout(() => {
  //           this.paginator.pageIndex = startIndex / pageEvent.pageSize;
  //           this.paginator.length = this.totalItems;
  //         })
  //       },
  //       error: (err: any) => {
  //         this.router.navigate(["/error/internal"])
  //       },
  //       complete: () => {
  //         this.isLoading = false;
  //         this.prepareView()
  //       }
  //     })
  //   }
  //   else if (!type && !division && !year) {
  //     this.documentService.get_all_document(startIndex, pageEvent.pageSize).subscribe({
  //       next: (result: any) => {
  //         const data = result.data.map((elem: any) => elem.attributes);
  //         this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
  //         // this.sortDocuments();
  //         this.totalItems = result.meta.pagination.total;
  //         setTimeout(() => {
  //           this.paginator.pageIndex = startIndex / pageEvent.pageSize;
  //           this.paginator.length = this.totalItems;
  //         })
  //       },
  //       error: (err: any) => {
  //         this.router.navigate(["/error/internal"])
  //       },
  //       complete: () => {
  //         this.isLoading = false;
  //         this.prepareView()
  //       }
  //     })
  //   }
  //   else if (!type && division && year) {

  //     this.documentService.get_document_division_year(year, division, startIndex, pageEvent.pageSize).subscribe({
  //       next: (result: any) => {
  //         const data = result.data.map((elem: any) => elem.attributes);
  //         this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
  //         // this.sortDocuments();
  //         this.totalItems = result.meta.pagination.total;
  //         setTimeout(() => {
  //           this.paginator.pageIndex = startIndex / pageEvent.pageSize;
  //           this.paginator.length = this.totalItems;
  //         })
  //       },
  //       error: (err: any) => {
  //         this.router.navigate(["/error/internal"])
  //       },
  //       complete: () => {
  //         this.isLoading = false;
  //         this.prepareView()
  //       }
  //     })
  //   }
  //   else if (type && !division && !year) {


  //     this.documentService.get_document_type(type, startIndex, pageEvent.pageSize).subscribe({
  //       next: (result: any) => {
  //         const data = result.data.map((elem: any) => elem.attributes);
  //         this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
  //         // this.sortDocuments();
  //         this.totalItems = result.meta.pagination.total;
  //         setTimeout(() => {
  //           this.paginator.pageIndex = startIndex / pageEvent.pageSize;
  //           this.paginator.length = this.totalItems;
  //         })
  //       },
  //       error: (err: any) => {
  //         this.router.navigate(["/error/internal"])
  //       },
  //       complete: () => {
  //         this.isLoading = false;
  //         this.prepareView()
  //       }
  //     })
  //   }
  //   else if (type && !division && year) {


  //     this.documentService.get_document_type_year(year, type, startIndex, pageEvent.pageSize).subscribe({
  //       next: (result: any) => {
  //         const data = result.data.map((elem: any) => elem.attributes);
  //         this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
  //         // this.sortDocuments();
  //         this.totalItems = result.meta.pagination.total;
  //         setTimeout(() => {
  //           this.paginator.pageIndex = startIndex / pageEvent.pageSize;
  //           this.paginator.length = this.totalItems;
  //         })
  //       },
  //       error: (err: any) => {
  //         this.router.navigate(["/error/internal"])
  //       },
  //       complete: () => {
  //         this.isLoading = false;
  //         this.prepareView()
  //       }
  //     })
  //   }
  //   else if (!type && !division && year) {


  //     this.documentService.get_document_year(year, startIndex, pageEvent.pageSize).subscribe({
  //       next: (result: any) => {
  //         const data = result.data.map((elem: any) => elem.attributes);
  //         this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
  //         // this.sortDocuments();
  //         this.totalItems = result.meta.pagination.total;
  //         setTimeout(() => {
  //           this.paginator.pageIndex = startIndex / pageEvent.pageSize;
  //           this.paginator.length = this.totalItems;
  //         })
  //       },
  //       error: (err: any) => {
  //         this.router.navigate(["/error/internal"])
  //       },
  //       complete: () => {
  //         this.isLoading = false;
  //         this.prepareView()
  //       }
  //     })
  //   }
  //   else if (type && division && year) {


  //     this.documentService.get_document_type_year_division(type, year, division, startIndex, pageEvent.pageSize).subscribe({
  //       next: (result: any) => {
  //         const data = result.data.map((elem: any) => elem.attributes);
  //         this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
  //         // this.sortDocuments();
  //         this.totalItems = result.meta.pagination.total;
  //         setTimeout(() => {
  //           this.paginator.pageIndex = startIndex / pageEvent.pageSize;
  //           this.paginator.length = this.totalItems;
  //         })
  //       },
  //       error: (err: any) => {
  //         this.router.navigate(["/error/internal"])
  //       },
  //       complete: () => {
  //         this.isLoading = false;
  //         this.prepareView()
  //       }
  //     })
  //   }
  // }

  search(pageEvent: PageEvent) {

    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.documentRegister = []
    const type = this.filterForm.value.document_type
    const year = this.filterForm.value.year
    const startyear = this.filterForm.value.startDate
    const endyear = this.filterForm.value.endDate
    const status = this.filterForm.value.status
    let division = this.filterForm.value.division
    let unitFilters;
    if (division === 'All units') {
      division = 'filters[division][$eq]=All units'
    } else {
      if (this.unitSpecific) {


        if ((!this.corporateUser && this.filterForm.value.division) || (this.corporateUser && this.filterForm.value.division)) {
          division = 'filters[business_unit][division_uuid][$in]=' + this.Division.value.division_uuid;
        } else if (!this.corporateUser && !this.filterForm.value.division) {
          if (this.userUnit) {

            unitFilters = this.userUnit.map((unit: any) => `filters[division][$eq]=${unit}`).join('&');
          }
          division = this.userDivision + '&filters[$or][1][business_unit][division_uuid][$null]=true&filters[division][$eq]=All units' + (unitFilters ? '&' + unitFilters : "");
        }
      } else if (!this.unitSpecific && this.filterForm.value.division) {
        division = 'filters[division][$eq]=' + this.filterForm.value.division;
      }
    }

    if (type && division && !startyear && !endyear && status.length <= 0) {

      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
      this.documentService.get_document_type_division(type, division, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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

    else if (!type && division && !startyear && !endyear && status.length <= 0) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
      this.documentService.get_document_division(division, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (!type && !division && !startyear && !endyear && status.length <= 0) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
      this.documentService.get_all_document(startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (!type && division && startyear && endyear && status.length <= 0) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
      this.documentService.get_document_division_year(startyear, endyear, division, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (type && !division && !startyear && !endyear && status.length <= 0) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));

      this.documentService.get_document_type(type, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (type && !division && startyear && endyear && status.length <= 0) {

      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
      this.documentService.get_document_type_year(startyear, endyear, type, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (!type && !division && startyear && endyear && status.length <= 0) {

      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
      this.documentService.get_document_year(startyear, endyear, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (type && division && startyear && endyear && status.length <= 0) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));

      this.documentService.get_document_type_year_division(type, startyear, endyear, division, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (!type && !division && !startyear && !endyear && status.length > 0) {

      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
      this.documentService.get_document_status(status, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (!type && division && !startyear && !endyear && status.length > 0) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
      this.documentService.get_document_division_status(status, division, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (!type && division && startyear && endyear && status.length > 0) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));

      this.documentService.get_document_status_year_division(status, startyear, endyear, division, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (type && !division && !startyear && !endyear && status.length > 0) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex)); 7
      this.documentService.get_document_type_status(type, status, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (type && !division && startyear && endyear && status.length > 0) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));

      this.documentService.get_document_type_year_status(type, startyear, endyear, status, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (type && division && !startyear && !endyear && status.length > 0) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));

      this.documentService.get_document_type_division_status(type, division, status, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (type && division && startyear && endyear && status.length > 0) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));

      this.documentService.get_document_type_year_division_status(type, startyear, endyear, division, status, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
    else if (!type && !division && startyear && endyear && status.length > 0) {
      localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));

      this.documentService.get_document_year_status(startyear, endyear, status, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          const data = result.data.map((elem: any) => elem.attributes);
          this.documentRegister.splice(startIndex, endIndex, ...this.calculateElapseDays(data));
          // this.sortDocuments();
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
  }

  reset() {
    (<HTMLInputElement>document.getElementById('document_type_id')).value = 'Document Type';
    if (this.corporateUser) {
      { (<HTMLInputElement>document.getElementById('document_div_id')).value = 'Division'; }
    }
    // (<HTMLInputElement>document.getElementById('document_year_id')).value = 'Year';
    window.location.reload();



  }

  email(data: any) {
    const uuid = data.unique_id
    this.dialog.open(EmailComponent, { width: "50%" }).afterClosed().subscribe((emailData: any) => {
      this.documentService.create_document_email(uuid, emailData).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const statusText = "Email sent successfully";
          this._snackBar.open(statusText, 'Close', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      },
      )
    })
  }

  generateReport() {
    this.dialog.open(ReportParameterComponent, { disableClose: true }).afterClosed().subscribe(data => {
      if (data) {

        if (data?.format === "PDF") {
          document.getElementById('doc_report')?.classList.add("hide");
          document.getElementById('doc_report_loader')?.classList.remove("hide")

          const division = (data.division !== null && data.division !== undefined);
          const type = (data.document_type !== null && data.document_type !== undefined);
          const year = (data.year !== null && data.year !== undefined);
          const status = (data.status !== null && data.status !== undefined);
          // const startDate = (data.startDate !== null && data.startDate !== undefined);
          // const endDate = (data.endDate !== null && data.endDate !== undefined);


          if (status) {
            this.documentService.document_register_report_status_pdf(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('doc_report')?.classList.remove("hide");
              document.getElementById('doc_report_loader')?.classList.add("hide")
            })

          } else {
            this.documentService.document_register_report_pdf(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('doc_report')?.classList.remove("hide");
              document.getElementById('doc_report_loader')?.classList.add("hide")
            })
          }




          // if (division && type && year) {
          //   this.documentService.document_register_report(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (division && type && !year) {
          //   this.documentService.document_register_report_division_type(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (division && !type && year) {
          //   this.documentService.document_register_report_division_year(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (!division && type && year) {
          //   this.documentService.document_register_report_type_year(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (!division && !type && !year) {
          //   this.documentService.document_register_report_all().subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (division && !type && !year) {
          //   this.documentService.document_register_report_division(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (!division && type && !year) {
          //   this.documentService.document_register_report_type(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (!division && !type && year) {
          //   this.documentService.document_register_report_year(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // }

        } else if (data?.format === "EXCEL") {
          document.getElementById('doc_report')?.classList.add("hide");
          document.getElementById('doc_report_loader')?.classList.remove("hide")
          const division = (data.division !== null && data.division !== undefined);
          const type = (data.document_type !== null && data.document_type !== undefined);
          const year = (data.year !== null && data.year !== undefined);
          const status = (data.status !== null && data.status !== undefined);

          if (status) {
            this.documentService.document_register_report_status_excel(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('doc_report')?.classList.remove("hide");
              document.getElementById('doc_report_loader')?.classList.add("hide")
            })
          } else {
            this.documentService.document_register_report_excel(data).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById('doc_report')?.classList.remove("hide");
              document.getElementById('doc_report_loader')?.classList.add("hide")
            })
          }



          // if (division && type && year) {
          //   this.documentService.document_register_report_excel(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (division && type && !year) {
          //   this.documentService.document_register_report_division_type_excel(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (division && !type && year) {
          //   this.documentService.document_register_report_division_year_excel(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (!division && type && year) {
          //   this.documentService.document_register_report_type_year_excel(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (!division && !type && !year) {
          //   this.documentService.document_register_report_all_excel().subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (division && !type && !year) {
          //   this.documentService.document_register_report_division_excel(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (!division && type && !year) {
          //   this.documentService.document_register_report_type_excel(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // } else if (!division && !type && year) {
          //   this.documentService.document_register_report_year_excel(data).subscribe((response: any) => {
          //     let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          //     const url = window.URL.createObjectURL(blob);
          //     window.open(url)
          //     document.getElementById('doc_report')?.classList.remove("hide");
          //     document.getElementById('doc_report_loader')?.classList.add("hide")
          //   })
          // }
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
