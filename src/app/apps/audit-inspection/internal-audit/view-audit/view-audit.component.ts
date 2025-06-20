import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { environment } from 'src/environments/environment';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { ViewActionPlanDocumentComponent } from '../view-action-plan-document/view-action-plan-document.component';
import { Lightbox } from 'ngx-lightbox';
import { Location } from '@angular/common';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-view-audit',
  templateUrl: './view-audit.component.html',
  styleUrls: ['./view-audit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ViewAuditComponent implements OnInit {
  generalForm: FormGroup;
  socialForm: FormGroup;
  healthForm: FormGroup;
  environmentForm: FormGroup;
  securityForm: FormGroup;
  actionPlanForm: FormGroup;
  audit_summary: any[] = [];
  auditMarks: any[] = [];
  managementCheckList: any[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  managementCheckListCount: any;
  actionPlan: any[] = [];
  managementForm: FormGroup;
  divisionUuids: any[] = []
  auditCheckList: any[] = [];
  healthCheckList: any[] = [];
  environmentCheckList: any[] = [];
  securityCheckList: any[] = [];
  securityCheckListCount: any;
  socialCheckListCount: any;
  healthCheckListCount: any;
  environmentCheckListCount: any;
  auditSocialCount: number = 0;
  auditHealthCount: number = 0;
  auditEnvironmentCount: number = 0;
  auditManagementCount: number = 0;
  auditSecurityCount: number = 0;
  TotalAchievedScore: number = 0;
  TotalAchievableScore: number = 0;
  Totalmark: number = 0;
  SocialachievableScore = 0
  HealthachievableScore = 0
  EnvironmentachievableScore = 0
  ManagementachievableScore = 0
  SecurityachievableScore = 0
  Total_AchievableScore: number = 0;
  Total_AchievedScore: number = 0;
  Total_EarnedScore: number = 0;
  SocialScore = 0
  HealthScore = 0
  EnvironmentScore = 0
  ManagementScore = 0
  SecurityScore = 0
  SocialScoreAchieved = 0
  HealthScoreAchieved = 0
  EnvironmentScoreAchieved = 0
  ManagementScoreAchieved = 0
  SecurityScoreAchieved = 0
  SocialResult: any
  HealthResult: any;
  EnvironmentResult: any
  ManagementResult: any;
  SecurityResult: any;
  SocialRating: any
  HealthRating: any;
  EnvironmentRating: any
  ManagementRating: any;
  SecurityRating: any;
  totalScore: any;
  titles: string[] = [];
  finalScore: any;
  auditGrade: any;
  auditRating: any;
  socialCheckList: any[] = []
  healthCheck: any[] = [];
  environmentCheck: any[] = [];
  managementCheck: any[] = [];
  securityCheck: any[] = [];
  auditDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  showLaborTab: boolean = false;
  checkListStatus: boolean = false;
  showHealthTab: boolean = false;
  showEnvironmentTab: boolean = false;
  showManagementTab: boolean = false;
  showSecurityTab: boolean = false;
  approvalDate = new FormControl(null, [Validators.required]);
  orgID: any;
  unitSpecific: any
  corporateUser: any
  currentRate = 0;
  coverImages: any[] = [];
  backToHistory: Boolean = false

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
      ],
    },
  };
  facilityPhotoList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public internalAuditService: InternalAuditService,
    private config: NgbRatingConfig,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _lightbox: Lightbox, private _location: Location
  ) {
    config.max = 4;
    config.readonly = false;
    config.resettable = true;
  }

  ngOnInit() {
    this.configuration();

    this.generalForm = this.formBuilder.group({
      org_id: [''],
      reference_number: [''],
      id: [''],
      division: [''],
      department: [''],
      title: [''],
      description: [''],
      status: [''],
      auditee: [''],
      approver: [''],
      updatedBy: [''],
      start: [''],
      end: [''],
      auditeeID: [''],
      approval_date: [''],
      announcement: [''],
      date: [new Date()],
      remarks: [''],
      labor_audit_status: [''],
      health_audit_status: [''],
      environment_audit_status: [''],
      security_audit_status: [''],
      management_audit_status: [''],
    });

    this.socialForm = this.formBuilder.group({});

    this.healthForm = this.formBuilder.group({});

    this.environmentForm = this.formBuilder.group({});
    this.managementForm = this.formBuilder.group({});
    this.securityForm = this.formBuilder.group({});

    this.actionPlanForm = this.formBuilder.group({});
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.audit_inspection;
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          this.router.navigate(['/error/upgrade-subscription']);
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id;
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split('=');
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1]);
              this.generalForm.controls['org_id'].setValue(
                decodeURIComponent(cookiePair[1])
              );
            }
          }
          this.me();
        }
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.generalForm.controls['updatedBy'].setValue(result.id);
        const status = result.int_aud_history;
        if (status === false) {
          this.router.navigate(['/error/unauthorized']);
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisionUuids.push(elem.division_uuid)
              })
            }
          }

          this.get_audit_details();
          this.get_audit_checklist();

        }
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  get_audit_details() {
    const reference = this.route.snapshot.paramMap.get('id');

    this.internalAuditService.get_audit_details(reference).subscribe({
      next: (result: any) => {
        if (result.data.length > 0) {
          // if (result.data[0].attributes.status !== 'Approved' || result.data[0].attributes.status!=='Completed') {
          //   this.router.navigate(["/apps/audit-inspection/internal-audit/register"])


          // } else {
          this.titles = result.data[0]?.attributes?.title.split(',')
          //   const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
          //   let matchFound = true;
          //   if (this.divisionUuids && this.divisionUuids.length > 0) {
          //     matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
          //   }
          // if (!matchFound || matchFound !== true) {
          //   this.router.navigate(["/apps/audit-inspection/internal-audit/register"])

          // } else {

          this.generalForm.controls['id'].setValue(result.data[0].id);
          this.generalForm.controls['reference_number'].setValue(
            result.data[0].attributes.reference_number
          );
          this.generalForm.controls['division'].setValue(
            result.data[0].attributes.division
          );
          this.generalForm.controls['department'].setValue(
            result.data[0].attributes.department
          );
          this.generalForm.controls['title'].setValue(
            result.data[0].attributes.title
          );
          this.generalForm.controls['description'].setValue(
            result.data[0].attributes.description
          );
          this.generalForm.controls['labor_audit_status'].setValue(
            result.data[0].attributes.labor_audit_status
          );
          this.generalForm.controls['health_audit_status'].setValue(
            result.data[0].attributes.health_audit_status
          );
          this.generalForm.controls['environment_audit_status'].setValue(
            result.data[0].attributes.environment_audit_status
          );
          this.generalForm.controls['security_audit_status'].setValue(
            result.data[0].attributes.security_audit_status
          );
          this.generalForm.controls['status'].setValue(
            result.data[0].attributes.status
          );
          this.generalForm.controls['start'].setValue(
            new Date(result.data[0].attributes.start_date)
          );
          this.generalForm.controls['end'].setValue(
            new Date(result.data[0].attributes.end_date)
          );
          const auditeeData = result.data[0].attributes.auditees.data;
          const auditeeIds = auditeeData.map((auditeeItem: any) => auditeeItem.id);
          const auditeeNames = auditeeData.map((auditeeItem: any) => auditeeItem.attributes.auditee_name);
          this.generalForm.controls['auditeeID'].setValue(auditeeIds);
          this.generalForm.controls['auditee'].setValue(auditeeNames);
          this.generalForm.controls['approver'].setValue(
            result.data[0].attributes.approver.data.attributes.first_name +
            ' ' +
            result.data[0].attributes.approver.data.attributes.last_name
          );
          this.generalForm.controls['approval_date'].setValue(
            result.data[0].attributes.approval_date
          );
          this.auditDateRange.controls['start'].setValue(
            new Date(result.data[0].attributes.start_date)
          );
          this.auditDateRange.controls['end'].setValue(
            new Date(result.data[0].attributes.end_date)
          );
          this.generalForm.controls['date'].setValue(
            result.data[0].attributes.date
          );
          this.approvalDate.setValue(
            new Date(result.data[0].attributes.approval_date)
          );
          this.generalForm.controls['management_audit_status'].setValue(
            result.data[0].attributes.management_audit_status
          );
          // this.generalForm.disable()
          this.generalForm.controls['start'].enable();
          this.generalForm.controls['end'].enable();

          this.auditDateRange.controls['start'].disable();
          this.auditDateRange.controls['end'].disable();
          this.approvalDate.disable();
          this.generalForm.controls['announcement'].enable();
          this.generalForm.controls['status'].enable();
          this.generalForm.controls['reference_number'].enable();
          this.generalForm.controls['date'].enable();
          this.generalForm.controls['id'].enable();
          this.generalForm.controls['remarks'].enable();
          // if (result.data[0].attributes.audit_team_members.data.length > 0) {
          //   this.auditingTeam = result.data[0].attributes.audit_team_members.data
          // }else{
          //   this.auditingTeam=[]
          // }

          let coverData: any[] = []
          const coverImage__data = result.data[0].attributes.internal_audit_cover_photo.data
          coverData.push({
            src: environment.client_backend + '/uploads/' + coverImage__data.attributes.cover_photo_name + '.' + coverImage__data.attributes.format,
            caption: "Cover Photo",
            thumb: environment.client_backend + '/uploads/' + coverImage__data.attributes.cover_photo_name + '.' + coverImage__data.attributes.format
          })
          this.coverImages = coverData

          const facilityPhotoList = result.data[0].attributes.multiple_facility_photos.data
          facilityPhotoList.forEach((data: any) => {
            this.facilityPhotoList.push({
              src: environment.client_backend + '/uploads/' + data.attributes.evidence_name + '.' + data.attributes.format,
              caption: "Cover Photo",
              thumb: environment.client_backend + '/uploads/' + data.attributes.evidence_name + '.' + data.attributes.format,
              title: data.attributes.title
            })
          });



          const selectedCategories = this.generalForm.value.title;

          if (selectedCategories.includes('Social')) {
            this.showLaborTab = true;
          }

          if (selectedCategories.includes('Health')) {
            this.showHealthTab = true;
          }

          if (selectedCategories.includes('Environment')) {
            this.showEnvironmentTab = true;
          }

          if (selectedCategories.includes('Management')) {
            this.showManagementTab = true;
          }

          if (selectedCategories.includes('Security')) {
            this.showSecurityTab = true;
          }
          if (selectedCategories.includes('Company Code of Conduct')) {
            this.showLaborTab = true;
            this.showHealthTab = true;
            this.showEnvironmentTab = true;
            this.showManagementTab = true;
            this.showSecurityTab = true;
          }

          this.get_audit_marks();
          this.get_action_plan();

          // }
        } else {
          this.router.navigate([
            '/apps/audit-inspection/internal-audit/register',
          ]);
        }
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }

  action(data: any) { }

  markStatus(colorCode: string | undefined) {

    const high = "high";
    const medium = "medium";
    const low = "low";

    if (colorCode === "No") {
      return high;
    } else if (colorCode === "Partial Yes") {
      return medium;
    } else if (colorCode === "Yes") {
      return low;
    } else {
      return '';
    }
  }

  open(index: number): void {
    this._lightbox.open(this.coverImages, index);
  }

  openFacilityPhote(index: number): void {
    this._lightbox.open(this.facilityPhotoList, index);
  }


  get_audit_checklist() {
    this.internalAuditService.get_audit_checklist().subscribe({
      next: (result: any) => {
        //social
        this.socialCheckList = result.data.filter(function (elem: any) {
          return elem.attributes.category === 'Labor';
        });
        this.socialCheckListCount = this.socialCheckList.length;

        let Socialdata: any[] = [];
        this.socialCheckList.forEach((elem: any) => {
          Socialdata.push(elem.attributes.sub_category);
        });
        const socialitem = [...new Set(Socialdata)];
        let socialQuestions: any[] = [];
        socialitem.forEach((subElem) => {
          const socialCheckListdata = result.data.filter(function (elem: any) {
            return elem.attributes.sub_category === subElem;
          });
          socialQuestions.push({
            subCategory: subElem,
            checkList: socialCheckListdata,
          });
        });
        this.auditCheckList = socialQuestions;

        //health
        this.healthCheck = result.data.filter(function (elem: any) {
          return elem.attributes.category === 'Health';
        });
        this.healthCheckListCount = this.healthCheck.length;

        let healthData: any[] = [];
        this.healthCheck.forEach((elem: any) => {
          healthData.push(elem.attributes.sub_category);
        });
        const healthItem = [...new Set(healthData)];
        let healthQuestions: any[] = [];
        healthItem.forEach((subElem) => {
          const healthCheckListdata = result.data.filter(function (elem: any) {
            return elem.attributes.sub_category === subElem;
          });
          healthQuestions.push({
            subCategory: subElem,
            checkList: healthCheckListdata,
          });
        });
        this.healthCheckList = healthQuestions;

        //environment
        this.environmentCheck = result.data.filter(function (elem: any) {
          return elem.attributes.category === 'Environment';
        });
        this.environmentCheckListCount = this.environmentCheck.length;

        let environmentData: any[] = [];
        this.environmentCheck.forEach((elem: any) => {
          environmentData.push(elem.attributes.sub_category);
        });
        const environmentItem = [...new Set(environmentData)];
        let environmentQuestions: any[] = [];
        environmentItem.forEach((subElem) => {
          const environmentCheckListdata = result.data.filter(function (
            elem: any
          ) {
            return elem.attributes.sub_category === subElem;
          });
          environmentQuestions.push({
            subCategory: subElem,
            checkList: environmentCheckListdata,
          });
        });
        this.environmentCheckList = environmentQuestions;

        //management
        this.managementCheck = result.data.filter(function (elem: any) {
          return elem.attributes.category === 'Management System';
        });
        this.managementCheckListCount = this.managementCheck.length;

        let managementData: any[] = [];
        this.managementCheck.forEach((elem: any) => {
          managementData.push(elem.attributes.sub_category);
        });
        const managementItem = [...new Set(managementData)];
        let managementQuestions: any[] = [];
        managementItem.forEach((subElem) => {
          const managementCheckListdata = result.data.filter(function (
            elem: any
          ) {
            return elem.attributes.sub_category === subElem;
          });
          managementQuestions.push({
            subCategory: subElem,
            checkList: managementCheckListdata,
          });
        });
        this.managementCheckList = managementQuestions;

        //security
        this.securityCheck = result.data.filter(function (elem: any) {
          return elem.attributes.category === 'Security';
        });
        this.securityCheckListCount = this.securityCheck.length;

        let securityData: any[] = [];
        this.securityCheck.forEach((elem: any) => {
          securityData.push(elem.attributes.sub_category);
        });
        const securityItem = [...new Set(securityData)];
        let securityQuestions: any[] = [];
        securityItem.forEach((subElem) => {
          const securityCheckListdata = result.data.filter(function (
            elem: any
          ) {
            return elem.attributes.sub_category === subElem;
          });
          securityQuestions.push({
            subCategory: subElem,
            checkList: securityCheckListdata,
          });
        });
        this.securityCheckList = securityQuestions;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }

  // auditMark(list:any,mark:any){
  //   const reference = this.route.snapshot.paramMap.get('id');
  //   const audID  = this.generalForm.value.id

  //   this.internalAuditService.create_audit_marks(list,mark.target.value,reference,audID).subscribe({
  //     next:(reult:any)=>{},
  //     error:(err:any)=>{},
  //     complete:()=>{}
  //   })

  // }

  get_audit_marks() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.internalAuditService.get_audit_marks(reference).subscribe({
      next: (result: any) => {
        this.auditMarks = result.data;
        const calculateRating = (percentage: number) => {
          if (percentage > 90) return { rating: 'Outstanding', grade: 'A' };
          if (percentage >= 70) return { rating: 'Good', grade: 'B' };
          if (percentage >= 50) return { rating: 'Poor', grade: 'C' };
          if (percentage >= 0) return { rating: 'Bad', grade: 'D' };
          return { rating: '', grade: '' }

        };

        const truncatePercentage = (score: number, achievableScore: number) => {
          return Math.floor((score / achievableScore) * 100);
        };
        const data1 = this.auditMarks.filter(function (elem: any) {
          return elem.attributes.category === 'Labor';
        });

        this.auditSocialCount = data1.length
        this.SocialachievableScore = 0;
        this.SocialScore = 0;
        this.SocialScoreAchieved = 0;

        data1.forEach((elem: any) => {
          this.SocialachievableScore += parseInt(elem.attributes.achievable_score) || 0;
          this.SocialScore += elem.attributes.score || 0;
        });

        this.SocialScoreAchieved = truncatePercentage(this.SocialScore, this.SocialachievableScore)
        this.SocialResult = calculateRating(this.SocialScoreAchieved);
        this.SocialRating = this.SocialResult.rating;

        const data2 = this.auditMarks.filter(function (elem: any) {
          return elem.attributes.category === 'Health';
        });

        this.auditHealthCount = data2.length
        this.HealthachievableScore = 0;
        this.HealthScore = 0;
        this.HealthScoreAchieved = 0;

        data2.forEach((elem: any) => {
          this.HealthachievableScore += parseInt(elem.attributes.achievable_score) || 0;
          this.HealthScore += elem.attributes.score || 0;
        });

        this.HealthScoreAchieved = truncatePercentage(this.HealthScore, this.HealthachievableScore)
        this.HealthResult = calculateRating(this.HealthScoreAchieved);
        this.HealthRating = this.HealthResult.rating;

        const data3 = this.auditMarks.filter(function (elem: any) {
          return elem.attributes.category === 'Environment';
        });
        this.auditEnvironmentCount = data3.length
        this.EnvironmentachievableScore = 0;
        this.EnvironmentScore = 0;
        this.EnvironmentScoreAchieved = 0;

        data3.forEach((elem: any) => {
          this.EnvironmentachievableScore += parseInt(elem.attributes.achievable_score) || 0;
          this.EnvironmentScore += elem.attributes.score || 0;
        });
        this.EnvironmentScoreAchieved = truncatePercentage(this.EnvironmentScore, this.EnvironmentachievableScore)
        this.EnvironmentResult = calculateRating(this.EnvironmentScoreAchieved);
        this.EnvironmentRating = this.EnvironmentResult.rating;

        const data4 = this.auditMarks.filter(function (elem: any) {
          return elem.attributes.category === 'Management System';
        });
        this.auditManagementCount = data4.length
        this.ManagementachievableScore = 0;
        this.ManagementScore = 0;
        this.ManagementScoreAchieved = 0;

        data4.forEach((elem: any) => {
          this.ManagementachievableScore += parseInt(elem.attributes.achievable_score) || 0;
          this.ManagementScore += elem.attributes.score || 0;
        });

        this.ManagementScoreAchieved = truncatePercentage(this.ManagementScore, this.ManagementachievableScore)
        this.ManagementResult = calculateRating(this.ManagementScoreAchieved);
        this.ManagementRating = this.ManagementResult.rating;

        const data5 = this.auditMarks.filter(function (elem: any) {
          return elem.attributes.category === 'Security';
        });

        this.auditSecurityCount = data5.length
        this.SecurityachievableScore = 0;
        this.SecurityScore = 0;
        this.SecurityScoreAchieved = 0;

        data5.forEach((elem: any) => {
          this.SecurityachievableScore += parseInt(elem.attributes.achievable_score) || 0;
          this.SecurityScore += elem.attributes.score || 0;
        });

        this.SecurityScoreAchieved = truncatePercentage(this.SecurityScore, this.SecurityachievableScore)
        this.SecurityResult = calculateRating(this.SecurityScoreAchieved);
        this.SecurityRating = this.SecurityResult.rating;
      },
      error: (err: any) => { },
      complete: () => {
        this.auditSummary();
      },
    });
  }

  // markStatus(colorCode: string | undefined) {

  //   const high = "high";
  //   const medium = "medium";
  //   const low = "low";

  //   if (colorCode === "no") {
  //     return high;
  //   } else if (colorCode === "partial") {
  //     return medium;
  //   } else if (colorCode === "yes") {
  //     return low;
  //   } else {
  //     return '';
  //   }
  // }

  progress(elem: any) {
    const subCategory = elem.subCategory;

    const data = this.auditMarks.filter(function (elem: any) {
      return elem.attributes.sub_category === subCategory;
    });


    this.Total_AchievedScore = 0;
    this.Total_AchievableScore = 0; // Initialize this.Total_AchievableScore before the loop

    data.forEach((elem: any) => {
      this.Total_AchievedScore += elem.attributes.score;
      this.Total_AchievableScore += parseInt(elem.attributes.achievable_score)
    });

    this.Total_EarnedScore = 0;

    if (this.Total_AchievableScore > 0) {
      this.Total_EarnedScore = Number((this.Total_AchievedScore / this.Total_AchievableScore) * 100);
    } else {
      this.Total_EarnedScore = 0; // Handle division by zero
    }
    return this.Total_EarnedScore;

    // const Auditdata = elem.checkList.filter(function (elem: any) {
    //   return elem.attributes.sub_category === subCategory;
    // });
    // this.Total_AchievableScore = 0;
    // Auditdata.forEach((elem: any) => {
    //   this.Total_AchievableScore += parseInt(elem.attributes.achievable_score) || 0;
    // });



  }

  get_action_plan() {
    const audID = this.generalForm.value.id;
    this.internalAuditService.get_action_plan(audID).subscribe({
      next: (result: any) => {
        this.actionPlan = result.data;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }

  status(data: any) {
    const high = 'bg-danger text-white';
    const medium = 'bg-warning text-black';
    const low = 'bg-secondary text-white';
    if (data === 'High') {
      return high;
    } else if (data === 'Medium') {
      return medium;
    } else if (data === 'Low') {
      return low;
    } else {
      return;
    }
  }

  openDocument(data: any) {
    let blobType = '';
    let fileType = data.attributes.command_evidence_format.toLowerCase();

    this.generalService.getImage(environment.client_backend + '/uploads/' + data.attributes.command_evidence_name + '.' + data.attributes.command_evidence_format).subscribe((result: any) => {

      if (fileType === 'pdf') {
        blobType = 'application/pdf';
      } else if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'gif') {
        blobType = 'image/' + fileType;
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else {
        blobType = 'application/octet-stream';
      }

      const blob = new Blob([result], { type: blobType });
      const file = new File([blob], data.attributes.command_evidence_name + '.' + data.attributes.command_evidence_format, { type: blobType });
      const documentId = data.attributes.command_evidence_id;
      const pdfUrl = URL.createObjectURL(blob);

      const documentInfo = {
        id: data.attributes.command_evidence_id,
        file_name: data.attributes.command_evidence_name,
        file_format: data.attributes.command_evidence_format,
        file: file,
        pdfUrl: pdfUrl,
        type: blobType
      };


      if (documentInfo) {
        this.dialog.open(ViewActionPlanDocumentComponent, {
          width: '50%',
          data: { documentInfo: documentInfo },
        });
      }
    });



  }


  updateActionPlan(data: any) {
    this.router.navigate([
      '/apps/audit-inspection/internal-audit/update-action-plan/' + data.id,
    ]);
  }

  viewActionPlan(data: any) {
    this.router.navigate([
      '/apps/audit-inspection/internal-audit/view-action-plan/' + data.id,
    ]);
  }
  auditSummary() {
    this.audit_summary = [];

    //social
    const socialCheckList = this.auditMarks.filter(function (elem: any) {
      return elem.attributes.category === 'Labor';
    });

    const laborTotalMarks = Number(socialCheckList.length) * 3;
    const laborEarnedMarks = socialCheckList.reduce(
      (acc, cur) => acc + Number(cur.attributes.mark),
      0
    );
    const laborEarnerMarkPerce = Number(
      (Number(laborEarnedMarks) / Number(laborTotalMarks)) * 100
    ).toFixed(2);
    const laborWeightage = '30';
    const laborWeightEverage = Number(
      Number(laborEarnerMarkPerce) * (Number(laborWeightage) / 100)
    ).toFixed(2);
    if (this.SocialScore === 0) {
      this.audit_summary.push({
        title: 'Social Audit',
        totalquestions: this.socialCheckListCount,
        answeredquestions: this.auditSocialCount,
        achievablescore: this.SocialachievableScore,
        earnedscore: this.SocialScore,
        achieved: 0,
        rating: this.SocialRating,
        status: this.generalForm.value.labor_audit_status,

      });
    } else {
      this.audit_summary.push({
        title: 'Social Audit',
        totalquestions: this.socialCheckListCount,
        answeredquestions: this.auditSocialCount,
        achievablescore: this.SocialachievableScore,
        earnedscore: this.SocialScore,
        achieved: this.SocialScoreAchieved + ' %',
        rating: this.SocialRating,
        status: this.generalForm.value.labor_audit_status,

      });
    }

    //health
    const healthCheckList = this.auditMarks.filter(function (elem: any) {
      return elem.attributes.category === 'Health';
    });
    const healthTotalMarks = Number(healthCheckList.length) * 3;
    const healthEarnedMarks = healthCheckList.reduce(
      (acc, cur) => acc + Number(cur.attributes.mark),
      0
    );
    const healthEarnerMarkPerce = Number(
      (Number(healthEarnedMarks) / Number(healthTotalMarks)) * 100
    ).toFixed(2);
    const healthWeightage = '25';
    const healthWeightEverage = Number(
      Number(healthEarnerMarkPerce) * (Number(healthWeightage) / 100)
    ).toFixed(2);
    if (this.HealthScore === 0) {
      this.audit_summary.push({
        title: 'Health and Safety Audit',
        totalquestions: this.healthCheckListCount,
        answeredquestions: this.auditHealthCount,
        achievablescore: this.HealthachievableScore,
        earnedscore: this.HealthScore,
        achieved: 0,
        rating: this.HealthRating,
        status: this.generalForm.value.health_audit_status,
      });
    } else {
      this.audit_summary.push({
        title: 'Health and Safety Audit',
        totalquestions: this.healthCheckListCount,
        answeredquestions: this.auditHealthCount,
        achievablescore: this.HealthachievableScore,
        earnedscore: this.HealthScore,
        achieved: this.HealthScoreAchieved + ' %',
        rating: this.HealthRating,
        status: this.generalForm.value.health_audit_status,
      });
    }

    //environment
    const environCheckList = this.auditMarks.filter(function (elem: any) {
      return elem.attributes.category === 'Environment';
    });
    const environTotalMarks = Number(environCheckList.length) * 3;
    const environEarnedMarks = environCheckList.reduce(
      (acc, cur) => acc + Number(cur.attributes.mark),
      0
    );
    const environEarnerMarkPerce = Number(
      (Number(environEarnedMarks) / Number(environTotalMarks)) * 100
    ).toFixed(2);
    const environWeightage = '15';
    const environWeightEverage = Number(
      Number(environEarnerMarkPerce) * (Number(environWeightage) / 100)
    ).toFixed(2);

    if (this.EnvironmentScore === 0) {
      this.audit_summary.push({
        title: 'Environment Audit',
        totalquestions: this.environmentCheckListCount,
        answeredquestions: this.auditEnvironmentCount,
        achievablescore: this.EnvironmentachievableScore,
        earnedscore: this.EnvironmentScore,
        achieved: 0,
        rating: this.EnvironmentRating,
        status: this.generalForm.value.environment_audit_status,
      });
    } else {
      this.audit_summary.push({
        title: 'Environment Audit',
        totalquestions: this.environmentCheckListCount,
        answeredquestions: this.auditEnvironmentCount,
        achievablescore: this.EnvironmentachievableScore,
        earnedscore: this.EnvironmentScore,
        achieved: this.EnvironmentScoreAchieved + ' %',
        rating: this.EnvironmentRating,
        status: this.generalForm.value.environment_audit_status,
      });
    }

    //management
    const managementCheckList = this.auditMarks.filter(function (elem: any) {
      return elem.attributes.category === 'Management System';
    });
    const managementTotalMarks = Number(managementCheckList.length) * 3;
    const managementEarnedMarks = managementCheckList.reduce(
      (acc, cur) => acc + Number(cur.attributes.mark),
      0
    );
    const managementEarnerMarkPerce = Number(
      (Number(managementEarnedMarks) / Number(managementTotalMarks)) * 100
    ).toFixed(2);
    const managementWeightage = '15';
    const managementWeightEverage = Number(
      Number(managementEarnerMarkPerce) * (Number(managementWeightage) / 100)
    ).toFixed(2);

    if (this.ManagementScore === 0) {
      this.audit_summary.push({
        title: 'Management System',
        totalquestions: this.managementCheckListCount,
        answeredquestions: this.auditManagementCount,
        achievablescore: this.ManagementachievableScore,
        earnedscore: this.ManagementScore,
        achieved: 0,
        rating: this.ManagementRating,
        status: this.generalForm.value.management_audit_status,
      });
    } else {
      this.audit_summary.push({
        title: 'Management System',
        totalquestions: this.managementCheckListCount,
        answeredquestions: this.auditManagementCount,
        achievablescore: this.ManagementachievableScore,
        earnedscore: this.ManagementScore,
        achieved: this.ManagementScoreAchieved + ' %',
        rating: this.ManagementRating,
        status: this.generalForm.value.management_audit_status,
      });
    }

    //security
    const securityCheckList = this.auditMarks.filter(function (elem: any) {
      return elem.attributes.category === 'Security';
    });
    const securityTotalMarks = Number(securityCheckList.length) * 3;
    const securityEarnedMarks = securityCheckList.reduce(
      (acc, cur) => acc + Number(cur.attributes.mark),
      0
    );
    const securityEarnerMarkPerce = Number(
      (Number(securityEarnedMarks) / Number(securityTotalMarks)) * 100
    ).toFixed(2);
    const securityWeightage = '15';
    const securityWeightEverage = Number(
      Number(securityEarnerMarkPerce) * (Number(securityWeightage) / 100)
    ).toFixed(2);

    if (this.SecurityScore === 0) {
      this.audit_summary.push({
        title: 'Security (CTPAT) Audit',
        totalquestions: this.securityCheckListCount,
        answeredquestions: this.auditSecurityCount,
        achievablescore: this.SecurityachievableScore,
        earnedscore: this.SecurityScore,
        achieved: 0,
        rating: this.SecurityRating,
        status: this.generalForm.value.security_audit_status,
      });
    } else {
      this.audit_summary.push({
        title: 'Security (CTPAT) Audit',
        totalquestions: this.securityCheckListCount,
        answeredquestions: this.auditSecurityCount,
        achievablescore: this.SecurityachievableScore,
        earnedscore: this.SecurityScore,
        achieved: this.SecurityScoreAchieved + ' %',
        rating: this.SecurityRating,
        status: this.generalForm.value.security_audit_status,
      });
    }

    this.TotalAchievableScore =
      Number(this.SocialachievableScore) +
      Number(this.HealthachievableScore) +
      Number(this.EnvironmentachievableScore) +
      Number(this.ManagementachievableScore) +
      Number(this.SecurityachievableScore)

    this.TotalAchievedScore =
      Number(this.SocialScore) +
      Number(this.HealthScore) +
      Number(this.EnvironmentScore) +
      Number(this.ManagementScore) +
      Number(this.SecurityScore)

    if (this.TotalAchievableScore === 0) {
      this.finalScore = 0;
    } else {
      this.finalScore = ((Number(this.TotalAchievedScore) / Number(this.TotalAchievableScore)) * 100).toFixed(2);
    }

    this.finalScore = parseFloat(this.finalScore);


    if (Number(this.finalScore) >= 90) {
      this.auditGrade = 'A';
      this.auditRating = 'Outstanding';
    } else if (Number(this.finalScore) >= 70) {
      this.auditGrade = 'B';
      this.auditRating = 'Good';
    } else if (Number(this.finalScore) >= 50) {
      this.auditGrade = 'C';
      this.auditRating = 'Poor';
    } else if (Number(this.finalScore) <= 49) {
      this.auditGrade = 'D';
      this.auditRating = 'Bad';
    }



    if (Number(this.finalScore) >= 90) {
      this.auditGrade = 'A';
      this.auditRating = 'Outstanding';
    } else if (Number(this.finalScore) >= 70) {
      this.auditGrade = 'B';
      this.auditRating = 'Good';
    } else if (Number(this.finalScore) >= 50) {
      this.auditGrade = 'C';
      this.auditRating = 'Poor';
    } else if (Number(this.finalScore) <= 49) {
      this.auditGrade = 'D';
      this.auditRating = 'Bad';
    }


    // const temp =
    //   Number(laborTotalMarks) +
    //   Number(healthTotalMarks) +
    //   Number(environTotalMarks) +
    //   Number(securityTotalMarks);
    // const temp2 =
    //   Number(laborEarnedMarks) +
    //   Number(healthEarnedMarks) +
    //   Number(environEarnedMarks) +
    //   Number(securityEarnedMarks);

    // const totalScore = this.audit_summary.reduce(
    //   (acc, cur) => acc + Number(cur.total),
    //   0
    // );
    // const earnedScore = this.audit_summary.reduce(
    //   (acc, cur) => acc + Number(cur.scoreNum),
    //   0
    // );
    // const Score = this.audit_summary.reduce(
    //   (acc, cur) => {
    //     const scoreValue = parseFloat(cur.score);
    //     if (!isNaN(scoreValue)) {
    //       return acc + scoreValue;
    //     }
    //     return acc;
    //   },
    //   0
    // );

    // const markPernce = Number(((Score) / 5)).toFixed(2);

    // if (earnedScore == '0') {
    //   this.totalScore = '0 %';
    // } else {
    //   this.totalScore = markPernce + ' %';
    // }
    // const wieghtAvg = this.audit_summary.reduce(
    //   (acc, cur) => {
    //     const avgValue = parseFloat(cur.wieghtAverage);
    //     if (!isNaN(avgValue)) {
    //       return acc + avgValue;
    //     }
    //     return acc;
    //   },
    //   0
    // );
    // const total_mark = Number(((wieghtAvg) / 5)).toFixed(2);
    // if (earnedScore == 0) {
    //   this.finalScore = '0 %';
    // } else {
    //   this.finalScore = total_mark + ' %';
    // }

    // const totalScore = Number(laborTotalMarks)+Number(healthTotalMarks)+Number(environTotalMarks)+Number(securityTotalMarks)
    // const earnedScore = Number(laborEarnedMarks)+Number(healthEarnedMarks)+Number(environEarnedMarks)+Number(securityEarnedMarks)
    // const markPernce = Number(Number(earnedScore)/Number(totalScore)*100).toFixed(2)
    // const total_weigtage = Number(laborWeightEverage)+Number(healthWeightEverage)+Number(environWeightEverage)+Number(securityWeightEverage)

    // this.totalScore = Number(markPernce)+Number(total_weigtage)+" %"

    // if (Number(total_mark) >= 90) {
    //   this.auditGrade = 'Outstanding';
    // } else if (Number(total_mark) >= 70) {
    //   this.auditGrade = 'Good';
    // } else if (Number(total_mark) >= 50) {
    //   this.auditGrade = 'Poor';
    // } else if (Number(total_mark) <= 49) {
    //   this.auditGrade = 'Bad';
    // }

    // const reference = this.route.snapshot.paramMap.get('id');
    // this.internalAuditService.get_audit_marks(reference).subscribe({
    //   next: (result: any) => {

    //     //social
    //     const socialCheckList = result.data.filter(function (elem: any) {
    //       return (elem.attributes.category === "Labor")
    //     })


    //   },
    //   error: (err: any) => { },
    //   complete: () => { }
    // })

    let filteredArray = this.audit_summary.filter(obj => this.titles.includes(obj.title))

    if (this.titles.includes('Company Code of Conduct')) {
      filteredArray = this.audit_summary;
    }

    this.audit_summary = filteredArray;

  }

  statusButton(data: any) {
    const pending = 'btn-light';
    const inProgress = 'btn-warning';
    const completed = 'btn-success';

    if (data === 'Pending') {
      return pending;
    } else if (data === 'In-Progress') {
      return inProgress;
    } else if (data === 'Completed') {
      return completed;
    } else {
      return;
    }
  }

  startLaborAudit() {
    const status = 'In Progress';
    this.internalAuditService
      .start_labor_audit(this.generalForm.value.id, status)
      .subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const statusText = 'Social Audit Started';
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.get_audit_details();
        },
      });
  }

  startHealthAudit() {
    const status = 'In Progress';

    this.internalAuditService
      .start_health_audit(this.generalForm.value.id, status)
      .subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const statusText = 'Health & Safety Audit Started';
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.get_audit_details();
        },
      });
  }

  startEnvironAudit() {
    const status = 'In Progress';

    this.internalAuditService
      .start_environ_audit(this.generalForm.value.id, status)
      .subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const statusText = 'Environment Audit Started';
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.get_audit_details();
        },
      });
  }

  startSecurityAudit() {
    const status = 'In Progress';

    this.internalAuditService
      .start_security_audit(this.generalForm.value.id, status)
      .subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const statusText = 'Security Audit Started';
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.get_audit_details();
        },
      });
  }

  laborAudCompleted() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the labor audit has completed. If completed, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to cancel the process.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        const status = 'Completed';
        this.internalAuditService
          .start_labor_audit(this.generalForm.value.id, status)
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Labor Audit Completed';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_audit_details();
            },
          });
      }
    });
  }

  healthAudCompleted() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the health audit has completed. If completed, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to cancel the process.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        const status = 'Completed';
        this.internalAuditService
          .start_health_audit(this.generalForm.value.id, status)
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Health Audit Completed';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_audit_details();
            },
          });
      }
    });
  }

  environAudCompleted() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the environment audit has completed. If completed, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to cancel the process.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        const status = 'Completed';
        this.internalAuditService
          .start_environ_audit(this.generalForm.value.id, status)
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Environment Audit Completed';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_audit_details();
            },
          });
      }
    });
  }

  securityAudCompleted() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the security audit has completed. If completed, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to cancel the process.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        const status = 'Completed';
        this.internalAuditService
          .start_security_audit(this.generalForm.value.id, status)
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Security Audit Completed';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_audit_details();
            },
          });
      }
    });
  }

  markAsCompleted() {
    const id = this.generalForm.value.id;
    this.internalAuditService.audit_complete(id).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        Swal.fire({
          title: 'Audit Completed',
          imageUrl: 'assets/images/reported.gif',
          imageWidth: 250,
          text: 'Congratulations! the audit has You have completed. If necessary, please generate the audit report from generak details. You can generate the report anytime from the register window.',
          showCancelButton: false,
        });
        this.router.navigate(['/apps/audit-inspection/internal-audit/queue']);
      },
    });
  }
  questionProgress(elem: any, category: any) {
    const subCategory = elem;
    const data = this.auditMarks.filter(function (elem: any) {
      return elem.attributes.sub_category === subCategory;
    });
    if (category === 'Labor') {
      const TotalQues = this.socialCheckList.filter(function (elem: any) {
        return elem.attributes.sub_category === subCategory;
      });
      const totalAnswered = Number(data.length);
      const percentage = Number(
        (Number(totalAnswered) / Number(TotalQues.length)) * 100
      ).toFixed(0);
      return Number(percentage);
    }
    else if (category === 'Health') {
      const TotalQues = this.healthCheck.filter(function (elem: any) {
        return elem.attributes.sub_category === subCategory;
      });
      const totalAnswered = Number(data.length);
      const percentage = Number(
        (Number(totalAnswered) / Number(TotalQues.length)) * 100
      ).toFixed(0);
      return Number(percentage);
    }
    else if (category === 'Environment') {
      const TotalQues = this.environmentCheck.filter(function (elem: any) {
        return elem.attributes.sub_category === subCategory;
      });
      const totalAnswered = Number(data.length);
      const percentage = Number(
        (Number(totalAnswered) / Number(TotalQues.length)) * 100
      ).toFixed(0);
      return Number(percentage);
    }
    else if (category === 'Management') {
      const TotalQues = this.managementCheck.filter(function (elem: any) {
        return elem.attributes.sub_category === subCategory;
      });
      const totalAnswered = Number(data.length);
      const percentage = Number(
        (Number(totalAnswered) / Number(TotalQues.length)) * 100
      ).toFixed(0);
      return Number(percentage);
    }
    else if (category === 'Security') {
      const TotalQues = this.securityCheck.filter(function (elem: any) {
        return elem.attributes.sub_category === subCategory;
      });
      const totalAnswered = Number(data.length);
      const percentage = Number(
        (Number(totalAnswered) / Number(TotalQues.length)) * 100
      ).toFixed(0);
      return Number(percentage);
    }
    else {
      return 0;
    }
  }
  exportActionPlan() {
    document.getElementById('ext_action_report')?.classList.add("hide");
    document.getElementById('ext_action_report_loader')?.classList.remove("hide")
    this.internalAuditService.internal_audit_action_plan(this.generalForm.value.reference_number).subscribe((response: any) => {
      // let blob: any = new Blob([response], { type: 'application/xls; charset=utf-8' });
      // const url = window.URL.createObjectURL(blob);
      // window.open(url)

      let blob = new Blob([response], { type: 'application/vnd.ms-excel' }); // For Excel files, use 'application/vnd.ms-excel'
      let url = window.URL.createObjectURL(blob);

      let a = document.createElement('a');
      a.href = url;
      a.download = this.generalForm.value.reference_number + '_action_plan.xls'; // Set the filename with the .xls extension
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      document.getElementById('ext_action_report')?.classList.remove("hide");
      document.getElementById('ext_action_report_loader')?.classList.add("hide")
    })
  }
  navigate() {
    this.backToHistory = true
    this._location.back();
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

}
