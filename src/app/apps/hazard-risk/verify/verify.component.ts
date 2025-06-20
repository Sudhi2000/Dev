import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CurrencyPipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Lightbox } from 'ngx-lightbox';
import { MatDialog } from '@angular/material/dialog';
import { RejectReasonComponent } from './reject-reason/reject-reason.component';

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
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class VerifyComponent implements OnInit {
  moreFiles: any[] = [];
  moreFilesAfter: any[] = []

  Form: FormGroup
  currency: string
  orgID: string
  duedate = new FormControl(null, [Validators.required]);
  targetedDate = new FormControl(null, [Validators.required]);
  completedDate = new FormControl(null, [Validators.required]);
  evidences: any = []
  evidenceAfter: any = []
  backToHistory: Boolean = false

  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private hazardService: HazardService,
    private imageCompress: NgxImageCompressService,
    private currencyPipe: CurrencyPipe,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _lightbox: Lightbox) { }

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

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [],
      org_id: ['', [Validators.required]],
      reference_number: ['', [Validators.required]],
      reported_date: [new Date()],
      category: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
      observation: ['', [Validators.required]],
      division: ['', [Validators.required]],
      location_department: ['', [Validators.required]],
      sub_location: ['', [Validators.required]],
      description: [''],
      evidence_before: ['', [Validators.required]],
      control: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      action_taken: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      status: ['', [Validators.required]],
      reporter: [''],
      hse_head: [null],
      hse_head_name: [''],
      hse_head_designation: [''],
      reporter_name: ['', [Validators.required]],
      ext_reporter_name: [''],
      ext_reporter_employee_id: [''],
      reporter_designation: ['', [Validators.required]],
      assignee_name: ['', [Validators.required]],
      assignee_designation: ['', [Validators.required]],
      level: ['', [Validators.required]],
      due_date: ['', [Validators.required]],
      target_comp_date: ['', [Validators.required]],
      com_date: ['', [Validators.required]],
      deligate_name: ['', [Validators.required]],
      deligate_designation: ['', [Validators.required]],
      evidence_after: ['', [Validators.required]],
      responsible: [''],
      reject_reason: [''],
      rework_description: ['']
    });

  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.hazard_risk
        this.currency = result.data.attributes.currency
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
        const status = result.ehs_action
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.ehs_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  ehs_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.hazardService.get_ehs_details(this.Form.value.org_id, reference).subscribe({
      next: (result: any) => {
        if (result.data[0].attributes.status !== "Verify") {
          this.router.navigate(["/apps/hazard-risk/assigned-tasks"])

        }
        this.Form.controls['id'].setValue(result.data[0].id)
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.Form.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
        this.Form.controls['category'].setValue(result.data[0].attributes.category)
        this.Form.controls['sub_category'].setValue(result.data[0].attributes.sub_category)
        this.Form.controls['observation'].setValue(result.data[0].attributes.observation)
        this.Form.controls['division'].setValue(result.data[0].attributes.division)
        this.Form.controls['location_department'].setValue(result.data[0].attributes.location_department)
        this.Form.controls['sub_location'].setValue(result.data[0].attributes.sub_location)
        this.Form.controls['description'].setValue(result.data[0].attributes.description)
        this.Form.controls['evidence_before'].setValue(environment.client_backend + '/uploads/' + result.data[0].attributes.evidence_before)
        // this.Form.controls['evidence_before'].setValue(result.data[0].attributes.evidence.data.attributes.evidence_before)
        this.Form.controls['control'].setValue(result.data[0].attributes.control)
        this.Form.controls['cost'].setValue(result.data[0].attributes.cost)
        this.costSymbol(result.data[0].attributes.cost)
        this.Form.controls['action_taken'].setValue(result.data[0].attributes.action_taken)
        this.Form.controls['remarks'].setValue(result.data[0].attributes.remarks)
        this.Form.controls['status'].setValue(result.data[0].attributes.status)
        if (result.data[0].attributes.reporter.data) {
          this.Form.controls['reporter'].setValue(result.data[0].attributes.reporter.data.id)
          this.Form.controls['reporter_name'].setValue(result.data[0].attributes.reporter.data.attributes.first_name + ' ' + result.data[0].attributes.reporter.data.attributes.last_name)
          this.Form.controls['reporter_designation'].setValue(result.data[0].attributes.reporter.data.attributes.designation)
        }else{
          this.Form.controls['ext_reporter_name'].setValue(result.data[0].attributes.reporter_name )
          this.Form.controls['ext_reporter_employee_id'].setValue(result.data[0].attributes.reporter_employee_id )
          if(result.data[0].attributes.hse_head.data){
            this.Form.controls['hse_head'].setValue(result.data[0].attributes.hse_head?.data.id)
            this.Form.controls['hse_head_name'].setValue(result.data[0].attributes.hse_head?.data.attributes.first_name + ' ' + result.data[0].attributes.hse_head.data.attributes.last_name)
            this.Form.controls['hse_head_designation'].setValue(result.data[0].attributes.hse_head?.data.attributes.designation)
          }
        }
        this.Form.controls['assignee_name'].setValue(result.data[0].attributes.assignee.data.attributes.first_name + ' ' + result.data[0].attributes.assignee.data.attributes.last_name)
        this.Form.controls['assignee_designation'].setValue(result.data[0].attributes.assignee.data.attributes.designation)
        this.Form.controls['responsible'].setValue(result.data[0].attributes.responsible.data.id)
        this.Form.controls['level'].setValue(result.data[0].attributes.level)
        this.Form.controls['due_date'].setValue(result.data[0].attributes.due_date)
        this.duedate.setValue(new Date(result.data[0].attributes.due_date))
        this.Form.controls['target_comp_date'].setValue(result.data[0].attributes.targeted_date)
        this.targetedDate.setValue(new Date(result.data[0].attributes.targeted_date))
        this.Form.controls['com_date'].setValue(result.data[0].attributes.completed_date)
        this.completedDate.setValue(new Date(result.data[0].attributes.completed_date))
        if (result.data[0].attributes.deligate.data) {
          this.Form.controls['deligate_name'].setValue(result.data[0].attributes.deligate.data.attributes.first_name + ' ' + result.data[0].attributes.deligate.data.attributes.last_name)
          this.Form.controls['deligate_designation'].setValue(result.data[0].attributes.deligate.data.attributes.designation)
        }
        this.Form.controls['evidence_after'].setValue(environment.client_backend + '/uploads/' + result.data[0].attributes.evidence_after)
        let eviDataBefore: any[] = []
        eviDataBefore.push({
          src: environment.client_backend + '/uploads/' + result.data[0].attributes.ehs_evidences.data[0].attributes.evidence_name + '.' + result.data[0].attributes.ehs_evidences.data[0].attributes.format,
          caption: "Evidence",
          thumb: environment.client_backend + '/uploads/' + result.data[0].attributes.ehs_evidences.data[0].attributes.evidence_name + '.' + result.data[0].attributes.ehs_evidences.data[0].attributes.format
        })
        this.evidences = eviDataBefore

        if (result.data[0].attributes.ehs_evidences.data[0].attributes.evidence_name_after) {
          let eviDataAfter: any[] = []
          eviDataAfter.push({
            src: environment.client_backend + '/uploads/' + result.data[0].attributes.ehs_evidences.data[0].attributes.evidence_name_after + '.' + result.data[0].attributes.ehs_evidences.data[0].attributes.format_after,
            caption: "Evidence",
            thumb: environment.client_backend + '/uploads/' + result.data[0].attributes.ehs_evidences.data[0].attributes.evidence_name_after + '.' + result.data[0].attributes.ehs_evidences.data[0].attributes.format_after
          })
          this.evidenceAfter = eviDataAfter
        }


        if (result.data[0].attributes.ehss_multiple_evidences.data.length > 0) {
          let eviDataMoreBefore: any[] = []
          result.data[0].attributes.ehss_multiple_evidences.data.forEach((elem: any) => {
            eviDataMoreBefore.push({
              src: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format,
              caption: "Evidence",
              thumb: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format
            })
          })
          this.moreFiles = eviDataMoreBefore
        }

        if (result.data[0].attributes.ehss_multiple_evidence_after.data.length > 0) {
          let eviDataMoreBefore: any[] = []
          result.data[0].attributes.ehss_multiple_evidence_after.data.forEach((elem: any) => {
            eviDataMoreBefore.push({
              src: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format,
              caption: "Evidence",
              thumb: environment.client_backend + '/uploads/' + elem.attributes.evidence_name + '.' + elem.attributes.format
            })
          })
          this.moreFilesAfter = eviDataMoreBefore
        }

        if (result.data[0].attributes.reject_reason) {
          this.Form.controls['reject_reason'].setValue(result.data[0].attributes.reject_reason)
          this.Form.controls['rework_description'].setValue(result.data[0].attributes.rework_description)
          this.Form.controls['reject_reason'].disable()
          this.Form.controls['rework_description'].disable()

        }


        // const evidence_before = result.data[0].attributes.ehs_evidences.data.filter(function (elem: any) {
        //   return (elem.attributes.evidence_after === false)
        // })
        // let eviDataBefore: any[] = []
        // eviDataBefore.push({
        //   src: environment.client_backend + '/uploads/' + evidence_before[0].attributes.evidence_name + '.' + evidence_before[0].attributes.format,
        //   caption: "Evidence",
        //   thumb: environment.client_backend + '/uploads/' + evidence_before[0].attributes.evidence_name + '.' + evidence_before[0].attributes.format
        // })
        // this.evidences = eviDataBefore

        // const evidence_after = result.data[0].attributes.ehs_evidences.data.filter(function (elem: any) {
        //   return (elem.attributes.evidence_after === true)
        // })
        // let eviDataAfter: any[] = []
        // eviDataAfter.push({
        //   src: environment.client_backend + '/uploads/' + evidence_after[0].attributes.evidence_name + '.' + evidence_after[0].attributes.format,
        //   caption: "Evidence",
        //   thumb: environment.client_backend + '/uploads/' + evidence_after[0].attributes.evidence_name + '.' + evidence_after[0].attributes.format
        // })
        // this.evidenceAfter = eviDataAfter





        // this.Form.controls['evidence_after'].setValue(result.data[0].attributes.evidence.data.attributes.evidence_after)
        this.Form.disable()
        this.duedate.disable()
        this.targetedDate.disable()
        this.completedDate.disable()
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  costSymbol(data: any) {
    const amount = this.currencyPipe.transform(data, this.currency);
    this.Form.controls['cost'].setValue(amount)
  }

  openEvidence(index: number): void {
    this._lightbox.open(this.evidences, index);
  }
  openEvidenceAfter(index: number): void {
    this._lightbox.open(this.evidenceAfter, index);
  }

  verify() {
    Swal.fire({
      title: 'Are you sure',
      imageUrl: "assets/images/unable-proceed.gif",
      imageWidth: 150,
      text: "Hereby confirming that you have reveiwed the reported Hazard / Risk details and the resolution given by the assignee. If yes please click on 'Yes,Proceed' button or if it is required to re-check the data, please click on 'Cancel' button.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        const status = "Completed"
        this.verified(status)
      }
    })
  }



  reject() {
    Swal.fire({
      title: 'Are you sure',
      imageUrl: "assets/images/unable-proceed.gif",
      imageWidth: 150,
      text: "Hereby confirming that you have rejected the resolution given by the assignee. If yes please click on 'Yes,Proceed' button or if it is required to re-check the data, please click on 'Cancel' button.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {


        this.dialog.open(RejectReasonComponent).afterClosed().subscribe((reason) => {
          this.Form.controls['reject_reason'].setValue(reason.reason)
          const status = "Rejected"
          this.verified(status)


        });
      }
    })
  }

  open() {
    Swal.fire({
      title: 'Are you sure',
      imageUrl: "assets/images/unable-proceed.gif",
      imageWidth: 150,
      text: "Hereby confirming that you have re-opening the task. If yes please click on 'Yes,Proceed' button or if it is required to re-check the data, please click on 'Cancel' button.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        const status = "Open"
        this.verified(status)
      }
    })
  }

  verified(data: any) {
    this.hazardService.verified(data, this.Form.value.id, this.Form.value.reject_reason).subscribe({
      next: (result: any) => {
        this.create_notification(result.data.attributes.status)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
       
      }
    })
  }

  create_notification(status: any) {
    let data: any[] = []
    data.push({
      module: "Hazard/Risk Management",
      action: status + ' Hazard/Risk Resolution:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.responsible,
      access_link: "/apps/hazard-risk/view/",
      profile: this.Form.value.reporter? this.Form.value.reporter: this.Form.value.hse_head
    })



    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => {


      },



      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {



        if (status === "Rejected") {
          Swal.fire({
            title: 'Hazard & Risk Rejected',
            imageUrl: "assets/images/confirm.gif",
            imageWidth: 250,
            text: "You have successfully rejected the Hazard & Risk details. We will notify the user to take further action.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/hazard-risk/assigned-tasks"])
          })
        } else {
          Swal.fire({
            title: 'Completed',
            imageUrl: "assets/images/confirm-1.gif",
            imageWidth: 150,
            text: "You have successfully closed the task",
          })
          this.router.navigate(["/apps/hazard-risk/assigned-tasks"])

        }

      }
    })
  }

  openMore(index: number): void {
    this._lightbox.open(this.moreFiles, index);
  }

  openMoreAfter(index: number): void {
    this._lightbox.open(this.moreFilesAfter, index);

  }

  navigate() {
    this.router.navigate(["/apps/hazard-risk/assigned-tasks"])
    this.backToHistory = true
  }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
