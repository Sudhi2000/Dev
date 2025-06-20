import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HazardService } from 'src/app/services/hazards.api.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

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
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ModifyComponent implements OnInit {
  files: File[] = [];
  evidenceData: any[] = []

  addMoreEvidence: boolean = false
  evidenceIds: any[] = [];
  evidenceMultipleIds: any[] = []



  orgID: string
  Form: FormGroup
  categories: any[] = []
  subcategories: any[] = []
  observations: any[] = []
  moreFiles: File[] = [];
  newFiles: File[] = []

  observationData: any[] = []
  divisions: any[] = []
  divisionUuids: any[] = []
  evidenceID: number
  peopleList: any[] = []
  minDate = new Date();
  duedate = new FormControl(null, [Validators.required]);
  dropdownValues: any[] = []
  evidenceImageCount: number = 0
  evidenceCount: number = 0
  fileCount: number = 0
  Division = new FormControl(null, [Validators.required]);
  unitSpecific: any
  userDivision: any
  corporateUser: any
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  evidenceFormData = new FormData()
  userBusinessUnit: any
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
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private imageCompress: NgxImageCompressService,
    private _snackBar: MatSnackBar,
    private hazardService: HazardService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.files = []
    this.moreFiles = []


    this.configuration()
    this.Form = this.formBuilder.group({
      id: ['', [Validators.required]],
      evidence_id: [''],
      reported_date: [''],
      reference_number: ['', [Validators.required]],
      category: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
      level: ['', [Validators.required]],
      reporter: [null],
      reporterName: ['', [Validators.required]],
      reporterDesignation: [''],
      observation: ['', [Validators.required]],
      division: ['', [Validators.required]],
      location_department: ['', [Validators.required]],
      sub_location: [''],
      assignee: [null, [Validators.required]],
      due_date: [null, [Validators.required]],
      description: [''],
      org_id: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
      status: ['', [Validators.required]],
      resolution: [''],
      updated: ['', [Validators.required]],
      evidence_type: [''],
      modified_evidence: [''],
      responsible_name: [''],
      evidence_name: [''],
      business_unit: [null],
      assignee_notification: [null],
      unsafe: ['', [Validators.required]],
      add_more_evidence: [false],
      moreEvidence: []

    });

  }

  isFormValid() {
    return this.Form.get('category')?.valid &&
      this.Form.get('sub_category')?.valid &&
      this.Form.get('division')?.valid;
  }
  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.hazard_risk
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
        const status = result.ehs_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['updated'].setValue(result.profile.id)
          this.get_dropdown_values()
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_profiles()
              this.get_division()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
                this.divisionUuids.push(elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_hazard_approvers()
            }
          } else {
            this.get_profiles()
            this.get_division()
          }

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_observation_types() {

    this.hazardService.get_observations().subscribe({
      next: (result: any) => {
        this.observationData = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.get_ehs_details()

      }
    })
  }

  get_division() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
        }));

        this.divisions = newArray;
      },
      error: (err: any) => { },
      complete: () => {

      }

    })
  }

  get_profiles() {
    this.hazardService.get_hazard_approvers(this.orgID).subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    })



    // this.authService.get_profiles(this.orgID).subscribe({
    //   next: (result: any) => {
    //     const filteredData = result.data.filter((person: any) => person.attributes.user?.data?.attributes?.blocked === false);
    //     this.peopleList = filteredData;
    //   },
    //   error: (err: any) => {
    //     this.router.navigate(["/error/internal"])
    //   },
    //   complete: () => {
    //     this.get_division()
    //   }
    // });
  }
  get_unit_specific_hazard_approvers() {
    this.hazardService.get_unit_specific_hazard_approvers(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
  //get dropdown values
  get_dropdown_values() {
    const module = "Hazard and Risk"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.get_observation_types()

      }
    })
  }

  get_ehs_details() {
    this.files = []
    this.moreFiles = []

    const reference = this.route.snapshot.paramMap.get('id');
    this.hazardService.get_ehs_details(this.orgID, reference).subscribe({
      next: (result: any) => {



        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if ((result.data[0].attributes.status == 'Open' || result.data[0].attributes.status == 'Draft') && (matchFound || matchFound !== false)) {
          this.Form.controls['id'].setValue(result.data[0].id)
          this.get_categories()
          this.Form.controls['category'].setValue(result.data[0].attributes.category)
          this.get_subcategory()
          this.Form.controls['sub_category'].setValue(result.data[0].attributes.sub_category)
          this.get_observationType()
          this.Form.controls['observation'].setValue(result.data[0].attributes.observation)
          this.Form.controls['division'].setValue(result.data[0].attributes.division)
          this.Form.controls['location_department'].setValue(result.data[0].attributes.location_department)
          this.Form.controls['sub_location'].setValue(result.data[0].attributes.sub_location)
          this.Form.controls['description'].setValue(result.data[0].attributes.description)
          this.Form.controls['status'].setValue(result.data[0].attributes.status)
          this.Form.controls['resolution'].setValue(result.data[0].attributes.resolution)
          this.Form.controls['level'].setValue(result.data[0].attributes.level)
          this.Form.controls['unsafe'].setValue(result.data[0].attributes.unsafe)
          //this.duedate.setValue(new Date(result.data[0].attributes.due_date))
          const dueDateValue = result.data[0].attributes.due_date;

          if (dueDateValue) {
            this.duedate.setValue(new Date(dueDateValue)); // Set date if it's not null
          } else {
            this.duedate.setValue(null); // Set null if no valid date
          }

          this.Form.controls['assignee'].setValue(result.data[0].attributes?.assignee?.data?.id)
          this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
          this.Form.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
          this.Form.controls['reporter'].setValue(result.data[0].attributes.reporter.data.id)
          this.Form.controls['reporterName'].setValue(result.data[0].attributes.reporter.data.attributes.first_name + ' ' + result.data[0].attributes.reporter.data.attributes.last_name)
          this.Form.controls['reporterDesignation'].setValue(result.data[0].attributes.reporter.data.attributes.designation)
          this.Form.controls['due_date'].setValue(result.data[0].attributes.due_date)
          this.Division.setValue(result.data[0].attributes.division)
          this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
          this.Form.controls['assignee_notification'].setValue(result.data[0].attributes.assignee_notification)
          this.evidenceData = result.data[0].attributes.ehs_evidences.data
          if (this.evidenceData.length > 0) {
            this.Form.controls['evidence'].setValue('OK')
            this.addMoreEvidence = true

          } else {
            this.Form.controls['evidence'].reset()
            this.addMoreEvidence = false


          }
          result.data[0].attributes.ehs_evidences.data.forEach((evidence: any) => {
            const loadImageAtIndex = (index: number) => {
              if (index >= result.data[0].attributes.ehs_evidences.data.length) {
                return;
              }
              this.hazardService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
                let blobType = '';
                let fileType = evidence.attributes.format.toLowerCase();
                blobType = 'image/' + fileType;
                const blob = new Blob([data], { type: blobType });
                const file = new File([blob], evidence.attributes.evidence_name + '.' + evidence.attributes.format, { type: blobType });
                const documentId = evidence.id;
                const imageUrl = URL.createObjectURL(blob);
                const evidenceInfo = {
                  id: documentId,
                  file_name: evidence.attributes.evidence_name,
                  file_format: evidence.attributes.format,
                  file: file,
                  pdfUrl: imageUrl,
                  type: blobType,
                  imageID: Number(evidence.attributes.image_id)
                };
                this.evidenceIds.push(evidenceInfo);
                this.files.push(file);
                loadImageAtIndex(index + 1);
              })
            }
            loadImageAtIndex(0);
          })
          this.Division.setValue(result.data[0].attributes.division)

          if (result.data[0].attributes.ehss_multiple_evidences?.data?.length > 0) {


            this.Form.controls['add_more_evidence'].setValue(true)
            result.data[0].attributes.ehss_multiple_evidences.data.forEach((evidence: any) => {
              const loadImageAtMultipleIndex = (index: number) => {
                if (index >= result.data[0].attributes.ehss_multiple_evidences.data.length) {
                  return;
                }
                this.hazardService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
                  let blobType = '';
                  let fileType = evidence.attributes.format.toLowerCase();
                  blobType = 'image/' + fileType;
                  const blob = new Blob([data], { type: blobType });
                  const file = new File([blob], evidence.attributes.evidence_name + '.' + evidence.attributes.format, { type: blobType });
                  const documentId = evidence.id;
                  const imageUrl = URL.createObjectURL(blob);
                  const evidenceMultipleInfo = {
                    id: documentId,
                    file_name: evidence.attributes.evidence_name,
                    file_format: evidence.attributes.format,
                    file: file,
                    pdfUrl: imageUrl,
                    type: blobType,
                    imageID: Number(evidence.attributes.image_id)
                  };
                  this.evidenceMultipleIds.push(evidenceMultipleInfo);
                  this.moreFiles.push(file);

                  loadImageAtMultipleIndex(index + 5);
                })
              }
              loadImageAtMultipleIndex(0);
            })



            // result.data[0].attributes.ehss_multiple_evidences.data.forEach((evidence: any) => {
            //   this.hazardService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
            //     this.moreFiles.push(data)
            //   })

            // })



          } else {
            this.Form.controls['add_more_evidence'].setValue(false)

          }





        }
        else {
          this.router.navigate(["/apps/hazard-risk/history"])
        }
        // if(!this.unitSpecific){
        //   if (result.data[0].attributes.status == 'Open'&& !matchFound){
        //     this.Form.controls['id'].setValue(result.data[0].id)
        //     this.get_categories()
        //     this.Form.controls['category'].setValue(result.data[0].attributes.category)
        //     this.get_subcategory()
        //     this.Form.controls['sub_category'].setValue(result.data[0].attributes.sub_category)
        //     this.get_observationType()
        //     this.Form.controls['observation'].setValue(result.data[0].attributes.observation)
        //     this.Form.controls['division'].setValue(result.data[0].attributes.division)
        //     this.Form.controls['location_department'].setValue(result.data[0].attributes.location_department)
        //     this.Form.controls['sub_location'].setValue(result.data[0].attributes.sub_location)
        //     this.Form.controls['description'].setValue(result.data[0].attributes.description)
        //     this.Form.controls['status'].setValue(result.data[0].attributes.status)
        //     this.Form.controls['level'].setValue(result.data[0].attributes.level)
        //     this.Form.controls['unsafe'].setValue(result.data[0].attributes.unsafe)
        //     this.duedate.setValue(new Date(result.data[0].attributes.due_date))
        //     this.Form.controls['assignee'].setValue(result.data[0].attributes.assignee.data.id)
        //     this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        //     this.Form.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
        //     this.Form.controls['reporterName'].setValue(result.data[0].attributes.reporter.data.attributes.first_name + ' ' + result.data[0].attributes.reporter.data.attributes.last_name)
        //     this.Form.controls['reporterDesignation'].setValue(result.data[0].attributes.reporter.data.attributes.designation)
        //     this.Form.controls['due_date'].setValue(result.data[0].attributes.due_date)
        //     this.Division.setValue(result.data[0].attributes.division)
        //     this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
        //     this.Form.controls['assignee_notification'].setValue(result.data[0].attributes.assignee_notification)
        //     this.evidenceData = result.data[0].attributes.ehs_evidences.data
        //     if (this.evidenceData.length > 0) {
        //       this.Form.controls['evidence'].setValue('OK')
        //     } else {
        //       this.Form.controls['evidence'].reset()
        //     }
        //     result.data[0].attributes.ehs_evidences.data.forEach((evidence: any) => {
        //       this.hazardService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
        //         this.files.push(data)
        //       })
        //     })
        //     this.Division.setValue(result.data[0].attributes.division)

        //   }
        //   else{

        // this.router.navigate(["/apps/hazard-risk/history"])
        //   }
        // }
        // else if(this.corporateUser){
        //   if(result.data[0].attributes.status == 'Open'&& matchFound){
        //     this.Form.controls['id'].setValue(result.data[0].id)
        //     this.get_categories()
        //     this.Form.controls['category'].setValue(result.data[0].attributes.category)
        //     this.get_subcategory()
        //     this.Form.controls['sub_category'].setValue(result.data[0].attributes.sub_category)
        //     this.get_observationType()
        //     this.Form.controls['observation'].setValue(result.data[0].attributes.observation)
        //     this.Form.controls['division'].setValue(result.data[0].attributes.division)
        //     this.Form.controls['location_department'].setValue(result.data[0].attributes.location_department)
        //     this.Form.controls['sub_location'].setValue(result.data[0].attributes.sub_location)
        //     this.Form.controls['description'].setValue(result.data[0].attributes.description)
        //     this.Form.controls['status'].setValue(result.data[0].attributes.status)
        //     this.Form.controls['level'].setValue(result.data[0].attributes.level)
        //     this.Form.controls['unsafe'].setValue(result.data[0].attributes.unsafe)
        //     this.duedate.setValue(new Date(result.data[0].attributes.due_date))
        //     this.Form.controls['assignee'].setValue(result.data[0].attributes.assignee.data.id)
        //     this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        //     this.Form.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
        //     this.Form.controls['reporterName'].setValue(result.data[0].attributes.reporter.data.attributes.first_name + ' ' + result.data[0].attributes.reporter.data.attributes.last_name)
        //     this.Form.controls['reporterDesignation'].setValue(result.data[0].attributes.reporter.data.attributes.designation)
        //     this.Form.controls['due_date'].setValue(result.data[0].attributes.due_date)
        //     this.Division.setValue(result.data[0].attributes.division)
        //     this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
        //     this.Form.controls['assignee_notification'].setValue(result.data[0].attributes.assignee_notification)
        //     this.evidenceData = result.data[0].attributes.ehs_evidences.data
        //     if (this.evidenceData.length > 0) {
        //       this.Form.controls['evidence'].setValue('OK')
        //     } else {
        //       this.Form.controls['evidence'].reset()
        //     }
        //     result.data[0].attributes.ehs_evidences.data.forEach((evidence: any) => {
        //       this.hazardService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
        //         this.files.push(data)
        //       })
        //     })
        //     this.Division.setValue(result.data[0].attributes.division)

        //   }
        //   else{
        //     this.router.navigate(["/apps/hazard-risk/history"])
        //   }
        // }
      },
      error: (err: any) => { },
      complete: () => {
      }

    })
  }

  get_categories() {
    const category = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Category")
    })
    this.categories = category
  }
  BusinessUnit(event: any) {
    const selectedData = this.divisions.find(data => data.division_name === event.value);
    this.Form.controls['division'].setValue(selectedData.division_name)
    this.Form.controls['business_unit'].setValue(selectedData.id)
  }
  get_subcategory() {
    const category = this.Form.value.category
    const data = this.dropdownValues.filter(function (elem) {
      return (elem.attributes.Category === "Sub Category" && elem.attributes.filter === category)
    })
    this.subcategories = data

  }

  get_observationType() {
    const subCategory = this.Form.value.sub_category
    const data = this.observationData.filter(function (elem) {
      return (elem.attributes.dropdown_value.data.attributes.Value === subCategory)
    })
    this.observations = data

  }

  observation(data: any) {
    this.Form.controls['observation'].reset()
    this.observations = []
    const observation = this.observationData.filter(function (elem) {
      return (elem.attributes.dropdown_value?.data?.attributes?.Value === data.value)
    })
    this.observations = observation
  }

  subCategory(data: any) {

  }

  handleFileInput(data: any) {

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
  submit(data: any) {

    if (data === 'Submit') {
      Swal.fire({
        title: 'Are you sure?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.Form.controls['status'].setValue('Open')
          // this.Form.controls['assignee_notification'].setValue(true)
          this.showProgressPopup();
          this.check_ehs_status()

        }
      })
    }
    else if (data === 'Submit-notify') {
      Swal.fire({
        title: 'Are you sure?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.Form.controls['status'].setValue('Open')
          this.Form.controls['assignee_notification'].setValue(false)
          this.showProgressPopup();
          this.check_ehs_status()

        }
      })
    }
    else if (data === 'Save') {
      this.Form.controls['status'].setValue('Draft')
      this.showProgressPopup();
      this.check_ehs_status()
    }
  }

  check_ehs_status() {

    const status = this.Form.value.status
    if (status === "Draft") {
      this.update_hazard()
    }
    else if (status === "Open") {
      this.Form.controls['resolution'].setValue('Open')
      this.update_hazard()
    } else {
      Swal.fire({
        title: 'Unable to Update',
        imageUrl: "assets/images/unable-proceed.gif",
        imageWidth: 250,
        text: "Sorry, the assignee already started progress in this task. Hence it is unable to modify the contents.",
        showCancelButton: false,

      }).then((result) => {
        this.router.navigate(["/apps/hazard-risk/history"])
      })

    }



  }





  update_hazard() {
    this.hazardService.update_ehs(this.Form.value).subscribe({
      next: (result: any) => {
      },
      error: (err: any) => { },
      complete: () => {
        if (this.Form.value.status === 'Open') {
          this.create_notification()
        }
        Swal.close()
        const statusText = "Details Updated"
        this._snackBar.open(statusText, 'Close', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.ngOnInit()
      }
    })
  }



  riskLevel(data: any) {
    this.Form.controls['level'].setValue(data.value)
    if (data.value === "High") {
      const sysdate = new Date()
      const date = sysdate.setDate(sysdate.getDate() + 10)
      this.duedate.setValue(new Date(date))
      this.Form.controls['due_date'].setValue(new Date(date))
    } else if (data.value == "Medium") {
      const sysdate = new Date()
      const date = sysdate.setDate(sysdate.getDate() + 20)
      this.duedate.setValue(new Date(date))
      this.Form.controls['due_date'].setValue(new Date(date))
    } else if (data.value == "Low") {
      const sysdate = new Date()
      const date = sysdate.setDate(sysdate.getDate() + 30)
      this.duedate.setValue(new Date(date))
      this.Form.controls['due_date'].setValue(new Date(date))
    }
  }
  dueDate(date: any) {
    const selecteddate = new Date(date.value)
    this.duedate.setValue(selecteddate);
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['due_date'].setValue(selecteddate)

  }


  responsible(data: any) {
    if (data) {
      this.Form.controls['assignee_notification'].setValue(false)
    }
  }

  onSelect(event: any) {
    this.showProgressPopup()

    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    this.evidenceIds = []
    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / 1024 / 1024
      if (size > 10) {
        Swal.close()

        const statusText = "Please choose an image below 10 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['jpg', 'jpeg', 'png'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.Form.controls['evidence'].setErrors(null)
          this.files.push(...event.addedFiles);
          this.addMoreEvidence = true
          this.upload_evidence()
        } else {
          Swal.close()

          const statusText = "Please choose images ('jpg', 'jpeg', 'png')"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else if (fileLength < 6) {
      Swal.close()
      const statusText = "You have exceed the upload limit"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }

  }

  upload_evidence() {
    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = []
          data.push({
            evidence_name: result[0].hash,
            format: extension,
            hazard: this.Form.value.id,
            id: result[0].id
          })
          this.hazardService.create_ehs_evidence(data[0]).subscribe({
            next: (result: any) => {
              this.get_evidences(result)
            },
            error: (err: any) => { },
            complete: () => {
              Swal.close()
              this.Form.controls['evidence'].setValue('OK')


              const statusText = "Evidence Updated Successfully"
              this._snackBar.open(statusText, 'Close', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              //this.ngOnInit()

            }
          })
        },
        error: (err: any) => { },
        complete: () => {
        }
      })
    })
  }
  create_notification() {
    let data: any[] = []
    data.push({
      module: "Hazard/Risk Management",
      action: 'Reported a new Hazard/Risk:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.assignee,
      access_link: "/apps/hazard-risk/action/",
      profile: this.Form.value.reporter
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        //Swal.close();
        Swal.fire({
          title: 'Hazard / Risk Reported',
          imageUrl: "assets/images/reported.gif",
          imageWidth: 250,
          text: "You have successfully reported a Hazard / Risk. We will notify the assignee to take appropriate action. If it is required to modify the data, you can modify until the assignee start the process.",
          showCancelButton: false,

        })
        this.router.navigate(["/apps/hazard-risk/history"])
      }
    })
  }
  onRemove(file: File, index: number): void {
    this.showProgressPopup()
    this.hazardService.delete_evidence_file(this.evidenceIds[0].imageID).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.hazardService.delete_ehs_evidence(this.evidenceIds[0].id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            this.Form.controls['evidence'].reset()
            const statusText = "Evidence Removed Successfully"
            this._snackBar.open(statusText, 'Close', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            Swal.close()

            // this.ngOnInit()
            //this.get_ehs_details()
            this.files = []
          }
        })
      }
    })

  }

  onRemoveMoreEvidence(file: File, index: number): void {



    const data = this.evidenceMultipleIds.filter(function (elem: any, i: number) {
      return (i === index)
    })



    this.hazardService.delete_evidence_file(data[0].imageID).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.hazardService.delete_ehs_multiple_evidence(data[0].id).subscribe({
          next: (result: any) => {
            if (index > -1 && index < this.evidenceMultipleIds.length) {
              this.evidenceMultipleIds.splice(index, 1);
            }

            if (index > -1 && index < this.moreFiles.length) {

              this.moreFiles.splice(index, 1);

            }




          },
          error: (err: any) => { },
          complete: () => {
            this.Form.controls['evidence'].reset()
            const statusText = "Evidence Removed Successfully"
            this._snackBar.open(statusText, 'Close', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            Swal.close()
            // this.ngOnInit()





          }
        })
      }
    })


    // this.showProgressPopup()
    // if (index < 0 || index >= this.moreFiles.length) {
    //   return;
    // }
    // const documentId = this.evidenceMultipleIds[0].imageID;
    // const evidenceId = this.evidenceMultipleIds[0].id;

    // if (documentId) {
    //   this.hazardService.delete_evidence_file(documentId).subscribe({
    //     next: (result: any) => { },
    //     error: (err: any) => { },
    //     complete: () => {
    //       this.hazardService.delete_ehs_multiple_evidence(evidenceId).subscribe({
    //         next: (result: any) => { },
    //         error: (err: any) => { },
    //         complete: () => {
    //           this.Form.controls['evidence'].reset()
    //           const statusText = "Evidence Removed Successfully"
    //           this._snackBar.open(statusText, 'Close', {
    //             horizontalPosition: this.horizontalPosition,
    //             verticalPosition: this.verticalPosition,
    //           });
    //           this.ngOnInit()
    //           Swal.close()

    //         }
    //       })
    //     }
    //   })

    // }

  }

  onSelectMoreEvidence(event: any) {
    const fileLength = this.moreFiles.length
    const addedLength = event.addedFiles.length
    this.evidenceMultipleIds = []
    this.newFiles = []
    this.moreFiles = []


    if (fileLength < 5 && addedLength < 6) {
      const size = event.addedFiles[0].size / 1024 / 1024
      if (size > 10) {
        const statusText = "Please choose an image below 10 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['jpg', 'jpeg', 'png'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.Form.controls['moreEvidence'].setErrors(null)
          this.newFiles.push(...event.addedFiles);
          this.createMultipleEvidence()
          this.showProgressPopup()

        } else {
          const statusText = "Please choose images ('jpg', 'jpeg', 'png')"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }

    } else if (fileLength < 6) {
      const statusText = "You have exceed the upload limit"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

    }

  }

  createMultipleEvidence() {

    this.moreFiles = []
    this.evidenceFormData = new FormData();

    if (this.newFiles.length > 0) {
      let count = 0
      let totalFile = this.newFiles.length
      this.newFiles.forEach((evidence: any) => {
        const extension = evidence.name.split('.').pop().toLowerCase()
        this.evidenceFormData.append('files', evidence, this.Form.value.reference_number + '.' + extension)
      })

      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {

          result.forEach((elem: any) => {
            let data: any[] = []
            const extension = elem.name.split('.').pop().toLowerCase()
            data.push({
              evidence_name: elem.hash,
              format: extension,
              hazard: this.Form.value.id,
              id: elem.id
            })

            this.hazardService.create_ehs_multiple_evidence(data[0]).subscribe({
              next: (result: any) => {
                this.get_multiple_evidences(result)
              },
              error: (err: any) => { },
              complete: () => {
                count++
                if (totalFile === count) {
                  Swal.close()

                }
              }
            })
          })
        },
        error: (err: any) => { },
        complete: () => {
        }
      })

    }
  }

  get_evidences(result: any) {
    this.evidenceIds = []
    this.hazardService.getImage(environment.client_backend + '/uploads/' + result.data.attributes.evidence_name + '.' + result.data.attributes.format).subscribe((data: any) => {
      let blobType = '';
      let fileType = result.data.attributes.format.toLowerCase();
      blobType = 'image/' + fileType;
      const blob = new Blob([data], { type: blobType });
      const file = new File([blob], result.data.attributes.evidence_name + '.' + result.data.attributes.format, { type: blobType });
      const documentId = result.data.id;
      const imageUrl = URL.createObjectURL(blob);
      const evidenceInfo = {
        id: documentId,
        file_name: result.data.attributes.evidence_name,
        file_format: result.data.attributes.format,
        file: file,
        pdfUrl: imageUrl,
        type: blobType,
        imageID: Number(result.data.attributes.image_id)
      };
      this.evidenceIds.push(evidenceInfo);


    })
  }

  get_multiple_evidences(result: any) {
    this.evidenceMultipleIds = []
    this.hazardService.getImage(environment.client_backend + '/uploads/' + result.data.attributes.evidence_name + '.' + result.data.attributes.format).subscribe((data: any) => {
      let blobType = '';
      let fileType = result.data.attributes.format.toLowerCase();
      blobType = 'image/' + fileType;
      const blob = new Blob([data], { type: blobType });
      const file = new File([blob], result.data.attributes.evidence_name + '.' + result.data.attributes.format, { type: blobType });
      const documentId = result.data.id;
      const imageUrl = URL.createObjectURL(blob);
      const evidenceMultipleInfo = {
        id: documentId,
        file_name: result.data.attributes.evidence_name,
        file_format: result.data.attributes.format,
        file: file,
        pdfUrl: imageUrl,
        type: blobType,
        imageID: Number(result.data.attributes.image_id)
      };
      this.evidenceMultipleIds.push(evidenceMultipleInfo);
      this.moreFiles.push(file);


    })
  }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

  navigate() {
    this.router.navigate(["/apps/hazard-risk/history"])
    this.backToHistory = true
  }


}
