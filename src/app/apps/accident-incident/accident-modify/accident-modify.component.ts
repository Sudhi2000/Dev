import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddWitnessComponentModify } from './add-witness/add-witness.component';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AddModifyAffectedPersonComponentModify } from './add-modify-affected-person/add-modify-affected-person.component';
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER, L } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Lightbox } from 'ngx-lightbox';
import { NewDepartmentComponent } from '../../general-component/new-department/new-department.component';
import { CreateTertiaryPartComponent } from '../create-accident/create-tertiary-part/create-tertiary-part.component';
import { Location } from '@angular/common';
var Buffer = require('buffer/').Buffer
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
  selector: 'app-accident-modify',
  templateUrl: './accident-modify.component.html',
  styleUrls: ['./accident-modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AccidentModifyComponent implements OnInit {

  orgID: any
  Form: FormGroup
  filteredBodyPart: Observable<string[]>;
  primaryfilteredBodyPart: Observable<string[]>;
  secondaryfilteredBodyPart: Observable<string[]>;
  tertiaryfilteredBodyPart: Observable<string[]>;
  bodyPartCtrl = new FormControl('');
  primarybodyPartCtrl = new FormControl('');
  secondarybodyPartCtrl = new FormControl('');
  tertiarybodyPartCtrl = new FormControl('');
  allBodyPart: string[] = [];
  allprimaryBodyPart: string[] = [];
  allsecondaryBodyPart: string[] = [];
  alltertiaryBodyPart: string[] = [];
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 2
  divisions: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  witnessList: any[] = []
  affectedPeopleList: any[] = []
  dropdownValues: any
  accSubCategories: any[] = []
  bodypart: string[] = [];
  divisionUuids: any[] = []
  primarybodypart: string[] = [];
  secondarybodypart: string[] = [];
  tertiarybodypart: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  InjuryCause = new FormControl(null, [Validators.required]);
  injuryCauseOptions: Observable<string[]>;
  injuryCauseoptions: string[] = [];
  backToHistory: Boolean = false
  Division = new FormControl(null, [Validators.required]);
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
  };
  saveFlag: boolean = true
  saveLoadFlag: boolean = false
  accidentdate = new FormControl(null, [Validators.required]);
  accidenttime = new FormControl(null, [Validators.required]);
  peopleList: any[] = []
  files: File[] = [];
  evidenceData: any[] = []
  evidenceImageCount: number = 0
  evidenceCount: number = 0
  evidenceFormData = new FormData()
  fileCount: number = 0
  departments: any[] = []
  unitSpecific: any
  userDivision: any
  corporateUser: any
  bodyPartsMandatory: Boolean

  constructor(private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private accidentService: AccidentService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private _lightbox: Lightbox, private _location: Location) {
    this.filteredBodyPart = this.bodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) => (part ? this._filter(part) : this.allBodyPart.slice())),
    );
    this.primaryfilteredBodyPart = this.primarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) => (part ? this._filterprimary(part) : this.allprimaryBodyPart.slice())),
    );

    this.injuryCauseOptions = this.InjuryCause.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const dropDownValues = this._injuryCausefilter(value)
        const isValid = dropDownValues.includes(value);
        // If not valid, set an error on the form control
        if (!isValid && value !== '' || value.trim() === '') {
          this.InjuryCause.setErrors({ invalidCause: true });
        } else {
          this.InjuryCause.setErrors(null); // Clear the error if the value is valid
        }
        if (!isValid && value !== '') {
          this.Form.setErrors({ manualInvalid: true });
        } else {
          this.Form.setErrors(null); // Clear the form-level error if valid
        }
        return dropDownValues
      })
    );
  }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['', [Validators.required]],
      reference_number: [''],
      reported_date: [new Date(), [Validators.required]],
      division: ['', [Validators.required]],
      location: ['', [Validators.required]],
      department: [''],
      status: ['Draft', [Validators.required]],
      accident_date: [null, [Validators.required]],
      accident_time: [null, [Validators.required]],
      supervisor: ['', [Validators.required]],
      assignee: [null, [Validators.required]],
      severity: ['', [Validators.required]],
      witness: [''],
      evidence_type: [''],
      evidence_name: [''],
      evidence_id: [''],
      evidence: [''],
      reporterID: [null],
      reporter: [''],
      business_unit: [null],
      affected_people: ['', [Validators.required]],
      category: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
      accident_type: ['', [Validators.required]],
      injury_type: ['', [Validators.required]],
      injury_cause: ['', [Validators.required]],
      hospital: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      time_of_work: ['', [Validators.required]],
      return_of_work: ['', [Validators.required]],
      return_of_work_temp: [{ hour: 0, minute: 0 }, [Validators.required]],
      return_for_work_hour: ['', [Validators.required]],
      return_for_work_min: ['', [Validators.required]],
      injury: [''],
      affected_body_part: [''],
      primary_body_part: ['', [Validators.required]],
      secondary_body_part: ['', [Validators.required]],
      tertiary_body_part: ['', [Validators.required]],
      assignee_notification: [null],
      group_notification: [null],
      resolution: [''],
      work_performed: ['', [Validators.required]],
      description: ['', [Validators.required]],
      action_taken: ['', [Validators.required]],
      reporter_designation: [''],
      consiquence_category: ['nill'],
      userID: [null]
    });
  }

  @ViewChild('bodyPartInput') bodyInput: ElementRef<HTMLInputElement>;
  @ViewChild('primarybodyPartInput') primarybodyInput: ElementRef<HTMLInputElement>;
  @ViewChild('secondarybodyPartInput') secondarybodyInput: ElementRef<HTMLInputElement>;
  @ViewChild('tertiarybodyPartInput') tertiarybodyInput: ElementRef<HTMLInputElement>;

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.unitSpecific = result.data.attributes.business_unit_specific
        const status = result.data.attributes.modules.accident_incident
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
        this.Form.controls['reporter'].setValue(result.id)
        this.Form.controls['userID'].setValue(result.id)

        const status = result.acc_inc_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_dropdown_values()

          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_profiles()
              this.get_divisions()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
                this.divisionUuids.push(elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_assignee()
            }
          } else {
            this.get_profiles()
            this.get_divisions();
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_department() {
    this.generalService.get_department().subscribe({
      next: (result: any) => {

        this.departments = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.get_accident_details()

      }
    })
  }

  new_department() {

    this.dialog.open(NewDepartmentComponent).afterClosed().subscribe((data: any) => {

      const name = data.name
      this.generalService.create_department(name, this.Form.value.userID).subscribe({
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
              this.Form.controls['department'].setValue(result.data.attributes.department_name)
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

  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
        }));

        this.divisions = newArray;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  get_profiles() {
    this.authService.get_hse_head_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked === false && profile.attributes.user?.data?.attributes?.acc_inc_action === true);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    });
  }

  get_unit_specific_assignee() {
    this.accidentService.get_unit_specific_assignee(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }

  get_dropdown_values() {
    const module = "Accident and Incident"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        const bodyPart = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Body Part")
        })
        let data: any[] = []
        bodyPart.forEach((elem: any) => {
          data.push(elem.attributes.Value)
        })
        this.allBodyPart = data
        const primarybodyPart = result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Body Primary Region';
        });
        let primarydata: any[] = [];
        primarybodyPart.forEach((elem: any) => {
          primarydata.push(elem.attributes.Value);
        });
        this.allprimaryBodyPart = primarydata;
        const injurycause = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Injury Cause")
        })
        let injurydata: any[] = []
        injurycause.forEach((elem: any) => {
          injurydata.push(elem.attributes.Value)
        })
        this.injuryCauseoptions = injurydata
      },
      error: (err: any) => { },
      complete: () => {
        this.get_department()
      }
    })
  }

  get_accident_details() {
    this.files = []
    const reference = this.route.snapshot.paramMap.get('id');
    this.accidentService.get_accident_reference(reference, this.Form.value.org_id).subscribe({
      next: (result: any) => {
        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }
        if (result.data[0].attributes.status === "Draft" && (matchFound || matchFound !== false)) {
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['org_id'].setValue(result.data[0].attributes.org_id)
          this.Form.controls['category'].setValue(result.data[0].attributes.category)
          this.accCategory()
          this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
          this.Form.controls['reported_date'].setValue(result.data[0].attributes.reported_date)
          this.Form.controls['division'].setValue(result.data[0].attributes.division)
          this.Form.controls['location'].setValue(result.data[0].attributes.location)
          this.Form.controls['department'].setValue(result.data[0].attributes.department)
          this.Form.controls['status'].setValue(result.data[0].attributes.status)
          this.Form.controls['resolution'].setValue(result.data[0].attributes.resolution)
          this.Form.controls['group_notification'].setValue(result.data[0].attributes.group_notification)
          this.Form.controls['supervisor'].setValue(result.data[0].attributes.supervisor_name)
          this.Form.controls['assignee'].setValue(result.data[0].attributes?.assignee?.data?.id)
          this.Form.controls['severity'].setValue(result.data[0].attributes.severity)
          this.Form.controls['reporterID'].setValue(result.data[0].attributes.reporter.data.id)
          this.Form.controls['reporter'].setValue(result.data[0].attributes.reporter.data.attributes.first_name + ' ' + result.data[0].attributes.reporter.data.attributes.last_name)


          this.Form.controls['accident_type'].setValue(result.data[0].attributes.accident_type)
          this.Form.controls['injury_type'].setValue(result.data[0].attributes.injury_type)
          if (result.data[0].attributes.injury_type !== 'First Aid') {
            this.Form.controls['assignee_notification'].setValue(false)
            this.Form.controls['status'].setValue('Open')
          }
          this.Form.controls['injury_cause'].setValue(result.data[0].attributes.injury_cause)
          this.Form.controls['hospital'].setValue(result.data[0].attributes.consulted_hospital)
          this.Form.controls['doctor'].setValue(result.data[0].attributes.consulted_doctor)
          this.Form.controls['time_of_work'].setValue(result.data[0].attributes.time_of_work)
          this.Form.controls['return_of_work'].setValue(result.data[0].attributes.return_for_work)
          this.Form.controls['return_of_work_temp'].setValue({ hour: result.data[0].attributes.return_for_work_hour, minute: result.data[0].attributes.return_for_work_min })
          this.Form.controls['return_for_work_hour'].setValue(result.data[0].attributes.return_for_work_hour)
          this.Form.controls['return_for_work_min'].setValue(result.data[0].attributes.return_for_work_min)
          this.Division.setValue(result.data[0].attributes.division)
          this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
          this.Form.controls['injury'].setValue(result.data[0].attributes.injury)
          this.Form.controls['affected_body_part'].setValue(result.data[0].attributes.affected_body_parts)
          this.Form.controls['primary_body_part'].setValue(result.data[0].attributes.affected_primary_region)
          this.Form.controls['secondary_body_part'].setValue(result.data[0].attributes.affected_secondary_region)
          this.Form.controls['tertiary_body_part'].setValue(result.data[0].attributes.affected_tertiary_region)
          this.Form.controls['work_performed'].setValue(result.data[0].attributes.work_performed)
          this.Form.controls['description'].setValue(result.data[0].attributes.description)
          this.Form.controls['action_taken'].setValue(result.data[0].attributes.action_taken)
          this.Form.controls['reporter_designation'].setValue(result.data[0].attributes.reporter.data.attributes.designation)
          this.Form.controls['consiquence_category'].setValue(result.data[0].attributes.consiquence_category)

          this.Form.controls['sub_category'].setValue(result.data[0].attributes.sub_category)
          this.InjuryCause.setValue(result.data[0].attributes.injury_cause)
          this.witnessList = result.data[0].attributes.witnesses.data
          if (this.witnessList.length > 0) {
            this.Form.controls['witness'].setValue('OK')
          } else {
            this.Form.controls['witness'].reset()
          }
          this.evidenceData = result.data[0].attributes.evidences.data
          if (this.evidenceData.length > 0) {
            this.Form.controls['evidence'].setValue('OK')
          } else {
            this.Form.controls['evidence'].reset()
          }

          const evidence__data = result.data[0].attributes.evidences.data

          if (evidence__data.length > 0) {
            this.Form.controls['evidence_id'].setValue(evidence__data[0].id)

            evidence__data.forEach((evidence: any) => {
              this.generalService.getImage(environment.client_backend + '/uploads/' + evidence.attributes.evidence_name + '.' + evidence.attributes.format).subscribe((data: any) => {
                this.files.push(data)
              })

            })
          }
          this.affectedPeopleList = result.data[0].attributes.affected_individuals.data
          if (this.affectedPeopleList.length > 0) {
            this.Form.controls['affected_people'].setValue('OK')
          } else {
            this.Form.controls['affected_people'].reset()
          }
          const data = result.data[0].attributes.affected_body_parts
          if (data) {
            const split_string = data.split(",");
            this.bodypart = split_string
          }
          const primarydata = result.data[0].attributes.affected_primary_region
          if (primarydata) {
            const split_string = primarydata.split(",");
            this.primarybodypart = split_string
          }
          const secondarydata = result.data[0].attributes.affected_secondary_region
          if (secondarydata) {
            const split_string = secondarydata.split(",");
            this.secondarybodypart = split_string
          }
          const tertiarydata = result.data[0].attributes.affected_tertiary_region

          if (tertiarydata) {
            const split_string = tertiarydata.split(",");
            this.tertiarybodypart = split_string
          }
          const selectedPrimaryValues = this.primarybodypart.slice();
          const selectedSecondaryValues = this.secondarybodypart.slice();
          const remainingPrimaryValues = this.allprimaryBodyPart.filter(value => !selectedPrimaryValues.includes(value));

          this.allprimaryBodyPart = remainingPrimaryValues;

          this.Form.controls['primary_body_part'].setValue(selectedPrimaryValues);

          this.primaryfilteredBodyPart = this.primarybodyPartCtrl.valueChanges.pipe(
            startWith(null),
            map((part: string | null) => (part ? this._filterprimary(part) : this.allprimaryBodyPart.slice()))
          );
          this.fetchSecondaryOptions(selectedPrimaryValues, 'Accident and Incident').subscribe((results: any[]) => {
            const secondaryOptions = [].concat(...results);
            let secondarydata: any[] = [];
            secondaryOptions.forEach((elem: any) => {
              secondarydata.push(elem.attributes.Value);
            });

            secondarydata = secondarydata.filter(value => !this.secondarybodypart.includes(value));

            this.allsecondaryBodyPart = secondarydata;

            this.Form.controls['secondary_body_part'].setValue(this.secondarybodypart);

            this.secondaryfilteredBodyPart = this.secondarybodyPartCtrl.valueChanges.pipe(
              startWith(null),
              map((part: string | null) =>
                part ? this._filtersecondary(part) : this.allsecondaryBodyPart.slice()
              )
            );
          });

          this.fetchTertiaryOptions(selectedSecondaryValues).subscribe((results: any[]) => {
            const tertiaryOptions = [].concat(...results);
            let tertiarydata: any[] = [];
            tertiaryOptions.forEach((elem: any) => {
              tertiarydata.push(elem.attributes.value);
            });

            tertiarydata = tertiarydata.filter(value => !this.tertiarybodypart.includes(value));

            this.alltertiaryBodyPart = tertiarydata;

            this.Form.controls['tertiary_body_part'].setValue(this.tertiarybodypart);

            this.tertiaryfilteredBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
              startWith(null),
              map((part: string | null) =>
                part ? this._filtertertiary(part) : this.alltertiaryBodyPart.slice()
              )
            );
          });

          if (result.data[0].attributes.accident_date) {
            this.Form.controls['accident_date'].setValue(new Date(result.data[0].attributes.accident_date))
            this.accidentdate.setValue(new Date(result.data[0].attributes.accident_date))
          }
          if (result.data[0].attributes.accident_time) {
            this.Form.controls['accident_time'].setValue(new Date(result.data[0].attributes.accident_time))
            this.accidenttime.setValue(new Date(result.data[0].attributes.accident_time))
          }
          if (result.data[0].attributes.injury === 'First Aid' || result.data[0].attributes.injury === 'Non-Reportable Accident') {
            this.Form.controls['doctor']?.clearValidators();
            this.Form.controls['hospital']?.clearValidators();
            this.Form.controls['doctor']?.updateValueAndValidity();
            this.Form.controls['hospital']?.updateValueAndValidity();
          } else {
            this.Form.controls['doctor']?.setValidators([Validators.required]);
            this.Form.controls['hospital']?.setValidators([Validators.required]);
            this.Form.controls['doctor']?.updateValueAndValidity();
            this.Form.controls['hospital']?.updateValueAndValidity();
          }
          if (this.Form.value.category === 'Environmental' || (this.Form.value.category === 'Safety' && (this.Form.value.sub_category === "Fire and Property Damage" || this.Form.value.sub_category === "Compliant from Authority"))) {


            this.Form.get('primary_body_part')?.clearValidators();
            this.Form.get('secondary_body_part')?.clearValidators();
            this.Form.get('tertiary_body_part')?.clearValidators();
            this.Form.get('affected_people')?.clearValidators();
            this.Form.get('doctor')?.clearValidators();
            this.Form.get('hospital')?.clearValidators();
            this.Form.get('primary_body_part')?.updateValueAndValidity();
            this.Form.get('secondary_body_part')?.updateValueAndValidity();
            this.Form.get('tertiary_body_part')?.updateValueAndValidity();
            this.Form.get('affected_people')?.updateValueAndValidity();
            this.Form.get('doctor')?.updateValueAndValidity();
            this.Form.get('hospital')?.updateValueAndValidity();
            this.bodyPartsMandatory = false
          }

          else {
            this.Form.controls['affected_people'].setValidators([Validators.required])
            this.Form.controls['doctor'].setValidators([Validators.required])
            this.Form.controls['hospital'].setValidators([Validators.required])
            this.primarybodyPartCtrl.setValidators([Validators.required]);
            this.Form.controls['primary_body_part'].setValidators([Validators.required]);
            this.Form.controls['secondary_body_part'].setValidators([Validators.required])
            this.Form.controls['tertiary_body_part'].setValidators([Validators.required])
            this.primarybodyPartCtrl.updateValueAndValidity();
            this.Form.get('primary_body_part')?.updateValueAndValidity();
            this.Form.get('secondary_body_part')?.updateValueAndValidity();
            this.Form.get('tertiary_body_part')?.updateValueAndValidity();
            this.Form.get('affected_people')?.updateValueAndValidity();
            this.Form.get('doctor')?.updateValueAndValidity();
            this.Form.get('hospital')?.updateValueAndValidity();
            this.bodyPartsMandatory = true
            console.log("true");
            if (this.affectedPeopleList.length > 0) {
              this.Form.controls['affected_people'].setErrors(null);
            } else {
              this.Form.controls['affected_people'].setValidators(
                Validators.required
              );
            }
          }

        } else {
          this.router.navigate(["/apps/accident-incident/accident-register"])
        }

        if (result.data[0].attributes.injury !== "First Aid") {
          this.Form.controls['return_of_work'].clearValidators()
          this.Form.controls['return_of_work_temp'].clearValidators()
          this.Form.controls['return_for_work_hour'].clearValidators()
          this.Form.controls['return_for_work_min'].clearValidators()

          this.Form.controls['return_of_work'].updateValueAndValidity()
          this.Form.controls['return_of_work_temp'].updateValueAndValidity()
          this.Form.controls['return_for_work_hour'].updateValueAndValidity()
          this.Form.controls['return_for_work_min'].updateValueAndValidity()
        } else if (result.data[0].attributes.injury !== "Non-Reportable Accident" && result.data[0].attributes.time_of_work == "0 Days") {

          this.Form.controls['return_of_work'].setValidators([Validators.required])
          this.Form.controls['return_of_work_temp'].setValidators([Validators.required])
          this.Form.controls['return_for_work_hour'].setValidators([Validators.required])
          this.Form.controls['return_for_work_min'].setValidators([Validators.required])

          this.Form.controls['return_of_work'].updateValueAndValidity()
          this.Form.controls['return_of_work_temp'].updateValueAndValidity()
          this.Form.controls['return_for_work_hour'].updateValueAndValidity()
          this.Form.controls['return_for_work_min'].updateValueAndValidity()

        }
        if (result.data[0].attributes.injury === "First Aid") {
          this.Form.controls['return_of_work'].clearValidators();
          this.Form.controls['return_of_work_temp'].clearValidators();
          this.Form.controls['return_for_work_hour'].clearValidators();
          this.Form.controls['return_for_work_min'].clearValidators();
          this.Form.controls['assignee'].clearValidators();

          this.Form.controls['return_of_work'].updateValueAndValidity();
          this.Form.controls['return_of_work_temp'].updateValueAndValidity();
          this.Form.controls['return_for_work_hour'].updateValueAndValidity();
          this.Form.controls['return_for_work_min'].updateValueAndValidity();
          this.Form.controls['assignee'].updateValueAndValidity();
        }

      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  identNonReport(data: any) {

    if (this.Form.value.time_of_work == "0 Days") {
      this.Form.controls['return_of_work'].setValidators([Validators.required])
      this.Form.controls['return_of_work_temp'].setValidators([Validators.required])
      this.Form.controls['return_for_work_hour'].setValidators([Validators.required])
      this.Form.controls['return_for_work_min'].setValidators([Validators.required])

      this.Form.controls['return_of_work'].updateValueAndValidity()
      this.Form.controls['return_of_work_temp'].updateValueAndValidity()
      this.Form.controls['return_for_work_hour'].updateValueAndValidity()
      this.Form.controls['return_for_work_min'].updateValueAndValidity()

    } else {

      this.Form.controls['return_of_work'].clearValidators()
      this.Form.controls['return_of_work_temp'].clearValidators()
      this.Form.controls['return_for_work_hour'].clearValidators()
      this.Form.controls['return_for_work_min'].clearValidators()

      this.Form.controls['return_of_work'].updateValueAndValidity()
      this.Form.controls['return_of_work_temp'].updateValueAndValidity()
      this.Form.controls['return_for_work_hour'].updateValueAndValidity()
      this.Form.controls['return_for_work_min'].updateValueAndValidity()

    }
  }

  accCategory() {
    const category = this.Form.value.category

    const subData = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.filter === category)
    })
    if (subData.length > 0) {
      this.accSubCategories = subData
    }
    this.Form.controls['sub_category'].setValue('')
  }

  accSubCategory() {
    const SubCategory = this.Form.value.sub_category;
    const subcategoryData = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Sub Category")
    })
    if (this.Form.value.category === 'Environmental' || (this.Form.value.category === 'Safety' && (this.Form.value.sub_category === "Fire and Property Damage" || this.Form.value.sub_category === "Compliant from Authority"))) {
      this.Form.get('primary_body_part')?.clearValidators();
      this.Form.get('secondary_body_part')?.clearValidators();
      this.Form.get('tertiary_body_part')?.clearValidators();
      this.Form.get('affected_people')?.clearValidators();
      this.Form.get('doctor')?.clearValidators();
      this.Form.get('hospital')?.clearValidators();
      this.Form.get('primary_body_part')?.updateValueAndValidity();
      this.Form.get('secondary_body_part')?.updateValueAndValidity();
      this.Form.get('tertiary_body_part')?.updateValueAndValidity();
      this.Form.get('affected_people')?.updateValueAndValidity();
      this.Form.get('doctor')?.updateValueAndValidity();
      this.Form.get('hospital')?.updateValueAndValidity();
      const subData = subcategoryData.filter(function (elem: any) {
        return elem.attributes.Value === SubCategory;
      });
      if (subData.length > 0) {
        this.Form.controls['consiquence_category'].setValue(
          subData[0].attributes.consiquence_category
        );
      }

      this.bodyPartsMandatory = false
    }
    else {
      this.Form.controls['affected_people'].setValidators([Validators.required])
      this.Form.controls['doctor'].setValidators([Validators.required])
      this.Form.controls['hospital'].setValidators([Validators.required])
      this.primarybodyPartCtrl.setValidators([Validators.required]);
      this.Form.controls['primary_body_part'].setValidators([Validators.required]);
      this.Form.controls['secondary_body_part'].setValidators([Validators.required])
      this.Form.controls['tertiary_body_part'].setValidators([Validators.required])
      this.primarybodyPartCtrl.updateValueAndValidity();
      this.Form.get('primary_body_part')?.updateValueAndValidity();
      this.Form.get('secondary_body_part')?.updateValueAndValidity();
      this.Form.get('tertiary_body_part')?.updateValueAndValidity();
      this.Form.get('affected_people')?.updateValueAndValidity();
      this.Form.get('doctor')?.updateValueAndValidity();
      this.Form.get('hospital')?.updateValueAndValidity();
      if (this.affectedPeopleList.length > 0) {
        this.Form.controls['affected_people'].setErrors(null);
      } else {
        this.Form.controls['affected_people'].setValidators(
          Validators.required
        );
      }
      const subData = subcategoryData.filter(function (elem: any) {
        return elem.attributes.Value === SubCategory;
      });

      if (subData.length > 0) {
        this.Form.controls['consiquence_category'].setValue(
          subData[0].attributes.consiquence_category
        );
      }

      this.bodyPartsMandatory = true
    }

  }

  BusinessUnit(event: any) {
    const selectedData = this.divisions.find(data => data.division_name === event.value);
    this.Form.controls['division'].setValue(selectedData.division_name)
    this.Form.controls['business_unit'].setValue(selectedData.id)
  }
  addWitness() {
    this.dialog.open(AddWitnessComponentModify).afterClosed().subscribe(data => {
      if (data) {
        this.accidentService.create_witness(data, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            const statusText = "Witness details added"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_witness_details()
          }
        })
      }
    })
  }

  modifyWitness(witnessData: any) {
    this.dialog.open(AddWitnessComponentModify, {
      data: witnessData
    }).afterClosed().subscribe((data) => {
      if (data) {
        const statusText = "Witness details updated"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.get_witness_details()
      }
    })
  }

  deleteWitness(data: any) {
    this.accidentService.delete_witness(data.id).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "Witness details deleted"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.get_witness_details()
      }
    })
  }

  get_witness_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.accidentService.get_accident_witness(this.Form.value.id).subscribe({
      next: (result: any) => {
        this.witnessList = []
        this.witnessList = result.data
        if (result.data.length > 0) {
          this.Form.controls['witness'].setValue('OK')
        } else {
          this.Form.controls['witness'].reset()
        }
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
      if (size > 20) {
        const statusText = "Please choose an image below 20 MB"
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
      this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = []
          data.push({
            evidence_name: result[0].hash,
            format: extension,
            accident: this.Form.value.id,
            id: result[0].id
          })
          this.accidentService.create_accident_evidence(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => { }
          })
        },
        error: (err: any) => { },
        complete: () => {
          const statusText = "Evidence updated"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          // this.files = []

          // this.get_accident_details()
        }
      })
    })
  }


  onRemove(event: any) {

    this.files.splice(this.files.indexOf(event), 1);

    this.deleteEvidence()

  }
  // onRemove(event: any) {
  //   this.files.splice(this.files.indexOf(event), 1);
  //   if (this.files.length === 0) {
  //     this.Form.controls['evidence'].reset()
  //   }
  // }

  deleteEvidence() {
    const evidenceID = this.Form.value.evidence_id
    this.showProgressPopup();
    this.accidentService.delete_accident_evidence(evidenceID).subscribe({
      next: (result: any) => {
        this.generalService.delete_image(result.data.attributes.image_id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Evidence deleted"
            this._snackBar.open(statusText, 'Close Warning', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_accident_details()
          }
        })
      },
      error: (err: any) => { },
      complete: () => { Swal.close() }
    })
  }

  addPeople() {
    this.dialog.open(AddModifyAffectedPersonComponentModify).afterClosed().subscribe(data => {
      if (data) {
        this.accidentService.create_accident_individual(data, this.Form.value.id).subscribe({
          next: (result: any) => {
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            const statusText = "People details added"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_peoples()
          }
        })

      }
    })
  }

  modifyPeopleDetails(personData: any) {
    this.dialog.open(AddModifyAffectedPersonComponentModify, {
      data: personData
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.accidentService.update_accident_individual(data).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            const statusText = "People details updated"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_peoples()
          }
        })

      }
    })
  }

  deletePeople(data: any) {
    this.accidentService.delete_accident_individual(data.id).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "People details deleted"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.get_peoples()
      }
    })
  }

  get_peoples() {
    this.accidentService.get_accident_individual(this.Form.value.id).subscribe({
      next: (result: any) => {
        this.affectedPeopleList = []
        this.affectedPeopleList = result.data
        if (result.data.length > 0) {
          this.Form.controls['affected_people'].setValue('OK')
        } else {
          this.Form.controls['affected_people'].reset()
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  addBodyPart(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.bodypart.push(value);
    }
    event.chipInput!.clear();
    this.bodyPartCtrl.setValue(null);
  }
  addprimary(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.primarybodypart.push(value);
    }
    event.chipInput!.clear();
    this.primarybodyPartCtrl.setValue(null);
  }
  addsecondary(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.secondarybodypart.push(value);
    }
    event.chipInput!.clear();
    this.secondarybodyPartCtrl.setValue(null);
  }
  addtertiary(event: MatChipInputEvent): void {
    // const value = (event.value || '').trim();
    // if (value) {
    //   //this.tertiarybodypart.push(value);
    // }
    // event.chipInput!.clear();
    // this.tertiarybodyPartCtrl.setValue(null);
  }

  remove(part: string): void {
    const index = this.bodypart.indexOf(part);
    if (index >= 0) {
      this.bodypart.splice(index, 1);
    }
  }
  removeprimary(part: string): void {
    this.primarybodypart = this.primarybodypart.filter(p => p !== part);
    this.secondarybodypart = this.secondarybodypart.filter(s => !s.startsWith(part));
    this.tertiarybodypart = this.tertiarybodypart.filter(t => !t.startsWith(part));
    this.allprimaryBodyPart.push(part);
    this.Form.controls['primary_body_part'].setValue(this.primarybodypart.toString());
    this.primaryfilteredBodyPart = this.primarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filterprimary(value) : this.allprimaryBodyPart.slice()
      )
    );

    this.secondaryfilteredBodyPart = this.secondarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filtersecondary(value) : this.allsecondaryBodyPart.slice()
      )
    );

    this.tertiaryfilteredBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filtertertiary(value) : this.alltertiaryBodyPart.slice()
      )
    );
  }

  removesecondary(part: string): void {
    this.secondarybodypart = this.secondarybodypart.filter(s => s !== part);
    this.tertiarybodypart = this.tertiarybodypart.filter(t => !t.startsWith(part));
    this.allsecondaryBodyPart.push(part);
    this.Form.controls['secondary_body_part'].setValue(this.secondarybodypart.toString());
    this.secondaryfilteredBodyPart = this.secondarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filtersecondary(value) : this.allsecondaryBodyPart.slice()
      )
    );

    this.tertiaryfilteredBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filtertertiary(value) : this.alltertiaryBodyPart.slice()
      )
    );
  }

  removetertiary(part: string): void {
    this.tertiarybodypart = this.tertiarybodypart.filter(t => t !== part);
    this.alltertiaryBodyPart.push(part);
    this.Form.controls['tertiary_body_part'].setValue(this.tertiarybodypart.toString());
    this.tertiaryfilteredBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filtertertiary(value) : this.alltertiaryBodyPart.slice()
      )
    );
  }


  checkDetails() {
    const InjuryType = this.Form.value.injury
    const AccidentCause = this.Form.value.injury_cause
    const AccidentType = this.Form.value.accident_type
    const Category = this.Form.value.category
    const SubCategory = this.Form.value.sub_category

    if (AccidentCause && AccidentType && Category && SubCategory) {
      document.getElementById('error-text')?.classList.add("hide");

      const stringWithoutPTags = `Accident Cause: ${AccidentCause}, Accident Type: ${AccidentType}, Category: ${Category}, Sub category: ${SubCategory}, Injury Type: ${InjuryType}`;
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
    const message = 'There is an accident happened by [AccidentCause], resulting in an injury type of [InjuryType]. It is categorized as [AccidentType], falling under the [Category] category and the [SubCategory] sub-category' + stringWithoutPTags + 'Avoid bullet points. write a description'
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
    this.accidentService.create_open_ai(this.Form.value, completion_tokens, prompt_tokens, total_tokens).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {

      }
    })

  }


  selected(event: MatAutocompleteSelectedEvent): void {
    this.bodypart.push(event.option.viewValue);
    this.Form.controls['affected_body_part'].setValue(this.bodypart.toString());
    this.bodyInput.nativeElement.value = '';
    this.bodyPartCtrl.setValue(null);
  }

  fetchSecondaryOptions(selectedPrimaryValues: string[], module: string): Observable<any> {
    const requests = selectedPrimaryValues.map(value => {
      return this.generalService.get_dropdown_values(module).pipe(
        map((result: any) => {
          return result.data.filter((elem: any) => {
            return (
              elem.attributes.Category === "Body Secondary Region" &&
              elem.attributes.filter === value
            );
          });
        })
      );
    });

    return forkJoin(requests);
  }

  selectedprimary(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;
    this.primarybodypart.push(selectedValue);
    this.Form.controls['primary_body_part'].setValue(this.primarybodypart.toString());
    this.primarybodyInput.nativeElement.value = '';
    this.primarybodyPartCtrl.setValue(null);
    this.allprimaryBodyPart = this.allprimaryBodyPart.filter(part => part !== selectedValue);
    this.primaryfilteredBodyPart = this.primarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) =>
        part ? this._filterprimary(part) : this.allprimaryBodyPart.slice()
      )
    );
    const module = 'Accident and Incident';
    const selectedPrimaryValues = this.primarybodypart.slice();

    this.fetchSecondaryOptions(selectedPrimaryValues, module).subscribe((results: any[]) => {
      const secondaryOptions = [].concat(...results);
      let secondarydata: any[] = [];
      secondaryOptions.forEach((elem: any) => {
        secondarydata.push(elem.attributes.Value);
      });

      secondarydata = secondarydata.filter(value => !this.secondarybodypart.includes(value));
      this.allsecondaryBodyPart = secondarydata;
      this.secondaryfilteredBodyPart = this.secondarybodyPartCtrl.valueChanges.pipe(
        startWith(null),
        map((part: string | null) =>
          part ? this._filtersecondary(part) : this.allsecondaryBodyPart.slice()
        )
      );
    });
  }

  selectedsecondary(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;
    this.secondarybodypart.push(selectedValue);
    this.Form.controls['secondary_body_part'].setValue(this.secondarybodypart.toString());
    this.secondarybodyInput.nativeElement.value = '';
    this.secondarybodyPartCtrl.setValue(null);
    this.allsecondaryBodyPart = this.allsecondaryBodyPart.filter(part => part !== selectedValue);
    this.secondaryfilteredBodyPart = this.secondarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) =>
        part ? this._filtersecondary(part) : this.allsecondaryBodyPart.slice()
      )
    );

    const selectedSecondaryValues = this.secondarybodypart.slice();

    this.fetchTertiaryOptions(selectedSecondaryValues).subscribe((results: any[]) => {
      const tertiaryOptions = [].concat(...results);
      let tertiarydata: any[] = [];
      tertiaryOptions.forEach((elem: any) => {
        tertiarydata.push(elem.attributes.value);
      });
      tertiarydata = tertiarydata.filter(value => !this.tertiarybodypart.includes(value));
      this.alltertiaryBodyPart = tertiarydata;
      this.tertiaryfilteredBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
        startWith(null),
        map((part: string | null) =>
          part ? this._filtertertiary(part) : this.alltertiaryBodyPart.slice()
        )
      );
    });
  }

  selectedtertiary(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;
    if (selectedValue === 'Create Body Tertiary Region') {
      this.dialog
        .open(CreateTertiaryPartComponent)
        .afterClosed()
        .subscribe((data: any) => {
          if (data) {
            const secondaryBodyPart = this.Form.controls['secondary_body_part'].value;

            if (secondaryBodyPart && secondaryBodyPart.includes(data.secondary)) {
              this.tertiarybodypart.push(data.tertiary);
              this.Form.controls['tertiary_body_part'].setValue(this.tertiarybodypart.toString());
              this.tertiarybodyInput.nativeElement.value = '';
              this.tertiarybodyPartCtrl.setValue(null);
              this.alltertiaryBodyPart = this.alltertiaryBodyPart.filter(part => part !== selectedValue);
              this.tertiaryfilteredBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
                startWith(null),
                map((part: string | null) =>
                  part ? this._filtertertiary(part) : this.alltertiaryBodyPart.slice()
                )
              );
            } else {
              this.tertiaryfilteredBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
                startWith(null),
                map((part: string | null) =>
                  part ? this._filtertertiary(part) : this.alltertiaryBodyPart.slice()
                )
              );
            }
          }
        });

    } else {

      this.tertiarybodypart.push(selectedValue);
      this.Form.controls['tertiary_body_part'].setValue(this.tertiarybodypart.toString());
      this.tertiarybodyInput.nativeElement.value = '';
      this.tertiarybodyPartCtrl.setValue(null);
      this.alltertiaryBodyPart = this.alltertiaryBodyPart.filter(part => part !== selectedValue);
      this.tertiaryfilteredBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
        startWith(null),
        map((part: string | null) =>
          part ? this._filtertertiary(part) : this.alltertiaryBodyPart.slice()
        )
      );
    }
  }




  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allBodyPart.filter((part) =>
      part.toLowerCase().includes(filterValue)
    );
  }
  private _filterprimary(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allprimaryBodyPart.filter((part) =>
      part.toLowerCase().includes(filterValue)
    );
  }
  private _filtersecondary(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allsecondaryBodyPart.filter((part) =>
      part.toLowerCase().includes(filterValue) && this.primarybodypart.includes(part.split(' - ')[0])
    );
  }

  private _filtertertiary(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.alltertiaryBodyPart.filter((part) =>
      part.toLowerCase().includes(filterValue) &&
      this.primarybodypart.includes(part.split(' - ')[0]) &&
      this.secondarybodypart.includes(part.split(' - ')[1])
    );
  }

  fetchTertiaryOptions(selectedSecondaryValues: string[]): Observable<any> {
    const requests = selectedSecondaryValues.map(value => {
      return this.accidentService.get_tertiary_part().pipe(
        map((result: any) => {
          return result.data.filter((elem: any) => {
            return (
              elem.attributes.filter === value
            );
          });
        })
      );
    });

    return forkJoin(requests);
  }
  saveAsDraft() {
    this.Form.controls['status'].setValue('Draft')
    this.Form.controls['assignee_notification'].setValue(null)
    this.saveFlag = false
    this.saveLoadFlag = true
    this.update()
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
  update() {
    const affectedPrimaryRegionValue = this.Form.controls['primary_body_part'].value;

    if (Array.isArray(affectedPrimaryRegionValue)) {
      const stringValue = affectedPrimaryRegionValue.join(', ');
      this.Form.controls['primary_body_part'].setValue(stringValue);
    }
    const affectedSecondaryRegionValue = this.Form.controls['secondary_body_part'].value;

    if (Array.isArray(affectedSecondaryRegionValue)) {
      const stringValue = affectedSecondaryRegionValue.join(', ');
      this.Form.controls['secondary_body_part'].setValue(stringValue);
    }
    const affectedTertiaryRegionValue = this.Form.controls['tertiary_body_part'].value;

    if (Array.isArray(affectedTertiaryRegionValue)) {
      const stringValue = affectedTertiaryRegionValue.join(', ');
      this.Form.controls['tertiary_body_part'].setValue(stringValue);
    }

    this.showProgressPopup();
    this.accidentService.update_accident(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        if (this.Form.value.status === "Draft") {
          const statusText = "Accident details updated"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

        } else if (this.Form.value.status === "Open" || this.Form.value.status === "Completed") {
          Swal.fire({
            title: 'Accident Reported',
            imageUrl: "assets/images/reported.gif",
            imageWidth: 250,
            text: "You have successfully reported an Accident. We will notify the department head to take further action.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/accident-incident/accident-register"])
          })
        }
        Swal.close()
        this.saveFlag = true
        this.saveLoadFlag = false
        this.get_accident_details()
      }

    })
  }

  submit() {
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
        this.showProgressPopup();
        if (this.Form.value.injury !== 'First Aid') {
          this.Form.controls['status'].setValue('Open')
        } else {
          this.Form.controls['status'].setValue('Completed')
        }
        this.Form.controls['assignee_notification'].setValue(false)
        this.Form.controls['group_notification'].setValue(false)
        this.update()
      }
    })
  }


  private _injuryCausefilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.injuryCauseoptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  filterCategory(value: any) {
    return value.attributes?.Category === "Category"
  }

  filterAccidentType(value: any) {
    return value.attributes?.Category === "Accident Type"
  }

  filterInjuryType(value: any) {
    return value.attributes?.Category === "Injury Type"
  }

  filterInjuryCause(value: any) {
    return value.attributes?.Category === "Injury Cause"
  }
  InjCause(event: any) {

    this.Form.controls['injury_cause'].setValue(event.option.value)
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

  accidentDate(data: any) {
    const selectedDate = new Date(data.value); // Assuming data.value is a valid date string or date object
    selectedDate.setDate(selectedDate.getDate() + 1); // Adding one day
    this.Form.controls['accident_date'].setValue(selectedDate);
  }


  accidentTimeValue(data: any) {
    this.Form.controls['accident_time'].setValue(new Date(data))
  }

  injury(data: any) {
    this.Form.controls['return_of_work'].reset();
    this.Form.controls['assignee'].reset();
    this.Form.controls['injury'].setValue(data.value);

    // if (data.value === 'First Aid' || data.value === 'Non-Reportable Accident') {
    //   this.Form.controls['doctor']?.clearValidators();
    //   this.Form.controls['hospital']?.clearValidators(); 
    //   this.Form.controls['doctor']?.updateValueAndValidity();
    //   this.Form.controls['hospital']?.updateValueAndValidity(); 
    // } else {
    //   this.Form.controls['doctor']?.setValidators([Validators.required]);
    //   this.Form.controls['hospital']?.setValidators([Validators.required]);
    //   this.Form.controls['doctor']?.updateValueAndValidity();
    //   this.Form.controls['hospital']?.updateValueAndValidity(); 
    // }


    if (data.value !== 'First Aid') {
      this.Form.controls['status'].setValue('Open');
      this.Form.controls['resolution'].setValue('Open');
      this.Form.controls['assignee_notification'].setValue(false);
      this.Form.controls['group_notification'].setValue(null);
      this.Form.controls['time_of_work'].setValue('');

      this.Form.controls['return_of_work'].clearValidators();
      this.Form.controls['return_of_work_temp'].clearValidators();
      this.Form.controls['return_for_work_hour'].clearValidators();
      this.Form.controls['return_for_work_min'].clearValidators();
      this.Form.controls['assignee'].setValidators([Validators.required]);

      this.Form.controls['return_of_work'].updateValueAndValidity();
      this.Form.controls['return_of_work_temp'].updateValueAndValidity();
      this.Form.controls['return_for_work_hour'].updateValueAndValidity();
      this.Form.controls['return_for_work_min'].updateValueAndValidity();
      this.Form.controls['assignee'].updateValueAndValidity();
    } else {
      this.Form.controls['status'].setValue('Completed');
      this.Form.controls['resolution'].setValue('Completed');
      this.Form.controls['assignee_notification'].setValue(true);
      this.Form.controls['group_notification'].setValue(false);
      this.Form.controls['time_of_work'].setValue('0 Days');

      this.Form.controls['return_of_work'].clearValidators();
      this.Form.controls['return_of_work_temp'].clearValidators();
      this.Form.controls['return_for_work_hour'].clearValidators();
      this.Form.controls['return_for_work_min'].clearValidators();
      this.Form.controls['assignee'].clearValidators();

      this.Form.controls['return_of_work'].updateValueAndValidity();
      this.Form.controls['return_of_work_temp'].updateValueAndValidity();
      this.Form.controls['return_for_work_hour'].updateValueAndValidity();
      this.Form.controls['return_for_work_min'].updateValueAndValidity();
      this.Form.controls['assignee'].updateValueAndValidity();
    }
  }


  severity(data: any) {
    this.Form.controls['severity'].setValue(data.value)
  }

  returnWorkHour(data: any) {
    const hour = this.Form.value.return_of_work_temp.hour
    const min = this.Form.value.return_of_work_temp.minute
    this.Form.controls['return_for_work_hour'].setValue(hour)
    this.Form.controls['return_for_work_min'].setValue(min)
    const returnWork = hour + ' Hour ' + min + ' Minute'
    this.Form.controls['return_of_work'].setValue(returnWork)
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
