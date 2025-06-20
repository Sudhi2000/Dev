import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { consumption } from 'src/app/services/schemas';
import { ConsumptionModifyComponent } from './consumption/consumption.component';
import { GeneralService } from '../../../services/general.api.service'
import { AuthService } from 'src/app/services/auth.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { ViewModifyConsumptionComponent } from './view-consumption/view-consumption.component';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { UpdateConsumptionComponent } from './update-consumption/update-consumption.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-modify-consumption',
  templateUrl: './modify-consumption.component.html',
  styleUrls: ['./modify-consumption.component.scss']
})
export class ModifyConsumptionComponent implements OnInit {

  Form: FormGroup
  consumptions: any[] = []
  years: any[] = []
  peopleList: any[] = []
  DivisionFilteredpeopleList: any[] = [];
  pollutantsEmitted: any[] = [];
  divisions: any[] = []
  Division = new FormControl(null, [Validators.required]);
  orgID: any
  evidenceFormData = new FormData()
  conCategory: any[] = []
  delConCategory: any[] = []
  consumption_category: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  userDivision: any
  corporateUser: any
  unitSpecific: any

  backToHistory: Boolean = false
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
  divisionUuids: any[] = []
  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private generalService: GeneralService,
    private authService: AuthService,
    private router: Router,
    private environmentService: EnvironmentService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar, private _location: Location) { }

  ngOnInit() {
    this.configuration()    
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      division: ['', [Validators.required]],
      work_force: ['', [Validators.required]],
      days_worked: ['', [Validators.required]],
      product_produced_kg: [null],
      product_produced_pieces: ['', [Validators.required]],
      area: [null],
      year: [null, [Validators.required]],
      month: ['', [Validators.required]],
      reviewer: [null, [Validators.required]],
      modified_date: [new Date()],
      created_user: [''],
      updated_user: [''],
      reference_number: [''],
      status: ['Draft'],
      reviewer_notification: [null],
      pending_consumption: [''],
      pending_percentage: [null],
      pending_color_code: [''],
      business_unit: [null],
      reject_reason: [''],
      approver_reject_reson: ['']
    });
  }

  //check organisation has access
  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        this.years = result.data.attributes.Year
        const status = result.data.attributes.modules.environment
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
        this.Form.controls['updated_user'].setValue(result.id)
        const status = result.env_modify
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_profiles()
              this.get_divisions()
            }
            else if (!this.corporateUser) {
              let divisions: any[] = []
              result.profile.divisions.forEach((elem: any) => {
                divisions.push('filters[divisions][division_uuid][$in]=' + elem.division_uuid)
                this.divisions.push(elem)
                this.divisionUuids.push(elem.division_uuid)
              })
              let results = divisions.join('&');
              this.userDivision = results
              this.get_unit_specific_profiles()
            }
          } else {
            this.get_profiles()
            this.get_divisions()
          }
          this.get_env_details()
          this.get_dropdown_values()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_dropdown_values() {
    const module = "Environment"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        const data = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Consumption Category")
        })
        this.consumption_category = data
      },
      error: (err: any) => { },
      complete: () => {
      }
    })
  }

  // get_division() {
  //   this.generalService.get_division(this.orgID).subscribe({
  //     next: (result: any) => {
  //       this.divisions = result.data
  //     },
  //     error: (errL: any) => { },
  //     complete: () => { }
  //   })
  // }
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
  BusinessUnit(event: any) {

    const selectedData = this.divisions.find(data => data.division_name === event.value);
    this.Form.controls['division'].setValue(selectedData.division_name)
    this.Form.controls['business_unit'].setValue(selectedData.id)

    this.DivisionFilteredpeopleList = this.peopleList.filter((data) =>
      data.attributes.divisions.data
        .map((division: any) => division.attributes.division_uuid)
        .includes(selectedData.division_uuid)
    );
  }
  //get profiles
  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked === false && profile.attributes.user?.data?.attributes?.env_reviewer_action === true);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
  get_unit_specific_profiles() {
    this.authService.get_unit_specific_profiles(this.orgID, this.userDivision).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked === false && profile.attributes.user?.data?.attributes?.env_reviewer_action === true);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
      },
      complete: () => {
      }
    });
  }
  get_env_details() {
    const reference = this.route.snapshot.paramMap.get('id');
    this.environmentService.get_env_details(reference).subscribe({
      next: (result: any) => {

        const divisionUuidFromResponse = result.data[0].attributes.business_unit.data?.attributes.division_uuid;
        let matchFound = true;
        if (this.divisionUuids && this.divisionUuids.length > 0) {
          matchFound = this.divisionUuids.some(uuid => uuid === divisionUuidFromResponse);
        }

        if ((result.data[0].attributes.status !== "Draft" && result.data[0].attributes.status !== "Rejected") || (!matchFound || matchFound !== true)) {
          this.router.navigate(["/apps/environment/assigned"]);
        }

        if (result.data[0].attributes.created_user.data.id !== this.Form.value.updated_user) {
          this.router.navigate(["/error/unauthorized"]);
        } else if (result.data[0].attributes.created_user.data.id === this.Form.value.updated_user) {
          this.Form.controls['id'].setValue(result.data[0].id);
          this.Form.controls['reference_number'].setValue(result.data[0].attributes.reference_number);
          this.Form.controls['division'].setValue(result.data[0].attributes.division);
          this.Division.setValue(result.data[0].attributes.division);
          this.Form.controls['work_force'].setValue(result.data[0].attributes.work_force);
          this.Form.controls['days_worked'].setValue(result.data[0].attributes.days_worked);
          this.Form.controls['product_produced_kg'].setValue(result.data[0].attributes.product_produced_kg);
          this.Form.controls['product_produced_pieces'].setValue(result.data[0].attributes.product_produced_pieces);
          this.Form.controls['area'].setValue(result.data[0].attributes.area);
          this.Form.controls['year'].setValue(result.data[0].attributes.year);
          this.Form.controls['month'].setValue(result.data[0].attributes.month);
          this.Form.controls['reviewer'].setValue(result.data[0].attributes.reviewer.data.id);
          this.consumptions = result.data[0].attributes.consumptions.data;
          
          // this.Form.controls['pending_consumption'].setValue(result.data[0].attributes.pending_consumption);
          // this.Form.controls['pending_percentage'].setValue(result.data[0].attributes.pending_percentage);
          this.Form.controls['created_user'].setValue(result.data[0].attributes.created_user.data.id);
          this.Form.controls['business_unit'].setValue(result.data[0].attributes.business_unit.data?.id);

          const pendingCategories = this.consumption_category.filter(consumption_category => {
            const match = this.consumptions.some(consumption => {
              return consumption.attributes.consumption_category === consumption_category.attributes.Value;
            });
            return !match;
          });

          const pendingCategoryValues = pendingCategories.map(category => category.attributes.Value);
          this.delConCategory = pendingCategoryValues
          this.conCategory = pendingCategoryValues
          if (pendingCategories) {
            const conCategory = pendingCategoryValues.join(',');
            this.Form.controls['pending_consumption'].setValue(conCategory);
          } else {
            this.Form.controls['pending_consumption'].setValue("");

          }
          const total = Number(this.consumption_category.length);
          const count = Number(pendingCategories.length);
          const percentage = Number((count / total) * 100).toFixed(0);
          const completed = 100 - Number(percentage);
          this.Form.controls['pending_percentage'].setValue(completed);
          if (result.data[0].attributes.status === "Rejected") {
            this.Form.controls['status'].setValue(result.data[0].attributes.status);
          }
          this.Form.controls['reject_reason'].setValue(result.data[0].attributes.reject_reason);
          this.Form.controls['approver_reject_reson'].setValue(result.data[0].attributes.approver_reject_reason);

          this.Form.controls['year'].disable();
          this.Form.controls['month'].disable();
          this.initialFilteredReviewer(result.data[0].attributes.business_unit.data.attributes.division_uuid)
          // const catdata = "" + this.conCategory + "";
          // var str_array = catdata.split(',');
          // let cData: any[] = [];
          // str_array.forEach(elem => {
          //   cData.push(elem);
          // });
          // this.delConCategory = cData;

        }
      },
      error: (err: any) => { },
      complete: () => { }
    });
  }


  addConsumption() {
    this.Form.controls['year'].enable();
    this.Form.controls['month'].enable();
    this.environmentService.selectedYear = this.Form.value.year;
    this.environmentService.selectedMonth = this.Form.value.month;
    this.environmentService.selectedDivision = this.Form.value.division;

    this.dialog.open(ConsumptionModifyComponent, {
      data: { consumptions: this.consumptions, pollutantsEmitted: this.pollutantsEmitted, 
        environmentService: this.environmentService, division: this.Form.controls['business_unit'].value }
    }).afterClosed().subscribe((data) => {
      this.Form.controls['year'].disable();
      this.Form.controls['month'].disable();
      if (data) {

        this.consumptions.push(...data.consumptions);
        const year = this.Form.controls['year'].value;
        const month = this.Form.controls['month'].value;

        if (data.consumptions.length > 0) {
          data.consumptions.forEach((consumption: any) => {
            if (consumption.files.length > 0) {
              this.environmentService.create_consumption_env(consumption, this.Form.value.id, year, month, this.Form.value.division).subscribe({
                next: (result: any) => {
                  const conID = result.data.id;
                  const division = result.data.attributes.division;
                  consumption.files.forEach((image: any) => {
                    this.evidenceFormData = new FormData();
                    const extension = image.name.split('.').pop().toLowerCase();
                    this.evidenceFormData.append('files', image, this.Form.value.reference_number + '.' + extension);

                    this.generalService.upload(this.evidenceFormData).subscribe({
                      next: (result: any) => {
                        let data: any[] = [];
                        data.push({
                          evidence_name: result[0].hash,
                          format: extension,
                          consumption: conID,
                          id: result[0].id
                        });
                        this.environmentService.create_env_evidence(data[0]).subscribe({
                          next: (result: any) => { },
                          error: (err: any) => { },
                          complete: () => {
                            this.get_env_details();
                          }
                        });
                      },
                      error: (err: any) => { },
                      complete: () => { }
                    });
                  });
                  const consdata = "" + this.conCategory + "";


                  if (consdata) {
                    var catVal = consdata;
                    var str_array = catVal.split(',');
                    let cData: any[] = [];
                    str_array.forEach(elem => {
                      cData.push(elem);
                    });

                    const constData = str_array.filter((elem: any) => {
                      const isCategoryPresentInOtherConsumptions = this.consumptions.some((otherConsumption: any) => {
                        return otherConsumption.consumption_category === elem && otherConsumption !== consumption;
                      });
                      return elem !== result.data.attributes.consumption_category && !isCategoryPresentInOtherConsumptions;
                    });

                    const total = Number(this.consumption_category.length);
                    const count = Number(constData.length);
                    const percentage = Number((count / total) * 100).toFixed(0);
                    const completed = 100 - Number(percentage);

                    if (completed <= 20) {
                      this.Form.controls['pending_color_code'].setValue("danger");
                    } else if (completed <= 40) {
                      this.Form.controls['pending_color_code'].setValue("warning");
                    } else if (completed <= 60) {
                      this.Form.controls['pending_color_code'].setValue("info");
                    } else if (completed <= 80) {
                      this.Form.controls['pending_color_code'].setValue("primary");
                    } else if (completed <= 100) {
                      this.Form.controls['pending_color_code'].setValue("success");
                    }

                    this.Form.controls['pending_consumption'].setValue(constData.toString());
                    this.Form.controls['pending_percentage'].setValue(completed);
                  }

                  this.environmentService.update_pen_con_per(this.Form.value).subscribe({
                    next: (result: any) => { },
                    error: (err: any) => { },
                    complete: () => {
                      this.get_env_details();
                    }
                  });

                  if (consumption?.meters?.length > 0) {
                    consumption.meters.forEach((data: any) => {
                      this.environmentService.create_env_submeter_details(data, conID, year, month, division).subscribe({
                        next: (result: any) => {



                        },
                        error: (err: any) => { },
                        complete: () => { }
                      })

                    })
                  }

                  if (consumption.refrigerants?.length > 0) {
                    consumption.refrigerants.forEach((elem: any) => {
                      this.environmentService.create_refrigerant(elem, conID).subscribe({
                        next: (result: any) => {
                        },
                        error: (err: any) => { },
                        complete: () => {
                          const statusText = "Refrigerant details saved"
                          this._snackBar.open(statusText, 'OK', {
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                          });
                        }
                      })
                    })
                  }

                  if (consumption.con_issues?.length > 0) {
                    consumption.con_issues.forEach((elem: any) => {
                      this.environmentService.create_envIssues(elem, conID).subscribe({
                        next: (result: any) => {
                        },
                        error: (err: any) => { },
                        complete: () => {
                          const statusText = "Issue details saved"
                          this._snackBar.open(statusText, 'OK', {
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                          });
                        }
                      })
                    })
                  }
                },
                error: (err: any) => { },
                complete: () => { }
              });
            } else {
              this.environmentService.create_consumption_env(consumption, this.Form.value.id, year, month, this.Form.value.division).subscribe({
                next: (result: any) => {
                  const conID = result.data.id;
                  const division = result.data.attributes.division;
                  if (consumption?.meters?.length > 0) {
                    consumption.meters.forEach((data: any) => {
                      this.environmentService.create_env_submeter_details(data, conID, year, month, division).subscribe({
                        next: (result: any) => {



                        },
                        error: (err: any) => { },
                        complete: () => { }
                      })

                    })
                  }
                  if (consumption.refrigerants?.length > 0) {
                    consumption.refrigerants.forEach((elem: any) => {
                      this.environmentService.create_refrigerant(elem, conID).subscribe({
                        next: (result: any) => {
                        },
                        error: (err: any) => { },
                        complete: () => {
                          const statusText = "Refrigerant details saved"
                          this._snackBar.open(statusText, 'OK', {
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                          });
                        }
                      })
                    })
                  }

                  if (consumption.con_issues?.length > 0) {
                    consumption.con_issues.forEach((elem: any) => {
                      this.environmentService.create_envIssues(elem, conID).subscribe({
                        next: (result: any) => {
                        },
                        error: (err: any) => { },
                        complete: () => {
                          const statusText = "Issue details saved"
                          this._snackBar.open(statusText, 'OK', {
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                          });
                        }
                      })
                    })
                  }
                  const consdata = "" + this.conCategory + "";
                  if (consdata) {
                    var catVal = consdata;
                    var str_array = catVal.split(',');
                    let cData: any[] = [];
                    str_array.forEach(elem => {
                      cData.push(elem);
                    });

                    const constData = str_array.filter((elem: any) => {
                      const isCategoryPresentInOtherConsumptions = this.consumptions.some((otherConsumption: any) => {
                        return otherConsumption.consumption_category === elem && otherConsumption !== consumption;
                      });
                      return elem !== result.data.attributes.consumption_category && !isCategoryPresentInOtherConsumptions;
                    });
                    const total = Number(this.consumption_category.length);
                    const count = Number(constData.length);
                    const percentage = Number((count / total) * 100).toFixed(0);
                    const completed = 100 - Number(percentage);

                    if (completed <= 20) {
                      this.Form.controls['pending_color_code'].setValue("danger");
                    } else if (completed <= 40) {
                      this.Form.controls['pending_color_code'].setValue("warning");
                    } else if (completed <= 60) {
                      this.Form.controls['pending_color_code'].setValue("info");
                    } else if (completed <= 80) {
                      this.Form.controls['pending_color_code'].setValue("primary");
                    } else if (completed <= 100) {
                      this.Form.controls['pending_color_code'].setValue("success");
                    }
                    this.Form.controls['pending_consumption'].setValue(constData.toString());
                    this.Form.controls['pending_percentage'].setValue(completed);
                  }
                  this.environmentService.update_pen_con_per(this.Form.value).subscribe({
                    next: (result: any) => { },
                    error: (err: any) => { },
                    complete: () => {
                      this.get_env_details();
                    }
                  });
                },
                error: (err: any) => { },
                complete: () => { }
              });
            }
          });
        }

      }
      if (data) {
        if (data.consumptions[data.consumptions.length - 1].save_new === true) {
          this.addConsumption();
        }
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
  showDeleteProgressPopup() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Deleting data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }
  saveAsDraft() {
    this.Form.controls['status'].setValue('Draft')
    if (this.Form.value.status === 'Rejected') {
      this.Form.controls['status'].setValue('Draft')
    }
    this.showProgressPopup();
    this.environmentService.update_environment(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        const statusText = "Consumption details saved"
        this._snackBar.open(statusText, 'OK', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        Swal.close()
        this.get_env_details()
      }
    })
  }


  submit() {
    this.Form.controls['status'].setValue('Under review')
    this.Form.controls['reviewer_notification'].setValue(false)
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please reconfirm that the details provided are best of your knowledge. If all the details are correct, please click on 'Yes,Proceed' button otherwise simply click on 'Cancel' button to review the data.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.showProgressPopup();
        this.update_environment()
      }
    })
  }

  update_environment() {
    this.environmentService.update_environment(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => {
        this.create_notification()
      }
    })
  }

  create_notification() {
    let data: any[] = []
    data.push({
      module: "Environment",
      action: 'Review on Consumption Data:',
      reference_number: this.Form.value.reference_number,
      userID: this.Form.value.reviewer,
      access_link: "/apps/environment/action/",
      profile: this.Form.value.created_user
    })

    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        Swal.fire({
          title: 'Consumption Added',
          imageUrl: "assets/images/reported.gif",
          imageWidth: 250,
          text: "You have successfully added the consumption details. We will notify the reviewer to take further action.",
          showCancelButton: false,
        }).then((result) => {
          this.router.navigate(["/apps/environment/history"])
        })
      }
    })

  }

  initialFilteredReviewer(data: string): void {
    const selectedBusinessUnitUuid = data
    this.DivisionFilteredpeopleList = this.peopleList.filter((data) =>
      data.attributes.divisions.data
        .map((division: any) => division.attributes.division_uuid)
        .includes(selectedBusinessUnitUuid)
    );
  }


  deleteConsumption(data: any) {
    this.showDeleteProgressPopup();
    this.delConCategory = this.delConCategory || [];
    const category = data.attributes.consumption_category;

    const categoryInOtherConsumptions = this.consumptions.some(consumption => {
      return consumption.attributes.consumption_category === category && consumption.id !== data.id;
    });
    if (!categoryInOtherConsumptions) {
      this.delConCategory.push(category);
    }
    const total = Number(this.consumption_category.length);
    const count = Number(this.delConCategory.length);
    const percentage = Number((count / total) * 100).toFixed(0);
    const completed = 100 - Number(percentage);
    if (completed <= 20) {
      this.Form.controls['pending_color_code'].setValue("danger");
    } else if (completed <= 40) {
      this.Form.controls['pending_color_code'].setValue("warning");
    } else if (completed <= 60) {
      this.Form.controls['pending_color_code'].setValue("info");
    } else if (completed <= 80) {
      this.Form.controls['pending_color_code'].setValue("primary");
    } else if (completed <= 100) {
      this.Form.controls['pending_color_code'].setValue("success");
    }
    this.Form.controls['pending_consumption'].setValue(this.delConCategory.join(','));
    this.Form.controls['pending_percentage'].setValue(completed);
    this.environmentService.update_pen_con_per(this.Form.value).subscribe({
      next: (result: any) => { },
      error: (err: any) => { },
      complete: () => { }
    });

    if (data.attributes.evidences.data === null || data.attributes.evidences.data.length === 0) {
      this.environmentService.delete_consumption(data.id).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.get_env_details();
          Swal.close();
        }
      });
    } else {
      const evidences = data.attributes.evidences.data;
      let deletedCount = 0;
      evidences.forEach((evidence: { attributes: { image_id: any; }; }, index: any) => {
        this.generalService.delete_image(evidence.attributes.image_id).subscribe({
          next: (result: any) => { },
          error: (err: any) => { },
          complete: () => {
            deletedCount++;
            if (deletedCount === evidences.length) {
              this.environmentService.delete_consumption(data.id).subscribe({
                next: (result: any) => { },
                error: (err: any) => { },
                complete: () => {
                  this.get_env_details();
                  Swal.close();
                }
              });
            }
          }
        });
      });
    }
  }


  viewConsumption(data: any) {
    this.dialog.open(ViewModifyConsumptionComponent, {
      data: data
    })
  }

  editConsumption(data: any) {
    this.Form.controls['year'].enable();
    this.Form.controls['month'].enable();
    this.environmentService.selectedYear = this.Form.value.year;
    this.environmentService.selectedMonth = this.Form.value.month;
    this.environmentService.selectedDivision = this.Form.value.division;

    this.Form.controls['year'].enable();
    this.Form.controls['month'].enable();
    this.environmentService.selectedYear = this.Form.value.year;
    this.environmentService.selectedMonth = this.Form.value.month;
    this.environmentService.selectedDivision = this.Form.value.division;

    this.dialog.open(UpdateConsumptionComponent, {
      data: { data: data, reference: this.Form.value.reference_number, 
        environmentService: this.environmentService,
        division: this.Form.controls['business_unit'].value }
    }).afterClosed().subscribe((data) => {
      this.get_env_details()

    });
  }
  navigate() {
    this.backToHistory = true
    this._location.back();
  }
  ngOnDestroy(): void {
    if (!this.backToHistory) {
      localStorage.removeItem('pageIndex')

    }
  }
}
