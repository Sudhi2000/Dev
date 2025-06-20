import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MedicineInventoryService extends AppService {

    token: string

    constructor(private http: HttpClient) {
        super();
    }
    public get_medicine_dash(start: any, end: any) {
        return this.http.get(AppService.base_url + AppService.medicine_inventory + '?filters[delivery_date][$gte]=' + start + '&filters[delivery_date][$lte]=' + end + '&filters[status]=Published&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_medicine_division_dash(start: any, end: any, userDivision: any) {
        return this.http.get(AppService.base_url + AppService.medicine_inventory + '?filters[delivery_date][$gte]=' + start + '&filters[delivery_date][$lte]=' + end + '&' + userDivision + '&filters[status]=Published&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_medicine_name() {
        return this.http.get(AppService.base_url + AppService.medicine_name + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_MedicineName_details(id: any) {
        return this.http.get(AppService.base_url + AppService.medicine_name + "/" + id)
    }

    public get_medicine_type() {
        return this.http.get(AppService.base_url + AppService.medicine_type + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public delete_medicine_name(id: any) {
        return this.http.delete(AppService.base_url + AppService.medicine_name + '/' + id)
    }
    public get_medicine_inventory() {
        return this.http.get(AppService.base_url + AppService.medicine_inventory + '?populate[0]=approver&populate[1]=reporter.image&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_med_req_approvers(orgID: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][med_inv_approval][$eq]=true&filters[$and][1][user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_unit_specific_med_req_approvers(orgID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][med_inv_approval][$eq]=true&populate=divisions&' + division + '&filters[$and][1][user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_medicine_approver(userID: any) {
        return this.http.get(AppService.base_url + AppService.medicine_inventory + '?filters[approver]=' + userID + '&filters[status]=Open&populate[0]=approver&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_medicine_details_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.medicine_inventory + '?filters[reference_number][$eq]=' + reference + '&populate=*')
    }
    public get_medicine_request_history(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.medicine_request + '?populate[0]=reviewer&populate[1]=reviewer.image&populate[2]=approver&populate[3]=approver.image&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_medicine_request_history(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.medicine_request + '?' + division + '&populate[0]=reviewer&populate[1]=reviewer.image&populate[2]=approver&populate[3]=approver.image&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_medicine_request() {
        return this.http.get(AppService.base_url + AppService.medicine_request + '?populate[0]=reviewer&populate[1]=reviewer.image&populate[2]=approver&populate[3]=approver.image&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_medicine_request_count() {
        return this.http.get(AppService.base_url + AppService.medicine_request + '?publicationState=preview&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_medicine_request_details(id: any) {
        return this.http.get(AppService.base_url + AppService.medicine_request + '/' + id + '?populate=approver')
    }
    public get_medicine_request_refe(reference: any) {
        return this.http.get(AppService.base_url + AppService.medicine_request + '?filters[reference_number]=' + reference + '&populate=approver&populate=reporter&populate=business_unit')
    }
    public get_medicine_request_tasks(userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.medicine_request + '?filters[approver]=' + userID + '&filters[status]=Open&populate[0]=reporter&populate[1]=reporter.image&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_medicine_request_tasks(userID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.medicine_request + '?' + division + '&filters[approver]=' + userID + '&filters[status]=Open&populate[0]=reporter&populate[1]=reporter.image&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_inventory_details(id: any) {
        return this.http.get(AppService.base_url + AppService.medicine_inventory + "/" + id + '?populate=approver&populate=reporter&populate=medicine_disposals&populate=business_unit')
    }
    public get_medicine_supplier() {
        return this.http.get(AppService.base_url + AppService.medicine_supplier + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_storage_place() {
        return this.http.get(AppService.base_url + AppService.storage_place + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_test_lab() {
        return this.http.get(AppService.base_url + AppService.test_lab + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_medicine_inventory_refe(reference: any) {
        return this.http.get(AppService.base_url + AppService.medicine_inventory + '?filters[reference_number]=' + reference + '&populate=approver&populate=reporter')
    }
    public get_medicine_transaction(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.medicine_transaction + '?populate[0]=authorized_person&populate[1]=authorized_person.image&populate[2]=disposals&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_unit_specific_medicine_transaction(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.medicine_transaction + '?' + division + '&populate[0]=authorized_person&populate[1]=authorized_person.image&populate[2]=disposals&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public medicine_transactions() {
        return this.http.get(AppService.base_url + AppService.medicine_transaction + '?pagination[limit]=-1&sort[0]=id:desc&populate=business_unit')
    }
    public inventory_register(startIndex: number, pageSize: number, filteredQuery: string) {
        return this.http.get(AppService.base_url + AppService.medicine_inventory + '?populate[0]=approver&populate[2]=reporter' + filteredQuery + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public unit_specific_inventory_register(startIndex: number, pageSize: number, division: any, filteredQuery: string) {
        return this.http.get(AppService.base_url + AppService.medicine_inventory + '?' + division + '&populate[0]=approver&populate[2]=reporter' + filteredQuery + '&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public create_medicine_transactions(data: any, reference: any) {
        return this.http.post(AppService.base_url + AppService.medicine_transaction, {
            data: {
                reference_number: reference,
                transaction_date: data.transactionDate,
                division: data.division,
                authorized_person: data.authPerson,
                medicine: data.medicine,
                total_quantity: data.availableQuan,
                issued_quantity: data.issuingQuan,
                balance: data.balance,
                unit: data.unit,
                created_user: data.createdBy,
                cost: data.cost,
                inventory: data.inventory,
                medicine_uuid: data.medicine_uuid,
                business_unit: data.business_unit,
            }
        })
    }
    public create_medicine_supplier(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.medicine_supplier, {
            data: {
                name: data.name,
                contact_number: data.contact_number,
                email: data.email_id,
                location: data.location,
                created_user: user
            }
        })
    }
    public create_medicine_type(type: any, user: any) {
        return this.http.post(AppService.base_url + AppService.medicine_type, {
            data: {
                type: type,
                created_user: user
            }
        })
    }
    //create inventory
    public create_medicine_inventory(data: any) {


        return this.http.post(AppService.base_url + AppService.medicine_inventory, {
            data: {
                reference_number: data.reference_number,
                medicine_name: data.medicine_name,
                generic_name: data.generic_name,
                division: data.division,
                requested_quantity: data.requested_quantity,
                reporter: data.reporter_id,
                status: data.status,
                medicine_uuid: data.medicine_uuid,
                approver: data.updated_By,
                request_date: data.request_date,
                medicine_request: data.id,
                approver_remarks: data.remarks,
                purchase_executive: data.purchase_executive,
                business_unit: data.business_unit,
                dosage_strength: data.dosage_strength,
                form: data.form,
                medicine_type: data.medicine_type,
            }
        })
    }

    public create_request(data: any) {


        return this.http.post(AppService.base_url + AppService.medicine_request, {
            data: {
                request_date: data.reported_date,
                reference_number: data.reference_number,
                medicine_name: data.medicine_name?.attributes?.name,
                generic_name: data.generic_name,
                division: data.division,
                requested_quantity: data.requested_quantity,
                reporter: data.reporter,
                status: data.status,
                medicine_uuid: data.medicine_uuid,
                approver: data.approver,
                business_unit: data.business_unit,
                dosage_strength: data.dosage_strength,
                form: data.form,
                medicine_type: data.medicine_type,
            }
        })
    }
    public create_medicine(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.medicine_name, {
            data: {
                name: data.name,
                created_user: user,
                uuid: data.uuid,
                generic_name: data.generic_name,
                dosage_strength: data.dosage_strength,
                form: data.form,
                medicine_type: data.medicine_type,
            }
        })
    }
    public create_medicine_disposal(data: any) {
        return this.http.post(AppService.base_url + AppService.medicine_disposal, {
            data: {
                authorized_contractor: data.authorized_contractor,
                disposal_details: data.disposal_details,
                disposed_quantity: data.disposed_quantity,
                disposal_date: data.disposal_date,
                inventory: data.inventory,
                cost: data.cost,
                medicine_name: data.medicine_name,
                balance_quantity: data.balance_quantity,
                available_quantity: data.available_quantity,
                unit: data.unit
            }
        })

    }
    public update_inventory(data: any) {
        return this.http.put(AppService.base_url + AppService.medicine_inventory + '/' + data.id, {
            data: {
                supplier_email_id: data.email_id,
                supplier_type: data.supplier_type,
                location: data.location,
                dosage_strength: data.dosage_strength,
                form: data.form,
                supplier_name: data.supplier_name,
                supplier_contact_number: data.contact_number,
                manufacturer_name: data.manufacturer_name,
                delivered_quantity: data.delivered_quantity,
                delivered_unit: data.delivered_unit,
                purchased_amount: data.purchased_amount,
                threshold_limit: data.threshold_limit,
                delivery_date: data.delivery_date,
                invoice_reference: data.invoice_reference,
                status: data.status,
                updatedBy: data.reporter,
                balance_quantity: data.delivered_quantity,
                usage_instructions: data.usage_instructions,
                manufacturing_date: data.manufacturing_date,
                expiry_date: data.expiry_date,
                invoice_date: data.invoice_date,
                published_by: data.published_by,
                reorder_threshold: data.reorder_threshold,
                batch_number: data.batch_number,
                unit_cost: data.unit_cost,
                medicine_type: data.medicine_type
            }
        })
    }
    public update_approver_status(data: any) {
        return this.http.put(AppService.base_url + AppService.medicine_request + '/' + data.id, {
            data: {
                status: data.status,
                approver_remarks: data.remarks,
                updated_By: data.updated_By,

            }
        })
    }
    public update_balance_inventory(id: any, issued: any, balance: any) {
        return this.http.put(AppService.base_url + AppService.medicine_inventory + '/' + id, {
            data: {
                issued_quantity: issued,
                balance_quantity: balance
            }
        })
    }
    public update_disposal_inventory(id: any, disposed: any, balance: any) {
        return this.http.put(AppService.base_url + AppService.medicine_inventory + '/' + id, {
            data: {
                disposed_of_quantity: disposed,
                balance_quantity: balance
            }
        })
    }
    public update_medicine_name(data: any) {
        console.log
        return this.http.put(AppService.base_url + AppService.medicine_name + '/' + data.id, {
            data: {
                name: data.name,
                generic_name: data.generic_name,
                dosage_strength: data.dosage_strength,
                form: data.form,
                medicine_type: data.medicine_type,

            }
        })
    }

    //get medicine_inventory reference number
    public get_medicine_inventory_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.medicine_inventory + '?filters[reference_number]=' + reference)
    }

    public medicineInventoryReport(id: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/medicine_inventory_individual_report.pdf?ID=' + id + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    //get report
    public medicine_inventory_report(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_medicine_inventory_report_pdf.pdf?start_date=' + data.start_date + '&end_date=' + data.end_date + '&division=' + data.division + '&company_name=' + data.company_name + '&default_date=' + data.default_date + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public medicine_inventory_report_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_medicine_inventory_report_excel.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date + '&division=' + data.division + '&company_name=' + data.company_name + '&default_date=' + data.default_date + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public medicine_inventory_report_1(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_medicine_inventory_report_pdf.pdf?start_date=' + data.start_date + '&end_date=' + data.end_date + '&division=' + data.division + '&company_name=' + data.company_name + '&default_date=' + data.default_date + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public medicine_inventory_report_1_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_medicine_inventory_report_excel.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date + '&division=' + data.division + '&company_name=' + data.company_name + '&default_date=' + data.default_date + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public medicine_inventory_report_2(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_medicine_inventory_report_pdf.pdf?year=' + data.year + '&division=' + data.division + '&company_name=' + data.company_name + '&default_date=' + data.default_date + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public medicine_inventory_report_2_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_medicine_inventory_report_excel.xlsx?year=' + data.year + '&division=' + data.division + '&company_name=' + data.company_name + '&default_date=' + data.default_date + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public medicine_inventory_report_3(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_medicine_inventory_report_pdf.pdf?year=' + data.year + '&company_name=' + data.company_name + '&default_date=' + data.default_date + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public medicine_inventory_report_3_excel(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_medicine_inventory_report_excel.xlsx?year=' + data.year + '&company_name=' + data.company_name + '&default_date=' + data.default_date + '&reporting_person=' + data.reporting_person + '&reporting_mail=' + data.reporting_mail + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }
}