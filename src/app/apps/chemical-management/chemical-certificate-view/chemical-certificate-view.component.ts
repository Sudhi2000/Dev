import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { certificate } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ChemicalViewCertificateComponent } from '../chemical-view-certificate/chemical-view-certificate.component';
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
  selector: 'app-chemical-certificate-view',
  templateUrl: './chemical-certificate-view.component.html',
  styleUrls: ['./chemical-certificate-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChemicalCertificateViewComponent implements OnInit {

  Form: FormGroup
  orgID: string
  issuedDate = new FormControl(null, [Validators.required]);
  expiryDate = new FormControl(null, [Validators.required]);
  testDate = new FormControl(null, [Validators.required]);
  mode: 'create' | 'update' = 'create';
  static id = 1;
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

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ChemicalCertificateViewComponent>) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';

    } else {
      this.defaults = {} as certificate;
    }
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [this.defaults.id || ''],
      org_id: [this.defaults.org_id || '', [Validators.required]],
      certificate_name: [this.defaults.attributes.certificate_name || '', [Validators.required]],
      certificate_issued_date: [this.defaults.attributes.certificate_issued_date || '', [Validators.required]],
      certificate_expiry_date: [this.defaults.attributes.certificate_expiry_date || '', [Validators.required]],
      test_date: [this.defaults.attributes.test_date || '', [Validators.required]],
      test_lab: [this.defaults.attributes.labs || '', [Validators.required]],
      positive_list: [this.defaults.attributes.positive_tests || '', [Validators.required]],
      remarks: [this.defaults.attributes.remarks || '', [Validators.required]],
      certificate: [this.defaults.certificate || ''],
      files: [],
      cer_document_status: [false],
      document_name: [],
      document_format: [],
      certificate_id: [],
      certificate_doc_id: []
    });

    if (this.defaults.attributes.test_date) {
      this.testDate.setValue(new Date(this.defaults.attributes.test_date))
    }
    if (this.defaults.attributes.certificate_issued_date) {
      this.issuedDate.setValue(new Date(this.defaults.attributes.certificate_issued_date))
    }

    if (this.defaults.attributes.certificate_expiry_date) {
      this.expiryDate.setValue(new Date(this.defaults.attributes.certificate_expiry_date))
    }
    if (this.defaults.attributes?.chemical_certificate_doc?.data) {
      const document_name = this.defaults.attributes?.chemical_certificate_doc?.data.attributes.document_name
      const document_format = this.defaults.attributes?.chemical_certificate_doc?.data.attributes.document_format
      const certificate_id = this.defaults.attributes?.chemical_certificate_doc?.data.id
      const certificate_doc_id = this.defaults.attributes?.chemical_certificate_doc?.data.attributes.document_id
      this.Form.controls['cer_document_status'].setValue(true)
      this.Form.controls['document_name'].setValue(document_name)
      this.Form.controls['document_format'].setValue(document_format)
      this.Form.controls['certificate_id'].setValue(certificate_id)
      this.Form.controls['certificate_doc_id'].setValue(certificate_doc_id)

    } else {
      this.Form.controls['cer_document_status'].setValue(false)
    }
    this.Form.disable()
    this.testDate.disable()
    this.issuedDate.disable()
    this.expiryDate.disable()
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.chemical
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.chem_inven
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  close() {
    this.dialogRef.close();
  }

  view_certificate_document() {
    let docData: any[] = []
    docData.push({
      document_name: this.Form.value.document_name,
      document_format: this.Form.value.document_format
    })
    this.dialog.open(ChemicalViewCertificateComponent, { data: docData[0] })
  }

}
