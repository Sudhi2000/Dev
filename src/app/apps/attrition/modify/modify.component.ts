import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, Observable, of, startWith } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NewDepartmentComponent } from '../../general-component/new-department/new-department.component';
import { NewDesignationComponent } from '../../general-component/new-designation/new-designation.component';
import { NewFunctionComponent } from '../../general-component/new-function/new-function.component';
import { NewCountryComponent } from '../../general-component/new-country/new-country.component';
import { NewStateComponent } from '../../general-component/new-state/new-state.component';
import { NewResignationTypeComponent } from '../new-resignation-type/new-resignation-type.component';
import { AttritionService } from 'src/app/services/attrition.api.service';
import { Location } from '@angular/common';
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
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ModifyComponent implements OnInit {

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 5,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;




  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  genderData: any[] = [];
  tenureSplit: any[] = [];
  sourceOfHiring: any[] = [];
  employmentType: any[] = [];
  employmentClass: any[] = [];
  resigneddate = new FormControl(null, [Validators.required]);
  relieveddate = new FormControl(null, [Validators.required]);
  resignationTypes: any[] = []
  filterStates: any[] = []
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  divisions: any[] = []
  peopleList: any[] = [];
  Division = new FormControl(null, [Validators.required]);
  functions: any[] = []
  departments: any[] = []
  designations: any[] = []
  countries: any[] = []
  backToHistory: Boolean = false
  filteredEmployType: any[] = []
  filteredDepatureReason: Observable<any[]>;
  Depature_Reason = new FormControl('', { validators: [Validators.required] });
  states: any[] = []
  joindate = new FormControl(null, [Validators.required]);
  minor: boolean = false
  evidenceFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  dropdownValues: any
  unitSpecific: any
  corporateUser: any
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
    private attritionService: AttritionService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar, private _location: Location) {
  }

  ngOnInit(): void {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      reporter: [''],
      reference_number: [''],
      reported_date: [new Date()],
      //status: ['Active'],
      employee_id: ['', [Validators.required]],
      employee_name: [null, [Validators.required]],
      gender: ['', [Validators.required]],
      date_of_join: [null, [Validators.required]],
      relieved_date: [null, [Validators.required]],
      resigned_date: [null, [Validators.required]],
      division: ['', [Validators.required]],
      employment_type: ['', [Validators.required]],
      service_period: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      // resigned_designation: ['', [Validators.required]],
      employment_classification: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      resignation_reason: ['', [Validators.required]],
      tenure_split: ['', [Validators.required]],
      per_day_salary: [null],
      hostel_access: [false, [Validators.required]],
      work_history: [false, [Validators.required]],
      normal_resignation: [false, [Validators.required]],
      resignation_type: ['', [Validators.required]],
      business_unit: [''],
      status: [''],
      created_user: [null],
      responsible_person:[null],
      responsible_person_notification:[null]


    });
    this.Depature_Reason.valueChanges.subscribe(value => {

      if (value == "") {
        this.filteredDepatureReason = this.Depature_Reason.valueChanges.pipe(
          startWith(''),
          map(value => this._filterDepatureReason(value))
        );
      }
      else {
        this._filterDepatureReason(value)
      }
    })





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
        const status = result.attrition_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_profiles()
          this.get_dropdown_values()
          this.get_department()
          this.get_designation()
          this.get_function()
          this.get_country()
          this.get_state()
          this.get_resignation_type()
          this.get_attrition_details()

          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions()
            } else if (!this.corporateUser) {
              result.profile.divisions.forEach((elem: any) => {
                this.divisions.push(elem)
              })


            }
          } else {
            this.get_divisions();
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  //Get Attrition detials
  get_attrition_details() {
    const reference = this.route.snapshot.paramMap.get('id');

    this.attritionService.get_attrition_details(reference).subscribe({
      next: (result: any) => {

        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = false;
        if (this.divisions && this.divisions.length > 0) {

          matchFound = this.divisions.some(uuid => uuid.division_uuid === divisionUuidFromResponse);


        }

        if (result.data[0].attributes.status === "Draft" && matchFound) {
          this.Form.controls['employee_name'].setValue(result.data[0].attributes.employee_name)
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
          this.Form.controls['resignation_reason'].setValue(result.data[0].attributes.resignation_reason)
          this.Form.controls['country'].setValue(result.data[0].attributes.country)
          this.Form.controls['relieved_date'].setValue(result.data[0].attributes.relieved_date)
          this.Form.controls['resigned_date'].setValue(result.data[0].attributes.resigned_date)
          this.Form.controls['date_of_join'].setValue(result.data[0].attributes.date_of_join)
          this.Form.controls['department'].setValue(result.data[0].attributes.department)
          this.Form.controls['designation'].setValue(result.data[0].attributes.designation)
          this.Form.controls['per_day_salary'].setValue(result.data[0].attributes.per_day_salary)
          this.Form.controls['employee_id'].setValue(result.data[0].attributes.employee_id)
          this.Form.controls['division'].setValue(result.data[0].attributes.division)
          this.Form.controls['work_history'].setValue(result.data[0].attributes.work_history)
          this.Form.controls['hostel_access'].setValue(result.data[0].attributes.hostel_access)
          this.Form.controls['gender'].setValue(result.data[0].attributes.gender)
          this.Form.controls['normal_resignation'].setValue(result.data[0].attributes.normal_resignation)
          this.Form.controls['resignation_type'].setValue(result.data[0].attributes.resignation_type)
          this.Form.controls['service_period'].setValue(result.data[0].attributes.service_period)
          this.Form.controls['state'].setValue(result.data[0].attributes.state)
          this.Form.controls['tenure_split'].setValue(result.data[0].attributes.tenure_split)
          this.Form.controls['employment_classification'].setValue(result.data[0].attributes.employment_classification)
          this.Form.controls['employment_type'].setValue(result.data[0].attributes.employment_type)
          const employementType = this.employmentType.filter(function (elem: any) {
            return (elem.attributes.filter === result.data[0].attributes.employment_classification)
          })
          this.filteredEmployType = employementType
         
          this.Form.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
          this.Form.controls['created_user'].setValue(result.data[0].attributes.created_user.data.id)
          this.Form.controls['responsible_person'].setValue(result.data[0].attributes.responsible_person.data?.id)


          const selectedDivisions = result.data[0].attributes.division




          const filteredDivision = this.divisions.filter((data) => data.division_name === selectedDivisions
          )




          this.Division.setValue(filteredDivision[0])
          this.Form.controls['business_unit'].setValue(filteredDivision[0].id)
          this.joindate.setValue(result.data[0].attributes.date_of_join)
          this.relieveddate.setValue(result.data[0].attributes.relieved_date)
          this.resigneddate.setValue(result.data[0].attributes.resigned_date)
          this.Depature_Reason.setValue(result.data[0].attributes.resignation_type)
        } else {
          this.router.navigate(["/apps/attrition/history"])

        }



      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const country = this.Form.controls['country']
        this.getStates(country)


      }
    })
  }
  resignedDate(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['resigned_date'].setValue(newDate)

  }
  get_profiles() {
    this.authService.get_profiles(this.Form.value.org_id).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter(
          (profile: any) =>
            profile.attributes.user?.data?.attributes?.blocked === false
        );
        this.peopleList = filteredData;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }

  relievedDate(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['relieved_date'].setValue(newDate)
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

  }

  //get dropdown values
  get_dropdown_values() {
    const module = "General"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (generalResult: any) => {
        // this.dropdownValues = result.data
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

            //Employment Classification
            const classification = socialResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Employment Classification")
            })

            this.employmentClass = classification
          },
          error: (err: any) => { },
          complete: () => { }
        })
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  onClassSelection(event: any) {
    this.Form.controls['employment_type'].reset()
    const employementType = this.employmentType.filter(function (elem: any) {
      return (elem.attributes.filter === event.value)
    })
    this.filteredEmployType = employementType
  }

  BusinessUnit(event: any) {
    this.Form.controls['division'].setValue(event.value.division_name)
    this.Form.controls['business_unit'].setValue(event.value.id)
  }

  get_resignation_type() {
    this.attritionService.get_resignation_type().subscribe({
      next: (result: any) => {


        this.resignationTypes = result.data.sort((a: any, b: any) => a.attributes.type?.localeCompare(b.attributes.type));
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  new_resignation_type() {

    this.dialog.open(NewResignationTypeComponent).afterClosed().subscribe((data: any) => {

      const name = data.name
      this.attritionService.create_resignation_type(name, this.Form.value.reporter).subscribe({
        next: (result: any) => {
          this.attritionService.get_resignation_type().subscribe({
            next: (result: any) => {
              this.resignationTypes = result.data.sort((a: any, b: any) => a.attributes.type.localeCompare(b.attributes.type));
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              const statusText = "Reason for Departure created successfully"
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.Form.controls['resignation_type'].setValue(result.data.attributes.type)
              this.Depature_Reason.setValue(result.data.attributes.type)
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
  //get divisions
  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {



        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
          division_uuid: attributes.division_uuid,
        }));

        this.divisions = newArray;


      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
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
  new_resigned_designation() {

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
              this.Form.controls['resigned_designation'].setValue(result.data.attributes.designation)
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

  onOptionSelected(event: any) {
    this.Form.controls['resignation_type'].setValue(event.option.value)
  }

  //confirm to create the transaction
  submit() {
    const formStatus = this.Form.valid
    this.Form.controls['service_period'].enable()
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
          this.showProgressPopup()
          // this.create_reference_number()

          this.Form.controls['status'].setValue('Completed')
          const responsiblePersonValue = this.Form.value.responsible_person
        if (responsiblePersonValue) {
          this.Form.controls['responsible_person_notification'].setValue(false);
        }
          this.update_create_attrition('Completed')
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

  draft() {

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
        this.showProgressPopup()
        // this.create_reference_number()
        this.Form.controls['status'].setValue('Draft')
        this.Form.controls['service_period'].enable()
        this.update_create_attrition('Draft')

      }
    })


  }

  draftValid() {
    const { employee_id, employee_name, gender, division, country } = this.Form.value;
    if (employee_id && employee_name && gender && division && country) {

      return false
    } else {
      return true

    }
  }

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  //create reference
  // create_reference_number() {
  //   this.attritionService.get_attrition_register_count().subscribe({
  //     next: (result: any) => {
  //       const count = result.data.length
  //       const newCount = Number(count) + 1
  //       const reference = 'ATR-' + newCount
  //       this.Form.controls['reference_number'].setValue(reference)

  //     },
  //     error: (err: any) => {
  //       this.router.navigate(["/error/internal"])
  //     },
  //     complete: () => {
  //       this.update_create_attrition()
  //     }
  //   })
  // }

  //create accident
  update_create_attrition(data: any) {
    let status = ''
    this.attritionService.update_create_attrition(this.Form.value).subscribe({

      next: (result: any) => {
 status = result.data.attributes.status ? result.data.attributes.status : ''
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Attrition Details Updated',
          imageUrl: "assets/images/success.gif",
          imageWidth: 250,
          text: "You have successfully updated a Attrition details.",
          showCancelButton: false,
        })
        const isNotificationFalse = this.Form.value.responsible_person_notification === false;
        if (status === "Completed" && isNotificationFalse === true) {
          this.create_notification();
        }
        if (data === 'Completed') {
          this.router.navigate(["/apps/attrition/history"])
        }
        

      }
    })
  }

   create_notification() {
  
      let data: any[] = []
      data.push({
        module: "Attrition",
        action: 'Resignation Submitted:',
        reference_number: this.Form.value.reference_number,
        userID: this.Form.value.approver,
        access_link: "/apps/attrition/create/",
        profile: this.Form.value.created_user
      })
      this.generalService.create_notification(data[0]).subscribe({
        next: (result: any) => { 
        },
        error: (err: any) => {
          Swal.close()
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          Swal.close()
          this.router.navigate(["/apps/attrition/history"])
        }
      })
  
  
    }

  onInputFocus() {
    this.filteredDepatureReason = this.Depature_Reason.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDepatureReason(value))
    );
  }


  private _filterDepatureReason(value: any) {
    const filterValue = value?.toLowerCase();
    let data = this.resignationTypes.filter(option => option.attributes.type?.toLowerCase().includes(filterValue));
    return data;
  }

  ngDoCheck(): void {
    this.Depature_Reason.valueChanges.subscribe(value => {
      if (value == "") {
        this.filteredDepatureReason = this.Depature_Reason.valueChanges.pipe(
          startWith(''),
          map(value => this._filterDepatureReason(value))
        );
      }
      else {
        this._filterDepatureReason(value)
      }

    });
  }
  navigate() {
    this.backToHistory = true
    this._location.back();
  }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

}
