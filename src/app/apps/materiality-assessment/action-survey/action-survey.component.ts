import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Sortable from 'sortablejs';
import { AuthService } from 'src/app/services/auth.api.service';
import { MaterialityService } from 'src/app/services/materiality-assessment.api.service';

@Component({
  selector: 'app-action-survey',
  templateUrl: './action-survey.component.html',
  styleUrls: ['./action-survey.component.scss'],
})

export class ActionSurveyComponent implements OnInit {
  userId:any;
  @ViewChildren('sortableItem') sortableList: QueryList<ElementRef>;

   ngAfterViewInit() {
      this.initializeSortableList();
    }
  
    initializeSortableList() {
      const container = document.getElementById('sortable-list');
      if (container) {
        const listItems: HTMLElement[] = this.sortableList.toArray().map(item => item.nativeElement);
        listItems.forEach(item => container.appendChild(item));
  
        const sortable = new Sortable(container, {
          onUpdate: (event) => {
            this.updateSlNoValues(event);
          }
        });
      }
    }
  
    updateSlNoValues(event: any) {
      const updatedSelectedTopics: any[] = Array.from(event.from.children).map((item: any, index: number) => {
        const itemId = parseInt(item.getAttribute('data-id') || '');
        const selectedTopic = this.selected_topics.find(topic => topic.id === itemId);
        if (selectedTopic) {
          selectedTopic.slNo = index + 1;
        }
        return selectedTopic;
      });
      this.selected_topics = updatedSelectedTopics;
    }
  topics: any[] = [];  // Store topics from backend
  isSaving: boolean = false;
  selected_topics: any[] = [];
  materialityData: any[] = [];
  Form: FormGroup;
  filterForm: FormGroup

  constructor(private materialityService: MaterialityService,private authService: AuthService, private formBuilder: FormBuilder,private router: Router,private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
          id: [''],
          org_id: ['',],
          reference_number: [''],
          status: [''],
          reporter: [''],
          stakeholder: [''],
          email_subject: ['', [Validators.required]],
          headline: ['', [Validators.required]],
          content: [''],
          start_date: ['', [Validators.required]],
          end_date: ['', [Validators.required]],
          to_mail: [''],
          reference_id: [''],
        });
        this.filterForm = this.formBuilder.group({
          industry: [''],
          framework: [''],
        })
    
        
    
        const id = this.route.snapshot.paramMap.get('id')
        this.Form.controls['reference_id'].setValue(id)
    this.me();
    this.fetchTopics()

  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        console.log("Me result: ",result)
        this.userId = result.id;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  fetchTopics() {
    this.materialityService.get_survey_list(this.Form.value.reference_id).subscribe({
      next:(result: any) => {
        console.log("Materiality data::",result.data)
        let data = result.data;
        // this.materialityData = result.data;
       this.materialityData = data.sort((a: { attributes: { financial_materiality_value: number; }; }, b: { attributes: { financial_materiality_value: number; }; }) => {
  const valA = a?.attributes?.financial_materiality_value ?? 0;
  const valB = b?.attributes?.financial_materiality_value ?? 0;
  return valB - valA; // Descending order
});


      },
      error:(err: any) => {},
      complete:() => {}
    })
  }




  saveTopics() {
    this.isSaving = true;

  // Map topics with their current priority (index + 1 for 1-based index)
  const output = this.selected_topics.map((item, index) => ({
    title: item.attributes.topic,
    priority: index + 1,
    user:this.userId,
    surveyReference:this.Form.value.reference_id
  }));

  setTimeout(() => {
    this.isSaving = false;
  }, 1000);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selected_topics, event.previousIndex, event.currentIndex);
  }

  getStatusColor(value: number): string {
    if (value < 3) {
      return 'status-minimal';
    } else if (value >= 3 && value < 7) {
      return 'status-low';
    } else if (value >= 7 && value < 8) {
      return 'status-informative';
    } else if (value >= 8 && value < 10) {
      return 'status-important';
    } else if (value >= 10 && value < 12) {
      return 'status-significant';
    } else if (value >= 12) {
      return 'status-critical';
    } else {
      return '';
    }
  }
  

  getStatusTooltip(value: number): string {
    if (value < 3) {
      return 'Minimal';
    } else if (value >= 3 && value < 7) {
      return 'Low';
    } else if (value >= 7 && value < 8) {
      return 'Informative';
    } else if (value >= 8 && value < 10) {
      return 'Important';
    } else if (value >= 10 && value < 12) {
      return 'Significant';
    } else if (value >= 12) {
      return 'Critical';
    } else {
      return 'Unknown'; // fallback case if needed
    }
  }
  
  
}


