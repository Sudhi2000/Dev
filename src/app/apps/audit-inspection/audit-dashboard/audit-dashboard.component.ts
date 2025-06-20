import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { environment } from 'src/environments/environment';
import { ExternalAuditService } from 'src/app/services/external-audit.service';
import Swal from 'sweetalert2';
import { ChartType, divisionChart, externalMonthlyChart, avgInternalScoreChart, timelinessChart, radialChart, gradeChart, heirarchyChart, announcementChart, auditTypeChart, categoryBreakdownChart, divisionWiseChart, divisionWiseOptions, standardChart, priorityLevelChart, comLevelChart,auditFirmChart } from './chart-model';
import * as moment from 'moment';

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
  selector: 'app-audit-dashboard',
  templateUrl: './audit-dashboard.component.html',
  styleUrls: ['./audit-dashboard.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AuditDashboardComponent implements OnInit {

  filterForm: FormGroup
  dateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  prevDateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  Division = new FormControl(null);
  divisions: any[] = []
  currency: any
  orgID: any
  internalAuditData: any[] = []
  previnternalAuditData: any[] = []
  internalScheduledAuditData: any[] = []
  previnternalScheduledAuditData: any[] = []
  summaryCardData: any[] = []
  findingsCardData: any[] = []
  socialTotalMark: number
  healthTotalMark: number
  envTotalMark: number
  secTotalMark: number
  mngTotalMark: number
  internalAuditAction: any[] = []
  externalAuditAction: any[] = []
  internalPrevAuditAction: any[] = []
  externalPrevAuditAction: any[] = []
  externalAuditData: any[] = []
  auditFirmDetails: any[] = []
  prevexternalAuditData: any[] = []
  externalAuditApprovedData: any[] = []
  riskLevelCardData: any[] = []
  prevexternalAuditApprovedData: any[] = []
  externalAuditInProgressData: any[] = []
  prevexternalAuditInProgressData: any[] = []
  externalAuditCompletedData: any[] = []
  prevexternalAuditCompletedData: any[] = []
  internalAuditApprovedData: any[] = []
  previnternalAuditApprovedData: any[] = []
  internalAuditInProgressData: any[] = []
  previnternalAuditInProgressData: any[] = []
  internalAuditCompletedData: any[] = []
  previnternalAuditCompletedData: any[] = []
  externalAuditYearData: any[] = []
  periodValues: any[] = []
  periods: any[] = []
  dropDownValue: any[] = []
  auditTypes: any[] = []
  years: any[] = []
  totalAuditFirms: any
  audit_summary: any[] = [];
  comLevelChart: ChartType
  priorityLevelChart: ChartType
  divisionChart: ChartType
  categoryBreakdownChart: ChartType
  externalMonthlyChart: ChartType
  avgInternalScoreChart: ChartType
  timelinessChart: ChartType
  radialChart: ChartType
  gradeChart: ChartType
  heirarchyChart: ChartType
  auditTypeChart: ChartType
  auditFirmChart: ChartType
  announcementChart: ChartType
  divisionWiseChart: ChartType
  divisionWiseOptionsChart: ChartType
  standardChart: ChartType
  totalScore: any;
  finalScore: any;
  audTimelinessCard: any[] = []
  teamProductivityCard: any[] = []
  audScoreCardData: any[] = []
  repeatedSubCategoryCard: any[] = []
  socialGrade: any
  healthGrade: any
  envGrade: any
  secGrade: any
  mngGrade: any
  auditGrade: any;
  external_expiry_list_card: any[] = []
  external_action_expiry_list: any[] = []
  internal_action_expiry_list: any[] = []
  upcomingExpiry: any[] = []
  selectedYear: number;
  groupedData: any[] = [];
  PerComAudAction: any
  unitSpecific: any
  userDivision: any
  intuserDivision: any
  extuserDivision: any
  corporateUser: any
  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private internalAuditService: InternalAuditService,
    private externalAuditService: ExternalAuditService) { }

  ngOnInit() {
    this.showProgressPopup()
    this.divisionChart = divisionChart
    this.externalMonthlyChart = externalMonthlyChart
    this.avgInternalScoreChart = avgInternalScoreChart
    this.timelinessChart = timelinessChart
    this.radialChart = radialChart
    this.gradeChart = gradeChart
    this.heirarchyChart = heirarchyChart
    this.auditTypeChart = auditTypeChart
    this.announcementChart = announcementChart
    this.categoryBreakdownChart = categoryBreakdownChart
    this.divisionWiseChart = divisionWiseChart
    this.divisionWiseOptionsChart = divisionWiseOptions
    this.standardChart = standardChart
    this.priorityLevelChart = priorityLevelChart
    this.comLevelChart = comLevelChart
    this.auditFirmChart = auditFirmChart

    this.configuration()
    this.filterForm = this.formBuilder.group({
      startDate: [''],
      endDate: [''],
      division: [''],
      prevStartDate: [''],
      prevEndDate: [''],
      period: [''],
      audit_type: [''],
      year: ['']
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
    this.dateRange.controls['start'].setValue(new Date(monthStartDate))
    this.dateRange.controls['end'].setValue(new Date(monthEndDate))

    const date = new Date(monthStartDate)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)

    const end = new Date(monthEndDate)
    const newEndDate = new Date(end.setDate(end.getDate() + 1)).toISOString().slice(0, 10)

    this.filterForm.controls['startDate'].setValue(new Date(newDate))
    this.filterForm.controls['endDate'].setValue(new Date(newEndDate))

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

    this.filterForm.controls['prevStartDate'].setValue(localPrevNewDate.toISOString().slice(0, 10));
    this.filterForm.controls['prevEndDate'].setValue(localPrevNewEndDate.toISOString().slice(0, 10));

  }
  filterCategory(value: any) {
    return value.category === "Overview"
  }

  filterSocialCategory(value: any) {
    return value.category === "Social"
  }

  filterHealthCategory(value: any) {
    return value.category === "Health"
  }

  filterEnvCategory(value: any) {
    return value.category === "Environment"
  }

  filterSecCategory(value: any) {
    return value.category === "Security"
  }

  filterMngCategory(value: any) {
    return value.category === "Management System"
  }

  filteraudScore(value: any) {
    return value.category === "Overview"

  }

  filterSocialaudScore(value: any) {
    return value.category === "Social"

  }

  filterHealthaudScore(value: any) {
    return value.category === "Health"

  }

  filterEnvaudScore(value: any) {
    return value.category === "Environment"

  }

  filterSecaudScore(value: any) {
    return value.category === "Security"

  }

  filterMngaudScore(value: any) {
    return value.category === "Management System"
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.audit_inspection
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
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
        const status = result.aud_dashboard
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

              let intdivisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                intdivisions.push('filters[internal_audit][business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let intresults = intdivisions.join('&');
              this.intuserDivision = intresults

              let extdivisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                extdivisions.push('filters[external_audit][business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let extresults = extdivisions.join('&');
              this.extuserDivision = extresults
              this.default_data()
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

  risk_level() {
    this.riskLevelCardData = [];

    const divisionFilter = this.filterForm.value.division;
    const auditTypeFilter = this.filterForm.value.audit_type;

    let combinedAuditActions = [];
    if (auditTypeFilter === 'External') {
      combinedAuditActions = [...this.externalAuditAction];
    } else if (auditTypeFilter === 'Internal') {
      combinedAuditActions = [...this.internalAuditAction];
    } else {
      combinedAuditActions = [...this.internalAuditAction, ...this.externalAuditAction];
    }

    const filteredAuditActions = divisionFilter
      ? combinedAuditActions.filter((action) => {
        const divisionUuid =
          action.attributes.internal_audit?.data?.attributes?.business_unit?.data?.attributes?.division_uuid ||
          action.attributes.external_audit?.data?.attributes?.business_unit?.data?.attributes?.division_uuid;
        return divisionUuid === divisionFilter;
      })
      : combinedAuditActions;

    // High Priority
    const highTotal = filteredAuditActions.filter((elem) => elem.attributes.priority === 'High').length;
    const highCompleted = filteredAuditActions.filter(
      (elem) => elem.attributes.priority === 'High' && elem.attributes.status === 'Completed'
    ).length;
    const highReported = highTotal - highCompleted;

    // Ensure safe division and rounding
    const highReportedPercentage = highTotal > 0
      ? Math.round((highReported / highTotal) * 100)
      : 0;
    const highCompletedPercentage = highTotal > 0
      ? 100 - highReportedPercentage
      : 0;

    // Medium Priority
    const mediumTotal = filteredAuditActions.filter((elem) => elem.attributes.priority === 'Medium').length;
    const mediumCompleted = filteredAuditActions.filter(
      (elem) => elem.attributes.priority === 'Medium' && elem.attributes.status === 'Completed'
    ).length;
    const mediumReported = mediumTotal - mediumCompleted;

    const mediumReportedPercentage = mediumTotal > 0
      ? Math.round((mediumReported / mediumTotal) * 100)
      : 0;
    const mediumCompletedPercentage = mediumTotal > 0
      ? 100 - mediumReportedPercentage
      : 0;

    // Low Priority
    const lowTotal = filteredAuditActions.filter((elem) => elem.attributes.priority === 'Low').length;
    const lowCompleted = filteredAuditActions.filter(
      (elem) => elem.attributes.priority === 'Low' && elem.attributes.status === 'Completed'
    ).length;
    const lowReported = lowTotal - lowCompleted;

    const lowReportedPercentage = lowTotal > 0
      ? Math.round((lowReported / lowTotal) * 100)
      : 0;
    const lowCompletedPercentage = lowTotal > 0
      ? 100 - lowReportedPercentage
      : 0;

    this.riskLevelCardData.push(
      {
        title: 'High Non-Compliance',
        total: highTotal,
        currTotal: Number(highReportedPercentage) > 0 ? highReportedPercentage : '0',
        currComp: Number(highCompletedPercentage) > 0 ? highCompletedPercentage : '0',
        colors: '#FF1644',
        label: 'Open cases',
        label2: 'Closed cases',
      },
      {
        title: 'Medium Non-Compliance',
        total: mediumTotal,
        currTotal: Number(mediumReportedPercentage) > 0 ? mediumReportedPercentage : '0',
        currComp: Number(mediumCompletedPercentage) > 0 ? mediumCompletedPercentage : '0',
        colors: '#CCCC01',
        label: 'Open cases',
        label2: 'Closed cases',
      },
      {
        title: 'Low Non-Compliance',
        total: lowTotal,
        currTotal: Number(lowReportedPercentage) > 0 ? lowReportedPercentage : '0',
        currComp: Number(lowCompletedPercentage) > 0 ? lowCompletedPercentage : '0',
        colors: '#39539e',
        label: 'Open cases',
        label2: 'Closed cases',
      }
    );
  }

  get_dropdown_values() {
    const module = "General"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValue = result.data
        const category = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Audit Type")
        })
        this.auditTypes = category
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
          divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
        })
        let results = divisions.join('&');
        this.userDivision = results

        let intdivisions: any[] = []
        this.divisions.forEach((elem: any) => {
          intdivisions.push('filters[internal_audit][business_unit][division_uuid][$in]=' + elem.division_uuid)
        })
        let intresults = intdivisions.join('&');
        this.intuserDivision = intresults

        let extdivisions: any[] = []
        this.divisions.forEach((elem: any) => {
          extdivisions.push('filters[external_audit][business_unit][division_uuid][$in]=' + elem.division_uuid)
        })
        let extresults = extdivisions.join('&');
        this.extuserDivision = extresults
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        this.default_data()
      },
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
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const prevStart = new Date(this.filterForm.value.prevStartDate).toISOString()
    const prevEnd = new Date(this.filterForm.value.prevEndDate).toISOString()
    this.internalAuditService.generate_internal_audit_action(start, end, this.intuserDivision).subscribe({
      next: (result: any) => {
        this.internalAuditAction = result.data
        this.internalAuditService.generate_internal_audit_action(prevStart, prevEnd, this.intuserDivision).subscribe({
          next: (result: any) => {
            this.internalPrevAuditAction = result.data
            this.externalAuditService.generate_external_audit_action(start, end, this.extuserDivision).subscribe({
              next: (result: any) => {
                this.externalAuditAction = result.data
                this.externalAuditService.generate_external_audit_action(prevStart, prevEnd, this.extuserDivision).subscribe({
                  next: (result: any) => {
                    this.externalPrevAuditAction = result.data
                  },
                  error: (err: any) => { },
                  complete: () => {
                    this.risk_level()
                  }
                })
              },
              error: (err: any) => { },
              complete: () => { }
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
    if (this.filterForm.value.division && !this.filterForm.value.audit_type) {
      this.showProgressPopup()
      this.division_date()
    } else if (!this.filterForm.value.division && this.filterForm.value.audit_type) {
      this.showProgressPopup()
      if (this.filterForm.value.audit_type === 'External') {
        this.external_type_date()
      }
      else if (this.filterForm.value.audit_type === 'Internal') {
        this.internal_type_date()
      }

    } else if (this.filterForm.value.division && this.filterForm.value.audit_type) {
      this.showProgressPopup()
      if (this.filterForm.value.audit_type === 'External') {
        this.division_external_type_date()
      }
      else if (this.filterForm.value.audit_type === 'Internal') {
        this.division_internal_type_date()
      }

    } else if (!this.filterForm.value.division && !this.filterForm.value.audit_type) {
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


    this.externalAuditService.generate_external_data(start, end, this.userDivision).subscribe({
      next: (result: any) => {
        this.externalAuditService.generate_external_data(prevStart, prevEnd, this.userDivision).subscribe({
          next: (preResult: any) => {
            this.externalAuditData = result.data
            this.prevexternalAuditData = preResult.data
            this.internalAuditService.generate_internal_audit_data(start, end, this.intuserDivision).subscribe({
              next: (result: any) => {
                this.internalAuditService.generate_internal_audit_data(prevStart, prevEnd, this.intuserDivision).subscribe({
                  next: (preResult: any) => {
                    this.internalAuditData = result.data
                    this.previnternalAuditData = preResult.data
                    this.summary_card()
                    this.risk_level()
                    this.division_card()
                    this.external_monthly_card()
                    this.avg_internal_audit_score()
                    this.timeliness_Card()
                    this.team_productivity()
                    this.findings()
                    this.audScore()
                    this.repeated_subcategory_rate()
                    this.grade_card()
                    this.heirarchy_Card()
                    this.announcement_Card()
                    this.audit_expiry()
                    this.upcoming_audit_expiry()
                    this.auditType_distribution()
                    this.category_breakdown()
                    this.division_wise_audit()
                    this.External_audit_Firm()
                  },
                  error: (err: any) => { },
                  complete: () => {

                    Swal.close()
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
      complete: () => {

      }
    })
  }


  division_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const division = this.filterForm.value.division
    this.externalAuditService.generate_external_data_division(start, end, division).subscribe({
      next: (result: any) => {
        this.externalAuditData = result.data
        this.internalAuditService.generate_internal_audit_data_division(start, end, division).subscribe({
          next: (result: any) => {
            this.internalAuditData = result.data
            this.summary_card()
            this.risk_level()
            this.division_card()
            this.external_monthly_card()
            this.avg_internal_audit_score()
            this.timeliness_Card()
            this.team_productivity()
            this.findings()
            this.audScore()
            this.repeated_subcategory_rate()
            this.grade_card()
            this.heirarchy_Card()
            this.announcement_Card()
            this.audit_expiry()
            this.upcoming_audit_expiry()
            this.auditType_distribution()
            this.category_breakdown()
            this.division_wise_audit()
            this.External_audit_Firm()
          },
          error: (err: any) => { },
          complete: () => {

            Swal.close()

          }
        })

      },
      error: (err: any) => { },
      complete: () => {


      }
    })


  }

  external_type_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    this.externalAuditService.generate_external_data(start, end, this.userDivision).subscribe({
      next: (result: any) => {
        this.externalAuditData = result.data
        this.summaryCardData = []
        this.summary_card()
        this.risk_level()
        this.division_card()
        this.external_monthly_card()
        this.avg_internal_audit_score()
        this.timeliness_Card()
        this.team_productivity()
        this.findings()
        this.audScore()
        this.repeated_subcategory_rate()
        this.grade_card()
        this.heirarchy_Card()
        this.announcement_Card()
        this.audit_expiry()
        this.upcoming_audit_expiry()
        this.auditType_distribution()
        this.category_breakdown()
        this.division_wise_audit()
        this.External_audit_Firm()

      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
  }

  division_external_type_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const division = this.filterForm.value.division
    const category = this.filterForm.value.audit_type

    this.externalAuditService.generate_external_data_division(start, end, division).subscribe({
      next: (result: any) => {
        this.externalAuditData = result.data
        this.summaryCardData = []
        this.summary_card()
        this.risk_level()
        this.division_card()
        this.external_monthly_card()
        this.avg_internal_audit_score()
        this.timeliness_Card()
        this.team_productivity()
        this.findings()
        this.audScore()
        this.repeated_subcategory_rate()
        this.grade_card()
        this.heirarchy_Card()
        this.announcement_Card()
        this.audit_expiry()
        this.upcoming_audit_expiry()
        this.auditType_distribution()
        this.category_breakdown()
        this.division_wise_audit()
        this.External_audit_Firm()

      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
  }

  internal_type_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const category = this.filterForm.value.audit_type
    this.internalAuditService.generate_internal_audit_data(start, end, this.intuserDivision).subscribe({
      next: (result: any) => {
        this.internalAuditData = result.data
        this.summaryCardData = []
        this.summary_card()
        this.risk_level()
        this.division_card()
        this.external_monthly_card()
        this.avg_internal_audit_score()
        this.timeliness_Card()
        this.team_productivity()
        this.findings()
        this.audScore()
        this.repeated_subcategory_rate()
        this.grade_card()
        this.heirarchy_Card()
        this.announcement_Card()
        this.audit_expiry()
        this.upcoming_audit_expiry()
        this.auditType_distribution()
        this.category_breakdown()
        this.division_wise_audit()
        //this.External_audit_Firm()

      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
  }

  division_internal_type_date() {
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const division = this.filterForm.value.division
    const category = this.filterForm.value.audit_type

    this.internalAuditService.generate_internal_audit_data_division(start, end, division).subscribe({
      next: (result: any) => {
        this.internalAuditData = result.data
        this.summaryCardData = []
        this.summary_card()
        this.risk_level()
        this.division_card()
        this.external_monthly_card()
        this.avg_internal_audit_score()
        this.timeliness_Card()
        this.team_productivity()
        this.findings()
        this.audScore()
        this.repeated_subcategory_rate()
        this.grade_card()
        this.heirarchy_Card()
        this.announcement_Card()
        this.audit_expiry()
        this.upcoming_audit_expiry()
        this.auditType_distribution()
        this.category_breakdown()
        this.division_wise_audit()
        //this.External_audit_Firm()

      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
  }

  default_data() {
    //get current month data
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const prevStart = new Date(this.filterForm.value.prevStartDate).toISOString()
    const prevEnd = new Date(this.filterForm.value.prevEndDate).toISOString()
    this.internalAuditService.generate_internal_audit_data(start, end, this.intuserDivision).subscribe({
      next: (result: any) => {
        this.internalAuditService.generate_internal_audit_data(prevStart, prevEnd, this.intuserDivision).subscribe({
          next: (preResult: any) => {
            this.internalAuditData = result.data
            this.previnternalAuditData = preResult.data
            this.internalAuditService.generate_internal_audit_action(start, end, this.intuserDivision).subscribe({
              next: (result: any) => {
                this.internalAuditAction = result.data
                this.externalAuditService.generate_external_audit_action(start, end, this.extuserDivision).subscribe({
                  next: (result: any) => {
                    this.externalAuditAction = result.data
                    this.externalAuditService.generate_external_audit_action(prevStart, prevEnd, this.extuserDivision).subscribe({
                      next: (result: any) => {
                        this.externalPrevAuditAction = result.data
                      },
                      error: (err: any) => { },
                      complete: () => { }
                    })
                  },
                  error: (err: any) => { },
                  complete: () => { }
                })
                this.internalAuditService.generate_internal_audit_action(prevStart, prevEnd, this.intuserDivision).subscribe({
                  next: (result: any) => {
                    this.internalPrevAuditAction = result.data
                    this.externalAuditService.generate_external_data(start, end, this.userDivision).subscribe({
                      next: (result: any) => {
                        this.externalAuditData = result.data
                        this.externalAuditService.generate_external_data(prevStart, prevEnd, this.userDivision).subscribe({
                          next: (preResult: any) => {

                            this.prevexternalAuditData = preResult.data
                            this.summary_card()
                            this.risk_level()
                            this.division_card()
                            this.external_monthly_card()
                            this.avg_internal_audit_score()
                            this.timeliness_Card()
                            this.findings()
                            this.audScore()
                            this.repeated_subcategory_rate()
                            this.grade_card()
                            this.heirarchy_Card()
                            this.audit_expiry()
                            this.upcoming_audit_expiry()
                            this.auditType_distribution()
                            this.category_breakdown()
                            this.division_wise_audit()
                            this.External_audit_Firm()

                          },
                          error: (err: any) => { },
                          complete: () => {
                            Swal.close()
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
      complete: () => {
      }
    })
  }

  summary_card() {
    this.summaryCardData = []
    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const prevStart = new Date(this.filterForm.value.prevStartDate).toISOString()
    const prevEnd = new Date(this.filterForm.value.prevEndDate).toISOString()
    const division = this.filterForm.value.division
    const auditType = this.filterForm.value.audit_type


    if (!auditType && !division) {
      this.externalAuditService.generate_external_audit_approved_data(start, end, this.userDivision).subscribe({
        next: (result: any) => {
          this.externalAuditService.generate_external_audit_approved_data(prevStart, prevEnd, this.userDivision).subscribe({
            next: (preResult: any) => {
              this.externalAuditApprovedData = result.data
              this.prevexternalAuditApprovedData = preResult.data
              this.externalAuditService.generate_external_audit_inprogress_data(start, end, this.userDivision).subscribe({
                next: (proresult: any) => {
                  this.externalAuditInProgressData = proresult.data
                  this.externalAuditService.generate_external_audit_inprogress_data(prevStart, prevEnd, this.userDivision).subscribe({
                    next: (preproresult: any) => {
                      this.prevexternalAuditInProgressData = preproresult.data
                      this.externalAuditService.generate_external_audit_completed_data(start, end, this.userDivision).subscribe({
                        next: (comresult: any) => {

                          this.externalAuditCompletedData = comresult.data
                          this.externalAuditService.generate_external_audit_completed_data(prevStart, prevEnd, this.userDivision).subscribe({
                            next: (precomResult: any) => {
                              this.prevexternalAuditCompletedData = precomResult.data
                            },
                            error: (err: any) => { },
                            complete: () => {
                              //Internal
                              this.internalAuditService.generate_internal_audit_approved_data(start, end, this.userDivision).subscribe({
                                next: (result: any) => {
                                  this.internalAuditService.generate_internal_audit_approved_data(prevStart, prevEnd, this.userDivision).subscribe({
                                    next: (preResult: any) => {
                                      this.internalAuditApprovedData = result.data
                                      this.previnternalAuditApprovedData = preResult.data
                                      this.internalAuditService.generate_internal_audit_inprogress_data(start, end, this.userDivision).subscribe({
                                        next: (proresult: any) => {
                                          this.internalAuditInProgressData = proresult.data
                                          this.internalAuditService.generate_internal_audit_inprogress_data(prevStart, prevEnd, this.userDivision).subscribe({
                                            next: (preproresult: any) => {
                                              this.previnternalAuditInProgressData = preproresult.data
                                              this.internalAuditService.generate_internal_audit_completed_data(start, end, this.userDivision).subscribe({
                                                next: (comresult: any) => {

                                                  this.internalAuditCompletedData = comresult.data
                                                  this.internalAuditService.generate_internal_audit_completed_data(prevStart, prevEnd, this.userDivision).subscribe({
                                                    next: (precomResult: any) => {
                                                      this.previnternalAuditCompletedData = precomResult.data

                                                      this.internalAuditService.generate_internal_audit_scheduled_data(start, end, this.userDivision).subscribe({
                                                        next: (result: any) => {
                                                          this.internalScheduledAuditData = result.data
                                                          this.internalAuditService.generate_internal_audit_scheduled_data(prevStart, prevEnd, this.userDivision).subscribe({
                                                            next: (preResult: any) => {
                                                              this.previnternalScheduledAuditData = preResult.data

                                                            },
                                                            error: (err: any) => { },
                                                            complete: () => {

                                                              let comAttrition = ''
                                                              let comAttrition_icon = ''
                                                              let comAttrition_bg = ''

                                                              let scheduledAttrition = ''
                                                              let scheduledAttrition_icon = ''
                                                              let scheduledAttrition_bg = ''

                                                              let inproAttrition = ''
                                                              let inproAttrition_icon = ''
                                                              let inproAttrition_bg = ''

                                                              let approveAttrition = ''
                                                              let approveAttrition_icon = ''
                                                              let approveAttrition_bg = ''

                                                              let feeAttrition = ''
                                                              let feeAttrition_icon = ''
                                                              let feeAttrition_bg = ''

                                                              const totalFee = this.externalAuditCompletedData.reduce((acc, cur) => acc + Number(cur.attributes?.audit_fee), 0);

                                                              //previous data                          
                                                              const prevtotalFee = this.prevexternalAuditCompletedData.reduce((acc, cur) => acc + Number(cur.attributes?.audit_fee), 0);

                                                              const approveAUD = Number(this.externalAuditApprovedData.length) + Number(this.internalAuditApprovedData.length)
                                                              const comAUD = Number(this.externalAuditCompletedData.length) + Number(this.internalAuditCompletedData.length)
                                                              const scheduledAUD = Number(this.externalAuditData.length) + Number(this.internalScheduledAuditData.length)
                                                              const inproAUD = Number(this.externalAuditInProgressData.length) + Number(this.internalAuditInProgressData.length)
                                                              const prevApproveAUD = Number(this.prevexternalAuditApprovedData.length) + Number(this.previnternalAuditApprovedData.length)
                                                              const prevComAUD = Number(this.prevexternalAuditCompletedData.length) + Number(this.previnternalAuditCompletedData.length)
                                                              const prevScheduledAUD = Number(this.prevexternalAuditData.length) + Number(this.previnternalScheduledAuditData.length)
                                                              const prevInProAUD = Number(this.prevexternalAuditInProgressData.length) + Number(this.previnternalAuditInProgressData.length)

                                                              // Approved
                                                              if (approveAUD == 0) {
                                                                approveAttrition = '0%'
                                                                approveAttrition_bg = 'widget-stats-indicator-positive'
                                                              } else {
                                                                if (approveAUD > prevApproveAUD) {
                                                                  const attrition = Number(prevApproveAUD) / Number(approveAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  approveAttrition = value.replace(/['"]+/g, '')
                                                                  approveAttrition_icon = 'icon-arrow-up'
                                                                  approveAttrition_bg = 'widget-stats-indicator-positive'
                                                                } else if (approveAUD < prevApproveAUD) {
                                                                  const attrition = Number(approveAUD) / Number(prevApproveAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  approveAttrition = value.replace(/['"]+/g, '')
                                                                  approveAttrition_icon = 'icon-arrow-down'
                                                                  approveAttrition_bg = 'widget-stats-indicator-negative'
                                                                } else if (approveAUD == prevApproveAUD) {
                                                                  approveAttrition = '0%'
                                                                  approveAttrition_bg = 'widget-stats-indicator-positive'
                                                                }
                                                              }

                                                              // Scheduled external
                                                              if (scheduledAUD == 0) {
                                                                scheduledAttrition = '0%'
                                                                scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                                              } else {
                                                                if (scheduledAUD > prevScheduledAUD) {
                                                                  const attrition = Number(prevScheduledAUD) / Number(scheduledAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  scheduledAttrition = value.replace(/['"]+/g, '')
                                                                  scheduledAttrition_icon = 'icon-arrow-up'
                                                                  scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                                                } else if (scheduledAUD < prevScheduledAUD) {
                                                                  const attrition = Number(scheduledAUD) / Number(prevScheduledAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  scheduledAttrition = value.replace(/['"]+/g, '')
                                                                  scheduledAttrition_icon = 'icon-arrow-down'
                                                                  scheduledAttrition_bg = 'widget-stats-indicator-negative'
                                                                } else if (scheduledAUD == prevScheduledAUD) {
                                                                  scheduledAttrition = '0%'
                                                                  scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                                                }
                                                              }

                                                              // In-Progress external
                                                              if (inproAUD == 0) {
                                                                inproAttrition = '0%'
                                                                inproAttrition_bg = 'widget-stats-indicator-positive'
                                                              } else {
                                                                if (inproAUD > prevInProAUD) {
                                                                  const attrition = Number(prevInProAUD) / Number(inproAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  inproAttrition = value.replace(/['"]+/g, '')
                                                                  inproAttrition_icon = 'icon-arrow-up'
                                                                  inproAttrition_bg = 'widget-stats-indicator-positive'
                                                                } else if (inproAUD < prevInProAUD) {
                                                                  const attrition = Number(inproAUD) / Number(prevInProAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  inproAttrition = value.replace(/['"]+/g, '')
                                                                  inproAttrition_icon = 'icon-arrow-down'
                                                                  inproAttrition_bg = 'widget-stats-indicator-negative'
                                                                } else if (inproAUD == prevInProAUD) {
                                                                  inproAttrition = '0%'
                                                                  inproAttrition_bg = 'widget-stats-indicator-positive'
                                                                }
                                                              }

                                                              // Completed external
                                                              if (comAUD == 0) {
                                                                comAttrition = '0%'
                                                                comAttrition_bg = 'widget-stats-indicator-positive'
                                                              } else {
                                                                if (comAUD > prevComAUD) {
                                                                  const attrition = Number(prevComAUD) / Number(comAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  comAttrition = value.replace(/['"]+/g, '')
                                                                  comAttrition_icon = 'icon-arrow-up'
                                                                  comAttrition_bg = 'widget-stats-indicator-positive'
                                                                } else if (comAUD < prevComAUD) {
                                                                  const attrition = Number(comAUD) / Number(prevComAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  comAttrition = value.replace(/['"]+/g, '')
                                                                  comAttrition_icon = 'icon-arrow-down'
                                                                  comAttrition_bg = 'widget-stats-indicator-negative'
                                                                } else if (comAUD == prevComAUD) {
                                                                  comAttrition = '0%'
                                                                  comAttrition_bg = 'widget-stats-indicator-positive'
                                                                }
                                                              }
                                                              // Audit Fee
                                                              if (totalFee == 0) {
                                                                feeAttrition = '0%'
                                                                feeAttrition_bg = 'widget-stats-indicator-positive'
                                                              } else {
                                                                if (totalFee > prevtotalFee) {
                                                                  const attrition = Number(prevtotalFee) / Number(totalFee) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  feeAttrition = value.replace(/['"]+/g, '')
                                                                  feeAttrition_icon = 'icon-arrow-up'
                                                                  feeAttrition_bg = 'widget-stats-indicator-positive'
                                                                } else if (totalFee < prevtotalFee) {
                                                                  const attrition = Number(totalFee) / Number(prevtotalFee) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  feeAttrition = value.replace(/['"]+/g, '')
                                                                  feeAttrition_icon = 'icon-arrow-down'
                                                                  feeAttrition_bg = 'widget-stats-indicator-negative'
                                                                } else if (totalFee == prevtotalFee) {
                                                                  feeAttrition = '0%'
                                                                  feeAttrition_bg = 'widget-stats-indicator-positive'
                                                                }
                                                              }
                                                              this.summaryCardData.push(
                                                                {
                                                                  "title": "Scheduled",
                                                                  "icon": "icon-more-horizontal",
                                                                  "value": scheduledAUD,
                                                                  "attrition": scheduledAttrition,
                                                                  "attri_icon": scheduledAttrition_icon,
                                                                  "attri_bg": scheduledAttrition_bg

                                                                },
                                                                {
                                                                  "title": "Approved",
                                                                  "icon": "icon-list",
                                                                  "value": approveAUD,
                                                                  "attrition": approveAttrition,
                                                                  "attri_icon": approveAttrition_icon,
                                                                  "attri_bg": approveAttrition_bg

                                                                },
                                                                {
                                                                  "title": "In-Progress",
                                                                  "icon": "icon-chevrons-right",
                                                                  "value": inproAUD,
                                                                  "attrition": inproAttrition,
                                                                  "attri_icon": inproAttrition_icon,
                                                                  "attri_bg": inproAttrition_bg

                                                                },
                                                                {
                                                                  "title": "Completed",
                                                                  "icon": "icon-check-circle",
                                                                  "value": comAUD,
                                                                  "attrition": comAttrition,
                                                                  "attri_icon": comAttrition_icon,
                                                                  "attri_bg": comAttrition_bg

                                                                },
                                                                {
                                                                  "title": "Audit Fee",
                                                                  "icon": "icon-bar-chart-2",
                                                                  "value": totalFee,
                                                                  "attrition": feeAttrition,
                                                                  "attri_icon": feeAttrition_icon,
                                                                  "attri_bg": feeAttrition_bg

                                                                }
                                                              )
                                                            }

                                                          })
                                                        },
                                                        error: (err: any) => { },
                                                        complete: () => {
                                                          this.team_productivity()
                                                          this.announcement_Card()
                                                          this.timeliness_Card()
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
                                    complete: () => {
                                    }
                                  })
                                },
                                error: (err: any) => { },
                                complete: () => {
                                }
                              })
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
        complete: () => {
        }
      })
    }

    else if (auditType && !division) {
      if (auditType === 'External') {
        this.externalAuditService.generate_external_audit_approved_data(start, end, this.userDivision).subscribe({
          next: (result: any) => {
            this.externalAuditService.generate_external_audit_approved_data(prevStart, prevEnd, this.userDivision).subscribe({
              next: (preResult: any) => {
                this.externalAuditApprovedData = result.data
                this.prevexternalAuditApprovedData = preResult.data
                this.externalAuditService.generate_external_audit_inprogress_data(start, end, this.userDivision).subscribe({
                  next: (proresult: any) => {
                    this.externalAuditInProgressData = proresult.data
                    this.externalAuditService.generate_external_audit_inprogress_data(prevStart, prevEnd, this.userDivision).subscribe({
                      next: (preproresult: any) => {
                        this.prevexternalAuditInProgressData = preproresult.data
                        this.externalAuditService.generate_external_audit_completed_data(start, end, this.userDivision).subscribe({
                          next: (comresult: any) => {

                            this.externalAuditCompletedData = comresult.data
                            this.externalAuditService.generate_external_audit_completed_data(prevStart, prevEnd, this.userDivision).subscribe({
                              next: (precomResult: any) => {
                                this.prevexternalAuditCompletedData = precomResult.data
                              },
                              error: (err: any) => { },
                              complete: () => {

                                let comAttrition = ''
                                let comAttrition_icon = ''
                                let comAttrition_bg = ''

                                let scheduledAttrition = ''
                                let scheduledAttrition_icon = ''
                                let scheduledAttrition_bg = ''

                                let inproAttrition = ''
                                let inproAttrition_icon = ''
                                let inproAttrition_bg = ''

                                let approveAttrition = ''
                                let approveAttrition_icon = ''
                                let approveAttrition_bg = ''

                                let feeAttrition = ''
                                let feeAttrition_icon = ''
                                let feeAttrition_bg = ''

                                const totalFee = this.externalAuditCompletedData.reduce((acc, cur) => acc + Number(cur.attributes?.audit_fee), 0);

                                //previous data                          
                                const prevtotalFee = this.prevexternalAuditCompletedData.reduce((acc, cur) => acc + Number(cur.attributes?.audit_fee), 0);

                                const approveAUD = Number(this.externalAuditApprovedData.length)
                                const comAUD = Number(this.externalAuditCompletedData.length)
                                const scheduledAUD = Number(this.externalAuditData.length)
                                const inproAUD = Number(this.externalAuditInProgressData.length)
                                const prevApproveAUD = Number(this.prevexternalAuditApprovedData.length)
                                const prevComAUD = Number(this.prevexternalAuditCompletedData.length)
                                const prevScheduledAUD = Number(this.prevexternalAuditData.length)
                                const prevInProAUD = Number(this.prevexternalAuditInProgressData.length)

                                // Approved
                                if (approveAUD == 0) {
                                  approveAttrition = '0%'
                                  approveAttrition_bg = 'widget-stats-indicator-positive'
                                } else {
                                  if (approveAUD > prevApproveAUD) {
                                    const attrition = Number(prevApproveAUD) / Number(approveAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    approveAttrition = value.replace(/['"]+/g, '')
                                    approveAttrition_icon = 'icon-arrow-up'
                                    approveAttrition_bg = 'widget-stats-indicator-positive'
                                  } else if (approveAUD < prevApproveAUD) {
                                    const attrition = Number(approveAUD) / Number(prevApproveAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    approveAttrition = value.replace(/['"]+/g, '')
                                    approveAttrition_icon = 'icon-arrow-down'
                                    approveAttrition_bg = 'widget-stats-indicator-negative'
                                  } else if (approveAUD == prevApproveAUD) {
                                    approveAttrition = '0%'
                                    approveAttrition_bg = 'widget-stats-indicator-positive'
                                  }
                                }

                                // Scheduled external
                                if (scheduledAUD == 0) {
                                  scheduledAttrition = '0%'
                                  scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                } else {
                                  if (scheduledAUD > prevScheduledAUD) {
                                    const attrition = Number(prevScheduledAUD) / Number(scheduledAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    scheduledAttrition = value.replace(/['"]+/g, '')
                                    scheduledAttrition_icon = 'icon-arrow-up'
                                    scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                  } else if (scheduledAUD < prevScheduledAUD) {
                                    const attrition = Number(scheduledAUD) / Number(prevScheduledAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    scheduledAttrition = value.replace(/['"]+/g, '')
                                    scheduledAttrition_icon = 'icon-arrow-down'
                                    scheduledAttrition_bg = 'widget-stats-indicator-negative'
                                  } else if (scheduledAUD == prevScheduledAUD) {
                                    scheduledAttrition = '0%'
                                    scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                  }
                                }

                                // In-Progress external
                                if (inproAUD == 0) {
                                  inproAttrition = '0%'
                                  inproAttrition_bg = 'widget-stats-indicator-positive'
                                } else {
                                  if (inproAUD > prevInProAUD) {
                                    const attrition = Number(prevInProAUD) / Number(inproAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    inproAttrition = value.replace(/['"]+/g, '')
                                    inproAttrition_icon = 'icon-arrow-up'
                                    inproAttrition_bg = 'widget-stats-indicator-positive'
                                  } else if (inproAUD < prevInProAUD) {
                                    const attrition = Number(inproAUD) / Number(prevInProAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    inproAttrition = value.replace(/['"]+/g, '')
                                    inproAttrition_icon = 'icon-arrow-down'
                                    inproAttrition_bg = 'widget-stats-indicator-negative'
                                  } else if (inproAUD == prevInProAUD) {
                                    inproAttrition = '0%'
                                    inproAttrition_bg = 'widget-stats-indicator-positive'
                                  }
                                }

                                // Completed external
                                if (comAUD == 0) {
                                  comAttrition = '0%'
                                  comAttrition_bg = 'widget-stats-indicator-positive'
                                } else {
                                  if (comAUD > prevComAUD) {
                                    const attrition = Number(prevComAUD) / Number(comAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    comAttrition = value.replace(/['"]+/g, '')
                                    comAttrition_icon = 'icon-arrow-up'
                                    comAttrition_bg = 'widget-stats-indicator-positive'
                                  } else if (comAUD < prevComAUD) {
                                    const attrition = Number(comAUD) / Number(prevComAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    comAttrition = value.replace(/['"]+/g, '')
                                    comAttrition_icon = 'icon-arrow-down'
                                    comAttrition_bg = 'widget-stats-indicator-negative'
                                  } else if (comAUD == prevComAUD) {
                                    comAttrition = '0%'
                                    comAttrition_bg = 'widget-stats-indicator-positive'
                                  }
                                }
                                // Audit Fee
                                if (totalFee == 0) {
                                  feeAttrition = '0%'
                                  feeAttrition_bg = 'widget-stats-indicator-positive'
                                } else {
                                  if (totalFee > prevtotalFee) {
                                    const attrition = Number(prevtotalFee) / Number(totalFee) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    feeAttrition = value.replace(/['"]+/g, '')
                                    feeAttrition_icon = 'icon-arrow-up'
                                    feeAttrition_bg = 'widget-stats-indicator-positive'
                                  } else if (totalFee < prevtotalFee) {
                                    const attrition = Number(totalFee) / Number(prevtotalFee) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    feeAttrition = value.replace(/['"]+/g, '')
                                    feeAttrition_icon = 'icon-arrow-down'
                                    feeAttrition_bg = 'widget-stats-indicator-negative'
                                  } else if (totalFee == prevtotalFee) {
                                    feeAttrition = '0%'
                                    feeAttrition_bg = 'widget-stats-indicator-positive'
                                  }
                                }
                                this.summaryCardData.push(
                                  {
                                    "title": "Scheduled",
                                    "icon": "icon-more-horizontal",
                                    "value": scheduledAUD,
                                    "attrition": scheduledAttrition,
                                    "attri_icon": scheduledAttrition_icon,
                                    "attri_bg": scheduledAttrition_bg

                                  },
                                  {
                                    "title": "Approved",
                                    "icon": "icon-list",
                                    "value": approveAUD,
                                    "attrition": approveAttrition,
                                    "attri_icon": approveAttrition_icon,
                                    "attri_bg": approveAttrition_bg

                                  },
                                  {
                                    "title": "In-Progress",
                                    "icon": "icon-chevrons-right",
                                    "value": inproAUD,
                                    "attrition": inproAttrition,
                                    "attri_icon": inproAttrition_icon,
                                    "attri_bg": inproAttrition_bg

                                  },
                                  {
                                    "title": "Completed",
                                    "icon": "icon-check-circle",
                                    "value": comAUD,
                                    "attrition": comAttrition,
                                    "attri_icon": comAttrition_icon,
                                    "attri_bg": comAttrition_bg

                                  },
                                  {
                                    "title": "Audit Fee",
                                    "icon": "icon-bar-chart-2",
                                    "value": totalFee,
                                    "attrition": feeAttrition,
                                    "attri_icon": feeAttrition_icon,
                                    "attri_bg": feeAttrition_bg

                                  }
                                )
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
          complete: () => {
          }
        })
      }
      else {
        this.internalAuditService.generate_internal_audit_approved_data(start, end, this.userDivision).subscribe({
          next: (result: any) => {
            this.internalAuditService.generate_internal_audit_approved_data(prevStart, prevEnd, this.userDivision).subscribe({
              next: (preResult: any) => {
                this.internalAuditApprovedData = result.data
                this.previnternalAuditApprovedData = preResult.data
                this.internalAuditService.generate_internal_audit_inprogress_data(start, end, this.userDivision).subscribe({
                  next: (proresult: any) => {
                    this.internalAuditInProgressData = proresult.data
                    this.internalAuditService.generate_internal_audit_inprogress_data(prevStart, prevEnd, this.userDivision).subscribe({
                      next: (preproresult: any) => {
                        this.previnternalAuditInProgressData = preproresult.data
                        this.internalAuditService.generate_internal_audit_completed_data(start, end, this.userDivision).subscribe({
                          next: (comresult: any) => {

                            this.internalAuditCompletedData = comresult.data
                            this.internalAuditService.generate_internal_audit_completed_data(prevStart, prevEnd, this.userDivision).subscribe({
                              next: (precomResult: any) => {
                                this.previnternalAuditCompletedData = precomResult.data
                                this.internalAuditService.generate_internal_audit_scheduled_data(start, end, this.userDivision).subscribe({
                                  next: (comresult: any) => {

                                    this.internalScheduledAuditData = comresult.data
                                    this.internalAuditService.generate_internal_audit_scheduled_data(prevStart, prevEnd, this.userDivision).subscribe({
                                      next: (precomResult: any) => {
                                        this.previnternalScheduledAuditData = precomResult.data
                                      },
                                      error: (err: any) => { },
                                      complete: () => {

                                        let comAttrition = ''
                                        let comAttrition_icon = ''
                                        let comAttrition_bg = ''

                                        let scheduledAttrition = ''
                                        let scheduledAttrition_icon = ''
                                        let scheduledAttrition_bg = ''

                                        let inproAttrition = ''
                                        let inproAttrition_icon = ''
                                        let inproAttrition_bg = ''

                                        let approveAttrition = ''
                                        let approveAttrition_icon = ''
                                        let approveAttrition_bg = ''

                                        let feeAttrition = ''
                                        let feeAttrition_icon = ''
                                        let feeAttrition_bg = ''

                                        const totalFee = 0;
                                        const totalActions = this.internalAuditAction.length;
                                        const closedActions = this.internalAuditAction.filter(auditAction => auditAction.attributes.status === 'Completed').length;
                                        if (closedActions === 0 || totalActions === 0) {
                                          this.PerComAudAction = 0
                                        }
                                        else {
                                          this.PerComAudAction = (closedActions / totalActions) * 100;
                                        }
                                        //previous data                          
                                        const prevtotalFee = 0;

                                        const approveAUD = Number(this.internalAuditApprovedData.length)
                                        const comAUD = Number(this.internalAuditCompletedData.length)
                                        const scheduledAUD = Number(this.internalScheduledAuditData.length)
                                        const inproAUD = Number(this.internalAuditInProgressData.length)
                                        const prevApproveAUD = Number(this.previnternalAuditApprovedData.length)
                                        const prevComAUD = Number(this.previnternalAuditCompletedData.length)
                                        const prevScheduledAUD = Number(this.previnternalScheduledAuditData.length)
                                        const prevInProAUD = Number(this.previnternalAuditInProgressData.length)
                                        const totalPrevActions = this.internalPrevAuditAction.length;
                                        const closedPrevActions = this.internalPrevAuditAction.filter(auditAction => auditAction.attributes.status === 'Completed').length;
                                        const PerPrevComAudAction = (closedPrevActions / totalPrevActions) * 100;

                                        // Approved
                                        if (approveAUD == 0) {
                                          approveAttrition = '0%'
                                          approveAttrition_bg = 'widget-stats-indicator-positive'
                                        } else {
                                          if (approveAUD > prevApproveAUD) {
                                            const attrition = Number(prevApproveAUD) / Number(approveAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            approveAttrition = value.replace(/['"]+/g, '')
                                            approveAttrition_icon = 'icon-arrow-up'
                                            approveAttrition_bg = 'widget-stats-indicator-positive'
                                          } else if (approveAUD < prevApproveAUD) {
                                            const attrition = Number(approveAUD) / Number(prevApproveAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            approveAttrition = value.replace(/['"]+/g, '')
                                            approveAttrition_icon = 'icon-arrow-down'
                                            approveAttrition_bg = 'widget-stats-indicator-negative'
                                          } else if (approveAUD == prevApproveAUD) {
                                            approveAttrition = '0%'
                                            approveAttrition_bg = 'widget-stats-indicator-positive'
                                          }
                                        }

                                        // Scheduled 
                                        if (scheduledAUD == 0) {
                                          scheduledAttrition = '0%'
                                          scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                        } else {
                                          if (scheduledAUD > prevScheduledAUD) {
                                            const attrition = Number(prevScheduledAUD) / Number(scheduledAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            scheduledAttrition = value.replace(/['"]+/g, '')
                                            scheduledAttrition_icon = 'icon-arrow-up'
                                            scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                          } else if (scheduledAUD < prevScheduledAUD) {
                                            const attrition = Number(scheduledAUD) / Number(prevScheduledAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            scheduledAttrition = value.replace(/['"]+/g, '')
                                            scheduledAttrition_icon = 'icon-arrow-down'
                                            scheduledAttrition_bg = 'widget-stats-indicator-negative'
                                          } else if (scheduledAUD == prevScheduledAUD) {
                                            scheduledAttrition = '0%'
                                            scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                          }
                                        }

                                        // In-Progress 
                                        if (inproAUD == 0) {
                                          inproAttrition = '0%'
                                          inproAttrition_bg = 'widget-stats-indicator-positive'
                                        } else {
                                          if (inproAUD > prevInProAUD) {
                                            const attrition = Number(prevInProAUD) / Number(inproAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            inproAttrition = value.replace(/['"]+/g, '')
                                            inproAttrition_icon = 'icon-arrow-up'
                                            inproAttrition_bg = 'widget-stats-indicator-positive'
                                          } else if (inproAUD < prevInProAUD) {
                                            const attrition = Number(inproAUD) / Number(prevInProAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            inproAttrition = value.replace(/['"]+/g, '')
                                            inproAttrition_icon = 'icon-arrow-down'
                                            inproAttrition_bg = 'widget-stats-indicator-negative'
                                          } else if (inproAUD == prevInProAUD) {
                                            inproAttrition = '0%'
                                            inproAttrition_bg = 'widget-stats-indicator-positive'
                                          }
                                        }

                                        // Completed 
                                        if (comAUD == 0) {
                                          comAttrition = '0%'
                                          comAttrition_bg = 'widget-stats-indicator-positive'
                                        } else {
                                          if (comAUD > prevComAUD) {
                                            const attrition = Number(prevComAUD) / Number(comAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            comAttrition = value.replace(/['"]+/g, '')
                                            comAttrition_icon = 'icon-arrow-up'
                                            comAttrition_bg = 'widget-stats-indicator-positive'
                                          } else if (comAUD < prevComAUD) {
                                            const attrition = Number(comAUD) / Number(prevComAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            comAttrition = value.replace(/['"]+/g, '')
                                            comAttrition_icon = 'icon-arrow-down'
                                            comAttrition_bg = 'widget-stats-indicator-negative'
                                          } else if (comAUD == prevComAUD) {
                                            comAttrition = '0%'
                                            comAttrition_bg = 'widget-stats-indicator-positive'
                                          }
                                        }
                                        // Percentage of Corrective action plan completed
                                        if (isNaN(this.PerComAudAction) || isNaN(PerPrevComAudAction)) {
                                          feeAttrition = '0%'
                                          feeAttrition_bg = 'widget-stats-indicator-positive'
                                        } else {
                                          if (this.PerComAudAction > PerPrevComAudAction) {
                                            const attrition = Number(PerPrevComAudAction) / Number(this.PerComAudAction) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            feeAttrition = value.replace(/['"]+/g, '')
                                            feeAttrition_icon = 'icon-arrow-up'
                                            feeAttrition_bg = 'widget-stats-indicator-positive'
                                          } else if (this.PerComAudAction < PerPrevComAudAction) {
                                            const attrition = Number(this.PerComAudAction) / Number(PerPrevComAudAction) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            feeAttrition = value.replace(/['"]+/g, '')
                                            feeAttrition_icon = 'icon-arrow-down'
                                            feeAttrition_bg = 'widget-stats-indicator-negative'
                                          } else if (this.PerComAudAction == PerPrevComAudAction) {
                                            feeAttrition = '0%'
                                            feeAttrition_bg = 'widget-stats-indicator-positive'
                                          }
                                        }
                                        this.summaryCardData.push(
                                          {
                                            "title": "Scheduled",
                                            "icon": "icon-more-horizontal",
                                            "value": scheduledAUD,
                                            "attrition": scheduledAttrition,
                                            "attri_icon": scheduledAttrition_icon,
                                            "attri_bg": scheduledAttrition_bg

                                          },
                                          {
                                            "title": "Approved",
                                            "icon": "icon-list",
                                            "value": approveAUD,
                                            "attrition": approveAttrition,
                                            "attri_icon": approveAttrition_icon,
                                            "attri_bg": approveAttrition_bg

                                          },
                                          {
                                            "title": "In-Progress",
                                            "icon": "icon-chevrons-right",
                                            "value": inproAUD,
                                            "attrition": inproAttrition,
                                            "attri_icon": inproAttrition_icon,
                                            "attri_bg": inproAttrition_bg

                                          },
                                          {
                                            "title": "Completed",
                                            "icon": "icon-check-circle",
                                            "value": comAUD,
                                            "attrition": comAttrition,
                                            "attri_icon": comAttrition_icon,
                                            "attri_bg": comAttrition_bg

                                          },
                                          {
                                            "title": "Completed Action Plan",
                                            "icon": "icon-bar-chart-2",
                                            "value": this.PerComAudAction.toFixed(0) + ' %',
                                            "attrition": feeAttrition,
                                            "attri_icon": feeAttrition_icon,
                                            "attri_bg": feeAttrition_bg

                                          }
                                        )
                                      }
                                    })
                                  },
                                  error: (err: any) => { },
                                  complete: () => {
                                    this.team_productivity()
                                    this.announcement_Card()
                                    this.timeliness_Card()
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
              complete: () => {
              }
            })
          },
          error: (err: any) => { },
          complete: () => {
          }
        })
      }

    }
    else if (auditType && division) {
      if (auditType === 'External') {
        this.externalAuditService.generate_external_audit_approved_division_data(start, end, division).subscribe({
          next: (result: any) => {
            this.externalAuditService.generate_external_audit_approved_division_data(prevStart, prevEnd, division).subscribe({
              next: (preResult: any) => {
                this.externalAuditApprovedData = result.data
                this.prevexternalAuditApprovedData = preResult.data
                this.externalAuditService.generate_external_audit_inprogress_division_data(start, end, division).subscribe({
                  next: (proresult: any) => {
                    this.externalAuditInProgressData = proresult.data
                    this.externalAuditService.generate_external_audit_inprogress_division_data(prevStart, prevEnd, division).subscribe({
                      next: (preproresult: any) => {
                        this.prevexternalAuditInProgressData = preproresult.data
                        this.externalAuditService.generate_external_audit_completed_division_data(start, end, division).subscribe({
                          next: (comresult: any) => {

                            this.externalAuditCompletedData = comresult.data
                            this.externalAuditService.generate_external_audit_completed_division_data(prevStart, prevEnd, division).subscribe({
                              next: (precomResult: any) => {
                                this.prevexternalAuditCompletedData = precomResult.data


                                let comAttrition = ''
                                let comAttrition_icon = ''
                                let comAttrition_bg = ''

                                let scheduledAttrition = ''
                                let scheduledAttrition_icon = ''
                                let scheduledAttrition_bg = ''

                                let inproAttrition = ''
                                let inproAttrition_icon = ''
                                let inproAttrition_bg = ''

                                let approveAttrition = ''
                                let approveAttrition_icon = ''
                                let approveAttrition_bg = ''

                                let feeAttrition = ''
                                let feeAttrition_icon = ''
                                let feeAttrition_bg = ''

                                const totalFee = this.externalAuditCompletedData.reduce((acc, cur) => acc + Number(cur.attributes?.audit_fee), 0);

                                //previous data                          
                                const prevtotalFee = this.prevexternalAuditCompletedData.reduce((acc, cur) => acc + Number(cur.attributes?.audit_fee), 0);


                                const approveAUD = Number(this.externalAuditApprovedData.length)
                                const comAUD = Number(this.externalAuditCompletedData.length)
                                const scheduledAUD = Number(this.externalAuditData.length)
                                const inproAUD = Number(this.externalAuditInProgressData.length)
                                const prevApproveAUD = Number(this.prevexternalAuditApprovedData.length)
                                const prevComAUD = Number(this.prevexternalAuditCompletedData.length)
                                const prevScheduledAUD = Number(this.prevexternalAuditData.length)
                                const prevInProAUD = Number(this.prevexternalAuditInProgressData.length)

                                // Approved
                                if (approveAUD == 0) {
                                  approveAttrition = '0%'
                                  approveAttrition_bg = 'widget-stats-indicator-positive'
                                } else {
                                  if (approveAUD > prevApproveAUD) {
                                    const attrition = Number(prevApproveAUD) / Number(approveAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    approveAttrition = value.replace(/['"]+/g, '')
                                    approveAttrition_icon = 'icon-arrow-up'
                                    approveAttrition_bg = 'widget-stats-indicator-positive'
                                  } else if (approveAUD < prevApproveAUD) {
                                    const attrition = Number(approveAUD) / Number(prevApproveAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    approveAttrition = value.replace(/['"]+/g, '')
                                    approveAttrition_icon = 'icon-arrow-down'
                                    approveAttrition_bg = 'widget-stats-indicator-negative'
                                  } else if (approveAUD == prevApproveAUD) {
                                    approveAttrition = '0%'
                                    approveAttrition_bg = 'widget-stats-indicator-positive'
                                  }
                                }

                                // Scheduled external
                                if (scheduledAUD == 0) {
                                  scheduledAttrition = '0%'
                                  scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                } else {
                                  if (scheduledAUD > prevScheduledAUD) {
                                    const attrition = Number(prevScheduledAUD) / Number(scheduledAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    scheduledAttrition = value.replace(/['"]+/g, '')
                                    scheduledAttrition_icon = 'icon-arrow-up'
                                    scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                  } else if (scheduledAUD < prevScheduledAUD) {
                                    const attrition = Number(scheduledAUD) / Number(prevScheduledAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    scheduledAttrition = value.replace(/['"]+/g, '')
                                    scheduledAttrition_icon = 'icon-arrow-down'
                                    scheduledAttrition_bg = 'widget-stats-indicator-negative'
                                  } else if (scheduledAUD == prevScheduledAUD) {
                                    scheduledAttrition = '0%'
                                    scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                  }
                                }

                                // In-Progress external
                                if (inproAUD == 0) {
                                  inproAttrition = '0%'
                                  inproAttrition_bg = 'widget-stats-indicator-positive'
                                } else {
                                  if (inproAUD > prevInProAUD) {
                                    const attrition = Number(prevInProAUD) / Number(inproAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    inproAttrition = value.replace(/['"]+/g, '')
                                    inproAttrition_icon = 'icon-arrow-up'
                                    inproAttrition_bg = 'widget-stats-indicator-positive'
                                  } else if (inproAUD < prevInProAUD) {
                                    const attrition = Number(inproAUD) / Number(prevInProAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    inproAttrition = value.replace(/['"]+/g, '')
                                    inproAttrition_icon = 'icon-arrow-down'
                                    inproAttrition_bg = 'widget-stats-indicator-negative'
                                  } else if (inproAUD == prevInProAUD) {
                                    inproAttrition = '0%'
                                    inproAttrition_bg = 'widget-stats-indicator-positive'
                                  }
                                }

                                // Completed external
                                if (comAUD == 0) {
                                  comAttrition = '0%'
                                  comAttrition_bg = 'widget-stats-indicator-positive'
                                } else {
                                  if (comAUD > prevComAUD) {
                                    const attrition = Number(prevComAUD) / Number(comAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    comAttrition = value.replace(/['"]+/g, '')
                                    comAttrition_icon = 'icon-arrow-up'
                                    comAttrition_bg = 'widget-stats-indicator-positive'
                                  } else if (comAUD < prevComAUD) {
                                    const attrition = Number(comAUD) / Number(prevComAUD) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    comAttrition = value.replace(/['"]+/g, '')
                                    comAttrition_icon = 'icon-arrow-down'
                                    comAttrition_bg = 'widget-stats-indicator-negative'
                                  } else if (comAUD == prevComAUD) {
                                    comAttrition = '0%'
                                    comAttrition_bg = 'widget-stats-indicator-positive'
                                  }
                                }
                                // Audit Fee
                                if (totalFee == 0) {
                                  feeAttrition = '0%'
                                  feeAttrition_bg = 'widget-stats-indicator-positive'
                                } else {
                                  if (totalFee > prevtotalFee) {
                                    const attrition = Number(prevtotalFee) / Number(totalFee) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    feeAttrition = value.replace(/['"]+/g, '')
                                    feeAttrition_icon = 'icon-arrow-up'
                                    feeAttrition_bg = 'widget-stats-indicator-positive'
                                  } else if (totalFee < prevtotalFee) {
                                    const attrition = Number(totalFee) / Number(prevtotalFee) * 100
                                    const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                    feeAttrition = value.replace(/['"]+/g, '')
                                    feeAttrition_icon = 'icon-arrow-down'
                                    feeAttrition_bg = 'widget-stats-indicator-negative'
                                  } else if (totalFee == prevtotalFee) {
                                    feeAttrition = '0%'
                                    feeAttrition_bg = 'widget-stats-indicator-positive'
                                  }
                                }
                                this.summaryCardData.push(
                                  {
                                    "title": "Scheduled",
                                    "icon": "icon-more-horizontal",
                                    "value": scheduledAUD,
                                    "attrition": scheduledAttrition,
                                    "attri_icon": scheduledAttrition_icon,
                                    "attri_bg": scheduledAttrition_bg

                                  },
                                  {
                                    "title": "Approved",
                                    "icon": "icon-list",
                                    "value": approveAUD,
                                    "attrition": approveAttrition,
                                    "attri_icon": approveAttrition_icon,
                                    "attri_bg": approveAttrition_bg

                                  },
                                  {
                                    "title": "In-Progress",
                                    "icon": "icon-chevrons-right",
                                    "value": inproAUD,
                                    "attrition": inproAttrition,
                                    "attri_icon": inproAttrition_icon,
                                    "attri_bg": inproAttrition_bg

                                  },
                                  {
                                    "title": "Completed",
                                    "icon": "icon-check-circle",
                                    "value": comAUD,
                                    "attrition": comAttrition,
                                    "attri_icon": comAttrition_icon,
                                    "attri_bg": comAttrition_bg

                                  },
                                  {
                                    "title": "Audit Fee",
                                    "icon": "icon-bar-chart-2",
                                    "value": totalFee,
                                    "attrition": feeAttrition,
                                    "attri_icon": feeAttrition_icon,
                                    "attri_bg": feeAttrition_bg

                                  }
                                )
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
          complete: () => {
          }
        })
      }
      else {
        this.internalAuditService.generate_internal_audit_approved_division_data(start, end, division).subscribe({
          next: (result: any) => {
            this.internalAuditService.generate_internal_audit_approved_division_data(prevStart, prevEnd, division).subscribe({
              next: (preResult: any) => {
                this.internalAuditApprovedData = result.data
                this.previnternalAuditApprovedData = preResult.data
                this.internalAuditService.generate_internal_audit_inprogress_division_data(start, end, division).subscribe({
                  next: (proresult: any) => {
                    this.internalAuditInProgressData = proresult.data
                    this.internalAuditService.generate_internal_audit_inprogress_division_data(prevStart, prevEnd, division).subscribe({
                      next: (preproresult: any) => {
                        this.previnternalAuditInProgressData = preproresult.data
                        this.internalAuditService.generate_internal_audit_completed_division_data(start, end, division).subscribe({
                          next: (comresult: any) => {

                            this.internalAuditCompletedData = comresult.data
                            this.internalAuditService.generate_internal_audit_completed_division_data(prevStart, prevEnd, division).subscribe({
                              next: (precomResult: any) => {
                                this.previnternalAuditCompletedData = precomResult.data
                                this.internalAuditService.generate_internal_audit_scheduled_division_data(start, end, division).subscribe({
                                  next: (comresult: any) => {

                                    this.internalScheduledAuditData = comresult.data
                                    this.internalAuditService.generate_internal_audit_scheduled_division_data(prevStart, prevEnd, division).subscribe({
                                      next: (precomResult: any) => {
                                        this.previnternalScheduledAuditData = precomResult.data
                                      },
                                      error: (err: any) => { },
                                      complete: () => {

                                        let comAttrition = ''
                                        let comAttrition_icon = ''
                                        let comAttrition_bg = ''

                                        let scheduledAttrition = ''
                                        let scheduledAttrition_icon = ''
                                        let scheduledAttrition_bg = ''

                                        let inproAttrition = ''
                                        let inproAttrition_icon = ''
                                        let inproAttrition_bg = ''

                                        let approveAttrition = ''
                                        let approveAttrition_icon = ''
                                        let approveAttrition_bg = ''

                                        let feeAttrition = ''
                                        let feeAttrition_icon = ''
                                        let feeAttrition_bg = ''

                                        const totalFee = 0;
                                        const totalActions = this.internalAuditAction.length;
                                        const closedActions = this.internalAuditAction.filter(auditAction => auditAction.attributes.status === 'Completed').length;

                                        if (closedActions === 0 || totalActions === 0) {
                                          this.PerComAudAction = 0
                                        }
                                        else {
                                          this.PerComAudAction = (closedActions / totalActions) * 100;
                                        }
                                        //previous data                          
                                        const prevtotalFee = 0;

                                        const approveAUD = Number(this.internalAuditApprovedData.length)
                                        const comAUD = Number(this.internalAuditCompletedData.length)
                                        const scheduledAUD = Number(this.internalScheduledAuditData.length)
                                        const inproAUD = Number(this.internalAuditInProgressData.length)
                                        const prevApproveAUD = Number(this.previnternalAuditApprovedData.length)
                                        const prevComAUD = Number(this.previnternalAuditCompletedData.length)
                                        const prevScheduledAUD = Number(this.previnternalScheduledAuditData.length)
                                        const prevInProAUD = Number(this.previnternalAuditInProgressData.length)
                                        const totalPrevActions = this.internalPrevAuditAction.length;
                                        const closedPrevActions = this.internalPrevAuditAction.filter(auditAction => auditAction.attributes.status === 'Completed').length;
                                        const PerPrevComAudAction = (closedPrevActions / totalPrevActions) * 100;
                                        // Approved
                                        if (approveAUD == 0) {
                                          approveAttrition = '0%'
                                          approveAttrition_bg = 'widget-stats-indicator-positive'
                                        } else {
                                          if (approveAUD > prevApproveAUD) {
                                            const attrition = Number(prevApproveAUD) / Number(approveAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            approveAttrition = value.replace(/['"]+/g, '')
                                            approveAttrition_icon = 'icon-arrow-up'
                                            approveAttrition_bg = 'widget-stats-indicator-positive'
                                          } else if (approveAUD < prevApproveAUD) {
                                            const attrition = Number(approveAUD) / Number(prevApproveAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            approveAttrition = value.replace(/['"]+/g, '')
                                            approveAttrition_icon = 'icon-arrow-down'
                                            approveAttrition_bg = 'widget-stats-indicator-negative'
                                          } else if (approveAUD == prevApproveAUD) {
                                            approveAttrition = '0%'
                                            approveAttrition_bg = 'widget-stats-indicator-positive'
                                          }
                                        }

                                        // Scheduled external
                                        if (scheduledAUD == 0) {
                                          scheduledAttrition = '0%'
                                          scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                        } else {
                                          if (scheduledAUD > prevScheduledAUD) {
                                            const attrition = Number(prevScheduledAUD) / Number(scheduledAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            scheduledAttrition = value.replace(/['"]+/g, '')
                                            scheduledAttrition_icon = 'icon-arrow-up'
                                            scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                          } else if (scheduledAUD < prevScheduledAUD) {
                                            const attrition = Number(scheduledAUD) / Number(prevScheduledAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            scheduledAttrition = value.replace(/['"]+/g, '')
                                            scheduledAttrition_icon = 'icon-arrow-down'
                                            scheduledAttrition_bg = 'widget-stats-indicator-negative'
                                          } else if (scheduledAUD == prevScheduledAUD) {
                                            scheduledAttrition = '0%'
                                            scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                          }
                                        }

                                        // In-Progress external
                                        if (inproAUD == 0) {
                                          inproAttrition = '0%'
                                          inproAttrition_bg = 'widget-stats-indicator-positive'
                                        } else {
                                          if (inproAUD > prevInProAUD) {
                                            const attrition = Number(prevInProAUD) / Number(inproAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            inproAttrition = value.replace(/['"]+/g, '')
                                            inproAttrition_icon = 'icon-arrow-up'
                                            inproAttrition_bg = 'widget-stats-indicator-positive'
                                          } else if (inproAUD < prevInProAUD) {
                                            const attrition = Number(inproAUD) / Number(prevInProAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            inproAttrition = value.replace(/['"]+/g, '')
                                            inproAttrition_icon = 'icon-arrow-down'
                                            inproAttrition_bg = 'widget-stats-indicator-negative'
                                          } else if (inproAUD == prevInProAUD) {
                                            inproAttrition = '0%'
                                            inproAttrition_bg = 'widget-stats-indicator-positive'
                                          }
                                        }

                                        // Completed external
                                        if (comAUD == 0) {
                                          comAttrition = '0%'
                                          comAttrition_bg = 'widget-stats-indicator-positive'
                                        } else {
                                          if (comAUD > prevComAUD) {
                                            const attrition = Number(prevComAUD) / Number(comAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            comAttrition = value.replace(/['"]+/g, '')
                                            comAttrition_icon = 'icon-arrow-up'
                                            comAttrition_bg = 'widget-stats-indicator-positive'
                                          } else if (comAUD < prevComAUD) {
                                            const attrition = Number(comAUD) / Number(prevComAUD) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            comAttrition = value.replace(/['"]+/g, '')
                                            comAttrition_icon = 'icon-arrow-down'
                                            comAttrition_bg = 'widget-stats-indicator-negative'
                                          } else if (comAUD == prevComAUD) {
                                            comAttrition = '0%'
                                            comAttrition_bg = 'widget-stats-indicator-positive'
                                          }
                                        }
                                        // Percentage of Corrective action plan completed
                                        if (isNaN(this.PerComAudAction) || isNaN(PerPrevComAudAction)) {
                                          feeAttrition = '0%'
                                          feeAttrition_bg = 'widget-stats-indicator-positive'
                                        } else {
                                          if (this.PerComAudAction > PerPrevComAudAction) {
                                            const attrition = Number(PerPrevComAudAction) / Number(this.PerComAudAction) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            feeAttrition = value.replace(/['"]+/g, '')
                                            feeAttrition_icon = 'icon-arrow-up'
                                            feeAttrition_bg = 'widget-stats-indicator-positive'
                                          } else if (this.PerComAudAction < PerPrevComAudAction) {
                                            const attrition = Number(this.PerComAudAction) / Number(PerPrevComAudAction) * 100
                                            const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                            feeAttrition = value.replace(/['"]+/g, '')
                                            feeAttrition_icon = 'icon-arrow-down'
                                            feeAttrition_bg = 'widget-stats-indicator-negative'
                                          } else if (this.PerComAudAction == PerPrevComAudAction) {
                                            feeAttrition = '0%'
                                            feeAttrition_bg = 'widget-stats-indicator-positive'
                                          }
                                        }
                                        this.summaryCardData.push(
                                          {
                                            "title": "Scheduled",
                                            "icon": "icon-more-horizontal",
                                            "value": scheduledAUD,
                                            "attrition": scheduledAttrition,
                                            "attri_icon": scheduledAttrition_icon,
                                            "attri_bg": scheduledAttrition_bg

                                          },
                                          {
                                            "title": "Approved",
                                            "icon": "icon-list",
                                            "value": approveAUD,
                                            "attrition": approveAttrition,
                                            "attri_icon": approveAttrition_icon,
                                            "attri_bg": approveAttrition_bg

                                          },
                                          {
                                            "title": "In-Progress",
                                            "icon": "icon-chevrons-right",
                                            "value": inproAUD,
                                            "attrition": inproAttrition,
                                            "attri_icon": inproAttrition_icon,
                                            "attri_bg": inproAttrition_bg

                                          },
                                          {
                                            "title": "Completed",
                                            "icon": "icon-check-circle",
                                            "value": comAUD,
                                            "attrition": comAttrition,
                                            "attri_icon": comAttrition_icon,
                                            "attri_bg": comAttrition_bg

                                          },
                                          {
                                            "title": "Completed Action Plan",
                                            "icon": "icon-bar-chart-2",
                                            "value": this.PerComAudAction.toFixed(0) + ' %',
                                            "attrition": feeAttrition,
                                            "attri_icon": feeAttrition_icon,
                                            "attri_bg": feeAttrition_bg

                                          }
                                        )
                                      }
                                    })
                                  },
                                  error: (err: any) => { },
                                  complete: () => {
                                    this.team_productivity()
                                    this.announcement_Card()
                                    this.timeliness_Card()
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
              complete: () => {
              }
            })
          },
          error: (err: any) => { },
          complete: () => {
          }
        })
      }

    }

    else if (!auditType && division) {
      this.externalAuditService.generate_external_audit_approved_division_data(start, end, division).subscribe({
        next: (result: any) => {
          this.externalAuditService.generate_external_audit_approved_division_data(prevStart, prevEnd, division).subscribe({
            next: (preResult: any) => {
              this.externalAuditApprovedData = result.data
              this.prevexternalAuditApprovedData = preResult.data
              this.externalAuditService.generate_external_audit_inprogress_division_data(start, end, division).subscribe({
                next: (proresult: any) => {
                  this.externalAuditInProgressData = proresult.data
                  this.externalAuditService.generate_external_audit_inprogress_division_data(prevStart, prevEnd, division).subscribe({
                    next: (preproresult: any) => {
                      this.prevexternalAuditInProgressData = preproresult.data
                      this.externalAuditService.generate_external_audit_completed_division_data(start, end, division).subscribe({
                        next: (comresult: any) => {

                          this.externalAuditCompletedData = comresult.data
                          this.externalAuditService.generate_external_audit_completed_division_data(prevStart, prevEnd, division).subscribe({
                            next: (precomResult: any) => {
                              this.prevexternalAuditCompletedData = precomResult.data
                            },
                            error: (err: any) => { },
                            complete: () => {
                              //Internal
                              this.internalAuditService.generate_internal_audit_approved_division_data(start, end, division).subscribe({
                                next: (result: any) => {
                                  this.internalAuditService.generate_internal_audit_approved_division_data(prevStart, prevEnd, division).subscribe({
                                    next: (preResult: any) => {
                                      this.internalAuditApprovedData = result.data
                                      this.previnternalAuditApprovedData = preResult.data
                                      this.internalAuditService.generate_internal_audit_inprogress_division_data(start, end, division).subscribe({
                                        next: (proresult: any) => {
                                          this.internalAuditInProgressData = proresult.data
                                          this.internalAuditService.generate_internal_audit_inprogress_division_data(prevStart, prevEnd, division).subscribe({
                                            next: (preproresult: any) => {
                                              this.previnternalAuditInProgressData = preproresult.data
                                              this.internalAuditService.generate_internal_audit_completed_division_data(start, end, division).subscribe({
                                                next: (comresult: any) => {

                                                  this.internalAuditCompletedData = comresult.data
                                                  this.internalAuditService.generate_internal_audit_completed_division_data(prevStart, prevEnd, division).subscribe({
                                                    next: (precomResult: any) => {
                                                      this.previnternalAuditCompletedData = precomResult.data
                                                      this.internalAuditService.generate_internal_audit_scheduled_division_data(start, end, division).subscribe({
                                                        next: (comresult: any) => {

                                                          this.internalScheduledAuditData = comresult.data
                                                          this.internalAuditService.generate_internal_audit_scheduled_division_data(prevStart, prevEnd, division).subscribe({
                                                            next: (precomResult: any) => {
                                                              this.previnternalScheduledAuditData = precomResult.data
                                                            },
                                                            error: (err: any) => { },
                                                            complete: () => {

                                                              let comAttrition = ''
                                                              let comAttrition_icon = ''
                                                              let comAttrition_bg = ''

                                                              let scheduledAttrition = ''
                                                              let scheduledAttrition_icon = ''
                                                              let scheduledAttrition_bg = ''

                                                              let inproAttrition = ''
                                                              let inproAttrition_icon = ''
                                                              let inproAttrition_bg = ''

                                                              let approveAttrition = ''
                                                              let approveAttrition_icon = ''
                                                              let approveAttrition_bg = ''

                                                              let feeAttrition = ''
                                                              let feeAttrition_icon = ''
                                                              let feeAttrition_bg = ''

                                                              const totalFee = this.externalAuditCompletedData.reduce((acc, cur) => acc + Number(cur.attributes?.audit_fee), 0);

                                                              //previous data                          
                                                              const prevtotalFee = this.prevexternalAuditCompletedData.reduce((acc, cur) => acc + Number(cur.attributes?.audit_fee), 0);


                                                              const approveAUD = Number(this.externalAuditApprovedData.length) + Number(this.internalAuditApprovedData.length)
                                                              const comAUD = Number(this.externalAuditCompletedData.length) + Number(this.internalAuditCompletedData.length)
                                                              const scheduledAUD = Number(this.externalAuditData.length) + Number(this.internalScheduledAuditData.length)
                                                              const inproAUD = Number(this.externalAuditInProgressData.length) + Number(this.internalAuditInProgressData.length)
                                                              const prevApproveAUD = Number(this.prevexternalAuditApprovedData.length) + Number(this.previnternalAuditApprovedData.length)
                                                              const prevComAUD = Number(this.prevexternalAuditCompletedData.length) + Number(this.previnternalAuditCompletedData.length)
                                                              const prevScheduledAUD = Number(this.prevexternalAuditData.length) + Number(this.previnternalScheduledAuditData.length)
                                                              const prevInProAUD = Number(this.prevexternalAuditInProgressData.length) + Number(this.previnternalAuditInProgressData.length)

                                                              // Approved
                                                              if (approveAUD == 0) {
                                                                approveAttrition = '0%'
                                                                approveAttrition_bg = 'widget-stats-indicator-positive'
                                                              } else {
                                                                if (approveAUD > prevApproveAUD) {
                                                                  const attrition = Number(prevApproveAUD) / Number(approveAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  approveAttrition = value.replace(/['"]+/g, '')
                                                                  approveAttrition_icon = 'icon-arrow-up'
                                                                  approveAttrition_bg = 'widget-stats-indicator-positive'
                                                                } else if (approveAUD < prevApproveAUD) {
                                                                  const attrition = Number(approveAUD) / Number(prevApproveAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  approveAttrition = value.replace(/['"]+/g, '')
                                                                  approveAttrition_icon = 'icon-arrow-down'
                                                                  approveAttrition_bg = 'widget-stats-indicator-negative'
                                                                } else if (approveAUD == prevApproveAUD) {
                                                                  approveAttrition = '0%'
                                                                  approveAttrition_bg = 'widget-stats-indicator-positive'
                                                                }
                                                              }

                                                              // Scheduled external
                                                              if (scheduledAUD == 0) {
                                                                scheduledAttrition = '0%'
                                                                scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                                              } else {
                                                                if (scheduledAUD > prevScheduledAUD) {
                                                                  const attrition = Number(prevScheduledAUD) / Number(scheduledAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  scheduledAttrition = value.replace(/['"]+/g, '')
                                                                  scheduledAttrition_icon = 'icon-arrow-up'
                                                                  scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                                                } else if (scheduledAUD < prevScheduledAUD) {
                                                                  const attrition = Number(scheduledAUD) / Number(prevScheduledAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  scheduledAttrition = value.replace(/['"]+/g, '')
                                                                  scheduledAttrition_icon = 'icon-arrow-down'
                                                                  scheduledAttrition_bg = 'widget-stats-indicator-negative'
                                                                } else if (scheduledAUD == prevScheduledAUD) {
                                                                  scheduledAttrition = '0%'
                                                                  scheduledAttrition_bg = 'widget-stats-indicator-positive'
                                                                }
                                                              }

                                                              // In-Progress external
                                                              if (inproAUD == 0) {
                                                                inproAttrition = '0%'
                                                                inproAttrition_bg = 'widget-stats-indicator-positive'
                                                              } else {
                                                                if (inproAUD > prevInProAUD) {
                                                                  const attrition = Number(prevInProAUD) / Number(inproAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  inproAttrition = value.replace(/['"]+/g, '')
                                                                  inproAttrition_icon = 'icon-arrow-up'
                                                                  inproAttrition_bg = 'widget-stats-indicator-positive'
                                                                } else if (inproAUD < prevInProAUD) {
                                                                  const attrition = Number(inproAUD) / Number(prevInProAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  inproAttrition = value.replace(/['"]+/g, '')
                                                                  inproAttrition_icon = 'icon-arrow-down'
                                                                  inproAttrition_bg = 'widget-stats-indicator-negative'
                                                                } else if (inproAUD == prevInProAUD) {
                                                                  inproAttrition = '0%'
                                                                  inproAttrition_bg = 'widget-stats-indicator-positive'
                                                                }
                                                              }

                                                              // Completed external
                                                              if (comAUD == 0) {
                                                                comAttrition = '0%'
                                                                comAttrition_bg = 'widget-stats-indicator-positive'
                                                              } else {
                                                                if (comAUD > prevComAUD) {
                                                                  const attrition = Number(prevComAUD) / Number(comAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  comAttrition = value.replace(/['"]+/g, '')
                                                                  comAttrition_icon = 'icon-arrow-up'
                                                                  comAttrition_bg = 'widget-stats-indicator-positive'
                                                                } else if (comAUD < prevComAUD) {
                                                                  const attrition = Number(comAUD) / Number(prevComAUD) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  comAttrition = value.replace(/['"]+/g, '')
                                                                  comAttrition_icon = 'icon-arrow-down'
                                                                  comAttrition_bg = 'widget-stats-indicator-negative'
                                                                } else if (comAUD == prevComAUD) {
                                                                  comAttrition = '0%'
                                                                  comAttrition_bg = 'widget-stats-indicator-positive'
                                                                }
                                                              }
                                                              // Audit Fee
                                                              if (totalFee == 0) {
                                                                feeAttrition = '0%'
                                                                feeAttrition_bg = 'widget-stats-indicator-positive'
                                                              } else {
                                                                if (totalFee > prevtotalFee) {
                                                                  const attrition = Number(prevtotalFee) / Number(totalFee) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  feeAttrition = value.replace(/['"]+/g, '')
                                                                  feeAttrition_icon = 'icon-arrow-up'
                                                                  feeAttrition_bg = 'widget-stats-indicator-positive'
                                                                } else if (totalFee < prevtotalFee) {
                                                                  const attrition = Number(totalFee) / Number(prevtotalFee) * 100
                                                                  const value = JSON.stringify(attrition.toFixed(0) + ' %')
                                                                  feeAttrition = value.replace(/['"]+/g, '')
                                                                  feeAttrition_icon = 'icon-arrow-down'
                                                                  feeAttrition_bg = 'widget-stats-indicator-negative'
                                                                } else if (totalFee == prevtotalFee) {
                                                                  feeAttrition = '0%'
                                                                  feeAttrition_bg = 'widget-stats-indicator-positive'
                                                                }
                                                              }
                                                              this.summaryCardData.push(
                                                                {
                                                                  "title": "Scheduled",
                                                                  "icon": "icon-more-horizontal",
                                                                  "value": scheduledAUD,
                                                                  "attrition": scheduledAttrition,
                                                                  "attri_icon": scheduledAttrition_icon,
                                                                  "attri_bg": scheduledAttrition_bg

                                                                },
                                                                {
                                                                  "title": "Approved",
                                                                  "icon": "icon-list",
                                                                  "value": approveAUD,
                                                                  "attrition": approveAttrition,
                                                                  "attri_icon": approveAttrition_icon,
                                                                  "attri_bg": approveAttrition_bg

                                                                },
                                                                {
                                                                  "title": "In-Progress",
                                                                  "icon": "icon-chevrons-right",
                                                                  "value": inproAUD,
                                                                  "attrition": inproAttrition,
                                                                  "attri_icon": inproAttrition_icon,
                                                                  "attri_bg": inproAttrition_bg

                                                                },
                                                                {
                                                                  "title": "Completed",
                                                                  "icon": "icon-check-circle",
                                                                  "value": comAUD,
                                                                  "attrition": comAttrition,
                                                                  "attri_icon": comAttrition_icon,
                                                                  "attri_bg": comAttrition_bg

                                                                },
                                                                {
                                                                  "title": "Audit Fee",
                                                                  "icon": "icon-bar-chart-2",
                                                                  "value": totalFee,
                                                                  "attrition": feeAttrition,
                                                                  "attri_icon": feeAttrition_icon,
                                                                  "attri_bg": feeAttrition_bg

                                                                }
                                                              )
                                                            }
                                                          })
                                                        },
                                                        error: (err: any) => { },
                                                        complete: () => {
                                                          this.team_productivity()
                                                          this.announcement_Card()
                                                          this.timeliness_Card()
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
                                    complete: () => {
                                    }
                                  })
                                },
                                error: (err: any) => { },
                                complete: () => {
                                }
                              })
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
        complete: () => {
        }
      })
    }
  }

  reset() {
    this.divisions = []
    this.ngOnInit()
    this.dateRange.enable()
  }



  division_card() {
    const comData = this.internalAuditData.filter(function (elem) {

      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed")
    })
    let diviName: any[] = []
    let divisionName: any[] = []
    comData.forEach(elem => {
      diviName.push(elem.attributes.internal_audit.data.attributes.division)
    })
    var duplicateValue = new Set(diviName);
    diviName = [...duplicateValue];
    divisionName = diviName
    let division: any[] = []
    let socialValue: any[] = []
    let healthValue: any[] = []
    let envValue: any[] = []
    let secValue: any[] = []
    let mngValue: any[] = []
    divisionName.forEach(divi => {
      division.push(divi)
      const socialData = comData.filter(function (elem) {
        return (elem.attributes.internal_audit.data.attributes.labor_audit_status == "Completed" && elem.attributes.category == "Labor" && elem.attributes.internal_audit.data.attributes.division === divi)
      })
      const socialMark = socialData.reduce((accumulator, current) => accumulator + Number(current.attributes.score), 0);
      const socialScore = Number(socialMark)
      if (socialMark === 0) {
        socialValue.push(Number(0).toFixed(2))
      } else {
        socialValue.push(Number(socialScore).toFixed(2))
      }
      const healthData = comData.filter(function (elem) {
        return (elem.attributes.internal_audit.data.attributes.labor_audit_status == "Completed" && elem.attributes.category == "Health" && elem.attributes.internal_audit.data.attributes.division === divi)
      })
      const healthMark = healthData.reduce((accumulator, current) => accumulator + Number(current.attributes.score), 0);
      const healthScore = Number(healthMark)
      if (healthMark === 0) {
        healthValue.push(Number(0).toFixed(2))
      } else {
        healthValue.push(Number(healthScore).toFixed(2))
      }
      const envData = comData.filter(function (elem) {
        return (elem.attributes.internal_audit.data.attributes.environment_audit_status == "Completed" && elem.attributes.category == "Environment" && elem.attributes.internal_audit.data.attributes.division === divi)
      })
      const envMark = envData.reduce((accumulator, current) => accumulator + Number(current.attributes.score), 0);
      const envScore = Number(envMark)
      if (envMark === 0) {
        envValue.push(Number(0).toFixed(2))
      } else {
        envValue.push(Number(envScore).toFixed(2))
      }
      const secData = comData.filter(function (elem) {
        return (elem.attributes.internal_audit.data.attributes.security_audit_status == "Completed" && elem.attributes.category == "Security" && elem.attributes.internal_audit.data.attributes.division === divi)
      })
      const secMark = secData.reduce((accumulator, current) => accumulator + Number(current.attributes.score), 0);
      const secScore = Number(secMark)
      if (secMark === 0) {
        secValue.push(Number(0).toFixed(2))
      } else {
        secValue.push(Number(secScore).toFixed(2))
      }
      const mngData = comData.filter(function (elem) {
        return (elem.attributes.internal_audit.data.attributes.management_audit_status == "Completed" && elem.attributes.category == "Management System" && elem.attributes.internal_audit.data.attributes.division === divi)
      })
      const mngMark = mngData.reduce((accumulator, current) => accumulator + Number(current.attributes.score), 0);
      const mngScore = Number(mngMark)
      if (mngMark === 0) {
        mngValue.push(Number(0).toFixed(2))
      } else {
        mngValue.push(Number(mngScore).toFixed(2))
      }
    }

    )
    this.divisionChart.series = [
      {
        name: "Social",
        data: socialValue
      },
      {
        name: "Health",
        data: healthValue
      },
      {
        name: "Environment",
        data: envValue
      },
      {
        name: "Security",
        data: secValue
      },
      {
        name: "Management System",
        data: mngValue
      }
    ]
    this.divisionChart.xaxis = { categories: division }

  }

  external_monthly_card() {

    const allMonths = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const completedCounts: { [month: string]: number } = {};
    const scheduledCounts: { [month: string]: number } = {};
    const pendingCounts: { [month: string]: number } = {};

    allMonths.forEach(month => {
      completedCounts[month] = 0;
      scheduledCounts[month] = 0;
      pendingCounts[month] = 0;
    });

    this.externalAuditData.forEach((elem) => {
      const auditDate = new Date(elem.attributes.audit_start_date);
      const month = auditDate.toLocaleString('en-us', { month: 'short' });

      if (elem.attributes.audit_status === 'Completed') {
        completedCounts[month]++;
      }
      else if (elem.attributes.audit_status === 'Scheduled') {
        scheduledCounts[month]++;
      }
      else if (elem.attributes.audit_status === 'In Progress') {
        pendingCounts[month]++;
      }
    });

    const months = allMonths;
    const completed = Object.values(completedCounts);
    const scheduled = Object.values(scheduledCounts);
    const pending = Object.values(pendingCounts);
    this.externalMonthlyChart.series = [
      {
        name: "Number of Audits Scheduled",
        data: scheduled
      },
      {
        name: "Number of Audits Completed",
        data: completed
      },
      {
        name: "Number of Audits Pending",
        data: pending
      }
    ]
    this.externalMonthlyChart.xaxis = { categories: months }

  }

  avg_internal_audit_score() {
    this.audit_summary = [];
    this.avgInternalScoreChart.series = [
      { name: 'Audit Score', data: [] },
      { name: 'Final Score', data: [] },
      { name: 'Social Auditing Score', data: [] },
      { name: 'Health & Safety Auditing Score', data: [] },
      { name: 'Environment Auditing Score', data: [] },
      { name: 'Management System Auditing Score', data: [] },
      { name: 'Security Auditing Score', data: [] },
    ];

    const uniqueMonths = new Set<string>();

    this.internalAuditData.forEach((elem) => {
      const date = new Date(elem.attributes.internal_audit.data.attributes.date);
      if (isValidDate(date)) {
        const monthAbbreviation = date.toLocaleString('en-US', { month: 'short' });
        uniqueMonths.add(monthAbbreviation);
      }
    });

    const months = Array.from(uniqueMonths).sort((a, b) => {
      const monthOrder: { [key: string]: number } = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };
      return monthOrder[a] - monthOrder[b];
    });

    function isValidDate(d: Date) {
      return d instanceof Date && !isNaN(d.getTime());
    }

    months.forEach((month) => {
      const socialData = this.getChartDataForCategory('Labor', month);
      const healthData = this.getChartDataForCategory('Health', month);
      const environData = this.getChartDataForCategory('Environment', month);
      const managementData = this.getChartDataForCategory('Management System', month);
      const securityData = this.getChartDataForCategory('Security', month);

      this.avgInternalScoreChart.series[0].data.push({
        x: month,
        y: socialData.totalScore,
      });
      this.avgInternalScoreChart.series[1].data.push({
        x: month,
        y: socialData.finalScore,
      });
      this.avgInternalScoreChart.series[2].data.push({
        x: month,
        y: socialData.laborWeightEverage,
      });
      this.avgInternalScoreChart.series[3].data.push({
        x: month,
        y: healthData.healthWeightEverage,
      });
      this.avgInternalScoreChart.series[4].data.push({
        x: month,
        y: environData.environWeightEverage,
      });
      this.avgInternalScoreChart.series[5].data.push({
        x: month,
        y: managementData.managementWeightEverage,
      });
      this.avgInternalScoreChart.series[6].data.push({
        x: month,
        y: securityData.securityWeightEverage,
      });
    });

  }

  getChartDataForCategory(category: string, month: string) {
    const categoryCheckList = this.internalAuditData.filter((elem: any) => {
      return (
        elem.attributes.category === category &&
        this.getMonthAbbreviation(elem) === month
      );
    });

    const totalMarks = categoryCheckList.reduce(
      (acc, cur) => acc + Number(cur.attributes.achievable_score),
      0
    );
    const earnedMarks = categoryCheckList.reduce(
      (acc, cur) => acc + Number(cur.attributes.score),
      0
    );
    const earnerMarkPerce = Number(
      (Number(earnedMarks) / Number(totalMarks)) * 100
    ).toFixed(2);

    const weightage = this.getWeightageForCategory(category);
    const weightEverage = Number(
      Number(earnerMarkPerce) * (Number(weightage) / 100)
    ).toFixed(2);

    if (earnedMarks === 0) {
      return {
        totalScore: '0 %',
        finalScore: '0 %',
        laborWeightEverage: '0 %',
        healthWeightEverage: '0 %',
        environWeightEverage: '0 %',
        managementWeightEverage: '0 %',
        securityWeightEverage: '0 %',
      };
    } else {
      return {
        totalScore: earnerMarkPerce + ' %',
        finalScore: (Number(((parseFloat(weightEverage) / 5).toFixed(2))) || '0') + ' %',
        laborWeightEverage: weightEverage + ' %',
        healthWeightEverage: weightEverage + ' %',
        environWeightEverage: weightEverage + ' %',
        managementWeightEverage: weightEverage + ' %',
        securityWeightEverage: weightEverage + ' %',
      };
    }
  }

  getMonthAbbreviation(elem: any) {
    const date = new Date(elem.attributes.internal_audit.data.attributes.date);
    if (this.isValidDate(date)) {
      return date.toLocaleString('en-US', { month: 'short' });
    }
    return '';
  }

  isValidDate(d: Date) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  getWeightageForCategory(category: string) {
    switch (category) {
      case 'Labor':
        return '30';
      case 'Health':
        return '25';
      case 'Environment':
        return '15';
      case 'Management System':
        return '15';
      case 'Security':
        return '15';
      default:
        return '0';
    }
  }


  timeliness_Card() {
    this.audTimelinessCard = []
    let value: any[] = []
    const chartLabels = ['Audit Completion Rate', 'Timely Audit Completion', 'Zero Tolerance Issue Resolution Time', 'Medium Resolution Time'];
    const scheduledAudits = this.internalScheduledAuditData.length;
    const completedAudits = this.internalScheduledAuditData.filter(audit => audit.attributes.status === 'Completed').length;
    const completedOnTimeAudits = this.internalScheduledAuditData.filter(audit => audit.attributes.status === 'Completed' && new Date(audit.attributes.end_date) >= new Date(audit.attributes.completed_date)).length;
    const totalActions = this.internalAuditAction.length;
    const closedHighActions = this.internalAuditAction.filter(auditAction => auditAction.attributes.status === 'Completed' && auditAction.attributes.priority === 'High' && new Date(auditAction.attributes.due_date) >= new Date(auditAction.attributes.actual_completion_date)).length;
    const closedMediumActions = this.internalAuditAction.filter(auditAction => auditAction.attributes.status === 'Completed' && auditAction.attributes.priority === 'Medium' && new Date(auditAction.attributes.due_date) >= new Date(auditAction.attributes.actual_completion_date)).length;
    const auditCompletionRate = (completedAudits / scheduledAudits) * 100;
    const timelyAuditCompletion = (completedOnTimeAudits / scheduledAudits) * 100;
    const zeroToleranceResolutionTime = (closedHighActions / totalActions) * 100;
    const mediumResolutionTime = (closedMediumActions / totalActions) * 100;

    if (Number(auditCompletionRate) > 0) {
      value.push(auditCompletionRate.toFixed(2))
    } else {
      value.push(0)
    }
    if (Number(timelyAuditCompletion) > 0) {
      value.push(timelyAuditCompletion.toFixed(2))
    } else {
      value.push(0)
    }
    if (Number(zeroToleranceResolutionTime) > 0) {
      value.push(zeroToleranceResolutionTime.toFixed(2))
    } else {
      value.push(0)
    }
    if (Number(mediumResolutionTime) > 0) {
      value.push(mediumResolutionTime.toFixed(2))
    } else {
      value.push(0)
    }

    this.audTimelinessCard.push(

      {
        "title": "Audit Completion Rate",
        "count": auditCompletionRate
      },
      {
        "title": "Timely Audit Completion",
        "count": timelyAuditCompletion
      },
      {
        "title": "Zero Tolerance Issue Resolution Time",
        "count": zeroToleranceResolutionTime
      },
      {
        "title": "Medium Resolution Time",
        "count": mediumResolutionTime
      }
    )
    this.timelinessChart = {
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
      colors: ["#1ab7ea", "#0084ff", "#39539E", '#F1BE65'],
      labels: chartLabels,
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

  // team_productivity() {
  //   this.teamProductivityCard = [];
  //   const teamProductivity: Record<string, number> = {};
  //   let totalApproved = 0;
  //   let totalCompleted = 0;

  //   const processAuditData = (auditData: any[], statusKey: string) => {
  //     auditData.forEach((entry) => {
  //       const status = entry.attributes[statusKey];
  //       if (status === 'Approved' || status === 'Completed') {
  //         totalApproved++;
  //         if (status === 'Completed') {
  //           totalCompleted++;
  //         }
  //         if (entry.attributes.approver) {
  //           const assignedTo =
  //             entry.attributes.approver?.data.attributes.first_name +
  //             ' ' +
  //             entry.attributes.approver?.data.attributes.last_name;
  //           if (assignedTo in teamProductivity) {
  //             teamProductivity[assignedTo]++;
  //           } else {
  //             teamProductivity[assignedTo] = 1;
  //           }
  //         }

  //       }
  //     });
  //   };

  //   if (this.filterForm.value.audit_type === 'Internal') {
  //     processAuditData(this.internalScheduledAuditData, 'status');
  //   } else if (this.filterForm.value.audit_type === 'External') {
  //     processAuditData(this.externalAuditData, 'audit_status');
  //   } else {
  //     processAuditData(this.internalScheduledAuditData, 'status');
  //     processAuditData(this.externalAuditData, 'audit_status');
  //   }

  //   const approverList = Object.keys(teamProductivity).map((approverName) => ({
  //     name: approverName,
  //     visits: teamProductivity[approverName],
  //     completionPercentage: Math.min(
  //       (teamProductivity[approverName] / totalCompleted) * 100,
  //       100
  //     ),
  //   }));

  //   approverList.sort((a, b) => b.visits - a.visits);

  //   this.teamProductivityCard = approverList.slice(0, 10);
  // }

team_productivity() {
  this.teamProductivityCard = [];
  const teamProductivity: Record<string, number> = {}; // Total audits assigned per member
  const completedCount: Record<string, number> = {}; // Completed audits per member
  let totalApproved = 0;
  let totalCompleted = 0;

  const processAuditData = (auditData: any[], statusKey: string) => {
    auditData.forEach((entry) => {
      
      const status = entry.attributes[statusKey];
      if (status === 'Approved' || status === 'Completed' || status === 'In Progress') {
        totalApproved++;

        const teamMembers = entry.attributes.audit_team_members?.data || [];
        if (Array.isArray(teamMembers)) {
          teamMembers.forEach((member: any) => {
            const memberName = member?.attributes?.name;
            if (memberName) {
              teamProductivity[memberName] = (teamProductivity[memberName] || 0) + 1;

              if (status === 'Completed') {
                completedCount[memberName] = (completedCount[memberName] || 0) + 1;
                totalCompleted++;
              }
            }
          });
        }
      }
    });
  };

  const auditType = this.filterForm.value.audit_type;
  if (auditType === 'Internal') {
    processAuditData(this.internalScheduledAuditData, 'status');
  } else if (auditType === 'External') {
    processAuditData(this.externalAuditData, 'audit_status');
  } else {
    processAuditData(this.internalScheduledAuditData, 'status');
    processAuditData(this.externalAuditData, 'audit_status');
  }

  const approverList = Object.keys(teamProductivity).map((memberName) => {
    const totalAssigned = teamProductivity[memberName];
    const completed = completedCount[memberName] || 0;
    return {
      name: memberName,
      visits: totalAssigned,
      completionPercentage: Math.round((completed / totalAssigned) * 100),
    };
  });

  approverList.sort((a, b) => b.visits - a.visits);
  this.teamProductivityCard = approverList.slice(0, 10);
}

  
  
  findings() {
    this.findingsCardData = []
    const comData = this.internalAuditData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed")
    })

    const socialComData = this.internalAuditData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed" && elem.attributes.category === "Labor")
    })

    const healthComData = this.internalAuditData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed" && elem.attributes.category === "Health")
    })

    const envComData = this.internalAuditData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed" && elem.attributes.category === "Environment")
    })

    const secComData = this.internalAuditData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed" && elem.attributes.category === "Security")
    })

    const mangComData = this.internalAuditData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed" && elem.attributes.category === "Management System")
    })

    let markList: any[] = []
    let markUnique: any[] = []

    comData.forEach(elem => {
      markList.push(elem.attributes.audit_mark)
    })
    var duplicateValue = new Set(markList);
    markList = [...duplicateValue];
    markList = markList.filter(item => item !== null && item !== undefined);

    // Sort the list
    markUnique = markList.sort((a, b) => a.toString().localeCompare(b.toString()));
    if (markUnique.length > 0) {
      markUnique.forEach(markElem => {

        //overview
        const data = comData.filter(function (elem) {
          return (elem.attributes.audit_mark == markElem)
        })

        if (markElem == "No") {
          const count = data.length
          const perce = Number(count) / Number(comData.length) * 100
          const percentage = Math.round(Number(perce)).toFixed(2)
          if (count === 0) {
            this.findingsCardData.push({
              "title": "High Findings",
              "percentage": 0,
              "count": count,
              "category": "Overview"
            })
          } else {
            this.findingsCardData.push({
              "title": "High Findings",
              "percentage": percentage,
              "count": count,
              "category": "Overview"
            })
          }

        } else if (markElem == "Partial Yes") {
          const count = data.length
          const perce = Number(count) / Number(comData.length) * 100
          const percentage = Math.round(Number(perce)).toFixed(2)

          if (count === 0) {
            this.findingsCardData.push({
              "title": "Medium Findings",
              "percentage": 0,
              "count": count,
              "category": "Overview"
            })
          } else {
            this.findingsCardData.push({
              "title": "Medium Findings",
              "percentage": percentage,
              "count": count,
              "category": "Overview"
            })
          }
        } else if (markElem == "Yes") {
          const count = data.length
          const perce = Number(count) / Number(comData.length) * 100
          const percentage = Math.round(Number(perce)).toFixed(2)
          if (count === 0) {
            this.findingsCardData.push({
              "title": "Low Findings",
              "percentage": 0,
              "count": count,
              "category": "Overview"
            })
          } else {
            this.findingsCardData.push({
              "title": "Low Findings",
              "percentage": percentage,
              "count": count,
              "category": "Overview"
            })
          }
        }

        //social
        const dataSocial = socialComData.filter(function (elem) {
          return (elem.attributes.audit_mark == markElem)
        })
        if (markElem == "No") {
          const socialCount = dataSocial.length
          const socialPerce = Number(socialCount) / Number(socialComData.length) * 100
          const socialPercentage = Math.round(Number(socialPerce)).toFixed(2)
          if (socialCount === 0) {
            this.findingsCardData.push({
              "title": "High Findings",
              "percentage": 0,
              "count": socialCount,
              "category": "Social"
            })
          } else {
            this.findingsCardData.push({
              "title": "High Findings",
              "percentage": socialPercentage,
              "count": socialCount,
              "category": "Social"
            })
          }
        } else if (markElem == "Partial Yes") {
          const socialCount = dataSocial.length
          const socialPerce = Number(socialCount) / Number(socialComData.length) * 100
          const socialPercentage = Math.round(Number(socialPerce)).toFixed(2)
          if (socialCount === 0) {
            this.findingsCardData.push({
              "title": "Medium Findings",
              "percentage": 0,
              "count": socialCount,
              "category": "Social"
            })
          } else {
            this.findingsCardData.push({
              "title": "Medium Findings",
              "percentage": socialPercentage,
              "count": socialCount,
              "category": "Social"
            })
          }
        } else if (markElem == "Yes") {
          const socialCount = dataSocial.length
          const socialPerce = Number(socialCount) / Number(socialComData.length) * 100
          const socialPercentage = Math.round(Number(socialPerce)).toFixed(2)
          if (socialCount === 0) {
            this.findingsCardData.push({
              "title": "Low Findings",
              "percentage": 0,
              "count": socialCount,
              "category": "Social"
            })
          } else {
            this.findingsCardData.push({
              "title": "Low Findings",
              "percentage": socialPercentage,
              "count": socialCount,
              "category": "Social"
            })
          }
        }

        //health
        const dataHealth = healthComData.filter(function (elem) {
          return (elem.attributes.audit_mark == markElem)
        })
        if (markElem == "No") {
          const healthCount = dataHealth.length
          const healthPerce = Number(healthCount) / Number(healthComData.length) * 100
          const healthPercentage = Math.round(Number(healthPerce)).toFixed(2)
          if (healthCount === 0) {
            this.findingsCardData.push({
              "title": "High Findings",
              "percentage": 0,
              "count": healthCount,
              "category": "Health"
            })
          } else {
            this.findingsCardData.push({
              "title": "High Findings",
              "percentage": healthPercentage,
              "count": healthCount,
              "category": "Health"
            })
          }
        } else if (markElem == "Partial Yes") {
          const healthCount = dataHealth.length
          const healthPerce = Number(healthCount) / Number(healthComData.length) * 100
          const healthPercentage = Math.round(Number(healthPerce)).toFixed(2)
          if (healthCount === 0) {
            this.findingsCardData.push({
              "title": "Medium Findings",
              "percentage": 0,
              "count": healthCount,
              "category": "Health"
            })
          } else {
            this.findingsCardData.push({
              "title": "Medium Findings",
              "percentage": healthPercentage,
              "count": healthCount,
              "category": "Health"
            })
          }
        } else if (markElem == "Yes") {
          const healthCount = dataHealth.length
          const healthPerce = Number(healthCount) / Number(healthComData.length) * 100
          const healthPercentage = Math.round(Number(healthPerce)).toFixed(2)
          if (healthCount === 0) {
            this.findingsCardData.push({
              "title": "Low Findings",
              "percentage": 0,
              "count": healthCount,
              "category": "Health"
            })
          } else {
            this.findingsCardData.push({
              "title": "Low Findings",
              "percentage": healthPercentage,
              "count": healthCount,
              "category": "Health"
            })
          }
        }

        //env
        const dataEnv = envComData.filter(function (elem) {
          return (elem.attributes.audit_mark == markElem)
        })
        if (markElem == "No") {
          const envCount = dataEnv.length
          const envPerce = Number(envCount) / Number(envComData.length) * 100
          const envPercentage = Math.round(Number(envPerce)).toFixed(2)
          if (envCount === 0) {
            this.findingsCardData.push({
              "title": "High Findings",
              "percentage": 0,
              "count": envCount,
              "category": "Environment"
            })
          } else {
            this.findingsCardData.push({
              "title": "High Findings",
              "percentage": envPercentage,
              "count": envCount,
              "category": "Environment"
            })
          }
        } else if (markElem == "Partial Yes") {
          const envCount = dataEnv.length
          const envPerce = Number(envCount) / Number(envComData.length) * 100
          const envPercentage = Math.round(Number(envPerce)).toFixed(2)
          if (envCount === 0) {
            this.findingsCardData.push({
              "title": "Medium Findings",
              "percentage": 0,
              "count": envCount,
              "category": "Environment"
            })
          } else {
            this.findingsCardData.push({
              "title": "Medium Findings",
              "percentage": envPercentage,
              "count": envCount,
              "category": "Environment"
            })
          }
        } else if (markElem == "Yes") {
          const envCount = dataEnv.length
          const envPerce = Number(envCount) / Number(envComData.length) * 100
          const envPercentage = Math.round(Number(envPerce)).toFixed(2)
          if (envCount === 0) {
            this.findingsCardData.push({
              "title": "Low Findings",
              "percentage": 0,
              "count": envCount,
              "category": "Environment"
            })
          } else {
            this.findingsCardData.push({
              "title": "Low Findings",
              "percentage": envPercentage,
              "count": envCount,
              "category": "Environment"
            })
          }
        }

        //security
        const dataSec = secComData.filter(function (elem) {
          return (elem.attributes.audit_mark == markElem)
        })
        if (markElem == "No") {
          const secCount = dataSec.length
          const secPerce = Number(secCount) / Number(secComData.length) * 100
          const secPercentage = Math.round(Number(secPerce)).toFixed(2)
          if (secCount === 0) {
            this.findingsCardData.push({
              "title": "High Findings",
              "percentage": 0,
              "count": secCount,
              "category": "Security"
            })
          } else {
            this.findingsCardData.push({
              "title": "High Findings",
              "percentage": secPercentage,
              "count": secCount,
              "category": "Security"
            })
          }
        } else if (markElem == "Partial Yes") {
          const secCount = dataSec.length
          const secPerce = Number(secCount) / Number(secComData.length) * 100
          const secPercentage = Math.round(Number(secPerce)).toFixed(2)
          if (secCount === 0) {
            this.findingsCardData.push({
              "title": "Medium Findings",
              "percentage": 0,
              "count": secCount,
              "category": "Security"
            })
          } else {
            this.findingsCardData.push({
              "title": "Medium Findings",
              "percentage": secPercentage,
              "count": secCount,
              "category": "Security"
            })
          }
        } else if (markElem == "Yes") {
          const secCount = dataSec.length
          const secPerce = Number(secCount) / Number(secComData.length) * 100
          const secPercentage = Math.round(Number(secPerce)).toFixed(2)
          if (secCount === 0) {
            this.findingsCardData.push({
              "title": "Low Findings",
              "percentage": 0,
              "count": secCount,
              "category": "Security"
            })
          } else {
            this.findingsCardData.push({
              "title": "Low Findings",
              "percentage": secPercentage,
              "count": secCount,
              "category": "Security"
            })
          }
        }

        //Management System
        const dataSys = mangComData.filter(function (elem) {
          return (elem.attributes.audit_mark == markElem)
        })
        if (markElem == "No") {
          const mngCount = dataSys.length
          const mngPerce = Number(mngCount) / Number(mangComData.length) * 100
          const mngPercentage = Math.round(Number(mngPerce)).toFixed(2)
          if (mngCount === 0) {
            this.findingsCardData.push({
              "title": "High Findings",
              "percentage": 0,
              "count": mngCount,
              "category": "Management System"
            })
          } else {
            this.findingsCardData.push({
              "title": "High Findings",
              "percentage": mngPercentage,
              "count": mngCount,
              "category": "Management System"
            })
          }
        } else if (markElem == "Partial Yes") {
          const mngCount = dataSys.length
          const mngPerce = Number(mngCount) / Number(mangComData.length) * 100
          const mngPercentage = Math.round(Number(mngPerce)).toFixed(2)
          if (mngCount === 0) {
            this.findingsCardData.push({
              "title": "Medium Findings",
              "percentage": 0,
              "count": mngCount,
              "category": "Management System"
            })
          } else {
            this.findingsCardData.push({
              "title": "Medium Findings",
              "percentage": mngPercentage,
              "count": mngCount,
              "category": "Management System"
            })
          }
        } else if (markElem == "Yes") {
          const mngCount = dataSys.length
          const mngPerce = Number(mngCount) / Number(mangComData.length) * 100
          const mngPercentage = Math.round(Number(mngPerce)).toFixed(2)
          if (mngCount === 0) {
            this.findingsCardData.push({
              "title": "Low Findings",
              "percentage": 0,
              "count": mngCount,
              "category": "Management System"
            })
          } else {
            this.findingsCardData.push({
              "title": "Low Findings",
              "percentage": mngPercentage,
              "count": mngCount,
              "category": "Management System"
            })
          }
        }

      })
    }
  }

  audScore() {

    this.audScoreCardData = []
    const comData = this.internalAuditData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed")
    })
    const total = comData.length
    const type: any[] = ["Labor", "Health", "Environment", "Security", "Management System"]

    type.forEach(typeElem => {
      const typeData = comData.filter(function (elem) {
        return (elem.attributes.category == typeElem)
      })
      const totalScore = typeData.reduce((accumulator, current) => accumulator + Number(current.attributes.achievable_score), 0);
      const obtainedScore = typeData.reduce((accumulator, current) => accumulator + Number(current.attributes.score), 0);
      const typePer = Number(Number(obtainedScore) / Number(totalScore) * 100).toFixed(0)

      if (typeElem === "Labor") {

        if (typeData.length > 0) {
          this.audScoreCardData.push(
            {
              "category": "Overview",
              "title": "Social",
              "percentage": typePer,
              "count": typeData.length
            }
          )
        } else {
          this.audScoreCardData.push(
            {
              "category": "Overview",
              "title": "Social",
              "percentage": 0,
              "count": typeData.length
            }
          )
        }
      } else {

        if (typeData.length > 0) {
          this.audScoreCardData.push(
            {
              "category": "Overview",
              "title": typeElem,
              "percentage": typePer,
              "count": typeData.length
            }
          )
        } else {
          this.audScoreCardData.push(
            {
              "category": "Overview",
              "title": typeElem,
              "percentage": 0,
              "count": typeData.length
            }
          )
        }
      }
    })

    type.forEach(subCat => {
      const subData = comData.filter(function (elem) {
        return (elem.attributes.category == subCat)
      })


      let subList: any[] = []
      let subUnique: any[] = []
      subData.forEach(elem => {
        subList.push(elem.attributes.sub_category)
      })
      var duplicateValue = new Set(subList);
      subList = [...duplicateValue];
      subUnique = subList
      subUnique.forEach(subElem => {

        const subtTypeData = subData.filter(function (elem) {
          return (elem.attributes.sub_category == subElem)
        })

        const totalScore = subtTypeData.reduce((accumulator, current) => accumulator + Number(current.attributes.achievable_score), 0);
        const obtainedScore = subtTypeData.reduce((accumulator, current) => accumulator + Number(current.attributes.score), 0);
        const subTypePer = Number(Number(obtainedScore) / Number(totalScore) * 100).toFixed(0)

        if (subCat === "Labor") {

          if (subtTypeData.length > 0) {
            this.audScoreCardData.push(
              {
                "category": "Social",
                "title": subElem,
                "percentage": subTypePer,
                "count": subtTypeData.length
              }
            )
          } else {
            this.audScoreCardData.push(
              {
                "category": "Social",
                "title": subElem,
                "percentage": 0,
                "count": subtTypeData.length
              }
            )
          }
        } else {
          if (subtTypeData.length > 0) {
            this.audScoreCardData.push(
              {
                "category": subCat,
                "title": subElem,
                "percentage": subTypePer,
                "count": subtTypeData.length
              }
            )
          } else {
            this.audScoreCardData.push(
              {
                "category": subCat,
                "title": subElem,
                "percentage": 0,
                "count": subtTypeData.length
              }
            )
          }
        }
      })
    })
  }

  repeated_subcategory_rate() {
    this.repeatedSubCategoryCard = [];
    const subcategoryVisits: Record<string, Record<string, number>> = {};

    this.internalAuditData.forEach((entry) => {
      const status = entry.attributes.internal_audit?.data?.attributes.status;

      if (status === 'Completed') {
        const categoryName = entry.attributes.category;
        const subcategoryName = entry.attributes.sub_category;

        if (categoryName && subcategoryName) {
          if (!(categoryName in subcategoryVisits)) {
            subcategoryVisits[categoryName] = {};
          }

          if (subcategoryName in subcategoryVisits[categoryName]) {
            subcategoryVisits[categoryName][subcategoryName]++;
          } else {
            subcategoryVisits[categoryName][subcategoryName] = 1;
          }
        }
      }
    });

    const repeatedSubcategoryList: any[] = [];

    for (const categoryName in subcategoryVisits) {
      for (const subcategoryName in subcategoryVisits[categoryName]) {
        repeatedSubcategoryList.push({
          category: categoryName,
          subcategory: subcategoryName,
          visits: subcategoryVisits[categoryName][subcategoryName],
        });
      }
    }

    repeatedSubcategoryList.sort((a, b) => b.visits - a.visits);

    this.repeatedSubCategoryCard = repeatedSubcategoryList.slice(0, 10);
  }

  grade_card() {
    this.audit_summary = [];

    const categories: string[] = ['Labor', 'Health', 'Environment', 'Management System', 'Security'];

    const dataPerCategory: any[] = [];

    categories.forEach((category: string) => {
      const categoryCheckList = this.internalAuditData.filter((elem: any) => {
        return elem.attributes.category === category;
      });

      const totalGrades: number = categoryCheckList.reduce(
        (acc: number, cur: any) => acc + Number(cur.attributes.achievable_score),
        0
      );
      const earnedGrades: number = categoryCheckList.reduce(
        (acc: number, cur: any) => acc + Number(cur.attributes.score),
        0
      );
      const earnerGradePerce: string = (
        (isNaN(earnedGrades) || isNaN(totalGrades) || totalGrades === 0)
          ? 0
          : (earnedGrades / totalGrades) * 100
      ).toFixed(2);
      //const weightage: string = this.getWeightageForCategory(category);
      // const weightEverage: string = Number(
      //   Number(earnerGradePerce) * (Number(weightage) / 100)
      // ).toFixed(2);

      const total_mark: string = Number(((Number(earnerGradePerce)))).toFixed(2);

      let grade = 'Bad';
      if (Number(total_mark) >= 90) {
        grade = 'Outstanding';
      } else if (Number(total_mark) >= 70) {
        grade = 'Good';
      } else if (Number(total_mark) >= 50) {
        grade = 'Poor';
      }


      dataPerCategory.push({
        category: category,
        marks: earnerGradePerce,
        grade: grade
      });
    });
    this.gradeChart.series = dataPerCategory.map(item => Number(item.marks));
    this.gradeChart.labels = dataPerCategory.map(item => item.category + ' - ' + item.grade);
  }

  heirarchy_Card() {
    const totalAction = this.internalAuditAction.length

    const heirarchyControl: Record<string, any[]> = {};

    this.internalAuditAction.forEach(data => {
      const heirarchy = data.attributes.heirarchy_control;

      if (heirarchy !== null) {

        if (!heirarchyControl[heirarchy]) {
          heirarchyControl[heirarchy] = [];
        }
        heirarchyControl[heirarchy].push(data);
      }


    });

    const heirarchyPercentages: number[] = [];
    const heirarchies: string[] = [];
    const counts: number[] = [];

    for (const heirarchy in heirarchyControl) {
      const heirarchyValueSum = heirarchyControl[heirarchy].length
      const heirarchyPercentage = (heirarchyValueSum / totalAction) * 100;
      heirarchyPercentages.push(Math.floor(heirarchyPercentage));

      heirarchies.push(heirarchy);
      counts.push(Math.floor(heirarchyValueSum));


    }
    this.heirarchyChart.series = heirarchyPercentages;
    this.heirarchyChart.labels = heirarchies;
  }

  announcement_Card() {
    const totalInternalAudit = this.internalScheduledAuditData.length;
    const totalExternalAudit = this.externalAuditData.length;

    const processAuditData = (auditData: any[], attributeName: string) => {
      const announcementType: Record<string, any[]> = {};

      auditData.forEach(data => {
        const announcement = data.attributes[attributeName];

        if (!announcementType[announcement]) {
          announcementType[announcement] = [];
        }

        announcementType[announcement].push(data);
      });

      const announcementPercentages: number[] = [];
      const announces: string[] = [];
      const counts: number[] = [];

      for (const announcement in announcementType) {

        let modifiedAnnouncement = announcement;
        const announcementValueSum = announcementType[announcement].length;
        const announcementPercentage = (announcementValueSum / auditData.length) * 100;

        if (announcement != 'null' && announcement !== undefined && announcement !== '') {
          if (announcement === 'Semi-announces' || announcement === 'Semi-announced' || announcement === 'Semi Announced') {
            modifiedAnnouncement = 'Semi-Announced';
          } else if (announcement === 'Un-announced' || announcement === 'Un-Announced') {
            modifiedAnnouncement = 'Un-Announced';
          } else if (announcement === 'Announced') {
            modifiedAnnouncement = 'Announced';
          }
          announces.push(modifiedAnnouncement);
          counts.push(Math.floor(announcementValueSum));
          announcementPercentages.push(Math.floor(announcementPercentage));

        }

      }

      return { announcementPercentages, announces, counts };
    };

    if (this.filterForm.value.audit_type === 'Internal') {
      const { announcementPercentages, announces } = processAuditData(this.internalScheduledAuditData, 'announcemeny_type');
      this.announcementChart.series = announcementPercentages;
      this.announcementChart.labels = announces;
    } else if (this.filterForm.value.audit_type === 'External') {
      const { announcementPercentages, announces } = processAuditData(this.externalAuditData, 'announcement');
      this.announcementChart.series = announcementPercentages;
      this.announcementChart.labels = announces;
    } else {
      //const combinedAuditData = [...this.internalScheduledAuditData, ...this.externalAuditData];
      const { announcementPercentages, announces } = processAuditData(this.internalScheduledAuditData, 'announcemeny_type');
      this.announcementChart.series = announcementPercentages;
      this.announcementChart.labels = announces;
    }

  }

  audit_expiry() {
    const date = new Date();
    const currentDate = moment().format('YYYY-MM-DD');

    const threeMonthsLater = new Date(date);
    threeMonthsLater.setMonth(date.getMonth() + 3);
    const expiryDate = moment(threeMonthsLater).format('YYYY-MM-DD');

    this.externalAuditService.external_audit_expiry(expiryDate, currentDate, this.userDivision).subscribe({
      next: (expSoonResult: any) => {
        const extExpiryList: any[] = [];
        const date = new Date();
        expSoonResult.data.forEach((expSoonElem: any) => {
          const auditExpiryDate = new Date(expSoonElem.attributes.audit_expiry_date);
          extExpiryList.push({
            'Category': expSoonElem.attributes.audit_category,
            'reference': expSoonElem.attributes.reference_number,
            'expiry': expSoonElem.attributes.audit_expiry_date,
            'announcement': expSoonElem.attributes.announcement,
            'division': expSoonElem.attributes.division,
            'expired': false
          });
        });

        this.external_expiry_list_card = extExpiryList;
      },
      error: (expSoonErr: any) => { },
      complete: () => { }
    });

    this.externalAuditService.external_audit_action_expiry(expiryDate, currentDate, this.extuserDivision).subscribe({
      next: (expSoonResult: any) => {
        const extActionExpiryList: any[] = [];
        const date = new Date();

        expSoonResult.data.forEach((expSoonElem: any) => {
          extActionExpiryList.push({
            'priority': expSoonElem.attributes.priority,
            'created': expSoonElem.attributes.date,
            'expiry': expSoonElem.attributes.due_date,
            'actual_completion_date': expSoonElem.attributes.actual_completion_date,
            'external_audit': expSoonElem.attributes.external_audit.data?.attributes.reference_number,
            'expired': false
          });
        });

        this.external_action_expiry_list = extActionExpiryList;
      },
      error: (expSoonErr: any) => { },
      complete: () => { }
    });

    this.internalAuditService.internal_audit_action_expiry(expiryDate, currentDate, this.intuserDivision).subscribe({
      next: (expSoonResult: any) => {
        const intActionExpiryList: any[] = [];
        const date = new Date();
        expSoonResult.data.forEach((expSoonElem: any) => {
          intActionExpiryList.push({
            'priority': expSoonElem.attributes.priority,
            'created': expSoonElem.attributes.date,
            'expiry': expSoonElem.attributes.due_date,
            'actual_completion_date': expSoonElem.attributes.actual_completion_date,
            'internal_audit': expSoonElem.attributes.internal_audit.data?.attributes.reference_number,
            'expired': false
          });
        });

        this.internal_action_expiry_list = intActionExpiryList;
      },
      error: (expSoonErr: any) => { },
      complete: () => { }
    });
  }

  upcoming_audit_expiry() {
    const currentDate = new Date();
    const threeMonthsLater = new Date(currentDate);
    threeMonthsLater.setMonth(currentDate.getMonth() + 3);
    const upcomingAudits = this.externalAuditData.filter(audit => {
      const auditExpiryDate = new Date(audit.attributes.audit_expiry_date);
      return (
        !isNaN(auditExpiryDate.getTime()) &&
        !isNaN(currentDate.getTime()) &&
        !isNaN(threeMonthsLater.getTime()) &&
        auditExpiryDate.getTime() >= currentDate.getTime() &&
        auditExpiryDate.getTime() <= threeMonthsLater.getTime()
      );
    });

    upcomingAudits.sort((a, b) => {
      const dateA = new Date(a.attributes.audit_expiry_date).getTime();
      const dateB = new Date(b.attributes.audit_expiry_date).getTime();
      return dateA - dateB;
    });

    const top10UpcomingAudits = upcomingAudits.slice(0, 10);
    this.upcomingExpiry = top10UpcomingAudits;
  }

  auditType_distribution() {
    const total = this.externalAuditData.length

    const auditType: Record<string, any[]> = {};

    this.externalAuditData.forEach(data => {
      const audType = data.attributes.audit_type;
      if (audType !== null) {
        if (!auditType[audType]) {
          auditType[audType] = [];
        }
        auditType[audType].push(data);
      }


    });

    const audTypePercentages: number[] = [];
    const audits: string[] = [];
    const counts: number[] = [];

    for (const audType in auditType) {
      const audTypeValueSum = auditType[audType].length
      const audTypePercentage = (audTypeValueSum / total) * 100;
      audTypePercentages.push(Math.floor(audTypePercentage));

      audits.push(audType);
      counts.push(Math.floor(audTypeValueSum));


    }
    this.auditTypeChart.series = audTypePercentages;
    this.auditTypeChart.labels = audits;
  }


  External_audit_Firm() {
    const total = this.externalAuditData.length;
    const firmMap: Record<string, number> = {};
  
    this.externalAuditData.forEach(data => {
      const firm = data.attributes.audit_firm;
      if (firm) {
        firmMap[firm] = (firmMap[firm] || 0) + 1;
      }
    });
  
    this.auditFirmChart.series = [];
    this.auditFirmChart.labels = [];
    this.auditFirmDetails = [];
  
    for (const firm in firmMap) {
      const count = firmMap[firm];
      const percentage = ((count / total) * 100).toFixed(2);
  
      this.auditFirmChart.series.push(count);
      this.auditFirmChart.labels.push(firm); // Just the firm name
  
      this.auditFirmDetails.push({
        firm,
        count,
        percentage: +percentage
      });
    }
  
    this.totalAuditFirms = total; // For the "Total" box
  }
  
  
  
  category_breakdown() {
    let diviName: any[] = [];
    let auditCategories: any[] = [];

    this.externalAuditData.forEach(elem => {
      diviName.push(elem.attributes.business_unit.data?.attributes.division_name);
      auditCategories.push(elem.attributes.audit_category);
    });

    // Filter divisions based on this.divisions
    const filteredDiviNames = diviName.filter(divi => this.divisions.some(division => division.division_name === divi));

    const uniqueDiviNames = Array.from(new Set(filteredDiviNames));
    const uniqueAuditCategories = Array.from(new Set(auditCategories));
    const seriesData: any[] = [];

    uniqueAuditCategories.forEach(category => {
      const categoryCount: number[] = Array(uniqueDiviNames.length).fill(0);
      this.externalAuditData.forEach(elem => {
        const categoryIndex = uniqueAuditCategories.indexOf(elem.attributes.audit_category);
        if (categoryIndex !== -1) {
          if (elem.attributes.division && uniqueDiviNames.includes(elem.attributes.division)) {
            const diviIndex = uniqueDiviNames.indexOf(elem.attributes.division);
            categoryCount[diviIndex]++;
          }
        }
      });

      seriesData.push({
        name: category,
        group: uniqueDiviNames,
        data: categoryCount
      });
    });

    this.categoryBreakdownChart.series = seriesData;
    this.categoryBreakdownChart.xaxis = { categories: uniqueDiviNames };
  }

  division_wise_audit() {
    const quarterChartEl = document.querySelector("#chart-quarter");
    const yearChartEl = document.querySelector("#chart-year");
    if (quarterChartEl && yearChartEl) {
      yearChartEl.classList.remove("chart-quarter-activated");
      quarterChartEl.classList.remove("active");
    }
    this.groupedData = []
    const division = this.filterForm.value.division
    const countsByStatus: { [status: string]: { [year: number]: number } } = {
      'Scheduled': {},
      'Completed': {},
    };
    if (this.filterForm.value.division) {
      this.externalAuditService.generate_external_year_division_data(division).subscribe({
        next: (result: any) => {
          this.externalAuditYearData = result.data;
          this.divisionWiseChart = {
            series: [
              {
                data: this.makeData()
              }
            ],
            chart: {
              id: "barYear",
              height: 400,
              width: "100%",
              type: "bar",
              events: {
                dataPointSelection: (e: any, chart: any, opts: any) => {
                  var quarterChartEl = document.querySelector("#chart-quarter");
                  var yearChartEl = document.querySelector("#chart-year");

                  if (quarterChartEl && yearChartEl) {
                    if (opts.selectedDataPoints[0].length === 1) {
                      this.selectedYear = parseInt(chart.w.config.series[0].data[opts.dataPointIndex].x);
                      if (quarterChartEl.classList.contains("active")) {
                        this.updateQuarterChart(chart, "barQuarter");
                      } else {
                        yearChartEl.classList.add("chart-quarter-activated");
                        quarterChartEl.classList.add("active");
                        this.updateQuarterChart(chart, "barQuarter");
                      }
                    } else {
                      yearChartEl.classList.remove("chart-quarter-activated");
                      quarterChartEl.classList.remove("active");
                    }

                  }
                },

                updated: (chart: any) => {
                  this.updateQuarterChart(chart, "barQuarter");
                }
              },
              toolbar: {
                show: false
              }
            },
            plotOptions: {
              bar: {
                distributed: true,
                horizontal: true,
                barHeight: "75%",
                dataLabels: {
                  position: "bottom"
                }
              }
            },
            dataLabels: {
              enabled: true,
              textAnchor: "start",
              style: {
                colors: ["#fff"]
              },
              formatter: function (val: any, opt: any) {
                return opt.w.globals.labels[opt.dataPointIndex];
              },
              offsetX: 0,
              dropShadow: {
                enabled: true
              }
            },
            tooltip: {
              x: {
                show: false
              },
              y: {


                title: {
                  name: 'Total Audits:',
                  formatter: function (val: any, opts: any) {
                    return opts.w.globals.labels[opts.dataPointIndex.label];
                  }
                }
              }
            },
            yaxis: {
              labels: {
                show: false
              }
            }
          };
        },
        error: (error) => {
        },
        complete: () => {
          this.audit_standard_Card()
        }
      });
    }
    else {
      this.externalAuditService.generate_external_year_data().subscribe({
        next: (result: any) => {

          this.externalAuditYearData = result.data;
          this.divisionWiseChart = {
            series: [
              {
                data: this.makeData()
              }
            ],
            chart: {
              id: "barYear",
              height: 400,
              width: "100%",
              type: "bar",
              events: {
                dataPointSelection: (e: any, chart: any, opts: any) => {
                  var quarterChartEl = document.querySelector("#chart-quarter");
                  var yearChartEl = document.querySelector("#chart-year");

                  if (quarterChartEl && yearChartEl) {
                    if (opts.selectedDataPoints[0].length === 1) {
                      this.selectedYear = parseInt(chart.w.config.series[0].data[opts.dataPointIndex].x);
                      if (quarterChartEl.classList.contains("active")) {
                        this.updateQuarterChart(chart, "barQuarter");
                      } else {
                        yearChartEl.classList.add("chart-quarter-activated");
                        quarterChartEl.classList.add("active");
                        this.updateQuarterChart(chart, "barQuarter");
                      }
                    } else {
                      yearChartEl.classList.remove("chart-quarter-activated");
                      quarterChartEl.classList.remove("active");
                    }

                  }
                },

                updated: (chart: any) => {
                  this.updateQuarterChart(chart, "barQuarter");
                }
              },
              toolbar: {
                show: false
              }
            },
            plotOptions: {
              bar: {
                distributed: true,
                horizontal: true,
                barHeight: "75%",
                dataLabels: {
                  position: "bottom"
                }
              }
            },
            dataLabels: {
              enabled: true,
              textAnchor: "start",
              style: {
                colors: ["#fff"]
              },
              formatter: function (val: any, opt: any) {
                return opt.w.globals.labels[opt.dataPointIndex];
              },
              offsetX: 0,
              dropShadow: {
                enabled: true
              }
            },
            tooltip: {
              x: {
                show: false
              },
              y: {


                title: {
                  name: 'Total Audits:',
                  formatter: function (val: any, opts: any) {
                    return opts.w.globals.labels[opts.dataPointIndex.label];
                  }
                }
              }
            },
            yaxis: {
              labels: {
                show: false
              }
            }
          };
        },
        error: (error) => {
        },
        complete: () => {
          this.audit_standard_Card()
        }
      });
    }

  }

  public makeData(): any {
    var dataSet = this.shuffleArray(this.externalAuditYearData);
    this.groupedData = this.groupDataByYear(dataSet);
    var dataYearSeries = this.groupedData
      .filter((group: any) => group.year !== '1970' && group.year !== 'NaN') // Exclude entries with year 1970
      .map((group: any) => ({
        x: group.year,
        y: group.auditStatus.length,
        label: `${group.year} (${group.auditStatus.length})`,
      }));

    return dataYearSeries;
  }



  private groupDataByYear(dataSet: any[]): any[] {
    dataSet.forEach((item: any) => {
      var year = new Date(item.attributes.completed_date).getFullYear().toString();
      var existingGroup = this.groupedData.find(group => group.year === year);

      if (this.divisions.some(division => division.division_name === item.attributes.business_unit.data?.attributes.division_name)) {
        if (existingGroup) {
          existingGroup.Division.push(item.attributes.business_unit.data?.attributes.division_name);
          existingGroup.auditStatus.push(item.attributes.audit_status);
        } else {
          this.groupedData.push({
            year: year,
            Division: [item.attributes.business_unit.data?.attributes.division_name],
            auditStatus: [item.attributes.audit_status]
          });
        }
      }

      var scheduledYear = new Date(item.attributes.reported_date).getFullYear().toString();
      if (scheduledYear !== year) {
        var scheduledGroup = this.groupedData.find(group => group.year === scheduledYear);

        // Check if the division is in this.divisions
        if (this.divisions.some(division => division.division_name === item.attributes.business_unit.data?.attributes.division_name)) {
          if (scheduledGroup) {
            scheduledGroup.Division.push(item.attributes.business_unit.data?.attributes.division_name);
            scheduledGroup.auditStatus.push(item.attributes.audit_status);
          } else {
            this.groupedData.push({
              year: scheduledYear,
              Division: [item.attributes.business_unit.data?.attributes.division_name],
              auditStatus: [item.attributes.audit_status]
            });
          }
        }
      }
    });

    return this.groupedData;
  }


  shuffleArray(array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  public updateQuarterChart(sourceChart: any, destChartIDToUpdate: any) {
    if (this.selectedYear !== null) {
      const filteredData = this.groupedData.filter((group) => group.year === this.selectedYear.toString());

      const chart = this.divisionWiseOptionsChart;
      if (chart && filteredData.length > 0) {
        const divisionCounts: { [division: string]: { completed: number; scheduled: number } } = {};

        filteredData.forEach((group) => {
          group.Division.forEach((division: any, index: any) => {
            const status = group.auditStatus[index];
            if (!divisionCounts[division]) {
              divisionCounts[division] = { completed: 0, scheduled: 0 };
            }
            if (status === 'Completed') {
              divisionCounts[division].completed++;
            } else if (status === 'Scheduled') {
              divisionCounts[division].scheduled++;
            }
          });
        });

        const divisions = Object.keys(divisionCounts);
        const completedCounts = divisions.map((division) => divisionCounts[division].completed);
        const scheduledCounts = divisions.map((division) => divisionCounts[division].scheduled);

        this.divisionWiseOptionsChart = {
          series: [
            {
              name: "Scheduled",
              data: scheduledCounts
            },
            {
              name: "Completed",
              data: completedCounts
            }
          ],
          chart: {
            id: "barQuarter",
            height: 400,
            width: "100%",
            type: "bar",
            stacked: true,
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              columnWidth: "50%",
              horizontal: false
            }
          },
          legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left',
            onItemClick: {
              toggleDataSeries: true
            },
            onItemHover: {
              highlightDataSeries: true
            }
          },
          xaxis: {
            categories: divisions,
            labels: {
              rotate: -45,
              offsetY: 5
            }
          },
          yaxis: {
            labels: {
              show: true
            },
            title: {
              text: 'Audit Count'
            }
          },
          tooltip: {
            x: {
              formatter: function (val: any, opts: any) {
                return opts.w.globals.seriesNames[opts.seriesIndex];
              }
            },
            y: {
              title: {
                formatter: function (val: any, opts: any) {
                  return opts.w.globals.labels[opts.dataPointIndex];
                }
              }
            }
          }
        };

      }
    } else {
    }
  }



  audit_standard_Card() {
    const groupedStandards: Record<string, any[]> = {};

    this.externalAuditYearData.forEach(data => {
      const div = data.attributes.audit_standard;
      if (div !== null) {
        if (!groupedStandards[div]) {
          groupedStandards[div] = [];
        }
        groupedStandards[div].push(data);
      }
    });

    const standards: string[] = [];
    const counts: number[] = [];
    let standard_count: any[] = []
    for (const standard in groupedStandards) {
      const standardCount = groupedStandards[standard].length;
      standards.push(standard);
      counts.push(standardCount);

    }
    standard_count.push({
      name: 'Audit Standards',
      data: counts
    })
    standardChart.xaxis = { categories: standards }
    standardChart.series = standard_count

  }


}


