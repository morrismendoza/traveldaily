import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TravelDailyApp } from './app.component';
import { HomePage, LatestPage, LoginPage, MainPage, PdfviewPage, SettingsPage } from '../pages/pages';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    TravelDailyApp,
    HomePage,
    LatestPage,
    LoginPage,
    MainPage,
    PdfviewPage,
    SettingsPage,
    PdfViewerComponent
  ],
  imports: [
    IonicModule.forRoot(TravelDailyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    TravelDailyApp,
    HomePage,
    LatestPage,
    LoginPage,
    MainPage,
    PdfviewPage,
    SettingsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
