import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialityService } from 'src/app/services/materiality-assessment.api.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2'

import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { MatDialog } from '@angular/material/dialog';

// import {  FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit {
  materialityID: any;
  surveyID: any;
  topicArray: any[] = []
  currentIndex = 0;
  surveyForm: FormGroup;
  createdDate:any;
  completedCalls = 0;
  email:any;

  finalArray: any[] = [];

  numbersArray = Array.from({ length: 11 }, (_, i) => i); // [0,1,2,...,10]


  constructor(
    private apiService: MaterialityService,
    private router: Router,
    public dialog: MatDialog,

    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.materialityID = this.route.snapshot.paramMap.get('id')
    this.verifyEmail()
    this.createdDate = new Date()
  }

  verifyEmail() {
    this.dialog.open(EmailVerificationComponent,
      { data: this.route.snapshot.paramMap.get('id'),
        width: '500px',     // Set the desired width
      height: '400px'
       },
      ).afterClosed().subscribe(data => {
        if (data.code == 200) {
          this.email = data.email
          this.getsurveyDetails()
    const controls: { [key: string]: FormControl } = {};

    this.topicArray.forEach((topic, index) => {
      controls[`impactMateriality${index}`] = new FormControl(null);
      controls[`financialMateriality${index}`] = new FormControl(null);
    });

    this.surveyForm = this.fb.group(controls);
        }else{

        }
      })
  }


  getsurveyDetails() {
    this.apiService.get_materiality_public_survey(this.materialityID).subscribe({
      next: (result: any) => {
        this.topicArray = result.topics;
        this.surveyID = result.survey.id
      },
      error: (err: any) => { },
      complete: () => {

      }
    })
  }

  isFormValid(): boolean {
    return this.topicArray.every(item =>
      item.impactMateriality >= 1 && item.impactMateriality <= 10 &&
      item.financialMateriality >= 1 && item.financialMateriality <= 10
    );
  }

  getAverage(item: any): number | null {
    const impact = item.impactMateriality;
    const financial = item.financialMateriality;

    if (impact != null && financial != null) {
      const avg = (impact + financial) / 2;
      return avg;
    }

    return null; // If either value is missing
  }


  onSubmit() {
    Swal.fire({
      title: 'Please wait...',
      html: 'Saving data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });


    this.finalArray = this.topicArray.map(item => {
      const impact = item.impactMateriality;
      const financial = item.financialMateriality;
      const average = (impact != null && financial != null) ? (impact + financial) / 2 : null;

      return {
        topic: item.topic,
        sub_topic: item.sub_topic,
        impactMateriality: impact,
        financialMateriality: financial,
        average: average,
        materiality_survey: this.surveyID,
        category: item.category,
        email:this.email
      };
    });

    this.finalArray.forEach(elem => {
      this.apiService.create_materiality_survey(elem).subscribe({
        next: (result: any) => { },
        error: (err: any) => { },
        complete: () => {
          this.completedCalls++;
          if (this.completedCalls === this.finalArray.length) {
            Swal.close()
            Swal.fire({
              title: 'Survey Saved',
              imageUrl: "assets/images/confirm.gif",
              imageWidth: 250,
              text: "You have successfully reported the survey.",
              showCancelButton: false,
            }).then((result) => {
              // this.router.navigate(["/error/internal"]);
              this.router.navigate(["/"])

            })
          }
        }
      })

    })


  }



  ratingScale = Array.from({ length: 11 }, (_, i) => i);

getSliderColor(value: number): string {
  if (value <= 2) return 'slider-red';
  if (value <= 4) return 'slider-orange';
  if (value <= 6) return 'slider-yellow';
  if (value <= 8) return 'slider-lightgreen';
  return 'slider-green';
}

getnewSliderColor(value: number): string {
  if (value <= 2) return 'slider-red';
  if (value <= 4) return 'slider-orange';
  if (value <= 6) return 'slider-yellow';
  if (value <= 8) return 'slider-lightgreen';
  return 'slider-green';
}

getSlidernewColor(value: number): string {
  if (value <= 3) return 'low-value';
  if (value <= 7) return 'medium-value';
  return 'high-value';
}


getClassForSliderValue(currentValue: number, n: number): string {

  return currentValue === n ? this.getSliderColor(currentValue) : 'text-muted';
}



}
