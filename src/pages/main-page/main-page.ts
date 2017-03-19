import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LatestPage, HomePage } from '../../pages/pages';

@Component({
  selector: 'page-main-page',
  templateUrl: 'main-page.html'
})
export class MainPage {

  homeRoot: any = HomePage;
  latestRoot: any = LatestPage;

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('Active Root', this.homeRoot);
  }

}
