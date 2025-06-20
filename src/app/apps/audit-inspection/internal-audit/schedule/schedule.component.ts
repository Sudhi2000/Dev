import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.api.service';
import { MatDialog } from '@angular/material/dialog';
import { NewAuditeeComponent } from '../new-auditee/new-auditee.component';
import { IncidentService } from 'src/app/services/incident.api.service';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { NewDepartmentComponent } from 'src/app/apps/general-component/new-department/new-department.component';
import { NewFactoryComponent } from '../new-factory/new-factory.component';
import { NewFactoryContactPersonComponent } from '../new-factory-contact-person/new-factory-contact-person.component';
import { ModifyAuditeeComponent } from '../modify-auditee/modify-auditee.component';
import { NewProcessTypeComponent } from '../new-process-type/new-process-type.component';

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
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ScheduleComponent implements OnInit {

  orgID: string
  divisions: any[] = []
  departments: any[] = []
  contactPersons: any[] = []
  factories: any[] = []
  process_types: any[] = []
  peopleList: any[] = []
  approversList: any[] = []
  employees: any[] = []
  auditees: any[] = []
  selectedAuditees: any[] = []; // Array to store selected auditees
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  totalCatCount: number;
  auditTitle = new FormControl(null, [Validators.required]);
  auditType = new FormControl(null, [Validators.required]);
  auditDepartment = new FormControl(null);
  factoryContactPerson = new FormControl(null, [Validators.required]);
  factory = new FormControl(null, [Validators.required]);
  auditee = new FormControl(null, [Validators.required]);
  Division = new FormControl(null, [Validators.required]);
  Supplier_Type = new FormControl(null, [Validators.required]);
  Process_Type = new FormControl(null,);
  dropdownValues: any
  auditTitles: any[] = []
  auditTypes: any[] = []
  SupplierTypes: any[] = []
  selectedIds: any[] = [];
  Form: FormGroup
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
  unitSpecific: any
  userDivision: any
  approvalDate = new FormControl(null, [Validators.required]);
  auditDateRange = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required)
  });
  corporateUser: any
  audit_scheduled_for_supplier: boolean;
  constructor(private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    public dialog: MatDialog,
    public internalAuditService: InternalAuditService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      org_id: [''],
      reference_number: [''],
      date: [new Date, [Validators.required]],
      division: ['', [Validators.required]],
      department: [''],
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      factory_name: ['', [Validators.required]],
      factory_address: ['', [Validators.required]],
      factory_contact_person: ['', [Validators.required]],
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
      pending_audit: [''],
      completed_percentage: [null],
      pending_color_code: [''],
      business_unit: [null],
      audit_scheduled_for_supplier: [false],
      supplier_type: [''],
      factory_license_no: [''],
      higg_id: [''],
      zdhc_id: [''],
      process_type: ['']
    });
    // this.Form.controls['factory_address'].disable()
    // this.Form.controls['factory_contact_person'].disable()
    // this.Form.controls['designation'].disable()
    // this.Form.controls['contact_email'].disable()
    // this.Form.controls['contact_number'].disable()

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
        const status = result.int_aud_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_department()
          this.get_profiles()
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
              })
              let results = divisions.join('&');
              this.userDivision = results

              this.get_unit_specific_int_aud_approvers()

            }
          } else {
            this.get_divisions()
            this.get_int_aud_approvers()
          }
          this.get_employees()
          this.get_auditees()
          this.get_dropdown_values()
          this.get_factories()
          this.get_process_types()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
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
      this.Form.controls['title'].setValue(event.value.toString());
    }
    this.auditTitles.forEach(title => {
      if (title.attributes.Value !== "Company Code of Conduct") {
        title.disabled = companyCodeOfConductSelected;
      }
    });
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

  Supplier_audit(event: any) {
    this.Form.controls['supplier_type'].setValue(event.value)
  }

  ProcessType(event: any) {
    this.Form.controls['process_type'].setValue(event.value)
  }
  AuditDepartment(event: any) {
    this.Form.controls['department'].setValue(event.value.toString())
  }
  BusinessUnit(event: any) {
    this.Form.controls['division'].setValue(event.value.division_name)
    this.Form.controls['business_unit'].setValue(event.value.id)
  }
  FactoryContactPerson(event: any) {
    this.Form.controls['factory_contact_person'].setValue(event.value.toString())
  }
  AuditFactory(event: any) {

    this.Form.controls['factory_name'].setValue(event.value.toString())

  }

  onFactoryNameSelected(selectedValue: any) {
    const selectedOption = this.factories.find(name => name.attributes.factory_name === selectedValue);

    if (selectedOption) {

      this.Form.patchValue({
        factory_name: selectedOption.attributes.factory_name,
        factory_contact_person: selectedOption.attributes.factory_contact_person,
        designation: selectedOption.attributes.designation,
        contact_email: selectedOption.attributes.email,
        contact_number: selectedOption.attributes.contact_number,
        factory_address: selectedOption.attributes.factory_address,

      })
    }

  }
  // AuditAuditee(event: any) {
  //   console.log(event);

  //   // Map the selected objects to an array of IDs
  //   const selectedIds = event.value.map((employee: any) => employee.id);

  //   // Set the selected objects to the controller
  //   // this.Form.controls['auditee'].setValue(event.value.attributes.employee_name)

  //   this.Form.controls['auditeeID'].setValue(selectedIds);

  //   console.log(selectedIds); // You can use selectedIds as needed
  // }



  // get_division() {
  //   this.generalService.get_division(this.orgID).subscribe({
  //     next: (result: any) => {
  //       this.divisions = result.data
  //     },
  //     error: (errL: any) => { },
  //     complete: () => { }
  //   })
  // }
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
  get_department() {
    this.generalService.get_departments().subscribe({
      next: (result: any) => {
        this.departments = result.data
      },
      error: (errL: any) => { },
      complete: () => { }
    })
  }
  get_factories() {
    this.internalAuditService.get_factories().subscribe({
      next: (result: any) => {

        this.factories = result.data
      },
      error: (errL: any) => { },
      complete: () => { }
    })
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


  modifyAuditee(event: Event, auditeeData: any) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ModifyAuditeeComponent, { data: auditeeData });
    const previousSelectedValues = this.auditee.value || [];

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        const updatedValues = previousSelectedValues.filter((item: { id: any; }) => item.id !== auditeeData.id);
        this.internalAuditService.update_auditee(data).subscribe({
          next: (result: any) => {
            this.get_updated_auditees();

            const statusText = "Auditee details updated";
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });

            this.auditee.setValue([...updatedValues]);
            this.cdr.detectChanges();
          },
          error: (err: any) => {
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
                const statusText = "Factory details updated successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });

                this.Form.controls['factory_name'].setValue(data.factory_name)
                this.Form.controls['factory_address'].setValue(data.factory_address)
                this.Form.controls['factory_contact_person'].setValue(data.contact_person)
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
            this.Form.controls.factory_contact_person.reset()
            this.Form.controls.designation.reset()
            this.Form.controls.contact_email.reset()
            this.Form.controls.contact_number.reset()
          },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Factory details deleted"
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



  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked === false);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
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

  get_employees() {
    this.generalService.get_employees().subscribe({
      next: (result: any) => {
        this.employees = result.data
      },
      error: (err: any) => { },
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

  AuditType(event: any) {
    this.Form.controls['type'].setValue(event.value)
  }


  AuditAuditee(event: any) {
    const selectedIds = event.value.map((auditee: any) => auditee.id);
    this.Form.controls['auditeeID'].setValue(selectedIds);
  }
  // new_auditee() {
  //   this.dialog.open(NewAuditeeComponent).afterClosed().subscribe((data: any) => {
  //     this.generalService.get_employees().subscribe({
  //       next: (result: any) => {
  //         this.employees = result.data
  //       },
  //       error: (err: any) => { },
  //       complete: () => {

  //       }
  //     })
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
            const newAuditee = result.data[0];
            if (selectedIds) {
              selectedIds.push(newAuditee.id);
              this.Form.controls['auditeeID'].setValue(selectedIds);
              this.auditee.setValue(selectedIds.map(id => this.auditees.find(a => a.id === id)));
            } else {
              this.Form.controls['auditeeID'].setValue([newAuditee.id]);
              this.auditee.setValue([newAuditee]);
            }

          },
          error: (err: any) => { },
          complete: () => {

          }
        });
      }
    });
  }







  auditeeVal(data: any) {
    this.Form.controls['auditeeID'].setValue(data.id)
  }



  create_reference_number(data: any) {

    this.showProgressPopup();
    this.internalAuditService.get_internal_audits().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = 'AUD-' + newCount
        this.Form.controls['reference_number'].setValue(reference)
        if (data === "Save") {
          this.Form.controls['factory_address'].enable()
          this.Form.controls['factory_contact_person'].enable()
          this.Form.controls['designation'].enable()
          this.Form.controls['contact_email'].enable()
          this.Form.controls['contact_number'].enable()
          this.Form.controls['status'].setValue("Draft")
          this.saveAsDraft()
        } else if (data === "Submit") {
          this.Form.controls['factory_address'].enable()
          this.Form.controls['factory_contact_person'].enable()
          this.Form.controls['designation'].enable()
          this.Form.controls['contact_email'].enable()
          this.Form.controls['contact_number'].enable()
          this.Form.controls['status'].setValue("Scheduled")
          this.schedule()
        }
      },
      error: (err: any) => { },
      complete: () => { }
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

  saveAsDraft() {
    // this.showProgressPopup();
    this.internalAuditService.schedule_internal_audit(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Audit Details Saved"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
        this.router.navigate(["/apps/audit-inspection/internal-audit/modify/" + this.Form.value.reference_number])
      }
    })
  }

  schedule() {


    // this.showProgressPopup();
    this.internalAuditService.schedule_internal_audit(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.create_notification()


      }
    })
  }

  new_department() {
    this.dialog.open(NewDepartmentComponent).afterClosed().subscribe((data: any) => {
      const name = data.name;
      this.generalService.create_department(name, this.Form.value.reporter).subscribe({
        next: (result: any) => {
          this.generalService.get_department().subscribe({
            next: (result: any) => {
              this.departments = result.data;
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"]);
            },
            complete: () => {
              const departmentName = result.data.attributes.department_name;

              const currentValues = this.auditDepartment.value || [];

              const newValues = [...currentValues, departmentName];

              this.auditDepartment.setValue(newValues);

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

  new_factory() {
    this.dialog.open(NewFactoryComponent).afterClosed().subscribe((data: any) => {

      if (data) {

        this.Form.patchValue({
          factory_name: data.factory_name,
          factory_contact_person: data.contact_person,
          designation: data.designation,
          contact_email: data.contact_email,
          contact_number: data.contact_number,
          factory_address: data.factory_address,

        })
        this.internalAuditService.create_factory(data, this.Form.value.created_user).subscribe({
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


  create_notification() {

    let data: any[] = []
    data.push({
      module: "Internal Audit",
      action: 'Approval Required on Internal Audit:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.approver,
      access_link: "/apps/audit-inspection/internal-audit/action/",
      profile: this.Form.value.created_user
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        Swal.close()
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        const statusText = "Audit Scheduled"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
        this.router.navigate(["/apps/audit-inspection/internal-audit/register"])
      }
    })


  }
}
