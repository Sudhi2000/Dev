import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccidentService } from 'src/app/services/accident.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { accident_people } from 'src/app/services/schemas';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { CreateUpdateQuestionComponent } from '../create-update-question/create-update-question.component';
import { NewInspectionCategoryComponent } from '../new-inspection-category/new-inspection-category.component';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss']
})
export class ModifyComponent implements OnInit {

 
  separatorKeysCodes: number[] = [ENTER, COMMA];
  orgID: string
  Form: FormGroup
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  questionList: any[] = []
  inspectionCategory: any[] = []
  inspection: any[] = []

  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5

  constructor(private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private equipmentService: EquipmentService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      reference_number: [''],
      reporter:[''],
      created_date: [new Date()],
      template_name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      question: [''],
      status: ['Open', [Validators.required]],
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.equipment
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
        const status = result.insp_template_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_inspection_details()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }


  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }
  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }
  get_inspection_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.equipmentService.get_inspection_details(reference).subscribe({
      next: (result: any) => {
        console.log(result)
        this.Form.controls['id'].setValue(result.data[0].id)
        this.Form.controls['template_name'].setValue(result.data[0].attributes.template_name)
        this.Form.controls['category'].setValue(result.data[0].attributes.category)
        if (result.data[0].attributes.questions?.data?.length > 0) {
          this.questionList = result.data[0].attributes.questions.data
        } else {
          this.questionList = []
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.Form.controls['template_name'].disable()
        this.Form.controls['category'].disable()
        
      }
    })
  }

  showProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }
  createQuestion() {
    this.dialog.open(CreateUpdateQuestionComponent).afterClosed().subscribe(data => {
      if(data)
      {
        this.showProgressPopup();
        this.equipmentService.create_question(data, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            const statusText = "New Question added"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            Swal.close()
            this.ngOnInit()
          }
        })
      }
      
    })
  }
  updateQuestion(assignData: any) {
    this.dialog.open(CreateUpdateQuestionComponent, { data: assignData }).afterClosed().subscribe(data => {
      if (data) {
        //this.showProgressPopup();
        this.equipmentService.update_question(data).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Question updated"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            Swal.close()
            this.ngOnInit()
          }
        })
      }

    })
  }

  deleteQuestion(data: any) {
    const id = data.id
    this.showProgressPopup();
    this.equipmentService.delete_question(id).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Question removed"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
        this.ngOnInit()
      }
    })
  }
  
}
