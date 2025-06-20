import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AttritionService extends AppService {

    token: string

    constructor(private http: HttpClient) {
        super();
    }


    public get_attrition_register() {
        return this.http.get(AppService.base_url + AppService.attrition + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_attrition_register_count() {
        return this.http.get(AppService.base_url + AppService.attrition + '?pagination[limit]=-1&sort[0]=id:desc&publicationState=preview')
    }
    public get_attritions_register(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.attrition + '?populate=created_user&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_attrition_unit_specific_register(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.attrition + '?' + division + '&populate=created_user&populate=reporter&populate=responsible' + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_attrition_location_filter(data: string, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.attrition + '?populate=created_user&populate[0]=disposals' + data + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_attrition_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.attrition + '?filters[reference_number][$eq]=' + reference)
    }
    public get_attrition_details(reference: any) {
        return this.http.get(AppService.base_url + AppService.attrition + '?filters[id][$eq]=' + reference + '&populate=business_unit' + '&populate=created_user'+ '&populate=responsible_person' )
    }
    public get_resignation_type() {
        return this.http.get(AppService.base_url + AppService.resignation_type + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    //create attrition
    public create_attrition(data: any) {



        return this.http.post(AppService.base_url + AppService.attrition, {
            data: {
                reference_number: data.reference_number,
                work_history: data.work_history,
                division: data.division,
                employee_id: data.employee_id,
                employee_name: data.employee_name,
                gender: data.gender,
                resigned_date: data.resigned_date,
                normal_resignation: data.normal_resignation,
                date_of_join: data.date_of_join,
                employment_type: data.employment_type,
                service_period: data.service_period,
                designation: data.designation,
                // resigned_designation: data.resigned_designation,
                department: data.department,
                resignation_type: data.resignation_type,
                relieved_date: data.relieved_date,
                source_of_hiring: data.source_of_hiring,
                country: data.country,
                state: data.state,
                employment_classification: data.employment_classification,
                resignation_reason: data.resignation_reason,
                per_day_salary: data.per_day_salary,
                tenure_split: data.tenure_split,
                hostel_access: data.hostel_access,
                business_unit: data.business_unit,
                reported_date: data.reported_date,
                status: data.status,
                created_user: data.created_user,
                responsible_person:data.responsible_person,
                responsible_person_notification:data.responsible_person_notification

            }
        })
    }

    //update attrition
    public update_create_attrition(data: any) {




        return this.http.put(AppService.base_url + AppService.attrition + "/" + data.id, {
            data: {
                reference_number: data.reference_number,
                work_history: data.work_history,
                division: data.division,
                employee_id: data.employee_id,
                employee_name: data.employee_name,
                gender: data.gender,
                resigned_date: data.resigned_date,
                normal_resignation: data.normal_resignation,
                date_of_join: data.date_of_join,
                employment_type: data.employment_type,
                service_period: data.service_period,
                designation: data.designation,
                resigned_designation: data.resigned_designation,
                department: data.department,
                resignation_type: data.resignation_type,
                relieved_date: data.relieved_date,
                source_of_hiring: data.source_of_hiring,
                country: data.country,
                state: data.state,
                employment_classification: data.employment_classification,
                resignation_reason: data.resignation_reason,
                per_day_salary: data.per_day_salary,
                tenure_split: data.tenure_split,
                hostel_access: data.hostel_access,
                business_unit: data.business_unit,
                reported_date: data.reported_date,
                status: data.status,
                created_user: data.created_user,
                responsible_person:data.responsible_person,
                responsible_person_notification:data.responsible_person_notification

            }
        })
    }
    public create_resignation_type(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.resignation_type, {
            data: {
                type: name,
                created_user: user

            }
        })
    }

    // get-attrition-individual-report

    public attrition_individual_report(reference_number: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/attrition_individual_report_pdf.pdf?ID=' + reference_number + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })

    }

    //attrition register reports with division

    public attrition_register_report(data: any) {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/attrition_register_report_pdf.pdf?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&division=' + data.division + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public attrition_register_excel(data: any) {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/attrition_register_report_excel.xlsx?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&division=' + data.division + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }


    //attrition register reports without division

    public attrition_register_report1(data: any) {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/attrition_register_report_pdf.pdf?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public attrition_register_excel1(data: any) {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/attrition_register_report_excel.xlsx?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }
}