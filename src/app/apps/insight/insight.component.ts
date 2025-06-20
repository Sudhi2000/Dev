import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.api.service';
import { HazardService } from 'src/app/services/hazards.api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-insight',
  templateUrl: './insight.component.html',
  styleUrls: ['./insight.component.scss'],
})
export class InsightComponent implements OnInit {
  userName: any;
  userImage: any;
  userEmail: any;
  userDesignation: any;

  images = [
    'assets/images/banner/1.jpg',
    'assets/images/banner/2.jpg',
    'assets/images/banner/3.jpg',
  ];

  constructor(
    private bnIdle: BnNgIdleService,
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService,
    private hazardService: HazardService
  ) {}

  ngOnInit(): void {
    this.me();
    // this.bnIdle.startWatching(60).subscribe((isTimedOut: boolean) => {
    //   if (isTimedOut) {
    //     let timerInterval: any;
    //     Swal.fire({
    //       title: 'Are you there',
    //       text: 'We are not seeing any activity from your side. For security reasons we will logout you from the application. If need to stay, please click on anywhere on the screen.',
    //       imageUrl: 'assets/images/unable-proceed.gif',
    //       imageWidth: 250,
    //       timer: 10000,
    //       timerProgressBar: true,
    //       didOpen: () => {
    //         Swal.showLoading();
    //       },
    //       willClose: () => {
    //         clearInterval(timerInterval);
    //       },
    //     }).then((result) => {
    //       if (result.dismiss === Swal.DismissReason.timer) {
    //         //this.cookieService.deleteAll('/');
    //         // this.cookieSerjvice.deleteAll()
    //         this.sign_in();
    //       }
    //     });
    //   }
    // });
  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.userName =
          result.profile.first_name + ' ' + result.profile.last_name;
        this.userImage = result.image.image;
        this.userEmail = result.profile.email;
        this.userDesignation = result.profile.designation;

        // this.Form.controls['reporter'].setValue(result.profile.id)
        // this.Form.controls['reporterName'].setValue(result.profile.first_name + ' ' + result.profile.last_name)
        // this.Form.controls['reporterDesignation'].setValue(result.profile.designation)
        // this.get_dropdown_values()
        // this.get_divisions()
        // this.get_profiles()
        // this.get_observations()
      },
      error: (err: any) => {
        this.router.navigate(['/error/internal']);
      },
      complete: () => {},
    });
  }

  sign_in() {
    this.cookieService.deleteAll('/');
    location.reload();
  }

  // const name = "session-token"
  // document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
