import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { forkJoin } from 'rxjs';
import { category } from 'src/app/apps/audit-inspection/audit-calendar/audit-calendar/data';
@Component({
  selector: 'app-create-chemical-name',
  templateUrl: './create-chemical-name.component.html',
  styleUrls: ['./create-chemical-name.component.scss']
})
export class CreateChemicalNameComponent implements OnInit {
  Form: FormGroup
  dropdownValues: any
  chemical_dropdown: any
  mode: 'create' | 'update' = 'create';
  zdhcLevel: any[] = []
  hazardTypes: any[] = []
  TypeList: any[] = []
  ghsClassifications: any[] = []
  IssueList: any[] = []
  orgID: string
  hazardStatementCode: any[] = [];
  allstatementcodes: string[] = [];
  Issues: any[] = []
  zdhcCategory: any[] = []
  Categories: any[] = []
  filteredZdhcCategory: any[] = []
  toppingList: any[] = []
  use_of_ppe = new FormControl(null);
  hazardType = new FormControl(null);
  ghsClassification = new FormControl(null);
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateChemicalNameComponent>,
    private chemicalService: ChemicalService,
    private authService: AuthService,
    private generalService: GeneralService,
    private router: Router
  ) {

  }

  ngOnInit() {

    if (this.defaults) {
      this.mode = 'update';
      this.get_commercial_name_by_id(this.defaults)
    }

    this.Form = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      uuid: [uuidv4()],
      substance_name: [''],
      formula: [''],
      chemical_form: [''],
      reach_regi_number: [''],
      zdhc_use_category: [''],
      where_why: [''],
      zdhc_level: [''],
      cas_no: [''],
      colour_index: [''],
      use_of_ppe: [''],
      hazardType: [''],
      ghsClassification: [''],
      category: ['']

    });
    this.get_dropdown_values()
    this.get_ppe_list()
    this.get_chemForm_dropdown()
    if (this.defaults) {
      this.mode = 'update';
      this.get_commercial_name_by_id(this.defaults)
      this.Form.controls['id'].setValue(this.defaults.toString())
    }



  }



  submit() {
    this.dialogRef.close(this.Form.value);
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

        this.zdhclevels()
        this.hazardtype()
        this.ghsclassification()
        this.zdhccategories()
      },
      error: (err: any) => { },
      complete: () => { }
    })
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
  get_ppe_list() {
    this.chemicalService.get_ppe().subscribe({
      next: (result: any) => {
        this.toppingList = result.data
      }
    })
  }

  get_commercial_name_by_id(id: any) {
    this.chemicalService.get_commercial_details(id).subscribe({
      next: (result: any) => {
        this.Form.controls['name'].setValue(result.data.attributes.name)
        this.Form.controls['substance_name'].setValue(result.data.attributes.substance_name)
        this.Form.controls['formula'].setValue(result.data.attributes.formula)
        this.get_chemForm_dropdown()
        this.materiality_Issue()
        this.Form.controls['chemical_form'].setValue(result.data.attributes.chemical_form_type)
        this.Form.controls['colour_index'].setValue(result.data.attributes.colour_index)
        this.get_dropdown_values()
        this.Form.controls['cas_no'].setValue(result.data.attributes.cas_no)
        this.Form.controls['where_why'].setValue(result.data.attributes.where_why)
        this.Form.controls['reach_regi_number'].setValue(result.data.attributes.reach_registration_number)
        if (result.data.attributes.hazard_type) {
          const hazardTypes = result.data.attributes.hazard_type.split(',');

          this.hazardType.setValue(hazardTypes);

          const observables = hazardTypes.map((hazard_type: string) =>
            this.get_hazard_statement_codes(hazard_type)
          );
          forkJoin(observables).subscribe(() => {
          });
        }
        this.Form.controls['category'].setValue(result.data.attributes.category)

        const ZdhcCategory = this.zdhcCategory.filter(function (elem: any) {
          return (elem.attributes.filter === result.data.attributes.category)
        })
        //this.filteredZdhcCategory = ZdhcCategory
        this.filteredZdhcCategory = ZdhcCategory.sort((a: any, b: any) => {

          return a.attributes.Value
            .localeCompare(b.attributes.Value)
        })
        this.Form.controls['hazardType'].setValue(result.data.attributes.hazard_type)
        this.Form.controls['use_of_ppe'].setValue(result.data.attributes.use_of_ppe)
        this.Form.controls['zdhc_level'].setValue(result.data.attributes.zdhc_level)
        this.Form.controls['zdhc_use_category'].setValue(result.data.attributes.ZDHC_Category)
        this.Form.controls['ghsClassification'].setValue(result.data.attributes.ghs_classification)
        if (result.data.attributes.use_of_ppe) {
          this.use_of_ppe.setValue(result.data.attributes.use_of_ppe.split(','))
        }
        if (result.data.attributes.ghs_classification) {
          this.ghsClassification.setValue(result.data.attributes.ghs_classification.split(','))
        }

      },
      error: (err: any) => { },
      complete: () => { }
    })
  }
  zdhccategories() {
    this.zdhcCategory = []
    const category = this.dropdownValues.filter(function (elem: any) {
      return (elem.attributes.Category === "ZDHC Use Category")
    })
    this.zdhcCategory = category

  }

  onCategorySelection(event: any) {
    const ZdhcCategory = this.zdhcCategory.filter(function (elem: any) {
      return (elem.attributes.filter === event.value)
    })
    //this.filteredZdhcCategory = ZdhcCategory
    this.filteredZdhcCategory = ZdhcCategory.sort((a: any, b: any) => {
      if (a.attributes.Value === 'Others') return 1;
      if (b.attributes.Value === 'Others') return -1;
      return a.attributes.Value
        .localeCompare(b.attributes.Value)
    })
  }

}