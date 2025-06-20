import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { AuditCalendarRoutingModule } from './audit-calendar-routing.module';
import { AuditCalendarComponent } from './audit-calendar/audit-calendar.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule,FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AuditCalendarDetailsComponent } from './audit-calendar/audit-calendar-details/audit-calendar-details.component';
FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
])

@NgModule({
  declarations: [
    AuditCalendarComponent,
    AuditCalendarDetailsComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    AuditCalendarRoutingModule,
    FullCalendarModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class AuditCalendarModule { }
