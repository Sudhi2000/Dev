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
import { filter, map, Observable, of, ReplaySubject, startWith } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { clinical, ListColumn } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CreateSymptomComponent } from '../create-patient-record/create-symptom/create-symptom.component';
import { ViewPatientReconsultationComponent } from '../view-patient-reconsultation/view-patient-reconsultation.component';
import { CreateMedicalPrescriptionComponent } from '../doctor-consultation/create-medical-prescription/create-medical-prescription.component';
import { IssueMedicinePrescriptionComponent } from '../pharmacy-action/issue-medicine-prescription/issue-medicine-prescription.component';
import { UpdateCheckOutComponent } from '../pharmacy-action/update-check-out/update-check-out.component';
import { ViewMedicalPrescriptionComponent } from '../doctor-consultation/view-medical-prescription/view-medical-prescription.component';

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

@Component({
  selector: 'app-no-reconsultation',
  templateUrl: './no-reconsultation.component.html',
  styleUrls: ['./no-reconsultation.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class NoReconsultationComponent implements OnInit {

  checkinDate = new FormControl(new Date(), [Validators.required]);
  checkinTime = new FormControl(new Date(), [Validators.required]);
  subject$: ReplaySubject<clinical[]> = new ReplaySubject<clinical[]>(1);
  data$: Observable<clinical[]> = this.subject$.asObservable();
  customers: clinical[];
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
  @Input()
  columns: ListColumn[] = [

    { name: 'medicine_name', property: 'medicine_name', visible: true, isModelProperty: true },
    { name: 'dosage', property: 'dosage', visible: true, isModelProperty: true },
    { name: 'days', property: 'days', visible: true, isModelProperty: true },
    { name: 'outside_medicine', property: 'outside_medicine', visible: true, isModelProperty: true },

    { name: 'status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  dataSource: MatTableDataSource<clinical>;
  dataSourceMedical: MatTableDataSource<clinical>;
  patientHistory: any[] = []
  bmiValue: any;
  bmiColor: any;
  bmiText: any;
  btnStyle: any;
  medicine_id: any
  patientId: any
  userList: any[] = [];
  names: any[] = []
  supplierList: any[] = []
  suppliertypeList: any[] = []
  storagePlace: any[] = []
  deliveredUnit: any[] = []
  deliveredUnits: any[] = []
  clinicalCount: number
  files: File[] = [];
  evidenceCount: number = 0
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  bodyPartCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  workstaus_Data: any[] = []
  prescriptionList: any[] = []
  medicalDetailsList: any[] = []
  doctor_prescription: any[] = []
  evidenceCertificateFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  evidenceData: any
  dropdownValues: any
  pdfSource: any
  report: any
  imglnk: any = environment.client_backend + '/uploads/'
  format: any = ".png"
  currency: string
  followupDate = new FormControl(null);
  admittedDate = new FormControl(null);
  dischargedDate = new FormControl(null);
  severityLevel: any[] = []
  SymptomList: any[] = []
  Symptoms = new FormControl('', [Validators.required])
  filteredSymptoms: Observable<any[]> = of([]);
  selectedSymptoms: string[] = [];
  selectedSymptomsDisplay: string = '';
  userDivision: any
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
  diseases: any[] = [];
  lift_usage_required: boolean;
  backToHistory: Boolean = false

  constructor(private generalService: GeneralService,
    private clinicalService: ClinicalSuiteService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.configuration()
    this.dataSource = new MatTableDataSource();
    this.dataSourceMedical = new MatTableDataSource();
    this.dataSource.sort = this.sort;

    this.dataSourceMedical.sort = this.sort;
    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((customers) => {
      this.prescriptionList = customers;
      this.dataSource.data = customers;
    });
    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((customers) => {
      this.medicalDetailsList = customers;
      this.dataSourceMedical.data = customers;
    });

    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      patient_id: [''],
      check_in: [new Date()],
      check_in_time: [new Date()],
      employee_name: [''],
      employee_id: ['', [Validators.required]],
      status: [''],
      age: [''],
      gender: [''],
      symptoms: [''],
      weight: [''],
      height: [''],

      blood_pressure: [''],
      random_blood_sugar: [''],
      department: [''],
      sub_department: [''],
      work_status: [''],
      body_temperature: [''],
      doctor_name: [''],
      doctor_designation: [''],
      designation: [''],
      employee_division: [''],
      consulting_doctor: ['', [Validators.required]],
      //severity_level: ['', [Validators.required]],
      //disease: ['', [Validators.required]],
      //treatment: ['', [Validators.required]],
      doctor_prescription: [''],
      //follow_up_status: [false, [Validators.required]],
      sent_via_ambulance: [false],
      refer_another_hospital_status: [false],
      follow_up_date: [null],
      admitted_date: [null],
      discharged_date: [null],
      doctor_image: [''],
      created_by: [''],
      creator_designation: [''],
      clinic_division: [''],
      reporter: [''],
      hospital_name: [''],
      hospital_location: [''],
      lift_usage_required: [false],
      since_complaint: [''],
      recommended_duration: [''],
      check_in_date: [''],
      use_feet_inches: [false],
      feet: [null],
      inches: [null],
      check_out: [null],
      check_out_date: [null]
    });




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

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }





  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health
        this.currency = result.data.attributes.currency
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.clin_create_patient
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisionUuids.push(elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
            }
          }
          this.get_dropdown_values()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {

        this.get_profiles();

      }
    })
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
      complete: () => {
        this.get_clinic_details()
      },
    });
  }

  get_dropdown_values() {

    const module2 = "Occupational Health"
    this.generalService.get_dropdown_values(module2).subscribe({
      next: (Result: any) => {
        const work_status = Result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Work Status';
        });
        this.workstaus_Data = work_status;
      },
      error: (err: any) => { },
      complete: () => { },
    });

  }

  get_clinic_details() {

    const clinicalID = this.route.snapshot.paramMap.get('id');
    this.clinicalService.get_clinical_details(clinicalID).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }

        if ((result.data[0].attributes.patient_status === 'Completed') || (result.data[0].attributes.patient_status === 'Reconsultation') && (matchFound || matchFound !== false)) {
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['patient_id'].setValue(result.data[0].attributes.patient_id)
          this.Form.controls['check_in'].setValue(result.data[0].attributes.check_in)


          this.Form.controls['employee_name'].setValue(result.data[0].attributes.employee_name)
          this.Form.controls['employee_id'].setValue(result.data[0].attributes.employee_id)
          this.Form.controls['age'].setValue(result.data[0].attributes.age)
          this.Form.controls['gender'].setValue(result.data[0].attributes.gender)
          this.Form.controls['status'].setValue(result.data[0].attributes.patient_status)
          this.Form.controls['weight'].setValue(result.data[0].attributes.weight)
          this.Form.controls['height'].setValue(result.data[0].attributes.height)
          this.Form.controls['consulting_doctor'].setValue(result.data[0].attributes.consulting_doctor.data.id)
          this.Form.controls['blood_pressure'].setValue(result.data[0].attributes.blood_pressure)
          this.Form.controls['random_blood_sugar'].setValue(result.data[0].attributes.random_blood_sugar)
          this.Form.controls['designation'].setValue(result.data[0].attributes.designation)
          this.Form.controls['department'].setValue(result.data[0].attributes.department)
          this.Form.controls['sub_department'].setValue(result.data[0].attributes.sub_department)
          this.Form.controls['work_status'].setValue(result.data[0].attributes.work_status)
          this.Form.controls['body_temperature'].setValue(result.data[0].attributes.body_temperature)
          this.Form.controls['doctor_name'].setValue(result.data[0].attributes.consulting_doctor.data.attributes.first_name + ' ' + result.data[0].attributes.consulting_doctor.data.attributes.last_name)
          this.Form.controls['created_by'].setValue(result.data[0].attributes.created_By.data.attributes.first_name + ' ' + result.data[0].attributes.created_By.data.attributes.last_name)


          const symptoms = result.data[0].attributes.symptom;
          const defaultValues = symptoms
            ? symptoms.replace(/<[^>]*>/g, '').split(',').map((s: string) => s.trim())
            : [];
          this.selectedSymptoms = defaultValues;
          this.Form.controls['symptoms'].setValue(defaultValues.join(', '));
          this.Symptoms.setValue('');

          if (result.data[0].attributes.check_in) {
            const checkInDateTime = new Date(result.data[0].attributes.check_in);

            // Set the date and time based on the backend data.
            this.checkinDate.setValue(checkInDateTime);
            this.checkinTime.setValue(checkInDateTime);

          }

          this.Form.controls['employee_division'].setValue(result.data[0].attributes.division)
          this.Form.controls['clinic_division'].setValue(result.data[0].attributes.clinic_division)


          if (result.data[0].attributes.patient_histories.data.length > 0) {
            this.patientHistory = result.data[0].attributes.patient_histories.data



          } else {
            this.patientHistory = []
          }




          // this.prescriptionList = []
          // this.medicalDetailsList = []
          // if (result.data[0].attributes.medical_prescriptions.data.length > 0) {
          //   const prescriptionList = result.data[0].attributes.medical_prescriptions.data;
          //   const updatedPrescriptionList = prescriptionList.forEach((prescription: any) => {
          //     prescription.attributes.outside_medicine = prescription.attributes.outside_medicine ? '<i class="feather icon-check-circle btn-icon-prepend"></i>' : "";
          //   });
          //   this.prescriptionList = prescriptionList

          // } else {
          //   this.prescriptionList = []
          // }
          // if (result.data[0].attributes.
          //   medicine_details.data.length > 0) {

          //   const medicineList = result.data[0].attributes.
          //     medicine_details.data;
          //   this.medicalDetailsList = medicineList


          // } else {
          //   this.medicalDetailsList = []
          // }
          if (result.data[0].attributes.follow_up_date) {
            this.followupDate.setValue(new Date(result.data[0].attributes.follow_up_date))
            this.Form.controls['follow_up_date'].setValue(result.data[0].attributes.follow_up_date)
          }
          if (result.data[0].attributes.refer_to_another_hospital === true) {

            this.admittedDate.setValue(new Date(result.data[0].attributes.admitted_date == null ? "" : result.data[0].attributes.admitted_date))
            this.dischargedDate.setValue(new Date(result.data[0].attributes.discharged_date == null ? "" : result.data[0].attributes.discharged_date))
            this.Form.controls['admitted_date'].setValue(result.data[0].attributes.admitted_date)
            this.Form.controls['discharged_date'].setValue(result.data[0].attributes.discharged_date)

          }
        }
        else {
          this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
        }

      },
      error: (err: any) => { },
      complete: () => {
        this.bmiCalc()
        this.Form.controls['employee_name'].disable()
        this.Form.controls['employee_id'].disable()
        this.Form.controls['gender'].disable()
        this.Form.controls['department'].disable()
        this.Form.controls['sub_department'].disable()
        this.Form.controls['age'].disable()
        this.Form.controls['designation'].disable()
        this.Form.controls['employee_division'].disable()
        this.prepareView()

      }
    })

  }
  setTimeFromISO(isoDateString: string) {

    const date = new Date(isoDateString);
    const istDate = new Date(date.getTime());
    const hours = istDate.getHours();
    const minutes = istDate.getMinutes();
    const newTime = new Date();
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    this.checkinTime.setValue(newTime);
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

  new_symptoms() {
    this.dialog.open(CreateSymptomComponent).afterClosed().subscribe((data: any) => {
      if (data?.symptom) {
        const enteredSymptom = data.symptom.trim()?.toLowerCase(); // Convert input to lowercase
        const found = this.SymptomList.find(
          elem => elem.attributes.name.trim()?.toLowerCase() === enteredSymptom
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
              //  else {
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSourceMedical.paginator = this.paginator;
    this.dataSourceMedical.sort = this.sort;
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<clinical>(this.prescriptionList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSourceMedical = new MatTableDataSource<clinical>(this.medicalDetailsList);
    this.dataSourceMedical.paginator = this.paginator;
    this.dataSourceMedical.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSourceMedical.filter = filterValue.trim().toLowerCase();
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


  draft() {
    this.Form.controls['status'].setValue('Reconsultation')
    this.confirmation()
  }

  submit() {
    this.Form.controls['status'].setValue('Completed')
    this.confirmation()
  }

  confirmation() {
    this.updateTimeAndDate()// if user doesnt made any changes in date and time trigger this function to update today date and time
    if (this.Form.value.status === 'Reconsultation') {
      this.showProgressPopup();
      this.update_clinical_suite()
    }
    else {
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
          this.update_clinical_suite()
        } else {
          this.Form.controls['status'].setValue('Reconsultation')
        }

      })
    }
  }

  updateTimeAndDate() {
    const changedTime = this.Form.controls['check_in'].value

    const changedDate = this.Form.controls['check_in_date'].value


    if (changedTime === null) {

      const currentDateTime = new Date();
      this.Form.controls['check_in'].setValue(currentDateTime)

    } if (!changedDate) {

      const todayDate = new Date();
      const dateWithoutTime = todayDate.toISOString().slice(0, 10);
      this.Form.controls['check_in_date'].setValue(dateWithoutTime);

    }
  }


  //  if(this.Form.value.status == 'Completed'){
  //       this.dialog.open(UpdateCheckOutComponent).afterClosed().subscribe(data => {
  //       this.showProgressPopup();
  //       this.Form.controls['check_out'].setValue(data.check_out)
  //       this.Form.controls['check_out_date'].setValue(data.check_out_date)
  //       this.clinicalService.update_clinical_suite_reconsultation(this.Form.value).subscribe({
  //         next: (result: any) => {
  //           const clinicalid = result.data.id
  //           this.prescriptionList.forEach((elem: any) => {
  //             this.clinicalService.create_non_consultaion_prescription(elem, result.data.id).subscribe({
  //               next: (result: any) => {
  //                 this.medicine_id = result.data.id
  //                 this.clinicalService.mark_check_out(clinicalid, data).subscribe({
  //                   next: (result: any) => { },
  //                   error: (err: any) => { },
  //                   complete: () => { }
  //                 })
  //               },
  //               error: (err: any) => {
  //                 this.router.navigate(["/error/internal"])
  //               },
  //               complete: () => {
  //                 Swal.close()
  //                 // const statusText = "Medicine prescription Created"
  //                 // this._snackBar.open(statusText, 'OK', {
  //                 //   horizontalPosition: this.horizontalPosition,
  //                 //   verticalPosition: this.verticalPosition,
  //                 // });

  //                 // this.get_prescription_details(this.medicine_id)
  //               }
  //             })
  //           })
  //         },
  //         error: (err: any) => {
  //           Swal.close()
  //           this.router.navigate(['/error/internal']);
  //         },
  //         complete: () => {
  //           Swal.close()
  //           Swal.fire({
  //             title: 'Patient Record Details Completed',
  //             imageUrl: 'assets/images/patient-record.gif',
  //             imageWidth: 250,
  //             text: 'You have successfully added a Patient Record details.',
  //             showCancelButton: false,
  //           });
  //           this.router.navigate([
  //             '/apps/occupational-health/clinical-suite/register',
  //           ]);
  //         },
  //       });
  //     })
  //     }
  //   else if(this.Form.value.status == 'Reconsultation'){

  //   }




  update_clinical_suite() {

    if (this.Form.value.status == 'Completed') {
      this.dialog.open(UpdateCheckOutComponent).afterClosed().subscribe(data => {
        this.showProgressPopup();
        this.Form.controls['check_out'].setValue(data?.check_out)
        this.Form.controls['check_out_date'].setValue(data?.check_out_date)
        this.clinicalService.update_clinical_suite_reconsultation(this.Form.value).subscribe({
          next: (result: any) => {
            const clinicalid = result.data.id
            this.prescriptionList.forEach((elem: any) => {
              this.clinicalService.create_non_consultaion_prescription(elem, result.data.id).subscribe({
                next: (result: any) => {
                  this.medicine_id = result.data.id
                  this.clinicalService.mark_check_out(clinicalid, data).subscribe({
                    next: (result: any) => { },
                    error: (err: any) => { },
                    complete: () => { }
                  })
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                }
              })
            })
          },
          error: (err: any) => {
            Swal.close()
            this.router.navigate(['/error/internal']);
          },
          complete: () => {
            Swal.close()
            Swal.fire({
              title: 'Patient Record Details Completed',
              imageUrl: 'assets/images/patient-record.gif',
              imageWidth: 250,
              text: 'You have successfully added a Patient Record details.',
              showCancelButton: false,
            });
            // Swal.fire({
            //   title: 'Patient Record Details Completed',
            //   imageUrl: 'assets/images/patient-record.gif',
            //   imageWidth: 250,
            //   text: 'You have successfully added a Patient Record details.',
            //   showCancelButton: false,
            // });
            this.router.navigate([
              '/apps/occupational-health/clinical-suite/register',
            ]);
          },
        });
      })
    }
    else if (this.Form.value.status == 'Reconsultation') {
      this.clinicalService.update_clinical_suite_reconsultation(this.Form.value).subscribe({

        next: (result: any) => {
          const clinicalid = result.data.id
          this.prescriptionList.forEach((elem: any) => {
            this.clinicalService.create_non_consultaion_prescription(elem, result.data.id).subscribe({
              next: (result: any) => {
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {

              }
            })
          })
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          Swal.close()
          const statusText = "Details updated successfully"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.files = []
        }
      })
    }



    // this.clinicalService.update_clinical_suite_reconsultation(this.Form.value).subscribe({

    //   next: (result: any) => {

    //     if (result.data.attributes.patient_status === "Completed") {
    //       Swal.fire({
    //         title: 'Patient Record Details Completed',
    //         imageUrl: "assets/images/patient-record.gif",
    //         imageWidth: 250,
    //         text: "You have successfully completed a consulation. Kindly redirect the patient to the pharmacy to collect the medicine if have.",
    //         showCancelButton: false,
    //       }).then((result) => {
    //         this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
    //       })
    //     } else if (result.data.attributes.patient_status === "Reconsultation") {

    //       Swal.close()
    //       const statusText = "Details updated successfully"
    //       this._snackBar.open(statusText, 'OK', {
    //         horizontalPosition: this.horizontalPosition,
    //         verticalPosition: this.verticalPosition,
    //       });
    //       this.files = []
    //       // this.get_clinic_details()
    //     }
    //   },
    //   error: (err: any) => {
    //     this.router.navigate(["/error/internal"])
    //   },
    //   complete: () => {
    //   }
    // })

  }


  viewMedicine(presData: any) {
    this.dialog.open(ViewMedicalPrescriptionComponent, { data: { attributes: presData } })

  }

  view(presData: any) {
    this.dialog.open(ViewPatientReconsultationComponent, { data: presData })

  }

  UseFeetAndInches(event: any): void {
    if (event.currentTarget.checked === true) {
      this.Form.controls['feet'].setValidators([Validators.required]);
      this.Form.controls['inches'].setValidators([Validators.required]);
      this.Form.controls['feet'].updateValueAndValidity();
      this.Form.controls['inches'].updateValueAndValidity();

    } else {
      this.Form.controls['feet'].clearValidators();
      this.Form.controls['inches'].clearValidators();
      this.Form.controls['feet'].updateValueAndValidity();
      this.Form.controls['inches'].updateValueAndValidity();
      this.Form.controls['height'].reset();
    }
  }

  findHeight(feet: any, inches: any) {

    const heightFromFeet = feet * 0.3048;
    const heightFromInches = inches * 0.0254;
    const totalHeightInMeters = heightFromFeet + heightFromInches;

    this.Form.controls['height']?.setValue(totalHeightInMeters);
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
    let currentCheckInDate = new Date(this.Form.controls['check_in'].value);
    if (currentCheckInDate.getFullYear() === 1970) {
      currentCheckInDate = new Date();
    }
    currentCheckInDate.setHours(hoursVal, minutesVal, 0, 0);
    this.Form.controls['check_in'].setValue(currentCheckInDate);
  }

  navigate() {
    this.router.navigate(["apps/occupational-health/clinical-suite/register"])
    this.backToHistory = true
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
  issuePrescription(data: any, index: number) {
    if (this.Form.value.clinic_division) {



      if (data.outside_medicine) {
        const clinicDiv = this.Form.value.clinic_division;

        //
        const presId = data.id;
        const status = 'Issued';
        this.dialog
          .open(IssueMedicinePrescriptionComponent, {
            data:
            {
              data:
                { attributes: data },
              clinicDiv
            }
          })
          .afterClosed()
          .subscribe((comData) => {
            if (index > -1 && index < this.prescriptionList?.length) {
              this.prescriptionList.splice(index, 1);
            }

            if (comData.issue_status === 'Issued') {
              const quantity = comData.issuing_quantity
              let presLength = this.prescriptionList.length
              this.showProgressPopup();

              this.prescriptionList.push({
                ...comData,
                status: 'Issued'
              })
              if (this.prescriptionList.length > presLength) {
                const statusText = 'Medicine issued';
                this._snackBar.open(statusText, 'OK', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                Swal.close();
              }


              // this.clinicalService
              //   .update_prescription_status(status, presId, quantity)
              //   .subscribe({
              //     next: (result: any) => { },
              //     error: (err: any) => { },
              //     complete: () => {
              //       const statusText = 'Medicine issued';
              //       this._snackBar.open(statusText, 'OK', {
              //         horizontalPosition: this.horizontalPosition,
              //         verticalPosition: this.verticalPosition,
              //       });
              //       
              //       this.get_prescription_details();
              //     },
              //   });
            }

          });

      } else {
        const clinicDiv = this.Form.value.clinic_division;
        const medID = data?.medicine_uuid;
        this.clinicalService.get_medical_stock_id(medID, clinicDiv).subscribe({
          next: (result: any) => {
            if (result.data.length > 0) {
              if (index > -1 && index < this.prescriptionList?.length) {
                this.prescriptionList.splice(index, 1);
              }

              const stockId = result.data[0].id;
              const bal = result.data[0].attributes?.balance;
              this.dialog
                .open(IssueMedicinePrescriptionComponent, {
                  data: {
                    data:
                      { attributes: data },
                    clinicDiv
                  },
                })
                .afterClosed()
                .subscribe((comData) => {
                  if (comData) {
                    this.showProgressPopup();
                    const presId = comData?.id;
                    const status = comData?.issue_status;
                    const issued = comData?.issuing_quantity;
                    const quantity = comData?.issuing_quantity

                    const balance = Number(bal) - Number(issued);
                    this.clinicalService
                      .update_issued_medical_stock(stockId, issued, balance)
                      .subscribe({
                        next: (result: any) => {

                          let presLength = this.prescriptionList.length

                          this.prescriptionList.push({
                            ...comData,
                            status: 'Issued'
                          })

                          if (this.prescriptionList.length > presLength) {
                            const statusText = 'Medicine issued';
                            this._snackBar.open(statusText, 'OK', {
                              horizontalPosition: this.horizontalPosition,
                              verticalPosition: this.verticalPosition,
                            });
                            Swal.close();
                          }
                        },
                        error: (err: any) => { },
                        complete: () => { },
                      });
                  }
                });
            } else {
              const statusText = 'Prescribed medicine is not in stock';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            }
          },
          error: (err: any) => { },
          complete: () => { },
        });
      }
    }
    else {
      const statusText = 'Please select the Clinical Division';
      this._snackBar.open(statusText, 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }


  }


  statusButton(data: any) {
    const open = 'btn-secondary';
    const issued = 'btn-success';
    if (data === 'Open') {
      return open;
    } else if (data === 'Issued') {
      return issued;
    } else {
      return;
    }
  }
  createPrescription() {
    this.dialog.open(CreateMedicalPrescriptionComponent, { data: this.prescriptionList }).afterClosed().subscribe(data => {
      if (data) {
        if (data) {
          let outside_medicine = data.outside_medicine == true ? '<i class="feather icon-check-circle btn-icon-prepend"></i>' : "";
          this.prescriptionList.push({
            ...data,
            outsideMedecine: outside_medicine,
            status: 'Open'
          })
        }
      }
    })
  }

  deletePrescription(index: number) {
    if (index > -1 && index < this.prescriptionList?.length) {
      this.prescriptionList.splice(index, 1);
    }
  }
}
