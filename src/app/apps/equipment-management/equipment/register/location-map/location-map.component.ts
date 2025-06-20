import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.scss']
})
export class LocationMapComponent implements OnInit {
  lat = 8.5241;
  lng = 76.9366;
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any) { }

  ngOnInit(){
    console.log(this.defaults)
  }

}
