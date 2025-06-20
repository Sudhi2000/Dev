import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Injectable({
    providedIn: 'root'
})
export class GeneralService extends AppService {

    token: string

    constructor(private http: HttpClient) {
        super();
    }

    //get app config
    public get_app_config() {
        return this.http.get(AppService.base_url + AppService.app_config + '?populate=*', { headers: { skip: "true" } })
    }

    //get divisions
    public get_division(org_id: any) {
        return this.http.get(AppService.base_url + AppService.division + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_department() {
        return this.http.get(AppService.base_url + AppService.department + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_sub_department() {
        return this.http.get(AppService.base_url + AppService.sub_department + '?populate=department&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_designation() {
        return this.http.get(AppService.base_url + AppService.designation + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_function() {
        return this.http.get(AppService.base_url + AppService.function + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_country() {
        return this.http.get(AppService.base_url + AppService.country + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_state() {
        return this.http.get(AppService.base_url + AppService.state + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    //create activity stream
    public create_activity_stream(action: any, reference_number: any, user_profile: any) {
        return this.http.post(AppService.base_url + AppService.activity_stream, {
            data: {
                action: action,
                reference_number: reference_number,
                date: new Date(),
                user_profile: user_profile
            }
        })
    }

    //create notification
    public create_notification(data: any) {
        return this.http.post(AppService.base_url + AppService.notification, {
            data: {
                module: data.module,
                action: data.action,
                reference_number: data.reference_number,
                user_id: data.userID,
                access_link: data.access_link,
                profile: data.profile
            }
        })
    }

    //get notifications
    public get_notification(userID: any) {
        return this.http.get(AppService.base_url + AppService.notification + '?filters[user_id]=' + userID + '&filters[read]=false&populate[0]=profile&populate[1]=profile.image&pagination[limit]=50&sort[0]=id:desc')
    }

    //notification mark as read
    public read_notification(id: any) {
        return this.http.put(AppService.base_url + AppService.notification + '/' + id, {
            data: {
                read: true
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

    //get dropdown values
    public get_dropdown_values(module: any) {

        return this.http.get(AppService.base_url + AppService.dropdown_values + '?filters[Module]=' + module + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_applicability_dropdown_values(module: any) {
        return this.http.get(AppService.base_url + AppService.dropdown_values + '?filters[Module]=' + module + '&filters[Category]=Applicability' + '&pagination[limit]=-1&sort[0]=id:desc')
    }
    public delete_image(id: any) {
        return this.http.delete(AppService.base_url + AppService.upload + 'files/' + id)
    }

    public get_departments() {
        return this.http.get(AppService.base_url + AppService.department + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public create_employee(data: any) {
        return this.http.post(AppService.base_url + AppService.employees, {
            data: {
                employee_name: data.name,
                email: data.email,
                designation: data.attributes.designation,
                employee_id: data.attributes.employee_id,
                department: data.attributes.department,
            }
        })
    }

    public get_employees() {
        return this.http.get(AppService.base_url + AppService.employees + '?populate=department&populate=designation&pagination[limit]=-1&sort[0]=id:desc')
    }

    public getImage(imageUrl: string): Observable<Blob> {
        return this.http.get(imageUrl, { responseType: 'blob' });
    }

    public create_department(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.department, {
            data: {
                department_name: name,
                created_user: user

            }
        })
    }
    public create_sub_department(name: any, department: any, user: any) {
        return this.http.post(AppService.base_url + AppService.sub_department, {
            data: {
                sub_department_name: name,
                department: department,
                created_user: user

            }
        })
    }
    public create_designation(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.designation, {
            data: {
                designation: name,
                created_user: user

            }
        })
    }
    public create_function(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.function, {
            data: {
                function_name: name,
                created_user: user

            }
        })
    }
    public create_country(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.country, {
            data: {
                country_name: name,
                created_user: user

            }
        })
    }
    public create_state(name: any, country: any, user: any) {
        return this.http.post(AppService.base_url + AppService.state, {
            data: {
                state_name: name,
                created_user: user,
                country: country
            }
        })
    }

    public create_diseases(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.diseases, {
            data: {
                disease_name: data.name,
                category: data.category,
                health_issue_type: data.health_issue_type,
                created_user: user

            }
        })
    }

    public get_diseases() {
        return this.http.get(AppService.base_url + AppService.diseases + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public create_benefitType(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.benefit_type, {
            data: {
                type: name,
                created_user: user

            }
        })
    }

    public get_benefitType() {
        return this.http.get(AppService.base_url + AppService.benefit_type + '?pagination[limit]=-1&sort[0]=id:desc')
    }




    //############################################################################################



    // public activity_stream(action:any,referance:any,date:any,user:any){
    //     return this.http.post(AppService.base_url+AppService.activity_stream,{
    //         data:{
    //             action:action,
    //             reference_number:referance,
    //             date:date,
    //             user_profile:user
    //         }
    //     })
    // }

    // public get_activity(){
    //     return this.http.get(AppService.base_url+AppService.activity_stream+'?pagination[limit]=10&sort[0]=id:desc&populate[user][populate][0]=image')
    // }










}