import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  Form:FormGroup 
  orgID:any

  constructor(private formBuilder: FormBuilder,
  private generalService:GeneralService,
  public dialogRef: MatDialogRef<FeedbackComponent>,
  private router: Router,
  private authService: AuthService) { }
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

ngOnInit(): void {
  this.configuration()
  this.Form = this.formBuilder.group({
    rating:['', [Validators.required]],
    feedback:[''],
    //employee_feedback:['']
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

//check user has access
me() {
  this.authService.me().subscribe({
    next: (result: any) => {
      const status = result.grev_create
      if (status === false) {
        this.router.navigate(["/error/unauthorized"])
      } else {
        this.Form.controls['reporter'].setValue(result.profile.id)
      }
    },
    error: (err: any) => {
      this.router.navigate(["/error/internal"])
    },
    complete: () => { }
  })
}

submit(){
  // const rate= this.Form.value.rating
  // if(rate>=3)
  // {
  //   this.Form.controls['employee_feedback'].setValue('Satisfied')
  // }
  // else if(rate<3){
  //   this.Form.controls['employee_feedback'].setValue('Not Satisfied')
  // }
  this.dialogRef.close(this.Form.value);
}


}
