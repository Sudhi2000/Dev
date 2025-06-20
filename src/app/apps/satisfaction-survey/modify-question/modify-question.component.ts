import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { QuestionComponent } from '../create-question/question/question.component';
import { SurveyCategoryComponent } from '../survey-category/survey-category.component';
import { SurveyQuestionCategoryComponent } from '../survey-question-category/survey-question-category.component';
// import { translate } from '@vitalets/google-translate-api';
// const { Translate } = require('@google-cloud/translate').v2;
@Component({
  selector: 'app-modify-question',
  templateUrl: './modify-question.component.html',
  styleUrls: ['./modify-question.component.scss']
})
export class ModifyQuestionComponent implements OnInit {


  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  business_unit = new FormControl(null, [Validators.required]);
  Form: FormGroup;
  draft: boolean
  draftstatus: boolean
  peopleList: any[] = [];
  orgID: string;
  unitSpecific: any
  multiplechoice_options: any
  userDivision: any
  corporateUser: any
  dropDownValue: any[] = []
  divisions: any[] = []
  divisionUuids: any[] = []
  evidenceData: any
  evidenceImageCount: number = 0
  evidenceCount: number = 0
  fileCount: number = 0
  evidenceFormData = new FormData()
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
  tag: string[] = [];
  filteredtag: Observable<string[]>;
  tags: any[] = [];
  alltag: string[] = [];
  tagCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  Survey_question: string
  translated: string
  languages: any[] = []
  reff: any

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
  multiLanguage: any[] = []
  localizeddata: any[] = []
  unit: boolean = false
  localizedids: any[] = []
  count: any
  totalcount: any
  private countSubject = new BehaviorSubject<number>(0);
  count$ = this.countSubject.asObservable();

  constructor(
    private satisfactionService: SatisfactionService,
    private router: Router,
    private generalService: GeneralService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private _snackBar: MatSnackBar,
    private httpClient: HttpClient,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.filteredtag = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) =>
        part ? this._filterprimary(part) : this.alltag.slice()
      )
    );
  }



  ngOnInit(): void {
    this.configuration()

    this.Form = this.formBuilder.group({
      id: [''],
      created_date: [null],
      publishedAt: [null],
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
      modified_evidence: [''],
      image: [''],
      image_id: [''],
      image_name: [''],
      image_type: [''],
      //business_unit: [null],
      status: ['Active'],
      responsible_name: [''],
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
          //this.get_divisions()
          // this.get_dropdown_values()
          this.get_languages()
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
                this.divisionUuids.push(elem.division_uuid)
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
        // const category = result.data.filter(function (elem: any) {
        //   return (elem.attributes.Category === "Survey Category")
        // })
        // this.categories = category
        this.getSurveyCategories()
      },
      error: (err: any) => { },
      complete: () => {

        this.questionCategory()
        // this.questionType() check create-question for details
        this.questionTag()
        this.responseOptions()

        this.get_questions_details()

      }
    })
  }
  async get_questions_details() {

    this.evidenceData = null
    this.reff = this.route.snapshot.paramMap.get('id');
    this.satisfactionService.get_questions_details(this.reff).subscribe({
      next: async (result: any) => {

        // const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        // let matchFound = true;
        // if (this.divisionUuids && this.divisionUuids.length > 0) {
        //   matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        // }

        // if ((matchFound || matchFound !== false)) {
        //this.business_unit.setValue(result.data[0].attributes.business_unit.data?.attributes.division_name)
        //this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
        this.Form.controls['id'].setValue(result.data[0].id)        
        const surveyCategory = result.data[0].attributes.survey_category;
        this.Form.controls['category'].setValue(surveyCategory);
        this.onSurveyCatChange({ value: surveyCategory });
        const questionCategory = result.data[0].attributes.question_category;
        this.Form.controls['question_category'].setValue(questionCategory);
        
        this.Form.controls['tags'].setValue(result.data[0].attributes.tags)
        this.Form.controls['question_type'].setValue(result.data[0].attributes.question_type)
        this.Form.controls['question'].setValue(result.data[0].attributes.question)
        this.Form.controls['response_options'].setValue(result.data[0].attributes.response_options)
        this.Form.controls['status'].setValue(result.data[0].attributes.status)
        this.Form.controls['question_weighting'].setValue(result.data[0].attributes.question_weighting)
        this.Form.controls['created_user'].setValue(result.data[0].attributes.created_user)
        this.Form.controls['multiplechoice_options'].setValue(result.data[0].attributes.multiplechoice_options)
        this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)
        this.draftstatus = result.data[0].attributes.status == "Draft" ? true : false
        this.draft = result.data[0].attributes.status == "Draft" ? true : false
        this.Form.controls['created_date'].setValue(result.data[0].attributes.createdAt)
        this.Form.controls['publishedAt'].setValue(result.data[0].attributes.publishedAt)

        this.showNewField = result.data[0].attributes.response_options == "Multiple Choice" || result.data[0].attributes.response_options == "Single Choice" ? true : false

        const primarydata = result.data[0].attributes.tags
        if (primarydata) {
          const split_string = primarydata.split(",");
          this.tags = split_string
        }
        const selectedtags = this.tags.slice();
        const remainingPrimaryValues = this.alltag.filter(value => !selectedtags.includes(value));

        this.alltag = remainingPrimaryValues

        this.Form.controls['tags'].setValue(selectedtags.toString());


        this.filteredtag = this.tagCtrl.valueChanges.pipe(
          startWith(null),
          map((part: string | null) => (part ? this._filterprimary(part) : this.alltag.slice()))
        );


        if (result.data[0].attributes.localizations.data.length > 0) {
          this.localizeddata = []
          this.multiLanguage = []
          this.localizeddata = result.data[0].attributes.localizations.data
          this.localizeddata.forEach((element: any) => {
            const lang = this.languages.find(data => data.code === element.attributes.locale)
            const newData = {
              org_id: this.orgID,
              language: lang.name,
              language_locale: element.attributes.locale,
              question: element.attributes.question,
            };
            this.multiLanguage.push(newData);

          });
        }

        this.evidenceData = result.data[0].attributes.question_image.data
        if (this.evidenceData != null) {
          this.Form.controls['image'].setValue('OK')
          this.files = []
          this.satisfactionService.getImage(environment.client_backend + '/uploads/' + result.data[0].attributes.question_image.data.attributes.image_name + '.' + result.data[0].attributes.question_image.data.attributes.format).subscribe((data: any) => {
            this.files.push(data)
          })
        } else {
          this.files = []
          this.Form.controls['image'].reset()
        }



        // }
        // else {
        //   this.router.navigate(["/apps/satisfaction-survey/question-history"])
        // }

      },
      error: (err: any) => { },
      complete: () => {
      }

    })
  }

  get_language_details() {

    this.reff = this.route.snapshot.paramMap.get('id');
    this.satisfactionService.get_questions_details(this.reff).subscribe({
      next: async (result: any) => {

        if (result.data[0].attributes.localizations.data.length > 0) {
          this.localizeddata = []
          this.multiLanguage = []
          this.localizeddata = result.data[0].attributes.localizations.data
          this.localizeddata.forEach((element: any) => {
            const lang = this.languages.find(data => data.code === element.attributes.locale)
            const newData = {
              org_id: this.orgID,
              language: lang.name,
              language_locale: element.attributes.locale,
              question: element.attributes.question,
            };
            this.multiLanguage.push(newData);

          });
        }
      },
      error: (err: any) => { },
      complete: () => {
      }

    })
  }

  get_languages() {
    this.satisfactionService.get_languages().subscribe({
      next: (result: any) => {
        this.languages = result

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.get_dropdown_values()

      }
    })
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
  //   const questioncategorie = this.dropDownValue.filter(function (elem) {
  //     return (elem.attributes.Category === "Question Tags")
  //   })
  //   let primarydata: any[] = [];
  //   questioncategorie.forEach((elem: any) => {
  //     primarydata.push(elem.attributes.Value);
  //   });
  //   this.alltag = primarydata;

  //   this.questiontags = questioncategorie


  // }

  questionTag() {

    this.alltag = [];
    this.get_question_tag_codes()


    forkJoin().subscribe(() => {

      this.tag = this.tag.filter(code =>
        this.alltag.includes(code)
      );

    });
  }

  async get_question_tag_codes() {
    try {
      const result: any = await this.satisfactionService.get_tag().toPromise();

      const tagCodes = result.data.map((item: any) => item.attributes.tag_name);

      this.alltag = tagCodes;

      this.filteredtag = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map((part: string | null) => part ? this._filtertagCodes(part) : this.getFilteredCodes())
      );

    } catch (err) {
      this.router.navigate(["/error/internal"]);
    }
  }

  private _filtertagCodes(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.getFilteredCodes().filter((code) =>
      code.toLowerCase().includes(filterValue)
    );
  }

  private getFilteredCodes(): string[] {
    return this.alltag.filter((code) => !this.tag.includes(code));
  }

  removeprimary(part: string): void {
    this.tags = this.tags.filter(p => p !== part);

    this.alltag.push(part);

    this.Form.controls['tags'].setValue(this.tags.toString());

    this.filteredtag = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filterprimary(value) : this.alltag.slice()
      )
    );
  }

  selectedprimary(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;
    this.tags.push(selectedValue);
    this.Form.controls['tags'].setValue(this.tags.toString());

    this.tagCtrl.setValue(null);
    this.alltag = this.alltag.filter(part => part !== selectedValue);

    this.filteredtag = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((part: string | null) =>
        part ? this._filterprimary(part) : this.alltag.slice()
      )
    );

  }

  addprimary(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  handleKeyDown() {
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
        this.tags.pop();
      }
      else if (result.isConfirmed) {
        const data = {
          module: "Satisfaction Survey",
          category: "Question Tags",
          value: this.tags.pop()
        }

        this.satisfactionService.create_tag(data.value, this.Form.value.created_user.data.id).subscribe({
          next: (result: any) => {
            this.tags.push(result.data.attributes.tag_name);
            this.Form.controls['tags'].setValue(this.tags.join(','));
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

  onResponseOptionChange(event: any) {
    this.showNewField = event.value === 'Multiple Choice' || event.value === 'Single Choice' ? true : false
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
      complete: () => {
      }
    })
  }

  BusinessUnit(event: any) {
    this.unit = true;
    const business_unit = this.divisions.find(data => data.division_name === event.value)
    this.Form.controls['business_unit'].setValue(business_unit.id)
  }


  Inactive() {
    this.Form.controls['status'].setValue("Inactive")
  }

  Active() {
    this.Form.controls['status'].setValue("Active")
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
        Swal.fire({
          title: 'Question Reported',
          imageUrl: "assets/images/reported.gif",
          imageWidth: 250,
          text: "You have successfully created a Question.",
          showCancelButton: false,

        })
        this.router.navigate(["/apps/satisfaction-survey/create-question"])
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
          this.Form.controls['modified_evidence'].setValue('ok')
          this.upload_image()
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

  onRemove(file: File): void {
    this.showProgressPopup()

    const documentId = this.evidenceData?.id;
    if (documentId) {
      this.satisfactionService.delete_question_image(documentId).subscribe({
        next: (result: any) => {

          this.generalService.delete_image(result.data.attributes.image_id).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = "Document Deleted";
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.files = []
              this.get_question_image()
              // this.document_details();
            }
          })

        },
        error: (error: any) => {
        },
      });
    }
  }

  get_question_image() {
    this.evidenceData = null
    this.satisfactionService.get_questions_details(this.reff).subscribe({
      next: (result: any) => {
        this.evidenceData = result.data[0].attributes.question_image.data
        if (this.evidenceData != null) {
          this.Form.controls['image'].setValue('OK')
          this.files = []
          this.satisfactionService.getImage(environment.client_backend + '/uploads/' + result.data[0].attributes.question_image.data.attributes.image_name + '.' + result.data[0].attributes.question_image.data.attributes.format).subscribe((data: any) => {
            this.files.push(data)
          })
        } else {
          this.files = []
          this.Form.controls['image'].reset()
        }

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.close()
      }
    })
  }

  create_reference_number() {
    this.satisfactionService.get_questions().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const newReference = 'QUE-' + newCount
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
    // this.satisfactionService.create_survey_question(this.Form.value).subscribe({
    //   next: (result: any) => {
    //     this.Form.controls['id'].setValue(result.data.id)
    //   },
    //   error: (err: any) => {
    //     this.router.navigate(["/error/internal"])
    //   },
    //   complete: () => {
    //     this.upload_image()
    //   }
    // })
  }

  submit() {
    this.draft = false
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
        //this.check_question_status()
        this.update_survey_question()
      }
    })

  }

  check_question_status() {

    const reference = this.route.snapshot.paramMap.get('id');
    this.satisfactionService.get_questions_details(reference).subscribe({
      next: (result: any) => {

        if (this.Form.value.modified_evidence === "ok") {
          this.deleteImage()

        } else {

          this.update_survey_question()
        }

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
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

  deleteImage() {

    const id = this.evidenceData?.id
    if (id != null) {

      this.generalService.delete_image(this.evidenceData.attributes.image_id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {


          this.deleteEvidence()

        }
      })

    }

  }

  deleteEvidence() {

    const id = this.evidenceData?.id
    if (id != null) {

      this.satisfactionService.delete_question_image(id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.uploadImages()
        }

      })
    }
  }

  upload_image() {

    this.localizedids.push(this.Form.value.id);
    this.localizeddata.forEach((elem: any) => {
      this.localizedids.push(elem.id);
    })
    this.files.forEach((elem: any) => {
      this.imageFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.imageFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
      this.generalService.upload(this.imageFormData).subscribe({
        next: (result: any) => {
          //this.localizedids.forEach(elem => {
          let data: any[] = []
          data.push({
            image_name: result[0].hash,
            format: extension,
            question: this.Form.value.id,
            id: result[0].id
          })
          this.satisfactionService.create_survey_question_image(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              const statusText = "Uploaded question image"
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.get_question_image()
            }
          })
          //})
        },
        error: (err: any) => { },
        complete: () => {

        }
      })
    })
  }

  uploadImages() {

    // const fileLength = this.files.length
    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      if (elem.name) {
        const extension = elem.name.split('.').pop().toLowerCase()
        this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
        this.generalService.upload(this.evidenceFormData).subscribe({
          next: (result: any) => {
            let data: any[] = []
            data.push({
              image_name: result[0].hash,
              format: extension,
              accident: this.Form.value.id,
              id: result[0].id,
              question: this.Form.value.id
            })
            this.satisfactionService.create_survey_question_image(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {

                //this.update_survey_question()

              }
            })
          },
          error: (err: any) => { },
          complete: () => { }
        })
      } else {
        const extension = elem.type.split('/').pop().toLowerCase()
        this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
        this.generalService.upload(this.evidenceFormData).subscribe({
          next: (result: any) => {
            let data: any[] = []
            data.push({
              image_name: result[0].hash,
              format: extension,
              accident: this.Form.value.id,
              id: result[0].id
            })
            this.satisfactionService.create_survey_question_image(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {

                // this.update_survey_question()

              }
            })
          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
    })
  }

  update_survey_question() {
    this.Form.value.question_weighting = this.Form.value.question_weighting == "" ? 0 : this.Form.value.question_weighting;
    this.satisfactionService.update_survey_question(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
        let data = {
          ...result.data.attributes,
          //business_unit: this.Form.value.business_unit,
          created_user: this.Form.value.created_user
        }
        this.totalcount = this.multiLanguage.length > 0 ? this.multiLanguage.length : 0;
        this.countSubject.next(0);
        if (this.multiLanguage.length > 0) {
          this.multiLanguage.forEach(async elem => {

            const temp = this.localizeddata.find(d => d.attributes.locale === elem.language_locale)
            if (temp !== undefined) {
              // this.satisfactionService.update_survey_question_multilanguage(elem, data, temp.id).subscribe({
              //   next: (result: any) => {

              //   },
              //   error: (err: any) => {

              //   },
              //   complete: () => {
              //   }
              // })
              try {
                await firstValueFrom(
                  this.satisfactionService.update_survey_question_multilanguage(elem, data, temp.id)
                    .pipe(
                      retryWhen(errors => errors.pipe(delay(1000), take(3)))
                    )
                );
                this.countSubject.next(this.countSubject.getValue() + 1);
              } catch (err) {
                this.router.navigate(["/error/internal"]);
              }
            }
            else {
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
              }
            }
          })
        }

        this.count$.subscribe(count => {
          if (this.totalcount === count) {

            if (this.draft == true) {
              const statusText = "Question details saved";
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.close();

              this.router.navigate(["/apps/satisfaction-survey/modify-question/" + this.reff])
              this.get_questions_details()
            }
            else {
              Swal.fire({
                title: this.draftstatus == false ? 'Question updated' : 'Question created',
                imageUrl: "assets/images/reported.gif",
                imageWidth: 250,
                text: this.draftstatus == false ? "You have successfully updated a Question." : "You have successfully created a Question.",
                showCancelButton: false,

              })
              this.router.navigate(["/apps/satisfaction-survey/question-history"])
            }

          }
        });




      },
      error: (err: any) => { },
      complete: () => {
      }
    })



  }

  addLanguage() {
    const dialogData = {
      mode: "create",
      data: this.multiLanguage
    };
    this.dialog.open(QuestionComponent, {
      data: dialogData
    }).afterClosed().subscribe((data: any) => {
      const isLanguageAlreadyAdded = this.multiLanguage.some(language => language.language_locale === data.language_locale);

      if (isLanguageAlreadyAdded) {
        const statusText = "This language has already been added";
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        if (data) {
          this.satisfactionService.add_survey_question(data, this.Form.value).subscribe({
            next: (result: any) => {
              const statusText = "New Question Added";
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            },
            complete: () => {
              this.get_language_details()
            }
          })

        }
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
    }).afterClosed().subscribe((data: any) => {
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
    }).afterClosed().subscribe((data: any) => {
      if (data) {
        const temp = this.localizeddata.find(d => d.attributes.locale === data.language_locale)

        if (temp !== undefined) {
          this.satisfactionService.update_language(data, temp.id).subscribe({
            next: (result: any) => {
              const statusText = "Survey Question Updated";
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            },
            complete: () => {
              this.get_language_details()
            }
          })
        }
      }
    })
  }
  deleteLanguage(data: any) {
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
        this.multiLanguage.splice(this.multiLanguage.findIndex((existing) => existing.language === data.language), 1);

        const temp = this.localizeddata.find(d => d.attributes.locale === data.language_locale)
        this.localizeddata.splice(this.localizeddata.findIndex((existing) => existing.attributes.locale === data.language_locale), 1);

        if (temp !== undefined) {
          this.satisfactionService.deleteLocalization(this.Form.value.id, temp.id).subscribe({
            next: (result: any) => {
              const statusText = "Survey Question Deleted";
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            },
            complete: () => {
              this.get_language_details()
            }
          })
        }

        Swal.close()
      }
    })



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
    this.update_survey_question()
  }
  onSurveyCatChange(event: any) {
    this.filteredquestioncategories = []
    this.filteredquestioncategories = this.allQuestioncategories.filter(function (elem) {
      return (elem.attributes.filter === event.value)
    })    
  }
  new_survey_cat() {
    this.dialog.open(SurveyCategoryComponent, { data: { mode: 'create' } }).afterClosed().subscribe(data => {
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
            this.questionCategory()
          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
    })
  }
  new_survey_question_cat() {
    this.dialog.open(SurveyQuestionCategoryComponent, { 
      width: '500px', 
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

}
