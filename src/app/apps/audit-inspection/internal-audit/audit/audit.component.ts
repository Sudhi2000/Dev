import { Attribute, Component, OnInit } from '@angular/core';
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
import { Location } from '@angular/common';
import { MatDialog, MatDialogConfig, } from '@angular/material/dialog';
import { ActionPlanComponent } from './action-plan/action-plan.component';
import { AuditChecklistComponent } from './audit-checklist/audit-checklist.component';
import { RemarksComponent } from './audit-checklist/remarks/remarks.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { L } from '@angular/cdk/keycodes';
import { ActualStartDateComponent } from './actual-start-date/actual-start-date.component';
import { audit } from 'rxjs';
import { CommandComponent } from './audit-checklist/command/command.component';
import { ViewActionPlanDocumentComponent } from '../view-action-plan-document/view-action-plan-document.component';
import { formatDate } from '@fullcalendar/common';
import { UploadFacilityPhotoComponent } from './upload-facility-photo/upload-facility-photo.component';
import { Lightbox } from 'ngx-lightbox';


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
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AuditComponent implements OnInit {
  generalForm: FormGroup;
  socialForm: FormGroup;
  healthForm: FormGroup;
  environmentForm: FormGroup;
  managementForm: FormGroup;
  securityForm: FormGroup;
  actionPlanForm: FormGroup;
  audit_summary: any[] = [];
  titles: string[] = [];
  defultTitles: string[] = [];
  actionPlan_id: any
  multipleEvidenceArray: any[] = [];
  multipleFacilityPhotoArray: any[] = [];
  auditMarks: any[] = [];
  auditSocialCount: number = 0;
  auditHealthCount: number = 0;
  auditEnvironmentCount: number = 0;
  auditManagementCount: number = 0;
  auditSecurityCount: number = 0;
  backToHistory: Boolean = false
  Total_AchievableScore: number = 0;
  Total_AchievedScore: number = 0;
  Total_EarnedScore: number = 0;
  SocialachievableScore: number = 0
  HealthachievableScore: number = 0
  EnvironmentachievableScore = 0
  ManagementachievableScore = 0
  SecurityachievableScore = 0
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

  SocialGrade: any
  HealthGrade: any;
  EnvironmentGrade: any
  ManagementGrade: any;
  SecurityGrade: any;

  socialCheckList: any[] = []
  healthCheck: any[] = [];
  environmentCheck: any[] = [];
  managementCheck: any[] = [];
  securityCheck: any[] = [];
  evidenceFormData = new FormData();
  MultipleEvidenceData = new FormData()
  coverPhotoFormData = new FormData();
  MultipleFacilityPhotoFormData = new FormData();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  totalQuestions: any
  actionPlan: any[] = [];

  TotalAchievedScore: number = 0;
  TotalAchievableScore: number = 0;
  Totalmark: number = 0;
  Audits: any;
  auditCheckList: any[] = [];
  healthCheckList: any[] = [];
  environmentCheckList: any[] = [];
  managementCheckList: any[] = [];
  securityCheckList: any[] = [];
  securityCheckListCount: any;
  socialCheckListCount: any;
  healthCheckListCount: any;
  environmentCheckListCount: any;
  managementCheckListCount: number = 0;
  totalScore: any;
  finalScore: any;
  auditGrade: string;
  auditRating: string;
  priority: string;
  pending_audit: any[] = [];
  pending_percentage: any;
  totalQues: any[] = [];
  auditDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  approvalDate = new FormControl(null, [Validators.required]);
  actualstartDate = new FormControl(null, [Validators.required]);
  orgID: any;
  divisionUuids: any[] = []
  teamMemberIDs: any[] = []
  currentRate = 0;
  totalachievableScore: number = 0;
  checkListStatus: boolean = false;
  showLaborTab: boolean = false;
  showHealthTab: boolean = false;
  showEnvironmentTab: boolean = false;
  showManagementTab: boolean = false;
  showSecurityTab: boolean = false;

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
  actionList: any[] = [];
  unitSpecific: any
  corporateUser: any
  userDivision: any
  achievable_score: number = 0;
  weightage: any
  score: number = 0;
  achievable_score_data: any;
  userID: any
  CommandEvidence = new FormData();
  Commandmarks: any[] = [];
  files: File[] = [];
  facilityFiles: File[] = []
  coverPhotoData: any[] = [];
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
    private _location: Location,
    private _lightbox: Lightbox
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
      command: [''],
      labor_audit_status: [''],
      health_audit_status: [''],
      environment_audit_status: [''],
      management_audit_status: [''],
      security_audit_status: [''],
      markID: [''],
      evidenceID: [''],
      pending_audit: [''],
      pending_percentage: [],
      pending_color_code: [],
      actual_start_date: [],
      cover_photo: [''],
      cover_photo_id: ['']
    });

    this.socialForm = this.formBuilder.group({});

    this.healthForm = this.formBuilder.group({});

    this.environmentForm = this.formBuilder.group({});

    this.managementForm = this.formBuilder.group({});

    this.securityForm = this.formBuilder.group({});

    this.actionPlanForm = this.formBuilder.group({});

    // this.get_audit_details()
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
        const status = result.int_aud_audit;
        this.userID = result.id
        if (status === false) {
          this.router.navigate(['/error/unauthorized']);
        } else {
          this.get_audit_details();
          this.get_audit_checklist();
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
    this.coverPhotoData = []

    this.internalAuditService.get_audit_details(reference).subscribe({
      next: (result: any) => {
        const uniqueTeamMemberIDs = new Set<number>();
        if (result.data.length > 0) {
          // const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
          // let matchFound = true;          
          // if (this.divisionUuids && this.divisionUuids.length > 0) {
          //   matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
          // }          
          const teamMembers = result.data[0].attributes.audit_team_members?.data;
          if (teamMembers && Array.isArray(teamMembers)) {
            teamMembers.forEach(member => {
              const userId = parseInt(member.attributes.user_id, 10);
              if (!isNaN(userId)) {
                uniqueTeamMemberIDs.add(userId);
              }
            });
          }
          this.teamMemberIDs = Array.from(uniqueTeamMemberIDs);
          this.titles = result.data[0]?.attributes?.title.split(',')
          const approverID = result.data[0].attributes.approver.data?.id;
          let matchFound = true;
          if (this.userID !== approverID && !this.teamMemberIDs.includes(this.userID)) {
            matchFound = false;
          } else if (this.userID === approverID || this.teamMemberIDs.includes(this.userID)) {
            matchFound = true;
          }

          if ((result.data[0].attributes.status !== 'Approved')
            || (!matchFound || matchFound !== true)
            // result.data[0].attributes.status==='Completed'|| result.data[0].attributes.status==='Scheduled'||result.data[0].attributes.status==="Draft"
          ) {
            this.router.navigate(["/apps/audit-inspection/internal-audit/queue"])


          } else {
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
            this.generalForm.controls['management_audit_status'].setValue(
              result.data[0].attributes.management_audit_status
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
            this.generalForm.controls['actual_start_date'].setValue(
              result.data[0].attributes.actual_start_date
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
            this.actualstartDate.setValue(
              new Date(result.data[0].attributes.actual_start_date)
            );
            this.generalForm.controls['pending_audit'].setValue(
              result.data[0].attributes.pending_audit
            );
            this.generalForm.controls['pending_percentage'].setValue(
              result.data[0].attributes.pending_percentage
            );
            this.generalForm.controls['pending_color_code'].setValue(
              result.data[0].attributes.pending_color_code
            );

            // this.generalForm.disable()
            this.generalForm.controls['start'].enable();
            this.generalForm.controls['end'].enable();

            this.auditDateRange.controls['start'].disable();
            this.auditDateRange.controls['end'].disable();
            this.approvalDate.disable();
            this.actualstartDate.disable();
            this.generalForm.controls['announcement'].enable();
            this.generalForm.controls['status'].enable();
            this.generalForm.controls['reference_number'].enable();
            this.generalForm.controls['date'].enable();
            this.generalForm.controls['id'].enable();
            this.generalForm.controls['remarks'].enable();
            this.get_audit_marks();
            this.get_action_plan();


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
            this.checkListStatus =
              (!this.showLaborTab || result.data[0].attributes.labor_audit_status === 'Completed') &&
              (!this.showHealthTab || result.data[0].attributes.health_audit_status === 'Completed') &&
              (!this.showEnvironmentTab || result.data[0].attributes.environment_audit_status === 'Completed') &&
              (!this.showManagementTab || result.data[0].attributes.management_audit_status === 'Completed') &&
              (!this.showSecurityTab || result.data[0].attributes.security_audit_status === 'Completed');


          }

          this.coverPhotoData = result.data[0].attributes.internal_audit_cover_photo.data
          if (this.coverPhotoData != null) {
            this.generalForm.controls['cover_photo'].setValue('OK')
          } else {
            this.generalForm.controls['cover_photo'].reset()
          }

          const coverImage__data = result.data[0].attributes.internal_audit_cover_photo.data

          if (coverImage__data != null) {
            this.generalForm.controls['cover_photo_id'].setValue(coverImage__data.id)

            // coverImage__data.forEach((data: any) => {
            this.generalService.getImage(environment.client_backend + '/uploads/' + coverImage__data.attributes.cover_photo_name + '.' + coverImage__data.attributes.format).subscribe((data: any) => {
              this.files.push(data)
            })
          }

          this.getFacilityPhoto();


        } else {
          this.router.navigate([
            '/apps/audit-inspection/internal-audit/register',
          ]);
        }
      },
      error: (err: any) => { },
      complete: () => {

        if (this.generalForm.value.status !== "") {
          if (!this.generalForm.value.actual_start_date) {
            const referenceID = this.generalForm.value.id;
            this.dialog
              .open(ActualStartDateComponent, {
                data: { referenceID },
              })
              .afterClosed()
              .subscribe((result) => {
                if (result) {
                  this.get_audit_details();
                }
              });
          }
        }
      },
    });
  }

  action(data: any) { }

  get_audit_checklist() {
    this.internalAuditService.get_audit_checklist().subscribe({
      next: (result: any) => {
        //social
        this.Audits = result

        this.socialCheckList = result.data
          .filter(function (elem: any) {
            return elem.attributes.category === 'Labor';
          })
          .sort(function (a: any, b: any) {
            return a.attributes.sub_category_order - b.attributes.sub_category_order;
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
        // this.healthCheck = result.data.filter(function (elem: any) {
        //   return elem.attributes.category === 'Health';
        // });

        this.healthCheck = result.data
          .filter(function (elem: any) {
            return elem.attributes.category === 'Health';
          })
          .sort(function (a: any, b: any) {
            return a.attributes.sub_category_order - b.attributes.sub_category_order;
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
        // this.environmentCheck = result.data.filter(function (elem: any) {
        //   return elem.attributes.category === 'Environment';
        // });
        this.environmentCheck = result.data
          .filter(function (elem: any) {
            return elem.attributes.category === 'Environment';
          })
          .sort(function (a: any, b: any) {
            return a.attributes.sub_category_order - b.attributes.sub_category_order;
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
        // this.managementCheck = result.data.filter(function (elem: any) {
        //   return elem.attributes.category === 'Management System';
        // });
        this.managementCheck = result.data
          .filter(function (elem: any) {
            return elem.attributes.category === 'Management System';
          })
          .sort(function (a: any, b: any) {
            return a.attributes.sub_category_order - b.attributes.sub_category_order;
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
        // this.securityCheck = result.data.filter(function (elem: any) {
        //   return elem.attributes.category === 'Security';
        // });
        this.securityCheck = result.data
          .filter(function (elem: any) {
            return elem.attributes.category === 'Security';
          })
          .sort(function (a: any, b: any) {
            return a.attributes.sub_category_order - b.attributes.sub_category_order;
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


  auditCheklist(data: any) {
    this.showProgressPopup()
    const reference = this.route.snapshot.paramMap.get('id');
    const referenceID = this.generalForm.value.id;

    this.dialog
      .open(AuditChecklistComponent, {
        data: { data, reference, referenceID },
      })
      .afterClosed()
      .subscribe((checklist) => {
        // if (checklist > 0) {
        this.get_audit_marks();
        this.get_action_plan();
        // }
      });
    Swal.close()
  }

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
        this.SocialGrade = this.SocialResult.grade;

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
        this.HealthGrade = this.HealthResult.grade;


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
        this.EnvironmentGrade = this.EnvironmentResult.grade;


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
        this.ManagementGrade = this.ManagementResult.grade;

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
        this.SecurityGrade = this.SecurityResult.grade;

      },
      error: (err: any) => { },
      complete: () => {
        this.auditSummary();
      },
    });
  }

  progress(elem: any) {

    const subCategory = elem.subCategory;

    const data = this.auditMarks.filter(function (elem: any) {
      return elem.attributes.sub_category === subCategory;
    });


    this.Total_AchievedScore = 0;
    this.Total_AchievableScore = 0;

    data.forEach((elem: any) => {
      this.Total_AchievedScore += elem.attributes.score;
      this.Total_AchievableScore += parseInt(elem.attributes.achievable_score)
    });

    this.Total_EarnedScore = 0;

    if (this.Total_AchievableScore > 0) {
      this.Total_EarnedScore = Number((this.Total_AchievedScore / this.Total_AchievableScore) * 100);
    } else {
      this.Total_EarnedScore = 0;
    }

    return this.Total_EarnedScore;

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




  auditMark(data: any, mark: any) {
    const markValue = mark.target.value;
    this.achievable_score = data.attributes.achievable_score;
    this.weightage = data.attributes.weightage;
    let score = this.achievable_score;
    let rating = '';

    if (markValue === 'Yes') {
      if (this.weightage === 'Zero Tolerance') {
        score = this.achievable_score;
        rating = 'Complied';
      } else if (this.weightage === 'Critical') {
        score = this.achievable_score;
        rating = 'Complied';
      }
      else if (this.weightage === 'Major') {
        score = this.achievable_score;
        rating = 'Complied';
      }
      else if (this.weightage === 'Moderate') {
        score = this.achievable_score;
        rating = 'Complied';
      }
      else if (this.weightage === 'Minor') {
        score = this.achievable_score;
        rating = 'Complied';
      }
    } else if (markValue === 'Partial Yes') {
      if (this.weightage === 'Zero Tolerance') {
        score = this.achievable_score / 2;
        rating = 'Critical';
      } else if (this.weightage === 'Critical') {
        score = this.achievable_score / 2;
        rating = 'Major';
      }
      else if (this.weightage === 'Major') {
        score = this.achievable_score / 2;
        rating = 'Moderate';
      }
      else if (this.weightage === 'Moderate') {
        score = this.achievable_score / 2;
        rating = 'Minor';
      }
      else if (this.weightage === 'Minor') {
        score = this.achievable_score / 2;
        rating = 'Minor';
      }

    }
    else if (markValue === 'No') {
      if (this.weightage === 'Zero Tolerance') {
        score = 0;
        rating = 'Zero Tolerance';
      } else if (this.weightage === 'Critical') {
        score = 0;
        rating = 'Critical';
      }
      else if (this.weightage === 'Major') {
        score = 0;
        rating = 'Major';
      }
      else if (this.weightage === 'Moderate') {
        score = 0;
        rating = 'Moderate';
      }
      else if (this.weightage === 'Minor') {
        score = 0;
        rating = 'Minor';
      }
    }

    if (mark.target.value === 'Not Applicable') {
      this.showProgressPopup();
      this.internalAuditService.delete_audit_mark(data.id).subscribe({
        next: (result: any) => {
          this.internalAuditService
            .get_action_plan_reference(data.id)
            .subscribe({
              next: (result: any) => {
                if (result.data.length > 0) {
                  const actionID = result.data[0].id;
                  this.internalAuditService
                    .delete_action_plan(actionID)
                    .subscribe({
                      next: (result: any) => { },
                      error: (err: any) => { },
                      complete: () => {
                        this.get_audit_marks();
                        this.get_action_plan();
                        Swal.close();
                      },
                    });
                } else {
                  this.get_audit_marks();
                  this.get_action_plan();

                  Swal.close();
                }
              },
              error: (err: any) => { },
              complete: () => { },
            });
        },
        error: (err: any) => { },
        complete: () => { },
      });
    } else {
      if (mark.target.value === 'Yes') {
        let auditMark: any[] = [];
        auditMark.push({
          question: data.attributes.question,
        });
        const dialogRef = this.dialog.open(CommandComponent, {

          data: auditMark

        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result.length > 0) {
            if (result[1].length > 0) {
              result[1].forEach((elem: any) => {
                this.CommandEvidence.delete('files');
                const extension = elem.name.split('.').pop().toLowerCase();
                this.CommandEvidence.append(
                  'files',
                  elem,
                  this.generalForm.value.reference_number + '.' + extension
                );
                this.Commandmarks = []
                this.generalService.upload(this.CommandEvidence).subscribe({
                  next: (filterresult: any) => {
                    this.Commandmarks.push({
                      evidence_name: filterresult[0].hash,
                      evidence_format: extension,
                      command_evidence_id: filterresult[0].id,
                      command: result[0].command,
                      internal_audit: this.generalForm.value.id
                    });
                  },
                  error: (err: any) => { },
                  complete: () => {
                    this.showProgressPopup();
                    const remarks = '';
                    const commands = result[0].command
                    this.internalAuditService

                      .update_audit_mark_command(
                        data.id, rating, score, mark.target.value, remarks, this.Commandmarks)
                      .subscribe({
                        next: (result: any) => {
                        },
                        error: (err: any) => { },
                        complete: () => {
                          this.internalAuditService
                            .get_action_plan_reference(data.id)
                            .subscribe({
                              next: (result: any) => {
                                if (result.data.length > 0) {
                                  const actionID = result.data[0].id;
                                  this.internalAuditService
                                    .delete_action_plan(actionID)
                                    .subscribe({
                                      next: (result: any) => { },
                                      error: (err: any) => { },
                                      complete: () => {
                                        this.get_audit_marks();
                                        this.get_action_plan();
                                        Swal.close();
                                      },
                                    });
                                } else {
                                  this.get_audit_marks();
                                  this.get_action_plan();

                                  Swal.close();
                                }
                              },
                              error: (err: any) => { },
                              complete: () => { },
                            });
                        },
                      });
                  },
                });
              });
            }
            else {
              this.showProgressPopup();
              const remarks = '';
              const commands = result[0].command

              this.internalAuditService
                .update_audit_mark_command(
                  data.id, rating, score, mark.target.value, remarks, this.Commandmarks)
                .subscribe({
                  next: (result: any) => {

                  },
                  error: (err: any) => { },
                  complete: () => {
                    this.internalAuditService
                      .get_action_plan_reference(data.id)
                      .subscribe({
                        next: (result: any) => {
                          if (result.data.length > 0) {
                            const actionID = result.data[0].id;
                            this.internalAuditService
                              .delete_action_plan(actionID)
                              .subscribe({
                                next: (result: any) => { },
                                error: (err: any) => { },
                                complete: () => {
                                  this.get_audit_marks();
                                  this.get_action_plan();
                                  Swal.close();
                                },
                              });
                          } else {
                            this.get_audit_marks();
                            this.get_action_plan();

                            Swal.close();
                          }
                        },
                        error: (err: any) => { },
                        complete: () => { },
                      });
                  },
                });
            }
          }
          else {
            this.get_audit_marks();
            this.get_action_plan();

            Swal.close();
          }
        });



      } else {
        let auditMark: any[] = [];
        // auditMark.push({

        //   remarks: data.attributes.remarks,
        //   priority: data.attributes.priority,
        //   document_name:
        //     data.attributes.internal_audit_evidences?.data[0]?.attributes
        //       ?.evidence_name,
        //   document_format:
        //     data.attributes.internal_audit_evidences?.data[0]?.attributes
        //       ?.format,
        //   document_id:
        //     data.attributes.internal_audit_evidences?.data[0]?.attributes
        //       ?.evidence_id,
        //   evidence: data.attributes.internal_audit_evidences?.data[0]?.id,
        //   question: data.attributes.question,
        //   multiple_evidences: []
        // });

        let singleEvidence = {

          remarks: data.attributes.remarks,
          priority: data.attributes.priority,
          document_name:
            data.attributes.internal_audit_evidences?.data[0]?.attributes
              ?.evidence_name,
          document_format:
            data.attributes.internal_audit_evidences?.data[0]?.attributes
              ?.format,
          document_id:
            data.attributes.internal_audit_evidences?.data[0]?.attributes
              ?.evidence_id,
          evidence: data.attributes.internal_audit_evidences?.data[0]?.id,
          question: data.attributes.question,
          multiple_evidences: [] as {
            multiple_evidence_name: string;
            multiple_evidence_format: string;
            multiple_evidence_id: string;
          }[]
        };

        data.attributes.internal_multiple_evidences.data.forEach((doc: any) => {
          singleEvidence.multiple_evidences.push({
            multiple_evidence_name: doc.attributes?.evidence_name,
            multiple_evidence_format: doc.attributes?.format,
            multiple_evidence_id: doc.attributes?.image_id,
          });
        });


        auditMark.push(singleEvidence);

        const dialogRef = this.dialog.open(RemarksComponent, {
          data: auditMark

        });
        dialogRef.afterClosed().subscribe((remarksresult) => {
          this.get_action_plan();
          this.showProgressPopup();
          if (remarksresult) {
            const commands = '';
            const newRemarks = remarksresult[0].remarks;

            this.internalAuditService
              .update_audit_mark(
                data.id,
                rating,
                score,
                mark.target.value,
                remarksresult[0].remarks
              )
              .subscribe({
                next: (result: any) => {

                  this.generalForm.controls['markID'].setValue(result.data.id);

                  const subData = this.actionPlan.filter(function (elem: any) {
                    return elem.attributes.mark_id === result.data.id.toString();
                  });
                  this.actionPlan_id = subData[0].id
                  this.internalAuditService.update_audit_action_plan_by_actionplan_id(result.data, this.actionPlan_id).subscribe({
                    next: (result: any) => {

                    }, error: (err: any) => {

                    }, complete: () => {

                    },
                  })
                },
                error: (err: any) => { },
                complete: () => {

                  this.internalAuditService
                    .get_action_plan_reference(data.id)
                    .subscribe({
                      next: (result: any) => {

                        if (result.data.length > 0) {
                          const actionID = result.data[0].id;
                          let createDate: any[] = [];

                          createDate.push({
                            id: this.actionPlan_id,
                            findings: newRemarks,
                            internal_audit: this.generalForm.value.id,
                            priority: remarksresult[0].priority,
                          });

                          this.internalAuditService
                            .update_action_plan(createDate[0],)
                            .subscribe({
                              next: (result: any) => {

                                if (remarksresult[1].length != 0) {
                                  remarksresult[1].forEach((elem: any) => {
                                    this.evidenceFormData.delete('files');
                                    const extension = elem.name
                                      .split('.')
                                      .pop()
                                      .toLowerCase();
                                    this.evidenceFormData.append(
                                      'files',
                                      elem,
                                      this.generalForm.value.reference_number +
                                      '.' +
                                      extension
                                    );
                                    this.generalService
                                      .upload(this.evidenceFormData)
                                      .subscribe({
                                        next: (fileresult: any) => {
                                          let evidenceDocument: any[] = [];
                                          evidenceDocument.push({
                                            internal_audit:
                                              this.generalForm.value.id,
                                            audit_mark:
                                              this.generalForm.value.markID,
                                            document_name: fileresult[0].hash,
                                            document_format: extension,
                                            document_id: fileresult[0].id,
                                          });
                                          this.internalAuditService
                                            .create_action_plan_evidence(
                                              evidenceDocument[0],
                                              actionID
                                            )
                                            .subscribe({
                                              next: (result: any) => {
                                                this.get_audit_marks();
                                                this.get_action_plan();
                                                Swal.close()
                                              },
                                              error: (err: any) => { },
                                              complete: () => {

                                                if (remarksresult[2].length != 0) {
                                                  this.multipleEvidenceArray = [];
                                                  remarksresult[2].forEach((elem: any) => {
                                                    this.MultipleEvidenceData.delete('files');
                                                    const extension = elem.name.split('.').pop().toLowerCase();
                                                    this.MultipleEvidenceData.append(
                                                      'files',
                                                      elem,
                                                      this.generalForm.value.reference_number + '.' + extension
                                                    );
                                                    this.generalService.upload(this.MultipleEvidenceData).subscribe({
                                                      next: (evidenceresult: any) => {

                                                        this.multipleEvidenceArray.push({
                                                          document_name: evidenceresult[0].hash,
                                                          document_format: extension,
                                                          document_id: evidenceresult[0].id,

                                                        })
                                                      },
                                                      error: (err: any) => { },
                                                      complete: () => {

                                                        if (this.multipleEvidenceArray.length === remarksresult[2].length) {

                                                          this.multipleEvidenceArray.forEach((doc) => {
                                                            const evidenceData = {
                                                              document_name: doc.document_name,
                                                              document_format: doc.document_format,
                                                              document_id: doc.document_id,
                                                              internal_audit: this.generalForm.value.id,
                                                              audit_mark: this.generalForm.value.markID,
                                                            };
                                                            this.internalAuditService
                                                              .create_internal_audit_multiple_evidence_before(evidenceData, actionID)
                                                              .subscribe({
                                                                next: (response: any) => {

                                                                },
                                                                error: (error: any) => {
                                                                },
                                                                complete: () => {
                                                                  this.get_audit_marks();
                                                                  this.get_action_plan();
                                                                  Swal.close()
                                                                }
                                                              });
                                                          });
                                                        }
                                                        else {
                                                          this.get_audit_marks();
                                                          this.get_action_plan();
                                                          Swal.close()
                                                        }
                                                      },
                                                    });
                                                  });
                                                }

                                              },
                                            });
                                        },
                                        error: (err: any) => { },
                                        complete: () => { },
                                      });
                                  });
                                }
                                else {
                                  if (remarksresult[2].length != 0) {
                                    this.multipleEvidenceArray = [];
                                    remarksresult[2].forEach((elem: any) => {
                                      this.MultipleEvidenceData.delete('files');
                                      const extension = elem.name.split('.').pop().toLowerCase();
                                      this.MultipleEvidenceData.append(
                                        'files',
                                        elem,
                                        this.generalForm.value.reference_number + '.' + extension
                                      );
                                      this.generalService.upload(this.MultipleEvidenceData).subscribe({
                                        next: (evidenceresult: any) => {

                                          this.multipleEvidenceArray.push({
                                            document_name: evidenceresult[0].hash,
                                            document_format: extension,
                                            document_id: evidenceresult[0].id,

                                          })
                                        },
                                        error: (err: any) => { },
                                        complete: () => {

                                          if (this.multipleEvidenceArray.length === remarksresult[2].length) {

                                            this.multipleEvidenceArray.forEach((doc) => {
                                              const evidenceData = {
                                                document_name: doc.document_name,
                                                document_format: doc.document_format,
                                                document_id: doc.document_id,
                                                internal_audit: this.generalForm.value.id,
                                                audit_mark: this.generalForm.value.markID,
                                              };
                                              this.internalAuditService
                                                .create_internal_audit_multiple_evidence_before(evidenceData, actionID)
                                                .subscribe({
                                                  next: (response: any) => {

                                                  },
                                                  error: (error: any) => {
                                                  },
                                                  complete: () => {
                                                    this.get_audit_marks();
                                                    this.get_action_plan();
                                                  }
                                                });
                                            });
                                          }
                                          else {
                                            this.get_audit_marks();
                                            this.get_action_plan();
                                          }
                                        },
                                      });
                                    });
                                  }
                                  else {
                                    this.get_audit_marks();
                                    this.get_action_plan();
                                  }
                                }
                              },
                              error: (err: any) => { },
                              complete: () => {

                                this.get_audit_marks();
                                this.get_action_plan();

                              },
                            });
                        } else {

                          let createDate: any[] = [];
                          createDate.push({
                            findings: newRemarks,
                            internal_audit: this.generalForm.value.id,
                            priority: remarksresult[0].priority,
                            mark_id: data.id,
                          });

                          this.internalAuditService
                            .create_action_plan(createDate[0])
                            .subscribe({
                              next: (actionplanresult: any) => {

                                if (remarksresult[1].length != 0) {
                                  remarksresult[1].forEach((elem: any) => {
                                    this.evidenceFormData.delete('files');
                                    const extension = elem.name
                                      .split('.')
                                      .pop()
                                      .toLowerCase();
                                    this.evidenceFormData.append(
                                      'files',
                                      elem,
                                      this.generalForm.value.reference_number +
                                      '.' +
                                      extension
                                    );
                                    this.generalService
                                      .upload(this.evidenceFormData)
                                      .subscribe({
                                        next: (fileresult: any) => {

                                          let evidenceDocument: any[] = [];
                                          evidenceDocument.push({
                                            internal_audit:
                                              this.generalForm.value.id,
                                            audit_mark:
                                              this.generalForm.value.markID,
                                            document_name: fileresult[0].hash,
                                            document_format: extension,
                                            document_id: fileresult[0].id,
                                          });
                                          this.internalAuditService
                                            .create_action_plan_evidence(
                                              evidenceDocument[0],
                                              actionplanresult.data.id
                                            )
                                            .subscribe({
                                              next: (result: any) => {
                                                this.get_audit_marks();
                                                this.get_action_plan();
                                                Swal.close()
                                              },
                                              error: (err: any) => { },
                                              complete: () => {

                                                if (remarksresult[2].length != 0) {
                                                  this.multipleEvidenceArray = [];
                                                  remarksresult[2].forEach((elem: any) => {
                                                    this.MultipleEvidenceData.delete('files');
                                                    const extension = elem.name.split('.').pop().toLowerCase();
                                                    this.MultipleEvidenceData.append(
                                                      'files',
                                                      elem,
                                                      this.generalForm.value.reference_number + '.' + extension
                                                    );
                                                    this.generalService.upload(this.MultipleEvidenceData).subscribe({
                                                      next: (evidenceresult: any) => {

                                                        this.multipleEvidenceArray.push({
                                                          document_name: evidenceresult[0].hash,
                                                          document_format: extension,
                                                          document_id: evidenceresult[0].id,

                                                        })

                                                      },
                                                      error: (err: any) => { },
                                                      complete: () => {

                                                        if (this.multipleEvidenceArray.length === remarksresult[2].length) {

                                                          this.multipleEvidenceArray.forEach((doc) => {
                                                            const evidenceData = {
                                                              document_name: doc.document_name,
                                                              document_format: doc.document_format,
                                                              document_id: doc.document_id,
                                                              internal_audit: this.generalForm.value.id,
                                                              audit_mark: this.generalForm.value.markID,
                                                            };
                                                            this.internalAuditService
                                                              .create_internal_audit_multiple_evidence_before(evidenceData, actionplanresult.data.id)
                                                              .subscribe({
                                                                next: (response: any) => {

                                                                },
                                                                error: (error: any) => {

                                                                },
                                                                complete: () => {
                                                                  this.get_audit_marks();
                                                                  this.get_action_plan();
                                                                }
                                                              });
                                                          });
                                                        }
                                                        else {
                                                          this.get_audit_marks();
                                                          this.get_action_plan();
                                                        }
                                                      },
                                                    });
                                                  });
                                                }

                                              },
                                            });
                                        },
                                        error: (err: any) => { },
                                        complete: () => { },
                                      });
                                  });
                                }
                              },
                              error: (err: any) => { },
                              complete: () => {
                                this.get_audit_marks();
                                this.get_action_plan();

                                Swal.close();
                              },
                            });
                        }
                      },
                      error: (err: any) => { },
                      complete: () => { },
                    });
                },
              });

            Swal.close();
          } else {
            this.get_audit_marks();
            this.get_action_plan();

            Swal.close();
          }
        });
      }

    }
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

  updateActionPlan(data: any) {
    this.router.navigate([
      '/apps/audit-inspection/internal-audit/update-action-plan/' + data.id,
    ]);
  }

  viewActionPlan(data: any) {
    this.router.navigate(["/apps/audit-inspection/internal-audit/view-action-plan/" + data.id])
  }

  auditSummary() {
    this.audit_summary = [];
    //social
    const socialCheckList = this.auditMarks.filter((elem: any) => {
      return elem.attributes.category === 'Labor';
    });

    const laborTotalMarks = Number(socialCheckList.length) * 3;
    const laborEarnedMarks = socialCheckList.reduce(
      (acc, cur) => acc + Number(cur.attributes.audit_mark),
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
      (acc, cur) => acc + Number(cur.attributes.audit_mark),
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
      (acc, cur) => acc + Number(cur.attributes.audit_mark),
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
      (acc, cur) => acc + Number(cur.attributes.audit_mark),
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
      (acc, cur) => acc + Number(cur.attributes.audit_mark),
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

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  startLaborAudit() {
    const status = 'In Progress';
    this.showProgressPopup();
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
          Swal.close();
          this.get_audit_details();
        },
      });
  }

  startHealthAudit() {
    const status = 'In Progress';
    this.showProgressPopup();
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
          Swal.close();
          this.get_audit_details();
        },
      });
  }

  startEnvironAudit() {
    const status = 'In Progress';
    this.showProgressPopup();
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
          Swal.close();
          this.get_audit_details();
        },
      });
  }
  // Management system
  startManagementAudit() {
    const status = 'In Progress';
    this.showProgressPopup();
    this.internalAuditService
      .start_management_audit(this.generalForm.value.id, status)
      .subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          const statusText = 'Management Audit Started';
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          Swal.close();
          this.get_audit_details();
        },
      });
  }

  startSecurityAudit() {
    const status = 'In Progress';
    this.showProgressPopup();
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
          Swal.close();
          this.get_audit_details();
        },
      });
  }

  update_pending_audit(event: any) {
    if (event === 'labor') {
      this.pending_audit = [];
      this.generalForm.controls['labor_audit_status'].setValue('Completed')
      if (this.generalForm.value.health_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Health');
      }
      if (this.generalForm.value.environment_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Environment');
      }
      if (this.generalForm.value.management_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Management');
      }
      if (this.generalForm.value.security_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Security');
      }
    } else if (event === 'health') {
      this.pending_audit = [];
      this.generalForm.controls['health_audit_status'].setValue('Completed')
      if (this.generalForm.value.labor_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Social');
      }
      if (this.generalForm.value.environment_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Environment');
      }
      if (this.generalForm.value.management_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Management');
      }
      if (this.generalForm.value.security_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Security');
      }
    } else if (event === 'environment') {
      this.pending_audit = [];
      this.generalForm.controls['environment_audit_status'].setValue('Completed')
      if (this.generalForm.value.labor_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Social');
      }
      if (this.generalForm.value.health_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Health');
      }
      if (this.generalForm.value.management_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Management');
      }
      if (this.generalForm.value.security_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Security');
      }
    } else if (event === 'management') {
      this.pending_audit = [];
      this.generalForm.controls['management_audit_status'].setValue('Completed')
      if (this.generalForm.value.labor_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Social');
      }
      if (this.generalForm.value.health_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Health');
      }
      if (this.generalForm.value.environment_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Environment');
      }
      if (this.generalForm.value.security_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Security');
      }
    } else if (event === 'security') {
      this.pending_audit = [];
      this.generalForm.controls['security_audit_status'].setValue('Completed')
      if (this.generalForm.value.labor_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Social');
      }
      if (this.generalForm.value.health_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Health');
      }
      if (this.generalForm.value.environment_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Environment');
      }
      if (this.generalForm.value.management_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Management');
      }


    }
    else if (event === 'open labor') {
      this.pending_audit = [];
      if (this.generalForm.value.health_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Health');
      }
      if (this.generalForm.value.environment_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Environment');
      }
      if (this.generalForm.value.management_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Management');
      }
      if (this.generalForm.value.security_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Security');
      }
      if (this.generalForm.value.labor_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Labor');
      }

    }
    else if (event === 'open health') {
      this.pending_audit = [];
      if (this.generalForm.value.labor_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Labor');
      }
      if (this.generalForm.value.environment_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Environment');
      }
      if (this.generalForm.value.management_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Management');
      }
      if (this.generalForm.value.security_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Security');
      }

      if (this.generalForm.value.health_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Health');
      }
    }
    else if (event === 'open environment') {
      this.pending_audit = [];
      if (this.generalForm.value.health_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Health');
      }
      if (this.generalForm.value.labor_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Labor');
      }
      if (this.generalForm.value.management_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Management');
      }
      if (this.generalForm.value.security_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Security');
      }
      if (this.generalForm.value.environment_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Environment');
      }

    }
    else if (event === 'open management') {
      this.pending_audit = [];
      if (this.generalForm.value.labor_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Labor');
      }
      if (this.generalForm.value.environment_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Environment');
      }
      if (this.generalForm.value.health_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Health');
      }
      if (this.generalForm.value.security_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Security');
      }
      if (this.generalForm.value.management_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Management');
      }

    }
    else if (event === 'open security') {
      this.pending_audit = [];
      this.pending_audit.push('Security');
      if (this.generalForm.value.labor_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Labor');
      }
      if (this.generalForm.value.environment_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Environment');
      }
      if (this.generalForm.value.management_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Management');
      }
      if (this.generalForm.value.health_audit_status === 'Completed') {
      } else {
        this.pending_audit.push('Health');
      }


    }

    this.pendingPercent(event);
  }

  //pending percentage
  pendingPercent(event: any) {
    this.generalForm.controls['pending_percentage'].setValue(
      Number(100) - Number(this.pending_audit.length / 5) * Number(100)
    );
    this.pendingColor(event);
  }

  //pending color code
  pendingColor(event: any) {
    if (this.generalForm.value.pending_percentage <= 20) {
      this.generalForm.controls['pending_color_code'].setValue('danger');
      if (event === 'labor') {
        this.laborAudCompleted();
      } else if (event === 'health') {
        this.healthAudCompleted();
      } else if (event === 'environment') {
        this.environAudCompleted();
      } else if (event === 'management') {
        this.managementAudCompleted();
      } else if (event === 'security') {
        this.securityAudCompleted();
      }
      else if (event === 'open labor') {
        this.laborAudReopen();
      } else if (event === 'open health') {
        this.healthAudReopen();
      } else if (event === 'open environment') {
        this.environAudReopen();
      } else if (event === 'open management') {
        this.managementAudReopen();
      } else if (event === 'open security') {
        this.securityAudReopen();
      }
    } else if (this.generalForm.value.pending_percentage <= 40) {
      this.generalForm.controls['pending_color_code'].setValue('warning');
      if (event === 'labor') {
        this.laborAudCompleted();
      } else if (event === 'health') {
        this.healthAudCompleted();
      } else if (event === 'environment') {
        this.environAudCompleted();
      } else if (event === 'management') {
        this.managementAudCompleted();
      } else if (event === 'security') {
        this.securityAudCompleted();
      }
      else if (event === 'open labor') {
        this.laborAudReopen();
      } else if (event === 'open health') {
        this.healthAudReopen();
      } else if (event === 'open environment') {
        this.environAudReopen();
      } else if (event === 'open management') {
        this.managementAudReopen();
      } else if (event === 'open security') {
        this.securityAudReopen();
      }
    } else if (this.generalForm.value.pending_percentage <= 60) {
      this.generalForm.controls['pending_color_code'].setValue('info');
      if (event === 'labor') {
        this.laborAudCompleted();
      } else if (event === 'health') {
        this.healthAudCompleted();
      } else if (event === 'environment') {
        this.environAudCompleted();
      } else if (event === 'management') {
        this.managementAudCompleted();
      } else if (event === 'security') {
        this.securityAudCompleted();
      }
      else if (event === 'open labor') {
        this.laborAudReopen();
      } else if (event === 'open health') {
        this.healthAudReopen();
      } else if (event === 'open environment') {
        this.environAudReopen();
      } else if (event === 'open management') {
        this.managementAudReopen();
      } else if (event === 'open security') {
        this.securityAudReopen();
      }
    } else if (this.generalForm.value.pending_percentage <= 80) {
      this.generalForm.controls['pending_color_code'].setValue('primary');
      if (event === 'labor') {
        this.laborAudCompleted();
      } else if (event === 'health') {
        this.healthAudCompleted();
      } else if (event === 'environment') {
        this.environAudCompleted();
      } else if (event === 'management') {
        this.managementAudCompleted();
      } else if (event === 'security') {
        this.securityAudCompleted();
      }
      else if (event === 'open labor') {
        this.laborAudReopen();
      } else if (event === 'open health') {
        this.healthAudReopen();
      } else if (event === 'open environment') {
        this.environAudReopen();
      } else if (event === 'open management') {
        this.managementAudReopen();
      } else if (event === 'open security') {
        this.securityAudReopen();
      }
    } else if (this.generalForm.value.pending_percentage <= 100) {
      this.generalForm.controls['pending_color_code'].setValue('success');
      if (event === 'labor') {
        this.laborAudCompleted();
      } else if (event === 'health') {
        this.healthAudCompleted();
      } else if (event === 'environment') {
        this.environAudCompleted();
      } else if (event === 'management') {
        this.managementAudCompleted();
      } else if (event === 'security') {
        this.securityAudCompleted();
      }
      else if (event === 'open labor') {
        this.laborAudReopen();
      } else if (event === 'open health') {
        this.healthAudReopen();
      } else if (event === 'open environment') {
        this.environAudReopen();
      } else if (event === 'open management') {
        this.managementAudReopen();
      } else if (event === 'open security') {
        this.securityAudReopen();
      }
    }
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
        this.showProgressPopup();
        const status = 'Completed';
        this.showProgressPopup();
        const pendingAsString = this.pending_audit.join(', ');
        const pendingPer = this.generalForm.value.pending_percentage;
        const pendingColor = this.generalForm.value.pending_color_code;
        this.internalAuditService
          .start_labor_pending_audit(
            this.generalForm.value.id,
            status,
            pendingAsString,
            pendingPer,
            pendingColor
          )
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Labor Audit Completed';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.close();
              this.get_audit_details();
            },
          });
      }
      else {
        this.generalForm.controls['labor_audit_status'].setValue('In Progress')
        Swal.close()
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
      confirmButtonColor: '#3085D6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        const status = 'Completed';
        this.showProgressPopup();
        const pendingAsString = this.pending_audit.join(', ');
        const pendingPer = this.generalForm.value.pending_percentage;
        const pendingColor = this.generalForm.value.pending_color_code;
        this.internalAuditService
          .start_health_pending_audit(
            this.generalForm.value.id,
            status,
            pendingAsString,
            pendingPer,
            pendingColor
          )
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Health Audit Completed';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.close();
              this.get_audit_details();
            },
          });
      }
      else {
        this.generalForm.controls['health_audit_status'].setValue('In Progress')
        Swal.close()
      }
    });
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

  //createAction
  createAction() {

    const AudID = this.route.snapshot.paramMap.get('id');
    this.internalAuditService
      .get_internal_audit_resgiter_search(AudID)
      .subscribe({
        next: (result: any) => {
          const id = result.data[0].id;
          const reference = result.data[0].attributes.reference_number;
          this.dialog
            .open(ActionPlanComponent, {
              data: { audid: id, reference: reference }, width: '700px'
            })
            .afterClosed()
            .subscribe((data) => {
              if (data) {
                this.get_audit_details();
              }
            });
        },
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
        this.showProgressPopup();
        const pendingAsString = this.pending_audit.join(', ');
        const pendingPer = this.generalForm.value.pending_percentage;
        const pendingColor = this.generalForm.value.pending_color_code;
        this.internalAuditService
          .start_environ_pending_audit(
            this.generalForm.value.id,
            status,
            pendingAsString,
            pendingPer,
            pendingColor
          )
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Environment Audit Completed';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.close();
              this.get_audit_details();
            },
          });
      }
      else {
        this.generalForm.controls['environment_audit_status'].setValue('In Progress')
        Swal.close()
      }
    });
  }

  managementAudCompleted() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the management audit has completed. If completed, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to cancel the process.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        const status = 'Completed';
        this.showProgressPopup();
        const pendingAsString = this.pending_audit.join(', ');
        const pendingPer = this.generalForm.value.pending_percentage;
        const pendingColor = this.generalForm.value.pending_color_code;
        this.internalAuditService
          .start_management_pending_audit(
            this.generalForm.value.id,
            status,
            pendingAsString,
            pendingPer,
            pendingColor
          )
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Management Audit Completed';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.close();
              this.get_audit_details();
            },
          });
      }
      else {
        this.generalForm.controls['management_audit_status'].setValue('In Progress')
        Swal.close()
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
        this.showProgressPopup();
        const pendingAsString = this.pending_audit.join(', ');
        const pendingPer = this.generalForm.value.pending_percentage;
        const pendingColor = this.generalForm.value.pending_color_code;
        this.internalAuditService
          .start_security_pending_audit(
            this.generalForm.value.id,
            status,
            pendingAsString,
            pendingPer,
            pendingColor
          )
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Security Audit Completed';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.close();
              this.get_audit_details();
            },
          });
      }
      else {
        this.generalForm.controls['security_audit_status'].setValue('In Progress')
        Swal.close()
      }
    });
  }

  laborAudReopen() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the labor audit has reopened. If reopened, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to cancel the process.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.showProgressPopup();
        const status = 'In Progress';
        this.showProgressPopup();
        const pendingAsString = this.pending_audit.join(', ');
        const pendingPer = this.generalForm.value.pending_percentage;
        const pendingColor = this.generalForm.value.pending_color_code;
        this.internalAuditService
          .start_labor_pending_audit(
            this.generalForm.value.id,
            status,
            pendingAsString,
            pendingPer,
            pendingColor
          )
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Labor Audit Reopened';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.close();
              this.get_audit_details();
            },
          });
      }
    });
  }

  healthAudReopen() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the health audit has reopened. If reopened, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to cancel the process.",
      showCancelButton: true,
      confirmButtonColor: '#3085D6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        const status = 'In Progress';
        this.showProgressPopup();
        const pendingAsString = this.pending_audit.join(', ');
        const pendingPer = this.generalForm.value.pending_percentage;
        const pendingColor = this.generalForm.value.pending_color_code;
        this.internalAuditService
          .start_health_pending_audit(
            this.generalForm.value.id,
            status,
            pendingAsString,
            pendingPer,
            pendingColor
          )
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Health Audit Reopened';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.close();
              this.get_audit_details();
            },
          });
      }
    });
  }

  environAudReopen() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the environment audit has reopened. If reopened, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to cancel the process.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        const status = 'In Progress';
        this.showProgressPopup();
        const pendingAsString = this.pending_audit.join(', ');
        const pendingPer = this.generalForm.value.pending_percentage;
        const pendingColor = this.generalForm.value.pending_color_code;
        this.internalAuditService
          .start_environ_pending_audit(
            this.generalForm.value.id,
            status,
            pendingAsString,
            pendingPer,
            pendingColor
          )
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Environment Audit Reopened';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.close();
              this.get_audit_details();
            },
          });
      }
    });
  }

  managementAudReopen() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the management audit has reopened. If reopened, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to cancel the process.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        const status = 'In Progress';
        this.showProgressPopup();
        const pendingAsString = this.pending_audit.join(', ');
        const pendingPer = this.generalForm.value.pending_percentage;
        const pendingColor = this.generalForm.value.pending_color_code;
        this.internalAuditService
          .start_management_pending_audit(
            this.generalForm.value.id,
            status,
            pendingAsString,
            pendingPer,
            pendingColor
          )
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Management Audit Reopened';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.close();
              this.get_audit_details();
            },
          });
      }
    });
  }

  securityAudReopen() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the security audit has reopened. If reopened, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to cancel the process.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        const status = 'In Progress';
        this.showProgressPopup();
        const pendingAsString = this.pending_audit.join(', ');
        const pendingPer = this.generalForm.value.pending_percentage;
        const pendingColor = this.generalForm.value.pending_color_code;
        this.internalAuditService
          .start_security_pending_audit(
            this.generalForm.value.id,
            status,
            pendingAsString,
            pendingPer,
            pendingColor
          )
          .subscribe({
            next: (err: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = 'Security Audit Reopened';
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.close();
              this.get_audit_details();
            },
          });
      }
    });
  }

  markAsCompleted() {
    const id = this.generalForm.value.id;
    this.showProgressPopup();
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

  onSelect(event: any) {
    const fileLength = this.files.length;
    const addedLength = event.addedFiles.length;
    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / (1024 * 1024); // Convert bytes to megabytes
      if (size > 20) {
        const statusText = "Please choose a document below 20 MB";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        const fileTypes = ['jpg', 'jpeg', 'png']; // Include image extensions
        const extension = event.addedFiles[0].name.split('.').pop().toLowerCase();
        const isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.files.push(...event.addedFiles);
          this.generalForm.controls['cover_photo'].setErrors(null);
          this.upload_CoverImage();
        } else {
          const statusText = "Please choose images ('jpg', 'jpeg', 'png')";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }

    } else if (fileLength < 6) {
      const statusText = "You have exceeded the upload limit";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length === 0) {
      this.generalForm.controls['cover_photo'].reset()
    }

    if (this.coverPhotoData != null) {
      this.deleteCoverImage();
    }
  }

  upload_CoverImage() {
    this.showProgressPopup();
    this.files.forEach((elem: any) => {
      this.coverPhotoFormData.delete('files');
      const extension = elem.name.split('.').pop().toLowerCase();
      this.coverPhotoFormData.append(
        'files',
        elem,
        this.generalForm.value.reference_number + '.' + extension
      );
      this.generalService.upload(this.coverPhotoFormData).subscribe({
        next: (result: any) => {
          let data: any[] = [];
          data.push({
            coverImage_name: result[0].hash,
            format: extension,
            internal_audit: this.generalForm.value.id,
            id: result[0].id,
          });
          this.internalAuditService.create_audit_coverpage_image(data[0]).subscribe({
            next: (result: any) => {
            },
            error: (err: any) => { },
            complete: () => { },
          });
        },
        error: (err: any) => { },
        complete: () => {
          const statusText = "Cover Image updated"
          this._snackBar.open(statusText, 'Close', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          Swal.close()
        },
      });
    });
  }

  deleteCoverImage() {
    const coverImageID = this.generalForm.value.cover_photo_id
    this.showProgressPopup();
    this.internalAuditService.delete_audit_coverpage_image(coverImageID).subscribe({
      next: (result: any) => {
        this.generalService.delete_image(result.data.attributes.cover_photo_id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Cover Image deleted"
            this._snackBar.open(statusText, 'Close', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_audit_details()
          }
        })
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
  }

  getFacilityPhoto() {
    this.facilityPhotoList = []
    this.internalAuditService.get_audit_multiplefacilityphoto(this.generalForm.value.id).subscribe({
      next: (result: any) => {
        // this.facilityPhotoList = result.data
        if (result.data.length > 0) {
          result.data.forEach((data: any) => {

            this.facilityPhotoList.push({
              src: environment.client_backend + '/uploads/' + data.attributes.evidence_name + '.' + data.attributes.format,
              caption: "Facility Photo",
              thumb: environment.client_backend + '/uploads/' + data.attributes.evidence_name + '.' + data.attributes.format,
              title: data.attributes.title
            })

            // this.generalService.getImage(environment.client_backend + '/uploads/' + data.attributes.evidence_name + '.' + data.attributes.format).subscribe((imgdata: any) => {
            //   this.facilityPhotoList.push({
            //     evidence_name: data.attributes.evidence_name,
            //     format: data.attributes.format,
            //     evidence_id: data.attributes.image_id,
            //     title: data.attributes.title,
            //     file: imgdata,
            //     id: data.id
            //   })
            // })

          })
        }

      },
      error: (err: any) => { },
      complete: () => {
      },
    })
  }

  uploadFacilityPhoto(photoList: any) {
    if (photoList) {
      this.MultipleFacilityPhotoFormData.delete('files');
      const extension = photoList.file.name.split('.').pop().toLowerCase();
      this.MultipleFacilityPhotoFormData.append(
        'files',
        photoList.file,
        this.generalForm.value.reference_number + '.' + extension
      );
      this.multipleFacilityPhotoArray = []
      this.generalService.upload(this.MultipleFacilityPhotoFormData).subscribe({
        next: (evidenceresult: any) => {

          this.multipleFacilityPhotoArray.push({
            evidence_name: evidenceresult[0].hash,
            format: extension,
            evidence_id: evidenceresult[0].id,
            title: photoList.title,
            internal_audit: this.generalForm.value.id,
          })
        },
        error: (err: any) => { },
        complete: () => {

          this.internalAuditService.create_audit_multiplefacilityphoto(this.multipleFacilityPhotoArray[0]).subscribe({
            next: (result: any) => {
              // if (result.data.length > 0) {
              //   result.data.forEach((data: any) => {
              //     this.generalService.getImage(environment.client_backend + '/uploads/' + data.attributes.evidence_name + '.' + data.attributes.format).subscribe((imgdata: any) => {
              //       this.facilityPhotoList.push({
              //         evidence_name: data.attributes.evidence_name,
              //         format: data.attributes.format,
              //         evidence_id: data.attributes.image_id,
              //         title: data.attributes.title,
              //         file: imgdata,
              //         id: data.id
              //       })
              //     })

              //   })
              // }
            },
            error: (err: any) => { },
            complete: () => {
              this.get_audit_details()

              const statusText = "Multiple facilty photo updated"
              this._snackBar.open(statusText, 'Close', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.close()
            },
          });

        },
      });
    }

  }


  uploadEvidence() {
    this.dialog.open(UploadFacilityPhotoComponent, {
      width: '50%'
      // data: { documentInfo: documentInfo },
    }).afterClosed().subscribe((result) => {
      if (result && result.length === 2) {
        const metadata = result[0]; // object with title, file_name, etc.
        const file = result[1];     // File object

        const format = file.type.split('/')[1];
        const src = URL.createObjectURL(file); // creates temporary blob URL

        if (this.facilityPhotoList.length < 6) {

          // this.facilityPhotoList.push({
          //   ...metadata,
          //   format: format,
          //   src: src,
          //   file: file,
          //   file_name: file.name
          // });

          let photoList = {
            ...metadata,
            format: format,
            src: src,
            file: file,
            file_name: file.name
          }

          this.uploadFacilityPhoto(photoList)

        } else {
          const statusText = "You have exceeded the upload limit";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }


      }
    });
  }

  deleteImage(dataId: number) {
    this.showProgressPopup();
    this.internalAuditService.delete_audit_multiplefacilityphoto(dataId).subscribe({
      next: (result: any) => {
        this.generalService.delete_image(result.data.attributes.image_id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Facility photo deleted"
            this._snackBar.open(statusText, 'Close', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_audit_details()
          }
        })
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
      }
    })
  }

  openFacilityPhote(index: number): void {
    this._lightbox.open(this.facilityPhotoList, index);
  }

  openPdf(file: any) {
    // Case 1: Base64-encoded PDF string
    if (typeof file === 'string' && file.startsWith('data:application/pdf')) {
      const byteString = atob(file.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const intArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([intArray], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    }

    // Case 2: Blob or File object
    else if (file instanceof Blob || file instanceof File) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }

    // Case 3: Direct URL string
    else if (typeof file === 'string') {
      window.open(file, '_blank');
    }

    // Case 4: Invalid type
    else {
      console.error('Unsupported file format:', file);
    }
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
