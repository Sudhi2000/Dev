import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule,FormBuilder } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';
import {MatDialogModule} from '@angular/material/dialog';

import { AppComponent } from './app.component';

import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { InterceptorService } from './services/interceptor.service';

import { KeyboardShortcutsModule }     from 'ng-keyboard-shortcuts';  
import { PushNotificationModule } from 'ng-push-notification';
import { PowerbiComponent } from './powerbi/powerbi.component';

@NgModule({
  declarations: [
    AppComponent,
    PowerbiComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    LayoutModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    KeyboardShortcutsModule.forRoot()  ,
    PushNotificationModule.forRoot(/* Default settings here, interface PushNotificationSettings */),

    MatDialogModule,

    
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).s
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS, // https://www.npmjs.com/package/ngx-highlightjs
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
        }
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
     }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
