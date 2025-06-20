import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { MaterialityService } from 'src/app/services/materiality-assessment.api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-stakeholder',
  templateUrl: './add-stakeholder.component.html',
  styleUrls: ['./add-stakeholder.component.scss']
})
export class AddStakeholderComponent implements OnInit {

  Form: FormGroup
  peopleList: any[] = [];
  dropdownValues: any[] = []
  categories: any[] = []
  stakeholders: any[] = []
  defaultvalues: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private router: Router,
    private generalService: GeneralService,
    private _snackBar: MatSnackBar,
    private materialityService: MaterialityService,
    public dialogRef: MatDialogRef<AddStakeholderComponent>,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      full_name: ['', [Validators.required]],
      role: ['', [Validators.required]],
      email_id: ['', [Validators.required,Validators.email]],
      category: ['', [Validators.required]],
      organisation: ['', [Validators.required]],
      external: [null, [Validators.required]],
      contact: [null, [Validators.required]]
    });
    this.me();

  }
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.schedule_survey;
        if (status === false) {
          this.router.navigate(['/error/unauthorized']);
        } else {
          this.get_profiles();
          this.get_stakeholders()
        }
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  get_stakeholders() {
    this.materialityService.get_materiality_stakeholder().subscribe({
      next: (result: any) => {

        const seenEmails = new Set();

        this.stakeholders = result.data.filter((user: any) => {
          const email = user.attributes.email_id;
    
          if (seenEmails.has(email)) {
            return false;
          } else {
            seenEmails.add(email); // ✅ Add the email string, not the user object
            return true;
          }
        });
        
  
        const filteredStakeholders = result.data.filter((item: any) => {
          const email = item.attributes.email_id;
          if (seenEmails.has(email)) {
            return false;
          } else {
            seenEmails.add(email);
            return true;
          }
        });
  
      },
      error: (err: any) => {
        console.error("Error fetching stakeholders", err);
      },
      complete: () => {
      }
    });
  }

  set_stakeholder(data:any) {
    this.Form.controls['full_name'].setValue(data.attributes.full_name)
    this.Form.controls['role'].setValue(data.attributes.role)
    this.Form.controls['email_id'].setValue(data.attributes.email_id)
    this.Form.controls['category'].setValue(data.attributes.category)
    this.Form.controls['organisation'].setValue(data.attributes.organisation)
    this.Form.controls['external'].setValue(data.attributes.external)
    this.Form.controls['contact'].setValue(data.attributes.contact)
  }
  

  get_profiles() {
    this.authService.get_profiles(this.Form.value.org_id).subscribe({
      next: (result: any) => {
        this.get_dropdown_values()
        if (this.data) { this.get_default_values() }
        const filteredData = result.data.filter(
          (profile: any) =>
            profile.attributes.user?.data?.attributes?.blocked === false
        );
        this.peopleList = filteredData;

      },
      error: (err: any) => { },
      complete: () => {

      },
    });
  }
  get_default_values() {
    this.Form.controls['full_name'].setValue(this.data.data.full_name)
    this.Form.controls['role'].setValue(this.data.data.role)
    this.Form.controls['email_id'].setValue(this.data.data.email_id)
    this.Form.controls['category'].setValue(this.data.data.category)
    this.Form.controls['organisation'].setValue(this.data.data.organisation)
    this.Form.controls['external'].setValue(this.data.data.external)
    this.Form.controls['contact'].setValue(this.data.data.contact)
  }

  get_dropdown_values() {
    const module = "Materiality"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        const category = result.data.filter(function (elem: any) {
          return (elem.attributes.Module === module && elem.attributes.Category === "Category")
        })
        this.categories = category
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  is_external(data: any) {
    this.Form.controls['external'].setValue(data.attributes.filter)
  }

  submit() {
    this.add_stack_holder()
  }

  add_stack_holder() {
    this.dialogRef.close(this.Form.value);
  }
 

}
