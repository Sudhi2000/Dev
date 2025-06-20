import { Component, Input, NgModule, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, filter } from 'rxjs';
import { FeatherIconDirective } from 'src/app/core/feather-icon/feather-icon.directive';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';
import { SchedulerService } from 'src/app/services/scheduler.api.service';
import { ListColumn, ehs, question, satisfactionsurvey } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-survey-history',
  templateUrl: './survey-history.component.html',
  styleUrls: ['./survey-history.component.scss']
})
export class SurveyHistoryComponent implements OnInit {

  corporateUser: any
  satisfactionsurveys: any[] = []
  orgID: string
  serachReference: any = ""
  unitSpecific: any
  userDivision: any

  subject$: ReplaySubject<satisfactionsurvey[]> = new ReplaySubject<satisfactionsurvey[]>(1);
  data$: Observable<satisfactionsurvey[]> = this.subject$.asObservable();
  questions: satisfactionsurvey[];

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  modifyAllowed: boolean = false
  userID: Number
  SurveyCreatedUserId: any;


  @Input()
  columns: ListColumn[] = [

    // { name: 'Date', property: 'created_date', visible: true, isModelProperty: true }, business_unit
    { name: 'Survey ID', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Survey Type', property: 'survey_type', visible: true, isModelProperty: true },
    { name: 'Survey Category', property: 'survey_category', visible: true, isModelProperty: true },
    { name: 'Survey Title', property: 'survey_title', visible: true, isModelProperty: true },
    // { name: 'Business Unit', property: 'business_unit', visible: true, isModelProperty: true },
    { name: 'Survey Duration', property: 'start_date', visible: true, isModelProperty: true },
    // { name: 'Freequency', property: 'frequency', visible: true, isModelProperty: true },
    { name: 'Participant Count', property: 'participant_count', visible: true, isModelProperty: true },
    // { name: 'Response Options', property: 'response_options', visible: true, isModelProperty: true },
    { name: 'Response Count', property: 'res_count', visible: true, isModelProperty: true },
    { name: 'Completion Rate', property: 'compl_rate', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Created By', property: 'created_user', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];
  pageSize = 10;
  isLoading = true;
  dataSource: MatTableDataSource<satisfactionsurvey>;
  totalItems = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    public dialog: MatDialog,
    private scheduler: SchedulerService,
    private _snackBar: MatSnackBar,
    private satisfactionService: SatisfactionService,
  ) { }

  ngOnInit(): void {
    this.configuration()
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((questions) => {
      this.satisfactionsurveys = questions;
      this.dataSource.data = questions;

    });
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.satisfaction_survey
        if (status === false) {
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

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.userID = result.id
        const status = result.survey_history
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_survey_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            }
            else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_survey_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            this.get_survey_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  generate() {
    if (this.serachReference == '') {
      this.reset();
    }
    else {
      this.isLoading = true;
      if (this.unitSpecific && !this.corporateUser) {
        this.satisfactionService.get_unit_specific_survey_history_search(this.serachReference, this.userDivision).subscribe({
          next: (result: any) => {
            const data = result.data.map((elem: any) => elem.attributes);
            this.satisfactionsurveys = data
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            this.isLoading = false;
            this.prepareView()
          }
        })
      }
      else {
        this.satisfactionService.get_survey_history_search(this.serachReference).subscribe({
          next: (result: any) => {
            const data = result.data.map((elem: any) => elem.attributes);
            this.satisfactionsurveys = data
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            this.isLoading = false;
            this.prepareView()
          }
        })

      }
    }
  }

  private prepareView() {
    this.dataSource = new MatTableDataSource<satisfactionsurvey>(this.satisfactionsurveys);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  modify(data: any) {
    this.router.navigate(["/apps/satisfaction-survey/modify-survey/" + data.reference_id])
  }

  completed(data: any) {
    this.router.navigate(["/apps/satisfaction-survey/survey-action/" + data.reference_id])
   }

   public(data: any) {    
    this.router.navigate(["/satisfaction-survey/public-survey/"+ data.reference_id]);
   }

  view(data: any) {
    this.router.navigate(["/apps/satisfaction-survey/view-survey/" + data.reference_id])
  }


  truncateString(str: string, maxLength: number) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  }

  email(data: any) { }

  reset() {
    this.serachReference = ''
    this.ngOnInit()
  }

  get_unit_specific_survey_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
  
    this.satisfactionService.get_unit_specific_survey_history(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {  
        const filteredData = result.data
          .filter((elem: any) => {
            const attrs = elem.attributes;
            const surveyType = attrs.survey_type;
            const isCreator = attrs.created_user?.data?.id == this.userID;
  
            const participants = attrs.survey_participants?.data || [];
            const isParticipant = participants.some((p: any) => p.attributes?.user_id == this.userID);
  
            if (surveyType === 'Public') {
              return isCreator;
            } else if (surveyType === 'Private') {
              return isCreator || isParticipant;
            }
  
            return false;
          })
          .map((elem: any) => {
            const truncatedTitle = this.truncateString(elem.attributes.survey_title, 10);
            return { ...elem.attributes, survey_title: truncatedTitle };
          });
        this.satisfactionsurveys.splice(startIndex, endIndex, ...filteredData);
        this.totalItems = filteredData.length;
  
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        });
      },
      error: (err: any) => {
        // this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.isLoading = false;
        this.prepareView();
      }
    });
  }
  
  

  get_survey_history(pageEvent: PageEvent) {
    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
  
    this.satisfactionService.get_survey_history(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {  
        const filteredData = result.data
          .filter((elem: any) => {
            const attrs = elem.attributes;
            const surveyType = attrs.survey_type;
            const isCreator = attrs.created_user?.data?.id == this.userID;
  
            const participants = attrs.survey_participants?.data || [];
            const isParticipant = participants.some((p: any) => p.attributes?.user_id == this.userID);
  
            if (surveyType === 'Public') {
              return isCreator;
            } else if (surveyType === 'Private') {
              return isCreator || isParticipant;
            }
  
            return false;
          })
          .map((elem: any) => elem.attributes);
  
        this.satisfactionsurveys.splice(startIndex, endIndex, ...filteredData);
        this.totalItems = filteredData.length;
  
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        });
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"]);
      },
      complete: () => {
        this.isLoading = false;
        this.prepareView();
      }
    });
  }
  

  SurveyStatus(status: string): string {

    const draft = "btn-secondary"
    const  active= "btn-success"
    const  inactive= "btn-primary"
    switch(status.toLowerCase()) {
      case 'scheduled':
        return 'btn-primary';
      case 'draft':
        return 'btn-warning';
      case 'in progress':
        return 'btn-secondary';
      case 'completed':
        return 'btn-success';
      default:
        return '';
    }
  }

}
