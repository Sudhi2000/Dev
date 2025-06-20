import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { reference } from '@popperjs/core';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class EsgService {
    constructor(private http: HttpClient) { }

    public esg_temp(data: any) {
        return this.http.get(AppService.base_url + AppService.esgTemp + '?disclosure=' + data)
    }

    //#region ESG
    public esg_register(startIndex: any, pageSize: any) {
        return this.http.get(AppService.base_url + AppService.esgRegister + '?pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize)
    }
    public get_esg_unit_specific_register(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.esgRegister + '?' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&populate=divisions')
    }
    public get_esg_search(reference: any, startIndex: number, pageSize: number,) {
        return this.http.get(reference ? AppService.base_url + AppService.esgRegister + '?filters[reference_number]=' + reference + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=year:asc' + '&sort[1]=month:asc&populate=divisions' : AppService.base_url + AppService.environment + '?pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc&populate=divisions')
    }
    public get_esg_unit_specific_search(reference: any, division: any, startIndex: number, pageSize: number) {
        return this.http.get(reference ? AppService.base_url + AppService.esgRegister + '?filters[reference_number]=' + reference + '&' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=year:asc' + '&sort[1]=month:asc&populate=divisions' :
            AppService.base_url + AppService.esgRegister + '?' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize)
    }
    public get_esg_division_search(reference: any, division: any, startIndex: number, pageSize: number,) {
        return this.http.get(reference ? AppService.base_url + AppService.esgRegister + '?filters[reference_number]=' + reference + '&' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=year:asc' + '&sort[1]=month:asc&populate=divisions' :
            AppService.base_url + AppService.esgRegister + '?' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize)
    }
    public get_esg_div_specific_search(division: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.esgRegister + '?' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=year:asc' + '&sort[1]=month:asc&populate=divisions')
    }
    public get_dropdown_values() {

        return this.http.get(AppService.base_url + AppService.getDropDownValues)
    }
    public esg_create(data: any) {
        return this.http.post(AppService.base_url + AppService.esgCreate, data)
    }
    public esg_create_teamMembers(data: any) {
        return this.http.post(AppService.base_url + AppService.esgCreateTeamMembers, data)
    }

    // social

    public createSocDisTitleEmployeeDetails(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleEmployeeDetails, data)
    }
    public createSocDisTitleRemunerationSalaryWages(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleRemunerationSalaryWages, data)
    }
    public createSocDisTitleAverageTrainingHours(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleAverageTrainingHours, data)
    }
    public createSocDisTitleEmployeeDiversity(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleEmployeeDiversity, data)
    }
    public createSocDisTitleNonDiscrimination(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleNonDiscrimination, data)
    }
    public createSocDisTitleRightsOfIndPeople(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleRightsOfIndPeople, data)
    }
    public createSocDisTitleCloseCalls(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleCloseCalls, data)
    }
    public createSocDisTitleHumanRightsAssessment(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleHumanRightsAssessment, data)
    }
    public createSocDisTitleHumanRightsAssessmentChainPartners(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleHumanRightsAssessmentChainPartners, data)
    }
    public createSocDisTitleProductRecalls(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleProductRecalls, data)
    }
    public createSocDisTitleConsumerComplaints(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleConsumerComplaints, data)
    }
    public createSocDisTitleBreaches(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleBreaches, data)
    }
    public createSocDisTitleEmployeeUnion(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleEmployeeUnion, data)
    }
    public createSoctitlePoliticalContribution(data: any) {
        return this.http.post(AppService.base_url + AppService.createSoctitlePoliticalContribution, data)
    }
    public createSoctitleCSRProjects(data: any) {
        return this.http.post(AppService.base_url + AppService.createSoctitleCSRProjects, data)
    }
    public createSocHSAssessmentvalueChainPartners(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocHSAssessmentvalueChainPartners, data)
    }
    public createSocDisTitleWorkIllHealth(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleWorkIllHealth, data)
    }
    public createSocDisTitleWorkRelatedinjury(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleWorkRelatedinjury, data)
    }
    public createSocDisTitleNegSocialImpacts(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleNegSocialImpacts, data)
    }
    public createSocDisTitleMarketingCommunications(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleMarketingCommunications, data)
    }
    public createSocDisTitleProductServiceLabeling(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleProductServiceLabeling, data)
    }
    public createSocDisTitleCustomerHealthSafety(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleCustomerHealthSafety, data)
    }
    public createSocDisTitleSecurityPersonalTraining(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleSecurityPersonalTraining, data)
    }
    public createSocDisTitleOHSMngSystem(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleOHSMngSystem, data)
    }
    public createSocDisTitleOHSMngSystemComplaints(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleOHSMngSystemComplaints, data)
    }
    public createSocDisTitleHRTraining(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleHRTraining, data)
    }
    public createSocDisTitleRandR(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleRandR, data)
    }
    public createSocDisTitleProductServiceAssessment(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleProductServiceAssessment, data)
    }
    public createSocDisTitleSIAProject(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleSIAProject, data)
    }
    public createSocDisTitleWorkingHours(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleWorkingHours, data)
    }
    public createSocDisTitleSecurityComplaintsOnHRViolations(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleSecurityComplaintsOnHRViolations, data)
    }
    public createSocDisTitleHealthSafetyAssessment(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleHealthSafetyAssessment, data)
    }
    public createSocDisTitleWorkersOtherThanEmployees(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleWorkersOtherThanEmployees, data)
    }
    public createSocDisTitleSupplierSocAssessment(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleSupplierSocAssessment, data)
    }
    public createSocDisTitleParentalLeave(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleParentalLeave, data)
    }
    public updateSocDisTitleEmployeeDetails(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleEmployeeDetails, data)
    }
    public updateSocDisTitleAverageTrainingHours(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleAverageTrainingHours, data)
    }
    public updateSocDisTitleWorkerSkillUpgradeTraining(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleWorkerSkillUpgradeTraining, data)
    }
    public updateSocDisTitleWorkerPerfomanceReviews(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleWorkerPerfomanceReviews, data)
    }
    public updateSocDisTitleEmployeeSkillUpgradeTraining(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleEmployeeSkillUpgradeTraining, data)
    }
    public updateSocDisTitleEmployeePerfomanceReviews(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleEmployeePerfomanceReviews, data)
    }
    public updateSocDisTitleTrainingOnHealthSafetyMeasures(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleTrainingOnHealthSafetyMeasures, data)
    }
    public updateSocDisTitleSalaryRatioWomenToMen(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleSalaryRatioWomenToMen, data)
    }
    public updateSocDisTitleConsumerComplaints(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleConsumerComplaints, data)
    }
    public updateSocDisTitleBreaches(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleBreaches, data)
    }
    public updateSocDisTitleEmployeeDiversity(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleEmployeeDiversity, data)
    }
    public updateSocDisTitleNonDiscrimination(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleNonDiscrimination, data)
    }
    public updateSocDisTitleHumanRightsAssessment(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleHumanRightsAssessment, data)
    }
    public updateSocDisTitleHumanRightsAssessmentChainPartners(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleHumanRightsAssessmentChainPartners, data)
    }
    public updateSocDisTitleProductRecalls(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleProductRecalls, data)
    }
    public updateSocDisTitleCloseCalls(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleCloseCalls, data)
    }
    public updateSocDisTitleRightsOfIndPeople(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleRightsOfIndPeople, data)
    }
    public updateSocDisTitleERemunerationSalaryWages(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleERemunerationSalaryWages, data)
    }
    public updateSocDisTitleEmployeeHire(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleEmployeeHire, data)
    }
    public updateSocDisworkersRetirementBenefits(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisworkersRetirementBenefits, data)
    }
    public updateSocDisEmployeeRetirementBenefits(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisEmployeeRetirementBenefits, data)
    }
    public updateSocDisTitleWorkerTurnover(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleWorkerTurnover, data)
    }
    public updateSocDisDifAbledWorker(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisDifAbledWorker, data)
    }
    public updateSocDisTitleEmployeeTurnover(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleEmployeeTurnover, data)
    }
    public updateSocDisDifAbledEmployee(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisDifAbledEmployee, data)
    }
    public updateSocDisWorkerBenefits(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisWorkerBenefits, data)
    }
    public updateSocDisTitleEmployeeBenefits(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleEmployeeBenefits, data)
    }
    public updateSocDisTitleWorkerHire(data: any) {
        return this.http.put(AppService.base_url + AppService.updateSocDisTitleWorkerHire, data)
    }
    public updateESGSocDisStatus(data: any) {
        return this.http.put(AppService.base_url + AppService.updateESGSocDisStatus, data)
    }
    public updateESGSocDisAllThemeStatus(data: any) {
        return this.http.put(AppService.base_url + AppService.updateESGSocDisAllThemeStatus, data)
    }
    public createSocDisTitleNewHire(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleNewHire, data)
    }
    public createSocDisTitleTurnover(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleTurnover, data)
    }
    public createSocDisTitleSkillUpgradeTraining(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleSkillUpgradeTraining, data)
    }
    public createSocDisTitlePerfomanceReviews(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitlePerfomanceReviews, data)
    }
    public createSocDisTitleTrainingOnHealthSafetyMeasures(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleTrainingOnHealthSafetyMeasures, data)
    }
    public createSocDisTitleSalaryRatioWomenToMen(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleSalaryRatioWomenToMen, data)
    }
    public createSocDisTitleDifAbled(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleDifAbled, data)
    }
    public createSocDisTitleBenefits(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleBenefits, data)
    }
    public createSocDisTitleRetirementBenefits(data: any) {
        return this.http.post(AppService.base_url + AppService.createSocDisTitleRetirementBenefits, data)
    }
    public deleteSocDisTitleEmployeeDetails(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteDisTitleEmployeeDetails + '/' + id)
    }
    public deleteSocDisTitleEmployeeHire(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteDisTitleEmployeeHire + '/' + id)
    }
    public deleteSocDisTitleEmployeeTurnover(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteDisTitleEmployeeTurnover + '/' + id)
    }
    public deleteSocDisTitleEmployeeSkillUpgradeTraining(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleEmployeeSkillUpgradeTraining + '/' + id)
    }
    public deleteSocDisTitleEmployeePerfomanceReviews(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleEmployeePerfomanceReviews + '/' + id)
    }
    public deleteSocDisTitleTrainingOnHealthSafetyMeasures(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleTrainingOnHealthSafetyMeasures + '/' + id)
    }
    public deleteSocDisTitleSalaryRatioWomenToMen(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleSalaryRatioWomenToMen + '/' + id)
    }
    public deleteSocDisDifAbledEmployee(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteDisDifAbledEmployee + '/' + id)
    }
    public deleteSocDisTitleWorkerHire(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteDisTitleWorkerHire + '/' + id)
    }
    public deleteSocDisTitleWorkerTurnover(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteDisTitleWorkerTurnover + '/' + id)
    }
    public deleteSocDisTitleWorkerSkillUpgradeTraining(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleWorkerSkillUpgradeTraining + '/' + id)
    }
    public deleteSocDisTitleWorkerPerfomanceReviews(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleWorkerPerfomanceReviews + '/' + id)
    }
    public deleteSocDisDifAbledWorker(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisDifAbledWorker + '/' + id)
    }
    public deleteSocDisEmployeeBenefits(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisEmployeeBenefits + '/' + id)
    }
    public deleteSocDisEmployeeRetirementBenefits(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisEmployeeRetirementBenefits + '/' + id)
    }
    public deleteSocDisTitleRemunerationSalaryWages(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleRemunerationSalaryWages + '/' + id)
    }
    public deleteSocDisTitleAverageTrainingHours(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleAverageTrainingHours + '/' + id)
    }
    public deleteSocDisTitleEmployeeDiversity(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleEmployeeDiversity + '/' + id)
    }
    public deleteSocDisTitleNonDiscrimination(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleNonDiscrimination + '/' + id)
    }
    public deleteSocDisTitleRightsOfIndPeople(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleRightsOfIndPeople + '/' + id)
    }
    public deleteSocDisTitleCloseCalls(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleCloseCalls + '/' + id)
    }
    public deleteSocDisTitleHumanRightsAssessment(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleHumanRightsAssessment + '/' + id)
    }
    public deleteSocDisTitleHumanRightsAssessmentChainPartners(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleHumanRightsAssessmentChainPartners + '/' + id)
    }
    public deleteSocDisTitleProductRecalls(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleProductRecalls + '/' + id)
    }
    public deleteSocDisTitleConsumerComplaints(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleConsumerComplaints + '/' + id)
    }
    public deleteSocDisTitleBreaches(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisTitleBreaches + '/' + id)
    }
    public deleteSocDisWorkersBenefits(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisWorkersBenefits + '/' + id)
    }
    public deleteSocDisWorkersRetirementBenefits(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteSocDisWorkersRetirementBenefits + '/' + id)
    }
    public create_new_region(data: any) {
        return this.http.post(AppService.base_url + AppService.create_new_region, data)
    }
    public deleteRegion(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteRegion + '/' + id)
    }
    public updateRegion(data: any) {
        return this.http.put(AppService.base_url + AppService.updateRegion, data)
    }
    public updateTypeofHRViolation(data: any) {
        return this.http.put(AppService.base_url + AppService.updateTypeofHRViolation, data)
    }
    public create_new_type_of_hr_violation(data: any) {
        return this.http.post(AppService.base_url + AppService.create_new_type_of_hr_violation, data)
    }
    public deleteTypeofHRViolation(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteTypeofHRViolation + '/' + id)
    }
    // governance

    // #Title :Board of Directors

    public createGovDisTitleDirectorDetails(data: any) {
        return this.http.post(AppService.base_url + AppService.createGovDisTitleDirectorDetails, data)
    }
    public updateGovDisTitleDirectorDetails(data: any) {
        return this.http.put(AppService.base_url + AppService.updateGovDisTitleDirectorDetails, data)
    }

    public deleteGovDisTitleDirectorDetails(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteGovDisTitleDirectorDetails + '/' + id)
    }

    public updateESGGovDisStatus(data: any) {
        return this.http.put(AppService.base_url + AppService.updateESGGovDisStatus, data)
    }
    public updateESGGovAllDisThemeStatus(data: any) {
        return this.http.put(AppService.base_url + AppService.updateESGGovAllDisThemeStatus, data)
    }

    // #Title: Director Tenure
    public createGovDisTitleDirectorTenure(data: any) {
        return this.http.post(AppService.base_url + AppService.createGovDisTitleDirectorTenure, data)
    }
    // #Title: Anti Corruption Training for Governance Body
    public creategovBodyAntiCorrupt(data: any) {
        return this.http.post(AppService.base_url + AppService.creategovBodyAntiCorrupt, data)
    }

    // #Title: Anti corruption training for employees

    public createGovEmployeeDetails(data: any) {
        return this.http.post(AppService.base_url + AppService.createGovEmployeeDetails, data)
    }
    public updateGovEmployeeDetails(data: any) {
        return this.http.put(AppService.base_url + AppService.updateGovEmployeeDetails, data)
    }
    public deleteGovEmployeeDetails(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteGovEmployeeDetails + '/' + id)
    }

    // #Title: Anti corruption training for Business Partners
    public createGovBusinessPartnerDetails(data: any) {
        return this.http.post(AppService.base_url + AppService.createGovBusinessPartnerDetails, data)
    }
    public updateGovBusinessPartnerDetails(data: any) {
        return this.http.put(AppService.base_url + AppService.updateGovBusinessPartnerDetails, data)
    }
    public deleteGovBusinessPartnerDetails(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteGovBusinessPartnerDetails + '/' + id)
    }
    //  #Title: Anti-competitive behaviour, anti-trust and monopoly practices
    public createGovAntiCompetitive(data: any) {
        return this.http.post(AppService.base_url + AppService.createGovAntiCompetitive, data)
    }

    // Anti corruption

    public createGovAntiCorrupt(data: any) {
        return this.http.post(AppService.base_url + AppService.createGovAntiCorrupt, data)
    }

    // Incidents corruption
    public createGovIncidentsCorrupt(data: any) {
        return this.http.post(AppService.base_url + AppService.createGovIncidentsCorrupt, data)
    }

    //  #Title: Conflicts of Interest
    public createGovConflictsInterest(data: any) {

        return this.http.post(AppService.base_url + AppService.createGovConflictsInterest, data)
    }
    public updateGovConflictsInterest(data: any) {
        return this.http.put(AppService.base_url + AppService.updateGovConflictsInterest, data)
    }
    public deleteGovConflictsInterest(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteGovConflictsInterest + '/' + id)
    }

    // Disciplinary action against corruption

    public creategovDisciplinaryAction(data: any) {
        return this.http.post(AppService.base_url + AppService.creategovDisciplinaryAction, data)
    }

    // Awareness program on NGBRC principles
    public creategovNGRBCPrinciples(data: any) {
        return this.http.post(AppService.base_url + AppService.creategovNGRBCPrinciples, data)
    }
    // Awareness program for value chain partners on NGRBC principles
    public creategovValueChainNGRBC(data: any) {
        return this.http.post(AppService.base_url + AppService.creategovValueChainNGRBC, data)
    }

    //  #Title: Compliance with laws and regulations
    public createGovLawRegulations(data: any) {

        return this.http.post(AppService.base_url + AppService.createGovLawRegulations, data)
    }
    public updateGovLawRegulations(data: any) {
        return this.http.put(AppService.base_url + AppService.updateGovLawRegulations, data)
    }
    public deleteGovLawRegulations(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteGovLawRegulations + '/' + id)
    }
    //  #Title: Grievances/Complaints
    public createGovGrievances(data: any) {

        return this.http.post(AppService.base_url + AppService.createGovGrievances, data)
    }
    public updateGovGrievances(data: any) {
        return this.http.put(AppService.base_url + AppService.updateGovGrievances, data)
    }
    public deleteGovGrievances(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteGovGrievances + '/' + id)
    }
    //  #Title: Corporate partnership overview
    public createGovCorporate(data: any) {

        return this.http.post(AppService.base_url + AppService.createGovCorporate, data)
    }
    public updateGovCorporate(data: any) {
        return this.http.put(AppService.base_url + AppService.updateGovCorporate, data)
    }
    public deleteGovCorporate(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteGovCorporate + '/' + id)
    }


    public get_users() {
        return this.http.get(AppService.base_url + AppService.getUsers + '?filters[user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_TimePeriod() {
        return this.http.get(AppService.base_url + AppService.getTimePeriod)
    }

    //  modify

    public get_Details(referenceID: any) {
        return this.http.get(AppService.base_url + AppService.getDetails + '?referenceID=' + referenceID)
    }
    public add_team_member(data: any) {
        return this.http.post(AppService.base_url + AppService.addTeamMember, data)
    }

    public update_team_member(data: any) {
        return this.http.put(AppService.base_url + AppService.updateTeamMember, data)
    }

    public delete_team_member(iD: any) {


        return this.http.delete(AppService.base_url + AppService.deleteTeamMember + '/' + iD)
    }

    //#region  ESG Environment
    public createEnvMaterialDetails(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvMaterialsUsed, data)
    }

    public updateEnvMaterialDetails(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvMaterialsUsed, data)
    }

    public deleteEnvMaterialDetails(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvMaterialUsed + '/' + id)
    }

    public updateESGEnvDisStatus(data: any) {
        return this.http.put(AppService.base_url + AppService.updateESGEnvDisStatus, data)
    }
    public updateESGEnvDisAllThemeStatus(data: any) {
        return this.http.put(AppService.base_url + AppService.updateESGEnvDisAllThemeStatus, data)
    }
    public createEnvInputMaterialDetails(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvInputMaterialsUsed, data)
    }

    public updateEnvInputMaterialDetails(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvInputMaterialsUsed, data)
    }

    public deleteEnvInputMaterialDetails(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvInputMaterialsUsed + '/' + id)
    }

    public createEnvNewInputMaterial(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvNewInputMaterial, data)
    }

    public updateEnvNewInputMaterial(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvNewInputMaterial, data)
    }

    public deleteEnvNewInputMaterial(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvNewInputMaterial + '/' + id)
    }

    public createEnvNewProductCategory(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvNewProductCategory, data)
    }

    public updateEnvNewProductCategory(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvNewProductCategory, data)
    }

    public deleteEnvNewProductCategory(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvNewProductCategory + '/' + id)
    }

    public createEnvNewReclaimedProduct(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvNewReclaimedProduct, data)
    }

    public updateEnvNewReclaimedProduct(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvNewReclaimedProduct, data)
    }

    public deleteEnvNewReclaimedProduct(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvNewReclaimedProduct + '/' + id)
    }

    public createEnvReclaimedProduct(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvReclaimedProduct, data)
    }

    public updateEnvReclaimedProduct(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvReclaimedProduct, data)
    }

    public deleteEnvReclaimedProduct(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvReclaimedProduct + '/' + id)
    }

    public createEnvWaterwithdrawal(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvWaterwithdrawal, data)
    }

    public updateEnvWaterwithdrawal(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvWaterwithdrawal, data)
    }

    public deleteEnvWaterwithdrawal(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvWaterwithdrawal + '/' + id)
    }

    public createEnvWaterwithdrawalStress(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvWaterwithdrawalStress, data)
    }

    public updateEnvWaterwithdrawalStress(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvWaterwithdrawalStress, data)
    }

    public deleteEnvWaterwithdrawalStress(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvWaterwithdrawalStress + '/' + id)
    }

    public createEnvWaterdischarge(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvWaterdischarge, data)
    }

    public updateEnvWaterdischarge(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvWaterdischarge, data)
    }

    public deleteEnvWaterdischarge(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvWaterdischarge + '/' + id)
    }

    public createEnvWaterdischargeStress(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvWaterdischargeStress, data)
    }

    public updateEnvWaterdischargeStress(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvWaterdischargeStress, data)
    }

    public deleteEnvWaterdischargeStress(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvWaterdischargeStress + '/' + id)
    }

    public createEnvSpeciesAffected(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvSpeciesAffected, data)
    }

    public updateEnvSpeciesAffected(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvSpeciesAffected, data)
    }

    public deleteEnvSpeciesAffected(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvSpeciesAffected + '/' + id)
    }

    public updateEnvDisclosureStatus(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvDisclosureStatus, data)
    }

    public createEnvTypeofODS(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvTypeofODS, data)
    }

    public createEnvSupplierenvAsmnt(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvSupplierenvAsmnt, data)
    }

    public createEnvWaterRecycled(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvWaterRecycled, data)
    }

    public createEnvImpactAssessment(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvImpactAssessment, data)
    }

    public createEnvHabitat(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvHabitat, data)
    }

    public createEnvImpactofActivities(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvImpactofActivities, data)
    }

    public updateEnvImpactofActivities(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvImpactofActivities, data)
    }

    public deleteEnvImpactofActivities(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvImpactofActivities + '/' + id)
    }

    public createEnvCompliance(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvCompliance, data)
    }

    public createEnvNegetiveImpact(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvNegetiveImpact, data)
    }

    public createEnvEIAofProject(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvEIAofProject, data)
    }

    public updateEnvEIAofProject(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvEIAofProject, data)
    }

    public deleteEnvEIAofProject(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvEIAofProject + '/' + id)
    }

    public createEnvLifecycleAssesssment(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvLifecycleAssesssment, data)
    }

    public createEnvAirEmission(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvAirEmission, data)
    }

    public updateEnvAirEmission(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvAirEmission, data)
    }

    public deleteEnvAirEmission(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvAirEmission + '/' + id)
    }

    public createEnvTypeofWaste(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvTypeofWaste, data)
    }

    public updateEnvTypeofWaste(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvTypeofWaste, data)
    }

    public deleteEnvTypeofWaste(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvTypeofWaste + '/' + id)
    }

    public createEnvTypeofWasteData(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvTypeofWasteData, data)
    }

    public updateEnvTypeofWasteData(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvTypeofWasteData, data)
    }

    public deleteEnvTypeofWasteData(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvTypeofWasteData + '/' + id)
    }

    public updateEnvWasteDirected(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvWasteDirected, data)
    }

    public deleteEnvWasteDirected(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvWasteDirected + '/' + id)
    }

    public updateEnvWasteDiverted(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvWasteDiverted, data)
    }

    public deleteEnvWasteDiverted(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvWasteDiverted + '/' + id)
    }

    public updateEnvWasteGenerated(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvWasteGenerated, data)
    }

    public deleteEnvWasteGenerated(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvWasteGenerated + '/' + id)
    }
    // new fuel name - env
    public createEnvNewFuelName(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvNewFuelName, data)
    }

    public updateEnvNewFuelName(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvNewFuelName, data)
    }

    public deleteEnvNewFuelName(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvNewFuelName + '/' + id)
    }

    public createEnvDownstreamCategory(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvDownstreamCategory, data)
    }

    public updateEnvDownstreamCategory(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvDownstreamCategory, data)
    }

    public deleteEnvDownstreamCategory(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvDownstreamCategory + '/' + id)
    }

    public createEnvUpstreamCategory(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvUpstreamCategory, data)
    }

    public updateEnvUpstreamCategory(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvUpstreamCategory, data)
    }

    public deleteEnvUpstreamCategory(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvUpstreamCategory + '/' + id)
    }

    public createEnvEmissionIntensityBase(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvEmissionIntensityBase, data)
    }

    public updateEnvEmissionIntensityBase(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvEmissionIntensityBase, data)
    }

    public deleteEnvEmissionIntensityBase(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvEmissionIntensityBase + '/' + id)
    }

    public createEnvEnergyConsumptionWithin(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvEnergyConsumptionWithin, data)
    }

    public updateEnvEnergyConsumptionWithin(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvEnergyConsumptionWithin, data)
    }

    public deleteEnvEnergyConsumptionWithin(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvEnergyConsumptionWithin + '/' + id)
    }

    public createEnvEnergyConsumptionOutside(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvEnergyConsumptionOutside, data)
    }

    public updateEnvEnergyConsumptionOutside(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvEnergyConsumptionOutside, data)
    }

    public deleteEnvEnergyConsumptionOutside(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvEnergyConsumptionOutside + '/' + id)
    }

    public createEnvRenewableFuel(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvRenewableFuel, data)
    }

    public updateEnvRenewableFuel(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvRenewableFuel, data)
    }

    public deleteEnvRenewableFuel(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvRenewableFuel + '/' + id)
    }

    public createEnvNonRenewableFuel(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvNonRenewableFuel, data)
    }

    public updateEnvNonRenewableFuel(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvNonRenewableFuel, data)
    }

    public deleteEnvNonRenewableFuel(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvNonRenewableFuel + '/' + id)
    }

    public createEnvDirectEmission(data: any) {
        return this.http.post(AppService.base_url + AppService.createEnvDirectEmission, data)
    }

    public updateEnvDirectEmission(data: any) {
        return this.http.put(AppService.base_url + AppService.updateEnvDirectEmission, data)
    }

    public deleteEnvDirectEmission(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteEnvDirectEmission + '/' + id)
    }
    public updateTypeofODS(data: any) {
        return this.http.put(AppService.base_url + AppService.updateTypeofODS, data)
    }
    public create_new_type_of_ods(data: any) {
        return this.http.post(AppService.base_url + AppService.create_new_type_of_ods, data)
    }
    public deleteTypeofODS(id: any) {
        return this.http.delete(AppService.base_url + AppService.deleteTypeofODS + '/' + id)
    }
    //#endregion


    //ESG General Disclosure

    public esg_create_genDisclosure(data: any) {
        return this.http.post(AppService.base_url + AppService.createESGGeneralDisclosure, data)
    }
    public esg_register_genDisclosure(startIndex: any, pageSize: any) {
        return this.http.get(AppService.base_url + AppService.ESGGeneralDisclosureRegister + '?pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_general_esg(startIndex: any, pageSize: any) {
        return this.http.get(AppService.base_url + AppService.getGeneralDisclosure + '?pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public esg_update_genDisclosure(data: any) {
        return this.http.put(AppService.base_url + AppService.updateESGGeneralDisclosure, data)
    }
    public get_genDisclosure(id: any) {
        return this.http.get(AppService.base_url + AppService.ESGGeneralDisclosure + '?id=' + id)
    }
    public get_genDis_dropdown_values() {

        return this.http.get(AppService.base_url + AppService.getGenDisDropDownValues)
    }

    //#endregion

    //#region ESG Dashboard 
    public getSDGValues(filters?: any) {
        const params = new HttpParams({ fromObject: filters });
        return this.http.get(AppService.base_url + AppService.getSDGDashboardData, { params });
    }

    public getESGValues(filters?: any) {
        const params = new HttpParams({ fromObject: filters });
        return this.http.get(AppService.base_url + AppService.getESGDashboardData, { params });
    }


    public get_data_year_month_div(year: any, month: any, div: any) {

        return this.http.get(AppService.base_url + AppService.getSDGDashboardData + `?filters[year]=${year}&filters[month]=${month}&filters[business_units][division_uuid]=${div}`)
    }

    // public get_data_month_div(month: any, div: any) {
    //     return this.http.get(AppService.base_url + AppService.getSDGValues + '?filter[year]=' + year)
    // }
    // public get_data_year_month(year: any, month: any) {
    //     return this.http.get(AppService.base_url + AppService.getSDGValues + '?filter[year]=' + year)
    // }
    // public get_data_year_div(year: any, div: any) {
    //     return this.http.get(AppService.base_url + AppService.getSDGValues + '?filter[year]=' + year)
    // }
    // public get_data_year(year: any) {
    //     return this.http.get(AppService.base_url + AppService.getSDGValues + '?filter[year]=' + year)
    // }
    // public get_data_month(month: any) {
    //     return this.http.get(AppService.base_url + AppService.getSDGValues + '?filter[year]=' + year)
    // }
    // public get_data_div(div: any) {
    //     return this.http.get(AppService.base_url + AppService.getSDGValues + '?filter[year]=' + year)
    // }

    public getSDGDistributions() {
        return this.http.get(AppService.base_url + AppService.getSDGDashboardData)
    }
    public getESGData() {
        return this.http.get(AppService.base_url + AppService.getESGDashboardData)
    }
    public getEMPTypeData(type: any) {
        const params = new HttpParams().set('employeeType', type);
        return this.http.get(AppService.base_url + AppService.getESGDashboardData, { params })
    }
    //#endregion

    // Calendar Year-based esg report

    public esg_individual_report(
        year: string,
        report_type: string,
        reference_id: string
    ): any {
        const url = `${AppService.report}reports/reports/${environment.report_location}/esg_pdf/calendar_year/sattva_esg_report.pdf?year=${year}&report_type=${report_type}&reference_id=${reference_id}&j_username=${environment.j_username}&j_password=${environment.j_password}`;

        return this.http.get(url, {
            responseType: 'blob' as 'json'
        });
    }

    // Financial year-based esg report

    public esg_individual_report_financial_year(
        financial_months: string,
        report_type: string,
        reference_id: string,
        financial_years: string
    ): any {
        const url = `${AppService.report}reports/reports/${environment.report_location}/esg_pdf/financial_year/sattva_esg_report.pdf?financial_months=${financial_months}&report_type=${report_type}&reference_id=${reference_id}&financial_years=${financial_years}&j_username=${environment.j_username}&j_password=${environment.j_password}`;

        return this.http.get(url, {
            responseType: 'blob' as 'json'
        });
    }


    // esg excel report

    public esg_report_excel(year: any, report_type: string): any {
        return this.http.get(
            `${AppService.report}reports/reports/${environment.report_location}/esg_excel/calendar_year/sattva_esg_excel_report.xlsx?year=${encodeURIComponent(year)}&report_type=${encodeURIComponent(report_type)}&j_username=${encodeURIComponent(environment.j_username)}&j_password=${encodeURIComponent(environment.j_password)}`,
            { responseType: 'blob', headers: { skip: 'true' } }
        );
    }


}