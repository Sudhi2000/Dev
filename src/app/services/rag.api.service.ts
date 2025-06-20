import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RagService extends AppService {

    token: string

    constructor(private http: HttpClient) {
        super();
    }


    public get_rag_register() {
        return this.http.get(AppService.base_url + AppService.rag + '?populate[0]=disposals&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_rag_count() {
        return this.http.get(AppService.base_url + AppService.rag + '?publicationState=preview&populate[0]=disposals&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_unit_specific_rag_register(division: any) {
        return this.http.get(AppService.base_url + AppService.rag + '?' + division + '&populate[0]=disposals&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_rag_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.rag + '?filters[reference_number][$eq]=' + reference + '&populate=business_unit')
    }
    public get_rag_details(reference: any) {
        return this.http.get(AppService.base_url + AppService.rag + '?filters[id][$eq]=' + reference)
    }
    public get_rag_register_country(data: any) {
        return this.http.get(AppService.base_url + AppService.rag + '?populate[0]=disposals' + data + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    //create rag
    public create_rag(data: any) {
        return this.http.post(AppService.base_url + AppService.rag, {
            data: {
                reported_date: new Date(),
                reference_number: data.reference_number,
                category: data.category,
                employee_type: data.employee_type,
                employee_id: data.employee_id,
                employee_name: data.employee_name,
                gender: data.gender,
                age: data.age,
                date_of_birth: data.date_of_birth,
                date_of_join: data.date_of_join,
                employment_type: data.employment_type,
                service_period: data.service_period,
                designation: data.designation,
                department: data.department,
                function: data.function,
                reporting_manager: data.reporting_manager,
                source_of_hiring: data.source_of_hiring,
                country: data.country,
                state: data.state,
                origin: data.origin,
                discussion_summary: data.discussion_summary,
                remarks: data.remarks,
                tenure_split: data.tenure_split,
                status: data.status,
                rag: data.rag,
                division: data.division,
                business_unit: data.business_unit,
                age_group: data.age_group,
                created_By: data.reporter
            }
        })
    }
    public update_rag(data: any) {
        return this.http.put(AppService.base_url + AppService.rag + '/' + data.id, {
            data: {
                reference_number: data.reference_number,
                category: data.category,
                employee_type: data.employee_type,
                employee_id: data.employee_id,
                employee_name: data.employee_name,
                gender: data.gender,
                age: data.age,
                date_of_birth: data.date_of_birth,
                date_of_join: data.date_of_join,
                employment_type: data.employment_type,
                service_period: data.service_period,
                designation: data.designation,
                department: data.department,
                function: data.function,
                reporting_manager: data.reporting_manager,
                source_of_hiring: data.source_of_hiring,
                country: data.country,
                state: data.state,
                origin: data.origin,
                discussion_summary: data.discussion_summary,
                remarks: data.remarks,
                tenure_split: data.tenure_split,
                status: data.status,
                rag: data.rag,
                business_unit: data.business_unit,
                division: data.division,
                age_group: data.age_group,
                updated_By: data.reporter

            }
        })
    }
    public update_status(data: any) {
        return this.http.put(AppService.base_url + AppService.rag + '/' + data.id, {
            data: {
                status: data.status,
                updated_By: data.updatedBy,
            }
        })
    }
    public mark_status(id: any) {
        return this.http.put(AppService.base_url + AppService.rag + '/' + id, {
            data: {
                status: 'Resigned'
            }
        })
    }

    public get_rag_data_dash(start: any, end: any) {
        return this.http.get(AppService.base_url + AppService.rag + '?filters[reported_date][$gte]=' + start + '&filters[reported_date][$lte]=' + end + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    // get-rag-individual-report

     public rag_individual_report(reference_number: any): any{
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/rag_individual_report_pdf_1.pdf?ID=' + reference_number + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    
    }

     //rag register reports with division

     public rag_register_report(data:any){
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/rag_register_report_pdf_1.pdf?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&division=' + data.division   + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
     }

     public rag_register_report_excel(data:any){
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/rag_register_report_excel_1.xlsx?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&division=' + data.division +  '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
  
     }

      //rag register reports without division

     public rag_register_report_2(data:any){
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/rag_register_report_pdf_1.pdf?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date +   '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

     public rag_register_report_excel_2(data:any){
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/rag_register_report_excel_1.xlsx?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date +   '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
  
     }
}