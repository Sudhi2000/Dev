import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { ChartType, consultationChart, departmentChart, patientflowChart, severityLevelChart, radialChart, waitingChart, genderChart, ageChart, divisionChart, diseaseChart, crossDivisionChart, maternityChart } from './chart-model';
import { ClinicalSuiteService } from 'src/app/services/clinical-suite.api.service';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import { MaternityRegisterService } from 'src/app/services/maternity-register.service';
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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DashboardComponent implements OnInit {
  filterForm: FormGroup
  orgID: string
  dropdown_values: any[] = []
  doctors: any[] = []
  doctorNames: any[] = []
  doctorCounts: any[] = []
  summaryCard: any[] = []
  medicineCard: any[] = []
  radialChart: ChartType
  genderChart: ChartType
  ageChart: ChartType
  crossDivision: ChartType
  medicines: any[] = []
  maleCount: any
  femaleCount: any
  highCount: any
  mediumCount: any
  lowCount: any
  RecentPatientList: any[] = []
  employeeName: any[] = []
  patientflowChart: ChartType
  consultationChart: ChartType
  departmentChart: ChartType
  divisionChart: ChartType
  diseaseChart: ChartType
  severityLevelChart: ChartType
  waitingChart: ChartType
  crossDivisionChart: ChartType
  occupational_data: any[] = []
  crossoccupational_data: any[] = []
  prev_occupational_data: any[] = []
  medicine_data: any[] = []
  prev_medicine_data: any[] = []
  maternityrecord_data: any[] = []
  departmentNames: string[] = [];
  departmentCounts: number[] = [];
  maternityRecordChart: ChartType
  divisionNames: string[] = [];
  divisionCounts: number[] = [];
  supplierNames: any[] = []
  topVisitedCard: any[] = []
  diseaseNames: string[] = [];
  diseaseCounts: number[] = [];
  dateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  filterDateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  prevDateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  unitSpecific: any
  userDivision: any
  initialUserDivision: any
  corporateUser: any
  divisions: any[] = []
  Division = new FormControl(['']);
  division_uuids: any[] = [];
  selectedDivisionsFilter: string = '';
  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private occupationalService: ClinicalSuiteService,
    private medicineService: MedicineInventoryService,
    private maternityService: MaternityRegisterService) { }

  ngOnInit() {
    this.radialChart = radialChart,
      this.ageChart = ageChart
    this.waitingChart = waitingChart
    this.genderChart = genderChart
    this.consultationChart = consultationChart
    this.departmentChart = departmentChart
    this.divisionChart = divisionChart
    this.diseaseChart = diseaseChart
    this.patientflowChart = patientflowChart
    this.severityLevelChart = severityLevelChart
    this.crossDivisionChart = crossDivisionChart
    this.maternityRecordChart = maternityChart

    this.configuration()
    this.filterForm = this.formBuilder.group({
      division: [''],
      start: [''],
      end: [''],
      year: [],
      count: ['']
    })
    this.showProgressPopup()
    var curr = new Date()
    const monthStart = new Date(curr.getUTCFullYear(), curr.getMonth(), 1);



    const monthEnd = new Date();
    const monthStartDate = monthStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
      monthStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
      monthStart.toLocaleDateString("en-US", { year: 'numeric' })



    const monthEndDate = monthEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
      monthEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
      monthEnd.toLocaleDateString("en-US", { year: 'numeric' })


    this.dateRange.controls['start'].setValue(new Date(monthStart))
    this.dateRange.controls['end'].setValue(new Date(monthEnd))
    this.filterDateRange.controls['start'].setValue(monthStart)
    this.filterDateRange.controls['end'].setValue(monthEnd)



    const lastMonthstart = new Date(curr.getFullYear(), curr.getMonth() - 1);
    lastMonthstart.setDate(lastMonthstart.getDate())
    const lastMonthEnd = new Date(curr.getFullYear(), curr.getMonth(), 0)
    lastMonthEnd.setDate(lastMonthEnd.getDate())
    this.prevDateRange.controls['start'].setValue(new Date(lastMonthstart))
    this.prevDateRange.controls['end'].setValue(new Date(lastMonthEnd))
  }

  startDateChange(date: any) {
    this.filterForm.controls['year'].reset()
    const selecteddate = new Date(date.value)


    this.filterForm.controls['start'].setValue(selecteddate)
    this.filterDateRange.controls['start'].setValue(selecteddate)
  }

  endDateChange(date: any) {
    const selecteddate = new Date(date.value)
    this.filterForm.controls['end'].setValue(selecteddate)
    this.filterDateRange.controls['end'].setValue(selecteddate)

  }

  search() {
    this.showProgressPopup()
    this.get_occupational_data()

  }

  reset() {
    this.dateRange.reset()
    this.filterDateRange.reset()
    this.filterForm.reset()
    this.ngOnInit()
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          Swal.close()
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.occupational_dashboard
        if (status === false) {
          Swal.close()
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (!this.corporateUser) {

              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
                this.division_uuids.push(elem.division_uuid)
                this.divisions = result.profile.divisions
              })
              let results = divisions.join('&');
              this.initialUserDivision = results;
              this.userDivision = results
              this.divisionNames = result.profile.divisions.map((division: any) => division.division_name).join(', ');

            } else {
              this.get_divisions();

            }
          }
          this.initialData()
          this.supplier_names()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {

        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
          division_uuid: attributes.division_uuid
        }));
        this.divisions = newArray
        this.divisionNames = result.data.map((division: any) => division.attributes.division_name).join(', ');
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });

  }
  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Loading data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  initialData() {
    this.get_occupational_data()
  }
  occDiv(event: any) {
    if (event.value && event.value.length > 0) {
      this.divisionNames = event.value
        .map((division: any) => division.division_name)
        .join(', ');
      this.selectedDivisionsFilter = event.value
        .map((division: any) => 'filters[business_unit][division_uuid][$in]=' + division.division_uuid)
        .join('&');

      // Also set userDivision for corporate users (fallback usage)
      this.userDivision = this.selectedDivisionsFilter;

    } else {
      this.selectedDivisionsFilter = ''; // Reset to empty when deselected
      this.userDivision = this.initialUserDivision;
      // Fallback for corporate users - don't set userDivision here
      // Let it fallback naturally in get_occupational_data()
    }

    this.filterForm.controls['division'].setValue(event.value);
  }

  get_occupational_data() {
    const divisionFilter = this.selectedDivisionsFilter || this.userDivision;

    const startDate = new Date(this.filterDateRange.value.start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(this.filterDateRange.value.end);
    endDate.setDate(endDate.getDate() + 1);

    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();

    const prevStartDate = new Date(this.prevDateRange.value.start);
    prevStartDate.setDate(prevStartDate.getDate() + 1);
    const prevEndDate = new Date(this.prevDateRange.value.end);
    prevEndDate.setDate(prevEndDate.getDate() + 1);
    const prevStart = new Date(prevStartDate).toISOString();
    const prevEnd = new Date(prevEndDate).toISOString();

    const processDataResponse = (result: any, prevResult: any, medicineData: any, medicineDataPrevious: any, meternityData: any) => {
      this.summaryCard = [];
      this.filterForm.controls['count'].setValue(result.data.length);
      this.occupational_data = result.data;
      this.prev_occupational_data = prevResult.data;
      this.medicine_data = medicineData.data;
      this.prev_medicine_data = medicineDataPrevious.data;
      this.maternityrecord_data = meternityData.data

      const current = result.data.length;
      const previous = prevResult.data.length;
      let attrition: any = '';
      let attrition_bg: any = '';
      let attrition_icon: any = '';

      if (current === 0) {
        attrition = "0 %";
        attrition_bg = 'text-success';
        attrition_icon = '';
      } else {
        if (current > previous) {
          const temp_attrition = Number(previous) / Number(current) * 100;
          attrition = temp_attrition.toFixed(0) + ' %';
          attrition_icon = 'icon-arrow-up';
          attrition_bg = 'text-danger';
        } else if (current < previous) {
          const temp_attrition = Number(current) / Number(previous) * 100;
          attrition = temp_attrition.toFixed(0) + ' %';
          attrition_icon = 'icon-arrow-down';
          attrition_bg = 'text-success';
        } else {
          attrition = "0 %";
          attrition_bg = 'text-success';
          attrition_icon = '';
        }
      }

      this.summaryCard.push({
        category: 'Total',
        quantity: current,
        attrition: attrition,
        attrition_bg: attrition_bg,
        attrition_icon: attrition_icon,
        icon: "patient.png"
      });
    };

    // Common completion handler
    const completeHandler = () => {
      this.summary_card();
      this.average_card();
      this.patient_flow_card();
      this.doctorCard();
      this.departmentCard();
      this.severityCard();
      this.medicine_card();
      this.average_waiting_card();
      this.gender();
      this.age();
      this.top_frequently_visited();
      this.Recent_PatientList();
      this.divisionCard();
      this.diseaseCard();
      this.crossDivisionChartVal();
      this.maternityCard()
      Swal.close();
    };

    if (divisionFilter) {
      // Using division-specific endpoints
      this.occupationalService.generate_occupational_division_data(start, end, divisionFilter).subscribe({
        next: (result: any) => {
          this.occupationalService.generate_occupational_division_data(prevStart, prevEnd, divisionFilter).subscribe({
            next: (prevResult: any) => {
              this.medicineService.get_medicine_division_dash(start, end, divisionFilter).subscribe({
                next: (medicineData: any) => {
                  this.medicineService.get_medicine_division_dash(prevStart, prevEnd, divisionFilter).subscribe({
                    next: (medicineDataPrevious: any) => {
                      this.maternityService.get_maternity_record_details(start, end, this.divisionNames).subscribe({
                        next: (meternityData: any) => {
                          processDataResponse(result, prevResult, medicineData, medicineDataPrevious, meternityData);
                        },
                        error: (err: any) => console.error('Meternity Record data error:', err),
                        complete: completeHandler
                      });

                    },
                    error: (err: any) => console.error('Medicine previous data error:', err),
                    // complete: completeHandler
                  });
                },
                error: (err: any) => console.error('Medicine current data error:', err)
              });
            },
            error: (err: any) => console.error('Occupational previous data error:', err)
          });
        },
        error: (err: any) => console.error('Occupational current data error:', err),
        complete: () => Swal.close()
      });
    } else {
      // Using non-division endpoints
      this.occupationalService.generate_occupational_data(start, end).subscribe({
        next: (result: any) => {
          this.occupationalService.generate_occupational_data(prevStart, prevEnd).subscribe({
            next: (prevResult: any) => {
              this.medicineService.get_medicine_dash(start, end).subscribe({
                next: (medicineData: any) => {
                  this.medicineService.get_medicine_dash(prevStart, prevEnd).subscribe({
                    next: (medicineDataPrevious: any) => {
                      this.maternityService.get_maternity_record_details(start, end, this.divisionNames).subscribe({
                        next: (meternityData: any) => {
                          processDataResponse(result, prevResult, medicineData, medicineDataPrevious, meternityData);
                        },
                        error: (err: any) => console.error('Meternity Record data error:', err),
                        complete: completeHandler
                      });

                    },
                    error: (err: any) => console.error('Medicine previous data error:', err),
                    // complete: completeHandler
                  });
                },
                error: (err: any) => console.error('Medicine current data error:', err)
              });
            },
            error: (err: any) => console.error('Occupational previous data error:', err)
          });
        },
        error: (err: any) => console.error('Occupational current data error:', err),
        complete: () => Swal.close()
      });
    }
  }

  summary_card() {

    const severity_level = 'High Severity'
    const catData = this.occupational_data.filter(function (elem) {
      return (elem.attributes.severity_level == 'Severe')
    })

    const prevCatData = this.prev_occupational_data.filter(function (elem) {
      return (elem.attributes.severity_level == 'Severe')
    })

    const current = catData.length
    const previous = prevCatData.length

    let attrition: any = ''
    let attrition_bg: any = ''
    let attrition_icon: any = ''

    if (current === 0) {
      attrition = "0 %"
      attrition_bg = 'text-success'
      attrition_icon = ''
      this.summaryCard.push({
        category: severity_level,
        quantity: current,
        attrition: attrition,
        attrition_bg: attrition_bg,
        attrition_icon: attrition_icon,
        icon: 'severity.png'

      })
    } else {
      if (current > previous) {
        const temp_attrition = Number(previous) / Number(current) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-up'
        attrition_bg = 'text-danger'
        this.summaryCard.push({
          category: severity_level,
          quantity: current,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'severity.png'



        })
      } else if (current < previous) {
        const temp_attrition = Number(current) / Number(previous) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-down'
        attrition_bg = 'text-success'
        this.summaryCard.push({
          category: severity_level,
          quantity: current,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'severity.png'



        })
      } else if (current === previous) {
        attrition = "0 %"
        attrition_bg = 'text-success'
        attrition_icon = ''
        this.summaryCard.push({
          category: severity_level,
          quantity: current,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'severity.png'



        })
      }
    }

  }

  average_card() {
    const checkInData: Date[] = [];
    const checkOutData: Date[] = [];
    const previousCheckInData = this.prev_occupational_data.map(function (elem) {
      return new Date(elem.attributes.check_in);
    });
    const previousCheckOutData = this.prev_occupational_data.map(function (elem) {
      return new Date(elem.attributes.check_out);
    });

    this.occupational_data.forEach(function (elem) {
      const checkIn = new Date(elem.attributes.check_in);
      const checkOut = elem.attributes.check_out !== null ? new Date(elem.attributes.check_out) : null;

      if (checkOut !== null) {
        checkInData.push(checkIn);
        checkOutData.push(checkOut);
      }
    });

    const currentTotalTime = this.calculateTotalTime(checkInData, checkOutData);
    const previousTotalTime = this.calculateTotalTime(previousCheckInData, previousCheckOutData);

    const currentAverageTime = checkInData.length > 0 ? currentTotalTime / checkInData.length : 0;
    const previousAverageTime = previousCheckInData.length > 0 ? previousTotalTime / previousCheckInData.length : 0;

    const current = currentAverageTime;
    const previous = previousAverageTime;

    let attrition: any = '';
    let attrition_bg: any = '';
    let attrition_icon: any = '';

    if (current === 0) {
      attrition = '0 %';
      attrition_bg = 'text-success';
      attrition_icon = '';
    } else {
      if (current > previous) {
        const temp_attrition = (previous / current) * 100;
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %');
        attrition = value.replace(/['"]+/g, '');
        attrition_icon = 'icon-arrow-up';
        attrition_bg = 'text-danger';
      } else if (current < previous) {
        const temp_attrition = (current / previous) * 100;
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %');
        attrition = value.replace(/['"]+/g, '');
        attrition_icon = 'icon-arrow-down';
        attrition_bg = 'text-success';
      } else if (current === previous) {
        attrition = '0 %';
        attrition_bg = 'text-success';
        attrition_icon = '';
      }
    }

    this.summaryCard.push({
      category: 'Average Time (min)',
      quantity: currentAverageTime.toFixed(2),
      attrition: attrition,
      attrition_bg: attrition_bg,
      attrition_icon: attrition_icon,
      icon: 'time.png'
    });
  }


  calculateTotalTime(checkInData: any, checkOutData: any) {
    let totalTime = 0;

    for (let i = 0; i < checkInData.length; i++) {
      const checkIn = checkInData[i];
      const checkOut = checkOutData[i];
      const timeDifferenceInHours = (checkOut - checkIn) / (1000 * 60 * 60);
      totalTime += timeDifferenceInHours;
    }
    return totalTime;
  }
  patient_flow_card() {
    interface TimeRangeData {
      [key: string]: {
        consulted: number;
        registered: number;
      };
    }
    const timeRangeData: TimeRangeData = {
      "12:01 AM - 03:00 AM": { consulted: 0, registered: 0 },
      "03:01 AM - 06:00 AM": { consulted: 0, registered: 0 },
      "06:01 AM - 09:00 AM": { consulted: 0, registered: 0 },
      "09:01 AM - 12:00 PM": { consulted: 0, registered: 0 },
      "12:01 PM - 03:00 PM": { consulted: 0, registered: 0 },
      "03:01 PM - 06:00 PM": { consulted: 0, registered: 0 },
      "06:01 PM - 09:00 PM": { consulted: 0, registered: 0 },
      "09:01 PM - 12:00 AM": { consulted: 0, registered: 0 },
    };

    this.occupational_data.forEach(elem => {
      const checkInTime = elem.attributes.check_in;
      const timeRange = this.getTimeRange(checkInTime);

      if (timeRangeData.hasOwnProperty(timeRange)) {
        timeRangeData[timeRange].registered++;

        if (elem.attributes.medicine_status === "Completed") {
          timeRangeData[timeRange].consulted++;
        }
      }
    });

    // Extract data for the chart
    const timeRanges = Object.keys(timeRangeData);
    const consultedPatient = timeRanges.map(range => timeRangeData[range].consulted);
    const registeredPatient = timeRanges.map(range => timeRangeData[range].registered);

    // Create the chart
    this.patientflowChart = {
      series: [
        {
          name: "Patients Consulted",
          data: consultedPatient
        },
        {
          name: "Patients Registered",
          data: registeredPatient
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          horizontal: false // Change to vertical bars
        }
      },
      dataLabels: {
        enabled: false,
        formatter: function (val: any) {
          return val + " patients";
        }
      },
      xaxis: {
        categories: [
          '12:01 AM - 03:00 AM',
          '03:01 AM - 06:00 AM',
          '06:01 AM - 09:00 AM',
          '09:01 AM - 12:00 PM',
          '12:01 PM - 03:00 PM',
          '03:01 PM - 06:00 PM',
          '06:01 PM - 09:00 PM',
          '09:01 PM - 12:00 AM'
        ],
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Count'
        }
      },
      legend: {
        position: "top"
      },

    };
  }

  getTimeRange(checkInTime: string): string {
    const checkInDate = new Date(checkInTime);
    const hours = checkInDate.getHours();
    const minutes = checkInDate.getMinutes();
    const timeRanges = [
      "12:01 AM - 03:00 AM",
      "03:01 AM - 06:00 AM",
      "06:01 AM - 09:00 AM",
      "09:01 AM - 12:00 PM",
      "12:01 PM - 03:00 PM",
      "03:01 PM - 06:00 PM",
      "06:01 PM - 09:00 PM",
      "09:01 PM - 12:00 AM"
    ];

    let selectedRange = "";
    if ((hours === 0 && minutes >= 1) || (hours >= 0 && hours < 3)) {
      selectedRange = timeRanges[0];
    } else if (hours >= 3 && hours < 6) {
      selectedRange = timeRanges[1];
    } else if (hours >= 6 && hours < 9) {
      selectedRange = timeRanges[2];
    } else if (hours >= 9 && hours < 12) {
      selectedRange = timeRanges[3];
    } else if (hours >= 12 && hours < 15) {
      selectedRange = timeRanges[4];
    } else if (hours >= 15 && hours < 18) {
      selectedRange = timeRanges[5];
    } else if (hours >= 18 && hours < 21) {
      selectedRange = timeRanges[6];
    } else {
      selectedRange = timeRanges[7];
    }

    return selectedRange;
  }

  doctorCard() {
    const filteredData = this.occupational_data.filter(data => data.attributes.patient_status !== 'Pending');
    const total = filteredData.length;
    const groupedDoctors: Record<string, any[]> = {};

    filteredData.forEach(function (data) {
      const doctor = data.attributes.consulting_doctor.data.attributes.first_name;

      if (!groupedDoctors[doctor]) {
        groupedDoctors[doctor] = [];
      }

      groupedDoctors[doctor].push(data);
    });

    const doctorPercentages: number[] = [];
    const doctors: string[] = [];
    const counts: number[] = [];

    for (const doctor in groupedDoctors) {
      const doctorCount = groupedDoctors[doctor].length;
      const doctorPercentage = (doctorCount / total) * 100;
      doctorPercentages.push(Math.floor(doctorPercentage));
      doctors.push(doctor);
      counts.push(Math.floor(doctorCount));
    }

    this.doctorNames = doctors;
    this.doctorCounts = counts;
    this.consultationChart.series = doctorPercentages;
    this.consultationChart.labels = doctors;
  }

  // departmentCard() {
  //   const groupedDepartments: Record<string, any[]> = {};

  //   this.occupational_data.forEach(function (data) {
  //     const depart = data.attributes.department;

  //     if (!groupedDepartments[depart]) {
  //       groupedDepartments[depart] = [];
  //     }

  //     groupedDepartments[depart].push(data);
  //   });

  //   const departments: string[] = [];
  //   const counts: number[] = [];

  //   for (const department in groupedDepartments) {
  //     const departmentCount = groupedDepartments[department].length;
  //     counts.push(departmentCount);
  //     departments.push(department);
  //   }

  //   // Sort the departments and counts in ascending order
  //   const sortedDepartments = departments.slice().sort();
  //   const sortedCounts = counts.slice().sort((a, b) => a - b);

  //   this.departmentNames = sortedDepartments;

  //   // Create the pyramid chart series as a single line
  //   const totalCounts = sortedCounts.slice().map((count) => count);

  //   this.departmentChart.series = [
  //     {
  //       name: "Department Count",
  //       data: totalCounts, // Combine left and right data
  //     },
  //   ];
  //   this.departmentChart.dataLabels = {
  //     enabled: true,
  //     formatter: function (val: any, opt: any) {
  //       return opt.w.globals.labels[opt.dataPointIndex];
  //     },
  //     dropShadow: {
  //       enabled: true,
  //     },
  //   };
  //   this.departmentChart.labels = sortedDepartments;
  // }


  // maternityCard() {
  //   const groupedRecords: Record<string, any[]> = {};

  //   this.maternityrecord_data.forEach(data => {
  //     const div = data.attributes.record;
  //     if (div !== null) {
  //       if (!groupedRecords[div]) {
  //         groupedRecords[div] = [];
  //       }
  //       groupedRecords[div].push(data);
  //       console.log()
  //     }
  //   });

  //   const records: string[] = [];
  //   const counts: number[] = [];

  //   for (const record in groupedRecords) {
  //     const recordCount = groupedRecords[record].length;
  //     records.push(record);
  //     counts.push(recordCount);
  //   }

  //   const recordData = records.map((record, index) => ({
  //     record,
  //     count: counts[index]
  //   }));

  //   const allRecordNames = recordData.map(r => r.record);
  //   console.log("allRecordNames", allRecordNames)
  //   const allCounts = recordData.map(r => r.count);

  //   const maternity_count: any[] = [{
  //     name: 'Application Count',
  //     data: allCounts
  //   }];

  //   maternityChart.xaxis = { categories: allRecordNames };
  //   maternityChart.series = maternity_count;
  // }

  maternityCard() {
    const groupedRecords: Record<string, any[]> = {};

    this.maternityrecord_data.forEach(data => {
      const div = data.attributes.division;
      // Changed to division_name
      if (div !== null) {
        if (!groupedRecords[div]) {
          groupedRecords[div] = [];
        }
        groupedRecords[div].push(data);
      }
    });

    const divisions: string[] = [];
    const counts: number[] = [];

    for (const division in groupedRecords) {
      const divisionCount = groupedRecords[division].length;
      divisions.push(division);
      counts.push(divisionCount);
    }

    const divisionData = divisions.map((division, index) => ({
      division,
      count: counts[index]
    }));

    const allDivisionNames = divisionData.map(d => d.division);
    const allCounts = divisionData.map(d => d.count);

    const maternity_count: any[] = [{
      name: 'Application Count',
      data: allCounts
    }];

    maternityChart.xaxis = { categories: allDivisionNames };
    maternityChart.series = maternity_count;
  }

  departmentCard() {
    const total = this.occupational_data.length;
    const groupedDepartments: Record<string, any[]> = {};

    this.occupational_data.forEach(function (data) {
      const depart = data.attributes.department;


      if (!groupedDepartments[depart]) {
        groupedDepartments[depart] = [];
      }

      groupedDepartments[depart].push(data);
    });


    const departmentPercentages: number[] = [];
    const departments: string[] = [];
    const counts: number[] = [];

    for (const department in groupedDepartments) {
      const departmentCount = groupedDepartments[department].length;
      const departmentPercentage = (departmentCount / total) * 100;
      departmentPercentages.push(Math.floor(departmentPercentage));
      departments.push(department);
      counts.push(Math.floor(departmentCount));
    }

    this.departmentNames = departments;
    this.departmentCounts = counts;
    this.departmentChart.series = departmentPercentages;
    this.departmentChart.labels = departments;

  }

  severityCard() {

    const total = this.occupational_data.length


    const highseverity = this.occupational_data.filter(function (data) {
      return (data.attributes.severity_level === "Severe")
    })
    const mediumseverity = this.occupational_data.filter(function (data) {
      return (data.attributes.severity_level === "Moderate")
    })
    const lowseverity = this.occupational_data.filter(function (data) {
      return (data.attributes.severity_level === "Mild")
    })
    this.highCount = highseverity.length
    this.mediumCount = mediumseverity.length
    this.lowCount = lowseverity.length

    let highPercentage = '0'
    let mediumPercentage = '0'
    let lowPercentage = '0'
    // if (total > 0) {
    //   highPercentage = ((highseverity.length / total) * 100).toFixed(0);
    //   mediumPercentage = ((mediumseverity.length / total) * 100).toFixed(0);
    //   lowPercentage = ((lowseverity.length / total) * 100).toFixed(0);
    // }
    if (total > 0) {
      highPercentage = ((highseverity.length / total) * 100).toFixed(1);
      mediumPercentage = ((mediumseverity.length / total) * 100).toFixed(1);
      lowPercentage = ((lowseverity.length / total) * 100).toFixed(1);
    }

    // Convert to numbers and ensure they add up to 100
    const sum = Number(highPercentage) + Number(mediumPercentage) + Number(lowPercentage);
    if (sum !== 100) {
      highPercentage = ((Number(highPercentage) / sum) * 100).toFixed(1);
      mediumPercentage = ((Number(mediumPercentage) / sum) * 100).toFixed(1);
      lowPercentage = ((Number(lowPercentage) / sum) * 100).toFixed(1);
    }

    this.severityLevelChart = {
      series: [Number(highPercentage), Number(mediumPercentage), Number(lowPercentage)],

      chart: {
        type: 'pie',
        height: 280,
      },
      labels: ['Severe', 'Moderate', 'Mild'],
      colors: ['#FF5733', '#FFC300', '#00E396'],
      legend: {
        show: false,
      },

      plotOptions: {
        pie: {
          donut: {
            size: '70%',
          }
        }
      }
    };
  }
  filterMedicineThreshold(value: any) {
    return value.category === "Threshold"
  }

  filterMedicineHighest(value: any) {
    return value.category === "Highest"
  }

  filterMedicineExpiry(value: any) {
    return value.category === "Expiry"
  }

  filterTopSupplier(value: any) {
    return value.category === "Supplier"
  }
  supplier_names() {
    this.medicineService.get_medicine_supplier().subscribe({
      next: (result: any) => {
        this.supplierNames = result.data
      },
      error: (err: any) => { },
      complete: () => {

      }
    })
  }

  medicine_card() {

    this.medicineCard = [];
    const inventoryDataThreshold = this.medicine_data.filter(function (elem) {
      return (Number(elem.attributes.balance_quantity) != 0 && Number(elem.attributes.balance_quantity) <= Number(elem.attributes.threshold_limit))
    })
    const inventoryDataUnique = inventoryDataThreshold.sort(function (a, b) {
      return parseFloat(b.id) - parseFloat(a.id);
    })
    let thresholdData: any[] = []
    thresholdData = inventoryDataUnique.slice(0, 5)
    thresholdData.forEach(elem => {
      if (elem.attributes.delivered_quantity) {
        this.medicineCard.push({
          'category': 'Threshold',
          'reference': elem.attributes.reference_number,
          'name': elem.attributes.medicine_name,
          'limit': elem.attributes.threshold_limit,
          'balance': elem.attributes.balance_quantity,
          'rrn': elem.attributes.batch_number,
          'unit': elem.attributes.delivered_unit,
          'percentage': Number(elem.attributes.balance_quantity) / Number(elem.attributes.delivered_quantity) * 100
        })
      } else {
        this.medicineCard.push({
          'category': 'Threshold',
          'reference': elem.attributes.reference_number,
          'name': elem.attributes.medicine_name,
          'limit': elem.attributes.threshold_limit,
          'balance': elem.attributes.balance_quantity,
          'rrn': elem.attributes.batch_number,
          'unit': elem.attributes.delivered_unit,
          'percentage': 0
        })
      }

    })

    const inventoryDatabalance = this.medicine_data.filter(function (elem) {
      return (elem.attributes.balance_quantity > 0)
    })
    const balanceDataUnique = inventoryDatabalance.sort(function (a, b) {
      return parseFloat(b.attributes.balance_quantity) - parseFloat(a.attributes.balance_quantity);
    })

    let balanceData: any[] = []
    balanceData = balanceDataUnique.slice(0, 5)
    balanceData.forEach(elem => {
      if (elem.attributes.delivered_quantity > 0) {
        this.medicineCard.push({
          'category': 'Highest',
          'reference': elem.attributes.reference_number,
          'rrn': elem.attributes.batch_number,
          'name': elem.attributes.medicine_name,
          'issued': elem.attributes.issued_quantity,
          'delivered': elem.attributes.delivered_quantity,
          'unit': elem.attributes.delivered_unit,
          'percentage': Number(elem.attributes.issued_quantity) / Number(elem.attributes.delivered_quantity) * 100
        })
      } else {
        this.medicineCard.push({
          'category': 'Highest',
          'reference': elem.attributes.reference_number,
          'rrn': elem.attributes.batch_number,
          'name': elem.attributes.medicine_name,
          'issued': elem.attributes.issued_quantity,
          'delivered': elem.attributes.delivered_quantity,
          'unit': elem.attributes.delivered_unit,
          'percentage': 0
        })
      }

    })

    const expiryUniqueData = this.medicine_data.sort(function (a, b) {
      return parseFloat(b.attributes.expiry_date) - parseFloat(a.attributes.expiry_date);
    })
    let expData: any[] = []
    expData = expiryUniqueData.slice(0, 5)
    expData.forEach(elem => {
      if (elem.attributes.delivered_quantity > 0) {
        this.medicineCard.push({
          'category': 'Expiry',
          'reference': elem.attributes.reference_number,
          'rrn': elem.attributes.batch_number,
          'name': elem.attributes.medicine_name,
          'expiry': moment(elem.attributes.expiry_date),
          'balance': elem.attributes.balance_quantity,
          'unit': elem.attributes.delivered_unit,
          'percentage': Number(elem.attributes.balance_quantity) / Number(elem.attributes.delivered_quantity) * 100
        })
      } else {
        this.medicineCard.push({
          'category': 'Expiry',
          'reference': elem.attributes.reference_number,
          'rrn': elem.attributes.batch_number,
          'name': elem.attributes.medicine_name,
          'expiry': moment(elem.attributes.expiry_date),
          'balance': elem.attributes.balance_quantity,
          'unit': elem.attributes.delivered_unit,
          'percentage': 0
        })
      }

    })

    const inventoryDataTopSupplier = this.medicine_data.sort(function (a, b) {
      return parseFloat(b.attributes.delivered_quantity) - parseFloat(a.attributes.delivered_quantity);
    })

    let inventoryUniqueTopSupplier: any[] = []
    inventoryUniqueTopSupplier = inventoryDataTopSupplier.slice(0, 5)

    const total = inventoryUniqueTopSupplier.reduce((acc, cur) => acc + Number(cur.attributes.delivered_quantity), 0)
    this.supplierNames.forEach(supplierName => {

      const data = inventoryUniqueTopSupplier.filter(function (invdata) {

        return (invdata.attributes.supplier_name == supplierName.attributes.name)
      })

      if (total > 0) {
        this.medicineCard.push({
          'category': 'Supplier',
          'name': supplierName.attributes.name,
          'deliveredQuantity': data.reduce((acc, cur) => acc + Number(cur.attributes.delivered_quantity), 0),
          'percentage': Number(data.reduce((acc, cur) => acc + Number(cur.attributes.delivered_quantity), 0)) / Number(total) * 100

        })
      } else {
        this.medicineCard.push({
          'category': 'Supplier',
          'name': supplierName.attributes.name,
          'deliveredQuantity': data.reduce((acc, cur) => acc + Number(cur.attributes.delivered_quantity), 0),
          'percentage': 0

        })
      }

    })


  }

  average_waiting_card() {
    interface TimeRangeData {
      [key: string]: number;
    }

    const timeRangeData: TimeRangeData = {
      '0-15 Min': 0,
      '16-30 Min': 0,
      '31-45 Min': 0,
      '46-60 Min': 0,
      '61 and above': 0,
    };

    this.occupational_data.forEach((elem) => {
      const clockInTime = new Date(elem.attributes.check_in);
      const clockOutTime = new Date(elem.attributes.check_out);

      if (elem.attributes.check_out != null) {
        const clockIn = clockOutTime.getTime()
        const clockOut = clockInTime.getTime()
        const durationMinutes = (clockIn - clockOut) / (1000 * 60);

        let timeRange: string;
        if (durationMinutes <= 15) {
          timeRange = '0-15 Min';
        } else if (durationMinutes <= 30) {
          timeRange = '16-30 Min';
        } else if (durationMinutes <= 45) {
          timeRange = '31-45 Min';
        } else if (durationMinutes <= 60) {
          timeRange = '46-60 Min';
        } else {
          timeRange = '61 and above';
        }

        if (timeRangeData.hasOwnProperty(timeRange)) {
          timeRangeData[timeRange]++;
        }
      }

    });

    const timeRanges = Object.keys(timeRangeData);
    const patientCounts = timeRanges.map((range) => timeRangeData[range]);


    this.waitingChart = {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          '0-15 Min',
          '16-30 Min',
          '31-45 Min',
          '46-60 Min',
          '61 and above',
        ],
        labels: {
          style: {
            fontSize: '12px',
          },
        },
      },


      series: [
        {
          name: 'Number of Patients',
          data: patientCounts,
        },
      ],
    };
  }

  gender() {
    const maleData = this.occupational_data.filter(function (data: any) {
      return (data.attributes.gender === "Male")
    })
    const femaleData = this.occupational_data.filter(function (data: any) {
      return (data.attributes.gender === "Female")
    })
    const total = Number(maleData.length) + Number(femaleData.length)
    const mPerc = Math.round(Number(maleData.length) / Number(total) * 100).toFixed(0)
    const fPerc = Math.round(Number(femaleData.length) / Number(total) * 100).toFixed(0)
    this.maleCount = maleData.length
    this.femaleCount = femaleData.length
    this.genderChart = {
      chart: {
        type: 'donut',
        height: 240,
      },
      labels: ['Male', 'Female'],
      colors: ['#2766F6', '#FF1493'],
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
          }
        }
      },
      series: [Number(mPerc), Number(fPerc)],
    };

  }

  age() {
    const ageBar1 = this.occupational_data.filter(function (elem) {
      return (elem.attributes.age >= 16 && elem.attributes.age <= 19)
    })
    const ageBar2 = this.occupational_data.filter(function (elem) {
      return (elem.attributes.age >= 20 && elem.attributes.age <= 24)
    })
    const ageBar3 = this.occupational_data.filter(function (elem) {
      return (elem.attributes.age >= 25 && elem.attributes.age <= 34)
    })
    const ageBar4 = this.occupational_data.filter(function (elem) {
      return (elem.attributes.age >= 35 && elem.attributes.age <= 44)
    })
    const ageBar5 = this.occupational_data.filter(function (elem) {
      return (elem.attributes.age >= 45 && elem.attributes.age <= 54)
    })
    const ageBar6 = this.occupational_data.filter(function (elem) {
      return (elem.attributes.age >= 55 && elem.attributes.age <= 60)
    })
    const ageBar7 = this.occupational_data.filter(function (elem) {
      return (elem.attributes.age > 60)
    })
    this.ageChart = {
      chart: {
        height: 288,
        type: 'line',
        toolbar: 'false',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 8,
          opacity: 0.2
        },
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#556ee6'],
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      xaxis: {
        categories: [
          "16-19",
          "20-24",
          "25-34",
          "35-44",
          "45-54",
          "55-60",
          "60+",

        ]
      },
      series: [{
        name: 'Count',
        data: [ageBar1.length, ageBar2.length, ageBar3.length, ageBar4.length, ageBar5.length, ageBar6.length, ageBar7.length],
      }],
    };
  }

  top_frequently_visited() {
    this.topVisitedCard = [];
    const employeeVisits: Record<string, { count: number; empId: string }> = {};

    this.occupational_data.forEach((entry) => {
      const employeeName = entry.attributes.employee_name;
      const employeeId = entry.attributes.employee_id;

      if (employeeName in employeeVisits) {
        employeeVisits[employeeName].count++;
      } else {
        employeeVisits[employeeName] = {
          count: 1,
          empId: employeeId
        };
      }
    });




    const employeeList = Object.keys(employeeVisits).map((employeeName) => ({
      name: employeeName,
      visits: employeeVisits[employeeName].count,
      empId: employeeVisits[employeeName].empId,
      unit: 'visits'
    }));

    employeeList.sort((a, b) => b.visits - a.visits);
    const topEmployees = employeeList.slice(0, 10);
    this.topVisitedCard = topEmployees;
  }

  Recent_PatientList() {
    const sortedPatientList = this.occupational_data.sort((a: any, b: any) => new Date(b.attributes.check_in).getTime() - new Date(a.attributes.check_in).getTime()
    );
    const latest10Items = sortedPatientList.slice(0, 10);
    this.RecentPatientList = latest10Items;
  }

  divisionCard() {
    const groupedDivisions: Record<string, any[]> = {};

    this.occupational_data.forEach(data => {
      const div = data.attributes.business_unit.data.attributes.division_name;
      if (div !== null) {
        if (!groupedDivisions[div]) {
          groupedDivisions[div] = [];
        }
        groupedDivisions[div].push(data);
      }
    });

    const divisions: string[] = [];
    const counts: number[] = [];

    let division_count: any[] = []
    for (const division in groupedDivisions) {
      const divisionCount = groupedDivisions[division].length;
      divisions.push(division);
      counts.push(divisionCount);
    }
    division_count.push({
      name: 'Visited Employess',
      data: counts
    })
    divisionChart.xaxis = { categories: divisions }
    divisionChart.series = division_count
  }

  diseaseCard() {
    const groupedDiseases: Record<string, any[]> = {};

    this.occupational_data.forEach(data => {
      const div = data.attributes.disease;
      if (div !== null) {
        if (!groupedDiseases[div]) {
          groupedDiseases[div] = [];
        }
        groupedDiseases[div].push(data);
      }
    });

    const diseases: string[] = [];
    const counts: number[] = [];

    for (const disease in groupedDiseases) {
      const diseaseCount = groupedDiseases[disease].length;
      diseases.push(disease);
      counts.push(diseaseCount);
    }
    const diseaseData = diseases.map((disease, index) => ({
      disease,
      count: counts[index]
    }));

    const top10Diseases = diseaseData.sort((a, b) => b.count - a.count).slice(0, 10);

    const top10DiseaseNames = top10Diseases.map(d => d.disease);
    const top10Counts = top10Diseases.map(d => d.count);

    const disease_count: any[] = [{
      name: 'Visited Employees',
      data: top10Counts
    }];

    diseaseChart.xaxis = { categories: top10DiseaseNames };
    diseaseChart.series = disease_count;
  }


  crossDivisionChartVal() {
    const startDate = new Date(this.filterDateRange.value.start)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(this.filterDateRange.value.end)
    endDate.setDate(endDate.getDate() + 1)
    const start = new Date(startDate).toISOString()
    const end = new Date(endDate).toISOString()

    const prevStartDate = new Date(this.prevDateRange.value.start)
    prevStartDate.setDate(prevStartDate.getDate() + 1)
    const prevEndDate = new Date(this.prevDateRange.value.end)
    prevEndDate.setDate(prevEndDate.getDate() + 1)
    const prevStart = new Date(prevStartDate).toISOString()
    const prevEnd = new Date(prevEndDate).toISOString()
    this.occupationalService.generate_occupational_data(start, end).subscribe({
      next: (result: any) => {

        this.crossoccupational_data = result.data
        let diviName: any[] = []
        let divisionName: any[] = []
        this.crossoccupational_data.forEach(elem => {
          diviName.push(elem.attributes.clinic_division)
        })
        var duplicateValue = new Set(diviName);
        diviName = [...duplicateValue];
        divisionName = diviName
        let division: any[] = []
        let sameValue: any[] = []
        let notSameValue: any[] = []
        divisionName.forEach(elem => {
          division.push(elem)

          const same = this.crossoccupational_data.filter(function (data) {
            return (data.attributes.division === elem && data.attributes.clinic_division === elem)
          })
          sameValue.push(Number(same.length))

          const notSame = this.crossoccupational_data.filter(function (data) {
            return (data.attributes.division !== elem && data.attributes.clinic_division === elem)
          })
          notSameValue.push(Number(notSame.length))
          this.crossDivisionChart = {
            series: [
              {
                name: "Same Division",
                data: sameValue
              },
              {
                name: "Another Division",
                data: notSameValue
              }
            ],
            chart: {
              height: 350,
              type: "area"
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "smooth"
            },
            xaxis: {
              type: "text",
              categories: division
            },
            // tooltip: {
            //   x: {
            //     format: "dd/MM/yy HH:mm"
            //   }
            // }
          }

          // const same = this.occupational_data.filter(function (data) {
          //   return (data.attributes.division == elem)
          // })
        })
      },
      error: (err: any) => { },
      complete: () => { Swal.close() }
    })

  }



}
