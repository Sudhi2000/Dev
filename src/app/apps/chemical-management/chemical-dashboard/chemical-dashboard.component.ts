import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { ChartType, chemicalUsageCard, msdsChemical, radialChart } from './chart-model';
import * as moment from 'moment';
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
  selector: 'app-chemical-dashboard',
  templateUrl: './chemical-dashboard.component.html',
  styleUrls: ['./chemical-dashboard.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChemicalDashboardComponent implements OnInit {

  filterForm: FormGroup
  years: any[] = []
  divisions: any[] = []
  dateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  filterDateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  yearRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  prevDateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  orgID: any
  dropDownValue: any[] = []
  summaryCard: any[] = []
  amountCard: any[] = []
  inventory_data: any[] = []
  previous_inventory_data: any[] = []
  previous_transactions: any[] = []
  transactions: any[] = []
  stockData: any
  msdsCardChart: ChartType
  ChemicalUsageCard: ChartType
  radialChart: ChartType
  msdsCard: any[] = []
  currency: any
  year_inventory_data: any[] = []
  year_transaction_data: any[] = []
  chemicalName: any[] = []
  topIssuedCard: any[] = []
  latestInventory: any[] = []
  stockCard: any[] = []
  supplierNames: any[] = []
  top_supplier_card: any[] = []
  departments: any[] = []
  top_department_card: any[] = []
  positive_list: any[] = []
  positive_list_card: any = []
  category_classification_card: any[]
  latestTransactions: any[] = []
  chemical_expiry_list_card: any[] = []
  certificate_expiry_list_card: any[] = []
  unitSpecific: any
  userDivision: any
  corporateUser: any

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private chemicalService: ChemicalService,
    private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    this.showProgressPopup()
    this.msdsCardChart = msdsChemical
    this.ChemicalUsageCard = chemicalUsageCard
    this.radialChart = radialChart

    this.msdsCard.push({
      quantity: "0",
      Attrition_icon: 'icon-arrow-down',
      Attrition: "0 %",
      Attrition_bg: 'text-success'
    })
    this.configuration()
    this.filterForm = this.formBuilder.group({
      division: [''],
      start: [''],
      end: [''],
      year: [],
      chemical_count: ['']
    })

    var d = new Date(new Date().getFullYear(), 0, 2).toISOString();
    var end = new Date(new Date().getFullYear(), 12).toISOString();
    const startDate = new Date(d).toISOString()
    const endDate = new Date(end).toISOString()
    this.filterDateRange.controls['start'].setValue(startDate)
    this.filterDateRange.controls['end'].setValue(endDate)
    this.filterForm.controls['start'].setValue(startDate)
    this.filterForm.controls['end'].setValue(endDate)
    var curr = new Date()

    const lastMonthstart = new Date(curr.getFullYear(), curr.getMonth() - 1);
    lastMonthstart.setDate(lastMonthstart.getDate())
    const lastMonthEnd = new Date(curr.getFullYear(), curr.getMonth(), 0)
    lastMonthEnd.setDate(lastMonthEnd.getDate())
    this.prevDateRange.controls['start'].setValue(new Date(lastMonthstart))
    this.prevDateRange.controls['end'].setValue(new Date(lastMonthEnd))





  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.chemical
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          this.currency = result.data.attributes.currency

          this.years = result.data.attributes.Year
          // const year = (new Date().getFullYear()).toString()
          // this.filterForm.controls['year'].setValue(year)
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
        const status = result.chem_dashboard
        if (status === false || status === null) {
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
    const module = "Chemical Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValue = result.data

      },
      error: (err: any) => { },
      complete: () => {
        this.chemical_name()


      }
    })
  }

  chemical_name() {
    this.chemicalService.get_chemical_name().subscribe({
      next: (result: any) => {
        this.chemicalName = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.supplier_names()

      }
    })
  }

  supplier_names() {
    this.chemicalService.get_supplier_name().subscribe({
      next: (result: any) => {
        this.supplierNames = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.department_names()

      }
    })
  }

  department_names() {
    this.chemicalService.get_chemical_department().subscribe({
      next: (result: any) => {
        this.departments = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.positive_lists()

      }
    })
  }

  positive_lists() {
    this.chemicalService.get_positive_list().subscribe({
      next: (result: any) => {
        this.positive_list = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.initialData()

      }
    })
  }

  filterThreshold(value: any) {
    return value.category === "Threshold"
  }

  filterQuantity(value: any) {
    return value.category === "Balance"
  }

  filterMSDS(value: any) {
    return value.category === "msds"
  }

  filterHazard(value: any) {
    return value.category === "Hazard"
  }

  filterGHS(value: any) {
    return value.category === "GHS"
  }

  filterZDHC(value: any) {
    return value.category === "ZDHC"
  }

  startDateChange(date: any) {
    this.filterForm.controls['year'].reset()
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.filterForm.controls['start'].setValue(selecteddate)
    this.filterDateRange.controls['start'].setValue(selecteddate)
  }

  endDateChange(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.filterForm.controls['end'].setValue(selecteddate)
    this.filterDateRange.controls['end'].setValue(selecteddate)

  }

  yearVal(data: any) {
    this.dateRange.reset()
    const startDate = (moment().set({ 'year': this.filterForm.value.year, 'month': 0, 'date': 1 })).format('yyyy-MM-DD')
    const endDate = (moment().set({ 'year': this.filterForm.value.year, 'month': 11, 'date': 31 })).format('yyyy-MM-DD')
    this.filterDateRange.controls['start'].setValue(startDate)
    this.filterDateRange.controls['end'].setValue(endDate)
    this.filterForm.controls['start'].setValue(startDate)
    this.filterForm.controls['end'].setValue(endDate)
  }

  initialData() {

    this.get_inventory_transaction_data()
    this.get_inventory_count()




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
  get_inventory_transaction_data() {

    const startDate = new Date(this.filterDateRange.value.start).toISOString()
    const endDate = new Date(this.filterDateRange.value.end).toISOString()

    const prevStartDate = new Date(this.prevDateRange.value.start).toISOString()
    const prevEndDate = new Date(this.prevDateRange.value.end).toISOString()

    this.chemicalService.get_chemical_inventory_dash(startDate, endDate, this.userDivision).subscribe({
      next: (inventoryData: any) => {
        this.chemicalService.get_chemical_transaction_dash(startDate, endDate, this.userDivision).subscribe({
          next: (transactionData: any) => {
            this.chemicalService.get_chemical_inventory_dash(prevStartDate, prevEndDate, this.userDivision).subscribe({
              next: (inventoryDataPrevious: any) => {
                this.chemicalService.get_chemical_transaction_dash(prevStartDate, prevEndDate, this.userDivision).subscribe({
                  next: (transactionDataPrevious: any) => {
                    this.inventory_data = inventoryData.data
                    this.transactions = transactionData.data
                    this.previous_inventory_data = inventoryDataPrevious.data
                    this.previous_transactions = transactionDataPrevious.data
                  },
                  error: (err: any) => { },
                  complete: () => {
                    this.summary_card()
                    this.chemical_usage_card()
                    this.top_issued_chemicals()
                    this.latest_inventory()
                    this.latest_transactions()
                    this.stock()
                    this.others()
                    this.category_classification()
                  }
                })
              },
              error: (err: any) => { },
              complete: () => {

              }
            })



          },
          error: (err: any) => { },
          complete: () => {
          }
        })
      },
      error: (err: any) => { },
      complete: () => { }
    })

  }

  // get_inventory_count() {
  //   const startDate = new Date(this.filterDateRange.value.start).toISOString()
  //   const endDate = new Date(this.filterDateRange.value.end).toISOString()
  //   console.log("userdivision",this.userDivision);
  //   console.log("start",startDate);
  //   console.log("end",endDate);
    
  //   if (this.filterForm.value.division) {
  //     this.chemicalService.chemical_inventory_count_division(this.filterForm.value.division).subscribe({
  //       next: (result: any) => {

  //       console.log("hloo")
  //         this.filterForm.controls['chemical_count'].setValue(result)
  //       },
  //       error: (err: any) => { },
  //       complete: () => {
  //         this.msds_card()
  //         Swal.close()
  //       }
  //     })
  //   }
  //   else {
  //     this.chemicalService.chemical_inventory_count(this.userDivision).subscribe({
  //       next: (result: any) => {
  //        console.log("hiii")
  //         this.filterForm.controls['chemical_count'].setValue(result)
  //       },
  //       error: (err: any) => { },
  //       complete: () => {
  //         this.msds_card()
  //         Swal.close()
  //       }
  //     })
  //   }

  // }

get_inventory_count() {
  const startdaate = this.filterForm.value.start;
  const enddaate = this.filterForm.value.end;
  const startDate = startdaate ? new Date(startdaate).toISOString().split('T')[0] : null;
  const endDate = enddaate ? new Date(enddaate).toISOString().split('T')[0] : null;
  const division = this.filterForm.value.division;
  const Year = this.filterForm.value.year;

  if (startDate && endDate && division) {
      // Case 1: startDate, endDate, and division are present
      this.chemicalService.chemical_inventory_count_startend_division(startDate, endDate, division).subscribe({
          next: (result: any) => {
              this.filterForm.controls['chemical_count'].setValue(result);
          },
          complete: () => {
              this.msds_card();
              Swal.close();
          }
      });
  } else if (startDate && endDate && !division && startDate !== null && endDate !== null) {
      //  Case 2 should execute only if startDate & endDate are VALID
      this.chemicalService.chemical_inventory_count_start_date_end_date(startDate, endDate).subscribe({
          next: (result: any) => {
              this.filterForm.controls['chemical_count'].setValue(result);
          },
          complete: () => {
              this.msds_card();
              Swal.close();
          }
      });
  } else if (!startDate && !endDate && division) {
      // Case 3: No startDate, No endDate, but division present
      this.chemicalService.chemical_inventory_count_division_only(division).subscribe({
          next: (result: any) => {
              this.filterForm.controls['chemical_count'].setValue(result);
          },
          complete: () => {
              this.msds_card();
              Swal.close();
          }
      });
  } 
   else {
      //  Default case should execute if no valid condition matches
      this.chemicalService.chemical_inventory_count(this.userDivision).subscribe({
          next: (result: any) => {
              this.filterForm.controls['chemical_count'].setValue(result);
          },
          complete: () => {
              this.msds_card();
              Swal.close();
          }
      });
  }
}



  search() {
    this.showProgressPopup()
    const startDate = new Date(this.filterDateRange.value.start).toISOString()
    const endDate = new Date(this.filterDateRange.value.end).toISOString()
    const division = this.filterForm.value.division

    if (this.filterForm.value.year || this.filterForm.value.division) {

      if (startDate && endDate && !division) {
        this.chemicalService.get_chemical_inventory_dash(startDate, endDate, this.userDivision).subscribe({
          next: (inventoryData: any) => {
            this.chemicalService.get_chemical_transaction_dash(startDate, endDate, this.userDivision).subscribe({
              next: (transactionData: any) => {
                this.inventory_data = inventoryData.data
                this.transactions = transactionData.data
              },
              error: (err: any) => { },
              complete: () => {
                this.summary_card()
                this.chemical_usage_card()
                this.top_issued_chemicals()
                this.stock()
                this.others()
                this.category_classification()
                this.get_inventory_count()
                this.latest_transactions()
                this.latest_inventory()
              }
            })
          },
          error: (err: any) => { },
          complete: () => {
            Swal.close()
          }
        })

      } else if (startDate && endDate && division) {
        this.chemicalService.get_chemical_inventory_dash_div(startDate, endDate, division).subscribe({
          next: (inventoryData: any) => {
            this.chemicalService.get_chemical_transaction_dash_div(startDate, endDate, division).subscribe({
              next: (transactionData: any) => {
                this.inventory_data = inventoryData.data
                this.transactions = transactionData.data
              },
              error: (err: any) => { },
              complete: () => {
                this.summary_card()
                this.chemical_usage_card()
                this.top_issued_chemicals()
                this.stock()
                this.others()
                this.category_classification()
                this.get_inventory_count()
                this.latest_transactions()
                this.latest_inventory()

              }
            })
          },
          error: (err: any) => { },
          complete: () => {
            Swal.close()
          }
        })

      }

    } else {

      if (startDate && endDate && !division) {
        this.chemicalService.get_chemical_inventory_dash(startDate, endDate, this.userDivision).subscribe({
          next: (inventoryData: any) => {
            this.chemicalService.get_chemical_transaction_dash(startDate, endDate, this.userDivision).subscribe({
              next: (transactionData: any) => {
                this.inventory_data = inventoryData.data
                this.transactions = transactionData.data

              },
              error: (err: any) => { },
              complete: () => {
                this.summary_card()
                this.top_issued_chemicals()
                this.stock()
                this.others()
                this.category_classification()
                this.get_inventory_count()
                this.chemical_usage_card()
                this.latest_transactions()
                this.latest_inventory()
              }
            })
          },
          error: (err: any) => { },
          complete: () => { Swal.close() }
        })

      } else if (startDate && endDate && division) {
        this.chemicalService.get_chemical_inventory_dash_div(startDate, endDate, division).subscribe({
          next: (inventoryData: any) => {
            this.chemicalService.get_chemical_transaction_dash_div(startDate, endDate, division).subscribe({
              next: (transactionData: any) => {
                this.inventory_data = inventoryData.data
                this.transactions = transactionData.data
              },
              error: (err: any) => { },
              complete: () => {
                this.summary_card()
                this.top_issued_chemicals()
                this.stock()
                this.others()
                this.category_classification()
                this.get_inventory_count()
                this.chemical_usage_card()
                this.latest_transactions()
                this.latest_inventory()
              }
            })
          },
          error: (err: any) => { },
          complete: () => { Swal.close() }
        })

      }

    }


  }

  reset() {
    this.prevDateRange.reset()
    this.dateRange.reset()
    this.filterDateRange.reset()
    this.filterForm.reset()
    this.ngOnInit()

  }


  //####### cards logic
  summary_card() {
    this.summaryCard = []

    if (this.filterDateRange.value.start && this.filterDateRange.value.end) {
      this.delivered_card_data(this.inventory_data)
      this.issued_card_data(this.transactions)
      this.inStock_card_data(this.inventory_data)
      this.amount_card_data(this.inventory_data)
      this.issued_amount_card_data(this.transactions)


    } else {
      const d = new Date();
      const month = d.getMonth()
      const inventoryData = this.inventory_data.filter(function (elem) {
        return (moment(elem.attributes.delivery_date).month() == month)
      })

      const transactionData = this.transactions.filter(function (elem) {
        return (moment(elem.attributes.transaction_date).month() == month)
      })
      this.delivered_card_data(inventoryData)
      this.issued_card_data(transactionData)
      this.inStock_card_data(inventoryData)
      this.amount_card_data(inventoryData)
      this.issued_amount_card_data(transactionData)
    }

  }

  delivered_card_data(data: any) {
    const delivered = Number(data.reduce((acc: any, cur: any) => acc + Number(cur.attributes.delivered_quantity), 0))
    const previousDelivered = Number(this.previous_inventory_data.reduce((acc, cur) => acc + Number(cur.attributes.delivered_quantity), 0))

    let attrition: any = ''
    let attrition_bg: any = ''
    let attrition_icon: any = ''
    if (delivered === 0) {
      attrition = "0 %"
      attrition_bg = 'text-success'
      attrition_icon = ''
      this.summaryCard.push({
        category: 'Delivered',
        quantity: delivered,
        attrition: attrition,
        attrition_bg: attrition_bg,
        attrition_icon: attrition_icon,
        icon: "box.png"
      })
    } else {
      if (delivered > previousDelivered) {
        const temp_attrition = Number(previousDelivered) / Number(delivered) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-up'
        attrition_bg = 'text-danger'
        this.summaryCard.push({
          category: 'Delivered',
          quantity: delivered,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: "box.png"

        })
      } else if (delivered < previousDelivered) {
        const temp_attrition = Number(delivered) / Number(previousDelivered) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-down'
        attrition_bg = 'text-success'
        this.summaryCard.push({
          category: 'Delivered',
          quantity: delivered,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: "box.png"

        })
      } else if (delivered === previousDelivered) {
        attrition = "0 %"
        attrition_bg = 'text-success'
        attrition_icon = ''
        this.summaryCard.push({
          category: 'Delivered',
          quantity: delivered,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: "box.png"

        })
      }
    }


  }

  issued_card_data(data: any) {
    const issued = Number(data.reduce((acc: any, cur: any) => acc + Number(cur.attributes.issued_quantity), 0))
    const previousIssued = Number(this.previous_transactions.reduce((acc, cur) => acc + Number(cur.attributes.issued_quantity), 0))

    let attrition: any = ''
    let attrition_bg: any = ''
    let attrition_icon: any = ''
    if (issued === 0) {
      attrition = "0 %"
      attrition_bg = 'text-success'
      attrition_icon = ''
      this.summaryCard.push({
        category: 'Issued',
        quantity: issued,
        attrition: attrition,
        attrition_bg: attrition_bg,
        attrition_icon: attrition_icon,
        icon: "issued.png"
      })
    } else {
      if (issued > previousIssued) {
        const temp_attrition = Number(previousIssued) / Number(issued) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-up'
        attrition_bg = 'text-danger'
        this.summaryCard.push({
          category: 'Issued',
          quantity: issued,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: "issued.png"
        })
      } else if (issued < previousIssued) {
        const temp_attrition = Number(issued) / Number(previousIssued) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-down'
        attrition_bg = 'text-success'
        this.summaryCard.push({
          category: 'Issued',
          quantity: issued,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: "issued.png"
        })
      } else if (issued === previousIssued) {
        attrition = "0 %"
        attrition_bg = 'text-success'
        attrition_icon = ''
        this.summaryCard.push({
          category: 'Issued',
          quantity: issued,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: "issued.png"
        })
      }
    }


  }

  inStock_card_data(data: any) {
    const balance = Number(data.reduce((acc: any, cur: any) => acc + Number(cur.attributes.balance), 0))
    const previousBalance = Number(this.previous_inventory_data.reduce((acc, cur) => acc + Number(cur.attributes.balance), 0))
    let attrition: any = ''
    let attrition_bg: any = ''
    let attrition_icon: any = ''
    if (balance === 0) {
      attrition = "0 %"
      attrition_bg = 'text-success'
      attrition_icon = ''
      this.summaryCard.push({
        category: 'Balance',
        quantity: balance,
        attrition: attrition,
        attrition_bg: attrition_bg,
        attrition_icon: attrition_icon,
        icon: 'balance.png'
      })
    } else {
      if (balance > previousBalance) {
        const temp_attrition = Number(previousBalance) / Number(balance) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-up'
        attrition_bg = 'text-danger'
        this.summaryCard.push({
          category: 'Balance',
          quantity: balance,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'balance.png'
        })
      } else if (balance < previousBalance) {
        const temp_attrition = Number(balance) / Number(previousBalance) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-down'
        attrition_bg = 'text-success'
        this.summaryCard.push({
          category: 'Balance',
          quantity: balance,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'balance.png'
        })
      } else if (balance === previousBalance) {
        attrition = "0 %"
        attrition_bg = 'text-success'
        attrition_icon = ''
        this.summaryCard.push({
          category: 'Balance',
          quantity: balance,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'balance.png'
        })
      }
    }

  }

  amount_card_data(data: any) {
    const amount = Number(data.reduce((acc: any, cur: any) => acc + Number(cur.attributes.purchased_amount), 0))
    const previousAmount = Number(this.previous_inventory_data.reduce((acc, cur) => acc + Number(cur.attributes.purchased_amount), 0))

    const amountVal = this.currencyPipe.transform(amount, this.currency);

    let attrition: any = ''
    let attrition_bg: any = ''
    let attrition_icon: any = ''
    if (amount === 0) {
      attrition = "0 %"
      attrition_bg = 'text-success'
      attrition_icon = ''
      this.summaryCard.push({
        category: 'Amount',
        quantity: amountVal,
        attrition: attrition,
        attrition_bg: attrition_bg,
        attrition_icon: attrition_icon,
        icon: 'amount.png'
      })
    } else {
      if (amount > previousAmount) {
        const temp_attrition = Number(previousAmount) / Number(amount) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-up'
        attrition_bg = 'text-danger'
        this.summaryCard.push({
          category: 'Amount',
          quantity: amountVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'amount.png'
        })
      } else if (amount < previousAmount) {
        const temp_attrition = Number(amount) / Number(previousAmount) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-down'
        attrition_bg = 'text-success'
        this.summaryCard.push({
          category: 'Amount',
          quantity: amountVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'amount.png'
        })
      } else if (amount === previousAmount) {
        attrition = "0 %"
        attrition_bg = 'text-success'
        attrition_icon = ''
        this.summaryCard.push({
          category: 'Amount',
          quantity: amountVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'amount.png'
        })
      }
    }


  }

  issued_amount_card_data(data: any) {
    const amount = Number(data.reduce((acc: any, cur: any) => acc + Number(cur.attributes.cost), 0))
    const previousAmount = Number(this.previous_transactions.reduce((acc, cur) => acc + Number(cur.attributes.cost), 0))
    const amountVal = this.currencyPipe.transform(amount, this.currency);

    let attrition: any = ''
    let attrition_bg: any = ''
    let attrition_icon: any = ''
    if (amount === 0) {
      attrition = "0 %"
      attrition_bg = 'text-success'
      attrition_icon = ''
      this.summaryCard.push({
        category: 'Issued Amount',
        quantity: amountVal,
        attrition: attrition,
        attrition_bg: attrition_bg,
        attrition_icon: attrition_icon,
        icon: 'amount.png'
      })
    } else {
      if (amount > previousAmount) {
        const temp_attrition = Number(previousAmount) / Number(amount) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-up'
        attrition_bg = 'text-danger'
        this.summaryCard.push({
          category: 'Issued Amount',
          quantity: amountVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'amount.png'
        })
      } else if (amount < previousAmount) {
        const temp_attrition = Number(amount) / Number(previousAmount) * 100
        const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
        attrition = value.replace(/['"]+/g, '')
        attrition_icon = 'icon-arrow-down'
        attrition_bg = 'text-success'
        this.summaryCard.push({
          category: 'Issued Amount',
          quantity: amountVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'amount.png'
        })
      } else if (amount === previousAmount) {
        attrition = "0 %"
        attrition_bg = 'text-success'
        attrition_icon = ''
        this.summaryCard.push({
          category: 'Issued Amount',
          quantity: amountVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: 'amount.png'
        })
      }
    }

  }

  // msds_card() {
  //   const total = this.filterForm.value.chemical_count
  //   if (this.filterForm.value.division) {
  //     this.chemicalService.get_valid_msds_division_count(this.filterForm.value.division).subscribe({
  //       next: (count: any) => {

  //         this.msdsCard = []
  //         let percentage = '0'
  //         if (count > 0) {
  //           percentage = Math.round(count / total * 100).toFixed(0)
  //         }
  //         this.msdsCardChart.series = [percentage]
  //         if (count === 0) {
  //           this.msdsCard.push({
  //             quantity: 0,
  //             Attrition: '0%',
  //             Attrition_bg: 'text-success'
  //           })
  //         } else {
  //           if (count > total) {
  //             const attrition = Number(total) / Number(count) * 100
  //             const value = JSON.stringify(attrition.toFixed(0) + ' %')
  //             this.msdsCard.push({
  //               quantity: count,
  //               Attrition_icon: 'icon-arrow-up',
  //               Attrition: value.replace(/['"]+/g, ''),
  //               Attrition_bg: 'text-danger'
  //             })
  //           } else if (count < total) {
  //             const attrition = Number(count) / Number(total) * 100
  //             const value = JSON.stringify(attrition.toFixed(0) + ' %')
  //             this.msdsCard.push({
  //               quantity: count,
  //               Attrition_icon: 'icon-arrow-down',
  //               Attrition: value.replace(/['"]+/g, ''),
  //               Attrition_bg: 'text-success'
  //             })
  //           } else if (count === total) {
  //             this.msdsCard.push({
  //               quantity: count,
  //               Attrition: '0%',
  //               Attrition_bg: 'text-success'
  //             })
  //           }
  //         }
  //       },
  //       error: (err: any) => { },
  //       complete: () => { }
  //     })
  //   }
  //   else {
  //     this.chemicalService.get_valid_msds_count(this.userDivision).subscribe({
  //       next: (count: any) => {

  //         this.msdsCard = []
  //         let percentage = '0'
  //         if (count > 0) {
  //           percentage = Math.round(count / total * 100).toFixed(0)
  //         }
  //         this.msdsCardChart.series = [percentage]
  //         if (count === 0) {
  //           this.msdsCard.push({
  //             quantity: 0,
  //             Attrition: '0%',
  //             Attrition_bg: 'text-success'
  //           })
  //         } else {
  //           if (count > total) {
  //             const attrition = Number(total) / Number(count) * 100
  //             const value = JSON.stringify(attrition.toFixed(0) + ' %')
  //             this.msdsCard.push({
  //               quantity: count,
  //               Attrition_icon: 'icon-arrow-up',
  //               Attrition: value.replace(/['"]+/g, ''),
  //               Attrition_bg: 'text-danger'
  //             })
  //           } else if (count < total) {
  //             const attrition = Number(count) / Number(total) * 100
  //             const value = JSON.stringify(attrition.toFixed(0) + ' %')
  //             this.msdsCard.push({
  //               quantity: count,
  //               Attrition_icon: 'icon-arrow-down',
  //               Attrition: value.replace(/['"]+/g, ''),
  //               Attrition_bg: 'text-success'
  //             })
  //           } else if (count === total) {
  //             this.msdsCard.push({
  //               quantity: count,
  //               Attrition: '0%',
  //               Attrition_bg: 'text-success'
  //             })
  //           }
  //         }
  //       },
  //       error: (err: any) => { },
  //       complete: () => { }
  //     })
  //   }
  // }

  msds_card() {
    const total = this.filterForm.value.chemical_count
    const startdaate = this.filterForm.value.start;
    const enddaate = this.filterForm.value.end;
  
    const startDate = startdaate ? new Date(startdaate).toISOString().split('T')[0] : null;
    const endDate = enddaate ? new Date(enddaate).toISOString().split('T')[0] : null;
    const division = this.filterForm.value.division;

    if (!startDate && !endDate && division) {
      this.chemicalService.get_valid_msds_division_count(division).subscribe({
        next: (count: any) => {
          this.updateMsdsCard(count, total);
        },
        error: (err: any) => { },
        complete: () => { }
      })
    }
    else if(startDate && endDate && division){
 
    this.chemicalService.get_valid_msds_start_date_end_date_division_count(startDate,endDate,division).subscribe({
        next: (count: any) => {
          this.updateMsdsCard(count, total);
        },
        error: (err: any) => { },
        complete: () => { }
      })
    }
    else if (startDate && endDate && !division && startDate !== null && endDate !== null){
    this.chemicalService.get_valid_msds_start_date_end_date_count(startDate,endDate).subscribe({
      next: (count: any) => {
        this.updateMsdsCard(count, total);
      },
      error: (err: any) => { },
      complete: () => { }
    })
    }

    else {
      this.chemicalService.get_valid_msds_count(this.userDivision).subscribe({
        next: (count: any) => {
     this.updateMsdsCard(count, total);
        },
        error: (err: any) => { },
        complete: () => { }
      })
    }
  }


  private updateMsdsCard(count: number, total: number) {
    this.msdsCard = [];
    let percentage = '0';
  
    if (count > 0) {
      percentage = Math.round((count / total) * 100).toFixed(0);
    }
    this.msdsCardChart.series = [percentage];
  
    if (count === 0) {
      this.msdsCard.push({
        quantity: 0,
        Attrition: '0%',
        Attrition_bg: 'text-success'
      });
    } else {
      if (count > total) {
        const attrition = (total / count) * 100;
        this.msdsCard.push({
          quantity: count,
          Attrition_icon: 'icon-arrow-up',
          Attrition: attrition.toFixed(0) + ' %',
          Attrition_bg: 'text-danger'
        });
      } else if (count < total) {
        const attrition = (count / total) * 100;
        this.msdsCard.push({
          quantity: count,
          Attrition_icon: 'icon-arrow-down',
          Attrition: attrition.toFixed(0) + ' %',
          Attrition_bg: 'text-success'
        });
      } else {
        this.msdsCard.push({
          quantity: count,
          Attrition: '0%',
          Attrition_bg: 'text-success'
        });
      }
    }
  }

  chemical_usage_card() {
    let deliveredData: any[] = []
    let issuedData: any[] = []
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]


    months.forEach(inventoryElem => {
      const inventoryData = this.inventory_data.filter(function (elem) {
        return (moment(elem.attributes.delivery_date).month() == inventoryElem)
      })
      const delivered = inventoryData.reduce((acc, cur) => acc + Number(cur.attributes.delivered_quantity), 0)
      deliveredData.push(delivered)

      const transactionData = this.transactions.filter(function (elem) {
        return (moment(elem.attributes.transaction_date).month() == inventoryElem)
      })
      const issued = transactionData.reduce((acc, cur) => acc + Number(cur.attributes.issued_quantity), 0)
      issuedData.push(issued)
    })

    this.ChemicalUsageCard.series = [
      {
        name: "Delivered",
        type: "column",
        data: deliveredData
      },
      {
        name: "Issued",
        type: "line",
        data: issuedData
      }
    ]

  }

  top_issued_chemicals() {
    this.topIssuedCard = []
    let chemical_list: any[] = []
    let top_issued: any[] = []
    let top_issued_chem: any[] = []



    this.chemicalName.forEach(cheElem => {
      const data = this.transactions.filter(function (elem) {
        return (elem.attributes.chemical == cheElem.attributes.name)
      })
      if (data.length > 0) {
        chemical_list.push({
          'name': data[0].attributes.chemical,
          'unit': data[0].attributes.unit,
          'quantity': data.reduce((acc, cur) => acc + Number(cur.attributes.issued_quantity), 0)
        })
      }

    })
    const data = chemical_list.sort(function (a, b) {
      return parseFloat(b.quantity) - parseFloat(a.quantity);
    })
    top_issued = data.slice(0, 5)
    const totalQuantity = top_issued.reduce((acc, cur) => acc + Number(cur.quantity), 0)
    top_issued.forEach(elem => {
      const per = Number(elem.quantity) / Number(totalQuantity) * 100
      top_issued_chem.push({
        'name': elem.name,
        'quantity': elem.quantity,
        'percentage': per,
        'unit': elem.unit
      })
    })
    this.topIssuedCard = top_issued_chem




  }

  latest_inventory() {

    const inventory = this.inventory_data.sort(function (a, b) {
      return parseFloat(b.delivery_date) - parseFloat(a.delivery_date);
    })
    let latest_inventory: any[] = []
    latest_inventory = inventory.slice(0, 10)
    this.latestInventory = latest_inventory
  }

  stock() {
    this.stockCard = []
    const inventoryDataThreshold = this.inventory_data.filter(function (elem) {
      return (Number(elem.attributes.balance) != 0 && Number(elem.attributes.balance) <= Number(elem.attributes.threshold_limit))
    })
    const inventoryDataUnique = inventoryDataThreshold.sort(function (a, b) {
      return parseFloat(b.id) - parseFloat(a.id);
    })
    let thresholdData: any[] = []
    thresholdData = inventoryDataUnique.slice(0, 5)
    thresholdData.forEach(elem => {
      this.stockCard.push({
        'category': 'Threshold',
        'reference': elem.attributes.reference_number,
        'name': elem.attributes.commercial_name,
        'limit': elem.attributes.threshold_limit,
        'issued': elem.attributes.issued,
        'rrn': elem.attributes.reach_registration_number,
        'unit': elem.attributes.delivered_unit,
        'percentage': Number(elem.attributes.issued) / Number(elem.attributes.delivered_quantity) * 100
      })
    })

    const inventoryDatabalance = this.inventory_data.filter(function (elem) {
      return (elem.attributes.balance > 0)
    })
    const balanceDataUnique = inventoryDatabalance.sort(function (a, b) {
      return parseFloat(b.attributes.balance) - parseFloat(a.attributes.balance);
    })

    let balanceData: any[] = []
    balanceData = balanceDataUnique.slice(0, 5)
    balanceData.forEach(elem => {
      this.stockCard.push({
        'category': 'Balance',
        'reference': elem.attributes.reference_number,
        'rrn': elem.attributes.reach_registration_number,
        'name': elem.attributes.commercial_name,
        'balance': elem.attributes.balance,
        'delivered': elem.attributes.delivered_quantity,
        'unit': elem.attributes.delivered_unit,
        'percentage': Number(elem.attributes.balance) / Number(elem.attributes.delivered_quantity) * 100
      })
    })



    const inventoryData = this.inventory_data.filter(function (elem) {
      return (moment(elem.attributes.msds_warning_date) <= moment(new Date()) && elem.attributes.msds_sds == true)
    })

    


    const msdsUniqueData = inventoryData.sort(function (a, b) {
      return parseFloat(b.attributes.msds_sds_expiry_date) - parseFloat(a.attributes.msds_sds_expiry_date);
    })
    let msdsData: any[] = []
    msdsData = msdsUniqueData.slice(0, 5)
    msdsData.forEach(elem => {
      this.stockCard.push({
        'category': 'msds',
        'reference': elem.attributes.reference_number,
        'rrn': elem.attributes.reach_registration_number,
        'name': elem.attributes.commercial_name,
        'expiry': moment(elem.attributes.msds_sds_expiry_date),
        'balance': elem.attributes.balance,
        'unit': elem.attributes.delivered_unit,
        'percentage': Number(elem.attributes.balance) / Number(elem.attributes.delivered_quantity) * 100
      })
    })

  }

  others() {
    const inventoryDataTopSupplier = this.inventory_data.sort(function (a, b) {
      return parseFloat(b.attributes.delivered_quantity) - parseFloat(a.attributes.delivered_quantity);
    })

    let inventoryUniqueTopSupplier: any[] = []
    let inventoryTopSupplier: any[] = []
    inventoryUniqueTopSupplier = inventoryDataTopSupplier.slice(0, 5)




    const total = inventoryUniqueTopSupplier.reduce((acc, cur) => acc + Number(cur.attributes.delivered_quantity), 0)

    this.supplierNames.forEach(supplierName => {

      const data = inventoryUniqueTopSupplier.filter(function (invdata) {

        return (invdata.attributes.supplier_name == supplierName.attributes.name)
      })
      inventoryTopSupplier.push({
        'name': supplierName.attributes.name,
        'deliveredQuantity': data.reduce((acc, cur) => acc + Number(cur.attributes.delivered_quantity), 0),
        // 'unit': data[0].attributes.delivered_unit,
        'percentage': Number(data.reduce((acc, cur) => acc + Number(cur.attributes.delivered_quantity), 0)) / Number(total) * 100

      })
    })
    const topSupplier = inventoryTopSupplier.filter(function (data) {
      return (data.deliveredQuantity > 0)
    })
    const topSupplierUnique = topSupplier.sort(function (a, b) {
      return parseFloat(b.deliveredQuantity) - parseFloat(a.deliveredQuantity);
    })
    this.top_supplier_card = topSupplierUnique
    const transactionDataTopDept = this.transactions.sort(function (a, b) {
      return parseFloat(b.attributes.issued_quantity) - parseFloat(a.attributes.issued_quantity);
    })
    let transactionUniqueTopDept: any[] = []
    let transactionTopDept: any[] = []
    transactionUniqueTopDept = transactionDataTopDept.slice(0, 5)
    const totalDept = transactionUniqueTopDept.reduce((acc, cur) => acc + Number(cur.attributes.issued_quantity), 0)

    this.departments.forEach(deptElem => {
      const topDept = transactionUniqueTopDept.filter(function (trvdata) {
        return (trvdata.attributes.department == deptElem.attributes.department_name)
      })
      transactionTopDept.push({
        'name': deptElem.attributes.department_name,
        'Quantity': topDept.reduce((acc, cur) => acc + Number(cur.attributes.issued_quantity), 0),
        'percentage': Number(topDept.reduce((acc, cur) => acc + Number(cur.attributes.issued_quantity), 0)) / Number(totalDept) * 100
      })
    })
    const topDepartment = transactionTopDept.filter(function (data) {
      return (data.Quantity > 0)
    })
    const topDepartmentUnique = topDepartment.sort(function (a, b) {
      return parseFloat(b.Quantity) - parseFloat(a.Quantity);
    })
    this.top_department_card = topDepartmentUnique

    const totalPositiveList = this.inventory_data.length
    let postiveList: any[] = []
    this.positive_list.forEach(listElem => {
      const positiveData = this.inventory_data.filter(function (trv) {
        return (trv.attributes.certificates?.data[0]?.attributes?.positive_tests === listElem.attributes.name)
      })
      postiveList.push({
        'name': listElem.attributes.name,
        'count': positiveData.length,
        'percentage': Number(positiveData.length) / Number(totalPositiveList) * 100
      })
    })
    this.positive_list_card = postiveList

    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 3);
    const expiryDate = (moment().set({ 'year': currentDate.getFullYear(), 'month': currentDate.getMonth(), 'date': currentDate.getDate() })).format('yyyy-MM-DD')
    this.chemicalService.chemical_che_expiry(expiryDate).subscribe({
      next: (expSoonResult: any) => {
        let cheExpiryList: any[] = []
        const date = new Date()
        expSoonResult.data.forEach((expSoonElem: any) => {
          if (new Date(expSoonElem.attributes.expiry_date) < date) {
            cheExpiryList.push({
              'name': expSoonElem.attributes.commercial_name,
              'reference': expSoonElem.attributes.reference_number,
              'expiry': expSoonElem.attributes.expiry_date,
              'quantity': expSoonElem.attributes.balance,
              'unit': expSoonElem.attributes.delivered_unit,
              'expired': true
            })
          } else {
            cheExpiryList.push({
              'name': expSoonElem.attributes.commercial_name,
              'reference': expSoonElem.attributes.reference_number,
              'expiry': expSoonElem.attributes.expiry_date,
              'quantity': expSoonElem.attributes.balance,
              'unit': expSoonElem.attributes.delivered_unit,
              'expired': false
            })
          }
        })
        this.chemical_expiry_list_card = cheExpiryList
      },
      error: (expSoonErr: any) => { },
      complete: () => { }
    })
    this.chemicalService.chemical_certificate_expiry(expiryDate).subscribe({
      next: (expSoonResult: any) => {
        let certiExpiryList: any[] = []
        const date = new Date()
        expSoonResult.data.forEach((expSoonElem: any) => {

          if (new Date(expSoonElem.attributes.certificate_expiry_date) < date) {
            certiExpiryList.push({
              'name': expSoonElem.attributes.certificate_name,
              'issued': expSoonElem.attributes.certificate_issued_date,
              'expiry': expSoonElem.attributes.certificate_expiry_date,
              'inventory': expSoonElem.attributes.chemical_inventory.data.attributes.reference_number,
              'chemical_name': expSoonElem.attributes.chemical_inventory.data.attributes.commercial_name,
              'expired': true
            })
          } else {
            certiExpiryList.push({
              'name': expSoonElem.attributes.certificate_name,
              'issued': expSoonElem.attributes.certificate_issued_date,
              'expiry': expSoonElem.attributes.certificate_expiry_date,
              'inventory': expSoonElem.attributes.chemical_inventory.data.attributes.reference_number,
              'chemical_name': expSoonElem.attributes.chemical_inventory.data.attributes.commercial_name,
              'expired': false
            })
          }
        })
        this.certificate_expiry_list_card = certiExpiryList
      },
      error: (expSoonErr: any) => { },
      complete: () => { }
    })
  }

  category_classification() {
    this.category_classification_card = []
    const hazardTypes = this.dropDownValue.filter(function (data) {
      return (data.attributes.Category === "Hazard Type")
    })

    const totalCount = this.inventory_data.length

    hazardTypes.forEach(hazardElem => {
      const hazardData = this.inventory_data.filter(function (invdata) {
        return (invdata.attributes.hazard_type.includes(hazardElem.attributes.Value) && invdata.attributes.balance > 0)
      })
      if (hazardData.length > 0) {
        this.category_classification_card.push({
          'name': hazardElem.attributes.Value,
          'category': 'Hazard',
          'count': hazardData.length,
          'percentage': Number(hazardData.length) / Number(totalCount) * 100,
        })
      } else {
        this.category_classification_card.push({
          'name': hazardElem.attributes.Value,
          'count': 0,
          'category': 'Hazard',
          'percentage': 0,
        })
      }

    })


    const ghsClassification = this.dropDownValue.filter(function (data) {
      return (data.attributes.Category === "GHS Classification")
    })

    ghsClassification.forEach(ghsElem => {
      const ghsData = this.inventory_data.filter(function (invdata) {
        return (invdata.attributes.ghs_classification.includes(ghsElem.attributes.Value) && invdata.attributes.balance > 0)
      })
      if (ghsData.length > 0) {
        this.category_classification_card.push({
          'name': ghsElem.attributes.Value,
          'category': 'GHS',
          'count': ghsData.length,
          'percentage': Number(ghsData.length) / Number(totalCount) * 100,
        })
      } else {
        this.category_classification_card.push({
          'name': ghsElem.attributes.Value,
          'category': 'GHS',
          'count': 0,
          'percentage': 0,
        })
      }

    })

    const zdhcLevel = this.dropDownValue.filter(function (data) {
      return (data.attributes.Category === "ZDHC Level")
    })

    zdhcLevel.forEach(zdhcElem => {
      const zdhcData = this.inventory_data.filter(function (invdata) {
        return (invdata.attributes.zdhc_level.includes(zdhcElem.attributes.Value) && invdata.attributes.balance > 0)
      })
      if (zdhcData.length > 0) {
        this.category_classification_card.push({
          'name': zdhcElem.attributes.Value,
          'category': 'ZDHC',
          'count': zdhcData.length,
          'percentage': Number(zdhcData.length) / Number(totalCount) * 100,
        })
      } else {
        this.category_classification_card.push({
          'name': zdhcElem.attributes.Value,
          'category': 'ZDHC',
          'count': 0,
          'percentage': 0,
        })
      }

    })




  }

  latest_transactions() {
    const filteredTransactions = this.transactions.filter(transaction =>
      this.divisions.some(division => division.division_name === transaction.attributes.division)
    );
    const sortedTransactions = filteredTransactions.sort((a, b) =>
      parseFloat(b.transaction_date) - parseFloat(a.transaction_date)
    );
    const latestTransactions = sortedTransactions.slice(0, 10);
    this.latestTransactions = latestTransactions;
  }


  recenet_transaction_cost(data: any) {
    const amountVal = this.currencyPipe.transform(data, this.currency);
    return amountVal


  }







}
