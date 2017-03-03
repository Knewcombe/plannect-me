import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, MenuController, Slides } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService, Images } from '../../providers/image-service';
import { CountryService } from '../../providers/country-service';
import { User, UserInfo, ProfileInfo, TokenInfo } from '../../providers/user'

import { Member, Members } from '../../providers/member'
import { DashboardService } from '../../providers/dashboard-service'

import { HomePage } from '../../pages/home/home'
import { ProfilePage } from '../../pages/profile/profile';
import { FavouitesPage } from '../../pages/favouites/favouites';
import { StatsPage } from '../../pages/stats/stats';

import { MemberListComponent } from '../../components/member-list/member-list'

/*
  Generated class for the Dashboard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
	providers: [DashboardService]
})
export class DashboardPage {
  @ViewChild('memberSlider') memberSlider: Slides;
	loading: Loading;
	members: Array<Members> = []
	text: string;
	maxMember = 5;
	_currentIndex = 0;
	countryList = [];
  rangeValue = {lower:18, upper: 35};

	searchOptions = {
		country: '',
		gender: '',
		age:{
			min: 18,
			max: 35
		}
	}

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private loadingCtrl: LoadingController,
		private alertCtrl: AlertController, private user: User, private dash: DashboardService, private image: ImageService, private country: CountryService) {

		this.countryList = this.country.getCountryList();
		this.getMembers();
    this.rangeValue = {lower: this.searchOptions.age.min, upper: this.searchOptions.age.min};
	}

	getMembers(){
		this.showLoading();
		this.dash.getProfiles(this.user.getToken(), this.searchOptions, this.user.getCountry(), this.user.getProfileId()).subscribe(data => {
			if(data != false){
				if(data.profile){
					if(data.profile.length > 0){
						for(let item of data.profile){
							this.members.push(new Members(item.profile_id, item.country, item.gender, item.allow_rating, item.hidden, item.visable_rating));
						}
						for(let member of this.members){
							if(member.visable_rating){
								this.dash.getAverage(this.user.getToken(), member.profile_id).subscribe(data =>{
									if(data != false){
										member.averageRating = Math.ceil(data);
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
							if(member.images.length <= 0){
								this.image.downloadImages(this.user.getToken(), member.profile_id).subscribe(data =>{
										if(data != false){
											for(let image of data){
												member.images.push(new Images(image.pictureId, 'data:image/JPEG;base64,'+image.image, false))
											}
										}
										this.loading.dismiss();
								})
							}
							for(let countryInfo of this.countryList){
								if(member.country == countryInfo.alpha2 || member.country == countryInfo.alpha3){
									member.countryEmjo = countryInfo.emoji;
									member.countryName = countryInfo.name;
								}
							}
						}
					}else{
						this.loading.dismiss();
						this.showMessage('No Members', 'No new members are found at this time. Please pull down on the page to refresh or refine your search options');
					}
				}
			}
		},
		error => {
			this.showError(error);
		})
	}

	openMenu(){
		this.menuCtrl.enable(true, 'menuContent');
    this.menuCtrl.open('menuContent');
	}

  changeAge(){
    this.searchOptions.age.min = this.rangeValue.lower;
    this.searchOptions.age.max = this.rangeValue.upper;
  }

  search(){
		if(this.members.length > 0){
      this.members = [];
    }
		this.menuCtrl.close('searchContent');
    this.menuCtrl.enable(false, 'searchContent');
		this.memberSlider.lockSwipeToNext(false);
		this.memberSlider.slideTo(0);
    this.getMembers();
  }

	doRefresh($event){
		if(this.members.length > 0){
      this.members = [];
    }
		this.memberSlider.lockSwipeToNext(false);
		this.memberSlider.slideTo(0);
    this.getMembers();
		$event.complete();
	}

  clearSearch(){
    this.searchOptions = {
  		country: '',
  		gender: '',
  		age:{
  			min: 18,
  			max: 35
  		}
  	}
    this.rangeValue.lower = this.searchOptions.age.min;
    this.rangeValue.upper = this.searchOptions.age.max;
    this.menuCtrl.close('searchContent');
    this.menuCtrl.enable(false, 'searchContent');
  }

  openSearchMenu(){
    this.menuCtrl.enable(true, 'searchContent');
    this.menuCtrl.open('searchContent');
  }

  slideChanged(){
    if((this.memberSlider.getActiveIndex()) >= (this.members.length - 1)){
      this.memberSlider.lockSwipeToNext(true);
    }else{
      this.memberSlider.lockSwipeToNext(false);
    }
	}

	profile(){
		this.menuCtrl.close();
		this.navCtrl.push(ProfilePage)
	}

	favouites(){
		this.menuCtrl.close();
		this.navCtrl.push(FavouitesPage);
	}

	stats(){
		this.menuCtrl.close();
		this.navCtrl.push(StatsPage);
	}

	logout(){
		this.showLoading();
		if(window.localStorage.getItem('user') && window.localStorage.getItem('token')){
			window.localStorage.removeItem('user');
			window.localStorage.removeItem('token');
		}else if(window.sessionStorage.getItem('user') && window.sessionStorage.getItem('token')){
			window.sessionStorage.removeItem('user');
			window.sessionStorage.removeItem('token');
		}
		this.user.removeUser();
		this.loading.dismiss();
		this.navCtrl.setRoot(HomePage);
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
