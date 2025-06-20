import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { EsgRoutingModule } from './esg-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoadingScreenModule } from "../loading-screen/loading-screen.module";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { AddTeamMemberComponent } from './create/add-team-member/add-team-member.component';
import { ModifyTeamMemberComponent } from './create/modify-team-member/modify-team-member.component';
import { ViewTeamMemberComponent } from './create/view-team-member/view-team-member.component';
import { ModifyComponent } from './modify/modify.component';
import { ViewComponent } from './view/view.component';
import { UpdateTeamMemberComponent } from './modify/update-team-member/update-team-member.component';
import { DisclosureComponent } from './disclosure/disclosure.component';
import { EnvironmentDisclosureComponent } from './disclosure/environment-disclosure/environment-disclosure.component';
import { SocialDisclosureComponent } from './disclosure/social-disclosure/social-disclosure.component';
import { GovernanceDisclosureComponent } from './disclosure/governance-disclosure/governance-disclosure.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { AddEmployeeDetailsComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-employee-details/add-employee-details.component';
import { AddNewWorkerHiresComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-new-hire/add-new-worker-hires/add-new-worker-hires.component';
import { AddNewEmployeeHiresComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-new-hire/add-new-employee-hires/add-new-employee-hires.component';
import { AddDirectorDetailsComponent } from './disclosure/governance-disclosure/governance-disclosure-title-details/add-director-details/add-director-details.component';
import { AddMaterialsUsedComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-materials-used/add-materials-used.component';
import { AddRecycledInputMaterialsComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-recycled-input-materials/add-recycled-input-materials.component';
import { CreateNewRegionComponent } from './disclosure/social-disclosure/create-new-region/create-new-region.component';
import { AddEmployeeTurnoverComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-turnover/add-employee-turnover/add-employee-turnover.component';
import { AddWorkerTurnoverComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-turnover/add-worker-turnover/add-worker-turnover.component';
import { AddDifAbledEmployeesComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-differently-abled/add-dif-abled-employees/add-dif-abled-employees.component';
import { AddDifAbledWorkersComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-differently-abled/add-dif-abled-workers/add-dif-abled-workers.component';
import { AddEmployeeBenefitsComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-benefits/add-employee-benefits/add-employee-benefits.component';
import { AddWorkerBenefitsComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-benefits/add-worker-benefits/add-worker-benefits.component';
import { AddEmployeeRetirementBenefitsComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-retirement-benefits/add-employee-retirement-benefits/add-employee-retirement-benefits.component';
import { AddWorkerRetirementBenefitsComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-retirement-benefits/add-worker-retirement-benefits/add-worker-retirement-benefits.component';
import { AddRemunerationSalaryWagesComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-remuneration-salary-wages/add-remuneration-salary-wages.component';
import { AddAverageTrainingHoursComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-average-training-hours/add-average-training-hours.component';
import { AddEmployeeDiversityComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-employee-diversity/add-employee-diversity.component';
import { AddNonDiscriminationComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-non-discrimination/add-non-discrimination.component';
import { AddRightsOfIndigenousPeopleComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-rights-of-indigenous-people/add-rights-of-indigenous-people.component';
import { AddCloseCallsAndHighPotentialIncidentsComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-close-calls-and-high-potential-incidents/add-close-calls-and-high-potential-incidents.component';
import { AddHumanRightsAssessmentsComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-human-rights-assessments/add-human-rights-assessments.component';
import { AddHumanRightsAssessmentsChainPartnersComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-human-rights-assessments-chain-partners/add-human-rights-assessments-chain-partners.component';
import { AddProductRecallsComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-product-recalls/add-product-recalls.component';
import { AddNewInputMaterialComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-recycled-input-materials/add-new-input-material/add-new-input-material.component';
import { AddEmpDetailsComponent } from './disclosure/governance-disclosure/governance-disclosure-title-details/add-emp-details/add-emp-details.component';
import { AddBPDetailsComponent } from './disclosure/governance-disclosure/governance-disclosure-title-details/add-bp-details/add-bp-details.component';
import { AddConflictsInterestComponent } from './disclosure/governance-disclosure/governance-disclosure-title-details/add-conflicts-interest/add-conflicts-interest.component';
import { AddConsumerComplaintsComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-consumer-complaints/add-consumer-complaints.component';
import { AddBreachesOfCustomerPrivacyLossOfDataComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-breaches-of-customer-privacy-loss-of-data/add-breaches-of-customer-privacy-loss-of-data.component';
import { AddReclaimedProductsComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-reclaimed-products/add-reclaimed-products.component';
import { AddNewReclaimedProductComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-reclaimed-products/add-new-reclaimed-product/add-new-reclaimed-product.component';
import { AddNewProductCategoryComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-reclaimed-products/add-new-product-category/add-new-product-category.component';
import { EsgTempComponent } from './disclosure/esg-temp/esg-temp.component';
import { AddLawRegulationComponent } from './disclosure/governance-disclosure/governance-disclosure-title-details/add-law-regulation/add-law-regulation.component';
import { AddComplaintsComponent } from './disclosure/governance-disclosure/governance-disclosure-title-details/add-complaints/add-complaints.component';
import { AddCorporateComponent } from './disclosure/governance-disclosure/governance-disclosure-title-details/add-corporate/add-corporate.component';
import { AddWaterWithdrawalComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-water-withdrawal/add-water-withdrawal.component';
import { AddWaterWithdrawalStressComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-water-withdrawal-stress/add-water-withdrawal-stress.component';
import { AddWaterDischargeComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-water-discharge/add-water-discharge.component';
import { AddWaterDischargeStressComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-water-discharge-stress/add-water-discharge-stress.component';
import { AddSpeciesAffectedComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-species-affected/add-species-affected.component';
import { AddImpactOfActivitiesComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-impact-of-activities/add-impact-of-activities.component';
import { AddEmployeeSkillUpgradeTrainingComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-training-on-skill-upgradation/add-employee-skill-upgrade-training/add-employee-skill-upgrade-training.component';
import { AddWorkersSkillUpgradeTrainingComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-training-on-skill-upgradation/add-workers-skill-upgrade-training/add-workers-skill-upgrade-training.component';
import { AddEmployeePerfomanceReviewComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-perfomance-career-development-reviews/add-employee-perfomance-review/add-employee-perfomance-review.component';
import { AddWorkerPerfomanceReviewComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-perfomance-career-development-reviews/add-worker-perfomance-review/add-worker-perfomance-review.component';
import { AddEmployeeTrainingOnHsMeasuresComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-employee-training-on-hs-measures/add-employee-training-on-hs-measures.component';
import { AddRatioSalaryRemunerationWomenMenComponent } from './disclosure/social-disclosure/social-disclosure-title-details/add-ratio-salary-remuneration-women-men/add-ratio-salary-remuneration-women-men.component';
import { AddEiaOfProjectComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-eia-of-project/add-eia-of-project.component';
import { AddAirEmissionComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-air-emission/add-air-emission.component';
import { AddWasteGeneratedMultipleComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-waste-generated-multiple/add-waste-generated-multiple.component';
import { AddWasteGeneratedComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-waste-generated/add-waste-generated.component';
import { AddWasteDirectedComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-waste-directed/add-waste-directed.component';
import { AddWasteDivertedComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-waste-diverted/add-waste-diverted.component';
import { AddDirectIndirectEmissionComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-direct-indirect-emission/add-direct-indirect-emission.component';
import { AddEmissionIntensityBaseComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-direct-indirect-emission/add-emission-intensity-base/add-emission-intensity-base.component';
import { AddUpstreamCategoryComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-direct-indirect-emission/add-upstream-category/add-upstream-category.component';
import { AddDownstreamCategoryComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-direct-indirect-emission/add-downstream-category/add-downstream-category.component';
import { AddEnergyConsumptionWithinComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-energy-consumption-within/add-energy-consumption-within.component';
import { AddEnergyConsumptionOutsideComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-energy-consumption-outside/add-energy-consumption-outside.component';
import { AddRenewableFuelComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-energy-consumption-within/add-renewable-fuel/add-renewable-fuel.component';
import { AddNonRenewableFuelComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-energy-consumption-within/add-non-renewable-fuel/add-non-renewable-fuel.component';
import { AddUpstreamCategoryOutsideComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-energy-consumption-outside/add-upstream-category-outside/add-upstream-category-outside.component';
import { AddDownstreamCategoryOutsideComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-energy-consumption-outside/add-downstream-category-outside/add-downstream-category-outside.component';
import { AddDisclosureTeamMemberComponent } from './disclosure/add-disclosure-team-member/add-disclosure-team-member.component';
import { NewTypeOfOdsComponent } from './disclosure/environment-disclosure/new-type-of-ods/new-type-of-ods.component';
import { NewTypeHrViolationsComponent } from './disclosure/social-disclosure/new-type-hr-violations/new-type-hr-violations.component';
import { AddNewFuelNameComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-energy-consumption-within/add-new-fuel-name/add-new-fuel-name.component';
import { AddNewTypeOfWasteComponent } from './disclosure/environment-disclosure/environment-disclosure-title-details/add-waste-generated/add-new-type-of-waste/add-new-type-of-waste.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GeneralDisclosureComponent } from './general-disclosure/general-disclosure.component';
import { GeneralDisclosureRegisterComponent } from './general-disclosure-register/general-disclosure-register.component';
import { GeneralDisclosureModifyComponent } from './general-disclosure-modify/general-disclosure-modify.component';
import { GeneralDisclosureViewComponent } from './general-disclosure-view/general-disclosure-view.component';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReportParameterComponent } from './general-disclosure-register/report-parameter/report-parameter.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';






const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    RegisterComponent,
    CreateComponent,
    AddTeamMemberComponent,
    ModifyTeamMemberComponent,
    ViewTeamMemberComponent,
    ModifyComponent,
    ViewComponent,
    UpdateTeamMemberComponent,
    DisclosureComponent,
    EnvironmentDisclosureComponent,
    SocialDisclosureComponent,
    GovernanceDisclosureComponent,
    AddEmployeeDetailsComponent,
    AddNewWorkerHiresComponent,
    AddNewEmployeeHiresComponent,
    AddDirectorDetailsComponent,
    AddMaterialsUsedComponent,
    AddRecycledInputMaterialsComponent,
    CreateNewRegionComponent,
    AddEmployeeTurnoverComponent,
    AddWorkerTurnoverComponent,
    AddDifAbledEmployeesComponent,
    AddDifAbledWorkersComponent,
    AddEmployeeBenefitsComponent,
    AddWorkerBenefitsComponent,
    AddEmpDetailsComponent,
    AddBPDetailsComponent,
    AddConflictsInterestComponent,
    AddLawRegulationComponent,
    AddEmployeeRetirementBenefitsComponent,
    AddWorkerRetirementBenefitsComponent,
    AddNewInputMaterialComponent,
    AddRemunerationSalaryWagesComponent,
    AddAverageTrainingHoursComponent,
    AddEmployeeDiversityComponent,
    AddNonDiscriminationComponent,
    AddRightsOfIndigenousPeopleComponent,
    AddCloseCallsAndHighPotentialIncidentsComponent,
    AddHumanRightsAssessmentsComponent,
    AddHumanRightsAssessmentsChainPartnersComponent,
    AddProductRecallsComponent,
    AddConsumerComplaintsComponent,
    AddBreachesOfCustomerPrivacyLossOfDataComponent,
    AddReclaimedProductsComponent,
    AddNewReclaimedProductComponent,
    AddNewProductCategoryComponent,
    EsgTempComponent,
    AddComplaintsComponent,
    AddCorporateComponent,
    AddWaterWithdrawalComponent,
    AddWaterWithdrawalStressComponent,
    AddWaterDischargeComponent,
    AddWaterDischargeStressComponent,
    AddSpeciesAffectedComponent,
    AddImpactOfActivitiesComponent,
    AddEiaOfProjectComponent,
    AddAirEmissionComponent,
    AddEmployeeSkillUpgradeTrainingComponent,
    AddWorkersSkillUpgradeTrainingComponent,
    AddEmployeePerfomanceReviewComponent,
    AddWorkerPerfomanceReviewComponent,
    AddEmployeeTrainingOnHsMeasuresComponent,
    AddRatioSalaryRemunerationWomenMenComponent,
    AddWasteGeneratedMultipleComponent,
    AddWasteGeneratedComponent,
    AddWasteDirectedComponent,
    AddWasteDivertedComponent,
    AddNewTypeOfWasteComponent,
    AddDirectIndirectEmissionComponent,
    AddEmissionIntensityBaseComponent,
    AddUpstreamCategoryComponent,
    AddDownstreamCategoryComponent,
    AddEnergyConsumptionWithinComponent,
    AddEnergyConsumptionOutsideComponent,
    AddRenewableFuelComponent,
    AddNonRenewableFuelComponent,
    AddUpstreamCategoryOutsideComponent,
    AddDownstreamCategoryOutsideComponent,
    AddDisclosureTeamMemberComponent,
    NewTypeOfOdsComponent,
    NewTypeHrViolationsComponent,
    AddNewFuelNameComponent,
    DashboardComponent,
    GeneralDisclosureComponent,
    GeneralDisclosureRegisterComponent,
    GeneralDisclosureModifyComponent,
    GeneralDisclosureViewComponent,
    ReportParameterComponent
  ],
  imports: [
    CommonModule,
    EsgRoutingModule,
    LoadingScreenModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatRadioModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    NgbModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    QuillModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    NgbAccordionModule,
    PerfectScrollbarModule,
    NgApexchartsModule
  ],
   providers: [CurrencyPipe,
      {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
      }
    ],
})
export class EsgModule { }
