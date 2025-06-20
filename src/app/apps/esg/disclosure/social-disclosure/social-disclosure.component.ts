import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { AddEmployeeDetailsComponent } from './social-disclosure-title-details/add-employee-details/add-employee-details.component';
import { EsgService } from 'src/app/services/esg.service';
import { AddNewWorkerHiresComponent } from './social-disclosure-title-details/add-new-hire/add-new-worker-hires/add-new-worker-hires.component';
import { AddNewEmployeeHiresComponent } from './social-disclosure-title-details/add-new-hire/add-new-employee-hires/add-new-employee-hires.component';
import Swal from 'sweetalert2';
import { AddEmployeeTurnoverComponent } from './social-disclosure-title-details/add-turnover/add-employee-turnover/add-employee-turnover.component';
import { AddWorkerTurnoverComponent } from './social-disclosure-title-details/add-turnover/add-worker-turnover/add-worker-turnover.component';
import { AddDifAbledEmployeesComponent } from './social-disclosure-title-details/add-differently-abled/add-dif-abled-employees/add-dif-abled-employees.component';
import { AddDifAbledWorkersComponent } from './social-disclosure-title-details/add-differently-abled/add-dif-abled-workers/add-dif-abled-workers.component';
import { AddWorkerBenefitsComponent } from './social-disclosure-title-details/add-benefits/add-worker-benefits/add-worker-benefits.component';
import { AddEmployeeBenefitsComponent } from './social-disclosure-title-details/add-benefits/add-employee-benefits/add-employee-benefits.component';
import { AddEmployeeRetirementBenefitsComponent } from './social-disclosure-title-details/add-retirement-benefits/add-employee-retirement-benefits/add-employee-retirement-benefits.component';
import { AddWorkerRetirementBenefitsComponent } from './social-disclosure-title-details/add-retirement-benefits/add-worker-retirement-benefits/add-worker-retirement-benefits.component';
import { AddRemunerationSalaryWagesComponent } from './social-disclosure-title-details/add-remuneration-salary-wages/add-remuneration-salary-wages.component';
import { AddAverageTrainingHoursComponent } from './social-disclosure-title-details/add-average-training-hours/add-average-training-hours.component';
import { AddEmployeeDiversityComponent } from './social-disclosure-title-details/add-employee-diversity/add-employee-diversity.component';
import { AddNonDiscriminationComponent } from './social-disclosure-title-details/add-non-discrimination/add-non-discrimination.component';
import { AddRightsOfIndigenousPeopleComponent } from './social-disclosure-title-details/add-rights-of-indigenous-people/add-rights-of-indigenous-people.component';
import { AddCloseCallsAndHighPotentialIncidentsComponent } from './social-disclosure-title-details/add-close-calls-and-high-potential-incidents/add-close-calls-and-high-potential-incidents.component';
import { AddHumanRightsAssessmentsComponent } from './social-disclosure-title-details/add-human-rights-assessments/add-human-rights-assessments.component';
import { AddHumanRightsAssessmentsChainPartnersComponent } from './social-disclosure-title-details/add-human-rights-assessments-chain-partners/add-human-rights-assessments-chain-partners.component';
import { AddProductRecallsComponent } from './social-disclosure-title-details/add-product-recalls/add-product-recalls.component';
import { AddConsumerComplaintsComponent } from './social-disclosure-title-details/add-consumer-complaints/add-consumer-complaints.component';
import { AddBreachesOfCustomerPrivacyLossOfDataComponent } from './social-disclosure-title-details/add-breaches-of-customer-privacy-loss-of-data/add-breaches-of-customer-privacy-loss-of-data.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { AddEmployeeSkillUpgradeTrainingComponent } from './social-disclosure-title-details/add-training-on-skill-upgradation/add-employee-skill-upgrade-training/add-employee-skill-upgrade-training.component';
import { AddWorkersSkillUpgradeTrainingComponent } from './social-disclosure-title-details/add-training-on-skill-upgradation/add-workers-skill-upgrade-training/add-workers-skill-upgrade-training.component';
import { AddEmployeePerfomanceReviewComponent } from './social-disclosure-title-details/add-perfomance-career-development-reviews/add-employee-perfomance-review/add-employee-perfomance-review.component';
import { AddWorkerPerfomanceReviewComponent } from './social-disclosure-title-details/add-perfomance-career-development-reviews/add-worker-perfomance-review/add-worker-perfomance-review.component';
import { AddEmployeeTrainingOnHsMeasuresComponent } from './social-disclosure-title-details/add-employee-training-on-hs-measures/add-employee-training-on-hs-measures.component';
import { AddRatioSalaryRemunerationWomenMenComponent } from './social-disclosure-title-details/add-ratio-salary-remuneration-women-men/add-ratio-salary-remuneration-women-men.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NewTypeHrViolationsComponent } from './new-type-hr-violations/new-type-hr-violations.component';
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
  selector: 'app-social-disclosure',
  templateUrl: './social-disclosure.component.html',
  styleUrls: ['./social-disclosure.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class SocialDisclosureComponent implements OnInit {
  socialDisclosureForm: FormGroup;
  employeeUnionForm: FormGroup;
  trainingHSMeasureForm: FormGroup;
  salaryratioForm: FormGroup;
  politicalContributionForm: FormGroup;
  HSAssessValueChainPartnerForm: FormGroup;
  workRelatedIllHealthForm: FormGroup;
  negativeSocImpactForm: FormGroup;
  marketingComminicationForm: FormGroup;
  prdServiceInfoLabelForm: FormGroup;
  customerHSForm: FormGroup;
  SecurityPersonalHRPolicyForm: FormGroup;
  occHealthSafetyMngForm: FormGroup;
  complaintsOccHealthSafetyMngForm: FormGroup;
  trainingOnHRIssuePolicyForm: FormGroup;
  RandRForm: FormGroup;
  SIAProjectForm: FormGroup;
  workInjuryForm: FormGroup;
  productServiceAssesmentForm: FormGroup;
  workingHoursForm: FormGroup;
  ComplaintsOnHRForm: FormGroup;
  healthSafetyAssessmentForm: FormGroup;
  workersOtherthanEmployeesForm: FormGroup;
  parentalLeaveForm: FormGroup;
  CSRProjectForm: FormGroup;
  supplierSocAssessmentForm: FormGroup;
  @Input() disclosureMode: string;
  @Input() data: any[] = [];
  @Input() currentTitles: any[] = [];
  @Input() lov: any[] = [];
  @Input() notes: any[] = [];
  @Input() esgHead: boolean;
  @Input() roles: string;
  @Input() status: string;
  @Input() refID: string;
  @Input() userID: string;
  @Input() year: string;
  @Input() month: string;
  employeeDetails: any[] = []
  filteredData: any[] = []
  newEmployeeHire: any[] = []
  newEmployeeTurnover: any[] = []
  newEmployeeSkillUpgradation: any[] = []
  newEmployeePerfomanceReview: any[] = []
  newEmployeeTrainingHSMeasures: any[] = []
  newEmployeeSalaryratio: any[] = []
  newWorkerPerfomanceReview: any[] = []
  newWorkersSkillUpgradation: any[] = []
  newDifferentlyAbledEmployee: any[] = []
  newEmployeeRetirementBenefits: any[] = []
  newRemunerationSalaryWage: any[] = []
  newAverageTrainingHours: any[] = []
  newEmployeeDiversity: any[] = []
  newEmployeeBenefits: any[] = []
  newWorkerHire: any[] = []
  newWorkerTurnover: any[] = []
  newDifferentlyAbledWorker: any[] = []
  filteredEmployeeDetails: any[] = [];
  filteredEmployeeTrainingHSMeasures: any[] = [];
  filteredEmployeeSalaryRatio: any[] = [];
  filteredEmployeeHires: any[] = [];
  filteredEmployeeTurnover: any[] = [];
  filteredEmployeeSkillupgradation: any[] = [];
  filteredEmployeePerfomanceReview: any[] = [];
  filteredWorkerPerfomanceReview: any[] = [];
  filteredWorkersSkillupgradation: any[] = [];
  filteredDifferentlyAbledEmployees: any[] = [];
  filteredEmployeeBenefits: any[] = [];
  filteredEmployeeRetirementBenefits: any[] = [];
  filteredRemunerationSalaryWage: any[] = [];
  filteredAverageTrainingHours: any[] = [];
  filteredEmployeeDiversity: any[] = [];
  filteredNonDiscrimination: any[] = [];
  filteredWorkerTurnover: any[] = [];
  newWorkerBenefits: any[] = [];
  newNonDiscrimination: any[] = [];
  newRightsOfIndPeople: any[] = [];
  newClosecalls: any[] = [];
  newHumanRightsAssessment: any[] = [];
  newChainPartenerHumanRightsAssessment: any[] = [];
  newWorkerRetirementBenefits: any[] = [];
  newProductRecalls: any[] = [];
  newConsumerComplaints: any[] = [];
  newBreaches: any[] = [];
  filteredDifferentlyAbledWorkers: any[] = [];
  filteredBreaches: any[] = [];
  filteredRightsOfIndPeople: any[] = [];
  filteredCloseCalls: any[] = [];
  filteredHumanRightsAssessment: any[] = [];
  filteredChainPartnerHumanRightsAssessment: any[] = [];
  filteredProductRecalls: any[] = [];
  filteredConsumerComplaints: any[] = [];
  filteredWorkersBenefits: any[] = [];
  filteredWorkersRetirementBenefits: any[] = [];
  filteredWorkerHires: any[] = [];
  employeeUnion: any;
  parentalLeave: any;
  supplierSocAssessment: any;
  OHSMngSystem: any;
  OHSMngSystemComplaints: any;
  HSAssessment: any;
  workingHours: any;
  productServiceAssessment: any;
  groupedData: any;
  workersotherThanEmployees: any;
  negSocImpacts: any;
  marketingCommunications: any;
  productServiceInfoLabel: any;
  customerHealthSafety: any;
  SecurityPersonalHRPolicy: any;
  ComplaintsOnHR: any;
  trainingOnHRIssuePolicy: any;
  RandR: any;
  SIAProject: any;
  workRelatedIll: any;
  workRelatedInjury: any;
  HSAssessValueChainPartner: any;
  politicalContribution: any;
  CSRProject: any;
  TrainingHSMeasure: any;
  SalaryRatio: any;
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
  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private esgService: EsgService,
  ) { }
  get assessedByControl() {
    return this.healthSafetyAssessmentForm.get('assessed_by');
  }
  get workersByControl() {
    return this.workersOtherthanEmployeesForm.get('workers');
  }
  get ageGroupByControl() {
    return this.workersOtherthanEmployeesForm.get('age_group');
  }
  ngOnInit() {

    this.socialDisclosureForm = this.formBuilder.group({
      ref_id: [''],
      title_ref_id: [''],
      title: [''],
      esg_social_disclosure: [''],
      employee_details_notes: [''],
      new_hire_notes: [''],
      turnover_notes: [''],
      dif_abled_notes: [''],
      benefits_notes: [''],
      retirement_benefits_notes: [''],
      remuneration_salary_wage_notes: [''],
      average_training_hour_notes: [''],
      employee_diversity_notes: [''],
      non_discrimination_notes: [''],
      rights_of_indigenous_people_notes: [''],
      close_calls_notes: [''],
      human_rights_assessment_notes: [''],
      chain_partner_human_rights_assessment_notes: [''],
      product_recalls_notes: [''],
      consumer_complaints_notes: [''],
      breaches_notes: [''],
      skill_upgradation_training_notes: [''],
      employee_perfomance_review_note: [''],
      workers_perfomance_review_note: [''],
      employee_training_hs_measure_note: [''],
      ratio_of_basic_salary_note: [''],
      status: [''],
      year: [this.year],
      month: [this.month],
    });
    if (this.currentTitles.length > 0) {

      if (this.currentTitles[0].employee_perfomance_review_note) {
        this.socialDisclosureForm.controls['employee_perfomance_review_note'].setValue(this.currentTitles[0].employee_perfomance_review_note)
      }
      if (this.currentTitles[0].workers_perfomance_review_note) {
        this.socialDisclosureForm.controls['workers_perfomance_review_note'].setValue(this.currentTitles[0].workers_perfomance_review_note)
      }
    }
    this.employeeUnionForm = this.formBuilder.group({
      no_of_male_employees: [null, Validators.required],
      no_of_female_employees: [null, Validators.required],
      no_of_male_workers: [null, Validators.required],
      no_of_female_workers: [null, Validators.required],
      employee_union_notes: [''],
      workers_union_notes: [''],
    })
    this.trainingHSMeasureForm = this.formBuilder.group({
      male: ['', Validators.required],
      female: ['', Validators.required],
      other: [''],
      note: [''],
    })
    this.HSAssessValueChainPartnerForm = this.formBuilder.group({
      value_chain_partners_working_conditions: [null, Validators.required],
      value_chain_partners_health_safety: [null, Validators.required],
      total_value_chain_partners: [null, Validators.required],
      note: [''],
    })
    this.CSRProjectForm = this.formBuilder.group({
      project_name: ['', Validators.required],
      state: ['', Validators.required],
      district: [''],
      theme: ['', Validators.required],
      amount_spent: [null, Validators.required],
      unit: [this.lov[29]?.value || '', Validators.required],
      total_beneficiaries: [null],
      vulnerable_groups_beneficiaries: [null],
      note: [''],
    })
    this.politicalContributionForm = this.formBuilder.group({
      amount: [null, Validators.required],
      currency: [this.lov[29]?.value || '', Validators.required],
      note: [''],
    })
    this.ComplaintsOnHRForm = this.formBuilder.group({
      type_of_violation: ['', Validators.required],
      no_of_complaints: [null, Validators.required],
      no_of_complaints_resolved: [null],
      no_of_complaints_pending: [null, Validators.required],
      remarks: [''],
      note: [''],
    })
    this.workRelatedIllHealthForm = this.formBuilder.group({
      ill_health_cases_employees: [null, Validators.required],
      ill_health_cases_workers: [null, Validators.required],
      fatalities_employees: [null, Validators.required],
      fatalities_workers: [null, Validators.required],
      rehabilitated_employees: [null, Validators.required],
      rehabilitated_workers: [null, Validators.required],
      description: [''],
    })
    this.RandRForm = this.formBuilder.group({
      name_of_project: [''],
      state: [''],
      district: [''],
      no_of_pafs: [null, Validators.required],
      percentage_of_pafs: [null],
      amount_paid_for_pafs: [null],
      note: [''],
    })
    this.workInjuryForm = this.formBuilder.group({
      fatalities_injuries_employees: [null, Validators.required],
      fatalities_injuries_workers: [null, Validators.required],
      high_consequence_injuries_employees: [null, Validators.required],
      high_consequence_injuries_workers: [null, Validators.required],
      minor_injuries_employees: [null],
      minor_injuries_workers: [null],
      commuting_injuries_employees: [null],
      commuting_injuries_workers: [null],
      lost_time_injuries_employees: [null, Validators.required],
      lost_time_injuries_workers: [null, Validators.required],
      days_lost_injury_employees: [null, Validators.required],
      days_lost_injury_workers: [null, Validators.required],
      rehabilitated_employees: [null, Validators.required],
      rehabilitated_workers: [null, Validators.required],
      description: [''],
      note: [''],
    })

    this.SIAProjectForm = this.formBuilder.group({
      name_of_project: ['', Validators.required],
      notification_number: ['', Validators.required],
      notification_date: ['', Validators.required],
      whether_conducted_by_ind_ext_agency: [null, Validators.required],
      results_communicated_in_public_domain: [null, Validators.required],
      brief_details: [''],
      mitigation_actions_social_impacts: [''],
      corrective_actions_taken: [''],
      note: [''],
    })
    this.trainingOnHRIssuePolicyForm = this.formBuilder.group({
      no_of_permanent_employees: [null, Validators.required],
      no_of_temporary_employees: [null, Validators.required],
      no_of_permanent_workers: [null, Validators.required],
      no_of_temporary_workers: [null, Validators.required],
      note: [''],
    })
    this.workersOtherthanEmployeesForm = this.formBuilder.group({
      male: [null, Validators.required],
      female: [null, Validators.required],
      other: [null],
      workers: [''],
      age_group: [''],
      note: [''],
    })
    this.negativeSocImpactForm = this.formBuilder.group({
      assessed_social_impacts: [null, Validators.required],
      significant_social_impacts_identified: [null],
      social_impacts_improvements_agreed: [null],
      social_impacts_relationships_terminated: [null],
      termination_details: [''],
      note: [''],
    })
    this.SecurityPersonalHRPolicyForm = this.formBuilder.group({
      third_party_trained_security_personnel_count: [null, Validators.required],
      third_party_security_personnel_count: [null, Validators.required],
      org_trained_security_personnel_count: [null, Validators.required],
      org_security_personnel_count: [null, Validators.required],
      note: [''],
    })
    this.marketingComminicationForm = this.formBuilder.group({
      resulting_in_fine_or_penalty: [null, Validators.required],
      resulting_in_warning: [null, Validators.required],
      with_voluntary_codes: [null, Validators.required],
      non_compliance_statement: ['', Validators.required],
      note: [''],
    })
    this.customerHSForm = this.formBuilder.group({
      resulting_in_fine_or_penalty: [null, Validators.required],
      resulting_in_warning: [null, Validators.required],
      non_compliance_incidents_health_safety: [null],
      with_voluntary_codes: [null, Validators.required],
      non_compliance_statement: ['', Validators.required],
      note: [''],
    })
    this.prdServiceInfoLabelForm = this.formBuilder.group({
      resulting_in_fine_or_penalty: [null, Validators.required],
      resulting_in_warning: [null, Validators.required],
      with_voluntary_codes: [null, Validators.required],
      non_compliance_statement: ['', Validators.required],
      note: [''],
    })
    this.workingHoursForm = this.formBuilder.group({
      calculation_factor: [''],
      employees_worked_hours: [null],
      workers_worked_hours: [null],
    })
    this.productServiceAssesmentForm = this.formBuilder.group({
      product_service_assessment_note: [''],
      num_product_service_info_labelling_compliance: [null, Validators.required],
      num_product_service_health_safety_assessed: [null, Validators.required],
    })
    this.healthSafetyAssessmentForm = this.formBuilder.group({
      no_of_plants_offices_hs_practice: [null, Validators.required],
      no_of_plants_offices_wrk_condition: [null, Validators.required],
      assessed_by: [''],
      health_safety_notes: [''],
    })
    this.supplierSocAssessmentForm = this.formBuilder.group({
      number_of_suppliers_screened_social_criteria: [null, Validators.required],
      supplier_soc_assessment_notes: [''],
    })
    this.occHealthSafetyMngForm = this.formBuilder.group({
      emp_covered_ohs_mng_system: [null, Validators.required],
      emp_covered_ohs_mng_system_int_audited: [null, Validators.required],
      emp_covered_ohs_mng_system_ext_audited_certified: [null, Validators.required],
      wrk_covered_ohs_mng_system: [null, Validators.required],
      wrk_covered_ohs_mng_system_int_audited: [null, Validators.required],
      wrk_covered_ohs_mng_system_ext_audited_certified: [null, Validators.required],
    })
    this.complaintsOccHealthSafetyMngForm = this.formBuilder.group({
      no_wrk_condition_complaints: [null, Validators.required],
      no_health_complaints: [null, Validators.required],
      no_wrk_condition_complaints_solved: [null, Validators.required],
      no_health_complaints_solved: [null, Validators.required],
      no_wrk_condition_complaints_pending: [null, Validators.required],
      no_health_complaints_pending: [null, Validators.required],
      health_complaints_note: [''],
    })
    this.salaryratioForm = this.formBuilder.group({
      worker_median_pay_gap_salary_ratio: [''],
      worker_average_pay_gap_salary_ratio: [''],
      note: [''],
    })
    this.parentalLeaveForm = this.formBuilder.group({
      emp_male_entitled_parental_leave: [null, Validators.required],
      emp_female_entitled_parental_leave: [null, Validators.required],
      emp_entitled_parental_leave_notes: [null],
      wrk_male_entitled_parental_leave: [null, Validators.required],
      wrk_female_entitled_parental_leave: [null, Validators.required],
      wrk_entitled_parental_leave_notes: [''],
      emp_male_took_parental_leave: [null, Validators.required],
      emp_female_took_parental_leave: [null, Validators.required],
      wrk_male_took_parental_leave: [null, Validators.required],
      wrk_female_took_parental_leave: [null, Validators.required],
      emp_took_parental_leave_notes: [''],
      wrk_took_parental_leave_notes: [''],
      emp_male_returned_work_reporting_period: [null, Validators.required],
      emp_female_returned_work_reporting_period: [null, Validators.required],
      emp_returned_work_reporting_period_notes: [''],
      wrk_male_returned_work_reporting_period: [null, Validators.required],
      wrk_female_returned_work_reporting_period: [null, Validators.required],
      wrk_returned_work_reporting_period_notes: [''],
      emp_male_retained_12m_after_return: [null, Validators.required],
      emp_female_retained_12m_after_return: [null, Validators.required],
      emp_retained_12m_after_return_notes: [''],
      wrk_male_retained_12m_after_return: [null, Validators.required],
      wrk_female_retained_12m_after_return: [null, Validators.required],
      wrk_retained_12m_after_return_notes: [''],
      emp_male_due_return_reporting_period: [null, Validators.required],
      emp_female_due_return_reporting_period: [null, Validators.required],
      emp_due_return_reporting_period_notes: [''],
      wrk_male_due_return_reporting_period: [null, Validators.required],
      wrk_female_due_return_reporting_period: [null, Validators.required],
      wrk_due_return_reporting_period_notes: [''],
      emp_male_returned_prior_period: [null, Validators.required],
      emp_female_returned_prior_period: [null, Validators.required],
      emp_returned_prior_period_notes: [''],
      wrk_male_returned_prior_period: [null, Validators.required],
      wrk_female_returned_prior_period: [null, Validators.required],
      wrk_returned_prior_period_notes: [''],
    })

    this.data.forEach(title => {
      const matchingNotes = this.notes.find(note => note.title_id === title.reference_id);

      if (title.title === 'Employee Details' && matchingNotes) {
        this.socialDisclosureForm.get('employee_details_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'New Hires' && matchingNotes) {
        this.socialDisclosureForm.get('new_hire_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Turnover' && matchingNotes) {
        this.socialDisclosureForm.get('turnover_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Differently Abled Employees' && matchingNotes) {
        this.socialDisclosureForm.get('dif_abled_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Benefits' && matchingNotes) {
        this.socialDisclosureForm.get('benefits_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Employee Retirement Benefits' && matchingNotes) {
        this.socialDisclosureForm.get('retirement_benefits_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Remuneration, Salary and Wages' && matchingNotes) {
        this.socialDisclosureForm.get('remuneration_salary_wage_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Average Training Hours' && matchingNotes) {
        this.socialDisclosureForm.get('average_training_hour_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Employee Diversity' && matchingNotes) {
        this.socialDisclosureForm.get('employee_diversity_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Non-Discrimination' && matchingNotes) {
        this.socialDisclosureForm.get('non_discrimination_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Rights of Indigenous People' && matchingNotes) {
        this.socialDisclosureForm.get('rights_of_indigenous_people_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Close Calls and High-Potential Work-Related Incidents' && matchingNotes) {
        this.socialDisclosureForm.get('close_calls_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Human Rights Assessments' && matchingNotes) {
        this.socialDisclosureForm.get('human_rights_assessment_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Human Rights Assessments of Value Chain Partners' && matchingNotes) {
        this.socialDisclosureForm.get('chain_partner_human_rights_assessment_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Product Recalls' && matchingNotes) {
        this.socialDisclosureForm.get('product_recalls_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Consumer Complaints' && matchingNotes) {
        this.socialDisclosureForm.get('consumer_complaints_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Breaches of Customer Privacy and Losses of Customer Data' && matchingNotes) {
        this.socialDisclosureForm.get('breaches_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Training on Skill Upgradation' && matchingNotes) {
        this.socialDisclosureForm.get('skill_upgradation_training_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Employee Performance and Career Development Reviews' && matchingNotes) {
        this.socialDisclosureForm.get('employee_perfomance_review_note')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Training on Health and Safety Measures' && matchingNotes) {
        this.socialDisclosureForm.get('employee_training_hs_measure_note')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Ratio of Basic Salary and Remuneration of Women to Men' && matchingNotes) {
        this.socialDisclosureForm.get('ratio_of_basic_salary_note')?.setValue(matchingNotes.note);
      }
    });
    this.data.forEach(theme => {
      const titleStatus = this.getStatusForTheme(theme.theme);
      if (titleStatus) {
        theme.status = titleStatus;
      }
    })
    const titleOrder = ["Employee Details", "New Hires", "Turnover", "Differently Abled Employees", "Benefits", "Employee Retirement Benefits", "Employee Association(s) or Union", "Remuneration, Salary and Wages", "Parental Leave for Employees/Workers", "Average Training Hours", "Training on Skill Upgradation", "Employee Performance and Career Development Reviews", "Employee Diversity", "Non-Discrimination", "Rights of Indigenous People", "Ratio of Basic Salary and Remuneration of Women to Men", "Training on Health and Safety Measures", "Occupational Health and Safety Management System", "Complaints related to Occupational Health and Safety Management System", "Health and Safety Assessments", "Health and Safety Assessments of Value Chain Partners", "Work-Related Injuries", "Close Calls and High-Potential Work-Related Incidents", "Work- Related Ill Health", "Working Hours", "Social Impact Assessments (SIA) of Projects", "CSR Projects", "Rehabilitation and Resettlement (R&R)", "Training on Human Rights Issues and Policies", "Complaints On Human Rights Violations", "Human Rights Assessments", "Human Rights Assessments of Value Chain Partners", "Security Personnel Trained in Human Rights Policies", "Customer Health and Safety", "Assessment of Products and Services", "Product and Service Information and Labeling", "Marketing Communications", "Product Recalls", "Consumer Complaints", "Breaches of Customer Privacy and Losses of Customer Data", "Political Contributions", "Supplier Social Assessment", "Negative Social Impacts in the Supply Chain", "Workers other than Employees Details"];

    const themeOrder = ["Employees", "Human Resource and Development", "Training and Education", "Diversity and Equal Opportunity", "Occupational Health and Safety", "Local Communities", "Human Rights", "Product Service Accountability", "Public Policy", "Social Supply Chain Management", "Workers other than Employees"]; // Adjust as needed

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


    this.filteredEmployeeHires = this.filterData('esg_soc_new_employee_hires');
    this.filteredWorkerHires = this.filterData('esg_soc_new_worker_hires');
    this.filteredEmployeeDetails = this.filterData('esg_soc_employee_details');
    this.filteredEmployeeTurnover = this.filterData('esg_soc_employee_turnovers');
    this.filteredWorkerTurnover = this.filterData('esg_soc_worker_turnovers');
    this.filteredDifferentlyAbledWorkers = this.filterData('esg_soc_dif_abled_workers');
    this.filteredDifferentlyAbledEmployees = this.filterData('esg_soc_dif_abled_employees');
    this.filteredEmployeeBenefits = this.filterData('esg_soc_employee_benefits');
    this.filteredWorkersBenefits = this.filterData('esg_soc_workers_benefits');
    this.filteredWorkersRetirementBenefits = this.filterData('esg_soc_work_ret_benefits');
    this.filteredEmployeeRetirementBenefits = this.filterData('esg_soc_emp_ret_benefits');
    this.filteredRemunerationSalaryWage = this.filterData('remuneration_salary_wages');
    this.filteredAverageTrainingHours = this.filterData('esg_soc_average_training_hours');
    this.filteredEmployeeDiversity = this.filterData('esg_soc_employee_diversities');
    this.filteredNonDiscrimination = this.filterData('esg_soc_non_discriminations');
    this.filteredRightsOfIndPeople = this.filterData('rights_of_indigenous_people');
    this.filteredCloseCalls = this.filterData('esg_soc_close_calls');
    this.filteredHumanRightsAssessment = this.filterData('human_rights_assessments');
    this.filteredChainPartnerHumanRightsAssessment = this.filterData('chain_partners_hr_assesses');
    this.filteredProductRecalls = this.filterData('esg_soc_product_recalls');
    this.filteredConsumerComplaints = this.filterData('esg_soc_consumer_complaints');
    this.filteredBreaches = this.filterData('breaches_of_customer_privacies');
    this.filteredEmployeeSkillupgradation = this.filterData('emp_skill_upgrade_trainings');
    this.filteredWorkersSkillupgradation = this.filterData('wrk_skill_upgrade_trainings');
    this.filteredEmployeePerfomanceReview = this.filterData('emp_perfomance_reviews');
    this.filteredWorkerPerfomanceReview = this.filterData('wrk_performance_reviews');
    this.filteredEmployeeTrainingHSMeasures = this.filterData('emp_training_hs_measures');
    this.filteredEmployeeSalaryRatio = this.filterData('esg_soc_emp_salary_ratios');
    this.employeeUnion = this.currentTitles[0].esg_soc_employee_union
    this.parentalLeave = this.currentTitles[0].esg_soc_parental_leave
    this.supplierSocAssessment = this.currentTitles[0].esg_supplier_soc_assessment
    this.OHSMngSystem = this.currentTitles[0].esg_soc_ohs_system
    this.OHSMngSystemComplaints = this.currentTitles[0].esg_soc_ohs_complaint
    this.HSAssessment = this.currentTitles[0].esg_soc_hs_assessment
    this.workingHours = this.currentTitles[0].esg_soc_working_hour
    this.productServiceAssessment = this.currentTitles[0].esg_soc_prd_service_assess
    this.workersotherThanEmployees = this.currentTitles[0].esg_soc_other_worker
    this.negSocImpacts = this.currentTitles[0].esg_neg_soc_imapact
    this.marketingCommunications = this.currentTitles[0].esg_soc_mar_comm
    this.productServiceInfoLabel = this.currentTitles[0].esg_soc_ps_label
    this.customerHealthSafety = this.currentTitles[0].esg_soc_customer_hs
    this.SecurityPersonalHRPolicy = this.currentTitles[0].esg_soc_personal_training
    this.ComplaintsOnHR = this.currentTitles[0].esg_soc_hr_complaint
    this.trainingOnHRIssuePolicy = this.currentTitles[0].esg_soc_hr_training
    this.RandR = this.currentTitles[0].esg_soc_r_and_r
    this.SIAProject = this.currentTitles[0].esg_soc_sia_project
    this.workRelatedIll = this.currentTitles[0].esg_soc_work_ill_health
    this.workRelatedInjury = this.currentTitles[0].esg_soc_work_injury
    this.HSAssessValueChainPartner = this.currentTitles[0].hs_value_chain_assessment
    this.politicalContribution = this.currentTitles[0].esg_soc_political_contribution
    this.CSRProject = this.currentTitles[0].esg_soc_csr_project
    this.TrainingHSMeasure = this.currentTitles[0].wrk_training_hs_measure
    this.SalaryRatio = this.currentTitles[0].esg_soc_wrk_salary_ratio
    if (this.SalaryRatio) {
      this.salaryratioForm.controls['worker_median_pay_gap_salary_ratio'].setValue(this.SalaryRatio.worker_median_pay_gap_salary_ratio)
      this.salaryratioForm.controls['worker_average_pay_gap_salary_ratio'].setValue(this.SalaryRatio.worker_average_pay_gap_salary_ratio)
      this.salaryratioForm.controls['note'].setValue(this.SalaryRatio.note)
    }
    if (this.CSRProject) {
      this.CSRProjectForm.controls['project_name'].setValue(this.CSRProject.project_name)
      this.CSRProjectForm.controls['state'].setValue(this.CSRProject.state)
      this.CSRProjectForm.controls['district'].setValue(this.CSRProject.district)
      this.CSRProjectForm.controls['theme'].setValue(this.CSRProject.theme)
      this.CSRProjectForm.controls['amount_spent'].setValue(this.CSRProject.amount_spent)
      this.CSRProjectForm.controls['unit'].setValue(this.CSRProject.unit)
      this.CSRProjectForm.controls['total_beneficiaries'].setValue(this.CSRProject.total_beneficiaries)
      this.CSRProjectForm.controls['vulnerable_groups_beneficiaries'].setValue(this.CSRProject.vulnerable_groups_beneficiaries)
      this.CSRProjectForm.controls['note'].setValue(this.CSRProject.note)
    }
    if (this.TrainingHSMeasure) {
      this.trainingHSMeasureForm.controls['male'].setValue(this.TrainingHSMeasure.male)
      this.trainingHSMeasureForm.controls['female'].setValue(this.TrainingHSMeasure.female)
      this.trainingHSMeasureForm.controls['other'].setValue(this.TrainingHSMeasure.other)
      this.trainingHSMeasureForm.controls['note'].setValue(this.TrainingHSMeasure.note)
    }
    if (this.SIAProject) {
      this.SIAProjectForm.controls['name_of_project'].setValue(this.SIAProject.name_of_project)
      this.SIAProjectForm.controls['notification_number'].setValue(this.SIAProject.notification_number)
      this.SIAProjectForm.controls['notification_date'].setValue(this.SIAProject.date_of_notification)
      this.SIAProjectForm.controls['whether_conducted_by_ind_ext_agency'].setValue(this.SIAProject.whether_conducted_by_ind_ext_agency)
      this.SIAProjectForm.controls['results_communicated_in_public_domain'].setValue(this.SIAProject.results_communicated_in_public_domain)
      this.SIAProjectForm.controls['brief_details'].setValue(this.SIAProject.brief_details)
      this.SIAProjectForm.controls['mitigation_actions_social_impacts'].setValue(this.SIAProject.mitigation_actions_social_impacts)
      this.SIAProjectForm.controls['corrective_actions_taken'].setValue(this.SIAProject.corrective_actions_taken)
      this.SIAProjectForm.controls['note'].setValue(this.SIAProject.note)
    }
    if (this.politicalContribution) {
      this.politicalContributionForm.controls['amount'].setValue(this.politicalContribution.amount)
      this.politicalContributionForm.controls['currency'].setValue(this.politicalContribution.currency)
      this.politicalContributionForm.controls['note'].setValue(this.politicalContribution.note)

    }
    if (this.HSAssessValueChainPartner) {
      this.HSAssessValueChainPartnerForm.controls['total_value_chain_partners'].setValue(this.HSAssessValueChainPartner.total_value_chain_partners)
      this.HSAssessValueChainPartnerForm.controls['value_chain_partners_working_conditions'].setValue(this.HSAssessValueChainPartner.value_chain_partners_working_conditions)
      this.HSAssessValueChainPartnerForm.controls['value_chain_partners_health_safety'].setValue(this.HSAssessValueChainPartner.value_chain_partners_health_safety)
      this.HSAssessValueChainPartnerForm.controls['note'].setValue(this.SIAProject.note)
    }

    if (this.workRelatedInjury) {
      this.workInjuryForm.controls['fatalities_injuries_employees'].setValue(this.workRelatedInjury.fatalities_injuries_employees)
      this.workInjuryForm.controls['fatalities_injuries_workers'].setValue(this.workRelatedInjury.fatalities_injuries_workers)
      this.workInjuryForm.controls['high_consequence_injuries_employees'].setValue(this.workRelatedInjury.high_consequence_injuries_employees)
      this.workInjuryForm.controls['high_consequence_injuries_workers'].setValue(this.workRelatedInjury.high_consequence_injuries_workers)
      this.workInjuryForm.controls['minor_injuries_employees'].setValue(this.workRelatedInjury.minor_injuries_employees)
      this.workInjuryForm.controls['minor_injuries_workers'].setValue(this.workRelatedInjury.minor_injuries_workers)
      this.workInjuryForm.controls['commuting_injuries_employees'].setValue(this.workRelatedInjury.commuting_injuries_employees)
      this.workInjuryForm.controls['commuting_injuries_workers'].setValue(this.workRelatedInjury.commuting_injuries_workers)
      this.workInjuryForm.controls['lost_time_injuries_employees'].setValue(this.workRelatedInjury.lost_time_injuries_employees)
      this.workInjuryForm.controls['lost_time_injuries_workers'].setValue(this.workRelatedInjury.lost_time_injuries_workers)
      this.workInjuryForm.controls['days_lost_injury_employees'].setValue(this.workRelatedInjury.days_lost_injury_employees)
      this.workInjuryForm.controls['days_lost_injury_workers'].setValue(this.workRelatedInjury.days_lost_injury_workers)
      this.workInjuryForm.controls['rehabilitated_employees'].setValue(this.workRelatedInjury.rehabilitated_employees)
      this.workInjuryForm.controls['rehabilitated_workers'].setValue(this.workRelatedInjury.rehabilitated_workers)
      this.workInjuryForm.controls['description'].setValue(this.workRelatedInjury.description)
      this.workInjuryForm.controls['note'].setValue(this.workRelatedInjury.note)
    }
    if (this.workRelatedIll) {
      this.workRelatedIllHealthForm.controls['rehabilitated_workers'].setValue(this.workRelatedIll.rehabilitated_workers)
      this.workRelatedIllHealthForm.controls['rehabilitated_employees'].setValue(this.workRelatedIll.rehabilitated_employees)
      this.workRelatedIllHealthForm.controls['fatalities_workers'].setValue(this.workRelatedIll.fatalities_workers)
      this.workRelatedIllHealthForm.controls['fatalities_employees'].setValue(this.workRelatedIll.fatalities_employees)
      this.workRelatedIllHealthForm.controls['ill_health_cases_workers'].setValue(this.workRelatedIll.ill_health_cases_workers)
      this.workRelatedIllHealthForm.controls['ill_health_cases_employees'].setValue(this.workRelatedIll.ill_health_cases_employees)
      this.workRelatedIllHealthForm.controls['description'].setValue(this.workRelatedIll.description)

    }
    if (this.RandR) {
      this.RandRForm.controls['name_of_project'].setValue(this.RandR.name_of_project)
      this.RandRForm.controls['state'].setValue(this.RandR.state)
      this.RandRForm.controls['district'].setValue(this.RandR.district)
      this.RandRForm.controls['no_of_pafs'].setValue(this.RandR.no_of_pafs)
      this.RandRForm.controls['percentage_of_pafs'].setValue(this.RandR.percentage_of_pafs)
      this.RandRForm.controls['amount_paid_for_pafs'].setValue(this.RandR.amount_paid_for_pafs)
      this.RandRForm.controls['note'].setValue(this.RandR.note)
    }
    if (this.ComplaintsOnHR) {
      this.ComplaintsOnHRForm.controls['no_of_complaints_pending'].setValue(this.ComplaintsOnHR.no_of_complaints_pending)
      this.ComplaintsOnHRForm.controls['no_of_complaints_resolved'].setValue(this.ComplaintsOnHR.no_of_complaints_resolved)
      this.ComplaintsOnHRForm.controls['no_of_complaints'].setValue(this.ComplaintsOnHR.no_of_complaints)
      this.ComplaintsOnHRForm.controls['type_of_violation'].setValue(this.ComplaintsOnHR.type_of_violation)
      this.ComplaintsOnHRForm.controls['remarks'].setValue(this.ComplaintsOnHR.remarks)
      this.ComplaintsOnHRForm.controls['note'].setValue(this.ComplaintsOnHR.note)
    }
    if (this.trainingOnHRIssuePolicy) {
      this.trainingOnHRIssuePolicyForm.controls['no_of_temporary_employees'].setValue(this.trainingOnHRIssuePolicy.no_of_temporary_employees)
      this.trainingOnHRIssuePolicyForm.controls['no_of_permanent_employees'].setValue(this.trainingOnHRIssuePolicy.no_of_permanent_employees)
      this.trainingOnHRIssuePolicyForm.controls['no_of_permanent_workers'].setValue(this.trainingOnHRIssuePolicy.no_of_permanent_workers)
      this.trainingOnHRIssuePolicyForm.controls['no_of_temporary_workers'].setValue(this.trainingOnHRIssuePolicy.no_of_temporary_workers)
      this.trainingOnHRIssuePolicyForm.controls['note'].setValue(this.trainingOnHRIssuePolicy.note)
    }
    if (this.employeeUnion) {
      this.employeeUnionForm.controls['no_of_male_employees'].setValue(this.employeeUnion.no_of_male_employees)
      this.employeeUnionForm.controls['no_of_female_employees'].setValue(this.employeeUnion.no_of_female_employees)
      this.employeeUnionForm.controls['no_of_male_workers'].setValue(this.employeeUnion.no_of_male_workers)
      this.employeeUnionForm.controls['no_of_female_workers'].setValue(this.employeeUnion.no_of_female_workers)
      this.employeeUnionForm.controls['employee_union_notes'].setValue(this.employeeUnion.employee_union_notes)
      this.employeeUnionForm.controls['workers_union_notes'].setValue(this.employeeUnion.workers_union_notes)
    }
    if (this.SecurityPersonalHRPolicy) {
      this.SecurityPersonalHRPolicyForm.controls['org_security_personnel_count'].setValue(this.SecurityPersonalHRPolicy.org_security_personnel_count)
      this.SecurityPersonalHRPolicyForm.controls['org_trained_security_personnel_count'].setValue(this.SecurityPersonalHRPolicy.org_trained_security_personnel_count)
      this.SecurityPersonalHRPolicyForm.controls['third_party_security_personnel_count'].setValue(this.SecurityPersonalHRPolicy.third_party_security_personnel_count)
      this.SecurityPersonalHRPolicyForm.controls['third_party_trained_security_personnel_count'].setValue(this.SecurityPersonalHRPolicy.third_party_trained_security_personnel_count)
      this.SecurityPersonalHRPolicyForm.controls['note'].setValue(this.SecurityPersonalHRPolicy.note)
    }
    if (this.negSocImpacts) {
      this.negativeSocImpactForm.controls['assessed_social_impacts'].setValue(this.negSocImpacts.assessed_social_impacts)
      this.negativeSocImpactForm.controls['significant_social_impacts_identified'].setValue(this.negSocImpacts.significant_social_impacts_identified)
      this.negativeSocImpactForm.controls['social_impacts_improvements_agreed'].setValue(this.negSocImpacts.social_impacts_improvements_agreed)
      this.negativeSocImpactForm.controls['social_impacts_relationships_terminated'].setValue(this.negSocImpacts.social_impacts_relationships_terminated)
      this.negativeSocImpactForm.controls['termination_details'].setValue(this.negSocImpacts.termination_details)
      this.negativeSocImpactForm.controls['note'].setValue(this.negSocImpacts.note)
    }
    if (this.marketingCommunications) {
      this.marketingComminicationForm.controls['non_compliance_statement'].setValue(this.marketingCommunications.non_compliance_statement)
      this.marketingComminicationForm.controls['with_voluntary_codes'].setValue(this.marketingCommunications.with_voluntary_codes)
      this.marketingComminicationForm.controls['resulting_in_warning'].setValue(this.marketingCommunications.resulting_in_warning)
      this.marketingComminicationForm.controls['resulting_in_fine_or_penalty'].setValue(this.marketingCommunications.resulting_in_fine_or_penalty)
      this.marketingComminicationForm.controls['note'].setValue(this.marketingCommunications.note)
    }
    if (this.customerHealthSafety) {
      this.customerHSForm.controls['non_compliance_statement'].setValue(this.customerHealthSafety.non_compliance_statement)
      this.customerHSForm.controls['non_compliance_incidents_health_safety'].setValue(this.customerHealthSafety.non_compliance_incidents_health_safety)
      this.customerHSForm.controls['with_voluntary_codes'].setValue(this.customerHealthSafety.with_voluntary_codes)
      this.customerHSForm.controls['resulting_in_warning'].setValue(this.customerHealthSafety.resulting_in_warning)
      this.customerHSForm.controls['resulting_in_fine_or_penalty'].setValue(this.customerHealthSafety.resulting_in_fine_or_penalty)
      this.customerHSForm.controls['note'].setValue(this.customerHealthSafety.note)
    }
    if (this.productServiceInfoLabel) {
      this.prdServiceInfoLabelForm.controls['non_compliance_statement'].setValue(this.productServiceInfoLabel.non_compliance_statement)
      this.prdServiceInfoLabelForm.controls['with_voluntary_codes'].setValue(this.productServiceInfoLabel.with_voluntary_codes)
      this.prdServiceInfoLabelForm.controls['resulting_in_warning'].setValue(this.productServiceInfoLabel.resulting_in_warning)
      this.prdServiceInfoLabelForm.controls['resulting_in_fine_or_penalty'].setValue(this.productServiceInfoLabel.resulting_in_fine_or_penalty)
      this.prdServiceInfoLabelForm.controls['note'].setValue(this.productServiceInfoLabel.note)
    }
    if (this.workersotherThanEmployees) {
      this.workersOtherthanEmployeesForm.controls['male'].setValue(this.workersotherThanEmployees.male)
      this.workersOtherthanEmployeesForm.controls['female'].setValue(this.workersotherThanEmployees.female)
      this.workersOtherthanEmployeesForm.controls['other'].setValue(this.workersotherThanEmployees.other)
      this.workersOtherthanEmployeesForm.controls['note'].setValue(this.workersotherThanEmployees.note)
      this.workersOtherthanEmployeesForm.controls['workers'].setValue(
        this.workersotherThanEmployees.workers?.split(',').map((item: string) => item.trim())
      );
      this.workersOtherthanEmployeesForm.controls['age_group'].setValue(
        this.workersotherThanEmployees.age_group?.split(',').map((item: string) => item.trim())
      );
    }
    if (this.productServiceAssessment) {
      this.productServiceAssesmentForm.controls['num_product_service_health_safety_assessed'].setValue(this.productServiceAssessment.num_product_service_health_safety_assessed)
      this.productServiceAssesmentForm.controls['num_product_service_info_labelling_compliance'].setValue(this.productServiceAssessment.num_product_service_info_labelling_compliance)
      this.productServiceAssesmentForm.controls['product_service_assessment_note'].setValue(this.productServiceAssessment.product_service_assessment_note)

    }
    if (this.workingHours) {
      this.workingHoursForm.controls['employees_worked_hours'].setValue(this.workingHours.employees_worked_hours)
      this.workingHoursForm.controls['calculation_factor'].setValue(this.workingHours.calculation_factor)
      this.workingHoursForm.controls['workers_worked_hours'].setValue(this.workingHours.workers_worked_hours)

    }
    if (this.OHSMngSystem) {
      this.occHealthSafetyMngForm.controls['emp_covered_ohs_mng_system'].setValue(this.OHSMngSystem.emp_covered_ohs_mng_system)
      this.occHealthSafetyMngForm.controls['emp_covered_ohs_mng_system_int_audited'].setValue(this.OHSMngSystem.emp_covered_ohs_mng_system_int_audited)
      this.occHealthSafetyMngForm.controls['emp_covered_ohs_mng_system_ext_audited_certified'].setValue(this.OHSMngSystem.emp_covered_ohs_mng_system_ext_audited_certified)
      this.occHealthSafetyMngForm.controls['wrk_covered_ohs_mng_system'].setValue(this.OHSMngSystem.wrk_covered_ohs_mng_system)
      this.occHealthSafetyMngForm.controls['wrk_covered_ohs_mng_system_int_audited'].setValue(this.OHSMngSystem.wrk_covered_ohs_mng_system_int_audited)
      this.occHealthSafetyMngForm.controls['wrk_covered_ohs_mng_system_ext_audited_certified'].setValue(this.OHSMngSystem.wrk_covered_ohs_mng_system_ext_audited_certified)
    }
    if (this.HSAssessment) {
      this.healthSafetyAssessmentForm.controls['no_of_plants_offices_hs_practice'].setValue(this.HSAssessment.no_of_plants_offices_hs_practice)
      this.healthSafetyAssessmentForm.controls['no_of_plants_offices_wrk_condition'].setValue(this.HSAssessment.no_of_plants_offices_wrk_condition)
      this.healthSafetyAssessmentForm.controls['assessed_by'].setValue(
        this.HSAssessment.assessed_by?.split(',').map((item: string) => item.trim())
      );
      this.healthSafetyAssessmentForm.controls['health_safety_notes'].setValue(this.HSAssessment.note)
    }
    if (this.OHSMngSystemComplaints) {
      this.complaintsOccHealthSafetyMngForm.controls['no_wrk_condition_complaints'].setValue(this.OHSMngSystemComplaints.no_wrk_condition_complaints)
      this.complaintsOccHealthSafetyMngForm.controls['no_health_complaints'].setValue(this.OHSMngSystemComplaints.no_health_complaints)
      this.complaintsOccHealthSafetyMngForm.controls['no_wrk_condition_complaints_solved'].setValue(this.OHSMngSystemComplaints.no_wrk_condition_complaints_solved)
      this.complaintsOccHealthSafetyMngForm.controls['no_health_complaints_solved'].setValue(this.OHSMngSystemComplaints.no_health_complaints_solved)
      this.complaintsOccHealthSafetyMngForm.controls['no_wrk_condition_complaints_pending'].setValue(this.OHSMngSystemComplaints.no_wrk_condition_complaints_pending)
      this.complaintsOccHealthSafetyMngForm.controls['no_health_complaints_pending'].setValue(this.OHSMngSystemComplaints.no_health_complaints_pending)
      this.complaintsOccHealthSafetyMngForm.controls['health_complaints_note'].setValue(this.OHSMngSystemComplaints.health_complaints_note)
    }
    if (this.parentalLeave) {
      this.parentalLeaveForm.controls['emp_male_entitled_parental_leave'].setValue(this.parentalLeave.emp_male_entitled_parental_leave);
      this.parentalLeaveForm.controls['emp_female_entitled_parental_leave'].setValue(this.parentalLeave.emp_female_entitled_parental_leave);
      this.parentalLeaveForm.controls['emp_entitled_parental_leave_notes'].setValue(this.parentalLeave.emp_entitled_parental_leave_notes);
      this.parentalLeaveForm.controls['wrk_male_entitled_parental_leave'].setValue(this.parentalLeave.wrk_male_entitled_parental_leave);
      this.parentalLeaveForm.controls['wrk_female_entitled_parental_leave'].setValue(this.parentalLeave.wrk_female_entitled_parental_leave);
      this.parentalLeaveForm.controls['wrk_entitled_parental_leave_notes'].setValue(this.parentalLeave.wrk_entitled_parental_leave_notes);
      this.parentalLeaveForm.controls['emp_male_took_parental_leave'].setValue(this.parentalLeave.emp_male_took_parental_leave);
      this.parentalLeaveForm.controls['emp_female_took_parental_leave'].setValue(this.parentalLeave.emp_female_took_parental_leave);
      this.parentalLeaveForm.controls['wrk_male_took_parental_leave'].setValue(this.parentalLeave.wrk_male_took_parental_leave);
      this.parentalLeaveForm.controls['wrk_female_took_parental_leave'].setValue(this.parentalLeave.wrk_female_took_parental_leave);
      this.parentalLeaveForm.controls['emp_took_parental_leave_notes'].setValue(this.parentalLeave.emp_took_parental_leave_notes);
      this.parentalLeaveForm.controls['wrk_took_parental_leave_notes'].setValue(this.parentalLeave.wrk_took_parental_leave_notes);
      this.parentalLeaveForm.controls['emp_male_returned_work_reporting_period'].setValue(this.parentalLeave.emp_male_returned_work_reporting_period);
      this.parentalLeaveForm.controls['emp_female_returned_work_reporting_period'].setValue(this.parentalLeave.emp_female_returned_work_reporting_period);
      this.parentalLeaveForm.controls['emp_returned_work_reporting_period_notes'].setValue(this.parentalLeave.emp_returned_work_reporting_period_notes);
      this.parentalLeaveForm.controls['wrk_male_returned_work_reporting_period'].setValue(this.parentalLeave.wrk_male_returned_work_reporting_period);
      this.parentalLeaveForm.controls['wrk_female_returned_work_reporting_period'].setValue(this.parentalLeave.wrk_female_returned_work_reporting_period);
      this.parentalLeaveForm.controls['wrk_returned_work_reporting_period_notes'].setValue(this.parentalLeave.wrk_returned_work_reporting_period_notes);
      this.parentalLeaveForm.controls['emp_male_retained_12m_after_return'].setValue(this.parentalLeave.emp_male_retained_12m_after_return);
      this.parentalLeaveForm.controls['emp_female_retained_12m_after_return'].setValue(this.parentalLeave.emp_female_retained_12m_after_return);
      this.parentalLeaveForm.controls['emp_retained_12m_after_return_notes'].setValue(this.parentalLeave.emp_retained_12m_after_return_notes);
      this.parentalLeaveForm.controls['wrk_male_retained_12m_after_return'].setValue(this.parentalLeave.wrk_male_retained_12m_after_return);
      this.parentalLeaveForm.controls['wrk_female_retained_12m_after_return'].setValue(this.parentalLeave.wrk_female_retained_12m_after_return);
      this.parentalLeaveForm.controls['wrk_retained_12m_after_return_notes'].setValue(this.parentalLeave.wrk_retained_12m_after_return_notes);
      this.parentalLeaveForm.controls['emp_male_due_return_reporting_period'].setValue(this.parentalLeave.emp_male_due_return_reporting_period);
      this.parentalLeaveForm.controls['emp_female_due_return_reporting_period'].setValue(this.parentalLeave.emp_female_due_return_reporting_period);
      this.parentalLeaveForm.controls['emp_due_return_reporting_period_notes'].setValue(this.parentalLeave.emp_due_return_reporting_period_notes);
      this.parentalLeaveForm.controls['wrk_male_due_return_reporting_period'].setValue(this.parentalLeave.wrk_male_due_return_reporting_period);
      this.parentalLeaveForm.controls['wrk_female_due_return_reporting_period'].setValue(this.parentalLeave.wrk_female_due_return_reporting_period);
      this.parentalLeaveForm.controls['wrk_due_return_reporting_period_notes'].setValue(this.parentalLeave.wrk_due_return_reporting_period_notes);
      this.parentalLeaveForm.controls['emp_male_returned_prior_period'].setValue(this.parentalLeave.emp_male_returned_prior_period);
      this.parentalLeaveForm.controls['emp_female_returned_prior_period'].setValue(this.parentalLeave.emp_female_returned_prior_period);
      this.parentalLeaveForm.controls['emp_returned_prior_period_notes'].setValue(this.parentalLeave.emp_returned_prior_period_notes);
      this.parentalLeaveForm.controls['wrk_male_returned_prior_period'].setValue(this.parentalLeave.wrk_male_returned_prior_period);
      this.parentalLeaveForm.controls['wrk_female_returned_prior_period'].setValue(this.parentalLeave.wrk_female_returned_prior_period);
      this.parentalLeaveForm.controls['wrk_returned_prior_period_notes'].setValue(this.parentalLeave.wrk_returned_prior_period_notes);

    }
    if (this.supplierSocAssessment) {
      this.supplierSocAssessmentForm.controls['number_of_suppliers_screened_social_criteria'].setValue(this.supplierSocAssessment.number_of_suppliers_screened_social_criteria)
      this.supplierSocAssessmentForm.controls['supplier_soc_assessment_notes'].setValue(this.supplierSocAssessment.note)

    }
    if (this.disclosureMode === 'view') {
      this.socialDisclosureForm.disable()
      this.employeeUnionForm.disable()
      this.trainingHSMeasureForm.disable()
      this.HSAssessValueChainPartnerForm.disable()
      this.CSRProjectForm.disable()
      this.politicalContributionForm.disable()
      this.ComplaintsOnHRForm.disable()
      this.workRelatedIllHealthForm.disable()
      this.RandRForm.disable()
      this.workInjuryForm.disable()
      this.SIAProjectForm.disable()
      this.trainingOnHRIssuePolicyForm.disable()
      this.workersOtherthanEmployeesForm.disable()
      this.negativeSocImpactForm.disable()
      this.SecurityPersonalHRPolicyForm.disable()
      this.marketingComminicationForm.disable()
      this.customerHSForm.disable()
      this.prdServiceInfoLabelForm.disable()
      this.workingHoursForm.disable()
      this.productServiceAssesmentForm.disable()
      this.healthSafetyAssessmentForm.disable()
      this.supplierSocAssessmentForm.disable()
      this.occHealthSafetyMngForm.disable()
      this.complaintsOccHealthSafetyMngForm.disable()
      this.salaryratioForm.disable()
      this.parentalLeaveForm.disable()
    }
  }
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
      case "Employee Details":
        return this.filteredEmployeeDetails.length > 0;

      case "New Hires":
        return this.filteredEmployeeHires.length > 0 || this.filteredWorkerHires.length > 0;

      case "Turnover":
        return this.filteredEmployeeTurnover.length > 0 || this.filteredWorkerTurnover.length > 0;

      case "Differently Abled Employees":
        return this.filteredDifferentlyAbledEmployees.length > 0;

      case "Differently Abled Workers":
        return this.filteredDifferentlyAbledWorkers.length > 0;

      case "Benefits":
        return this.filteredEmployeeBenefits.length > 0 || this.filteredWorkersBenefits.length > 0;

      case "Employee Retirement Benefits":
        return this.filteredEmployeeRetirementBenefits.length > 0;

      case "Workers Retirement Benefits":
        return this.filteredWorkersRetirementBenefits.length > 0;

      case "Employee Association(s) or Union":
        return this.employeeUnion;

      case "Parental Leave for Employees/Workers":
        return this.parentalLeave;

      case "Remuneration, Salary and Wages":
        return this.filteredRemunerationSalaryWage.length > 0;

      case "Average Training Hours":
        return this.filteredAverageTrainingHours.length > 0;

      case "Training on Skill Upgradation":
        return this.filteredEmployeeSkillupgradation.length > 0 || this.filteredWorkersSkillupgradation.length > 0;

      case "Employee Performance and Career Development Reviews":
        return this.filteredEmployeePerfomanceReview.length > 0 || this.filteredWorkerPerfomanceReview.length > 0;

      case "Employee Diversity":
        return this.filteredEmployeeDiversity.length > 0;

      case "Non-Discrimination":
        return this.filteredNonDiscrimination.length > 0;

      case "Rights of Indigenous People":
        return this.filteredRightsOfIndPeople.length > 0;

      case "Ratio of Basic Salary and Remuneration of Women to Men":
        return this.filteredEmployeeSalaryRatio.length > 0 || this.SalaryRatio?.length > 0;

      case "Training on Health and Safety Measures":
        return this.filteredEmployeeTrainingHSMeasures.length > 0 || this.TrainingHSMeasure?.length > 0;

      case "Occupational Health and Safety Management System":
        return this.OHSMngSystem;

      case "Complaints related to Occupational Health and Safety Management System":
        return this.OHSMngSystemComplaints;

      case "Health and Safety Assessments":
        return this.HSAssessment;

      case "Health and Safety Assessments of Value Chain Partners":
        return this.HSAssessValueChainPartner;

      case "Work-Related Injuries":
        return this.workRelatedInjury;

      case "Close Calls and High-Potential Work-Related Incidents":
        return this.filteredCloseCalls.length > 0;

      case "Work- Related Ill Health":
        return this.workRelatedIll;

      case "Working Hours":
        return this.workingHours;

      case "Social Impact Assessments (SIA) of Projects":
        return this.SIAProject;

      case "CSR Projects":
        return this.CSRProject;

      case "Rehabilitation and Resettlement (R&R)":
        return this.RandR;

      case "Training on Human Rights Issues and Policies":
        return this.trainingOnHRIssuePolicy;

      case "Complaints On Human Rights Violations":
        return this.ComplaintsOnHR;

      case "Human Rights Assessments":
        return this.filteredHumanRightsAssessment.length > 0;

      case "Human Rights Assessments of Value Chain Partners":
        return this.filteredChainPartnerHumanRightsAssessment.length > 0;

      case "Security Personnel Trained in Human Rights Policies":
        return this.SecurityPersonalHRPolicy;

      case "Customer Health and Safety":
        return this.customerHealthSafety;

      case "Assessment of Products and Services":
        return this.productServiceAssessment;

      case "Product and Service Information and Labeling":
        return this.productServiceInfoLabel;

      case "Marketing Communications":
        return this.marketingCommunications;

      case "Product Recalls":
        return this.filteredProductRecalls.length > 0;

      case "Consumer Complaints":
        return this.filteredConsumerComplaints.length > 0;

      case "Breaches of Customer Privacy and Losses of Customer Data":
        return this.filteredBreaches.length > 0;

      case "Political Contributions":
        return this.politicalContribution;

      case "Supplier Social Assessment":
        return this.supplierSocAssessment;

      case "Negative Social Impacts in the Supply Chain":
        return this.negSocImpacts;

      case "Workers other than Employees Details":
        return this.workersotherThanEmployees;

      default:
        return false;
    }
  }

  titleKeyMapping: { [title: string]: string | string[] } = {
    'Employee Details': 'esg_soc_employee_details',
    'New Hires': ['esg_soc_new_employee_hires', 'esg_soc_new_worker_hires'],
    'Turnover': ['esg_soc_employee_turnovers', 'esg_soc_worker_turnovers'],
    'Differently Abled Employees': ['esg_soc_dif_abled_employees', 'esg_soc_dif_abled_workers'],
    'Benefits': ['esg_soc_employee_benefits', 'esg_soc_workers_benefits'],
    'Employee Retirement Benefits': ['esg_soc_emp_ret_benefits', 'esg_soc_work_ret_benefits'],
    'Employee Association(s) or Union': 'esg_soc_employee_union',
    'Remuneration, Salary and Wages': 'remuneration_salary_wages',
    'Parental Leave for Employees/Workers': 'esg_soc_parental_leave',
    'Average Training Hours': 'esg_soc_average_training_hours',
    'Training on Skill Upgradation': ['emp_skill_upgrade_trainings', 'wrk_skill_upgrade_trainings'],
    'Employee Performance and Career Development Reviews': ['emp_perfomance_reviews', 'wrk_performance_reviews'],
    'Employee Diversity': 'esg_soc_employee_diversities',
    'Non-Discrimination': 'esg_soc_non_discriminations',
    'Rights of Indigenous People': 'rights_of_indigenous_people',
    'Ratio of Basic Salary and Remuneration of Women to Men': ['esg_soc_emp_salary_ratios', 'esg_soc_wrk_salary_ratio'],
    'Training on Health and Safety Measures': ['emp_training_hs_measures', 'wrk_training_hs_measure'],
    'Occupational Health and Safety Management System': 'esg_soc_ohs_system',
    'Complaints related to Occupational Health and Safety Management System': 'esg_soc_ohs_complaint',
    'Health and Safety Assessments': 'esg_soc_hs_assessment',
    'Health and Safety Assessments of Value Chain Partners': 'hs_value_chain_assessment',
    'Work-Related Injuries': 'esg_soc_work_injury',
    'Close Calls and High-Potential Work-Related Incidents': 'esg_soc_close_calls',
    'Work- Related Ill Health': 'esg_soc_work_ill_health',
    'Working Hours': 'esg_soc_working_hour',
    'Social Impact Assessments (SIA) of Projects': 'esg_soc_sia_project',
    'CSR Projects': 'esg_soc_csr_project',
    'Rehabilitation and Resettlement (R&R)': 'esg_soc_r_and_r',
    'Training on Human Rights Issues and Policies': 'esg_soc_hr_training',
    'Complaints On Human Rights Violations': 'esg_soc_hr_complaint',
    'Human Rights Assessments': ['human_rights_assessments', 'chain_partners_hr_assesses'],
    'Security Personnel Trained in Human Rights Policies': 'esg_soc_personal_training',
    'Customer Health and Safety': 'esg_soc_customer_hs',
    'Assessment of Products and Services': 'esg_soc_prd_service_assess',
    'Product and Service Information and Labeling': 'esg_soc_ps_label',
    'Marketing Communications': 'esg_soc_mar_comm',
    'Product Recalls': 'esg_soc_product_recalls',
    'Consumer Complaints': 'esg_soc_consumer_complaints',
    'Breaches of Customer Privacy and Losses of Customer Data': 'breaches_of_customer_privacies',
    'Political Contributions': 'esg_soc_political_contribution',
    'Supplier Social Assessment': 'esg_supplier_soc_assessment',
    'Negative Social Impacts in the Supply Chain': 'esg_neg_soc_imapact',
    'Workers other than Employees Details': 'esg_soc_other_worker'
  };

  // getAttendedCount(theme: any): number {
  //   let count = 0;

  //   theme.titles.forEach((title: any) => {
  //     const keys = this.titleKeyMapping[title.title]; // Map title to the corresponding key(s)
  //     if (keys) {
  //       if (Array.isArray(keys)) {
  //         const hasData = keys.some(key => {
  //           const filteredData = this.filterData(key); // Fetch data for each key
  //           return filteredData && filteredData.length > 0;
  //         });
  //         if (hasData) {
  //           count++;
  //         }
  //       } else {
  //         const filteredData = this.filterData(keys); // Fetch data using the mapped key
  //         if (filteredData && filteredData.length > 0) {
  //           count++;
  //         }
  //       }
  //     } else {
  //       console.warn(`Key not found for title: ${title.title}`); // Debugging message for missing keys
  //     }
  //   });

  //   return count;
  // }
  // getCompletionPercentage(theme: any): number {
  //   const totalTitles = theme.titles.length;
  //   const attendedCount = this.getAttendedCount(theme);
  //   if (attendedCount === 0) {
  //     return 0;
  //   }
  //   return Math.round((attendedCount / totalTitles) * 100);
  // }
  isButtonVisible(theme: any): boolean {
    const rolesArray = this.roles?.split(',') || [];
    return (
      ((rolesArray.includes('Contributor') && theme.status === 'Open') || this.esgHead === true) &&
      this.disclosureMode !== 'view'
    );
  }

  getStatusForTheme(theme: string): string | undefined {

    const currentTitle = this.currentTitles[0];
    switch (theme) {
      case 'Diversity and Equal Opportunity':
        return currentTitle.theme_diversity_and_equal_opportunity_status;
      case 'Employees':
        return currentTitle.theme_employees_status;
      case 'Human Resource and Development':
        return currentTitle.theme_human_resource_status;
      case 'Training and Education':
        return currentTitle.theme_training_and_education_status;
      case 'Occupational Health and Safety':
        return currentTitle.theme_health_and_safety_status;
      case 'Local Communities':
        return currentTitle.theme_local_community_status;
      case 'Human Rights':
        return currentTitle.theme_human_rights_status;
      case 'Product Service Accountability':
        return currentTitle.theme_product_service_accountability_status;
      case 'Social Supply Chain Management':
        return currentTitle.theme_soc_supply_chain_mng_status;
      case 'Public Policy':
        return currentTitle.theme_public_policy_status;
      case 'Workers other than Employees':
        return currentTitle.theme_workers_other_than_employees_status;
      default:
        return undefined;
    }
  }
  filterData(titleKey: string): any[] {
    let result: any[] = [];
    this.currentTitles.forEach(item => {
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

  /* Title: Employee Details */
  addEmployeeDetails(data: any) {
    this.dialog.open(AddEmployeeDetailsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        // this.filteredEmployeeDetails.push(data)
        this.employeeDetails.push(data)
      }
    })
  }
  ModifyEmployeeDetails(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddEmployeeDetailsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
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
          // this.filteredEmployeeDetails[index] = updatedData;
          this.employeeDetails[index] = updatedData;
        }
      }
    });
  }
  deleteEmployeeDetails(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleEmployeeDetails(data.id).subscribe({
        next: (result: any) => {
          this.filteredEmployeeDetails = this.filteredEmployeeDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting employee details');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredEmployeeDetails.splice(index, 1);
      this.employeeDetails.splice(index, 1);
    }
  }
  viewEmployeeDetails(data: any) {
    this.dialog.open(AddEmployeeDetailsComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  submitEmployeeDetails(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('employee_details', JSON.stringify(this.employeeDetails));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleEmployeeDetails(formData).subscribe({
      next: (result: any) => {
        this.filteredEmployeeDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredEmployeeDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        this.employeeDetails = [];
        Swal.fire({
          icon: 'success',
          title: 'Employee Details Saved'
        });
      }
    });

  }
  /* End of Employee Details Section */

  /* Title: Turnover */

  addEmployeeTurnover(data: any) {
    this.dialog.open(AddEmployeeTurnoverComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newEmployeeTurnover.push(data)
        // this.filteredEmployeeTurnover.push(data)
      }
    })

  }


  deleteEmployeeTurnover(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleEmployeeTurnover(data.id).subscribe({
        next: (result: any) => {
          this.filteredEmployeeTurnover = this.filteredEmployeeTurnover.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting employee Turnover');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredEmployeeTurnover.splice(index, 1);
      this.newEmployeeTurnover.splice(index, 1);
    }
  }

  deleteWorkerTurnover(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleWorkerTurnover(data.id).subscribe({
        next: (result: any) => {
          this.filteredWorkerTurnover = this.filteredWorkerTurnover.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Worker Turnover');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredWorkerTurnover.splice(index, 1);
      this.newWorkerTurnover.splice(index, 1);
    }
  }

  viewWorkerTurnover(data: any) {
    this.dialog.open(AddWorkerTurnoverComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  viewEmployeeTurnover(data: any) {
    this.dialog.open(AddEmployeeTurnoverComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  addNewWorkerTurnover(data: any) {
    this.dialog.open(AddWorkerTurnoverComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newWorkerTurnover.push(data)
        // this.filteredWorkerTurnover.push(data)
      }
    })

  }
  submitTurnover(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);

    const formData = new FormData();
    if (this.newEmployeeTurnover) {
      formData.append('new_employee_turnover', JSON.stringify(this.newEmployeeTurnover))
    }
    if (this.newWorkerTurnover) {
      formData.append('new_worker_turnover', JSON.stringify(this.newWorkerTurnover))
    }
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));

    this.esgService.createSocDisTitleTurnover(formData).subscribe({
      next: (result: any) => {
        this.filteredEmployeeTurnover = result[0].data.allNewEmployeeTurnovers
        this.filteredWorkerTurnover = result[0].data.allNewWorkerTurnovers
      },
      error: (err: any) => {
        console.error('Error in submission:', err);
      },
      complete: () => {
        Swal.close()
        this.newEmployeeTurnover = [];
        this.newWorkerTurnover = [];

        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'New Hire Added',
        });
      }
    });
  }
  ModifyEmployeeTurnover(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddEmployeeTurnoverComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredEmployeeTurnover.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredEmployeeTurnover[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredEmployeeTurnover[index] = updatedData;
          // this.newEmployeeTurnover[index] = updatedData;

          this.newEmployeeTurnover[index] = updatedData;
        }
      }
    });
  }

  ModifyWorkerTurnover(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddWorkerTurnoverComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredWorkerTurnover.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredWorkerTurnover[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredWorkerTurnover[index] = updatedData;
          this.newWorkerTurnover[index] = updatedData;
        }
      }
    });
  }

  /* End of Turnover Section */
  /* Title: Training on Skill Upgradation */

  addEmployeeSkillUpgradetraining(data: any) {
    this.dialog.open(AddEmployeeSkillUpgradeTrainingComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newEmployeeSkillUpgradation.push(data)
        // this.filteredEmployeeTurnover.push(data)
      }
    })

  }


  deleteEmployeeSkillUpgradetraining(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleEmployeeSkillUpgradeTraining(data.id).subscribe({
        next: (result: any) => {
          this.filteredEmployeeSkillupgradation = this.filteredEmployeeSkillupgradation.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Employee Skill upgradation');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredEmployeeTurnover.splice(index, 1);
      this.newEmployeeSkillUpgradation.splice(index, 1);
    }
  }

  deleteWorkerSkillUpgradetraining(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleWorkerSkillUpgradeTraining(data.id).subscribe({
        next: (result: any) => {
          this.filteredWorkersSkillupgradation = this.filteredWorkersSkillupgradation.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Workers Skill upgradation');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredWorkerTurnover.splice(index, 1);
      this.newWorkersSkillUpgradation.splice(index, 1);
    }
  }

  viewWorkerSkillUpgradetraining(data: any) {
    this.dialog.open(AddWorkersSkillUpgradeTrainingComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  viewEmployeeSkillUpgradetraining(data: any) {
    this.dialog.open(AddEmployeeSkillUpgradeTrainingComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  addNewWorkerSkillUpgradetraining(data: any) {
    this.dialog.open(AddWorkersSkillUpgradeTrainingComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newWorkersSkillUpgradation.push(data)
        // this.filteredWorkerTurnover.push(data)
      }
    })

  }
  submitSkillUpgradetraining(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);

    const formData = new FormData();
    if (this.newEmployeeSkillUpgradation) {
      formData.append('new_employee_skill_upgrade_training', JSON.stringify(this.newEmployeeSkillUpgradation))
    }
    if (this.newWorkersSkillUpgradation) {
      formData.append('new_worker_skill_upgrade_training', JSON.stringify(this.newWorkersSkillUpgradation))
    }
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));

    this.esgService.createSocDisTitleSkillUpgradeTraining(formData).subscribe({
      next: (result: any) => {
        this.filteredEmployeeSkillupgradation = result[0].data.allNewEmployeeSkillUpgradeTrainings
        this.filteredWorkersSkillupgradation = result[0].data.allNewWorkerSkillUpgradeTrainings
      },
      error: (err: any) => {
        console.error('Error in submission:', err);
      },
      complete: () => {
        Swal.close()
        this.newEmployeeSkillUpgradation = [];
        this.newWorkersSkillUpgradation = [];

        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Training on Skill Upgradation Added',
        });
      }
    });
  }
  ModifyEmployeeSkillUpgradetraining(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddEmployeeSkillUpgradeTrainingComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredEmployeeSkillupgradation.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredEmployeeSkillupgradation[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredEmployeeTurnover[index] = updatedData;
          // this.newEmployeeTurnover[index] = updatedData;

          this.newEmployeeSkillUpgradation[index] = updatedData;
        }
      }
    });
  }

  ModifyWorkerSkillUpgradetraining(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddWorkersSkillUpgradeTrainingComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredWorkersSkillupgradation.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredWorkersSkillupgradation[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredWorkerTurnover[index] = updatedData;
          this.newWorkersSkillUpgradation[index] = updatedData;
        }
      }
    });
  }

  /* End of Training on Skill Upgradation */
  /* Title: Employee Performance and Career Development Reviews */

  addEmployeePerfomanceReview(data: any) {
    this.dialog.open(AddEmployeePerfomanceReviewComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newEmployeePerfomanceReview.push(data)
        // this.filteredEmployeeTurnover.push(data)
      }
    })

  }


  deleteEmployeePerfomanceReview(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleEmployeePerfomanceReviews(data.id).subscribe({
        next: (result: any) => {
          this.filteredEmployeePerfomanceReview = this.filteredEmployeePerfomanceReview.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Employee Perfomance Review');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredEmployeeTurnover.splice(index, 1);
      this.newEmployeePerfomanceReview.splice(index, 1);
    }
  }

  deleteWorkerPerfomanceReview(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleWorkerPerfomanceReviews(data.id).subscribe({
        next: (result: any) => {
          this.filteredWorkerPerfomanceReview = this.filteredWorkerPerfomanceReview.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Workers Perfomance review');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredWorkerTurnover.splice(index, 1);
      this.newWorkerPerfomanceReview.splice(index, 1);
    }
  }

  viewWorkerPerfomanceReview(data: any) {
    this.dialog.open(AddWorkerPerfomanceReviewComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  viewEmployeePerfomanceReview(data: any) {
    this.dialog.open(AddEmployeePerfomanceReviewComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }

  addNewWorkerPerfomanceReview(data: any) {
    this.dialog.open(AddWorkerPerfomanceReviewComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newWorkerPerfomanceReview.push(data)
        // this.filteredWorkerTurnover.push(data)
      }
    })

  }
  submitPerfomanceReview(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);

    const formData = new FormData();
    if (this.newEmployeePerfomanceReview) {
      formData.append('new_employee_perfomance_reviews', JSON.stringify(this.newEmployeePerfomanceReview))
    }
    if (this.newWorkerPerfomanceReview) {
      formData.append('new_worker_perfomance_reviews', JSON.stringify(this.newWorkerPerfomanceReview))
    }
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));

    this.esgService.createSocDisTitlePerfomanceReviews(formData).subscribe({
      next: (result: any) => {
        this.filteredEmployeePerfomanceReview = result[0].data.allNewEmployeePerfomanceReviews
        this.filteredWorkerPerfomanceReview = result[0].data.allNewWorkerPerfomanceReviews
      },
      error: (err: any) => {
        console.error('Error in submission:', err);
      },
      complete: () => {
        Swal.close()
        this.newEmployeePerfomanceReview = [];
        this.newWorkerPerfomanceReview = [];

        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Employee Performance and Career Development Reviews Added',
        });
      }
    });
  }
  ModifyEmployeePerfomanceReview(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddEmployeePerfomanceReviewComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredEmployeePerfomanceReview.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredEmployeePerfomanceReview[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredEmployeeTurnover[index] = updatedData;
          // this.newEmployeeTurnover[index] = updatedData;

          this.newEmployeePerfomanceReview[index] = updatedData;
        }
      }
    });
  }

  ModifyWorkerPerfomanceReview(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddWorkerPerfomanceReviewComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredWorkerPerfomanceReview.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredWorkerPerfomanceReview[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredWorkerTurnover[index] = updatedData;
          this.newWorkerPerfomanceReview[index] = updatedData;
        }
      }
    });
  }

  /* End of Employee Performance and Career Development Reviews */
  /* Title: Training on Health and Safety Measures */

  addEmployeeTrainingHSMeasures(data: any) {
    this.dialog.open(AddEmployeeTrainingOnHsMeasuresComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newEmployeeTrainingHSMeasures.push(data)
        // this.filteredEmployeeTurnover.push(data)
      }
    })

  }


  deleteEmployeeTrainingHSMeasures(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleTrainingOnHealthSafetyMeasures(data.id).subscribe({
        next: (result: any) => {
          this.filteredEmployeeTrainingHSMeasures = this.filteredEmployeeTrainingHSMeasures.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Employee Training HS Measures');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredEmployeeTurnover.splice(index, 1);
      this.newEmployeeTrainingHSMeasures.splice(index, 1);
    }
  }





  viewEmployeeTrainingHSMeasures(data: any) {
    this.dialog.open(AddEmployeeTrainingOnHsMeasuresComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }


  submitTrainingHSMeasures(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);

    const formData = new FormData();
    if (this.newEmployeeTrainingHSMeasures) {
      formData.append('employee_hs_training_measures', JSON.stringify(this.newEmployeeTrainingHSMeasures))
    }

    formData.append('worker_hs_training_measures', JSON.stringify(this.trainingHSMeasureForm.value))

    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));

    this.esgService.createSocDisTitleTrainingOnHealthSafetyMeasures(formData).subscribe({
      next: (result: any) => {
        this.filteredEmployeeTrainingHSMeasures = result[0].data.allNewEmployeeTrainingHSMeasures
      },
      error: (err: any) => {
        console.error('Error in submission:', err);
      },
      complete: () => {
        Swal.close()
        this.newEmployeeTrainingHSMeasures = [];

        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Training on Health and Safety Measures Saved',
        });
      }
    });
  }
  ModifyEmployeeTrainingHSMeasures(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddEmployeeTrainingOnHsMeasuresComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredEmployeeTrainingHSMeasures.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredEmployeeTrainingHSMeasures[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredEmployeeTurnover[index] = updatedData;
          // this.newEmployeeTurnover[index] = updatedData;

          this.newEmployeeTrainingHSMeasures[index] = updatedData;
        }
      }
    });
  }



  /* End of Training on Health and Safety Measures */
  /* Title:Ratio of Basic Salary and Remuneration of Women to Men */

  addEmployeeSalaryRatio(data: any) {
    this.dialog.open(AddRatioSalaryRemunerationWomenMenComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newEmployeeSalaryratio.push(data)
        // this.filteredEmployeeTurnover.push(data)
      }
    })

  }


  deleteEmployeeSalaryRatio(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleSalaryRatioWomenToMen(data.id).subscribe({
        next: (result: any) => {
          this.filteredEmployeeSalaryRatio = this.filteredEmployeeSalaryRatio.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Employee Salary Ratio ');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredEmployeeTurnover.splice(index, 1);
      this.newEmployeeSalaryratio.splice(index, 1);
    }
  }





  viewEmployeeSalaryRatio(data: any) {
    this.dialog.open(AddRatioSalaryRemunerationWomenMenComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }


  submitSalaryRatio(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);

    const formData = new FormData();
    if (this.newEmployeeSalaryratio) {
      formData.append('employee_salary_ratio', JSON.stringify(this.newEmployeeSalaryratio))
    }

    formData.append('worker_salary_ratio', JSON.stringify(this.salaryratioForm.value))

    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));

    this.esgService.createSocDisTitleSalaryRatioWomenToMen(formData).subscribe({
      next: (result: any) => {
        this.filteredEmployeeSalaryRatio = result[0].data.allNewEmployeeSalaryRatios
      },
      error: (err: any) => {
        console.error('Error in submission:', err);
      },
      complete: () => {
        Swal.close()
        this.newEmployeeSalaryratio = [];

        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Ratio of Basic Salary and Remuneration of Women to Men Saved',
        });
      }
    });
  }
  ModifyEmployeeSalaryRatio(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddRatioSalaryRemunerationWomenMenComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredEmployeeSalaryRatio.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredEmployeeSalaryRatio[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredEmployeeTurnover[index] = updatedData;
          // this.newEmployeeTurnover[index] = updatedData;

          this.newEmployeeSalaryratio[index] = updatedData;
        }
      }
    });
  }

roundToTwoDecimals(controlName: string): void {
  const control = this.salaryratioForm.get(controlName);
  if (control && control.value != null && !isNaN(control.value)) {
    const value = parseFloat(control.value);
    const hasDecimal = value % 1 !== 0;

    if (hasDecimal) {
      const decimalPlaces = control.value.toString().split('.')[1]?.length || 0;
      if (decimalPlaces > 2) {
        control.setValue(value.toFixed(2));
      }
    }
  }
}



  /* End of Ratio of Basic Salary and Remuneration of Women to Men */

  /* Title: New Hire */
  addNewWorkerHire(data: any) {
    this.dialog.open(AddNewWorkerHiresComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newWorkerHire.push(data)
        // this.filteredWorkerHires.push(data)
      }
    })

  }
  addNewEmployeeHire(data: any) {
    this.dialog.open(AddNewEmployeeHiresComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newEmployeeHire.push(data)
        // this.filteredEmployeeHires.push(data)
      }
    })

  }
  deleteWorkerHire(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleWorkerHire(data.id).subscribe({
        next: (result: any) => {
          this.filteredWorkerHires = this.filteredWorkerHires.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting worker Hires');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredWorkerHires.splice(index, 1);
      this.newWorkerHire.splice(index, 1);
    }
  }
  deleteEmployeeHire(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleEmployeeHire(data.id).subscribe({
        next: (result: any) => {
          this.filteredEmployeeHires = this.filteredEmployeeHires.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting employee Hires');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredEmployeeHires.splice(index, 1);
      this.newEmployeeHire.splice(index, 1);
    }
  }
  viewWorkerHire(data: any) {
    this.dialog.open(AddNewWorkerHiresComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  viewEmployeeHire(data: any) {
    this.dialog.open(AddNewEmployeeHiresComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  ModifyWorkerHire(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddNewWorkerHiresComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredWorkerHires.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredWorkerHires[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredWorkerHires[index] = updatedData;
          this.newWorkerHire[index] = updatedData;
        }
      }
    });
  }
  submitNewHire(status: any, title: any) {
    this.showProgressPopup()

    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);

    const formData = new FormData();
    if (this.newEmployeeHire) {
      formData.append('new_employee_hire', JSON.stringify(this.newEmployeeHire))
    }
    if (this.newWorkerHire) {
      formData.append('new_worker_hire', JSON.stringify(this.newWorkerHire))
    }
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));

    this.esgService.createSocDisTitleNewHire(formData).subscribe({
      next: (result: any) => {
        this.filteredEmployeeHires = result[0].data.allNewEmployeeHires
        this.filteredWorkerHires = result[0].data.allNewWorkerHires
      },
      error: (err: any) => {
        console.error('Error in submission:', err);
      },
      complete: () => {
        Swal.close()

        this.newEmployeeHire = [];
        this.newWorkerHire = [];

        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'New Hire Added',
        });
      }
    });
  }


  ModifyEmployeeHire(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddNewEmployeeHiresComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredEmployeeHires.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredEmployeeHires[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredEmployeeHires[index] = updatedData;
          this.newEmployeeHire[index] = updatedData;
        }
      }
    });
  }

  /* End of New Hire */

  /* Title: Differently Abled */
  submitDifferentlyAbled(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);

    const formData = new FormData();
    if (this.newDifferentlyAbledEmployee) {
      formData.append('new_dif_abled_employees', JSON.stringify(this.newDifferentlyAbledEmployee))
    }
    if (this.newDifferentlyAbledWorker) {
      formData.append('new_dif_abled_workers', JSON.stringify(this.newDifferentlyAbledWorker))
    }
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));

    this.esgService.createSocDisTitleDifAbled(formData).subscribe({
      next: (result: any) => {
        this.filteredDifferentlyAbledEmployees = result[0].data.allNewDifAbledEmployees
        this.filteredDifferentlyAbledWorkers = result[0].data.allNewDifAbledWorkers
      },
      error: (err: any) => {
        console.error('Error in submission:', err);
      },
      complete: () => {
        Swal.close()
        this.newDifferentlyAbledEmployee = [];
        this.newDifferentlyAbledWorker = [];

        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Differently Abled Employees Added',
        });
      }
    });
  }
  addDifAbledEmployee(data: any) {
    this.dialog.open(AddDifAbledEmployeesComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newDifferentlyAbledEmployee.push(data)
        // this.filteredDifferentlyAbledEmployees.push(data)
      }
    })

  }
  ModifyDifAbledEmployee(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddDifAbledEmployeesComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredDifferentlyAbledEmployees.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredDifferentlyAbledEmployees[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredDifferentlyAbledEmployees[index] = updatedData;
          this.newDifferentlyAbledEmployee[index] = updatedData;
        }
      }
    });
  }
  viewDifAbledEmployee(data: any) {
    this.dialog.open(AddDifAbledEmployeesComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteDifAbledEmployee(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisDifAbledEmployee(data.id).subscribe({
        next: (result: any) => {
          this.filteredDifferentlyAbledEmployees = this.filteredDifferentlyAbledEmployees.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting differently abled employees');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredDifferentlyAbledEmployees.splice(index, 1);
      this.newDifferentlyAbledEmployee.splice(index, 1);
    }
  }
  addDifAbledWorker(data: any) {
    this.dialog.open(AddDifAbledWorkersComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newDifferentlyAbledWorker.push(data)
        // this.filteredDifferentlyAbledWorkers.push(data)
      }
    })

  }
  ModifyDifAbledWorker(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddDifAbledWorkersComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          const index = this.filteredDifferentlyAbledWorkers.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredDifferentlyAbledWorkers[index] = updatedData;
          }
        } else if (index !== undefined) {
          // this.filteredDifferentlyAbledWorkers[index] = updatedData;
          this.newDifferentlyAbledWorker[index] = updatedData;
        }
      }
    });
  }

  viewDifAbledWorker(data: any) {
    this.dialog.open(AddDifAbledWorkersComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteDifAbledWorker(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisDifAbledWorker(data.id).subscribe({
        next: (result: any) => {
          this.filteredDifferentlyAbledWorkers = this.filteredDifferentlyAbledWorkers.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting differently abled workers');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredDifferentlyAbledWorkers.splice(index, 1);
      this.newDifferentlyAbledWorker.splice(index, 1);
    }
  }

  /* End of Differently Abled*/

  /* Title: Benefits */
  addEmployeeBenefits(data: any) {
    this.dialog.open(AddEmployeeBenefitsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newEmployeeBenefits.push(data)
        // this.filteredEmployeeBenefits.push(data)
      }
    })

  }
  ModifyEmployeeBenefits(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddEmployeeBenefitsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredEmployeeBenefits.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredEmployeeBenefits[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredEmployeeBenefits[index] = updatedData;
          this.newEmployeeBenefits[index] = updatedData;
        }
      }
    });
  }
  viewEmployeeBenefits(data: any) {
    this.dialog.open(AddEmployeeBenefitsComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteEmployeeBenefits(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisEmployeeBenefits(data.id).subscribe({
        next: (result: any) => {
          this.filteredEmployeeBenefits = this.filteredEmployeeBenefits.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Employee Benefits');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredEmployeeBenefits.splice(index, 1);
      this.newEmployeeBenefits.splice(index, 1);
    }
  }
  addWorkerBenefits(data: any) {
    this.dialog.open(AddWorkerBenefitsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newWorkerBenefits.push(data)
        // this.filteredWorkersBenefits.push(data)
      }
    })

  }
  ModifyWorkerBenefits(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddWorkerBenefitsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredWorkersBenefits.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredWorkersBenefits[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredWorkersBenefits[index] = updatedData;
          this.newWorkerBenefits[index] = updatedData;
        }
      }
    });
  }
  viewWorkerBenefits(data: any) {
    this.dialog.open(AddWorkerBenefitsComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteWorkerBenefits(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisWorkersBenefits(data.id).subscribe({
        next: (result: any) => {
          this.filteredWorkersBenefits = this.filteredWorkersBenefits.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Worker benefits');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredWorkersBenefits.splice(index, 1);
      this.newWorkerBenefits.splice(index, 1);
    }
  }
  submitBenefits(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);

    const formData = new FormData();
    if (this.newEmployeeBenefits) {
      formData.append('new_employee_benefits', JSON.stringify(this.newEmployeeBenefits))
    }
    if (this.newWorkerBenefits) {
      formData.append('new_worker_benefits', JSON.stringify(this.newWorkerBenefits))
    }
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));

    this.esgService.createSocDisTitleBenefits(formData).subscribe({
      next: (result: any) => {
        this.filteredEmployeeBenefits = result[0].data.allNewEmployeeBenefits
        this.filteredWorkersBenefits = result[0].data.allNewWorkerBenefits
      },
      error: (err: any) => {
        console.error('Error in submission:', err);
      },
      complete: () => {
        Swal.close()
        this.newWorkerBenefits = [];
        this.newEmployeeBenefits = [];

        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Benefits Added',
        });
      }
    });
  }
  /* End of Benefits*/

  /* Title: Retirement Benefits */
  addEmployeeRetirementBenefits(data: any) {
    this.dialog.open(AddEmployeeRetirementBenefitsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newEmployeeRetirementBenefits.push(data)
        // this.filteredEmployeeRetirementBenefits.push(data)
      }
    })

  }
  ModifyEmployeeRetirementBenefits(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddEmployeeRetirementBenefitsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredEmployeeRetirementBenefits.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredEmployeeRetirementBenefits[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredEmployeeRetirementBenefits[index] = updatedData;
          this.newEmployeeRetirementBenefits[index] = updatedData;
        }
      }
    });
  }
  viewEmployeeRetirementBenefits(data: any) {
    this.dialog.open(AddEmployeeRetirementBenefitsComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteEmployeeRetirementBenefits(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisEmployeeRetirementBenefits(data.id).subscribe({
        next: (result: any) => {
          this.filteredEmployeeRetirementBenefits = this.filteredEmployeeRetirementBenefits.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting employee retirement benefits');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredEmployeeRetirementBenefits.splice(index, 1);
      this.newEmployeeRetirementBenefits.splice(index, 1);
    }
  }
  addWorkerRetirementBenefits(data: any) {
    this.dialog.open(AddWorkerRetirementBenefitsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newWorkerRetirementBenefits.push(data)
        // this.filteredWorkersRetirementBenefits.push(data)
      }
    })

  }
  ModifyWorkerRetirementBenefits(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddWorkerRetirementBenefitsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredWorkersRetirementBenefits.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredWorkersRetirementBenefits[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredWorkersRetirementBenefits[index] = updatedData;
          this.newWorkerRetirementBenefits[index] = updatedData;
        }
      }
    });
  }
  viewWorkerRetirementBenefits(data: any) {
    this.dialog.open(AddWorkerRetirementBenefitsComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteWorkerRetirementBenefits(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisWorkersRetirementBenefits(data.id).subscribe({
        next: (result: any) => {
          this.filteredWorkersRetirementBenefits = this.filteredWorkersRetirementBenefits.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting worker retirement benefits');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredWorkersRetirementBenefits.splice(index, 1);
      this.newWorkerRetirementBenefits.splice(index, 1);
    }
  }
  submitRetirementBenefits(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);

    const formData = new FormData();
    if (this.newEmployeeRetirementBenefits) {
      formData.append('new_employee_retirement_benefits', JSON.stringify(this.newEmployeeRetirementBenefits))
    }
    if (this.newWorkerRetirementBenefits) {
      formData.append('new_worker_retirement_benefits', JSON.stringify(this.newWorkerRetirementBenefits))
    }
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));

    this.esgService.createSocDisTitleRetirementBenefits(formData).subscribe({
      next: (result: any) => {
        this.filteredEmployeeRetirementBenefits = result[0].data.allNewEmployeeRetirementBenefits
        this.filteredWorkersRetirementBenefits = result[0].data.allNewWorkerRetirementBenefits
      },
      error: (err: any) => {
        console.error('Error in submission:', err);
      },
      complete: () => {
        Swal.close()
        this.newWorkerRetirementBenefits = [];
        this.newEmployeeRetirementBenefits = [];

        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Retirement Benefits Added',
        });
      }
    });
  }

  /* End of RetirementBenefits*/

  /* Title: Remuneration, Salary and Wages */
  addRemunerationSalaryWage(data: any) {
    this.dialog.open(AddRemunerationSalaryWagesComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newRemunerationSalaryWage.push(data)
        // this.filteredRemunerationSalaryWage.push(data)
      }
    })
  }
  ModifyRemunerationSalaryWage(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddRemunerationSalaryWagesComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredRemunerationSalaryWage.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredRemunerationSalaryWage[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredRemunerationSalaryWage[index] = updatedData;
          this.newRemunerationSalaryWage[index] = updatedData;
        }
      }
    });
  }
  viewRemunerationSalaryWage(data: any) {
    this.dialog.open(AddRemunerationSalaryWagesComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteRemunerationSalaryWage(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleRemunerationSalaryWages(data.id).subscribe({
        next: (result: any) => {
          this.filteredRemunerationSalaryWage = this.filteredRemunerationSalaryWage.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Renumeration Salary Wages');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredRemunerationSalaryWage.splice(index, 1);
      this.newRemunerationSalaryWage.splice(index, 1);
    }
  }
  submitRemunerationSalaryWage(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('remuneration_salary_wage', JSON.stringify(this.newRemunerationSalaryWage));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleRemunerationSalaryWages(formData).subscribe({
      next: (result: any) => {
        this.filteredRemunerationSalaryWage = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredRemunerationSalaryWage.push(...result[0].data);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        this.newRemunerationSalaryWage = [];
        Swal.fire({
          icon: 'success',
          title: 'Remuneration Salary Wage Saved'
        });
      }
    });

  }

  /* End of RetirementBenefits*/

  /* Title: Average Training Hours */
  addAverageTrainingHours(data: any) {
    this.dialog.open(AddAverageTrainingHoursComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newAverageTrainingHours.push(data)
        // this.filteredAverageTrainingHours.push(data)
      }
    })
  }
  ModifyAverageTrainingHours(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddAverageTrainingHoursComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredAverageTrainingHours.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredAverageTrainingHours[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredAverageTrainingHours[index] = updatedData;
          this.newAverageTrainingHours[index] = updatedData;
        }
      }
    });
  }
  viewAverageTrainingHours(data: any) {
    this.dialog.open(AddAverageTrainingHoursComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteAverageTrainingHours(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleAverageTrainingHours(data.id).subscribe({
        next: (result: any) => {
          this.filteredAverageTrainingHours = this.filteredAverageTrainingHours.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Average Training hours');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredAverageTrainingHours.splice(index, 1);
      this.newAverageTrainingHours.splice(index, 1);
    }
  }
  submitAverageTrainingHours(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('average_training_hours', JSON.stringify(this.newAverageTrainingHours));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleAverageTrainingHours(formData).subscribe({
      next: (result: any) => {
        this.filteredAverageTrainingHours = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredAverageTrainingHours.push(...result[0].data);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        this.newAverageTrainingHours = [];
        Swal.fire({
          icon: 'success',
          title: 'Average Training Hours Saved'
        });
      }
    });

  }

  /* End of Average Training Hours*/

  /* Title: Employee Diversity */
  addEmployeeDiversity(data: any) {
    this.dialog.open(AddEmployeeDiversityComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newEmployeeDiversity.push(data)
        // this.filteredEmployeeDiversity.push(data)
      }
    })
  }
  ModifyEmployeeDiversity(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddEmployeeDiversityComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredEmployeeDiversity.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredEmployeeDiversity[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredEmployeeDiversity[index] = updatedData;
          this.newEmployeeDiversity[index] = updatedData;
        }
      }
    });
  }
  viewEmployeeDiversity(data: any) {
    this.dialog.open(AddEmployeeDiversityComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteEmployeeDiversity(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleEmployeeDiversity(data.id).subscribe({
        next: (result: any) => {
          this.filteredEmployeeDiversity = this.filteredEmployeeDiversity.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Employee Diversity');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredEmployeeDiversity.splice(index, 1);
      this.newEmployeeDiversity.splice(index, 1);
    }
  }
  submitEmployeeDiversity(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('employee_diversity', JSON.stringify(this.newEmployeeDiversity));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleEmployeeDiversity(formData).subscribe({
      next: (result: any) => {
        this.filteredEmployeeDiversity = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredEmployeeDiversity.push(...result[0].data);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        this.newEmployeeDiversity = [];
        Swal.fire({
          icon: 'success',
          title: 'Employee Diversity Saved'
        });
      }
    });

  }

  /* End of Employee Diversity*/

  /* Title: Non-Discrimination */
  addNonDiscrimination(data: any) {
    this.dialog.open(AddNonDiscriminationComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newNonDiscrimination.push(data)
        // this.filteredNonDiscrimination.push(data)
      }
    })
  }
  ModifyNonDiscrimination(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddNonDiscriminationComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredNonDiscrimination.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredNonDiscrimination[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredNonDiscrimination[index] = updatedData;
          this.newNonDiscrimination[index] = updatedData;
        }
      }
    });
  }
  viewNonDiscrimination(data: any) {
    this.dialog.open(AddNonDiscriminationComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteNonDiscrimination(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleNonDiscrimination(data.id).subscribe({
        next: (result: any) => {
          this.filteredNonDiscrimination = this.filteredNonDiscrimination.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting NonDiscrimination');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredNonDiscrimination.splice(index, 1);
      this.newNonDiscrimination.splice(index, 1);
    }
  }
  submitNonDiscrimination(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('non_discrimination', JSON.stringify(this.newNonDiscrimination));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleNonDiscrimination(formData).subscribe({
      next: (result: any) => {
        this.filteredNonDiscrimination = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredNonDiscrimination.push(...result[0].data);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        this.newNonDiscrimination = [];
        Swal.fire({
          icon: 'success',
          title: 'Non-Discrimination Saved'
        });
      }
    });

  }

  /* End of Non-Discrimination */

  /* Title: Rights of Indigenous People */
  addRightsOfIndPeople(data: any) {
    this.dialog.open(AddRightsOfIndigenousPeopleComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newRightsOfIndPeople.push(data)
        // this.filteredRightsOfIndPeople.push(data)
      }
    })
  }
  ModifyRightsOfIndPeople(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddRightsOfIndigenousPeopleComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredRightsOfIndPeople.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredRightsOfIndPeople[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredRightsOfIndPeople[index] = updatedData;
          this.newRightsOfIndPeople[index] = updatedData;
        }
      }
    });
  }
  viewRightsOfIndPeople(data: any) {
    this.dialog.open(AddRightsOfIndigenousPeopleComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteRightsOfIndPeople(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleRightsOfIndPeople(data.id).subscribe({
        next: (result: any) => {
          this.filteredRightsOfIndPeople = this.filteredRightsOfIndPeople.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Rights Of Indigenous People');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredRightsOfIndPeople.splice(index, 1);
      this.newRightsOfIndPeople.splice(index, 1);
    }
  }
  submitRightsOfIndPeople(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('rights_of_indigenous_people', JSON.stringify(this.newRightsOfIndPeople));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleRightsOfIndPeople(formData).subscribe({
      next: (result: any) => {
        this.filteredRightsOfIndPeople = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredRightsOfIndPeople.push(...result[0].data);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        this.newRightsOfIndPeople = [];
        Swal.fire({
          icon: 'success',
          title: 'Rights of Indigenous People Added'
        });
      }
    });

  }

  /* End of Rights of Indigenous People*/
  /*Title:Close Calls and High-Potential Work-Related Incidents*/
  ModifyCloseCalls(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddCloseCallsAndHighPotentialIncidentsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredCloseCalls.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredCloseCalls[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredCloseCalls[index] = updatedData;
          this.newClosecalls[index] = updatedData;
        }
      }
    });
  }
  viewCloseCalls(data: any) {
    this.dialog.open(AddCloseCallsAndHighPotentialIncidentsComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteCloseCalls(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleCloseCalls(data.id).subscribe({
        next: (result: any) => {
          this.filteredCloseCalls = this.filteredCloseCalls.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Close calls');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredCloseCalls.splice(index, 1);
      this.newClosecalls.splice(index, 1);
    }
  }
  addClosecalls(data: any) {
    this.dialog.open(AddCloseCallsAndHighPotentialIncidentsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newClosecalls.push(data)
        // this.filteredCloseCalls.push(data)
      }
    })
  }
  submitClosecalls(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('close_calls', JSON.stringify(this.newClosecalls));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleCloseCalls(formData).subscribe({
      next: (result: any) => {
        this.filteredCloseCalls = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredCloseCalls.push(...result[0].data);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        this.newClosecalls = [];
        Swal.fire({
          icon: 'success',
          title: 'Close Calls and High-Potential Work-Related Incidents Saved'
        });
      }
    });

  }
  /* End of Close Calls and High-Potential Work-Related Incidents*/
  /*Title:Human Rights Assessments*/
  addHumanRightsAssessments(data: any) {
    this.dialog.open(AddHumanRightsAssessmentsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newHumanRightsAssessment.push(data)
        // this.filteredHumanRightsAssessment.push(data)
      }
    })
  }
  ModifyHumanRightsAssessments(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddHumanRightsAssessmentsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredHumanRightsAssessment.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredHumanRightsAssessment[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredHumanRightsAssessment[index] = updatedData;
          this.newHumanRightsAssessment[index] = updatedData;
        }
      }
    });
  }
  viewHumanRightsAssessments(data: any) {
    this.dialog.open(AddHumanRightsAssessmentsComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteHumanRightsAssessments(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleHumanRightsAssessment(data.id).subscribe({
        next: (result: any) => {
          this.filteredHumanRightsAssessment = this.filteredHumanRightsAssessment.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Human Rights Assessment');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredHumanRightsAssessment.splice(index, 1);
      this.newHumanRightsAssessment.splice(index, 1);
    }
  }
  submitHumanRightsAssessments(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('human_rights_assessment', JSON.stringify(this.newHumanRightsAssessment));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleHumanRightsAssessment(formData).subscribe({
      next: (result: any) => {
        this.filteredHumanRightsAssessment = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredHumanRightsAssessment.push(...result[0].data);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        this.newHumanRightsAssessment = [];
        Swal.fire({
          icon: 'success',
          title: 'Human Rights Assessments People Saved'
        });
      }
    });

  }

  /* End of Human Rights Assessments*/
  /*Title:Total number of value chain partners*/
  addChainpartnersHumanRightsAssessments(data: any) {
    this.dialog.open(AddHumanRightsAssessmentsChainPartnersComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newChainPartenerHumanRightsAssessment.push(data)
        // this.filteredChainPartnerHumanRightsAssessment.push(data)
      }
    })
  }
  ModifyChainpartnersHumanRightsAssessments(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddHumanRightsAssessmentsChainPartnersComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredChainPartnerHumanRightsAssessment.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredChainPartnerHumanRightsAssessment[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredChainPartnerHumanRightsAssessment[index] = updatedData;
          this.newChainPartenerHumanRightsAssessment[index] = updatedData;
        }
      }
    });
  }
  submitChainpartnersHumanRightsAssessments(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('human_rights_assessment_chain_partners', JSON.stringify(this.newChainPartenerHumanRightsAssessment));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleHumanRightsAssessmentChainPartners(formData).subscribe({
      next: (result: any) => {
        this.filteredChainPartnerHumanRightsAssessment = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredChainPartnerHumanRightsAssessment.push(...result[0].data);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        this.newChainPartenerHumanRightsAssessment = [];
        Swal.fire({
          icon: 'success',
          title: 'Human Rights Assessments of Value Chain Partners People Saved'
        });
      }
    });

  }

  viewChainpartnersHumanRightsAssessments(data: any) {
    this.dialog.open(AddHumanRightsAssessmentsChainPartnersComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteChainpartnersHumanRightsAssessments(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleHumanRightsAssessmentChainPartners(data.id).subscribe({
        next: (result: any) => {
          this.filteredChainPartnerHumanRightsAssessment = this.filteredChainPartnerHumanRightsAssessment.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting employee Hires');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredChainPartnerHumanRightsAssessment.splice(index, 1);
      this.newChainPartenerHumanRightsAssessment.splice(index, 1);
    }
  }
  /*End of Title:Total number of value chain partners*/
  /*Title:Product Recalls*/
  addProductRecalls(data: any) {
    this.dialog.open(AddProductRecallsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newProductRecalls.push(data)
        // this.filteredProductRecalls.push(data)
      }
    })
  }
  ModifyProductRecalls(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddProductRecallsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredProductRecalls.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredProductRecalls[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredProductRecalls[index] = updatedData;
          this.newProductRecalls[index] = updatedData;
        }
      }
    });
  }
  viewProductRecalls(data: any) {
    this.dialog.open(AddProductRecallsComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteProductRecalls(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleProductRecalls(data.id).subscribe({
        next: (result: any) => {
          this.filteredProductRecalls = this.filteredProductRecalls.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Product recalls');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredProductRecalls.splice(index, 1);
      this.newProductRecalls.splice(index, 1);
    }
  }
  submitProductRecalls(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('product_recalls', JSON.stringify(this.newProductRecalls));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleProductRecalls(formData).subscribe({
      next: (result: any) => {
        this.filteredProductRecalls = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredProductRecalls.push(...result[0].data);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        this.newProductRecalls = [];
        Swal.fire({
          icon: 'success',
          title: 'Product Recalls Saved'
        });
      }
    });

  }

  /*Title:End of Product Recalls*/
  /*Title:Consumer Complaints*/
  addConsumerComplaints(data: any) {
    this.dialog.open(AddConsumerComplaintsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newConsumerComplaints.push(data)
        // this.filteredConsumerComplaints.push(data)
      }
    })
  }
  submitConsumerComplaints(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('consumer_complaints', JSON.stringify(this.newConsumerComplaints));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleConsumerComplaints(formData).subscribe({
      next: (result: any) => {
        this.filteredConsumerComplaints = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredConsumerComplaints.push(...result[0].data);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        this.newConsumerComplaints = [];
        Swal.fire({
          icon: 'success',
          title: 'Consumer Complaints  Saved'
        });
      }
    });

  }

  ModifyConsumerComplaints(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddConsumerComplaintsComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredConsumerComplaints.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredConsumerComplaints[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          // this.filteredConsumerComplaints[index] = updatedData;
          this.newConsumerComplaints[index] = updatedData;
        }
      }
    });
  }
  viewConsumerComplaints(data: any) {
    this.dialog.open(AddConsumerComplaintsComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteConsumerComplaints(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleConsumerComplaints(data.id).subscribe({
        next: (result: any) => {
          this.filteredConsumerComplaints = this.filteredConsumerComplaints.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Consumer Complaints');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredConsumerComplaints.splice(index, 1);
      this.newConsumerComplaints.splice(index, 1);
    }
  }
  /*End of Consumer Complaints*/
  /*Title:Breaches of Customer Privacy and Losses of Customer Data*/
  addBreaches(data: any) {
    this.dialog.open(AddBreachesOfCustomerPrivacyLossOfDataComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, userID: this.userID } }).afterClosed().subscribe(data => {
      if (data) {
        this.newBreaches.push(data)
        // this.filteredBreaches.push(data)
      }
    })
  }
  ModifyBreaches(data: any, title_ref_id: any, index?: number) {
    this.dialog.open(AddBreachesOfCustomerPrivacyLossOfDataComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        title_ref_id: title_ref_id,
        mode: 'modify',
        refID: this.refID
      }
    }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredBreaches.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredBreaches[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.filteredBreaches[index] = updatedData;
          this.newBreaches[index] = updatedData
        }
      }
    });
  }
  viewBreaches(data: any) {
    this.dialog.open(AddBreachesOfCustomerPrivacyLossOfDataComponent, {
      width: "740px", data: {
        lov: this.lov,
        data: data,
        mode: 'view',
        refID: this.refID

      }
    }).afterClosed().subscribe(data => {

    })
  }
  deleteBreaches(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteSocDisTitleBreaches(data.id).subscribe({
        next: (result: any) => {
          this.filteredBreaches = this.filteredBreaches.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Breaches');
        },
        complete: () => {
          Swal.close()
        }
      });
    } else {
      // this.filteredBreaches.splice(index, 1);
      this.newBreaches.splice(index, 1);
    }
  }
  submitBreaches(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('breaches', JSON.stringify(this.newBreaches));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleBreaches(formData).subscribe({
      next: (result: any) => {
        this.filteredBreaches = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredBreaches.push(...result[0].data);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        this.newBreaches = [];
        Swal.fire({
          icon: 'success',
          title: 'Breaches of Customer Privacy and Losses of Customer Data Saved'
        });
      }
    });

  }

  /*End Breaches of Customer Privacy and Losses of Customer Data*/
  /*Title : Employee Association(s) or Union*/
  submitUnion(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('union', JSON.stringify(this.employeeUnionForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleEmployeeUnion(formData).subscribe({
      next: (result: any) => {
        this.employeeUnion = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Employee Association(s) or Union Data Saved'
        });
      }
    });

  }
  /*End Employee Association(s) or Union*/
  /*Title :Political Contributions*/
  submitPoliticalContribution(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('political_contribution', JSON.stringify(this.politicalContributionForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSoctitlePoliticalContribution(formData).subscribe({
      next: (result: any) => {
        this.politicalContribution = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Political Contributions Saved'
        });
      }
    });

  }
  /*End Political Contributions*/
  /*Title :CSR Projects*/
  submitCSRProject(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('csr_project', JSON.stringify(this.CSRProjectForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSoctitleCSRProjects(formData).subscribe({
      next: (result: any) => {
        this.CSRProject = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'CSR Projects Saved'
        });
      }
    });

  }
  /*End CSR Projects*/
  /*Title : Health and Safety Assessments of Value Chain Partners*/
  submitHSAssessValueChainPartners(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('hs_assessment_value_chain_partners', JSON.stringify(this.HSAssessValueChainPartnerForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocHSAssessmentvalueChainPartners(formData).subscribe({
      next: (result: any) => {
        this.HSAssessValueChainPartner = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Health and Safety Assessments of Value Chain Partners Saved'
        });
      }
    });

  }
  /*End Health and Safety Assessments of Value Chain Partners*/
  /*Title : Work- Related Ill Health*/
  submitWorkIllHealth(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('work_ill_health', JSON.stringify(this.workRelatedIllHealthForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleWorkIllHealth(formData).subscribe({
      next: (result: any) => {
        this.workRelatedIll = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Work- Related Ill Health Data Saved'
        });
      }
    });

  }
  /*End Work- Related Ill Health*/
  /*Title : Work-Related Injuries*/
  submitWorkInjury(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('work_related_injury', JSON.stringify(this.workInjuryForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleWorkRelatedinjury(formData).subscribe({
      next: (result: any) => {
        this.workRelatedInjury = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Work-Related Injuries Data Saved'
        });
      }
    });

  }
  /*End Work-Related Injuries*/
  /*Title : Negative Social Impacts in the Supply Chain*/
  submitNegSocImpacts(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('soc_negative_impacts', JSON.stringify(this.negativeSocImpactForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleNegSocialImpacts(formData).subscribe({
      next: (result: any) => {
        this.negSocImpacts = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Negative Social Impacts in the Supply Chain Data Saved'
        });
      }
    });

  }
  /*End of Negative Social Impacts in the Supply Chain*/
  /*Title : Marketing Communications*/
  submitMarketingCommmunication(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('marketing_communications', JSON.stringify(this.marketingComminicationForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleMarketingCommunications(formData).subscribe({
      next: (result: any) => {
        this.marketingCommunications = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Marketing Communications Data Saved'
        });
      }
    });

  }
  /*End of Marketing Communications*/
  /*Title : Product and Service Information and Labeling*/
  submitProductServiceLabeling(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('product_service_labeling', JSON.stringify(this.prdServiceInfoLabelForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleProductServiceLabeling(formData).subscribe({
      next: (result: any) => {
        this.productServiceInfoLabel = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Product and Service Information and Labeling Data Saved'
        });
      }
    });

  }
  /*End of Product and Service Information and Labeling*/
  /*Title : Customer Health and Safety*/
  submitCustomerHS(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('customer_health_safety', JSON.stringify(this.customerHSForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleCustomerHealthSafety(formData).subscribe({
      next: (result: any) => {
        this.customerHealthSafety = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Customer Health and Safety Data Saved'
        });
      }
    });

  }
  /*End of Customer Health and Safety*/
  /*Title : Security Personnel Trained in Human Rights Policies*/
  submitSecurityPersonalHRPolicy(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('security_personal_hr_training', JSON.stringify(this.SecurityPersonalHRPolicyForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleSecurityPersonalTraining(formData).subscribe({
      next: (result: any) => {
        this.SecurityPersonalHRPolicy = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Security Personnel Trained in Human Rights Policies Data Saved'
        });
      }
    });

  }
  /*End of Security Personnel Trained in Human Rights Policiesy*/
  /*Title : Occupational Health and Safety Management System*/
  submitOHSMngSystem(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('ohs_mng_sys', JSON.stringify(this.occHealthSafetyMngForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleOHSMngSystem(formData).subscribe({
      next: (result: any) => {
        this.OHSMngSystem = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Occupational Health and Safety Management System Saved'
        });
      }
    });

  }
  /*End of Occupational Health and Safety Management System*/
  /*Title : Complaints related to Occupational Health and Safety Management System*/
  submitOHSMngSystemComplaints(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('ohs_mng_sys_complaints', JSON.stringify(this.complaintsOccHealthSafetyMngForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleOHSMngSystemComplaints(formData).subscribe({
      next: (result: any) => {
        this.OHSMngSystemComplaints = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Complaints related to Occupational Health and Safety Management System  Saved'
        });
      }
    });

  }
  /*End Of Complaints related to Occupational Health and Safety Management System*/
  /*Title : Training on Human Rights Issues and Policies*/
  submitHRTraining(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('training_on_human_rights_issues_policies', JSON.stringify(this.trainingOnHRIssuePolicyForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleHRTraining(formData).subscribe({
      next: (result: any) => {
        this.trainingOnHRIssuePolicy = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Training on Human Rights Issues and Policies  Saved'
        });
      }
    });

  }
  /*End Of Training on Human Rights Issues and Policies*/
  /*Title : Rehabilitation and Resettlement (R&R)*/
  submitRandR(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('R_and_R', JSON.stringify(this.RandRForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleRandR(formData).subscribe({
      next: (result: any) => {
        this.RandR = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Rehabilitation and Resettlement (R&R)  Saved'
        });
      }
    });

  }
  /*End Of Rehabilitation and Resettlement (R&R)*/
  /*Title : Assessment of Products and Services*/
  submitProductServiceAssessment(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('product_service_assessment', JSON.stringify(this.productServiceAssesmentForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleProductServiceAssessment(formData).subscribe({
      next: (result: any) => {
        this.productServiceAssessment = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Assessment of Products and Services  Saved'
        });
      }
    });

  }
  /*End Of Assessment of Products and Services*/
  /*Title : Social Impact Assessments (SIA) of Projects*/
  submitSIAProject(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('SIA_Project', JSON.stringify(this.SIAProjectForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleSIAProject(formData).subscribe({
      next: (result: any) => {
        this.SIAProject = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Social Impact Assessments (SIA) of Projects  Saved'
        });
      }
    });

  }
  /*End OfSocial Impact Assessments (SIA) of Projects*/
  /*Title :Working Hours*/
  submitWorkingHours(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('working_hours', JSON.stringify(this.workingHoursForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleWorkingHours(formData).subscribe({
      next: (result: any) => {
        this.workingHours = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Working Hours  Saved'
        });
      }
    });

  }
  /*End Of Working Hours*/
  /*Title :Complaints On Human Rights Violations*/
  newTypeOfHumanRightsViolation() {
    this.dialog.open(NewTypeHrViolationsComponent, { width: "500px", data: { userID: this.userID, lov: this.lov, mode: 'create' } }).afterClosed().subscribe((data: any) => {
      if (data) {
        this.lov[21].value.push(data)
        this.ComplaintsOnHRForm.controls['type_of_violation'].setValue(data.value)

        const statusText = "Type of ODS created.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }

    })
  }
  deleteTypeofHumanRightsViolation(data: any) {
    this.showProgressPopup();
    const currentTypeofHumanRightsViolationValue = this.ComplaintsOnHRForm.controls['type_of_violation'].value;
    this.esgService.deleteTypeofHRViolation(data.id).subscribe({
      next: (result: any) => {
        this.lov[21].value = this.lov[21].value.filter((item: { id: any; }) => item.id !== data.id);
      },
      error: () => {
        console.error('Error deleting Type Of Type Of ODS');
      },
      complete: () => {
        Swal.close();
        if (currentTypeofHumanRightsViolationValue === data.value) {
        } else {
          this.ComplaintsOnHRForm.controls['type_of_violation'].setValue(currentTypeofHumanRightsViolationValue);
        }
      }
    });
  }
  modifyTypeofHumanRightsViolation(data: any) {
    this.dialog.open(NewTypeHrViolationsComponent, {
      width: "500px",
      data: { userID: this.userID, mode: 'modify', data: data }
    }).afterClosed().subscribe((updatedData: any) => {

      if (updatedData?.id) {
        const index = this.lov[21].value.findIndex((item: any) => {
          return item.id === updatedData.id;
        });

        if (index !== -1) {
          this.lov[21].value[index] = updatedData;
        } else {
          console.warn("Type of ODS ID not found in the list.");
        }
        this.ComplaintsOnHRForm.controls['type_of_violation'].setValue(updatedData.value);
      } else {
        console.error('Invalid data: Missing Type of ODS ID.');
      }
    });
  }
  submitComplaintsOnHR(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('complaints_on_hr_violation', JSON.stringify(this.ComplaintsOnHRForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleSecurityComplaintsOnHRViolations(formData).subscribe({
      next: (result: any) => {
        this.ComplaintsOnHR = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Complaints On Human Rights Violations  Saved'
        });
      }
    });

  }
  /*End Of Complaints On Human Rights Violations*/
  /*Title :Health and Safety Assessments*/
  submitHSAssessments(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('hs_assessments', JSON.stringify(this.healthSafetyAssessmentForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleHealthSafetyAssessment(formData).subscribe({
      next: (result: any) => {
        this.HSAssessment = result[0].data

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Health and Safety Assessments  Saved'
        });
      }
    });

  }
  /*End Of Health and Safety Assessments*/
  /*Title :Workers other than Employees Details*/
  submitWorkersOtherThanEmployees(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    const formData = new FormData();
    formData.append('other_workers', JSON.stringify(this.workersOtherthanEmployeesForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleWorkersOtherThanEmployees(formData).subscribe({
      next: (result: any) => {
        this.workersotherThanEmployees = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Workers other than Employees Details  Saved'
        });
      }
    });

  }
  /*End Of Workers other than Employees Details*/
  /*Title : Supplier Social Assessment*/
  submitSupplierSocAssessment(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    const formData = new FormData();
    formData.append('supplier_soc_assessment', JSON.stringify(this.supplierSocAssessmentForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleSupplierSocAssessment(formData).subscribe({
      next: (result: any) => {
        this.supplierSocAssessment = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Supplier Social Assessment Data Saved'
        });
      }
    });

  }
  /*End Supplier Social Assessment*/
  /*Title : Parental Leave for Employees/Workers*/
  submitParentalLeave(status: any, title: any) {
    this.showProgressPopup()
    this.socialDisclosureForm.controls['esg_social_disclosure'].setValue(this.currentTitles[0].esg_social_disclosure);
    this.socialDisclosureForm.controls['title'].setValue(title.tile)
    const formData = new FormData();
    formData.append('parental_leave', JSON.stringify(this.parentalLeaveForm.value));
    this.socialDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.socialDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.socialDisclosureForm.value));
    this.esgService.createSocDisTitleParentalLeave(formData).subscribe({
      next: (result: any) => {
        this.parentalLeave = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Parental Leave for Employees/Workers Saved'
        });
      }
    });

  }
  /*End Employee Association(s) or Union*/
  // Update Theme status:Diversity and Equal Opportunity
  updateThemeDiversityAndEqualOppStatus(status: any, theme: any) {
    this.showProgressPopup()
    const formData = new FormData();
    formData.append('theme_diversity_and_equal_opportunity_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGSocDisStatus(formData).subscribe({
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
          title: status === 'Submitted for Review' ? 'Diversity and Equal Opportunity Submitted for Review' :
            status === 'Open' ? 'Diversity and Equal Opportunity  Re-Opened' :
              status === 'Submitted for Approval' ? 'Diversity and Equal Opportunity  Submitted for Approval' :
                status === 'Review Failed' ? 'Diversity and Equal Opportunity  Review Failed' :
                  status === 'Approved' ? 'Diversity and Equal Opportunity  Approved' :
                    status === 'Rejected' ? 'Diversity and Equal Opportunity  Rejected' : ''
        });

      }
    });
  }
  // Update Theme status:Employees
  updateThemeEmployeesStatus(status: any, theme: any) {
    this.showProgressPopup()
    const formData = new FormData();
    formData.append('theme_employees_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGSocDisStatus(formData).subscribe({
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
          title: status === 'Submitted for Review' ? 'Employees Submitted for Review' :
            status === 'Submitted for Approval' ? 'Employees  Submitted for Approval' :
              status === 'Open' ? 'Employees  Re-Opened' :
                status === 'Review Failed' ? 'Employees  Review Failed' :
                  status === 'Approved' ? 'Employees  Approved' :
                    status === 'Rejected' ? 'Employees  Rejected' : ''
        });

      }
    });
  }
  // Update Theme status:Human Resource and Development
  updateThemeHumanResourceDevelopmentStatus(status: any, theme: any) {
    this.showProgressPopup()
    const formData = new FormData();
    formData.append('theme_human_resource_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGSocDisStatus(formData).subscribe({
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
          title: status === 'Submitted for Review' ? 'Human Resource and Development Submitted for Review' :
            status === 'Open' ? 'Human Resource and Development  Re-Opened' :
              status === 'Submitted for Approval' ? 'Human Resource and Development  Submitted for Approval' :
                status === 'Review Failed' ? 'Human Resource and Development  Review Failed' :
                  status === 'Approved' ? 'Human Resource and Development  Approved' :
                    status === 'Rejected' ? 'Human Resource and Development  Rejected' : ''
        });

      }
    });
  }
  // Update Theme status:Human Resource and Development
  updateThemeTrainingEducationStatus(status: any, theme: any) {
    this.showProgressPopup()
    const formData = new FormData();
    formData.append('theme_training_and_education_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGSocDisStatus(formData).subscribe({
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
          title: status === 'Submitted for Review' ? 'Training and Education Submitted for Review' :
            status === 'Open' ? 'Training and Education  Re-Opened' :
              status === 'Submitted for Approval' ? 'Training and Education  Submitted for Approval' :
                status === 'Review Failed' ? 'Training and Education  Review Failed' :
                  status === 'Approved' ? 'Training and Education  Approved' :
                    status === 'Rejected' ? 'Training and Education  Rejected' : ''
        });

      }
    });
  }
  // Update Theme status:Occupational Health and Safety
  updateThemeOccupationalHealthSafetyStatus(status: any, theme: any) {
    this.showProgressPopup()
    const formData = new FormData();
    formData.append('theme_health_and_safety_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGSocDisStatus(formData).subscribe({
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
          title: status === 'Submitted for Review' ? 'Occupational Health and Safety Submitted for Review' :
            status === 'Open' ? 'Occupational Health and Safety  Re-Opened' :
              status === 'Submitted for Approval' ? 'Occupational Health and Safety  Submitted for Approval' :
                status === 'Review Failed' ? 'Occupational Health and Safety  Review Failed' :
                  status === 'Approved' ? 'Occupational Health and Safety  Approved' :
                    status === 'Rejected' ? 'Occupational Health and Safety  Rejected' : ''
        });

      }
    });
  }
  // Update Theme status:Local Communities
  updateThemeLocalCommunitiesStatus(status: any, theme: any) {
    this.showProgressPopup()
    const formData = new FormData();
    formData.append('theme_local_community_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGSocDisStatus(formData).subscribe({
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
          title: status === 'Submitted for Review' ? 'Local Communities Submitted for Review' :
            status === 'Open' ? 'Local Communities  Re-Opened' :
              status === 'Submitted for Approval' ? 'Local Communities  Submitted for Approval' :
                status === 'Review Failed' ? 'Local Communities  Review Failed' :
                  status === 'Approved' ? 'Local Communities  Approved' :
                    status === 'Rejected' ? 'Local Communities  Rejected' : ''
        });

      }
    });
  }
  // Update Theme status:Human Rights
  updateThemeHumanRightsStatus(status: any, theme: any) {
    this.showProgressPopup()
    const formData = new FormData();
    formData.append('theme_human_rights_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGSocDisStatus(formData).subscribe({
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
          title: status === 'Submitted for Review' ? 'Human Rights Submitted for Review' :
            status === 'Open' ? 'Human Rights Re-Opened' :
              status === 'Submitted for Approval' ? 'Human Rights  Submitted for Approval' :
                status === 'Review Failed' ? 'Human Rights  Review Failed' :
                  status === 'Approved' ? 'Human Rights  Approved' :
                    status === 'Rejected' ? 'Human Rights  Rejected' : ''
        });

      }
    });
  }
  // Update Theme status:Product Service Accountability
  updateThemeProductServiceAccountabilityStatus(status: any, theme: any) {
    this.showProgressPopup()
    const formData = new FormData();
    formData.append('theme_product_service_accountability_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGSocDisStatus(formData).subscribe({
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
          title: status === 'Submitted for Review' ? 'Product Service Accountability Submitted for Review' :
            status === 'Open' ? 'Product Service Accountability  Re-Opened' :
              status === 'Submitted for Approval' ? 'Product Service Accountability  Submitted for Approval' :
                status === 'Review Failed' ? 'Product Service Accountability  Review Failed' :
                  status === 'Approved' ? 'Product Service Accountability  Approved' :
                    status === 'Rejected' ? 'Product Service Accountability  Rejected' : ''
        });

      }
    });
  }
  // Update Theme status:Social Supply Chain Management
  updateThemeSocialSupplyChainManagementStatus(status: any, theme: any) {
    this.showProgressPopup()
    const formData = new FormData();
    formData.append('theme_soc_supply_chain_mng_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGSocDisStatus(formData).subscribe({
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
          title: status === 'Submitted for Review' ? 'Social Supply Chain Management Submitted for Review' :
            status === 'Open' ? 'Social Supply Chain Management  Re-Opened' :
              status === 'Submitted for Approval' ? 'Social Supply Chain Management  Submitted for Approval' :
                status === 'Review Failed' ? 'Social Supply Chain Management  Review Failed' :
                  status === 'Approved' ? 'Social Supply Chain Management  Approved' :
                    status === 'Rejected' ? 'Social Supply Chain Management  Rejected' : ''
        });

      }
    });
  }
  // Update Theme status:Public Policy
  updateThemePublicPolicyStatus(status: any, theme: any) {
    this.showProgressPopup()
    const formData = new FormData();
    formData.append('theme_public_policy_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGSocDisStatus(formData).subscribe({
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
          title: status === 'Submitted for Review' ? 'Public Policy Submitted for Review' :
            status === 'Open' ? 'Public Policy  Re-Opened' :
              status === 'Submitted for Approval' ? 'Public Policy  Submitted for Approval' :
                status === 'Review Failed' ? 'Public Policy  Review Failed' :
                  status === 'Approved' ? 'Public Policy  Approved' :
                    status === 'Rejected' ? 'Public Policy  Rejected' : ''
        });

      }
    });
  }
  // Update Theme status:Workers other than Employees
  updateThemeWorkersotherthanEmployeesStatus(status: any, theme: any) {
    this.showProgressPopup()
    const formData = new FormData();
    formData.append('theme_workers_other_than_employees_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGSocDisStatus(formData).subscribe({
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
          title: status === 'Submitted for Review' ? 'Workers Other Than Employees Submitted for Review' :
            status === 'Open' ? 'Workers Other Than Employees  Re-Opened' :
              status === 'Submitted for Approval' ? 'Workers Other Than Employees  Submitted for Approval' :
                status === 'Review Failed' ? 'Workers Other Than Employees  Review Failed' :
                  status === 'Approved' ? 'Workers Other Than Employees  Approved' :
                    status === 'Rejected' ? 'Workers Other Than Employees  Rejected' : ''
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

    this.esgService.updateESGSocDisAllThemeStatus(formData).subscribe({
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
