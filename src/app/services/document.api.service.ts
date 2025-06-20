import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DocumentService extends AppService {

    token: string

    constructor(private http: HttpClient) {
        super();
    }

    public get_document_register() {
        return this.http.get(AppService.base_url + AppService.document + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_document_title() {
        return this.http.get(AppService.base_url + AppService.document_title + '?populate=created_user&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_document_type_division(type: number, division: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.document + '?filters[document_type][$eq]=' + type + '&populate=business_unit&' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_all_document(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.document + '?pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_document_number(documentNumber: any) {
        return this.http.get(AppService.base_url + AppService.document + '?filters[document_number]=' + documentNumber + '&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_document_division(division: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.document + '?' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_document_division_year(startYear: number, endYear: number, division: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.document + '?filters[year][$gte]=' + startYear + '&filters[year][$lte]=' + endYear + '&' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_document_type_status(type: any, statuses: string[], startIndex: number, pageSize: number) {
        const statusFilter = statuses.map(status => `filters[status][$in]=${encodeURIComponent(status)}`).join('&');
        const apiUrl = `${AppService.base_url}${AppService.document}?${statusFilter}&filters[document_type][$eq]=${type}&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`;

        return this.http.get(apiUrl);
        // return this.http.get(AppService.base_url + AppService.document + '?filters[document_type][$eq]=' + type + '&filters[status][$eq]=' + status + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_document_division_status(statuses: string[], division: any, startIndex: number, pageSize: number) {
        const statusFilter = statuses.map(status => `filters[status][$in]=${encodeURIComponent(status)}`).join('&');
        const apiUrl = `${AppService.base_url}${AppService.document}?${statusFilter}&${division}&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`;

        return this.http.get(apiUrl);
        // return this.http.get(AppService.base_url + AppService.document + '?filters[status][$eq]=' + status + '&' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_document_type(type: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.document + '?filters[document_type][$eq]=' + type + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_document_status_year_division(statuses: string[], startYear: number, endYear: number, division: any, startIndex: number, pageSize: number) {
        const statusFilter = statuses.map(status => `filters[status][$in]=${encodeURIComponent(status)}`).join('&');
        const apiUrl = `${AppService.base_url}${AppService.document}?${statusFilter}&filters[year][$gte]=${startYear}&filters[year][$lte]=${endYear}&${division}&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`;
        return this.http.get(apiUrl);
        //  return this.http.get(AppService.base_url + AppService.document + '?filters[status][$eq]=' + status + '&filters[year][$eq]=' + year + '&' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_document_status(statuses: string[], startIndex: number, pageSize: number) {
        const statusFilter = statuses.map(status => `filters[status][$in]=${encodeURIComponent(status)}`).join('&');
        const apiUrl = `${AppService.base_url}${AppService.document}?${statusFilter}&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`;
        return this.http.get(apiUrl);
        // return this.http.get(AppService.base_url + AppService.document + '?filters[division][$eq]='+ status + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }


    public get_unit_specific_document_type(type: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.document + '?filters[division][$eq]=' + division + '&filters[document_type][$eq]=' + type + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_document_type_year(startYear: number, endYear: number, type: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.document + '?filters[year][$gte]=' + startYear + '&filters[year][$lte]=' + endYear + '&filters[document_type][$eq]=' + type + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_document_type_year(year: number, type: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.document + '?filters[division][$eq]=' + division + '&filters[year][$eq]=' + year + '&filters[document_type][$eq]=' + type + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_document_year(startYear: number, endYear: number, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.document + '?filters[year][$gte]=' + startYear + '&filters[year][$lte]=' + endYear + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_document_year(startYear: number, endYear: number, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.document + '?filters[division][$eq]=' + division + '&filters[year][$gte]=' + startYear + '&filters[year][$lte]=' + endYear + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_document_type_year_division(type: number, startYear: number, endYear: number, division: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.document + '?filters[document_type][$eq]=' + type + '&filters[year][$gte]=' + startYear + '&filters[year][$lte]=' + endYear + '&' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_document_type_year_division_status(type: any, startYear: number, endYear: number, division: any, statuses: string[], startIndex: number, pageSize: number) {
        const statusFilter = statuses.map(status => `filters[status][$in]=${encodeURIComponent(status)}`).join('&');
        return this.http.get(AppService.base_url + AppService.document + '?filters[document_type][$eq]=' + type + '&' + statusFilter + '&' + division + '&filters[year][$gte]=' + startYear + '&filters[year][$lte]=' + endYear + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
        //return this.http.get(AppService.base_url + AppService.document + '?filters[document_type][$eq]=' + type + '&filters[year][$eq]=' + year + '&filters[status][$eq]=' + status + '&' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_document_year_status(startYear: number, endYear: number, statuses: string[], startIndex: number, pageSize: number) {
        const statusFilter = statuses.map(status => `filters[status][$in]=${encodeURIComponent(status)}`).join('&');
        const apiUrl = `${AppService.base_url}${AppService.document}?${statusFilter}&filters[year][$gte]=${startYear}&filters[year][$lte]=${endYear}&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`;
        return this.http.get(apiUrl);
        //return this.http.get(AppService.base_url + AppService.document + '?filters[status][$eq]=' + status + '&filters[year][$eq]=' + year + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_document_type_division_status(type: any, division: any, statuses: string[], startIndex: number, pageSize: number) {
        const statusFilter = statuses.map(status => `filters[status][$in]=${encodeURIComponent(status)}`).join('&');
        const apiUrl = `${AppService.base_url}${AppService.document}?${statusFilter}&filters[document_type][$eq]=${type}&${division}&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`;
        return this.http.get(apiUrl);

        // return this.http.get(AppService.base_url + AppService.document + '?filters[document_type][$eq]=' + type + '&filters[status][$eq]=' + status + '&' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_document_type_year_status(type: any, startYear: number, endYear: number, statuses: string[], startIndex: number, pageSize: number) {
        const statusFilter = statuses.map(status => `filters[status][$in]=${encodeURIComponent(status)}`).join('&');
        const apiUrl = `${AppService.base_url}${AppService.document}?${statusFilter}&filters[document_type][$eq]=${type}&filters[year][$gte]=${startYear}&filters[year][$lte]=${endYear}&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`;
        return this.http.get(apiUrl);
        // return this.http.get(AppService.base_url + AppService.document + '?filters[document_type][$eq]=' + type + '&filters[year][$eq]=' + year + '&filters[status][$eq]=' + status + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_issuing_authority() {
        return this.http.get(AppService.base_url + AppService.issuing_authority + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_activities(reference: any) {
        return this.http.get(AppService.base_url + AppService.activity_stream + '?filters[reference_id][id][$eq]=' + reference + '&populate=user_profile&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_all_document_filter(filterValue: any, startIndex: number, pageSize: number) {
        const lowerFilterValue = filterValue.toLowerCase();
        return this.http.get(AppService.base_url + AppService.document + '?filters[$or][0][status][$containsi]=' + lowerFilterValue + '&filters[$or][1][document_number][$containsi]=' + lowerFilterValue + '&filters[$or][2][version_number][$containsi]=' + lowerFilterValue + '&filters[$or][3][document_type][$containsi]=' + lowerFilterValue + '&filters[$or][4][title][$containsi]=' + lowerFilterValue + '&filters[$or][5][division][$containsi]=' + lowerFilterValue + '&filters[$or][6][issuing_authority][$containsi]=' + lowerFilterValue + '&filters[$or][7][issued_date][$containsi]=' + lowerFilterValue + '&filters[$or][8][expiry_date][$containsi]=' + lowerFilterValue + '&filters[$or][9][notify_date][$containsi]=' + lowerFilterValue + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=expiry_date:asc')
    }
    public get_unit_specific_document_filter(filterValue: any, startIndex: number, pageSize: number, division: any) {
        const lowerFilterValue = filterValue.toLowerCase();
        return this.http.get(AppService.base_url + AppService.document + '?filters[$or][0][status][$containsi]=' + lowerFilterValue + '&filters[$or][1][document_number][$containsi]=' + lowerFilterValue + '&filters[$or][2][version_number][$containsi]=' + lowerFilterValue + '&filters[$or][3][document_type][$containsi]=' + lowerFilterValue + '&filters[$or][4][title][$containsi]=' + lowerFilterValue + '&filters[$or][5][division][$containsi]=' + lowerFilterValue + '&filters[$or][6][issuing_authority][$containsi]=' + lowerFilterValue + '&filters[$or][7][issued_date][$containsi]=' + lowerFilterValue + '&filters[$or][8][expiry_date][$containsi]=' + lowerFilterValue + '&filters[$or][9][notify_date][$containsi]=' + lowerFilterValue + '&' + division + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=expiry_date:asc')
    }

    public create_document_file(data: any) {
        return this.http.post(AppService.base_url + AppService.document_file, {
            data: {
                document_name: data.document_name,
                format: data.format,
                document_id: data.document_id,
                document_management: data.document_management,
            }
        })
    }
    public create_document(data: any) {
        return this.http.post(AppService.base_url + AppService.document, {
            data: {
                reported_date: new Date(),
                document_number: data.document_number,
                version_number: data.version_number,
                title: data.title,
                division: data.division,
                issuing_authority: data.issuing_authority,
                issued_date: data.issued_date,
                expiry_date: data.expiry_date,
                day_before_expiry: data.day_before_expiry,
                ten_days_after_expiry: data.ten_days_after_expiry,
                notify_date: data.notify_date,
                status: data.status,
                remarks: data.remarks,
                reporter: data.reporter,
                created: data.reporter,
                reported_person: data.reporterName,
                created_user: data.reporter,
                document_type: data.document_type,
                business_unit: data.business_unit,
                physical_location: data.physical_location,
                document_reviewer: data.document_reviewer,
                document_owner: data.document_owner,
                //document_file: data.docID,
                unique_id: data.uniqueID,
                year: data.year,
                no_expiry: data.no_expiry
            }
        })
    }

    public update_document(data: any) {
        return this.http.put(AppService.base_url + AppService.document + '/' + data.id, {
            data: {
                document_type: data.document_type,
                title: data.title,
                division: data.division,
                remarks: data.remarks,
                issuing_authority: data.issuing_authority,
                notify_date: data.notify_date,
                expiry_date: data.expiry_date,
                day_before_expiry: data.day_before_expiry,
                ten_days_after_expiry: data.ten_days_after_expiry,
                issued_date: data.issued_date,
                document_number: data.document_number,
                version_number: data.version_number,
                updated_user: data.updated_by,
                physical_location: data.physical_location,
                document_reviewer: data.document_reviewer,
                document_owner: data.document_owner,
                business_unit: data.business_unit,
                //document_file: data.docID,
                status: data.status,
                year: data.year,
                no_expiry: data.no_expiry
            }
        })
    }

    public create_title(type: any, title: any, user: any) {
        return this.http.post(AppService.base_url + AppService.document_title, {
            data: {
                category: type,
                title: title,
                created_user: user

            }
        })
    }

    public create_issuing_authority(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.issuing_authority, {
            data: {
                name: name,
                created_user: user
            }
        })
    }

    //get document details
    public get_document_details(orgID: any, reference: any) {
        const url = AppService.base_url + AppService.document + '?filters[id][$eq]=' + reference + '&populate=business_unit&populate=document_histories.document_files.*,document_files.*,document_histories.*,created_user.*,updated_user.*,document_histories.created_user.*,document_histories.updated_user.*' + '&publicationState=preview';
        return this.http.get(url);
    }


    public get_document_details_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.document + '?filters[unique_id][$eq]=' + reference)
    }

    //connect document
    public connect_document(docManID: any, docID: any) {
        return this.http.put(AppService.base_url + AppService.document + '/' + docManID, {
            data: {
                document_file: docID
            }
        })
    }
    public update_doc(name: any, format: any, id: any) {
        return this.http.put(AppService.base_url + AppService.document + '/' + id, {
            data: {
                document_name: name,
                document_format: format,
                document_id: id

            }
        })
    }
    public delete_document(id: any) {
        return this.http.delete(AppService.base_url + AppService.document_file + '/' + id,)
    }

    public create_document_email(uuid: any, emailID: any) {
        return this.http.post(AppService.base_url + AppService.document_email, {
            data: {
                document_uuid: uuid,
                email_id: emailID.email_id
            }
        })
    }

    public document_backup(data: any, docIDs: number[], histData: any) {
        return this.http.post(AppService.base_url + AppService.document_history, {
            data: {
                document_type: data.document_type,
                version_number: data.version_number,
                title: data.title,
                division: data.division,
                remarks: data.remarks,
                issuing_authority: data.issuing_authority,
                notify_date: data.notify_date,
                expiry_date: data.expiry_date,
                issued_date: data.issued_date,
                document_number: data.document_number,
                updated_user: data.updated_by,
                created_user: data.reporterID,
                physical_location: data.physical_location,
                document_reviewer: data.document_reviewer,
                document_owner: data.document_owner,
                document_file: data.docID,
                status: data.status,
                year: data.year,
                document_management: data.id,
                document_files: docIDs,
                unique_id: data.unique_id,
                revision_date: histData.revision_date,
                revision_number: histData.revision_number,
                no_expiry: data.no_expiry
            }
        })
    }

    public new_document(data: any, docID: any) {
        return this.http.put(AppService.base_url + AppService.document + '/' + docID, {
            data: {
                //document_type: data.document_type,
                //title: data.title,
                //division: data.division,
                remarks: data.remarks,
                //issuing_authority: data.issuing_authority,
                notify_date: data.notify_date,
                expiry_date: data.expiry_date,
                day_before_expiry: data.day_before_expiry,
                ten_days_after_expiry: data.ten_days_after_expiry,
                issued_date: data.issued_date,
                document_number: data.document_number,
                version_number: data.version_number,
                updated_user: data.updated_by,
                created_user: data.updated_by,
                physical_location: data.physical_location,
                document_reviewer: data.document_reviewer,
                document_owner: data.document_owner,
                status: data.status,
                year: data.year,
                document_files: null,
                no_expiry: data.no_expiry,
                expire_notification: null,
                escallation_notification: null,
                day_before_expiry_notification: null,
                ten_days_after_expiry_notification: null,
                to_expire_notification: null
            }
        })
    }

    public create_activity_stream(action: any, data: any) {
        return this.http.post(AppService.base_url + AppService.activity_stream, {
            data: {
                action: action,
                reference_number: data.document_number,
                date: new Date(),
                user_profile: data.user,
                module: 'Document Management',
                reference_id: data.id,
                user_email: data.user_email
            }
        })
    }

    public delete_title(ID: any) {
        return this.http.put(AppService.base_url + AppService.document_title + '/' + ID, {
            data: {
                publishedAt: null
            }

        });
    }

    //get report

    public document_register_report_status_pdf(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_v1.pdf?business_unit=' + data.division + '&document_type=' + data.document_type + '&year=' + data.year + '&status=' + data.status + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })

    }
    public document_register_report_pdf(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_v1.pdf?business_unit=' + data.division + '&document_type=' + data.document_type + '&year=' + data.year + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })

    }

    public document_register_report_status_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_excel_v1.xlsx?business_unit=' + data.division + '&document_type=' + data.document_type + '&year=' + data.year + '&status=' + data.status + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })

    }

    public document_register_report_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_excel_v1.xlsx?business_unit=' + data.division + '&document_type=' + data.document_type + '&year=' + data.year + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })

    }


    public document_register_report(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_v1.pdf?business_unit=' + data.division + '&document_type=' + data.document_type + '&year=' + data.year + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    // public document_register_report_excel(data: any): any {
    //     return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_excel_v1.xlsx?business_unit=' + data.division + '&document_type=' + data.document_type + '&year=' + data.year + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    // }


    //get report
    public document_register_report_division_type(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_v1.pdf?business_unit=' + data.division + '&document_type=' + data.document_type + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public document_register_report_division_type_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_excel_v1.xlsx?business_unit=' + data.division + '&document_type=' + data.document_type + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    //get report
    public document_register_report_division_year(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_v1.pdf?business_unit=' + data.division + '&year=' + data.year + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public document_register_report_division_year_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_excel_v1.xlsx?business_unit=' + data.division + '&year=' + data.year + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    //get report
    public document_register_report_type_year(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_v1.pdf?document_type=' + data.document_type + '&year=' + data.year + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public document_register_report_type_year_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_excel_v1.xlsx?document_type=' + data.document_type + '&year=' + data.year + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    //get report
    public document_register_report_all(): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_v1.pdf?j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public document_register_report_all_excel(): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_excel_v1.xlsx?j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    //get report
    public document_register_report_division(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_v1.pdf?business_unit=' + data.division + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public document_register_report_division_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_excel_v1.xlsx?business_unit=' + data.division + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    //get report
    public document_register_report_type(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_v1.pdf?document_type=' + data.document_type + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public document_register_report_type_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_excel_v1.xlsx?document_type=' + data.document_type + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    //get report
    public document_register_report_year(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_v1.pdf?year=' + data.year + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public document_register_report_year_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_document_register_excel_v1.xlsx?year=' + data.year + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }
}