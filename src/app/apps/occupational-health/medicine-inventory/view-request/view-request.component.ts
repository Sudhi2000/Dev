import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { MedicineInventoryService } from 'src/app/services/medicine-inventory.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { CreateMedicineNameComponent } from '../create-request/create-medicine-name/create-medicine-name.component';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss']
})
export class ViewRequestComponent implements OnInit {

  Form: FormGroup
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  divisions: any[] = []
  medicineName: any[] = []
  zdhcCategory: any[] = []
  peopleList: any[] = []
  currency: string
  orgID: string
  requestedUnit: any[] = []
  dropdownValues: any[] = []
  requestedUnitVal: string
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  unitSpecific: any
  corporateUser: any
  divisionUuids: any[] = []
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
  private generalService: GeneralService,
    private medicineService: MedicineInventoryService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) { }

  ngOnInit() {    
    this.configuration()
    this.Form = this.formBuilder.group({
      org_id: [''],
      id: [this.defaults.id],
      reference_number: [this.defaults.attributes.reference_number || ''],
      reported_date: [this.defaults.attributes.reported_date || ''],
      division: [this.defaults.attributes.division || ''],
      requested_quantity: [this.defaults.attributes.requested_quantity || ''],
      medicine_name: [this.defaults.attributes.medicine_name || ''],
      generic_name: [this.defaults.attributes.generic_name || ''],
      request_date: [this.defaults.attributes.request_date || ''],
      medicine_uuid: [this.defaults.attributes.medicine_uuid || ''],
      approver: [this.defaults.attributes.approver.data.attributes.first_name + ' ' + this.defaults.attributes.approver.data.attributes.last_name || ''],
      
    });
    this.Form.disable()
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.occupational_health
        this.currency = result.data.attributes.currency
        this.unitSpecific = result.data.attributes.business_unit_specific
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
              this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
            }
          }
          this.me()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.med_view_request
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
         if(this.unitSpecific){
          this.corporateUser = result.profile.corporate_user
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisionUuids.push(elem.division_uuid)
              })
            }
          } 
         }
         const divisionUuidFromResponse = this.defaults.attributes.business_unit.data?.attributes.division_uuid;
         let matchFound = true;
         if (this.divisionUuids && this.divisionUuids.length > 0) {
           matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
         }
         if (!matchFound || matchFound !== true) {
          this.router.navigate(["/apps/occupational-health/medicine-inventory/request-history"])

         }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }


 
}
