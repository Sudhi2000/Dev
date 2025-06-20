import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { MY_FORMATS } from '../accident-action/accident-action.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-corrective-action',
  templateUrl: './view-corrective-action.component.html',
  styleUrls: ['./view-corrective-action.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewCorrectiveActionComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Form: FormGroup
  dueDate = new FormControl(null);
  comDate = new FormControl(null);
  userID: any
  evidenceFormData = new FormData()
  files: File[] = [];
  addfiles: File[] = [];
  evidenceData: any[] = []
  backToHistory: Boolean = false
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
      ],
    },
  }
  constructor(private authService: AuthService,
    private router: Router,
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private accidentService: AccidentService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder, private _location: Location) { }
  ngOnInit() {
    this.Form = this.formBuilder.group({
      id: [''],
      action: [''],
      completed_date: [null],
      reported_date: [''],
      due_date: [''],
      reference_number: [''],
      status: [''],
      acc_reference_number: [''],
      notification: [null],
      reporter_id: [''],
      assignee_id: [''],
      action_taken: [''],
      user_remarks: [''],
      accident_id: [''],
      evidence: [''],
      evidence_type: [''],
      evidence_id: [''],
      first_evidence_id: [''],
      second_evidence_id: ['']
    });
    this.configuration()
    this.Form.disable()
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
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
        const status = result.acc_inc_action
        this.userID = result.id
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_action_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_action_details() {
    this.files = []
    const id = this.route.snapshot.paramMap.get('id');
    this.accidentService.get_corrective_action_register_id(id).subscribe({
      next: (result: any) => {
        console.log(result);
        console.log(this.Form.value.action_taken);

        if (result.data[0].attributes.assignee.data.id === this.userID) {

          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['action'].setValue(result.data[0].attributes.action)
          this.Form.controls['completed_date'].setValue(result.data[0].attributes.completed_date)
          this.Form.controls['reported_date'].setValue(result.data[0].attributes.accident.data.attributes.reported_date)
          this.Form.controls['due_date'].setValue(result.data[0].attributes.due_date)
          this.dueDate.setValue(new Date(result.data[0].attributes.due_date))
          this.dueDate.disable()
          if (result.data[0].attributes.completed_date) {
            this.comDate.setValue(new Date(result.data[0].attributes.completed_date))
          }
          this.comDate.disable()
          this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
          this.Form.controls['action_taken'].setValue(result.data[0].attributes.action_taken)
          this.Form.controls['user_remarks'].setValue(result.data[0].attributes.user_remarks)
          this.Form.controls['status'].setValue(result.data[0].attributes.status)
          this.Form.controls['accident_id'].setValue(result.data[0].attributes.accident.data.id)
          this.Form.controls['acc_reference_number'].setValue(result.data[0].attributes.accident.data.attributes.reference_number)
          this.Form.controls['reporter_id'].setValue(result.data[0].attributes.accident.data.attributes.assignee.data.id)
          this.Form.controls['assignee_id'].setValue(result.data[0].attributes.assignee.data.id)
          this.evidenceData = result.data[0].attributes.corrective_action_evidences.data
          if (this.evidenceData.length > 0) {
            this.Form.controls['evidence'].setValue('OK')
          } else {
            this.Form.controls['evidence'].reset()
          }

          const evidence__data = result.data[0].attributes.corrective_action_evidences.data
          if (evidence__data.length > 0) {
            this.Form.controls['evidence_id'].setValue(evidence__data[0]?.id || null);
            this.Form.controls['first_evidence_id'].setValue(evidence__data[1]?.id || null);
            this.Form.controls['second_evidence_id'].setValue(evidence__data[2]?.id || null);

            evidence__data.slice(0, 3).forEach((evidence: any) => {
              this.generalService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_after_name + '.' + evidence.attributes.format_after).subscribe((data: any) => {
                this.files.push(data);
              });
            });
          }


        } else {
          this.router.navigate(["/apps/accident-incident/corrective-actions"])
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }




  close() {
    this.router.navigate(["/apps/accident-incident/corrective-action-register"])
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
