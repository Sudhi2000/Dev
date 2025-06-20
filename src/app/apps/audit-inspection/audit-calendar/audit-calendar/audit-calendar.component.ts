import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { Draggable } from '@fullcalendar/interaction'; // for dateClick
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.api.service';
import { CelendarService } from 'src/app/services/calendar.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { AuditCalendarDetailsComponent } from './audit-calendar-details/audit-calendar-details.component';
// import { INITIAL_EVENTS, createEventId } from './event-utils';

import { category, calendarEvents, createEventId } from './data';

@Component({
  selector: 'app-audit-calendar',
  templateUrl: './audit-calendar.component.html',
  styleUrls: ['./audit-calendar.component.scss']
})
export class AuditCalendarComponent implements OnInit {
  calendarEvents: any[];
  formData: FormGroup;
  formEditData: FormGroup;
  category: any[];
  auditing: any
  AuditCalendar = new Array()
  extAuditing: any
  submitted = false;
  orgID: any
  unitSpecific: any
  userDivision: any
  corporateUser: any






  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'dayGridMonth,dayGridWeek,dayGridDay',
      center: 'title',
      right: 'prevYear,prev,next,nextYear'
    },
    initialView: "dayGridMonth",
    themeSystem: "bootstrap",
    initialEvents: calendarEvents,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // dateClick: this.openModal.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  currentEvents: EventApi[] = [];



  constructor(private modalService: NgbModal, private generalService: GeneralService, private router: Router,
    private formBuilder: FormBuilder, private authService: AuthService, private apiservice: CelendarService, private dialog: MatDialog) { }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });
    this.formEditData = this.formBuilder.group({
      editTitle: ['', [Validators.required]],
      editCategory: [],
    });
    this.configuration()



  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.audit_inspection
        this.unitSpecific = result.data.attributes.business_unit_specific
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.aud_calendar
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this._fetchData();
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.internal_audit_data()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[business_unit][division_uuid][$in]=' + elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.unit_specific_internal_audit_data()
            }
          } else {

            this.internal_audit_data()
          }



        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }


  internal_audit_data() {
    this.apiservice.get_internal_audits().subscribe({
      next: (result: any) => {
        this.auditing = result.data
        this.auditing.forEach((element: any) => {
          //   const id = element.id
          //   const auditType = "Internal Audit"

          //   const title = element.attributes.title
          //   const start = new Date(element.attributes.start_date)
          //   const end = new Date(element.attributes.end_date)
          //  const color= 'rgba(16,183,89, .25)'



          // this.AuditCalendar.push({ id: id, title: auditType + ': ' + title, start: start, end: end, backgroundColor: color })







          const id = element.id
          const status = element.attributes.status
          const auditType = "Internal Audit"
          const title = element.attributes.title
          const start = new Date(element.attributes.start_date)
          const end = new Date(element.attributes.end_date)
          end.setDate(end.getDate() + 1);
          const color = status === "Approved"
            ? 'rgba(34, 139, 84, 0.3)'
            : 'rgba(144, 238, 144, 0.2)';



          const reference_number = element.attributes.reference_number
          const audit_start = new Date(element.attributes.start_date)
          const audit_end = new Date(element.attributes.end_date)
          const audit_type = "Internal Audit"
          const division = element.attributes.division

          const description = element.attributes.description
          this.AuditCalendar.push({ id: id, title: auditType + ':' + title + ' | ' + 'Division: ' + division, audit_title: title, description: description, reference_number: reference_number, division: division, audit_start: audit_start, audit_end: audit_end, audit_type: audit_type, start: start, end: end, backgroundColor: color, allDay: true })

        });

        this.external_audit_data()


      },
      error: (err: any) => { },
      complete: () => { }
    })


  }
  unit_specific_internal_audit_data() {
    this.apiservice.get_unit_specific_internal_audits(this.userDivision).subscribe({
      next: (result: any) => {
        this.auditing = result.data
        this.auditing.forEach((element: any) => {
          //   const id = element.id
          //   const auditType = "Internal Audit"

          //   const title = element.attributes.title
          //   const start = new Date(element.attributes.start_date)
          //   const end = new Date(element.attributes.end_date)
          //  const color= 'rgba(16,183,89, .25)'



          // this.AuditCalendar.push({ id: id, title: auditType + ': ' + title, start: start, end: end, backgroundColor: color })






          const status = element.attributes.status
          const id = element.id
          const auditType = "Internal Audit"
          const title = element.attributes.title
          const start = new Date(element.attributes.start_date)
          const end = new Date(element.attributes.end_date)
          end.setDate(end.getDate() + 1);
          const color = status === "Approved"
            ? 'rgba(34, 139, 84, 0.3)'
            : 'rgba(144, 238, 144, 0.2)';



          const reference_number = element.attributes.reference_number
          const audit_start = new Date(element.attributes.start_date)
          const audit_end = new Date(element.attributes.end_date)
          const audit_type = "Internal Audit"
          const division = element.attributes.division

          const description = element.attributes.description
          this.AuditCalendar.push({ id: id, title: auditType + ':' + title + ' | ' + 'Division: ' + division, audit_title: title, description: description, reference_number: reference_number, division: division, audit_start: audit_start, audit_end: audit_end, audit_type: audit_type, start: start, end: end, backgroundColor: color, allDay: true })

        });

        this.unit_specific_external_audit_data()


      },
      error: (err: any) => { },
      complete: () => { }
    })


  }

  external_audit_data() {
    this.apiservice.get_external_audits().subscribe({
      next: (result: any) => {
        this.extAuditing = result.data
        this.extAuditing.forEach((element: any) => {
          const id = element.id
          const status = element.attributes.audit_status
          const reference_number = element.attributes.reference_number
          const audit_start = new Date(element.attributes.audit_start_date)
          const audit_end = new Date(element.attributes.audit_end_date)
          const audit_type = "External Audit"
          const auditType = "External Audit"
          const division = element.attributes.division
          const title = element.attributes.customer
          const start = new Date(element.attributes.audit_start_date)
          const end = new Date(element.attributes.audit_end_date)
          end.setDate(end.getDate() + 1);
          //const color = 'rgba(253,126,20,.25)'
          const color = status === "Approved"
            ? 'rgba(234, 138, 23, 0.35)'  // Rich orange, more vibrant but balanced
            : 'rgba(255, 213, 128, 0.25)'; // Soft pale yellow-orange for lighter contrast



          const description = element.attributes.description
          this.AuditCalendar.push({ id: id, title: auditType + ': ' + title + ' | ' + 'Division: ' + division, audit_title: title, description: description, reference_number: reference_number, division: division, audit_start: audit_start, audit_end: audit_end, audit_type: audit_type, start: start, end: end, backgroundColor: color, allDay: true })
        })

        this.calendarOptions = {
          headerToolbar: {
            left: 'dayGridMonth,dayGridWeek,dayGridDay',
            center: 'title',
            right: 'prevYear,prev,next,nextYear'
          },
          initialView: "dayGridMonth",
          themeSystem: "bootstrap",
          events: this.AuditCalendar,
          weekends: true,
          editable: true,
          selectable: true,
          selectMirror: true,
          dayMaxEvents: true,
          displayEventTime: false,
          // dateClick: this.openModal.bind(this),
          eventClick: this.handleEventClick.bind(this),
          eventsSet: this.handleEvents.bind(this)
        };

      },
      error: (err: any) => { },
      complete: () => { }
    })

  }
  unit_specific_external_audit_data() {
    this.apiservice.get_unit_specific_external_audits(this.userDivision).subscribe({
      next: (result: any) => {
        this.extAuditing = result.data
        this.extAuditing.forEach((element: any) => {
          const id = element.id
          const status = element.attributes.audit_status
          const reference_number = element.attributes.reference_number
          const audit_start = new Date(element.attributes.audit_start_date)
          const audit_end = new Date(element.attributes.audit_end_date)
          const audit_type = "External Audit"
          const auditType = "External Audit"
          const division = element.attributes.division
          const title = element.attributes.customer
          const start = new Date(element.attributes.audit_start_date)
          const end = new Date(element.attributes.audit_end_date);
          end.setDate(end.getDate() + 1);

          //const color = 'rgba(253,126,20,.25)'
          const color = status === "Approved"
            ? 'rgba(234, 138, 23, 0.35)'  // Rich orange, more vibrant but balanced
            : 'rgba(255, 213, 128, 0.25)'; // Soft pale yellow-orange for lighter contrast


          const description = element.attributes.description
          this.AuditCalendar.push({ id: id, title: auditType + ': ' + title + ' | ' + 'Division: ' + division, audit_title: title, description: description, reference_number: reference_number, division: division, audit_start: audit_start, audit_end: audit_end, audit_type: audit_type, start: start, end: end, backgroundColor: color, allDay: true })
        })

        this.calendarOptions = {
          headerToolbar: {
            left: 'dayGridMonth,dayGridWeek,dayGridDay',
            center: 'title',
            right: 'prevYear,prev,next,nextYear'
          },
          initialView: "dayGridMonth",
          themeSystem: "bootstrap",
          events: this.AuditCalendar,
          weekends: true,
          editable: true,
          selectable: true,
          selectMirror: true,
          dayMaxEvents: true,
          displayEventTime: false,
          // dateClick: this.openModal.bind(this),
          eventClick: this.handleEventClick.bind(this),
          eventsSet: this.handleEvents.bind(this)
        };

      },
      error: (err: any) => { },
      complete: () => { }
    })

  }

  handleEventClick(clickInfo: EventClickArg) {


    this.dialog.open(AuditCalendarDetailsComponent, {
      data: clickInfo
    })
    // this.editEvent = clickInfo.event;
    // this.formEditData = this.formBuilder.group({
    //   editTitle: clickInfo.event.title,
    //   editCategory: clickInfo.event.classNames[0],
    // });
    // this.modalService.open(this.editmodalShow);
  }

  /**
   * Events bind in calander
   * @param events events
   */
  handleEvents(events: EventApi[]) {
    this
    this.currentEvents = events;


  }

  private _fetchData() {
    // Event category
    this.category = category;
    // Calender Event Data
    this.calendarEvents = calendarEvents;
    // form submit
    this.submitted = false;
  }



}
