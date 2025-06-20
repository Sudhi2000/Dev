import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { RagService } from 'src/app/services/rag.api.service';
import { environment } from 'src/environments/environment';
import { ageGroupChart, categoryChart, ChartType, employeeStatusChart, genderChart, overallTenureChart, ragComparisonChart, stateChart } from './chart-model';
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
  filterForm: FormGroup
  orgID: string
  dropdown_values: any[] = []
  departments: any[] = []
  summaryCard: any[] = []
  rag_data: any[] = []
  prev_rag_data: any[] = []
  countries: any[] = []
  filterStates: any[] = []
  states: any[] = []
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

  ragComparisonChart: ChartType
  overallTenureChart: ChartType
  categoryChart: ChartType
  genderChart: ChartType
  employeeStatusChart: ChartType
  stateChart: ChartType
  ageGroupChart: ChartType

  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private ragService: RagService) { }

  ngOnInit() {
    this.configuration()
    this.ragComparisonChart = ragComparisonChart
    this.overallTenureChart = overallTenureChart
    this.categoryChart = categoryChart
    this.genderChart = genderChart
    this.employeeStatusChart = employeeStatusChart
    this.stateChart = stateChart
    this.ageGroupChart = ageGroupChart


    this.filterForm = this.formBuilder.group({
      division: [''],
      start: [''],
      end: [''],
      year: [],
      count: [''],
      country:[''],
      state:['']
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
    this.filterDateRange.controls['start'].setValue(monthStartDate)
    this.filterDateRange.controls['end'].setValue(monthEndDate)



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

  search() {
    this.showProgressPopup()
    this.get_rag_data()
  }

  reset() {
    this.dateRange.reset()
    this.filterDateRange.reset()
    this.filterForm.reset()
    this.ngOnInit()
  }

  searchLocation() {
    this.showProgressPopup()
    this.ragStateChart()
    Swal.close()
  }

  resetLocation() {
  
    this.filterForm.controls['state'].reset()   
    this.filterForm.controls['country'].reset()
    this.filterStates = [];
    this.ragStateChart();
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.rag
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
        const status = result.rag_dashboard
        if (status === false) {
          Swal.close()
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_dropdown_values()

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_dropdown_values() {
    const module = "Social Apps"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdown_values = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.get_departments()
        this.get_country()
        this.get_state()
      }
    })

  }

  get_departments() {
    this.generalService.get_department().subscribe({
      next: (result: any) => {
        this.departments = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.initialData()
      }
    })
  }

  get_country() {
    this.generalService.get_country().subscribe({
      next: (result: any) => {

        this.countries = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_state() {
    this.generalService.get_state().subscribe({
      next: (result: any) => {

        this.states = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  getStates(data: any) {
    const country = data.value
    const category = this.states.filter(function (elem: any) {
      return (elem.attributes.country === country)
    })
    this.filterStates = category.map(element => element.attributes.state_name)
  }

  
  initialData() {
    this.get_rag_data()
  }

  get_rag_data() {
    const startDate = new Date(this.filterDateRange.value.start)
    startDate.setDate(startDate.getDate() + 1)
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


    this.ragService.get_rag_data_dash(start, end).subscribe({
      next: (result: any) => {
        this.ragService.get_rag_data_dash(prevStart, prevEnd).subscribe({
          next: (prevResult: any) => {
            this.summaryCard = []
            this.rag_data = result.data
            this.filterForm.controls['count'].setValue(result.data.length)
            this.prev_rag_data = prevResult.data
            const current = result.data.length
            const previous = prevResult.data.length
            let attrition: any = ''
            let attrition_bg: any = ''
            let attrition_icon: any = ''
            if (current === 0) {
              attrition = "0 %"
              attrition_bg = 'text-success'
              attrition_icon = ''
              this.summaryCard.push({
                category: 'Total',
                quantity: current,
                attrition: attrition,
                attrition_bg: attrition_bg,
                attrition_icon: attrition_icon,
                icon: "total.png"
              })
            } else {
              if (current > previous) {
                const temp_attrition = Number(previous) / Number(current) * 100
                const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
                attrition = value.replace(/['"]+/g, '')
                attrition_icon = 'icon-arrow-up'
                attrition_bg = 'text-danger'
                this.summaryCard.push({
                  category: 'Total',
                  quantity: current,
                  attrition: attrition,
                  attrition_bg: attrition_bg,
                  attrition_icon: attrition_icon,
                  icon: "total.png"

                })
              } else if (current < previous) {
                const temp_attrition = Number(current) / Number(previous) * 100
                const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
                attrition = value.replace(/['"]+/g, '')
                attrition_icon = 'icon-arrow-down'
                attrition_bg = 'text-success'
                this.summaryCard.push({
                  category: 'Total',
                  quantity: current,
                  attrition: attrition,
                  attrition_bg: attrition_bg,
                  attrition_icon: attrition_icon,
                  icon: "total.png"

                })
              } else if (current === previous) {
                attrition = "0 %"
                attrition_bg = 'text-success'
                attrition_icon = ''
                this.summaryCard.push({
                  category: 'Total',
                  quantity: current,
                  attrition: attrition,
                  attrition_bg: attrition_bg,
                  attrition_icon: attrition_icon,
                  icon: "total.png"

                })
              }
            }



          },
          error: (err: any) => { },
          complete: () => {
            this.summary_card()
            this.ragComparison()
            this.tenureChart()
            this.ragCategoryChart()
            this.ragGenderChart()
            this.ragEmployeeStatusChart()
            this.ragStateChart()
            this.ragAgeGroupChart()


          }
        })
      },
      error: (err: any) => { },
      complete: () => { Swal.close() }
    })
  }

  summary_card() {
    let rag: any[] = ['Red', 'Amber', 'Green']

    rag.forEach(ragElem => {
      const catData = this.rag_data.filter(function (elem) {
        return (elem.attributes.rag == ragElem)
      })

      const prevCatData = this.prev_rag_data.filter(function (elem) {
        return (elem.attributes.rag == ragElem)
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
          category: ragElem,
          quantity: current,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: ragElem + '.png'

        })
      } else {
        if (current > previous) {
          const temp_attrition = Number(previous) / Number(current) * 100
          const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
          attrition = value.replace(/['"]+/g, '')
          attrition_icon = 'icon-arrow-up'
          attrition_bg = 'text-danger'
          this.summaryCard.push({
            category: ragElem,
            quantity: current,
            attrition: attrition,
            attrition_bg: attrition_bg,
            attrition_icon: attrition_icon,
            icon: ragElem + '.png'



          })
        } else if (current < previous) {
          const temp_attrition = Number(current) / Number(previous) * 100
          const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
          attrition = value.replace(/['"]+/g, '')
          attrition_icon = 'icon-arrow-down'
          attrition_bg = 'text-success'
          this.summaryCard.push({
            category: ragElem,
            quantity: current,
            attrition: attrition,
            attrition_bg: attrition_bg,
            attrition_icon: attrition_icon,
            icon: ragElem + '.png'



          })
        } else if (current === previous) {
          attrition = "0 %"
          attrition_bg = 'text-success'
          attrition_icon = ''
          this.summaryCard.push({
            category: ragElem,
            quantity: current,
            attrition: attrition,
            attrition_bg: attrition_bg,
            attrition_icon: attrition_icon,
            icon: ragElem + '.png'



          })
        }
      }
    })


  }



  ragComparison() {

    let rag: any[] = ['Red', 'Amber', 'Green']
    let deptName: any[] = []
    let departmentName: any[] = []
    let departments: any[] = []
    this.rag_data.forEach(elem => {
      deptName.push(elem.attributes.department)
    })
    var duplicateValue = new Set(deptName);
    deptName = [...duplicateValue];

    departmentName = deptName
    departmentName.forEach(deptElem => {
      departments.push(deptElem)
    })
    ragComparisonChart.xaxis = { categories: departments }
    let chartData: any[] = []
    const category = rag
    category.forEach(catElem => {
      const data = this.rag_data.filter(function (data) {
        return (data.attributes.rag === catElem)
      })
      departmentName.forEach(elem => {
        const datas = data.filter(function (data) {
          return (data.attributes.department === elem)
        })
        const count = datas.length
        chartData.push({
          department: elem, //month
          category: catElem, //name
          count: count //data
        })
      })
    })
    let temp: any[] = []
    let temp2: any[] = []
    category.forEach(lastElem => {
      temp2 = []
      const data = chartData.filter(function (data) {
        return (data.category === lastElem)
      })
      data.forEach(elem2 => {
        temp2.push(elem2.count)
      })
      temp.push({
        name: lastElem,
        data: temp2
      })
    })
    this.ragComparisonChart.series = temp
  }

  tenureChart() {
    // let catName: any[] = []
    // const catData = this.dropdown_values.filter(function (elem) {
    //   return (elem.attributes.Category == "Tenure Split")
    // })
    // catData.forEach(cateElem=>{
    //   catName.push(cateElem.attributes.Value)
    // })
    let rag: any[] = ['Red', 'Amber', 'Green']

    let tNSplitName: any[] = []
    let tenureSplitName: any[] = []
    let tenureSplit: any[] = []
    this.rag_data.forEach(elem => {
      tNSplitName.push(elem.attributes.tenure_split)
    })
    var duplicateValue = new Set(tNSplitName);
    tNSplitName = [...duplicateValue];
    tenureSplitName = tNSplitName
    tenureSplitName.forEach(deptElem => {
      tenureSplit.push(deptElem)
    })
    overallTenureChart.xaxis = { categories: tenureSplit }
    let chartData: any[] = []
    const category = rag
    category.forEach(catElem => {
      const data = this.rag_data.filter(function (data) {
        return (data.attributes.rag === catElem)
      })
      tenureSplitName.forEach(elem => {
        const datas = data.filter(function (data) {
          return (data.attributes.tenure_split === elem)
        })
        const count = datas.length
        chartData.push({
          department: elem, //month
          category: catElem, //name
          count: count //data
        })
      })
    })
    let temp: any[] = []
    let temp2: any[] = []
    category.forEach(lastElem => {
      temp2 = []
      const data = chartData.filter(function (data) {
        return (data.category === lastElem)
      })
      data.forEach(elem2 => {
        temp2.push(elem2.count)
      })
      temp.push({
        name: lastElem,
        data: temp2
      })
    })
    this.overallTenureChart.series = temp


  }

  ragCategoryChart() {

    let rag: any[] = ['Red', 'Amber', 'Green']

    let ragCatName: any[] = []
    let ragCategoryName: any[] = []
    let ragCategory: any[] = []
    this.rag_data.forEach(elem => {
      ragCatName.push(elem.attributes.category)
    })
    var duplicateValue = new Set(ragCatName);
    ragCatName = [...duplicateValue];
    ragCategoryName = ragCatName
    ragCategoryName.forEach(deptElem => {
      ragCategory.push(deptElem)
    })
    categoryChart.xaxis = { categories: ragCategory }
    // categoryChart.yaxis = { categories: rag }

    let chartData: any[] = []
    const category = rag
    category.forEach(catElem => {
      const data = this.rag_data.filter(function (data) {
        return (data.attributes.rag === catElem)
      })
      ragCategoryName.forEach(elem => {
        const datas = data.filter(function (data) {
          return (data.attributes.category === elem)
        })
        const count = datas.length
        chartData.push({
          department: elem, //month
          category: catElem, //name
          count: count //data
        })
      })
    })
    let temp: any[] = []
    let temp2: any[] = []
    category.forEach(lastElem => {
      temp2 = []
      const data = chartData.filter(function (data) {
        return (data.category === lastElem)
      })
      data.forEach(elem2 => {
        temp2.push(elem2.count)
      })
      temp.push({
        name: lastElem,
        data: temp2
      })
    })
    this.categoryChart.series = temp

  }

  ragGenderChart() {
    let rag: any[] = ['Red', 'Amber', 'Green']
    let ragGenName: any[] = []
    let ragGenderName: any[] = []
    let ragGender: any[] = []
    this.rag_data.forEach(elem => {
      ragGenName.push(elem.attributes.gender)
    })
    var duplicateValue = new Set(ragGenName);
    ragGenName = [...duplicateValue];
    ragGenderName = ragGenName
    ragGenderName.forEach(deptElem => {
      ragGender.push(deptElem)
    })
    genderChart.xaxis = { categories: ragGender }

    let chartData: any[] = []
    const category = rag

    category.forEach(catElem => {
      const data = this.rag_data.filter(function (data) {
        return (data.attributes.rag === catElem)
      })
      ragGender.forEach(elem => {
        const datas = data.filter(function (data) {
          return (data.attributes.gender === elem)
        })
        const count = datas.length
        chartData.push({
          department: elem, //month
          category: catElem, //name
          count: count //data
        })
      })
    })

    let temp: any[] = []
    let temp2: any[] = []
    category.forEach(lastElem => {
      temp2 = []
      const data = chartData.filter(function (data) {
        return (data.category === lastElem)
      })
      data.forEach(elem2 => {
        temp2.push(elem2.count)
      })
      temp.push({
        name: lastElem,
        data: temp2
      })
    })
    this.genderChart.series = temp


  }

  ragEmployeeStatusChart() {

    let rag: any[] = ['Red', 'Amber', 'Green']
    let ragempStName: any[] = []
    let ragEmployeeStatusName: any[] = []
    let ragEmployeeStatus: any[] = []
    this.rag_data.forEach(elem => {
      ragempStName.push(elem.attributes.status)
    })
    var duplicateValue = new Set(ragempStName);
    ragempStName = [...duplicateValue];
    ragEmployeeStatusName = ragempStName
    ragEmployeeStatusName.forEach(deptElem => {
      ragEmployeeStatus.push(deptElem)
    })
    employeeStatusChart.xaxis = { categories: ragEmployeeStatus }

    let chartData: any[] = []
    const category = rag

    category.forEach(catElem => {
      const data = this.rag_data.filter(function (data) {
        return (data.attributes.rag === catElem)
      })
      ragEmployeeStatus.forEach(elem => {
        const datas = data.filter(function (data) {
          return (data.attributes.status === elem)
        })
        const count = datas.length
        chartData.push({
          department: elem, //month
          category: catElem, //name
          count: count //data
        })
      })
    })

    let temp: any[] = []
    let temp2: any[] = []
    category.forEach(lastElem => {
      temp2 = []
      const data = chartData.filter(function (data) {
        return (data.category === lastElem)
      })
      data.forEach(elem2 => {
        temp2.push(elem2.count)
      })
      temp.push({
        name: lastElem,
        data: temp2
      })
    })
    this.employeeStatusChart.series = temp

  }

  // ragStateChart() {

  //   let rag: any[] = ['Red', 'Amber', 'Green']
  //   let ragempStName: any[] = []
  //   let ragStateName: any[] = []
  //   let ragState: any[] = []
  //   this.rag_data.forEach(elem => {
  //     console.log("elem",elem)
  //     ragempStName.push(elem.attributes.state)
  //   })
  //   var duplicateValue = new Set(ragempStName);
  //   ragempStName = [...duplicateValue];
  //   ragStateName = ragempStName
  //   ragStateName.forEach(deptElem => {
  //     ragState.push(deptElem)
  //   })
  //   stateChart.xaxis = { categories: ragState }

  //   let chartData: any[] = []
  //   const category = rag

  //   category.forEach(catElem => {
  //     const data = this.rag_data.filter(function (data) {
  //       return (data.attributes.rag === catElem)
  //     })
  //     ragState.forEach(elem => {
  //       const datas = data.filter(function (data) {
  //         return (data.attributes.state === elem)
  //       })
  //       const count = datas.length
  //       chartData.push({
  //         department: elem, //month
  //         category: catElem, //name
  //         count: count //data
  //       })
  //     })
  //   })

  //   let temp: any[] = []
  //   let temp2: any[] = []
  //   category.forEach(lastElem => {
  //     temp2 = []
  //     const data = chartData.filter(function (data) {
  //       return (data.category === lastElem)
  //     })
  //     data.forEach(elem2 => {
  //       temp2.push(elem2.count)
  //     })
  //     temp.push({
  //       name: lastElem,
  //       data: temp2
  //     })
  //   })
  //   this.stateChart.series = temp
  //   console.log(this.stateChart.series)
  // }

  ragStateChart() {
  
      const selectedCountry = this.filterForm.get('country')?.value;
      const selectedState = this.filterForm.get('state')?.value;

      let filteredData = this.rag_data;

      if (!selectedCountry && selectedState) {
        filteredData = filteredData.filter(elem => elem.attributes.state === selectedState);
      } 
      else if (selectedCountry && !selectedState) {
        filteredData = filteredData.filter(elem => elem.attributes.country === selectedCountry);
      } else if (selectedCountry && selectedState) {
        filteredData = filteredData.filter(
          elem => elem.attributes.country === selectedCountry && elem.attributes.state === selectedState
        );
      }
    
      let rag: any[] = ['Red', 'Amber', 'Green'];
      let ragempStName: any[] = [];
      let ragStateName: any[] = [];
      let ragState: any[] = [];
    
      filteredData.forEach(elem => {
        ragempStName.push(elem.attributes.state);
      });

      const uniqueStates = new Set(ragempStName);
      ragStateName = [...uniqueStates];
    
      ragStateName.forEach(stateElem => {
        ragState.push(stateElem);
      });
    

      this.stateChart.xaxis = { categories: ragState };
    
      let chartData: any[] = [];
      const category = rag;
    
      category.forEach(catElem => {
        const categoryData = filteredData.filter(data => data.attributes.rag === catElem);
        ragState.forEach(stateElem => {
          const stateData = categoryData.filter(data => data.attributes.state === stateElem);
          const count = stateData.length;
    
          chartData.push({
            state: stateElem, 
            category: catElem, 
            count: count, 
          });
        });
      });
    
      let temp: any[] = [];
      category.forEach(ragCategory => {
        let dataPoints: any[] = [];
        const filteredCategoryData = chartData.filter(data => data.category === ragCategory);
        filteredCategoryData.forEach(dataElem => {
          dataPoints.push(dataElem.count);
        });
        temp.push({
          name: ragCategory,
          data: dataPoints,
        });
      });
    

      this.stateChart.series = temp;
    }
    
  

  ragAgeGroupChart() {

    let rag: any[] = ['Red', 'Amber', 'Green']
    let ragageGName: any[] = []
    let ragAgeGroupName: any[] = []
    let ragAgeGroup: any[] = []
    this.rag_data.forEach(elem => {
      ragageGName.push(elem.attributes.age_group)
    })
    var duplicateValue = new Set(ragageGName);
    ragageGName = [...duplicateValue];
    ragAgeGroupName = ragageGName
    ragAgeGroupName.forEach(deptElem => {
      ragAgeGroup.push(deptElem)
    })
    ageGroupChart.xaxis = { categories: ragAgeGroup }

    let chartData: any[] = []
    const category = rag

    category.forEach(catElem => {
      const data = this.rag_data.filter(function (data) {
        return (data.attributes.rag === catElem)
      })
      ragAgeGroup.forEach(elem => {
        const datas = data.filter(function (data) {
          return (data.attributes.age_group === elem)
        })
        const count = datas.length
        chartData.push({
          department: elem, //month
          category: catElem, //name
          count: count //data
        })
      })
    })

    let temp: any[] = []
    let temp2: any[] = []
    category.forEach(lastElem => {
      temp2 = []
      const data = chartData.filter(function (data) {
        return (data.category === lastElem)
      })
      data.forEach(elem2 => {
        temp2.push(elem2.count)
      })
      temp.push({
        name: lastElem,
        data: temp2
      })
    })
    this.ageGroupChart.series = temp


  }




}
