import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { CreateChemicalNameComponent } from './create-chemical-name/create-chemical-name.component';
import Swal from 'sweetalert2'
import { forkJoin } from 'rxjs';
import { ChemicalMsdsDocumentComponent } from '../chemical-msds-document/chemical-msds-document.component';
import { saveAs } from 'file-saver'
import { CreateProductStandardComponent } from './create-product-standard/create-product-standard.component'
import { chemical_request } from 'src/app/services/schemas';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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
  selector: 'app-chemical-request',
  templateUrl: './chemical-request.component.html',
  styleUrls: ['./chemical-request.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChemicalRequestComponent implements OnInit {
  Form: FormGroup
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 5
  divisions: any[] = []
  commercialName: any[] = []
  zdhcCategory: any[] = []
  peopleList: any[] = []
  currency: string
  orgID: string
  storagePlace: any[] = []
  files: File[] = [];
  requestedUnit: any[] = []
  dropdownValues: any[] = []
  statements: File[] = [];
  Categories: any[] = []
  DivisionFilteredpeopleList: any[] = [];
  issuedDate = new FormControl(null);
  expiryDate = new FormControl(null);
  requestedUnitVal: string
  filteredZdhcCategory: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Division = new FormControl(null, [Validators.required]);
  userDivision: any
  corporateUser: any
  chemical_dropdown: any
  evidenceFormData = new FormData()
  unitSpecific: any
  ghsClassifications: any[] = []
  IssueList: any[] = []
  hazardStatementCode: any[] = [];
  allstatementcodes: string[] = [];
  Issues: any[] = []
  zdhcLevel: any[] = []
  toppingList: any[] = []
  standardList: any[] = []
  userId: any
  msds_sdsValue: boolean = false;
  requestDate = new FormControl(new Date());
  maxDate = new Date();
  deliveryDate = new FormControl(null, [Validators.required]);
  manufacturingDate = new FormControl(null);
  cheExpiryDate = new FormControl(null);
  invoiceDate = new FormControl(null);
  hazardTypes: any[] = []
  TypeList: any[] = []
  use_of_ppe = new FormControl(null);
  hazardType = new FormControl(null);
  ghsClassification = new FormControl(null);
  chemicalId: string;
  ApprovalValid_Date: any
  chemicalRequestSortedDatas: any[] = []
  msdsSortedDatas: any[] = []
  msdsSortedDatasPdf: any[] = []
  existingMsds = new Blob();
  constructor(private generalService: GeneralService,
    private chemicalService: ChemicalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      org_id: [''],
      id: [''],
      reference_number: [''],
      division: ['', [Validators.required]],
      created_date: [new Date()],
      requested_customer: [''],
      requested_merchandiser: [''],
      commercial_name: ['', [Validators.required]],
      substance_name: [''],
      formula: [''],
      reach_regi_number: [''],
      zdhc_use_category: ['', [Validators.required]],
      required_quantity: [0],
      required_quantity_val: [0],
      where_why: ['', [Validators.required]],
      status: ['Open', [Validators.required]],
      approver: [null],
      reporter: [null, [Validators.required]],
      required_unit: [null],
      requested_unit: ['', [Validators.required]],
      requested_quantity: [null, [Validators.required]],
      chemical_uuid: [null, [Validators.required]],
      reviewer: [null, [Validators.required]],
      business_unit: [null],
      product_standard: [''],
      chemical_form: ['', [Validators.required]],
      zdhc_level: [''],
      cas_no: [''],
      colour_index: [''],
      use_of_ppe: [''],
      hazardType: [''],
      ghsClassification: [''],
      document_name: [''],
      document_format: [''],
      document_id: [''],
      msds_sds_issued_date: [null],
      msds_sds_expiry_date: [null],
      msds_sds_document: [null],
      msds_sds: [{ value: false, disabled: true }],
      msds_doc_status: [null],
      msds_warning_date: [null],
      reviewer_notification: [null],
      request_date: [new Date()],
      msds_document: [null],
      approval_valid_date: [null],
      category: ['', Validators.required],
      chemical_inventory: [null]
    });
    this.get_dropdown_values()
    this.get_ppe_list()
    this.get_chemForm_dropdown()
    this.get_standard_list()
    this.Form.controls['msds_sds_issued_date'].removeValidators(Validators.required)
    this.Form.controls['msds_sds_expiry_date'].removeValidators(Validators.required)
    this.Form.controls['msds_doc_status'].removeValidators(Validators.required)


  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.chemical
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
        const status = result.chem_request_create
        this.userId = result.id
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.Form.controls['reporter'].setValue(result.profile.id)
          this.get_dropdown_values()
          this.get_chemical_name()
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_profiles()
              this.get_divisions()

            } else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
              })
              let results = divisions.join('&');
              this.userDivision = results

              this.get_unit_specific_profiles()
            }
          }
          else {
            this.get_profiles()
            this.get_divisions()

          }
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  async chatGPT() {
    // if (this.Form.value.commercial_name) {
    //   document.getElementById('ai-loader')?.classList.remove("hide");
    //   const commercialname = this.Form.value.commercial_name
    //   const configuration = new Configuration({
    //     apiKey: environment.OPENAI_API_KEY,
    //   });
    //   const openai = new OpenAIApi(configuration);
    //   let requestData = {
    //     model: 'text-davinci-003',//'text-davinci-003',//"text-curie-001",
    //     prompt: 'Get the formula for ' + commercialname + ' and display as plain text the formula only',//this.generatePrompt(animal),
    //     temperature: 0.95,
    //     max_tokens: 150,
    //     top_p: 1.0,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //   };
    //   let apiResponse = await openai.createCompletion(requestData);
    //   this.Form.controls['formula'].setValue(apiResponse.data.choices[0].text)
    //   document.getElementById('ai-loader')?.classList.add("hide");
    // }

  }



  new_name() {
    this.dialog.open(CreateChemicalNameComponent).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.commercialName.find(obj => obj.attributes.name === data.name);
        if (found) {
          const statusText = "Commercial name already exist"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.Form.patchValue({
            commercial_name: found.attributes.name,
            formula: found.attributes.formula,
            reach_regi_number: found.attributes.reach_regi_number,
            substance_name: found.attributes.substance_name,

          })
        } else {
          this.chemicalService.create_name(data, this.Form.value.reporter).subscribe({
            next: (result: any) => {
              this.chemicalService.get_chemical_name().subscribe({
                next: (result: any) => {
                  this.commercialName = result.data
                },
                error: (err: any) => {
                  this.router.navigate(["/error/internal"])
                },
                complete: () => {
                  const statusText = "Commercial name created successfully"
                  this._snackBar.open(statusText, 'Ok', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                  this.Form.controls['commercial_name'].setValue(result.data.attributes.name)
                  this.requestedUnitVal = result.data.attributes.unit
                  this.chatGPT()

                  this.onCommercialNameSelected(result.data.attributes.name)

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
  update_name(ID: any) {
    this.dialog.open(CreateChemicalNameComponent, { data: ID }).afterClosed().subscribe((data: any) => {
      if (data) {
        const found = this.commercialName.find(obj => obj.attributes.name === data.name)
        this.chemicalService.update_commercial_name(data, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.chemicalService.get_chemical_name().subscribe({
              next: (result: any) => {
                this.commercialName = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Commercial name updated successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['commercial_name'].setValue(result.data.attributes.name)
                this.requestedUnitVal = result.data.attributes.unit
                this.chatGPT()
                this.onCommercialNameSelected(result.data.attributes.name)
              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })

      }
    })
  }

  request_date(event: any) {
    const date = new Date(event.value)
    const newDate = new Date(date.setDate(date.getDate() + 1))
    this.Form.controls['request_date'].setValue(newDate);
  }

  get_divisions() {
    this.generalService.get_division(this.orgID).subscribe({
      next: (result: any) => {
        const newArray = result.data.map(({ id, attributes }: { id: any, attributes: any }) => ({
          id: id as number,
          division_name: attributes.division_name,
          division_uuid: attributes.division_uuid
        }));

        this.divisions = newArray;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  get_chemical_name() {
    this.chemicalService.get_chemical_name().subscribe({
      next: (result: any) => {
        this.commercialName = result.data
      }
    })
  }

  get_ppe_list() {
    this.chemicalService.get_ppe().subscribe({
      next: (result: any) => {
        this.toppingList = result.data
      }
    })
  }
  get_standard_list() {
    this.chemicalService.get_product_standard().subscribe({
      next: (result: any) => {
        this.standardList = result.data
      }
    })
  }
  // get_profiles() {
  //   this.chemicalService.get_chem_approvers().subscribe({
  //     next: (result: any) => {
  //       this.peopleList = result.data;
  //     },
  //     error: (err: any) => {
  //     },
  //     complete: () => {
  //     }
  //   });
  // }

  get_profiles() {
    this.chemicalService.get_chem_reviewers().subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }


  get_unit_specific_profiles() {
    this.chemicalService.get_unit_specific_get_chem_reviewers(this.userDivision).subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }

  get_dropdown_values() {
    const module = "Chemical Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        const category = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Category")
        })
        //this.Categories = category
        this.Categories = category.sort((a: any, b: any) => {
          if (a.attributes.Value === 'Others') return 1;
          if (b.attributes.Value === 'Others') return -1;
          return a.attributes.Value
            .localeCompare(b.attributes.Value)
        })
        this.deliverunit()
        this.zdhccategories()
        this.zdhclevels()
        this.hazardtype()
        this.ghsclassification()
      },
      error: (err: any) => { },
      complete: () => {
      }
    })
  }


  deliverunit() {
    this.requestedUnit = []
    const deliverunit = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Delivered Unit")
    })
    this.requestedUnit = deliverunit
  }
  GhsClassification(event: any) {
    this.Form.controls['ghsClassification'].setValue(event.value.toString())
  }

  PPE(event: any) {
    this.Form.controls['use_of_ppe'].setValue(event.value.toString())
  }
  materiality_Issue() {
    const type = this.Form.value.hazardType
    if (this.Form.value.hazardType) {
      const type2 = type.split(',')
      const data: Array<any> = []
      type2.forEach((element: any) => {
        const transactionData = this.IssueList.filter(function (elem) {
          return (elem.attributes.filter === element)
        })
        transactionData.forEach(elem2 => {
          data.push(elem2)
        })
      })
      this.Issues = data
    }
  }
  HazardType(event: any) {
    this.Form.controls['hazardType'].setValue(event.value.toString());
    this.materiality_Issue();

    this.allstatementcodes = [];
    if (!event.value || event.value.length === 0) {
      this.hazardStatementCode = [];
      return;
    }
    const observables = event.value.map((hazard_type: string) =>
      this.get_hazard_statement_codes(hazard_type)
    );

    forkJoin(observables).subscribe(() => {

      this.hazardStatementCode = this.hazardStatementCode.filter(code =>
        this.allstatementcodes.includes(code)
      );

    });
  }
  zdhclevels() {
    this.zdhcLevel = []
    const level = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "ZDHC Level")
    })
    this.zdhcLevel = level
  }
  hazardtype() {
    this.hazardTypes = []
    const hazardtype = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Hazard Type")
    })
    this.TypeList = hazardtype
  }
  ghsclassification() {
    this.ghsClassifications = []
    const ghsclassification = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "GHS Classification")
    })
    this.IssueList = ghsclassification
  }

  get_chemForm_dropdown() {
    const module = "Chemical Management"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        const data = result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Chemical Form Type' && elem.attributes.Module === module
        });
        let dropData: any[] = [];
        data.forEach((elem: any) => {
          dropData.push(elem.attributes.Value);
        });
        this.chemical_dropdown = dropData;
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }
  async get_hazard_statement_codes(hazard_type: string) {
    try {
      const result: any = await this.chemicalService.get_hazard_statement_codes().toPromise();

      const hazardTypesArray = hazard_type.split(',');
      const filteredCodes = result.data.filter((item: any) =>
        hazardTypesArray.includes(item.attributes.filter)
      );

      const statementCodes = filteredCodes.map((item: any) =>
        item.attributes.hazard_statement_code
      );

      this.allstatementcodes = this.allstatementcodes.concat(statementCodes);

    } catch (err) {
      this.router.navigate(["/error/internal"]);
    }
  }

  BusinessUnit(event: any) {
    this.Form.controls['division'].setValue(event.value.division_name)
    this.Form.controls['business_unit'].setValue(event.value.id)
    const selectedDivision = event.value.division_uuid
    this.DivisionFilteredpeopleList = this.peopleList.filter((data) =>
      data.attributes.divisions.data
        .map((division: any) => division.attributes.division_uuid)
        .includes(selectedDivision)
    );
  }

  reviewerClick() {
    const statusText = 'Please select Division'
    this.DivisionFilteredpeopleList.length === 0 &&
      this._snackBar.open(statusText, 'Ok', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
  }

  zdhccategories() {
    this.zdhcCategory = []
    const category = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "ZDHC Use Category")
    })
    this.zdhcCategory = category
  }

  findUnit(data: any) {
    this.Form.controls['chemical_uuid'].setValue(data.attributes.uuid)
  }

  findQuant(data: any) {
    this.Form.controls['required_unit'].setValue(this.requestedUnitVal)
    const quantity = data.target.value
    var newQuantity = (quantity.replace(this.requestedUnitVal, '')).trim()
    this.Form.controls['required_quantity'].setValue(Number(newQuantity))
    const amount = newQuantity
    const unit = this.requestedUnitVal
    this.Form.controls['required_quantity_val'].setValue('')
    this.Form.controls['required_quantity_val'].setValue(amount + ' ' + unit)
  }

  complete() {
    this.Form.controls['status'].setValue('Open')
    this.Form.controls['reviewer_notification'].setValue(false)
    this.submit()
  }

  draft() {
    this.Form.controls['status'].setValue('Draft')
    this.Form.controls['reviewer_notification'].setValue(true)
    this.submit()
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
    // this.chemicalService.get_chemical_request().subscribe({
    this.chemicalService.get_chemical_request_count().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = 'CHE-' + newCount
        this.Form.controls['reference_number'].setValue(reference)
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {

        if (this.Form.controls['status'].value !== 'Draft') {
          const approvalValidDate = new Date(this.ApprovalValid_Date);
          const currentDate = new Date();
          approvalValidDate.setHours(0, 0, 0, 0);
          currentDate.setHours(0, 0, 0, 0);
          if (this.ApprovalValid_Date && approvalValidDate >= currentDate) {
            this.Form.controls['status'].setValue("Approved")
            this.create_approval_request()

          } else {
            this.create_request()
          }

        } else {
          this.create_request()
        }



      }
    })
  }

  create_request() {
    this.chemicalService.create_request(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
        if (!this.Form.value.msds_document) {
          this.upload_msds_document()
        } else {
          this.existing_upload_msds_document()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_notification();
      }
    })
  }

  create_approval_request() {
    this.chemicalService.create_approval_request(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)

        this.chemicalService.create_chemical_inventory_approval(this.Form.value).subscribe({
          next: (result: any) => {
            this.Form.controls['chemical_inventory'].setValue(result.id)
            if (!this.Form.value.msds_document) {
              this.upload_msds_document()
            } else {
              this.existing_upload_msds_document()
            }
          },
          error: (err: any) => { },
          complete: () => {
          }
        })
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.create_notification();

      }
    })
  }




  create_notification() {
    const status = this.Form.value.status
    if (status === 'Draft') {
      const statusText = "Chemical request details saved"
      this._snackBar.open(statusText, 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      this.router.navigate(["/apps/chemical-management/modify-request/" + this.Form.value.id])
    }
    else {
      let data: any[] = []
      data.push({
        module: "Chemical Management",
        action: 'New Chemical Request:',
        reference_number: this.Form.value.reference_number,
        userID: this.Form.value.reviewer,
        access_link: "/apps/chemical-management/review/" + this.Form.value.id,
        profile: this.Form.value.reporter
      })
      this.generalService.create_notification(data[0]).subscribe({
        next: (result: any) => { },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {
          Swal.fire({
            title: 'New Chemical Request',
            imageUrl: "assets/images/chemical.gif",
            imageWidth: 250,
            text: "Your chemical request has been successfully created and submitted for review.",
            showCancelButton: false,
          }).then((result) => {
            this.router.navigate(["/apps/chemical-management/request-history"])
          })
        }
      })
    }
    Swal.close()
  }




  resetFormControls() {
    this.files = [];
    this.issuedDate.reset();
    this.expiryDate.reset();
    this.Form.controls['msds_sds_issued_date'].reset();
    this.Form.controls['msds_sds_expiry_date'].reset();
  }

  validate_msds() {

    this.msds_sdsValue = this.msds_sdsValue == true ? false : true
    if (this.msds_sdsValue === true) {

      this.Form.controls['msds_sds'].setValue(true)
      this.Form.controls['msds_doc_status'].setValue('ok')
      this.Form.controls['msds_sds_issued_date'].setValidators([Validators.required])
      this.Form.controls['msds_sds_expiry_date'].setValidators([Validators.required])
      this.Form.controls['msds_doc_status'].setValidators(Validators.required)
      this.Form.controls["msds_sds_issued_date"].updateValueAndValidity();
      this.Form.controls["msds_sds_expiry_date"].updateValueAndValidity();
      this.Form.controls["msds_doc_status"].updateValueAndValidity();
      this.issuedDate.setValidators(Validators.required)
      this.expiryDate.setValidators(Validators.required)

      this.chemicalService.get_chemical_request_with_uid(this.chemicalId).subscribe({
        next: (result: any) => {
          this.chemicalRequestSortedDatas = result.data


          const today = new Date();
          const todayString = today.toISOString().split('T')[0];
          const filteredData = this.chemicalRequestSortedDatas.filter((data) => {
            const expiryDateString = data.attributes.msds_sds_expiry_date;
            const msds = data.attributes.msds_document.data !== null;

            if (!expiryDateString) return false;
            if (!msds) return false;
            const expiryDate = expiryDateString;
            return expiryDate >= todayString;
          });


          if (filteredData.length > 0) {
            this.msdsSortedDatas = [filteredData[0]];



            this.msdsSortedDatasPdf.push(this.msdsSortedDatas[0].attributes.msds_document)
            const document_name = this.msdsSortedDatasPdf[0].data.attributes.document_name
            const document_format = this.msdsSortedDatasPdf[0].data.attributes.document_format
            this.Form.controls['document_id'].setValue(this.msdsSortedDatasPdf[0].data.attributes.document_id)
            this.Form.controls['msds_document'].setValue(this.msdsSortedDatas[0].attributes.msds_document.data.id)
            this.issuedDate.setValue(this.msdsSortedDatas[0].attributes.msds_sds_issued_date)
            this.expiryDate.setValue(this.msdsSortedDatas[0].attributes.msds_sds_expiry_date)
            this.Form.controls['msds_sds_issued_date'].setValue(this.msdsSortedDatas[0].attributes.msds_sds_issued_date)
            this.Form.controls['msds_sds_expiry_date'].setValue(this.msdsSortedDatas[0].attributes.msds_sds_expiry_date)



            this.generalService.getImage(environment.client_backend + '/uploads/' + document_name + '.' + document_format).subscribe((data: any) => {


              this.existingMsds = data





              let docData: any[] = []

              docData.push({
                size: data.size,
                name: document_name,
                type: document_format
              })

              this.files.push(docData[0])
            })






          } else {
            this.msdsSortedDatas = [];
          }
          this.files = []

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"])
        },
        complete: () => {


        }
      })

    } else if (this.msds_sdsValue === false) {
      this.Form.controls['msds_sds'].setValue(false)
      this.Form.controls['msds_doc_status'].reset()
      this.Form.controls['msds_document'].reset()
      this.issuedDate.reset()
      this.expiryDate.reset()
      this.Form.controls['msds_sds_issued_date'].removeValidators(Validators.required)
      this.Form.controls['msds_sds_expiry_date'].removeValidators(Validators.required)
      this.Form.controls['msds_doc_status'].removeValidators(Validators.required)
      this.Form.controls["msds_sds_issued_date"].updateValueAndValidity();
      this.Form.controls["msds_sds_expiry_date"].updateValueAndValidity();
      this.Form.controls["msds_doc_status"].updateValueAndValidity();
      this.msdsSortedDatas = [];
      this.files = []
    }
    const docID = this.Form.value.document_id
    const cheID = this.Form.value.id
    if (this.msds_sdsValue === false && docID) {
      this.files = []
      this.issuedDate.reset()
      this.expiryDate.reset()
      // this.Form.controls['msds_sds_issued_date'].reset()
      // this.Form.controls['msds_sds_expiry_date'].reset()
      this.Form.controls['msds_sds_issued_date'].setValue(null)
      this.Form.controls['msds_sds_expiry_date'].setValue(null)
      this.Form.controls['msds_sds'].setValue(false)
      // this.chemicalService.remove_msds_status(cheID).subscribe({
      //   next: (result: any) => { },
      //   error: (err: any) => { },
      //   complete: () => {
      //     this.delete_msds_document()
      //   }
      // })
    }
  }


  onSelect(event: any) {
    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / 2560 / 2560
      if (size > 2) {
        const statusText = "Please choose a document below 5 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['pdf'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.files.push(...event.addedFiles);
          this.Form.controls['msds_doc_status'].setValue('OK')




        } else {
          const statusText = "Please choose document ('pdf')"
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

  upload_msds_document() {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();


    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '_' + currentYear)




      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {



          let data: any[] = []
          data.push({
            document_name: result[0].hash,
            document_format: extension,
            chemical_request: this.Form.value.id,
            document_id: result[0].id,
            chemical_inventory: this.Form.value.chemical_inventory
          })
          const docID = this.Form.value.msdc_document

          if (docID) {
            this.chemicalService.attach_msds_document(docID, data[0]).subscribe({
              next: (result: any) => {
                const cheID = this.Form.value.id
                this.chemicalService.add_msds_status(cheID).subscribe({
                  next: (result: any) => { },
                  error: (err: any) => { },
                  complete: () => {
                    const statusText = "MSDS/SDS has added successfully"
                    this._snackBar.open(statusText, 'OK', {
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                    });
                    this.files = []

                  }
                })
              },
              error: (err: any) => { },
              complete: () => { }
            })
          } else {
            this.chemicalService.create_msds_document(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                // const statusText = "MSDS/SDS document added successfully"
                // this._snackBar.open(statusText, 'OK', {
                //   horizontalPosition: this.horizontalPosition,
                //   verticalPosition: this.verticalPosition,
                // });
                this.files = []

              }
            })
          }
        },
        error: (err: any) => { },
        complete: () => { }
      })
    })
  }
  existing_upload_msds_document() {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();


    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      const extension = 'pdf'
      const fileName = `${this.Form.value.reference_number}_${currentYear}.${extension}`;
      this.evidenceFormData.append('files', this.existingMsds, fileName)

      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = []
          data.push({
            document_name: result[0].hash,
            document_format: extension,
            chemical_request: this.Form.value.id,
            document_id: result[0].id,
            chemical_inventory: this.Form.value.chemical_inventory
          })
          const docID = this.Form.value.msdc_document

          if (docID) {
            this.chemicalService.attach_msds_document(docID, data[0]).subscribe({
              next: (result: any) => {
                const cheID = this.Form.value.id
                this.chemicalService.add_msds_status(cheID).subscribe({
                  next: (result: any) => { },
                  error: (err: any) => { },
                  complete: () => {
                    const statusText = "MSDS/SDS has added successfully"
                    this._snackBar.open(statusText, 'OK', {
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                    });
                    this.files = []

                  }
                })
              },
              error: (err: any) => { },
              complete: () => { }
            })
          } else {

            this.chemicalService.create_msds_document(data[0]).subscribe({
              next: (result: any) => { },
              error: (err: any) => { },
              complete: () => {
                // const statusText = "MSDS/SDS document added successfully"
                // this._snackBar.open(statusText, 'OK', {
                //   horizontalPosition: this.horizontalPosition,
                //   verticalPosition: this.verticalPosition,
                // });
                this.files = []

              }
            })
          }
        },
        error: (err: any) => { },
        complete: () => { }
      })
    })
  }



  onRemove(event: any) {


    this.files.splice(this.files.indexOf(event), 1);
    this.files = [];
    this.issuedDate.reset();
    this.expiryDate.reset();
    this.Form.controls['msds_sds_issued_date'].reset();
    this.Form.controls['msds_sds_expiry_date'].reset();
    this.Form.controls['document_id'].reset()
    this.Form.controls['msds_document'].reset()


    //this.delete_msds_document()
  }

  delete_msds_document() {
    const docID = this.Form.value.document_id
    this.showProgressPopup();
    this.generalService.destroy(docID).subscribe({
      next: (result: any) => {
        this.Form.controls['document_id'].reset()
        this.issuedDate.reset();
        this.expiryDate.reset();
        this.Form.controls['msds_sds_issued_date'].reset();
        this.Form.controls['msds_sds_expiry_date'].reset();
      },
      error: (err: any) => { },
      complete: () => {
        this.disconnect_msds_document()
      }
    })
  }

  disconnect_msds_document() {

    const docID = this.msdsSortedDatas[0].attributes.msds_document.data.id
    this.chemicalService.disconnect_msds_document(docID).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
        const statusText = "MSDS/SDS has removed successfully"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });

      }
    })
  }
  view_msds_document() {
    let docData: any[] = []
    const document_name = this.msdsSortedDatasPdf[0].data.attributes.document_name
    const document_format = this.msdsSortedDatasPdf[0].data.attributes.document_format
    docData.push({
      document_name: document_name,
      document_format: document_format
    })
    this.dialog.open(ChemicalMsdsDocumentComponent, { data: docData[0] })
  }

  // download_msds_document() {
  //   // const documentName = this.Form.value.document_name;
  //   // const documentFormat = this.Form.value.document_format;

  //   const documentName = this.msdsSortedDatasPdf[0].data.attributes.document_name
  //   const documentFormat = this.msdsSortedDatasPdf[0].data.attributes.document_format
  //   const fileUrl = `${environment.client_backend}/uploads/${documentName}.${documentFormat}`;
  //   saveAs(fileUrl, `${documentName}.${documentFormat}`);
  // }
  download_msds_document() {

    const documentName = this.msdsSortedDatasPdf[0].data.attributes.document_name
    const documentFormat = this.msdsSortedDatasPdf[0].data.attributes.document_format
    const chemicalName = this.Form.value.commercial_name;
    const issuedDate = this.issuedDate.value;
    const issueYear = issuedDate ? new Date(issuedDate).getFullYear() : 'Year';
    const customName = `${chemicalName}_MSDS_${issueYear}.${documentFormat}`;
    const fileUrl = `${environment.client_backend}/uploads/${documentName}.${documentFormat}`;
    saveAs(fileUrl, customName);

  }

  add_standard() {

    this.dialog.open(CreateProductStandardComponent).afterClosed().subscribe((data: any) => {
      const name = data.name
      const found = this.standardList.find(obj => obj.attributes.name === name);
      if (found) {
        const statusText = " Standard already exist"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        this.chemicalService.create_product_standard(name, this.userId).subscribe({
          next: (result: any) => {
            this.chemicalService.get_product_standard().subscribe({
              next: (result: any) => {
                this.standardList = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Standard name added successfully"
                this._snackBar.open(statusText, 'Ok', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['product_standard'].setValue(result.data.attributes.name)
              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })
      }
    })
  }

  issuedDateVal(date: any) {
    const selectedDate = new Date(date.value);
    const expiryDate = new Date(selectedDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 3);
    this.Form.controls['msds_sds_expiry_date'].setValue(expiryDate);
    this.expiryDate.setValue(expiryDate);
    // Calculate the warning date (e.g., 3 months before expiry date)
    const warningDate = new Date(expiryDate);
    warningDate.setMonth(warningDate.getMonth() - 3);
    this.Form.controls['msds_warning_date'].setValue(warningDate);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.Form.controls['msds_sds_issued_date'].setValue(selectedDate);

    // Calculate the expiry date 3 years from the selected issue date
  }

  expiryDateVal(date: any) {
    const selecteddate = new Date(date.value)
    selecteddate.setDate(selecteddate.getDate() + 1)
    this.Form.controls['msds_sds_expiry_date'].setValue(selecteddate)
    var d = new Date(date.value);
    d.setMonth(d.getMonth() - 3);
    this.Form.controls['msds_warning_date'].setValue(d)
  }

  onSelectStatement(event: any) {
    const fileLength = this.statements.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / 2560 / 2560
      if (size > 2) {
        const statusText = "Please choose statement below 5 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['pdf'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.statements.push(...event.addedFiles);

        } else {
          const statusText = "Please choose statement ('pdf')"
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


  ProductStandard(event: any) {
    this.Form.controls['product_standard'].setValue(event)
  }

  onCommercialNameSelected(selectedName: string) {
    const selectedOption = this.commercialName.find(name => name.attributes.name === selectedName);

    this.chemicalId = selectedOption.attributes.uuid
    if (selectedOption) {
      this.ApprovalValid_Date = selectedOption.attributes.approval_valid_date
      this.Form.controls['approval_valid_date'].enable()
      this.Form.controls['approval_valid_date'].setValue(this.ApprovalValid_Date)
      //const zdchCategoryValue = selectedOption.attributes.ZDHC_Category;
      this.Form.patchValue({
        substance_name: selectedOption.attributes.substance_name,
        formula: selectedOption.attributes.formula,
        reach_regi_number: selectedOption.attributes.reach_registration_number,
        where_why: selectedOption.attributes.where_why,
        cas_no: selectedOption.attributes.cas_no,
        colour_index: selectedOption.attributes.colour_index
      });
      this.get_chemForm_dropdown()
      this.Form.controls['chemical_form'].setValue(selectedOption.attributes.chemical_form_type)
      this.get_dropdown_values()
      this.materiality_Issue()
      this.get_ppe_list()
      this.zdhclevels()
      this.Form.controls['category'].setValue(selectedOption.attributes.category)
      const zdchc = this.zdhcCategory.filter(function (elem: any) {
        return (elem.attributes.filter === selectedOption.attributes.category && selectedOption.attributes.category !== null)
      })
      //this.filteredZdhcCategory = zdchc
      this.filteredZdhcCategory = zdchc.sort((a: any, b: any) => {

        return a.attributes.Value
          .localeCompare(b.attributes.Value)
      })
      this.Form.controls['zdhc_use_category'].setValue(selectedOption.attributes.ZDHC_Category)
      this.Form.controls['zdhc_level'].setValue(selectedOption.attributes.zdhc_level)
      this.Form.controls['hazardType'].setValue(selectedOption.attributes.hazard_type)
      if (selectedOption.attributes.hazard_type) {
        const hazardTypes = selectedOption.attributes.hazard_type.split(',');
        this.hazardType.setValue(hazardTypes);
      }
      if (selectedOption.attributes.use_of_ppe) {
        this.use_of_ppe.setValue(selectedOption.attributes.use_of_ppe.split(','))
      }
      if (selectedOption.attributes.ghs_classification) {
        this.ghsClassification.setValue(selectedOption.attributes.ghs_classification.split(','))
      }
      this.materiality_Issue()
      this.Form.controls['use_of_ppe'].setValue(selectedOption.attributes.use_of_ppe)
      this.Form.controls['ghsClassification'].setValue(selectedOption.attributes.ghs_classification)

    }

    this.Form.controls['msds_sds'].enable()
    this.Form.controls['msds_sds'].setValue(false)
    this.msds_sdsValue = false
    this.issuedDate.reset();
    this.expiryDate.reset();
    this.Form.controls['msds_sds_issued_date'].reset();
    this.Form.controls['msds_sds_expiry_date'].reset();
    this.Form.controls['document_id'].reset()
    this.files = [];

  }

  delete_commercial_name(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the commercial name.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.chemicalService.delete_commercial_name(id).subscribe({
          next: (result: any) => {
            this.Form.controls.commercial_name.reset()
          },
          error: (err: any) => { },
          complete: () => {
            const statusText = "Commercial name deleted"
            this._snackBar.open(statusText, 'OK', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.get_chemical_name()
          }
        })
      }
    })
  }
  isCommercialNameValid(): boolean {
    const commercialNameControl = this.Form.get('commercial_name');
    return commercialNameControl ? !!commercialNameControl.value : false;
  }

  onCategorySelection(event: any) {
    const ZdhcCategory = this.zdhcCategory.filter(function (elem: any) {
      return (elem.attributes.filter === event.value)
    })
    // this.filteredZdhcCategory = ZdhcCategory
    this.filteredZdhcCategory = ZdhcCategory.sort((a: any, b: any) => {

      return a.attributes.Value
        .localeCompare(b.attributes.Value)
    })
  }


}
