import { Component } from '@angular/core';
import { Nav,  NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LoginService } from '../../shared/login.service';
import { LatestPage, MainPage } from '../../pages/pages';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  username: string;
  password: string;
  result: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loginService: LoginService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private nav:Nav) { }

  ionViewDidLoad() {
  }

  login() {
    let loader = this.loadingCtrl.create({
      content: 'Logging In'
    });
    loader.present();
    this.loginService.authenticateUser(this.username, this.password)
      .subscribe(data => {
        loader.dismiss();
        if (data.result && data.result === 'success') {
          this.nav.setRoot(MainPage);
        } else {
          this.showMessage(data.error_description);
        }
      });
  }

  showMessage(message) {
    let alert = this.alertCtrl.create({
      title: 'Login',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
