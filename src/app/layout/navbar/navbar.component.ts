import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.api.service';
import { CookieService } from 'ngx-cookie-service';
import { GeneralService } from 'src/app/services/general.api.service';
import { interval } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { environment } from 'src/environments/environment';
import { PushNotificationService } from 'ng-push-notification';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userName: string
  userEmail: string
  userImage: string
  userID: number
  status: any
  wish_icon_status: boolean = false

  wish_icon: any

  client_logo_status: boolean = false

  client_logo: any
  birthWish: boolean = false

  notification: any[] = []


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService,
    private generalService: GeneralService,
    private onlineStatusService: OnlineStatusService,
    private pushNotification: PushNotificationService,
  ) {
    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      // Retrieve Online status Type

      if (status === 1) {
        this.status = "Online";

      } else if (status === 0) {
        this.status = "Offline";
      }
    });
  }

  ngOnInit() {
    this.configuration()
    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      // Retrieve Online status Type

      if (status === 1) {
        this.status = "Online";

      } else if (status === 0) {
        this.status = "Offline";
      }
    });
  }

  configuration() {
    this.generalService.get_app_config().subscribe({
      next: (result: any) => {

        if (result.data.attributes.wish_icon) {
          this.wish_icon = environment.client_backend + '/uploads/' + result.data.attributes.wish_icon
          this.wish_icon_status = true

        }
        if (result.data.attributes.client_logo) {
          this.client_logo = environment.client_backend + '/uploads/' + result.data.attributes.client_logo
          this.client_logo_status = true
        }

      },
      error: (err: any) => {
        this.router.navigate(["/error/internal"])
      },
      complete: () => {  
        this.me()
      }
    })

  }

  me() {
    this.authService.me().subscribe({
      next: (result: any) => {
        this.userID = result.id
        this.userName = result.profile.first_name + ' ' + result.profile.last_name
        this.userEmail = result.email
        this.userImage = result.image.image

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const birthDate = new Date(result.profile?.birth_date);
        const brithYear = birthDate.getFullYear();
        const brirthMonth = String(birthDate.getMonth() + 1).padStart(2, '0');
        const birthDay = String(birthDate.getDate()).padStart(2, '0');
        const birthFormattedDate = `${brithYear}-${brirthMonth}-${birthDay}`;

        if (formattedDate === birthFormattedDate) {
          this.birthWish = true
        } else {
          this.birthWish = false
        }

      },
      error: (err: any) => {
        this.router.navigate(["error/internal"])
      },
      complete: () => {
        this.get_notification()
        // this.notificationSync()

      }
    })
  }

  get_notification() {
    this.generalService.get_notification(this.userID).subscribe({
      next: (result: any) => {
        this.notification = result.data
        // this.showPush()
      },
      error: (err: any) => {
        this.router.navigate(["error/internal"])
      },
      complete: () => { }
    })
  }


  showPush() {
    const img = "assets/icons/icon-72x72.png"
    this.notification.forEach(elem => {
      this.pushNotification.show("Chemical Management: " + elem.attributes.reference_number, { body: "A new chemical request has created and submitted for approval", requireInteraction: true });
    })
  }


  notificationSync() {
    this.notification = []
    interval(1 * 60 * 1000).pipe(mergeMap(() => this.generalService.get_notification(this.userID))).subscribe({
      next: (result: any) => {
        this.notification = result.data
        // this.showPush()
      },
      error: (err: any) => { },
      complete: () => { }
    })
  }

  read_notification(data: any) {
    const id = data.id
    this.generalService.read_notification(id).subscribe({
      next: (result: any) => { },
      error: (err: any) => {
        this.router.navigate(["error/internal"])
      },
      complete: () => {
        this.navigate(data)
      }
    })


  }

  navigate(data: any) {
    const link = data.attributes.access_link
    const refer = data.attributes.reference_number
    const accessLink = link
    this.get_notification()
    this.router.navigate([accessLink])
  }




  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout() {


    // const cookies = document.cookie.split(";");
    // for (let i = 0; i < cookies.length; i++) {
    //   const cookie = cookies[i];
    //   const eqPos = cookie.indexOf("=");
    //   const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    //   document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // }

    this.cookieService.deleteAll('/');

    // this.router.navigate(['apps/insight']);

    location.reload()

  }



}
