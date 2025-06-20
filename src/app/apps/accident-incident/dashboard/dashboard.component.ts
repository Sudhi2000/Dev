import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ChartType, divisionCategoryChart, lastaccidentchart, genderChart, ageChart, radialChart, departmentChart, severityPieChart } from './chart-model';
import { AccidentService } from 'src/app/services/accident.api.service';
import { IncidentService } from 'src/app/services/incident.api.service';
import Swal from 'sweetalert2';

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

  public isMenuCollapsed = false;
  lastaccidentchart: ChartType
  divisionCategoryChart: ChartType
  categoryChart: ChartType
  genderChart: ChartType
  ageChart: ChartType
  injuryChart: ChartType
  radialChart: ChartType
  severityPieChart: ChartType
  accidentData: any[] = []
  acciData: any[] = []
  incidentData: any[] = []
  prevIncidentData: any[] = []
  inciData: any[] = []
  cateData: any[] = []
  maleCount: any
  femaleCount: any
  mediumCount: any
  veryhighCount: any
  extremeCount: any
  individualData: any[] = []
  timeWorkData: any[] = []
  consequenceData: any[] = []
  rootCause: any[] = []
  rootCauseData: any[] = []
  rootCauseData2: any[] = []
  dateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  prevDateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  filterForm: FormGroup
  divisions: any[] = []
  currency: string
  orgID: any
  statusCardData: any[] = []
  dropdownValues: any[] = []
  summaryCard: any[] = []
  amountCard: any[] = []
  imageURL: any
  prevAccidentData: any[] = []
  lastAccidentDate: any
  lastReportedDate: any
  departmentChart: ChartType
  department: any
  departmentNames: string[] = [];
  departmentCounts: number[] = [];
  highCount: any
  lowCount: any
  unitSpecific: any
  userDivision: any
  corporateUser: any

  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private incidentService: IncidentService,
    private accidentService: AccidentService) { }

  ngOnInit() {
    this.isMenuCollapsed = false;
    this.departmentChart = departmentChart
    this.imageURL = environment.client_backend + '/uploads/'
    this.lastaccidentchart = lastaccidentchart
    this.divisionCategoryChart = divisionCategoryChart
    this.genderChart = genderChart
    this.ageChart = ageChart
    this.radialChart = radialChart
    this.severityPieChart = severityPieChart
    this.configuration()
    this.filterForm = this.formBuilder.group({
      division: [''],
      divisionVal: [''],
      startDate: [''],
      endDate: ['']
    })
    this.showProgressPopup()
    var curr = new Date()
    const monthStart = new Date(curr.getUTCFullYear(), curr.getMonth());
    const monthEnd = new Date();
    const monthStartDate = monthStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
      monthStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
      monthStart.toLocaleDateString("en-US", { year: 'numeric' })
    const monthEndDate = monthEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
      monthEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
      monthEnd.toLocaleDateString("en-US", { year: 'numeric' })
    this.dateRange.controls['start'].setValue(new Date(monthStartDate))
    this.dateRange.controls['end'].setValue(new Date(monthEndDate))
    const lastMonthstart = new Date(curr.getFullYear(), curr.getMonth() - 1);
    lastMonthstart.setDate(lastMonthstart.getDate())
    const lastMonthEnd = new Date(curr.getFullYear(), curr.getMonth(), 0)
    lastMonthEnd.setDate(lastMonthEnd.getDate())
    this.prevDateRange.controls['start'].setValue(new Date(lastMonthstart))
    this.prevDateRange.controls['end'].setValue(new Date(lastMonthEnd))
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          this.currency = result.data.attributes.currency
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
        const status = result.acc_dashboard
        if (status === false) {
          Swal.close()
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_division()
            } else if (!this.corporateUser) {

              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)  
              })
              let results = divisions.join('&');
              this.userDivision = results 
              
            }
          } else {
            this.get_division()
          }
          this.get_dropdown_values()
          this.get_accident_details()

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  //get dropdown values
  get_dropdown_values() {
    const module = "Accident and Incident"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_division() {
    this.divisions=[]
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => { 
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
          division_uuid: attributes.division_uuid
        }));
        
        this.divisions =newArray;
        
        let divisions: any[] = []
        this.divisions.forEach((elem: any) => {
          divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
        })
        let results = divisions.join('&');
        this.userDivision = results
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { 
       },
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

  startDateChange(event: any) {
    this.filterForm.controls['startDate'].setValue(new Date(new Date(event.value).setHours(0, 0, 0)).toISOString())
  }

  endDateChange(event: any) {
    this.filterForm.controls['endDate'].setValue(new Date(new Date(event.value).setHours(0, 0, 0)).toISOString())
  }

  divisionVal(data: any) {
    this.filterForm.controls['division'].setValue(data.target.id)
    this.filterForm.controls['divisionVal'].setValue(data.target.id)
  }


  accidentDivision_week() {
    (document.getElementById('month') as HTMLElement).classList.remove('active');
    (document.getElementById('year') as HTMLElement).classList.remove('active');
    (document.getElementById('week') as HTMLElement).classList.add('active')
    var curr = new Date;
    var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
    var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
    const startDate = new Date(firstday).toISOString()
    const endDate = new Date(lastday).toISOString()

    if (this.filterForm.value.division) {
      this.accidentService.get_dash_accidents_division(startDate, endDate, this.filterForm.value.division).subscribe({
        next: (result: any) => {
          this.accidentData = result.data
          this.incidentService.get_dash_incidents_division(startDate, endDate, this.filterForm.value.division).subscribe({
            next: (inresult: any) => {
              this.incidentData = inresult.data
            },
            error: (err: any) => { },
            complete: () => {
              this.division()
            }
          })
        },
        error: (err: any) => { },
        complete: () => {
          this.division()
        }
      })

    } else {
      this.accidentService.get_dash_accidents(startDate, endDate,this.userDivision).subscribe({
        next: (result: any) => {
          this.accidentData = result.data
          this.incidentService.get_dash_incidents(startDate, endDate,this.userDivision).subscribe({
            next: (inresult: any) => {
              this.incidentData = inresult.data
            },
            error: (err: any) => { },
            complete: () => {
              this.division()
            }
          })
        },
        error: (err: any) => { },
        complete: () => {
          this.division()
        }
      })
    }
  }

  accidentDivision_month() {
    (document.getElementById('month') as HTMLElement).classList.add('active');
    (document.getElementById('year') as HTMLElement).classList.remove('active');
    (document.getElementById('week') as HTMLElement).classList.remove('active')
    const date = new Date()
    const startDate = new Date(date.getFullYear(), date.getMonth()).toISOString();
    const endDate = new Date().toISOString()

    if (this.filterForm.value.division) {

      this.accidentService.get_dash_accidents_division(startDate, endDate, this.filterForm.value.division).subscribe({
        next: (result: any) => {
          this.accidentData = result.data
          this.incidentService.get_dash_incidents_division(startDate, endDate, this.filterForm.value.division).subscribe({
            next: (inresult: any) => {
              this.incidentData = inresult.data
            },
            error: (err: any) => { },
            complete: () => {
              this.division()
            }
          })
        },
        error: (err: any) => { },
        complete: () => {
          this.division()
        }
      })
    } else {
      this.accidentService.get_dash_accidents(startDate, endDate ,this.userDivision).subscribe({
        next: (result: any) => {
          this.accidentData = result.data
          this.incidentService.get_dash_incidents(startDate, endDate,this.userDivision).subscribe({
            next: (inresult: any) => {
              this.incidentData = inresult.data
            },
            error: (err: any) => { },
            complete: () => {
              this.division()
            }
          })
        },
        error: (err: any) => { },
        complete: () => {
          this.division()
        }
      })
    }
  }

  accidentDivision_year() {
    (document.getElementById('month') as HTMLElement).classList.remove('active');
    (document.getElementById('year') as HTMLElement).classList.add('active');
    (document.getElementById('week') as HTMLElement).classList.remove('active');
    var d = new Date(new Date().getFullYear(), 0, 2).toISOString();
    var end = new Date("12/31/" + (new Date()).getFullYear()).toISOString();
    const startDate = new Date(d).toISOString()
    const endDate = new Date(end).toISOString()

    if (this.filterForm.value.division) {
      this.accidentService.get_dash_accidents_division(startDate, endDate, this.filterForm.value.division).subscribe({
        next: (result: any) => {
          this.accidentData = result.data
          this.incidentService.get_dash_incidents_division(startDate, endDate, this.filterForm.value.division).subscribe({
            next: (inresult: any) => {
              this.incidentData = inresult.data
            },
            error: (err: any) => { },
            complete: () => {
              this.division()
            }
          })
        },
        error: (err: any) => { },
        complete: () => {
          this.division()
        }
      })
    } else {
      this.accidentService.get_dash_accidents(startDate, endDate ,this.userDivision).subscribe({
        next: (result: any) => {
          this.accidentData = result.data
          this.incidentService.get_dash_incidents(startDate, endDate, this.userDivision).subscribe({
            next: (inresult: any) => {
              this.incidentData = inresult.data
            },
            error: (err: any) => { },
            complete: () => {
              this.division()
            }
          })
        },
        error: (err: any) => { },
        complete: () => {
          this.division()
        }
      })
    }
  }

  applyFilter() {
    this.summaryCard = []
    this.amountCard = []
    this.cateData = []
    this.individualData = []
    this.consequenceData = []
    this.rootCauseData = []
    this.rootCauseData2 = []
    this.showProgressPopup()
    this.get_accident_details()
  }

  get_accident_details() {
    this.accidentService.get_dash_accidents_all(this.userDivision).subscribe({
      next: (result: any) => {
        this.acciData = result.data
      },
      error: (err: any) => { },
      complete: () => {
        
        if (this.filterForm.value.division) {
          const prevStart = new Date(this.prevDateRange.value.start)
          prevStart.setDate(prevStart.getDate() + 1)
          const prevEnd = new Date(this.prevDateRange.value.end)
          prevEnd.setDate(prevEnd.getDate() + 1)
          const prevStartDate = new Date(prevStart).toISOString()
          const prevEndDate = new Date(prevEnd).toISOString()
          this.accidentService.get_dash_accidents_division(prevStartDate, prevEndDate, this.filterForm.value.division).subscribe({
            next: (result: any) => {
              
              this.prevAccidentData = result.data
            },
            error: (err: any) => { },
            complete: () => {
              this.get_incident_details()

            }
          })
        } else {
          const prevStart = new Date(this.prevDateRange.value.start)
          prevStart.setDate(prevStart.getDate() + 1)
          const prevEnd = new Date(this.prevDateRange.value.end)
          prevEnd.setDate(prevEnd.getDate() + 1)
          const prevStartDate = new Date(prevStart).toISOString()
          const prevEndDate = new Date(prevEnd).toISOString()
          this.accidentService.get_dash_accidents(prevStartDate, prevEndDate ,this.userDivision).subscribe({
            next: (result: any) => {
              this.prevAccidentData = result.data

            },
            error: (err: any) => { },
            complete: () => {
              this.get_incident_details()
            }
          })
        }
      }
    })
  }

  get_incident_details() {
    this.incidentService.get_dash_incidents_all(this.userDivision).subscribe({
      next: (result: any) => {
        
        this.inciData = result.data
      },
      error: (err: any) => { },
      complete: () => {
        if (this.filterForm.value.division) {
          const prevStart = new Date(this.prevDateRange.value.start)
          prevStart.setDate(prevStart.getDate() + 1)
          const prevEnd = new Date(this.prevDateRange.value.end)
          prevEnd.setDate(prevEnd.getDate() + 1)
          const prevStartDate = new Date(prevStart).toISOString()
          const prevEndDate = new Date(prevEnd).toISOString()
          this.incidentService.get_dash_incidents_division(prevStartDate, prevEndDate, this.filterForm.value.division).subscribe({
            next: (result: any) => {
              
              this.prevIncidentData = result.data
            },
            error: (err: any) => { },
            complete: () => {
              this.filterData()

            }
          })
        } else {
          const prevStart = new Date(this.prevDateRange.value.start)
          prevStart.setDate(prevStart.getDate() + 1)
          const prevEnd = new Date(this.prevDateRange.value.end)
          prevEnd.setDate(prevEnd.getDate() + 1)
          const prevStartDate = new Date(prevStart).toISOString()
          const prevEndDate = new Date(prevEnd).toISOString()
          this.incidentService.get_dash_incidents(prevStartDate, prevEndDate,this.userDivision).subscribe({
            next: (result: any) => {
              this.prevIncidentData = result.data

            },
            error: (err: any) => { },
            complete: () => {
              this.filterData()
            }
          })
        }
      }
    })

  }

  filterData() {
    if (this.filterForm.value.division) {
      const start = new Date(this.dateRange.value.start)
      const end = new Date(this.dateRange.value.end)
      end.setDate(end.getDate() + 1)
      const startDate = new Date(start).toISOString()
      const endDate = new Date(end).toISOString()
      const division = this.filterForm.value.division
      const data = this.acciData.filter(function (data) {
        return (data.attributes.accident_date >= startDate && data.attributes.accident_date < endDate && data.attributes.business_unit.data.attributes.division_uuid === division)
      })
      this.accidentData = data

      this.accidentData.forEach((elem: any) => {
        elem.attributes.affected_individuals.data.forEach((elem2: any) => {
          this.individualData.push(elem2)
        })
      })
      const incidata = this.inciData.filter(function (data) {
        return (data.attributes.incident_date >= startDate && data.attributes.incident_date < endDate && data.attributes.business_unit.data.attributes.division_uuid === division)
      })
      this.incidentData = incidata

      this.summary_card()
      this.expense()
      this.division()
      this.last_accident()
      this.category()
      this.bodyParts()
      this.gender()
      this.time_of_work()
      this.consequence()
      this.root_cause()
      this.age()
      this.departmentCard()
      this.severityCard()
    } else {
      const start = new Date(this.dateRange.value.start)
      const end = new Date(this.dateRange.value.end)
      end.setDate(end.getDate() + 1)
      const startDate = new Date(start).toISOString()
      const endDate = new Date(end).toISOString()
      
      const data = this.acciData.filter(function (data) {
        return (data.attributes.accident_date >= startDate && data.attributes.accident_date < endDate)
      })
      this.accidentData = data

      this.accidentData.forEach((elem: any) => {
        elem.attributes.affected_individuals.data.forEach((elem2: any) => {
          this.individualData.push(elem2)
        })
      })
      const incidata = this.inciData.filter(function (data) {
        return (data.attributes.incident_date >= startDate && data.attributes.incident_date < endDate)
      })
      this.incidentData = incidata
      this.summary_card()
      this.expense()
      this.division()
      this.last_accident()
      this.category()
      this.bodyParts()
      this.gender()
      this.age()
      this.time_of_work()
      this.consequence()
      this.root_cause()
      this.departmentCard()
      this.severityCard()
    }
    Swal.close()
  }

  reset() {
    this.summaryCard = []
    this.amountCard = []
    this.cateData = []
    this.individualData = []
    this.consequenceData = []
    this.rootCauseData = []
    this.rootCauseData2 = [];
    (document.getElementById('month') as HTMLElement).classList.add('active');
    (document.getElementById('year') as HTMLElement).classList.remove('active');
    (document.getElementById('week') as HTMLElement).classList.remove('active')
    this.ngOnInit()
  }

  departmentCard() {
    const total = this.accidentData.length;
    const groupedDepartments: Record<string, any[]> = {};

    this.accidentData.forEach(function (data) {
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

  summary_card() {

    const category = this.dropdownValues.filter(function (data) {
      return (data.attributes.Category === "Category")
    })
    category.forEach(elem => {
      const category = this.accidentData.filter(function (data) {
        return (data.attributes.category === elem.attributes.Value)
      })
      const prevCategory = this.prevAccidentData.filter(function (data) {
        return (data.attributes.category === elem.attributes.Value)
      })
      const catLength = category.length
      const preCatLength = prevCategory.length
      if (catLength === 0) {
        this.summaryCard.push({
          category: elem.attributes.Value,
          count: category.length,
          icon: elem.attributes.icon,
          Attrition: '0%',
          Attrition_bg: 'text-success'
        })
      } else {
        if (catLength > preCatLength) {
          const attrition = Number(preCatLength) / Number(catLength) * 100
          const value = JSON.stringify(attrition.toFixed(0) + ' %')
          this.summaryCard.push({
            category: elem.attributes.Value,
            count: category.length,
            icon: elem.attributes.icon,
            Attrition_icon: 'icon-arrow-up',
            Attrition: value.replace(/['"]+/g, ''),
            Attrition_bg: 'text-danger'
          })
        } else if (catLength < preCatLength) {
          const attrition = Number(catLength) / Number(preCatLength) * 100
          const value = JSON.stringify(attrition.toFixed(0) + ' %')
          this.summaryCard.push({
            category: elem.attributes.Value,
            count: category.length,
            icon: elem.attributes.icon,
            Attrition_icon: 'icon-arrow-down',
            Attrition: value.replace(/['"]+/g, ''),
            Attrition_bg: 'text-success'
          })
        } else if (catLength === preCatLength) {
          this.summaryCard.push({
            category: elem.attributes.Value,
            count: category.length,
            icon: elem.attributes.icon,
            Attrition: '0%',
            Attrition_bg: 'text-success'
          })
        }
      }

    })
    const inciLength = this.incidentData.length
    const preInciLength = this.prevIncidentData.length
    if (inciLength === 0) {
      this.summaryCard.push({
        category: "Incidents Summary",
        count: inciLength,
        icon: "incident.png",
        Attrition: '0%',
        Attrition_bg: 'text-success'
      })
    }
    else {
      if (inciLength > preInciLength) {
        const attrition = Number(preInciLength) / Number(inciLength) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        this.summaryCard.push({
          category: "Incidents Summary",
          count: inciLength,
          icon: "incident.png",
          Attrition_icon: 'icon-arrow-up',
          Attrition: value.replace(/['"]+/g, ''),
          Attrition_bg: 'text-danger'
        })
      } else if (inciLength < preInciLength) {
        const attrition = Number(inciLength) / Number(preInciLength) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        this.summaryCard.push({
          category: "Incidents Summary",
          count: inciLength,
          icon: "incident.png",
          Attrition_icon: 'icon-arrow-down',
          Attrition: value.replace(/['"]+/g, ''),
          Attrition_bg: 'text-success'
        })
      } else if (inciLength === preInciLength) {
        this.summaryCard.push({
          category: "Incidents Summary",
          count: inciLength,
          icon: "incident.png",
          Attrition: '0%',
          Attrition_bg: 'text-success'
        })
      }
    }
  }

  expense() {
    const amount = Number(this.accidentData.reduce((acc, cur) => acc + Number(cur.attributes.amount), 0))
    const preAmount = Number(this.prevAccidentData.reduce((acc, cur) => acc + Number(cur.attributes.amount), 0))
    if (amount === 0) {
      this.amountCard.push({
        amount: amount,
        Attrition: '0%',
        Attrition_bg: 'text-success'
      })
    } else {
      if (amount > preAmount) {
        const attrition = Number(preAmount) / Number(amount) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        this.amountCard.push({
          amount: amount,
          Attrition_icon: 'icon-arrow-up',
          Attrition: value.replace(/['"]+/g, ''),
          Attrition_bg: 'text-danger'
        })
      } else if (amount < preAmount) {
        const attrition = Number(amount) / Number(preAmount) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        this.amountCard.push({
          amount: amount,
          Attrition_icon: 'icon-arrow-down',
          Attrition: value.replace(/['"]+/g, ''),
          Attrition_bg: 'text-success'
        })
      } else if (amount === preAmount) {
        this.amountCard.push({
          amount: amount,
          Attrition: '0%',
          Attrition_bg: 'text-success'
        })
      }
    }
  }

  division() {
    let diviName: any[] = []
    let divisionName: any[] = []
    this.accidentData.forEach(elem => {
      diviName.push(elem.attributes.division)
    })
    this.incidentData.forEach(elem => {
      diviName.push(elem.attributes.division)
    })
    var duplicateValue = new Set(diviName);
    diviName = [...duplicateValue];
    divisionName = diviName
    let division: any[] = []
    let envValue: any[] = []
    let safetyValue: any[] = []
    let healthValue: any[] = []
    let incidentValue: any[] = []
    divisionName.forEach(elem => {
      division.push(elem)
      const env = this.accidentData.filter(function (data) {
        return (data.attributes.division == elem && data.attributes.category === "Environmental")
      })
      if (env.length === 0) {
        envValue.push(Number(0))
      } else {
        envValue.push(Number(env.length))
      }
      const safety = this.accidentData.filter(function (data) {
        return (data.attributes.division == elem && data.attributes.category === "Safety")
      })
      if (safety.length === 0) {
        safetyValue.push(Number(0))
      } else {
        safetyValue.push(Number(safety.length))
      }
      const health = this.accidentData.filter(function (data) {
        return (data.attributes.division == elem && data.attributes.category === "Health")
      })
      if (health.length === 0) {
        healthValue.push(Number(0))

      } else {
        healthValue.push(Number(health.length))

      }
      const incident = this.incidentData.filter(function (data) {
        return (data.attributes.division == elem)
      })
      if (incident.length === 0) {
        incidentValue.push(Number(0))

      } else {
        incidentValue.push(Number(incident.length))

      }
    })
    this.divisionCategoryChart = {
      series: [
        {
          name: "Environment",
          data: envValue
        },
        {
          name: "Safety",
          data: safetyValue
        },
        {
          name: "Health",
          data: healthValue
        }
        ,
        {
          name: "Near Miss",
          data: incidentValue
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: division
      },
      yaxis: {
        title: {
          text: "Count"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return "Count" + val + " thousands";
          }
        }
      }
    }
  }

  last_accident() {

    if (this.filterForm.value.division) {
      const division = this.filterForm.value.division
      const accdata = this.acciData.filter(function (data) {
        return (data.attributes.division === division)
      })
      const data = accdata.sort((a, b) => (a.attributes.accident_date > b.attributes.accident_date) ? 1 : -1).reverse()

      if (data.length > 0) {
        const date = new Date(data[0].attributes.accident_date)
        const today = new Date()
        const difference = today.getTime() - date.getTime();
        const difference_Days = difference / (1000 * 3600 * 24);
        const last_accident = Number(Number(difference_Days)).toFixed(0) || 0
        this.lastaccidentchart = {
          series: [last_accident],
          chart: {
            height: 350,
            type: "radialBar"
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "70"
              },
              dataLabels: {
                show: true,
                name: {
                  offsetY: -10,
                  show: true,
                  color: "#888",
                  fontSize: "17px"
                },
                value: {
                  formatter: function (val: any) {
                    return parseInt(val.toString(), 10).toString();
                  },
                  color: "#111",
                  fontSize: "36px",
                  show: true
                }
              }
            },
          },
          labels: ["Day since last Accident"],
        }

      }


    } else {

      const data = this.acciData.sort((a, b) => (a.attributes.accident_date > b.attributes.accident_date) ? 1 : -1).reverse()
      if (data.length > 0) {
        const date = new Date(data[0].attributes.accident_date)
        this.lastAccidentDate = data[0].attributes.accident_date
        this.lastReportedDate = data[0].attributes.reported_date
        const today = new Date()
        const difference = today.getTime() - date.getTime();
        const difference_Days = difference / (1000 * 3600 * 24);
        const last_accident = Number(Number(difference_Days)).toFixed(0)
        this.lastaccidentchart = {
          series: [last_accident],
          chart: {
            height: 350,
            type: "radialBar"
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "70"
              },

              dataLabels: {
                show: true,
                name: {
                  offsetY: -10,
                  show: true,
                  color: "#888",
                  fontSize: "17px"
                },
                value: {
                  formatter: function (val: any) {
                    return parseInt(val.toString(), 10).toString();
                  },
                  color: "#111",
                  fontSize: "36px",
                  show: true
                }
              }
            },
          },
          labels: ["Day since last Accident"],
        }
      } else {
        this.lastaccidentchart = {
          series: [0],
          chart: {
            height: 350,
            type: "radialBar"
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "70"
              },

              dataLabels: {
                show: true,
                name: {
                  offsetY: -10,
                  show: true,
                  color: "#888",
                  fontSize: "17px"
                },
                value: {
                  formatter: function (val: any) {
                    return parseInt(val.toString(), 10).toString();
                  },
                  color: "#111",
                  fontSize: "36px",
                  show: true
                }
              }
            },
          },
          labels: ["Day since last Accident"],
        }
      }

    }
  }

  category() {
    const category = this.dropdownValues.filter(function (data) {
      return (data.attributes.Category === "Category")
    })
    const heathSubCat = this.dropdownValues.filter(function (data) {
      return (data.attributes.Category === "Sub Category" && data.attributes.filter === "Health")
    })
    const safetySubCat = this.dropdownValues.filter(function (data) {
      return (data.attributes.Category === "Sub Category" && data.attributes.filter === "Safety")
    })
    const envSubCat = this.dropdownValues.filter(function (data) {
      return (data.attributes.Category === "Sub Category" && data.attributes.filter === "Environmental")
    })
    let healthCount: number = 0
    let safetyCount: number = 0
    let environCount: number = 0
    category.forEach(elem => {
      const data = this.accidentData.filter(function (data) {
        return (data.attributes.category === elem.attributes.Value)
      })
      if (elem.attributes.Value === "Health") {
        healthCount = data.length
      } else if (elem.attributes.Value === "Safety") {
        safetyCount = data.length
      } else if (elem.attributes.Value === "Environmental") {
        environCount = data.length
      }
      const total = this.accidentData.length
      const percentage = Math.round(Number(data.length) / Number(total) * 100).toFixed(0)

      if (total === 0) {
        this.cateData.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: "overview"
        })
      } else {
        this.cateData.push({
          name: elem.attributes.Value,
          count: data.length,
          percentage: percentage,
          category: "overview"
        })
      }

    })
    heathSubCat.forEach(elem => {
      const data = this.accidentData.filter(function (data) {
        return (data.attributes.sub_category === elem.attributes.Value)
      })
      // const total = this.accidentData.length
      const percentage = Math.round(Number(data.length) / Number(healthCount) * 100).toFixed(0)

      if (healthCount === 0) {
        this.cateData.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: "health"
        })
      } else {
        this.cateData.push({
          name: elem.attributes.Value,
          count: data.length,
          percentage: percentage,
          category: "health"
        })
      }

      // this.cateData.push({
      //   name: elem.attributes.Value,
      //   count: data.length,
      //   percentage: percentage,
      //   category: "health"
      // })
    })
    safetySubCat.forEach(elem => {
      const data = this.accidentData.filter(function (data) {
        return (data.attributes.sub_category === elem.attributes.Value)
      })
      // const total = this.accidentData.length
      const percentage = Math.round(Number(data.length) / Number(safetyCount) * 100).toFixed(0)

      if (safetyCount === 0) {
        this.cateData.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: "safety"
        })
      } else {
        this.cateData.push({
          name: elem.attributes.Value,
          count: data.length,
          percentage: percentage,
          category: "safety"
        })
      }

      // this.cateData.push({
      //   name: elem.attributes.Value,
      //   count: data.length,
      //   percentage: percentage,
      //   category: "safety"
      // })
    })
    envSubCat.forEach(elem => {
      const data = this.accidentData.filter(function (data) {
        return (data.attributes.sub_category === elem.attributes.Value)
      })
      // const total = this.accidentData.length
      const percentage = Math.round(Number(data.length) / Number(environCount) * 100).toFixed(0)

      if (environCount === 0) {
        this.cateData.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: "environment"
        })
      } else {
        this.cateData.push({
          name: elem.attributes.Value,
          count: data.length,
          percentage: percentage,
          category: "environment"
        })
      }

      // this.cateData.push({
      //   name: elem.attributes.Value,
      //   count: data.length,
      //   percentage: percentage,
      //   category: "environment"
      // })
    })
  }

  bodyParts() {
    const bodyParts = this.dropdownValues.filter(function (data) {
      return (data.attributes.Category === "Body Part")
    })
    const injuryType = this.dropdownValues.filter(function (data) {
      return (data.attributes.Category === "Injury Type")
    })
    const injuryCause = this.dropdownValues.filter(function (data) {
      return (data.attributes.Category === "Injury Cause")
    })
    const injuryDamage = this.dropdownValues.filter(function (data) {
      return (data.attributes.Category === "Damage")
    })
    const illness = this.dropdownValues.filter(function (data) {
      return (data.attributes.Category === "Disease")
    })
    const env = this.dropdownValues.filter(function (data) {
      return (data.attributes.Category === "Environment")
    })
    bodyParts.forEach(elem => {
      const data = this.accidentData.filter(function (data) {
        return (data.attributes.affected_body_parts.includes(elem.attributes.Value))
      })
      const total = this.accidentData.length
      const percentage = Math.round(Number(data.length) / Number(total) * 100).toFixed(0)

      if (total === 0) {
        this.cateData.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: "body part"
        })
      } else {
        this.cateData.push({
          name: elem.attributes.Value,
          count: data.length,
          percentage: percentage,
          category: "body part"
        })
      }

    })
    injuryType.forEach(elem => {
      const data = this.accidentData.filter(function (data) {
        return (data.attributes.injury_type.includes(elem.attributes.Value))
      })
      const total = this.accidentData.length
      const percentage = Math.round(Number(data.length) / Number(total) * 100).toFixed(0)

      if (total === 0) {
        this.cateData.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: "injury type"
        })
      } else {
        this.cateData.push({
          name: elem.attributes.Value,
          count: data.length,
          percentage: percentage,
          category: "injury type"
        })
      }

    })

    injuryCause.forEach(elem => {
      const data = this.accidentData.filter(function (data) {
        return (data.attributes.injury_type.includes(elem.attributes.Value))
      })
      const total = this.accidentData.length
      const percentage = Math.round(Number(data.length) / Number(total) * 100).toFixed(0)

      if (total === 0) {
        this.cateData.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: "injury cause"
        })
      } else {
        this.cateData.push({
          name: elem.attributes.Value,
          count: data.length,
          percentage: percentage,
          category: "injury cause"
        })
      }

    })

    injuryDamage.forEach(elem => {
      const data = this.accidentData.filter(function (data) {
        return (data.attributes.injury_type.includes(elem.attributes.Value))
      })
      const total = this.accidentData.length
      const percentage = Math.round(Number(data.length) / Number(total) * 100).toFixed(0)
      if (total === 0) {
        this.cateData.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: "damage"
        })
      } else {
        this.cateData.push({
          name: elem.attributes.Value,
          count: data.length,
          percentage: percentage,
          category: "damage"
        })
      }

    })

    illness.forEach(elem => {
      const data = this.accidentData.filter(function (data) {
        return (data.attributes.injury_type.includes(elem.attributes.Value))
      })
      const total = this.accidentData.length
      const percentage = Math.round(Number(data.length) / Number(total) * 100).toFixed(0)
      if (total === 0) {
        this.cateData.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: "illness"
        })
      } else {
        this.cateData.push({
          name: elem.attributes.Value,
          count: data.length,
          percentage: percentage,
          category: "illness"
        })
      }

    })

    env.forEach(elem => {
      const data = this.accidentData.filter(function (data) {
        return (data.attributes.injury_type.includes(elem.attributes.Value))
      })
      const total = this.accidentData.length
      const percentage = Math.round(Number(data.length) / Number(total) * 100).toFixed(0)
      if (total === 0) {
        this.cateData.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: "environmental"
        })
      } else {
        this.cateData.push({
          name: elem.attributes.Value,
          count: data.length,
          percentage: percentage,
          category: "environmental"
        })
      }
    })
  }

  gender() {
    const maleData = this.individualData.filter(function (data: any) {
      return (data.attributes.gender === "Male")
    })
    const femaleData = this.individualData.filter(function (data: any) {
      return (data.attributes.gender === "Female")
    })
    const total = Number(maleData.length) + Number(femaleData.length)
    const mPerc = Math.round(Number(maleData.length) / Number(total) * 100).toFixed(0)
    const fPerc = Math.round(Number(femaleData.length) / Number(total) * 100).toFixed(0)
    this.maleCount = maleData.length
    this.femaleCount = femaleData.length
    this.genderChart.series = [Number(mPerc), Number(fPerc)]
  }

  age() {
    const ageBar1 = this.individualData.filter(function (elem) {
      return (elem.attributes.age >= 16 && elem.attributes.age <= 19)
    })
    const ageBar2 = this.individualData.filter(function (elem) {
      return (elem.attributes.age >= 20 && elem.attributes.age <= 24)
    })
    const ageBar3 = this.individualData.filter(function (elem) {
      return (elem.attributes.age >= 25 && elem.attributes.age <= 34)
    })
    const ageBar4 = this.individualData.filter(function (elem) {
      return (elem.attributes.age >= 35 && elem.attributes.age <= 44)
    })
    const ageBar5 = this.individualData.filter(function (elem) {
      return (elem.attributes.age >= 45 && elem.attributes.age <= 54)
    })
    const ageBar6 = this.individualData.filter(function (elem) {
      return (elem.attributes.age >= 55 && elem.attributes.age <= 60)
    })
    const ageBar7 = this.individualData.filter(function (elem) {
      return (elem.attributes.age > 60)
    })
    this.ageChart.series = [{
      name: "Count",
      data: [ageBar1.length, ageBar2.length, ageBar3.length, ageBar4.length, ageBar5.length, ageBar6.length, ageBar7.length]
    }]
  }

  time_of_work() {
    let time_work: any[] = ['0 Days', '≤ 2 Days', '> 2 Days', 'Permenent']
    let timeWorkData: any[] = []
    const total = this.accidentData.length
    time_work.forEach(elem => {
      const data = this.accidentData.filter(function (data: any) {
        return (data.attributes.time_of_work === elem)
      })
      const percentage = Math.round(Number(data.length) / Number(total) * 100).toFixed(0)
      if (total === 0) {
        timeWorkData.push({
          name: elem,
          count: 0,
          percentage: 0
        })

      } else {
        timeWorkData.push({
          name: elem,
          count: data.length,
          percentage: percentage
        })
      }

    })
    this.timeWorkData = timeWorkData
  }

  consequence() {
    let cate: any[] = ["Lost Time", "Medical Case", "First Aid", "No Treatment", "Lost Day"]
    const total = this.accidentData.length
    cate.forEach(elem => {
      const data = this.accidentData.filter(function (data) {
        return (data.attributes.consiquence_category.includes(elem))
      })
      const count = data.length
      const percentage = Math.round(Number(count) / Number(total) * 100).toFixed(0)
      if (total === 0) {
        this.consequenceData.push({
          name: elem,
          count: 0,
          percentage: 0
        })
      } else {
        this.consequenceData.push({
          name: elem,
          count: count,
          percentage: percentage
        })
      }

    })
  }

  root_cause() {
    let data: any[] = []
    let total = this.accidentData.length
    
    this.accidentData.forEach(elem => {
      elem.attributes.root_causes.data.forEach((rootData: any) => {
        data.push(rootData)
      })
    })
    this.accidentService.get_accident_root_cause().subscribe({
      next: (result: any) => {
        this.rootCause = result.data
        let category: any[] = []
        let categoryName: any[] = []
        this.rootCause.forEach(elem => {
          category.push(elem.attributes.category)
        })
        var duplicateValue = new Set(category);
        let catName: any[] = []
        catName = [...duplicateValue];
        categoryName = catName


        let indCatCount: number = 0
        categoryName.forEach(catName => {
          const rootData = data.filter(function (elem) {
            return (elem.attributes.category === catName)
          })
          const count = rootData.length
          indCatCount = count
          const percentage = Math.round(Number(count) / Number(total) * 100).toFixed(0)

          if (total === 0) {
            this.rootCauseData.push({
              name: catName,
              count: 0,
              percentage: 0,
              category: 'overview',
            })
          } else {
            this.rootCauseData.push({
              name: catName,
              count: count,
              percentage: percentage,
              category: 'overview',
            })
          }

        })
        this.rootCause.forEach(elem2 => {
          const rootData2 = data.filter(function (elem) {
            return (elem.attributes.title === elem2.attributes.title)
          })
          if (rootData2.length > 0) {
            const count = rootData2.length
            const percentage = Math.round(Number(count) / Number(indCatCount) * 100).toFixed(0)
            if (indCatCount === 0) {
              this.rootCauseData2.push({
                name: elem2.attributes.title,
                count: 0,
                percentage: 0,
                category: elem2.attributes.category,
              })
            } else {
              this.rootCauseData2.push({
                name: elem2.attributes.title,
                count: count,
                percentage: percentage,
                category: elem2.attributes.category,
              })
            }

          }
        })
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  severityCard() {
    const total = this.incidentData.length
    const veryhighseverity = this.incidentData.filter(function (data) {
      return (data.attributes.severity === "Very High")
    })
    const extremeseverity = this.incidentData.filter(function (data) {
      return (data.attributes.severity === "Extreme")
    })
    const highseverity = this.incidentData.filter(function (data) {
      return (data.attributes.severity === "High")
    })
    const mediumseverity = this.incidentData.filter(function (data) {
      return (data.attributes.severity === "Medium")
    })
    const lowseverity = this.incidentData.filter(function (data) {
      return (data.attributes.severity === "Low")
    })
    this.veryhighCount = veryhighseverity.length
    this.extremeCount = extremeseverity.length
    this.highCount = highseverity.length
    this.mediumCount = mediumseverity.length
    this.lowCount = lowseverity.length

    let veryhighPercentage = '0'
    let extremePercentage = '0'
    let highPercentage = '0'
    let mediumPercentage = '0'
    let lowPercentage = '0'
    if (total > 0) {
      veryhighPercentage = ((veryhighseverity.length / total) * 100).toFixed(0);
      extremePercentage = ((extremeseverity.length / total) * 100).toFixed(0);
      highPercentage = ((highseverity.length / total) * 100).toFixed(0);
      mediumPercentage = ((mediumseverity.length / total) * 100).toFixed(0);
      lowPercentage = ((lowseverity.length / total) * 100).toFixed(0);
    }
    this.severityPieChart = {
      chart: {
        type: 'pie',
        height: 280,
      },
      series: [Number(extremePercentage), Number(veryhighPercentage), Number(highPercentage), Number(mediumPercentage), Number(lowPercentage)],
      labels: ['Extreme', 'Very High', 'High', 'Medium', 'Low'],
      colors: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#87CEFA'],
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

  filterCategory(value: any) {
    return value.category === "overview"
  }

  filterHealthCategory(value: any) {
    return value.category === "health"
  }

  filterSafetyCategory(value: any) {
    return value.category === "safety"
  }

  filterEnvCategory(value: any) {
    return value.category === "environment"
  }

  filterBodySubCategory(value: any) {
    return value.category === "body part"
  }

  filterTypeSubCategory(value: any) {
    return value.category === "injury type"
  }

  filterCauseSubCategory(value: any) {
    return value.category === "injury cause"
  }

  filterDamageSubCategory(value: any) {
    return value.category === "damage"
  }

  filterIllnessSubCategory(value: any) {
    return value.category === "illness"
  }

  filterEnvSubCategory(value: any) {
    return value.category === "environmental"
  }

  filterUnsafeActs(value: any) {
    return value.category === "Unsafe Acts"
  }

  filterUnsafeCondition(value: any) {
    return value.category === "Unsafe Conditions"
  }

  filterPersonalFactor(value: any) {
    return value.category === "Personnel Factor"
  }

  filterJobFactor(value: any) {
    return value.category === "Job Factor"
  }

  accRegister() {
    this.router.navigate(["apps/accident-incident/accident-register"])
  }

}
