import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject, filter } from 'rxjs';
import { map, of, startWith } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { ListColumn, clinical } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { ViewMedicinePrescriptionComponent } from '../pharmacy-action/view-medicine-prescription/view-medicine-prescription.component';
import { NewDepartmentComponent } from 'src/app/apps/general-component/new-department/new-department.component';
import { NewSubDepartmentComponent } from 'src/app/apps/general-component/new-sub-department/new-sub-department.component';
import { NewDesignationComponent } from 'src/app/apps/general-component/new-designation/new-designation.component';

const GaugeChart = require('gauge-chart');
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

import Swal from 'sweetalert2';
import { CreateSymptomComponent } from '../create-patient-record/create-symptom/create-symptom.component';
@Component({
  selector: 'app-patient-record-modify',
  templateUrl: './patient-record-modify.component.html',
  styleUrls: ['./patient-record-modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class PatientRecordModifyComponent implements OnInit {

  bmiValue: any;
  bmiColor: any;
  bmiText: any;
  heightValue: any
  btnStyle: any;

  subject$: ReplaySubject<clinical[]> = new ReplaySubject<clinical[]>(1);
  data$: Observable<clinical[]> = this.subject$.asObservable();
  customers: clinical[];

  @Input()
  columns: ListColumn[] = [

    { name: 'medicine_name', property: 'medicine_name', visible: true, isModelProperty: true },
    { name: 'dosage', property: 'dosage', visible: true, isModelProperty: true },
    { name: 'days', property: 'days', visible: true, isModelProperty: true },
    {
      name: 'outside_medicine',
      property: 'outside_medicine',
      visible: true,
      isModelProperty: true,
    },
    { name: 'status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<clinical>;

  names: any[] = []
  supplierList: any[] = []
  suppliertypeList: any[] = []
  storagePlace: any[] = []
  deliveredUnit: any[] = []
  deliveredUnits: any[] = []
  files: File[] = [];
  evidenceCount: number = 0
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  bodyPartCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  prescriptionList: any[] = []
  ClinicDivision = new FormControl(null, [Validators.required]);
  WorkStatus = new FormControl(null, [Validators.required]);
  evidenceCertificateFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  division = new FormControl(null, [Validators.required]);
  gender = new FormControl(null, [Validators.required]);
  Department = new FormControl(null, [Validators.required]);
  Designation = new FormControl(null,);
  SubDepartment = new FormControl(null, [Validators.required]);
  SymptomList: any[] = []
  Symptoms = new FormControl('', [Validators.required])
  filteredSymptoms: Observable<any[]> = of([]);
  selectedSymptoms: string[] = [];
  selectedSymptomsDisplay: string = '';
  evidenceData: any
  dropdownValues: any
  pdfSource: any
  report: any
  divisions: any[] = [];
  imglnk: any = environment.client_backend + '/uploads/'
  format: any = ".png"
  currency: string
  userList: any[] = [];
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
  followupDate = new FormControl(null);
  departments: any[] = [];
  sub_departments: any[] = [];
  designations: any[] = [];
  genderData: any[] = [];
  workstaus_Data: any[] = [];
  filterSubDepartments: any[] = [];
  employeeDivisions: any[] = []
  backToHistory: Boolean = false
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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(private generalService: GeneralService,
    private clinicalService: ClinicalSuiteService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.configuration()
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((customers) => {
      this.prescriptionList = customers;
      this.dataSource.data = customers;
    });

    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      patient_id: [''],
      check_in: [null],
      employee_name: [''],
      employee_id: ['', [Validators.required]],
      status: [''],
      age: [null],
      gender: [''],
      symptoms: [''],
      weight: [null],
      height: [null],
      blood_pressure: [''],
      random_blood_sugar: [''],
      department: [''],
      sub_department: [''],
      work_status: [''],
      body_temperature: [null],
      doctor_name: [null],
      doctor_designation: [''],
      designation: [''],
      severity_level: [''],
      disease: [''],
      treatment: [''],
      follow_up_status: [''],
      follow_up_date: [null],
      clinic_division: [''],
      doctor_image: [''],
      created_by: [''],
      creator_designation: [''],
      employee_division: [''],
      business_unit: [null],
      department_id: [null],
      use_feet_inches: [false],
      feet: [null],
      inches: [null],
      use_celsius: [false],
      temp_celsius: [null],
      temp_fahrenheit: [null]
    });
    // this.Form.disable()

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
    if (element) {
      GaugeChart.gaugeChart(element, 350, gaugeOptions).updateNeedle(0);
    }

    this.get_symptoms();
    this.Symptoms.valueChanges.pipe(
      startWith(''),
      map(value => this._filterSymptoms(value))
    ).subscribe(filtered => {
      this.filteredSymptoms = of(filtered);
    });
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<clinical>(this.prescriptionList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health
        this.unitSpecific = result.data.attributes.business_unit_specific
        this.currency = result.data.attributes.currency
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"]).then()
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
      error: () => {
        this.router.navigate(["/error/internal"]).then()
      },
      complete: () => { }
    })
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.clin_register
        if (status === false) {
          this.router.navigate(["/error/unauthorized"]).then()
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisionUuids.push(elem.division_uuid)
              })
              let results = divisions.join('&');
            }
          }
          this.get_profiles()
          this.get_sub_department()
          this.get_department();
          this.get_employee_divisions();
          this.get_divisions()
        }
      },
      error: () => {
        this.router.navigate(["/error/internal"]).then()
      },
      complete: () => {
        this.get_inventory_details()
      }
    })
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

  get_inventory_details() {
    const clinicalID = this.route.snapshot.paramMap.get('id');
    this.clinicalService.get_clinical_details(clinicalID).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
        } else {
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['patient_id'].setValue(result.data[0].attributes.patient_id)
          this.Form.controls['check_in'].setValue(result.data[0].attributes.check_in)
          this.Form.controls['employee_name'].setValue(result.data[0].attributes.employee_name)
          this.Form.controls['employee_id'].setValue(result.data[0].attributes.employee_id)
          this.Form.controls['age'].setValue(result.data[0].attributes.age)
          this.get_dropdown_values()
          this.Form.controls['gender'].setValue(result.data[0].attributes.gender)
          this.Form.controls['work_status'].setValue(result.data[0].attributes.work_status)
          this.Form.controls['status'].setValue(result.data[0].attributes.patient_status)
          this.Form.controls['weight'].setValue(result.data[0].attributes.weight)
          this.Form.controls['height'].setValue(result.data[0].attributes.height)
          this.heightValue = result.data[0].attributes.height;
          this.Form.controls['blood_pressure'].setValue(result.data[0].attributes.blood_pressure)
          this.Form.controls['random_blood_sugar'].setValue(result.data[0].attributes.random_blood_sugar)
          this.get_designation();
          this.Form.controls['designation'].setValue(result.data[0].attributes.designation)

          this.Form.controls['department'].setValue(result.data[0].attributes.department)
          this.Department.setValue(result.data[0].attributes.department)

          const category = this.sub_departments.filter(function (elem: any) {
            return (
              elem.attributes.department?.data?.attributes?.department_name === result.data[0].attributes.department
            );
          });
          this.filterSubDepartments = category.map(
            (element) => element.attributes.sub_department_name
          );


          if (result.data[0].attributes.department) {
            const depts = this.departments.filter(function (elem: any) {
              return (
                elem.attributes.department_name === result.data[0].attributes.department
              );
            });
            this.Form.controls['department_id'].setValue(depts[0].id)
          }

          this.Form.controls['sub_department'].setValue(result.data[0].attributes.sub_department)
          // const symptoms = result.data[0].attributes.symptoms;
          // const defaultValues = symptoms ? symptoms.split(',').map((s: string) => s.trim()) : [];
          // this.selectedSymptoms = defaultValues;
          // this.Form.controls['symptoms'].setValue(symptoms); 
          // this.Symptoms.setValue(''); 

          const symptoms = result.data[0].attributes.symptom;
          const defaultValues = symptoms
            ? symptoms.replace(/<[^>]*>/g, '').split(',').map((s: string) => s.trim())
            : [];
          this.selectedSymptoms = defaultValues;
          this.Form.controls['symptoms'].setValue(defaultValues.join(', '));
          this.Symptoms.setValue('');

          this.Form.controls['body_temperature'].setValue(result.data[0].attributes.body_temperature)
          const celsius = result.data[0].attributes.body_temperature;

          if (celsius !== null && !isNaN(celsius)) {
            const fahrenheit = Math.round((celsius * 9 / 5 + 32) * 100) / 100; // Rounded to 2 decimals
            this.Form.controls['temp_fahrenheit'].setValue(fahrenheit);
          }
          this.Form.controls['temp_celsius'].setValue(result.data[0].attributes.body_temperature)

          this.Form.controls['doctor_name'].setValue(result.data[0].attributes.consulting_doctor.data?.id)
          this.Form.controls['created_by'].setValue(result.data[0].attributes.created_By.data.attributes.first_name + ' ' + result.data[0].attributes.created_By.data.attributes.last_name)

          this.Form.controls['doctor_designation'].setValue(result.data[0].attributes.consulting_doctor.data?.attributes.designation)
          this.Form.controls['creator_designation'].setValue(result.data[0].attributes.created_By.data.attributes.designation)

          this.Form.controls['severity_level'].setValue(result.data[0].attributes.severity_level)
          this.Form.controls['disease'].setValue(result.data[0].attributes.disease)
          this.Form.controls['follow_up_date'].setValue(result.data[0].attributes.follow_up_date)
          this.Form.controls['treatment'].setValue(result.data[0].attributes.treatment)
          this.Form.controls['follow_up_status'].setValue(result.data[0].attributes.follow_up_status)
          this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
          this.get_divisions()
          this.division.setValue(result.data[0].attributes.clinic_division)
          this.Form.controls['clinic_division'].setValue(result.data[0].attributes.clinic_division)

          this.get_employee_divisions()
          this.division.setValue(result.data[0].attributes.division)
          this.Form.controls['employee_division'].setValue(result.data[0].attributes.division)
          this.prescriptionList = []
          if (result.data[0].attributes.medical_prescriptions.data.length > 0) {
            const prescriptionList =
              result.data[0].attributes.medical_prescriptions.data;
            const updatedPrescriptionList = prescriptionList.forEach(
              (prescription: any) => {
                prescription.attributes.outside_medicine = prescription.attributes
                  .outside_medicine
                  ? '<i class="feather icon-check-circle btn-icon-prepend"></i>'
                  : '';
              }
            );
            this.prescriptionList = prescriptionList;
          } else {
            this.prescriptionList = []
          }
          if (result.data[0].attributes.follow_up_date) {
            this.followupDate.setValue(new Date(result.data[0].attributes.follow_up_date))
            this.Form.controls['follow_up_date'].setValue(result.data[0].attributes.follow_up_date)
          }
        }
      },
      error: () => { },
      complete: () => {
        this.prepareView()
        this.bmiCalc()

      }
    })

  }


  get_dropdown_values() {
    const module = 'General';
    this.generalService.get_dropdown_values(module).subscribe({
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

  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
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

  statusButton(data: any) {
    const open = "btn-secondary"
    const issued = "btn-success"
    if (data === "Open") {
      return open
    } else if (data === "Issued") {
      return issued
    } else {
      return
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

  followupDateVal(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['follow_up_date'].setValue(selecteddate)
  }

  viewPrescription(data: any) {
    this.dialog.open(ViewMedicinePrescriptionComponent, { data: data })
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


  get_symptoms() {
    this.clinicalService.get_symptoms().subscribe({
      next: (result: any) => {
        this.SymptomList = result.data;
        this.SymptomList.sort((a: any, b: any) => a.attributes.name.localeCompare(b.attributes.name));

        this.filteredSymptoms = of(this.SymptomList);
      },
      error: err => {
        this.router.navigate(["/error/internal"]);
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

    this.Form.controls['symptoms'].setValue(this.selectedSymptoms.join(', '));
    this.Symptoms.setErrors(null)
  }


  displaySelectedSymptoms(): string {

    return this.selectedSymptoms.join(', ');
  }

  onInputFocus() {
    const currentValue = this.Symptoms.value || '';
    this.filteredSymptoms = of(this._filterSymptoms(currentValue));
  }

  onInputChanged(event: any) {
    const inputValue = event.target.value.trim();

    if (inputValue === '') {
      this.selectedSymptoms = [];
      this.Form.controls['symptoms'].setValue('');
    }

    this.filteredSymptoms = of(this._filterSymptoms(inputValue));
  }

  private _filterSymptoms(value: string): any[] {
    const filterValue = value?.toLowerCase() || '';
    return this.SymptomList.filter((option) =>
      option.attributes.name.toLowerCase().includes(filterValue)
    );
  }


  // new_symptoms() {
  //   this.dialog.open(CreateSymptomComponent).afterClosed().subscribe((data: any) => {
  //     if (data?.symptom) { 
  //       this.clinicalService.create_symptom(data.symptom, this.Form.value.reporter).subscribe({
  //         next: (result: any) => {
  //           if (result?.data?.attributes?.name) {
  //             this.clinicalService.get_symptoms().subscribe({
  //               next: (getresult: any) => {
  //                 this.SymptomList = getresult.data;
  //                 this.SymptomList.sort((a: any, b: any) =>
  //                   a.attributes.name.localeCompare(b.attributes.name)
  //                 );

  //                 const newSymptom = result.data.attributes.name;
  //                 if (!this.selectedSymptoms.includes(newSymptom)) {
  //                   this.selectedSymptoms.push(newSymptom);
  //                 }

  //                 const symptomsString = this.selectedSymptoms.join(', ');
  //                 this.Form.controls['symptoms'].setValue(symptomsString);
  //               },
  //               error: (err: any) => {
  //                 console.error("Error fetching symptoms:", err);
  //                 this.router.navigate(["/error/internal"]);
  //               },
  //             });
  //           } else {
  //             console.error("Invalid result received from create_symptom");
  //           }
  //         },
  //         error: (err: any) => {
  //           console.error("Error creating symptom:", err);
  //           this.router.navigate(["/error/internal"]);
  //         },
  //         complete: () => {
  //           const statusText = "Symptom added successfully";
  //           this._snackBar.open(statusText, 'Ok', {
  //             horizontalPosition: this.horizontalPosition,
  //             verticalPosition: this.verticalPosition,
  //           });
  //         },
  //       });
  //     }
  //   });
  // }

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
          this.clinicalService.create_symptom(data.symptom, this.Form.value.reporter).subscribe({
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

  // delete_symptom(id: number) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     imageUrl: "assets/images/confirm-1.gif",
  //     imageWidth: 250,
  //     text: "Please confirm once again that you intend to delete the Symptom.",
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, proceed!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.clinicalService.delete_symptom(id).subscribe({
  //         next: (result: any) => {
  //           this.Form.controls.symptoms.reset()
  //           this.Symptoms.reset()
  //         },
  //         error: (err: any) => { },
  //         complete: () => {
  //           const statusText = "Symptom deleted"
  //           this._snackBar.open(statusText, 'OK', {
  //             horizontalPosition: this.horizontalPosition,
  //             verticalPosition: this.verticalPosition,
  //           });
  //           this.get_symptoms()
  //         }
  //       })
  //     }
  //   })
  // }

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
            // Find and remove the deleted symptom from selectedSymptoms
            const deletedSymptom = this.SymptomList.find(symptom => symptom.id === id)?.attributes.name;
            if (deletedSymptom) {
              const index = this.selectedSymptoms.indexOf(deletedSymptom);
              if (index !== -1) {
                this.selectedSymptoms.splice(index, 1);
              }
            }

            // Update the input field with remaining symptoms
            const symptomsString = this.selectedSymptoms.join(', ');
            this.Form.controls['symptoms'].setValue(symptomsString);

            // Refresh the list of symptoms excluding the deleted one
            this.get_symptoms(); // Fetch updated symptom list
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
                    result.data.attributes.department_name
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
  BusinessUnit(event: any) {
    const selectedData = this.divisions.find(data => data.division_name === event.value);
    this.Form.controls['clinic_division'].setValue(selectedData.division_name)
    this.Form.controls['business_unit'].setValue(selectedData.id)
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
      this.Form.controls['height'].setValue(this.heightValue)

    }
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
          this.update_patient_record();
          this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
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
  update_patient_record() {
    this.clinicalService.update_patient_record(this.Form.value).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => { },
      complete: () => {
        this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
      }
    })
  }

  saveAsDraft() {
    this.showProgressPopup();
    this.clinicalService.update_patient_record(this.Form.value).subscribe({
      next: (result: any) => {
        const statusText = "Patient details updated"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
      },
      error: (err: any) => { },
      complete: () => {
        this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
      }
    })
  }
  bodyTemp(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = parseFloat(inputElement.value);
    if (!isNaN(value)) {
      value = Math.round(value * 100) / 100;
    }
    this.Form.controls['body_temperature'].setValue(value);
  }
  navigate() {
    this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
    this.backToHistory = true
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

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}



