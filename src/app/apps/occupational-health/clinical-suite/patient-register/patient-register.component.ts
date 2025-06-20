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
import { FormControl, FormGroup } from '@angular/forms';
import { ReportParameterComponent } from './report-parameter/report-parameter.component';
import { MatDialog } from '@angular/material/dialog';
import { log } from 'console';
import { FeedbackComponent } from 'src/app/apps/grievance/feedback/feedback.component';
import { EmailComponent } from '../email/email.component';
import { SchedulerService } from 'src/app/services/scheduler.api.service';
import { GoToBooleanComponent } from './go-to-boolean/go-to-boolean.component';



@Component({
  selector: 'app-patient-register',
  templateUrl: './patient-register.component.html',
  styleUrls: ['./patient-register.component.scss']


})
export class PatientRegisterComponent implements OnInit {

  clinicalRegister: any[] = []
  orgID: string
  totalItems = 0;
  corporateUser: any
  subject$: ReplaySubject<clinical[]> = new ReplaySubject<clinical[]>(1);
  data$: Observable<clinical[]> = this.subject$.asObservable();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  customers: clinical[];
  @Input()
  columns: ListColumn[] = [

    { name: 'Patient ID', property: 'patient_id', visible: true, isModelProperty: true },
    { name: 'Employee ID', property: 'employee_id', visible: true, isModelProperty: true },
    { name: 'Employee Name', property: 'employee_name', visible: true, isModelProperty: true },
    { name: 'Division', property: 'division', visible: true, isModelProperty: true },
    { name: 'Gender', property: 'gender', visible: true, isModelProperty: true },
    { name: 'Age', property: 'age', visible: true, isModelProperty: true },
    { name: 'Health Issue Type', property: 'health_issue_type', visible: true },
    { name: 'Check In', property: 'check_in', visible: true, isModelProperty: true },
    { name: 'Check Out', property: 'check_out', visible: true, isModelProperty: true },

    { name: 'Follow Up Date', property: 'follow_up_date', visible: true, isModelProperty: true },
    { name: 'Consulting Doctor', property: 'consulting_doctor', visible: true, isModelProperty: true },
    //{ name: 'Disease', property: 'disease', visible: true, isModelProperty: true },

    { name: 'Status', property: 'patient_status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },


  ] as ListColumn[];
  pageSize = 10;
  isLoading = true;
  dataSource: MatTableDataSource<clinical>;
  unitSpecific: any
  userDivision: any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  readonly range = new FormGroup({
    start: new FormControl(null as Date | null),
    end: new FormControl(null as Date | null),
  });

  filterStatus: Boolean = false
  filterQuery: string = ''
  Division = new FormControl('')
  Status = new FormControl('')
  inputSearch = new FormControl('')
  statusList = ['Draft', 'Reconsultation', 'Completed', 'Pending'];
  selectedYears = new FormControl('')
  Year: any[] = [];

  divisions: any[] = []
  backToHistory: Boolean = false
  constructor(
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private clinicalService: ClinicalSuiteService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private scheduler: SchedulerService
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
      this.clinicalRegister = customers;
      this.dataSource.data = customers;
    });


  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {

        this.Year = result.data.attributes.Year
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

        const status = result.clin_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_clinical_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
              this.divisions = result.profile.divisions
            }
            else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              this.divisions = result.profile.divisions
              let results = divisions.join('&');
              this.userDivision = results
              const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
              this.get_unit_specific_clinical_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            const prevPageIndex = Number(localStorage.getItem('pageIndex')) || 0;
            this.get_clinical_history({ pageIndex: prevPageIndex, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_clinical_history(pageEvent: PageEvent) {
    this.isLoading = true;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    if (this.filterStatus) {
      this.clinicalService.get_division_date_filter(this.filterQuery, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          // const data = result.data.map((elem: any) => elem.attributes);
          // this.clinicalRegister.splice(startIndex, endIndex, ...data);
          const data = result.data.map((elem: any) => {
            const attributes = elem.attributes;

            const doctorAttrs = attributes?.consulting_doctor?.data?.attributes;

            if (doctorAttrs?.first_name || doctorAttrs?.last_name) {
              attributes.consulting_doctor = `${doctorAttrs.first_name ?? ''} ${doctorAttrs.last_name ?? ''}`.trim();
            } else {
              attributes.consulting_doctor = ''
            }

            return attributes;
          });

          this.clinicalRegister = data;
          this.totalItems = result.meta.pagination.total;
          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageEvent.pageSize;
            this.paginator.length = this.totalItems;
          })

        },
        error: (err: any) => {
          console.log("🚀 ~ PatientRegisterComponent ~ error ~ err:", err);
        },
        complete: () => {
          this.isLoading = false;
          this.prepareView()
        },
      });
    } else {
      this.clinicalService.get_clinical_history(startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {
          // const data = result.data.map((elem: any) => elem.attributes);
          //this.clinicalRegister.splice(startIndex, endIndex, ...data);
          const data = result.data.map((elem: any) => {
            const attributes = elem.attributes;

            const doctorAttrs = attributes?.consulting_doctor?.data?.attributes;

            if (doctorAttrs?.first_name || doctorAttrs?.last_name) {
              attributes.consulting_doctor = `${doctorAttrs.first_name ?? ''} ${doctorAttrs.last_name ?? ''}`.trim();
            } else {
              attributes.consulting_doctor = ''
            }

            return attributes;
          });

          this.clinicalRegister = data;
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
  get_unit_specific_clinical_history(pageEvent: PageEvent) {

    this.isLoading = true;
    localStorage.setItem('pageIndex', JSON.stringify(pageEvent.pageIndex));
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    if (this.filterStatus) {
      this.clinicalService.get_division_date_filter(this.filterQuery, startIndex, pageEvent.pageSize).subscribe({
        next: (result: any) => {


          // const data = result.data.map((elem: any) => elem.attributes);
          const data = result.data.map((elem: any) => {
            const attributes = elem.attributes;

            const doctorAttrs = attributes?.consulting_doctor?.data?.attributes;

            if (doctorAttrs?.first_name || doctorAttrs?.last_name) {
              attributes.consulting_doctor = `${doctorAttrs.first_name ?? ''} ${doctorAttrs.last_name ?? ''}`.trim();
            } else {
              attributes.consulting_doctor = ''
            }

            return attributes;
          });


          // this.clinicalRegister.splice(startIndex, endIndex, ...data);
          this.clinicalRegister = data;
          this.totalItems = result.meta.pagination.total;
          setTimeout(() => {
            this.paginator.pageIndex = startIndex / pageEvent.pageSize;
            this.paginator.length = this.totalItems;
          })

        },
        error: (err: any) => {
          console.log("🚀 ~ PatientRegisterComponent ~ error ~ err:", err);
        },
        complete: () => {
          this.isLoading = false;
          this.prepareView()
        },
      });
    } else {


      this.clinicalService.get_unit_specific_clinical_history(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
        next: (result: any) => {

          //const data = result.data.map((elem: any) => elem.attributes);
          const data = result.data.map((elem: any) => {
            const attributes = elem.attributes;

            const doctorAttrs = attributes?.consulting_doctor?.data?.attributes;

            if (doctorAttrs?.first_name || doctorAttrs?.last_name) {
              attributes.consulting_doctor = `${doctorAttrs.first_name ?? ''} ${doctorAttrs.last_name ?? ''}`.trim();
            } else {
              attributes.consulting_doctor = ''
            }

            return attributes;
          });


          // this.clinicalRegister.splice(startIndex, endIndex, ...data);
          this.clinicalRegister = data;



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

  print(data: any) {
    this.dialog.open(ReportParameterComponent, { width: '500px', data: { actionType: 'print' } }).afterClosed().subscribe((result) => {
      if (result.type === "Individual Report") {
        document.getElementById(data)?.classList.add("hide");
        document.getElementById(data + '_1')?.classList.remove("hide")
        this.clinicalService.get_clinical_reference(data).subscribe({
          next: (result: any) => {
            const id = result.data[0].id
            this.clinicalService.patient_report(id).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById(data)?.classList.remove("hide");
              document.getElementById(data + '_1')?.classList.add("hide")
            })
          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
      else if (result.type === "Lift Usage Report") {
        document.getElementById(data)?.classList.add("hide");
        document.getElementById(data + '_1')?.classList.remove("hide")
        this.clinicalService.get_clinical_reference(data).subscribe({
          next: (result: any) => {
            const id = result.data[0].id
            this.clinicalService.lift_usage_report_pdf(id).subscribe((response: any) => {
              let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              window.open(url)
              document.getElementById(data)?.classList.remove("hide");
              document.getElementById(data + '_1')?.classList.add("hide")
            })


          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
    })


  }
  statusButton(data: any) {
    const Resigned = "btn-warning"
    const Active = "btn-success"
    const Open = "btn-light"
    const draft = "btn-warning"
    const reconsultation = "btn-primary"

    if (data === "Completed") {
      return Active
    } else if (data === "Pending") {
      return Open
    } else if (data === "Draft") {
      return draft
    } else if (data === "Reconsultation") {
      return reconsultation
    }
    else {
      return
    }
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

  view(data: any) {
    this.backToHistory = true
    this.clinicalService.get_clinical_reference(data.patient_id).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/occupational-health/clinical-suite/view/" + result.data[0].id])
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })

  }
  modify(data: any) {
    this.backToHistory = true
    this.clinicalService.get_clinical_reference(data.patient_id).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/occupational-health/clinical-suite/modify/" + result.data[0].id])
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })


  }
  modifyReconsultation(data: any) {
    this.backToHistory = true

    this.clinicalService.get_clinical_reference(data.patient_id).subscribe({
      next: (result: any) => {
        this.router.navigate(["/apps/occupational-health/clinical-suite/patient-reconsultation/" + result.data[0].id])
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })


  }

  reconsultation(data: any) {
    console.log("data", data)
    this.dialog.open(GoToBooleanComponent, { width: '500px' }).afterClosed().subscribe((result) => {
      console.log("res", result)
      if (result === 'yes') {
        this.backToHistory = true
        this.clinicalService.get_clinical_suite_refe(data.patient_id).subscribe({
          next: (result: any) => {

            const clinicalSuiteData = result

            const medicalDetails = clinicalSuiteData.data[0].attributes.medicine_details.data
            const medicalPrescription = clinicalSuiteData.data[0].attributes.medical_prescriptions.data
            const medicalDetailsId = medicalDetails.map((data: any) => data.id)
            const medicalPrescriptionId = medicalPrescription.map((data: any) => data.id)


            this.clinicalService.create_patient_reconsultation(result.data[0], medicalDetailsId, medicalPrescriptionId).subscribe({
              next: (result: any) => {

                this.clinicalService.remove_data_clinical_suite(clinicalSuiteData.data[0]).subscribe({
                  next: (result: any) => {


                  }, error: (err: any) => { },
                  complete: () => {
                  }
                })
              },
              error: (err: any) => { },
              complete: () => {
                this.router.navigate(["/apps/occupational-health/clinical-suite/patient-reconsultation/" + result.data[0].id])
              }
            })



          },
          error: (err: any) => { },
          complete: () => { }
        })
      } else if (result === 'no') {
        this.backToHistory = true
        this.clinicalService.get_clinical_suite_refe(data.patient_id).subscribe({
          next: (result: any) => {

            const clinicalSuiteData = result

            const medicalDetails = clinicalSuiteData.data[0].attributes.medicine_details.data
            const medicalPrescription = clinicalSuiteData.data[0].attributes.medical_prescriptions.data
            const medicalDetailsId = medicalDetails.map((data: any) => data.id)
            const medicalPrescriptionId = medicalPrescription.map((data: any) => data.id)


            this.clinicalService.create_patient_reconsultation(result.data[0], medicalDetailsId, medicalPrescriptionId).subscribe({
              next: (result: any) => {

                this.clinicalService.remove_data_clinical_suite(clinicalSuiteData.data[0]).subscribe({
                  next: (result: any) => {


                  }, error: (err: any) => { },
                  complete: () => {
                    // clinicalSuiteData.data[0].attributes.medicine_details.data.map((data: any) => {
                    //   this.deletePrescription(data)
                    // })
                    // clinicalSuiteData.data[0].attributes.medical_prescriptions.data.map((data: any) => {
                    //   this.deletePrescription(data)
                    // })
                    // this.router.navigate(["/apps/occupational-health/clinical-suite/patient-reconsultation/" + result.data[0].id])
                  }
                })
              },
              error: (err: any) => { },
              complete: () => {
                this.router.navigate(["/apps/occupational-health/clinical-suite/patient-no-reconsultation/" + result.data[0].id])
              }
            })



          },
          error: (err: any) => { },
          complete: () => { }
        })

      }
    })

    // this.confirmation(data)
  }

  confirmation(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.backToHistory = true
        this.clinicalService.get_clinical_suite_refe(data.patient_id).subscribe({
          next: (result: any) => {

            const clinicalSuiteData = result

            const medicalDetails = clinicalSuiteData.data[0].attributes.medicine_details.data
            const medicalPrescription = clinicalSuiteData.data[0].attributes.medical_prescriptions.data
            const medicalDetailsId = medicalDetails.map((data: any) => data.id)
            const medicalPrescriptionId = medicalPrescription.map((data: any) => data.id)


            this.clinicalService.create_patient_reconsultation(result.data[0], medicalDetailsId, medicalPrescriptionId).subscribe({
              next: (result: any) => {

                this.clinicalService.remove_data_clinical_suite(clinicalSuiteData.data[0]).subscribe({
                  next: (result: any) => {


                  }, error: (err: any) => { },
                  complete: () => {
                    // clinicalSuiteData.data[0].attributes.medicine_details.data.map((data: any) => {
                    //   this.deletePrescription(data)
                    // })
                    // clinicalSuiteData.data[0].attributes.medical_prescriptions.data.map((data: any) => {
                    //   this.deletePrescription(data)
                    // })
                    // this.router.navigate(["/apps/occupational-health/clinical-suite/patient-reconsultation/" + result.data[0].id])
                  }
                })
              },
              error: (err: any) => { },
              complete: () => {
                this.router.navigate(["/apps/occupational-health/clinical-suite/patient-reconsultation/" + result.data[0].id])
              }
            })



          },
          error: (err: any) => { },
          complete: () => { }
        })

      } else {
        this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
      }

    })
  }

  deletePrescription(data: any) {
    this.clinicalService.delete_prescription(data.id).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {

      }
    })
  }

  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  create() {
    this.dialog.open(GoToBooleanComponent, { width: '500px' }).afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.router.navigate(["/apps/occupational-health/clinical-suite/create"])
      } else if (result === 'no') {
        this.router.navigate(["/apps/occupational-health/clinical-suite/create-non-consultation"])

      }
      else {
        this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
      }
    })



  }

  search() {
    let query = ''
    const selectedStartDate = this.range.controls.start.value ? new Date(this.range.controls.start.value) : null
    const selectedEndDate = this.range.controls.end.value ? new Date(this.range.controls.end.value) : null
    if (selectedStartDate && selectedEndDate) {

      const startDate = new Date(
        Date.UTC(
          selectedStartDate.getFullYear(),
          selectedStartDate.getMonth(),
          selectedStartDate.getDate(),
          0,
          0,
          0
        )
      ).toISOString();




      const endDate = new Date(
        Date.UTC(
          selectedEndDate.getFullYear(),
          selectedEndDate.getMonth(),
          selectedEndDate.getDate(),
          0, 0, 0
        )
      ).toISOString();

      if (startDate && endDate) {
        query += `filters[check_in_date][$gte]=${startDate}&filters[check_in_date][$lte]=${endDate}`;

      } else {
        query = ''
        return
      }
    } else {
      // return
    }

    if (this.Division.value.length > 0) {

      const divisionQuery = this.Division.value.map((data: any) => `&filters[business_unit][division_uuid][$in]=${data.division_uuid}`).join('')
      query += divisionQuery

    } else {
      // return
    }
    if (this.Status.value.length > 0) {


      const statusQuery = this.Status.value.map((data: any) => `&filters[patient_status]=${data}`).join('')
      query += statusQuery


    } else {
      // return
    }
    if (this.selectedYears.value.length > 0) {


      const sortedYears = this.selectedYears.value.sort((a: any, b: any) => a - b);
      const startYear = sortedYears[0];
      const endYear = sortedYears[sortedYears.length - 1];



      query += `&filters[year][$gte]=${startYear}&filters[year][$lte]=${endYear}`;

    }
    if (this.inputSearch.value.length > 0) {

      const data = this.inputSearch.value


      query += `&filters[$or][0][consulting_doctor][first_name][$containsi]=${data}&` +
        `filters[$or][1][consulting_doctor][last_name][$containsi]=${data}`

    }

    if (query.length === 0) {
      return
    } else {
      if (this.Division.value.length <= 0) {
        if (!this.corporateUser) {
          query += `&${this.userDivision}`
        }
      }
    }
    this.filterQuery = query




    this.clinicalService.get_division_date_filter(query, 0, 10).subscribe({

      next: (result: any) => {
        this.isLoading = true;
        // const data = result.data.map((elem: any) => elem.attributes);
        const data = result.data.map((elem: any) => {
          const attributes = elem.attributes;

          const doctorAttrs = attributes?.consulting_doctor?.data?.attributes;

          if (doctorAttrs?.first_name || doctorAttrs?.last_name) {
            attributes.consulting_doctor = `${doctorAttrs.first_name ?? ''} ${doctorAttrs.last_name ?? ''}`.trim();
          } else {
            attributes.consulting_doctor = ''
          }

          return attributes;
        });


        // this.clinicalRegister.splice(startIndex, endIndex, ...data);
        this.clinicalRegister = data;
        this.totalItems = result.meta.pagination.total;
        this.filterStatus = true
        setTimeout(() => {
          //this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        })

      },
      error: (err: any) => {
        console.log("🚀 ~ PatientRegisterComponent ~ error ~ err:", err);
      }, complete: () => {
        this.isLoading = false;
        this.prepareView()
      },
    });



  }
  reset() {

    this.filterStatus = false
    this.range.controls.end.setValue(null)
    this.range.controls.start.setValue(null)
    this.Division.setValue('')
    this.Status.setValue('')
    this.selectedYears.setValue('')
    this.inputSearch.setValue('')
    if (this.corporateUser) {
      this.get_clinical_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
    } else {
      this.get_unit_specific_clinical_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
    }


  }

  generateReport() {
    this.dialog.open(ReportParameterComponent, { width: "740px", disableClose: true, data: { actionType: 'generate' } }).afterClosed().subscribe(data => {
      if (data) {
        if (data.report_type === "Register Report") {
          let parameter: any = []

          if (data.startDate && data.endDate && data.division) {

            const start_date = new Date(data.startDate);
            const startDate = start_date.toISOString().split('T')[0]; // Output: "2025-01-01"
            const end_date = new Date(data.endDate);
            const endDate = end_date.toISOString().split('T')[0]; // Output: "2025-01-01"

            parameter.push({
              check_start_date: startDate,
              check_end_date: endDate,
              division: data?.division,
              company_name: data?.company_name,
              reporting_person: data?.reporting_person,
              reporting_email: data?.reporting_email
            })

            document.getElementById('patient_register_report')?.classList.add("hide");
            document.getElementById('patient_register_report_loader')?.classList.remove("hide")
            if (data.format === "PDF") {
              this.clinicalService.patient_register_report_pdf(parameter[0]).subscribe((response: any) => {
                let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                window.open(url)
                document.getElementById('patient_register_report_loader')?.classList.add("hide");
                document.getElementById('patient_register_report')?.classList.remove("hide")
              })
            } else if (data.format === "Excel") {
              this.clinicalService.patient_register_report_excel(parameter[0]).subscribe((response: any) => {
                let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                window.open(url)
                document.getElementById('patient_register_report_loader')?.classList.add("hide");
                document.getElementById('patient_register_report')?.classList.remove("hide")
              })
            }

          } else if (data.startDate && data.endDate && !data.division) {

            const start_date = new Date(data.startDate);
            const startDate = start_date.toISOString().split('T')[0]; // Output: "2025-01-01"

            const end_date = new Date(data.endDate);
            const endDate = end_date.toISOString().split('T')[0]; // Output: "2025-01-01"

            // if (data.company_name !== '') {

            parameter.push({
              check_start_date: startDate,
              check_end_date: endDate,
              // division: data?.division,
              company_name: data?.company_name,
              reporting_person: data?.reporting_person,
              reporting_email: data?.reporting_email
            })

            // } else {
            //   parameter.push({
            //     check_start_date: startDate,
            //     check_end_date: endDate,
            //     // division: data?.division,
            //     company_name: '',
            //     reporting_person: data?.reporting_person,
            //     reporting_email: data?.reporting_email
            //   })
            // }


            document.getElementById('patient_register_report')?.classList.add("hide");
            document.getElementById('patient_register_report_loader')?.classList.remove("hide")
            if (data.format === "PDF") {
              this.clinicalService.patient_register_report_pdf_2(parameter[0]).subscribe((response: any) => {
                let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                window.open(url)
                document.getElementById('patient_register_report_loader')?.classList.add("hide");
                document.getElementById('patient_register_report')?.classList.remove("hide")
              })
            } else if (data.format === "Excel") {
              this.clinicalService.patient_register_report_excel_2(parameter[0]).subscribe((response: any) => {
                let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                window.open(url)
                document.getElementById('patient_register_report_loader')?.classList.add("hide");
                document.getElementById('patient_register_report')?.classList.remove("hide")
              })
            }
          }
        }
        else if (data.report_type === "Patient Referral Report") {

          let parameter: any = []

          if (data.startDate && data.endDate && data.division) {

            const start_date = new Date(data.startDate);
            const startDate = start_date.toISOString().split('T')[0]; // Output: "2025-01-01"
            const end_date = new Date(data.endDate);
            const endDate = end_date.toISOString().split('T')[0]; // Output: "2025-01-01"

            parameter.push({
              check_start_date: startDate,
              check_end_date: endDate,
              division: data?.division,
              company_name: data?.company_name,
              reporting_person: data?.reporting_person,
              reporting_email: data?.reporting_email
            })

            document.getElementById('patient_register_report')?.classList.add("hide");
            document.getElementById('patient_register_report_loader')?.classList.remove("hide")
            if (data.format === "PDF") {
              this.clinicalService.patient_referral_register_report_pdf(parameter[0]).subscribe((response: any) => {
                let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                window.open(url)
                document.getElementById('patient_register_report_loader')?.classList.add("hide");
                document.getElementById('patient_register_report')?.classList.remove("hide")
              })
            } else if (data.format === "Excel") {
              this.clinicalService.patient_referral_register_report_excel(parameter[0]).subscribe((response: any) => {
                let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                window.open(url)
                document.getElementById('patient_register_report_loader')?.classList.add("hide");
                document.getElementById('patient_register_report')?.classList.remove("hide")
              })
            }

          } else if (data.startDate && data.endDate && !data.division) {

            const start_date = new Date(data.startDate);
            const startDate = start_date.toISOString().split('T')[0]; // Output: "2025-01-01"
            const end_date = new Date(data.endDate);
            const endDate = end_date.toISOString().split('T')[0]; // Output: "2025-01-01"

            // if (data.company_name !== '') {

            parameter.push({
              check_start_date: startDate,
              check_end_date: endDate,
              // division: data?.division,
              company_name: data?.company_name,
              reporting_person: data?.reporting_person,
              reporting_email: data?.reporting_email
            })

            // } else {
            //   parameter.push({
            //     check_start_date: startDate,
            //     check_end_date: endDate,
            //     // division: data?.division,
            //     company_name: '',
            //     reporting_person: data?.reporting_person,
            //     reporting_email: data?.reporting_email
            //   })
            // }


            document.getElementById('patient_register_report')?.classList.add("hide");
            document.getElementById('patient_register_report_loader')?.classList.remove("hide")
            if (data.format === "PDF") {
              this.clinicalService.patient_referral_register_report_pdf_2(parameter[0]).subscribe((response: any) => {
                let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                window.open(url)
                document.getElementById('patient_register_report_loader')?.classList.add("hide");
                document.getElementById('patient_register_report')?.classList.remove("hide")
              })
            } else if (data.format === "Excel") {
              this.clinicalService.patient_referral_register_report_excel_2(parameter[0]).subscribe((response: any) => {
                let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                window.open(url)
                document.getElementById('patient_register_report_loader')?.classList.add("hide");
                document.getElementById('patient_register_report')?.classList.remove("hide")
              })
            }
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
  feedback(data: any) {


    this.clinicalService.get_clinical_reference(data.patient_id).subscribe({
      next: (response: any) => {
        const id = response?.data?.[0]?.id;

        if (!id) {
          console.error("No clinical reference ID found.");
          return;
        }

        // Open feedback dialog
        this.dialog.open(FeedbackComponent).afterClosed().subscribe({
          next: (dialogData: any) => {


            if (!dialogData) return;

            // Call update_feedback with dialog data and reference ID
            this.clinicalService.update_feedback(dialogData, id).subscribe({
              next: (result: any) => {
                Swal.fire({
                  title: 'Feedback Updated',
                  imageUrl: "assets/images/success.gif",
                  imageWidth: 250,
                  text: "You have successfully updated a feedback.",
                  showCancelButton: false,
                });
              },
              error: (err: any) => {
                console.error("Error updating feedback:", err);
                this.router.navigate(["/error/internal"]);
              },
              complete: () => {

                if (this.unitSpecific) {
                  if (this.corporateUser) {

                    this.get_clinical_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                  } else if (!this.corporateUser) {
                    this.get_unit_specific_clinical_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                  }
                }
                else {
                  this.get_clinical_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
                }

              }
            });
          },
          error: (dialogErr) => {
            console.error("Error in dialog afterClosed subscription:", dialogErr);
          },
          complete: () => {
            console.log("Dialog interaction complete.");
          }
        });
      },
      error: (err: any) => {
        console.error("Error fetching clinical reference:", err);
        this.router.navigate(["/error/internal"]);
      },
      complete: () => {
        console.log("Completed fetching clinical reference.");
      }
    });
  }

  email(data: any) {
    console.log("🚀 ~ PatientRegisterComponent ~ email ~ data:", data)
    this.dialog.open(EmailComponent, { width: "50%" }).afterClosed().subscribe((emailData: any) => {
      console.log("🚀 ~ PatientRegisterComponent ~ this.dialog.open ~ emailData:", emailData)


      this.scheduler.create_clinical_suite_schedule(data.patient_id, emailData.to_email).subscribe({
        next: (result: any) => {
          console.log("🚀 ~ PatientRegisterComponent ~ this.scheduler.create_clinical_suite_schedule ~ result:", result)


        },
        error: (err: any) => {
          console.log("🚀 ~ PatientRegisterComponent ~ this.scheduler.create_clinical_suite_schedule ~ err:", err)
          const statusText = "Internal Error"
          this._snackBar.open(statusText, 'Close', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        },
        complete: () => {
          Swal.fire({
            title: 'Email Notification',
            imageUrl: "assets/images/email.png",
            imageWidth: 250,
            text: "You have successfully initiated the email notification. The recipient will receive an email notification shortly.",
            showCancelButton: false,

          })
        }
      })

    })

  }
}