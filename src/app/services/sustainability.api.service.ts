import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SustainabilityService extends AppService {

    token: string

    constructor(private http: HttpClient) {
        super();
    }
    public get_sustainability_register(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.sustainability + `?pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`)
    }
    public get_unit_specific_sustainability_register(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.sustainability + '?' + division + `&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`)
    }
    public get_sustainability_register_count() {
        return this.http.get(AppService.base_url + AppService.sustainability + '?pagination[limit]=-1&sort[0]=id:desc&publicationState=preview')
    }


    public get_alignment_sdg() {
        return this.http.get(AppService.base_url + AppService.alignment_sdg + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_impact_types() {
        return this.http.get(AppService.base_url + AppService.impact_types + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_impact_details_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.sustainability_impact + '?filters[sustainability][id][$eq]=' + reference + '&populate=impacts&pagination[limit]=-1&sort[0]=id:desc')
    }
    //create activity
    public report_activity(data: any) {
        return this.http.post(AppService.base_url + AppService.sustainability, {
            data: {
                reported_date: new Date(),
                reference_number: data.reference_number,
                title: data.title,
                SDG: data.sdg,
                division: data.division,
                material_type: data.materialityType,
                material_issue: data.materialityIssue,
                pillars: data.pillar,
                organiser: data.organiser,
                status: data.status,
                volunteers_num: data.volunteers,
                alignment_SDGs: data.alignment_sdg,
                additional_SDGs: data.additional_sdg,
                created_user: data.reporter,
                priority_desc: data.priority_desc,
                start_timeline: data.start_timeline,
                end_timeline: data.end_timeline,
                contributing_desc: data.contributing_desc,
                location: data.location,
                business_units: data.business_unit,
                gri_standard: data.gri_standard
                // image:data.image,
                // test_value:data.impact_value,
                // impact_type:data.impact_type,
                // impact_unit:data.impact_unit
            }
        })
    }

    //create impact
    public create_impact(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.sustainability_impact, {
            data: {
                value: data.impact_value,
                type: data.impact_type,
                unit: data.impact_unit,
                sustainability: id,
            }
        })
    }
    public create_impact_type(data: any) {
        return this.http.post(AppService.base_url + AppService.impact_types, {
            data: {
                value: data.name,
                impact_unit: data.impact_unit,
                created_user: data.created_user,
            }
        })
    }
    public update_impact(data: any) {
        console.log(data)
        return this.http.put(AppService.base_url + AppService.sustainability_impact + '/' + data.id, {
            data: {
                value: data.impact_value,
                type: data.impact_type,
                unit: data.impact_unit,
                //sustainability: id,
            }
        })
    }
    public delete_impact(id: any) {
        return this.http.delete(AppService.base_url + AppService.sustainability_impact + '/' + id)
    }
    public get_sustainability_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.sustainability + '?filters[reference_number][$eq]=' + reference)
    }
    //get sustainability details
    public get_sustainability_details(orgID: any, reference: any) {
        return this.http.get(AppService.base_url + AppService.sustainability + '?filters[id][$eq]=' + reference + '&populate=impacts&populate=business_units&populate=evidences')
    }

    //update an activity
    public update_activity(data: any) {
        return this.http.put(AppService.base_url + AppService.sustainability + '/' + data.id, {
            data: {
                title: data.title,
                start_timeline: data.start_timeline,
                organiser: data.organiser,
                volunteers_num: data.volunteers,
                priority_desc: data.priority_desc,
                contributing_desc: data.contributing_desc,
                material_type: data.materialityType,
                material_issue: data.materialityIssue,
                pillars: data.pillars,
                SDG: data.sdg,
                additional_SDGs: data.additionalSdgs,
                alignment_SDGs: data.alignment_sdg,
                end_timeline: data.end_timeline,
                status: data.status,
                location: data.location,
                gri_standard: data.gri_standard,
                division: data.division,
                business_units: data.business_unit


            }
        })
    }

    //add evidence
    public create_evidence(data: any) {
        console.log(data)
        return this.http.post(AppService.base_url + AppService.sustainability_evidence, {
            data: {
                evidence_name: data.evidence_name,
                format: data.format,
                image_id: data.id,
                sustainability: data.sustainability,
                url: data.url
            }
        })
    }

    //delete evidence
    public delete_evidence(evID: any) {
        return this.http.delete(AppService.base_url + AppService.sustainability_evidence + '/' + evID)
    }

    //mark as completed
    public completed(susID: any) {
        return this.http.put(AppService.base_url + AppService.sustainability + '/' + susID, {
            data: {
                status: "Congratulations"
            }
        })
    }

    //print sustainability report
    public sustainability_report(referenceNumber: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_sdg_report.pdf?referenceNumber=' + referenceNumber + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }
    public get_gri_standards() {
        return this.http.get(AppService.base_url + AppService.gri_standard + '?pagination[limit]=-1&sort[0]=id:desc&populate=dropdown_values')
    }
}