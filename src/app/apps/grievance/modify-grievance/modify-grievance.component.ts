import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { COMMA, ENTER, S } from '@angular/cdk/keycodes';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NewDepartmentComponent } from '../../general-component/new-department/new-department.component';
import { NewSubmissionComponent } from '../new-submission/new-submission.component';
import { GrievanceService } from 'src/app/services/grievance.api.service';
import { NewDesignationComponent } from '../../general-component/new-designation/new-designation.component';
import { NewTopicComponent } from '../new-topic/new-topic.component';
import { Observable, map, startWith } from 'rxjs';
import { NewEmployeeShiftComponent } from '../new-employee-shift/new-employee-shift.component';
import { Location } from '@angular/common';
import { NewAllegedPartyComponent } from '../new-alleged-party/new-alleged-party.component';
const { Configuration, OpenAIApi } = require("openai");

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
  selector: 'app-modify-grievance',
  templateUrl: './modify-grievance.component.html',
  styleUrls: ['./modify-grievance.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ModifyGrievanceComponent implements OnInit {

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
  genderData: any[] = [];
  tenureSplit: any[] = [];
  channels: any[] = [];
  personType: any[] = [];
  Categories: any[] = []
  humanRights: any[] = []
  Frequencies: any[] = [];
  Scales: any[] = []
  gracePeriods: any[] = []
  allegedParties: any[] = []
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  anonymousForm: FormGroup
  divisions: any[] = []
  Business_Unit = new FormControl(null, [Validators.required]);
  Submissions: any[] = []
  departments: any[] = []
  designations: any[] = []
  Selectedvalues: any[] = [];
  joindate = new FormControl(null);
  evidenceFormData = new FormData()
  evidenceData: any
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  dropdownValues: any
  chairperson: number
  topics: any[] = []
  filteredTopics: any[] = []
  submissionDate = new FormControl(new Date());
  employeeShifts: any[] = []
  shifts: any[] = []
  filteredOptions: Observable<string[]>;
  myControl = new FormControl('');
  userDivision: any
  corporateUser: any
  CheckcorporateUser: boolean = false
  unitSpecific: any
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
  selectedDivision: any;
  peopleList: any[] = [];
  DivisionFilteredpeopleList: any[] = [];


  constructor(private generalService: GeneralService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private grievanceService: GrievanceService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _location: Location) {
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.employeeShifts.filter(option => option.toLowerCase().includes(filterValue));
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
      remarks: [''],
      evidence_before: [''],
      helpdesk_person: ['', [Validators.required]],
      responsible_department: ['', [Validators.required]],
      submission_date: [new Date()],
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
      assignee: ['', [Validators.required]],
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
      employee_shift: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      date_of_join: [null, [Validators.required]],
      service_period: ['', [Validators.required]],
      tenure_split: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      supervisor: ['', [Validators.required]],
      location: ['']
    })
    this.Form.controls['type'].setValue(this.type)
    this.Form.controls['subtype'].setValue(this.subtype)
    this.Form.controls['severity_score'].disable()
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
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
        this.CheckcorporateUser = result.profile.corporate_user
        const status = result.grev_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_dropdown_values()
          this.get_department()
          this.get_submission()
          this.get_designation()
          this.get_profiles()
          this.get_grievance_details()
          this.get_employee_shifts()
          this.get_topic()
          this.get_alleged_party()
          this.get_users()
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {

              this.get_divisions()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisionUuids.push(elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results
            }
          } else {
            this.get_divisions()

          }

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  new_employee_shift() {
    this.dialog.open(NewEmployeeShiftComponent).afterClosed().subscribe((data: any) => {
      const newShift = data.employee_shift;
      this.grievanceService.create_employee_shift(newShift).subscribe({
        next: (result: any) => {
          this.grievanceService.get_employee_shifts().subscribe({
            next: (result: any) => {
              this.shifts = result.data;
              this.anonymousForm.controls['employee_shift'].setValue(newShift)
              this.cdr.detectChanges();
              const statusText = 'Employee Shift Created Successfully';
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            },
            error: (err: any) => {
              this.router.navigate(['/error/internal']);
            },
            complete: () => { },
          });
        },
        error: (err: any) => {
          this.router.navigate(['/error/internal']);
        },
        complete: () => { },
      });
    });

  }

  get_users() {
    this.authService.get_profiles(this.Form.value.org_id).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter(
          (profile: any) =>
            profile.attributes.user?.data?.attributes?.blocked === false
        );
        this.peopleList = filteredData;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }

  initialFilteredAssignee(data: string): void {


    const selectedBusinessUnitUuid = data
    this.DivisionFilteredpeopleList = this.peopleList.filter((data) =>
      data.attributes.divisions.data
        .map((division: any) => division.attributes.division_uuid)
        .includes(selectedBusinessUnitUuid)
    );


  }

  new_topic() {
    if (this.CheckcorporateUser === true) {
      this.dialog.open(NewTopicComponent).afterClosed().subscribe((data: any) => {
        const name = data.name
        const category = this.Form.value.category
        this.grievanceService.create_topic(name, category, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.grievanceService.get_topic().subscribe({
              next: (result: any) => {
                this.topics = result.data
                const topics = this.topics.filter(function (elem: any) {
                  return (elem.attributes.category === category)
                })
                this.filteredTopics = topics

              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Topic created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['topic'].setValue(data.name)
              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })

      })
    }
    else {
      Swal.fire({
        title: 'Access Denied!',
        text: "Only corporate users can create a new topic.",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    }

  }

   get_alleged_party() {
      this.grievanceService.get_alleged_party().subscribe({
        next: (result: any) => {
          this.allegedParties = result.data
        },
        error: (err: any) => { },
        complete: () => { }
      })
    }
    new_alleged_party() {
        this.dialog.open(NewAllegedPartyComponent).afterClosed().subscribe((data: any) => {
          this.grievanceService.create_alleged_party(data.name, this.Form.value.reporter).subscribe({
            next: (result: any) => {
          
              this.grievanceService.get_alleged_party().subscribe({
                next: (result: any) => {
                  this.allegedParties = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Alleged Party created successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['alleged_party'].setValue(data.name)
                }
              })
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
            }
          })
  
        })
  
    }
  get_employee_shifts() {
    this.grievanceService.get_employee_shifts().subscribe({
      next: (result: any) => {
        this.shifts = result.data
      }
    })
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

        if ((result.data[0].attributes.status === 'Draft') && (matchFound || matchFound !== false)) {
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['type'].setValue(result.data[0].attributes.type)
          this.Form.controls['description'].setValue(result.data[0].attributes.description)
          this.Form.controls['status'].setValue(result.data[0].attributes.status)
          this.Form.controls['submissions'].setValue(result.data[0].attributes.submissions)
          this.Form.controls['remarks'].setValue(result.data[0].attributes.remarks)
          this.Form.controls['helpdesk_person'].setValue(result.data[0].attributes.helpdesk_person)
          this.Form.controls['responsible_department'].setValue(result.data[0].attributes.responsible_department)
          this.Form.controls['channel'].setValue(result.data[0].attributes.channel)
          this.Form.controls['category'].setValue(result.data[0].attributes.category)
          this.Form.controls['alleged_party'].setValue(result.data[0].attributes.alleged_party)
          this.Form.controls['reported_date'].setValue(new Date(result.data[0].attributes.created_date))

          const topics = this.topics.filter(function (elem: any) {
            return (elem.attributes.category === result.data[0].attributes.category)
          })
          this.filteredTopics = topics
          this.Form.controls['topic'].setValue(result.data[0].attributes.topic)
          this.Form.controls['anonymous'].setValue(result.data[0].attributes.anonymous)
          this.Form.controls['case_id'].setValue(result.data[0].attributes.case_id)
          this.Form.controls['scale'].setValue(result.data[0].attributes.scale)
          this.Form.controls['severity_score'].setValue(result.data[0].attributes.severity_score)
          this.Form.controls['human_rights_violation'].setValue(result.data[0].attributes.human_rights_violation)
          this.Form.controls['frequency_rate'].setValue(result.data[0].attributes.frequency_rate)
          this.Form.controls['due_date'].setValue(result?.data[0]?.attributes?.due_date)
          this.anonymousForm.controls['person_type'].setValue(result.data[0].attributes.person_type)
          if(result.data[0].attributes.person_type === 'Visitor'){
            this.anonymousForm.controls['employee_shift'].removeValidators(Validators.required)
            this.anonymousForm.controls['employee_shift'].updateValueAndValidity
            this.anonymousForm.controls['supervisor'].removeValidators(Validators.required)
            this.anonymousForm.controls['supervisor'].updateValueAndValidity
          
          }
          else{
            this.anonymousForm.controls['employee_shift'].setValidators(Validators.required)
            this.anonymousForm.controls['employee_shift'].updateValueAndValidity
            this.anonymousForm.controls['supervisor'].setValidators(Validators.required)
            this.anonymousForm.controls['supervisor'].updateValueAndValidity
           
          }
          this.anonymousForm.controls['division'].setValue(result.data[0].attributes.division)
          this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit)
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
          this.Business_Unit.setValue(result.data[0].attributes.business_unit.data?.attributes.division_name)
          this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
          this.Form.controls['assignee'].setValue(result.data[0].attributes.assignee?.data?.id)
          this.joindate.setValue(new Date(result.data[0].attributes.date_of_join))
          this.evidenceData = result.data[0].attributes.grievance_evidences.data
          if (this.evidenceData.length > 0) {
            this.Form.controls['evidence_before'].setValue('OK')
          } else {
            this.Form.controls['evidence_before'].reset()
          }
          const evidence__data = result.data[0].attributes.grievance_evidences.data
          if (evidence__data.length > 0) {
            this.Form.controls['evidence_id'].setValue(evidence__data[0].id)

            evidence__data.forEach((evidence: any) => {
              this.generalService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
                this.files.push(data)
              })

            })
          }

          if (result.data[0].attributes.type === 'Complaint') {
            this.initialFilteredAssignee(result.data[0].attributes.business_unit.data.attributes.division_uuid)
          }




        }
        else {
          this.router.navigate(["/apps/grievance/register"])
        }

      },
      error: (err: any) => { },
      complete: () => { }

    })
  }
  get_profiles() {
    this.authService.get_chairperson_list(this.orgID).subscribe({
      next: (result: any) => {
        this.chairperson = result.data[0].id
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    });
  }

  joinDate(data: any) {
    this.anonymousForm.controls['date_of_join'].setValue(new Date(data.value))
    const date = new Date()
    const doj = new Date(data.value)
    const differ = Number(date) - Number(doj)
    const year = new Date(differ).getUTCFullYear() - 1970
    const month = new Date(differ).getUTCMonth()
    const days = new Date(differ).getUTCDate()
    const servicePeriod = year + " Years, " + month + " Months, " + days + " Days"
    this.anonymousForm.controls['service_period'].setValue(servicePeriod)
    this.anonymousForm.controls['service_period'].disable()
    if (year === 0 && month >= 0 && month <= 6) {
      this.anonymousForm.controls['tenure_split'].setValue('0-6 Months')
    } else if (year === 0 && month >= 7 && month <= 12) {
      this.anonymousForm.controls['tenure_split'].setValue('7-12 Months')
    } else if (year >= 1 && month >= 0 && year < 2) {
      this.anonymousForm.controls['tenure_split'].setValue('1-2 Years')
    } else if (year >= 2 && month >= 0 && year < 3) {
      this.anonymousForm.controls['tenure_split'].setValue('2-3 Years')
    } else if (year >= 3 && month >= 0 && year < 4) {
      this.anonymousForm.controls['tenure_split'].setValue('3-4 Years')
    } else if (year >= 4 && month >= 0 && year < 5) {
      this.anonymousForm.controls['tenure_split'].setValue('4-5 Years')
    } else if (year >= 5) {
      this.anonymousForm.controls['tenure_split'].setValue('Above 5 Years')
    }
    this.anonymousForm.controls['tenure_split'].disable()


  }
  submission_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1))
    this.Form.controls['submission_date'].setValue(newDate);


  }
  dueDate() {
    this.Form.controls['severity_score'].enable()
    this.Form.controls['due_date'].enable()
    const submissiondate = this.Form.value.submission_date;
    const severity = this.Form.value.severity_score;
    const matchingGracePeriod = this.gracePeriods.find((gracePeriod) => {
      return gracePeriod.attributes.filter === severity
    });
    if (matchingGracePeriod) {
      const dueValue = matchingGracePeriod.attributes.Value;
      const dueDate = new Date(submissiondate.getTime() + dueValue * 24 * 60 * 60 * 1000);
      this.Form.controls['due_date'].setValue(dueDate);
      this.Form.controls['severity_score'].disable()
    } else {
      // Grace period not found for the severity score
    }
  }

  //get dropdown values
  get_dropdown_values() {
    const module = "General"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (generalResult: any) => {
        // this.dropdownValues = result.data
        //Gender
        const gender = generalResult.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Gender")
        })
        this.genderData = gender
        //Tenure Split
        const tenure = generalResult.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Tenure Split")
        })

        this.tenureSplit = tenure
        //Person Type
        const Person = generalResult.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Person Type")
        })

        this.personType = Person


        const socialModule = "Grievance"
        this.generalService.get_dropdown_values(socialModule).subscribe({
          next: (grievanceResult: any) => {
            this.Selectedvalues = grievanceResult.data
            //channel
            const channel = grievanceResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Channel")
            })

            this.channels = channel

            //Category
            const category = grievanceResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Category")
            })

            this.Categories = category
            //Human Rights Violation
            const Violation = grievanceResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Human Rights Violation")
            })

            this.humanRights = Violation
            //Scale
            const scale = grievanceResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Scale")
            })

            this.Scales = scale
            //Frequency rate
            const frequency = grievanceResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Frequency Rate")
            })

            this.Frequencies = frequency

            //Due Date Grace Period
            const due = grievanceResult.data.filter(function (elem: any) {
              return (elem.attributes.Category === "Due Date Grace Period")
            })

            this.gracePeriods = due
          },
          error: (err: any) => { },
          complete: () => { }
        })
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }


  onSelect(event: any) {
    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 6) {
      const size = event.addedFiles[0].size / 1024 / 1024
      if (size > 2) {
        const statusText = "Please choose an image below 2 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['jpg', 'jpeg', 'png'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.Form.controls['evidence_before'].setErrors(null)
          this.files.push(...event.addedFiles);
          this.upload_evidence()
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
  upload_evidence() {
    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.evidenceFormData.append('files', elem, this.Form.value.case_id + '.' + extension)
      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = []
          data.push({
            evidence_name: result[0].hash,
            format: extension,
            grievance: this.Form.value.id,
            id: result[0].id
          })
          this.grievanceService.create_grievance_evidence(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => { }
          })
        },
        error: (err: any) => { },
        complete: () => {
          const statusText = "Evidence Created"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          // this.files = []
          //this.get_grievance_details()
        }
      })
    })
  }


  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.deleteEvidence()
  }

  deleteEvidence() {
    const evidenceID = this.Form.value.evidence_id
    this.showProgressPopup();
    this.grievanceService.delete_grievance_evidence(evidenceID).subscribe({
      next: (result: any) => {
        this.generalService.delete_image(result.data.attributes.evidece_id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            Swal.close()
            const statusText = "Evidence deleted"
            this._snackBar.open(statusText, 'Close Warning', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            // this.get_grievance_details()
            Swal.close()
          }
        })
      },
      error: (err: any) => { },
      complete: () => {



      }
    })
  }


  //get divisions
  // get_divisions() {
  //   this.generalService.get_division(this.orgID).subscribe({
  //     next: (result: any) => {
  //       this.divisions = result.data
  //     },
  //     error: (err: any) => {
  //       this.router.navigate(["/error/internal"])
  //     },
  //     complete: () => { }
  //   })
  // }
  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
          division_uuid: attributes.division_uuid
        }));

        this.divisions = newArray;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }
  BusinessUnit(event: any) {
    const selectedData = this.divisions.find(data => data.division_name === event.value);

    const grievanceType = this.Form.controls['type'].value
    if (grievanceType === 'Complaint') {
      this.Form.controls['assignee'].setValue('')
      const selectedBusinessUnitUuid = selectedData.division_uuid
      this.DivisionFilteredpeopleList = this.peopleList.filter((data) =>
        data.attributes.divisions.data
          .map((division: any) => division.attributes.division_uuid)
          .includes(selectedBusinessUnitUuid)
      );


    }



    this.Form.controls['business_unit'].setValue(selectedData.id)
    this.anonymousForm.controls['division'].setValue(selectedData.division_name)
    this.selectedDivision = event.value

  }
  get_department() {
    this.generalService.get_department().subscribe({
      next: (result: any) => {

        this.departments = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }
  new_res_dept() {
    if (this.CheckcorporateUser === true) {

      this.dialog.open(NewDepartmentComponent).afterClosed().subscribe((data: any) => {
        const name = data.name
        this.generalService.create_department(name, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.generalService.get_department().subscribe({
              next: (result: any) => {
                this.departments = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Department created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['responsible_department'].setValue(data.name)
              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })

      })
    }
    else {
      Swal.fire({
        title: 'Access Denied!',
        text: "Only corporate users can create a new department.",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    }

  }
  onPersonTypeChange(data: any) {
    if(data.value === 'Visitor'){
      this.anonymousForm.controls['employee_shift'].clearValidators();
      this.anonymousForm.controls['employee_shift'].updateValueAndValidity()
      this.anonymousForm.controls['employee_shift'].reset()

      this.anonymousForm.controls['supervisor'].clearValidators();
      this.anonymousForm.controls['supervisor'].updateValueAndValidity()
      this.anonymousForm.controls['supervisor'].reset()
    
    }
    else{
      this.anonymousForm.controls['employee_shift'].setValidators(Validators.required)
      this.anonymousForm.controls['employee_shift'].updateValueAndValidity()
      this.anonymousForm.controls['supervisor'].setValidators(Validators.required)
      this.anonymousForm.controls['supervisor'].updateValueAndValidity()
     
    }
    this.anonymousForm.controls['division'].reset()
    this.anonymousForm.controls['employee_id'].reset()
    this.anonymousForm.controls['date_of_join'].reset()
    this.joindate.reset()
    this.anonymousForm.controls['service_period'].reset()
    this.anonymousForm.controls['tenure_split'].reset()
    this.anonymousForm.controls['designation'].reset()
    this.anonymousForm.controls['department'].reset()
  }

  GenerateDescription() {
    const channel = this.Form.value.channel
    const category = this.Form.value.category
    const topic = this.Form.value.topic
    const submissions = this.Form.value.submissions

    if (channel && category && topic && submissions) {
      document.getElementById('error-text')?.classList.add("hide");

      const stringWithoutPTags = `Channel: ${channel}, Category: ${category}, Topic: ${topic}, Submissions: ${submissions}`;
      this.chatGPT(stringWithoutPTags)
    } else {
      document.getElementById('error-text')?.classList.remove("hide");
    }
    // this.Form.controls['reported_date'].disable()
  }

  async chatGPT(stringWithoutPTags: any) {
    document.getElementById('ai-loader')?.classList.remove("hide");
    document.getElementById('ai-suggest')?.classList.add("hide");
    const category = this.Form.value.heirarchy_control;
    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const message = 'The selected channel for this submission is ${channel}, which falls under the category of ${category}. The main topic being discussed is "${topic}," and there have been ${submissions} submissions related to this topic' + stringWithoutPTags + 'Avoid bullet points. write a description'
    let requestData = {
      model: "gpt-3.5-turbo",
      format: "html",
      messages: [{ role: "user", content: message }],
    };
    let apiResponse = await openai.createChatCompletion(requestData);
    const completion_tokens = apiResponse.data.usage.completion_tokens
    const prompt_tokens = apiResponse.data.usage.prompt_tokens
    const total_tokens = apiResponse.data.usage.total_tokens
    this.control_event_open_ai(completion_tokens, prompt_tokens, total_tokens)
    this.Form.controls['description'].setValue('<p>' + apiResponse.data.choices[0].message.content + '</p>')
    document.getElementById('ai-loader')?.classList.add("hide");
    document.getElementById('ai-suggest')?.classList.remove("hide");
  }

  control_event_open_ai(completion_tokens: any, prompt_tokens: any, total_tokens: any) {
    this.grievanceService.create_open_ai(this.Form.value, completion_tokens, prompt_tokens, total_tokens).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {

      }
    })

  }

  new_name() {

    this.dialog.open(NewDepartmentComponent).afterClosed().subscribe((data: any) => {

      const name = data.name
      this.generalService.create_department(name, this.Form.value.reporter).subscribe({
        next: (result: any) => {
          this.generalService.get_department().subscribe({
            next: (result: any) => {
              this.departments = result.data
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              const statusText = "Department created successfully"
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.anonymousForm.controls['department'].setValue(data.name)
            }
          })
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })

    })


  }
  get_designation() {
    this.generalService.get_designation().subscribe({
      next: (result: any) => {

        this.designations = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  new_designation() {

    this.dialog.open(NewDesignationComponent).afterClosed().subscribe((data: any) => {

      const name = data.name
      this.generalService.create_designation(name, this.Form.value.reporter).subscribe({
        next: (result: any) => {
          this.generalService.get_designation().subscribe({
            next: (result: any) => {
              this.designations = result.data
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
              const statusText = "Designation created successfully"
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.anonymousForm.controls['designation'].setValue(data.name)
            }
          })
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })

    })


  }
  new_submission() {

    // if (this.CheckcorporateUser === true) {
      this.dialog.open(NewSubmissionComponent).afterClosed().subscribe((data: any) => {

        const name = data.name
        this.grievanceService.create_submission(name).subscribe({
          next: (result: any) => {
            this.grievanceService.get_submission().subscribe({
              next: (result: any) => {
                this.Submissions = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Submission created successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['submissions'].setValue(data.name)
              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })

      })
    // }
    // else {
    //   Swal.fire({
    //     title: 'Access Denied!',
    //     text: "Only corporate users can create a new submission.",
    //     icon: 'warning',
    //     confirmButtonColor: '#3085d6',
    //     confirmButtonText: 'OK'
    //   });
    // }

  }
  get_submission() {
    this.grievanceService.get_submission().subscribe({
      next: (result: any) => {

        this.Submissions = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }


  onCategorySelection(event: any) {
    const topics = this.topics.filter(function (elem: any) {
      return (elem.attributes.category === event.value)
    })
    this.filteredTopics = topics

  }


  // new_topic() {

  //   this.dialog.open(NewTopicComponent).afterClosed().subscribe((data: any) => {
  //     const name = data.name
  //     this.grievanceService.create_topic(name, this.Form.value.reporter).subscribe({
  //       next: (result: any) => {
  //         this.grievanceService.get_topic().subscribe({
  //           next: (result: any) => {
  //             this.topics = result.data
  //           },
  //           error: (err: any) => {
  //             this.router.navigate(["/error/internal"])
  //           },
  //           complete: () => {
  //             const statusText = "Topic created successfully"
  //             this._snackBar.open(statusText, 'Ok', {
  //               horizontalPosition: this.horizontalPosition,
  //               verticalPosition: this.verticalPosition,
  //             });
  //             this.Form.controls['topic'].setValue(data.name)
  //           }
  //         })
  //       },
  //       error: (err: any) => {
  //         this.router.navigate(["/error/internal"])
  //       },
  //       complete: () => { }
  //     })

  //   })


  // }

  get_topic() {
    this.grievanceService.get_topic().subscribe({
      next: (result: any) => {

        this.topics = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
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
  calculateHumanRightsScore(selectedValue: any) {
    const value = selectedValue.attributes.Value
    const scaleScore = selectedValue.attributes.unit

    if (value === "High") {
      this.humanRightsScore = 3;
    } else if (value === "Medium") {
      this.humanRightsScore = 2;
    } else if (value === "Low") {
      this.humanRightsScore = 1;
    } else if (value === "Zero Tolerance") {
      this.humanRightsScore = -1;
    }
    this.Form.controls['human_rights_score'].setValue(this.humanRightsScore)
    this.humanRightsFinalScore = this.humanRightsScore * (scaleScore / 100);
    this.Form.controls['human_rights_final_score'].setValue(this.humanRightsFinalScore)
    this.calculateSeverityScore()
  }

  calculateScaleScore(selectedValue: any) {
    const value = selectedValue.attributes.Value
    const scale = selectedValue.attributes.unit

    if (value === "High") {
      this.scaleScore = 3;
    } else if (value === "Medium") {
      this.scaleScore = 2;
    } else if (value === "Low") {
      this.scaleScore = 1;
    } else if (value === "Zero Tolerance") {
      this.scaleScore = -1;
    }
    this.Form.controls['scale_score'].setValue(this.scaleScore)
    this.scaleFinalScore = this.scaleScore * (scale / 100);
    this.Form.controls['scale_final_score'].setValue(this.scaleFinalScore)
    this.calculateSeverityScore()
  }

  calculateFrequencyScore(selectedValue: any) {
    const value = selectedValue.attributes.Value
    const frequency = selectedValue.attributes.unit

    if (value === "High") {
      this.frequencyScore = 3;
    } else if (value === "Medium") {
      this.frequencyScore = 2;
    } else if (value === "Low") {
      this.frequencyScore = 1;
    } else if (value === "Zero Tolerance") {
      this.frequencyScore = -1;
    }
    this.Form.controls['frequency_score'].setValue(this.frequencyScore)
    this.frequencyFinalScore = this.frequencyScore * (frequency / 100);
    this.Form.controls['frequency_final_score'].setValue(this.frequencyFinalScore)
    this.calculateSeverityScore()
  }

  calculateSeverityScore() {
    const humanRightsFinalScore = this.Form.value.human_rights_final_score;
    const frequencyFinalScore = this.Form.value.frequency_final_score;
    const scaleFinalScore = this.Form.value.scale_final_score;

    if (humanRightsFinalScore !== null && scaleFinalScore !== null && frequencyFinalScore !== null) {
      const totalScore = humanRightsFinalScore + scaleFinalScore + frequencyFinalScore;
      this.Form.controls['total_score'].setValue(totalScore);
      if (totalScore < 0) {
        this.Form.controls['severity_score'].setValue('Zero Tolerance');
        this.Form.controls['severity_color_code'].setValue('null');
      } else if (totalScore <= 1.65) {
        this.Form.controls['severity_score'].setValue('Green');
        this.Form.controls['severity_color_code'].setValue('Green');
      } else if (totalScore <= 2.2) {
        this.Form.controls['severity_score'].setValue('Yellow');
        this.Form.controls['severity_color_code'].setValue('Yellow');
      } else {
        this.Form.controls['severity_score'].setValue('Red');
        this.Form.controls['severity_color_code'].setValue('Red');
      }
      this.dueDate()
    }
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

  saveAsDraft() {
    this.Form.controls['submission_date'].reset()
    this.submissionDate.setValue(new Date())
    this.Form.controls['due_date'].disable()
    this.Form.controls['status'].setValue('Draft')
    this.anonymousForm.controls['service_period'].enable()
    this.anonymousForm.controls['tenure_split'].enable()
    this.Form.controls['severity_score'].enable()
    if (this.Form.value.type == 'Grievance') {
      if (this.Form.value.severity_score === 'Red' || this.Form.value.severity_score === 'Zero Tolerance') {
        this.Form.controls['assignee'].setValue(this.chairperson)
        this.Form.controls['investigation_required'].setValue(true)
      }
      else {
        this.Form.controls['assignee'].setValue(this.Form.value.reporter)
        this.Form.controls['investigation_required'].setValue(false)
      }
    }

    if (this.anonymousForm.value.person_type !== 'Employee') {
      this.anonymousForm.controls['division'].setValue(this.selectedDivision)
    }
    this.showProgressPopup();
    this.update_grievance_draft()

  }

  update_grievance_draft() {
    if (this.Form.value.anonymous == false) {
      this.grievanceService.update_grievance(this.Form.value, this.anonymousForm.value).subscribe({
        next: (result: any) => {
        },
        error: (err: any) => {
          Swal.close()
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          const statusText = "Grievance details saved"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          Swal.close()
        }
      })
    }
    else if (this.Form.value.anonymous == true) {
      this.grievanceService.update_grievance_anonymous(this.Form.value, this.selectedDivision).subscribe({
        next: (result: any) => {
          this.Form.controls['id'].setValue(result.data.id)
        },
        error: (err: any) => {
          Swal.close()
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          const statusText = "Grievance details saved"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          Swal.close()
        }
      })
    }

  }


  submit() {
    this.dueDate()
    this.Form.controls['status'].setValue('Open')
    const formStatus = this.Form.valid
    this.anonymousForm.controls['service_period'].enable()
    this.anonymousForm.controls['tenure_split'].enable()
    this.Form.controls['severity_score'].enable()
    if (this.Form.value.type == 'Grievance') {
      if (this.Form.value.severity_score === 'Red' || this.Form.value.severity_score === 'Zero Tolerance') {
        this.Form.controls['assignee'].setValue(this.chairperson)
        this.Form.controls['investigation_required'].setValue(true)
      }
      else {
        this.Form.controls['assignee'].setValue(this.Form.value.reporter)
        this.Form.controls['investigation_required'].setValue(false)
      }
    }

    if (formStatus) {
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
          this.showProgressPopup()
          this.update_grievance()
        }
      })
    } else if (!formStatus) {
      const statusText = "Please fill all mandatory fields"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }


  update_grievance() {
    if (this.Form.value.anonymous == false) {
      this.grievanceService.update_grievance(this.Form.value, this.anonymousForm.value).subscribe({
        next: (result: any) => {
          this.Form.controls['id'].setValue(result.data.id)
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          this.create_notification()
        }
      })
    }
    else if (this.Form.value.anonymous == true) {
      this.grievanceService.update_grievance_anonymous(this.Form.value, this.selectedDivision).subscribe({
        next: (result: any) => {
          this.Form.controls['id'].setValue(result.data.id)
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          this.create_notification()
        }
      })
    }

  }

  create_notification() {
    let data: any[] = []
    data.push({
      module: "Grievance",
      action: 'Grievance Updated:',
      reference_number: this.Form.value.case_id,
      userID: this.Form.value.assignee,
      access_link: "/apps/grievance/grievance-action/",
      profile: this.Form.value.reporter
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Grievance Details Updated',
          imageUrl: "assets/images/success.gif",
          imageWidth: 250,
          text: "You have successfully updated a Grievance details.",
          showCancelButton: false,
        })
        Swal.close()
        this.router.navigate(["/apps/grievance/register"])
      }
    })
  }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }

  navigate() {

    this.backToHistory = true
    this._location.back();
  }

}
