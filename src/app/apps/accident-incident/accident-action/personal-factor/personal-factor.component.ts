import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AccidentService } from 'src/app/services/accident.api.service';

@Component({
  selector: 'app-personal-factor',
  templateUrl: './personal-factor.component.html',
  styleUrls: ['./personal-factor.component.scss']
})
export class PersonalFactorComponent implements OnInit {

  personal_factor: any[] = []
  selectedFactor: any[] = []

  filterFactor(factor: any) {
    return factor.attributes.category === "Personnel Factor"
  }

  constructor(private accidentService: AccidentService,
    private dialogRef: MatDialogRef<PersonalFactorComponent>) { }

  ngOnInit() {
    this.get_root_cause()
  }

  get_root_cause() {
    this.accidentService.get_accident_root_cause().subscribe({
      next: (result: any) => {
        this.personal_factor = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  addEvent(data: any) {
    const checked = data.target.checked
    if (checked) {
      this.selectedFactor.push({
        id: data.target.value
      })
    } else {
      this.selectedFactor.splice(this.selectedFactor.findIndex((factor) => factor.id === data.target.value), 1);
    }
  }

  complete(){
    this.dialogRef.close(this.selectedFactor);
  }

}
