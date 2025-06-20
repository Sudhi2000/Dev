import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Lightbox } from 'ngx-lightbox';
import { ConsumptionModifyComponent } from 'src/app/apps/environment/modify-consumption/consumption/consumption.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-evidence',
  templateUrl: './view-evidence.component.html',
  styleUrls: ['./view-evidence.component.scss']
})
export class ViewEvidenceComponent implements OnInit {
  evidences:any[]=[]

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    public dialogRef: MatDialogRef<ConsumptionModifyComponent>,
    private _lightbox: Lightbox) { }

  ngOnInit(){
    // this.evidences = this.defaults.corrective_action_evidences.data
    console.log(this.defaults)

    this.defaults.attributes.corrective_action_evidences.data.forEach((elem: any) => {
      this.evidences.push({
        src: environment.client_backend + '/uploads/' + elem.attributes.evidence_after_name + '.' + elem.attributes.format_after,
        caption: "Evidence",
        thumb: environment.client_backend + '/uploads/' + elem.attributes.evidence_after_name + '.' + elem.attributes.format_after
      })
    })
  }

  open(index: number): void {
    this._lightbox.open(this.evidences, index);
  }

}
