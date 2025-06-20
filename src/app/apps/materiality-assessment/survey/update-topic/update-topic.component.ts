import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EquipmentService } from 'src/app/services/equipment.api.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import Swal from 'sweetalert2'
import { GeneralService } from 'src/app/services/general.api.service';
import { MaterialityService } from 'src/app/services/materiality-assessment.api.service';
import { CreateIndustryComponent } from '../create-industry/create-industry.component';
import { AddFrameworkComponent } from '../add-framework/add-framework.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { UpdateCategoryComponent } from '../update-category/update-category.component';
import { UpdateFrameworkComponent } from '../update-framework/update-framework.component';
import { UpdateIndustryComponent } from '../update-industry/update-industry.component';
import { SubTopicComponent } from '../sub-topic/sub-topic.component';
import { IndividualTopicComponent } from '../individual-topic/individual-topic.component';

@Component({
  selector: 'app-update-topic',
  templateUrl: './update-topic.component.html',
  styleUrls: ['./update-topic.component.scss']
})
export class UpdateTopicComponent implements OnInit {


  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  Form: FormGroup
  categories: any[] = []
  selectedsubTopics: any[] = []
  selectedindividualTopics: any[] = []
  subtopicsListed: any[] = []
  individualtopicsListed: any[] = []
  frameworks: any[] = []
  allframeWorks: any[] = []
  industries: any[] = []
  dropDownValues: any[] = []
  materialityTopic: any[] = []
  materialitysubTopic: any[] = []
  materialityindividualTopic: any[] = []
  stackholderCategory: any[] = []
  stackholderType: any[] = []
  allData: any[] = []
  selectedCategories: any[] = []
  selectedFrameworks: any[] = []
  Frameworks = new FormControl('', [Validators.required])
  Categories = new FormControl('', [Validators.required])
  subTopics = new FormControl('', [Validators.required])
  stakeholderTypes = new FormControl('', [Validators.required])
  individualTopics = new FormControl('', [Validators.required])
  industryControl = new FormControl('', [Validators.required])

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private equipmentService: EquipmentService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private materialityService: MaterialityService,
    private generalService: GeneralService,
    public dialogRef: MatDialogRef<UpdateTopicComponent>) {
    // this.Frameworks?.valueChanges.subscribe(selectedValues => {
    //   const frameworkString = selectedValues?.join(', ');
    //   this.Form.controls['framework'].setValue(frameworkString);
    //   this.Frameworks.setErrors(null)
    // });
    this.Frameworks?.valueChanges.subscribe(selectedValues => {
      console.log('selectedValues:', selectedValues);
      const frameworkString = Array.isArray(selectedValues) ? selectedValues.join(', ') : '';
      this.Form.controls['framework'].setValue(frameworkString);
      this.Frameworks.setErrors(null);
    });


    this.Categories.valueChanges.subscribe(selectedValues => {
      const categoryString = selectedValues.join(', ');
      this.Form.controls['category'].setValue(categoryString);
      this.Categories.setErrors(null)
    });

    this.subTopics.valueChanges.subscribe(selectedValues => {
      const subtopicString = selectedValues.join(', ');
      this.Form.controls['sub_topic'].setValue(subtopicString);
      this.subTopics.setErrors(null)
    });

    this.individualTopics.valueChanges.subscribe(selectedValues => {
      const individualtopicString = selectedValues.join(', ');
      this.Form.controls['individual_topic'].setValue(individualtopicString);
      this.individualTopics.setErrors(null)
    });

    this.stakeholderTypes.valueChanges.subscribe(selectedValues => {
      const stakeholderString = selectedValues.join(', ');
      this.Form.controls['stakeholder_type'].setValue(stakeholderString);
      this.stakeholderTypes.setErrors(null)
    });
  }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      industry: ['', [Validators.required]],
      framework: ['', [Validators.required]],
      // category: ['', [Validators.required]],
      topic: ['', [Validators.required]],
      sub_topic: ['', [Validators.required]],
      individual_topic: ['', [Validators.required]],
      stakeholder_category: ['', [Validators.required]],
      stakeholder_type: ['', [Validators.required]],
      id: [this.defaults.topic.id],
    });
    this.get_dropdown_values()
    this.Frameworks.disable()


    //       {
    //     "topic": "Environment",
    //     "industry": "Textile Industry",
    //     "framework": "Global Reporting Initiative (GRI) Standards, Sustainability Accounting Standards Board (SASB)",
    //     "createdAt": "2025-05-20T04:53:08.851Z",
    //     "updatedAt": "2025-05-20T04:53:08.851Z",
    //     "publishedAt": "2025-05-20T04:53:08.836Z",
    //     "category": "Environmental Impact, Climate Change",
    //     "sub_topic": "Energy Management",
    //     "individual_topic": "Energy intensity reduction",
    //     "stakeholder_category": "External Stakeholders",
    //     "stakeholder_type": "Regulatory Bodies"
    // }
  }

  get_dropdown_values() {
    const module = "Materiality"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.dropDownValues = result.data
      },
      error: (err: any) => { },
      complete: () => {
        this.framework()
        this.category()
        this.get_materiality_assesment()
        this.get_industry()

      }
    })
  }

  get_industry() {
    this.materialityService.get_industry().subscribe({
      next: (result: any) => {
        // const defaultIndustry = result.data.find(function (elem: any) {
        //   return elem.attributes.filter != "default";
        // });
        // this.industries = defaultIndustry
        this.industries = result.data;

      },
      error: (err: any) => { },
      complete: () => {
        this.industryControl.setValue(this.defaults.form.industry)
        this.Form.controls['industry'].setValue(this.defaults.form.industry)
        this.Frameworks.setValue([this.defaults.form.framework])
        this.Form.controls['framework'].setValue(this.defaults.form.framework)
        this.Frameworks.enable()

        const industry = this.Form.value.industry
        this.frameworks = []
        const framework = this.allframeWorks.filter(function (elem: any) {
          return (elem.attributes.industry === industry)
        })
        this.frameworks = this.allframeWorks
        // this.frameworks = framework
        const selectedArray = this.defaults.topic.attributes.framework.split(',').map((item: any) => item.trim());
        this.Frameworks.setValue(selectedArray)

        this.Form.controls['topic'].setValue(this.defaults.topic.attributes.topic)
        this.setTopic()
        const subtopicArray = this.defaults.topic.attributes.sub_topic.split(',').map((item: any) => item.trim());
        this.subTopics.setValue(subtopicArray)
        console.log("Check here:", subtopicArray)
        this.Form.controls['sub_topic'].setValue(this.defaults.topic.attributes.sub_topic)

        this.setindividualTopic()
        this.Form.controls['stakeholder_category'].setValue(this.defaults.topic.attributes.stakeholder_category)
        this.setstakeholder_type(this.defaults.topic.attributes.stakeholder_category)

      }
    })
  }

  get_materiality_assesment() {
    const module = "Materiality Assessment"
    this.generalService.get_dropdown_values(module).subscribe({
      next: (result: any) => {
        this.allData = result.data;
        this.materialityTopic = result.data
          .filter((item: any) => item.attributes.Category === "Topic")  // Filter items with Category "topic"
          .map((item: any) => item.attributes.Value);  // Extract only the Value field

        this.stackholderCategory = result.data
          .filter((item: any) => item.attributes.Category === "Stakeholder Category")  // Filter items with Category "topic"
          .map((item: any) => item.attributes.Value);
      },
      error: (err: any) => { },
      complete: () => {
      }
    })
  }

  setstakeholder_type(data: any) {
    this.stackholderType = []
    const category = data;
    this.stackholderType = this.allData
      .filter((item: any) => item.attributes.filter === category)  // Filter items with Category "topic"
      .map((item: any) => item.attributes.Value);

    const subtopicArray = this.defaults.topic.attributes.stakeholder_type.split(',').map((item: any) => item.trim());
    this.stakeholderTypes.setValue(subtopicArray)
    this.Form.controls['stakeholder_type'].setValue(this.defaults.topic.attributes.stakeholder_type)
  }

  set_industry(data: any) {
    this.Frameworks.enable()

    this.Form.controls['industry'].setValue(data.attributes.value)

    this.frameworks = []
    const framework = this.allframeWorks.filter(function (elem: any) {
      return (elem.attributes.industry === data.attributes.value)
    })
    // this.frameworks = framework
    this.frameworks = this.allframeWorks
    this.Frameworks.setValue(this.defaults.form.framework)
  }

  setTopic() {
    this.materialitysubTopic = [];
    this.materialityService.get_materiality_subtopic().subscribe({
      next: (result: any) => {

        const topic = this.Form.value.topic;
        this.materialitysubTopic = result.data
          .filter((item: any) => item.attributes.filter === topic)  // Filter items with Category "topic"
          .map((item: any) => item);
      },
      error: (err: any) => { },
      complete: () => { }
    })


  }

  setindividualTopic() {
    this.materialityindividualTopic = [];
    const topicArray = this.Form.value.sub_topic.split(',').map((t: any) => t.trim());
    console.log("SUbtopics rarrays00:: ", this.Form.value.sub_topic)
    console.log("SUbtopics rarrays:: ", topicArray)
    // const topicArray = this.Form.value.sub_topic

    this.materialityService.get_materiality_individualtopic().subscribe({
      next: (result: any) => {

        this.materialityindividualTopic = result.data
          .filter((item: any) => topicArray.includes(item.attributes.filter))
          .map((item: any) => item);
        this.individualTopics.reset()
        this.Form.controls['individual_topic'].reset()
      },
      error: (err: any) => { },
      complete: () => {
        const individualtopicArray = this.defaults.topic.attributes.individual_topic.split(',').map((item: any) => item.trim());
        this.individualTopics.setValue(individualtopicArray)
        this.Form.controls['individual_topic'].setValue(individualtopicArray)
      }
    })


  }

  category() {
    this.materialityService.get_category().subscribe({
      next: (result: any) => {
        this.categories = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  new_category() {
    this.dialog.open(AddCategoryComponent).afterClosed().subscribe(data => {
      if (data) {
        this.materialityService.create_category(data).subscribe({
          next: (result: any) => {
            this.categories = []
            this.category()
          },
          error: (err: any) => { },
          complete: () => {

          }
        })
      } else {

      }
    })
  }

  new_subtopic() {
    this.dialog.open(SubTopicComponent, { data: this.Form.value }).afterClosed().subscribe(data => {
      if (data) {
        const req = {
          value: data,
          filter: this.Form.value.topic
        }
        this.materialityService.create_materiality_survey_subtopic(req).subscribe({
          next: (result: any) => {
            this.setTopic()
          },
          error: (err: any) => { },
          complete: () => { }
        })
      } else {

      }
    })
  }

  new_individualtopic() {
    this.dialog.open(IndividualTopicComponent, { data: this.Form.value.sub_topic }).afterClosed().subscribe(data => {
      if (data) {
        const req = {
          value: data.individual_topic,
          filter: data.sub_topic
        }
        this.materialityService.create_materiality_survey_individualtopic(req).subscribe({
          next: (result: any) => {
            this.setindividualTopic()
          },
          error: (err: any) => { },
          complete: () => { }
        })
      } else {

      }
    })
  }

  editCategory(data: any) {
    this.dialog.open(UpdateCategoryComponent, { data: data }).afterClosed().subscribe(datas => {
      if (datas) {
        this.materialityService.update_category(datas, data.id).subscribe({
          next: (result: any) => {
            this.categories = []
            this.category()
          },
          error: (err: any) => { },
          complete: () => {

          }
        })
      } else {

      }
    })
  }

  deleteCategory(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the Category.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.materialityService.delete_category(data.id).subscribe({
          next: (result: any) => {
            this.categories = []
            this.category()
          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
    })
  }

  framework() {
    this.materialityService.get_framework().subscribe({
      next: (result: any) => {
        this.allframeWorks = result.data
      },
      error: (err: any) => { },
      complete: () => { }
    })

  }

  setframework(data: any) {
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

  new_industry() {
    this.dialog.open(CreateIndustryComponent).afterClosed().subscribe(data => {
      if (data) {
        this.materialityService.create_industry(data).subscribe({
          next: (result: any) => {
            this.industries = []
            this.get_industry()
            this.Form.controls['industry'].setValue(result.data.attributes.value);
          },
          error: (err: any) => { },
          complete: () => {

          }
        })
      } else {

      }
    })
  }

  editIndustry(data: any) {
    this.dialog.open(UpdateIndustryComponent, { data: data }).afterClosed().subscribe(datas => {
      if (datas) {
        this.materialityService.update_industry(datas, data.id).subscribe({
          next: (result: any) => {
            this.industries = []
            this.get_industry()
          },
          error: (err: any) => { },
          complete: () => {

          }
        })
      } else {

      }
    })
  }

  deleteIndustry(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the Industry.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.materialityService.delete_industry(data.id).subscribe({
          next: (result: any) => {
            this.industries = []
            this.get_industry()
          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
    })
  }

  new_framework() {
    this.dialog.open(AddFrameworkComponent).afterClosed().subscribe(data => {
      if (data) {
        let newObj = { ...data, industry: this.Form.value.industry };
        this.materialityService.create_framework(newObj).subscribe({
          next: (result: any) => {
            // this.allframeWorks = []
            this.frameworks = []
            this.allframeWorks.push(result.data)
            const framework = this.allframeWorks.filter(function (elem: any) {
              return (elem.attributes.industry === result.data.attributes.industry)
            })
            this.frameworks = framework


            // this.Form.controls['industry'].setValue(result.data.attributes.value);
          },
          error: (err: any) => { },
          complete: () => {

          }
        })
      } else {

      }
    })
  }

  editFramework(data: any) {
    this.dialog.open(UpdateFrameworkComponent, { data: data }).afterClosed().subscribe(datas => {
      if (datas) {
        this.materialityService.update_framework(datas, data.id).subscribe({
          next: (result: any) => {
            const updatedFramework = result.data;
            const index = this.allframeWorks.findIndex((elem: any) => elem.id === updatedFramework.id);

            if (index !== -1) {
              this.allframeWorks[index] = updatedFramework;
            } else {
              this.allframeWorks.push(updatedFramework);
            }

            this.frameworks = this.allframeWorks.filter(
              (elem: any) => elem.attributes.industry === updatedFramework.attributes.industry
            );
          },
          error: (err: any) => {
            console.error("Update error:", err);
          },
          complete: () => {
          }
        });

        // this.materialityService.update_framework(datas, data.id).subscribe({
        //   next: (result: any) => {
        //     this.frameworks = []
        //     this.allframeWorks.push(result.data)
        //     const framework = this.allframeWorks.filter(function (elem: any) {
        //       return (elem.attributes.industry === result.data.attributes.industry)
        //     })
        //     this.frameworks = framework


        //   },
        //   error: (err: any) => { },
        //   complete: () => {

        //   }
        // })
      } else {

      }
    })
  }

  deleteFramework(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      imageUrl: "assets/images/confirm-1.gif",
      imageWidth: 250,
      text: "Please confirm once again that you intend to delete the Framework.",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.materialityService.delete_framework(data.id).subscribe({
          next: (result: any) => {
            // this.frameworks = []
            // this.framework()
            // Remove from allframeWorks
            this.allframeWorks = this.allframeWorks.filter(
              (elem: any) => elem.id !== data.id
            );

            // Also update frameworks by removing the deleted item
            this.frameworks = this.frameworks.filter(
              (elem: any) => elem.id !== data.id
            );
          },
          error: (err: any) => { },
          complete: () => { }
        })
      }
    })
  }


  update() {

    this.subtopicsListed = this.Form.value.sub_topic.split(',').map((item: any) => item.trim());


    this.individualtopicsListed = this.Form.value.individual_topic.split(',').map((item: any) => item.trim());


    const datas = this.materialityindividualTopic.filter((item: any) =>
      this.individualtopicsListed.includes(item?.attributes?.value)
    );


    datas.forEach((elem, index) => {
      this.Form.controls['sub_topic'].setValue(elem.attributes.filter)
      this.Form.controls['individual_topic'].setValue(elem.attributes.value)

      this.materialityService.update_topic(this.Form.value).subscribe({
        next: (result: any) => {
          this.Form.controls['topic_id'].setValue(this.Form.value.id);

        },
        error: (err: any) => {
          this.router.navigate(["/error/internal"]);
        },
        complete: () => {
          if (index === datas.length - 1) {
            Swal.close();
            this.dialogRef.close();
          }
        }
      });
    });





    // const datas = this.materialityTopic
    //   .filter((item: any) => this.subtopicsListed.includes(item))
    //   .map((item: any) => item);


    // this.showProgressPopup()
    // this.materialityService.create_topic(this.Form.value).subscribe({
    //   next: (result: any) => {
    //     this.Form.controls['topic_id'].setValue(result.data.id)

    //   },
    //   error: (err: any) => {
    //     this.router.navigate(["/error/internal"])
    //   },
    //   complete: () => {
    //     Swal.close()
    //     this.dialogRef.close(this.Form.value.topic);
    //   }
    // })
  }


}
