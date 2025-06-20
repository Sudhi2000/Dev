import { CurrencyPipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { saveAs } from 'file-saver'
import { ChemicalMsdsDocumentComponent } from '../chemical-msds-document/chemical-msds-document.component';
import { ViewChemcheckReportComponent } from '../view-chemcheck-report/view-chemcheck-report.component';

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
  selector: 'app-chemical-approval',
  templateUrl: './chemical-approval.component.html',
  styleUrls: ['./chemical-approval.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChemicalApprovalComponent implements OnInit {
  docId: any;
  setDocId: any
  Form: FormGroup
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  divisions: any[] = []
  commercialName: any[] = []
  zdhcCategory: any[] = []
  peopleList: any[] = []
  currency: string
  orgID: string
  files: File[] = [];
  issuedDate = new FormControl(null);
  expiryDate = new FormControl(null);
  requestedUnit: any[] = []
  dropdownValues: any[] = []
  report_id: any
  report_docid: any
  existChemcheck = false
  requestedUnitVal: string
  requestDate = new FormControl(null);
  ApprovalDate = new FormControl(null);
  chemcheckreportFile: File[] = [];
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

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private generalService: GeneralService,
    private chemicalService: ChemicalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
    this.configuration()

    this.Form = this.formBuilder.group({
      org_id: [''],
      id: [''],
      reference_number: [''],
      division: ['', [Validators.required]],
      reported_date: [null],
      request_date: [null],
      requested_customer: ['', [Validators.required]],
      requested_merchandiser: ['', [Validators.required]],
      commercial_name: ['', [Validators.required]],
      substance_name: ['', [Validators.required]],
      formula: ['', [Validators.required]],
      reach_regi_number: ['', [Validators.required]],
      zdhc_use_category: ['', [Validators.required]],
      where_why: ['', [Validators.required]],
      status: ['Open', [Validators.required]],
      approver: [null, [Validators.required]],
      approver_designation: [''],
      reporter: ['', [Validators.required]],
      reporter_id: [''],
      reporter_designation: ['', [Validators.required]],
      updated_By: ['', [Validators.required]],
      reviewer_remarks: [''],
      reviewer: [''],
      approver_remarks: [''],
      chemical_uuid: [''],
      reviewer_name: [''],
      reviewer_designation: [''],
      requested_unit: ['', [Validators.required]],
      requested_quantity: [null, [Validators.required]],
      business_unit: [null],
      chemical_form: ['', [Validators.required]],
      zdhc_level: [''],
      cas_no: [''],
      colour_index: [''],
      use_of_ppe: [''],
      hazardType: [''],
      ghsClassification: [''],
      product_standard: [''],
      msds_sds: [false, [Validators.required]],
      msds_doc_status: [null, [Validators.required]],
      msds_sds_issued_date: [null, [Validators.required]],
      msds_sds_expiry_date: [null, [Validators.required]],
      msds_sds_document: [''],
      document_name: [''],
      document_format: [''],
      document_id: [''],
      msdc_document: [''],
      doc_Id: [null],
      approval_valid_date: [null],
      category: ['', [Validators.required]],
      chemcheck_document: [''],
      chemcheck_name: [''],
      chemcheck_format: [''],
      chemcheck_id: [''],
      chem_check_report: [''],
      chemcheck: [false],
    });
    this.Form.controls['msds_sds_issued_date'].removeValidators(Validators.required)
    this.Form.controls['msds_sds_expiry_date'].removeValidators(Validators.required)
    this.Form.controls['msds_doc_status'].removeValidators(Validators.required)
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.chemical
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.chem_action
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['updated_By'].setValue(result.profile.id)
          this.get_profiles()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        this.peopleList = result.data
        this.get_chemical_request_details()
      },
      error: (err: any) => {
      },
      complete: () => { }
    })
  }


  get_chemical_request_details() {
    const cheID = this.route.snapshot.paramMap.get('id');
    this.chemicalService.get_chemical_details(cheID).subscribe({
      next: (result: any) => {
        if (result.data.attributes.status === "Reviewed" && result.data.attributes.approver.data.id == this.Form.value.updated_By) {
          this.Form.controls['id'].setValue(result.data.id)
          this.Form.controls['reference_number'].setValue(result.data.attributes.reference_number)
          this.Form.controls['division'].setValue(result.data.attributes.division)
          this.Form.controls['reported_date'].setValue(result.data.attributes.created_date)
          this.Form.controls['request_date'].setValue(result.data.attributes.request_date)
          this.requestDate.setValue(new Date(result.data.attributes.request_date))
          this.Form.controls['requested_customer'].setValue(result.data.attributes.requested_customer)
          this.Form.controls['requested_merchandiser'].setValue(result.data.attributes.requested_merchandiser)
          this.Form.controls['commercial_name'].setValue(result.data.attributes.commercial_name)
          this.Form.controls['substance_name'].setValue(result.data.attributes.substance_name)
          this.Form.controls['formula'].setValue(result.data.attributes.formula)
          this.Form.controls['reach_regi_number'].setValue(result.data.attributes.reach_registration_number)
          this.Form.controls['category'].setValue(result.data.attributes.category)
          this.Form.controls['zdhc_use_category'].setValue(result.data.attributes.ZDHC_use_category)
          this.Form.controls['where_why'].setValue(result.data.attributes.usage)
          this.Form.controls['status'].setValue(result.data.attributes.status)
          this.Form.controls['reviewer'].setValue(result.data.attributes.reviewer.data.id)
          this.Form.controls['reporter_id'].setValue(result.data.attributes.reporter.data.id)
          this.Form.controls['reporter'].setValue(result.data.attributes.reporter.data.attributes.first_name + ' ' + result.data.attributes.reporter.data.attributes.last_name)
          this.Form.controls['reporter_designation'].setValue(result.data.attributes.reporter.data.attributes.designation)
          this.Form.controls['approver'].setValue(result.data.attributes.approver.data.attributes.first_name + ' ' + result.data.attributes.approver.data.attributes.last_name)
          this.Form.controls['approver_designation'].setValue(result.data.attributes.approver.data.attributes.designation)
          this.Form.controls['approver_remarks'].setValue(result.data.attributes.approver_remarks)
          this.Form.controls['chemical_uuid'].setValue(result.data.attributes.chemical_uuid)
          this.Form.controls['reviewer_name'].setValue(result.data.attributes.reviewer.data.attributes.first_name + ' ' + result.data.attributes.reviewer.data.attributes.last_name)
          this.Form.controls['reviewer_designation'].setValue(result.data.attributes.reviewer.data.attributes.designation)
          this.Form.controls['reviewer_remarks'].setValue(result.data.attributes.reviewer_remarks)
          this.Form.controls['requested_unit'].setValue(result.data.attributes.requested_unit)
          this.Form.controls['requested_quantity'].setValue(result.data.attributes.requested_quantity)
          this.Form.controls['business_unit'].setValue(result.data.attributes.business_unit.data?.id)
          this.Form.controls['chemical_form'].setValue(result.data.attributes.chemical_form_type)
          this.Form.controls['zdhc_level'].setValue(result.data.attributes.zdhc_level)
          this.Form.controls['cas_no'].setValue(result.data.attributes.cas_no)
          this.Form.controls['colour_index'].setValue(result.data.attributes.colour_index)
          this.Form.controls['use_of_ppe'].setValue(result.data.attributes.use_of_ppe)
          this.Form.controls['hazardType'].setValue(result.data.attributes.hazard_type)
          this.Form.controls['ghsClassification'].setValue(result.data.attributes.ghs_classification)
          this.Form.controls['product_standard'].setValue(result.data.attributes.product_standard)
          this.Form.controls['approval_valid_date'].setValue(result.data.attributes.approval_valid_date)
          this.ApprovalDate.setValue(result.data.attributes.approval_valid_date)
          // const document_name = result.data.attributes.msds_document?.data?.attributes?.document_name
          // const document_format = result.data.attributes.msds_document?.data?.attributes?.document_format
          // const document_id = result.data.attributes.msds_document?.data?.attributes?.document_id
          // this.docId = result.data.attributes.msds_document?.data?.attributes?.document_id
          // const msdc_document = result.data.attributes.msds_document?.data?.id
          // this.Form.controls['document_name'].setValue(document_name)
          // this.Form.controls['document_format'].setValue(document_format)
          // this.Form.controls['document_id'].setValue(document_id)
          // this.Form.controls['msdc_document'].setValue(msdc_document)
          // this.Form.controls['msds_sds'].setValue(result.data.attributes.msds_sds)
          const document_name = result.data.attributes.msds_document?.data?.attributes?.document_name
          const document_format = result.data.attributes.msds_document?.data?.attributes?.document_format
          const document_id = result.data.attributes.msds_document?.data?.attributes?.document_id
          this.docId = result.data.attributes.msds_document?.data?.attributes?.document_id
          const msdc_document = result.data.attributes.msds_document?.data?.id

          this.Form.controls['document_name'].setValue(document_name)
          this.Form.controls['document_format'].setValue(document_format)
          this.Form.controls['document_id'].setValue(document_id)
          this.Form.controls['msdc_document'].setValue(msdc_document)
          this.Form.controls['msds_sds'].setValue(result.data.attributes.msds_sds)

          this.Form.controls['chemcheck'].setValue(result.data.attributes.chem_check)
          const chemcheck_report_name = result.data.attributes.chem_check_report?.data?.attributes?.document_name
          const chemcheck_report_format = result.data.attributes.chem_check_report?.data?.attributes?.document_format
          const chemcheck_report_id = result.data.attributes.chem_check_report?.data?.attributes?.document_id
          this.report_docid = result.data.attributes.chem_check_report?.data?.attributes?.document_id
          this.report_id = result.data.attributes.chem_check_report?.data?.id
          const chemcheck_report = result.data.attributes.chem_check_report?.data?.id

          this.Form.controls['chemcheck_name'].setValue(chemcheck_report_name)
          this.Form.controls['chemcheck_format'].setValue(chemcheck_report_format)
          this.Form.controls['chemcheck_id'].setValue(chemcheck_report_id)
          this.Form.controls['chem_check_report'].setValue(chemcheck_report)

          if (chemcheck_report_name && chemcheck_report_format && chemcheck_report_id) {
            this.existChemcheck = true
            this.Form.controls['chemcheck'].setValue(true)
            this.chemcheckreportFile = []
            this.generalService.getImage(environment.client_backend + '/uploads/' + chemcheck_report_name + '.' + chemcheck_report_format).subscribe((data: any) => {
              let docData: any[] = []
              docData.push({
                size: data.size,
                name: chemcheck_report_name,
                type: chemcheck_report_format
              })
              this.chemcheckreportFile.push(docData[0])
            })
          } else {
            this.Form.controls['chemcheck'].setValue(false)
            this.existChemcheck = false
          }

          if (result.data.attributes.msds_sds_issued_date) {
            this.issuedDate.setValue(new Date(result.data.attributes.msds_sds_issued_date))
            this.Form.controls['msds_sds_issued_date'].setValue(result.data.attributes.msds_sds_issued_date)
          }
          if (result.data.attributes.msds_sds_expiry_date) {
            this.expiryDate.setValue(new Date(result.data.attributes.msds_sds_expiry_date))
            this.Form.controls['msds_sds_expiry_date'].setValue(result.data.attributes.msds_sds_expiry_date)
          }
        } else {
          this.router.navigate(["/apps/chemical-management/request-history"])
        }

        if (this.docId) {
          this.chemicalService.get_msds_document(this.docId).subscribe({
            next: (result: any) => {
              this.Form.controls['doc_Id'].setValue(result.data[0].id)
            },
            error: (err: any) => { },
            complete: () => { },


          })
        }
        else {

        }


      },
      error: (err: any) => { },
      complete: () => {
        this.requestDate.disable()
        this.ApprovalDate.disable()
        this.Form.disable()
        this.Form.controls['reported_date'].enable()
        this.Form.controls['reviewer_remarks'].enable()
        this.Form.controls['reference_number'].enable()
        this.Form.controls['request_date'].enable()
        this.Form.controls['status'].enable()
        this.Form.controls['reporter'].enable()
        this.Form.controls['reporter_designation'].enable()
        this.Form.controls['approver'].enable()
        this.Form.controls['approver_designation'].enable()
        this.Form.controls['approver_remarks'].enable()
        this.Form.controls['reviewer_name'].enable()
        this.Form.controls['reviewer_designation'].enable()
        this.Form.controls['id'].enable()
        this.Form.controls['msds_sds'].enable()
        this.Form.controls['document_id'].enable()
        this.Form.controls['document_name'].enable()
        this.Form.controls['document_format'].enable()
        this.Form.controls['chemcheck'].enable()
        this.Form.controls['chemcheck_name'].enable()
        this.Form.controls['chemcheck_format'].enable()
        this.Form.controls['chemcheck_id'].enable()

      }
    })
  }
  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }
  action(data: any) {

    const status = data
    this.Form.controls['status'].setValue(data)
    this.Form.controls['id'].enable()
    this.Form.controls['updated_By'].enable()

    if (status === "Approved") {
      this.showProgressPopup();
      this.chemicalService.update_approver_status(this.Form.value).subscribe({
        next: (result: any) => {
          this.create_inventory()
        },
        error: (err: any) => {
          console.error("Error updating status", err);
        },
        complete: () => {
        }
      })
    } else if (status === "Rejected") {
      this.showProgressPopup();
      this.chemicalService.update_approver_status(this.Form.value).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.create_notification()
        }
      })
    }
  }

  create_inventory() {
    this.Form.enable()
    this.chemicalService.create_chemical_inventory(this.Form.value).subscribe({
      next: (result: any) => {
        if (this.Form.value.chemcheck_id) {
          this.chemicalService.update_chemcheck_report(this.report_id, result.data.id).subscribe({
            next: (res: any) => {
              let data = []
              data.push({
                id: result.data.id,
                chemcheck: true
              })
              this.chemicalService.update_inventory(data[0]).subscribe({
                next: (res: any) => {

                },
                error: (err: any) => { },
                complete: () => { }

              })
            },
            complete: () => {

              this.chemcheckreportFile = [];
              this.Form.controls['chemcheck'].setValue(true); // Ensure checkbox stays ON
            }
          })
        }
      },
      error: (err: any) => { },
      complete: () => {
        this.create_notification()
      }
    })
  }

  create_notification() {
    const status = this.Form.value.status
    this.Form.controls['reporter'].enable()
    this.Form.controls['reviewer'].enable()
    this.Form.controls['reporter_id'].enable()
    this.Form.controls['updated_By'].enable()
    let data: any[] = []
    data.push(
      {
        module: "Chemical Management",
        action: status + ' Chemical Request:',
        reference_number: this.Form.value.reference_number,
        userID: this.Form.value.reporter_id,
        access_link: "/apps/chemical-management/view-request" + this.Form.value.id,
        profile: this.Form.value.updated_By
      },
      {
        module: "Chemical Management",
        action: status + ' Chemical Request:',
        reference_number: this.Form.value.reference_number,
        userID: this.Form.value.reviewer,
        access_link: "/apps/chemical-management/view-request" + this.Form.value.id,
        profile: this.Form.value.updated_By
      }
    )
    let dataLength: number = data.length
    let length: number = 0
    data.forEach(elem => {
      this.generalService.create_notification(elem).subscribe({
        next: (resul: any) => {
          let initlength = length
          let newLength = Number(initlength) + 1
          length = newLength
          if (length === dataLength) {

            if (status === "Approved") {
              Swal.fire({
                title: 'Chemical Request Approved',
                imageUrl: "assets/images/chemical.gif",
                imageWidth: 250,
                text: "You have successfully approved the chemical request and submitted for purchase and inventory.",
                showCancelButton: false,
              }).then((result) => {
                this.router.navigate(["/apps/chemical-management/assigned-task"])
              })
            } else {
              Swal.fire({
                title: 'Chemical Request Rejected',
                imageUrl: "assets/images/chemical.gif",
                imageWidth: 250,
                text: "You have rejected the chemical request and submited back to the reporter",
                showCancelButton: false,
              }).then((result) => {
                this.router.navigate(["/apps/chemical-management/assigned-task"])
              })
            }
          }
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          Swal.close();
        }
      })
    })
  }
  onSelectReport(event: any) {
    const fileLength = this.chemcheckreportFile.length;
    const addedLength = event.addedFiles.length;

    if (fileLength === 0 && addedLength < 2) {
      const file = event.addedFiles[0];
      const sizeMB = file.size / (1024 * 1024); // Convert to MB

      if (sizeMB > 5) {
        this._snackBar.open("Please choose a document below 5 MB", 'Close Warning', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        return;
      }

      const extension = file.name.split('.').pop().toLowerCase();
      if (extension !== 'pdf') {
        this._snackBar.open("Please choose a PDF document", 'Close Warning', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        return;
      }

      this.chemcheckreportFile.push(file);
      this.upload_chemcheck_report();

    } else {
      this._snackBar.open("You have exceeded the upload limit", 'Close Warning', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
  upload_chemcheck_report() {
    if (this.chemcheckreportFile.length > 0) {
      this.chemcheckreportFile.forEach((file: any) => {
        const formData = new FormData();
        const extension = file.name.split('.').pop().toLowerCase();
        formData.append('files', file, this.Form.value.reference_number + '_' + 'ChemCheckReport');

        this.generalService.upload(formData).subscribe({
          next: (result: any) => {
            const data = {
              document_name: result[0].hash,
              document_format: extension,
              chemical_request: this.Form.value.id,
              document_id: result[0].id,
            };

            this.chemicalService.create_chemcheck_report(data).subscribe({
              next: (res: any) => {
                const report = res.data.attributes
                this.Form.controls['chemcheck_name'].setValue(res.data.attributes.document_name)
                this.Form.controls['chemcheck_format'].setValue(res.data.attributes.document_format)
                this.Form.controls['chemcheck_id'].setValue(res.data.attributes.document_id)
                this.Form.controls['chem_check_report'].setValue(res.data.id)
                this.report_docid = res.data.attributes.document_id

                this.report_id = res.data.id
                if (report?.document_name && report?.document_format && report?.document_id) {
                  this.existChemcheck = true;
                  const url = `${environment.client_backend}/uploads/${report.document_name}.${report.document_format}`;

                  this.generalService.getImage(url).subscribe((data: any) => {
                    let docData: any[] = []
                    docData.push({
                      size: data.size,
                      name: report.document_name,
                      type: report.document_format
                    })
                    this.chemcheckreportFile.push(docData[0])
                  });
                } else {
                  this.existChemcheck = false;
                  this.chemcheckreportFile = [];
                }
              },
              error: (err: any) => {

              },
              complete: () => {
                this._snackBar.open("ChemCheck Report added successfully", 'OK', {
                  duration: 3000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });

                this.chemcheckreportFile = [];
                this.Form.controls['chemcheck'].setValue(true);

              }
            });
          },
          error: (err: any) => {
            console.error("Upload error:", err);
          }
        });
      });
    }
  }

  view_msds_document() {
    let docData: any[] = []
    docData.push({
      document_name: this.Form.value.document_name,
      document_format: this.Form.value.document_format
    })
    this.dialog.open(ChemicalMsdsDocumentComponent, { data: docData[0] })
  }
  // download_msds_document() {
  //   const documentName = this.Form.value.document_name;
  //   const documentFormat = this.Form.value.document_format;
  //   const fileUrl = `${environment.client_backend}/uploads/${documentName}.${documentFormat}`;
  //   saveAs(fileUrl, `${documentName}.${documentFormat}`);
  // }

  download_msds_document() {
    const documentName = this.Form.value.document_name;
    const documentFormat = this.Form.value.document_format;
    this.Form.controls['commercial_name'].enable()
    const chemicalName = this.Form.value.commercial_name;
    const issuedDate = this.issuedDate.value;
    const issueYear = issuedDate ? new Date(issuedDate).getFullYear() : 'Year';
    const customName = `${chemicalName}_MSDS_${issueYear}.${documentFormat}`;
    const fileUrl = `${environment.client_backend}/uploads/${documentName}.${documentFormat}`;
    saveAs(fileUrl, customName);
    this.Form.controls['commercial_name'].disable()
  }

  onRemoveReport(event: any) {
    this.chemcheckreportFile = [];

    if (this.existChemcheck) {
      this.delete_chemcheckReport();
      this.existChemcheck = false;
    }
    else {
      this.Form.controls['chemcheck_id'].reset()
    }
  }

  delete_chemcheckReport() {
    if (this.report_docid === null) return;

    this.showProgressPopup();

    this.generalService.destroy(this.report_docid).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => {
        console.error("Error deleting document:", err);
      },
      complete: () => {
        this.disconnect_chemcheckReport();
        Swal.close();
      }

    });
  }

  disconnect_chemcheckReport() {
    if (this.report_id === null) return;

    this.chemicalService.disconnect_chemcheck_report(this.report_id).subscribe({
      next: (result: any) => {
        this.Form.controls['chemcheck'].setValue(false)
      },
      error: (err: any) => {
        console.error("Error disconnecting ChemCheck report:", err);
      },
      complete: () => {
        this._snackBar.open("ChemCheck has been removed successfully", 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close();
      }
    });
  }
  view_chemcheck_report() {
    let reportdata: any[] = []
    reportdata.push({
      chemcheck_report_name: this.Form.value.chemcheck_name,
      chemcheck_report_format: this.Form.value.chemcheck_format,
      chemcheck_report: 'report'
    })
    this.dialog.open(ViewChemcheckReportComponent, { data: reportdata[0] })
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
