import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';
import { SchedulerService } from 'src/app/services/scheduler.api.service';
import { ListColumn, ehs, question, surveyquestion } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question-history',
  templateUrl: './question-history.component.html',
  styleUrls: ['./question-history.component.scss']
})
export class QuestionHistoryComponent implements OnInit {

  corporateUser: any
  surveyquestions: any[] = []
  orgID: string
  serachReference: any = ""
  unitSpecific: any
  userDivision: any

  subject$: ReplaySubject<surveyquestion[]> = new ReplaySubject<surveyquestion[]>(1);
  data$: Observable<surveyquestion[]> = this.subject$.asObservable();
  questions: surveyquestion[];

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  @Input()
  columns: ListColumn[] = [

    // { name: 'Date', property: 'created_date', visible: true, isModelProperty: true },
    { name: 'Question ID', property: 'reference_number', visible: true, isModelProperty: true },
    { name: 'Question', property: 'question', visible: true, isModelProperty: true },
    //{ name: 'Question Type', property: 'question_type', visible: true, isModelProperty: true },
    { name: 'Question Category', property: 'question_category', visible: true, isModelProperty: true },
    // { name: 'Survey Category', property: 'survey_category', visible: true, isModelProperty: true },
    // { name: 'Response Option', property: 'response_options', visible: true, isModelProperty: true },
    // { name: 'Question Weightage', property: 'question_weighting', visible: true, isModelProperty: true },
    { name: 'Creation Date', property: 'createdAt', visible: true, isModelProperty: true },
    { name: 'Last Modified Date', property: 'updatedAt', visible: true, isModelProperty: true },
    { name: 'Created By', property: 'created_user', visible: true, isModelProperty: true },
    { name: 'Status', property: 'status', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },

  ] as ListColumn[];
  pageSize = 10;
  isLoading = true;
  dataSource: MatTableDataSource<surveyquestion>;
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
      this.surveyquestions = questions;
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
        const status = result.question_history
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_question_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            }
            else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_question_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
            }
          }
          else {
            this.get_question_history({ pageIndex: 0, pageSize: this.pageSize, length: 0 })
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
        this.satisfactionService.get_unit_specific_question_history_search(this.serachReference, this.userDivision).subscribe({
          next: (result: any) => {
            const data = result.data.map((elem: any) => elem.attributes);
            this.surveyquestions = data
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
        this.satisfactionService.get_question_history_search(this.serachReference).subscribe({
          next: (result: any) => {
            const data = result.data.map((elem: any) => elem.attributes);
            this.surveyquestions = data
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
    this.dataSource = new MatTableDataSource<surveyquestion>(this.surveyquestions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  modify(data: any) {
    console.log(data);
    
    this.router.navigate(["/apps/satisfaction-survey/modify-question/" + data.reference_number])
  }

  print(data: any) { }

  view(data: any) {
    this.router.navigate(["/apps/satisfaction-survey/view-question/" + data.reference_number])
  }

  email(data: any) { }

  reset() {
    this.serachReference = ''
    this.ngOnInit()
  }

  get_unit_specific_question_history(pageEvent: PageEvent) {

    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.satisfactionService.get_unit_specific_question_history(startIndex, pageEvent.pageSize, this.userDivision).subscribe({
      next: (result: any) => {

        const data = result.data.map((elem: any) => {
          const questionWithoutHTML = this.removeHTMLTags(elem.attributes.question);
          const truncatedQuestion = this.truncateString(questionWithoutHTML, 60);
          return { ...elem.attributes, question: truncatedQuestion };
        });
        this.surveyquestions.splice(startIndex, endIndex, ...data);
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        })
      },
      error: (err: any) => {
        // this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.isLoading = false;
        this.prepareView()
      }
    })
  }

  get_question_history(pageEvent: PageEvent) {

    this.isLoading = true;
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    this.satisfactionService.get_question_history(startIndex, pageEvent.pageSize).subscribe({
      next: (result: any) => {

        const data = result.data.map((elem: any) => {
          const questionWithoutHTML = this.removeHTMLTags(elem.attributes.question);
          const truncatedQuestion = this.truncateString(questionWithoutHTML, 60);
          return { ...elem.attributes, question: truncatedQuestion };
        });
        this.surveyquestions.splice(startIndex, endIndex, ...data);
        this.totalItems = result.meta.pagination.total;
        setTimeout(() => {
          this.paginator.pageIndex = startIndex / pageEvent.pageSize;
          this.paginator.length = this.totalItems;
        })
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

  removeHTMLTags(str: string) {
    return str.replace(/<[^>]*>?/gm, '');
  }

  truncateString(str: string, maxLength: number) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  }

  QuestionStatus(data: any) { 

    const draft = "btn-secondary"
    const  active= "btn-success"
    const  inactive= "btn-primary"
    if (data === "Active") {
      return active
    } else if (data === "Draft") {
      return draft
    } 
    else if (data === "Inactive") {
      return inactive
    } 
    else {
      return
    }
  }

}
