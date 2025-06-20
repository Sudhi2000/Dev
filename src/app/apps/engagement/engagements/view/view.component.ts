import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EngagementService } from 'src/app/services/engagement.api.service';

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
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ViewComponent implements OnInit {

  files: File[] = [];
  eventData: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orgID: string
  Form: FormGroup
  eventID: number
  eventFormData = new FormData()
  eventdate = new FormControl(null, [Validators.required]);
  minDate = new Date();
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
  eventDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  completedDate = new FormControl(null, [Validators.required]);
  constructor(private engagementService: EngagementService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private _snackBar: MatSnackBar,
    private httpClient: HttpClient,
    public dialog: MatDialog,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      reported_date: [new Date()],
      reference_number: [''],
      reporter: [''],
      event_title: [''],
      start: [''],
      end: [''],
      description: [''],
      status: [''],
      image: [''],
      completed_date: [''],
    });
    this.Form.disable()
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.engagement
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
        const status = result.event_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)

        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.get_engagement_details()
      }
    })
  }


  startDateChange(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['start'].setValue(newDate)
  }

  endDateChange(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['end'].setValue(newDate)
  }
  completed_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['completed_date'].setValue(newDate)
  }
  //get engagement details
  get_engagement_details() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id)
    this.engagementService.get_engagement_details(id).subscribe({
      next: (result: any) => {
        console.log(result)
        this.Form.controls['event_title'].setValue(result.data[0].attributes.event_title)
        this.Form.controls['id'].setValue(result.data[0].id)
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.Form.controls['description'].setValue(result.data[0].attributes.description)
        this.Form.controls['status'].setValue(result.data[0].attributes.status)
        this.eventDateRange.controls['start'].setValue(new Date(result.data[0].attributes.event_start_date))
        this.eventDateRange.controls['end'].setValue(new Date(result.data[0].attributes.event_end_date))
        this.Form.controls['completed_date'].setValue(result.data[0].attributes.completed_date)
        this.completedDate.setValue(new Date(result.data[0].attributes.completed_date)) 
        this.eventDateRange.disable()
        this.completedDate.disable()

        this.eventData = result.data[0].attributes.images.data
        if (this.eventData.length > 0) {
          this.Form.controls['image'].setValue('OK')
        } else {
          this.Form.controls['image'].reset()
        }
        result.data[0].attributes.images.data.forEach((event: any) => {
          this.engagementService.getImage(environment.client_backend + '/uploads/' + event.attributes.image_name + '.' + event.attributes.format).subscribe((data: any) => {
            this.files.push(data)
          })
        })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  onSelect(event: any) {
    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / 1024 / 1024
      if (size > 2) {
        const statusText = "Please choose an image below 2 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['jpg', 'jpeg', 'png'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.Form.controls['image'].setErrors(null)
          this.files.push(...event.addedFiles);
        } else {
          const statusText = "Please choose images ('jpg', 'jpeg', 'png')"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else if (fileLength < 6) {
      const statusText = "You have exceed the upload limit"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length === 0) {
      this.Form.controls['image'].reset()
    }
  }
  //confirm to creat the transaction
  submit() {
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
        this.update_engagement()
      }
    })

  }



  update_engagement() {
    this.engagementService.update_engagement(this.Form.value).subscribe({
      next: (result: any) => {
        console.log(result)
        this.files.forEach((elem: any) => {
          this.eventFormData.delete('files')
          const extension = elem.name.split('.').pop().toLowerCase()
          this.eventFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
          this.generalService.upload(this.eventFormData).subscribe({
            next: (result: any) => {
              let data: any[] = []
              data.push({
                event_name: result[0].hash,
                format: extension,
                engagement: this.Form.value.id,
                id: result[0].id
              })
              this.engagementService.create_engagement_image(data[0]).subscribe({
                next: (result: any) => { },
                error: (err: any) => { },
                complete: () => {
                 
                }
              })
            },
            error: (err: any) => { },
            complete: () => {
            }
          })
        })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Engagement Details Updated',
          imageUrl: "assets/images/success.gif",
          imageWidth: 250,
          text: "You have successfully updated the engagement details.",
          showCancelButton: false,
        })
        this.router.navigate(["/apps/engagement/engagements/history"])
      }
    })
  }

}
