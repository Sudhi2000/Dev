import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgxImageCompressService } from 'ngx-image-compress';
import { BehaviorSubject, Observable, delay, firstValueFrom, forkJoin, map, retryWhen, startWith, switchMap, take } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';
import { QuestionComponent } from './question/question.component';
import { SurveyCategoryComponent } from '../survey-category/survey-category.component';
import { SurveyQuestionCategoryComponent } from '../survey-question-category/survey-question-category.component';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss']
})
export class CreateQuestionComponent implements OnInit {

  @ViewChild('tagCodeInput') tagCodeInput: ElementRef<HTMLInputElement>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Form: FormGroup;
  ref: any
  draft: boolean
  unit: boolean = false
  peopleList: any[] = [];
  orgID: string;
  newTag: string;
  unitSpecific: any
  multiplechoice_options: any
  userDivision: any
  corporateUser: any
  dropDownValue: any[] = []
  divisions: any[] = []
  categories: any[] = []
  allQuestioncategories: any[] = []
  filteredquestioncategories: any[] = []
  questiontypes: any[] = []
  responseoptions: any[] = []
  questiontags: any[] = []
  observationData: any[] = []
  observations: any[] = []
  files: File[] = [];
  imageFormData = new FormData()
  tag: any[] = [];
  filteredtag: Observable<any[]>;
  tags: any[] = [];
  alltag: string[] = [];
  tagCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  d: any
  oldTags: any[] = [];
  multiLanguage: any[] = []
  localizedids: any[] = []
  languages: any[] = []
  language = new FormControl(null, [Validators.required]);
  alltagcodes: string[] = [];
  count: any
  totalcount: any
  private countSubject = new BehaviorSubject<number>(0);
  count$ = this.countSubject.asObservable();
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
  showNewField: boolean;

  constructor(
    private satisfactionService: SatisfactionService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private _snackBar: MatSnackBar,
    private httpClient: HttpClient,
    public dialog: MatDialog
  ) {

    this.filteredtag = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) =>
        part ? this._filterprimary(part) : this.getFilteredCodes()
      )
    );
  }
  private _filtertagCodes(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.getFilteredCodes().filter((code) =>
      code.toLowerCase().includes(filterValue)
    );
  }

  private getFilteredCodes(): string[] {
    return this.alltagcodes.filter((code) => !this.tag.includes(code));
  }

  ngOnInit(): void {

    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      created_date: [new Date()],
      reference_number: [''],
      category: ['', [Validators.required]],
      question_category: ['', [Validators.required]],
      tags: [''],
      question_type: [''],
      question: ['', [Validators.required]],
      response_options: ['', [Validators.required]],
      question_weighting: [''],
      created_user: [''],
      multiplechoice_options: [''],
      observation: [''],
      description: [''],
      org_id: [''],
      image: [''],
      image_id: [''],
      image_name: [''],
      image_type: [''],
      //business_unit: [''],
      status: ['Active'],
      responsible_name: [''],
      //language: ['', [Validators.required]],
    });

  }

  configuration() {

    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.satisfaction_survey
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
        const status = result.survey_question_create

        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {

          this.Form.controls['created_user'].setValue(result.profile.id)
          this.get_dropdown_values()
          //this.get_observations()

          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions()
            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results

            }
          } else {
            this.get_divisions();
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_dropdown_values() {

    const module = "Satisfaction Survey"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValue = result.data
        this.getSurveyCategories()
      },
      error: (err: any) => { },
      complete: () => {
        this.questionCategory()
        //this.questionType() commented on 05-06-2024 as per discussion with sir
        this.questionTag()
        this.responseOptions()
        this.get_languages()
      }
    })
  }
  getSurveyCategories() {
    this.satisfactionService.get_survey_categories().subscribe({
      next: (result: any) => {
        this.categories = result.data
      },
      error: (err: any) => { },
      complete: () => {

      }
    })
  }
  questionTag() {

    this.alltagcodes = [];
    this.get_question_tag_codes()


    forkJoin().subscribe(() => {

      this.tag = this.tag.filter(code =>
        this.alltagcodes.includes(code)
      );

    });
  }

  async get_question_tag_codes() {
    try {
      const result: any = await this.satisfactionService.get_tag().toPromise();

      const tagCodes = result.data.map((item: any) => item.attributes.tag_name);

      this.alltagcodes = tagCodes;

      this.filteredtag = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map((part: string | null) => part ? this._filtertagCodes(part) : this.getFilteredCodes())
      );

    } catch (err) {
      this.router.navigate(["/error/internal"]);
    }
  }


  questionCategory() {
    this.satisfactionService.get_survey_question_categories().subscribe({
      next: (result: any) => {
        this.allQuestioncategories = result.data
      },
      error: (err: any) => { },
      complete: () => {

      }
    })
    // this.questioncategories = []
    // const questioncategorie = this.dropDownValue.filter(function (elem) {
    //   return (elem.attributes.Category === "Question Category")
    // })
    // this.questioncategories = questioncategorie
  }

  questionType() {
    this.questiontypes = []
    const questioncategorie = this.dropDownValue.filter(function (elem) {
      return (elem.attributes.Category === "Survey Type")
    })
    this.questiontypes = questioncategorie
  }

  // questionTag() {
  //   this.questiontags = []
  //   this.satisfactionService.get_tag().subscribe({
  //     next: (result: any) => { 
  //       this.tag=result.data 
  //     },
  //     error: (err: any) => {
  //       this.router.navigate(["/error/internal"])
  //     },
  //     complete: () => { }
  //   })
  // }

  // removeprimary(part: string): void {
  //   // Remove the selected primary value
  //   this.tag = this.tag.filter(p => p !== part);

  //   // Add the removed value back to the options
  //   this.alltag.push(part);

  //   // Update the form control value
  //   this.Form.controls['tags'].setValue(this.tag.toString());

  //   // Update the filtered options for primary, secondary, and tertiary
  //   this.filteredtag = this.tagCtrl.valueChanges.pipe(
  //     startWith(null),
  //     map((value: string | null) =>
  //       value ? this._filterprimary(value) : this.alltag.slice()
  //     )
  //   );
  // }

  removeprimary(code: string): void {

    const index = this.tag.indexOf(code);
    if (index >= 0) {
      this.tag.splice(index, 1);
      this.Form.controls['tags'].setValue(this.tag.join(','));
      this.filteredtag = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map((part: string | null) => part ? this._filtertagCodes(part) : this.getFilteredCodes())
      );
    }
  }


  selectedprimary(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.value;
    this.tag.push(selectedValue);
    this.Form.controls['tags'].setValue(this.tag.toString());
    // this.tagCodeInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.alltag = this.alltag.filter(part => part !== selectedValue);

    this.filteredtag = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) =>
        part ? this._filterprimary(part) : this.getFilteredCodes()
      )
    );

  }

  addprimary(event: MatChipInputEvent): void {
    this.oldTags = this.tag;
    this.newTag = (event.value || '').trim();
    if (!this.newTag) {
      event.chipInput!.clear();
      this.tagCtrl.setValue(null);
      return;
    }

    this.satisfactionService.get_tag().subscribe({
      next: (result: any) => {
        const existingTags = result.data.map((item: any) => item.attributes.tag_name);

        if (existingTags.includes(this.newTag)) {
          const statusText = "It seems like this question tag already exists."
          this._snackBar.open(statusText, 'Ok', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          Swal.fire({
            title: 'Are you sure?',
            imageUrl: "assets/images/confirm-1.gif",
            imageWidth: 250,
            text: "Please confirm the addition of the new tag. Once added, it will be displayed as a chip in the Tags field.",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
          }).then((result) => {
            if (result.isConfirmed) {
              this.satisfactionService.create_tag(this.newTag, this.Form.value.created_user).subscribe({
                next: (result: any) => {
                  this.tag.push(result.data.attributes.tag_name);
                  this.Form.controls['tags'].setValue(this.tag.join(','));

                  event.chipInput!.clear();
                  this.tagCtrl.setValue(null);

                  this.questionTag();
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"]);
                }
              });
            }
          });
        }
      },
      error: (err: any) => {
      }
    });
  }




  handleKeyDown() {
    if (this.newTag !== undefined && this.oldTags.includes(this.newTag)) {
      const statusText = "It seems like this question tag already exists."
      this._snackBar.open(statusText, 'Ok', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      this.tag.pop();
    }
    else {
      Swal.fire({
        title: 'Are you sure?',
        imageUrl: "assets/images/confirm-1.gif",
        imageWidth: 250,
        text: "Please confirm the addition of the new tag. Once added, it will be displayed as a chip in the Tags field. Proceed with the addition by clicking 'Yes', or click 'Cancel' to review the tag entry.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {

        if (result.isDismissed) {
          this.tag.pop();
        }
        else if (result.isConfirmed) {
          this.satisfactionService.create_tag(this.newTag, this.Form.value.created_user).subscribe({
            next: (result: any) => {
              this.tag.push(result.data.attributes.tag_name);
              this.Form.controls['tags'].setValue(this.tag.toString());
              this.tagCodeInput.nativeElement.value = '';
              this.tagCtrl.setValue(null);
              this.alltag = this.alltag.filter(part => part !== result.attributes.tag_name);

              this.filteredtag = this.tagCtrl.valueChanges.pipe(
                startWith(null),
                map((part: string | null) =>
                  part ? this._filterprimary(part) : this.getFilteredCodes()
                )
              );
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {

            },
          })
        }
      })

    }

  }

  onResponseOptionChange(event: any) {
    const selectedOption = event.value;
    if (selectedOption === 'Multiple Choice' || selectedOption === 'Single Choice') {
      this.showNewField = true;
    } else {
      this.showNewField = false;
    }
  }
  onSurveyCatChange(event: any) {
    this.filteredquestioncategories = []
    this.filteredquestioncategories = this.allQuestioncategories.filter(function (elem) {
      return (elem.attributes.filter === event.value)
    })    
  }

  private _filterprimary(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.alltag.filter((part) =>
      part.toLowerCase().includes(filterValue)
    );
  }

  responseOptions() {
    this.responseoptions = []
    const questioncategorie = this.dropDownValue.filter(function (elem) {
      return (elem.attributes.Category === "Response Options")
    })
    this.responseoptions = questioncategorie
  }

  // question_category(data: any) {
  //   this.Form.controls['questioncategoryID'].setValue(data.id)
  // }

  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
        }));

        this.divisions = newArray;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_languages() {
    this.languages = []
    const lang = this.dropDownValue.filter(function (elem) {
      return (elem.attributes.Category === "Language")
    })
    this.languages = lang
  }

  BusinessUnit(event: any) {
    this.Form.controls['business_unit'].setValue(event.value.id)
  }

  LanguageChange(event: any) {

    this.Form.controls['language'].setValue(event.value.toString())

  }

  Inactive() {
    this.Form.controls['status'].setValue("Inactive")
  }

  Active() {
    this.Form.controls['status'].setValue("Active")
  }

  upload_image() {
    this.files.forEach((elem: any) => {
      this.imageFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.imageFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
      this.generalService.upload(this.imageFormData).subscribe({
        next: (result: any) => {

          let data: any[] = []
          data.push({
            image_name: result[0].hash,
            format: extension,
            question: this.Form.value.id,
            //question: elem,
            id: result[0].id
          })

          this.satisfactionService.create_survey_question_image(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              // this.create_notification()
            }
          })

        },
        error: (err: any) => { },
        complete: () => {
          this.create_notification()
        }
      })
    })
  }

  create_notification() {
    let data: any[] = []
    data.push({
      module: "Satisfaction Survey",
      action: 'Created a question',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.assignee,
      access_link: "/apps/satisfaction-survey/create-question",
      profile: this.Form.value.reporter
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        //Swal.close();
        // Swal.fire({
        //   title: 'Question Created',
        //   imageUrl: "assets/images/reported.gif",
        //   imageWidth: 250,
        //   text: "You have successfully created a Question.",
        //   showCancelButton: false,

        // })
        // this.router.navigate(["/apps/satisfaction-survey/question-history"])
        if (this.draft == true) {
          const statusText = "Question details saved";
          this._snackBar.open(statusText, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          Swal.close();
          this.router.navigate(["/apps/satisfaction-survey/modify-question/" + this.ref])
        }
        else {
          Swal.fire({
            title: 'Question created',
            imageUrl: "assets/images/reported.gif",
            imageWidth: 250,
            text: "You have successfully created a Question.",
            showCancelButton: false,

          })
          this.router.navigate(["/apps/satisfaction-survey/question-history"])
        }
      }
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

  create_reference_number() {
    this.satisfactionService.get_questions().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const newReference = 'QUE-' + newCount
        this.ref = newReference
        this.Form.controls['reference_number'].setValue(newReference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_ques()
      }
    })
  }

  create_ques() {
    this.Form.value.question_weighting = this.Form.value.question_weighting == "" ? 0 : this.Form.value.question_weighting;
    this.satisfactionService.create_survey_question(this.Form.value).subscribe({
      next: async (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
        let data = {
          ...result.data.attributes,
          //business_unit: this.Form.value.business_unit,
          created_user: this.Form.value.created_user
        }


        // if (this.multiLanguage.length > 0) {
        //   this.multiLanguage.forEach(elem => {
        //     this.satisfactionService.create_survey_question_multilanguage(elem, data, this.Form.value.id).subscribe({
        //       next: (result: any) => {
        //       },
        //       error: (err: any) => {
        //         this.router.navigate(["/error/internal"])
        //       },
        //       complete: () => {
        //       }
        //     })
        //   })
        // }

        this.totalcount = this.multiLanguage.length > 0 ? this.multiLanguage.length : 0;
        this.countSubject.next(0);

        if (this.multiLanguage.length > 0) {
          for (const elem of this.multiLanguage) {
            try {
              await firstValueFrom(
                this.satisfactionService.create_survey_question_multilanguage(elem, data, this.Form.value.id)
                  .pipe(
                    retryWhen(errors => errors.pipe(delay(1000), take(3)))
                  )
              );
              this.countSubject.next(this.countSubject.getValue() + 1);
            } catch (err) {
              this.router.navigate(["/error/internal"]);
              break;
            }
          }
        }

        this.count$.subscribe(count => {
          if (this.totalcount === count) {
            if (this.files.length > 0) {
              this.upload_image()
            }
            else {
              if (this.draft == true) {
                const statusText = "Question details saved";
                this._snackBar.open(statusText, 'OK', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                Swal.close();
                this.router.navigate(["/apps/satisfaction-survey/modify-question/" + this.ref])
              }
              else {
                Swal.fire({
                  title: 'Question created',
                  imageUrl: "assets/images/reported.gif",
                  imageWidth: 250,
                  text: "You have successfully created a Question.",
                  showCancelButton: false,

                })
                this.router.navigate(["/apps/satisfaction-survey/question-history"])
              }

            }

          }
        });
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {


      }
    })
  }

  submit() {
    this.Form.controls['status'].setValue('Active')
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

  addLanguage() {
    const dialogData = {
      mode: "create",
      data: this.multiLanguage
    };
    this.dialog.open(QuestionComponent, {
      data: dialogData
    }).afterClosed().subscribe((data) => {
      if (data) {
        const temp = this.multiLanguage.find(d => d.language === data.language)
        if (temp !== undefined) {
          this.multiLanguage.splice(this.multiLanguage.findIndex((existing) => existing.language === data.language), 1);
        }
        this.multiLanguage.push(data)
      }
    })
  }
  viewLanguage(data: any) {
    const dialogData = {
      mode: "view",
      data: data
    };
    this.dialog.open(QuestionComponent, {
      data: dialogData
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.multiLanguage.splice(this.multiLanguage.findIndex((existing) => existing.language === data.language), 1);
        this.multiLanguage.push(data)
      }
    })
  }
  ModifyLanguage(data: any) {
    const dialogData = {
      mode: "update",
      data: data
    };
    this.dialog.open(QuestionComponent, {
      data: dialogData
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.multiLanguage.splice(this.multiLanguage.findIndex((existing) => existing.language === data.language), 1);
        this.multiLanguage.push(data)
      }
    })
  }
  deleteLanguage(data: any) {

    this.multiLanguage.splice(this.multiLanguage.findIndex((existing) => existing.language === data.language), 1);
  }

  stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  getTruncatedQuestion(question: string): string {
    if (question.length > 30) {
      return this.stripHtml(question.slice(0, 30) + '...');
    } else {
      return this.stripHtml(question);
    }
  }

  saveAsDraft() {
    this.draft = true
    this.Form.controls['status'].setValue('Draft')
    this.showProgressPopup();
    this.create_reference_number();
  }
  new_survey_cat() {
    this.dialog.open(SurveyCategoryComponent, {width:'500px' ,data: { mode: 'create' } }).afterClosed().subscribe(data => {
      if (data) {
        this.satisfactionService.create_survey_category(data).subscribe({
          next: (result: any) => {
            this.categories = []
            this.getSurveyCategories()
            this.Form.controls['category'].setValue(result.data.attributes.value);
          },
          error: (err: any) => { },
          complete: () => {

          }
        })
      } else {

      }
    })
  }

  editSurveycat(data: any) {
    this.dialog.open(SurveyCategoryComponent, { width: '500px', data: { data: data, mode: 'modify' }, }).afterClosed().subscribe(datas => {
      if (datas) {
        this.satisfactionService.update_survey_category(datas, data.id).subscribe({
          next: (result: any) => {
            this.categories = []
            this.getSurveyCategories()
          },
          error: (err: any) => { },
          complete: () => {

          }
        })
      } else {

      }
    })
  }

  deleteSurveycat(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the Survey Category.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.satisfactionService.delete_survey_category(data.id).subscribe({
          next: (result: any) => {
            this.categories = []
            this.getSurveyCategories()
          },
          error: (err: any) => { },
          complete: () => {
            this.questionCategory()

           }
        })
      }
    })
  }
  new_survey_question_cat() {
    this.dialog.open(SurveyQuestionCategoryComponent, { 
      width: '600px', 
      data: { mode: 'create', filter: this.Form.value.category } 
    }).afterClosed().subscribe(data => {
      if (data) {
        this.satisfactionService.create_survey_question_category(data).pipe(
          switchMap((result: any) => {
            return this.satisfactionService.get_survey_question_categories().pipe(
              map((res: any) => ({ res, newValue: result.data.attributes.value }))
            );
          })
        ).subscribe(({ res, newValue }) => {
          this.allQuestioncategories = res.data;
          this.onSurveyCatChange({ value: this.Form.value.category }); // Ensure latest filter is applied
          this.Form.controls['question_category'].setValue(newValue);
        });
      }
    });
  }
  
  editSurveyQuestioncat(data: any) {
    this.dialog.open(SurveyQuestionCategoryComponent, { 
      width: '500px', 
      data: { data: data, mode: 'modify' }
    }).afterClosed().subscribe(datas => {
      if (datas) {
        this.satisfactionService.update_survey_question_category(datas, data.id).pipe(
          switchMap(() => this.satisfactionService.get_survey_question_categories())
        ).subscribe((res: any) => {
          this.allQuestioncategories = res.data;
          this.onSurveyCatChange({ value: this.Form.value.category });
        });
      }
    });
  }
  
  deleteSurveyQuestioncat(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the Survey Category.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.satisfactionService.delete_survey_question_category(data.id).pipe(
          switchMap(() => this.satisfactionService.get_survey_question_categories())
        ).subscribe((res: any) => {
          this.allQuestioncategories = res.data;
          this.onSurveyCatChange({ value: this.Form.value.category });
        });
      }
    });
  }
  
}
