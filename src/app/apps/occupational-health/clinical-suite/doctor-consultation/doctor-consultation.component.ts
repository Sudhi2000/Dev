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
import { CreateMedicalPrescriptionComponent } from './create-medical-prescription/create-medical-prescription.component';
import { ReplaySubject, Observable, filter, startWith, map, of } from 'rxjs';
import { clinical, ListColumn } from 'src/app/services/schemas';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewMedicalPrescriptionComponent } from './view-medical-prescription/view-medical-prescription.component';
import { NewDiseaseComponent } from '../../../general-component/new-disease/new-disease.component';
import { ViewPatientReconsultationComponent } from '../view-patient-reconsultation/view-patient-reconsultation.component';
import { validate } from 'uuid';
import { MatSelectChange } from '@angular/material/select';
import { SelectLanguageComponent } from './select-language/select-language.component';
import { CreateHospitalComponent } from './create-hospital/create-hospital.component';
import { IssueMedicinePrescriptionComponent } from '../pharmacy-action/issue-medicine-prescription/issue-medicine-prescription.component';
import { UpdateCheckOutComponent } from '../pharmacy-action/update-check-out/update-check-out.component';
const { Configuration, OpenAIApi } = require("openai");
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
  selector: 'app-doctor-consultation',
  templateUrl: './doctor-consultation.component.html',
  styleUrls: ['./doctor-consultation.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DoctorConsultationComponent implements OnInit {

  subject$: ReplaySubject<clinical[]> = new ReplaySubject<clinical[]>(1);
  data$: Observable<clinical[]> = this.subject$.asObservable();
  customers: clinical[];
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
  diseaseControl = new FormControl({ value: '', disabled: true }, [Validators.required]);
  SelectHospital = new FormControl('', { validators: [Validators.required] });
  filteredDiseases!: Observable<any[]>;
  HospitalList: any[] = []

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

  bmiValue: any;
  bmiColor: any;
  bmiText: any;
  btnStyle: any;

  patientHistory: any[] = []
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
  prescriptionList: any[] = []
  medicalDetailsList: any[] = []
  doctor_prescription: any[] = []
  evidenceCertificateFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  evidenceData: any
  dropdownValues: any
  createduserid: any
  pdfSource: any
  report: any
  imglnk: any = environment.client_backend + '/uploads/'
  format: any = ".png"
  currency: string
  followupDate = new FormControl(null);
  admittedDate = new FormControl(null);
  dischargedDate = new FormControl(null);
  severityLevel: any[] = []
  doctor_id: any
  isCompleted: boolean = false;
  category: any[] = []
  filteredHospitals: Observable<any[]>;
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
  allDiseases: any[] = [];

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
      check_in: [null],
      employee_name: [''],
      employee_id: ['', [Validators.required]],
      status: [''],
      age: [''],
      gender: [''],
      symptoms: [''],
      weight: ['', [Validators.required]],
      height: ['', [Validators.required]],

      blood_pressure: ['', [Validators.required]],
      random_blood_sugar: [''],
      department: [''],
      sub_department: [''],
      work_status: [''],
      body_temperature: [''],
      doctor_name: [''],
      doctor_designation: [''],
      designation: [''],
      employee_division: [''],

      severity_level: [''],
      category: [''],
      disease: [''],
      treatment: ['', [Validators.required]],
      doctor_prescription: [''],
      follow_up_status: [false, [Validators.required]],
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
      refer_patient: [false],
      refer_to_home: [false],
      refer_option: [''],
      health_issue_type: [{ value: '', disabled: true }],
      leave_days: [''],
      check_out: [null],
      check_out_date: [null]


    });
    this.get_hosptals()
    this.SelectHospital.valueChanges.subscribe(value => {
      if (value == "") {
        this.filteredHospitals = this.SelectHospital.valueChanges.pipe(
          startWith(''),
          map(value => this._filterHospitalNames(value))
        );
      }
      else {
        this._filterHospitalNames(value)
      }
    })
    // this.filteredDiseases = this.diseaseControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterDiseases(value || ''))
    // );


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




  }

  enable_Lift_Usage(event: any) {

    if (event.currentTarget.checked === true) {

      this.Form.controls['since_complaint'].setValidators([Validators.required]);
      this.Form.controls['since_complaint'].updateValueAndValidity();
      this.Form.controls['recommended_duration'].setValidators([Validators.required]);
      this.Form.controls['recommended_duration'].updateValueAndValidity();


    } else {
      this.Form.controls['since_complaint'].clearValidators();
      this.Form.controls['since_complaint'].updateValueAndValidity();
      this.Form.controls['recommended_duration'].clearValidators();
      this.Form.controls['recommended_duration'].updateValueAndValidity();

    }


  }
  refer_another_hospital_status(event: any): void {
    if (event.currentTarget.checked === true) {
      this.Form.controls['hospital_name'].setValidators([Validators.required]);
      this.Form.controls['hospital_location'].setValidators([Validators.required]);
      this.Form.controls['doctor_prescription'].setValidators([Validators.required]);
      this.Form.controls['admitted_date'].setValidators([Validators.required]);
      this.Form.controls['discharged_date'].setValidators([Validators.required]);
      this.Form.controls['hospital_name'].updateValueAndValidity();
      this.Form.controls['hospital_location'].updateValueAndValidity();
      this.Form.controls['doctor_prescription'].updateValueAndValidity();
      this.Form.controls['admitted_date'].updateValueAndValidity();
      this.Form.controls['discharged_date'].updateValueAndValidity();

    } else {
      this.Form.controls['hospital_name'].clearValidators();
      this.Form.controls['hospital_location'].clearValidators();
      this.Form.controls['doctor_prescription'].clearValidators();
      this.Form.controls['admitted_date'].clearValidators();
      this.Form.controls['discharged_date'].clearValidators();
      this.Form.controls['hospital_name'].updateValueAndValidity();
      this.Form.controls['hospital_location'].updateValueAndValidity();
      this.Form.controls['doctor_prescription'].updateValueAndValidity();
      this.Form.controls['admitted_date'].updateValueAndValidity();
      this.Form.controls['discharged_date'].updateValueAndValidity();


    }
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
        this.createduserid = result.id
        const status = result.clin_consultation
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
            }
          }
          this.get_diseases()
          this.get_dropdown_values()


          this.get_prescription_details()
          this.get_clinic_details()


        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  private _filterDiseases(value: string): any[] {

    const filterValue = value.toLowerCase();

    return this.diseases.filter(disease =>
      disease.attributes.disease_name.toLowerCase().includes(filterValue)
    );
  }

  get_dropdown_values() {

    const module = "Occupational Health"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (genderResult: any) => {

        //Gender
        const data = genderResult.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Severity Level")
        })
        this.severityLevel = data

      },
      error: (err: any) => { },
      complete: () => { }
    })

  }

  get_hosptals() {
    this.clinicalService.get_hospital_names().subscribe({
      next: (result: any) => {
        this.HospitalList = result.data
        this.filteredHospitals = of(this.HospitalList)

      },
      error: (err: any) => { },
      complete: () => { }
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

        if ((result.data[0].attributes.patient_status !== 'Completed') && (matchFound || matchFound !== false)) {
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

          this.Form.controls['blood_pressure'].setValue(result.data[0].attributes.blood_pressure)
          this.Form.controls['random_blood_sugar'].setValue(result.data[0].attributes.random_blood_sugar)
          this.Form.controls['designation'].setValue(result.data[0].attributes.designation)
          this.Form.controls['department'].setValue(result.data[0].attributes.department)
          this.Form.controls['sub_department'].setValue(result.data[0].attributes.sub_department)
          this.Form.controls['work_status'].setValue(result.data[0].attributes.work_status)
          this.Form.controls['symptoms'].setValue(result.data[0].attributes.symptom)
          const celsius = result.data[0].attributes.body_temperature;

          if (celsius !== null && !isNaN(celsius)) {
            const fahrenheit = Math.round((celsius * 9 / 5 + 32) * 100) / 100; // Rounded to 2 decimals
            this.Form.controls['body_temperature'].setValue(fahrenheit);
          }
          // this.Form.controls['body_temperature'].setValue(result.data[0].attributes.body_temperature)
          this.Form.controls['doctor_name'].setValue(result.data[0].attributes.consulting_doctor.data.attributes.first_name + ' ' + result.data[0].attributes.consulting_doctor.data.attributes.last_name)
          this.doctor_id = result.data[0].attributes.consulting_doctor.data?.id
          this.Form.controls['created_by'].setValue(result.data[0].attributes.created_By.data.attributes.first_name + ' ' + result.data[0].attributes.created_By.data.attributes.last_name)

          this.Form.controls['doctor_designation'].setValue(result.data[0].attributes.consulting_doctor.data.attributes.designation)
          this.Form.controls['creator_designation'].setValue(result.data[0].attributes.created_By.data.attributes.designation)

          this.Form.controls['severity_level'].setValue(result.data[0].attributes.severity_level)
          this.Form.controls['disease'].setValue(result.data[0].attributes.disease)
          this.Form.controls['health_issue_type'].setValue(result?.data[0]?.attributes?.health_issue_type)
          this.Form.controls['health_issue_type'].disable()

          this.diseaseControl.setValue(result.data[0].attributes.disease)
          this.Form.controls['follow_up_date'].setValue(result.data[0].attributes.follow_up_date)
          this.Form.controls['category'].setValue(result.data[0].attributes.category)


          this.Form.controls['admitted_date'].setValue(result.data[0].attributes.admitted_date)
          this.Form.controls['discharged_date'].setValue(result.data[0].attributes.discharged_date)
          this.Form.controls['treatment'].setValue(result.data[0].attributes.treatment)
          this.Form.controls['follow_up_status'].setValue(result.data[0].attributes.follow_up_status)
          this.Form.controls['employee_division'].setValue(result.data[0].attributes.division)
          this.Form.controls['clinic_division'].setValue(result.data[0].attributes.clinic_division)
          this.Form.controls['refer_patient'].setValue(result.data[0].attributes.refer_patient)
          this.Form.controls['leave_days'].setValue(result.data[0].attributes.leave_days)
          // this.Form.controls['refer_another_hospital_status'].setValue(result.data[0].attributes.refer_to_another_hospital)
          this.Form.controls['hospital_name'].setValue(result.data[0].attributes.hospital_name)
          this.SelectHospital.setValue(result.data[0].attributes.hospital_name)

          this.Form.controls['hospital_location'].setValue(result.data[0].attributes.hospital_location)
          this.Form.controls['doctor_prescription'].setValue(result.data[0].attributes.doctor_prescription)
          this.Form.controls['sent_via_ambulance'].setValue(result.data[0].attributes.sent_via_ambulance)
          this.Form.controls['since_complaint'].setValue(result.data[0].attributes.since_complaint)
          this.Form.controls['recommended_duration'].setValue(result.data[0].attributes.recommended_duration)
          this.Form.controls['lift_usage_required'].setValue(result.data[0].attributes.lift_usage_required)


          if (result.data[0].attributes.category) {
            this.diseaseControl.enable()
          }
          if (result.data[0].attributes.disease) {
            const mockEvent: MatSelectChange = {
              source: null as any,
              value: result.data[0].attributes.category
            };

            this.onCategoryChange(mockEvent, 'initial');
          }
          if (result.data[0].attributes.patient_histories.data?.length > 0) {
            this.patientHistory = result.data[0].attributes.patient_histories.data

          } else {
            this.patientHistory = []
          }
          if (result.data[0].attributes.refer_to_home === true) {
            this.Form.controls['refer_option'].setValue('home');
          }
          if (result.data[0].attributes.refer_to_another_hospital === true) {
            this.Form.controls['refer_option'].setValue('hospital');
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
          this.router.navigate(["/apps/occupational-health/clinical-suite/consultation"])
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
        this.Form.controls['work_status'].disable()
        this.Form.controls['symptoms'].disable()
        this.Form.controls['age'].disable()
        this.Form.controls['designation'].disable()
        this.Form.controls['body_temperature'].disable()
        this.Form.controls['weight'].disable()
        this.Form.controls['height'].disable()
        this.Form.controls['blood_pressure'].disable()
        this.Form.controls['random_blood_sugar'].disable()
        this.Form.controls['employee_division'].disable()
        this.prepareView()
      }
    })

  }
  get_medical_details() {
    const clinicalID = this.route.snapshot.paramMap.get('id');
    this.clinicalService.get_clinical_details(clinicalID).subscribe({
      next: (result: any) => {
        this.medicalDetailsList = []


        if (result.data[0].attributes.medicine_details.data.length > 0) {
          const medicalDetailsList = result.data[0].attributes.medicine_details.data;
          const updatedPrescriptionList = medicalDetailsList.forEach((prescription: any) => {
            prescription.attributes.outside_medicine = prescription.attributes.outside_medicine ? '<i class="feather icon-check-circle btn-icon-prepend"></i>' : "";

          });
          this.medicalDetailsList = medicalDetailsList
        } else {
          this.medicalDetailsList = []
        }

      },
      error: (err: any) => { },
      complete: () => {
        this.prepareView()

      }
    })

  }

  onDiseaseInputBlur(): void {
    const currentValue = this.diseaseControl.value;
    const matchedDisease = this.diseases.some(disease =>
      disease.attributes.disease_name.toLowerCase() === currentValue?.toLowerCase()
    );


    if (!matchedDisease) {
      this.diseaseControl.setValue(null);
      this.Form.controls['disease'].reset();
    }
    else {
      this.diseaseControl.setValue(currentValue)
      this.Form.controls['disease'].setValue(currentValue)
    }
  }

  get_prescription_details() {
    const clinicalID = this.route.snapshot.paramMap.get('id');
    this.clinicalService.get_clinical_details(clinicalID).subscribe({
      next: (result: any) => {
        this.prescriptionList = []


        if (result.data[0].attributes.medical_prescriptions.data.length > 0) {
          const prescriptionList = result.data[0].attributes.medical_prescriptions.data;
          const updatedPrescriptionList = prescriptionList.forEach((prescription: any) => {
            prescription.attributes.outside_medicine = prescription.attributes.outside_medicine ? '<i class="feather icon-check-circle btn-icon-prepend"></i>' : "";
          });
          this.prescriptionList = prescriptionList

        } else {
          this.prescriptionList = []
        }


      },
      error: (err: any) => { },
      complete: () => {
        this.prepareView()

      }
    })

  }

  onOptionSelected(event: any) {
    this.Form.controls['hospital_name'].setValue(event.option.value)
  }

  create_hospital_name() {
    this.dialog.open(CreateHospitalComponent).afterClosed().subscribe(data => {
      if (data) {
        const enteredData = data.name.trim().toLowerCase(); // Convert input to lowercase
        const found = this.HospitalList.find(
          elem => elem.attributes.name.trim().toLowerCase() === enteredData
        );
        if (found) {
          const statusText = "Hospial name already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.Form.controls['hospital_name'].reset()
          this.SelectHospital.reset()
        }
        else {
          this.clinicalService.create_hospital_name(data.name, this.doctor_id).subscribe({
            next: (result: any) => {
              this.SelectHospital.setValue(data.name)
              this.Form.controls['hospital_name'].setValue(data.name);
              this.get_hosptals()
            },
            error: (err: any) => { },
            complete: () => {

            }
          });
        }
      }
    });

  }

  update_hospital_name(ID: any) {
    this.dialog.open(CreateHospitalComponent, { data: ID }).afterClosed().subscribe((updatedData: any) => {
      if (updatedData) {
        const enteredData = updatedData.name.trim().toLowerCase(); // Convert input to lowercase
        const found = this.HospitalList.find(
          elem => elem.attributes.name.trim().toLowerCase() === enteredData
        );
        if (found) {
          const statusText = "Hospial name already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.Form.controls['hospital_name'].reset()
          this.SelectHospital.reset()
        } else {
          this.clinicalService.update_hospital_name(updatedData).subscribe({
            next: (result: any) => {
              this.clinicalService.get_hospital_names().subscribe({
                next: (result: any) => {
                  this.HospitalList = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Hospital name updated successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['hospital_name'].setValue(result.data.attributes.name)
                  this.SelectHospital.setValue(result.data.attributes.name)
                }
              })
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => { }
          })
        }
      }
    })
  }
  delete_hospital_name(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the hospital name.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clinicalService.delete_hospital_name(id).subscribe({
          next: (result: any) => {
            this.Form.controls.hospital_name.reset()
            this.SelectHospital.reset()
          },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Hospital name deleted"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_hosptals()
          }
        })
      }
    })
  }


  onInputFocus() {
    this.filteredHospitals = this.SelectHospital.valueChanges.pipe(
      startWith(''),
      map(value => this._filterHospitalNames(value))
    );
  }


  private _filterHospitalNames(value: any) {
    const filterValue = value?.toLowerCase();
    let data = this.HospitalList?.filter(option => option.attributes.name?.toLowerCase().includes(filterValue));
    return data;
  }

  ngDoCheck(): void {
    this.SelectHospital.valueChanges.subscribe(value => {
      if (value == "") {
        this.filteredHospitals = this.SelectHospital.valueChanges.pipe(
          startWith(''),
          map(value => this._filterHospitalNames(value))
        );
      }
      else {
        this._filterHospitalNames(value)
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

  followupDateVal(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['follow_up_date'].setValue(selecteddate)
  }
  admittedDateVal(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['admitted_date'].setValue(selecteddate)
  }
  dischargedDateVal(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['discharged_date'].setValue(selecteddate)
  }

  createPrescription() {
    this.dialog.open(CreateMedicalPrescriptionComponent, { data: this.prescriptionList }).afterClosed().subscribe(data => {
      if (data) {
        this.showProgressPopup();
        this.clinicalService.create_prescription(data, this.Form.value.id).subscribe({
          next: (result: any) => {
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            const statusText = "Medicine prescription Created"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            Swal.close()
            this.get_prescription_details()
          }
        })
      }
    })
  }
  createMedicalDetails() {
    this.dialog.open(CreateMedicalPrescriptionComponent, { data: this.medicalDetailsList }).afterClosed().subscribe(data => {
      if (data) {




        this.showProgressPopup();
        this.clinicalService.create_medical_details(data, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            const statusText = "Medicine Details Created"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            Swal.close()
            this.get_medical_details()
          }
        })
      }
    })
  }

  issuePrescription(data: any) {
    if (data.attributes.outside_medicine) {
      const clinicDiv = this.Form.value.clinic_division;

      //
      const presId = data.id;
      const status = 'Issued';
      this.dialog
        .open(IssueMedicinePrescriptionComponent, { data: { data, clinicDiv } })
        .afterClosed()
        .subscribe((comData) => {
          if (comData.issue_status === 'Issued') {
            const quantity = comData.issuing_quantity
            this.showProgressPopup();
            this.clinicalService
              .update_prescription_status(status, presId, quantity)
              .subscribe({
                next: (result: any) => { },
                error: (err: any) => { },
                complete: () => {
                  const statusText = 'Medicine issued';
                  this._snackBar.open(statusText, 'OK', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  Swal.close();
                  this.get_prescription_details();
                },
              });
          }



        });

    } else {
      const clinicDiv = this.Form.value.clinic_division;
      const medID = data.attributes.medicine_uuid;
      this.clinicalService.get_medical_stock_id(medID, clinicDiv).subscribe({
        next: (result: any) => {
          if (result.data.length > 0) {
            const stockId = result.data[0].id;
            const bal = result.data[0].attributes?.balance;
            this.dialog
              .open(IssueMedicinePrescriptionComponent, {
                data: { data, clinicDiv },
              })
              .afterClosed()
              .subscribe((comData) => {
                if (comData) {
                  this.showProgressPopup();
                  const presId = comData.id;
                  const status = comData.issue_status;
                  const issued = comData.issuing_quantity;
                  const quantity = comData.issuing_quantity

                  const balance = Number(bal) - Number(issued);
                  this.clinicalService
                    .update_issued_medical_stock(stockId, issued, balance)
                    .subscribe({
                      next: (result: any) => {
                        this.clinicalService
                          .update_prescription_status(status, presId, quantity)
                          .subscribe({
                            next: (result: any) => { },
                            error: (err: any) => { },
                            complete: () => {
                              const statusText = 'Medicine issued';
                              this._snackBar.open(statusText, 'OK', {
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                              });
                              Swal.close();
                              this.get_prescription_details();
                            },
                          });
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

  deletePrescription(data: any) {


    this.showProgressPopup();
    this.clinicalService.delete_prescription(data.id).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "Medicine prescription Deleted"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
        this.get_prescription_details()
        this.get_medical_details()
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
      }
    });
  }

  submit() {
    this.Form.controls['status'].setValue('Completed')
    this.confirmation()
  }

  confirmation() {
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
        this.Form.controls['status'].setValue('Pending')
      }

    })
  }

  draft() {

    this.confirmation()


  }

  update_clinical_suite() {
    this.Form.controls['health_issue_type'].enable()
    const { lift_usage_required, refer_another_hospital_status } = this.Form.value;

    if (lift_usage_required != false || refer_another_hospital_status != false) {
      this.update()
    }

    if (lift_usage_required === false) {

      this.Form.controls['since_complaint'].enable()
      this.Form.controls['recommended_duration'].enable()
      this.Form.controls['since_complaint'].setValue('')
      this.Form.controls['recommended_duration'].setValue('')
    }
    // else {

    //   this.update()
    // }

    if (refer_another_hospital_status === false) {

      this.admittedDate.setValue('')
      this.dischargedDate.setValue('')
      this.clinicalService.update_clinical_suite_field_remove(this.Form.value).subscribe({
        next: (result: any) => {
          if (result.data.attributes.patient_status === "Completed") {
            if (lift_usage_required === false) {
              this.isCompleted = true
              this.UpdateMedicineStatus()

            }

            if (this.isCompleted == false) {
              Swal.fire({
                title: 'Consulation Completed111',
                imageUrl: "assets/images/patient-record.gif",
                imageWidth: 250,
                text: "You have successfully completed a consulation. Kindly redirect the patient to the pharmacy to collect the medicine if have.",
                showCancelButton: false,
              }).then((result) => {
                this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
                this.router.navigate(["/apps/occupational-health/clinical-suite/consultation"])
              })
            }

          } else if (result.data.attributes.patient_status === "Pending") {
            Swal.close()
            const statusText = "Details updated successfully"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.files = []
            this.get_clinic_details()
          }
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          // this.medicalDetailsList.map((data) => {
          //   this.deletePrescription(data)
          // })
        }
      })
    }
    // else {
    //   alert("4")
    //   this.update()
    // }



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


  update() {

    this.clinicalService.update_clinical_suite(this.Form.value).subscribe({
      next: (result: any) => {
        const clinicalid = this.Form.value.id
        if (result.data.attributes.patient_status === "Completed") {
          this.isCompleted = true
          this.UpdateMedicineStatus()

          // Swal.fire({
          //   title: 'Consulation Completed',
          //   imageUrl: "assets/images/patient-record.gif",
          //   imageWidth: 250,
          //   text: "You have successfully completed a consulation. Kindly redirect the patient to the pharmacy to collect the medicine if have.",
          //   showCancelButton: false,
          // }).then((result) => {
          //   this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
          //   // this.router.navigate(["/apps/occupational-health/clinical-suite/consultation"])
          // })
        } else if (result.data.attributes.patient_status === "Pending") {
          Swal.close()
          const statusText = "Details updated successfully"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.files = []
          this.get_clinic_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {

      }
    })
  }


  UpdateMedicineStatus() {
    this.dialog.open(UpdateCheckOutComponent).afterClosed().subscribe(data => {
      this.showProgressPopup();
      const presId = this.Form.value.id;
      this.clinicalService.mark_check_out(presId, data).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          Swal.close()
          Swal.fire({
            title: 'Consulation Completed',
            imageUrl: "assets/images/patient-record.gif",
            imageWidth: 250,
            text: "You have successfully completed a consulation. Kindly redirect the patient to the pharmacy to collect the medicine if have.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
          })
        },
      });
    })
  }


  view(presData: any) {
    this.dialog.open(ViewMedicalPrescriptionComponent, { data: presData })

  }
  viewPatientHistory(presData: any) {

    this.dialog.open(ViewPatientReconsultationComponent, { data: presData })

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

  new_disease() {
    this.dialog
      .open(NewDiseaseComponent)
      .afterClosed()
      .subscribe((data: any) => {
        const name = data.disease_name;
        const health_issue_type = this.Form.controls['health_issue_type'].value;
        const category = this.Form.controls['category'].value;

        let newDisease = { name, health_issue_type, category }



        this.generalService
          .create_diseases(newDisease, this.Form.value.reporter)
          .subscribe({
            next: (result: any) => {
              this.generalService.get_diseases().subscribe({
                next: (result: any) => {
                  // this.diseases = result.data;
                  this.allDiseases = result.data;

                  this.diseases = this.allDiseases.filter((data: any) =>
                    data.attributes.category.toLowerCase() === category.toLowerCase()
                  );
                },
                error: (err: any) => {
                  this.router.navigate(['/error/internal']);
                },
                complete: () => {
                  const statusText = 'Disease created successfully';
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['disease'].setValue(
                    result.data.attributes.disease_name
                  );
                  this.diseaseControl.setValue(result.data.attributes.disease_name);
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

  get_diseases() {
    this.generalService.get_diseases().subscribe({
      next: (result: any) => {
        this.allDiseases = result.data;




        const response = result.data;
        this.category = response.filter((obj: any, index: number, self: any) =>
          index === self.findIndex((o: any) => o.attributes.category === obj.attributes.category)
        );
      },
      error: (err: any) => {
      },
      complete: () => {
      },
    });
  }


  // ReferPatient(event: Event): void {
  //   const checked = (event.target as HTMLInputElement).checked;
  //   if (checked) {
  //     this.Form.controls['refer_patient'].setValue(true);
  //   }

  //   console.log("refer patient", this.Form.value.refer_patient);
  // }

  // onReferOptionChange(option: string): void {
  //   if (option === 'home') {  // Corrected comparison operator
  //     this.Form.controls['refer_to_home'].setValue(true);
  //     this.Form.controls['refer_another_hospital_status'].setValue(false);
  //     console.log("refer home", this.Form.value.refer_to_home);
  //   } else if (option === 'hospital') {  // Corrected comparison operator
  //     this.Form.controls['refer_another_hospital_status'].setValue(true);
  //     this.Form.controls['refer_to_home'].setValue(false);
  //     console.log("refer hospital", this.Form.value.refer_another_hospital_status);
  //   }
  // }



  ReferPatient(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.Form.controls['refer_patient'].setValue(checked);
    this.Form.controls['refer_option'].setValue(null);
  }

  onReferOptionChange(option: string): void {
    this.Form.controls['refer_option'].setValue(option);
    if (option === 'home') {
      this.Form.controls['refer_to_home'].setValue(true);
      this.Form.controls['refer_another_hospital_status'].setValue(false);
    } else if (option === 'hospital') {
      this.Form.controls['refer_another_hospital_status'].setValue(true);
      this.Form.controls['refer_to_home'].setValue(false);
    }
  }

  blockInvalidKeys(event: KeyboardEvent) {
    const invalidChars = ['e', 'E', '+', '-'];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }

  navigate() {
    this.router.navigate(["apps/occupational-health/clinical-suite/consultation"])
    this.backToHistory = true

  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
  onCategoryChange(event: MatSelectChange, action: string): void {
    const selectedCategory = event.value;




    // Enable and reset disease control
    if (action === 'change') {
      this.diseaseControl.enable();
      this.diseaseControl.setValue('');
      this.diseaseControl.setErrors({ required: true });
      this.diseaseControl.updateValueAndValidity();
      this.Form.controls['disease'].setValue('')
    }



    // Filter diseases based on selected category
    this.diseases = this.allDiseases.filter((data: any) =>
      data?.attributes?.category?.toLowerCase() === selectedCategory.toLowerCase()
    );



    // Set default health issue type if diseases exist
    if (this.diseases.length > 0) {
      const defaultHealthIssue = this.diseases[0]?.attributes?.health_issue_type;
      this.Form.controls['health_issue_type'].setValue(defaultHealthIssue);
    }

    // Setup autocomplete filter

    this.filteredDiseases = this.diseaseControl.valueChanges.pipe(
      startWith(this.diseaseControl.value || ''), // key part for initial load
      map(value => this._filterDiseases(value || ''))
    );
  }




  checkDescription() {

    this.dialog.open(SelectLanguageComponent).afterClosed().subscribe((data: any) => {


      const selectedLanguage = data?.language;  // <-- Get selected language from dialog

      const category = this.Form.value.category;
      const disease = this.Form.value.disease;
      const severityLevel = this.Form.value.severity_level;

      if (category && disease && severityLevel) {
        document.getElementById('error-text')?.classList.add("hide");

        // Create the treatment prompt **in English** but request response **in selected language**
        const treatmentPrompt = `
          Category: ${category}, Disease: ${disease}, Severity Level: ${severityLevel}.
          Based on this information, generate a treatment plan.
          Format the output strictly as HTML bullet points using <ul><li>...</li></ul>.
          Each bullet point should be a short and clear instruction about diet, physical activity, medication (if needed), warning signs to monitor, and follow-up advice.
          Use professional, simple language suitable for patient guidance.
          Answer strictly in ${selectedLanguage}.
        `;

        this.chatGPT(treatmentPrompt);

      } else {
        document.getElementById('error-text')?.classList.remove("hide");
      }
    });

  }

  async chatGPT(promptText: string) {
    document.getElementById('ai-loader')?.classList.remove("hide");
    document.getElementById('ai-suggest')?.classList.add("hide");

    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    let requestData = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptText }],
    };
    let apiResponse = await openai.createChatCompletion(requestData);

    // const completion_tokens = apiResponse.data.usage.completion_tokens;
    // const prompt_tokens = apiResponse.data.usage.prompt_tokens;
    // const total_tokens = apiResponse.data.usage.total_tokens;

    // Assume you want to set treatment text into formcontrol
    this.Form.controls['treatment'].setValue(apiResponse.data.choices[0].message.content);

    document.getElementById('ai-loader')?.classList.add("hide");
    document.getElementById('ai-suggest')?.classList.remove("hide");
  }


}

