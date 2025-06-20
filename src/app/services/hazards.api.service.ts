import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { map, Observable } from 'rxjs';
import { AppsModule } from '../apps/apps.module';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HazardService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }

    //get hazards
    public get_hazards(orgID: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[org_id][$eq]=' + orgID + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_hazard_approvers(orgID: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][ehs_action][$eq]=true&filters[$and][1][user][blocked][$eq]=false&populate=divisions&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_unit_specific_hazard_approvers(orgID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][ehs_action][$eq]=true&populate=divisions&' + division + '&filters[$and][1][user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }

    //creat ehs evidence
    public create_ehs_evidence(data: any) {
        return this.http.post(AppService.base_url + AppService.ehs_evidence, {
            data: {
                evidence_name: data.evidence_name,
                format: data.format,
                image_id: data.id,
                ehss: data.hazard,

            }
        })
    }

    //create ehs
    public create_ehs(data: any) {
        return this.http.post(AppService.base_url + AppService.ehs, {
            data: {
                reported_date: new Date(),
                reference_number: data.reference_number,
                category: data.category,
                sub_category: data.sub_category,
                level: data.level,
                unsafe: data.unsafe,
                observation: data.observation,
                division: data.division,
                location_department: data.location_department,
                sub_location: data.sub_location,
                due_date: data.due_date,
                description: data.description,
                org_id: data.org_id,
                status: data.status,
                business_unit: data.business_unit,
                resolution: data.resolution,
                reporter: data.reporter,
                assignee: data.assignee,
                responsible: data.assignee,
                created: data.reporter,
                evidence_before: data.evidence_name,
                responsible_person: data.responsible_name,
                reported_person: data.reporterName,
                reporter_employee_id: data.reporter_employee_id,
                reporter_name: data.reporter_name,
                reporter_contact_number: data.reporter_contact_no,
                reporter_email: data.reporter_email,
                assignee_notification: data.assignee_notification
            }
        })
    }
    //create open AI
    public create_open_ai(data: any, completion_tokens: any, prompt_tokens: any, total_tokens: any) {
        return this.http.post(AppService.base_url + AppService.open_ai, {
            data: {
                module: 'Hazard and Risk',
                date_and_time: new Date(),
                reference_number: data.reference_number,
                user: data.user,
                event: 'Generated Action Taken',
                completion_tokens: completion_tokens,
                prompt_tokens: prompt_tokens,
                total_tokens: total_tokens
            }
        })
    }

    //get hazards
    public get_ehs_register(orgID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[org_id][$eq]=' + orgID + '&populate=reporter&populate=responsible' + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_ehs_unit_specific_register(orgID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[org_id][$eq]=' + orgID + '&' + division + '&populate=reporter&populate=responsible' + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    //get ehs details
    public get_ehs_details(orgID: any, reference: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[org_id][$eq]=' + orgID + '&filters[reference_number][$eq]=' + reference + '&populate=*')
    }

    public get_hazard_search(reference: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[reference_number]=' + reference + '&populate=reporter&populate=responsible&sort[0]=id:desc')
    }

    public get_hazard_unit_specific_search(reference: any, division: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[reference_number]=' + reference + '&' + division + '&populate=reporter&populate=responsible&sort[0]=id:desc')
    }
    //update ehs evidence
    public update_ehs_evidence(data: any) {
        return this.http.put(AppService.base_url + AppService.ehs_evidence + '/' + data.evidence_id, {
            data: {
                evidence_before: data.evidence
            }
        })
    }

    //update ehs with evidence
    public update_evidence_ehs(data: any) {
        return this.http.put(AppService.base_url + AppService.ehs + '/' + data.id, {
            data: {
                category: data.category,
                sub_category: data.sub_category,
                level: data.level,
                unsafe: data.unsafe,
                observation: data.observation,
                division: data.division,
                location_department: data.location_department,
                sub_location: data.sub_location,
                due_date: data.due_date,
                description: data.description,
                Status: data.Status,
                Resolution: data.Resolution,
                assignee: data.assignee,
                responsible: data.assignee,
                updated: data.updated,
                assignee_notification: false,
                verify_notification: null,
                verified_notification: null,
                delayed: null,
                deligate_notification: null,
                evidence_before: data.evidence_name,
                responsible_person: data.responsible_name,
                reported_person: data.reporterName,
                evidence_id: data.evidence_id

            }
        })
    }

    //update ehs
    public update_ehs(data: any) {
        return this.http.put(AppService.base_url + AppService.ehs + '/' + data.id, {
            data: {
                category: data.category,
                sub_category: data.sub_category,
                level: data.level,
                unsafe: data.unsafe,
                observation: data.observation,
                division: data.division,
                location_department: data.location_department,
                sub_location: data.sub_location,
                due_date: data.due_date,
                description: data.description,
                status: data.status,
                resolution: data.resolution,
                assignee: data.assignee,
                responsible: data.assignee,
                updated: data.updated,
                business_unit: data.business_unit,
                assignee_notification: data.assignee_notification,
                verify_notification: null,
                verified_notification: null,
                delayed: null,
                deligate_notification: null,
                responsible_person: data.responsible_name,




            }
        })
    }

    //get assigned tasks
    public get_assigned_tasks(orgID: any, userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[org_id][$eq]=' + orgID + '&filters[assignee]=' + userID + '&filters[resolution]=Open' + '&populate=reporter&populate=responsible' + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_unit_specific_assigned_tasks(orgID: any, userID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[org_id][$eq]=' + orgID + '&' + division + '&filters[assignee]=' + userID + '&filters[resolution]=Open' + '&populate=reporter&populate=responsible' + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    //start progress
    public start_progress(general: any, date: any) {
        return this.http.put(AppService.base_url + AppService.ehs + '/' + general.id, {
            data: {
                status: 'In-Progress',
                targeted_date: date,
                updated: general.updator
            }
        })
    }

    //start progress with due date
    public start_progress_due_date(general: any, date: any) {
        return this.http.put(AppService.base_url + AppService.ehs + '/' + general.id, {
            data: {
                status: 'In-Progress',
                targeted_date: new Date(date),
                updated: general.updator
            }
        })
    }

    //update ehs
    public update_ehs_resolution(general: any, data: any, reject: any) {


        return this.http.put(AppService.base_url + AppService.ehs + '/' + general.id, {
            data: {
                control: data.control,
                cost: data.cost,
                action_taken: data.action_taken,
                remarks: data.remarks,
                updated: general.updator,
                completed_date: data.completed_date,
                rework_description: reject.rework_description,

            }
        })



    }

    public update_ehs_evidence_resolution(general: any, data: any) {

        return this.http.put(AppService.base_url + AppService.ehs + '/' + general.id, {
            data: {
                control: data.control,
                cost: data.cost,
                action_taken: data.action_taken,
                remarks: data.remarks,
                updated: general.updator,
                evidence_after: data.evidence_name,
                evidence_after_id: data.evidence_id

            }
        })



    }

    //update ehs evdience after
    public update_ehs_evidence_after(id: any, data: any) {
        return this.http.put(AppService.base_url + AppService.ehs_evidence + '/' + id, {
            data: {
                evidence_after: data
            }
        })
    }

    //add deligate
    public add_deligate(general: any, deligateID: any, deligateName: any) {
        return this.http.put(AppService.base_url + AppService.ehs + '/' + general.id, {
            data: {
                deligate: deligateID,
                updated: general.updator,
                deligate_notification: false,
                deligate_person: deligateName

            }
        })
    }

    //update completion
    public ehs_completion(general: any, resolution: any, reject: any, hseHead: any) {



        return this.http.put(AppService.base_url + AppService.ehs + '/' + general.id, {
            data: {
                control: resolution.control,
                cost: resolution.cost,
                action_taken: resolution.action_taken,
                remarks: resolution.remarks,
                completed_date: resolution.completed_date,
                status: "Verify",
                updated: general.updator,
                assignee: general.reporter ? general.reporter : hseHead,
                hse_head: hseHead,
                verify_notification: false,
                rework_description: reject.rework_description
            }
        })
    }

    //update verified status
    public verified(data: any, id: any, reason: any) {
        return this.http.put(AppService.base_url + AppService.ehs + '/' + id, {
            data: {
                status: data,
                resolution: data !== "Rejected" ? "Completed" : "Open",
                verified_notification: false,
                reject_reason: data !== "Completed" ? reason : ''
            }
        })
    }

    //upload documents
    public upload(formData: any) {
        return this.http.post(AppService.base_url + AppService.upload, formData)
    }

    //delete document
    public destroy(id: any) {
        return this.http.delete(AppService.base_url + AppService.upload + 'files/' + id)
    }

    //get report
    public ehs_report(id: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_ehs_report_v1.pdf?referenceID=' + id + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }


    public getImage(imageUrl: string): Observable<Blob> {
        return this.http.get(imageUrl, { responseType: 'blob' });
    }

    public delete_accident_evidence(id: any) {
        return this.http.delete(AppService.base_url + AppService.ehs_evidence + '/' + id)
    }

    //creat ehs evidence
    public create_ehs_evidence_after(data: any) {
        return this.http.post(AppService.base_url + AppService.ehs_evidence, {
            data: {
                evidence_name: data.evidence_name,
                format: data.format,
                image_id_after: data.image_id,
                ehss: data.ehsId,
                evidence_after: true

            }
        })
    }

    public update_evidence_after(data: any) {
        return this.http.put(AppService.base_url + AppService.ehs_evidence + '/' + data.evidence_id, {
            data: {

                evidence_name_after: data.evidence_name,
                format_after: data.format,
                image_id_after: data.id
            }
        })
    }

    public delete_ehs_evidence(id: any) {
        return this.http.delete(AppService.base_url + AppService.ehs_evidence + '/' + id)
    }
    public delete_ehs(id: any) {
        return this.http.delete(AppService.base_url + AppService.ehs + '/' + id)
    }

    public delete_ehs_evidence_after(id: any) {
        return this.http.put(AppService.base_url + AppService.ehs_evidence + '/' + id, {

            data: {
                evidence_name_after: null,
                format_after: null,
                image_id_after: null

            }

        })
    }

    public create_observation(data: any) {
        return this.http.post(AppService.base_url + AppService.observation, {
            data: {
                observation: data.observation,
                dropdown_value: data.dropdown_value
            }

        })
    }

    public get_observations() {
        return this.http.get(AppService.base_url + AppService.observation + '?populate=dropdown_value&pagination[limit]=-1&sort[0]=id:desc')
    }






    //#####################-> Dashboard Services
    generate_ehs_data(startDate: any, endDate: any, userDivision: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[reported_date][$gte]=' + startDate + '&filters[reported_date][$lte]=' + endDate + '&' + userDivision + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    generate_ehs_data_division(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[reported_date][$gte]=' + startDate + '&filters[reported_date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    generate_ehs_data_category(startDate: any, endDate: any, category: any, userDivision: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[reported_date][$gte]=' + startDate + '&filters[reported_date][$lte]=' + endDate + '&filters[category]=' + category + '&' + userDivision + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    generate_ehs_data_division_category(startDate: any, endDate: any, division: any, category: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[reported_date][$gte]=' + startDate + '&filters[reported_date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&filters[category]=' + category + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    generate_ehs_latest(orgID: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[org_id][$eq]=' + orgID + '&pagination[limit]=10&sort[0]=id:desc')
    }

    public get_latest_hazards(orgID: any, userDivision: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[org_id][$eq]=' + orgID + '&' + userDivision + '&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_latest_division_hazards(orgID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.ehs + '?filters[org_id][$eq]=' + orgID + '&filters[business_unit][division_uuid]=' + division + '&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }

    public create_ehs_multiple_evidence(data: any) {
        return this.http.post(AppService.base_url + AppService.ehs_multiple_evidence, {
            data: {
                evidence_name: data.evidence_name,
                format: data.format,
                image_id: data.id,
                multiple_ehss: data.hazard,

            }
        })
    }

    public delete_ehs_multiple_evidence(id: any) {
        return this.http.delete(AppService.base_url + AppService.ehs_multiple_evidence + '/' + id)
    }

    public create_multiple_evidence_after(data: any) {
        return this.http.post(AppService.base_url + AppService.ehs_multiple_evidence, {
            data: {
                evidence_name: data.evidence_name,
                format: data.format,
                image_id: data.id,
                multiple_ehss_after: data.hazard,

            }
        })
    }



    public delete_evidence_file(id: any) {
        return this.http.delete(AppService.base_url + AppService.upload + 'files/' + id,)
    }


    public ehs_register_report_pdf(data: any) {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/ehs_register_report_pdf.pdf?start_date=' + data.start_date + '&end_date=' + data.end_date + '&division=' + data.division + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&company_name=' + data.company_name + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public ehs_register_report_excel(data: any) {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/ehs_register_report_excel.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date + '&division=' + data.division + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&company_name=' + data.company_name + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })

    }


    public ehs_register_report_pdf_2(data: any) {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/ehs_register_report_pdf.pdf?start_date=' + data.start_date + '&end_date=' + data.end_date + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&company_name=' + data.company_name + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public ehs_register_report_excel_2(data: any) {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/ehs_register_report_excel.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&company_name=' + data.company_name + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })

    }

}