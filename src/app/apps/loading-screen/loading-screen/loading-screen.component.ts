import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {
  @Input() rows: number;
  get loadingRows(): any[] {
    return Array.from({ length: this.rows });
  }
  constructor() { }

  ngOnInit(): void {
  }

}
