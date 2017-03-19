import { StyleWithImports } from '@angular/compiler/src/style_url_resolver';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-pdfview',
  templateUrl: 'pdfview.html'
})
export class PdfviewPage {

  pdfPath:string = '';
  pdfSrc:string = '';
  page: number = 1;
  samplePdf: string = 'http://heinonline.org/HeinDocs/TitlesCurrentlyAvailable.pdf';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pdfSrc = navParams.get('pdfpath');
  }

  ionViewDidLoad() {
    console.log('File path', this.pdfSrc);
  }
}
