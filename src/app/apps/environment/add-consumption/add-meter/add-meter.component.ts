
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { EnvironmentService } from 'src/app/services/environment.api.service';
import { GeneralService } from 'src/app/services/general.api.service';
import { environment } from 'src/environments/environment';
import { AddNewMeterComponent } from '../add-new-meter/add-new-meter.component';

@Component({
  selector: 'app-add-meter',
  templateUrl: './add-meter.component.html',
  styleUrls: ['./add-meter.component.scss']
})
export class AddMeterComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddMeterComponent>,
    private formBuilder: FormBuilder,
    private environmentService: EnvironmentService,
    private _snackBar: MatSnackBar,
    private router: Router,

    private generalService: GeneralService,
    private authService: AuthService,
    public dialog: MatDialog,) {



  }
  Form: FormGroup

  allMeters: any[]
  divisions: any[]
  isEditMode: boolean = false;
  initialLoad = false;
  selectedYear: any
  selectedMonth: any
  selectedDivision: any

  ngOnInit(): void {
    this.isEditMode = !!this.data;



    this.Form = this.formBuilder.group({
      meter_name: [this.data?.meter_name || '', Validators.required],
      location: [{ value: this.data?.location || '', disabled: true }, Validators.required],
      meter_quantity_unit: [{ value: this.data?.meter_quantity_unit || '', disabled: true }, Validators.required],
      initial_meter_reading: [this.data?.initial_meter_reading ?? null, Validators.required],
      final_meter_reading: [this.data?.final_meter_reading ?? null, Validators.required],
      quantity: [this.data?.quantity ?? null, Validators.required],
    });


    this.me()
    this.subscribeToReadingChanges();
    const year = this.environmentService.selectedYear;
    const month = this.environmentService.selectedMonth;
    const selectedDivision = this.environmentService.selectedDivision;
    this.selectedYear = year
    this.selectedMonth = month
    this.selectedDivision = selectedDivision



  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {


        this.divisions = result.profile.divisions


      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {
        this.getMeterData();
      }
    })
  }

  subscribeToReadingChanges() {
    this.Form.get('initial_meter_reading')?.valueChanges.subscribe(() => this.updateQuantity());
    this.Form.get('final_meter_reading')?.valueChanges.subscribe(() => this.updateQuantity());
  }

  updateQuantity() {
    const initial = this.Form.get('initial_meter_reading')?.value;
    const final = this.Form.get('final_meter_reading')?.value;

    if (initial != null && final != null && !isNaN(initial) && !isNaN(final)) {
      const quantity = final - initial;
      this.Form.patchValue({ quantity }, { emitEvent: false }); // prevent re-trigger
    } else {
      this.Form.patchValue({ quantity: null }, { emitEvent: false });
    }
  }
  getMeterData() {
    let query = ' '
    const divisionQuery = this.divisions.map((data: any) => `&filters[business_unit][division_uuid][$in]=${data.division_uuid}`).join('')
    query += divisionQuery
    query += `&filters[category]=${this.data.category}`


    this.environmentService.get_env_submeter(query).subscribe({
      next: (result: any) => {

        this.allMeters = result.data;
      },
      complete: () => {

        setTimeout(() => {
          this.initialLoad = true;
        }, 0);
      },
      error: () => {
        // handle error
      }
    });
  }

  submit() {
    this.Form.get('location')?.enable();
    this.Form.get('meter_quantity_unit')?.enable();
    this.dialogRef.close(this.Form.value);

  }
  newMeterAdd() {



    this.dialog
      .open(AddNewMeterComponent, { data: this.data })
      .afterClosed()
      .subscribe((data) => {


        if (data) {
          this.Form.patchValue({
            meter_name: data.attributes.meter_name,
            location: data.attributes.location,
            meter_quantity_unit: data.attributes.meter_quantity_unit,
          });

          // Refresh meter list after adding new meter

          this.getMeterData();
        }
      });
  }

  onChange(event: MatOptionSelectionChange, data: any): void {


    if (!this.initialLoad || !event.source.selected) return;



    this.Form.patchValue({
      meter_name: data.attributes.meter_name,
      location: data.attributes.location,
      meter_quantity_unit: data.attributes.meter_quantity_unit,
      initial_meter_reading: data.attributes.initial_meter_reading,
      final_meter_reading: data.attributes.final_meter_reading,
    })
    this.getPreviousMonthAndYear()
  }


  update() {
    this.Form.get('location')?.enable();
    this.Form.get('meter_quantity_unit')?.enable();
    this.dialogRef.close(this.Form.value);
  }


  getPreviousMonthAndYear() {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get the index of the selected month
    let monthIndex = months.indexOf(this.selectedMonth);

    if (monthIndex === -1) {
      console.error('Invalid month name');
    } else {
      // Check if the selected month is January
      if (this.selectedMonth === 'January') {
        // If January is selected, set the month to December of the previous year
        monthIndex = 11;  // December
        this.selectedYear = this.selectedYear - 1;  // Previous year
      } else {
        // Otherwise, just get the previous month
        monthIndex = monthIndex - 1;

        if (monthIndex < 0) {
          monthIndex = 11; // December (previous of January)
        }
      }

      // Enable the location field
      this.Form.get('location')?.enable();

      // Set the previous month and year
      const previousMonth = months[monthIndex];
      const year = this.selectedYear;
      const division = this.selectedDivision;
      const meterName = this.Form.value.meter_name;
      const location = this.Form.value.location;




      // 🔥 Now you can use previousMonth directly
      this.environmentService.get_env_submeter_details_by_month_year_division(year, previousMonth, division, meterName, location).subscribe({
        next: (result: any) => {


          if (result?.data && result?.data.length > 0) {
            // Find the latest data based on createdAt timestamp
            const latestSubmeterDetail = result.data.reduce((latest: any, current: any) => {
              const latestDate = new Date(latest.attributes?.createdAt);
              const currentDate = new Date(current.attributes?.createdAt);
              return currentDate > latestDate ? current : latest;
            });

            const finalMeterReading = latestSubmeterDetail?.attributes?.final_meter_reading;

            if (finalMeterReading !== undefined) {

              this.Form.controls['initial_meter_reading'].setValue(finalMeterReading);
            } else {
              console.log('final_meter_reading not found.');
            }
          } else {
            console.log('No data available');
          }
        },
        error: (err: any) => {
          console.error('Error fetching submeter details:', err);
        }
      });




    }
  }
}

