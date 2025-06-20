import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InternalAuditService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }

    public get_internal_audits() {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?publicationState=preview&pagination[limit]=-1&sort[0]=id:desc')

    }
    public get_factories() {
        return this.http.get(AppService.base_url + AppService.factories + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_factories_by_id(id: any) {
        return this.http.get(AppService.base_url + AppService.factories + "/" + id)
    }
    public get_process_types() {
        return this.http.get(AppService.base_url + AppService.process_type + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_contact_persons() {
        return this.http.get(AppService.base_url + AppService.factory_contact_persons + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public create_factory(data: any, id: any) {

        return this.http.post(AppService.base_url + AppService.factories, {
            data: {

                factory_name: data.factory_name,
                factory_contact_person: data.contact_person,
                designation: data.designation,
                email: data.contact_email,
                contact_number: data.contact_number,
                factory_address: data.factory_address,
                created_user: id
            }
        })
    }
    public create_process_type(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.process_type, {
            data: {

                name: data.process_type,
                created_user: id
            }
        })
    }
    public update_factory_name(data: any) {

        return this.http.put(AppService.base_url + AppService.factories + '/' + data.id, {
            data: {
                factory_name: data.factory_name,
                factory_contact_person: data.contact_person,
                designation: data.designation,
                email: data.contact_email,
                contact_number: data.contact_number,
                factory_address: data.factory_address,

            }
        })
    }
    public delete_factory_name(id: any) {
        return this.http.delete(AppService.base_url + AppService.factories + '/' + id)
    }
    public delete_process_type(id: any) {
        return this.http.delete(AppService.base_url + AppService.process_type + '/' + id)
    }
    public create_factory_contact_person(name: any, id: any) {
        return this.http.post(AppService.base_url + AppService.factory_contact_persons, {
            data: {
                person_name: name,
                created_user: id
            }
        })
    }
    public get_internal_audit_resgiter(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?populate=auditees&populate=approver&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')

    }
    public get_external_audits_reference(id: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[reference_number]=' + id + '&pagination[limit]=-1&sort[0]=id:desc')

    }
    // public get_internal_audit_resgiter_search(reference: any) {
    //     const lowerFilterValue = reference.toLowerCase();
    //     return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[$or][0][type][$eqi]=' + lowerFilterValue + '&filters[$or][1][reference_number][$eqi]=' + lowerFilterValue + ' &populate=auditees&populate=approver&sort[0]=id:desc')
    // }
    public get_internal_audit_resgiter_search(reference: any) {
        const lowerFilterValue = reference.toLowerCase();
        return this.http.get(
            AppService.base_url + AppService.internal_audit + '?filters[$or][0][type][$eqi]=' + encodeURIComponent(lowerFilterValue) + '&filters[$or][1][reference_number][$eqi]=' + encodeURIComponent(lowerFilterValue) + '&populate=auditees&populate=approver&sort[0]=id:desc'
        );
    }

    public get_int_aud_approvers(orgID: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][int_aud_action][$eq]=true&filters[$and][1][user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_unit_specific_int_aud_approvers(orgID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][int_aud_action][$eq]=true&populate=divisions&' + division + '&filters[$and][1][user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_internal_audit_unit_specific_register(userID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[$or][0][approver]=' + userID + '&filters[$or][1][audit_team_members][user_id]=' + userID + '&populate=auditees' + '&' + division + '&populate=approver&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')

    }

    public get_internal_audit_unit_specific_register_search(reference: any, division: any) {
        //  return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[reference_number]=' + reference + '&' + division + '&populate=auditees&populate=approver&sort[0]=id:desc')
        const lowerFilterValue = reference.toLowerCase();
        return this.http.get(
            AppService.base_url + AppService.internal_audit + '?filters[$or][0][type][$eqi]=' + encodeURIComponent(lowerFilterValue) + '&filters[$or][1][reference_number][$eqi]=' + encodeURIComponent(lowerFilterValue) + '&' + division + '&populate=auditees&populate=approver&sort[0]=id:desc'
        );
    }


    public schedule_internal_audit(data: any) {


        return this.http.post(AppService.base_url + AppService.internal_audit, {
            data: {
                reference_number: data.reference_number,
                date: new Date(),
                division: data.division,
                department: data.department,
                title: data.title,
                type: data.type,
                description: data.description,
                start_date: data.start,
                end_date: data.end,
                approval_date: data.approval_date,
                auditees: data.auditeeID,
                approver: data.approver,
                created_By: data.created_user,
                status: data.status,
                factory_name: data.factory_name,
                factory_address: data.factory_address,
                factory_contact_person: data.factory_contact_person,
                designation: data.designation,
                contact_email: data.contact_email,
                contact_number: data.contact_number,
                business_unit: data.business_unit,
                audit_scheduled_for_supplier: data.audit_scheduled_for_supplier,
                supplier_type: data.supplier_type,
                factory_license_no: data.factory_license_no,
                higg_id: data.higg_id,
                zdhc_id: data.zdhc_id,
                process_type: data.process_type

            }
        })
    }

    public update_internal_audit(data: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + data.id, {
            data: {
                date: new Date(),
                division: data.division,
                department: data.department,
                title: data.title,
                type: data.type,
                description: data.description,
                start_date: data.start,
                end_date: data.end,
                approval_date: data.approval_date,
                auditees: data.auditeeID,
                approver: data.approver,
                status: data.status,
                updated_By: data.updatedBy,
                factory_name: data.factory_name,
                factory_address: data.factory_address,
                factory_contact_person: data.contact_person,
                designation: data.designation,
                contact_email: data.contact_email,
                contact_number: data.contact_number,
                business_unit: data.business_unit,
                audit_scheduled_for_supplier: data.audit_scheduled_for_supplier,
                supplier_type: data.supplier_type,
                factory_license_no: data.factory_license_no,
                higg_id: data.higg_id,
                zdhc_id: data.zdhc_id,
                process_type: data.process_type



            }
        })
    }

    public update_actual_start_date(data: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + data.id, {
            data: {
                actual_start_date: data.actual_start_date,
                inprogress_date: data.inprogress_date
            }
        })
    }
    public create_internal_audit_multiple_evidence_before(data: any, audit_action_id: any) {
        return this.http.post(AppService.base_url + AppService.internal_audit_multiple_evidence, {
            data: {
                evidence_name: data.document_name,
                format: data.document_format,
                image_id: data.document_id,
                audit_mark: data.audit_mark,
                multiple_before: audit_action_id,
                // title: data.title
            }
        })
    }

    public create_internal_audit_multiple_evidence_after(data: any, audit_action_id: any) {
        return this.http.post(AppService.base_url + AppService.internal_audit_multiple_evidence, {
            data: {
                evidence_name: data.document_name,
                format: data.document_format,
                image_id: data.document_id,
                multiple_after: audit_action_id,

            }
        })
    }
    public create_action_plan_evidence(data: any, audit_action_id: any) {
        return this.http.post(AppService.base_url + AppService.internal_audit_evidence, {
            data: {
                evidence_name: data.document_name,
                format: data.document_format,
                evidence_id: data.document_id,
                audit_action_plan: audit_action_id,
                internal_audit: data.internal_audit,
                audit_mark: data.audit_mark
            }
        })
    }
    public create_action_plan_evidence_after(data: any) {

        return this.http.post(AppService.base_url + AppService.internal_audit_evidence, {
            data: {
                evidence_after_name: data.evidence_after_name,
                format_after: data.format_after,
                evidence_id_after: data.evidence_id_after,
                evidence_after: true,
                audit_action_plan: data.internal_audit_action_plan,
                internal_audit: data.internal_audit,
            }
        })
    }
    public update_action_plan_evidence_after(data: any, id: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit_evidence + '/' + id, {
            data: {
                evidence_after_name: data.evidence_after_name,
                format_after: data.format_after,
                evidence_id_after: data.evidence_id_after,
                evidence_after: true,
            }
        })
    }
    public update_action_plan_evidence_after_remove(id: any) {

        return this.http.put(AppService.base_url + AppService.internal_audit_evidence + '/' + id, {
            data: {
                evidence_after_name: null,
                format_after: null,
                evidence_id_after: null,
                evidence_after: false,
            }
        })
    }

    public delete_multiple_document(id: any) {
        return this.http.delete(AppService.base_url + AppService.internal_audit_multiple_evidence + '/' + id,)
    }

    public remove_action_plan_evidence(id: any) {
        return this.http.delete(AppService.base_url + AppService.internal_audit_evidence + '/' + id)
    }

    public create_completed_action_plan_evidence(data: any) {
        return this.http.post(AppService.base_url + AppService.internal_audit_evidence, {
            data: {
                evidence_name: data.document_name,
                format: data.document_format,
                audit_action_plan: data.internal_audit_action_plan,
                internal_audit: data.internal_audit,
                evidence_id: data.document_id,


            }
        })
    }
    public attach_action_plan_document_after(data: any, id: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit_evidence + '/' + id, {
            data: {
                evidence_after_name: data.document_name_after,
                format_after: data.document_format_after,
                evidence_id_after: data.document_id_after,
                evidence_after: true
            }
        })
    }
    public create_action_plan_document_after(data: any) {
        return this.http.post(AppService.base_url + AppService.internal_audit_evidence, {
            data: {
                evidence_after_name: data.evidence_after_name,
                format_after: data.format_after,
                evidence_id_after: data.evidence_id_after,
                evidence_after: true,
                audit_action_plan: data.internal_audit_action_plan,
                internal_audit: data.internal_audit,
            }
        })
    }
    //get internal audit details
    public get_audit_details(reference: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[reference_number]=' + reference + '&populate=auditees&populate=auditees.division&populate=created_By&populate=approver&populate=audit_team_members&populate=internal_audit_evidences&populate=business_unit&populate=internal_audit_cover_photo&populate=multiple_facility_photos')
    }
    // get corrective actions
    public get_int_corrective_action() {
        return this.http.get(AppService.base_url + AppService.action_plan + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_corrective_action_register(userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.action_plan + '?filters[$or][0][assignee]=' + userID + '&populate=assignee&populate=initial_assignee&populate=internal_audit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_corrective_action_reference(id: any) {
        return this.http.get(AppService.base_url + AppService.action_plan + '?filters[reference_number]=' + id + '&pagination[limit]=-1&sort[0]=id:desc')

    }

    //get audit tasks
    public get_audit_tasks(userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[approver]=' + userID + '&filters[status]=Scheduled&populate=auditees&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_internal_audit_search(reference: any, userID: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[reference_number]=' + reference + '&filters[approver]=' + userID + '&filters[status]=Scheduled&sort[0]=id:desc')
    }

    public get_audit_unit_specific_tasks(userID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[approver]=' + userID + '&' + division + '&filters[status]=Scheduled&populate=auditees&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_internal_audit_unit_specific_search(reference: any, userID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[reference_number]=' + reference + '&filters[approver]=' + userID + '&' + division + '&filters[status]=Scheduled&sort[0]=id:desc')
    }

    //get audit tasks
    public get_audit_queue(userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[$or][0][approver]=' + userID + '&filters[$or][1][audit_team_members][user_id]=' + userID + '&filters[status]=Approved&populate=auditees&populate=approver&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_internal_audit_queue_search(reference: any, userID: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[reference_number]=' + reference + '&filters[$or][0][approver]=' + userID + '&filters[$or][1][audit_team_members][user_id]=' + userID + '&filters[status]=Approved&populate=auditee&populate=approver&sort[0]=id:desc')
    }

    public get_audit_unit_specific_queue(userID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[$or][0][approver]=' + userID + '&' + division + '&filters[$or][1][audit_team_members][user_id]=' + userID + '&filters[status]=Approved&populate=auditees&populate=approver&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_internal_audit_unit_specific_queue_search(reference: any, userID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[reference_number]=' + reference + '&filters[$or][0][approver]=' + userID + '&' + division + '&filters[$or][1][audit_team_members][user_id]=' + userID + '&filters[status]=Approved&populate=auditee&populate=approver&sort[0]=id:desc')
    }
    //update action
    public update_status(data: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + data.id, {
            data: {
                status: data.status,
                updated_By: data.updatedBy,
                announcemeny_type: data.announcement,
                approver_remarks: data.remarks,
                action_notification: false,
                auditee_notification: data.auditee_notification,
                approved_date: data.approved_date
            }
        })
    }

    //update audit team
    public update_audit_team(audID: any, data: any) {

        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + audID, {
            data: {
                audit_teams: {
                    id: data.member
                }
            }
        })

    }

    //create internal audit team
    public create_audit_member(audID: any, data: any) {
        return this.http.post(AppService.base_url + AppService.audit_team_member, {
            data: {
                name: data.attributes.first_name + ' ' + data.attributes.last_name,
                date: new Date(),
                designation: data.attributes.designation,
                email: data.attributes.email,
                user_id: data.id,
                internal_audit: audID

            }
        })
    }

    //delete audit member
    public delete_audit_member(id: any) {
        return this.http.delete(AppService.base_url + AppService.audit_team_member + '/' + id)
    }
    public delete_auditee(id: any) {
        return this.http.delete(AppService.base_url + AppService.auditees + '/' + id)
    }

    //get audit checklit
    public get_audit_checklist() {
        return this.http.get(AppService.base_url + AppService.audit_checklist + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    //creat audit marks
    public create_audit_marks(data: any) {
        return this.http.post(AppService.base_url + AppService.audit_marks, {
            data: {
                reference_number: data.reference_number,
                question: data.question,
                // mark: data.mark,
                audit_mark: data.mark,
                legal_reference: data.legal_reference,
                category: data.category,
                sub_category: data.sub_category,
                checklist_id: data.checklist_id,
                internal_audit: data.internal_audit,
                remarks: data.remarks,
                priority: data.priority,
                color_code: data.color_code,
                weightage: data.weightage,
                achievable_score: data.achievable_score,
                score: data.score,
                rating: data.rating,
                command: data.command,
                command_evidence_name: data.evidence_name,
                command_evidence_format: data.evidence_format,
                command_evidence_id: data.command_evidence_id




            }
        })
    }

    public get_audit_marks(reference: any) {
        return this.http.get(AppService.base_url + AppService.audit_marks + '?filters[reference_number]=' + reference + '&populate=internal_audit_evidences&populate=internal_multiple_evidences&pagination[limit]=-1&sort[0]=id:desc')
    }

    public delete_audit_mark(id: any) {
        return this.http.delete(AppService.base_url + AppService.audit_marks + '/' + id)
    }


    public update_audit_mark(id: any, rating: any, score: any, mark: any, remarks: any) {
        return this.http.put(AppService.base_url + AppService.audit_marks + '/' + id, {
            data: {

                rating: rating,
                score: score,
                audit_mark: mark,
                remarks: remarks,

            }
        })
    }

    public update_audit_mark_command(id: any, rating: any, score: any, mark: any, remarks: any, data: any) {
        return this.http.put(AppService.base_url + AppService.audit_marks + '/' + id, {
            data: {

                rating: rating,
                score: score,
                audit_mark: mark,
                remarks: remarks,
                command: data[0]?.command,
                command_evidence_name: data[0]?.evidence_name,
                command_evidence_format: data[0]?.evidence_format,
                command_evidence_id: data[0]?.command_evidence_id

            }
        })
    }
    public update_auditee(data: any) {
        return this.http.put(AppService.base_url + AppService.auditees + '/' + data.id, {
            data: {
                auditee_name: data.name,
                email: data.email,
            }
        })
    }

    public get_action_plan(audID: any) {
        return this.http.get(AppService.base_url + AppService.action_plan + '?filters[internal_audit]=' + audID + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_action_plan_reference(audID: any) {
        return this.http.get(AppService.base_url + AppService.action_plan + '?filters[mark_id]=' + audID + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    public delete_action_plan(actionID: any) {
        return this.http.delete(AppService.base_url + AppService.action_plan + '/' + actionID)
    }

    public update_action_plan(data: any) {
        return this.http.put(AppService.base_url + AppService.action_plan + '/' + data.id, {
            data: {
                findings: data.findings,
                priority: data.priority,
                date: new Date()
            }

        })
    }

    public create_action_plan(data: any) {
        return this.http.post(AppService.base_url + AppService.action_plan, {
            data: {
                reference_number: data.action_plan_reference_number,
                findings: data.findings,
                internal_audit: data.internal_audit,
                priority: data.priority,
                date: data.reported_date,
                mark_id: data.mark_id,
                due_date: data.due_date,
                assignee: data.assignee,
                initial_assignee: data.assignee,
                approver: data.approver
            }
        })

    }
    public create_audit_command(data: any, evidence: any) {
        return this.http.post(AppService.base_url + AppService.internal_audit_command, {
            data: {
                command: data.command,
                evidence_name: evidence.evidence_name,
                evidence_id: evidence.command_evidence_id,
                format: evidence.evidence_format,
                internal_audit: evidence.internal_audit

            }
        })

    }

    public create_command_audit(data: any) {
        return this.http.post(AppService.base_url + AppService.internal_audit_command, {
            data: {
                command: data.command,
                evidence_name: data.evidence_name,
                evidence_id: data.command_evidence_id,
                format: data.evidence_format,
                internal_audit: data.internal_audit

            }
        })

    }

    public create_audit_action_plan(data: any) {
        return this.http.post(AppService.base_url + AppService.action_plan, {
            data: {
                reference_number:data.reference_number,
                findings: data.finding,
                internal_audit: data.audid,
                priority: data.priority,
                due_date: data.due_date,
                date: data.date,
                assignee: data.assignee,
                initial_assignee: data.assignee
                // date: new Date(),
                // actual_completion_date: data.actual_completion_date,
                // due_date: data.due_date,
                // root_cause: data.root_cause,
                // corrective_action_plan: data.corrective_action_plan,
                // heirarchy_control: data.heirarchy_control,
                // sustainable_solution: data.sustainable_solution,
                // user_profile: data.responsible,

            }
        })

    }
    public audit_action_plan(id: any) {
        return this.http.get(AppService.base_url + AppService.action_plan + '/' + id + '?populate=internal_audit_evidences&populate=internal_multiple_evidence_before&populate=internal_multiple_evidence_after&populate=internal_audit&populate=assignee&populate=approver&populate=initial_assignee')
    }
    public update_internal_audit_action_plan(data: any, id: any) {
        return this.http.put(AppService.base_url + AppService.action_plan + '/' + id, {
            data: {
                due_date: data.due_date,
                target_completion_date: data.target_completion_date,
                actual_completion_date: data.complete_date,
                findings: data.findings,
                corrective_action_plan: data.action_plan,
                root_cause: data.root_cause,
                status: data.status,
                approver: data.approver,
                assignee: data.assignee,
                heirarchy_control: data.heirarchy_control,
                sustainable_solution: data.sustainable_solution,
                barrier_challenges: data.barrier_challenges,
                assignee_remark: data.assignee_remark,
                user_profile: data.responsible,
                approver_remark: data.approver_remark,
                implemented_actions: data.implemented_actions,
                lessons_learned: data.lessons_learned
            }
        })
    }
    public update_audit_action_plan(data: any) {

        return this.http.put(AppService.base_url + AppService.action_plan + '/' + data.id, {
            data: {
                due_date: data.due_date,
                target_completion_date: data.target_completion_date,
                actual_completion_date: data.complete_date,
                findings: data.findings,
                corrective_action_plan: data.action_plan,
                root_cause: data.root_cause,
                status: data.status,
                approver: data.approver,
                assignee: data.assignee,
                heirarchy_control: data.heirarchy_control,
                sustainable_solution: data.sustainable_solution,
                barrier_challenges: data.barrier_challenges,
                assignee_remark: data.assignee_remark,
                user_profile: data.responsible,
                approver_remark: data.approver_remark,
                implemented_actions: data.implemented_actions,
                lessons_learned: data.lessons_learned
            }
        })
    }

    public update_audit_action_plan_by_actionplan_id(data: any, id: any) {

        return this.http.put(AppService.base_url + AppService.action_plan + '/' + id, {
            data: {
                due_date: data.attributes.due_date,
                target_completion_date: data.attributes.target_completion_date,
                actual_completion_date: data.attributes.complete_date,
                findings: data.attributes.findings,
                corrective_action_plan: data.attributes.action_plan,
                root_cause: data.attributes.root_cause,
                status: data.attributes.status,
                approver: data.attributes.approver,
                assignee: data.attributes.assignee,
                heirarchy_control: data.attributes.heirarchy_control,
                sustainable_solution: data.attributes.sustainable_solution,
                barrier_challenges: data.attributes.barrier_challenges,
                assignee_remark: data.attributes.assignee_remark,
                user_profile: data.attributes.responsible,
                approver_remark: data.attributes.approver_remark,
                implemented_actions: data.attributes.implemented_actions,
                lessons_learned: data.attributes.lessons_learned
            }
        })
    }

    public audit_action_plan_rejected(data: any) {
        return this.http.put(AppService.base_url + AppService.action_plan + '/' + data.id, {
            data: {
                status: data.status,
                approver_remark: data.approver_remark,
            }
        })
    }
    //create open AI
    public create_open_ai(data: any, completion_tokens: any, prompt_tokens: any, total_tokens: any) {
        return this.http.post(AppService.base_url + AppService.open_ai, {
            data: {
                module: 'Internal Audit',
                date_and_time: new Date(),
                reference_number: data.reference_number,
                user: data.user,
                event: 'Generated Non-Compliance Suggestion',
                completion_tokens: completion_tokens,
                prompt_tokens: prompt_tokens,
                total_tokens: total_tokens
            }
        })
    }

    public start_labor_audit(id: any, status: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                labor_audit_status: status
            }
        })

    }

    public start_labor_pending_audit(id: any, status: any, pendingAsString: any, pendingPer: any, pendingColor: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                labor_audit_status: status,
                pending_audit: pendingAsString,
                pending_percentage: pendingPer,
                pending_color_code: pendingColor
            }
        })

    }

    public start_health_audit(id: any, status: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                health_audit_status: status
            }
        })

    }

    public start_health_pending_audit(id: any, status: any, pendingAsString: any, pendingPer: any, pendingColor: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                health_audit_status: status,
                pending_audit: pendingAsString,
                pending_percentage: pendingPer,
                pending_color_code: pendingColor
            }
        })

    }

    public start_environ_audit(id: any, status: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                environment_audit_status: status
            }
        })

    }

    public start_environ_pending_audit(id: any, status: any, pendingAsString: any, pendingPer: any, pendingColor: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                environment_audit_status: status,
                pending_audit: pendingAsString,
                pending_percentage: pendingPer,
                pending_color_code: pendingColor
            }
        })

    }

    public start_management_audit(id: any, status: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                management_audit_status: status
            }
        })

    }

    public start_management_pending_audit(id: any, status: any, pendingAsString: any, pendingPer: any, pendingColor: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                management_audit_status: status,
                pending_audit: pendingAsString,
                pending_percentage: pendingPer,
                pending_color_code: pendingColor
            }
        })

    }


    public start_security_audit(id: any, status: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                security_audit_status: status
            }
        })

    }

    public start_security_pending_audit(id: any, status: any, pendingAsString: any, pendingPer: any, pendingColor: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                security_audit_status: status,
                pending_audit: pendingAsString,
                pending_percentage: pendingPer,
                pending_color_code: pendingColor
            }
        })

    }

    public audit_complete(id: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                status: "Completed",
                // labor_audit_status: "Completed",
                // health_audit_status: "Completed",
                // environment_audit_status: "Completed",
                // management_audit_status:"Completed",
                // security_audit_status: "Completed",
                completed_date: new Date
            }
        })
    }
    public audit_reopen(id: any) {
        return this.http.put(AppService.base_url + AppService.internal_audit + '/' + id, {
            data: {
                status: "Approved"
            }
        })
    }
    public create_employee(data: any) {
        return this.http.post(AppService.base_url + AppService.employees, {
            data: {
                employee_name: data.name,
                email: data.email
            }
        })
    }
    public create_audit(data: any) {
        return this.http.post(AppService.base_url + AppService.auditees, {
            data: {
                auditee_name: data.name,
                email: data.email
            }
        })
    }
    public get_auditees() {
        return this.http.get(AppService.base_url + AppService.auditees + '?populate=division&pagination[limit]=-1&sort[0]=id:desc')
    }
    //get report
    public internal_audit_report(id: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_report_v1.pdf?auditID=' + id + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    //Hierarchy of control
    //dropdown
    public get_dropdown(module: any) {
        return this.http.get(AppService.base_url + AppService.dropdown_values + '?filters[module]=' + module + '&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_actionplan_approvers(orgID: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][aud_action_plan][$eq]=true&filters[$and][1][user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }
    //#######################################################
    public generate_internal_audit_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.audit_marks + '?filters[internal_audit][date][$gte]=' + startDate + '&' + division + '&filters[internal_audit][date][$lte]=' + endDate + '&populate=internal_audit&pagination[limit]=-1&sort[0]=id:desc')
    }

    public generate_internal_audit_data_division(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.audit_marks + '?filters[internal_audit][date][$gte]=' + startDate + '&filters[internal_audit][date][$lte]=' + endDate + '&filters[internal_audit][business_unit][division_uuid]=' + division + '&populate=internal_audit&pagination[limit]=-1&sort[0]=id:desc')
    }
    public generate_internal_audit_action(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.action_plan + '?filters[date][$gte]=' + startDate + '&filters[date][$lte]=' + endDate + '&' + division + '&filters[status][$ne]=Draft&populate[internal_audit][populate]=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }

    public generate_internal_audit_action_division(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.action_plan + '?filters[internal_audit][date][$gte]=' + startDate + '&filters[internal_audit][date][$lte]=' + endDate + '&filters[internal_audit][business_unit][division_uuid]=' + division + '&filters[status][$ne]=Draft&populate=internal_audit&pagination[limit]=-1&sort[0]=id:desc')
    }

    public generate_internal_audit_approved_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[approved_date][$gte]=' + startDate + '&filters[approved_date][$lte]=' + endDate + '&' + division + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }
    public generate_internal_audit_inprogress_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[inprogress_date][$gte]=' + startDate + '&filters[inprogress_date][$lte]=' + endDate + '&' + division + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }
    public generate_internal_audit_completed_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[completed_date][$gte]=' + startDate + '&filters[completed_date][$lte]=' + endDate + '&' + division + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }
    public generate_internal_audit_scheduled_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[date][$gte]=' + startDate + '&filters[date][$lte]=' + endDate + '&' + division + '&filters[status][$ne]=Draft&populate=approver&populate=audit_team_members&pagination[limit]=-1&sort[0]=id:desc')
    }

    public generate_internal_audit_approved_division_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[approved_date][$gte]=' + startDate + '&filters[approved_date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&filters[status][$ne]=Draft&populate=audit_team_members&populate=approver&pagination[limit]=-1&sort[0]=id:desc')
    }
    public generate_internal_audit_inprogress_division_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[inprogress_date][$gte]=' + startDate + '&filters[inprogress_date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }
    public generate_internal_audit_completed_division_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[completed_date][$gte]=' + startDate + '&filters[completed_date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }


    public generate_internal_data_division_category(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[date][$gte]=' + startDate + '&filters[date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    public generate_internal_audit_scheduled_division_data(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[date][$gte]=' + startDate + '&filters[date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&filters[status][$ne]=Draft&populate=audit_team_members&populate=approver&pagination[limit]=-1&sort[0]=id:desc')
    }
    public internal_audit_action_expiry(expiryDate: any, currentDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.action_plan + '?filters[due_date][$lte]=' + expiryDate + '&filters[due_date][$gte]=' + currentDate + '&' + division + '&filters[status][$ne]=Draft&populate[0]=internal_audit')
    }

    public create_audit_coverpage_image(data: any) {
        return this.http.post(AppService.base_url + AppService.cover_photo, {
            data: {
                cover_photo_name: data.coverImage_name,
                format: data.format,
                internal_audit: data.internal_audit,
                cover_photo_id: data.id,
            }
        })
    }

    public delete_audit_coverpage_image(id: any) {
        return this.http.delete(AppService.base_url + AppService.cover_photo + '/' + id)
    }

    public create_audit_multiplefacilityphoto(data: any) {
        return this.http.post(AppService.base_url + AppService.multiple_facility_photos, {
            data: {
                evidence_name: data.evidence_name,
                format: data.format,
                internal_audit: data.internal_audit,
                image_id: data.evidence_id,
                title: data.title
            }
        })
    }

    public delete_audit_multiplefacilityphoto(id: any) {
        return this.http.delete(AppService.base_url + AppService.multiple_facility_photos + '/' + id)
    }

     public get_audit_multiplefacilityphoto(audId: any) {
        return this.http.get(AppService.base_url + AppService.multiple_facility_photos + '?filters[internal_audit][id][$gte]=' + audId)
    }

    //get report
    // public internal_audit_action_plan(audit: any): any {
    //     return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_corrective_action_plan_report.xls?internal_audit=' + audit + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    // }

    public internal_audit_action_plan(audit: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_action_plan_report.xls?internal_audit=' + audit + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    //register reports
    public internal_audit_register_report(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report.pdf?start_date=' + data.start_date + '&end_date=' + data.end_date + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public internal_audit_register_report_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report_excel.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public internal_audit_register_report_2(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report.pdf?start_date=' + data.start_date + '&end_date=' + data.end_date + '&division=' + data.division + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public internal_audit_register_report_excel_2(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report_excel.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date + '&division=' + data.division + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public internal_audit_register_report_3(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report.pdf?year=' + data.year + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public internal_audit_register_report_excel_3(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report_excel.xlsx?year=' + data.year + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public internal_audit_register_report_4(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report.pdf?year=' + data.year + '&month=' + data.month + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public internal_audit_register_report_excel_4(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report_excel.xlsx?year=' + data.year + '&month=' + data.month + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }


    public internal_audit_register_report_5(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report.pdf?year=' + data.year + '&division=' + data.division + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public internal_audit_register_report_excel_5(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report_excel.xlsx?year=' + data.year + '&division=' + data.division + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public internal_audit_register_report_6(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report.pdf?year=' + data.year + '&month=' + data.month + '&division=' + data.division + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public internal_audit_register_report_excel_6(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report_excel.xlsx?year=' + data.year + '&month=' + data.month + '&division=' + data.division + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public internal_audit_register_report_7(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report.pdf?month=' + data.month + '&division=' + data.division + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public internal_audit_register_report_excel_7(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_internal_audit_register_report_excel.xlsx?month=' + data.month + '&division=' + data.division + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

}