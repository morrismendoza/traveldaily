import { _appIdRandomProviderFactory } from '@angular/core/src/application_tokens';
// import { InAppBrowser } from 'ionic-native/dist/es5';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Transfer, SQLite } from 'ionic-native';

import { FeedData } from '../../model/feed-data';

import { RssService } from '../../shared/shared';
import { PdfviewPage } from '../../pages/pages';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  storage: SQLite;
  storageDirectory: string = '';
  cordova: any;
  feeds: any = [];
  dataFeeds: any = [];
  private baseFeeds = "http://archive.traveldaily.com.au/rss/traveldaily/app/";

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    private rssService: RssService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private loading: LoadingController) {

    this.platform.ready().then(() => {

      this.initialistDb();

      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
      if (!this.platform.is('cordova')) {
        return false;
      }

      if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.documentsDirectory;
      }
      else if (this.platform.is('android')) {
        this.storageDirectory = cordova.file.dataDirectory;
      }
      else {
        // exit otherwise, but you could add further types here e.g. Windows
        return false;
      }
    });
  }

  initialistDb() {
    this.storage = new SQLite();
    this.storage.openDatabase({
      name: "ionic.offline",
      location: "default"
    }).then(() => {
      this.storage.executeSql("CREATE TABLE IF NOT EXISTS NewsFeeds(guid TEXT,description TEXT,pubDate TEXT,title TEXT PRIMARY KEY,link TEXT,fileLocation TEXT)", {})
        .then((resp) => {
          this.getDocumentsDb();
        }, (error) => {
          console.log('ERROR CREATING TABLE', error);
        });

      this.storage.executeSql("CREATE TABLE IF NOT EXISTS FeedsData(title TEXT, filePath TEXT)", []).then((resp) => {
        console.log('Feeds data created successfully', resp);
      }, (error) => {
        console.log('ERROR CREATING FEEDSDATA TABLE', error);
      });
    })
      .catch(error => {
        console.log('Error opening database', error)
      });
  };

  refreshFeeds(refresher) {
    console.log('Refreshing Feeds');
    this.rssService.getaArchiveFeed(this.baseFeeds)
      .subscribe(data => {
        this.feeds = this.saveFeeds(data);
        refresher.complete();
      });
  }

  getDocumentsDb() {
    let loader = this.loading.create({
      content: 'Retrieving pdf...'
    });

    loader.present().then(() => {
      this.storage.executeSql("SELECT * FROM NewsFeeds", []).then((resp) => {
        if (resp.rows.length > 0) {
          for (var i = 0; i < resp.rows.length; i++) {
            let item = resp.rows.item(i);
            this.feeds.push({
              guid: resp.rows.item(i).guid,
              description: resp.rows.item(i).description,
              pubDate: resp.rows.item(i).pubDate,
              title: resp.rows.item(i).title,
              link: resp.rows.item(i).link,
              fileLocation: resp.rows.item(i).fileLocation
            });
          }
        } else {
          this.rssService.getaArchiveFeed(this.baseFeeds)
            .subscribe(data => {
              this.feeds = this.saveFeeds(data);
            });
        }
        loader.dismiss();
      }, (error) => {
        console.log('Error retrieving feeds', error);
        loader.dismiss();
      });
    });
  }

  getDocument(title) {
    return this.storage.executeSql("SELECT * FROM NewsFeeds where title=?", [title]);
  }

  saveFeedData(feedData) {
    let query = "INSERT OR REPLACE INTO FeedsData (title, filePath) VALUES (?, ?)";
    return this.storage.executeSql(query, [feedData.title, feedData.path]);
  }

  getDocumentDataAsync(title) {
    let __this = this;
    return new Promise(function (resolve, reject) {
      __this.storage.executeSql("SELECT * FROM FeedsData where title=?", [title]).then((data) => {
        if (data.rows.length > 0) {
          let item = data.rows.item(0);
          resolve({
            title: item.title,
            filePath: item.filePath
          });
        } else {
          resolve(null);
        }
      }, (error) => {
        console.log('Unable to find feeds data');
        reject(null);
      })
    });
  }

  saveFeeds(feeds) {
    let newFeeds = [];
    for (let feed of feeds) {
      let newFeed = {
        guid: feed.guid == null ? "" : feed.guid[0],
        description: feed.description == null ? "" : feed.description[0],
        pubDate: feed.pubDate == null ? "" : feed.pubDate[0],
        title: feed.title == null ? "" : feed.title[0],
        link: feed.link == null ? "" : feed.link[0],
        fileLocation: feed.fileLocation == null ? "" : feed.fileLocation
      };
      this.saveFeed(newFeed);
      newFeeds.push(newFeed);
    }
    return newFeeds;
  };

  saveFeed(feed) {
    console.log('Feed to add', feed);
    let query = "INSERT OR REPLACE INTO NewsFeeds (guid, description, pubDate, title, link, fileLocation) VALUES (?, ?, ?, ?, ?, ?)";
    let newFeeds = [];
    this.storage.executeSql(query, [
      feed.guid,
      feed.description,
      feed.pubDate,
      feed.title,
      feed.link,
      feed.fileLocation
    ]).then((result) => {
    }, (error) => {
      console.log("ERROR: " + JSON.stringify(error));
    });
  };

  ionViewDidLoad() {
  }

  openPdfInAppBrowser(url) {
    this.platform.ready().then(() => {
      window.open(url, '_blank','location=no,enableviewportscale=yes');
    })
  }

  download(feedTitle, fileUrl) {

    let loader = this.loading.create({
      content: 'Downloading pdf...'
    });

    let fileFound: string = '';

    loader.present().then(() => {
      this.getDocumentDataAsync(feedTitle).then((doc: FeedData) => {
        if (doc) {
          console.log('File found');
          // this.navCtrl.push(PdfviewPage, {
          //   pdfpath: doc.filePath
          // });

          //this.openInFileOpener(doc.filePath);

          this.openPdfInAppBrowser(doc.filePath);
          loader.dismiss();
        } else {
          this.getDocument(feedTitle).then((document) => {
            if (document.rows.length > 0) {
              let currDoc = document.rows.item(0);
              const fileTransfer = new Transfer();
              let filename = currDoc.link.substring(currDoc.link.lastIndexOf('/') + 1);
              if (filename) {
                let pathToSave = cordova.file.dataDirectory + filename;

                fileTransfer.download(fileUrl, pathToSave).then((entry) => {
                  this.saveFeedData({ title: feedTitle, path: entry.nativeURL }).then((result) => {
                    console.log('Saved', result);
                    loader.dismiss();
                  }, (error) => {
                    console.log('Error in saveing feeds data', error);
                    loader.dismiss();
                  });
                }, (error) => {
                  console.log('File download error', error);
                  loader.dismiss();
                });
              }
              else {
                console.log('No file available');
              }
            }
            else {
              console.log('Unable to find document data', document);
              loader.dismiss();
            }
          });
        }
      }, (error) => {
        console.log('Unable to find data', error);
        loader.dismiss();
      });
    });
  }
}
