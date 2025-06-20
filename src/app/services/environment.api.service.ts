
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';
import { category } from '../apps/audit-inspection/audit-calendar/audit-calendar/data';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }
    public get_consumption_values(division: any, year: any, month: any) {
        return this.http.get(AppService.base_url + AppService.environment + '?filters[division]=' + division + '&filters[year]=' + year + '&filters[month]=' + month + '&pagination[limit]=-1&sort[0]=id:desc')
    }
    //get environment

    public get_environment() {
        return this.http.get(AppService.base_url + AppService.environment + '?populate=reviewer&populate=approver&populate=target_progresses&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_environment_all_entries() {
        return this.http.get(AppService.base_url + AppService.environment + '?publicationState=preview&populate=reviewer&populate=approver&populate=target_progresses&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_environment_register(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.environment + '?populate=reviewer&populate=created_user&populate=approver&populate=target_progresses&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_environment_search(reference: any) {
        return this.http.get(reference ? AppService.base_url + AppService.environment + '?filters[reference_number]=' + reference + '&populate=reviewer&populate=approver&populate=target_progresses&sort[0]=id:desc' : AppService.base_url + AppService.environment + '?populate=reviewer&populate=approver&populate=target_progresses&sort[0]=id:desc')
    }

    public get_environment_unit_specific_register(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.environment + '?' + division + '&populate=reviewer&populate=created_user&populate=approver&populate=target_progresses&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_environment_unit_specific_search(reference: any, division: any, startIndex: number, pageSize: number) {
        return this.http.get(reference ? AppService.base_url + AppService.environment + '?filters[reference_number]=' + reference + '&' + division + '&populate=reviewer&populate=created_user&populate=approver&populate=target_progresses&sort[0]=id:desc' : AppService.base_url + AppService.environment + '?' + division + '&populate=reviewer&populate=created_user&populate=approver&populate=target_progresses&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_environment_division_search(reference: any, division: any, startIndex: number, pageSize: number,) {
        return this.http.get(reference ? AppService.base_url + AppService.environment + '?filters[reference_number]=' + reference + '&' + division + '&populate=reviewer&populate=created_user&populate=approver&populate=target_progresses&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc' :
            AppService.base_url + AppService.environment + '?' + division + '&populate=reviewer&populate=created_user&populate=approver&populate=target_progresses&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_environment_div_specific_search(division: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.environment + '?' + division + '&populate=reviewer&populate=created_user&populate=approver&populate=target_progresses&sort[0]=id:desc')
    }
    //create environment
    public create_environment(data: any) {
        return this.http.post(AppService.base_url + AppService.environment, {
            data: {
                year: data.year,
                month: data.month,
                reference_number: data.reference_number,
                status: data.status,
                division: data.division,
                work_force: data.work_force,
                days_worked: data.days_worked,
                product_produced_kg: data.product_produced_kg,
                product_produced_pieces: data.product_produced_pieces,
                area: data.area,
                reviewer: data.reviewer,
                created_user: data.created_user,
                reported_date: data.reported_date,
                reviewer_notification: data.reviewer_notification,
                pending_consumption: data.pending_consumption,
                pending_percentage: data.pending_percentage,
                pending_color_code: data.pending_color_code,
                business_unit: data.business_unit
            }
        })
    }

    //create consumptions
    public create_consumption_env(datas: any, envid: any, year: any, month: any, division: any) {

        return this.http.post(AppService.base_url + AppService.env_consumption, {
            data: {
                consumption_category: datas.consumption_category,
                category: datas.category,
                source: datas.source,
                unit: datas.unit,
                quantity: datas.quantity,
                amount: datas.amount,
                scope: datas.scope,
                meter_reading: datas?.meter_reading,
                quantity_source: datas?.quantity_source,
                description: datas.description,
                treatment: datas.treatment,
                collected_from: datas.collected_from,
                collected_to: datas.collected_to,
                disposal_method: datas.disposal_method,
                disposal_date: datas.disposal_date,
                consignment_number: datas.consignment_number,
                disposer: datas.disposer,
                carrier: datas.carrier,
                disposal_place: datas.disposal_place,
                pollutants_emitted: datas?.pollutantsEmitted ? datas?.pollutantsEmitted[0].pollutants_emitted : "",
                concentration: datas.concentration,
                determined_by: datas.determined_by,
                environment: envid,
                emission_factor: datas.emission_factor,
                year: year,
                month: month,
                division: division,
                renewable_energy_source: datas.renewable_energy_source,
                ghg_value: datas.ghg_value,
                conversion_factor: datas.conversion_factor,
                conversion_value: datas.conversion_value,
                quantity_kwh: datas.quantity_kwh,
                emission_value: datas.emission_value,
                refrigerant_type: datas.refrigerant_type,
                water_type: datas.water_type,
                treatment_outcome: datas.treatment_outcome,
                reused_recycled_quantity: datas.reused_recycled_quantity,
                treatment_outcome_recycled: datas.treatment_outcome_recycled,
                treatment_outcome_reused: datas.treatment_outcome_reused,
                applicability: datas.applicability,
                usage_type: datas.usage_type,
                source_capacity: datas.source_capacity,
                legal_emission_limit: datas.legal_emission_limit,
                control_device: datas.control_device,
                latest_test: datas.latest_test,
                monitoring_frequency: datas.monitoring_frequency,
                rec_status: datas.rec_status,
                rec_type: datas.rec_type,
                i_rec_quantity: datas.i_rec_quantity,
                scope_1_cateogry: datas.scope_1_cateogry,
                source_type: datas.source_type,
                volumetric_flow_rate: datas.volumetric_flow_rate,
                operation_time: datas.operation_time,
                testing_organization: datas.testing_organization,
                compliance_status: datas.compliance_status,
                opening_balance: datas.opening_balance,
                purchased_quantity: datas.purchased_quantity,
                purchase_date: datas.purchase_date,
                usage: datas.usage,
                supplier_name: datas.supplier_name,
                stock_balance: datas.stock_balance,
                add_issue: datas.add_issue,
                add_meter: datas.add_meter,
                waste_type:datas.waste_type
            }
        })
    }

    //create evidence
    public create_env_evidence(data: any) {
        return this.http.post(AppService.base_url + AppService.env_evidence, {
            data: {
                evidence_name: data.evidence_name,
                format: data.format,
                image_id: data.id,
                consumption: data.consumption
            }
        })
    }

    public create_waste_type(data:any,id:any){
        return this.http.post(AppService.base_url + AppService.waste_type,{
            data:{
                type:data.waste_type,
                category:data.category,
                created_user:data.id

            }
        })
    }

    
    public get_waste_type() {
        return this.http.get(AppService.base_url + AppService.waste_type + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    //get environment details
    public get_env_details(reference: any) {
        return this.http.get(AppService.base_url + AppService.environment + '?filters[reference_number]=' + reference + '&populate[0]=consumptions&populate[1]=consumptions.evidences&populate[3]=consumptions.environment_issues&populate[4]=consumptions.environment_refrigerants&populate[5]=consumptions.env_sub_meter_details&populate=reviewer&populate=approver&populate=created_user&populate=created_user&populate=business_unit')
    }

    public get_consumption_details(id: any) {
        return this.http.get(AppService.base_url + AppService.env_consumption + '?filters[id]=' + id + '&populate=evidences&populate=environment_issues&populate=environment_refrigerants&populate[0]=environment_refrigerants.equipment')
    }

    public getConsumptionByYear(year: number, division: any) {
        return this.http.get(AppService.base_url + AppService.env_consumption + '?filters[year]=' + year + '&filters[division]=' + division + '&filters[consumption_category]=' + 'Energy' + '&filters[source]=' + 'Refrigerants' + '&populate=evidences&populate=environment_issues&populate=environment_refrigerants&populate[0]=environment_refrigerants.equipment')
    }

    public get_env_approvers() {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][env_action][$eq]=true&filters[$and][1][user][blocked][$eq]=false&populate=divisions&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_unit_specific_env_approvers(division: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][env_action][$eq]=true&populate=divisions&' + division + '&filters[$and][1][user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_env_reviewers() {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][env_reviewer_action][$eq]=true&filters[$and][1][user][blocked][$eq]=false&populate=divisions&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_unit_specific_env_reviewers(division: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][env_reviewer_action][$eq]=true&populate=divisions&' + division + '&filters[$and][1][user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }
    //update environment
    public update_environment(data: any) {
        return this.http.put(AppService.base_url + AppService.environment + '/' + data.id, {
            data: {
                year: data.year,
                month: data.month,
                status: data.status,
                division: data.division,
                work_force: data.work_force,
                days_worked: data.days_worked,
                product_produced_kg: data.product_produced_kg,
                product_produced_pieces: data.product_produced_pieces,
                area: data.area,
                reviewer: data.reviewer,
                updated_user: data.updated_user,
                modified_date: data.modified_date,
                reviewer_notification: data.reviewer_notification,
                pending_consumption: data.pending_consumption,
                pending_percentage: data.pending_percentage,
                pending_color_code: data.pending_color_code,
                business_unit: data.business_unit
            }
        })
    }
    //delete consumption evidence
    public delete_consumption_evidence(id: any) {
        return this.http.delete(AppService.base_url + AppService.env_evidence + '/' + id)
    }

    //delete consumption
    public delete_consumption(id: any) {
        return this.http.delete(AppService.base_url + AppService.env_consumption + '/' + id)
    }

    //get images
    public getImage(imageUrl: string): Observable<Blob> {
        return this.http.get(imageUrl, { responseType: 'blob' });
    }

    //update pending consumption and percentage
    public update_pen_con_per(data: any) {
        return this.http.put(AppService.base_url + AppService.environment + '/' + data.id, {
            data: {
                pending_consumption: data.pending_consumption,
                pending_percentage: data.pending_percentage,
                pending_color_code: data.pending_color_code

            }

        })
    }

    //get environment
    public get_environment_register_assigned(profileID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.environment + '?filters[$or][0][status]=Under review&filters[$or][1][status]=Reviewed&filters[$or][0][reviewer]=' + profileID + '&filters[$or][1][approver]=' + profileID + '&populate[0]=reviewer&populate[1]=reviewer.image&populate[2]=approver&populate[3]=approver.image&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_environment_register_assigned_search(reference: any, profileID: any) {
        return this.http.get(AppService.base_url + AppService.environment + '?filters[reference_number]=' + reference + '&filters[$or][0][status]=Under review&filters[$or][1][status]=Reviewed&filters[$or][0][reviewer]=' + profileID + '&filters[$or][1][approver]=' + profileID + '&populate[0]=reviewer&populate[1]=reviewer.image&populate[2]=approver&populate[3]=approver.image&sort[0]=id:desc')
    }
    public get_environment_unit_specific_assigned(profileID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.environment + '?' + division + '&filters[$or][0][status]=Under review&filters[$or][1][status]=Reviewed&filters[$or][0][reviewer]=' + profileID + '&filters[$or][1][approver]=' + profileID + '&populate[0]=reviewer&populate[1]=reviewer.image&populate[2]=approver&populate[3]=approver.image&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_environment_unit_specific_assigned_search(reference: any, profileID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.environment + '?filters[reference_number]=' + reference + '&' + division + '&filters[$or][0][status]=Under review&filters[$or][1][status]=Reviewed&filters[$or][0][reviewer]=' + profileID + '&filters[$or][1][approver]=' + profileID + '&populate[0]=reviewer&populate[1]=reviewer.image&populate[2]=approver&populate[3]=approver.image&sort[0]=id:desc')
    }
    //reject environment
    public reject_environment(data: any, reason: any) {
        return this.http.put(AppService.base_url + AppService.environment + '/' + data.id, {
            data: {
                reject_reason: reason.reason,
                status: "Rejected",
                updated_user: data.updated_user,
                reject_notification: false
            }
        })
    }

    //approver reject environment
    public reject_approver_environment(data: any, reason: any) {
        return this.http.put(AppService.base_url + AppService.environment + '/' + data.id, {
            data: {
                approver_reject_reason: reason.reason,
                status: "Rejected",
                updated_user: data.updated_user,
                approver_reject_notification: false
            }
        })
    }

    //review environment
    public review_environment(data: any) {
        return this.http.put(AppService.base_url + AppService.environment + '/' + data.id, {
            data: {
                status: "Reviewed",
                approver: data.approver,
                updated_user: data.updated_user,
                approver_notification: false,
                review_creator_notification: false
            }
        })
    }

    //approve environment
    public approve_environment(data: any) {
        return this.http.put(AppService.base_url + AppService.environment + '/' + data.id, {
            data: {
                status: "Approved",
                updated_user: data.updated_user,
                approve_notification: false
            }
        })
    }

    //get report
    public environment_report(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_env_report_v1.pdf?year=' + data.year + '&division=' + data.division + '&user=' + data.reporting_person + '&updated_date=' + data.updated_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public environment_report_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_env_report_excel_1.xlsx?year=' + data.year + '&division=' + data.division + '&user=' + data.reporting_person + '&updated_date=' + data.updated_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    // waste inventory reports with timeperiod

    public waste_inventory_report_pdf(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/waste_inventory_report_pdf.pdf?start_year=' + data.startDate + '&end_year=' + data.endDate + '&start_month=' + data.startMonth + '&end_month=' + data.endMonth + '&division=' + data.division + '&user=' + data.reporting_person + '&updated_date=' + data.updated_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public waste_inventory_report_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/waste_inventory_report_excel.xlsx?start_year=' + data.startDate + '&end_year=' + data.endDate + '&start_month=' + data.startMonth + '&end_month=' + data.endMonth + '&division=' + data.division + '&user=' + data.reporting_person + '&updated_date=' + data.updated_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    // waste inventory reports without timeperiod

    public waste_inventory_report_pdf1(data: any) {
        let url = `${AppService.report}reports/reports/${environment.report_location}/waste_inventory_report_pdf.pdf?year=${data.year.toString()}&division=${data.division}&user=${data.reporting_person}&updated_date=${data.updated_date}&j_username=${environment.j_username}&j_password=${environment.j_password}`;

        // Add month param only if it's not null or undefined
        if (data.month) {
            url += `&month=${data.month}`;
        }

        return this.http.get(url, { responseType: 'blob', headers: { skip: "true" } });
    }

    public waste_inventory_report_excel1(data: any) {
        let url = `${AppService.report}reports/reports/${environment.report_location}/waste_inventory_report_excel.xlsx?year=${data.year.toString()}&division=${data.division}&user=${data.reporting_person}&updated_date=${data.updated_date}&j_username=${environment.j_username}&j_password=${environment.j_password}`;

        // Add month param only if it's not null or undefined
        if (data.month) {
            url += `&month=${data.month}`;
        }

        return this.http.get(url, { responseType: 'blob', headers: { skip: "true" } });
    }


    // ODS reports with timeperiod

    public ods_report_pdf(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_env_ods_report_pdf.pdf?start_date=' + data.startDate + '&end_date=' + data.endDate + '&start_month=' + data.startMonth + '&end_month=' + data.endMonth + '&division=' + data.division + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&company_name=' + data.company_name + '&defualt_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public ods_report_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_env_ods_report_excel.xlsx?start_date=' + data.startDate + '&end_date=' + data.endDate + '&start_month=' + data.startMonth + '&end_month=' + data.endMonth + '&division=' + data.division + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&company_name=' + data.company_name + '&defualt_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    // ODS reports without timeperiod

    public ods_report_pdf1(data: any) {
        let url = `${AppService.report}reports/reports/${environment.report_location}/sattva_env_ods_report_pdf.pdf?year=${data.year.toString()}&division=${data.division}&reporting_person=${data.reporting_person}&reporting_mail=${data.reporting_mail}&company_name=${data.company_name}&defualt_date=${data.defualt_date}&j_username=${environment.j_username}&j_password=${environment.j_password}`;
        return this.http.get(url, { responseType: 'blob', headers: { skip: "true" } });
    }

    public ods_report_excel1(data: any) {
        let url = `${AppService.report}reports/reports/${environment.report_location}/sattva_env_ods_report_excel.xlsx?year=${data.year.toString()}&division=${data.division}&reporting_person=${data.reporting_person}'&reporting_mail=${data.reporting_mail}&company_name=${data.company_name}&defualt_date=${data.defualt_date}&j_username=${environment.j_username}&j_password=${environment.j_password}`;
        return this.http.get(url, { responseType: 'blob', headers: { skip: "true" } });
    }

    // Refrigerant Inventory reports with timeperiod

    public refrigerant_inventory_report_pdf(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_env_refrigerant_inventory_pdf.pdf?start_date=' + data.startDate + '&end_date=' + data.endDate + '&division=' + data.division + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&company_name=' + data.company_name + '&defualt_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public refrigerant_inventory_report_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_env_refrigerant_inventory_excel.xlsx?start_date=' + data.startDate + '&end_date=' + data.endDate + '&division=' + data.division + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&company_name=' + data.company_name + '&defualt_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    // Refrigerant Inventory reports without timeperiod

    public refrigerant_inventory_report_pdf1(data: any) {
        let url = `${AppService.report}reports/reports/${environment.report_location}/sattva_env_refrigerant_inventory_pdf.pdf?year=${data.year.toString()}&division=${data.division}&reporting_person=${data.reporting_person}&reporting_mail=${data.reporting_mail}&company_name=${data.company_name}&defualt_date=${data.defualt_date}&j_username=${environment.j_username}&j_password=${environment.j_password}`;
        return this.http.get(url, { responseType: 'blob', headers: { skip: "true" } });
    }

    public refrigerant_inventory_report_excel1(data: any) {
        let url = `${AppService.report}reports/reports/${environment.report_location}/sattva_env_refrigerant_inventory_excel.xlsx?year=${data.year.toString()}&division=${data.division}&reporting_person=${data.reporting_person}'&reporting_mail=${data.reporting_mail}&company_name=${data.company_name}&defualt_date=${data.defualt_date}&j_username=${environment.j_username}&j_password=${environment.j_password}`;
        return this.http.get(url, { responseType: 'blob', headers: { skip: "true" } });
    }

    //####### dashboard 

    //get data by year
    public get_environ_data_year(year: any, division: any) {
        return this.http.get(AppService.base_url + AppService.env_consumption + '?filters[environment][year]=' + year + '&' + division + '&filters[environment][status]=Approved&populate=environment&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_target_setting_data(division: any) {
        return this.http.get(AppService.base_url + AppService.target_setting + '?filters[status][$ne]=Completed&' + division + '&populate=target_progresses&pagination[limit]=-1&sort[0]=id:desc')

    }

    public get_target_progress_data(division: any) {
        return this.http.get(AppService.base_url + AppService.target_progress + '?filters[target_setting][status][$ne]=Completed&' + division + '&populate=target_setting&pagination[limit]=-1&sort[0]=id:desc')
    }



    //get data by year, month,division
    public get_environ_data_year_month_div(year: any, month: any, division: any) {
        return this.http.get(AppService.base_url + AppService.env_consumption + '?filters[environment][year]=' + year + '&filters[environment][month]=' + month + '&filters[environment][business_unit][division_uuid]=' + division + '&filters[environment][status]=Approved&populate=environment&pagination[limit]=-1&sort[0]=id:desc')
    }


    //get data by month,division
    public get_environ_data_month_div(month: any, division: any) {
        return this.http.get(AppService.base_url + AppService.env_consumption + '?filters[environment][month]=' + month + '&filters[environment][business_unit][division_uuid]=' + division + '&filters[environment][status]=Approved&populate=environment&pagination[limit]=-1&sort[0]=id:desc')
    }

    //get data by year, month
    public get_environ_data_year_month(year: any, month: any, division: any) {
        return this.http.get(AppService.base_url + AppService.env_consumption + '?filters[environment][year]=' + year + '&filters[environment][month]=' + month + '&filters[environment][status]=Approved&populate=environment&pagination[limit]=-1&sort[0]=id:desc')
    }

    //get data by year,division
    public get_environ_data_year_div(year: any, division: any) {
        return this.http.get(AppService.base_url + AppService.env_consumption + '?filters[environment][year]=' + year + '&filters[environment][business_unit][division_uuid]=' + division + '&filters[environment][status]=Approved&populate=environment&pagination[limit]=-1&sort[0]=id:desc')
    }

    //get data by month
    public get_environ_data_month(month: any, division: any) {
        return this.http.get(AppService.base_url + AppService.env_consumption + '?filters[environment][month]=' + month + '&' + division + '&filters[environment][status]=Approved&populate=consumptions&pagination[limit]=-1&sort[0]=id:desc')
    }

    //get data by division
    public get_environ_data_div(division: any) {
        return this.http.get(AppService.base_url + AppService.env_consumption + '?filters[environment][business_unit][division_uuid]=' + division + '&filters[environment][status]=Approved&populate=consumptions&pagination[limit]=-1&sort[0]=id:desc')
    }

    public update_consumption(datas: any) {
        return this.http.put(AppService.base_url + AppService.env_consumption + '/' + datas.setId, {
            data: {
                consumption_category: datas.consumption_category,
                category: datas.category,
                source: datas.source,
                unit: datas.unit,
                quantity: datas.quantity,
                amount: datas.amount,
                scope: datas.scope,
                meter_reading: datas?.meter_reading,
                quantity_source: datas?.quantity_source,
                description: datas.description,
                treatment: datas.treatment,
                collected_from: datas.collected_from,
                collected_to: datas.collected_to,
                disposal_method: datas.disposal_method,
                disposal_date: datas.disposal_date,
                consignment_number: datas.consignment_number,
                disposer: datas.disposer,
                carrier: datas.carrier,
                water_type: datas.water_type,
                disposal_place: datas.disposal_place,
                pollutants_emitted: datas.pollutants_emitted,
                concentration: datas.concentration,
                determined_by: datas.determined_by,
                emission_factor: datas.emission_factor,
                ghg_value: datas.ghg_value,
                conversion_factor: datas.conversion_factor,
                conversion_value: datas.conversion_value,
                quantity_kwh: datas.quantity_kwh,
                emission_value: datas.emission_value,
                renewable_energy_source: datas.renewable_energy_source,
                refrigerant_type: datas.refrigerant_type,
                treatment_outcome: datas.treatment_outcome,
                reused_recycled_quantity: datas.reused_recycled_quantity,
                treatment_outcome_recycled: datas.treatment_outcome_recycled,
                treatment_outcome_reused: datas.treatment_outcome_reused,
                applicability: datas.applicability,
                usage_type: datas.usage_type,
                source_capacity: datas.source_capacity,
                legal_emission_limit: datas.legal_emission_limit,
                control_device: datas.control_device,
                latest_test: datas.latest_test,
                monitoring_frequency: datas.monitoring_frequency,
                rec_status: datas.rec_status,
                rec_type: datas.rec_type,
                i_rec_quantity: datas.i_rec_quantity,
                scope_1_cateogry: datas.scope_1_cateogry,
                source_type: datas.source_type,
                volumetric_flow_rate: datas.volumetric_flow_rate,
                operation_time: datas.operation_time,
                testing_organization: datas.testing_organization,
                compliance_status: datas.compliance_status,
                add_meter: datas.add_meter,
                opening_balance: datas.opening_balance,
                purchased_quantity: datas.purchased_quantity,
                purchase_date: datas.purchase_date,
                usage: datas.usage,
                supplier_name: datas.supplier_name,
                stock_balance: datas.stock_balance,
                add_issue: datas.add_issue,

            }

        })
    }

    //print environment consumption
    public env_con_report(id: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_env_consumption_report.pdf?envID=' + id + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public get_consumption_dropdown_values(module: any) {
        return this.http.get(AppService.base_url + AppService.consumption_dropdown_values + '?filters[Module]=' + module + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    public create_testing_organization(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.testing_organization, {
            data: {
                name: data.name,
                created_user: user,
            }
        })
    }
    public update_testing_organizaton(data: any, user: any) {
        return this.http.put(AppService.base_url + AppService.testing_organization + '/' + data.id, {
            data: {
                name: data.name,
                created_user: user,
            }
        })
    }
    public get_testing_organization_details(id: any) {
        return this.http.get(AppService.base_url + AppService.testing_organization + "/" + id)
    }
    public delete_testing_organization(id: any) {
        return this.http.delete(AppService.base_url + AppService.testing_organization + '/' + id)
    }
    public create_pollutant(module: any, category: any, pollutant: any, unit: any) {
        return this.http.post(AppService.base_url + AppService.consumption_dropdown_values, {
            data: {
                Module: module,
                Category: category,
                Value: pollutant,
                unit: unit
            }
        })
    }
    public create_source(module: any, category: any, source: any, filter: any, unit: any, wastefilter:any) {
        return this.http.post(AppService.base_url + AppService.consumption_dropdown_values, {
            data: {
                Module: module,
                Category: category,
                Value: source,
                filter: filter,
                unit: unit,
                waste_filter: wastefilter
            }
        })
    }
    public get_testing_organizations() {
        return this.http.get(AppService.base_url + AppService.testing_organization + '?pagination[limit]=-1&sort[0]=id:desc')
    }


    //#region Create Equipment
    public create_equipment(data: any) {
        return this.http.post(AppService.base_url + AppService.env_equipment, {
            data: {
                identification_code: data.identification_code,
                equipment_name: data.equipment_name,
                equipment_type: data.equipment_type,
                manufacturer: data.manufacturer,
                brand: data.brand,
                model: data.model,
                capacity: data.capacity,
                installation_date: data.installation_date,
                installation_location: data.installation_location
            }
        })
    }

    public update_equipment(data: any) {
        return this.http.put(AppService.base_url + AppService.env_equipment + '/' + data.id, {
            data: {
                identification_code: data.identification_code,
                equipment_name: data.equipment_name,
                equipment_type: data.equipment_type,
                manufacturer: data.manufacturer,
                brand: data.brand,
                model: data.model,
                capacity: data.capacity,
                installation_date: data.installation_date,
                installation_location: data.installation_location
            }
        })
    }

    public get_equipment() {
        return this.http.get(AppService.base_url + AppService.env_equipment + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_equipment_by_id(id: any) {
        return this.http.get(AppService.base_url + AppService.env_equipment + "/" + id)
    }

    public delete_equipment(id: any) {
        return this.http.put(AppService.base_url + AppService.env_equipment + '/' + id, {
            data: {
                publishedAt: null
            }
        })
    }

    public create_equipment_type(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.equipment_type, {
            data: {
                name: data.name,
                created_user: user
            }
        })
    }
    public create_manufacturer(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.manufacturer, {
            data: {
                name: data.name,
                created_user: user
            }
        })
    }
    public create_supplier(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.env_supplier, {
            data: {
                name: data.name,
                email: data.email,
                created_user: user
            }
        })
    }

    public create_issuedUser(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.issued_user, {
            data: {
                name: data.name,
                created_user: user
            }
        })
    }

    public update_issuedUser(data: any, user: any) {
        return this.http.put(AppService.base_url + AppService.issued_user + '/' + data.id, {
            data: {
                name: data.name,
                created_user: user
            }
        })
    }

    public delete_issuedUser(id: any) {
        return this.http.delete(AppService.base_url + AppService.issued_user + '/' + id)
    }

    public get_equipment_type() {
        return this.http.get(AppService.base_url + AppService.equipment_type + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_manufacturer() {
        return this.http.get(AppService.base_url + AppService.manufacturer + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_supplier() {
        return this.http.get(AppService.base_url + AppService.env_supplier + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_issuedUser() {
        return this.http.get(AppService.base_url + AppService.issued_user + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    //#endregion

    //#region Refrigent

    public create_refrigerant(data: any, conId: any) {
        return this.http.post(AppService.base_url + AppService.env_refrigerant, {
            data: {
                equipment: data.equipment,
                quantity: data.quantity,
                unit: data.unit,
                refill_date: data.refill_date,
                environment_consumption: conId
            }
        })
    }

    public create_envIssues(data: any, conId: any) {
        return this.http.post(AppService.base_url + AppService.env_issues, {
            data: {
                issued_date: data.issued_date,
                issued_quantity: data.issued_quantity,
                unit: data.unit,
                issued_to: data.issued_to,
                environment_consumption: conId
            }
        })
    }

    public update_envIssues(data: any) {
        return this.http.put(AppService.base_url + AppService.env_issues + '/' + data.id, {
            data: {
                issued_date: data.issued_date,
                issued_quantity: data.issued_quantity,
                unit: data.unit,
                issued_to: data.issued_to,
                // environment_consumption: conId
            }
        })
    }

    public update_refrigerant(data: any) {
        return this.http.put(AppService.base_url + AppService.env_refrigerant + '/' + data.id, {
            data: {
                equipment: data.equipment,
                quantity: data.quantity,
                unit: data.unit,
                refill_date: data.refill_date
            }
        })
    }

    public get_environment_refrigerant(id: any) {
        return this.http.get(AppService.base_url + AppService.env_refrigerant + '?filters[environment_consumption]=' + id + '&populate=equipment')
    }

    public get_envIssues(id: any) {
        return this.http.get(AppService.base_url + AppService.env_issues + '?filters[environment_consumption]=' + id)
    }

    public delete_refrigerant(id: any) {
        return this.http.delete(AppService.base_url + AppService.env_refrigerant + '/' + id)
    }

    public delete_envIssues(id: any) {
        return this.http.delete(AppService.base_url + AppService.env_issues + '/' + id)
    }

    public get_envIssues_by_id(id: any) {
        return this.http.get(AppService.base_url + AppService.env_issues + '/' + id)
    }


    //#endregion

    public get_env_submeter(data: string) {
        return this.http.get(AppService.base_url + AppService.environment_sub_meter + `?${data}`)
    }
    public create_env_submeter(data: any) {

        return this.http.post(AppService.base_url + AppService.environment_sub_meter, {
            data: {
                meter_quantity_unit: data.meter_quantity_unit,
                location: data.location,
                meter_name: data.meter_name,

                business_unit: data.
                    business_unit,
                category: data.category
            }

        })
    }
    public create_env_submeter_details(data: any, envId: any, year: any, month: any, division: any) {




        return this.http.post(AppService.base_url + AppService.environment_sub_meter_details, {
            data: {
                meter_quantity_unit: data.meter_quantity_unit,
                location: data.location,
                meter_name: data.meter_name,
                quantity: data.quantity,
                initial_meter_reading: data.initial_meter_reading,
                final_meter_reading: data.final_meter_reading,
                environment_consumption: envId,
                month: month,
                year: year,
                division: division
            }

        })
    }
    public update_env_submeter_details(data: any, id: any, division: any) {




        return this.http.put(AppService.base_url + AppService.environment_sub_meter_details + '/' + id, {
            data: {
                meter_quantity_unit: data.meter_quantity_unit,
                location: data.location,
                meter_name: data.meter_name,
                quantity: data.quantity,
                initial_meter_reading: data.initial_meter_reading,
                final_meter_reading: data.final_meter_reading,
                division

            }

        })
    }
    public delete_env_submeter_details(id: any) {
        return this.http.delete(
            AppService.base_url + AppService.environment_sub_meter_details + '/' + id,
            {}
        );
    }


    public selectedYear: number | null = null;
    public selectedMonth: number | null = null;
    public selectedDivision: string | null = null;

    public get_env_submeter_details_by_month_year_division(year: any, month: any, division: any, meter_name: string, location: string) {
        const params = new HttpParams()
            .set('filters[year][$eq]', year)
            .set('filters[month][$eq]', month)
            .set('filters[division][$eq]', division)
            .set('filters[meter_name][$eq]', meter_name)
            .set('filters[location][$eq]', location);

        return this.http.get(AppService.base_url + AppService.environment_sub_meter_details, { params });
    }








}