import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { accident_people, user } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { debounceTime, distinctUntilChanged, map, Observable, of, startWith } from 'rxjs';
import {
  DropzoneDirective,
  DropzoneConfigInterface,
} from 'ngx-dropzone-wrapper';
import { NewDepartmentComponent } from '../../../general-component/new-department/new-department.component';
import { NewDesignationComponent } from '../../../general-component/new-designation/new-designation.component';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';
import { NewSubDepartmentComponent } from '../../../general-component/new-sub-department/new-sub-department.component';
import { CreateSymptomComponent } from './create-symptom/create-symptom.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

const GaugeChart = require('gauge-chart');

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-create-patient-record',
  templateUrl: './create-patient-record.component.html',
  styleUrls: ['./create-patient-record.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CreatePatientRecordComponent implements OnInit {
  chartData: number[] = [];
  chartOptions: any = {};
  checkinDate = new FormControl(new Date(), [Validators.required]);
  checkinTime = new FormControl(new Date(), [Validators.required]);


  @ViewChild(DropzoneDirective, { static: false })
  directiveRef?: DropzoneDirective;
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5;
  genderData: any[] = [];
  workstaus_Data: any[] = [];
  divisions: any[] = [];
  employeeDivisions: any[] = [];
  bmiValue: any;
  bmiColor: any;
  bmiText: any;
  btnStyle: any;
  ClinicDivision = new FormControl(null, [Validators.required]);
  employeeIdValid: boolean = false;
  resignationTypes: any[] = [];
  filterSubDepartments: any[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string;
  Form: FormGroup;
  userList: any[] = [];
  functions: any[] = [];
  departments: any[] = [];
  sub_departments: any[] = [];
  userId: any;
  designations: any[] = [];
  SymptomList: any[] = []
  Symptoms = new FormControl('', [Validators.required])
  filteredSymptoms: Observable<any[]> = of([]);
  selectedSymptoms: string[] = [];
  selectedSymptomsDisplay: string = '';

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  dropdownValues: any;
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
      ],
    },
  };
  userDivision: any
  corporateUser: any
  unitSpecific: any
  constructor(
    private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private clinicalService: ClinicalSuiteService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    // this.selectedSymptoms = [];
    const data = [
      { weight: 70, height: 1.75 },
      // { weight: 65, height: 1.70 },
      // Add more data points as needed
    ];

    this.configuration();
    this.Form = this.formBuilder.group({
      id: [''],
      reporter: [''],
      org_id: [''],
      patient_id: [''],
      department_id: [''],
      reported_date: [new Date()],
      check_in: [new Date()],
      check_in_time: [new Date()],
      status: ['Pending'],
      employee_id: ['', [Validators.required]],
      employee_name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      designation: [''],
      age: [null, [Validators.required]],
      sub_department: [''],
      department: ['', [Validators.required]],
      symptoms: ['', [Validators.required]],
      consulting_doctor: [null, [Validators.required]],
      division: ['', [Validators.required]],
      body_temperature: [null],
      weight: [null],
      height: [null],
      business_unit: [null],
      blood_pressure: [''],
      work_status: [''],
      random_blood_sugar: [''],
      clinic_division: ['', [Validators.required]],
      check_in_date: [new Date()],
      use_feet_inches: [true],
      feet: [null],
      inches: [null],
      year: [''],
      use_celsius: [false],
      temp_celsius: [null],
      temp_fahrenheit: [null]
    });



    this.chartData = data.map((item) =>
      this.calculateBMI(item.weight, item.height)
    );

    // Chart options
    this.chartOptions = {
      chart: {
        type: 'donut',
        height: 350,
      },
      labels: data.map((_, index) => `Person ${index + 1}`),
    };

    let element = document.querySelector('#gaugeArea');
    let gaugeOptions = {
      hasNeedle: true,
      needleColor: 'black',
      needleUpdateSpeed: 1000,
      arcColors: [
        'rgb(32,161,236)',
        'rgb(128,199,131)',
        'rgb(255,212,78)',
        'rgb(255,178,0)',
        'rgb(229,114,117)',
      ],
      arcDelimiters: [20, 40, 60, 80, 99.9],
      // rangeLabel: ['Normal', 'Mordibly Obese'],
      needleStartValue: 0,
    };

    // Drawing and updating the chart
    GaugeChart.gaugeChart(element, 350, gaugeOptions).updateNeedle(0);

    this.get_symptoms();
    this.Symptoms.valueChanges.pipe(
      startWith(''),
      map(value => this._filterSymptoms(value))
    ).subscribe(filtered => {
      this.filteredSymptoms = of(filtered);
    });

  }

  calculateBMI(weight: number, height: number): number {
    return weight / (height * height);
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health;
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          this.router.navigate(['/error/upgrade-subscription']);
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id;
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split('=');
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1]);
              this.Form.controls['org_id'].setValue(
                decodeURIComponent(cookiePair[1])
              );
            }
          }
          this.me();
        }
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.clin_create_patient;
        this.userId = result.id
        if (status === false) {
          this.router.navigate(['/error/unauthorized']);
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id);
          this.get_dropdown_values();
          this.get_department();
          this.get_designation();
          this.get_sub_department();
          this.get_employee_divisions();
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions();
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
            this.get_divisions();
            this.get_profiles();
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  //get user profiles
  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((person: any) =>
          person.attributes.user?.data?.attributes?.blocked === false &&
          person.attributes.designation === "Doctor" || person.attributes.designation === "doctor");

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
        const filteredData = result.data.filter((person: any) => person.attributes.user?.data?.attributes?.blocked === false &&
          person.attributes.designation === "Doctor" || person.attributes.designation === "doctor");

        this.userList = filteredData;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }
  //get dropdown values
  get_dropdown_values() {
    const module1 = 'General';
    this.generalService.get_dropdown_values(module1).subscribe({
      next: (genderResult: any) => {
        //Gender
        const gender = genderResult.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Gender';
        });
        this.genderData = gender;
      },
      error: (err: any) => { },
      complete: () => { },
    });
    const module2 = "Occupational Health"
    this.generalService.get_dropdown_values(module2).subscribe({
      next: (Result: any) => {
        //Gender
        const work_status = Result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Work Status';
        });
        this.workstaus_Data = work_status;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }

  // get_divisions() {
  //   this.generalService.get_division(this.orgID).subscribe({
  //     next: (result: any) => {
  //       this.divisions = result.data;
  //     },
  //     error: (err: any) => {
  //       this.router.navigate(['/error/internal']);
  //     },
  //     complete: () => { },
  //   });
  // }

  checkEmployeeId() {
    const employeeId = this.Form.value.employee_id;

    if (employeeId) {
      this.clinicalService.get_employee_details(employeeId).subscribe({
        next: (result: any) => {
          if (result.data.length > 0) {
            const statusText =
              'A record with the same Employee ID already exist';
            this._snackBar.open(statusText, 'Ok', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.Form.patchValue({
              employee_name: result.data[0].attributes.employee_name,
              gender: result.data[0].attributes.gender,
              age: result.data[0].attributes.age,
              designation: result.data[0].attributes.designation,
              division: result.data[0].attributes.division,
              department: result.data[0].attributes.department,
              sub_department: result.data[0].attributes.sub_department,
            });

            this.filterSubDepartments = this.sub_departments.filter(function (elem: any) {
              return (
                elem.attributes.department?.data?.attributes?.department_name === result.data[0].attributes.department
              );
            }).map((element) => element.attributes.sub_department_name);

          }
        },
        error: (err: any) => {
          this.router.navigate(['/error/internal']);
        },
        complete: () => { },
      });
    }
  }


  get_employee_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        this.employeeDivisions = result.data;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  get_divisions() {
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


  get_symptoms() {
    this.clinicalService.get_symptoms().subscribe({
      next: (result: any) => {
        this.SymptomList = result.data;
        this.SymptomList.sort((a: any, b: any) => a.attributes.name.localeCompare(b.attributes.name));
        this.filteredSymptoms = of(this.SymptomList);
      },
      error: err => {
        this.router.navigate(['/error/internal']);
      },
    });
  }

  toggleSelection(symptom: string) {
    const index = this.selectedSymptoms.indexOf(symptom);
    if (index === -1) {
      this.selectedSymptoms.push(symptom);
    } else {
      this.selectedSymptoms.splice(index, 1);
    }

    const symptomsString = this.selectedSymptoms.join(', ');
    this.Form.controls['symptoms'].setValue(symptomsString);
    this.Symptoms.setErrors(null)
  }


  displaySelectedSymptoms(): string {
    return this.selectedSymptoms.join(', ');
  }

  private _filterSymptoms(value: string): any[] {
    const filterValue = value?.toLowerCase();
    return this.SymptomList.filter(option =>
      option.attributes.name?.toLowerCase().includes(filterValue)
    );
  }


  onInputFocus() {
    this.filteredSymptoms = of(this._filterSymptoms(this.Symptoms.value || ''));
  }


  onInputChanged(event: any) {
    if (event.target.value === '') {

      this.selectedSymptoms = [];
      this.Form.controls['symptoms'].setValue('');
    }
  }

  new_symptoms() {
    this.dialog.open(CreateSymptomComponent).afterClosed().subscribe((data: any) => {
      if (data?.symptom) {

        const enteredSymptom = data.symptom.trim().toLowerCase(); // Convert input to lowercase
        const found = this.SymptomList.find(
          elem => elem.attributes.name.trim().toLowerCase() === enteredSymptom
        );
        if (found) {
          const statusText = "Symptom already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          const symptomsString = this.selectedSymptoms.join(', ');
          this.Symptoms.setValue(symptomsString);
        }
        else {
          this.clinicalService.create_symptom(data.symptom, this.userId).subscribe({
            next: (result: any) => {
              if (result?.data?.attributes?.name) {
                this.clinicalService.get_symptoms().subscribe({
                  next: (getresult: any) => {
                    this.SymptomList = getresult.data;
                    this.SymptomList.sort((a: any, b: any) =>
                      a.attributes.name.localeCompare(b.attributes.name)
                    );

                    const newSymptom = result.data.attributes.name;
                    if (!this.selectedSymptoms.includes(newSymptom)) {
                      this.selectedSymptoms.push(newSymptom);
                    }
                    const symptomsString = this.selectedSymptoms.join(', ');
                    this.Form.controls['symptoms'].setValue(symptomsString);
                    this.Symptoms.setErrors(null)

                    this.filteredSymptoms = of(this.SymptomList);
                  },
                  error: (err: any) => {
                    this.router.navigate(["/error/internal"]);
                  },
                });
              }
              // else {
              //   console.error("Invalid result received from create_symptom");
              // }
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"]);
            },
            complete: () => {
              const statusText = "Symptom added successfully";
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            },
          });
        }
      }
    });
  }



  update_symptom(ID: any) {
    this.dialog.open(CreateSymptomComponent, { data: ID }).afterClosed().subscribe((data: any) => {
      if (data) {
        const oldName = this.SymptomList.find(symptom => symptom.id === ID)?.attributes.name;

        this.clinicalService.update_symptom(data, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            const updatedName = result.data.attributes.name;

            const index = this.selectedSymptoms.findIndex(symptom => symptom === oldName);
            if (index !== -1) {
              this.selectedSymptoms[index] = updatedName;
            }
            // else {
            //   console.warn(`Old name '${oldName}' not found in selectedSymptoms.`);
            // }

            const symptomsString = this.selectedSymptoms.join(', ');
            this.Form.controls['symptoms'].setValue(symptomsString);

            this.clinicalService.get_symptoms().subscribe({
              next: (getresult: any) => {
                this.SymptomList = getresult.data;
                this.SymptomList.sort((a: any, b: any) =>
                  a.attributes.name.localeCompare(b.attributes.name)
                );
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"]);
              },
            });
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"]);
          },
          complete: () => {
            const statusText = "Symptom updated successfully";
            this._snackBar.open(statusText, 'Ok', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          },
        });
      }
    });
  }


  delete_symptom(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the Symptom.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clinicalService.delete_symptom(id).subscribe({
          next: () => {
            const deletedSymptom = this.SymptomList.find(symptom => symptom.id === id)?.attributes.name;
            if (deletedSymptom) {
              const index = this.selectedSymptoms.indexOf(deletedSymptom);
              if (index !== -1) {
                this.selectedSymptoms.splice(index, 1);
              }
            }

            const symptomsString = this.selectedSymptoms.join(', ');
            this.Form.controls['symptoms'].setValue(symptomsString);
            this.get_symptoms();
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"]);
          },
          complete: () => {
            const statusText = "Symptom deleted";
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          }
        });
      }
    });
  }




  get_department() {
    this.generalService.get_department().subscribe({
      next: (result: any) => {
        this.departments = result.data;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }

  new_department() {
    this.dialog
      .open(NewDepartmentComponent)
      .afterClosed()
      .subscribe((data: any) => {
        const name = data.name;
        this.generalService
          .create_department(name, this.Form.value.reporter)
          .subscribe({
            next: (result: any) => {
              this.generalService.get_department().subscribe({
                next: (result: any) => {
                  this.departments = result.data;
                },
                error: (err: any) => {
                  this.router.navigate(['/error/internal']);
                },
                complete: () => {
                  const statusText = 'Department created successfully';
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['department'].setValue(
                    result.data.attributes.name
                  );
                },
              });
            },
            error: (err: any) => {
              this.router.navigate(['/error/internal']);
            },
            complete: () => { },
          });
      });
  }



  getSubDepartments(data: any) {
    const department = data.value;
    const category = this.sub_departments.filter(function (elem: any) {
      return (
        elem.attributes.department?.data?.attributes?.department_name === department
      );
    });
    this.filterSubDepartments = category.map(
      (element) => element.attributes.sub_department_name
    );
  }
  departmentID(data: any) {
    this.Form.controls['department_id'].setValue(data.id);
  }
  BusinessUnit(event: any) {
    this.Form.controls['clinic_division'].setValue(event.value.division_name)
    this.Form.controls['business_unit'].setValue(event.value.id)
  }
  get_sub_department() {
    this.generalService.get_sub_department().subscribe({
      next: (result: any) => {
        this.sub_departments = result.data;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }

  new_sub_department() {
    if (this.Form.value.department) {
      this.dialog
        .open(NewSubDepartmentComponent)
        .afterClosed()
        .subscribe((data: any) => {
          const name = data.name;
          const department_id = this.Form.value.department_id;
          this.generalService
            .create_sub_department(
              name,
              department_id,
              this.Form.value.reporter
            )
            .subscribe({
              next: (result: any) => {
                this.generalService.get_sub_department().subscribe({
                  next: (result: any) => {
                    this.sub_departments = result.data;
                    const department = this.Form.value.department;
                    const category = this.sub_departments.filter(function (
                      elem: any
                    ) {
                      return (
                        elem.attributes.department.data?.attributes.department_name === department
                      );
                    });

                    this.filterSubDepartments = category.map(
                      (element) => element.attributes.sub_department_name
                    );

                    this.Form.controls['sub_department'].setValue(name);
                  },
                  error: (err: any) => {
                    this.router.navigate(['/error/internal']);
                  },
                  complete: () => {
                    const statusText =
                      'New sub department created successfully';
                    this._snackBar.open(statusText, 'Ok', {
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                    });
                  },
                });
              },
              error: (err: any) => {
                this.router.navigate(['/error/internal']);
              },
              complete: () => { },
            });
        });
    } else {
      const statusText = 'Please select the department';
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  get_designation() {
    this.generalService.get_designation().subscribe({
      next: (result: any) => {
        this.designations = result.data;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }

  new_designation() {
    this.dialog
      .open(NewDesignationComponent)
      .afterClosed()
      .subscribe((data: any) => {
        const name = data.name;
        this.generalService
          .create_designation(name, this.Form.value.reporter)
          .subscribe({
            next: (result: any) => {
              this.generalService.get_designation().subscribe({
                next: (result: any) => {
                  this.designations = result.data;
                },
                error: (err: any) => {
                  this.router.navigate(['/error/internal']);
                },
                complete: () => {
                  const statusText = 'Designation created successfully';
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['designation'].setValue(
                    result.data.attributes.name
                  );
                },
              });
            },
            error: (err: any) => {
              this.router.navigate(['/error/internal']);
            },
            complete: () => { },
          });
      });
  }

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  //confirm to create the transaction
  submit() {
    this.Form.controls['status'].setValue('Pending')
    const formStatus = this.Form.valid;
    if (formStatus) {
      Swal.fire({
        title: 'Are you sure?',
        imageUrl: 'assets/images/confirm-1.gif',
        imageWidth: 250,
        text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.showProgressPopup();
          this.create_patient_id();
        }
      });
    } else if (!formStatus) {
      const statusText = 'Please fill all mandatory fields';
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
  saveAsDraft() {
    this.Form.controls['status'].setValue('Draft')
    this.showProgressPopup();
    this.create_patient_id();
  }

  //create reference
  create_patient_id() {




    this.clinicalService.get_clinic_count().subscribe({
      next: (result: any) => {
        const count = result.data.length;
        const newCount = Number(count) + 1;
        const reference = 'PID-' + newCount;
        this.Form.controls['patient_id'].setValue(reference);
        const checkInYear = this.Form.controls['check_in'].value
        const yearOnly = checkInYear.getFullYear();
        this.Form.controls['year'].setValue(yearOnly)

      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        this.create_patient_record();
      },
    });
  }

  //create accident
  create_patient_record() {

    // this.Form.controls['check_in'].setValue(new Date());
    this.clinicalService.create_patient_record(this.Form.value).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        Swal.close()
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        Swal.fire({
          title: 'Patient Record Details Created',
          imageUrl: 'assets/images/patient-record.gif',
          imageWidth: 250,
          text: 'You have successfully added a Patient Record details.',
          showCancelButton: false,
        });
        this.router.navigate([
          '/apps/occupational-health/clinical-suite/register',
        ]);
      },
    });
  }


  findHeight(feet: any, inches: any) {

    const heightFromFeet = feet * 0.3048;
    const heightFromInches = inches * 0.0254;
    const totalHeightInMeters = heightFromFeet + heightFromInches;

    const roundedHeightInMeters = parseFloat(totalHeightInMeters.toFixed(2));

    this.Form.controls['height']?.setValue(roundedHeightInMeters);

    this.bmiCalc()
  }


  bmiCalc() {
    const weight = this.Form.value.weight;
    const height = this.Form.value.height;
    if (weight && height) {
      let elements = document.querySelector('#gaugeArea');
      if (elements) {
        let childElement = elements.firstChild; // Get the first child of the gaugeArea element
        if (childElement) {
          elements.removeChild(childElement); // Remove the child element
        }
      }

      const bmi = Number(
        Math.round(Number(weight) / Number(height ** 2)).toFixed(2)

      );
      this.bmiValue = bmi;

      if (bmi > 0 && bmi <= 18.5) {
        const percentage = (Number(bmi) / Number(100)) * 100;
        let element = document.querySelector('#gaugeArea');
        let gaugeOptions = {
          hasNeedle: true,
          needleColor: 'black',
          needleUpdateSpeed: 1000,
          arcColors: [
            'rgb(32,161,236)',
            'rgb(128,199,131)',
            'rgb(255,212,78)',
            'rgb(255,178,0)',
            'rgb(229,114,117)',
          ],
          arcDelimiters: [20, 40, 60, 80, 99.9],
          needleStartValue: 0,
        };
        let value = Number(percentage);
        if (element) {
          GaugeChart.gaugeChart(element, 350, gaugeOptions).updateNeedle(value);
        }
        this.bmiColor = 'btn-inverse-primary';
        this.bmiText = 'Underweight:';
        this.btnStyle = 'Underweight'
      } else if (bmi > 18.5 && bmi <= 24.9) {
        const percentage = (Number(bmi) / Number(100)) * 100;

        let element = document.querySelector('#gaugeArea');
        let gaugeOptions = {
          hasNeedle: true,
          needleColor: 'black',
          needleUpdateSpeed: 1000,
          arcColors: [
            'rgb(32,161,236)',
            'rgb(128,199,131)',
            'rgb(255,212,78)',
            'rgb(255,178,0)',
            'rgb(229,114,117)',
          ],
          arcDelimiters: [20, 40, 60, 80, 99.9],
          needleStartValue: 0,
        };

        let value = Number(percentage) + 15;

        if (element) {
          GaugeChart.gaugeChart(element, 350, gaugeOptions).updateNeedle(value);
        }
        this.bmiColor = 'btn-inverse-success';
        this.bmiText = 'Normal Weight:';
        this.btnStyle = 'Normal'
      } else if (bmi > 24.9 && bmi <= 29.9) {
        const percentage = (Number(bmi) / Number(100)) * 100;

        let element = document.querySelector('#gaugeArea');
        let gaugeOptions = {
          hasNeedle: true,
          needleColor: 'black',
          needleUpdateSpeed: 1000,
          arcColors: [
            'rgb(32,161,236)',
            'rgb(128,199,131)',
            'rgb(255,212,78)',
            'rgb(255,178,0)',
            'rgb(229,114,117)',
          ],
          arcDelimiters: [20, 40, 60, 80, 99.9],
          needleStartValue: 0,
        };

        let value = Number(percentage) + 30;

        if (element) {
          GaugeChart.gaugeChart(element, 350, gaugeOptions).updateNeedle(value);
        }
        this.bmiColor = 'btn-inverse-warning';
        this.bmiText = 'Overweight:';
        this.btnStyle = 'Overweight'

      } else if (bmi > 29.9 && bmi <= 40) {
        const percentage = (Number(bmi) / Number(100)) * 100;

        let element = document.querySelector('#gaugeArea');
        let gaugeOptions = {
          hasNeedle: true,
          needleColor: 'black',
          needleUpdateSpeed: 1000,
          arcColors: [
            'rgb(32,161,236)',
            'rgb(128,199,131)',
            'rgb(255,212,78)',
            'rgb(255,178,0)',
            'rgb(229,114,117)',
          ],
          arcDelimiters: [20, 40, 60, 80, 99.9],
          needleStartValue: 0,
        };

        let value = Number(percentage) + 40;

        if (element) {
          GaugeChart.gaugeChart(element, 350, gaugeOptions).updateNeedle(value);
        }
        this.bmiColor = 'btn-inverse-info';
        this.bmiText = 'Obesity:';
        this.btnStyle = 'Obesity'
      } else if (bmi > 40) {
        const percentage = (Number(bmi) / Number(100)) * 100;

        let element = document.querySelector('#gaugeArea');
        let gaugeOptions = {
          hasNeedle: true,
          needleColor: 'black',
          needleUpdateSpeed: 1000,
          arcColors: [
            'rgb(32,161,236)',
            'rgb(128,199,131)',
            'rgb(255,212,78)',
            'rgb(255,178,0)',
            'rgb(229,114,117)',
          ],
          arcDelimiters: [20, 40, 60, 80, 99.9],
          needleStartValue: 0,
        };

        let value = Number(percentage) + 50;

        if (element) {
          GaugeChart.gaugeChart(element, 350, gaugeOptions).updateNeedle(value);
        }
        this.bmiColor = 'btn-inverse-danger';
        this.bmiText = 'Mordibly Obesity:';
        this.btnStyle = 'Mordibly'

      }

    } else {
    }
  }


  // checkinDateVal(data: any) {
  //   const selectedDate = new Date(data.value);
  //   const currentTime = new Date();
  //   selectedDate.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
  //   this.Form.controls['check_in'].setValue(selectedDate);
  //   const dateWithoutTime = new Date(selectedDate).toISOString().slice(0, 10);
  //   this.Form.controls['check_in_date'].setValue(dateWithoutTime);
  // }


  // checkinTimeValue(data: any) {
  //   console.log("🚀 ~ CreatePatientRecordComponent ~ checkinTimeValue ~ data:", data)

  //   const hoursVal = data.getHours();
  //   const minutesVal = data.getMinutes();
  //   const date = new Date(this.checkinDate.value);
  //   date.setHours(hoursVal, minutesVal);
  //   this.Form.controls['check_in'].setValue(new Date(date))
  //   console.log(this.Form.value.check_in, 'this is date');

  // }

  checkinDateVal(data: any) {
    const selectedDate = new Date(data.value);
    const currentCheckInTime = this.Form.controls['check_in'].value;

    if (currentCheckInTime) {
      const currentHours = new Date(currentCheckInTime).getHours();
      const currentMinutes = new Date(currentCheckInTime).getMinutes();


      selectedDate.setHours(currentHours, currentMinutes, 0, 0);
    }


    this.Form.controls['check_in'].setValue(selectedDate);


    const dateWithoutTime = selectedDate.toISOString().slice(0, 10);
    this.Form.controls['check_in_date'].setValue(dateWithoutTime);
  }

  checkinTimeValue(data: any) {


    const hoursVal = data.getHours();
    const minutesVal = data.getMinutes();


    const currentCheckInDate = new Date(this.Form.controls['check_in'].value);

    if (!isNaN(currentCheckInDate.getTime())) {

      currentCheckInDate.setHours(hoursVal, minutesVal, 0, 0);


      this.Form.controls['check_in'].setValue(currentCheckInDate);


    } else {
      console.error('Invalid date selected for check_in.');
    }
  }


  UseFeetAndInches(event: any): void {

    if (event.currentTarget.checked === true) {
      this.Form.controls['feet'].setValidators([Validators.required]);
      this.Form.controls['inches'].setValidators([Validators.required]);
      this.Form.controls['feet'].updateValueAndValidity();
      this.Form.controls['inches'].updateValueAndValidity();

    } else {

      this.Form.controls['feet'].reset();
      this.Form.controls['inches'].reset();
      this.Form.controls['feet'].clearValidators();
      this.Form.controls['inches'].clearValidators();
      this.Form.controls['feet'].updateValueAndValidity();
      this.Form.controls['inches'].updateValueAndValidity();
    }
  }

  bodyTemp(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = parseFloat(inputElement.value);
    if (!isNaN(value)) {
      value = Math.round(value * 100) / 100;
    }
    this.Form.controls['body_temperature'].setValue(value);
  }

  bodyTempFahrenheit(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = parseFloat(inputElement.value);

    if (!isNaN(value)) {
      // Round to 2 decimal places
      value = Math.round(value * 100) / 100;
      // Calculate Celsius
      const celsius = ((value - 32) * 5) / 9;
      const roundedCelsius = Math.round(celsius * 100) / 100;

      // Store Celsius value for reports/dashboards
      this.Form.controls['body_temperature'].setValue(roundedCelsius);

    }
  }
}
