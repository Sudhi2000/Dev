import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-view-team-member',
  templateUrl: './view-team-member.component.html',
  styleUrls: ['./view-team-member.component.scss']
})
export class ViewTeamMemberComponent implements OnInit {
  Form: FormGroup
  teamMembers: any[] = []

  environmentThemeList: any[] = []
  socialThemeList: any[] = []
  goverananceThemeList: any[] = []


  environmentRoleControl = new FormControl(null);
  socialRoleControl = new FormControl(null);
  governanceRoleControl = new FormControl(null);


  environmentThemesControl = new FormControl(null);
  socialThemesControl = new FormControl(null);
  governanceThemesControl = new FormControl(null);
  roleList: any[] = []
  previousvalues: any;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private generalService: GeneralService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private esgService: EsgService,
    public dialogRef: MatDialogRef<ViewTeamMemberComponent>
  ) { }

  ngOnInit(): void {

    this.Form = this.formBuilder.group({
      teamMember: [''],
      disclosure: [''],
      environmentRole: [''],
      socialRole: [''],
      governanceRole: [''],
      environmentThemes: [''],
      socialThemes: [''],
      governanceThemes: [''],
    })
    this.previousvalues = this.Form.value;
    this.get_dropdown_values()
    // this.get_team_members()
  }


  //get dropdown values
  get_dropdown_values() {
    this.esgService.get_dropdown_values().subscribe({
      next: (result: any) => {

        this.teamMembers = result[0].value
        this.roleList = result[6].value
        this.environmentThemeList = result[3].value
        this.socialThemeList = result[4].value
        this.goverananceThemeList = result[5].value
        this.getTeamMemberDetails()

        // this.disclosures = result[0].value //get all disclosures from dropdown values
        // this.themeList = result[1].value  //get all Themes from dropdown values
        // this.roleList = result[2].value  //get all roles from dropdown values
      },
      error: (err: any) => {
        console.error("Error fetching data:", err);

      },
    })
  }

  getTeamMemberDetails() {

    this.Form.controls['teamMember'].setValue(this.defaults?.teamMember.fullName);
    this.Form.controls['environmentRole'].setValue(this.defaults?.environmentRole);
    this.Form.controls['environmentThemes'].setValue(this.defaults?.environmentThemes)
    this.Form.controls['socialRole'].setValue(this.defaults?.socialRole)
    this.Form.controls['socialThemes'].setValue(this.defaults?.socialThemes)
    this.Form.controls['governanceRole'].setValue(this.defaults?.governanceRole)
    this.Form.controls['governanceThemes'].setValue(this.defaults?.governanceThemes)

    if (this.defaults?.environmentRole) {
      var array = this.defaults.environmentRole.split(',');
      this.environmentRoleControl.setValue(array);
      this.setEnvironmentRoles({ value: array })
    }


    if (this.defaults?.socialRole) {
      var array = this.defaults.socialRole.split(',');
      this.socialRoleControl.setValue(array);
      this.setSocialRoles({ value: array })
    }

    if (this.defaults?.governanceRole) {
      var array = this.defaults.governanceRole.split(',');
      this.governanceRoleControl.setValue(array);
      this.setGovernanceRoles({ value: array })
    }

    if (this.defaults?.environmentThemes) {
      var array = this.defaults.environmentThemes.split(',');
      this.environmentThemesControl.setValue(array);
      this.setEnvironmentThemes({ value: array })
    }

    if (this.defaults?.socialThemes) {
      var array = this.defaults.socialThemes.split(',');
      this.socialThemesControl.setValue(array);
      this.setSocialThemes({ value: array })
    }

    if (this.defaults?.governanceThemes) {
      var array = this.defaults.governanceThemes.split(',');
      this.governanceThemesControl.setValue(array);
      this.setGovernanceThemes({ value: array })
    }
    
  }

  setEnvironmentRoles(event: any) {
    this.Form.controls['environmentRole'].setValue(event.value.toString())
  }

  setSocialRoles(event: any) {
    this.Form.controls['socialRole'].setValue(event.value.toString())
  }

  setGovernanceRoles(event: any) {
    this.Form.controls['governanceRole'].setValue(event.value.toString())
  }

  // set themes

  setEnvironmentThemes(event: any) {
    this.Form.controls['environmentThemes'].setValue(event.value.toString())
  }

  setSocialThemes(event: any) {
    this.Form.controls['socialThemes'].setValue(event.value.toString())
  }

  setGovernanceThemes(event: any) {
    this.Form.controls['governanceThemes'].setValue(event.value.toString())
  }


  close() {
    this.dialogRef.close();
  }
}
