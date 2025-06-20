import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, Router } from '@angular/router';
import * as feather from 'feather-icons';
import { EsgService } from 'src/app/services/esg.service';
import { ListColumn } from 'src/app/services/schemas';
import Swal from 'sweetalert2';
import { GeneralService } from 'src/app/services/general.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { GeneralDisclosureComponent } from '../general-disclosure/general-disclosure.component';
import { GeneralDisclosureModifyComponent } from '../general-disclosure-modify/general-disclosure-modify.component';
import { GeneralDisclosureViewComponent } from '../general-disclosure-view/general-disclosure-view.component';
import { ReportParameterComponent } from './report-parameter/report-parameter.component';

@Component({
  selector: 'app-general-disclosure-register',
  templateUrl: './general-disclosure-register.component.html',
  styleUrls: ['./general-disclosure-register.component.scss']
})
export class GeneralDisclosureRegisterComponent implements OnInit {

  isCreatedUser: Boolean
  esgRegister: any[] = []
  Alldivisions: any[] = []
  teamMemberReg: any;
  @Input()
  columns: ListColumn[] = [
    {
      name: 'Legal Name',
      property: 'legal_name',
      visible: true,
      isModelProperty: true,
    },
    {
      name: 'Nature of Ownership and Legal Form',
      property: 'nature_of_ownership_and_legal_form',
      visible: true,
      isModelProperty: true
    },
    {
      name: 'Location of its Headquarters',
      property: 'location_of_its_headquarters',
      visible: true,
      isModelProperty: true
    },
    {
      name: 'Organisation Email',
      property: 'organisation_email',
      visible: true,
      isModelProperty: true
    },
    {
      name: 'Year of Incorporation',
      property: 'year_of_incorporation',
      visible: true,
      isModelProperty: true,
    },
    {
      name: 'Year',
      property: 'year',
      visible: true,
      isModelProperty: true,
    },
    {
      name: 'Status',
      property: 'status',
      visible: true,
      isModelProperty: true
    },
    {
      name: 'Actions',
      property: 'actions',
      visible: true
    },

  ] as ListColumn[];
  pageSize = 10;
  totalItems: any
  isLoading = true;
  formData = new FormData()
  corporateUser: any
  createdUser: any
  currentUser: any
  divisions: any[] = []
  Division = new FormControl(['']);
  filterForm: FormGroup
  unitSpecific: any
  userDivision: any
  orgID: string
  division_uuids: any[] = [];
  searchReference: any = ""

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<any>;


  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    public esgService: EsgService,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        feather.replace();  // Reinitialize icons on route change
      }
    });
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit(): void {
    this.configuration();
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.esg
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        }
        else if (status === true) {
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
        this.currentUser = result.profile.id
        const status = result.esg_general_disclosure_register
        if (status === false) {
          Swal.close()
          this.router.navigate(["/error/unauthorized"])
        }
        else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid]=' + elem.division_uuid)
                this.division_uuids.push(elem.division_uuid)
                this.divisions = result.profile.divisions
              })
              let results = divisions.join('&');
              this.userDivision = results
            }
          }
          this.get_esg_register_genDisclosure({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          // this.get_divisions();

        }
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  reset() {
    this.filterForm.reset()
    this.searchReference = ''
    this.ngOnInit()
  }

  isCurrentUserInTeam(row: any): boolean {

    if (row.teamMemberData && this.currentUser) {
      return row.teamMemberData.some((member: any) => {
        return String(member.user_id) === String(this.currentUser);
      });
    }
    return false;
  }

  onPaginate(pageEvent: PageEvent) {

    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;

    this.get_esg_register_genDisclosure(pageEvent);
  }

  private prepareView() {
    Swal.close()
    this.dataSource = new MatTableDataSource<any>(this.esgRegister);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  statusButton(data: any) {
    const Happening = "btn-warning"
    const Open = "btn-light"
    const draft = "btn-warning"
    const Congratulations = "btn-success"
    const completed = "btn-success"

    if (data === "Congratulations") {
      return Congratulations
    } else if (data === "Completed") {
      return completed
    }
    else if (data === "Happening") {
      return Happening
    } else if (data === "Open") {
      return Open
    } else if (data === "Draft") {
      return draft
    }

    else {
      return
    }
  }

  create() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.esg_general_disclosure_create
        if (status === false) {
          Swal.close()
          this.router.navigate(["/error/unauthorized"])
        }
        else if (status === true) {
          this.dialog.open(GeneralDisclosureComponent, { disableClose: true, width: "900px" }).afterClosed().subscribe(data => {
            if (data) {
              this.formData = new FormData();
              this.formData.append('form_value', JSON.stringify(data.form_value))

              if (data.status == 'Open') {
                this.esgService.esg_create_genDisclosure(this.formData).subscribe({
                  next: (result: any) => {
                    if (result[0].code === 200) {
                      Swal.close();
                      Swal.fire({
                        title: 'ESG General Disclosure Created',
                        imageUrl: 'assets/images/success.gif',
                        imageWidth: 250,
                        text: 'Successfully Created ESG General Disclosure Details.',
                        showCancelButton: false,
                      }).then((result) => {
                        Swal.close();
                        this.get_esg_register_genDisclosure({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                        this.ngOnInit()
                      });
                    }

                  },
                  error: (err: any) => {
                    Swal.close(); // Close loading popup
                    Swal.fire({
                      title: 'Error',
                      text: 'Failed to create esg general disclosure. Please try again.',
                      icon: 'error',
                      confirmButtonText: 'OK',
                    });
                  },
                  complete: () => { }

                })
              } else if (data.status == 'Draft') {

                let status = ''
                let id = ''

                this.esgService.esg_create_genDisclosure(this.formData).subscribe({
                  next: (result: any) => {
                    if (result[0].code === 200) {
                      this.modify(result[0].dataEntry);
                      Swal.close();
                      Swal.fire({
                        title: 'ESG General Disclosure Created',
                        text: 'Successfully Created ESG General Disclosure Details.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                      });
                    }

                  },
                  error: (err: any) => {
                    Swal.close(); // Close loading popup
                    Swal.fire({
                      title: 'Error',
                      text: 'Failed to create esg general disclosure. Please try again.',
                      icon: 'error',
                      confirmButtonText: 'OK',
                    });
                  },
                  complete: () => { }

                })
              }


            }
          }
          )

        }
      }
      ,
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_esg_register_genDisclosure(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;

    this.esgService.esg_register_genDisclosure(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const resultData = result?.data[0]?.register?.map((elem: any) => elem);
        this.esgRegister.splice(startIndex, endIndex, ...resultData);
        this.totalItems = result?.meta?.pagination?.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        })
      },
      error: (err: any) => { },
      complete: () => {
        this.isLoading = false;

        this.prepareView()
      },
    })
  }


  modify(data: any) {
    this.dialog.open(GeneralDisclosureModifyComponent, { width: "900px", data: data }).afterClosed().subscribe(data => {
      if (data) {

        this.formData = new FormData();
        this.formData.append('form_value', JSON.stringify(data.form_value))
        this.esgService.esg_update_genDisclosure(this.formData).subscribe({
          next: (result: any) => {
            if (result[0].code === 200) {
              Swal.close();
              Swal.fire({
                title: 'ESG General Disclosure Modified',
                imageUrl: 'assets/images/success.gif',
                imageWidth: 250,
                text: 'Successfully Modified ESG General Disclosure Details.',
                showCancelButton: false,
              }).then((result) => {
                Swal.close();
                this.get_esg_register_genDisclosure({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                this.ngOnInit()
              });
            }

          },
          error: (err: any) => {
            Swal.close(); // Close loading popup
            Swal.fire({
              title: 'Error',
              text: 'Failed to modified esg general disclosure. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          },
          complete: () => { }

        })

      }
    })
  }

  action(data: any) {

  }

  view(data: any) {
    this.dialog.open(GeneralDisclosureViewComponent, { width: "900px", data: data }).afterClosed().subscribe(data => {

    })
  }





  //   print(data: any) {
  //     const dialogRef = this.dialog.open(ReportParameterComponent, {
  //       width: '400px',
  //       data: { data }
  //     });

  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         const year = result.year;
  //         const report_type = result.reportType;
  //         const format = result.format;
  //         const reference_id = result.reference_id
  //         const financial_months = result.financial_months
  //         const financial_years = result.financial_years
  //         const reportObservable = format === 'PDF'
  //           ? this.esgService.esg_individual_report(year,report_type,reference_id)
  //           : (result.year != null
  //             ? this.esgService.esg_individual_report(year, report_type,reference_id)
  //             : (result.financial_months != null && result.financial_years != null)
  //               // "Write  the financial month and financial year report api"
  //               ? (console.log("financial_months", financial_months))
  //               : this.esgService.esg_individual_report_financial_year(financial_years,financial_months, report_type,reference_id));
  //       }
  //     }
  //   )
  // }

  // print(data: any) {
  //   console.log(data, 'data');

  //   const dialogRef = this.dialog.open(ReportParameterComponent, {
  //     width: '400px',
  //     data: { data }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       const { year, reportType, format, reference_id, financial_months, financial_years } = result;

  //       let reportObservable;

  //       if (format === 'PDF') {
  //         reportObservable = this.esgService.esg_individual_report(year, reportType, reference_id);
  //       } else if (year != null) {
  //         reportObservable = this.esgService.esg_individual_report(year, reportType, reference_id);
  //       } else if (financial_months != null && financial_years != null) {
  //         reportObservable = this.esgService.esg_individual_report_financial_year(
  //           financial_years,
  //           financial_months,
  //           reportType,
  //           reference_id
  //         );
  //       } else {
  //         console.error("Missing required parameters for report generation.");
  //         return;
  //       }

  //       reportObservable.subscribe((response: any) => {
  //         const blobType = format === 'PDF'
  //           ? 'application/pdf'
  //           : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  //         const blob = new Blob([response], { type: blobType });
  //         const url = window.URL.createObjectURL(blob);
  //         // handle the response here
  //         console.log('Report generated:', response);
  //       }, (error: any) => {
  //         console.error('Report generation failed:', error);
  //       });
  //     }
  //   });
  // }

  // print(data: any) {
  //   const printBtn = document.getElementById(`${data.year}`);
  //   const loaderBtn = document.getElementById(`${data.year}_1`);
  //   if (printBtn && loaderBtn) {
  //     printBtn.classList.add('hide');
  //     loaderBtn.classList.remove('hide');
  //   }
  //   const dialogRef = this.dialog.open(ReportParameterComponent, {
  //     width: '400px',
  //     data: { data }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       const { year, reportType, format, reference_id, financial_months, financial_years } = result;
  //       let reportObservable;
  //       if (year) {
  //         if ((format === 'PDF') && (year !== null || year !== undefined)) {
  //           reportObservable = this.esgService.esg_individual_report(year, reportType, reference_id);
  //         }
  //       }
  //       else if (financial_months != null && financial_years != null) {
  //         reportObservable = this.esgService.esg_individual_report_financial_year(
  //           financial_months, reportType,reference_id, financial_years, 
  //         );
  //       } 
  //       else {
  //         console.error("Missing required parameters for report generation.");
  //         this.toggleLoaderButtons(data.year);
  //         return;
  //       }
  //       reportObservable.subscribe((response: any) => {
  //         const blobType = format === 'PDF'
  //           ? 'application/pdf'
  //           : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  //         const blob = new Blob([response], { type: blobType });
  //         const url = window.URL.createObjectURL(blob);
  //         window.open(url);
  //         this.toggleLoaderButtons(data.year);
  //       }, (error: any) => {
  //         console.error('Report generation failed:', error);
  //         this.toggleLoaderButtons(data.year);
  //       });
  //     } else {
  //       this.toggleLoaderButtons(data.year);
  //     }
  //   });
  // }


  print(data: any) {
    const printBtn = document.getElementById(`${data.year}`);
    const loaderBtn = document.getElementById(`${data.year}_1`);
    if (printBtn && loaderBtn) {
      printBtn.classList.add('hide');
      loaderBtn.classList.remove('hide');
    }

    const dialogRef = this.dialog.open(ReportParameterComponent, {
      width: '400px',
      data: { data }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { year, reportType, format, reference_id, financial_months, financial_years } = result;

        if (year && format === 'PDF') {
          this.esgService.esg_individual_report(year, reportType, reference_id).subscribe((response: any) => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
            this.toggleLoaderButtons(data.year);
          }, (error: any) => {
            console.error('PDF report generation failed:', error);
            this.toggleLoaderButtons(data.year);
          });

        } else if (year && format === 'Excel') {
          this.esgService.esg_report_excel(year, reportType).subscribe((response: any) => {
            const blob = new Blob([response], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
            this.toggleLoaderButtons(data.year);
          }, (error: any) => {
            console.error('Excel report generation failed:', error);
            this.toggleLoaderButtons(data.year);
          });

        } else if (financial_months != null && financial_years != null) {
          this.esgService.esg_individual_report_financial_year(
            financial_months, reportType, reference_id, financial_years
          ).subscribe((response: any) => {
            const blob = new Blob([response], { type: 'application/pdf' }); // Assuming PDF
            const url = window.URL.createObjectURL(blob);
            window.open(url);
            this.toggleLoaderButtons(data.year);
          }, (error: any) => {
            console.error('Financial year report generation failed:', error);
            this.toggleLoaderButtons(data.year);
          });

        } else {
          console.error("Missing required parameters for report generation.");
          this.toggleLoaderButtons(data.year);
        }
      } else {
        this.toggleLoaderButtons(data.year);
      }
    });
  }


  toggleLoaderButtons(year: string) {
    const printBtn = document.getElementById(`${year}`);
    const loaderBtn = document.getElementById(`${year}_1`);

    if (printBtn && loaderBtn) {
      printBtn.classList.remove('hide');
      loaderBtn.classList.add('hide');
    }
  }


}

