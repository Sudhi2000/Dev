import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';
import { CreateMedicalPrescriptionComponent } from '../doctor-consultation/create-medical-prescription/create-medical-prescription.component';
import { ReplaySubject, Observable, filter, of, startWith, map } from 'rxjs';
import { clinical, ListColumn } from 'src/app/services/schemas';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { NewDiseaseComponent } from '../../../general-component/new-disease/new-disease.component';
import { ViewPatientReconsultationComponent } from '../view-patient-reconsultation/view-patient-reconsultation.component';
import { CreateSymptomComponent } from '../create-patient-record/create-symptom/create-symptom.component';

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
  selector: 'app-patient-reconsultaion',
  templateUrl: './patient-reconsultaion.component.html',
  styleUrls: ['./patient-reconsultaion.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class PatientReconsultaionComponent implements OnInit {


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
    private route: ActivatedRoute) {
  }

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
      inches: [null]
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

  // enable_Lift_Usage(event: any) {

  //   if (event.currentTarget.checked === true) {

  //     this.Form.controls['since_complaint'].setValidators([Validators.required]);
  //     this.Form.controls['since_complaint'].updateValueAndValidity();
  //     this.Form.controls['recommended_duration'].setValidators([Validators.required]);
  //     this.Form.controls['recommended_duration'].updateValueAndValidity();


  //   } else {
  //     this.Form.controls['since_complaint'].clearValidators();
  //     this.Form.controls['since_complaint'].updateValueAndValidity();
  //     this.Form.controls['recommended_duration'].clearValidators();
  //     this.Form.controls['recommended_duration'].updateValueAndValidity();

  //   }


  // }
  // refer_another_hospital_status(event: any): void {
  //   if (event.currentTarget.checked === true) {
  //     this.Form.controls['hospital_name'].setValidators([Validators.required]);
  //     this.Form.controls['hospital_location'].setValidators([Validators.required]);
  //     this.Form.controls['doctor_prescription'].setValidators([Validators.required]);
  //     this.Form.controls['admitted_date'].setValidators([Validators.required]);
  //     this.Form.controls['discharged_date'].setValidators([Validators.required]);
  //     this.Form.controls['hospital_name'].updateValueAndValidity();
  //     this.Form.controls['hospital_location'].updateValueAndValidity();
  //     this.Form.controls['doctor_prescription'].updateValueAndValidity();
  //     this.Form.controls['admitted_date'].updateValueAndValidity();
  //     this.Form.controls['discharged_date'].updateValueAndValidity();

  //   } else {
  //     this.Form.controls['hospital_name'].clearValidators();
  //     this.Form.controls['hospital_location'].clearValidators();
  //     this.Form.controls['doctor_prescription'].clearValidators();
  //     this.Form.controls['admitted_date'].clearValidators();
  //     this.Form.controls['discharged_date'].clearValidators();
  //     this.Form.controls['hospital_name'].updateValueAndValidity();
  //     this.Form.controls['hospital_location'].updateValueAndValidity();
  //     this.Form.controls['doctor_prescription'].updateValueAndValidity();
  //     this.Form.controls['admitted_date'].updateValueAndValidity();
  //     this.Form.controls['discharged_date'].updateValueAndValidity();


  //   }
  // }



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

    // const module = "Occupational Health"
    // this.generalService.get_dropdown_values(module).subscribe({
    //   next: (genderResult: any) => {

    //     //Gender
    //     const data = genderResult.data.filter(function (elem: any) {
    //       return (elem.attributes.Category === "Severity Level")
    //     })
    //     this.severityLevel = data

    //   },
    //   error: (err: any) => { },
    //   complete: () => { this.get_diseases() }
    // })
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
          const celsius = result.data[0].attributes.body_temperature;

          if (celsius !== null && !isNaN(celsius)) {
            const fahrenheit = Math.round((celsius * 9 / 5 + 32) * 100) / 100; // Rounded to 2 decimals
            this.Form.controls['body_temperature'].setValue(fahrenheit);
          }
          // this.Form.controls['body_temperature'].setValue(result.data[0].attributes.body_temperature)
          this.Form.controls['doctor_name'].setValue(result.data[0].attributes.consulting_doctor.data.attributes.first_name + ' ' + result.data[0].attributes.consulting_doctor.data.attributes.last_name)
          this.Form.controls['created_by'].setValue(result.data[0].attributes.created_By.data.attributes.first_name + ' ' + result.data[0].attributes.created_By.data.attributes.last_name)
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

          if (result.data[0].attributes.check_in) {
            const checkInDateTime = new Date(result.data[0].attributes.check_in);

            // Set the date and time based on the backend data.
            this.checkinDate.setValue(checkInDateTime);
            this.checkinTime.setValue(checkInDateTime);
            // this.checkinDate.setValue(result.data[0].attributes.check_in)
            // this.checkinTime.setValue(new Date(result.data[0].attributes.check_in));
          }
          // this.Form.controls['doctor_designation'].setValue(result.data[0].attributes.consulting_doctor.data.attributes.designation)
          // this.Form.controls['creator_designation'].setValue(result.data[0].attributes.created_By.data.attributes.designation)

          // this.Form.controls['severity_level'].setValue(result.data[0].attributes.severity_level)
          //this.Form.controls['disease'].setValue(result.data[0].attributes.disease)
          //this.Form.controls['follow_up_date'].setValue(result.data[0].attributes.follow_up_date)

          //this.Form.controls['admitted_date'].setValue(result.data[0].attributes.admitted_date)
          //this.Form.controls['discharged_date'].setValue(result.data[0].attributes.discharged_date)
          //this.Form.controls['treatment'].setValue(result.data[0].attributes.treatment)
          //this.Form.controls['follow_up_status'].setValue(result.data[0].attributes.follow_up_status)
          this.Form.controls['employee_division'].setValue(result.data[0].attributes.division)
          this.Form.controls['clinic_division'].setValue(result.data[0].attributes.clinic_division)
          //this.Form.controls['refer_another_hospital_status'].setValue(result.data[0].attributes.refer_to_another_hospital)
          //this.Form.controls['hospital_name'].setValue(result.data[0].attributes.hospital_name)
          //this.Form.controls['hospital_location'].setValue(result.data[0].attributes.hospital_location)
          //this.Form.controls['doctor_prescription'].setValue(result.data[0].attributes.doctor_prescription)
          //this.Form.controls['sent_via_ambulance'].setValue(result.data[0].attributes.sent_via_ambulance)
          //this.Form.controls['since_complaint'].setValue(result.data[0].attributes.since_complaint)
          //this.Form.controls['recommended_duration'].setValue(result.data[0].attributes.recommended_duration)
          //this.Form.controls['lift_usage_required'].setValue(result.data[0].attributes.lift_usage_required)

          if (result.data[0].attributes.patient_histories.data.length > 0) {
            this.patientHistory = result.data[0].attributes.patient_histories.data



          } else {
            this.patientHistory = []
          }




          this.prescriptionList = []
          this.medicalDetailsList = []
          if (result.data[0].attributes.medical_prescriptions.data.length > 0) {
            const prescriptionList = result.data[0].attributes.medical_prescriptions.data;
            const updatedPrescriptionList = prescriptionList.forEach((prescription: any) => {
              prescription.attributes.outside_medicine = prescription.attributes.outside_medicine ? '<i class="feather icon-check-circle btn-icon-prepend"></i>' : "";
            });
            this.prescriptionList = prescriptionList

          } else {
            this.prescriptionList = []
          }
          if (result.data[0].attributes.
            medicine_details.data.length > 0) {

            const medicineList = result.data[0].attributes.
              medicine_details.data;
            this.medicalDetailsList = medicineList


          } else {
            this.medicalDetailsList = []
          }
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
        // this.Form.controls['work_status'].disable()
        //this.Form.controls['symptoms'].disable()
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


  // get_medical_details() {
  //   const clinicalID = this.route.snapshot.paramMap.get('id');
  //   this.clinicalService.get_clinical_details(clinicalID).subscribe({
  //     next: (result: any) => {
  //       this.medicalDetailsList = []


  //       if (result.data[0].attributes.medicine_details.data.length > 0) {
  //         const medicalDetailsList = result.data[0].attributes.medicine_details.data;
  //         const updatedPrescriptionList = medicalDetailsList.forEach((prescription: any) => {
  //           prescription.attributes.outside_medicine = prescription.attributes.outside_medicine ? '<i class="feather icon-check-circle btn-icon-prepend"></i>' : "";
  //         });
  //         this.medicalDetailsList = medicalDetailsList
  //       } else {
  //         this.medicalDetailsList = []
  //       }

  //     },
  //     error: (err: any) => { },
  //     complete: () => {
  //       this.prepareView()

  //     }
  //   })

  // }
  // get_prescription_details() {
  //   const clinicalID = this.route.snapshot.paramMap.get('id');
  //   this.clinicalService.get_clinical_details(clinicalID).subscribe({
  //     next: (result: any) => {
  //       this.prescriptionList = []


  //       if (result.data[0].attributes.medical_prescriptions.data.length > 0) {
  //         const prescriptionList = result.data[0].attributes.medical_prescriptions.data;
  //         const updatedPrescriptionList = prescriptionList.forEach((prescription: any) => {
  //           prescription.attributes.outside_medicine = prescription.attributes.outside_medicine ? '<i class="feather icon-check-circle btn-icon-prepend"></i>' : "";
  //         });
  //         this.prescriptionList = prescriptionList

  //       } else {
  //         this.prescriptionList = []
  //       }


  //     },
  //     error: (err: any) => { },
  //     complete: () => {
  //       this.prepareView()

  //     }
  //   })

  // }

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

  // followupDateVal(date: any) {
  //   const selecteddate = new Date(date.value)
  //   selecteddate.setDate(selecteddate.getDate() + 1)
  //   this.Form.controls['follow_up_date'].setValue(selecteddate)
  // }
  // admittedDateVal(date: any) {
  //   const selecteddate = new Date(date.value)
  //   selecteddate.setDate(selecteddate.getDate() + 1)
  //   this.Form.controls['admitted_date'].setValue(selecteddate)
  // }
  // dischargedDateVal(date: any) {
  //   const selecteddate = new Date(date.value)
  //   selecteddate.setDate(selecteddate.getDate() + 1)
  //   this.Form.controls['discharged_date'].setValue(selecteddate)
  // }

  // createPrescription() {
  //   this.dialog.open(CreateMedicalPrescriptionComponent, { data: this.prescriptionList }).afterClosed().subscribe(data => {
  //     if (data) {

  //       this.showProgressPopup();
  //       this.clinicalService.create_prescription(data, this.Form.value.id).subscribe({
  //         next: (result: any) => {

  //         },
  //         error: (err: any) => {
  //           this.router.navigate(["/error/internal"])
  //         },
  //         complete: () => {
  //           const statusText = "Medicine prescription Created"
  //           this._snackBar.open(statusText, 'OK', {
  //             horizontalPosition: this.horizontalPosition,
  //             verticalPosition: this.verticalPosition,
  //           });
  //           Swal.close()
  //           this.get_prescription_details()
  //         }
  //       })
  //     }
  //   })
  // }
  // createMedicalDetails() {
  //   this.dialog.open(CreateMedicalPrescriptionComponent, { data: this.medicalDetailsList }).afterClosed().subscribe(data => {
  //     if (data) {


  //       this.showProgressPopup();
  //       this.clinicalService.create_medical_details(data, this.Form.value.id).subscribe({
  //         next: (result: any) => { },
  //         error: (err: any) => {
  //           this.router.navigate(["/error/internal"])
  //         },
  //         complete: () => {
  //           const statusText = "Medicine Details Created"
  //           this._snackBar.open(statusText, 'OK', {
  //             horizontalPosition: this.horizontalPosition,
  //             verticalPosition: this.verticalPosition,
  //           });
  //           Swal.close()
  //           this.get_medical_details()
  //         }
  //       })
  //     }
  //   })
  // }

  // deletePrescription(data: any) {


  //   this.showProgressPopup();
  //   this.clinicalService.delete_prescription(data.id).subscribe({
  //     next: (result: any) => {

  //     },
  //     error: (err: any) => {
  //       this.router.navigate(["/error/internal"])
  //     },
  //     complete: () => {
  //       const statusText = "Medicine prescription Deleted"
  //       this._snackBar.open(statusText, 'OK', {
  //         horizontalPosition: this.horizontalPosition,
  //         verticalPosition: this.verticalPosition,
  //       });
  //       Swal.close()
  //       this.get_prescription_details()
  //       this.get_medical_details()
  //     }
  //   })
  // }
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
    this.Form.controls['status'].setValue('Pending')
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
          this.showProgressPopup();
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


  update_clinical_suite() {




    this.clinicalService.update_clinical_suite_reconsultation(this.Form.value).subscribe({

      next: (result: any) => {

        if (result.data.attributes.patient_status === "Pending") {
          Swal.fire({
            title: 'Patient Record Details Created',
            imageUrl: "assets/images/patient-record.gif",
            imageWidth: 250,
            text: "You have successfully completed a consulation. Kindly redirect the patient to the pharmacy to collect the medicine if have.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
          })
        } else if (result.data.attributes.patient_status === "Reconsultation") {

          Swal.close()
          const statusText = "Details updated successfully"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.files = []
          // this.get_clinic_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    })


    // const { lift_usage_required, refer_another_hospital_status } = this.Form.value;

    // if (lift_usage_required === false) {

    //   this.Form.controls['since_complaint'].enable()
    //   this.Form.controls['recommended_duration'].enable()
    //   this.Form.controls['since_complaint'].setValue('')
    //   this.Form.controls['recommended_duration'].setValue('')
    // } else {
    //   this.update()
    // }

    // if (refer_another_hospital_status === false) {
    //   this.admittedDate.setValue('')
    //   this.dischargedDate.setValue('')
    //   this.clinicalService.update_clinical_suite_field_remove_reconsultation(this.Form.value).subscribe({
    //     next: (result: any) => {
    //       if (result.data.attributes.patient_status === "Completed") {
    //         Swal.fire({
    //           title: 'Consulation Completed',
    //           imageUrl: "assets/images/patient-record.gif",
    //           imageWidth: 250,
    //           text: "You have successfully completed a consulation. Kindly redirect the patient to the pharmacy to collect the medicine if have.",
    //           showCancelButton: false,
    //         }).then((result) => {
    //           this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
    //         })
    //       } else if (result.data.attributes.patient_status === "Pending") {
    //         Swal.close()
    //         const statusText = "Details updated successfully"
    //         this._snackBar.open(statusText, 'OK', {
    //           horizontalPosition: this.horizontalPosition,
    //           verticalPosition: this.verticalPosition,
    //         });
    //         this.files = []
    //         this.get_clinic_details()
    //       }
    //     },
    //     error: (err: any) => {
    //       this.router.navigate(["/error/internal"])
    //     },
    //     complete: () => {
    //       this.medicalDetailsList.map((data) => {
    //         this.deletePrescription(data)
    //       })
    //     }
    //   })
    // }
    // else {
    //   this.update()
    // }

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

  // new_disease() {
  //   this.dialog
  //     .open(NewDiseaseComponent)
  //     .afterClosed()
  //     .subscribe((data: any) => {
  //       const name = data.disease_name;
  //       this.generalService
  //         .create_diseases(name, this.Form.value.reporter)
  //         .subscribe({
  //           next: (result: any) => {
  //             this.generalService.get_diseases().subscribe({
  //               next: (result: any) => {
  //                 this.diseases = result.data;
  //               },
  //               error: (err: any) => {
  //                 this.router.navigate(['/error/internal']);
  //               },
  //               complete: () => {
  //                 const statusText = 'Disease created successfully';
  //                 this._snackBar.open(statusText, 'Ok', {
  //                   horizontalPosition: this.horizontalPosition,
  //                   verticalPosition: this.verticalPosition,
  //                 });
  //                 this.Form.controls['disease'].setValue(
  //                   result.data.attributes.disease_name
  //                 );
  //               },
  //             });
  //           },
  //           error: (err: any) => {
  //             this.router.navigate(['/error/internal']);
  //           },
  //           complete: () => { },
  //         });
  //     });
  // }

  // get_diseases() {
  //   this.generalService.get_diseases().subscribe({
  //     next: (result: any) => {
  //       this.diseases = result.data;
  //     },
  //     error: (err: any) => {
  //     },
  //     complete: () => {
  //     },
  //   });
  // }

  // checkinTimeValue(data: any) {
  //   const hoursVal = data.getHours();
  //   const minutesVal = data.getMinutes();
  //   const date = new Date(this.checkinDate.value);
  //   date.setHours(hoursVal, minutesVal);
  //   this.Form.controls['check_in'].setValue(new Date(date))
  // }
  // checkinDateVal(data: any) {
  //   const selectedDate = new Date(data.value);
  //   const currentTime = new Date();
  //   selectedDate.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
  //   this.Form.controls['check_in'].setValue(selectedDate);
  //   const dateWithoutTime = new Date(selectedDate).toISOString().slice(0, 10);
  //   this.Form.controls['check_in_date'].setValue(dateWithoutTime);
  // }

  // checkinDateVal(data: any) {
  //   const selectedDate = new Date(data.value);
  //   const currentCheckInTime = this.Form.controls['check_in'].value;

  //   if (currentCheckInTime) {
  //     const currentHours = new Date(currentCheckInTime).getHours();
  //     const currentMinutes = new Date(currentCheckInTime).getMinutes();


  //     selectedDate.setHours(currentHours, currentMinutes, 0, 0);
  //   }


  //   this.Form.controls['check_in'].setValue(selectedDate);


  //   const dateWithoutTime = selectedDate.toISOString().slice(0, 10);
  //   this.Form.controls['check_in_date'].setValue(dateWithoutTime);
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


  // checkinTimeValue(data: any) {


  //   const hoursVal = data.getHours();
  //   const minutesVal = data.getMinutes();


  //   const currentCheckInDate = new Date(this.Form.controls['check_in'].value);

  //   if (!isNaN(currentCheckInDate.getTime())) {

  //     currentCheckInDate.setHours(hoursVal, minutesVal, 0, 0);


  //     this.Form.controls['check_in'].setValue(currentCheckInDate);


  //   } else {
  //     console.error('Invalid date selected for check_in.');
  //   }
  // }

  // checkinTimeValue(data: any) {
  //   const hoursVal = data.getHours();
  //   const minutesVal = data.getMinutes();

  //   // Get the current check-in date from the form control.
  //   const currentCheckInDate = new Date(this.Form.controls['check_in'].value);

  //   if (!isNaN(currentCheckInDate.getTime())) {
  //     // Update the current check-in date with the new time.
  //     currentCheckInDate.setHours(hoursVal, minutesVal, 0, 0);

  //     // Update the form control with the new date-time.
  //     this.Form.controls['check_in'].setValue(currentCheckInDate);
  //   } else {
  //     console.error('Invalid date selected for check_in.');
  //   }
  // }
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

}
