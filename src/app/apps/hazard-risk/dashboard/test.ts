
  orgID: string
  filterForm: FormGroup
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  divisions: any[] = []
  categories: any[] = []
  ehsData: any[] = []
  filteredEhsData: any[] = []
  previousEHSData: any[] = []
  currency:string
  latestTransaction:any[]=[]

  //cards
  divisionChart: ChartType
  statusChart: ChartType
  totalLevelChart: ChartType
  comLevelChart: ChartType
  TatChart: ChartType

  summaryCardData: any[] = []
  statusCardData: any[] = []
  riskLevelCom: any[] = []
  closedStatus: any[] = []
  categoryName: any[] = []
  control: any[] = []
  transactionData: any[] = []
  tatStatusCard: any[] = []
  risk_category_card: any[] = []
  risk_control_card: any[] = []

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private hazardService: HazardService) { }

  ngOnInit(): void {
    this.configuration()
    this.divisionChart = divisionChart
    this.statusChart = statusChart
    this.totalLevelChart = totalLevelChart
    this.comLevelChart = comLevelChart
    this.TatChart = TatChart

    this.filterForm = this.formBuilder.group({
      startDate: [''],
      endDate: [''],
      period: ['Select Period'],
      division: ['Select Division'],
      riskCategory: ['Risk Category'],
      periodVal:[''],
      divisionVal:[''],
      riskCategoryVal:['']
    })

    var curr = new Date()
    const monthStart = new Date(curr.getUTCFullYear(), curr.getMonth());
    const monthEnd = new Date();

    const monthStartDate = monthStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
      monthStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
      monthStart.toLocaleDateString("en-US", { year: 'numeric' })

    const monthEndDate = monthEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
      monthEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
      monthEnd.toLocaleDateString("en-US", { year: 'numeric' })

    sessionStorage.setItem('startDate', monthStartDate);
    sessionStorage.setItem('endDate', monthEndDate)

    this.filterForm.controls['startDate'].setValue(monthStartDate);
    this.filterForm.controls['endDate'].setValue(monthEndDate)

  }


  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.hazard_risk
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          this.currency=result.data.attributes.currency
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
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.generate_default_hrm_data()
          this.get_division()
          this.get_ehs_category()
          this.get_ehs_lates()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_ehs_lates(){
    this.hazardService.generate_ehs_latest(this.orgID).subscribe({
      next:(result:any)=>{
        this.latestTransaction = result.data
      },
      error:(err:any)=>{
        this.router.navigate(["/error/internal"])
      },
      complete:()=>{}
    })
  }

  startDateChange(event: any) {
    this.filterForm.controls['startDate'].setValue(new Date(new Date(event.value).setHours(0, 0, 0)).toISOString())
  }

  endDateChange(event: any) {
    this.filterForm.controls['endDate'].setValue(new Date(new Date(event.value).setHours(0, 0, 0)).toISOString())
  }

  division(data: any) {
    this.filterForm.controls['division'].setValue(data.target.id)
    this.filterForm.controls['divisionVal'].setValue(data.target.id)
  }

  category(data: any) {
    this.filterForm.controls['riskCategory'].setValue(data.target.id)
    this.filterForm.controls['riskCategoryVal'].setValue(data.target.id)
  }

  get_division() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        this.divisions = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_ehs_category() {





    const module = "Hazard and Risk"
    this.generalService.get_dropdown_values(module).subscribe({
      next:(result:any)=>{
        const category = result.data.filter(function (elem:any) {
          return (elem.attributes.Category === "Category")
        })
        this.categories = category
      },
      error:(err:any)=>{},
      complete:()=>{}
    })
  }

  period(data: any) {
    const period = data.target.id
    var curr = new Date;
    switch (period) {
      case "This Week":

        this.filterForm.controls['period'].setValue("This Week")
        this.filterForm.controls['periodVal'].setValue("This Week")
        var weekStart = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
        var weekEnd = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
        const WeekstartDate = weekStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
          weekStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
          weekStart.toLocaleDateString("en-US", { year: 'numeric' })
        const WeekendDate = weekEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
          weekEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
          weekEnd.toLocaleDateString("en-US", { year: 'numeric' });
        this.dateRange.controls['start'].setValue(WeekstartDate)
        this.dateRange.controls['end'].setValue(WeekendDate)
        sessionStorage.setItem('startDate', WeekstartDate)
        sessionStorage.setItem('endDate', WeekendDate)

        break;

      case "Last Week":

        this.filterForm.controls['period'].setValue("Last Week")
        this.filterForm.controls['periodVal'].setValue("Last Week")
        const lastWeekEnd = new Date(curr.setTime(curr.getTime() - (curr.getDay() ? curr.getDay() : 7) * 24 * 60 * 60 * 1000));
        const lastWeekStart = new Date(curr.setTime(curr.getTime() - 6 * 24 * 60 * 60 * 1000));
        const LastWeekstartDate = lastWeekStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
          lastWeekStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
          lastWeekStart.toLocaleDateString("en-US", { year: 'numeric' })
        const LastWeekendDate = lastWeekEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
          lastWeekEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
          lastWeekEnd.toLocaleDateString("en-US", { year: 'numeric' });
        this.dateRange.controls['start'].setValue(LastWeekstartDate)
        this.dateRange.controls['end'].setValue(LastWeekendDate)
        sessionStorage.setItem('startDate', LastWeekstartDate)
        sessionStorage.setItem('endDate', LastWeekendDate)

        break;
      case "This Month":

        this.filterForm.controls['period'].setValue("This Month")
        this.filterForm.controls['periodVal'].setValue("This Month")
        const monthStart = new Date(curr.getFullYear(), curr.getMonth());
        const monthEnd = new Date();
        const monthstartDate = monthStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
          monthStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
          monthStart.toLocaleDateString("en-US", { year: 'numeric' })
        const monthEndDate = monthEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
          monthEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
          monthEnd.toLocaleDateString("en-US", { year: 'numeric' });
        this.dateRange.controls['start'].setValue(monthstartDate)
        this.dateRange.controls['end'].setValue(monthEndDate)
        sessionStorage.setItem('startDate', monthstartDate)
        sessionStorage.setItem('endDate', monthEndDate)

        break;
      case "Last Month":

        this.filterForm.controls['period'].setValue("Last Month")
        this.filterForm.controls['periodVal'].setValue("Last Month")
        const lastMonthstart = new Date(curr.getFullYear(), curr.getMonth() - 1);
        const lastMonthEnd = new Date(curr.getFullYear(), curr.getMonth(), 0)
        const lastMonthstartDate = lastMonthstart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
          lastMonthstart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
          lastMonthstart.toLocaleDateString("en-US", { year: 'numeric' })
        const lastMonthEndDate = lastMonthEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
          lastMonthEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
          lastMonthEnd.toLocaleDateString("en-US", { year: 'numeric' });
        this.dateRange.controls['start'].setValue(lastMonthstartDate)
        this.dateRange.controls['end'].setValue(lastMonthEndDate)
        sessionStorage.setItem('startDate', lastMonthstartDate)
        sessionStorage.setItem('endDate', lastMonthEndDate)

        break;
      case "This Year":

        this.filterForm.controls['period'].setValue("This Year")
        this.filterForm.controls['periodVal'].setValue("This Year")
        const yearStart = new Date(new Date().getFullYear(), 0, 1);
        const yearEnd = new Date("12/31/" + (new Date()).getFullYear());
        const yearStartDate = yearStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
          yearStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
          yearStart.toLocaleDateString("en-US", { year: 'numeric' })
        const yearEndDate = yearEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
          yearEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
          yearEnd.toLocaleDateString("en-US", { year: 'numeric' });

        this.dateRange.controls['start'].setValue(yearStartDate)
        this.dateRange.controls['end'].setValue(yearEndDate)
        sessionStorage.setItem('startDate', yearStartDate)
        sessionStorage.setItem('endDate', yearEndDate)

        break;

      case "Last Year":

        this.filterForm.controls['period'].setValue("Last Year")
        this.filterForm.controls['periodVal'].setValue("Last Year")
        const lastYearStart = new Date(new Date().getFullYear() - 1, 0, 1)
        const lastYearEnd = new Date(new Date().getFullYear() - 1, 0, 31)
        const lastYearStartDate = lastYearStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
          lastYearStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
          lastYearStart.toLocaleDateString("en-US", { year: 'numeric' })
        const lastYearEndDate = lastYearEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
          lastYearEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
          lastYearEnd.toLocaleDateString("en-US", { year: 'numeric' });
        this.dateRange.controls['start'].setValue(lastYearStartDate)
        this.dateRange.controls['end'].setValue(lastYearEndDate)
        sessionStorage.setItem('startDate', lastYearStartDate)
        sessionStorage.setItem('endDate', lastYearEndDate)

        break;
    }
  }

  reset() {
    this.summaryCardData=[]
    this.statusCardData=[]
    this.riskLevelCom=[]
    this.risk_category_card=[]
    this.tatStatusCard=[]
    this.ngOnInit()
  }

  generate_default_hrm_data() {
    const start = new Date(this.filterForm.value.startDate)
    start.setDate(start.getDate() + 1)
    const end = new Date(this.filterForm.value.endDate)
    end.setDate(end.getDate() + 1)
    const startDate = new Date(start).toISOString()
    const endDate = new Date(end).toISOString()

    this.hazardService.generate_ehs_data(this.orgID, startDate, endDate).subscribe({
      next: (result: any) => {
        this.ehsData = result.data
        this.filteredEhsData = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        var curr = new Date()
        const lastMonthstart = new Date(curr.getFullYear(), curr.getMonth() - 1);
        lastMonthstart.setDate(lastMonthstart.getDate() + 1)
        const lastMonthEnd = new Date(curr.getFullYear(), curr.getMonth(), 0)
        lastMonthEnd.setDate(lastMonthEnd.getDate() + 1)
        const startDate = new Date(lastMonthstart).toISOString()
        const endDate = new Date(lastMonthEnd).toISOString()
        this.hazardService.generate_ehs_data(this.orgID, startDate, endDate).subscribe({
          next: (result: any) => {
            this.previousEHSData = result.data
          },
          error: (err) => { },
          complete: () => {
            this.summary_card()
            this.division_card()
            this.status_card()
            this.risk_level_card()
            this.tat_status_card()
            this.category_card()
            this.control_card()
            this.trasaction_card()
          }
        })
      }
    })
  }

  applyFilter() {
    this.summaryCardData=[]
    this.statusCardData=[]
    this.riskLevelCom=[]
    this.closedStatus=[]
    this.categoryName=[]
    this.control=[]
    this.tatStatusCard=[]
    this.risk_category_card=[]
    this.risk_control_card=[]
    this.genera_ehs_data()
  }

  genera_ehs_data() {
    const start = new Date(this.filterForm.value.startDate)
    start.setDate(start.getDate() + 1)
    const end = new Date(this.filterForm.value.endDate)
    end.setDate(end.getDate() + 1)
    const startDate = new Date(start).toISOString()
    const endDate = new Date(end).toISOString()
    this.hazardService.generate_ehs_data(this.orgID, startDate, endDate).subscribe({
      next: (result: any) => {
        this.ehsData = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.logic()
      }
    })
  }

  logic() {
    const division = this.filterForm.value.divisionVal
    const category = this.filterForm.value.riskCategoryVal
    if (division && !category) {
      this.ehs_division_data(division)
    } else if (!division && category) {
      this.ehs_category_data(category)
    } else if (division && category) {
      this.ehs_division_category_data(division, category)
    } else {
      this.filteredEhsData = this.ehsData
      this.summary_card()
      this.division_card()
      this.status_card()
      this.risk_level_card()
      this.tat_status_card()
      this.category_card()
      this.control_card()
      this.trasaction_card()
    }
  }

  ehs_division_data(division: any) {
    const data = this.ehsData.filter(function (elem) {
      return (elem.attributes.division === division)
    })
    this.filteredEhsData = data
    this.summary_card()
    this.division_card()
    this.status_card()
    this.risk_level_card()
    this.tat_status_card()
    this.category_card()
    this.control_card()
    this.trasaction_card()
  }

  ehs_category_data(category: any) {
    const data = this.ehsData.filter(function (elem) {
      return (elem.attributes.category === category)
    })
    this.filteredEhsData = data
    this.summary_card()
    this.division_card()
    this.status_card()
    this.risk_level_card()
    this.tat_status_card()
    this.category_card()
    this.control_card()
    this.trasaction_card()
  }

  ehs_division_category_data(division: any, category: any) {
    const data = this.ehsData.filter(function (elem) {
      return (elem.attributes.division === division && elem.attributes.category === category)
    })
    this.filteredEhsData = data
    this.summary_card()
    this.division_card()
    this.status_card()
    this.risk_level_card()
    this.tat_status_card()
    this.category_card()
    this.control_card()
    this.trasaction_card()
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
    //current data
    const comData = this.filteredEhsData.filter(function (elem) {
      return (elem.attributes.resolution == "Completed")
    })
    const openData = this.filteredEhsData.filter(function (elem) {
      return (elem.attributes.resolution == "Open")
    })
    const prevComData = this.previousEHSData.filter(function (elem) {
      return (elem.attributes.resolution == "Completed")
    })
    const prevOpenData = this.previousEHSData.filter(function (elem) {
      return (elem.attributes.resolution == "Open")
    })
    const totalHRM = this.filteredEhsData.length
    const comHRM = comData.length
    const pendHRM = Number(openData.length)
    const amount = this.filteredEhsData.reduce((acc, cur) => acc + Number(cur.attributes.cost), 0)
    const prevTotalHRM = this.previousEHSData.length
    const prevComHRM = prevComData.length
    const prevPendHRM = Number(prevOpenData.length)
    const prevAmount = this.previousEHSData.reduce((acc, cur) => acc + Number(cur.attributes.cost), 0)

    //total attrition
    if (totalHRM == 0) {
      totAttrition = '0%'
      totAttrition_bg = 'text-success'
    } else {
      if (totalHRM > prevTotalHRM) {
        const attrition = Number(prevTotalHRM) / Number(totalHRM) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        totAttrition = value.replace(/['"]+/g, '')
        totAttrition_icon = 'icon-arrow-up'
        totAttrition_bg = 'text-danger'
      } else if (totalHRM < prevTotalHRM) {
        const attrition = Number(totalHRM) / Number(prevTotalHRM) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        totAttrition = value.replace(/['"]+/g, '')
        totAttrition_icon = 'icon-arrow-down'
        totAttrition_bg = 'text-success'
      } else if (totalHRM == prevTotalHRM) {
        totAttrition = '0%'
        totAttrition_bg = 'text-success'
      }
    }

    //completed attrition
    if (comHRM == 0) {
      comAttrition = '0%'
      comAttrition_bg = 'text-success'
    } else {
      if (comHRM > prevComHRM) {
        const attrition = Number(prevComHRM) / Number(comHRM) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        comAttrition = value.replace(/['"]+/g, '')
        comAttrition_icon = 'icon-arrow-up'
        comAttrition_bg = 'text-success'
      } else if (comHRM < prevComHRM) {
        const attrition = Number(comHRM) / Number(prevComHRM) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        comAttrition = value.replace(/['"]+/g, '')
        comAttrition_icon = 'icon-arrow-down'
        comAttrition_bg = 'text-danger'
      } else if (comHRM == prevComHRM) {
        comAttrition = '0%'
        comAttrition_bg = 'text-success'
      }
    }



    //pending attrition
    if (pendHRM == 0) {
      penAttrition = '0%'
      penAttrition_bg = 'text-success'
    } else {
      if (pendHRM > prevPendHRM) {
        const attrition = Number(prevPendHRM) / Number(pendHRM) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        penAttrition = value.replace(/['"]+/g, '')
        penAttrition_icon = 'icon-arrow-up'
        penAttrition_bg = 'text-danger'
      } else if (pendHRM < prevPendHRM) {
        const attrition = Number(pendHRM) / Number(prevPendHRM) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        penAttrition = value.replace(/['"]+/g, '')
        penAttrition_icon = 'icon-arrow-down'
        penAttrition_bg = 'text-success'
      } else if (pendHRM == prevPendHRM) {
        penAttrition = '0%'
        penAttrition_bg = 'text-success'
      }
    }

    //amount attrition
    if (amount == 0) {
      amtAttrition = '0%'
      amtAttrition_bg = 'text-success'
    } else {
      if (amount > prevAmount) {
        const attrition = Number(prevAmount) / Number(amount) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        amtAttrition = value.replace(/['"]+/g, '')
        amtAttrition_icon = 'icon-arrow-up'
        amtAttrition_bg = 'text-danger'
      } else if (amount < prevAmount) {
        const attrition = Number(amount) / Number(prevAmount) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        amtAttrition = value.replace(/['"]+/g, '')
        amtAttrition_icon = 'icon-arrow-down'
        amtAttrition_bg = 'text-success'
      } else if (amount == prevAmount) {
        amtAttrition = '0%'
        amtAttrition_bg = 'text-success'
      }
    }

    this.summaryCardData.push(
      {
        "title": "Total",
        "icon": "list",
        "value": totalHRM,
        "attrition": totAttrition,
        "attri_icon": totAttrition_icon,
        "attri_bg": totAttrition_bg
      },
      {
        "title": "Completed",
        "icon": "check_circle",
        "value": comHRM,
        "attrition": comAttrition,
        "attri_icon": comAttrition_icon,
        "attri_bg": comAttrition_bg

      },
      {
        "title": "Pending",
        "icon": "sell",
        "value": pendHRM,
        "attrition": penAttrition,
        "attri_icon": penAttrition_icon,
        "attri_bg": penAttrition_bg

      },
      {
        "title": "Amount",
        "icon": "account_balance_wallet",
        "value": this.currency+' '+amount,
        "attrition": amtAttrition,
        "attri_icon": amtAttrition_icon,
        "attri_bg": amtAttrition_bg

      }
    )
  }

  //division card
  division_card() {
    let diviName: any[] = []
    let divisionName: any[] = []
    this.filteredEhsData.forEach(elem => {
      diviName.push(elem.attributes.division)
    })
    var duplicateValue = new Set(diviName);
    diviName = [...duplicateValue];
    divisionName = diviName
    let division: any[] = []
    let highValue: any[] = []
    let mediumValue: any[] = []
    let lowValue: any[] = []
    divisionName.forEach(elem => {
      division.push(elem)
      const high = this.filteredEhsData.filter(function (data) {
        return (data.attributes.division == elem && data.attributes.level === "High")
      })
      highValue.push(Number(high.length))
      const medium = this.filteredEhsData.filter(function (data) {
        return (data.attributes.division == elem && data.attributes.level === "Medium")
      })
      mediumValue.push(Number(medium.length))
      const low = this.filteredEhsData.filter(function (data) {
        return (data.attributes.division == elem && data.attributes.level === "Low")
      })
      lowValue.push(Number(low.length))
    })
    this.divisionChart = {
      series: [
        {
          name: "High",
          data: highValue
        },
        {
          name: "Medium",
          data: mediumValue
        },
        {
          name: "Low",
          data: lowValue
        }
      ],
      colors: ['#FF1744', '#CCCC00', '#34c38f'],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          columnWidth: "55%",
          endingShape: "rounded"
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
          text: "$ (thousands)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val;
          }
        }
      }
    };
  }

  //status card
  status_card() {
    let Attrition = ''
    const total = this.filteredEhsData.length
    //current data
    const comData = this.filteredEhsData.filter(function (elem) {
      return (elem.attributes.resolution == "Completed")
    })
    //previous data
    const prevComData = this.previousEHSData.filter(function (elem) {
      return (elem.attributes.resolution == "Completed")
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
      } else if (completed < prevCompleted) {
        const attrition = Number(completed) / Number(prevCompleted) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        Attrition = value.replace(/['"]+/g, '')
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
          'prevMonthCom': prevCompleted
        }
      )

    } else {
      this.statusCardData.push(
        {
          'completed': completed,
          'comPercentage': 0,
          'attrition': 0,
          'prevMonthCom': prevCompleted
        }
      )
    }
  }

  risk_level_card() {
    const total = this.filteredEhsData.length
    //high level
    let Attrition = ''
    let AttritionIcon = ''
    let highComperncetage = ''
    let highTotperncetage = ''
    const data = this.filteredEhsData.filter(function (elem) {
      return (elem.attributes.level == "High")
    })
    const totHighPerc = Number(Number(data.length) / Number(total) * 100).toFixed(0)
    if (Number(totHighPerc) > 0) {
      highTotperncetage = totHighPerc
    } else {
      highTotperncetage = '0'
    }
    const comdData = this.filteredEhsData.filter(function (elem) {
      return (elem.attributes.level === "High" && elem.attributes.resolution === "Completed")
    })
    const comHighPerc = Number(Number(comdData.length) / Number(data.length) * 100).toFixed(0)
    if (Number(comHighPerc) > 0) {
      highComperncetage = comHighPerc
    } else {
      highComperncetage = '0'
    }
    const prevData = this.previousEHSData.filter(function (elem) {
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
    const mediumData = this.filteredEhsData.filter(function (elem) {
      return (elem.attributes.level == "Medium")
    })
    const mediumTotHighPerc = Number(Number(mediumData.length) / Number(total) * 100).toFixed(0)
    if (Number(mediumTotHighPerc) > 0) {
      mediumTotperncetage = mediumTotHighPerc
    } else {
      mediumTotperncetage = '0'
    }
    const mediumComdData = this.filteredEhsData.filter(function (elem) {
      return (elem.attributes.level === "Medium" && elem.attributes.resolution === "Completed")
    })
    const mediumComHighPerc = Number(Number(mediumComdData.length) / Number(mediumData.length) * 100).toFixed(0)
    if (Number(mediumComHighPerc) > 0) {
      mediumComperncetage = mediumComHighPerc
    } else {
      mediumComperncetage = '0'
    }
    const mediumPrevData = this.previousEHSData.filter(function (elem) {
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
    const lowData = this.filteredEhsData.filter(function (elem) {
      return (elem.attributes.level == "Low")
    })
    const lowTotHighPerc = Number(Number(lowData.length) / Number(total) * 100).toFixed(0)
    if (Number(lowTotHighPerc) > 0) {
      lowTotperncetage = lowTotHighPerc
    } else {
      lowTotperncetage = '0'
    }
    const lowComdData = this.filteredEhsData.filter(function (elem) {
      return (elem.attributes.level === "Low" && elem.attributes.resolution === "Completed")
    })
    const lowComHighPerc = Number(Number(lowComdData.length) / Number(lowData.length) * 100).toFixed(0)
    if (Number(lowComHighPerc) > 0) {
      lowComperncetage = lowComHighPerc
    } else {
      lowComperncetage = '0'
    }
    const lowPrevData = this.previousEHSData.filter(function (elem) {
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

    this.riskLevelCom.push(
      {
        'title': "High Level Cases",
        'total': Number(highLevel),
        'attrition': Attrition,
        'attritionIcon': AttritionIcon,
        'currTotal': Number(highTotperncetage),
        'currComp': Number(highComperncetage),
      },
      {
        'title': "Medium Level Cases",
        'total': Number(mediumLevel),
        'attrition': mediumAttrition,
        'attritionIcon': mediumAttritionIcon,
        'currTotal': Number(mediumTotperncetage),
        'currComp': Number(mediumComperncetage),
      },
      {
        'title': "Low Level Cases",
        'total': Number(lowLevel),
        'attrition': lowAttrition,
        'attritionIcon': lowAttritionIcon,
        'currTotal': Number(lowTotperncetage),
        'currComp': Number(lowComperncetage),
      }
    )
  }

  tat_status_card() {
    let tatStatus = ['On Time', 'Delayed', 'Pending']
    let value: any[] = []
    const total = this.filteredEhsData.length
    const totalCom = this.filteredEhsData.filter(function (data) {
      return (data.attributes.resolution == "Completed")
    })
    const onTime = this.filteredEhsData.filter(function (data) {
      return (data.attributes.resolution == "Completed" && data.attributes.tat_status === "On-Time")
    })
    const onTimePercentage = (Number(onTime.length) / Number(totalCom.length) * 100).toFixed(0)
    if (Number(onTimePercentage) > 0) {
      value.push(onTimePercentage)
    } else {
      value.push(0)
    }
    const delayed = this.filteredEhsData.filter(function (data) {
      return (data.attributes.resolution == "Completed" && data.attributes.tat_status === "Delayed")
    })
    const delayedPercentage = (Number(delayed.length) / Number(totalCom.length) * 100).toFixed(0)
    if (Number(delayedPercentage) > 0) {
      value.push(delayedPercentage)
    } else {
      value.push(0)
    }
    const pendingData = this.filteredEhsData.filter(function (data) {
      return (data.attributes.tat_status == "Pending")
    })
    const pending = Number(pendingData.length)
    const pendingPercentage = (Number(pending) / Number(total) * 100).toFixed(0)
    if (Number(pendingPercentage) > 0) {
      value.push(pendingPercentage)
    } else {
      value.push(0)
    }
    this.tatStatusCard.push(
      {
        "title": "Pending",
        "count": pending
      },
      {
        "title": "On-Time",
        "count": onTime.length
      },
      {
        "title": "Delayed",
        "count": delayed.length
      },
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

  category_card() {
    let categoryName: any[] = []
    let category: any[] = []
    this.filteredEhsData.forEach(elem => {
      categoryName.push(elem.attributes.category)
    })
    var duplicateValue = new Set(categoryName);
    categoryName = [...duplicateValue];
    category = categoryName
    const total = this.filteredEhsData.length
    category.forEach(category => {
      const data = this.filteredEhsData.filter(function (data) {
        return (data.attributes.category == category)
      })
      const percentage = Number(Number(data.length) / Number(total) * 100).toFixed(0)
      this.risk_category_card.push(
        {
          'category': category,
          'count': data.length,
          'percentage': percentage
        }
      )
    })
  }

  control_card() {
    let controlName: any[] = []
    let control: any[] = []
    const completed = this.filteredEhsData.filter(function (data) {
      return (data.attributes.resolution == "Completed")
    })
    completed.forEach(elem => {
      controlName.push(elem.attributes.control)
    })
    var duplicateValue = new Set(controlName);
    controlName = [...duplicateValue];
    control = controlName
    control.forEach(control => {
      const data = this.filteredEhsData.filter(function (data) {
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

  trasaction_card() {
    const size = 5
    this.transactionData = this.latestTransaction.slice(0, size)
  }