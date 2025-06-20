import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InternalAuditService } from 'src/app/services/internal-audit.service';
import { checkList } from 'src/app/services/schemas';
import { RemarksComponent } from './remarks/remarks.component';
import Swal from 'sweetalert2';
import { GeneralService } from 'src/app/services/general.api.service';
import { AuthService } from 'src/app/services/auth.api.service';
import { environment } from 'src/environments/environment';
import { reference } from '@popperjs/core';
import { CommandComponent } from './command/command.component';

@Component({
  selector: 'app-audit-checklist',
  templateUrl: './audit-checklist.component.html',
  styleUrls: ['./audit-checklist.component.scss'],
})
export class AuditChecklistComponent implements OnInit {
  static id = 100;
  checkList: any[] = [];
  auditCheckList: any[] = [];
  subCategory: any;
  multipleEvidenceArray: any[] = []
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  marks: any[] = [];
  evidenceFormData = new FormData();
  MultipleEvidenceFormData = new FormData();
  CommandEvidence = new FormData();
  total: any = 0;
  count: any = 0;
  priority: string;
  colorCode: string;
  weightage: any;
  achievable_score: any;
  TotalansweredQuestions: number = 0;
  answeredQuestions: number = 0;
  orgID: string
  peopleList: any[] = []
  priority_dropdown: any[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<AuditChecklistComponent>,
    private fb: FormBuilder,
    private internalService: InternalAuditService,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.auditCheckList = [];
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as checkList;
    }

    this.form = this.fb.group({
      data: [this.defaults.data.checkList],
      document_id: [''],
      document_name: [''],
      document_format: [''],
      evidence_name: [''],
      evidence_format: [''],
      command_evidence_id: [''],
      evidence_id: [this.defaults[0]?.document_id || ''],
      org_id: [null, [Validators.required]],
      assignee: [this.defaults.assignee, [Validators.required]],
      reference_number: ['', [Validators.required]],
      action_plan_reference_number: ['', [Validators.required]],
      internID: [''],
      markID: [''],
      total_questions: [null],
      answered_questions: [null]
    });

    this.configuration()
    // this.checkList = this.defaults.data.checkList;

    this.checkList = this.defaults.data.checkList.sort(function (a: any, b: any) {
      return a.attributes.question_order - b.attributes.question_order;
    });


    this.subCategory = this.defaults.data.subCategory;
    this.get_audit_marks();

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.audit_inspection
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])

              this.form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
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

  //check user has access
  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.int_aud_audit
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_dropdownValue();
          this.get_profiles()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }

  get_profiles() {
    this.authService.get_profiles(this.orgID).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((profile: any) => profile.attributes.user?.data?.attributes?.blocked === false);
        this.peopleList = filteredData;
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
      }
    });
  }
  get_dropdownValue() {
    const module = 'Internal Audit'
    this.internalService.get_dropdown(module).subscribe({
      next: (result: any) => {
        const prioritydata = result.data.filter(function (elem: any) {
          return elem.attributes.Category === 'Priority' && elem.attributes.Module === module
        });
        let dropdownData: any[] = [];
        prioritydata.forEach((elem: any) => {
          dropdownData.push(elem.attributes.Value);
        })
        this.priority_dropdown = dropdownData;
      },
      error: (err: any) => { },
      complete: () => { },
    })
  }
  get_audit_marks() {
    const reference = this.defaults.reference;
    this.internalService.get_audit_marks(reference).subscribe({
      next: (result: any) => {
        const data = this.checkList.filter((object1) => {
          return !result.data.some((object2: any) => {
            return (
              object1.attributes.checklist_id ===
              object2.attributes.checklist_id
            );
          });
        });
        this.auditCheckList = data;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }

  ScoreRatingCalculation(list: any, markValue: string) {
    this.achievable_score = list.attributes.achievable_score;
    this.weightage = list.attributes.weightage;
    let score = this.achievable_score;
    let rating = '';

    if (markValue === 'Yes') {
      if (this.weightage === 'Zero Tolerance') {
        score = this.achievable_score;
        rating = 'Complied';
      } else if (this.weightage === 'Critical') {
        score = this.achievable_score;
        rating = 'Complied';
      }
      else if (this.weightage === 'Major') {
        score = this.achievable_score;
        rating = 'Complied';
      }
      else if (this.weightage === 'Moderate') {
        score = this.achievable_score;
        rating = 'Complied';
      }
      else if (this.weightage === 'Minor') {
        score = this.achievable_score;
        rating = 'Complied';
      }
    } else if (markValue === 'Partial Yes') {
      if (this.weightage === 'Zero Tolerance') {
        score = this.achievable_score / 2;
        rating = 'Critical';
      } else if (this.weightage === 'Critical') {
        score = this.achievable_score / 2;
        rating = 'Major';
      }
      else if (this.weightage === 'Major') {
        score = this.achievable_score / 2;
        rating = 'Moderate';
      }
      else if (this.weightage === 'Moderate') {
        score = this.achievable_score / 2;
        rating = 'Minor';
      }
      else if (this.weightage === 'Minor') {
        score = this.achievable_score / 2;
        rating = 'Minor';
      }

    }
    else if (markValue === 'No') {
      if (this.weightage === 'Zero Tolerance') {
        score = 0;
        rating = 'Zero Tolerance';
      } else if (this.weightage === 'Critical') {
        score = 0;
        rating = 'Critical';
      }
      else if (this.weightage === 'Major') {
        score = 0;
        rating = 'Major';
      }
      else if (this.weightage === 'Moderate') {
        score = 0;
        rating = 'Moderate';
      }
      else if (this.weightage === 'Minor') {
        score = 0;
        rating = 'Minor';
      }

    }

    return { score, rating };
  }


  // auditMark(list: any, mark: any) {


  //   const markValue = mark.target.value;

  // if (markValue === 'Yes') {
  //   this.colorCode = 'Green';
  // } else if (markValue === 'Partial Yes') {
  //   this.colorCode = 'Yellow';
  // } else if (markValue === 'No' || markValue === 'not') {
  //   this.colorCode = 'Red';
  // }



  // const { score, rating } = this.ScoreRatingCalculation(list, markValue);
  // const data = this.marks.filter((elem: any) => elem.id === list.id);

  // if (data.length > 0) {
  //   this.marks.splice(
  //     this.marks.findIndex((existData) => existData.id === list.id),
  //     1
  //   );
  // }

  // if (markValue === 'not') {
  //   this.marks.push({
  //     id: list.id,
  //     reference_number: this.defaults.reference,
  //     mark: markValue,
  //     legal_reference: list.attributes.legal_reference,
  //     question: list.attributes.description,
  //     category: list.attributes.category,
  //     sub_category: list.attributes.sub_category,
  //     checklist_id: list.attributes.checklist_id,
  //     internal_audit: this.defaults.referenceID,
  //     remarks: '',
  //     color_code: this.colorCode,
  //     achievable_score: this.achievable_score,
  //     weightage: this.weightage,
  //     score: score,
  //     rating: rating
  //   });
  // } else if (markValue === 'Yes') {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.data = {
  //     question: list.attributes.description,
  //     evidence_name: '',
  //     evidence: '',
  //     evidence_id: '',
  //     org_id: this.form.value.org_id,
  //     assignee: this.form.value.assignee
  //   };

  //   const dialogRef = this.dialog.open(CommandComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       if (result[1].length != 0) {
  //         result[1].forEach((elem: any) => {
  //           this.CommandEvidence.delete('files');
  //           const extension = elem.name.split('.').pop().toLowerCase();
  //           this.CommandEvidence.append(
  //             'files',
  //             elem,
  //             this.defaults.reference + '.' + extension
  //           );
  //           this.generalService.upload(this.CommandEvidence).subscribe({
  //             next: (fileresult: any) => {
  //               this.marks.push({
  //                 evidence_name: fileresult[0].hash,
  //                 evidence_format: extension,
  //                 command_evidence_id: fileresult[0].id,
  //                 id: list.id,
  //                 reference_number: this.defaults.reference,
  //                 mark: markValue,
  //                 legal_reference: list.attributes.legal_reference,
  //                 question: list.attributes.description,
  //                 category: list.attributes.category,
  //                 sub_category: list.attributes.sub_category,
  //                 checklist_id: list.attributes.checklist_id,
  //                 internal_audit: this.defaults.referenceID,
  //                 command: result[0].command,
  //                 assignee: result[0].assignee,
  //                 due_date: result[0].due_date,
  //                 reported_date: result[0].reported_date,
  //                 priority: result[0].priority,
  //                 color_code: this.colorCode,
  //                 achievable_score: this.achievable_score,
  //                 weightage: this.weightage,
  //                 score: score,
  //                 rating: rating
  //               });
  //             },
  //             error: (err: any) => { },
  //             complete: () => { },
  //           });
  //         });
  //       } else {
  //         this.marks.push({
  //           id: list.id,
  //           reference_number: this.defaults.reference,
  //           mark: markValue,
  //           legal_reference: list.attributes.legal_reference,
  //           question: list.attributes.description,
  //           category: list.attributes.category,
  //           sub_category: list.attributes.sub_category,
  //           checklist_id: list.attributes.checklist_id,
  //           internal_audit: this.defaults.referenceID,
  //           assignee: result[0].assignee,
  //           due_date: result[0].due_date,
  //           reported_date: result[0].reported_date,
  //           command: result[0].command,
  //           priority: result[0].priority,
  //           color_code: this.colorCode,
  //           achievable_score: this.achievable_score,
  //           weightage: this.weightage,
  //           score: score,
  //           rating: rating
  //         });
  //       }
  //     } else {
  //       mark.target.value = 'Select a Status';
  //     }
  //   });
  // } else {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.data = {
  //     question: list.attributes.description,
  //     evidence_name: '',
  //     evidence: '',
  //     evidence_id: '',
  //     org_id: this.form.value.org_id,
  //     assignee: this.form.value.assignee,
  //     reference_number:this.form.value.reference_number
  //   };
  //   const dialogRef = this.dialog.open(RemarksComponent, dialogConfig);

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       if (result[1].length != 0) {
  //         result[1].forEach((elem: any) => {
  //           this.evidenceFormData.delete('files');
  //           const extension = elem.name.split('.').pop().toLowerCase();
  //           this.evidenceFormData.append(
  //             'files',
  //             elem,
  //             this.defaults.reference + '.' + extension
  //           );
  //           this.generalService.upload(this.evidenceFormData).subscribe({
  //             next: (fileresult: any) => {
  //               this.marks.push({
  //                 document_name: fileresult[0].hash,
  //                 document_format: extension,
  //                 document_id: fileresult[0].id,
  //                 id: list.id,
  //                 reference_number: this.defaults.reference,
  //                 action_plan_reference_number:result[0].reference_number,
  //                 mark: markValue,
  //                 legal_reference: list.attributes.legal_reference,
  //                 question: list.attributes.description,
  //                 category: list.attributes.category,
  //                 sub_category: list.attributes.sub_category,
  //                 checklist_id: list.attributes.checklist_id,
  //                 internal_audit: this.defaults.referenceID,
  //                 remarks: result[0].remarks,
  //                 assignee: result[0].assignee,
  //                 approver:result[0].approver,
  //                 due_date: result[0].due_date,
  //                 reported_date: result[0].reported_date,
  //                 priority: result[0].priority,
  //                 color_code: this.colorCode,
  //                 achievable_score: this.achievable_score,
  //                 weightage: this.weightage,
  //                 score: score,
  //                 rating: rating
  //               });
  //             },
  //             error: (err: any) => { },
  //             complete: () => { },
  //           });
  //         });
  //       } else {
  //         this.marks.push({
  //           id: list.id,
  //           reference_number: this.defaults.reference,
  //           action_plan_reference_number:result[0].reference_number,
  //           mark: markValue,
  //           legal_reference: list.attributes.legal_reference,
  //           question: list.attributes.description,
  //           category: list.attributes.category,
  //           sub_category: list.attributes.sub_category,
  //           checklist_id: list.attributes.checklist_id,
  //           internal_audit: this.defaults.referenceID,
  //           assignee: result[0].assignee,
  //           approver:result[0].approver,
  //           due_date: result[0].due_date,
  //           reported_date: result[0].reported_date,
  //           remarks: result[0].remarks,
  //           priority: result[0].priority,
  //           color_code: this.colorCode,
  //           achievable_score: this.achievable_score,
  //           weightage: this.weightage,
  //           score: score,
  //           rating: rating
  //         });
  //       }
  //     } else {
  //       mark.target.value = 'Select a Status';
  //     }
  //   });
  // }
  // }


  auditMark(list: any, mark: any) {


    const markValue = mark.target.value;

    if (markValue === 'Yes') {
      this.colorCode = 'Green';
    } else if (markValue === 'Partial Yes') {
      this.colorCode = 'Yellow';
    } else if (markValue === 'No' || markValue === 'not') {
      this.colorCode = 'Red';
    }



    const { score, rating } = this.ScoreRatingCalculation(list, markValue);
    const data = this.marks.filter((elem: any) => elem.id === list.id);

    if (data.length > 0) {
      this.marks.splice(
        this.marks.findIndex((existData) => existData.id === list.id),
        1
      );
    }

    if (markValue === 'not') {
      this.marks.push({
        id: list.id,
        reference_number: this.defaults.reference,
        mark: markValue,
        legal_reference: list.attributes.legal_reference,
        question: list.attributes.description,
        category: list.attributes.category,
        sub_category: list.attributes.sub_category,
        checklist_id: list.attributes.checklist_id,
        internal_audit: this.defaults.referenceID,
        remarks: '',
        color_code: this.colorCode,
        achievable_score: this.achievable_score,
        weightage: this.weightage,
        score: score,
        rating: rating
      });
    } else if (markValue === 'Yes') {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.data = {
        question: list.attributes.description,
        evidence_name: '',
        evidence: '',
        evidence_id: '',
        org_id: this.form.value.org_id,
        assignee: this.form.value.assignee
      };

      const dialogRef = this.dialog.open(CommandComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result[1].length != 0) {
            result[1].forEach((elem: any) => {
              this.CommandEvidence.delete('files');
              const extension = elem.name.split('.').pop().toLowerCase();
              this.CommandEvidence.append(
                'files',
                elem,
                this.defaults.reference + '.' + extension
              );
              this.generalService.upload(this.CommandEvidence).subscribe({
                next: (fileresult: any) => {
                  this.marks.push({
                    evidence_name: fileresult[0].hash,
                    evidence_format: extension,
                    command_evidence_id: fileresult[0].id,
                    id: list.id,
                    reference_number: this.defaults.reference,
                    mark: markValue,
                    legal_reference: list.attributes.legal_reference,
                    question: list.attributes.description,
                    category: list.attributes.category,
                    sub_category: list.attributes.sub_category,
                    checklist_id: list.attributes.checklist_id,
                    internal_audit: this.defaults.referenceID,
                    command: result[0].command,
                    assignee: result[0].assignee,
                    due_date: result[0].due_date,
                    reported_date: result[0].reported_date,
                    priority: result[0].priority,
                    color_code: this.colorCode,
                    achievable_score: this.achievable_score,
                    weightage: this.weightage,
                    score: score,
                    rating: rating
                  });
                },
                error: (err: any) => { },
                complete: () => { },
              });
            });
          } else {
            this.marks.push({
              id: list.id,
              reference_number: this.defaults.reference,
              mark: markValue,
              legal_reference: list.attributes.legal_reference,
              question: list.attributes.description,
              category: list.attributes.category,
              sub_category: list.attributes.sub_category,
              checklist_id: list.attributes.checklist_id,
              internal_audit: this.defaults.referenceID,
              assignee: result[0].assignee,
              due_date: result[0].due_date,
              reported_date: result[0].reported_date,
              command: result[0].command,
              priority: result[0].priority,
              color_code: this.colorCode,
              achievable_score: this.achievable_score,
              weightage: this.weightage,
              score: score,
              rating: rating
            });
          }
        } else {
          mark.target.value = 'Select a Status';
        }
      });
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.data = {
        question: list.attributes.description,
        evidence_name: '',
        evidence: '',
        evidence_id: '',
        org_id: this.form.value.org_id,
        assignee: this.form.value.assignee,
        reference_number: this.form.value.reference_number
      };
      const dialogRef = this.dialog.open(RemarksComponent, dialogConfig);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result[1].length != 0) {
            result[1].forEach((elem: any) => {
              this.evidenceFormData.delete('files');
              const extension = elem.name.split('.').pop().toLowerCase();
              this.evidenceFormData.append(
                'files',
                elem,
                this.defaults.reference + '.' + extension
              );
              this.generalService.upload(this.evidenceFormData).subscribe({
                next: (fileresult: any) => {
                  this.marks.push({
                    document_name: fileresult[0].hash,
                    document_format: extension,
                    document_id: fileresult[0].id,
                    // internal_audit_evidences
                    id: list.id,
                    reference_number: this.defaults.reference,
                    action_plan_reference_number: result[0].reference_number,
                    mark: markValue,
                    legal_reference: list.attributes.legal_reference,
                    question: list.attributes.description,
                    category: list.attributes.category,
                    sub_category: list.attributes.sub_category,
                    checklist_id: list.attributes.checklist_id,
                    internal_audit: this.defaults.referenceID,
                    remarks: result[0].remarks,
                    assignee: result[0].assignee,
                    approver: result[0].approver,
                    due_date: result[0].due_date,
                    reported_date: result[0].reported_date,
                    priority: result[0].priority,
                    color_code: this.colorCode,
                    achievable_score: this.achievable_score,
                    weightage: this.weightage,
                    score: score,
                    rating: rating
                  });
                },
                error: (err: any) => { },
                complete: () => {
                  if (result[2].length != 0) {
                    result[2].forEach((elem: any) => {
                      this.MultipleEvidenceFormData.delete('files');
                      const extension = elem.name.split('.').pop().toLowerCase();
                      this.MultipleEvidenceFormData.append(
                        'files',
                        elem,
                        this.defaults.reference + '.' + extension
                      );
                      this.generalService.upload(this.MultipleEvidenceFormData).subscribe({
                        next: (evidenceresult: any) => {

                          this.multipleEvidenceArray.push({
                            document_name: evidenceresult[0].hash,
                            document_format: extension,
                            document_id: evidenceresult[0].id,
                            checklist_id: list.attributes.checklist_id,
                            // title: elem.title
                          })

                        },
                        error: (err: any) => { },
                        complete: () => { },
                      });
                    });
                  }
                },
              });
            });
          } else {
            this.marks.push({
              id: list.id,
              reference_number: this.defaults.reference,
              action_plan_reference_number: result[0].reference_number,
              mark: markValue,
              legal_reference: list.attributes.legal_reference,
              question: list.attributes.description,
              category: list.attributes.category,
              sub_category: list.attributes.sub_category,
              checklist_id: list.attributes.checklist_id,
              internal_audit: this.defaults.referenceID,
              assignee: result[0].assignee,
              approver: result[0].approver,
              due_date: result[0].due_date,
              reported_date: result[0].reported_date,
              remarks: result[0].remarks,
              priority: result[0].priority,
              color_code: this.colorCode,
              achievable_score: this.achievable_score,
              weightage: this.weightage,
              score: score,
              rating: rating
            });
          }
        } else {
          mark.target.value = 'Select a Status';
        }
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
      },
    });
  }

  submit() {
    this.total = this.marks.length;
    this.count = 0;
    let audTotal: Number = 0;
    let audCount: Number = 0;

    if (this.marks.length > 0) {
      this.showProgressPopup();
      audTotal = this.marks.length;

      this.marks.forEach((elem) => {
        this.internalService.create_audit_marks(elem).subscribe({
          next: (result: any) => {
            const auditMarkId = result.data.id;
            let createDate: any[] = [];

            this.multipleEvidenceArray.forEach((evidence) => {
              if (evidence.checklist_id === elem.checklist_id) {
                evidence.audit_mark = auditMarkId;
              }
            });

            createDate.push({
              findings: elem.remarks,
              command: elem.command,
              internal_audit: this.defaults.referenceID,
              priority: elem.priority,
              mark_id: auditMarkId,
              assignee: elem.assignee,
              approver: elem.approver,
              due_date: elem.due_date,
              reported_date: elem.reported_date,
              reference_number: this.defaults.reference,
              action_plan_reference_number: elem.action_plan_reference_number,
              evidence_name: elem.evidence_name,
              evidence_format: elem.evidence_format,
              command_evidence_id: elem.command_evidence_id
            });

            let evidenceDocument: any[] = [];
            evidenceDocument.push({
              internal_audit: this.defaults.referenceID,
              document_name: elem.document_name,
              document_format: elem.document_format,
              document_id: elem.document_id,
              audit_mark: auditMarkId
            });

            if (elem.mark === 'No' || elem.mark === 'Partial Yes') {
              this.internalService.create_action_plan(createDate[0]).subscribe({
                next: (result: any) => {
                  const internID = result.data.id;
                  this.form.controls['internID'].setValue(internID);
                  if (evidenceDocument[0].document_name) {
                    this.internalService.create_action_plan_evidence(evidenceDocument[0], internID).subscribe({
                      next: (result: any) => {
                        this.multipleEvidenceArray.forEach((evidence, index) => {
                          if (evidence.checklist_id === elem.checklist_id && evidence.audit_mark === auditMarkId) {
                            this.internalService.create_internal_audit_multiple_evidence_before(evidence, internID).subscribe({
                              next: (result: any) => {

                              },
                              error: (err: any) => {
                              },
                              complete: () => {
                                let tempCount = audCount;
                                audCount = Number(tempCount) + 1;
                                if (audTotal === audCount) {
                                  this.dialogRef.close(this.marks);
                                  Swal.close();
                                }
                              },
                            });
                          }
                        });
                      },
                      error: (err: any) => {
                        console.error('Error creating action plan evidence:', err);
                      },
                      complete: () => {
                        let tempCount = audCount;
                        audCount = Number(tempCount) + 1;
                        if (audTotal === audCount) {
                          this.dialogRef.close(this.marks);
                          Swal.close();
                        }
                      },
                    });
                  } else {
                    let tempCount = audCount;
                    audCount = Number(tempCount) + 1;
                    if (audTotal === audCount) {
                      this.dialogRef.close(this.marks);
                      Swal.close();
                    }
                  }
                },
                error: (err: any) => {
                  console.error('Error creating action plan:', err);
                },
                complete: () => {
                  let tempCount = audCount;
                  audCount = Number(tempCount) + 1;
                  if (audTotal === audCount) {
                    this.dialogRef.close(this.marks);
                    Swal.close();
                  }
                },
              });
            } else {
              let tempCount = audCount;
              audCount = Number(tempCount) + 1;
              if (audTotal === audCount) {
                this.dialogRef.close(this.marks);
                Swal.close();
              }
            }
          },
          error: (err: any) => {
          },
          complete: () => {

          },
        });
      });
    } else {
      this.dialogRef.close(this.marks);
    }
  }


  // submit() {

  //   this.total = this.marks.length;
  //   this.count = 0;
  //   let audTotal: Number = 0;
  //   let audCount: Number = 0;
  //   if (this.marks.length > 0) {
  //     this.showProgressPopup();
  //     audTotal = this.marks.length;
  //     this.marks.forEach((elem) => {
  //       this.internalService.create_audit_marks(elem).subscribe({
  //         next: (result: any) => {
  //           let createDate: any[] = [];
  //           createDate.push({
  //             findings: elem.remarks,
  //             command:elem.command,
  //             internal_audit: this.defaults.referenceID,
  //             priority: elem.priority,
  //             mark_id: result.data.id,
  //             assignee: elem.assignee,
  //             approver: elem.approver,
  //             due_date: elem.due_date,
  //             reported_date: elem.reported_date,
  //             reference_number: this.defaults.reference,
  //             action_plan_reference_number:elem.action_plan_reference_number,
  //             evidence_name: elem.evidence_name,
  //             evidence_format: elem.evidence_format,
  //             command_evidence_id: elem.command_evidence_id   
  //           });
  //           let evidenceDocument: any[] = [];
  //           evidenceDocument.push({
  //             internal_audit: this.defaults.referenceID,
  //             document_name: elem.document_name,
  //             document_format: elem.document_format,
  //             document_id: elem.document_id,
  //           });
  //           // let Commandevidence: any[] = [];
  //           // Commandevidence.push({
  //           //   internal_audit: this.defaults.referenceID,
  //           //   evidence_name: elem.evidence_name,
  //           //   evidence_format: elem.evidence_format,
  //           //   command_evidence_id: elem.command_evidence_id              ,
  //           // });

  //           if (elem.mark === 'No' || elem.mark === 'Partial Yes') {
  //             this.internalService.create_action_plan(createDate[0]).subscribe({
  //               next: (result: any) => {
  //                 this.form.controls['internID'].setValue(result.data.id)
  //               },
  //               error: (err: any) => { },
  //               complete: () => {
  //                 if (evidenceDocument[0].document_name) {
  //                   this.internalService
  //                     .create_action_plan_evidence(
  //                       evidenceDocument[0],
  //                       this.form.value.internID
  //                     )
  //                     .subscribe({
  //                       next: (result: any) => { },
  //                       error: (err: any) => { },
  //                       complete: () => { },
  //                     });
  //                   let count = this.count;
  //                   this.count = Number(count) + 1;

  //                   let tempCount = audCount;
  //                   audCount = Number(tempCount) + 1;
  //                   if (audTotal === audCount) {
  //                     this.dialogRef.close(this.marks);
  //                     Swal.close();
  //                   }
  //                 } else {
  //                   let tempCount = audCount;
  //                   audCount = Number(tempCount) + 1;
  //                   if (audTotal === audCount) {
  //                     this.dialogRef.close(this.marks);
  //                     Swal.close();
  //                   }
  //                 }
  //               },
  //             });
  //           }else {
  //             let tempCount = audCount;
  //             audCount = Number(tempCount) + 1;
  //             if (audTotal === audCount) {
  //               this.dialogRef.close(this.marks);
  //               Swal.close();
  //             }
  //           }
  //         },
  //         error: (err: any) => { },
  //         complete: () => { },
  //       });
  //     });
  //   } else {
  //     this.dialogRef.close(this.marks);
  //   }
  // }

}
