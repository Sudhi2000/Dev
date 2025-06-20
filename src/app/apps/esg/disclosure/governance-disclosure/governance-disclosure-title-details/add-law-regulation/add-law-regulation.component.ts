import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EsgService } from 'src/app/services/esg.service';
import { GeneralService } from 'src/app/services/general.api.service';

@Component({
  selector: 'app-add-law-regulation',
  templateUrl: './add-law-regulation.component.html',
  styleUrls: ['./add-law-regulation.component.scss']
})
export class AddLawRegulationComponent implements OnInit {

  Form: FormGroup
  lov: any[] = []
  orderedNGRBC: any[] = []
  currencyLawRegulation: any[] = [];

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private esgService: EsgService,
    private generalService: GeneralService,

    public dialogRef: MatDialogRef<AddLawRegulationComponent>) { }

  ngOnInit(): void {
    // this.setLawRegulationCurrency()

    this.Form = this.formBuilder.group({
      id: [''],
      title: [this.data.addData.title || ''],
      title_ref_id: [this.data.title_ref_id || ''],
      esg_disclosure: [this.data.refID || ''],
      event_id: [this.data.addData.event_id || null, Validators.required],
      NGRBC_principle: [this.data.addData.NGRBC_principle || '', Validators.required],
      agency_or_institution: [this.data.addData.agency_or_institution || '', Validators.required],
      amount: [this.data.addData.amount || null, Validators.required],
      currency: [this.data.addData.currency||this.data.lov[8]?.value || '', Validators.required],
      non_monetary_case: [this.data.addData.non_monetary_case || '', Validators.required],
      brief_of_case: [this.data.addData.brief_of_case || '', Validators.required],
      appeal_preffered: [this.data.addData.appeal_preffered || '', Validators.required],
      appeal_revision_details: [this.data.addData.appeal_revision_details || '', Validators.required],
      agency_or_institution_of_appeal: [this.data.addData.agency_or_institution_of_appeal || '', Validators.required],
      judicial_sanctions: [this.data.addData.judicial_sanctions || '', Validators.required],
      monetary_sanctions: [this.data.addData.monetary_sanctions || '', Validators.required],
    })
    this.lov = this.data.lov
    this.orderedNGRBC = this.lov[7].value.sort((a: { Value: string }, b: { Value: string }) => {
      const numA = parseInt(a.Value.replace("Principle ", ""), 10);
      const numB = parseInt(b.Value.replace("Principle ", ""), 10);
      return numA - numB;
    });


    if (this.data.mode === 'view') {
      // Disable form fields or customize behavior for view mode
      this.Form.disable(); // Example to disable form fields
    }
  }


  // // get currency from configuration
  // setLawRegulationCurrency() {
  //   this.generalService.get_app_config().subscribe({
  //     next: (result: any) => {
  //       this.Form.controls['currency'].setValue(result.data.attributes.currency)
  //       this.currencyLawRegulation.push(result.data.attributes.currency)

  //       // this.Form.get('currency')?.setValue()
  //     }
  //   })
  // }
  submit() {

    if (this.data.mode === 'modify' && this.data.addData.id) {
      const formData = new FormData();
      this.Form.controls['id'].setValue(this.data.addData.id)

      formData.append('lawRegulation_details', JSON.stringify(this.Form.value))
      this.esgService.updateGovLawRegulations(formData).subscribe({
        next: (result: any) => {
          this.dialogRef.close(this.Form.value);
        },
        error: (err: any) => {

        },
        complete: () => {
        }
      })
    } else {

      this.dialogRef.close(this.Form.value);
    }
  }
  close() {
    this.dialogRef.close()
  }

}
