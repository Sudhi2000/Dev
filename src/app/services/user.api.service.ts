import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable({
    providedIn: 'root'
})
export class UserService extends AppService {

    token: string

    constructor(private http: HttpClient) {
        super();
    }

    public get_user_profile() {
        return this.http.get(AppService.base_url+AppService.user_profile+'?pagination[limit]=-1&sort[0]=id:desc' + '&populate=*')
    }
     

    public create_user_profile(data: any) {
        return this.http.post(AppService.base_url + AppService.user_profile, {
            data: {
                reported_date: new Date(),
                first_name: data.first_name,
                last_name: data.last_name,
                designation: data.designation,
                escalate_email: data.escalate_email,
                email: data.email,
                gender: data.gender,
                password: data.password,
                employee_id: data.employee_id,
                org_id:data.org_id
            }
        })
    }
    public create_user(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.user, {
           
                //reported_date: new Date(),
                username: data.first_name,
                ehs_dashboard: data.ehs_dashboard,
                email: data.email,
                password: data.password,
                profile:id,
                acc_inc_action: data.acc_inc_action,
                acc_inc_assigned: data.acc_inc_assigned,
                acc_inc_create: data.acc_inc_create,
                acc_inc_dashboard: data.acc_inc_dashboard,
                acc_inc_modify: data.acc_inc_modify,
                acc_inc_register: data.acc_inc_register,
                aud_action_plan: data.aud_action_plan,
                aud_dashboard: data.aud_dashboard,
                chem_approve: data.chem_approve,
                chem_create: data.chem_create,
                chem_inven: data.chem_inven,
                chem_inven_view: data.chem_inven_view,
                chem_modify: data.chem_modify,
                chem_trans: data.chem_trans,
                chem_trans_create: data.chem_trans_create,
                chem_trans_view: data.chem_trans_view,
                doc_create: data.doc_create,
                doc_history: data.doc_history,
                doc_modify: data.doc_modify,
                doc_view: data.doc_view,
                ehs_action: data.ehs_action,
                ehs_create: data.ehs_create,
                ehs_history: data.ehs_history,
                ehs_modify: data.ehs_modify,
                ehs_tasks: data.ehs_tasks,
                ehs_verify: data.ehs_verify,
                ehs_view: data.ehs_view,
                env_assigned: data.env_assigned,
                env_create: data.env_create,
                env_history: data.env_history,
                env_modify: data.env_modify,
                ext_aud_action: data.ext_aud_action,
                ext_aud_audit: data.ext_aud_audit,
                ext_aud_create: data.ext_aud_create,
                ext_aud_modify: data.ext_aud_modify,
                ext_aud_queue: data.ext_aud_queue,
                ext_aud_register: data.ext_aud_register,
                ext_aud_task: data.ext_aud_task,
                int_aud_action: data.int_aud_action,
                int_aud_audit: data.int_aud_audit,
                int_aud_create: data.int_aud_create,
                int_aud_history: data.int_aud_history,
                int_aud_modify: data.int_aud_modify,
                int_aud_queue: data.int_aud_queue,
                int_aud_task: data.int_aud_task,
                sus_create: data.sus_create,
                sus_modify: data.sus_modify,
                sus_view: data.sus_view,
                sus_register: data.sus_register,
                user_create: data.user_create,
                user_modify: data.user_modify,
                user_history: data.user_history,

            
        })
    }
    public update_user(data: any,user_id:any) {
        return this.http.put(AppService.base_url + AppService.user+ '/' + user_id, {
            
                //reported_date: new Date(),
                username: data.first_name,
                ehs_dashboard: data.ehs_dashboard,
                email: data.email,
                password: data.password,
                acc_inc_action: data.acc_inc_action,
                acc_inc_assigned: data.acc_inc_assigned,
                acc_inc_create: data.acc_inc_create,
                acc_inc_dashboard: data.acc_inc_dashboard,
                acc_inc_modify: data.acc_inc_modify,
                acc_inc_register: data.acc_inc_register,
                aud_action_plan: data.aud_action_plan,
                aud_dashboard: data.aud_dashboard,
                chem_approve: data.chem_approve,
                chem_create: data.chem_create,
                chem_inven: data.chem_inven,
                chem_inven_view: data.chem_inven_view,
                chem_modify: data.chem_modify,
                chem_trans: data.chem_trans,
                chem_trans_create: data.chem_trans_create,
                chem_trans_view: data.chem_trans_view,
                doc_create: data.doc_create,
                doc_history: data.doc_history,
                doc_modify: data.doc_modify,
                doc_view: data.doc_view,
                ehs_action: data.ehs_action,
                ehs_create: data.ehs_create,
                ehs_history: data.ehs_history,
                ehs_modify: data.ehs_modify,
                ehs_tasks: data.ehs_tasks,
                ehs_verify: data.ehs_verify,
                ehs_view: data.ehs_view,
                env_assigned: data.env_assigned,
                env_create: data.env_create,
                env_history: data.env_history,
                env_modify: data.env_modify,
                ext_aud_action: data.ext_aud_action,
                ext_aud_audit: data.ext_aud_audit,
                ext_aud_create: data.ext_aud_create,
                ext_aud_modify: data.ext_aud_modify,
                ext_aud_queue: data.ext_aud_queue,
                ext_aud_register: data.ext_aud_register,
                ext_aud_task: data.ext_aud_task,
                int_aud_action: data.int_aud_action,
                int_aud_audit: data.int_aud_audit,
                int_aud_create: data.int_aud_create,
                int_aud_history: data.int_aud_history,
                int_aud_modify: data.int_aud_modify,
                int_aud_queue: data.int_aud_queue,
                int_aud_task: data.int_aud_task,
                sus_create: data.sus_create,
                sus_modify: data.sus_modify,
                sus_view: data.sus_view,
                sus_register: data.sus_register,
                user_create: data.user_create,
                user_modify: data.user_modify,
                user_history: data.user_history,

        })
    }
    public update_user_profile(data: any) {
        return this.http.put(AppService.base_url + AppService.user_profile+ '/' + data.id, {
            data: {
                //reported_date: new Date(),
                first_name: data.first_name,
                last_name: data.last_name,
                designation: data.designation,
                escalate_email: data.escalate_email,
                email: data.email,
                gender: data.gender,
                password: data.password,
                employee_id: data.employee_id,
                org_id:data.org_id
            }
        })
    }
    public delete_user_profile(id:any) {
        return this.http.delete(AppService.base_url + AppService.user_profile+'/'+id)
    }
}