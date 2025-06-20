import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { ChartType, radialChart, consuptionChart, renewalEnergyUsedChart, intencityChart, HazardNonHazardChart, WasteWaterChart, GHGEmissionChart, emissionChart, reusedRecycledChart, waterWastewaterChart } from './chart-model';
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
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  filterForm: FormGroup
  divisions: any[] = []
  currency: any
  orgID: any
  dropDownValue: any[] = []
  consumptionDropDownValue: any[] = []
  years: any[] = []
  envData: any[] = []
  targetSettings: any[] = []
  targetProgress: any[] = []
  prevEnvData: any[] = []
  intencityType: string;
  summaryCard: any[] = []
  amountCard: any[] = []
  ghgEmissionCard: any[] = []
  categories: any[] = []
  wasteCard: any[] = []
  wasteWatersCard: any[] = []
  categorySourceCard: any[] = []
  waterConsumptionCard: any[] = []
  wasteDisposalCard: any[] = []
  wasteWaterCard: any[] = []
  renewableEnergyCard: any[] = []
  reusedrecycledCard: any[] = []
  waterwastewaterCard: any[] = []
  targetSettingProgressCard: any[] = []
  radialChart: ChartType
  consuptionChart: ChartType
  renewalEnergyUsedChart: ChartType
  reusedRecycledChart: ChartType
  waterWastewaterChart: ChartType
  intencityChart: ChartType;
  HazardNonHazardChart: ChartType
  WasteWaterChart: ChartType
  GHGEmissionChart: ChartType
  emissionChart: ChartType
  hazardTotal: any
  nonHazardTotal: any
  totalWasteWater: any
  recycledTotal: any
  reusedTotal: any
  othersTotal: any
  emissionNames: string[] = [];
  emissionCounts: number[] = [];
  unitSpecific: any
  userDivision: any
  corporateUser: any
  targetuserDivision: any
  targetprouserDivision: any

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private environService: EnvironmentService) { }

  ngOnInit() {
    this.showProgressPopup()
    this.radialChart = radialChart
    this.consuptionChart = consuptionChart
    this.renewalEnergyUsedChart = renewalEnergyUsedChart
    this.reusedRecycledChart = reusedRecycledChart
    this.waterWastewaterChart = waterWastewaterChart
    this.intencityChart = intencityChart
    this.HazardNonHazardChart = HazardNonHazardChart
    this.WasteWaterChart = WasteWaterChart
    this.GHGEmissionChart = GHGEmissionChart
    this.emissionChart = emissionChart
    this.renewableEnergyCard.push({
      quantity: "0",
      Attrition_icon: 'icon-arrow-down',
      Attrition: "0 %",
      Attrition_bg: 'text-success'
    })
    this.configuration()
    this.filterForm = this.formBuilder.group({
      division: [''],
      month: [''],
      year: []
    })

  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.environment
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          this.currency = result.data.attributes.currency
          this.years = result.data.attributes.Year
          const year = (new Date().getFullYear()).toString()
          this.filterForm.controls['year'].setValue(year)
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
        const status = result.env_dashboard
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
                divisions.push('filters[environment][business_unit][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results

              let targetdivisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                targetdivisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let targetresults = targetdivisions.join('&');
              this.targetuserDivision = targetresults

              let targetprodivisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                targetprodivisions.push('filters[target_setting][business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let targetproresults = targetprodivisions.join('&');
              this.targetprouserDivision = targetproresults
            }
          } else {
            this.get_division()
          }
          this.get_dropdown_values()
          this.get_consumption_dropdown_values()

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  get_consumption_dropdown_values() {
    const module = "Environment"
    this.environService.get_consumption_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.consumptionDropDownValue = result.data
      },
      error: (err: any) => { },
      complete: () => {
        // this.consumption_category()
      }
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
          divisions.push('filters[environment][business_unit][division_uuid][$in]=' + elem.division_uuid)
        })
        let results = divisions.join('&');
        this.userDivision = results

        let targetdivisions: any[] = []
        this.divisions.forEach((elem: any) => {
          targetdivisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
        })
        let targetresults = targetdivisions.join('&');
        this.targetuserDivision = targetresults

        let targetprodivisions: any[] = []
        this.divisions.forEach((elem: any) => {
          targetprodivisions.push('filters[target_setting][business_unit][division_uuid][$in]=' + elem.division_uuid)
        })
        let targetproresults = targetprodivisions.join('&');
        this.targetprouserDivision = targetproresults
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        this.default_data()
      },
    });
  }

  get_dropdown_values() {
    const module = "Environment"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValue = result.data
        const category = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Consumption Category")
        })
        this.categories = category
      },
      error: (err: any) => { },
      complete: () => {
        this.default_data()
      }
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
  default_data() {

    const year = this.filterForm.value.year
    this.environService.get_environ_data_year(year, this.userDivision).subscribe({
      next: (result: any) => {
        this.envData = result.data
        this.environService.get_target_setting_data(this.targetuserDivision).subscribe({
          next: (result: any) => {
            this.targetSettings = result.data
          },
          error: (err: any) => { },
          complete: () => {
            this.environService.get_target_progress_data(this.targetprouserDivision).subscribe({
              next: (result: any) => {
                this.targetProgress = result.data
              },
              error: (err: any) => { },
              complete: () => {
                this.get_previous_year_data()

              }
            })
          }
        })
      },
      error: (err: any) => { },
      complete: () => {
      }
    })
  }

  get_previous_year_data() {
    const current_year = this.filterForm.value.year
    const previous_year = Number(current_year) - 1
    this.environService.get_environ_data_year(previous_year, this.userDivision).subscribe({
      next: (result: any) => {
        this.prevEnvData = result.data
        this.summary_card_data()
        this.waste_card()
        this.consumption_dard()
        this.renewable_energy_card_default()
        this.intencity_card("employee", "Total Work Force")
        this.hazardCard()
        this.categorySource()
        this.waterConsuption()
        this.wasteDisposal("All")
        this.wasteWaster()
        this.ghgEmission()
        this.wasteWater()
        this.targetSettingProgress()
        this.emissionBreakdown()
        this.reused_recycled_card()
        this.water_wastewater_card()
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
  }


  search() {
    this.showProgressPopup()
    const year = this.filterForm.value.year
    const month = this.filterForm.value.month
    const division = this.filterForm.value.division
    if (year && month && division) {
      this.environService.get_environ_data_year_month_div(year, month, division).subscribe({
        next: (result: any) => {
          this.envData = result.data
          this.summary_card_data()
          this.waste_card()
          this.consumption_dard()
          this.renewable_energy_card()
          this.intencity_card("employee", "Total Work Force")
          this.hazardCard()
          this.categorySource()
          this.waterConsuption()
          this.wasteDisposal("All")
          this.wasteWaster()
          this.ghgEmission()
          this.wasteWater()
          this.targetSettingProgress()
          this.emissionBreakdown()
          this.reused_recycled_card()
          this.water_wastewater_card()
        },
        error: (err: any) => { },
        complete: () => {
          Swal.close()
        }
      })
    } else if (!year && month && division) {
      this.environService.get_environ_data_month_div(month, division).subscribe({
        next: (result: any) => {
          this.envData = result.data
          this.summary_card_data()
          this.waste_card()
          this.consumption_dard()
          this.renewable_energy_card()
          this.intencity_card("employee", "Total Work Force")
          this.hazardCard()
          this.categorySource()
          this.waterConsuption()
          this.wasteDisposal("All")
          this.wasteWaster()
          this.ghgEmission()
          this.wasteWater()
          this.targetSettingProgress()
          this.emissionBreakdown()
          this.reused_recycled_card()
          this.water_wastewater_card()
        },
        error: (err: any) => { },
        complete: () => {
          Swal.close()
        }
      })
    } else if (year && month && !division) {


      this.environService.get_environ_data_year_month(year, month, this.userDivision).subscribe({
        next: (result: any) => {
          this.envData = result.data
          this.summary_card_data()
          this.waste_card()
          this.consumption_dard()
          this.renewable_energy_card()
          this.intencity_card("employee", "Total Work Force")
          this.hazardCard()
          this.categorySource()
          this.waterConsuption()
          this.wasteDisposal("All")
          this.wasteWaster()
          this.ghgEmission()
          this.wasteWater()
          this.targetSettingProgress()
          this.emissionBreakdown()
          this.reused_recycled_card()
          this.water_wastewater_card()
        },
        error: (err: any) => { },
        complete: () => {
          Swal.close()
        }
      })
    } else if (year && !month && division) {
      this.environService.get_environ_data_year_div(year, division).subscribe({
        next: (result: any) => {
          this.envData = result.data
          this.summary_card_data()
          this.waste_card()
          this.consumption_dard()
          this.renewable_energy_card()
          this.intencity_card("employee", "Total Work Force")
          this.hazardCard()
          this.categorySource()
          this.waterConsuption()
          this.wasteDisposal("All")
          this.wasteWaster()
          this.ghgEmission()
          this.wasteWater()
          this.targetSettingProgress()
          this.emissionBreakdown()
          this.reused_recycled_card()
          this.water_wastewater_card()
        },
        error: (err: any) => { },
        complete: () => {
          Swal.close()
        }
      })
    } else if (year && !month && !division) {
      this.environService.get_environ_data_year(year, this.userDivision).subscribe({
        next: (result: any) => {
          this.envData = result.data
          this.summary_card_data()
          this.waste_card()
          this.consumption_dard()
          this.renewable_energy_card()
          this.intencity_card("employee", "Total Work Force")
          this.hazardCard()
          this.categorySource()
          this.waterConsuption()
          this.wasteDisposal("All")
          this.wasteWaster()
          this.ghgEmission()
          this.wasteWater()
          this.targetSettingProgress()
          this.emissionBreakdown()
          this.reused_recycled_card()
          this.water_wastewater_card()
        },
        error: (err: any) => { },
        complete: () => {
          Swal.close()
        }
      })
    } else if (!year && month && !division) {
      this.environService.get_environ_data_month(month, this.userDivision).subscribe({
        next: (result: any) => {
          this.envData = result.data
          this.summary_card_data()
          this.waste_card()
          this.consumption_dard()
          this.renewable_energy_card()
          this.intencity_card("employee", "Total Work Force")
          this.hazardCard()
          this.categorySource()
          this.waterConsuption()
          this.wasteDisposal("All")
          this.wasteWaster()
          this.ghgEmission()
          this.wasteWater()
          this.targetSettingProgress()
          this.emissionBreakdown()
          this.reused_recycled_card()
          this.water_wastewater_card()
        },
        error: (err: any) => { },
        complete: () => {
          Swal.close()
        }
      })
    } else if (!year && !month && division) {
      this.environService.get_environ_data_div(division).subscribe({
        next: (result: any) => {
          this.envData = result.data
          this.summary_card_data()
          this.waste_card()
          this.consumption_dard()
          this.renewable_energy_card()
          this.intencity_card("employee", "Total Work Force")
          this.hazardCard()
          this.categorySource()
          this.waterConsuption()
          this.wasteDisposal("All")
          this.wasteWaster()
          this.ghgEmission()
          this.wasteWater()
          this.targetSettingProgress()
          this.emissionBreakdown()
          this.reused_recycled_card()
          this.water_wastewater_card()
        },
        error: (err: any) => { },
        complete: () => {
          Swal.close()
        }
      })
    }
  }

  reset() {
    (<HTMLInputElement>document.getElementById('intencity_div_id')).value = 'Total Work Force';
    this.filterForm.reset()
    this.divisions = []
    this.ngOnInit()
  }


  filterCategory(value: any) {
    return value.category === "overview"
  }

  filterHazardCategory(value: any) {
    return value.category === "Hazardous"
  }

  filterNonHazardCategory(value: any) {
    return value.category === "Non Hazardous"
  }

  filterEnergyCategory(value: any) {
    return value.category === "Energy"
  }

  filterWaterCategory(value: any) {
    return value.category === "Water"
  }

  filterWasteCategory(value: any) {
    return value.category === "Waste"
  }

  filterAirCategory(value: any) {
    return value.category === "Air Emission"
  }

  filterWasteWaterCategory(value: any) {
    return value.category === "Wastewater"
  }

  filterTargetProgressEnergy(value: any) {
    return value.category === "Energy"
  }

  filterTargetProgressWater(value: any) {
    return value.category === "Water"
  }

  filterTargetProgressWaste(value: any) {
    return value.category === "Waste"
  }

  filterTargetProgressRenewable(value: any) {
    return value.category === "Renewable Energy"
  }

  //######## cards logic
  summary_card_data() {
    this.summaryCard = []
    this.amountCard = []
    this.ghgEmissionCard = []
    let totGHGEmission = 0;
    let preTotGHGEmission = 0;
    const amount = Number(this.envData.reduce((acc, cur) => acc + Number(cur.attributes.amount), 0))
    const preAmount = Number(this.prevEnvData.reduce((acc, cur) => acc + Number(cur.attributes.amount), 0))
    //const totGHGEmission = Number(this.envData.reduce((acc, cur) => acc + Number(cur.attributes.emission_value), 0))
    //const preTotGHGEmission = Number(this.prevEnvData.reduce((acc, cur) => acc + Number(cur.attributes.emission_value), 0))

    for (const emission of this.envData) {
      // const emission_factor = emission.attributes.emission_factor;
      // const quantity = emission.attributes.quantity;
      // const ghgEmission = (Number(Math.round(Number(quantity) * Number(emission_factor)) / 1000)).toFixed(2) || 0;
      const ghgEmission = emission.attributes.ghg_value || 0;
      totGHGEmission += Number(ghgEmission);
    }
    for (const emission of this.prevEnvData) {
      const ghgEmission = emission.attributes.ghg_value || 0;
      preTotGHGEmission += Number(ghgEmission);
    }
    if (totGHGEmission === 0) {
      this.ghgEmissionCard.push({
        emission: 0 + ' ' + 'tCO2e',
        Attrition: '0%',
        Attrition_bg: 'text-success'
      })
    } else {
      if (totGHGEmission === 0) {
        this.ghgEmissionCard.push({
          emission: 0 + ' ' + 'tCO2e',
          Attrition: '0%',
          Attrition_bg: 'text-success'
        });
      } else {
        if (totGHGEmission > preTotGHGEmission) {
          const attrition = Math.round(Number(preTotGHGEmission) / Number(totGHGEmission) * 100);
          this.ghgEmissionCard.push({
            emission: Math.round(totGHGEmission) + ' ' + 'tCO2e',
            Attrition_icon: 'icon-arrow-up',
            Attrition: attrition + ' %',
            Attrition_bg: 'text-danger'
          });
        } else if (totGHGEmission < preTotGHGEmission) {
          const attrition = Math.round(Number(totGHGEmission) / Number(preTotGHGEmission) * 100);
          this.ghgEmissionCard.push({
            emission: Math.round(totGHGEmission) + ' ' + 'tCO2e',
            Attrition_icon: 'icon-arrow-down',
            Attrition: attrition + ' %',
            Attrition_bg: 'text-success'
          });
        } else if (totGHGEmission === preTotGHGEmission) {
          this.ghgEmissionCard.push({
            emission: Math.round(totGHGEmission) + ' ' + 'tCO2e',
            Attrition: '0%',
            Attrition_bg: 'text-success'
          });
        }
      }

    }



    const categoryVal = this.categories.filter(function (elem: any) {
      return (elem.attributes.Value !== "Air Emission")
    })


    categoryVal.forEach(cateVal => {
      const consData = this.envData.filter(function (elem: any) {
        return (elem.attributes.consumption_category === cateVal.attributes.Value)
      })
      const prevConsData = this.prevEnvData.filter(function (elem: any) {
        return (elem.attributes.consumption_category === cateVal.attributes.Value)
      })






      let quantity = Number(consData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0))
      let prevQuantity = Number(prevConsData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0))
      let catVal = cateVal.attributes.Value
      let quantityVal: any = quantity
      let attrition: any = ''
      let attrition_bg: any = ''
      let attrition_icon: any = ''
      if (catVal == 'Air Emission') {
        catVal = 'Total GHG Emission'
      }
      if (catVal === 'Energy') {
        catVal = 'Total Energy'
        quantityVal = `${quantityVal.toFixed(0)} kWh`;
      }
      if (catVal === 'Waste') {
        quantityVal = `${quantityVal.toFixed(0)} KG`;
      }
      if (catVal === 'Wastewater') {
        quantityVal = `${quantityVal.toFixed(0)} m³`;
      }
      if (catVal === 'Water') {
        quantityVal = `${quantityVal.toFixed(0)} m³`;
      }
      if (quantity === 0) {
        attrition = "0 %"
        attrition_bg = 'text-success'
        attrition_icon = ''
        this.summaryCard.push({
          category: catVal,
          quantity: quantityVal,
          attrition: attrition,
          attrition_bg: attrition_bg,
          attrition_icon: attrition_icon,
          icon: cateVal.attributes.icon
        })
      } else {
        if (quantity > prevQuantity) {
          const temp_attrition = Number(prevQuantity) / Number(quantity) * 100
          const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
          attrition = value.replace(/['"]+/g, '')
          attrition_icon = 'icon-arrow-up'
          attrition_bg = 'text-danger'
          this.summaryCard.push({
            category: catVal,
            quantity: quantityVal,
            attrition: attrition,
            attrition_bg: attrition_bg,
            attrition_icon: attrition_icon,
            icon: cateVal.attributes.icon
          })
        } else if (quantity < prevQuantity) {
          const temp_attrition = Number(quantity) / Number(prevQuantity) * 100
          const value = JSON.stringify(temp_attrition.toFixed(0) + ' %')
          attrition = value.replace(/['"]+/g, '')
          attrition_icon = 'icon-arrow-down'
          attrition_bg = 'text-success'
          this.summaryCard.push({
            category: catVal,
            quantity: quantityVal,
            attrition: attrition,
            attrition_bg: attrition_bg,
            attrition_icon: attrition_icon,
            icon: cateVal.attributes.icon
          })
        } else if (quantity === prevQuantity) {
          attrition = "0 %"
          attrition_bg = 'text-success'
          attrition_icon = ''
          this.summaryCard.push({
            category: catVal,
            quantity: quantityVal,
            attrition: attrition,
            attrition_bg: attrition_bg,
            attrition_icon: attrition_icon,
            icon: cateVal.attributes.icon
          })
        }


      }
    })

    if (amount === 0) {
      this.amountCard.push({
        amount: amount,
        unit:this.currency,
        Attrition: '0%',
        Attrition_bg: 'text-success'
      })
    } else {
      if (amount > preAmount) {
        const attrition = Number(preAmount) / Number(amount) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        this.amountCard.push({
          amount: amount,
          unit:this.currency,
          Attrition_icon: 'icon-arrow-up',
          Attrition: value.replace(/['"]+/g, ''),
          Attrition_bg: 'text-danger'
        })
      } else if (amount < preAmount) {
        const attrition = Number(amount) / Number(preAmount) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        this.amountCard.push({
          amount: amount,
          unit:this.currency,
          Attrition_icon: 'icon-arrow-down',
          Attrition: value.replace(/['"]+/g, ''),
          Attrition_bg: 'text-success'
        })
      } else if (amount === preAmount) {
        this.amountCard.push({
          amount: amount,
          unit:this.currency,
          Attrition: '0%',
          Attrition_bg: 'text-success'
        })
      }
    }
  }

  waste_card() {
    this.wasteCard = []
    const totalData = this.envData.filter(function (data) {
      return (data.attributes.consumption_category === "Waste")
    })
    const source = this.consumptionDropDownValue.filter(function (data) {
      return (data.attributes.Category === "Source" && data.attributes.filter === "Waste")
    })
    const category = this.dropDownValue.filter(function (data) {
      return (data.attributes.Category === "Category")
    })
    source.forEach(elem => {
      const data = this.envData.filter(function (data) {
        return (data.attributes.source === elem.attributes.Value && data.attributes.consumption_category === "Waste")
      })
      const total = data.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
      const grandTotal = totalData.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
      const percentage = Math.round(Number(total) / Number(grandTotal) * 100).toFixed(0)

      if (grandTotal === 0) {
        this.wasteCard.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: "overview",
          unit: elem.attributes.unit
        })
      } else {
        this.wasteCard.push({
          name: elem.attributes.Value,
          count: total,
          percentage: percentage,
          category: "overview",
          unit: elem.attributes.unit

        })
      }
    })

    category.forEach(elem => {
      const data = this.envData.filter(function (data) {
        return (data.attributes.category === elem.attributes.Value && data.attributes.consumption_category === "Waste")
      })

      if (data.length > 0) {

        data.forEach(elemData => {
          const grandTotal = data.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
          const percentage = Math.round(Number(elemData.attributes.quantity) / Number(grandTotal) * 100).toFixed(0)
          if (grandTotal === 0) {
            this.wasteCard.push({
              name: elemData.attributes.source,
              count: 0,
              percentage: 0,
              category: elem.attributes.Value,
              unit: elemData.attributes.unit
            })
          } else {
            this.wasteCard.push({
              name: elemData.attributes.source,
              count: elemData.attributes.quantity,
              percentage: percentage,
              category: elem.attributes.Value,
              unit: elemData.attributes.unit
            })
          }
        })
      }
    })
  }

  consumption_dard() {
    let elecData: any[] = []
    let wastWaterData: any[] = []
    let wastedata: any[] = []
    let waterDate: any[] = []
    let airData: any[] = []
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    months.forEach(elem => {
      const data = this.envData.filter(function (data) {
        return (data.attributes.environment.data.attributes.month === elem)
      })
      //electricity data
      const electricityData = data.filter(function (data) {
        return (data.attributes.consumption_category === "Energy")
      })
      //const elecQuantity = electricityData.reduce((acc, cur) => acc + Number(cur.attributes.ghg_value), 0)
      const elecQuantity = electricityData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0)
      elecData.push(elecQuantity)
      //Waste Waster data
      const wasteWaterData = data.filter(function (data) {
        return (data.attributes.consumption_category === "Wastewater")
      })
      const wateWaterQuantity = wasteWaterData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0)
      wastWaterData.push(wateWaterQuantity)
      //Waste data
      const wasteData = data.filter(function (data) {
        return (data.attributes.consumption_category === "Waste")
      })
      const wateQuantity = wasteData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0)
      wastedata.push(wateQuantity)
      //Water data
      const waterData = data.filter(function (data) {
        return (data.attributes.consumption_category === "Water")
      })
      const waterQuantity = waterData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0)
      waterDate.push(waterQuantity)
      //Air Emission data
      // const airEmissionData = data.filter(function (data) {
      //   return (data.attributes.consumption_category === "Air Emission")
      // })
      const airEmissionQuantity = data.reduce((acc, cur) => acc + Number(cur.attributes.ghg_value), 0)
      airData.push(airEmissionQuantity)
    })

    this.consuptionChart.series = [
      {
        name: 'Total Energy (kWh)',
        data: elecData
      }, {
        name: 'Wastewater (m³)',
        data: wastWaterData
      }, {
        name: 'Waste (kg)',
        data: wastedata
      }, {
        name: 'Water (m³)',
        data: waterDate
      }, {
        name: 'GHG Emission (tCO2e)',
        data: airData
      }
    ]
  }

  renewable_energy_card_default() {
    this.renewableEnergyCard = []
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = ((new Date().getMonth()) + 1).toString()
    const prevMonth = new Date(month)
    const currMonth = new Date(month)
    const prevMonthVal = new Date(prevMonth.setMonth(prevMonth.getMonth() - 1));
    const prevMonthValue = monthNames[prevMonthVal.getMonth()]
    const currMonthVal = new Date(currMonth.setMonth(currMonth.getMonth()));
    const currMonthValue = monthNames[currMonthVal.getMonth()]

    const currEnvData = this.envData.filter(function (data) {
      return (data.attributes.environment.data.attributes.month === currMonthValue && data.attributes.consumption_category === "Energy")
    })


    const currGrandTotal = currEnvData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0)
    const prevEnvData = this.envData.filter(function (data) {
      return (data.attributes.environment.data.attributes.month === prevMonthValue && data.attributes.consumption_category === "Energy")
    })
    const source = this.consumptionDropDownValue.filter(function (data) {
      return (data.attributes.Category === "Source" && data.attributes.renewable === true)
    })
    let currData: any[] = []

    source.forEach(elem => {
      const data = currEnvData.filter(function (data) {
        return (data.attributes.source === elem.attributes.Value)
      })
      if (data.length > 0) {
        currData.push(data)
      }
    })


    let currQuantity = 0
    if (currData.length > 0) {
      currQuantity = currData[0].reduce((acc: any, cur: any) => acc + Number(cur.attributes.quantity_kwh), 0)
    } else {
      currQuantity = 0
    }

    let percentage = '0'
    if (currGrandTotal > 0) {
      percentage = Math.round(currQuantity / currGrandTotal * 100).toFixed(0)
    }
    this.renewalEnergyUsedChart.series = [percentage]
    let prevData: any[] = []
    source.forEach(elem => {
      const data = prevEnvData.filter(function (data) {
        return (data.attributes.source === elem.attributes.Value)
      })
      if (data.length > 0) {
        prevData.push(data)
      }
    })
    const prevTotal = prevData.reduce((acc, cur) => acc + Number(cur.attributes?.quantity_kwh), 0)
    if (currQuantity === 0) {
      this.renewableEnergyCard.push({
        quantity: 0,
        Attrition: '0%',
        Attrition_bg: 'text-success'
      })
    } else {
      if (currQuantity > prevTotal) {
        const attrition = Number(prevTotal) / Number(currQuantity) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        this.renewableEnergyCard.push({
          quantity: currQuantity,
          Attrition_icon: 'icon-arrow-up',
          Attrition: value.replace(/['"]+/g, ''),
          Attrition_bg: 'text-danger'
        })
      } else if (currQuantity < prevTotal) {
        const attrition = Number(currQuantity) / Number(prevTotal) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        this.renewableEnergyCard.push({
          quantity: currQuantity,
          Attrition_icon: 'icon-arrow-down',
          Attrition: value.replace(/['"]+/g, ''),
          Attrition_bg: 'text-success'
        })
      } else if (currQuantity === prevTotal) {
        this.renewableEnergyCard.push({
          quantity: currQuantity,
          Attrition: '0%',
          Attrition_bg: 'text-success'
        })
      }
    }
  }
  renewable_energy_card() {
    this.renewableEnergyCard = [];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Get the current month and previous month values
    const currMonthIndex = (new Date().getMonth());  // current month index
    const prevMonthIndex = currMonthIndex === 0 ? 11 : currMonthIndex - 1;  // previous month index, handles January case

    const currMonthValue = this.filterForm.value.month || monthNames[currMonthIndex];  // Current selected month or the current month by default
    const prevMonthValue = monthNames[prevMonthIndex];  // Previous month value

    // Filter environment data for the current and previous month
    const currEnvData = this.envData.filter(data =>
      data.attributes.environment.data.attributes.month === currMonthValue &&
      data.attributes.consumption_category === "Energy"
    );

    const prevEnvData = this.envData.filter(data =>
      data.attributes.environment.data.attributes.month === prevMonthValue &&
      data.attributes.consumption_category === "Energy"
    );

    // Calculate total energy consumption for the current month
    const currGrandTotal = currEnvData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0);

    // Filter renewable energy sources
    const source = this.consumptionDropDownValue.filter(data =>
      data.attributes.Category === "Source" && data.attributes.renewable === true
    );

    // Calculate current renewable energy consumption
    let currQuantity = 0;
    source.forEach(elem => {
      const data = currEnvData.filter(item => item.attributes.source === elem.attributes.Value);
      currQuantity += data.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0);
    });

    // Calculate percentage of renewable energy used
    let percentage = '0';
    if (currGrandTotal > 0) {
      percentage = Math.round((currQuantity / currGrandTotal) * 100).toFixed(0);
    }
    this.renewalEnergyUsedChart.series = [percentage];

    // Calculate previous month's renewable energy consumption
    let prevTotal = 0;
    source.forEach(elem => {
      const data = prevEnvData.filter(item => item.attributes.source === elem.attributes.Value);
      prevTotal += data.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0);
    });

    // Create the renewable energy card data
    if (currQuantity === 0) {
      this.renewableEnergyCard.push({
        quantity: 0,
        Attrition: '0%',
        Attrition_bg: 'text-success'
      });
    } else {
      let attrition = 0;
      let attrition_icon = '';
      let attrition_bg = '';

      if (currQuantity > prevTotal) {
        attrition = (prevTotal / currQuantity) * 100;
        attrition_icon = 'icon-arrow-up';
        attrition_bg = 'text-danger';
      } else if (currQuantity < prevTotal) {
        attrition = (currQuantity / prevTotal) * 100;
        attrition_icon = 'icon-arrow-down';
        attrition_bg = 'text-success';
      }

      const attritionValue = attrition.toFixed(0) + ' %';

      this.renewableEnergyCard.push({
        quantity: currQuantity,
        Attrition_icon: attrition_icon,
        Attrition: attritionValue,
        Attrition_bg: attrition_bg
      });
    }
  }

  reused_recycled_card() {
    const wasteWaterData = this.envData.filter(data => data.attributes.consumption_category === 'Wastewater');
    
    const recycledData = wasteWaterData.filter(data => data.attributes.treatment_outcome && data.attributes.treatment_outcome.includes('Recycled'));
    const reusedData = wasteWaterData.filter(data => data.attributes.treatment_outcome && data.attributes.treatment_outcome.includes('Reused'));
    const othersData = wasteWaterData.filter(data => data.attributes.treatment_outcome && data.attributes.treatment_outcome.includes('Others'));

    this.recycledTotal = recycledData.reduce((acc, cur) => acc + Number(cur.attributes.treatment_outcome_recycled || 0), 0);
    this.reusedTotal = reusedData.reduce((acc, cur) => acc + Number(cur.attributes.treatment_outcome_reused || 0), 0);
    this.othersTotal = othersData.reduce((acc, cur) => acc + Number(cur.attributes.reused_recycled_quantity || 0), 0);

    this.totalWasteWater = this.recycledTotal + this.reusedTotal + this.othersTotal;

    const recycledPercentage = this.totalWasteWater ? Math.round((this.recycledTotal / this.totalWasteWater) * 100) : 0;
    const reusedPercentage = this.totalWasteWater ? Math.round((this.reusedTotal / this.totalWasteWater) * 100) : 0;
    const othersPercentage = this.totalWasteWater ? Math.round((this.othersTotal / this.totalWasteWater) * 100) : 0;

    this.reusedRecycledChart.series = [recycledPercentage, reusedPercentage, othersPercentage];
    this.reusedRecycledChart.labels = ["Recycled", "Reused", "Others"];
}





  intencistyType(event: any) {
    if (event.target.value == "Total Work Force") {
      this.intencity_card("employee", "Total Work Force")
    } else if (event.target.value == "Total product produced/shipped (kg)") {
      this.intencity_card("Produced", "Total product produced/shipped (kg)")
    } else if (event.target.value == "Total product produced/shipped (pcs)") {
      this.intencity_card("Producedpcs", "Total product produced/shipped (pcs)")
    } else if (event.target.value == "Area in Square Meter (M2)") {
      this.intencity_card("Area", "Area in Square Meter (M2)")
    }
  }

  intencity_card(intencityType: any, type: any) {
    this.intencityType = type;
    let energyDatas: any[] = []
    let wasteDatas: any[] = []
    let waterDatas: any[] = []
    let airDatas: any[] = []
    let datas: any[] = []
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    months.forEach(elem => {
      const data = this.envData.filter(function (data) {
        return (data.attributes.environment.data.attributes.month === elem)
      })
      //energy data
      const energyData = data.filter(function (data) {
        return (data.attributes.consumption_category === "Energy")
      })
      const energyQuantity = energyData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0)
      const energyEmission = energyData.reduce((acc, cur) => acc + Number(cur.attributes.emission_factor), 0)
      energyDatas.push({
        month: elem,
        name: "Energy",
        data: energyQuantity,
        emission: energyEmission
      })
      //Water data
      const waterData = data.filter(function (data) {
        return (data.attributes.consumption_category === "Water")
      })
      const waterQuantity = waterData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0)
      waterDatas.push({
        month: elem,
        name: "Water",
        data: waterQuantity,
      })
      //Waste data
      const wasteData = data.filter(function (data) {
        return (data.attributes.consumption_category === "Waste")
      })
      const wateQuantity = wasteData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0)
      wasteDatas.push({
        month: elem,
        name: "Waste",
        data: wateQuantity,
      })
      //Air Emission data
      // const airEmissionData = data.filter(function (data) {
      //   return (data.attributes.consumption_category === "Air Emission")
      // })
      const airEmissionQuantity = data.reduce((acc, cur) => acc + Number(cur.attributes.ghg_value), 0)
      airDatas.push({
        month: elem,
        name: "GHG Emission",
        data: airEmissionQuantity,
      })
    })

    months.forEach(elem => {
      const data = this.envData.filter(function (data) {
        return (data.attributes.environment.data.attributes.month === elem)
      })
      if (intencityType === "employee") {
        this.intencityType === 'Employee'
        datas.push({
          name: "Employee",
          month: elem,
          // count: data.reduce((acc, cur) => acc + Number(cur.attributes.environment.data.attributes.work_force), 0)
          count: data[0]?.attributes?.environment?.data?.attributes?.work_force || 0
        })
      } else if (intencityType === "Produced") {
        datas.push({
          name: "Produced",
          month: elem,
          // count: data.reduce((acc, cur) => acc + Number(cur.attributes.environment.data.attributes.product_produced_kg), 0)
          count: data[0]?.attributes?.environment?.data?.attributes?.product_produced_kg || 0

        })
      } else if (intencityType === "Producedpcs") {
        datas.push({
          name: "Producedpcs",
          month: elem,
          // count: data.reduce((acc, cur) => acc + Number(cur.attributes.environment.data.attributes.product_produced_pieces), 0)
          count: data[0]?.attributes?.environment?.data?.attributes?.product_produced_pieces || 0

        })

      } else if (intencityType === "Area") {
        datas.push({
          name: "Area",
          month: elem,
          // count: data.reduce((acc, cur) => acc + Number(cur.attributes.environment.data.attributes.area), 0)
          count: data[0]?.attributes?.environment?.data?.attributes?.area || 0

        })
      }
    })
    //energy data
    let energyTemp: any[] = []
    var energyData = {
      name: 'Energy',
      data: [0]
    };
    energyData.data = []
    energyDatas.forEach(elem => {
      const filter = datas.filter(function (data) {
        return (data.month === elem.month)
      })
      const value = filter[0].count
      let energyPerce = '0'
      if (value > 0) {
        energyPerce = (Number(elem.data) / Number(value)).toFixed(2);
      }
      energyTemp.push([
        {
          name: 'Energy',
          data: energyPerce
        }
      ])
    })
    energyTemp.forEach((elem) => {
      energyData.data.push(Number(elem[0].data))
    })

    //water data
    let waterTemp: any[] = []
    var waterData = {
      name: 'Water',
      data: [0]
    };
    waterData.data = []
    waterDatas.forEach(elem => {
      const filter = datas.filter(function (data) {
        return (data.month === elem.month)
      })
      const value = filter[0].count
      let waterPerce = '0'
      if (value > 0) {
        waterPerce = (Number(elem.data) / Number(value)).toFixed(2);
      }
      waterTemp.push([
        {
          name: 'Water',
          data: waterPerce
        }
      ])
    })
    waterTemp.forEach((elem) => {
      waterData.data.push(Number(elem[0].data))
    })
    //waste data
    let wasteTemp: any[] = []
    var wasteData = {
      name: 'Waste',
      data: [0]
    };
    wasteData.data = []
    wasteDatas.forEach(elem => {
      const filter = datas.filter(function (data) {
        return (data.month === elem.month)
      })
      const value = filter[0].count
      let wastePerce = '0'
      if (value > 0) {
        wastePerce = (Number(elem.data) / Number(value)).toFixed(2);
      }
      wasteTemp.push([
        {
          name: 'Water',
          data: wastePerce
        }
      ])
    })
    wasteTemp.forEach((elem) => {
      wasteData.data.push(Number(elem[0].data))
    })
    //Air data
    let airTemp: any[] = []
    var airsData = {
      name: 'GHG Emission',
      data: [0]
    };
    airsData.data = []
    airDatas.forEach(elem => {
      const filter = datas.filter(function (data) {
        return (data.month === elem.month)
      })

      const value = filter[0].count
      let airPerce = '0'
      if (value > 0) {
        airPerce = (Number(elem.data) / Number(value)).toFixed(2);
      }
      airTemp.push([
        {
          name: 'GHG Emission',
          data: airPerce
        }
      ])
    })
    airTemp.forEach((elem) => {
      airsData.data.push(Number(elem[0].data))
    })
    this.intencityChart.series = [energyData, waterData, wasteData, airsData];
    this.intencityChart.tooltip = {
      enabled: true,
      y: {
        formatter: (val: number, { seriesIndex }: { seriesIndex: number }) => {
          let unit = '';

          switch (seriesIndex) {
            case 0: // Energy data
              unit = 'kWh';
              break;
            case 1: // Water data
              unit = 'm³';
              break;
            case 2: // Waste data
              unit = 'kg';
              break;
            case 3: // GHG emissions data
              unit = 'tCO2e';
              break;
            default:
              unit = 'units';
          }

          return `${val} ${unit} / ${this.intencityType}`;
        }
      }
    };

  }

  hazardCard() {
    const totData = this.envData.filter(function (data) {
      return (data.attributes.consumption_category === "Waste")
    })
    const total = totData.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
    const hazard = totData.filter(function (data) {
      return (data.attributes.category === "Hazardous")
    })
    this.hazardTotal = hazard.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
    const nonHazard = totData.filter(function (data) {
      return (data.attributes.category === "Non Hazardous")
    })
    this.nonHazardTotal = nonHazard.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
    let hazardPercentage = '0'
    let nonHazardPercentage = '0'
    if (total > 0) {
      hazardPercentage = Math.round(Number(this.hazardTotal) / Number(total) * 100).toFixed(0)
      nonHazardPercentage = Math.round(Number(this.nonHazardTotal) / Number(total) * 100).toFixed(0)
      this.HazardNonHazardChart.series = [Number(hazardPercentage), Number(nonHazardPercentage)]
    } else {
      this.HazardNonHazardChart.series = [0, 0]
    }
  }

  categorySource() {
    this.categorySourceCard = [];
    this.categories.forEach(catElem => {
      const source = this.consumptionDropDownValue.filter(function (data) {
        return (data.attributes.Category === "Source" && data.attributes.filter === catElem.attributes.Value);
      });
      const catData = this.envData.filter(function (data) {
        return (data.attributes.consumption_category === catElem.attributes.Value);
      });
      const grandTotal = this.envData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0);
      const cateTotal = catData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0);
      const catPercentage = Math.round(Number(cateTotal) / Number(grandTotal) * 100).toFixed(0);

      let unit = '';
      switch (catElem.attributes.Value) {
        case 'Water':
        case 'Wastewater':
          unit = 'm³';
          break;
        case 'Waste':
          unit = 'kg';
          break;
        case 'Air Emission':
          unit = '';
          break;
        case 'Energy':
          unit = 'kwh';
          break;
        default:
          unit = catElem.attributes.unit ? catElem.attributes.unit : '';
      }

      if (grandTotal === 0) {
        this.categorySourceCard.push({
          name: catElem.attributes.Value,
          count: 0,
          percentage: '',
          category: "overview",
          unit: unit
        });
      } else {
        this.categorySourceCard.push({
          name: catElem.attributes.Value,
          count: cateTotal,
          percentage: '',
          category: "overview",
          unit: unit
        });
      }

      source.forEach(sourceElem => {
        const sourceData = this.envData.filter(function (data) {
          return (data.attributes.source === sourceElem.attributes.Value);
        });
        const sourceGrandTotal = cateTotal;
        const sourceTotal = sourceData.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0);
        const sourceTotalKWH = sourceData.reduce((acc, cur) => acc + Number(cur.attributes.quantity_kwh), 0);
        const sourcePercentage = Math.round(Number(sourceTotalKWH) / Number(sourceGrandTotal) * 100).toFixed(0);

        // Check if unit is available for each source element
        const sourceUnit = sourceElem.attributes.unit ? sourceElem.attributes.unit : '';

        if (sourceGrandTotal === 0) {
          this.categorySourceCard.push({
            name: sourceElem.attributes.Value,
            count: 0,
            percentage: 0,
            category: catElem.attributes.Value,
            unit: sourceUnit // Show unit for source element
          });
        } else {
          this.categorySourceCard.push({
            name: sourceElem.attributes.Value,
            count: sourceTotal,
            percentage: sourcePercentage,
            category: catElem.attributes.Value,
            unit: sourceUnit // Show unit for source element
          });
        }
      });
    });
  }

  waterConsuption() {
    this.waterConsumptionCard = []
    const data = this.envData.filter(function (data) {
      return (data.attributes.consumption_category === "Water")
    })
    const grandTotal = data.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
    const source = this.consumptionDropDownValue.filter(function (data) {
      return (data.attributes.Category === "Source" && data.attributes.filter === "Water")
    })
    source.forEach(elem => {
      const sourceData = this.envData.filter(function (data) {
        return (data.attributes.source === elem.attributes.Value)
      })
      const total = sourceData.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
      const sourcePercentage = Math.round(Number(total) / Number(grandTotal) * 100).toFixed(0)
      if (grandTotal === 0) {
        this.waterConsumptionCard.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: elem.attributes.Value,
          unit: elem.attributes.unit
        })
      } else {
        this.waterConsumptionCard.push({
          name: elem.attributes.Value,
          count: total,
          percentage: sourcePercentage,
          category: elem.attributes.Value,
          unit: elem.attributes.unit
        })
      }
    })

  }

  wasteDisposalType(event: any) {
    if (event.target.value == "All Waste") {
      this.wasteDisposal("All")
    } else if (event.target.value == "Hazardous Waste") {
      this.wasteDisposal("Hazardous")
    } else if (event.target.value == "Non Hazardous Waste") {
      this.wasteDisposal("Non_Hazardous")
    }
  }

  wasteDisposal(data: any) {
    this.wasteDisposalCard = []
    const disposalMethod = this.dropDownValue.filter(function (data) {
      return (data.attributes.Category === "Disposal Method")
    })
    if (data === "All") {
      const wasteData = this.envData.filter(function (data) {
        return (data.attributes.consumption_category === "Waste")
      })
      const grandTotal = wasteData.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
      disposalMethod.forEach(elem => {
        const data = this.envData.filter(function (data) {
          return (data.attributes.disposal_method === elem.attributes.Value)
        })
        const total = data.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
        const percentage = Math.round(Number(total) / Number(grandTotal) * 100).toFixed(0)
        if (grandTotal === 0) {
          this.wasteDisposalCard.push({
            name: elem.attributes.Value,
            count: 0,
            percentage: 0,
            category: elem.attributes.Value,
            unit: elem.attributes.unit
          })
        } else {
          this.wasteDisposalCard.push({
            name: elem.attributes.Value,
            count: total,
            percentage: percentage,
            category: elem.attributes.Value,
            unit: elem.attributes.unit
          })
        }
      })
    } else if (data === "Hazardous") {
      const wasteData = this.envData.filter(function (data) {
        return (data.attributes.consumption_category === "Waste")
      })
      const grandTotal = wasteData.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
      disposalMethod.forEach(elem => {
        const data = this.envData.filter(function (data) {
          return (data.attributes.disposal_method === elem.attributes.Value && data.attributes.category === "Hazardous")
        })
        const total = data.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
        const percentage = Math.round(Number(total) / Number(grandTotal) * 100).toFixed(0)
        if (grandTotal === 0) {
          this.wasteDisposalCard.push({
            name: elem.attributes.Value,
            count: 0,
            percentage: 0,
            category: elem.attributes.Value,
            unit: elem.attributes.unit
          })
        } else {
          this.wasteDisposalCard.push({
            name: elem.attributes.Value,
            count: total,
            percentage: percentage,
            category: elem.attributes.Value,
            unit: elem.attributes.unit
          })
        }
      })
    } else if (data === "Non_Hazardous") {
      const wasteData = this.envData.filter(function (data) {
        return (data.attributes.consumption_category === "Waste")
      })
      const grandTotal = wasteData.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
      disposalMethod.forEach(elem => {
        const data = this.envData.filter(function (data) {
          return (data.attributes.disposal_method === elem.attributes.Value && data.attributes.category === "Non Hazardous")
        })
        const total = data.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
        const percentage = Math.round(Number(total) / Number(grandTotal) * 100).toFixed(0)
        if (grandTotal === 0) {
          this.wasteDisposalCard.push({
            name: elem.attributes.Value,
            count: 0,
            percentage: 0,
            category: elem.attributes.Value,
            unit: elem.attributes.unit
          })
        } else {
          this.wasteDisposalCard.push({
            name: elem.attributes.Value,
            count: total,
            percentage: percentage,
            category: elem.attributes.Value,
            unit: elem.attributes.unit
          })
        }
      })
    }
  }

  wasteWaster() {
    this.wasteWaterCard = [];

    const totalData = this.envData.filter(data => data.attributes.consumption_category === "Wastewater");
    const grandTotal = totalData.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0);
    const treatment = this.dropDownValue.filter(data => data.attributes.Category === "Treatment Where");  
    treatment.forEach(elem => {
      const wasteData = this.envData.filter(data => data.attributes.treatment === elem.attributes.Value);     
      const total = wasteData.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0);
      const percentage = grandTotal === 0 ? 0 : (total / grandTotal * 100).toFixed(2);
      this.wasteWaterCard.push({
        name: elem.attributes.Value,
        count: total,
        percentage: percentage,
        category: elem.attributes.Value,
        unit: elem.attributes.unit,
        color: elem.attributes.badge
      });
    });

    this.WasteWaterChart.series = this.wasteWaterCard.map(data => Number(data.percentage) || 0);
    this.WasteWaterChart.labels = this.wasteWaterCard.map(data => data.name);

  }


  ghgEmission() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let monthlyData: any[] = []
    let scopeData: any[] = []
    let GHGEmissionChart: any[] = []
    var scope3Data = {
      name: 'Scope-3',
      data: [0]
    };
    var scope2Data = {
      name: 'Scope-2',
      data: [0]
    };
    var scope1Data = {
      name: 'Scope-1',
      data: [0]
    };
    months.forEach(monthElem => {
      const monthData = this.envData.filter(function (data) {
        return (data.attributes.environment.data.attributes.month === monthElem && data.attributes.consumption_category === "Energy" && data.attributes.emission_factor !== null)
      })



      monthData.forEach(eachElem => {
        const emission_factor = eachElem.attributes.emission_factor
        const quantity = eachElem.attributes.quantity

        const ghgEmission = (Number(Math.round(Number(quantity) * Number(emission_factor)) / 1000)).toFixed(2) || 0


        monthlyData.push({
          consumption_category: eachElem.attributes.consumption_category,
          emission_factor: eachElem.attributes.emission_factor,
          environment: eachElem.attributes.environment,
          quantity: eachElem.attributes.quantity,
          scope: eachElem.attributes.scope,
          source: eachElem.attributes.source,
          unit: eachElem.attributes.unit,
          emission: ghgEmission,
          month: eachElem.attributes.environment.data.attributes.month
        })

      })

    })
    const scope = this.dropDownValue.filter(function (data) {
      return (data.attributes.Category === "Scope")
    })
    scope.forEach(sopeElem => {
      const scopeVal = monthlyData.filter(function (data) {
        return (data.scope === sopeElem.attributes.Value)
      })
      scopeData.push({
        name: sopeElem.attributes.Value,
        data: scopeVal
      })
      months.forEach(elem => {
        const scopeVal2 = scopeVal.filter(function (data) {
          return (data.month === elem)
        })
        const total = scopeVal2.reduce((acc, cur) => acc + Number(cur.emission), 0)
        GHGEmissionChart.push({
          name: sopeElem.attributes.Value,
          data: total,
          month: elem
        })


      })
    })

    scope3Data.data = []
    scope2Data.data = []
    scope1Data.data = []

    GHGEmissionChart.forEach(elem => {
      if (elem.name === "Scope-3") {
        scope3Data.data.push(elem.data)
      } else if (elem.name === "Scope-2") {
        scope2Data.data.push(elem.data)
      } else if (elem.name === "Scope-1") {

        scope1Data.data.push(elem.data)

      }
    })


    this.GHGEmissionChart.series = [scope1Data, scope2Data, scope3Data]
  }

  wasteWater() {
    this.wasteWatersCard = []
    const data = this.envData.filter(function (data) {
      return (data.attributes.consumption_category === "Wastewater")
    })
    const grandTotal = data.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
    const sources = this.dropDownValue.filter(function (data) {
      return (data.attributes.Category === "Source" && data.attributes.filter === "Wastewater")
    })
    sources.forEach(elem => {
      const sourcesData = data.filter(function (data) {
        return (data.attributes.source === elem.attributes.Value)
      })
      const total = sourcesData.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0)
      const percentage = Math.round(Number(total) / Number(grandTotal) * 100).toFixed(0)
      if (grandTotal === 0) {
        this.wasteWatersCard.push({
          name: elem.attributes.Value,
          count: 0,
          percentage: 0,
          category: elem.attributes.Value,
          unit: elem.attributes.unit,
          color: elem.attributes.badge
        })
      } else {
        this.wasteWatersCard.push({
          name: elem.attributes.Value,
          count: total,
          percentage: percentage,
          category: elem.attributes.Value,
          unit: elem.attributes.unit,
          color: elem.attributes.badge
        })
      }
    })
  }

  targetSettingProgress() {
    this.targetSettings.forEach(elem => {
      const data = this.targetProgress.filter(function (elemData) {
        return (elemData.attributes.target_setting.data.id == elem.id)
      })
      const baseline = elem.attributes.baseline_consumption
      const acheived = data.reduce((acc, cur) => acc + Number(cur.attributes.actual_savings), 0)
      let percentage = '0'
      if (baseline > 0) {
        percentage = Math.round(Number(acheived) / Number(baseline) * 100).toFixed(0)
      }
      this.targetSettingProgressCard.push({
        category: elem.attributes.category,
        source: elem.attributes.source,
        name: elem.attributes.reference_number,
        baseline: baseline,
        acheived: acheived,
        percentage: percentage
      })
    })
  }

  emissionBreakdown() {

    const energyData = this.envData.filter(data => data.attributes.consumption_category === "Energy");
    const totalEmission = energyData.reduce((sum, data) => sum + data.attributes.ghg_value, 0);
    const energySource: Record<string, any[]> = {};

    energyData.forEach(data => {
      const source = data.attributes.source;

      if (!energySource[source]) {
        energySource[source] = [];
      }

      energySource[source].push(data);
    });

    const emissionPercentages: number[] = [];
    const emissions: string[] = [];
    const counts: number[] = [];

    for (const source in energySource) {
      const emissionValueSum = energySource[source].reduce((sum, data) => sum + data.attributes.ghg_value, 0);

      const emissionPercentage = Math.round((emissionValueSum / totalEmission) * 100).toFixed(2);

      emissionPercentages.push(Number(emissionPercentage));
      emissions.push(source);
      counts.push(Math.round(emissionValueSum));
    }

    this.emissionNames = emissions;
    this.emissionCounts = counts;
    this.emissionChart.series = emissionPercentages;
    this.emissionChart.labels = emissions;
  }

  water_wastewater_card() {
    const waterData = this.envData.filter(data => data.attributes.consumption_category === 'Water');
    const wasteWaterData = this.envData.filter(data => data.attributes.consumption_category === 'Wastewater');

    const waterTotal = waterData.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0);
    const wasteWaterTotal = wasteWaterData.reduce((acc, cur) => acc + Number(cur.attributes.quantity), 0);

    const wasteWaterPercentage = waterTotal !== 0 ? (wasteWaterTotal / waterTotal) * 100 : 0;

    const roundedWasteWaterPercentage = Math.round(wasteWaterPercentage);
    const roundedWasteWaterTotal = Math.round(wasteWaterTotal);

    this.waterWastewaterChart.series = [roundedWasteWaterPercentage];

    this.waterwastewaterCard = [
      {
        quantity: roundedWasteWaterTotal,
        Attrition: roundedWasteWaterPercentage + '%',
        Attrition_bg: 'text-danger',
        Attrition_icon: roundedWasteWaterTotal > waterTotal ? 'icon-arrow-up' : 'icon-arrow-down'
      }
    ];
  }



}




