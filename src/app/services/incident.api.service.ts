import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class IncidentService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }

    //created incident
    public create_incident(data: any) {
        return this.http.post(AppService.base_url + AppService.incident, {
            data: {
                reference_number: data.reference_number,
                reported_date: data.reported_date,
                reported_time: new Date(),
                incident_date: data.incident_date,
                incident_time: data.incident_time,
                division: data.division,
                location: data.location,
                description: data.description,
                circumstances: data.circumstances,
                severity: data.severity,
                status: data.status,
                resolution: data.resolution,
                assignee_notification: data.assignee_notification,
                assignee: data.assignee,
                createdUser: data.createdUser,
                group_notification:data.group_notification,
                business_unit:data.business_unit,
                type_of_near_miss:data.type_of_near_miss,
                type_of_concern:data.type_of_concern,
                factors:data.factors,
                causes:data.causes
 
            }
        })
    }

    //get incidents
    public get_incident() {
        return this.http.get(AppService.base_url + AppService.incident + '?populate[0]=assignee&populate[1]=assignee.image&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_incidents(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.incident + '?populate[0]=assignee&pagination[start]=' + startIndex + '&pagination[limit]='+ pageSize +'&sort[0]=id:desc')
    }
    
    public get_periodic_incident_register(startDate: any, endDate: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.incident +'?filters[incident_date][$gte]=' + startDate + '&filters[incident_date][$lte]=' + endDate + '&populate[0]=assignee&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_incident_history( startIndex: number, pageSize: number, division:any) {
        return this.http.get(AppService.base_url + AppService.incident   +  '?' + division+ '&populate[0]=assignee&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_periodic_incident_history(startDate: any, endDate: any,startIndex: number, pageSize: number, division:any) {
        return this.http.get(AppService.base_url + AppService.incident  +'?filters[incident_date][$gte]=' + startDate + '&filters[incident_date][$lte]=' + endDate +'&'+ division + '&populate[0]=assignee&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_division_incident_register(division:any,startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.incident + '?'+division+ '&populate[0]=disposals&populate=business_unit&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_periodic_division_incident_register(startDate: any, endDate: any,division:any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.incident  +'?filters[incident_date][$gte]=' + startDate + '&filters[incident_date][$lte]=' + endDate  + '&'+division+ '&populate[0]=assignee&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_incidents(startIndex: number, pageSize: number,division:any) {
        return this.http.get(AppService.base_url + AppService.incident +  '?'+ division + '&populate[0]=assignee&pagination[start]=' + startIndex + '&pagination[limit]='+ pageSize +'&sort[0]=id:desc')
    }

    public get_incident_assigned(userID: any,startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.incident + '?filters[assignee]=' + userID  + '&filters[status]=Open&populate[0]=createdUser&pagination[start]=' + startIndex + '&pagination[limit]='+ pageSize +'&sort[0]=id:desc')
    }
    public get_incident_unit_specific_assigned(userID: any,startIndex: number, pageSize: number,division:any) {
        return this.http.get(AppService.base_url + AppService.incident + '?filters[assignee]=' + userID + '&' + division + '&filters[status]=Open&populate[0]=createdUser&pagination[start]=' + startIndex + '&pagination[limit]='+ pageSize +'&sort[0]=id:desc')
    }
    public get_unit_specific_assignee(orgID: any,division:any) {        
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][org_id][$eq]='+orgID+'&filters[$and][1][hse_head][$eq]=true&populate=divisions&'+division+'&filters[$and][2][user][blocked][$eq]=false&filters[$and][3][user][acc_inc_action][$eq]=true&pagination[limit]=-1&sort[0]=id:desc')
    }
    //create witness
    public create_witness(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.accident_witness, {
            data: {
                employee_id: data.employee_id,
                name: data.name,
                division: data.division,
                department: data.department,
                incident: id
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
                incident: accID
            }
        })
    }

    public create_accident_evidence(data: any) {
        return this.http.post(AppService.base_url + AppService.accident_evidence, {
            data: {
                evidence_name: data.evidence_name,
                format: data.format,
                incident: data.accident,
                image_id: data.id,
                evidence_after:data.evidence_after
            }
        })
    }

    public update_incident_evidence(data:any){
        return this.http.put(AppService.base_url+AppService.accident_evidence+'/'+data.id,{
            data:{
                evidence_after_name:data.evidence_name,
                format_after:data.format,
                image_id_after:data.img_id
            }
        })
    }

    public incident_report(id: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_incident_report.pdf?Incident_ID=' + id + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    //get accident reference number
    public get_incident_reference(reference: any, orgID: any) {
        return this.http.get(AppService.base_url + AppService.incident + '?filters[reference_number]=' + reference+ '&populate=createdUser&populate=business_unit&populate=witnesses&populate=individuals&populate=assignee&populate=evidences')
    }


    public delete_witness(id: any) {
        return this.http.delete(AppService.base_url + AppService.accident_witness + '/' + id)
    }

    //get accident witness
    public get_incident_witness(accID:any) {
        return this.http.get(AppService.base_url + AppService.accident_witness + '?filters[incident]='+accID+'&pagination[limit]=-1&sort[0]=id:desc')
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

    public get_accident_individual(accID:any){
        return this.http.get(AppService.base_url+AppService.accident_individual+'?filters[incident]='+accID+'&pagination[limit]=-1&sort[0]=id:desc')
    }

    public delete_accident_evidence(id:any){
        return this.http.delete(AppService.base_url+AppService.accident_evidence+'/'+id)
    }

    public update_accident(data: any) {
        return this.http.put(AppService.base_url + AppService.incident+'/'+data.id, {
            data: {
                reported_date: data.reported_date,
                reported_time: new Date(),
                incident_date: data.incident_date,
                incident_time: data.incident_time,
                division: data.division,
                location: data.location,
                description: data.description,
                circumstances: data.circumstances,
                severity: data.severity,
                status: data.status,
                resolution: data.resolution,
                assignee_notification: data.assignee_notification,
                assignee: data.assignee,
                createdUser: data.createdUser,
                group_notification:data.group_notification,
                business_unit:data.business_unit,
                type_of_near_miss:data.type_of_near_miss,
                type_of_concern:data.type_of_concern,
                factors:data.factors,
                causes:data.causes

            }
        })
    }


    public getImage(imageUrl: string): Observable<Blob> {
        return this.http.get(imageUrl, { responseType: 'blob' });
    }

    public complete_incident(data:any){
        return this.http.put(AppService.base_url+AppService.incident+'/'+data.id,{
            data:{
                severity_impact:data.severityImpact,
                updated_date:new Date(),
                updated_time:new Date(),
                updatedUser:data.updatedUser,
                status:"Completed",
                resolution:"Completed",
                treatment_post_incident:data.TreatmentPostIncident,
                post_analysis_incident:data.PostAnalysisIncident
            }
        })
        
    }

    public get_dash_incidents_all(userDivision:any) {
        return this.http.get(AppService.base_url + AppService.incident  +  '?'+ userDivision + '&populate=business_unit&filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_dash_incidents(start: any, end: any,userDivision:any) {
        return this.http.get(AppService.base_url + AppService.incident + '?filters[incident_date][$gte]=' + start + '&filters[incident_date][$lte]=' + end + '&'+ userDivision + '&filters[status][$ne]=Draft&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_dash_incidents_division(start: any, end: any, division: any) {
        return this.http.get(AppService.base_url + AppService.incident + '?filters[incident_date][$gte]=' + start + '&filters[status][$ne]=Draft&filters[incident_date][$lte]=' + end + '&filters[business_unit][division_uuid]=' + division + '&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }














}