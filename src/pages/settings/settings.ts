import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { Transfer, SQLite } from 'ionic-native';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  storage: SQLite;
  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private platform: Platform) { }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.initialistDb();
    });
  }

  initialistDb() {
    this.storage = new SQLite();
    this.storage.openDatabase({
      name: "ionic.offline",
      location: "default"
    }).then(() => {
      console.log('Database loaded');
    });
  }

  clearPdfData() {
    this.storage.executeSql("DROP TABLE IF EXISTS FeedsData", []).then(() => {
      console.log('TABLE Feeds Data droped');
    }, (error => console.log("ERROR DROPPING FeedsData TABLE", error)));
  }

  clearNewsFeeds() {
    this.storage.executeSql("DROP TABLE IF EXISTS NewsFeeds", []).then(() => {
      console.log('TABLE DROPPED');
    }, (error => console.log("ERROR DROPPING TABLE", error)));
  }
}
