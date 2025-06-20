import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { CreateDisposeComponent } from './create-dispose/create-dispose.component';
import { ChemicalService } from 'src/app/services/chemical.api.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-dispose',
  templateUrl: './dispose.component.html',
  styleUrls: ['./dispose.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DisposeComponent implements OnInit {

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 5,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;
 
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  peopleList: any[] = []
  disposeRegister: any[] = []
  disposeList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
      ],
    },
  }
 
  constructor(private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private chemicalService: ChemicalService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: ['',  ],
      reference_number: [''],
      balance:[''],
      disposed:[''],
      reported_date: [new Date()],
    });
  }

  
  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.document
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

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.chem_trans
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_disposal_details()
          this.get_transaction()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  get_transaction() {
     
    const reference = this.route.snapshot.paramMap.get('id');
    this.chemicalService.get_transaction_details(reference).subscribe({
      
      next: (result: any) => {
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.Form.controls['balance'].setValue(result.data[0].attributes.balance)
        this.Form.controls['disposed'].setValue(result.data[0].attributes.disposed_quantity)
        this.Form.controls['id'].setValue(result.data[0].id)     
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  // To display disposal details to view
  get_disposal_details() {
     
    const reference = this.route.snapshot.paramMap.get('id');
    this.chemicalService.get_disposal_details_reference(reference).subscribe({
      
      next: (result: any) => {
          this.disposeList = result.data
           
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  
//store Dispose details 
createDispose() {
  this.dialog.open(CreateDisposeComponent).afterClosed().subscribe(data => {
    if (data) {
      this.submit(data)
      
    }
  })
}

//delete Dispose
updateDeleteTransaction(data: any) {
          const oldBalance = data.attributes.chemical_transaction.data.attributes.balance
          const oldDispose = data.attributes.chemical_transaction.data.attributes.disposed_quantity
          const disposedQuantity = data.attributes.disposed_quantity
          const newBalance = Number(oldBalance)+Number(disposedQuantity )
          const newdisposed = Number(oldDispose)-Number(disposedQuantity )
          const tranId =data.attributes.chemical_transaction.data.id
  this.chemicalService.update_transaction_disposal(tranId,newdisposed,newBalance).subscribe({
    next: (result: any) => { 

    },
    error: (err: any) => {
      this.router.navigate(["/error/internal"])
    },
    complete: () => {
      this.deleteDispose(data)
    }
  })
}
deleteDispose(data: any) {
  this.chemicalService.delete_disposal(data.id).subscribe({
    next: (result: any) => { },
    error: (err: any) => {
      this.router.navigate(["/error/internal"])
    },
    complete: () => {
      const statusText = "Disposal deleted"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.router.navigate(["/apps/chemical-management/transaction/"])
    }
  })
}
  

  //confirm to create the transaction
  submit(data:any) {
    const formStatus = this.Form.valid
    if (formStatus) {
      Swal.fire({
        title: 'Are you sure?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateCreateTransaction(data)
        }
      })
    } else if (!formStatus) {
      const statusText = "Please fill all mandatory fields"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      
    }
  }
  updateCreateTransaction(data: any) {
            const oldBalance = this.Form.value.balance
            const oldDispose = this.Form.value.disposed
            const disposedQuantity = data.disposed_quantity
            const newBalance = Number(oldBalance)-Number(disposedQuantity )
            const newdisposed = Number(oldDispose)+Number(disposedQuantity )
            const tranId =this.Form.value.id
    this.chemicalService.update_transaction_disposal(tranId,newdisposed,newBalance).subscribe({
      next: (result: any) => { 
  
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_dispose(data)
      }
    })
  }
//create dispose
create_dispose(data:any) {
  const reference = this.route.snapshot.paramMap.get('id');
  this.chemicalService.create_dispose(data,reference).subscribe(
    {
      next: (result: any) => {
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_notification()
      }
    }
  )
  
}
 

create_notification() {
  let data: any[] = []
  data.push({
    module: "Chemical Transaction",
    action: 'Disposed a Chemical:',
    reference_number: this.Form.value.reference_number,
    userID: this.Form.value.assignee,
    access_link: "/apps/chemical-management/transaction/",
    profile: this.Form.value.reporter
  })
  this.generalService.create_notification(data[0]).subscribe({
    next: (result: any) => { },
    error: (err: any) => {
      this.router.navigate(["/error/internal"])
    },
    complete: () => {
        const statusText = "Chemical Disposed"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.router.navigate(["/apps/chemical-management/transaction/"])
      
    }
  })
}

// create_activity() {
//   console.log(this.Form.value)
//   this.sustainabilityService.report_activity(this.Form.value).subscribe({
    
//     next: (result: any) => {
//       //console.log(result)
//      },
//     error: (err: any) => {
//       this.router.navigate(["/error/internal"])
//     },
//     complete: () => {
//       Swal.fire({
//         title: 'Activity Created',
//         imageUrl: "assets/images/success.gif",
//         imageWidth: 250,
//         text: "You have successfully created a activity. We will notify the assignee to take appropriate action. If it is required to modify the data, you can modify until the assignee start the process.",
//         showCancelButton: false,

//       })

//       this.router.navigate(["/apps/sustainability/register"])
//     }
//   })
// }

}
