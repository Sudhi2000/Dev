import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { dispose } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';  
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
  selector: 'app-create-dispose',
  templateUrl: './create-dispose.component.html',
  styleUrls: ['./create-dispose.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})

export class CreateDisposeComponent implements OnInit {

  Form:FormGroup
  units: any[] = []
  orgID:string
  types: any[] = []
  UnitList:any[]=[]
  TypeList:any[]=[]
  dropdownValues: any
  disposal_date = new FormControl(null, [Validators.required]);
  mode: 'create' | 'update' = 'create';
  static id = 1;
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
    private generalService:GeneralService,
    private router: Router,
    private authService:AuthService,
    public dialogRef: MatDialogRef<CreateDisposeComponent>) { }

    
    ngOnInit(){
      if (this.defaults) {
        this.mode = 'update';
        
      } else {
        this.defaults = {} as dispose;
      }
      this.configuration()
      console.log(this.defaults)
      this.Form = this.formBuilder.group({
        id: [this.defaults.id || CreateDisposeComponent.id++],
        org_id: [this.defaults.org_id || '', [Validators.required]],
        authorized_contractor: [this.defaults.authorized_contractor || '', [Validators.required]],
        disposal_details: [this.defaults.disposal_details || '', [Validators.required]],
        disposed_quantity: [this.defaults.disposed_quantity || '', [Validators.required]],
        disposal_date: [this.defaults.disposal_date || '', [Validators.required]],
      });
      
    }
  
    ///check organisation has access
    configuration() {
      this.generalService.get_app_config().subscribe({
        next: (result: any) => {
          console.log(result)
          const status = result.data.attributes.modules.sustainability
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
          const status = result.chem_trans
          if (status === false) {
            this.router.navigate(["/error/unauthorized"])
          } else {
           
          }
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })
    }
    disposalDate(event: any) {
      const date = new Date(event.value)
      const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
      this.Form.controls['disposal_date'].setValue(newDate)
    }
    submit(){
      this.dialogRef.close(this.Form.value);

    }

}
