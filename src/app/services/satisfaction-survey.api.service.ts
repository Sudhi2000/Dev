import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { map, Observable, switchMap } from 'rxjs';
import { AppsModule } from '../apps/apps.module';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SatisfactionService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }

    public create_survey_question_image(data: any) {
        return this.http.post(AppService.base_url + AppService.ques_image, {
            data: {
                image_name: data.image_name,
                format: data.format,
                image_id: data.id,
                survey_question: data.question,

            }
        })
    }
    public get_survey_categories(){    
        return this.http.get(AppService.base_url+AppService.survey_categories+'?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_survey_question_categories(){
        return this.http.get(AppService.base_url+AppService.survey_question_categories+'?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_survey_purposes(){
        return this.http.get(AppService.base_url+AppService.survey_purposes+'?pagination[limit]=-1&sort[0]=id:desc')
    }
    public create_survey_category(data: any) {
        return this.http.post(AppService.base_url + AppService.survey_categories, { 
            data: {
                value: data.value,
                created_user: data.id
            }
        })
    }
    public create_survey_purpose(data: any) {
        return this.http.post(AppService.base_url + AppService.survey_purposes, { 
            data: {
                value: data.value,
                created_user: data.id
            }
        })
    }
    public update_survey_purpose(data: any,id:any) {
        return this.http.put(AppService.base_url + AppService.survey_purposes + '/' + id, { 
            data: {
                value: data.value,
            }
        })
    }
    public update_survey_category(data: any,id:any) {
        return this.http.put(AppService.base_url + AppService.survey_categories + '/' + id, { 
            data: {
                value: data.value,
            }
        })
    }
     public delete_survey_category(id:any) {
            return this.http.delete(AppService.base_url + AppService.survey_categories + '/' + id)
        }
     public delete_survey_purpose(id:any) {
            return this.http.delete(AppService.base_url + AppService.survey_purposes + '/' + id)
        }
    public create_survey_question_category(data: any) {
        return this.http.post(AppService.base_url + AppService.survey_question_categories, { 
            data: {
                value: data.value,
                filter: data.filter,
                created_user: data.id
            }
        })
    }
    public update_survey_question_category(data: any,id:any) {
        return this.http.put(AppService.base_url + AppService.survey_question_categories + '/' + id, { 
            data: {
                value: data.value,
            }
        })
    }
     public delete_survey_question_category(id:any) {
            return this.http.delete(AppService.base_url + AppService.survey_question_categories + '/' + id)
        }
    public create_survey_question(data: any) {
        return this.http.post(AppService.base_url + AppService.survey_question, {
            data: {
                created_date: [new Date()],
                reference_number: data.reference_number,
                survey_category: data.category,
                question_category: data.question_category,
                tags: data.tags,
                question_type: data.question_type,
                question: data.question,
                response_options: data.response_options,
                status: data.status,
                question_weighting: data.question_weighting,
                multiplechoice_options: data.multiplechoice_options,
                created_user: data.created_user,
            }
        })
    }

    public create_survey_question_multilanguage(data: any, saved: any, id: any) {

        return this.http.post(
            AppService.base_url + AppService.survey_question + '/' + id + '/' + AppService.localizations,
            {
                locale: data.language_locale,
                createdAt: saved.createdAt,
                multiplechoice_options: saved.multiplechoice_options,
                publishedAt: saved.publishedAt,
                question: data.question,
                question_category: saved.question_category,
                question_type: saved.question_type,
                question_weighting: saved.question_weighting,
                reference_number: saved.reference_number,
                response_options: saved.response_options,
                status: saved.status,
                survey_category: saved.survey_category,
                tags: saved.tags,
                created_user: saved.created_user,
            }
        );

    }
    public add_survey_question(data: any, saved: any) {

        return this.http.post(
            AppService.base_url + AppService.survey_question + '/' + saved.id + '/' + AppService.localizations,
            {
                locale: data.language_locale,
                createdAt: saved.createdAt,
                multiplechoice_options: saved.multiplechoice_options,
                publishedAt: saved.publishedAt,
                question: data.question,
                question_category: saved.question_category,
                question_type: saved.question_type,
                question_weighting: saved.question_weighting,
                reference_number: saved.reference_number,
                response_options: saved.response_options,
                survey_category: saved.survey_category,
                tags: saved.tags,
                created_user: saved.created_user,
            }
        );

    }

    public update_survey_question_multilanguage(data: any, saved: any, id: any) {
        return this.http.put(
            AppService.base_url + AppService.survey_question + '/' + id,
            {
                data: {
                    question: data.question,
                }
            }
        );

    }

    public update_language(data: any, localizationId: any) {

        return this.http.put(
            AppService.base_url + AppService.survey_question + '/' + localizationId,
            {
                data: {
                    question: data.question,
                }
            }
        );

    }

    public deleteLocalization(surveyQuestionId: any, localizationId: any) {
        return this.http.delete(AppService.base_url + AppService.survey_question + '/' + localizationId)// + '/' + AppService.localizations + '/' + localizationId)
        //return this.http.delete(AppService.base_url + AppService.survey_question + '/' + surveyQuestionId + '?locale=' + localizationId)
    }

    // public create_survey_question(data: any): Observable<any> {
    //     const apiUrl = AppService.base_url + AppService.survey_question;

    //     // Data for the English entry
    //     const englishData = {
    //         created_date: [new Date()],
    //         reference_number: data.reference_number,
    //         survey_category: data.category,
    //         question_category: data.question_category,
    //         tags: data.tags,
    //         question_type: data.question_type,
    //         question: data.question,
    //         response_options: data.response_options,
    //         status: data.status,
    //         question_weighting: data.question_weighting,
    //         multiplechoice_options: data.multiplechoice_options,
    //         created_user: data.created_user,
    //         business_unit: data.business_unit,
    //     };

    //     return this.http.post(apiUrl, { data: englishData }).pipe(
    //         switchMap((englishResponse: any) => {

    //             const bnBdData = {
    //                 ...englishData,  
    //                 _locale: 'bn-BD', 
    //             };

    //             return this.http.post(apiUrl, { data: bnBdData });
    //         })
    //     );
    // }

    public update_survey_question(data: any) {
        return this.http.put(AppService.base_url + AppService.survey_question + '/' + data.id, {
            data: {
                reference_number: data.reference_number,
                survey_category: data.category,
                question_category: data.question_category,
                tags: data.tags,
                question_type: data.question_type,
                question: data.question,
                response_options: data.response_options,
                status: data.status,
                question_weighting: data.question_weighting,
                multiplechoice_options: data.multiplechoice_options,
                created_user: data.created_user,
            }
        })
    }
    public sendParticipantReminder(participantiID: any) {
        return this.http.put(AppService.base_url + AppService.survey_participants + '/' + participantiID, {
            data: {
                participant_reminder:false,
            }
        })
    }

    //get question
    public get_question_history(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.survey_question + '?populate=*' + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_unit_specific_question_history(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.survey_question + '?populate=*' + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_unit_specific_question_history_search(reference: any, division: any) {
        return this.http.get(AppService.base_url + AppService.survey_question + '?filters[question_category]=' + reference + '&populate=*&sort[0]=id:desc')
    }

    public get_question_history_search(reference: any) {
        return this.http.get(AppService.base_url + AppService.survey_question + '?filters[question_category]=' + reference + '&populate=*&sort[0]=id:desc')
    }

    //get question details
    public get_questions_details(reference: any) {
        return this.http.get(AppService.base_url + AppService.survey_question + '?filters[reference_number]=' + reference + '&populate=*')
        // return this.http.get(AppService.base_url + AppService.survey_question + '?filters[reference_number]=' + reference + '&locale=' + language + '&populate=*')
    }

    public get_questions_details_multilanguage(reference: any, language: any) {
        //return this.http.get(AppService.base_url + AppService.survey_question + '?filters[reference_number]=' + reference + '&populate=*')
        return this.http.get(AppService.base_url + AppService.survey_question + '?filters[reference_number]=' + reference + '&locale=' + language + '&populate=*')
    }

    public get_questions() {
        return this.http.get(AppService.base_url + AppService.survey_question + '?pagination[limit]=-1&sort[0]=id:desc&populate=*')
    }

    public get_questions_for_survey() {
        return this.http.get(AppService.base_url + AppService.survey_question + '?filters[status][$ne]=Draft&pagination[limit]=-1&sort[0]=id:desc&populate=*')
    }

    public getImage(imageUrl: string): Observable<Blob> {
        return this.http.get(imageUrl, { responseType: 'blob' });
    }

    public delete_question_image(id: any) {
        return this.http.delete(AppService.base_url + AppService.ques_image + '/' + id)
    }

    public get_users() {
        // return this.http.get(AppService.base_url + AppService.user + '?pagination[limit]=-1&sort[0]=id:desc&populate=*')
        return this.http.get(AppService.base_url + AppService.user_profile + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_surveys() {
        return this.http.get(AppService.base_url + AppService.satisfaction_survey + '?pagination[limit]=-1&sort[0]=id:desc&populate=*')
    }

    public create_satisfaction_survey(data: any) {

        return this.http.post(AppService.base_url + AppService.satisfaction_survey, {
            data: {
                created_date: [new Date()],
                reference_number: data.reference_number,
                reference_id: data.reference_id,
                survey_category: data.category,
                question_category: data.question_category,
                purpose: data.purpose,
                created_user: data.createrId,
                status: data.status,
                survey_description: data.description,
                survey_type: data.surveytype,
                survey_title: data.title,
                frequency: data.freequency,
                participant_count: data.participant_count,
                survey_end_date: data.end_date,
                survey_start_date: data.start_date,
                language: data.language,
                disclaimer: data.disclaimer,
                anonimity_option: data.anonymus,
                before_5_miniutes: data.before_5_miniutes,
                before_10_miniutes: data.before_10_miniutes,
                before_15_miniutes: data.before_15_miniutes,
                before_30_miniutes: data.before_30_miniutes,
                before_1_hour: data.before_1_hour,
                before_2_hour: data.before_2_hour,
                before_1_day: data.before_1_day,
                public_survey_notification: data.public_survey_notification,
                private_survey_notification: data.private_survey_notification,
                before_2_days: data.before_2_days
            }
        })
    }

    public update_satisfaction_survey(data: any) {
        return this.http.put(AppService.base_url + AppService.satisfaction_survey + '/' + data.id, {
            data: {
                //created_date: [new Date()],
                reference_number: data.reference_number,
                survey_category: data.category,
                //created_user: data.createrId,
                status: data.status,
                purpose: data.purpose,
                survey_description: data.description,
                survey_type: data.surveytype,
                survey_title: data.title,
                frequency: data.freequency,
                participant_count: data.participant_count,
                survey_end_date: data.end_date,
                survey_start_date: data.start_date,
                language: data.language,
                disclaimer: data.disclaimer,
                anonimity_option: data.anonymus,
                before_5_miniutes: data.before_5_miniutes,
                before_10_miniutes: data.before_10_miniutes,
                before_15_miniutes: data.before_15_miniutes,
                before_30_miniutes: data.before_30_miniutes,
                before_1_hour: data.before_1_hour,
                before_2_hour: data.before_2_hour,
                before_1_day: data.before_1_day,
                before_2_days: data.before_2_days,
                public_survey_notification: data.public_survey_notification,
                private_survey_notification: data.private_survey_notification,
            }
        })
    }

    public create_survey_participants(data: any, id: any) {

        return this.http.post(AppService.base_url + AppService.survey_participants, {
            data: {
                participant_name: data.Employee,
                participant_email: data.Email,
                user_id: data.user_id.toString(),
                add_participant: data.addparticipants,
                satisfaction_survey: id,
                created_user: data.created_user.toString(),
            }
        })
    }

    public create_survey_participants_during_survey(data: any, id: any) {

        return this.http.post(AppService.base_url + AppService.survey_participants, {
            data: {
                participant_name: data.Employee,
                participant_email: data.Email,
                user_id: data.user_id.toString(),
                add_participant: data.addparticipants,
                satisfaction_survey: id,
                newly_added_participant: true,
                created_user: data.created_user.toString(),
            }
        })
    }

    public delete_survey_participants(data: any) {
        return this.http.delete(AppService.base_url + AppService.survey_participants + '/' + data.id)
    }

    public update_survey_participants(data: any, id: any) {
        return this.http.put(AppService.base_url + AppService.survey_participants + '/' + data.id, {
            data: {
                participant_name: data.Employee,
                participant_email: data.Email,
                user_id: data.user_id.toString(),
                add_participant: data.addparticipants,
                satisfaction_survey: id,
                created_user: data.created_user.toString(),
            }
        })
    }

    public create_survey_questions(quesIds: any, id: any) {

        // return this.http.put(AppService.base_url + AppService.satisfaction_survey + '/' + id, {
        //     data: {
        //         survey_questions: quesId
        //     }
        // })
        return this.http.put(AppService.base_url + AppService.satisfaction_survey + '/' + id, {
            data: {
                survey_questions: [...quesIds]
            }
        });
    }

    public update_survey_questions(quesIds: any[], id: any) {

        return this.http.put(AppService.base_url + AppService.satisfaction_survey + '/' + id, {
            data: {
                survey_questions: [...quesIds]
            }
        });
    }

    public update_survey_status(status: any, id: any) {

        return this.http.put(AppService.base_url + AppService.satisfaction_survey + '/' + id, {
            data: {
                status: status
            }
        })
    }


    public update_survey_duration(start_date: any, end_date: any, id: any) {

        return this.http.put(AppService.base_url + AppService.satisfaction_survey + '/' + id, {
            data: {
                survey_start_date: start_date,
                survey_end_date: end_date
            }
        })
    }

    //get survey
    public get_survey_history(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.satisfaction_survey + '?populate=*' + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_unit_specific_survey_history(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.satisfaction_survey + '?populate=*' + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_unit_specific_survey_history_search(reference: any, division: any) {
        return this.http.get(AppService.base_url + AppService.satisfaction_survey + '?filters[reference_number]=' + reference + '&populate=*&sort[0]=id:desc')
    }

    public get_survey_history_search(reference: any) {
        return this.http.get(AppService.base_url + AppService.satisfaction_survey + '?filters[reference_number]=' + reference + '&populate=*&sort[0]=id:desc')
    }
    public get_assigned_survey_history(userid: any, startIndex: number, pageSize: number) {  //
        return this.http.get(AppService.base_url + AppService.satisfaction_survey + '?populate=*' + '&filters[status][$ne]=Draft&filters[survey_participants][user_id]=' + userid + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_unit_specific_assigned_survey_history(userid: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.satisfaction_survey + '?populate=*' + '&filters[status][$ne]=Draft&filters[survey_participants][user_id]=' + userid + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_unit_specific_assigned_survey_history_search(userid: any, reference: any, division: any) {
        return this.http.get(AppService.base_url + AppService.satisfaction_survey + '?filters[reference_number]=' + reference + '&filters[status][$ne]=Draft&filters[survey_participants][user_id]=' + userid + '&populate=*&sort[0]=id:desc')
    }

    public get_assigned_survey_history_search(userid: any, reference: any) {
        return this.http.get(AppService.base_url + AppService.satisfaction_survey + '?filters[reference_number]=' + reference + '&filters[status][$ne]=Draft&filters[survey_participants][user_id]=' + userid + '&populate=*&sort[0]=id:desc')
    }

    //get question details
    public get_survey_details(reference: any) {
        return this.http.get(
            AppService.base_url + AppService.satisfaction_survey +
            '?filters[reference_id]=' + reference + 
            '&populate[created_user]=*&populate[business_unit]=*&populate[survey_participants]=*&populate[survey_questions][populate]=localizations'
        );
    }
    
    
    




    // save tag in dropdown
    public post_tag(data: any) {
        return this.http.post(AppService.base_url + AppService.dropdown_values, {
            data: {
                Module: data.module,
                Category: data.category,
                Value: data.value,
            }
        })
    }

    public create_tag(data: any, created_user: any) {
        console.log(data);

        return this.http.post(AppService.base_url + AppService.survey_tags, {
            data: {
                tag_name: data,
                created_user: created_user,
            }
        })
    }


    public get_tag() {
        return this.http.get(AppService.base_url + AppService.survey_tags)
    }

    // public get_tag() {
    //     return this.http.get(AppService.base_url + AppService.survey_tags + '?populate=*')
    // }

    public get_languages() {
        return this.http.get(AppService.base_url + AppService.languages)
    }

    public create_survey_response(data: any) {

        return this.http.post(AppService.base_url + AppService.survey_responses, {
            data: {
                question: data.Question,
                multiple_answer: data.question_type == "Multiple Choice" ? data.answer : "",
                single_answer: data.question_type == "Single Choice" ? data.answer : "",
                yes_no_answer: data.question_type == "Yes or No" ? data.answer : "",
                descriptive_answer: data.question_type == "Descriptive" ? data.answer : "",
                star_rating_answer: data.question_type == "Star Rating" ? data.answer.toString() : "",
                user: data.UserId,
                survey: data.SurveyId,
                survey_reference_id:data.SurveyRefID
            }
        })
    }

    public create_public_survey_response(data: any,email:any) {

        return this.http.post(AppService.base_url + AppService.survey_responses, {
            data: {
                question: data.Question,
                multiple_answer: data.question_type == "Multiple Choice" ? data.answer : "",
                single_answer: data.question_type == "Single Choice" ? data.answer : "",
                yes_no_answer: data.question_type == "Yes or No" ? data.answer : "",
                descriptive_answer: data.question_type == "Descriptive" ? data.answer : "",
                star_rating_answer: data.question_type == "Star Rating" ? data.answer.toString() : "",
                //user: data.UserId,
                survey: data.SurveyId,
                email:email
            }
        })
    }

    public get__survey_response(user: any) {
        return this.http.get(AppService.base_url + AppService.survey_responses + '?filters[user]=' + user + '&populate=*')
        // return this.http.get(AppService.base_url + AppService.survey_responses + '?filters[user]=' + user + '&filters[survey]=' + survey)
    }
    public get__survey_response_details(refID:any) {
        return this.http.get(AppService.base_url + AppService.survey_responses  + '?filters[survey]='+ refID + '&pagination[limit]=-1&populate=*')
    }
    public get_public_survey_response_details(refID:any) {        
        return this.http.get(AppService.base_url + AppService.survey_responses  + '?filters[survey][reference_id]='+ refID + '&populate=*')
    }
 // open ai
 public generateAIDescription(data: any, completion_tokens: any, prompt_tokens: any, total_tokens: any,user:any) {
    return this.http.post(AppService.base_url + AppService.open_ai, {
        data: {
            module: 'Satisfaction Survey',
            date_and_time: new Date(),
            reference_number: data.reference_number,
            user: user,
            event: 'Generated Survey Description',
            completion_tokens: completion_tokens,
            prompt_tokens: prompt_tokens,
            total_tokens: total_tokens
        }
    })
}
 public generateAIDisclaimer(data: any, completion_tokens: any, prompt_tokens: any, total_tokens: any,user:any) {
    return this.http.post(AppService.base_url + AppService.open_ai, {
        data: {
            module: 'Satisfaction Survey',
            date_and_time: new Date(),
            reference_number: data.reference_number,
            user: user,
            event: 'Generated Survey Disclaimer',
            completion_tokens: completion_tokens,
            prompt_tokens: prompt_tokens,
            total_tokens: total_tokens
        }
    })
}
public create_survey_qr(data: any) {
    return this.http.post(AppService.base_url + AppService.survey_qr, {
        data: {
            qr_name: data.qr_name,
            format: data.format,
            satisfaction_survey: data.satisfaction_survey,
            qr_id: data.id,
        }
    })
}
}