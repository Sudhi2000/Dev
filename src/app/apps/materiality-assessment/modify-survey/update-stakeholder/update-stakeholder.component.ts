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
  selector: 'app-update-stakeholder',
  templateUrl: './update-stakeholder.component.html',
  styleUrls: ['./update-stakeholder.component.scss']
})
export class UpdateStakeholderComponent implements OnInit {

  isEditMode: boolean = false;
  Form: FormGroup
  peopleList: any[] = [];
  dropdownValues: any[] = []
  categories: any[] = []
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
    public dialogRef: MatDialogRef<UpdateStakeholderComponent>,
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
      contact: [null, [Validators.required]],
      created_user:[null],
      id:[''],
    });
    this.me();
    if(this.data){
      this.isEditMode = true
    }else{
      this.isEditMode = false
    }
  }
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        console.log("Me result: ",result)
        const status = result.schedule_survey;
        if (status === false) {
          this.router.navigate(['/error/unauthorized']);
        } else {
          this.get_profiles();
          this.Form.controls['created_user'].setValue(result.id)
        }
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
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
    console.log("DATAS:: ",this.data)
    this.Form.controls['full_name'].setValue(this.data.data.attributes.full_name)
    this.Form.controls['role'].setValue(this.data.data.attributes.role)
    this.Form.controls['email_id'].setValue(this.data.data.attributes.email_id)
    this.Form.controls['category'].setValue(this.data.data.attributes.category)
    this.Form.controls['organisation'].setValue(this.data.data.attributes.organisation)
    this.Form.controls['external'].setValue(this.data.data.attributes.external)
    this.Form.controls['contact'].setValue(this.data.data.attributes.contact)
    this.Form.controls['id'].setValue(this.data.data.id)
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
