import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OccupationalHealthRoutingModule } from './occupational-health-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { MatSortModule } from '@angular/material/sort';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CallbackPipe } from './dashboard/MyFilterPipe';
import { EmailComponent } from './email/email.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    DashboardComponent,
    CallbackPipe,
    EmailComponent
  ],
  imports: [
    CommonModule,
    OccupationalHealthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    MatDialogModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    DropzoneModule,
    MatSortModule,
    NgxDropzoneModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    NgApexchartsModule,
    NgbModule
  ]
})
export class OccupationalHealthModule { }
