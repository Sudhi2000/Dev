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
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss']
})
export class CreateTopicComponent implements OnInit {


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
    public dialogRef: MatDialogRef<CreateTopicComponent>) {
    // this.Frameworks?.valueChanges.subscribe(selectedValues => {
    //   const frameworkString = selectedValues?.join(', ');
    //   this.Form.controls['framework'].setValue(frameworkString);
    //   this.Frameworks.setErrors(null)
    // });
    this.Frameworks?.valueChanges.subscribe(selectedValues => {
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
      topic_id: [''],
    });
    this.get_dropdown_values()
    this.Frameworks.disable()
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
        this.industryControl.setValue(this.defaults.industry)
        this.Form.controls['industry'].setValue(this.defaults.industry)
        this.Frameworks.setValue([this.defaults.framework])
        this.Form.controls['framework'].setValue(this.defaults.framework)
        this.Frameworks.enable()

        const industry = this.Form.value.industry
        this.frameworks = []
        const framework = this.allframeWorks.filter(function (elem: any) {
          return (elem.attributes.industry === industry)
        })
        this.frameworks = this.allframeWorks
        // this.frameworks = framework
        this.Frameworks.setValue(this.defaults.framework)
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
    this.Frameworks.setValue(this.defaults.framework)
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


  submit() {

    this.subtopicsListed = this.Form.value.sub_topic.split(',').map((item: any) => item.trim());


    this.individualtopicsListed = this.Form.value.individual_topic.split(',').map((item: any) => item.trim());


    const datas = this.materialityindividualTopic.filter((item: any) =>
      this.individualtopicsListed.includes(item?.attributes?.value)
    );


    datas.forEach((elem, index) => {
      this.Form.controls['sub_topic'].setValue(elem.attributes.filter)
      this.Form.controls['individual_topic'].setValue(elem.attributes.value)

      this.materialityService.create_topic(this.Form.value).subscribe({
        next: (result: any) => {
          this.Form.controls['topic_id'].setValue(result.data.id);

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



  isAllSelected(): boolean {
    const selected = this.stakeholderTypes.value || [];
    return selected.length === this.stackholderType.length;
  }
  toggleSelectAll(): void {
    const selected = this.stakeholderTypes.value || [];
    if (this.isAllSelected()) {
      this.stakeholderTypes.setValue([]);
    } else {
      this.stakeholderTypes.setValue([...this.stackholderType]);
    }
  }

  selectAll(): void {
    this.stakeholderTypes.setValue([...this.stackholderType]);
  }

  deselectAll(): void {
    this.stakeholderTypes.setValue([]);
  }

    handleSelection(event: MatSelectChange): void {
    const selectedValue = event.value;

    if (selectedValue.includes('__select_all__')) {
      this.stakeholderTypes.setValue([...this.stackholderType]);
    } else if (selectedValue.includes('__deselect_all__')) {
      this.stakeholderTypes.setValue([]);
    } else {
      // Remove special values if accidentally added
      const cleaned = selectedValue.filter((v: string) =>
        v !== '__select_all__' && v !== '__deselect_all__'
      );
      this.stakeholderTypes.setValue(cleaned);
    }
  }

  isAllSelecteds(): boolean {
    const selected = this.stakeholderTypes.value || [];
    return selected.length === this.stackholderType.length;
  }


  // Framework
  isAllFrameworksSelected(): boolean {
    const allFrameworkValues = this.frameworks.map(f => f?.attributes?.value);
    const selected = this.Frameworks.value || [];
    return selected.length && selected.length === allFrameworkValues.length;
  }

  handleFrameworkSelection(event: MatSelectChange): void {
    const selectedValue = event.value;

    if (selectedValue.includes('__select_all__')) {
      const allValues = this.frameworks.map(f => f?.attributes?.value);
      this.Frameworks.setValue(allValues);
    } else if (selectedValue.includes('__deselect_all__')) {
      this.Frameworks.setValue([]);
    } else {
      // Remove special values if they sneak in
      const cleaned = selectedValue.filter((v: string) =>
        v !== '__select_all__' && v !== '__deselect_all__'
      );
      this.Frameworks.setValue(cleaned);
    }
  }

  // subtopic
  isAllSubTopicsSelected(): boolean {
    const allSubTopicValues = this.materialitysubTopic.map(item => item.attributes.value);
    const selected = this.subTopics.value || [];
    return selected.length && selected.length === allSubTopicValues.length;
  }

  handleSubTopicSelection(event: MatSelectChange): void {
    const selectedValue = event.value;

    if (selectedValue.includes('__select_all__')) {
      const allValues = this.materialitysubTopic.map(item => item.attributes.value);
      this.subTopics.setValue(allValues);
    } else if (selectedValue.includes('__deselect_all__')) {
      this.subTopics.setValue([]);
    } else {
      const cleaned = selectedValue.filter((v: string) =>
        v !== '__select_all__' && v !== '__deselect_all__'
      );
      this.subTopics.setValue(cleaned);
      this.setindividualTopic()
    }
  }

  setindividualTopic() {
    this.materialityindividualTopic = [];
    const topicArray = this.Form.value.sub_topic.split(',').map((t: any) => t.trim());
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
      complete: () => { }
    })

  }


  isAllIndividualTopicsSelected(): boolean {
    const allValues = this.materialityindividualTopic.map(item => item.attributes.value);
    const selected = this.individualTopics.value || [];
    return selected.length && selected.length === allValues.length;
  }

  handleIndividualTopicSelection(event: MatSelectChange): void {
    const selectedValue = event.value;

    if (selectedValue.includes('__select_all__')) {
      const allValues = this.materialityindividualTopic.map(item => item.attributes.value);
      this.individualTopics.setValue(allValues);
    } else if (selectedValue.includes('__deselect_all__')) {
      this.individualTopics.setValue([]);
    } else {
      const cleaned = selectedValue.filter((v: string) =>
        v !== '__select_all__' && v !== '__deselect_all__'
      );
      this.individualTopics.setValue(cleaned);
    }
  }


}
