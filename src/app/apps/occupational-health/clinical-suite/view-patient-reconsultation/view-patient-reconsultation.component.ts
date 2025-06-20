import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';
import { ViewMedicinePrescriptionComponent } from '../pharmacy-action/view-medicine-prescription/view-medicine-prescription.component';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Observable, filter } from 'rxjs';
import { clinical, ListColumn } from 'src/app/services/schemas';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
  selector: 'app-view-patient-reconsultation',
  templateUrl: './view-patient-reconsultation.component.html',
  styleUrls: ['./view-patient-reconsultation.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewPatientReconsultationComponent implements OnInit {

  bmiValue: any;
  bmiColor: any;
  bmiText: any;
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
  dataSourceMedical: MatTableDataSource<clinical>;



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
  medicalDetailsList: any[] = []
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
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
  followupDate = new FormControl(null);
  admittedDate = new FormControl(null);
  dischargedDate = new FormControl(null);

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

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private generalService: GeneralService,
    private clinicalService: ClinicalSuiteService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
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
    this.dialogRef.updateSize('50%');
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
      height: [''],
      blood_pressure: ['', [Validators.required]],
      random_blood_sugar: [''],
      department: [''],
      sub_department: [''],
      work_status: [''],
      body_temperature: [''],
      doctor_name: [''],
      doctor_designation: [''],
      designation: [''],

      severity_level: ['', [Validators.required]],
      disease: ['', [Validators.required]],
      health_issue_type: ['', [Validators.required]],
      category: ['', [Validators.required]],
      treatment: ['', [Validators.required]],
      follow_up_status: ['', [Validators.required]],
      sent_via_ambulance: [false, [Validators.required]],
      doctor_prescription: ['', [Validators.required]],
      hospital_location: ['', [Validators.required]],
      hospital_name: ['', [Validators.required]],
      refer_another_hospital_status: ['', [Validators.required]],
      follow_up_date: [null],
      admitted_date: [null],
      discharged_date: [null],
      clinic_division: [''],
      doctor_image: [''],
      created_by: [''],
      creator_designation: [''],
      employee_division: [''],
      lift_usage_required: [false],
      since_complaint: ['', [Validators.required]],
      recommended_duration: ['', [Validators.required]],
    });
    this.Form.disable()

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
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
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
          //this.Form.controls['reporter'].setValue(result.profile.id)
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
          this.get_inventory_details()
        }
      },
      error: () => {
        this.router.navigate(["/error/internal"]).then()
      },
      complete: () => { }
    })
  }

  get_inventory_details() {
    // const clinicalID = this.route.snapshot.paramMap.get('id');

    const clinicalID = this.defaults.id
    //const clinicalID = 116
    this.clinicalService.get_patient_details(clinicalID).subscribe({
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
          this.Form.controls['category'].setValue(result.data[0].attributes.category)
          this.Form.controls['health_issue_type'].setValue(result.data[0].attributes.health_issue_type)
          // this.Form.controls['symptoms'].setValue(result.data[0].attributes.symptoms)

          const symptoms = result.data[0].attributes.symptom;
          const defaultValues = symptoms
            ? symptoms.replace(/<[^>]*>/g, '').split(',').map((s: string) => s.trim())
            : [];
          this.Form.controls['symptoms'].setValue(defaultValues.join(', '));
          const celsius = result.data[0].attributes.body_temperature;

          if (celsius !== null && !isNaN(celsius)) {
            const fahrenheit = Math.round((celsius * 9 / 5 + 32) * 100) / 100; // Rounded to 2 decimals
            this.Form.controls['body_temperature'].setValue(fahrenheit);
          }
          // this.Form.controls['body_temperature'].setValue(result.data[0].attributes.body_temperature)
          this.Form.controls['doctor_name'].setValue(result.data[0].attributes.consulting_doctor.data?.attributes.first_name + ' ' + result.data[0].attributes.consulting_doctor.data?.attributes.last_name)
          this.Form.controls['created_by'].setValue(result.data[0].attributes.created_By.data.attributes.first_name + ' ' + result.data[0].attributes.created_By.data.attributes.last_name)

          this.Form.controls['doctor_designation'].setValue(result.data[0].attributes.consulting_doctor.data?.attributes.designation)
          this.Form.controls['creator_designation'].setValue(result.data[0].attributes.created_By.data.attributes.designation)

          this.Form.controls['severity_level'].setValue(result.data[0].attributes.severity_level)
          this.Form.controls['disease'].setValue(result.data[0].attributes.disease)
          this.Form.controls['follow_up_date'].setValue(result.data[0].attributes.follow_up_date)
          this.Form.controls['admitted_date'].setValue(result.data[0].attributes.admitted_date)
          this.Form.controls['discharged_date'].setValue(result.data[0].attributes.discharged_date)
          this.Form.controls['treatment'].setValue(result.data[0].attributes.treatment)
          this.Form.controls['follow_up_status'].setValue(result.data[0].attributes.follow_up_status)
          this.Form.controls['employee_division'].setValue(result.data[0].attributes.division)
          this.Form.controls['clinic_division'].setValue(result.data[0].attributes.clinic_division)
          this.Form.controls['refer_another_hospital_status'].setValue(result.data[0].attributes.refer_to_another_hospital)
          this.Form.controls['hospital_name'].setValue(result.data[0].attributes.hospital_name)
          this.Form.controls['hospital_location'].setValue(result.data[0].attributes.hospital_location)
          this.Form.controls['doctor_prescription'].setValue(result.data[0].attributes.doctor_prescription)
          this.Form.controls['sent_via_ambulance'].setValue(result.data[0].attributes.sent_via_ambulance)
          this.Form.controls['since_complaint'].setValue(result.data[0].attributes.since_complaint)
          this.Form.controls['recommended_duration'].setValue(result.data[0].attributes.recommended_duration)
          this.Form.controls['lift_usage_required'].setValue(result.data[0].attributes.lift_usage_required)


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
          if (result.data[0].attributes.medicine_details.data.length > 0) {

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
          if (result.data[0].attributes.admitted_date) {
            this.admittedDate.setValue(new Date(result.data[0].attributes.admitted_date))
            this.Form.controls['admitted_date'].setValue(result.data[0].attributes.admitted_date)
          }
          if (result.data[0].attributes.discharged_date) {

            this.dischargedDate.setValue(new Date(result.data[0].attributes.discharged_date))
            this.Form.controls['discharged_date'].setValue(result.data[0].attributes.discharged_date)
          }
          this.admittedDate.disable()
          this.followupDate.disable()
          this.dischargedDate.disable()
        }
      },
      error: () => { },
      complete: () => {
        this.prepareView()
        this.bmiCalc()

      }
    })

  }
  // get_prescription_details() {
  //   const clinicalID = this.route.snapshot.paramMap.get('id');
  //   this.clinicalService.get_clinical_details(clinicalID).subscribe({
  //     next: (result: any) => {
  //
  //       if (result.data[0].attributes.medical_prescriptions.data.length > 0) {
  //         this.prescriptionList = result.data[0].attributes.medical_prescriptions.data
  //         this.prepareView()
  //       } else {
  //         this.prescriptionList = []
  //       }
  //
  //     },
  //     error: (err: any) => { },
  //     complete: () => {
  //
  //     }
  //   })
  //
  // }

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

  viewPrescription(data: any) {
    this.dialog.open(ViewMedicinePrescriptionComponent, { data: data })
  }

  // issuePrescription(data: any) {
  //
  //
  // }
  enable_Lift_Usage(event: any) {

    if (event.currentTarget.checked === true) {
      this.Form.controls['since_complaint'].enable()
      this.Form.controls['recommended_duration'].enable()
    } else {
      this.Form.controls['since_complaint'].disable()
      this.Form.controls['recommended_duration'].disable()
    }


  }

  submit() {
    this.router.navigate(["/apps/occupational-health/clinical-suite/register"])
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

}
