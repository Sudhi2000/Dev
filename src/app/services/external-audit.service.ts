import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';
import { reference } from '@popperjs/core';

@Injectable({
    providedIn: 'root'
})
export class ExternalAuditService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }
    public get_external_audits_reference(id: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[reference_number]=' + id + '&pagination[limit]=-1&sort[0]=id:desc')

    }
    public get_external_audits() {
        return this.http.get(AppService.base_url + AppService.external_audit + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_external_audits_all_entries() {
        return this.http.get(AppService.base_url + AppService.external_audit + '?publicationState=preview&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_ext_corrective_action() {
        return this.http.get(AppService.base_url + AppService.external_action_plan + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_external_audit_resgiter(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?populate[0]=auditee&populate[2]=approver&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')

    }
    public get_external_audit_unit_specific_register(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?populate[0]=auditee' + '&' + division + '&populate[2]=approver&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')

    }
    public get_external_audit_corrective_register_search(reference: any) {
        return this.http.get(AppService.base_url + AppService.external_action_plan + '?filters[reference_number]=' + reference + '&populate=*&sort[0]=id:desc')

    }

    public get_external_audit_resgiter_search(reference: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[reference_number]=' + reference + '&populate[0]=auditee&populate[2]=approver&sort[0]=id:desc')
    }
    public get_external_audit_unit_specific_resgiter_search(reference: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[reference_number]=' + reference + '&' + division + '&populate[0]=auditee&populate[2]=approver&sort[0]=id:desc')
    }

    public get_ratings() {
        return this.http.get(AppService.base_url + AppService.audit_rating + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_ext_aud_approvers(orgID: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][ext_aud_action][$eq]=true&filters[$and][1][user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_unit_specific_ext_aud_approvers(orgID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][ext_aud_action][$eq]=true&populate=divisions&' + division + '&filters[$and][1][user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_corrective_action_register(userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.external_action_plan + '?filters[$or][0][assignee]=' + userID + '&populate=assignee&populate=initial_assignee&populate=external_audit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public schedule_external_audit(data: any) {
        return this.http.post(AppService.base_url + AppService.external_audit, {
            data: {
                reference_number: data.reference_number,
                reported_date: new Date(),
                division: data.division,
                approval_date: data.approval_date,
                auditee: data.auditeeID,
                approver: data.approver,
                created_By: data.created_user,
                audit_status: data.status,
                audit_type: data.audit_type,
                audit_category: data.audit_category,
                audit_standard: data.audit_standard,
                audit_start_date: data.start,
                audit_end_date: data.end,
                customer: data.customer,
                audit_firm: data.audit_firm,
                representative: data.audit_representative,
                audit_fee: data.audit_fee,
                announcement: data.announcement,
                business_unit: data.business_unit,
                barriers_challenges: data.barriers_challenges,
                remarks: data.remarks
            }
        })
    }
    public create_audit_action_plan(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.external_action_plan, {
            data: {
                date: new Date(),
                created_user: id,
                finding: data.finding,
                external_audit: id,
                priority: data.priority,
                due_date: data.due_date,
                target_completion_date: data.target_completion_date,
                reported_date: data.reported_date,
                initial_assignee: data.assignee,
                assignee: data.assignee,
                approver: data.approver,
                reference_number: data.reference_number,
                barriers_challenges: data.barriers_challenges,
                remarks: data.remarks,
                corporateuser_remark: data.corporateuser_remark,
                lessons_learned: data.lessons_learned,
                implented_actions: data.implemented_actions
            }
        })
    }

    public create_external_audit_report(data: any) {
        return this.http.post(AppService.base_url + AppService.external_audit_report, {
            data: {
                document_name: data.document_name,
                format: data.format,
                external_audit: data.external_audit,
                document_id: data.id
            }
        })
    }
    public create_rating(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.audit_rating, {
            data: {
                rating: name,
                created_user: user

            }
        })
    }
    public update_external_audit(data: any) {
        return this.http.put(AppService.base_url + AppService.external_audit + '/' + data.id, {
            data: {
                reference_number: data.reference_number,
                reported_date: new Date(),
                division: data.division,
                approval_date: data.approval_date,
                auditee: data.auditeeID,
                approver: data.approver,
                audit_status: data.status,
                audit_type: data.audit_type,
                audit_category: data.audit_category,
                audit_standard: data.audit_standard,
                audit_start_date: data.start,
                audit_end_date: data.end,
                customer: data.customer,
                audit_firm: data.audit_firm,
                representative: data.audit_representative,
                audit_fee: data.audit_fee,
                audit_grade: data.audit_grade,
                announcement: data.announcement,
                updated_By: data.updatedBy,
                auditor_name: data.auditor_name,
                business_unit: data.business_unit,
                barriers_challenges: data.barriers_challenges,
                remarks: data.remarks
            }
        })
    }
    public update_audit_details(data: any) {
        return this.http.put(AppService.base_url + AppService.external_audit + '/' + data.id, {
            data: {
                status: data.status,
                audit_rating: data.audit_rating,
                grace_period: data.grace_period,
                non_compliance: data.non_compliance,
                assessment_date: data.assessment_date,
                audit_expiry_date: data.audit_expiry_date,
                //ProcessDate:data.ProcessDate,
                audit_fee: data.audit_fee,
                audit_grade: data.audit_grade,
                expiry_warning_date: data.expiry_warning_date,
                auditor_name: data.auditor_name,
                approver_remarks: data.remarks
            }
        })
    }
    public complete_external_audit(data: any) {
        return this.http.put(AppService.base_url + AppService.external_audit + '/' + data.id, {
            data: {
                status: data.status,
                audit_rating: data.audit_rating,
                grace_period: data.grace_period,
                non_compliance: data.non_compliance,
                assessment_date: data.assessment_date,
                audit_expiry_date: data.audit_expiry_date,
                audit_status: 'Completed',
                audit_fee: data.audit_fee,
                auditor_name: data.auditor_name,
                audit_grade: data.audit_grade,
                expiry_warning_date: data.expiry_warning_date,
                completed_date: data.completed_date,
                approver_remarks: data.remarks,
                barriers_challenges: data.barriers_challenges,
                remarks: data.remarks,
                lasped_days: data.lasped_days,
                lapse_status: data.lapse_status,
                lapse_color_code: data.lapse_color_code


            }
        })
    }
    public audit_action_plan(id: any) {
        return this.http.get(AppService.base_url + AppService.external_action_plan + '/' + id + '?populate=evidences&populate=assignee&populate=approver&populate=external_multiple_before&populate=external_multiple_after&populate=initial_assignee&populate=evidence_after')
    }

    public update_audit_action_plan(data: any) {
        return this.http.put(AppService.base_url + AppService.external_action_plan + '/' + data.id, {
            data: {
                due_date: data.due_date,
                actual_completion_date: data.complete_date,
                target_completion_date: data.target_completion_date,
                finding: data.finding,
                action_plan: data.action_plan,
                root_cause: data.root_cause,
                status: data.status,
                priority: data.priority,
                heirarchy_control: data.heirarchy_control,
                sustainable_solution: data.sustainable_solution,
                barriers_challenges: data.barriers_challenges,
                remarks: data.remarks,
                assignee: data.assignee,
                corporateuser_remark: data.corporateuser_remark,
                lessons_learned: data.lessons_learned,
                implemented_actions: data.implemented_actions
            }
        })
    }
    public audit_action_plan_rejected(data: any) {
        return this.http.put(AppService.base_url + AppService.external_action_plan + '/' + data.id, {
            data: {
                status: data.status,
                corporateuser_remark: data.corporateuser_remark,
            }
        })
    }
    //Hierarchy of control
    //dropdown
    get_dropdown(module: any) {
        return this.http.get(AppService.base_url + AppService.dropdown_values + '?filters[module]=' + module + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    //get external audit details
    public get_audit_details(reference: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[reference_number]=' + reference + '&populate=auditee&populate=created_By&populate=approver&populate=representative&populate=action_plans&populate=external_audit_reports&populate=business_unit')
    }
    public get_audit_reports(reference: any) {
        return this.http.get(AppService.base_url + AppService.external_audit)
    }

    //get audit tasks
    public get_audit_tasks(userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[approver]=' + userID + '&filters[audit_status]=Scheduled&populate=auditee&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_audit_unit_specific_tasks(userID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[approver]=' + userID + '&' + division + '&filters[audit_status]=Scheduled&populate=auditee&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_external_audit_search(reference: any, userID: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[reference_number]=' + reference + '&filters[approver]=' + userID + '&filters[audit_status]=Scheduled&populate=auditee&sort[0]=id:desc')
    }
    public get_external_audit_unit_specific_search(reference: any, userID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[reference_number]=' + reference + '&' + division + '&filters[approver]=' + userID + '&filters[audit_status]=Scheduled&populate=auditee&sort[0]=id:desc')
    }

    //get audit tasks
    public get_audit_queue(userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[$or][0][audit_status]=Approved&filters[$or][0][audit_status]=In Progress&populate=auditee&populate[0]=approver&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_audit_unit_specific_queue(userID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[$or][0][audit_status]=Approved&filters[$or][0][audit_status]=In Progress' + '&' + division + '&populate=auditee&populate[0]=approver&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_external_audit_queue_search(reference: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[reference_number]=' + reference + '&filters[$or][0][audit_status]=Approved&filters[$or][0][audit_status]=In Progress&populate=auditee&populate[0]=approver&sort[0]=id:desc')
    }
    public get_external_audit_unit_specific_queue_search(reference: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[reference_number]=' + reference + '&filters[$or][0][audit_status]=Approved' + '&' + division + '&filters[$or][0][audit_status]=In Progress&populate=auditee&populate[0]=approver&sort[0]=id:desc')
    }

    public get_action_plan(audID: any) {
        return this.http.get(AppService.base_url + AppService.external_action_plan + '?filters[external_audit]=' + audID + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    //update action
    public update_status(data: any) {
        return this.http.put(AppService.base_url + AppService.external_audit + '/' + data.id, {
            data: {
                audit_status: data.status,
                updated_By: data.updatedBy,
                announcement: data.announcement,
                approver_remarks: data.remarks,
                action_notification: false,
                user_notification: data.user_notification,
                approved_date: data.approved_date,
                inprogress_date: data.inprogress_date,
                completed_date: data.completed_date,
                inprogress_notification:data.inprogress_notification
            }
        })
    }



    public audit_complete(id: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                status: "Completed",
                labor_audit_status: "Completed",
                health_audit_status: "Completed",
                environment_audit_status: "Completed",
                security_audit_status: "Completed",

            }
        })
    }

    //get external audit standards
    public audit_standards() {
        return this.http.get(AppService.base_url + AppService.audit_standards + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public audit_firm() {
        return this.http.get(AppService.base_url + AppService.audit_firm + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    //create external audit standards
    public create_audit_standards(data: any) {
        return this.http.post(AppService.base_url + AppService.audit_standards, {
            data: {
                standard_name: data.standard
            }
        })
    }
    //create external audit standards
    public create_audit_firm(data: any) {
        return this.http.post(AppService.base_url + AppService.audit_firm, {
            data: {
                firm_name: data.firm_name
            }
        })
    }
    public attach_action_plan_document(data: any) {
        return this.http.post(AppService.base_url + AppService.external_audit_evidence, {
            data: {
                evidence_name: data.document_name,
                format: data.document_format,
                evidence_id: data.document_id,
                external_audit_action_plan: data.external_audit_action_plan,
                external_audit: data.external_audit,
            }
        })
    }
    public create_external_audit_multiple_evidence_before(data: any) {
        return this.http.post(AppService.base_url + AppService.external_multiple_evidence, {
            data: {
                evidence_name: data.document_name,
                format: data.document_format,
                image_id: data.document_id,
                multiple_before: data.action_plan_id,

            }
        })
    }

    public create_external_audit_multiple_evidence_after(data: any) {
        return this.http.post(AppService.base_url + AppService.external_multiple_evidence, {
            data: {
                evidence_name: data.document_name,
                format: data.document_format,
                image_id: data.document_id,
                multiple_after: data.action_plan_id,

            }
        })
    }


    public attach_action_plan_document_after(data: any, id: any) {
        return this.http.put(AppService.base_url + AppService.external_audit_evidence + '/' + id, {
            data: {
                evidence_after_name: data.document_name_after,
                format_after: data.document_format_after,
                evidence_id_after: data.document_id_after,
                evidence_after: true
            }
        })
    }
    public create_evidence_after(data: any) {
        return this.http.post(AppService.base_url + AppService.external_audit_evidence, {
            data: {
                evidence_after_name: data.evidence_after_name,
                format_after: data.format_after,
                evidence_id_after: data.evidence_id_after,
                action_plan_evidence_after: data.external_audit_action_plan,
                external_audit_action_plan: data.external_audit_action_plan,
                external_audit: data.external_audit
            }
        })
    }
    public delete_document(id: any) {
        return this.http.delete(AppService.base_url + AppService.external_audit_evidence + '/' + id,)
    }
    public delete_multiple_document(id: any) {
        return this.http.delete(AppService.base_url + AppService.external_multiple_evidence + '/' + id,)
    }


    //update audit report details
    public update_audit_report(name: any, format: any, id: any) {
        return this.http.put(AppService.base_url + AppService.external_audit + '/' + id, {
            data: {
                report_name: name,
                report_format: format,
                report_id: id

            }
        })
    }
    //update audit report details
    public delete_audit_report(id: any) {
        return this.http.delete(AppService.base_url + AppService.external_audit_report + '/' + id,)
    }
    public upload_audit_report(data: any) {
        return this.http.post(AppService.base_url + AppService.external_audit_report, {
            data: {
                document_name: data.document_name,
                format: data.format,
                document_id: data.document_id,
                external_audit: data.external_audit,
            },

        });

    }
    //create open AI
    public create_open_ai(data: any, completion_tokens: any, prompt_tokens: any, total_tokens: any) {
        return this.http.post(AppService.base_url + AppService.open_ai, {
            data: {
                module: 'External Audit',
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

    //Dashboard
    generate_external_audit_data(startDate: any, endDate: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[reported_date][$gte]=' + startDate + '&filters[reported_date][$lte]=' + endDate + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    generate_external_audit_data_division(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[reported_date][$gte]=' + startDate + '&filters[reported_date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&filters[audit_status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }

    


    //register report
    public external_audit_register(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report.pdf?start_date=' + data.start_date + '&end_date=' + data.end_date+'&default_date='+data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report_excel.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date +'&default_date='+data.defualt_date+ '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_2(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report.pdf?start_date=' + data.start_date + '&end_date=' + data.end_date+'&division='+data.division +'&default_date='+data.defualt_date+ '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_excel_2(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report_excel.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date+'&division='+data.division +'&default_date='+data.defualt_date+ '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_3(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report.pdf?start_date=' + data.start_date + '&end_date=' + data.end_date+'&audit_category='+data.audit_category +'&default_date='+data.defualt_date+'&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_excel_3(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report_excel.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date+'&audit_category='+data.audit_category +'&default_date='+data.defualt_date+ '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_4(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report.pdf?start_date=' + data.start_date + '&end_date=' + data.end_date+'&audit_category='+data.audit_category+'&division='+data.division +'&default_date='+data.defualt_date+ '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_excel_4(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report_excel.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date+'&audit_category='+data.audit_category+'&division='+data.division +'&default_date='+data.defualt_date+ '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_5(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report.pdf?year=' + data.year + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_excel_5(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report_excel.xlsx?year=' + data.year + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_6(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report.pdf?year=' + data.year+'&division='+data.division + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_excel_6(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report_excel.xlsx?year=' + data.year+'&division='+data.division + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_7(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report.pdf?year=' + data.year+'&audit_category='+data.audit_category + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_excel_7(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report_excel.xlsx?year=' + data.year+'&audit_category='+data.audit_category + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_8(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report.pdf?year=' + data.year+'&audit_category='+data.audit_category+'&division='+data.division + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public external_audit_register_excel_8(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_register_report_excel.xlsx?year=' + data.year+'&audit_category='+data.audit_category+'&division='+data.division + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }











   

    public generate_external_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[reported_date][$gte]=' + startDate + '&filters[reported_date][$lte]=' + endDate + '&' + division + '&filters[audit_status][$ne]=Draft&populate=approver&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }

    public generate_external_data_division(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[reported_date][$gte]=' + startDate + '&filters[reported_date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&filters[audit_status][$ne]=Draft&populate=approver&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }

    public generate_external_division(division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[business_unit][division_uuid]=' + division + '&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }
    public generate_external_audit_approved_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[approved_date][$gte]=' + startDate + '&filters[approved_date][$lte]=' + endDate + '&' + division + '&filters[audit_status][$ne]=Draft&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }
    public generate_external_audit_inprogress_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[inprogress_date][$gte]=' + startDate + '&filters[inprogress_date][$lte]=' + endDate + '&' + division + '&filters[audit_status][$ne]=Draft&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }
    public generate_external_audit_completed_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[completed_date][$gte]=' + startDate + '&filters[completed_date][$lte]=' + endDate + '&' + division + '&filters[audit_status][$ne]=Draft&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }
    public generate_external_audit_approved_division_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[approved_date][$gte]=' + startDate + '&filters[approved_date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }
    public generate_external_audit_inprogress_division_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[inprogress_date][$gte]=' + startDate + '&filters[inprogress_date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }
    public generate_external_audit_completed_division_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[completed_date][$gte]=' + startDate + '&filters[completed_date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }
    public external_audit_expiry(expiryDate: any, currentDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[audit_expiry_date][$gte]=' + currentDate + '&filters[audit_expiry_date][$lte]=' + expiryDate + '&' + division + '&populate=business_unit')
    }
    public external_audit_action_expiry(expiryDate: any, currentDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_action_plan + '?filters[due_date][$gte]=' + currentDate + '&filters[due_date][$lte]=' + expiryDate + '&' + division + '&populate[0]=external_audit')
    }

    public generate_external_year_data() {
        return this.http.get(AppService.base_url + AppService.external_audit + '?populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }

    public generate_external_year_division_data(division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[business_unit][division_uuid]=' + division + '&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }

    //get report
    public external_audit_action_plan(audit: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_action_plan_report.xls?external_audit=' + audit + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    // get audit grade
    public get_audit_grades() {
        return this.http.get(AppService.base_url + AppService.audit_grade + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public create_audit_grade(name: any, id: any) {
        return this.http.post(AppService.base_url + AppService.audit_grade, {
            data: {
                grade_name: name,
                created_user: id
            }
        })
    }
    public generate_external_audit_action(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.external_action_plan + '?filters[date][$gte]=' + startDate + '&filters[date][$lte]=' + endDate + '&' + division + '&filters[status][$ne]=Draft&populate[external_audit][populate]=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }


    //external audit register report
    public external_audit_register_division(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_external_audit_tracker_division.xlsx?reported_date=' + data.start + '&audit_end_date=' + data.end + '&division=' + data.division + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }
}