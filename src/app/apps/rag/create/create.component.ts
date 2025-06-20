import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { RagService } from 'src/app/services/rag.api.service';
import { NewDepartmentComponent } from 'src/app/apps/general-component/new-department/new-department.component';
import { NewDesignationComponent } from '../../general-component/new-designation/new-designation.component';
import { NewFunctionComponent } from '../../general-component/new-function/new-function.component';
import { NewCountryComponent } from '../../general-component/new-country/new-country.component';
import { NewStateComponent } from '../../general-component/new-state/new-state.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateComponent implements OnInit {

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 5,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;
  Division = new FormControl(null, [Validators.required]);
  userList: any
  files: File[] = [];
  imglnk: any = environment.client_backend + '/uploads/'
  format: any = ".png"
  evidenceCount: number = 0
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  employeeType: any[] = [];
  genderData: any[] = [];
  tenureSplit: any[] = [];
  sourceOfHiring: any[] = [];
  employmentType: any[] = [];
  categoryList: any[] = [];
  filterStates: any[] = []
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  divisions: any[] = []
  functions: any[] = []
  departments: any[] = []
  designations: any[] = []
  countries: any[] = []
  states: any[] = []
  birthdate = new FormControl(null, [Validators.required]);
  joindate = new FormControl(null, [Validators.required]);
  minor: boolean = false
  evidenceFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  dropdownValues: any
  userDivision: any
  corporateUser: any
  unitSpecific: any
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
      ],
    },
  }

  timeline = new FormGroup({
    start_timeline: new FormControl(),
    end_timeline: new FormControl()
  });
  constructor(private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private ragService: RagService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateComponent>) {
  }

  ngOnInit(): void {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      reporter: [''],
      division: ['', [Validators.required]],
      business_unit: [null],
      reference_number: [''],
      reported_date: [new Date()],
      category: ['', [Validators.required]],
      employee_type: ['', [Validators.required]],
      status: ['Active'],
      employee_id: ['', [Validators.required]],
      employee_name: [null, [Validators.required]],
      gender: ['', [Validators.required]],
      age: [null, [Validators.required, Validators.min(18)]],
      date_of_birth: ['', [Validators.required]],
      date_of_join: [null, [Validators.required]],
      employment_type: ['', [Validators.required]],
      service_period: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      function: [''],
      reporting_manager: ['', [Validators.required]],
      source_of_hiring: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      origin: ['', [Validators.required]],
      discussion_summary: ['', [Validators.required]],
      remarks: [''],
      tenure_split: ['', [Validators.required]],
      rag: [''],
      age_group: ['']
    });
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
              this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
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
        const status = result.rag_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_dropdown_values()
          this.get_department()
          this.get_designation()
          this.get_function()
          this.get_country()
          this.get_state()
          // this.get_division()

          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_division();
              this.get_profiles();
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_profiles();

            }
          } else {
            this.get_division();
            this.get_profiles();
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_division() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
        }));

        this.divisions = newArray;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }
  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((person: any) => person.attributes.user?.data?.attributes?.blocked === false);

        this.userList = filteredData;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }
  get_unit_specific_profiles() {
    this.authService.get_unit_specific_profiles(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((person: any) => person.attributes.user?.data?.attributes?.blocked === false);

        this.userList = filteredData;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }
  BusinessUnit(event: any) {
    this.Form.controls['division'].setValue(event.value.division_name)
    this.Form.controls['business_unit'].setValue(event.value.id)
  }
  birthDate(data: any) {
    this.Form.controls['date_of_birth'].setValue(new Date(data.value))
    const birthDate = new Date(data.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age >= 18) {
      this.minor = false
      this.Form.controls['age'].setValue(age)
      this.Form.controls['age'].disable()

      if (age >= 18 && age <= 25) {
        this.Form.controls['age_group'].setValue('18 -25')
      } else if (age > 25 && age <= 30) {
        this.Form.controls['age_group'].setValue('26-30')
      } else if (age > 30 && age <= 35) {
        this.Form.controls['age_group'].setValue('31-35')
      } else if (age > 35 && age <= 40) {
        this.Form.controls['age_group'].setValue('36-40')
      } else if (age > 40 && age <= 45) {
        this.Form.controls['age_group'].setValue('41-45')
      } else if (age > 45 && age <= 50) {
        this.Form.controls['age_group'].setValue('46-50')
      } else if (age > 50) {
        this.Form.controls['age_group'].setValue('Above 51')
      }


    } else {
      this.minor = true
      this.Form.controls['age'].setValue('')
    }

  }
  joinDate(data: any) {
    this.Form.controls['date_of_join'].setValue(new Date(data.value))
    const date = new Date()
    const doj = new Date(data.value)
    const differ = Number(date) - Number(doj)
    const year = new Date(differ).getUTCFullYear() - 1970
    const month = new Date(differ).getUTCMonth()
    const days = new Date(differ).getUTCDate()
    const servicePeriod = year + " Years, " + month + " Months, " + days + " Days"
    this.Form.controls['service_period'].setValue(servicePeriod)
    this.Form.controls['service_period'].disable()

    if (year === 0 && month >= 0 && month <= 6) {
      this.Form.controls['tenure_split'].setValue('0-6 Months')
    } else if (year === 0 && month >= 7 && month <= 12) {
      this.Form.controls['tenure_split'].setValue('7-12 Months')
    } else if (year >= 1 && month >= 0 && year < 2) {
      this.Form.controls['tenure_split'].setValue('1-2 Years')
    } else if (year >= 2 && month >= 0 && year < 3) {
      this.Form.controls['tenure_split'].setValue('2-3 Years')
    } else if (year >= 3 && month >= 0 && year < 4) {
      this.Form.controls['tenure_split'].setValue('3-4 Years')
    } else if (year >= 4 && month >= 0 && year < 5) {
      this.Form.controls['tenure_split'].setValue('4-5 Years')
    } else if (year >= 5) {
      this.Form.controls['tenure_split'].setValue('Above 5 Years')
    }
    this.Form.controls['tenure_split'].disable()




  }
  categoryEvent(category: any) {
    console.log(category)
    this.Form.controls['rag'].setValue(category.attributes.badge)

  }
  //get dropdown values
  get_dropdown_values() {
    const module = "General"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (generalResult: any) => {
        //Gender
        const gender = generalResult.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Gender")
        })
        this.genderData = gender

        //Tenure Split
        const tenure = generalResult.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Tenure Split")
        })
        this.tenureSplit = tenure

        const socialModule = "Social Apps"
        this.generalService.get_dropdown_values(socialModule).subscribe({
          next: (socialResult: any) => {
            // Employee Type
            const type = socialResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Employee Type")
            })
            this.employeeType = type

            //Source of Hiring
            const source = socialResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Source Of Hiring")
            })

            this.sourceOfHiring = source

            //Employment Type
            const employment = socialResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Employment Type")
            })

            this.employmentType = employment

            //Category
            const category = socialResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Category")
            })
            this.categoryList = category

          },
          error: (err: any) => { },
          complete: () => { }
        })
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_department() {
    this.generalService.get_department().subscribe({
      next: (result: any) => {

        this.departments = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  new_name() {

    this.dialog.open(NewDepartmentComponent).afterClosed().subscribe((data: any) => {

      const name = data.name
      this.generalService.create_department(name, this.Form.value.reporter).subscribe({
        next: (result: any) => {
          this.generalService.get_department().subscribe({
            next: (result: any) => {
              this.departments = result.data
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              const statusText = "Department created successfully"
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.Form.controls['department'].setValue(result.data.attributes.department_name)
            }
          })

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })

    })


  }
  get_designation() {
    this.generalService.get_designation().subscribe({
      next: (result: any) => {

        this.designations = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  new_designation() {

    this.dialog.open(NewDesignationComponent).afterClosed().subscribe((data: any) => {

      const name = data.name
      this.generalService.create_designation(name, this.Form.value.reporter).subscribe({
        next: (result: any) => {
          this.generalService.get_designation().subscribe({
            next: (result: any) => {
              this.designations = result.data
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              const statusText = "Designation created successfully"
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.Form.controls['designation'].setValue(result.data.attributes.designation)
            }
          })

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })

    })


  }
  get_function() {
    this.generalService.get_function().subscribe({
      next: (result: any) => {

        this.functions = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  new_function() {

    this.dialog.open(NewFunctionComponent).afterClosed().subscribe((data: any) => {

      const name = data.name
      this.generalService.create_function(name, this.Form.value.reporter).subscribe({
        next: (result: any) => {
          this.generalService.get_function().subscribe({
            next: (result: any) => {
              this.functions = result.data
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              const statusText = "Function created successfully"
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.Form.controls['function'].setValue(result.data.attributes.function_name)
            }
          })

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })

    })


  }
  get_country() {
    this.generalService.get_country().subscribe({
      next: (result: any) => {

        this.countries = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  new_country() {

    this.dialog.open(NewCountryComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const name = data.name
        this.generalService.create_country(name, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.generalService.get_country().subscribe({
              next: (result: any) => {

                this.countries = result.data


              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "New country created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['country'].setValue(result.data.attributes.country_name)
              }
            })

          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })

      }



    })


  }
  getStates(data: any) {
    const country = data.value
    const category = this.states.filter(function (elem: any) {
      return (elem.attributes.country === country)
    })
    this.filterStates = category.map(element => element.attributes.state_name)
  }
  get_state() {
    this.generalService.get_state().subscribe({
      next: (result: any) => {

        this.states = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  new_state() {
    if (this.Form.value.country) {
      let countryname
      this.dialog.open(NewStateComponent, { data: countryname = this.Form.value.country }).afterClosed().subscribe((data: any) => {

        const name = data.name
        const country = data.country
        this.generalService.create_state(name, country, this.Form.value.reporter).subscribe({
          next: (result: any) => {

            this.generalService.get_state().subscribe({
              next: (result: any) => {

                this.states = result.data

                const category = this.states.filter(function (elem: any) {
                  return (elem.attributes.country === country)
                })

                this.filterStates = category.map(element => element.attributes.state_name)
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "New State created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });

                this.Form.controls['state'].setValue(result.data.attributes.state_name)



              }
            })

          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })

      })
    }
    else {
      const statusText = "Please select the country"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }


  }
  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }
  ragStatus(data: any) {
    const Red = "btn-danger"
    const Amber = "btn-warning"
    const Green = "btn-success"
    if (data === "Green") {
      return Green
    } else if (data === "Amber") {
      return Amber
    }
    else if (data === "Red") {
      return Red
    } else {
      return
    }
  }
  //confirm to create the transaction
  submit() {
    const formStatus = this.Form.valid
    this.Form.controls['service_period'].enable()
    this.Form.controls['tenure_split'].enable()

    if (formStatus) {
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
          this.create_reference_number()
        }
      })
    } else if (!formStatus) {
      const statusText = "Please fill all mandatory fields"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  //create reference
  create_reference_number() {
    this.ragService.get_rag_count().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = 'RAG-' + newCount
        this.Form.controls['reference_number'].setValue(reference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_rag()
      }
    })
  }

  //create accident
  create_rag() {
    this.Form.controls['age'].enable()

    this.ragService.create_rag(this.Form.value).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'RAG Details Created',
          imageUrl: "assets/images/rag.gif",
          imageWidth: 250,
          text: "You have successfully added a rag details.",
          showCancelButton: false,
        })
        this.dialogRef.close()

      }
    })
  }

}