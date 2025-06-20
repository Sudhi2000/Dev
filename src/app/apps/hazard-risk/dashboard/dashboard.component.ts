import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ChartType, comLevelChart, divisionChart, hazardMonthlyChart, riskChart, statusChart, TatChart, totalLevelChart, unsafeActConditionChart } from './chart-model';
import { GeneralService } from 'src/app/services/general.api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
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

  dropDownValue: any[] = []
  categories: any[] = []
  periodValues: any[] = []
  periods: any[] = []
  ehsData: any[] = []
  prevEhsData: any[] = []
  dashboardData: any[] = []
  divisionChart: ChartType
  statusCardData: any[] = []
  statusChart: ChartType
  riskLevelCardData: any[] = []
  totalLevelChart: ChartType
  comLevelChart: ChartType
  tatStatusCard: any[] = []
  TatChart: ChartType
  risk_category_card: any[] = []
  risk_control_card: any[] = []
  transactionData: any[] = []

  unsafeActConditionChart: ChartType
  unsafeAct: any
  unsafeCondition: any
  hazardMonthlyChart: ChartType
  unitSpecific: any
  userDivision: any
  corporateUser: any

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private hazardService: HazardService) { }


  ngOnInit(): void {
    this.divisionChart = divisionChart
    this.statusChart = statusChart
    this.totalLevelChart = totalLevelChart
    this.comLevelChart = comLevelChart
    this.TatChart = TatChart
    this.unsafeActConditionChart = unsafeActConditionChart
    this.hazardMonthlyChart = hazardMonthlyChart

    this.imageURL = environment.client_backend + '/uploads/'
    this.configuration()
    this.filterForm = this.formBuilder.group({
      startDate: [''],
      endDate: [''],
      division: [''],
      category: [''],
      period: [''],
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
        const status = result.data.attributes.modules.hazard_risk
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          Swal.close()
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
        const status = result.ehs_dashboard
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
    this.filterForm.controls['startDate'].setValue(new Date(new Date(event.value).setHours(0, 0, 0)).toISOString())
  }

  endDateChange(event: any) {
    this.filterForm.controls['endDate'].setValue(new Date(new Date(event.value).setHours(0, 0, 0)).toISOString())
  }

  onPeriodChange(event: any) {
    const selectedPeriod = event.value;
    if (selectedPeriod === 'This Week') {
      const currentDate = new Date();
      const startOfWeek = currentDate.getDate() - currentDate.getDay();
      const startDate = new Date(currentDate.setDate(startOfWeek));
      const endDate = new Date(currentDate.setDate(startOfWeek + 6));
      this.filterForm.controls['startDate'].setValue(startDate.toISOString());
      this.filterForm.controls['endDate'].setValue(endDate.toISOString());
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
      this.dateRange.controls.start.disable();
      this.dateRange.controls.end.disable();
    }
    else {
      this.dateRange.controls.start.enable();
      this.dateRange.controls.end.enable();
    }
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

  get_dropdown_values() {
    const module = "Hazard and Risk"
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
    //get current month data
    // const start = new Date(this.filterForm.value.startDate).toISOString()
    // const end = new Date(this.filterForm.value.endDate).toISOString()
    // const prevStart = new Date(this.filterForm.value.prevStartDate).toISOString()
    // const prevEnd = new Date(this.filterForm.value.prevEndDate).toISOString()

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


    this.hazardService.generate_ehs_data(start, end,this.userDivision).subscribe({
      next: (result: any) => {
        //get previous month data
        this.hazardService.generate_ehs_data(prevStart, prevEnd,this.userDivision).subscribe({
          next: (preResult: any) => {
            this.ehsData = result.data
            this.prevEhsData = preResult.data
          },
          error: (err: any) => { },
          complete: () => {
            this.summary_card()
            this.division_card()
            this.status_card()
            this.risk_level()
            this.tat_status()
            this.risk_category()
            this.risk_controls()
            this.transaction()
            this.unsafeCard()
            this.monthly_card()

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
    this.riskLevelCardData = []
    this.tatStatusCard = []
    this.risk_category_card = []
    this.risk_control_card = []
    this.transactionData = []
    this.dateRange.controls.start.enable();
    this.dateRange.controls.end.enable();
    this.ngOnInit()
  }

  search() {
    if (this.filterForm.value.division && !this.filterForm.value.category) {
      this.showProgressPopup()
      this.division_date()
    } else if (!this.filterForm.value.division && this.filterForm.value.category) {
      this.showProgressPopup()
      this.category_date()
    } else if (this.filterForm.value.division && this.filterForm.value.category) {
      this.showProgressPopup()
      this.division_category_date()
    } else if (!this.filterForm.value.division && !this.filterForm.value.category) {
      this.summaryCardData = []
      this.riskLevelCardData = []
      this.tatStatusCard = []
      this.risk_category_card = []
      this.risk_control_card = []
      this.transactionData = []
      this.statusCardData = []

      this.showProgressPopup()
      this.default_data()

    }
  }

  division_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const division = this.filterForm.value.division
    this.hazardService.generate_ehs_data_division(start, end, division).subscribe({
      next: (result: any) => {
        this.ehsData = result.data
        this.summaryCardData = []
        this.riskLevelCardData = []
        this.tatStatusCard = []
        this.risk_category_card = []
        this.risk_control_card = []
        this.transactionData = []
        this.statusCardData = []



        this.summary_card()
        this.division_card()
        this.status_card()
        this.risk_level()
        this.tat_status()
        this.risk_category()
        this.risk_controls()
        this.transaction()
        this.unsafeCard()
        this.monthly_card()
      },
      error: (err: any) => { },
      complete: () => {

        Swal.close()

      }
    })


  }

  category_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const category = this.filterForm.value.category
    this.hazardService.generate_ehs_data_category(start, end, category,this.userDivision).subscribe({
      next: (result: any) => {
        this.ehsData = result.data
        this.summaryCardData = []
        this.riskLevelCardData = []
        this.tatStatusCard = []
        this.risk_category_card = []
        this.risk_control_card = []
        this.transactionData = []
        this.statusCardData = []




        this.summary_card()
        this.division_card()
        this.status_card()
        this.risk_level()
        this.tat_status()
        this.risk_category()
        this.risk_controls()
        this.transaction()
        this.unsafeCard()
        this.monthly_card()
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

    this.hazardService.generate_ehs_data_division_category(start, end, division, category).subscribe({
      next: (result: any) => {
        this.ehsData = result.data
        this.summaryCardData = []
        this.riskLevelCardData = []
        this.tatStatusCard = []
        this.risk_category_card = []
        this.risk_control_card = []
        this.transactionData = []
        this.statusCardData = []


        this.summary_card()
        this.division_card()
        this.risk_level()
        this.tat_status()
        this.risk_category()
        this.risk_controls()
        this.transaction()
        this.status_card()
        this.unsafeCard()
        this.monthly_card()
      },
      error: (err: any) => { },
      complete: () => {
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

    let penAttrition = ''
    let penAttrition_icon = ''
    let penAttrition_bg = ''

    let amtAttrition = ''
    let amtAttrition_icon = ''
    let amtAttrition_bg = ''

    const comData = this.ehsData.filter(function (elem) {
      return (elem.attributes.status == "Completed")
    })
    const openData = this.ehsData.filter(function (elem) {
      return (elem.attributes.status == "Open")
    })
    const inPrData = this.ehsData.filter(function (elem) {
      return (elem.attributes.status == "In-Progress")
    })

    const verifyPrData = this.ehsData.filter(function (elem) {
      return (elem.attributes.status == "Verify")
    })


    //previous data
    const prevComData = this.prevEhsData.filter(function (elem) {
      return (elem.attributes.status == "Completed")
    })
    const prevOpenData = this.prevEhsData.filter(function (elem) {
      return (elem.attributes.status == "Open")
    })
    const prevInPrData = this.prevEhsData.filter(function (elem) {
      return (elem.attributes.status == "In-Progress")
    })

    const prevVerifyPrData = this.prevEhsData.filter(function (elem) {
      return (elem.attributes.status == "Verify")
    })

    const totalHRM = this.ehsData.length
    const comHRM = comData.length
    const pendHRM = Number(openData.length) + Number(inPrData.length) + Number(verifyPrData.length)
    const amount = this.ehsData.reduce((acc, cur) => acc + Number(cur.attributes.cost), 0)
    const prevTotalHRM = this.prevEhsData.length
    const prevComHRM = prevComData.length
    const prevPendHRM = Number(prevOpenData.length) + Number(prevInPrData.length) + Number(prevVerifyPrData.length)
    const prevAmount = this.prevEhsData.reduce((acc, cur) => acc + Number(cur.attributes.cost), 0)

    //     //total attrition
    if (totalHRM == 0) {
      totAttrition = '0%'
      totAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (totalHRM > prevTotalHRM) {
        const attrition = Number(prevTotalHRM) / Number(totalHRM) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        totAttrition = value.replace(/['"]+/g, '')
        totAttrition_icon = 'icon-arrow-up'
        totAttrition_bg = 'widget-stats-indicator-positive'
      } else if (totalHRM < prevTotalHRM) {
        const attrition = Number(totalHRM) / Number(prevTotalHRM) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        totAttrition = value.replace(/['"]+/g, '')
        totAttrition_icon = 'icon-arrow-down'
        totAttrition_bg = 'widget-stats-indicator-negative'
      } else if (totalHRM == prevTotalHRM) {
        totAttrition = '0%'
        totAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    //completed attrition
    if (comHRM == 0) {
      comAttrition = '0%'
      comAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (comHRM > prevComHRM) {
        const attrition = Number(prevComHRM) / Number(comHRM) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        comAttrition = value.replace(/['"]+/g, '')
        comAttrition_icon = 'icon-arrow-up'
        comAttrition_bg = 'widget-stats-indicator-positive'
      } else if (comHRM < prevComHRM) {
        const attrition = Number(comHRM) / Number(prevComHRM) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        comAttrition = value.replace(/['"]+/g, '')
        comAttrition_icon = 'icon-arrow-down'
        comAttrition_bg = 'widget-stats-indicator-negative'
      } else if (comHRM == prevComHRM) {
        comAttrition = '0%'
        comAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    //pending attrition
    if (pendHRM == 0) {
      penAttrition = '0%'
      penAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (pendHRM > prevPendHRM) {
        const attrition = Number(prevPendHRM) / Number(pendHRM) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        penAttrition = value.replace(/['"]+/g, '')
        penAttrition_icon = 'icon-arrow-up'
        penAttrition_bg = 'widget-stats-indicator-positive'
      } else if (pendHRM < prevPendHRM) {
        const attrition = Number(pendHRM) / Number(prevPendHRM) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        penAttrition = value.replace(/['"]+/g, '')
        penAttrition_icon = 'icon-arrow-down'
        penAttrition_bg = 'widget-stats-indicator-negative'
      } else if (pendHRM == prevPendHRM) {
        penAttrition = '0%'
        penAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    //amount attrition
    if (amount == 0) {
      amtAttrition = '0%'
      amtAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (amount > prevAmount) {
        const attrition = Number(prevAmount) / Number(amount) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        amtAttrition = value.replace(/['"]+/g, '')
        amtAttrition_icon = 'icon-arrow-up'
        amtAttrition_bg = 'widget-stats-indicator-positive'
      } else if (amount < prevAmount) {
        const attrition = Number(amount) / Number(prevAmount) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        amtAttrition = value.replace(/['"]+/g, '')
        amtAttrition_icon = 'icon-arrow-down'
        amtAttrition_bg = 'widget-stats-indicator-negative'
      } else if (amount == prevAmount) {
        amtAttrition = '0%'
        amtAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    this.summaryCardData.push(
      {
        "title": "Total",
        "icon": "icon-list",
        "value": totalHRM,
        "attrition": totAttrition,
        "attri_icon": totAttrition_icon,
        "attri_bg": totAttrition_bg

      },
      {
        "title": "Completed",
        "icon": "icon-check-circle",
        "value": comHRM,
        "attrition": comAttrition,
        "attri_icon": comAttrition_icon,
        "attri_bg": comAttrition_bg

      },
      {
        "title": "Pending",
        "icon": "icon-more-horizontal",
        "value": pendHRM,
        "attrition": penAttrition,
        "attri_icon": penAttrition_icon,
        "attri_bg": penAttrition_bg

      },
      {
        "title": "Amount",
        "icon": "icon-credit-card",
        "value": amount,
        "attrition": amtAttrition,
        "attri_icon": amtAttrition_icon,
        "attri_bg": amtAttrition_bg
      }
    )



  }

  division_card() {
    let diviName: any[] = [];
    let divisionName: any[] = [];
  
    // Filter data based on this.divisions
    this.ehsData.forEach(elem => {
      if (this.divisions.some(division => division.division_name === elem.attributes.division)) {
        diviName.push(elem.attributes.division);
      }
    });
  
    var duplicateValue = new Set(diviName);
    diviName = [...duplicateValue];
    divisionName = diviName;
    let division: any[] = [];
    let highValue: any[] = [];
    let mediumValue: any[] = [];
    let lowValue: any[] = [];
  
    divisionName.forEach(elem => {
      division.push(elem);
  
      const high = this.ehsData.filter(function (data) {
        return data.attributes.division == elem && data.attributes.level === "High";
      });
      highValue.push(Number(high.length));
  
      const medium = this.ehsData.filter(function (data) {
        return data.attributes.division == elem && data.attributes.level === "Medium";
      });
      mediumValue.push(Number(medium.length));
  
      const low = this.ehsData.filter(function (data) {
        return data.attributes.division == elem && data.attributes.level === "Low";
      });
      lowValue.push(Number(low.length));
    });
  
    this.divisionChart = {
      series: [
        {
          name: "High",
          data: highValue,
        },
        {
          name: "Medium",
          data: mediumValue,
        },
        {
          name: "Low",
          data: lowValue,
        },
      ],
      colors: ['#FF1744', '#CCCC00', '#34c38f'],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: division,
      },
      yaxis: {
        title: {
          text: "$ (thousands)",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val;
          },
        },
      },
    };
  }
  

  status_card() {
    this.statusCardData = []

    let Attrition = ''
    let AttritionIcon = ''
    const total = this.ehsData.length

    //current data
    const comData = this.ehsData.filter(function (elem) {
      return (elem.attributes.status == "Completed")
    })

    //previous data
    const prevComData = this.prevEhsData.filter(function (elem) {
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
      this.statusCardData.push(
        {
          'completed': completed,
          'comPercentage': Number(comPercentage),
          'attrition': Attrition,
          'prevMonthCom': prevCompleted,
          'attritionIcon': AttritionIcon
        }
      )

    } else {
      this.statusCardData.push(
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

  risk_level() {
    this.riskLevelCardData = []
    const total = this.ehsData.length

    //high level
    let Attrition = ''
    let AttritionIcon = ''
    let highComperncetage = ''
    let highTotperncetage = ''
    const data = this.ehsData.filter(function (elem) {
      return (elem.attributes.level == "High")
    })
    const totHighPerc = Number(Number(data.length) / Number(total) * 100).toFixed(0)
    if (Number(totHighPerc) > 0) {
      highTotperncetage = totHighPerc
    } else {
      highTotperncetage = '0'
    }
    const comdData = this.ehsData.filter(function (elem) {
      return (elem.attributes.level === "High" && elem.attributes.resolution === "Completed")
    })
    const comHighPerc = Number(Number(comdData.length) / Number(data.length) * 100).toFixed(0)
    if (Number(comHighPerc) > 0) {
      highComperncetage = comHighPerc
    } else {
      highComperncetage = '0'
    }
    const prevData = this.prevEhsData.filter(function (elem) {
      return (elem.attributes.level == "High")
    })
    const highLevel = data.length
    const highPrev = prevData.length
    if (highLevel == 0) {
      Attrition = '0%'
    } else {
      if (highLevel > highPrev) {
        const attrition = Number(highPrev) / Number(highLevel) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        Attrition = value.replace(/['"]+/g, '')
        AttritionIcon = "icon-arrow-up"
      } else if (highLevel < highPrev) {
        const attrition = Number(highLevel) / Number(highPrev) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        Attrition = value.replace(/['"]+/g, '')
        AttritionIcon = "icon-arrow-down"
      } else if (highLevel == highPrev) {
        Attrition = '0%'
      }
    }

    //medium level
    let mediumAttrition = ''
    let mediumAttritionIcon = ''
    let mediumComperncetage = ''
    let mediumTotperncetage = ''
    const mediumData = this.ehsData.filter(function (elem) {
      return (elem.attributes.level == "Medium")
    })
    const mediumTotHighPerc = Number(Number(mediumData.length) / Number(total) * 100).toFixed(0)
    if (Number(mediumTotHighPerc) > 0) {
      mediumTotperncetage = mediumTotHighPerc
    } else {
      mediumTotperncetage = '0'
    }
    const mediumComdData = this.ehsData.filter(function (elem) {
      return (elem.attributes.level === "Medium" && elem.attributes.resolution === "Completed")
    })
    const mediumComHighPerc = Number(Number(mediumComdData.length) / Number(mediumData.length) * 100).toFixed(0)
    if (Number(mediumComHighPerc) > 0) {
      mediumComperncetage = mediumComHighPerc
    } else {
      mediumComperncetage = '0'
    }
    const mediumPrevData = this.prevEhsData.filter(function (elem) {
      return (elem.attributes.level == "Medium")
    })
    const mediumLevel = mediumData.length
    const mediumPrev = mediumPrevData.length
    if (mediumLevel == 0) {
      mediumAttrition = '0%'
    } else {
      if (mediumLevel > mediumPrev) {
        const attrition = Number(mediumPrev) / Number(mediumLevel) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        mediumAttrition = value.replace(/['"]+/g, '')
        mediumAttritionIcon = "icon-arrow-up"
      } else if (mediumLevel < mediumPrev) {
        const attrition = Number(mediumLevel) / Number(mediumPrev) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        mediumAttrition = value.replace(/['"]+/g, '')
        mediumAttritionIcon = "icon-arrow-down"
      } else if (mediumLevel == mediumPrev) {
        mediumAttrition = '0%'
      }
    }

    //low level
    let lowAttrition = ''
    let lowAttritionIcon = ''
    let lowComperncetage = ''
    let lowTotperncetage = ''
    const lowData = this.ehsData.filter(function (elem) {
      return (elem.attributes.level == "Low")
    })
    const lowTotHighPerc = Number(Number(lowData.length) / Number(total) * 100).toFixed(0)
    if (Number(lowTotHighPerc) > 0) {
      lowTotperncetage = lowTotHighPerc
    } else {
      lowTotperncetage = '0'
    }
    const lowComdData = this.ehsData.filter(function (elem) {
      return (elem.attributes.level === "Low" && elem.attributes.resolution === "Completed")
    })
    const lowComHighPerc = Number(Number(lowComdData.length) / Number(lowData.length) * 100).toFixed(0)
    if (Number(lowComHighPerc) > 0) {
      lowComperncetage = lowComHighPerc
    } else {
      lowComperncetage = '0'
    }
    const lowPrevData = this.prevEhsData.filter(function (elem) {
      return (elem.attributes.level == "Low")
    })
    const lowLevel = lowData.length
    const lowPrev = lowPrevData.length
    if (lowLevel == 0) {
      lowAttrition = '0%'
    } else {
      if (lowLevel > lowPrev) {
        const attrition = Number(lowPrev) / Number(lowLevel) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        lowAttrition = value.replace(/['"]+/g, '')
        lowAttritionIcon = "icon-arrow-up"
      } else if (lowLevel < lowPrev) {
        const attrition = Number(lowLevel) / Number(lowPrev) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        lowAttrition = value.replace(/['"]+/g, '')
        lowAttritionIcon = "icon-arrow-down"

      } else if (lowLevel == lowPrev) {
        lowAttrition = '0%'
      }
    }

    this.riskLevelCardData.push(
      {
        'title': "High Level Cases",
        'total': Number(highLevel),
        'attrition': Attrition,
        'attritionIcon': AttritionIcon,
        'currTotal': Number(highTotperncetage),
        'currComp': Number(highComperncetage),
        'colors': "#FF1644",
        'label': "Reported cases",
        'label2': "Closed cases",
      },
      {
        'title': "Medium Level Cases",
        'total': Number(mediumLevel),
        'attrition': mediumAttrition,
        'attritionIcon': mediumAttritionIcon,
        'currTotal': Number(mediumTotperncetage),
        'currComp': Number(mediumComperncetage),
        'colors': "#CCCC01",
        'label': "Reported cases",
        'label2': "Closed cases",
      },
      {
        'title': "Low Level Cases",
        'total': Number(lowLevel),
        'attrition': lowAttrition,
        'attritionIcon': lowAttritionIcon,
        'currTotal': Number(lowTotperncetage),
        'currComp': Number(lowComperncetage),
        'colors': "#39539e",
        'label': "Reported cases",
        'label2': "Closed cases",
      }
    )


  }

  unsafeCard() {
    const total = this.ehsData.length
    const act = this.ehsData.filter(function (data) {
      return (data.attributes.unsafe === "Unsafe Act")
    })

    this.unsafeAct = act.length
    const condition = this.ehsData.filter(function (data) {
      return (data.attributes.unsafe === "Unsafe Condition")
    })

    this.unsafeCondition = condition.length

    let unSafeActPercentage = '0'
    let unSafeConditionPercentage = '0'
    if (total > 0) {
      unSafeActPercentage = Math.round(Number(this.unsafeAct) / Number(total) * 100).toFixed(0)
      unSafeConditionPercentage = Math.round(Number(this.unsafeCondition) / Number(total) * 100).toFixed(0)
      this.unsafeActConditionChart.series = [Number(unSafeActPercentage), Number(unSafeConditionPercentage)]

    } else {
      this.unsafeActConditionChart.series = [0, 0]
    }
  }

  tat_status() {
    this.tatStatusCard = []
    let tatStatus = ['On Time', 'Delayed', 'Pending']
    let value: any[] = []
    const total = this.ehsData.length
    const totalCom = this.ehsData.filter(function (data) {
      return (data.attributes.resolution == "Completed")
    })
    // const onTime = this.ehsData.filter(function (data) {
    //   return (data.attributes.resolution == "Completed" && data.attributes.tat_status === "On-Time")
    // })
    const onTime = this.ehsData.filter(function (data) {
      return (data.attributes.resolution == "Completed" && data.attributes.delayed === null)
    })
    const onTimePercentage = (Number(onTime.length) / Number(totalCom.length) * 100).toFixed(0)
    if (Number(onTimePercentage) > 0) {
      value.push(onTimePercentage)
    } else {
      value.push(0)
    }
    // const delayed = this.ehsData.filter(function (data) {
    //   return (data.attributes.resolution == "Completed" && data.attributes.tat_status === "Delayed")
    // })
    const delayed = this.ehsData.filter(function (data) {
      return (data.attributes.resolution == "Completed" && data.attributes.delayed === true)
    })
    const delayedPercentage = (Number(delayed.length) / Number(totalCom.length) * 100).toFixed(0)
    if (Number(delayedPercentage) > 0) {
      value.push(delayedPercentage)
    } else {
      value.push(0)
    }
    const open = this.ehsData.filter(function (data) {
      return (data.attributes.resolution == "Open")
    })
    const pending = Number(open.length)
    const pendingPercentage = (Number(pending) / Number(total) * 100).toFixed(0)




    if (Number(pendingPercentage) > 0) {
      value.push(pendingPercentage)
    } else {
      value.push(0)
    }
    this.tatStatusCard.push(

      {
        "title": "On-Time",
        "count": onTime.length
      },
      {
        "title": "Delayed",
        "count": delayed.length
      },
      {
        "title": "Pending",
        "count": pending
      }
    )

    this.TatChart = {
      series: value,
      chart: {
        height: 390,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '14px',
              offsetY: 4,
              formatter: function (val: any) {
                return val + '%'
              }
            },
            total: {
              show: false,
              label: 'Total',
              color: '#999',
              fontSize: '16px',
              fontFamily: undefined,
              fontWeight: 600,
              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                  return a + b;
                }, 0) + '%';
              }
            }
          },
          track: {
            show: true,
            startAngle: undefined,
            endAngle: undefined,
            background: '#f2f2f2',
            strokeWidth: '97%',
            opacity: 1,
            margin: 12,
            dropShadow: {
              enabled: false,
              top: 0,
              left: 0,
              blur: 3,
              opacity: 0.5
            }
          },
        }
      },
      stroke: {
        lineCap: 'round'
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E"],
      labels: ["On Time", "Delayed", "Pending"],
      legend: {
        show: true,
        floating: true,
        fontSize: "15px",
        position: "left",
        offsetX: 20,
        offsetY: 30,
        labels: {
          useSeriesColors: true
        },
        formatter: function (seriesName: any, opts: any) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + '%';
        },
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    };


  }

  risk_category() {
    this.risk_category_card = []

    let categoryName: any[] = []
    let category: any[] = []
    this.ehsData.forEach(elem => {
      categoryName.push(elem.attributes.category)
    })
    var duplicateValue = new Set(categoryName);
    categoryName = [...duplicateValue];
    category = categoryName
    const total = this.ehsData.length
    category.forEach(category => {
      const data = this.ehsData.filter(function (data) {
        return (data.attributes.category == category)
      })
      const comData = this.ehsData.filter(function (data) {
        return (data.attributes.category == category && data.attributes.resolution === "Completed")
      })
      const percentage = Number(Number(data.length) / Number(total) * 100).toFixed(0)
      this.risk_category_card.push(
        {
          'category': category,
          'count': data.length,
          'percentage': percentage,
          'completed': comData.length
        }
      )
    })
  }

  risk_controls() {
    this.risk_control_card = []
    let controlName: any[] = []
    let control: any[] = []
    const completed = this.ehsData.filter(function (data) {
      return (data.attributes.resolution == "Completed")
    })
    completed.forEach(elem => {
      controlName.push(elem.attributes.control)
    })
    var duplicateValue = new Set(controlName);
    controlName = [...duplicateValue];
    control = controlName
    control.forEach(control => {
      const data = this.ehsData.filter(function (data) {
        return (data.attributes.control == control && data.attributes.resolution === "Completed")
      })
      const percentage = Number(Number(data.length) / Number(completed.length) * 100).toFixed(0)
      this.risk_control_card.push(
        {
          'control': control,
          'count': data.length,
          'percentage': percentage
        }
      )
    })
  }
  
  transaction() {
    const division=this.filterForm.value.division
    if(!division)
    {
      this.hazardService.get_latest_hazards(this.orgID,this.userDivision).subscribe({
        next: (result: any) => { 
          const size = 5; 
          const filteredTransactions = result.data.filter((transaction: any) =>
            this.divisions.some(division => division.division_name === transaction.attributes.division)
          ); 
          const transactionData = filteredTransactions.slice(0, size); 
          this.transactionData = transactionData;
        },
        error: (err: any) => { },
        complete: () => { }
      });
    }
    else
    {
      this.hazardService.get_latest_division_hazards(this.orgID,division).subscribe({
        next: (result: any) => { 
          const size = 5; 
          const filteredTransactions = result.data.filter((transaction: any) =>
            this.divisions.some(division => division.division_name === transaction.attributes.division)
          ); 
          const transactionData = filteredTransactions.slice(0, size); 
          this.transactionData = transactionData;
        },
        error: (err: any) => { },
        complete: () => { }
      });
    }
  }
  
  statusButton(data: any) {
    const open = "btn-primary"
    const inprogress = "btn-secondary"
    const completed = "btn-success"
    const verify = "btn-info"
    const rejected = "btn-danger"
    if (data === "Open") {
      return open
    } else if (data === "In-Progress") {
      return inprogress
    } else if (data === "Completed") {
      return completed
    } else if (data === "Verify") {
      return verify
    } else if (data === "Rejected") {
      return rejected
    } else {
      return
    }
  }

  monthly_card() {

    // const allMonths = [
    //   'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    // ];

    // const closedCounts: { [month: string]: number } = {};
    // const reportedCounts: { [month: string]: number } = {}; 
    // allMonths.forEach(month => {
    //   closedCounts[month] = 0;
    //   reportedCounts[month] = 0; 
    // });

    // this.ehsData.forEach((elem) => {
    //   const hazardtDate = new Date(elem.attributes.reported_date);
    //   const month = hazardtDate.toLocaleString('en-us', { month: 'short' });

    //   if (elem.attributes.status === 'Completed') {
    //     closedCounts[month]++;
    //   }
    //   else if (elem.attributes.status === 'Open') {
    //     reportedCounts[month]++;
    //   } 
    // });

    // const months = allMonths;
    // const completed = Object.values(closedCounts);
    // const scheduled = Object.values(reportedCounts); 

    // this.hazardMonthlyChart = {
    //   series: [
    //     {
    //       name: "Number of Hazards Reported",
    //       data: scheduled
    //     },
    //     {
    //       name: "Number of Hazards Closed",
    //       data: completed
    //     } 
    //   ],  
    //   chart: {
    //     type: "bar",
    //     height: 350,
    //     toolbar: {
    //       show: false
    //     }
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //       columnWidth: "55%",
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   stroke: {
    //     show: true,
    //     width: 2,
    //     colors: ["transparent"]
    //   },

    //   xaxis: {
    //     categories: months
    //   },
    //   fill: {
    //     opacity: 1
    //   },
    //   tooltip: {
    //     y: {
    //       formatter: function (val: any) {
    //         return val;
    //       }
    //     }
    //   }
    // }
  }



}
