import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { environment } from 'src/environments/environment';
import { ChartType, markChart, divisionChart, monthlyScoreChart, radialChart, auditChart, externalMonthlyChart } from './chart-model';
import { ExternalAuditService } from 'src/app/services/external-audit.service';
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
  dateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  prevDateRange = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });

  divisions: any[] = []
  currency: any
  orgID: any
  internalAuditData: any[] = []
  previnternalAuditData: any[] = []
  summaryCardData: any[] = []
  findingsCardData: any[] = []
  markChart: ChartType
  divisionChart: ChartType
  externalMonthlyChart: ChartType
  socialMark: any
  healthMark: any
  envMark: any
  secMark: any
  mngMark:any
  socialTotalMark: number
  healthTotalMark: number
  envTotalMark: number
  secTotalMark: number
  mngTotalMark:number
  monthlyScoreChart: ChartType
  radialChart: ChartType
  internalAuditAction: any[] = []
  internalPrevAuditAction: any[] = []
  actionPending: any
  actionCardData: any[] = []
  auditChart: ChartType
  subCategoryCardData: any[] = []
  externalAuditData: any[] = []
  prevexternalAuditData: any[] = []





  constructor(private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private internalAuditService: InternalAuditService,
    private externalAuditService: ExternalAuditService) { }

  ngOnInit() {
    this.showProgressPopup()
    this.markChart = markChart
    this.divisionChart = divisionChart
    this.monthlyScoreChart = monthlyScoreChart
    this.radialChart = radialChart
    this.auditChart = auditChart
    this.externalMonthlyChart = externalMonthlyChart

    this.configuration()
    this.filterForm = this.formBuilder.group({
      startDate: [''],
      endDate: [''],
      division: [''],
      prevStartDate: [''],
      prevEndDate: ['']
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

  filterSubCategory(value: any) {
    return value.category === "Overview"

  }

  filterSocialSubCategory(value: any) {
    return value.category === "Social"

  }

  filterHealthSubCategory(value: any) {
    return value.category === "Health"

  }

  filterEnvSubCategory(value: any) {
    return value.category === "Environment"

  }

  filterSecSubCategory(value: any) {
    return value.category === "Security"

  }

  filterMngSubCategory(value: any) {
    return value.category === "Management System"
  }


  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.audit_inspection
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
        const status = result.aud_dashboard
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_division()



        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_division() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        this.divisions = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.get_audit_checklist()
      }
    })
  }

  get_audit_checklist() {
    this.internalAuditService.get_audit_checklist().subscribe({
      next: (result: any) => {
        const socialData = result.data.filter(function (elem: any) {
          return (elem.attributes.category == "Labor")
        })
        const healthData = result.data.filter(function (elem: any) {
          return (elem.attributes.category == "Health")
        })
        const envData = result.data.filter(function (elem: any) {
          return (elem.attributes.category == "Environment")
        })
        const secData = result.data.filter(function (elem: any) {
          return (elem.attributes.category == "Security")
        })
        const mngData = result.data.filter(function (elem: any) {
          return (elem.attributes.category == "Management System")
        })
        this.socialTotalMark = Number(socialData.length) * 3
        this.healthTotalMark = Number(healthData.length) * 3
        this.envTotalMark = Number(envData.length) * 3
        this.secTotalMark = Number(secData.length) * 3
        this.mngTotalMark = Number(mngData.length) * 3


      },
      error: (err: any) => { },
      complete: () => {
        this.default_data()

      }
    })
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
    console.log(this.filterForm.value.startDate);
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
    console.log(this.filterForm.value.endDate);
    console.log(this.filterForm.value.prevStartDate);
    console.log(this.filterForm.value.prevEndDate);
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
    if (this.filterForm.value.division) {
      this.division_data()

    } else if (!this.filterForm.value.division) {
      this.default_data()

    }


  }

  division_data() {

    const start = new Date(this.filterForm.value.startDate).toISOString()
    const end = new Date(this.filterForm.value.endDate).toISOString()
    const division = this.filterForm.value.division
    this.internalAuditService.generate_internal_audit_data_division(start, end, division).subscribe({
      next: (result: any) => {
        this.internalAuditData = result.data
        this.internalAuditService.generate_internal_audit_action_division(start, end, division).subscribe({
          next: (result: any) => {
            this.internalAuditAction = result.data
            this.externalAuditService.generate_external_audit_data_division(start, end, division).subscribe({
              next: (result: any) => {
                this.externalAuditData = result.data

              },
              error: (err: any) => { },
              complete: () => {

                this.summary_card()
                this.mark_card()
                this.division_card()
                this.monthly_score()
                this.findings()
                this.auditAction()
                this.subCategory()
                this.external_monthly_card()
              }
            })
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

  reset() {
    this.ngOnInit()


  }

  default_data() {

    //get current month data
    // const start = new Date(this.filterForm.value.startDate).toISOString()
    // const end = new Date(this.filterForm.value.endDate).toISOString()
    // const prevStart = new Date(this.filterForm.value.prevStartDate).toISOString()
    // const prevEnd = new Date(this.filterForm.value.prevEndDate).toISOString()
    // this.internalAuditService.generate_internal_audit_data(start, end).subscribe({
    //   next: (result: any) => {
    //     //get previous month data

    //     this.internalAuditService.generate_internal_audit_data(prevStart, prevEnd).subscribe({
    //       next: (preResult: any) => {
    //         this.internalAuditData = result.data
    //         this.previnternalAuditData = preResult.data

    //         this.internalAuditService.generate_internal_audit_action(start, end).subscribe({
    //           next: (result: any) => {
    //             this.internalAuditAction = result.data
    //             this.internalAuditService.generate_internal_audit_action(prevStart, prevEnd).subscribe({
    //               next: (result: any) => {
    //                 this.internalPrevAuditAction = result.data
    //                 this.externalAuditService.generate_external_audit_data(start, end).subscribe({
    //                   next: (result: any) => {
    //                     this.externalAuditData = result.data
    //                     this.externalAuditService.generate_external_audit_data(prevStart, prevEnd).subscribe({
    //                       next: (preResult: any) => {
    //                         this.prevexternalAuditData = preResult.data
    //                       },
    //                       error: (err: any) => { },
    //                       complete: () => {

    //                         this.summary_card()
    //                         this.mark_card()
    //                         this.division_card()
    //                         this.monthly_score()
    //                         this.findings()
    //                         this.auditAction()
    //                         this.subCategory()
    //                         this.external_monthly_card()
    //                       }

    //                     })
    //                   },
    //                   error: (err: any) => { },
    //                   complete: () => {
    //                     Swal.close()
    //                   }
    //                 })
    //               },
    //               error: (err: any) => { },
    //               complete: () => {

    //               }
    //             })
    //           },
    //           error: (err: any) => { },
    //           complete: () => {

    //           }
    //         })
    //       },
    //       error: (err: any) => { },
    //       complete: () => {





    //       }

    //     })
    //   },
    //   error: (err: any) => { },
    //   complete: () => { }
    // })
  }

  summary_card() {
    this.summaryCardData = []
    let socialAttrition = ''
    let socialAttrition_icon = ''
    let socialAttrition_bg = ''
    let healthAttrition = ''
    let healthAttrition_icon = ''
    let healthAttrition_bg = ''
    let envAttrition = ''
    let envAttrition_icon = ''
    let envAttrition_bg = ''
    let securityAttrition = ''
    let securityAttrition_icon = ''
    let securityAttrition_bg = ''
    let mngtAttrition = ''
    let mngtAttrition_icon = ''
    let mngtAttrition_bg = ''
    const comData = this.internalAuditData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed")
    })
    const socialData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.labor_audit_status == "Completed" && elem.attributes.category == "Labor")
    })
    const healthData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.health_audit_status == "Completed" && elem.attributes.category == "Health")
    })
    const envData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.environment_audit_status == "Completed" && elem.attributes.category == "Environment")
    })
    const secData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.security_audit_status == "Completed" && elem.attributes.category == "Security")
    })
    const mngData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.management_audit_status == "Completed" && elem.attributes.category == "Management System")
    })
    const socialCount = socialData.length
    const healthCount = healthData.length
    const envCount = envData.length
    const secCount = secData.length
    const mngCount = mngData.length
    const prevComData = this.previnternalAuditData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.status == "Completed")
    })
    const prevSocialData = prevComData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.labor_audit_status == "Completed" && elem.attributes.category == "Labor")
    })
    const prevHealthData = prevComData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.health_audit_status == "Completed" && elem.attributes.category == "Health")
    })
    const prevEnvData = prevComData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.environment_audit_status == "Completed" && elem.attributes.category == "Environment")
    })
    const prevSecData = prevComData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.security_audit_status == "Completed" && elem.attributes.category == "Security")
    })
    const prevMngData = prevComData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.management_audit_status == "Completed" && elem.attributes.category == "Management System")
    })
    const prevSocialCount = prevSocialData.length
    const prevHealthCount = prevHealthData.length
    const prevEnvCount = prevEnvData.length
    const prevSecCount = prevSecData.length
    const prevMngCount = prevMngData.length

    //social attrition
    if (socialCount == 0) {
      socialAttrition = "0 %"
      socialAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (socialCount > prevSocialCount) {
        const totAttrition = Number(prevSocialCount) / Number(socialCount) * 100
        const value = JSON.stringify('+ ' + totAttrition.toFixed(0) + ' %')
        socialAttrition = value.replace(/['"]+/g, '')
        socialAttrition_icon = 'icon-arrow-up'
        socialAttrition_bg = 'widget-stats-indicator-positive'
      } else if (socialCount < prevSocialCount) {
        const totAttrition = Number(socialCount) / Number(prevSocialCount) * 100
        const value = JSON.stringify('- ' + totAttrition.toFixed(0) + ' %')
        socialAttrition = value.replace(/['"]+/g, '')
        socialAttrition_icon = 'icon-arrow-down'
        socialAttrition_bg = 'widget-stats-indicator-negative'
      } else if (socialCount == prevSocialCount) {
        socialAttrition = '0 %'
        socialAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    //health attrition
    if (healthCount == 0) {
      healthAttrition = "0 %"
      healthAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (healthCount > prevHealthCount) {
        const totAttrition = Number(prevHealthCount) / Number(healthCount) * 100
        const value = JSON.stringify('+ ' + totAttrition.toFixed(0) + ' %')
        healthAttrition = value.replace(/['"]+/g, '')
        healthAttrition_icon = 'icon-arrow-up'
        healthAttrition_bg = 'widget-stats-indicator-positive'
      } else if (healthCount < prevHealthCount) {
        const totAttrition = Number(healthCount) / Number(prevHealthCount) * 100
        const value = JSON.stringify('- ' + totAttrition.toFixed(0) + ' %')
        healthAttrition = value.replace(/['"]+/g, '')
        healthAttrition_icon = 'icon-arrow-down'
        healthAttrition_bg = 'widget-stats-indicator-negative'
      } else if (healthCount == prevHealthCount) {
        healthAttrition = '0 %'
        healthAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    //environment attrition
    if (envCount == 0) {
      envAttrition = "0 %"
      envAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (envCount > prevEnvCount) {
        const totAttrition = Number(prevEnvCount) / Number(envCount) * 100
        const value = JSON.stringify('+ ' + totAttrition.toFixed(0) + ' %')
        envAttrition = value.replace(/['"]+/g, '')
        envAttrition_icon = 'icon-arrow-up'
        envAttrition_bg = 'widget-stats-indicator-positive'
      } else if (envCount < prevEnvCount) {
        const totAttrition = Number(envCount) / Number(prevEnvCount) * 100
        const value = JSON.stringify('- ' + totAttrition.toFixed(0) + ' %')
        envAttrition = value.replace(/['"]+/g, '')
        envAttrition_icon = 'icon-arrow-down'
        envAttrition_bg = 'widget-stats-indicator-negative'
      } else if (envCount == prevEnvCount) {
        envAttrition = '0 %'
        envAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    //security attrition
    if (secCount == 0) {
      securityAttrition = "0 %"
      securityAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (secCount > prevSecCount) {
        const totAttrition = Number(prevSecCount) / Number(secCount) * 100
        const value = JSON.stringify('+ ' + totAttrition.toFixed(0) + ' %')
        securityAttrition = value.replace(/['"]+/g, '')
        securityAttrition_icon = 'icon-arrow-up'
        securityAttrition_bg = 'widget-stats-indicator-positive'
      } else if (secCount < prevSecCount) {
        const totAttrition = Number(secCount) / Number(prevSecCount) * 100
        const value = JSON.stringify('- ' + totAttrition.toFixed(0) + ' %')
        securityAttrition = value.replace(/['"]+/g, '')
        securityAttrition_icon = 'icon-arrow-down'
        securityAttrition_bg = 'widget-stats-indicator-negative'
      } else if (secCount == prevSecCount) {
        securityAttrition = '0 %'
        securityAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    //Management System attrition
    if (mngCount == 0) {
      mngtAttrition = "0 %"
      mngtAttrition_bg = 'widget-stats-indicator-positive'
    } else {
      if (mngCount > prevMngCount) {
        const totAttrition = Number(prevMngCount) / Number(mngCount) * 100
        const value = JSON.stringify('+ ' + totAttrition.toFixed(0) + ' %')
        mngtAttrition = value.replace(/['"]+/g, '')
        mngtAttrition_icon = 'icon-arrow-up'
        mngtAttrition_bg = 'widget-stats-indicator-positive'
      } else if (mngCount < prevMngCount) {
        const totAttrition = Number(mngCount) / Number(prevMngCount) * 100
        const value = JSON.stringify('- ' + totAttrition.toFixed(0) + ' %')
        mngtAttrition = value.replace(/['"]+/g, '')
        mngtAttrition_icon = 'icon-arrow-down'
        mngtAttrition_bg = 'widget-stats-indicator-negative'
      } else if (mngCount == prevMngCount) {
        mngtAttrition = '0 %'
        mngtAttrition_bg = 'widget-stats-indicator-positive'
      }
    }

    this.summaryCardData.push(
      {
        "title": "Social",
        "icon": "social.png",
        "value": socialCount,
        "attrition": socialAttrition,
        "attri_icon": socialAttrition_icon,
        "attri_bg": socialAttrition_bg
      },
      {
        "title": "Health & Safety",
        "icon": "health.png",
        "value": healthCount,
        "attrition": healthAttrition,
        "attri_icon": healthAttrition_icon,
        "attri_bg": healthAttrition_bg
      },
      {
        "title": "Environment",
        "icon": "environment.png",
        "value": envCount,
        "attrition": envAttrition,
        "attri_icon": envAttrition_icon,
        "attri_bg": envAttrition_bg
      },
      {
        "title": "Security",
        "icon": "security.png",
        "value": secCount,
        "attrition": securityAttrition,
        "attri_icon": securityAttrition_icon,
        "attri_bg": securityAttrition_bg
      }
      ,
      {
        "title": "Management System",
        "icon": "management.png",
        "value": mngCount,
        "attrition": mngtAttrition,
        "attri_icon": mngtAttrition_icon,
        "attri_bg": mngtAttrition_bg
      }
    )
  }

  mark_card() {
    const comData = this.internalAuditData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed")
    })
    const totalMark = comData.length
    let mark0 = comData.filter(function (elem) {
      return (elem.attributes.mark == 0)
    })
    let mark1 = comData.filter(function (elem) {
      return (elem.attributes.mark == 1)
    })
    let mark2 = comData.filter(function (elem) {
      return (elem.attributes.mark == 2)
    })
    let mark3 = comData.filter(function (elem) {
      return (elem.attributes.mark == 3)
    })
    const mar0Per = Math.round(Number(mark0.length) / Number(totalMark) * 100).toFixed(0)
    const mar1Per = Math.round(Number(mark1.length) / Number(totalMark) * 100).toFixed(0)
    const mar2Per = Math.round(Number(mark2.length) / Number(totalMark) * 100).toFixed(0)
    const mar3Per = Math.round(Number(mark3.length) / Number(totalMark) * 100).toFixed(0)
    this.markChart.series = [Number(mar0Per), Number(mar1Per), Number(mar2Per), Number(mar3Per)]
    const socialData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.labor_audit_status == "Completed" && elem.attributes.category == "Labor")
    })
    const healthData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.health_audit_status == "Completed" && elem.attributes.category == "Health")
    })
    const envData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.environment_audit_status == "Completed" && elem.attributes.category == "Environment")
    })
    const secData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.security_audit_status == "Completed" && elem.attributes.category == "Security")
    })
    const mngData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit.data.attributes.management_audit_status == "Completed" && elem.attributes.category == "Management System")
    })
    this.socialMark = socialData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    this.healthMark = healthData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    this.envMark = envData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    this.secMark = secData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    this.mngMark = mngData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
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
      const socialMark = socialData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
      const socialScore = Number(socialMark)
      if (socialMark === 0) {
        socialValue.push(Number(0).toFixed(2))
      } else {
        socialValue.push(Number(socialScore).toFixed(2))
      }
      const healthData = comData.filter(function (elem) {
        return (elem.attributes.internal_audit.data.attributes.labor_audit_status == "Completed" && elem.attributes.category == "Health" && elem.attributes.internal_audit.data.attributes.division === divi)
      })
      const healthMark = healthData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
      const healthScore = Number(healthMark)
      if (healthMark === 0) {
        healthValue.push(Number(0).toFixed(2))
      } else {
        healthValue.push(Number(healthScore).toFixed(2))
      }
      const envData = comData.filter(function (elem) {
        return (elem.attributes.internal_audit.data.attributes.environment_audit_status == "Completed" && elem.attributes.category == "Environment" && elem.attributes.internal_audit.data.attributes.division === divi)
      })
      const envMark = envData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
      const envScore = Number(envMark)
      if (envMark === 0) {
        envValue.push(Number(0).toFixed(2))
      } else {
        envValue.push(Number(envScore).toFixed(2))
      }
      const secData = comData.filter(function (elem) {
        return (elem.attributes.internal_audit.data.attributes.security_audit_status == "Completed" && elem.attributes.category == "Security" && elem.attributes.internal_audit.data.attributes.division === divi)
      })
      const secMark = secData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
      const secScore = Number(secMark)
      if (secMark === 0) {
        secValue.push(Number(0).toFixed(2))
      } else {
        secValue.push(Number(secScore).toFixed(2))
      }
      const mngData = comData.filter(function (elem) {
        return (elem.attributes.internal_audit.data.attributes.management_audit_status == "Completed" && elem.attributes.category == "Management System" && elem.attributes.internal_audit.data.attributes.division === divi)
      })
      const mngMark = mngData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
      const mngScore = Number(mngMark)
      if (mngMark === 0) {
        mngValue.push(Number(0).toFixed(2))
      } else {
        mngValue.push(Number(mngScore).toFixed(2))
      }
    })
    this.divisionChart = {
      series: [
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
            return val;
          }
        }
      }
    }
  }

  monthly_score() {
    const comData = this.internalAuditData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed")
    })
    const totalScore = Number(this.socialTotalMark) + Number(this.healthTotalMark) + Number(this.envTotalMark) + Number(this.secTotalMark)
    //jan data
    const janFirst = new Date(new Date().getFullYear(), 0, 1).toISOString();
    const janLast = new Date(new Date().getFullYear(), 0 + 1, 0).toISOString();
    const date = new Date(janFirst)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    const endDate = new Date(janLast)
    const endNewDate = new Date(endDate.setDate(endDate.getDate() + 1)).toISOString().slice(0, 10)
    const janData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.start_date >= newDate && elem.attributes.internal_audit?.data?.attributes.start_date <= endNewDate)
    })
    const janMark = janData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    const scoreJan = Number(janMark) / Number(totalScore) * 100
    const janScore = Math.round(Number(scoreJan)).toFixed(2)
    //feb data
    const febFirst = new Date(new Date().getFullYear(), 1, 1).toISOString();
    const febLast = new Date(new Date().getFullYear(), 1 + 1, 0).toISOString();
    const febDate = new Date(febFirst)
    const febNewDate = new Date(febDate.setDate(febDate.getDate() + 1)).toISOString().slice(0, 10)
    const febEndDate = new Date(febLast)
    const febEndNewDate = new Date(febEndDate.setDate(febEndDate.getDate() + 1)).toISOString().slice(0, 10)
    const febData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.start_date >= febNewDate && elem.attributes.internal_audit?.data?.attributes.start_date <= febEndNewDate)
    })
    const febMark = febData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    const scoreFeb = Number(febMark) / Number(totalScore) * 100
    const febScore = Math.round(Number(scoreFeb)).toFixed(2)
    //mar data
    const marFirst = new Date(new Date().getFullYear(), 2, 1).toISOString();
    const marLast = new Date(new Date().getFullYear(), 2 + 1, 0).toISOString();
    const marDate = new Date(marFirst)
    const marNewDate = new Date(marDate.setDate(marDate.getDate() + 1)).toISOString().slice(0, 10)
    const marEndDate = new Date(marLast)
    const marEndNewDate = new Date(marEndDate.setDate(marEndDate.getDate() + 1)).toISOString().slice(0, 10)
    const marData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.start_date >= marNewDate && elem.attributes.internal_audit?.data?.attributes.start_date <= marEndNewDate)
    })
    const marMark = marData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    const scoreMar = Number(marMark) / Number(totalScore) * 100
    const marScore = Math.round(Number(scoreMar)).toFixed(2)
    //apr data
    const aprFirst = new Date(new Date().getFullYear(), 3, 1).toISOString();
    const aprLast = new Date(new Date().getFullYear(), 3 + 1, 0).toISOString();
    const aprDate = new Date(aprFirst)
    const aprNewDate = new Date(aprDate.setDate(aprDate.getDate() + 1)).toISOString().slice(0, 10)
    const aprEndDate = new Date(aprLast)
    const aprEndNewDate = new Date(aprEndDate.setDate(aprEndDate.getDate() + 1)).toISOString().slice(0, 10)
    const aprData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.start_date >= aprNewDate && elem.attributes.internal_audit?.data?.attributes.start_date <= aprEndNewDate)
    })
    const aprMark = aprData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    const scoreApr = Number(aprMark) / Number(totalScore) * 100
    const aprScore = Math.round(Number(scoreApr)).toFixed(2)
    //may data
    const mayFirst = new Date(new Date().getFullYear(), 4, 1).toISOString();
    const mayLast = new Date(new Date().getFullYear(), 4 + 1, 0).toISOString();
    const mayDate = new Date(mayFirst)
    const mayNewDate = new Date(mayDate.setDate(mayDate.getDate() + 1)).toISOString().slice(0, 10)
    const mayEndDate = new Date(mayLast)
    const mayEndNewDate = new Date(mayEndDate.setDate(mayEndDate.getDate() + 1)).toISOString().slice(0, 10)
    const mayData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.start_date >= mayNewDate && elem.attributes.internal_audit?.data?.attributes.start_date <= mayEndNewDate)
    })
    const mayMark = mayData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    const scoreMay = Number(mayMark) / Number(totalScore) * 100
    const mayScore = Math.round(Number(scoreMay)).toFixed(2)
    //june data
    const junFirst = new Date(new Date().getFullYear(), 5, 1).toISOString();
    const junLast = new Date(new Date().getFullYear(), 5 + 1, 0).toISOString();
    const junDate = new Date(junFirst)
    const junNewDate = new Date(junDate.setDate(junDate.getDate() + 1)).toISOString().slice(0, 10)
    const junEndDate = new Date(junLast)
    const junEndNewDate = new Date(junEndDate.setDate(junEndDate.getDate() + 1)).toISOString().slice(0, 10)
    const junData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.start_date >= junNewDate && elem.attributes.internal_audit?.data?.attributes.start_date <= junEndNewDate)
    })
    const junMark = junData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    const scoreJun = Number(junMark) / Number(totalScore) * 100
    const junScore = Math.round(Number(scoreJun)).toFixed(2)
    //july data
    const julFirst = new Date(new Date().getFullYear(), 6, 1).toISOString();
    const julLast = new Date(new Date().getFullYear(), 6 + 1, 0).toISOString();
    const julDate = new Date(julFirst)
    const julNewDate = new Date(julDate.setDate(julDate.getDate() + 1)).toISOString().slice(0, 10)
    const julEndDate = new Date(julLast)
    const julEndNewDate = new Date(julEndDate.setDate(julEndDate.getDate() + 1)).toISOString().slice(0, 10)
    const julData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.start_date >= julNewDate && elem.attributes.internal_audit?.data?.attributes.start_date <= julEndNewDate)
    })
    const julMark = julData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    const scoreJul = Number(julMark) / Number(totalScore) * 100
    const julScore = Math.round(Number(scoreJul)).toFixed(2)
    //aug data
    const augFirst = new Date(new Date().getFullYear(), 7, 1).toISOString();
    const augLast = new Date(new Date().getFullYear(), 7 + 1, 0).toISOString();
    const augDate = new Date(augFirst)
    const augNewDate = new Date(augDate.setDate(augDate.getDate() + 1)).toISOString().slice(0, 10)
    const augEndDate = new Date(augLast)
    const augEndNewDate = new Date(augEndDate.setDate(augEndDate.getDate() + 1)).toISOString().slice(0, 10)
    const augData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.start_date >= augNewDate && elem.attributes.internal_audit?.data?.attributes.start_date <= augEndNewDate)
    })
    const augMark = augData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    const scoreAug = Number(augMark) / Number(totalScore) * 100
    const augScore = Math.round(Number(scoreAug)).toFixed(2)
    //sep data
    const sepFirst = new Date(new Date().getFullYear(), 8, 1).toISOString();
    const sepLast = new Date(new Date().getFullYear(), 8 + 1, 0).toISOString();
    const sepDate = new Date(sepFirst)
    const sepNewDate = new Date(sepDate.setDate(sepDate.getDate() + 1)).toISOString().slice(0, 10)
    const sepEndDate = new Date(sepLast)
    const sepEndNewDate = new Date(sepEndDate.setDate(sepEndDate.getDate() + 1)).toISOString().slice(0, 10)
    const sepData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.start_date >= sepNewDate && elem.attributes.internal_audit?.data?.attributes.start_date <= sepEndNewDate)
    })
    const sepMark = sepData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    const scoreSep = Number(sepMark) / Number(totalScore) * 100
    const sepScore = Math.round(Number(scoreSep)).toFixed(2)
    //oct data
    const octFirst = new Date(new Date().getFullYear(), 9, 1).toISOString();
    const octLast = new Date(new Date().getFullYear(), 9 + 1, 0).toISOString();
    const octDate = new Date(octFirst)
    const octNewDate = new Date(octDate.setDate(octDate.getDate() + 1)).toISOString().slice(0, 10)
    const octEndDate = new Date(octLast)
    const octEndNewDate = new Date(octEndDate.setDate(octEndDate.getDate() + 1)).toISOString().slice(0, 10)
    const octData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.start_date >= octNewDate && elem.attributes.internal_audit?.data?.attributes.start_date <= octEndNewDate)
    })
    const octMark = octData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    const scoreOct = Number(octMark) / Number(totalScore) * 100
    const octScore = Math.round(Number(scoreOct)).toFixed(2)
    //nov data
    const novFirst = new Date(new Date().getFullYear(), 10, 1).toISOString();
    const novLast = new Date(new Date().getFullYear(), 10 + 1, 0).toISOString();
    const novDate = new Date(novFirst)
    const novNewDate = new Date(novDate.setDate(novDate.getDate() + 1)).toISOString().slice(0, 10)
    const novEndDate = new Date(novLast)
    const novEndNewDate = new Date(novEndDate.setDate(novEndDate.getDate() + 1)).toISOString().slice(0, 10)
    const novData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.start_date >= novNewDate && elem.attributes.internal_audit?.data?.attributes.start_date <= novEndNewDate)
    })
    const novMark = novData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    const scoreNov = Number(novMark) / Number(totalScore) * 100
    const novScore = Math.round(Number(scoreNov)).toFixed(2)
    //dec data
    const decFirst = new Date(new Date().getFullYear(), 11, 1).toISOString();
    const decLast = new Date(new Date().getFullYear(), 11 + 1, 0).toISOString();
    const decDate = new Date(decFirst)
    const decNewDate = new Date(decDate.setDate(decDate.getDate() + 1)).toISOString().slice(0, 10)
    const decEndDate = new Date(decLast)
    const decEndNewDate = new Date(decEndDate.setDate(decEndDate.getDate() + 1)).toISOString().slice(0, 10)
    const decData = comData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.start_date >= decNewDate && elem.attributes.internal_audit?.data?.attributes.start_date <= decEndNewDate)
    })
    const decMark = decData.reduce((accumulator, current) => accumulator + Number(current.attributes.mark), 0);
    const scoreDec = Number(decMark) / Number(totalScore) * 100
    const decScore = Math.round(Number(scoreDec)).toFixed(2)
    this.monthlyScoreChart.series = [{
      name: 'Score',
      data: [Number(janScore), Number(febScore), Number(marScore), Number(aprScore), Number(mayScore), Number(junScore), Number(julScore), Number(augScore), Number(sepScore), Number(octScore), Number(novScore), Number(decScore)]
    }]
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
      markList.push(elem.attributes.mark)
    })
    var duplicateValue = new Set(markList);
    markList = [...duplicateValue];
    markUnique = markList.sort((a, b) => a.localeCompare(b));
    if (markUnique.length > 0) {
      markUnique.forEach(markElem => {

        //overview
        const data = comData.filter(function (elem) {
          return (elem.attributes.mark == markElem)
        })
        if (markElem == "0") {
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

        } else if (markElem == "1") {
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
        } else if (markElem == "2") {
          const count = data.length
          const perce = Number(count) / Number(comData.length) * 100
          const percentage = Math.round(Number(perce)).toFixed(2)
          if (count === 0) {
            this.findingsCardData.push({
              "title": "Lowest Findings",
              "percentage": 0,
              "count": count,
              "category": "Overview"
            })
          } else {
            this.findingsCardData.push({
              "title": "Lowest Findings",
              "percentage": percentage,
              "count": count,
              "category": "Overview"
            })
          }
        }

        //social
        const dataSocial = socialComData.filter(function (elem) {
          return (elem.attributes.mark == markElem)
        })
        if (markElem == "0") {
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
        } else if (markElem == "1") {
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
        } else if (markElem == "2") {
          const socialCount = dataSocial.length
          const socialPerce = Number(socialCount) / Number(socialComData.length) * 100
          const socialPercentage = Math.round(Number(socialPerce)).toFixed(2)
          if (socialCount === 0) {
            this.findingsCardData.push({
              "title": "Lowest Findings",
              "percentage": 0,
              "count": socialCount,
              "category": "Social"
            })
          } else {
            this.findingsCardData.push({
              "title": "Lowest Findings",
              "percentage": socialPercentage,
              "count": socialCount,
              "category": "Social"
            })
          }
        }

        //health
        const dataHealth = healthComData.filter(function (elem) {
          return (elem.attributes.mark == markElem)
        })
        if (markElem == "0") {
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
        } else if (markElem == "1") {
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
        } else if (markElem == "2") {
          const healthCount = dataHealth.length
          const healthPerce = Number(healthCount) / Number(healthComData.length) * 100
          const healthPercentage = Math.round(Number(healthPerce)).toFixed(2)
          if (healthCount === 0) {
            this.findingsCardData.push({
              "title": "Lowest Findings",
              "percentage": 0,
              "count": healthCount,
              "category": "Health"
            })
          } else {
            this.findingsCardData.push({
              "title": "Lowest Findings",
              "percentage": healthPercentage,
              "count": healthCount,
              "category": "Health"
            })
          }
        }

        //env
        const dataEnv = envComData.filter(function (elem) {
          return (elem.attributes.mark == markElem)
        })
        if (markElem == "0") {
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
        } else if (markElem == "1") {
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
        } else if (markElem == "2") {
          const envCount = dataEnv.length
          const envPerce = Number(envCount) / Number(envComData.length) * 100
          const envPercentage = Math.round(Number(envPerce)).toFixed(2)
          if (envCount === 0) {
            this.findingsCardData.push({
              "title": "Lowest Findings",
              "percentage": 0,
              "count": envCount,
              "category": "Environment"
            })
          } else {
            this.findingsCardData.push({
              "title": "Lowest Findings",
              "percentage": envPercentage,
              "count": envCount,
              "category": "Environment"
            })
          }
        }

        //security
        const dataSec = secComData.filter(function (elem) {
          return (elem.attributes.mark == markElem)
        })
        if (markElem == "0") {
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
        } else if (markElem == "1") {
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
        } else if (markElem == "2") {
          const secCount = dataSec.length
          const secPerce = Number(secCount) / Number(secComData.length) * 100
          const secPercentage = Math.round(Number(secPerce)).toFixed(2)
          if (secCount === 0) {
            this.findingsCardData.push({
              "title": "Lowest Findings",
              "percentage": 0,
              "count": secCount,
              "category": "Security"
            })
          } else {
            this.findingsCardData.push({
              "title": "Lowest Findings",
              "percentage": secPercentage,
              "count": secCount,
              "category": "Security"
            })
          }
        }

        //Management System
        const dataSys = mangComData.filter(function (elem) {
          return (elem.attributes.mark == markElem)
        })
        if (markElem == "0") {
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
        } else if (markElem == "1") {
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
        } else if (markElem == "2") {
          const mngCount = dataSys.length
          const mngPerce = Number(mngCount) / Number(mangComData.length) * 100
          const mngPercentage = Math.round(Number(mngPerce)).toFixed(2)
          if (mngCount === 0) {
            this.findingsCardData.push({
              "title": "Lowest Findings",
              "percentage": 0,
              "count": mngCount,
              "category": "Management System"
            })
          } else {
            this.findingsCardData.push({
              "title": "Lowest Findings",
              "percentage": mngPercentage,
              "count": mngCount,
              "category": "Management System"
            })
          }
        }
 
      })
    }
  }

  auditAction() {
    this.actionCardData = []
    let Attrition = ''
    let AttritionIcon = ''
    const comData = this.internalAuditAction.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed")
    })

    const openData = comData.filter(function (elem) {
      return (elem.attributes.status === "Open")
    })
    this.actionPending = openData.length

    const prevComData = this.internalPrevAuditAction.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed")
    })

    const preOpenData = prevComData.filter(function (elem) {
      return (elem.attributes.status === "Open")
    })
    const prevPending = preOpenData.length

    const total = comData.length
    const completedData = comData.filter(function (elem) {
      return (elem.attributes.status === "Completed")
    })

    const comPercentage = Number(Number(completedData.length) / Number(total) * 100).toFixed(0)



    //attrition
    if (this.actionPending == 0) {
      Attrition = '0%'
    } else {
      if (this.actionPending > prevPending) {
        const attrition = Number(prevPending) / Number(this.actionPending) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        Attrition = value.replace(/['"]+/g, '')
        AttritionIcon = "icon-arrow-up"
      } else if (this.actionPending < prevPending) {
        const attrition = Number(this.actionPending) / Number(prevPending) * 100
        const value = JSON.stringify(attrition.toFixed(0) + ' %')
        Attrition = value.replace(/['"]+/g, '')
        AttritionIcon = "icon-arrow-down"
      } else if (this.actionPending == prevPending) {
        Attrition = '0%'
      }
    }

    if (Number(comPercentage) > 0) {
      this.actionCardData.push(
        {
          'completed': completedData.length,
          'comPercentage': Number(comPercentage),
          'attrition': Attrition,
          'prevMonthPen': prevPending,
          'attritionIcon': AttritionIcon
        }
      )

    } else {
      this.actionCardData.push(
        {
          'completed': completedData.length,
          'comPercentage': 0,
          'attrition': '0',
          'prevMonthPen': prevPending,
          'attritionIcon': AttritionIcon


        }
      )
    }
  }

  subCategory() {

    this.subCategoryCardData = []
    const comData = this.internalAuditData.filter(function (elem) {
      return (elem.attributes.internal_audit?.data?.attributes.status == "Completed")
    })
    const total = comData.length
    const type: any[] = ["Labor", "Health", "Environment", "Security","Management System"]

    type.forEach(typeElem => {
      const typeData = comData.filter(function (elem) {
        return (elem.attributes.category == typeElem)
      })
      const typePer = Number(Number(typeData.length) / Number(total) * 100).toFixed(0)

      if (typeElem === "Labor") {

        if (typeData.length > 0) {
          this.subCategoryCardData.push(
            {
              "category": "Overview",
              "title": "Social",
              "percentage": typePer,
              "count": typeData.length
            }
          )
        } else {
          this.subCategoryCardData.push(
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
          this.subCategoryCardData.push(
            {
              "category": "Overview",
              "title": typeElem,
              "percentage": typePer,
              "count": typeData.length
            }
          )
        } else {
          this.subCategoryCardData.push(
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

      const total = subData.length

      let subList: any[] = []
      let subUnique: any[] = []
      subData.forEach(elem => {
        subList.push(elem.attributes.sub_category)
      })
      var duplicateValue = new Set(subList);
      subList = [...duplicateValue];
      subUnique = subList
      subUnique.forEach(subElem => {

        const subtTypeData = comData.filter(function (elem) {
          return (elem.attributes.sub_category == subElem)
        })

        const subTypePer = Number(Number(subtTypeData.length) / Number(total) * 100).toFixed(0)

        if (subCat === "Labor") {

          if (subtTypeData.length > 0) {
            this.subCategoryCardData.push(
              {
                "category": "Social",
                "title": subElem,
                "percentage": subTypePer,
                "count": subtTypeData.length
              }
            )
          } else {
            this.subCategoryCardData.push(
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
            this.subCategoryCardData.push(
              {
                "category": subCat,
                "title": subElem,
                "percentage": subTypePer,
                "count": subtTypeData.length
              }
            )
          } else {
            this.subCategoryCardData.push(
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



    // let subCatList: any[] = []
    // let subCatUnique: any[] = []
    // comData.forEach(elem => {
    //   subCatList.push(elem.attributes.category)
    // })
    // var duplicateValue = new Set(markList);
    // markList = [...duplicateValue];


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

    this.externalMonthlyChart = {
      series: [
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
        categories: months
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
    }
  }


}
