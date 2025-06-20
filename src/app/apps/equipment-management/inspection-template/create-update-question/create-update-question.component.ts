import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { question } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-create-update-question',
  templateUrl: './create-update-question.component.html',
  styleUrls: ['./create-update-question.component.scss']
})
export class CreateUpdateQuestionComponent implements OnInit {

 
  Form: FormGroup
  orgID: string
  client: any[] = []
  ClientList: any[] = []
  ProfileList: any[] = []
  dropdownValues: any
  mode: 'create' | 'update' = 'create';
  static id = 1;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
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
  
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateUpdateQuestionComponent>) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';


    } else {
      this.defaults = {} as question;

    }
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      question: ['', [Validators.required]],
      status: ['Active'],
    });

  }

  ///check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.equipment
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
        const status = result.insp_template_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.default_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
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
  

  default_details() {
    if (this.mode === 'update') {
      console.log(this.defaults)
      this.Form.controls['id'].setValue(this.defaults.id)
      this.Form.controls['question'].setValue(this.defaults.attributes.question)
    }
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
