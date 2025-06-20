import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { CreateSurveyComponent } from '../create-survey.component';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.scss']
})
export class AddParticipantComponent implements OnInit {

  Form: FormGroup
  orgID: any
  dropDownValue: any[] = []
  languages: any[] = []
  Employees: any[] = []
  OriginalEmployees: any[] = []
  ExistingEmployees: any[] = []

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
  Employee = new FormControl(null, [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<CreateSurveyComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private generalService: GeneralService,
    private satisfactionService: SatisfactionService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
this.showProgressPopup()
    this.defaults

    this.ExistingEmployees = this.defaults.map((elem: any) => elem.Employee);
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      Employee: ['', [Validators.required]],
      //Email: ['', [Validators.required]],
      // permissions: ['', [Validators.required]],
      addparticipants: [false, [Validators.required]],
    });
  }
 showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Loading data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.satisfaction_survey
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
          this.dialogRef.close()
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
        this.dialogRef.close()

      },
      complete: () => { }
    })

  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.survey_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
          this.dialogRef.close()
        }
        // else {
        //   this.get_dropdown_values()
        // }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
        this.dialogRef.close()

      },
      complete: () => {
        this.getEmployee()
      }
    })
  }

  EmployeeChange(event: any) {

    // let concatenatedEmails = "";

    // event.value.forEach((employeeName: any) => {
    //   const employee = this.Employees.find((emp: any) => emp.attributes.employee_name === employeeName);
    //   if (employee) {
    //     concatenatedEmails += employee.attributes.email + ",";
    //   }
    // });

    this.Form.controls['Employee'].setValue(event.value.toString())
    // this.Form.controls['Email'].setValue(concatenatedEmails.toString())

  }


  // get_dropdown_values() {
  //   const module = "Satisfaction Survey"
  //   this.generalService.get_dropdown_values(module).subscribe({
  //     next: (result: any) => {
  //       this.dropDownValue = result.data
  //       const languages = result.data.filter(function (elem: any) {
  //         return (elem.attributes.Category === "Language")
  //       })
  //       this.languages = languages
  //     },
  //     error: (err: any) => { },
  //     complete: () => {
  //     }
  //   })
  // }

  getEmployee() {
    this.OriginalEmployees = []
    this.satisfactionService.get_users().subscribe({
      next: (result: any) => {
        
        this.OriginalEmployees = result.data
      },
      error: (err: any) => { },
      complete: () => {
        //this.Employees = this.OriginalEmployees.filter(employee => !this.ExistingEmployees.includes(employee.profile.first_name));
        this.Employees = this.OriginalEmployees.filter(employee => {
          const fullName = `${employee.attributes.first_name} ${employee.attributes.last_name}`;
          return !this.ExistingEmployees.includes(fullName);
        });
        Swal.close()
      }
    })
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }


}
