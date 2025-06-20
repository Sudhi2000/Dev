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
import { CreateComponent } from '../create/create.component';
import { ModifyComponent } from '../modify/modify.component';
import { ViewComponent } from '../view/view.component';
import { GeneralService } from 'src/app/services/general.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { error } from 'console';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isCreatedUser: Boolean
  esgRegister: any[] = []
  Alldivisions: any[] = []
  teamMemberReg: any;
  backToHistory: Boolean = false

  @Input()
  columns: ListColumn[] = [
    {
      name: 'Reference Number',
      property: 'referenceNumber',
      visible: true,
      isModelProperty: true,
    },
    {
      name: 'Year',
      property: 'yearData',
      visible: true,
      isModelProperty: true
    },
    {
      name: 'Month',
      property: 'monthData',
      visible: true,
      isModelProperty: true
    },
    {
      name: 'Progress',
      property: 'progressData',
      visible: true,
      isModelProperty: true,
    },
    {
      name: 'Status',
      property: 'statusData',
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
    this.configuration()
    this.filterForm = this.formBuilder.group({
      division: [''],
    })
  }

  //check organisation has access

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
        const status = result.esg_register
        if (status === false) {
          Swal.close()
          this.router.navigate(["/error/unauthorized"])
        }
        else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_esg_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
              // this.get_divisions();
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid]=' + elem.division_uuid)
                this.division_uuids.push(elem.division_uuid)
                this.divisions = result.profile.divisions
              })
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_esg_unit_specific_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_esg_register({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            // this.get_divisions();
          }

        }
      }
    })
  }
  get_esg_unit_specific_register(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.esgService.get_esg_unit_specific_register(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {
        const resultData = result.data[0].register.map((elem: any) => elem);
        this.Alldivisions = result.data[0].divisions[0].value

        this.esgRegister.splice(startIndex, endIndex, ...resultData);
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
        if ((!this.unitSpecific) || (this.unitSpecific && this.corporateUser)) {
          this.divisions = this.Alldivisions
        }
        this.isLoading = false;
        this.prepareView()
      }
    })
  }
  // get_divisions() {

  //   // const newArray =  this.Alldivisions.map(({ id, attributes }: { id: any, attributes: any }) => ({
  //   //   id: id as number,
  //   //   division_name: attributes.division_name,
  //   //   division_uuid: attributes.division_uuid
  //   // }));
  //   // this.divisions = newArray;
  //   this.divisions = this.Alldivisions
  // }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
 generate() {

  this.isLoading = true;
  const pageSize = this.pageSize;
  const startIndex = 0;

  const divisionSelected = this.filterForm.value.division?.length > 0;
  const hasSearchReference = !!this.searchReference;

  if (divisionSelected) {
    const division = this.filterForm.value.division
      .map((uuid: string) => `filters[divisions][division_uuid]=${uuid}`)
      .join('&');

    this.esgService.get_esg_division_search(this.searchReference, division, startIndex, pageSize).subscribe({
      next: (result: any) => {
        const data = result.data[0].register.map((elem: any) => elem);
        this.esgRegister = data;
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageSize;
          this.paginator.length = this.totalItems;
        });
      },
      error: () => this.router.navigate(["/error/internal"]),
      complete: () => {
        this.isLoading = false;
        this.prepareView();
      }
    });
  }

  // Case 2: Search reference present
  else if (hasSearchReference) {
    if (this.unitSpecific && !this.corporateUser) {
      // Unit-specific search with reference (non-corporate user)
      this.esgService.get_esg_unit_specific_search(this.searchReference, this.userDivision, startIndex, pageSize).subscribe({
        next: (result: any) => {
          const data = result.data[0].register.map((elem: any) => elem);
          this.esgRegister = data;
          this.totalItems = result.meta.pagination.total;
          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageSize;
            this.paginator.length = this.totalItems;
          });
        },
        error: () => this.router.navigate(["/error/internal"]),
        complete: () => {
          this.isLoading = false;
          this.prepareView();
        }
      });
    } else {
      // General search with reference (corporate user or not unit-specific)
      this.esgService.get_esg_search(this.searchReference, startIndex, pageSize).subscribe({
        next: (result: any) => {
          const data = result.data[0].register.map((elem: any) => elem);
          this.esgRegister = data;
          this.totalItems = result.meta.pagination.total;
          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageSize;
            this.paginator.length = this.totalItems;
          });
        },
        error: () => this.router.navigate(["/error/internal"]),
        complete: () => {
          this.isLoading = false;
          this.prepareView();
        }
      });
    }
  }

  // Case 3: Fallback to unit-specific division search
  else {
    this.esgService.get_esg_div_specific_search(this.userDivision, startIndex, pageSize).subscribe({
      next: (result: any) => {
        const data = result.data[0].register.map((elem: any) => elem);
        this.esgRegister = data;
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageSize;
          this.paginator.length = this.totalItems;
        });
      },
      error: () => this.router.navigate(["/error/internal"]),
      complete: () => {
        this.isLoading = false;
        this.prepareView();
      }
    });
  }
}

  reset() {
    this.filterForm.reset()
    this.searchReference = ''
    this.ngOnInit()
  }
  ESGDiv(event: any) {
    const selectedDivisionIds = event.value.map((division: any) => division.division_uuid);
    this.filterForm.controls['division'].setValue(selectedDivisionIds);
  }

  isCurrentUserInTeam(row: any): boolean {

    if (row.teamMemberData && this.currentUser) {
      return row.teamMemberData.some((member: any) => {
        return String(member.user_id) === String(this.currentUser);
      });
    }
    return false;
  }



  get_esg_register(pageEvent: PageEvent) {
    this.isLoading = true;

    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    this.esgService.esg_register(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {
        const resultData = result.data[0].register.map((elem: any) => elem);
        this.Alldivisions = result.data[0].divisions[0].value
        this.esgRegister.splice(startIndex, endIndex, ...resultData);
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        })
      },
      error: (err: any) => { },
      complete: () => {
        this.isLoading = false;
        if ((!this.unitSpecific) || (this.unitSpecific && this.corporateUser)) {
          this.divisions = this.Alldivisions
        }
        this.prepareView()
      },
    })
  }

  onPaginate(pageEvent: PageEvent) {
  this.isLoading = true;
  const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
  const pageSize = pageEvent.pageSize;

  const divisionSelected = this.filterForm.value.division?.length > 0;
  const hasSearchReference = !!this.searchReference;

  // Case 1: Division(s) selected
  if (divisionSelected) {
    const division = this.filterForm.value.division
      .map((uuid: string) => `filters[divisions][division_uuid]=${uuid}`)
      .join('&');

    this.esgService.get_esg_division_search(this.searchReference, division, startIndex, pageSize).subscribe({
      next: (result: any) => {
        const data = result.data[0].register.map((elem: any) => elem);
        this.esgRegister = data;
        this.totalItems = result.meta.pagination.total;

        setTimeout(() => {
          this.paginator.pageIndex = pageEvent.pageIndex;
          this.paginator.length = this.totalItems;
        });
      },
      error: () => this.router.navigate(["/error/internal"]),
      complete: () => {
        this.isLoading = false;
        this.prepareView();
      }
    });
  }

  // Case 2: Search reference present
  else if (hasSearchReference) {
    if (this.unitSpecific && !this.corporateUser) {
      // Search with reference for non-corporate unit-specific user
      this.esgService.get_esg_unit_specific_search(this.searchReference, this.userDivision, startIndex, pageSize).subscribe({
        next: (result: any) => {
          const data = result.data[0].register.map((elem: any) => elem);
          this.esgRegister = data;
          this.totalItems = result.meta.pagination.total;

          setTimeout(() => {
            this.paginator.pageIndex = pageEvent.pageIndex;
            this.paginator.length = this.totalItems;
          });
        },
        error: () => this.router.navigate(["/error/internal"]),
        complete: () => {
          this.isLoading = false;
          this.prepareView();
        }
      });
    } else {
      // General search for corporate or non-unit-specific user
      this.esgService.get_esg_search(this.searchReference, startIndex, pageSize).subscribe({
        next: (result: any) => {
          const data = result.data[0].register.map((elem: any) => elem);
          this.esgRegister = data;
          this.totalItems = result.meta.pagination.total;

          setTimeout(() => {
            this.paginator.pageIndex = pageEvent.pageIndex;
            this.paginator.length = this.totalItems;
          });
        },
        error: () => this.router.navigate(["/error/internal"]),
        complete: () => {
          this.isLoading = false;
          this.prepareView();
        }
      });
    }
  }

  // Case 3: Fallback to division-specific
  else {
    this.esgService.get_esg_div_specific_search(this.userDivision, startIndex, pageSize).subscribe({
      next: (result: any) => {
        const data = result.data[0].register.map((elem: any) => elem);
        this.esgRegister = data;
        this.totalItems = result.meta.pagination.total;

        setTimeout(() => {
          this.paginator.pageIndex = pageEvent.pageIndex;
          this.paginator.length = this.totalItems;
        });
      },
      error: () => this.router.navigate(["/error/internal"]),
      complete: () => {
        this.isLoading = false;
        this.prepareView();
      }
    });
  }
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
        const status = result.esg_create
        if (status === false) {
          Swal.close()
          this.router.navigate(["/error/unauthorized"])
        }
        else if (status === true) {
          this.dialog.open(CreateComponent, { disableClose: true, width: "800px" }).afterClosed().subscribe(data => {
            if (data) {
              this.formData = new FormData();
              this.formData.append('team_member_data', JSON.stringify(data.team_member_data))
              this.formData.append('form_value', JSON.stringify(data.form_value))

              this.esgService.esg_create(this.formData).subscribe({
                next: (result: any) => {
                  if (result.code === 200) {
                    Swal.close();
                    Swal.fire({
                      title: 'ESG Created',
                      imageUrl: 'assets/images/success.gif',
                      imageWidth: 250,
                      text: 'Successfully created ESG details.',
                      showCancelButton: false,
                    }).then((result) => {
                      Swal.close();
                      if (this.unitSpecific) {
                        if (this.corporateUser) {
                          this.get_esg_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                        } else if (!this.corporateUser) {
                          this.get_esg_unit_specific_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                        }
                      }
                      else {
                        this.get_esg_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                      }
                      this.ngOnInit()
                    });
                  }

                },
                error: (err: any) => {
                  Swal.close(); // Close loading popup
                  Swal.fire({
                    title: 'Error',
                    text: 'Failed to create esg. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                  });
                },
                complete: () => { }

              })

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

  action(data: any) {
    this.backToHistory = true
    const teams = data.teamMemberData
    this.authService.me().subscribe({
      next: (result: any) => {

        const status = result.esg_modify
        if (status === false) {
          Swal.close()
          this.router.navigate(["/error/unauthorized"])
        }
        else if (status === true) {
          if (!Array.isArray(teams)) {
            console.error('Error: data is not an array', teams);
            return;
          }
          const match = teams.find((element: any) => result.profile.id == element.user_id);
          if (match) {
            this.router.navigate(["apps/esg/disclosure/modify/" + data.referenceId]);
          } else {
            this.router.navigate(["/error/unauthorized"]);
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }
  view(data: any) {
    this.backToHistory = true
    const teams = data.teamMemberData
    this.authService.me().subscribe({
      next: (result: any) => {

        const status = result.esg_modify
        if (status === false) {
          Swal.close()
          this.router.navigate(["/error/unauthorized"])
        }
        else if (status === true) {
          if (!Array.isArray(teams)) {
            console.error('Error: data is not an array', teams);
            return;
          }
          const match = teams.find((element: any) => result.profile.id == element.user_id);
          if (match) {
            this.router.navigate(["apps/esg/disclosure/view/" + data.referenceId]);
          } else {
            this.router.navigate(["/error/unauthorized"]);
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }

  modify(data: any) {

    this.dialog.open(ModifyComponent, { width: "800px", data: data }).afterClosed().subscribe(data => {
      if (data) {

        Swal.close();
        Swal.fire({
          title: 'ESG details Modified',
          imageUrl: 'assets/images/success.gif',
          imageWidth: 250,
          text: 'Successfully modified ESG details.',
          showCancelButton: false,
          timer: 2000
        }).then((result) => {
          Swal.close();
          if (this.unitSpecific) {
            if (this.corporateUser) {
              this.get_esg_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            } else if (!this.corporateUser) {
              this.get_esg_unit_specific_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            this.get_esg_register({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          }
          this.ngOnInit()
        });

      }


    })
  }
  // view(data: any) {
  //   this.dialog.open(ViewComponent, { width: "800px", data: data }).afterClosed().subscribe(data => {

  //   })
  // }
  //  markAsReopened(data: any) {
  //     Swal.fire({
  //       title: 'Are you sure?',
  //       imageUrl: 'assets/images/confirm-1.gif',
  //       imageWidth: 250,
  //       text: `Please reconfirm that ${data.referenceNumber} has been reopened. If reopened, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to cancel the process.`,
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes, proceed!',
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         const id = data.id;
  //         // this.esgService.esg_reopen(id).subscribe({
  //         //   next: (result: any) => { },
  //         //   error: (err: any) => { },
  //         //   complete: () => {
  //         //     Swal.fire({
  //         //       title: 'ESG Reopened',
  //         //       imageUrl: 'assets/images/reported.gif',
  //         //       imageWidth: 250,
  //         //       text: `The ESG ${data.referenceNumber} has You have Reopened`,
  //         //       showCancelButton: false,
  //         //     });
  //         //     this.router.navigate(['/apps/audit-inspection/internal-audit/queue']);
  //         //   },
  //         // });
  //       }
  //       else {
  //         Swal.close()
  //       }
  //     });

  //   }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

}
