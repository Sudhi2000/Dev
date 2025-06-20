import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.api.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AddCategoryComponent>
  ) { }
  Form: FormGroup


  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      value: ['', [Validators.required]],
      id: [, [Validators.required]],
    });
    this.me();
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.Form.controls['id'].setValue(result.id)
      },
      error: (err: any) => {
      },
      complete: () => { }
    })
  }

  submit() {
    this.dialogRef.close(this.Form.value);
  }

}
