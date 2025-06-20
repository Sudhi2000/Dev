import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GrievanceService extends AppService {

    token: string

    constructor(private http: HttpClient) {
        super();
    }


    public get_grievance_register(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.grievance + '?populate[0]=disposals&populate=business_unit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_division_grievance_register(division:any,startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.grievance + '?'+division+ '&populate[0]=disposals&populate=business_unit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_periodic_division_grievance_register(startDate: any, endDate: any,division:any,startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.grievance+'?filters[submission_date][$gte]=' + startDate + '&filters[submission_date][$lte]=' + endDate  + '&'+division+ '&populate[0]=disposals&populate=business_unit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_non_unit_specific_division_grievance_register(division:any,startIndex: number, pageSize: number) {        
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[business_unit][id]='+division+ '&populate[0]=disposals&populate=business_unit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_periodic_grievance_register(startDate: any, endDate: any,startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.grievance  +'?filters[submission_date][$gte]=' + startDate + '&filters[submission_date][$lte]=' + endDate  + '&populate[0]=disposals&populate=business_unit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    // public get_periodic_grievance_register(startDate: any, endDate: any,startIndex: number, pageSize: number) {
    //     return this.http.get(AppService.base_url + AppService.grievance + '?filters[submission_date][$gte]=' + startDate + '&filters[submission_date][$lte]=' + endDate  +'&populate[0]=disposals&populate=business_unit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    // }
    public get_unit_specific_grievance_history(startIndex: number, pageSize: number, division:any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?' + division +'&populate[0]=disposals&populate=business_unit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_division_grievance_history(startIndex: number, pageSize: number, division:any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?' + division +'&populate[0]=disposals&populate=business_unit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_periodic_grievance_history(startDate: any, endDate: any,startIndex: number, pageSize: number, division:any) {
        return this.http.get(AppService.base_url + AppService.grievance +'?filters[submission_date][$gte]=' + startDate + '&filters[submission_date][$lte]=' + endDate +'&' + division +'&populate[0]=disposals&populate=business_unit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    // public get_division_grievance_register(division:any,startIndex: number, pageSize: number) {
    //     console.log(division);
        
    //     return this.http.get(AppService.base_url + AppService.grievance + '?filters[business_unit][id]='+division +'&populate[0]=disposals&populate=business_unit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    // }
    public get_grievance_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[case_id][$eq]=' + reference)
    }
    public get_grievance_details(reference: any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[id][$eq]=' + reference + '&populate=grievance_evidences&populate=business_unit&populate=assignee&populate=committee_members&populate=grievance_statements&populate=respondent&populate=nominee&populate=union_representative&populate=legal_advisors&populate=commitee_statement&populate=grievant_statement_doc')
    }
    public get_submission() {
        return this.http.get(AppService.base_url + AppService.submission + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_topic() {
        return this.http.get(AppService.base_url + AppService.grievance_topic + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_alleged_party() {
        return this.http.get(AppService.base_url + AppService.grievance_alleged_party + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_grievance_count(year: any, month: any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[year]=' + year + '&filters[month]=' + month + '&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_assigned_tasks(userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.grievance + '?populate=business_unit&filters[$or][0][assignee]=' + userID + '&filters[$or][0][status]=Open&filters[$or][1][status]=In-Progress&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_assigned_tasks(userID: any, startIndex: number, pageSize: number, division:any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[$or][0][assignee]=' + userID + '&populate=business_unit&' + division + '&filters[$or][0][status]=Open&filters[$or][1][status]=In-Progress&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_grievance_case_id(caseID: any) {
        return this.http.get(
          AppService.base_url +
          AppService.grievance +
          '?filters[case_id][$eq]=' +
          caseID
        );
      }
    public create_submission(name: any) {
        return this.http.post(AppService.base_url + AppService.submission, {
            data: {
                submission: name
            }
        })
    }
    public create_topic(name: any,category:any, user: any) {
        return this.http.post(AppService.base_url + AppService.grievance_topic, {
            data: {
                topic_name: name,
                created_user: user,
                category:category
            }
        })
    }
    
    public create_alleged_party(name: any,user: any) {
        return this.http.post(AppService.base_url + AppService.grievance_alleged_party, {
            data: {
                alleged_party_name: name,
                created_user: user
            }
        })
    }
    //create grievance
    public create_grievance(data: any, general: any) {

        return this.http.post(AppService.base_url + AppService.grievance, {
            data: {
                type: data.type,
                subtype: data.subtype,
                resignation_type: data.resignation_type,
                case_id: data.case_id,
                anonymous: data.anonymous,
                person_type: general.person_type,
                division: general.division,
                employee_id: general.employee_id,
                name: general.name,
                gender: general.gender,
                date_of_join: general.date_of_join,
                service_period: general.service_period,
                tenure_split: general.tenure_split,
                designation: general.designation,
                department: general.department,
                channel: data.channel,
                category: data.category,
                topic: data.topic,
                submissions: data.submissions,
                description: data.description,
                remarks: data.remarks,
                helpdesk_person: data.helpdesk_person,
                submission_date: data.submission_date,
                created_date: data.created_date,
                responsible_department: data.responsible_department,
                month: data.month,
                year: data.year,
                status: data.status,
                supervisor: general.supervisor,
                human_rights_violation: data.human_rights_violation,
                scale: data.scale,
                frequency_rate: data.frequency_rate,
                severity_score: data.severity_score,
                due_date: data.due_date,
                investigation_required: data.investigation_required,
                human_rights_score: data.human_rights_score,
                severity_color_code: data.severity_color_code,
                human_rights_final_score: data.human_rights_final_score,
                scale_score: data.scale_score,
                scale_final_score: data.scale_final_score,
                frequency_score: data.frequency_score,
                frequency_final_score: data.frequency_final_score,
                total_score: data.total_score,
                assignee: data.assignee,
                tat_status: data.tat_status,
                employee_shift: general.employee_shift,
                location:general.location,
                business_unit:data.business_unit,
                alleged_party: data.alleged_party
            }
        })
    }
    public create_employee_shift(shift: any) {
        return this.http.post(AppService.base_url + AppService.grievance_employee_shift, {
            data: {
                shift_name: shift,
            }
        })
    }
    public get_employee_shifts() {
        return this.http.get(AppService.base_url + AppService.grievance_employee_shift + '?populate*&pagination[limit]=-1&sort[0]=id:desc')
    }
    public create_grievance_anonymous(data: any,selectedDivision:any) {
        return this.http.post(AppService.base_url + AppService.grievance, {
            data: {
                type: data.type,
                subtype: data.subtype,
                resignation_type: data.resignation_type,
                case_id: data.case_id,
                anonymous: data.anonymous,
                channel: data.channel,
                category: data.category,
                topic: data.topic,
                submissions: data.submissions,
                description: data.description,
                remarks: data.remarks,
                helpdesk_person: data.helpdesk_person,
                submission_date: data.submission_date,
                created_date: data.created_date,
                responsible_department: data.responsible_department,
                month: data.month,
                year: data.year,
                status: data.status,
                human_rights_violation: data.human_rights_violation,
                scale: data.scale,
                frequency_rate: data.frequency_rate,
                severity_score: data.severity_score,
                due_date: data.due_date,
                investigation_required: data.investigation_required,
                human_rights_score: data.human_rights_score,
                severity_color_code: data.severity_color_code,
                human_rights_final_score: data.human_rights_final_score,
                scale_score: data.scale_score,
                scale_final_score: data.scale_final_score,
                frequency_score: data.frequency_score,
                frequency_final_score: data.frequency_final_score,
                total_score: data.total_score,
                assignee: data.assignee,
                tat_status: data.tat_status,
                employee_shift: data.employee_shift,
                business_unit:data.business_unit,
                division:selectedDivision,
                alleged_party: data.alleged_party
            }
        })
    }
    public create_non_grievance(data: any, general: any) {
        return this.http.post(AppService.base_url + AppService.grievance, {
            data: {
                type: data.type,
                subtype: data.subtype,
                resignation_type: data.resignation_type,
                case_id: data.case_id,
                anonymous: data.anonymous,
                person_type: general.person_type,
                division: general.division,
                employee_id: general.employee_id,
                name: general.name,
                gender: general.gender,
                date_of_join: general.date_of_join,
                service_period: general.service_period,
                tenure_split: general.tenure_split,
                designation: general.designation,
                department: general.department,
                channel: data.channel,
                category: data.category,
                topic: data.topic,
                submissions: data.submissions,
                description: data.description,
                remarks: data.remarks,
                helpdesk_person: data.helpdesk_person,
                submission_date: data.submission_date,
                created_date: data.created_date,
                responsible_department: data.responsible_department,
                month: data.month,
                year: data.year,
                status: data.status,
                assignee: data.assignee,
                investigation_required: data.investigation_required,
                tat_status: data.tat_status,
                employee_shift: general.employee_shift,
                business_unit:data.business_unit

            }
        })
    }
    public create_non_grievance_anonymous(data: any,selectedDivision:any) {
        return this.http.post(AppService.base_url + AppService.grievance, {
            data: {
                type: data.type,
                subtype: data.subtype,
                resignation_type: data.resignation_type,
                case_id: data.case_id,
                anonymous: data.anonymous,
                channel: data.channel,
                category: data.category,
                topic: data.topic,
                submissions: data.submissions,
                description: data.description,
                remarks: data.remarks,
                helpdesk_person: data.helpdesk_person,
                submission_date: data.submission_date,
                created_date: data.created_date,
                responsible_department: data.responsible_department,
                month: data.month,
                year: data.year,
                status: data.status,
                assignee: data.assignee,
                investigation_required: data.investigation_required,
                tat_status: data.tat_status,
                business_unit:data.business_unit,
                division:selectedDivision
            }
        })
    }
    public create_grievance_evidence(data: any) {
        return this.http.post(AppService.base_url + AppService.grievance_evidence, {
            data: {
                evidence_name: data.evidence_name,
                format: data.format,
                evidece_id: data.id,
                grievance: data.grievance,
                evidence_after_name: data.evidence_after_name,
                evidence_after_id: data.evidence_after_id,
                format_after: data.format_after,
                evidence_after: data.evidence_after,
            }
        })
    }
    public create_open_ai(data: any, completion_tokens: any, prompt_tokens: any, total_tokens: any) {
        return this.http.post(AppService.base_url + AppService.open_ai, {
            data: {
                module: 'Grievance',
                date_and_time: new Date(),
                reference_number: data.reference_number,
                user: data.user,
                event: 'Generated Description',
                completion_tokens: completion_tokens,
                prompt_tokens: prompt_tokens,
                total_tokens: total_tokens
            }
        })
    }
    public update_non_grievance_anonymous(data: any,selectedDivision:any) {
        return this.http.put(AppService.base_url + AppService.grievance + '/' + data.id, {
            data: {
                type: data.type,
                subtype: data.subtype,
                resignation_type: data.resignation_type,
                case_id: data.case_id,
                anonymous: data.anonymous,
                channel: data.channel,
                category: data.category,
                topic: data.topic,
                submissions: data.submissions,
                description: data.description,
                remarks: data.remarks,
                helpdesk_person: data.helpdesk_person,
                submission_date: data.submission_date,
                responsible_department: data.responsible_department,
                month: data.month,
                year: data.year,
                status: data.status,
                assignee: data.assignee,
                investigation_required: data.investigation_required,
                business_unit:data.business_unit,
                division:selectedDivision
            }
        })
    }
    public update_non_grievance(data: any, general: any) {
        return this.http.put(AppService.base_url + AppService.grievance + '/' + data.id, {
            data: {
                type: data.type,
                subtype: data.subtype,
                resignation_type: data.resignation_type,
                anonymous: data.anonymous,
                person_type: general.person_type,
                division: general.division,
                employee_id: general.employee_id,
                name: general.name,
                employee_shift: general.employee_shift,
                gender: general.gender,
                date_of_join: general.date_of_join,
                service_period: general.service_period,
                tenure_split: general.tenure_split,
                designation: general.designation,
                department: general.department,
                channel: data.channel,
                category: data.category,
                topic: data.topic,
                submissions: data.submissions,
                description: data.description,
                remarks: data.remarks,
                helpdesk_person: data.helpdesk_person,
                submission_date: data.submission_date,
                responsible_department: data.responsible_department,
                status: data.status,
                assignee: data.assignee,
                investigation_required: data.investigation_required,
                business_unit:data.business_unit
            }
        })
    }
    public update_grievance(data: any, general: any) {
        return this.http.put(AppService.base_url + AppService.grievance + '/' + data.id, {
            data: {
                type: data.type,
                subtype: data.subtype,
                resignation_type: data.resignation_type,
                case_id: data.case_id,
                anonymous: data.anonymous,
                person_type: general.person_type,
                division: general.division,
                employee_id: general.employee_id,
                name: general.name,
                gender: general.gender,
                date_of_join: general.date_of_join,
                service_period: general.service_period,
                tenure_split: general.tenure_split,
                designation: general.designation,
                department: general.department,
                employee_shift: general.employee_shift,
                channel: data.channel,
                category: data.category,
                topic: data.topic,
                submissions: data.submissions,
                description: data.description,
                remarks: data.remarks,
                helpdesk_person: data.helpdesk_person,
                submission_date: data.submission_date,
                responsible_department: data.responsible_department,
                month: data.month,
                year: data.year,
                status: data.status,
                supervisor: general.supervisor,
                human_rights_violation: data.human_rights_violation,
                scale: data.scale,
                frequency_rate: data.frequency_rate,
                severity_score: data.severity_score,
                due_date: data.due_date,
                investigation_required: data.investigation_required,
                human_rights_score: data.human_rights_score,
                severity_color_code: data.severity_color_code,
                human_rights_final_score: data.human_rights_final_score,
                scale_score: data.scale_score,
                scale_final_score: data.scale_final_score,
                frequency_score: data.frequency_score,
                frequency_final_score: data.frequency_final_score,
                total_score: data.total_score,
                assignee: data.assignee,
                business_unit:data.business_unit,
                alleged_party:data.alleged_party
            }
        })
    }

    public update_grievance_anonymous(data: any,selectedDivision:any) {
        return this.http.put(AppService.base_url + AppService.grievance + '/' + data.id, {
            data: {
                type: data.type,
                subtype: data.subtype,
                resignation_type: data.resignation_type,
                case_id: data.case_id,
                anonymous: data.anonymous,
                channel: data.channel,
                category: data.category,
                topic: data.topic,
                submissions: data.submissions,
                description: data.description,
                remarks: data.remarks,
                helpdesk_person: data.helpdesk_person,
                submission_date: data.submission_date,
                responsible_department: data.responsible_department,
                month: data.month,
                year: data.year,
                status: data.status,
                human_rights_violation: data.human_rights_violation,
                scale: data.scale,
                frequency_rate: data.frequency_rate,
                severity_score: data.severity_score,
                due_date: data.due_date,
                investigation_required: data.investigation_required,
                human_rights_score: data.human_rights_score,
                severity_color_code: data.severity_color_code,
                human_rights_final_score: data.human_rights_final_score,
                scale_score: data.scale_score,
                scale_final_score: data.scale_final_score,
                frequency_score: data.frequency_score,
                frequency_final_score: data.frequency_final_score,
                total_score: data.total_score,
                assignee: data.assignee,
                business_unit:data.business_unit,
                division:selectedDivision,
                alleged_party:data.alleged_party

            }
        })
    }
    public update_grievance_feedback(data: any, id: any) {
        return this.http.put(AppService.base_url + AppService.grievance + '/' + id, {
            data: {
                rating: data.rating,
                feedback: data.feedback,
                //employee_feedback: data.employee_feedback
            }
        })
    }
    public update_completion_status(id: any,tat_days:any) {        
        return this.http.put(AppService.base_url + AppService.grievance + '/' + id, {
            data: {
                status: "Completed",
                tat_days:tat_days
            }
        }
        )
    }
    public update_non_grievance_completion_status(id: any) {
        
        return this.http.put(AppService.base_url + AppService.grievance + '/' + id, {
            data: {
                status: "Completed",
            }
        }
        )
    }
    public update_inProgress_status(id: any) {
        return this.http.put(AppService.base_url + AppService.grievance + '/' + id, {
            data: {
                status: "In-Progress",
            }
        })
    }
    public update_non_grievance_solution(id: any, data: any) {
        return this.http.put(AppService.base_url + AppService.grievance + '/' + id, {
            data: {
                solution_remarks: data.solution_remarks,
                acknowledged: data.acknowledged,
            }
        })
    }
    public update_grievance_solution(id: any, data: any) {
        return this.http.put(AppService.base_url + AppService.grievance + '/' + id, {
            data: {
                solution_remarks: data.solution_remarks,
                previously_raised: data.previously_raised,
                union_representative: data.union_representative,
                grievant_statement: data.grievant_statement,
                solution_provided: data.solution_provided,
                resolution_date: data.resolution_date,
                follow_up: data.follow_up,
                appeal: data.appeal,
                committee_statement: data.committee_statement
            }
        })
    }
    public create_committee_member(data: any) {
        return this.http.post(AppService.base_url + AppService.grievance_commitee, {
            data: {
                name: data.name,
                designation: data.designation,
                employee_id: data.employee_id,
                department: data.department,
                grievance: data.grievId
            }
        })
    }
    public create_legal_advisor(data: any) {
        return this.http.post(AppService.base_url + AppService.grievance_legal_advisor, {
            data: {
                name: data.name,
                email_id: data.email_id,
                phone: data.phone,
                grievance: data.grievId
            }
        })
    }
    public create_nominee(data: any) {
        return this.http.post(AppService.base_url + AppService.grievance_nominee, {
            data: {
                name: data.name,
                designation: data.designation,
                employee_id: data.employee_id,
                department: data.department,
                grievance: data.grievId
            }
        })
    }
    public create_employee(data: any) {
        return this.http.post(AppService.base_url + AppService.employees, {
            data: {
                employee_name: data.name,
                designation: data.designation,
                employee_id: data.employee_id,
                department: data.department,
            }
        })
    }
    public create_respondent(data: any) {
        return this.http.post(AppService.base_url + AppService.grievance_respondent, {
            data: {
                name: data.name,
                designation: data.designation,
                employee_id: data.employee_id,
                department: data.department,
                statement: data.statement,
                grievance: data.grievId
            }
        })
    }
    public create_grievance_statement(data: any) {
        return this.http.post(AppService.base_url + AppService.grievance_statement, {
            data: {
                statement_name: data.statement_name,
                format: data.format,
                respondent: data.respondent,
                statement_id: data.statement_id,
                grievance: data.grievance,
                investigation_committee: data.investigation_committee
            }
        })
    }

    public update_employee(data: any) {
        return this.http.put(AppService.base_url + AppService.employees + '/' + data.empid, {
            data: {
                employee_name: data.name,
                designation: data.designation,
                employee_id: data.employee_id,
                department: data.department,
            }
        })
    }
    public update_grievance_evidence(evidenceId: any, data: any) {

        return this.http.put(AppService.base_url + AppService.grievance_evidence + '/' + evidenceId, {
            data: {
                evidence_after_name: data.evidence_after_name,
                evidence_after_id: data.evidence_after_id,
                format_after: data.format_after,
                evidence_after: data.evidence_after,
            }
        })



    }
    public update_evidence_after(evidenceId: any) {

        return this.http.put(AppService.base_url + AppService.grievance_evidence + '/' + evidenceId, {
            data: {
                evidence_after_name: null,
                evidence_after_id: null,
                format_after: null,
                evidence_after: false,
            }
        })



    }
    public delete_grievance_statement(stateID: any) {

        return this.http.delete(AppService.base_url + AppService.grievance_statement + '/' + stateID)
    }

    //Dashboard
    public get_grievance_data_dash(start: any, end: any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[reported_date][$gte]=' + start + '&filters[reported_date][$lte]=' + end + '&pagination[limit]=-1&sort[0]=id:desc')
    }
    public delete_grievance_evidence(id: any) {
        return this.http.delete(AppService.base_url + AppService.grievance_evidence + '/' + id)
    }
    public delete_committee_member(id: any) {
        return this.http.delete(AppService.base_url + AppService.grievance_commitee + '/' + id)
    }
    public delete_nominee(id: any) {
        return this.http.delete(AppService.base_url + AppService.grievance_nominee + '/' + id)
    }
    public delete_legal_advisor(id: any) {
        return this.http.delete(AppService.base_url + AppService.grievance_legal_advisor + '/' + id)
    }
    public delete_respondent(id: any) {
        return this.http.delete(AppService.base_url + AppService.grievance_respondent + '/' + id)
    }

    //#####################-> Dashboard Services
    generate_grievance_data(startDate: any, endDate: any, userDivision:any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[submission_date][$gte]=' + startDate + '&filters[submission_date][$lte]=' + endDate + '&' + userDivision +'&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }

    generate_grievance_data_division(startDate: any, endDate: any, division: any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[submission_date][$gte]=' + startDate + '&filters[submission_date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }

    generate_grievance_data_category(startDate: any, endDate: any, category: any, userDivision:any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[submission_date][$gte]=' + startDate + '&filters[submission_date][$lte]=' + endDate + '&filters[category]=' + category + '&' + userDivision + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }

    generate_grievance_data_division_category(startDate: any, endDate: any, division: any, category: any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[submission_date][$gte]=' + startDate + '&filters[submission_date][$lte]=' + endDate + '&filters[business_unit][division_uuid]=' + division + '&filters[category]=' + category + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }
    generate_grievance_data_year(startDate: any, endDate: any, year: any, userDivision:any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[submission_date][$gte]=' + startDate + '&filters[submission_date][$lte]=' + endDate + '&' + userDivision + '&filters[year]=' + year + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }

    generate_grievance_data_division_year(startDate: any, endDate: any, division: any, year: any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[submission_date][$gte]=' + startDate + '&filters[submission_date][$lte]=' + endDate + '&filters[year]=' + year + '&filters[business_unit][division_uuid]=' + division + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }

    generate_grievance_data_category_year(startDate: any, endDate: any, category: any, year: any, userDivision:any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[submission_date][$gte]=' + startDate + '&filters[submission_date][$lte]=' + endDate + '&filters[year]=' + year + '&' + userDivision + '&filters[category]=' + category + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }

    generate_grievance_data_division_category_year(startDate: any, endDate: any, division: any, category: any, year: any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[submission_date][$gte]=' + startDate + '&filters[submission_date][$lte]=' + endDate + '&filters[year]=' + year + '&filters[business_unit][division_uuid]=' + division + '&filters[category]=' + category + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }
    generate_grievance_year( year: any, userDivision:any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[year]=' + year + '&' + userDivision + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }
    generate_grievance_division( division: any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[business_unit][division_uuid]=' + division + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }
    generate_grievance_division_year( division: any, year:any) {
        return this.http.get(AppService.base_url + AppService.grievance + '?filters[business_unit][division_uuid]=' + division + '&filters[year]=' + year + '&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }



    // report

    public grievance_register_report_pdf(data:any){
            return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/grievance_register_report_pdf.pdf?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&division=' + data.division   + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail +'&company_name=' + data.company_name +'&type=' + data.type + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
         }
    
         public grievance_register_report_excel(data:any){
            return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/grievance_register_report_excel.xlsx?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&division=' + data.division +  '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail +'&company_name='+data.company_name + '&type=' + data.type +'&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
      
         }


         public grievance_register_report_pdf_2(data:any){
            return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/grievance_register_report_pdf.pdf?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date +   '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&company_name=' + data.company_name  + '&type=' + data.type +'&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
        }
    
         public grievance_register_report_excel_2(data:any){
            return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/grievance_register_report_excel.xlsx?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date +   '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail +'&company_name=' + data.company_name  + '&type=' + data.type + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
      
         }


         public grievance_individual_report(id: any): any{
            return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/grievance_individual_report_pdf.pdf?Grievance_ID=' + id + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
        
        }
}