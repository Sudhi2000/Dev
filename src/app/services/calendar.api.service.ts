import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Injectable({
    providedIn: 'root'
})
export class CelendarService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }

    //get internal audit details
    public get_internal_audits() {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?filters[status]=Approved&filters[status]=In Progress&pagination[limit]=-1&sort[0]=id:desc')

    }
    public get_unit_specific_internal_audits(division: any) {
        return this.http.get(AppService.base_url + AppService.internal_audit + '?' + division + '&filters[status]=Approved&filters[status]=In Progress&pagination[limit]=-1&sort[0]=id:desc')

    }
    //get external audit details
    public get_external_audits() {
        return this.http.get(AppService.base_url + AppService.external_audit + '?filters[audit_status]=Approved&filters[audit_status]=In Progress&pagination[limit]=-1&sort[0]=id:desc')

    }
    public get_unit_specific_external_audits(division: any) {
        return this.http.get(AppService.base_url + AppService.external_audit + '?' + division + '&filters[audit_status]=Approved&filters[audit_status]=In Progress&pagination[limit]=-1&sort[0]=id:desc')

    }



















}