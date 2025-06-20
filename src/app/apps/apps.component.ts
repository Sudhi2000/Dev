import { Component, OnInit } from '@angular/core';
declare var SDK: any;

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent implements OnInit {




  constructor() {

  }

  ngOnInit() {
    this.chat()




  }

  async chat() {
    const initializeObj = {
      apiBaseUrl: `https://api-preprod-sandbox.mirrorfly.com`,
      licenseKey: `i37tJC5Kiai6kBoRb0UeY355pem9zm`,
      isTrialLicenseKey: true,
      callbackListeners: {},
    };
    await SDK.initializeSDK(initializeObj);
  }





}
