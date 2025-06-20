import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppService } from './app.service';
import { authentication } from './schemas';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService extends AppService {

    token: string

    constructor(private http: HttpClient) {
        super();
    }

    public get_subscription() {
        return this.http.get(AppService.base_url + AppService.subscription+'?pagination[limit]=10&sort[0]=id:desc')
    }

   






}