import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { impact } from 'src/app/services/schemas';
import { SustainabilityService } from 'src/app/services/sustainability.api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modify-impact',
  templateUrl: './modify-impact.component.html',
  styleUrls: ['./modify-impact.component.scss']
})
export class ModifyImpactComponent implements OnInit {

  Form:FormGroup
  units: any[] = []
  orgID:string
  types: any[] = []
  UnitList:any[]=[]
  TypeList:any[]=[]
  dropdownValues: any
  mode: 'create' | 'update' = 'create';
  static id = 1;


  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService:GeneralService,
    private router: Router,
    private authService:AuthService,
    private sustainabilityService:SustainabilityService,
    private route:ActivatedRoute,
    public dialogRef: MatDialogRef<ModifyImpactComponent>) { }

    
    ngOnInit(){
      if (this.defaults) {
        this.mode = 'update';
        
      } else {
        this.defaults = {} as impact;
      }
      this.configuration()
      this.Form = this.formBuilder.group({
        id: [this.defaults.id ],
        //org_id: [this.defaults.org_id || '', [Validators.required]],
        impact_type: [this.defaults.attributes.type || '', [Validators.required]],
        impact_unit: [this.defaults.attributes.unit || '', [Validators.required]],
        impact_value: [this.defaults.attributes.value || '', [Validators.required]],
      });
      
    }
  
    ///check organisation has access
    configuration() {
      this.generalService.get_app_config().subscribe({
        next: (result: any) => {
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
                //this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
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
          const status = result.sus_create
          if (status === false) {
            this.router.navigate(["/error/unauthorized"])
          } else {
            this.get_dropdown_values()
          }
        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => { }
      })
    }
   
    //get dropdown values
    get_dropdown_values() {
      const module = "Sustainability"
      this.generalService.get_dropdown_values(module).subscribe({
        next: (result: any) => {
          this.dropdownValues = result.data
          this.get_units()
          this.get_types()
        },
        error: (err: any) => { },
        complete: () => { 
          
        }
      })
    }
    //get unit
    get_units() {
      this.units = []
      const unit = this.dropdownValues.filter(function (elem:any) {
        return (elem.attributes.Category === "Impact Unit")
      })
      this.UnitList = unit
    }
    //get unit
    get_types() {
      this.types = []
      const type = this.dropdownValues.filter(function (elem:any) {
        return (elem.attributes.Category === "Impact Type")
      })
      this.TypeList = type
    }
   
    submit(){
      this.dialogRef.close(this.Form.value);

    }

}
