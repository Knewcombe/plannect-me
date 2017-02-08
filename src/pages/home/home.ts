import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { RegisterPage } from '../register-page/register-page';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
	providers: [AuthService]
})
export class HomePage {
	loading: Loading;
	loginCredentials = {email: '', password: ''};
  constructor(private navCtrl: NavController,  private loadingCtrl: LoadingController, private auth: AuthService, private alertCtrl: AlertController) {
		//constructor
  }

	public createAccount() {
    this.navCtrl.push(RegisterPage);
  }

	public about() {
    this.navCtrl.push(AboutPage);
  }

	public login() {
    this.showLoading()
    this.auth.login(this.loginCredentials).subscribe(data => {
      if (data == true) {
        this.loading.dismiss();
        // this.nav.setRoot(HomePage)
      }else{
				this.showError("Access Denied");
			}
    },
    error => {
      this.showError(error);
    });
  }

	showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
	}

	showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });

    alert.present(prompt);
  }
}
