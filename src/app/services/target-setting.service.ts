import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TargetSettingService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }

    public get_target() {
        return this.http.get(AppService.base_url + AppService.target_setting + '?populate=responsible&populate=approver&populate=target_progresses&pagination[limit]=-1&sort[0]=id:desc')
    }
    //get target settings
    public get_target_setting(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.target_setting + '?populate=responsible&populate=approver&populate=target_progresses&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_target_setting_search(reference: any) {
        return this.http.get(AppService.base_url + AppService.target_setting + '?filters[reference_number]=' + reference + '&populate=responsible&populate=approver&populate=target_progresses&sort[0]=id:desc')
    }

    public get_target_setting_unit_specific(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.target_setting + '?' + division + '&populate=responsible&populate=approver&populate=target_progresses&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_target_setting_unit_specific_search(reference: any, division: any) {
        return this.http.get(AppService.base_url + AppService.target_setting + '?' + division + '&filters[reference_number]=' + reference + '&populate=responsible&populate=approver&populate=target_progresses&sort[0]=id:desc')
    }

    public get_possible_category() {
        return this.http.get(AppService.base_url + AppService.possible_category + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_emission_factor() {
        return this.http.get(AppService.base_url + AppService.emission_factor + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_opportunity() {
        return this.http.get(AppService.base_url + AppService.opportunity + '?populate=possible_category&pagination[limit]=-1&sort[0]=id:desc')
    }
    //create target setting
    public create_target_setting(data: any) {
        return this.http.post(AppService.base_url + AppService.target_setting, {
            data: {
                reference_number: data.reference_number,
                division: data.division,
                department: data.department,
                category: data.category,
                findings: data.findings,
                source: data.source,
                improvement_action: data.action,
                improvement_possibility: data.possibility_category,
                improvement_possibility_sub_category: data.possibility_subcategory,
                baseline_consumption: data.baseline_consumption,
                baseline_unit: data.baseline_Unit,
                expected_saving: data.expected_saving,
                expected_saving_unit: data.baseline_Unit,
                cost_saving: data.cost_saving,
                expected_ghg_emission_reduction: data.expected_GHG_emission,
                expected_ghg_emission_reduction_unit: "CO2",
                target_reduction: data.target_reduction,
                implemention_cost: data.implementation_cost,
                pay_back_period: data.payback_period,
                implemention_start: data.start,
                implementation_end: data.end,
                project_lifespan: data.project_lifespan,
                transaction_date: data.reported_date,
                responsible: data.responsible,
                approver: data.approver,
                created_By: data.reporter,
                target_energy_consumption: data.target_energy_consumption,
                assigned: data.approver,
                business_unit: data.business_unit

            }

        })
    }


    public create_target_source(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.target_source, {
            data: {
                source: data.source,
                standard: data.standard,
                baseline_consumption: data.baseline_consumption,
                expected_savings: data.expected_savings,
                GHG_emission: data.GHG_emission,
                target_setting: id
            }
        })
    }
    public create_possible_category(data: any) {
        return this.http.post(AppService.base_url + AppService.possible_category, {
            data: {
                possible_category: data.possible_category,
                created_user: data.created_user,
                category: data.category
            }
        })
    }

    public create_opportunity(data: any) {
        return this.http.post(AppService.base_url + AppService.opportunity, {
            data: {
                opportunity: data.opportunity,
                possible_category: data.possible_category,
                created_user: data.created_user
            }
        })
    }

    public update_target_setting(data: any) {
        return this.http.put(AppService.base_url + AppService.target_setting + '/' + data.id, {
            data: {
                division: data.division,
                department: data.department,
                category: data.category,
                findings: data.findings,
                source: data.source,
                improvement_action: data.action,
                improvement_possibility: data.possibility_category,
                improvement_possibility_sub_category: data.possibility_subcategory,
                baseline_consumption: data.baseline_consumption,
                baseline_unit: data.baseline_Unit,
                expected_saving: data.expected_saving,
                expected_saving_unit: data.baseline_Unit,
                cost_saving: data.cost_saving,
                expected_ghg_emission_reduction: data.expected_GHG_emission,
                expected_ghg_emission_reduction_unit: "CO2",
                target_reduction: data.target_reduction,
                implemention_cost: data.implementation_cost,
                pay_back_period: data.payback_period,
                implemention_start: data.start,
                implementation_end: data.end,
                project_lifespan: data.project_lifespan,
                responsible: data.responsible,
                target_energy_consumption: data.target_energy_consumption,
                business_unit: data.business_unit
            }

        })
    }


    public create_evidence(data: any) {
        return this.http.post(AppService.base_url + AppService.target_evidence, {
            data: {
                evidence_name: data.evidence_name,
                format: data.format,
                image_id: data.id,
                target_setting: data.target
            }
        })
    }

    public create_evidence_after(data: any) {
        return this.http.post(AppService.base_url + AppService.target_evidence, {
            data: {
                evidence_name: data.evidence_name,
                format: data.format,
                image_id: data.id,
                target_setting: data.target,
                evidence_after: true
            }
        })
    }

    //get target settings assigned
    // public get_target_setting_assigned(userID: any) {
    //     return this.http.get(AppService.base_url + AppService.target_setting + '?filters[assigned]=' + userID + '&filters[$or][0][status]=Open&filters[$or][1][status]=Approved&populate[0]=responsible&populate[1]=responsible.image&populate[2]=approver&populate[3]=approver.image&pagination[limit]=-1&sort[0]=id:desc')
    // }

    public get_target_setting_assigned(userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.target_setting + '?filters[$or][0][approver]=' + userID + '&filters[$or][1][responsible]=' + userID + '&filters[$or][0][status]=Open&filters[$or][1][status]=Approved&filters[$or][2][status]=In-Progress&populate[0]=responsible&populate[2]=approver&populate=target_progresses&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_target_setting_assigned_search(reference: any, userID: any) {
        return this.http.get(AppService.base_url + AppService.target_setting + '?filters[reference_number]=' + reference + '&filters[$or][0][approver]=' + userID + '&filters[$or][1][responsible]=' + userID + '&filters[$or][0][status]=Open&filters[$or][1][status]=Approved&filters[$or][2][status]=In-Progress&populate[0]=responsible&populate[2]=approver&populate=target_progresses&sort[0]=id:desc')
    }

    public get_target_setting_unit_specific_assigned(userID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.target_setting + '?filters[$or][0][approver]=' + userID + '&' + division + '&filters[$or][1][responsible]=' + userID + '&filters[$or][0][status]=Open&filters[$or][1][status]=Approved&filters[$or][2][status]=In-Progress&populate[0]=responsible&populate[2]=approver&populate=target_progresses&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_target_setting_unit_specific_assigned_search(reference: any, userID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.target_setting + '?filters[reference_number]=' + reference + '&' + division + '&filters[$or][0][approver]=' + userID + '&filters[$or][1][responsible]=' + userID + '&filters[$or][0][status]=Open&filters[$or][1][status]=Approved&filters[$or][2][status]=In-Progress&populate[0]=responsible&populate[2]=approver&populate=target_progresses&sort[0]=id:desc')
    }

    // //get target settings assigned
    // public get_target_setting_assigned(userID: any) {
    //     return this.http.get(AppService.base_url + AppService.target_setting + '?filters[assigned]=' + userID + '&filters[status]=Open&populate[0]=responsible&populate[1]=responsible.image&populate[2]=approver&populate[3]=approver.image&pagination[limit]=-1&sort[0]=id:desc')
    // }

    //get target setting details
    public get_target_setting_details(referece: any) {
        return this.http.get(AppService.base_url + AppService.target_setting + '?filters[reference_number]=' + referece + '&populate[0]=responsible&populate[1]=responsible.image&populate[2]=approver&populate[3]=approver.image&populate=created_By&populate=evidences&populate=target_progresses&pagination[limit]=-1&sort[0]=id:desc&populate=business_unit&populate=target_setting_sources')
    }

    //update target setting
    public update_target(data: any) {
        return this.http.put(AppService.base_url + AppService.target_setting + '/' + data.id, {
            data: {
                division: data.division,
                department: data.department,
                category: data.category,
                findings: data.findings,
                source: data.source,
                improvement_action: data.action,
                improvement_possibility: data.possibility_category,
                improvement_possibility_sub_category: data.possibility_subcategory,
                baseline_consumption: data.baseline_consumption,
                baseline_unit: data.baseline_Unit,
                expected_saving: data.expected_saving,
                expected_saving_unit: data.baseline_Unit,
                cost_saving: data.cost_saving,
                expected_ghg_emission_reduction: data.expected_GHG_emission,
                expected_ghg_emission_reduction_unit: "CO2",
                target_reduction: data.target_reduction,
                implemention_cost: data.implementation_cost,
                pay_back_period: data.payback_period,
                implemention_start: data.start,
                implementation_end: data.end,
                project_lifespan: data.project_lifespan,
                transaction_date: data.reported_date,
                responsible: data.responsible,
                approver: data.approver,
                updated_By: data.reporter,
                target_energy_consumption: data.target_energy_consumption,
                assigned: data.responsible,
                status: data.status,
                responsible_notification: false,
                status_complete_notification: data.complete_notification


            }

        })
    }

    public get_target_progress_targetID(targetID: any) {
        return this.http.get(AppService.base_url + AppService.target_progress + '?filters[target_setting][id]=' + targetID + '&populate=target_setting&pagination[limit]=-1&sort[0]=id:desc')
    }

    public create_target_progress(targetID: any, data: any) {
        return this.http.post(AppService.base_url + AppService.target_progress, {
            data: {
                year: data.year,
                actual_savings: data.actual_savings,
                target_consumption: data.targeted_consumption,
                actual_ghs: data.actual_ghs_emission,
                remarks: data.remarks,
                target_setting: targetID
            }
        })

    }

    public delete_evidence_after(id: any) {
        return this.http.delete(AppService.base_url + AppService.target_evidence + '/' + id)
    }

    //get report
    public target_report(id: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_target_setting_report_v1.pdf?targetID=' + id + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }


}