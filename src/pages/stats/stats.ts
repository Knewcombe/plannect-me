import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, MenuController, Slides } from 'ionic-angular';
import { CountryService } from '../../providers/country-service';
import { AuthService } from '../../providers/auth-service';
import { User, UserInfo, ProfileInfo, TokenInfo } from '../../providers/user'
import { DashboardService } from '../../providers/dashboard-service'

/*
  Generated class for the Stats page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
	providers:[AuthService, DashboardService]
})
export class StatsPage {

	countryList = [];
	averageRating = 0;
	favAmount = 0;
	profileStatus = [];
	ratingData = [];
	loading: Loading;

	constructor(private navCtrl: NavController, private menuCtrl: MenuController, private auth: AuthService, private loadingCtrl: LoadingController,
		private alertCtrl: AlertController, private country: CountryService, private user: User, private dash: DashboardService)  {
		this.countryList = this.country.getCountryList();
		var index = 0
		// this.auth.getAllRating(this.user.getToken(), this.user.getProfileId()).subscribe(data =>{
		// 	if(data != false){
		// 		this.profileStatus = data;
		// 		for(let item of this.profileStatus){
		// 			this.dash.getProfileData(this.user.getToken(), item.profile_id, this.user.getCountry()).subscribe(data =>{
		// 				if(data != false){
		// 					item.profileData = data[0];
		// 					for(let country of this.countryList){
		// 						if(item.profileData.country == country.alpha2 || item.profileData.country == country.alpha3){
		// 							item.profileData.countryEmjo = country.emoji;
		// 							item.profileData.countryName = country.name;
		// 						}
		// 					}
		// 				}
		// 			})
		// 		}
		// 		console.log(this.profileStatus)
		// 	}
		// })
		this.dash.getAverage(this.user.getToken(), this.user.getProfileId()).subscribe(data =>{
			if(data != false){
				this.averageRating = Math.ceil(data);
			}
		})

		this.dash.getFavAmount(this.user.getToken(), this.user.getProfileId()).subscribe(data =>{
			if(data != false){
				this.favAmount = data;
			}
		})
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
  }

}
