import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import { GeneralService } from 'src/app/services/general.api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss']
})
export class AddTeamMemberComponent implements OnInit {

  Form: FormGroup
  teamMembers: any[] = []
  filteredMembers: any[] = []
  duplicateMember: boolean = false;

  environmentThemeList: any[] = []
  socialThemeList: any[] = []
  goverananceThemeList: any[] = []


  environmentRoleControl = new FormControl(null);
  environmentThemesControl = new FormControl(null);

  socialRoleControl = new FormControl(null);
  socialThemesControl = new FormControl(null);

  governanceRoleControl = new FormControl(null);
  governanceThemesControl = new FormControl(null);

  enableSubmit: boolean = false;
  roleList: any[] = []

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private router: Router,
    private formBuilder: FormBuilder,
    private esgService: EsgService,
    public dialogRef: MatDialogRef<AddTeamMemberComponent>
  ) { }

  ngOnInit(): void {

    this.Form = this.formBuilder.group({
      teamMember: ['', [Validators.required]],
      disclosure: [''],
      environmentRole: [''],
      socialRole: [''],
      governanceRole: [''],
      environmentThemes: [''],
      socialThemes: [''],
      governanceThemes: [''],
    })

    this.get_dropdown_values()
    this.environmentThemesControl.disable()
    this.socialThemesControl.disable()
    this.governanceThemesControl.disable()
    // Listen for teamMember changes and trigger checkDisclosureSelection()
    this.Form.controls['teamMember'].valueChanges.subscribe(() => {
      this.checkDisclosureSelection();
    });
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
      },
      error: (err: any) => {
        console.error("Error fetching data:", err);
      },
      complete: () => {
        this.filterTeamMembers()
      },
    })
  }

  //get team members
  get_team_members() {
    this.esgService.get_users().subscribe({
      next: (result: any) => {

        this.teamMembers = result.data;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  checkDuplication(selectedMember: any) {
    // Check if the selected member's id already exists in defaults

    this.duplicateMember = this.defaults.teamMembers.some(
      (member: any) => member.teamMember.id === selectedMember.id
    );


    if (this.duplicateMember) {
      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Team Member',
        text: 'This team member has already been added.',
        confirmButtonText: 'OK'
      });

      // Reset the selection to prevent submission
      this.Form.controls['teamMember'].setValue(null);
    }
  }

  // filtered team members based on divisions
  filterTeamMembers() {
    const selectedDivIDs = this.defaults.divisionsSelected.map((div: any) => div.division_uuid);

    this.filteredMembers = this.teamMembers.filter(member =>
      member.divisions.some((division: any) => selectedDivIDs.includes(division.division_uuid))
    );

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
      if (this.Form.controls['environmentRole'].value && this.Form.controls['environmentThemes'].value) {
        disclosures.push('Environment');
      }
      if (this.Form.controls['socialRole'].value && this.Form.controls['socialThemes'].value) {
        disclosures.push('Social');
      }
      if (this.Form.controls['governanceRole'].value && this.Form.controls['governanceThemes'].value) {
        disclosures.push('Governance');
      }
      this.Form.controls['disclosure'].setValue(disclosures.join(','), { emitEvent: false });
      this.dialogRef.close(this.Form.value);
    }

  }

}
