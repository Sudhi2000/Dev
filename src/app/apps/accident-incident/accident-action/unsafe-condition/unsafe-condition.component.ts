import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AccidentService } from 'src/app/services/accident.api.service';

@Component({
  selector: 'app-unsafe-condition',
  templateUrl: './unsafe-condition.component.html',
  styleUrls: ['./unsafe-condition.component.scss']
})
export class UnsafeConditionComponent implements OnInit {

  unsafe_conditions: any[] = []
  selectedConditions: any[] = []

  filterConditions(acts: any) {
    return acts.attributes.category === "Unsafe Conditions"
  }

  constructor(private accidentService: AccidentService,
    private dialogRef: MatDialogRef<UnsafeConditionComponent>) { }

  ngOnInit() {
    this.get_root_cause()
  }

  get_root_cause() {
    this.accidentService.get_accident_root_cause().subscribe({
      next: (result: any) => {
        this.unsafe_conditions = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  addEvent(data: any) {
    const checked = data.target.checked
    if (checked) {
      this.selectedConditions.push({
        id: data.target.value
      })
    } else {
      this.selectedConditions.splice(this.selectedConditions.findIndex((conditions) => conditions.id === data.target.value), 1);
    }
  }

  complete() {
    this.dialogRef.close(this.selectedConditions);
  }
}
