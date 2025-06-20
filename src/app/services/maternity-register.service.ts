import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { map, Observable } from 'rxjs';
import { AppsModule } from '../apps/apps.module';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MaternityRegisterService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }

    public create_entitlement(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.benefits_entitlements, {
            data: {
                benefit_type: data.benefit_type,
                amount: data.amount,
                total_days_paid: data.total_days_paid,
                first_installment_amount: data.first_installment_amount,
                first_installment_date: data.first_installment_date,
                second_installment_amount: data.second_installment_amount,
                second_installment_date: data.second_installment_date,
                is_benefit_received_someone: data.is_benefit_received_someone,
                beneficiary_name: data.beneficiary_name,
                beneficiary_address: data.beneficiary_address,
                beneficiary_total_amount: data.beneficiary_total_amount,
                beneficiary_date: data.beneficiary_date,
                description: data.description,
                maternity_record: id

            }
        })
    }

    public update_entitlement(data: any) {
        return this.http.put(AppService.base_url + AppService.benefits_entitlements + '/' + data.id, {
            data: {
                benefit_type: data.benefit_type,
                amount: data.amount,
                total_days_paid: data.total_days_paid,
                first_installment_amount: data.first_installment_amount,
                first_installment_date: data.first_installment_date,
                second_installment_amount: data.second_installment_amount,
                second_installment_date: data.second_installment_date,
                is_benefit_received_someone: data.is_benefit_received_someone,
                beneficiary_name: data.beneficiary_name,
                beneficiary_address: data.beneficiary_address,
                beneficiary_total_amount: data.beneficiary_total_amount,
                beneficiary_date: data.beneficiary_date,
                description: data.description,
                // maternity_record: id

            }
        })
    }

    public delete_entitlement(id: any) {
        return this.http.delete(AppService.base_url + AppService.benefits_entitlements + '/' + id)
    }

    public create_document(data: any) {
        return this.http.post(AppService.base_url + AppService.medical_documents, {
            data: {
                document_type: data?.document_type,
                upload_date: data?.upload_date,
                document_id: data?.document_id,
                document_name: data?.document_name,
                format: data?.format,
                maternity_record: data?.id

            }
        })
    }

    public update_document(data: any) {
        return this.http.put(AppService.base_url + AppService.medical_documents + '/' + data.id, {
            data: {
                document_type: data.document_type,
                upload_date: data.upload_date,
                document_id: data.document_id,
                document_name: data.document_name,
                format: data.format,
                // maternity_record: data.id

            }
        })
    }

    public delete_maternity_documents(id: any) {
        return this.http.delete(AppService.base_url + AppService.medical_documents + '/' + id)
    }

    public create_maternityRecord(data: any) {
        return this.http.post(AppService.base_url + AppService.maternity_records, {
            data: {
                employee_id: data.employee_id,
                name: data.name,
                age: data.age,
                contact_number: data.contact_number,
                designation: data.designation,
                department: data.department,
                supervisor_manager: data.supervisor_manager,
                date_of_join: data.date_of_join,
                average_wages: data.average_wages,
                application_id: data.application_id,
                application_date: data.application_date,
                expected_delivery_date: data.expected_delivery_date,
                leave_start_date: data.leave_start_date,
                leave_end_date: data.leave_end_date,
                actual_delivery_date: data.actual_delivery_date,
                leave_status: data.leave_status,
                notice_date_after_delivery: data.notice_date_after_delivery,
                rejoining_date: data.rejoining_date,
                support_provided: data.support_provided,
                signature: data.signature,
                remarks: data.remarks,
                status: data.status,
                created_date: data.created_date,
                division: data.division
            }
        })
    }

    public create_maternityRecord_draft(data: any) {
        return this.http.post(AppService.base_url + AppService.maternity_records, {
            data: {
                employee_id: data.employee_id,
                name: data.name,
                age: data.age,
                contact_number: data.contact_number,
                designation: data.designation,
                department: data.department,
                supervisor_manager: data.supervisor_manager,
                date_of_join: data.date_of_join,
                average_wages: data.average_wages,
                application_id: data.application_id,
                application_date: data.application_date,
                expected_delivery_date: data.expected_delivery_date,
                leave_start_date: data.leave_start_date,
                leave_end_date: data.leave_end_date,
                actual_delivery_date: data.actual_delivery_date,
                leave_status: data.leave_status,
                notice_date_after_delivery: data.notice_date_after_delivery,
                rejoining_date: data.rejoining_date,
                support_provided: data.support_provided,
                signature: data.signature,
                remarks: data.remarks,
                status: data.status,
                created_date: data.created_date,
                division: data.division

            }
        })
    }

    public update_maternityRecord(data: any) {

        return this.http.put(AppService.base_url + AppService.maternity_records + '/' + data.id, {
            data: {
                employee_id: data.employee_id,
                name: data.name,
                age: data.age,
                contact_number: data.contact_number,
                designation: data.designation,
                department: data.department,
                supervisor_manager: data.supervisor_manager,
                date_of_join: data.date_of_join,
                average_wages: data.average_wages,
                application_id: data.application_id,
                application_date: data.application_date,
                expected_delivery_date: data.expected_delivery_date,
                leave_start_date: data.leave_start_date,
                leave_end_date: data.leave_end_date,
                actual_delivery_date: data.actual_delivery_date,
                leave_status: data.leave_status,
                notice_date_after_delivery: data.notice_date_after_delivery,
                rejoining_date: data.rejoining_date,
                support_provided: data.support_provided,
                signature: data.signature,
                remarks: data.remarks,
                status: data.status,
                created_date: data.created_date,
                division: data.division

            }
        })
    }

    public update_maternityRecord_draft(data: any) {

        return this.http.put(AppService.base_url + AppService.maternity_records + '/' + data.id, {
            data: {
                employee_id: data.employee_id,
                name: data.name,
                age: data.age,
                contact_number: data.contact_number,
                designation: data.designation,
                department: data.department,
                supervisor_manager: data.supervisor_manager,
                date_of_join: data.date_of_join,
                average_wages: data.average_wages,
                application_id: data.application_id,
                application_date: data.application_date,
                expected_delivery_date: data.expected_delivery_date,
                leave_start_date: data.leave_start_date,
                leave_end_date: data.leave_end_date,
                actual_delivery_date: data.actual_delivery_date,
                leave_status: data.leave_status,
                notice_date_after_delivery: data.notice_date_after_delivery,
                rejoining_date: data.rejoining_date,
                support_provided: data.support_provided,
                signature: data.signature,
                remarks: data.remarks,
                status: data.status,
                created_date: data.created_date,
                division: data.division

            }
        })
    }

    public get_maternityRecord(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.maternity_records + '?populate[0]=benefits_and_entitlements&populate[1]=medical_documents&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_maternityRecord(startIndex: number, pageSize: number, divisions: any) {
        let divisionArray = divisions.split(',');
        let divisionQuery = divisionArray.map((d: any) => `filters[division][$contains]=${encodeURIComponent(d.trim())}`).join('&');

        return this.http.get(
            `${AppService.base_url}${AppService.maternity_records}?${divisionQuery}&populate[0]=benefits_and_entitlements&populate[1]=medical_documents&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`
        );
    }
    public get_periodic_division_maternityRecord(startDate: any, endDate: any, divisions: any, startIndex: number, pageSize: number) {
        // let divisionArray = divisions.split(',');
        // let divisionQuery = divisions
        //     .map((d: any) => `filters[division][$contains]=${encodeURIComponent(d.trim())}`)
        //     .join('&');
        let divisionQuery = divisions
            .map((d: any) => `filters[division][$contains]=${encodeURIComponent(d.division_name.trim())}`)
            .join('&');

        return this.http.get(
            `${AppService.base_url}${AppService.maternity_records}?filters[application_date][$gte]=${startDate}&filters[application_date][$lte]=${endDate}&${divisionQuery}&populate[0]=benefits_and_entitlements&populate[1]=medical_documents&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`
        );
    }
    public get_unitspecific_division_maternityRecord(startDate: any, endDate: any, divisions: any, startIndex: number, pageSize: number) {
        let divisionArray = divisions.split(',');
        let divisionQuery = divisionArray
            .map((d: any) => `filters[division][$contains]=${encodeURIComponent(d.trim())}`)
            .join('&');

        return this.http.get(
            `${AppService.base_url}${AppService.maternity_records}?filters[application_date][$gte]=${startDate}&filters[application_date][$lte]=${endDate}&${divisionQuery}&populate[0]=benefits_and_entitlements&populate[1]=medical_documents&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`
        );
    }

    // public get_periodic_division_maternityRecord(startDate: any, endDate: any, division: any, startIndex: number, pageSize: number) {
    //     return this.http.get(AppService.base_url + AppService.maternity_records + '?filters[application_date][$gte]=' + startDate + '&filters[application_date][$lte]=' + endDate + '&' + division + '&populate[0]=benefits_and_entitlements&populate[1]=medical_documents&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    // }
    public get_periodic_maternityRecord(startDate: any, endDate: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.maternity_records + '?filters[application_date][$gte]=' + startDate + '&filters[application_date][$lte]=' + endDate + '&populate[0]=benefits_and_entitlements&populate[1]=medical_documents&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_maternity_record_details(start: any, end: any, userDivision: any) {
        let divisionQuery = '';

        if (userDivision && userDivision.length > 0) {
            const divisionArray = userDivision.split(',');
            divisionQuery = divisionArray
                .map((d: string) => `filters[division][$contains]=${encodeURIComponent(d.trim())}`)
                .join('&');
        }

        const url = `${AppService.base_url}${AppService.maternity_records}?filters[application_date][$gte]=${start}&filters[application_date][$lte]=${end}&pagination[limit]=-1&sort[0]=id:desc`;

        const fullUrl = divisionQuery ? `${url}&${divisionQuery}` : url;

        return this.http.get(fullUrl);
    }


    public get_maternity_Record(id: any) {
        return this.http.get(AppService.base_url + AppService.maternity_records + '?filters[id][$eq]=' + id + '&populate[0]=benefits_and_entitlements&populate[1]=medical_documents&sort[0]=id:desc')
    }

    public get_benefits_entitlements(benefitId: any) {
        return this.http.get(AppService.base_url + AppService.benefits_entitlements + '?filters[maternity_record]=' + benefitId + '&sort[0]=id:desc')
    }

    public get_Maternity_Documents(metId: any) {
        return this.http.get(AppService.base_url + AppService.medical_documents + '?filters[maternity_record]=' + metId + '&sort[0]=id:desc')
    }

    // get maternity-benefit-report

    public maternity_report(id: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/maternity_benefit_individual_report_pdf.pdf?ID=' + id + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    //register reports
    public maternity_register_report(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/maternity_register_report_pdf.pdf?start_date=' + data.start_date + '&end_date=' + data.end_date + '&division=' + data.division + '&company_name=' + data?.company_name + '&reporting_person=' + data.reporting_person + '&reporting_email=' + data.reporting_email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public maternity_register_report_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/maternity_register_report.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date + '&division=' + data.division + '&company_name=' + data?.company_name + '&reporting_person=' + data.reporting_person + '&reporting_email=' + data.reporting_email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public maternity_register_report_2(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/maternity_register_report_pdf.pdf?start_date=' + data.start_date + '&end_date=' + data.end_date + '&company_name=' + data?.company_name + '&reporting_person=' + data.reporting_person + '&reporting_email=' + data.reporting_email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public maternity_register_report_excel_2(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/maternity_register_report.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date + '&company_name=' + data?.company_name + '&reporting_person=' + data.reporting_person + '&reporting_email=' + data.reporting_email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }
}