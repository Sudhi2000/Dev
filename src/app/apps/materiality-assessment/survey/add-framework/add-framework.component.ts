import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.api.service';

@Component({
  selector: 'app-add-framework',
  templateUrl: './add-framework.component.html',
  styleUrls: ['./add-framework.component.scss']
})
export class AddFrameworkComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AddFrameworkComponent>
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
