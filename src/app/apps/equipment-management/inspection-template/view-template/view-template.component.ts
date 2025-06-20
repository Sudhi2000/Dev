import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { NewInspectionCategoryComponent } from '../new-inspection-category/new-inspection-category.component';
import { CreateUpdateQuestionComponent } from '../create-update-question/create-update-question.component';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-view-template',
  templateUrl: './view-template.component.html',
  styleUrls: ['./view-template.component.scss']
})
export class ViewTemplateComponent implements OnInit {

  Form: FormGroup
  inspectionCategory: any[] = []
  orgID: any
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  inspection: any[] = []
  questionList: any[] = []
  questionListUpdate: any[] = []

  update: boolean = false
  create: boolean = false




  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any, private generalService: GeneralService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private equipmentService: EquipmentService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<ViewTemplateComponent>) { }

  ngOnInit() {
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
      status: ['Active', [Validators.required]],
      number_of_questions: [0]
    });

  }

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

  get_inspection_categories() {
    this.equipmentService.get_inspection_category().subscribe({
      next: (result: any) => {
        console.log(result)
        this.inspectionCategory = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        if (this.defaults) {
          this.update = true
          this.create = false

          console.log('have data')
          console.log(this.defaults)
          this.Form.controls['template_name'].setValue(this.defaults.attributes.template_name)
          this.Form.controls['category'].setValue(this.defaults.attributes.category)
          this.Form.controls['id'].setValue(this.defaults.id)
          this.Form.controls['number_of_questions'].setValue(this.defaults.attributes.questions.data.length)

          this.questionListUpdate = this.defaults.attributes.questions.data

          // this.defaults.attributes.questions.data.forEach((ques: any) => {
          //   this.questionList.push(ques.attributes)
          // })
          console.log(this.questionList)

          this.Form.controls['template_name'].disable()
          this.Form.controls['category'].disable()





        } else {
          this.update = false
          this.create = true

          console.log('no data')
        }
      }
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
      this.Form.enable()
      if (this.defaults) {
        if (data) {
          // this.questionListUpdate.push(
          //   {
          //     attributes: {
          //       question: data.question
          //     }
          //   }
          // )

          // console.log(this.questionListUpdate)

          const number = Number(this.Form.value.number_of_questions)
          console.log(number)
          const newNumber = Number(number) + 1
          console.log(newNumber)

          this.Form.controls['number_of_questions'].setValue(newNumber);
          this.equipmentService.create_question(data, this.Form.value).subscribe({
            next: (result: any) => {
              this.questionListUpdate.push(
                {
                  id:result.data.id,
                  attributes: {
                    question: result.data.attributes.question
                  }
                }
              )
            },
            error: (err: any) => { },
            complete: () => {

            }
          })
        }


      } else {

        if (data) {
          this.questionList.push(data)
          if (this.questionList.length > 0) {
            this.Form.controls['question'].setErrors(null);
            this.Form.controls['number_of_questions'].setValue(this.questionList.length);
          } else {
            this.Form.controls['question'].setValidators(Validators.required);
          }
        }

      }





    })



  }

  deleteQuestion(data: any) {
    if (this.defaults) {
      console.log(data)
      this.equipmentService.delete_question(data.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.questionListUpdate.splice(this.questionListUpdate.findIndex((existingCustomer) => existingCustomer.id === data.id), 1);

        }
      })

    } else {
      this.questionList.splice(this.questionList.findIndex((existingCustomer) => existingCustomer.id === data.id), 1);

    }

  }

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

  close() {
    this.dialogRef.close()
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
            this.router.navigate(["/apps/equipment-management/inspection-template/register"])
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
      this.dialogRef.close()
    }
  }
}
