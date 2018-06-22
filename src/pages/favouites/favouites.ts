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
  @ViewChild('memberSlider') memberSlider: Slides;
	loading: Loading;
	members: Array<Members> = []
  _maxIndex = 5;
	_currentIndex = 0;
  _activeIndex = 0;
	countryList = [];

	constructor(public navCtrl: NavController, public menuCtrl: MenuController, private loadingCtrl: LoadingController,
		private alertCtrl: AlertController, private user: User, private dash: DashboardService, private image: ImageService, private country: CountryService) {
      this.getProfiles();
  		this.countryList = this.country.getCountryList();
	}

  getProfiles(){
    this.showLoading();
    this.dash.findAllFav(this.user.getToken(), this.user.getProfileId()).subscribe(data =>{
			if(data != false){
  			for(let item of data){
  				this.dash.getProfileData(this.user.getToken(), item.fav_profile_id, this.user.getCountry()).subscribe(data =>{
  					if(data != false){
              this.loading.dismiss();
  						for(let profile of data){
  							this.members.push(new Members(profile.profile_id, profile.country, 0, false, profile.gender, profile.allow_rating, profile.hidden, profile.visable_rating));
  						}
              this.getMembers();
  					}
  				}, error =>{
  					this.showError(error);
  				})
  			}
			}else{
        this.loading.dismiss();
        this.showMessage('No Favouites', 'You have no favouites yet, go back to the Dashboard to add a member to your favouites');
      }
		},error => {
			this.showError(error);
		});
  }

  getMembers(){
    var tempIndex = 0;
    for(let member of this.members){
      if(tempIndex == this._currentIndex && this._currentIndex <= this._maxIndex){
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
          })
        }
        for(let countryInfo of this.countryList){
          if(member.country == countryInfo.alpha2 || member.country == countryInfo.alpha3){
            member.countryEmjo = countryInfo.emoji;
            member.countryName = countryInfo.name;
          }
        }
        this._currentIndex++
      }else{
        if(tempIndex == this.members.length - 1 && this._currentIndex != this.members.length - 1){
          this._maxIndex = this._currentIndex + 5;
          if(this._currentIndex >= this.members.length - 1){
            this._maxIndex = this.members.length
          }
        }
      }
      tempIndex++
    }
	}

  previous(){
    this.memberSlider.slidePrev();
  }

  next(){
    this.memberSlider.slideNext();
  }

  slideChanged(){
    this._activeIndex = this.memberSlider.getActiveIndex();
    if((this.memberSlider.getActiveIndex()) >= (this.members.length - 1)){
      this.memberSlider.lockSwipeToNext(true);
    }else{
      this.memberSlider.lockSwipeToNext(false);
    }
    if(this.memberSlider.getActiveIndex() + 2 >= this._currentIndex){
      this.getMembers();
    }
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
