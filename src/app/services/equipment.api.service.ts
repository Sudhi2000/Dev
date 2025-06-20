import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { map, Observable } from 'rxjs';
import { AppsModule } from '../apps/apps.module';
import { AppService } from './app.service';

@Injectable({
    providedIn: 'root'
})
export class EquipmentService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }
    public get_equipment() {
        return this.http.get(AppService.base_url + AppService.equipment + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_manufacturer() {
        return this.http.get(AppService.base_url + AppService.manufacturer + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_industry_type() {
        return this.http.get(AppService.base_url + AppService.industry_type + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_clients() {
        return this.http.get(AppService.base_url + AppService.client + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_client_register(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.client + '?pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_equipment_type() {
        return this.http.get(AppService.base_url + AppService.equipment_type + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_inspection_category() {
        return this.http.get(AppService.base_url + AppService.inspection_category + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_tag() {
        return this.http.get(AppService.base_url + AppService.geo_tag + '?populate=equipment&populate=manufacturer&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_geo_tags(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.geo_tag + '?populate=equipment&populate=manufacturer&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_equipments(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.equipment + '?populate=assignment&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_equipment_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.equipment + '?filters[reference_number][$eq]=' + reference + '&populate=*')
    }
    public get_equipment_details(id: any) {
        return this.http.get(AppService.base_url + AppService.equipment + '?filters[id][$eq]=' + id + '&populate[0]=assignment&populate[1]=assignment.assigned_operator&populate[2]=assignment.client&populate=geo_tag&populate=inspection&populate[3]=inspection.mechanic&populate=daily_log&populate=inspection')
    }
    public get_inspections(startIndex: number, pageSize: number) {
        return this.http.get(AppService.base_url + AppService.inspection + '?populate=assignment&populate=questions&pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[0]=id:desc')
    }
    public get_inspection() {
        return this.http.get(AppService.base_url + AppService.inspection + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_inspection_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.inspection + '?filters[reference_number][$eq]=' + reference + '&populate=*')
    }
    public get_inspection_details(id: any) {
        return this.http.get(AppService.base_url + AppService.inspection + '?filters[id][$eq]=' + id + '&populate=questions')
    }
    public get_client_reference(client_id: any) {
        return this.http.get(AppService.base_url + AppService.client + '?filters[client_id][$eq]=' + client_id)
    }
    public get_geo_tag_reference(reference_number: any) {
        return this.http.get(AppService.base_url + AppService.geo_tag + '?filters[reference_number][$eq]=' + reference_number + '&populate=equipment&populate=manufacturer')
    }
    public create_equipment(data: any) {
        return this.http.post(AppService.base_url + AppService.equipment, {
            data: {
                reported_date: new Date(),
                reference_number: data.reference_number,
                equipment_name: data.equipment_name,
                equipment_type: data.equipment_type,
                manufacturer: data.manufacturer,
                fuel_type: data.fuel_type,
                model: data.model,
                serial_number: data.serial_number,
                purchase_price: data.purchase_price,
                purchase_date: data.purchase_date,
                fuel_capacity: data.fuel_capacity,
                oil_capacity: data.oil_capacity,
                //last_inspection_date: data.last_inspection_date,
                // geo_tag: data.geo_tag_id,
                status: data.status,
                last_odometer_reading:data.last_odometer_reading,
                asset_unique_tag_id:data.asset_unique_tag_id
            }
        })
    }
    public create_inspection(data: any) {
        return this.http.post(AppService.base_url + AppService.inspection, {
            data: {
                created_date: data.created_date,
                template_name: data.template_name,
                category: data.category,
                status:data.status,
                reference_number:data.reference_number,
                number_of_questions:data.number_of_questions
                 
            }
        })
    }
    public create_manufacturer(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.manufacturer, {
            data: {
                name: data.name,
                created_user: user
            }
        })
    }

    public create_geo_tag(data: any) {
        return this.http.post(AppService.base_url + AppService.geo_tag, {
            data: {
                tag_id: data.tag_id,
                manufacturer: data.manufacturer,
                purchased_date: data.purchased_date,
                price: data.purchase_price,
                status: data.status,
                equipment: data.equipment,
                manufacturing_date:data.manufacturing_date,
                date:data.date,
                reference_number:data.reference_number
            }
        })
    }
    public create_client(data: any) {
        return this.http.post(AppService.base_url + AppService.client, {
            data: {
                client_id: data.client_id,
                client_name: data.client_name,
                client_contact_number: data.client_contact_number,
                client_email_id: data.client_email_id,
                client_address: data.client_address,
                industry_type: data.industry_type
            }
        })
    }

    public create_equipment_type(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.equipment_type, {
            data: {
                name: data.name,
                created_user: user
            }
        })
    }
    public create_inspection_category(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.inspection_category, {
            data: {
                name: data.name,
                created_user: user
            }
        })
    }
    public create_industry_type(data: any, user: any) {
        return this.http.post(AppService.base_url + AppService.industry_type, {
            data: {
                name: data.name,
                created_user: user
            }
        })
    }
    public create_assignment(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.assignment, {
            data: {
                start_date: data.start_date,
                end_date: data.end_date,
                client: data.client_name,
                project_name: data.project_name,
                assigned_operator: data.assigned_operator,
                project_location: data.project_location,
                equipment: id,
            }
        })
    }
    public create_question(data: any, id: any) {
        return this.http.post(AppService.base_url + AppService.question, {
            data: {
                created_date: data.created_date,
                question: data.question,
                status: data.status,
                template: id,
            }
        })
    }

   


    public update_tag(data: any) {
        return this.http.put(AppService.base_url + AppService.geo_tag + '/' + data.id, {
            data: {
                tag_id: data.tag_id,
                manufacturer: data.manufacturer,
                purchased_date: data.purchased_date,
                price: data.purchase_price,
                status: data.status,
                equipment: data.equipment,
                manufacturing_date:data.manufacturing_date,
                date:data.date,
                reference_number:data.reference_number
            }
        })
    }
    public update_question(data: any) {
        return this.http.put(AppService.base_url + AppService.question + '/' + data.id, {
            data: {
                modified_date: data.modified_date,
                question: data.question,
                status: data.status,
                
            }
        })
    }
    public update_assignment(data: any) {
        return this.http.put(AppService.base_url + AppService.assignment + '/' + data.id, {
            data: {
                start_date: data.start_date,
                end_date: data.end_date,
                client: data.client_name,
                project_name: data.project_name,
                assigned_operator: data.assigned_operator,
                project_location: data.project_location,
            }
        })
    }
    public update_client(data: any) {
        return this.http.put(AppService.base_url + AppService.client + '/' + data.id, {
            data: {
                client_id: data.client_id,
                client_name: data.client_name,
                client_contact_number: data.client_contact_number,
                client_email_id: data.client_email_id,
                client_address: data.client_address,
                industry_type: data.industry_type
            }
        })
    }
    public delete_assignment(id: any) {
        return this.http.delete(AppService.base_url + AppService.assignment + '/' + id)
    }
    
    public delete_question(id: any) {
        return this.http.delete(AppService.base_url + AppService.question + '/' + id)
    }

}