import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})

export class AppService {

    constructor() { }

    public static base_url = environment.client_backend
    public static authentication = "/api/auth/local"
    public static app_config = '/api/configuration'
    public static wheather = environment.wheather
    public static forget_password = '/api/forget-passwords'
    public static reset_password = '/api/reset-passwords'
    public static me = '/api/users/me'
    public static profile = '/api/user-profiles'
    public static profile_images = '/api/profile-images'
    public static activity_stream = '/api/activity-streams'
    public static subscription = '/api/subscriptions'
    public static user_log = '/api/user-logs'
    public static notification = '/api/notifications'
    public static upload = '/api/upload/'
    public static report = environment.report_api
    public static dropdown_values = '/api/dropdown-values'
    public static department = "/api/departments"
    public static sub_department = "/api/sub-departments"
    public static employees = "/api/employees"
    public static designation = "/api/designations"
    public static function = "/api/functions"
    public static country = "/api/countries"
    public static state = "/api/states"
    public static facility = "/api/facilities"
    public static open_ai = "/api/open-ais"
    public static authentication_otp = '/api/authentication-otps'
    public static verify_respondent_otp = '/api/verify-respondent/validate-otp'
    public static survey_respondent_otp = '/api/verify-respondent/verify-respondent'
    public static diseases = '/api/diseases'

    //hazard & risk
    public static ehs = '/api/ehsses'
    public static ehs_evidence = '/api/ehs-evidences'
    public static division = '/api/divisions'
    public static observation = '/api/ehs-observations'
    public static ehs_multiple_evidence = '/api/ehss-multiple-evidences'

    //satisfaction survey 
    public static survey_question = '/api/survey-questions'
    public static ques_image = '/api/question-images'
    public static satisfaction_survey = '/api/satisfaction-surveys'
    public static survey_participants = '/api/survey-participants'
    public static survey_tags = '/api/question-tags'
    // public static languages = '/api/languages'
    public static languages = '/api/i18n/locales'
    public static localizations = 'localizations'
    public static survey_responses = '/api/survey-responses'
    public static survey_categories = '/api/survey-categories'
    public static survey_question_categories = '/api/survey-question-categories'
    public static survey_purposes = '/api/survey-purposes'
    public static survey_qr = '/api/survey-qr-images'



    //accident
    public static accident = '/api/accidents'
    public static accident_witness = '/api/accident-witnesses'
    public static person_type = '/api/accident-person-types'
    public static accident_individual = '/api/accident-individuals'
    public static investigation_team = '/api/investigation-teams'
    public static accident_overview = '/api/accident-overviews'
    public static accident_root_cause = '/api/accident-root-causes'
    public static corrective_action = '/api/accident-actions'
    public static accident_expense = '/api/accident-expenses'
    public static accident_evidence = '/api/accident-evidences'
    public static corrective_evidence = '/api/corrective-action-evidences'
    public static tertiary_region = '/api/body-tertiary-regions'
    //incident
    public static incident = "/api/incidents"

    //environment
    public static environment = "/api/environments"
    public static env_consumption = "/api/environment-consumptions"
    public static env_evidence = '/api/environment-evidences'
    public static target_setting = "/api/target-settings"
    public static target_evidence = "/api/target-evidences"
    public static target_progress = "/api/target-progresses"
    public static possible_category = "/api/possible-categories"
    public static opportunity = "/api/opportunities"
    public static consumption_dropdown_values = '/api/consumption-dropdown-values'
    public static env_refrigerant = "/api/environment-refrigerants"
    public static env_equipment = "/api/environment-equipments"
    public static env_supplier = "/api/environment-suppliers"
    public static issued_user = "/api/issued-users"
    public static env_issues = "/api/environment-issues"
    public static environment_sub_meter = '/api/env-sub-meters'
    public static environment_sub_meter_details = '/api/env-sub-meter-details'
    public static emission_factor = '/api/emission-factors'
    public static waste_type = '/api/waste-types'
    public static target_source = '/api/target-setting-sources'

    //internal audit
    public static internal_audit = "/api/internal-audits"
    public static audit_team_member = "/api/audit-team-members"
    public static audit_checklist = "/api/audit-checklists"
    public static audit_marks = "/api/audit-marks"
    public static factories = "/api/factories"
    public static process_type = "/api/process-types"
    public static factory_contact_persons = "/api/factory-contact-people"
    public static action_plan = "/api/audit-action-plans"
    public static internal_audit_command = "/api/internal-audit-commands"
    public static internal_audit_evidence = '/api/internal-audit-evidences'
    public static auditees = '/api/auditees'
    public static internal_audit_multiple_evidence = '/api/internal-multiple-evidences'
    public static cover_photo = '/api/internal-audit-cover-photos'
    public static multiple_facility_photos = '/api/multiple-facility-photos'

    //Document Management
    public static document = "/api/document-managements"
    public static document_title = '/api/document-titles'
    public static document_file = '/api/document-files'
    public static document_email = '/api/document-emails'
    public static document_history = '/api/document-histories'
    public static issuing_authority = '/api/issuing-authorities'

    //Sustainability
    public static sustainability = "/api/sustainabilities"
    public static sustainability_impact = '/api/sustainability-impacts'
    public static impact_types = '/api/impact-types'
    public static alignment_sdg = '/api/alignment-with-sdgs'
    public static sustainability_evidence = '/api/sustainability-evidences'
    public static gri_standard = '/api/gri-standards'

    //external audit
    public static external_audit = "/api/external-audits"
    public static external_action_plan = "/api/external-audit-action-plans"
    public static external_audit_report = "/api/external-audit-reports"
    public static audit_standards = "/api/audit-standards"
    public static audit_firm = "/api/audit-firms"
    public static audit_rating = "/api/audit-ratings"
    public static external_audit_evidence = '/api/external-audit-evidences'
    public static external_multiple_evidence = '/api/external-multiple-evidences'
    public static audit_grade = '/api/audit-grades'

    //Chemical Management
    public static chemical = "/api/chemical-managements"
    public static chemical_name = '/api/chemical-names'
    public static storage_place = '/api/chemical-storages'
    public static ppe_list = '/api/ppe-lists'
    public static product_standard = '/api/product-standards'
    public static supplier_name = '/api/supplier-names'
    public static hazard_statement = '/api/hazard-statements'
    public static hazard_statement_codes = '/api/hazard-statement-codes'
    public static test_lab = '/api/chemical-test-labs'
    public static positive_list = '/api/chemical-positive-tests'
    public static certificate = '/api/chemical-certificates'
    public static chemical_department = '/api/chemical-departments'
    public static chemical_transaction = '/api/chemical-transactions'
    public static chemical_disposal = '/api/chemical-disposals'
    public static msds_document = '/api/msds-documents'
    public static chemcheck_report = '/api/chem-check-reports'
    public static certificate_document = '/api/chemical-certificate-docs'
    public static testing_organization = '/api/testing-organizations'

    public static chemical_request = '/api/chemical-requests'
    public static chemical_inventory = '/api/chemical-inventories'
    public static chemical_certificate = '/api/chemical-certificates'
    public static chemical_certificate_doc = '/api/chemical-certificate-docs'
    public static chemical_count = '/api/chemical-inventories/count/view'
    public static apeo_statement = '/api/apeo-statements'
    public static storage_condition_requirement = '/api/storage-condition-requirements'

    //User Management
    public static user_profile = "/api/user-profiles"
    public static user_verify_profile = "/api/user-profile"
    public static user = "/api/users"

    //RAG
    public static rag = "/api/rags"

    //Grievance
    public static grievance = "/api/grievances"
    public static submission = "/api/submissions"
    public static grievance_evidence = "/api/grievance-evidences"
    public static grievance_commitee = "/api/grievance-committees"
    public static grievance_nominee = "/api/grievance-nominees"
    public static grievance_respondent = "/api/grievance-respondents"
    public static grievance_statement = "/api/grievance-statements"
    public static grievance_legal_advisor = "/api/legal-advisors"
    public static grievance_topic = "/api/grievance-topics"
    public static grievance_employee_shift = "/api/employee-shifts"
    public static grievance_alleged_party = "/api/alleged-parties"

    //Attrition
    public static attrition = "/api/attritions"
    public static resignation_type = "/api/resignation-types"

    //Engagement
    public static engagement = "/api/engagements"
    public static engagement_image = "/api/engagement-images"

    //Clinical Suite
    public static clinical_suite = "/api/clinical-suits"
    public static symptoms = "/api/symptoms"
    public static medical_prescription = "/api/medical-prescriptions"
    public static patient_reconsultation = "/api/patient-histories"
    // public static medical_details = "/api/medical-details"
    public static medicine_stock = "/api/medicine-stocks"
    public static hospital = "/api/hospitals"

    //Medical Inventory
    public static medicine_inventory = "/api/medicine-inventories"
    public static medicine_request = "/api/medicine-requests"
    public static medicine_name = "/api/medicine-names"
    public static medicine_supplier = "/api/medicine-suppliers"
    public static medicine_transaction = '/api/medicine-transactions'
    public static medicine_disposal = '/api/medicine-disposals'
    public static medicine_type = '/api/medicine-types'

    //scheduler
    public static scheduler = '/api/schedulers'

    //Equipment
    public static equipment = "/api/equipments"
    public static manufacturer = "/api/manufacturers"
    public static geo_tag = "/api/geo-tags"
    public static equipment_type = "/api/equipment-types"
    public static assignment = "/api/assignments"
    public static client = "/api/clients"
    public static industry_type = "/api/industry-types"
    public static inspection = "/api/inspection-templates"
    public static inspection_category = "/api/inspection-categories"
    public static question = "/api/questions"

    //Materiality Assessment
    public static materiality_stake_holders = "/api/materiality-stakeholders"
    public static materiality_topic = "/api/materiality-topics"
    public static materiality_survey = "/api/materiality-surveys"
    public static materiality_survey_topic = "/api/materiality-survey-topics"
    public static materiality_survey_subtopic = "/api/materiality-survey-subtopics"
    public static materiality_survey_individualtopic = "/api/materiality-survey-individualtopics"
    public static industry = "/api/industries"
    public static framework = "/api/frameworks"
    public static category = "/api/categories"

    public static get_materiality_survey_details = "/api/materiality-survey/get-survey-details"

    //Materiality survey list
    public static create_survey_list = "/api/materiality-survey-lists"
    public static verify_materiality_email = "/api/materiality-survey/verify-survey"
    public static verify_materiality_email_otp = "/api/materiality-survey/verify-otp"


    // Maternity Records
    public static maternity_records = "/api/maternity-records"
    public static medical_documents = "/api/medical-documents"
    public static benefits_entitlements = "/api/benefits-and-entitlements"
    public static benefit_type = "/api/benefit-types"


    // ESG
    public static esgTemp = '/api/esg-temp/esg-data'
    // General Disclosure
    public static generalDisclosureRegister = '/api/general-disclosure/general_disclosure_register'
    public static getListOfValues = '/api/general-disclosure/list_of_values'
    public static createGeneralDisclosure = '/api/general-disclosure/create_general_disclosure'
    public static getGeneralDisclosure = '/api/general-disclosure/general_disclosure_details'
    public static getGeneralDisclosures = '/api/esg-general-disclosures'
    public static modifyGeneralDisclosure = '/api/general-disclosure/modify_general_disclosure'

    //#region  ESG Register
    public static esgRegister = '/api/esg-disclosure/esg_register'
    public static getDropDownValues = '/api/esg-disclosure/dropdown_values'
    public static getUsers = '/api/user-profiles'
    public static esgCreate = '/api/esg-disclosure/esg_create'
    public static esgCreateTeamMembers = '/api/esg-disclosure/esg_create_teamMembers'
    public static getTimePeriod = '/api/esg-disclosure/get_timePeriod'

    public static createSocDisTitleEmployeeDetails = '/api/esg-soc-employee-detail/create_soc_dis_title_employee_details'
    public static createSocDisTitleRemunerationSalaryWages = '/api/remuneration-salary-wage/create_soc_dis_title_remuneration_salary_wage'
    public static createSocDisTitleAverageTrainingHours = '/api/esg-soc-average-training-hour/create_soc_dis_title_average_training_hours'
    public static createSocDisTitleEmployeeDiversity = '/api/esg-soc-employee-diversity/create_soc_dis_title_employee_diversity'
    public static createSocDisTitleNonDiscrimination = '/api/esg-soc-non-discrimination/create_soc_dis_title_non_discrimination'
    public static createSocDisTitleRightsOfIndPeople = '/api/right-of-indigenous-people/create_soc_dis_title_rights_of_indigenous_people'
    public static createSocDisTitleCloseCalls = '/api/esg-soc-close-call/create_soc_dis_title_close_calls'
    public static createSocDisTitleHumanRightsAssessment = '/api/human-rights-assessment/create_soc_dis_human_rights_assessments'
    public static createSocDisTitleHumanRightsAssessmentChainPartners = '/api/chain-partners-hr-assess/create_soc_dis_human_rights_assessments_chain_partners'
    public static createSocDisTitleProductRecalls = '/api/esg-soc-product-recall/create_soc_dis_title_product_recalls'
    public static create_new_region = '/api/region/create_region'

    public static createSocDisTitleConsumerComplaints = '/api/esg-soc-consumer-complaint/create_soc_dis_title_consumer_complaints'
    public static createSocDisTitleBreaches = '/api/breaches-of-customer-privacy/create_soc_dis_title_breaches'
    public static createSocDisTitleEmployeeUnion = '/api/esg-soc-employee-union/create_soc_dis_title_employee_union'
    public static createSoctitlePoliticalContribution = '/api/esg-soc-political-contribution/create_soc_dis_title_political_contribution'
    public static createSoctitleCSRProjects = '/api/esg-soc-csr-project/create_soc_dis_title_csr_projects'
    public static createSocHSAssessmentvalueChainPartners = '/api/hs-value-chain-assessment/create_soc_dis_hs_assessment_value_chain_partners'
    public static createSocDisTitleWorkIllHealth = '/api/esg-soc-work-ill-health/create_soc_dis_work_ill_health'
    public static createSocDisTitleWorkRelatedinjury = '/api/esg-soc-work-injury/create_soc_dis_work_related_injury'
    public static createSocDisTitleNegSocialImpacts = '/api/esg-neg-soc-imapact/create_soc_dis_title_negative_social_impacts'
    public static createSocDisTitleMarketingCommunications = '/api/esg-soc-mar-comm/create_soc_dis_title_marketing_communications'
    public static createSocDisTitleProductServiceLabeling = '/api/esg-soc-ps-label/create_soc_dis_title_product_service_info_labeling'
    public static createSocDisTitleCustomerHealthSafety = '/api/esg-soc-customer-hs/create_soc_dis_title_customer_health_safety'
    public static createSocDisTitleSecurityPersonalTraining = '/api/esg-soc-personal-training/create_soc_dis_title_security_personal_training'
    public static createSocDisTitleOHSMngSystem = '/api/esg-soc-ohs-system/create_soc_dis_title_ohs_mng_system'
    public static createSocDisTitleOHSMngSystemComplaints = '/api/esg-soc-ohs-complaint/create_soc_dis_title_ohs_mng_system_complaints'
    public static createSocDisTitleHRTraining = '/api/esg-soc-hr-training/create_soc_dis_title_training_on_hr_issues_policies'
    public static createSocDisTitleRandR = '/api/esg-soc-r-and-r/create_soc_dis_title_r_and_r'
    public static createSocDisTitleProductServiceAssessment = '/api/esg-soc-prd-service-assess/create_soc_dis_title_product_service_assessment'
    public static createSocDisTitleSIAProject = '/api/esg-soc-sia-project/create_soc_dis_title_SIA_project'
    public static createSocDisTitleWorkingHours = '/api/esg-soc-working-hour/create_soc_dis_title_working_hours'
    public static createSocDisTitleSecurityComplaintsOnHRViolations = '/api/esg-soc-hr-complaint/create_soc_dis_title_complaints_on_hr_violations'
    public static createSocDisTitleHealthSafetyAssessment = '/api/esg-soc-hs-assessment/create_soc_dis_title_health_safety_assessment'
    public static createSocDisTitleWorkersOtherThanEmployees = '/api/esg-soc-other-worker/create_soc_dis_title_workers_other_than_employees'
    public static createSocDisTitleSupplierSocAssessment = '/api/esg-supplier-soc-assessment/create_soc_dis_title_supplier_soc_assessment'
    public static createSocDisTitleParentalLeave = '/api/esg-soc-parental-leave/create_soc_dis_title_parental_leave'
    public static createGovDisTitleDirectorDetails = '/api/esg_gov_directors_board/create_gov_dis_title_director_details'
    public static createGovDisTitleDirectorTenure = '/api/esg-gov-director-tenure/create_gov_dis_title_director_tenure'
    public static creategovBodyAntiCorrupt = '/api/esg-gov-ac-gov-body/create_gov_body_anti_corrupt'
    public static createGovEmployeeDetails = '/api/esg-gov-ac-emp-training/create_gov_employee_details'
    public static createGovBusinessPartnerDetails = '/api/esg-gov-ac-business/create_gov_business_partner_details'
    public static createGovAntiCompetitive = '/api/esg-gov-anti-compet/create_gov_anti_competitive'
    public static createGovAntiCorrupt = '/api/esg-gov-anti-corrup/create_gov_anti_corrupt'
    public static createGovIncidentsCorrupt = '/api/esg-gov-inc-corrup/create_gov_incidents_corrupt'
    public static createGovConflictsInterest = '/api/esg-gov-conflicts-interest/create_gov_conflicts_interest'
    public static creategovDisciplinaryAction = '/api/esg-gov-disp-action/create_gov_disciplinary_action'
    public static creategovNGRBCPrinciples = '/api/esg-gov-ngrbc-aware/create_gov_NGRBC_principles'
    public static creategovValueChainNGRBC = '/api/esg-gov-vc-ngrbc/create_gov_value_chain_NGRBC'
    public static createGovLawRegulations = '/api/esg-gov-law-regulation/create_gov_law_regulations'
    public static createGovGrievances = '/api/esg-gov-complaint/create_gov_grievances'
    public static createGovCorporate = '/api/esg-gov-corp-partnership/create_gov_corporate'



    public static createSocDisTitleNewHire = '/api/esg-soc-new-employee-hire/create_soc_dis_title_new_hire'
    public static createSocDisTitleTurnover = '/api/esg-soc-employee-turnover/create_soc_dis_title_turnover'
    public static createSocDisTitleSkillUpgradeTraining = '/api/emp-skill-upgrade-training/create_soc_dis_title_skill_upgrade_training'
    public static createSocDisTitlePerfomanceReviews = '/api/emp-perfomance-review/create_soc_dis_title_perfomance_career_development_reviews'
    public static createSocDisTitleTrainingOnHealthSafetyMeasures = '/api/emp-training-hs-measure/create_soc_dis_title_training_on_health_safety_measures'
    public static createSocDisTitleSalaryRatioWomenToMen = '/api/esg-soc-emp-salary-ratio/create_soc_dis_title_ratio_salary_women_to_men'
    public static createSocDisTitleDifAbled = '/api/esg-soc-dif-abled-employee/create_soc_dis_dif_abled'
    public static createSocDisTitleBenefits = '/api/esg-soc-employee-benefit/create_soc_dis_title_benefits'
    public static createSocDisTitleRetirementBenefits = '/api/esg-soc-emp-ret-benefit/create_soc_dis_title_retirement_benefits'
    public static createEnvMaterialsUsed = '/api/esg-env-materials-used/create_Materials_Used'
    public static createEnvInputMaterialsUsed = '/api/esg-env-recycled-material/create_Input_Materials_Used'
    public static createEnvNewInputMaterial = '/api/esg-recycled-input-material/create_Input_Material'
    public static createEnvNewFuelName = '/api/esg-fuel-name/create_Fuel_Name'
    public static updateEnvNewFuelName = '/api/esg-fuel-name/modify_Fuel_Name'
    public static deleteEnvNewFuelName = '/api/esg-fuel-name/delete_Fuel_Name'
    public static createEnvNewReclaimedProduct = '/api/esg-reclaimed-product/create_Reclaimed_Product'
    public static createEnvNewProductCategory = '/api/esg-product-category/create_Product_Category'
    public static createEnvReclaimedProduct = '/api/esg-env-reclaimed-product/create_Reclaimed_Product'
    public static createEnvWaterwithdrawal = '/api/esg-env-water-withdrawal/create_Water_Withdrawal'
    public static createEnvWaterwithdrawalStress = '/api/esg-env-water-stress/create_Water_stress'
    public static createEnvWaterdischarge = '/api/esg-env-water-discharge/create_Water_discharge'
    public static createEnvWaterdischargeStress = '/api/esg-env-discharge-stress/create_Water_discharge_stress'
    public static createEnvSpeciesAffected = '/api/esg-env-species-affected/create_Species_Affected'
    public static createEnvTypeofODS = '/api/esg-env-ods-emission/create_env_dis_title_type_of_ods'
    public static createEnvSupplierenvAsmnt = '/api/esg-supplier-env-asmnt/create_env_dis_title_supplier_env_asmnt'
    public static createEnvWaterRecycled = '/api/esg-env-water-recycled/create_env_water_recycled'
    public static createEnvImpactAssessment = '/api/esg-env-impact-assessment/create_env_impact_assessment'
    public static createEnvHabitat = '/api/esg-env-habitat-protected/create_env_habitat_protected'
    public static createEnvImpactofActivities = '/api/esg-env-impact-of-activitie/create_Impact_of_Activities'
    public static createEnvCompliance = '/api/esg-env-compliance-law/create_env_compliance_law'
    public static createEnvNegetiveImpact = '/api/esg-env-negetive-impact/create_env_negetive_impact'
    public static createEnvEIAofProject = '/api/esg-env-eia-of-project/create_EIA_of_Project'
    public static createEnvLifecycleAssesssment = '/api/esg-env-lifecycle-asmnt/create_env_lifecycle_assessment'
    public static createEnvAirEmission = '/api/esg-env-air-emission/create_air_emission'
    public static createEnvTypeofWaste = '/api/esg-type-of-waste/create_Type_Of_Waste'
    public static createEnvTypeofWasteData = '/api/esg-env-waste-generated/create_env_waste_generated'
    public static createEnvEmissionIntensityBase = '/api/esg-emission-intensity-base/create_Emission_Intensity_Base'
    public static createEnvEnergyConsumptionWithin = '/api/esg-env-energy-within/create_energy_consumption_within'
    public static createEnvEnergyConsumptionOutside = '/api/esg-env-energy-outside/create_energy_consumption_outside'
    public static createEnvRenewableFuel = '/api/esg-env-renewable-fuel/create_Renewable_Fuel'
    public static createEnvNonRenewableFuel = '/api/esg-env-nonrenewable-fuel/create_Non_Renewable_Fuel'
    public static createEnvUpstreamCategory = '/api/esg-env-upstream-category/create_env_upstream_category'
    public static createEnvDownstreamCategory = '/api/esg-env-downstream-category/create_env_downstream_category'
    public static createEnvDirectEmission = '/api/esg-env-direct-emission/create_env_direct_emission'
    // modify
    public static getDetails = '/api/esg-disclosure/get_details'
    public static addTeamMember = '/api/esg-disclosure/modify_add_team_member'
    public static updateTeamMember = '/api/esg-disclosure/modify_update_team_member'
    public static deleteTeamMember = '/api/esg-disclosure/delete_teamMember'
    public static deleteDisTitleEmployeeDetails = '/api/esg-soc-employee-detail/delete_soc_dis_title_employee_details'
    public static deleteDisTitleEmployeeHire = '/api/esg-soc-new-employee-hire/delete_soc_dis_title_employee_hire'
    public static deleteDisTitleEmployeeTurnover = '/api/esg-soc-employee-turnover/delete_soc_dis_title_employee_turnover'
    public static deleteSocDisTitleEmployeeSkillUpgradeTraining = '/api/emp-skill-upgrade-training/delete_soc_dis_title_employee_skill_upgrade_training'
    public static deleteSocDisTitleEmployeePerfomanceReviews = '/api/emp-perfomance-review/delete_soc_dis_title_employee_perfomance_career_development_reviews'
    public static deleteSocDisTitleTrainingOnHealthSafetyMeasures = '/api/emp-training-hs-measure/delete_soc_dis_title_training_on_health_safety_measures'
    public static deleteSocDisTitleSalaryRatioWomenToMen = '/api/esg-soc-emp-salary-ratio/delete_soc_dis_title_ratio_salary_women_to_men'
    public static deleteDisDifAbledEmployee = '/api/esg-soc-dif-abled-employee/delete_soc_dis_dif_abled_employee'
    public static deleteDisTitleWorkerHire = '/api/esg-soc-new-worker-hire/delete_soc_dis_title_worker_hire'
    public static deleteDisTitleWorkerTurnover = '/api/esg-soc-worker-turnover/delete_soc_dis_title_worker_turnover'
    public static deleteSocDisTitleWorkerSkillUpgradeTraining = '/api/wrk-skill-upgrade-training/delete_soc_dis_title_worker_skill_upgrade_training'
    public static deleteSocDisTitleWorkerPerfomanceReviews = '/api/wrk-performance-review/delete_soc_dis_title_worker_perfomance_career_development_reviews'
    public static deleteSocDisDifAbledWorker = '/api/esg-soc-dif-abled-worker/delete_soc_dis_dif_abled_worker'
    public static deleteSocDisEmployeeBenefits = '/api/esg-soc-employee-benefit/delete_soc_dis_employee_benefits'
    public static deleteSocDisEmployeeRetirementBenefits = '/api/esg-soc-emp-ret-benefit/delete_soc_dis_employee_retirement_benefits'
    public static deleteSocDisTitleRemunerationSalaryWages = '/api/remuneration-salary-wage/delete_soc_dis_title_remuneration_salary_wage'
    public static deleteSocDisTitleAverageTrainingHours = '/api/esg-soc-average-training-hour/delete_soc_dis_title_average_training_hours'
    public static deleteSocDisTitleEmployeeDiversity = '/api/esg-soc-employee-diversity/delete_soc_dis_title_employee_diversity'
    public static deleteSocDisTitleNonDiscrimination = '/api/esg-soc-non-discrimination/delete_soc_dis_title_non_discrimination'
    public static deleteSocDisTitleRightsOfIndPeople = '/api/right-of-indigenous-people/delete_soc_dis_title_rights_of_indigenous_people'
    public static deleteSocDisTitleCloseCalls = '/api/esg-soc-close-call/delete_soc_dis_title_close_calls'
    public static deleteSocDisTitleHumanRightsAssessment = '/api/human-rights-assessment/delete_soc_dis_human_rights_assessments'
    public static deleteSocDisTitleHumanRightsAssessmentChainPartners = '/api/chain-partners-hr-assess/delete_soc_dis_human_rights_assessments_chain_partners'
    public static deleteSocDisTitleProductRecalls = '/api/esg-soc-product-recall/delete_soc_dis_title_product_recalls'
    public static deleteSocDisTitleConsumerComplaints = '/api/esg-soc-consumer-complaint/delete_soc_dis_title_consumer_complaints'
    public static deleteSocDisTitleBreaches = '/api/breaches-of-customer-privacy/delete_soc_dis_title_breaches'
    public static deleteSocDisWorkersBenefits = '/api/esg-soc-workers-benefit/delete_soc_dis_workers_benefits'
    public static deleteSocDisWorkersRetirementBenefits = '/api/esg-soc-work-ret-benefit/delete_soc_dis_workers_retirement_benefits'
    public static deleteEnvMaterialUsed = '/api/esg-env-materials-used/delete_Materials_Used'
    public static updateSocDisTitleEmployeeDetails = '/api/esg-soc-employee-detail/modify_soc_dis_title_employee_details'
    public static updateSocDisTitleAverageTrainingHours = '/api/esg-soc-average-training-hour/modify_soc_dis_title_average_training_hours'
    public static updateSocDisTitleWorkerSkillUpgradeTraining = '/api/wrk-skill-upgrade-training/modify_soc_dis_title_worker_skill_upgrade_training'
    public static updateSocDisTitleWorkerPerfomanceReviews = '/api/wrk-performance-review/modify_soc_dis_title_worker_perfomance_career_development_reviews'
    public static updateSocDisTitleEmployeeSkillUpgradeTraining = '/api/emp-skill-upgrade-training/modify_soc_dis_title_employee_skill_upgrade_training'
    public static updateSocDisTitleEmployeePerfomanceReviews = '/api/emp-perfomance-review/modify_soc_dis_title_employee_perfomance_career_development_reviews'
    public static updateSocDisTitleTrainingOnHealthSafetyMeasures = '/api/emp-training-hs-measure/modify_soc_dis_title_training_on_health_safety_measures'
    public static updateSocDisTitleSalaryRatioWomenToMen = '/api/esg-soc-emp-salary-ratio/modify_soc_dis_title_ratio_salary_women_to_men'
    public static updateSocDisTitleConsumerComplaints = '/api/esg-soc-consumer-complaint/modify_soc_dis_title_consumer_complaints'
    public static updateSocDisTitleBreaches = '/api/breaches-of-customer-privacy/modify_soc_dis_title_breaches'
    public static updateSocDisTitleEmployeeDiversity = '/api/esg-soc-employee-diversity/modify_soc_dis_title_employee_diversity'
    public static updateSocDisTitleNonDiscrimination = '/api/esg-soc-non-discrimination/modify_soc_dis_title_non_discrimination'
    public static updateSocDisTitleHumanRightsAssessment = '/api/human-rights-assessment/modify_soc_dis_human_rights_assessments'
    public static updateSocDisTitleHumanRightsAssessmentChainPartners = '/api/chain-partners-hr-assess/modify_soc_dis_human_rights_assessments_chain_partners'
    public static updateSocDisTitleProductRecalls = '/api/esg-soc-product-recall/modify_soc_dis_title_product_recalls'
    public static updateSocDisTitleCloseCalls = '/api/esg-soc-close-call/modify_soc_dis_title_close_calls'
    public static updateSocDisTitleRightsOfIndPeople = '/api/right-of-indigenous-people/modify_soc_dis_title_rights_of_indigenous_people'
    public static updateSocDisTitleERemunerationSalaryWages = '/api/remuneration-salary-wage/modify_soc_dis_title_remuneration_salary_wage'
    public static updateSocDisTitleEmployeeHire = '/api/esg-soc-new-employee-hire/modify_soc_dis_title_employee_hire'
    public static updateSocDisworkersRetirementBenefits = '/api/esg-soc-work-ret-benefit/modify_soc_dis_workers_retirement_benefits'
    public static updateSocDisEmployeeRetirementBenefits = '/api/esg-soc-emp-ret-benefit/modify_soc_dis_employee_retirement_benefits'
    public static updateSocDisTitleWorkerTurnover = '/api/esg-soc-worker-turnover/modify_soc_dis_title_worker_turnover'
    public static updateSocDisDifAbledWorker = '/api/esg-soc-dif-abled-worker/modify_soc_dis_title_dif_abled_worker'
    public static updateSocDisTitleEmployeeTurnover = '/api/esg-soc-employee-turnover/modify_soc_dis_title_employee_turnover'
    public static updateSocDisDifAbledEmployee = '/api/esg-soc-dif-abled-employee/modify_soc_dis_title_dif_abled_employee'
    public static updateSocDisWorkerBenefits = '/api/esg-soc-workers-benefit/modify_soc_dis_worker_benefits'
    public static updateSocDisTitleEmployeeBenefits = '/api/esg-soc-employee-benefit/modify_soc_dis_employee_benefits'
    public static updateSocDisTitleWorkerHire = '/api/esg-soc-new-worker-hire/modify_soc_dis_title_worker_hire'
    public static updateRegion = '/api/region/modify_region'
    public static deleteRegion = '/api/region/delete_region'
    public static updateESGSocDisStatus = '/api/esg-social-disclosure/update_esg_soc_dis_status'
    public static updateESGSocDisAllThemeStatus = '/api/esg-social-disclosure/update_esg_soc_all_themes_status'
    public static updateESGGovDisStatus = '/api/esg-governance-disclosure/update_esg_gov_dis_status'
    public static updateESGGovAllDisThemeStatus = '/api/esg-governance-disclosure/update_all_gov_theme_status'
    public static updateESGEnvDisStatus = '/api/esg-environment-disclosure/update_esg_env_dis_status'
    public static updateESGEnvDisAllThemeStatus = '/api/esg-environment-disclosure/update_esg_env_all_themes_status'
    public static updateEnvMaterialsUsed = '/api/esg-env-materials-used/update_Materials_Used'
    public static create_new_type_of_hr_violation = '/api/esg-type-of-hr-violation/create_type_of_hr_violation'
    public static updateTypeofHRViolation = '/api/esg-type-of-hr-violation/modify_type_of_hr_violation'
    public static deleteTypeofHRViolation = '/api/esg-type-of-hr-violation/delete_type_of_hr_violation'

    //ESG General Disclosure
    public static createESGGeneralDisclosure = '/api/esg-general-disclosure/esg_create_genDisclosure'
    public static ESGGeneralDisclosureRegister = '/api/esg-general-disclosure/esg_register_genDisclosure'
    public static updateESGGeneralDisclosure = '/api/esg-general-disclosure/esg_update_genDisclosure'
    public static ESGGeneralDisclosure = '/api/esg-general-disclosure/esg_genralDisclosure'
    public static getGenDisDropDownValues = '/api/esg-general-disclosure/dropdown_values'


    public static updateGovDisTitleDirectorDetails = '/api/esg_gov_directors_board/modify_gov_dis_title_directors'
    public static updateGovEmployeeDetails = '/api/esg-gov-ac-emp-training/update_gov_employee_details'
    public static updateGovBusinessPartnerDetails = '/api/esg-gov-ac-business/update_gov_business_partner_details'
    public static updateGovConflictsInterest = '/api/esg-gov-conflicts-interest/update_gov_conflicts_interest'
    public static updateGovLawRegulations = '/api/esg-gov-law-regulation/update_gov_law_regulations'
    public static updateGovGrievances = '/api/esg-gov-complaint/update_gov_grievances'
    public static updateGovCorporate = '/api/esg-gov-corp-partnership/update_gov_corporate'


    public static deleteGovDisTitleDirectorDetails = '/api/esg_gov_directors_board/delete_gov_dis_title_directors'
    public static deleteGovEmployeeDetails = '/api/esg-gov-ac-emp-training/delete_gov_employee_details'
    public static deleteGovBusinessPartnerDetails = '/api/esg-gov-ac-business/delete_gov_business_partner_details'
    public static deleteGovConflictsInterest = '/api/esg-gov-conflicts-interest/delete_gov_conflicts_interest'
    public static deleteGovLawRegulations = '/api/esg-gov-law-regulation/delete_gov_law_regulations'
    public static deleteGovGrievances = '/api/esg-gov-complaint/delete_gov_grievances'
    public static deleteGovCorporate = '/api/esg-gov-corp-partnership/delete_gov_corporate'


    public static updateEnvInputMaterialsUsed = '/api/esg-env-recycled-material/update_Input_Materials_Used'
    public static deleteEnvInputMaterialsUsed = '/api/esg-env-recycled-material/delete_Input_Materials_Used'
    public static updateEnvNewInputMaterial = '/api/esg-recycled-input-material/modify_Input_Material'
    public static deleteEnvNewInputMaterial = '/api/esg-recycled-input-material/delete_Input_Material'
    public static updateEnvNewReclaimedProduct = '/api/esg-reclaimed-product/modify_Reclaimed_Product'
    public static deleteEnvNewReclaimedProduct = '/api/esg-reclaimed-product/delete_Reclaimed_Product'
    public static updateEnvNewProductCategory = '/api/esg-product-category/modify_Product_Category'
    public static deleteEnvNewProductCategory = '/api/esg-product-category/delete_Product_Category'
    public static updateEnvReclaimedProduct = '/api/esg-env-reclaimed-product/update_Reclaimed_Product'
    public static deleteEnvReclaimedProduct = '/api/esg-env-reclaimed-product/delete_Reclaimed_Product'
    public static updateEnvWaterwithdrawal = '/api/esg-env-water-withdrawal/update_Water_Withdrawal'
    public static deleteEnvWaterwithdrawal = '/api/esg-env-water-withdrawal/delete_Water_Withdrawal'
    public static updateEnvWaterwithdrawalStress = '/api/esg-env-water-stress/update_Water_stress'
    public static deleteEnvWaterwithdrawalStress = '/api/esg-env-water-stress/delete_Water_stress'
    public static updateEnvWaterdischarge = '/api/esg-env-water-discharge/update_Water_discharge'
    public static deleteEnvWaterdischarge = '/api/esg-env-water-discharge/delete_Water_discharge'
    public static updateEnvWaterdischargeStress = '/api/esg-env-discharge-stress/update_Water_discharge_stress'
    public static deleteEnvWaterdischargeStress = '/api/esg-env-discharge-stress/delete_Water_discharge_stress'
    public static updateEnvSpeciesAffected = '/api/esg-env-species-affected/update_Species_Affected'
    public static deleteEnvSpeciesAffected = '/api/esg-env-species-affected/delete_Species_Affected'
    public static updateEnvDisclosureStatus = '/api/esg-environment-disclosure/update_esg_env_dis_status'
    public static updateEnvImpactofActivities = '/api/esg-env-impact-of-activitie/update_Impact_of_Activities'
    public static deleteEnvImpactofActivities = '/api/esg-env-impact-of-activitie/delete_Impact_of_Activities'
    public static updateEnvEIAofProject = '/api/esg-env-eia-of-project/update_EIA_of_Project'
    public static deleteEnvEIAofProject = '/api/esg-env-eia-of-project/delete_EIA_of_Project'
    public static updateEnvAirEmission = '/api/esg-env-air-emission/update_air_emission'
    public static deleteEnvAirEmission = '/api/esg-env-air-emission/delete_air_emission'
    public static updateEnvTypeofWaste = '/api/esg-type-of-waste/modify_Type_Of_Waste'
    public static deleteEnvTypeofWaste = '/api/esg-type-of-waste/delete_Type_Of_Waste'
    public static updateEnvWasteDirected = '/api/esg-env-waste-directed/update_env_waste_directed'
    public static deleteEnvWasteDirected = '/api/esg-env-waste-directed/delete_env_waste_directed'
    public static updateEnvWasteDiverted = '/api/esg-env-waste-diverted/update_env_waste_diverted'
    public static deleteEnvWasteDiverted = '/api/esg-env-waste-diverted/delete_env_waste_diverted'
    public static updateEnvWasteGenerated = '/api/esg-env-waste-generated/update_env_waste_generated'
    public static deleteEnvWasteGenerated = '/api/esg-env-waste-generated/delete_env_waste_generated'
    public static updateEnvTypeofWasteData = '/api/esg-env-type-of-waste/update_env_type_of_waste'
    public static deleteEnvTypeofWasteData = '/api/esg-env-type-of-waste/delete_env_type_of_waste'
    public static updateEnvDownstreamCategory = '/api/esg-env-downstream-category/update_env_downstream_category'
    public static deleteEnvDownstreamCategory = '/api/esg-env-downstream-category/delete_env_downstream_category'
    public static updateEnvUpstreamCategory = '/api/esg-env-upstream-category/update_env_upstream_category'
    public static deleteEnvUpstreamCategory = '/api/esg-env-upstream-category/delete_env_upstream_category'
    public static updateEnvEmissionIntensityBase = '/api/esg-emission-intensity-base/modify_Emission_Intensity_Base'
    public static deleteEnvEmissionIntensityBase = '/api/esg-emission-intensity-base/delete_Emission_Intensity_Base'
    public static updateEnvEnergyConsumptionWithin = '/api/esg-env-energy-within/update_energy_consumption_within'
    public static deleteEnvEnergyConsumptionWithin = '/api/esg-env-energy-within/delete_energy_consumption_within'
    public static updateEnvEnergyConsumptionOutside = '/api/esg-env-energy-outside/update_energy_consumption_outside'
    public static deleteEnvEnergyConsumptionOutside = '/api/esg-env-energy-outside/delete_energy_consumption_outside'
    public static updateEnvRenewableFuel = '/api/esg-env-renewable-fuel/modify_Renewable_Fuel'
    public static deleteEnvRenewableFuel = '/api/esg-env-renewable-fuel/delete_Renewable_Fuel'
    public static updateEnvNonRenewableFuel = '/api/esg-env-nonrenewable-fuel/modify_Non_Renewable_Fuel'
    public static deleteEnvNonRenewableFuel = '/api/esg-env-nonrenewable-fuel/delete_Non_Renewable_Fuel'
    public static updateEnvDirectEmission = '/api/esg-env-direct-emission/update_env_direct_emission'
    public static deleteEnvDirectEmission = '/api/esg-env-direct-emission/delete_env_direct_emission'
    public static updateTypeofODS = '/api/esg-type-of-ods/modify_type_of_ods'
    public static create_new_type_of_ods = '/api/esg-type-of-ods/create_type_of_ods'
    public static deleteTypeofODS = '/api/esg-type-of-ods/delete_type_of_ods'
    //#endregion

    //#region ESG Dashboard
    public static getSDGDashboardData = '/api/esg-disclosure/get_dashboard_data'
    public static getESGDashboardData = '/api/esg-disclosure/get_ESG_Dashboard_data'


    //#endregion
}
