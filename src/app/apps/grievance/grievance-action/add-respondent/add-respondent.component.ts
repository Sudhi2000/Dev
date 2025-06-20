import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NewDepartmentComponent } from 'src/app/apps/general-component/new-department/new-department.component';
import { NewDesignationComponent } from 'src/app/apps/general-component/new-designation/new-designation.component';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { GrievanceService } from 'src/app/services/grievance.api.service';
import { witness } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';

@Component({
  selector: 'app-add-respondent',
  templateUrl: './add-respondent.component.html',
  styleUrls: ['./add-respondent.component.scss']
})
export class AddRespondentComponent implements OnInit {

  Form: FormGroup
  designations: any[] = []
  departments: any[] = []
  employeeDetails: any
  editEmployee: boolean = false
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: string
  mode: 'create' | 'update' = 'create';
  static id = 1;
  statementFormData = new FormData()
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
  files: File[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private grievanceService: GrievanceService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddRespondentComponent>) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      grievId: [this.defaults.id],
      empid: [''],
      org_id: [''],
      reporter: [''],
      employee_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      statement: ['', [Validators.required]],
      grievant_statement: [''],
      statement_name: [''],
      format: [''],
      statement_id: [''],
      respondent: ['']
    });
  }
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.grievance
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
        const status = result.grev_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_designation()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_designation() {
    this.generalService.get_designation().subscribe({
      next: (result: any) => {
        this.designations = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { this.get_department() }
    })
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

  new_department() {

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
              this.get_department()
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
  new_designation() {

    this.dialog.open(NewDesignationComponent).afterClosed().subscribe((data: any) => {

      const name = data.name
      this.generalService.create_designation(name, this.Form.value.reporter).subscribe({
        next: (result: any) => {
          this.generalService.get_designation().subscribe({
            next: (result: any) => {
              this.departments = result.data
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
              this.get_designation()
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

  fetchEmployeeDetails() {
    const employeeId = this.Form.value.employee_id
    this.generalService.get_employees().subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((employee: any) => employee.attributes.employee_id === employeeId);
        this.employeeDetails = filteredData;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        if (this.employeeDetails.length > 0) {
          this.editEmployee = true
          this.Form.controls['empid'].setValue(this.employeeDetails[0].id)
          this.Form.controls['name'].setValue(this.employeeDetails[0].attributes.employee_name)
          this.Form.controls['department'].setValue(this.employeeDetails[0].attributes.department)
          this.Form.controls['designation'].setValue(this.employeeDetails[0].attributes.designation)

          this.Form.controls['name'].disable()
          this.Form.controls['designation'].disable()
          this.Form.controls['department'].disable()
        } else {
          this.editEmployee = false
          this.Form.controls['name'].enable()
          this.Form.controls['designation'].enable()
          this.Form.controls['department'].enable()
        }
      }
    });

  }
  editEmployeeDetails() {
    this.Form.controls['name'].enable()
    this.Form.controls['designation'].enable()
    this.Form.controls['department'].enable()
    this.dialog.open(EditEmployeeComponent, { data: this.Form.value }).afterClosed().subscribe(data => {
      this.get_department()
      this.get_designation()
      this.fetchEmployeeDetails()
    })
  }

  onSelect(event: any) {
    const fileLength = this.files.length;
    const addedLength = event.addedFiles.length;

    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / (1024 * 1024); // Convert bytes to megabytes
      if (size > 5) {
        const statusText = "Please choose a document below 5 MB";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        const fileTypes = ['pdf', 'docx', 'jpg', 'jpeg', 'png']; // Include image extensions
        const extension = event.addedFiles[0].name.split('.').pop().toLowerCase();
        const isSuccess = fileTypes.indexOf(extension) > -1;

        if (isSuccess) {
          this.files.push(...event.addedFiles);
          this.Form.controls['grievant_statement'].setErrors(null);
        } else {
          const statusText = "Please choose a document ('pdf', 'word', 'jpg', 'jpeg', 'png')";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else if (fileLength < 6) {
      const statusText = "You have exceeded the upload limit";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }


  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length === 0) {
      this.Form.controls['grievant_statement'].reset()
    }
  }
  submit() {
    this.Form.controls['name'].enable()
    this.Form.controls['designation'].enable()
    this.Form.controls['department'].enable()
    if (this.employeeDetails.length > 0) {
      this.grievanceService.create_respondent(this.Form.value).subscribe({
        next: (result: any) => {
          this.Form.controls['id'].setValue(result.data.id)
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          this.Upload_evidence()
        }
      })

    }
    else {
      this.grievanceService.create_respondent(this.Form.value).subscribe({
        next: (result: any) => {
          this.grievanceService.create_employee(this.Form.value).subscribe({
            next: (result: any) => {
              this.Form.controls['id'].setValue(result.data.id)
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
            }
          })
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          this.Upload_evidence()
        }
      })

    }
  }
  Upload_evidence() {
    const reference = this.defaults.case_id;
    if (this.files.length != 0) {
      this.files.forEach((elem: any) => {
        this.statementFormData.delete('files')
        const extension = elem.name.split('.').pop().toLowerCase()
        this.statementFormData.append('files', elem, reference + '.' + extension)
        this.generalService.upload(this.statementFormData).subscribe({
          next: (result: any) => {
            let data: any[] = []
            data.push({
              statement_name: result[0].hash,
              format: extension,
              respondent: this.Form.value.id,
              grievance: this.Form.value.grievId,
              statement_id: result[0].id
            })
            this.grievanceService.create_grievance_statement(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => { }
            })
          },
          error: (err: any) => { },
          complete: () => {
            this.dialogRef.close();
          }
        })
      })
    }
    else {
      this.dialogRef.close();
    }
  }
}
