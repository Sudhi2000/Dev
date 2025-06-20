import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import Swal from 'sweetalert2';
import { ShortcutInput, ShortcutEventOutput, KeyboardShortcutsComponent } from "ng-keyboard-shortcuts";
import { Router } from '@angular/router';
import { GeneralService } from './services/general.api.service';
declare var SDK: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'nobleui-angular';
  updates: boolean = false;


  shortcuts: ShortcutInput[] = [];





  constructor(private update: SwUpdate, private router: Router, private generalService: GeneralService) {

    update.available.subscribe(event => {
      this.updates = true

      Swal.fire({
        title: 'Updates Available',
        imageUrl: "assets/images/cloud.gif",
        imageWidth: 250,
        text: "New features / bug fixes are available for update. Click 'Yes, proceed' button to reload the application to make effect the latest features/bug fix. If select 'Caneel' option, the application will be updated on next reload",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      }).then((result) => {
        if (result.isConfirmed) {
          document.location.reload();

        }
      })







    })

  }

  ngAfterViewInit() {
    this.shortcuts.push(
      {
        key: "?",
        label: "Help",
        description: "Question mark",
        command: (e) => console.log("question mark clicked", { e }),
        preventDefault: true
      },
      {
        key: ["up up down down left right left right b a enter"],
        label: "Sequences",
        description: "Konami code!",
        command: (output: ShortcutEventOutput) =>
          console.log("Konami code!!!", output)
      },
      {
        key: ["cmd + h"],
        label: "Help",
        description: "Cmd + d",
        command: (e) => this.hazardRisk(),
        preventDefault: true
      },
      {
        key: ["cmd + a"],
        label: "Help",
        description: "Cmd + i",
        command: (e) => this.accident(),
        preventDefault: true
      },
      {
        key: ["cmd + x"],
        command: (output: ShortcutEventOutput) => console.log("command + a", output),
      },
    );
  }



  hazardRisk() {
    this.router.navigate(['/apps/hazard-risk/create']);
  }

  accident() {
    this.router.navigate(['/apps/accident-incident/create-accident']);

  }





  ngOnInit() {

    // this.chat()
    this.configuration()



  }

  configuration(){
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {
        const status = result.data.attributes.under_maintenance
        if (status === true) {
          this.router.navigate(["/error/under-maintenance"])
        } 
          
      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => { }
    })
  }


  // async chat() {
  //   const initializeObj = {
  //     apiBaseUrl: `https://api-preprod-sandbox.mirrorfly.com`,
  //     licenseKey: `i37tJC5Kiai6kBoRb0UeY355pem9zm`,
  //     isTrialLicenseKey: true,
  //     callbackListeners: {},
  //   };
  //   await SDK.initializeSDK(initializeObj);
  // }


}
