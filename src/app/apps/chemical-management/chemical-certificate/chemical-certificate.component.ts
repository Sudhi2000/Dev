import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { certificate } from 'src/app/services/schemas';
import { environment } from 'src/environments/environment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ChemicalService } from 'src/app/services/chemical.api.service';
import { NewLabComponent } from '../new-lab/new-lab.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NewPositiveComponent } from '../new-positive/new-positive.component';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-chemical-certificate',
  templateUrl: './chemical-certificate.component.html',
  styleUrls: ['./chemical-certificate.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChemicalCertificateComponent implements OnInit {

  Form: FormGroup
  units: any[] = []
  orgID: string
  types: any[] = []
  UnitList: any[] = []
  LabList: any[] = []
  PositiveList: any[] = []
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  pdfSource: any
  dropdownValues: any
  files: File[] = [];
  issuedDate = new FormControl(null, [Validators.required]);
  expiryDate = new FormControl(null, [Validators.required]);
  testDate = new FormControl(null);
  mode: 'create' | 'update' = 'create';
  static id = 1;
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
      ],
    },
  }

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    private formBuilder: FormBuilder,
    private chemicalService: ChemicalService,
    private generalService: GeneralService,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ChemicalCertificateComponent>) { }


  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';

    } else {
      this.defaults = {} as certificate;
    }
    this.configuration()
    this.Form = this.formBuilder.group({
      id: [this.defaults.id],
      org_id: [this.defaults.org_id || '', [Validators.required]],
      certificate_name: [this.defaults.certificate_name || '', [Validators.required]],
      certificate_issued_date: [this.defaults.certificate_issued_date || '', [Validators.required]],
      certificate_expiry_date: [this.defaults.certificate_expiry_date || '', [Validators.required]],
      test_date: [this.defaults.test_date || null],
      test_lab: [this.defaults.test_lab || '', [Validators.required]],
      positive_list: [this.defaults.positive_list || '', [Validators.required]],
      remarks: [this.defaults.remarks || '', [Validators.required]],
      certificate: [this.defaults.certificate || ''],
      files: []
    });

  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.modules.chemical
        if (status === false) {
          this.router.navigate(["/error/upgrade-subscription"])
        } else if (status === true) {
          const allcookies = document.cookie.split(';');
          const name = environment.org_id
          for (var i = 0; i < allcookies.length; i++) {
            var cookiePair = allcookies[i].split("=");
            if (name == cookiePair[0].trim()) {
              this.orgID = decodeURIComponent(cookiePair[1])
              this.Form.controls['org_id'].setValue(decodeURIComponent(cookiePair[1]))
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

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        const status = result.chem_create
        if (status === false) {
          this.router.navigate(["/error/unauthorized"])
        } else {
          this.get_test_lab()
          this.get_positive_list()
        }
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }
  issuedDateVal(event: any) {
    this.Form.controls['certificate_issued_date'].setValue(event.value)
  }

  expiryDateVal(event: any) {
    this.Form.controls['certificate_expiry_date'].setValue(event.value)
  }

  testDateVal(event: any) {
    this.Form.controls['test_date'].setValue(event.value)
  }

  get_test_lab() {
    this.chemicalService.get_test_lab().subscribe({
      next: (result: any) => {
        this.LabList = result.data
      }
    })
  }

  get_positive_list() {
    this.chemicalService.get_positive_list().subscribe({
      next: (result: any) => {
        this.PositiveList = result.data
      }
    })
  }

  compressPDF(event: any) {
    const size = event.target.files[0].size / 1024 / 1024
    if (size > 2) {
      const statusText = "Please choose an image below 2 MB"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else {
      var fileTypes = ['pdf'];
      var extension = event.target.files[0].name.split('.').pop().toLowerCase(),
        isSuccess = fileTypes.indexOf(extension) > -1;
      if (isSuccess) {
        this.Form.controls['certificate'].setErrors(null)
        this.files.push(...event.target.files);
      } else {
        const statusText = "Please choose files ('PDF')"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    }
  }

  new_test_lab() {
    this.dialog.open(NewLabComponent).afterClosed().subscribe((data: any) => {
      const name = data.name
      const found = this.LabList.find(obj => obj.attributes.name === name);
      if (found) {
        const statusText = "Laboratory name already exist"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        this.chemicalService.create_test_lab(name, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.chemicalService.get_test_lab().subscribe({
              next: (result: any) => {
                this.LabList = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Laboratory name created successfully"
                this._snackBar.open(statusText, 'Close Warning', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['test_lab'].setValue(result.data.attributes.name)
              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })
      }
    })
  }

  new_positive_test() {
    this.dialog.open(NewPositiveComponent).afterClosed().subscribe((data: any) => {
      const name = data.name
      const found = this.PositiveList.find(obj => obj.attributes.name === name);
      if (found) {
        const statusText = "Postive list already exist"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        this.chemicalService.create_positive_list(name, this.Form.value.reporter).subscribe({
          next: (result: any) => {
            this.chemicalService.get_positive_list().subscribe({
              next: (result: any) => {
                this.PositiveList = result.data
              },
              error: (err: any) => {
                this.router.navigate(["/error/internal"])
              },
              complete: () => {
                const statusText = "Postive list added successfully"
                this._snackBar.open(statusText, 'Close Warning', {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                });
                this.Form.controls['positive_list'].setValue(result.data.attributes.name)
              }
            })
          },
          error: (err: any) => {
            this.router.navigate(["/error/internal"])
          },
          complete: () => { }
        })
      }
    })
  }

  submit() {
    this.Form.controls['files'].setValue(this.files)
    this.dialogRef.close(this.Form.value);
  }

  onSelect(event: any) {
    const fileLength = this.files.length
    const addedLength = event.addedFiles.length
    if (fileLength === 0 && addedLength < 2) {
      const size = event.addedFiles[0].size / 2560 / 2560
      if (size > 2) {
        const statusText = "Please choose a document below 5 MB"
        this._snackBar.open(statusText, 'Close Warning', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        var fileTypes = ['pdf'];
        var extension = event.addedFiles[0].name.split('.').pop().toLowerCase(),
          isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
          this.files.push(...event.addedFiles);
        } else {
          const statusText = "Please choose document ('pdf')"
          this._snackBar.open(statusText, 'Close Warning', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    } else if (fileLength < 6) {
      const statusText = "You have exceed the upload limit"
      this._snackBar.open(statusText, 'Close Warning', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    if (this.files.length === 0) {
      this.Form.controls['evidence'].reset()
    }
  }

}
