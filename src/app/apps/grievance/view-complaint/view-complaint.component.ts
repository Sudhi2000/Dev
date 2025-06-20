import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { GrievanceService } from 'src/app/services/grievance.api.service';
import { saveAs } from 'file-saver';
import { Lightbox } from 'ngx-lightbox';
import { Location } from '@angular/common';

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
  selector: 'app-view-complaint',
  templateUrl: './view-complaint.component.html',
  styleUrls: ['./view-complaint.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewComplaintComponent implements OnInit {
  evidences: any = []
  evidencesAfter: any = []


  type: any;
  subtype: any;
  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 5,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;

  files: File[] = [];
  statementfiles: File[] = [];
  committeefiles: File[] = [];
  evidenceafterfiles: File[] = [];
  imglnk: any = environment.client_backend + '/uploads/'
  format: any = ".png"
  evidenceCount: number = 0
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  humanRightsScore: number = 0;
  humanRightsFinalScore: number = 0;
  scaleScore: number = 0;
  scaleFinalScore: number = 0;
  frequencyScore: number = 0;
  frequencyFinalScore: number = 0;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  anonymousForm: FormGroup
  solutionForm: FormGroup
  joindate = new FormControl(null);
  resolutiondate = new FormControl(null, [Validators.required]);
  evidenceFormData = new FormData()
  evidenceafterFormData = new FormData()
  evidenceData: any
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  dropdownValues: any
  chairperson: number
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
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

  constructor(private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private grievanceService: GrievanceService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _lightbox: Lightbox,
    private _location: Location) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
      this.subtype = params['subtype'];
    });
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',],
      reported_date: [null],
      reporter: [''],
      type: [''],
      subtype: [''],
      case_id: [''],
      anonymous: [false],
      channel: ['', [Validators.required]],
      category: ['', [Validators.required]],
      topic: ['', [Validators.required]],
      submissions: ['', [Validators.required]],
      description: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      evidence_before: [''],
      helpdesk_person: ['', [Validators.required]],
      responsible_department: ['', [Validators.required]],
      submission_date: [null],
      status: ['Open'],
      human_rights_violation: ['', [Validators.required]],
      scale: ['', [Validators.required]],
      frequency_rate: ['', [Validators.required]],
      severity_score: [''],
      due_date: [null],
      investigation_required: [false],
      severity_color_code: [''],
      human_rights_score: [null],
      human_rights_final_score: [null],
      scale_score: [null],
      scale_final_score: [null],
      frequency_score: [null],
      frequency_final_score: [null],
      total_score: [null],
      assignee: [''],
      evidence_id: [''],
      evidence_name: [''],
      business_unit: [null],
      alleged_party:['']

    });
    this.anonymousForm = this.formBuilder.group({
      person_type: ['', [Validators.required]],
      division: ['', [Validators.required]],
      employee_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      date_of_join: [null, [Validators.required]],
      service_period: ['', [Validators.required]],
      tenure_split: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      supervisor: ['', [Validators.required]],
      employee_shift: ['', [Validators.required]],
      location: [''],
      business_unit: [null],
    })
    this.solutionForm = this.formBuilder.group({
      solution_provided: ['', [Validators.required]],
      solution_remarks: ['', [Validators.required]],
      resolution_date: [null, [Validators.required]],
      follow_up: [false],
      evidence_after: [''],
      evidence_name_after: [''],
      format_after: [''],
      evidence_after_id: [''],
    })
    this.Form.controls['type'].setValue(this.type)
    this.Form.controls['subtype'].setValue(this.subtype)
    this.Form.controls['severity_score'].disable()
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this.evidences, index);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.grievance
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
              this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
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
        const status = result.grev_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
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
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_grievance_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  resolutionDate(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.solutionForm.controls['resolution_date'].setValue(newDate)
  }

  get_grievance_details() {
    this.files = []
    const reference = this.route.snapshot.paramMap.get('id');
    this.grievanceService.get_grievance_details(reference).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/grievance/register"])
        } else {
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['type'].setValue(result.data[0].attributes.type)
          this.Form.controls['description'].setValue(result.data[0].attributes.description)
          this.Form.controls['status'].setValue(result.data[0].attributes.status)
          this.Form.controls['topic'].setValue(result.data[0].attributes.topic)
          this.Form.controls['submissions'].setValue(result.data[0].attributes.submissions)
          this.Form.controls['alleged_party'].setValue(result.data[0].attributes.alleged_party)
          this.Form.controls['remarks'].setValue(result.data[0].attributes.remarks)
          this.Form.controls['helpdesk_person'].setValue(result.data[0].attributes.helpdesk_person)
          this.Form.controls['responsible_department'].setValue(result.data[0].attributes.responsible_department)
          this.Form.controls['submission_date'].setValue(result?.data[0]?.attributes?.submission_date)
          this.Form.controls['channel'].setValue(result.data[0].attributes.channel)
          this.Form.controls['category'].setValue(result.data[0].attributes.category)
          this.Form.controls['anonymous'].setValue(result.data[0].attributes.anonymous)
          this.Form.controls['case_id'].setValue(result.data[0].attributes.case_id)
          this.Form.controls['scale'].setValue(result.data[0].attributes.scale)
          this.Form.controls['severity_score'].setValue(result.data[0].attributes.severity_score)
          this.Form.controls['human_rights_violation'].setValue(result.data[0].attributes.human_rights_violation)
          this.Form.controls['frequency_rate'].setValue(result.data[0].attributes.frequency_rate)
          this.Form.controls['due_date'].setValue(result?.data[0]?.attributes?.due_date)
          this.Form.controls['reported_date'].setValue(new Date(result.data[0].attributes.created_date))
          this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.attributes.division_name)
          this.anonymousForm.controls['person_type'].setValue(result.data[0].attributes.person_type)
          this.anonymousForm.controls['division'].setValue(result.data[0].attributes.division)
          this.anonymousForm.controls['employee_id'].setValue(result.data[0].attributes.employee_id)
          this.anonymousForm.controls['service_period'].setValue(result.data[0].attributes.service_period)
          this.anonymousForm.controls['name'].setValue(result.data[0].attributes.name)
          this.anonymousForm.controls['employee_shift'].setValue(result.data[0].attributes.employee_shift)
          this.anonymousForm.controls['location'].setValue(result.data[0].attributes.location)
          this.anonymousForm.controls['gender'].setValue(result.data[0].attributes.gender)
          this.anonymousForm.controls['date_of_join'].setValue(result.data[0].attributes.date_of_join)
          this.anonymousForm.controls['tenure_split'].setValue(result.data[0].attributes.tenure_split)
          this.anonymousForm.controls['designation'].setValue(result.data[0].attributes.designation)
          this.anonymousForm.controls['department'].setValue(result.data[0].attributes.department)
          this.anonymousForm.controls['supervisor'].setValue(result.data[0].attributes.supervisor)
          this.solutionForm.controls['solution_remarks'].setValue(result.data[0].attributes.solution_remarks)
          this.solutionForm.controls['solution_provided'].setValue(result.data[0].attributes.solution_provided)
          this.solutionForm.controls['resolution_date'].setValue(result.data[0].attributes.resolution_date)
          this.solutionForm.controls['follow_up'].setValue(result.data[0].attributes.follow_up)
          this.solutionForm.controls['resolution_date'].setValue(result.data[0].attributes.resolution_date)
          if (this.solutionForm.value.resolution_date) {
            this.resolutiondate.setValue(new Date(result.data[0].attributes.resolution_date))
          }
          this.joindate.setValue(new Date(result.data[0].attributes.date_of_join))
          this.evidenceData = result.data[0].attributes.grievance_evidences.data
          if (this.evidenceData.length > 0) {
            this.Form.controls['evidence_before'].setValue('OK')
          } else {
            this.Form.controls['evidence_before'].reset()
          }
          let eviDataBefore: any[] = []

          const evidence__data = result.data[0]?.attributes?.grievance_evidences?.data
          if (evidence__data?.length > 0) {
            this.Form.controls['evidence_id'].setValue(evidence__data[0].id)
            eviDataBefore.push({
              src: environment.client_backend + '/uploads/' + result.data[0].attributes.grievance_evidences.data[0].attributes.evidence_name + '.' + result.data[0].attributes.grievance_evidences.data[0].attributes.format,
              caption: "Evidence",
              thumb: environment.client_backend + '/uploads/' + result.data[0].attributes.grievance_evidences.data[0].attributes.evidence_name + '.' + result.data[0].attributes.grievance_evidences.data[0].attributes.format
            })
            this.evidences = eviDataBefore
          }

          let eviDataAfter: any[] = []
          const evidence_data_after = result.data[0]?.attributes?.grievance_evidences?.data
          if (evidence_data_after?.length > 0) {
            this.Form.controls['evidence_id'].setValue(evidence_data_after[0].id)
            eviDataAfter.push({
              src: environment.client_backend + '/uploads/' + result.data[0].attributes.grievance_evidences.data[0].attributes.evidence_after_name + '.' + result.data[0].attributes.grievance_evidences.data[0].attributes.format_after,
              caption: "Evidence",
              thumb: environment.client_backend + '/uploads/' + result.data[0].attributes.grievance_evidences.data[0].attributes.evidence_after_name + '.' + result.data[0].attributes.grievance_evidences.data[0].attributes.format_after
            })
            this.evidencesAfter = eviDataAfter
          }



          // const evidence__data = result.data[0].attributes.grievance_evidences.data
          // if (evidence__data.length > 0) {
          //   this.Form.controls['evidence_id'].setValue(evidence__data[0].id)

          //   evidence__data.forEach((evidence: any) => {
          //     this.generalService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
          //       this.files.push(data)
          //     })
          //     this.generalService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_after_name + '.' + evidence.attributes.format_after).subscribe((data: any) => {
          //       this.evidenceafterfiles.push(data)
          //     })
          //   })
          // }

          this.Form.disable()
          this.anonymousForm.disable()
          this.joindate.disable()
          this.resolutiondate.disable()
          this.solutionForm.get('solution_provided')?.disable();
          this.solutionForm.get('solution_remarks')?.disable();

        }

      },
      error: (err: any) => { },
      complete: () => { }

    })
  }
  grievance_document() {
    const documentName = this.solutionForm.value.grievance_stmt_name;
    const documentFormat = this.solutionForm.value.grievance_stmt_format;
    const fileUrl = `${environment.client_backend}/uploads/${documentName}.${documentFormat}`;
    saveAs(fileUrl, `${documentName}.${documentFormat}`);
  }

  grievance_committee_document() {
    const documentName = this.solutionForm.value.grievance_committee_stmt_name;
    const documentFormat = this.solutionForm.value.grievance_committee_stmt_format;
    const fileUrl = `${environment.client_backend}/uploads/${documentName}.${documentFormat}`;
    saveAs(fileUrl, `${documentName}.${documentFormat}`);
  }
  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
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
