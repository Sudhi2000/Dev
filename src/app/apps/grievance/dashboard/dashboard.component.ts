import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ChartType, grvCategoryChart, grvBreakdownChart, grvTypeChart, topicChart, channelChart, responseTimeChart, departmentChart, grvSeverityScoreChart, RatingChart, anonymousChart, closureRateChart, grvStatusChart } from './chart-model';
import { GeneralService } from 'src/app/services/general.api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.api.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { GrievanceService } from 'src/app/services/grievance.api.service';

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


  imageURL: any
  currency: any
  divisions: any[] = []
  orgID: any
  filterForm: FormGroup
  summaryCardData: any[] = []
  dateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  prevDateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  grvTypeChart: ChartType
  grvBreakdownChart: ChartType
  grvCategoryChart: ChartType
  grvSeverityScoreChart: ChartType
  channelChart: ChartType
  topicChart: ChartType
  departmentChart: ChartType
  responseTimeChart: ChartType
  RatingChart: ChartType
  anonymousChart: ChartType
  closureRateChart: ChartType
  grvStatusChart: ChartType
  anonymous: any
  nonAnonymous: any
  dropDownValue: any[] = []
  categories: any[] = []
  periodValues: any[] = []
  periods: any[] = []
  grievanceData: any[] = []
  prevGrievanceData: any[] = []
  dashboardData: any[] = []
  years: any[] = []
  grvtypeNames: string[] = [];
  grvtypeCounts: number[] = [];
  grvTotal: any
  complaintTotal: any
  suggestionTotal: any
  questionTotal: any
  appreciationTotal: any
  grvCategoryNames: string[] = [];
  grvCategoryCounts: number[] = [];
  grvChannelNames: string[] = [];
  grvChannelCounts: number[] = [];
  grvSeverityNames: string[] = [];
  grvSeverityCounts: number[] = [];
  grvRatingCard: any[] = []
  closureRateData: any[] = []
  unitSpecific: any
  userDivision: any
  corporateUser: any

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private grievanceService: GrievanceService) { }


  ngOnInit(): void {
    this.grvTypeChart = grvTypeChart
    this.grvBreakdownChart = grvBreakdownChart
    this.grvCategoryChart = grvCategoryChart
    this.grvSeverityScoreChart = grvSeverityScoreChart
    this.channelChart = channelChart
    this.departmentChart = departmentChart
    this.topicChart = topicChart
    this.responseTimeChart = responseTimeChart
    this.RatingChart = RatingChart
    this.anonymousChart = anonymousChart
    this.closureRateChart = closureRateChart
    this.grvStatusChart = grvStatusChart
    this.imageURL = environment.client_backend + '/uploads/'
    this.configuration()
    this.filterForm = this.formBuilder.group({
      startDate: [''],
      endDate: [''],
      division: [''],
      category: [''],
      period: [''],
      year: [],
      prevStartDate: [''],
      prevEndDate: ['']

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
    this.filterForm.controls['startDate'].setValue(monthStartDate)
    this.filterForm.controls['endDate'].setValue(monthEndDate)
    const lastMonthstart = new Date(curr.getFullYear(), curr.getMonth() - 1);
    lastMonthstart.setDate(lastMonthstart.getDate())
    const lastMonthEnd = new Date(curr.getFullYear(), curr.getMonth(), 0)
    lastMonthEnd.setDate(lastMonthEnd.getDate())
    this.prevDateRange.controls['start'].setValue(new Date(lastMonthstart))
    this.prevDateRange.controls['end'].setValue(new Date(lastMonthEnd))
    this.filterForm.controls['prevStartDate'].setValue(new Date(lastMonthstart))
    this.filterForm.controls['prevEndDate'].setValue(new Date(lastMonthEnd))
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.grievance
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          Swal.close()
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          this.currency = result.data.attributes.currency
          this.years = result.data.attributes.Year
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
        const status = result.grev_dashboard
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
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
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
    const selectedDate = new Date(event.value);
    const startDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0,
        0
      )
    ).toISOString();

    this.filterForm.controls['startDate'].setValue(startDate);
  }

  endDateChange(event: any) {
    this.filterForm.controls['year'].reset()
    const selectedDate = new Date(event.value);
    const endDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0,
        0
      )
    ).toISOString();

    this.filterForm.controls['endDate'].setValue(endDate);
  }

  onPeriodChange(event: any) {
    this.dateRange.reset()
    this.filterForm.controls['year'].reset()
    const selectedPeriod = event.value;
    if (selectedPeriod === 'This Week') {
      const currentDate = new Date();
      const startOfWeek = currentDate.getDate() - currentDate.getDay();
      const startDate = new Date(currentDate.setDate(startOfWeek));
      const endDate = new Date(currentDate.setDate(startOfWeek + 6));
      this.filterForm.controls['startDate'].setValue(startDate.toISOString());
      this.filterForm.controls['endDate'].setValue(endDate.toISOString());
      this.dateRange.controls['start'].setValue(startDate.toISOString())
      this.dateRange.controls['end'].setValue(endDate.toISOString())
      this.dateRange.controls.start.disable();
      this.dateRange.controls.end.disable();
    }
    else if (selectedPeriod === 'Last Week') {
      const currentDate = new Date();
      const startOfWeek = currentDate.getDate() - currentDate.getDay() - 7;
      const startDate = new Date(currentDate.setDate(startOfWeek));
      const endDate = new Date(currentDate.setDate(startOfWeek + 6));
      this.filterForm.controls['startDate'].setValue(startDate.toISOString());
      this.filterForm.controls['endDate'].setValue(endDate.toISOString());
      this.dateRange.controls['start'].setValue(startDate.toISOString())
      this.dateRange.controls['end'].setValue(endDate.toISOString())
      this.dateRange.controls.start.disable();
      this.dateRange.controls.end.disable();
    }
    else if (selectedPeriod === 'This Month') {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const startOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1));
      const endOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59));
      this.filterForm.controls['startDate'].setValue(startOfMonth.toISOString().split('T')[0]);
      this.filterForm.controls['endDate'].setValue(endOfMonth.toISOString().split('T')[0]);
      this.dateRange.controls['start'].setValue(startOfMonth.toISOString().split('T')[0])
      this.dateRange.controls['end'].setValue(endOfMonth.toISOString().split('T')[0])
      this.dateRange.controls.start.disable();
      this.dateRange.controls.end.disable();
    }
    else if (selectedPeriod === 'Last Month') {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const startOfMonth = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
      const endOfMonth = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59));
      this.filterForm.controls['startDate'].setValue(startOfMonth.toISOString().split('T')[0]);
      this.filterForm.controls['endDate'].setValue(endOfMonth.toISOString().split('T')[0]);
      this.dateRange.controls['start'].setValue(startOfMonth.toISOString().split('T')[0])
      this.dateRange.controls['end'].setValue(endOfMonth.toISOString().split('T')[0])
      this.dateRange.controls.start.disable();
      this.dateRange.controls.end.disable();
    }
    else if (selectedPeriod === 'This Year') {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const startOfYear = new Date(Date.UTC(currentYear, 0, 1));
      const endOfYear = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59));
      this.filterForm.controls['startDate'].setValue(startOfYear.toISOString().split('T')[0]);
      this.filterForm.controls['endDate'].setValue(endOfYear.toISOString().split('T')[0]);
      this.dateRange.controls['start'].setValue(startOfYear.toISOString().split('T')[0])
      this.dateRange.controls['end'].setValue(endOfYear.toISOString().split('T')[0])
      this.dateRange.controls.start.disable();
      this.dateRange.controls.end.disable();
    }
    else if (selectedPeriod === 'Last Year') {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const startOfYear = new Date(Date.UTC(currentYear - 1, 0, 1));
      const endOfYear = new Date(Date.UTC(currentYear - 1, 11, 31, 23, 59, 59));
      this.filterForm.controls['startDate'].setValue(startOfYear.toISOString().split('T')[0]);
      this.filterForm.controls['endDate'].setValue(endOfYear.toISOString().split('T')[0]);
      this.dateRange.controls['start'].setValue(startOfYear.toISOString().split('T')[0])
      this.dateRange.controls['end'].setValue(endOfYear.toISOString().split('T')[0])
      this.dateRange.controls.start.disable();
      this.dateRange.controls.end.disable();
    }
    else {
      this.dateRange.controls.start.enable();
      this.dateRange.controls.end.enable();
    }

  }

  yearVal(data: any) {
    this.dateRange.reset()
    this.filterForm.controls['period'].reset()
    const startDate = (moment().set({ 'year': this.filterForm.value.year, 'month': 0, 'date': 1 })).format('yyyy-MM-DD')
    const endDate = (moment().set({ 'year': this.filterForm.value.year, 'month': 11, 'date': 31 })).format('yyyy-MM-DD')
    this.dateRange.controls['start'].setValue(startDate)
    this.dateRange.controls['end'].setValue(endDate)
    this.filterForm.controls['startDate'].setValue(startDate);
    this.filterForm.controls['endDate'].setValue(endDate);
  }

  get_division() {
    this.divisions = []
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
          division_uuid: attributes.division_uuid
        }));
        this.divisions = newArray;

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

  get_dropdown_values() {
    const module = "Grievance"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValue = result.data
        const category = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Category")
        })
        this.categories = category
      },
      error: (err: any) => { },
      complete: () => {
        this.get_periods()
      }
    })
  }

  get_periods() {
    const module = "General"

    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValue = result.data
        const periodData = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Period")
        })
        this.periodValues = periodData
      },
      error: (err: any) => { },
      complete: () => {
        this.default_data()
      }

    })
  }



  default_data() {

    const startDate = new Date(this.filterForm.value.startDate)
    startDate.setDate(startDate.getDate() + 1)
    const endDate = new Date(this.filterForm.value.endDate)
    endDate.setDate(endDate.getDate() + 1)
    const start = new Date(startDate).toISOString()
    const end = new Date(endDate).toISOString()


    const prevStartDate = new Date(this.prevDateRange.value.start)
    prevStartDate.setDate(prevStartDate.getDate() + 1)
    const prevEndDate = new Date(this.prevDateRange.value.end)
    prevEndDate.setDate(prevEndDate.getDate() + 1)
    const prevStart = new Date(prevStartDate).toISOString()
    const prevEnd = new Date(prevEndDate).toISOString()

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    this.grievanceService.generate_grievance_data(start, end, this.userDivision).subscribe({
      next: (result: any) => {
        //get previous month data
        this.grievanceService.generate_grievance_data(prevStart, prevEnd, this.userDivision).subscribe({
          next: (preResult: any) => {
            this.grievanceData = result.data
            this.prevGrievanceData = preResult.data
            this.summary_card()
            this.grvTypeBreakdown()
            this.grvCategoryBreakdown()
            this.grv_topic_Card()
            this.grv_channel_Card()
            this.responseTime()
            this.grv_department_Card()
            this.grvSeverityScore_card()
            this.Rating_Card()
            this.anonymousCard()
            this.closure_rate_card()
          },
          error: (err: any) => { },
          complete: () => {
            this.grievanceService.generate_grievance_year(currentYear, this.userDivision).subscribe({
              next: (result: any) => {
                this.grievanceData = result.data
                this.grievance_type_Card()
                this.grievance_status_Card()
              },
              error: (err: any) => { },
              complete: () => {
                Swal.close()
              }
            })
          }
        })
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
  }

  reset() {
    this.summaryCardData = []
    this.dateRange.controls.start.enable();
    this.dateRange.controls.end.enable();
    this.ngOnInit()
  }

  search() {
    if (this.filterForm.value.division && !this.filterForm.value.category && this.filterForm.value.year) {
      this.showProgressPopup()
      this.division_year_date()
    } else if (!this.filterForm.value.division && this.filterForm.value.category && this.filterForm.value.year) {
      this.showProgressPopup()
      this.category_year_date()
    } else if (this.filterForm.value.division && this.filterForm.value.category && this.filterForm.value.year) {
      this.showProgressPopup()
      this.division_category_year_date()
    } else if (!this.filterForm.value.division && !this.filterForm.value.category && this.filterForm.value.year) {
      this.summaryCardData = []

      this.showProgressPopup()
      this.year_date()

    }
    else if (this.filterForm.value.division && !this.filterForm.value.category && !this.filterForm.value.year) {
      this.showProgressPopup()
      this.division_date()
    } else if (!this.filterForm.value.division && this.filterForm.value.category && !this.filterForm.value.year) {
      this.showProgressPopup()
      this.category_date()
    } else if (this.filterForm.value.division && this.filterForm.value.category && !this.filterForm.value.year) {
      this.showProgressPopup()
      this.division_category_date()
    } else if (!this.filterForm.value.division && !this.filterForm.value.category && !this.filterForm.value.year) {
      this.summaryCardData = []

      this.showProgressPopup()
      this.period_date()

    }
  }

  period_date() {

    const startDate = new Date(this.filterForm.value.startDate)
    const endDate = new Date(this.filterForm.value.endDate)
    const start = new Date(startDate).toISOString()
    const end = new Date(endDate).toISOString()


    const prevStartDate = new Date(this.prevDateRange.value.start)
    prevStartDate.setDate(prevStartDate.getDate() + 1)
    const prevEndDate = new Date(this.prevDateRange.value.end)
    prevEndDate.setDate(prevEndDate.getDate() + 1)
    const prevStart = new Date(prevStartDate).toISOString()
    const prevEnd = new Date(prevEndDate).toISOString()


    this.grievanceService.generate_grievance_data(start, end, this.userDivision).subscribe({
      next: (result: any) => {
        this.grievanceService.generate_grievance_data(prevStart, prevEnd, this.userDivision).subscribe({
          next: (preResult: any) => {
            this.grievanceData = result.data
            this.prevGrievanceData = preResult.data
          },
          error: (err: any) => { },
          complete: () => {
            this.summary_card()
            this.grvTypeBreakdown()
            this.grvCategoryBreakdown()
            this.grv_topic_Card()
            this.grv_channel_Card()
            this.responseTime()
            this.grv_department_Card()
            this.grvSeverityScore_card()
            this.Rating_Card()
            this.anonymousCard()
            this.closure_rate_card()
          }
        })
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
  }
  division_year_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const division = this.filterForm.value.division
    const year = this.filterForm.value.year
    this.grievanceService.generate_grievance_data_division_year(start, end, division, year).subscribe({
      next: (result: any) => {
        this.grievanceData = result.data
        this.summaryCardData = []
        this.summary_card()
        this.grvTypeBreakdown()
        this.grvCategoryBreakdown()
        this.grv_topic_Card()
        this.grv_channel_Card()
        this.responseTime()
        this.grv_department_Card()
        this.grvSeverityScore_card()
        this.Rating_Card()
        this.anonymousCard()
        this.closure_rate_card()
      },
      error: (err: any) => { },
      complete: () => {
        this.grievanceService.generate_grievance_division_year(division, year).subscribe({
          next: (result: any) => {
            this.grievanceData = result.data
            this.grievance_type_Card()
            this.grievance_status_Card()
          },
          error: (err: any) => { },
          complete: () => {
            Swal.close()
          }
        })
        Swal.close()

      }
    })


  }
  division_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const division = this.filterForm.value.division

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    this.grievanceService.generate_grievance_data_division(start, end, division).subscribe({
      next: (result: any) => {
        this.grievanceData = result.data
        this.summaryCardData = []
        this.summary_card()
        this.grvTypeBreakdown()
        this.grvCategoryBreakdown()
        this.grv_topic_Card()
        this.grv_channel_Card()
        this.responseTime()
        this.grv_department_Card()
        this.grvSeverityScore_card()
        this.Rating_Card()
        this.anonymousCard()
        this.closure_rate_card()
      },
      error: (err: any) => { },
      complete: () => {
        this.grievanceService.generate_grievance_division_year(division, currentYear).subscribe({
          next: (result: any) => {
            this.grievanceData = result.data
            this.grievance_type_Card()
            this.grievance_status_Card()
          },
          error: (err: any) => { },
          complete: () => {
            Swal.close()
          }
        })
        Swal.close()

      }
    })


  }
  year_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const year = this.filterForm.value.year
    this.grievanceService.generate_grievance_data_year(start, end, year, this.userDivision).subscribe({
      next: (result: any) => {
        this.grievanceData = result.data
        this.summaryCardData = []
        this.summary_card()
        this.grvTypeBreakdown()
        this.grvCategoryBreakdown()
        this.grv_topic_Card()
        this.grv_channel_Card()
        this.responseTime()
        this.grv_department_Card()
        this.grvSeverityScore_card()
        this.Rating_Card()
        this.anonymousCard()
        this.closure_rate_card()
      },
      error: (err: any) => { },
      complete: () => {
        this.grievanceService.generate_grievance_year(year, this.userDivision).subscribe({
          next: (result: any) => {
            this.grievanceData = result.data
            this.grievance_type_Card()
            this.grievance_status_Card()
          },
          error: (err: any) => { },
          complete: () => {
            Swal.close()
          }
        })
        Swal.close()

      }
    })
  }

  category_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const category = this.filterForm.value.category
    this.grievanceService.generate_grievance_data_category(start, end, category, this.userDivision).subscribe({
      next: (result: any) => {
        this.grievanceData = result.data
        this.summaryCardData = []
        this.summary_card()
        this.grvTypeBreakdown()
        this.grvCategoryBreakdown()
        this.grv_topic_Card()
        this.grv_channel_Card()
        this.responseTime()
        this.grv_department_Card()
        this.grvSeverityScore_card()
        this.Rating_Card()
        this.anonymousCard()
        this.closure_rate_card()
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
  }

  division_category_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const division = this.filterForm.value.division
    const category = this.filterForm.value.category

    this.grievanceService.generate_grievance_data_division_category(start, end, division, category).subscribe({
      next: (result: any) => {
        this.grievanceData = result.data
        this.summaryCardData = []
        this.summary_card()
        this.grvTypeBreakdown()
        this.grvCategoryBreakdown()
        this.grv_topic_Card()
        this.grv_channel_Card()
        this.responseTime()
        this.grv_department_Card()
        this.grvSeverityScore_card()
        this.Rating_Card()
        this.anonymousCard()
        this.closure_rate_card()
      },
      error: (err: any) => { },
      complete: () => {
        this.grievanceService.generate_grievance_division(division).subscribe({
          next: (result: any) => {
            this.grievanceData = result.data
            this.grievance_type_Card()
            this.grievance_status_Card()
          },
          error: (err: any) => { },
          complete: () => {
            Swal.close()
          }
        })
        Swal.close()
      }
    })
  }

  category_year_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const category = this.filterForm.value.category
    const year = this.filterForm.value.year
    this.grievanceService.generate_grievance_data_category_year(start, end, category, year, this.userDivision).subscribe({
      next: (result: any) => {
        this.grievanceData = result.data
        this.summaryCardData = []
        this.summary_card()
        this.grvTypeBreakdown()
        this.grvCategoryBreakdown()
        this.grv_topic_Card()
        this.grv_channel_Card()
        this.responseTime()
        this.grv_department_Card()
        this.grvSeverityScore_card()
        this.Rating_Card()
        this.anonymousCard()
        this.closure_rate_card()
      },
      error: (err: any) => { },
      complete: () => {
        this.grievanceService.generate_grievance_year(year, this.userDivision).subscribe({
          next: (result: any) => {
            this.grievanceData = result.data
            this.grievance_type_Card()
            this.grievance_status_Card()
          },
          error: (err: any) => { },
          complete: () => {
            Swal.close()
          }
        })
        Swal.close()
      }
    })
  }

  division_category_year_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const division = this.filterForm.value.division
    const category = this.filterForm.value.category
    const year = this.filterForm.value.year
    this.grievanceService.generate_grievance_data_division_category_year(start, end, division, category, year).subscribe({
      next: (result: any) => {
        this.grievanceData = result.data
        this.summaryCardData = []
        this.summary_card()
        this.grvTypeBreakdown()
        this.grvCategoryBreakdown()
        this.grv_topic_Card()
        this.grv_channel_Card()
        this.responseTime()
        this.grv_department_Card()
        this.grvSeverityScore_card()
        this.Rating_Card()
        this.anonymousCard()
        this.closure_rate_card()
      },
      error: (err: any) => { },
      complete: () => {
        this.grievanceService.generate_grievance_division_year(division, year).subscribe({
          next: (result: any) => {
            this.grievanceData = result.data
            this.grievance_type_Card()
            this.grievance_status_Card()
          },
          error: (err: any) => { },
          complete: () => {
            Swal.close()
          }
        })
        Swal.close()
      }
    })
  }

  summary_card() {
    let totAttrition = ''
    let totAttrition_icon = ''
    let totAttrition_bg = ''

    let comAttrition = ''
    let comAttrition_icon = ''
    let comAttrition_bg = ''

    let openAttrition = ''
    let openAttrition_icon = ''
    let openAttrition_bg = ''

    let inproAttrition = ''
    let inproAttrition_icon = ''
    let inproAttrition_bg = ''

    let tatAttrition = ''
    let tatAttrition_icon = ''
    let tatAttrition_bg = ''

    let ratAttrition = ''
    let ratAttrition_icon = ''
    let ratAttrition_bg = ''
    const start = new Date(this.filterForm.value.startDate);
    const end = new Date(this.filterForm.value.endDate);
    const startMonth = start.getMonth() + 1;
    const startYear = start.getFullYear();
    const endMonth = end.getMonth() + 1;
    const endYear = end.getFullYear();

    const tatData = this.grievanceData.filter((elem) => {
      const status = elem.attributes.status;
      const grievanceType = elem.attributes.type;
      const resolutionDate = new Date(elem.attributes.resolution_date);
      const resolutionMonth = resolutionDate.getMonth() + 1;
      const resolutionYear = resolutionDate.getFullYear();
      const isWithinRange =
        (resolutionYear > startYear || (resolutionYear === startYear && resolutionMonth >= startMonth)) &&
        (resolutionYear < endYear || (resolutionYear === endYear && resolutionMonth <= endMonth));

      return status === "Completed" && (grievanceType === "Grievance" || grievanceType === "Compliant") && isWithinRange;
    });

    const comData = this.grievanceData.filter(function (elem) {
      return (elem.attributes.status == "Completed" && elem.attributes.rating !== null)
    })
    const openData = this.grievanceData.filter(function (elem) {
      return (elem.attributes.status == "Open")
    })
    const inPrData = this.grievanceData.filter(function (elem) {
      return (elem.attributes.status == "In-Progress")
    })


    //previous data
    const prevComData = this.prevGrievanceData.filter(function (elem) {
      return (elem.attributes.status == "Completed")
    })
    const prevOpenData = this.prevGrievanceData.filter(function (elem) {
      return (elem.attributes.status == "Open")
    })
    const prevInPrData = this.prevGrievanceData.filter(function (elem) {
      return (elem.attributes.status == "In-Progress")
    })
    const prevtatData = this.prevGrievanceData.filter((elem) => {
      const status = elem.attributes.status;
      const grievanceType = elem.attributes.type;
      const resolutionDate = new Date(elem.attributes.resolution_date);
      const resolutionMonth = resolutionDate.getMonth() + 1;
      const resolutionYear = resolutionDate.getFullYear();

      const isWithinRange =
        (resolutionYear > startYear || (resolutionYear === startYear && resolutionMonth >= startMonth)) &&
        (resolutionYear < endYear || (resolutionYear === endYear && resolutionMonth <= endMonth));

      return status === "Completed" && (grievanceType === "Grievance" || grievanceType === "Compliant") && isWithinRange;
    });

    const totalGRV = this.grievanceData.length
    const comGRV = comData.length
    const openGRV = Number(openData.length)
    const inproGRV = Number(inPrData.length)
    const totalRating = this.grievanceData.reduce((acc, cur) => acc + Number(cur.attributes.rating), 0);
    const tatalCompRating = comData.reduce((acc, cur) => acc + Number(cur.attributes.rating), 0);
    const rating = totalGRV > 0 ? (tatalCompRating / comGRV).toFixed(2) : 0;
    const tat = tatData.length
    const totatTime = tatData.reduce((acc, cur) => acc + Number(cur.attributes.tat_days), 0)
    const tatTime = tat > 0 ? (totatTime / tat).toFixed(2) : 0;
    const prevTotalGRV = this.prevGrievanceData.length
    const prevComGRV = prevComData.length
    const prevOpenGRV = Number(prevOpenData.length)
    const prevInProGRV = Number(prevInPrData.length)
    const prevtoRating = this.prevGrievanceData.reduce((acc, cur) => acc + Number(cur.attributes.rating), 0);
    const prevRating = prevTotalGRV > 0 ? (prevtoRating / prevTotalGRV).toFixed(2) : 0;
    const prevtat = tatData.length
    const prevtotatTime = prevtatData.reduce((acc, cur) => acc + Number(cur.attributes.tat_days), 0)
    const prevtatTime = prevtat > 0 ? (prevtotatTime / prevtat).toFixed(2) : 0;

    // Reported
    if (totalGRV == 0) {
      totAttrition = '0%'
      totAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (totalGRV > prevTotalGRV) {
        const attrition = Number(prevTotalGRV) / Number(totalGRV) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        totAttrition = value.replace(/['"]+/g, '')
        totAttrition_icon = 'icon-arrow-up'
        totAttrition_bg = 'widget-stats-indicator-positive'
      } else if (totalGRV < prevTotalGRV) {
        const attrition = Number(totalGRV) / Number(prevTotalGRV) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        totAttrition = value.replace(/['"]+/g, '')
        totAttrition_icon = 'icon-arrow-down'
        totAttrition_bg = 'widget-stats-indicator-negative'
      } else if (totalGRV == prevTotalGRV) {
        totAttrition = '0%'
        totAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    // Open Grievance
    if (openGRV == 0) {
      openAttrition = '0%'
      openAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (openGRV > prevOpenGRV) {
        const attrition = Number(prevOpenGRV) / Number(openGRV) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        openAttrition = value.replace(/['"]+/g, '')
        openAttrition_icon = 'icon-arrow-up'
        openAttrition_bg = 'widget-stats-indicator-positive'
      } else if (openGRV < prevOpenGRV) {
        const attrition = Number(openGRV) / Number(prevOpenGRV) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        openAttrition = value.replace(/['"]+/g, '')
        openAttrition_icon = 'icon-arrow-down'
        openAttrition_bg = 'widget-stats-indicator-negative'
      } else if (openGRV == prevOpenGRV) {
        openAttrition = '0%'
        openAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    // In-Progress Grievance
    if (inproGRV == 0) {
      inproAttrition = '0%'
      inproAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (inproGRV > prevInProGRV) {
        const attrition = Number(prevInProGRV) / Number(inproGRV) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        inproAttrition = value.replace(/['"]+/g, '')
        inproAttrition_icon = 'icon-arrow-up'
        inproAttrition_bg = 'widget-stats-indicator-positive'
      } else if (inproGRV < prevInProGRV) {
        const attrition = Number(inproGRV) / Number(prevInProGRV) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        inproAttrition = value.replace(/['"]+/g, '')
        inproAttrition_icon = 'icon-arrow-down'
        inproAttrition_bg = 'widget-stats-indicator-negative'
      } else if (inproGRV == prevInProGRV) {
        inproAttrition = '0%'
        inproAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    // Completed Grievance
    if (comGRV == 0) {
      comAttrition = '0%'
      comAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (comGRV > prevComGRV) {
        const attrition = Number(prevComGRV) / Number(comGRV) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        comAttrition = value.replace(/['"]+/g, '')
        comAttrition_icon = 'icon-arrow-up'
        comAttrition_bg = 'widget-stats-indicator-positive'
      } else if (comGRV < prevComGRV) {
        const attrition = Number(comGRV) / Number(prevComGRV) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        comAttrition = value.replace(/['"]+/g, '')
        comAttrition_icon = 'icon-arrow-down'
        comAttrition_bg = 'widget-stats-indicator-negative'
      } else if (comGRV == prevComGRV) {
        comAttrition = '0%'
        comAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    // Employee Feedback

    if (rating == 0) {
      ratAttrition = '0%'
      ratAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (rating > prevRating) {
        const attrition = Number(prevRating) / Number(rating) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        ratAttrition = value.replace(/['"]+/g, '')
        ratAttrition_icon = 'icon-arrow-up'
        ratAttrition_bg = 'widget-stats-indicator-positive'
      } else if (rating < prevRating) {
        const attrition = Number(rating) / Number(prevRating) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        ratAttrition = value.replace(/['"]+/g, '')
        ratAttrition_icon = 'icon-arrow-down'
        ratAttrition_bg = 'widget-stats-indicator-negative'
      } else if (rating == prevRating) {
        ratAttrition = '0%'
        ratAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    // Tat Time
    if (tatTime == 0) {
      tatAttrition = '0%'
      tatAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (tatTime > prevtatTime) {
        const attrition = Number(prevtatTime) / Number(tatTime) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        tatAttrition = value.replace(/['"]+/g, '')
        tatAttrition_icon = 'icon-arrow-up'
        tatAttrition_bg = 'widget-stats-indicator-positive'
      } else if (tatTime < prevtatTime) {
        const attrition = Number(tatTime) / Number(prevtatTime) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        tatAttrition = value.replace(/['"]+/g, '')
        tatAttrition_icon = 'icon-arrow-down'
        tatAttrition_bg = 'widget-stats-indicator-negative'
      } else if (tatTime == prevtatTime) {
        tatAttrition = '0%'
        tatAttrition_bg = 'widget-stats-indicator-positive'
      }
    }
    this.summaryCardData.push(
      {
        "title": "Reported",
        "icon": "icon-list",
        "value": totalGRV,
        "attrition": totAttrition,
        "attri_icon": totAttrition_icon,
        "attri_bg": totAttrition_bg

      },
      {
        "title": "Open",
        "icon": "icon-more-horizontal",
        "value": openGRV,
        "attrition": openAttrition,
        "attri_icon": openAttrition_icon,
        "attri_bg": openAttrition_bg

      },
      {
        "title": "In-Progress",
        "icon": "icon-chevrons-right",
        "value": inproGRV,
        "attrition": inproAttrition,
        "attri_icon": inproAttrition_icon,
        "attri_bg": inproAttrition_bg

      },
      {
        "title": "Completed",
        "icon": "icon-check-circle",
        "value": comGRV,
        "attrition": comAttrition,
        "attri_icon": comAttrition_icon,
        "attri_bg": comAttrition_bg

      },
      {
        "title": "Employee Feedback",
        "icon": "icon-bar-chart-2",
        "value": rating,
        "attrition": ratAttrition,
        "attri_icon": ratAttrition_icon,
        "attri_bg": ratAttrition_bg
      },
      {
        "title": "Tat Time",
        "icon": "icon-clock",
        "value": tatTime,
        "attrition": tatAttrition,
        "attri_icon": tatAttrition_icon,
        "attri_bg": tatAttrition_bg
      }
    )
  }

  grievance_type_Card() {
    let grvData: any[] = []
    let ComplaintData: any[] = []
    let Appreciationdata: any[] = []
    let SuggestionData: any[] = []
    let QuestionData: any[] = []

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    months.forEach(elem => {
      const data = this.grievanceData.filter(function (data) {
        return (data.attributes.month === elem)
      })

      //grievance data
      const grievanceData = data.filter(function (data) {
        return (data.attributes.type === "Grievance")
      })
      const grvQuantity = grievanceData.length
      grvData.push(grvQuantity)

      //Complaint data
      const Complaint = data.filter(function (data) {
        return (data.attributes.type === "Complaint")
      })
      const ComplaintQuantity = Complaint.length
      ComplaintData.push(ComplaintQuantity)

      //Appreciation data
      const Appreciation = data.filter(function (data) {
        return (data.attributes.type === "Appreciation")
      })
      const AppreciationQuantity = Appreciation.length
      Appreciationdata.push(AppreciationQuantity)

      //Suggestion data
      const Suggestion = data.filter(function (data) {
        return (data.attributes.type === "Suggestion")
      })
      const SuggestionQuantity = Suggestion.length
      SuggestionData.push(SuggestionQuantity)

      //Question data
      const Question = data.filter(function (data) {
        return (data.attributes.type === "Question")
      })
      const QuestionQuantity = Question.length
      QuestionData.push(QuestionQuantity)
    })

    this.grvTypeChart.series = [
      {
        name: 'Grievance',
        data: grvData
      }, {
        name: 'Complaint',
        data: ComplaintData
      }, {
        name: 'Appreciation',
        data: Appreciationdata
      }, {
        name: 'Suggestion',
        data: SuggestionData
      }, {
        name: 'Question',
        data: QuestionData
      }
    ]
  }

  grvTypeBreakdown() {
    const total = this.grievanceData.length
    const grvData = this.grievanceData.filter(data => data.attributes.type === 'Grievance');
    const comData = this.grievanceData.filter(data => data.attributes.type === 'Complaint');
    const appreData = this.grievanceData.filter(data => data.attributes.type === 'Appreciation');
    const sugData = this.grievanceData.filter(data => data.attributes.type === 'Suggestion');
    const queData = this.grievanceData.filter(data => data.attributes.type === 'Question');
    this.grvTotal = grvData.length
    this.complaintTotal = comData.length
    this.appreciationTotal = appreData.length
    this.suggestionTotal = sugData.length
    this.questionTotal = queData.length

    const grvPercentage = Math.round((this.grvTotal / total) * 100)
    const comPercentage = Math.round((this.complaintTotal / total) * 100)
    const apprePercentage = Math.round((this.appreciationTotal / total) * 100)
    const sugPercentage = Math.round((this.suggestionTotal / total) * 100)
    const quePercentage = Math.round((this.questionTotal / total) * 100)

    this.grvBreakdownChart.series = [Number(grvPercentage), Number(comPercentage), Number(apprePercentage), Number(sugPercentage), Number(quePercentage)];
    this.grvBreakdownChart.labels = ["Grievance", "Complaint", "Appreciation", "Suggestion", "Question"];
  }

  grvCategoryBreakdown() {

    const totalGrv = this.grievanceData.length

    const grievanceCategory: Record<string, any[]> = {};

    this.grievanceData.forEach(data => {
      const category = data.attributes.category;

      if (!grievanceCategory[category]) {
        grievanceCategory[category] = [];
      }
      grievanceCategory[category].push(data);
    });

    const categoryPercentages: number[] = [];
    const categories: string[] = [];
    const counts: number[] = [];

    for (const category in grievanceCategory) {
      const categoryValueSum = grievanceCategory[category].length
      const categoryPercentage = (categoryValueSum / totalGrv) * 100;
      categoryPercentages.push(Math.floor(categoryPercentage));
      categories.push(category);
      counts.push(Math.floor(categoryValueSum));
    }

    this.grvCategoryNames = categories;
    this.grvCategoryCounts = counts;
    this.grvCategoryChart.series = categoryPercentages;
    this.grvCategoryChart.labels = categories;
  }

  grv_topic_Card() {
    const groupedTopics: Record<string, any[]> = {};

    this.grievanceData.forEach(data => {
      const div = data.attributes.topic;
      if (div !== null) {
        if (!groupedTopics[div]) {
          groupedTopics[div] = [];
        }
        groupedTopics[div].push(data);
      }
    });

    const topics: string[] = [];
    const counts: number[] = [];
    let topic_count: any[] = []
    for (const topic in groupedTopics) {
      const topicCount = groupedTopics[topic].length;
      topics.push(topic);
      counts.push(topicCount);

    }
    topic_count.push({
      name: 'Number of Topics',
      data: counts
    })
    topicChart.xaxis = { categories: topics }
    topicChart.series = topic_count

  }

  grv_channel_Card() {
    const totalGrv = this.grievanceData.length

    const grievanceChannel: Record<string, any[]> = {};

    this.grievanceData.forEach(data => {
      const channel = data.attributes.channel;

      if (!grievanceChannel[channel]) {
        grievanceChannel[channel] = [];
      }
      grievanceChannel[channel].push(data);
    });

    const channelPercentages: number[] = [];
    const channels: string[] = [];
    const counts: number[] = [];

    for (const channel in grievanceChannel) {
      const channelValueSum = grievanceChannel[channel].length
      const channelPercentage = (channelValueSum / totalGrv) * 100;
      channelPercentages.push(Math.floor(channelPercentage));
      channels.push(channel);
      counts.push(Math.floor(channelValueSum));
    }

    this.grvChannelNames = channels;
    this.grvChannelCounts = counts;
    this.channelChart.series = channelPercentages;
    this.channelChart.labels = channels;
  }
  responseTime() {
    const groupedCategories: Record<string, any[]> = {};

    this.grievanceData.forEach(data => {
      const category = data.attributes.category;
      const tatDays = data.attributes.tat_days;

      if (category !== null && tatDays !== null) {
        if (!groupedCategories[category]) {
          groupedCategories[category] = [{
            x: category,
            y: tatDays,
            z: Math.floor(Math.random() * (75 - 15 + 1)) + 15,
          }];
        } else {
          groupedCategories[category].push({
            x: category,
            y: tatDays,
            z: Math.floor(Math.random() * (75 - 15 + 1)) + 15,
          });
        }
      }
    });

    const seriesData = Object.values(groupedCategories).flat();

    this.responseTimeChart.series = [
      {
        name: 'TAT Days',
        data: seriesData,
      },
    ];
  }

  grv_department_Card() {
    const groupedDepartments: Record<string, any[]> = {};

    this.grievanceData.forEach(data => {
      const div = data.attributes.department;
      if (div !== null) {
        if (!groupedDepartments[div]) {
          groupedDepartments[div] = [];
        }
        groupedDepartments[div].push(data);
      }
    });

    const departments: string[] = [];
    const counts: number[] = [];
    let department_count: any[] = []
    for (const department in groupedDepartments) {
      const departmentCount = groupedDepartments[department].length;
      departments.push(department);
      counts.push(departmentCount);

    }
    department_count.push({
      name: 'Submitted Cases',
      data: counts
    })
    departmentChart.xaxis = { categories: departments }
    departmentChart.series = department_count

  }

  grvSeverityScore_card() {

    const totalGrv = this.grievanceData.length
    const grievanceSeverityScore: Record<string, any[]> = {};

    this.grievanceData.forEach(data => {
      const severity_score = data.attributes.severity_score;
      if (severity_score !== null) {
        if (!grievanceSeverityScore[severity_score]) {
          grievanceSeverityScore[severity_score] = [];
        }
        grievanceSeverityScore[severity_score].push(data);
      }
    });

    const severity_scorePercentages: number[] = [];
    const categories: string[] = [];
    const counts: number[] = [];

    for (const severity_score in grievanceSeverityScore) {
      const severity_scoreValueSum = grievanceSeverityScore[severity_score].length
      const severity_scorePercentage = (severity_scoreValueSum / totalGrv) * 100;
      severity_scorePercentages.push(Math.floor(severity_scorePercentage));
      categories.push(severity_score);
      counts.push(Math.floor(severity_scoreValueSum));
    }

    this.grvSeverityScoreChart.series = [
      {
        name: 'Count',
        data: severity_scorePercentages,
      },
    ];
    this.grvSeverityScoreChart.labels = categories;
    this.grvSeverityScoreChart.xaxis = { categories: categories };

  }
  Rating_Card() {
    let value: any[] = [];
    this.grvRatingCard = []
    const severityLevels = ['Zero Tolerance', 'Low', 'Medium', 'High'];

    if (!this.grievanceData || this.grievanceData.length === 0) {
      return;
    }

    const totalGrv = this.grievanceData.filter(data => data.attributes.severity_score !== null).length;

    const zero = this.grievanceData.filter(data => data.attributes.severity_score === "Zero Tolerance");
    const low = this.grievanceData.filter(data => data.attributes.severity_score === "Green");
    const medium = this.grievanceData.filter(data => data.attributes.severity_score === "Yellow");
    const high = this.grievanceData.filter(data => data.attributes.severity_score === "Red");
    const zeroTolerancePercentage = (Number(zero.length) / Number(totalGrv) * 100).toFixed(0);
    const lowPercentage = (Number(low.length) / Number(totalGrv) * 100).toFixed(0);
    const mediumPercentage = (Number(medium.length) / Number(totalGrv) * 100).toFixed(0);
    const highPercentage = (Number(high.length) / Number(totalGrv) * 100).toFixed(0);

    // Update chart data
    value.push(Number(zeroTolerancePercentage) > 0 ? zeroTolerancePercentage : 0);
    value.push(Number(lowPercentage) > 0 ? lowPercentage : 0);
    value.push(Number(mediumPercentage) > 0 ? mediumPercentage : 0);
    value.push(Number(highPercentage) > 0 ? highPercentage : 0);

    // Update the chart object with new values and labels
    this.grvRatingCard.push(
      { "title": "Zero Tolerance", "count": zero.length },
      { "title": "Low", "count": low.length },
      { "title": "Medium", "count": medium.length },
      { "title": "High", "count": high.length }
    );
    this.RatingChart.series = value;
    this.RatingChart.labels = severityLevels;
  }


  anonymousCard() {

    const total = this.grievanceData.length
    const anonymous = this.grievanceData.filter(function (data) {
      return (data.attributes.anonymous === true)
    })

    this.anonymous = anonymous.length
    const nonAnonymous = this.grievanceData.filter(function (data) {
      return (data.attributes.anonymous === false)
    })

    this.nonAnonymous = nonAnonymous.length

    let anonymousPercentage = '0'
    let nonAnonymousPercentage = '0'
    if (total > 0) {
      anonymousPercentage = Math.round(Number(this.anonymous) / Number(total) * 100).toFixed(0)
      nonAnonymousPercentage = Math.round(Number(this.nonAnonymous) / Number(total) * 100).toFixed(0)
      this.anonymousChart.series = [Number(anonymousPercentage), Number(nonAnonymousPercentage)]

    } else {
      this.anonymousChart.series = [0, 0]
    }
  }

  closure_rate_card() {

    this.closureRateData = []

    let Attrition = ''
    let AttritionIcon = ''
    const total = this.grievanceData.length

    //current data
    const comData = this.grievanceData.filter(function (elem) {
      return (elem.attributes.status == "Completed")
    })

    //previous data
    const prevComData = this.grievanceData.filter(function (elem) {
      return (elem.attributes.status == "Completed")
    })

    const completed = comData.length
    const prevCompleted = prevComData.length
    const comPercentage = Number(Number(completed) / Number(total) * 100).toFixed(0)

    //attrition
    if (completed == 0) {
      Attrition = '0%'
    } else {
      if (completed > prevCompleted) {
        const attrition = Number(prevCompleted) / Number(completed) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        Attrition = value.replace(/['"]+/g, '')
        AttritionIcon = "icon-arrow-up"
      } else if (completed < prevCompleted) {
        const attrition = Number(completed) / Number(prevCompleted) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        Attrition = value.replace(/['"]+/g, '')
        AttritionIcon = "icon-arrow-down"
      } else if (completed == prevCompleted) {
        Attrition = '0%'
      }
    }

    if (Number(comPercentage) > 0) {
      this.closureRateData.push(
        {
          'completed': completed,
          'comPercentage': Number(comPercentage),
          'attrition': Attrition,
          'prevMonthCom': prevCompleted,
          'attritionIcon': AttritionIcon
        }
      )

    } else {
      this.closureRateData.push(
        {
          'completed': completed,
          'comPercentage': 0,
          'attrition': '0',
          'prevMonthCom': prevCompleted,
          'attritionIcon': AttritionIcon


        }
      )
    }
  }

  grievance_status_Card() {
    let TotalData: any[] = []
    let OpenData: any[] = []
    let InProgressData: any[] = []
    let CompletedData: any[] = []
    let Total: any
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    months.forEach(elem => {
      const data = this.grievanceData.filter(function (data) {
        return (data.attributes.month === elem)
      })
      Total = data.length
      TotalData.push(Total)
      //Open data
      const open = data.filter(function (data) {
        return (data.attributes.status === "Open")
      })
      const openQuantity = open.length
      OpenData.push(openQuantity)

      //In-progress data
      const InProgress = data.filter(function (data) {
        return (data.attributes.status === "In-Progress")
      })
      const InProgressQuantity = InProgress.length
      InProgressData.push(InProgressQuantity)

      //Completed data
      const Completed = data.filter(function (data) {
        return (data.attributes.status === "Completed")
      })
      const CompletedQuantity = Completed.length
      CompletedData.push(CompletedQuantity)
    })

    this.grvStatusChart.series = [
      {
        name: 'Total',
        data: TotalData
      }, {
        name: 'Open',
        data: OpenData
      }, {
        name: 'In-Progress',
        data: InProgressData
      }, {
        name: 'Completed',
        data: CompletedData
      }
    ]
  }

}
