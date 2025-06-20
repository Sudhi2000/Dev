import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';
import { AddDisclosureTeamMemberComponent } from './add-disclosure-team-member/add-disclosure-team-member.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
@Component({
  selector: 'app-disclosure',
  templateUrl: './disclosure.component.html',
  styleUrls: ['./disclosure.component.scss']
})
export class DisclosureComponent implements OnInit {
  generalForm: FormGroup;
  envDisclosureForm: FormGroup;
  socialDisclosureForm: FormGroup;
  govDisclosureForm: FormGroup;
  formData = new FormData()
  backToHistory: Boolean = false
  availableDisclosures: string[] = [];
  environmentTitles = [];
  socialTitles = [];
  govTitles = [];
  currentSOCTitles = [];
  currentENVTitles = [];
  currentGOVTitles = [];
  socDisclosureLOV = [];
  govDisclosureLOV = [];
  envDisclosureLOV = [];
  governanceTitles = [];
  notes = [];
  environmentNotes = [];
  socialNotes = [];
  governanceNotes = [];
  teamMembers: any[] = [];

  disclosureID: any
  userID: any
  createdUser: any
  createdUserID: any
  divisionsData: any[] = [];

  divisionNames: string = '';

  yearData: any;
  monthData: any;
  mode: any;
  socialRoles: string;
  environmentRoles: string;
  governanceRoles: string;
  status: string;
  refID: string;
  esgHead: boolean
  constructor(private formBuilder: FormBuilder,
    public esgService: EsgService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _location: Location
  ) { }

  ngOnInit() {
    const referenceId = this.route.snapshot.paramMap.get('id');
    const urlSegments = this.route.snapshot.url;

    // Extract 'modify' from the URL
    this.mode = urlSegments.length > 1 ? urlSegments[1].path : null;

    if (referenceId) {
      this.refID = referenceId
    }

    this.generalForm = this.formBuilder.group({
      theme: [''],
      ref_id: [referenceId || ''],
    });

    this.envDisclosureForm = this.formBuilder.group({});
    this.socialDisclosureForm = this.formBuilder.group({});
    this.govDisclosureForm = this.formBuilder.group({});
    this.showProgressPopup();
    this.checkRole()
  }

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Loading data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  checkRole() {
    const reference_id = this.generalForm.value.ref_id;
    this.esgService.get_Details(reference_id).subscribe({
      next: (result: any) => {

        if (result.code === 200) {
          const { register, teamMembers, esg_head, titles, currentUserdisclosures, socDisclosureDropDownValues, socialCurrentTitles, environmentCurrentTitles, govDisclosureDropDownValues, govCurrentTitles, envinmentDropDownValues, allNotes } = result.data;
          this.disclosureID = register.recordID
          this.monthData = register.monthData
          this.yearData = register.yearData; // Store year data
          this.esgHead = esg_head
          this.createdUser = register.createdUser
            ? `${register.createdUser.first_name} ${register.createdUser.last_name}`
            : 'Unknown User';
          this.createdUserID = register.createdUser.id

          this.divisionsData = Array.isArray(register.divisionData) ? register.divisionData : [];
          this.divisionNames = this.divisionsData.map((division: any) => division.division_name).join(', ');

          this.teamMembers = teamMembers && teamMembers.length > 0
            ? teamMembers.map((member: any) => member)
            : [];


          // titles
          const flattenedTitles = titles.flat();
          this.socDisclosureLOV = socDisclosureDropDownValues;
          this.govDisclosureLOV = govDisclosureDropDownValues;
          this.envDisclosureLOV = envinmentDropDownValues;
          this.currentSOCTitles = socialCurrentTitles;
          this.currentENVTitles = environmentCurrentTitles;
          this.currentGOVTitles = govCurrentTitles;


          // Filter titles by disclosure type
          this.environmentTitles = flattenedTitles.filter((title: any) => title.disclosure === 'Environment');
          this.socialTitles = flattenedTitles.filter((title: any) => title.disclosure === 'Social');
          this.governanceTitles = flattenedTitles.filter((title: any) => title.disclosure === 'Governance');

          // Separate notes based on the matching title_id with reference_id in the categories
          this.environmentNotes = allNotes.filter((note: any) => {
            return this.environmentTitles.some((title: any) => title.reference_id === note.title_id);
          });

          this.socialNotes = allNotes.filter((note: any) => {
            return this.socialTitles.some((title: any) => title.reference_id === note.title_id);
          });

          this.governanceNotes = allNotes.filter((note: any) => {
            return this.governanceTitles.some((title: any) => title.reference_id === note.title_id);
          });
          this.availableDisclosures = currentUserdisclosures[0]?.disclosures;
          this.userID = currentUserdisclosures[0].user_id;

          this.status = register.statusData;

          teamMembers.forEach((member: {
            userID: number;  // Assuming user_id exists in the member object
            socialRole: string;
            environmentRole: string;
            governanceRole: string;
            fullname: any;
          }) => {
            if (member.userID === this.userID) {  // Match with logged-in user's ID

              this.socialRoles = member.socialRole || '';
              this.environmentRoles = member.environmentRole || '';
              this.governanceRoles = member.governanceRole || '';
            }
          });
        }
      },
      error(err) {
        console.error('Error fetching details:', err);
      },
      complete: () => { Swal.close() },
    });
  }
  isTabVisible(tab: string): boolean {
    return this.availableDisclosures?.includes(tab);
  }
  get formattedTeamMembers(): string {
    return this.teamMembers.map(member => member.fullname || member.fullName).join(', ');
  }
  addTeamMember() {
    this.dialog.open(AddDisclosureTeamMemberComponent, { disableClose: true, width: "740px", data: this.teamMembers }).afterClosed().subscribe(data => {
      if (data) {
        this.formData = new FormData();
        this.formData.append('team_member_data', JSON.stringify(data))
        this.formData.append('disclosure_ID', JSON.stringify(this.disclosureID))

        this.esgService.esg_create_teamMembers(this.formData).subscribe({
          next: (result: any) => {

            if (result[0].code === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Team Member Added',
              });
            }

          },
          error: (error: any) => { },
          complete: () => {


          }
        })
        this.teamMembers.push(data.teamMember)

      }

    })
  }

  navigate() {
    this.backToHistory = true
    this._location.back();
  }

  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
