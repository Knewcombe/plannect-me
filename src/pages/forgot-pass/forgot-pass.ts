import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { AskQuestionPage } from '../../pages/ask-question/ask-question';

/*
  Generated class for the ForgotPass page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-forgot-pass',
  templateUrl: 'forgot-pass.html',
	providers:[AuthService]
})
export class ForgotPassPage {

	loading: Loading;
	credentials = {email: ''};
	submitAttempt = false;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private auth: AuthService) {}

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ForgotPassPage');
  // }

	submit(){
		this.submitAttempt = true;
		this.showLoading();
		this.auth.getQuestions(this.credentials).subscribe(data =>{
			if(data != false){
				this.loading.dismiss();
				this.navCtrl.push(AskQuestionPage, {
					questions: data
				});
			}else{
				this.showError('No account found using this email');
			}
		});
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
