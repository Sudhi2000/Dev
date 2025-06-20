import { Component, OnInit } from '@angular/core';
import { EsgService } from 'src/app/services/esg.service';

@Component({
  selector: 'app-esg-temp',
  templateUrl: './esg-temp.component.html',
  styleUrls: ['./esg-temp.component.scss']
})
export class EsgTempComponent implements OnInit {

  esgTitles:any[]=[]
  

  constructor(private esgTempService:EsgService) { }

  ngOnInit(): void {
    this.getEsgTemp()
    
  }

  getEsgTemp(){
    const data = "Environment"
    this.esgTempService.esg_temp(data).subscribe({
      next:(result:any)=>{
        this.esgTitles=result
        console.log(result)
      },
      error:(err:any)=>{},
      complete:()=>{}
    })

  }

}
