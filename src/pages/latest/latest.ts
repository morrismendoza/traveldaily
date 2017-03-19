import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RssService } from '../../shared/shared';

@Component({
  selector: 'page-latest',
  templateUrl: 'latest.html'
})
export class LatestPage {

  feeds: any = {};
  private baseFeeds = "http://www.traveldaily.com.au/appfeed/";

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private rssService: RssService) { }

  ionViewDidLoad() {
    this.rssService.getFeedContent(this.baseFeeds)
      .subscribe(data => this.loadFeeds(data));

    console.log(this.feeds);
  }

  loadFeeds(feedContent) {
    console.log("Feeds", feedContent);
    this.feeds = feedContent;
  }

}
