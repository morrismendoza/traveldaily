import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LatestPage, LoginPage, MainPage, SettingsPage } from '../pages/pages';
import { RssService, LoginService } from '../shared/shared';

@Component({
  templateUrl: 'app.html',
  providers: [RssService, LoginService]
})
export class TravelDailyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LatestPage;

  constructor(public platform: Platform) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  openLatest(){
    this.nav.setRoot(LatestPage);
  }

  openHome(){
    this.nav.setRoot(MainPage);
  }

  logout(){
    this.nav.setRoot(LoginPage);
  }

  openSettings(){
    this.nav.setRoot(SettingsPage);
  }
}
