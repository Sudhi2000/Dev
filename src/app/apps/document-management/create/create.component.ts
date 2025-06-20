import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { DocumentService } from 'src/app/services/document.api.service';
import { environment } from 'src/environments/environment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewTitleComponent } from '../new-title/new-title.component';
import { v4 as uuidv4 } from 'uuid';
import { map, startWith } from 'rxjs/operators';
import { ReportPreviewComponent } from '../../audit-inspection/external-audit/report-preview/report-preview.component';
import { documentPreviewComponent } from '../document-preview/document-preview.component';
import { NewIssuingAuthorityComponent } from '../new-issuing-authority/new-issuing-authority.component';
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
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  files: File[] = [];
  orgID: string
  documentID: string
  Form: FormGroup
  docfound: boolean = false
  docData = []
  categories: any[]
  subcategories: any[] = []
  observations: any[] = []
  allBodyPart: string[] = [];
  bodypart: string[] = [];
  bodyParts: any[] = []
  filteredBodyPart: Observable<string[]>;
  DocumentFiles: File[] = [];
  bodyPartCtrl = new FormControl('');
  divisions: any[] = []
  issued_date = new FormControl(null, [Validators.required]);
  expiry_date = new FormControl(null, [Validators.required]);
  notify_date = new FormControl(null, [Validators.required]);
  minDate = new Date();
  peopleList: any[] = [];
  dropdownValues: any
  documentType: any[] = []
  dropDownValue: any[] = []
  titles: any[] = []
  filterTitles: any[] = []
  issuingAuthority: any[] = []
  documentCount: number
  pdfSource: any
  docType: any
  evidenceFormData = new FormData()
  myControl = new FormControl('');
  filteredOptions: Observable<string[]>;
  year = new FormControl(null, [Validators.required]);
  Division = new FormControl(null, [Validators.required]);
  unitSpecific: any
  userDivision: any
  corporateUser: any
  userList: any
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
  no_expiryValue: boolean = false;
  title = new FormControl('', { validators: [Validators.required] });
  filteredTitles: Observable<any[]>;
  issuing_authority = new FormControl('', { validators: [Validators.required] });
  // issuingAuthority = [
  //   { attributes: { name: 'Authority 1' } },
  //   { attributes: { name: 'Authority 2' } },
  //   { attributes: { name: 'Authority 3' } }
  // ];
  filteredIssuingAuthorities: Observable<any[]>;

  constructor(
    public dialog: MatDialog,
    private documentService: DocumentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private generalService: GeneralService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) { }
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.filterTitles.filter(option => option.toLowerCase().includes(filterValue));
  // }
  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      reported_date: [new Date()],
      document_number: ['', [Validators.required]],
      version_number: ['', [Validators.required]],
      reporter: ['', [Validators.required]],
      reporterName: ['', [Validators.required]],
      reporterDesignation: [''],
      division: ['', [Validators.required]],
      title: ['', [Validators.required]],
      issuing_authority: ['', [Validators.required]],
      notify_date: [null, [Validators.required]],
      expiry_date: [null, [Validators.required]],
      issued_date: ['', [Validators.required]],
      org_id: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      responsible_name: [''],
      physical_location: [''],
      document_owner: [''],
      document_reviewer: ['', [Validators.required]],
      document_type: ['', [Validators.required]],
      DocumentFile: ['', [Validators.required]],
      docID: [''],
      remarks: [''],
      day_before_expiry: [null],
      ten_days_after_expiry: [null],
      uniqueID: [uuidv4()],
      year: ['', [Validators.required]],
      user_email: [],
      user: [''],
      business_unit: [null],
      updated_by: [''],
      no_expiry: []
    });

    // this.filteredTitles = this.title.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterTitle(value || '')),
    // );

    // this.filteredIssuingAuthorities = this.issuing_authority.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterissuingAuthority(value))
    // );

    // this.filteredTitles = this.title.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterTitle(value || '')),
    // );

    // this.filteredIssuingAuthorities = this.issuing_authority.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterissuingAuthority(value))
    // );

    this.issuing_authority.valueChanges.subscribe(value => {
      if (value == "") {
        this.filteredIssuingAuthorities = this.issuing_authority.valueChanges.pipe(
          startWith(''),
          map(value => this._filterissuingAuthority(value))
        );
      }
      else {
        this._filterissuingAuthority(value)
      }

    });

    this.title.valueChanges.subscribe(value => {
      if (value == "") {
        this.filteredTitles = this.title.valueChanges.pipe(
          startWith(''),
          map(value => this._filterTitle(value || '')),
        );
      }
      else {
        this._filterTitle(value)
      }

    });

  }

  onInputFocus() {
    this.filteredIssuingAuthorities = this.issuing_authority.valueChanges.pipe(
      startWith(''),
      map(value => this._filterissuingAuthority(value))
    );
  }

  onInputFocustitle() {
    this.filteredTitles = this.title.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTitle(value)),
    );
  }

  ngDoCheck(): void {
    this.issuing_authority.valueChanges.subscribe(value => {
      if (value == "") {
        this.filteredIssuingAuthorities = this.issuing_authority.valueChanges.pipe(
          startWith(''),
          map(value => this._filterissuingAuthority(value))
        );
      }
      else {
        this._filterissuingAuthority(value)
      }

    });

    this.title.valueChanges.subscribe(value => {
      if (value == "") {
        this.filteredTitles = this.title.valueChanges.pipe(
          startWith(''),
          map(value => this._filterTitle(value || '')),
        );
      }
      else {
        this._filterTitle(value)
      }
    });


  }

  onOptionSelected(event: any) {
    this.Form.controls['issuing_authority'].setValue(event.option.value)
  }

  onTitleSelected(event: any) {
    this.Form.controls['title'].setValue(event.option.value)
  }

  private _filterTitle(value: string): any[] {
    const filterValue = value?.toLowerCase();
    let data = this.filterTitles.filter(option => option.title.toLowerCase().includes(filterValue));
    return data
  }

  private _filterissuingAuthority(value: string): any[] {
    const filterValue = value.toLowerCase();
    let data = this.issuingAuthority.filter(option => option.attributes.name.toLowerCase().includes(filterValue));
    return data;
  }
  // private _filterissuingAuthority(value: string, authorities: any[]): any[] {
  //   const filterValue = value.toLowerCase();
  //   return authorities.filter(option => option.attributes.name.toLowerCase().includes(filterValue));
  // }

  filterDocumentType(value: any) {
    return value.attributes?.Category === "Document Type"
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.document
        this.documentCount = result.data.attributes.document_title
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

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.doc_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.Form.controls['user'].setValue(result.profile.id)
          this.Form.controls['updated_by'].setValue(result.profile.id)
          this.Form.controls['user_email'].setValue(result.profile.email)
          this.Form.controls['reporterName'].setValue(result.profile.first_name + ' ' + result.profile.last_name)
          this.Form.controls['reporterDesignation'].setValue(result.profile.designation)
          this.Form.controls['no_expiry'].setValue(false)
          // if (this.Form.value.no_expiry === false) {
          //   this.Form.controls['expiry_date'].setValidators(Validators.required)
          //   this.Form.controls['notify_date'].setValidators(Validators.required)
          // }
          this.get_dropdown_values()
          this.get_document_title()
          this.get_issuing_authority()
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions()
            } else if (!this.corporateUser) {
              result.profile.divisions.forEach((elem: any) => {
                this.divisions.push(elem)
              })
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

  issuedDate(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    const newYear = new Date(date.setDate(date.getDate() - 1));
    this.Form.controls['issued_date'].setValue(newDate)
    this.Form.controls['year'].setValue(newYear.getFullYear())
  }

  notifyDate(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10)
    this.Form.controls['notify_date'].setValue(newDate)
  }

  expiryDate(event: any) {
    const date = new Date(event.value);
    const newDate = new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0, 10);
    this.Form.controls['expiry_date'].setValue(newDate);
    const dayBeforeExpiry = new Date(date.setDate(date.getDate() - 1)).toISOString().slice(0, 10);
    this.Form.controls['day_before_expiry'].setValue(dayBeforeExpiry);
    const tenDaysAfterExpiry = new Date(date.setDate(date.getDate() + 11)).toISOString().slice(0, 10);
    this.Form.controls['ten_days_after_expiry'].setValue(tenDaysAfterExpiry);
    const sysDate = new Date();
    if (new Date(newDate) <= new Date(sysDate)) {
      this.Form.controls['status'].setValue("Expired");
    } else {
      this.Form.controls['status'].setValue("Active");
    }
  }
  get_document_title() {
    this.documentService.get_document_title().subscribe({
      next: (result: any) => {
        this.titles = result.data
      },
      error: (err: any) => { },
      complete: () => {
        if (this.docType) {
          this.getTitles(this.docType)
        }
      }
    })
  }

  get_issuing_authority() {
    this.documentService.get_issuing_authority().subscribe({
      next: (result: any) => {
        this.issuingAuthority = result.data
      }
    })
  }

  getTitles(data: any) {
    this.docType = data
    const type = data.value;
    const filteredTitles = this.titles
      .filter(title => title.attributes.category === type)
      .map(title => ({ id: title.id, title: title.attributes.title }))
      .sort((a, b) => a.title.localeCompare(b.title));

    this.filterTitles = filteredTitles;
    this.onInputFocustitle()
  }

  BusinessUnit(event: any) {
    if (event.value === 'All units') {
      this.Form.controls['division'].setValue(event.value)
    } else {
      this.Form.controls['division'].setValue(event.value.division_name)
      this.Form.controls['business_unit'].setValue(event.value.id)
    }
  }
  //get dropdown values
  get_dropdown_values() {
    const module = "Document Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.get_document_type()
      }
    })
  }

  get_document_type() {
    const dataType = this.dropdownValues.filter(function (data: any) {
      return (data.attributes.Category === "Document Type")
    })
    this.documentType = dataType
  }

  //get divisions
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

  new_title() {
    const title = this.titles.filter(function (elem: any) {
      return elem.attributes.created_user.data !== null;
    });
    const titleCount = Number(title.length);

    if (titleCount >= this.documentCount) {
      const statusText = "Document title limit exceeded";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else if (titleCount < this.documentCount) {
      this.dialog.open(NewTitleComponent).afterClosed().subscribe((data: any) => {
        if (data) {
          const type = this.Form.value.document_type;
          const title = data.title;
          this.documentService.create_title(type, title, this.Form.value.reporter).subscribe({
            next: (result: any) => {
              this.get_document_title()

            },
            error: (err: any) => { },
            complete: () => {
              const statusText = "Document title created successfully";
              this._snackBar.open(statusText, 'Ok', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.Form.controls['title'].setValue(data.title);
              this.title.setValue(data.title);
            }
          });
        }

      });
    }
  }

  delete_title(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the document title.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentService.delete_title(id).subscribe({
          next: (result: any) => {
            this.Form.controls.title.reset()
            this.get_document_title()
            this.Form.controls['title'].setValue("")
            this.cdr.detectChanges()
            this.title.reset()
          },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Document Title removed"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });

          }
        })
      }
    })
  }

  auditeeVal(data: any) {
    this.Form.controls['auditeeID'].setValue(data)
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
  submit() {
    this.docfound = false
    const formStatus = this.Form.valid
    if (this.Form.value.document_number) {
      this.documentService.get_document_number(this.Form.value.document_number).subscribe({
        next: (result: any) => {

          result.data.forEach((elem: any) => {
            if (elem.attributes.document_number.toLowerCase() == this.Form.value.document_number.toLowerCase()) {
              this.docfound = true
            }

          })
          if (this.docfound) {
            Swal.fire({
              title: 'Document Number Is Already Exist !',
              imageUrl: "assets/images/confirm-1.gif",
              imageWidth: 250,
              text: "Do you want to continue? Click 'Yes, Proceed' to save the document number. Note that there are many documents with this number. If you don't want to continue, click 'Cancel'.",
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, proceed!'
            }).then((result) => {
              if (result.isConfirmed) {
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
                      this.showProgressPopup();
                      this.create_document()
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
              else {
                this.Form.controls['document_number'].reset()
              }
            })
          }
          else {
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
                  this.showProgressPopup();
                  this.create_document()
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
        },
        error: (err: any) => {
          Swal.close()
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
        }
      })
    }
  }

  upload_document() {
    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.evidenceFormData.append('files', elem, this.Form.value.document_number + '.' + extension)
      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          this.Form.controls['docID'].setValue(result[0].id)
        },
        error: (err: any) => { },
        complete: () => {
        }
      })
    })
    this.files.splice(2);
  }

  onSelect(event: any) {
    const maxFiles = 5;
    const maxSizeMB = 10;
    const fileLength = this.files.length;
    if (fileLength + event.addedFiles.length <= maxFiles) {
      const size = event.addedFiles[0].size / (1024 * 1024);
      if (size > maxSizeMB) {
        const statusText = "Please choose a file below 10 MB";
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['pdf', 'xlsx', 'jpg', 'jpeg', 'png', 'docx'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase();
        const isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.files.push(...event.addedFiles);
          this.Form.controls['DocumentFile'].setErrors(null)
        } else {
          const statusText = "Please choose files with allowed extensions ('pdf', 'xlsx', 'jpg', 'jpeg', 'png', 'docx')";
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else {
      const statusText = "You have exceeded the upload limit";
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }


  create_document() {


    this.documentService.create_document(this.Form.value).subscribe({
      next: (result: any) => {

        this.Form.controls['id'].setValue(result.data.id)
        this.documentID = result.data.id
        this.create_activity()
      },
      error: (err: any) => {
        Swal.close()
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Document Created',
          imageUrl: "assets/images/success.gif",
          imageWidth: 250,
          text: "You have successfully added a document.",
          showCancelButton: false,
        })
        this.router.navigate(["/apps/document-management/register"])
      }
    })
  }

  create_activity() {
    const action = "Created a new document"

    this.documentService.create_activity_stream(action, this.Form.value).subscribe({
      next: (result: any) => {

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_document_file()
      }
    })
  }

  create_document_file() {
    const totalFiles = this.files.length;
    let uploadedFiles = 0;

    this.files.forEach((elem: any) => {
      const size = elem.size;

      if (size <= 10 * 1024 * 1024) {

        const extension = elem.name.split('.').pop().toLowerCase();
        const fileName = this.Form.value.title + '_' + this.Form.value.division + '.' + extension;

        const docdata = this.evidenceFormData = new FormData();
        docdata.append('files', elem, fileName);

        this.generalService.upload(docdata).subscribe({
          next: (result: any) => {
            this.Form.controls['docID'].setValue(result[0].id);
            const data = [{
              document_name: result[0].hash,
              format: extension,
              document_id: result[0].id,
              document_management: this.documentID,
            }];

            this.documentService.create_document_file(data[0]).subscribe({
              next: () => {
                uploadedFiles++;
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"]);
              },
              complete: () => {

              }
            });
          },
          error: (err: any) => {
          },
          complete: () => {
          }
        });
      } else {
        const statusText = "File size exceeds 10MB: " + elem.name;
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    });

    if (totalFiles === 0) {
      Swal.fire({
        title: 'Document Created',
        imageUrl: "assets/images/success.gif",
        imageWidth: 250,
        text: "You have successfully added a document.",
        showCancelButton: false,
      });
      this.router.navigate(["/apps/document-management/register"]);
    }
  }

  new_issuing_authority() {
    this.dialog.open(NewIssuingAuthorityComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.issuingAuthority.find(obj => obj.attributes.name === data.name);
        if (found) {
          const statusText = "Issuing Authority already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.documentService.create_issuing_authority(data.name, this.Form.value.reporter).subscribe({
            next: (result: any) => {
              this.documentService.get_issuing_authority().subscribe({
                next: (result: any) => {
                  this.issuingAuthority = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Issuing Authority created successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['issuing_authority'].setValue(result.data.attributes.name)
                  //this._filterissuingAuthority(data.name)
                  this.issuing_authority.setValue(result.data.attributes.name);
                  this.onInputFocus()
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

  validate_expiry() {
    if (this.Form.value.no_expiry === true) {
      this.Form.controls['expiry_date'].removeValidators(Validators.required)
      this.Form.controls['notify_date'].removeValidators(Validators.required)
      this.Form.controls['status'].setValue('Active')
      this.Form.controls['day_before_expiry'].reset()
      this.Form.controls['ten_days_after_expiry'].reset()
      this.Form.controls['expiry_date'].setValue(null)
      this.Form.controls['notify_date'].setValue(null)
    } else if (this.Form.value.no_expiry === false) {
      this.Form.controls['expiry_date'].setValidators(Validators.required)
      this.Form.controls['notify_date'].setValidators(Validators.required)
    }
    this.Form.controls['expiry_date'].updateValueAndValidity();
    this.Form.controls['notify_date'].updateValueAndValidity();
  }


  go_back() {
    this.router.navigate(["/apps/document-management/register"])
  }
  responsible(data: any) {
    this.Form.controls['responsible_name'].setValue(data.attributes.first_name + ' ' + data.attributes.last_name)
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);

    if (this.files.length === 0) {
      this.Form.controls['DocumentFile'].setErrors({ required: true });

    }
  }
}