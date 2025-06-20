import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppService } from './app.service';

@Injectable({
    providedIn: 'root'
})
export class WeatherService extends AppService {

    token: string

    constructor(private http: HttpClient) {
        super();
    }

  
      public get_wheather(){
        return this.http.get(AppService.wheather+'key='+environment.wheather_key+'&q='+environment.wheather_city+'&aqi=yes',{headers:{skip:"true"}})
      }

    

   







}