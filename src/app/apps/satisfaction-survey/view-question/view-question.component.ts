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
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SatisfactionService } from 'src/app/services/satisfaction-survey.api.service';
import { Lightbox } from 'ngx-lightbox';
import { QuestionComponent } from '../create-question/question/question.component';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.scss']
})
export class ViewQuestionComponent implements OnInit {

  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  business_unit = new FormControl(null, [Validators.required]);
  Form: FormGroup;
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
  questioncategories: any[] = []
  questiontypes: any[] = []
  responseoptions: any[] = []
  questiontags: any[] = []
  observationData: any[] = []
  observations: any[] = []
  files: any = [];
  imageFormData = new FormData()
  tag: string[] = [];
  filteredtag: Observable<string[]>;
  tags: any[] = [];
  alltag: string[] = [];
  tagCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  multiLanguage: any[] = []
  languages: any[] = []

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
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private _lightbox: Lightbox,
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
      created_date: [new Date()],
      reference_number: [''],
      category: ['', [Validators.required]],
      question_category: ['', [Validators.required]],
      tags: [''],
      question_type: ['', [Validators.required]],
      question: ['', [Validators.required]],
      response_options: ['', [Validators.required]],
      question_weighting: ['', [Validators.required]],
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
      // business_unit: [null],
      status: ['Active'],
      responsible_name: [''],
    });

  }

  configuration() {
    this.get_languages()
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
          
          //this.get_dropdown_values()
          //this.get_observations()

          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
             // this.get_divisions()
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
            //this.get_divisions();
          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
       
       }
    })
  }

  get_dropdown_values() {

    const module = "Satisfaction Survey"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValue = result.data
        const category = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Survey Category")
        })
        this.categories = category
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
        // this.questionCategory()
        // this.questionType()
        // this.questionTag()
        // this.responseOptions()

        this.get_questions_details()
      }
    })
  }

  get_questions_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.satisfactionService.get_questions_details(reference).subscribe({
      next: (result: any) => {
        // const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        // let matchFound = true;
        // if (this.divisionUuids && this.divisionUuids.length > 0) {
        //   matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        // }

        // if ((matchFound || matchFound !== false)) {
          
          // console.log("Business unit:",result.data[0].attributes.business_unit)
          // this.business_unit.setValue(result.data[0].attributes.business_unit.data?.attributes.division_name)
          // this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id)
          this.Form.controls['id'].setValue(result.data[0].id)
          this.Form.controls['question_category'].setValue(result.data[0].attributes.question_category)
          this.Form.controls['category'].setValue(result.data[0].attributes.survey_category)
          this.Form.controls['tags'].setValue(result.data[0].attributes.tags)
          this.Form.controls['question_type'].setValue(result.data[0].attributes.question_type)
          this.Form.controls['question'].setValue(result.data[0].attributes.question)
          this.Form.controls['response_options'].setValue(result.data[0].attributes.response_options)
          this.Form.controls['status'].setValue(result.data[0].attributes.status)
          this.Form.controls['question_weighting'].setValue(result.data[0].attributes.question_weighting)
          this.Form.controls['created_user'].setValue(result.data[0].attributes.created_user)
          this.Form.controls['multiplechoice_options'].setValue(result.data[0].attributes.multiplechoice_options)
          this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number)


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

          // this.evidenceData = result.data[0].attributes.question_image.data
          // if (this.evidenceData != null) {
          //   this.Form.controls['image'].setValue('OK')
          // } else {
          //   this.Form.controls['image'].reset()
          // }

          // this.satisfactionService.getImage(environment.client_backend + '/uploads/' + result.data[0].attributes.question_image.data.attributes.image_name + '.' + result.data[0].attributes.question_image.data.attributes.format).subscribe((data: any) => {
          //   this.files.push(data)
          // })

          if (result.data[0].attributes.localizations.data.length > 0) {
            const multi = result.data[0].attributes.localizations.data
            multi.forEach((element: any) => {
              
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

          let eviDataBefore: any[] = []
          eviDataBefore.push({
            src: environment.client_backend + '/uploads/' + result.data[0].attributes.question_image?.data?.attributes.image_name + '.' + result.data[0].attributes.question_image?.data?.attributes.format,
            caption: "Image",
            thumb: environment.client_backend + '/uploads/' + result.data[0].attributes.question_image?.data?.attributes.image_name + '.' + result.data[0].attributes.question_image?.data?.attributes.format
          })
          this.files = eviDataBefore

        // }
        // else {
        //   this.router.navigate(["/apps/satisfaction-survey/question-history"])
        // }

      },
      error: (err: any) => { },
      complete: () => {
        this.Form.disable();
        // this.business_unit.disable()
        this.tagCtrl.disable()
       }

    })
  }

  questionCategory() {
    this.questioncategories = []
    const questioncategorie = this.dropDownValue.filter(function (elem) {
      return (elem.attributes.Category === "Question Category")
    })
    this.questioncategories = questioncategorie
  }

  questionType() {
    this.questiontypes = []
    const questioncategorie = this.dropDownValue.filter(function (elem) {
      return (elem.attributes.Category === "Question Type")
    })
    this.questiontypes = questioncategorie
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this.files, index);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  questionTag() {
    this.questiontags = []
    const questioncategorie = this.dropDownValue.filter(function (elem) {
      return (elem.attributes.Category === "Question Tags")
    })
    let primarydata: any[] = [];
    questioncategorie.forEach((elem: any) => {
      primarydata.push(elem.attributes.Value);
    });
    this.alltag = primarydata;

    this.questiontags = questioncategorie


  }

  removeprimary(part: string): void {
    // Remove the selected primary value
    this.tags = this.tags.filter(p => p !== part);

    // Add the removed value back to the options
    this.alltag.push(part);

    // Update the form control value
    this.Form.controls['tags'].setValue(this.tags.toString());

    // Update the filtered options for primary, secondary, and tertiary
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
        this.tag.pop();
      }
      else if (result.isConfirmed) {
        const data = {
          module: "Satisfaction Survey",
          category: "Question Tags",
          value: this.tag.pop()
        }
        this.satisfactionService.post_tag(data).subscribe({
          next: (result: any) => { },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => {
            this.questiontags = []
            this.satisfactionService.get_tag().subscribe({
              next: (result: any) => {
                let primarydata: any[] = [];
                const res = result.data.forEach((elem: any) => {
                  primarydata.push(elem.attributes.Value);
                })

                this.tag.push(primarydata[0]);

              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => { }
            })
          },
        })
      }
    })
  }

  onResponseOptionChange(event: any) {
    this.showNewField = event.value === 'Multiple Choice' ? true : false
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
        //console.log("Divisions:", this.divisions)
      }
    })
  }

  BusinessUnit(event: any) {
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
        this.check_question_status()
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
            id: result[0].id
          })
          this.satisfactionService.create_survey_question_image(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => {
              this.create_notification()
            }
          })
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
               
                  this.update_survey_question()
                
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
               
                  this.update_survey_question()
                
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

    this.satisfactionService.update_survey_question(this.Form.value).subscribe({
      next: (result: any) => {
        
      },
      error: (err: any) => { },
      complete: () => {
        Swal.fire({
          title: 'Updated Successfully',
          imageUrl: "assets/images/update.gif",
          imageWidth: 250,
          text: "You have successfully updated a Survey Question.",
          showCancelButton: false,

        }).then((result) => {
          this.router.navigate(["/apps/satisfaction-survey/question-history"])
        })
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

  viewLanguage(data: any) {
    const dialogData = {
      mode: "view",
      data: data
    };
    this.dialog.open(QuestionComponent, {
      data: dialogData
    }).afterClosed().subscribe((data:any) => {
      if (data) {
        this.multiLanguage.splice(this.multiLanguage.findIndex((existing) => existing.question === data.question), 1);
        this.multiLanguage.push(data)
      }
    })
  }
}
