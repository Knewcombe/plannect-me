import { Component } from '@angular/core';
import { App, Platform, NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { StatusBar, Splashscreen, Keyboard } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';

import { AuthService } from '../providers/auth-service';
import { CountryService } from '../providers/country-service';
import { ImageService, Images } from '../providers/image-service';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

import { User, UserInfo, ProfileInfo, TokenInfo } from '../providers/user'

@Component({
  templateUrl: 'app.html',
	providers: [AuthService, SecureStorage, FingerprintAIO]
})

export class MyApp {
  rootPage;
  loading: Loading;
  constructor(platform: Platform, private user: User, private auth: AuthService, private image: ImageService,
    private alertCtrl: AlertController, private touchId: FingerprintAIO, private secureStorage:SecureStorage, private loadingCtrl: LoadingController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //, private touchId: TouchID, private secureStorage: SecureStorage

      StatusBar.styleDefault();
      Splashscreen.hide();
      // this.secureStorage = new SecureStorage();
      this.secureStorage.create('appData').then((storage: SecureStorageObject) => {
          storage.get('loginInfo')
          .then(
            data => {
              this.touchId.isAvailable().then(result =>{
                  this.touchId.show({
                     clientId: "Plannectme",
                     clientSecret: "password"
                 }).then(result => {
                      this.showLoading()
                      this.auth.login(JSON.parse(data), false, true).subscribe(data => {
                        if (data == true) {
                          this.loading.dismiss();
                          this.rootPage = DashboardPage;
                        }else{
                  				this.showError("Email or Password is incorrect, please try again");
                  			}
                      },
                      error => {
                        this.showError(error);
                      });
                    }).catch(err => {
                      console.log('Show error'+err);
                    });
                }).catch(err => {
                  console.log(err);
                });
            },
            error => {
              console.log('No data')
            }
          );
        },
        error => console.log(error)
      );


			var userData = null;
			var tokenData = null;
			if(window.localStorage.getItem('user') && window.localStorage.getItem('token')){
				userData = JSON.parse(window.localStorage.getItem('user'));
				tokenData = JSON.parse(window.localStorage.getItem('token'));
			}else if(window.sessionStorage.getItem('user') && window.sessionStorage.getItem('token')){
				userData = JSON.parse(window.sessionStorage.getItem('user'));
				tokenData = JSON.parse(window.sessionStorage.getItem('token'));
			}

			if(userData != null && tokenData != null){
				this.user.setTokenInfo(new TokenInfo(tokenData.tokenInfo.token, tokenData.tokenInfo.tokenRefresh));
				this.auth.getUser(this.user.getToken(), userData.user.userInfo.user_id, userData.user.userInfo.profile_id).subscribe(data => {
					this.user.setUser(new UserInfo(data.user.date_of_birth, data.user.first_name, data.user.last_name, data.user.profile_id, data.user.user_email, data.user.user_id));
					this.user.setProfile(new ProfileInfo(data.profile.allow_rating, data.profile.country, data.profile.gender, data.profile.hidden, data.profile.profile_id, data.profile.visable_rating));
					this.image.downloadImages(this.user.getToken(), this.user.getProfileId()).subscribe(data =>{
						if(data != false){
							if(data.length != 0){
								for (let image of data) {
										this.user.setImage(new Images(image.pictureId, 'data:image/JPEG;base64,'+image.image, false));
								}
							}
						}
						this.rootPage = DashboardPage;
					});
				},
        error => {
          this.rootPage = HomePage;
        });
			}else{
				this.rootPage = HomePage;
			}
    });
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

  showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
	}
}
