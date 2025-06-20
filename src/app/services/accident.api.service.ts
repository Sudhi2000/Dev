import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AccidentService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }

    //get accidents
    public get_accidents(orgID: any) {
        return this.http.get(AppService.base_url + AppService.accident + '?filters[org_id]=' + orgID + '&pagination[limit]=-1&sort[0]=id:desc&publicationState=preview')
    }

    //get accident register
    public get_accident_register(orgID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.accident + '?filters[org_id]=' + orgID + '&populate[0]=assignee&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_periodic_division_accident_register(startDate: any, endDate: any, division: any, orgID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.accident + '?filters[org_id]=' + orgID + '&filters[accident_date][$gte]=' + startDate + '&filters[accident_date][$lte]=' + endDate + '&' + division + '&populate[0]=assignee&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_periodic_accident_register(startDate: any, endDate: any, orgID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.accident + '?filters[org_id]=' + orgID + '&filters[accident_date][$gte]=' + startDate + '&filters[accident_date][$lte]=' + endDate + '&populate[0]=assignee&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_periodic_accident_history(startDate: any, endDate: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.accident + '?filters[accident_date][$gte]=' + startDate + '&filters[accident_date][$lte]=' + endDate + '&' + division + '&populate[0]=assignee&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_division_accident_register(division: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.accident + '?' + division + '&populate[0]=disposals&populate=business_unit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_accident_unit_specific_register(orgID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.accident + '?filters[org_id]=' + orgID + '&' + division + '&populate[0]=assignee&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_accident_history(orgID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.accident + '?filters[org_id]=' + orgID + '&' + division + '&populate[0]=assignee&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }


    //get accident assigned
    // public get_accident_assigned(userID:any,odrgID:any){
    //     return this.http.get(AppService.base_url+AppService.accident+'?filters[assignee]='+userID+'&filters[org_id]='+odrgID+'&filters[resolution]=Open&populate[0]=reporter&populate[2]=investigation_teams&populate[1]=reporter.image&pagination[limit]=-1&sort[0]=id:desc')
    // }

    // public get_accident_assigned(userID: any, orgID: any,startIndex: number, pageSize: number) {
    //     return this.http.get(AppService.base_url + AppService.accident + '?filters[$or][0][investigation_teams][user_id][$eq]='+userID+'&filters[$or][1][assignee][id][$eq]='+userID+'&filters[$or][0][status][$eq]=Open&filters[$or][1][status][$eq]=In-Progress&filters[$or][2][status][$eq]=Under Investigation&populate=reporter&populate=investigation_teams&pagination[start]=' + startIndex + '&pagination[limit]='+ pageSize +'&sort[0]=id:desc')
    // }

    // public get_accident_assigned(userID: any, orgID: any,startIndex: number, pageSize: number) {
    //     return this.http.get(AppService.base_url + AppService.accident + '?filters[$and][0][investigation_teams][user_id][$notNull]&filters[$or][1][investigation_teams][user_id][$eq]='+userID+'&filters[$or][2][assignee][id][$eq]='+userID+'&filters[$or][0][status][$eq]=Open&filters[$or][1][status][$eq]=In-Progress&filters[$or][2][status][$eq]=Under Investigation&populate=reporter&populate=investigation_teams&pagination[start]=' + startIndex + '&pagination[limit]='+ pageSize +'&sort[0]=id:desc')
    // }

    public get_accident_assigned(userID: any, orgID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.accident + '?filters[$or][0][investigation_teams][user_id][$eq]=' + userID + '&filters[$or][1][assignee][id][$eq]=' + userID + '&filters[$and][0][resolution][$eq]=Open&filters[$and][1][status][$ne]=Draft&populate=reporter&populate=investigation_teams&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_accident_unit_specific_assigned(userID: any, orgID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.accident + '?' + division + '&filters[$or][0][investigation_teams][user_id][$eq]=' + userID + '&filters[$or][1][assignee][id][$eq]=' + userID + '&filters[$and][0][resolution][$eq]=Open&filters[$and][1][status][$ne]=Draft&populate=reporter&populate=investigation_teams&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    //get accident witness
    public get_accident_witness(accID: any) {
        return this.http.get(AppService.base_url + AppService.accident_witness + '?filters[accident]=' + accID + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    //get accident reference number
    public get_accident_reference(reference: any, orgID: any) {
        return this.http.get(AppService.base_url + AppService.accident + '?filters[reference_number]=' + reference + '&filters[org_id]=' + orgID + '&populate=reporter&populate=business_unit&populate=witnesses&populate=affected_individuals&populate=investigation_teams&populate=assignee&populate=accident_overviews&populate=root_causes&populate[0]=actions&populate[1]=actions.assignee&populate[2]=actions.corrective_action_evidences&populate[3]=actions.assignee.image&populate=expenses&populate=evidences')
    }
    public get_unit_specific_assignee(orgID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][org_id][$eq]=' + orgID + '&filters[$and][1][hse_head][$eq]=true&populate=divisions&' + division + '&filters[$and][2][user][blocked][$eq]=false&filters[$and][3][user][acc_inc_action][$eq]=true&pagination[limit]=-1&sort[0]=id:desc')
    }
    //create accident
    public create_accident(data: any) {
        return this.http.post(AppService.base_url + AppService.accident, {

            data: {
                reference_number: data.reference_number,
                accident_date: data.accident_date,
                accident_time: data.accident_time,
                severity: data.severity,
                division: data.division,
                department: data.department,
                location: data.location,
                supervisor_name: data.supervisor,
                reported_date: data.reported_date,
                assignee: data.assignee,
                org_id: data.org_id,
                evidence_type: data.evidence_type,
                evidence_name: data.evidence_name,
                evidence_id: data.evidence_id,
                reporter: data.reporter,
                injury: data.injury,
                category: data.category,
                sub_category: data.sub_category,
                accident_type: data.accident_type,
                affected_body_parts: data.affected_body_part,
                affected_primary_region: data.primary_body_part,
                affected_secondary_region: data.secondary_body_part,
                affected_tertiary_region: data.tertiary_body_part,
                injury_type: data.injury_type,
                injury_cause: data.injury_cause,
                consulted_hospital: data.hospital,
                consulted_doctor: data.doctor,
                time_of_work: data.time_of_work,
                return_for_work: data.return_of_work,
                status: data.status,
                assignee_notification: data.assignee_notification,
                group_notification: data.group_notification,
                resolution: data.resolution,
                work_performed: data.work_performed,
                description: data.description,
                action_taken: data.action_taken,
                consiquence_category: data.consiquence_category,
                return_for_work_hour: data.return_for_work_hour,
                return_for_work_min: data.return_for_work_min,
                business_unit: data.business_unit,





            }
        })
    }

    //create accident
    public create_accident_draft(data: any) {
        return this.http.post(AppService.base_url + AppService.accident, {
            data: {
                reference_number: data.reference_number,
                accident_date: data.accident_date,
                accident_time: data.accident_time,
                severity: data.severity,
                division: data.division,
                department: data.department,
                location: data.location,
                supervisor_name: data.supervisor,
                reported_date: data.reported_date,
                assignee: data.assignee,
                org_id: data.org_id,
                evidence_type: data.evidence_type,
                evidence_name: data.evidence_name,
                evidence_id: data.evidence_id,
                reporter: data.reporter,
                injury: data.injury,
                category: data.category,
                sub_category: data.sub_category,
                accident_type: data.accident_type,
                affected_body_parts: data.affected_body_part,
                affected_primary_region: data.primary_body_part,
                affected_secondary_region: data.secondary_body_part,
                affected_tertiary_region: data.tertiary_body_part,
                injury_type: data.injury_type,
                injury_cause: data.injury_cause,
                consulted_hospital: data.hospital,
                consulted_doctor: data.doctor,
                time_of_work: data.time_of_work,
                return_for_work: data.return_of_work,
                status: data.status,
                assignee_notification: data.assignee_notification,
                group_notification: null,
                resolution: data.resolution,
                work_performed: data.work_performed,
                description: data.description,
                action_taken: data.action_taken,
                consiquence_category: data.consiquence_category,
                return_for_work_hour: data.return_for_work_hour,
                return_for_work_min: data.return_for_work_min,
                business_unit: data.business_unit,




            }
        })
    }

    public create_corrective_evidence_after(data: any) {
        return this.http.post(AppService.base_url + AppService.corrective_evidence, {
            data: {
                evidence_after_name: data.evidence_after_name,
                format_after: data.format_after,
                evidence_id_after: data.id,
                accident: data.accident,
                accident_action: data.accident_action

            }
        })
    }
    public create_tertiary_part(data: any) {
        return this.http.post(AppService.base_url + AppService.tertiary_region, {
            data: {
                value: data.tertiary,
                filter: data.secondary,
                created_user: data.userID
            }
        })
    }
    public get_tertiary_part() {
        return this.http.get(AppService.base_url + AppService.tertiary_region + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public update_accident(data: any) {
        return this.http.put(AppService.base_url + AppService.accident + '/' + data.id, {
            data: {
                accident_date: data.accident_date,
                accident_time: data.accident_time,
                severity: data.severity,
                division: data.division,
                department: data.department,
                location: data.location,
                supervisor_name: data.supervisor,
                reported_date: data.reported_date,
                assignee: data.assignee,
                injury: data.injury,
                category: data.category,
                sub_category: data.sub_category,
                accident_type: data.accident_type,
                affected_body_parts: data.affected_body_part,
                affected_primary_region: data.primary_body_part,
                affected_secondary_region: data.secondary_body_part,
                affected_tertiary_region: data.tertiary_body_part,
                injury_type: data.injury_type,
                injury_cause: data.injury_cause,
                consulted_hospital: data.hospital,
                consulted_doctor: data.doctor,
                time_of_work: data.time_of_work,
                return_for_work: data.return_of_work,
                status: data.status,
                work_performed: data.work_performed,
                description: data.description,
                action_taken: data.action_taken,
                // assignee_notification: data.assignee_notification,
                group_notification: data.group_notification,
                consiquence_category: data.consiquence_category,
                return_for_work_hour: data.return_for_work_hour,
                return_for_work_min: data.return_for_work_min,
                business_unit: data.business_unit,




            }
        })
    }

    //create witness
    public create_witness(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.accident_witness, {
            data: {
                employee_id: data.employee_id,
                name: data.name,
                division: data.division,
                department: data.department,
                accident: id
            }
        })
    }

    // open ai
    public create_open_ai(data: any, completion_tokens: any, prompt_tokens: any, total_tokens: any) {
        return this.http.post(AppService.base_url + AppService.open_ai, {
            data: {
                module: 'Accident',
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

    //start progress
    public start_acc_progress(form: any, action: any) {
        return this.http.put(AppService.base_url + AppService.accident + '/' + form.id, {
            data: {
                status: 'In-Progress',
                investigation: action.investigation
            }
        })
    }

    //get person type
    public get_person_type() {
        return this.http.get(AppService.base_url + AppService.person_type + '?pagination[limit]=-1&sort[0]=id:desc')
    }


    //update action
    public update_action(general: any, action: any) {
        console.log(action)
        return this.http.put(AppService.base_url + AppService.accident + '/' + general.id, {
            data: {
                category: action.category,
                sub_category: action.sub_category,
                accident_type: action.accident_type,
                affected_body_parts: action.affected_body_part,
                affected_primary_region: action.primary_body_part,
                affected_secondary_region: action.secondary_body_part,
                affected_tertiary_region: action.tertiary_body_part,
                injury_type: action.injury_type,
                injury_cause: action.injury_cause,
                consulted_hospital: action.hospital,
                consulted_doctor: action.doctor,
                time_of_work: action.time_of_work,
                return_for_work: action.return_of_work,
            }

        })
    }

    //create accident individual
    public create_accident_individual(data: any, accID: any) {
        return this.http.post(AppService.base_url + AppService.accident_individual, {
            data: {
                person_type: data.person_type,
                employee_id: data.employee_id,
                person_name: data.person_name,
                gender: data.gender,
                age: data.age,
                date_of_join: data.date_of_join,
                employment_duration: data.employment_duration,
                industry_experience: data.industry_experience,
                designation: data.designation,
                accident: accID
            }
        })
    }

    //update accident individual
    public update_accident_individual(data: any) {
        return this.http.put(AppService.base_url + AppService.accident_individual + '/' + data.id, {
            data: {
                person_type: data.person_type,
                employee_id: data.employee_id,
                person_name: data.person_name,
                gender: data.gender,
                age: data.age,
                date_of_join: data.date_of_join,
                employment_duration: data.employment_duration,
                industry_experience: data.industry_experience,
                designation: data.designation
            }
        })
    }

    //delete accident individual
    public delete_accident_individual(id: any) {
        return this.http.delete(AppService.base_url + AppService.accident_individual + '/' + id)
    }

    //update completion without investigation
    public update_completion_status(data: any) {
        return this.http.put(AppService.base_url + AppService.accident + '/' + data.id, {
            data: {
                status: "Completed",
                resolution: "Completed",
                completed_notification: false
            }
        })
    }

    //get investigation team
    public create_investigation_team(accid: any, data: any) {
        return this.http.post(AppService.base_url + AppService.investigation_team, {
            data: {
                date: new Date(),
                name: data.attributes.first_name + ' ' + data.attributes.last_name,
                designation: data.attributes.designation,
                email: data.attributes.email,
                accident: accid,
                user_id: data.id
            }
        })
    }

    //delete investigation team
    public delete_investigation_team(id: any) {
        return this.http.delete(AppService.base_url + AppService.investigation_team + '/' + id)
    }

    //remove member list
    // public remove_member_list(id:any){
    //     return this.http.put(AppService.base_url+AppService.accident+'/'+id,{
    //         data:{
    //             team:null
    //         }
    //     })

    // }

    //remove member list
    // public update_member_list(id:any,memberID:any){
    //     return this.http.put(AppService.base_url+AppService.accident+'/'+id,{
    //         data:{
    //             team:memberID
    //         }
    //     })

    // }

    //get accident overview
    public get_accident_overview() {
        return this.http.get(AppService.base_url + AppService.accident_overview)
    }

    public update_accident_overview_events(overview: any, id: any) {
        return this.http.put(AppService.base_url + AppService.accident + '/' + id, {
            data: {
                accident_overviews: overview
            }

        })

    }

    public update_accident_root_cause(rootCause: any, id: any) {
        return this.http.put(AppService.base_url + AppService.accident + '/' + id, {
            data: {
                root_causes: rootCause
            }

        })
    }



    public update_accident_overview(id: any, overview: any, acident: any) {
        return this.http.put(AppService.base_url + AppService.accident + '/' + id, {
            data: {
                atmosphere_condition: overview.atmospere_condition,
                lightning_condition: overview.lighting_condition,
                work_surface_condition: overview.work_surface_condition,
                housekeeping_condition: overview.housekeeping_condition,
                damage: overview.damage,
                disease: overview.diseases,
                environmental: overview.environments,
                root_cause: acident.root_cause
            }

        })

    }

    public update_status(id: any, status: any) {
        return this.http.put(AppService.base_url + AppService.accident + '/' + id, {
            data: {
                status: status
            }
        })
    }

    public get_accident_root_cause() {
        return this.http.get(AppService.base_url + AppService.accident_root_cause + '?pagination[limit]=-1&sort[0]=id:ASC')
    }

    public create_corrective_action(data: any, accid: any, reference: any) {
        return this.http.post(AppService.base_url + AppService.corrective_action, {

            data: {
                action: data.action,
                due_date: data.dueDate,
                assignee: data.assignee,
                accident: accid,
                reference_number: reference
            }

        })
    }

    public update_training_details(data: any, accid: any) {
        return this.http.put(AppService.base_url + AppService.accident + '/' + accid, {
            data: {
                training: data.training,
                lesson: data.lesson
            }
        })
    }

    public create_accident_expense(data: any, accid: any) {
        return this.http.post(AppService.base_url + AppService.accident_expense, {
            data: {
                category: data.category,
                particular: data.particular,
                amount: data.amountVal,
                accident: accid
            }
        })
    }

    public update_accident_expense(data: any) {
        return this.http.put(AppService.base_url + AppService.accident_expense + '/' + data.id, {
            data: {
                category: data.category,
                particular: data.particular,
                amount: data.amountVal
            }
        })
    }

    public delete_accident_cost(data: any) {
        return this.http.delete(AppService.base_url + AppService.accident_expense + '/' + data.id)
    }

    public update_evidence_id(evID: any, data: any) {
        return this.http.put(AppService.base_url + AppService.accident_witness + '/' + evID, {
            data: {
                evidence_name: data.evidence_name,
                evidence_id: data.evidence_id
            }

        })
    }

    public update_gov_rep_date(date: any, id: any) {
        return this.http.put(AppService.base_url + AppService.accident + '/' + id, {
            data: {
                gov_reported_date: new Date(date)
            }
        })
    }

    public update_esi_rep_date(date: any, id: any) {
        return this.http.put(AppService.base_url + AppService.accident + '/' + id, {
            data: {
                esi_reported_date: date
            }
        })
    }

    public update_witness_statement_status(id: any, status: any) {
        return this.http.put(AppService.base_url + AppService.accident_witness + '/' + id, {
            data: {
                statement: status
            }
        })
    }

    public get_assigned_corrective_action(userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.corrective_action + '?filters[assignee]=' + userID + '&filters[status][$ne]=Completed&populate=assignee&populate=accident&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=due_date:ASC')
    }
    public get_corrective_action_register(userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.corrective_action + '?filters[assignee]=' + userID + '&populate=assignee&populate=accident&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=due_date:ASC')
    }


    public get_assigned_corrective_action_accref(accref: any) {
        return this.http.get(AppService.base_url + AppService.corrective_action + '?filters[accident]=' + accref + '&pagination[limit]=-1&sort[0]=due_date:ASC')
    }


    public get_assigned_corrective_action_id(id: any) {
        return this.http.get(AppService.base_url + AppService.corrective_action + '?filters[id]=' + id + '&populate=corrective_action_evidences&populate[0]=accident&populate[1]=accident.assignee&populate=assignee&populate=corrective_evidence')
    }
    public get_corrective_action_register_id(id: any) {
        return this.http.get(AppService.base_url + AppService.corrective_action + '?filters[id]=' + id + '&populate=corrective_action_evidences&populate[0]=accident&populate[1]=accident.assignee&populate=assignee&populate=corrective_evidence')
    }

    public update_action_status(data: any, status: any) {
        return this.http.put(AppService.base_url + AppService.corrective_action + '/' + data.id, {
            data: {
                status: status,
                completed_date: data.completed_date,
                notification: data.notification,
                action_taken: data.action_taken,
                user_remarks: data.user_remarks

            }
        })
    }
    public update_action_taken(data: any) {
        return this.http.put(AppService.base_url + AppService.corrective_action + '/' + data.id, {
            data: {
                // status: status,
                // completed_date: data.completed_date,
                // notification: data.notification,
                action_taken: data.action_taken,
                user_remarks: data.user_remarks
            }
        })
    }

    public create_accident_evidence(data: any) {
        return this.http.post(AppService.base_url + AppService.accident_evidence, {
            data: {
                evidence_name: data.evidence_name,
                format: data.format,
                accident: data.accident,
                image_id: data.id
            }
        })
    }

    public update_witness(data: any) {
        return this.http.put(AppService.base_url + AppService.accident_witness + '/' + data.id, {
            data: {
                employee_id: data.employee_id,
                name: data.name,
                division: data.division,
                department: data.department
            }
        })
    }

    public delete_witness(id: any) {
        return this.http.delete(AppService.base_url + AppService.accident_witness + '/' + id)
    }


    public getImage(imageUrl: string): Observable<Blob> {
        return this.http.get(imageUrl, { responseType: 'blob' });
    }

    public delete_accident_evidence(id: any) {
        return this.http.delete(AppService.base_url + AppService.accident_evidence + '/' + id)
    }
    public delete_corrective_evidence(id: any) {
        return this.http.delete(AppService.base_url + AppService.corrective_evidence + '/' + id)
    }


    public get_accident_individual(accID: any) {
        return this.http.get(AppService.base_url + AppService.accident_individual + '?filters[accident]=' + accID + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_evidence_reference_number(reference: any) {
        return this.http.get(AppService.base_url + AppService.accident_evidence + '?filters[accident][reference_number]=' + reference + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    public update_accident_cost(cost: any, id: any) {
        return this.http.put(AppService.base_url + AppService.accident + '/' + id, {
            data: {
                amount: cost
            }
        })
    }

    public accident_report(id: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_accident_report_v1.pdf?Accident_ID=' + id + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public update_return_date(id: any, return_date: any, returnHours: any) {
        return this.http.put(AppService.base_url + AppService.accident + '/' + id, {
            data: {
                return_date: return_date,
                return_for_work: returnHours
            }
        })
    }

    //get report
    public accident_register_report(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report.pdf?accident_date_start=' + data.start_date + '&accident_date_end=' + data.end_date + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public accident_register_report_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report_excel.xlsx?accident_date_start=' + data.start_date + '&accident_date_end=' + data.end_date + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public accident_register_report_2(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report.pdf?accident_date_start=' + data.start_date + '&accident_date_end=' + data.end_date + '&division=' + data.division + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public accident_register_report_excel_2(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report_excel.xlsx?accident_date_start=' + data.start_date + '&accident_date_end=' + data.end_date + '&division=' + data.division + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public accident_register_report_3(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report.pdf?year=' + data.year + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public accident_register_report_excel_3(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report_excel.xlsx?year=' + data.year + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public accident_register_report_4(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report.pdf?year=' + data.year + '&month=' + data.month + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public accident_register_report_excel_4(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report_excel.xlsx?year=' + data.year + '&month=' + data.month + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }


    public accident_register_report_5(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report.pdf?year=' + data.year + '&division=' + data.division + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public accident_register_report_excel_5(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report_excel.xlsx?year=' + data.year + '&division=' + data.division + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public accident_register_report_6(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report.pdf?year=' + data.year + '&month=' + data.month + '&division=' + data.division + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public accident_register_report_excel_6(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report_excel.xlsx?year=' + data.year + '&month=' + data.month + '&division=' + data.division + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public accident_register_report_7(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report.pdf?month=' + data.month + '&division=' + data.division + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public accident_register_report_excel_7(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report_excel.xlsx?month=' + data.month + '&division=' + data.division + '&address=' + data.address + '&default_date=' + data.defualt_date + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }



    // public accident_register_report(data: any): any {
    //     return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/consolidated_accident_overview_report.pdf?accident_date_start=' + data.start_date + '&accident_date_end='+data.end_date+'&year='+data.year+'&month='+data.month+'&division='+data.division+'&address='+data.address+'&default_date='+data.defualt_date+ '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    // }


    //############### dashboard Apis

    public get_dash_accidents_all(userDivision: any) {
        return this.http.get(AppService.base_url + AppService.accident + '?' + userDivision + '&populate=expenses&populate=business_unit&populate=affected_individuals&populate=root_causes&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_dash_accidents(start: any, end: any, userDivision: any) {
        return this.http.get(AppService.base_url + AppService.accident + '?filters[accident_date][$gte]=' + start + '&filters[status][$ne]=Draft&filters[accident_date][$lte]=' + end + '&' + userDivision + '&populate=expenses&populate=affected_individuals&populate=business_unit&populate=root_causes&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_dash_accidents_division(start: any, end: any, division: any) {
        return this.http.get(AppService.base_url + AppService.accident + '?filters[accident_date][$gte]=' + start + '&filters[status][$ne]=Draft&filters[accident_date][$lte]=' + end + '&filters[business_unit][division_uuid]=' + division + '&populate=expenses&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }


}