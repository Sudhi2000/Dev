import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { IncidentService } from 'src/app/services/incident.api.service';
import { witness } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-witness',
  templateUrl: './add-witness.component.html',
  styleUrls: ['./add-witness.component.scss']
})
export class ModifyIncidentWitnessComponent implements OnInit {
  Form: FormGroup
  divisions: any[] = []
  orgID: string
  mode: 'create' | 'update' = 'create';
  corporateUser:any
  unitSpecific:any
  userDivision:any
  peopleList:any
  Division = new FormControl(null, [Validators.required]);
  static id = 1;
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private router: Router,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ModifyIncidentWitnessComponent>,
    private incidentService: IncidentService) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as witness;
    }
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [this.defaults.id],
      org_id: [this.defaults?.attributes?.org_id || '', [Validators.required]],
      employee_id: [this.defaults?.attributes?.employee_id || '', [Validators.required]],
      name: [this.defaults?.attributes?.name || '', [Validators.required]],
      division: [this.defaults?.attributes?.division || '', [Validators.required]],
      department: [this.defaults?.attributes?.department || ''],
      business_unit:[null]
    });

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.accident_incident
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
        const status = result.acc_inc_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_divisions()
        }
        
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => { 
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
        }));
        
        this.divisions =newArray;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_profiles() {
    this.authService.get_hse_head_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked===false && profile.attributes.user?.data?.attributes?.acc_inc_action === true);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    });
  }

  get_unit_specific_assignee() {
    this.incidentService.get_unit_specific_assignee(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
  BusinessUnit(event: any) { 
    const selectedData = this.divisions.find(data => data.division_name === event.value);
    this.Form.controls['division'].setValue(selectedData.division_name) 
    this.Form.controls['business_unit'].setValue(selectedData.id)   
  }
  submit() {
    if (this.defaults.attributes) {
      this.incidentService.update_witness(this.Form.value).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          this.dialogRef.close(this.Form.value);
        }
      })
    } else {
      this.dialogRef.close(this.Form.value);
    }
  }
}
