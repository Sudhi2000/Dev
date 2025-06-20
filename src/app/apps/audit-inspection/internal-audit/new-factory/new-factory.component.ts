import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.api.service';
import { MatDialog } from '@angular/material/dialog';
import { NewFactoryContactPersonComponent } from '../new-factory-contact-person/new-factory-contact-person.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { log } from 'console';
import { MatSelect } from '@angular/material/select';
@Component({
  selector: 'app-new-factory',
  templateUrl: './new-factory.component.html',
  styleUrls: ['./new-factory.component.scss']
})
export class NewFactoryComponent implements OnInit {
  @ViewChild(MatSelect) select: MatSelect;

  mode: 'create' | 'update' = 'create';
  Form: FormGroup

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewFactoryComponent>,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public internalAuditService: InternalAuditService, private authService: AuthService, private router: Router, private generalService: GeneralService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }



  factoryContactPerson = new FormControl(null, [Validators.required]);

  approversList: any[] = []
  orgID: string
  departments: any[] = []
  peopleList: any[] = []
  unitSpecific: any
  userDivision: any
  corporateUser: any
  divisions: any[] = []
  employees: any[] = []
  auditees: any[] = []
  dropdownValues: any
  auditTitles: any[] = []
  factories: any[] = []
  contactPersons: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  ngOnInit(): void {


    this.configuration()

    this.Form = this.formBuilder.group({
      id: [null],
      org_id: [''],
      factory_name: ['', [Validators.required]],
      contact_number: [null, [Validators.required]],
      factory_address: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      contact_email: ['', [Validators.required]],
      contact_person: ['', [Validators.required]],
      created_user:['']
    });

    if (this.defaults) {
      this.mode = 'update';
      this.get_factory_name_by_id(this.defaults)
      this.Form.controls['id'].setValue(this.defaults)

    }

  }

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
              console.log(this.Form.value.org_id);

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
          // this.get_department()
          // this.get_profiles()
          // if (this.unitSpecific) {
          //   this.corporateUser = result.profile.corporate_user
          //   if (this.corporateUser) {
          //     this.get_divisions()
          //     this.get_int_aud_approvers()
          //   } else if (!this.corporateUser) {

          //     let divisions: any[] = []
          //     result.profile.divisions.forEach((elem: any) => {
          //       divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
          //       this.divisions.push(elem)  
          //     })
          //     let results = divisions.join('&');
          //     this.userDivision = results

          //     this.get_unit_specific_int_aud_approvers()

          //   }
          // } else {
          //   this.get_divisions()
          //   this.get_int_aud_approvers()
          // }
          // this.get_employees()
          // this.get_auditees()
          // this.get_dropdown_values()
          // this.get_factories()
          this.get_int_aud_approvers()
          this.get_contact_persons()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
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
  get_dropdown_values() {
    const module = "Internal Audit"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        const title = this.dropdownValues.filter(function (elem: any) {
          return (elem.attributes.Category === "Audit Title")
        })
        this.auditTitles = title
      },
      error: (err: any) => { },
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
  get_contact_persons() {
    this.internalAuditService.get_contact_persons().subscribe({
      next: (result: any) => {
        this.contactPersons = result.data
        // console.log( this.contactPersons);

      },
      error: (errL: any) => { },
      complete: () => { }
    })
  }
  FactoryContactPerson(event: any) {
    this.Form.controls['contact_person'].setValue(event.value.toString())
  }

  new_contact_person() {
    this.dialog.open(NewFactoryContactPersonComponent).afterClosed().subscribe((data: any) => {
      const name = data.name;

      this.internalAuditService.create_factory_contact_person(name, this.Form.value.created_user).subscribe({
        next: (result: any) => {
          this.internalAuditService.get_contact_persons().subscribe({
            next: (result: any) => {
              //console.log(result.data[0].attributes.person_name, "new person name");

              this.contactPersons = result.data;

              this.factoryContactPerson.setValue(result.data[0].attributes.person_name)
              this.Form.controls['contact_person'].setValue(result.data[0].attributes.person_name)
              this.get_contact_persons();
              this.select.close();

            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"]);
            },
            complete: () => {
              // const personname = result.data.attributes.person_name;

              // const currentValues = this.factoryContactPerson.value || [];

              // const newValues = [...currentValues, personname];

              // this.factoryContactPerson.setValue(newValues);

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


  submit() {
    this.dialogRef.close(this.Form.value);
  }

  get_factory_name_by_id(id: any) {

    this.internalAuditService.get_factories_by_id(id).subscribe({
      next: (result: any) => {
        //console.log(result.data.attributes, "this is factory detaisl");

        this.Form.controls['factory_name'].setValue(result.data.attributes.factory_name)
        this.Form.controls['contact_person'].setValue(result.data.attributes.factory_contact_person)
        this.Form.controls['designation'].setValue(result.data.attributes.designation)
        this.Form.controls['contact_email'].setValue(result.data.attributes.email)
        this.Form.controls['contact_number'].setValue(result.data.attributes.contact_number)
        this.Form.controls['factory_address'].setValue(result.data.attributes.factory_address)

        if (result.data.attributes.factory_contact_person) {
          this.factoryContactPerson.setValue(result.data.attributes.factory_contact_person)
        }
      },
      error: (err: any) => { },
      complete: () => { }

    })

  }
}
