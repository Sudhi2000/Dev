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
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {


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
      reporter: [''],
      created_date: [new Date()],
      template_name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      question: [''],
      status: ['Open', [Validators.required]],
      number_of_questions:['']
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
          this.get_inspection_categories()
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
  get_inspection_categories() {
    this.equipmentService.get_inspection_category().subscribe({
      next: (result: any) => {
        console.log(result)
        this.inspectionCategory = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  new_inspection_category() {
    this.dialog.open(NewInspectionCategoryComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.inspection.find(obj => obj.attributes.name === data.name);
        if (found) {
          const statusText = "Category already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.equipmentService.create_inspection_category(data, this.Form.value.reporter).subscribe({
            next: (result: any) => {
              this.equipmentService.get_inspection_category().subscribe({
                next: (result: any) => {
                  this.inspectionCategory = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Category created successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['category'].setValue(result.data.attributes.name)

                }
              })
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => { }
          })
        }

      }
    })
  }
  createQuestion() {
    this.dialog.open(CreateUpdateQuestionComponent).afterClosed().subscribe(data => {
      if (data) {
        this.questionList.push(data)
        if (this.questionList.length > 0) {
          this.Form.controls['question'].setErrors(null);
          this.Form.controls['number_of_questions'].setValue(this.questionList.length);
        } else {
          this.Form.controls['question'].setValidators(Validators.required);
        }
      }
    })
  }

  deleteQuestion(data: any) {
    this.questionList.splice(this.questionList.findIndex((existingCustomer) => existingCustomer.id === data.id), 1);
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
        this.showProgressPopup();
        this.create_reference_number()
      }
    })

  }
  create_reference_number() {
    this.equipmentService.get_inspection().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const newReference = 'TEM-' + newCount
        this.Form.controls['reference_number'].setValue(newReference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_inspection()
      }
    })
  }

  create_inspection() {
    this.equipmentService.create_inspection(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_question()
      }
    })
  }
  create_question() {
    if (this.questionList.length > 0) {
      this.questionList.forEach(elem => {
        this.equipmentService.create_question(elem, this.Form.value.id).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            Swal.close()
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            Swal.fire({
              title: 'Inspection Template Created',
              imageUrl: "assets/images/success.gif",
              imageWidth: 250,
              text: "You have successfully created a inspection template.",
              showCancelButton: false,

            })
            this.router.navigate(["/apps/equipment-management/inspection_template/register"])
          }
        })
      })
    } else {
      Swal.fire({
        title: 'Inspection Template Created',
        imageUrl: "assets/images/success.gif",
        imageWidth: 250,
        text: "You have successfully created a inspection template.",
        showCancelButton: false,
      })
      this.router.navigate(["/apps/equipment-management/inspection_template/register"])
    }
  }


}
