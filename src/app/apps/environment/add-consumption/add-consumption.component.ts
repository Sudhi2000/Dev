import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { consumption } from 'src/app/services/schemas';
import { ConsumptionComponent } from './consumption/consumption.component';
import { GeneralService } from '../../../services/general.api.service'
import { AuthService } from 'src/app/services/auth.api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { ViewConsumptionComponent } from './view-consumption/view-consumption.component';
import Swal from 'sweetalert2'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EditConsumptionComponent } from './edit-consumption/edit-consumption.component';

@Component({
  selector: 'app-add-consumption',
  templateUrl: './add-consumption.component.html',
  styleUrls: ['./add-consumption.component.scss']
})
export class AddConsumptionComponent implements OnInit {
  Form: FormGroup
  consumptions: any[] = []
  refrigerants: any[] = []
  IssueList: any[] = []
  years: any[] = []
  peopleList: any[] = []
  divisions: any[] = []
  DivisionFilteredpeopleList: any[] = [];
  orgID: any
  pollutantsEmitted: any[] = [];
  meters: any[] = [];
  evidenceFormData = new FormData()
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  totalCatCount: number
  Division = new FormControl(null, [Validators.required]);
  userDivision: any
  corporateUser: any
  unitSpecific: any
  conID: any;
  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private generalService: GeneralService,
    private authService: AuthService,
    private router: Router,
    private environmentService: EnvironmentService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [''],
      org_id: [''],
      division: ['', [Validators.required]],
      work_force: ['', [Validators.required]],
      days_worked: ['', [Validators.required]],
      // product_produced_kg: ['', [Validators.required]],
      product_produced_kg: [null],
      product_produced_pieces: ['', [Validators.required]],
      // area: ['', [Validators.required]],
      area: [null],
      year: [null, [Validators.required]],
      month: ['', [Validators.required]],
      reviewer: [null, [Validators.required]],
      reported_date: [new Date()],
      created_user: [null],
      reference_number: [''],
      status: ['Draft'],
      reviewer_notification: [null],
      pending_consumption: [''],
      pending_percentage: [null],
      pending_color_code: [''],
      business_unit: [''],
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
        this.Form.controls['created_user'].setValue(result.id)
        const status = result.env_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          if (this.unitSpecific) {
            this.corporateUser = result.profile.corporate_user
            if (this.corporateUser) {
              this.get_divisions()
              this.get_profiles()
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
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  isAirEmissionCategory(category: string): boolean {
    return category === 'Air Emission';
  }

  get_dropdown_values() {
    const module = "Environment"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        const data = result.data.filter(function (elem: any) {
          return (elem.attributes.Category === "Consumption Category")
        })
        this.totalCatCount = data.length
        let category: any[] = []
        data.forEach((elem: any) => {
          category.push(elem.attributes.Value)
        })
        this.Form.controls['pending_consumption'].setValue(category.toString())
        this.Form.controls['pending_percentage'].setValue(0)
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
        const newArray = result.data.map(({ id, attributes
        }: {
          id: any, attributes: any
        }) => ({
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
    this.Form.controls['year'].reset()
    this.Form.controls['month'].reset()
    this.Form.controls['division'].setValue(event.value.division_name)
    this.Form.controls['business_unit'].setValue(event.value.id)

    const selectedDivision = event.value.division_uuid


    this.DivisionFilteredpeopleList = this.peopleList.filter((data) =>
      data.attributes.divisions.data
        .map((division: any) => division.attributes.division_uuid)
        .includes(selectedDivision)
    );
  }
  get_profiles() {
    this.environmentService.get_env_reviewers().subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
  }
  get_unit_specific_profiles() {
    this.environmentService.get_unit_specific_env_reviewers(this.userDivision).subscribe({
      next: (result: any) => {
        this.peopleList = result.data;
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => { },
    });
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


  addConsumption() {


    this.environmentService.selectedYear = this.Form.value.year;
    this.environmentService.selectedMonth = this.Form.value.month;
    this.environmentService.selectedDivision = this.Form.value.division;

    this.dialog.open(ConsumptionComponent, {
      data: { consumptions: this.consumptions, pollutantsEmitted: this.pollutantsEmitted, 
        environmentService: this.environmentService,  
        selectedDivision: this.Form.controls['business_unit'].value}
    }).afterClosed().subscribe((data) => {
      if (data) {

        this.consumptions.push(...data?.consumptions);
      

        this.Form.controls['pending_consumption'].setValue(data.consumptions[0].pending_consumption);
        const pending = Number(data.consumptions[0].pending_percentage);
        const completed = 100 - pending;
        this.Form.controls['pending_percentage'].setValue(completed);
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
      }


      if (data?.consumptions[data?.consumptions?.length - 1].save_new === true) {
        this.addConsumption();
      }
    });
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
  saveAsDraft() {
    this.showProgressPopup();
    this.Form.controls['status'].setValue('Draft')
    this.environmentService.get_environment_all_entries().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = 'ENV-' + newCount
        this.Form.controls['reference_number'].setValue(reference)
        this.environmentService.create_environment(this.Form.value).subscribe({
          next: (result: any) => {
            this.Form.controls['id'].setValue(result.data.id)
            const id = result.data.id
            const year = result.data.attributes.year
            const month = result.data.attributes.month
            const division = result.data.attributes.division
            if (this.consumptions.length > 0) {
              this.consumptions.forEach(elem => {
                if (elem.files.length > 0) {
                  this.environmentService.create_consumption_env(elem, id, year, month, division).subscribe({
                    next: (result: any) => {
                      this.conID = result.data.id
                      elem.files.forEach((image: any) => {
                        this.evidenceFormData = new FormData();
                        const extension = image.name.split('.').pop().toLowerCase()
                        this.evidenceFormData.append('files', image, this.Form.value.reference_number + '.' + extension)
                        this.generalService.upload(this.evidenceFormData).subscribe({
                          next: (result: any) => {
                            let data: any[] = []
                            data.push({
                              evidence_name: result[0].hash,
                              format: extension,
                              consumption: this.conID,
                              id: result[0].id
                            })
                            this.environmentService.create_env_evidence(data[0]).subscribe({
                              next: (result: any) => { },
                              error: (err: any) => { },
                              complete: () => {
                                const statusText = "Consumption details saved"
                                this._snackBar.open(statusText, 'OK', {
                                  horizontalPosition: this.horizontalPosition,
                                  verticalPosition: this.verticalPosition,
                                });
                                this.router.navigate(["/apps/environment/consumption/modify/" + this.Form.value.reference_number])
                              }
                            })
                          },
                          error: (err: any) => { },
                          complete: () => { }
                        })

                      })

                      if (elem.refrigerants?.length > 0) {
                        elem.refrigerants.forEach((elem: any) => {
                          this.environmentService.create_refrigerant(elem, this.conID).subscribe({
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

                      if (elem.con_issues?.length > 0) {
                        elem.con_issues.forEach((elem: any) => {
                          this.environmentService.create_envIssues(elem, this.conID).subscribe({
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
                      if (elem?.meters?.length > 0) {
                        elem.meters.forEach((data: any) => {
                          this.environmentService.create_env_submeter_details(data, this.conID, year, month, division).subscribe({
                            next: (result: any) => {



                            },
                            error: (err: any) => { },
                            complete: () => { }
                          })

                        })
                      }

                    },
                    error: (err: any) => { },
                    complete: () => { }
                  })
                } else {
                  this.environmentService.create_consumption_env(elem, id, year, month, division).subscribe({
                    next: (result: any) => {

                      const conID = result.data.id


                      if (elem.refrigerants.length > 0) {
                        elem.refrigerants.forEach((data: any) => {
                          this.environmentService.create_refrigerant(data, conID).subscribe({
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

                      if (elem.con_issues.length > 0) {
                        elem.con_issues.forEach((elem: any) => {
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

                      if (elem?.meters?.length > 0) {
                        elem.meters.forEach((data: any) => {
                          this.environmentService.create_env_submeter_details(data, conID, year, month, division).subscribe({
                            next: (result: any) => {



                            },
                            error: (err: any) => { },
                            complete: () => { }
                          })

                        })
                      }
                    },
                    error: (err: any) => { },
                    complete: () => {
                      const statusText = "Consumption details saved"
                      this._snackBar.open(statusText, 'OK', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                      });
                      this.router.navigate(["/apps/environment/consumption/modify/" + this.Form.value.reference_number])
                    }
                  })
                }
              })
            } else {
              const statusText = "Consumption details saved"
              this._snackBar.open(statusText, 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              this.router.navigate(["/apps/environment/consumption/modify/" + this.Form.value.reference_number])
            }

          },
          error: (err: any) => { },
          complete: () => { }
        })
      },
      error: (err: any) => { },
      complete: () => { Swal.close() }
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
        this.create_environment()
      }
    })
  }

  create_environment() {
    this.environmentService.get_environment_all_entries().subscribe({
      next: (result: any) => {
        const count = result.data.length
        const newCount = Number(count) + 1
        const reference = 'ENV-' + newCount
        this.Form.controls['reference_number'].setValue(reference)
        this.environmentService.create_environment(this.Form.value).subscribe({
          next: (result: any) => {
            this.Form.controls['id'].setValue(result.data.id)
            const id = result.data.id
            const year = result.data.attributes.year
            const month = result.data.attributes.month
            const division = result.data.attributes.division
            if (this.consumptions.length > 0) {
              this.consumptions.forEach(elem => {
                if (elem.files.length > 0) {
                  this.environmentService.create_consumption_env(elem, id, year, month, division).subscribe({
                    next: (result: any) => {
                      this.conID = result.data.id

                      elem.files.forEach((image: any) => {
                        this.evidenceFormData = new FormData();
                        const extension = image.name.split('.').pop().toLowerCase()
                        this.evidenceFormData.append('files', image, this.Form.value.reference_number + '.' + extension)
                        this.generalService.upload(this.evidenceFormData).subscribe({
                          next: (result: any) => {
                            let data: any[] = []
                            data.push({
                              evidence_name: result[0].hash,
                              format: extension,
                              consumption: this.conID,
                              id: result[0].id
                            })
                            this.environmentService.create_env_evidence(data[0]).subscribe({
                              next: (result: any) => { },
                              error: (err: any) => { },
                              complete: () => {
                                this.create_notification()
                              }
                            })
                          },
                          error: (err: any) => { },
                          complete: () => { }
                        })
                      })


                      if (elem.refrigerants?.length > 0) {
                        elem.refrigerants.forEach((elem: any) => {
                          this.environmentService.create_refrigerant(elem, this.conID).subscribe({
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

                      if (elem.con_issues?.length > 0) {
                        elem.con_issues.forEach((elem: any) => {
                          this.environmentService.create_envIssues(elem, this.conID).subscribe({
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


                      if (elem?.meters?.length > 0) {
                        elem.meters.forEach((data: any) => {
                          this.environmentService.create_env_submeter_details(data, this.conID, year, month, division).subscribe({
                            next: (result: any) => {



                            },
                            error: (err: any) => { },
                            complete: () => { }
                          })

                        })
                      }
                    },
                    error: (err: any) => { },
                    complete: () => { }
                  })
                } else {
                  this.environmentService.create_consumption_env(elem, id, year, month, division).subscribe({
                    next: (result: any) => {

                      const conID = result.data.id

                      if (elem.refrigerants?.length > 0) {
                        elem.refrigerants.forEach((elem: any) => {
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

                      if (elem.con_issues?.length > 0) {
                        elem.con_issues.forEach((elem: any) => {
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

                      

                      if (elem?.meters?.length > 0) {
                        elem.meters.forEach((data: any) => {
                          this.environmentService.create_env_submeter_details(data, conID, year, month, division).subscribe({
                            next: (result: any) => {



                            },
                            error: (err: any) => { },
                            complete: () => { }
                          })

                        })
                      }
                    },
                    error: (err: any) => { },
                    complete: () => {

                      this.create_notification()
                    }
                  })
                }
              })
            }
          },
          error: (err: any) => { },
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
      },
      error: (err: any) => { },
      complete: () => {
        Swal.close()
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
      access_link: "/apps/environment/assigned/action/",
      profile: this.Form.value.created_user
    })

    this.generalService.create_notification(data[0]).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    })
  }

  deleteConsumption(index: number) {

    const catdata = "" + this.Form.value.pending_consumption + "";
    var catVal = catdata;
    var str_array = catVal.split(',');
    let cData: any[] = [];
    str_array.forEach(elem => {
      cData.push(elem);
    });
    if (this.consumptions[index]) {
      const delCategory = this.consumptions[index].consumption_category;
      const isCategoryInOtherConsumptions = this.consumptions.some((consumption, i) => {
        return i !== index && consumption.consumption_category === delCategory;
      });
      if (!isCategoryInOtherConsumptions && !cData.includes(delCategory)) {
        cData.push(delCategory);
      }
    }
    if (index > -1 && index < this.consumptions.length) {
      this.consumptions.splice(index, 1);
    }
    this.Form.controls['pending_consumption'].setValue(cData.toString());

    const total = Number(this.totalCatCount);
    const count = Number(cData.length);
    const percentage = Number(Number(count) / Number(total) * 100).toFixed(0);
    const completed = Number(100) - Number(percentage);
    this.Form.controls['pending_percentage'].setValue(completed);

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
  }

  viewConsumption(data: any) {

    this.dialog.open(ViewConsumptionComponent, {
      data: data
    }).afterClosed().subscribe((customer) => {
    });
  }

  editConsumption(data: any) {
    // data.reference_number = this.Form.value.reference_number;
    this.Form.controls['reference_number'].setValue(data.reference_number)
    this.dialog.open(EditConsumptionComponent, {
      data: data
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.consumptions.splice(this.consumptions.findIndex((existingCustomer) => existingCustomer.id === data.id), 1);
        this.consumptions.push(data)
      }
    });
  }


  yearVal(data: any) {
    this.Form.controls['month'].reset()
  }
  monthVal(data: any) {
    const year = this.Form.value.year
    const month = this.Form.value.month
    const division = this.Form.value.division
    this.environmentService.get_consumption_values(division, year, month).subscribe({
      next: (result: any) => {
        const length = result.data.length
        if (length > 0) {
          Swal.fire({
            title: 'Duplicate Entry',
            imageUrl: "assets/images/confirm.gif",
            imageWidth: 250,
            text: "There is a transaction already existing for the selected month. Please check the history.",
            showCancelButton: false,
          }).then((result) => {
            this.Form.controls.month.reset()
          })
        }
      },
      error: (err: any) => { },
      complete: () => {

      }
    })

  }

}
