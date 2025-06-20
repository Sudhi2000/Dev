import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { AppService } from './app.service';

@Injectable({
    providedIn: 'root'
})
export class SchedulerService extends AppService {

    constructor(private http: HttpClient) {
        super();
    }

    public create_hazard_schedule(reference: any, to_email: any, cc_email: any) {
        return this.http.post(AppService.base_url + AppService.scheduler, {
            data: {
                report_title: "Hazard",
                reference_number: reference,
                to_email: to_email,
                cc_email: cc_email,
                scheduled: false
            }
        })
    }

    public create_occupational_health_schedule(reference: any, to_email: any, cc_email: any) {
        return this.http.post(AppService.base_url + AppService.scheduler, {
            data: {
                report_title: "Occupational health",
                reference_id: reference,
                to_email: to_email,
                cc_email: cc_email,
                scheduled: false
            }
        })
    }
    public create_clinical_suite_schedule(reference: any, to_email: any) {
        return this.http.post(AppService.base_url + AppService.scheduler, {
            data: {
                report_title: "Clinical Suite",
                reference_number: reference,
                to_email: to_email,
                cc_email: '',
                scheduled: false
            }
        })
    }

    public create_purchase_inventory_schedule(reference: any, to_email: any) {
        return this.http.post(AppService.base_url + AppService.scheduler, {
            data: {
                report_title: "Medicine Inventory",
                reference_number: reference,
                to_email: to_email,
                cc_email: '',
                scheduled: false
            }
        })
    }


}