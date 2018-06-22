import { Component, Input, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, MenuController, Slides, PopoverController, ViewController } from 'ionic-angular';

import { Members } from '../../providers/member'
import { DashboardService } from '../../providers/dashboard-service'
import { User } from '../../providers/user'

import { PopoverComponent } from '../../components/popover/popover'

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
  currentIndex = 1;
  loading: Loading;
	_member: Members;
	rating:number = 0

	@Input()
  set member(member: Members) {
    // Here you can do what you want with the variable
    this._member = member;
  }

  get member() { return this._member; }

  constructor(private dash: DashboardService, private user: User, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private popoverCtrl: PopoverController) {
    if(this.imageSlider){
      this.currentIndex = this.imageSlider._activeIndex;
      this.imageSlider.lockSwipes(true);
    }
  }

  ionSlideDrag(){
    this.imageSlider.lockSwipes(true);
    this.imageSlider.freeMode = true;
  }

  changeImage(index){
    if(this.imageSlider){
      this.imageSlider.lockSwipes(false);
      this.imageSlider.slideTo(index);
      this.currentIndex = this.imageSlider._activeIndex;
    }
  }

	favourite(profileId){
    this._member.fav = true;
    this.dash.addFav(this.user.getToken(), this.user.getProfileId(), profileId).subscribe(data =>{
      this._member.fav = data;
    }, error => {
			this.showError(error);
		})
	}

	notFavourite(profileId){
    this._member.fav = false;
    this.dash.removeFav(this.user.getToken(), this.user.getProfileId(), profileId).subscribe(data =>{
      this._member.fav = data;
    }, error => {
			this.showError(error);
		})
	}

	ratingProfile(profileId){
		this.dash.rateProfile(this.user.getToken(), this._member.rating, this.user.getProfileId(), profileId).subscribe(data =>{
    },error =>{
      this.showError(error);
    })
	}

  presentPopover(ev, profileId) {
    console.log(profileId)
    let popover = this.popoverCtrl.create(PopoverComponent, {profileId:profileId});
    popover.present({
      ev: ev
    });
  }

  reportMember(profileId){
    console.log(profileId);
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
