import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';
import { chemical_inventory, chemical_request } from './schemas';
import { category } from '../apps/audit-inspection/audit-calendar/audit-calendar/data';

@Injectable({
    providedIn: 'root'
})
export class ChemicalService extends AppService {

    token: string

    constructor(private http: HttpClient) {
        super();
    }

    public get_chemical_name() {
        return this.http.get(AppService.base_url + AppService.chemical_name + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_product_standard() {
        return this.http.get(AppService.base_url + AppService.product_standard + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public delete_commercial_name(id: any) {
        return this.http.delete(AppService.base_url + AppService.chemical_name + '/' + id)
    }
    public get_chemical_department() {
        return this.http.get(AppService.base_url + AppService.department + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_supplier_name() {
        return this.http.get(AppService.base_url + AppService.supplier_name + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_hazard_statement() {
        return this.http.get(AppService.base_url + AppService.hazard_statement + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_storage_place() {
        return this.http.get(AppService.base_url + AppService.storage_place + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_ppe() {
        return this.http.get(AppService.base_url + AppService.ppe_list + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_test_lab() {
        return this.http.get(AppService.base_url + AppService.test_lab + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_positive_list() {
        return this.http.get(AppService.base_url + AppService.positive_list + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_chemical_inventory() {
        return this.http.get(AppService.base_url + AppService.chemical + '?populate[0]=chemical_approver&populate[1]=chemical_approver.image&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_chemical_transaction() {
        return this.http.get(AppService.base_url + AppService.chemical_transaction + '?populate[0]=disposals&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_chemical_disposal() {
        return this.http.get(AppService.base_url + AppService.chemical + '?populate[0]=chemical_approver&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_chemical_approver(userID: any) {
        return this.http.get(AppService.base_url + AppService.chemical + '?filters[chemical_approver]=' + userID + '&filters[status]=Open&populate[0]=chemical_approver&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_chemical_details_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.chemical + '?filters[reference_number][$eq]=' + reference + '&populate=*')
    }

    public get_disposal_details_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.chemical_disposal + '?filters[chemical_transaction][id][$eq]=' + reference + '&populate=chemical_transaction&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_inventory_details(orgID: any, reference: any) {
        return this.http.get(AppService.base_url + AppService.chemical + '?filters[id][$eq]=' + reference + '&populate[0]=certificates&populate[1]=certificates.chemical_certificate_doc&populate=chemical_approver&populate=chemical_reporter&populate=msds_document&populate=updated_By&populate=chemical_reporter')
    }
    public get_transaction_details(reference: any) {
        return this.http.get(AppService.base_url + AppService.chemical_transaction + '?filters[id][$eq]=' + reference + '&populate=*')
    }
    public get_chemical_inventory_approved() {
        return this.http.get(AppService.base_url + AppService.chemical + '?filters[status]=Approved&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_chemical_inventory_approved_name(name: any) {
        return this.http.get(AppService.base_url + AppService.chemical + '?filters[status]=Approved&filters[commercial_name]=' + name + '&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_transaction_details_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.chemical_transaction + '?filters[reference_number][$eq]=' + reference + '&populate=*')
    }
    // public count_chemical_transaction(headers:HttpHeaders){
    //     return this.http.get(ChemicalAppService.base_url+ChemicalAppService.count_chemical_transaction,{headers})
    //   }

    public get_chem_approvers() {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][chem_action][$eq]=true&filters[$and][1][user][blocked][$eq]=false&populate=divisions&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_unit_specific_chem_approvers(division: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][chem_action][$eq]=true&populate=divisions&' + division + '&filters[$and][1][user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_chem_reviewers() {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][chem_reviewer_action][$eq]=true&filters[$and][1][user][blocked][$eq]=false&populate=divisions&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_unit_specific_get_chem_reviewers(division: any) {
        return this.http.get(AppService.base_url + AppService.profile + '?filters[$and][0][user][chem_reviewer_action][$eq]=true&populate=divisions&' + division + '&filters[$and][1][user][blocked][$eq]=false&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_msds_document(data: any) {
        return this.http.get(AppService.base_url + AppService.msds_document + '?filters[document_id]=' + data)
    }

    public get_storage_condition_requirement() {
         return this.http.get(AppService.base_url + AppService.storage_condition_requirement +'?pagination[limit]=-1&sort[0]=id:desc');
      }
      
  public create_storage_condition_requirement(name: any,user:any) {
    return this.http.post(AppService.base_url + AppService.storage_condition_requirement, {
      data: {
        name: name,
        created_user: user
      },
    });
  }
  public get_storage_condition_details(id: any) {
    return this.http.get(AppService.base_url + AppService.storage_condition_requirement + "/" + id)
  }

  public update_storage_condition_requirement(data: any, user: any) {
    return this.http.put(AppService.base_url + AppService.storage_condition_requirement + '/' + data.id, {
      data: {
        name: data.storage_condition,
        created_user: user
      }
    })
  }
  public delete_storage_condition_requirement(id: any) {
    return this.http.delete(AppService.base_url + AppService.storage_condition_requirement + '/' + id)
  }

    public create_name(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.chemical_name, {
            data: {
                name: data.name,
                created_user: user,
                uuid: data.uuid,
                substance_name: data.substance_name,
                formula: data.formula,
                chemical_form_type: data.chemical_form,
                colour_index: data.colour_index,
                hazard_type: data.hazardType,
                reach_registration_number: data.reach_regi_number,
                use_of_ppe: data.use_of_ppe,
                where_why: data.where_why,
                zdhc_level: data.zdhc_level,
                ZDHC_Category: data.zdhc_use_category,
                ghs_classification: data.ghsClassification,
                cas_no: data.cas_no,
                category: data.category

            }
        })
    }

    public update_commercial_name(data: any, user: any) {
        return this.http.put(AppService.base_url + AppService.chemical_name + '/' + data.id, {
            data: {
                name: data.name,
                created_user: user,
                uuid: data.uuid,
                substance_name: data.substance_name,
                formula: data.formula,
                chemical_form_type: data.chemical_form,
                colour_index: data.colour_index,
                hazard_type: data.hazardType,
                reach_registration_number: data.reach_regi_number,
                use_of_ppe: data.use_of_ppe,
                where_why: data.where_why,
                zdhc_level: data.zdhc_level,
                ZDHC_Category: data.zdhc_use_category,
                ghs_classification: data.ghsClassification,
                cas_no: data.cas_no,
                category: data.category

            }
        })
    }

    public create_supplier_name(data: any, user: any) {
        const { name, email_id, location, contact_number } = data
        return this.http.post(AppService.base_url + AppService.supplier_name, {

            data: {
                name: name,
                contact_number,
                location,
                email: email_id,
                created_user: user
            }
        })
    }

    public update_supplier_name(data: any) {
        return this.http.put(AppService.base_url + AppService.supplier_name + '/' + data.id, {

            data: {
                name: data.name,
                contact_number: data.contact_number,
                location: data.location,
                email: data.email_id,
            }
        })
    }


    public create_storage_place(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.storage_place, {
            data: {
                name: name,
                created_user: user
            }
        })
    }
    public create_ppe(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.ppe_list, {
            data: {
                ppe_name: name,
                created_user: user
            }
        })
    }
    public create_product_standard(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.product_standard, {
            data: {
                name: name,
                created_user: user
            }
        })
    }
    public create_test_lab(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.test_lab, {
            data: {
                name: name,
                created_user: user
            }
        })
    }
    public create_positive_list(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.positive_list, {
            data: {
                name: name,
                created_user: user
            }
        })
    }

    public create_certificate(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.certificate, {
            data: {
                certificate_name: data.certificate_name,
                certificate_issued_date: data.certificate_issued_date,
                certificate_expiry_date: data.certificate_expiry_date,
                test_date: data.test_date,
                labs: data.test_lab,
                positive_tests: data.positive_list,
                remarks: data.remarks,
                //certificate:data.certificate,
                chemical_inventory: id,
            }
        })
    }
    //create inventory
    public report_inventory(data: any) {
        return this.http.post(AppService.base_url + AppService.chemical, {
            data: {
                reported_date: new Date(),
                reference_number: data.reference_number,
                commercial_name: data.commercial_name,
                substance_name: data.substance_name,
                formula: data.formula,
                chemical_approver: data.approver,
                requested_customer: data.requested_customer,
                requested_merchandiser: data.requested_merchandiser,
                supplier_name: data.supplier_name,
                balance: data.delivered_quantity,
                contact_number: data.contact_number,
                email_id: data.email_id,
                type: data.supplier_type,
                location: data.location,
                zdhc_level: data.zdhc_level,
                cas_no: data.cas_no,
                colour_index: data.colour_index,
                msds_sds: data.msds_sds,
                zdhc_mrsl: data.zdhc_mrsl,
                msds_sds_issued_date: data.msds_sds_issued_date,
                msds_sds_expiry_date: data.msds_sds_expiry_date,
                zdhc_use_category: data.zdhc_use_category,
                division: data.division,
                where_why: data.where_why,
                reach_regi_number: data.reach_regi_number,
                use_of_ppe: data.use_of_ppe,
                hazard_type: data.hazardType,
                ghs_classification: data.ghsClassification,
                storage_condition: data.storage_condition,
                storage_place: data.storage_place,
                delivered_quantity: data.delivered_quantity,
                delivered_unit: data.delivered_unit,
                purchased_amount: data.purchased_amount,
                threshold_limit: data.threshold_limit,
                delivery_date: data.delivery_date,
                invoice_reference: data.invoice_reference,
                chemical_reporter: data.reporter,
                status: data.status,
                business_unit: data.business_unit
            }
        })
    }
    //create transaction
    public create_transaction(data: any) {
        return this.http.post(AppService.base_url + AppService.chemical_transaction, {
            data: {
                transaction_date: new Date(),
                reference_number: data.reference_number,
                authorized_person: data.authorised_person,
                chemical: data.chemical,
                total_quantity: data.total_quantity,
                issued_quantity: data.issuing_quantity,
                disposed_quantity: data.disposed_quantity,
                balance: data.balance,
                department: data.department,
                division: data.division,
                unit: data.unit,
                business_unit: data.business_unit

            }
        })
    }

    public update_msds_doc(name: any, format: any, id: any) {
        return this.http.put(AppService.base_url + AppService.chemical + '/' + id, {
            data: {
                msds_doc_name: name,
                msds_doc_format: format,
                msds_doc_id: id

            }
        })
    }
    public update_certificate(name: any, format: any, id: any) {
        return this.http.put(AppService.base_url + AppService.certificate + '/' + id, {
            data: {
                file_name: name,
                file_format: format,
                file_id: id

            }
        })
    }
    //update action
    public update_status(data: any) {
        return this.http.put(AppService.base_url + AppService.chemical + '/' + data.id, {
            data: {
                status: data.status,
                updated_By: data.updatedBy,
            }
        })
    }
    public create_department(name: any, user: any) {
        return this.http.post(AppService.base_url + AppService.department, {
            data: {
                department_name: name,
                created_user: user

            }
        })
    }
    public create_dispose(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.chemical_disposal, {
            data: {
                authorized_contractor: data.authorized_contractor,
                disposal_details: data.disposal_details,
                disposed_quantity: data.disposed_quantity,
                chemical_transaction: id,
                disposal_date: data.disposal_date
            }
        })
    }


    public update_chemical_inventory_usage(id: any, Used: any, Balance: any) {
        return this.http.put(AppService.base_url + AppService.chemical + '/' + id, {
            data: {
                used: Used,
                balance: Balance

            }
        })
    }
    public delete_disposal(id: any) {
        return this.http.delete(AppService.base_url + AppService.chemical_disposal + '/' + id, {

        })
    }

    public delete_supplier_name(id: any) {
        return this.http.delete(AppService.base_url + AppService.supplier_name + '/' + id)
    }

    public update_transaction_disposal(id: any, Disposed: any, Balance: any) {
        return this.http.put(AppService.base_url + AppService.chemical_transaction + '/' + id, {
            data: {
                disposed_quantity: Disposed,
                balance: Balance

            }
        })
    }

    public create_msds_document(data: any) {
        return this.http.post(AppService.base_url + AppService.msds_document, {
            data: {
                document_name: data.document_name,
                document_format: data.document_format,
                chemical_request: data.chemical_request,
                document_id: data.document_id,
                chemical_inventory: data.chemical_inventory
            }
        })
    }
    public create_chemcheck_report(data: any) {
        return this.http.post(AppService.base_url + AppService.chemcheck_report, {
            data: {
                document_name: data.document_name,
                document_format: data.document_format,
                document_id: data.document_id,
                chemical_request: data.chemical_request,
                chemical_inventory: data.chemical_inventory
            }
        })
    }
    public update_chemcheck_report(id: any,data:any) {
        return this.http.put(AppService.base_url + AppService.chemcheck_report + '/' + id, {
            data: {
                chemical_inventory: data
            }
        })
    }

    public create_req_msds_document(data: any) {
        return this.http.post(AppService.base_url + AppService.msds_document, {
            data: {
                document_name: data.document_name,
                document_format: data.document_format,
                chemical_request: data.chemical_request,
                document_id: data.document_id
            }
        })
    }

    public create_certificate_document(data: any) {
        return this.http.post(AppService.base_url + AppService.certificate_document, {
            data: {
                document_name: data.document_name,
                document_format: data.document_format,
                chemical_certificate: data.chemical_certificate,
                document_id: data.document_id
            }
        })
    }

    public disconnect_msds_document(id: any) {
        return this.http.put(AppService.base_url + AppService.msds_document + '/' + id, {
            data: {
                document_id: null,
                document_name: null,
                document_format: null,
            }
        })
    }
    public disconnect_chemcheck_report(id: any) {
        return this.http.put(AppService.base_url + AppService.chemcheck_report + '/' + id, {
            data: {
                document_id: null,
                document_name: null,
                document_format: null,
                chemical_inventory: null,
                chemical_request: null
            
            }
        })
    }

    public attach_msds_document(id: any, data: any) {
        return this.http.put(AppService.base_url + AppService.msds_document + '/' + id, {
            data: {
                document_name: data.document_name,
                document_format: data.document_format,
                document_id: data.document_id


            }
        })
    }

    public create_apeo_statement(data: any) {
        return this.http.post(AppService.base_url + AppService.apeo_statement, {
            data: {
                statement_name: data.statement_name,
                statement_format: data.statement_format,
                statement_id: data.statement_id,
                chemical_inventory: data.chemical_inventory,
            }
        })
    }

    public attach_apeo_statement(id: any, data: any) {
        return this.http.put(AppService.base_url + AppService.apeo_statement + '/' + id, {
            data: {
                statement_name: data.statement_name,
                statement_format: data.statement_format,
                statement_id: data.statement_id

            }
        })
    }

    public add_apeo_status(id: any) {
        return this.http.put(AppService.base_url + AppService.chemical + '/' + id, {
            data: {
                apeo_npe: true,

            }
        })
    }

    public disconnect_apeo_statement(id: any) {
        return this.http.delete(AppService.base_url + AppService.apeo_statement + '/' + id, {

        })
    }

    public add_msds_status(id: any) {
        return this.http.put(AppService.base_url + AppService.chemical_inventory + '/' + id, {
            data: {
                msds_sds: true,

            }
        })
    }

    public add_req_msds_status(id: any) {
        return this.http.put(AppService.base_url + AppService.chemical_request + '/' + id, {
            data: {
                msds_sds: true,

            }
        })
    }

    public update_certificates(data: any) {
        return this.http.put(AppService.base_url + AppService.certificate + '/' + data.id, {
            data: {
                certificate_issued_date: data.certificate_issued_date,
                certificate_expiry_date: data.certificate_expiry_date,
                certificate_name: data.certificate_name,
                test_date: data.test_date,
                remarks: data.remarks,
                positive_tests: data.positive_tests,
                labs: data.test_lab

            }
        })
        // return this.http.put(AppService.base_url+AppService.certificate,+'/'+data.id,{
        //     data:{
        //         certificate_issued_date:data.certificate_issued_date
        //     }
        // })
    }

    public attach_certificate(id: any, data: any) {
        return this.http.put(AppService.base_url + AppService.certificate_document + '/' + id, {
            data: {
                document_name: data.document_name,
                document_format: data.document_format,
                document_id: data.document_id


            }
        })
    }

    public disconnect_certificate_document(id: any) {
        return this.http.put(AppService.base_url + AppService.certificate_document + '/' + id, {
            data: {
                document_id: null
            }
        })
    }


    //////############ new

    public create_request(data: any) {
        return this.http.post(AppService.base_url + AppService.chemical_request, {
            data: {
                created_date: data.created_date,
                request_date: data.request_date,
                reference_number: data.reference_number,
                commercial_name: data.commercial_name,
                substance_name: data.substance_name,
                formula: data.formula,
                reach_registration_number: data.reach_regi_number,
                ZDHC_use_category: data.zdhc_use_category,
                usage: data.where_why,
                division: data.division,
                requested_customer: data.requested_customer,
                requested_merchandiser: data.requested_merchandiser,
                reviewer: data.reviewer,
                reporter: data.reporter,
                status: data.status,
                chemical_uuid: data.chemical_uuid,
                // reviewer_notification: false,
                requested_quantity: data.requested_quantity,
                requested_unit: data.requested_unit,
                business_unit: data.business_unit,
                zdhc_level: data.zdhc_level,
                cas_no: data.cas_no,
                colour_index: data.colour_index,
                use_of_ppe: data.use_of_ppe,
                hazard_type: data.hazardType,
                ghs_classification: data.ghsClassification,
                chemical_form_type: data.chemical_form,
                product_standard: data.product_standard,
                reviewer_notification: data.reviewer_notification,
                msds_sds: data.msds_sds,
                msds_doc_status: data.msds_doc_status,
                msds_sds_issued_date: data.msds_sds_issued_date,
                msds_sds_expiry_date: data.msds_sds_expiry_date,
                category: data.category,
                approval_valid_date: data.approval_valid_date
                //msds_document: data.msds_document
            }
        })
    }
    public create_approval_request(data: any) {
        return this.http.post(AppService.base_url + AppService.chemical_request, {
            data: {
                created_date: data.created_date,
                request_date: data.request_date,
                reference_number: data.reference_number,
                commercial_name: data.commercial_name,
                substance_name: data.substance_name,
                formula: data.formula,
                reach_registration_number: data.reach_regi_number,
                ZDHC_use_category: data.zdhc_use_category,
                usage: data.where_why,
                division: data.division,
                requested_customer: data.requested_customer,
                requested_merchandiser: data.requested_merchandiser,
                reviewer: data.reporter,
                approver: data.reporter,
                reporter: data.reporter,
                status: "Approved",
                chemical_uuid: data.chemical_uuid,
                // reviewer_notification: false,
                requested_quantity: data.requested_quantity,
                requested_unit: data.requested_unit,
                business_unit: data.business_unit,
                zdhc_level: data.zdhc_level,
                cas_no: data.cas_no,
                colour_index: data.colour_index,
                use_of_ppe: data.use_of_ppe,
                hazard_type: data.hazardType,
                ghs_classification: data.ghsClassification,
                chemical_form_type: data.chemical_form,
                product_standard: data.product_standard,
                reviewer_notification: data.reviewer_notification,
                msds_sds: data.msds_sds,
                msds_doc_status: data.msds_doc_status,
                msds_sds_issued_date: data.msds_sds_issued_date,
                msds_sds_expiry_date: data.msds_sds_expiry_date,
                category: data.category,
                approval_valid_date: data.approval_valid_date,

                //msds_document: data.msds_document
            }
        })
    }
    public get_chemical_request_count() {
        return this.http.get(AppService.base_url + AppService.chemical_request + '?pagination[limit]=-1&sort[0]=id:desc&publicationState=preview')
    }

    public get_chemical_request() {
        return this.http.get(AppService.base_url + AppService.chemical_request + '?populate[0]=reviewer&populate[1]=reviewer.image&populate[2]=approver&populate[3]=approver.image&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_chemical_request_with_uid(chemicalUuid: string) {
        return this.http.get(AppService.base_url + AppService.chemical_request + `?populate=msds_document&filters[chemical_uuid][$eq]=${chemicalUuid}`)
    }
    public get_chemical_inventory_with_uid(chemicalUuid: string) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + `?populate=msds_document&filters[chemical_uuid][$eq]=${chemicalUuid}`)
    }
    // public get_chemical_inventory_with_uid(chemicalUuid: string) {
    //     return this.http.get(AppService.base_url + AppService.chemical_request + `?populate=msds_document&populate[0]=reviewer&populate[1]=reviewer.image&populate[2]=approver&populate[3]=approver.image&pagination[limit]=-1&sort[0]=id:desc&filters[chemical_uuid][$eq]=${chemicalUuid}`)
    // }
    // public get_chemical_request_pag(startIndex: number, pageSize: number) {
    //     return this.http.get(AppService.base_url + AppService.chemical_request + '?populate[0]=reviewer&populate[1]=reviewer.image&populate[2]=approver&populate[3]=approver.image&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    // }

    public get_chemical_request_pag(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.chemical_request + '?populate=reviewer&populate=approver&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_chemical_request_search(reference: any) {
        return this.http.get(AppService.base_url + AppService.chemical_request + '?filters[$or][0][reference_number][$containsi]=' + reference + '&filters[$or][1][commercial_name][$containsi]=' + reference + '&populate=reviewer&populate=approver&sort[0]=id:desc')
    }

    public get_chemical_transaction_pag(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.chemical_transaction + '?populate[0]=disposals&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_chemical_transaction_search(reference: any) {
        return this.http.get(AppService.base_url + AppService.chemical_transaction + '?filters[$or][0][reference_number][$containsi]=' + reference + '&filters[$or][1][chemical][$containsi]=' + reference + '&sort[0]=id:desc')
    }

    public get_chemical_unit_specific_request(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.chemical_request + '?' + division + '&populate=reviewer&populate=approver&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_chemical_unit_specific_request_search(reference: any, division: any) {
        return this.http.get(AppService.base_url + AppService.chemical_request + '?' + division + '&filters[$or][0][reference_number][$containsi]=' + reference + '&filters[$or][1][commercial_name][$containsi]=' + reference + '&populate=reviewer&populate=approver&sort[0]=id:desc')
    }

    public get_chemical_unit_specific_transaction_pag(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.chemical_transaction + '?' + division + '&populate[0]=disposals&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    public get_chemical_unit_specific_transaction_search(reference: any, division: any) {
        return this.http.get(AppService.base_url + AppService.chemical_transaction + '?' + division + '&filters[$or][0][reference_number][$containsi]=' + reference + '&filters[$or][1][chemical][$containsi]=' + reference + '&sort[0]=id:desc')
    }

    public get_chemical_details(id: any) {
        return this.http.get(AppService.base_url + AppService.chemical_request + '/' + id + '?populate=approver&populate=reporter&populate=business_unit&populate=reviewer&populate=product_standard&populate=msds_document&populate=chem_check_report')
    }

    public get_chemical_details_refe(reference: any) {
        return this.http.get(AppService.base_url + AppService.chemical_request + '?filters[reference_number]=' + reference + '&populate=approver&populate=reporter')
    }

    public update_request(data: any) {
        return this.http.put(AppService.base_url + AppService.chemical_request + '/' + data.id, {
            data: {
                chemical_uuid: data.chemical_uuid,
                request_date: data.request_date,
                commercial_name: data.commercial_name,
                substance_name: data.substance_name,
                formula: data.formula,
                reach_registration_number: data.reach_regi_number,
                ZDHC_use_category: data.zdhc_use_category,
                usage: data.where_why,
                division: data.division,
                requested_customer: data.requested_customer,
                requested_merchandiser: data.requested_merchandiser,
                requested_quantity: data.requested_quantity,
                requested_unit: data.requested_unit,
                status: data.status,
                modified_date: new Date(),
                updated_By: data.updated_By,
                reviewer: data.reviewer,
                // review_status_notification: false,
                review_status_notification: data.review_status_notification,
                business_unit: data.business_unit,
                zdhc_level: data.zdhc_level,
                cas_no: data.cas_no,
                colour_index: data.colour_index,
                use_of_ppe: data.use_of_ppe,
                hazard_type: data.hazardType,
                ghs_classification: data.ghsClassification,
                chemical_form_type: data.chemical_form,
                product_standard: data.product_standard,
                msds_sds: data.msds_sds,
                msds_doc_status: data.msds_doc_status,
                msds_sds_issued_date: data.msds_sds_issued_date,
                msds_sds_expiry_date: data.msds_sds_expiry_date,
                category: data.category
            }
        })
    }



    // public get_chemical_request_tasks(userID:any) {
    //     return this.http.get(AppService.base_url+AppService.chemical_request+'?filters[approver]='+userID+'&filters[status]=Open&populate[0]=approver&populate[1]=approver.image&pagination[limit]=-1&sort[0]=id:desc')
    // }

    public get_chemical_request_tasks(userID: any, startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.chemical_request + '?filters[$or][0][reviewer]=' + userID + '&filters[$or][1][approver]=' + userID + '&filters[$or][0][status]=Open&filters[$or][1][status]=Reviewed&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    // public get_chemical_request_task_search(reference: any, userID: any) {
    //     return this.http.get(AppService.base_url + AppService.chemical_request + '?filters[$or][0][reference_number][$containsi]=' + reference + '&filters[$or][1][commercial_name][$containsi]=' + reference + '&filters[$or][0][reviewer]=' + userID + '&filters[$or][1][approver]=' + userID + '&filters[$or][0][status]=Open&filters[$or][1][status]=Reviewed&sort[0]=id:desc')
    // }

    public get_chemical_request_unit_specific_tasks(userID: any, startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.chemical_request + '?filters[$or][0][reviewer]=' + userID + '&' + division + '&filters[$or][1][approver]=' + userID + '&filters[$or][0][status]=Open&filters[$or][1][status]=Reviewed&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }

    // public get_chemical_request_unit_specific_task_search(reference: any, userID: any, division: any) {        
    //     return this.http.get(AppService.base_url + AppService.chemical_request + '?filters[$or][0][reference_number][$containsi]=' + reference + '&filters[$or][1][commercial_name][$containsi]=' + reference + '&' + division + '&filters[$or][0][reviewer]=' + userID + '&filters[$or][1][approver]=' + userID + '&filters[$or][0][status]=Open&filters[$or][1][status]=Reviewed&sort[0]=id:desc')
    // }
    public get_chemical_request_task_search(reference: any, userID: any) {
        return this.http.get(AppService.base_url + AppService.chemical_request + '?filters[reference_number]=' + reference + '&filters[$or][0][reviewer]=' + userID + '&filters[$or][1][approver]=' + userID + '&filters[$or][0][status]=Open&filters[$or][1][status]=Reviewed&sort[0]=id:desc')
    }
    public get_chemical_request_unit_specific_task_search(reference: any, userID: any, division: any) {
        return this.http.get(AppService.base_url + AppService.chemical_request + '?filters[reference_number]=' + reference + '&' + division + '&filters[$or][0][reviewer]=' + userID + '&filters[$or][1][approver]=' + userID + '&filters[$or][0][status]=Open&filters[$or][1][status]=Reviewed&sort[0]=id:desc')
    }
    public update_reviewer_status(data: any) {
        return this.http.put(AppService.base_url + AppService.chemical_request + '/' + data.id, {
            data: {
                status: data.status,
                reviewer_remarks: data.reviewer_remarks,
                updated_By: data.updated_By,
                approver: data.approver,
                review_status_notification: data.review_status_notification,
                approver_notification: data.approver_notification,
                approval_valid_date: data.approval_valid_date
            }
        })
    }

    update_chemicalname_approver_valid_date(data: any, id: any) {
        return this.http.put(AppService.base_url + AppService.chemical_name + '/' + id, {
            data: {
                approval_valid_date: data
            },
        }
        );
    }

    public update_approver_status(data: any) {
        return this.http.put(AppService.base_url + AppService.chemical_request + '/' + data.id, {
            data: {
                status: data.status,
                approver_remarks: data.approver_remarks,
                updated_By: data.updated_By,
                approve_status_notification: false,
                chem_check: data.chemcheck,
                // chem_check_report:data.chemcheck_id
            }
        })
    }

    public create_chemical_inventory(data: any) {

        return this.http.post(AppService.base_url + AppService.chemical_inventory, {
            data: {
                request_date: data.request_date,
                request_created_date: data.reported_date,
                reference_number: data.reference_number,
                commercial_name: data.commercial_name,
                substance_name: data.substance_name,
                formula: data.formula,
                reach_registration_number: data.reach_regi_number,
                ZDHC_Category: data.zdhc_use_category,
                used: data.where_why,
                division: data.division,
                requested_customer: data.requested_customer,
                requested_merchandiser: data.requested_merchandiser,
                approver: data.updated_By,
                chemical_uuid: data.chemical_uuid,
                reviewer: data.reviewer,
                chemical_request: data.id,
                status: data.status,
                reporter: data.reporter_id,
                where_why: data.where_why,
                requested_quantity: data.requested_quantity,
                requested_unit: data.requested_unit,
                business_unit: data.business_unit,
                zdhc_level: data.zdhc_level,
                cas_no: data.cas_no,
                colour_index: data.colour_index,
                use_of_ppe: data.use_of_ppe,
                hazard_type: data.hazardType,
                ghs_classification: data.ghsClassification,
                chemical_form_type: data.chemical_form,
                product_standard: data.product_standard,
                msds_sds: data.msds_sds,
                msds_doc_status: data.msds_doc_status,
                msds_sds_issued_date: data.msds_sds_issued_date,
                msds_sds_expiry_date: data.msds_sds_expiry_date,
                msds_document: data.doc_Id,
                category: data.category
            }
        })
    }

    public create_chemical_inventory_approval(data: any) {

        return this.http.post(AppService.base_url + AppService.chemical_inventory, {
            data: {
                request_date: data.request_date,
                request_created_date: data.request_date,
                reference_number: data.reference_number,
                commercial_name: data.commercial_name,
                substance_name: data.substance_name,
                formula: data.formula,
                reach_registration_number: data.reach_regi_number,
                ZDHC_Category: data.zdhc_use_category,
                used: data.usage,
                division: data.division,
                requested_customer: data.requested_customer,
                requested_merchandiser: data.requested_merchandiser,
                approver: data.reviewer,
                chemical_uuid: data.chemical_uuid,
                reviewer: data.reviewer,
                chemical_request: data.id,
                status: data.status,
                reporter: data.reporter,
                where_why: data.where_why,
                requested_quantity: data.requested_quantity,
                requested_unit: data.requested_unit,
                business_unit: data.business_unit,
                zdhc_level: data.zdhc_level,
                cas_no: data.cas_no,
                colour_index: data.colour_index,
                use_of_ppe: data.use_of_ppe,
                hazard_type: data.hazardType,
                ghs_classification: data.ghsClassification,
                chemical_form_type: data.chemical_form,
                product_standard: data.product_standard,
                msds_sds: data.msds_sds,
                msds_doc_status: data.msds_doc_status,
                msds_sds_issued_date: data.msds_sds_issued_date,
                msds_sds_expiry_date: data.msds_sds_expiry_date,
                msds_document: data.msds_document,
                category: data.category
            }
        })
    }

    // public inventory_register() {
    //     return this.http.get(AppService.base_url + AppService.chemical_inventory + '?populate[0]=approver&populate[1]=approver.image&populate[2]=reviewer&populate[3]=reviewer.image&pagination[limit]=-1&sort[0]=id:desc')
    // }

    public inventory_register(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + `?populate=approver&populate=reviewer&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`);
    }

    public inventory_register_search(reference: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?filters[$or][0][reference_number][$containsi]=' + reference + '&filters[$or][1][commercial_name][$containsi]=' + reference + '&populate=approver&populate=reviewer&sort[0]=id:desc');
    }

    public inventory_unit_specific_register(startIndex: number, pageSize: number, division: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?' + division + `&populate=approver&populate=reviewer&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`);
    }

    public inventory_unit_specific_register_search(reference: any, division: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?filters[$or][0][reference_number][$containsi]=' + reference + '&filters[$or][1][commercial_name][$containsi]=' + reference + '&' + division + '&populate=approver&populate=reviewer&sort[0]=id:desc');
    }
    public get_chemical_inventory_refe(reference: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?filters[reference_number]=' + reference + '&populate=approver&populate=reporter')
    }

    public get_nventory_details(id: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + "/" + id + '?populate=approver&populate=reviewer&populate=reporter&populate=business_unit&populate=msds_document&populate[0]=certificates&populate[1]=certificates.chemical_certificate_doc&populate=chemical_disposals&populate=manufacturer_name&populate=apeo_statement&populate=product_standard&populate=chem_check_report')
    }

    public get_commercial_details(id: any) {
        return this.http.get(AppService.base_url + AppService.chemical_name + "/" + id)
    }

    public get_supplier_details(id: any) {
        return this.http.get(AppService.base_url + AppService.supplier_name + "/" + id)
    }


    public remove_msds_status(id: any) {
        return this.http.put(AppService.base_url + AppService.chemical_inventory + '/' + id, {
            data: {
                msds_sds: false,
                msds_sds_issued_date: null,
                msds_sds_expiry_date: null
            }
        })
    }

    public remove_request_msds_status(id: any) {
        return this.http.put(AppService.base_url + AppService.chemical_request + '/' + id, {
            data: {
                msds_sds: false,
                msds_sds_issued_date: null,
                msds_sds_expiry_date: null,

            }
        })
    }

    public update_inventory(data: any) {

        return this.http.put(AppService.base_url + AppService.chemical_inventory + '/' + data.id, {
            data: {
                supplier_name: data.supplier_name,
                contact_number: data.contact_number,
                email_id: data.email_id,
                type: data.supplier_type,
                location: data.location,
                zdhc_level: data.zdhc_level,
                cas_no: data.cas_no,
                colour_index: data.colour_index,
                msds_sds: data.msds_sds,
                zdhc_mrsl: data.zdhc_mrsl,
                msds_sds_issued_date: data.msds_sds_issued_date,
                msds_sds_expiry_date: data.msds_sds_expiry_date,
                where_why: data.where_why,
                use_of_ppe: data.use_of_ppe,
                hazard_type: data.hazardType,
                ghs_classification: data.ghsClassification,
                storage_condition: data.storage_condition,
                storage_place: data.storage_place,
                delivered_quantity: data.delivered_quantity,
                delivered_unit: data.delivered_unit,
                purchased_amount: data.purchased_amount,
                threshold_limit: data.threshold_limit,
                delivery_date: data.delivery_date,
                invoice_reference: data.invoice_reference,
                status: data.status,
                updated_user: data.reporter,
                balance: data.delivered_quantity,
                lot_number: data.lot_number,
                manufacturing_date: data.manufacturing_date,
                expiry_date: data.expiry_date,
                invoice_date: data.invoice_date,
                published_by: data.published_by,
                msds_warning_date: data.msds_warning_date,
                chemical_form_type: data.chemical_form,
                manufacturer_name: data.manufacturer_name,
                apeo_npe: data.apeo_npe,
                chemical_hazard_statement_code: data.hazard_statement_code,
                business_unit: data.business_unit,
                product_standard: data.product_standard,
                category: data.category,
                formulator_name: data.formulator_name,
                chem_check: data.chemcheck

            }
        })
    }


    public delete_chemical_certificate(id: any) {
        return this.http.delete(AppService.base_url + AppService.chemical_certificate + '/' + id)
    }

    public delete_chemical_certificate_doc(id: any) {
        return this.http.delete(AppService.base_url + AppService.chemical_certificate_doc + '/' + id)
    }

    public inventory_details(orgID: any, reference: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?filters[id][$eq]=' + reference + '&populate[0]=certificates&populate[1]=certificates.chemical_certificate_doc&populate=approver&populate=reporter&populate=msds_document&populate=apeo_statement&populate=updated_By&populate=chem_check_report')
    }

    public inventory_certificates(orgID: any, reference: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?filters[id][$eq]=' + reference + '&populate[0]=certificates&populate[1]=certificates.chemical_certificate_doc&populate=approver&populate=reporter&populate=msds_document&populate=updated_By')
    }



    public get_published_chemical_data() {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?filters[status]=Published&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_published_chemical_data_uuid(uuid: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?filters[chemical_uuid]=' + uuid + '&filters[status]=Published&pagination[limit]=-1&sort[0]=id:desc')
    }

    public chemical_transactions() {
        return this.http.get(AppService.base_url + AppService.chemical_transaction + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public create_chemical_transactions(data: any, reference: any) {
        return this.http.post(AppService.base_url + AppService.chemical_transaction, {
            data: {
                reference_number: reference,
                transaction_date: data.transactionDate,
                division: data.division,
                authorized_person: data.authPerson,
                chemical: data.chemical,
                total_quantity: data.availableQuan,
                issued_quantity: data.issuingQuan,
                balance: data.balance,
                department: data.department,
                unit: data.unit,
                created_user: data.createdBy,
                cost: data.cost,
                inventory: data.inventory,
                business_unit: data.business_unit
            }
        })
    }

    public update_balance_inventory(id: any, issued: any, balance: any) {
        return this.http.put(AppService.base_url + AppService.chemical_inventory + '/' + id, {
            data: {
                issued: issued,
                balance: balance
            }
        })
    }

    public update_diposal_inventory(id: any, diposed: any, balance: any) {
        return this.http.put(AppService.base_url + AppService.chemical_inventory + '/' + id, {
            data: {
                disposed: diposed,
                balance: balance
            }
        })
    }

    public chemical_disposal() {
        return this.http.get(AppService.base_url + AppService.chemical_disposal + '?pagination[limit]=-1&sort[0]=id:desc')
    }

    public chemical_disposal_create(data: any) {
        return this.http.post(AppService.base_url + AppService.chemical_disposal, {
            data: {
                authorized_contractor: data.authorized_contractor,
                disposal_details: data.disposal_details,
                disposed_quantity: data.disposed_quantity,
                disposal_date: data.disposal_date,
                inventory: data.inventory,
                cost: data.cost,
                chemical_name: data.chemical_name,
                balance_quantity: data.balance_quantity,
                available_quantity: data.available_quantity,
                unit: data.unit
            }
        })

    }


    ///######---->Dashboard
    public chemical_inventory_count(userDivision: any) {
        return this.http.get(AppService.base_url + AppService.chemical_count + '?' + userDivision)
    }

    public chemical_inventory_count_user_division(start:any,end:any,userDivision: any) {
        return this.http.get(AppService.base_url + AppService.chemical_count + '?filters[delivery_date][$gte]=' + start + '&filters[delivery_date][$lte]=' + end + '&filters[business_unit][division_uuid]=' + userDivision)
    }

    public chemical_inventory_count_startend_division(start:any,end:any,division:any) {
        return this.http.get(AppService.base_url + AppService.chemical_count + '?filters[delivery_date][$gte]=' + start + '&filters[delivery_date][$lte]=' + end + '&filters[business_unit][division_uuid]=' + division)
    }
    public chemical_inventory_count_start_date_end_date(start:any,end:any) {
        return this.http.get(AppService.base_url + AppService.chemical_count + '?filters[delivery_date][$gte]=' + start + '&filters[delivery_date][$lte]=' + end)
    }
    public chemical_inventory_count_division_only(division:any){
        return this.http.get(AppService.base_url + AppService.chemical_count + '?filters[business_unit][division_uuid]=' + division)
    }


    public get_chemical_inventory_dash(start: any, end: any, userDivision: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?filters[delivery_date][$gte]=' + start + '&filters[delivery_date][$lte]=' + end + '&' + userDivision + '&filters[status]=Published&populate=certificates&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_chemical_inventory_dash_div(start: any, end: any, division: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?filters[delivery_date][$gte]=' + start + '&filters[delivery_date][$lte]=' + end + '&filters[business_unit][division_uuid]=' + division + '&filters[status]=Published&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_chemical_transaction_dash(start: any, end: any, userDivision: any) {
        return this.http.get(AppService.base_url + AppService.chemical_transaction + '?filters[transaction_date][$gte]=' + start + '&filters[transaction_date][$lte]=' + end + '&' + userDivision + '&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_chemical_transaction_dash_div(start: any, end: any, division: any) {
        return this.http.get(AppService.base_url + AppService.chemical_transaction + '?filters[transaction_date][$gte]=' + start + '&filters[transaction_date][$lte]=' + end + '&filters[business_unit][division_uuid]=' + division + '&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_chemicals_inStock() {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?filters[balance][$gt]=0&pagination[limit]=-1&sort[0]=id:desc')
    }

    public get_valid_msds_count(userDivision: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '/count/view?filters[msds_expired]=false&' + userDivision)
    }

    public get_valid_msds_division_count(division: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '/count/view?filters[msds_expired]=false&filters[business_unit][division_uuid]=' + division)
    }

    public get_valid_msds_start_date_end_date_count(start:any,end:any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '/count/view?filters[msds_expired]=false&filters[delivery_date][$gte]=' + start + '&filters[delivery_date][$lte]=' + end)
    }
    public get_valid_msds_start_date_end_date_division_count(start:any,end:any,division: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '/count/view?filters[msds_expired]=false&filters[business_unit][division_uuid]=' + division + '&filters[delivery_date][$gte]=' + start + '&filters[delivery_date][$lte]=' + end)
    }



    /////

    public update_compliance_approver_status(data: any) {
        return this.http.put(AppService.base_url + AppService.chemical_request + '/' + data.id, {
            data: {
                status: data.status,
                compliance_remarks: data.compliance_remarks

            }
        })
    }

    public check_availability(uuid: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?chemical_uuid=' + uuid)
    }

    public inventory_report(data: any): any {
        return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_chemical_inventory_v1.xlsx?start_date=' + data.start_date + '&end_date=' + data.end_date + '&division=' + data.division + '&contact_person=' + data.contact_person + '&title=' + data.title + '&date_completed=' + data.date_completed + '&email=' + data.email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
    }

    public chemical_che_expiry(expiryDate: any) {
        return this.http.get(AppService.base_url + AppService.chemical_inventory + '?filters[expiry_date][$lte]=' + expiryDate)
    }
    public chemical_certificate_expiry(expiryDate: any) {
        return this.http.get(AppService.base_url + AppService.chemical_certificate + '?filters[certificate_expiry_date][$lte]=' + expiryDate + '&populate[0]=chemical_inventory')
    }
    public get_hazard_statement_codes() {
        return this.http.get(AppService.base_url + AppService.hazard_statement_codes + '?pagination[limit]=-1&sort[0]=id:desc')
    }

}