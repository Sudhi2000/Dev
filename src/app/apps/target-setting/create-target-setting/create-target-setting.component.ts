import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TargetSettingService } from 'src/app/services/target-setting.service';
import Swal from 'sweetalert2'
import { NewPossibleCategoryComponent } from './new-possible-category/new-possible-category.component';
import { MatDialog } from '@angular/material/dialog';
import { NewOpportunityComponent } from './new-opportunity/new-opportunity.component';
import { AddSourceComponent } from './add-source/add-source.component';
import { NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { ViewSourceComponent } from './view-source/view-source.component';

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
  selector: 'app-create-target-setting',
  templateUrl: './create-target-setting.component.html',
  styleUrls: ['./create-target-setting.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class CreateTargetSettingComponent implements OnInit {

  Form: FormGroup
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 3
  divisions: any[] = []
  orgID: string
  categories: any[] = []
  standards: any[] = []
  dropdownValues: any[] = []
  sources: any[] = []
  emission_data: any[] = []
  possibilityCategory: any[] = []
  possibilitySubCat: any[] = []
  sourceList: any[] = []
  files: File[] = [];
  Division = new FormControl(null, [Validators.required]);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  peopleList: any[] = []
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  currency: string
  evidenceFormData = new FormData()
  userDivision: any
  corporateUser: any
  unitSpecific: any
  SQ_Specific: any
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

  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private generalService: GeneralService,
    private router: Router, private authService: AuthService,
    private _snackBar: MatSnackBar,
    private targetService: TargetSettingService) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      reference_number: [''],
      reported_date: [new Date(), [Validators.required]],
      org_id: ['', [Validators.required]],
      division: ['', [Validators.required]],
      reporter: ['', [Validators.required]],
      department: ['', [Validators.required]],
      category: ['', [Validators.required]],
      // source: [''],
      findings: ['', [Validators.required]],
      // baseline_consumption: [''],
      action: ['', [Validators.required]],
      possibility_category: ['', [Validators.required]],
      possibility_subcategory: ['', [Validators.required]],
      evidence: [null, [Validators.required]],
      responsible: [null, [Validators.required]],
      expected_saving: ['', [Validators.required]],
      cost_saving: ['', [Validators.required]],
      // expected_GHG_emission: [null],
      target_reduction: ['', [Validators.required]],
      implementation_cost: ['', [Validators.required]],
      payback_period: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      project_lifespan: ['', [Validators.required]],
      approver: ['', [Validators.required]],
      baseline_Unit: [''],
      target_energy_consumption: [null],
      categoryId: [''],
      business_unit: [''],
      standard: [null],
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.target_setting
        this.currency = result.data.attributes.currency
        this.unitSpecific = result.data.attributes.business_unit_specific
        this.SQ_Specific = result.data.attributes.sq_specific
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
        this.Form.controls['reporter'].setValue(result.id)
        const status = result.trs_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
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
          } else {
            this.get_profiles()
            this.get_divisions()
          }
          this.get_dropdown_values()
          this.get_emission_factor()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  // get_divisions() {
  //   this.generalService.get_division(this.orgID).subscribe({
  //     next: (result: any) => {
  //       this.divisions = result.data
  //     },
  //     error: (err: any) => {
  //       this.router.navigate(["/error/internal"])
  //     },
  //     complete: () => { }
  //   })
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
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }

  BusinessUnit(event: any) {
    this.Form.controls['division'].setValue(event.value.division_name)
    this.Form.controls['business_unit'].setValue(event.value.id)
  }


  //get dropdown values
  get_dropdown_values() {
    const module = "Target Setting"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropdownValues = result.data
        const category = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Category")
        })
        this.categories = category

        const standard = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Standard")
        })
        this.standards = standard
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  get_emission_factor() {
    this.targetService.get_emission_factor().subscribe({
      next: (result: any) => {
        this.emission_data = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }
  category(data: any) {
    const category = data.value
    const source = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "Source" && elem.attributes.filter === category)
    })
    this.sources = source

    if (this.Form.value.possible_category) {
      this.Form.controls['possible_category'].reset()
    }
    if (this.Form.value.possibility_subcategory) {
      this.Form.controls['possibility_subcategory'].reset()
    }
    this.get_possible_category(category)
  }

  source(data: any) {
    const source = this.sources.filter(function (elem: any) {
      return (elem.attributes.Category === "Source" && elem.attributes.Value === data.value)
    })
    this.Form.controls['baseline_Unit'].setValue(source[0].attributes.unit)
  }

  calcGhgEmission() {
    const souceValue = this.Form.value.source;
    const standardValue = this.Form.value.standard;
    const baselinConsumption = this.Form.value.baseline_consumption;

    const emissionFactor = this.emission_data.filter((elem: any) => {
      return elem.attributes?.source === souceValue && elem.attributes?.standard === standardValue;
    });

    const emissionFactorValue = emissionFactor[0]?.attributes?.emission_factor;

    if (emissionFactorValue) {
      const GHGValue = baselinConsumption * emissionFactorValue;
      const roundedGHG = parseFloat(GHGValue.toFixed(2));  // Round to 2 decimal places
      this.Form.controls['expected_GHG_emission'].setValue(roundedGHG);
    } else {
      this.Form.controls['expected_GHG_emission'].reset();
    }
  }

  CalculateGHG(data: any) {
    const souceValue = this.Form.value.source;
    const standardValue = this.Form.value.standard;
    const baselinConsumption = this.Form.value.baseline_consumption;

    const emissionFactor = this.emission_data.filter((elem: any) => {
      return elem.attributes?.source === souceValue && elem.attributes?.standard === standardValue;
    });

    const emissionFactorValue = emissionFactor[0]?.attributes?.emission_factor;

    if (emissionFactorValue) {
      const GHGValue = baselinConsumption * emissionFactorValue;
      const roundedGHG = parseFloat(GHGValue.toFixed(2));  // Round to 2 decimal places
      this.Form.controls['expected_GHG_emission'].setValue(roundedGHG);
    } else {
      this.Form.controls['expected_GHG_emission'].reset();
    }
  }

  possibility_category(data: any) {
    const selectedValue = data.value;

    // Access the corresponding category
    const selectedCategory = this.possibilityCategory.find(category => category.attributes.possible_category === selectedValue);
    if (selectedCategory) {
      this.Form.controls['categoryId'].setValue(selectedCategory.id)
      this.targetService.get_opportunity().subscribe({
        next: (result: any) => {
          let opportunity: any[]
          opportunity = result.data.sort((a: any, b: any) => a.attributes.opportunity.localeCompare(b.attributes.opportunity));
          const subCategory = opportunity.filter(function (elem: any) {
            return (elem.attributes.possible_category.data.id === selectedCategory.id)
          })
          this.possibilitySubCat = subCategory
        },
        error: (err: any) => { },
        complete: () => { }
      });
    }
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

  get_opportunity() {
    this.targetService.get_opportunity().subscribe({
      next: (result: any) => {
        let opportunity: any[]
        opportunity = result.data.sort((a: any, b: any) => a.attributes.opportunity.localeCompare(b.attributes.opportunity));
        this.possibilitySubCat = opportunity
        const cat = this.Form.value.possibility_category
        const subCategory = opportunity.filter(function (elem: any) {
          return (elem.attributes.possible_category.data.attributes.possible_category === cat)
        })
        this.possibilitySubCat = subCategory
      },
      error: (err: any) => { },
      complete: () => { }
    });
  }

  get_possible_category(category: string) {
    this.targetService.get_possible_category().subscribe({
      next: (result: any) => {
        const filteredResult = result.data.filter((item: any) => {
          return item.attributes.category === category;
        });
        this.possibilityCategory = filteredResult.sort((a: any, b: any) => a.attributes.possible_category.localeCompare(b.attributes.possible_category));
      },
      error: (err: any) => { },
      complete: () => { }
    });
  }

  new_possible_category() {
    const dialogData = {
      category: this.Form.value.category,
      reporter: this.Form.value.reporter
    };
    if (this.Form.value.category) {
      this.dialog.open(NewPossibleCategoryComponent, { width: '700px', data: dialogData }).afterClosed().subscribe(data => {
        if (data) {
          this.targetService.get_possible_category().subscribe({
            next: (result: any) => {
              this.possibilityCategory = result.data.sort((a: any, b: any) => a.attributes.possible_category.localeCompare(b.attributes.possible_category));
            },
            error: (err: any) => { },
            complete: () => {
              this.get_opportunity();
              this.Form.controls['possibility_category'].setValue(data.data.attributes.possible_category);
              this.Form.controls['categoryId'].setValue(data.data.id);
            }
          });
        }
      });
    }
    else {
      const statusText = "Please choose a Category"
      this._snackBar.open(statusText, 'Ok', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }


  new_opportunity() {
    this.dialog.open(NewOpportunityComponent, { width: '700px', data: { reporter: this.Form.value.reporter, possible_category: this.Form.value.categoryId } }).afterClosed().subscribe(data => {
      if (data) {
        this.targetService.get_opportunity().subscribe({
          next: (result: any) => {
            const oppor = result.data.sort((a: any, b: any) => a.attributes.opportunity.localeCompare(b.attributes.opportunity));
            const category = this.Form.value.categoryId
            const subCategory = oppor.filter(function (elem: any) {
              return (elem.attributes.possible_category.data.id === category)
            })
            this.possibilitySubCat = subCategory
          },
          error: (err: any) => { },
          complete: () => {
            this.Form.controls['possibility_subcategory'].setValue(data.data.attributes.opportunity);
          }
        });
      }
    });
  }

  submit() {
    this.Form.controls['expected_saving'].enable()
    this.Form.controls['payback_period'].enable()
    this.Form.controls['target_reduction'].enable()
    this.Form.controls['target_energy_consumption'].enable()
    this.showProgressPopup();
    this.targetService.get_target().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = "Target-" + newCount
        this.Form.controls['reference_number'].setValue(reference)
        this.create_target_setting()
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  //upload evidence
  upload_evidence() {
    this.files.forEach((elem: any) => {
      this.evidenceFormData.delete('files')
      const extension = elem.name.split('.').pop().toLowerCase()
      this.evidenceFormData.append('files', elem, this.Form.value.reference_number + '.' + extension)
      this.generalService.upload(this.evidenceFormData).subscribe({
        next: (result: any) => {
          let data: any[] = []
          data.push({
            evidence_name: result[0].hash,
            format: extension,
            target: this.Form.value.id,
            id: result[0].id
          })
          this.targetService.create_evidence(data[0]).subscribe({
            next: (result: any) => { },
            error: (err: any) => { },
            complete: () => { }
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
      module: "Target Setting",
      action: 'Reported a new Target Setting:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.approver,
      access_link: "/apps/target-setting/action/",
      profile: this.Form.value.reporter
    })
    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Target Created',
          imageUrl: "assets/images/confirm.gif",
          imageWidth: 250,
          text: "You have successfully created a goal. We will notify the approver to take further action.",
          showCancelButton: false,
        }).then((result) => {
          this.router.navigate(["/apps/target-setting/history"])
        })
      }
    })
  }

  create_target_setting() {
    this.targetService.create_target_setting(this.Form.value).subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.data.id)
        this.sourceList.forEach((elem: any) => {

          this.targetService.create_target_source(elem, this.Form.value.id).subscribe({
            next: (result: any) => {
            },
            error: (err: any) => {
              this.router.navigate(["/error/internal"])
            },
            complete: () => {
            }
          })
        })

      },
      error: (err: any) => { },
      complete: () => {
        this.upload_evidence()
      }
    })
  }

  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  onSelect(event: any) {
    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 6) {
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
          this.Form.controls['evidence'].setErrors(null)
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
      this.Form.controls['evidence'].reset()
    }
  }

  //get profiles
  get_profiles() {
    this.authService.get_hse_head_profiles(this.orgID).subscribe({
      next: (result: any) => {
        this.peopleList = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  get_unit_specific_profiles() {
    this.authService.get_unit_specific_hse_head_profiles(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {
        this.peopleList = result.data
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
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

  calcPayBackPeriod() {
    const costOfImplementation = this.Form.value.implementation_cost
    const costSaving = this.Form.value.cost_saving
    if (costOfImplementation && costSaving) {
      const payBackPeriod = (Number(costOfImplementation) / Number(costSaving)).toFixed(2)
      this.Form.controls['payback_period'].setValue(payBackPeriod)
      this.Form.controls['payback_period'].disable()
    }
  }

  calcTargetReduction() {
    const baselineConsu = this.Form.value.baseline_consumption
    const expectedSaving = this.Form.value.expected_saving
    if (baselineConsu && expectedSaving) {
      const targetReduction = (Number(expectedSaving) / Number(baselineConsu)).toFixed(2)
      const tergetedEnergyNextYear = (Number(baselineConsu) - Number(expectedSaving))
      this.Form.controls['target_reduction'].setValue(targetReduction)
      this.Form.controls['target_reduction'].disable()
      this.Form.controls['target_energy_consumption'].setValue(tergetedEnergyNextYear)
      this.Form.controls['target_energy_consumption'].disable()
    }
  }

  addSource() {

    const category = this.Form.value.category
    this.dialog.open(AddSourceComponent, { data: { category: category, specific: this.SQ_Specific } }).afterClosed().subscribe((data) => {
      if (data) {
        this.sourceList.push(data)
        const totalExpectedSaving = this.sourceList.reduce((sum, elem: any) => {
          this.Form.controls['baseline_Unit'].setValue(elem.baseline_Unit)
          return sum + (elem.expected_savings || 0);
        }, 0);

        this.Form.controls['expected_saving'].setValue(totalExpectedSaving)

        const totalBaselineConsumption = this.sourceList.reduce((sum, elem: any) => {
          return sum + (elem.baseline_consumption || 0);
        }, 0);

        // this.Form.controls['baseline_consumption'].setValue(totalBaselineConsumption);

        const totalTargetReduction = (((totalExpectedSaving / totalBaselineConsumption) * 100).toFixed(2))

        this.Form.controls['target_reduction'].setValue(totalTargetReduction)
      }
    });
  }

  deleteSource(data: any, i: number) {
    this.sourceList.splice(i, 1);

    const totalExpectedSaving = this.sourceList.reduce((sum: number, item: any) => {
      return sum + (item.expected_savings || 0); // If expected_saving is undefined, treat it as 0
    }, 0);
    this.Form.controls['expected_saving'].setValue(totalExpectedSaving)

    const totalBaselineConsumption = this.sourceList.reduce((sum, elem: any) => {
      return sum + (elem.baseline_consumption || 0);
    }, 0);

    // this.Form.controls['baseline_consumption'].setValue(totalBaselineConsumption);

    const totalTargetReduction = (((totalExpectedSaving / totalBaselineConsumption) * 100).toFixed(2))
    this.Form.controls['target_reduction'].setValue(totalTargetReduction)
  }

  editSource(data: any, i: number) {


    const category = this.Form.value.category
    const soucedetails = data
    soucedetails.category = category
    this.dialog
      .open(AddSourceComponent, { data: soucedetails })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.sourceList[i] = data
          const totalExpectedSaving = this.sourceList.reduce((sum: number, item: any) => {
            return sum + (item.expected_savings || 0); // If expected_saving is undefined, treat it as 0
          }, 0);
          this.Form.controls['expected_saving'].setValue(totalExpectedSaving)

          const totalBaselineConsumption = this.sourceList.reduce((sum, elem: any) => {
            return sum + (elem.baseline_consumption || 0);
          }, 0);
          // this.Form.controls['baseline_consumption'].setValue(totalBaselineConsumption);
          const totalTargetReduction = (((totalExpectedSaving / totalBaselineConsumption) * 100).toFixed(2))
          this.Form.controls['target_reduction'].setValue(totalTargetReduction)
        }
      });

  }
  viewSource(data: any) {

    this.dialog.open(ViewSourceComponent, {
      data: { attributes: data }
    }).afterClosed().subscribe((customer) => {
    });
  }
}
