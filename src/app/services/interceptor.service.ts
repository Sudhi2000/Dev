import { Injectable } from '@angular/core';
import { HttpHeaders, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.api.service'
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  public get authservice(): AuthService {
      return this._authservice;
  }
  public set authservice(value: AuthService) {
      this._authservice = value;
  }
  token: string;
  omitCalls = ['activation,subscription'];
  skipInterceptor = false;
  headers: HttpHeaders
  constructor(private router: Router, private _authservice: AuthService, private cookieService: CookieService,) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get("skip")) {
      const skipIntercept = req.headers.has('skip');
      if (skipIntercept) {
        req = req.clone({
          headers: req.headers.delete('skip')
        });
      }
    } else {

      //get token
      const JWTtoken = this.cookieService.get(environment.token)
      const token = environment.publicSurveyToken
      if(JWTtoken){
        this.token = JWTtoken

        const tokenizedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.token) });
        return next.handle(tokenizedReq).pipe(map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (event.status === 401) {
            // this.authservice.isLoggedIn();
            this.router.navigateByUrl('/');
            }
          }
          return event;
        }));

      }else   if(token){
        this.token = token

        const tokenizedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.token) });
        return next.handle(tokenizedReq).pipe(map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (event.status === 401) {
            // this.authservice.isLoggedIn();
            this.router.navigateByUrl('/');
            }
          }
          return event;
        }));

      }
      else{
        this.router.navigateByUrl('/');

      }









      // const allcookies = document.cookie.split(';');
      // const tempTo = this.cookieService.get(environment.token)
      // console.log(tempTo)
      // const name = environment.token
      // for (var i = 0; i < allcookies.length; i++) {
      //   var cookiePair = allcookies[i].split("=");
      //   if (name == cookiePair[0].trim()) {
      //     const tokenTemp = decodeURIComponent(cookiePair[1])
      //     const decodedToken = JSON.parse(atob(tokenTemp.split('.')[1]));
      //     const expirationDate = new Date(decodedToken.exp * 1000);
      //     if(expirationDate < new Date() ){
      //       console.log('expired')
      //     }else{
      //       console.log('not expired')
      //       this.token = tokenTemp

      //     }




      //     // this.token = decodeURIComponent(cookiePair[1])
      //     // if (!isTokenExpired(this.token)) {
      //     //   this.token = this.token;
      //     // } else {
      //     //   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      //     // }



      //   }
      // }
      
    }
    return next.handle(req);
  }

 

}

// function isTokenExpired(token: string): boolean {
//   console.log(token)
//   try {
//     const decodedToken = JSON.parse(atob(token.split('.')[1]));
    
//     const expirationDate = new Date(decodedToken.exp * 1000); // Expiration date in seconds
//     return expirationDate <= new Date(); // Return true if token is expired
//   } catch (error) {
//     console.error('Error decoding token:', error);
//     return true; // Return true to treat the token as expired in case of error
//   }
// }
