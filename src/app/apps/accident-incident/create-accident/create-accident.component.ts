import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddWitnessComponent } from './add-witness/add-witness.component';
import Swal from 'sweetalert2';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AddModifyAffectedPersonComponent } from './add-modify-affected-person/add-modify-affected-person.component';
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { forkJoin, map, Observable, startWith } from 'rxjs';

const { Configuration, OpenAIApi } = require("openai");
import {
  DropzoneDirective,
  DropzoneConfigInterface,
} from 'ngx-dropzone-wrapper';
import { NewDepartmentComponent } from '../../general-component/new-department/new-department.component';
import { category } from '../../audit-inspection/audit-calendar/audit-calendar/data';
import { CreateTertiaryPartComponent } from './create-tertiary-part/create-tertiary-part.component';
import { AnyARecord } from 'dns';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'app-create-accident',
  templateUrl: './create-accident.component.html',
  styleUrls: ['./create-accident.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CreateAccidentComponent implements OnInit {

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
  };
  @ViewChild(DropzoneDirective, { static: false })
  directiveRef?: DropzoneDirective;

  files: File[] = [];
  evidenceCount: number = 0;
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 2;
  accidentCategory: any[] = [];
  accSubCategories: any[] = [];
  accTypes: any[] = [];
  bodypart: string[] = [];
  primarybodypart: string[] = [];
  secondarybodypart: string[] = [];
  tertiarybodypart: string[] = [];
  filteredBodyPart: Observable<string[]>;
  filteredprimaryBodyPart: Observable<string[]>;
  filteredsecondaryBodyPart: Observable<string[]>;
  filteredtertiaryBodyPart: Observable<string[]>;
  injurtTypes: any[] = [];
  injuryCauses: any[] = [];
  bodyParts: any[] = [];
  primarybodyParts: any[] = [];
  secondarybodyParts: any[] = [];
  tertiarybodyParts: any[] = [];
  allBodyPart: string[] = [];
  allprimaryBodyPart: string[] = [];
  allsecondaryBodyPart: string[] = [];
  alltertiaryBodyPart: string[] = [];
  bodyPartCtrl = new FormControl('');
  primarybodyPartCtrl = new FormControl(null, [Validators.required]);
  secondarybodyPartCtrl = new FormControl('');
  tertiarybodyPartCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string;
  affectedPeoples: any
  Form: FormGroup;
  divisions: any[] = [];
  accidentdate = new FormControl(null, [Validators.required]);
  accidenttime = new FormControl(null, [Validators.required]);
  peopleList: any[] = [];
  affectedPeopleList: accident_people[] = [];
  witnessRegister: any[] = [];
  witnessList: any[] = [];
  evidenceFormData = new FormData();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  evidenceData: any;
  dropdownValues: any;
  departments: any[] = [];
  InjuryCause = new FormControl(null, [Validators.required]);
  injuryCauseOptions: Observable<string[]>;
  injuryCauseoptions: string[] = [];
  Division = new FormControl(null, [Validators.required]);
  unitSpecific: any
  userDivision: any
  corporateUser: any
  bodyPartsMandatory: Boolean
  // returnForWork:any={hour: 0, minute: 0};
  returnForWork = { hour: 13, minute: 30 };
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
      ],
    },
  };

  constructor(
    private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private accidentService: AccidentService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.filteredBodyPart = this.bodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) =>
        part ? this._filter(part) : this.allBodyPart.slice()
      )
    );
    this.filteredprimaryBodyPart = this.primarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) =>
        part ? this._filterprimary(part) : this.allprimaryBodyPart.slice()
      )
    );
    // this.injuryCauseOptions = this.InjuryCause.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => {
    //     const dropDownValues = this._injuryCausefilter(value)
    //     const isValid = dropDownValues.includes(value);
    //     // If not valid, set an error on the form control
    //     if (!isValid && value !== '') {
    //       this.InjuryCause.setErrors({ invalidCause: true });
    //       this.InjuryCause.updateValueAndValidity()
    //     } else {
    //       this.InjuryCause.setErrors(null); // Clear the error if the value is valid
    //     }
    //     if (!isValid && value !== '') {
    //       this.Form.setErrors({ manualInvalid: true });
    //     } else {
    //       this.Form.setErrors(null); // Clear the form-level error if valid
    //     }
    //     return dropDownValues
    //   })
    // );

    this.injuryCauseOptions = this.InjuryCause.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        const dropDownValues = this._injuryCausefilter(value);

        const isValid = this.injuryCauseoptions.some(
          (option) => option.toLowerCase() === value.toLowerCase()
        );

        // Set or clear the error based on validity
        if (!isValid && value.trim() !== '' || value.trim() === '') {
          this.InjuryCause.setErrors({ invalidCause: true });
        } else {
          this.InjuryCause.setErrors(null);
        }

        // Set form-level error only if the input is invalid
        if (!isValid && value.trim() !== '') {
          this.Form.setErrors({ manualInvalid: true });
        } else if (this.Form.hasError('manualInvalid')) {
          this.Form.setErrors(null);
        }

        return dropDownValues;
      })
    );
  }

  ngOnInit() {
    this.configuration();
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      reference_number: [''],
      reported_date: [new Date(), [Validators.required]],
      division: ['', [Validators.required]],
      location: ['', [Validators.required]],
      department: [''],
      status: ['Open', [Validators.required]],
      accident_date: [null, [Validators.required]],
      accident_time: [null, [Validators.required]],
      supervisor: ['', [Validators.required]],
      assignee: [null, [Validators.required]],
      severity: ['', [Validators.required]],
      witness: [''],
      evidence_type: [''],
      evidence_name: [''],
      evidence_id: [null],
      evidence: [''],
      reporter: [''],
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
      return_for_work_hour: [null, [Validators.required]],
      return_for_work_min: [null, [Validators.required]],
      injury: [''],
      affected_body_part: [''],
      tertiary_body_part: [''],
      primary_body_part: [''],
      secondary_body_part: [''],
      assignee_notification: [null],
      group_notification: [null],
      resolution: [''],
      business_unit: [null],
      work_performed: ['', [Validators.required]],
      description: ['', [Validators.required]],
      action_taken: ['', [Validators.required]],
      consiquence_category: ['nill'],
    });
  }

  filterCategory(value: any) {
    return value.attributes?.Category === 'Category';
  }

  filterAccidentType(value: any) {
    return value.attributes?.Category === 'Accident Type';
  }

  filterInjuryType(value: any) {
    return value.attributes?.Category === 'Injury Type';
  }

  filterInjuryCause(value: any) {
    return value.attributes?.Category === 'Injury Cause';
  }

  @ViewChild('bodyPartInput') bodyInput: ElementRef<HTMLInputElement>;
  @ViewChild('primarybodyPartInput') primarybodyInput: ElementRef<HTMLInputElement>;
  @ViewChild('secondarybodyPartInput') secondarybodyInput: ElementRef<HTMLInputElement>;
  @ViewChild('tertiarybodyPartInput') tertiarybodyInput: ElementRef<HTMLInputElement>;

  add(event: MatChipInputEvent): void {
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
    // alert()

    // const value = (event.value || '').trim();
    // if (value) {
    //   this.tertiarybodypart.push(value);
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
  BusinessUnit(event: any) {
    this.Form.controls['division'].setValue(event.value.division_name)
    this.Form.controls['business_unit'].setValue(event.value.id)
  }
  removeprimary(part: string): void {
    // Remove the selected primary value
    this.primarybodypart = this.primarybodypart.filter(p => p !== part);

    // Remove associated secondary and tertiary values
    this.secondarybodypart = this.secondarybodypart.filter(s => !s.startsWith(part));
    this.tertiarybodypart = this.tertiarybodypart.filter(t => !t.startsWith(part));

    // Add the removed value back to the options
    this.allprimaryBodyPart.push(part);

    // Update the form control value
    this.Form.controls['primary_body_part'].setValue(this.primarybodypart.toString());

    // Update the filtered options for primary, secondary, and tertiary
    this.filteredprimaryBodyPart = this.primarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filterprimary(value) : this.allprimaryBodyPart.slice()
      )
    );

    this.filteredsecondaryBodyPart = this.secondarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filtersecondary(value) : this.allsecondaryBodyPart.slice()
      )
    );

    this.filteredtertiaryBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filtertertiary(value) : this.alltertiaryBodyPart.slice()
      )
    );
  }

  removesecondary(part: string): void {
    // Remove the selected secondary value
    this.secondarybodypart = this.secondarybodypart.filter(s => s !== part);

    // Add the removed value back to the options
    this.allsecondaryBodyPart.push(part);

    // Remove associated tertiary values
    this.tertiarybodypart = this.tertiarybodypart.filter(t => !t.startsWith(part));

    // Update the form control value
    this.Form.controls['secondary_body_part'].setValue(this.secondarybodypart.toString());

    // Update the filtered options for secondary and tertiary
    this.filteredsecondaryBodyPart = this.secondarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filtersecondary(value) : this.allsecondaryBodyPart.slice()
      )
    );

    this.filteredtertiaryBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filtertertiary(value) : this.alltertiaryBodyPart.slice()
      )
    );
  }

  removetertiary(part: string): void {
    // Remove the selected tertiary value
    this.tertiarybodypart = this.tertiarybodypart.filter(t => t !== part);

    // Add the removed value back to the options
    this.alltertiaryBodyPart.push(part);

    // Update the form control value
    this.Form.controls['tertiary_body_part'].setValue(this.tertiarybodypart.toString());

    // Update the filtered options for tertiary
    this.filteredtertiaryBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filtertertiary(value) : this.alltertiaryBodyPart.slice()
      )
    );
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

    this.filteredprimaryBodyPart = this.primarybodyPartCtrl.valueChanges.pipe(
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
      this.filteredsecondaryBodyPart = this.secondarybodyPartCtrl.valueChanges.pipe(
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
    this.filteredsecondaryBodyPart = this.secondarybodyPartCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) =>
        part ? this._filtersecondary(part) : this.allsecondaryBodyPart.slice()
      )
    );

    const module = 'Accident and Incident';
    const selectedSecondaryValues = this.secondarybodypart.slice();

    this.fetchTertiaryOptions(selectedSecondaryValues).subscribe((results: any[]) => {
      const tertiaryOptions = [].concat(...results);
      let tertiarydata: any[] = [];
      tertiaryOptions.forEach((elem: any) => {
        tertiarydata.push(elem.attributes.value);
      });
      tertiarydata = tertiarydata.filter(value => !this.tertiarybodypart.includes(value));
      this.alltertiaryBodyPart = tertiarydata;
      this.filteredtertiaryBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
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
              this.filteredtertiaryBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
                startWith(null),
                map((part: string | null) =>
                  part ? this._filtertertiary(part) : this.alltertiaryBodyPart.slice()
                )
              );
            } else {
              this.filteredtertiaryBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
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
      this.filteredtertiaryBodyPart = this.tertiarybodyPartCtrl.valueChanges.pipe(
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
  // private _injuryCausefilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.injuryCauseoptions.filter(
  //     (option) => option.toLowerCase().indexOf(filterValue) === 0
  //   );
  // }

  private _injuryCausefilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.injuryCauseoptions.filter((option) =>
      option.toLowerCase().startsWith(filterValue)
    );
  }
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident;
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          this.router.navigate(['/error/upgrade-subscription']);
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id;
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split('=');
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1]);
              this.Form.controls['org_id'].setValue(
                decodeURIComponent(cookiePair[1])
              );
            }
          }
          this.me();
        }
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.Form.controls['reporter'].setValue(result.id);
        const status = result.acc_inc_create;
        if (status === false) {
          this.router.navigate(['/error/unauthorized']);
        } else {
          this.get_dropdown_values();
          this.get_department();
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
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }
  InjCause(event: any) {



    this.Form.controls['injury_cause'].setValue(event.option.value);
  }


  get_dropdown_values() {
    const module = 'Accident and Incident';
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {


        this.dropdownValues = result.data;


        const bodyPart = result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Body Part';
        });
        let data: any[] = [];
        bodyPart.forEach((elem: any) => {
          data.push(elem.attributes.Value);
        });
        this.allBodyPart = data;
        const primarybodyPart = result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Body Primary Region';
        });
        let primarydata: any[] = [];
        primarybodyPart.forEach((elem: any) => {
          primarydata.push(elem.attributes.Value);
        });
        this.allprimaryBodyPart = primarydata;

        const injurycause = result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Injury Cause';
        });
        let injurydata: any[] = [];
        injurycause.forEach((elem: any) => {
          injurydata.push(elem.attributes.Value);
        });
        this.injuryCauseoptions = injurydata;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }
  get_department() {
    this.generalService.get_department().subscribe({
      next: (result: any) => {
        this.departments = result.data;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }
  new_department() {
    this.dialog
      .open(NewDepartmentComponent)
      .afterClosed()
      .subscribe((data: any) => {
        const name = data.name;
        this.generalService
          .create_department(name, this.Form.value.reporter)
          .subscribe({
            next: (result: any) => {
              this.generalService.get_department().subscribe({
                next: (result: any) => {
                  this.departments = result.data;
                },
                error: (err: any) => {
                  this.router.navigate(['/error/internal']);
                },
                complete: () => {
                  const statusText = 'Department created successfully';
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['department'].setValue(
                    result.data.attributes.department_name
                  );
                },
              });
            },
            error: (err: any) => {
              this.router.navigate(['/error/internal']);
            },
            complete: () => { },
          });
      });
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

  accCategory() {
    const category = this.Form.value.category;
    this.Form.controls['sub_category'].setValue('')
    const subData = this.dropdownValues.filter(function (elem: any) {
      return elem.attributes.filter === category;
    });
    if (subData.length > 0) {
      this.accSubCategories = subData;
    }
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


  addPeople() {
    this.dialog
      .open(AddModifyAffectedPersonComponent)
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.affectedPeopleList.push(data);
          if (this.affectedPeopleList.length > 0) {
            this.Form.controls['affected_people'].setErrors(null);
          } else {
            this.Form.controls['affected_people'].setValidators(
              Validators.required
            );
          }
        }
      });
  }

  // buttonDisable(){
  //   if(this.Form.value.category === 'Health' && this.Form.valid){
  //     if (this.affectedPeopleList.length > 0) {
  //       return true
  //     }
  //   }else{
  //     return false;
  //   }

  // }

  modifyPeopleDetails(personData: any) {
    this.dialog
      .open(AddModifyAffectedPersonComponent, {
        data: personData,
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.affectedPeopleList.splice(
            this.affectedPeopleList.findIndex(
              (existingCustomer) => existingCustomer.id === data.id
            ),
            1
          );
          this.affectedPeopleList.push(data);
        }
      });
  }

  deletePeople(data: any) {
    this.affectedPeopleList.splice(
      this.affectedPeopleList.findIndex(
        (existingCustomer) => existingCustomer.id === data.id
      ),
      1
    );
  }

  deleteWitness(data: any) {
    this.witnessList.splice(
      this.witnessList.findIndex(
        (existingCustomer) => existingCustomer.id === data.id
      ),
      1
    );
  }

  modifyWitness(witnessData: any) {
    this.dialog
      .open(AddWitnessComponent, {
        data: witnessData,
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.witnessList.splice(
            this.witnessList.findIndex(
              (existingCustomer) => existingCustomer.id === data.id
            ),
            1
          );
          this.witnessList.push(data);
        }
      });
  }

  addWitness() {
    this.dialog
      .open(AddWitnessComponent)
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.witnessList.push(data);
          if (this.witnessList.length > 0) {
            this.Form.controls['witness'].setErrors(null);
            this.Form.controls['witness'].setValue('OK')
          } else {
            this.Form.controls['witness'].reset()
          }
        }
      });
  }

  evidence(event: any) {
    if (event.target.files.length > 0) {
      const size = event.target.files[0].size / 1024 / 1024;
      if (size > 2) {
        const statusText = 'Please choose an image below 2 MB';
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['jpg', 'jpeg', 'png'];
        var extension = event.target.files[0].name
          .split('.')
          .pop()
          .toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        this.Form.controls['evidence_type'].setValue(extension);
        if (isSuccess) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              this.Form.controls['evidence'].setValue(event.target.result);
            }
          };
          reader.readAsDataURL(event.target.files[0]);
          this.evidenceData = event.target.files[0];
          this.files.push(event.target.files[0]);
        } else {
          const statusText = "Please choose images ('jpg', 'jpeg', 'png')";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    }
  }

  accidentDate(data: any) {
    const selectedDate = new Date(data.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['accident_date'].setValue(selectedDate);
  }

  accidentTimeValue(data: any) {
    this.Form.controls['accident_time'].setValue(new Date(data));
  }

  severity(data: any) {
    this.Form.controls['severity'].setValue(data.value);
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

  identNonReport(data: any) {
    if (this.Form.value.time_of_work == '0 Days') {
      this.Form.controls['return_of_work'].setValidators([Validators.required]);
      this.Form.controls['return_of_work_temp'].setValidators([
        Validators.required,
      ]);
      this.Form.controls['return_for_work_hour'].setValidators([
        Validators.required,
      ]);
      this.Form.controls['return_for_work_min'].setValidators([
        Validators.required,
      ]);

      this.Form.controls['return_of_work'].updateValueAndValidity();
      this.Form.controls['return_of_work_temp'].updateValueAndValidity();
      this.Form.controls['return_for_work_hour'].updateValueAndValidity();
      this.Form.controls['return_for_work_min'].updateValueAndValidity();
    } else {
      this.Form.controls['return_of_work'].clearValidators();
      this.Form.controls['return_of_work_temp'].clearValidators();
      this.Form.controls['return_for_work_hour'].clearValidators();
      this.Form.controls['return_for_work_min'].clearValidators();

      this.Form.controls['return_of_work'].updateValueAndValidity();
      this.Form.controls['return_of_work_temp'].updateValueAndValidity();
      this.Form.controls['return_for_work_hour'].updateValueAndValidity();
      this.Form.controls['return_for_work_min'].updateValueAndValidity();
    }
  }

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }
  submit() {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: 'assets/images/confirm-1.gif',
      imageWidth: 250,
      text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.showProgressPopup();
        this.create_reference_number();
      }
    });
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

  logInvalidControls() {
    Object.keys(this.Form.controls).forEach((controlName) => {
      const control = this.Form.get(controlName);
      if (control && control.invalid) {
      }
    });
  }

  create_reference_number() {
    this.accidentService.get_accidents(this.orgID).subscribe({
      next: (result: any) => {
        const count = result.data.length;
        const newCount = Number(count) + 1;
        const reference = 'ACD-' + newCount;
        this.Form.controls['reference_number'].setValue(reference);
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        this.create_accident();
      },
    });
  }

  create_accident() {
    this.accidentService.create_accident(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id);
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        this.create_witness();
        this.addAffetectedPeople();
      },
    });
  }

  create_witness() {
    this.witnessList.forEach((elem) => {
      this.accidentService.create_witness(elem, this.Form.value.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          this.router.navigate(['/error/internal']);
        },
        complete: () => {

        },
      });
    });
  }

  addAffetectedPeople() {
    this.affectedPeopleList.forEach((elem) => {
      this.accidentService
        .create_accident_individual(elem, this.Form.value.id)
        .subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(['/error/internal']);
          },
          complete: () => { },
        });
    });
    this.create_notification();
    this.upload_evidence();
  }

  upload_evidence() {
    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files');
      const extension = elem.name.split('.').pop().toLowerCase();
      this.evidenceFormData.append(
        'files',
        elem,
        this.Form.value.reference_number + '.' + extension
      );
      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = [];
          data.push({
            evidence_name: result[0].hash,
            format: extension,
            accident: this.Form.value.id,
            id: result[0].id,
          });
          this.accidentService.create_accident_evidence(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => { },
          });
        },
        error: (err: any) => { },
        complete: () => {
          Swal.close();
        },
      });
    });
  }

  create_activity() {
    const action = 'Reported an Accident';
    const refernceNumber = this.Form.value.reference_number;
    const user = this.Form.value.reporter;
    this.generalService
      .create_activity_stream(action, refernceNumber, user)
      .subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          this.router.navigate(['/error/internal']);
        },
        complete: () => {
          this.create_notification();
        },
      });
  }

  create_notification() {
    let data: any[] = [];
    data.push({
      module: 'Accident & Incident',
      action: 'Reported a new Accident:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.assignee,
      access_link: '/apps/accident-incident/accident-action/',
      profile: this.Form.value.reporter,
    });
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        Swal.fire({
          title: 'Accident Reported',
          imageUrl: 'assets/images/reported.gif',
          imageWidth: 250,
          text: 'You have successfully reported an Accident. We will notify the department head to take further action.',
          showCancelButton: false,
        }).then((result) => {
          this.router.navigate(['/apps/accident-incident/accident-register']);
        });
      },
    });
  }

  // onSelect(event: any) {
  //   const fileLength = this.files.length
  //   const addedLength = event.addedFiles.length
  //   if (fileLength === 0 && addedLength < 6) {
  //     const size = event.addedFiles[0].size / 1024 / 1024
  //     if (size > 2) {
  //       const statusText = "Please choose an image below 2 MB"
  //       this._snackBar.open(statusText, 'Close Warning', {
  //         horizontalPosition: this.horizontalPosition,
  //         verticalPosition: this.verticalPosition,
  //       });
  //     } else {
  //       var fileTypes = ['jpg', 'jpeg', 'png'];
  //       var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
  //         isSuccess = fileTypes.indexOf(extension) > -1;
  //       if (isSuccess) {
  //         this.Form.controls['evidence'].setErrors(null)
  //         this.files.push(...event.addedFiles);
  //       } else {
  //         const statusText = "Please choose images ('jpg', 'jpeg', 'png')"
  //         this._snackBar.open(statusText, 'Close Warning', {
  //           horizontalPosition: this.horizontalPosition,
  //           verticalPosition: this.verticalPosition,
  //         });
  //       }
  //     }
  //   } else if (fileLength < 5) {
  //     const statusText = "You have exceed the upload limit"
  //     this._snackBar.open(statusText, 'Close Warning', {
  //       horizontalPosition: this.horizontalPosition,
  //       verticalPosition: this.verticalPosition,
  //     });
  //   }
  // }

  onSelect(event: any) {
    if (this.files.length < 5) {
      for (const addedFile of event.addedFiles) {
        const size = addedFile.size / 1024 / 1024;

        if (size > 20) {
          const statusText = 'Please choose an image below 20 MB';
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          const fileTypes = ['jpg', 'jpeg', 'png'];
          const extension = addedFile.name.split('.').pop().toLowerCase();
          const isSuccess = fileTypes.indexOf(extension) > -1;

          if (isSuccess) {
            this.Form.controls['evidence'].setErrors(null);
            this.files.push(addedFile);
          } else {
            const statusText = "Please choose images ('jpg', 'jpeg', 'png')";
            this._snackBar.open(statusText, 'Close Warning', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          }
        }
      }
    } else {
      const statusText = 'You have exceeded the upload limit';
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length === 0) {
      this.Form.controls['evidence'].reset();
    }
  }

  saveAsDraft() {
    this.Form.controls['assignee_notification'].setValue(false)
    this.Form.controls['status'].setValue('Draft')
    this.showProgressPopup();
    this.accidentService.get_accidents(this.orgID).subscribe({
      next: (result: any) => {
        const count = result.data.length;
        const newCount = Number(count) + 1;
        const reference = 'ACD-' + newCount;
        this.Form.controls['reference_number'].setValue(reference);
      },
      error: (err: any) => {
        Swal.close();
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        this.create_accident_draft();
      },
    });
  }

  create_accident_draft() {
    this.accidentService.create_accident_draft(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id);
        this.Form.controls['reference_number'].setValue(
          result.data.attributes.reference_number
        );
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {
        this.create_witness_draft();
      },
    });
  }

  create_witness_draft() {
    if (this.witnessList.length > 0) {
      this.witnessList.forEach((elem) => {
        this.accidentService
          .create_witness(elem, this.Form.value.id)
          .subscribe({
            next: (result: any) => { },
            error: (err: any) => {
              this.router.navigate(['/error/internal']);
            },
            complete: () => {
              this.addAffetectedPeopleDraft();
            },
          });
      });
    } else {
      this.addAffetectedPeopleDraft();
    }
  }

  addAffetectedPeopleDraft() {
    if (this.affectedPeopleList.length > 0) {
      this.affectedPeopleList.forEach((elem) => {
        this.accidentService
          .create_accident_individual(elem, this.Form.value.id)
          .subscribe({
            next: (result: any) => { },
            error: (err: any) => {
              this.router.navigate(['/error/internal']);
            },
            complete: () => {
              this.upload_evidence_draft();
            },
          });
      });
    } else {
      this.upload_evidence_draft();
    }
  }

  upload_evidence_draft() {
    if (this.files.length > 0) {
      this.files.forEach((elem: any) => {
        this.evidenceFormData.delete('files');
        const extension = elem.name.split('.').pop().toLowerCase();
        this.evidenceFormData.append(
          'files',
          elem,
          this.Form.value.reference_number + '.' + extension
        );
        this.generalService.upload(this.evidenceFormData).subscribe({
          next: (result: any) => {
            let data: any[] = [];
            data.push({
              evidence_name: result[0].hash,
              format: extension,
              accident: this.Form.value.id,
              id: result[0].id,
            });
            this.accidentService.create_accident_evidence(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                const current = this.evidenceCount;
                this.evidenceCount = Number(current) + 1;
                if (this.evidenceCount === this.files.length) {
                  const statusText = 'Accident details saved';
                  this._snackBar.open(statusText, 'OK', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  Swal.close();
                  this.router.navigate([
                    '/apps/accident-incident/accident-modify/' +
                    this.Form.value.reference_number,
                  ]);
                }
              },
            });
          },
          error: (err: any) => { },
          complete: () => { },
        });
      });
    } else {
      const statusText = 'Accident details saved';
      this._snackBar.open(statusText, 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      Swal.close();
      this.router.navigate([
        '/apps/accident-incident/accident-modify/' +
        this.Form.value.reference_number,
      ]);
    }
  }

  returnWorkHour(data: any) {
    const hour = this.Form.value.return_of_work_temp.hour;
    const min = this.Form.value.return_of_work_temp.minute;
    this.Form.controls['return_for_work_hour'].setValue(hour);
    this.Form.controls['return_for_work_min'].setValue(min);
    const returnWork = hour + ' Hour ' + min + ' Minute';
    this.Form.controls['return_of_work'].setValue(returnWork);
  }
}
