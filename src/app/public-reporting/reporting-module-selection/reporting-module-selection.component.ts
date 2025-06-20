import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reporting-module-selection',
  templateUrl: './reporting-module-selection.component.html',
  styleUrls: ['./reporting-module-selection.component.scss']
})
export class ReportingModuleSelectionComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  copyRight: String
  client_logo: any

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private generalService: GeneralService,

  ) { }

  ngOnInit(): void {
    this.configuration()
  }
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.copyRight = result.data.attributes.copyright
        if (result.data.attributes.client_logo) {
          this.client_logo = environment.client_backend + '/uploads/' + result.data.attributes.client_logo
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  hazardRisk() {
    this.router.navigate(['/public-reporting/hazard-risk/report']);
  }


  accident() {
    const statusText = "Under Construction !"
    this._snackBar.open(statusText, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  grievance() {
    const statusText = "Under Construction !"
    this._snackBar.open(statusText, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
