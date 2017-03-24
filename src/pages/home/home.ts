import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, Platform } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { CountryService } from '../../providers/country-service';

import { RegisterPage } from '../register-page/register-page';
import { AboutPage } from '../about/about';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { ForgotPassPage } from '../../pages/forgot-pass/forgot-pass';

import { User, UserInfo, ProfileInfo, TokenInfo } from '../../providers/user'

import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[AuthService, FingerprintAIO]
})
export class HomePage {
	loading: Loading;
	loginCredentials = {email: '', password: ''};
	keeploggedin = false;
  fingerPrintLogin = false;
  hasFingerLogin = false;
  constructor(platform: Platform, private navCtrl: NavController,  private loadingCtrl: LoadingController, private country:CountryService, private auth: AuthService,
    private alertCtrl: AlertController, private user: User, private touchId: FingerprintAIO) {
      platform.ready().then(() => {
      this.touchId.isAvailable().then(result =>{
          this.hasFingerLogin = true;
        }).catch(err => {
          this.hasFingerLogin = false;
        });
      });
  }

	public createAccount() {
    this.navCtrl.push(RegisterPage);
  }

	public about() {
    this.navCtrl.push(AboutPage);
  }

	public login() {
    this.showLoading()
    this.auth.login(this.loginCredentials, this.keeploggedin, this.fingerPrintLogin).subscribe(data => {
      if (data == true) {
        this.loading.dismiss();
        this.navCtrl.setRoot(DashboardPage);
      }else{
				this.showError("Email or Password is incorrect, please try again");
			}
    },
    error => {
      this.showError(error);
    });
  }

	public forgotPass(){
		this.loginCredentials.email = '';
		this.loginCredentials.password = '';
		this.keeploggedin = false;
		this.navCtrl.push(ForgotPassPage);
	}

	showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
	}

	showError(text) {
    this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });

    alert.present(prompt);
  }
}
