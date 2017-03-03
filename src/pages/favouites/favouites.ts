import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, MenuController, Slides } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService, Images } from '../../providers/image-service';
import { CountryService } from '../../providers/country-service';
import { User, UserInfo, ProfileInfo, TokenInfo } from '../../providers/user'

import { Member, Members } from '../../providers/member'
import { DashboardService } from '../../providers/dashboard-service'

import { MemberListComponent } from '../../components/member-list/member-list'

/*
  Generated class for the Favouites page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-favouites',
  templateUrl: 'favouites.html',
	providers: [DashboardService]
})
export class FavouitesPage {

	loading: Loading;
	members: Array<Members> = []
	countryList = [];

	constructor(public navCtrl: NavController, public menuCtrl: MenuController, private loadingCtrl: LoadingController,
		private alertCtrl: AlertController, private user: User, private dash: DashboardService, private image: ImageService, private country: CountryService) {
		this.countryList = this.country.getCountryList();

		this.showLoading();

		this.dash.findAllFav(this.user.getToken(), this.user.getProfileId()).subscribe(data =>{
			if(data != false){
				for(let item of data){
					this.dash.getProfileData(this.user.getToken(), item.fav_profile_id, this.user.getCountry()).subscribe(data =>{
						if(data != false){
							console.log(data);
							for(let profile of data){
								this.members.push(new Members(profile.profile_id, profile.country, profile.gender, profile.allow_rating, profile.hidden, profile.visable_rating));
							}

							for(let member of this.members){
								if(member.visable_rating){
									this.dash.getAverage(this.user.getToken(), member.profile_id).subscribe(data =>{
										if(data != false){
											member.averageRating =  Math.ceil(data);
										}
									},
									error => {
										this.showError(error);
									})
								}
								if(member.allow_rating){
									this.dash.getRating(this.user.getToken(), this.user.getProfileId(), member.profile_id).subscribe(data =>{
										if(data != false){
											member.rating = data[0].rate_amount;
										}
									},
									error => {
										this.showError(error);
									})
								}
									this.dash.getFavouite(this.user.getToken(), this.user.getProfileId(), member.profile_id).subscribe(data =>{
										member.fav = data;
									},
									error => {
										this.showError(error);
									})

								if(member.countryEmjo == '' && member.countryName == ''){
									for(let countryInfo of this.countryList){
										if(member.country == countryInfo.alpha2 || member.country == countryInfo.alpha3){
											member.countryEmjo = countryInfo.emoji;
											member.countryName = countryInfo.name;
										}
									}
									this.image.downloadImages(this.user.getToken(), member.profile_id).subscribe(data =>{
											if(data != false){
												for(let image of data){
													member.images.push(new Images(image.pictureId, 'data:image/JPEG;base64,'+image.image, false))
												}
											}
											this.loading.dismiss();
									},error =>{
										this.showError(error);
									})
								}
							}
						}
					}, error =>{
						this.showError(error);
					})
				}
			}
		},error => {
			this.showError(error);
		});
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

  showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
	}

}
