import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GeneralDisclosureService {
    constructor(private http: HttpClient) { }

    public general_disclosure_register(startIndex: any, pageSize: any) {

        return this.http.get(AppService.base_url + AppService.generalDisclosureRegister + '?pagination[start]=' + startIndex + '&pagination[limit]=' + pageSize + '&sort[1]=id:desc')
    }
    public get_list_of_values() {

        return this.http.get(AppService.base_url + AppService.getListOfValues)
    }
    public create_general_disclosure(data: any) {
        return this.http.post(AppService.base_url + AppService.createGeneralDisclosure, data)
    }
    public get_general_disclosure(reference_id: any) {
        return this.http.get(AppService.base_url + AppService.getGeneralDisclosure + '?reference_id=' + reference_id)
    }
    public get_general_esgs(year: any) {
        return this.http.get(AppService.base_url + AppService.getGeneralDisclosures + '?filters[year]=' + year + '&pagination[limit]=-1&sort[0]=id:desc')
    }
    public get_general_esgs_financialyear(startDate: any, endDate: any) {
        return this.http.get(AppService.base_url + AppService.getGeneralDisclosures + '?filters[start_date]=' + startDate + '&filters[end_date]=' + endDate + '&pagination[limit]=-1&sort[0]=id:desc')
    }
    public modify_general_disclosure(data: any) {
        return this.http.put(AppService.base_url + AppService.modifyGeneralDisclosure, data)
    }


}