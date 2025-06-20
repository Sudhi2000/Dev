import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import { GeneralService } from 'src/app/services/general.api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-team-member',
  templateUrl: './modify-team-member.component.html',
  styleUrls: ['./modify-team-member.component.scss']
})
export class ModifyTeamMemberComponent implements OnInit {
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
  enableSubmit: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private generalService: GeneralService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private esgService: EsgService,
    public dialogRef: MatDialogRef<ModifyTeamMemberComponent>
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

    const disableIfEmpty = (control: FormControl) => {
      if (!control?.value || control.value.length === 0) {
        control.disable();
      } else {
        control.enable();
      }
    };
    
    disableIfEmpty(this.environmentThemesControl);
    disableIfEmpty(this.socialThemesControl);
    disableIfEmpty(this.governanceThemesControl);
    
  }

  // Updated methods for role and theme selection
  setEnvironmentRoles(event: any) {
    this.Form.controls['environmentRole'].setValue(event.value.toString());
    if (event.value.length > 0) {
      this.environmentThemesControl.enable();
      this.environmentThemesControl.setValidators([Validators.required]);
    } else {
      this.environmentThemesControl.disable();
      this.environmentThemesControl.clearValidators();
      this.environmentThemesControl.reset();
      this.Form.controls['environmentThemes'].reset();
    }
    this.environmentThemesControl.updateValueAndValidity();
    this.checkDisclosureSelection(); // Call to recheck button status
  }

  setSocialRoles(event: any) {
    this.Form.controls['socialRole'].setValue(event.value.toString());
    if (event.value.length > 0) {
      this.socialThemesControl.enable();
      this.socialThemesControl.setValidators([Validators.required]);
    } else {
      this.socialThemesControl.disable();
      this.socialThemesControl.clearValidators();
      this.socialThemesControl.reset();
      this.Form.controls['socialThemes'].reset();
    }
    this.socialThemesControl.updateValueAndValidity();
    this.checkDisclosureSelection(); // Call to recheck button status
  }

  setGovernanceRoles(event: any) {
    this.Form.controls['governanceRole'].setValue(event.value.toString());
    if (event.value.length > 0) {
      this.governanceThemesControl.enable();
      this.governanceThemesControl.setValidators([Validators.required]);
    } else {
      this.governanceThemesControl.disable();
      this.governanceThemesControl.clearValidators();
      this.governanceThemesControl.reset();
      this.Form.controls['governanceThemes'].reset();
    }
    this.governanceThemesControl.updateValueAndValidity();
    this.checkDisclosureSelection(); // Call to recheck button status
  }

  // Updated methods for theme selection
  setEnvironmentThemes(event: any) {
    this.Form.controls['environmentThemes'].setValue(event.value.toString());
    this.checkDisclosureSelection(); // Call to recheck button status
  }

  setSocialThemes(event: any) {
    this.Form.controls['socialThemes'].setValue(event.value.toString());
    this.checkDisclosureSelection(); // Call to recheck button status
  }

  setGovernanceThemes(event: any) {
    this.Form.controls['governanceThemes'].setValue(event.value.toString());
    this.checkDisclosureSelection(); // Call to recheck button status
  }


  checkDisclosureSelection(): boolean {
    // Check if a team member is selected
    const isTeamMemberSelected = !!this.Form.controls['teamMember'].value;

    // Check if any disclosure pairs (role and theme) exist
    const hasEnvironmentPair =
      !!this.Form.controls['environmentRole'].value && !!this.Form.controls['environmentThemes'].value;
    const hasSocialPair =
      !!this.Form.controls['socialRole'].value && !!this.Form.controls['socialThemes'].value;
    const hasGovernancePair =
      !!this.Form.controls['governanceRole'].value && !!this.Form.controls['governanceThemes'].value;

    // Check if any incomplete pair (role without theme or theme without role) exists
    const hasIncompletePair =
      (!!this.Form.controls['environmentRole'].value && !this.Form.controls['environmentThemes'].value) ||
      (!!this.Form.controls['socialRole'].value && !this.Form.controls['socialThemes'].value) ||
      (!!this.Form.controls['governanceRole'].value && !this.Form.controls['governanceThemes'].value);

    // Enable the submit button if:
    // - A team member is selected
    // - There is at least one valid disclosure pair
    // - No incomplete disclosure pair exists
    this.enableSubmit = isTeamMemberSelected && (hasEnvironmentPair || hasSocialPair || hasGovernancePair) && !hasIncompletePair;

    return this.enableSubmit;
  }


  close() {
    this.dialogRef.close();
  }

  submit() {
    if (!this.checkDisclosureSelection()) {
      Swal.fire({
        icon: 'warning',
        title: 'No Disclosure selected',
        text: 'Please select atleast one disclosure role & theme',
        confirmButtonText: 'OK'
      });
    }
    else {
      const disclosures: string[] = [];
      let copy = this.defaults

      if (this.Form.controls['environmentRole'].value) {
        disclosures.push('Environment');
      }
      if (this.Form.controls['socialRole'].value) {
        disclosures.push('Social');
      }
      if (this.Form.controls['governanceRole'].value) {
        disclosures.push('Governance');
      }
      this.Form.controls['disclosure'].setValue(disclosures.join(','), { emitEvent: false });

      copy.environmentRole = this.Form.value.environmentRole
      copy.environmentThemes = this.Form.value.environmentThemes
      copy.socialRole = this.Form.value.socialRole
      copy.socialThemes = this.Form.value.socialThemes
      copy.governanceRole = this.Form.value.governanceRole
      copy.governanceThemes = this.Form.value.governanceThemes
      copy.disclosure = this.Form.value.disclosure
      this.dialogRef.close(copy);
    }

  }
}
