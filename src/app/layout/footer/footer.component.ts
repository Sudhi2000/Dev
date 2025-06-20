import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  copyright:any
  version:any

  constructor(private generalService:GeneralService) { }

  ngOnInit(){
    this.get_config()
  }

  get_config(){
    this.generalService.get_app_config().subscribe({
      next:(result:any)=>{
        this.copyright=result.data.attributes.copyright
        this.version =result.data.attributes.application_version
      },
      error:(err:any)=>{},
      complete:()=>{}
    })
  }

}
