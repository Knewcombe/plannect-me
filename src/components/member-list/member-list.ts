import { Component, Input, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, MenuController, Slides } from 'ionic-angular';

import { Members } from '../../providers/member'
import { DashboardService } from '../../providers/dashboard-service'
import { User } from '../../providers/user'

/*
  Generated class for the MemberList component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'member-list',
  templateUrl: 'member-list.html'
})
export class MemberListComponent {

	@ViewChild('imageSlider') imageSlider: Slides;
  loading: Loading;
	_member: Members;
	rating:number = 0

	@Input()
  set member(member: Members) {
    // Here you can do what you want with the variable
    this._member = member;
  }

  get member() { return this._member; }

  constructor(private dash: DashboardService, private user: User, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

  }

	favourite(profileId){
    this.dash.addFav(this.user.getToken(), this.user.getProfileId(), profileId).subscribe(data =>{
      this._member.fav = data;
    }, error => {
			this.showError(error);
		})
	}

	notFavourite(profileId){
    this.dash.removeFav(this.user.getToken(), this.user.getProfileId(), profileId).subscribe(data =>{
      this._member.fav = data;
    })
	}

	ratingProfile(profileId){
		this.dash.rateProfile(this.user.getToken(), this._member.rating, this.user.getProfileId(), profileId).subscribe(data =>{
    },error =>{
      this.showError(error);
    })
	}

  showError(text) {

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
