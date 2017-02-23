import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PassValidator } from '../../providers/pass_validation'

import { AuthService } from '../../providers/auth-service';

/*
  Generated class for the ChangePass page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-change-pass',
  templateUrl: 'change-pass.html',
	providers: [AuthService, PassValidator]
})
export class ChangePassPage {

	loading: Loading;
	passwordForm: FormGroup;
	userId = '';
	submitAttempt = false;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private auth: AuthService, private navParams: NavParams, public formBuilder: FormBuilder) {
		this.userId = navParams.get('userId');
		console.log(this.userId);
		this.passwordForm = formBuilder.group({
			firstPass: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
			secondPass: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
		},{validator: PassValidator.areEqual});
	}

	submitNewPassword(){
		this.showLoading();
		this.auth.forgotChangePassword(this.passwordForm.controls['firstPass'].value, this.userId).subscribe(data =>{
			if(data != false){
				this.showMessage('Success', 'Password has been changed!');
				this.navCtrl.popToRoot();
			}
		})
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePassPage');
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

	showMessage(title, text){

		this.loading.dismiss();
	  let alert = this.alertCtrl.create({
	    title: title,
	    subTitle: text,
	    buttons: ['OK']
	  });
		alert.present(prompt);
	}

}
