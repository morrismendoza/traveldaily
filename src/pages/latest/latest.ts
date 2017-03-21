import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

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
    private rssService: RssService,
    private loading: LoadingController) { }

  ionViewDidLoad() {
    let loader = this.loading.create({
      content: 'Loading Latest News...',
      duration: 10000
    });

    loader.present().then(() => {
      this.rssService.getFeedContent(this.baseFeeds)
        .subscribe(data => {
          this.bindFeeds(data);
          loader.dismiss();
        });
    }, (error) => {
      console.log('Error retrieving latest news', error);
      loader.dismiss();
    });
  }

  bindFeeds(feedContent) {
    this.feeds = feedContent;
  }

  refreshLatest(refresher) {
    this.rssService.getFeedContent(this.baseFeeds)
      .subscribe(data => {
        this.bindFeeds(data);
        refresher.complete();
      });
  }
}
