import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AccidentService } from 'src/app/services/accident.api.service';
@Component({
  selector: 'app-unsafe-acts',
  templateUrl: './unsafe-acts.component.html',
  styleUrls: ['./unsafe-acts.component.scss']
})
export class UnsafeActsComponent implements OnInit {

  unsafe_acts: any[] = []
  selectedActs: any[] = []

  filterActs(acts: any) {
    return acts.attributes.category === "Unsafe Acts"
  }

  constructor(private accidentService: AccidentService,
    private dialogRef: MatDialogRef<UnsafeActsComponent>) { }

  ngOnInit() {
    this.get_root_cause()
  }

  get_root_cause() {
    this.accidentService.get_accident_root_cause().subscribe({
      next: (result: any) => {
        this.unsafe_acts = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  addEvent(data: any) {
    const checked = data.target.checked
    if (checked) {
      this.selectedActs.push({
        id: data.target.value
      })
    } else {
      this.selectedActs.splice(this.selectedActs.findIndex((acts) => acts.id === data.target.value), 1);
    }
  }

  complete() {
    this.dialogRef.close(this.selectedActs);
  }

}
