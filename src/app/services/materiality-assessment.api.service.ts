import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { forkJoin, map, Observable, tap } from 'rxjs';
import { AppsModule } from '../apps/apps.module';
import { AppService } from './app.service';

@Injectable({
    providedIn: 'root'
})
export class MaterialityService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }

    public get_stake_holder_history(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.materiality_stake_holders + '?pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_topic_history(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.materiality_topic + '?pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_survey_history(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.materiality_survey + '?pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc' + '&populate=*')
    }
    public get_surveys() {
        return this.http.get(AppService.base_url + AppService.materiality_survey)
    }
    public get_topics() {
        return this.http.get(AppService.base_url + AppService.materiality_topic)
    }
    public get_topics_framework_industry(framework: any, industry: any) {
        return this.http.get(AppService.base_url + AppService.materiality_topic + '?filters[framework]=' + framework + '&filters[industry]=' + industry)
    }
    public get_topics_framework(framework: any) {
        return this.http.get(AppService.base_url + AppService.materiality_topic + '?filters[framework]=' + framework)
    }
    public get_topics_industry(industry: any) {
        return this.http.get(AppService.base_url + AppService.materiality_topic + '?filters[industry]=' + industry + '&pagination[limit]=-1')
    }
    public create_stake_holder(data: any, id: any, reporter: any) {
        return this.http.post(AppService.base_url + AppService.materiality_stake_holders, {
            data: {
                full_name: data.full_name,
                role: data.role,
                email_id: data.email_id,
                category: data.category,
                organisation: data.organisation,
                external: data.external,
                contact: data.contact,
                created_user: reporter,
                created_date: new Date(),
                materiality_survey: id,
                to_email: data.email_id
            }
        })
    }
    public create_topic(data: any) {
        return this.http.post(AppService.base_url + AppService.materiality_topic, {
            data: {
                topic: data.topic,
                industry: data.industry,
                framework: data.framework,
                category: data.category,
                sub_topic: data.sub_topic,
                individual_topic: data.individual_topic,
                stakeholder_category: data.stakeholder_category,
                stakeholder_type: data.stakeholder_type,
            }
        })
    }
public update_topic(data: any) {
        return this.http.put(AppService.base_url + AppService.materiality_topic + '/' + data.id, {
            data: {
                topic: data.topic,
                industry: data.industry,
                framework: data.framework,
                category: data.category,
                sub_topic: data.sub_topic,
                individual_topic: data.individual_topic,
                stakeholder_category: data.stakeholder_category,
                stakeholder_type: data.stakeholder_type,
            }
        })
    }

    public schedule_survey(data: any) {
        return this.http.post(AppService.base_url + AppService.materiality_survey, {
            data: {
                email_subject: data.email_subject,
                headline: data.headline,
                content: data.content,
                start_date: data.start_date,
                end_date: data.end_date,
                status: data.status,
                reference_id: data.reference_id,
                reference_number: data.reference_number,
                created_user: data.reporter,
                industry: data.industry,
                framework: data.framework,
                created_date: new Date(),
            }
        })
    }
    public create_survey_topic(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.materiality_survey_topic, {
            data: {
                industry: data.attributes.industry,
                framework: data.attributes.framework,
                topic: data.attributes.topic,
                sub_topic: data.attributes.sub_topic,
                category: data.attributes.category,
                position: data.slNo,
                materiality_survey: id
            }
        })
    }

    public get_industry() {
        return this.http.get(AppService.base_url + AppService.industry + '?pagination[limit]=-1')
    }

    public create_industry(data: any) {
        return this.http.post(AppService.base_url + AppService.industry, {
            data: {
                value: data.value,
                created_By: data.id
            }
        })
    }

    public update_industry(data: any, id: any) {
        return this.http.put(AppService.base_url + AppService.industry + '/' + id, {
            data: {
                value: data.value,
            }
        })
    }

    public delete_industry(id: any) {
        return this.http.delete(AppService.base_url + AppService.industry + '/' + id)
    }

    public get_framework() {
        return this.http.get(AppService.base_url + AppService.framework + '?pagination[limit]=-1')
    }

    public create_framework(data: any) {
        return this.http.post(AppService.base_url + AppService.framework, {
            data: {
                value: data.value,
                industry: data.industry,
                created_By: data.id
            }
        })
    }

    public update_framework(data: any, id: any) {
        return this.http.put(AppService.base_url + AppService.framework + '/' + id, {
            data: {
                value: data.value,
            }
        })
    }

    public delete_framework(id: any) {
        return this.http.delete(AppService.base_url + AppService.framework + '/' + id)
    }

    public get_category() {
        return this.http.get(AppService.base_url + AppService.category + '?pagination[limit]=-1')
    }

    public create_category(data: any) {
        return this.http.post(AppService.base_url + AppService.category, {
            data: {
                value: data.value,
                created_By: data.id
            }
        })
    }

    public update_category(data: any, id: any) {
        return this.http.put(AppService.base_url + AppService.category + '/' + id, {
            data: {
                value: data.value,
            }
        })
    }

    public delete_category(id: any) {
        return this.http.delete(AppService.base_url + AppService.category + '/' + id)
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

    //get materiality assesment survey content by id

    public get_materiality_survey(id: any): Observable<{ data: any[] }> {
        return this.http.get<{ data: any[] }>(
          `${AppService.base_url}${AppService.materiality_survey}?filters[reference_id]=${id}&populate=*`
        );
      }
      
    // public get_materiality_survey(id: any) {
    //     return this.http.get(AppService.base_url + AppService.materiality_survey + '?filters[reference_id]=' + id + '&populate=*')
    // }

    // create new stakeholder
    public create_new_stakeholder(data: any, surveyId: any) {
        return this.http.post(AppService.base_url + AppService.materiality_stake_holders, {
            data: {
                full_name: data.full_name,
                role: data.role,
                email_id: data.email_id,
                external: data.external,
                category: data.category,
                organisation: data.organisation,
                materiality_survey: surveyId,
                created_date: new Date(),
                created_user: data.created_user,
                contact: data.contact,
            }
        })
    }

    public update_stakeholder(data: any) {
        return this.http.put(AppService.base_url + AppService.materiality_stake_holders + '/' + data.id, {
            data: {
                full_name: data.full_name,
                role: data.role,
                email_id: data.email_id,
                external: data.external,
                category: data.category,
                organisation: data.organisation,
                modified_date: new Date(),
                modified_user: data.created_user,
                contact: data.contact,
            }
        })
    }
    public delete_stakeholder(data: any) {
        return this.http.delete(AppService.base_url + AppService.materiality_stake_holders + '/' + data.id)
    }

    public update_survey(data: any) {
        return this.http.put(AppService.base_url + AppService.materiality_survey + '/' + data.id, {
            data: {
                start_date: data.start_date,
                end_date: data.end_date,
                email_subject: data.email_subject,
                headline: data.headline,
                content: data.content,
                status:data.status
            }
        })
    }

    public delete_materiality_survey_topic(data: any) {
        return this.http.delete(AppService.base_url + AppService.materiality_survey_topic + '/' + data.id)
    }

    public create_materiality_survey_topic(data: any, surveyId: any) {
        return this.http.post(AppService.base_url + AppService.materiality_survey_topic, {
            data: {
                topic: data.attributes.topic,
                sub_topic: data.attributes.sub_topic,
                industry: data.attributes.industry,
                framework: data.attributes.framework,
                position: 1,
                materiality_survey: surveyId,
                category: data.attributes.category,

            }
        })
    }

    public get_topic_survey(): Observable<any[]> {
        return this.http.get<{ data: any[] }>(`${AppService.base_url}${AppService.materiality_survey_topic}`).pipe(
          tap((response: { data: any[] }) => console.log('Raw API Response:', response)),
          map((response: { data: any[] }) =>
            response.data.map((item: { id: number; attributes: any }) => ({
              id: item.id,
              topic: item.attributes.topic,
              position: item.attributes.position // Ensure the position field exists
            }))
          )
        );
      }
      
    public update_topics(topics: any[]) {
        const requests = topics.map((topic, index) => {
          return this.http.put(AppService.base_url + AppService.materiality_survey_topic + '/' + topic.id, {
            data: {
              position: index + 1,  // Update position based on new order
            }
          });
        });
      
        return forkJoin(requests); // Wait for all requests to complete
      }

      public create_materiality_survey_subtopic(data: any) {
        return this.http.post(AppService.base_url + AppService.materiality_survey_subtopic, {
            data: {
                value:data.value,
                filter:data.filter

            }
        })
    }

    public create_materiality_survey_individualtopic(data: any) {
        return this.http.post(AppService.base_url + AppService.materiality_survey_individualtopic, {
            data: {
                value:data.value,
                filter:data.filter

            }
        })
    }

    public get_materiality_subtopic() {
        return this.http.get(AppService.base_url + AppService.materiality_survey_subtopic + '?pagination[limit]=-1')
    }

    public get_materiality_individualtopic() {
        return this.http.get(AppService.base_url + AppService.materiality_survey_individualtopic + '?pagination[limit]=-1')
    }

    public get_materiality_stakeholder() {
        return this.http.get(AppService.base_url + AppService.materiality_stake_holders)
    }
      
    //get survey details
    public get_materiality_public_survey(id:any) {
        return this.http.get(AppService.base_url + AppService.get_materiality_survey_details + '?id=' + id)
    }

    // attend survey
    public create_materiality_survey(data: any) {
        
        return this.http.post(AppService.base_url + AppService.create_survey_list, {
            data: {
                materiality_survey:data.materiality_survey,
                materiality_topic:data.topic,
                materiality_subtopic:data.sub_topic,
                impact_materiality_value:data.impactMateriality,
                financial_materiality_value:data.financialMateriality,
                total_value:data.average,
                category:data.category,
                stakeholder:data.email

            }
        })
    }

    get_survey_list(refId:any){
        return this.http.get(AppService.base_url + AppService.create_survey_list + '?filters[materiality_survey][reference_id]=' + refId)
    }

    get_stakeholder_list(refId:any){
        return this.http.get(AppService.base_url + AppService.materiality_stake_holders + '?filters[materiality_survey][reference_id]=' + refId)

    }

    // verify_materiality_email
    verify_materiality_email(data:any){
        return this.http.post(AppService.base_url + AppService.verify_materiality_email,data)
    }

    verify_materiality_email_otp(data:any){
        return this.http.post(AppService.base_url + AppService.verify_materiality_email_otp,data)
    }
}