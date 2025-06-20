import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { map, Observable } from 'rxjs';
import { AppsModule } from '../apps/apps.module';
import { AppService } from './app.service';

@Injectable({
    providedIn: 'root'
})
export class EngagementService extends AppService {


    constructor(private http: HttpClient) {
        super();
    }

    public get_events() {
        return this.http.get(AppService.base_url + AppService.engagement + '?pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_engagement_reference(reference: any) {
        return this.http.get(AppService.base_url + AppService.engagement + '?filters[reference_number][$eq]=' + reference + '&populate=*')
    }
    public get_engagement_details(id: any) {
        return this.http.get(AppService.base_url + AppService.engagement + '?filters[id][$eq]=' + id + '&populate=*')
    }

    public getImage(imageUrl: string): Observable<Blob> {
        return this.http.get(imageUrl, { responseType: 'blob' });
    }


    //creat engagement 
    public create_engagement_image(data: any) {
        return this.http.post(AppService.base_url + AppService.engagement_image, {
            data: {
                image_name: data.image_name,
                format: data.format,
                image_id: data.id,
                engagement: data.engagement,

            }
        })
    }

    //create event
    public create_event(data: any) {
        return this.http.post(AppService.base_url + AppService.engagement, {
            data: {
                reported_date: new Date(),
                reference_number: data.reference_number,
                event_title: data.event_title,
                event_start_date: data.start,
                event_end_date: data.end,
                status: data.status,
                description: data.description,

            }
        })
    }

    //update engagement
    public update_engagement(data: any) {
        return this.http.put(AppService.base_url + AppService.engagement + '/' + data.id, {
            data: {

                status: 'Completed',
                completed_date: data.completed_date

            }
        })
    }





}