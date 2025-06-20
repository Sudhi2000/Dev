import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AccidentService } from 'src/app/services/accident.api.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  accident_overview: any[] = []
  selectedEvents: any[] = []

  filterEvents(category: any) {
    return category.attributes.category === "Events"
  }

  constructor(private accidentService: AccidentService,
    private dialogRef: MatDialogRef<AddEventComponent>) { }

  ngOnInit() {
    this.get_accident_overview()
  }

  get_accident_overview() {
    this.accidentService.get_accident_overview().subscribe({
      next: (result: any) => {
        this.accident_overview = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  addEvent(data: any) {
    const checked = data.target.checked
    if (checked) {
      this.selectedEvents.push({
        id: data.target.value
      })
    } else {
      this.selectedEvents.splice(this.selectedEvents.findIndex((events) => events.id === data.target.value), 1);
    }
  }

  complete() {
    this.dialogRef.close(this.selectedEvents);
  }


}
