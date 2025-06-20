import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EsgService } from 'src/app/services/esg.service';
import { AddDirectorDetailsComponent } from './governance-disclosure-title-details/add-director-details/add-director-details.component';
import Swal from 'sweetalert2';
import { title } from 'process';
import { AddEmpDetailsComponent } from './governance-disclosure-title-details/add-emp-details/add-emp-details.component';
import { AddBPDetailsComponent } from './governance-disclosure-title-details/add-bp-details/add-bp-details.component';
import { GeneralService } from 'src/app/services/general.api.service';
import { AddConflictsInterestComponent } from './governance-disclosure-title-details/add-conflicts-interest/add-conflicts-interest.component';
import { AddLawRegulationComponent } from './governance-disclosure-title-details/add-law-regulation/add-law-regulation.component';
import { AddComplaintsComponent } from './governance-disclosure-title-details/add-complaints/add-complaints.component';
import { AddCorporateComponent } from './governance-disclosure-title-details/add-corporate/add-corporate.component';

@Component({
  selector: 'app-governance-disclosure',
  templateUrl: './governance-disclosure.component.html',
  styleUrls: ['./governance-disclosure.component.scss']
})
export class GovernanceDisclosureComponent implements OnInit {
  govDisclosureForm: FormGroup;
  @Input() disclosureMode: string;
  @Input() lov: any[] = [];
  @Input() notes: any[] = [];
  @Input() currentGOVTitles: any[] = [];
  @Input() data: any[] = [];
  @Input() roles: string;
  @Input() status: string;
  @Input() refID: string;
  @Input() esgHead: boolean;
  @Input() year: string;
  @Input() month: string;

  // tenureTypeControl = new FormControl(null);
  directorDetails: any[] = []
  filteredDirectorDetails: any[] = [];

  DirectorTenureDetails: any;
  ACGovBody: any;
  AntiCompetitive: any;
  AntiCorruption: any;
  IncidentCorruption: any;
  DiscipCorruption: any;
  awareNGRBC: any;
  vcNGRBC: any;

  employeeDetails: any[] = []
  conflictsInterests: any[] = []
  lawRegulations: any[] = []
  complaints: any[] = []
  corporate: any[] = []
  filteredEmployeeDetails: any[] = [];
  businessPartnerDetails: any[] = []
  filteredBusinessPartnerDetails: any[] = [];
  filteredConflictsInterests: any[] = [];
  filteredLawRegulations: any[] = [];
  filteredComplaints: any[] = [];
  filteredCorporate: any[] = [];
  currencyCompany: any[] = [];
  groupedData: any;

  directorTenure_status: string
  gov_body_ac_status: string
  anti_competitive_status: string
  anti_corruption_status: string
  incidents_of_corruption_status: string
  disciplinary_action_status: string
  awareness_programs_status: string
  value_chain_partners_status: string
  tenureTypeList: any[] = [];
  currentTitle: any;

  // govBodyValues: any[] = [];
  // ageGroupValues: any[] = [];
  // tenureTypeValues: any[] = [];
  // empLevelValues: any[] = [];
  // empFuncValues: any[] = [];
  // businessPartnerType: any[] = [];
  // conflictsOfInterest: any[] = [];
  // ngrbcPrinciples: any[] = [];
  // stakeHolderGroup: any[] = [];
  // corporatePartnership: any[] = [];

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

  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private esgService: EsgService,
    private generalService: GeneralService,
  ) { }

  ngOnInit(): void {

    // this.setCurrency()


    this.govDisclosureForm = this.formBuilder.group({
      ref_id: [''],
      title_ref_id: [''],
      status: [''],
      esg_governance_disclosure: [''],
      year: [this.year],
      month: [this.month],
      // Board of Directors 
      directorDetailsNotes: [''],
      // Director Tenure
      tenureType: [''],
      directorTenureNotes: [''],
      // director_tenure_title_status: [''],
      // anti corrupt - gov body training
      governanceMembersInformed: [null],
      governanceMembersTrained: [null],
      manHoursTraining: [null],
      // gov_body_ac_title_status: [''],
      govBodyTrainingNotes: [''],
      // Anti corruption training for employees

      empTrainingNotes: [''],

      // Anti corruption training for business partners
      businessPartnerNotes: [''],

      // Anti-competitive behaviour, anti-trust and monopoly practices
      legal_actions_count: [null],
      completed_actions_outcome: [''],
      fines_settlements_amt: [null],
      anti_competitive_currency: [this.lov[8]?.value || ''],
      // anti_competitive_title_status: [''],
      antiCompetitiveNotes: [''],

      // Anti corruption
      operations_AC: [null],
      corruption_risk_operations: [null],
      // anti_corruption_title_status: [''],
      antiCorruptNotes: [''],

      // Incident corruption

      confirmed_corruption_incidents: [null],
      corruption_incidents_board_action: [null],
      corruption_incidents_kmp_action: [null],
      corruption_incidents_employee_action: [null],
      corruption_incidents_worker_action: [null],
      business_partner_contracts_corrup_violations: [null],
      public_legal_cases_org_emp: [null],
      public_legal_cases_outcome: [null],
      // incidents_of_corruption_title_status: [''],
      incidentsCorruptNotes: [''],

      // Conflicts of Interest

      conflictsNotes: [''],

      // Disciplinary action against corruption

      board_of_director: [null],
      employees: [null],
      workers: [null],
      // disciplinary_action_title_status: [''],
      disciplinaryNotes: [''],

      // Awareness program on NGRBC principles

      bod_training_awareness_count: [null],
      bod_covered_training_awareness_count: [null],
      kmp_training_awareness_count: [null],
      kmp_covered_training_awareness_count: [null],
      employee_training_awareness_count: [null],
      employee_covered_training_awareness_count: [null],
      worker_training_awareness_count: [null],
      worker_covered_training_awareness_count: [null],
      // awareness_programs_title_status: [''],
      ngrbcNotes: [''],

      // Awareness program for value chain partnerson NGRBC principles

      value_chain_partners_count: [null],
      awareness_programs_count: [null],
      value_chain_partners_covered_awareness: [null],
      // value_chain_partners_title_status: [''],
      valueChainNgrbcNotes: [''],

      // compliance with law and regulation

      lawRegulationNotes: [''],

      // Grievances/Complaints
      grievanceNotes: [''],
      // Corporate partnership overview
      corporateNotes: [''],
    });




    this.data.forEach(title => {
      const matchingNotes = this.notes.find(note => note.title_id === title.reference_id);
      if (title.title === 'Board of Directors' && matchingNotes) {
        this.govDisclosureForm.get('directorDetailsNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Director Tenure' && matchingNotes) {
        this.govDisclosureForm.get('directorTenureNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Anti corruption training for governance body' && matchingNotes) {
        this.govDisclosureForm.get('govBodyTrainingNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Anti corruption training for employees' && matchingNotes) {
        this.govDisclosureForm.get('empTrainingNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Anti corruption training for business partners' && matchingNotes) {
        this.govDisclosureForm.get('businessPartnerNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Anti-competitive behaviour, anti-trust and monopoly practices' && matchingNotes) {
        this.govDisclosureForm.get('antiCompetitiveNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Anti corruption' && matchingNotes) {
        this.govDisclosureForm.get('antiCorruptNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Incidents of corruption' && matchingNotes) {
        this.govDisclosureForm.get('incidentsCorruptNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Conflicts of Interest' && matchingNotes) {
        this.govDisclosureForm.get('conflictsNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Disciplinary action against corruption' && matchingNotes) {
        this.govDisclosureForm.get('disciplinaryNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Awareness program on NGRBC principles' && matchingNotes) {
        this.govDisclosureForm.get('ngrbcNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Awareness program for value chain partners on NGRBC principles' && matchingNotes) {
        this.govDisclosureForm.get('valueChainNgrbcNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Compliance with laws and regulations' && matchingNotes) {
        this.govDisclosureForm.get('lawRegulationNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Grievances/Complaints' && matchingNotes) {
        this.govDisclosureForm.get('grievanceNotes')?.setValue(matchingNotes.note)
      }
      if (title.title === 'Corporate partnership overview' && matchingNotes) {
        this.govDisclosureForm.get('corporateNotes')?.setValue(matchingNotes.note)
      }
      //   const titleStatus = this.getStatusForTitle(title.title);
      //   if (titleStatus) {
      //     title.status = titleStatus;
      //   }
    });

    this.data.forEach(theme => {

      const themeStatus = this.getStatusForTheme(theme.theme);
      if (themeStatus) {
        theme.status = themeStatus;
      }

    })

    // this.groupedData = this.groupByTheme(this.data).map(themeGroup => {
    //   const themeStatus = this.getStatusForTheme(themeGroup.theme);

    //   if (themeStatus) {
    //     themeGroup.status = themeStatus; // Correctly setting status here
    //   }
    //   return themeGroup; // Return the modified object
    // });

    const titleOrder = ['Board of Directors', 'Director Tenure', 'Anti corruption training for governance body',
      'Anti corruption training for employees', 'Anti corruption training for business partners', 'Anti-competitive behaviour, anti-trust and monopoly practices',
      'Anti corruption', 'Incidents of corruption', 'Conflicts of Interest', 'Disciplinary action against corrruption', 'Awareness program on NGRBC principles',
      'Awareness program for value chain partners on NGRBC principles', 'Compliance with laws and regulations', 'Grievances/Complaints', 'Corporate partnership overview'
    ]
    const themeOrder = ['Board and Committee', 'Business Ethics', 'Responsible business conduct', 'Other governance indicators']
    const getThemeIndex = (theme: string) => {
      const index = themeOrder.indexOf(theme);
      return index !== -1 ? index : themeOrder.length;
    };
    const getTitleIndex = (title: string) => {
      const index = titleOrder.indexOf(title);
      return index !== -1 ? index : titleOrder.length;
    };

    this.groupedData = this.groupByTheme(this.data)
      .map(themeGroup => {
        const titleStatus = this.getStatusForTheme(themeGroup.theme);

        if (titleStatus) {
          themeGroup.status = titleStatus;
        }

        themeGroup.titles.sort((a: any, b: any) => getTitleIndex(a.title) - getTitleIndex(b.title));

        return themeGroup;
      })
      .sort((a, b) => getThemeIndex(a.theme) - getThemeIndex(b.theme));



    this.filteredDirectorDetails = this.filterData('board_of_directors');
    this.filteredEmployeeDetails = this.filterData('ac_emp_trainings');
    this.filteredBusinessPartnerDetails = this.filterData('ac_businesses_training');
    this.filteredConflictsInterests = this.filterData('conflicts_of_interests');
    this.filteredLawRegulations = this.filterData('compliance_law_regulations');
    this.filteredComplaints = this.filterData('grievance_complaints');
    this.filteredCorporate = this.filterData('corp_partnerships');
    this.DirectorTenureDetails = this.currentGOVTitles[0].director_tenure;
    this.ACGovBody = this.currentGOVTitles[0].ac_gov_body;
    this.AntiCompetitive = this.currentGOVTitles[0].anti_competitive;
    this.AntiCorruption = this.currentGOVTitles[0].anti_corrup;
    this.IncidentCorruption = this.currentGOVTitles[0].inc_corruption;
    this.DiscipCorruption = this.currentGOVTitles[0].disp_action;
    this.awareNGRBC = this.currentGOVTitles[0].ngrbc_awareness;
    this.vcNGRBC = this.currentGOVTitles[0].vc_ngrbc;

      // Set tenureType if available, otherwise null
      // #Title: Director Tenure
      if (this.DirectorTenureDetails) {
        this.govDisclosureForm.controls['tenureType'].setValue(this.DirectorTenureDetails.tenure_type)
      }

      // #Title: Anti corruption training for governance body
      if (this.ACGovBody) {
        this.govDisclosureForm.controls['governanceMembersInformed'].setValue(this.ACGovBody.gov_body_members_communicated)
        this.govDisclosureForm.controls['governanceMembersTrained'].setValue(this.ACGovBody.trained_gov_body_members)
        this.govDisclosureForm.controls['manHoursTraining'].setValue(this.ACGovBody.training_man_hours)
      }

      // #Title: Anti-competitive behaviour, anti-trust and monopoly practices
      if (this.AntiCompetitive) {
        this.govDisclosureForm.controls['legal_actions_count'].setValue(this.AntiCompetitive.legal_actions_count)
        this.govDisclosureForm.controls['fines_settlements_amt'].setValue(this.AntiCompetitive.fines_settlements_amt)
        this.govDisclosureForm.controls['completed_actions_outcome'].setValue(this.AntiCompetitive.completed_actions_outcome)
        this.govDisclosureForm.controls['anti_competitive_currency'].setValue(this.AntiCompetitive.anti_competitive_currency)

      }
      // #Title: Anti corruption
      if (this.AntiCorruption) {
        this.govDisclosureForm.controls['operations_AC'].setValue(this.AntiCorruption.operations_AC)
        this.govDisclosureForm.controls['corruption_risk_operations'].setValue(this.AntiCorruption.corruption_risk_operations)
      }
      // #Title: Incident corruption
      if (this.IncidentCorruption) {
        this.govDisclosureForm.controls['confirmed_corruption_incidents'].setValue(this.IncidentCorruption.confirmed_corruption_incidents)
        this.govDisclosureForm.controls['corruption_incidents_board_action'].setValue(this.IncidentCorruption.corruption_incidents_board_action)
        this.govDisclosureForm.controls['corruption_incidents_kmp_action'].setValue(this.IncidentCorruption.corruption_incidents_kmp_action)
        this.govDisclosureForm.controls['corruption_incidents_employee_action'].setValue(this.IncidentCorruption.corruption_incidents_employee_action)
        this.govDisclosureForm.controls['corruption_incidents_worker_action'].setValue(this.IncidentCorruption.corruption_incidents_worker_action)
        this.govDisclosureForm.controls['business_partner_contracts_corrup_violations'].setValue(this.IncidentCorruption.business_partner_contracts_corrup_violations)
        this.govDisclosureForm.controls['public_legal_cases_org_emp'].setValue(this.IncidentCorruption.public_legal_cases_org_emp)
        this.govDisclosureForm.controls['public_legal_cases_outcome'].setValue(this.IncidentCorruption.public_legal_cases_outcome)
      }

      // #Title: Disciplinary action against corruption
      if (this.DiscipCorruption) {
        this.govDisclosureForm.controls['board_of_director'].setValue(this.DiscipCorruption.board_of_director)
        this.govDisclosureForm.controls['employees'].setValue(this.DiscipCorruption.employees)
        this.govDisclosureForm.controls['workers'].setValue(this.DiscipCorruption.workers)
      }

      // #Title: Awareness program on NGRBC principles

      if (this.awareNGRBC) {

        this.govDisclosureForm.controls['bod_training_awareness_count'].setValue(this.awareNGRBC.bod_training_awareness_count)
        this.govDisclosureForm.controls['bod_covered_training_awareness_count'].setValue(this.awareNGRBC.bod_covered_training_awareness_count)
        this.govDisclosureForm.controls['kmp_training_awareness_count'].setValue(this.awareNGRBC.kmp_training_awareness_count)
        this.govDisclosureForm.controls['kmp_covered_training_awareness_count'].setValue(this.awareNGRBC.kmp_covered_training_awareness_count)
        this.govDisclosureForm.controls['employee_training_awareness_count'].setValue(this.awareNGRBC.employee_training_awareness_count)
        this.govDisclosureForm.controls['employee_covered_training_awareness_count'].setValue(this.awareNGRBC.employee_covered_training_awareness_count)
        this.govDisclosureForm.controls['worker_training_awareness_count'].setValue(this.awareNGRBC.worker_training_awareness_count)
        this.govDisclosureForm.controls['worker_covered_training_awareness_count'].setValue(this.awareNGRBC.worker_covered_training_awareness_count)

      }

      //Awareness program for value chain partnerson NGRBC principles

      if (this.vcNGRBC) {
        this.govDisclosureForm.controls['value_chain_partners_count'].setValue(this.vcNGRBC.value_chain_partners_count)
        this.govDisclosureForm.controls['awareness_programs_count'].setValue(this.vcNGRBC.awareness_programs_count)
        this.govDisclosureForm.controls['value_chain_partners_covered_awareness'].setValue(this.vcNGRBC.value_chain_partners_covered_awareness)
      }
    


  }


  // group titles under respective themes

  groupByTheme(data: any[]): any[] {
    const grouped = data.reduce((acc, item) => {
      let group = acc.find((g: { theme: any; }) => g.theme === item.theme);
      if (!group) {
        group = { theme: item.theme, titles: [] };
        acc.push(group);
      }
      group.titles.push(item);
      return acc;
    }, []);
    return grouped;
  }

  hasDataForTitle(title: any) {
    switch (title) {
      case 'Board of Directors':
        return this.filteredDirectorDetails.length > 0;
      case 'Director Tenure':
        return this.DirectorTenureDetails;
      case 'Anti corruption training for governance body':
        return this.ACGovBody;
      case 'Anti corruption training for employees':
        return this.filteredEmployeeDetails.length > 0;
      case 'Anti corruption training for business partners':
        return this.filteredBusinessPartnerDetails.length > 0;
      case 'Anti-competitive behaviour, anti-trust and monopoly practices':
        return this.AntiCompetitive;
      case 'Anti corruption':
        return this.AntiCorruption;
      case 'Incidents of corruption':
        return this.IncidentCorruption;
      case 'Conflicts of Interest':
        return this.filteredConflictsInterests.length > 0;
      case 'Disciplinary action against corruption':
        return this.DiscipCorruption;
      case 'Awareness program on NGRBC principles':
        return this.awareNGRBC;
      case 'Awareness program for value chain partners on NGRBC principles':
        return this.vcNGRBC;
      case 'Compliance with laws and regulations':
        return this.filteredLawRegulations.length > 0;
      case 'Grievances/Complaints':
        return this.filteredComplaints.length > 0;
      case 'Corporate partnership overview':
        return this.filteredCorporate.length > 0;

      default:
        return false;
    }
  }


  getStatusForTheme(theme: string): string | undefined {
    switch (theme) {
      case 'Board and Committee':
        return this.currentGOVTitles[0].board_committee_status;
      case 'Business Ethics':
        return this.currentGOVTitles[0].business_ethics_status;
      case 'Responsible business conduct':
        return this.currentGOVTitles[0].responsible_business_conduct_status;
      case 'Other governance indicators':
        return this.currentGOVTitles[0].other_governance_indicators_status;
      default:
        return undefined;
    }
  }
  // // get currency from configuration
  // setCurrency() {
  //   this.generalService.get_app_config().subscribe({
  //     next: (result: any) => {
  //       this.govDisclosureForm.controls['currency'].setValue(result.data.attributes.currency)
  //       this.currencyCompany.push(result.data.attributes.currency)

  //       // this.govDisclosureForm.get('currency')?.setValue()
  //     }
  //   })
  // }



  filterData(titleKey: string): any[] {

    let result: any[] = [];
    this.currentGOVTitles.forEach(item => {
      if (item[titleKey]) {
        result = [...result, ...item[titleKey]];
      }
    });
    return result;
  }

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Updating...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  handleNumericInput(event: KeyboardEvent): void {
    // Prevents 'e', 'E', '+', and '-' keys from being entered
    const restrictedKeys = ["e", "E", "+", "-"];
    if (restrictedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  //  Title :Board of Directors 
  addDirectorsDetails(data: any) {

    this.dialog.open(AddDirectorDetailsComponent, { width: "740px", data: { lov: this.lov, addData: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {

        this.directorDetails.push(data)
      }
    })
  }

  ModifyDirectorDetails(data: any, title_ref_id: any, index?: number) {

    this.dialog.open(AddDirectorDetailsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        addData: data,
        title_ref_id: title_ref_id,

        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {

        if (updatedData.id) {

          // If id exists, update using the id
          const index = this.filteredDirectorDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredDirectorDetails[index] = updatedData;
          }
        } else if (index !== undefined) {

          // If no id, update using the passed index
          this.directorDetails[index] = updatedData;
        }
      }
    });
  }

  viewDirectorDetails(data: any) {
    this.dialog.open(AddDirectorDetailsComponent, {
      width: "740px", data: {
        lov: this.lov,
        addData: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  deleteDirectorDetails(data: any, index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        if (data.id) {
          this.showProgressPopup()
          this.esgService.deleteGovDisTitleDirectorDetails(data.id).subscribe({
            next: (result: any) => {
              this.filteredDirectorDetails = this.filteredDirectorDetails.filter(item => item.id !== data.id);
            },
            error: () => {
              console.error('Error deleting director details');
            },
            complete: () => {
              Swal.close()
            }
          });
        } else {
          this.directorDetails.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Director details deleted successfully!',
            timer: 1000, // Auto-close after 2 seconds
            showConfirmButton: false
          });
        }
      }
    })
  }

  // save board directors
  submitDirectorDetails(status: any, title: any) {
    this.showProgressPopup()

    const titleRefID = title.reference_id

    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('director_details', JSON.stringify(this.directorDetails))

    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(titleRefID)

    formData.append('form_value', JSON.stringify(this.govDisclosureForm.value))
    this.esgService.createGovDisTitleDirectorDetails(formData).subscribe({
      next: (result: any) => {

        this.filteredDirectorDetails = []
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredDirectorDetails.push(...result[0].data)
        }
      },
      error: (err: any) => {
        console.error(err);
        // Swal.close()

      },
      complete: () => {
        Swal.close()

        title.status = status;

        this.directorDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Directors Details saved',
        });
      }
    })


  }
  //  Title: Director Tenure 

  // setTenureType(event: any) {
  //   this.govDisclosureForm.controls['tenureType'].setValue(event.value.toString())
  // }

  // save director tenure
  submitDirectorTenure(status: any, title: any) {
    this.showProgressPopup()
    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);
    this.govDisclosureForm.controls['status'].setValue(status)
    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    // if (this.govDisclosureForm.value.tenureType) {
    //   this.govDisclosureForm.controls['director_tenure_title_status'].setValue('Open')

    // }

    this.esgService.createGovDisTitleDirectorTenure(this.govDisclosureForm.value).subscribe({
      next: (result: any) => {
        this.DirectorTenureDetails = result[0].data
        // this.directorTenure_status = result[0].director_tenure_title_status
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        Swal.fire({
          icon: 'success',
          title: 'Directors tenure details saved',
        });
      }
    })
  }



  // Update Theme Board and Committee Status
  updateBoardandCommitteeStatus(status: any, theme: any) {
    const formData = new FormData();
    formData.append('board_committee_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGGovDisStatus(formData).subscribe({
      next: (result: any) => {
        // this.tenureTypeControl.disable()

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        theme.status = status;
        Swal.fire({
          icon: 'success',
          title: status === 'Submitted for Review' ? 'Board and Committee theme Submitted for Review' :
            status === 'Open' ? 'Board and Committee theme Re-Opened' :
              status === 'Submitted for Approval' ? 'Board and Committee theme Submitted for Approval' :
                status === 'Review Failed' ? 'Board and Committee theme Review Failed' :
                  status === 'Approved' ? 'Board and Committee theme Approved' :
                    status === 'Rejected' ? 'Board and Committee theme Rejected' : ''
        });

      }
    });
  }
  // Title: Anti corruption training for governance body

  submitGovBodyAntiCorruptTraining(status: any, title: any) {
    this.showProgressPopup()
    // if (this.govDisclosureForm.value.governanceMembersInformed || this.govDisclosureForm.value.governanceMembersTrained ||
    //   this.govDisclosureForm.value.manHoursTraining
    // ) {
    //   this.govDisclosureForm.controls['gov_body_ac_title_status'].setValue('Open')

    // }
    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    this.esgService.creategovBodyAntiCorrupt(this.govDisclosureForm.value).subscribe({
      next: (result: any) => {
        this.ACGovBody = result[0].data
        // this.gov_body_ac_status = result[0].gov_body_ac_title_status
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        Swal.fire({
          icon: 'success',
          title: 'Anti corruption training for governance body saved',
        });
      }
    })
  }

  // updateGovBodyAntiCorruptTrainingStatus(status: any, title: any) {

  //   const formData = new FormData();
  //   formData.append('ac_gov_body_status', status);
  //   formData.append('ref_id', this.refID);
  //   this.esgService.updateESGGovDisStatus(formData).subscribe({
  //     next: (result: any) => {

  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //     },
  //     complete: () => {
  //       title.status = status;
  //       Swal.fire({
  //         icon: 'success',
  //         title:
  //           status === 'Submitted for Approval' ? 'Anti corruption training for governance body Submitted for Approval' :
  //             status === 'Review Failed' ? 'Anti corruption training for governance body Review Failed' :
  //               status === 'Approved' ? 'Anti corruption training for governance body Approved' :
  //                 status === 'Rejected' ? 'Anti corruption training for governance body Rejected' : ''
  //       });

  //     }
  //   });
  // }

  // Title: Anti corruption training for employees

  addEmployeeDetails(data: any) {

    this.dialog.open(AddEmpDetailsComponent, { width: "740px", data: { lov: this.lov, addData: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {


        this.employeeDetails.push(data)
      }
    })
  }

  ModifyEmployeeDetails(data: any, title_ref_id: any, index?: number) {

    this.dialog.open(AddEmpDetailsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        addData: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {

        if (updatedData.id) {

          // If id exists, update using the id
          const index = this.filteredEmployeeDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredEmployeeDetails[index] = updatedData;
          }
        } else if (index !== undefined) {

          // If no id, update using the passed index
          this.employeeDetails[index] = updatedData;
        }
      }
    });
  }

  viewEmployeeDetails(data: any) {
    this.dialog.open(AddEmpDetailsComponent, {
      width: "740px", data: {
        lov: this.lov,
        addData: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  deleteEmployeeDetails(data: any, index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        if (data.id) {
          this.showProgressPopup()
          this.esgService.deleteGovEmployeeDetails(data.id).subscribe({
            next: (result: any) => {
              this.filteredEmployeeDetails = this.filteredEmployeeDetails.filter(item => item.id !== data.id);
            },
            error: () => {
              console.error('Error deleting Employee details');
            },
            complete: () => {
              Swal.close()
            }
          });
        } else {
          this.employeeDetails.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Employee details deleted successfully!',
            timer: 1000, // Auto-close after 2 seconds
            showConfirmButton: false
          });
        }
      }
    })
  }

  // updateEmployeeDetailsStatus(status: any, title: any) {

  //   const formData = new FormData();
  //   formData.append('employee_details_status', status);
  //   formData.append('ref_id', this.refID);
  //   this.esgService.updateESGGovDisStatus(formData).subscribe({
  //     next: (result: any) => {

  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //     },
  //     complete: () => {
  //       title.status = status;
  //       Swal.fire({
  //         icon: 'success',
  //         title:
  //           status === 'Submitted for Approval' ? 'Board of directors details Submitted for Approval' :
  //             status === 'Review Failed' ? 'Board of directors details Review Failed' :
  //               status === 'Approved' ? 'Board of directors details Approved' :
  //                 status === 'Rejected' ? 'Board of directors details Rejected' : ''
  //       });

  //     }
  //   });
  // }

  submitEmployeeDetails(status: any, title: any) {
    this.showProgressPopup()

    const titleRefID = title.reference_id

    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('employee_details', JSON.stringify(this.employeeDetails))

    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(titleRefID)

    formData.append('form_value', JSON.stringify(this.govDisclosureForm.value))
    this.esgService.createGovEmployeeDetails(formData).subscribe({
      next: (result: any) => {

        this.filteredEmployeeDetails = []
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredEmployeeDetails.push(...result[0].data)
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        this.employeeDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Employee Details saved',
        });
      }
    })


  }

  // Anti Corruption Training for Business Partners
  addBusinessPartnerDetails(data: any) {

    this.dialog.open(AddBPDetailsComponent, { width: "740px", data: { lov: this.lov, addData: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {


        this.businessPartnerDetails.push(data)
      }
    })
  }

  ModifyBusinessPartnerDetails(data: any, title_ref_id: any, index?: number) {

    this.dialog.open(AddBPDetailsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        addData: data,
        title_ref_id: title_ref_id,

        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {

        if (updatedData.id) {

          // If id exists, update using the id
          const index = this.filteredBusinessPartnerDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredBusinessPartnerDetails[index] = updatedData;
          }
        } else if (index !== undefined) {

          // If no id, update using the passed index
          this.businessPartnerDetails[index] = updatedData;
        }
      }
    });
  }

  viewBusinessPartnerDetails(data: any) {
    this.dialog.open(AddBPDetailsComponent, {
      width: "740px", data: {
        lov: this.lov,
        addData: data,
        mode: 'view',
        refID: this.refID
      }
    }).afterClosed().subscribe(data => {

    })
  }

  deleteBusinessPartnerDetails(data: any, index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        if (data.id) {
          this.showProgressPopup()
          this.esgService.deleteGovBusinessPartnerDetails(data.id).subscribe({
            next: (result: any) => {
              this.filteredBusinessPartnerDetails = this.filteredBusinessPartnerDetails.filter(item => item.id !== data.id);
            },
            error: () => {
              console.error('Error deleting Business Partner details');
            },
            complete: () => {
              Swal.close()
            }
          });
        } else {
          this.businessPartnerDetails.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Business Partner details deleted successfully!',
            timer: 1000, // Auto-close after 2 seconds
            showConfirmButton: false
          });
        }
      }
    })
  }

  // updateBusinessPartnerDetailsStatus(status: any, title: any) {

  //   const formData = new FormData();
  //   formData.append('ac_business_partner_status', status);
  //   formData.append('ref_id', this.refID);
  //   this.esgService.updateESGGovDisStatus(formData).subscribe({
  //     next: (result: any) => {

  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //     },
  //     complete: () => {
  //       title.status = status;
  //       Swal.fire({
  //         icon: 'success',
  //         title:
  //           status === 'Submitted for Approval' ? 'Business partner details Submitted for Approval' :
  //             status === 'Review Failed' ? 'Business partner details Review Failed' :
  //               status === 'Approved' ? 'Business partner details Approved' :
  //                 status === 'Rejected' ? 'Business partner details Rejected' : ''
  //       });

  //     }
  //   });
  // }

  submitBusinessPartnerDetails(status: any, title: any) {
    this.showProgressPopup()

    const titleRefID = title.reference_id

    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('business_partner_details', JSON.stringify(this.businessPartnerDetails))

    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(titleRefID)

    formData.append('form_value', JSON.stringify(this.govDisclosureForm.value))
    this.esgService.createGovBusinessPartnerDetails(formData).subscribe({
      next: (result: any) => {

        this.filteredBusinessPartnerDetails = []
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredBusinessPartnerDetails.push(...result[0].data)
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        this.businessPartnerDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Business Partner details saved',
        });
      }
    })


  }

  // Title: Anti-competitive behaviour, anti-trust and monopoly practices


  submitAntiCompetitive(status: any, title: any) {
    this.showProgressPopup()
    // if (this.govDisclosureForm.value.legal_actions_count || this.govDisclosureForm.value.fines_settlements_amt ||
    //   this.govDisclosureForm.value.completed_actions_outcome
    // ) {
    //   this.govDisclosureForm.controls['anti_competitive_title_status'].setValue('Open')

    // }
    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    this.esgService.createGovAntiCompetitive(this.govDisclosureForm.value).subscribe({
      next: (result: any) => {
        this.AntiCompetitive = result[0].data
        // this.anti_competitive_status = result[0].anti_competitive_title_status
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        Swal.fire({
          icon: 'success',
          title: 'Anti-competitive Details saved',
        });
      }
    })
  }

  // updateAntiCompetitiveStatus(status: any, title: any) {

  //   const formData = new FormData();
  //   formData.append('anti_competitive_status', status);
  //   formData.append('ref_id', this.refID);
  //   this.esgService.updateESGGovDisStatus(formData).subscribe({
  //     next: (result: any) => {

  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //     },
  //     complete: () => {
  //       title.status = status;
  //       Swal.fire({
  //         icon: 'success',
  //         title:
  //           status === 'Submitted for Approval' ? 'Anti-competitive details Submitted for Approval' :
  //             status === 'Review Failed' ? 'Anti-competitive details Review Failed' :
  //               status === 'Approved' ? 'Anti-competitive details Approved' :
  //                 status === 'Rejected' ? 'Anti-competitive details Rejected' : ''
  //       });

  //     }
  //   });
  // }

  // Title: Anti corruption


  submitAntiCorrupt(status: any, title: any) {
    this.showProgressPopup()
    // if (this.govDisclosureForm.value.operations_AC || this.govDisclosureForm.value.corruption_risk_operations) {
    //   this.govDisclosureForm.controls['anti_corruption_title_status'].setValue('Open')

    // }
    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    this.esgService.createGovAntiCorrupt(this.govDisclosureForm.value).subscribe({
      next: (result: any) => {
        this.AntiCorruption = result[0].data
        // this.anti_corruption_status = result[0].anti_corruption_title_status
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        Swal.fire({
          icon: 'success',
          title: 'Anti corruption Details saved',
        });
      }
    })
  }

  // updateAntiCorruptStatus(status: any, title: any) {

  //   const formData = new FormData();
  //   formData.append('anti_corruption_status', status);
  //   formData.append('ref_id', this.refID);
  //   this.esgService.updateESGGovDisStatus(formData).subscribe({
  //     next: (result: any) => {

  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //     },
  //     complete: () => {
  //       title.status = status;
  //       Swal.fire({
  //         icon: 'success',
  //         title:
  //           status === 'Submitted for Approval' ? 'Anti corruption details Submitted for Approval' :
  //             status === 'Review Failed' ? 'Anti corruption details Review Failed' :
  //               status === 'Approved' ? 'Anti corruption details Approved' :
  //                 status === 'Rejected' ? 'Anti corruption details Rejected' : ''
  //       });

  //     }
  //   });
  // }



  //Title: Incident corruption


  submitIncidentCorrupt(status: any, title: any) {
    this.showProgressPopup()
    // if (this.govDisclosureForm.value.confirmed_corruption_incidents ||
    //   this.govDisclosureForm.value.corruption_incidents_board_action ||
    //   this.govDisclosureForm.value.corruption_incidents_kmp_action ||
    //   this.govDisclosureForm.value.corruption_incidents_employee_action ||
    //   this.govDisclosureForm.value.corruption_incidents_worker_action ||
    //   this.govDisclosureForm.value.business_partner_contracts_corrup_violations ||
    //   this.govDisclosureForm.value.public_legal_cases_org_emp ||
    //   this.govDisclosureForm.value.public_legal_cases_outcome
    // ) {
    //   this.govDisclosureForm.controls['incidents_of_corruption_title_status'].setValue('Open')

    // }
    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    this.esgService.createGovIncidentsCorrupt(this.govDisclosureForm.value).subscribe({
      next: (result: any) => {
        this.IncidentCorruption = result[0].data
        // this.incidents_of_corruption_status = result[0].incidents_of_corruption_title_status
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        Swal.fire({
          icon: 'success',
          title: 'Incident corruption Details saved',
        });
      }
    })
  }

  // updateIncidentCorruptStatus(status: any, title: any) {

  //   const formData = new FormData();
  //   formData.append('incidents_of_corruption_status', status);
  //   formData.append('ref_id', this.refID);
  //   this.esgService.updateESGGovDisStatus(formData).subscribe({
  //     next: (result: any) => {

  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //     },
  //     complete: () => {
  //       title.status = status;
  //       Swal.fire({
  //         icon: 'success',
  //         title:
  //           status === 'Submitted for Approval' ? 'Incident corruption details Submitted for Approval' :
  //             status === 'Review Failed' ? 'Incident corruption details Review Failed' :
  //               status === 'Approved' ? 'Incident corruption details Approved' :
  //                 status === 'Rejected' ? 'Incident corruption details Rejected' : ''
  //       });

  //     }
  //   });
  // }

  // Title: Conflicts of Interest

  addConflictsInterests(data: any) {

    this.dialog.open(AddConflictsInterestComponent, { width: "740px", data: { lov: this.lov, addData: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {


        this.conflictsInterests.push(data)
      }
    })
  }

  ModifyConflictsInterests(data: any, title_ref_id: any, index?: number) {

    this.dialog.open(AddConflictsInterestComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        addData: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {

        if (updatedData.id) {

          // If id exists, update using the id
          const index = this.filteredConflictsInterests.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredConflictsInterests[index] = updatedData;
          }
        } else if (index !== undefined) {

          // If no id, update using the passed index
          this.conflictsInterests[index] = updatedData;
        }
      }
    });
  }

  viewConflictsInterests(data: any) {
    this.dialog.open(AddConflictsInterestComponent, {
      width: "740px", data: {
        lov: this.lov,
        addData: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  deleteConflictsInterests(data: any, index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {

        if (data.id) {
          this.showProgressPopup()
          this.esgService.deleteGovConflictsInterest(data.id).subscribe({
            next: (result: any) => {
              this.filteredConflictsInterests = this.filteredConflictsInterests.filter(item => item.id !== data.id);
            },
            error: () => {
              console.error('Error deleting conflicts details');
            },
            complete: () => {
              Swal.close()
            }
          });
        } else {
          this.conflictsInterests.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Conflicts details deleted successfully!',
            timer: 1000, // Auto-close after 2 seconds
            showConfirmButton: false
          });
        }
      }
    })
  }

  // updateConflictsInterestsStatus(status: any, title: any) {

  //   const formData = new FormData();
  //   formData.append('conflicts_of_interest_status', status);
  //   formData.append('ref_id', this.refID);
  //   this.esgService.updateESGGovDisStatus(formData).subscribe({
  //     next: (result: any) => {

  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //     },
  //     complete: () => {
  //       title.status = status;
  //       Swal.fire({
  //         icon: 'success',
  //         title:
  //           status === 'Submitted for Approval' ? 'Conflicts of Interest Submitted for Approval' :
  //             status === 'Review Failed' ? 'Conflicts of Interest Review Failed' :
  //               status === 'Approved' ? 'Conflicts of Interest Approved' :
  //                 status === 'Rejected' ? 'Conflicts of Interest Rejected' : ''
  //       });

  //     }
  //   });
  // }

  submitConflictsInterests(status: any, title: any) {
    this.showProgressPopup()

    const titleRefID = title.reference_id

    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('conflicts_details', JSON.stringify(this.conflictsInterests))

    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(titleRefID)

    formData.append('form_value', JSON.stringify(this.govDisclosureForm.value))

    this.esgService.createGovConflictsInterest(formData).subscribe({
      next: (result: any) => {

        this.filteredConflictsInterests = []
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredConflictsInterests.push(...result[0].data)
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        this.conflictsInterests = []
        Swal.fire({
          icon: 'success',
          title: 'Conflicts of Interest saved',
        });
      }
    })


  }


  // Disciplinary action against corruption
  submitDisciplinaryAction(status: any, title: any) {
    this.showProgressPopup()
    // if (this.govDisclosureForm.value.board_of_director || this.govDisclosureForm.value.employees || this.govDisclosureForm.value.workers) {
    //   this.govDisclosureForm.controls['disciplinary_action_title_status'].setValue('Open')

    // }
    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    this.esgService.creategovDisciplinaryAction(this.govDisclosureForm.value).subscribe({
      next: (result: any) => {
        this.DiscipCorruption = result[0].data
        // this.disciplinary_action_status = result[0].disciplinary_action_title_status

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        Swal.fire({
          icon: 'success',
          title: 'Disciplinary action against corruption saved',
        });
      }
    })
  }

  // Update Theme Business Ethics status


  updateBusinessEthicsStatus(status: any, theme: any) {

    const formData = new FormData();
    formData.append('business_ethics_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGGovDisStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        theme.status = status;
        Swal.fire({
          icon: 'success',
          title: status === 'Submitted for Review' ? 'Business Ethics theme Submitted for Review' :
            status === 'Open' ? 'Business Ethics theme Re-opened' :
              status === 'Submitted for Approval' ? 'Business Ethics theme Submitted for Approval' :

                status === 'Review Failed' ? 'Business Ethics theme Review Failed' :
                  status === 'Approved' ? 'Business Ethics theme Approved' :
                    status === 'Rejected' ? 'Business Ethics theme Rejected' : ''
        });

      }
    });
  }


  // Awareness program on NGRBC principles

  submitNGRBC(status: any, title: any) {
    this.showProgressPopup()
    // if (this.govDisclosureForm.value.bod_training_awareness_count ||
    //   this.govDisclosureForm.value.bod_covered_training_awareness_count ||
    //   this.govDisclosureForm.value.kmp_training_awareness_count ||
    //   this.govDisclosureForm.value.kmp_covered_training_awareness_count ||
    //   this.govDisclosureForm.value.employee_training_awareness_count ||
    //   this.govDisclosureForm.value.employee_covered_training_awareness_count ||
    //   this.govDisclosureForm.value.worker_training_awareness_count ||
    //   this.govDisclosureForm.value.worker_covered_training_awareness_count
    // ) {
    //   this.govDisclosureForm.controls['awareness_programs_title_status'].setValue('Open')

    // }
    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    this.esgService.creategovNGRBCPrinciples(this.govDisclosureForm.value).subscribe({
      next: (result: any) => {
        this.awareNGRBC = result[0].data
        // this.awareness_programs_status = result[0].awareness_programs_title_status

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        Swal.fire({
          icon: 'success',
          title: 'Awareness program on NGRBC principles saved',
        });
      }
    })
  }

  // updateNGRBCStatus(status: any, title: any) {

  //   const formData = new FormData();
  //   formData.append('NGRBC_principle_status', status);
  //   formData.append('ref_id', this.refID);
  //   this.esgService.updateESGGovDisStatus(formData).subscribe({
  //     next: (result: any) => {

  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //     },
  //     complete: () => {
  //       title.status = status;
  //       Swal.fire({
  //         icon: 'success',
  //         title:
  //           status === 'Submitted for Approval' ? 'Awareness program on NGRBC principles Submitted for Approval' :
  //             status === 'Review Failed' ? 'Awareness program on NGRBC principles Review Failed' :
  //               status === 'Approved' ? 'Awareness program on NGRBC principles Approved' :
  //                 status === 'Rejected' ? 'Awareness program on NGRBC principles Rejected' : ''
  //       });

  //     }
  //   });
  // }

  // Awareness program for value chain partners on NGRBC principles

  submitValueChainNGRBC(status: any, title: any) {
    this.showProgressPopup()
    // if (this.govDisclosureForm.value.value_chain_partners_count ||
    //   this.govDisclosureForm.value.awareness_programs_count ||
    //   this.govDisclosureForm.value.value_chain_partners_covered_awareness) {
    //   this.govDisclosureForm.controls['value_chain_partners_title_status'].setValue('Open')

    // }
    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    this.esgService.creategovValueChainNGRBC(this.govDisclosureForm.value).subscribe({
      next: (result: any) => {
        // this.value_chain_partners_status = result[0].value_chain_partners_title_status
        this.vcNGRBC = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        Swal.fire({
          icon: 'success',
          title: 'Awareness program for value chain partners on NGRBC principles saved',
        });
      }
    })
  }

  // updateValueChainNGRBC(status: any, title: any) {

  //   const formData = new FormData();
  //   formData.append('value_chain_partners_NGRBC_status', status);
  //   formData.append('ref_id', this.refID);
  //   this.esgService.updateESGGovDisStatus(formData).subscribe({
  //     next: (result: any) => {

  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //     },
  //     complete: () => {
  //       title.status = status;
  //       Swal.fire({
  //         icon: 'success',
  //         title:
  //           status === 'Submitted for Approval' ? 'Awareness program for value chain partners on NGRBC principles Submitted for Approval' :
  //             status === 'Review Failed' ? 'Awareness program for value chain partners on NGRBC principles Review Failed' :
  //               status === 'Approved' ? 'Awareness program for value chain partners on NGRBC principles Approved' :
  //                 status === 'Rejected' ? 'Awareness program for value chain partners on NGRBC principles Rejected' : ''
  //       });

  //     }
  //   });
  // }

  // Compliance with laws and regulations


  addLawRegulations(data: any) {

    this.dialog.open(AddLawRegulationComponent, { width: "740px", data: { lov: this.lov, addData: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {


        this.lawRegulations.push(data)
      }
    })
  }

  ModifyLawRegulations(data: any, title_ref_id: any, index?: number) {

    this.dialog.open(AddLawRegulationComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        addData: data,
        title_ref_id: title_ref_id,

        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {

        if (updatedData.id) {

          // If id exists, update using the id
          const index = this.filteredLawRegulations.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredLawRegulations[index] = updatedData;
          }
        } else if (index !== undefined) {

          // If no id, update using the passed index
          this.lawRegulations[index] = updatedData;
        }
      }
    });
  }

  viewLawRegulations(data: any) {

    this.dialog.open(AddLawRegulationComponent, {
      width: "740px", data: {
        lov: this.lov,
        addData: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  deleteLawRegulations(data: any, index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        if (data.id) {
          this.showProgressPopup()
          this.esgService.deleteGovLawRegulations(data.id).subscribe({
            next: (result: any) => {
              this.filteredLawRegulations = this.filteredLawRegulations.filter(item => item.id !== data.id);
            },
            error: () => {
              console.error('Error deleting compliance with law and regulation details');
            },
            complete: () => {
              Swal.close()
            }
          });
        } else {
          this.lawRegulations.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'compliance with law and regulation details deleted successfully!',
            timer: 1000, // Auto-close after 2 seconds
            showConfirmButton: false
          });
        }
      }
    })
  }

  // updateLawRegulationsStatus(status: any, title: any) {

  //   const formData = new FormData();
  //   formData.append('law_regulation_status', status);
  //   formData.append('ref_id', this.refID);
  //   this.esgService.updateESGGovDisStatus(formData).subscribe({
  //     next: (result: any) => {

  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //     },
  //     complete: () => {
  //       title.status = status;
  //       Swal.fire({
  //         icon: 'success',
  //         title:
  //           status === 'Submitted for Approval' ? 'Compliance with laws and regulations Submitted for Approval' :
  //             status === 'Review Failed' ? 'Compliance with laws and regulations Review Failed' :
  //               status === 'Approved' ? 'Compliance with laws and regulations Approved' :
  //                 status === 'Rejected' ? 'Compliance with laws and regulations Rejected' : ''
  //       });

  //     }
  //   });
  // }

  submitLawRegulations(status: any, title: any) {
    this.showProgressPopup()

    const titleRefID = title.reference_id

    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('lawRegulation_details', JSON.stringify(this.lawRegulations))

    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(titleRefID)

    formData.append('form_value', JSON.stringify(this.govDisclosureForm.value))

    this.esgService.createGovLawRegulations(formData).subscribe({
      next: (result: any) => {

        this.filteredLawRegulations = []
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredLawRegulations.push(...result[0].data)
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        this.lawRegulations = []
        Swal.fire({
          icon: 'success',
          title: 'Compliance with laws and regulations saved',
        });
      }
    })


  }

  // Grievances/ Complaints


  addComplaints(data: any) {

    this.dialog.open(AddComplaintsComponent, { width: "740px", data: { lov: this.lov, addData: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {

        // this.filteredComplaints.push(data)

        this.complaints.push(data)
      }
    })
  }

  ModifyComplaints(data: any, title_ref_id: any, index?: number) {

    this.dialog.open(AddComplaintsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        addData: data,
        title_ref_id: title_ref_id,

        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {

        if (updatedData.id) {

          // If id exists, update using the id
          const index = this.filteredComplaints.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredComplaints[index] = updatedData;
          }
        } else if (index !== undefined) {

          // If no id, update using the passed index
          this.complaints[index] = updatedData;
        }
      }
    });
  }

  viewComplaints(data: any) {
    this.dialog.open(AddComplaintsComponent, {
      width: "740px", data: {
        lov: this.lov,
        addData: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  deleteComplaints(data: any, index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        if (data.id) {
          this.showProgressPopup()
          this.esgService.deleteGovLawRegulations(data.id).subscribe({
            next: (result: any) => {
              this.filteredComplaints = this.filteredComplaints.filter(item => item.id !== data.id);
            },
            error: () => {
              console.error('Error deleting complaints details');
            },
            complete: () => {
              Swal.close()
            }
          });
        } else {
          this.complaints.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Complaints details deleted successfully!',
            timer: 1000, // Auto-close after 2 seconds
            showConfirmButton: false
          });
        }
      }
    })
  }


  submitComplaints(status: any, title: any) {
    this.showProgressPopup()

    const titleRefID = title.reference_id

    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    this.govDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('grievances_details', JSON.stringify(this.complaints))

    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(titleRefID)

    formData.append('form_value', JSON.stringify(this.govDisclosureForm.value))

    this.esgService.createGovGrievances(formData).subscribe({
      next: (result: any) => {

        this.filteredComplaints = []
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredComplaints.push(...result[0].data)
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;

        this.complaints = []
        Swal.fire({
          icon: 'success',
          title: 'Complaints saved',
        });
      }
    })


  }

  //  Theme Responsible business conduct
  updateBusinessConductStatus(status: any, theme: any) {

    const formData = new FormData();
    formData.append('responsible_business_conduct_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGGovDisStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        theme.status = status;
        Swal.fire({
          icon: 'success',
          title:
            status === 'Submitted for Review' ? 'Responsible business conduct theme Submitted for Review' :
              status === 'Open' ? 'Responsible business conduct Re-Opened' :
                status === 'Submitted for Approval' ? 'Responsible business conduct theme Submitted for Approval' :
                  status === 'Review Failed' ? 'Responsible business conduct theme Review Failed' :
                    status === 'Approved' ? 'Responsible business conduct theme Approved' :
                      status === 'Rejected' ? 'Responsible business conduct theme Rejected' : ''
        });

      }
    });
  }


  // Corporate partnership overview


  addCorporate(data: any) {

    this.dialog.open(AddCorporateComponent, { width: "740px", data: { lov: this.lov, addData: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {

        // this.filteredCorporate.push(data)

        this.corporate.push(data)
      }
    })
  }

  ModifyCorporate(data: any, title_ref_id: any, index?: number) {

    this.dialog.open(AddCorporateComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        addData: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {

        if (updatedData.id) {

          // If id exists, update using the id
          const index = this.filteredCorporate.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredCorporate[index] = updatedData;
          }
        } else if (index !== undefined) {

          // If no id, update using the passed index
          this.corporate[index] = updatedData;
        }
      }
    });
  }

  viewCorporate(data: any) {
    this.dialog.open(AddCorporateComponent, {
      width: "740px", data: {
        lov: this.lov,
        addData: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  deleteCorporate(data: any, index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {

        if (data.id) {
          this.showProgressPopup()
          this.esgService.deleteGovCorporate(data.id).subscribe({
            next: (result: any) => {
              this.filteredCorporate = this.filteredCorporate.filter(
                item => item.id !== data.id
              );
            },
            error: () => {
              console.error('Error deleting corporate details');
            },
            complete: () => {
              Swal.close()
            }
          });
        } else {
          this.corporate.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Corporate details deleted successfully!',
            timer: 1000, // Auto-close after 2 seconds
            showConfirmButton: false
          });
        }
      }
    })
  }



  submitCorporate(status: any, title: any) {
    this.showProgressPopup()

    const titleRefID = title.reference_id

    this.govDisclosureForm.controls['esg_governance_disclosure'].setValue(this.currentGOVTitles[0].esg_governance_disclosure);

    // this.govDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('corporate_details', JSON.stringify(this.corporate))

    this.govDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.govDisclosureForm.controls['title_ref_id'].setValue(titleRefID)

    formData.append('form_value', JSON.stringify(this.govDisclosureForm.value))

    this.esgService.createGovCorporate(formData).subscribe({
      next: (result: any) => {

        this.filteredCorporate = []
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredCorporate.push(...result[0].data)

        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()

        title.status = status;

        this.corporate = []
        Swal.fire({
          icon: 'success',
          title: 'Corporate saved',
        });
      }
    })


  }

  // Theme Other governance indicators

  updateOtherGovernanceIndicatorsStatus(status: any, theme: any) {
    this.showProgressPopup()

    const formData = new FormData();
    formData.append('other_governance_indicators_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGGovDisStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()

        theme.status = status;
        Swal.fire({
          icon: 'success',
          title: status === 'Submitted for Review' ? 'Other governance indicators theme Submitted for Review' :
            status === 'Open' ? 'Other governance indicators theme Re-Opened' :
              status === 'Submitted for Approval' ? 'Other governance indicators theme Submitted for Approval' :
                status === 'Review Failed' ? 'Other governance indicators theme Review Failed' :
                  status === 'Approved' ? 'Other governance indicators theme Approved' :
                    status === 'Rejected' ? 'Other governance indicators theme Rejected' : ''
        });

      }
    });
  }

  // Update All Themes status
  updateAllThemeStatus(status: string) {
    this.showProgressPopup();
    const formData = new FormData();
    formData.append("status", status);
    formData.append("ref_id", this.refID);

    this.esgService.updateESGGovAllDisThemeStatus(formData).subscribe({
      next: (result: any) => {
        this.groupedData.forEach((theme: { status: string; }) => theme.status = status === "Approve All" ? "Approved" : "Rejected");
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close();
        Swal.fire({
          icon: "success",
          title: status === "Reject All" ? "Rejected All Themes" :
            status === "Approve All" ? "Approved All Themes" : ""
        });
      }
    });
  }

  allThemesHaveRequiredStatus(): boolean {
    return this.groupedData.every((theme: { status: string }) =>
      theme.status === "Submitted for Approval" ||
      theme.status === "Approved" ||
      theme.status === "Rejected"
    );
  }

  allThemesAreFullyProcessed(): boolean {
    return this.groupedData.every((theme: { status: string }) =>
      theme.status === "Approved" || theme.status === "Rejected"
    );
  }
}
