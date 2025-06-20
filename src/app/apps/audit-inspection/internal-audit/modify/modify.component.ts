import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.api.service';
import { MatDialog } from '@angular/material/dialog';
import { NewAuditeeComponent } from '../new-auditee/new-auditee.component';
import { IncidentService } from 'src/app/services/incident.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { NewDepartmentComponent } from 'src/app/apps/general-component/new-department/new-department.component';
import { NewFactoryContactPersonComponent } from '../new-factory-contact-person/new-factory-contact-person.component';
import { NewFactoryComponent } from '../new-factory/new-factory.component';
import { ModifyAuditeeComponent } from '../modify-auditee/modify-auditee.component';
import { log } from 'console';
import { NewProcessTypeComponent } from '../new-process-type/new-process-type.component';
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
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ModifyComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  audit_scheduled_for_supplier: boolean;
  orgID: string
  divisions: any[] = []
  divisionUuids: any[] = []
  process_types: any[] = []
  SupplierTypes: any[] = []
  departments: any[] = []
  peopleList: any[] = []
  approversList: any[] = []
  auditTitle = new FormControl(null, [Validators.required]);
  dropdownValues: any
  auditTitles: any[] = []
  auditTypes: any[] = []
  employees: any[] = []
  auditDepartment = new FormControl(null);
  contactPersons: any[] = []
  factories: any[] = []
  factoryContactPerson = new FormControl(null, [Validators.required]);
  factory = new FormControl(null, [Validators.required]);
  auditee = new FormControl(null, [Validators.required]);
  Division = new FormControl(null, [Validators.required]);
  auditType = new FormControl(null, [Validators.required]);
  Supplier_Type = new FormControl(null, [Validators.required]);
  Process_Type = new FormControl(null,);
  auditees: any[] = []
  teamMemberIDs: any[] = []
  userID: any
  initiallySelectedAuditees: any[] = []; // Initialize with empty array
  selectedIds: any[] = [];
  Form: FormGroup
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
  approvalDate = new FormControl(null, [Validators.required]);

  factoryName: string


  auditDateRange = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required)
  });
  unitSpecific: any
  corporateUser: any
  userDivision: any

  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    public dialog: MatDialog,
    public internalAuditService: InternalAuditService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar, private _location: Location) { }

  ngOnInit() {
    this.configuration()

    this.Form = this.formBuilder.group({
      org_id: [''],
      id: [''],
      reference_number: [''],
      date: [new Date, [Validators.required]],
      division: ['', [Validators.required]],
      type: ['', [Validators.required]],
      department: [''],
      title: ['', [Validators.required]],
      factory_name: ['', [Validators.required]],
      factory_address: ['', [Validators.required]],
      contact_person: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      contact_email: ['', [Validators.required]],
      contact_number: ['', [Validators.required]],
      description: [''],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      // auditee: [null, [Validators.required]],
      approval_date: ['', [Validators.required]],
      approver: ['', [Validators.required]],
      created_user: [''],
      auditeeID: [''],
      status: ['Draft'],
      updatedBy: [''],
      userId: [''],
      business_unit: [null],
      audit_scheduled_for_supplier: [false],
      supplier_type: [''],
      factory_license_no: [''],
      higg_id: [''],
      zdhc_id: [''],
      process_type: ['']
    });

    this.Form.controls['factory_address'].disable()
    this.Form.controls['contact_person'].disable()
    this.Form.controls['designation'].disable()
    this.Form.controls['contact_email'].disable()
    this.Form.controls['contact_number'].disable()
  }

  startDateChange(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['start'].setValue(newDate)
  }

  endDateChange(event: any) {

    const date = new Date(event.value);
    const newDate = new Date(date.setDate(date.getDate() + 1));

    // Check if the year is 1970
    if (newDate.getFullYear() === 1970) {
      this.Form.controls['end'].setValue(null);

    } else {
      this.Form.controls['end'].setValue(newDate.toISOString().slice(0, 10));

    }

  }


  approval_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['approval_date'].setValue(newDate)
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.audit_inspection
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.Form.controls['created_user'].setValue(result.id)
        this.Form.controls['updatedBy'].setValue(result.id)
        this.Form.controls['userId'].setValue(result.id)
        const status = result.int_aud_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions()
              this.get_int_aud_approvers()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
                this.divisionUuids.push(elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_int_aud_approvers()
            }
          } else {
            this.get_divisions()
            this.get_int_aud_approvers()
          }
          this.get_dropdown_values()
          this.get_factories()
          this.get_contact_persons()
          this.get_department()
          this.get_auditees()
          this.get_process_types()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.get_audit_details()
      }
    })
  }

  get_dropdown_values() {
    const module = "Internal Audit"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        const title = this.dropdownValues.filter(function (elem: any) {
          return (elem.attributes.Category === "Audit Title")
        })
        this.auditTitles = title
        const type = this.dropdownValues.filter(function (elem: any) {
          return (elem.attributes.Category === "Audit Type")
        })
        this.auditTypes = type
        const Suppliertype = this.dropdownValues.filter(function (elem: any) {
          return (elem.attributes.Category === "Supplier Type")
        })
        this.SupplierTypes = Suppliertype
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  AuditTitle(event: any) {
    const selectedTitles = event.value;
    const companyCodeOfConductSelected = selectedTitles.includes("Company Code of Conduct");
    if (companyCodeOfConductSelected) {
      this.Form.controls['title'].setValue("Company Code of Conduct");
      this.auditTitle.setValue([this.Form.controls['title'].value]);
    } else {
      this.Form.controls['title'].setValue(event.value);
    }
    this.auditTitles.forEach(title => {
      if (title.attributes.Value !== "Company Code of Conduct") {
        title.disabled = companyCodeOfConductSelected;
      }
    });
  }

  FactoryContactPerson(event: any) {
    this.Form.controls['contact_person'].setValue(event.value.toString())
  }
  AuditFactory(event: any) {
    this.Form.controls['factory_name'].setValue(event.value.toString())
  }
  BusinessUnit(event: any) {
    const selectedData = this.divisions.find(data => data.division_name === event.value);
    this.Form.controls['division'].setValue(selectedData.division_name)
    this.Form.controls['business_unit'].setValue(selectedData.id)
  }
  ChangeAuditType(event: any) {
    this.Form.controls['type'].setValue(event.value)
  }
  get_contact_persons() {
    this.internalAuditService.get_contact_persons().subscribe({
      next: (result: any) => {
        this.contactPersons = result.data
      },
      error: (errL: any) => { },
      complete: () => { }
    })
  }
  get_factories() {
    this.internalAuditService.get_factories().subscribe({
      next: (result: any) => {


        this.factories = result.data
        const allFactories = this.factories.find(name => name.attributes.factory_name === this.factoryName);


        if (allFactories) {
          this.Form.patchValue({
            factory_name: allFactories.attributes.factory_name,
            contact_person: allFactories.attributes.factory_contact_person,
            designation: allFactories.attributes.designation,
            contact_email: allFactories.attributes.email,
            contact_number: allFactories.attributes.contact_number,
            factory_address: allFactories.attributes.factory_address,

          })
        }


      },
      error: (errL: any) => { },
      complete: () => {

      }
    })
  }

  onFactoryNameSelected(selectedValue: any) {
    const selectedOption = this.factories.find(name => name.attributes.factory_name === selectedValue);

    if (selectedOption) {
      this.Form.patchValue({
        factory_name: selectedOption.attributes.factory_name,
        contact_person: selectedOption.attributes.factory_contact_person,
        designation: selectedOption.attributes.designation,
        contact_email: selectedOption.attributes.email,
        contact_number: selectedOption.attributes.contact_number,
        factory_address: selectedOption.attributes.factory_address,

      })
    }


  }

  new_process_type() {
    this.dialog.open(NewProcessTypeComponent).afterClosed().subscribe((data: any) => {

      this.internalAuditService.create_process_type(data, this.Form.value.created_user).subscribe({
        next: (result: any) => {
          this.internalAuditService.get_process_types().subscribe({
            next: (result: any) => {
              this.process_types = result.data;

            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"]);
            },
            complete: () => {
              const process_typename = result.data.attributes.name;

              this.Form.controls['process_type'].setValue(process_typename)
              this.Process_Type.setValue(process_typename);


              const statusText = "New Process Type created successfully";
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            }
          });
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => { }
      });

    });
  }


  new_contact_person() {
    this.dialog.open(NewFactoryContactPersonComponent).afterClosed().subscribe((data: any) => {
      const name = data.name;

      this.internalAuditService.create_factory_contact_person(name, this.Form.value.userId).subscribe({
        next: (result: any) => {
          this.internalAuditService.get_contact_persons().subscribe({
            next: (result: any) => {
              this.contactPersons = result.data;
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"]);
            },
            complete: () => {
              const personname = result.data.attributes.person_name;

              const currentValues = this.factoryContactPerson.value || [];

              const newValues = [...currentValues, personname];

              this.factoryContactPerson.setValue(newValues);

              const statusText = "Contact Person created successfully";
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            }
          });
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => { }
      });
    });
  }

  AuditAuditee(auditee: any) {
    const selectedAuditeeIDs: any[] = this.auditee.value.map((aud: { id: any; }) => aud.id);
    const newAuditeeID = auditee.id;
    if (!selectedAuditeeIDs.includes(newAuditeeID)) {
      this.Form.controls['auditeeID'].setValue(selectedAuditeeIDs);
      selectedAuditeeIDs.push(newAuditeeID);
      this.Form.controls['auditeeID'].setValue(selectedAuditeeIDs);
    }
  }



  new_factory() {
    this.dialog.open(NewFactoryComponent).afterClosed().subscribe((data: any) => {

      if (data) {

        const name = data;


        this.Form.patchValue({
          factory_name: data.factory_name,
          factory_contact_person: data.contact_person,
          designation: data.designation,
          contact_email: data.contact_email,
          contact_number: data.contact_number,
          factory_address: data.factory_address,

        })

        this.internalAuditService.create_factory(name, this.Form.value.userId).subscribe({
          next: (result: any) => {
            this.internalAuditService.get_factories().subscribe({
              next: (result: any) => {
                this.factories = result.data;

              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"]);
              },
              complete: () => {
                const factoryname = result.data.attributes.factory_name;



                this.Form.controls['factory_name'].setValue(factoryname)
                this.factory.setValue(factoryname);


                const statusText = "New Factory created successfully";
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
              }
            });
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"]);
          },
          complete: () => { }
        });
      }
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
      complete: () => {
        this.get_department()

      },
    });
  }
  // get_division() {
  //   this.generalService.get_division(this.orgID).subscribe({
  //     next: (result: any) => {
  //       this.divisions = result.data
  //     },
  //     error: (errL: any) => { },
  //     complete: () => {

  //     }
  //   })
  // }
  get_int_aud_approvers() {
    this.internalAuditService.get_int_aud_approvers(this.orgID).subscribe({
      next: (result: any) => {


        this.approversList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
  get_unit_specific_int_aud_approvers() {
    this.internalAuditService.get_unit_specific_int_aud_approvers(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {


        this.approversList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }

  get_department() {
    this.generalService.get_departments().subscribe({
      next: (result: any) => {
        this.departments = result.data
      },
      error: (errL: any) => { },
      complete: () => {
        this.get_profiles()

      }
    })
  }
  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked === false);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
      },
      complete: () => {
        this.get_employees()
        // this.get_auditees()

      }
    });
  }
  get_process_types() {
    this.internalAuditService.get_process_types().subscribe({
      next: (result: any) => {
        this.process_types = result.data
      },
      error: (errL: any) => { },
      complete: () => { }
    })
  }
  get_auditees() {
    this.internalAuditService.get_auditees().subscribe({
      next: (result: any) => {
        this.auditees = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_employees() {
    this.generalService.get_employees().subscribe({
      next: (result: any) => {
        this.employees = result.data
      },
      error: (err: any) => { },
      complete: () => {

      }
    })

  }

  get_audit_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.internalAuditService.get_audit_details(reference).subscribe({
      next: (result: any) => {


        // const uniqueTeamMemberIDs = new Set<number>();
        if (result.data.length > 0) {
          // const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
          // let matchFound = true;
          // if (this.divisionUuids && this.divisionUuids.length > 0) {
          //   matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
          // }
          //   const teamMembers = result.data[0].attributes.audit_team_members?.data;
          //   if (teamMembers && Array.isArray(teamMembers)) {
          //     teamMembers.forEach(member => {
          //       // Parse user_id as a base 10 integer
          //       const userId = parseInt(member.attributes.user_id, 10);
          //       if (!isNaN(userId)) {
          //         uniqueTeamMemberIDs.add(userId);
          //       }
          //     });
          //   }
          //   this.teamMemberIDs = Array.from(uniqueTeamMemberIDs);
          //           const approverID = result.data[0].attributes.approver.data?.id;        
          //           let matchFound = true;
          //           if (this.userID !== approverID&&!this.teamMemberIDs.includes(this.userID)) {        
          // matchFound = false;
          // } else if (this.userID === approverID || this.teamMemberIDs.includes(this.userID)) {
          //             matchFound = true;
          //           }

          if ((result.data[0].attributes.status === 'Draft' || result.data[0].attributes.status === 'Change Requested')
            //  && (matchFound || matchFound !== false)
          ) {



            this.Form.controls['id'].setValue(result.data[0].id)
            this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
            this.Form.controls['division'].setValue(result.data[0].attributes.division)
            this.Form.controls['type'].setValue(result.data[0].attributes.type)
            this.Form.controls['department'].setValue(result.data[0].attributes.department)
            this.Form.controls['title'].setValue(result.data[0].attributes.title)
            this.Form.controls['factory_name'].setValue(result.data[0].attributes.factory_name)
            this.Form.controls['factory_address'].setValue(result.data[0].attributes.factory_address)
            this.Form.controls['contact_person'].setValue(result.data[0].attributes.factory_contact_person)
            this.Form.controls['designation'].setValue(result.data[0].attributes.designation)
            this.Form.controls['contact_email'].setValue(result.data[0].attributes.contact_email)
            this.Form.controls['contact_number'].setValue(result.data[0].attributes.contact_number)
            this.Form.controls['description'].setValue(result.data[0].attributes.description)
            this.Form.controls['status'].setValue(result.data[0].attributes.status)
            this.Form.controls['start'].setValue(result.data[0].attributes.start_date)
            this.Form.controls['end'].setValue(result.data[0].attributes.end_date)
            this.Form.controls['audit_scheduled_for_supplier'].setValue(result.data[0].attributes.audit_scheduled_for_supplier)
            if (result.data[0].attributes.audit_scheduled_for_supplier === true) {

              this.Form.controls['supplier_type'].setValidators([Validators.required]);
              this.Form.controls['supplier_type'].updateValueAndValidity();
              this.Form.controls['factory_license_no'].setValidators([Validators.required]);
              this.Form.controls['factory_license_no'].updateValueAndValidity();


            } else {
              this.Form.controls['supplier_type'].clearValidators();
              this.Form.controls['supplier_type'].updateValueAndValidity();
              this.Form.controls['factory_license_no'].clearValidators();
              this.Form.controls['factory_license_no'].updateValueAndValidity();
              this.Supplier_Type.reset()
              this.Form.controls['supplier_type'].reset()
              this.Form.controls['factory_license_no'].reset()
              this.Form.controls['higg_id'].reset()
              this.Form.controls['zdhc_id'].reset()
              this.Process_Type.reset()
              this.Form.controls['process_type'].reset()
            }
            this.Form.controls['supplier_type'].setValue(result.data[0].attributes.supplier_type)
            this.Form.controls['factory_license_no'].setValue(result.data[0].attributes.factory_license_no)
            this.Form.controls['higg_id'].setValue(result.data[0].attributes.higg_id)
            this.Form.controls['zdhc_id'].setValue(result.data[0].attributes.zdhc_id)
            this.Form.controls['process_type'].setValue(result.data[0].attributes.process_type)
            const auditeeData = result.data[0]?.attributes.auditees?.data;

            const auditeeIds = auditeeData.map((auditeeItem: any) => auditeeItem.id);
            const auditeeNames = auditeeData.map((auditeeItem: any) => auditeeItem.attributes.auditee_name);
            this.Form.controls['auditeeID'].setValue(auditeeIds);
            // this.Form.controls['auditee'].setValue(auditeeNames);
            // this.Form.controls['auditeeID'].setValue(result.data[0].attributes.auditee.data.id)
            // this.Form.controls['auditee'].setValue(result.data[0].attributes.auditee.data.attributes.employee_name)
            this.Form.controls['approver'].setValue(result.data[0].attributes.approver.data.id)
            this.Form.controls['approval_date'].setValue(result.data[0].attributes.approval_date)
            this.auditDateRange.controls['start'].setValue(new Date(result.data[0].attributes.start_date))
            this.auditDateRange.controls['end'].setValue(new Date(result.data[0].attributes.end_date))
            this.approvalDate.setValue(new Date(result.data[0].attributes.approval_date))
            this.factory.setValue(result.data[0].attributes.factory_name)
            this.factoryContactPerson.setValue(result.data[0].attributes.factory_contact_person)
            this.Division.setValue(result.data[0].attributes.division)
            this.auditType.setValue(result.data[0].attributes.type)
            this.Supplier_Type.setValue(result.data[0].attributes.supplier_type)
            this.Process_Type.setValue(result.data[0].attributes.process_type)
            this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
            if (result.data[0].attributes.title) {
              var array = result.data[0].attributes.title.includes(',') ?
                result.data[0].attributes.title.split(',') :
                [result.data[0].attributes.title];
              this.auditTitle.setValue(array);
            }
            const companyCodeOfConductSelected = array.includes("Company Code of Conduct");
            this.auditTitles.forEach(title => {
              if (title.attributes.Value !== "Company Code of Conduct") {
                title.disabled = companyCodeOfConductSelected;
              }


              this.factoryName = result.data[0].attributes.factory_name

              this.get_factories()


            });

            if (result.data[0].attributes.department) {
              var array = result.data[0].attributes.department.includes(',') ?
                result.data[0].attributes.department.split(',') :
                [result.data[0].attributes.department];
              this.auditDepartment.setValue(array);
            }
            if (result.data[0].attributes.auditees) {
              const auditeesData = result.data[0].attributes.auditees.data;
              this.initiallySelectedAuditees = this.auditees.filter(auditee => {
                return auditeesData.some((selectedAuditee: { id: any; }) => selectedAuditee.id === auditee.id);
              });
              this.auditee.setValue(this.initiallySelectedAuditees);
              this.cdr.detectChanges();
            }

            if (result.data[0].attributes.factory_contact_person) {
              var array = result.data[0].attributes.factory_contact_person.includes(',') ?
                result.data[0].attributes.factory_contact_person.split(',') :
                result.data[0].attributes.factory_contact_person;
              this.factoryContactPerson.setValue(array);

            }
          } else {
            this.router.navigate(["/apps/audit-inspection/internal-audit/register"])
          }
        } else {
          this.router.navigate(["/apps/audit-inspection/internal-audit/register"])
        }
      },
      error: (err: any) => { },
      complete: () => { }
    })

  }
  AuditDepartment(event: any) {
    this.Form.controls['department'].setValue(event.value.toString())
  }

  Supplier_audit(event: any) {
    this.Form.controls['supplier_type'].setValue(event.value)
  }

  ProcessType(event: any) {
    this.Form.controls['process_type'].setValue(event.value)
  }
  delete_process_type(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the process type.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.internalAuditService.delete_process_type(id).subscribe({
          next: (result: any) => {
            this.Form.controls.process_type.reset()
          },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Process type deleted"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_process_types()
          }
        })
      }
    })
  }
  new_department() {
    this.dialog.open(NewDepartmentComponent).afterClosed().subscribe((data: any) => {
      const name = data.name;
      this.generalService.create_department(name, this.Form.value.reporter).subscribe({
        next: (result: any) => {
          this.generalService.get_department().subscribe({
            next: (deptResult: any) => {
              this.departments = deptResult.data;



            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"]);
            },
            complete: () => {
              const departmentName = result.data.attributes.department_name;
              const currentValues = this.auditDepartment.value || [];
              const newValues = [...currentValues, departmentName];
              this.auditDepartment.setValue(newValues);
              this.Form.controls['department'].setValue(newValues.toString())
              const statusText = "Department created successfully";
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });

            }
          });
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => { }
      });
    });
  }
  modifyAuditee(event: Event, auditeeData: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ModifyAuditeeComponent, { data: auditeeData });
    const previousSelectedValues = this.auditee.value || [];
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        const updatedValues = previousSelectedValues.filter((item: { id: any; }) => {
          return item.id !== auditeeData.id;
        });
        this.internalAuditService.update_auditee(data).subscribe({
          next: (result: any) => {
            this.get_updated_auditees();
            const statusText = "Auditee details updated";
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            if (previousSelectedValues.some((item: { id: any; }) => item.id === data.id)) {
              const index = updatedValues.findIndex((item: { id: any; }) => item.id === data.id);
              if (index === -1) {
                updatedValues.push(data);
              }
              this.auditee.setValue(updatedValues);
            }
            const updatedAuditeeIds = this.Form.value.auditeeID.filter((id: any) => id !== auditeeData.id);
            updatedAuditeeIds.push(data.id);
            this.Form.controls['auditeeID'].setValue(updatedAuditeeIds);
            this.cdr.detectChanges();
          },
          error: (err: any) => {
          }
        });
      }
    });
  }



  get_updated_auditees() {
    this.internalAuditService.get_auditees().subscribe({
      next: (result: any) => {
        this.auditees = result.data;
        const selectedIds = this.auditee.value.map((auditee: any) => auditee.id);
        this.auditee.setValue(result.data.filter((auditee: any) => selectedIds.includes(auditee.id)));
        this.cdr.detectChanges();
      },
      error: (err: any) => { },
      complete: () => { }
    });
  }
  deleteAuditee(event: Event, auditee: any) {
    event.stopPropagation();
    const id = auditee.id;
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please note that by Clicking 'Yes, proceed!' ,this auditee will be permanently removed ",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.internalAuditService.delete_auditee(id).subscribe({
          next: (result: any) => {
            this.auditees = this.auditees.filter(item => item.id !== id);
            const index = this.auditee.value?.findIndex((item: { id: any }) => item.id === id);
            if (index !== -1) {
              const updatedValues = this.auditee.value?.filter((item: { id: any }) => item.id !== id);
              this.auditee.patchValue(updatedValues);
            }
            const updatedAuditeeIds = this.Form.value.auditeeID.filter((item: any) => item !== id);
            this.Form.controls['auditeeID'].setValue(updatedAuditeeIds);
            const statusText = "Auditee removed";
            this._snackBar.open(statusText, 'Success', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 3000
            });
          },
          error: (err: any) => { }
        });
      }
    });
  }

  // new_auditee() {
  //   this.dialog.open(NewAuditeeComponent).afterClosed().subscribe((data: any) => {
  //     this.generalService.get_employees().subscribe({
  //       next: (result: any) => {
  //         this.employees = result.data
  //       },
  //       error: (err: any) => { },
  //       complete: () => {

  //         this.Form.controls['auditee'].setValue(data.data.attributes.auditee_name)
  //         this.Form.controls['auditeeID'].setValue(data.data.id)

  //       }
  //     })
  //     // this.get_employees()


  //   })
  // }
  new_auditee() {
    let selectedIds: any[];

    if (this.Form.value.auditeeID) {
      selectedIds = this.Form.value.auditeeID;
    }

    this.dialog.open(NewAuditeeComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        this.internalAuditService.get_auditees().subscribe({
          next: (result: any) => {
            this.auditees = result.data;
            const previousSelectedIds = this.Form.value.auditeeID || [];

            const newAuditee = result.data[0];

            if (selectedIds) {
              selectedIds.push(newAuditee.id);
              this.Form.controls['auditeeID'].setValue(selectedIds);
            } else {
              this.Form.controls['auditeeID'].setValue([newAuditee.id]);
            }
            const selectedAuditees = this.auditees.filter((auditee: any) => {
              return selectedIds.includes(auditee.id);
            });
            this.auditee.setValue(selectedAuditees);

            const statusText = "New Auditee Created";
            this._snackBar.open(statusText, 'Success', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 3000
            });
          },
          error: (err: any) => { },
          complete: () => {
          }
        });
      }
    });
  }

  update_factory_name(id: any) {
    this.dialog.open(NewFactoryComponent, { data: id }).afterClosed().subscribe((data: any) => {


      if (data) {
        const found = this.factories.find(obj => obj.attributes.factory_name === data.factory_name)
        this.internalAuditService.update_factory_name(data).subscribe({
          next: (result: any) => {
            this.internalAuditService.get_factories().subscribe({
              next: (result: any) => {
                this.factories = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Factory name updated successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['factory_name'].setValue(data.factory_name)
                this.Form.controls['factory_address'].setValue(data.factory_address)
                this.Form.controls['contact_person'].setValue(data.contact_person)
                this.Form.controls['designation'].setValue(data.designation)
                this.Form.controls['contact_email'].setValue(data.contact_email)
                this.Form.controls['contact_number'].setValue(data.contact_number)
                this.factory.setValue(data.factory_name);
              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })

      }
    })
  }


  delete_factory_name(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the factory name.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.internalAuditService.delete_factory_name(id).subscribe({
          next: (result: any) => {
            this.Form.controls.factory_name.reset()
            this.Form.controls.factory_address.reset()
            this.Form.controls.contact_person.reset()
            this.Form.controls.designation.reset()
            this.Form.controls.contact_email.reset()
            this.Form.controls.contact_number.reset()
          },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Factory name deleted"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_factories()
          }
        })
      }
    })
  }

  auditeeVal(data: any) {
    this.Form.controls['auditeeID'].setValue(data)

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
  create_reference_number(data: any) {
    this.showProgressPopup();



    const selectedTitles = this.Form.value.title;
    const selectedTitlesString = Array.isArray(selectedTitles) ? selectedTitles.join(',') : selectedTitles;
    this.Form.controls['title'].setValue(selectedTitlesString);
    if (data === "Save") {
      this.Form.controls['factory_address'].enable()
      this.Form.controls['contact_person'].enable()
      this.Form.controls['designation'].enable()
      this.Form.controls['contact_email'].enable()
      this.Form.controls['contact_number'].enable()
      this.Form.controls['status'].setValue("Draft");

      this.submit()
    } else if (data === "Submit") {
      this.Form.controls['factory_address'].enable()
      this.Form.controls['contact_person'].enable()
      this.Form.controls['designation'].enable()
      this.Form.controls['contact_email'].enable()
      this.Form.controls['contact_number'].enable()
      this.Form.controls['status'].setValue("Scheduled");
      this.submit();
    }
  }
  Suppier_audit_scheduled(event: any) {

    if (event.currentTarget.checked === true) {

      this.Form.controls['supplier_type'].setValidators([Validators.required]);
      this.Form.controls['supplier_type'].updateValueAndValidity();
      this.Form.controls['factory_license_no'].setValidators([Validators.required]);
      this.Form.controls['factory_license_no'].updateValueAndValidity();


    } else {
      this.Form.controls['supplier_type'].clearValidators();
      this.Form.controls['supplier_type'].updateValueAndValidity();
      this.Form.controls['factory_license_no'].clearValidators();
      this.Form.controls['factory_license_no'].updateValueAndValidity();
      this.Supplier_Type.reset()
      this.Form.controls['supplier_type'].reset()
      this.Form.controls['factory_license_no'].reset()
      this.Form.controls['higg_id'].reset()
      this.Form.controls['zdhc_id'].reset()
      this.Process_Type.reset()
      this.Form.controls['process_type'].reset()
    }


  }

  submit() {
    const selectedAuditeeIDs = this.auditee.value.map((auditee: any) => auditee.id);
    this.Form.controls['auditeeID'].setValue(selectedAuditeeIDs);
    // this.showProgressPopup();    
    this.internalAuditService.update_internal_audit(this.Form.value).subscribe({
      next: (result: any) => {



        if (result.data.attributes.status === "Scheduled") {
          this.router.navigate(["/apps/audit-inspection/internal-audit/register"])
          const statusText = "Audit Scheduled Successfully"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });


        } else if (result.data.attributes.status === "Draft") {
          const statusText = "Audit Details Saved"
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

          this.ngOnInit()

        }

      },
      error: (err: any) => { },
      complete: () => {

        Swal.close()
      }
    })



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
