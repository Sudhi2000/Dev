import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddMaterialsUsedComponent } from './environment-disclosure-title-details/add-materials-used/add-materials-used.component';
import { MatDialog } from '@angular/material/dialog';
import { EsgService } from 'src/app/services/esg.service';
import Swal from 'sweetalert2';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AddRecycledInputMaterialsComponent } from './environment-disclosure-title-details/add-recycled-input-materials/add-recycled-input-materials.component';
import { AddReclaimedProductsComponent } from './environment-disclosure-title-details/add-reclaimed-products/add-reclaimed-products.component';
import { AddWaterWithdrawalComponent } from './environment-disclosure-title-details/add-water-withdrawal/add-water-withdrawal.component';
import { AddWaterWithdrawalStressComponent } from './environment-disclosure-title-details/add-water-withdrawal-stress/add-water-withdrawal-stress.component';
import { AddWaterDischargeComponent } from './environment-disclosure-title-details/add-water-discharge/add-water-discharge.component';
import { AddWaterDischargeStressComponent } from './environment-disclosure-title-details/add-water-discharge-stress/add-water-discharge-stress.component';
import { AddSpeciesAffectedComponent } from './environment-disclosure-title-details/add-species-affected/add-species-affected.component';
import { AddImpactOfActivitiesComponent } from './environment-disclosure-title-details/add-impact-of-activities/add-impact-of-activities.component';
import { AddEiaOfProjectComponent } from './environment-disclosure-title-details/add-eia-of-project/add-eia-of-project.component';
import { AddAirEmissionComponent } from './environment-disclosure-title-details/add-air-emission/add-air-emission.component';
import { AddWasteGeneratedMultipleComponent } from './environment-disclosure-title-details/add-waste-generated-multiple/add-waste-generated-multiple.component';
import { AddWasteDirectedComponent } from './environment-disclosure-title-details/add-waste-directed/add-waste-directed.component';
import { AddWasteDivertedComponent } from './environment-disclosure-title-details/add-waste-diverted/add-waste-diverted.component';
import { AddWasteGeneratedComponent } from './environment-disclosure-title-details/add-waste-generated/add-waste-generated.component';
import { AddDirectIndirectEmissionComponent } from './environment-disclosure-title-details/add-direct-indirect-emission/add-direct-indirect-emission.component';
import { AddEnergyConsumptionOutsideComponent } from './environment-disclosure-title-details/add-energy-consumption-outside/add-energy-consumption-outside.component';
import { AddEnergyConsumptionWithinComponent } from './environment-disclosure-title-details/add-energy-consumption-within/add-energy-consumption-within.component';
import { NewTypeOfOdsComponent } from './new-type-of-ods/new-type-of-ods.component';
import { AddEmissionIntensityBaseComponent } from './environment-disclosure-title-details/add-direct-indirect-emission/add-emission-intensity-base/add-emission-intensity-base.component';
import { AddUpstreamCategoryComponent } from './environment-disclosure-title-details/add-direct-indirect-emission/add-upstream-category/add-upstream-category.component';
import { AddDownstreamCategoryComponent } from './environment-disclosure-title-details/add-direct-indirect-emission/add-downstream-category/add-downstream-category.component';
// import { AddWasteGeneratedMultipleComponent } from './environment-disclosure-title-details/add-waste-generated-multiple/add-waste-generated-multiple.component';
@Component({
  selector: 'app-environment-disclosure',
  templateUrl: './environment-disclosure.component.html',
  styleUrls: ['./environment-disclosure.component.scss']
})
export class EnvironmentDisclosureComponent implements OnInit {
  environmentDisclosureForm: FormGroup;

  emissionofODS: FormGroup;
  emissionofODSarray: any;

  directEmission: FormGroup;
  directEmissionarray: any;
  UpstreamCategoriesarray: any[] = []
  newUpstreamCategoriesarray: any[] = []
  filteredUpstreamCategoriesarray: any[] = []
  DownstreamCategoriesarray: any[] = []
  filteredDownstreamCategoriesarray: any[] = []

  supplierEnvAssesment: FormGroup;
  supplierEnvAssesmentarray: any;

  WaterRecycled: FormGroup;
  WaterRecycledarray: any;

  ImpactAssessment: FormGroup;
  ImpactAssessmentarray: any;

  Habitat: FormGroup;
  Habitatarray: any;

  Compliance: FormGroup;
  Compliancearray: any;

  Negetive: FormGroup;
  Negetivearray: any;

  LifecycleAssessment: FormGroup;
  LifecycleAssessmentarray: any;

  @Input() data: any[] = [];
  @Input() currentTitles: any[] = [];
  @Input() roles: string;
  @Input() status: string;
  @Input() lov: any[] = [];
  @Input() refID: string;
  @Input() notes: any[] = [];
  @Input() disclosureMode: string;
  @Input() esgHead: boolean;
  @Input() userID: string;
  @Input() year: string;
  @Input() month: string;
  MaterialUsedDetails: any[] = []
  filteredMaterialUsedDetails: any[] = [];

  InputMaterialUsedDetails: any[] = []
  filteredInputMaterialUsedDetails: any[] = [];


  ReclaimedProductDetails: any[] = []
  filteredReclaimedProductDetails: any[] = [];

  WaterWithdrawalDetails: any[] = []
  filteredWaterWithdrawalDetails: any[] = [];

  WaterWithdrawalStressDetails: any[] = []
  filteredWaterWithdrawalStressDetails: any[] = [];

  WaterDischargeDetails: any[] = []
  filteredWaterDischargeDetails: any[] = [];

  WaterDischargeStressDetails: any[] = []
  filteredWaterDischargeStressDetails: any[] = [];

  SpeciesAffectedDetails: any[] = []
  filteredSpeciesAffectedDetails: any[] = [];

  ImpactofActivitiesDetails: any[] = []
  filteredImpactofActivitiesDetails: any[] = [];

  EIAodProjectsDetails: any[] = []
  filteredEIAodProjectsDetails: any[] = [];

  AirEmissionDetails: any[] = []
  filteredAirEmissionDetails: any[] = [];

  WasteGenertedDetails: any[] = []
  filteredWasteGenertedDetails: any[] = [];

  // WasteGenertedMultipleDetails: any[] = []
  // filteredWasteGenertedMultipleDetails: any[] = [];

  // WasteDirectedDetails: any[] = []
  // filteredWasteDirectedDetails: any[] = [];

  // WasteDivertedDetails: any[] = []
  // filteredWasteDivertedDetails: any[] = [];

  DirectEmissionDetails: any[] = []
  UpstreamDetails: any[] = []
  DownstreamDetails: any[] = []
  filteredDirectEmissionDetails: any[] = [];
  filteredUpstreamDetails: any[] = []
  filteredDownstreamDetails: any[] = []

  ConsumptionWithinDetails: any[] = []
  filteredConsumptionWithinDetails: any[] = [];

  ConsumptionOutsideDetails: any[] = []
  filteredConsumptionOutsideDetails: any[] = [];
  upStreamCategory: any[] = []
  downStreamCategory: any[] = []
  groupedData: any;
  RenewableFuelsarray: any[] = []
  nonRenewableFuelsarray: any[] = []

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
    private esgService: EsgService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.MaterialUsedDetails = []
    this.currentTitles = this.currentTitles.filter(item => item.esg_disclosure === this.refID);


    this.environmentDisclosureForm = this.formBuilder.group({
      ref_id: [''],
      title_ref_id: [''],
      year: [this.year],
      month: [this.month],
      material_used_notes: [''],
      input_material_used_notes: [''],
      reclaimed_product_notes: [''],
      water_withdrawal_notes: [''],
      water_stress_notes: [''],
      discharge_stress_notes: [''],
      water_withdrawal_to_notes: [''],
      water_discharge_to_notes: [''],
      status: [''],
      esg_environment_disclosure: [''],
      species_affected_notes: [''],
      impact_of_activities_notes: [''],
      eia_of_project_notes: [''],
      air_emission_notes: [''],
      waste_generated_notes: [''],

      energy_consumption_outside_notes: [''],
      energy_consumption_within_notes: [''],
    });

    this.directEmission = this.formBuilder.group({
      scope1: [null],
      scope1_unit: [this.lov[45]?.value[0].Value || ''],
      scope2: [null],
      scope2_unit: [this.lov[45]?.value[0].Value || ''],
      scope3: [''],
      upstream: [[]],
      downstream: [[]],
      emission_intensity_base: [''],
      emission_intensity_quantity: [''],
      emission_intensity_base_unit: [''],
      direct_emission_notes: [''],
    });
    this.emissionofODS = this.formBuilder.group({
      type_of_ods: [''],
      ods_quantity: [null],
      ods_unit: [this.lov[42].value[0].Value || ''],
      ods_notes: [''],
    });

    this.WaterRecycled = this.formBuilder.group({
      recycled_quantity: [null],
      recycled_unit: [this.lov[44].value[0].Value || ''],
      recycled_notes: [''],
    });

    this.supplierEnvAssesment = this.formBuilder.group({
      number_of_suppliers: [null],
      assessment_notes: [''],
    });

    this.ImpactAssessment = this.formBuilder.group({
      no_of_partners: [null],
      no_of_partners_for_impact: [null],
      impact_assessment_notes: [''],
    });

    this.Habitat = this.formBuilder.group({
      habitat_area_size: [null],
      habitat_area_status: [''],
      habitat_unit: [''],
      habitate_note: [''],
    });

    this.Compliance = this.formBuilder.group({
      no_of_incident: [null],
      type_of_penalty: [''],
      amount: [null],
      details_of_noncompliance: [''],
      corrective_actions: [''],
      name_of_laws: [''],
      compliance_notes: [''],
    });

    this.Negetive = this.formBuilder.group({
      assessed_for_environmental_impacts: [null],
      potential_negetive_impact: [null],
      improvements_agreed: [null],
      relationships_terminated: [null],
      termination_of_relationship_details: [''],
      negetive_impact_notes: [''],
    });

    this.LifecycleAssessment = this.formBuilder.group({
      nic_code: [''],
      name_of_product: [''],
      turnover_contributed: [''],
      boundary: [''],
      conducted_by: [''],
      results_communicated: [''],
      details: [''],
      corrective_actions: [''],
      lifecycle_notes: [''],
    });

    this.data.forEach(title => {
      const matchingNotes = this.notes.find(note => note.title_id === title.reference_id);

      if (title.title === 'Materials used by weight or volume' && matchingNotes) {
        this.environmentDisclosureForm.get('material_used_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Recycled input materials used' && matchingNotes) {
        this.environmentDisclosureForm.get('input_material_used_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Reclaimed products and their packaging material' && matchingNotes) {
        this.environmentDisclosureForm.get('reclaimed_product_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Water withdrawal from all areas' && matchingNotes) {
        this.environmentDisclosureForm.get('water_withdrawal_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Water withdrawal from all areas with water stress' && matchingNotes) {
        this.environmentDisclosureForm.get('water_stress_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Water discharge to all areas' && matchingNotes) {
        this.environmentDisclosureForm.get('water_discharge_to_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Water discharge to all areas with water stress' && matchingNotes) {
        this.environmentDisclosureForm.get('discharge_stress_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Species affected by Operations' && matchingNotes) {
        this.environmentDisclosureForm.get('species_affected_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Impact of Activities on Protected/High Biodiversity Areas' && matchingNotes) {
        this.environmentDisclosureForm.get('impact_of_activities_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Environmental Impact Assessments (EIA) of Projects' && matchingNotes) {
        this.environmentDisclosureForm.get('eia_of_project_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Nitrogen oxides (NOx), sulfur oxides (SOx), and other significant air emissions' && matchingNotes) {
        this.environmentDisclosureForm.get('air_emission_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Waste generated' && matchingNotes) {
        this.environmentDisclosureForm.get('waste_generated_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Direct and Indirect Emission' && matchingNotes) {
        this.environmentDisclosureForm.get('direct_emission_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Energy consumption Outside the organization' && matchingNotes) {
        this.environmentDisclosureForm.get('energy_consumption_outside_notes')?.setValue(matchingNotes.note);
      }
      if (title.title === 'Energy consumption within the organization' && matchingNotes) {
        this.environmentDisclosureForm.get('energy_consumption_within_notes')?.setValue(matchingNotes.note);
      }

      const titleStatus = this.getStatusForTitle(title.title);
      if (titleStatus) {
        title.status = titleStatus;
      }
    });

    const titleOrder = ["Materials used by weight or volume", "Recycled input materials used", "Reclaimed products and their packaging material", "Energy consumption within the organization", "Energy consumption Outside the organization", "Water withdrawal from all areas", "Water withdrawal from all areas with water stress", "Water discharge to all areas", "Water discharge to all areas with water stress", "Water Recycled", "Direct and Indirect Emission", "Emissions of ozone-depleting substances (ODS)", "Nitrogen oxides (NOx), sulfur oxides (SOx), and other significant air emissions", "Waste generated", "Impact of Activities on Protected/High Biodiversity Areas", "Habitat Protected or Restored", "Species affected by Operations", "Life Cycle Assessment of Products/Services", "Environmental Impact Assessments (EIA) of Projects", "Environmental Impact Assessment of Value Chain Partners", "Supplier Environmental Assessment", "Negative Environmental Impacts in the Supply Chain", "Compliance with Environmental Laws and Regulations"];

    const themeOrder = ["Materials", "Energy", "Water", "Emission", "Waste", "Biodiversity", "Environmental Supply Chain Management", "Other Environmental Factors"];

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


    this.filteredMaterialUsedDetails = []
    this.filteredMaterialUsedDetails = this.filterData('esg_env_materials_used');
    this.filteredInputMaterialUsedDetails = []
    this.filteredInputMaterialUsedDetails = this.filterData('esg_env_recycled_materials');
    this.filteredReclaimedProductDetails = []
    this.filteredReclaimedProductDetails = this.filterData('esg_env_reclaimed_products');
    this.filteredWaterWithdrawalDetails = []
    this.filteredWaterWithdrawalDetails = this.filterData('esg_env_water_withdrawals');
    this.filteredWaterWithdrawalStressDetails = []
    this.filteredWaterWithdrawalStressDetails = this.filterData('esg_env_water_stresses');
    this.filteredWaterDischargeDetails = []
    this.filteredWaterDischargeDetails = this.filterData('esg_env_water_discharges');
    this.filteredWaterDischargeStressDetails = []
    this.filteredWaterDischargeStressDetails = this.filterData('esg_env_discharge_stresses');
    this.filteredSpeciesAffectedDetails = []
    this.filteredSpeciesAffectedDetails = this.filterData('esg_env_species_affecteds');
    this.filteredImpactofActivitiesDetails = []
    this.filteredImpactofActivitiesDetails = this.filterData('esg_env_impact_of_activities');
    this.filteredEIAodProjectsDetails = []
    this.filteredEIAodProjectsDetails = this.filterData('esg_env_eia_of_projects');
    this.filteredAirEmissionDetails = []
    this.filteredAirEmissionDetails = this.filterData('esg_env_air_emissions');
    this.filteredWasteGenertedDetails = []
    this.filteredWasteGenertedDetails = this.filterData('esg_env_waste_generateds');
    // this.filteredWasteGenertedMultipleDetails = []
    // this.filteredWasteGenertedMultipleDetails = this.filterData('esg_env_type_of_wastes');
    // this.filteredWasteDirectedDetails = []
    // this.filteredWasteDirectedDetails = this.filterData('esg_env_waste_directeds');
    // this.filteredWasteDivertedDetails = []
    // this.filteredWasteDivertedDetails = this.filterData('esg_env_waste_diverteds');
    this.filteredDirectEmissionDetails = []
    this.filteredDirectEmissionDetails = this.filterData('esg_env_direct_emissions');
    this.filteredDownstreamDetails = []
    this.filteredDownstreamDetails = []
    this.filteredUpstreamDetails = []
    this.filteredConsumptionWithinDetails = []
    this.filteredConsumptionWithinDetails = this.filterData('esg_env_energy_withins');
    this.filteredConsumptionOutsideDetails = []
    this.filteredConsumptionOutsideDetails = this.filterData('esg_env_energy_outsides');

    this.directEmissionarray = this.currentTitles[0].esg_env_direct_emissions
    this.emissionofODSarray = this.currentTitles[0].esg_env_ods_emissions
    this.supplierEnvAssesmentarray = this.currentTitles[0].esg_supplier_env_asmnts
    this.WaterRecycledarray = this.currentTitles[0].esg_env_water_recycleds
    this.ImpactAssessmentarray = this.currentTitles[0].esg_env_impact_assessments
    this.Habitatarray = this.currentTitles[0].esg_env_habitat_protecteds
    this.Compliancearray = this.currentTitles[0].esg_env_compliance_laws
    this.Negetivearray = this.currentTitles[0].esg_env_negetive_impacts
    this.LifecycleAssessmentarray = this.currentTitles[0].esg_env_lifecycle_asmnts

    if (this.directEmissionarray.length > 0) {
      if (this.directEmissionarray[0].esg_env_upstream_categories) {
        this.filteredUpstreamCategoriesarray = this.directEmissionarray[0].esg_env_upstream_categories
      }
      if (this.directEmissionarray[0].esg_env_downstream_categories) {
        this.filteredDownstreamCategoriesarray = this.directEmissionarray[0].esg_env_downstream_categories
      }

      this.directEmission.controls['scope1'].setValue(this.directEmissionarray[0]?.scope1)
      this.directEmission.controls['scope1_unit'].setValue(this.directEmissionarray[0]?.scope1_unit)
      this.directEmission.controls['scope2'].setValue(this.directEmissionarray[0]?.scope2)
      this.directEmission.controls['scope2_unit'].setValue(this.directEmissionarray[0]?.scope2_unit)
      this.directEmission.controls['scope3'].setValue(this.directEmissionarray[0]?.scope3)
      this.directEmission.controls['upstream'].setValue(this.directEmissionarray[0]?.upstream)
      this.directEmission.controls['downstream'].setValue(this.directEmissionarray[0]?.downstream)
      this.directEmission.controls['emission_intensity_base'].setValue(this.directEmissionarray[0]?.emission_intensity_base)
      this.directEmission.controls['emission_intensity_quantity'].setValue(this.directEmissionarray[0]?.emission_intensity_quantity)
      this.directEmission.controls['emission_intensity_base_unit'].setValue(this.directEmissionarray[0]?.emission_intensity_base_unit)
    }
    if (this.emissionofODSarray.length > 0) {
      this.emissionofODS.controls['type_of_ods'].setValue(this.emissionofODSarray[0]?.type_of_ods)
      this.emissionofODS.controls['ods_quantity'].setValue(this.emissionofODSarray[0]?.ods_quantity)
      this.emissionofODS.controls['ods_unit'].setValue(this.emissionofODSarray[0]?.ods_unit)
      this.emissionofODS.controls['ods_notes'].setValue(this.emissionofODSarray[0]?.ods_notes)
    }

    if (this.supplierEnvAssesmentarray.length > 0) {
      this.supplierEnvAssesment.controls['number_of_suppliers'].setValue(this.supplierEnvAssesmentarray[0].number_of_suppliers)
      this.supplierEnvAssesment.controls['assessment_notes'].setValue(this.supplierEnvAssesmentarray[0].assessment_notes)
    }

    if (this.WaterRecycledarray.length > 0) {
      this.WaterRecycled.controls['recycled_quantity'].setValue(this.WaterRecycledarray[0].recycled_quantity)
      this.WaterRecycled.controls['recycled_unit'].setValue(this.WaterRecycledarray[0].recycled_unit)
      this.WaterRecycled.controls['recycled_notes'].setValue(this.WaterRecycledarray[0].recycled_notes)
    }

    if (this.ImpactAssessmentarray.length > 0) {
      this.ImpactAssessment.controls['no_of_partners'].setValue(this.ImpactAssessmentarray[0].no_of_partners)
      this.ImpactAssessment.controls['no_of_partners_for_impact'].setValue(this.ImpactAssessmentarray[0].no_of_partners_for_impact)
      this.ImpactAssessment.controls['impact_assessment_notes'].setValue(this.ImpactAssessmentarray[0].impact_assessment_notes)
    }

    if (this.Habitatarray.length > 0) {
      this.Habitat.controls['habitat_area_size'].setValue(this.Habitatarray[0].habitat_area_size)
      this.Habitat.controls['habitat_area_status'].setValue(this.Habitatarray[0].habitat_area_status)
      this.Habitat.controls['habitat_unit'].setValue(this.Habitatarray[0].habitat_unit)
      this.Habitat.controls['habitate_note'].setValue(this.Habitatarray[0].habitate_note)
    }

    if (this.Compliancearray.length > 0) {
      this.Compliance.controls['no_of_incident'].setValue(this.Compliancearray[0].no_of_incident)
      this.Compliance.controls['type_of_penalty'].setValue(this.Compliancearray[0].type_of_penalty)
      this.Compliance.controls['amount'].setValue(this.Compliancearray[0].amount)
      this.Compliance.controls['details_of_noncompliance'].setValue(this.Compliancearray[0].details_of_noncompliance)
      this.Compliance.controls['corrective_actions'].setValue(this.Compliancearray[0].corrective_actions)
      this.Compliance.controls['name_of_laws'].setValue(this.Compliancearray[0].name_of_laws)
      this.Compliance.controls['compliance_notes'].setValue(this.Compliancearray[0].compliance_notes)
    }

    if (this.Negetivearray.length > 0) {
      this.Negetive.controls['assessed_for_environmental_impacts'].setValue(this.Negetivearray[0].assessed_for_environmental_impacts)
      this.Negetive.controls['potential_negetive_impact'].setValue(this.Negetivearray[0].potential_negetive_impact)
      this.Negetive.controls['improvements_agreed'].setValue(this.Negetivearray[0].improvements_agreed)
      this.Negetive.controls['relationships_terminated'].setValue(this.Negetivearray[0].relationships_terminated)
      this.Negetive.controls['termination_of_relationship_details'].setValue(this.Negetivearray[0].termination_of_relationship_details)
      this.Negetive.controls['negetive_impact_notes'].setValue(this.Negetivearray[0].negetive_impact_notes)
    }

    if (this.LifecycleAssessmentarray.length > 0) {
      this.LifecycleAssessment.controls['nic_code'].setValue(this.LifecycleAssessmentarray[0].nic_code)
      this.LifecycleAssessment.controls['name_of_product'].setValue(this.LifecycleAssessmentarray[0].name_of_product)
      this.LifecycleAssessment.controls['turnover_contributed'].setValue(this.LifecycleAssessmentarray[0].turnover_contributed)
      this.LifecycleAssessment.controls['boundary'].setValue(this.LifecycleAssessmentarray[0].boundary)
      this.LifecycleAssessment.controls['conducted_by'].setValue(this.LifecycleAssessmentarray[0].conducted_by)
      this.LifecycleAssessment.controls['results_communicated'].setValue(this.LifecycleAssessmentarray[0].results_communicated)
      this.LifecycleAssessment.controls['details'].setValue(this.LifecycleAssessmentarray[0].details)
      this.LifecycleAssessment.controls['corrective_actions'].setValue(this.LifecycleAssessmentarray[0].corrective_actions)
      this.LifecycleAssessment.controls['lifecycle_notes'].setValue(this.LifecycleAssessmentarray[0].lifecycle_notes)
    }
    if (this.disclosureMode === 'view') {
      this.environmentDisclosureForm.disable()
      this.directEmission.disable()
      this.emissionofODS.disable()
      this.WaterRecycled.disable()
      this.supplierEnvAssesment.disable()
      this.ImpactAssessment.disable()
      this.Habitat.disable()
      this.Compliance.disable()
      this.Negetive.disable()
      this.LifecycleAssessment.disable()
    }
  }
  hasDataForTitle(title: any) {
    switch (title) {
      case "Materials used by weight or volume":
        return this.filteredMaterialUsedDetails.length > 0;

      case "Recycled input materials used":
        return this.filteredInputMaterialUsedDetails.length > 0;

      case "Reclaimed products and their packaging material":
        return this.filteredReclaimedProductDetails.length > 0;

      case "Energy consumption within the organization":
        return this.filteredConsumptionWithinDetails.length > 0;

      case "Energy consumption Outside the organization":
        return this.filteredConsumptionOutsideDetails.length > 0;

      case "Water withdrawal from all areas":
        return this.filteredWaterWithdrawalDetails.length > 0;

      case "Water withdrawal from all areas with water stress":
        return this.filteredWaterWithdrawalStressDetails.length > 0;

      case "Water discharge to all areas":
        return this.filteredWaterDischargeDetails.length > 0;

      case "Water discharge to all areas with water stress":
        return this.filteredWaterDischargeStressDetails.length > 0;

      case "Water Recycled":
        return this.WaterRecycledarray?.length > 0;

      case "Direct and Indirect Emission":
        return this.filteredDirectEmissionDetails.length > 0;

      case "Emissions of ozone-depleting substances (ODS)":
        return this.emissionofODSarray.length > 0;

      case "Nitrogen oxides (NOx), sulfur oxides (SOx), and other significant air emissions":
        return this.filteredAirEmissionDetails.length > 0;

      case "Waste generated":
        return this.filteredWasteGenertedDetails.length > 0;
      // || this.filteredWasteGenertedMultipleDetails.length > 0 || this.filteredWasteDirectedDetails.length > 0 || this.filteredWasteDivertedDetails.length > 0
      case "Impact of Activities on Protected/High Biodiversity Areas":
        return this.filteredImpactofActivitiesDetails.length > 0;

      case "Habitat Protected or Restored":
        return this.Habitatarray?.length > 0;

      case "Species affected by Operations":
        return this.filteredSpeciesAffectedDetails.length > 0;

      case "Life Cycle Assessment of Products/Services":
        return this.LifecycleAssessmentarray.length > 0;

      case "Environmental Impact Assessments (EIA) of Projects":
        return this.filteredEIAodProjectsDetails.length > 0;

      case "Environmental Impact Assessment of Value Chain Partners":
        return this.ImpactAssessmentarray.length > 0;

      case "Supplier Environmental Assessment":
        return this.supplierEnvAssesmentarray.length > 0;

      case "Negative Environmental Impacts in the Supply Chain":
        return this.Negetivearray.length > 0;

      case "Compliance with Environmental Laws and Regulations":
        return this.Compliancearray.length > 0;

      default:
        return false;
    }
  }
  isButtonVisible(theme: any): boolean {
    const rolesArray = this.roles?.split(',') || [];
    return (
      ((rolesArray.includes('Contributor') && theme.status === 'Open') || this.esgHead === true) &&
      this.disclosureMode !== 'view'
    );
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

  getStatusForTheme(theme: string): string | undefined {

    const currentTitle = this.currentTitles[0];
    switch (theme) {
      case 'Materials':
        return currentTitle.material_theme_status;
      case 'Energy':
        return currentTitle.energy_theme_status;
      case 'Water':
        return currentTitle.water_theme_status;
      case 'Emission':
        return currentTitle.emission_theme_status;
      case 'Waste':
        return currentTitle.waste_theme_status;
      case 'Biodiversity':
        return currentTitle.biodiversity_theme_status;
      case 'Other Environmental Factors':
        return currentTitle.other_env_factors_theme_status;
      case 'Environmental Supply Chain Management':
        return currentTitle.env_supply_chain_theme_status;
      default:
        return undefined;
    }
  }

  updateMaterialThemeStatus(status: any, theme: any) {

    const formData = new FormData();
    formData.append('material_theme_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateEnvDisclosureStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        theme.status = status;
        Swal.fire({
          icon: 'success',
          title:
            status === 'Open' ? 'Material theme details Re-Opened' :
              status === 'Submitted for Review' ? 'Material theme details Submitted for Review' :
                status === 'Submitted for Approval' ? 'Material theme details Submitted for Approval' :
                  status === 'Review Failed' ? 'Material theme details  Review Failed' :
                    status === 'Approved' ? 'Material theme details  Approved' :
                      status === 'Rejected' ? 'Material theme details  Rejected' : ''

        });

      }
    });
  }

  updateEnergyThemeStatus(status: any, theme: any) {

    const formData = new FormData();
    formData.append('energy_theme_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateEnvDisclosureStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        theme.status = status;
        Swal.fire({
          icon: 'success',
          title:
            status === 'Open' ? 'Energy theme details Re-Opened' :
              status === 'Submitted for Review' ? 'Energy theme details Submitted for Review' :
                status === 'Submitted for Approval' ? 'Energy theme details Submitted for Approval' :
                  status === 'Review Failed' ? 'Energy theme details  Review Failed' :
                    status === 'Approved' ? 'Energy theme details  Approved' :
                      status === 'Rejected' ? 'Energy theme details  Rejected' : ''
        });

      }
    });
  }

  updateWaterThemeStatus(status: any, theme: any) {

    const formData = new FormData();
    formData.append('water_theme_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateEnvDisclosureStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        theme.status = status;
        Swal.fire({
          icon: 'success',
          title:
            status === 'Open' ? 'Water theme details Re-Opened' :
              status === 'Submitted for Review' ? 'Water theme details Submitted for Review' :
                status === 'Submitted for Approval' ? 'Water theme details Submitted for Approval' :
                  status === 'Review Failed' ? 'Water theme details  Review Failed' :
                    status === 'Approved' ? 'Water theme details  Approved' :
                      status === 'Rejected' ? 'Water theme details  Rejected' : ''
        });

      }
    });
  }

  updateEmissionThemeStatus(status: any, theme: any) {


    const formData = new FormData();
    formData.append('emission_theme_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateEnvDisclosureStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        theme.status = status;
        Swal.fire({
          icon: 'success',
          title:
            status === 'Open' ? 'Emission theme details Re-Opened' :
              status === 'Submitted for Review' ? 'Emission theme details Submitted for Review' :
                status === 'Submitted for Approval' ? 'Emission theme details Submitted for Approval' :
                  status === 'Review Failed' ? 'Emission theme details  Review Failed' :
                    status === 'Approved' ? 'Emission theme details  Approved' :
                      status === 'Rejected' ? 'Emission theme details  Rejected' : ''
        });

      }
    });
  }

  updateWasteThemeStatus(status: any, theme: any) {


    const formData = new FormData();
    formData.append('waste_theme_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateEnvDisclosureStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        theme.status = status;
        Swal.fire({
          icon: 'success',
          title:
            status === 'Open' ? 'Water theme details Re-Opened' :
              status === 'Submitted for Review' ? 'Water theme details Submitted for Review' :
                status === 'Submitted for Approval' ? 'Water theme details Submitted for Approval' :
                  status === 'Review Failed' ? 'Water theme details  Review Failed' :
                    status === 'Approved' ? 'Water theme details  Approved' :
                      status === 'Rejected' ? 'Water theme details  Rejected' : ''
        });

      }
    });
  }

  updateBiodiversityThemeStatus(status: any, theme: any) {


    const formData = new FormData();
    formData.append('biodiversity_theme_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateEnvDisclosureStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        theme.status = status;
        Swal.fire({
          icon: 'success',
          title:
            status === 'Open' ? 'Biodiversity theme details Re-Opened' :
              status === 'Submitted for Review' ? 'Biodiversity theme details Submitted for Review' :
                status === 'Submitted for Approval' ? 'Biodiversity theme details Submitted for Approval' :
                  status === 'Review Failed' ? 'Biodiversity theme details  Review Failed' :
                    status === 'Approved' ? 'Biodiversity theme details  Approved' :
                      status === 'Rejected' ? 'Biodiversity theme details  Rejected' : ''
        });

      }
    });
  }

  updateOtherEnvFactorsThemeStatus(status: any, theme: any) {


    const formData = new FormData();
    formData.append('other_env_factors_theme_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateEnvDisclosureStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        theme.status = status;
        Swal.fire({
          icon: 'success',
          title:
            status === 'Open' ? 'Other Environmental Factors theme details Re-Opened' :
              status === 'Submitted for Review' ? 'Other Environmental Factors theme details Submitted for Review' :
                status === 'Submitted for Approval' ? 'Other Environmental Factors theme details Submitted for Approval' :
                  status === 'Review Failed' ? 'Other Environmental Factors theme details  Review Failed' :
                    status === 'Approved' ? 'Other Environmental Factors theme details  Approved' :
                      status === 'Rejected' ? 'Other Environmental Factors theme details  Rejected' : ''
        });

      }
    });
  }

  updateEnvSupplyCHainThemeStatus(status: any, theme: any) {


    const formData = new FormData();
    formData.append('env_supply_chain_theme_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateEnvDisclosureStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        theme.status = status;
        Swal.fire({
          icon: 'success',
          title:
            status === 'Open' ? 'Environmental Supply Chain Management theme details Re-Opened' :
              status === 'Submitted for Review' ? 'Environmental Supply Chain Management theme details Submitted for Review' :
                status === 'Submitted for Approval' ? 'Environmental Supply Chain Management theme details Submitted for Approval' :
                  status === 'Review Failed' ? 'Environmental Supply Chain Management theme details  Review Failed' :
                    status === 'Approved' ? 'Environmental Supply Chain Management theme details  Approved' :
                      status === 'Rejected' ? 'Environmental Supply Chain Management theme details  Rejected' : ''
        });

      }
    });
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

  getStatusForTitle(titleName: string): string | undefined {

    const currentTitle = this.currentTitles[0];  // assuming there's only one object in the currentTitles array
    switch (titleName) {
      case 'Materials used by weight or volume':
        return currentTitle.materials_used_status;
      case 'Recycled input materials used':
        return currentTitle.recycled_materials_used_status;
      case 'Reclaimed products and their packaging material':
        return currentTitle.reclaimed_product_status;
      default:
        return undefined;
    }
  }
  //#region Materials used by weight or volume
  addMaterialUsed(data: any) {
    this.dialog.open(AddMaterialsUsedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {
        this.MaterialUsedDetails.push(data)
        // this.filteredMaterialUsedDetails.push(data)
      }
    })
  }

  ModifyMaterialUsed(data: any, index?: number) {
    this.dialog.open(AddMaterialsUsedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredMaterialUsedDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredMaterialUsedDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.MaterialUsedDetails[index] = updatedData;
        }
      }
    })
  }

  viewMaterialUsed(data: any, index?: number) {
    this.dialog.open(AddMaterialsUsedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteMaterialUsed(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvMaterialDetails(data.id).subscribe({
        next: (result: any) => {
          this.filteredMaterialUsedDetails = this.filteredMaterialUsedDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting employee details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Material details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredMaterialUsedDetails.splice(index, 1);
      this.MaterialUsedDetails.splice(index, 1);
      const statusText = "Material details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  submitMaterialDetails(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    // if (!this.MaterialUsedDetails || this.MaterialUsedDetails.length == 0) {
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    // }
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.MaterialUsedDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvMaterialDetails(formData).subscribe({
      next: (result: any) => {
        this.filteredMaterialUsedDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredMaterialUsedDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        title.status = status
        this.MaterialUsedDetails = []
        Swal.close()
        Swal.fire({
          icon: 'success',
          title: 'Material Details Saved',
        });

      }
    })

  }

  updateMaterialDetailsStatus(status: any, title: any) {

    const formData = new FormData();
    formData.append('materials_used_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGEnvDisStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;
        Swal.fire({
          icon: 'success',
          title:
            status === 'Submitted for Approval' ? 'Material Details Submitted for Approval' :
              status === 'Review Failed' ? 'Material Details Review Failed' :
                status === 'Approved' ? 'Material Details Approved' :
                  status === 'Rejected' ? 'Material Details Rejected' : ''
        });

      }
    });
  }
  //#endregion

  //#region Recycled input materials used
  addInputMaterialUsed(data: any) {
    this.dialog.open(AddRecycledInputMaterialsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {
        this.InputMaterialUsedDetails.push(data)
        // this.filteredInputMaterialUsedDetails.push(data)
      }
    })
  }

  ModifyInputMaterialUsed(data: any, index?: number) {
    this.dialog.open(AddRecycledInputMaterialsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredInputMaterialUsedDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredInputMaterialUsedDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.InputMaterialUsedDetails[index] = updatedData;
        }
      }
    })
  }

  viewInputMaterialUsed(data: any, index?: number) {
    this.dialog.open(AddRecycledInputMaterialsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteInputMaterialUsed(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvInputMaterialDetails(data.id).subscribe({
        next: (result: any) => {
          this.filteredInputMaterialUsedDetails = this.filteredInputMaterialUsedDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting employee details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Recycled Input Material details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredInputMaterialUsedDetails.splice(index, 1);
      this.InputMaterialUsedDetails.splice(index, 1);
      const statusText = "Recycled Input Material details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  submitInputMaterialDetails(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.InputMaterialUsedDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvInputMaterialDetails(formData).subscribe({
      next: (result: any) => {
        this.filteredInputMaterialUsedDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredInputMaterialUsedDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        title.status = status
        this.InputMaterialUsedDetails = []
        Swal.close()
        Swal.fire({
          icon: 'success',
          title: 'Recycled Input Material Details Saved',
        });

      }
    })
  }

  updateInputMaterialDetailsStatus(status: any, title: any) {

    const formData = new FormData();
    formData.append('recycled_materials_used_status', status);
    formData.append('ref_id', this.refID);
    this.esgService.updateESGEnvDisStatus(formData).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        title.status = status;
        Swal.fire({
          icon: 'success',
          title:
            status === 'Submitted for Approval' ? 'Recycled Input Material Details Submitted for Approval' :
              status === 'Review Failed' ? 'Recycled Input Material Details Review Failed' :
                status === 'Approved' ? 'Recycled Input Material Details Approved' :
                  status === 'Rejected' ? 'Recycled Input Material Details Rejected' : ''
        });

      }
    });
  }
  //#endregion

  //#region Reclaimed products and their packaging material

  addReclaimedProduct(data: any) {
    this.dialog.open(AddReclaimedProductsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {
        this.ReclaimedProductDetails.push(data)
        // this.filteredReclaimedProductDetails.push(data)
      }
    })
  }

  ModifyReclaimedProduct(data: any, index?: number) {
    this.dialog.open(AddReclaimedProductsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredReclaimedProductDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredReclaimedProductDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.ReclaimedProductDetails[index] = updatedData;
        }
      }
    })
  }

  viewReclaimedProduct(data: any, index?: number) {
    this.dialog.open(AddReclaimedProductsComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteReclaimedProduct(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvReclaimedProduct(data.id).subscribe({
        next: (result: any) => {
          this.filteredReclaimedProductDetails = this.filteredReclaimedProductDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting product/material details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Product/Material details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredReclaimedProductDetails.splice(index, 1);
      this.ReclaimedProductDetails.splice(index, 1);
      const statusText = "Product/Material details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  submitReclaimedProductDetails(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.ReclaimedProductDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvReclaimedProduct(formData).subscribe({
      next: (result: any) => {
        this.filteredReclaimedProductDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredReclaimedProductDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        this.ReclaimedProductDetails = []
        Swal.fire({
          icon: 'success',
          title: 'product/material Details Saved',
        });

      }
    })
  }
  //#endregion

  //#region Water withdrawal from all areas


  addWaterWithdrawal(data: any) {
    this.dialog.open(AddWaterWithdrawalComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {
        this.WaterWithdrawalDetails.push(data)
        // this.filteredWaterWithdrawalDetails.push(data)
      }
    })
  }

  ModifyWaterWithdrawal(data: any, index?: number) {
    this.dialog.open(AddWaterWithdrawalComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredWaterWithdrawalDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredWaterWithdrawalDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.WaterWithdrawalDetails[index] = updatedData;
        }
      }
    })
  }

  viewWaterWithdrawal(data: any, index?: number) {
    this.dialog.open(AddWaterWithdrawalComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteWaterWithdrawal(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvWaterwithdrawal(data.id).subscribe({
        next: (result: any) => {
          this.filteredWaterWithdrawalDetails = this.filteredWaterWithdrawalDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Water withdrawal details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Water withdrawal details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredWaterWithdrawalDetails.splice(index, 1);
      this.WaterWithdrawalDetails.splice(index, 1);
      const statusText = "Water withdrawal details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  submitWaterWithdrawal(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.WaterWithdrawalDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvWaterwithdrawal(formData).subscribe({
      next: (result: any) => {
        this.filteredWaterWithdrawalDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredWaterWithdrawalDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        this.WaterWithdrawalDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Water withdrawal Details Saved',
        });

      }
    })
  }

  //#endregion

  //#region Water withdrawal from all areas with water stress

  addWaterWithdrawalStress(data: any) {
    this.dialog.open(AddWaterWithdrawalStressComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {
        this.WaterWithdrawalStressDetails.push(data)
        // this.filteredWaterWithdrawalStressDetails.push(data)
      }
    })
  }

  ModifyWaterWithdrawalStress(data: any, index?: number) {
    this.dialog.open(AddWaterWithdrawalStressComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredWaterWithdrawalStressDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredWaterWithdrawalStressDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.WaterWithdrawalStressDetails[index] = updatedData;
        }
      }
    })
  }

  viewWaterWithdrawalStress(data: any, index?: number) {
    this.dialog.open(AddWaterWithdrawalStressComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteWaterWithdrawalStress(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvWaterwithdrawalStress(data.id).subscribe({
        next: (result: any) => {
          this.filteredWaterWithdrawalStressDetails = this.filteredWaterWithdrawalStressDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Water withdrawal details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Water withdrawal details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredWaterWithdrawalStressDetails.splice(index, 1);
      this.WaterWithdrawalStressDetails.splice(index, 1);
      const statusText = "Water withdrawal details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  submitWaterWithdrawalStress(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.WaterWithdrawalStressDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvWaterwithdrawalStress(formData).subscribe({
      next: (result: any) => {
        this.filteredWaterWithdrawalStressDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredWaterWithdrawalStressDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        this.WaterWithdrawalStressDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Water withdrawal Details Saved',
        });

      }
    })
  }

  //#endregion

  //#region  Water discharge to all areas


  addWaterDischarge(data: any) {
    this.dialog.open(AddWaterDischargeComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {
        this.WaterDischargeDetails.push(data)
        // this.filteredWaterDischargeDetails.push(data)
      }
    })
  }

  ModifyWaterDischarge(data: any, index?: number) {
    this.dialog.open(AddWaterDischargeComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredWaterDischargeDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredWaterDischargeDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.WaterDischargeDetails[index] = updatedData;
        }
      }
    })
  }

  viewWaterDischarge(data: any, index?: number) {
    this.dialog.open(AddWaterDischargeComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteWaterDischarge(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvWaterdischarge(data.id).subscribe({
        next: (result: any) => {
          this.filteredWaterDischargeDetails = this.filteredWaterDischargeDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Water withdrawal details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Water withdrawal details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredWaterDischargeDetails.splice(index, 1);
      this.WaterDischargeDetails.splice(index, 1);
      const statusText = "Water withdrawal details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  submitWaterDischarge(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.WaterDischargeDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvWaterdischarge(formData).subscribe({
      next: (result: any) => {
        this.filteredWaterDischargeDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredWaterDischargeDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        this.WaterDischargeDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Water withdrawal Details Saved',
        });

      }
    })
  }


  //#endregion

  //#region Water discharge to all areas with water stress


  addWaterDischargeStress(data: any) {
    this.dialog.open(AddWaterDischargeStressComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {
        this.WaterDischargeStressDetails.push(data)
        // this.filteredWaterDischargeStressDetails.push(data)
      }
    })
  }

  ModifyWaterDischargeStress(data: any, index?: number) {
    this.dialog.open(AddWaterDischargeStressComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredWaterDischargeStressDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredWaterDischargeStressDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.WaterDischargeStressDetails[index] = updatedData;
        }
      }
    })
  }

  viewWaterDischargeStress(data: any, index?: number) {
    this.dialog.open(AddWaterDischargeStressComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteWaterDischargeStress(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvWaterdischargeStress(data.id).subscribe({
        next: (result: any) => {
          this.filteredWaterDischargeStressDetails = this.filteredWaterDischargeStressDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Water withdrawal details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Water withdrawal details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredWaterDischargeStressDetails.splice(index, 1);
      this.WaterDischargeStressDetails.splice(index, 1);
      const statusText = "Water withdrawal details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  submitWaterDischargeStress(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.WaterDischargeStressDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvWaterdischargeStress(formData).subscribe({
      next: (result: any) => {
        this.filteredWaterDischargeStressDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredWaterDischargeStressDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        this.WaterDischargeStressDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Water withdrawal Details Saved',
        });

      }
    })
  }


  //#endregion

  //#region Species Affected

  addSpeciesAffected(data: any) {
    this.dialog.open(AddSpeciesAffectedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {
        this.SpeciesAffectedDetails.push(data)
        // this.filteredSpeciesAffectedDetails.push(data)
      }
    })
  }

  ModifySpeciesAffected(data: any, index?: number) {
    this.dialog.open(AddSpeciesAffectedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredSpeciesAffectedDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredSpeciesAffectedDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.SpeciesAffectedDetails[index] = updatedData;
        }
      }
    })
  }

  viewSpeciesAffected(data: any, index?: number) {
    this.dialog.open(AddSpeciesAffectedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteSpeciesAffected(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvSpeciesAffected(data.id).subscribe({
        next: (result: any) => {
          this.filteredSpeciesAffectedDetails = this.filteredSpeciesAffectedDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Species Affected details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Species Affected details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredSpeciesAffectedDetails.splice(index, 1);
      this.SpeciesAffectedDetails.splice(index, 1);
      const statusText = "Species Affected details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  submitSpeciesAffected(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.SpeciesAffectedDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvSpeciesAffected(formData).subscribe({
      next: (result: any) => {
        this.filteredSpeciesAffectedDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredSpeciesAffectedDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        this.SpeciesAffectedDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Species Affected Details Saved',
        });

      }
    })
  }

  //#endregion

  //#region Emissions of ozone-depleting substances (ODS)
  newTypeOfODS() {
    this.dialog.open(NewTypeOfOdsComponent, { width: "500px", data: { userID: this.userID, lov: this.lov, mode: 'create' } }).afterClosed().subscribe((data: any) => {
      if (data) {
        this.lov[20].value.push(data)
        this.emissionofODS.controls['type_of_ods'].setValue(data.value)

        const statusText = "Type of ODS created.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }

    })
  }
  deleteTypeofODS(data: any) {
    this.showProgressPopup();
    const currentTypeofODSValue = this.emissionofODS.controls['type_of_ods'].value;
    this.esgService.deleteTypeofODS(data.id).subscribe({
      next: (result: any) => {
        this.lov[20].value = this.lov[20].value.filter((item: { id: any; }) => item.id !== data.id);
      },
      error: () => {
        console.error('Error deleting Type Of Type Of ODS');
      },
      complete: () => {
        Swal.close();
        if (currentTypeofODSValue === data.value) {
        } else {
          this.emissionofODS.controls['type_of_ods'].setValue(currentTypeofODSValue);
        }
      }
    });
  }
  modifyTypeofODS(data: any) {
    this.dialog.open(NewTypeOfOdsComponent, {
      width: "500px",
      data: { userID: this.userID, mode: 'modify', data: data }
    }).afterClosed().subscribe((updatedData: any) => {

      if (updatedData?.id) {
        const index = this.lov[20].value.findIndex((item: any) => {
          return item.id === updatedData.id;
        });

        if (index !== -1) {
          this.lov[20].value[index] = updatedData;
        } else {
          console.warn("Type of ODS ID not found in the list.");
        }
        this.emissionofODS.controls['type_of_ods'].setValue(updatedData.value);
      } else {
        console.error('Invalid data: Missing Type of ODS ID.');
      }
    });
  }
  submitTypeOfODS(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('ODS', JSON.stringify(this.emissionofODS.value));
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.environmentDisclosureForm.value));
    this.esgService.createEnvTypeofODS(formData).subscribe({
      next: (result: any) => {
        this.emissionofODSarray = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Emissions of ozone-depleting substances (ODS) Data Saved'
        });
      }
    });

  }
  //#endregion

  //#region Supplier Environmental Assessment
  submitSupplierAssessment(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('Supplier', JSON.stringify(this.supplierEnvAssesment.value));
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.environmentDisclosureForm.value));
    this.esgService.createEnvSupplierenvAsmnt(formData).subscribe({
      next: (result: any) => {
        this.supplierEnvAssesmentarray = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Supplier Environmental Assessment Data Saved'
        });
      }
    });

  }
  //#endregion

  //#region Water Recycled
  submitWaterRecycled(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('water', JSON.stringify(this.WaterRecycled.value));
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.environmentDisclosureForm.value));
    this.esgService.createEnvWaterRecycled(formData).subscribe({
      next: (result: any) => {
        this.WaterRecycledarray = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Water Recycled Data Saved'
        });
      }
    });

  }
  //#endregion

  //#region Environmental Impact Assessment of Value Chain Partners
  submitImpactAssessment(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('impact', JSON.stringify(this.ImpactAssessment.value));
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.environmentDisclosureForm.value));
    this.esgService.createEnvImpactAssessment(formData).subscribe({
      next: (result: any) => {
        this.ImpactAssessmentarray = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Environmental Impact Assessment of Value Chain Partners Data Saved'
        });
      }
    });

  }
  //#endregion

  //#region Habitat Protected or Restored
  submitHabitat(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('habitat', JSON.stringify(this.Habitat.value));
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.environmentDisclosureForm.value));
    this.esgService.createEnvHabitat(formData).subscribe({
      next: (result: any) => {
        this.Habitatarray = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Habitat Protected or Restored Data Saved'
        });
      }
    });

  }
  //#endregion


  //#region Impact of Activities on Protected/High Biodiversity Areas

  addImpactofActivities(data: any) {
    this.dialog.open(AddImpactOfActivitiesComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {
        this.ImpactofActivitiesDetails.push(data)
        // this.filteredImpactofActivitiesDetails.push(data)
      }
    })
  }

  ModifyImpactofActivities(data: any, index?: number) {
    this.dialog.open(AddImpactOfActivitiesComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredImpactofActivitiesDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredImpactofActivitiesDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.ImpactofActivitiesDetails[index] = updatedData;
        }
      }
    })
  }

  viewImpactofActivities(data: any, index?: number) {
    this.dialog.open(AddImpactOfActivitiesComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteImpactofActivities(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvImpactofActivities(data.id).subscribe({
        next: (result: any) => {
          this.filteredImpactofActivitiesDetails = this.filteredImpactofActivitiesDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Impact details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Impact details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredImpactofActivitiesDetails.splice(index, 1);
      this.ImpactofActivitiesDetails.splice(index, 1);
      const statusText = "Impact details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  submitImpactofActivities(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.ImpactofActivitiesDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvImpactofActivities(formData).subscribe({
      next: (result: any) => {
        this.filteredImpactofActivitiesDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredImpactofActivitiesDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        this.ImpactofActivitiesDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Impact Details Saved',
        });

      }
    })
  }

  //#endregion

  //#region Environmental Impact Assessments (EIA) of Projects

  addEIAofrojects(data: any) {
    this.dialog.open(AddEiaOfProjectComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {
        this.EIAodProjectsDetails.push(data)
        // this.filteredEIAodProjectsDetails.push(data)
      }
    })
  }

  ModifyEIAofrojects(data: any, index?: number) {
    this.dialog.open(AddEiaOfProjectComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredEIAodProjectsDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredEIAodProjectsDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.EIAodProjectsDetails[index] = updatedData;
        }
      }
    })
  }

  viewEIAofrojects(data: any, index?: number) {
    this.dialog.open(AddEiaOfProjectComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteEIAofrojects(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvEIAofProject(data.id).subscribe({
        next: (result: any) => {
          this.filteredEIAodProjectsDetails = this.filteredEIAodProjectsDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting EIA of Project details');
        },
        complete: () => {
          Swal.close()
          const statusText = "EIA of Project details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredEIAodProjectsDetails.splice(index, 1);
      this.EIAodProjectsDetails.splice(index, 1);
      const statusText = "EIA of Project details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  submitEIAofrojects(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.EIAodProjectsDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvEIAofProject(formData).subscribe({
      next: (result: any) => {
        this.filteredEIAodProjectsDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredEIAodProjectsDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        this.EIAodProjectsDetails = []
        Swal.fire({
          icon: 'success',
          title: 'EIA of Project Details Saved',
        });

      }
    })
  }

  //#endregion

  //#region Nitrogen oxides (NOx), sulfur oxides (SOx), and other significant air emissions

  addAirEmission(data: any) {
    this.dialog.open(AddAirEmissionComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {
        this.AirEmissionDetails.push(data)
        // this.filteredAirEmissionDetails.push(data)
      }
    })
  }

  ModifyAirEmission(data: any, index?: number) {
    this.dialog.open(AddAirEmissionComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredAirEmissionDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredAirEmissionDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.AirEmissionDetails[index] = updatedData;
        }
      }
    })
  }

  viewAirEmission(data: any, index?: number) {
    this.dialog.open(AddAirEmissionComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteAirEmission(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvAirEmission(data.id).subscribe({
        next: (result: any) => {
          this.filteredAirEmissionDetails = this.filteredAirEmissionDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Air Emission details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Air Emission details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredAirEmissionDetails.splice(index, 1);
      this.AirEmissionDetails.splice(index, 1);
      const statusText = "Air Emission details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  submitAirEmission(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.AirEmissionDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvAirEmission(formData).subscribe({
      next: (result: any) => {
        this.filteredAirEmissionDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredAirEmissionDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        this.AirEmissionDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Air Emission Details Saved',
        });

      }
    })
  }

  //#endregion

  //#region Waste generated

  // addWasteGenertedMultiple(data: any) {
  //   this.dialog.open(AddWasteGeneratedMultipleComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
  //     if (data) {
  //       this.WasteGenertedMultipleDetails.push(data)
  //       // this.filteredWasteGenertedMultipleDetails.push(data)
  //     }
  //   })
  // }

  addWasteGenerted(data: any) {
    this.dialog.open(AddWasteGeneratedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {
        this.WasteGenertedDetails.push(data)
        // this.filteredWasteGenertedDetails.push(data)
      }
    })
  }

  // addWasteDirected(data: any) {
  //   this.dialog.open(AddWasteDirectedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
  //     if (data) {
  //       this.WasteDirectedDetails.push(data)
  //       // this.filteredWasteDirectedDetails.push(data)
  //     }
  //   })
  // }

  // addWasteDiverted(data: any) {
  //   this.dialog.open(AddWasteDivertedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
  //     if (data) {
  //       this.WasteDivertedDetails.push(data)
  //       // this.filteredWasteDivertedDetails.push(data)
  //     }
  //   })
  // }

  // ModifyWasteGenertedMultiple(data: any, index?: number) {
  //   this.dialog.open(AddWasteGeneratedMultipleComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
  //     if (updatedData) {
  //       if (updatedData.id) {
  //         // If id exists, update using the id
  //         const index = this.filteredWasteGenertedMultipleDetails.findIndex(item => item.id === updatedData.id);
  //         if (index !== -1) {
  //           this.filteredWasteGenertedMultipleDetails[index] = updatedData;
  //         }
  //       } else if (index !== undefined) {
  //         // If no id, update using the passed index
  //         this.WasteGenertedMultipleDetails[index] = updatedData;
  //       }
  //     }
  //   })
  // }

  ModifyWasteGenerted(data: any, index?: number) {
    this.dialog.open(AddWasteGeneratedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredWasteGenertedDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredWasteGenertedDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.WasteGenertedDetails[index] = updatedData;
        }
      }
    })
  }

  // ModifyWasteDirected(data: any, index?: number) {
  //   this.dialog.open(AddWasteDirectedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
  //     if (updatedData) {
  //       if (updatedData.id) {
  //         // If id exists, update using the id
  //         const index = this.filteredWasteDirectedDetails.findIndex(item => item.id === updatedData.id);
  //         if (index !== -1) {
  //           this.filteredWasteDirectedDetails[index] = updatedData;
  //         }
  //       } else if (index !== undefined) {
  //         // If no id, update using the passed index
  //         this.WasteDirectedDetails[index] = updatedData;
  //       }
  //     }
  //   })
  // }

  // ModifyWasteDiverted(data: any, index?: number) {
  //   this.dialog.open(AddWasteDivertedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
  //     if (updatedData) {
  //       if (updatedData.id) {
  //         // If id exists, update using the id
  //         const index = this.filteredWasteDivertedDetails.findIndex(item => item.id === updatedData.id);
  //         if (index !== -1) {
  //           this.filteredWasteDivertedDetails[index] = updatedData;
  //         }
  //       } else if (index !== undefined) {
  //         // If no id, update using the passed index
  //         this.WasteDivertedDetails[index] = updatedData;
  //       }
  //     }
  //   })
  // }

  // viewWasteGenertedMultiple(data: any, index?: number) {
  //   this.dialog.open(AddWasteGeneratedMultipleComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
  //   })
  // }

  viewWasteGenerted(data: any, index?: number) {
    this.dialog.open(AddWasteGeneratedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  // viewWasteDirected(data: any, index?: number) {
  //   this.dialog.open(AddWasteDirectedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
  //   })
  // }

  // viewWasteDiverted(data: any, index?: number) {
  //   this.dialog.open(AddWasteDivertedComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
  //   })
  // }

  // deleteWasteGenertedMultiple(data: any, index: number) {
  //   if (data.id) {
  //     this.showProgressPopup()
  //     this.esgService.deleteEnvTypeofWasteData(data.id).subscribe({
  //       next: (result: any) => {
  //         this.filteredWasteGenertedMultipleDetails = this.filteredWasteGenertedMultipleDetails.filter(item => item.id !== data.id);
  //       },
  //       error: () => {
  //         console.error('Error deleting Waste Generated details');
  //       },
  //       complete: () => {
  //         Swal.close()
  //         const statusText = "Waste Generated details deleted.";
  //         this._snackBar.open(statusText, 'OK', {
  //           duration: 3000,
  //           horizontalPosition: this.horizontalPosition,
  //           verticalPosition: this.verticalPosition,
  //         });
  //       }
  //     });
  //   } else {
  //     // this.filteredWasteGenertedMultipleDetails.splice(index, 1);
  //     this.WasteGenertedMultipleDetails.splice(index, 1);
  //     const statusText = "Waste Generated details deleted.";
  //     this._snackBar.open(statusText, 'OK', {
  //       duration: 3000,
  //       horizontalPosition: this.horizontalPosition,
  //       verticalPosition: this.verticalPosition,
  //     });
  //   }
  // }

  deleteWasteGenerted(data: any, index: number) {
    if (data.id) {


      Swal.fire({
        title: 'Are you sure?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "Are you sure you want to delete this Waste generated details.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.showProgressPopup()
          this.esgService.deleteEnvWasteGenerated(data.id).subscribe({
            next: (result: any) => {
              this.filteredWasteGenertedDetails = this.filteredWasteGenertedDetails.filter(item => item.id !== data.id);
            },
            error: () => {
              console.error('Error deleting Waste Generated details');
            },
            complete: () => {
              Swal.close()
              const statusText = "Waste Generated details deleted.";
              this._snackBar.open(statusText, 'OK', {
                duration: 3000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            }
          });
        }
      })

    } else {
      // this.filteredWasteGenertedDetails.splice(index, 1);
      this.WasteGenertedDetails.splice(index, 1);
      const statusText = "Waste Generated details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  // deleteWasteDirected(data: any, index: number) {
  //   if (data.id) {
  //     this.showProgressPopup()
  //     this.esgService.deleteEnvWasteDirected(data.id).subscribe({
  //       next: (result: any) => {
  //         this.filteredWasteDirectedDetails = this.filteredWasteDirectedDetails.filter(item => item.id !== data.id);
  //       },
  //       error: () => {
  //         console.error('Error deleting Waste Directed details');
  //       },
  //       complete: () => {
  //         Swal.close()
  //         const statusText = "Waste Directed details deleted.";
  //         this._snackBar.open(statusText, 'OK', {
  //           duration: 3000,
  //           horizontalPosition: this.horizontalPosition,
  //           verticalPosition: this.verticalPosition,
  //         });
  //       }
  //     });
  //   } else {
  //     // this.filteredWasteDirectedDetails.splice(index, 1);
  //     this.WasteDirectedDetails.splice(index, 1);
  //     const statusText = "Waste Directed details deleted.";
  //     this._snackBar.open(statusText, 'OK', {
  //       duration: 3000,
  //       horizontalPosition: this.horizontalPosition,
  //       verticalPosition: this.verticalPosition,
  //     });
  //   }
  // }

  // deleteWasteDiverted(data: any, index: number) {
  //   if (data.id) {
  //     this.showProgressPopup()
  //     this.esgService.deleteEnvWasteDiverted(data.id).subscribe({
  //       next: (result: any) => {
  //         this.filteredWasteDivertedDetails = this.filteredWasteDivertedDetails.filter(item => item.id !== data.id);
  //       },
  //       error: () => {
  //         console.error('Error deleting Waste Diverted details');
  //       },
  //       complete: () => {
  //         Swal.close()
  //         const statusText = "Waste Diverted details deleted.";
  //         this._snackBar.open(statusText, 'OK', {
  //           duration: 3000,
  //           horizontalPosition: this.horizontalPosition,
  //           verticalPosition: this.verticalPosition,
  //         });
  //       }
  //     });
  //   } else {
  //     // this.filteredWasteDivertedDetails.splice(index, 1);
  //     this.WasteDivertedDetails.splice(index, 1);
  //     const statusText = "Waste Diverted details deleted.";
  //     this._snackBar.open(statusText, 'OK', {
  //       duration: 3000,
  //       horizontalPosition: this.horizontalPosition,
  //       verticalPosition: this.verticalPosition,
  //     });
  //   }
  // }

  submitWasteGenertedMultiple(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    // formData.append('typeofwaste', JSON.stringify(this.WasteGenertedMultipleDetails))
    formData.append('wastegenerated', JSON.stringify(this.WasteGenertedDetails))
    // formData.append('wastedirected', JSON.stringify(this.WasteDirectedDetails))
    // formData.append('wastediverted', JSON.stringify(this.WasteDivertedDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvTypeofWasteData(formData).subscribe({
      next: (result: any) => {

        // this.filteredWasteGenertedMultipleDetails = [];
        this.filteredWasteGenertedDetails = [];
        // this.filteredWasteDirectedDetails = [];
        // this.filteredWasteDivertedDetails = [];
        if (result) {
          // this.filteredWasteGenertedMultipleDetails.push(...result[0].data.esg_env_type_of_wastes);
          this.filteredWasteGenertedDetails.push(...result[0].data.esg_env_waste_generateds);
          // this.filteredWasteDirectedDetails.push(...result[0].data.esg_env_waste_directeds);
          // this.filteredWasteDivertedDetails.push(...result[0].data.esg_env_waste_diverteds);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        // this.WasteGenertedMultipleDetails = []
        this.WasteGenertedDetails = []
        // this.WasteDirectedDetails = []
        // this.WasteDivertedDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Waste Generated Details Saved',
        });

      }
    })
  }

  //#endregion


  //#region Direct and Indirect Emission

  addDirectEmission(data: any) {

    this.dialog.open(AddDirectIndirectEmissionComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {


        this.DirectEmissionDetails.push(data)
        // this.filteredDirectEmissionDetails.push(data)
      }
    })
  }
  addUpstreamCategory() {
    this.dialog.open(AddUpstreamCategoryComponent, { width: "740px", data: { lov: this.lov, mode: 'create', data: [] } }).afterClosed().subscribe(data => {
      if (data) {
        this.UpstreamCategoriesarray.push(data)

        this.directEmission.controls['upstream'].setValue(this.UpstreamCategoriesarray)
        // this.filteredUpstreamCategoriesarray.push(data)
      }
    })
  }
  editUpstreamCategory(data: any, index: number) {
    this.dialog.open(AddUpstreamCategoryComponent, { width: "740px", data: { lov: this.lov, data: data, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredUpstreamCategoriesarray.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredUpstreamCategoriesarray[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.UpstreamCategoriesarray[index] = updatedData;
        }
      }
    })
  }

  deleteUpstreamCategory(data: any, index: number) {
    if (data.id) {
      this.esgService.deleteEnvUpstreamCategory(data.id).subscribe({
        next: (result: any) => {
          this.filteredUpstreamCategoriesarray = this.filteredUpstreamCategoriesarray.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Upstream Category details');
        },
        complete: () => {
          const statusText = "Upstream Category details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredUpstreamCategoriesarray.splice(index, 1);
      this.UpstreamCategoriesarray.splice(index, 1);
      const statusText = "Upstream Category details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  addDownstreamCategory() {
    this.dialog.open(AddDownstreamCategoryComponent, { width: "740px", data: { lov: this.lov, mode: 'create', data: [] } }).afterClosed().subscribe(data => {
      if (data) {
        this.DownstreamCategoriesarray.push(data)
        this.directEmission.controls['downstream'].setValue(this.DownstreamCategoriesarray)
        // this.filteredDownstreamCategoriesarray.push(data)
      }
    })
  }

  editDownstreamCategory(data: any, index: number) {
    this.dialog.open(AddDownstreamCategoryComponent, { width: "740px", data: { lov: this.lov, data: data, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredDownstreamCategoriesarray.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredDownstreamCategoriesarray[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.DownstreamCategoriesarray[index] = updatedData;
        }
      }
    })
  }
  deleteDownstreamCategory(data: any, index: number) {
    if (data.id) {
      this.esgService.deleteEnvDownstreamCategory(data.id).subscribe({
        next: (result: any) => {
          this.filteredDownstreamCategoriesarray = this.filteredDownstreamCategoriesarray.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Downstream Category details');
        },
        complete: () => {
          const statusText = "Downstream Category details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredDownstreamCategoriesarray.splice(index, 1);
      this.DownstreamCategoriesarray.splice(index, 1);
      const statusText = "Downstream Category details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
  ModifyDirectEmission(data: any, index?: number) {
    this.dialog.open(AddDirectIndirectEmissionComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {

        if (updatedData.id) {
          // If id exists, update using the id
          const index = this.filteredDirectEmissionDetails.findIndex(item => item.id === updatedData.id);
          if (index !== -1) {
            this.filteredDirectEmissionDetails[index] = updatedData;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.DirectEmissionDetails[index] = updatedData;
        }
      }
    })
  }

  viewDirectEmission(data: any, index?: number) {
    this.dialog.open(AddDirectIndirectEmissionComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteDirectEmission(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvDirectEmission(data.id).subscribe({
        next: (result: any) => {
          this.filteredDirectEmissionDetails = this.filteredDirectEmissionDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Direct and Indirect Emission details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Direct and Indirect Emission details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredDirectEmissionDetails.splice(index, 1);
      this.DirectEmissionDetails.splice(index, 1);
      const statusText = "Direct and Indirect Emission details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  EmissionChange(data: any) {
    // this.Form.controls['emission_intensity_base'].setValue(data.value.unit.toString())
    this.directEmission.controls['emission_intensity_base_unit'].setValue(data.unit.toString())
  }

  new_emission_intensity_base() {
    this.dialog.open(AddEmissionIntensityBaseComponent, { width: "500px", data: { lov: this.lov, mode: 'create' } }).afterClosed().subscribe((data: any) => {
      if (data) {

        this.lov[19].value.push(data)
        this.directEmission.controls['emission_intensity_base'].setValue(data.value)
        this.directEmission.controls['emission_intensity_base_unit'].setValue(data.unit)

        const statusText = "Emission Intensity Base created.";
        this._snackBar.open(statusText, 'OK', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }

    })
  }


  submitDirectEmission(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    formData.append('emission', JSON.stringify(this.directEmission.value))
    // formData.append('emission', JSON.stringify(this.DirectEmissionDetails))
    // formData.append('upstream', JSON.stringify(this.UpstreamDetails))
    // formData.append('downstream', JSON.stringify(this.DownstreamDetails))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvDirectEmission(formData).subscribe({
      next: (result: any) => {
        this.filteredDirectEmissionDetails = [];
        this.filteredUpstreamDetails = [];
        this.filteredDownstreamDetails = [];
        this.UpstreamCategoriesarray = [];
        this.DownstreamCategoriesarray = [];
        this.filteredUpstreamCategoriesarray = [];
        this.filteredDownstreamCategoriesarray = [];
        this.directEmission.controls['upstream'].reset()
        this.directEmission.controls['downstream'].reset()

        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredDirectEmissionDetails.push(...result[0]?.data);
          this.filteredUpstreamDetails.push(...result[0]?.data[0].esg_env_upstream_categories);

          this.filteredUpstreamCategoriesarray.push(...result[0]?.data[0].esg_env_upstream_categories);
          this.filteredDownstreamCategoriesarray.push(...result[0]?.data[0].esg_env_downstream_categories);
          this.filteredDownstreamDetails.push(...result[0]?.data[0].esg_env_downstream_categories);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        this.DirectEmissionDetails = []
        this.UpstreamDetails = []
        this.DownstreamDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Direct and Indirect Emission Details Saved',
        });

      }
    })
  }

  //#endregion

  //#region Energy consumption within the organization

  addConsumptionWithin(data: any) {
    this.dialog.open(AddEnergyConsumptionWithinComponent, {
      width: "740px",
      data: {
        lov: this.lov,
        data: data,
        refID: this.refID,
        ConsumptionWithinDetails: this.ConsumptionWithinDetails,
        filteredConsumptionWithinDetails: this.filteredConsumptionWithinDetails
      }
    })
      .afterClosed().subscribe(data => {
        if (data) {

          this.ConsumptionWithinDetails.push(data.formValue)
          // this.filteredConsumptionWithinDetails.push(data.formValue)
          this.RenewableFuelsarray.push(data.renewableFuels)
          this.nonRenewableFuelsarray.push(data.NonrenewableFuels)
        }
      })
  }

 ModifyConsumptionWithin(data: any, index?: number) {
  this.dialog.open(AddEnergyConsumptionWithinComponent, {
    disableClose: true,
    width: "740px",
    data: {
      lov: this.lov,
      data: data,
      ConsumptionWithinDetails: this.ConsumptionWithinDetails,
      filteredConsumptionWithinDetails: this.filteredConsumptionWithinDetails,
      refID: this.refID,
      mode: 'modify'
    }
  }).afterClosed().subscribe(updatedData => {

    if (updatedData) {
      if (updatedData.formValue?.id) {
        const i = this.filteredConsumptionWithinDetails.findIndex(item => item.id === updatedData.formValue.id);
        if (i !== -1) {
          this.filteredConsumptionWithinDetails[i] = updatedData.formValue;
        }
      } else if (index !== undefined) {
        this.ConsumptionWithinDetails[index] = updatedData.formValue;
      }

      if (
        updatedData.deletedRenewableIndexes?.length ||
        updatedData.deletedNonRenewableIndexes?.length
      ) {
        if (data.energy_type === 'Renewable Fuel') {
          updatedData.deletedRenewableIndexes?.forEach((i: number) => {
            data.esg_env_renewable_fuels?.splice(i, 1);
          });
        } else if (data.energy_type === 'Non Renewable Fuel') {
          updatedData.deletedNonRenewableIndexes?.forEach((i: number) => {
            data.esg_env_nonrenewable_fuels?.splice(i, 1);
          });
        }
      }
    }
  });
}


  viewConsumptionWithin(data: any, index?: number) {
    this.dialog.open(AddEnergyConsumptionWithinComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteConsumptionWithin(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvEnergyConsumptionWithin(data.id).subscribe({
        next: (result: any) => {
          this.filteredConsumptionWithinDetails = this.filteredConsumptionWithinDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Energy Consumption details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Energy Consumption details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredConsumptionWithinDetails.splice(index, 1);
      this.ConsumptionWithinDetails.splice(index, 1);
      const statusText = "Energy Consumption details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
  getTotalQuantity(data: any): number {
    if (data.energy_type === 'Renewable Fuel') {
      
      const flattenedArray = data.esg_env_renewable_fuels.flat();
      return flattenedArray.reduce((sum: any, item: { quantity: any; }) => {
        return sum + (item.quantity || 0);
      }, 0);
    } else if (data.energy_type === 'Non Renewable Fuel') {
      const flattenedArray = data.esg_env_nonrenewable_fuels.flat();
      return flattenedArray.reduce((sum: any, item: { quantity: any; }) => {
        return sum + (item.quantity || 0);
      }, 0);
    }
    return data.quantity;
  }

  submitConsumptionWithin(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();

    formData.append('data', JSON.stringify(this.ConsumptionWithinDetails))
    // formData.append('renewable', JSON.stringify(this.RenewableFuelsarray))
    // formData.append('nonrenewable', JSON.stringify(this.nonRenewableFuelsarray))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvEnergyConsumptionWithin(formData).subscribe({
      next: (result: any) => {
        this.filteredConsumptionWithinDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredConsumptionWithinDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        this.ConsumptionWithinDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Energy Consumption Details Saved',
        });

      }
    })
  }

  //#endregion

  //#region Energy consumption Outside the organization

  addConsumptionOutside(data: any) {
    this.dialog.open(AddEnergyConsumptionOutsideComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID } }).afterClosed().subscribe(data => {
      if (data) {

        this.ConsumptionOutsideDetails.push(data.formValue)
        // this.filteredConsumptionOutsideDetails.push(data.formValue)
        this.upStreamCategory.push(data.upStreamCategory)
        this.downStreamCategory.push(data.downStreamCategory)
        // this.ConsumptionOutsideDetails.push(data.formValue)
        // if (data.upStreamCategory) {
        //   this.upStreamCategory.push(data.upStreamCategory)
        // }
        // if (data.downStreamCategory) {

        //   this.downStreamCategory.push(data.downStreamCategory)
        // }
        // this.filteredConsumptionOutsideDetails.push(data.formValue)
      }
    })
  }

  ModifyConsumptionOutside(data: any, index?: number) {
    this.dialog.open(AddEnergyConsumptionOutsideComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'modify' } }).afterClosed().subscribe(updatedData => {
      if (updatedData) {
        if (updatedData.formValue.id) {
          // If id exists, update using the id
          const index = this.filteredConsumptionOutsideDetails.findIndex(item => item.id === updatedData.formValue.id);
          if (index !== -1) {
            this.filteredConsumptionOutsideDetails[index] = updatedData.formValue;
          }
        } else if (index !== undefined) {
          // If no id, update using the passed index
          this.ConsumptionOutsideDetails[index] = updatedData.formValue;
        }
      }
    })
  }

  viewConsumptionOutside(data: any, index?: number) {
    this.dialog.open(AddEnergyConsumptionOutsideComponent, { width: "740px", data: { lov: this.lov, data: data, refID: this.refID, mode: 'view' } }).afterClosed().subscribe(data => {
    })
  }

  deleteConsumptionOutside(data: any, index: number) {
    if (data.id) {
      this.showProgressPopup()
      this.esgService.deleteEnvEnergyConsumptionOutside(data.id).subscribe({
        next: (result: any) => {
          this.filteredConsumptionOutsideDetails = this.filteredConsumptionOutsideDetails.filter(item => item.id !== data.id);
        },
        error: () => {
          console.error('Error deleting Energy Consumption details');
        },
        complete: () => {
          Swal.close()
          const statusText = "Energy Consumption details deleted.";
          this._snackBar.open(statusText, 'OK', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      });
    } else {
      // this.filteredConsumptionOutsideDetails.splice(index, 1);
      this.ConsumptionOutsideDetails.splice(index, 1);
      const statusText = "Energy Consumption details deleted.";
      this._snackBar.open(statusText, 'OK', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  submitConsumptionOutside(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.ConsumptionOutsideDetails))
    // formData.append('downstream', JSON.stringify(this.downStreamCategory))
    // formData.append('upstream', JSON.stringify(this.upStreamCategory))
    formData.append('formdata', JSON.stringify(this.environmentDisclosureForm.value))
    this.esgService.createEnvEnergyConsumptionOutside(formData).subscribe({
      next: (result: any) => {
        this.filteredConsumptionOutsideDetails = [];
        if (result[0] && Array.isArray(result[0].data)) {
          this.filteredConsumptionOutsideDetails.push(...result[0].data);
        }
      },
      error: (err: any) => {

      },
      complete: () => {
        Swal.close()
        title.status = status
        this.ConsumptionOutsideDetails = []
        Swal.fire({
          icon: 'success',
          title: 'Energy Consumption Details Saved',
        });

      }
    })
  }

  //#endregion


  //#region Compliance with Environmental Laws and Regulations
  submitCompliance(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('compliance', JSON.stringify(this.Compliance.value));
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.environmentDisclosureForm.value));
    this.esgService.createEnvCompliance(formData).subscribe({
      next: (result: any) => {
        this.Compliancearray = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Compliance with Environmental Laws and Regulations Data Saved'
        });
      }
    });

  }
  //#endregion

  //#region Negative Environmental Impacts in the Supply Chain
  submitNegetive(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('negetive', JSON.stringify(this.Negetive.value));
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.environmentDisclosureForm.value));
    this.esgService.createEnvNegetiveImpact(formData).subscribe({
      next: (result: any) => {
        this.Negetivearray = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Negative Environmental Impacts in the Supply Chain Data Saved'
        });
      }
    });

  }
  //#endregion

  //#region Life Cycle Assessment of Products/Services
  submitLifecycle(status: any, title: any) {
    this.showProgressPopup()
    this.environmentDisclosureForm.controls['esg_environment_disclosure'].setValue(this.currentTitles[0].esg_environment_disclosure);
    this.environmentDisclosureForm.controls['status'].setValue(status)
    const formData = new FormData();
    formData.append('lifecycle', JSON.stringify(this.LifecycleAssessment.value));
    this.environmentDisclosureForm.controls['ref_id'].setValue(this.refID)
    this.environmentDisclosureForm.controls['title_ref_id'].setValue(title.reference_id)

    formData.append('form_value', JSON.stringify(this.environmentDisclosureForm.value));
    this.esgService.createEnvLifecycleAssesssment(formData).subscribe({
      next: (result: any) => {
        this.LifecycleAssessmentarray = result[0].data
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        Swal.close()
        title.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Life Cycle Assessment of Products/Services Data Saved'
        });
      }
    });

  }
  //#endregion
  // Update All Themes status
  updateAllThemeStatus(status: string) {
    this.showProgressPopup();
    const formData = new FormData();
    formData.append("status", status);
    formData.append("ref_id", this.refID);

    this.esgService.updateESGEnvDisAllThemeStatus(formData).subscribe({
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
