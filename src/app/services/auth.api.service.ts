import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppService } from './app.service';
import { authentication } from './schemas';
import { verify } from 'crypto';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
    providedIn: 'root'
})
export class AuthService extends AppService {

    token: string

    constructor(private http: HttpClient, private cookieService: CookieService) {
        super();
    }

    public isLoggedIn(): boolean {

        const JWTtoken = this.cookieService.get(environment.token)
        console.log(JWTtoken)


        //get token
        // const allcookies = document.cookie.split(';');
        // const name = environment.token
        // for (var i = 0; i < allcookies.length; i++) {
        //     var cookiePair = allcookies[i].split("=");
        //     if (name == cookiePair[0].trim()) {
        //         // Decode the cookie value and return
        //         this.token = decodeURIComponent(cookiePair[1])
        //     }
        // }
        if (JWTtoken) {
            return true;
        }
        return false;
    }

    public authentication(credential: any) {
        return this.http.post<authentication>(AppService.base_url + AppService.authentication, {
            identifier: credential.email,
            password: credential.password
        }, { headers: { skip: "true" } })
    }

    public generate_otp(credential: any, jwt: any) {
        return this.http.post(AppService.base_url + AppService.authentication_otp, {
            data: {
                email: credential.email,
                otp_generator: credential.otp_generator,
                user_id: credential.userId
            }
        }, { headers: { skip: "true", Authorization: "Bearer " + jwt } })
    }
    public send_survey_otp(credential: any,refID:any) {
        return this.http.post(AppService.base_url + AppService.survey_respondent_otp, {
            data: {
                email: credential.email,
                survey_reference_id:refID
            }
        }, { headers: { skip: "true" , Authorization: "Bearer " + environment.publicSurveyToken } })
    }
    public otp_used(id: any, jwt: any) {
        return this.http.put(AppService.base_url + AppService.authentication_otp + '/' + id, {
            data: {
                used: true,
            }
        }, { headers: { skip: "true", Authorization: "Bearer " + jwt } })
    }
    public verify_otp(userId: any, otp: any, jwt: any) {
        return this.http.get(AppService.base_url + AppService.user_verify_profile + '/verify?otp=' + otp + '&user_id=' + userId,
            { headers: { skip: "true", Authorization: "Bearer " + jwt } })
    }
    // public verify_respondent_otp(refID:any, otp: any) {
    //     return this.http.post(AppService.base_url + AppService.survey_respondent_otp + '/' + refID ,
    //         { headers: { skip: "true", Authorization: "Bearer " + environment.publicSurveyToken } })
    // }
    public verify_respondent_otp(refID:any, otp: any) {
        return this.http.post(AppService.base_url + AppService.verify_respondent_otp, {
            data: {
                otp: otp,
                reference_id: refID,
            }
        }, { headers: { skip: "true" , Authorization: "Bearer " + environment.publicSurveyToken } })
    }

    // public report_auth(username:any,password:any){
    //     return this.http.post(environment.report_auth,{
    //         username:username,
    //         password:password
    //     },{headers:{skip:"true"}})
    // }

    public forget_password(email: string) {
        return this.http.post(AppService.base_url + AppService.forget_password, {
            data: {
                email: email
            }
        }, { headers: { skip: "true" } })
    }

    public reset_password(token: any, email: any, id: any, password: any) {
        return this.http.post(AppService.base_url + AppService.reset_password, {
            data: {
                email: email,
                token: token,
                request_id: id,
                password: password
            }
        }, { headers: { skip: "true" } })
    }

    public check_expiry(id: any) {
        return this.http.get(AppService.base_url + AppService.forget_password + '/' + id, { headers: { skip: "true" } })
    }

    public me() {
        return this.http.get(AppService.base_url + AppService.me)
    }

    public get_profile(userID: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[user][$eq]=' + userID + '&populate=*')
    }

    public get_profiles(orgID: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?populate=user&populate=divisions&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_unit_specific_profiles(orgID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?populate=user&populate=divisions&' + division + '&pagination[limit]=-1&sort[0]=id:desc')
    }





    public get_hse_head_profiles(orgID: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[org_id][$eq]=' + orgID + '&filters[hse_head][$eq]=true&pagination[limit]=-1&sort[0]=id:desc&populate=*')
    }
    public get_unit_specific_hse_head_profiles(orgID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[org_id][$eq]=' + orgID + '&filters[hse_head][$eq]=true&' + division + '&pagination[limit]=-1&sort[0]=id:desc&populate=*')
    }

    public get_chairperson_list(orgID: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[org_id][$eq]=' + orgID + '&filters[chairperson][$eq]=true&pagination[limit]=-1&sort[0]=id:desc&populate=*')
    }


    public create_user_log(loginDate: any, logOutDate: any, type: any, profile: any) {
        return this.http.post(AppService.base_url + AppService.user_log, {
            data: {
                login_date: loginDate,
                logout_date: logOutDate,
                type: type,
                user_profile: profile
            }
        })
    }

    public report_auth() {
        return this.http.get(AppService.report + 'login?j_username=' + environment.j_username + '&j_password=' + environment.j_password, { headers: { skip: "true" } })
    }
    //update ehs
    public update_profile(data: any) {
        return this.http.put(AppService.base_url + AppService.profile + '/' + data.id, {
            data: {
                id: data.id,
                gender: data.gender,
                first_name: data.first_name,
                last_name: data.last_name,
                designation: data.designation,
                employee_id: data.employee_id,
                email: data.email,
                password: data.password,

            }
        })
    }
    //Update Profile Image
    public update_profile_image(data: any) {
        return this.http.put(AppService.base_url + AppService.profile_images + '/' + data.profile_img_id, {
            data:
            {

                image: data.profileImage
            }

        })
    }

}