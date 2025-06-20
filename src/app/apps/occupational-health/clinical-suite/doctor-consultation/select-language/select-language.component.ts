
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss']
})

export class SelectLanguageComponent implements OnInit {
  form: FormGroup;

  languages = [
    { value: 'english', viewValue: 'English' },
    { value: 'hindi', viewValue: 'Hindi' },
    { value: 'bangla', viewValue: 'Bangla' },
    { value: 'tamil', viewValue: 'Tamil' },
    { value: 'telugu', viewValue: 'Telugu' },
    { value: 'marathi', viewValue: 'Marathi' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SelectLanguageComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      language: ['', Validators.required]
    });
  }

  onLanguageChange(event: any): void {
    console.log('Language selected:', event.value);
  }

  closeDialog(): void {
    this.dialogRef.close(this.form.value);
  }
}
