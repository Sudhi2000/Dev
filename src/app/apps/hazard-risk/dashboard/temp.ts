// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { MomentDateAdapter } from '@angular/material-moment-adapter';
// import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// import { ChartType, comLevelChart, divisionChart, riskChart, statusChart, TatChart, totalLevelChart } from './chart-model';
// import { GeneralService } from 'src/app/services/general.api.service';
// import { Router } from '@angular/router';
// import { environment } from 'src/environments/environment';
// import { AuthService } from 'src/app/services/auth.api.service';
// import { HazardService } from 'src/app/services/hazards.api.service';

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'LL'
//   },
//   display: {
//     dateInput: 'DD-MMM-YYYY',
//     monthYearLabel: 'YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'YYYY'
//   }
// };

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
//   providers: [
//     { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
//     { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
//   ]
// })
// export class DashboardComponent implements OnInit {

//   filterForm: FormGroup
//   dateRange = new FormGroup({
//     start: new FormControl(),
//     end: new FormControl()
//   });
//   simpleItems: any = [];
//   divisionChart: ChartType
//   statusChart: ChartType
//   totalLevelChart: ChartType
//   comLevelChart: ChartType
//   TatChart: ChartType
//   riskChart: ChartType
//   orgID: string

//   divisions: any[] = []
//   categories: any[] = []

//   //parameters
//   date: any = new Date();
//   startDate: any
//   endDate: any
//   periodVal: string = "Select Period"
//   divisionVal: string = "Select Division"
//   categoryVal: string = "Risk Category"

//   ehsData: any[] = []
//   filteredEhsData: any[] = []
//   previousEHSData: any[] = []

//   //cards
//   summaryCardData: any[] = []
//   statusCardData: any[] = []
//   riskLevelCardData: any[] = []
//   tatStatusCard: any[] = []
//   risk_category_card: any[] = []
//   risk_control_card: any[] = []

//   transactionData: any[] = []

//   constructor(private generalService: GeneralService,
//     private router: Router,
//     private authService: AuthService,
//     private hazardService: HazardService,
//     private formBuilder: FormBuilder) { }

//   ngOnInit(): void {
//     this.configuration()
//     this.simpleItems = [true, 'Two', 3];
//     this.divisionChart = divisionChart
//     this.statusChart = statusChart
//     this.totalLevelChart = totalLevelChart
//     this.comLevelChart = comLevelChart
//     this.TatChart = TatChart
//     this.riskChart = riskChart

//     this.filterForm = this.formBuilder.group({
//       startDate: [''],
//       endDate: [''],
//       period: [''],
//       division: [''],
//       riskCategory: ['']
//     })

//     var curr = new Date()
//     const monthStart = new Date(curr.getUTCFullYear(), curr.getMonth());
//     const monthEnd = new Date();

//     const monthStartDate = monthStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//       monthStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//       monthStart.toLocaleDateString("en-US", { year: 'numeric' })

//     const monthEndDate = monthEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//       monthEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//       monthEnd.toLocaleDateString("en-US", { year: 'numeric' })

//     this.filterForm.controls['startDate'].setValue(monthStartDate);
//     this.filterForm.controls['endDate'].setValue(monthEndDate)

//   }

//   //check organisation has access
//   configuration() {
//     this.generalService.get_app_config().subscribe({
//       next: (result: any) => {
//         const status = result.data.attributes.modules.hazard_risk
//         if (status === false) {
//           this.router.navigate(["/error/upgrade-subscription"])
//         } else if (status === true) {
//           const allcookies = document.cookie.split(';');
//           const name = environment.org_id
//           for (var i = 0; i < allcookies.length; i++) {
//             var cookiePair = allcookies[i].split("=");
//             if (name == cookiePair[0].trim()) {
//               this.orgID = decodeURIComponent(cookiePair[1])
//             }
//           }
//           this.me()
//         }
//       },
//       error: (err: any) => {
//         this.router.navigate(["/error/internal"])
//       },
//       complete: () => { }
//     })

//   }

//   //check user has access
//   me() {
//     this.authService.me().subscribe({
//       next: (result: any) => {
//         const status = result.ehs_dashboard
//         if (status === false) {
//           this.router.navigate(["/error/unauthorized"])
//         } else {
//           this.get_divisions()
//           this.get_category()
//           this.generate_default_ehs_data()
//         }
//       },
//       error: (err: any) => {
//         this.router.navigate(["/error/internal"])
//       },
//       complete: () => { }
//     })
//   }

//   get_divisions() {
//     this.generalService.get_division(this.orgID).subscribe({
//       next: (result: any) => {
//         this.divisions = result.data
//       },
//       error: (err: any) => {
//         this.router.navigate(["/error/internal"])
//       },
//       complete: () => { }
//     })
//   }

//   get_category() {
//     this.hazardService.get_category(this.orgID).subscribe({
//       next: (result: any) => {
//         this.categories = result.data
//       },
//       error: (err: any) => {
//         this.router.navigate(["/error/internal"])
//       },
//       complete: () => { }
//     })
//   }

//   period(data: any) {

//     const period = data.target.id
//     var curr = new Date;

//     switch (period) {

//       case "This Week":
//         var weekStart = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
//         var weekEnd = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));

//         const WeekstartDate = weekStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//           weekStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//           weekStart.toLocaleDateString("en-US", { year: 'numeric' })

//         const WeekendDate = weekEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//           weekEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//           weekEnd.toLocaleDateString("en-US", { year: 'numeric' });

//         this.dateRange.controls['start'].setValue(WeekstartDate)
//         this.dateRange.controls['end'].setValue(WeekendDate)


//         break;
//       case "Last Week":
//         const lastWeekEnd = new Date(curr.setTime(curr.getTime() - (curr.getDay() ? curr.getDay() : 7) * 24 * 60 * 60 * 1000));
//         const lastWeekStart = new Date(curr.setTime(curr.getTime() - 6 * 24 * 60 * 60 * 1000));

//         const LastWeekstartDate = lastWeekStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//           lastWeekStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//           lastWeekStart.toLocaleDateString("en-US", { year: 'numeric' })

//         const LastWeekendDate = lastWeekEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//           lastWeekEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//           lastWeekEnd.toLocaleDateString("en-US", { year: 'numeric' });

//         this.dateRange.controls['start'].setValue(LastWeekstartDate)
//         this.dateRange.controls['end'].setValue(LastWeekendDate)

//         break;
//       case "This Month":
//         const monthStart = new Date(curr.getFullYear(), curr.getMonth());
//         const monthEnd = new Date();

//         const monthstartDate = monthStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//           monthStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//           monthStart.toLocaleDateString("en-US", { year: 'numeric' })

//         const monthEndDate = monthEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//           monthEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//           monthEnd.toLocaleDateString("en-US", { year: 'numeric' });

//         this.dateRange.controls['start'].setValue(monthstartDate)
//         this.dateRange.controls['end'].setValue(monthEndDate)

//         break;
//       case "Last Month":
//         const lastMonthstart = new Date(curr.getFullYear(), curr.getMonth() - 1);
//         const lastMonthEnd = new Date(curr.getFullYear(), curr.getMonth(), 0)

//         const lastMonthstartDate = lastMonthstart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//           lastMonthstart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//           lastMonthstart.toLocaleDateString("en-US", { year: 'numeric' })

//         const lastMonthEndDate = lastMonthEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//           lastMonthEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//           lastMonthEnd.toLocaleDateString("en-US", { year: 'numeric' });

//         this.dateRange.controls['start'].setValue(lastMonthstartDate)
//         this.dateRange.controls['end'].setValue(lastMonthEndDate)

//         break;
//       case "This Year":
//         const yearStart = new Date(new Date().getFullYear(), 0, 1);
//         const yearEnd = new Date("12/31/" + (new Date()).getFullYear());

//         const yearStartDate = yearStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//           yearStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//           yearStart.toLocaleDateString("en-US", { year: 'numeric' })

//         const yearEndDate = yearEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//           yearEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//           yearEnd.toLocaleDateString("en-US", { year: 'numeric' });

//         this.dateRange.controls['start'].setValue(yearStartDate)
//         this.dateRange.controls['end'].setValue(yearEndDate)

//         break;
//       case "Last Year":
//         const lastYearStart = new Date(new Date().getFullYear() - 1, 0, 1)
//         const lastYearEnd = new Date(new Date().getFullYear() - 1, 0, 31)

//         const lastYearStartDate = lastYearStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//           lastYearStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//           lastYearStart.toLocaleDateString("en-US", { year: 'numeric' })

//         const lastYearEndDate = lastYearEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
//           lastYearEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
//           lastYearEnd.toLocaleDateString("en-US", { year: 'numeric' });

//         this.dateRange.controls['start'].setValue(lastYearStartDate)
//         this.dateRange.controls['end'].setValue(lastYearEndDate)


//         break;
//     }
//   }

//   reset() {
//     this.summaryCardData= []
//     this.statusCardData= []
//     this.riskLevelCardData = []
//     this.tatStatusCard = []
//     this.risk_category_card = []
//     this.risk_control_card = []

//     this.ngOnInit()
//   }

//   division(data: any) {
//     this.divisionVal = data.target.id
//   }

//   category(data: any) {
//     this.categoryVal = data.target.id
//   }

//   startDateChange(event: any) {
//     this.startDate = new Date(new Date(event.value).setHours(0, 0, 0)).toISOString()
//   }

//   endDateChange(event: any) {
//     this.endDate = new Date(new Date(event.value).setHours(0, 0, 0)).toISOString()
//   }

//   //get default ehs data
//   generate_default_ehs_data() {
//     const start = new Date(this.filterForm.value.startDate)
//     start.setDate(start.getDate() + 1)
//     const end = new Date(this.filterForm.value.endDate)
//     end.setDate(end.getDate() + 1)

//     const startDate = new Date(start).toISOString()
//     const endDate = new Date(end).toISOString()

//     this.hazardService.generate_ehs_data(this.orgID, startDate, endDate).subscribe({
//       next: (result: any) => {
//         this.ehsData = result.data
//         this.filteredEhsData = result.data
//       },
//       error: (err: any) => {
//         this.router.navigate(["/error/internal"])
//       },
//       complete: () => {
//         var curr = new Date()
//         const lastMonthstart = new Date(curr.getFullYear(), curr.getMonth() - 1);
//         lastMonthstart.setDate(lastMonthstart.getDate() + 1)
//         const lastMonthEnd = new Date(curr.getFullYear(), curr.getMonth(), 0)
//         lastMonthEnd.setDate(lastMonthEnd.getDate() + 1)
//         const startDate = new Date(lastMonthstart).toISOString()
//         const endDate = new Date(lastMonthEnd).toISOString()
//         this.hazardService.generate_ehs_data(this.orgID, startDate, endDate).subscribe({
//           next: (result: any) => {
//             this.previousEHSData = result.data
//           },
//           error: (err) => { },
//           complete: () => {
//             this.summary_card()
//             this.division_card()
//             this.status_card()
//             this.risk_level()
//             this.tat_status()
//             this.risk_category()
//             this.risk_controls()
//             this.transaction()
//           }
//         })
//       }
//     })
//   }

//   applyFilter() {
//     console.log(this.filterForm.value)

//   }


//   //summary card  
//   summary_card() {
//     let totAttrition = ''
//     let totAttrition_icon = ''
//     let totAttrition_bg = ''
//     let comAttrition = ''
//     let comAttrition_icon = ''
//     let comAttrition_bg = ''
//     let penAttrition = ''
//     let penAttrition_icon = ''
//     let penAttrition_bg = ''
//     let amtAttrition = ''
//     let amtAttrition_icon = ''
//     let amtAttrition_bg = ''

//     //current data
//     const comData = this.filteredEhsData.filter(function (elem) {
//       return (elem.attributes.status == "Completed")
//     })
//     const openData = this.filteredEhsData.filter(function (elem) {
//       return (elem.attributes.status == "Open")
//     })
//     const inPrData = this.filteredEhsData.filter(function (elem) {
//       return (elem.attributes.status == "In-Progress")
//     })

//     //previous data
//     const prevComData = this.previousEHSData.filter(function (elem) {
//       return (elem.attributes.status == "Completed")
//     })
//     const prevOpenData = this.previousEHSData.filter(function (elem) {
//       return (elem.attributes.status == "Open")
//     })
//     const prevInPrData = this.previousEHSData.filter(function (elem) {
//       return (elem.attributes.status == "In-Progress")
//     })

//     const totalHRM = this.filteredEhsData.length
//     const comHRM = comData.length
//     const pendHRM = Number(openData.length) + Number(inPrData.length)
//     const amount = this.filteredEhsData.reduce((acc, cur) => acc + Number(cur.attributes.cost), 0)
//     const prevTotalHRM = this.previousEHSData.length
//     const prevComHRM = prevComData.length
//     const prevPendHRM = Number(prevOpenData.length) + Number(prevInPrData.length)
//     const prevAmount = this.previousEHSData.reduce((acc, cur) => acc + Number(cur.attributes.cost), 0)

//     //total attrition
//     if (totalHRM == 0) {
//       totAttrition = '0%'
//       totAttrition_bg = 'widget-stats-indicator-positive'
//     } else {
//       if (totalHRM > prevTotalHRM) {
//         const attrition = Number(prevTotalHRM) / Number(totalHRM) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         totAttrition = value.replace(/['"]+/g, '')
//         totAttrition_icon = 'icon-arrow-up'
//         totAttrition_bg = 'widget-stats-indicator-positive'
//       } else if (totalHRM < prevTotalHRM) {
//         const attrition = Number(totalHRM) / Number(prevTotalHRM) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         totAttrition = value.replace(/['"]+/g, '')
//         totAttrition_icon = 'icon-arrow-down'
//         totAttrition_bg = 'widget-stats-indicator-negative'
//       } else if (totalHRM == prevTotalHRM) {
//         totAttrition = '0%'
//         totAttrition_bg = 'widget-stats-indicator-positive'
//       }
//     }

//     //completed attrition
//     if (comHRM == 0) {
//       comAttrition = '0%'
//       comAttrition_bg = 'widget-stats-indicator-positive'
//     } else {
//       if (comHRM > prevComHRM) {
//         const attrition = Number(prevComHRM) / Number(comHRM) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         comAttrition = value.replace(/['"]+/g, '')
//         comAttrition_icon = 'icon-arrow-up'
//         comAttrition_bg = 'widget-stats-indicator-positive'
//       } else if (comHRM < prevComHRM) {
//         const attrition = Number(comHRM) / Number(prevComHRM) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         comAttrition = value.replace(/['"]+/g, '')
//         comAttrition_icon = 'icon-arrow-down'
//         comAttrition_bg = 'widget-stats-indicator-negative'
//       } else if (comHRM == prevComHRM) {
//         comAttrition = '0%'
//         comAttrition_bg = 'widget-stats-indicator-positive'
//       }
//     }

//     //pending attrition
//     if (pendHRM == 0) {
//       penAttrition = '0%'
//       penAttrition_bg = 'widget-stats-indicator-positive'
//     } else {
//       if (pendHRM > prevPendHRM) {
//         const attrition = Number(prevPendHRM) / Number(pendHRM) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         penAttrition = value.replace(/['"]+/g, '')
//         penAttrition_icon = 'icon-arrow-up'
//         penAttrition_bg = 'widget-stats-indicator-positive'
//       } else if (pendHRM < prevPendHRM) {
//         const attrition = Number(pendHRM) / Number(prevPendHRM) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         penAttrition = value.replace(/['"]+/g, '')
//         penAttrition_icon = 'icon-arrow-down'
//         penAttrition_bg = 'widget-stats-indicator-negative'
//       } else if (pendHRM == prevPendHRM) {
//         penAttrition = '0%'
//         penAttrition_bg = 'widget-stats-indicator-positive'
//       }
//     }

//     //amount attrition
//     if (amount == 0) {
//       amtAttrition = '0%'
//       amtAttrition_bg = 'widget-stats-indicator-positive'
//     } else {
//       if (amount > prevAmount) {
//         const attrition = Number(prevAmount) / Number(amount) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         amtAttrition = value.replace(/['"]+/g, '')
//         amtAttrition_icon = 'icon-arrow-up'
//         amtAttrition_bg = 'widget-stats-indicator-positive'
//       } else if (amount < prevAmount) {
//         const attrition = Number(amount) / Number(prevAmount) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         amtAttrition = value.replace(/['"]+/g, '')
//         amtAttrition_icon = 'icon-arrow-down'
//         amtAttrition_bg = 'widget-stats-indicator-negative'
//       } else if (amount == prevAmount) {
//         amtAttrition = '0%'
//         amtAttrition_bg = 'widget-stats-indicator-positive'
//       }
//     }

//     this.summaryCardData.push(
//       {
//         "title": "Total",
//         "icon": "icon-list",
//         "value": totalHRM,
//         "attrition": totAttrition,
//         "attri_icon": totAttrition_icon,
//         "attri_bg": totAttrition_bg

//       },
//       {
//         "title": "Completed",
//         "icon": "icon-check-circle",
//         "value": comHRM,
//         "attrition": comAttrition,
//         "attri_icon": comAttrition_icon,
//         "attri_bg": comAttrition_bg

//       },
//       {
//         "title": "Pending",
//         "icon": "icon-more-horizontal",
//         "value": pendHRM,
//         "attrition": penAttrition,
//         "attri_icon": penAttrition_icon,
//         "attri_bg": penAttrition_bg

//       },
//       {
//         "title": "Amount",
//         "icon": "icon-credit-card",
//         "value": amount,
//         "attrition": amtAttrition,
//         "attri_icon": amtAttrition_icon,
//         "attri_bg": amtAttrition_bg
//       }
//     )
//   }

//   //division card
//   division_card() {
//     let diviName: any[] = []
//     let divisionName: any[] = []
//     this.filteredEhsData.forEach(elem => {
//       diviName.push(elem.attributes.division)
//     })
//     var duplicateValue = new Set(diviName);
//     diviName = [...duplicateValue];
//     divisionName = diviName
//     let division: any[] = []
//     let highValue: any[] = []
//     let mediumValue: any[] = []
//     let lowValue: any[] = []
//     divisionName.forEach(elem => {
//       division.push(elem)
//       const high = this.filteredEhsData.filter(function (data) {
//         return (data.attributes.division == elem && data.attributes.level === "High")
//       })
//       highValue.push(Number(high.length))
//       const medium = this.filteredEhsData.filter(function (data) {
//         return (data.attributes.division == elem && data.attributes.level === "Medium")
//       })
//       mediumValue.push(Number(medium.length))
//       const low = this.filteredEhsData.filter(function (data) {
//         return (data.attributes.division == elem && data.attributes.level === "Low")
//       })
//       lowValue.push(Number(low.length))
//     })
//     this.divisionChart = {
//       series: [
//         {
//           name: "High",
//           data: highValue
//         },
//         {
//           name: "Medium",
//           data: mediumValue
//         },
//         {
//           name: "Low",
//           data: lowValue
//         }
//       ],
//       colors: ['#FF1744', '#CCCC00', '#34c38f'],
//       chart: {
//         type: "bar",
//         height: 350
//       },
//       plotOptions: {
//         bar: {
//           horizontal: false,
//           columnWidth: "55%",
//           endingShape: "rounded"
//         }
//       },
//       dataLabels: {
//         enabled: false
//       },
//       stroke: {
//         show: true,
//         width: 2,
//         colors: ["transparent"]
//       },
//       xaxis: {
//         categories: division
//       },
//       yaxis: {
//         title: {
//           text: "$ (thousands)"
//         }
//       },
//       fill: {
//         opacity: 1
//       },
//       tooltip: {
//         y: {
//           formatter: function (val: any) {
//             return val;
//           }
//         }
//       }
//     };
//   }


//   //status card
//   status_card() {
//     let Attrition = ''
//     let AttritionIcon = ''
//     const total = this.filteredEhsData.length

//     //current data
//     const comData = this.filteredEhsData.filter(function (elem) {
//       return (elem.attributes.status == "Completed")
//     })

//     //previous data
//     const prevComData = this.previousEHSData.filter(function (elem) {
//       return (elem.attributes.status == "Completed")
//     })

//     const completed = comData.length
//     const prevCompleted = prevComData.length
//     const comPercentage = Number(Number(completed) / Number(total) * 100).toFixed(0)

//     //attrition
//     if (completed == 0) {
//       Attrition = '0%'
//     } else {
//       if (completed > prevCompleted) {
//         const attrition = Number(prevCompleted) / Number(completed) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         Attrition = value.replace(/['"]+/g, '')
//         AttritionIcon = "icon-arrow-up"
//       } else if (completed < prevCompleted) {
//         const attrition = Number(completed) / Number(prevCompleted) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         Attrition = value.replace(/['"]+/g, '')
//         AttritionIcon = "icon-arrow-down"
//       } else if (completed == prevCompleted) {
//         Attrition = '0%'
//       }
//     }

//     if (Number(comPercentage) > 0) {
//       this.statusCardData.push(
//         {
//           'completed': completed,
//           'comPercentage': Number(comPercentage),
//           'attrition': Attrition,
//           'prevMonthCom': prevCompleted,
//           'attritionIcon': AttritionIcon
//         }
//       )

//     } else {
//       this.statusCardData.push(
//         {
//           'completed': completed,
//           'comPercentage': 0,
//           'attrition': '0',
//           'prevMonthCom': prevCompleted,
//           'attritionIcon': AttritionIcon


//         }
//       )
//     }
//   }

//   //risk level
//   risk_level() {
//     const total = this.filteredEhsData.length
//     //high level
//     let Attrition = ''
//     let AttritionIcon = ''
//     let highComperncetage = ''
//     let highTotperncetage = ''
//     const data = this.filteredEhsData.filter(function (elem) {
//       return (elem.attributes.level == "High")
//     })
//     const totHighPerc = Number(Number(data.length) / Number(total) * 100).toFixed(0)
//     if (Number(totHighPerc) > 0) {
//       highTotperncetage = totHighPerc
//     } else {
//       highTotperncetage = '0'
//     }
//     const comdData = this.filteredEhsData.filter(function (elem) {
//       return (elem.attributes.level === "High" && elem.attributes.resolution === "Completed")
//     })
//     const comHighPerc = Number(Number(comdData.length) / Number(data.length) * 100).toFixed(0)
//     if (Number(comHighPerc) > 0) {
//       highComperncetage = comHighPerc
//     } else {
//       highComperncetage = '0'
//     }
//     const prevData = this.previousEHSData.filter(function (elem) {
//       return (elem.attributes.level == "High")
//     })
//     const highLevel = data.length
//     const highPrev = prevData.length
//     if (highLevel == 0) {
//       Attrition = '0%'
//     } else {
//       if (highLevel > highPrev) {
//         const attrition = Number(highPrev) / Number(highLevel) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         Attrition = value.replace(/['"]+/g, '')
//         AttritionIcon = "icon-arrow-up"
//       } else if (highLevel < highPrev) {
//         const attrition = Number(highLevel) / Number(highPrev) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         Attrition = value.replace(/['"]+/g, '')
//         AttritionIcon = "icon-arrow-down"
//       } else if (highLevel == highPrev) {
//         Attrition = '0%'
//       }
//     }

//     //medium level
//     let mediumAttrition = ''
//     let mediumAttritionIcon = ''
//     let mediumComperncetage = ''
//     let mediumTotperncetage = ''
//     const mediumData = this.filteredEhsData.filter(function (elem) {
//       return (elem.attributes.level == "Medium")
//     })
//     const mediumTotHighPerc = Number(Number(mediumData.length) / Number(total) * 100).toFixed(0)
//     if (Number(mediumTotHighPerc) > 0) {
//       mediumTotperncetage = mediumTotHighPerc
//     } else {
//       mediumTotperncetage = '0'
//     }
//     const mediumComdData = this.filteredEhsData.filter(function (elem) {
//       return (elem.attributes.level === "Medium" && elem.attributes.resolution === "Completed")
//     })
//     const mediumComHighPerc = Number(Number(mediumComdData.length) / Number(mediumData.length) * 100).toFixed(0)
//     if (Number(mediumComHighPerc) > 0) {
//       mediumComperncetage = mediumComHighPerc
//     } else {
//       mediumComperncetage = '0'
//     }
//     const mediumPrevData = this.previousEHSData.filter(function (elem) {
//       return (elem.attributes.level == "Medium")
//     })
//     const mediumLevel = mediumData.length
//     const mediumPrev = mediumPrevData.length
//     if (mediumLevel == 0) {
//       mediumAttrition = '0%'
//     } else {
//       if (mediumLevel > mediumPrev) {
//         const attrition = Number(mediumPrev) / Number(mediumLevel) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         mediumAttrition = value.replace(/['"]+/g, '')
//         mediumAttritionIcon = "icon-arrow-up"
//       } else if (mediumLevel < mediumPrev) {
//         const attrition = Number(mediumLevel) / Number(mediumPrev) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         mediumAttrition = value.replace(/['"]+/g, '')
//         mediumAttritionIcon = "icon-arrow-down"
//       } else if (mediumLevel == mediumPrev) {
//         mediumAttrition = '0%'
//       }
//     }

//     //low level
//     let lowAttrition = ''
//     let lowAttritionIcon = ''
//     let lowComperncetage = ''
//     let lowTotperncetage = ''
//     const lowData = this.filteredEhsData.filter(function (elem) {
//       return (elem.attributes.level == "Low")
//     })
//     const lowTotHighPerc = Number(Number(lowData.length) / Number(total) * 100).toFixed(0)
//     if (Number(lowTotHighPerc) > 0) {
//       lowTotperncetage = lowTotHighPerc
//     } else {
//       lowTotperncetage = '0'
//     }
//     const lowComdData = this.filteredEhsData.filter(function (elem) {
//       return (elem.attributes.level === "Low" && elem.attributes.resolution === "Completed")
//     })
//     const lowComHighPerc = Number(Number(lowComdData.length) / Number(lowData.length) * 100).toFixed(0)
//     if (Number(lowComHighPerc) > 0) {
//       lowComperncetage = lowComHighPerc
//     } else {
//       lowComperncetage = '0'
//     }
//     const lowPrevData = this.previousEHSData.filter(function (elem) {
//       return (elem.attributes.level == "Low")
//     })
//     const lowLevel = lowData.length
//     const lowPrev = lowPrevData.length
//     if (lowLevel == 0) {
//       lowAttrition = '0%'
//     } else {
//       if (lowLevel > lowPrev) {
//         const attrition = Number(lowPrev) / Number(lowLevel) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         lowAttrition = value.replace(/['"]+/g, '')
//         lowAttritionIcon = "icon-arrow-up"
//       } else if (lowLevel < lowPrev) {
//         const attrition = Number(lowLevel) / Number(lowPrev) * 100
//         const value = JSON.stringify(attrition.toFixed(0) + ' %')
//         lowAttrition = value.replace(/['"]+/g, '')
//         lowAttritionIcon = "icon-arrow-down"
//       } else if (lowLevel == lowPrev) {
//         lowAttrition = '0%'
//       }
//     }

//     this.riskLevelCardData.push(
//       {
//         'title': "High Level Cases",
//         'total': Number(highLevel),
//         'attrition': Attrition,
//         'attritionIcon': AttritionIcon,
//         'currTotal': Number(highTotperncetage),
//         'currComp': Number(highComperncetage),
//       },
//       {
//         'title': "Medium Level Cases",
//         'total': Number(mediumLevel),
//         'attrition': mediumAttrition,
//         'attritionIcon': mediumAttritionIcon,
//         'currTotal': Number(mediumTotperncetage),
//         'currComp': Number(mediumComperncetage),
//       },
//       {
//         'title': "Low Level Cases",
//         'total': Number(lowLevel),
//         'attrition': lowAttrition,
//         'attritionIcon': lowAttritionIcon,
//         'currTotal': Number(lowTotperncetage),
//         'currComp': Number(lowComperncetage),
//       }
//     )
//   }

//   //tat status
//   tat_status() {
//     let tatStatus = ['On Time', 'Delayed', 'Pending']
//     let value: any[] = []
//     const total = this.filteredEhsData.length
//     const totalCom = this.filteredEhsData.filter(function (data) {
//       return (data.attributes.resolution == "Completed")
//     })
//     const onTime = this.filteredEhsData.filter(function (data) {
//       return (data.attributes.resolution == "Completed" && data.attributes.tat_status === "On-Time")
//     })
//     const onTimePercentage = (Number(onTime.length) / Number(totalCom.length) * 100).toFixed(0)
//     if (Number(onTimePercentage) > 0) {
//       value.push(onTimePercentage)
//     } else {
//       value.push(0)
//     }
//     const delayed = this.filteredEhsData.filter(function (data) {
//       return (data.attributes.resolution == "Completed" && data.attributes.tat_status === "Delayed")
//     })
//     const delayedPercentage = (Number(delayed.length) / Number(totalCom.length) * 100).toFixed(0)
//     if (Number(delayedPercentage) > 0) {
//       value.push(delayedPercentage)
//     } else {
//       value.push(0)
//     }
//     const open = this.filteredEhsData.filter(function (data) {
//       return (data.attributes.resolution == "Open")
//     })
//     const pending = Number(open.length)
//     const pendingPercentage = (Number(pending) / Number(total) * 100).toFixed(0)

//     if (Number(pendingPercentage) > 0) {
//       value.push(pendingPercentage)
//     } else {
//       value.push(0)
//     }
//     this.tatStatusCard.push(

//       {
//         "title": "On-Time",
//         "count": onTime.length
//       },
//       {
//         "title": "Delayed",
//         "count": delayed.length
//       },
//       {
//         "title": "Pending",
//         "count": pending
//       }
//     )

//     this.TatChart = {
//       series: value,
//       chart: {
//         height: 390,
//         type: "radialBar"
//       },
//       plotOptions: {
//         radialBar: {
//           offsetY: 0,
//           startAngle: 0,
//           endAngle: 270,
//           hollow: {
//             margin: 5,
//             size: "30%",
//             background: "transparent",
//             image: undefined
//           },
//           dataLabels: {
//             name: {
//               show: true,
//               fontSize: '16px',
//               fontWeight: 600,
//               offsetY: -10
//             },
//             value: {
//               show: true,
//               fontSize: '14px',
//               offsetY: 4,
//               formatter: function (val: any) {
//                 return val + '%'
//               }
//             },
//             total: {
//               show: false,
//               label: 'Total',
//               color: '#999',
//               fontSize: '16px',
//               fontFamily: undefined,
//               fontWeight: 600,
//               formatter: function (w: any) {
//                 return w.globals.seriesTotals.reduce(function (a: any, b: any) {
//                   return a + b;
//                 }, 0) + '%';
//               }
//             }
//           },
//           track: {
//             show: true,
//             startAngle: undefined,
//             endAngle: undefined,
//             background: '#f2f2f2',
//             strokeWidth: '97%',
//             opacity: 1,
//             margin: 12,
//             dropShadow: {
//               enabled: false,
//               top: 0,
//               left: 0,
//               blur: 3,
//               opacity: 0.5
//             }
//           },
//         }
//       },
//       stroke: {
//         lineCap: 'round'
//       },
//       colors: ["#1ab7ea", "#0084ff", "#39539E"],
//       labels: ["On Time", "Delayed", "Pending"],
//       legend: {
//         show: true,
//         floating: true,
//         fontSize: "15px",
//         position: "left",
//         offsetX: 20,
//         offsetY: 30,
//         labels: {
//           useSeriesColors: true
//         },
//         formatter: function (seriesName: any, opts: any) {
//           return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + '%';
//         },
//         itemMargin: {
//           horizontal: 3
//         }
//       },
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             legend: {
//               show: false
//             }
//           }
//         }
//       ]
//     };


//   }

//   //category
//   risk_category() {
//     let categoryName: any[] = []
//     let category: any[] = []
//     this.filteredEhsData.forEach(elem => {
//       categoryName.push(elem.attributes.category)
//     })
//     var duplicateValue = new Set(categoryName);
//     categoryName = [...duplicateValue];
//     category = categoryName
//     const total = this.filteredEhsData.length
//     category.forEach(category => {
//       const data = this.filteredEhsData.filter(function (data) {
//         return (data.attributes.category == category)
//       })
//       const comData = this.filteredEhsData.filter(function (data) {
//         return (data.attributes.category == category && data.attributes.resolution === "Completed")
//       })
//       const percentage = Number(Number(data.length) / Number(total) * 100).toFixed(0)
//       this.risk_category_card.push(
//         {
//           'category': category,
//           'count': data.length,
//           'percentage': percentage,
//           'completed': comData.length
//         }
//       )
//     })
//   }

//   //controls
//   risk_controls() {
//     let controlName: any[] = []
//     let control: any[] = []
//     const completed = this.filteredEhsData.filter(function (data) {
//       return (data.attributes.resolution == "Completed")
//     })
//     completed.forEach(elem => {
//       controlName.push(elem.attributes.control)
//     })
//     var duplicateValue = new Set(controlName);
//     controlName = [...duplicateValue];
//     control = controlName
//     control.forEach(control => {
//       const data = this.filteredEhsData.filter(function (data) {
//         return (data.attributes.control == control && data.attributes.resolution === "Completed")
//       })
//       const percentage = Number(Number(data.length) / Number(completed.length) * 100).toFixed(0)
//       this.risk_control_card.push(
//         {
//           'control': control,
//           'count': data.length,
//           'percentage': percentage
//         }
//       )
//     })
//   }

//   //latest transaction
//   transaction() {
//     const size = 5
//     this.transactionData = this.ehsData.slice(0, size)
//   }

// }
