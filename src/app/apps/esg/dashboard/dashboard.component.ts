import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import {
  ChartType, SDGChart, SDGTopFiveChart, SDGprogressChart,
  pillarChart, GHGEmissionChart, TotalEnergyConsumptionChart, waterWithdrawalChart, wasteStackedChart,
  EmployeeCountChart, ageDistributionChart, genderDistributionChart, empTypeChart, newHiresChart, newHiresAgeChart,
  newHiresGenderChart, attritionRateChart, attritionRateRegionChart, attritionRateAgeGroupChart, attritionRateGenderChart, attritionRateYOYChart,
  GenderRepChart, DisabilityRepChart, genderParityChart, SkillUpgradeChart, parentalLeaveChart, HRTrainedEMPChart, unionMembershipChart, retirementBenefitsChart,
  empInjuryChart, bodKmpDonutChart, govGrievanceRadialChart, supplierChart, trainingLineChart, TrainingByLevelChart, TrainingByFunctionChart
} from './chart-model';
import Swal from 'sweetalert2';
import { EsgService } from 'src/app/services/esg.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

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

  filterForm: FormGroup;
  dateRange: FormGroup;
  years: any[] = [];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  divisions: any[] = [];

  prevDateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });

  ESGData: any;

  currency: any
  orgID: any
  dropDownValue: any[] = []
  consumptionDropDownValue: any[] = []
  envData: any[] = []
  targetSettings: any[] = []
  targetProgress: any[] = []
  prevEnvData: any[] = []

  SDGSummaryCard: any[] = []
  SDGChart: ChartType
  sdgGoals: any[] = [];
  hoveredGoal: number | null = null;
  topSDGs: any[] = []; // Store top 5 SDGs for the chart
  SDGTopFiveChart: ChartType
  SDGprogressChart: ChartType
  pillarCard: { title: string; count: number }[] = [];
  pillarChart: ChartType
  topCumulativeImpacts: any[] = [];

  // ESG

  GHGEmissionChart: ChartType
  totalEnergyByYear: any[] = [];
  TotalEnergyConsumptionChart: ChartType

  waterWithdrawalChart: ChartType
  wasteStackedChart: ChartType
  EmployeeCountChart: ChartType
  ageDistributionChart: ChartType
  genderDistributionChart: ChartType
  empTypeChart: ChartType
  newHiresChart: ChartType
  newHiresAgeChart: ChartType
  newHiresGenderChart: ChartType
  attritionRateChart: ChartType
  attritionRateRegionChart: ChartType
  attritionRateAgeGroupChart: ChartType
  attritionRateGenderChart: ChartType
  attritionRateYOYChart: ChartType
  GenderRepChart: ChartType
  DisabilityRepChart: ChartType
  genderParityChart: ChartType
  SkillUpgradeChart: ChartType
  parentalLeaveChart: ChartType
  HRTrainedEMPChart: ChartType
  unionMembershipChart: ChartType
  retirementBenefitsChart: ChartType
  empInjuryChart: ChartType
  bodKmpDonutChart: ChartType
  govGrievanceRadialChart: ChartType
  supplierChart: ChartType
  trainingLineChart: ChartType
  TrainingByLevelChart: ChartType
  TrainingByFunctionChart: ChartType

  unitSpecific: any
  userDivision: any
  corporateUser: any
  targetuserDivision: any
  targetprouserDivision: any
  totalInitiatives: any

  completedCount: any
  happeningCount: any
  selectedGapType: 'average' | 'median' = 'average'; // default type
  rawEmpTypeData: any[] = [];
  rawEmpLevelData: any[] = [];

  selectedEmpType: string = 'Permanent'; // default option
  selectedEmpLevelType: string = 'Senior'; // default option
  availableLevels: string[] = [];
  lastUsedFilters: any = {};
  //  Store the backend response here so we can use it later
  rawGenderParityData: any[] = [];

  returnToWorkavailableYears: string[] = [];
  returnToWorkselectedYear: string = '';
  returnToWorkrawResponse: any[] = [];
  returnToWorkData: any = {};

  unionAvailableYears: string[] = [];
  unionSelectedYear: string = '';
  unionMembershipData: any = {};

  availableInjuryYears: string[] = [];
  selectedInjuryYear: string = '';
  empInjuryData: any = {};
  injuryCard: any[] = [];

  bodKmpavailableYears: string[] = [];
  bodKmpselectedYear: string = '';
  bodKmpData: any = {};


  govGrievanceData: any = {};
  govGrievanceAvailableYears: string[] = [];
  govGrievanceSelectedYear: string = '';
  govGrievanceAvailableGroups: string[] = [];
  govGrievanceSelectedGroup: string = '';
  govGrievanceTotalComplaints: any;

  selectedMode: string = 'calendar'; // Matches default in form
  fiscalMonthDisplay: string = '';  // what is shown in the input
  fiscalDate: Date | null = null;

  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public esgService: EsgService,
    private formBuilder: FormBuilder,
    private environService: EnvironmentService) { }

  ngOnInit() {
    this.showProgressPopup()
    this.configuration()
    this.dateRange = this.formBuilder.group({
      start: new FormControl(null),
      end: new FormControl(null),
      calendarStart: new FormControl(null),
      calendarEnd: new FormControl(null)
    });

    this.filterForm = this.formBuilder.group({
      startDate: [''],
      endDate: [''],
      prevStartDate: [''],
      prevEndDate: [''],
      year: [[]],
      month: [''],
      division: [''],
      mode: [this.selectedMode],
    });

    this.filterForm.get('mode')?.valueChanges.subscribe(mode => {
      this.selectedMode = mode;
    });
    // If the form has an initial year selected, enable the month
    const initialYear = this.filterForm.get('year')?.value;
    if (initialYear) {
      this.filterForm.get('month')?.enable();
    } else {
      this.filterForm.get('month')?.disable();
    }
    this.SDGChart = SDGChart
    this.SDGTopFiveChart = SDGTopFiveChart
    this.SDGprogressChart = SDGprogressChart
    this.pillarChart = pillarChart
    this.GHGEmissionChart = GHGEmissionChart
    this.TotalEnergyConsumptionChart = TotalEnergyConsumptionChart
    this.waterWithdrawalChart = waterWithdrawalChart
    this.wasteStackedChart = wasteStackedChart
    this.EmployeeCountChart = EmployeeCountChart
    this.ageDistributionChart = ageDistributionChart
    this.genderDistributionChart = genderDistributionChart
    this.empTypeChart = empTypeChart
    this.newHiresChart = newHiresChart
    this.newHiresAgeChart = newHiresAgeChart
    this.newHiresGenderChart = newHiresGenderChart
    this.attritionRateChart = attritionRateChart
    this.attritionRateRegionChart = attritionRateRegionChart
    this.attritionRateAgeGroupChart = attritionRateAgeGroupChart
    this.attritionRateGenderChart = attritionRateGenderChart
    this.attritionRateYOYChart = attritionRateYOYChart
    this.GenderRepChart = GenderRepChart
    this.DisabilityRepChart = DisabilityRepChart
    this.genderParityChart = genderParityChart
    this.SkillUpgradeChart = SkillUpgradeChart
    this.parentalLeaveChart = parentalLeaveChart
    this.HRTrainedEMPChart = HRTrainedEMPChart
    this.unionMembershipChart = unionMembershipChart
    this.retirementBenefitsChart = retirementBenefitsChart
    this.empInjuryChart = empInjuryChart
    this.bodKmpDonutChart = bodKmpDonutChart
    this.govGrievanceRadialChart = govGrievanceRadialChart
    this.supplierChart = supplierChart
    this.trainingLineChart = trainingLineChart
    this.TrainingByLevelChart = TrainingByLevelChart
    this.TrainingByFunctionChart = TrainingByFunctionChart


    var curr = new Date()
    const monthStart = new Date(curr.getUTCFullYear(), curr.getMonth());
    const monthEnd = new Date();
    const monthStartDate = monthStart.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
      monthStart.toLocaleDateString("en-US", { month: 'short' }) + "-" +
      monthStart.toLocaleDateString("en-US", { year: 'numeric' })
    const monthEndDate = monthEnd.toLocaleDateString("en-US", { day: 'numeric' }) + "-" +
      monthEnd.toLocaleDateString("en-US", { month: 'short' }) + "-" +
      monthEnd.toLocaleDateString("en-US", { year: 'numeric' })
    this.dateRange.controls['start'].setValue(monthStart);
    this.dateRange.controls['end'].setValue(monthEnd);

    const date = new Date(monthStartDate)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)

    const end = new Date(monthEndDate)
    const newEndDate = new Date(end.setDate(end.getDate() + 1)).toISOString().slice(0, 10)

    const lastMonthEnd = new Date(curr.getFullYear(), curr.getMonth(), 0);
    const prevNewEndDate = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), lastMonthEnd.getDate());
    const prevNewDate = new Date(prevNewEndDate);
    prevNewDate.setDate(1);

    const localPrevNewEndDate = new Date(
      prevNewEndDate.getTime() - prevNewEndDate.getTimezoneOffset() * 60000
    );
    const localPrevNewDate = new Date(
      prevNewDate.getTime() - prevNewDate.getTimezoneOffset() * 60000
    );

  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.esg
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          this.currency = result.data.attributes.currency
          this.years = result.data.attributes.Year
          // ✅ Set current year as default (ensure it's an array)
          const defaultYear = new Date().getFullYear().toString();
          this.filterForm.controls['year'].setValue([defaultYear]);
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
      complete: () => {
        Swal.close()
      }
    })
  }

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.esg_dashboard
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
          //this.get_consumption_dropdown_values()

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  get_dropdown_values() {
    this.esgService.get_dropdown_values().subscribe({
      next: (result: any) => {

        this.divisions = result[7].value
      },
      error: (err: any) => {
        console.error("Error fetching data:", err);
      },

      complete: () => {
        this.default_data()
      },
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

          divisions.push('filters[environment][divisions][division_uuid][$in]=' + elem.division_uuid)
        })
        let results = divisions.join('&');
        this.userDivision = results


      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        this.default_data()
      },
    });
  }
  monthSelected(event: Date, datepicker: MatDatepicker<Date>) {
    if (this.fiscalDate) {
      this.fiscalDate.setMonth(event.getMonth());
    } else {
      this.fiscalDate = new Date(event.getFullYear(), event.getMonth(), 1);
    }

    this.updateFiscalDisplay();
    this.updateFiscalRange(); // optional: populate start/end of month

    datepicker.close();
  }

  yearSelected(event: Date) {
    if (!this.fiscalDate) {
      this.fiscalDate = new Date(event.getFullYear(), 0, 1);
    } else {
      this.fiscalDate.setFullYear(event.getFullYear());
    }
  }

  updateFiscalDisplay() {
    const options = { year: 'numeric', month: 'long' } as const;
    this.fiscalMonthDisplay = this.fiscalDate?.toLocaleDateString('en-US', options) || '';
  }

  updateFiscalRange() {
    if (!this.fiscalDate) return;
    const start = new Date(this.fiscalDate.getFullYear(), this.fiscalDate.getMonth(), 1);
    const end = new Date(this.fiscalDate.getFullYear(), this.fiscalDate.getMonth() + 1, 0);

    this.filterForm.patchValue({
      prevStartDate: start,
      prevEndDate: end
    });
  }

  buildFilters(): any {
    const filters: any = {};

    const year = this.filterForm.get('year')?.value;
    const month = this.filterForm.get('month')?.value;
    const division = this.filterForm.get('division')?.value;
    const start = this.dateRange.get('start')?.value;
    const end = this.dateRange.get('end')?.value;
    const mode = this.filterForm.get('mode')?.value;

    // Handle year as an array, whether it's a single year or multiple years
    if (Array.isArray(year) && year.length > 0) {
      filters.year = year;  // multiple selected years
    } else if (year) {
      filters.year = [year];  // single selected year, convert to array for consistency
    }

    // If both month and year are selected, filter by month and year
    if (month && year) filters.month = month;

    // Handle division filter
    if (division) filters.division = division;

    // Only add date range if year is not selected
    if (!year && start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        filters.startDate = startDate.toISOString();
        filters.endDate = endDate.toISOString();
      }
    }

    return filters;
  }

  onModeChange(event: any) {
    const selectedMode = event.value;
    this.selectedMode = selectedMode;

    if (selectedMode === 'fiscal') {
      const selectedYear = this.filterForm.get('year')?.value?.[0];
      if (selectedYear) {
        const start = new Date(`${selectedYear}-04-01`);
        const end = new Date(`${+selectedYear + 1}-03-31`);
        this.dateRange.patchValue({ start, end });
      }
    } else if (selectedMode === 'calendar') {
      this.dateRange.patchValue({ calendarStart: null, calendarEnd: null });
    }
  }

  search(): void {
    const filters = this.buildFilters(); // Get combined filters
    this.lastUsedFilters = filters;
    // Now pass filters to each card/chart
    this.SDGinitiativesCard(filters);
    this.SDGDistributionCard(filters)
    this.SDGTopFiveCard(filters)
    this.SDGProgressCard(filters)
    this.pillarCounts(filters)
    this.cumulativeImpactsCard(filters)
    // ESG
    // ENV
    this.ENVGHGEmissionCard(filters)
    this.ENVEnergyTotalCard(filters)
    this.ENVWaterTotalCard(filters)
    this.ENVWasteTotalCard(filters)
    this.SOCEmpTotalCard(filters)
    this.SOCAgeTotalCard(filters)
    this.SOCGenderTotalCard(filters)
    this.SOCEmpTypeCard(filters)
    this.SOCnewHireCard(filters)
    this.SOCnewHireAgeCard(filters)
    this.SOCnewHiresGenderCard(filters)
    this.SOCAllTurnOverCard(filters)
    this.SOCTurnOverRegionCard(filters)
    this.SOCTurnOverAgeCard(filters)
    this.SOCTurnOverGenderCard(filters)
    this.SOCTurnOverYOYCard(filters)
    this.SOCGenderRepCard(filters)
    this.SOCDisabilityRepCard(filters)
    this.SOCGenderParityCard(filters)
    this.SOCSkillUpgradeCard(filters)
    this.SOCreturnToWork12MCard(filters)
    this.SOCHRTrainedEmployeeCard(filters)
    this.SOCUnionMembershipCard(filters)
    this.SOCRetirementBenefitsCard(filters)
    this.SOCEmpInjuryCounts(filters)
    this.GOVBODKMPChart(filters)
    this.GOVGrievanceChart(filters)
    this.SOCSupplierChart(filters)
    this.SOCTotalTrainingHoursChart(filters)
    this.SOCTrainingByLevelChart(filters)
    this.SOCTrainingByFunctionChart(filters)


    // Call your service here
  }


  reset(): void {
    this.filterForm.reset();
    this.dateRange.reset();
    // this.default_data(); // Optional: fetch all data
  }

  yearVal(event: any): void {
    const selectedYears: number[] = event?.value || [];

    if (selectedYears.length > 0) {
      this.filterForm.get('month')?.enable();
      const selectedMonth = this.filterForm.get('month')?.value;
      if (!selectedMonth) {
        this.dateRange.reset(); // Clear date range when year changes
      }
    } else {
      this.filterForm.get('month')?.disable();
      this.dateRange.reset();
    }
  }

  monthVal(event: any): void {

    const monthName = event?.value;
    const selectedYear = Number(this.filterForm.get('year')?.value);

    const monthMap: Record<string, number> = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const monthIndex = monthMap[monthName];

    if (!isNaN(monthIndex) && !isNaN(selectedYear)) {
      const start = moment({ year: selectedYear, month: monthIndex, day: 1 }).startOf('day');
      const end = start.clone().endOf('month');

      if (start.isValid() && end.isValid()) {
        this.dateRange.controls['start'].setValue(start.toISOString());
        this.dateRange.controls['end'].setValue(end.toISOString());
      } else {
        console.warn('Invalid moment dates generated.');
        this.dateRange.reset();
      }
    } else {
      this.dateRange.reset();
    }
  }

  startDateChange(event: any): void {
    this.dateRange.patchValue({ start: event.value });

    // Clear year/month when custom date selected
    this.filterForm.get('year')?.reset();
    this.filterForm.get('month')?.reset();
    this.filterForm.get('month')?.disable();
  }

  endDateChange(event: any): void {
    this.dateRange.patchValue({ end: event.value });

    // Clear year/month when custom date selected
    this.filterForm.get('year')?.reset();
    this.filterForm.get('month')?.reset();
    this.filterForm.get('month')?.disable();
  }

  // onEmpTypeChange(event: any) {
  //   const selectedType = event.target.value;
  //   this.SOCEmpTypeCard(selectedType);
  // }

  // onEmpTypeChange(event: Event) {
  //   this.selectedEmpType = (event.target as HTMLSelectElement).value;

  //   // Re-call chart with new selection and last used filters
  //   this.SOCEmpTypeCard(this.lastUsedFilters);
  // }


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
  // default_data() {

  //   const year = this.filterForm.value.year
  //   this.environService.get_environ_data_year(year, this.userDivision).subscribe({
  //     next: (result: any) => {
  //       this.envData = result.data
  //       this.environService.get_target_setting_data(this.targetuserDivision).subscribe({
  //         next: (result: any) => {
  //           this.targetSettings = result.data
  //         },
  //         error: (err: any) => { },
  //         complete: () => {
  //           this.environService.get_target_progress_data(this.targetprouserDivision).subscribe({
  //             next: (result: any) => {
  //               this.targetProgress = result.data
  //             },
  //             error: (err: any) => { },
  //             complete: () => {
  //               this.get_previous_year_data()

  //             }
  //           })
  //         }
  //       })
  //     },
  //     error: (err: any) => { },
  //     complete: () => {
  //     }
  //   })
  // }

  default_data(): void {
    this.dateRange.reset(); // No custom date range

    const currentYear = new Date().getFullYear().toString();

    // Set year only, leave month and division blank to include all
    this.filterForm.get('year')?.setValue([currentYear]);
    this.filterForm.get('month')?.reset(); // No month restriction
    this.filterForm.get('division')?.reset(); // No division restriction

    const filters = this.buildFilters();
    this.lastUsedFilters = filters;

    // Call all chart functions with default filters
    this.SDGinitiativesCard(filters);
    this.SDGDistributionCard(filters);
    this.SDGTopFiveCard(filters);
    this.SDGProgressCard(filters);
    this.pillarCounts(filters);
    this.cumulativeImpactsCard(filters);
    this.ENVGHGEmissionCard(filters);
    this.ENVEnergyTotalCard(filters);
    this.ENVWaterTotalCard(filters);
    this.ENVWasteTotalCard(filters);
    this.SOCEmpTotalCard(filters);
    this.SOCAgeTotalCard(filters);
    this.SOCGenderTotalCard(filters);
    this.SOCEmpTypeCard(filters);
    this.SOCnewHireCard(filters);
    this.SOCnewHireAgeCard(filters);
    this.SOCnewHiresGenderCard(filters);
    this.SOCAllTurnOverCard(filters);
    this.SOCTurnOverRegionCard(filters);
    this.SOCTurnOverAgeCard(filters);
    this.SOCTurnOverGenderCard(filters);
    this.SOCTurnOverYOYCard(filters);
    this.SOCGenderRepCard(filters);
    this.SOCDisabilityRepCard(filters);
    this.SOCGenderParityCard(filters);
    this.SOCSkillUpgradeCard(filters);
    this.SOCreturnToWork12MCard(filters);
    this.SOCHRTrainedEmployeeCard(filters);
    this.SOCUnionMembershipCard(filters);
    this.SOCRetirementBenefitsCard(filters)
    this.SOCEmpInjuryCounts(filters)
    this.GOVBODKMPChart(filters)
    this.GOVGrievanceChart(filters)
    this.SOCSupplierChart(filters)
    this.SOCTotalTrainingHoursChart(filters)
    this.SOCTrainingByLevelChart(filters)
    this.SOCTrainingByFunctionChart(filters)

  }

  get_previous_year_data() {
    const current_year = this.filterForm.value.year
    const previous_year = Number(current_year) - 1
    this.environService.get_environ_data_year(previous_year, this.userDivision).subscribe({
      next: (result: any) => {
        this.prevEnvData = result.data
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
  }


  // 1. SDG Initiatives chart

  SDGinitiativesCard(filters: any) {
    this.esgService.getSDGValues(filters).subscribe({
      next: (response: any) => {
        if (response && response?.length > 0) {
          const data = response[0];

          // Extract counts from API response
          this.happeningCount = data.happeningCount || 0;
          this.completedCount = data.completedCount || 0;
          this.totalInitiatives = this.happeningCount + this.completedCount;

          // Prevent division by zero
          if (this.totalInitiatives === 0) {
            this.SDGChart.series = [0, 0];
            this.SDGChart.labels = ["Happening", "Completed"];
            return;
          }

          // Calculate percentages
          const happeningPercentage = parseFloat(((this.happeningCount / this.totalInitiatives) * 100).toFixed(2));
          const completedPercentage = parseFloat(((this.completedCount / this.totalInitiatives) * 100).toFixed(2));

          // Update Pie Chart
          this.SDGChart.series = [happeningPercentage, completedPercentage];
          this.SDGChart.labels = ["Happening", "Completed"];


          // Update Summary Card Data
          this.SDGSummaryCard = [
            {
              category: "Total SDG Initiatives",
              quantity: this.totalInitiatives,
              attrition: "0%", // Adjust if needed
              attrition_bg: "text-success", // Adjust color if needed
              attrition_icon: "", // Add icon if needed
              icon: "total.png"
            },
            {
              category: "Happening",
              quantity: this.happeningCount,
              attrition: "0%", // Adjust if needed
              attrition_bg: "text-warning",
              attrition_icon: "",
              icon: "happening.png"
            },
            {
              category: "Completed",
              quantity: this.completedCount,
              attrition: "0%",
              attrition_bg: "text-success",
              attrition_icon: "",
              icon: "completed.png"
            }
          ];

        }
      },
      error: (error) => {
        console.error("Error fetching SDG data:", error);
      }
    });
  }

  // 2. SDG Distribution chart

  SDGDistributionCard(filters: any) {
    this.esgService.getSDGValues(filters).subscribe({
      next: (response: any) => {

        // Check if response exists and contains SDGCounts
        if (response && response?.length > 0 && response[0].SDGCounts) {
          this.sdgGoals = response[0].SDGCounts.map((goal: any) => ({
            id: goal.id,
            name: goal.name,
            count: goal.count || 0, // Ensure count defaults to 0
            imageUrl: `assets/images/ESG_Dashboard/SDGGoals/${goal.id}.png` // Adjust the path as needed
          }));
        } else {
          console.warn("SDGCounts data missing in response.");
          this.sdgGoals = []; // Set empty array to avoid UI errors
        }
      },
      error: (error) => {
        console.error("Error fetching SDG distributions:", error);
      }
    });
  }


  SDGTopFiveCard(filters: any) {
    this.esgService.getSDGValues(filters).subscribe({
      next: (response: any) => {


        if (response && response[0].SDGTopFive) {
          const sdgData = response[0].SDGTopFive;

          // Extract SDG names and counts
          const sdgNames = sdgData.map((sdg: any) => sdg.name);
          const sdgCounts = sdgData.map((sdg: any) => sdg.count);
          const maxCount = Math.max(...sdgCounts);
          const dynamicMax = Math.ceil(maxCount);
          // Update chart categories and data
          SDGTopFiveChart.xaxis = {
            categories: sdgNames,
            title: {
              text: 'Initiatives'
            },
            min: 0,
            max: dynamicMax,
            tickAmount: dynamicMax > 10 ? 10 : dynamicMax,
            labels: {
              formatter: function (value: any) {
                return parseInt(value); // Convert the value to an integer
              }
            }
          };
          SDGTopFiveChart.yaxis = {
            title: {
              text: 'SDG Names'
            },
          };


          SDGTopFiveChart.series = [{ name: "Initiatives", data: sdgCounts }];
        }
      },
      error: (error) => {
        console.error("Error fetching SDG distributions:", error);
      }
    });
  }

  SDGProgressCard(filters: any) {
    this.esgService.getSDGValues(filters).subscribe({
      next: (response: any) => {

        // Prepare full list of 17 SDGs
        const sdgLabels: string[] = [];
        const happeningData: number[] = [];
        const completedData: number[] = [];

        const sdgMap = new Map<number, { happening: number; completed: number }>();
        response[0].SDGProgress.forEach((item: any) => {
          sdgMap.set(item.sdgNumber, {
            happening: item.happeningCount || 0,
            completed: item.completedCount || 0
          });
        });

        for (let i = 1; i <= 17; i++) {
          sdgLabels.push(`SDG ${i}`);
          happeningData.push(sdgMap.get(i)?.happening || 0);
          completedData.push(sdgMap.get(i)?.completed || 0);
        }
        const allCounts = [...happeningData, ...completedData];

        // Find the maximum count across both 'Happening' and 'Completed'

        const maxCount = Math.max(...allCounts, 0);
        const dynamicMaxY = Math.ceil(maxCount);

        SDGprogressChart.xaxis = {
          categories: sdgLabels,
          title: {
            text: 'SDG Numbers'
          }
        };
        SDGprogressChart.yaxis = {
          title: {
            text: 'Progress'
          },
          min: 0,
          max: dynamicMaxY,
          tickAmount: dynamicMaxY <= 2 ? dynamicMaxY : (dynamicMaxY <= 5 ? 5 : 10),
          labels: {
            formatter: function (value: any) {
              return parseInt(value); // Convert the value to an integer
            }
          }
        };
        SDGprogressChart.series = [
          { name: 'Completed', data: completedData },
          { name: 'Happening', data: happeningData }
        ];
      },
      error: (error) => {
        console.error("Error fetching SDG progress data:", error);
      }
    });
  }


  pillarCounts(filters: any) {
    this.esgService.getSDGValues(filters).subscribe({
      next: (response: any) => {
        const data = response[0].pillarCountMap || {};

        // Standard order
        const labels = ['Peace', 'Partnership', 'Prosperity', 'People', 'Planet'];
        const values = labels.map(label => data[label] || 0);

        // Update card info
        this.pillarCard = labels.map((label, i) => ({
          title: label,
          count: values[i]
        }));

        // Dynamically update the chart
        this.pillarChart = {
          ...this.pillarChart,
          series: values,
          labels: labels
        };
      },
      error: (error) => {
        console.error('Error fetching SDG pillar data:', error);
      }
    });
  }

  cumulativeImpactsCard(filters: any) {
    this.esgService.getSDGValues(filters).subscribe({
      next: (response: any) => {

        if (!response || response?.length === 0 || !response[0].impactSummary) return;

        // Extract impact summary data
        const impactData = response[0].impactSummary;

        // Convert object to array format
        const impactArray = Object.keys(impactData).map((key) => ({
          name: key,
          count: impactData[key].count,  // Extract count
          sum: impactData[key].sum,      // Extract sum
          unit: impactData[key].unit     // Extract unit
        }));

        // Sort by count in descending order
        const sortedImpacts = impactArray
          .filter((impact) => impact.count > 0) // Exclude zero-count impacts
          .sort((a, b) => b.count - a.count)   // Sort in descending order
          .slice(0, 10); // Take top 10

        this.topCumulativeImpacts = sortedImpacts;
      },
      error: (error) => {
        console.error('Error fetching cumulative Impacts Card data:', error);
      }
    });
  }

  // ESG Dashboard
  ENVGHGEmissionCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe((response: any) => {
      const data = response[0]?.ghgEmissionData as any[] || [];

      const years = Array.from(new Set(
        data.map((i: any) => Number(i.year))
      ))
        .filter(y => !isNaN(y))
        .sort((a, b) => a - b);


      let paddedYears: string[];
      if (years.length === 1) {
        const y = years[0];
        paddedYears = [(y - 2).toString(), (y - 1).toString(), y.toString(), (y + 1).toString()];
      } else {
        paddedYears = years.map(y => y.toString());
      }

      this.GHGEmissionChart.xaxis = {
        ...this.GHGEmissionChart.xaxis,
        categories: paddedYears,
        type: 'category'
      };

      const scope1Series = paddedYears.map(year => {
        const entry = data.find(e => Number(e.year) === Number(year));
        return entry?.scope1 ?? null;
      });

      const scope2Series = paddedYears.map(year => {
        const entry = data.find(e => Number(e.year) === Number(year));
        return entry?.scope2 ?? null;
      });

      const scope3Series = paddedYears.map(year => {
        const entry = data.find(e => Number(e.year) === Number(year));
        return entry?.scope3?.total ?? null;
      });

      this.GHGEmissionChart.series = [
        { name: 'Scope-3', data: scope3Series },
        { name: 'Scope-2', data: scope2Series },
        { name: 'Scope-1', data: scope1Series },
      ];
    });
  }


  ENVEnergyTotalCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {

        const raw = response[0]?.TotalEnergyConsumption || [];
        const years = raw.map((i: any) => i.year.toString());
        const values = raw.map((i: any) => i.totalEnergy_MWh);

        // Rebuild the chart object
        this.TotalEnergyConsumptionChart = {
          ...this.TotalEnergyConsumptionChart,
          xaxis: {
            ...this.TotalEnergyConsumptionChart.xaxis,
            categories: years,
            type: 'category'
          },
          series: [{
            name: 'Total Energy (MWh)',
            data: values
          }]
        };
      },
      error: err => console.error('Error fetching total energy:', err)
    });
  }

  ENVWaterTotalCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const raw = response[0]?.WaterWithdrawalByYear as any[] || [];

        if (!raw || !raw.length) {
          this.waterWithdrawalChart = {
            ...waterWithdrawalChart,
            series: [],
            xaxis: { categories: [] }
          };
          return;
        }

        const years = Array.from(new Set(
          raw.map((i: any) => Number(i.year))
        ))
          .filter(y => !isNaN(y))
          .sort((a, b) => a - b);


        let paddedYears: string[];
        if (years.length === 1) {
          const y = years[0];
          paddedYears = [(y - 2).toString(), (y - 1).toString(), y.toString(), (y + 1).toString()];
        } else {
          paddedYears = years.map(y => y.toString());
        }



        // const categories: string[] = raw.map((item: any) => item.year.toString());

        // Dynamically get all unique sources from the first row
        const sourceKeys = Object.keys(raw[0]).filter(
          key => key !== 'year' && key !== 'totalWithdrawal_m3'
        );

        // const series = sourceKeys.map(source => ({
        //   name: source,
        //   data: raw.map((item: any) => item[source] || 0)
        // }));


        const series = sourceKeys.map(source => ({
          name: source,
          data: paddedYears.map(year => {
            const entry = raw.find(e => e.year.toString() === year);
            return entry?.[source] ?? 0; // Or null if you want gaps instead of 0s
          })
        }));


        this.waterWithdrawalChart = {
          ...this.waterWithdrawalChart,
          xaxis: {
            ...this.waterWithdrawalChart.xaxis,
            categories: paddedYears
          },
          series: series
        };
      },
      error: err => console.error('Error fetching Water Withdrawal data:', err)
    });
  }

  ENVWasteTotalCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {

        const raw = response[0]?.wasteDisposed || [];
        // if (!raw?.length) return;
        if (!raw || !raw.length) {
          this.wasteStackedChart = {
            ...wasteStackedChart,
            series: [],
            xaxis: { categories: [] }
          };
          return;
        }
        // Get all unique years
        const years = [...new Set(raw.map((item: any) => item.year.toString()))];

        // Get all unique type_of_disposal entries
        const disposalTypes = [...new Set(raw.map((item: any) => item.type_of_disposal))];

        // Initialize series per disposal type
        const series = disposalTypes.map(disposal => {
          const data = years.map(year => {
            // Sum all matching entries (just in case there are multiple categories per year-disposal)
            const total = raw
              .filter((item: any) => item.year === year && item.type_of_disposal === disposal)
              .reduce((sum: number, item: any) => sum + item.value, 0);

            return Number(total.toFixed(3)); // Optional: round to 3 decimal places
          });

          return {
            name: disposal,
            data: data
          };
        });


        this.wasteStackedChart = {
          ...this.wasteStackedChart,
          xaxis: {
            ...this.wasteStackedChart.xaxis,
            categories: years
          },
          series: series
        };
      },
      error: err => console.error('Error fetching Waste data:', err)
    });
  }

  SOCEmpTotalCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const employeeTrendData = response[0]?.totalEMPSOC || [];

        const employeeYears = employeeTrendData.map((item: any) => item.year.toString());
        const totalCounts = employeeTrendData.map((item: any) => item.total);

        this.EmployeeCountChart = {
          ...this.EmployeeCountChart,
          xaxis: {
            ...this.EmployeeCountChart.xaxis,
            categories: employeeYears
          },
          series: [
            {
              name: 'Total Employees',
              data: totalCounts
            }
          ]
        };

      },
      error: err => console.error('Error fetching Waste data:', err)
    });
  }

  SOCAgeTotalCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const AgedistributionData = response[0]?.ageDistribution || [];
        const years: string[] = [];
        const under30Data: number[] = [];
        const between30And50Data: number[] = [];
        const over50Data: number[] = [];

        AgedistributionData.forEach((item: any) => {
          const year = item.year;
          years.push(year.toString());

          const ag = item.ageGroups;

          under30Data.push(ag['Under 30 years old']?.total || 0);
          between30And50Data.push(ag['30-50 years old']?.total || 0);
          over50Data.push(ag['Over 50 years old']?.total || 0);
        });

        this.ageDistributionChart = {
          ...this.ageDistributionChart,
          xaxis: {
            ...this.ageDistributionChart.xaxis,
            categories: years
          },
          series: [
            {
              name: 'Under 30',
              data: under30Data
            },
            {
              name: '30-50',
              data: between30And50Data
            },
            {
              name: 'Over 50',
              data: over50Data
            }
          ]
        };
      },
      error: err => console.error('Error fetching Age Distribution data:', err)
    });
  }

  SOCGenderTotalCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const GenderdistributionData = response[0]?.genderDistribution || [];

        const years: string[] = [];
        const maleData: number[] = [];
        const femaleData: number[] = [];
        const otherData: number[] = [];

        GenderdistributionData.forEach((item: any) => {
          years.push(item.year.toString());
          maleData.push(item.malePercentage || 0);
          femaleData.push(item.femalePercentage || 0);
          otherData.push(item.otherPercentage || 0);
        });

        this.genderDistributionChart = {
          ...genderDistributionChart, // <- from chart-model.ts
          xaxis: {
            ...genderDistributionChart.xaxis,
            categories: years
          },
          series: [
            {
              name: 'Male',
              data: maleData
            },
            {
              name: 'Female',
              data: femaleData
            },
            {
              name: 'Other',
              data: otherData
            },
          ]
        };
      },
      error: err => console.error('Error fetching Gender Distribution data:', err)
    });
  }

  // Chart update logic (reusable on dropdown change)
  updateEmpTypeChart(): void {
    const chartData = this.rawEmpTypeData;

    const years: string[] = [];
    const maleCount: number[] = [];
    const femaleCount: number[] = [];
    const otherCount: number[] = [];

    chartData.forEach((item: any) => {
      const year = item.year.toString();
      const empTypeData = item[this.selectedEmpType] || { male: 0, female: 0, other: 0 };

      years.push(year);
      maleCount.push(empTypeData.male || 0);
      femaleCount.push(empTypeData.female || 0);
      otherCount.push(empTypeData.other || 0);
    });

    this.empTypeChart = {
      ...empTypeChart,
      xaxis: {
        ...empTypeChart.xaxis,
        categories: years
      },
      series: [
        { name: 'Male', data: maleCount },
        { name: 'Female', data: femaleCount },
        { name: 'Other', data: otherCount }
      ]
    };
  }

  // Dropdown change handler
  onEmpTypeChange(event: Event): void {
    this.selectedEmpType = (event.target as HTMLSelectElement).value;
    this.updateEmpTypeChart();
  }
  SOCEmpTypeCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        this.rawEmpTypeData = response[0]?.EmployeeTypeData || [];

        // Call chart updater with the default or selected type
        this.updateEmpTypeChart();
      },
      error: err => console.error('Error fetching employee type data:', err)
    });
  }


  SOCnewHireCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const newHiresData = response[0]?.newHires || [];

        const fiscalYears: string[] = [];
        const totalHires: number[] = [];

        newHiresData.forEach((item: any) => {
          const year = parseInt(item.year);
          if (year) {
            const fy = this.getFiscalYearLabel(year);
            fiscalYears.push(fy);
            totalHires.push(item.employeeHires || 0);
          }
        });

        this.newHiresChart = {
          ...newHiresChart,
          xaxis: {
            ...newHiresChart.xaxis,
            categories: fiscalYears
          },
          series: [
            {
              name: 'Total New Hires',
              data: totalHires
            }
          ]
        };
      },
      error: err => console.error('Error loading new hires trend chart', err)
    });
  }

  SOCnewHireAgeCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const newHiresAgeData = response[0]?.newHiresAge || [];

        // Arrays to hold the processed data for chart
        const fiscalYears: string[] = [];
        const under30: number[] = [];
        const between30and50: number[] = [];
        const over50: number[] = [];

        newHiresAgeData.forEach((item: any) => {
          const year = parseInt(item.year);
          if (year) {
            const fy = this.getFiscalYearLabel(year);
            fiscalYears.push(fy);
            // Add the respective values to each age group
            under30.push(parseInt(item.under30 || '0'));  // Hires under 30
            between30and50.push(parseInt(item.between30and50 || '0')); // Hires between 30-50
            over50.push(parseInt(item.over50 || '0')); // Hires over 50
          }
        });

        // Configure the chart with all three age groups
        this.newHiresAgeChart = {
          ...newHiresAgeChart,
          xaxis: {
            ...newHiresAgeChart.xaxis,
            categories: fiscalYears
          },
          series: [
            {
              name: 'Under 30 years old',
              data: under30
            },
            {
              name: '30-50 years old',
              data: between30and50
            },
            {
              name: 'Over 50 years old',
              data: over50
            }
          ]
        };
      },
      error: err => console.error('Error loading new hires trend chart', err)
    });
  }

  SOCnewHiresGenderCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const newHiresGenderData = response[0]?.newHiresGender || [];

        const fiscalYears: string[] = [];
        const maleHires: number[] = [];
        const femaleHires: number[] = [];
        const otherHires: number[] = [];

        newHiresGenderData.forEach((item: any) => {
          const year = parseInt(item.year);
          if (year) {
            const fy = this.getFiscalYearLabel(year);
            fiscalYears.push(fy);

            const maleCount = parseInt(item.male ?? '0');
            const femaleCount = parseInt(item.female ?? '0');
            const otherCount = parseInt(item.other ?? '0');

            const total = maleCount + femaleCount + otherCount;

            if (total > 0) {
              maleHires.push((maleCount / total) * 100);
              femaleHires.push((femaleCount / total) * 100);
              otherHires.push((otherCount / total) * 100);
            } else {
              maleHires.push(0);
              femaleHires.push(0);
              otherHires.push(0);
            }
          }
        });

        this.newHiresGenderChart = {
          ...newHiresGenderChart,
          xaxis: {
            ...newHiresGenderChart.xaxis,
            categories: fiscalYears
          },
          series: [
            {
              name: 'Male',
              data: maleHires
            },
            {
              name: 'Female',
              data: femaleHires
            },
            {
              name: 'Other',
              data: otherHires
            }
          ]
        };
      },
      error: err => console.error('Error loading new hires gender chart', err)
    });
  }
  SOCAllTurnOverCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const attritionData = response[0]?.overallAttritionTrend || [];

        const fiscalYears: string[] = [];
        const attritionRates: number[] = [];

        attritionData.forEach((item: any) => {
          const year = parseInt(item.year);
          const rate = parseFloat(item.attritionRate ?? '0');

          if (year) {
            const fy = this.getFiscalYearLabel(year);
            fiscalYears.push(fy);
            attritionRates.push(rate);
          }
        });

        this.attritionRateChart = {
          ...attritionRateChart,
          xaxis: {
            ...attritionRateChart.xaxis,
            categories: fiscalYears
          },
          series: [
            {
              name: 'Turnover Rate (%)',
              data: attritionRates
            }
          ]
        };
      },
      error: err => console.error('Error loading Turnover rate chart', err)
    });
  }

  SOCTurnOverRegionCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const turnoverByRegion = response[0]?.turnoverRegionData || [];

        const fiscalYearSet = new Set<string>();
        const regions: string[] = [];
        const regionAttritionMap: Record<string, Record<string, number>> = {};

        // Step 1: Extract unique fiscal years and organize attrition data per region
        turnoverByRegion.forEach((regionData: any) => {
          const region = regionData.region;
          if (!regions.includes(region)) regions.push(region);
          if (!regionAttritionMap[region]) regionAttritionMap[region] = {};

          regionData.turnovers.forEach((turnover: any) => {
            const fiscalYear = this.getFiscalYearLabel(parseInt(turnover.year)); // returns '2023'
            fiscalYearSet.add(fiscalYear);

            const attritionRate = parseFloat(turnover.attritionRate ?? '0');
            regionAttritionMap[region][fiscalYear] = attritionRate;
          });
        });

        // Step 2: Sort fiscal years numerically
        const fiscalYears = Array.from(fiscalYearSet).sort((a, b) => parseInt(a) - parseInt(b));

        // Step 3: Build chart config
        this.attritionRateRegionChart = {
          ...attritionRateRegionChart,
          xaxis: {
            ...attritionRateRegionChart.xaxis,
            categories: fiscalYears
          },
          series: regions.map(region => ({
            name: region,
            data: fiscalYears.map(fy => parseFloat((regionAttritionMap[region]?.[fy] || 0).toFixed(2)))
          }))
        };
      },
      error: err => console.error('Error loading voluntary Turnover rate by region chart', err)
    });
  }

  SOCTurnOverAgeCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const turnoverByAge = response[0]?.turnoverAgeData || [];

        const fiscalYearSet = new Set<string>();
        const ageGroups: string[] = [];
        const ageGroupAttritionMap: Record<string, Record<string, number>> = {};

        // Step 1: Collect data by age group and fiscal year
        turnoverByAge.forEach((ageData: any) => {
          const ageGroup = ageData.age_group;
          if (!ageGroups.includes(ageGroup)) ageGroups.push(ageGroup);
          if (!ageGroupAttritionMap[ageGroup]) ageGroupAttritionMap[ageGroup] = {};

          ageData.trend.forEach((turnover: any) => {
            const fiscalYear = this.getFiscalYearLabel(parseInt(turnover.year)); // returns '2023'
            fiscalYearSet.add(fiscalYear);

            const attritionRate = parseFloat(turnover.attritionRate ?? '0');
            ageGroupAttritionMap[ageGroup][fiscalYear] = attritionRate;
          });
        });

        // Step 2: Sort fiscal years numerically
        const fiscalYears = Array.from(fiscalYearSet).sort((a, b) => parseInt(a) - parseInt(b));

        // Step 3: Build the chart data
        this.attritionRateAgeGroupChart = {
          ...attritionRateAgeGroupChart,
          xaxis: {
            ...attritionRateAgeGroupChart.xaxis,
            categories: fiscalYears
          },
          series: ageGroups.map(ageGroup => ({
            name: ageGroup,
            data: fiscalYears.map(fy => parseFloat((ageGroupAttritionMap[ageGroup]?.[fy] || 0).toFixed(2)))
          }))
        };
      },
      error: err => console.error('Error loading voluntary Turnover rate by age group chart', err)
    });
  }

  SOCTurnOverGenderCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const turnoverGenderData = response[0]?.turnoverGenderData || [];

        const fiscalYears: string[] = [];
        const genders: string[] = ['male', 'female', 'other'];
        const genderAttritionData: Record<string, number[]> = {
          male: [],
          female: [],
          other: []
        };

        // Loop through each year's data
        turnoverGenderData.forEach((yearData: any) => {
          const year = yearData.year;
          const fy = this.getFiscalYearLabel(parseInt(year));

          if (!fiscalYears.includes(fy)) {
            fiscalYears.push(fy);
          }

          const yearIndex = fiscalYears.indexOf(fy);

          genders.forEach(gender => {
            const attritionRate = parseFloat(yearData[gender]?.attritionRate ?? '0');

            if (!genderAttritionData[gender]) {
              genderAttritionData[gender] = [];
            }

            genderAttritionData[gender][yearIndex] = attritionRate;
          });
        });

        // Update chart config
        this.attritionRateGenderChart = {
          ...attritionRateGenderChart,
          xaxis: {
            ...attritionRateGenderChart.xaxis,
            categories: fiscalYears
          },
          series: genders.map(gender => ({
            name: gender.charAt(0).toUpperCase() + gender.slice(1),
            data: fiscalYears.map((_, index) =>
              parseFloat((genderAttritionData[gender][index] || 0).toFixed(2))
            )
          }))
        };

      },
      error: err => console.error('Error loading voluntary Turnover rate by gender chart', err)
    });
  }
  SOCTurnOverYOYCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const turnoverYOYData = response[0]?.turnoverYOYData || [];

        const fiscalYearsSet: Set<string> = new Set();
        const regionAttritionData: Record<string, Record<string, { attritionRate: number; turnover: number }>> = {};
        turnoverYOYData.forEach((regionData: any) => {
          const region = regionData.region;
          regionAttritionData[region] = {};

          regionData.trend.forEach((entry: any) => {
            const year = this.getFiscalYearLabel(parseInt(entry.year));
            fiscalYearsSet.add(year);
            regionAttritionData[region][year] = {
              attritionRate: entry.attritionRate ?? 0,
              turnover: entry.turnover ?? 0
            };
          });
        });


        // Sort fiscal years
        const fiscalYears = Array.from(fiscalYearsSet).sort();

        const series = Object.keys(regionAttritionData).map(region => {
          return {
            name: region,
            data: fiscalYears.map(fy => ({
              x: fy,
              y: parseFloat((regionAttritionData[region][fy]?.attritionRate || 0).toFixed(2)),
              turnover: regionAttritionData[region][fy]?.turnover || 0
            }))
          };
        });


        // Update chart config
        this.attritionRateYOYChart = {
          ...attritionRateYOYChart,
          xaxis: {
            ...attritionRateYOYChart.xaxis,
            categories: fiscalYears
          },
          series
        };

      },
      error: err => console.error('Error loading voluntary Turnover rate by region chart', err)
    });
  }

  updateEmpLevelChart(): void {
    const selectedLevelData = this.rawEmpLevelData.find(
      (item: any) => item.level === this.selectedEmpLevelType
    );

    if (!selectedLevelData) return;

    const years: string[] = [];
    const maleSeries: any[] = [];
    const femaleSeries: any[] = [];
    const otherSeries: any[] = [];

    selectedLevelData.trend.forEach((entry: any) => {
      const year = entry.year.toString();
      const total = entry.totalEmpCount || 0;

      years.push(year);

      const malePercent = total ? parseFloat(((entry.maleCount / total) * 100).toFixed(2)) : 0;
      const femalePercent = total ? parseFloat(((entry.femaleCount / total) * 100).toFixed(2)) : 0;
      const otherPercent = total ? parseFloat(((entry.otherCount / total) * 100).toFixed(2)) : 0;

      maleSeries.push({ x: year, y: malePercent, count: entry.maleCount || 0 });
      femaleSeries.push({ x: year, y: femalePercent, count: entry.femaleCount || 0 });
      otherSeries.push({ x: year, y: otherPercent, count: entry.otherCount || 0 });
    });

    this.GenderRepChart = {
      ...GenderRepChart,
      xaxis: {
        ...GenderRepChart.xaxis,
        categories: years
      },
      yaxis: {
        ...GenderRepChart.yaxis,
        title: {
          text: 'Gender Representation (%)'
        }
      },

      series: [
        { name: 'Male', data: maleSeries },
        { name: 'Female', data: femaleSeries },
        { name: 'Other', data: otherSeries }
      ]
    };
  }


  onEmpLevelChange(event: Event): void {
    this.selectedEmpLevelType = (event.target as HTMLSelectElement).value;
    this.updateEmpLevelChart();
  }

  SOCGenderRepCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        this.rawEmpLevelData = response[0]?.genderRepresentation || [];

        this.availableLevels = this.rawEmpLevelData.map((item: any) => item.level);

        this.selectedEmpLevelType = this.availableLevels[0];

        this.updateEmpLevelChart();
      },
      error: err => console.error('Error loading gender representation chart', err)
    });
  }

  SOCDisabilityRepCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const disabilityData = response[0]?.disabilityRep || [];

        const fiscalYears: string[] = [];
        const permanent: number[] = [];
        const temporary: number[] = [];

        disabilityData.forEach((entry: any) => {
          const year = this.getFiscalYearLabel(parseInt(entry.year));
          fiscalYears.push(year);

          // Sum total permanent
          const permTotal =
            (entry.Permanent?.male || 0) +
            (entry.Permanent?.female || 0) +
            (entry.Permanent?.other || 0);

          // Sum total temporary
          const tempTotal =
            (entry.Temporary?.male || 0) +
            (entry.Temporary?.female || 0) +
            (entry.Temporary?.other || 0);

          permanent.push(permTotal);
          temporary.push(tempTotal);
        });

        this.DisabilityRepChart = {
          ...DisabilityRepChart, // from chart.ts
          xaxis: {
            ...DisabilityRepChart.xaxis,
            categories: fiscalYears
          },
          series: [
            {
              name: 'Permanent',
              data: permanent
            },
            {
              name: 'Temporary',
              data: temporary
            }
          ]
        };
      },
      error: err => console.error('Error loading disability chart', err)
    });
  }

  // This function will be called whenever dropdown changes
  updateGenderParityChart(): void {
    const chartData = this.rawGenderParityData;

    // Get all fiscal years from the data (like FY 2042-43, FY 2043-44)
    const fiscalYears = [...new Set(chartData.map((d: any) => this.getFiscalYearLabel(+d.year)))];

    // Get all levels (like Junior, Senior, Middle, etc.)
    const levels = [...new Set(chartData.map((d: any) => d.level))];

    // We'll group data like: { Senior: [value for FY1, FY2, ...], Junior: [...] }
    const levelData: Record<string, number[]> = {};

    chartData.forEach((item: any) => {
      const fy = this.getFiscalYearLabel(+item.year);
      const idx = fiscalYears.indexOf(fy);
      const level = item.level;

      if (!levelData[level]) {
        // Init array for that level with 0s
        levelData[level] = new Array(fiscalYears?.length).fill(0);
      }

      // Pick value based on dropdown type
      const value = this.selectedGapType === 'average'
        ? parseFloat(item.averagePayGapRatio)
        : parseFloat(item.medianPayGapRatio);

      // Put value at correct year index
      levelData[level][idx] = value;
    });

    // Final chart object to bind to apx-chart
    this.genderParityChart = {
      ...genderParityChart,
      xaxis: {
        ...genderParityChart.xaxis,
        categories: fiscalYears
      },
      yaxis: {
        ...genderParityChart.yaxis,
        title: {
          text: `${this.selectedGapType === 'average' ? 'Average' : 'Median'} Pay Gap Ratio`
        }
      },
      series: levels.map((level: any) => ({
        name: level,
        data: levelData[level].map(d => +d.toFixed(2)) // Round values to 2 decimals
      }))
    };
  }
  SOCGenderParityCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        this.rawGenderParityData = response[0]?.genderParity || [];

        // Call function to build chart based on initial dropdown type
        this.updateGenderParityChart();
      },
      error: err => console.error('Error loading gender pay parity chart', err)
    });
  }

  SOCSkillUpgradeCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const skillUpgradeData = response[0]?.SkillUpgrade || [];

        const fiscalYears: string[] = [];
        const maleData: number[] = [];
        const femaleData: number[] = [];
        const otherData: number[] = [];

        skillUpgradeData.forEach((entry: any) => {
          const year = parseInt(entry.year);
          const fy = this.getFiscalYearLabel(year); // e.g., FY 2043–44
          fiscalYears.push(fy);

          maleData.push(entry.male || 0);
          femaleData.push(entry.female || 0);
          otherData.push(entry.other || 0);
        });

        if (!skillUpgradeData || !skillUpgradeData.length) {
          this.SkillUpgradeChart = {
            ...SkillUpgradeChart,
            series: [],
            xaxis: { categories: [] }
          };
          return;
        }

        this.SkillUpgradeChart = {
          ...SkillUpgradeChart,
          xaxis: {
            ...SkillUpgradeChart.xaxis,
            categories: fiscalYears
          },
          yaxis: {
            ...SkillUpgradeChart.yaxis,
            title: { text: 'Number of Employees Trained' }
          },
          tooltip: {
            shared: true, // <--- Important: enables grouped tooltip
            intersect: false,
            y: {
              formatter: function (val: number, opts: any) {
                const seriesIndex = opts.seriesIndex;
                const dataPointIndex = opts.dataPointIndex;
                const allSeries = opts.w.config.series;
                const total = allSeries.reduce((sum: number, s: any) => sum + (s.data[dataPointIndex] || 0), 0);
                const percent = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
                return `${val} employees (${percent}%)`;
              }
            }
          },
          series: [
            { name: 'Male', data: maleData },
            { name: 'Female', data: femaleData },
            { name: 'Other', data: otherData }
          ]
        };
      },
      error: err => console.error('Error loading Skill Upgrade data', err)
    });
  }

  SOCreturnToWork12MCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const returnToWork12MData = response[0]?.returnToWork12MData || {};
        this.returnToWorkData = returnToWork12MData;

        const availableYears = Object.keys(returnToWork12MData);

        if (availableYears.length > 0) {
          this.returnToWorkavailableYears = availableYears;
          this.returnToWorkselectedYear = availableYears[0]; // default to first available year
          this.updateParentalLeaveChart(this.returnToWorkData, this.returnToWorkselectedYear);
        } else {
          // No data case
          this.returnToWorkavailableYears = [];
          this.returnToWorkselectedYear = '';
          this.parentalLeaveChart = {
            ...parentalLeaveChart,
            series: [],
            labels: []
          };
        }
      },
      error: err => {
        console.error('Error loading Parental Leave data', err);
        this.returnToWorkavailableYears = [];
        this.returnToWorkselectedYear = '';
        this.parentalLeaveChart = {
          ...parentalLeaveChart,
          series: [],
          labels: []
        };
      }
    });
  }


  onYearChange() {
    this.updateParentalLeaveChart(this.returnToWorkData, this.returnToWorkselectedYear);
  }


  updateParentalLeaveChart(data: any, year: string) {
    const dataForYear = data?.[year];
    if (!dataForYear) return;

    const took = dataForYear.tookLeave?.total || 0;
    const returned = dataForYear.returned?.total || 0;
    const retained = dataForYear.retained?.total || 0;

    this.parentalLeaveChart = {
      ...parentalLeaveChart,
      labels: ['Took Leave', 'Returned', 'Retained'],
      series: [took, returned, retained]
    };
  }



  // SOC HR Trained Employee Card
  SOCHRTrainedEmployeeCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const hrTrainedData = response[0]?.HRTrainedEMP || {};

        const fiscalYears: string[] = [];
        const permanentData: number[] = [];
        const temporaryData: number[] = [];

        Object.entries(hrTrainedData).forEach(([year, entry]: [string, any]) => {
          const yearNumber = parseInt(year);
          const fy = this.getFiscalYearLabel(yearNumber); // eg. FY 2043–44
          fiscalYears.push(fy);

          permanentData.push(parseFloat(entry.permanentPercentage || 0));
          temporaryData.push(parseFloat(entry.temporaryPercentage || 0));
        });

        if (!Object.keys(hrTrainedData).length) {
          this.HRTrainedEMPChart = {
            ...HRTrainedEMPChart,
            series: [],
            xaxis: { categories: [] }
          };
          return;
        }

        this.HRTrainedEMPChart = {
          ...HRTrainedEMPChart,
          xaxis: {
            ...HRTrainedEMPChart.xaxis,
            categories: fiscalYears
          },
          yaxis: {
            ...HRTrainedEMPChart.yaxis,
            title: { text: 'Percentage of Employees (%)' },
            max: 100,
            min: 0
          },
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: function (val: number, opts: any) {
                return `${val.toFixed(1)}%`;
              }
            }
          },
          series: [
            { name: 'Permanent Employees', data: permanentData },
            { name: 'Temporary Employees', data: temporaryData }
          ]
        };
      },
      error: err => console.error('Error loading HR Trained Employee data', err)
    });
  }

  SOCUnionMembershipCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const empUnionData = response[0]?.EMPUnionData || {};
        this.unionMembershipData = empUnionData;

        const availableYears = Object.keys(empUnionData);

        if (availableYears.length > 0) {
          this.unionAvailableYears = availableYears;
          this.unionSelectedYear = availableYears[0]; // default to first available year
          this.updateUnionMembershipChart(this.unionMembershipData, this.unionSelectedYear);
        } else {
          // No data case
          this.unionAvailableYears = [];
          this.unionSelectedYear = '';
          this.unionMembershipChart = {
            ...unionMembershipChart,
            series: [],
            labels: []
          };
        }
      },
      error: err => {
        console.error('Error loading Union Membership data', err);
        this.unionAvailableYears = [];
        this.unionSelectedYear = '';
        this.unionMembershipChart = {
          ...unionMembershipChart,
          series: [],
          labels: []
        };
      }
    });
  }

  onUnionYearChange() {
    this.updateUnionMembershipChart(this.unionMembershipData, this.unionSelectedYear);
  }

  updateUnionMembershipChart(data: any, year: string) {
    const dataForYear = data?.[year];

    if (!dataForYear || dataForYear.totalEmployees === 0) {
      // If no employees or missing year, reset safely
      this.unionMembershipChart = {
        ...unionMembershipChart,
        series: [],
        labels: [],
      };
      return;
    }

    const maleUnion = dataForYear.maleUnion || 0;
    const femaleUnion = dataForYear.femaleUnion || 0;
    const totalUnion = dataForYear.totalUnion || 0;
    const totalEmployees = dataForYear.totalEmployees || 0;
    const nonUnionEmployees = totalEmployees - totalUnion;

    this.unionMembershipChart = {
      ...unionMembershipChart,
      labels: ['Male Union Members', 'Female Union Members', 'Non-Union Employees'],
      series: [maleUnion, femaleUnion, nonUnionEmployees],
    };
  }

  SOCRetirementBenefitsCard(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {

        const EmpRetBenefitsData = response[0]?.EMPRetBenfitData || {};

        const fiscalYears: string[] = [];
        const benefits: string[] = ['PF', 'ESI', 'Gratuity'];
        const retirementBenefitsPercentage: Record<string, number[]> = {
          PF: [],
          ESI: [],
          Gratuity: []
        };

        // Loop through each year in the data
        Object.keys(EmpRetBenefitsData).forEach((year: string) => {
          const yearData = EmpRetBenefitsData[year];
          const fy = this.getFiscalYearLabel(parseInt(year)); // Convert to fiscal year label

          if (!fiscalYears.includes(fy)) {
            fiscalYears.push(fy);
          }

          const yearIndex = fiscalYears.indexOf(fy);

          // Process each benefit (PF, ESI, Gratuity)
          benefits.forEach(benefit => {
            const count = parseInt(yearData[`${benefit}Emp`] ?? '0');
            const totalEmployees = Number(yearData.totalEmployees ?? 0);
            // Calculate percentage of employees covered by each benefit
            const percentage = totalEmployees ? (count / totalEmployees) * 100 : 0;
            retirementBenefitsPercentage[benefit][yearIndex] = parseFloat(percentage.toFixed(2));
          });
        });

        // Prepare series for each benefit (Percentage)
        const series = benefits.map(benefit => ({
          name: `${benefit} Percentage`,
          data: fiscalYears.map((_, index) => retirementBenefitsPercentage[benefit][index] || 0),
        }));

        // Set chart data
        this.retirementBenefitsChart = {
          ...retirementBenefitsChart,
          xaxis: {
            categories: fiscalYears,  // Set fiscal years as categories
          },
          series: series,  // Set the dynamically generated series
        };

      },
      error: err => {
        console.error('Error loading retirement benefits data', err);
      }
    });
  }


  SOCEmpInjuryCounts(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const empInjuryData = response[0]?.EMPInjuryData || {};

        if (!empInjuryData || Object.keys(empInjuryData).length === 0) {
          this.empInjuryChart = {
            ...empInjuryChart,
            series: [],
            labels: []
          };
          return;
        }

        this.empInjuryData = empInjuryData;

        const availableYears = Object.keys(empInjuryData);

        if (availableYears.length > 0) {
          this.availableInjuryYears = availableYears;
          this.selectedInjuryYear = availableYears[0]; // Default to the first available year
          this.updateEmpInjuryChart(empInjuryData, this.selectedInjuryYear);
        } else {
          this.availableInjuryYears = [];
          this.selectedInjuryYear = '';
          this.empInjuryChart = {
            ...empInjuryChart,
            series: [],
            labels: []
          };
        }
      },
      error: err => {
        console.error('Error loading EMP Injury data', err);
        this.availableInjuryYears = [];
        this.selectedInjuryYear = '';
        this.empInjuryChart = {
          ...empInjuryChart,
          series: [],
          labels: []
        };
      }
    });
  }

  onEMPInjuryYearChange() {
    this.updateEmpInjuryChart(this.empInjuryData, this.selectedInjuryYear);
  }

  updateEmpInjuryChart(data: any, year: string) {
    const yearData = data?.[year];

    if (!yearData || yearData.totalEmployees === 0) {
      this.empInjuryChart = {
        ...empInjuryChart,
        series: [],
        labels: []
      };
      return;
    }

    const labels = [
      'Fatalities',
      'High Consequence Injuries',
      'Minor Injuries',
      'Commuting Injuries',
      'Lost Time Injuries'
    ];

    const values = [
      yearData.fatalitiesEMP || 0,
      yearData.highConsequenceInjEMP || 0,
      yearData.minorInjEMP || 0,
      yearData.commutingInjEMP || 0,
      yearData.lostTimeInjEMP || 0
    ];

    this.empInjuryChart = {
      ...empInjuryChart,  // base config from your imported chart config
      series: values,
      labels: labels,

    };

    // Update injury cards below the chart
    this.injuryCard = labels.map((label, i) => ({
      title: label,
      count: values[i]
    }));
  }

  GOVBODKMPChart(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const groupedBoardData = response[0]?.GOVBODKMPData || {}; // 🔥 your backend provided structure
        this.bodKmpData = groupedBoardData;

        const years = Object.keys(groupedBoardData);
        if (years.length > 0) {
          this.bodKmpavailableYears = years;
          this.bodKmpselectedYear = years[0]; // default first year
          this.updateBodKmpChart(this.bodKmpData, this.bodKmpselectedYear);
        } else {
          this.bodKmpavailableYears = [];
          this.bodKmpselectedYear = '';
          this.bodKmpDonutChart = { ...bodKmpDonutChart, series: [], labels: [] };
        }
      },
      error: err => {
        console.error('Error loading BOD/KMP Data', err);
        this.bodKmpavailableYears = [];
        this.bodKmpselectedYear = '';
        this.bodKmpDonutChart = { ...bodKmpDonutChart, series: [], labels: [] };
      }
    });
  }

  // on Year Dropdown Change
  onBodKmpYearChange() {
    this.updateBodKmpChart(this.bodKmpData, this.bodKmpselectedYear);
  }

  updateBodKmpChart(data: any, year: string) {
    const dataForYear = data?.[year];
    if (!dataForYear) return;

    const bod = dataForYear?.BOD?.total || 0;
    const kmp = dataForYear?.KMP?.total || 0;

    this.bodKmpDonutChart = {
      ...bodKmpDonutChart,
      labels: ['Board Of Directors', 'KMP'],
      series: [bod, kmp]
    };
  }


  GOVGrievanceChart(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const groupedGrievanceData = response[0]?.GOVGrievanceData || {};
        this.govGrievanceData = groupedGrievanceData;

        const years = Object.keys(groupedGrievanceData);
        if (years.length > 0) {
          this.govGrievanceAvailableYears = years;
          this.govGrievanceSelectedYear = years[0];
          this.updateGovGrievanceGroupOptions(this.govGrievanceSelectedYear);
        } else {
          this.govGrievanceAvailableYears = [];
          this.govGrievanceSelectedYear = '';
          this.govGrievanceAvailableGroups = [];
          this.govGrievanceSelectedGroup = '';
          this.govGrievanceRadialChart = { ...govGrievanceRadialChart, series: [], labels: [] };
        }
      },
      error: err => {
        console.error('Error loading Grievance Data', err);
        this.govGrievanceAvailableYears = [];
        this.govGrievanceSelectedYear = '';
        this.govGrievanceAvailableGroups = [];
        this.govGrievanceSelectedGroup = '';
        this.govGrievanceRadialChart = { ...govGrievanceRadialChart, series: [], labels: [] };
      }
    });
  }

  onGovGrievanceYearChange() {
    this.updateGovGrievanceGroupOptions(this.govGrievanceSelectedYear);
  }

  onGovGrievanceGroupChange() {
    this.updateGovGrievanceChart(this.govGrievanceData, this.govGrievanceSelectedYear, this.govGrievanceSelectedGroup);
  }

  updateGovGrievanceGroupOptions(year: string) {
    const dataForYear = this.govGrievanceData?.[year];
    if (dataForYear) {
      const groups = Object.keys(dataForYear);
      this.govGrievanceAvailableGroups = groups;
      this.govGrievanceSelectedGroup = groups[0];
      this.updateGovGrievanceChart(this.govGrievanceData, year, this.govGrievanceSelectedGroup);
    } else {
      this.govGrievanceAvailableGroups = [];
      this.govGrievanceSelectedGroup = '';
      this.govGrievanceRadialChart = { ...govGrievanceRadialChart, series: [], labels: [] };
    }
  }

  updateGovGrievanceChart(data: any, year: string, group: string) {
    const dataForGroup = data?.[year]?.[group];
    if (!dataForGroup) return;

    const resolved = dataForGroup?.completed_complaints || 0;
    const pending = dataForGroup?.complaints_pending || 0;
    this.govGrievanceTotalComplaints = resolved + pending;
    this.govGrievanceRadialChart = {
      ...govGrievanceRadialChart,
      series: [resolved, pending],
      labels: ['Resolved', 'Pending']
    };
  }


  SOCSupplierChart(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        // Assuming response[0]?.supplierData is the object with years as keys
        const supplierData = response[0]?.SupplierData || {};

        // Arrays to hold the processed data for chart
        const fiscalYears: string[] = [];
        const supplierCounts: number[] = [];

        // Extract years from the supplierData object
        const years = Object.keys(supplierData).map(y => parseInt(y)); // Extract years

        // Logic to handle years for padding if only 1 year is available
        let paddedYears: string[];
        if (years.length === 1) {
          const y = years[0];
          paddedYears = [(y - 2).toString(), (y - 1).toString(), y.toString(), (y + 1).toString()];
        } else {
          paddedYears = years.map(y => y.toString());
        }

        // Map padded years to fiscal year labels and extract supplier data
        paddedYears.forEach(y => {
          fiscalYears.push(this.getFiscalYearLabel(+y)); // Add fiscal year label
          // Check if the year exists in the supplierData, otherwise add 0 suppliers
          supplierCounts.push(supplierData[y]?.number_of_suppliers || 0);
        });

        // Configure the chart with padded years and supplier data
        this.supplierChart = {
          ...this.supplierChart, // your chart config object from chart.ts
          xaxis: {
            ...this.supplierChart.xaxis,
            categories: fiscalYears
          },
          series: [
            {
              name: 'Number of Suppliers',
              data: supplierCounts
            }
          ]
        };
      },
      error: err => console.error('Error loading supplier data', err)
    });
  }

  SOCTotalTrainingHoursChart(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const trainingData = response[0]?.TrainingHrsData || {};
        const fiscalYears: string[] = [];
        const totalTrainingHours: number[] = [];

        const years = Object.keys(trainingData).map(y => parseInt(y));
        const paddedYears = years.length === 1
          ? [(years[0] - 2), (years[0] - 1), years[0], (years[0] + 1)].map(String)
          : years.map(String);

        paddedYears.forEach(y => {
          fiscalYears.push(this.getFiscalYearLabel(+y));
          totalTrainingHours.push(trainingData[y]?.totalTrainingHours || 0);
        });

        this.trainingLineChart = {
          ...trainingLineChart,
          xaxis: {
            ...trainingLineChart.xaxis,
            categories: fiscalYears
          },
          series: [
            {
              name: 'Total Training Hours',
              data: totalTrainingHours
            }
          ]
        };
      },
      error: err => console.error('Error loading training chart data', err)
    });
  }

  SOCTrainingByLevelChart(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const trainingStats = response[0]?.TrainingHrsData || {};

        const levelMap: { [level: string]: number[] } = {};
        const fiscalYears: string[] = [];

        const years = Object.keys(trainingStats).map(y => parseInt(y));
        const paddedYears = years.length === 1
          ? [(years[0] - 2), (years[0] - 1), years[0], (years[0] + 1)]
          : years;

        paddedYears.forEach((year) => {
          const yStr = year.toString();
          fiscalYears.push(this.getFiscalYearLabel(year));

          const levelData = trainingStats[yStr]?.trainingHoursByLevel || {};
          const allLevels = Object.keys(levelData);

          allLevels.forEach(level => {
            if (!levelMap[level]) {
              levelMap[level] = new Array(paddedYears.length).fill(0);
            }
            const idx = fiscalYears.length - 1;
            levelMap[level][idx] = levelData[level] || 0;
          });
        });

        const series = Object.entries(levelMap).map(([level, data]) => ({
          name: level,
          data
        }));

        this.TrainingByLevelChart = {
          ...TrainingByLevelChart,
          xaxis: {
            ...TrainingByLevelChart.xaxis,
            categories: fiscalYears
          },
          series
        };
      },
      error: err => console.error('Error loading training level chart', err)
    });
  }
  SOCTrainingByFunctionChart(filters: any) {
    this.esgService.getESGValues(filters).subscribe({
      next: (response: any) => {
        const trainingStats = response[0]?.TrainingHrsData || {};

        const functionMap: { [func: string]: number[] } = {};
        const fiscalYears: string[] = [];

        const years = Object.keys(trainingStats).map(y => parseInt(y));
        const paddedYears = years.length === 1
          ? [(years[0] - 2), (years[0] - 1), years[0], (years[0] + 1)]
          : years.sort();

        paddedYears.forEach((year, idx) => {
          const yStr = year.toString();
          fiscalYears.push(this.getFiscalYearLabel(year));

          const functionData = trainingStats[yStr]?.trainingHoursByFunction || {};

          Object.keys(functionData).forEach(func => {
            if (!functionMap[func]) {
              functionMap[func] = new Array(paddedYears.length).fill(0);
            }
            functionMap[func][idx] = functionData[func] || 0;
          });
        });

        const series = Object.entries(functionMap).map(([func, data]) => ({
          name: func,
          data
        }));

        this.TrainingByFunctionChart = {
          ...TrainingByFunctionChart,
          xaxis: {
            ...TrainingByFunctionChart.xaxis,
            categories: fiscalYears
          },
          series
        };
      },
      error: err => console.error('Error loading training function chart', err)
    });
  }
  // Utility
  // getFiscalYearLabel(year: number): string {
  //   return `${year}-${(year + 1).toString().slice(-2)}`;
  // }
  getFiscalYearLabel(year: number): string {
    return `${year}`;
  }
}
