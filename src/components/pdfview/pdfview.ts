import { Component } from '@angular/core';

/*
  Generated class for the Pdfview component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'pdfview',
  templateUrl: 'pdfview.html'
})
export class PdfviewComponent {

  text: string;

  constructor() {
    console.log('Hello Pdfview Component');
    this.text = 'Hello World';
  }

}
